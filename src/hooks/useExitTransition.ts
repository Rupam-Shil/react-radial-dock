// src/hooks/useExitTransition.ts
import { useCallback, useEffect, useState } from 'react';

export type ExitPhase = 'closed' | 'open' | 'closing';

export interface ExitTransitionState {
  shouldRender: boolean;
  phase: ExitPhase;
  /** Call when the close animation has finished. */
  done: () => void;
}

export function useExitTransition(open: boolean): ExitTransitionState {
  const [phase, setPhase] = useState<ExitPhase>(open ? 'open' : 'closed');

  useEffect(() => {
    if (open) {
      setPhase('open');
    } else {
      setPhase((p) => (p === 'closed' ? 'closed' : 'closing'));
    }
  }, [open]);

  const done = useCallback(() => {
    setPhase((p) => (p === 'closing' ? 'closed' : p));
  }, []);

  return {
    shouldRender: phase !== 'closed',
    phase,
    done,
  };
}
