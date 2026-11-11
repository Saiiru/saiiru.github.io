import test from 'node:test';
import assert from 'node:assert/strict';
import {summarizeFinance, listEvents,formatMoney} from '../core/kora-workspace.mjs';
import {retrieveKoraEvidence} from '../core/kora-assistant-demo.mjs';
test('finance calculates from entries and keeps planned separate',()=>{
 const data={schema:'luka.finance-export/1',transactions:[
 {transaction_date:'2026-11-01',amount_cents:1000,transaction_type:'income',status:'paid'},
 {transaction_date:'2026-11-02',amount_cents:1275,transaction_type:'expense',status:'confirmed',category_name:'Material'},
 {transaction_date:'2026-11-03',amount_cents:500,transaction_type:'expense',status:'planned'},
 {transaction_date:'2026-11-04',amount_cents:800,transaction_type:'expense',status:'cancelled'}],budgets:[]};
 assert.deepEqual(summarizeFinance(data,'2026-11'),{income:1000,spent:1275,planned:500,net:-275,budgets:[]});
 assert.equal(formatMoney(-275),'-R$ 2,75');
 data.transactions[0].amount_cents=1.5;assert.throws(()=>summarizeFinance(data,'2026-11'));
});
test('invalid dates and unsafe integers fail closed',()=>{
 const data={schema:'luka.finance-export/1',transactions:[{transaction_date:'2026-02-31',amount_cents:1,transaction_type:'income',status:'paid'}]};
 assert.throws(()=>summarizeFinance(data,'2026-02'));
 data.transactions[0].transaction_date='2026-02-01';data.transactions[0].amount_cents=Number.MAX_SAFE_INTEGER+1;
 assert.throws(()=>summarizeFinance(data,'2026-02'));
});
test('event ordering normalizes timezone and preserves source containers',()=>{
 const rows=listEvents([{title:'B',at:'2026-11-11T11:00:00-03:00'},{title:'A',at:'2026-11-11T13:00:00Z'}]);
 assert.deepEqual(rows.map(x=>x.title),['A','B']);assert.equal(rows[1].at,'2026-11-11T14:00:00.000Z');assert.equal(rows[0].source,'KORA');
 assert.throws(()=>listEvents([{title:'X',at:'2026-11-11T10:00:00'}]))
});
test('retrieval abstains on unrelated words instead of hash collisions',()=>{
 assert.deepEqual(retrieveKoraEvidence('zqxnonexistentvocabulary'),[]);
});
test('clearing a month cannot silently calculate a different period',async()=>{
 const {runKoraAssistantDemo}=await import('../core/kora-assistant-demo.mjs');
 const {readFile}=await import('node:fs/promises');
 const registry=JSON.parse(await readFile(new URL('../kora/request-routes.json',import.meta.url))).routes;
 assert.throws(()=>runKoraAssistantDemo('resumo financeiro',registry,undefined,{month:''}));
});
