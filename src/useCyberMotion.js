import { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'blacksite-effects'
const reducedQuery = '(prefers-reduced-motion: reduce)'

function readPreference() {
  try { return window.localStorage.getItem(STORAGE_KEY) !== 'off' }
  catch { return true }
}

/** Coordinate motion once; effects never gate content. */
export function useCyberMotion(rootRef) {
  const [preferred, setPreferred] = useState(readPreference)
  const [reduced, setReduced] = useState(() => window.matchMedia(reducedQuery).matches)
  const enabled = preferred && !reduced

  useEffect(() => {
    const media = window.matchMedia(reducedQuery)
    const update = () => setReduced(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, preferred ? 'on' : 'off') } catch { /* Storage may be blocked. */ }
  }, [preferred])

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

  return { enabled, reduced, toggleEffects: () => setPreferred(value => !value) }
}

/** Finite burst with a re-entry guard: never a permanent glitch loop. */
export function useGlitch(enabled) {
  const [active, setActive] = useState(false)
  const running = useRef(false)
  const timeout = useRef()
  useEffect(() => {
    if (!enabled) { running.current = false; clearTimeout(timeout.current); setActive(false) }
    return () => clearTimeout(timeout.current)
  }, [enabled])
  const trigger = () => {
    if (!enabled || running.current) return
    running.current = true
    setActive(true)
    timeout.current = setTimeout(() => {
      running.current = false
      setActive(false)
    }, 620)
  }
  return { active, trigger }
}
