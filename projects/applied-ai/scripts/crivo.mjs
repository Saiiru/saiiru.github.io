import {readFile} from 'node:fs/promises';
import {compareRuns,evalCases} from '../core/crivo.mjs';
const [baselinePath,candidatePath]=process.argv.slice(2);
if(!baselinePath||!candidatePath){console.error('Uso: node scripts/crivo.mjs baseline.json candidate.json');process.exit(2);}
try{
 const [baseline,candidate]=await Promise.all([baselinePath,candidatePath].map(p=>readFile(p,'utf8').then(JSON.parse)));
 for(const value of [baseline,candidate]){
  if(!value||Array.isArray(value)||typeof value!=='object'||Object.values(value).some(v=>typeof v!=='string'))throw Error('Cada arquivo deve mapear IDs de caso para respostas em texto.');
  if(Object.keys(value).some(key=>!evalCases.some(c=>c.id===key)))throw Error('ID de caso desconhecido. Consulte os casos da suíte.');
 }
 const report=compareRuns(evalCases,baseline,candidate);console.log(JSON.stringify(report,null,2));
 if(report.regressions.length)process.exitCode=1;
}catch(e){console.error(e.message);process.exitCode=2;}
