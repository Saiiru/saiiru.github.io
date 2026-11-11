import { ArrowUpRight, GitBranch, ShieldCheck } from 'lucide-react'
import './kora-case-study.css'

const readme = 'https://github.com/Saiiru/saiiru.github.io/blob/main/projects/applied-ai/kora/CASE_STUDY.md'

export default function KoraCaseStudy() {
  return <section id="caso-kora" className="case-study section-wrap" aria-labelledby="kora-case-heading">
    <div className="case-story">
      <h2 id="kora-case-heading">Uma pergunta real.<br/><span>Uma decisão verificável.</span></h2>
      <p>Entre SENAI, projetos de eletrônica e compromissos, minha dificuldade não é gerar mais tarefas: é decidir qual delas realmente merece atenção agora. A KORA nasceu para consultar fontes locais, mostrar o motivo de uma recomendação e reconhecer o que ainda não sabe.</p>
      <p className="case-scope"><ShieldCheck size={16} aria-hidden="true"/> O briefing operacional é somente leitura e funciona sem LLM. O laboratório público Rota é uma demonstração independente, com dados sintéticos, não um acesso ao meu computador.</p>
      <div className="case-links">
        <a href="/labs/?lab=rota">Experimentar a Rota <ArrowUpRight size={17} aria-hidden="true"/></a>
        <a href={readme} target="_blank" rel="noopener noreferrer">Estudo de caso <GitBranch size={17} aria-hidden="true"/></a>
      </div>
    </div>
    <div className="case-trace" aria-label="Exemplo sintético de uma decisão da KORA">
      <div className="case-trace-top"><span>TRACE / KORA</span><span>EXEMPLO SINTÉTICO</span></div>
      <ol>
        <li><span>ENTRADA</span><p>“O que eu deveria priorizar hoje?”</p></li>
        <li><span>OBSERVAÇÃO</span><p>Taskwarrior: exercícios pendentes. Agenda SQLite: próximo compromisso. Financeiro: somente quando autorizado.</p></li>
        <li><span>DECISÃO</span><p>Prioridade e prazo organizam a lista. Fontes ausentes não viram tarefas ou saldos fictícios.</p></li>
        <li><span>SAÍDA</span><p>Uma próxima ação, com justificativa e condição concreta de conclusão.</p></li>
      </ol>
      <p className="case-trace-foot">O que ainda falta: testar uso diário, medir utilidade e avaliar se uma explicação GenAI melhora a resposta sem inventar fatos.</p>
    </div>
  </section>
}
