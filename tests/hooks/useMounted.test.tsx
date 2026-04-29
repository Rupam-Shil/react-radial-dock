// tests/hooks/useMounted.test.tsx
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMounted } from '../../src/hooks/useMounted';

describe('useMounted', () => {
  it('returns true after mount in jsdom', () => {
    const { result } = renderHook(() => useMounted());
    expect(result.current).toBe(true);
  });
});
