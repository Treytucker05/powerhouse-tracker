import type { TagMap, TagMeta } from './catalog';

export function parseTagKeys(raw?: string): string[] {
    return (raw || '')
        .split('|')
        .map(s => s.trim())
        .filter(Boolean);
}

export function resolveTags(raw: string, catalog: TagMap): TagMeta[] {
    const keys = parseTagKeys(raw);
    return keys.map(k => catalog[k]).filter(Boolean) as TagMeta[];
}

export function deriveSessionTimeChip(timePerSessionMin?: string): string | null {
    if (!timePerSessionMin) return null;
    const clean = timePerSessionMin
        .replace(/minutes?|mins?/gi, '')
        .replace(/\s*m$/, '')
        .trim();
    return `${clean}m sessions`;
}

export function deriveDifficultyChip(experience?: string): string | null {
    if (!experience) return null;
    const x = experience.trim();
    return x ? `Diff: ${x}` : null;
}
