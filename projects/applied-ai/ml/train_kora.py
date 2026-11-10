"""Train KORA domain proposals. No execution permissions, network or private data."""
import json
from pathlib import Path
import subprocess
from train import ROOT, train_model, predict

CLASSES=['finance','events','senai-study','embedded','knowledge','tasks-focus']

def main():
    rows=json.loads((ROOT/'ml/data/kora-requests.json').read_text())['rows']
    # Run the real browser baseline, so the comparison does not drift into a copy.
    script="""import fs from 'node:fs'; import {routeKoraRequest} from './core/kora-router.mjs';
const registry=JSON.parse(fs.readFileSync('./kora/request-routes.json')).routes;
const texts=JSON.parse(fs.readFileSync(0,'utf8'));
console.log(JSON.stringify(texts.map(text=>routeKoraRequest(text,registry).domains[0]||'unknown')));"""
    results=json.loads(subprocess.check_output(['node','--input-type=module','-e',script],input=json.dumps([r['text'] for r in rows]).encode(),cwd=ROOT))
    baseline=dict(zip([r['text'] for r in rows],results))
    model,report,_=train_model(rows,classes=CLASSES,name='KORA Rota',baseline=lambda text:baseline[text],select_policy=True)
    model['scope']='Domain proposal only; model cannot execute actions. Mixed requests remain under explicit rules.'
    report['baseline']='Actual kora-router.mjs, top domain; single-domain synthetic test only'
    report['integrationPolicy']='Experimental ML suggestion; rules remain active default. No measured live quality gain.'
    parity=[{'text':r['text'],**predict(r['text'],model)} for r in rows if r['split'] in ['test','ood']]
    for rel,obj in [('models/kora-router.json',model),('reports/kora-ml.json',report),('ml/fixtures/kora-parity.json',parity)]:
        (ROOT/rel).write_text(json.dumps(obj,ensure_ascii=False,indent=2,allow_nan=False)+'\n')
    print(json.dumps({'counts':report['counts'],'macroF1':report['test']['macroF1'],'rulesMacroF1':report['test']['baselineMacroF1'],'coverage':report['test']['coverage'],'selectiveAccuracy':report['test']['selectiveAccuracy'],'oodRejectionRate':report['ood']['rejectionRate']}))

if __name__=='__main__':main()
