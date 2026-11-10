# Artigos freeCodeCamp: aplicação no portfólio e no KORA

Revisão feita em 9 de novembro de 2026. Os artigos são referências de estudo; citá-los ou usá-los como base não significa que o trabalho do tutorial foi implementado aqui.

## O que aplicar agora

| Artigo | Decisão | Aplicação neste repositório |
| --- | --- | --- |
| [How to Make Your Coding Agent Check Its Work in the Browser](https://www.freecodecamp.org/news/how-to-make-your-coding-agent-check-its-work-in-the-browser/) | Aplicar | Depois de editar a interface, abrir o site real no navegador, operar os controles, conferir estados visuais e erros do console. O repositório já tem suites Playwright; este artigo reforça que testes de código não substituem revisão da UI. |
| [The Ultimate Web Developer Job Search Handbook](https://www.freecodecamp.org/news/the-ultimate-web-developer-job-search-handbook/) | Aplicar ao conteúdo | Manter uma direção profissional clara e ligar cada afirmação a uma prova navegável: demo, código, README, teste ou resultado. Não importar dicas de carreira para dentro de um projeto de software. |
| [The Front-End Performance Optimization Handbook](https://www.freecodecamp.org/news/the-front-end-performance-optimization-handbook/) | Aplicar com medição | Manter orçamento de bundle, imagens leves e efeitos adiados. Decidir por medições deste site, não seguir recomendações antigas de forma automática. Não alegar velocidade percebida sem uma medição atual. |
| [How to Structure Your README File](https://www.freecodecamp.org/news/how-to-structure-your-readme-file/) | Aplicar | Cada projeto precisa começar por problema e demonstração, depois comandos, estrutura, arquitetura, testes, limitações e licença. No site, a sequência equivalente é problema → implementação → evidência. |
| [Learn Model Context Protocol Security](https://www.freecodecamp.org/news/learn-model-context-protocol-mcp-security/) | Aplicar ao desenho futuro do KORA | Revisar descoberta de servidores, permissões mínimas, identidade, aprovação, registro e monitoramento antes de ativar novas ferramentas. O artigo resume um curso; não é um parecer de segurança nem prova de conformidade. |
| [How to Build a Personal Web Research AI Agent with Ollama and Qwen](https://www.freecodecamp.org/news/build-a-personal-ai-web-research-agent-with-ollama-and-qwen/) | Bom próximo estudo para KORA | Um agente local poderia pesquisar fontes públicas, guardar URLs e produzir um rascunho em Markdown. Antes disso: decidir se a busca usa API externa, evitar enviar contexto privado, filtrar páginas e manter citações verificáveis. Não está implementado nem conectado ao KORA. |
| [How to Build and Schedule Local AI Assistants for Daily Tasks](https://www.freecodecamp.org/news/how-to-build-and-schedule-local-ai-assistants-for-daily-tasks/) | Ideia futura, com limites | Para uma automação local recorrente, começar por tarefas somente de leitura, saída com data e botão/etapa de aprovação. Este tutorial inclui buscas hospedadas que exigem chave; portanto, “local” não garante que todo o fluxo seja offline. Nenhum agendador novo foi configurado. |
| [How to Build a Real-Time Intrusion Detection System with Python](https://www.freecodecamp.org/news/build-a-real-time-intrusion-detection-system-with-python/) | Não adicionar agora | É um projeto defensivo separado, centrado em captura e análise de pacotes. Pode virar um estudo de segurança com ambiente isolado e tráfego sintético, mas diluiria o foco atual de IA aplicada e KORA. |
| [Cryptography for Beginners](https://www.freecodecamp.org/news/cryptography-for-beginners-full-python-course-sha-256-aes-rsa-passwords/) | Não adicionar agora | Curso separado de criptografia. Serve como estudo futuro para integridade de artefatos e armazenamento de credenciais; não justifica criar um projeto de criptografia sem necessidade de produto. |

## Próxima ideia para o Vetor: Rota para KORA

O problema do Vetor atual é real no domínio de chamados, mas conversa pouco com o trabalho que queremos demonstrar no KORA. A próxima versão pode virar um **roteador de domínio e skills**, baseado no fluxo já documentado no KORA: observar → classificar → propor → aprovar quando necessário → executar ação delimitada → verificar → registrar.

A proposta está em [luka-routebench-brief.md](luka-routebench-brief.md). Ela é um plano de estudo, não uma integração implementada. O KORA staging informa que Pi ainda não está integrado; preservar esse limite evita apresentar um protótipo como melhoria já conectada ao assistente.
