import { describe,it } from 'node:test';
import assert from 'node:assert/strict';
import { toMinor,fromMinor,calculatePrice } from '../lib/domain/money';
import { localInputToUtc,utcToIndiaDate } from '../lib/domain/datetime';
const rule={ratePerKm:'12.50',minimumBillableKm:100,minimumTripAmount:'1000.00',driverAllowance:'250.00',nightAllowance:'100.00',outstationAllowance:'0',pickupDropCharge:'0',oneWaySurcharge:'0',advancePercent:'25.00',taxRatePercent:'18.00',taxTolls:false,taxParking:false};
describe('integer money and rental pricing',()=>{
 it('converts rupees without floating point',()=>{assert.equal(toMinor('123.45'),12345n);assert.equal(fromMinor(12345n),'123.45')});
 it('applies minimum billable kilometres before pricing',()=>{const p=calculatePrice(rule,{distanceKm:'42',tripType:'outstation_one_way'});assert.equal(p.billableKm,'100.0');assert.equal(p.subtotal,'1500.00');assert.equal(p.tax,'270.00');assert.equal(p.total,'1770.00');assert.equal(p.advance,'442.50')});
 it('only applies outstation and night allowances for matching trip options',()=>{const local=calculatePrice(rule,{distanceKm:'100',tripType:'daily'});const night=calculatePrice(rule,{distanceKm:'100',tripType:'outstation_round_trip',includesNight:true});assert.equal(local.subtotal,'1250.00');assert.equal(night.subtotal,'1600.00')});
 it('applies a discount before tax and does not allow negative totals',()=>{const p=calculatePrice(rule,{distanceKm:'100',tripType:'daily',discountAmount:'2000'});assert.equal(p.discount,'1250.00');assert.equal(p.tax,'0.00');assert.equal(p.total,'0.00')});
 it('rejects negative, malformed, and over-precision currency',()=>{assert.throws(()=>toMinor('-1'));assert.throws(()=>toMinor('1.001'));assert.throws(()=>calculatePrice(rule,{distanceKm:'1.25',tripType:'daily'}))});
});
describe('Asia/Kolkata date-time handling',()=>{
 it('stores browser local time as UTC for database records',()=>assert.equal(localInputToUtc('2026-10-22T10:00'),'2026-10-22 04:30:00'));
 it('handles crossing UTC midnight when comparing rate dates',()=>assert.equal(utcToIndiaDate('2026-10-22 20:00:00'),'2026-10-23'));
 it('rejects invalid browser date-times',()=>assert.throws(()=>localInputToUtc('2026-02-30T12:00')));
});
