from playwright.sync_api import sync_playwright
from pathlib import Path
base='http://127.0.0.1:4392'
root=Path('/home/sairu/workspace/blacksite-ai-builder-20261107/site')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':980},device_scale_factor=1)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(base,wait_until='networkidle')
 page.wait_for_timeout(1300)
 assert page.locator('h1').count()==1
 assert page.locator('.shard-select').count()==3
 assert page.locator('.skill-row').count()==9
 page.locator('#terminal-input').fill('help');page.locator('#terminal-input').press('Enter')
 assert 'COMANDOS DISPONÍVEIS' in page.locator('.terminal-output').inner_text()
 page.locator('#terminal-input').fill('<img src=x onerror=alert(1)>');page.locator('#terminal-input').press('Enter')
 assert page.locator('.terminal-output img').count()==0
 page.get_by_role('button',name='04 Evals / Prompt').click()
 assert 'EvalForge' in page.locator('.skill-readout').inner_text()
 page.get_by_role('button',name='05 Fluxo / Aprovação').click()
 assert 'OpsPilot' in page.locator('.skill-readout').inner_text()
 page.locator('.theme-control').click();assert 'light-mode' in page.locator('.portfolio').get_attribute('class')
 page.locator('.theme-control').click();assert 'light-mode' not in page.locator('.portfolio').get_attribute('class')
 for selector in ['a[href="#labs"]','a[href="#contato"]']:
  assert page.locator(selector).count()>0
 assert not errors,errors
 print('PASS: semantic headings, three projects, nine skills, terminal + escaped input, theme toggle, links, no JS errors')
 for lab in ['evalforge','opspilot','doctrace']:
  page.goto(base+'/labs/index.html?lab='+lab,wait_until='networkidle')
  assert page.locator('#panel-'+lab).is_visible()
  if lab=='evalforge':
   page.locator('#ef-run').click();assert '6 de 6' in page.locator('#ef-status').inner_text()
   page.locator('#ef-response').fill('wrong')
   page.locator('#ef-run').click();assert '5 de 6' in page.locator('#ef-status').inner_text()
  elif lab=='opspilot':
   assert page.locator('#op-export').is_disabled()
   page.locator('#op-approve').click();assert page.locator('#op-export').is_enabled()
   page.locator('#op-text').fill('Novo ticket')
   assert page.locator('#op-export').is_disabled()
  else:
   page.locator('#dt-query').fill('cobrança duplicada');page.locator('#dt-search').click()
   assert 'pagamentos.md' in page.locator('#dt-results').inner_text().lower()
   page.locator('#dt-query').fill('xylophonia123 abczzz123');page.locator('#dt-search').click()
   assert 'Não encontrei' in page.locator('#dt-answer').inner_text()
 print('PASS: three existing labs, evaluation changes, approval reset, citations, no-evidence refusal')
 for width in [320,390,768,1280,1440]:
  pg=b.new_page(viewport={'width':width,'height':980 if width>=1280 else 844},device_scale_factor=1)
  pg.emulate_media(reduced_motion='reduce')
  pg.goto(base,wait_until='networkidle')
  assert pg.evaluate('document.documentElement.scrollWidth <= window.innerWidth'),width
  if width<=520:
   pg.locator('.menu-button').click();assert pg.locator('.navigation').is_visible()
   pg.locator('.navigation a[href="#labs"]').click();assert not pg.locator('.navigation').is_visible()
  if width in [390,1440]:
   name='desktop' if width==1440 else 'mobile'
   pg.evaluate("async () => { const imgs = Array.from(document.images); imgs.forEach(img => img.loading = 'eager'); await Promise.all(imgs.map(img => img.decode().catch(() => {}))); scrollTo(0,0); }")
   pg.screenshot(path=str(root/f'design/v3/{name}.png'),full_page=True)
   pg.screenshot(path=str(root/f'design/v3/{name}-hero.png'))
  print('PASS viewport',width,'reduced motion, layout and menu')
  pg.close()
 b.close()
print('FINAL_BROWSER_VALIDATION_PASS')
