import {cp,mkdir,rm} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const source=resolve(root,'projects/applied-ai');
const destination=resolve(root,'public/labs');
// Only this generated directory is replaced; source and user files are untouched.
await rm(destination,{recursive:true,force:true});
await mkdir(destination,{recursive:true});
for(const name of ['mark.svg','index.html','app.js','style.css','core','docs','models','reports']){
 await cp(resolve(source,name),resolve(destination,name),{recursive:true});
}
console.log('Synced canonical Applied AI demo to public/labs');
