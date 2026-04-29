// tests/hooks/useCursor.test.tsx
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCursor } from '../../src/hooks/useCursor';

describe('useCursor', () => {
  it('starts with null', () => {
    const { result } = renderHook(() => useCursor());
    expect(result.current.current).toBeNull();
  });
  it('updates ref on window mousemove', () => {
    const { result } = renderHook(() => useCursor());
    act(() => {
      window.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 123, clientY: 456 }),
      );
    });
    expect(result.current.current).toEqual({ x: 123, y: 456 });
  });
  it('removes listener on unmount', () => {
    const { result, unmount } = renderHook(() => useCursor());
    unmount();
    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 1, clientY: 1 }));
    });
    // Ref still exists post-unmount; just shouldn't crash.
    expect(result.current.current).toBeNull();
  });
});
