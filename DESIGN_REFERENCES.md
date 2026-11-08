# Direção de arte e referências do BLACKSITE

**Identidade escolhida:** Arch Linux/CyberArch pessoal, Nord polar-night, azul gelo e grafismos de operações técnicas. O objetivo visual é ser memorável sem esconder a competência técnica de um candidato de estágio.

### 1. Nothing Portfolio — estrutura

Fonte: https://github.com/ankitshrr/nothing-portfolio (Ankit Shrestha, MIT).

Elementos aproveitados: React + Vite, grid bento, separação por seções, movimento discreto e terminal interativo. A arte, conteúdo, marca e componentes do BLACKSITE foram reescritos; o template original recebe crédito conforme a licença.

### 2. Cyber Grotesk — tipografia experimental

Fonte: https://www.behance.net/gallery/85843953/Cyber-Grotesk (Olga Ryzhychenko).

Elementos inspiradores: lettering angular, industrialismo, microtipografia de interface, barras diagonais, amarelo/âmbar e recortes geométricos. A implementação contém uma faixa industrial, linhas de atenção, detalhes vetoriais e um efeito de deslizamento tipográfico no hover.

A **fonte Cyber Grotesk é um produto comercial**, não incluído na licença MIT do template. Não baixamos, incorporamos, vendemos nem redistribuímos a fonte. A tipografia do site é composta por alternativas públicas ou fallback do sistema, com estilos e SVGs originais.

### 3. Cybersecurity Portfolio UI/UX — painéis de ferramentas

Fonte: https://dribbble.com/shots/27431322-Cybersecurity-Portfolio-Website-UI-UX-Design (Pixiei Studio LLC).

Elementos inspiradores: superfícies pretas/escuras, linhas de circuito, cartões verdes luminosos, molduras cortadas e agrupamentos de ferramentas. No BLACKSITE a tradução é o console interativo **CORE.SKILLS**: nove módulos distribuídos em Software / IA Aplicada / Formação e hardware, com botões reais e descrição verificável para cada um.

### Decisões de projeto

- O verde aparece apenas na matriz técnica e não compete com o cyan da marca nem com o âmbar dos letreiros.
- Nada de copiar interfaces de Watch Dogs ou Cyberpunk literalmente, logotipos das franquias, screenshots ou fundos comerciais.
- As competências não recebem porcentagens arbitrárias; cada módulo mostra origem e estágio de maturidade.
- Todas as interações têm alternativa de teclado, foco visível e configuração prefers-reduced-motion.
- Dados fictícios dos laboratórios são declarados como sintéticos; não são apresentados como êxitos de negócio ou modelos em produção.

## Reformulação tipográfica — direção publicada

Após o usuário rejeitar a composição em painéis, a hierarquia foi refeita de raiz:
- Cyber Grotesk passou a ser a referência principal de forma e tipografia.
- Letreiro SAIRU original em SVG, amarelo industrial sobre preto quente.
- Oxanium (SIL Open Font License) é hospedada em /fonts, com licença incluída; nenhuma fonte Cyber Grotesk foi copiada.
- Bento hero e painel verde CORE.SKILLS foram substituídos por uma composição editorial, previews reais e lista de competências com evidências.
- O terminal Nothing/Watch Dogs permanece uma função secundária real, sem definir o visual inteiro.
- Capturas atuais: design/v3; capturas de design/previews são da versão rejeitada e preservadas no histórico.

## Referências de UX e narrativa técnica (08/11/2026)

- [GitHub Docs — Usando o perfil GitHub para fortalecer o currículo](https://docs.github.com/en/account-and-profile/tutorials/using-your-github-profile-to-enhance-your-resume): selecionar projetos importantes e escrever READMEs que possam ser lidos rapidamente.
- [Portfolio Guide — Case Studies That Get Hired](https://resumeily.com/learning/portfolio-guide): problema, papel, abordagem, trade-offs e evidências em cada estudo de caso.
- [Alec Reimel](https://www.alecreimel.com/): interface retrofuturista mantendo identidade e conteúdo técnico.
- [Brittany Chiang](https://brittanychiang.com/): hierarquia, projetos e experiência facilmente encontrados.
- [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion) e [WCAG 2.2](https://www.w3.org/TR/wcag/): efeitos contextuais, redução de movimento e alvos acionáveis.

**Decisões desta iteração:** o hover no nome recomeça sempre que o mouse entra, sem botão de efeitos; no celular o catálogo usa listas legíveis em vez de chips minúsculos; o fundo usa sinais sutis, não flash de página; as demonstrações mantêm trade-offs e código verificável. O arquivo de 62 repositórios identifica os 34 forks.
