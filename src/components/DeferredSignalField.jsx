import { lazy, Suspense, useEffect, useRef, useState } from 'react'

const SignalField=lazy(()=>import('./SignalField'))
const StillField=()=> <div className="contact-field" data-renderer="deferred" aria-hidden="true"/>

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
  {near?<Suspense fallback={<StillField/>}><SignalField/></Suspense>:<StillField/>}
 </div>
}
