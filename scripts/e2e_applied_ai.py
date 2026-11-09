"""Exercise the actual static build, including model inference and file exports."""
import json
import os
import shutil
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE=os.environ.get('APPLIED_AI_BASE','http://127.0.0.1:4396')
ROOT=Path(__file__).resolve().parents[1]
PREVIEWS=ROOT/'public/assets/previews'
PREVIEWS.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path=shutil.which('chromium'),args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce',accept_downloads=True)
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('console',lambda msg:errors.append(msg.text) if msg.type=='error' else None)
    page.goto(BASE+'/',wait_until='networkidle')
    assert page.locator('.shard-select').count()==3
    page.locator('.shard-select[data-shard="vetor"]').click()
    assert page.locator('#reader-title').inner_text()=='Vetor'
    assert '?lab=vetor' in page.locator('.shard-demo-link').get_attribute('href')
    assert page.locator('#stack a[href*="/labs/"]').count()==0
    page.goto(BASE+'/labs/?lab=evalforge',wait_until='networkidle')
    assert page.locator('#panel-crivo').is_visible()
    page.locator('#ef-baseline').click()
    page.locator('#ef-response').fill('not JSON')
    assert '1 regressão' in page.locator('#ef-comparison').inner_text()
    with page.expect_download() as d:page.locator('#ef-export').click()
    data=json.loads(Path(d.value.path()).read_text())
    assert len(data['comparison']['regressions'])==1
    page.screenshot(path=str(PREVIEWS/'crivo.jpg'),type='jpeg',quality=85)
    page.goto(BASE+'/labs/?lab=opspilot',wait_until='networkidle')
    assert page.locator('#panel-vetor').is_visible()
    page.wait_for_function("!document.getElementById('op-route').disabled")
    page.locator('#op-text').fill('Meu cartão recebeu uma cobrança duplicada.')
    page.locator('#op-route').click()
    assert 'Equipe: Pagamentos' in page.locator('#op-prediction').inner_text()
    assert 'prioridade por regra' in page.locator('#op-prediction').inner_text()
    page.locator('#op-approve').click()
    with page.expect_download() as d:page.locator('#op-export').click()
    approved=json.loads(Path(d.value.path()).read_text())
    assert approved['approvedByHuman'] is True
    assert approved['routing']['source']=='trained-ml'
    page.screenshot(path=str(PREVIEWS/'vetor.jpg'),type='jpeg',quality=85)
    page.locator('#op-text').fill('zzzzzz qqqqq xxxx')
    assert page.locator('#op-export').is_disabled()
    page.locator('#op-route').click()
    assert 'Revisão manual' in page.locator('#op-prediction').inner_text()
    assert page.locator('#op-llm').is_hidden()
    page.goto(BASE+'/labs/?lab=doctrace',wait_until='networkidle')
    assert page.locator('#panel-lastro').is_visible()
    page.wait_for_function("document.getElementById('dt-answer').textContent.includes('[S')")
    assert 'cobrança duplicada' in page.locator('#dt-answer').inner_text().lower()
    page.screenshot(path=str(PREVIEWS/'lastro.jpg'),type='jpeg',quality=85)
    page.locator('#dt-query').fill('dinossauros quânticos')
    page.locator('#dt-search').click()
    assert 'Não encontrei evidência' in page.locator('#dt-answer').inner_text()
    page.locator('#dt-files').set_input_files({'name':'manual.md','mimeType':'text/markdown','buffer':b'# Oficina\nO calibrador deve ficar na gaveta azul.'})
    page.locator('#dt-query').fill('calibrador')
    page.locator('#dt-search').click()
    assert 'gaveta azul' in page.locator('#dt-answer').inner_text()
    assert page.locator('#dt-llm').is_disabled()
    for width in [320,390,768,1440]:
        page.set_viewport_size({'width':width,'height':900})
        for path in ['/', '/labs/?lab=crivo','/labs/?lab=vetor','/labs/?lab=lastro']:
            page.goto(BASE+path,wait_until='networkidle')
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+1'),(width,path)
    browser.close()
    assert not errors,errors
print('PASS: three projects, old URLs, regression comparison, trained ML, human approval, exports, refusal, upload, four viewport widths; zero console/page errors.')
