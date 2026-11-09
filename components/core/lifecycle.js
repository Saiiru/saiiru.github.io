/** Lifecycle shared by the browser equivalents. No OS bridges or external requests. */
export function element(tag, className = '', text) {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (text !== undefined) node.textContent = String(text)
  return node
}

export function createLifecycle(host) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  const cleanups = [], animations = new Set()
  let disposed = false, visible = true, frames = 0
  const allowed = () => !disposed && visible && !document.hidden && !media.matches
  const state = () => { host.dataset.motion = media.matches ? 'still' : allowed() ? 'running' : 'paused' }
  const refresh = () => { state(); for (const animation of animations) animation.refresh() }
  const listen = (node, name, handler, options) => {
    node.addEventListener(name, handler, options)
    const remove = () => node.removeEventListener(name, handler, options)
    cleanups.push(remove)
    return remove
  }
  listen(document, 'visibilitychange', refresh)
  listen(media, 'change', refresh)
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting; refresh()
  }, { rootMargin: '60px' }) : null
  observer?.observe(host)
  state()
  return {
    listen,
    refresh,
    get reduced() { return media.matches },
    get visible() { return visible && !document.hidden },
    cleanup(fn) { cleanups.push(fn); return fn },
    animate(draw, maxFPS = 24) {
      let frame = 0, last = -Infinity, stopped = false
      const origin = performance.now(), interval = 1000 / Math.max(1, Math.min(30, maxFPS))
      const render = (now, reduced = media.matches) => {
        try { draw(reduced ? 0 : now - origin, reduced); host.dataset.frames = String(++frames) }
        catch (error) { stopped = true; host.dataset.renderError = error.message }
      }
      const tick = now => {
        frame = 0
        if (stopped || !allowed()) return
        if (now - last >= interval) { last = now; render(now) }
        if (!stopped) frame = requestAnimationFrame(tick)
      }
      const animation = { refresh() {
        cancelAnimationFrame(frame); frame = 0
        if (stopped || disposed) return
        if (media.matches) render(performance.now(), true)
        else if (allowed()) frame = requestAnimationFrame(tick)
      } }
      animations.add(animation)
      render(performance.now())
      animation.refresh()
      const stop = () => { stopped = true; cancelAnimationFrame(frame); animations.delete(animation) }
      cleanups.push(stop)
      return stop
    },
    dispose() {
      if (disposed) return
      disposed = true; observer?.disconnect()
      for (const cleanup of cleanups.reverse()) cleanup()
      animations.clear(); host.dataset.motion = 'disposed'
    }
  }
}
