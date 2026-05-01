// CSV generation hooks for 5/3/1 ProgramContextV2
// Emits:
// - templates_master row with TM %, supplemental scheme, 7th-Week mode/criteria, and progression increments
// - templates_merged weekly rows: main sets, supplemental per-week, assistance targets, and 7th-Week rows

import type { AssistanceTargets } from "../engines/assistance";
import { getAssistanceTargets } from "../engines/assistance";
import { buildSeventhWeek } from "../engines/seventhWeek";

type ProgramV2 = any; // use loose typing to avoid importing context types; shape is read-only for CSV

// Canonical 5/3/1 week labels and percent tables
const WEEK_LABELS = ["3x5", "3x3", "5/3/1"] as const;
const MAIN_PCTS: Record<(typeof WEEK_LABELS)[number], number[]> = {
    "3x5": [65, 75, 85],
    "3x3": [70, 80, 90],
    "5/3/1": [75, 85, 95],
};
const MAIN_REPS: Record<(typeof WEEK_LABELS)[number], (number | string)[]> = {
    "3x5": [5, 5, 5],
    "3x3": [3, 3, 3],
    "5/3/1": [5, 3, 1],
};

// Supplemental helpers mirror engines/supplemental.js mapping
function mapWeekLabelToIndex(weekLabel?: string) {
    const lbl = String(weekLabel || '').toLowerCase();
    if (lbl.includes('3x5')) return 1;
    if (lbl.includes('3x3')) return 2;
    if (lbl.includes('5/3/1') || lbl.includes('531')) return 3;
    return 0; // unknown/deload
}
function getFirstSetPct(weekIndex: number) {
    if (weekIndex === 1) return 65;
    if (weekIndex === 2) return 70;
    if (weekIndex === 3) return 75;
    return null;
}
function getSecondSetPct(weekIndex: number) {
    if (weekIndex === 1) return 75;
    if (weekIndex === 2) return 80;
    if (weekIndex === 3) return 85;
    return null;
}

function toCsv(headers: string[], rows: any[]): string {
    const esc = (v: any) => {
        if (v == null) return '';
        const s = String(v);
        if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
        return s;
    };
    const head = headers.join(',');
    const body = rows.map(r => headers.map(h => esc(r[h])).join(',')).join('\n');
    return `${head}\n${body}`;
}

// 1) templates_master CSV from ProgramContextV2
export function emitTemplatesMasterCsv(state: ProgramV2): string {
    const tmPctChoice = Number(state?.tmPctChoice ?? Math.round((state?.tmPct ?? 0.85) * 100));
    const scheme = String(state?.supplemental?.schemeId || state?.supplemental?.strategy || '').toLowerCase() || 'fsl';
    const seventhMode = String(state?.seventhWeek?.mode || 'deload');
    const seventhCriteria = String(state?.seventhWeek?.criteria || 'afterLeader');
    const units = String(state?.units || 'lbs').toLowerCase();
    const inc = state?.progression?.increments || (units === 'kg' ? { upper: 2.5, lower: 5 } : { upper: 5, lower: 10 });

    const headers = [
        'tm_pct_default',
        'supplemental_scheme',
        'seventh_week_mode',
        'seventh_week_criteria',
        'tm_prog_upper_lb',
        'tm_prog_lower_lb',
        'tm_prog_upper_kg',
        'tm_prog_lower_kg',
    ];

    const row: Record<string, any> = {
        tm_pct_default: tmPctChoice,
        supplemental_scheme: scheme,
        seventh_week_mode: seventhMode,
        seventh_week_criteria: seventhCriteria,
        tm_prog_upper_lb: units === 'kg' ? '' : inc?.upper ?? 5,
        tm_prog_lower_lb: units === 'kg' ? '' : inc?.lower ?? 10,
        tm_prog_upper_kg: units === 'kg' ? inc?.upper ?? 2.5 : '',
        tm_prog_lower_kg: units === 'kg' ? inc?.lower ?? 5 : '',
    };
    return toCsv(headers, [row]);
}

// 2) templates_merged CSV (weekly rows)
export function emitTemplatesMergedCsv(state: ProgramV2): string {
    const headers = [
        'type',
        'week_label',
        'set_no',
        'pct',
        'reps',
        'amrap',
        'percent_of',
        'scheme',
        'sets',
        'assistance_push',
        'assistance_pull',
        'assistance_core',
    ];

    const rows: Record<string, any>[] = [];

    // Main sets by week table
    WEEK_LABELS.forEach(label => {
        const percents = MAIN_PCTS[label];
        const repsArr = MAIN_REPS[label];
        percents.forEach((pct, i) => {
            const isAnchor = label === '5/3/1';
            const amrap = isAnchor && i === 2; // Anchor only, 3rd set
            rows.push({
                type: 'main',
                week_label: label,
                set_no: i + 1,
                pct,
                reps: repsArr[i],
                amrap,
                percent_of: 'tm',
                scheme: '',
                sets: '',
                assistance_push: '',
                assistance_pull: '',
                assistance_core: '',
            });
        });
    });

    // Supplemental rows per scheme (FSL, SSL, BBB, BBS) across the 3 main weeks
    const scheme = String(state?.supplemental?.schemeId || state?.supplemental?.strategy || 'fsl').toLowerCase();
    const suppSchemes = ['fsl', 'ssl', 'bbb', 'bbs'] as const;
    const includeScheme = suppSchemes.includes(scheme as any) ? scheme : 'fsl';
    WEEK_LABELS.forEach((label) => {
        const wIdx = mapWeekLabelToIndex(label);
        if (includeScheme === 'fsl') {
            const pct = getFirstSetPct(wIdx);
            if (pct) rows.push({ type: 'supplemental', week_label: label, set_no: '', pct, reps: 5, amrap: false, percent_of: 'tm', scheme: 'fsl', sets: 5, assistance_push: '', assistance_pull: '', assistance_core: '' });
        } else if (includeScheme === 'ssl') {
            const pct = getSecondSetPct(wIdx);
            if (pct) rows.push({ type: 'supplemental', week_label: label, set_no: '', pct, reps: 5, amrap: false, percent_of: 'tm', scheme: 'ssl', sets: 5, assistance_push: '', assistance_pull: '', assistance_core: '' });
        } else if (includeScheme === 'bbs') {
            const pct = getFirstSetPct(wIdx);
            if (pct) rows.push({ type: 'supplemental', week_label: label, set_no: '', pct, reps: 5, amrap: false, percent_of: 'tm', scheme: 'bbs', sets: 10, assistance_push: '', assistance_pull: '', assistance_core: '' });
        } else if (includeScheme === 'bbb') {
            const pct = 50; // default BBB standard
            rows.push({ type: 'supplemental', week_label: label, set_no: '', pct, reps: 10, amrap: false, percent_of: 'tm', scheme: 'bbb', sets: 5, assistance_push: '', assistance_pull: '', assistance_core: '' });
        }
    });

    // Assistance rows via targets helper (use normal vs 7th‑week targets)
    const seventhMode = (state?.seventhWeek?.mode || 'deload') as 'deload' | 'tm_test' | undefined;
    const normalTargets: AssistanceTargets = getAssistanceTargets({ seventhWeekMode: undefined }).targets;
    const wk7Targets: AssistanceTargets = getAssistanceTargets({ seventhWeekMode: seventhMode }).targets;
    WEEK_LABELS.forEach((label) => {
        // Normal assistance targets for main weeks
        rows.push({ type: 'assistance', week_label: label, set_no: '', pct: '', reps: '', amrap: '', percent_of: '', scheme: '', sets: '', assistance_push: normalTargets.push, assistance_pull: normalTargets.pull, assistance_core: normalTargets.core });
    });
    // 7th-Week row with reduced targets
    rows.push({ type: 'assistance', week_label: '7th-Week', set_no: '', pct: '', reps: '', amrap: '', percent_of: '', scheme: '', sets: '', assistance_push: wk7Targets.push, assistance_pull: wk7Targets.pull, assistance_core: wk7Targets.core });

    // 7th-Week rows via engine
    const tmPct = typeof state?.tmPct === 'number' ? state.tmPct : ((Number(state?.tmPctChoice) || 85) / 100);
    const plan = buildSeventhWeek((seventhMode as any) || 'deload', tmPct);
    plan.rows.forEach((r, i) => {
        rows.push({ type: 'main', week_label: '7th-Week', set_no: i + 1, pct: r.pct, reps: r.reps, amrap: r.amrap, percent_of: r.percent_of, scheme: '', sets: '', assistance_push: '', assistance_pull: '', assistance_core: '' });
    });

    return toCsv(headers, rows);
}

export default { emitTemplatesMasterCsv, emitTemplatesMergedCsv };
