# BLACKSITE / AI Builder Labs

Três protótipos de ferramentas de trabalho, feitos com HTML, CSS, JavaScript e módulos ES. Todos funcionam **offline** com dados inteiramente fictícios. Nenhum resultado representa clientes, operação comercial, economia de tempo ou modelo em produção.

## Executar

Requer Node 24. Não há instalação de dependências nem build.

```sh
npm run serve
```

Abra `http://127.0.0.1:4173/` e use `?lab=evalforge`, `?lab=opspilot` ou `?lab=doctrace` para abrir uma aba diretamente. O servidor local é necessário para o navegador carregar módulos ES e arquivos Markdown. Sem chave, tudo funciona no modo determinístico.

```sh
npm test
node scripts/verify.mjs
```

`node scripts/smoke-proxy.mjs` faz uma chamada de integração a um endpoint OpenAI compatível simulado em `127.0.0.1`, sem usar chave real.

Para usar um servidor de LLM compatível com OpenAI, defina as variáveis no **ambiente local** e execute:

```sh
export LLM_BASE_URL='https://api.groq.com/openai/v1'
export LLM_API_KEY='sua-chave-local'
export LLM_MODEL='id-do-modelo-disponivel'
npm run serve:ai
```

`.env.example` documenta as variáveis, mas o app não lê `.env` automaticamente. A chave nunca é enviada ao navegador; o proxy só aceita chamadas do site local na mesma porta, limita entrada, usa timeout de 15 segundos e escuta em `127.0.0.1`. Escolha um modelo disponível no provedor usado. O botão LLM só funciona nessa execução local configurada; a versão estática publicada permanece útil offline.

## Projetos

| Ferramenta | Problema e solução | Limitação |
|---|---|---|
| EvalForge | Alterações em prompts podem quebrar formatos e termos exigidos. Seis casos sintéticos verificam JSON, termos e tamanho; a resposta é editável e o relatório JSON inclui resultados calculados. | As asserções medem somente o que foi escrito nelas; não medem verdade factual ou qualidade semântica. A instrução editada afeta a geração opcional, não reescreve as asserções. |
| OpsPilot | Triagem repetitiva de tickets exige decisão rastreável. Regras classificam equipe e prioridade, um benchmark compara rótulos conhecidos e a exportação exige aprovação humana explícita. | Regras de palavras podem falhar com linguagem ambígua; sugestões de LLM também precisam de revisão. Não há envio de emails ou integração operacional. |
| DocTrace | Respostas a procedimentos precisam mostrar fontes. BM25 recupera trechos de seis documentos Markdown fictícios e monta resposta extrativa com IDs de citação. Arquivos `.md` escolhidos pelo usuário são lidos somente no navegador; a opção LLM é desativada para esses arquivos. | Correspondência lexical pode perder sinônimos e contexto; uma resposta LLM opcional sobre o corpus original é marcada como não verificada. Sem evidência, a resposta offline declara a ausência. |

## Fluxo e código

```text
Browser (index.html + app.js)
  ├─ core/evalforge.mjs ── asserções → relatório JSON local
  ├─ core/opspilot.mjs ─── regras → aprovação humana → JSON local
  └─ core/doctrace.mjs ─── docs/*.md → BM25 → trechos citados
             │
             └─ opcional: /api/chat → server/ai-proxy.mjs → endpoint LLM configurado
```

`tests/*.test.mjs` exercitam a lógica pura; `scripts/verify.mjs` confere arquivos, módulos, quantidade de testes, workflow n8n e contagens do benchmark. `BENCHMARK.md` registra a execução da base sintética.

`integrations/n8n/opspilot.json` é um **blueprint importável**, não executado nem implantado: Webhook → Code → Respond to Webhook. Ele retorna uma sugestão com `approvedByHuman: false` e não envia dados a outro serviço. Ao usar n8n, proteja o webhook antes de ativá-lo. A configuração de resposta por node segue a documentação oficial de [Webhook](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/) e [Respond to Webhook](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.respondtowebhook/).

## Capturas

Com `npm run serve` em outro terminal e Chromium instalado:

```sh
chromium --headless --no-sandbox --disable-gpu --disable-dev-shm-usage --user-data-dir=/tmp/labs-chromium-captura --window-size=1440,1000 --screenshot=/tmp/evalforge.png 'http://127.0.0.1:4173/?lab=evalforge'
chromium --headless --no-sandbox --disable-gpu --disable-dev-shm-usage --user-data-dir=/tmp/labs-chromium-captura --window-size=1440,1000 --screenshot=/tmp/opspilot.png 'http://127.0.0.1:4173/?lab=opspilot'
chromium --headless --no-sandbox --disable-gpu --disable-dev-shm-usage --user-data-dir=/tmp/labs-chromium-captura --window-size=1440,1000 --screenshot=/tmp/doctrace.png 'http://127.0.0.1:4173/?lab=doctrace'
```

## Aprendizados

Testes de prompt precisam de critérios explícitos e relatórios reproduzíveis. Classificação útil precisa expor quando uma regra não cobre um caso e manter aprovação humana como estado real. Respostas documentais precisam exibir o trecho recuperado para que a pessoa confira a citação, inclusive quando um LLM está disponível.
