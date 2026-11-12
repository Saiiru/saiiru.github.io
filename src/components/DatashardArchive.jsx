import { useRef, useState } from 'react'
import { ArrowUpRight, ArrowDown, Check, Copy, Download, FileCode2, Layers, Plus } from 'lucide-react'
import { datashards, resolveShard, createRecord } from './datashards'
import './datashard-archive.css'
import SignalText from './SignalText'

const sections = [
  { id: 'brief', label: 'O problema' },
  { id: 'implementation', label: 'Implementação' },
  { id: 'evidence', label: 'Testes e provas' }
]
function initialShard() {
  return resolveShard(new URL(window.location.href).searchParams.get('shard') || 'rota')
}

/** Original vector memory module, not an asset extracted from a game. */
function ShardModule({ code, serial }) {
  return <svg className="shard-module" viewBox="0 0 108 176" aria-hidden="true" focusable="false">
    <path className="module-shadow" d="M17 9H78L100 31V134L83 151H75V169H24V151H10V29Z"/>
    <path className="module-body" d="M13 4H75L96 25V130L79 147H71V162H20V147H6V24Z"/>
    <path className="module-top" d="M14 11H69L87 29H14Z"/>
    <path className="module-edge" d="M12 33V139H25M81 40V124L69 136"/>
    <path className="module-slots" d="M23 43H73M23 49H73M23 55H73"/>
    <rect className="module-core" x="23" y="68" width="49" height="43" rx="2"/>
    <path className="module-traces" d="M24 80H10M24 92H14M72 80H86M72 98H85M35 69V59M59 69V59M35 111V126M59 111V130"/>
    <text x="47" y="95" textAnchor="middle" className="module-code">{code}</text>
    <text transform="translate(87 116) rotate(-90)" className="module-serial">{serial}</text>
    <path className="module-contact-base" d="M21 143H70V162H21Z"/>
    {Array.from({length:8},(_,i)=><rect className="module-contact" key={i} x={24+i*5.5} y="146" width="3.5" height="16"/>)}
    <path className="module-notch" d="M75 4V25H96"/>
    <circle className="module-screw" cx="16" cy="127" r="2"/>
    <circle className="module-screw" cx="75" cy="37" r="2"/>
  </svg>
}

export default function DatashardArchive() {
  const [selectedId, setSelectedId] = useState(() => initialShard().id)
  const [read, setRead] = useState(() => new Set([initialShard().id]))
  const [tab, setTab] = useState('brief')
  const [copyStatus, setCopyStatus] = useState('')
  const buttons = useRef([])
  const tabs = useRef([])
  const shard = resolveShard(selectedId)
  const index = datashards.findIndex(item => item.id === selectedId)
  const shareURL = 'https://saiiru.github.io/?shard=' + shard.id + '#labs'

  function trackPointer(event) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (event.pointerType === 'touch') return
    const rect=event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--card-x', ((event.clientX-rect.left)/rect.width*100).toFixed(2)+'%')
    event.currentTarget.style.setProperty('--card-y', ((event.clientY-rect.top)/rect.height*100).toFixed(2)+'%')
  }

  function select(id) {
    setSelectedId(id)
    setRead(previous => new Set([...previous, id]))
    setTab('brief')
    setCopyStatus('')
    const url = new URL(window.location.href)
    url.searchParams.set('shard', id)
    url.hash = 'labs'
    window.history.replaceState(window.history.state, '', url)
  }

  function catalogKeys(event, current) {
    let next
    if (['ArrowDown','ArrowRight'].includes(event.key)) next=(current+1)%datashards.length
    else if (['ArrowUp','ArrowLeft'].includes(event.key)) next=(current+datashards.length-1)%datashards.length
    else if (event.key==='Home') next=0
    else if (event.key==='End') next=datashards.length-1
    else return
    event.preventDefault()
    select(datashards[next].id)
    buttons.current[next]?.focus()
  }

  function tabKeys(event, current) {
    let next
    if (event.key==='ArrowRight') next=(current+1)%sections.length
    else if (event.key==='ArrowLeft') next=(current+sections.length-1)%sections.length
    else if (event.key==='Home') next=0
    else if (event.key==='End') next=sections.length-1
    else return
    event.preventDefault()
    setTab(sections[next].id)
    tabs.current[next]?.focus()
  }

  function exportRecord() {
    const blob=new Blob([JSON.stringify(createRecord(shard),null,2)],{type:'application/json'})
    const url=URL.createObjectURL(blob)
    const anchor=document.createElement('a')
    anchor.href=url
    anchor.download=shard.id+'.datashard.json'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    // Let the browser resolve the download before releasing its object URL.
    setTimeout(()=>URL.revokeObjectURL(url),1000)
  }

  async function copyLink() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(shareURL)
      setCopyStatus('Link copiado.')
    } catch {
      setCopyStatus('Selecione e copie o endereço abaixo.')
    }
  }

  return <section id="labs" className="section-wrap datashards-section">
    <header className="archive-heading">
      <div><h2>DATASHARD<br/><span>ARCHIVE.</span></h2></div>
      <div className="archive-intro"><p>Quatro laboratórios de IA aplicada.<br/>Modelos, testes e fontes verificáveis.</p><span>Cada arquivo abre um projeto, a decisão técnica por trás dele e as evidências disponíveis. Teste a demo; depois confira o código, os testes e os limites.</span></div>
    </header>
    <div className="archive-wayfinding" aria-label="Como navegar pelos projetos">
      <span><b>01</b> ESCOLHA UM DATASHARD</span>
      <span aria-hidden="true">/</span>
      <span><b>02</b> ENTENDA A DECISÃO</span>
      <span aria-hidden="true">/</span>
      <span><b>03</b> TESTE A DEMO</span>
    </div>

    <div className="datashard-archive">
      <div className="archive-topbar"><span><Layers size={15}/> BLACKSITE / ARQUIVOS DE CAMPO</span><span className="archive-read-count">{String(read.size).padStart(2,'0')} / {String(datashards.length).padStart(2,'0')} EXPLORADOS NESTA VISITA</span></div>
      <div className="archive-layout">
        <aside className="shard-catalog" aria-label="Catálogo de datashards">
          <div className="catalog-label"><span>CLIQUE NUM PROJETO PARA ABRIR SEU DOSSIÊ</span><ArrowDown size={14}/></div>
          <div className="shard-choices" role="group" aria-label="Selecionar projeto">
            {datashards.map((item,i)=><button key={item.id} type="button" className={'shard-select accent-'+item.accent} data-shard={item.id} aria-label={'Abrir datashard '+item.name} aria-pressed={item.id===selectedId} aria-controls="shard-reader" onClick={()=>select(item.id)} onPointerMove={trackPointer} onKeyDown={event=>catalogKeys(event,i)} ref={el=>buttons.current[i]=el}>
              <span className="shard-slot"><ShardModule code={item.code} serial={item.serial}/></span>
              <span className="shard-label"><span className="shard-serial">{item.serial}</span><strong><SignalText>{item.name}</SignalText></strong><span className="shard-descriptor">{item.descriptor}</span><span className="shard-read">{read.has(item.id)?<Check size={11}/>:<Plus size={11}/>} {item.id===selectedId?'SELECIONADO':read.has(item.id)?'JÁ ABERTO':'CLIQUE PARA EXPLORAR'}</span></span>
              <span className="shard-selected-mark" aria-hidden="true">{item.id===selectedId?<ArrowUpRight size={17}/>:null}</span>
            </button>)}
          </div>
          <div className="catalog-footer"><span>{String(datashards.length).padStart(2,'0')} PROJETOS EM DESTAQUE</span><span>Clique ou navegue com as setas.</span></div>
        </aside>

        <div id="shard-reader" className={'shard-reader accent-'+shard.accent} role="region" aria-labelledby="reader-title">
          <div className="reader-ribbon"><span className="reader-bus" aria-hidden="true"/><span>PROJETO SELECIONADO · COMO FUNCIONA</span><span>{String(index+1).padStart(2,'0')} / {String(datashards.length).padStart(2,'0')}</span></div>
          <div className="reader-title-row"><div><span className="reader-path">{shard.serial} / {shard.category}</span><h3 id="reader-title"><SignalText>{shard.name}</SignalText></h3><p className="reader-human-title">{shard.publicTitle}</p></div><span className="reader-file-icon" aria-hidden="true"><FileCode2 size={29} strokeWidth={1}/></span></div>
          <div className="reader-meta"><span>{shard.status.toUpperCase()}</span><span>DADOS DE EXEMPLO</span><span>CÓDIGO + TESTES</span></div>

          <div className="reader-tabs" role="tablist" aria-label={'Seções do dossiê '+shard.name}>
            {sections.map((section,i)=><button key={section.id} ref={el=>tabs.current[i]=el} id={'shard-tab-'+section.id} type="button" role="tab" aria-selected={tab===section.id} aria-controls={'shard-panel-'+section.id} tabIndex={tab===section.id?0:-1} onClick={()=>setTab(section.id)} onKeyDown={event=>tabKeys(event,i)}>{section.label}</button>)}
          </div>

          <div className="reader-sheet" key={shard.id}>
            <div id="shard-panel-brief" role="tabpanel" aria-labelledby="shard-tab-brief" tabIndex="0" hidden={tab!=='brief'}>
              <p className="reader-question">{shard.question}</p>
              <p className="reader-body-copy">{shard.summary}</p><div className="reader-decision"><span>DECISÃO DE ENGENHARIA / TRADE-OFF</span><p>{shard.decision}</p></div>
              <div className="reader-block"><h4>COMO EXPLORAR</h4><p>{shard.method}</p></div>
              <div className="reader-limit"><span aria-hidden="true">!</span><div><h4>ESCOPO E LIMITES</h4><p>{shard.limitation}</p></div></div>
            </div>
            <div id="shard-panel-implementation" role="tabpanel" aria-labelledby="shard-tab-implementation" tabIndex="0" hidden={tab!=='implementation'}>
              <ol className="reader-steps">{shard.steps.map(([title,description],i)=><li key={title}><span>0{i+1}</span><div><h4>{title}</h4><p>{description}</p></div></li>)}</ol>
              <div className="reader-stack">{shard.stack.map(tech=><span key={tech}>{tech}</span>)}</div>
              <a className="reader-module" href={shard.source+'/'+shard.module} target="_blank" rel="noopener noreferrer"><FileCode2 size={16}/>{shard.module}<ArrowUpRight size={16}/></a>
            </div>
            <div id="shard-panel-evidence" role="tabpanel" aria-labelledby="shard-tab-evidence" tabIndex="0" hidden={tab!=='evidence'}>
              <figure className="reader-evidence-image"><img src={shard.image} alt={shard.id==='rota'?'Prévia visual do laboratório Rota': 'Prévia visual da demonstração '+shard.name} width="1000" height="690" loading="lazy"/><figcaption>DEMONSTRAÇÃO NO NAVEGADOR / DADOS DE EXEMPLO</figcaption></figure>
              <ul className="reader-evidence-list">{shard.evidence.map(text=><li key={text}><Check size={13}/><span>{text}</span></li>)}</ul>
              <a className="reader-module" href={shard.source+'/tests/'+shard.testFile} target="_blank" rel="noopener noreferrer"><FileCode2 size={16}/>{shard.testFile}<ArrowUpRight size={16}/></a>
            </div>
          </div>

          <div className="reader-actions">
            <a className="shard-demo-link" href={shard.demo}>TESTAR O PROJETO <ArrowUpRight size={20}/></a>
            <a className="shard-source-link" href={shard.source+'/'+shard.readme.replace('projects/applied-ai/', '')} target="_blank" rel="noopener noreferrer">LER O README <ArrowUpRight size={16}/></a>
          </div>
          <div className="reader-proof-links">
            <a href={shard.source+'/'+shard.report.replace('projects/applied-ai/', '')} target="_blank" rel="noopener noreferrer">RELATÓRIO DE AVALIAÇÃO <ArrowUpRight size={14}/></a>
            <a href={shard.source+'/tests/'+shard.testFile} target="_blank" rel="noopener noreferrer">CÓDIGO DOS TESTES <ArrowUpRight size={14}/></a>
          </div>
          <div className="reader-utilities"><button type="button" className="shard-export" onClick={exportRecord}><Download size={14}/> EXPORTAR .JSON</button><button type="button" className="shard-share" onClick={copyLink}><Copy size={13}/> COPIAR LINK</button><span>FORMATO ABERTO / SEM BLOQUEIO</span></div>
          {copyStatus&&<div className="reader-share-status" role="status"><span>{copyStatus}</span>{copyStatus.startsWith('Selecione')&&<input aria-label="Link do datashard" readOnly value={shareURL} onFocus={event=>event.target.select()}/>}</div>}
          <span className="sr-only" role="status">{shard.name+' aberto. '+read.size+' de '+datashards.length+' registros lidos nesta visita.'}</span>
        </div>
      </div>
      <div className="archive-bottom"><span>OS EXEMPLOS SÃO SINTÉTICOS, E OS TESTES SÃO REPRODUZÍVEIS</span><span>ESTUDOS DESENVOLVIDOS COM ASSISTÊNCIA DE IA <ArrowUpRight size={12}/></span></div>
    </div>

    <a className="archive-complete-link" href="#projetos-independentes">VER APLICAÇÕES DEMONSTRÁVEIS <ArrowDown size={18}/></a>
  </section>
}
