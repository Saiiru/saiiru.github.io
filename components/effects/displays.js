import { element } from '../core/lifecycle.js';

// Original Canvas2D studies. No camera, audio capture, network, fonts or shaders.
const SOURCES = ['components/effects/displays.js', 'components/effects/displays.css'];
let instance = 0;
const TAU = Math.PI * 2;
const wave = (t, i) => (Math.sin(t + i * 1.71) + Math.sin(t * .63 + i * .37)) * .25 + .5;

function panel(host, title, description, note) {
  const root = element('section', 'ca-display');
  const top = element('div', 'ca-display-top');
  const label = element('span', 'ca-display-label', title);
  const badge = element('span', 'ca-demo-badge', 'DEMO');
  top.append(label, badge);
  const viewport = element('div', 'ca-display-viewport');
  const canvas = element('canvas', 'ca-display-canvas');
  canvas.setAttribute('aria-hidden', 'true');
  viewport.append(canvas);
  const equivalent = element('p', 'ca-display-equivalent', description);
  const controls = element('div', 'ca-display-controls');
  const foot = element('div', 'ca-display-foot', note);
  root.append(top, viewport, equivalent, controls, foot);
  host.append(root);
  return { root, canvas, controls, foot };
}

function surface(canvas, life, draw, fps = 20) {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.replaceWith(element('p', 'ca-display-fallback', 'Prévia indisponível: este navegador não oferece Canvas 2D. A descrição do efeito permanece abaixo.'));
    return () => {};
  }
  let lastTime = 0;
  const render = (ms = lastTime, reduced = life.reduced) => {
    lastTime = ms;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    ctx.setTransform(w / 900, 0, 0, h / 500, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.shadowBlur = 0;
    ctx.setLineDash([]);
    draw(ctx, reduced ? 2.4 : ms / 1000, reduced);
  };
  life.animate(render, Math.min(fps, 24));
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(() => render());
    observer.observe(canvas);
    life.cleanup(() => observer.disconnect());
  }
  return () => render();
}

function line(ctx, points, color, width = 1) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.stroke();
}
function text(ctx, value, x, y, size = 14, color = '#94a5ad') {
  ctx.fillStyle = color;
  ctx.font = size + 'px ui-monospace, SFMono-Regular, Consolas, monospace';
  ctx.fillText(value, x, y);
}
function background(ctx, color = '#071217') {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 900, 500);
}
function grid(ctx, color = '#183038', step = 50) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x <= 900; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, 500); }
  for (let y = 0; y <= 500; y += step) { ctx.moveTo(0, y); ctx.lineTo(900, y); }
  ctx.stroke();
}
function field(label, input, controls) {
  input.id = 'ca-display-control-' + (++instance);
  const wrapper = element('label', 'ca-display-field');
  wrapper.htmlFor = input.id;
  wrapper.append(element('span', '', label), input);
  controls.append(wrapper);
}

const presets = [
  { id: 'arctic-facility', name: 'Arctic Facility', ink: '#b2f4ff', accent: '#6bc5df', bg: '#071922', warp: 8, scan: .11, glow: 10 },
  { id: 'blade-baseline', name: 'Blade Baseline', ink: '#d8f0ba', accent: '#c8cf60', bg: '#111b16', warp: 3, scan: .13, glow: 3 },
  { id: 'bloodmoon-veil', name: 'Bloodmoon Veil', ink: '#ffc0b3', accent: '#ed6e63', bg: '#251219', warp: 12, scan: .09, glow: 12 },
  { id: 'crimson-smooth', name: 'Crimson Smooth', ink: '#ffdbd4', accent: '#ff8c86', bg: '#241219', warp: 2, scan: .035, glow: 3 },
  { id: 'ghost-holo', name: 'Ghost Holo', ink: '#c5fff3', accent: '#65d4b9', bg: '#071e21', warp: 0, scan: .09, glow: 16 },
  { id: 'johnny-crt', name: 'Johnny CRT', ink: '#ffe9a7', accent: '#d5b365', bg: '#1e190c', warp: 18, scan: .2, glow: 8 },
  { id: 'kitty-pop', name: 'Kitty Pop', ink: '#ffe0fa', accent: '#f5a2e0', bg: '#281b36', warp: 5, scan: .06, glow: 5 },
  { id: 'newpixie-flat', name: 'Newpixie Flat', ink: '#f6e8b4', accent: '#d9b46e', bg: '#201e25', warp: 0, scan: .07, glow: 4 },
  { id: 'synth-crt', name: 'Synth CRT', ink: '#e2d8ff', accent: '#aa9af2', bg: '#1a142b', warp: 13, scan: .14, glow: 9 }
];

function crtMotif(ctx, p, t) {
  const id = p.id;
  if (id === 'arctic-facility' || id === 'blade-baseline') {
    const pale = id === 'arctic-facility' ? '#d5e5df' : '#67746f';
    line(ctx, [[15, 65], [15, 20], [60, 14], [840, 14], [885, 32], [885, 480], [35, 480], [15, 465], [15, 65]], pale, id === 'arctic-facility' ? 8 : 5);
    [[29, 29], [870, 34], [29, 464], [870, 464]].forEach(([x, y]) => {
      ctx.fillStyle = '#82948f'; ctx.beginPath(); ctx.arc(x, y, 4, 0, TAU); ctx.fill();
      line(ctx, [[x - 2, y + 2], [x + 2, y - 2]], '#142624', 1);
    });
    if (id === 'arctic-facility') {
      for (let i = 0; i < 19; i++) {
        const y = 80 + i * 5;
        const twist = Math.sin(i * .32 + t * .6);
        const x1 = 780 + twist * 38, x2 = 780 - twist * 38;
        line(ctx, [[x1, y], [x2, y]], '#8cd5d256', 1);
        ctx.fillStyle = '#b2f4ff'; ctx.beginPath(); ctx.arc(x1, y, 2.1, 0, TAU); ctx.fill();
        ctx.fillStyle = '#61a8ba'; ctx.beginPath(); ctx.arc(x2, y, 2.1, 0, TAU); ctx.fill();
      }
    } else {
      for (let i = 0; i < 8; i++) line(ctx, [[698 + i * 18, 95], [698 + i * 18, 154]], '#596e6760', 6);
      ctx.fillStyle = '#b7dac2'; ctx.beginPath(); ctx.arc(825, 171, 4, 0, TAU); ctx.fill();
      text(ctx, 'BASELINE / 010', 678, 88, 12, p.accent);
    }
  } else if (id === 'bloodmoon-veil') {
    const halo = ctx.createRadialGradient(760, 128, 15, 760, 128, 120);
    halo.addColorStop(0, '#bd696b72'); halo.addColorStop(1, '#ac475200');
    ctx.fillStyle = halo; ctx.fillRect(620, 0, 280, 270);
    ctx.fillStyle = '#b55f5b'; ctx.beginPath(); ctx.arc(760, 128, 47, 0, TAU); ctx.fill();
    ctx.fillStyle = '#773d4670'; ctx.beginPath(); ctx.arc(749, 117, 16, 0, TAU); ctx.fill();
    ctx.fillStyle = '#34151d9c'; ctx.beginPath(); ctx.ellipse(760, 161, 84, 12, -.12, 0, TAU); ctx.fill();
    for (let j = 0; j < 3; j++) {
      const fog = [];
      for (let x = 0; x <= 900; x += 10) fog.push([x, 411 + j * 18 + Math.sin(x * .008 + t * .18 + j) * 14]);
      line(ctx, fog, '#c3838714', 20);
    }
    line(ctx, [[29, 79], [29, 437]], '#c97a745b', 1);
    for (let y = 90; y < 430; y += 20) line(ctx, [[29, y], [35, y]], '#c97a745b', 1);
  } else if (id === 'crimson-smooth') {
    const sheen = ctx.createLinearGradient(0, 0, 900, 500);
    sheen.addColorStop(0, '#e47e8525'); sheen.addColorStop(.5, '#38171e00'); sheen.addColorStop(1, '#d9656630');
    ctx.fillStyle = sheen; ctx.fillRect(18, 18, 864, 464);
    ctx.strokeStyle = '#ec91945e'; ctx.lineWidth = 1;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(18, 18, 864, 464, 24);
    else ctx.rect(18, 18, 864, 464);
    ctx.stroke();
    line(ctx, [[680, 110], [815, 110]], '#f4b7b23d', 1);
    line(ctx, [[700, 126], [835, 126]], '#f4b7b22d', 1);
  } else if (id === 'ghost-holo') {
    ctx.strokeStyle = '#8cf1c540'; ctx.strokeRect(19, 19, 862, 462); ctx.strokeRect(26, 26, 848, 448);
    [[37, 75, 1, 1], [863, 75, -1, 1], [37, 425, 1, -1], [863, 425, -1, -1]].forEach(([x, y, dx, dy]) => line(ctx, [[x, y + 20 * dy], [x, y], [x + 20 * dx, y]], '#a7e9d3', 2));
    for (let i = 0; i < 4; i++) {
      ctx.globalAlpha = .14 - i * .025;
      text(ctx, 'GHOST / 04', 710 + i * 2, 121 + i * 5, 18, p.ink);
    }
    ctx.globalAlpha = 1;
  } else if (id === 'kitty-pop') {
    ctx.strokeStyle = '#edb5de45'; ctx.lineWidth = 3; ctx.strokeRect(19, 19, 862, 462);
    for (let i = 0; i < 12; i++) {
      const x = 82 + i * 67, y = 85 + i * 37 % 72, r = 3 + (1 + Math.sin(t * .4 + i)) * 1.5;
      line(ctx, [[x - r, y], [x + r, y]], '#f2c9e17a', 1);
      line(ctx, [[x, y - r], [x, y + r]], '#f2c9e17a', 1);
    }
    line(ctx, [[770, 92], [757, 78], [757, 103], [770, 92], [784, 78], [784, 103], [770, 92]], '#f3a9d4', 3);
  } else if (id === 'johnny-crt') {
    ctx.strokeStyle = '#a1873d6b'; ctx.lineWidth = 12; ctx.strokeRect(10, 10, 880, 480);
    for (let y = 26; y < 480; y += 6) {
      ctx.fillStyle = '#ffe7b006'; ctx.fillRect(17, y, 866, 1);
    }
    text(ctx, 'MONO / WARM', 690, 110, 12, '#d5b365');
  } else if (id === 'newpixie-flat') {
    ctx.strokeStyle = '#d4c5a637'; ctx.strokeRect(20, 20, 860, 460);
    for (let x = 670; x < 840; x += 5) {
      ctx.fillStyle = x % 3 === 0 ? '#bb8e9750' : '#93b6ad30';
      ctx.fillRect(x, 90, 1, 55);
    }
    text(ctx, 'PIXEL / 1:1', 680, 167, 12, p.accent);
  } else if (id === 'synth-crt') {
    for (let i = 0; i < 9; i++) {
      const y = 325 + i * i * 2.6;
      line(ctx, [[30, y], [870, y]], '#ac8bda28', 1);
    }
    for (let i = -7; i <= 7; i++) line(ctx, [[450 + i * 11, 320], [450 + i * 95, 500]], '#b08edb28', 1);
    ctx.strokeStyle = '#bd9bd16c'; ctx.beginPath(); ctx.arc(775, 115, 36, Math.PI, 0); ctx.stroke();
  }
}

function mountCRT(host, life) {
  const ui = panel(host, 'PHOSPHOR / 09', 'Nove interpretações originais de CRT: instalação com hélice, painel usinado, lua e névoa, vidro vermelho, holograma, fósforo quente, estrelas, pixels e grade synth. Scanlines, brilho e ecos cromáticos são aproximações visuais.', 'Equivalentes aproximados em Canvas 2D · sem pipeline Slang');
  const select = element('select', 'ca-display-select');
  presets.forEach(p => {
    const option = element('option', '', p.name);
    option.value = p.id;
    select.append(option);
  });
  field('Perfil visual', select, ui.controls);
  let preset = presets[0];
  let redraw = () => {};
  life.listen(select, 'change', () => {
    preset = presets.find(p => p.id === select.value) || presets[0];
    ui.foot.textContent = preset.name + ' · aproximação Canvas 2D · sem pipeline Slang · DEMO';
    redraw();
  });
  redraw = surface(ui.canvas, life, (ctx, t) => {
    const p = preset;
    background(ctx, p.bg);
    // The curved grid suggests a tube face without executing third-party shaders.
    ctx.strokeStyle = p.accent + '28';
    ctx.lineWidth = 1;
    for (let x = 50; x < 900; x += 50) {
      const bend = (x - 450) / 450 * p.warp;
      ctx.beginPath(); ctx.moveTo(x + bend, 0);
      ctx.quadraticCurveTo(x - bend, 250, x + bend, 500); ctx.stroke();
    }
    for (let y = 50; y < 500; y += 50) {
      const bend = (y - 250) / 250 * p.warp;
      ctx.beginPath(); ctx.moveTo(0, y + bend);
      ctx.quadraticCurveTo(450, y - bend, 900, y + bend); ctx.stroke();
    }
    crtMotif(ctx, p, t);
    text(ctx, 'S / R   OBSERVATORY', 50, 52, 16, p.accent);
    text(ctx, 'SIGNAL STABLE', 684, 52, 14, p.ink);
    ctx.shadowColor = p.accent; ctx.shadowBlur = p.glow;
    const title = p.id === 'kitty-pop' ? 'HELLO, SIGNAL.' : 'STAY CURIOUS.';
    // Subtle stationary chromatic and persistence echoes; never full-screen flashing.
    ctx.globalAlpha = .25; text(ctx, title, 51, 223, 68, '#ed8ca5');
    ctx.globalAlpha = .17; text(ctx, title, 55, 225, 68, '#76dfe6');
    ctx.globalAlpha = 1; text(ctx, title, 53, 224, 68, p.ink);
    ctx.shadowBlur = 0;
    text(ctx, 'IDEIAS EM ÓRBITA. SISTEMAS EM CONSTRUÇÃO.', 55, 265, 16, p.accent);
    line(ctx, [[55, 300], [845, 300]], p.accent + '60');
    for (let i = 0; i < 95; i++) {
      const x = 55 + i * 8.3;
      const y = 374 + Math.sin(i * .15 + t * .6) * 19 + Math.sin(i * .39 - t * .3) * 7;
      ctx.fillStyle = p.accent;
      ctx.fillRect(x, y, p.id === 'newpixie-flat' ? 5 : 2, 3);
    }
    text(ctx, 'LOCAL / 01', 55, 455, 14, p.ink);
    text(ctx, p.id.toUpperCase(), 590, 455, 14, p.accent);
    if (p.id === 'kitty-pop') {
      line(ctx, [[748, 135], [748, 100], [771, 117], [804, 117], [828, 100], [828, 150], [811, 166], [765, 166], [748, 150]], p.ink, 2);
      ctx.fillStyle = p.ink; ctx.fillRect(767, 135, 5, 7); ctx.fillRect(803, 135, 5, 7);
    }
    if (p.scan) {
      ctx.fillStyle = 'rgba(0,0,0,' + p.scan + ')';
      for (let y = 0; y < 500; y += 4) ctx.fillRect(0, y, 900, 1.5);
    }
    const vignette = ctx.createRadialGradient(450, 240, 100, 450, 250, 520);
    vignette.addColorStop(0, 'transparent'); vignette.addColorStop(1, '#00000070');
    ctx.fillStyle = vignette; ctx.fillRect(0, 0, 900, 500);
  }, 18);
}

function mountSpectrum(host, life) {
  const ui = panel(host, 'SPECTRUM / SYNTHETIC', 'Espectro de áudio sintético com 48 bandas. Os dados são gerados por funções matemáticas; nenhum microfone ou arquivo de áudio é utilizado.', '48 bandas · sinal matemático · sem captura de áudio');
  const button = element('button', 'ca-display-button', 'Pausar sinal');
  button.type = 'button';
  button.setAttribute('aria-pressed', 'false');
  ui.controls.append(button);
  let paused = false, phase = 0, last = null;
  let redraw = () => {};
  life.listen(button, 'click', () => {
    paused = !paused;
    button.textContent = paused ? 'Retomar sinal' : 'Pausar sinal';
    button.setAttribute('aria-pressed', String(paused));
    last = null; redraw();
  });
  redraw = surface(ui.canvas, life, (ctx, t, reduced) => {
    if (last !== null && !paused && !reduced) phase += Math.min(.1, Math.max(0, t - last));
    last = t;
    if (reduced) phase = 2.4;
    background(ctx); grid(ctx, '#14272e', 50);
    text(ctx, 'NO INPUT / GENERATED SIGNAL', 45, 48, 15, '#9faeb5');
    text(ctx, '48 CHANNELS', 715, 48, 14, '#83d3bd');
    for (let i = 0; i < 48; i++) {
      const envelope = Math.pow(Math.sin((i + 1) / 50 * Math.PI), .6);
      const h = 18 + envelope * (55 + wave(phase * 1.3, i) * 235);
      const x = 47 + i * 17;
      const gradient = ctx.createLinearGradient(0, 400 - h, 0, 400);
      gradient.addColorStop(0, i > 34 ? '#e9aa8e' : '#a3e4ce');
      gradient.addColorStop(1, '#235d58');
      ctx.fillStyle = gradient; ctx.fillRect(x, 400 - h, 10, h);
      ctx.fillStyle = '#d0efe2'; ctx.fillRect(x, 390 - h, 10, 2);
      ctx.fillStyle = '#71bba617'; ctx.fillRect(x, 410, 10, h * .13);
    }
    line(ctx, [[45, 401], [855, 401]], '#62958b');
    ['20 HZ', '250', '1K', '4K', '20 KHZ'].forEach((s, i) => text(ctx, s, 45 + i * 190, 465, 13));
  }, 24);
}

function mapLines(ctx, color, zoom = 1) {
  ctx.save(); ctx.translate(450, 250); ctx.scale(zoom, zoom); ctx.translate(-450, -250);
  const routes = [
    [[-30, 310], [110, 290], [190, 320], [290, 290], [350, 220], [460, 196], [580, 213], [700, 150], [930, 168]],
    [[125, -20], [180, 100], [262, 166], [290, 290], [340, 390], [410, 530]],
    [[650, -20], [602, 95], [580, 213], [620, 330], [718, 407], [730, 530]],
    [[-20, 120], [180, 100], [310, 72], [453, 116], [602, 95], [785, 72], [930, 110]],
    [[-20, 440], [150, 400], [340, 390], [482, 424], [620, 330], [825, 309], [930, 360]]
  ];
  routes.forEach(points => line(ctx, points, color, 2));
  for (let i = 0; i < 28; i++) {
    const x = 38 + (i * 137 % 815), y = 28 + (i * 83 % 428);
    ctx.strokeStyle = color; ctx.strokeRect(x, y, 16 + i % 4 * 9, 10 + i % 3 * 9);
  }
  ctx.restore();
}

function mountRadar(host, life) {
  const ui = panel(host, 'RADAR / SECTOR 07', 'Mapa vetorial fictício com três marcadores e uma varredura circular. O controle alterna a escala do mapa; não há localização real.', 'Setor fictício · 3 marcadores · sem geolocalização');
  const select = element('select', 'ca-display-select');
  [['1', 'Setor / 1×'], ['1.6', 'Detalhe / 1,6×']].forEach(([value, name]) => {
    const option = element('option', '', name); option.value = value; select.append(option);
  });
  field('Escala do mapa', select, ui.controls);
  let zoom = 1, redraw = () => {};
  life.listen(select, 'change', () => { zoom = Number(select.value); redraw(); });
  redraw = surface(ui.canvas, life, (ctx, t) => {
    background(ctx, '#081918'); grid(ctx, '#15302b', 50);
    mapLines(ctx, '#2b5247', zoom);
    const cx = 450, cy = 250, r = 204, angle = t * .36;
    for (let i = 1; i <= 4; i++) {
      ctx.strokeStyle = '#72b49a35'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, r * i / 4, 0, TAU); ctx.stroke();
    }
    line(ctx, [[cx - r - 18, cy], [cx + r + 18, cy]], '#8ad7b94a');
    line(ctx, [[cx, cy - r - 18], [cx, cy + r + 18]], '#8ad7b94a');
    for (let i = 20; i > 0; i--) {
      const a = angle - i * .021;
      line(ctx, [[cx, cy], [cx + Math.cos(a) * r, cy + Math.sin(a) * r]], 'rgba(139,223,180,' + (1 - i / 21) * .025 + ')', 9);
    }
    line(ctx, [[cx, cy], [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r]], '#a4e8c7', 1.5);
    [[371, 143, 'A-01'], [555, 299, 'B-04'], [410, 355, 'C-12']].forEach(([x, y, label]) => {
      x = cx + (x - cx) * zoom; y = cy + (y - cy) * zoom;
      if (Math.hypot(x - cx, y - cy) > r) return;
      ctx.fillStyle = '#c7efd7'; ctx.fillRect(x - 3, y - 3, 6, 6);
      ctx.strokeStyle = '#96cfab65'; ctx.strokeRect(x - 8, y - 8, 16, 16);
      text(ctx, label, x + 15, y + 5, 12, '#bcddc9');
    });
    text(ctx, 'N', 445, 31, 13, '#bfdfcb'); text(ctx, 'E', 686, 255, 13, '#bfdfcb');
    text(ctx, 'SECTOR 07', 32, 46, 16, '#b7d5c2');
    text(ctx, 'SCAN / LOCAL', 32, 467, 13, '#93b6a4');
    text(ctx, 'SIMULATION', 741, 467, 13, '#93b6a4');
  }, 20);
}

function mountWeather(host, life) {
  const ui = panel(host, 'WEATHER / FIELD NOTES', 'Estação meteorológica demonstrativa: 18 graus Celsius, vento de 12 quilômetros por hora e umidade de 64 por cento. Isóbaras e partículas ilustram o vento; os valores não são previsão real.', 'Dados fictícios fixos · nenhuma API meteorológica');
  ui.controls.append(element('span', 'ca-display-static', 'ESTAÇÃO FICTÍCIA / 23,5° S · 46,6° O'));
  surface(ui.canvas, life, (ctx, t) => {
    background(ctx, '#101b24'); grid(ctx, '#20313c', 50);
    ctx.save(); ctx.beginPath(); ctx.rect(420, 0, 480, 500); ctx.clip();
    for (let j = 0; j < 9; j++) {
      const pts = [];
      for (let x = 380; x < 960; x += 8) pts.push([x, j * 64 - 20 + Math.sin(x * .009 + j * .5) * 42 + Math.cos(x * .015 - j) * 14]);
      line(ctx, pts, j % 3 ? '#729aa63b' : '#9fc8d46b', 1);
    }
    for (let i = 0; i < 30; i++) {
      const x = 435 + ((i * 79 + t * 22) % 445);
      const y = 45 + (i * 61 % 412);
      line(ctx, [[x, y], [x + 9, y - 3]], '#c2dce37a', 1);
    }
    ctx.restore();
    ctx.fillStyle = '#101b24f5'; ctx.fillRect(0, 0, 415, 500);
    text(ctx, 'FIELD STATION / 003', 44, 48, 15, '#9ebbc7');
    text(ctx, '18°', 36, 220, 128, '#e5edf0');
    text(ctx, 'NUBLADO / AMOSTRA', 45, 262, 16, '#b2cbd4');
    line(ctx, [[45, 306], [370, 306]], '#5e7b895c');
    text(ctx, 'VENTO', 45, 347, 12, '#8faab8'); text(ctx, '12 km/h NE', 191, 347, 17, '#d5e3e9');
    text(ctx, 'UMIDADE', 45, 393, 12, '#8faab8'); text(ctx, '64%', 191, 393, 17, '#d5e3e9');
    text(ctx, 'PRESSÃO', 45, 439, 12, '#8faab8'); text(ctx, '1014 hPa', 191, 439, 17, '#d5e3e9');
    ctx.strokeStyle = '#c6dde4'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(670, 213, 41, Math.PI, 0);
    ctx.arc(716, 222, 30, Math.PI * 1.15, TAU); ctx.lineTo(746, 253); ctx.lineTo(625, 253);
    ctx.arc(625, 232, 21, Math.PI / 2, Math.PI * 1.5); ctx.stroke();
    text(ctx, 'ISÓBARAS / CAMPO SINTÉTICO', 472, 460, 13, '#a4c1cc');
    text(ctx, '1014', 788, 95, 12, '#9db9c4');
    text(ctx, '1012', 478, 338, 12, '#9db9c4');
  }, 18);
}

function mountMatrix(host, life) {
  const ui = panel(host, 'GLYPH RAIN / BOUNDED', 'Chuva de glifos com 34 colunas e até 16 caracteres por coluna, desenhados em um único canvas. O botão alterna entre verde fósforo e azul gelo.', '34 colunas · até 544 glifos · nenhum nó criado por quadro');
  const button = element('button', 'ca-display-button', 'Usar azul gelo');
  button.type = 'button'; button.setAttribute('aria-pressed', 'false');
  ui.controls.append(button);
  let ice = false, redraw = () => {};
  life.listen(button, 'click', () => {
    ice = !ice; button.textContent = ice ? 'Usar verde fósforo' : 'Usar azul gelo';
    button.setAttribute('aria-pressed', String(ice)); redraw();
  });
  const glyphs = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ:<>/{}';
  redraw = surface(ui.canvas, life, (ctx, t) => {
    background(ctx, ice ? '#09141d' : '#0b1712');
    ctx.font = '18px ui-monospace, SFMono-Regular, Consolas, monospace';
    for (let col = 0; col < 34; col++) {
      const speed = 23 + col * 17 % 37;
      const head = ((t * speed + col * 83) % 880) - 100;
      for (let row = 0; row < 16; row++) {
        const y = head - row * 23;
        if (y < -20 || y > 520) continue;
        ctx.globalAlpha = (1 - row / 16) * .72;
        ctx.fillStyle = row === 0 ? '#e4fff2' : ice ? '#8fcbe7' : '#72c69b';
        const index = (col * 13 + row * 7 + Math.floor(t * .8)) % glyphs.length;
        ctx.fillText(glyphs[index], 14 + col * 26, y);
      }
    }
    ctx.globalAlpha = 1;
    const fade = ctx.createLinearGradient(0, 340, 0, 500);
    fade.addColorStop(0, 'transparent'); fade.addColorStop(1, ice ? '#09141d' : '#0b1712');
    ctx.fillStyle = fade; ctx.fillRect(0, 340, 900, 160);
    text(ctx, 'A FINITE FIELD OF POSSIBILITIES', 34, 465, 15, ice ? '#bad7e3' : '#bdd9c9');
  }, 18);
}

export const displayEffects = [
  { id: 'crt-display', title: 'Phosphor display', category: 'Displays', summary: 'Nove perfis CRT com fósforo, scanlines e curvatura em Canvas 2D.', sourcePaths: [...SOURCES], mount: mountCRT },
  { id: 'audio-spectrum', title: 'Synthetic spectrum', category: 'Displays', summary: '48 bandas de um sinal matemático, com pausa e reflexo sutil.', sourcePaths: [...SOURCES], mount: mountSpectrum },
  { id: 'radar-map', title: 'Sector radar', category: 'Displays', summary: 'Mapa vetorial fictício, marcadores e varredura com duas escalas.', sourcePaths: [...SOURCES], mount: mountRadar },
  { id: 'weather-scan', title: 'Weather field', category: 'Displays', summary: 'Estação fictícia com isóbaras e partículas de vento.', sourcePaths: [...SOURCES], mount: mountWeather },
  { id: 'matrix-rain', title: 'Bounded glyph rain', category: 'Displays', summary: 'Chuva determinística de glifos em verde fósforo ou azul gelo.', sourcePaths: [...SOURCES], mount: mountMatrix }
];
