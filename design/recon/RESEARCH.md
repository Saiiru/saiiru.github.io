# Recon identity research — 2026-11-08

Scope: finished identity, profile panels and contact scene. Implementation: `src/recon-identity.css`, `src/components/SignalField.jsx`, `src/App.jsx` and `public/brand/sairu-mark.svg`. This refinement changes presentation and contact privacy; it adds no project-performance claims.

## Sources inspected

| Source | Observation | Use and boundary |
| --- | --- | --- |
| [Mille profile SVG](https://github.com/mille-okws/mille-okws/blob/main/assets/profile.svg) and [languages SVG](https://github.com/mille-okws/mille-okws/blob/main/assets/languages.svg) | Full-width authored SVG panels, technical rules, large identity, short biography and compact toolkit | Format/structure inspiration for the profile README. Sairu panels, content, palette and geometry were authored afresh; Mille assets were not copied. |
| [CyberArch components/glitch.frag](https://github.com/ARCANGEL0/CyberArch-Shell/blob/master/components/glitch.frag) | Texture-based shader with horizontal scanline bands, horizontal UV displacement, channel separation and a finite envelope | Visual/technique inspiration for signal language. No CyberArch shader code is copied into SignalField. |
| [CyberArch components/login/sddm-theme/Background.qml](https://github.com/ARCANGEL0/CyberArch-Shell/blob/master/components/login/sddm-theme/Background.qml) | Tries image extensions, then video sources, then a fallback image | This inspected login background uses image/video fallback, not a fluid shader. It is not the source of the site’s procedural field. |
| [sandrina-p / RRWaYO](https://codepen.io/sandrina-p/pen/RRWaYO) | CSS-only Watch Dogs text glitch using stepped colored text-shadow offsets | Reference for brief chromatic text separation. Its continuous loop and large jumps are not the site’s motion contract. |
| [mostafazke / XERXeY](https://codepen.io/mostafazke/pen/XERXeY) | Layered image copies with polygon clipping and translated glitch slices | Reference for opposing clipped bands. No image, branded artwork or remote CodePen dependency was imported. |

The existing [Cybercore CSS](https://github.com/sebyx07/cybercore-css) adaptation is a separate, already attributed implementation: selected MIT glitch bands and scanlines were adapted locally. Its provenance and retained licenses remain in `design/contextual-signals/RESEARCH.md`, that directory and `public/licenses/`. Do not relabel this adaptation as newly authored shader code.

## Color roles and identity

Charcoal `#0b1110` holds the composition; ivory `#e3eee7` carries primary text and muted `#a9beb3` supports reading hierarchy. Green rule `#30483d` makes boundaries quieter than actions. Mint `#9ce8bf` carries interaction, focus and the S identity; coral `#ee6674` supplies a limited counter-signal in the mark and glitch detail. Related dark green/oxblood surfaces replace broad yellow blocks. These are role decisions, not measured contrast-ratio claims.

The original S monogram is shared by site navigation, contact signoff and the freshly authored profile panel. The original SAIRU wordmark and self-hosted OFL Oxanium remain. The current contact uses a Portuguese invitation with LinkedIn/GitHub channels and no personal email or mailto link.

## Original field and lifecycle

SignalField uses newly authored layered noise and domain warping to draw animated contours, with mint/coral color mixing and modest scanline modulation. It does not sample a CyberArch texture, reuse that shader, simulate fluid physics or load a video. Native WebGL adds no library dependency.

The field uses a low-power context, a 1.25 pixel-ratio cap and a roughly 30fps loop. Fine-pointer input eases toward a target. Intersection visibility and document visibility gate animation; reduced motion renders a stable frame. Shader/context failure yields a CSS radial-gradient fallback; contact links and copy remain ordinary HTML above the effect.

The edge registration flow defect was also corrected: a generic relative-positioning rule had made the decorative edge code occupy about 296px in flow. An explicit fixed-position override restores the intended layout without deleting the decoration.

## Verification and finish review

The existing `scripts/e2e_recon.py` run passed five widths: 320, 390, 768, 1280 and 1440px. It checks overflow, mark/palette, contact-channel count, absence of email/mailto in rendered content, terminal privacy, WebGL rendering, frame progression, offscreen pause, OS reduced motion, mobile menu hit targeting and the unavailable-WebGL fallback. The hidden-document guard was inspected in source; the suite does not assert that case separately.

The detector returned `[]`. Independent finish reviewer `/root/recon_finish_review` returned **SHIP** with no material findings after desktop/mobile hero/contact, profile-panel and full SignalField/App/recon CSS inspection. This disposition is limited to those reviewed surfaces and sources; it does not certify every page or formal accessibility conformance.

Evidence: `desktop-hero.png`, `desktop-contact.png`, `desktop-flow-next.png`, `mobile-hero.png` and `mobile-contact.png` in this directory. This documentation pass did not rerun the browser suite or modify UI code.
