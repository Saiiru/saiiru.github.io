# Projetos independentes — catálogo público

Atualização: 11/11/2026. Estes repositórios são **autônomos**: não são módulos da KORA, LUKA ou dos laboratórios de IA.

Esta etapa documenta finalidade, tecnologias, estado e próxima melhoria. O código-fonte dos doze repositórios **não foi alterado**, e o catálogo não os anuncia como sistemas de produção.

## Finalidades e estado atual

### Aplicações e APIs

Regras de negócio, persistência e fluxos locais.

#### [Plann.er — organização de viagens](https://github.com/Saiiru/Plann.er)

**Repositório:** Plann.er · **Estado:** API de estudo · **Stack:** TypeScript, Fastify, SQLite

**O que faz:** API independente para planejar viagens em grupo, confirmar participantes e organizar atividades, convites e links em um único itinerário.

**Próxima melhoria:** Acrescentar CI e documentação interativa da API; não apresentar como aplicativo com frontend ou autenticação.

#### [Ada Commerce — fluxo de pedidos](https://github.com/Saiiru/ada-commerce)

**Repositório:** ada-commerce · **Estado:** Projeto em equipe · **Stack:** Java 17, CLI, Testes

**O que faz:** Simulador educacional de comércio no terminal: cadastro de clientes, produtos, estoque, pedidos e etapas de pagamento e entrega com dados em memória.

**Próxima melhoria:** Explicar contribuições individuais, demonstrar um pedido de ponta a ponta e publicar os limites do pagamento simulado.

### Interfaces e produto

Experimentos visuais e construção de experiências web.

#### [Angular — laboratório de componentes](https://github.com/Saiiru/AngularFrontEndMasters)

**Repositório:** AngularFrontEndMasters · **Estado:** Legado de curso · **Stack:** Angular 8, TypeScript

**O que faz:** Aplicação de aprendizagem para praticar arquitetura de componentes, telas e interações em Angular ao longo de uma trilha Frontend Masters.

**Próxima melhoria:** Documentar as telas que ainda funcionam, preservar contexto da versão 8 e separar exercícios históricos de uma eventual migração.

#### [dt money — controle financeiro visual](https://github.com/Saiiru/dtmoney)

**Repositório:** dtmoney · **Estado:** Estudo React · **Stack:** React, TypeScript

**O que faz:** Interface de aprendizagem para visualizar transações, entradas, saídas e um resumo financeiro, desenvolvida a partir de uma trilha React.

**Próxima melhoria:** Testar os cálculos, os estados vazios e o formulário; identificar o escopo do curso sem prometer integração bancária.

#### [Star Wars — explorador de planetas](https://github.com/Saiiru/starwarsplanets)

**Repositório:** starwarsplanets · **Estado:** Estudo React · **Stack:** React, Redux, JavaScript

**O que faz:** Catálogo de planetas com interface de listagem e busca, usado para exercitar React, gerenciamento de estado e consumo de informações.

**Próxima melhoria:** Verificar a fonte dos dados, adicionar testes de busca e tratar carregamento e falhas antes de destacar uma demo.

#### [Minimal Portfolio — estudo de apresentação](https://github.com/Saiiru/minimal-portfolio)

**Repositório:** minimal-portfolio · **Estado:** Portfólio anterior · **Stack:** React, Vite, TypeScript

**O que faz:** Versão anterior de uma apresentação pessoal, usada para experimentar componentes, timeline e layout de projetos antes do BLACKSITE.

**Próxima melhoria:** Identificar o projeto como histórico, atualizar o README padrão de Vite e apontar para o portfólio atual.

### Fundamentos de programação

Exercícios de linguagem, modelagem e algoritmos.

#### [Bootcamp — fundamentos de orientação a objetos](https://github.com/Saiiru/DesafioPooDio)

**Repositório:** DesafioPooDio · **Estado:** Exercício · **Stack:** Java, POO

**O que faz:** Modelo didático de bootcamp, cursos e desenvolvedores para exercitar herança, abstração, encapsulamento e comportamento entre entidades.

**Próxima melhoria:** Criar um README de execução e testes de matrícula, progressão e conclusão de conteúdo.

#### [Java básico — problemas e algoritmos](https://github.com/Saiiru/dio-trilha-basico)

**Repositório:** dio-trilha-basico · **Estado:** Coleção de exercícios · **Stack:** Java, Lógica

**O que faz:** Conjunto de pequenos desafios de lógica Java, incluindo validação de dados, simulações bancárias e estruturas condicionais.

**Próxima melhoria:** Organizar um índice dos desafios, documentar entrada e saída e adicionar testes para valores de fronteira.

#### [Ruby — agrupamento por prefixos](https://github.com/Saiiru/sofi-test)

**Repositório:** sofi-test · **Estado:** Desafio documentado · **Stack:** Ruby

**O que faz:** Enunciado de um desafio para agrupar palavras por prefixo comum de comprimento definido; o código da solução não foi identificado no repositório.

**Próxima melhoria:** Implementar a solução com testes de prefixos, entradas vazias e Unicode; até lá, identificar como enunciado.

### Trilhas e registros

Aprendizado documentado, inclusive trabalhos ainda incompletos.

#### [Git e GitHub — exercício inicial](https://github.com/Saiiru/dio-angular-develloper)

**Repositório:** dio-angular-develloper · **Estado:** Registro de curso · **Stack:** Git, GitHub

**O que faz:** Repositório pequeno de exercício sobre Git e GitHub, associado a uma trilha de formação Angular; não contém uma aplicação Angular identificada.

**Próxima melhoria:** Descrever o aprendizado e o histórico do exercício sem apresentar o repositório como frontend funcional.

#### [GitHub Skills — Codespaces e VS Code](https://github.com/Saiiru/skills-copilot-codespaces-vscode)

**Repositório:** skills-copilot-codespaces-vscode · **Estado:** Exercício guiado · **Stack:** GitHub, Codespaces, VS Code

**O que faz:** Repositório de atividade guiada para conhecer fluxos de desenvolvimento no GitHub, Codespaces e VS Code, com estrutura de curso automatizada.

**Próxima melhoria:** Explicitar a origem do template, indicar quais etapas foram concluídas e separar aprendizado de implementação autoral.

#### [Ignite Lab — registro de participação](https://github.com/Saiiru/IgniteLab)

**Repositório:** IgniteLab · **Estado:** Repositório vazio / sem código · **Stack:** GitHub, Registro

**O que faz:** Espaço reservado para um estudo de interface e eventos; a árvore pública está vazia, portanto ainda não existe uma implementação demonstrável.

**Próxima melhoria:** Manter como registro histórico ou adicionar um escopo e código verificáveis antes de anunciar qualquer aplicação.

## Critério antes de promover qualquer projeto

1. README: problema, autoria, escopo, setup e limites reais.
2. Uma funcionalidade reproduzível, ou identificação honesta como exercício/enunciado/registro vazio.
3. Teste representativo e CI quando GitHub Actions estiver operacional.
4. Dados sintéticos e nenhuma credencial em repositório público.
5. Uma melhoria pequena e comprovada por vez, sem refazer toda a arquitetura.

## Como a vitrine funciona

A fonte editorial é src/data/standalone-projects.js; a interface é StandaloneProjects.jsx; o carregamento é sob demanda. O arquivo completo permite buscar Plann.er e Ada Commerce sem filtro oculto.

Validação: npm test; npm run build; npm run check:build; scripts/e2e_standalone_projects.py.

**Próxima fase:** escolher quais desses sistemas merecem refatoração individual após revisar o portfólio e as vagas-alvo. Nenhum deles depende da KORA.
