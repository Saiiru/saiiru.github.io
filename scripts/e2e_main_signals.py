from pathlib import Path
import os,json
from playwright.sync_api import sync_playwright
BASE=os.environ.get('BASE_URL','http://127.0.0.1:4392')
OUT=Path(os.environ.get('CAPTURE_DIR','/tmp/sairu-main-signal-review'));OUT.mkdir(exist_ok=True,parents=True)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in [320,390,768,1440]:
  page=b.new_page(viewport={'width':width,'height':980})
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(BASE,wait_until='networkidle')
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),width
  link=page.get_by_role('link',name='EXPLORAR INTERFACES',exact=False)
  assert link.get_attribute('href')=='/components/'
  assert link.bounding_box()['height']>=44
  title=page.locator('#sairu-title')
  assert title.locator('.signature-frame').get_attribute('aria-hidden')=='true'
  for attempt in range(2):
   page.mouse.move(1,1);title.hover();assert title.get_attribute('data-glitch')=='active'
   assert title.locator('.signature-frame').evaluate('(e)=>e.getAnimations().some(a=>a.playState==="running")')
   if attempt==1 and width in [390,1440]:
    page.wait_for_timeout(70);page.locator('#inicio').screenshot(path=str(OUT/(str(width)+'-hero.png')))
   page.wait_for_timeout(650);assert title.get_attribute('data-glitch')=='idle'
  field=page.locator('#terminal-input');field.focus();field.fill('help');field.press('Enter')
  assert 'COMANDOS DISPONÍVEIS' in page.locator('.terminal-output').inner_text()
  assert page.locator('.terminal-panel').get_attribute('class').find('crt-surface')>=0
  if width in [390,1440]:page.locator('.terminal-section').screenshot(path=str(OUT/(str(width)+'-terminal.png')))
  page.emulate_media(reduced_motion='reduce');title.hover()
  assert title.locator('.signature-frame').evaluate('(e)=>getComputedStyle(e).animationName')=='none'
  assert page.locator('.crt-scanlines').evaluate('(e)=>getComputedStyle(e).animationName')=='none'
  field.fill('stack');field.press('Enter');assert 'TOOLKIT' in page.locator('.terminal-output').inner_text()
  assert not errors,errors
  print('PASS main signature repeated hover, finite motion, terminal, link target, reduce and width',width)
  page.close()
 b.close()
(OUT/'result.json').write_text(json.dumps({'status':'PASS','widths':[320,390,768,1440],'scope':'Main page signature HUD, static CRT terminal, real command output, direct library navigation, repeated hover and OS reduced motion'},indent=2))
print('MAIN_SIGNAL_SUITE_PASS')
