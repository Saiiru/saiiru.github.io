# SAIRU / BLACKSITE — current implementation, 2026-11-09

Surface mode: **Experience**. A typography-led portfolio with an original geometric SAIRU wordmark, factual professional history, technologies and a public repository archive. Current identity overrides are scoped to `.portfolio` in `src/recon-identity.css`; older yellow declarations in base styles are historical layers.

## Visual system

| Role | Token | Purpose |
| --- | --- | --- |
| Ink | `#0b0b13` | Charcoal-indigo foundation |
| Paper | `#edf2f5` | Primary readable text |
| Muted | `#b5bdc9` | Supporting copy and metadata |
| Rule | `#343647` | Quiet structural boundaries |
| Signal | `#8dffb3` | Green identity, actions, selected states and focus |
| Counter-signal | `#ff5c73` | Coral attention and identity details |
| Cyan / violet | `#63e3f4` / `#b294ff` | Distinguish technical project accents |

A distribuição usa carvão com fundo índigo como base; verde-luz é a cor de ação e foco; coral marca atenção e o traço da marca; ciano e violeta diferenciam os laboratórios. Superfícies amarelas foram removidas. Nenhuma razão de contraste ou certificação formal de acessibilidade é alegada sem medição.

The original S monogram at `public/brand/sairu-mark.svg` appears in navigation and contact signoff. The large SAIRU wordmark remains original inline vector geometry. Display text uses self-hosted OFL Oxanium; body text uses the system sans stack and technical metadata uses monospace. No commercial Cyber Grotesk font files are used.

## Current content surfaces

The main page mounts **PublicArchive**, the **technologies-only Toolkit**, and the Datashard project reader. The reader links each project to its live demo, implementation, evidence and limits.

Toolkit data is in `src/data/toolkit.js` and selection is implemented in `src/components/Toolkit.jsx`. Software, embedded systems and electromechanics/control are separate groups. Each technology exposes context, learning status and related concepts. Java/Spring includes IoC and dependency injection. CLP/control is a learning interest and frequency drives are planned study, not professional experience. No computing engineering degree or additional job title is claimed.

PublicArchive uses the repository snapshot with curated descriptions from `src/data/repository-notes.json`. Ada Commerce is an educational team CLI in Java 17 with in-memory data and simulated order/payment/delivery flow. Plann.er is an educational TypeScript/Fastify/SQLite travel API for local execution; it has no frontend or authentication layer. Do not describe either as a deployed production service or invent outcomes.

## Contact and deferred field

The Portuguese closing heading is “O próximo passo é uma conversa.” The two channels lead to LinkedIn and GitHub. Personal email and `mailto:` are absent from rendered contact and terminal output.

`DeferredSignalField.jsx` observes the contact scene with a **180px margin**. It requests the separate lazy SignalField chunk and mounts the canvas only when contact approaches; the initial viewport has no shader chunk request or GPU allocation. Without IntersectionObserver, it loads immediately as a compatibility fallback.

`SignalField.jsx` is a newly authored native WebGL contour field using layered noise, domain warping, contour bands, subtle scanline modulation and eased pointer influence. It adds no library, external image, video or tracker. A dark shade keeps copy and channels readable.

The field targets roughly 30fps and caps device pixel ratio at 1.25. Its loop pauses outside an **80px viewport margin** or while the document is hidden. Reduced motion renders a stable frame without a continuous loop. Unavailable WebGL, shader setup failure or subsequent context loss selects the static CSS fallback; context loss cancels pending animation. Cleanup removes observers/listeners and releases resources. A local error boundary also catches a failed lazy chunk download, preserving the entire portfolio and contact links with a static field.

Contact uses two columns on desktop and one below 760px, with 23px gutters below 520px. The decorative edge code remains fixed: the explicit override prevents the earlier relative-positioning defect that added about 296px in document flow.

## Motion and keyboard behavior

The original wordmark stays readable beneath decorative layers. A finite entry pulse starts after 260ms; fine-pointer re-entry restarts it, with a 570ms active-state timer and **no artificial 1500ms cooldown**. Touch does not trigger pointer-entry glitches. Related visual-source and license records remain in the history below.

Ambient drift is a 24s alternating CSS transform animation, replacing continuous background-position work. Document visibility sets `data-page-hidden`, which pauses CSS animations while hidden. OS reduced motion disables drift and decorative motion, including live preference changes. Pointer updates use scheduled frames; content does not depend on motion being available. There is no app-specific effects toggle, persisted effects setting or current light-mode toggle; retained light-mode CSS is compatibility styling.

The mobile menu reports its expanded state. Escape closes it and restores focus to its trigger. Keep the skip link, semantic landmarks, visible focus, technology-selection states, labeled terminal input and polite live output.

The decorative ticker is observed through its stationary wrapper and pauses outside the viewport without resetting its timeline. Without IntersectionObserver it remains static. This behavior and its reduced-motion alternative are covered by scripts/e2e_motion_budget.py at mobile and desktop widths. Additional primary references and the incremental test scope are in design/quality/REFERENCES-EXTRA.md.

## Build and publication constraints

`npm run build` uses `scripts/build.mjs` to set production NODE_ENV before importing Vite and explicitly builds in production mode, even when the caller’s shell exports development NODE_ENV. The toolchain uses Vite 6.4.5 and publishes static output to `docs/` without source maps.

The build-only HTML policy restricts scripts, styles, images, fonts and connections to the same origin; the default is deny, with eval, inline style attributes, frames, workers, objects and form submission disallowed. A referrer policy is emitted alongside it. A `noscript` summary offers the factual identity and GitHub/LinkedIn links.

`npm run check:build` enforces gzip budgets of **75KiB initial JavaScript** and **18KiB CSS**, checks the policy/noscript/no-source-map requirements and validates repository destinations as credential-free HTTPS GitHub URLs. The lazy shader is separate from initial JavaScript. These controls constrain the build; they are not a security guarantee or formal audit.

## Verification boundary and history

The final local production build, build budgets and npm audit passed (zero findings). Toolkit, recon and hardening browser suites passed; recon covers 320, 390, 768, 1280 and 1440px. A scoped independent desktop/mobile review returned SHIP without material blockers. Current measurements, limitations and screenshots are in `design/quality/`. These are local checks and laboratory results, not formal accessibility/security certification. Earlier recon records remain historical evidence.

The 2026-11-07 direction used industrial yellow and editorial screenshot rows. Historical visual references remain Cyber Grotesk (Olga Ryzhychenko), Nothing Portfolio MIT (Ankit Shrestha) and Cybersecurity Portfolio (Pixiei Studio LLC). Datashard catalogue/dossier research in `design/datashards/` describes a preserved, currently unmounted surface.

Chromatic choreography and Gemini review remain in `design/motion/`. The existing MIT Cybercore bands/scanlines adaptation remains attributed in `design/contextual-signals/RESEARCH.md` and retained license files; no Cybercore package is installed. `design/recon/RESEARCH.md` records Mille SVG format inspiration and CyberArch/CodePen technique references. CyberArch’s shader was not copied into the original contour field; its inspected login background uses image/video fallbacks.

Preserve actual paid software history and studies, distinguish learning from experience, and avoid unverified availability, production-impact or guaranteed-security claims. Any preserved offline prototypes retain their synthetic-data, deterministic/local-retrieval and optional-LLM boundaries if surfaced again.

## Browser component library

components/ is a separate HTML/CSS/ES-module experience: 24 original demos, nine approximate CRT profiles and a source-family map pinned to CyberArch Shell. It does not replace the native desktop. Main-page archive/contact links share only finite frame feedback; gallery modules are not in the portfolio initial bundle. components/README.md documents reuse, lifecycle, generated Nord adapter, provenance and limitations. Desktop/mobile captures and local verification scope are in design/quality/components/.

## Main-page signature and CRT surface

The existing finite signature pulse also drives an original SVG registration frame and one bounded scan. The terminal uses a static CRT surface behind readable text and finite focus feedback. The hero includes a direct link to the component library. These refinements preserve the palette, factual copy, accessible title and local command behavior. Sources and scoped four-width verification: design/portfolio-signals/RESEARCH.md.


## Pesquisa aplicada em 2026-11-09

Os nove artigos freeCodeCamp foram triados por pertinência e risco de apresentar trabalho não realizado. A paleta e a cópia do hero foram atualizadas; a ligação entre README, prova visual e projeto está documentada em [design/2026-freecodecamp-applied-reading.md](design/2026-freecodecamp-applied-reading.md). A proposta de um benchmark de roteamento de skills do KORA permanece proposta em [design/luka-routebench-brief.md](design/luka-routebench-brief.md), não integrada nem anunciada como projeto concluído.
