import {readFile} from 'node:fs/promises';
import {routeWithModel} from '../core/vetor-ml.mjs';
const text=process.argv.slice(2).join(' ');
if(!text.trim()){console.error('Uso: node scripts/vetor.mjs "Meu pagamento falhou"');process.exit(2);}
try{const model=JSON.parse(await readFile(new URL('../models/vetor.json',import.meta.url),'utf8'));console.log(JSON.stringify(routeWithModel(text,model),null,2));}
catch(e){console.error(e.message);process.exitCode=2;}
