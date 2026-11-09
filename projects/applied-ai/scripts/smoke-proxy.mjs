import http from 'node:http';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {once} from 'node:events';

let seen;
const mock=http.createServer(async(req,res)=>{
  let body='';for await(const chunk of req)body+=chunk;
  seen={path:req.url,authorization:req.headers.authorization,body:JSON.parse(body)};
  res.writeHead(200,{'Content-Type':'application/json'});
  res.end(JSON.stringify({choices:[{message:{content:'Resposta sintética do servidor compatível.'}}]}));
});
mock.listen(0,'127.0.0.1');await once(mock,'listening');
const upstreamPort=mock.address().port;
const proxyPort=4198;
const child=spawn(process.execPath,['server/ai-proxy.mjs'],{cwd:new URL('../',import.meta.url),env:{...process.env,PORT:String(proxyPort),LLM_BASE_URL:`http://127.0.0.1:${upstreamPort}/v1`,LLM_API_KEY:'test-key-only',LLM_MODEL:'synthetic-model'},stdio:'ignore'});
const base=`http://127.0.0.1:${proxyPort}`;
try{
  let ready=false;for(let i=0;i<40;i++){try{const r=await fetch(`${base}/api/status`);if(r.ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,50));}
  assert.ok(ready,'proxy local iniciou');
  const status=await (await fetch(`${base}/api/status`)).json();assert.equal(status.configured,true);
  const response=await fetch(`${base}/api/chat`,{method:'POST',headers:{'Content-Type':'application/json',Origin:base},body:JSON.stringify({system:'Teste',user:'Olá'})});
  assert.equal(response.status,200);assert.equal((await response.json()).text,'Resposta sintética do servidor compatível.');
  assert.equal(seen.path,'/v1/chat/completions');assert.equal(seen.authorization,'Bearer test-key-only');assert.equal(seen.body.model,'synthetic-model');
  const blocked=await fetch(`${base}/api/chat`,{method:'POST',headers:{Origin:'https://example.com','Content-Type':'application/json'},body:'{}'});assert.equal(blocked.status,403);
  const capped=await fetch(`${base}/api/chat`,{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify({system:'s',user:'a'.repeat(10001)})});assert.equal(capped.status,400);
  console.log('PROXY SMOKE OK: chamada OpenAI compatível, CORS local e limite de entrada');
}finally{child.kill();mock.close();}
