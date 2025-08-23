import { loadTagCatalog } from '@/lib/tags/catalog';
import { deriveTemplate, type DerivedTemplate, type RawTemplate } from '@/lib/deriveTemplate';
import { loadCsv } from '@/lib/loadCsv';

export async function loadDerivedTemplates(): Promise<DerivedTemplate[]> {
    const base = (import.meta as any).env?.BASE_URL || '/';
    const masterUrl = `${base}methodology/extraction/templates_additions.csv`;
    // We prefer additions list which already maps to RawTemplate; fall back to master for display_name mapping where possible
    const [additions, tagMap] = await Promise.all([
        loadCsv<RawTemplate>(masterUrl).catch(() => [] as RawTemplate[]),
        loadTagCatalog(),
    ]);
    return additions.map(r => deriveTemplate(r as RawTemplate, tagMap));
}
