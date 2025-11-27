export const UNITS = { LBS: 'lbs', KG: 'kg' } as const;
export type Unit = typeof UNITS[keyof typeof UNITS];

// Default Training Max percent used across the app when not specified
export const DEFAULT_TM_PCT = 0.90;

export function isKg(u?: string | null): boolean {
    if (!u) return false;
    const s = String(u).toLowerCase();
    return s === 'kg' || s === 'kgs' || s === 'kilogram' || s === 'kilograms';
}

export function isLbs(u?: string | null): boolean {
    if (!u) return true; // default to lbs if unknown
    const s = String(u).toLowerCase();
    return s === 'lb' || s === 'lbs' || s === 'pound' || s === 'pounds';
}

// Normalize various input tokens to our canonical units
export function normalizeUnits(u?: string | null): Unit {
    return isKg(u) ? UNITS.KG : UNITS.LBS;
}

// Step/plate increment for a given unit system
export function incrementFor(units: Unit) { return units === UNITS.KG ? 2.5 : 5; }

// Basic formatter for displaying a weight with unit suffix, e.g., 135lbs or 60kg
export function formatWeight(value: number | string, unit?: string | null): string {
    const u = normalizeUnits(unit || undefined);
    const v = typeof value === 'string' ? Number(value) : value;
    if (!Number.isFinite(v)) return String(value);
    return `${v}${u}`;
}
