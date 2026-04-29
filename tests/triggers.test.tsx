// tests/triggers.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import RadialDock from '../src/RadialDock';
import type { RadialDockItem } from '../src/types';

const items: RadialDockItem[] = [
  { id: 'a', label: 'A', icon: 'A', onSelect: vi.fn() },
  { id: 'b', label: 'B', icon: 'B', onSelect: vi.fn() },
  { id: 'c', label: 'C', icon: 'C', onSelect: vi.fn() },
];

describe('triggers', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'platform', { value: 'MacIntel', configurable: true });
  });

  it('right-click on body opens the dock', () => {
    render(<RadialDock items={items} />);
    expect(screen.queryByRole('menu')).toBeNull();
    act(() => {
      window.dispatchEvent(
        new MouseEvent('contextmenu', { clientX: 300, clientY: 300, cancelable: true, bubbles: true }),
      );
    });
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('right-click in <input> does NOT open', () => {
    render(
      <>
        <input data-testid="i" />
        <RadialDock items={items} />
      </>,
    );
    const input = screen.getByTestId('i');
    act(() => {
      input.dispatchEvent(
        new MouseEvent('contextmenu', { cancelable: true, bubbles: true }),
      );
    });
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('hotkey opens at last cursor', () => {
    render(<RadialDock items={items} triggers={{ rightClick: false, hotkey: 'mod+e' }} />);
    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 200 }));
    });
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', metaKey: true, bubbles: true }));
    });
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('Escape closes the dock', async () => {
    const onOpenChange = vi.fn();
    render(<RadialDock items={items} open onOpenChange={onOpenChange} position={{ x: 200, y: 200 }} />);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
