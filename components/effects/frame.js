/** Finite frame feedback, shared by the gallery and the real portfolio. */
export function bindFrameSignal(node) {
  let timer = 0
  const media = matchMedia('(prefers-reduced-motion: reduce)')
  const trigger = event => {
    if (media.matches || event.pointerType === 'touch') return
    clearTimeout(timer)
    delete node.dataset.signal
    void node.offsetWidth
    node.dataset.signal = 'active'
    timer = setTimeout(() => delete node.dataset.signal, 440)
  }
  node.classList.add('ca-frame-signal')
  node.addEventListener('pointerenter', trigger)
  node.addEventListener('focusin', trigger)
  return () => {
    clearTimeout(timer); delete node.dataset.signal
    node.classList.remove('ca-frame-signal')
    node.removeEventListener('pointerenter', trigger)
    node.removeEventListener('focusin', trigger)
  }
}
