import { describe, it, expect } from 'vitest';
import { generateRecommendation } from '@/context/appHelpers';

describe('generateRecommendation additional branches', () => {
    it('powerlifting competition long timeline chooses Block', () => {
        expect(generateRecommendation('Powerlifting Competition', 'Intermediate 1-3 years', '16-20 weeks')).toBe('Block');
    });
    it('advanced competition chooses Block due to long timeline rule precedence', () => {
        // The function checks competition+timeline before advanced competition branch
        expect(generateRecommendation('Powerlifting Competition', 'Advanced 3-5 years', '12-16 weeks')).toBe('Block');
    });
    it('elite competition with short timeline chooses Conjugate', () => {
        expect(generateRecommendation('Powerlifting Competition', 'Elite 5+ years', '4-8 weeks')).toBe('Conjugate');
    });
    it('advanced hybrid/multiple chooses Block', () => {
        expect(generateRecommendation('Hybrid/Multiple', 'Advanced 3-5 years', 'Any')).toBe('Block');
    });
    it('athletic performance advanced chooses Block', () => {
        expect(generateRecommendation('Athletic Performance', 'Advanced 3-5 years', '12-16 weeks')).toBe('Block');
    });
    it('hybrid/multiple intermediate chooses Block', () => {
        expect(generateRecommendation('Hybrid/Multiple', 'Intermediate 1-3 years', '12-16 weeks')).toBe('Block');
    });
    it('bodybuilding advanced chooses Block', () => {
        expect(generateRecommendation('Bodybuilding/Physique', 'Advanced 3-5 years', '12-16 weeks')).toBe('Block');
    });
    it('default fallback activates for uncategorized goal returns Linear', () => {
        // Goal not matched by any named category & experience not beginner/elite special cases after earlier returns
        expect(generateRecommendation('OtherGoalType', 'Intermediate 1-3 years', 'Any')).toBe('Linear');
    });
    it('bodybuilding beginner hits global beginner rule (Linear)', () => {
        expect(generateRecommendation('Bodybuilding/Physique', 'Beginner <1 year', 'Any')).toBe('Linear');
    });
});
