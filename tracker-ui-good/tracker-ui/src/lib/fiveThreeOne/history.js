// src/lib/fiveThreeOne/history.js
import * as storage from '../storage.js';

const HIST_KEY = 'fiveThreeOne_history_v1';

export function getHistory() {
    try { return storage.get(HIST_KEY) || []; } catch (e) { return []; }
}
export function clearHistory() {
    try { storage.remove(HIST_KEY); } catch (e) { /* ignore */ }
}
export function addSession(entry) {
    const list = getHistory();
    list.push(entry);
    try { storage.set(HIST_KEY, list); } catch (e) { /* ignore */ }
    return list;
}

export function estimate1RM(weight, reps) {
    const w = Number(weight || 0);
    const r = Number(reps || 0);
    if (w <= 0 || r <= 0) return 0;
    return +(w * r * 0.0333 + w).toFixed(1);
}
