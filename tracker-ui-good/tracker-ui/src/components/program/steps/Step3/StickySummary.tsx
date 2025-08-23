import React from 'react';
import { useStep3 } from '@/store/step3Store';

function Meter({ label, current, target }: { label: string; current: number; target: number }) {
  const pct = Math.max(0, Math.min(100, Math.round((current / Math.max(1, target)) * 100)));
  return (
    <div className="mb-2">
      <div className="flex justify-between text-sm text-gray-300">
        <span>{label}</span>
        <span>
          {current}/{target}
        </span>
      </div>
      <div className="h-2 bg-gray-800 rounded">
        <div className="h-2 bg-red-500 rounded" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold mb-2" style={{ color: '#ef4444' }}>{children}</h3>;
}

export default function StickySummary() {
  const { state } = useStep3();
  const supp = state.supplemental;
  const picks = state.assistance.picks;
  const targets = state.assistance.perCategoryTarget || {};

  // Heuristic: each pick ~10 reps proxy toward target display
  const currentReps = (arr?: string[]) => (Array.isArray(arr) ? arr.length * 10 : 0);

  const hard = state.conditioning.hardDays || 0;
  const easy = state.conditioning.easyDays || 0;
  const activities = state.conditioning.modalities || [];

  // Time estimate (very rough placeholder):
  const estMinutes = 30 /* main */ + (currentReps(picks.Pull) + currentReps(picks.Push) + currentReps(picks['Single-Leg/Core']) + currentReps(picks.Core)) / 10 * 5 + (hard + easy) * 10;
  const warnings: string[] = [];
  if (hard > 2) warnings.push('High HIIT frequency — watch recovery.');
  if ((picks.Pull?.length || 0) === 0) warnings.push('No Pull assistance selected.');

  return (
    <aside className="sticky top-4 bg-[#111827] border border-gray-700 rounded p-4">
      <div className="space-y-4">
        <div>
          <SectionHeading>Supplemental</SectionHeading>
          {supp ? (
            <ul className="text-sm text-gray-200 space-y-1">
              <li>
                <span className="text-gray-400">Template: </span>
                {supp.Template}
              </li>
              <li>
                <span className="text-gray-400">Sets×Reps: </span>
                {supp.SupplementalSetsReps}
              </li>
              <li>
                <span className="text-gray-400">%: </span>
                {supp.SupplementalPercentSchedule}
              </li>
              <li>
                <span className="text-gray-400">TM: </span>
                {supp.TMRecommendation}
              </li>
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No supplemental selected yet.</p>
          )}
        </div>

        <div>
          <SectionHeading>Assistance</SectionHeading>
          <div className="space-y-2">
            <Meter label="Pull" current={currentReps(picks.Pull)} target={targets.Pull || 50} />
            <Meter label="Push" current={currentReps(picks.Push)} target={targets.Push || 50} />
            <Meter label="Single-Leg/Core" current={currentReps(picks['Single-Leg/Core'])} target={targets['Single-Leg/Core'] || 50} />
            <Meter label="Core" current={currentReps(picks.Core)} target={targets.Core || 50} />
          </div>
        </div>

        <div>
          <SectionHeading>Warm-up</SectionHeading>
          <ul className="text-sm text-gray-200 space-y-1">
            <li>
              <span className="text-gray-400">Mobility: </span>
              {state.warmup.mobility || '—'}
            </li>
            <li>
              <span className="text-gray-400">Jumps/Throws dose: </span>
              {state.warmup.jumpsThrowsDose}
            </li>
          </ul>
        </div>

        <div>
          <SectionHeading>Conditioning</SectionHeading>
          <ul className="text-sm text-gray-200 space-y-1">
            <li>
              <span className="text-gray-400">Hard/Easy per week: </span>
              {hard}/{easy}
            </li>
            <li>
              <span className="text-gray-400">Activities: </span>
              {activities.length ? activities.join(', ') : '—'}
            </li>
          </ul>
        </div>

        <div className="pt-2 border-t border-gray-700">
          <SectionHeading>Time & Warnings</SectionHeading>
          <p className="text-sm text-gray-200">Estimated session: ~{Math.max(30, Math.min(120, Math.round(estMinutes)))} min</p>
          {warnings.length > 0 && (
            <ul className="mt-2 text-xs text-yellow-300 list-disc list-inside space-y-1">
              {warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
}
