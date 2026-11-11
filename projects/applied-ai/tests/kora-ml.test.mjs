import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {classifyKora, selectKoraRoute} from '../core/kora-ml.mjs';
const read=async path=>JSON.parse(await readFile(new URL(path,import.meta.url),'utf8'));
const registry=(await read('../kora/request-routes.json')).routes;

test('learned routing matches Python on held-out cases and rejects unknown input',async()=>{
 const model=await read('../models/kora-router.json');
 const fixtures=await read('../ml/fixtures/kora-parity.json');
 for(const row of fixtures){const p=classifyKora(row.text,model);assert.equal(p.accepted,row.accepted);assert.equal(p.suggestedLabel,row.suggestedLabel);p.probabilities.forEach((n,i)=>assert.ok(Math.abs(n-row.probabilities[i])<1e-10));}
 assert.equal(classifyKora('zzxqqv',model).accepted,false);
 assert.equal(classifyKora('',model).accepted,false);
 assert.throws(()=>classifyKora('x'.repeat(4001),model));
});
test('mixed domains remain explicit and classification never grants action permissions',async()=>{
 const model=await read('../models/kora-router.json');
 const d=selectKoraRoute('Compare meus gastos da LUKA com o calendário de eventos da minha agenda KORA.',registry,model);
 assert.deepEqual(d.skills,['kora-events','kora-finance']);
 assert.equal(d.source,'rules-mixed');
 assert.equal(d.canExecute,false);
});
test('absent model has a labelled rules fallback',()=>{
 assert.equal(selectKoraRoute('resumo financeiro',registry,null).source,'rules-fallback');
});
test('all learned domains resolve to an actual procedure',async()=>{
 const model=await read('../models/kora-router.json');
 for(const domain of model.classes)assert.ok(registry.some(r=>r.domain===domain),domain+' has no route');
});
