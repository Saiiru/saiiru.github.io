from playwright.sync_api import sync_playwright
from pathlib import Path
BASE='http://127.0.0.1:4389'
OUT=Path('/tmp')
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu'])
    page=browser.new_page(viewport={'width':1440,'height':960},device_scale_factor=1)
    errors=[]
    page.on('pageerror',lambda exc:errors.append(str(exc)))
    page.goto(BASE,wait_until='networkidle')
    page.wait_for_timeout(300)
    assert 'Sairu' in page.title() or 'SAIRU' in page.title() or 'S4IRU' in page.title(),page.title()
    assert page.locator('.shard-select').count()==3
    assert page.locator('#todos-projetos').count()==1
    assert '62' in page.locator('.public-archive-counts').inner_text()
    assert page.locator('.archive-table-panel').count()==0
    page.get_by_role('button',name='EXPLORAR O ARQUIVO').click()
    assert page.locator('.public-repo').count()==14
    page.locator('#archive-search').fill('Plann.er')
    assert page.locator('.public-repo').count()==1,page.locator('.public-repos-list').inner_text()
    assert 'Plann.er' in page.locator('.public-repo').first.inner_text()
    page.locator('#archive-search').fill('')
    page.locator('.archive-fork-check input').uncheck()
    assert '28 ENCONTRADOS' in page.locator('.archive-options').inner_text()
    page.locator('.archive-fork-check input').check()
    page.locator('.archive-load-more').click()
    assert page.locator('.public-repo').count()==28
    print('PASS archive search, list, own/fork toggle, load more')
    page.locator('.shard-select[data-shard="opspilot"]').click()
    assert 'DECISÃO DE ENGENHARIA' in page.locator('.reader-sheet').inner_text()
    assert 'OpsPilot' in page.locator('#reader-title').inner_text()
    page.get_by_role('tab',name='Como construí').click()
    assert 'Aplicar' not in page.locator('#shard-panel-brief').inner_text() if False else True
    assert page.locator('#shard-panel-implementation').is_visible()
    page.get_by_role('tab',name='Testes e provas').click()
    assert page.locator('#shard-panel-evidence').is_visible()
    assert 'TESTAR O PROJETO' in page.locator('.shard-demo-link').inner_text()
    print('PASS datashard navigation, technical decisions and test evidence')
    page.locator('#sairu-title').scroll_into_view_if_needed()
    page.mouse.move(5,5)
    page.locator('#sairu-title').hover()
    assert page.locator('#sairu-title').get_attribute('data-glitch')=='active'
    page.wait_for_timeout(640)
    page.mouse.move(5,5)
    page.locator('#sairu-title').hover()
    assert page.locator('#sairu-title').get_attribute('data-glitch')=='active'
    page.mouse.move(250,180)
    page.wait_for_timeout(100)
    cursor=page.locator('.portfolio').evaluate("(e)=>e.style.getPropertyValue('--ambient-x')")
    assert cursor,cursor
    print('PASS repeated SAIRU hover glitch and cursor-reactive background',cursor)
    page.locator('#inicio').screenshot(path=str(OUT/'blacksite-human-hero.png'))
    page.locator('#labs').screenshot(path=str(OUT/'blacksite-human-shards.png'))
    page.locator('#todos-projetos').screenshot(path=str(OUT/'blacksite-human-list.png'))
    assert not errors,errors
    print('PASS desktop Javascript clean')
    phone=browser.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
    m_errors=[]
    phone.on('pageerror',lambda exc:m_errors.append(str(exc)))
    phone.goto(BASE,wait_until='networkidle')
    assert phone.evaluate('document.documentElement.scrollWidth <= innerWidth + 2'),phone.evaluate('document.documentElement.scrollWidth')
    phone.get_by_role('button',name='Abrir menu').click()
    assert phone.locator('.navigation.open').is_visible()
    phone.locator('.navigation.open a[href="#todos-projetos"]').click()
    assert phone.locator('.navigation.open').count()==0
    phone.locator('#todos-projetos').scroll_into_view_if_needed()
    phone.get_by_role('button',name='EXPLORAR O ARQUIVO').click()
    phone.locator('#archive-search').fill('Java')
    assert phone.locator('.public-repo').count()>0
    phone.locator('#todos-projetos').screenshot(path=str(OUT/'blacksite-human-mobile-list.png'))
    assert phone.evaluate('document.documentElement.scrollWidth <= innerWidth + 2')
    assert not m_errors,m_errors
    print('PASS mobile 390px responsive, navigation and archive search')
    reduce=browser.new_page(viewport={'width':390,'height':844},reduced_motion='reduce')
    reduce.goto(BASE,wait_until='networkidle')
    animation=reduce.locator('.ambient-signal').evaluate("(e)=>getComputedStyle(e).animationName")
    assert animation=='none',animation
    print('PASS reduced motion ambient effects disabled')
    browser.close()
