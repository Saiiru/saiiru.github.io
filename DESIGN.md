# SAIRU / BLACKSITE — current identity, 2026-11-08

Surface mode: **Experience**. A typography-led portfolio with an original geometric SAIRU wordmark, factual professional history, inspectable software evidence and direct professional contact. Current identity overrides are scoped to `.portfolio` in `src/recon-identity.css`; older yellow declarations in base styles are historical implementation layers.

## Current visual system

| Role | Token | Purpose |
| --- | --- | --- |
| Ink | `#0b1110` | Charcoal foundation across the page |
| Paper | `#e3eee7` | Primary readable text |
| Muted | `#a9beb3` | Supporting copy and metadata |
| Rule | `#30483d` | Quiet structural boundaries |
| Signal | `#9ce8bf` | Mint identity, selected states, actions and keyboard focus |
| Counter-signal | `#ee6674` | Coral signature details and brief chromatic separation |

Mint and coral form a restrained near-complementary pair on neutral charcoal. Dark green and muted oxblood supporting panels carry the hero strip, biography and archive; broad yellow highlight surfaces have been replaced. No color ratio or formal contrast certification is asserted here.

The original S monogram lives at `public/brand/sairu-mark.svg` and appears in navigation and contact signoff. The large hero SAIRU wordmark remains original inline vector geometry. Self-hosted OFL Oxanium is the display family; the system sans stack supports body text and monospace serves commands, dates and metadata. No commercial Cyber Grotesk font files are used.

The project surface is the existing Datashard Archive catalogue and in-place dossier reader, followed by the public repository archive. The original static screenshot rows are historical. Selection, accessible dossier tabs, demo/source actions and factual evidence remain the focus. This identity refinement does not add project or production-impact claims.

## Contact and generated field

The Portuguese closing heading is “O próximo passo é uma conversa.” Two visible channels lead to LinkedIn and GitHub. Personal email and `mailto:` are absent from the rendered page and terminal contact output.

`src/components/SignalField.jsx` is a newly authored WebGL contour field: layered interpolated noise, domain warping, contour bands, a subtle scanline modulation and a smoothed pointer influence. It uses native WebGL with no added dependency, external image, video or tracker. The dark shade above it preserves the editorial contact layout.

Rendering is capped at roughly 30 frames per second and device pixel ratio 1.25. The animation loop pauses when offscreen (with an 80px observer margin) or the document is hidden. OS reduced motion draws a stable frame and does not run the animation loop. WebGL or shader failure selects a static CSS gradient fallback. Cleanup cancels scheduled frames, disconnects observers/listeners and releases GL resources.

The contact layout has two columns on desktop and one below 760px, with 23px mobile gutters below 520px. Existing typography, archive and mobile navigation breakpoints remain. A previous broad relative-positioning rule accidentally put the decorative edge code into document flow, adding about 296px of unwanted space. The explicit `.portfolio > .edge-code { position:fixed }` override restores the intended decoration and flow.

## Motion, accessibility and truthful content

Finite wordmark and label glitches, project reveals, pointer lighting and the reading-progress line remain from prior refinements. Stable readable text and the original base wordmark remain present; decorative copies are hidden from assistive technology. OS reduced motion controls eligibility, including preference changes. There is no app-specific effects toggle, persisted effects setting or current light-mode toggle; retained light-mode CSS is compatibility styling.

Keep the skip link, semantic landmarks, visible focus, labeled terminal input, polite live output and accessible selection states. Preserve real paid software work and studies. Offline prototype behavior, synthetic data, optional proxy-backed LLM integration and demo-test boundaries must stay explicit. Do not turn demonstrations into enterprise results or assert unverified availability.

## Verification scope

The current `scripts/e2e_recon.py` suite passed at 320, 390, 768, 1280 and 1440px. Coverage includes horizontal overflow, the new palette/mark, two contact channels, rendered-page and terminal privacy, an animating WebGL field, offscreen pause, reduced-motion stability, mobile navigation hit targeting and unavailable-WebGL fallback. Hidden-document pause is also implemented in the reviewed source; it is not a separate assertion in this suite.

The design detector returned `[]`. Independent finish review returned **SHIP**, with no material findings in the inspected desktop/mobile hero and contact, profile panels, and full SignalField/App/recon CSS sources. These are scoped review results, not a formal accessibility audit. Screenshots are retained in `design/recon/`.

## Reference and implementation history

The 2026-11-07 direction used industrial yellow, editorial screenshot rows and a Cyber Grotesk-led typographic reference. Historical visual references remain Cyber Grotesk (Olga Ryzhychenko), Nothing Portfolio MIT (Ankit Shrestha) and Cybersecurity Portfolio (Pixiei Studio LLC). They are historical direction, not descriptions of the current palette.

Chromatic choreography and Gemini review are recorded in `design/motion/`; the Datashard Archive research is in `design/datashards/`. The existing MIT Cybercore glitch/scanline adaptation remains attributed in `design/contextual-signals/RESEARCH.md` and the retained license files. No Cybercore package is installed.

Current reconstruction sources and the distinction between inspiration and original work are recorded in `design/recon/RESEARCH.md`. CyberArch scanline/displacement/channel techniques inform the visual vocabulary; its shader was not copied into the independently authored contour field.
