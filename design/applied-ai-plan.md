# Applied AI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Steps use checkbox syntax for tracking.

**Goal:** entregar Crivo, Vetor e Lastro executáveis e documentados com ML real e demonstrações públicas.

**Architecture:** lógica pura JavaScript, treinamento Python/scikit-learn e exportação JSON. Dados sintéticos separados por cenário, inferência local e site estático.

**Tech Stack:** Python 3.11+, scikit-learn 1.8.0, Node 24, React/Vite existentes.

**Spec:** design/applied-ai-spec.md

## Global Constraints

- Dados sintéticos; sem credenciais; sem execução de hardware; preservar a KORA.
- Uma implementação canônica em projects/applied-ai; cópia publicada gerada.
- Modelo supervisionado apenas no Vetor; probabilidades não calibradas.
- Preservar URLs antigas e aprovação humana.

## Review Focus

- Vazamento entre treino e teste: rejeitar grupos e textos sobrepostos.
- Texto vazio/OOV: exigir revisão manual, sem decisão automática.
- Exportação JavaScript: probabilidades equivalentes ao Python.
- Editar depois da aprovação: impedir exportação até nova revisão.
- Migração de nomes: links antigos, exports e módulos ainda funcionam.

## Task 1: Migração e contratos

- [x] Mover projetos para projects/applied-ai e nomes crivo/vetor/lastro; atualizar imports/testes e aliases de URL.
- [x] Escrever testes de compareRuns e benchmarkRetrieval; observar falha por função ausente.
- [x] Implementar compareRuns(cases, baseline, candidate) e benchmarkRetrieval(cases, passages, limit).
- [x] Rodar node --test tests/*.test.mjs; esperado todos verdes.

## Task 2: Vetor ML

- [x] Criar ml/data/tickets.json com origem explícita e splits fixos.
- [x] Criar testes Python de vazamento, exclusão do vocabulário de teste e exportação; observar falha antes de implementar.
- [x] Implementar ml/train.py: validate_dataset(rows), train_model(rows), predict(text, artifact), train/export/report via CLI.
- [x] Criar teste JS de routeWithModel(text, artifact) e paridade usando fixtures do treino; observar falha antes de implementar.
- [x] Treinar com Python, exportar models/vetor.json, reports/vetor.json e fixtures/parity.json. Gerar resultados sem números inventados.
- [x] Implementar core/vetor-ml.mjs e testar recusa, score, explicação e paridade.

## Task 3: Produto e documentação

- [x] Integrar modelo real na aba Vetor, baseline visível e relatório calculado separado.
- [x] Expor comparação Crivo e relatório Lastro; adicionar CLIs e READMEs individuais.
- [x] Sincronizar public/labs por script, atualizar README e vitrine com links para demos/código.
- [x] Treino repetido gera artefato idêntico; npm tests, Python tests, benchmarks, build e check:build passam.
- [x] Testar no navegador desktop/mobile: erros de console, links/abas, inferência, aprovação invalidada, exportação, recusa e upload.
- [x] Revisão independente concluída e achados corrigidos; publicação autorizada e preparada. Confirmar status do Pages no encerramento.
