import React, { createContext, useContext, useEffect, useState } from 'react';
type BuilderState = Record<string, any>;
const Ctx = createContext<{ state: BuilderState; setState: (u: Partial<BuilderState>) => void } | null>(null);
export function BuilderStateProvider({ children }: { children: React.ReactNode }) {
    // Local persistence key for the builder UI state
    const KEY = 'ph531.builder.ui.state';

    // Hydrate synchronously so children see state on first render
    const [state, set] = useState<BuilderState>(() => {
        try {
            const raw = typeof window !== 'undefined' ? window.localStorage.getItem(KEY) : null;
            if (raw) {
                const saved = JSON.parse(raw);
                if (saved && typeof saved === 'object') return saved;
            }
        } catch {/* ignore parse errors */ }
        try {
            const tm = typeof window !== 'undefined' ? JSON.parse(window.localStorage.getItem('trainingMaxes') || 'null') : null;
            const unitRaw = typeof window !== 'undefined' ? (window.localStorage.getItem('unit') || 'lb') : 'lb';
            const units = unitRaw === 'kg' ? 'kg' : 'lb';
            if (tm && typeof tm === 'object') {
                const inputs = {
                    squat: { manualTm: Number((tm as any).squat) || 0 },
                    bench: { manualTm: Number((tm as any).bench) || 0 },
                    deadlift: { manualTm: Number((tm as any).deadlift) || 0 },
                    press: { manualTm: Number((tm as any).press) || 0 }
                } as const;
                return {
                    step1: {
                        units,
                        tmPct: 0.9,
                        rounding: 5,
                        inputs,
                        variants: {
                            squat: 'back_squat', bench: 'bench_press', deadlift: 'conventional_deadlift', press: 'overhead_press'
                        },
                        deadliftRepStyle: 'touch_and_go',
                        tmTable: Object.fromEntries(Object.entries(inputs).map(([k, v]: any) => [k, Number(v?.manualTm) || 0]))
                    }
                } as BuilderState;
            }
        } catch {/* ignore */ }
        return {} as BuilderState;
    });
    const setState = (u: Partial<BuilderState>) => set(prev => ({ ...prev, ...u }));

    // Persist to localStorage whenever builder state changes (best-effort)
    useEffect(() => {
        try { if (typeof window !== 'undefined') window.localStorage.setItem(KEY, JSON.stringify(state)); } catch {/* ignore */ }
    }, [state]);

    // Mirror training maxes to the compatibility key used elsewhere in the app when available
    useEffect(() => {
        try {
            const tm: Record<string, number> | null = (state as any)?.step1?.tmTable
                ? (state as any).step1.tmTable
                : null;
            if (tm && typeof tm === 'object') {
                window.localStorage.setItem('trainingMaxes', JSON.stringify(tm));
            }
            const units = (state as any)?.step1?.units;
            if (units === 'lb' || units === 'kg') {
                window.localStorage.setItem('unit', units);
            }
        } catch {/* ignore */ }
    }, [state]);
    return <Ctx.Provider value={{ state, setState }}>{children}</Ctx.Provider>;
}
export function useBuilder() {
    const v = useContext(Ctx);
    if (!v) throw new Error('useBuilder must be used within BuilderStateProvider');
    return v;
}

// Optional accessor that returns null when the provider is missing.
// Useful for routes/components that can gracefully fall back to localStorage.
export function useBuilderOptional() {
    return useContext(Ctx);
}
