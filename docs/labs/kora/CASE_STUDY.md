# KORA — estudo de caso: da tarefa pendente à próxima ação verificável

**Situação:** KORA funcional no computador; laboratório público Rota independente e experimental. **Atualização:** 11/11/2026. [Abrir laboratório Rota](https://saiiru.github.io/labs/?lab=rota) · [README técnico do laboratório](README.md).

## 1. Problema antes do modelo

Estudo Eletromecânica no SENAI e desenvolvo software, projetos de eletrônica e protótipos. Tarefas, compromissos, documentação e orçamento estão em fontes diferentes. Uma resposta de IA pode soar convincente e estar errada sobre o que devo fazer, meu saldo ou um compromisso.

**Pergunta de produto:** como transformar fontes locais em **uma próxima ação justificável**, sem inventar informações e sem enviar dados privados desnecessariamente a modelos?

O primeiro corte resolveu a parte determinística: obter tarefas pendentes do SENAI no Taskwarrior, consultar a agenda da KORA, ler finanças apenas quando configuradas e construir um briefing. Antes de qualquer modelo generativo, é necessário saber quais informações a resposta pode afirmar.

## 2. Arquitetura: duas implementações, finalidades distintas

### KORA operacional — privada, no computador

```text
kora ask /brief (CLI)
        |
        v
KoraAssistant.answer (controle de autorização e roteamento)
        |
        +--> Taskwarrior somente leitura (tarefas do SENAI)
        +--> SQLite KORA somente leitura (compromissos)
        +--> contrato financeiro local, opt-in (valores em centavos)
        |
        v
build_brief: ordenação por prazo/prioridade e tratamento de fontes ausentes
        |
        v
resposta determinística; sem chamada ao LLM e sem criar/modificar registros
```

Algumas perguntas **textuais explícitas** agora são reconhecidas pelo núcleo privado e encaminhadas para leitura local (prioridades, finanças, agenda e busca). Isso não equivale a compreensão aberta de linguagem natural nem a uma interface por voz: **microfone, STT, TTS e wake word não estão ativos**. O Pi é runtime de conversa genérica substituível; a camada KORA conserva o controle das fontes, permissões e estrutura das informações.

O código operacional não faz parte deste repositório público. Não apresento a demo como acesso à minha instalação privada nem publico os seus registros. O contrato financeiro reaproveita lógica do LUKA; ele não implica sincronização com a conta de outra pessoa.

### Rota — laboratório público, independente

```text
pedido sintético no navegador
  -> baseline de regras / classificador experimental
  -> domínios candidatos + possibilidade de abstenção
  -> recuperação lexical (TF-IDF/BM25) e contexto limitado
  -> finanças/agenda fictícias no navegador
  -> decisão rastreável e explicação das limitações
```

**Fonte:** [orquestração da demo](../core/kora-assistant-demo.mjs), [regras](../core/kora-router.mjs), [ML treinado](../core/kora-ml.mjs), [módulos financeiros e de eventos](../core/kora-workspace.mjs). A demo não executa chamadas ao seu computador ou ao LLM, nem altera tarefas.

## 3. Escolhas de engenharia

| Escolha | Motivo | Trade-off |
| --- | --- | --- |
| Começar sem LLM no briefing | Provar o contrato de dados antes de gerar linguagem | Respostas mais rígidas; não interpreta pedidos livres ainda |
| Taskwarrior/SQLite como fontes de verdade | Evitar bancos duplicados e manter contexto local | Requer configuração e dados atualizados |
| Centavos inteiros e status financeiros | Evitar arredondamento e mistura de planejado com realizado | Formato de exportação precisa ser validado |
| Regras como baseline | Comportamento explicável e barato de testar | Menor flexibilidade para linguagem ambígua |
| ML supervisionado na Rota, opcional | Aprender a medir classificação e abstenção com erro explícito | Fraco fora do domínio; não autoriza ações |
| Recuperação com citações | Permite inspeção da origem e recusa sem evidência | Correspondência lexical não é compreensão semântica |
| Separar público de privado | Permite reproduzir o estudo sem expor dados pessoais | A demo não é uma prova de integração produtiva |

## 4. Evidência — resultados medidos, sem extrapolar

No checkout operacional da KORA, em 11/11/2026, foram reexecutados **84 testes Python**, todos aprovados. A baseline de briefing passou em **11/11 cenários sintéticos**, incluindo tarefas vencendo, datas atravessando meses, status financeiros, ausência de configuração, erro de fonte e saída sem LLM. Esses resultados são do **núcleo privado** e não ficam auditáveis neste repositório sem uma exportação futura do código pertinente.

Na **Rota pública**, os dados de avaliação ficam no repositório. O classificador experimental foi treinado com 72 exemplos, validado com 24 e testado com 24, mais 12 fora do domínio. No teste sintético reservado, o modelo alcançou macro-F1 de **0,786**, aceitou **13/24** solicitações e recusou apenas **5/12** fora do domínio. Por isso não está promovido a roteador oficial da KORA.

- [Relatório Rota](../reports/kora-ml.json)
- [Dataset Rota](../ml/data/kora-requests.json)
- [Testes JavaScript de rotas](../tests/kora-router.test.mjs)
- [Testes de paridade do modelo](../tests/kora-ml.test.mjs)
- [Treinamento reproduzível](../ml/train_kora.py)
- [Documentação das limitações](README.md)

Os dados públicos são fictícios/gerados com assistência de IA. Não houve medição de aumento de produtividade, desempenho em produção ou avaliação independente. **Número de testes aprovados não é taxa de acerto do assistente no mundo real.**

## 5. Como avaliar o que é público

No diretório raiz deste portfólio:

```sh
npm ci
node --test projects/applied-ai/tests/*.test.mjs
npm run build
npm run check:build
```

No diretório `projects/applied-ai`, consulte o [README](../README.md) para iniciar a demo local e os comandos de benchmark. Treinamento de ML requer ambiente Python separado e dependências documentadas em `ml/requirements.txt`; não é requisito para reproduzir a inferência JavaScript já exportada.

**Tente falhar de propósito:** peça uma receita de pão na Rota com ML experimental, compare as regras, edite um lançamento de despesa fictícia, teste uma data inválida e examine o relatório. O sistema não deve esconder o erro do classificador nem fabricar dado financeiro.

## 6. Próximo experimento GenAI — hipótese, não implementação concluída

Criar `brief-evidence/1`, um contrato JSON de fatos/proveniência/horário, e permitir ao modelo **somente explicar** a decisão usando fatos autorizados. O modelo não calcularia dinheiro nem criaria compromissos.

Avaliar os dois modos com os mesmos casos: precisão factual, alucinação, recusa quando faltar evidência, privacidade, latência e custo. Só considerar ajuste fino ou treinamento adicional quando uma falha recorrente justificar o experimento.

O próximo passo de engenharia é **compreender e estabilizar o fluxo atual**, antes de aumentar a autonomia. As referências OpenJarvis e GLaDOS ficam em backlog para voz/conversação posterior, sem ativar microfone ou instalar serviços.

## 7. O que isso demonstra para uma vaga AI Engineer

Consigo explicar um problema, separar código determinístico de modelo probabilístico, construir avaliação reproduzível, preservar dados privados, admitir limites e identificar o próximo experimento. Isso demonstra fundamentos e processos, **não experiência prévia em produção com sistemas multiagentes ou modelos treinados em dados empresariais**.
