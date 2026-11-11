"""Browser checks for local KORA routing and session-only data adapters."""
import json,os
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE=os.environ.get('KORA_DEMO_URL','http://127.0.0.1:4380/?lab=rota')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce')
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE,wait_until='networkidle')
 page.wait_for_function("!document.getElementById('kr-engine-ml').disabled")
 assert 'FINANCEIRO LOCAL' in page.locator('#kr-modules').inner_text()
 assert 'KORA' in page.locator('#kr-modules').inner_text()
 page.locator('#kr-engine').select_option('ml')
 assert 'decisão preservada pelas regras' in page.locator('#kr-output').inner_text()
 assert 'Índice lexical:' in page.locator('#kr-output').inner_text()
 page.locator('#kr-query').fill('Mostre minhas tarefas pendentes no Taskwarrior')
 assert 'kora-task-focus' in page.locator('#kr-output').inner_text()
 page.locator('#kr-query').fill('zzxnonexistentvocabulary')
 assert 'Sem sinal suficiente' in page.locator('#kr-output').inner_text()
 assert 'Nenhuma passagem' in page.locator('#kr-evidence').inner_text()
 page.locator('#kr-engine').select_option('rules')
 page.locator('#kr-query').fill('resumo financeiro')
 page.locator('summary').filter(has_text='Experimentar meus dados').click()
 data={'schema':'luka.finance-export/1','transactions':[{'transaction_date':'2026-11-01','amount_cents':275,'transaction_type':'expense','status':'paid'}]}
 page.locator('#kr-data').fill(json.dumps(data));page.locator('#kr-import').click()
 assert '-R$ 2,75' in page.locator('#kr-modules').inner_text()
 page.locator('#kr-data').fill('{broken');page.locator('#kr-import').click()
 assert 'Importação recusada' in page.locator('#kr-status').inner_text()
 assert '-R$ 2,75' in page.locator('#kr-modules').inner_text()
 with page.expect_download() as download:page.locator('#kr-export').click()
 exported=json.loads(Path(download.value.path()).read_text())
 assert exported['importedDataIncluded'] is False and 'transactions' not in exported
 page.locator('#kr-month').fill('');assert 'Mês precisa' in page.locator('#kr-status').inner_text()
 page.locator('#kr-month').fill('2026-11')
 page.locator('#kr-reset-data').click();assert '4.200,00' in page.locator('#kr-modules').inner_text()
 for width in [320,390,768,1440]:
  page.set_viewport_size({'width':width,'height':900})
  assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth'),width
 page.screenshot(path='/tmp/kora-routing-desktop.png',full_page=True)
 page.reload(wait_until='networkidle');assert 'DADOS SINTÉTICOS' in page.locator('#kr-modules').inner_text()
 assert not errors,errors
 b.close()
 print('KORA browser checks passed: ML, rules, mixed routes, abstention, finance import, invalid JSON, export, reset, four widths.')
