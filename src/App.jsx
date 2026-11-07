import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDownRight, ArrowRight, ArrowUpRight, GitBranch as Github, Users as Linkedin, Mail, MapPin, TerminalSquare, Cpu, Braces, ExternalLink, Command, Menu, X } from 'lucide-react'
import './blacksite.css'

const labs = [
  {
    id: 'evalforge', number: '01', name: 'EvalForge', kind: 'EVALS / GENAI',
    problem: 'Como comparar respostas de IA antes de colocar uma experiência nas mãos de pessoas?',
    function: 'Organiza casos de teste, executa avaliações reproduzíveis e mostra critérios e resultados lado a lado.',
    tags: ['avaliação', 'qualidade', 'rastreamento'],
    mark: 'EF',
  },
  {
    id: 'opspilot', number: '02', name: 'OpsPilot', kind: 'OPERAÇÕES / AGENTES',
    problem: 'Como transformar uma solicitação operacional em passos verificáveis?',
    function: 'Classifica tickets fictícios, explica as regras e exige aprovação humana antes da exportação.',
    tags: ['orquestração', 'human in the loop', 'fluxos'],
    mark: 'OP',
  },
  {
    id: 'doctrace', number: '03', name: 'DocTrace', kind: 'RAG / CONHECIMENTO',
    problem: 'Como responder sobre documentos mantendo a origem de cada afirmação?',
    function: 'Busca trechos, constrói respostas ancoradas nas fontes e expõe as referências usadas.',
    tags: ['recuperação', 'citações', 'transparência'],
    mark: 'DT',
  },
]

const experience = [
  { period: 'AGO 2022 — ABR 2023', company: 'Capgemini', detail: 'Experiência profissional em tecnologia e entrega de software.' },
  { period: 'ABR — JUL 2022', company: 'Infomakers', detail: 'Atuação em desenvolvimento e colaboração técnica.' },
  { period: 'JUL 2021 — JAN 2022', company: 'Agência Digital S/A', detail: 'Primeiros projetos e rotina de desenvolvimento digital.' },
]

const commandOutput = {
  help: ['COMANDOS DISPONÍVEIS', 'help     lista comandos', 'status   estado dos demos', 'labs     abre as demonstrações', 'stack    mostra tecnologias', 'contact  mostra canais', 'clear    limpa o terminal'],
  status: ['STATUS // 07.11.2026', 'Portfólio: online neste navegador.', 'Labs: demos exploratórias com dados sintéticos.', 'Execução: modo offline; LLM local opcional quando indicado.', 'Nenhuma métrica de produção é reivindicada.'],
  stack: ['STACK // FERRAMENTAS', 'React · JavaScript · Python · APIs', 'Interfaces, fluxos de avaliação, RAG e sistemas com IA aplicada.'],
  contact: ['CONTATO // URIAS MACHADO SANTOS', 'sairufsa@gmail.com', 'github.com/Saiiru', 'linkedin.com/in/sairu/'],
}

function Reveal({ children, className = '', delay = 0, ...props }) {
  const reduce = useReducedMotion()
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 20 }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: .55, delay, ease: [0.22, 1, 0.36, 1] }} {...props}>{children}</motion.div>
}

function SectionTitle({ index, eyebrow, title, aside }) {
  return <div className="section-heading"><div><span className="section-index">/{index} — {eyebrow}</span><h2>{title}</h2></div>{aside && <p>{aside}</p>}</div>
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
      if (command === 'labs') document.getElementById('labs')?.scrollIntoView({ behavior: 'smooth' })
    }
    setInput('')
    requestAnimationFrame(() => outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: 'smooth' }))
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
const skillGroups = ['DESENVOLVIMENTO','IA APLICADA · PROTÓTIPOS','HARDWARE · FORMAÇÃO']
function SkillConsole(){
  const [selected,setSelected]=useState('evalforge')
  const current=technicalSkills.find(item=>item.id===selected)||technicalSkills[0]
  return <div className="skills-console">
    <div className="console-banner"><span className="console-bulb" aria-hidden="true"/><span>CORE.SYSTEMS / MATRIZ DE COMPETÊNCIAS</span><span className="console-banner-right">INSPECIONE CADA MÓDULO <span aria-hidden="true">↘</span></span></div>
    <div className="console-inner">
      <div className="console-inspector">
        <div className="inspector-art" aria-hidden="true"><svg viewBox="0 0 480 280" fill="none"><defs><pattern id="trace-grid" width="23" height="23" patternUnits="userSpaceOnUse"><path d="M23 0H0V23" stroke="#547181" strokeOpacity=".17"/></pattern></defs><rect width="480" height="280" fill="url(#trace-grid)"/><g stroke="#35606C" strokeWidth="1.8"><path d="M0 62H110V111H192L238 150"/><path d="M0 209H132L174 168H239"/><path d="M480 41H380L339 94H292L240 150"/><path d="M480 232H370L337 196H292L241 150"/><path d="M106 0V62M380 0V41M370 280V232"/></g><g stroke="#78E0DD" strokeWidth="2.2"><circle cx="240" cy="150" r="63"/><circle cx="240" cy="150" r="44" strokeDasharray="4 7"/><path d="M213 153 235 176 267 121" strokeWidth="5" strokeLinecap="square"/><path d="M12 62h64m330 170h54"/></g><g fill="#80E3E5"><circle cx="110" cy="62" r="5"/><circle cx="174" cy="168" r="4"/><circle cx="339" cy="94" r="4"/><circle cx="370" cy="232" r="5"/></g></svg></div>
        <div className="inspector-label"><span>MODULE.SELECT</span><span>0{technicalSkills.findIndex(x=>x.id===selected)+1} / 09</span></div>
        <h3 className="inspector-title"><span>CORE</span><br/>SKILLS<span className="accent-cyan">_</span></h3>
        <p className="inspector-copy">Ferramentas ligadas a trabalhos reais, estudos e protótipos com limites documentados. Selecione um módulo para conferir a evidência.</p>
        <div className="inspector-detail" aria-live="polite" aria-atomic="true">
          <span className="detail-status">{current.level}</span>
          <h4>{current.name}</h4>
          <p>{current.detail}</p>
          <a href={current.url} target={current.url.startsWith('http')?'_blank':undefined} rel={current.url.startsWith('http')?'noopener noreferrer':undefined}>{current.proof} <ArrowUpRight size={16}/></a>
        </div>
      </div>
      <div className="console-groups">
        {skillGroups.map((group,i)=><div className="console-group" key={group}>
          <div className="console-group-heading"><span>// 0{i+1}</span><h4>{group}</h4><span className="group-count">03 MODS</span></div>
          <div className="console-chip-grid">{technicalSkills.filter(x=>x.group===group).map(item=>
            <button type="button" key={item.id} className={selected===item.id?'tech-chip is-active':'tech-chip'} onClick={()=>setSelected(item.id)} aria-pressed={selected===item.id} aria-label={'Inspecionar competência: '+item.name}>
              <span className="chip-header"><span className="chip-squares" aria-hidden="true">▰ ▰ ▰</span><span className="chip-indicator" aria-hidden="true"/></span>
              <span className="chip-symbol">{item.glyph}</span>
              <span className="chip-label">{item.name}</span>
              <span className="chip-underline" aria-hidden="true"/>
            </button>)}</div>
        </div>)}
      </div>
    </div>
    <div className="console-footer"><span>STACK MAP // INTEGRADO AO PORTFÓLIO</span><span>SELEÇÃO → CONTEXTO → EVIDÊNCIA</span></div>
  </div>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const reduce = useReducedMotion()
  const close = () => setMenuOpen(false)
  return <>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <div className="site-shell">
      <header className="topbar"><a className="brand" href="#inicio" onClick={close} aria-label="Sairu, voltar ao início"><span className="brand-symbol">S4</span><span>SAIRU<span className="brand-slash">//</span>BLACKSITE</span></a><nav className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label="Navegação principal"><a onClick={close} href="#labs">LABS</a><a onClick={close} href="#trajetoria">TRAJETÓRIA</a><a onClick={close} href="#stack">STACK</a><a onClick={close} href="#contato">CONTATO</a></nav><div className="header-right"><span className="availability"><span className="status-dot"/> FEIRA DE SANTANA · BR</span><button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen}>{menuOpen ? <X size={22}/> : <Menu size={22}/>}</button></div></header>
      <main id="conteudo">
        <section id="inicio" className="hero grid-frame"><div className="hero-main"><div className="eyebrow"><span className="eyebrow-line"/> PORTFÓLIO / ENGENHARIA DE SOFTWARE <span className="eyebrow-date">2026.11</span></div><div className="industrial-label"><span>07 // INDUSTRIAL DISPLAY</span><span>BLACKSITE · SELF-BUILT SYSTEMS</span></div><h1 className="hero-title cyber-display" data-glitch="S4IRU BLACKSITE">S4IRU <span>//</span><br/>BLACKSITE<span className="title-period">.</span></h1><div className="hazard-micro"><span className="hazard-stripe" aria-hidden="true"/><span>BUILD // TEST // DOCUMENT</span><span className="hazard-stripe" aria-hidden="true"/></div><div className="hero-divider"/><div className="hero-bottom"><div><p className="hero-kicker">SOFTWARE. SISTEMAS. IA APLICADA.</p><p className="hero-intro">Sou Urias Machado Santos. Construo experiências digitais e protótipos de IA com atenção à utilidade, clareza e verificabilidade.</p></div><a className="round-link" href="#labs" aria-label="Explorar projetos"><ArrowDownRight size={25}/></a></div></div><div className="hero-side"><div className="hero-art" aria-hidden="true"><span className="corner-brackets" aria-hidden="true"/><span className="hero-sensor">[ SYSTEM MAP / 001 ]</span><img src="/assets/img/blacksite-network.svg" alt=""/><span className="art-coordinate art-top">NODE_01 / SYSTEMS</span><span className="art-coordinate art-bottom">-12.266° / -38.966°</span></div><div className="hero-side-bottom"><div><span className="mini-label">FOCO ATUAL</span><strong>AI BUILDER<span className="accent-cyan">_</span></strong><p>GenAI aplicada a problemas reais, com demonstrações claras dos limites de cada protótipo.</p></div><Cpu size={28} strokeWidth={1.4}/></div></div></section>
        <section className="intro-strip" aria-label="Resumo"><span><span className="tiny-cross">✳</span> ENGINEERING MINDSET</span><span>PROTÓTIPOS VERIFICÁVEIS</span><span>INTERFACE + SISTEMAS + IA</span><span className="strip-end">SCROLL TO EXPLORE <ArrowDownRight size={14}/></span></section>
        <section id="labs" className="section labs-section"><SectionTitle index="01" eyebrow="PROVA DE TRABALHO" title={<>Laboratório<span className="accent-cyan">.</span></>} aside="Três demos navegáveis para explorar decisões de produto, implementação e avaliação em IA aplicada."/><div className="labs-grid">{labs.map((lab, index) => <Reveal className="lab-card" delay={index * .08} key={lab.id}><div className="lab-top"><span>LAB_{lab.number} / {lab.kind}</span><span className="lab-arrow"><ArrowUpRight size={19}/></span></div><div className="lab-mark" aria-hidden="true">{lab.mark}<span>+</span></div><div className="lab-content"><span className="lab-counter">[{lab.number} / 03]</span><h3>{lab.name}</h3><p className="lab-problem">{lab.problem}</p><p className="lab-function">{lab.function}</p><div className="tag-row">{lab.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="lab-disclosure">DADOS SINTÉTICOS <span>·</span> MODO OFFLINE / LLM LOCAL OPCIONAL</div><a className="lab-link" href={`/labs/index.html?lab=${lab.id}`} aria-label={`Abrir demonstração ${lab.name}`}>EXPLORAR DEMO <ArrowUpRight size={17}/></a><a className="lab-source-link" href="https://github.com/Saiiru/saiiru.github.io/tree/feat/blacksite-ai-builder-20261107/projects/ai-builder-labs" target="_blank" rel="noreferrer">CÓDIGO E TESTES <ArrowUpRight size={15}/></a></div></Reveal>)}</div><div className="secondary-projects"><div className="secondary-heading"><span className="mini-label">OUTROS PROJETOS / REPOSITÓRIOS PÚBLICOS</span><p>Trabalhos disponíveis no GitHub.</p></div><a href="https://github.com/Saiiru/ada-commerce" target="_blank" rel="noreferrer"><span><Github size={18}/> Ada Commerce</span><ArrowUpRight size={18}/></a><a href="https://github.com/Saiiru/Plann.er" target="_blank" rel="noreferrer"><span><Github size={18}/> Plann.er</span><ArrowUpRight size={18}/></a></div></section>
        <section id="trajetoria" className="section trajectory-section"><SectionTitle index="02" eyebrow="TRAJETÓRIA" title={<>Código &amp; contexto<span className="accent-violet">.</span></>} aside="Experiência em equipes de tecnologia e formação técnica contínua."/><div className="trajectory-grid"><Reveal className="timeline-panel"><div className="panel-label"><Braces size={17}/> EXPERIÊNCIA / HISTÓRICO</div><div className="timeline">{experience.map(item => <div className="timeline-item" key={item.company}><span className="timeline-dot"/><div><span className="timeline-period">{item.period}</span><h3>{item.company}</h3><p>{item.detail}</p></div></div>)}</div></Reveal><Reveal className="education-panel" delay={.1}><div className="panel-label"><span className="gold-dot"/> FORMAÇÃO / EM ANDAMENTO</div><div className="education-item"><span className="education-year">2022 / CONCLUÍDO</span><h3>Técnico em Desenvolvimento de Sistemas</h3><p>SENAI</p></div><div className="education-item"><span className="education-year">DESDE AGO 2026 / EM CURSO</span><h3>Técnico em Eletromecânica</h3><p>Formação técnica em andamento.</p></div><div className="education-art" aria-hidden="true"><img src="/assets/img/blacksite-circuit.svg" alt=""/></div></Reveal></div></section>
        <section id="stack" className="section stack-section"><SectionTitle index="03" eyebrow="SKILL MATRIX / EVIDÊNCIAS" title={<>Código. Sistemas. IA<span className="accent-cyan">.</span></>} aside="Módulos de competência vinculados a experiência profissional, formação ou demos executáveis — sem barras de nível inventadas."/><Reveal><SkillConsole/></Reveal></section>
        <section className="section terminal-section"><SectionTitle index="04" eyebrow="INTERFACE DE COMANDO" title={<>Acesso ao sistema<span className="accent-violet">.</span></>} aside="Um terminal local para explorar o portfólio. Experimente help, status ou labs."/><Reveal><Terminal/></Reveal></section>
        <section id="contato" className="contact-section"><div className="contact-text"><span className="section-index">/05 — CANAL ABERTO</span><h2>Vamos construir<br/><span>algo útil</span><span className="accent-cyan">.</span></h2><p>Disponível para conversar sobre software, produtos e IA aplicada.</p><a className="email-link" href="mailto:sairufsa@gmail.com">sairufsa@gmail.com <ArrowUpRight size={24}/></a></div><div className="contact-links"><span className="mini-label">ENCONTRE-ME EM</span><a href="https://github.com/Saiiru" target="_blank" rel="noreferrer"><Github size={20}/> GITHUB <ArrowUpRight size={19}/></a><a href="https://www.linkedin.com/in/sairu/" target="_blank" rel="noreferrer"><Linkedin size={20}/> LINKEDIN <ArrowUpRight size={19}/></a><a href="mailto:sairufsa@gmail.com"><Mail size={20}/> EMAIL <ArrowUpRight size={19}/></a><div className="location"><MapPin size={17}/> FEIRA DE SANTANA, BAHIA · BRASIL</div></div></section>
      </main><footer className="footer"><a href="#inicio" className="footer-brand">S4IRU <span>//</span> BLACKSITE</a><span>URIAS MACHADO SANTOS © 2026</span><a href="#inicio">VOLTAR AO TOPO ↑</a></footer>
    </div>
  </>
}

export default App
