// tests/presets.test.ts
import { describe, it, expect } from 'vitest';
import { createMockTimeline, makeMockContext } from './mocks/gsap';
import { spring, fade, pop, stagger, iris } from '../src/presets';

describe('spring preset', () => {
  it('open registers a tween on the disk and on icons', () => {
    const tl = createMockTimeline();
    const ctx = makeMockContext();
    spring.open(tl, ctx);
    const targets = tl.calls.map((c) => c.args[0]);
    expect(targets).toContain(ctx.disk);
    expect(targets).toContain(ctx.icons);
  });
  it('open uses fromTo for at least one target', () => {
    const tl = createMockTimeline();
    spring.open(tl, makeMockContext());
    expect(tl.calls.some((c) => c.method === 'fromTo')).toBe(true);
  });
  it('close registers tweens', () => {
    const tl = createMockTimeline();
    spring.close(tl, makeMockContext());
    expect(tl.calls.length).toBeGreaterThan(0);
  });
});
