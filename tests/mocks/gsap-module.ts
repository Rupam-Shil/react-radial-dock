// tests/mocks/gsap-module.ts
import { vi } from 'vitest';

const tlSink: Array<unknown> = [];

function createTimeline() {
  let onCompleteCb: (() => void) | null = null;
  const tl = {
    to: vi.fn(() => tl),
    from: vi.fn(() => tl),
    fromTo: vi.fn(() => tl),
    set: vi.fn(() => tl),
    play: vi.fn(() => tl),
    reverse: vi.fn(() => tl),
    pause: vi.fn(() => tl),
    kill: vi.fn(() => tl),
    eventCallback: vi.fn((name: string, cb: (() => void) | null) => {
      if (name === 'onComplete') {
        onCompleteCb = cb;
        // Fire next microtask so close-flow completes synchronously enough for tests.
        if (cb) queueMicrotask(() => onCompleteCb?.());
      }
      return tl;
    }),
  };
  tlSink.push(tl);
  return tl;
}

const gsap = {
  timeline: vi.fn((_vars?: Record<string, unknown>) => createTimeline()),
};

export default gsap;
export { gsap };
