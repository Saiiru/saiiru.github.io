import { routeKoraRequest } from './kora-router.mjs';
import { chunkDocuments, retrieve } from './lastro.mjs';

const DIM = 256;
const CONTEXT_LIMIT = 1800;
const PROCEDURES = {
  'kora-finance': 'Usar exportação selecionada. Calcular valores em centavos. Somente confirmed/paid entram no realizado; planned fica separado. Responder localmente.',
  'kora-events': 'Ler atividades Planner em modo somente leitura. Preservar vínculo com a viagem e mostrar UTC. Responder localmente.',
  'kora-senai-study': 'Partir da dúvida concreta, explicar em passos e propor verificação curta.',
  'kora-embedded-debug': 'Coletar versão, ligação e log; mudar uma variável por vez; registrar resultado.',
  'kora-knowledge': 'Recuperar trecho com referência e abster-se sem fonte.'
};
const DOCS = [
  {path:'kora-fixtures/finance-rules.md',text:'# LUKA / resumo financeiro, gastos e orçamento\nMovimentações confirmed e paid são entradas e despesas realizadas. Itens planned são gastos planejados, compromissos futuros e ficam fora do saldo realizado. Quantias são calculadas como centavos inteiros.'},
  {path:'kora-fixtures/planner-activities.md',text:'# Planner / atividade\nAtividades pertencem a uma viagem e possuem título e instante occurs_at. A consulta de eventos preserva o destino da viagem, ordena por UTC e não escreve no banco.'},
  {path:'kora-fixtures/privacy.md',text:'# KORA / privacidade\nDados financeiros e eventos pessoais ficam no host local. As consultas determinísticas não são enviadas ao modelo remoto. Alterações exigem aprovação separada.'},
  {path:'kora-fixtures/retrieval.md',text:'# KORA / recuperação\nO índice SQLite local armazena vetores TF-IDF com feature hashing e usa FTS5 BM25 para busca lexical. O resultado preserva a origem do trecho e limita o contexto.'}
];
const FINANCE = Object.freeze({income:420000,spent:137450,planned:38500,limit:180000,category:'Transporte'});
const ACTIVITIES = Object.freeze([
  {at:'2026-11-12 13:00 UTC',title:'Revisão do protótipo',trip:'Laboratório demonstrativo'},
  {at:'2026-11-13 16:30 UTC',title:'Planejamento semanal',trip:'Laboratório demonstrativo'},
  {at:'2026-11-15 12:00 UTC',title:'Conferência dos registros',trip:'Laboratório demonstrativo'}
]);

function terms(text){return String(text).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').match(/[a-z0-9]{2,}/g)||[];}
function featureTerms(text){const t=terms(text);return [...t,...t.slice(1).map((v,i)=>t[i]+'_'+v)];}
function hash32(text){let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function makeIdf(passages){const df=new Map();for(const passage of passages){for(const term of new Set(featureTerms(passage.text)))df.set(term,(df.get(term)||0)+1);}return new Map([...df].map(([term,n])=>[term,Math.log((passages.length+1)/(n+1))+1]));}
function vector(text,idf){const counts=new Map();for(const term of featureTerms(text))counts.set(term,(counts.get(term)||0)+1);const out=new Float64Array(DIM);for(const [term,count] of counts){const hash=hash32(term),index=hash%DIM,sign=(hash&0x100)?1:-1;out[index]+=sign*(1+Math.log(count))*(idf.get(term)||1);}let norm=0;for(const value of out)norm+=value*value;norm=Math.sqrt(norm);if(norm)for(let i=0;i<DIM;i++)out[i]/=norm;return out;}
function cosine(a,b){let score=0;for(let i=0;i<DIM;i++)score+=a[i]*b[i];return Math.max(0,score);}

export function retrieveKoraEvidence(query, passages=chunkDocuments(DOCS), limit=3){
  if(!terms(query).length)return[];
  const idf=makeIdf(passages),queryVector=vector(query,idf);
  const lexical=retrieve(query,passages,passages.length);
  const lexicalRank=new Map(lexical.map((item,index)=>[item.id,1-index/Math.max(1,lexical.length)]));
  return passages.map(passage=>{
    const similarity=cosine(queryVector,vector(passage.text,idf));
    const bm25=lexicalRank.get(passage.id)||0;
    return{...passage,vectorScore:Number(similarity.toFixed(3)),bm25Score:Number(bm25.toFixed(3)),score:Number((.65*similarity+.35*bm25).toFixed(3))};
  }).filter(item=>item.score>0).sort((a,b)=>b.score-a.score||a.path.localeCompare(b.path)).slice(0,limit);
}

function money(cents){return 'R$ '+Math.floor(cents/100).toLocaleString('pt-BR')+','+String(cents%100).padStart(2,'0');}
function moduleData(decision){
  const modules=[];
  if(decision.domains.includes('finance'))modules.push({domain:'FINANCE / LUKA · DADOS SINTÉTICOS',lines:[
    'Entradas realizadas: '+money(FINANCE.income),
    'Saídas realizadas: '+money(FINANCE.spent),
    'Planejado (separado): '+money(FINANCE.planned),
    FINANCE.category+': '+money(FINANCE.spent)+' / '+money(FINANCE.limit)
  ]});
  if(decision.domains.includes('events'))modules.push({domain:'EVENTS / PLANNER · DADOS SINTÉTICOS UTC',lines:ACTIVITIES.map(event=>event.at+' · '+event.title+' · '+event.trip)});
  return modules;
}

export function runKoraAssistantDemo(query, routeRegistry, passages=chunkDocuments(DOCS)){
  const decision=routeKoraRequest(query,routeRegistry);
  const evidence=retrieveKoraEvidence(query,passages,3);
  const procedure=decision.skills.map(skill=>PROCEDURES[skill]).filter(Boolean);
  const context=[...procedure,...evidence.map(item=>item.text)].join('\n').slice(0,CONTEXT_LIMIT);
  return{
    decision,
    evidence,
    modules:moduleData(decision),
    contextChars:context.length,
    contextLimit:CONTEXT_LIMIT,
    mode:'deterministic-synthetic-fixture',
    externalCalls:0
  };
}

export const koraAssistantDemoFixtures=Object.freeze({documents:DOCS,finance:FINANCE,activities:ACTIVITIES});
