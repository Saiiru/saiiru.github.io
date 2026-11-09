import { readFile, readdir } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import assert from 'node:assert/strict'

const files=await readdir(new URL('../docs/assets/',import.meta.url))
const indexJS=files.find(name=>/^index-.*\.js$/.test(name))
const indexCSS=files.find(name=>/^index-.*\.css$/.test(name))
assert(indexJS&&indexCSS,'Build output missing')
const js=await readFile(new URL('../docs/assets/'+indexJS,import.meta.url))
const css=await readFile(new URL('../docs/assets/'+indexCSS,import.meta.url))
assert(gzipSync(js).length<=75*1024,'Initial JS exceeds 75KiB gzip. Check for development React or new dependencies.')
assert(gzipSync(css).length<=18*1024,'CSS exceeds 18KiB gzip')
assert(!files.some(name=>name.endsWith('.map')),'Do not publish debug source maps')
const html=await readFile(new URL('../docs/index.html',import.meta.url),'utf8')
assert(html.includes('Content-Security-Policy'))
assert(!html.includes("'unsafe-eval'"))
assert(html.includes('<noscript>'),'Static fallback missing')
const inventory=JSON.parse(await readFile(new URL('../src/data/repositories.json',import.meta.url),'utf8'))
for(const item of inventory.repositories){
 const url=new URL(item.url)
 assert(url.protocol==='https:'&&url.hostname==='github.com'&&!url.username&&!url.password,'Unexpected repository destination: '+item.name)
}
console.log(JSON.stringify({initialJS:{bytes:js.length,gzip:gzipSync(js).length},css:{bytes:css.length,gzip:gzipSync(css).length},repositoryURLs:inventory.repositories.length,policy:'local assets, no eval, no external requests'},null,2))
