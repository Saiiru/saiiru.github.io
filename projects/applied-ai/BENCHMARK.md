# Resultados reproduzíveis

Dados sintéticos. Não representam uso em empresa, qualidade geral de LLM ou retorno de negócio.

## Vetor — teste reservado

32 exemplos; macro-F1 0.8799; regras 0.8571; cobertura 62.5%; acurácia entre aceitos 100.0%.

12 exemplos fora do domínio; recusa 100.0%. Amostra pequena, probabilidades não calibradas. Artefato e métricas derivam do mesmo dataset SHA-256 ed07e278875dac98e8797fd5679d66c88708d73a7a3aa911dbe43b84edbb2d6d.

## Crivo — regressões introduzidas

Referência 6/6; candidata 4/6; regressões EF-01, EF-03. Respostas fixas, sem chamada a LLM.

## Lastro — recuperação lexical

12 passagens; 6 perguntas com fonte, 2 fora do corpus. Recall@3 0.8333; MRR 0.8333; acerto de ausência 50.0%.

Consulte os resultados por caso e a matriz de confusão em reports/. Reproduza com python ml/train.py e npm run benchmark.
