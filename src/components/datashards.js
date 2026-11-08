const repo = 'https://github.com/Saiiru/saiiru.github.io/tree/main/projects/ai-builder-labs'
export const datashards = [
  {
    id: 'evalforge',
    decision: 'Escolhi critérios determinísticos para tornar cada falha reproduzível. É simples de auditar, mas não mede nuance semântica; o modo LLM é opcional e separado.', serial: 'DSH—001', name: 'EvalForge', code: 'EF',
    category: 'AVALIAÇÃO DE RESPOSTAS', accent: 'cyan',
    descriptor: 'Saídas de modelos / critérios explícitos',
    question: 'Como avaliar uma resposta antes de confiar nela?',
    summary: 'Uma resposta pode parecer correta e ainda quebrar uma regra importante. O EvalForge torna essa verificação explícita: você define o caso, inspeciona os critérios e compara o resultado.',
    method: 'Edite uma resposta de exemplo, execute a suíte e examine os motivos de aprovação ou falha. O relatório pode ser exportado em JSON.',
    limitation: 'A avaliação padrão é determinística e usa seis casos sintéticos. A taxa exibida vale para esses exemplos; não mede a qualidade geral de um modelo em produção.',
    steps: [
      ['Definir o caso', 'Entrada, instrução, resposta esperada e critérios ficam visíveis no mesmo fluxo.'],
      ['Aplicar as regras', 'O motor verifica termos necessários e proibidos, formato JSON e limites de tamanho.'],
      ['Inspecionar o resultado', 'Cada falha tem uma razão. Alterar a resposta recalcula a aprovação da suíte.']
    ],
    stack: ['JavaScript', 'Asserções', 'JSON', 'Testes Node'],
    evidence: [
      'Seis casos de exemplo com critérios explícitos e resultados recalculáveis.',
      'Testes para ausência de termos, termos proibidos, JSON inválido e limite de tamanho.',
      'Mudanças feitas pelo visitante alteram o resultado: o painel não é um mockup.'
    ],
    testFile: 'evalforge.test.mjs', module: 'core/evalforge.mjs',
    image: '/assets/previews/evalforge.webp',
    demo: '/labs/index.html?lab=evalforge', source: repo
  },
  {
    id: 'opspilot',
    decision: 'Uma regra pode sugerir o destino de um chamado, mas não deve decidir por uma pessoa. Por isso a exportação exige aprovação e qualquer edição invalida a autorização anterior.', serial: 'DSH—002', name: 'OpsPilot', code: 'OP',
    category: 'OPERAÇÕES COM REVISÃO HUMANA', accent: 'magenta',
    descriptor: 'Triagem de chamados / decisão humana',
    question: 'Como automatizar a triagem sem abrir mão da decisão?',
    summary: 'Classificar uma solicitação é diferente de tomar uma ação em nome de alguém. O OpsPilot separa essas etapas: sugere o encaminhamento e deixa a aprovação com uma pessoa.',
    method: 'Selecione ou escreva um chamado, confira a classe, a prioridade e a regra aplicada. Depois da aprovação humana, o registro pode ser exportado.',
    limitation: 'O classificador padrão usa regras e doze chamados fictícios. O exemplo n8n é um blueprint importável, não um fluxo implantado. Nenhuma mensagem é enviada automaticamente.',
    steps: [
      ['Receber a solicitação', 'Texto editável e casos sintéticos tornam o comportamento inspecionável.'],
      ['Sugerir o encaminhamento', 'Regras produzem classe e prioridade. Chamados sem correspondência pedem revisão manual.'],
      ['Exigir aprovação', 'A exportação é bloqueada até a aprovação. Se o texto mudar, a aprovação anterior deixa de valer.']
    ],
    stack: ['JavaScript', 'Regras', 'Human-in-the-loop', 'n8n blueprint'],
    evidence: [
      'Doze tickets fictícios com rótulos de referência para comparar as previsões.',
      'Testes de prioridade de pagamentos, classificação e encaminhamento manual.',
      'Teste do bloqueio de exportação sem aprovação humana e reset após edição.'
    ],
    testFile: 'opspilot.test.mjs', module: 'core/opspilot.mjs',
    image: '/assets/previews/opspilot.webp',
    demo: '/labs/index.html?lab=opspilot', source: repo
  },
  {
    id: 'doctrace',
    decision: 'A busca BM25 permite mostrar de onde saiu cada trecho e funciona offline. O trade-off é que recuperar texto não equivale a compreender documentos; sem fonte, a ferramenta prefere não responder.', serial: 'DSH—003', name: 'DocTrace', code: 'DT',
    category: 'DOCUMENTOS COM EVIDÊNCIAS', accent: 'violet',
    descriptor: 'Markdown / recuperação com fontes',
    question: 'De onde veio a informação usada na resposta?',
    summary: 'Uma resposta útil precisa permitir que você confira a origem. O DocTrace busca nos documentos, mostra as passagens relevantes e conecta a resposta às fontes.',
    method: 'Consulte o corpus de exemplo ou carregue seus arquivos Markdown. A indexação ocorre no navegador; no modo offline, a resposta é extraída dos trechos encontrados.',
    limitation: 'A busca padrão usa BM25 e resposta extrativa, não geração por LLM. Quando não encontra evidência, o sistema se abstém. O corpus de demonstração é fictício.',
    steps: [
      ['Indexar os documentos', 'Arquivos Markdown são divididos em passagens com referência ao documento original.'],
      ['Recuperar evidências', 'O BM25 ordena as passagens por relevância para a consulta.'],
      ['Responder com origem', 'Os trechos fundamentam a resposta e exibem citações. Sem correspondência, não há resposta inventada.']
    ],
    stack: ['JavaScript', 'BM25', 'Markdown', 'Citações'],
    evidence: [
      'Seis documentos originais de exemplo, divididos em doze passagens.',
      'Testes de ordenação, normalização de acentos, caminhos de fontes e citações.',
      'Teste de recusa em consultas sem informação correspondente no corpus.'
    ],
    testFile: 'doctrace.test.mjs', module: 'core/doctrace.mjs',
    image: '/assets/previews/doctrace.webp',
    demo: '/labs/index.html?lab=doctrace', source: repo
  }
]

export function resolveShard(value) {
  return datashards.find(shard => shard.id === value) || datashards[0]
}

export function createRecord(shard) {
  return {
    schema: 'blacksite.datashard/1',
    id: shard.id,
    title: shard.name,
    category: shard.category,
    question: shard.question,
    summary: shard.summary,
    method: shard.method,
    mode: 'offline-deterministic',
    limitations: shard.limitation,
    implementation: shard.steps.map(([title, description]) => ({ title, description })),
    evidence: shard.evidence,
    stack: shard.stack,
    demo: 'https://saiiru.github.io' + shard.demo,
    source: shard.source,
    tests: shard.source + '/tests/' + shard.testFile
  }
}
