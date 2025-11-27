// src/lib/tm.ts
// Canonical TM percent helpers (tmPct decimal 0.50-1.00). Legacy tmPercent (0-100) migration.

export function getTmPct(program: any): number {
    const pct = program?.tmPct;
    if (typeof pct === 'number' && pct > 0 && pct <= 1) return pct;
    const legacy = program?.tmPercent;
    if (typeof legacy === 'number' && legacy > 0) return legacy / 100;
    return 0.90;
}

export function migrateProgramV2(p: any): any {
    const next = { ...(p || {}) };
    if (typeof next.tmPercent === 'number' && next.tmPct == null) {
        next.tmPct = next.tmPercent / 100;
        delete next.tmPercent;
    }
    if (typeof next.tmPct !== 'number' || !(next.tmPct > 0 && next.tmPct <= 1)) {
        next.tmPct = 0.90;
    }
    return next;
}
