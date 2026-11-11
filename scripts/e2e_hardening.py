from playwright.sync_api import sync_playwright
import os
BASE=os.environ.get('BASE_URL','http://127.0.0.1:4392')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--enable-unsafe-swiftshader'])
 ctx=b.new_context(viewport={'width':390,'height':844})
 ctx.add_init_script("""window.gpuContexts=0;window.violations=[];document.addEventListener('securitypolicyviolation',e=>violations.push({directive:e.effectiveDirective,blocked:e.blockedURI}));const orig=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){if(type==='webgl')gpuContexts++;return orig.call(this,type,...args)}""")
 page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 requests=[];page.on('request',lambda r:requests.append(r.url))
 page.goto(BASE,wait_until='networkidle');page.wait_for_timeout(700)
 assert page.evaluate('gpuContexts')==0,'offscreen contact allocated GPU early'
 assert page.locator('.contact-field').get_attribute('data-renderer')=='deferred'
 assert not any('/SignalField-' in url for url in requests),'shader chunk fetched before contact'
 assert all(url.startswith(BASE) for url in requests),requests
 policy=page.locator('meta[http-equiv="Content-Security-Policy"]').get_attribute('content')
 assert "script-src 'self'" in policy and "'unsafe-eval'" not in policy
 page.locator('.menu-button').click();page.keyboard.press('Escape')
 assert page.locator('.navigation.open').count()==0
 assert page.locator('.menu-button').evaluate('(e)=>e===document.activeElement')
 page.locator('#sairu-title').hover();assert page.locator('#sairu-title').get_attribute('data-glitch')=='active'
 page.locator('#terminal-input').fill('<img src=x onerror="window.pwned=true">');page.locator('#terminal-input').press('Enter')
 assert page.locator('.terminal-output img').count()==0
 assert not page.evaluate('Boolean(window.pwned)')
 page.get_by_role('button',name='EXPLORAR O ARQUIVO',exact=False).click()
 page.get_by_role('button',name='APIs e backend',exact=True).click()
 page.locator('#archive-search').fill('ada-commerce')
 assert page.locator('.public-repo').count()==0
 page.locator('#archive-search').fill('Plann.er')
 assert page.locator('.public-repo').count()==0
 page.locator('#archive-search').fill('')
 print('PASS curated archive excludes deferred repositories')
 page.locator('#contato').scroll_into_view_if_needed()
 page.wait_for_function('() => (document.querySelector(".contact-field").dataset.renderer==="webgl")')
 assert page.evaluate('gpuContexts')==1
 page.wait_for_timeout(300)
 assert any('/SignalField-' in url for url in requests)
 page.evaluate("""Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));""")
 count=page.locator('.contact-field').get_attribute('data-frames');page.wait_for_timeout(200)
 assert page.locator('.contact-field').get_attribute('data-frames')==count
 assert page.locator('.portfolio').get_attribute('data-page-hidden')=='true'
 assert page.locator('.ambient-signal').evaluate('(e)=>getComputedStyle(e).animationPlayState')=='paused'
 page.evaluate("delete document.hidden;document.dispatchEvent(new Event('visibilitychange'))")
 page.emulate_media(reduced_motion='reduce');page.wait_for_timeout(150)
 count=page.locator('.contact-field').get_attribute('data-frames');page.wait_for_timeout(200)
 assert page.locator('.contact-field').get_attribute('data-frames')==count
 assert page.evaluate('violations')==[],page.evaluate('violations')
 assert not errors,errors
 print('PASS lazy GPU/chunk, local assets only, normal CSP operation, escaped input, Escape focus, hidden/reduced motion')
 page.evaluate("""const s=document.createElement('script');s.textContent='window.inlineExecuted=true';document.body.appendChild(s)""")
 page.wait_for_timeout(100)
 assert not page.evaluate('Boolean(window.inlineExecuted)')
 assert any(x['directive'].startswith('script-src') for x in page.evaluate('violations'))
 print('PASS inline script injection blocked by CSP')
 page.evaluate("""document.querySelector('canvas.contact-field').getContext('webgl').getExtension('WEBGL_lose_context').loseContext()""")
 page.wait_for_function('() => (document.querySelector(".contact-field").dataset.renderer==="fallback")')
 count=page.locator('.contact-field').get_attribute('data-frames');page.wait_for_timeout(150)
 assert page.locator('.contact-field').get_attribute('data-frames')==count
 assert page.locator('.contact-channel').count()==2
 print('PASS lost GPU context stops rendering and leaves contact links usable')
 plain=b.new_page(java_script_enabled=False)
 plain.goto(BASE,wait_until='networkidle')
 assert plain.get_by_role('heading',name='Sairu — Urias Machado Santos').is_visible()
 assert plain.get_by_role('link',name='LinkedIn',exact=True).is_visible()
 print('PASS no-JavaScript identity and contact fallback')
 interrupted=b.new_page(viewport={'width':390,'height':844})
 interrupted.route('**/SignalField-*.js',lambda route:route.abort())
 interrupted.goto(BASE,wait_until='networkidle')
 interrupted.locator('#contato').scroll_into_view_if_needed()
 interrupted.wait_for_function('() => document.querySelector(".contact-field")?.dataset.renderer==="fallback"')
 assert interrupted.locator('.contact-channel').count()==2
 assert interrupted.locator('#sairu-title').count()==1
 print('PASS failed decorative chunk leaves the whole portfolio and contact usable')
 b.close()
print('HARDENING_SUITE_PASS')
