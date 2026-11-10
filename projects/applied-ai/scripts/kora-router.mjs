#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { routeKoraRequest } from '../core/kora-router.mjs';

const base = resolve(import.meta.dirname, '..');
const routes = JSON.parse(await readFile(resolve(base, 'kora/request-routes.json'), 'utf8')).routes;
const args = process.argv.slice(2);

if (args[0] === '--eval') {
  const lines = (await readFile(resolve(base, 'kora/request-routing-v1.jsonl'), 'utf8')).split(/\r?\n/).filter(Boolean);
  let exact = 0;
  let coverage = 0;
  const mismatches = [];
  for (const line of lines) {
    const item = JSON.parse(line);
    const actual = routeKoraRequest(item.query, routes).skills;
    if (JSON.stringify(actual) === JSON.stringify(item.expected)) exact += 1;
    if (item.expected.every(skill => actual.includes(skill))) coverage += 1;
    if (JSON.stringify(actual) !== JSON.stringify(item.expected)) mismatches.push({query:item.query,expected:item.expected,actual});
  }
  const result = {cases:lines.length,exact:exact+'/'+lines.length,exactAccuracy:lines.length?exact/lines.length:0,expectedSkillCoverage:lines.length?coverage/lines.length:0,mismatches};
  process.stdout.write(JSON.stringify(result,null,2)+'\n');
  process.exitCode = exact === lines.length ? 0 : 1;
} else {
  const query = args.join(' ').trim();
  if (!query) {
    process.stderr.write('Uso: npm run kora-router -- "pedido" | --eval\n');
    process.exitCode = 2;
  } else {
    process.stdout.write(JSON.stringify(routeKoraRequest(query,routes),null,2)+'\n');
  }
}
