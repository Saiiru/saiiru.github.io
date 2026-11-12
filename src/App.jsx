import '../components/effects/signature.css'
import '../components/effects/crt.css'
import { bindFrameSignal } from '../components/effects/frame.js'
import '../components/effects/frame.css'
import { useEffect, useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, ArrowRight, Menu, X, Plus, TerminalSquare } from 'lucide-react'
import './blacksite.css'
import './cyber-motion.css'
import './contextual-signals.css'
import './human-interactions.css'
import './recon-identity.css'
import './cyber2077.css'
import DeferredSignalField from './components/DeferredSignalField'
import SignalText from './components/SignalText'
import Toolkit from './components/Toolkit'
import DeferredStandaloneProjects from './components/DeferredStandaloneProjects'
import DatashardArchive from './components/DatashardArchive'
import KoraCaseStudy from './components/KoraCaseStudy'
import { useCyberMotion, useGlitch } from './useCyberMotion'

const commandOutput = {
  help: ['COMANDOS DISPONÍVEIS', 'help     lista comandos', 'labs     abre laboratórios de IA', 'status   estado do portfólio', 'repos    abre os projetos demonstráveis', 'stack    mostra tecnologias', 'contact  mostra canais', 'clear    limpa o terminal'],
  repos: ['PROJETOS VERIFICÁVEIS', 'A vitrine mostra somente aplicações com demo pública e evidências reproduzíveis.', 'Para o histórico completo: github.com/Saiiru.'],
  status: ['PORTFÓLIO // EM EVOLUÇÃO', 'Tecnologias e formação estão no Toolkit.', 'Novos projetos entram na vitrine após construção e validação.'],
  stack: ['TOOLKIT // TECNOLOGIAS E CONHECIMENTOS', 'Java · Spring · TypeScript · Node.js · React · Angular · SQL · Linux · Git', 'Embarcados e Eletromecânica em estudo; CLP e inversores como próximos conteúdos.'],
  contact: ['CONTATO // URIAS MACHADO SANTOS', 'github.com/Saiiru', 'linkedin.com/in/sairu/'],
}

function Terminal() {
  const [rows, setRows] = useState([{ type: 'system', text: 'BLACKSITE TERMINAL v1.0' }, { type: 'system', text: 'Digite help para explorar.' }])
  const [input, setInput] = useState('')
  const inputRef = useRef(null)
  const outputRef = useRef(null)
  function run(event) {
    event.preventDefault()
    const command = input.trim().toLowerCase()
    if (!command) return
    if (command === 'clear') setRows([])
    else {
      const output = command === 'labs' ? ['PROJETOS // APPLIED AI', 'Rota: roteamento da KORA com regras e ML experimental. Vetor: classificador supervisionado. Crivo: testes. Lastro: busca com fontes.', 'Demos e relatórios reproduzíveis no Datashard Archive. Dados sintéticos; desenvolvimento assistido por IA.'] : commandOutput[command] || [`Comando desconhecido: ${command}`, 'Digite help para ver as opções.']
      setRows(current => [...current, { type: 'command', text: `> ${command}` }, ...output.map(text => ({ type: 'system', text }))])
      if (command === 'labs' || command === 'repos') {
        document.getElementById(command==='labs'?'labs':'projetos-independentes')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
      }
    }
    setInput('')
    requestAnimationFrame(() => outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }))
  }
  return <div className="terminal-panel crt-surface" aria-label="Terminal interativo"><span className="crt-scanlines" aria-hidden="true"/><div className="terminal-bar"><span className="terminal-lights"><i/><i/><i/></span><span>guest@s4iru:~</span><span className="terminal-live">● LOCAL</span></div><div className="terminal-output" ref={outputRef} role="log" aria-live="polite">{rows.map((row, index) => <div className={row.type === 'command' ? 'terminal-command' : ''} key={index}>{row.text}</div>)}</div><form onSubmit={run} className="terminal-form"><label htmlFor="terminal-input" className="sr-only">Comando do terminal</label><span aria-hidden="true">❯</span><input id="terminal-input" ref={inputRef} value={input} onChange={event => setInput(event.target.value)} autoComplete="off" spellCheck="false" placeholder="digite help e pressione Enter"/><button type="submit" aria-label="Executar comando"><ArrowRight size={16}/></button></form></div>
}



function Wordmark(){
 return <svg className="sairu-wordmark" viewBox="0 0 828 168" aria-hidden="true" focusable="false">
  <g fill="currentColor">
   <path d="M140 0H28L0 28V75L25 100H108V135H0V168H111L143 136V89L120 66H34V33H140Z"/>
   <path fillRule="evenodd" d="M178 0H277L305 28V168H270V110H184V168H150V28ZM184 33V77H270V33Z"/>
   <path d="M321 0H415V33H386V135H415V168H321V135H351V33H321Z"/>
   <path fillRule="evenodd" d="M433 0H548L579 31V81L552 108 594 168H550L509 108H468V168H433ZM468 33V75H543V33Z"/>
   <path d="M610 0H645V135H735V0H770V139L741 168H639L610 139Z"/>
   <path d="M796 135H828V168H796Z"/>
  </g>
  <g className="wordmark-cuts" fill="#11130f"><path d="M-2 47H831V53H-2Z"/><path d="M263 101H286V106H263Z"/><path d="M443 141H470V147H443Z"/></g>
 </svg>
}
function Marquee(){
 return <div className="signal-tape" aria-hidden="true"><div className="tape-track">{[0,1].map(n=><div key={n}><span>CODE.</span><Plus/><span>BREAK.</span><Plus/><span>UNDERSTAND.</span><Plus/><span>REBUILD.</span><Plus/></div>)}</div></div>
}

function GlitchLogo({ enabled }) {
 const { active, onPointerEnter, pulse }=useGlitch(enabled)
 return <>
  <h1 id="sairu-title" className="wordmark-stage" data-glitch={active?'active':'idle'} onPointerEnter={onPointerEnter}>
   <span className="sr-only">Sairu. Software, sistemas e automação.</span>
   <Wordmark/>
   <span className="glitch-layer glitch-cyan" key={"cyan-"+pulse} aria-hidden="true"><Wordmark/></span>
   <span className="glitch-layer glitch-magenta" key={"magenta-"+pulse} aria-hidden="true"><Wordmark/></span>
   <svg key={"hud-"+pulse} className="signature-frame" viewBox="0 0 828 168" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <path vectorEffect="non-scaling-stroke" d="M2 30V2H110M718 2H826V30M2 138V166H110M718 166H826V138"/>
    <path className="signature-coral" vectorEffect="non-scaling-stroke" d="M120 2H176M650 166H708M2 53V76M826 92V115"/>
    <path className="signature-sweep" vectorEffect="non-scaling-stroke" d="M2 84H826"/>
   </svg>
  </h1>
  <div className="hero-annotation"><span className="crosshair" aria-hidden="true">+</span><span>HUMAN / IN / THE / LOOP</span><span className="annotation-rule" aria-hidden="true"/><span className="annotation-end" aria-hidden="true">/ 01</span></div>
 </>
}
function App(){
 const rootRef=useRef(null)
 const { enabled:effectsEnabled }=useCyberMotion(rootRef)
 const [menuOpen,setMenuOpen]=useState(false)
 const menuButton=useRef(null)
 useEffect(()=>{
  if(!menuOpen)return
  const onKey=event=>{if(event.key==='Escape'){setMenuOpen(false);menuButton.current?.focus()}}
  document.addEventListener('keydown',onKey)
  return()=>document.removeEventListener('keydown',onKey)
 },[menuOpen])
 useEffect(()=>{
  const cleanups=Array.from(rootRef.current.querySelectorAll('.contact-channel,.terminal-panel')).map(bindFrameSignal)
  return()=>cleanups.forEach(cleanup=>cleanup())
 },[])
 const close=()=>setMenuOpen(false)
 return <div ref={rootRef} data-effects={effectsEnabled?'on':'off'} className="portfolio">
 <div className="ambient-field" aria-hidden="true"><span className="ambient-grid"/><span className="ambient-signal"/></div>
 <div className="reading-progress" aria-hidden="true"/>
 <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
 <div className="edge-code" aria-hidden="true">BLACKSITE // OPEN WORKSPACE — FEIRA DE SANTANA, BR</div>
 <header className="site-nav">
  <a href="#inicio" onClick={close} className="brand" aria-label="Sairu, início"><img src="/brand/sairu-mark.svg" alt="" width="38" height="38"/><span className="brand-label"><SignalText>SAIRU</SignalText><span className="brand-detail"> / BLACKSITE</span></span></a>
  <nav aria-label="Navegação principal" className={menuOpen?'navigation open':'navigation'}><a href="#projetos-independentes" onClick={close}><SignalText>PROJETOS</SignalText></a><a href="#caso-kora" onClick={close}><SignalText>LABS DE IA</SignalText></a><a href="#sobre" onClick={close}><SignalText>SOBRE</SignalText></a><a href="#stack" onClick={close}><SignalText>STACK</SignalText></a><a href="#contato" onClick={close}><SignalText>CONTATO</SignalText><ArrowUpRight size={13}/></a></nav>
  <button ref={menuButton} className="menu-button" onClick={()=>setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen?'Fechar menu':'Abrir menu'}>{menuOpen?<X/>:<Menu/>}</button>
 </header>
 <main id="conteudo">
  <section id="inicio" className="hero">
   <div className="hero-topline"><span>URIAS MACHADO SANTOS</span><span>SOFTWARE · IA APLICADA</span><span className="hero-place">BAHIA, BR / UTC −03</span></div>
   <div className="hero-stage">
    <div className="type-side" aria-hidden="true"><span>PERSONAL<br/>WORK<br/>ARCHIVE</span><div className="registration"><i/><i/></div><span className="type-side-bottom">DESIGN<br/>BUILD<br/>REPEAT</span></div>
    <GlitchLogo enabled={effectsEnabled}/>
    <div className="hero-titleline"><span>SOFTWARE<span className="dot">.</span></span><span>SISTEMAS<span className="dot">.</span></span><span>AUTOMAÇÃO<span className="dot">.</span></span></div>
    <div className="hero-bottom"><div className="hero-copy"><p>Software que resolve problemas. IA que dá para investigar.</p><p>Trabalhei com desenvolvimento web e hoje estudo Eletromecânica no SENAI. Nos laboratórios de IA, exploro classificação de texto, recuperação de documentos e testes automatizados — com código aberto, dados sintéticos e limites declarados.</p></div><div className="hero-actions"><a className="hero-cta" href="#labs"><span>TESTAR OS<br/>LABORATÓRIOS</span><ArrowDownRight size={42} strokeWidth={1.2}/></a><a className="hero-library-link" href="#projetos-independentes">VER PROJETOS INDEPENDENTES <ArrowUpRight size={16} aria-hidden="true"/></a></div><div className="hero-barcode" aria-hidden="true"><div/><span>SAIRU—BLACKSITE—2026</span></div></div>
   </div>
   <div className="hero-footerline"><span>SOFTWARE, SISTEMAS EMBARCADOS E ELETROMECÂNICA.</span><span><span className="live-indicator"/> PORTFÓLIO EM CONSTRUÇÃO CONTÍNUA</span><span>SCROLL TO EXPLORE ↓</span></div>
  </section>
  <Marquee/>
  <section className="proof-strip section-wrap" aria-label="Método de trabalho nos laboratórios de IA">
   <h2>Da hipótese<br/>à <span>evidência.</span></h2>
   <div><ol className="proof-steps"><li>Entrada</li><li>Rota</li><li>Avaliação</li><li>Fontes</li></ol>
    <p>Quero conseguir explicar não só o que o programa fez, mas o que acontece quando erra. Os laboratórios mostram a entrada, as decisões, os testes e os casos em que o sistema deve pedir revisão. São experimentos reproduzíveis — não serviços em produção.</p>
   </div>
  </section>
  <DeferredStandaloneProjects/><KoraCaseStudy/><DatashardArchive/>
  <section id="sobre" className="about-section">
   <div className="about-inner section-wrap"><div className="about-main"><h2>CURIOSIDADE<br/>É O <span>COMEÇO.</span><br/>CÓDIGO É<br/>O CAMINHO.</h2><p>Sou Urias — ou Sairu, como apareço na maioria dos meus projetos. Comecei desenvolvendo aplicações web. O que mais me prende à programação é aquele momento em que um erro deixa de ser misterioso: você encontra a causa, testa uma hipótese e vê o sistema funcionar.</p><p>Trabalhei com software na Capgemini, Infomakers e Agência Digital S/A. Hoje estudo Eletromecânica no SENAI e exploro ferramentas, eletrônica e modelos de linguagem. Este espaço acompanha meus estudos e meu histórico em desenvolvimento.</p><a className="about-projects-link" href="#projetos-independentes">VER PROJETOS VALIDADOS <ArrowUpRight size={18}/></a></div>
   <div className="about-history" id="trajetoria"><h3>EXPERIÊNCIA</h3>
    <div className="history-item"><span>2022 — 2023</span><h4>Capgemini</h4><p>Analista de Soluções / Desenvolvimento de Software</p><span>Java · Spring Boot · Angular · SQL Server</span></div>
    <div className="history-item"><span>2022</span><h4>Infomakers</h4><p>Desenvolvimento Front-end</p><span>React · Redux · JavaScript · SASS</span></div>
    <div className="history-item"><span>2021 — 2022</span><h4>Agência Digital S/A</h4><p>Desenvolvimento Full Stack</p><span>React · Angular · Node.js · PostgreSQL</span></div>
    <h3 className="education-label">FORMAÇÃO / SENAI BAHIA</h3><div className="study-row"><span>EM ANDAMENTO</span><p>Técnico em<br/><strong>Eletromecânica</strong></p><span>AGO. 2026 — PREV. 2028</span></div><div className="study-row"><span>CONCLUÍDO</span><p>Técnico em<br/><strong>Desenvolvimento de Sistemas</strong></p><span>FEV. 2022</span></div>
   </div></div>
  </section>
  <section id="stack" className="stack-section section-wrap"><header className="section-heading"><h2>THE<br/><span className="outlined">TOOLKIT.</span></h2><p className="stack-intro">Software, embarcados e Eletromecânica.<br/>Escolha uma tecnologia para ver meu contato com ela e o que ainda estou estudando.</p></header><Toolkit/></section>
  <section className="terminal-section section-wrap"><div className="terminal-title"><TerminalSquare size={22}/><h2>Quer explorar por comando?</h2><p>Digite <code>help</code> para começar.</p></div><Terminal/></section>
  <section id="contato" className="contact-section" aria-labelledby="contact-title">
   <DeferredSignalField/><div className="contact-shade" aria-hidden="true"/>
   <div className="contact-layout">
    <div className="contact-copy"><h2 id="contact-title">O próximo passo<br/>é uma <span>conversa.</span></h2><p>Sobre software, automação ou uma oportunidade no seu time. Me conta o que você está construindo.</p></div>
    <div className="contact-channels">
     <a className="contact-channel" href="https://www.linkedin.com/in/sairu/" target="_blank" rel="noopener noreferrer"><div><span>Vamos conversar</span><small>Me encontre no LinkedIn e mande uma mensagem.</small></div><ArrowUpRight size={27}/></a>
     <a className="contact-channel" href="https://github.com/Saiiru" target="_blank" rel="noopener noreferrer"><div><span>Explore o código</span><small>Meu perfil, estudos e contribuições no GitHub.</small></div><ArrowUpRight size={27}/></a>
    </div>
   </div>
   <div className="contact-signoff"><div className="contact-signature"><img src="/brand/sairu-mark.svg" alt="" width="48" height="48"/><span>SAIRU</span></div><span>URIAS MACHADO SANTOS<br/>FEIRA DE SANTANA, BAHIA</span></div>
  </section>
 </main>
 <footer className="site-footer"><a href="#inicio">SAIRU / BLACKSITE</a><span>URIAS MACHADO SANTOS © 2026</span><a href="/components/">BIBLIOTECA DE INTERFACES ↗</a><a href="#inicio">VOLTAR AO TOPO ↑</a></footer>
 </div>
}
export default App
