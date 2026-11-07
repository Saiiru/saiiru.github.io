# Arquitetura e Design System: DatashardArchive

Como designer de UI de jogos e engenheiro frontend sênior, a proposta de transformar a seção de projetos no componente **`DatashardArchive`** é uma excelente transição de um portfolio genérico para uma interface diegética industrial. O segredo para capturar a essência do *Journal/Codex* de Cyberpunk 2077 sem cair no pastiche é a disciplina: **honestidade técnica nos dados, rigor tipográfico angular e motion funcional não-bloqueante**.

Abaixo está o refinamento técnico e visual estruturado para implementação direta.

---

### 1. Layout e Hierarquia Espacial

A composição adota um layout assimétrico *master-detail* em proporção 38/62 no desktop, emoldurado por uma carcaça técnica (`HUD frame`).

```
+-----------------------------------------------------------------------------+
| // ARCHIVE_INDEX :: [REC: 03/03] [MEM_STAT: NOMINAL]          [FILTER: ALL] |
+--------------------------------------+--------------------------------------+
| CATÁLOGO DE MÍDIAS (38%)             | LEITOR DE DOSSIÊ (62%)               |
|                                      |                                      |
| [!] DS-01 // EVALFORGE   [UNREAD]   | +-- TABS: [1. DOSSIÊ] [2. IMPL] [3. PROVAS] +
|     Wafer ROM / 6 Sintéticos        | |                                            |
|                                      | | ID: DS-01-EF // REGRAS SINTÉTICAS          |
| [v] DS-02 // OPSPILOT      [READ]   | | Foco: Validação determinística de saída   |
|     Módulo Regras / 12 Chamados      | |                                            |
|                                      | | [ Visualizador de Casos / Benchmarks ]    |
| [v] DS-03 // DOCTRACE      [READ]   | |                                            |
|     Índice BM25 / Citações MD        | +--------------------------------------------+
|                                      | | ACTIONS: [RAW JSON] [DEMO] [REPO GITHUB]  |
+--------------------------------------+--------------------------------------+
```

- **Painel Esquerdo (Catálogo de Mídias):**
  - **Header Técnico:** Contador real de registros `REC: 03/03`, status da sessão e moldura de contenção com chanfros de 45° (`clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)`).
  - **Lista de Shards:** Cards verticais compactos empilhados. Cada card atua como o soquete de inserção de um chip físico.
  - **Acento Coral/Red (`#ff3b30` / `#e8453c`):** Um micro-bloco de 3×8px na borda externa do shard selecionado indica `ACTIVE_BUS`, referenciando o marcador de prioridade militar/dossiê da UI do jogo.

- **Painel Direito (Leitor de Dossiê):**
  - **Plano de Fundo:** Ciano escuro profundo e desaturado (`#081415`) com uma malha milimétrica de ruído/linhas SVG discretas (opacidade 4%).
  - **Sub-header com Tabs ARIA:** Três guias horizontais angulares: `01 // Dossiê`, `02 // Implementação`, `03 // Evidências`.
  - **Área de Exibição:** Tipografia hierárquica legível para leitura prolongada.
  - **Rodapé Fixo de Utilidades:** Ações sempre visíveis: `Baixar Payload JSON`, `Executar Demo Local` e `Código Fonte`.

---

### 2. Desenho Vetorial do Datashard Físico

Para afastar a peça de cartões bancários (muito planos e simétricos) e de placas de vídeo (grades e ventoinhas irrelevantes para mídia de bolso), o datashard deve ser um **módulo de memória ROM encapsulado para barramento industrial de alta velocidade**.

```
    |<------------------- 180px ------------------->|
    +------------------------------------------+----+
    | [:::] DS-01 // EVALFORGE                 | /  | <- Chanfro assimétrico 45° (Notch de inserção)
    | TEST_REG: 6_SYNTH_CASES                  +----+
    | [======] [======] [======]  <- Sulcos térmicos de contato
    |                                               |
    | SER: 9402-EF-REV2        [ CHIP: 16KB EEPROM ]|
    +-----[||||||||||||||||||||||||||||]------------+
          |<- 12 Pinos Dourados (#ffd22e) ->|
```

- **Morfologia:** Silhueta retangular grossa (~1.8:1) com um único **chanfro assimétrico pronunciado (notch)** no canto superior direito. Isso dita visualmente o sentido único de inserção em um terminal físico.
- **Pinos de Contato (Trilhas de Ouro):** Na borda inferior exposta, 8 a 12 trilhas vetoriais curtas em `#ffd22e` com máscaras de desgaste leve, simulando contatos de slot PCIe/ExpressCard militar.
- **Corpo e Textura:** Superfície cinza-grafite escuro fosco (`#181b16`) com ranhuras horizontais usinadas (relevo para aderência manual) e uma janela de quartzo/epóxi que revela um die de circuito estilizado.
- **Marcação a Laser:** Tipografia mono angular stencil contendo o identificador do projeto (`DS-01`, `DS-02`, `DS-03`), revisão de firmware e classificação de teste sintético.

---

### 3. Motion Finito de Leitura (Snappy & Não-Bloqueante)

A regra de ouro de UI diegética para produtividade: **a animação nunca deve segurar o usuário**.

1. **Montagem Instantânea do DOM:** Ao clicar em um novo shard, o texto e os dados do dossiê trocam instantaneamente (0ms de latência percebida para leitores de tela e métricas LCP).
2. **Scanline Transitória (Pseudo-elemento `::after`):**
   - Uma linha de feixe horizontal ciano de 1px com rastro gradiente suave desce pelo leitor:
   ```css
   @keyframes shardDataScan {
     0% { transform: translateY(-100%); opacity: 0.8; }
     100% { transform: translateY(100%); opacity: 0; }
   }
   /* Duração: 160ms, cubic-bezier(0.16, 1, 0.3, 1), trigger único */
   ```
3. **Flicker de Carregamento Rápido (120ms):**
   - Uma única oscilação de opacidade da borda ativa (`1 -> 0.4 -> 1`) confirma a montagem física no barramento.
4. **Sem Efeitos de Digitação Bloqueantes:** Proibido o uso de digitação caractere por caractere em textos longos.
5. **Fallback Acessível:** Sob `prefers-reduced-motion: reduce` ou a flag global de efeitos desligados, desative todas as animações CSS e transições; o estado muda por corte seco.

---

### 4. Paleta e Tokens CSS

Mapeamento semântico estrito derivado da identidade visual:

```css
:root {
  /* Superfícies e Fundos */
  --shard-bg-void: #11130f;          /* Preto quente base */
  --shard-bg-surface: #171a15;       /* Base dos cards de shard inativos */
  --shard-bg-active: #1c211a;        /* Card ativo em barramento */
  --shard-bg-reader: #081415;        /* Leitor ciano escuro desaturado */
  --shard-border-dim: #262c23;       /* Linhas técnicas passivas */

  /* Acentos Diegéticos */
  --shard-accent-yellow: #ffd22e;    /* Foco ativo, pinos de contato, seleção */
  --shard-accent-cyan: #41f4e5;      /* Dados do leitor, feixe de varredura */
  --shard-accent-magenta: #ff4aad;   /* Tags de evidências / falhas sintéticas */
  --shard-accent-violet: #a88bff;    /* Metadados determinísticos */
  --shard-status-coral: #ff3b30;     /* Selo de leitura/alerta de dossiê */

  /* Tipografia e Legibilidade */
  --shard-text-bright: #f4f6ee;      /* Títulos e dados primários */
  --shard-text-body: #b8c0b0;        /* Texto de leitura confortável (AA contrast) */
  --shard-text-muted: #687262;       /* IDs técnicos, hex dumps decorativos */

  /* Geometria */
  --shard-chamfer-notch: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);
}
```

---

### 5. Seleção, Teclado e Mobile (320px)

- **Acessibilidade por Teclado:**
  - A lista de shards opera como `role="tablist"` vertical (`aria-orientation="vertical"`).
  - Cada Shard é um `role="tab"` com `aria-controls="dossier-panel"` e `aria-selected="true|false"`.
  - Navegação via **Roving Tabindex**: setas `ArrowUp`/`ArrowDown` transitam o foco entre os chips; `Home` vai ao primeiro, `End` ao último. Teclas `Enter` ou `Space` confirmam a inserção.
  - As tabs internas do dossiê (`Dossiê / Implementação / Evidências`) formam um sub-tablist horizontal acessível via `Tab` a partir do painel.
- **Estado de Sessão e Deep-Link:**
  - Carregamento inicial verifica a URL: `?shard=evalforge#labs` (default: `evalforge`).
  - Navegar pelos shards dispara `history.replaceState` sem poluir o histórico ou dar scroll jump.
  - Shards lidos são marcados em `sessionStorage` (`viewed_shards: ["evalforge", ...]`), alternando visualmente a badge de `[NOVO/UNREAD]` para `[LIDO/REC]`.
- **Adaptação Mobile (320px - 768px):**
  - Desfaz o grid 38/62 horizontal. O catálogo vira um **seletor horizontal deslizante de cartuchos** no topo (chips compactados com altura mínima de 44px para toque confortável).
  - Logo abaixo, o leitor de dossiê se expande para largura total (100vw - padding), evitando rolagem horizontal ou quebras de texto nas margens mínimas de 320px.

---

### 6. Os 8 Testes Acionáveis

1. **Deep-linking & Hidratação:** Carregar `?shard=opspilot#labs` deve inicializar o leitor com o dossiê do OpsPilot ativo e a aba de catálogo correspondente selecionada.
2. **Navegação por Teclado do Catálogo:** Com foco no catálogo, pressionar `ArrowDown` deve mover o foco para o próximo shard e atualizar a prévia sem disparar scroll da página.
3. **Roving Tabindex & Atributos ARIA:** Verificar se apenas o Shard ativo possui `tabIndex={0}` enquanto os demais possuem `tabIndex={-1}`, com `aria-selected` sincronizado.
4. **Isolamento de Efeitos / Reduced Motion:** Com `@media (prefers-reduced-motion: reduce)` ou toggle local desligado, testar que nenhum pseudo-elemento de scanline ou flicker é instanciado.
5. **Exportação Fidedigna de JSON:** Clicar no botão `RAW JSON` do DocTrace deve gerar o download imediato de um blob JSON válido com a estrutura exata do índice BM25 sintético.
6. **Persistência de Leitura em Sessão:** Selecionar os 3 shards e atualizar a página (`F5`); o estado de `[LIDO]` deve persistir via `sessionStorage`.
7. **Responsividade Estrita em 320px:** Em viewport de 320×568px, testar ausência total de overflow horizontal (`document.body.scrollWidth === window.innerWidth`) e verificar que os botões possuem área de clique $\ge 44 \times 44\text{px}$.
8. **Modo Determinístico Offline:** Simular desconexão de rede (`navigator.onLine = false`); todo o dossiê, busca sintética e casos de teste devem renderizar sem falhas ou dependência de APIs externas.

---

### 7. O que Remover da Seção Antiga

1. **Grid de 3 Linhas Genéricas:** Eliminar o padrão estático repetitivo de *screenshot recortada + título em h3 + parágrafo descritivo de marketing*.
2. **Vocabulário Vazio de Big Tech:** Remover menções infladas como "Solução empresarial corporativa de ponta", "Revolucionando workflows com IA" ou métricas fictícias de ROI.
3. **Mockups de Telas Falsas:** Eliminar capturas de tela estáticas que prometem dashboards complexos mas não oferecem código ou interatividade real.
4. **Hacking Fake / Decrypt Progress:** Rejeitar explicitamente barras de progresso que fingem descriptografar o shard ("Decrypting 45%..."). O leitor deve agir como uma ferramenta profissional de consulta direta de arquivos.
