import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { LibraryButtons } from './LibraryButtons';
import { useFinalPlan } from '@/store/finalPlanStore';

const STEPS = [
    { n: 1, path: '/build/step1', label: 'Fundamentals' },
    { n: 2, path: '/build/step2', label: 'Template' },
    { n: 3, path: '/build/step3', label: 'Customize' },
    { n: 4, path: '/build/step4', label: 'Preview' },
    { n: 5, path: '/build/step5', label: 'Progression' },
    { n: 6, path: '/build/step6', label: 'Calendar' }
];

interface Props { current?: number }

export default function BuilderProgress({ current }: Props) {
    const location = useLocation();
    const { locked } = useFinalPlan();
    const activeStep = current || (STEPS.find(s => location.pathname.startsWith(s.path))?.n ?? 1);
    return (
        <nav aria-label="Program Builder Progress" className="mb-4 select-none">
            <ol className="flex flex-wrap gap-2">
                {STEPS.map(step => {
                    const status: 'current' | 'complete' | 'upcoming' = step.n === activeStep ? 'current' : step.n < activeStep ? 'complete' : 'upcoming';
                    const base = 'flex items-center gap-2 px-3 py-1.5 rounded-md border text-[11px] font-medium tracking-wide';
                    const disabled = locked && step.n >= 1 && step.n <= 5; // lock steps 1–5
                    const cls = disabled
                        ? 'border-gray-700 bg-gray-800/40 text-gray-500 cursor-not-allowed'
                        : status === 'current'
                            ? 'border-red-500 bg-red-600/10 text-red-200'
                            : status === 'complete'
                                ? 'border-emerald-500 bg-emerald-600/10 text-emerald-200 hover:bg-emerald-600/20'
                                : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:text-gray-200 hover:border-gray-500';
                    const content = (
                        <>
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-gray-700/60 border border-gray-600 ${status === 'current' ? 'text-red-200' : ''}`}>{step.n}</span>
                            <span>{step.label}</span>
                        </>
                    );
                    return (
                        <li key={step.n}>
                            {status === 'current' || disabled ? (
                                <span className={base + ' ' + cls} aria-current={status === 'current' ? 'step' : undefined} title={disabled ? 'Final plan locked. Reset on Calendar to edit.' : undefined}>{content}</span>
                            ) : (
                                <Link to={step.path} className={base + ' ' + cls}>{content}</Link>
                            )}
                        </li>
                    );
                })}
            </ol>
            {/* Always-visible Library buttons row beneath the step navigation */}
            <div className="mt-3">
                <LibraryButtons />
            </div>
        </nav>
    );
}
