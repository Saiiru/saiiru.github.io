import { createLifecycle, element } from './core/lifecycle.js'
import { signalEffects } from './effects/signals.js'
import { displayEffects } from './effects/displays.js'
import { panelEffects } from './effects/panels.js'
import { sceneEffects } from './effects/scenes.js'

const effects=[...signalEffects,...panelEffects,...displayEffects,...sceneEffects]
const preview=document.querySelector('#preview'), list=document.querySelector('#component-list')
const search=document.querySelector('#component-search'), picker=document.querySelector('#effect-picker')
let active=null, lifecycle=null, unmount=null, category='Todos'
const base='https://github.com/Saiiru/saiiru.github.io/blob/main/'
const normalize=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt')
function renderList(){
 list.replaceChildren()
 const query=normalize(search.value.trim())
 const visible=effects.filter(effect=>(category==='Todos'||effect.category===category)&&normalize(effect.title+' '+effect.summary+' '+effect.id).includes(query))
 for(const effect of visible){const button=element('button','ca-component-option');button.type='button';button.dataset.effect=effect.id;button.setAttribute('aria-pressed',String(effect.id===active?.id));button.append(element('strong','',effect.title),element('span','ca-fine',effect.category));list.append(button)}
 if(!visible.length)list.append(element('p','ca-empty','Nenhum componente com esses filtros.'))
 document.querySelector('#result-count').textContent=visible.length+' COMPONENTES'
}
function selectEffect(id,updateURL=true){
 const effect=effects.find(item=>item.id===id)||effects[0]
 unmount?.();unmount=null;lifecycle?.dispose();preview.replaceChildren();delete preview.dataset.renderError
 active=effect;preview.dataset.effect=effect.id
 document.querySelector('#effect-title').textContent=effect.title
 document.querySelector('#effect-summary').textContent=effect.summary
 document.title=effect.title+' — BLACKSITE / Componentes'
 picker.value=effect.id
 lifecycle=createLifecycle(preview)
 try{const result=effect.mount(preview,lifecycle);unmount=typeof result==='function'?result:result?.destroy?.bind(result)}
 catch(error){lifecycle.dispose();preview.dataset.renderError=error.message;preview.append(element('p','ca-empty','Esta prévia não pôde ser iniciada. Os arquivos continuam disponíveis abaixo.'))}
 const sources=document.querySelector('#effect-sources');sources.replaceChildren()
 for(const path of effect.sourcePaths){const link=element('a','',path.split('/').pop()+' ↗');link.href=base+path;link.target='_blank';link.rel='noopener noreferrer';sources.append(link)}
 const modulePath=effect.sourcePaths.find(path=>path.endsWith('.js'))
 const exportName=signalEffects.includes(effect)?'signalEffects':panelEffects.includes(effect)?'panelEffects':displayEffects.includes(effect)?'displayEffects':'sceneEffects'
 document.querySelector('#example-code').textContent='import { createLifecycle } from "./components/core/lifecycle.js";\nimport { '+exportName+' } from "./'+modulePath+'";\n\nconst host = document.querySelector("#scene");\nconst life = createLifecycle(host);\nconst effect = '+exportName+'.find(e => e.id === "'+effect.id+'");\neffect.mount(host, life);\n\n// Ao sair da tela:\n// life.dispose(); host.replaceChildren();'
 document.querySelector('#copy-status').textContent=''
 if(updateURL){const url=new URL(location.href);url.searchParams.set('effect',effect.id);history.replaceState(null,'',url)}
 renderList()
}
for(const effect of effects){const option=element('option','',effect.title);option.value=effect.id;picker.append(option)}
list.addEventListener('click',event=>{const button=event.target.closest('[data-effect]');if(button)selectEffect(button.dataset.effect)})
picker.addEventListener('change',()=>selectEffect(picker.value))
search.addEventListener('input',renderList)
document.querySelector('.ca-filters').addEventListener('click',event=>{const button=event.target.closest('[data-category]');if(!button)return;category=button.dataset.category;document.querySelectorAll('[data-category]').forEach(node=>node.setAttribute('aria-pressed',String(node===button)));renderList()})
document.querySelector('#palette-picker').addEventListener('change',event=>{document.body.dataset.palette=event.target.value})
document.querySelector('#copy-example').addEventListener('click',async()=>{const status=document.querySelector('#copy-status');try{await navigator.clipboard.writeText(document.querySelector('#example-code').textContent);status.textContent='Exemplo copiado.'}catch{status.textContent='Selecione o exemplo e copie pelo teclado.'}})
const references=[['jh3y / recortes e botão','https://codepen.io/jh3y/pen/BajVmOg'],['Sandrina Pereira / canais de texto','https://codepen.io/sandrina-p/pen/RRWaYO'],['Mostafa / faixas de imagem','https://codepen.io/mostafazke/pen/XERXeY'],['Gábor / estados de botão','https://codepen.io/leszlauergabor/pen/qBybomV'],['Ahmod Musa / perspectiva','https://codepen.io/Ahmod-Musa/pen/KwMdeBR'],['xdega / navegação','https://codepen.io/xdega/pen/dyqXarJ']]
for(const [name,url]of references){const link=element('a','',name+' ↗');link.href=url;link.target='_blank';link.rel='noopener noreferrer';document.querySelector('#reference-links').append(link)}
window.addEventListener('pagehide',event=>{if(!event.persisted){unmount?.();lifecycle?.dispose()}})
window.addEventListener('pageshow',event=>{if(event.persisted)lifecycle?.refresh()})
selectEffect(new URL(location.href).searchParams.get('effect'),false)
