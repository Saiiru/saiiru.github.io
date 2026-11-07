export const evalCases = [
  {id:'EF-01',task:'Resuma a política de estorno em JSON.',response:'{"status":"estorno","prazo":"até 5 dias"}',assertions:{json:true,jsonKeys:['status','prazo'],required:['estorno'],maxChars:120}},
  {id:'EF-02',task:'Explique uma entrega atrasada em uma frase.',response:'A entrega atrasou; consulte o acompanhamento do pedido.',assertions:{required:['entrega','pedido'],forbidden:['garantido'],maxChars:100}},
  {id:'EF-03',task:'Responda sobre acesso sem pedir senha.',response:'Para recuperar o acesso, use a redefinição de senha.',assertions:{required:['acesso'],forbidden:['envie sua senha'],maxChars:100}},
  {id:'EF-04',task:'Classifique uma cobrança duplicada em JSON.',response:'{"categoria":"pagamento","prioridade":"alta"}',assertions:{json:true,jsonKeys:['categoria','prioridade'],required:['pagamento'],forbidden:['reembolso garantido'],maxChars:100}},
  {id:'EF-05',task:'Indique que a decisão precisa de análise humana.',response:'A análise humana vai revisar o caso.',assertions:{required:['análise humana'],forbidden:['aprovado'],maxChars:90}},
  {id:'EF-06',task:'Informe o canal de acompanhamento, sem prometer prazo.',response:'Acompanhe o protocolo no painel.',assertions:{required:['protocolo','painel'],forbidden:['amanhã','garantido'],maxChars:90}}
];

export const defaultInstruction = 'Responda somente com informações do caso. Não prometa resultados. Quando solicitado, use JSON válido.';

export function evaluateCase(testCase, response) {
  const a=testCase.assertions;
  const reasons=[];
  const normalized=String(response).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  for(const term of a.required||[]) if(!normalized.includes(term.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase())) reasons.push(`Falta termo obrigatório: ${term}`);
  for(const term of a.forbidden||[]) if(normalized.includes(term.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase())) reasons.push(`Contém termo proibido: ${term}`);
  if(a.maxChars!==undefined && [...String(response)].length>a.maxChars) reasons.push(`Excede ${a.maxChars} caracteres`);
  if(a.json){
    try { const value=JSON.parse(response); if(!value || typeof value!=='object' || Array.isArray(value)) reasons.push('JSON deve ser objeto');
      else for(const key of a.jsonKeys||[]) if(!Object.hasOwn(value,key)) reasons.push(`Falta chave JSON: ${key}`);
    } catch { reasons.push('JSON inválido'); }
  }
  return {id:testCase.id,passed:reasons.length===0,reasons:reasons.length?reasons:['Todas as asserções passaram']};
}

export function evaluateSuite(cases=evalCases, overrides={}) {
  const results=cases.map(c=>evaluateCase(c,overrides[c.id]??c.response));
  const passed=results.filter(r=>r.passed).length;
  return {total:results.length,passed,failed:results.length-passed,rate:results.length?passed/results.length:0,results};
}
