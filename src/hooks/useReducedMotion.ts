// src/hooks/useReducedMotion.ts
import { useSyncExternalStore } from 'react';
import type { RadialDockReducedMotion } from '../types';

const QUERY = '(prefers-reduced-motion: reduce)';

function getSnapshot(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia(QUERY).matches;
}

function subscribe(cb: () => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {};
  }
  const m = window.matchMedia(QUERY);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
}

const getServerSnapshot = () => false;

export function useReducedMotion(mode: RadialDockReducedMotion = 'auto'): boolean {
  const auto = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (mode === 'always') return true;
  if (mode === 'never') return false;
  return auto;
}
