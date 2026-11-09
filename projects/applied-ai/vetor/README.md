# Vetor

**Triagem de texto com pesos inspecionáveis e revisão humana.**

[Demo](https://saiiru.github.io/labs/?lab=vetor) · [Model card](MODEL_CARD.md) · [Dataset](../ml/data/tickets.json) · [Erros e matriz](../reports/vetor.json)

O classificador sugere Entrega, Estornos, Pagamentos ou Acesso. Pouco sinal exige revisão manual. Uma regra separada sugere prioridade. Editar o chamado invalida a aprovação anterior; não há execução automática de ações externas.

## Como funciona

Treino em Python: normalização → TF-IDF de unigramas/bigramas → regressão logística multinomial. O JSON exportado inclui vocabulário, IDF, coeficientes, interceptos e política de recusa. JavaScript reproduz essas operações no navegador. O modelo atual tem **416 atributos**; não gera texto nem voz.

## Rodar

Na pasta `projects/applied-ai`:

```sh
npm run serve
npm run vetor -- "Meu pagamento foi recusado."
npm test
```

## Reproduzir o treinamento

Python 3.11+; verificado em Python 3.12 com scikit-learn 1.8.0 e NumPy 2.3.5.

```sh
python3 -m venv .venv
. .venv/bin/activate
python -m pip install -r ml/requirements.txt
python ml/train.py
python -m unittest ml/test_training.py
npm test
npm run benchmark
```

A instalação usa rede; o treinamento não usa GPU, rede ou dados pessoais. Gera `models/vetor.json`, `reports/vetor.json` e `ml/fixtures/parity.json`.

## Dados e separação

108 exemplos sintéticos em português: **48 treino, 16 validação, 32 teste, 12 fora do domínio**. Cada cenário tem duas formulações mantidas juntas na mesma partição. A validação rejeita IDs/textos repetidos e cenário em mais de uma partição. Isso reduz vazamento de paráfrases pareadas, mas não elimina toda sobreposição semântica.

Vocabulário e IDF usam somente treino. `C` é escolhido entre 0.5, 1 e 4 pelo macro-F1 da validação; empate favorece o menor `C`. A política, fixada antes do teste, exige score ≥0,45, margem ≥0,08 e proporção de palavras conhecidas ≥0,10. Dados gerados com assistência de IA, sem revisão independente declarada.

## Resultados

Macro-F1 no teste: **0,8799**; regras: **0,8571**. Com recusa, aceita **20/32** exemplos. Recusou os **12/12** exemplos fora do domínio. Consulte cada falha no relatório. São amostras pequenas e sintéticas, sem estimativa de desempenho com clientes reais.

Paridade Python/JavaScript em **44** casos exige diferença <1e-10 nas probabilidades e decisão final igual. Testes adicionais cobrem vazamento, vocabulário de teste, entradas vazias, OOV e limites.

## Limites e próximo experimento

Probabilidades não calibradas, sem monitoramento de drift ou persistência. A recusa não reconhece todo assunto desconhecido. Múltiplas intenções podem confundir o modelo. Contribuições de atributos não são explicações causais. A prioridade é uma regra identificada, não uma saída aprendida.

Próximo experimento: avaliar textos independentes escritos por pessoas, incluindo negações, informalidade e múltiplas intenções. KORA pode receber um componente desse tipo após definir seu contrato; nenhuma integração com ela foi feita aqui.
