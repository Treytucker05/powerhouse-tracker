import { useMemo } from 'react';
import { useStep3 } from '@/store/step3Store';
import { estimateSessionMinutes } from '@/lib/531/rules';
import type { Step3Selection } from '@/types/step3';

export type CustomizeSummary = {
    summary: Step3Selection;
    minutes: number;
};

export function useCustomizeSummary(): CustomizeSummary {
    const { state } = useStep3();

    const supplementalSets = useMemo(() => {
        const raw = state.supplemental?.SupplementalSetsReps ?? '';
        const m = raw.match(/\d+/);
        return m ? parseInt(m[0] || '0', 10) || 0 : 0;
    }, [state.supplemental?.SupplementalSetsReps]);

    const minutes = estimateSessionMinutes({
        mainPattern: (state.supplemental?.MainPattern as any) ?? '531',
        supplementalSets,
        assistanceTargets: state.assistance.perCategoryTarget || {},
        jumpsThrows: state.warmup.jumpsThrowsDose || 10,
    });

    return { summary: state, minutes };
}
