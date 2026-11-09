---
language: pt
license: mit
library_name: sklearn
pipeline_tag: text-classification
tags: [tf-idf, logistic-regression, synthetic-data, educational]
---

# Vetor Support PT v1

Classificador educacional treinado neste repositório. Não deriva de um LLM. Este documento acompanha o artefato local; **não afirma publicação no Hugging Face**.

## Uso e dados

Demonstra pipeline supervisionado, exportação, avaliação e abstenção. Não validado para atendimento real ou decisões financeiras. [Dataset](../ml/data/tickets.json): 108 exemplos fictícios, CC0-1.0, gerados com IA e sem revisão independente. Partições por cenário: 48 treino, 16 validação, 32 teste e 12 OOD. O hash dos exemplos aparece no modelo e no relatório.

## Treinamento

NFD, remoção de diacríticos, minúsculas e tokens ASCII com dois ou mais caracteres. TF-IDF suavizado com L2 e unigramas/bigramas. Regressão logística, seed 17, até 1000 iterações. `C` escolhido pela validação. [Pesos JSON](../models/vetor.json), sem pickle ou execução de código na desserialização.

## Avaliação

Macro-F1 0,8799, baseline 0,8571 em 32 exemplos. Cobertura 62,5%; recusa de 12/12 OOD. [Resultados completos](../reports/vetor.json). Probabilidades não calibradas. A proximidade lexical favorece este benchmark pequeno; não representa generalização a dados reais. OOD e múltiplas intenções podem escapar da recusa.

## Autoria e proveniência

Desenvolvimento assistido por IA para o portfólio de Sairu. Projeto de estudo; sem validação em produção ou revisão científica. Código/modelo: MIT; dataset: CC0-1.0; dependências mantêm suas licenças.
