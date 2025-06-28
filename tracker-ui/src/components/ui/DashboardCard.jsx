import React from 'react';

/** Reusable shell that enforces premium spacing, border & elevation */
export default function DashboardCard({ children, className = '' }) {
  return (
    <div
      className={[
        'bg-surface border border-accent/20',
        'shadow-elevation1 hover:shadow-elevation3 hover:border-accent',
        'rounded-card min-h-[12rem] md:min-h-[14rem] p-card transition-transform hover:-translate-y-1',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
