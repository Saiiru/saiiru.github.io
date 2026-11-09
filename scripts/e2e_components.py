from pathlib import Path
import os,json
from playwright.sync_api import sync_playwright
BASE=os.environ.get('BASE_URL','http://127.0.0.1:4392')
OUT=Path(os.environ.get('CAPTURE_DIR','/tmp/sairu-component-review'));OUT.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--enable-unsafe-swiftshader'])
 context=browser.new_context(viewport={'width':1440,'height':1000})
 context.add_init_script('''window.pendingFrames=new Set();const raf=window.requestAnimationFrame.bind(window),cancel=window.cancelAnimationFrame.bind(window);window.requestAnimationFrame=fn=>{let id=raf(t=>{pendingFrames.delete(id);fn(t)});pendingFrames.add(id);return id};window.cancelAnimationFrame=id=>{pendingFrames.delete(id);cancel(id)};window.cspViolations=[];document.addEventListener('securitypolicyviolation',e=>cspViolations.push(e.effectiveDirective))''')
 page=context.new_page();errors=[];requests=[]
 page.on('pageerror',lambda e:errors.append(str(e)));page.on('request',lambda r:requests.append(r.url))
 page.goto(BASE+'/components/',wait_until='networkidle')
 options=page.locator('#effect-picker option').evaluate_all('(nodes)=>nodes.map(n=>n.value)')
 assert len(options)==24 and len(set(options))==24
 def choose(effect):
  if page.viewport_size['width']<801:page.locator('#effect-picker').select_option(effect)
  else:page.locator('[data-effect="'+effect+'"].ca-component-option').click()
  page.locator('#preview').scroll_into_view_if_needed();page.wait_for_timeout(90)
  assert page.locator('#preview').get_attribute('data-effect')==effect
  assert not page.locator('#preview').get_attribute('data-render-error'),effect
  assert page.locator('#preview').inner_text().strip(),effect
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),effect
 for effect in options:
  choose(effect)
  page.locator('#preview').screenshot(path=str(OUT/(effect+'.png')))
 assert all(url.startswith(BASE) for url in requests),requests
 assert not page.evaluate('cspViolations'),page.evaluate('cspViolations')
 assert not errors,errors
 print('PASS 24 desktop mounts, no rendering errors, CSP, local assets, viewport bounds')
 choose('slice-transition');page.evaluate("dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}))");page.get_by_role('button',name='Trocar composição').click();assert page.locator('.ca-slice').get_attribute('data-scene')=='b'
 choose('launcher-search');field=page.locator('#preview [role=combobox]')
 field.fill('zzzinexistente');assert page.locator('.ca-launcher-list [role=option]').count()==0
 field.fill('orbita');field.press('Enter');assert 'Órbita' in page.locator('.ca-launcher-preview').inner_text()
 field.press('Escape');assert page.locator('.ca-launcher-list [role=option]').count()==5
 choose('notification-stack')
 for i in range(5):page.get_by_role('button',name='Novo evento',exact=False).click()
 assert page.locator('.ca-notification-rail>.ca-notification').count()==4
 page.locator('[data-notification-action=detail]').first.click();assert page.locator('.ca-notification-detail').is_visible()
 page.get_by_role('button',name='Fechar detalhe',exact=True).click()
 page.locator('[data-notification-action=dismiss]').first.click();page.wait_for_timeout(280)
 assert page.locator('.ca-notification-rail>.ca-notification').count()==3
 choose('login-sequence');page.locator('.ca-login-form input').fill('<img src=x onerror=window.pwned=true>');page.locator('.ca-login-form button').click()
 assert page.locator('.ca-login-output img').count()==0 and not page.evaluate('Boolean(window.pwned)')
 choose('capture-region');stage=page.locator('.ca-capture-stage');stage.focus();before=page.locator('.ca-capture-readout').inner_text();stage.press('ArrowRight');assert page.locator('.ca-capture-readout').inner_text()!=before
 stage.press('Escape');assert 'Nenhuma' in page.locator('.ca-capture-readout').inner_text()
 page.get_by_role('button',name='Restaurar seleção').click();page.get_by_role('button',name='REC',exact=True).click();page.get_by_role('button',name='Simular REC',exact=False).click();assert page.locator('.ca-capture-stage').get_attribute('class').find('ca-is-recording')>=0
 page.get_by_role('button',name='Encerrar simulação').click()
 choose('media-player');page.get_by_role('button',name='Iniciar simulação').click();page.wait_for_timeout(1250);clock=page.locator('.ca-player-time .ca-clock').first;before=clock.inner_text();page.emulate_media(reduced_motion='reduce');assert clock.inner_text()==before,'Clock moved backward on motion preference change';page.emulate_media(reduced_motion='no-preference')
 choose('crt-display');select=page.locator('#preview select').first
 assert select.locator('option').count()==9
 for value in select.locator('option').evaluate_all('(nodes)=>nodes.map(n=>n.value)'):
  select.select_option(value);page.wait_for_timeout(40);assert not page.locator('#preview').get_attribute('data-render-error')
 canvas=page.locator('#preview canvas').first
 assert canvas.evaluate('(e)=>e.width<=Math.ceil(e.getBoundingClientRect().width*1.25)+1')
 page.wait_for_timeout(120);page.evaluate("const spacer=document.createElement('div');spacer.id='test-spacer';spacer.style.height='1800px';document.body.append(spacer);scrollTo(0,document.body.scrollHeight)");page.wait_for_timeout(180)
 frozen=page.locator('#preview').get_attribute('data-frames');page.wait_for_timeout(160)
 assert page.locator('#preview').get_attribute('data-frames')==frozen,'Offscreen RAF did not pause'
 page.evaluate("document.querySelector('#test-spacer').remove()");page.locator('#preview').scroll_into_view_if_needed();page.emulate_media(reduced_motion='reduce');page.wait_for_timeout(150)
 frozen=page.locator('#preview').get_attribute('data-frames');page.wait_for_timeout(180);assert page.locator('#preview').get_attribute('data-frames')==frozen
 choose('media-player');page.get_by_role('button',name='Iniciar simulação').click();clock=page.locator('.ca-player-time .ca-clock').first;before=clock.inner_text();page.wait_for_timeout(1150);assert clock.inner_text()!=before,'Reduced motion must preserve semantic timeline feedback'
 choose('hud-layout');page.wait_for_timeout(100);assert page.evaluate('pendingFrames.size')==0,'Old scene left animation frames behind'
 page.locator('#palette-picker').select_option('nord');assert page.locator('body').get_attribute('data-palette')=='nord'
 assert not errors,errors
 print('PASS filtering/keyboard, notifications, escaped input, capture states, 9 CRT variants, capped DPR, pause/reduce/disposal')
 page.emulate_media(reduced_motion='no-preference')
 for width in [320,390]:
  page.set_viewport_size({'width':width,'height':844})
  for effect in options:choose(effect)
  for effect in ['channel-split','crt-display','notification-stack','capture-region']:
   choose(effect);page.locator('#preview').screenshot(path=str(OUT/(str(width)+'-'+effect+'.png')))
  print('PASS 24 mobile mounts and overflow',width)
 assert not errors,errors
 fallback=browser.new_context()
 fallback.add_init_script('const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(kind,...args){return kind==="2d"?null:get.call(this,kind,...args)}')
 plain=fallback.new_page();plain.goto(BASE+'/components/?effect=crt-display',wait_until='networkidle');assert plain.locator('.ca-display-fallback').count()==1
 plain=browser.new_page(java_script_enabled=False);plain.goto(BASE+'/components/',wait_until='networkidle');assert plain.locator('noscript a').count()==2
 print('PASS Canvas unavailable and no-JavaScript alternatives')
 (OUT/'result.json').write_text(json.dumps({'status':'PASS','components':24,'crtVariants':9,'widths':[320,390,1440],'pageErrors':errors,'localAssetsOnly':True},indent=2))
 browser.close()
print('COMPONENT_LIBRARY_SUITE_PASS')
