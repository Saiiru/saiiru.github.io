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
    window.addEventListener('scroll', onScroll, { passive: true })
    drawProgress()
    if (enabled && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      hero?.addEventListener('pointermove', onPointerMove, { passive: true })
    }

    return () => {
      observer?.disconnect()
      window.removeEventListener('scroll', onScroll)
      hero?.removeEventListener('pointermove', onPointerMove)
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
  const running = useRef(false)
  const timeout = useRef()
  const lastPulse = useRef(-Infinity)
  const entered = useRef(false)

  const trigger = useCallback(() => {
    const now = performance.now()
    if (!enabled || running.current || now - lastPulse.current < 1500) return
    running.current = true
    lastPulse.current = now
    setActive(true)
    timeout.current = setTimeout(() => {
      running.current = false
      setActive(false)
    }, 620)
  }, [enabled])

  useEffect(() => {
    let entry
    if (enabled && !entered.current) {
      // Mark only when the callback runs: StrictMode's setup/cleanup rehearsal
      // cannot consume the entrance or leave the running guard stuck.
      entry = setTimeout(() => {
        entered.current = true
        trigger()
      }, 240)
    }
    if (!enabled) setActive(false)
    return () => {
      clearTimeout(entry)
      clearTimeout(timeout.current)
      running.current = false
    }
  }, [enabled, trigger])

  const onPointerEnter = event => {
    if (event.pointerType === 'touch' ||
        !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    trigger()
  }
  return { active, onPointerEnter }
}
