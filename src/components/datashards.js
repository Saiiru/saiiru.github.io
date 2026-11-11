const repo = 'https://github.com/Saiiru/saiiru.github.io/tree/main/projects/applied-ai'
export const datashards = [
  {
    id: 'crivo',
    decision: 'Escolhi critérios determinísticos para tornar cada falha reproduzível. É simples de auditar, mas não mede nuance semântica; o modo LLM é opcional e separado.', serial: 'DSH—001', name: 'Crivo', code: 'CR',
    category: 'AVALIAÇÃO DE RESPOSTAS', accent: 'cyan',
    descriptor: 'Saídas de modelos / critérios explícitos',
    question: 'Como avaliar uma resposta antes de confiar nela?',
    summary: 'Uma resposta pode parecer correta e ainda quebrar uma regra importante. O Crivo torna essa verificação explícita: você define o caso, inspeciona os critérios e compara o resultado.',
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
    testFile: 'crivo.test.mjs', module: 'core/crivo.mjs',
    image: '/assets/previews/crivo.jpg',
    demo: '/labs/index.html?lab=crivo', source: repo
  },
  {
    id: 'vetor',
    decision: 'O projeto compara regras com um classificador TF-IDF + regressão logística. O modelo exportado roda no navegador; sinais fracos pedem revisão, e a exportação exige aprovação humana.', serial: 'DSH—002', name: 'Vetor', code: 'VT',
    category: 'OPERAÇÕES COM REVISÃO HUMANA', accent: 'magenta',
    descriptor: 'Machine learning / classificação de texto',
    question: 'Como automatizar a triagem sem abrir mão da decisão?',
    summary: 'Modelo supervisionado treinado em Python com 108 exemplos sintéticos e exportado para inferência no navegador. Compare sugestões, inspecione os sinais e revise antes de exportar.',
    method: 'Escreva um chamado, compare modelo e regras e consulte os erros do teste reservado. Prioridade é uma regra separada; a pontuação do modelo não é calibrada.',
    limitation: 'Dados pequenos, sintéticos e gerados com IA: 48 treino, 16 validação, 32 teste e 12 fora do domínio. Sem revisão independente; não representa uso real. O blueprint n8n continua sendo uma integração de regras não implantada.',
    steps: [
      ['Receber a solicitação', 'Texto editável e casos sintéticos tornam o comportamento inspecionável.'],
      ['Sugerir o encaminhamento', 'Pesos aprendidos produzem a categoria. Pontuação baixa ou vocabulário desconhecido exigem revisão. Prioridade usa uma regra explícita.'],
      ['Exigir aprovação', 'A exportação é bloqueada até a aprovação. Se o texto mudar, a aprovação anterior deixa de valer.']
    ],
    stack: ['Python', 'scikit-learn', 'TF-IDF', 'Regressão logística', 'JavaScript'],
    evidence: [
      'Macro-F1 no teste sintético: 0,880; regras: 0,857. Cobertura após recusa: 62,5%.',
      'Paridade Python/JavaScript verificada em 44 casos; treinamento e relatório reproduzíveis.',
      'Exportação exige revisão humana. Editar o texto invalida a aprovação anterior.'
    ],
    testFile: 'vetor-ml.test.mjs', module: 'core/vetor-ml.mjs',
    image: '/assets/previews/vetor.jpg',
    demo: '/labs/index.html?lab=vetor', source: repo
  },
  {
    id: 'lastro',
    decision: 'A busca BM25 permite mostrar de onde saiu cada trecho e funciona offline. O trade-off é que recuperar texto não equivale a compreender documentos; sem fonte, a ferramenta prefere não responder.', serial: 'DSH—003', name: 'Lastro', code: 'LT',
    category: 'DOCUMENTOS COM EVIDÊNCIAS', accent: 'violet',
    descriptor: 'Markdown / recuperação com fontes',
    question: 'De onde veio a informação usada na resposta?',
    summary: 'Uma resposta útil precisa permitir que você confira a origem. O Lastro busca nos documentos, mostra as passagens relevantes e conecta a resposta às fontes.',
    method: 'Consulte o corpus de exemplo ou carregue seus arquivos Markdown. A indexação ocorre no navegador; no modo offline, a resposta é extraída dos trechos encontrados.',
    limitation: 'A busca padrão usa BM25 e resposta extrativa, não geração por LLM. Quando não encontra evidência, o sistema se abstém. O corpus de demonstração é fictício.',
    steps: [
      ['Indexar os documentos', 'Arquivos Markdown são divididos em passagens com referência ao documento original.'],
      ['Recuperar evidências', 'O BM25 ordena as passagens por relevância para a consulta.'],
      ['Responder com origem', 'Os trechos fundamentam a resposta e exibem citações. Sem correspondência, não há resposta inventada.']
    ],
    stack: ['JavaScript', 'BM25', 'Markdown', 'Citações'],
    evidence: [
      'Seis documentos fictícios e 12 passagens. Recall@3 e MRR: 0,833 em seis perguntas com fonte.',
      'Testes de ordenação, normalização de acentos, caminhos de fontes e citações.',
      'Duas consultas sem fonte recusadas; uma consulta com fonte não foi recuperada. Falha registrada no relatório.'
    ],
    testFile: 'lastro.test.mjs', module: 'core/lastro.mjs',
    image: '/assets/previews/lastro.jpg',
    demo: '/labs/index.html?lab=lastro', source: repo
  },
  {
    id: 'rota',
    decision: 'Comparei regras com um classificador treinado para escolher contexto da KORA. O ML permanece experimental: erra pedidos fora do domínio. Cálculos e permissões ficam separados da classificação.',
    serial: 'DSH—004', name: 'Rota', code: 'RT',
    category: 'ASSISTENTE LOCAL-FIRST / ROTEAMENTO E RETRIEVAL',
    accent: 'green',
    descriptor: 'KORA / ML, contexto e dados locais',
    question: 'Como compor um assistente pessoal sem enviar dados sensíveis ao modelo?',
    summary: 'Uma demonstração da KORA compara regras e ML treinado, busca fontes e limita o contexto. Finanças e eventos são calculados localmente, com exemplos sintéticos ou JSON fornecido durante a sessão.',
    method: 'Escolha Regras ou ML experimental, compare a rota e consulte o relatório de erros. Edite dados locais de finanças e agenda para conferir os cálculos. Não há conexão à instalação privada nem execução de ações.',
    limitation: 'Modelo pequeno treinado com dados sintéticos: macro-F1 0,786 em 24 casos; cobertura de 50%. Recusou somente 6 de 12 pedidos fora do domínio. Por isso, regras continuam sendo o padrão. A busca é lexical e a demo não acessa a KORA privada.',
    steps: [
      ['Comparar regras e ML', 'TF-IDF + regressão logística sugere um domínio; pedidos explicitamente mistos preservam duas rotas das regras.'],
      ['Recuperar evidências', 'Feature hashing/cosseno e ranking lexical BM25 ordenam passagens; cada resultado preserva caminho e identificador.'],
      ['Montar contexto limitado', 'Procedimentos e trechos ficam sob 1.800 caracteres. Finanças e agenda usam adaptadores locais validados, sem envio ao modelo remoto.']
    ],
    stack: ['Python', 'scikit-learn', 'Regressão logística', 'JavaScript', 'TF-IDF', 'BM25', 'Testes'],
    evidence: [
      '72 exemplos de treino, 24 de validação, 24 de teste e 12 fora do domínio. Pesos e relatório reproduzíveis disponíveis.',
      '49 testes JavaScript e 4 Python; paridade nos 36 exemplos de teste/fora do domínio; interface verificada em quatro larguras.',
      'README distingue o laboratório público do adaptador KORA privado: exportação LUKA e banco Planner ainda precisam ser configurados.'
    ],
    testFile: 'kora-router.test.mjs', module: 'core/kora-assistant-demo.mjs',
    image: '/assets/previews/rota.svg',
    demo: '/labs/index.html?lab=rota', source: repo
  }
]

export function resolveShard(value) {
  value=({evalforge:'crivo',opspilot:'vetor',doctrace:'lastro',kora:'rota'})[value]||value
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
    mode: shard.id==='vetor'?'trained-ml-local':shard.id==='rota'?'rules-and-experimental-ml':'offline-deterministic',
    limitations: shard.limitation,
    implementation: shard.steps.map(([title, description]) => ({ title, description })),
    evidence: shard.evidence,
    stack: shard.stack,
    demo: 'https://saiiru.github.io' + shard.demo,
    source: shard.source,
    tests: shard.source + '/tests/' + shard.testFile
  }
}
