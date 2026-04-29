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

// append to tests/presets.test.ts
describe('fade preset', () => {
  it('open uses opacity-only fromTo', () => {
    const tl = createMockTimeline();
    fade.open(tl, makeMockContext());
    const targets = tl.calls.map((c) => c.args[0]);
    expect(targets).toContain(tl.calls[0]!.args[0]);
    // every fromTo must include opacity in to-vars
    tl.calls
      .filter((c) => c.method === 'fromTo')
      .forEach((c) => {
        expect(c.args[2]).toMatchObject({ opacity: 1 });
      });
  });
  it('close registers an opacity tween to 0', () => {
    const tl = createMockTimeline();
    fade.close(tl, makeMockContext());
    const hasOpacityZero = tl.calls.some(
      (c) => (c.args[1] as { opacity?: number })?.opacity === 0,
    );
    expect(hasOpacityZero).toBe(true);
  });
});

describe('pop preset', () => {
  it('open uses scale fromTo for icons', () => {
    const tl = createMockTimeline();
    pop.open(tl, makeMockContext());
    const fromTos = tl.calls.filter((c) => c.method === 'fromTo');
    const iconsCall = fromTos.find((c) => Array.isArray(c.args[0]));
    expect(iconsCall).toBeDefined();
    expect(iconsCall?.args[1]).toMatchObject({ scale: 0 });
  });
});

describe('stagger preset', () => {
  it('open icons fromTo includes a stagger value', () => {
    const tl = createMockTimeline();
    stagger.open(tl, makeMockContext());
    const fromTos = tl.calls.filter((c) => c.method === 'fromTo');
    const iconsCall = fromTos.find((c) => Array.isArray(c.args[0]));
    expect(iconsCall).toBeDefined();
    const toVars = iconsCall!.args[2] as Record<string, unknown>;
    expect(typeof toVars.stagger === 'number' || typeof toVars.stagger === 'object').toBe(true);
  });
});
