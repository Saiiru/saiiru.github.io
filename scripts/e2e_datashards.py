import json, os, tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE=os.environ.get('BASE_URL','http://127.0.0.1:4392')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':1000},accept_downloads=True)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE,wait_until='networkidle')
 assert page.locator('.datashard-archive').count()==1,'datashard archive missing'
 assert page.locator('.shard-select').count()==3
 assert page.locator('.shard-select[aria-pressed="true"]').get_attribute('data-shard')=='evalforge'
 assert page.get_by_role('tab').count()==3
 assert page.get_by_role('tabpanel').count()==1
 assert 'EvalForge' in page.locator('.shard-reader').inner_text()
 page.locator('.shard-select[data-shard="opspilot"]').click()
 assert page.locator('.shard-select[data-shard="opspilot"]').get_attribute('aria-pressed')=='true'
 assert page.locator('.shard-demo-link').get_attribute('href')=='/labs/index.html?lab=opspilot'
 assert 'shard=opspilot' in page.url
 assert '02 / 03' in page.locator('.archive-read-count').inner_text()
 page.get_by_role('tab',name='Implementação',exact=True).click()
 assert 'aprovação' in page.get_by_role('tabpanel').inner_text().lower()
 page.get_by_role('tab',name='Implementação',exact=True).press('ArrowRight')
 assert page.get_by_role('tab',name='Evidências',exact=True).get_attribute('aria-selected')=='true'
 assert 'opspilot.test.mjs' in page.get_by_role('tabpanel').inner_text()
 page.get_by_role('tab',name='Evidências',exact=True).press('Home')
 assert page.get_by_role('tab',name='Dossiê',exact=True).get_attribute('aria-selected')=='true'
 with page.expect_download() as item:page.locator('.shard-export').click()
 download=item.value
 with tempfile.TemporaryDirectory() as temp:
  file=Path(temp)/download.suggested_filename;download.save_as(file)
  record=json.loads(file.read_text())
  assert record['id']=='opspilot'
  assert record['mode']=='offline-deterministic'
  assert record['demo'].endswith('lab=opspilot')
 assert download.suggested_filename.endswith('.datashard.json')
 page.goto(BASE+'?shard=doctrace#labs',wait_until='networkidle')
 assert page.locator('.shard-select[aria-pressed="true"]').get_attribute('data-shard')=='doctrace'
 page.locator('.shard-select[data-shard="doctrace"]').press('ArrowLeft')
 assert page.locator('.shard-select[aria-pressed="true"]').get_attribute('data-shard')=='opspilot'
 assert 'OpsPilot' in page.locator('.shard-reader').inner_text()
 page.goto(BASE+'?shard=invalid#labs',wait_until='networkidle')
 assert page.locator('.shard-select[aria-pressed="true"]').get_attribute('data-shard')=='evalforge'
 print('PASS selection, actual read count, tabs keyboard, links, deep links, fallback and JSON export')
 for width in [320,390,768,1280,1440]:
  pg=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce')
  pg.goto(BASE,wait_until='networkidle')
  pg.locator('.shard-select[data-shard="doctrace"]').click()
  assert pg.locator('.shard-reader h3').inner_text()=='DocTrace'
  assert pg.evaluate('document.documentElement.scrollWidth<=innerWidth'),width
  assert pg.locator('.shard-select[data-shard="doctrace"]').is_visible()
  print('PASS shard archive width',width)
  pg.close()
 assert not errors,errors
 b.close()
print('DATASHARD_SUITE_PASS')
