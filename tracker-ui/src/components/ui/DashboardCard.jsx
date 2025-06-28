import React from 'react';

/** Reusable shell that enforces premium spacing, border & elevation */
export default function DashboardCard({ children, className = '' }) {
  return (
    <div
      className={[
        'bg-surface border border-white/10 hover:border-brand shadow-insetCard',
        'rounded-xl transition-transform hover:-translate-y-1 active:scale-95',
        'min-h-[12rem] md:min-h-[14rem] p-card',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
