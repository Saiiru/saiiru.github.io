# Cyberpunk color & motion pass — implementação

**Objetivo:** aprimorar o CSS do portfólio existente com glitch, interação e cores cyberpunk. Preservar conteúdo, letreiro geométrico, estrutura editorial e labs já publicados.

**Direção:** manter amarelo como marca; ciano (#41f4e5) nos controles, magenta (#ff4aad) nas falhas de sinal, violeta (#a88bff) no terceiro projeto. Sem substituir o layout por dashboard. Sem flashes de tela inteira ou glitch constante.

## Plano
- [x] Pesquisar exemplos primários (Codrops e MDN) e pedir crítica ao Gemini via Agy.
- [x] Criar motion.css separado, com tokens e keyframes comentados; hook para reduced-motion, preferência persistida, revealer IntersectionObserver e spotlight coordenado por requestAnimationFrame.
- [x] Compor camadas SVG recortadas; disparo por ponteiro e botão; no máximo uma sequência curta por acionamento.
- [x] Refinar CTAs, labels, navegação, previews e transições com cadência específica. Conteúdo visível se o observer não funcionar.
- [x] Testar toggle, persistência, reduced-motion, foco, entrada de projetos, viewports e labs. Renderizar desktop e mobile, revisar antes da publicação.
- [x] Commit, PR/merge e verificação real no GitHub Pages.

## Limites e escolhas
CSS/React nativos, sem biblioteca nova. Técnicas geométricas e animação autorais inspiradas no mecanismo de recortes do Codrops, não cópia integral. Sem reapresentar dados sintéticos como inferência real. Modo claro e contatos preservados. Preferência por efeitos vem do usuário; sistema reduced-motion tem precedência.

## Riscos cobertos nos testes
1. Desligar efeitos precisa revelar imediatamente todos os projetos.
2. Preferência deve sobreviver a reload e funcionar com localStorage bloqueado.
3. Reduced-motion não pode deixar camadas de glitch visíveis.
4. Hovers não podem deslocar layout em 320px.
5. Camadas decorativas não duplicam nomes acessíveis nem interceptam links.

**Método:** implementação direta nesta sessão; Gemini como consultor, seguido de testes objetivos.

## Execution record
- RED: e2e_motion.py initially failed with "effects toggle missing".
- GREEN: toggle, finite burst, persistence, denied storage, reduced motion and reveals pass.
- Review found two P2 defects: opt-out document scrolling and light-theme contrast.
- RED: targeted suite failed on smooth scrolling and three contrast cases (1.25–1.59).
- Fix: document :has opt-out + explicit light-theme color/stroke overrides.
- GREEN: all six targeted browser tests passed.
- No abandoned or speculative changes to lab logic. No new runtime dependency.
- Publishing follows the user's earlier explicit instruction to update the public portfolio.
