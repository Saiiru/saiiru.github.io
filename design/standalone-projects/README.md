# Projetos independentes — guia de leitura

**Atualização:** 12/11/2026 · **Estado:** 12 repositórios documentados, nove renomeados e três slugs preservados.

Este guia acompanha [Código. Com contexto.](https://saiiru.github.io/#projetos-independentes) no site original. Os projetos são **standalone**, sem dependências da KORA. O código, a autoria e os históricos existentes foram preservados; esta curadoria não comprova execução dos aplicativos antigos.

## Migração dos nomes e endereços

| Nome anterior | Repositório atual | Nome público | Motivo |
| --- | --- | --- | --- |
| `Plann.er` | [travel-planner-api](https://github.com/Saiiru/travel-planner-api) | Travel Planner API | Nome atualizado no GitHub, histórico preservado. |
| `ada-commerce` | [java-order-management-cli](https://github.com/Saiiru/java-order-management-cli) | Order Management CLI | Nome atualizado no GitHub, histórico preservado. |
| `AngularFrontEndMasters` | [AngularFrontEndMasters](https://github.com/Saiiru/AngularFrontEndMasters) | Angular Component Lab | Slug mantido para proteger a URL da demonstração no GitHub Pages. |
| `dtmoney` | [react-finance-dashboard](https://github.com/Saiiru/react-finance-dashboard) | Finance Dashboard | Nome atualizado no GitHub, histórico preservado. |
| `starwarsplanets` | [starwarsplanets](https://github.com/Saiiru/starwarsplanets) | Star Wars Planet Explorer | Slug mantido para proteger a URL da demonstração no GitHub Pages. |
| `minimal-portfolio` | [portfolio-ui-experiments](https://github.com/Saiiru/portfolio-ui-experiments) | Portfolio UI Experiments | Nome atualizado no GitHub, histórico preservado. |
| `DesafioPooDio` | [java-oop-bootcamp](https://github.com/Saiiru/java-oop-bootcamp) | Java Bootcamp Domain | Nome atualizado no GitHub, histórico preservado. |
| `dio-trilha-basico` | [java-algorithms-labs](https://github.com/Saiiru/java-algorithms-labs) | Java Fundamentals Lab | Nome atualizado no GitHub, histórico preservado. |
| `sofi-test` | [ruby-prefix-grouping](https://github.com/Saiiru/ruby-prefix-grouping) | Prefix Grouping Challenge | Nome atualizado no GitHub, histórico preservado. |
| `dio-angular-develloper` | [git-github-foundations](https://github.com/Saiiru/git-github-foundations) | Git Foundations | Nome atualizado no GitHub, histórico preservado. |
| `skills-copilot-codespaces-vscode` | [skills-copilot-codespaces-vscode](https://github.com/Saiiru/skills-copilot-codespaces-vscode) | Codespaces Workflow Lab | Slug mantido para preservar exercícios e workflows do GitHub Skills. |
| `IgniteLab` | [ignite-lab-archive](https://github.com/Saiiru/ignite-lab-archive) | Ignite Lab Archive | Nome atualizado no GitHub, histórico preservado. |

**Observação:** os links de demonstrações antigas de Angular e Star Wars não foram migrados; os nomes editoriais mudaram, mas o repo preserva a URL original.

## Catálogo e melhorias

### Aplicações e APIs

Regras de negócio, persistência e fluxos locais.

#### [Travel Planner API](https://github.com/Saiiru/travel-planner-api)

**Antes:** `Plann.er` · **Estado:** API de estudo · 23 testes + Docker · **Stack:** TypeScript, Fastify, SQLite.

**Finalidade:** API independente para planejar viagens em grupo, confirmar participantes e organizar atividades, convites e links em um único itinerário.

**Resumo:** Planejamento de viagens, atividades e participantes por API.

**Próximo teste:** Docker com volume persistiu viagem após reinício; publicar exige autenticação e banco gerenciado. Tutorial em docs/LOCAL_DEPLOY_AND_STUDY.md.

[Ler documentação técnica original](https://github.com/Saiiru/travel-planner-api/blob/main/docs/PROJECT_BRIEF.md)

#### [Order Management CLI](https://github.com/Saiiru/java-order-management-cli)

**Antes:** `ada-commerce` · **Estado:** Projeto em equipe · CLI testado · **Stack:** Java 17, CLI, Testes.

**Finalidade:** Simulador educacional de comércio no terminal: cadastro de clientes, produtos, estoque, pedidos e etapas de pagamento e entrega com dados em memória.

**Resumo:** Um fluxo educacional de pedidos, estoque e etapas de entrega.

**Próximo teste:** Fluxo de pedido entregue validado localmente; documentar contribuição individual e persistência futura.

[Ler documentação técnica original](https://github.com/Saiiru/java-order-management-cli/blob/main/docs/PROJECT_BRIEF.md)

### Interfaces e produto

Experimentos visuais e construção de experiências web.

#### [Angular Component Lab](https://github.com/Saiiru/AngularFrontEndMasters)

**Antes:** `AngularFrontEndMasters` · **Estado:** Angular 8 · funcional, legado · **Stack:** Angular 8, TypeScript.

**Finalidade:** Aplicação de aprendizagem para praticar arquitetura de componentes, telas e interações em Angular ao longo de uma trilha Frontend Masters.

**Resumo:** Angular 8: jogos locais e consulta pública a 60 planetas e 36 naves.

**Próximo teste:** CRUD local e SWAPI validados em celular e desktop; próxima etapa é migrar Angular 8 e dependências obsoletas.

[Ler documentação técnica original](https://github.com/Saiiru/AngularFrontEndMasters/blob/main/docs/PROJECT_BRIEF.md)

[Abrir demonstração funcional](https://saiiru.github.io/AngularFrontEndMasters/)

#### [Finance Dashboard](https://github.com/Saiiru/react-finance-dashboard)

**Antes:** `dtmoney` · **Estado:** Estudo React · **Stack:** React, TypeScript.

**Finalidade:** Interface de aprendizagem para visualizar transações, entradas, saídas e um resumo financeiro, desenvolvida a partir de uma trilha React.

**Resumo:** Dashboard com transações fictícias e saldo local, persistidos no navegador.

**Próximo teste:** Vite, valores em centavos, testes e persistência verificados. Futuro: ampliar testes de componentes.

[Ler documentação técnica original](https://github.com/Saiiru/react-finance-dashboard/blob/main/docs/PROJECT_BRIEF.md)

[Abrir demonstração funcional](https://saiiru.github.io/react-finance-dashboard/)

#### [Star Wars Planet Explorer](https://github.com/Saiiru/starwarsplanets)

**Antes:** `starwarsplanets` · **Estado:** Estudo React · **Stack:** React, Redux, JavaScript.

**Finalidade:** Catálogo de planetas com interface de listagem e busca, usado para exercitar React, gerenciamento de estado e consumo de informações.

**Resumo:** Busque 60 planetas da SWAPI, com paginação e tratamento de falhas.

**Próximo teste:** SWAPI real retornou 60 planetas e três testes de API passaram. Futuro: imagens locais.

[Ler documentação técnica original](https://github.com/Saiiru/starwarsplanets/blob/main/docs/PROJECT_BRIEF.md)

[Abrir demonstração funcional](https://saiiru.github.io/starwarsplanets/)

#### [Portfolio UI Experiments](https://github.com/Saiiru/portfolio-ui-experiments)

**Antes:** `minimal-portfolio` · **Estado:** Portfólio anterior · publicado · **Stack:** React, Vite, TypeScript.

**Finalidade:** Versão anterior de uma apresentação pessoal, usada para experimentar componentes, timeline e layout de projetos antes do BLACKSITE.

**Resumo:** Estudos de interface anteriores à identidade BLACKSITE.

**Próximo teste:** Build, lint e links reais verificados. Continua estudo histórico; o BLACKSITE é a vitrine principal.

[Ler documentação técnica original](https://github.com/Saiiru/portfolio-ui-experiments/blob/main/docs/PROJECT_BRIEF.md)

[Abrir demonstração funcional](https://saiiru.github.io/portfolio-ui-experiments/)

### Fundamentos de programação

Exercícios de linguagem, modelagem e algoritmos.

#### [Java Bootcamp Domain](https://github.com/Saiiru/java-oop-bootcamp)

**Antes:** `DesafioPooDio` · **Estado:** Exercício · **Stack:** Java, POO.

**Finalidade:** Modelo didático de bootcamp, cursos e desenvolvedores para exercitar herança, abstração, encapsulamento e comportamento entre entidades.

**Resumo:** Prática de herança, abstração e progressão de cursos.

**Próximo teste:** HashSet e progressão testados; futuro: ampliar casos de borda e erro.

[Ler documentação técnica original](https://github.com/Saiiru/java-oop-bootcamp/blob/main/docs/PROJECT_BRIEF.md)

#### [Java Fundamentals Lab](https://github.com/Saiiru/java-algorithms-labs)

**Antes:** `dio-trilha-basico` · **Estado:** Coleção de exercícios · **Stack:** Java, Lógica.

**Finalidade:** Conjunto de pequenos desafios de lógica Java, incluindo validação de dados, simulações bancárias e estruturas condicionais.

**Resumo:** Exercícios de lógica, validação e algoritmos básicos.

**Próximo teste:** Cinco testes CLI passaram; ampliar para os demais exercícios do catálogo.

[Ler documentação técnica original](https://github.com/Saiiru/java-algorithms-labs/blob/main/docs/PROJECT_BRIEF.md)

#### [Prefix Grouping Challenge](https://github.com/Saiiru/ruby-prefix-grouping)

**Antes:** `sofi-test` · **Estado:** Solução implementada e testada · **Stack:** Ruby.

**Finalidade:** Implementação do método group_by_prefix para agrupar palavras por prefixos comuns, com verificações de entrada e testes existentes executados.

**Resumo:** Agrupamento por prefixo Ruby: solução implementada e testes executados.

**Próximo teste:** Testes Ruby passaram. Próximo: Unicode normalizado e um runner de testes dedicado.

[Ler documentação técnica original](https://github.com/Saiiru/ruby-prefix-grouping/blob/main/docs/PROJECT_BRIEF.md)

### Trilhas e registros

Aprendizado documentado, inclusive trabalhos ainda incompletos.

#### [Git Foundations](https://github.com/Saiiru/git-github-foundations)

**Antes:** `dio-angular-develloper` · **Estado:** Registro de curso · **Stack:** Git, GitHub.

**Finalidade:** Repositório pequeno de exercício sobre Git e GitHub, associado a uma trilha de formação Angular; não contém uma aplicação Angular identificada.

**Resumo:** Primeiro laboratório de versionamento e GitHub.

**Próximo teste:** Descrever o aprendizado e o histórico do exercício sem apresentar o repositório como frontend funcional.

[Ler documentação técnica original](https://github.com/Saiiru/git-github-foundations/blob/main/docs/PROJECT_BRIEF.md)

#### [Codespaces Workflow Lab](https://github.com/Saiiru/skills-copilot-codespaces-vscode)

**Antes:** `skills-copilot-codespaces-vscode` · **Estado:** Exercício guiado · **Stack:** GitHub, Codespaces, VS Code.

**Finalidade:** Repositório de atividade guiada para conhecer fluxos de desenvolvimento no GitHub, Codespaces e VS Code, com estrutura de curso automatizada.

**Resumo:** Treinamento guiado de GitHub Skills e Codespaces.

**Próximo teste:** Explicitar a origem do template, indicar quais etapas foram concluídas e separar aprendizado de implementação autoral.

[Ler documentação técnica original](https://github.com/Saiiru/skills-copilot-codespaces-vscode/blob/main/docs/PROJECT_BRIEF.md)

#### [Ignite Lab Archive](https://github.com/Saiiru/ignite-lab-archive)

**Antes:** `IgniteLab` · **Estado:** Repositório vazio / sem código · **Stack:** GitHub, Registro.

**Finalidade:** Espaço reservado para um estudo de interface e eventos; a árvore pública está vazia, portanto ainda não existe uma implementação demonstrável.

**Resumo:** Registro histórico sem implementação de aplicação.

**Próximo teste:** Manter como registro histórico ou adicionar um escopo e código verificáveis antes de anunciar qualquer aplicação.

[Ler documentação técnica original](https://github.com/Saiiru/ignite-lab-archive/blob/main/docs/PROJECT_BRIEF.md)

## Critério para promover um projeto à vitrine principal

1. README com objetivo, origem, autoria e passo de reprodução verificado.
2. Um fluxo funcional e pelo menos um teste que cubra erro ou entrada inválida.
3. Nenhuma credencial nem dado pessoal exposto. Use dados sintéticos.
4. Evidência visual/CLI/log com resultado real e limitações explícitas.
5. CI marcado como aprovado apenas depois de execução; billing lock não é teste falho.

## Validação do portfólio

```bash
npm test
npm run build
npm run check:build
BASE_URL=http://127.0.0.1:4396 python scripts/e2e_standalone_projects.py
```

O catálogo web usa src/data/standalone-projects.js como fonte de nomes, URLs e escopo. A busca em PublicArchive também reconhece os nomes históricos.

**Estado atualizado:** reparos de código e testes executados em Finance Dashboard, Star Wars Explorer, Portfolio UI Experiments, Java Algorithms e Java OOP. Travel Planner API passou em 22 testes; Order Management CLI validou o ciclo de pedido. Três demos React estão no GitHub Pages. Repositórios puramente didáticos não foram transformados artificialmente em apps. O CI remoto pode continuar bloqueado por cobrança.
