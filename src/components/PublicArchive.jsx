import { bindFrameSignal } from '../../components/effects/frame.js'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, BookOpen, GitFork, GitBranch, Search, X } from 'lucide-react'
import inventory from '../data/repositories.json'
import notes from '../data/repository-notes.json'
import SignalText from './SignalText'
import './public-archive.css'

const filters = [
  'Todos', 'IA e dados', 'APIs e backend',
  'Web e interfaces', 'Sistemas e maker', 'Estudos e recursos'
]
const visiblePerPage = 14
const searchIndex = item => [
  item.name, item.description, item.language, item.category
].join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()

// Curated context survives inventory refreshes without changing repository ownership or URLs.
const repositories=inventory.repositories.map(item=>{
  const note=notes[item.name]
  return note ? {...item,description:note.description,category:note.category} : item
})

export default function PublicArchive(){
  const archiveRef=useRef(null)
  const [query,setQuery]=useState('')
  const [filter,setFilter]=useState('Todos')
  const [includeForks,setIncludeForks]=useState(true)
  const [sort,setSort]=useState('name')
  const [limit,setLimit]=useState(visiblePerPage)
  const [open,setOpen]=useState(false)
  useEffect(()=>{
    const openFromTerminal=()=>{
      setOpen(true)
      setLimit(visiblePerPage)
    }
    window.addEventListener('blacksite:open-archive',openFromTerminal)
    return ()=>window.removeEventListener('blacksite:open-archive',openFromTerminal)
  },[])
  const totals = useMemo(() => ({
    all:repositories.length,
    own:repositories.filter(item=>!item.fork).length,
    forks:repositories.filter(item=>item.fork).length
  }),[])
  const projects=useMemo(()=>{
    const q=query.trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
    const list=repositories.filter(item=>
      (filter==='Todos'||item.category===filter) &&
      (includeForks||!item.fork) &&
      (!q||searchIndex(item).includes(q))
    )
    list.sort(sort==='recent'
      ? (a,b)=> b.updated.localeCompare(a.updated)||a.name.localeCompare(b.name,'pt')
      : (a,b)=> Number(a.fork)-Number(b.fork)||a.name.localeCompare(b.name,'pt')
    )
    return list
  },[query,filter,includeForks,sort])
  const shown=projects.slice(0,limit)
  useEffect(()=>{
    const cleanups=Array.from(archiveRef.current?.querySelectorAll('.public-repo')||[]).map(bindFrameSignal)
    return()=>cleanups.forEach(cleanup=>cleanup())
  },[open,projects,limit])
  function resetVisible(){setLimit(visiblePerPage)}
  function highlightName(name) {
    const q=query.trim().toLocaleLowerCase('pt-BR')
    const idx=q? name.toLocaleLowerCase('pt-BR').indexOf(q):-1
    if(idx<0)return <SignalText>{name}</SignalText>
    return <><span>{name.slice(0,idx)}</span><mark>{name.slice(idx,idx+q.length)}</mark><span>{name.slice(idx+q.length)}</span></>
  }
  return <section ref={archiveRef} className="public-archive section-wrap" id="todos-projetos" aria-labelledby="public-archive-heading">
    <div className="public-archive-heading" data-reveal>
      <div className="archive-eyebrow"><span>INDEX/002</span><span>ALL PUBLIC REPOSITORIES</span></div>
      <div className="public-archive-title-row">
        <h2 id="public-archive-heading">ARQUIVO<br/><em>DE CÓDIGO.</em></h2>
        <div className="public-archive-summary">
          <p>Aqui estão os repositórios públicos: código, estudos, experimentos, interfaces e ferramentas que fui construindo ou acompanhando. Cada repositório tem seu próprio contexto e estado de desenvolvimento.</p>
          <p>Também há forks de outros autores. Eles aparecem identificados — porque estudar um projeto não é o mesmo que ter criado tudo do zero.</p>
          <button type="button" className="archive-reveal-button" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-controls="all-public-repos">
            {open?'FECHAR ARQUIVO':'EXPLORAR O ARQUIVO'} <ArrowDown size={18} aria-hidden="true" className={open?'turn':''}/>
          </button>
        </div>
      </div>
      <div className="public-archive-counts" aria-label="Contagem de repositórios públicos">
        <div><strong>{totals.all.toString().padStart(2,'0')}</strong><span>PUBLICADOS</span></div>
        <div><strong>{totals.own.toString().padStart(2,'0')}</strong><span>PRÓPRIOS</span></div>
        <div><strong>{totals.forks.toString().padStart(2,'0')}</strong><span>FORKS / REFERÊNCIAS</span></div>
        <span>INVENTÁRIO DO GITHUB · {inventory.generatedAt}</span>
      </div>
    </div>
    {open&&<div id="all-public-repos" className="archive-table-panel">
      <div className="archive-toolbar">
        <div className="search-wrap">
          <Search size={19} aria-hidden="true"/>
          <label className="sr-only" htmlFor="archive-search">Buscar projeto, tecnologia ou descrição</label>
          <input id="archive-search" type="search" autoComplete="off" value={query} onChange={e=>{setQuery(e.target.value);resetVisible()}} placeholder="Buscar um projeto ou tecnologia..." />
          {query&&<button type="button" aria-label="Limpar busca" onClick={()=>{setQuery('');resetVisible()}}><X size={17}/></button>}
        </div>
        <label className="archive-order-label">ORDENAR
          <select value={sort} onChange={e=>{setSort(e.target.value);resetVisible()}} aria-label="Ordenar lista de projetos">
            <option value="name">Por nome</option>
            <option value="recent">Atualizados recentemente</option>
          </select>
        </label>
      </div>
      <div className="archive-filters" aria-label="Filtrar projetos por área">
        {filters.map(item=><button type="button" key={item} onClick={()=>{setFilter(item);resetVisible()}} aria-pressed={filter===item}>{item}</button>)}
      </div>
      <div className="archive-options">
        <label className="archive-fork-check"><input type="checkbox" checked={includeForks} onChange={e=>{setIncludeForks(e.target.checked);resetVisible()}}/><span>Incluir forks e referências</span></label>
        <span role="status" aria-live="polite">{projects.length} ENCONTRADOS</span>
      </div>
      <div className="public-repos-list" role="list" aria-label="Repositórios públicos">
        {shown.map((project,i)=><a role="listitem" key={project.url} className="public-repo" href={project.url} target="_blank" rel="noopener noreferrer" aria-label={'Abrir no GitHub: '+project.name+(project.fork?', fork de terceiros':'')}>
          <span className="repo-index">{String(i+1).padStart(2,'0')}</span>
          <span className="repo-info">
            <strong>{highlightName(project.name)}</strong>
            <span>{project.description || 'Repositório público no GitHub. Abra para examinar o código e o histórico.'}</span>
          </span>
          <span className="repo-tags">
            {project.fork?<span className="repo-fork"><GitFork size={13}/> FORK</span>:<span className="repo-origin"><GitBranch size={13}/> PRÓPRIO</span>}
            {project.language&&<span className="repo-lang">{project.language}</span>}
          </span>
          <ArrowUpRight className="repo-arrow" size={21} aria-hidden="true"/>
        </a>)}
        {projects.length===0&&<div className="archive-empty"><BookOpen size={25}/><p>Não encontrei um repositório com esses filtros.</p><button type="button" onClick={()=>{setQuery('');setFilter('Todos');setIncludeForks(true);resetVisible()}}>LIMPAR FILTROS</button></div>}
      </div>
      {limit<projects.length&&<button type="button" className="archive-load-more" onClick={()=>setLimit(v=>v+visiblePerPage)}>MOSTRAR MAIS PROJETOS ({Math.min(visiblePerPage,projects.length-limit)} SEGUINTES) <ArrowDown size={17}/></button>}
      <div className="public-archive-footer"><span>ARQUIVO PÚBLICO / OS PROJETOS PRIVADOS NÃO ESTÃO NESTA LISTA</span><a href="https://github.com/Saiiru?tab=repositories" target="_blank" rel="noopener noreferrer">VER DIRETAMENTE NO GITHUB <ArrowUpRight size={16}/></a></div>
    </div>}
  </section>
}