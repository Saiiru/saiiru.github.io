import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequestGate} from '../core/request-gate.mjs';
test('editing input invalidates a pending async completion',()=>{
 const gate=createRequestGate();const old=gate.begin();gate.invalidate();assert.equal(gate.current(old),false);
});
test('only latest request may commit a response',()=>{
 const gate=createRequestGate();const old=gate.begin(),latest=gate.begin();
 assert.equal(gate.current(old),false);assert.equal(gate.current(latest),true);
});
