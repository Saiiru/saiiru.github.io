import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,dirname,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const port=Number(process.env.PORT||4173);
const configured=Boolean(process.env.LLM_BASE_URL&&process.env.LLM_API_KEY&&process.env.LLM_MODEL);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.md':'text/markdown; charset=utf-8','.json':'application/json; charset=utf-8'};
function send(res,status,data,type='application/json; charset=utf-8'){res.writeHead(status,{'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(typeof data==='string'?data:JSON.stringify(data));}
function localOrigin(origin){if(!origin)return true;try{const u=new URL(origin);return u.protocol==='http:'&&['127.0.0.1','localhost'].includes(u.hostname)&&u.port===String(port);}catch{return false;}}
async function readBody(req){let text='';for await(const chunk of req){text+=chunk;if(text.length>16_000)throw new Error('Entrada acima do limite de 16 KB.');}return JSON.parse(text);}
async function chat(req,res){
  if(!configured){send(res,503,{error:'LLM local não configurado. Defina LLM_BASE_URL, LLM_API_KEY e LLM_MODEL no ambiente.'});return;}
  let body;try{body=await readBody(req);}catch(e){send(res,400,{error:e.message});return;}
  if(typeof body.system!=='string'||typeof body.user!=='string'||body.system.length>4_000||body.user.length>10_000){send(res,400,{error:'Campos system/user inválidos ou longos demais.'});return;}
  try{
    const endpoint=new URL(`${process.env.LLM_BASE_URL.replace(/\/$/,'')}/chat/completions`);
    if(!['http:','https:'].includes(endpoint.protocol))throw Error('LLM_BASE_URL deve usar HTTP(S).');
    const upstream=await fetch(endpoint,{method:'POST',signal:AbortSignal.timeout(15_000),headers:{'Authorization':`Bearer ${process.env.LLM_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.LLM_MODEL,messages:[{role:'system',content:body.system},{role:'user',content:body.user}],temperature:0,max_tokens:600})});
    if(!upstream.ok){send(res,502,{error:`Servidor LLM respondeu HTTP ${upstream.status}.`});return;}
    const payload=await upstream.json();const answer=payload?.choices?.[0]?.message?.content;
    if(typeof answer!=='string'||!answer.trim()){send(res,502,{error:'Resposta LLM vazia ou incompatível.'});return;}
    send(res,200,{text:answer.slice(0,12_000)});
  }catch(e){send(res,502,{error:e.name==='TimeoutError'?'Tempo esgotado ao consultar LLM local.':`Falha ao consultar LLM local: ${e.message}`});}
}
const server=http.createServer(async(req,res)=>{
  const url=new URL(req.url||'/',`http://127.0.0.1:${port}`);
  if(url.pathname.startsWith('/api/')){
    if(!localOrigin(req.headers.origin)){send(res,403,{error:'Origem não permitida.'});return;}
    if(url.pathname==='/api/status'&&req.method==='GET'){send(res,200,{configured});return;}
    if(url.pathname==='/api/chat'&&req.method==='POST'){await chat(req,res);return;}
    send(res,404,{error:'Rota inexistente.'});return;
  }
  if(req.method!=='GET'&&req.method!=='HEAD'){send(res,405,{error:'Método não permitido.'});return;}
  let pathname;try{pathname=decodeURIComponent(url.pathname);}catch{send(res,400,{error:'Caminho inválido.'});return;}
  if(pathname==='/'||pathname.endsWith('/'))pathname+='index.html';
  const file=resolve(root,`.${pathname}`);
  if(!file.startsWith(root+sep)||file.includes(`${sep}.env`)||file.includes(`${sep}.git`)){send(res,403,{error:'Acesso negado.'});return;}
  try{const info=await stat(file);if(!info.isFile())throw Error('not file');const data=await readFile(file);res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Content-Length':data.length,'X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:data);}catch{send(res,404,{error:'Arquivo não encontrado.'});}
});
server.listen(port,'127.0.0.1',()=>console.log(`BLACKSITE Labs em http://127.0.0.1:${port}/ · ${configured?'LLM configurado':'modo offline'}`));
