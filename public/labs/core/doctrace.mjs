export const corpusPaths=['docs/entregas.md','docs/estornos.md','docs/pagamentos.md','docs/acesso.md','docs/qualidade.md','docs/escalonamento.md'];
export function tokenize(text){return String(text).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().match(/[a-z0-9]{2,}/g)||[];}
export function chunkDocuments(documents){
  const passages=[];
  for(const doc of documents){
    if(!doc.path.endsWith('.md')) continue;
    const sections=String(doc.text).split(/\n(?=##? )/).map(s=>s.trim()).filter(Boolean);
    sections.forEach((section,index)=>{
      const body=section.replace(/^##?[^\n]*\n?/,'').trim();
      if(body) passages.push({id:`S${String(passages.length+1).padStart(2,'0')}`,path:doc.path,heading:section.match(/^##?\s*(.*)/)?.[1]||'Documento',text:body,index});
    });
  }
  return passages;
}
export function retrieve(query,passages,limit=3){
  const terms=[...new Set(tokenize(query))].filter(t=>!new Set(['para','como','qual','quais','com','uma','que','dos','das','por','tem','sobre']).has(t));
  if(!terms.length||!passages.length) return [];
  const docs=passages.map(p=>tokenize(`${p.heading} ${p.text}`));
  const avg=docs.reduce((s,d)=>s+d.length,0)/docs.length||1;
  const scored=passages.map((p,i)=>{
    const tf=new Map(); for(const t of docs[i]) tf.set(t,(tf.get(t)||0)+1);
    let score=0,matched=0;
    for(const term of terms){const f=tf.get(term)||0;if(!f)continue;matched++;
      const df=docs.filter(d=>d.includes(term)).length;
      const idf=Math.log(1+(docs.length-df+0.5)/(df+0.5));
      score+=idf*(f*2.2)/(f+1.2*(0.25+0.75*docs[i].length/avg));
    }
    return {...p,score,matched,queryTerms:terms.length};
  });
  return scored.filter(p=>p.score>0).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id)).slice(0,limit);
}
export function groundedAnswer(results){
  if(!results.length) return 'Não encontrei evidência no corpus local para responder.';
  return results.map(p=>`“${p.text}” [${p.id}]`).join('\n\n');
}
