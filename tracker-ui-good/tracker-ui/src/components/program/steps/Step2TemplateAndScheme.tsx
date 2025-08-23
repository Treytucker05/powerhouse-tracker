import { useEffect, useState } from 'react';
import { loadCsv } from '@/lib/loadCsv';
import { mergeTemplateCsv } from '@/utils/mergeTemplates';
import type { TemplateCsv } from '@/types/methodology';

export default function Step2TemplateAndScheme() {
    const [rows, setRows] = useState<TemplateCsv[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const base = import.meta.env.BASE_URL || '/';
        const masterUrl = `${base}methodology/extraction/templates_master.csv`;
        const addUrl = `${base}methodology/extraction/templates_additions.csv`;
        (async () => {
            try {
                const [master, adds] = await Promise.all([
                    loadCsv<TemplateCsv>(masterUrl).catch(() => [] as TemplateCsv[]),
                    loadCsv<TemplateCsv>(addUrl).catch(() => [] as TemplateCsv[]),
                ]);
                setRows(mergeTemplateCsv(master, adds));
            } catch (e: any) {
                setError(String(e?.message || e));
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <div className="text-slate-400">Loading templates…</div>;
    if (error) return <div className="text-red-400">Error: {error}</div>;

    return (
        <div className="space-y-4">
            {rows.map((row) => {
                const name = row.display_name || (row as any)['Template Name'] || 'Untitled';
                const category = row.category || '';
                const goal = row.goal || '';
                const src = row.source || (row as any).source_book || '';
                const pages = row.pages || (row as any).source_pages || '';
                return (
                    <div key={row.id} className="bg-[#0f172a] border border-slate-700 rounded p-3">
                        <h3 className="text-white font-semibold">{name}</h3>
                        <p className="text-slate-400 text-sm">{category}{goal ? ` • ${goal}` : ''}</p>
                        {src && (
                            <p className="text-slate-500 text-xs mt-1">Source: {src}{pages ? ` — ${pages}` : ''}</p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
