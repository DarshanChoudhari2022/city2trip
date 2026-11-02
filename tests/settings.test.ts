import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSettings } from '../lib/validation.ts';
test('vehicle descriptions and capacities survive settings validation',()=>{const input={phone:'',email:'',address:'',cities:'',about:'About us',domain:'',announcement:'Hello',faqs:[],fleet:[{name:'SUV',description:'Family travel',capacity:'6 passengers + driver'}]};assert.deepEqual(validateSettings(input).fleet,input.fleet);assert.throws(()=>validateSettings({...input,fleet:[{name:'',description:'Test',capacity:''}]}));});
