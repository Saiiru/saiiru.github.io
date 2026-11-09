from playwright.sync_api import sync_playwright
from pathlib import Path
import os,re
BASE=os.environ.get('BASE_URL','http://127.0.0.1:4392')
OUT=Path('/home/sairu/workspace/blacksite-ai-builder-20261107/site/design/recon')
OUT.mkdir(exist_ok=True,parents=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader'])
 page=b.new_page(viewport={'width':1440,'height':980})
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE,wait_until='networkidle');page.wait_for_timeout(800)
 assert page.locator('.site-nav').bounding_box()['y']==0,'header pushed down by decoration'
 assert page.locator('.contact-heading').count()==0
 assert page.locator('a[href^="mailto:"]').count()==0
 assert not re.search(r'[\w.+-]+@[\w.-]+\.[a-z]{2,}',page.locator('body').inner_text())
 assert page.locator('.contact-channel').count()==2
 assert page.locator('.portfolio').evaluate('(e)=>getComputedStyle(e).getPropertyValue("--signal").strip()' .replace('.strip()', '.trim()'))=='#9ce8bf'
 assert page.locator('.brand img').get_attribute('src')=='/brand/sairu-mark.svg'
 page.screenshot(path=str(OUT/'desktop-hero.png'))
 page.locator('#contato').scroll_into_view_if_needed();page.wait_for_timeout(400)
 field=page.locator('.contact-field');page.wait_for_function('() => (document.querySelector(".contact-field").dataset.renderer==="webgl")')
 frames=int(field.get_attribute('data-frames'));page.wait_for_timeout(350)
 assert int(field.get_attribute('data-frames'))>frames,'field not animating in viewport'
 page.locator('#contato').screenshot(path=str(OUT/'desktop-contact.png'))
 page.mouse.move(1210,780);page.wait_for_timeout(500)
 page.locator('#contato').screenshot(path=str(OUT/'desktop-flow-next.png'))
 page.emulate_media(reduced_motion='reduce');page.wait_for_timeout(200)
 frames=int(field.get_attribute('data-frames'));page.wait_for_timeout(350)
 assert int(field.get_attribute('data-frames'))==frames,'reduced motion still animates'
 assert page.locator('.contact-channel').first.get_attribute('href').startswith('https://www.linkedin.com/')
 page.locator('#inicio').scroll_into_view_if_needed();page.emulate_media(reduced_motion='no-preference');page.wait_for_timeout(400)
 frames=int(field.get_attribute('data-frames'));page.wait_for_timeout(350)
 assert int(field.get_attribute('data-frames'))==frames,'field kept drawing offscreen'
 command=page.locator('#terminal-input');command.fill('contact');command.press('Enter')
 assert '@' not in page.locator('.terminal-output').inner_text()
 assert not errors,errors
 print('PASS private contact, original brand, new palette, WebGL flow, OS reduced motion and offscreen pause')
 for w in [320,390,768,1280,1440]:
  mobile=b.new_page(viewport={'width':w,'height':844},reduced_motion='reduce')
  mobile.goto(BASE,wait_until='networkidle')
  assert mobile.evaluate('document.documentElement.scrollWidth<=innerWidth'),w
  mobile.locator('#contato').scroll_into_view_if_needed()
  assert mobile.locator('.contact-channel').count()==2
  if w==390:
   mobile.locator('#contato').screenshot(path=str(OUT/'mobile-contact.png'))
   mobile.locator('#inicio').scroll_into_view_if_needed();mobile.screenshot(path=str(OUT/'mobile-hero.png'))
   mobile.locator('.menu-button').click()
   assert mobile.locator('.navigation a').first.evaluate('(e)=>{let r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))}')
  mobile.close();print('PASS width',w)
 ctx=b.new_context()
 ctx.add_init_script("""const old=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl'?null:old.call(this,type,...args)}""")
 fallback=ctx.new_page();fallback.goto(BASE,wait_until='networkidle');fallback.locator('#contato').scroll_into_view_if_needed()
 fallback.wait_for_function('() => (document.querySelector(".contact-field").dataset.renderer==="fallback")')
 assert fallback.locator('.contact-channel').count()==2
 print('PASS WebGL unavailable fallback')
 b.close()
print('RECON_SUITE_PASS')
