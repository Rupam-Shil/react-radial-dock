import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useGsapTimeline } from '../../src/hooks/useGsapTimeline';
import { createMockTimeline } from '../mocks/gsap';
import type { RadialDockAnimationContext } from '../../src/types';

function makeCtx(): RadialDockAnimationContext {
  return {
    container: document.createElement('div'),
    disk: document.createElement('div'),
    svg: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
    slices: [],
    icons: [],
    n: 4,
    sliceSize: Math.PI / 2,
    outerRadius: 110,
    innerRadius: 55,
    centerX: 0,
    centerY: 0,
  };
}

describe('useGsapTimeline', () => {
  it('does nothing when ctx is null', () => {
    const onClosed = vi.fn();
    const fakeGsap = { timeline: vi.fn() };
    renderHook(() =>
      useGsapTimeline({
        ctx: null,
        animation: 'spring',
        isOpen: false,
        reducedMotion: false,
        onClosed,
        gsap: fakeGsap as never,
      }),
    );
    expect(fakeGsap.timeline).not.toHaveBeenCalled();
  });

  it('plays open timeline when isOpen flips true', async () => {
    const tl = createMockTimeline();
    const fakeGsap = { timeline: vi.fn(() => tl) };
    const ctx = makeCtx();
    const { rerender } = renderHook(
      ({ isOpen }: { isOpen: boolean }) =>
        useGsapTimeline({
          ctx,
          animation: 'fade',
          isOpen,
          reducedMotion: false,
          onClosed: vi.fn(),
          gsap: fakeGsap as never,
        }),
      { initialProps: { isOpen: false } },
    );
    rerender({ isOpen: true });
    await waitFor(() => expect(tl.play).toHaveBeenCalled());
  });

  it('reverses (or runs close timeline) and fires onClosed when isOpen flips false', async () => {
    const openTl = createMockTimeline();
    const closeTl = createMockTimeline();
    const timelineFn = vi
      .fn()
      .mockImplementationOnce(() => openTl)
      .mockImplementationOnce(() => closeTl);
    const fakeGsap = { timeline: timelineFn };
    const onClosed = vi.fn();
    const ctx = makeCtx();
    const { rerender } = renderHook(
      ({ isOpen }: { isOpen: boolean }) =>
        useGsapTimeline({
          ctx,
          animation: 'fade',
          isOpen,
          reducedMotion: false,
          onClosed,
          gsap: fakeGsap as never,
        }),
      { initialProps: { isOpen: true } },
    );
    rerender({ isOpen: false });
    await waitFor(() => expect(closeTl.eventCallback).toHaveBeenCalledWith('onComplete', expect.any(Function)));
    act(() => closeTl.fireOnComplete());
    expect(onClosed).toHaveBeenCalled();
  });

  it('skips animation under reducedMotion (still calls onClosed on close)', async () => {
    const tl = createMockTimeline();
    const fakeGsap = { timeline: vi.fn(() => tl) };
    const onClosed = vi.fn();
    const ctx = makeCtx();
    const { rerender } = renderHook(
      ({ isOpen }: { isOpen: boolean }) =>
        useGsapTimeline({
          ctx,
          animation: 'fade',
          isOpen,
          reducedMotion: true,
          onClosed,
          gsap: fakeGsap as never,
        }),
      { initialProps: { isOpen: true } },
    );
    rerender({ isOpen: false });
    await act(async () => {
      tl.fireOnComplete();
    });
    await waitFor(() => expect(onClosed).toHaveBeenCalled());
  });
});
