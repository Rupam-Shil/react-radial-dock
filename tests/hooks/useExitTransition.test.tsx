// tests/hooks/useExitTransition.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useExitTransition } from '../../src/hooks/useExitTransition';

describe('useExitTransition', () => {
  it('mounts immediately when open=true', () => {
    const { result } = renderHook(() => useExitTransition(true));
    expect(result.current.shouldRender).toBe(true);
    expect(result.current.phase).toBe('open');
  });
  it('starts unmounted when open=false', () => {
    const { result } = renderHook(() => useExitTransition(false));
    expect(result.current.shouldRender).toBe(false);
    expect(result.current.phase).toBe('closed');
  });
  it('keeps mounted during exit until done() is called', () => {
    const { result, rerender } = renderHook(({ open }: { open: boolean }) => useExitTransition(open), {
      initialProps: { open: true },
    });
    expect(result.current.shouldRender).toBe(true);
    rerender({ open: false });
    expect(result.current.shouldRender).toBe(true);
    expect(result.current.phase).toBe('closing');
    act(() => result.current.done());
    expect(result.current.shouldRender).toBe(false);
    expect(result.current.phase).toBe('closed');
  });
  it('cancels exit if reopened', () => {
    const { result, rerender } = renderHook(({ open }: { open: boolean }) => useExitTransition(open), {
      initialProps: { open: true },
    });
    rerender({ open: false });
    expect(result.current.phase).toBe('closing');
    rerender({ open: true });
    expect(result.current.phase).toBe('open');
    expect(result.current.shouldRender).toBe(true);
  });
});
