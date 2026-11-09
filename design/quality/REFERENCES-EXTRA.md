# Referências complementares e orçamento de movimento

A revisão começou pelo código executável dos repositórios existentes. Ada Commerce está em main 2bf93ac e Plann.er em main 1e56018, sem alterações locais pendentes. Seus READMEs descrevem o funcionamento real: CLI Java em memória e API TypeScript local, respectivamente. Não foram convertidos em vitrines de produtos com funcionalidades inexistentes.

## Portfólios e código examinados

| Referência | O que foi examinado | Aplicação ao BLACKSITE |
| --- | --- | --- |
| [AmanJoshi1604/Portfolio-Website](https://github.com/AmanJoshi1604/Portfolio-Website) | README e estrutura HTML/CSS/JS, terminal, visual de mainframe, áudio e GitHub ao vivo declarados pelo autor. Não foi feito benchmark do projeto. | Linguagem de terminal como exploração opcional. Preservar links e navegação convencionais; manter assets locais e inventário estático. Não importar áudio automático, preloader bloqueante ou formulário/iframe externo. |
| [Bruno Simon — folio-2025](https://github.com/brunosimon/folio-2025) | README: estágios explícitos do game loop e pipeline de compressão de modelos/texturas. | Coordenação e orçamento dos efeitos. O site do Sairu mantém o shader isolado e dispensa mundo 3D, física e dependências adicionais. Não foram copiados assets nem cenários. |
| [Codrops — CSSGlitchEffect](https://github.com/codrops/CSSGlitchEffect) e [tutorial original](https://tympanus.net/codrops/2017/12/21/css-glitch-effect/) | Tutorial e css/demo1.css: camadas recortadas por clip-path, translações e blend modes. O exemplo usa repetições infinitas. | Estudar a composição em camadas e preservar os glitches finitos existentes na marca/interações; não copiar loops permanentes para o conteúdo de leitura. Nenhum trecho novo de CSS foi copiado. |
| [Brittany Chiang](https://brittanychiang.com/) / [v4](https://github.com/bchiang7/v4) | Site e README, na revisão anterior. | Hierarquia de experiência, acesso direto ao código e arquivo secundário. |
| [Hamish Williams](https://hamishw.com/) / [portfolio](https://github.com/HamishMW/portfolio) | Site e README, na revisão anterior. | Movimento autoral com trabalho legível; não apropriar projetos, conteúdo ou assets. |
| [Nothing Portfolio](https://github.com/ankitshrr/nothing-portfolio) | Ponto de partida já registrado e licenciado no projeto. | Manter atribuição MIT; a identidade atual usa marca original, Oxanium e paleta carvão/mint/coral. |

Referências não são recomendações de instalar suas dependências. Declarações de segurança ou desempenho feitas nos READMEs de terceiros não foram tratadas como auditorias.

## Distribuição dos efeitos

- Marca: um pulso inicial e glitch curto ao entrar com ponteiro fino; geometria base sempre legível.
- Navegação/controles: feedback de hover, foco e seleção; sem tempo de espera para ler.
- Faixa tipográfica: anima somente enquanto a faixa está no viewport; pausa preservando a posição e retoma ao reaparecer.
- Fundo ambiente: movimento lento e composto; pausa com a aba oculta.
- Contato: chunk e GPU adiados; pausa fora da tela; falha de download/contexto vira fundo estático.
- Movimento reduzido: conteúdo e estados visíveis, sem loops decorativos.
- Sem IntersectionObserver: a faixa permanece estática, com texto presente.

A correção da faixa observa o contêiner estável, não o trilho em translação. Isso evita alternar a visibilidade por causa da própria animação. O observer é desconectado no cleanup e reage à alteração da preferência de movimento.

## Evidência incremental

Antes da alteração, e2e_motion_budget.py falhou ao esperar pausa da faixa fora da tela. Após a correção, passou em 390 e 1440px: progressão visível, congelamento fora da tela, retomada, movimento reduzido e fallback sem observer. A suíte hardening também passou novamente. O detector mecânico dos dois arquivos de UI alterados retornou lista vazia; isso não equivale a uma auditoria formal.

Build e check:build passaram. JS inicial: 197.920 bytes, 61.972 bytes gzip. CSS: 62.685 bytes, 14.104 bytes gzip. Nenhuma dependência foi adicionada. Não se repetiu a coleta de LCP: a tabela anterior é uma medição anterior de laboratório, não um resultado novo desta alteração.
