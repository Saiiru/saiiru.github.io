import { element } from '../core/lifecycle.js'
import { bindFrameSignal } from './frame.js'
import { upstreamPalettes } from '../core/upstream-palettes.js'

function pulse(node, life, className = 'ca-pulse', duration = 560) {
  let timer = 0
  const run = event => {
    if (life.reduced || event?.pointerType === 'touch') return
    clearTimeout(timer); node.classList.remove(className); void node.offsetWidth
    node.classList.add(className); timer = setTimeout(() => node.classList.remove(className), duration)
  }
  life.listen(node, 'pointerenter', run); life.listen(node, 'focusin', run)
  life.cleanup(() => { clearTimeout(timer); node.classList.remove(className) })
  return run
}

const sourcePaths = ['components/effects/signals.js','components/effects/signals.css']
const entry = (id,title,category,summary,mount) => ({id,title,category,summary,sourcePaths,mount})
export const signalEffects = [
  entry('channel-split','Ruptura de sinal','Sinal','Camadas cromáticas finitas; texto base permanece inteiro e selecionável.',(host,life)=>{
    const zone=element('div','ca-channel-zone'); zone.tabIndex=0; zone.setAttribute('aria-label','Sairu: passe o ponteiro ou use o foco para ver a ruptura de sinal')
    const title=element('div','ca-channel-title','SAIRU'); title.dataset.text='SAIRU'
    zone.append(element('span','ca-fine','CANAL / IDENTIDADE'),title,element('p','ca-channel-foot','O sinal falha. A mensagem permanece.'))
    host.append(zone); const run=pulse(zone,life); life.cleanup(bindFrameSignal(zone));run()
  }),
  entry('slice-transition','Corte de cena','Sinal','Troca entre duas composições locais com faixas, máscara e deslocamento limitado.',(host,life)=>{
    const zone=element('div','ca-scene ca-slice'); zone.dataset.scene='a'
    const graphic=element('div','ca-slice-art'); graphic.setAttribute('aria-hidden','true')
    for(let i=0;i<6;i++) graphic.append(element('span','ca-slice-band'))
    const title=element('h3','ca-slice-title','SIGNAL / 01')
    const button=element('button','ca-button','Trocar composição');button.type='button'
    zone.append(graphic,title,element('p','ca-fine','COMPOSIÇÃO VETORIAL ORIGINAL'),button);host.append(zone)
    const run=pulse(zone,life,'ca-cut',600);let second=false
    life.listen(button,'click',()=>{second=!second;zone.dataset.scene=second?'b':'a';title.textContent=second?'AFTERIMAGE / 02':'SIGNAL / 01';run()})
  }),
  entry('scramble-reveal','Decodificação','Texto','Caracteres decorativos se recompõem sem substituir o nome acessível.',(host,life)=>{
    const zone=element('div','ca-scramble-zone');const title=element('h3','ca-decode')
    title.append(element('span','ca-sr-only','BUILD SOMETHING REAL'))
    const text=element('span','','BUILD SOMETHING REAL');text.setAttribute('aria-hidden','true');title.append(text)
    const button=element('button','ca-button','Recompor mensagem');button.type='button'
    zone.append(title,element('p','ca-fine','UM CICLO / SEM INTERVALOS PERMANENTES'),button);host.append(zone)
    let frame=0;const original='BUILD SOMETHING REAL',glyphs='01/#_<>:'
    const run=()=>{cancelAnimationFrame(frame);if(life.reduced){text.textContent=original;return}const start=performance.now();const tick=now=>{if(life.reduced||!life.visible){text.textContent=original;return}const progress=Math.min(1,(now-start)/650);text.textContent=[...original].map((c,i)=>c===' '||i<progress*original.length?c:glyphs[(i+Math.floor((now-start)/55))%glyphs.length]).join('');if(progress<1&&life.visible)frame=requestAnimationFrame(tick);else text.textContent=original};frame=requestAnimationFrame(tick)}
    life.listen(button,'click',run);life.listen(zone,'pointerenter',run);life.cleanup(()=>cancelAnimationFrame(frame))
  }),
  entry('holo-tilt','Placa holográfica','Sinal','Perspectiva de baixa amplitude, reflexo e circuito sobre geometria original.',(host,life)=>{
    const zone=element('div','ca-holo-zone');const plate=element('div','ca-holo-plate');plate.tabIndex=0
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 360 160');svg.setAttribute('aria-hidden','true')
    svg.innerHTML='<path d="M15 120H95L130 85H205L246 44H345M15 140H116L150 106H224L267 63H345M15 100H74L110 64H185L224 25H345"/><circle cx="130" cy="85" r="7"/><circle cx="224" cy="25" r="7"/>'
    plate.append(element('span','ca-fine','ORIGINAL VECTOR / 003'),svg,element('h3','','SAIRU'),element('p','ca-fine','SOFTWARE / SYSTEMS / WORK IN MOTION'));zone.append(plate);host.append(zone)
    life.listen(zone,'pointermove',event=>{if(life.reduced||event.pointerType==='touch')return;const r=zone.getBoundingClientRect();plate.style.setProperty('--tilt-x',((.5-(event.clientY-r.top)/r.height)*7)+'deg');plate.style.setProperty('--tilt-y',(((event.clientX-r.left)/r.width-.5)*9)+'deg')})
    life.listen(zone,'pointerleave',()=>{plate.style.setProperty('--tilt-x','0deg');plate.style.setProperty('--tilt-y','0deg')})
  }),
  entry('login-sequence','Entrada de painel','Interfaces','Demonstração de entrada, cursor e feedback; sem credenciais ou autenticação.',(host,life)=>{
    const zone=element('div','ca-login');zone.append(element('p','ca-fine','PRÉVIA LOCAL / NÃO É AUTENTICAÇÃO'),element('h3','','WELCOME, OPERATOR.'))
    const form=element('form','ca-login-form'),label=element('label','','Nome na prévia'),input=element('input');input.maxLength=36;input.placeholder='Seu nome';label.append(input)
    const button=element('button','ca-button','Entrar na prévia');const output=element('p','ca-login-output','Nenhuma credencial será solicitada.');output.setAttribute('role','status')
    form.append(label,button);zone.append(form,output);host.append(zone);const run=pulse(zone,life,'ca-panel-open',400)
    life.listen(form,'submit',event=>{event.preventDefault();output.textContent='Prévia pronta, '+(input.value.trim()||'operador')+'. Nenhum dado foi enviado.';run()})
  }),
  entry('theme-transition','Paletas e superfícies','Interfaces','Oito combinações da referência, aplicadas somente à demonstração.',(host,life)=>{
    const zone=element('div','ca-palette-scene');const label=element('label','ca-control-label','Paleta da demonstração'),select=element('select')
    const palettes=upstreamPalettes
    for(const [id,name] of palettes){const option=element('option','',name);option.value=id;select.append(option)}label.append(select)
    const surface=element('div','ca-palette-surface');surface.append(element('span','ca-fine','VISUAL PROFILE'),element('h3','','ONE SYSTEM.'),element('p','','Muda a superfície. Preserva o significado.'),element('span','ca-palette-rule'))
    zone.append(label,surface);host.append(zone)
    life.listen(select,'change',()=>{const p=palettes.find(x=>x[0]===select.value);surface.style.setProperty('--local-signal',p[2]);surface.style.setProperty('--local-bg',p[3])})
  })
]
