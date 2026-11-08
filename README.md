<p align="center">
  <img src="assets/blacksite-readme.svg" width="100%" alt="SAIRU BLACKSITE — software, sistemas e experimentos com IA" />
</p>

<p align="center">
  <a href="#primeiro-acesso">Começar</a> · <a href="#projetos-que-dá-para-testar">Demos</a> ·
  <a href="PROJECT_INDEX.md">Todos os projetos</a> · <a href="#arquitetura">Arquitetura</a> ·
  <a href="#testes">Testes</a> · <a href="DESIGN_REFERENCES.md">Referências</a>
</p>

## O que é este lugar?

Sou **Urias Machado Santos (Sairu)**. Trabalhei com desenvolvimento web na Capgemini, Infomakers e Agência Digital S/A. Hoje estudo Eletromecânica no SENAI e continuo construindo software — muitas vezes na fronteira entre interfaces, ferramentas e eletrônica.

O BLACKSITE não é uma simulação de uma empresa fictícia. É **um arquivo pessoal de engenharia**: alguns projetos estão prontos para experimentar, outros são estudos e alguns mostram perguntas que ainda estou tentando resolver. Prefiro deixar essa diferença clara.

O visual nasceu da minha configuração Arch Linux/CyberArch. A interface também é um experimento, mas o principal é conseguir abrir cada projeto, entender as decisões e reproduzir o que foi testado.

> **Versão redesenhada em revisão:** o GitHub Pages público pode continuar exibindo uma versão anterior até o merge. Os screenshots e a revisão estão na pull request desta versão.

## Primeiro acesso

```bash
git clone https://github.com/Saiiru/saiiru.github.io.git
cd saiiru.github.io
npm ci
npm run dev
```

O Vite mostrará o endereço local de desenvolvimento. Para gerar e servir a versão estática:

```bash
npm run build
cd docs
python3 -m http.server 4389 --bind 127.0.0.1
```

Abra http://127.0.0.1:4389.

## Projetos que dá para testar

| Datashard | Problema | Implementação real |
| :--- | :--- | :--- |
| **01 · EvalForge** | Como comparar respostas antes de confiar nelas? | Critérios explícitos, seis casos sintéticos, falhas explicadas e relatório JSON. |
| **02 · OpsPilot** | Como classificar solicitações sem automatizar decisões humanas? | Roteamento de chamados fictícios e aprovação obrigatória antes da exportação. |
| **03 · DocTrace** | Como responder a partir de documentos e permitir conferência? | Recuperação BM25 em Markdown, citações por passagem e abstenção sem evidência. |

O modo padrão é **determinístico e offline**, não uma inferência de LLM escondida atrás de regras. Existe um proxy local opcional para modelos compatíveis com OpenAI. O GitHub Pages não o hospeda nem recebe credenciais.

O fluxo n8n do OpsPilot é um **exemplo, não uma automação implantada**. Resultados como 6/6 ou 12/12 referem-se a conjuntos fictícios e testes preparados, não impacto comprovado em empresas.

[Ver a documentação, o código e os testes das três demos](projects/ai-builder-labs/README.md).

## Arquivo completo

Em vez de esconder trabalhos antigos ou chamar todos de produtos concluídos, mantive uma lista pesquisável que diferencia código próprio e forks.

**[Índice dos 62 repositórios públicos](PROJECT_INDEX.md)** — 28 próprios e 34 forks/referências, na data da captura da API pública.

Para atualizar a lista localmente:

```bash
python3 scripts/refresh_repos.py
npm run build
```

O script consulta **somente repositórios públicos** pela API GitHub via `gh`. Um novo projeto só aparecerá após atualização do arquivo e um novo build.

## Arquitetura

```text
React / Vite (portfólio)
 ├── SAIRU SVG: glitch contextual ao passar o ponteiro
 ├── Fundo com resposta ao cursor e movimento reduzido
 ├── Datashards: problema → trade-off → testes → demo
 ├── Catálogo: 62 repositórios públicos em JSON estático
 └── Laboratórios HTML/JavaScript (/labs)
      ├── EvalForge → asserções determinísticas
      ├── OpsPilot  → triagem + aprovação humana
      └── DocTrace  → BM25 e referências por documento

Node.js local (opcional)
 └── Proxy compatível com OpenAI, segredo apenas no servidor
```

O catálogo estático não depende da disponibilidade da API GitHub durante a visita. O trade-off é precisar atualizar o snapshot para incluir novas atividades.

## Testes

```bash
cd projects/ai-builder-labs
npm test
node scripts/verify.mjs
node scripts/smoke-proxy.mjs
```

Os laboratórios incluem **16 testes unitários** em Node. O site também foi verificado no Chromium/Playwright: datashards, busca dos projetos, glitch repetido, exportação com revisão humana, navegação mobile e `prefers-reduced-motion`.

Veja o [benchmark de dados sintéticos](projects/ai-builder-labs/BENCHMARK.md). A suíte de navegador utilizada nesta revisão fica em `scripts/verify_human.py`.

## Decisões que importam

<details>
<summary><strong>Por que não buscar projetos diretamente da API a cada visita?</strong></summary>
O arquivo é gerado na preparação do site, não carregado na página. Assim o visitante vê os projetos mesmo durante falhas de rede ou limites da API. Em troca, atualizações exigem novo build.
</details>

<details>
<summary><strong>Por que o glitch não tem botão?</strong></summary>
O efeito aparece na entrada do site e a cada nova passagem do mouse sobre SAIRU; os datashards e o fundo também respondem ao ponteiro. Nada depende de ativar um modo especial. Se o sistema pedir movimento reduzido, as animações são desativadas.
</details>

<details>
<summary><strong>O que ainda não considero validado?</strong></summary>
Métricas de negócio, uso comercial dos protótipos e integrações de IA implantadas em produção. O laboratório oferece dados de exemplo, fluxos inspecionáveis e testes reproduzíveis — não resultados de clientes.
</details>

## Design, créditos e licença

A base foi o [Nothing Portfolio de Ankit Shrestha](https://github.com/ankitshrr/nothing-portfolio), sob licença MIT, preservada em [LICENSE](LICENSE). O visual é uma adaptação original da identidade CyberArch/BLACKSITE. [Cyber Grotesk](https://www.behance.net/gallery/85843953/Cyber-Grotesk) e [Cybersecurity Portfolio](https://dribbble.com/shots/27431322-Cybersecurity-Portfolio-Website-UI-UX-Design) foram referências de arte; nenhuma fonte comercial ou imagem desses trabalhos foi redistribuída.

Para referências adicionais, veja [DESIGN_REFERENCES.md](DESIGN_REFERENCES.md).

---

**[GitHub](https://github.com/Saiiru)** · **[LinkedIn](https://www.linkedin.com/in/sairu/)** · **[Contato](https://www.linkedin.com/in/sairu/)**

<sub>Feira de Santana, BA. Feito com código que eu consigo abrir, testar e explicar.</sub>
