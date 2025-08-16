import { getVolumeStatus } from './volumeStatus';

// Returns a new array with per-item status/color attached (no side effects)
// Supports both `total` and legacy `volume` keys for compatibility.
export function buildChartData(data = []) {
    return data.map(d => {
        const volumeValue = Object.prototype.hasOwnProperty.call(d, 'total') ? d.total : d.volume;
        const { status, color } = getVolumeStatus({
            volume: volumeValue,
            mev: d.mev,
            mrv: d.mrv,
        });
        return { ...d, __status: status, __color: color };
    });
}
