"""Hold provider/corpus responses to reproduce edits while work is pending."""
import json
import os
import shutil
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE=os.environ.get('APPLIED_AI_BASE','http://127.0.0.1:4437')
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path=shutil.which('chromium'),args=['--no-sandbox'])
    page=browser.new_page()
    pending=[]
    page.route('**/api/chat',lambda route:pending.append(route))
    def request(button):
        # Test fixture enables the optional provider control; no real provider is contacted.
        page.locator(button).evaluate('(el)=>{el.hidden=false;el.disabled=false;}')
        page.locator(button).click()
        page.wait_for_function('true')
        assert pending
    def complete(text):
        pending.pop(0).fulfill(status=200,content_type='application/json',body=json.dumps({'text':text}))
        page.wait_for_timeout(120)
    page.goto(BASE+'/labs/?lab=vetor',wait_until='networkidle')
    page.wait_for_function("!document.getElementById('op-route').disabled")
    request('#op-llm')
    page.locator('#op-text').fill('NEW INPUT WHILE REQUEST IS PENDING')
    complete('{"team":"Pagamentos","severity":"Alta","reason":"STALE RESULT"}')
    assert 'STALE RESULT' not in page.locator('#op-prediction').inner_text()
    page.locator('#op-approve').click()
    assert page.locator('#op-export').is_disabled()
    page.goto(BASE+'/labs/?lab=crivo',wait_until='networkidle')
    request('#ef-llm')
    page.locator('#ef-case').select_option('EF-02')
    expected=page.locator('#ef-response').input_value()
    complete('STALE CRIVO RESPONSE')
    assert page.locator('#ef-response').input_value()==expected
    page.goto(BASE+'/labs/?lab=lastro',wait_until='networkidle')
    request('#dt-llm')
    page.locator('#dt-query').fill('completely new query')
    complete('STALE LASTRO RESPONSE')
    assert page.locator('#dt-llm-answer').is_hidden()
    # Slow initial demo fetches cannot replace a later user-selected corpus.
    docs=[]
    page.route('**/labs/docs/*.md',lambda route:docs.append(route))
    page.goto(BASE+'/labs/?lab=lastro',wait_until='domcontentloaded')
    page.wait_for_function("document.getElementById('dt-files')!==null")
    page.locator('#dt-files').set_input_files({'name':'MANUAL.MD','mimeType':'text/markdown','buffer':b'# Oficina\nCalibrador na gaveta azul.'})
    page.locator('#dt-query').fill('calibrador')
    page.locator('#dt-search').click()
    for _ in range(6):
        if not docs:page.wait_for_timeout(80)
        assert docs
        docs.pop(0).fulfill(status=200,body='# Original\nDocumento antigo do corpus.')
        page.wait_for_timeout(80)
    page.locator('#dt-search').click()
    assert 'gaveta azul' in page.locator('#dt-answer').inner_text()
    assert 'local/MANUAL.MD' in page.locator('#dt-results').inner_text()
    browser.close()
print('PASS: obsolete completions rejected for all three tools; initial corpus cannot replace uploaded uppercase Markdown.')
