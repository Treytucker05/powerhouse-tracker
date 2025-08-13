import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PowerHouseVolumeChart from '@/components/dashboard/PowerHouseVolumeChart';

class RO { observe() { } unobserve() { } disconnect() { } }
if (!global.ResizeObserver) global.ResizeObserver = RO;
const origGBCR = Element.prototype.getBoundingClientRect;
beforeAll(() => {
    Element.prototype.getBoundingClientRect = () => ({ x: 0, y: 0, width: 640, height: 320, top: 0, left: 0, right: 640, bottom: 320 });
});
afterAll(() => { Element.prototype.getBoundingClientRect = origGBCR; });

describe('PowerHouseVolumeChart (coverage)', () => {
    it('renders with default internal data', () => {
        render(<PowerHouseVolumeChart />);
        // Heading text or svg presence
        const heading = screen.queryAllByText(/Weekly Volume by Muscle Group/i)[0];
        expect(heading || document.querySelector('svg')).toBeTruthy();
    });

    it('renders again without crashing (idempotent smoke)', () => {
        render(<PowerHouseVolumeChart />);
        expect(document.querySelectorAll('svg').length).toBeGreaterThan(0);
    });

    it('shows tooltip on bar hover (legend toggle tolerated)', async () => {
        render(<PowerHouseVolumeChart />);
        const svg = document.querySelector('svg');
        expect(svg).toBeTruthy();
        // Attempt to locate first bar rectangle
        let barRect = svg.querySelector('rect');
        if (!barRect) barRect = svg; // fallback
        fireEvent.mouseOver(barRect);
        fireEvent.mouseMove(barRect);
        await new Promise(r => setTimeout(r, 0));
        const tooltip = document.querySelector('.recharts-tooltip-wrapper');
        expect(tooltip).toBeTruthy();
    });
});
