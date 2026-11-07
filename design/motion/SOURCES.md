# Research — CSS cyberpunk e movimento

## Fontes primárias consultadas
- Codrops, CSS Glitch Effect: https://tympanus.net/codrops/2017/12/21/css-glitch-effect/
- Código de referência: https://github.com/codrops/CSSGlitchEffect/blob/master/css/demo1.css
- MDN, CSS animations: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Animations
- MDN, prefers-reduced-motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- MDN, animation performance: https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Animation_performance_and_frame_rate

## Técnica incorporada
O código do Codrops demonstrou recortes independentes via clip-path em camadas e deslocamentos por steps. A implementação BLACKSITE recria o mecanismo com **SVGs próprios**, recortes/tempos próprios e estado React finito (620ms), sem copiar o demo integral.

## Colaboração Gemini
Executado Agy com o modelo Gemini disponível identificado por `gemini-3.8-flash-high`. Resposta integral preservada em GEMINI-REVIEW.md. O prompt pediu análise de uma proposta e explicitamente proibiu afirmar auditoria de código ou de screenshot; a crítica não é apresentada como revisão de arte final.

Aplicado: papéis distintos para amarelo/ciano/magenta/violeta, ausência de cursor artificial, bursts finitos, pausabilidade, contraste e caminho de movimento reduzido. Não adotado literalmente: `will-change: background` permanente e glitch disparado continuamente por hover; optamos por requestAnimationFrame e guarda contra reentrada.

## Verificação
- Teste inicial comprovou ausência do controle de efeitos (RED).
- Suite de comportamento verifica persistência, glitch finito, disabled state, reduced-motion, storage bloqueado e leitura de projetos.
- O teste de reveal foi corrigido para esperar opacity final por condição, sem exigir um tempo fixo de 600ms.
- As capturas *-glitch.png pausam a animação em 120ms somente no script de captura; o site real não pausa nem reproduz esse estado indefinidamente.
