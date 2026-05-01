import React, { useMemo } from 'react';
import { useEquipment } from '@/store/equipmentStore';
import { loadCsv } from '@/lib/loadCsv';
import type { AssistanceRow } from '@/types/step3';

export default function EquipmentProfile() {
    const { selected, toggle, setAll, clear } = useEquipment();
    const [rows, setRows] = React.useState<AssistanceRow[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        let cancelled = false;
        setLoading(true);
        const path = `${import.meta.env.BASE_URL}methodology/extraction/assistance_exercises.csv`;
        loadCsv<AssistanceRow>(path).then((data) => {
            if (cancelled) return;
            setRows(Array.isArray(data) ? data.filter(Boolean) as AssistanceRow[] : []);
        }).catch(e => {
            if (cancelled) return;
            setError(e?.message || 'Failed to load equipment universe');
        }).finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    const equipmentAll = useMemo(() => {
        const set = new Set<string>();
        rows.forEach(r => (r.Equipment || '').split(/,\s*/).filter(Boolean).forEach(x => set.add(x)));
        return Array.from(set).sort();
    }, [rows]);

    const allSelected = selected.length > 0 && equipmentAll.length > 0 && equipmentAll.every(x => selected.includes(x));

    return (
        <div className="p-4">
            <h1 className="text-xl font-semibold text-white mb-3">Equipment Profile</h1>
            <p className="text-sm text-gray-300 mb-4">Select the equipment you have access to. Assistance and Conditioning libraries will filter automatically.</p>
            <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setAll(equipmentAll)} className="px-3 py-1 rounded bg-gray-800 border border-gray-700 text-gray-100 text-sm">Select All</button>
                <button onClick={() => clear()} className="px-3 py-1 rounded bg-gray-800 border border-gray-700 text-gray-100 text-sm">Clear</button>
                {allSelected && <span className="text-xs text-gray-400">All selected</span>}
            </div>
            {loading && <div className="text-gray-400">Loading…</div>}
            {error && <div className="text-red-400">{error}</div>}
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {equipmentAll.map(eq => {
                        const active = selected.includes(eq);
                        return (
                            <label key={eq} className={`flex items-center gap-2 p-2 rounded border ${active ? 'border-red-600 bg-red-600/10' : 'border-gray-800 bg-[#0b1220] hover:border-gray-700'}`}>
                                <input type="checkbox" checked={active} onChange={() => toggle(eq)} />
                                <span className="text-gray-100 text-sm">{eq}</span>
                            </label>
                        );
                    })}
                    {equipmentAll.length === 0 && <div className="text-gray-500">No equipment found in data.</div>}
                </div>
            )}
        </div>
    );
}
