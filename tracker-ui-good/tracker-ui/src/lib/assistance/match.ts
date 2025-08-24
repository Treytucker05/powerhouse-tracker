import type { AssistanceRow } from "./loadAssistance";

type MatchInput = { targets: string[]; equipment: string[] };

export function matchAssistance(input: MatchInput, rows: AssistanceRow[]) {
    const targets = (input.targets || []).map(t => (t || "").toString().toLowerCase());
    const equipSet = new Set((input.equipment || []).map(e => e.toLowerCase()));
    const byTarget: Record<string, string[]> = {};

    for (const target of targets) {
        const matches = rows
            .filter(r => r.category.toLowerCase() === target)
            .map(r => {
                const hasEquip = r.equipment.some(e => equipSet.has(e));
                // difficulty: try to order easy->hard if provided (low < medium < high)
                const diff = r.difficulty || "";
                const diffRank = diff === "low" ? 0 : diff === "medium" ? 1 : diff === "high" ? 2 : 1;
                return { name: r.exercise, hasEquip, diffRank };
            })
            .sort((a, b) => {
                if (a.hasEquip !== b.hasEquip) return a.hasEquip ? -1 : 1; // prefer equipment match
                return a.diffRank - b.diffRank;
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
