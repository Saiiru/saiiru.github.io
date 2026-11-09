import test from 'node:test';
import assert from 'node:assert/strict';
import {tickets,routeTicket,benchmarkTickets,createReview,approveReview,exportApproved} from '../core/vetor.mjs';

test('benchmark uses 12 labeled fictional tickets and computes counts',()=>{const b=benchmarkTickets();assert.equal(tickets.length,12);assert.equal(b.covered,12);assert.equal(b.correct,12);assert.equal(b.accuracy,b.correct/b.covered);});
test('payment risk routes to high severity',()=>{const r=routeTicket('Cobrança duplicada no cartão');assert.equal(r.team,'Pagamentos');assert.equal(r.severity,'Alta');assert.match(r.reason,/Regra/);});
test('refund is prioritized over generic order mention',()=>{assert.equal(routeTicket('Estorno do pedido').team,'Estornos');});
test('unrecognized ticket goes to manual review and reduces coverage',()=>{const r=routeTicket('Situação sem contexto');assert.equal(r.covered,false);const b=benchmarkTickets([{id:'X',text:'Situação sem contexto',team:'Revisão manual',severity:'Indefinida'}]);assert.equal(b.coverage,0);assert.equal(b.accuracy,0);});
test('approval gate rejects export until human action',()=>{const r=createReview('Entrega atrasada');assert.throws(()=>exportApproved(r),/Aprovação humana/);const approved=exportApproved(approveReview(r));assert.equal(approved.approvedByHuman,true);assert.equal(approved.routing.team,'Entrega');});
