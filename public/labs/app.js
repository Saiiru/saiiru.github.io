import {evalCases,defaultInstruction,evaluateSuite} from './core/evalforge.mjs';
import {tickets,routeTicket,benchmarkTickets,createReview,approveReview,exportApproved} from './core/opspilot.mjs';
import {corpusPaths,chunkDocuments,retrieve,groundedAnswer} from './core/doctrace.mjs';

const $=id=>document.getElementById(id);
const state={overrides:{},review:null,passages:[],docs:[],search:[],llm:false};
const pct=n=>`${(n*100).toFixed(1)}%`;
function el(tag,cls,text){const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;}
function download(name,data){const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const link=el('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function setStatus(id,message){ $(id).textContent=message; }
function metric(label,value){const box=el('div','metric');box.append(el('strong','',String(value)),el('span','',label));return box;}
async function callLLM(system,user){
  const response=await fetch('./api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({system,user})});
  const data=await response.json();if(!response.ok)throw new Error(data.error||'Falha no proxy local');return data.text;
}
async function checkLLM(){try{const r=await fetch('./api/status',{signal:AbortSignal.timeout(1500)});const d=await r.json();state.llm=Boolean(d.configured);if(state.llm)$('mode').textContent='LLM local configurado · offline disponível';}catch{/* static hosting: deterministic features still work */}}

function selectTab(lab,focus=false){
  if(!['evalforge','opspilot','doctrace'].includes(lab))lab='evalforge';
  for(const key of ['evalforge','opspilot','doctrace']){const active=key===lab;const tab=$(`tab-${key}`);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;$(`panel-${key}`).hidden=!active;}
  history.replaceState(null,'',`${location.pathname}?lab=${lab}`);
  if(focus)$(`tab-${lab}`).focus();
}
document.querySelectorAll('[role=tab]').forEach((tab,i,tabs)=>{
  tab.addEventListener('click',()=>selectTab(tab.dataset.lab));
  tab.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;selectTab(tabs[next].dataset.lab,true);});
});
selectTab(new URLSearchParams(location.search).get('lab'));

function renderEval(){
  const suite=evaluateSuite(evalCases,state.overrides);const metrics=$('ef-metrics');metrics.replaceChildren(metric('CASOS',suite.total),metric('PASSARAM',suite.passed),metric('TAXA',pct(suite.rate)));
  const list=$('ef-results');list.replaceChildren();
  for(const result of suite.results){const row=el('div',`result ${result.passed?'':'fail'}`);row.append(el('strong','',`${result.id} · ${result.passed?'PASSOU':'FALHOU'}`),el('p','',result.reasons.join(' · ')));list.append(row);}
  return suite;
}
for(const c of evalCases){const option=el('option','',`${c.id} · ${c.task}`);option.value=c.id;$('ef-case').append(option);}
$('ef-prompt').value=defaultInstruction;
function loadEval(){const c=evalCases.find(x=>x.id===$('ef-case').value);$('ef-task').textContent=c.task;const a=c.assertions;$('ef-assertions').textContent=`Asserções: ${a.required?.length?`exige ${a.required.join(', ')}; `:''}${a.forbidden?.length?`proíbe ${a.forbidden.join(', ')}; `:''}${a.json?`JSON objeto com ${a.jsonKeys.join(', ')}; `:''}até ${a.maxChars} caracteres.`;$('ef-response').value=state.overrides[c.id]??c.response;}
$('ef-case').addEventListener('change',loadEval);
$('ef-response').addEventListener('input',()=>{state.overrides[$('ef-case').value]=$('ef-response').value;renderEval();});
$('ef-run').addEventListener('click',()=>{const s=renderEval();setStatus('ef-status',`${s.passed} de ${s.total} casos passaram na execução atual.`);});
$('ef-export').addEventListener('click',()=>download('evalforge-report.json',{mode:'deterministic-offline',instruction:$('ef-prompt').value,cases:evalCases.map(c=>({id:c.id,task:c.task,assertions:c.assertions,response:state.overrides[c.id]??c.response})),summary:renderEval()}));
$('ef-llm').addEventListener('click',async()=>{const c=evalCases.find(x=>x.id===$('ef-case').value);setStatus('ef-status','Consultando LLM local...');try{const answer=await callLLM($('ef-prompt').value,`Caso ${c.id}: ${c.task}`);state.overrides[c.id]=answer;$('ef-response').value=answer;const s=renderEval();setStatus('ef-status',`Resposta do LLM local avaliada pelas mesmas asserções. ${s.passed}/${s.total} casos passaram.`);}catch(e){setStatus('ef-status',e.message);}});
loadEval();renderEval();

const benchmark=benchmarkTickets();
for(const t of tickets){const option=el('option','',`${t.id} · ${t.team} / ${t.severity}`);option.value=t.id;$('op-case').append(option);}
function loadTicket(){const t=tickets.find(x=>x.id===$('op-case').value);$('op-text').value=t.text;routeCurrent();}
function renderPrediction(pred,source='Regra determinística'){$('op-prediction').textContent=`${source}\nEquipe: ${pred.team}\nPrioridade: ${pred.severity}\n${pred.reason||''}`;}
function routeCurrent(){state.review=createReview($('op-text').value);renderPrediction(state.review.prediction);$('op-export').disabled=true;setStatus('op-status','Classificação pronta para revisão humana.');}
$('op-case').addEventListener('change',loadTicket);
$('op-text').addEventListener('input',()=>{state.review=null;$('op-export').disabled=true;$('op-prediction').textContent='Texto alterado. Classifique novamente para revisar.';setStatus('op-status','A aprovação anterior foi invalidada pela edição.');});
$('op-route').addEventListener('click',routeCurrent);
$('op-llm').addEventListener('click',async()=>{setStatus('op-status','Consultando LLM local...');try{const answer=await callLLM('Você sugere triagem de tickets fictícios. Responda APENAS JSON com team (Entrega, Estornos, Pagamentos, Acesso ou Revisão manual), severity (Alta, Média ou Indefinida) e reason. Não execute ações.', $('op-text').value);
  const parsed=JSON.parse(answer.replace(/^```(?:json)?\s*|\s*```$/g,''));if(!['Entrega','Estornos','Pagamentos','Acesso','Revisão manual'].includes(parsed.team)||!['Alta','Média','Indefinida'].includes(parsed.severity)||typeof parsed.reason!=='string')throw new Error('Resposta do LLM fora do formato esperado.');
  state.review=createReview($('op-text').value,{team:parsed.team,severity:parsed.severity,reason:parsed.reason,covered:parsed.team!=='Revisão manual',source:'llm-unverified'});$('op-export').disabled=true;renderPrediction(state.review.prediction,'Sugestão LLM não verificada');setStatus('op-status','Revise a sugestão antes da aprovação humana.');}catch(e){setStatus('op-status',e.message);}});
$('op-approve').addEventListener('click',()=>{if(!state.review){setStatus('op-status','Classifique o texto atual antes de aprovar.');return;}state.review=approveReview(state.review);$('op-export').disabled=false;setStatus('op-status','Caso aprovado por ação humana nesta sessão.');});
$('op-export').addEventListener('click',()=>{try{download('opspilot-approved.json',exportApproved(state.review));setStatus('op-status','JSON aprovado exportado localmente.');}catch(e){setStatus('op-status',e.message);}});
$('op-metrics').replaceChildren(metric('TICKETS',benchmark.total),metric('COBERTURA',pct(benchmark.coverage)),metric('ACURÁCIA',pct(benchmark.accuracy)));
for(const o of benchmark.outcomes){const row=el('div',`result ${o.prediction.team===o.expectedTeam&&o.prediction.severity===o.expectedSeverity?'':'fail'}`);row.append(el('strong','',`${o.id} · ${o.prediction.team} / ${o.prediction.severity}`),el('p','',`Rótulo esperado: ${o.expectedTeam} / ${o.expectedSeverity}`));$('op-results').append(row);}
loadTicket();

async function loadCorpus(){const docs=[];for(const path of corpusPaths){try{const r=await fetch(`./${path}`);if(!r.ok)throw Error(`HTTP ${r.status}`);docs.push({path,text:await r.text()});}catch{setStatus('dt-status','Não foi possível carregar o corpus. Rode npm run serve para usar os arquivos locais.');}}
  state.docs=docs;state.passages=chunkDocuments(docs);if(docs.length===corpusPaths.length){setStatus('dt-status',`${docs.length} documentos locais indexados no navegador.`);searchDocs();}}
function searchDocs(){state.search=retrieve($('dt-query').value,state.passages,3);$('dt-answer').textContent=groundedAnswer(state.search);$('dt-llm-answer').hidden=true;$('dt-count').textContent=`${state.search.length} passagens com correspondência entre ${state.passages.length} indexadas.`;const list=$('dt-results');list.replaceChildren();for(const p of state.search){const row=el('div','result');row.append(el('strong','',`[${p.id}] ${p.heading}`),el('p','',p.text),el('code','',`${p.path} · BM25 ${p.score.toFixed(3)} · ${p.matched}/${p.queryTerms} termos da consulta`));list.append(row);}}
$('dt-search').addEventListener('click',searchDocs);$('dt-query').addEventListener('keydown',e=>{if(e.key==='Enter')searchDocs();});
$('dt-files').addEventListener('change',async e=>{const files=[...e.target.files].filter(f=>f.name.toLowerCase().endsWith('.md')&&f.size<=100_000).slice(0,20);if(!files.length){setStatus('dt-status','Escolha arquivos .md de até 100 KB (máximo 20).');return;}const docs=await Promise.all(files.map(async f=>({path:`local/${f.name}`,text:await f.text()})));state.docs=docs;state.passages=chunkDocuments(docs);$('dt-llm').disabled=true;$('dt-llm').title='Arquivos próprios permanecem somente no navegador';setStatus('dt-status',`${docs.length} arquivo(s) indexado(s) somente no navegador. Consulta LLM desativada para arquivos próprios.`);searchDocs();});
$('dt-llm').addEventListener('click',async()=>{searchDocs();if(!state.search.length){setStatus('dt-status','Sem evidência; consulta ao LLM não enviada.');return;}setStatus('dt-status','Consultando LLM local com as passagens exibidas...');try{const context=state.search.map(p=>`[${p.id}] ${p.path}\n${p.text}`).join('\n\n');const answer=await callLLM('Responda somente com base nas passagens fornecidas. Cite o ID [Sxx] de cada afirmação. Se não houver evidência, diga que não sabe. Não invente.',`Pergunta: ${$('dt-query').value}\n\nFontes:\n${context}`);$('dt-llm-answer').hidden=false;$('dt-llm-answer').textContent=`LLM local · resposta não verificada\n${answer}`;setStatus('dt-status','Confira cada afirmação do LLM nas passagens exibidas.');}catch(e){setStatus('dt-status',e.message);}});
loadCorpus();checkLLM();
