# Verificação do portfólio

Sirva o build atual na porta 4392 antes de executar os testes de navegador.

Comandos atuais:
- python3 scripts/e2e_recon.py — privacidade do contato, marca/paleta, animação WebGL, pausa fora de tela, movimento reduzido, fallback, cinco larguras e menu.
- python3 scripts/e2e_human.py — arquivo público, busca/forks/paginação, datashards, abas, glitch em cada entrada do mouse, fundo reativo, menu e mobile.
- npm --prefix projects/ai-builder-labs test — regras e recuperação das três demos.

Os scripts e2e_blacksite, e2e_cybergrotesk e e2e_motion* preservam expectativas de versões anteriores, como botão de tema claro, cooldown do glitch e nomes antigos de abas. Não são o conjunto de aceitação da interface atual.
