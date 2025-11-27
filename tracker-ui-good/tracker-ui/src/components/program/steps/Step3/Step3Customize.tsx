import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import StickySummary from './StickySummary';
import AssistanceTab from './tabs/AssistanceTab';
import WarmupJumpsThrowsTab from './tabs/WarmupJumpsThrowsTab';
import ConditioningTab from './tabs/ConditioningTab';
import SupplementalTab from './tabs/SupplementalTab';
import BuilderProgress from '../BuilderProgress';
import { loadCsv } from '@/lib/loadCsv';
import type { SupplementalRow } from '@/types/step3';
import { useStep3 } from '@/store/step3Store';
import { useBuilder } from '@/context/BuilderState';

type TabKey = 'supplemental' | 'assistance' | 'warmup' | 'conditioning';

const TABS: { key: TabKey; label: string }[] = [
    { key: 'supplemental', label: 'Supplemental' },
    { key: 'assistance', label: 'Assistance' },
    { key: 'warmup', label: 'Warm-up & Jumps/Throws' },
    { key: 'conditioning', label: 'Conditioning' },
];

function Tabs({ active, onChange }: { active: TabKey; onChange: (k: TabKey) => void }) {
    return (
        <div className="flex gap-2 border-b border-gray-700 mb-4">
            {TABS.map((t) => {
                const isActive = t.key === active;
                return (
                    <button
                        key={t.key}
                        onClick={() => onChange(t.key)}
                        className={`px-3 py-2 text-sm rounded-t ${isActive ? 'bg-[#111827] text-white border border-b-transparent border-gray-700' : 'text-gray-300 hover:text-white'}`}
                        style={isActive ? { borderColor: '#ef4444' } : undefined}
                    >
                        {t.label}
                    </button>
                );
            })}
        </div>
    );
}

function Placeholder({ title }: { title: string }) {
    return (
        <div className="p-4 bg-[#0b1220] border border-gray-800 rounded text-gray-200">
            <p className="text-sm"><span className="font-semibold" style={{ color: '#ef4444' }}>{title}</span> — loader goes here.</p>
        </div>
    );
}

function LeftPane({ active }: { active: TabKey }) {
    return (
        <div className="space-y-4">
            {active === 'supplemental' && <SupplementalTab />}
            {active === 'assistance' && <AssistanceTab />}
            {active === 'warmup' && <WarmupJumpsThrowsTab />}
            {active === 'conditioning' && <ConditioningTab />}
        </div>
    );
}

export default function Step3Customize() {
    const [active, setActive] = useState<TabKey>('supplemental');
    const loc = useLocation();
    const { state: builderState } = useBuilder();
    const { state: step3, actions } = useStep3();
    useEffect(() => {
        try {
            const params = new URLSearchParams(loc.search);
            const tab = String(params.get('tab') || '').toLowerCase();
            if (tab === 'assistance') setActive('assistance');
            else if (tab === 'warmup') setActive('warmup');
            else if (tab === 'conditioning') setActive('conditioning');
            else if (tab === 'supplemental') setActive('supplemental');
        } catch { }
    }, [loc.search]);

    // Bridge: auto-seed Step 3 supplemental from Step 2 selection when possible
    useEffect(() => {
        let cancelled = false;
        const templateId = (builderState as any)?.step2?.templateId as string | undefined;
        // Only run if we have a template and no supplemental seeded yet (or mismatched)
        const currentTemplateName = step3.supplemental?.Template;
        if (!templateId || currentTemplateName) return;

        const matchRow = (rows: SupplementalRow[]) => {
            const by = (pred: (r: SupplementalRow) => boolean) => rows.find(pred);
            switch (templateId) {
                case '5_s_pro_5x5_fsl':
                    // Leader, 5s PRO, FSL 5x5, Percent = FSL
                    return (
                        by(r => r.Phase === 'Leader' && r.MainPattern === '5s PRO' && r.SupplementalScheme === 'FSL' && /5\s*x\s*5/i.test(r.SupplementalSetsReps)) ||
                        by(r => r.Phase === 'Leader' && r.SupplementalScheme === 'FSL')
                    );
                case '5_s_pro_ssl':
                    // Leader, 5s PRO, SSL 5x5
                    return (
                        by(r => r.Phase === 'Leader' && r.MainPattern === '5s PRO' && r.SupplementalScheme === 'SSL' && /5\s*x\s*5/i.test(r.SupplementalSetsReps)) ||
                        by(r => r.Phase === 'Leader' && r.SupplementalScheme === 'SSL')
                    );
                default:
                    return undefined;
            }
        };

        (async () => {
            try {
                const path = `${import.meta.env.BASE_URL}methodology/extraction/supplemental.csv`;
                const rows = await loadCsv<SupplementalRow>(path).catch(() => []);
                if (cancelled) return;
                const row = matchRow((rows || []) as SupplementalRow[]);
                if (row) {
                    actions.setSupplemental(row);
                    // Defer applying defaults to StickySummary if the handoff flag is set
                }
            } catch {
                // non-blocking if CSV fails; user can pick manually
            }
        })();

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [(builderState as any)?.step2?.templateId]);
    return (
        <div className="min-h-[60vh]">
            {/* Step navigation + Library quick-links (restored) */}
            <div className="px-8 pt-6">
                <BuilderProgress current={3} />
            </div>
            <Tabs active={active} onChange={setActive} />
            <div className="lg:grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                <div>
                    <LeftPane active={active} />
                </div>
                <div>
                    <StickySummary />
                </div>
            </div>
        </div>
    );
}
