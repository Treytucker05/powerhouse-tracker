import React, { useState } from 'react';
import StickySummary from './StickySummary';
import { Step3Provider } from '@/store/step3Store';
import AssistanceTab from './tabs/AssistanceTab';

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
  {active === 'supplemental' && <Placeholder title="Supplemental" />}
  {active === 'assistance' && <AssistanceTab />}
      {active === 'warmup' && <Placeholder title="Warm-up & Jumps/Throws" />}
      {active === 'conditioning' && <Placeholder title="Conditioning" />}
    </div>
  );
}

export default function Step3Customize() {
  const [active, setActive] = useState<TabKey>('supplemental');
  return (
    <Step3Provider>
      <div className="min-h-[60vh]">
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
    </Step3Provider>
  );
}
