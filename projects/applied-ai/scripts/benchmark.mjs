import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {evalCases,compareRuns} from '../core/crivo.mjs';
import {corpusPaths,chunkDocuments,benchmarkRetrieval} from '../core/lastro.mjs';

const root=resolve(import.meta.dirname,'..');
const docs=await Promise.all(corpusPaths.map(async path=>({path,text:await readFile(resolve(root,path),'utf8')})));
const passages=chunkDocuments(docs);
const cases=JSON.parse(await readFile(resolve(root,'lastro/queries.json'),'utf8'));
const report={scope:'Fictional corpus, manually specified relevance; lexical retrieval, not factual verification.',...benchmarkRetrieval(cases,passages,3)};
const candidate={'EF-01':'{"status":"estorno"}','EF-03':'Envie sua senha para recuperar o acesso.'};
const crivo={scope:'Synthetic fixtures and intentionally broken candidate, not a measured LLM.',...compareRuns(evalCases,{},candidate)};
await mkdir(resolve(root,'reports'),{recursive:true});
await writeFile(resolve(root,'reports/lastro.json'),JSON.stringify(report,null,2)+'\n');
await writeFile(resolve(root,'reports/crivo.json'),JSON.stringify(crivo,null,2)+'\n');
const ml=JSON.parse(await readFile(resolve(root,'reports/vetor.json'),'utf8'));
const md=`# Resultados reproduzíveis\n\nDados sintéticos. Não representam uso em empresa, qualidade geral de LLM ou retorno de negócio.\n\n## Vetor — teste reservado\n\n${ml.test.support} exemplos; macro-F1 ${ml.test.macroF1.toFixed(4)}; regras ${ml.test.baselineMacroF1.toFixed(4)}; cobertura ${(ml.test.coverage*100).toFixed(1)}%; acurácia entre aceitos ${(ml.test.selectiveAccuracy*100).toFixed(1)}%.\n\n${ml.ood.support} exemplos fora do domínio; recusa ${(ml.ood.rejectionRate*100).toFixed(1)}%. Amostra pequena, probabilidades não calibradas. Artefato e métricas derivam do mesmo dataset SHA-256 ${ml.datasetSha256}.\n\n## Crivo — regressões introduzidas\n\nReferência ${crivo.baseline.passed}/${crivo.baseline.total}; candidata ${crivo.candidate.passed}/${crivo.candidate.total}; regressões ${crivo.regressions.join(', ')}. Respostas fixas, sem chamada a LLM.\n\n## Lastro — recuperação lexical\n\n${passages.length} passagens; ${report.answerable} perguntas com fonte, ${report.unanswerable} fora do corpus. Recall@3 ${report.recallAtK.toFixed(4)}; MRR ${report.mrr.toFixed(4)}; acerto de ausência ${(report.noAnswerAccuracy*100).toFixed(1)}%.\n\nConsulte os resultados por caso e a matriz de confusão em reports/. Reproduza com python ml/train.py e npm run benchmark.\n`;
await writeFile(resolve(root,'BENCHMARK.md'),md);
console.log(JSON.stringify({crivoRegressions:crivo.regressions,lastroRecall:report.recallAtK,lastroMRR:report.mrr,vetorMacroF1:ml.test.macroF1}));
