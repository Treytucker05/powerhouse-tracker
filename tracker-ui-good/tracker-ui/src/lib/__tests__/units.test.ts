import { incrementFor, UNITS } from '../units';

test('incrementFor kg', () => {
  expect(incrementFor(UNITS.KG)).toBe(2.5);
  expect(incrementFor('kg')).toBe(2.5);
});

test('incrementFor lbs', () => {
  expect(incrementFor(UNITS.LBS)).toBe(5);
  expect(incrementFor('lbs')).toBe(5);
});
