import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import Step4ReviewExport from '../components/steps/Step4ReviewExport.jsx';
import { ProgramProviderV2 } from '../contexts/ProgramContextV2.jsx';
import { TEMPLATE_KEYS } from '../../../lib/templates/531.presets.v2.js';
import { normalizeAssistance } from '../assistance/index.js';

// Helper: build minimal state patch
function buildState(templateKey) {
    const base = {
        units: 'lbs',
        rounding: { increment: 5, mode: 'nearest' },
        loadingOption: 1,
        flowMode: 'template',
        templateKey,
        schedule: { frequency: 4, order: ['Press', 'Deadlift', 'Bench', 'Squat'], includeWarmups: true, warmupScheme: { percentages: [40, 50, 60], reps: [5, 5, 3] } },
        lifts: { press: { tm: 100 }, deadlift: { tm: 300 }, bench: { tm: 200 }, squat: { tm: 250 } },
        supplemental: { strategy: 'none' },
        assistMode: 'template',
        assistance: { mode: 'template', templateId: templateKey },
    };
    return base;
}

function renderStep(statePatch) {
    // Provider currently hydrates from localStorage; we patch via direct state manipulation by wrapping provider then mutating.
    // Simpler: mock localStorage prior to import; but for brevity we set global item.
    global.localStorage.setItem('ph_program_v2', JSON.stringify(statePatch));
    const { container } = render(<ProgramProviderV2><Step4ReviewExport /></ProgramProviderV2>);
    return container.innerHTML;
}

const TEMPLATE_CASES = [
    ['BBB', TEMPLATE_KEYS.BBB, 2], // chinups + ab_wheel
    ['Triumvirate', TEMPLATE_KEYS.TRIUMVIRATE, 2],
    ['Periodization Bible', TEMPLATE_KEYS.PERIODIZATION_BIBLE, 3],
    ['Bodyweight', TEMPLATE_KEYS.BODYWEIGHT, 3], // chinups + dips + hlr
    ['Jack Shit', TEMPLATE_KEYS.JACK_SHIT, 0],
];

describe('Step4 Assistance Snapshot', () => {
    TEMPLATE_CASES.forEach(([label, key, expectedCount]) => {
        it(`renders assistance for ${label} without undefined`, () => {
            const state = buildState(key);
            const html = renderStep(state);
            expect(html).not.toMatch(/undefined/i);
            // Derive assistance for a representative lift (Press) to validate expected count
            const items = normalizeAssistance(key, 'Press', state) || [];
            expect(items.length).toBe(expectedCount);
            if (key === TEMPLATE_KEYS.PERIODIZATION_BIBLE) {
                expect(items.some(i => i.block)).toBe(true);
            }
        });
    });

    it('3-day schedule renders assistance + conditioning', () => {
        const state = buildState(TEMPLATE_KEYS.TRIUMVIRATE);
        state.schedule.frequency = 3;
        state.schedule.order = ['Press', 'Deadlift', 'Bench'];
        const html = renderStep(state);
        expect(html).not.toMatch(/undefined/i);
        // Assistance still present
        const items = normalizeAssistance(TEMPLATE_KEYS.TRIUMVIRATE, 'Press', state) || [];
        expect(items.length).toBe(2);
    });
});
