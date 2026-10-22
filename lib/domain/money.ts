export function toMinor(value: string | number): bigint {
  const text = String(value).trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(text)) throw new Error('Money must be a non-negative decimal with at most two places.');
  const [whole, fraction = ''] = text.split('.');
  return BigInt(whole) * 100n + BigInt((fraction + '00').slice(0, 2));
}
export function fromMinor(value: bigint): string {
  if (value < 0n) throw new Error('Minor-unit amount cannot be negative.');
  return `${value / 100n}.${String(value % 100n).padStart(2, '0')}`;
}
export function roundRatio(numerator: bigint, denominator: bigint): bigint {
  if (denominator <= 0n) throw new Error('Denominator must be positive.');
  return (numerator + denominator / 2n) / denominator;
}
export type PriceRule = { ratePerKm: string; minimumBillableKm: number; minimumTripAmount: string; localPackageAmount?: string | null; driverAllowance?: string; nightAllowance?: string; outstationAllowance?: string; pickupDropCharge?: string; oneWaySurcharge?: string; advancePercent?: string; taxRatePercent?: string; taxTolls?: boolean; taxParking?: boolean };
export type PriceInputs = { distanceKm: string | number; tripType: string; toll?: string; parking?: string; waitingCharge?: string; extraHourCharge?: string; otherCharge?: string; discountAmount?: string; includesNight?: boolean };
export type PriceResult = { billableKm: string; lines: Record<string, string>; lineDiscounts: Record<string, string>; lineTaxes: Record<string, string>; subtotal: string; discount: string; taxableBase: string; tax: string; total: string; advance: string };
function kmTenths(value: string | number): bigint {
  const text = String(value).trim();
  if (!/^\d+(?:\.\d)?$/.test(text)) throw new Error('Distance must have no more than one decimal place.');
  const [whole, fraction = ''] = text.split('.');
  return BigInt(whole) * 10n + BigInt(fraction || '0');
}
function money(value: bigint): string { return fromMinor(value); }
function allocate(weights: Record<string, bigint>, total: bigint, weightTotal: bigint): Record<string, bigint> {
  const result: Record<string, bigint> = {}; const remainders: Array<[string, bigint]> = []; let assigned = 0n;
  if (total === 0n || weightTotal === 0n) { for (const key of Object.keys(weights)) result[key] = 0n; return result; }
  for (const [key, weight] of Object.entries(weights)) { const product = weight * total; result[key] = product / weightTotal; assigned += result[key]; remainders.push([key, product % weightTotal]); }
  remainders.sort((a, b) => a[1] === b[1] ? a[0].localeCompare(b[0]) : a[1] > b[1] ? -1 : 1);
  let remaining = total - assigned;
  for (const [key] of remainders) { if (remaining === 0n) break; if (weights[key] > 0n) { result[key] += 1n; remaining -= 1n; } }
  if (remaining !== 0n) throw new Error('Unable to allocate rounded amount.');
  return result;
}
export function calculatePrice(rule: PriceRule, input: PriceInputs): PriceResult {
  const actualTenths = kmTenths(input.distanceKm);
  const billableTenths = actualTenths > BigInt(rule.minimumBillableKm) * 10n ? actualTenths : BigInt(rule.minimumBillableKm) * 10n;
  const distanceCharge = roundRatio(toMinor(rule.ratePerKm) * billableTenths, 10n);
  const minAmount = toMinor(rule.minimumTripAmount);
  const packageAmount = input.tripType === 'local_package' && rule.localPackageAmount ? toMinor(rule.localPackageAmount) : 0n;
  const base = packageAmount > 0n ? packageAmount : distanceCharge;
  const parts: Record<string, bigint> = {
    distance_charge: packageAmount > 0n ? 0n : distanceCharge,
    local_package_charge: packageAmount,
    minimum_trip_adjustment: minAmount > base ? minAmount - base : 0n,
    driver_allowance: input.tripType.startsWith('outstation_') ? toMinor(rule.driverAllowance ?? '0') : 0n, night_allowance: input.includesNight ? toMinor(rule.nightAllowance ?? '0') : 0n,
    outstation_allowance: input.tripType.startsWith('outstation_') ? toMinor(rule.outstationAllowance ?? '0') : 0n, pickup_drop_charge: toMinor(rule.pickupDropCharge ?? '0'),
    one_way_surcharge: input.tripType === 'outstation_one_way' ? toMinor(rule.oneWaySurcharge ?? '0') : 0n, toll: toMinor(input.toll ?? '0'), parking: toMinor(input.parking ?? '0'),
    waiting_charge: toMinor(input.waitingCharge ?? '0'), extra_hour_charge: toMinor(input.extraHourCharge ?? '0'), other_charge: toMinor(input.otherCharge ?? '0'),
  };
  const subtotal = Object.values(parts).reduce((sum, n) => sum + n, 0n);
  const discount = toMinor(input.discountAmount ?? '0') > subtotal ? subtotal : toMinor(input.discountAmount ?? '0');
  const discounts = allocate(parts, discount, subtotal);
  const taxableParts: Record<string, bigint> = {};
  for (const [key, amount] of Object.entries(parts)) {
    let baseAmount = amount > (discounts[key] ?? 0n) ? amount - (discounts[key] ?? 0n) : 0n;
    if (key === 'toll' && !rule.taxTolls) baseAmount = 0n;
    if (key === 'parking' && !rule.taxParking) baseAmount = 0n;
    taxableParts[key] = baseAmount;
  }
  const taxableBase = Object.values(taxableParts).reduce((sum, n) => sum + n, 0n);
  const taxPercentHundredths = toMinor(rule.taxRatePercent ?? '0');
  const tax = roundRatio(taxableBase * taxPercentHundredths, 10000n);
  const taxes = allocate(taxableParts, tax, taxableBase);
  const total = subtotal - discount + tax;
  const advance = roundRatio(total * toMinor(rule.advancePercent ?? '0'), 10000n);
  return { billableKm: `${billableTenths / 10n}.${billableTenths % 10n}`, lines: Object.fromEntries(Object.entries(parts).map(([k,v])=>[k,money(v)])), lineDiscounts: Object.fromEntries(Object.entries(discounts).map(([k,v])=>[k,money(v)])), lineTaxes: Object.fromEntries(Object.entries(taxes).map(([k,v])=>[k,money(v)])), subtotal: money(subtotal), discount: money(discount), taxableBase: money(taxableBase), tax: money(tax), total: money(total), advance: money(advance) };
}
