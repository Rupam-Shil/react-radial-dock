// tests/hooks/useControllableState.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useControllableState } from '../../src/hooks/useControllableState';

describe('useControllableState', () => {
  it('uses defaultValue when uncontrolled', () => {
    const { result } = renderHook(() => useControllableState<boolean>(undefined, undefined, false));
    expect(result.current[0]).toBe(false);
  });

  it('updates internal state in uncontrolled mode and fires onChange', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState<boolean>(undefined, onChange, false));
    act(() => result.current[1](true));
    expect(result.current[0]).toBe(true);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('returns controlled value when controlled', () => {
    const { result, rerender } = renderHook(
      ({ controlled }: { controlled: boolean }) =>
        useControllableState(controlled, undefined, false),
      { initialProps: { controlled: true } },
    );
    expect(result.current[0]).toBe(true);
    rerender({ controlled: false });
    expect(result.current[0]).toBe(false);
  });

  it('does not modify internal state when controlled, but still calls onChange', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState(true, onChange, false));
    act(() => result.current[1](false));
    // controlled — value unchanged this render
    expect(result.current[0]).toBe(true);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('accepts updater function', () => {
    const { result } = renderHook(() => useControllableState(undefined, undefined, 0));
    act(() => result.current[1]((v: number) => v + 1));
    expect(result.current[0]).toBe(1);
  });
});
