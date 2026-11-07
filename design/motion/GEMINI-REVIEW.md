### 1. Crítica Objetiva: Template Cyberpunk vs. Cyber Grotesk Autoral

A maioria das interfaces rotuladas como "cyberpunk" cai em armadilhas previsíveis de templates de 2018:
*   **Ruído contínuo e sem propósito:** Linhas de scan CRT cobrindo a tela inteira, partículas flutuantes em canvas e glitches em loop infinito que cansam a vista e degradam a leitura em segundos.
*   **Color grading sem hierarquia:** Mistura desordenada de neon ciano e magenta em todos os cantos, anulando o contraste semântico.
*   **Cursores customizados com lag:** Canvas trailing e bolinhas interpoladas que criam atrito de interação, quebram em touch devices e aumentam o input lag percebido.

**Diretriz para uma estética autoral:**
O estilo **Cyber Grotesk** baseia-se em brutalismo editorial, tipografia geométrica massiva e contraste austero.
* O amarelo primário (`#ffd22e`) deve reter o comando estrutural, peso tipográfico e impacto de sinalização industrial sobre o preto quente (`#11130f`).
* As cores adicionais atuam estritamente como sinais funcionais de dados: **Magenta (`#ff4aad`)** para dispersão óptica e microfalhas; **Cyan (`#41f4e5`)** para foco, conexões ativas e estados de tracking; **Violeta (`#a88bff`)** para metadados secundários, tags técnicas no toolkit e notas de versão.
* A animação deve ser **tátil e finita**: glitches ocorrem em rajadas curtas (bursts) sob demanda ou gatilho mecânico, funcionando como feedback de hardware analógico de alta precisão.

---

### 2. Especificação de Movimento

Nenhum elemento deve flutuar ou ter easing elástico (bouncy). A física da interface combina cortes mecânicos (*stepped/linear*) com desacelerações editoriais ultrarrápidas (*snappy quintic ease-out*).

| Tipo de Interação | Duração | Easing / Curva | Propriedades Afetadas |
| :--- | :--- | :--- | :--- |
| **Micro-interações (Hover/Foco)** | `140ms` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | `transform`, `border-color`, `box-shadow` |
| **Glitch Burst (Gatilho/Hover Hero)** | `240ms` | `steps(2, jump-none)` ou linear fracionado | `clip-path`, `transform`, `opacity` |
| **Scanner Sweep (CTA)** | `650ms` | `cubic-bezier(0.25, 1, 0.5, 1)` | `transform` (translada eixo X via `translate3d`) |
| **Staggered Reveal (Projetos)** | `420ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | `transform`, `opacity` (delay: `70ms` por linha) |
| **Mouse Tracking Light** | `180ms` | Lerp via CSS Custom Properties | `--mouse-x`, `--mouse-y` (radial-gradient sutil) |

---

### 3. Snippets CSS Robustos

#### A. Hero Glitch com Camadas SVG Duplicadas e Split RGB
O `<h1>` permanece semântico. As cópias visuais utilizam `aria-hidden="true"` e ficam restritas a um container controlado.

```html
<header class="hero" data-motion-container>
  <!-- Luz de mouse tracking sutil -->
  <div class="hero__tracker" aria-hidden="true"></div>

  <div class="hero__brand">
    <h1 class="hero__title">
      <span class="sr-only">SAIRU</span>

      <!-- Camada Base Visível -->
      <svg class="hero__svg hero__svg--base" aria-hidden="true">...</svg>

      <!-- Camada Glitch Cyan (Shift Negativo) -->
      <svg class="hero__svg hero__svg--layer hero__svg--cyan" aria-hidden="true">...</svg>

      <!-- Camada Glitch Magenta (Shift Positivo) -->
      <svg class="hero__svg hero__svg--layer hero__svg--magenta" aria-hidden="true">...</svg>
    </h1>
  </div>

  <button class="glitch-trigger" type="button" aria-label="Disparar pulso glitch">
    EXEC_GLITCH
  </button>
</header>
```

```css
:root {
  --bg-warm: #11130f;
  --yellow-main: #ffd22e;
  --cyan-accent: #41f4e5;
  --magenta-accent: #ff4aad;
  --violet-accent: #a88bff;
}

.hero {
  position: relative;
  background-color: var(--bg-warm);
  overflow: hidden;
}

/* Mouse tracking leve: 320px, sem interferir no cursor do SO */
.hero__tracker {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    320px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(65, 244, 229, 0.08),
    transparent 70%
  );
  will-change: background;
}

.hero__title {
  position: relative;
  display: inline-block;
  margin: 0;
}

.hero__svg {
  display: block;
  width: 100%;
  height: auto;
  fill: var(--yellow-main);
}

.hero__svg--layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
}

.hero__svg--cyan {
  fill: var(--cyan-accent);
  mix-blend-mode: screen;
}

.hero__svg--magenta {
  fill: var(--magenta-accent);
  mix-blend-mode: screen;
}

/* Disparo do Glitch: foco, hover no container ou classe ativa via botão */
.hero__title:hover .hero__svg--layer,
.hero__title:focus-within .hero__svg--layer,
.is-glitching .hero__svg--layer {
  opacity: 1;
}

.hero__title:hover .hero__svg--cyan,
.hero__title:focus-within .hero__svg--cyan,
.is-glitching .hero__svg--cyan {
  animation: glitch-anim-cyan 240ms steps(2, jump-none) forwards;
}

.hero__title:hover .hero__svg--magenta,
.hero__title:focus-within .hero__svg--magenta,
.is-glitching .hero__svg--magenta {
  animation: glitch-anim-magenta 240ms steps(2, jump-none) forwards;
}

@keyframes glitch-anim-cyan {
  0% {
    clip-path: polygon(0 2%, 100% 2%, 100% 18%, 0 18%);
    transform: translate3d(-3px, 1px, 0);
  }
  35% {
    clip-path: polygon(0 54%, 100% 54%, 100% 68%, 0 68%);
    transform: translate3d(2px, -1px, 0);
  }
  70% {
    clip-path: polygon(0 82%, 100% 82%, 100% 96%, 0 96%);
    transform: translate3d(-2px, 0, 0);
  }
  100% {
    clip-path: polygon(0 0, 0 0, 0 0, 0 0);
    transform: translate3d(0, 0, 0);
    opacity: 0;
  }
}

@keyframes glitch-anim-magenta {
  0% {
    clip-path: polygon(0 35%, 100% 35%, 100% 50%, 0 50%);
    transform: translate3d(3px, -1px, 0);
  }
  40% {
    clip-path: polygon(0 10%, 100% 10%, 100% 25%, 0 25%);
    transform: translate3d(-2px, 2px, 0);
  }
  75% {
    clip-path: polygon(0 68%, 100% 68%, 100% 80%, 0 80%);
    transform: translate3d(3px, 0, 0);
  }
  100% {
    clip-path: polygon(0 0, 0 0, 0 0, 0 0);
    transform: translate3d(0, 0, 0);
    opacity: 0;
  }
}
```

#### B. CTA Brutalista com Cantos Chanfrados e Scanner Sweep
Botão tático sem dependência de divs adicionais, empregando `clip-path` chanfrado e feixe de luz via pseudo-elemento.

```css
.cta-button {
  --btn-bg: var(--yellow-main);
  --btn-fg: var(--bg-warm);
  --chamfer-size: 10px;

  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 28px;
  background-color: var(--btn-bg);
  color: var(--btn-fg);
  font-family: monospace;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border: none;
  cursor: pointer;
  overflow: hidden;
  clip-path: polygon(
    var(--chamfer-size) 0%,
    100% 0%,
    100% calc(100% - var(--chamfer-size)),
    calc(100% - var(--chamfer-size)) 100%,
    0% 100%,
    0% var(--chamfer-size)
  );
  transition: transform 140ms cubic-bezier(0.2, 0.8, 0.2, 1),
              background-color 140ms ease;
}

/* Fita de scanner em gradiente de cyan e magenta */
.cta-button::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: -100%;
  width: 50%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(65, 244, 229, 0.6) 50%,
    rgba(255, 74, 173, 0.8) 100%
  );
  transform: skewX(-20deg);
  pointer-events: none;
}

.cta-button:hover,
.cta-button:focus-visible {
  transform: translateY(-2px);
  background-color: #ffe066;
  outline: 2px solid var(--cyan-accent);
  outline-offset: 3px;
}

.cta-button:hover::after,
.cta-button:focus-visible::after {
  transform: skewX(-20deg) translate3d(350%, 0, 0);
  transition: transform 650ms cubic-bezier(0.25, 1, 0.5, 1);
}

.cta-button:active {
  transform: translateY(1px);
}
```

#### C. Progressive Enhancement: Staggered Reveals sem Quebra de Acessibilidade
O conteúdo permanece 100% visível por padrão se o JavaScript falhar ou for desabilitado.

```css
/* Estado Padrão (Sem JS): Visível e Funcional */
.project-row {
  opacity: 1;
  transform: none;
}

/* Ativado somente via JS no React quando montado */
.js-observer-ready .project-row {
  opacity: 0;
  transform: translate3d(0, 18px, 0);
  transition: opacity 420ms cubic-bezier(0.16, 1, 0.3, 1),
              transform 420ms cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: calc(var(--row-index, 0) * 70ms);
  will-change: opacity, transform;
}

.js-observer-ready .project-row.is-revealed {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}
```

#### D. Desligamento Centralizado: Reduced Motion e Toggle Manual
Respeita o sistema operacional e a preferência declarada do usuário (`data-motion="off"`).

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-allowed: 0;
  }
}

[data-motion="off"] {
  --motion-allowed: 0;
}

@media (prefers-reduced-motion: reduce), (update: slow) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .hero__tracker {
    display: none !important;
  }
  .hero__svg--layer {
    display: none !important;
  }
  .project-row {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}

/* Quando o botão de EFEITOS OFF estiver ativado na raiz */
[data-motion="off"] *,
[data-motion="off"] *::before,
[data-motion="off"] *::after {
  animation: none !important;
  transition: none !important;
}

[data-motion="off"] .hero__tracker,
[data-motion="off"] .hero__svg--layer {
  display: none !important;
}
```

---

### 4. 6 Testes de Comportamento para QA e Auditoria

1. **Robustez sem JavaScript (No-Script Baseline):**
   * *Ação:* Desabilite o JavaScript no DevTools e recarregue a página.
   * *Critério de Sucesso:* Todas as linhas de projetos editoriais, prints, textos do terminal e o SVG geométrico do Hero devem estar visíveis e interativos imediatamente, sem `opacity: 0` retida nem travamento de layout.

2. **Toggle Manual de Movimento (`EFEITOS ON/OFF`):**
   * *Ação:* Alterne o switch na UI que injeta `data-motion="off"` no `<html>` ou `<body>`.
   * *Critério de Sucesso:* Animações de glitch param instantaneamente, o scanner dos CTAs não se desloca, a luz radial de tracking do hero é ocultada e nenhuma transição CSS é disparada ao passar o mouse ou focar.

3. **Validação do Sistema Operacional (`prefers-reduced-motion`):**
   * *Ação:* Emule `prefers-reduced-motion: reduce` através do painel de renderização do browser.
   * *Critério de Sucesso:* O site deve renderizar em seu estado estático de alto contraste. O botão explícito de glitch deve exibir um aviso de estado desativado ou feedback visual puramente instantâneo e não animado.

4. **Isolamento Semântico e Leitor de Tela (Screen Reader A11y):**
   * *Ação:* Navegue pela seção hero utilizando VoiceOver ou NVDA.
   * *Critério de Sucesso:* O leitor de tela deve anunciar o título principal "SAIRU" exatamente uma vez. As camadas decorativas SVG duplicadas recortadas em magenta e cyan devem ser completamente ignoradas pelo leitor via `aria-hidden="true"`.

5. **Navegação Contínua por Teclado (`Tab` e Foco):**
   * *Ação:* Percorra o documento exclusivamente via teclado (`Tab` / `Shift+Tab`).
   * *Critério de Sucesso:* Focar no CTA ou no disparador de glitch deve produzir um indicador visual em Cyan (`#41f4e5`) nítido com `outline-offset`, acionar um pulso único e não prender o foco (*focus trap* indesejado).

6. **Teste de Estresse Touch e Prevenção de Sticky Hover em Mobile:**
   * *Ação:* Abra a interface em um dispositivo touch ou emulador tátil e toque no título do hero e nos botões.
   * *Critério de Sucesso:* Os efeitos de split RGB não devem ficar permanentemente "congelados" na tela após o término do toque (evitando o clássico problema de `:hover` preso no mobile); a luz do cursor deve se omitir graciosamente sem causar repaint contínuo.
