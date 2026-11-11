import {createRequestGate} from './core/request-gate.mjs';
import {evalCases,defaultInstruction,evaluateSuite,formatObsidianNote,compareRuns} from './core/crivo.mjs';
import {tickets,routeTicket,benchmarkTickets,createReview,approveReview,exportApproved} from './core/vetor.mjs';
import {routeWithModel} from './core/vetor-ml.mjs';
import {corpusPaths,chunkDocuments,retrieve,groundedAnswer,benchmarkRetrieval} from './core/lastro.mjs';
import {routeKoraRequest} from './core/kora-router.mjs';
import {selectKoraRoute} from './core/kora-ml.mjs';
import {summarizeFinance,listEvents} from './core/kora-workspace.mjs';

import {runKoraAssistantDemo} from './core/kora-assistant-demo.mjs';

const $=id=>document.getElementById(id);
const state={overrides:{},review:null,passages:[],docs:[],search:[],llm:false,model:null,mlReport:null,baseline:{},routeRegistry:null,koraModel:null,koraReport:null,koraFinance:null,koraEvents:null};
const efGate=createRequestGate(),opGate=createRequestGate(),dtGate=createRequestGate(),corpusGate=createRequestGate();
const pct=n=>`${(n*100).toFixed(1)}%`;
function el(tag,cls,text){const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;}
function downloadText(name,content,type='text/plain'){const url=URL.createObjectURL(new Blob([content],{type}));const link=el('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function download(name,data){const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const link=el('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function setStatus(id,message){ $(id).textContent=message; }
function metric(label,value){const box=el('div','metric');box.append(el('strong','',String(value)),el('span','',label));return box;}
async function callLLM(system,user){
  const response=await fetch('./api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({system,user})});
  const data=await response.json();if(!response.ok)throw new Error(data.error||'Falha no proxy local');return data.text;
}
async function checkLLM(){if(!['localhost','127.0.0.1'].includes(location.hostname)||location.port!=='4173')return;try{const r=await fetch('./api/status',{signal:AbortSignal.timeout(1500)});const d=await r.json();state.llm=Boolean(d.configured);if(state.llm){$('mode').textContent='Proxy LLM local configurado · ML disponível';for(const id of ['ef-llm','op-llm','dt-llm'])$(id).hidden=false;}}catch{/* static hosting: deterministic features still work */}}

function selectTab(lab,focus=false){
  lab=({evalforge:'crivo',opspilot:'vetor',doctrace:'lastro'})[lab]||lab;
  if(!['crivo','vetor','lastro','rota'].includes(lab))lab='crivo';
  for(const key of ['crivo','vetor','lastro','rota']){const active=key===lab;const tab=$(`tab-${key}`);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;$(`panel-${key}`).hidden=!active;}
  history.replaceState(null,'',`${location.pathname}?lab=${lab}`);
  if(focus)$(`tab-${lab}`).focus();
}
document.querySelectorAll('[role=tab]').forEach((tab,i,tabs)=>{
  tab.addEventListener('click',()=>selectTab(tab.dataset.lab));
  tab.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;selectTab(tabs[next].dataset.lab,true);});
});
selectTab(new URLSearchParams(location.search).get('lab'));

function renderEval(){
  const suite=evaluateSuite(evalCases,state.overrides);const comparison=compareRuns(evalCases,state.baseline,state.overrides);$('ef-comparison').textContent=`Comparação com referência: ${comparison.regressions.length} regressão(ões), ${comparison.improvements.length} melhoria(s).`;const metrics=$('ef-metrics');metrics.replaceChildren(metric('CASOS',suite.total),metric('PASSARAM',suite.passed),metric('TAXA',pct(suite.rate)));
  const list=$('ef-results');list.replaceChildren();
  for(const result of suite.results){const row=el('div',`result ${result.passed?'':'fail'}`);row.append(el('strong','',`${result.id} · ${result.passed?'PASSOU':'FALHOU'}`),el('p','',result.reasons.join(' · ')));list.append(row);}
  return suite;
}
for(const c of evalCases){const option=el('option','',`${c.id} · ${c.task}`);option.value=c.id;$('ef-case').append(option);}
$('ef-prompt').value=defaultInstruction;
function loadEval(){efGate.invalidate();const c=evalCases.find(x=>x.id===$('ef-case').value);$('ef-task').textContent=c.task;const a=c.assertions;$('ef-assertions').textContent=`Asserções: ${a.required?.length?`exige ${a.required.join(', ')}; `:''}${a.forbidden?.length?`proíbe ${a.forbidden.join(', ')}; `:''}${a.json?`JSON objeto com ${a.jsonKeys.join(', ')}; `:''}até ${a.maxChars} caracteres.`;$('ef-response').value=state.overrides[c.id]??c.response;}
$('ef-case').addEventListener('change',loadEval);
$('ef-prompt').addEventListener('input',()=>efGate.invalidate());
$('ef-response').addEventListener('input',()=>{efGate.invalidate();state.overrides[$('ef-case').value]=$('ef-response').value;renderEval();});
$('ef-baseline').addEventListener('click',()=>{state.baseline={...state.overrides};renderEval();setStatus('ef-status','Referência salva nesta sessão. Edite uma resposta para comparar.');});
$('ef-run').addEventListener('click',()=>{const s=renderEval();setStatus('ef-status',`${s.passed} de ${s.total} casos passaram na execução atual.`);});
$('ef-export').addEventListener('click',()=>download('crivo-report.json',{mode:'deterministic-offline',instruction:$('ef-prompt').value,cases:evalCases.map(c=>({id:c.id,task:c.task,assertions:c.assertions,response:state.overrides[c.id]??c.response})),summary:renderEval(),comparison:compareRuns(evalCases,state.baseline,state.overrides)}));
$('ef-note').addEventListener('click',()=>{downloadText('crivo-experimento.md',formatObsidianNote({instruction:$('ef-prompt').value,overrides:state.overrides}),'text/markdown');setStatus('ef-status','Nota Markdown baixada. Revise a interpretação antes de colocá-la no Obsidian.');});
$('ef-llm').addEventListener('click',async()=>{const token=efGate.begin();const c=evalCases.find(x=>x.id===$('ef-case').value);setStatus('ef-status','Consultando LLM local...');try{const answer=await callLLM($('ef-prompt').value,`Caso ${c.id}: ${c.task}`);if(!efGate.current(token))return;state.overrides[c.id]=answer;$('ef-response').value=answer;const s=renderEval();setStatus('ef-status',`Resposta do LLM local avaliada pelas mesmas asserções. ${s.passed}/${s.total} casos passaram.`);}catch(e){if(efGate.current(token))setStatus('ef-status',e.message);}});
loadEval();renderEval();

const benchmark=benchmarkTickets();
for(const t of tickets){const option=el('option','',`${t.id} · ${t.team} / ${t.severity}`);option.value=t.id;$('op-case').append(option);}
function loadTicket(){const t=tickets.find(x=>x.id===$('op-case').value);$('op-text').value=t.text;routeCurrent();}
function renderPrediction(pred,source='Vetor · modelo supervisionado'){$('op-prediction').textContent=`${source}\nEquipe: ${pred.team}\nPrioridade: ${pred.severity}\n${pred.reason||''}`;}
function routeCurrent(){opGate.invalidate();if(!state.model){setStatus('op-status','O modelo ainda não foi carregado.');return;}
  const text=$('op-text').value;let prediction;try{prediction=routeWithModel(text,state.model);}catch(e){setStatus('op-status',e.message);return;}state.review=createReview(text,prediction);renderPrediction(prediction);$('op-baseline').textContent=`Baseline de regras: ${routeTicket(text).team} / ${routeTicket(text).severity}. Modelo: ${prediction.covered?prediction.team:'revisão manual'}. Sinais: ${prediction.features.map(f=>f.term).join(', ')||'nenhum termo conhecido'}.`;$('op-export').disabled=true;setStatus('op-status','Classificação pronta para revisão humana.');}
$('op-case').addEventListener('change',loadTicket);
$('op-text').addEventListener('input',()=>{opGate.invalidate();state.review=null;$('op-export').disabled=true;$('op-prediction').textContent='Texto alterado. Classifique novamente para revisar.';setStatus('op-status','A aprovação anterior foi invalidada pela edição.');});
$('op-route').addEventListener('click',routeCurrent);
$('op-llm').addEventListener('click',async()=>{const token=opGate.begin();const requestedText=$('op-text').value;state.review=null;$('op-export').disabled=true;setStatus('op-status','Consultando LLM local...');try{const answer=await callLLM('Você sugere triagem de tickets fictícios. Responda APENAS JSON com team (Entrega, Estornos, Pagamentos, Acesso ou Revisão manual), severity (Alta, Média ou Indefinida) e reason. Não execute ações.', requestedText);
  if(!opGate.current(token))return;
  const parsed=JSON.parse(answer.replace(/^```(?:json)?\s*|\s*```$/g,''));if(!['Entrega','Estornos','Pagamentos','Acesso','Revisão manual'].includes(parsed.team)||!['Alta','Média','Indefinida'].includes(parsed.severity)||typeof parsed.reason!=='string')throw new Error('Resposta do LLM fora do formato esperado.');
  state.review=createReview(requestedText,{team:parsed.team,severity:parsed.severity,reason:parsed.reason,covered:parsed.team!=='Revisão manual',source:'llm-unverified'});$('op-export').disabled=true;renderPrediction(state.review.prediction,'Sugestão LLM não verificada');setStatus('op-status','Revise a sugestão antes da aprovação humana.');}catch(e){if(opGate.current(token))setStatus('op-status',e.message);}});
$('op-approve').addEventListener('click',()=>{if(!state.review){setStatus('op-status','Classifique o texto atual antes de aprovar.');return;}state.review=approveReview(state.review);$('op-export').disabled=false;setStatus('op-status','Caso aprovado por ação humana nesta sessão.');});
$('op-export').addEventListener('click',()=>{try{download('vetor-approved.json',exportApproved(state.review));setStatus('op-status','JSON aprovado exportado localmente.');}catch(e){if(opGate.current(token))setStatus('op-status',e.message);}});
async function loadModel(){
 try{
  const responses=await Promise.all([fetch('./models/vetor.json'),fetch('./reports/vetor.json')]);
  if(responses.some(r=>!r.ok))throw new Error('Modelo ou relatório não encontrado.');
  [state.model,state.mlReport]=await Promise.all(responses.map(r=>r.json()));
  const report=state.mlReport.test;
  $('op-metrics').replaceChildren(metric('MACRO-F1',report.macroF1.toFixed(3)),metric('REGRAS F1',report.baselineMacroF1.toFixed(3)),metric('COBERTURA',pct(report.coverage)));
  for(const o of report.outcomes){const row=el('div',`result ${o.label===o.expected?'':'fail'}`);row.append(el('strong','',`${o.id} · ${o.label}`),el('p','',`${o.text} — Esperado: ${o.expected}. Modelo sem recusa: ${o.rawPrediction}.`));$('op-results').append(row);}
  $('op-route').disabled=false;if($('op-text').value)routeCurrent();else loadTicket();
  $('mode').textContent='ML no navegador · arquivos locais · sem API obrigatória';
 }catch(e){$('op-approve').disabled=true;$('op-llm').disabled=true;setStatus('op-status',`ML indisponível: ${e.message}`);}
}
loadModel();

async function loadCorpus(){const token=corpusGate.begin();const docs=[];for(const path of corpusPaths){try{const r=await fetch(`./${path}`);if(!r.ok)throw Error(`HTTP ${r.status}`);docs.push({path,text:await r.text()});}catch{setStatus('dt-status','Não foi possível carregar o corpus. Rode npm run serve para usar os arquivos locais.');}}
  if(!corpusGate.current(token))return;state.docs=docs;state.passages=chunkDocuments(docs);if(docs.length===corpusPaths.length){renderRetrievalBenchmark();setStatus('dt-status',`${docs.length} documentos locais indexados no navegador.`);searchDocs();}}
async function renderRetrievalBenchmark(){
 try{const r=await fetch('./reports/lastro.json');if(!r.ok)return;const report=await r.json();$('dt-benchmark').textContent=`Corpus de demonstração: Recall@3 ${pct(report.recallAtK)}, MRR ${report.mrr.toFixed(3)}; ${report.answerable} consultas com fonte e ${report.unanswerable} sem resposta. Ver relatório completo.`;}catch{/* Search remains available without report. */}
}
function searchDocs(){dtGate.invalidate();state.search=retrieve($('dt-query').value,state.passages,3);$('dt-answer').textContent=groundedAnswer(state.search);$('dt-llm-answer').hidden=true;$('dt-count').textContent=`${state.search.length} passagens com correspondência entre ${state.passages.length} indexadas.`;const list=$('dt-results');list.replaceChildren();for(const p of state.search){const row=el('div','result');row.append(el('strong','',`[${p.id}] ${p.heading}`),el('p','',p.text),el('code','',`${p.path} · BM25 ${p.score.toFixed(3)} · ${p.matched}/${p.queryTerms} termos da consulta`));list.append(row);}}
$('dt-query').addEventListener('input',()=>{dtGate.invalidate();$('dt-llm-answer').hidden=true;});
$('dt-search').addEventListener('click',searchDocs);$('dt-query').addEventListener('keydown',e=>{if(e.key==='Enter')searchDocs();});
$('dt-files').addEventListener('change',async e=>{dtGate.invalidate();const token=corpusGate.begin();$('dt-llm').disabled=true;$('dt-llm-answer').hidden=true;$('dt-benchmark').hidden=true;const files=[...e.target.files].filter(f=>f.name.toLowerCase().endsWith('.md')&&f.size<=100_000).slice(0,20);if(!files.length){setStatus('dt-status','Escolha arquivos .md de até 100 KB (máximo 20).');return;}const docs=await Promise.all(files.map(async f=>({path:`local/${f.name}`,text:await f.text()})));if(!corpusGate.current(token))return;state.docs=docs;state.passages=chunkDocuments(docs);$('dt-llm').disabled=true;$('dt-llm').title='Arquivos próprios permanecem somente no navegador';setStatus('dt-status',`${docs.length} arquivo(s) indexado(s) somente no navegador. Consulta LLM desativada para arquivos próprios.`);searchDocs();});
$('dt-llm').addEventListener('click',async()=>{searchDocs();const token=dtGate.begin();if(!state.search.length){setStatus('dt-status','Sem evidência; consulta ao LLM não enviada.');return;}setStatus('dt-status','Consultando LLM local com as passagens exibidas...');try{const context=state.search.map(p=>`[${p.id}] ${p.path}\n${p.text}`).join('\n\n');const answer=await callLLM('Responda somente com base nas passagens fornecidas. Cite o ID [Sxx] de cada afirmação. Se não houver evidência, diga que não sabe. Não invente.',`Pergunta: ${$('dt-query').value}\n\nFontes:\n${context}`);if(!dtGate.current(token))return;$('dt-llm-answer').hidden=false;$('dt-llm-answer').textContent=`LLM local · resposta não verificada\n${answer}`;setStatus('dt-status','Confira cada afirmação do LLM nas passagens exibidas.');}catch(e){if(dtGate.current(token))setStatus('dt-status',e.message);}});
async function loadKoraRoutes(){
 try{
  const response=await fetch('./kora/request-routes.json');
  if(!response.ok)throw new Error('Catálogo de rotas indisponível.');
  const data=await response.json();
  if(data.version!==1||!Array.isArray(data.routes))throw new Error('Catálogo de rotas inválido.');
  state.routeRegistry=data.routes;
  $('kr-run').disabled=false;
  setStatus('kr-status','Catálogo carregado. Classificação local; nenhum modelo será chamado.');
  renderKoraRoute();
  loadKoraModel();
 }catch(error){setStatus('kr-status',error.message);}
}
function renderKoraRoute(){
 const output=$('kr-output');
 output.replaceChildren();
 if(!state.routeRegistry){output.append(el('p','route-empty','O catálogo de rotas ainda não está disponível.'));return;}
 const model=$('kr-engine').value==='ml'?state.koraModel:null;
 const decision=model?selectKoraRoute($('kr-query').value,state.routeRegistry,model):routeKoraRequest($('kr-query').value,state.routeRegistry);
 const learned=decision.source==='trained-ml';
 if(!decision.skills.length){
  output.append(el('p','route-empty','Sem sinal suficiente. KORA não força uma habilidade; responde pelo contrato geral ou pede contexto.'));
 }else{
  const list=el('div','route-list');
  for(const skill of decision.skills){
   const domain=state.routeRegistry.find(item=>item.skill===skill);
   const row=el('article','route-card');
   row.append(el('span','route-domain',(domain?.domain||'ROTA').replaceAll('-',' ').toUpperCase()));
   row.append(el('strong','',skill));
   row.append(el('span','route-score',learned?'Sugestão supervisionada · revisar':'Sinal lexical: '+(decision.scores[domain?.domain]??0)));
   list.append(row);
  }
  output.append(list);
  output.append(el('p','route-reason',decision.reason==='mixed_domains'?'Pedido misto: duas habilidades selecionadas.':'Uma habilidade selecionada.'));
 }
 if(decision.source==='rules-mixed')output.append(el('p','note','Pedido misto: decisão preservada pelas regras, não pelo modelo de domínio único.'));
 const scores=Object.entries(decision.scores).sort((a,b)=>b[1]-a[1]).slice(0,4);
 if(scores.length){
  const details=el('details','route-scores');
  const summary=el('summary','', 'Ver pontuações comparadas');
  const rows=el('ul','');
  for(const [domain,score] of scores)rows.append(el('li','',domain.replaceAll('-',' ')+' — '+score));
  details.append(summary,rows);output.append(details);
 }
 output.append(el('p','route-confidence',(learned?'Pontuação do modelo: ':'Índice lexical: ')+decision.confidence.toFixed(2)+' · motivo: '+decision.reason));
 let demo;
 try{demo=runKoraAssistantDemo($('kr-query').value,state.routeRegistry,undefined,{model,finance:state.koraFinance,activities:state.koraEvents,month:$('kr-month').value});}
 catch(error){setStatus('kr-status',error.message);$('kr-modules').replaceChildren();return;}
 $('kr-context').textContent=demo.contextChars+' / '+demo.contextLimit+' caracteres';
 $('kr-context-meter').style.transform='scaleX('+Math.min(1,demo.contextChars/demo.contextLimit)+')';
 const modules=$('kr-modules');modules.replaceChildren();
 if(!demo.modules.length)modules.append(el('p','note','Nenhum módulo de finanças/eventos foi carregado para esta rota.'));
 for(const module of demo.modules){const card=el('article','kora-module');card.append(el('strong','',module.domain));for(const line of module.lines)card.append(el('p','',line));modules.append(card);}
 const evidence=$('kr-evidence');evidence.replaceChildren();
 if(!demo.evidence.length)evidence.append(el('p','note','Nenhuma passagem ultrapassou o limiar local.'));
 for(const passage of demo.evidence){const card=el('article','result kora-evidence-row');card.append(el('strong','',passage.path+' · '+passage.id),el('p','',passage.text),el('code','','cosine '+passage.vectorScore.toFixed(3)+' · BM25-rank '+passage.bm25Score.toFixed(3)+' · combinado '+passage.score.toFixed(3)));evidence.append(card);}
 setStatus('kr-status','Concluído · '+(learned?'ML experimental; revise a sugestão. ':'Regras locais. ')+'Nenhuma ferramenta ou modelo remoto foi chamado.');
}
async function loadKoraModel(){
 try{
  const responses=await Promise.all(['./models/kora-router.json','./reports/kora-ml.json'].map(path=>fetch(path)));
  if(responses.some(r=>!r.ok))throw new Error('Modelo de ML indisponível; regras continuam disponíveis.');
  const [model,report]=await Promise.all(responses.map(r=>r.json()));
  selectKoraRoute('teste',state.routeRegistry,model);
  state.koraModel=model;state.koraReport=report;$('kr-engine-ml').disabled=false;
  $('kr-ml-metrics').textContent=`Teste sintético: ${report.test.support} pedidos · macro-F1 ML ${report.test.macroF1.toFixed(3)} / regras ${report.test.baselineMacroF1.toFixed(3)} · cobertura ${pct(report.test.coverage)}. Fora do domínio: recusa ${pct(report.ood.rejectionRate)} em ${report.ood.support} casos. ML experimental; regras permanecem como padrão.`;
 }catch(error){$('kr-ml-metrics').textContent=error.message;}
}
$('kr-engine').addEventListener('change',renderKoraRoute);
$('kr-month').addEventListener('change',renderKoraRoute);
$('kr-import').addEventListener('click',()=>{
 try{
  const raw=$('kr-data').value;if(raw.length>100000)throw new Error('Use até 100 KB de JSON.');
  const data=JSON.parse(raw);
  if($('kr-data-kind').value==='finance'){summarizeFinance(data,$('kr-month').value);state.koraFinance=data;}
  else{listEvents(data);state.koraEvents=data;}
  renderKoraRoute();setStatus('kr-status','Dados validados e carregados apenas nesta sessão. Escolha a rota correspondente para consultar.');
 }catch(error){setStatus('kr-status','Importação recusada: '+error.message);}
});
$('kr-reset-data').addEventListener('click',()=>{state.koraFinance=null;state.koraEvents=null;$('kr-data').value='';renderKoraRoute();});
$('kr-export').addEventListener('click',()=>{
 const model=$('kr-engine').value==='ml'?state.koraModel:null;
 const query=$('kr-query').value;
 const decision=model?selectKoraRoute(query,state.routeRegistry,model):routeKoraRequest(query,state.routeRegistry);
 download('kora-routing-experiment.json',{schema:'kora.routing-experiment/1',query,decision,modelDatasetSha256:model?.datasetSha256||null,importedDataIncluded:false});
});
$('kr-run').addEventListener('click',renderKoraRoute);
$('kr-query').addEventListener('input',()=>{if(state.routeRegistry)renderKoraRoute();});
$('kr-example').addEventListener('change',event=>{if(event.target.value){$('kr-query').value=event.target.value;renderKoraRoute();}});
loadKoraRoutes();
loadCorpus();checkLLM();
