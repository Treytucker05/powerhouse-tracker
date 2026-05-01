// Tiny CSV parse for simple catalogs (no quotes-inside-commas use here)
export type TagMeta = { key: string; group: string; label: string; description?: string; color?: string };
export type TagMap = Record<string, TagMeta>;

function parseCsv(text: string): string[][] {
    return text
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(Boolean)
        .map(line => {
            const out: string[] = [];
            let cur = '';
            let q = false;
            for (let i = 0; i < line.length; i++) {
                const ch = line[i];
                if (ch === '"') { q = !q; continue; }
                if (ch === ',' && !q) { out.push(cur); cur = ''; continue; }
                cur += ch;
            }
            out.push(cur);
            return out.map(s => s.trim().replace(/^"|"$/g, ''));
        });
}

export async function loadTagCatalog(): Promise<TagMap> {
    const base = (import.meta as any).env?.BASE_URL || '/';
    const res = await fetch(`${base}methodology/extraction/tag_catalog.csv`, { cache: 'no-store' });
    const text = await res.text();
    const rows = parseCsv(text);
    const header = rows[0] || [];
    const idx = (name: string) => header.findIndex(h => (h || '').toLowerCase() === name.toLowerCase());
    const keyI = idx('key'), groupI = idx('group'), labelI = idx('label'), descI = idx('description'), colorI = idx('color');
    const map: TagMap = {};
    for (const r of rows.slice(1)) {
        const key = (r[keyI] || '').trim();
        if (!key) continue;
        map[key] = {
            key,
            group: (r[groupI] || '').trim(),
            label: (r[labelI] || '').trim() || key,
            description: (r[descI] || '').trim(),
            color: ((r[colorI] || '').trim()) || undefined,
        };
    }
    return map;
}
