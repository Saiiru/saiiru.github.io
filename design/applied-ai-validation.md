# Crivo, Vetor e Lastro — validação de entrega

Verificado em 2026-11-09. Registro dos testes executados no desenvolvimento assistido por IA.

## Implementação

- Crivo: contratos de respostas, referência salva, regressões/melhorias, exportação JSON/Markdown e CLI com códigos de saída.
- Vetor: TF-IDF + regressão logística treinados; JSON de pesos e inferência local equivalente ao Python. Prioridade por regra separada; revisão humana antes da exportação.
- Lastro: BM25, fontes e trechos visíveis, leitura local de Markdown, recusa lexical e benchmark de recuperação.
- Código canônico em projects/applied-ai; public/labs e docs/labs gerados. URLs com os nomes antigos preservadas.

## Evidência

- 30 testes Node passaram, incluindo paridade em 44 exemplos e entradas desconhecidas/inválidas.
- 3 testes Python passaram: separação de cenários/textos, vocabulário só de treino e probabilidades exportadas.
- Novo treino no mesmo ambiente reproduziu byte a byte modelo, relatório e fixtures. Hash SHA-256 do modelo: `33c92c1268cbbb51` (prefixo; o hash integral pode ser calculado do arquivo).
- `npm run benchmark` e `npm run verify` passaram; métricas derivadas dos dados e decisões por caso.
- Toolkit e hardening: navegação, escape de entrada, CSP, GPU adiada, movimento reduzido, fallback sem JavaScript e falha de WebGL passaram. Biblioteca de 24 componentes preservada.
- `npm run build` e `npm run check:build` passaram, preservando orçamento de carregamento e política CSP.
- `scripts/e2e_applied_ai.py`: três ferramentas, aliases antigos, comparação, ML, aprovação invalidada, downloads, ausência de evidência, upload e larguras 320/390/768/1440; sem erros de console/JavaScript.
- `scripts/e2e_applied_ai_races.py`: respostas obsoletas descartadas nas três ferramentas; carregamento inicial não substitui o corpus selecionado; extensão `.MD` aceita.
- Capturas novas derivadas das demos executadas; incluídas em public/assets/previews e no build.

## Revisão independente

Uma revisão separada encontrou respostas assíncronas obsoletas, IDs desconhecidos aceitos pela CLI, disputa entre corpus inicial e upload e imagens ausentes na primeira versão. Todos foram corrigidos e verificados. A inconsistência `.MD` também foi corrigida com teste que falhou antes da alteração e passou depois.

## Limites

Um único classificador supervisionado, dados sintéticos e pequeno teste reservado. Nenhum LLM treinado, provedor real chamado na validação, uso de clientes ou implantação do blueprint n8n. Model card e relato técnico estão no GitHub; não houve publicação no Hugging Face ou participação no Kaggle. O circuito de voz e a KORA existente ficaram fora desta entrega.
