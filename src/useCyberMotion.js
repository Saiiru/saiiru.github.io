import { useCallback, useEffect, useRef, useState } from 'react'

const reducedQuery = '(prefers-reduced-motion: reduce)'


/** Coordinate motion once; effects never gate content. */
export function useCyberMotion(rootRef) {
  const [reduced, setReduced] = useState(() => window.matchMedia(reducedQuery).matches)
  const enabled = !reduced

  useEffect(() => {
    const media = window.matchMedia(reducedQuery)
    const update = () => setReduced(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const targets = Array.from(root.querySelectorAll('[data-reveal]'))
    const hero = root.querySelector('.hero-stage')
    let observer
    let scrollFrame = 0
    let pointerFrame = 0
    let ambientFrame = 0

    // Readable before JS; only prepare elements currently below the fold.
    if (enabled && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        }
      }, { threshold: 0.10 })
      targets.forEach(element => {
        if (element.getBoundingClientRect().top >= window.innerHeight) {
          element.classList.add('reveal-ready')
          observer.observe(element)
        }
      })
    }

    const drawProgress = () => {
      scrollFrame = 0
      const distance = document.documentElement.scrollHeight - window.innerHeight
      root.style.setProperty('--page-progress', distance > 0 ? String(window.scrollY / distance) : '0')
    }
    const onScroll = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(drawProgress)
    }

    const onPointerMove = event => {
      if (!enabled || !hero || event.pointerType === 'touch') return
      const rect = hero.getBoundingClientRect()
      const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width))
      const y = Math.max(0, Math.min(event.clientY - rect.top, rect.height))
      cancelAnimationFrame(pointerFrame)
      pointerFrame = requestAnimationFrame(() => {
        hero.style.setProperty('--pointer-x', x + 'px')
        hero.style.setProperty('--pointer-y', y + 'px')
      })
    }
    const onAmbientMove=event=>{
      if (!enabled || event.pointerType === 'touch') return
      if (ambientFrame) cancelAnimationFrame(ambientFrame)
      ambientFrame=requestAnimationFrame(()=>{
        root.style.setProperty('--ambient-x',event.clientX+'px')
        root.style.setProperty('--ambient-y',event.clientY+'px')
        ambientFrame=0
      })
    }
    if (enabled && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      window.addEventListener('pointermove',onAmbientMove,{passive:true})
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    drawProgress()
    if (enabled && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      hero?.addEventListener('pointermove', onPointerMove, { passive: true })
    }

    return () => {
      observer?.disconnect()
      window.removeEventListener('scroll', onScroll)
      hero?.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointermove',onAmbientMove)
      cancelAnimationFrame(ambientFrame)
      cancelAnimationFrame(scrollFrame)
      cancelAnimationFrame(pointerFrame)
      targets.forEach(element => element.classList.remove('reveal-ready', 'is-revealed'))
    }
  }, [enabled, rootRef])

  return { enabled }
}

/** A short entry pulse, then deliberate pointer responses with a quiet interval. */
export function useGlitch(enabled) {
  const [active, setActive] = useState(false)
  const [pulse, setPulse] = useState(0)
  const timer = useRef(null)
  const entered = useRef(false)

  // Each new pointer entrance restarts the chromatic layers. No artificial
  // 1.5-second cooldown: crossing SAIRU again should feel responsive.
  const trigger = useCallback(() => {
    if (!enabled) return
    clearTimeout(timer.current)
    setPulse(value=>value+1)
    setActive(true)
    timer.current=setTimeout(()=>setActive(false),570)
  }, [enabled])

  useEffect(() => {
    if (enabled && !entered.current) {
      // Mark as entered only after the timer fires. The StrictMode cleanup
      // rehearsal will not accidentally consume the initial glitch.
      const start=setTimeout(()=>{
        entered.current=true
        trigger()
      },260)
      return ()=>{clearTimeout(start);clearTimeout(timer.current)}
    }
    if (!enabled) setActive(false)
    return ()=>clearTimeout(timer.current)
  }, [enabled,trigger])

  const onPointerEnter = event => {
    if (event.pointerType==='touch') return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    trigger()
  }
  return {active,pulse,onPointerEnter}
}
