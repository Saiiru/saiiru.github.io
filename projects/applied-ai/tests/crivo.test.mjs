import test from 'node:test';
import assert from 'node:assert/strict';
import {evalCases,evaluateCase,evaluateSuite,formatObsidianNote} from '../core/crivo.mjs';

test('seeded suite evaluates six explicit cases',()=>{const s=evaluateSuite();assert.equal(s.total,6);assert.equal(s.passed,6);assert.equal(s.rate,s.passed/s.total);assert.ok(evalCases.every(c=>Object.keys(c.assertions).length>0));});
test('missing required term fails with a specific reason',()=>{const r=evaluateCase(evalCases[1],'Não sei.');assert.equal(r.passed,false);assert.match(r.reasons.join(' '),/Falta termo obrigatório/);});
test('forbidden term fails even with different case',()=>{const r=evaluateCase(evalCases[1],'Entrega do pedido GARANTIDO.');assert.equal(r.passed,false);assert.match(r.reasons.join(' '),/proibido/);});
test('JSON assertion catches invalid JSON and missing keys',()=>{assert.match(evaluateCase(evalCases[0],'{oops').reasons.join(' '),/JSON inválido/);assert.match(evaluateCase(evalCases[0],'{"status":"estorno"}').reasons.join(' '),/prazo/);});
test('length limit and overrides affect aggregate rate',()=>{const s=evaluateSuite(evalCases,{'EF-06':'protocolo painel '+'.'.repeat(100)});assert.equal(s.passed,5);assert.equal(s.failed,1);assert.equal(s.rate,5/6);assert.match(s.results[5].reasons.join(' '),/Excede/);});

test('Obsidian note records failed criteria and preserves code fences',()=>{
  const note=formatObsidianNote({instruction:'Teste',overrides:{'EF-01':'``` sem dados'},generatedAt:'2026-11-08T00:00:00Z'});
  assert.match(note,/EF-01 — falhou/);
  assert.match(note,/Falta termo obrigatório/);
  assert.match(note,/projeto: "\[\[01-Projetos\/Crivo\/Project\|Crivo\]\]"/);
  assert.match(note,/^````$/m);
  assert.match(note,/Registro: 2026-11-08T00:00:00Z/);
});
