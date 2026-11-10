# KORA Rota — assistente local e laboratório de ML

[Experimente no navegador](https://saiiru.github.io/labs/?lab=rota) · [Resultado completo](../reports/kora-ml.json) · [Modelo](../models/kora-router.json) · [Dataset](../ml/data/kora-requests.json)

KORA Rota decide quais procedimentos consultar, monta contexto limitado e calcula resumos financeiros e agendas localmente. É uma demonstração independente da KORA do computador. Não acessa Obsidian, LUKA, Planner, contas ou credenciais reais. Nenhuma ferramenta executa ações em nome do usuário.

## Experimente em três minutos

1. Abra a demo e selecione um pedido financeiro, de eventos ou misto.
2. Compare **Regras** e **ML experimental**. Os dois métodos podem se abster. O classificador aprende seis domínios: finanças, eventos, estudo, eletrônica, conhecimento e tarefas. Pedidos com duas áreas explícitas preservam as duas rotas de regras.
3. Veja os procedimentos, as fontes recuperadas e o limite de 1.800 caracteres. Esse limite é de caracteres, não uma contagem exata de tokens.
4. Em “Experimentar meus dados”, cole JSON para recalcular um resumo ou agenda. A importação é validada antes de substituir os dados atuais. Recarregar a página descarta os dados.
5. Exporte a decisão para estudar o roteamento. O download contém o pedido digitado e a decisão; não inclui os lançamentos financeiros nem a lista de eventos.

## O que mudou em relação ao Vetor

O Vetor original continua sendo uma referência de classificação de chamados. Seu treinamento foi generalizado sem mudar os padrões originais. O novo modelo KORA usa um dataset próprio e aprende domínios do assistente. Os pesos exportados são usados de verdade no navegador; não é uma resposta simulada de LLM.

O modelo sugere contexto. Não autoriza pagamentos, alterações de agenda, acesso a arquivos ou execução de comandos. As regras continuam sendo o padrão porque a avaliação fora do domínio revelou falhas importantes.

## Experimento reproduzível

```sh
python -m venv .venv
.venv/bin/pip install -r ml/requirements.txt
.venv/bin/python ml/train_kora.py
.venv/bin/python -m unittest discover -s ml -p 'test_*.py'
npm test
npm run serve
```

Requer Python 3.12 e Node 24. Abra `http://127.0.0.1:4173/?lab=rota`. O treino roda na CPU, não baixa modelos e não consulta APIs.

| Evidência | Resultado |
| --- | --- |
| Exemplos sintéticos | 72 treino / 24 validação / 24 teste / 12 fora do domínio |
| Macro-F1 no teste de domínio | ML 0,786 / regras 0,498 |
| Casos aceitos pelo limiar | 12 de 24 (50%) |
| Corretos entre os aceitos | 12 de 12 neste conjunto pequeno |
| Recusa fora do domínio | 6 de 12 (50%): insuficiente para promoção automática |
| Paridade Python / navegador | Probabilidades comparadas nos 36 casos de teste e fora do domínio |

Os exemplos foram escritos com IA e separados por famílias de cenário antes do treinamento. Não há anotação independente, dados de empresa, conversas pessoais ou teste em produção. Os 12 acertos aceitos não demonstram confiabilidade geral. Perguntas como “Faça uma receita de pão” foram classificadas incorretamente como estudo; os erros completos estão no relatório.

C é selecionado pelo macro-F1 de validação entre 0,5 / 1 / 4. O limiar usa apenas validação: exige pelo menos 90% de acerto entre os aceitos e maximiza cobertura. Teste e exemplos fora do domínio não são usados para ajustar pesos ou escolher esse limiar. A pontuação softmax não foi calibrada como probabilidade de acerto. Nenhuma alegação de ganho de tokens ou de negócio é feita.

## Arquitetura e arquivos

| Arquivo | Responsabilidade |
| --- | --- |
| `ml/train.py` e `ml/train_kora.py` | TF-IDF + regressão logística, seleção por validação e exportação JSON |
| `core/kora-ml.mjs` | Inferência dos pesos, recusa, preservação de pedidos mistos |
| `core/kora-router.mjs` | Referência de regras explícitas |
| `core/kora-workspace.mjs` | Cálculos em centavos, validação de datas e ordenação de eventos |
| `core/kora-assistant-demo.mjs` | Orquestração, contexto limitado e fontes |
| `models/kora-router.json` | Vocabulário, IDF, pesos, versão e hash dos dados |
| `reports/kora-ml.json` | Matriz de confusão, resultados individuais e erros |

Na recuperação, os vetores TF-IDF com feature hashing e BM25 são lexicais, não embeddings neurais. A busca exige ao menos um termo compartilhado para reduzir resultados por colisão de hash; isso ainda não garante relevância semântica. O corpus inicial possui quatro documentos fictícios.

## Contratos de dados locais

Financeiro: valores inteiros em centavos. `confirmed` e `paid` entram no realizado; `planned` permanece separado; `cancelled` e `refunded` não entram. Saldo negativo e orçamento excedido permanecem visíveis.

```json
{"schema":"luka.finance-export/1","transactions":[{"transaction_date":"2026-11-01","amount_cents":275,"transaction_type":"expense","status":"paid","category_name":"Material"}],"budgets":[]}
```

Eventos: exportação simplificada para a demo, com título, viagem e timestamp com fuso. Não é uma conexão ao banco privado.

```json
[{"title":"Revisão do protótipo","trip":"Laboratório demonstrativo","at":"2026-11-12T10:00:00-03:00"}]
```

## KORA do computador

O checkout privado possui adaptadores Python para exportação LUKA, SQLite do Planner e índice documental local. A demo pública não comprova que essas fontes pessoais estejam configuradas. O modelo deste laboratório não substitui automaticamente o roteador privado, nem cria novas permissões. Voz, robô e integrações de escrita não fazem parte desta entrega.

## Referências e visual

Implementação original de CSS com molduras, foco visível e glitch breve já presentes no portfólio. Sem bibliotecas visuais novas e com `prefers-reduced-motion`. Referências de técnica: [CodePen glitch](https://codepen.io/ZTetriminos/pen/WNWOEwe), [terminal](https://codepen.io/cheliam/pen/wmKvdQ), [TF-IDF scikit-learn](https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html), [SQLite no Prisma](https://www.prisma.io/docs/orm/v6/overview/databases/sqlite).
