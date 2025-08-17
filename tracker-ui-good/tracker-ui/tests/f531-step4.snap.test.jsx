import { describe, test, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Step4ReviewExport from '../src/methods/531/components/steps/Step4ReviewExport.jsx';
import { ProgramProviderV2 } from '../src/methods/531/contexts/ProgramContextV2.jsx';
import { TEMPLATE_KEYS } from '../src/lib/templates/531.presets.v2.js';
import { normalizeAssistance } from '../src/methods/531/assistance/index.js';

// Build baseline state in localStorage (provider hydrates from there)
function seedState(patch) {
    const base = {
        units: 'lbs',
        rounding: { increment: 5, mode: 'nearest' },
        loadingOption: 1,
        flowMode: 'template',
        templateKey: patch.templateKey,
        schedule: { frequency: 4, order: ['Press', 'Deadlift', 'Bench', 'Squat'], includeWarmups: true, warmupScheme: { percentages: [40, 50, 60], reps: [5, 5, 3] } },
        lifts: { press: { tm: 135 }, deadlift: { tm: 315 }, bench: { tm: 225 }, squat: { tm: 275 } },
        supplemental: { strategy: 'none' },
        assistMode: 'template',
        assistance: { mode: 'template', templateId: patch.templateKey }
    };
    const state = { ...base, ...patch };
    localStorage.setItem('ph_program_v2', JSON.stringify(state));
    return state;
}

function renderStep(patch) {
    seedState(patch);
    return render(<ProgramProviderV2><Step4ReviewExport /></ProgramProviderV2>);
}

const CASES = [
    ['BBB', TEMPLATE_KEYS.BBB, 2],
    ['Triumvirate', TEMPLATE_KEYS.TRIUMVIRATE, 2],
    ['Periodization Bible', TEMPLATE_KEYS.PERIODIZATION_BIBLE, 3],
    ['Bodyweight', TEMPLATE_KEYS.BODYWEIGHT, 3],
    ['Jack Shit', TEMPLATE_KEYS.JACK_SHIT, 0],
];

describe('5/3/1 Step4 template assistance smoke', () => {
    CASES.forEach(([label, key, expected]) => {
        test(label + ' assistance count & no undefined', () => {
            const html = renderStep({ templateKey: key }).container.innerHTML;
            expect(html).not.toMatch(/undefined/);
            const items = normalizeAssistance(key, 'Press', JSON.parse(localStorage.getItem('ph_program_v2')));
            expect(items.length).toBe(expected);
            if (key === TEMPLATE_KEYS.PERIODIZATION_BIBLE) {
                expect(items.some(i => i.block)).toBe(true);
            }
        });
    });

    test('3-day schedule shows assistance + conditioning keyword', () => {
        renderStep({ templateKey: TEMPLATE_KEYS.TRIUMVIRATE, schedule: { frequency: 3, order: ['Press', 'Deadlift', 'Bench'], includeWarmups: true, warmupScheme: { percentages: [40, 50, 60], reps: [5, 5, 3] } } });
        // Look for Conditioning header
        const cond = screen.queryAllByText(/Conditioning/i);
        expect(cond.length).toBeGreaterThan(0);
    });
});
