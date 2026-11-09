# CodePen, CyberArch e implementação independente

O material anexado pelo usuário descrevia separação RGB, recortes, ruído, scanlines e decodificação. Foi usado como pauta, não como código pronto: o exemplo de loops infinitos e alteração contínua do texto foi substituído por estados finitos, nome acessível estável e limpeza de recursos.

## Pens examinados

| Fonte primária | Técnica consultada | Decisão aplicada |
| --- | --- | --- |
| [jh3y — CSS CyberPunk Buttons](https://codepen.io/jh3y/pen/BajVmOg) | Variáveis de cor, recortes por inset e deslocamentos no hover. | Feedback finito e foco equivalente; não importar a fonte comercial do exemplo. |
| [Sandrina Pereira — Watch Dogs CSS](https://codepen.io/sandrina-p/pen/RRWaYO) | Deslocamento de sombras/canais sobre texto. | Texto base estável com camadas decorativas separadas. |
| [Mostafa — Watch Dogs Glitch](https://codepen.io/mostafazke/pen/XERXeY) | Faixas de imagem com recorte e tradução. | Aplicar o princípio a geometria original, sem imagem de jogo ou loop permanente. |
| [Gábor — Cyberpunk Button](https://codepen.io/leszlauergabor/pen/qBybomV) | Cantos recortados e estados de hover/foco. | Moldura reutilizável com pulso curto nos links reais do portfólio. |
| [Ahmod Musa — Holographic Card](https://codepen.io/Ahmod-Musa/pen/KwMdeBR) | Perspectiva por posição do ponteiro e moldura holográfica. | Baixa amplitude e geometria própria; sem camadas invisíveis de links sobre o conteúdo. |
| [xdega — Cyberpunk Navigation](https://codepen.io/xdega/pen/dyqXarJ) | Separação cromática aplicada à navegação. | Estados acionáveis e legíveis, sem distorcer o corpo de leitura. |
| [hsu-28 — Glitchy Button](https://codepen.io/hsu-28/pen/KKbmqab) | Resposta curta ao hover/foco. | Foco nativo continua visível; movimento reduzido conserva o estado. |
| [Vineeth Pappu — Watch Dogs](https://codepen.io/vineeth-pappu/pen/bGwOPxa) | Variação de composição em camadas. | Referência adicional de técnica, sem assets externos. |

Os Pens foram consultados como referências técnicas; não foram auditados como produtos. Nenhum código deles foi incorporado nesta entrega. URLs podem mudar; o inventário do CyberArch, por sua vez, fixa commit e hashes.

## CyberArch

Origem: `ARCANGEL0/CyberArch-Shell@8c6fa4fae6cc043f8d7f809d48f1a642381a05dc`; o endereço antigo CyberArch-Dotfiles redireciona para esse repositório.

O inventário leu fontes GTK/Cairo TypeScript, QML, GLSL, Lua, C e configurações, além de 45 arquivos dos nove pipelines Rio. O efeito de workspace efetivo vem de `anim.ts`; `glitch.frag` aparece como referência sem ligação de runtime identificada. Isso evita atribuir ao shader um comportamento que ele não produz no shell atual.

As 30 famílias são representadas por 24 demos e seus estados internos. Os CRT preservam motivos identificáveis — hélice, moldura industrial, lua/neblina, placa carmesim, holograma, fósforo quente, estrelas/laço, pixels e synth — por desenho original em Canvas. Não implementam o feedback Slang multipasse.

## Aplicação no portfólio

A galeria é uma entrada separada. No site principal, molduras breves respondem ao foco e ao ponteiro nos links do arquivo e contato; o restante da biblioteca não entra no carregamento inicial. A identidade existente e o shader autoral do contato foram preservados.

Uma rodada visual reuniu as 24 prévias desktop e amostras móveis. A revisão encontrou e corrigiu restauração de navegação e retenção de eventos nas buscas. A verificação de movimento encontrou o caso do relógio reduzido: informação temporal precisa continuar funcionando mesmo quando o movimento decorativo é eliminado. Capturas e resultados locais ficam em `design/quality/components/`.

## Aplicação adicional no site principal

Novas referências de HUD, recortes e CRT: [pesquisa e aplicação](../design/portfolio-signals/RESEARCH.md). São três Pens adicionais às oito referências acima. A página principal usa registro HUD finito na assinatura e superfície CRT no terminal; não importa o runtime das demos.
