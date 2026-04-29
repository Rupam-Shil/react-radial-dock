// tests/RadialDock.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RadialDock from '../src/RadialDock';
import type { RadialDockItem } from '../src/types';

const items: RadialDockItem[] = [
  { id: 'a', label: 'A', icon: 'A', onSelect: vi.fn() },
  { id: 'b', label: 'B', icon: 'B', onSelect: vi.fn() },
  { id: 'c', label: 'C', icon: 'C', onSelect: vi.fn() },
];

describe('RadialDock', () => {
  it('renders nothing when items < 3', () => {
    const { container } = render(
      <RadialDock items={items.slice(0, 2)} open />,
    );
    expect(container.querySelector('.rrd-overlay')).toBeNull();
  });

  it('renders nothing when closed and uncontrolled', () => {
    const { container } = render(<RadialDock items={items} />);
    expect(container.querySelector('.rrd-overlay')).toBeNull();
  });

  it('renders overlay when open', () => {
    render(<RadialDock items={items} open position={{ x: 200, y: 200 }} />);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menu')).toHaveAttribute('aria-label', 'Quick actions');
  });

  it('honors custom ariaLabel', () => {
    render(<RadialDock items={items} open position={{ x: 200, y: 200 }} ariaLabel="Tools" />);
    expect(screen.getByRole('menu', { name: 'Tools' })).toBeInTheDocument();
  });

  it('applies custom classNames in addition to defaults', () => {
    render(
      <RadialDock
        items={items}
        open
        position={{ x: 200, y: 200 }}
        classNames={{ overlay: 'extra-overlay', container: 'extra-container' }}
      />,
    );
    expect(document.body.querySelector('.rrd-overlay.extra-overlay')).not.toBeNull();
    expect(document.body.querySelector('.rrd-container.extra-container')).not.toBeNull();
  });

  it('injects CSS variables from theme prop', () => {
    render(
      <RadialDock
        items={items}
        open
        position={{ x: 200, y: 200 }}
        theme={{ sliceFillHover: '#ff4d4f', shadow: '0 12px 40px red' }}
      />,
    );
    const overlay = document.body.querySelector('.rrd-overlay') as HTMLElement;
    expect(overlay.style.getPropertyValue('--rrd-slice-fill-hover')).toBe('#ff4d4f');
    expect(overlay.style.getPropertyValue('--rrd-shadow')).toBe('0 12px 40px red');
  });

  it('clicking a slice fires both item.onSelect and top-level onSelect, then closes', () => {
    const onItem = vi.fn();
    const onTop = vi.fn();
    const onOpenChange = vi.fn();
    const my: RadialDockItem[] = [
      { id: 'a', label: 'A', icon: 'A', onSelect: onItem },
      { id: 'b', label: 'B', icon: 'B', onSelect: vi.fn() },
      { id: 'c', label: 'C', icon: 'C', onSelect: vi.fn() },
    ];
    render(
      <RadialDock
        items={my}
        open
        onOpenChange={onOpenChange}
        position={{ x: 200, y: 200 }}
        onSelect={onTop}
      />,
    );
    const firstSlice = document.body.querySelectorAll('path.rrd-slice')[0]!;
    fireEvent.click(firstSlice);
    expect(onItem).toHaveBeenCalledTimes(1);
    expect(onTop).toHaveBeenCalledTimes(1);
    expect(onTop.mock.calls[0]![0]).toMatchObject({ id: 'a' });
    expect(onTop.mock.calls[0]![1]).toBe(0);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('disabled item: click is no-op', () => {
    const onItem = vi.fn();
    const my: RadialDockItem[] = [
      { id: 'a', label: 'A', icon: 'A', onSelect: onItem, disabled: true },
      { id: 'b', label: 'B', icon: 'B', onSelect: vi.fn() },
      { id: 'c', label: 'C', icon: 'C', onSelect: vi.fn() },
    ];
    render(
      <RadialDock items={my} open position={{ x: 200, y: 200 }} />,
    );
    const firstSlice = document.body.querySelectorAll('path.rrd-slice')[0]!;
    fireEvent.click(firstSlice);
    expect(onItem).not.toHaveBeenCalled();
  });

  it('custom render prop replaces default content and receives hover state', () => {
    const my: RadialDockItem[] = [
      {
        id: 'a',
        onSelect: vi.fn(),
        render: ({ hovered, index }) => (
          <span data-testid={`custom-${index}`}>{hovered ? 'HOT' : 'cold'}</span>
        ),
      },
      { id: 'b', label: 'B', icon: 'B', onSelect: vi.fn() },
      { id: 'c', label: 'C', icon: 'C', onSelect: vi.fn() },
    ];
    render(<RadialDock items={my} open position={{ x: 200, y: 200 }} />);
    expect(screen.getByTestId('custom-0')).toHaveTextContent('cold');
  });
});
