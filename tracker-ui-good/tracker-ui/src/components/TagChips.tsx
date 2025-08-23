import React from 'react';
import type { Chip } from '@/lib/deriveTemplate';

export function TagChips({ chips }: { chips: Chip[] }) {
    if (!chips || chips.length === 0) return null;
    return (
        <div className="flex flex-wrap gap-2">
            {chips.map((c, i) => (
                <span
                    key={i}
                    className="px-2 py-0.5 rounded-full text-xs border border-white/10 bg-white/5"
                    style={c.color ? { borderColor: c.color, color: c.color } : {}}
                    title={c.key}
                >
                    {c.text}
                </span>
            ))}
        </div>
    );
}
