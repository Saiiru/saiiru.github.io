import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'
import { signalEffects } from '../components/effects/signals.js'
import { panelEffects } from '../components/effects/panels.js'
import { displayEffects } from '../components/effects/displays.js'
import { sceneEffects } from '../components/effects/scenes.js'
const effects=[...signalEffects,...panelEffects,...displayEffects,...sceneEffects]
const ids=new Set(effects.map(effect=>effect.id))
assert.equal(ids.size,24);assert.equal(effects.length,24)
for(const effect of effects){assert.equal(typeof effect.mount,'function');assert(effect.title&&effect.summary&&effect.category);for(const path of effect.sourcePaths)await access(new URL('../'+path,import.meta.url))}
const coverage=JSON.parse(await readFile(new URL('../components/reference/coverage-map.json',import.meta.url)))
assert.equal(coverage.all30Families.length,30);assert.equal(coverage.files.length,142)
for(const family of coverage.all30Families){assert(family.browserEffectIDs.length);for(const id of family.browserEffectIDs)assert(ids.has(id),'Unimplemented ID '+id+' for '+family.family)}
for(const file of coverage.files){assert(file.sourceBlobSha);assert(file.sourceUrl.includes(coverage.sourceCommit));assert(file.mappings.length,'Unmapped file '+file.path)}
console.log(JSON.stringify({components:effects.length,sourceFamilies:coverage.all30Families.length,inventoriedFiles:coverage.files.length,sourceCommit:coverage.sourceCommit,scope:'Original browser equivalents; no native OS control or literal Slang pipeline'},null,2))
