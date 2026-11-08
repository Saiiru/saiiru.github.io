# Contextual signals — 2026-11-08
Requested refinement: remove EXEC_GLITCH and effects toggle, integrate a brief entrance burst and hover signals. React/CSS implementation, no additional dependency.

## Sources inspected
- https://community.obsidian.md/themes/wake-up-samurai — viewed theme screenshot and description. Oxblood/charcoal, coral edge ticks, cyan/green HUD hierarchy and notched document panels inform annotation and archive accents. No font or theme stylesheet copied.
- https://github.com/ankitshrr/nothing-portfolio — existing MIT base; keep its readable structure, not a second framework.
- https://github.com/pathumd/2021_personal_site — inspected home.css: opposing text copies with clipped bands, hover triggers. Visual/technique reference; code not copied (no explicit license found in inspected listing).
- https://sebyx07.github.io/cybercore-css/ and https://github.com/sebyx07/cybercore-css — inspected actual src/scss/effects/_glitch.scss and _scanlines.scss. Opposing polygon bands and repeating-gradient scanlines copied/adapted into local CSS; Sass variables, durations, selectors and loops replaced. MIT copyright/license preserved in this folder and public/licenses. Package NOT installed, imported or linked.
- https://www.wendyzhou.se/blog/cyberpunk-ui-website-design-inspiration/ — visual survey: bold hierarchy, thin HUD rules, cut corners, expressive landing page. No assets copied.
- Local CyberArch config: dotfiles/config/workstation-shell/src/components/AppearancePage.qml lists Watch Dogs Recon (cyan/amber HUD) and Electric Night (purple/pink). This informs palette continuity; no matching glitch renderer was found in inspected config files.

## Decisions and choreography
- Stable yellow SVG identity, cyan and magenta decorative copies. One 580ms burst begins 240ms after mount. No blocking loader.
- Repeat on fine-pointer entry, at most once every 1500ms. Touch pointerenter ignored.
- Smaller 260ms finite text signal on navigation and datashard labels; keyboard focus receives same cue. Copies are aria-hidden.
- Oxblood annotation edge and notched CTA. Static, low-opacity scanlines limited to media modules, never body copy.
- OS reduced motion controls all motion automatically, including live preference changes. Removed app-specific preference and all controls, so legacy localStorage off cannot strand motion.
- Codex reviewed lifecycle and cooldown, Agy/Gemini reviewed CSS choreography. Review texts retained alongside this note.
- Independent review caught mobile stacking context and clipped CTA focus; fixed explicit nav z-index and inset focus outline.

## Verification
Updated Playwright motion suite covers automatic burst, stable idle, hover/cooldown, dynamic reduced motion, touch/mobile menu, unavailable storage and legacy preference. Existing archive and software demos remain testable.
