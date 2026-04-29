// tests/geometry.test.ts
import { describe, it, expect } from 'vitest';
import { degToRad, polarToCartesian } from '../src/geometry';

describe('degToRad', () => {
  it('converts 0deg to 0rad', () => {
    expect(degToRad(0)).toBe(0);
  });
  it('converts 180deg to PI', () => {
    expect(degToRad(180)).toBeCloseTo(Math.PI, 10);
  });
  it('converts 90deg to PI/2', () => {
    expect(degToRad(90)).toBeCloseTo(Math.PI / 2, 10);
  });
});

describe('polarToCartesian', () => {
  // Convention: angle 0 = top (12 o'clock), angle PI/2 = right (3 o'clock).
  it('places angle 0 at top of circle', () => {
    const { x, y } = polarToCartesian(0, 0, 100, 0);
    expect(x).toBeCloseTo(0, 10);
    expect(y).toBeCloseTo(-100, 10);
  });
  it('places angle PI/2 at right', () => {
    const { x, y } = polarToCartesian(0, 0, 100, Math.PI / 2);
    expect(x).toBeCloseTo(100, 10);
    expect(y).toBeCloseTo(0, 10);
  });
  it('places angle PI at bottom', () => {
    const { x, y } = polarToCartesian(0, 0, 100, Math.PI);
    expect(x).toBeCloseTo(0, 10);
    expect(y).toBeCloseTo(100, 10);
  });
  it('respects center offset', () => {
    const { x, y } = polarToCartesian(50, 50, 10, 0);
    expect(x).toBeCloseTo(50, 10);
    expect(y).toBeCloseTo(40, 10);
  });
});
