import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {corpusPaths,chunkDocuments,retrieve,groundedAnswer,tokenize} from '../core/lastro.mjs';
const documents=await Promise.all(corpusPaths.map(async path=>({path,text:await readFile(new URL(`../${path}`,import.meta.url),'utf8')})));
const passages=chunkDocuments(documents);

test('six original markdown documents produce citeable passages',()=>{assert.equal(documents.length,6);assert.ok(passages.length>=12);assert.equal(new Set(passages.map(p=>p.id)).size,passages.length);});
test('normalization handles accents and case',()=>{assert.deepEqual(tokenize('COBRANÇA'),['cobranca']);});
test('BM25 ranks the matching payment passage first',()=>{const r=retrieve('cobrança duplicada',passages);assert.equal(r[0].path,'docs/pagamentos.md');assert.ok(r[0].score>0);assert.ok(r[0].matched>=2);});
test('top three results have source path, citation IDs and descending scores',()=>{const r=retrieve('pedido estorno pagamento',passages);assert.ok(r.length<=3);assert.ok(r.every(p=>p.path.endsWith('.md')&&/^S\d+$/.test(p.id)));assert.ok(r.every((p,i)=>i===0||r[i-1].score>=p.score));});
test('extractive answer consists of source text plus citation IDs',()=>{const r=retrieve('senha acesso',passages);const a=groundedAnswer(r);assert.ok(r.every(p=>a.includes(`“${p.text}” [${p.id}]`)));});
test('out-of-corpus query refuses to invent an answer',()=>{const r=retrieve('quasar fotossíntese astrofísica',passages);assert.deepEqual(r,[]);assert.match(groundedAnswer(r),/Não encontrei evidência/);});

test('Markdown extension accepted by upload is also accepted by indexing',()=>{
 const passages=chunkDocuments([{path:'MANUAL.MD',text:'# Oficina\nCalibrador na gaveta azul.'}]);
 assert.equal(passages.length,1);
 assert.equal(retrieve('calibrador',passages)[0].path,'MANUAL.MD');
});
