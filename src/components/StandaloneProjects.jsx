import { ArrowUpRight, GitBranch } from 'lucide-react'
import { standaloneGroups, standaloneProjects } from '../data/standalone-projects.js'
import './standalone-projects.css'

export default function StandaloneProjects() {
  return <section className="standalone-showcase section-wrap" aria-labelledby="standalone-heading">
    <div className="standalone-top">
      <div>
        <h2 id="standalone-heading">PROJETOS<br/><span>INDEPENDENTES.</span></h2>
      </div>
      <div className="standalone-intro">
        <p>Nem tudo precisa fazer parte de uma plataforma. Estes são projetos, exercícios e experiências com objetivos próprios — de aplicações Java e TypeScript a interfaces e fundamentos de programação.</p>
        <p className="standalone-disclaimer">Os estados abaixo descrevem o que foi encontrado nos repositórios públicos. Projeto de curso, legado ou incompleto continua no histórico, sem ser anunciado como produto em produção.</p>
        <a href="#todos-projetos">Ver o inventário completo <ArrowUpRight size={16} aria-hidden="true"/></a>
      </div>
    </div>
    <div className="standalone-families">
      {standaloneGroups.map(group => {
        const projects = standaloneProjects.filter(item => item.group === group.id)
        return <div className="standalone-family" key={group.id} aria-labelledby={'standalone-' + group.id}>
          <div className="standalone-group-label">
            <h3 id={'standalone-' + group.id}>{group.title}</h3>
            <p>{group.detail}</p>
            <span aria-label={projects.length + ' projetos neste grupo'}>{String(projects.length).padStart(2, '0')} PROJETOS</span>
          </div>
          <div className="standalone-list">
            {projects.map(project => <article className="standalone-project" key={project.slug}>
              <div className="standalone-project-meta">
                <span className="standalone-stage">{project.stage}</span>
                <span className="standalone-type">{project.stack.join(' / ')}</span>
              </div>
              <h4>{project.title}</h4>
              <p className="standalone-purpose">{project.purpose}</p>
              <p className="standalone-next"><strong>Próxima melhoria:</strong> {project.nextStep}</p>
              <a href={project.url} target="_blank" rel="noopener noreferrer" aria-label={'Examinar ' + project.slug + ' no GitHub'}>
                <GitBranch size={16} aria-hidden="true"/>
                <span>{project.slug}</span>
                <ArrowUpRight size={17} aria-hidden="true"/>
              </a>
            </article>)}
          </div>
        </div>
      })}
    </div>
    <p className="standalone-outro">12 repositórios públicos · 12 contextos independentes · nenhum depende da KORA.</p>
  </section>
}
