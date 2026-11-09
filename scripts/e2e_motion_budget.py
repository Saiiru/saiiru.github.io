"""Persistent decorative motion only runs while its section is visible."""
import os
from playwright.sync_api import sync_playwright
BASE=os.environ.get('BASE_URL','http://127.0.0.1:4392')
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width in [390,1440]:
  page=browser.new_page(viewport={'width':width,'height':844})
  page.goto(BASE,wait_until='networkidle')
  tape=page.locator('.signal-tape')
  track=page.locator('.tape-track')
  tape.scroll_into_view_if_needed()
  page.wait_for_function('() => getComputedStyle(document.querySelector(".tape-track")).animationPlayState==="running"')
  page.wait_for_timeout(100)
  before=track.evaluate('(e)=>e.getAnimations()[0].currentTime')
  page.locator('#contato').scroll_into_view_if_needed()
  page.wait_for_function('() => getComputedStyle(document.querySelector(".tape-track")).animationPlayState==="paused"',timeout=3000)
  frozen=track.evaluate('(e)=>e.getAnimations()[0].currentTime')
  page.wait_for_timeout(180)
  assert abs(track.evaluate('(e)=>e.getAnimations()[0].currentTime')-frozen)<1
  tape.scroll_into_view_if_needed()
  page.wait_for_function('() => getComputedStyle(document.querySelector(".tape-track")).animationPlayState==="running"')
  assert track.evaluate('(e)=>e.getAnimations()[0].currentTime')>=before
  page.emulate_media(reduced_motion='reduce')
  assert track.evaluate('(e)=>getComputedStyle(e).animationName')=='none'
  assert 'CODE.' in tape.inner_text()
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
  print('PASS ticker visible/resume, offscreen pause, reduced motion and overflow',width)
  page.close()
 fallback=browser.new_context()
 fallback.add_init_script('delete window.IntersectionObserver')
 page=fallback.new_page()
 page.goto(BASE,wait_until='networkidle')
 assert page.locator('#sairu-title').count()==1
 assert page.locator('.tape-track').evaluate('(e)=>getComputedStyle(e).animationPlayState')=='paused'
 print('PASS no-observer static ticker and readable portfolio')
 browser.close()
print('MOTION_BUDGET_SUITE_PASS')
