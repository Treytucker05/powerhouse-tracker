// src/lib/fiveThreeOne/prTracking.js
const KEY = 'fiveThreeOne_prs_v1';

export function getPRs() {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}
export function setPRs(prs) {
    try { localStorage.setItem(KEY, JSON.stringify(prs || {})); } catch { }
}

/** Update PR if e1RM beats previous */
export function maybeUpdatePR(liftKey, e1RM, meta = { date: new Date().toISOString() }) {
    if (!e1RM || e1RM <= 0) return getPRs();
    const prs = getPRs();
    const cur = prs[liftKey]?.e1RM || 0;
    if (e1RM > cur) {
        prs[liftKey] = { e1RM, ...meta };
        setPRs(prs);
    }
    return prs;
}
