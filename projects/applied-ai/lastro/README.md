# Lastro

**Busque documentos e confira o trecho que sustenta a resposta.**

[Demo](https://saiiru.github.io/labs/?lab=lastro) · [Motor](../core/lastro.mjs) · [Consultas](queries.json) · [Resultados](../reports/lastro.json)

Markdown é dividido em passagens, ordenado por BM25 e apresentado com citações. A resposta padrão extrai os trechos; sem correspondência, informa ausência de evidência. Não é um LLM ou modelo neural treinado.

Na pasta `projects/applied-ai`:

```sh
npm run serve
npm run lastro -- "cobrança duplicada"
npm run benchmark
npm test
```

Carregue até 20 arquivos `.md` de até 100 KB na demo. A leitura ocorre no navegador; documentos próprios desabilitam o LLM opcional.

## Avaliação, incluindo a falha

Seis documentos fictícios e 12 passagens; seis consultas com fonte esperada e duas sem resposta. Recall@3 e MRR **0,8333**; ambas as perguntas sem fonte foram recusadas. A consulta `escalonamento supervisor` falha porque as passagens usam outras palavras. O relatório conserva o erro.

A relevância foi definida no projeto, sem julgamento independente. BM25 mede correspondência lexical, não suficiência da evidência. Textos contraditórios e instruções maliciosas exigem inspeção. IDs de citação pertencem ao índice atual, não são permanentes entre uploads. Respostas opcionais de LLM aparecem como não verificadas.

Projeto de estudo desenvolvido com assistência de IA. Próximo experimento: comparar busca semântica usando os mesmos casos, acrescentando sinônimos e perguntas parcialmente respondidas.
