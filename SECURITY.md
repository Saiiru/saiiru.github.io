# Segurança e limites

O portfólio publicado é um site estático: não há autenticação, formulário de contato, banco de dados ou serviço de IA no caminho principal. O terminal é uma interface local de comandos fixos; a entrada é renderizada como texto, sem executar comandos ou HTML. Links profissionais levam ao GitHub e LinkedIn. Não há coleta de dados ou telemetria de terceiros no carregamento principal.

## Controles implementados

- Assets, fontes e shader são servidos pela mesma origem.
- O build inclui Content Security Policy em meta: scripts e estilos externos à origem, scripts inline, eval, frames, objetos e submissão de formulários são bloqueados.
- Política de referência strict-origin-when-cross-origin; links externos com noopener/noreferrer.
- Destinos do inventário de repositórios são validados no build como URLs HTTPS de github.com.
- Build de produção explícito, sem source maps. Dependências e lockfile versionados; check:build limita o tamanho comprimido.
- Servidores Vite de desenvolvimento e preview ficam em 127.0.0.1 por padrão.
- O teste e2e_hardening verifica CSP, tentativa de script inline, entrada escapada, fallback sem JavaScript e falha do contexto gráfico.

## O que esses controles não garantem

A CSP em meta não substitui cabeçalhos HTTP e não permite frame-ancestors. Este repositório não controla todos os cabeçalhos do GitHub Pages. A política self também não protege contra um asset malicioso já publicado na própria origem. Revisar dependências e alterações continua necessário.

Zero alertas no npm audit descreve o resultado da base de vulnerabilidades no momento da verificação; não certifica ausência de falhas. Os testes são verificações locais de escopo definido, não um pentest ou certificação de acessibilidade.

## Código preservado e projetos relacionados

projects/ e public/labs/ preservam protótipos históricos e não compõem a vitrine selecionada. Eles usam dados sintéticos e execução local; não coloque chaves em código cliente nem habilite proxies públicos sem revisão própria.

Ada Commerce é uma CLI educacional em memória. Plann.er é uma API educacional local, ainda sem autenticação/autorização e com confirmações não assinadas; não a exponha publicamente com dados pessoais. Os READMEs desses repositórios descrevem seus limites.

Não envie segredos, dados pessoais ou tokens em issues públicas. Ao relatar um problema, descreva o comportamento e passos mínimos usando dados fictícios.

## Biblioteca /components/

A galeria usa a mesma CSP estática e assets locais. Formulários e buscas são demonstrações com estado em memória; não enviam dados nem executam comandos. Canvas/CRT são desenhos originais, sem câmera/microfone. O nome digitado na entrada é tratado como texto. A seleção/REC é visual e não usa captura da tela. Os exemplos não recebem fontes HTML de usuários. A limpeza preserva o cache de navegação e descarta os recursos ao desmontar uma cena.
