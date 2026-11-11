import test from 'node:test'
import assert from 'node:assert/strict'
import { stat } from 'node:fs/promises'
import { datashards, createRecord } from '../src/components/datashards.js'

const root = new URL('../', import.meta.url)
const isFile = async relative => (await stat(new URL(relative, root))).isFile()

test('each highlighted project has a clear public purpose and inspectable local artifacts', async () => {
  assert.equal(datashards.length, 4)
  const ids = new Set()
  for (const shard of datashards) {
    assert(!ids.has(shard.id), 'duplicate highlighted project')
    ids.add(shard.id)
    assert.match(shard.publicTitle, /^.{22,100}$/u, shard.id + ' needs a human-readable project title')
    assert.match(shard.status, /^(validado em laboratório|experimental)$/)
    for (const artifact of [shard.readme, shard.report, shard.testFile && 'projects/applied-ai/tests/' + shard.testFile]) {
      assert.equal(await isFile(artifact), true, shard.id + ' missing ' + artifact)
    }
    assert.equal(await isFile('projects/applied-ai/' + shard.module), true)
    assert.equal(await isFile('public' + shard.demo.split('?')[0]), true)
  }
})

test('portable project record includes evidence and project explanation links', () => {
  const shard = datashards.find(item => item.id === 'rota')
  const record = createRecord(shard)
  assert.match(record.publicTitle, /KORA/u)
  assert.match(record.readme, /^https:\/\/github.com\//u)
  assert.match(record.report, /^https:\/\/github.com\//u)
  assert.equal(record.limitations, shard.limitation)
  assert.match(record.tests, /tests\/kora-router\.test\.mjs$/u)
})
