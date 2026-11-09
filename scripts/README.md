# Verificação da interface atual

Use npm ci, npm run build e npm run check:build. Sirva docs/ na porta 4392:

    python3 -m http.server 4392 --directory docs --bind 127.0.0.1

Os scripts Python precisam de playwright e Chromium em /usr/bin/chromium. No PC do autor esses pré-requisitos já estavam disponíveis. BASE_URL permite verificar outra origem.

- python3 scripts/e2e_toolkit.py — tecnologias sem projetos, níveis de estudo, retirada dos protótipos sugeridos da vitrine, terminal, âncoras e quatro larguras.
- python3 scripts/e2e_recon.py — cinco larguras, identidade, privacidade, campo WebGL, pausa fora da tela, movimento reduzido e fallback gráfico. Atualiza imagens em design/recon/; mantenha evidências históricas separadas ao comparar versões.
- python3 scripts/e2e_hardening.py — GPU/chunk adiados, assets locais, CSP, entrada escapada, Escape e foco, aba oculta, movimento reduzido, perda de contexto, download interrompido do shader e fallback sem JavaScript; busca e categoria de Ada/Plann.er no arquivo.
- python3 scripts/e2e_motion_budget.py — faixa animada somente no viewport, pausa/retomada, movimento reduzido e fallback sem observer a 390 e 1440px.
- npm run check:build — orçamento de 75 KiB de JS inicial e 18 KiB de CSS em gzip, sem mapas de depuração, CSP/noscript presentes, destinos HTTPS GitHub no inventário.
- npm audit — vulnerabilidades conhecidas das dependências instaladas.
- npm --prefix projects/ai-builder-labs test — lógica dos protótipos preservados; não representa projetos selecionados para a vitrine.

Os demais scripts registram expectativas de interfaces anteriores (datashards sugeridos, tema claro, nomes de abas e cooldown). Não são critérios de aceitação da vitrine atual. Os testes não substituem uma auditoria formal.
