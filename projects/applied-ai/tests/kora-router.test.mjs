import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { routeKoraRequest } from '../core/kora-router.mjs';
import { runKoraAssistantDemo } from '../core/kora-assistant-demo.mjs';

const registry = JSON.parse(await readFile(new URL('../kora/request-routes.json', import.meta.url), 'utf8')).routes;

test('accented Portuguese request selects SENAI study procedure', () => {
  const result = routeKoraRequest('Explique a lei de Ohm para o SENAI', registry);
  assert.deepEqual(result.skills, ['kora-senai-study']);
});

test('embedded request routes to firmware skill', () => {
  const result = routeKoraRequest('Meu ESP32 falhou no XPT2046', registry);
  assert.deepEqual(result.skills, ['kora-embedded-debug']);
});

test('mixed request loads two relevant procedures in score order', () => {
  const result = routeKoraRequest('Debug no ESP32 e explique metrologia do SENAI', registry);
  assert.deepEqual(result.skills, ['kora-embedded-debug', 'kora-senai-study']);
  assert.equal(result.reason, 'mixed_domains');
  assert.ok(result.skills.length <= 2);
});

test('generic request abstains instead of forcing a route', () => {
  assert.deepEqual(routeKoraRequest('Olá, como você pode me ajudar?', registry).skills, []);
});

test('a lone generic project keyword is below threshold', () => {
  assert.deepEqual(routeKoraRequest('Quero falar sobre projetos', registry).skills, []);
});

test('accent normalization handles Brazilian Portuguese', () => {
  const result = routeKoraRequest('O que faço para priorizar minhas tarefas?', registry);
  assert.deepEqual(result.skills, ['kora-task-focus']);
});

test('malformed route records fail closed', () => {
  assert.throws(() => routeKoraRequest('hello', [{ domain: 'x', skill: '../oops', phrases: [], keywords: [] }]), TypeError);
});

test('finance and Planner routes are present and have synthetic local demonstrations', () => {
  const finance = routeKoraRequest('Quero o resumo financeiro e meus gastos do mês.', registry);
  const events = routeKoraRequest('Mostre as atividades e eventos do Planner.', registry);
  assert.deepEqual(finance.skills, ['kora-finance']);
  assert.deepEqual(events.skills, ['kora-events']);
  const financeDemo = runKoraAssistantDemo('resumo financeiro', registry);
  assert.equal(financeDemo.modules[0].domain, 'FINANCE / LUKA · DADOS SINTÉTICOS');
  assert.ok(financeDemo.evidence.some(row => row.path.includes('finance-rules.md')));
  const eventDemo = runKoraAssistantDemo('eventos do Planner', registry);
  assert.equal(eventDemo.modules[0].domain, 'EVENTS / PLANNER · DADOS SINTÉTICOS UTC');
});

test('mixed KORA demo stays bounded and never calls an external provider', () => {
  const result = runKoraAssistantDemo('Compare meus gastos da LUKA com o calendário de eventos do Planner.', registry);
  assert.deepEqual(result.decision.skills, ['kora-events', 'kora-finance']);
  assert.equal(result.modules.length, 2);
  assert.ok(result.contextChars <= result.contextLimit);
  assert.equal(result.externalCalls, 0);
  assert.equal(result.mode, 'deterministic-synthetic-fixture');
});

test('versioned request fixture reaches exact route regression baseline', async () => {
  const { readFile } = await import('node:fs/promises');
  const cases = (await readFile(new URL('../kora/request-routing-v1.jsonl', import.meta.url), 'utf8'))
    .split(/\r?\n/).filter(Boolean).map(JSON.parse);
  const failures = cases.filter(item => JSON.stringify(routeKoraRequest(item.query, registry).skills) !== JSON.stringify(item.expected));
  assert.equal(cases.length, 34);
  assert.deepEqual(failures, []);
});
