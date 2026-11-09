import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {corpusPaths,chunkDocuments,retrieve,groundedAnswer} from '../core/lastro.mjs';
const query=process.argv.slice(2).join(' ').trim();
if(!query){console.error('Uso: node scripts/lastro.mjs "cobrança duplicada"');process.exit(2);}
const root=resolve(import.meta.dirname,'..');
const docs=await Promise.all(corpusPaths.map(async path=>({path,text:await readFile(resolve(root,path),'utf8')})));
const results=retrieve(query,chunkDocuments(docs),3);
console.log(JSON.stringify({query,answer:groundedAnswer(results),sources:results},null,2));
