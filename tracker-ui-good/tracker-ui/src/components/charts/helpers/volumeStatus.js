// Helper to compute training volume status vs MEV/MRV bounds
// Inputs: { volume, mev, mrv }
export function getVolumeStatus({ volume, mev, mrv }) {
    if (volume == null || mev == null || mrv == null) return { status: 'unknown', color: '#999' };
    if (volume < mev) return { status: 'below_mev', color: '#f59e0b' }; // amber
    if (volume > mrv) return { status: 'above_mrv', color: '#ef4444' }; // red
    return { status: 'within', color: '#10b981' }; // green
}
