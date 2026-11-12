import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { standaloneProjects, standaloneGroups } from '../src/data/standalone-projects.js'
import inventory from '../src/data/repositories.json' with { type: 'json' }

const requested = [
  'AngularFrontEndMasters', 'DesafioPooDio', 'dio-angular-develloper',
  'dio-trilha-basico', 'dtmoney', 'IgniteLab', 'minimal-portfolio',
  'skills-copilot-codespaces-vscode', 'sofi-test', 'starwarsplanets',
  'Plann.er', 'ada-commerce'
]

test('every requested public repository has its own factual standalone profile', () => {
  assert.equal(standaloneProjects.length, requested.length)
  assert.deepEqual([...standaloneProjects.map(project => project.slug)].sort(), requested.sort())
  for (const project of standaloneProjects) {
    assert.equal(project.url, 'https://github.com/Saiiru/' + project.slug)
    assert(project.title.length >= 12, project.slug + ' lacks descriptive title')
    assert(project.purpose.length >= 70, project.slug + ' lacks purpose')
    assert(project.nextStep.length >= 35, project.slug + ' lacks next action')
    assert(project.stack.length > 0, project.slug + ' lacks declared stack')
    assert(standaloneGroups.some(group => group.id === project.group))
    assert(!/kora|integrar ao assistente|módulo do assistente/i.test(project.purpose + ' ' + project.nextStep))
    assert(inventory.repositories.some(item => item.name === project.slug && !item.fork))
  }
})

test('unfinished projects and team work remain explicitly identified', () => {
  const find = slug => standaloneProjects.find(project => project.slug === slug)
  assert.match(find('IgniteLab').stage, /vazio|sem código/i)
  assert.match(find('sofi-test').stage, /documentado|sem implementação/i)
  assert.match(find('ada-commerce').stage, /equipe/i)
  assert.match(find('Plann.er').purpose, /API/)
})

test('public repository archive does not hide Plann.er or ada-commerce', () => {
  const source = readFileSync(new URL('../src/components/PublicArchive.jsx', import.meta.url), 'utf8')
  assert(!/hiddenFromPortfolio\.has\(item\.name\)/.test(source))
  assert(source.includes('standaloneProjects'))
})

test('standalone shelf is mounted before the general archive', () => {
  const source = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')
  assert(source.includes('<DeferredStandaloneProjects/>'))
  assert(source.indexOf('<DeferredStandaloneProjects/>') < source.indexOf('<PublicArchive/>'))
})
