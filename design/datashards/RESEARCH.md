# Pesquisa e decisões — Datashard Archive

## Exemplos consultados antes da implementação

1. **Anna Kuźmińska — Cyberpunk 2077 UI Art and UI Art Concepts**
   https://komisarzbob.artstation.com/projects/18mLB8
   Trabalho publicado pela artista de UI; referência primária de linguagem visual e dispositivos.
2. **Vladimír Vilimovský — Cyberpunk 2077 User Interface, Part 2**
   https://www.behance.net/gallery/133185623/Cyberpunk-2077User-Interface-(Part-2)
   Apresentação inclui Journal e Codex. O carregamento direto retornou 403; o índice público e a descrição retornada pela busca foram consultados. Não tratamos material inacessível como auditado.
3. **Michael Rigley — Cyberpunk 2077 / UI concepts**
   https://www.michaelrigley.com/work/cyberpunk-2077/
   Fonte primária de look-development e menus; referência de estrutura técnica, não de código ou assets reutilizáveis.
4. **WolvenKit / REDmodding — Creating custom shards**
   https://wiki.redmodding.org/cyberpunk-2077-modding/modding-guides/quest/creating-custom-shards
   Documentação com captura do Journal/Shard reader, confirmando catálogo de registros e painel de leitura.
5. **Capturas do jogo: leitor e catálogo**
   https://www.shacknews.com/article/137190/shards-journal-tab-cyberpunk-2077
   https://gamertweak.com/how-to-read-shards-cyberpunk-2077/
   Usadas apenas como referências visuais. Não foram copiadas para o site.
6. **W3C ARIA APG — Tabs Pattern**
   https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
   Fundamenta as abas com seleção, painel associado, setas, Home/End e navegação por Tab.

## Colaboração Gemini

Gemini foi executado via Agy com o modelo disponível gemini-3.8-flash-high. A resposta integral está em GEMINI-DIRECTION.md. O prompt distinguiu pesquisa já realizada de ações não executadas pelo modelo, pedindo que não afirmasse ter aberto páginas ou auditado código.

Adotado:
- catálogo de mídias + leitor persistente, no mesmo fluxo da página;
- módulos vetoriais originais com notch e contatos dourados;
- hierarquia por dossiê, implementação e evidências;
- scan finito de 210ms, sem tela de carregamento que bloqueie leitura;
- mobile com seleção compacta acima do leitor.

Adaptações deliberadas:
- O catálogo usa botões com aria-pressed e grupo, em vez de um segundo tablist aninhado. As abas do dossiê seguem o padrão APG.
- Registros lidos são estado real desta visita, claramente rotulado; não há promessa de persistência entre reloads.
- Exportação JSON contém o dossiê verdadeiro e links, não um falso índice BM25 ou conteúdo criptografado.
- Sem serial de hardware, capacidade EEPROM, nível de segurança ou descriptografia inventados.
- Sem copiar imagens, fontes comerciais, logos ou arquivos de interface do jogo.

## Escopo implementado

- Substitui exclusivamente a seção antiga de projetos.
- Os três projetos e suas limitações foram preservados.
- A apresentação inicial prioriza problema, método e limites; implementação e evidências têm abas próprias.
- ABRIR DEMO e CÓDIGO E TESTES ficam disponíveis em todos os painéis.
- URL profunda: ?shard=doctrace#labs.
- Exportação: doctrace.datashard.json (e equivalentes por projeto).
- Clipboard usa fallback explícito de endereço selecionável caso a API esteja bloqueada.

## Validação
- RED inicial: arquivo de testes detectou ausência do archive.
- GREEN: seleção, abas, teclado, link profundo, fallback de ID inválido, contagem e download JSON.
- 320/390/768/1280/1440px sem overflow.
- Contraste do catálogo no modo claro: primeiro teste falhou com ~1.98:1; após tokens locais, títulos passaram entre 10.13:1 e 13.69:1.
- Revisão independente confirmou contraste e corte da imagem como os dois problemas importantes; ambos foram corrigidos.
- Previews de evidência preservam a captura completa, com object-fit: contain.
- Testes antigos de movimento/tema/menu/terminal e dos três laboratórios mantidos; 16 testes Node dos labs passando.

## Arquivos
- src/components/DatashardArchive.jsx — estado e navegação.
- src/components/datashards.js — conteúdo e registro exportável.
- src/components/datashard-archive.css — apresentação e responsividade.
- scripts/e2e_datashards.py — comportamentos e cinco larguras.
- scripts/e2e_datashard_contrast.py — contraste real renderizado.
