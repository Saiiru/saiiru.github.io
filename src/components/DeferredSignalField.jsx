import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'

const SignalField=lazy(()=>import('./SignalField'))
const StillField=({renderer='deferred'})=> <div className="contact-field" data-renderer={renderer} aria-hidden="true"/>

// A failed decorative download must not unmount the portfolio or its contact links.
class FieldBoundary extends Component {
 state={failed:false}
 static getDerivedStateFromError(){return {failed:true}}
 render(){return this.state.failed?<StillField renderer="fallback"/>:this.props.children}
}

/** Load shader code and allocate GPU resources only as the closing scene approaches. */
export default function DeferredSignalField(){
 const ref=useRef(null)
 const [near,setNear]=useState(false)
 useEffect(()=>{
  if(!('IntersectionObserver' in window)){setNear(true);return}
  const observer=new IntersectionObserver(entries=>{
   if(entries.some(entry=>entry.isIntersecting)){setNear(true);observer.disconnect()}
  },{rootMargin:'180px'})
  observer.observe(ref.current)
  return()=>observer.disconnect()
 },[])
 return <div ref={ref} className="contact-field-mount" aria-hidden="true">
  {near?<FieldBoundary><Suspense fallback={<StillField/>}><SignalField/></Suspense></FieldBoundary>:<StillField/>}
 </div>
}
