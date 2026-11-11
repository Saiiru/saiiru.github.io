"""Browser regression for the current four public AI labs and GenAI portfolio."""
import os
from playwright.sync_api import sync_playwright

URL = os.environ.get('BASE_URL', 'http://127.0.0.1:4396')

with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    for width in (320,390,768,1280,1440):
        page=browser.new_page(viewport={'width':width,'height':900},reduced_motion='reduce')
        errors=[]
        page.on('pageerror',lambda error:errors.append(str(error)))
        page.goto(URL, wait_until='networkidle')
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),width
        assert page.locator('.shard-select').count()==4,width
        assert page.locator('.shard-select[aria-pressed="true"]').get_attribute('data-shard')=='rota',width
        assert page.locator('.proof-strip').count()==1
        assert page.locator('a[href*="workers.dev"]').count()==0
        assert 'LUKA' not in page.locator('#labs').inner_text()
        color=page.locator('.portfolio').evaluate('(e)=>getComputedStyle(e).getPropertyValue("--signal").trim()')
        assert color.lower()=='#00e5ff',color
        page.locator('[data-shard="crivo"]').click()
        assert page.locator('.shard-reader h3').inner_text()=='Crivo'
        page.get_by_role('tab',name='Testes e provas').click()
        assert page.locator('.reader-evidence-list li').count()>0
        page.locator('[data-shard="lastro"]').click()
        assert page.locator('.shard-reader h3').inner_text()=='Lastro'
        assert not errors,errors
        print('PASS portfolio width',width)
        page.close()
    page=browser.new_page()
    page.goto(URL+'/?shard=vetor#labs',wait_until='networkidle')
    assert page.locator('.shard-reader h3').inner_text()=='Vetor'
    page.close()
    browser.close()
print('GENAI_PORTFOLIO_BROWSER_PASS')
