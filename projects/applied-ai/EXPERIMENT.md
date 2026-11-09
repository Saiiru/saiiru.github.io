# Quando um classificador pequeno ajuda — e quando pedir revisão

Relato técnico reproduzível, desenvolvido com assistência de IA. Não é publicação científica revisada nem resultado de produção.

## Pergunta e método

Um modelo pequeno supera regras na triagem de quatro categorias de suporte em português? Criamos 108 exemplos fictícios, com paráfrases do mesmo cenário na mesma partição: 48 treino, 16 validação, 32 teste e 12 OOD. TF-IDF aprende vocabulário/IDF somente no treino. Regressão logística usa `C` escolhido por macro-F1 da validação. Os limiares de recusa são definidos antes do teste.

## Resultado

Macro-F1 **0,8799**, contra **0,8571** das regras. A diferença é pequena e não foi submetida a teste de significância. A política aceita **20/32** exemplos e recusa os **12/12** OOD desta amostra. Probabilidades não são calibradas. JavaScript e Python produziram decisões iguais e diferenças de probabilidade inferiores a 1e-10 nos 44 casos reservados/OOD.

## O que não foi demonstrado

Dados sintéticos e lexicalmente próximos podem favorecer modelo e baseline. Separar paráfrases pareadas não remove toda similaridade semântica. Não há estimativa de desempenho real ou economia de tempo em empresa. A decisão externa permanece humana.

Lastro mostra outra fronteira: a busca falha em `escalonamento supervisor`, embora exista um documento relevante. Crivo detecta duas regressões introduzidas em respostas fixas, mas não mede verdade factual. As três métricas respondem a perguntas diferentes.

## Próxima investigação

Avaliar textos independentes escritos por pessoas, com consentimento e sem dados pessoais: negações, múltiplas intenções, linguagem informal e assuntos próximos fora do domínio. Depois comparar com um pequeno modelo de linguagem usando o mesmo contrato e os mesmos critérios.

## Reprodução

[README](README.md) · [Dados](ml/data/tickets.json) · [Treinamento](ml/train.py) · [Modelo](models/vetor.json) · [Resultados](reports/vetor.json) · [Paridade](tests/vetor-ml.test.mjs). `npm run benchmark` regenera o resumo, incluindo falhas.
