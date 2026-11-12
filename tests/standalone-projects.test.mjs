import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { standaloneProjects, standaloneGroups } from '../src/data/standalone-projects.js'
import inventory from '../src/data/repositories.json' with { type: 'json' }

const renames = {
  'Plann.er': 'travel-planner-api',
  'ada-commerce': 'java-order-management-cli',
  'dtmoney': 'react-finance-dashboard',
  'DesafioPooDio': 'java-oop-bootcamp',
  'dio-trilha-basico': 'java-algorithms-labs',
  'dio-angular-develloper': 'git-github-foundations',
  'IgniteLab': 'ignite-lab-archive',
  'minimal-portfolio': 'portfolio-ui-experiments',
  'sofi-test': 'ruby-prefix-grouping',
  'AngularFrontEndMasters': 'AngularFrontEndMasters',
  'starwarsplanets': 'starwarsplanets',
  'skills-copilot-codespaces-vscode': 'skills-copilot-codespaces-vscode'
}

test('twelve repos have professional names and retain their legacy identities', () => {
  assert.equal(standaloneProjects.length, 12)
  assert.deepEqual([...standaloneProjects.map(p => p.legacySlug)].sort(), Object.keys(renames).sort())
  assert.equal(new Set(standaloneProjects.map(p => p.slug)).size, 12)
  for (const project of standaloneProjects) {
    assert.equal(project.slug, renames[project.legacySlug])
    assert.equal(project.url, 'https://github.com/Saiiru/' + project.slug)
    assert.equal(project.briefUrl, project.url + '/blob/main/docs/PROJECT_BRIEF.md')
    assert(project.title.length >= 8)
    assert(project.summary.length >= 30)
    assert(project.purpose.length >= 70)
    assert(project.nextStep.length >= 35)
    assert(project.stack.length > 0)
    assert(standaloneGroups.some(g => g.id === project.group))
    assert(!/kora|integrar ao assistente|módulo do assistente/i.test(project.purpose + ' ' + project.nextStep))
    assert(inventory.repositories.some(r => r.name === project.slug && !r.fork))
  }
})

test('only the two verified app studies get flagship treatment', () => {
  const featured = standaloneProjects.filter(p => p.featured)
  assert.deepEqual(featured.map(p => p.slug).sort(), [
    'java-order-management-cli', 'travel-planner-api'
  ])
  assert(featured.every(project => project.flow.length === 4))
  const demos = standaloneProjects.filter(project => project.demoUrl)
  assert.deepEqual(demos.map(p => p.slug).sort(), ['AngularFrontEndMasters', 'portfolio-ui-experiments', 'react-finance-dashboard', 'starwarsplanets'])
  assert(demos.every(p => p.demoUrl.startsWith('https://saiiru.github.io/')))
})

test('training work and incomplete repositories remain honestly labeled', () => {
  const find = legacy => standaloneProjects.find(p => p.legacySlug === legacy)
  assert.match(find('IgniteLab').stage, /vazio|sem código/i)
  assert.match(find('sofi-test').stage, /implementada|testada/i)
  assert.match(find('ada-commerce').stage, /equipe/i)
  assert.match(find('Plann.er').purpose, /API/)
  assert.equal(find('AngularFrontEndMasters').slug, 'AngularFrontEndMasters')
  assert.equal(find('starwarsplanets').slug, 'starwarsplanets')
  assert.equal(find('skills-copilot-codespaces-vscode').slug, 'skills-copilot-codespaces-vscode')
})

test('archive preserves all owner-selected repos and old-name search', () => {
  const source = readFileSync(new URL('../src/components/PublicArchive.jsx', import.meta.url), 'utf8')
  assert(!/hiddenFromPortfolio\.has\(item\.name\)/.test(source))
  assert(source.includes('standaloneProjects'))
  assert(source.includes('item.legacySlug'))
  assert.equal(inventory.repositories.length, 62)
})

test('project nav and hero lead to the gallery before labs', () => {
  const source = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')
  assert(source.includes('<DeferredStandaloneProjects/>'))
  assert(source.indexOf('<DeferredStandaloneProjects/>') < source.indexOf('<KoraCaseStudy/>'))
  assert(source.indexOf('<DeferredStandaloneProjects/>') < source.indexOf('<PublicArchive/>'))
  assert(source.includes('href="#projetos-independentes"'))
})
