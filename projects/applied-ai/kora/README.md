# KORA · Rota e assistente local-first

Laboratório de portfólio que apresenta uma fatia do KORA: roteamento de pedidos, recuperação com fontes, orçamento de contexto e exemplos sintéticos de integração financeira e agenda.

Esta página é uma reprodução independente. Não lê a instalação privada do KORA, Obsidian, Taskwarrior, LUKA ou Planner; não chama modelo, não grava e não contém dados pessoais.

## Experimente

Na galeria Applied AI, abra a aba **04 KORA ROTA**. Escolha uma solicitação financeira, uma de eventos ou a solicitação mista. O laboratório apresenta:

1. A habilidade selecionada e os sinais lexicais.
2. Os trechos fictícios recuperados, com origem e comparação de similaridade vetorial / ranking BM25.
3. O tamanho do contexto montado, limitado a 1.800 caracteres.
4. Um resumo financeiro ou agenda de exemplo quando os domínios aparecem na rota.
5. Abstenção quando nenhuma habilidade atinge o limiar.

Os valores financeiros e as atividades de viagem são fixtures fixas e fictícias. A simulação não afirma estar conectada aos produtos reais.

## Arquitetura aplicada

- Roteador determinístico em JavaScript com catálogo versionado: normalização de português, frases e palavras, no máximo duas habilidades e abstenção.
- Recuperação local no navegador: vetores TF-IDF com feature hashing + cosseno e sinal lexical derivado de BM25. Fontes retêm caminho, título e trecho.
- Módulo financeiro usa centavos inteiros e mostra realizados separados de lançamentos planejados, seguindo os grupos de status do LUKA.
- Módulo de agenda mantém atividade associada à viagem, seguindo o modelo trips/activities do Planner e exibindo UTC.
- Fixtures sintéticas; nenhuma chamada externa ou gravação.

A busca de demonstração usa quatro documentos sintéticos pequenos. Ela não é um banco persistente e não equivale ao índice SQLite do KORA privado. O índice privado salva vetores TF-IDF/feature-hash em SQLite e combina com FTS5/BM25. Não há embeddings neurais nesta implementação.

## Executar e avaliar

Na raiz de Applied AI:

    npm run serve

Abra http://127.0.0.1:4173/?lab=rota.

    npm test
    npm run benchmark
    npm run kora-router -- --eval
    npm run kora-router -- "Quero o resumo financeiro e meus gastos do mês."

A avaliação de rotas tem 34 casos sintéticos e exige correspondência exata no conjunto versionado. Os 34/34 são regressão interna, não teste independente da acurácia em conversas reais.

## Integrações reais do KORA (branch privada de desenvolvimento)

O KORA privado tem comandos locais determinísticos:
- /finance [YYYY-MM] lê exportação JSON selecionada de LUKA e nunca manda o extrato ao modelo.
- /events [trip-id] lê SQLite do Planner em modo somente leitura.
- scripts/kora_knowledge.py indexa Markdown/TXT aprovados em ~/.local/state/kora/knowledge.sqlite3. A busca retorna caminho, bloco e orçamento de contexto.

Ainda falta construir/configurar uma exportação LUKA versionada; a integração D1/Worker não está ligada. O caminho do banco local Planner também não está configurado. O adaptador somente leitura está testado com banco sintético. A busca privada usa vetores lexicais, não embeddings de modelo. A documentação de arquitetura privada permanece em docs/kora-assistant-proposal.md no checkout KORA e não é publicada neste repositório.

## Visual e acessibilidade

O glitch RGB curto é disparado apenas por hover/foco; scanlines ficam numa textura estática. Não há animação contínua. O efeito atende prefers-reduced-motion e usa transform/opacity para manter a atualização leve. Referências reconstruídas com CSS próprio: [CodePen glitch](https://codepen.io/ZTetriminos/pen/WNWOEwe), [kinetic type](https://codepen.io/Enrichr-Dev/pen/azJPjPW), [terminal scanlines](https://codepen.io/cheliam/pen/wmKvdQ) e [guia de desempenho MDN](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Animation_performance_and_frame_rate).

## Limites honestos

- O roteador não é ML nem garante intenção correta.
- O vetor hash é lexical e perde paráfrases/sinônimos; a pontuação não é probabilidade.
- A recuperação mostra relevância, não prova que um trecho responde corretamente.
- As respostas financeiras/de eventos só usam fixtures sintéticas nesta página.
- Nenhuma ação de escrita é executada. Na arquitetura privada, finanças e agenda continuam fora do modelo remoto.
