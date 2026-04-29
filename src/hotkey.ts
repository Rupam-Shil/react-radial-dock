export interface ParsedHotkey {
  key: string; // lowercased
  mod: boolean; // 'mod' token — Cmd on Mac, Ctrl elsewhere
  shift: boolean;
  alt: boolean;
  meta: boolean; // explicit 'meta' or 'cmd'
  ctrl: boolean; // explicit 'ctrl'
}

const SPECIAL_KEYS: Record<string, string> = {
  space: ' ',
  enter: 'enter',
  return: 'enter',
  esc: 'escape',
  escape: 'escape',
  tab: 'tab',
  up: 'arrowup',
  down: 'arrowdown',
  left: 'arrowleft',
  right: 'arrowright',
};

export function parseHotkey(input: string): ParsedHotkey | null {
  if (!input || typeof input !== 'string') return null;
  const tokens = input
    .toLowerCase()
    .split('+')
    .map((t) => t.trim())
    .filter(Boolean);
  if (tokens.length === 0) return null;

  let key = '';
  let mod = false;
  let shift = false;
  let alt = false;
  let meta = false;
  let ctrl = false;

  for (const t of tokens) {
    if (t === 'mod') mod = true;
    else if (t === 'shift') shift = true;
    else if (t === 'alt' || t === 'option' || t === 'opt') alt = true;
    else if (t === 'meta' || t === 'cmd' || t === 'command') meta = true;
    else if (t === 'ctrl' || t === 'control') ctrl = true;
    else {
      key = SPECIAL_KEYS[t] ?? t;
    }
  }

  if (!key) return null;
  return { key, mod, shift, alt, meta, ctrl };
}

export function isMacPlatform(): boolean {
  if (typeof navigator === 'undefined') return false;
  const p = navigator.platform || '';
  return /mac|iphone|ipad|ipod/i.test(p);
}

export function matchesHotkey(event: KeyboardEvent, hk: ParsedHotkey): boolean {
  const isMac = isMacPlatform();
  const wantMeta = hk.meta || (hk.mod && isMac);
  const wantCtrl = hk.ctrl || (hk.mod && !isMac);
  if (event.metaKey !== wantMeta) return false;
  if (event.ctrlKey !== wantCtrl) return false;
  if (event.shiftKey !== hk.shift) return false;
  if (event.altKey !== hk.alt) return false;
  const k = (event.key ?? '').toLowerCase();
  return k === hk.key;
}

export function isDangerousHotkey(hk: ParsedHotkey): boolean {
  // Reserve for browser-critical bindings.
  if (hk.mod && !hk.shift && !hk.alt && (hk.key === 'r' || hk.key === 't' || hk.key === 'w')) {
    return true;
  }
  return false;
}
