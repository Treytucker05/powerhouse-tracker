// Shared pill styles to keep selection visuals consistent across steps 1, 3, and 4.
// Active: red background, bold 2px border, ring, white text with ✓ prefix at callsite.
// Inactive: subtle red-tinted border, hover border + bg.

export function pillClass(active, disabled = false) {
    const base = 'px-3 py-1 rounded-md select-none outline-none transition';
    const state = active
        ? 'bg-red-600 text-white border-2 border-red-300 shadow-md ring-2 ring-red-400/70 ring-offset-1 ring-offset-gray-900'
        : 'bg-gray-900/40 text-red-200 border border-red-700/70 hover:border-red-500/70 hover:bg-red-900/20';
    const dis = disabled ? ' opacity-60 cursor-not-allowed' : '';
    return `${base} ${state}${dis}`;
}

export const pillActive = 'bg-red-600 text-white border-2 border-red-300 shadow-md ring-2 ring-red-400/70 ring-offset-1 ring-offset-gray-900';
export const pillInactive = 'bg-gray-900/40 text-red-200 border border-red-700/70 hover:border-red-500/70 hover:bg-red-900/20';
