import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const policy=[
 "default-src 'none'", "script-src 'self'", "style-src 'self'",
 "style-src-attr 'none'", "img-src 'self'", "font-src 'self'",
 "connect-src 'self'", "base-uri 'none'", "form-action 'none'",
 "object-src 'none'", "frame-src 'none'", "worker-src 'none'"
].join('; ')

export default defineConfig({
 plugins:[react(),{
  name:'static-page-security', apply:'build',
  configResolved(config){
   if(!config.isProduction)throw new Error('The published site must use a production build. Use npm run build.')
  },
  transformIndexHtml(){return [
   {tag:'meta',attrs:{'http-equiv':'Content-Security-Policy',content:policy},injectTo:'head-prepend'},
   {tag:'meta',attrs:{name:'referrer',content:'strict-origin-when-cross-origin'},injectTo:'head-prepend'}
  ]}
 }],
 base:'/',
 server:{host:'127.0.0.1'},
 preview:{host:'127.0.0.1'},
 build:{outDir:'docs',sourcemap:false}
})
