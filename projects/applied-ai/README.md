# Crivo · Vetor · Lastro

Três ferramentas para testar partes concretas de um sistema de IA: avaliar saídas, encaminhar solicitações e recuperar evidências. **Vetor contém ML supervisionado real**, treinado em Python e executado no navegador com os pesos exportados. Crivo e Lastro são ferramentas complementares de avaliação e recuperação.

**[Demos](https://saiiru.github.io/labs/)** · [Resultados calculados](BENCHMARK.md) · [Relato do experimento](EXPERIMENT.md) · [Model card](vetor/MODEL_CARD.md)

| Projeto | Experimente | Implementação |
| --- | --- | --- |
| [Crivo](crivo/README.md) | Compare uma referência com respostas alteradas e encontre regressões. | Asserções JavaScript; CLI; exportação JSON e Markdown. |
| [Vetor](vetor/README.md) | Classifique um chamado, compare regras e ML e aprove uma exportação. | TF-IDF + regressão logística; Python/scikit-learn → JSON → JavaScript. |
| [Lastro](lastro/README.md) | Consulte documentos e confira o trecho usado na resposta. | BM25, Markdown e citações; Recall@3, MRR e perguntas sem resposta. |

## Executar

Node.js 24+. A demo não exige npm install, GPU, conta em provedor ou chave de API.

```sh
cd projects/applied-ai
npm run serve
```

Abra http://127.0.0.1:4173. Use `?lab=crivo`, `?lab=vetor` ou `?lab=lastro`. Os nomes antigos continuam aceitos nas URLs.

## Verificar

```sh
npm test
npm run benchmark
npm run verify
npm run vetor -- "Meu cartão recebeu uma cobrança duplicada."
npm run lastro -- "cobrança duplicada"
node scripts/crivo.mjs crivo/examples/baseline.json crivo/examples/candidate.json
```

O último comando retorna **1**, intencionalmente: a candidata contém duas regressões. Código 0 indica nenhuma regressão; código 2 indica entrada inválida. Treinamento e testes Python estão documentados no [Vetor](vetor/README.md).

## Resultados

No teste sintético reservado de 32 exemplos, Vetor: macro-F1 **0,880**, regras **0,857** e cobertura após recusa **62,5%**. O [relatório](reports/vetor.json) contém matriz de confusão, decisões e erros. Lastro também publica a consulta que falhou; Crivo usa respostas fixas com regressões introduzidas. São métricas de problemas diferentes.

## Organização

`core/`: lógica pura; `ml/`: dados e treinamento; `models/`: pesos JSON; `reports/`: resultados calculados; `tests/`: testes Node e paridade; `scripts/`: CLIs e benchmark; `crivo/`, `vetor/` e `lastro/`: documentação de cada ferramenta. `server/` contém o servidor local e um proxy LLM opcional.

A cópia `public/labs/` é gerada por `node scripts/sync-labs.mjs`, na raiz do repositório. O build executa essa sincronização. Edite a fonte em `projects/applied-ai/`.

## Origem e limites

Desenvolvimento e dataset produzidos com assistência de IA a pedido de Sairu. Revisão e domínio pessoal do código pelo autor do portfólio não são presumidos. Dados fictícios, sem clientes reais e sem vínculo com iFood. Projetos de estudo: não representam experiência profissional de ML ou sistemas de produção.

- Um classificador supervisionado foi treinado; nenhum LLM foi treinado ou ajustado.
- Crivo verifica critérios explícitos, não verdade factual ou qualidade semântica.
- Lastro é busca lexical com resposta extrativa, não um modelo neural.
- Aprovação humana é uma barreira da interface. O JSON exportado não é uma autorização assinada.
- O [blueprint n8n](integrations/n8n/vetor.json) usa regras, não o modelo treinado; não foi implantado.
- Não há publicação no Hugging Face, participação no Kaggle ou pesquisa acadêmica alegada. Modelo e relato técnico estão neste repositório.

## LLM opcional

Configure `LLM_BASE_URL`, `LLM_API_KEY` e `LLM_MODEL` no ambiente para usar um endpoint Chat Completions. `.env` não é carregado automaticamente. Botões LLM aparecem somente quando o proxy local está configurado; a demo estática funciona sem eles. Chamadas opcionais enviam o texto ao provedor escolhido e podem ter custo. Documentos próprios ficam no navegador e desabilitam essa opção.

## Referências e licença

[Classificação de documentos](https://scikit-learn.org/stable/auto_examples/text/plot_document_classification_20newsgroups.html) · [TF-IDF](https://scikit-learn.org/stable/modules/feature_extraction.html).

Código segue a licença do repositório. Dataset sintético próprio: CC0-1.0, indicado no arquivo de dados. Dependências mantêm suas próprias licenças.
