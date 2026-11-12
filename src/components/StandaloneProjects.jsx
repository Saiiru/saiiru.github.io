import { ArrowRight, ArrowUpRight, BookOpen, ShieldCheck } from 'lucide-react'
import { portfolioProjects } from '../data/standalone-projects.js'
import './standalone-projects.css'

function SourceLink({project}){
 return <a className="standalone-repo-link" href={project.url} target="_blank" rel="noopener noreferrer"
  aria-label={'Examinar '+project.slug+' no GitHub'}>CÓDIGO <ArrowUpRight size={17} aria-hidden="true"/></a>
}
function DocumentationLink({project}){
 return <a className="standalone-brief-link" href={project.briefUrl} target="_blank" rel="noopener noreferrer">
  <BookOpen size={15} aria-hidden="true"/>DOCUMENTAÇÃO
 </a>
}
function DemoLink({project}){
 return <a className="standalone-demo-link" href={project.demoUrl} target="_blank" rel="noopener noreferrer"
  aria-label={'Abrir demonstração de '+project.title}>ABRIR DEMO <ArrowUpRight size={18} aria-hidden="true"/></a>
}
function FeaturedProject({project,index}){
 return <article className="standalone-project standalone-featured-card" data-feature={index}>
  <div className="standalone-feature-header">
   <span className="standalone-feature-index">{index===0?'PROJETO PRINCIPAL':'APLICAÇÃO DEMONSTRÁVEL'}</span>
   <span className="standalone-feature-stage">{project.stage}</span>
  </div>
  <div className="standalone-feature-body">
   <h4>{project.title}</h4>
   <p className="standalone-feature-summary">{project.summary}</p>
   <p className="standalone-feature-details">{project.purpose}</p>
   <div className="standalone-flow">
    <span>O QUE É POSSÍVEL TESTAR</span>
    <ol>{project.flow.map(step=><li key={step}>{step}</li>)}</ol>
   </div>
  </div>
  <div className="standalone-feature-footer">
   <div className="standalone-proof"><ShieldCheck size={17} aria-hidden="true"/><span>{project.validation}</span></div>
   <p className="standalone-stack">{project.stack.join(' · ')}</p>
   <div className="standalone-actions"><DemoLink project={project}/><SourceLink project={project}/><DocumentationLink project={project}/></div>
   <details className="standalone-details"><summary>O que ainda não está pronto <ArrowRight size={15} aria-hidden="true"/></summary>
    <p>{project.nextStep}</p><span>Uma demonstração verificável não equivale a serviço comercial ou modelo treinado.</span>
   </details>
  </div>
 </article>
}
function VerifiedLegacy({project}){
 return <article className="standalone-project standalone-ledger-row">
  <div className="standalone-ledger-topline">
   <div className="standalone-ledger-main">
    <h4>{project.title}</h4><p>{project.summary}</p>
    <p className="standalone-proof"><ShieldCheck size={15} aria-hidden="true"/>{project.validation}</p>
    <div className="standalone-ledger-tags"><span>{project.stage}</span><span>{project.stack.join(' / ')}</span></div>
   </div>
   <div className="standalone-ledger-actions"><DemoLink project={project}/><SourceLink project={project}/></div>
  </div>
  <details className="standalone-details standalone-ledger-details"><summary>Estado técnico e contexto <ArrowRight size={15} aria-hidden="true"/></summary>
   <p>{project.purpose}</p><p><strong>Limite:</strong> {project.nextStep}</p><DocumentationLink project={project}/>
  </details>
 </article>
}
export default function StandaloneProjects(){
 const featured=portfolioProjects.filter(project=>project.featured)
 const secondary=portfolioProjects.filter(project=>!project.featured)
 return <section className="standalone-showcase section-wrap" aria-labelledby="standalone-heading">
  <div className="standalone-top">
   <div className="standalone-headline">
    <h2 id="standalone-heading">PROJETOS QUE<br/><span>VOCÊ PODE TESTAR.</span></h2>
    <p>Menos repositórios, mais evidência. Cada aplicação selecionada abre de verdade, tem código público e informa o que ainda não está concluído.</p>
   </div>
   <div className="standalone-index"><span>CRITÉRIO DE ENTRADA</span>
    <p><strong>{String(portfolioProjects.length).padStart(2,'0')}</strong> projetos com demonstração pública</p>
    <p><strong>{String(featured.length).padStart(2,'0')}</strong> aplicações em destaque</p>
    <a href="https://github.com/Saiiru?tab=repositories" target="_blank" rel="noopener noreferrer">HISTÓRICO COMPLETO, FORA DA VITRINE <ArrowUpRight size={17}/></a>
   </div>
  </div>
  <div className="standalone-families">
   <section className="standalone-family standalone-family-featured" aria-labelledby="standalone-aplicacoes">
    <header className="standalone-group-label"><h3 id="standalone-aplicacoes">DEMONSTRAÇÕES PRINCIPAIS.</h3>
     <p>Fluxos que um recrutador pode abrir e executar sem configurar um servidor.</p></header>
    <div className="standalone-featured">{featured.map((project,i)=><FeaturedProject project={project} index={i} key={project.slug}/>)}</div>
   </section>
   {secondary.length>0&&<section className="standalone-family standalone-family-compact standalone-verified-legacy" aria-labelledby="standalone-legado">
    <header className="standalone-group-label"><h3 id="standalone-legado">LEGADO FUNCIONAL.</h3>
     <p>Aplicação verificável, com versão e limitações explícitas.</p></header>
    <div className="standalone-list">{secondary.map(project=><VerifiedLegacy project={project} key={project.slug}/>)}</div>
   </section>}
  </div>
  <div className="standalone-outro"><span>CURADORIA POR FUNCIONALIDADE</span>
   <p>Exercícios, arquivos vazios, forks e APIs sem demonstração pública foram retirados desta página, não apagados do GitHub. O histórico continua disponível pelo perfil.</p></div>
 </section>
}
