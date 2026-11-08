import re, unittest
from playwright.sync_api import sync_playwright
BASE='http://127.0.0.1:4392'
def luminance(css):
 vals=[float(n)/255 for n in re.findall(r'\d+\.?\d*',css)[:3]]
 vals=[n/12.92 if n<=.04045 else ((n+.055)/1.055)**2.4 for n in vals]
 return .2126*vals[0]+.7152*vals[1]+.0722*vals[2]
def ratio(a,b):
 x,y=sorted([luminance(a),luminance(b)])
 return (y+.05)/(x+.05)
class MotionFixes(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.p=sync_playwright().start()
  cls.b=cls.p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 @classmethod
 def tearDownClass(cls):cls.b.close();cls.p.stop()
 def setUp(self):
  self.ctx=self.b.new_context(viewport={'width':1440,'height':980})
  self.page=self.ctx.new_page();self.page.goto(BASE,wait_until='networkidle')
 def tearDown(self):self.ctx.close()
 def light(self):self.page.locator('.theme-control').click()
 def test_system_preference_disables_document_smooth_scroll(self):
  self.page.emulate_media(reduced_motion='reduce')
  self.page.wait_for_function('document.querySelector(".portfolio").dataset.effects==="off"')
  self.assertEqual(self.page.evaluate('getComputedStyle(document.documentElement).scrollBehavior'),'auto')
 def test_light_outline_heading_has_contrast(self):
  self.light()
  colors=self.page.locator('.outlined').first.evaluate('(el)=>[getComputedStyle(el).webkitTextStrokeColor,getComputedStyle(document.querySelector(".portfolio")).backgroundColor]')
  self.assertGreaterEqual(ratio(*colors),3)
 def test_light_ticker_has_contrast(self):
  self.light()
  colors=self.page.locator('.tape-track span').nth(1).evaluate('(el)=>[getComputedStyle(el).color,getComputedStyle(document.querySelector(".signal-tape")).backgroundColor]')
  self.assertGreaterEqual(ratio(*colors),3)
 def test_light_biography_stroke_has_contrast(self):
  self.light()
  colors=self.page.locator('.about-main h2 > span').evaluate('(el)=>[getComputedStyle(el).webkitTextStrokeColor,getComputedStyle(document.querySelector(".about-section")).backgroundColor]')
  self.assertGreaterEqual(ratio(*colors),3)
 def test_system_reduced_motion_cancels_active_glitch(self):
  self.page.wait_for_timeout(1700)
  self.page.locator('.wordmark-stage').hover()
  self.page.emulate_media(reduced_motion='reduce')
  self.page.wait_for_function('document.querySelector(".portfolio").dataset.effects==="off"')
  self.assertEqual(self.page.locator('.wordmark-stage').get_attribute('data-glitch'),'idle')
  self.assertEqual(self.page.locator('.effects-toggle,.glitch-trigger').count(),0)
 def test_no_intersection_observer_keeps_projects_readable(self):
  context=self.b.new_context()
  context.add_init_script('delete window.IntersectionObserver')
  page=context.new_page();page.goto(BASE,wait_until='networkidle')
  self.assertEqual(page.locator('.datashard-archive').evaluate('(el)=>getComputedStyle(el).opacity'),'1')
  context.close()
 def test_cta_focus_indicator_is_inside_clipped_shape(self):
  self.page.locator('.hero-cta').focus()
  style=self.page.locator('.hero-cta').evaluate('(e)=>[getComputedStyle(e).outlineStyle,getComputedStyle(e).outlineOffset]')
  self.assertEqual(style,['solid','-5px'])
 def test_mobile_menu_is_above_hero(self):
  self.page.set_viewport_size({'width':390,'height':844})
  self.page.locator('.menu-button').click()
  self.assertTrue(self.page.locator('.navigation a').first.evaluate('(e)=>{const r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))}'))
if __name__=='__main__':unittest.main(verbosity=2)
