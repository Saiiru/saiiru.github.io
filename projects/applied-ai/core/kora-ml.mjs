/** Learned domain proposals. Permissions always stay outside the classifier. */
import {tokenize} from './lastro.mjs';
import {routeKoraRequest} from './kora-router.mjs';
const DOMAINS=['embedded','events','finance','knowledge','senai-study','tasks-focus'];

export function classifyKora(text,model){
 if(typeof text!=='string'||text.length>4000)throw new TypeError('Use um texto de até 4000 caracteres.');
 const n=model?.vocabulary?.length;
 if(model?.name!=='KORA Rota'||model.schemaVersion!==1||!n||n>100000||
 JSON.stringify(model.classes)!==JSON.stringify(DOMAINS)||model.idf?.length!==n||
 model.coef?.length!==6||model.intercept?.length!==6||
 !model.vocabulary.every(t=>typeof t==='string')||!model.idf.every(Number.isFinite)||
 !model.coef.every(r=>r.length===n&&r.every(Number.isFinite))||!model.intercept.every(Number.isFinite)||
 !['minScore','minMargin','minKnownRatio'].every(k=>Number.isFinite(model.policy?.[k])&&model.policy[k]>=0&&model.policy[k]<=1))
 throw new TypeError('Modelo KORA inválido.');
 const words=tokenize(text), terms=[...words,...words.slice(1).map((word,i)=>words[i]+' '+word)];
 const counts=new Map();for(const term of terms)counts.set(term,(counts.get(term)||0)+1);
 const vector=model.vocabulary.map((term,i)=>(counts.get(term)||0)*model.idf[i]);
 const norm=Math.hypot(...vector);if(norm)for(let i=0;i<n;i++)vector[i]/=norm;
 const logits=model.coef.map((row,i)=>row.reduce((sum,w,j)=>sum+w*vector[j],model.intercept[i]));
 const max=Math.max(...logits),exp=logits.map(v=>Math.exp(v-max)),sum=exp.reduce((a,b)=>a+b,0);
 const probabilities=exp.map(v=>v/sum),order=probabilities.map((v,i)=>i).sort((a,b)=>probabilities[b]-probabilities[a]||a-b);
 const i=order[0],score=probabilities[i],margin=score-probabilities[order[1]],vocab=new Set(model.vocabulary);
 const knownRatio=words.length?words.filter(t=>vocab.has(t)).length/words.length:0;
 const accepted=words.length>0&&knownRatio>=model.policy.minKnownRatio&&score>=model.policy.minScore&&margin>=model.policy.minMargin;
 return {label:accepted?model.classes[i]:'Revisão manual',suggestedLabel:model.classes[i],accepted,score,margin,knownRatio,probabilities};
}

export function selectKoraRoute(text,registry,model){
 const rules=routeKoraRequest(text,registry);
 if(!model)return {...rules,source:'rules-fallback',canExecute:false};
 const prediction=classifyKora(text,model);
 // Single-label ML must not discard a second explicit domain.
 if(rules.domains.length>1)return {...rules,source:'rules-mixed',prediction,canExecute:false};
 const route=prediction.accepted?registry.find(r=>r.domain===prediction.label):null;
 return {domains:route?[route.domain]:[],skills:route?[route.skill]:[],scores:{},
 confidence:prediction.score,reason:route?'learned_proposal':'model_abstained',
 source:'trained-ml',prediction,canExecute:false};
}
