from playwright.sync_api import sync_playwright
import re
def lum(s):
 v=[float(n)/255 for n in re.findall(r'\d+\.?\d*',s)[:3]]
 v=[n/12.92 if n<=.04045 else ((n+.055)/1.055)**2.4 for n in v]
 return sum(a*b for a,b in zip(v,[.2126,.7152,.0722]))
def ratio(a,b):
 x,y=sorted([lum(a),lum(b)])
 return (y+.05)/(x+.05)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 g=b.new_page();g.goto('http://127.0.0.1:4392',wait_until='networkidle')
 g.locator('.theme-control').click()
 for item in g.locator('.shard-select').all():
  colors=item.evaluate('el=>[getComputedStyle(el.querySelector("strong")).color,getComputedStyle(el).backgroundColor]')
  value=ratio(*colors);print(item.get_attribute('data-shard'),round(value,2))
  assert value>=4.5,colors
 b.close()
print('CATALOGUE_LIGHT_CONTRAST_PASS')
