# Aplicação no portfólio principal

A biblioteca anterior permanece em /components/ com 24 demonstrações. Esta etapa aplica linguagem visual na página principal: registro HUD acompanha o pulso existente da marca; superfície CRT envolve o terminal real; o acesso à biblioteca aparece junto da chamada de abertura.

## Referências adicionais do CodePen

| Fonte | Técnica observada | Aplicação independente |
| --- | --- | --- |
| [David B. Waters — HUD CyberPunk Backgrounds](https://codepen.io/davidbwaters/pen/bGEJwoR) | Molduras, guias e entradas de borda por transform. | SVG próprio com quatro registros e acentos mint/coral ao redor do letreiro. |
| [mattgrosswork — Cyberpunk-Style Glitch Walkthrough](https://codepen.io/mattgrosswork/pen/VwprebG) | Recortes em camadas, deslocamento e opacidade. | O pulso finito existente aciona também a varredura; nenhuma distorção contínua é aplicada ao texto de leitura. |
| [fyildiz1974 — CRT Terminal Distortion](https://codepen.io/fyildiz1974/pen/ogLdjvo) | Scanlines, canais RGB e interferência de terminal. | Textura estática atrás do texto e resposta curta ao foco; sem tremor da página ou flicker permanente. |

Nenhum código ou asset desses Pens foi copiado. O terminal continua local, com comandos fixos e saída escapada. Os efeitos não executam comandos do sistema.

## Reuso e limites

- components/effects/signature.css: registro geométrico e varredura, acionados por data-glitch=active. O SVG e o estado React ficam em src/App.jsx; o mesmo estado pode ser dirigido por JavaScript em outra página.
- components/effects/crt.css: superfície e scanlines atrás dos filhos de conteúdo, resposta finita de foco e alternativa de movimento reduzido.
- components/effects/frame.js: realimentação de moldura compartilhada nos links e terminal.
- O texto acessível da marca permanece inteiro. Preferência de movimento reduzido remove as animações novas.
- Não há dependência, Canvas, WebGL ou loop JavaScript novo. O shader anterior do contato mantém seu carregamento adiado.

## Evidências

Build e orçamento passaram. JS inicial incluindo modulepreload: 199.789 bytes / 62.730 bytes gzip; CSS: 66.342 / 14.842 gzip. Biblioteca permanece em outra entrada.
e2e_main_signals.py passou a 320/390/768/1440px: entrada/hover repetido, fim do pulso, link real com alvo de 44px, terminal com saída real, movimento reduzido e limites de layout.
e2e_toolkit.py, e2e_hardening.py e e2e_recon.py também passaram, incluindo CSP/entrada escapada, GPU adiada e falha de shader. A inspeção desktop/mobile do hero e terminal não encontrou bloqueadores materiais; não é auditoria formal.
