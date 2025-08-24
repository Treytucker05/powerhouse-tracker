import { loadCsv } from "@/lib/loadCsv";

export type AssistanceRow = {
    category: string;
    exercise: string;
    equipment: string[];
    difficulty?: string;
    backStressFlag?: boolean;
    notes?: string;
};

const truthy = new Set(["1", "true", "yes", "y", "low", "high"]);

function splitEquip(v?: string): string[] {
    if (!v) return [];
    return v
        .split(/[|;,/]/g)
        .map(s => s.trim().toLowerCase())
        .filter(Boolean);
}

function normStr(v: any): string {
    return (v ?? "").toString().trim();
}

function lower(v: any): string {
    return normStr(v).toLowerCase();
}

export async function loadAssistanceCsv(): Promise<AssistanceRow[]> {
    const rows = await loadCsv<Record<string, any>>("methodology/extraction/assistance_exercises.csv");
    const out: AssistanceRow[] = [];
    for (const r of rows || []) {
        // Filter to plausible data rows: require at least these headers present
        const keys = Object.keys(r || {});
        if (keys.length < 4) continue;
        const hasCategory = keys.some(k => /^category$/i.test(k));
        const hasExercise = keys.some(k => /^exercise$/i.test(k));
        const hasEquipment = keys.some(k => /^equipment$/i.test(k));
        if (!hasCategory || !hasExercise || !hasEquipment) continue;

        const categoryRaw = r["category"] ?? r["Category"];
        const exerciseRaw = r["exercise"] ?? r["Exercise"];
        const equipmentRaw = r["equipment"] ?? r["Equipment"];
        const difficultyRaw = r["difficulty"] ?? r["Difficulty"];
        const backRaw = r["backstressflag"] ?? r["back_stress_flag"] ?? r["BackStressFlag"] ?? r["backstress"];
        const notesRaw = r["notes"] ?? r["Notes"];

        const category = lower(categoryRaw);
        const exercise = normStr(exerciseRaw);
        const equipment = splitEquip(normStr(equipmentRaw));
        if (!category || !exercise) continue;

        const row: AssistanceRow = {
            category,
            exercise,
            equipment,
        };
        const diff = lower(difficultyRaw);
        if (diff) row.difficulty = diff;
        const back = lower(backRaw);
        if (back) row.backStressFlag = truthy.has(back);
        const notes = normStr(notesRaw);
        if (notes) row.notes = notes;
        out.push(row);
    }
    return out;
}
