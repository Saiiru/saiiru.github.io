import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'

const StandaloneProjects = lazy(() => import('./StandaloneProjects'))

function StandaloneFallback({ error = false }) {
  return <div className="standalone-deferred-fallback" role={error ? 'alert' : 'status'}>
    {error
      ? <>Não foi possível carregar a vitrine independente. <a href="https://github.com/Saiiru?tab=repositories" target="_blank" rel="noopener noreferrer">Consultar projetos no GitHub</a>.</>
      : 'Preparando os projetos independentes…'}
  </div>
}

class StandaloneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed ? <StandaloneFallback error /> : this.props.children
  }
}

export default function DeferredStandaloneProjects() {
  const ref = useRef(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    let frame
    let observer
    // Hash navigation may happen before React mounts the anchor. Recover it
    // after hydration and load the deferred content without another click.
    function followHash() {
      if (window.location.hash === '#projetos-independentes') {
        setNear(true)
        frame = window.requestAnimationFrame(() => ref.current?.scrollIntoView({ block: 'start' }))
      }
    }
    window.addEventListener('hashchange', followHash)
    followHash()
    if (!('IntersectionObserver' in window)) {
      setNear(true)
    } else {
      observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setNear(true)
          observer.disconnect()
        }
      }, { rootMargin: '700px' })
      if (ref.current) observer.observe(ref.current)
    }
    return () => {
      window.removeEventListener('hashchange', followHash)
      if (frame !== undefined) window.cancelAnimationFrame(frame)
      observer?.disconnect()
    }
  }, [])
  return <div ref={ref} id="projetos-independentes" className="standalone-deferred">
    {near
      ? <StandaloneBoundary><Suspense fallback={<StandaloneFallback/>}><StandaloneProjects/></Suspense></StandaloneBoundary>
      : <div className="standalone-deferred-spacer" aria-hidden="true"/>}
  </div>
}
