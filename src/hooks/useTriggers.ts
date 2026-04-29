// src/hooks/useTriggers.ts
import { useEffect, useRef } from 'react';
import { matchesHotkey, parseHotkey } from '../hotkey';

export interface UseTriggersOptions {
  rightClick: boolean | { ignoreSelectors?: string[] };
  hotkey: string | false;
  enabled: boolean;
  onTrigger: (x?: number, y?: number) => void;
  onClose: () => void;
}

const DEFAULT_IGNORE = ['input', 'textarea', '[contenteditable]', '[contenteditable="true"]'];

export function useTriggers({
  rightClick,
  hotkey,
  enabled,
  onTrigger,
  onClose,
}: UseTriggersOptions): void {
  // Stable refs for callbacks so listeners don't churn.
  const onTriggerRef = useRef(onTrigger);
  const onCloseRef = useRef(onClose);
  onTriggerRef.current = onTrigger;
  onCloseRef.current = onClose;

  // Track cursor for hotkey-triggered open.
  const cursorRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !enabled) return;

    const ignoreSelectors = [
      ...DEFAULT_IGNORE,
      ...(typeof rightClick === 'object' && rightClick?.ignoreSelectors
        ? rightClick.ignoreSelectors
        : []),
    ];

    const cleanups: Array<() => void> = [];

    if (rightClick !== false) {
      const onContext = (e: MouseEvent) => {
        const target = e.target as Element | null;
        if (
          target &&
          typeof (target as Element).closest === 'function' &&
          ignoreSelectors.some((sel) => (target as Element).closest(sel))
        )
          return;
        e.preventDefault();
        onTriggerRef.current(e.clientX, e.clientY);
      };
      window.addEventListener('contextmenu', onContext);
      cleanups.push(() => window.removeEventListener('contextmenu', onContext));
    }

    if (hotkey) {
      const parsed = parseHotkey(hotkey);
      if (parsed) {
        const onKey = (e: KeyboardEvent) => {
          if (matchesHotkey(e, parsed)) {
            e.preventDefault();
            const c = cursorRef.current;
            onTriggerRef.current(c?.x, c?.y);
          }
        };
        window.addEventListener('keydown', onKey);
        cleanups.push(() => window.removeEventListener('keydown', onKey));
      } else if (process.env.NODE_ENV !== 'production') {
        console.warn(`[react-radial-dock] Could not parse hotkey "${hotkey}" — disabled.`);
      }
    }

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', onEsc);
    cleanups.push(() => window.removeEventListener('keydown', onEsc));

    return () => {
      for (const fn of cleanups) fn();
    };
  }, [enabled, hotkey, JSON.stringify(rightClick)]);
}
