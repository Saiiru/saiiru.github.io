# Decisões de design — BLACKSITE

- **Direção visual:** Nord polar night como base, ciano para ações e foco, violeta e dourado para sinais secundários. Bordas finas, grade discreta e blocos bento dão densidade com leitura clara.
- **Identidade:** tipografia Space Grotesk para impacto, JetBrains Mono para interface técnica e Inter para texto corrido. A marca S4IRU // BLACKSITE evita imagens pessoais e referências licenciadas.
- **Arte:** `blacksite-network.svg` e `blacksite-circuit.svg` são desenhos originais simples de nós e circuitos. A varredura é decorativa e respeita `prefers-reduced-motion`.
- **Conteúdo:** cada lab separa problema, função e condições de uso. Os rótulos de dados sintéticos e modo offline/LLM local opcional deixam claro o caráter exploratório; não há métricas inventadas.
- **Interação:** terminal controlado por estado React, sem HTML dinâmico. Os comandos mostram informações locais; `labs` navega para a seção de demos e `clear` limpa a saída.
- **Acessibilidade:** idioma pt-BR, link para pular conteúdo, navegação por âncoras, foco visível, botões com rótulos e adaptação a movimento reduzido.
- **Publicação:** Vite gera `docs/` com base `/` para GitHub Pages na raiz do domínio. O diretório `public/labs/` é copiado por Vite e é mantido por outra implementação.
