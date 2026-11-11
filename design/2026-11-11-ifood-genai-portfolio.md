# BLACKSITE — GenAI iFood 2027: pesquisa e decisões de portfólio

**Data:** 2026-11-11. **Alvo:** candidatura à trilha **AI Engineer** (engenharia de software com foco em IA), mantendo elegibilidade e disponibilidade como verificações separadas. **Status:** pesquisa orientadora, não relato de aprovação ou acesso à engenharia interna do iFood.

## Evidência oficial, e o que ela realmente significa

1. [iFood, artigo publicado em 4 nov. 2026](https://pt.linkedin.com/pulse/genai-conhe%C3%A7a-o-programa-de-est%C3%A1gio-e-resid%C3%AAncia-em-ia-do-ifood-nvbxf/): um integrante da equipe do Jhow relata uso de **Python, FastAPI, LangGraph e LLMs**, arquitetura multiagentes e um sistema de avaliação com **135 casos de teste**. O artigo associa a operação a cerca de 2 milhões de chamados mensais. São **métricas e escolhas relatadas pela equipe do iFood**, não resultados dos meus laboratórios e não uma lista completa de tecnologias de todos os times.
2. [Vaga oficial no Greenhouse](https://job-boards.greenhouse.io/ifoodcarreiras/jobs/8901054002): AI Engineer inclui tanto integração de software para produtos de IA quanto construção/operação de modelos. Aceita ensino técnico correlato com previsão de conclusão entre julho de 2027 e janeiro de 2029; exige 30 horas semanais; inglês não obrigatório. A trilha selecionada na inscrição é única.
3. O prazo anunciado no artigo é **17 de novembro de 2026**. A formação técnica prevista para 2028 é compatível com a janela indicada, mas a disponibilidade diária deve ser confirmada sem alegar ajuste de horário inexistente.

## Reddit — relatos de candidatos, não documentação do processo atual

- [r/brdev — GenAI iFood, novembro de 2025](https://www.reddit.com/r/brdev/comments/1owjhm4/programa_de_est%C3%A1gio_genai_ifood/): um participante descreve desafio com raciocínio lógico e fundamentos de IA; comentários posteriores mencionam HackerRank. É uma **edição anterior**, não prova de que o teste de 2026 será igual.
- [r/brdev — Estágio iFood iFuture 2027](https://www.reddit.com/r/brdev/comments/1w3esed/estagio_ifood_ifuture_2027/): aparecem menções à triagem automatizada e teste de lógica por outra plataforma. O programa não é necessariamente a mesma trilha GenAI e não autoriza afirmar formato definitivo.
- [r/brdev — entrevista Digaí](https://www.reddit.com/r/brdev/comments/1vxi2td/programa_de_est%C3%A1gio_genai_20262_ifood/): comentários descrevem perguntas por áudio, mas outros participantes corrigem a identificação do programa. Tratar como referência de preparação, não como roteiro oficial.
- [r/brdev — entrevista sênior iFood](https://www.reddit.com/r/brdev/comments/1vgsfer/experi%C3%AAncia_ruim_processo_seletivo_ifood/): sistema de avaliação discutido para cargo staff/sênior, não para estágio. Pode inspirar estudo de trade-offs (idempotência, resiliência, comunicação), sem extrapolar o nível cobrado.

## O que mudar no portfólio, e por quê

| Decisão | Problema observado | Efeito verificável |
| --- | --- | --- |
| Rota/KORA explicado como laboratório sintético | Visitante poderia confundir projeto privado e demo pública | Contrato claro sobre dados, modelo, roteamento e limites |
| Vetor mantém treino, split e baseline | F1 isolado parece publicidade | Compara métricas contra regras; mostra abstenção e dados sintéticos |
| Crivo apresenta falhas e critérios | Resposta de LLM bonita pode estar errada | Casos reproduzíveis e inspeção de falhas |
| Lastro evidencia fontes e recusa | Recuperação de documento pode alucinar sem contexto | Trechos citados e fallback sem resposta |
| Experiência profissional antes de promessas | Rótulo de engenheiro pleno não é prova de senioridade | Trajetória real, formações e estados de estudo explícitos |
| LUKA separado da vitrine | Domínio financeiro privado não é requisito da demo | Worker público desativado separadamente; código e dados preservados |

Os quatro laboratórios não são quatro empresas nem sistemas operando com usuários reais. Seus resultados são locais/sintéticos. **Não acrescentar fake production metrics.**

## Linguagem visual adotada

A imagem de referência forneceu seis cores fortes. Tradução para um sistema operacional cyberpunk: Deep Void (`#050505`) domina; Cyber Yellow (`#F3E600`) identifica SAIRU e marca conteúdos de destaque; Bionic Cyan (`#00E5FF`) sinaliza ações; Hot Pink (`#FF2DAA`) aparece como contraponto; Netrunner Blade (`#0313A6`) ocupa superfícies profundas; Night City Red (`#C5003C`) fica reservado a risco/erro. Copiar o painel inteiro ou preencher a tela de neon destruiria a hierarquia. O texto regular usa tons claros distintos e contrastantes.

A experiência mantém: SVG original, hover glitch finito, navegação, README, biblioteca de componentes, arquivo público identificando forks, foco por teclado, redução de movimento e field WebGL preguiçoso. O build fica estático no GitHub Pages, sem custos de inferência por visitante. O CSS inicial foi ampliado com um limite explícito de 21 KiB gzip (abaixo do limite de JavaScript 75 KiB); não tratar isso como certificado de desempenho.

## Plano de revisão para o desafio e entrevistas

**Até 17/11:** priorizar **inscrição**, não atrasá-la esperando projeto novo. Treinar 30–45 minutos/dia os seguintes tópicos: dicionários/listas, validação JSON, Python básico, classificação TF-IDF, splits de dados, precisão/recall/F1, RAG lexical versus embeddings, FastAPI básico, uso seguro de LLMs, testes de abstenção, custo/latência e defesa de trade-offs. Em cada sessão, executar algo pequeno no projeto real, explicar o que aconteceu e registrar uma falha. Preparar respostas STAR sobre trabalho em equipe, bug real, feedback e investigação.

**Case Study:** apresentar um problema concreto, a arquitetura mínima, o que é determinístico versus probabilístico, quais entradas e erros são esperados, onde inserir validação, métricas para uma avaliação offline, privacidade, custo, observabilidade e como escalar com limitação de latência. Evitar memorizar frameworks como substituto de princípios de engenharia.

**Depois da inscrição:** um laboratório FastAPI de **consulta com fontes**, ligado a corpus sintético e suíte de avaliação, seria o avanço mais transferível; somente promovê-lo a portfólio quando estiver testado e explicado. O uso de LangGraph é opcional até haver demanda real por fluxo de estados; não reconstruir a KORA em outro framework por estética de currículo.

## Leitura técnica priorizada

- [FastAPI — Tutorial](https://fastapi.tiangolo.com/tutorial/) — request/response, validação e testes.
- [LangGraph — documentação](https://docs.langchain.com/oss/python/langgraph/overview) — estado, nós, transições e checkpoints.
- [scikit-learn — métricas de classificação](https://scikit-learn.org/stable/modules/model_evaluation.html#classification-metrics) — validação experimental.
- [OWASP — LLM Top 10](https://genai.owasp.org/llm-top-10/) — riscos de prompt injection e ferramentas.
- [GitHub — About READMEs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes) — documentação legível e reproduzível.
- [freeCodeCamp — Browser verification of coding agents](https://www.freecodecamp.org/news/how-to-make-your-coding-agent-check-its-work-in-the-browser/) — validar comportamento no navegador.

**Critério de parada:** o candidato consegue abrir o link, testar pelo menos um caso real da demo, explicar código/limitações sem esconder o uso de assistência de IA, e os checks de build, JS, browser e privacidade passam. A aprovação na seleção não pode ser garantida por um portfólio.
