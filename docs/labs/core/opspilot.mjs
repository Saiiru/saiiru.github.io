export const tickets = [
  {id:'OP-01',text:'Pedido saiu para entrega, mas o entregador não chegou.',team:'Entrega',severity:'Média'},
  {id:'OP-02',text:'Entrega atrasada há muitas horas e preciso de ajuda.',team:'Entrega',severity:'Alta'},
  {id:'OP-03',text:'Endereço de entrega incorreto no pedido.',team:'Entrega',severity:'Média'},
  {id:'OP-04',text:'Solicitei estorno e quero acompanhar o reembolso.',team:'Estornos',severity:'Média'},
  {id:'OP-05',text:'Reembolso urgente: cobrança indevida no pedido.',team:'Estornos',severity:'Alta'},
  {id:'OP-06',text:'Meu estorno ainda está em análise.',team:'Estornos',severity:'Média'},
  {id:'OP-07',text:'Pagamento recusado no cartão durante a compra.',team:'Pagamentos',severity:'Média'},
  {id:'OP-08',text:'Cobrança duplicada no cartão, preciso de suporte urgente.',team:'Pagamentos',severity:'Alta'},
  {id:'OP-09',text:'Não consigo concluir o pagamento via pix.',team:'Pagamentos',severity:'Média'},
  {id:'OP-10',text:'Não consigo entrar na conta e recuperar o acesso.',team:'Acesso',severity:'Média'},
  {id:'OP-11',text:'Conta bloqueada; suspeita de invasão.',team:'Acesso',severity:'Alta'},
  {id:'OP-12',text:'Esqueci a senha e o login falha.',team:'Acesso',severity:'Média'}
];

const rules=[
  {team:'Estornos',pattern:/estorno|reembolso|devolu[cç][aã]o/i,reason:'termo de estorno ou reembolso'},
  {team:'Pagamentos',pattern:/pagamento|cobran[cç]a|cart[aã]o|\bpix\b/i,reason:'termo de pagamento'},
  {team:'Acesso',pattern:/acesso|conta|login|senha|entrar/i,reason:'termo de acesso'},
  {team:'Entrega',pattern:/entrega|entregador|endere[cç]o|pedido/i,reason:'termo de entrega'}
];

export function routeTicket(text){
  const input=String(text).slice(0,4000);
  const match=rules.find(r=>r.pattern.test(input));
  if(!match) return {team:'Revisão manual',severity:'Indefinida',covered:false,reason:'Nenhuma regra encontrou uma categoria; revisão humana necessária.'};
  const high=/urgente|duplicad[ao]|invas[aã]o|bloquead[ao]|atrasad[ao].*(horas|dias)|indevid[ao]/i.test(input);
  return {team:match.team,severity:high?'Alta':'Média',covered:true,reason:`Regra: ${match.reason}; prioridade ${high?'alta por sinal de urgência/risco':'média por ausência de sinal de urgência'}.`};
}

export function benchmarkTickets(data=tickets){
  const outcomes=data.map(t=>({id:t.id,expectedTeam:t.team,expectedSeverity:t.severity,prediction:routeTicket(t.text)}));
  const covered=outcomes.filter(o=>o.prediction.covered).length;
  const correct=outcomes.filter(o=>o.prediction.covered&&o.prediction.team===o.expectedTeam&&o.prediction.severity===o.expectedSeverity).length;
  return {total:data.length,covered,correct,coverage:data.length?covered/data.length:0,accuracy:covered?correct/covered:0,outcomes};
}

export function createReview(text,prediction=routeTicket(text)){return {text:String(text),prediction,approved:false};}
export function approveReview(review){return {...review,approved:true};}
export function exportApproved(review){
  if(!review?.approved) throw new Error('Aprovação humana obrigatória antes da exportação.');
  return {ticket:review.text,routing:review.prediction,approvedByHuman:true};
}
