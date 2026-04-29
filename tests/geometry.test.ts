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

// append to tests/geometry.test.ts
import { arcPath } from '../src/geometry';

describe('arcPath', () => {
  it('produces a closed path with M/L/A/A/Z commands', () => {
    const d = arcPath({
      cx: 100,
      cy: 100,
      innerRadius: 30,
      outerRadius: 80,
      startAngle: 0,
      endAngle: Math.PI / 2,
    });
    expect(d).toMatch(/^M /);
    expect(d).toMatch(/Z\s*$/);
    // outer arc + inner arc = two A commands
    expect(d.match(/A /g)?.length).toBe(2);
  });

  it('uses largeArcFlag=1 for spans > PI', () => {
    const d = arcPath({
      cx: 0,
      cy: 0,
      innerRadius: 10,
      outerRadius: 20,
      startAngle: 0,
      endAngle: (3 * Math.PI) / 2,
    });
    // Outer arc command should contain "1 1" (large-arc=1, sweep=1) somewhere.
    expect(d).toMatch(/A \d+(\.\d+)? \d+(\.\d+)? 0 1 1/);
  });

  it('uses largeArcFlag=0 for spans <= PI', () => {
    const d = arcPath({
      cx: 0,
      cy: 0,
      innerRadius: 10,
      outerRadius: 20,
      startAngle: 0,
      endAngle: Math.PI / 2,
    });
    expect(d).toMatch(/A \d+(\.\d+)? \d+(\.\d+)? 0 0 1/);
  });

  it('matches snapshot at known coordinates', () => {
    const d = arcPath({
      cx: 100,
      cy: 100,
      innerRadius: 50,
      outerRadius: 100,
      startAngle: 0,
      endAngle: Math.PI / 2,
    });
    expect(d).toMatchInlineSnapshot(`"M 100 0 A 100 100 0 0 1 200 100 L 150 100 A 50 50 0 0 0 100 50 Z"`);
  });
});

import { angleToIndex } from '../src/geometry';

describe('angleToIndex', () => {
  // Center 100,100; n=4; startAngle=0 (slice 0 centered at top); clockwise.
  // Slices (cw, top→right→bottom→left): 0, 1, 2, 3.
  const cx = 100;
  const cy = 100;

  it('top of circle is slice 0 (n=4 cw, start=0)', () => {
    expect(angleToIndex(cx, cy - 50, cx, cy, 4, 0, 1)).toBe(0);
  });
  it('right of circle is slice 1 (n=4 cw)', () => {
    expect(angleToIndex(cx + 50, cy, cx, cy, 4, 0, 1)).toBe(1);
  });
  it('bottom of circle is slice 2 (n=4 cw)', () => {
    expect(angleToIndex(cx, cy + 50, cx, cy, 4, 0, 1)).toBe(2);
  });
  it('left of circle is slice 3 (n=4 cw)', () => {
    expect(angleToIndex(cx - 50, cy, cx, cy, 4, 0, 1)).toBe(3);
  });
  it('counter-clockwise reverses indices', () => {
    expect(angleToIndex(cx + 50, cy, cx, cy, 4, 0, -1)).toBe(3);
    expect(angleToIndex(cx - 50, cy, cx, cy, 4, 0, -1)).toBe(1);
  });
  it('startAngle=PI/2 shifts slice 0 to the right (n=4, cw)', () => {
    expect(angleToIndex(cx + 50, cy, cx, cy, 4, Math.PI / 2, 1)).toBe(0);
  });
  it('handles n=3 across all three sectors', () => {
    expect(angleToIndex(cx, cy - 50, cx, cy, 3, 0, 1)).toBe(0);
    // Slice 1 center: 0 + 1*(2π/3) ≈ 120°
    const a = (2 * Math.PI) / 3;
    const p1 = { x: cx + 50 * Math.sin(a), y: cy - 50 * Math.cos(a) };
    expect(angleToIndex(p1.x, p1.y, cx, cy, 3, 0, 1)).toBe(1);
  });
  it('handles n=12', () => {
    expect(angleToIndex(cx, cy - 50, cx, cy, 12, 0, 1)).toBe(0);
    // Slice 6 is opposite (bottom).
    expect(angleToIndex(cx, cy + 50, cx, cy, 12, 0, 1)).toBe(6);
  });
});
