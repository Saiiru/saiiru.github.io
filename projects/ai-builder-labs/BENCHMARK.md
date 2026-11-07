# Benchmark reproduzível da base sintética

Resultados calculados pelas funções usadas na interface e verificados em `tests/*.test.mjs` com Node 24:

| Projeto | Contagem observada | Critério |
|---|---:|---|
| EvalForge | 6/6 casos passaram | Todas as asserções dos seis exemplos originais |
| OpsPilot | 12/12 casos cobertos | Regra de classe encontrada em cada ticket fictício |
| OpsPilot | 12/12 casos corretos | Equipe **e** prioridade iguais ao rótulo, entre os cobertos |
| DocTrace | 6 documentos, 12 passagens | Divisão determinística por seção Markdown |
| DocTrace | 1º resultado: `docs/pagamentos.md` | Consulta `cobrança duplicada` no corpus original |

O teste também confirma que uma pergunta sem termos no corpus retorna zero passagens e nenhuma resposta inventada. Estes números são **somente verificações de dados sintéticos curados**, não resultados de negócio, acurácia em produção ou avaliação de um modelo LLM. Edite respostas, tickets ou corpus para observar novas métricas calculadas em tempo real.
