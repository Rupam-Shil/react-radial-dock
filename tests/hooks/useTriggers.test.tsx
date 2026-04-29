// tests/hooks/useTriggers.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTriggers } from '../../src/hooks/useTriggers';

describe('useTriggers', () => {
  let onTrigger: ReturnType<typeof vi.fn>;
  let onClose: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    onTrigger = vi.fn();
    onClose = vi.fn();
    Object.defineProperty(navigator, 'platform', { value: 'MacIntel', configurable: true });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('right-click anywhere fires onTrigger with cursor', () => {
    renderHook(() =>
      useTriggers({
        rightClick: true,
        hotkey: false,
        enabled: true,
        onTrigger,
        onClose,
      }),
    );
    const evt = new MouseEvent('contextmenu', { clientX: 50, clientY: 60, cancelable: true, bubbles: true });
    act(() => {
      document.body.dispatchEvent(evt);
    });
    expect(onTrigger).toHaveBeenCalledWith(50, 60);
    expect(evt.defaultPrevented).toBe(true);
  });

  it('right-click inside <input> does NOT fire and lets default through', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    renderHook(() =>
      useTriggers({
        rightClick: true,
        hotkey: false,
        enabled: true,
        onTrigger,
        onClose,
      }),
    );
    const evt = new MouseEvent('contextmenu', { cancelable: true, bubbles: true });
    act(() => {
      input.dispatchEvent(evt);
    });
    expect(onTrigger).not.toHaveBeenCalled();
    expect(evt.defaultPrevented).toBe(false);
    input.remove();
  });

  it('honors custom ignoreSelectors', () => {
    const div = document.createElement('div');
    div.className = 'no-radial';
    document.body.appendChild(div);
    renderHook(() =>
      useTriggers({
        rightClick: { ignoreSelectors: ['.no-radial'] },
        hotkey: false,
        enabled: true,
        onTrigger,
        onClose,
      }),
    );
    act(() => {
      div.dispatchEvent(new MouseEvent('contextmenu', { cancelable: true, bubbles: true }));
    });
    expect(onTrigger).not.toHaveBeenCalled();
    div.remove();
  });

  it('hotkey fires onTrigger with last-known cursor', () => {
    renderHook(() =>
      useTriggers({
        rightClick: false,
        hotkey: 'mod+e',
        enabled: true,
        onTrigger,
        onClose,
      }),
    );
    // First, set cursor.
    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 200 }));
    });
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'e', metaKey: true, cancelable: true, bubbles: true }),
      );
    });
    expect(onTrigger).toHaveBeenCalledWith(100, 200);
  });

  it('Escape fires onClose', () => {
    renderHook(() =>
      useTriggers({
        rightClick: false,
        hotkey: false,
        enabled: true,
        onTrigger,
        onClose,
      }),
    );
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(onClose).toHaveBeenCalled();
  });

  it('disabled (enabled=false) attaches no triggers', () => {
    renderHook(() =>
      useTriggers({
        rightClick: true,
        hotkey: 'mod+e',
        enabled: false,
        onTrigger,
        onClose,
      }),
    );
    act(() => {
      document.body.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', metaKey: true }));
    });
    expect(onTrigger).not.toHaveBeenCalled();
  });
});
