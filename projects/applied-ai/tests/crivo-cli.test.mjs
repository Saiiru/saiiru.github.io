import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const script=new URL('../scripts/crivo.mjs',import.meta.url).pathname;
test('CLI rejects unknown case IDs rather than reporting a false pass',()=>{
 const dir=mkdtempSync(join(tmpdir(),'crivo-'));
 try{
  const a=join(dir,'a.json'),b=join(dir,'b.json');writeFileSync(a,'{}');writeFileSync(b,JSON.stringify({'EF-99':'invalid'}));
  const r=spawnSync(process.execPath,[script,a,b],{encoding:'utf8'});
  assert.equal(r.status,2);assert.match(r.stderr,/ID|caso/i);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
