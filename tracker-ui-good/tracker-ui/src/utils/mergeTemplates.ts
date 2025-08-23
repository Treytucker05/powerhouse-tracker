import type { TemplateCsv } from '@/types/methodology';

// Merge master + additions where additions override by id; provide light normalization
export function mergeTemplateCsv(master: TemplateCsv[], adds: TemplateCsv[]): TemplateCsv[] {
    const toId = (row: any) => {
        const id = String(row.id || '').trim();
        if (id) return id;
        const name = String(row['Template Name'] || row.display_name || '').trim().toLowerCase();
        return name.replace(/^(jack sh\*t|jack shit)$/, 'jackshit').replace(/[^a-z0-9]+/g, '-');
    };
    const map = new Map<string, TemplateCsv>();
    (master || []).forEach((r) => {
        const id = toId(r);
        if (!id) return;
        map.set(id, { ...r, id });
    });
    (adds || []).forEach((r) => {
        const id = toId(r);
        if (!id) return;
        const prev = map.get(id) || {} as TemplateCsv;
        // Map synonyms into canonical fields while preserving originals
        const merged: TemplateCsv = {
            ...prev,
            ...r,
            id,
            scheme: r.scheme || (r as any).core_scheme || (prev as any).core_scheme || prev.scheme,
            source: r.source || (r as any).source_book || (prev as any).source_book || prev.source,
            pages: r.pages || (r as any).source_pages || (prev as any).source_pages || prev.pages,
        };
        map.set(id, merged);
    });
    return [...map.values()].sort((a, b) => {
        const ca = String(a.category || '').toLowerCase();
        const cb = String(b.category || '').toLowerCase();
        if (ca !== cb) return ca < cb ? -1 : 1;
        const ta = String(a.display_name || (a as any)['Template Name'] || '').toLowerCase();
        const tb = String(b.display_name || (b as any)['Template Name'] || '').toLowerCase();
        return ta < tb ? -1 : ta > tb ? 1 : 0;
    });
}
