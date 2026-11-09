import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {routeWithModel} from '../core/vetor-ml.mjs';
const model=JSON.parse(readFileSync(new URL('../models/vetor.json',import.meta.url)));
const fixtures=JSON.parse(readFileSync(new URL('../ml/fixtures/parity.json',import.meta.url)));
test('exported model produces Python-equivalent probabilities for every held-out and OOD fixture',()=>{
 for(const fixture of fixtures){
  const p=routeWithModel(fixture.text,model);
  assert.equal(p.team,fixture.label);assert.equal(p.covered,fixture.accepted);
  p.probabilities.forEach((n,i)=>assert.ok(Math.abs(n-fixture.probabilities[i])<1e-10,fixture.text));
 }
});
test('empty and entirely unknown vocabulary abstain',()=>{
 for(const text of ['','   ','zzzzzz qqqqq xxxx'])assert.equal(routeWithModel(text,model).team,'Revisão manual');
});
test('ML result explains features and labels the distinct priority rule',()=>{
 const p=routeWithModel('Meu cartão recebeu uma cobrança duplicada.',model);
 assert.equal(p.team,'Pagamentos');assert.equal(p.severity,'Alta');
 assert.equal(p.source,'trained-ml');assert.ok(p.features.length>0);
 assert.match(p.reason,/prioridade por regra/i);
});
test('model rejects invalid inputs without truncating them into another request',()=>{
 assert.throws(()=>routeWithModel('a'.repeat(4001),model),/4000/);
 assert.throws(()=>routeWithModel(null,model),/texto/);
});
test('corrupt model fails explicitly',()=>{
 assert.throws(()=>routeWithModel('pagamento',{...model,coef:[]}),/modelo/i);
});
