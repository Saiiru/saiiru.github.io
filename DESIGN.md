# BLACKSITE — Cyber Grotesk-led redesign, 2026-11-07

Surface mode: **Experience**. The lead artifact is an original, large geometric SAIRU SVG wordmark. This is a typographic sci-fi editorial poster and professional portfolio, with a continuous sequence of real projects rather than a dashboard or bento hero.

## Visual system

Warm-black ink `#11130f`, industrial-yellow signal `#ffd22e`, paper `#dfdfd1`, secondary text `#a4a79c`, quiet dividers `#3d4035`. Cyan #41f4e5 marks interaction and the first project; magenta #ff4aad marks signal fragments and the second project; violet #a88bff marks the third project. Yellow remains the dominant brand. Square geometry, sharp cut-ins, continuous rules and generous empty space support the typography.

Display text uses self-hosted Oxanium, an open-source OFL font. The dominant SAIRU lettering is original vector geometry, not commercial Cyber Grotesk font outlines. Body copy uses the system sans stack; monospace is reserved for commands, labels, dates and data. No commercial font files or copyrighted reference artwork may be imported.

The hero combines the full-width wordmark, a technical margin, a yellow reverse-type strip and an asymmetric lower composition. Editorial project rows pair real demo screenshots with descriptions, a test-demo action and source/tests links. The yellow biography section preserves actual work history. Toolkit evidence, a local terminal and a large contact invitation continue the same visual language.

## Tokens and behavior

The machine-readable design record is `.impeccable/design.json`; the surface brief is `.impeccable/surfaces/portfolio.md`. Both describe the implementation in `src/blacksite.css` and `src/App.jsx`.

The content width is capped at 1536px, with fluid 22–72px side gutters and 23px mobile gutters. At 1100px gaps tighten and the decorative barcode disappears. At 760px projects become single-column and the evidence readout becomes static. At 520px the menu becomes toggleable and the hero, biography and toolkit stack for small screens. Minimum supported layout width is 320px.

Motion consists of one 1.15s wordmark reveal, a brief hover split, a 35s typographic ticker, a 22s asterisk rotation and restrained link/image hovers. Avoid rapid flashing. `prefers-reduced-motion` disables animation, transitions and smooth scrolling while revealing the complete wordmark. The light-mode control changes local component state; no persistent theme preference is implemented.

## Evidence and accessibility

Preserve paid software roles, studies, source links, contact information and all three honest offline demos. EvalForge evaluates explicit criteria; OpsPilot uses explainable rules and human approval; DocTrace performs local document retrieval and offline extractive answers. Synthetic demo tests are not enterprise metrics. Optional LLM integration through a local proxy must not be presented as default real inference. Do not assert unverified availability or production AI impact.

Implemented accessibility affordances include a skip link, semantic landmarks, a screen-reader heading for the decorative SVG, visible keyboard focus, labeled terminal input, polite live output, pressed/expanded control states and decorative geometry hidden from assistive technology. This is an implementation record, not a formal accessibility certification; final rendered contrast, zoom and keyboard behavior still require verification.

Visual direction references: Cyber Grotesk (Olga Ryzhychenko), Nothing Portfolio MIT (Ankit Shrestha), Cybersecurity Portfolio (Pixiei Studio LLC). References inform direction only.

## Chromatic motion refinement — Gemini collaboration

Implemented in src/cyber-motion.css and src/useCyberMotion.js. Gemini provided an independent motion critique and snippets; original implementation and primary references are recorded in design/motion/GEMINI-REVIEW.md and SOURCES.md.

Two decorative copies of the original SVG are clipped into cyan/magenta fragments during a finite 580ms animation. The React trigger guard expires at 620ms. A visitor can trigger the effect with pointer entry or EXEC_GLITCH. The stable base remains visible.

EFEITOS ON/OFF persists preference in localStorage with failure handling. OS prefers-reduced-motion takes precedence and disables triggering. All content remains readable without IntersectionObserver or with effects off. The document's smooth scrolling also stops when effects are off.

Project reveals use a single observer and only prepare initially offscreen content; all rows recover on cleanup. Pointer light is desktop-only and updated through requestAnimationFrame, without a replacement cursor. CTA sweep, skill selection, nav focus, progress line and preview corners have their own scoped states.

Optional light-mode outline and ticker colors have dedicated dark overrides. Contrast regressions and opt-out behavior are covered by browser tests.
