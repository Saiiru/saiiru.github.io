# UX Critique — catálogo de projetos independentes

**Data:** 12/11/2026
**Alvo:** portfólio SAIRU/BLACKSITE original, seção de projetos independentes
**Método:** revisão visual em Chromium com dois tamanhos de tela, exame do código React e varredura automatizada Impeccable. A revisão não contou com subagentes independentes.

## Diagnóstico anterior

A seção começava cerca de 3.847 pixels abaixo do topo no desktop e 4.654 pixels no celular. O menu PROJETOS levava à KORA, não ao catálogo standalone. Doze cartões de tamanho semelhante repetiam o campo Próxima melhoria, em vez de responder primeiro o que o projeto faz e onde está a prova.

| Heurística de Nielsen | Nota de 0 a 4 |
| --- | ---: |
| Visibilidade de estado | 2 |
| Correspondência com o mundo real | 2 |
| Controle e liberdade | 3 |
| Consistência | 3 |
| Prevenção de erros | 3 |
| Reconhecimento sem memorização | 2 |
| Flexibilidade de navegação | 2 |
| Estética e simplicidade | 1 |
| Recuperação de erros | 3 |
| Ajuda e documentação | 2 |

**Total inicial: 23/40**, pontuação editorial e qualitativa, não certificação de acessibilidade.

A inspeção automatizada não encontrou falhas de padrão de código. Isso não invalida os problemas de apresentação e descoberta observados.

## Prioridades identificadas

- P0: tornar a seção localizável a partir do topo, do menu e dos links diretos.
- P1: reduzir a repetição dos doze cartões e criar peso visual para aplicações mais completas.
- P1: destacar problema, escopo verificável, tecnologia e links de documentação.
- P1: dar nomes profissionais e consistentes, preservando rastreabilidade e dependências.
- P2: reduzir a quantidade de texto técnico simultâneo com expansão sob demanda.

## Mudanças feitas

1. O menu PROJETOS e o CTA secundário da página conduzem ao catálogo, movido acima dos laboratórios de IA.
2. Travel Planner API e Order Management CLI ganharam apresentação em destaque com fluxo conceitual, stack e links claros para código e documentação.
3. Os outros dez estudos passaram para um índice editorial de leitura rápida, com detalhes de limites e próximas melhorias expansíveis.
4. Nove repositórios foram renomeados no GitHub sem alterar seu histórico; os três slugs ligados a Pages/workflows foram mantidos.
5. Todos os doze repositórios receberam documento de escopo e origem. Estudos de curso continuam atribuídos a seus autores e iniciativas.
6. A busca geral permanece acessível e reconhece também os nomes históricos.

## Personas e fluxo

**Recrutador:** chega pela navegação ou pelo hero, encontra primeiro duas aplicações com escopo, escolhe código/documentação e então consulta os estudos.

**Visitante novo:** identifica claramente que os itens são independentes da KORA; não precisa conhecer nomes internos.

**Revisor técnico:** abre documentação e histórico público, confere limites e identifica que ainda faltam testes de execução em diversos projetos antigos.

## Aceitação e limites

Revalidar cinco larguras de tela (320, 390, 768, 1280, 1440 px), atalhos de âncora, teclado, ausência de overflow, links e fallback de carregamento; preservar CSP e as restrições iniciais de JS/CSS compactado.

Esta etapa **não** refatorou os doze projetos nem comprovou sua execução atual. O site oferece curadoria honesta de código existente. Não atribuir uma nova pontuação heurística sem uma segunda avaliação.

Documentação de nomes e finalidades: design/standalone-projects/README.md.
