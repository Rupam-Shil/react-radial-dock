// tests/hotkey.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { parseHotkey, matchesHotkey, isMacPlatform } from '../src/hotkey';

describe('parseHotkey', () => {
  it('parses single letter', () => {
    expect(parseHotkey('e')).toEqual({
      key: 'e',
      mod: false,
      shift: false,
      alt: false,
      meta: false,
      ctrl: false,
    });
  });
  it('parses mod+e', () => {
    expect(parseHotkey('mod+e')).toMatchObject({ key: 'e', mod: true });
  });
  it('parses shift+space (lowercased + space token)', () => {
    expect(parseHotkey('shift+space')).toMatchObject({ key: ' ', shift: true });
  });
  it('parses mod+shift+k', () => {
    expect(parseHotkey('mod+shift+k')).toMatchObject({
      key: 'k',
      mod: true,
      shift: true,
    });
  });
  it('is case-insensitive', () => {
    expect(parseHotkey('Mod+Shift+K')).toMatchObject({
      key: 'k',
      mod: true,
      shift: true,
    });
  });
  it('returns null for empty string', () => {
    expect(parseHotkey('')).toBeNull();
  });
  it('returns null for missing key', () => {
    expect(parseHotkey('mod+')).toBeNull();
  });
  it('returns null for "mod" alone (no key)', () => {
    expect(parseHotkey('mod')).toBeNull();
  });
});

describe('matchesHotkey', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'platform', { value: 'MacIntel', configurable: true });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  function makeEvent(init: Partial<KeyboardEvent>): KeyboardEvent {
    return new KeyboardEvent('keydown', { ...init });
  }

  it('mod+e matches metaKey on Mac', () => {
    const parsed = parseHotkey('mod+e')!;
    expect(matchesHotkey(makeEvent({ key: 'e', metaKey: true }), parsed)).toBe(true);
    expect(matchesHotkey(makeEvent({ key: 'e', ctrlKey: true }), parsed)).toBe(false);
  });
  it('mod+e matches ctrlKey on non-Mac', () => {
    Object.defineProperty(navigator, 'platform', { value: 'Win32', configurable: true });
    const parsed = parseHotkey('mod+e')!;
    expect(matchesHotkey(makeEvent({ key: 'e', ctrlKey: true }), parsed)).toBe(true);
    expect(matchesHotkey(makeEvent({ key: 'e', metaKey: true }), parsed)).toBe(false);
  });
  it('shift+space matches', () => {
    const parsed = parseHotkey('shift+space')!;
    expect(matchesHotkey(makeEvent({ key: ' ', shiftKey: true }), parsed)).toBe(true);
  });
  it('does not match if extra modifiers are pressed', () => {
    const parsed = parseHotkey('e')!;
    expect(matchesHotkey(makeEvent({ key: 'e', metaKey: true }), parsed)).toBe(false);
  });
  it('does not match if key differs', () => {
    const parsed = parseHotkey('e')!;
    expect(matchesHotkey(makeEvent({ key: 'f' }), parsed)).toBe(false);
  });
  it('matches case-insensitively for letter keys', () => {
    const parsed = parseHotkey('e')!;
    expect(matchesHotkey(makeEvent({ key: 'E' }), parsed)).toBe(true);
  });
});

describe('isMacPlatform', () => {
  it('detects Mac', () => {
    Object.defineProperty(navigator, 'platform', { value: 'MacIntel', configurable: true });
    expect(isMacPlatform()).toBe(true);
  });
  it('detects iPhone', () => {
    Object.defineProperty(navigator, 'platform', { value: 'iPhone', configurable: true });
    expect(isMacPlatform()).toBe(true);
  });
  it('detects non-Mac', () => {
    Object.defineProperty(navigator, 'platform', { value: 'Win32', configurable: true });
    expect(isMacPlatform()).toBe(false);
  });
});
