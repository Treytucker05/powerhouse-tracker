import React, { useEffect, useMemo, useState } from 'react';
import { loadTemplates } from '../../../lib/templates/loadTemplates';
import { validateTemplate } from "../../../lib/templates/validateTemplate";

export default function Step2TemplateGallery({ onSelect, autoNext }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [templates, setTemplates] = useState([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const rows = await loadTemplates();
                if (!mounted) return;
                setTemplates(rows);
            } catch (e) {
                console.error('[Step2TemplateGallery] load error', e);
                if (mounted) setError(e?.message || 'Failed to load templates');
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    const list = useMemo(() => {
        const q = filter.trim().toLowerCase();
        if (!q) return templates;
        return templates.filter(t =>
            (t.id || '').toLowerCase().includes(q) ||
            (t.display_name || '').toLowerCase().includes(q) ||
            (Array.isArray(t.tags) && t.tags.some(tag => (tag || '').toLowerCase().includes(q))) ||
            ((t.category || '').toLowerCase().includes(q))
        );
    }, [templates, filter]);

    if (loading) return <div className="p-4 text-sm text-gray-400">Loading templates…</div>;
    if (error) return <div className="p-4 text-sm text-red-400">{error}</div>;

    const [selectedId, setSelectedId] = useState(null);
    const [tmPct, setTmPct] = useState(0.9);
    const [increments, setIncrements] = useState({ upper: 5, lower: 10 });
    const [scheduleDays, setScheduleDays] = useState(4);
    const wizard = useMemo(() => ({ templateChoice: list.find(t => t.id === selectedId) }), [list, selectedId]);

    return (
        <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
                <input
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    placeholder="Search templates…"
                    className="w-full px-3 py-2 rounded border border-gray-700 bg-gray-900 text-sm"
                />
                <span className="text-xs text-gray-500">{list.length} results</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {list.map(t => {
                    const issues = validateTemplate(t);
                    const ok = issues.length === 0;
                    return (
                        <button
                            key={t.id}
                            onClick={() => { setSelectedId(t.id); onSelect?.(t.id); autoNext?.(); }}
                            className={`text-left p-3 rounded border hover:border-blue-500 hover:bg-blue-500/5 transition ${ok ? 'border-gray-700' : 'border-amber-600'}`}
                            title={!ok ? issues.map(i => `${i.field}: ${i.message}`).join('\n') : ''}
                        >
                            <div className="flex items-center justify-between">
                                <div className="font-semibold">{t.display_name}</div>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 border border-gray-700">{t.id}</span>
                            </div>
                            <div className="mt-1 text-xs text-gray-400">
                                {(t.category || 'uncategorized')}{t.days_per_week ? ` · ${t.days_per_week} d/wk` : ''}{t.scheme ? ` · ${t.scheme}` : ''}
                            </div>
                            {Array.isArray(t.tags) && t.tags.length ? (
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {t.tags.slice(0, 6).map(tag => (
                                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700">
                                            {tag}
                                        </span>
                                    ))}
                                    {t.tags.length > 6 ? <span className="text-[10px] text-gray-500">+{t.tags.length - 6}</span> : null}
                                </div>
                            ) : null}
                        </button>
                    );
                })}
            </div>

            {import.meta?.env?.DEV ? (
                <div className="mt-4 p-3 rounded border border-gray-700 bg-gray-900 text-xs text-gray-300">
                    <div className="font-semibold mb-1">DEV · Step2 Selection</div>
                    <div>selected: {selectedId || '—'}</div>
                    <div>tmPct: {tmPct}</div>
                    <div>increments: upper={increments.upper} · lower={increments.lower}</div>
                    <div>scheduleDays: {scheduleDays}</div>
                </div>
            ) : null}

            {import.meta?.env?.DEV && wizard?.templateChoice ? (
                <div style={{ marginTop: 8, padding: 8, border: "1px solid #ccc", borderRadius: 8 }}>
                    <div style={{ fontWeight: 600, fontSize: 12 }}>Template issues</div>
                    <pre style={{ fontSize: 11, whiteSpace: "pre-wrap" }}>
                        {JSON.stringify(validateTemplate(wizard.templateChoice), null, 2)}
                    </pre>
                </div>
            ) : null}
        </div>
    );
}
