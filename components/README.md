# BLACKSITE / Biblioteca de interfaces

24 demonstrações originais em HTML, CSS e JavaScript, organizadas para explorar e reutilizar técnicas visuais. [Abrir biblioteca](https://saiiru.github.io/components/).

O mapa de origem cobre 30 famílias encontradas em 142 arquivos do CyberArch Shell, fixado em `8c6fa4fae6cc043f8d7f809d48f1a642381a05dc`. É uma coleção de **equivalentes visuais web**, não uma conversão executável do desktop. Os nove presets CRT são estudos em Canvas 2D, sem o pipeline temporal multipasse Slang.

## Executar e verificar

Na raiz do repositório:

```sh
npm ci
npm run dev
# Abra http://127.0.0.1:5173/components/
npm run build
npm run check:build
npm run check:components
python3 -m http.server 4392 --directory docs --bind 127.0.0.1
# Em outro terminal, com Python/Playwright e /usr/bin/chromium:
python3 scripts/e2e_components.py
```

O Vite só constrói os arquivos. O runtime da biblioteca usa módulos ES padrão e APIs do navegador, sem React, jQuery, GSAP ou outra biblioteca. O portfólio principal importa apenas o pequeno feedback de moldura; as demos completas são carregadas na página `/components/`.

## Reutilizar uma peça

Inclua os estilos, um contêiner e o módulo escolhido. Os tokens são escopados pela classe `ca-library`; adapte seus papéis ao sistema de cor da página.

```html
<link rel="stylesheet" href="./components/gallery.css">
<section class="ca-library">
  <div id="scene" class="ca-demo"></div>
</section>
<script type="module" src="./example.js"></script>
```

```js
import { createLifecycle } from './components/core/lifecycle.js'
import { signalEffects } from './components/effects/signals.js'

const host = document.querySelector('#scene')
const life = createLifecycle(host)
const effect = signalEffects.find(item => item.id === 'channel-split')
const cleanup = effect.mount(host, life)

// Ao desmontar a tela:
// if (typeof cleanup === 'function') cleanup()
// life.dispose()
// host.replaceChildren()
```

Para publicar sem Vite, copie a pasta `components` mantendo a estrutura dos módulos; sirva por HTTP. Os efeitos não precisam de bundler em execução. A galeria completa usa `/fonts/Oxanium.ttf` e `/brand/sairu-mark.svg`, que devem ser servidos nas mesmas rotas, ou substituídos por assets próprios. Um fallback de fonte não altera o funcionamento.

## Catálogo

| Módulo | Peças |
| --- | --- |
| `effects/signals.js` | Ruptura cromática, corte de cena, decodificação, placa holográfica, entrada de painel, oito paletas |
| `effects/panels.js` | HUD, medidores, busca por teclado, notificações/histórico/detalhes, player visual, abas/controles, OSD, seleção/REC simulado, dock |
| `effects/displays.js` | Nove perfis CRT, espectro sintético, radar/mapa, clima fictício, chuva de glifos |
| `effects/scenes.js` | Scanner/mira, sequência de boot, terminal de dados sintéticos, editor de composição do HUD |
| `effects/frame.js` | Feedback finito de moldura, reutilizado nos links reais do portfólio |

As entradas exportam `{ id, title, category, summary, sourcePaths, mount(host, life) }`. `catalog.json` registra os metadados; `reference/coverage-map.json` relaciona famílias, arquivos originais e componentes.

## Contrato de movimento

- `life.listen()` registra eventos com limpeza; `life.cleanup()` registra outros recursos.
- `life.animate(draw, fps)` limita a 30fps no máximo; os displays usam até 24fps e DPR até 1,25.
- Fora do viewport ou com a aba oculta, o loop para. Em movimento reduzido, desenha uma composição estável. O segundo argumento de `draw(time, reduced)` identifica esse estado; não use o tempo reduzido para calcular deltas de relógio.
- O player mantém o contador sem movimento decorativo, em frequência de 1Hz, somente após ação do usuário. Sem reprodução de áudio.
- `life.dispose()` cancela frames, observers, eventos e recursos registrados.
- O cache de navegação preserva os controles; restauração por `pageshow` reavalia a animação.
- Canvas indisponível deixa a descrição e os controles legíveis. Sem JavaScript, a página aponta para o código.

## Paletas

O perfil padrão mantém carvão, mint e coral do portfólio. `core/nord.css` é um **adaptador gerado** a partir de `Saiiru/dotfiles/themes/palettes/nord-recon.toml`, com hash e papéis em `reference/nord-source.json`. Não é outra fonte canônica para o desktop.

```sh
python3 components/scripts/export-nord.py --source ~/dotfiles/themes/palettes/nord-recon.toml --check
```

As oito paletas da demo são fatos de cor extraídos do `colors.ts` da referência fixada, adaptados à superfície escura desta biblioteca. Não instalam nem trocam temas do sistema.

## Proveniência e limites

- [Inventário visual](reference/visual-inventory.json) e [mapa completo](reference/coverage-map.json): caminhos, hashes, origem fixada e limites por família.
- [Pesquisa de CodePen](RESEARCH.md): autores e técnicas consultadas, sem fontes comerciais ou imagens copiadas.
- O CyberArch de referência não apresenta licença global identificada. Não foi incorporado seu código sem licença, arte, fontes ou sons. Os componentes são implementações independentes; a licença MIT do repositório cobre o código original daqui.
- PAM/SDDM, workspaces Hyprland, comandos de energia, mixer, rede, Bluetooth, processos, atualizações e sensores reais precisam de integrações nativas. As demos não executam essas ações.
- A seleção de área não captura nem grava a tela. REC é uma simulação visual finita. Captura real exigiria API e consentimento explícito do navegador.
- Clima, gráficos, notícias, níveis e faixas são dados fictícios identificados. Não há microfone, câmera, telemetria ou serviços de terceiros.
- A cobertura de arquivos registra origem e correspondência visual; não comprova paridade de cada função nativa nem fidelidade pixel a pixel.

Validação local, capturas e escopo de revisão ficam em `design/quality/components/`. Isso não é um pentest nem certificação formal de acessibilidade.

## Utilitários aplicados na página principal

effects/signature.css define uma moldura SVG com pulso por data-glitch=active; effects/crt.css define a superfície crt-surface e o filho decorativo crt-scanlines. Exemplo real de HTML/estado em src/App.jsx. Ambos respeitam movimento reduzido e não criam loops permanentes. Pesquisa: design/portfolio-signals/RESEARCH.md.
