// tests/imperative-handle.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useRef } from 'react';
import RadialDock from '../src/RadialDock';
import type { RadialDockHandle, RadialDockItem } from '../src/types';

const items: RadialDockItem[] = [
  { id: 'a', label: 'A', onSelect: vi.fn() },
  { id: 'b', label: 'B', onSelect: vi.fn() },
  { id: 'c', label: 'C', onSelect: vi.fn() },
];

function Harness({ onReady }: { onReady: (h: RadialDockHandle) => void }) {
  const ref = useRef<RadialDockHandle>(null);
  return (
    <>
      <button data-testid="ready" onClick={() => onReady(ref.current!)}>r</button>
      <RadialDock ref={ref} items={items} />
    </>
  );
}

describe('imperative handle', () => {
  it('open() / close() / toggle() / isOpen()', async () => {
    let h: RadialDockHandle | null = null;
    render(<Harness onReady={(handle) => (h = handle)} />);
    screen.getByTestId('ready').click();
    expect(h).not.toBeNull();

    act(() => h!.open(100, 100));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(h!.isOpen()).toBe(true);

    act(() => h!.toggle());
    expect(h!.isOpen()).toBe(false);

    act(() => h!.toggle(50, 50));
    expect(h!.isOpen()).toBe(true);

    act(() => h!.close());
    expect(h!.isOpen()).toBe(false);
  });
});
