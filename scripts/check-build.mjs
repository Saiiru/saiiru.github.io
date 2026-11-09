import { readFile, readdir } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import assert from 'node:assert/strict'
const docs=new URL('../docs/',import.meta.url)
async function entry(path,jsBudget,cssBudget){
 const html=await readFile(new URL(path,docs),'utf8')
 const initial=[...html.matchAll(/(?:src|href)="([^"<>]+\.(?:js|css))"/g)].map(match=>new URL(match[1],'https://local.test/'+path))
 const js=[],css=[]
 for(const url of initial){assert.equal(url.origin,'https://local.test');const relative=url.pathname.replace(/^\//,'');assert(relative.startsWith('assets/'));const bytes=await readFile(new URL(relative,docs));const item={file:relative,bytes:bytes.length,gzip:gzipSync(bytes).length};(relative.endsWith('.js')?js:css).push(item)}
 const total=items=>({bytes:items.reduce((n,item)=>n+item.bytes,0),gzip:items.reduce((n,item)=>n+item.gzip,0),files:items.map(item=>item.file)})
 const initialJS=total(js),styles=total(css)
 assert(initialJS.bytes>0&&styles.bytes>0)
 assert(initialJS.gzip<=jsBudget*1024,path+': initial JS budget exceeded (including module preloads)')
 assert(styles.gzip<=cssBudget*1024,path+': CSS budget exceeded')
 assert(html.includes('Content-Security-Policy')&&!html.includes("'unsafe-eval'"))
 assert(html.includes('<noscript>'))
 return {initialJS,css:styles}
}
const files=await readdir(new URL('assets/',docs));assert(!files.some(name=>name.endsWith('.map')))
const portfolio=await entry('index.html',75,18)
const components=await entry('components/index.html',40,18)
const inventory=JSON.parse(await readFile(new URL('../src/data/repositories.json',import.meta.url)))
for(const item of inventory.repositories){const url=new URL(item.url);assert(url.protocol==='https:'&&url.hostname==='github.com'&&!url.username&&!url.password)}
console.log(JSON.stringify({portfolio,components,repositoryURLs:inventory.repositories.length,policy:'Self-only static CSP, no eval, no debug maps; initial budgets include shared module preloads'},null,2))
