// tests/mocks/gsap.ts
import { vi } from 'vitest';

export interface MockTimelineCall {
  method: string;
  args: unknown[];
}

export function createMockTimeline() {
  const calls: MockTimelineCall[] = [];
  let onCompleteCb: (() => void) | null = null;
  const tl = {
    calls,
    to: vi.fn((target: unknown, vars: unknown, pos?: unknown) => {
      calls.push({ method: 'to', args: [target, vars, pos] });
      return tl;
    }),
    from: vi.fn((target: unknown, vars: unknown, pos?: unknown) => {
      calls.push({ method: 'from', args: [target, vars, pos] });
      return tl;
    }),
    fromTo: vi.fn((target: unknown, fromV: unknown, toV: unknown, pos?: unknown) => {
      calls.push({ method: 'fromTo', args: [target, fromV, toV, pos] });
      return tl;
    }),
    set: vi.fn((target: unknown, vars: unknown, pos?: unknown) => {
      calls.push({ method: 'set', args: [target, vars, pos] });
      return tl;
    }),
    play: vi.fn(() => tl),
    reverse: vi.fn(() => tl),
    pause: vi.fn(() => tl),
    kill: vi.fn(() => tl),
    eventCallback: vi.fn((name: string, cb: (() => void) | null) => {
      if (name === 'onComplete') onCompleteCb = cb;
      return tl;
    }),
    /** Test helper. */
    fireOnComplete() {
      onCompleteCb?.();
    },
  };
  return tl;
}

export function makeMockContext() {
  const container = document.createElement('div');
  const disk = document.createElement('div');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const slices = Array.from({ length: 4 }, () =>
    document.createElementNS('http://www.w3.org/2000/svg', 'path'),
  );
  const icons = Array.from({ length: 4 }, () => document.createElement('div'));
  return {
    container,
    disk,
    svg,
    slices,
    icons,
    n: 4,
    sliceSize: Math.PI / 2,
    outerRadius: 110,
    innerRadius: 55,
    centerX: 0,
    centerY: 0,
  };
}
