import { resolveTags, deriveSessionTimeChip, deriveDifficultyChip } from './tags/resolve';
import type { TagMap } from './tags/catalog';

export type RawTemplate = {
    id: string;
    display_name: string;
    tags?: string;
    ui_main?: string; ui_supplemental?: string; ui_assistance?: string; ui_conditioning?: string; ui_notes?: string;
    time_per_session_min?: string;
    experience?: string;
    leader_anchor_fit?: string;
    days_per_week?: string | number;
    notes?: string;
    [k: string]: any;
};

export type Chip = { text: string; color?: string; group?: string; key?: string };

export type DerivedTemplate = RawTemplate & {
    tagKeys: string[];
    tagChips: Chip[];
    infoChips: Chip[];
    ui: { main: string; supplemental: string; assistance: string; conditioning: string; notes: string; };
};

export function deriveTemplate(raw: RawTemplate, tagMap: TagMap): DerivedTemplate {
    const metas = resolveTags(raw.tags || '', tagMap);
    const tagChips: Chip[] = metas.map(m => ({ text: m.label, color: m.color, group: m.group, key: m.key }));
    const timeChip = deriveSessionTimeChip(raw.time_per_session_min);
    const diffChip = deriveDifficultyChip(raw.experience);
    const laChip = raw.leader_anchor_fit ? { text: raw.leader_anchor_fit, group: 'phase' } : null;

    const infoChips: Chip[] = [];
    if (timeChip) infoChips.push({ text: timeChip });
    if (diffChip) infoChips.push({ text: diffChip });
    if (laChip) infoChips.push(laChip);

    return {
        ...raw,
        tagKeys: metas.map(m => m.key),
        tagChips,
        infoChips,
        ui: {
            main: raw.ui_main || '',
            supplemental: raw.ui_supplemental || '',
            assistance: raw.ui_assistance || '',
            conditioning: raw.ui_conditioning || '',
            notes: raw.ui_notes || raw.notes || '',
        }
    };
}
