### Art Direction Review: Blacksite Signal & Datashard HUD

Stripping out `EXEC_GLITCH` and the manual effects toggle shifts Blacksite from a demo toggle-state into an organic, diegetic terminal interface. In line with **Cyberpunk 2077**, **CyberArch**, and **Wake Up Samurai Obsidian HUD**, glitch artifacts must function as momentary optic calibration—never continuous strobing.

---

### 5 Precise CSS Decisions & Timing Choreography

1. **Finite Cold-Boot Signal Acquisition (420ms on Load)**
   * Replace manual toggle gates (`[data-glitch="active"]` in [`cyber-motion.css`](file:///home/sairu/workspace/blacksite-ai-builder-20261107/site/src/cyber-motion.css#L57-L65)) with an automated single-cycle keyframe (`cyber-boot`) running `1` iteration with `animation-fill-mode: forwards`.
   * The base silhouette never disappears; only pseudo-elements fragment. Zero full-screen whiteout flashes.
2. **Tactile Mechanical Hover Micro-Stutter (180ms Finite Steps)**
   * Discard continuous infinite oscillations from [`glitch.scss`](file:///tmp/blacksite-signal-refs/glitch.scss#L30-L37). Hovering datashards or headings triggers a finite 180ms micro-burst using `steps(3, end)`.
   * Channel displacement is clamped to micro-offsets (max `2.5px`) with sudden horizontal clipping bands, giving the tactile sensation of a Nothing portfolio optical sensor catching a scan.
3. **Color Space Alignment: Obsidian Oxblood & Matrix Cyan**
   * Shift the dual-channel aberration from generic hot-magenta to Obsidian/Datashard accents: `#ff3355` (oxblood red HUD ticks) and `#41f4e5` (sub-zero cyan).
   * Render channels with `mix-blend-mode: screen` over deep carbon `#0a1214` to prevent luminance blowout.
4. **Notched Geometry & HUD Tick Anchoring**
   * Reinforce [`datashard-archive.css`](file:///home/sairu/workspace/blacksite-ai-builder-20261107/site/src/components/datashard-archive.css#L33-L38) with Cybercore-style chamfered corner notches: `clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)`.
   * On hover, fire a 2px oxblood corner tick and subtle top-to-bottom scanline sweep instead of full-card shearing.
5. **Declarative CSS Engine & `prefers-reduced-motion`**
   * Remove dependencies on JS class injections (`.portfolio[data-effects="on"]`). Manage entrance directly via `@media (prefers-reduced-motion: no-preference)`.
   * In reduced-motion mode, chromatic channels collapse to `opacity: 0` and `clip-path: none`, retaining razor-sharp static typography without layout shifts.

---

### Timing Choreography

* **First Load (0–420ms)**:
  * **0ms–70ms**: Horizontal slice split (cyan `-3px`, oxblood `+3px`, opacity `0.9`).
  * **70ms–190ms**: Skew shear (`skewX(-1.5deg)`), middle clip band (`inset(42% 0 38% 0)`).
  * **190ms–320ms**: Micro-settle (`±1px`), `steps(2, end)`.
  * **320ms–420ms**: Opacity drop to `0`; lock to static crisp vector.
* **Hover (0–180ms)**:
  * 3 quantized step frames: frame 1 (offset `+2px`, clip top), frame 2 (offset `-1.5px`, clip bottom), frame 3 (offset `0`, opacity `0`).

---

### Implementation Snippet

```css
/* Zero-dependency, finite HUD glitch: first-load & hover */
@media (prefers-reduced-motion: no-preference) {
  .hud-glitch {
    --g-cyan: #41f4e5;
    --g-oxblood: #ff3355;
    position: relative;
    display: inline-block;
  }
  .hud-glitch::before,
  .hud-glitch::after {
    content: attr(data-text);
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0;
  }
  /* First Load: 420ms finite burst */
  .hud-glitch::before {
    color: var(--g-cyan);
    mix-blend-mode: screen;
    animation: hud-burst 420ms steps(1, end) 1;
  }
  .hud-glitch::after {
    color: var(--g-oxblood);
    mix-blend-mode: screen;
    animation: hud-burst 420ms steps(1, end) 1 reverse;
  }
  /* Hover: 180ms discrete micro-jitter */
  .hud-glitch:hover::before {
    animation: hud-hover 180ms steps(2, end) 1;
  }
  .hud-glitch:hover::after {
    animation: hud-hover 180ms steps(2, end) 1 reverse;
  }

  @keyframes hud-burst {
    0%   { opacity: .85; transform: translate(-3px, 0); clip-path: inset(20% 0 65% 0); }
    30%  { opacity: .7;  transform: translate(2px, 0);  clip-path: inset(60% 0 15% 0); }
    70%  { opacity: .5;  transform: translate(-1px, 0); clip-path: inset(10% 0 75% 0); }
    100% { opacity: 0;   transform: none; clip-path: inset(0); }
  }
  @keyframes hud-hover {
    0%   { opacity: .9; transform: translate(2px, 0);  clip-path: inset(45% 0 30% 0); }
    50%  { opacity: .6; transform: translate(-2px, 0); clip-path: inset(15% 0 55% 0); }
    100% { opacity: 0;   transform: none; clip-path: inset(0); }
  }
}
```
