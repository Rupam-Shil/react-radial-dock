// src/hooks/useControllableState.ts
import { useCallback, useRef, useState } from 'react';

type Updater<T> = T | ((prev: T) => T);

export function useControllableState<T>(
  controlled: T | undefined,
  onChange: ((value: T) => void) | undefined,
  defaultValue: T,
): [T, (value: Updater<T>) => void] {
  const isControlled = controlled !== undefined;
  const [internal, setInternal] = useState<T>(defaultValue);
  const value = isControlled ? (controlled as T) : internal;

  // Keep latest in a ref so updater functions see fresh "prev".
  const valueRef = useRef(value);
  valueRef.current = value;

  const set = useCallback(
    (next: Updater<T>) => {
      const resolved =
        typeof next === 'function' ? (next as (p: T) => T)(valueRef.current) : next;
      if (!isControlled) setInternal(resolved);
      onChange?.(resolved);
    },
    [isControlled, onChange],
  );

  return [value, set];
}
