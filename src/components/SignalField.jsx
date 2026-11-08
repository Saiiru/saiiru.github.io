import { useEffect, useRef } from 'react'

const vertexSource = 'attribute vec2 position; void main(){gl_Position=vec4(position,0.0,1.0);}'
const fragmentSource = String.raw`
precision mediump float;
uniform vec2 resolution;
uniform vec2 pointer;
uniform float time;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),
             mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);
}
float terrain(vec2 p){
  return .58*noise(p)+.28*noise(p*2.03+5.1)+.14*noise(p*4.01+9.2);
}
void main(){
  vec2 uv=gl_FragCoord.xy/resolution;
  vec2 p=(gl_FragCoord.xy-.5*resolution)/min(resolution.x,resolution.y);
  vec2 mouse=(pointer-.5)*vec2(resolution.x/resolution.y,1.);
  p+=.10*exp(-length(p-mouse)*2.5)*vec2(sin(time*.3),cos(time*.25));
  vec2 warp=vec2(terrain(p*1.5+vec2(time*.055,0.)),
                 terrain(p*1.5+vec2(4.2,-time*.045)));
  float n=terrain(p*2.1+warp*2.5+vec2(0.,time*.035));
  float contour=pow(.5+.5*cos(n*83.),18.);
  float fine=pow(.5+.5*cos(n*164.),28.)*.18;
  float mask=smoothstep(.12,.8,uv.x);
  float crossing=smoothstep(.45,.7,terrain(p+time*.02));
  vec3 mint=vec3(.25,.63,.43);
  vec3 coral=vec3(.73,.16,.25);
  vec3 ink=vec3(.025,.052,.043);
  vec3 signal=mix(mint,coral,crossing);
  vec3 color=ink+(contour+fine)*signal*.57*mask;
  color+=signal*.075*pow(n,2.)*mask;
  color*=.96+.04*sin(gl_FragCoord.y*1.57);
  gl_FragColor=vec4(color,1.);
}
`

/** Original domain-warped contour field. No video, image, tracker or library.
 * Stops outside the viewport or in a hidden tab; reduced motion draws once.
 */
export default function SignalField() {
  const ref=useRef(null)
  useEffect(()=>{
    const canvas=ref.current
    const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'})
    if(!gl){canvas.dataset.renderer='fallback';return}
    let program,buffer,frame=0,visible=true,last=0,dead=false
    const shaders=[]
    const media=window.matchMedia('(prefers-reduced-motion: reduce)')
    const point=[.72,.46],target=[.72,.46]
    try{
      function shader(type,source){
        const s=gl.createShader(type);shaders.push(s);gl.shaderSource(s,source);gl.compileShader(s)
        if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('Signal shader compilation failed')
        return s
      }
      program=gl.createProgram()
      gl.attachShader(program,shader(gl.VERTEX_SHADER,vertexSource))
      gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragmentSource))
      gl.linkProgram(program)
      if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Signal program link failed')
      gl.useProgram(program)
      buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer)
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW)
      const position=gl.getAttribLocation(program,'position')
      gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0)
    }catch{
      shaders.forEach(s=>gl.deleteShader(s));if(program)gl.deleteProgram(program)
      canvas.dataset.renderer='fallback';return
    }
    canvas.dataset.renderer='webgl'
    const size=gl.getUniformLocation(program,'resolution')
    const clock=gl.getUniformLocation(program,'time')
    const cursor=gl.getUniformLocation(program,'pointer')
    const start=performance.now()
    function draw(now){
      if(dead)return
      point[0]+=(target[0]-point[0])*.055;point[1]+=(target[1]-point[1])*.055
      gl.uniform2f(size,canvas.width,canvas.height)
      gl.uniform2f(cursor,point[0],point[1])
      gl.uniform1f(clock,media.matches?3.0:(now-start)/1000)
      gl.drawArrays(gl.TRIANGLES,0,3)
      canvas.dataset.frames=String(Number(canvas.dataset.frames||0)+1)
    }
    function tick(now){
      frame=0
      if(dead||!visible||document.hidden||media.matches)return
      if(now-last>33){draw(now);last=now}
      frame=requestAnimationFrame(tick)
    }
    function schedule(){
      cancelAnimationFrame(frame);frame=0
      if(dead)return
      if(media.matches){draw(performance.now());return}
      if(visible&&!document.hidden)frame=requestAnimationFrame(tick)
    }
    function resize(){
      const rect=canvas.getBoundingClientRect(),ratio=Math.min(window.devicePixelRatio||1,1.25)
      canvas.width=Math.max(1,Math.floor(rect.width*ratio))
      canvas.height=Math.max(1,Math.floor(rect.height*ratio))
      gl.viewport(0,0,canvas.width,canvas.height);draw(performance.now())
    }
    const onPointer=e=>{
      if(media.matches||e.pointerType==='touch')return
      const r=canvas.getBoundingClientRect()
      target[0]=(e.clientX-r.left)/r.width;target[1]=1-(e.clientY-r.top)/r.height
    }
    const parent=canvas.parentElement
    parent.addEventListener('pointermove',onPointer,{passive:true})
    const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>{
      visible=entries[0].isIntersecting;schedule()
    },{rootMargin:'80px'}):null
    observer?.observe(canvas)
    const resizeObserver='ResizeObserver' in window?new ResizeObserver(resize):null
    resizeObserver?.observe(canvas)
    window.addEventListener('resize',resize,{passive:true})
    document.addEventListener('visibilitychange',schedule)
    media.addEventListener('change',schedule)
    resize();schedule()
    return()=>{
      dead=true;cancelAnimationFrame(frame);observer?.disconnect();resizeObserver?.disconnect()
      parent.removeEventListener('pointermove',onPointer)
      window.removeEventListener('resize',resize)
      document.removeEventListener('visibilitychange',schedule)
      media.removeEventListener('change',schedule)
      gl.deleteBuffer(buffer);gl.deleteProgram(program);shaders.forEach(s=>gl.deleteShader(s))
    }
  },[])
  return <canvas ref={ref} className="contact-field" aria-hidden="true" data-renderer="pending"/>
}
