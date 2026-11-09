# Crivo, Vetor e Lastro

Autorização: Sairu pediu projetos completos, novos nomes, README e ML em 2026-11-09. Formação prevista: 2028, informada pelo usuário; isso não confirma os demais critérios de estágio.

## Entrega

Três ferramentas executáveis no portfólio: Crivo avalia contratos de respostas; Vetor classifica chamados com TF-IDF e regressão logística treinada em Python; Lastro recupera passagens Markdown com BM25 e citações. Todos têm comandos reproduzíveis, testes, README específico, relatório calculado e uma demo estática acessível. Não são sistemas de produção nem projetos feitos em empresas.

## Arquitetura e escolhas

Reaproveitar a lógica testada dos laboratórios existentes, evoluindo-a. Código canônico em projects/applied-ai; public/labs é gerado por sincronização. URLs antigas continuam abrindo a ferramenta correspondente. Não mexer em Toolkit, identidade visual, KORA, currículo, contas externas ou hardware.

Alternativas: treinar um LLM exigiria dados e computação ainda não disponíveis; simular ML com regras não produz o artefato pedido. Escolha de implementação: ML clássico leve com dados sintéticos explicitados, baseline de regras, separação fixa de cenários treino/validação/teste, modelo JSON e paridade Python/JavaScript. Um modelo treinado, três ferramentas complementares; não alegar três modelos nem resultados de negócio.

## Contratos

- Vetor: quatro classes Entrega/Estornos/Pagamentos/Acesso, recusa por baixo sinal/OOV, prioridade por regra separada e identificada; aprovação humana obrigatória, invalidada ao editar o texto. Entradas até 4000 caracteres.
- Treino: vocabulário/IDF somente do treino; hiperparâmetro escolhido pela validação; teste separado reportado, sem prometer generalização. Probabilidades sem calibração. Dataset gerado com assistência de IA, sem revisão do autor alegada.
- Crivo: avaliação determinística de critérios explícitos, comparação de execuções, exportação JSON/Markdown. Nenhuma alegação de verdade factual ou juiz semântico.
- Lastro: corpus fictício e arquivos locais; top-k, fonte e trecho visíveis, ausência explícita quando não há correspondência, benchmark Recall@3 e MRR. BM25 não é apresentado como modelo neural treinado. Documentos próprios não vão para API.
- Publicação: site estático, sem segredo, sem dependência de API paga; proxy opcional local não é necessário à demo.
- Documentação: autoria assistida, origem dos dados, execução, testes, arquitetura, resultados medidos, limitações e próximos experimentos. Não alegar Hugging Face/Kaggle/pesquisa acadêmica/publicação inexistentes.

## Critério de conclusão

Treino reproduzido; paridade numérica; testes de casos novos e recusa; benchmarks calculados; navegação antiga/nova, aprovação, edição, upload e exportação testadas em navegador; build e orçamento do site passam. Só então apresentar os três projetos na página inicial e publicar.
