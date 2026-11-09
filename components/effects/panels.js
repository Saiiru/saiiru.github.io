import { element } from '../core/lifecycle.js';

const sourcePaths = ['components/effects/panels.js', 'components/effects/panels.css'];
const el = element;
const append = (parent, ...children) => { parent.append(...children); return parent; };
function button(text, className = 'ca-btn') { const node = el('button', className, text); node.type = 'button'; return node; }
function label(text, className = 'ca-label') { return el('span', className, text); }

// Original, decorative 24px stroke marks. Accessible control names remain text.
function icon(name, className = '') {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('class', 'ca-svg-icon ' + className);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.5');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  const marks = {
    search: ['M16.5 10.5a6 6 0 1 1-12 0a6 6 0 0 1 12 0Z', 'm15 15 5 5'],
    check: ['M5 12.5 9.5 17 19 7', 'M4 5h5M20 19h-5'],
    idea: ['M12 3 21 12 12 21 3 12Z', 'M12 8v8M8 12h8'],
    forward: ['M5 18 18 5M9 5h9v9', 'M4 8v12h12'],
    pause: ['M19 12a7 7 0 1 1-14 0a7 7 0 0 1 14 0Z', 'M10 9v6M14 9v6'],
    sun: ['M16 12a4 4 0 1 1-8 0a4 4 0 0 1 8 0Z', 'M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5'],
    studio: ['M5 5h14v14H5Z', 'M9 9h6v6H9ZM3 9h2M19 15h2M9 3v2M15 19v2'],
    code: ['m8 6-5 6 5 6M16 6l5 6-5 6', 'm14 4-4 16'],
    research: ['M4 6h16M4 12h11M4 18h16', 'm16 10 4 2-4 2']
  };
  (marks[name] || marks.idea).forEach(d => { const path = document.createElementNS(ns, 'path'); path.setAttribute('d', d); svg.append(path); });
  return svg;
}

function frame(host, code, title, subtitle) {
  const root = el('section', 'ca-panel ca-' + code);
  const head = el('header', 'ca-panel-head');
  append(head, el('div', 'ca-heading', title), el('span', 'ca-demo-tag', 'DEMONSTRAÇÃO'));
  append(root, head, el('p', 'ca-description', subtitle));
  host.append(root);
  return root;
}
function range(min, max, value, name) {
  const input = el('input', 'ca-range'); input.type = 'range'; input.min = min; input.max = max; input.value = value; input.setAttribute('aria-label', name); return input;
}
function stateText(node, text) { node.textContent = text; }
function timer(life, fn, ms) { const id = setTimeout(fn, ms); life.cleanup(() => clearTimeout(id)); return id; }
function mountHud(host, life) {
  const root = frame(host, 'hud', 'NEXUS / Observatório', 'Uma interface de missão com conteúdo e estados locais.');
  const scene = el('div', 'ca-hud-scene');
  const grid = el('div', 'ca-hud-grid');
  const heading = append(el('div', 'ca-hud-title'), label('CANAL 07 · LABORATÓRIO'), el('h3', '', 'Um sinal,\numa nova perspectiva.'));
  const orbit = el('div', 'ca-hud-orbit');
  append(orbit, el('span', 'ca-orbit-ring'), el('span', 'ca-orbit-ring ca-orbit-ring-inner'), el('span', 'ca-orbit-core', 'N'), label('ORIGEM / 00:00', 'ca-orbit-caption'));
  const footer = append(el('div', 'ca-hud-footer'), label('PROTOCOLO VISUAL'), label('03 / ONLINE NA DEMO'));
  append(grid, heading, orbit, footer); scene.append(grid); root.append(scene);
  const actions = append(el('div', 'ca-actions'), button('Revelar interface'), label('Perspectiva acompanha o ponteiro', 'ca-hint'));
  root.append(actions); const reveal = actions.firstElementChild;
  let revealTimer;
  const run = () => { clearTimeout(revealTimer); scene.classList.remove('ca-hud-reveal'); void scene.offsetWidth; scene.classList.add('ca-hud-reveal'); revealTimer = setTimeout(() => scene.classList.remove('ca-hud-reveal'), 1100); };
  life.listen(reveal, 'click', run);
  life.cleanup(() => clearTimeout(revealTimer));
  life.listen(scene, 'pointermove', event => {
    if (life.reduced) return;
    const box = scene.getBoundingClientRect();
    scene.style.setProperty('--ca-rx', ((event.clientY - box.top) / box.height - .5) * -7 + 'deg');
    scene.style.setProperty('--ca-ry', ((event.clientX - box.left) / box.width - .5) * 9 + 'deg');
  });
  life.listen(scene, 'pointerleave', () => { scene.style.setProperty('--ca-rx', '0deg'); scene.style.setProperty('--ca-ry', '0deg'); });
}
function mountTelemetry(host, life) {
  const root = frame(host, 'telemetry', 'Telemetria / Gerador de sinal', 'Valores sintéticos. Ajuste a intensidade para explorar o painel.');
  const top = el('div', 'ca-gauges');
  const gauges = [['AMPLITUDE', '%', 64], ['FREQUÊNCIA', 'Hz', 42], ['ESTABILIDADE', '%', 91]].map(([name, unit, value]) => {
    const gauge = el('div', 'ca-gauge');
    const dial = el('div', 'ca-gauge-dial');
    const number = el('strong', 'ca-gauge-number', String(value));
    append(dial, append(el('div', 'ca-gauge-center'), number, el('span', '', unit)));
    append(gauge, dial, label(name)); top.append(gauge); return { dial, number };
  });
  const graph = el('div', 'ca-signal-graph'); graph.setAttribute('aria-hidden', 'true');
  const bars = Array.from({ length: 38 }, (_, i) => { const bar = el('i', 'ca-signal-bar'); graph.append(bar); return bar; });
  const input = range(10, 100, 64, 'Intensidade do sinal sintético');
  const output = el('output', 'ca-control-output', '64%');
  const control = append(el('label', 'ca-control-row'), label('INTENSIDADE'), input, output);
  append(root, top, append(el('div', 'ca-chart-head'), label('FORMA DE ONDA'), label('DADOS SINTÉTICOS · 24 FPS')), graph, control);
  let intensity = 64;
  const draw = time => {
    const phase = time / 850;
    const vals = [intensity, 22 + intensity * .33, 98 - intensity * .13];
    gauges.forEach((g, i) => { const v = Math.round(vals[i] + Math.sin(phase + i) * (i ? 1 : 3)); g.number.textContent = String(v); g.dial.style.setProperty('--ca-gauge', Math.min(v, 100) + '%'); });
    bars.forEach((bar, i) => { const wave = Math.sin(i * .47 + phase) * .42 + Math.sin(i * .19 - phase * .6) * .22; bar.style.height = Math.max(6, (wave + .4) * intensity) + '%'; });
  };
  life.listen(input, 'input', () => { intensity = Number(input.value); output.textContent = intensity + '%'; if (life.reduced) draw(0); });
  life.animate((time, reduced) => draw(reduced ? 0 : time), 24);
}
function mountLauncher(host, life) {
  const root = frame(host, 'launcher', 'Command / Busca local', 'Filtre itens de demonstração e use ↑ ↓ e Enter para selecionar.');
  const box = el('div', 'ca-launcher-box');
  const field = el('input', 'ca-search'); field.type = 'search'; field.placeholder = 'Buscar itens de demonstração…'; field.setAttribute('aria-label', 'Buscar itens de demonstração no catálogo local'); field.autocomplete = 'off';
  const list = el('div', 'ca-launcher-list'); list.setAttribute('role', 'listbox'); list.setAttribute('aria-label', 'Itens de demonstração do catálogo');
  const unique = 'ca-launcher-' + Math.random().toString(36).slice(2, 9); list.id = unique; field.setAttribute('role', 'combobox'); field.setAttribute('aria-controls', unique); field.setAttribute('aria-expanded', 'true'); field.setAttribute('aria-autocomplete', 'list');
  const status = el('p', 'ca-launcher-status', 'Selecione um item de demonstração para abrir uma prévia local.'); status.setAttribute('role', 'status');
  const items = [
    ['01', 'Atlas de interfaces', 'Design · Componentes visuais', 'Um catálogo de superfícies, navegação e experimentos.'],
    ['02', 'Órbita', 'Motion · Animação', 'Estudos de movimento, ritmo e trajetórias.'],
    ['03', 'Sinal', 'Dados · Visualização', 'Exploração de gráficos com séries sintéticas.'],
    ['04', 'Oficina', 'Produto · Prototipagem', 'Pequenos protótipos para ideias em construção.'],
    ['05', 'Arquivo', 'Pesquisa · Referências', 'Coleção local de referências de composição.']
  ];
  let filtered = items, index = 0;
  const preview = el('div', 'ca-launcher-preview');
  const open = () => { if (!filtered.length) return; const item = filtered[index]; preview.replaceChildren(label('PRÉVIA DE DEMONSTRAÇÃO / ' + item[0]), el('h4', '', item[1]), el('p', '', item[3])); status.textContent = 'Item de demonstração: ' + item[1] + ' selecionado.'; };
  const select = next => { index = Math.max(0, Math.min(next, filtered.length - 1)); [...list.children].forEach((row, i) => row.setAttribute('aria-selected', String(i === index))); if (filtered.length) field.setAttribute('aria-activedescendant', unique + '-' + index); else field.removeAttribute('aria-activedescendant'); };
  const render = () => {
    const query = field.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    filtered = items.filter(item => item.join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(query));
    list.replaceChildren();
    filtered.forEach((item, i) => {
      const row = append(el('div', 'ca-launcher-item'), label(item[0], 'ca-item-index'), append(el('div'), el('strong', '', item[1]), el('small', '', item[2])), label('↵', 'ca-key'));
      row.id = unique + '-' + i; row.setAttribute('role', 'option'); row.setAttribute('aria-selected', String(i === 0));
      row.dataset.resultIndex = String(i);
      list.append(row);
    });
    if (!filtered.length) list.append(el('p', 'ca-empty', 'Nenhum item de demonstração encontrado.'));
    index = 0; select(0); status.textContent = filtered.length + (filtered.length === 1 ? ' item encontrado.' : ' itens encontrados.');
  };
  life.listen(list, 'pointerdown', event => { const row = event.target.closest('[data-result-index]'); if (!row || !list.contains(row)) return; event.preventDefault(); select(Number(row.dataset.resultIndex)); open(); field.focus(); });
  life.listen(field, 'input', render);
  life.listen(field, 'keydown', event => { if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); select(index + (event.key === 'ArrowDown' ? 1 : -1)); } else if (event.key === 'Enter') { event.preventDefault(); open(); } else if (event.key === 'Escape') { field.value = ''; render(); } });
  append(box, append(el('div', 'ca-search-wrap'), icon('search', 'ca-search-icon'), field, label('ESC', 'ca-key')), list, status, preview);
  root.append(box); render();
}
function mountNotifications(host, life) {
  const root = frame(host, 'notifications', 'Inbox / Pilha de eventos', 'Eventos locais, detalhes e histórico. Até quatro ficam na pilha.');
  const rail = el('div', 'ca-notification-rail'); rail.setAttribute('aria-label', 'Notificações de demonstração');
  const status = el('p', 'ca-hint', ''); status.setAttribute('role', 'status');
  const history = el('details', 'ca-notification-history'); const historyTitle = el('summary', '', 'Histórico · 0');
  const historyList = el('div', 'ca-history-list'); history.append(historyTitle, historyList);
  const detail = el('div', 'ca-notification-detail'); detail.hidden = true; detail.setAttribute('role', 'region'); detail.setAttribute('aria-label', 'Detalhe da notificação');
  const detailClose = button('Fechar detalhe', 'ca-btn ca-btn-quiet');
  let sequence = 0; const archive = [];
  const messages = [
    ['check', 'Protótipo salvo', 'A nova composição está pronta para revisar.', 'mint', 'O evento representa uma alteração local no protótipo. Nenhum arquivo foi salvo por esta demonstração.'],
    ['idea', 'Uma ideia chegou', 'Experimente combinar movimento e tipografia.', 'coral', 'Uma anotação sintética do laboratório visual. Use a composição como ponto de partida para uma nova interface.'],
    ['forward', 'Próxima etapa', 'Explore os outros componentes do catálogo.', 'mint', 'O catálogo reúne estudos independentes de interfaces. Este lembrete existe apenas na memória da demonstração.'],
    ['pause', 'Pausa de observação', 'Observe o ritmo visual antes de continuar.', 'coral', 'Uma pausa conceitual para revisar hierarquia, espaçamento e contraste. Nenhum lembrete externo foi criado.']
  ];
  const showDetail = record => { detail.hidden = false; detail.replaceChildren(label('DETALHE / EVENTO ' + record.id), el('h4', '', record.data[1]), el('p', '', record.data[4]), label('ORIGEM: GERADOR LOCAL · ' + record.reason), detailClose); detailClose.focus(); };
  life.listen(detailClose, 'click', () => { detail.hidden = true; addButton.focus(); });
  const archiveRecord = (record, reason) => {
    record.reason = reason; archive.unshift(record); if (archive.length > 6) archive.pop();
    historyTitle.textContent = 'Histórico · ' + archive.length + ' / 6';
    historyList.replaceChildren();
    archive.forEach(item => {
      const row = button('', 'ca-history-row'); append(row, label(String(item.id).padStart(2, '0')), el('span', '', item.data[1]), label(item.reason));
      row.caRecord = item; historyList.append(row);
    });
  };
  const update = () => { status.textContent = rail.children.length + ' de 4 mensagens na pilha · ' + archive.length + ' no histórico local.'; };
  const add = () => {
    const record = { id: ++sequence, data: messages[(sequence - 1) % messages.length], reason: 'NA PILHA' };
    if (rail.children.length === 4) { const oldest = rail.lastElementChild; archiveRecord(oldest.caRecord, 'LIMITE DA PILHA'); oldest.remove(); }
    const data = record.data; const card = el('article', 'ca-notification ca-notification-' + data[3]); card.caRecord = record;
    const close = button('×', 'ca-icon-btn'); close.setAttribute('aria-label', 'Dispensar: ' + data[1]);
    const open = button('', 'ca-notification-open');
    append(open, label('EVENTO LOCAL · ' + String(sequence).padStart(2, '0')), el('h4', '', data[1]), el('p', '', data[2]), label('ABRIR DETALHE →', 'ca-notification-detail-hint'));
    open.dataset.notificationAction = 'detail';
    append(card, append(el('span', 'ca-notification-icon'), icon(data[0])), open, close);
    close.dataset.notificationAction = 'dismiss';
    rail.prepend(card); update();
  };
  life.listen(rail, 'click', event => {
    const action = event.target.closest('[data-notification-action]'); if (!action || !rail.contains(action)) return;
    const card = action.closest('.ca-notification'); if (card.classList.contains('ca-is-dismissing')) return;
    if (action.dataset.notificationAction === 'detail') { showDetail(card.caRecord); return; }
    card.querySelectorAll('button').forEach(b => { b.disabled = true; }); card.classList.add('ca-is-dismissing');
    timer(life, () => { if (!card.isConnected) return; archiveRecord(card.caRecord, 'DISPENSADO'); card.remove(); update(); }, life.reduced ? 0 : 240);
  });
  life.listen(historyList, 'click', event => { const row = event.target.closest('.ca-history-row'); if (row && historyList.contains(row)) showDetail(row.caRecord); });
  const addButton = button('＋ Novo evento'); const clear = button('Limpar pilha', 'ca-btn ca-btn-quiet');
  life.listen(addButton, 'click', add); life.listen(clear, 'click', () => { [...rail.children].forEach(card => archiveRecord(card.caRecord, 'PILHA LIMPA')); rail.replaceChildren(); update(); });
  append(root, append(el('div', 'ca-actions'), addButton, clear), rail, status, detail, history); add(); add();
}
function mountMedia(host, life) {
  const root = frame(host, 'media', 'Wave / Player conceitual', 'Simulação visual sem reprodução de áudio.');
  const player = el('div', 'ca-player');
  const cover = append(el('div', 'ca-album'), el('span', 'ca-album-line'), el('span', 'ca-album-orbit'), append(el('div', 'ca-album-type'), label('VOLUME 01'), el('strong', '', 'AFTER\nTHE SIGNAL'), label('SYNTHETIC SESSION')));
  const tracks = [['After the signal', 'Estudo de atmosfera', 188], ['Neon garden', 'Ritmo imaginário', 216], ['Quiet orbit', 'Espaço e silêncio', 164]];
  let track = 0, playing = false, seconds = 0, last = null;
  const trackTitle = el('h3', '', tracks[0][0]); const artist = el('p', '', tracks[0][1]);
  const play = button('▶', 'ca-play'); play.setAttribute('aria-label', 'Iniciar simulação'); play.setAttribute('aria-pressed', 'false');
  const prev = button('‹', 'ca-icon-btn'); prev.setAttribute('aria-label', 'Faixa anterior');
  const next = button('›', 'ca-icon-btn'); next.setAttribute('aria-label', 'Próxima faixa');
  const seek = range(0, tracks[0][2], 0, 'Posição na simulação'); seek.step = 1;
  const clock = el('span', 'ca-clock', '0:00'); const duration = el('span', 'ca-clock');
  const format = value => Math.floor(value / 60) + ':' + String(Math.floor(value % 60)).padStart(2, '0');
  const volume = range(0, 100, 65, 'Nível visual de volume'); const volumeText = el('output', 'ca-control-output', '65%');
  const update = () => { clock.textContent = format(seconds); duration.textContent = format(tracks[track][2]); seek.value = String(Math.floor(seconds)); play.textContent = playing ? 'Ⅱ' : '▶'; play.setAttribute('aria-label', playing ? 'Pausar simulação' : 'Iniciar simulação'); play.setAttribute('aria-pressed', String(playing)); player.classList.toggle('ca-is-playing', playing); };
  const change = step => { track = (track + step + tracks.length) % tracks.length; seconds = 0; last = null; trackTitle.textContent = tracks[track][0]; artist.textContent = tracks[track][1]; seek.max = tracks[track][2]; update(); };
  const info = append(el('div', 'ca-player-info'), label('SESSÃO SINTÉTICA · ' + tracks.length + ' FAIXAS'), trackTitle, artist, append(el('div', 'ca-player-controls'), prev, play, next), seek, append(el('div', 'ca-player-time'), clock, duration), append(el('label', 'ca-control-row'), label('NÍVEL VISUAL'), volume, volumeText));
  append(player, cover, info); root.append(player);
  let stopPlayback = () => {}, reducedClock = 0;
  const advance = step => { seconds = Math.min(tracks[track][2], seconds + step); if (seconds >= tracks[track][2]) { playing = false; syncPlayback(); } update(); };
  const syncPlayback = () => {
    stopPlayback(); clearInterval(reducedClock); reducedClock = 0; last = null;
    if (!playing) return;
    if (life.reduced) reducedClock = setInterval(() => { if (life.visible) advance(1); }, 1000);
    else stopPlayback = life.animate((time, reduced) => { if (reduced) { last = null; return; } if (last !== null) advance(Math.max(0, Math.min((time - last) / 1000, .25))); last = time; }, 12);
  };
  life.listen(play, 'click', () => { playing = !playing; update(); syncPlayback(); });
  life.listen(matchMedia('(prefers-reduced-motion: reduce)'), 'change', syncPlayback);
  life.cleanup(() => { stopPlayback(); clearInterval(reducedClock); });
  life.listen(prev, 'click', () => change(-1)); life.listen(next, 'click', () => change(1));
  life.listen(seek, 'input', () => { seconds = Number(seek.value); update(); });
  life.listen(volume, 'input', () => { volumeText.textContent = volume.value + '%'; });

  update();
}
function mountControlDeck(host, life) {
  const root = frame(host, 'deck', 'Control / Estúdio local', 'Ajustes mudam apenas a aparência desta prévia.');
  const tabs = el('div', 'ca-tabs'); tabs.setAttribute('role', 'tablist'); tabs.setAttribute('aria-label', 'Seções do estúdio');
  const content = el('div', 'ca-deck-content');
  const preview = append(el('div', 'ca-deck-preview'), label('CANVAS / 01'), append(el('div', 'ca-deck-emblem'), el('i'), el('i'), el('i')), el('strong', '', 'FORM / FREQUENCY'));
  const settings = el('div', 'ca-deck-settings');
  const values = { glow: 55, scale: 60, grid: true, contrast: false };
  const tabNames = ['Aparência', 'Composição', 'Detalhes']; let current = 0;
  const modal = el('div', 'ca-settings-modal'); modal.hidden = true; modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'false'); modal.setAttribute('aria-label', 'Preferências da prévia');
  const modalClose = button('Concluir'); const reset = button('Restaurar padrão', 'ca-btn ca-btn-quiet');
  append(modal, label('PREFERÊNCIAS LOCAIS'), el('h4', '', 'Uma superfície, seu ritmo.'), el('p', '', 'Todos os ajustes valem somente para esta demonstração.'), append(el('div', 'ca-actions'), reset, modalClose));
  const apply = () => { preview.style.setProperty('--ca-preview-glow', values.glow / 100); preview.style.setProperty('--ca-preview-scale', .65 + values.scale / 130); preview.classList.toggle('ca-grid-off', !values.grid); preview.classList.toggle('ca-high-contrast', values.contrast); };
  const makeSlider = (name, key) => { const input = range(0, 100, values[key], name); const output = el('output', 'ca-control-output', values[key] + '%'); input.dataset.deckKey = key; return append(el('label', 'ca-deck-control'), append(el('span', 'ca-control-title'), label(name), output), input); };
  const makeToggle = (name, key) => { const input = el('input', 'ca-switch-input'); input.type = 'checkbox'; input.checked = values[key]; input.dataset.deckKey = key; return append(el('label', 'ca-toggle-row'), label(name), input, el('span', 'ca-switch')); };
  life.listen(settings, 'input', event => { const input = event.target; const key = input.dataset.deckKey; if (!key) return; values[key] = input.type === 'checkbox' ? input.checked : Number(input.value); const output = input.closest('.ca-deck-control')?.querySelector('output'); if (output) output.textContent = input.value + '%'; apply(); });
  const render = () => {
    settings.replaceChildren();
    if (current === 0) settings.append(makeSlider('LUMINOSIDADE', 'glow'), makeToggle('Contraste acentuado', 'contrast'));
    if (current === 1) settings.append(makeSlider('ESCALA DO SÍMBOLO', 'scale'), makeToggle('Grade de composição', 'grid'));
    if (current === 2) settings.append(el('p', 'ca-deck-note', 'Um laboratório de composição. Sem acesso a configurações do dispositivo.'), label('ARQUIVO CONCEITUAL / 002'), label('PALETA · MENTA / CARVÃO'));
    [...tabs.children].forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === current)); tab.tabIndex = i === current ? 0 : -1; }); apply();
  };
  const unique = 'ca-deck-' + Math.random().toString(36).slice(2, 9); settings.id = unique; settings.setAttribute('role', 'tabpanel');
  tabNames.forEach((name, i) => { const tab = button(name, 'ca-tab'); tab.id = unique + '-tab-' + i; tab.setAttribute('role', 'tab'); tab.setAttribute('aria-controls', unique); life.listen(tab, 'click', () => { current = i; settings.setAttribute('aria-labelledby', tab.id); render(); }); life.listen(tab, 'keydown', event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); current = (current + (event.key === 'ArrowRight' ? 1 : 2)) % 3; settings.setAttribute('aria-labelledby', tabs.children[current].id); render(); tabs.children[current].focus(); } }); tabs.append(tab); });
  settings.setAttribute('aria-labelledby', unique + '-tab-0');
  const preferences = button('Preferências', 'ca-btn ca-btn-quiet');
  life.listen(preferences, 'click', () => { modal.hidden = false; preferences.setAttribute('aria-expanded', 'true'); modalClose.focus(); });
  const close = () => { modal.hidden = true; preferences.setAttribute('aria-expanded', 'false'); preferences.focus(); };
  preferences.setAttribute('aria-expanded', 'false'); life.listen(modalClose, 'click', close);
  life.listen(modal, 'keydown', event => { if (event.key === 'Escape') close(); });
  life.listen(reset, 'click', () => { Object.assign(values, { glow: 55, scale: 60, grid: true, contrast: false }); render(); });
  append(content, preview, settings); append(root, tabs, content, preferences, modal); render();
}
function mountOsd(host, life) {
  const root = frame(host, 'osd', 'Overlay / Indicador transitório', 'Um aviso visual aparece a cada mudança e desaparece em 2 segundos.');
  const stage = append(el('div', 'ca-osd-stage'), append(el('div', 'ca-osd-background'), label('ATMOSPHERE'), el('strong', '', 'Ajuste a luz\nda cena.')));
  const osd = el('div', 'ca-osd-popup'); osd.hidden = true;
  const value = el('strong', '', '60%'); const fill = el('i'); const meter = append(el('div', 'ca-osd-meter'), fill);
  append(osd, icon('sun', 'ca-osd-icon'), append(el('div', 'ca-osd-body'), append(el('div', 'ca-osd-title'), label('LUZ DA PRÉVIA'), value), meter));
  stage.append(osd);
  const input = range(10, 100, 60, 'Luz da prévia'); const output = el('output', 'ca-control-output', '60%'); let hide;
  const status = el('p', 'ca-hint', 'Ajuste somente visual, sem acesso à tela.'); status.setAttribute('role', 'status');
  const show = () => { clearTimeout(hide); osd.hidden = false; value.textContent = input.value + '%'; output.textContent = input.value + '%'; fill.style.width = input.value + '%'; stage.style.setProperty('--ca-light', .24 + Number(input.value) / 160); status.textContent = 'Luz da prévia: ' + input.value + '%.'; hide = setTimeout(() => { osd.hidden = true; }, 2000); };
  life.listen(input, 'input', show); life.cleanup(() => clearTimeout(hide));
  append(root, stage, append(el('label', 'ca-control-row'), label('LUZ DA CENA'), input, output), status);
}
function mountCapture(host, life) {
  const root = frame(host, 'capture', 'Region / Seleção visual', 'Arraste dentro da área ou use as setas. Esta demo não captura a tela.');
  const toolbar = el('div', 'ca-capture-toolbar'); toolbar.setAttribute('role', 'group'); toolbar.setAttribute('aria-label', 'Modos de simulação');
  const areaMode = button('Área', 'ca-capture-mode'); const frameMode = button('Quadro', 'ca-capture-mode'); const recMode = button('REC', 'ca-capture-mode'); const modeButtons = [areaMode, frameMode, recMode];
  const captureAction = button('Marcar quadro'); const hud = append(el('div', 'ca-capture-hud'), label('ÁREA · PRÉVIA LOCAL'), label('00:00:00', 'ca-capture-timecode'));
  const hudMode = hud.firstElementChild, timecode = hud.lastElementChild;
  let mode = 0, recording = false, ticks = 0; const recTimers = [];
  const stage = el('div', 'ca-capture-stage'); stage.tabIndex = 0; stage.setAttribute('role', 'group'); stage.setAttribute('aria-label', 'Área de seleção visual. Arraste para criar uma região; setas movem; Shift e setas redimensionam; Escape limpa.');
  const decor = append(el('div', 'ca-capture-decor'), label('CANVAS LOCAL / 960 × 540'), el('strong', '', 'Defina\num recorte.'), label('SEM CAPTURA OU EXPORTAÇÃO'));
  const selection = el('div', 'ca-selection'); selection.setAttribute('aria-hidden', 'true');
  ['tl', 'tr', 'bl', 'br'].forEach(corner => selection.append(el('i', 'ca-selection-corner ca-corner-' + corner)));
  const dimensions = label('', 'ca-selection-size'); selection.append(dimensions);
  append(stage, decor, selection, hud);
  const readout = el('output', 'ca-capture-readout'); readout.setAttribute('aria-live', 'polite');
  const reset = button('Restaurar seleção', 'ca-btn ca-btn-quiet'); const clear = button('Limpar', 'ca-btn ca-btn-quiet');
  let rect = { x: .19, y: .2, w: .55, h: .56 }, drag = null;
  const update = () => { selection.hidden = !rect; if (!rect) { readout.textContent = 'Nenhuma região selecionada.'; return; } selection.style.left = rect.x * 100 + '%'; selection.style.top = rect.y * 100 + '%'; selection.style.width = rect.w * 100 + '%'; selection.style.height = rect.h * 100 + '%'; const w = Math.round(rect.w * 960), h = Math.round(rect.h * 540); dimensions.textContent = w + ' × ' + h; readout.textContent = 'Região visual: ' + w + ' × ' + h + ' · X ' + Math.round(rect.x * 960) + ' / Y ' + Math.round(rect.y * 540); };
  const point = event => { const box = stage.getBoundingClientRect(); return { x: Math.max(0, Math.min(1, (event.clientX - box.left) / box.width)), y: Math.max(0, Math.min(1, (event.clientY - box.top) / box.height)) }; };
  life.listen(stage, 'pointerdown', event => { if (event.button !== 0) return; event.preventDefault(); stage.focus(); drag = point(event); stage.setPointerCapture(event.pointerId); rect = { x: drag.x, y: drag.y, w: 0, h: 0 }; update(); });
  life.listen(stage, 'pointermove', event => { if (!drag) return; const p = point(event); rect = { x: Math.min(p.x, drag.x), y: Math.min(p.y, drag.y), w: Math.abs(p.x - drag.x), h: Math.abs(p.y - drag.y) }; update(); });
  const finish = event => { if (!drag) return; drag = null; if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId); if (rect && (rect.w < .01 || rect.h < .01)) rect = null; update(); };
  life.listen(stage, 'pointerup', finish); life.listen(stage, 'pointercancel', finish); life.listen(stage, 'lostpointercapture', () => { drag = null; });
  life.listen(stage, 'keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); rect = null; update(); return; }
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault(); if (!rect) rect = { x: .2, y: .2, w: .4, h: .4 };
    const dx = event.key === 'ArrowLeft' ? -.01 : event.key === 'ArrowRight' ? .01 : 0;
    const dy = event.key === 'ArrowUp' ? -.01 : event.key === 'ArrowDown' ? .01 : 0;
    if (event.shiftKey) { rect.w = Math.max(.03, Math.min(1 - rect.x, rect.w + dx)); rect.h = Math.max(.03, Math.min(1 - rect.y, rect.h + dy)); }
    else { rect.x = Math.max(0, Math.min(1 - rect.w, rect.x + dx)); rect.y = Math.max(0, Math.min(1 - rect.h, rect.y + dy)); } update();
  });
  const stopRecording = () => { recTimers.forEach(clearTimeout); recTimers.length = 0; recording = false; stage.classList.remove('ca-is-recording'); captureAction.textContent = 'Simular REC · 5s'; hudMode.textContent = 'REC · SIMULAÇÃO ENCERRADA'; };
  modeButtons.forEach((b, i) => {
    b.setAttribute('aria-pressed', String(i === 0)); toolbar.append(b);
    life.listen(b, 'click', () => { if (recording) stopRecording(); mode = i; modeButtons.forEach((item, n) => item.setAttribute('aria-pressed', String(i === n))); hudMode.textContent = ['ÁREA · PRÉVIA LOCAL', 'QUADRO · MARCAÇÃO VISUAL', 'REC · SIMULAÇÃO DE 5s'][i]; captureAction.textContent = i === 2 ? 'Simular REC · 5s' : 'Marcar quadro'; timecode.textContent = '00:00:00'; });
  });
  life.listen(captureAction, 'click', () => {
    if (mode === 2) {
      if (recording) { stopRecording(); return; }
      recording = true; ticks = 0; timecode.textContent = '00:00:00'; stage.classList.add('ca-is-recording'); captureAction.textContent = 'Encerrar simulação'; hudMode.textContent = 'REC · SIMULAÇÃO VISUAL';
      for (let i = 1; i <= 5; i++) recTimers.push(setTimeout(() => { ticks = i; timecode.textContent = '00:00:' + String(ticks).padStart(2, '0'); if (i === 5) stopRecording(); }, i * 1000));
    } else {
      stage.classList.remove('ca-frame-flash'); void stage.offsetWidth; stage.classList.add('ca-frame-flash'); hudMode.textContent = 'QUADRO MARCADO · SEM ARQUIVO';
      timer(life, () => stage.classList.remove('ca-frame-flash'), 400);
    }
  });
  life.cleanup(() => { recTimers.forEach(clearTimeout); });
  life.listen(reset, 'click', () => { rect = { x: .19, y: .2, w: .55, h: .56 }; update(); });
  life.listen(clear, 'click', () => { rect = null; update(); });
  append(root, toolbar, stage, readout, append(el('div', 'ca-actions'), captureAction, reset, clear), el('p', 'ca-hint', '↑ ↓ ← → mover · Shift + setas dimensionar · Esc limpar')); update();
}
function mountDock(host, life) {
  const root = frame(host, 'dock', 'Spaces / Navegação de workspace', 'Troque o contexto desta cena. Nenhuma área de trabalho real é alterada.');
  const stage = el('div', 'ca-dock-scene');
  const title = el('h3', '', 'Estúdio'); const description = el('p', '', 'Formas, cores e ideias em andamento.');
  const sceneArt = append(el('div', 'ca-workspace-art'), el('i'), el('i'), el('i'));
  append(stage, append(el('div', 'ca-workspace-copy'), label('WORKSPACE CONCEITUAL'), title, description), sceneArt);
  const dock = el('div', 'ca-dock-rail'); dock.setAttribute('role', 'group'); dock.setAttribute('aria-label', 'Selecionar workspace conceitual');
  const spaces = [['studio', 'Estúdio', 'Formas, cores e ideias em andamento.'], ['code', 'Código', 'Um espaço para construir e experimentar.'], ['research', 'Pesquisa', 'Referências, perguntas e descobertas.'], ['pause', 'Pausa', 'Um intervalo para observar o próximo passo.']];
  let active = 0;
  const buttons = spaces.map((space, i) => {
    const item = button('', 'ca-dock-item'); item.setAttribute('aria-label', space[1]); item.setAttribute('aria-pressed', String(i === 0));
    append(item, icon(space[0], 'ca-dock-symbol'), label(space[1], 'ca-dock-label'), el('i', 'ca-dock-dot'));
    life.listen(item, 'click', () => { active = i; title.textContent = space[1]; description.textContent = space[2]; stage.dataset.space = String(i); buttons.forEach((b, n) => b.setAttribute('aria-pressed', String(n === active))); });
    life.listen(item, 'pointerenter', () => { buttons.forEach((b, n) => b.style.setProperty('--ca-dock-lift', n === i ? '-9px' : Math.abs(n - i) === 1 ? '-3px' : '0px')); });
    life.listen(item, 'pointerleave', () => { buttons.forEach(b => b.style.setProperty('--ca-dock-lift', '0px')); });
    dock.append(item); return item;
  });
  const status = el('p', 'ca-hint', 'Seleção visual local · 4 espaços'); append(root, stage, dock, status);
}
export const panelEffects = [
  { id: 'hud-panel', title: 'Painel de missão', category: 'Interfaces', summary: 'Moldura chanfrada, profundidade e revelação finita.', mount: mountHud },
  { id: 'telemetry-gauges', title: 'Telemetria sintética', category: 'Interfaces', summary: 'Medidores e forma de onda controlados por intensidade.', mount: mountTelemetry },
  { id: 'launcher-search', title: 'Busca de itens', category: 'Interfaces', summary: 'Filtro local com seleção pelo teclado e prévia.', mount: mountLauncher },
  { id: 'notification-stack', title: 'Pilha de notificações', category: 'Interfaces', summary: 'Eventos locais adicionáveis e dispensáveis, com limite visível.', mount: mountNotifications },
  { id: 'media-player', title: 'Player conceitual', category: 'Interfaces', summary: 'Faixas imaginárias, timeline e controles sem áudio.', mount: mountMedia },
  { id: 'control-deck', title: 'Estúdio de controles', category: 'Interfaces', summary: 'Abas, sliders e toggles ajustam uma composição local.', mount: mountControlDeck },
  { id: 'osd-toast', title: 'Indicador transitório', category: 'Interfaces', summary: 'Um controle visual mostra um OSD com duração finita.', mount: mountOsd },
  { id: 'capture-region', title: 'Região visual', category: 'Interfaces', summary: 'Seleção limitada ao canvas, com arraste e teclado.', mount: mountCapture },
  { id: 'workspace-dock', title: 'Dock de espaços', category: 'Interfaces', summary: 'Contextos locais e resposta de hover com movimento finito.', mount: mountDock }
].map(effect => ({ ...effect, sourcePaths }));
