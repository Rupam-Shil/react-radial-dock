// tests/hooks/useReducedMotion.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useReducedMotion } from '../../src/hooks/useReducedMotion';

describe('useReducedMotion', () => {
  let listeners: Array<(e: { matches: boolean }) => void> = [];
  let matches = false;
  const original = window.matchMedia;

  beforeEach(() => {
    listeners = [];
    matches = false;
    window.matchMedia = vi.fn().mockImplementation((q: string) => ({
      get matches() {
        return matches;
      },
      media: q,
      addEventListener: (_: string, cb: (e: { matches: boolean }) => void) => {
        listeners.push(cb);
      },
      removeEventListener: (_: string, cb: (e: { matches: boolean }) => void) => {
        listeners = listeners.filter((l) => l !== cb);
      },
      addListener: () => {},
      removeListener: () => {},
      onchange: null,
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;
  });
  afterEach(() => {
    window.matchMedia = original;
  });

  it('returns false when prefers-reduced-motion is no-preference', () => {
    const { result } = renderHook(() => useReducedMotion('auto'));
    expect(result.current).toBe(false);
  });

  it('returns true when mode is "always"', () => {
    const { result } = renderHook(() => useReducedMotion('always'));
    expect(result.current).toBe(true);
  });

  it('returns false when mode is "never" even if media matches', () => {
    matches = true;
    const { result } = renderHook(() => useReducedMotion('never'));
    expect(result.current).toBe(false);
  });

  it('updates when the media query changes (auto mode)', () => {
    const { result } = renderHook(() => useReducedMotion('auto'));
    expect(result.current).toBe(false);
    act(() => {
      matches = true;
      listeners.forEach((l) => l({ matches: true }));
    });
    expect(result.current).toBe(true);
  });
});
