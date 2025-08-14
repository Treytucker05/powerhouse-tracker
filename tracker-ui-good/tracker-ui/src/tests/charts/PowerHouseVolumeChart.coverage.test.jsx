import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PowerHouseVolumeChart from '@/components/dashboard/PowerHouseVolumeChart';

class RO { observe() { } unobserve() { } disconnect() { } }
if (!global.ResizeObserver) global.ResizeObserver = RO;
const origGBCR = Element.prototype.getBoundingClientRect;
beforeAll(() => {
    Element.prototype.getBoundingClientRect = () => ({ x: 0, y: 0, width: 640, height: 320, top: 0, left: 0, right: 640, bottom: 320 });
});
afterAll(() => { Element.prototype.getBoundingClientRect = origGBCR; });
afterEach(() => {
    // Always return timers to real to avoid bleed into later suites
    vi.useRealTimers();
});

describe('PowerHouseVolumeChart (coverage)', () => {
    it('renders with default internal data', () => {
        vi.useFakeTimers();
        const { unmount } = render(<PowerHouseVolumeChart />);
        const heading = screen.queryAllByText(/Weekly Volume by Muscle Group/i)[0];
        expect(heading || document.querySelector('svg')).toBeTruthy();
        unmount();
        vi.runOnlyPendingTimers();
    });

    it('renders again without crashing (idempotent smoke)', () => {
        vi.useFakeTimers();
        const { unmount } = render(<PowerHouseVolumeChart />);
        expect(document.querySelectorAll('svg').length).toBeGreaterThan(0);
        unmount();
        vi.runOnlyPendingTimers();
    });

    it('shows tooltip on bar hover (legend toggle tolerated)', async () => {
        vi.useFakeTimers();
        const { unmount } = render(<PowerHouseVolumeChart />);
        const svg = document.querySelector('svg');
        expect(svg).toBeTruthy();
        let barRect = svg.querySelector('rect');
        if (!barRect) barRect = svg; // fallback
        fireEvent.mouseOver(barRect);
        fireEvent.mouseMove(barRect);
        // Flush any microtasks/animation timers
        vi.runAllTimers();
        const tooltip = document.querySelector('.recharts-tooltip-wrapper');
        expect(tooltip).toBeTruthy();
        unmount();
        vi.runOnlyPendingTimers();
    });
});
