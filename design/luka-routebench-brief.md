# Plano: Rota — bancada de roteamento do KORA

**Estado: proposta.** Nenhuma integração foi implementada. Este documento não substitui o modelo Vetor atual nem descreve uma capacidade existente no KORA.

## Problema a resolver

No início de um pedido não trivial, o KORA precisa escolher um ou dois domínios e carregar as menores skills relevantes. O kora-request-router já define destinos como SENAI, eletrônica/ESP32, CAD/mecânica, tarefas/foco, compras/BOM, CyberArch/desktop, revisão de repositório, causa-raiz e voz.

A ideia é medir a etapa de roteamento isoladamente, antes de ligar qualquer novo modelo ao backend. Um classificador local pode sugerir o domínio; ele não deve decidir se uma ação é autorizada, executar ferramentas, alterar tarefas ou falar com serviços externos.

## Escopo do protótipo

- Nome de trabalho: **Rota**.
- Entrada: uma solicitação sintética, escrita sem dados de conversas privadas.
- Saída: domínio sugerido, skill candidata, sinais de texto e indicação de encaminhar para esclarecimento/revisão.
- Avaliação: comparar uma referência simples por regras com ML, publicar matriz de confusão, macro-F1, cobertura após abstenção e exemplos de erros.
- Execução: treinamento local e inferência no navegador/CLI, sem rede durante a predição.

Os rótulos devem corresponder a domínios de skills já existentes no KORA, não a “ações permitidas”. Pedidos compostos e ambíguos devem ir para kora-request-router ou pedir esclarecimento, sem inventar uma classe de certeza.

## Barreiras

1. O classificador só oferece uma sugestão de rota. A política de agência e as verificações existentes continuam sob autoridade do KORA.
2. Nenhuma confiança probabilística isolada autoriza mutações, envio de mensagens, compras, operações de hardware, chamadas a MCP ou mudanças de credenciais.
3. Pedidos ambíguos, mistos ou fora do domínio podem ser recusados/encaminhados.
4. Nada de logs, contexto privado, histórico de conversa, conteúdo do Obsidian ou dados de saúde no dataset.
5. Nenhuma chamada externa e nenhuma integração com o backend staging nesta versão de estudo.
6. Publicar resultados com tamanho e proveniência do dataset, divisões por cenário, confusões, erros e limites. Não usar “melhorou o KORA” até medir integração real, latência e segurança num ambiente autorizado.

## Critério para sair do protótipo

- Dataset sintético legível e versionado, com exemplos separados por cenário para evitar vazamento de paráfrases.
- Baseline e modelo avaliados no mesmo conjunto reservado.
- Rota de abstenção testada em pedidos fora do escopo e múltiplas intenções.
- Teste obrigatório de que a saída do modelo nunca executa nem aprova uma ação.
- README copiável: instalação, treino, inferência, testes, resultados e limites.
- Revisão humana dos exemplos antes de qualquer experimento com solicitações reais.
