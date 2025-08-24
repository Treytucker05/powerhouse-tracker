import type { AssistanceRow } from "./loadAssistance";

type MatchInput = { targets: string[]; equipment: string[] };

export function matchAssistance(input: MatchInput, rows: AssistanceRow[]) {
    // Normalize targets (support aliases)
    const targets = (input.targets || [])
        .map(t => (t || "").toString().toLowerCase())
        .map(t => (t === 'single' ? 'single_leg' : t));
    const equipSet = new Set((input.equipment || []).map(e => (e || '').toString().toLowerCase()));
    const byTarget: Record<string, string[]> = {};

    for (const target of targets) {
        const matches = rows
            .filter(r => r.category.toLowerCase() === target)
            .map(r => {
                const interCount = r.equipment.reduce((n, e) => n + (equipSet.has(e) ? 1 : 0), 0);
                // difficulty: try to order easy->hard if provided (low < medium < high)
                const diff = (r.difficulty || '').toLowerCase();
                const diffRank = diff === 'low' ? 0 : diff === 'medium' ? 1 : diff === 'high' ? 2 : 1;
                return { name: r.exercise, interCount, diffRank };
            })
            .sort((a, b) => {
                if (a.interCount !== b.interCount) return b.interCount - a.interCount; // prefer more equip matches
                return a.diffRank - b.diffRank; // then easier first
            });

        const unique: string[] = [];
        for (const m of matches) {
            if (!unique.includes(m.name)) unique.push(m.name);
            if (unique.length >= 6) break;
        }
        byTarget[target] = unique;
    }

    return { byTarget };
}
