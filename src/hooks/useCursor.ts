// src/hooks/useCursor.ts
import { useEffect, useRef, type MutableRefObject } from 'react';

export interface CursorPos {
  x: number;
  y: number;
}

/** Track last-known cursor position via window mousemove. */
export function useCursor(): MutableRefObject<CursorPos | null> {
  const ref = useRef<CursorPos | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onMove = (e: MouseEvent) => {
      ref.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return ref;
}
