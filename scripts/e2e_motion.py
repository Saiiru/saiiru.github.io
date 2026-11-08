from playwright.sync_api import sync_playwright
import os
base=os.environ.get('BASE_URL','http://127.0.0.1:4392')
observe="""window.glitchEvents=[];new MutationObserver(entries=>{
 for(const e of entries)if(e.type==='attributes'&&e.target.id==='sairu-title')
 window.glitchEvents.push({state:e.target.dataset.glitch,time:performance.now()});
}).observe(document,{subtree:true,attributes:true,attributeFilter:['data-glitch']});"""
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 ctx=b.new_context(viewport={'width':1440,'height':980})
 ctx.add_init_script(observe)
 page=ctx.new_page()
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(base,wait_until='domcontentloaded')
 page.wait_for_function("window.glitchEvents.some(e=>e.state==='active')")
 page.wait_for_function("document.querySelector('.wordmark-stage').dataset.glitch==='idle'")
 assert page.locator('.effects-toggle,.glitch-trigger').count()==0
 assert 'EXEC_GLITCH' not in page.locator('body').inner_text()
 assert page.locator('.portfolio').get_attribute('data-effects')=='on'
 assert page.evaluate("glitchEvents.filter(e=>e.state==='active').length")==1
 page.wait_for_timeout(1600)
 assert page.evaluate("glitchEvents.filter(e=>e.state==='active').length")==1,'unexpected repeat'
 page.locator('.wordmark-stage').hover()
 assert page.locator('.wordmark-stage').get_attribute('data-glitch')=='active'
 page.mouse.move(1,1);page.locator('.wordmark-stage').hover()
 page.wait_for_function("document.querySelector('.wordmark-stage').dataset.glitch==='idle'")
 assert page.evaluate("glitchEvents.filter(e=>e.state==='active').length")==2,'re-entry retriggered'
 page.mouse.move(1,1);page.wait_for_timeout(1100);page.locator('.wordmark-stage').hover()
 assert page.locator('.wordmark-stage').get_attribute('data-glitch')=='active'
 page.emulate_media(reduced_motion='reduce')
 page.wait_for_function("document.querySelector('.portfolio').dataset.effects==='off'")
 page.wait_for_function("document.querySelector('.wordmark-stage').dataset.glitch==='idle'")
 assert page.evaluate("getComputedStyle(document.documentElement).scrollBehavior")=='auto'
 for layer in page.locator('.glitch-layer').all():
  assert layer.evaluate('(e)=>getComputedStyle(e).opacity')=='0'
 page.emulate_media(reduced_motion='no-preference');page.wait_for_timeout(900)
 assert page.locator('.wordmark-stage').get_attribute('data-glitch')=='idle','OS change replayed entry'
 page.locator('.navigation a').first.hover()
 animation=page.locator('.navigation a .signal-ghost').first.evaluate("(e)=>getComputedStyle(e,'::before').animationName")
 assert animation=='channel-cyan',animation
 page.wait_for_timeout(400)
 assert page.locator('.navigation a .signal-ghost').first.evaluate("(e)=>getComputedStyle(e,'::before').opacity")=='0'
 page.locator('.datashard-archive').scroll_into_view_if_needed()
 page.wait_for_function("getComputedStyle(document.querySelector('.datashard-archive')).opacity==='1'")
 assert not errors,errors
 print('PASS automatic entry once, hover, cooldown, dynamic OS preference, finite label signal, no controls or JS errors')
 for reduced in ['reduce','no-preference']:
  mobile=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,reduced_motion=reduced)
  m=mobile.new_page();m.goto(base,wait_until='networkidle');m.wait_for_timeout(800)
  assert m.locator('.wordmark-stage').get_attribute('data-glitch')=='idle'
  m.locator('.wordmark-stage').dispatch_event('pointerenter',{'pointerType':'touch'})
  assert m.locator('.wordmark-stage').get_attribute('data-glitch')=='idle'
  assert m.evaluate('document.documentElement.scrollWidth<=innerWidth')
  assert m.locator('.effects-toggle,.glitch-trigger').count()==0
  m.locator('.menu-button').click();assert m.locator('.navigation').get_attribute('class')=='navigation open'
  mobile.close()
 print('PASS touch interaction, menu, mobile width, reduced motion')
 for script in [
  "localStorage.setItem('blacksite-effects','off')",
  "Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked')}})"
 ]:
  context=b.new_context();context.add_init_script(script);context.add_init_script(observe)
  n=context.new_page();n.goto(base,wait_until='domcontentloaded')
  n.wait_for_function("glitchEvents.some(e=>e.state==='active')")
  assert n.locator('.portfolio').get_attribute('data-effects')=='on'
  context.close()
 print('PASS old off preference and unavailable storage')
 ctx.close();b.close()
print('MOTION_SUITE_PASS')
