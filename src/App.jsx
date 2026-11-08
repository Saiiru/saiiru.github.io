import { useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, ArrowRight, Menu, X, Plus, TerminalSquare } from 'lucide-react'
import './blacksite.css'
import './cyber-motion.css'
import './contextual-signals.css'
import './human-interactions.css'
import SignalText from './components/SignalText'
import DatashardArchive from './components/DatashardArchive'
import PublicArchive from './components/PublicArchive'
import repositorySnapshot from './data/repositories.json'
import { useCyberMotion, useGlitch } from './useCyberMotion'

const commandOutput = {
  help: ['COMANDOS DISPONÍVEIS', 'help     lista comandos', 'status   estado dos demos', 'labs     abre os 3 laboratórios', 'repos    busca os 62 repositórios públicos', 'stack    mostra tecnologias', 'contact  mostra canais', 'clear    limpa o terminal'],
  repos: ['ARQUIVO GITHUB / REPOSITÓRIOS PÚBLICOS', repositorySnapshot.repositories.length+' repositórios inventariados: '+repositorySnapshot.repositories.filter(item=>!item.fork).length+' próprios e '+repositorySnapshot.repositories.filter(item=>item.fork).length+' forks.', 'Use a busca do arquivo para encontrar tecnologias ou projetos.'],
  status: ['STATUS // 07.11.2026', 'Portfólio: online neste navegador.', 'Labs: demos exploratórias com dados sintéticos.', 'Execução: modo offline; LLM local opcional quando indicado.', 'Nenhuma métrica de produção é reivindicada.'],
  stack: ['STACK // FERRAMENTAS', 'React · JavaScript · Python · APIs', 'Interfaces, fluxos de avaliação, RAG e sistemas com IA aplicada.'],
  contact: ['CONTATO // URIAS MACHADO SANTOS', 'sairufsa@gmail.com', 'github.com/Saiiru', 'linkedin.com/in/sairu/'],
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
      const output = command === 'labs' ? ['LABS // DEMONSTRAÇÕES', 'EvalForge · OpsPilot · DocTrace', 'Acesse as três experiências em /labs/.'] : commandOutput[command] || [`Comando desconhecido: ${command}`, 'Digite help para ver as opções.']
      setRows(current => [...current, { type: 'command', text: `> ${command}` }, ...output.map(text => ({ type: 'system', text }))])
      if (command === 'labs' || command === 'repos') {
        if (command === 'repos') window.dispatchEvent(new Event('blacksite:open-archive'))
        document.getElementById(command === 'labs' ? 'labs' : 'todos-projetos')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
      }
    }
    setInput('')
    requestAnimationFrame(() => outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }))
  }
  return <div className="terminal-panel" aria-label="Terminal interativo"><div className="terminal-bar"><span className="terminal-lights"><i/><i/><i/></span><span>guest@s4iru:~</span><span className="terminal-live">● LOCAL</span></div><div className="terminal-output" ref={outputRef} role="log" aria-live="polite">{rows.map((row, index) => <div className={row.type === 'command' ? 'terminal-command' : ''} key={index}>{row.text}</div>)}</div><form onSubmit={run} className="terminal-form"><label htmlFor="terminal-input" className="sr-only">Comando do terminal</label><span aria-hidden="true">❯</span><input id="terminal-input" ref={inputRef} value={input} onChange={event => setInput(event.target.value)} autoComplete="off" spellCheck="false" placeholder="digite help e pressione Enter"/><button type="submit" aria-label="Executar comando"><ArrowRight size={16}/></button></form></div>
}


const technicalSkills = [
  { id:'java', group:'DESENVOLVIMENTO', glyph:'JV', name:'Java / Spring', level:'EXPERIÊNCIA PROFISSIONAL', detail:'Utilizado em aplicações corporativas e no histórico profissional. Ada Commerce documenta regras de negócio e testes em Java.', proof:'Ver código: Ada Commerce', url:'https://github.com/Saiiru/ada-commerce' },
  { id:'typescript', group:'DESENVOLVIMENTO', glyph:'TS', name:'TypeScript / Node', level:'EXPERIÊNCIA + ESTUDOS', detail:'Trabalhos anteriores com desenvolvimento web e API educacional com TypeScript, Node e Fastify.', proof:'Ver código: Plann.er API', url:'https://github.com/Saiiru/Plann.er' },
  { id:'frontend', group:'DESENVOLVIMENTO', glyph:'UI', name:'React / Interfaces', level:'EXPERIÊNCIA PROFISSIONAL', detail:'Desenvolvimento e manutenção de interfaces em React/Angular. Este site é uma demonstração interativa feita em React e Vite.', proof:'Ver repositórios públicos', url:'https://github.com/Saiiru?tab=repositories' },
  { id:'evalforge', group:'IA APLICADA · PROTÓTIPOS', glyph:'EV', name:'Evals / Prompt', level:'PROTÓTIPO TESTÁVEL', detail:'EvalForge aplica critérios explícitos a respostas e recalcula a taxa de aprovação em um conjunto sintético de testes. Não equivale à avaliação real de um LLM em produção.', proof:'Abrir EvalForge', url:'/labs/index.html?lab=evalforge' },
  { id:'opspilot', group:'IA APLICADA · PROTÓTIPOS', glyph:'OP', name:'Fluxo / Aprovação', level:'PROTÓTIPO TESTÁVEL', detail:'OpsPilot classifica chamados fictícios por regras, calcula métricas e exige aprovação humana para exportar; a integração n8n é um blueprint, não um fluxo em produção.', proof:'Abrir OpsPilot', url:'/labs/index.html?lab=opspilot' },
  { id:'doctrace', group:'IA APLICADA · PROTÓTIPOS', glyph:'RG', name:'RAG / Evidências', level:'PROTÓTIPO TESTÁVEL', detail:'DocTrace recupera trechos de documentos locais por relevância e mostra referências. No modo offline a resposta é extrativa, não gerada por LLM.', proof:'Abrir DocTrace', url:'/labs/index.html?lab=doctrace' },
  { id:'embedded', group:'HARDWARE · FORMAÇÃO', glyph:'32', name:'ESP32 / SPI', level:'LABORATÓRIO PESSOAL', detail:'Estudos de eletrônica embarcada, pinagem e diagnóstico de periféricos. O projeto TFT segue em desenvolvimento, sem demonstração pública validada.', proof:'Projetos de código', url:'https://github.com/Saiiru?tab=repositories' },
  { id:'senai', group:'HARDWARE · FORMAÇÃO', glyph:'EM', name:'Eletromecânica', level:'CURSO TÉCNICO EM ANDAMENTO', detail:'SENAI Bahia desde agosto de 2026: fundamentos elétricos, mecânicos, metrologia e medições de bancada.', proof:'Ver trajetória', url:'#trajetoria' },
  { id:'linux', group:'HARDWARE · FORMAÇÃO', glyph:'NX', name:'Linux / Git', level:'FERRAMENTAS DE TRABALHO', detail:'Ambiente Arch Linux, fluxo de desenvolvimento, versionamento e automações locais documentadas nos repositórios.', proof:'Ver GitHub', url:'https://github.com/Saiiru' },
]

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
function Skills(){
 const [selection,setSelection]=useState('java')
 const item=technicalSkills.find(x=>x.id===selection)
 return <div className="skills-layout">
  <div className="skill-inventory" role="group" aria-label="Competências e evidências">{technicalSkills.map((skill,i)=><button className={'skill-row '+(skill.id===selection?'chosen':'')} key={skill.id} onClick={()=>setSelection(skill.id)} aria-pressed={skill.id===selection}><span className="skill-no">{String(i+1).padStart(2,'0')}</span><span>{skill.name}</span><ArrowUpRight size={20}/></button>)}</div>
  <div className="skill-readout" aria-live="polite" aria-atomic="true"><span className="readout-state">{item.level}</span><h3>{item.name}</h3><p>{item.detail}</p><a className="inline-link" href={item.url} target={item.url.startsWith('http')?'_blank':undefined} rel={item.url.startsWith('http')?'noopener noreferrer':undefined}>{item.proof}<ArrowUpRight size={20}/></a><div className="readout-diagram" aria-hidden="true"><span>INPUT</span><i/><span>PROCESS</span><i/><span>EVIDENCE</span></div><span className="readout-caption">CONTEXTO ANTES DE BUZZWORDS.</span></div>
 </div>
}
function GlitchLogo({ enabled }) {
 const { active, onPointerEnter, pulse }=useGlitch(enabled)
 return <>
  <h1 id="sairu-title" className="wordmark-stage" data-glitch={active?'active':'idle'} onPointerEnter={onPointerEnter}>
   <span className="sr-only">Sairu. Software, sistemas e IA aplicada.</span>
   <Wordmark/>
   <span className="glitch-layer glitch-cyan" key={"cyan-"+pulse} aria-hidden="true"><Wordmark/></span>
   <span className="glitch-layer glitch-magenta" key={"magenta-"+pulse} aria-hidden="true"><Wordmark/></span>
  </h1>
  <div className="hero-annotation"><span className="crosshair" aria-hidden="true">+</span><span>HUMAN / IN / THE / LOOP</span><span className="annotation-rule" aria-hidden="true"/><span className="annotation-end" aria-hidden="true">/ 01</span></div>
 </>
}
function App(){
 const rootRef=useRef(null)
 const { enabled:effectsEnabled }=useCyberMotion(rootRef)
 const [menuOpen,setMenuOpen]=useState(false)
 const close=()=>setMenuOpen(false)
 return <div ref={rootRef} data-effects={effectsEnabled?'on':'off'} className="portfolio">
 <div className="ambient-field" aria-hidden="true"><span className="ambient-grid"/><span className="ambient-signal"/></div>
 <div className="reading-progress" aria-hidden="true"/>
 <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
 <div className="edge-code" aria-hidden="true">BLACKSITE // OPEN WORKSPACE — FEIRA DE SANTANA, BR</div>
 <header className="site-nav">
  <a href="#inicio" onClick={close} className="brand" aria-label="Sairu, início"><svg viewBox="0 0 36 36" width="33" height="33" aria-hidden="true"><path d="M31 3H11L4 10V17L10 23H25V29H4V34H26L32 28V20L26 14H11V8H31Z" fill="currentColor"/></svg><span className="brand-label"><SignalText>SAIRU</SignalText><span className="brand-detail"> / BLACKSITE</span></span></a>
  <nav aria-label="Navegação principal" className={menuOpen?'navigation open':'navigation'}><a href="#labs" onClick={close}><SignalText>PROJETOS</SignalText></a><a href="#todos-projetos" onClick={close}><SignalText>ARQUIVO COMPLETO</SignalText></a><a href="#sobre" onClick={close}><SignalText>SOBRE</SignalText></a><a href="#stack" onClick={close}><SignalText>STACK</SignalText></a><a href="#contato" onClick={close}><SignalText>CONTATO</SignalText><ArrowUpRight size={13}/></a></nav>
  <button className="menu-button" onClick={()=>setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen?'Fechar menu':'Abrir menu'}>{menuOpen?<X/>:<Menu/>}</button>
 </header>
 <main id="conteudo">
  <section id="inicio" className="hero">
   <div className="hero-topline"><span>URIAS MACHADO SANTOS</span><span>DESENVOLVEDOR DE SOFTWARE</span><span className="hero-place">BAHIA, BR / UTC −03</span></div>
   <div className="hero-stage">
    <div className="type-side" aria-hidden="true"><span>PERSONAL<br/>WORK<br/>ARCHIVE</span><div className="registration"><i/><i/></div><span className="type-side-bottom">DESIGN<br/>BUILD<br/>REPEAT</span></div>
    <GlitchLogo enabled={effectsEnabled}/>
    <div className="hero-titleline"><span>SOFTWARE<span className="dot">.</span></span><span>SISTEMAS<span className="dot">.</span></span><span>IA APLICADA<span className="dot">.</span></span></div>
    <div className="hero-bottom"><div className="hero-copy"><p>Entre o código e o mundo real.</p><p>Passei por times de desenvolvimento web e hoje estudo Eletromecânica. Gosto de abrir sistemas, descobrir por que algo falhou e construir uma solução que outra pessoa consiga entender e testar.</p></div><a className="hero-cta" href="#labs"><span>EXPLORE<br/>OS PROJETOS</span><ArrowDownRight size={42} strokeWidth={1.2}/></a><div className="hero-barcode" aria-hidden="true"><div/><span>SAIRU—BLACKSITE—2026</span></div></div>
   </div>
   <div className="hero-footerline"><span>EXPERIÊNCIA REAL. PROJETOS ABERTOS. TESTES REPRODUZÍVEIS.</span><span><span className="live-indicator"/> PORTFÓLIO EM CONSTRUÇÃO CONTÍNUA</span><span>SCROLL TO EXPLORE ↓</span></div>
  </section>
  <Marquee/>
  <DatashardArchive/>
  <PublicArchive/>
  <section id="sobre" className="about-section">
   <div className="about-inner section-wrap"><div className="about-main"><h2>CURIOSIDADE<br/>É O <span>COMEÇO.</span><br/>CÓDIGO É<br/>O CAMINHO.</h2><p>Sou Urias — ou Sairu, como apareço na maioria dos meus projetos. Comecei desenvolvendo aplicações web. O que mais me prende à programação é aquele momento em que um erro deixa de ser misterioso: você encontra a causa, testa uma hipótese e vê o sistema funcionar.</p><p>Trabalhei com software na Capgemini, Infomakers e Agência Digital S/A. Hoje estudo Eletromecânica no SENAI e exploro ferramentas, eletrônica e modelos de linguagem. O portfólio reúne projetos concluídos, estudos e protótipos — cada um identificado pelo que realmente foi testado.</p><a className="about-projects-link" href="#todos-projetos">VER TODOS OS PROJETOS <ArrowUpRight size={18}/></a></div>
   <div className="about-history" id="trajetoria"><h3>EXPERIÊNCIA</h3>
    <div className="history-item"><span>2022 — 2023</span><h4>Capgemini</h4><p>Analista de Soluções / Desenvolvimento de Software</p><span>Java · Spring Boot · Angular · SQL Server</span></div>
    <div className="history-item"><span>2022</span><h4>Infomakers</h4><p>Desenvolvimento Front-end</p><span>React · Redux · JavaScript · SASS</span></div>
    <div className="history-item"><span>2021 — 2022</span><h4>Agência Digital S/A</h4><p>Desenvolvimento Full Stack</p><span>React · Angular · Node.js · PostgreSQL</span></div>
    <h3 className="education-label">FORMAÇÃO / SENAI BAHIA</h3><div className="study-row"><span>EM ANDAMENTO</span><p>Técnico em<br/><strong>Eletromecânica</strong></p><span>DESDE AGO. 2026</span></div><div className="study-row"><span>CONCLUÍDO</span><p>Técnico em<br/><strong>Desenvolvimento de Sistemas</strong></p><span>FEV. 2022</span></div>
   </div></div>
  </section>
  <section id="stack" className="stack-section section-wrap"><header className="section-heading"><h2>THE<br/><span className="outlined">TOOLKIT.</span></h2><p className="stack-intro">Não é uma coleção de logos.<br/>Clique numa tecnologia para ver onde eu a usei e o que consigo demonstrar.</p></header><Skills/></section>
  <section className="terminal-section section-wrap"><div className="terminal-title"><TerminalSquare size={22}/><h2>Quer explorar por comando?</h2><p>Digite <code>help</code> para começar.</p></div><Terminal/></section>
  <section id="contato" className="contact-section section-wrap"><div className="contact-header"><span>BOAS IDEIAS COMEÇAM NUMA CONVERSA.</span><span>CANAL ABERTO ↙</span></div><a className="contact-heading" href="mailto:sairufsa@gmail.com">LET’S<br/><span>BUILD.</span><ArrowUpRight strokeWidth={.85}/></a><div className="contact-bottom"><a href="mailto:sairufsa@gmail.com">sairufsa@gmail.com<ArrowUpRight size={16}/></a><div><a href="https://github.com/Saiiru" target="_blank" rel="noopener noreferrer">GITHUB<ArrowUpRight size={16}/></a><a href="https://www.linkedin.com/in/sairu/" target="_blank" rel="noopener noreferrer">LINKEDIN<ArrowUpRight size={16}/></a></div></div></section>
 </main>
 <footer className="site-footer"><a href="#inicio">SAIRU / BLACKSITE</a><span>URIAS MACHADO SANTOS © 2026</span><a href="#inicio">VOLTAR AO TOPO ↑</a></footer>
 </div>
}
export default App
