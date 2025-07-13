export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function average(values = []) {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}
