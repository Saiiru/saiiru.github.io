# SAIRU / BLACKSITE

Site pessoal de Urias Machado Santos, com experiência em software, formação técnica e tecnologias em estudo.

- [Site publicado](https://saiiru.github.io/)
- [Perfil GitHub](https://github.com/Saiiru)
- [Mapa do workspace](WORKSPACE.md)

## Interface atual

O Toolkit apresenta tecnologias e conhecimentos, separados em software, sistemas embarcados e Eletromecânica/controle. Experiência profissional, prática de bancada e conteúdos planejados têm identificações diferentes.

Os três protótipos sugeridos anteriormente foram retirados da vitrine principal. A escolha de novos projetos fica para a etapa de construção e validação pelo autor. O arquivo público mantém os repositórios existentes e identifica os forks.

## Desenvolvimento

    npm ci
    npm run dev

## Build e verificação

    npm run build
    python3 -m http.server 4392 --directory docs --bind 127.0.0.1
    python3 scripts/e2e_toolkit.py

Edite src/ e public/. O build em docs/ é publicado pelo GitHub Pages.

- Dados do Toolkit: src/data/toolkit.js
- Interface do Toolkit: src/components/Toolkit.jsx
- Identidade e contato: src/recon-identity.css e src/components/SignalField.jsx
- Decisões visuais e fontes: DESIGN.md e design/recon/RESEARCH.md

## Referências e licenças

O ponto de partida Nothing Portfolio de Ankit Shrestha mantém seu aviso MIT em LICENSE. Oxanium é distribuída sob OFL. As adaptações MIT de CSS do Cybercore estão documentadas em design/contextual-signals/ e public/licenses/. Nenhum pacote Cybercore foi instalado.
