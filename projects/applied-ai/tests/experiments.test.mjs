import test from 'node:test';
import assert from 'node:assert/strict';
import {compareRuns,evalCases} from '../core/crivo.mjs';
import {benchmarkRetrieval,chunkDocuments} from '../core/lastro.mjs';

test('Crivo isolates regressions from unchanged passing cases',()=>{
 const report=compareRuns(evalCases,{}, {[evalCases[0].id]:'invalid'});
 assert.equal(report.regressions.length,1);
 assert.equal(report.regressions[0],evalCases[0].id);
 assert.equal(report.baseline.passed-report.candidate.passed,1);
 assert.equal(report.improvements.length,0);
});
test('Crivo records an improvement without hiding earlier failures',()=>{
 const c=evalCases[0];
 const r=compareRuns([c],{[c.id]:'invalid'},{});
 assert.deepEqual(r.improvements,[c.id]);
 assert.deepEqual(r.regressions,[]);
});
test('Lastro measures ranking and no-answer separately',()=>{
 const passages=chunkDocuments([{path:'docs/pagamentos.md',text:'# Cartão\nCobrança duplicada exige análise.'}]);
 const r=benchmarkRetrieval([{query:'cobrança duplicada',expectedPath:'docs/pagamentos.md'},{query:'dinossauros',expectedPath:null}],passages,3);
 assert.equal(r.recallAtK,1); assert.equal(r.mrr,1); assert.equal(r.noAnswerAccuracy,1);
 assert.equal(r.answerable,1); assert.equal(r.unanswerable,1);
});
test('Lastro empty benchmark has null metrics, not invented perfect scores',()=>{
 const r=benchmarkRetrieval([],[],3);
 assert.equal(r.recallAtK,null);assert.equal(r.mrr,null);assert.equal(r.noAnswerAccuracy,null);
});
