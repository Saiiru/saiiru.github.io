# Crivo

**Encontre o contrato que uma resposta quebrou e compare execuções.**

[Demo](https://saiiru.github.io/labs/?lab=crivo) · [Motor](../core/crivo.mjs) · [Testes](../tests/crivo.test.mjs) · [Relatório](../reports/crivo.json)

Uma resposta pode parecer adequada e ainda omitir uma chave JSON ou prometer algo proibido. Crivo verifica critérios explícitos e identifica regressões e melhorias entre uma referência e uma candidata. Não usa um LLM como juiz nem verifica verdade factual.

## Experimente

Na pasta `projects/applied-ai`, execute `npm run serve`. Na aba Crivo, salve uma referência e retire uma chave de uma resposta JSON. O painel mostra o critério que falhou. Exporte JSON ou uma nota Markdown.

```sh
node scripts/crivo.mjs crivo/examples/baseline.json crivo/examples/candidate.json
```

Código 0: nenhuma regressão; 1: regressão detectada; 2: entrada inválida. O exemplo retorna **1**, com duas regressões introduzidas intencionalmente. Arquivos mapeiam IDs para respostas em texto; `{}` utiliza respostas padrão.

## Contratos

`evaluateCase` verifica termos, limites e JSON objeto com chaves; `evaluateSuite` agrega resultados; `compareRuns` identifica mudanças. Testes cobrem acentos, caixa, JSON inválido, chaves ausentes, tamanho e exportação Markdown com cercas de código seguras.

A instrução registrada só afeta a geração quando um proxy opcional está configurado, não as asserções. Critérios podem aprovar uma resposta semanticamente errada. O benchmark usa respostas fixas, não desempenho medido de LLM. Projeto de estudo desenvolvido com assistência de IA.
