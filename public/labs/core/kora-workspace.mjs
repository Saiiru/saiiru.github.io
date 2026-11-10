/** Pure local adapters. Integer cents and timezone-aware events; no I/O. */
const requireValue=(condition,message)=>{if(!condition)throw new TypeError(message);};
function cents(n){requireValue(Number.isSafeInteger(n)&&n>=0,'Valores precisam ser centavos inteiros não negativos.');return n;}
function add(a,b){const n=a+b;requireValue(Number.isSafeInteger(n),'Total excede a precisão suportada.');return n;}
function dateOnly(value){
 requireValue(typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value),'Data precisa usar AAAA-MM-DD.');
 const d=new Date(value+'T00:00:00Z');requireValue(!Number.isNaN(+d)&&d.toISOString().slice(0,10)===value,'Data inexistente.');return value;
}
export function formatMoney(value){
 requireValue(Number.isSafeInteger(value),'Quantia inválida.');
 const n=Math.abs(value);return `${value<0?'-':''}R$ ${Math.floor(n/100).toLocaleString('pt-BR')},${String(n%100).padStart(2,'0')}`;
}
export function summarizeFinance(data,month){
 requireValue(typeof month==='string'&&/^\d{4}-(0[1-9]|1[0-2])$/.test(month),'Mês precisa usar AAAA-MM.');
 requireValue(data?.schema==='luka.finance-export/1'&&Array.isArray(data.transactions)&&data.transactions.length<=10000,'Exportação LUKA inválida (máximo 10.000 lançamentos).');
 const out={income:0,spent:0,planned:0,net:0,budgets:[]},categories=new Map();
 for(const row of data.transactions){
  requireValue(row&&typeof row==='object','Lançamento inválido.');
  dateOnly(row.transaction_date);const amount=cents(row.amount_cents);
  requireValue(['income','expense'].includes(row.transaction_type),'Tipo de lançamento inválido.');
  requireValue(['confirmed','paid','planned','cancelled','refunded'].includes(row.status),'Status de lançamento inválido.');
  if(!row.transaction_date.startsWith(month))continue;
  if(row.status==='planned'){if(row.transaction_type==='expense')out.planned=add(out.planned,amount);continue;}
  if(!['confirmed','paid'].includes(row.status))continue;
  if(row.transaction_type==='income')out.income=add(out.income,amount);
  else {out.spent=add(out.spent,amount);const cat=String(row.category_name||'Sem categoria');categories.set(cat,add(categories.get(cat)||0,amount));}
 }
 requireValue(data.budgets===undefined||Array.isArray(data.budgets),'Orçamentos inválidos.');
 for(const b of data.budgets||[]){
  requireValue(b&&typeof b.category_name==='string','Categoria inválida.');cents(b.limit_cents);
  if(b.month!==month)continue;
  const spent=categories.get(b.category_name)||0;out.budgets.push({category:b.category_name,limit:b.limit_cents,spent,remaining:b.limit_cents-spent});
 }
 out.net=out.income-out.spent;return out;
}
export function listEvents(data){
 requireValue(Array.isArray(data)&&data.length<=1000,'Agenda precisa ser uma lista de até 1.000 atividades.');
 return data.map(row=>{
  requireValue(row&&typeof row.title==='string'&&row.title.trim()&&row.title.length<=300&&typeof row.trip==='string','Título e viagem são obrigatórios.');
  requireValue(typeof row.at==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/.test(row.at),'Horário precisa incluir fuso.');
  dateOnly(row.at.slice(0,10));const date=new Date(row.at);requireValue(!Number.isNaN(+date),'Horário inválido.');
  return {title:row.title,trip:row.trip,at:date.toISOString()};
 }).sort((a,b)=>a.at.localeCompare(b.at)||a.title.localeCompare(b.title));
}
