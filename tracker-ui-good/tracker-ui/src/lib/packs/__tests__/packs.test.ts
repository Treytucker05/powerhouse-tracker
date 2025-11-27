import { describe, it, expect } from 'vitest';
import { getSchemes, getTemplates, getCatalogs, getLogic, getModifiers, getTesting } from '../index';

describe('packs wiring', () => {
    it('loads core packs', () => {
        expect(getSchemes()).toBeTruthy();
        expect(getTemplates()).toBeTruthy();
        expect(getCatalogs()).toBeTruthy();
        expect(getLogic()).toBeTruthy();
        expect(getTesting()).toBeTruthy();
    });
    it('loads modifiers', () => {
        const mods = getModifiers();
        expect(mods).toBeTruthy();
        expect(mods).toHaveProperty('populations');
        expect(mods).toHaveProperty('injury');
        expect(mods).toHaveProperty('teen');
        expect(mods).toHaveProperty('sportIntegration');
    });
});
