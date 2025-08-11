// src/components/program/steps/_shared/StepStatusPill.jsx
import React, { useMemo } from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { getStepStatuses, getStepRequirements } from '../_registry/stepRegistry';

export default function StepStatusPill({ stepId, data }) {
    const statuses = useMemo(() => getStepStatuses(data), [data]);
    const reqs = useMemo(() => getStepRequirements(stepId, data), [stepId, data]);
    const ok = statuses[stepId] === 'complete';

    if (ok) {
        return (
            <div className="inline-flex items-center gap-2 text-green-300 bg-green-900/20 border border-green-700 px-2.5 py-1 rounded">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Step Complete</span>
            </div>
        );
    }
    return (
        <div className="inline-flex items-center gap-2 text-yellow-200 bg-yellow-900/20 border border-yellow-700 px-2.5 py-1 rounded">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">
                Incomplete {reqs?.length ? `• ${reqs.length} fix${reqs.length > 1 ? 'es' : ''} needed` : ''}
            </span>
        </div>
    );
}
