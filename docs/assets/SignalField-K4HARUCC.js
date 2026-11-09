import{r as F,j as M}from"./index-20Gfnat-.js";const B="attribute vec2 position; void main(){gl_Position=vec4(position,0.0,1.0);}",I=String.raw`
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
`;function N(){const E=F.useRef(null);return F.useEffect(()=>{const t=E.current,e=t.getContext("webgl",{alpha:!1,antialias:!1,powerPreference:"low-power"});if(!e){t.dataset.renderer="fallback";return}let n,p,i=0,g=!0,A=0,d=!1,u=!1;const w=[],a=window.matchMedia("(prefers-reduced-motion: reduce)"),c=[.72,.46],h=[.72,.46];try{let r=function(T,C){const m=e.createShader(T);if(w.push(m),e.shaderSource(m,C),e.compileShader(m),!e.getShaderParameter(m,e.COMPILE_STATUS))throw Error("Signal shader compilation failed");return m};if(n=e.createProgram(),e.attachShader(n,r(e.VERTEX_SHADER,B)),e.attachShader(n,r(e.FRAGMENT_SHADER,I)),e.linkProgram(n),!e.getProgramParameter(n,e.LINK_STATUS))throw Error("Signal program link failed");e.useProgram(n),p=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,p),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);const o=e.getAttribLocation(n,"position");e.enableVertexAttribArray(o),e.vertexAttribPointer(o,2,e.FLOAT,!1,0,0)}catch{w.forEach(r=>e.deleteShader(r)),n&&e.deleteProgram(n),t.dataset.renderer="fallback";return}const S=()=>{u=!0,cancelAnimationFrame(i),i=0,t.dataset.renderer="fallback"};t.addEventListener("webglcontextlost",S),t.dataset.renderer="webgl";const P=e.getUniformLocation(n,"resolution"),y=e.getUniformLocation(n,"time"),k=e.getUniformLocation(n,"pointer"),_=performance.now();function x(r){d||u||(c[0]+=(h[0]-c[0])*.055,c[1]+=(h[1]-c[1])*.055,e.uniform2f(P,t.width,t.height),e.uniform2f(k,c[0],c[1]),e.uniform1f(y,a.matches?3:(r-_)/1e3),e.drawArrays(e.TRIANGLES,0,3),t.dataset.frames=String(Number(t.dataset.frames||0)+1))}function b(r){i=0,!(d||u||!g||document.hidden||a.matches)&&(r-A>33&&(x(r),A=r),i=requestAnimationFrame(b))}function s(){if(cancelAnimationFrame(i),i=0,!(d||u)){if(a.matches){x(performance.now());return}g&&!document.hidden&&(i=requestAnimationFrame(b))}}function v(){const r=t.getBoundingClientRect(),o=Math.min(window.devicePixelRatio||1,1.25);t.width=Math.max(1,Math.floor(r.width*o)),t.height=Math.max(1,Math.floor(r.height*o)),e.viewport(0,0,t.width,t.height),x(performance.now())}const L=r=>{if(a.matches||r.pointerType==="touch")return;const o=t.getBoundingClientRect();h[0]=(r.clientX-o.left)/o.width,h[1]=1-(r.clientY-o.top)/o.height},R=t.closest(".contact-section")||t.parentElement;R.addEventListener("pointermove",L,{passive:!0});const l="IntersectionObserver"in window?new IntersectionObserver(r=>{g=r[0].isIntersecting,s()},{rootMargin:"80px"}):null;l==null||l.observe(t);const f="ResizeObserver"in window?new ResizeObserver(v):null;return f==null||f.observe(t),window.addEventListener("resize",v,{passive:!0}),document.addEventListener("visibilitychange",s),a.addEventListener("change",s),v(),s(),()=>{d=!0,cancelAnimationFrame(i),l==null||l.disconnect(),f==null||f.disconnect(),R.removeEventListener("pointermove",L),window.removeEventListener("resize",v),document.removeEventListener("visibilitychange",s),a.removeEventListener("change",s),t.removeEventListener("webglcontextlost",S),e.deleteBuffer(p),e.deleteProgram(n),w.forEach(r=>e.deleteShader(r))}},[]),M.jsx("canvas",{ref:E,className:"contact-field","aria-hidden":"true","data-renderer":"pending"})}export{N as default};
