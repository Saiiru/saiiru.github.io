// Source-of-truth documentation generator for independent public projects.
// Run with: node scripts/update-standalone-documentation.mjs
import { writeFileSync } from 'node:fs'
import { standaloneGroups, standaloneProjects } from '../src/data/standalone-projects.js'

const lines = [
  '# Projetos independentes — guia de leitura',
  '',
  '**Atualização:** 12/11/2026 · **Estado:** 12 repositórios documentados, nove renomeados e três slugs preservados.',
  '',
  'Este guia acompanha [Código. Com contexto.](https://saiiru.github.io/#projetos-independentes) no site original. Os projetos são **standalone**, sem dependências da KORA. O código, a autoria e os históricos existentes foram preservados; esta curadoria não comprova execução dos aplicativos antigos.',
  '',
  '## Migração dos nomes e endereços',
  '',
  '| Nome anterior | Repositório atual | Nome público | Motivo |',
  '| --- | --- | --- | --- |'
]
for (const project of standaloneProjects) {
  const changed = project.slug !== project.legacySlug
  const why = changed
    ? 'Nome atualizado no GitHub, histórico preservado.'
    : project.slug === 'skills-copilot-codespaces-vscode'
      ? 'Slug mantido para preservar exercícios e workflows do GitHub Skills.'
      : 'Slug mantido para proteger a URL da demonstração no GitHub Pages.'
  lines.push('| `' + project.legacySlug + '` | [' + project.slug + '](' + project.url +
    ') | ' + project.title + ' | ' + why + ' |')
}
lines.push(
  '',
  '**Observação:** os links de demonstrações antigas de Angular e Star Wars não foram migrados; os nomes editoriais mudaram, mas o repo preserva a URL original.',
  '',
  '## Catálogo e melhorias',
  ''
)
for (const group of standaloneGroups) {
  lines.push('### ' + group.title, '', group.detail, '')
  for (const project of standaloneProjects.filter(item => item.group === group.id)) {
    lines.push(
      '#### [' + project.title + '](' + project.url + ')', '',
      '**Antes:** `' + project.legacySlug + '` · **Estado:** ' + project.stage +
        ' · **Stack:** ' + project.stack.join(', ') + '.', '',
      '**Finalidade:** ' + project.purpose, '',
      '**Resumo:** ' + project.summary, '',
      '**Próximo teste:** ' + project.nextStep, '',
      '[Ler documentação técnica original](' + project.briefUrl + ')', ''
    )
    if (project.demoUrl) lines.push('[Abrir demonstração funcional](' + project.demoUrl + ')', '')
  }
}
lines.push(
  '## Critério para promover um projeto à vitrine principal', '',
  '1. README com objetivo, origem, autoria e passo de reprodução verificado.',
  '2. Um fluxo funcional e pelo menos um teste que cubra erro ou entrada inválida.',
  '3. Nenhuma credencial nem dado pessoal exposto. Use dados sintéticos.',
  '4. Evidência visual/CLI/log com resultado real e limitações explícitas.',
  '5. CI marcado como aprovado apenas depois de execução; billing lock não é teste falho.', '',
  '## Validação do portfólio', '',
  '```bash',
  'npm test',
  'npm run build',
  'npm run check:build',
  'BASE_URL=http://127.0.0.1:4396 python scripts/e2e_standalone_projects.py',
  '```',
  '',
  'O catálogo web usa src/data/standalone-projects.js como fonte de nomes, URLs e escopo. A busca em PublicArchive também reconhece os nomes históricos.',
  '',
  '**Estado atualizado:** reparos de código e testes executados em Finance Dashboard, Star Wars Explorer, Portfolio UI Experiments, Java Algorithms e Java OOP. Travel Planner API passou em 22 testes; Order Management CLI validou o ciclo de pedido. Três demos React estão no GitHub Pages. Repositórios puramente didáticos não foram transformados artificialmente em apps. O CI remoto pode continuar bloqueado por cobrança.',
  ''
)
writeFileSync(new URL('../design/standalone-projects/README.md', import.meta.url), lines.join('\n'))
console.log('Standalone project handbook updated:', standaloneProjects.length, 'projects')
