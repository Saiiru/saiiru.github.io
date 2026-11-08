# Sairu — portfólio e perfil GitHub

Pasta principal: /home/sairu/workspace/software/portfolio

| Pasta | O que editar aqui |
| --- | --- |
| site/ | Site React/Vite publicado em saiiru.github.io. Este é o código ativo. |
| profile/ | Perfil GitHub Saiiru/Saiiru: README e painéis SVG, sem projetos por enquanto. |
| experiments/evalforge-workflow/ | Worktree do experimento EvalForge/Obsidian. Separado do site ativo. |
| references/ | Referências de terceiros, para consulta; não é o código publicado. |
| archive/ | Protótipos, scripts de transformação e logs de sessões anteriores. Preservados, sem uso no build. |

## Trabalhar no site

Entre em site/ e use npm run dev. npm run build gera docs/, o diretório do GitHub Pages. Edite src/ e public/; não edite o bundle gerado em docs/assets/.

- Identidade e contato: src/recon-identity.css, src/components/SignalField.jsx e public/brand/sairu-mark.svg.
- Dados e leitores de projeto: src/components/ e src/data/.
- Evidências e decisões: design/.
- Verificações atuais: python3 scripts/e2e_recon.py e python3 scripts/e2e_human.py, com docs servido na porta 4392.
- Testes de lógica das demos: npm --prefix projects/ai-builder-labs test.
- Os scripts e2e antigos preservam expectativas de versões anteriores; consulte scripts/README.md.

## Trabalhar no perfil

Entre em profile/. Edite README.md, assets/profile.svg e assets/languages.svg. O README atual apresenta identidade, tecnologias e links. Os projetos serão escolhidos e documentados em uma próxima etapa.

## Caminhos de compatibilidade

A pasta datada blacksite-ai-builder-20261107 aponta para esta pasta. O caminho antigo do protótipo portfolio-github-2026 aponta para archive/first-prototype-2026. O atalho evalforge-workflow continua apontando para o worktree em experiments/. Esses links preservam comandos, sessões e referências anteriores.

Nenhum firmware, CAD, serviço KORA ou projeto de outra área foi reorganizado nesta etapa. Não reinstale dependências nem clone outra cópia para começar: site/ e profile/ são os dois repositórios ativos.
