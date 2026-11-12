import { ArrowRight, ArrowUpRight, BookOpen, GitBranch } from 'lucide-react'
import { standaloneGroups, standaloneProjects } from '../data/standalone-projects.js'
import './standalone-projects.css'

function RepoLink({ project, prominent = false }) {
  return <a className={prominent ? 'standalone-repo-link prominent' : 'standalone-repo-link'}
    href={project.url} target="_blank" rel="noopener noreferrer"
    aria-label={'Examinar ' + project.slug + ' no GitHub'}>
    <span>{prominent ? 'VER CÓDIGO NO GITHUB' : 'ABRIR NO GITHUB'}</span>
    <ArrowUpRight size={18} aria-hidden="true"/>
  </a>
}

function EvidenceLink({ project }) {
  return <a className="standalone-brief-link" href={project.briefUrl} target="_blank" rel="noopener noreferrer">
    <BookOpen size={15} aria-hidden="true"/>
    <span>DOCUMENTAÇÃO TÉCNICA</span>
  </a>
}

function FeaturedProject({ project, index }) {
  return <article className="standalone-project standalone-featured-card" data-feature={index}>
    <div className="standalone-feature-header">
      <span className="standalone-feature-index">{String(index + 1).padStart(2, '0')} / APLICAÇÃO</span>
      <span className="standalone-feature-stage">{project.stage}</span>
    </div>
    <div className="standalone-feature-body">
      <h4>{project.title}</h4>
      <p className="standalone-feature-summary">{project.summary}</p>
      <p className="standalone-feature-details">{project.purpose}</p>
      <div className="standalone-flow">
        <span>FLUXO MODELADO</span>
        <ol>
          {project.flow.map(step => <li key={step}>{step}</li>)}
        </ol>
      </div>
    </div>
    <div className="standalone-feature-footer">
      <p className="standalone-stack">{project.stack.join(' · ')}</p>
      <div className="standalone-actions">
        <RepoLink project={project} prominent/>
        <EvidenceLink project={project}/>
      </div>
      <details className="standalone-details">
        <summary>Limites e próximo incremento <ArrowRight size={15} aria-hidden="true"/></summary>
        <p>{project.nextStep}</p>
        <span>Estudo público: não representa serviço em produção.</span>
      </details>
    </div>
  </article>
}

function StudyProject({ project, index }) {
  return <article className="standalone-project standalone-ledger-row">
    <div className="standalone-ledger-topline">
      <span className="standalone-ledger-count">{String(index + 1).padStart(2, '0')}</span>
      <div className="standalone-ledger-main">
        <h4>{project.title}</h4>
        <p>{project.summary}</p>
        <div className="standalone-ledger-tags"><span>{project.stage}</span><span>{project.stack.join(' / ')}</span></div>
      </div>
      <div className="standalone-ledger-actions">
        {project.demoUrl && <a className="standalone-live-link" href={project.demoUrl} target="_blank" rel="noopener noreferrer"
          aria-label={'Abrir demonstração de ' + project.title}>VER DEMO <ArrowUpRight size={17} aria-hidden="true"/></a>}
        <RepoLink project={project}/>
      </div>
    </div>
    <details className="standalone-details standalone-ledger-details">
      <summary>Escopo, contexto e próximos passos <ArrowRight size={15} aria-hidden="true"/></summary>
      <p>{project.purpose}</p>
      <p><strong>Próximo incremento:</strong> {project.nextStep}</p>
      <p><span>Nome anterior:</span> <code>{project.legacySlug}</code></p>
      <EvidenceLink project={project}/>
    </details>
  </article>
}

export default function StandaloneProjects() {
  const featured = standaloneProjects.filter(project => project.featured)
  const studies = standaloneGroups.filter(group => group.id !== 'aplicacoes')
  const remaining = standaloneProjects.filter(project => !project.featured).length
  return <section className="standalone-showcase section-wrap" aria-labelledby="standalone-heading">
    <div className="standalone-top">
      <div className="standalone-headline">
        <h2 id="standalone-heading">CÓDIGO.<br/><span>COM CONTEXTO.</span></h2>
        <p>Projetos independentes, sem ligação com a KORA. Aplicações, interfaces e estudos — cada um com objetivo, código público e limites identificados.</p>
      </div>
      <div className="standalone-index">
        <span>O QUE ENCONTRAR AQUI</span>
        <p><strong>02</strong> aplicações com fluxo identificado</p>
        <p><strong>{String(remaining).padStart(2, '0')}</strong> experiências e exercícios documentados</p>
        <a href="#todos-projetos">BUSCAR NO ARQUIVO COMPLETO <ArrowUpRight size={17} aria-hidden="true"/></a>
      </div>
    </div>
    <div className="standalone-families">
      <section className="standalone-family standalone-family-featured" aria-labelledby="standalone-aplicacoes">
        <header className="standalone-group-label">
          <h3 id="standalone-aplicacoes">APLICAÇÕES.</h3>
          <p>Dois projetos com regras de negócio e fluxos que podem ser investigados no código.</p>
        </header>
        <div className="standalone-featured">
          {featured.map((project, index) => <FeaturedProject project={project} index={index} key={project.slug}/>)}
        </div>
      </section>
      <div className="standalone-study-overline"><h3>OUTROS PROJETOS.</h3><span>INTERFACES · FUNDAMENTOS · FORMAÇÃO</span></div>
      {studies.map(group => {
        const projects = standaloneProjects.filter(project => project.group === group.id)
        return <section className="standalone-family standalone-family-compact" key={group.id} aria-labelledby={'standalone-' + group.id}>
          <header className="standalone-group-label">
            <h3 id={'standalone-' + group.id}>{group.title}</h3>
            <p>{group.detail}</p>
            <span>{String(projects.length).padStart(2, '0')} PROJETOS</span>
          </header>
          <div className="standalone-list">
            {projects.map((project, index) => <StudyProject project={project} index={index} key={project.slug}/>)}
          </div>
        </section>
      })}
    </div>
    <div className="standalone-outro">
      <span>{String(standaloneProjects.length).padStart(2, '0')} REPOSITÓRIOS · CÓDIGO PÚBLICO</span>
      <p>Trabalhos de curso, legados e arquivos vazios aparecem identificados. Os nomes de projeto foram revisados; os endereços históricos continuam rastreáveis.</p>
    </div>
  </section>
}
