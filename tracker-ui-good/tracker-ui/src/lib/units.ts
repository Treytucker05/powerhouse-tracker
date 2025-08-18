export const UNITS = { LBS: 'lbs', KG: 'kg' } as const;
export type Unit = typeof UNITS[keyof typeof UNITS];
export function incrementFor(units: Unit) { return units === 'kg' ? 2.5 : 5; }
