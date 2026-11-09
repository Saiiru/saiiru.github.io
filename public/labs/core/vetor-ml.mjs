// Inference over exported learned weights. Training is in ml/train.py.
import {tokenize} from './lastro.mjs';

function validateModel(model){
  const size=model?.vocabulary?.length;
  if(model?.schemaVersion!==1||!size||model.classes?.length!==4||model.idf?.length!==size||
     model.coef?.length!==4||model.intercept?.length!==4||
     !model.coef.every(row=>row.length===size&&row.every(Number.isFinite))||
     !model.idf.every(Number.isFinite)||!model.intercept.every(Number.isFinite)||
     !model.policy||model.policy.maxChars!==4000){
    throw new Error('Modelo inválido ou incompatível. Reproduza o treinamento.');
  }
}

export function routeWithModel(text,model){
  validateModel(model);
  if(typeof text!=='string')throw new TypeError('Forneça texto para classificação.');
  if(text.length>4000)throw new RangeError('O texto deve ter até 4000 caracteres.');
  const words=tokenize(text);
  const terms=[...words,...words.slice(1).map((word,i)=>`${words[i]} ${word}`)];
  const counts=new Map();for(const term of terms)counts.set(term,(counts.get(term)||0)+1);
  const vector=model.vocabulary.map((term,i)=>(counts.get(term)||0)*model.idf[i]);
  const norm=Math.sqrt(vector.reduce((s,v)=>s+v*v,0));
  if(norm)for(let i=0;i<vector.length;i++)vector[i]/=norm;
  const logits=model.coef.map((row,i)=>row.reduce((s,w,j)=>s+w*vector[j],model.intercept[i]));
  const exp=logits.map(n=>Math.exp(n-Math.max(...logits)));
  const total=exp.reduce((s,n)=>s+n,0);
  const probabilities=exp.map(n=>n/total);
  const ranking=probabilities.map((score,i)=>({score,i})).sort((a,b)=>b.score-a.score||a.i-b.i);
  const {i,score}=ranking[0];
  const margin=score-ranking[1].score;
  const vocab=new Set(model.vocabulary);
  const knownRatio=words.length?words.filter(w=>vocab.has(w)).length/words.length:0;
  const covered=words.length>0&&knownRatio>=model.policy.minKnownRatio&&score>=model.policy.minScore&&margin>=model.policy.minMargin;
  const features=model.vocabulary.map((term,j)=>({term,contribution:vector[j]*model.coef[i][j]}))
    .filter(v=>v.contribution>0).sort((a,b)=>b.contribution-a.contribution).slice(0,4);
  const high=/urgente|duplicad[ao]|invas[aã]o|bloquead[ao]|atrasad[ao].*(horas|dias)|indevid[ao]/i.test(text);
  return {team:covered?model.classes[i]:'Revisão manual',suggestedTeam:model.classes[i],
    severity:covered?(high?'Alta':'Média'):'Indefinida',covered,source:'trained-ml',
    score,margin,knownRatio,probabilities,features,
    reason:`${covered?'Modelo supervisionado':'Sinal insuficiente: revisão manual'}. Pontuação não calibrada ${(score*100).toFixed(1)}%; prioridade por regra separada.`,
    datasetSha256:model.datasetSha256};
}
