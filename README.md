# SAIRU / BLACKSITE

**Software, IA aplicada e sistemas embarcados — com código, decisões técnicas e testes que podem ser inspecionados.**

Portfólio de Urias Machado Santos (Sairu), desenvolvedor com experiência profissional em software, atualmente estudante do Técnico em Eletromecânica no SENAI Bahia. Os laboratórios públicos são estudos e protótipos; não alegam uso em produção ou impacto comercial.

[**Estudo de caso: KORA**](projects/applied-ai/kora/CASE_STUDY.md) · [**Abrir portfólio**](https://saiiru.github.io/) · [**Testar os laboratórios**](https://saiiru.github.io/labs/) · [**Biblioteca de interfaces**](https://saiiru.github.io/components/) · [**Pesquisar repositórios**](https://saiiru.github.io/#todos-projetos)

## O que vale examinar

| Laboratório | Problema e técnica | Evidência disponível |
| --- | --- | --- |
| **[KORA / Rota](https://saiiru.github.io/labs/?lab=rota)** — [estudo de caso](projects/applied-ai/kora/CASE_STUDY.md) | Roteamento de pedidos, contexto limitado, busca híbrida, regras e modelo supervisionado experimental | [Código e documentação](projects/applied-ai/kora/README.md) · benchmark sintético · comparação Python/JavaScript |
| **[Vetor](https://saiiru.github.io/labs/?lab=vetor)** | Classificação de texto com TF-IDF e regressão logística, revisão humana obrigatória | [Treino, model card e testes](projects/applied-ai/vetor/README.md) |
| **[Crivo](https://saiiru.github.io/labs/?lab=crivo)** | Critérios de avaliação, regressões e explicação de falhas | [Código, casos e testes](projects/applied-ai/crivo/README.md) |
| **[Lastro](https://saiiru.github.io/labs/?lab=lastro)** | Busca BM25 em Markdown com referências e recusa quando falta evidência | [Código e benchmark](projects/applied-ai/lastro/README.md) |

Esses estudos são **demos estáticas executadas no navegador**. Usam exemplos sintéticos e código local, sem acesso ao assistente privado, a contas pessoais ou a um serviço de LLM do visitante. ML clássico não equivale a LLM; busca lexical não equivale a compreensão semântica; métricas desses conjuntos não provam desempenho em produção. Veja [resultados](projects/applied-ai/BENCHMARK.md), [experimentos](projects/applied-ai/EXPERIMENT.md) e [limites de segurança](SECURITY.md).

## Projetos independentes

Além dos quatro laboratórios de IA, o site apresenta **12 projetos standalone**: aplicações e APIs, interfaces, fundamentos e exercícios de formação. Eles não dependem da KORA e incluem estágios distintos — desde estudos com código até registros vazios — sempre identificados.

[**Ver os 12 projetos**](https://saiiru.github.io/#projetos-independentes) · [**Ler catálogo e próximos passos**](design/standalone-projects/README.md) · [**Ver testes e disponibilidade**](design/standalone-projects/STATUS_2026-11-12.md)

**Demos verificadas:** [Finance Dashboard](https://saiiru.github.io/react-finance-dashboard/), [Star Wars Planet Explorer](https://saiiru.github.io/starwarsplanets/) e [Portfolio UI Experiments](https://saiiru.github.io/portfolio-ui-experiments/). Todas independentes da KORA; o Finance usa somente dados fictícios no navegador, e o Star Wars depende da SWAPI pública.

## Experiência, estudos e arquitetura

O portfólio preserva o histórico de trabalho em **Capgemini**, **Infomakers** e **Agência Digital S/A** e distingue experiência profissional de laboratório e de conteúdo em aprendizagem. O Toolkit apresenta Java/Spring, JavaScript/TypeScript, front-end, SQL, Linux/Git e os estudos de ML, ESP32 e Eletromecânica sem atribuir senioridade ou qualificações inexistentes.

A divisão é deliberada:

```text
src/                       Interface, layout, interações e conteúdo
src/components/datashards.js   Contratos dos estudos apresentados
src/data/toolkit.js         Habilidades com nível declarado
projects/applied-ai/        Código-fonte, datasets, testes e documentação dos labs
public/labs/                Versão estática dos laboratórios
components/                 Componentes visuais originais
docs/                       Build publicado pelo GitHub Pages
design/                     Decisões, referências, experimentos e capturas
```

A KORA operacional e seus dados pessoais não são publicados aqui. O laboratório Rota explica princípios testáveis sem simular acesso à instalação privada. O portfólio não envia solicitações ao provedor de IA por conta própria.

## Como executar

Requer Node >=20.19 (ambiente validado anteriormente com Node 24.14) e Python para os scripts de avaliação e browser.

```bash
npm ci
npm run dev

# Produção e verificações locais
npm run build
npm run check:build
npm run check:components
npm test
python scripts/test_genai_portfolio.py
```

Para validar no navegador, abra o build estático e configure o endereço do servidor:

```bash
python3 -m http.server 4392 --directory docs --bind 127.0.0.1
BASE_URL=http://127.0.0.1:4392 python3 scripts/e2e_hardening.py
BASE_URL=http://127.0.0.1:4392 python3 scripts/e2e_recon.py
BASE_URL=http://127.0.0.1:4392 python3 scripts/e2e_datashards.py
BASE_URL=http://127.0.0.1:4392 python3 scripts/e2e_genai_portfolio.py
BASE_URL=http://127.0.0.1:4392 python3 scripts/e2e_standalone_projects.py
```

Os testes de navegador precisam de Playwright Python e Chromium. Consulte [scripts/README.md](scripts/README.md). Não alegamos auditoria independente, nota de Lighthouse ou certificação formal.

## Direção visual — BLACKSITE / Night City

A paleta recebida como referência foi transformada em um sistema de cores por função, não aplicada como seis néons simultâneos:

| Papel | Cor |
| --- | --- |
| Deep Void — superfície principal | `#050505` |
| Cyber Yellow — assinatura e destaque editorial | `#F3E600` |
| Bionic Cyan — interação e foco técnico | `#00E5FF` |
| Hot Pink — sinal complementar e glitch | `#FF2DAA` |
| Netrunner Blade — áreas instrumentais profundas | `#0313A6` |
| Night City Red — falha / alerta (não texto comum) | `#C5003C` |

Os brilhos são pontuais. A prioridade é **legibilidade, navegação por teclado, provas de engenharia e movimento limitado**. O glitch do nome reage ao ponteiro; o conteúdo essencial continua legível sem animações. A renderização WebGL do contato é carregada sob demanda, tem fallback estático e respeita `prefers-reduced-motion`.

[Leia o racional do redesign e pesquisa do GenAI iFood](design/2026-11-11-ifood-genai-portfolio.md) · [Design system e decisões técnicas](DESIGN.md)

## Licenças e fontes

A marca SAIRU, os componentes SVG e os shaders do portfólio são originais. Oxanium está sob OFL; Nothing Portfolio, de Ankit Shrestha, serviu como referência com licença MIT; fragmentos CSS de Cybercore são atribuídos conforme [licenças e pesquisa](design/contextual-signals/RESEARCH.md). A identidade da imagem de referência foi estudada como paleta; não foram copiados assets comerciais de Cyberpunk 2077.

O código e as fontes estão disponíveis para inspeção. Não confunda protótipo, repositório estudado (fork), trabalho profissional e sistema em produção.
