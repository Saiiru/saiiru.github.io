# Pesquisa aplicada: portfólios, movimento e confiabilidade

Esta revisão começa pelos dois repositórios existentes, antes de propor novos projetos. Não importa projetos, textos ou resultados de terceiros como experiência do autor.

## Referências examinadas

| Fonte primária | Inspeção e aproveitamento |
| --- | --- |
| [Brittany Chiang](https://brittanychiang.com/) e [bchiang7/v4](https://github.com/bchiang7/v4) | Site e README: hierarquia clara, trajetória legível, links de código e arquivo separado. Aplicação: explorar o arquivo sem misturar tecnologias com projetos. |
| [Hamish Williams](https://hamishw.com/) e [HamishMW/portfolio](https://github.com/HamishMW/portfolio) | Site e README: trabalho à frente da decoração, narrativa e movimento com função. Mantida a implementação leve existente; não se importou Three.js nem trabalhos do autor. |
| [Eacaw/eacaw.dev](https://github.com/Eacaw/eacaw.dev) | README: consistência de linguagem visual cyberpunk. O site ao vivo não foi inspecionado. Não se adotaram CMS, Firebase ou a pilha do projeto. |
| [web.dev: animações eficientes](https://web.dev/articles/animations-guide) | Preferir transform/opacity e evitar repintura contínua de grandes superfícies. O ruído de fundo passou de background-position para transform. |
| [Vite: env e mode](https://vite.dev/guide/env-and-mode) | mode production e NODE_ENV não são equivalentes. Encontrado NODE_ENV=development global no PC; o build agora fixa produção apenas no processo. |
| [MDN: CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) | Política estática restrita por meta, limites de cabeçalhos documentados em SECURITY.md. |
| [MDN: perda de contexto WebGL](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event) | Interromper renderização e manter contato funcional quando o contexto gráfico é perdido. |

As referências anteriores de Cyber Grotesk, CyberArch, DedSec/Watch Dogs e Nothing Portfolio continuam registradas em design/recon/, design/contextual-signals/ e DESIGN.md. A paleta atual é carvão, mint e coral; a pesquisa não significa trocar a identidade por um template ou copiar assets de jogos.

## Movimento por função

| Local | Função e limite |
| --- | --- |
| Marca SAIRU e rótulos | Glitch finito na entrada e ao entrar com ponteiro fino; sem botão de efeitos, sem execução contínua. Texto base legível. |
| Links e filtros | Estados de hover/foco/seleção distinguíveis; feedback curto. |
| Fundo ambiente | Deslocamento lento via transform; pausa quando a aba está oculta. |
| Contato | Shader original em chunk separado, carregado apenas na aproximação da seção. Até 30 fps/DPR 1,25; pausa fora da tela/aba oculta. |
| Movimento reduzido | Sem loops decorativos; campo estável. Falha de WebGL usa gradiente CSS. |

## Reparos dos repositórios

- Ada Commerce: validação no caminho ativo da CLI, estoque e quantidades, preservação de preços dos itens, sequência de status e notificações únicas. Build Java 17 e 18 testes JUnit passaram; execução da CLI instalada percorreu compra, pagamento e entrega simulada. Projeto em equipe, dados em memória.
- Plann.er: instalação com SQLite e migrations, build compilado, previews locais de e-mail, datas/atividades consistentes, validação de links e CORS PUT. Typecheck, 22 testes de integração, build e fluxo HTTP real passaram; npm audit sem alertas. API local sem frontend, autenticação ou confirmação assinada.
- O Actions do Ada não iniciou por bloqueio de cobrança da conta: isso é diferente de testes remotos aprovados. A evidência funcional citada é local.

## Medições antes/depois

Três contextos frios Chromium 390×844, CPU 4×, latência 80 ms e 200 KB/s. Arquivos perf-before.json e perf-after.json retêm os resultados brutos. Medições de laboratório, não dados de visitantes nem garantia de prazo.

| Medida | Antes | Depois |
| --- | ---: | ---: |
| JavaScript inicial sem compressão | ~420 KB | ~198 KB |
| JavaScript inicial gzip | ~118 KB | ~62 KB |
| LCP mediano no cenário | 2.948 ms | 1.944 ms |
| Soma mediana de long tasks | 293 ms | 66 ms |
| GPU no carregamento inicial | WebGL alocado | Adiada até o contato |

A coleta posterior foi feita antes da última alteração textual nas descrições do arquivo; os nomes de hash e poucos bytes finais diferem. Os valores exatos do build atual são emitidos por npm run check:build. O CLS bruto anterior ficou próximo de 0,000565; o JSON anterior arredondou a mediana para 0,0. Após a correção as três execuções registraram 0.

## Verificação visual e técnica

Uma rodada de capturas desktop/mobile de hero, contato e arquivo está nesta pasta. Revisão independente resultou SHIP sem bloqueadores materiais no escopo inspecionado; não é certificação de acessibilidade ou pentest.

Suítes atuais: e2e_toolkit.py, e2e_recon.py e e2e_hardening.py. Verificam responsividade, conteúdo verdadeiro, links, movimento, pausa oculta/reduzida, fallback gráfico, CSP e navegação por teclado. A manutenção preserva as capturas históricas de design/recon/ em separado.

## Falha de conexão no efeito

Um teste adicional abortou o download do chunk do contato e reproduziu a remoção da interface pelo erro do lazy import. A correção adiciona um limite de erro local ao elemento decorativo. A regressão agora exige fundo estático, marca e dois links de contato ainda presentes. Build, orçamento e suíte hardening passaram novamente. O build final é 197.662 bytes de JS inicial, 61.899 bytes gzip; a coleta de laboratório acima antecede esse pequeno tratamento de erro.
