from playwright.sync_api import sync_playwright
import os
base=os.environ.get('BASE_URL','http://127.0.0.1:4392')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':980})
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(base,wait_until='networkidle')
 assert page.locator('.effects-toggle').count()==1, 'effects toggle missing'
 toggle=page.locator('.effects-toggle')
 assert page.locator('.portfolio').get_attribute('data-effects')=='on'
 assert toggle.get_attribute('aria-pressed')=='true'
 assert page.locator('.glitch-layer').count()==2
 page.locator('.glitch-trigger').click()
 assert page.locator('.wordmark-stage').get_attribute('data-glitch')=='active'
 page.wait_for_timeout(1000)
 assert page.locator('.wordmark-stage').get_attribute('data-glitch')=='idle'
 toggle.click()
 assert page.locator('.portfolio').get_attribute('data-effects')=='off'
 assert page.locator('.glitch-trigger').is_disabled()
 assert page.locator('.wordmark-stage').get_attribute('data-glitch')=='idle'
 page.reload(wait_until='networkidle')
 assert page.locator('.portfolio').get_attribute('data-effects')=='off', 'preference not persisted'
 page.locator('.effects-toggle').click()
 assert page.locator('.portfolio').get_attribute('data-effects')=='on'
 page.locator('.project-doctrace').scroll_into_view_if_needed();page.wait_for_function('getComputedStyle(document.querySelector(".project-doctrace")).opacity === "1"')
 assert page.locator('.project-doctrace').evaluate('(el)=>getComputedStyle(el).opacity')=='1'
 assert not errors,errors
 print('PASS toggle, persistence, finite glitch, reveal, no JS errors')
 reduced=b.new_page(viewport={'width':390,'height':844},reduced_motion='reduce')
 reduced.goto(base,wait_until='networkidle')
 assert reduced.locator('.portfolio').get_attribute('data-effects')=='off'
 assert reduced.locator('.effects-toggle').is_disabled()
 assert reduced.locator('.glitch-trigger').is_disabled()
 assert reduced.locator('.wordmark-stage').get_attribute('data-glitch')=='idle'
 for item in reduced.locator('.glitch-layer').all():
  assert item.evaluate('(el)=>getComputedStyle(el).opacity')=='0'
 assert reduced.locator('.project-doctrace').evaluate('(el)=>getComputedStyle(el).opacity')=='1'
 assert reduced.evaluate('document.documentElement.scrollWidth<=innerWidth')
 print('PASS reduced-motion, readable projects, no leftover glitch layers, mobile width')
 # Denied storage must not crash the app or break controls.
 no_storage=b.new_context()
 no_storage.add_init_script("Object.defineProperty(window, 'localStorage', {get(){throw new Error('blocked')}})")
 n=no_storage.new_page();n.goto(base,wait_until='networkidle')
 assert n.locator('h1').count()==1
 n.locator('.effects-toggle').click()
 assert n.locator('.portfolio').get_attribute('data-effects')=='off'
 print('PASS unavailable localStorage')
 b.close()
print('MOTION_SUITE_PASS')
