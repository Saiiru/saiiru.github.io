import { element } from '../core/lifecycle.js'
const sourcePaths=['components/effects/scenes.js','components/effects/scenes.css']
const entry=(id,title,category,summary,mount)=>({id,title,category,summary,sourcePaths,mount})
const svgNode=(name,attributes={})=>{const n=document.createElementNS('http://www.w3.org/2000/svg',name);for(const [k,v]of Object.entries(attributes))n.setAttribute(k,String(v));return n}
export const sceneEffects=[
 entry('scanner-overkill','Scanner de alvo','Sinal','Moldura desenhada, mira rotativa e alerta; só reage dentro desta prévia.',(host,life)=>{
  const zone=element('div','ca-scanner');const svg=svgNode('svg',{viewBox:'0 0 640 320','aria-hidden':'true'})
  svg.append(svgNode('path',{d:'M22 74V22H180M460 22H618V74M22 246V298H180M460 298H618V246',class:'ca-scanner-frame'}))
  for(let x=70;x<620;x+=36)svg.append(svgNode('path',{d:'M'+x+' 18v6M'+x+' 296v6',class:'ca-scanner-tick'}))
  const horizontal=svgNode('path',{d:'M22 160H618',class:'ca-scanner-axis'}),vertical=svgNode('path',{d:'M320 22V298',class:'ca-scanner-axis'})
  const target=svgNode('g');target.append(svgNode('circle',{r:31}),svgNode('circle',{r:43,'stroke-dasharray':'9 12'}),svgNode('path',{d:'M-56 0h28M28 0h28M0-56v28M0 28v28'}));svg.append(horizontal,vertical,target)
  const banner=element('div','ca-scanner-banner','ÁREA LOCAL / NENHUMA CAPTURA');zone.append(svg,banner);host.append(zone)
  let x=320,y=160;life.listen(zone,'pointermove',event=>{if(life.reduced)return;const r=zone.getBoundingClientRect();x=Math.max(60,Math.min(580,(event.clientX-r.left)/r.width*640));y=Math.max(60,Math.min(260,(event.clientY-r.top)/r.height*320))})
  life.animate((time,reduced)=>{target.setAttribute('transform','translate('+x+' '+y+') rotate('+(reduced?0:time*.018)+')');horizontal.setAttribute('d','M22 '+y+'H618');vertical.setAttribute('d','M'+x+' 22V298')},24)
 }),
 entry('boot-sequence','Sequência de inicialização','Interfaces','Logs e progresso de módulos simulados, sem bloquear a navegação.',(host,life)=>{
  const zone=element('div','ca-boot'),title=element('h3','','BLACKSITE / WEB RUNTIME'),status=element('p','ca-fine','SIMULAÇÃO LOCAL / SEM INICIAR PROCESSOS')
  const log=element('ol','ca-boot-log'),progress=element('progress');progress.max=8;progress.value=0;progress.setAttribute('aria-label','Módulos da demonstração')
  const button=element('button','ca-button','Iniciar sequência');button.type='button';const result=element('p','ca-fine','Aguardando início.');result.setAttribute('role','status')
  zone.append(title,status,log,progress,button,result);host.append(zone)
  const messages=['Carregar tokens locais','Montar geometria vetorial','Preparar eventos de ponteiro','Ler preferência de movimento','Limitar trabalho por quadro','Verificar estado da janela','Preparar alternativa estática','Interface disponível']
  let stop=()=>{}
  life.listen(button,'click',()=>{stop();log.replaceChildren();progress.value=0;let rendered=0;result.textContent='Sequência em andamento.';stop=life.animate((time,reduced)=>{const count=reduced?8:Math.min(8,Math.floor(time/240)+1);while(rendered<count){log.append(element('li','',messages[rendered]));rendered++}progress.value=count;if(count===8){result.textContent='Prévia completa. Nenhum serviço do sistema foi iniciado.';stop()}},12)})
  life.cleanup(()=>stop())
 }),
 entry('market-terminal','Terminal de dados','Interfaces','Gráfico, filtro e detalhe de um feed sintético; sem cotações ou notícias reais.',(host,life)=>{
  const zone=element('div','ca-market');zone.append(element('p','ca-fine','SÉRIE SINTÉTICA / NÃO É UM SERVIÇO FINANCEIRO'))
  const svg=svgNode('svg',{viewBox:'0 0 640 160','aria-hidden':'true'});for(let y=20;y<160;y+=32)svg.append(svgNode('path',{d:'M0 '+y+'H640',class:'ca-market-grid'}))
  svg.append(svgNode('path',{d:'M0 130L32 108L64 114L96 84L128 93L160 66L192 88L224 52L256 70L288 57L320 74L352 43L384 62L416 31L448 48L480 24L512 53L544 19L576 37L608 15L640 25',class:'ca-market-line'}));zone.append(svg)
  const label=element('label','ca-control-label','Filtrar registros'),input=element('input');input.type='search';label.append(input);zone.append(label)
  const list=element('div','ca-market-feed'),detail=element('p','ca-market-detail','Selecione um registro para abrir o detalhe.');detail.setAttribute('role','status')
  const records=[['Interface','Rastro de foco revisto','Exemplo fictício: o foco continua visível durante a troca de painel.'],['Render','Orçamento preservado','Exemplo fictício: os efeitos param quando a página fica oculta.'],['Acesso','Alternativa sem movimento','Exemplo fictício: todas as informações permanecem disponíveis sem animação.']]
  const render=()=>{list.replaceChildren();const found=records.filter(r=>r.join(' ').toLocaleLowerCase('pt').includes(input.value.trim().toLocaleLowerCase('pt')));for(const [tag,title,body]of found){const button=element('button','ca-market-record');button.type='button';button.append(element('span','ca-fine',tag),element('strong','',title));button.dataset.record=String(records.findIndex(record=>record[2]===body));list.append(button)}if(!found.length)list.append(element('p','','Nenhum registro com esse filtro.'))}
  life.listen(list,'click',event=>{const button=event.target.closest('[data-record]');if(button&&list.contains(button)){const record=records[Number(button.dataset.record)];if(record)detail.textContent=record[2]}})
  life.listen(input,'input',render);zone.append(list,detail);host.append(zone);render()
 }),
 entry('hud-layout','Composição de HUD','Interfaces','Posição, escala, visibilidade e presets de widgets; altera só esta cena.',(host,life)=>{
  const zone=element('div','ca-layout'),canvas=element('div','ca-layout-stage'),controls=element('div','ca-layout-controls')
  canvas.setAttribute('aria-label','Prévia local da disposição dos widgets')
  const widgets=[{name:'Sinal',x:4,y:8,scale:1,show:true},{name:'Canal',x:58,y:10,scale:1,show:true},{name:'Registro',x:31,y:63,scale:1,show:true}]
  const nodes=widgets.map((w,i)=>{const n=element('div','ca-layout-widget');n.append(element('span','ca-fine','WIDGET '+(i+1)),element('strong','',w.name));canvas.append(n);return n})
  const label=element('label','ca-control-label','Widget'),select=element('select');widgets.forEach((w,i)=>{const o=element('option','',w.name);o.value=i;select.append(o)});label.append(select);controls.append(label)
  const ranges={};for(const [key,name,max]of [['x','Horizontal',75],['y','Vertical',75],['scale','Escala',1.3]]){const row=element('label','ca-control-label',name),input=element('input');input.type='range';input.min=key==='scale'?'.7':'0';input.max=max;input.step=key==='scale'?'.05':'1';ranges[key]=input;row.append(input);controls.append(row)}
  const showLabel=element('label','ca-check','Visível'),check=element('input');check.type='checkbox';showLabel.prepend(check);controls.append(showLabel)
  const presets=element('div','ca-actions');for(const [name,positions]of [['Cantos',[[4,8],[58,10],[31,63]]],['Coluna',[[4,4],[4,36],[4,68]]]]){const b=element('button','ca-button',name);b.type='button';life.listen(b,'click',()=>{widgets.forEach((w,i)=>{w.x=positions[i][0];w.y=positions[i][1]});render();sync()});presets.append(b)}controls.append(presets)
  function render(){widgets.forEach((w,i)=>{nodes[i].style.left=w.x+'%';nodes[i].style.top=w.y+'%';nodes[i].style.transform='scale('+w.scale+')';nodes[i].hidden=!w.show})}
  function sync(){const w=widgets[+select.value];for(const key in ranges)ranges[key].value=w[key];check.checked=w.show}
  life.listen(select,'change',sync);for(const key in ranges)life.listen(ranges[key],'input',()=>{widgets[+select.value][key]=Number(ranges[key].value);render()});life.listen(check,'change',()=>{widgets[+select.value].show=check.checked;render()})
  zone.append(canvas,controls,element('p','ca-fine','NÃO ALTERA O HUD OU A CONFIGURAÇÃO DO DESKTOP'));host.append(zone);render();sync()
 })
]
