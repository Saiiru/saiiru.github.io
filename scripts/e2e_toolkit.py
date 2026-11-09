from pathlib import Path
import os
from playwright.sync_api import sync_playwright
BASE=os.environ.get('BASE_URL','http://127.0.0.1:4392')
out=Path('/tmp/sairu-toolkit-review');out.mkdir(exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':980},reduced_motion='reduce')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE,wait_until='networkidle')
 assert page.locator('.datashard-archive,.shard-select').count()==0
 assert page.locator('.public-archive').count()>0 or page.locator('#todos-projetos').count()==1
 assert page.locator('.skill-row').count()==9
 assert page.locator('.skill-group-label').all_text_contents()==['Software','Sistemas embarcados','Eletromecânica e controle']
 for name in ['EvalForge','OpsPilot','DocTrace']:
  assert name not in page.locator('#stack').inner_text()
  assert name not in page.locator('main').inner_text()
 assert page.locator('#stack a[href*="/labs/"]').count()==0
 page.get_by_role('button',name='Controle / CLP',exact=False).click()
 assert 'INTERESSE DE ESTUDO' in page.locator('#toolkit-detail').inner_text()
 page.locator('#stack').screenshot(path=str(out/'desktop.png'))
 page.get_by_role('button',name='Inversores de frequência',exact=False).click()
 assert 'ESTUDO PLANEJADO' in page.locator('#toolkit-detail').inner_text()
 page.get_by_role('button',name='Java / Spring',exact=False).click()
 assert 'Inversão de controle (IoC)' in page.locator('#toolkit-detail').inner_text()
 assert 'EXPERIÊNCIA PROFISSIONAL' in page.locator('#toolkit-detail').inner_text()
 page.locator('#terminal-input').fill('stack');page.locator('#terminal-input').press('Enter')
 assert 'CLP e inversores como próximos conteúdos' in page.locator('.terminal-output').inner_text()
 page.locator('#terminal-input').fill('labs');page.locator('#terminal-input').press('Enter')
 assert 'PRÓXIMA ETAPA' in page.locator('.terminal-output').inner_text()
 for a in page.locator('a[href^="#"]').all():
  target=a.get_attribute('href')
  if len(target)>1:assert page.locator(target).count()>0,target
 assert not errors,errors
 print('PASS technology-only toolkit, honest study labels, no proposed project showcase, terminal, anchors and JS')
 for width in [320,390,768,1440]:
  m=b.new_page(viewport={'width':width,'height':844},reduced_motion='reduce')
  m.goto(BASE,wait_until='networkidle')
  assert m.evaluate('document.documentElement.scrollWidth<=innerWidth'),width
  m.get_by_role('button',name='Controle / CLP',exact=False).click()
  assert 'INTERESSE DE ESTUDO' in m.locator('#toolkit-detail').inner_text()
  if width==390:m.locator('#toolkit-detail').screenshot(path=str(out/'mobile.png'))
  m.close();print('PASS width',width)
 b.close()
print('TOOLKIT_SUITE_PASS')
