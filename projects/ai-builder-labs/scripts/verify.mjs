import {readFile,stat} from 'node:fs/promises';
import {resolve} from 'node:path';
import {evalCases,evaluateSuite} from '../core/evalforge.mjs';
import {tickets,benchmarkTickets} from '../core/opspilot.mjs';
import {corpusPaths,chunkDocuments,retrieve} from '../core/doctrace.mjs';

const root=resolve(import.meta.dirname,'..');
const required=['index.html','style.css','app.js','package.json','.env.example','.gitignore','README.md','BENCHMARK.md','server/ai-proxy.mjs','core/evalforge.mjs','core/opspilot.mjs','core/doctrace.mjs','integrations/n8n/opspilot.json',...corpusPaths];
const fail=[];
for(const path of required){try{const s=await stat(resolve(root,path));if(!s.isFile()||!s.size)fail.push(`${path}: vazio`);}catch{fail.push(`${path}: ausente`);}}
if(fail.length){console.error(fail.map(x=>`FALHA: ${x}`).join('\n'));process.exit(1);}
const html=await readFile(resolve(root,'index.html'),'utf8');
const app=await readFile(resolve(root,'app.js'),'utf8');
const packageJson=JSON.parse(await readFile(resolve(root,'package.json'),'utf8'));
for(const script of ['test','serve','serve:ai'])if(!packageJson.scripts?.[script])fail.push(`package.json: script ${script} ausente`);
if(/<script[^>]+src=["']https?:/i.test(html))fail.push('index.html carrega script externo');
for(const lab of ['evalforge','opspilot','doctrace']){if(!html.includes(`panel-${lab}`)||!app.includes(`./core/${lab}.mjs`))fail.push(`${lab}: painel ou import ausente`);}
const testFiles=['tests/evalforge.test.mjs','tests/opspilot.test.mjs','tests/doctrace.test.mjs'];
let testCount=0;for(const path of testFiles){try{const code=await readFile(resolve(root,path),'utf8');const count=[...code.matchAll(/^test\s*\(/gm)].length;testCount+=count;if(count<3)fail.push(`${path}: menos de 3 testes`);}catch{fail.push(`${path}: ausente`);}}
if(testCount<12)fail.push(`somente ${testCount} testes`);
const suite=evaluateSuite();const bench=benchmarkTickets();
if(evalCases.length<6||tickets.length<12||corpusPaths.length<6)fail.push('base sintética abaixo do mínimo');
const docs=await Promise.all(corpusPaths.map(async path=>({path,text:await readFile(resolve(root,path),'utf8')})));
const passages=chunkDocuments(docs);if(passages.length<6||!retrieve('cobrança duplicada',passages).length)fail.push('índice Markdown sem recuperação funcional');
const workflow=JSON.parse(await readFile(resolve(root,'integrations/n8n/opspilot.json'),'utf8'));
const types=workflow.nodes.map(n=>n.type);
for(const type of ['n8n-nodes-base.webhook','n8n-nodes-base.code','n8n-nodes-base.respondToWebhook'])if(!types.includes(type))fail.push(`n8n: ${type} ausente`);
if(workflow.active!==false||workflow.nodes.length!==3)fail.push('n8n: blueprint inesperado');
const benchmark=await readFile(resolve(root,'BENCHMARK.md'),'utf8');
for(const expected of [`${suite.passed}/${suite.total}`,`${bench.correct}/${bench.covered}`,`${bench.covered}/${bench.total}`,`${passages.length} passagens`])if(!benchmark.includes(expected))fail.push(`BENCHMARK.md não contém ${expected}`);
console.log(`Arquivos verificados: ${required.length}; testes declarados: ${testCount}; documentos: ${docs.length}; passagens: ${passages.length}`);
console.log(`EvalForge ${suite.passed}/${suite.total}; OpsPilot acertos ${bench.correct}/${bench.covered}, cobertura ${bench.covered}/${bench.total}`);
if(fail.length){console.error(fail.map(x=>`FALHA: ${x}`).join('\n'));process.exitCode=1;}else console.log('VERIFY OK');
