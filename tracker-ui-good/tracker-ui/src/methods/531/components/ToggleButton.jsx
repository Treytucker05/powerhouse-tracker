import React from 'react';

// Accessible toggle-style button with unified pressed styling
export function ToggleButton({ on, className = '', children, ...props }) {
    return (
        <button
            type={props.type || 'button'}
            aria-pressed={!!on}
            className={[
                'px-3 py-1.5 rounded-xl border text-sm font-medium transition select-none outline-none',
                on
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-inner ring-2 ring-indigo-400'
                    : 'bg-zinc-100/70 dark:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-700',
                'focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-0',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                className
            ].join(' ')}
            {...props}
        >
            {children}
        </button>
    );
}

export default ToggleButton;
