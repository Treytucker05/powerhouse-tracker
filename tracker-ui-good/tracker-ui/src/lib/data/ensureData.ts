import { loadCsv } from "@/lib/loadCsv";
import type { SeventhWeekRow, TMRuleRow, JokerRuleRow } from "@/types/step3";

export async function loadSeventhWeekCsv(): Promise<SeventhWeekRow[]> {
    return loadCsv<SeventhWeekRow>(`${import.meta.env.BASE_URL}methodology/extraction/seventh_week.csv`);
}
export async function loadTMPoliciesCsv(): Promise<TMRuleRow[]> {
    return loadCsv<TMRuleRow>(`${import.meta.env.BASE_URL}methodology/extraction/tm_rules.csv`);
}
export async function loadJokerRulesCsv(): Promise<JokerRuleRow[]> {
    return loadCsv<JokerRuleRow>(`${import.meta.env.BASE_URL}methodology/extraction/joker_rules.csv`);
}

export async function getDataHealth() {
    const status = { seventhWeek: false, tmRules: false, jokerRules: false };
    try { const a = await loadSeventhWeekCsv(); status.seventhWeek = Array.isArray(a) && a.length > 0; } catch { }
    try { const b = await loadTMPoliciesCsv(); status.tmRules = Array.isArray(b) && b.length > 0; } catch { }
    try { const c = await loadJokerRulesCsv(); status.jokerRules = Array.isArray(c) && c.length > 0; } catch { }
    return status;
}
