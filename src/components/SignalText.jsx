/** Text stays stable; only aria-hidden chromatic copies are displaced. */
export default function SignalText({ children }) {
  return <span className="signal-label"><span>{children}</span><span className="signal-ghost" data-text={children} aria-hidden="true"/></span>
}
