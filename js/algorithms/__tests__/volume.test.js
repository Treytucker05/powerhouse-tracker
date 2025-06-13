import weeklyVolume from '../volume.js';

test('weeklyVolume sums set counts', () => {
  const week = [{ sets: 10 }, { sets: 5 }];
  expect(weeklyVolume(week)).toBe(15);
});
