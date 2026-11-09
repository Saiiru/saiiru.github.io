# SAIRU / BLACKSITE

Site pessoal de Urias Machado Santos: software, sistemas embarcados e formação técnica em Eletromecânica.

- [Site publicado](https://saiiru.github.io/)
- [Biblioteca interativa de interfaces](https://saiiru.github.io/components/) · [Código e reuso](components/README.md)
- [Perfil GitHub](https://github.com/Saiiru)
- [Mapa do workspace](WORKSPACE.md)
- [Decisões visuais](DESIGN.md) · [Pesquisa e medições](design/quality/RESEARCH.md) · [Segurança e limites](SECURITY.md)

## Interface atual

O Toolkit contém tecnologias e conhecimentos, com distinção entre experiência profissional, prática de bancada e conteúdos em estudo. O arquivo lista repositórios existentes e identifica forks. Novos projetos só entram na vitrine depois de construídos e validados pelo autor.

Os repositórios Ada Commerce e Plann.er receberam revisão funcional: [CLI Java](https://github.com/Saiiru/ada-commerce) e [API TypeScript](https://github.com/Saiiru/Plann.er). Os READMEs explicam como executar e o escopo educacional de cada um. O Plann.er não inclui frontend nem autenticação.

## Desenvolvimento

Node >=20.19; verificado com Node 24.14.0.

    npm ci
    npm run dev

Edite src/ e public/. npm run build gera docs/, publicado pelo GitHub Pages a partir de main/docs. O wrapper de build força produção no processo, mesmo se o ambiente do terminal estiver definido como development. Não edite bundles em docs/assets/.

## Verificação

    npm run build
    npm run check:build
    npm run check:components
    npm audit
    python3 -m http.server 4392 --directory docs --bind 127.0.0.1

Em outro terminal, com Python/Playwright e Chromium disponíveis:

    python3 scripts/e2e_toolkit.py
    python3 scripts/e2e_recon.py
    python3 scripts/e2e_hardening.py
    python3 scripts/e2e_motion_budget.py
    python3 scripts/e2e_components.py

Veja [scripts/README.md](scripts/README.md) para os pré-requisitos e limites. Não há um score de Lighthouse ou certificação de segurança alegado.

## Identidade e movimento

Mint, coral e carvão mantêm a identidade cyberpunk. Glitches curtos respondem à entrada e ao ponteiro; o conteúdo permanece legível. A faixa tipográfica pausa fora da tela. O campo fluido do contato carrega perto da seção e pausa fora da tela ou com a aba oculta. A preferência do sistema por movimento reduzido é respeitada; falhas de WebGL usam fundo estático.

- Tecnologias: src/data/toolkit.js e src/components/Toolkit.jsx
- Inventário: src/data/repositories.json
- Contexto revisado dos projetos: src/data/repository-notes.json
- Identidade: src/recon-identity.css, src/useCyberMotion.js
- Fundo: src/components/DeferredSignalField.jsx e SignalField.jsx

## Referências e licenças

Nothing Portfolio de Ankit Shrestha mantém o aviso MIT em LICENSE. Oxanium é distribuída sob OFL. As adaptações MIT de CSS do Cybercore estão documentadas em design/contextual-signals/ e public/licenses/; nenhum pacote Cybercore foi instalado. A pesquisa atual distingue inspiração visual de código copiado.

## Biblioteca CyberArch Web

24 componentes originais de HTML/CSS/JS em components/, com nove estudos CRT e mapa de 30 famílias visuais/142 arquivos de referência. A galeria é uma entrada separada do build. Só o feedback finito de moldura é compartilhado com os links do arquivo e contato. APIs nativas e shaders Slang não foram convertidos em serviços de navegador: veja os limites e a pesquisa em components/README.md.
