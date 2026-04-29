# `react-radial-dock` — Brainstorming & Design Spec

> **Status:** Draft v1
> **Owner:** Rupam Shil
> **Date:** 2026-04-29
> **Repo:** `/Users/rupamshil/dev/plugins/react-radial-dock` (empty, to be initialized)

A standalone, framework-agnostic React npm package providing a customizable, GSAP-animated radial action dock (donut-shaped quick-action menu). Generalized from an in-app component (`mark7/components/quick-action/radial-quick-action`) into a fully flexible reusable library.

---

## 1. Goals & Non-Goals

### Goals
- **Drop-in usability** — `npm i react-radial-dock` + one CSS import + render a component. Works in Next.js App Router, Vite/CRA, RSC-aware.
- **Maximum flexibility** — colors, classNames, geometry, animation, triggers, render functions all overridable.
- **Controlled & uncontrolled modes** — supports both via the standard React pattern (open/onOpenChange + defaultOpen).
- **Trigger orthogonality** — right-click, hotkey, controlled state, and imperative ref are independent and composable.
- **Production-grade a11y** — proper ARIA, keyboard nav, reduced-motion support, focus management.
- **Tree-shakable & lean** — ESM-first, peer-deps for `react`/`gsap`, CSS sidecar.

### Non-Goals (v1)
- **Not a generic context-menu replacement** — this is a radial dock; for full menu trees use `@radix-ui/react-context-menu`.
- **No built-in icon library** — consumers bring their own icons (`lucide-react`, `@tabler/icons-react`, raw SVG, etc.).
- **No theming context provider** — single-component theming via `theme` + CSS variables; no `<RadialDockProvider>` global theme. Users wanting cross-instance theming use CSS variables on a parent element.
- **No mobile/touch gesture trigger built-in** — reachable via controlled mode + custom listeners. v1.x can add a long-press preset trigger.
- **No persistence layer** — hotkey persistence is the consumer's responsibility (use the controlled `hotkey` prop + their own storage).

---

## 2. Origin

This package generalizes `mark7/components/quick-action/radial-quick-action/index.tsx` (Edmo project), which uses `motion/react` + SCSS modules. Notable differences in the package:

| Concern              | mark7 (in-app)                          | `react-radial-dock` (lib)                    |
| -------------------- | --------------------------------------- | -------------------------------------------- |
| Animation lib        | `motion/react`                          | **GSAP** (peer dep) with preset registry     |
| Styling              | SCSS modules + project theme variables  | Single CSS file with CSS variables + `theme` prop + `classNames` overrides |
| Hotkey persistence   | Hardcoded `localStorage` write          | Out of scope — controlled prop only          |
| Position             | Cursor-derived only                     | Cursor OR explicit `position` prop           |
| Item shape           | `{ id, icon, label, onSelect }`         | + `render({ hovered, index })` escape hatch + optional `disabled` |
| Triggers             | Always-on right-click + hardcoded hotkey | Toggleable per-trigger config + imperative ref |
| Geometry             | Hardcoded constants                     | Full geometry props (radii, gap, icon size, start angle, direction) |
| Slice count          | 3–12 hard-clamped                       | Min 3 enforced, soft upper bound + dev warning |
| Hover detection      | Angle-based                             | Same                                         |
| Animations           | One spring preset                       | 5 presets (`spring`, `fade`, `pop`, `stagger`, `iris`) + custom `{ open, close }` GSAP timeline |
| Top-level callback   | None                                    | `onSelect(item, index, event)` for analytics |

---

## 3. Public API

### 3.1 Props

```ts
interface RadialDockProps {
  // ────────────────────────── ITEMS ──────────────────────────
  items: RadialDockItem[];                  // required; min 3, soft-warn >12 at small radius

  // ──────────────────────── TRIGGERS ─────────────────────────
  triggers?: {
    rightClick?: boolean | { ignoreSelectors?: string[] };
    // true (default), or false to disable, or object to ignore extra selectors
    // (default ignores: input, textarea, [contenteditable])
    hotkey?: string | false;
    // mousetrap-style ('mod+e', 'shift+space', 'mod+shift+k'); false to disable
    // 'mod' resolves to Cmd on Mac, Ctrl elsewhere
  };

  // ─────────────────── CONTROLLED / UNCONTROLLED ─────────────
  open?: boolean;                           // controlled
  onOpenChange?: (open: boolean) => void;   // pairs with `open`; also fires in uncontrolled mode
  defaultOpen?: boolean;                    // uncontrolled initial state, default false
  position?: { x: number; y: number };      // optional explicit position; if omitted, derived from triggers/cursor

  // ──────────────────────── CALLBACKS ────────────────────────
  onSelect?: (item: RadialDockItem, index: number, event: React.MouseEvent | KeyboardEvent) => void;

  // ──────────────────────── GEOMETRY ─────────────────────────
  outerRadius?: number;                     // default 110, min 60
  innerRadius?: number;                     // default 55; must be ≤ outerRadius - 20
  sliceGap?: number;                        // default 2 (px, projected onto arc)
  iconSize?: number;                        // default 32
  iconRadius?: number | 'auto';             // default 'auto' = (outer + inner) / 2
  startAngle?: number;                      // default 0 (degrees, 0 = top, 90 = right)
  direction?: 'clockwise' | 'counter-clockwise'; // default 'clockwise'

  // ────────────────────────── STYLING ────────────────────────
  theme?: Partial<RadialDockTheme>;         // CSS-variable injection per instance
  classNames?: Partial<RadialDockClassNames>; // structural class overrides

  // ───────────────────────── ANIMATION ───────────────────────
  animation?: RadialDockAnimation;          // 'spring' | 'fade' | 'pop' | 'stagger' | 'iris' | { open, close }
  reducedMotion?: 'auto' | 'always' | 'never'; // default 'auto' — respects `prefers-reduced-motion`
  // 'always' = always use reduced fallback; 'never' = ignore media query, always full animation

  // ─────────────────────────── PORTAL ────────────────────────
  portalContainer?: HTMLElement | null;     // default document.body; null = render in place
  zIndex?: number;                          // default 9999

  // ─────────────────────────── A11Y ──────────────────────────
  ariaLabel?: string;                       // default 'Quick actions' — applied to role="menu" container
}
```

### 3.2 Item shape

```ts
interface RadialDockItem {
  id: string;                               // stable React key
  onSelect: () => void;                     // fires on click/Enter
  icon?: ReactNode;                         // default rendering
  label?: string;                           // optional text below icon
  render?: (state: { hovered: boolean; index: number }) => ReactNode;
  // full custom render replaces the entire slice content (icon + label).
  // receives hover state so consumer can drive their own animations.
  disabled?: boolean;                       // dimmed, not selectable
}
```

### 3.3 Theme & classNames

```ts
interface RadialDockTheme {
  bg: string;                               // background color of donut
  bgBlur: string;                           // backdrop-filter blur amount, e.g. '20px'
  sliceFill: string;                        // resting slice fill (transparent by default)
  sliceFillHover: string;                   // hovered slice fill
  sliceFillActive: string;                  // pressed slice fill
  sliceFillDisabled: string;                // disabled slice fill
  iconColor: string;                        // icon color (resting)
  iconColorHover: string;                   // icon color when its slice is hovered
  labelColor: string;                       // label text color
  shadow: string;                           // CSS box/drop shadow
  ringStroke: string;                       // optional outer/inner ring stroke (default 'transparent')
  ringStrokeWidth: string;                  // default '0'
}

interface RadialDockClassNames {
  overlay: string;                          // full-viewport portal root
  container: string;                        // donut wrapper
  disk: string;                             // blurred backdrop disk
  svg: string;                              // SVG element holding paths
  slice: string;                            // each <path>
  sliceHovered: string;                     // applied to hovered <path>
  sliceDisabled: string;                    // applied to disabled <path>
  icon: string;                             // each icon container <div>
  iconHovered: string;                      // applied to hovered icon <div>
  label: string;                            // each label <span>
}
```

### 3.4 Animation type

```ts
type RadialDockAnimationName = 'spring' | 'fade' | 'pop' | 'stagger' | 'iris';

interface RadialDockAnimationCustom {
  open(timeline: gsap.core.Timeline, ctx: RadialDockAnimationContext): void;
  close(timeline: gsap.core.Timeline, ctx: RadialDockAnimationContext): void;
}

interface RadialDockAnimationContext {
  container: HTMLElement;
  disk: HTMLElement;
  svg: SVGSVGElement;
  slices: SVGPathElement[];
  icons: HTMLElement[];
  n: number;
  sliceSize: number;                        // radians
  outerRadius: number;
  innerRadius: number;
  centerX: number;                          // local SVG center
  centerY: number;
}

type RadialDockAnimation = RadialDockAnimationName | RadialDockAnimationCustom;
```

### 3.5 Imperative handle

```ts
interface RadialDockHandle {
  open(x?: number, y?: number): void;       // omit x/y → uses last-known cursor / viewport center
  close(): void;
  toggle(x?: number, y?: number): void;
  isOpen(): boolean;
}

const ref = useRef<RadialDockHandle>(null);
<RadialDock ref={ref} items={items} />
```

### 3.6 Public exports

```ts
// index.ts (barrel)
export { default } from './RadialDock';
export type {
  RadialDockProps,
  RadialDockItem,
  RadialDockTheme,
  RadialDockClassNames,
  RadialDockAnimation,
  RadialDockAnimationCustom,
  RadialDockAnimationContext,
  RadialDockHandle,
} from './types';

// react-radial-dock/presets — for users authoring custom presets
export { spring, fade, pop, stagger, iris } from './presets';

// react-radial-dock/styles.css — required default styles
```

`package.json` exports map:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    },
    "./styles.css": "./dist/styles.css",
    "./presets": {
      "types": "./dist/presets.d.ts",
      "import": "./dist/presets.mjs",
      "require": "./dist/presets.cjs"
    }
  }
}
```

---

## 4. Architecture & Data Flow

### 4.1 Component tree

```
<RadialDock>                     ← outer component, always mounted
  ├ useMounted()                 ← SSR guard via useSyncExternalStore
  ├ useControllableState()       ← merges open/onOpenChange/defaultOpen
  ├ useTriggers()                ← right-click, hotkey, cursor tracking; calls setOpen
  ├ useImperativeHandle(ref)     ← exposes open/close/toggle
  └ ReactDOM.createPortal(
      {isOpen && <RadialDockOverlay … />},  // gated by useExitTransition for close anim
      portalContainer
    )

<RadialDockOverlay>              ← mounted only while open (own state lifecycle)
  ├ useState hoveredIndex
  ├ useGsapTimeline(animation)   ← creates timeline on mount; cleanup on unmount
  ├ useEffect keydown handler    ← arrow/Tab/Enter/Esc
  ├ <div role=presentation overlay onMouseMove onClick>
      └ <div role=menu container ref={containerRef}>
          ├ <div className=disk ref={diskRef} />
          ├ <svg ref={svgRef} aria-hidden>
          │   {paths.map(...)}     ← each <path ref> registered into ctx
          ├ {items.map(item =>
              <div className=icon ref={iconRef}>
                {item.render?.(state) ?? (
                  <>{item.icon}{item.label && <span className=label>{item.label}</span>}</>
                )}
              </div>
          ))}
```

We do not use `motion/react` (it was the in-app implementation). For the package, `AnimatePresence`-style mount-on-open / unmount-after-close is implemented manually via a small `useExitTransition` hook that delays unmount until the close timeline completes.

### 4.2 State machine

```
            (rightClick / hotkey / ref.open() / open prop true)
                              ↓
      ┌───────── CLOSED ─────────────────┐
      │                                  │
      │                                  ▼
      │                            OPENING (timeline)
      │                                  │
      │   (Esc / outside-click /         ▼
      │    slice-click / open=false)  OPEN
      │                                  │
      │                                  ▼
      └───────────────────────────── CLOSING (timeline reverse)
                                         │
                                         ▼
                                       CLOSED
```

Re-trigger while OPEN → `setPosition(newPos)` only; no remount, no re-animation. Position prop change while OPEN → same.

### 4.3 Geometry (degrees external, radians internal)

```ts
// All angles in radians internally. Slice 0 centered at startAngleRad.
const sliceSize = (2 * Math.PI) / n;
const dirSign = direction === 'clockwise' ? 1 : -1;

// Slice i centered at:
const sliceCenterAngle = startAngleRad + dirSign * i * sliceSize;

// Slice i wedge spans (radians):
const sliceStart = sliceCenterAngle - sliceSize / 2 + gapRad / 2;
const sliceEnd   = sliceCenterAngle + sliceSize / 2 - gapRad / 2;

// gapRad: chord-of-2px-on-the-mid-radius
// gapRad ≈ sliceGap / iconRadius   (small-angle approx)
```

`angleToIndex(cursorX, cursorY, cx, cy, n, startAngleRad, dirSign)` resolves which slice the cursor falls in.

### 4.4 Position resolution

When opening:
1. If `position` prop is provided → use it
2. Else if triggered by right-click → `e.clientX, e.clientY`
3. Else if triggered by hotkey/ref → last-known cursor (tracked via `mousemove` listener)
4. Else (no cursor data) → viewport center

After resolution, clamp to `[outerRadius+8, innerWidth - outerRadius - 8] × [outerRadius+8, innerHeight - outerRadius - 8]`.

### 4.5 Trigger orchestration (`useTriggers`)

```ts
useTriggers({
  rightClick,           // false | true | { ignoreSelectors }
  hotkey,               // false | string
  enabled,              // boolean — disabled if items.length < 3
  onTrigger,            // (x?, y?) => void  — calls setOpen(true) + setPosition
  onClose,              // ()      => void  — Esc handler
});
```

Listener attachment matrix:
- `rightClick !== false` → attach `contextmenu` listener with default + custom selector ignore
- `hotkey !== false` → attach `keydown` for hotkey match
- always → attach `mousemove` for last-known cursor (cheap, passive)
- always → attach `keydown` for `Escape`

Listeners attached at `window` level. SSR-guarded.

### 4.6 GSAP timeline

`useGsapTimeline(animation, ctx, isOpen)`:

```ts
const tlRef = useRef<gsap.core.Timeline | null>(null);

useLayoutEffect(() => {
  // Build animation context once refs are populated
  const ctx = buildContext({ containerRef, diskRef, svgRef, sliceRefs, iconRefs, ... });

  // Resolve preset
  const preset = typeof animation === 'string' ? presets[animation] : animation;

  // Create timeline, paused
  const tl = gsap.timeline({ paused: true });
  preset.open(tl, ctx);
  tlRef.current = tl;

  return () => tl.kill();
}, [animation /* refs are stable post-layout */]);

useEffect(() => {
  const tl = tlRef.current;
  if (!tl) return;
  if (isOpen) {
    tl.play(0);
  } else {
    const closeTl = gsap.timeline();
    preset.close(closeTl, ctx);
    closeTl.eventCallback('onComplete', () => onCloseAnimationDone());
  }
}, [isOpen]);
```

With `prefers-reduced-motion` (or explicit `reducedMotion={true}`), all presets fall back to `gsap.set` (instant) + a 0.08s opacity cross-fade.

---

## 5. Animation Presets

Each preset is a small module exporting `{ open, close }` of type `RadialDockAnimationCustom`. They share GSAP via peer dep.

### 5.1 `spring` (default)
- Bg disk: `scale: 0.7 → 1, opacity: 0 → 1` over 0.2s, `ease: 'power3.out'`
- Icons: `scale: 0 → 1, x/y: from center → final position` over 0.22s, `ease: 'back.out(1.4)'`, no stagger
- Close: reverses, 0.12s

### 5.2 `fade`
- Bg disk: `opacity: 0 → 1` over 0.15s
- Icons: `opacity: 0 → 1` over 0.18s, no scale, no translate
- Close: 0.1s

### 5.3 `pop`
- Bg disk: `scale: 0.5 → 1.05 → 1` over 0.25s, `ease: 'elastic.out(0.6, 0.5)'`
- Icons: `scale: 0 → 1.1 → 1` over 0.22s, no translate, `ease: 'back.out(2)'`
- Close: 0.12s, scale to 0

### 5.4 `stagger`
- Bg disk: `scale: 0.7 → 1, opacity: 0 → 1` over 0.18s
- Icons: `scale: 0 → 1, x/y: from center → final` with `stagger: 0.04`
- Close: stagger reverse 0.02s

### 5.5 `iris`
- Bg disk: `clip-path: circle(0% at center) → circle(150% at center)` over 0.3s, `ease: 'expo.out'`
- Icons: `opacity: 0 → 1, scale: 0.8 → 1` with delay 0.15s
- Close: clip-path closes over 0.18s

### 5.6 Authoring custom presets

```tsx
import RadialDock, { type RadialDockAnimationCustom } from 'react-radial-dock';
import gsap from 'gsap';

const flipIn: RadialDockAnimationCustom = {
  open: (tl, ctx) => {
    tl.fromTo(ctx.container, { rotateY: 90, opacity: 0 }, { rotateY: 0, opacity: 1, duration: 0.3, ease: 'power3.out' })
      .fromTo(ctx.icons, { scale: 0 }, { scale: 1, duration: 0.2, stagger: 0.03 }, '-=0.1');
  },
  close: (tl, ctx) => {
    tl.to(ctx.container, { rotateY: -90, opacity: 0, duration: 0.18, ease: 'power3.in' });
  },
};

<RadialDock animation={flipIn} … />;
```

---

## 6. Styling & Theming

### 6.1 `styles.css` (shipped)

```css
:root {
  /* Public — overridable */
  --rrd-bg: rgba(20, 20, 20, 0.55);
  --rrd-bg-blur: 20px;
  --rrd-slice-fill: transparent;
  --rrd-slice-fill-hover: #1E73FF;
  --rrd-slice-fill-active: rgba(0, 0, 0, 0.7);
  --rrd-slice-fill-disabled: rgba(255, 255, 255, 0.05);
  --rrd-icon-color: #fff;
  --rrd-icon-color-hover: #fff;
  --rrd-label-color: rgba(255, 255, 255, 0.85);
  --rrd-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  --rrd-ring-stroke: transparent;
  --rrd-ring-stroke-width: 0;
}

.rrd-overlay { position: fixed; inset: 0; background: transparent; }
.rrd-container { position: absolute; pointer-events: none; filter: drop-shadow(var(--rrd-shadow)); }
.rrd-disk {
  position: absolute;
  border-radius: 50%;
  background: var(--rrd-bg);
  backdrop-filter: blur(var(--rrd-bg-blur));
  -webkit-backdrop-filter: blur(var(--rrd-bg-blur));
  -webkit-mask: radial-gradient(circle, transparent var(--rrd-inner-radius), #000 var(--rrd-inner-radius));
  mask: radial-gradient(circle, transparent var(--rrd-inner-radius), #000 var(--rrd-inner-radius));
}
.rrd-svg { position: absolute; inset: 0; pointer-events: none; overflow: visible; }
.rrd-slice {
  fill: var(--rrd-slice-fill);
  pointer-events: all;
  cursor: pointer;
  transition: fill 120ms ease;
}
.rrd-slice--hovered { fill: var(--rrd-slice-fill-hover); }
.rrd-slice--disabled { fill: var(--rrd-slice-fill-disabled); cursor: not-allowed; pointer-events: none; }
.rrd-slice:active { fill: var(--rrd-slice-fill-active); }

.rrd-icon {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  pointer-events: none;
  color: var(--rrd-icon-color);
  width: var(--rrd-icon-size);
  height: var(--rrd-icon-size);
}
.rrd-icon--hovered { color: var(--rrd-icon-color-hover); }
.rrd-label { color: var(--rrd-label-color); font: 11px/1.2 inherit; text-align: center; }

@supports not (backdrop-filter: blur(1px)) {
  .rrd-disk { background: rgba(20, 20, 20, 0.85); }
}
```

### 6.2 `theme` prop

Maps cleanly onto CSS variables, injected as inline style on the overlay container:

```tsx
<RadialDock theme={{ sliceFillHover: '#FF4D4F', shadow: '0 12px 40px rgba(255,77,79,0.4)' }} />
```

Internal mapping:

```ts
const themeStyle = {
  '--rrd-slice-fill-hover': theme?.sliceFillHover,
  '--rrd-shadow': theme?.shadow,
  // ...etc.
};
```

### 6.3 `classNames` prop

Each structural element receives a default class (`rrd-overlay`, `rrd-container`, etc.) AND any extra class from `classNames.<part>`. Consumers can either fully replace styles by writing their own CSS targeting the override classes, or just augment.

```tsx
<RadialDock
  classNames={{
    container: 'my-radial-glow',
    sliceHovered: 'my-hover-glow',
  }}
/>
```

---

## 7. Accessibility

| Concern              | Implementation                                                                |
| -------------------- | ----------------------------------------------------------------------------- |
| Container role       | `role="menu"` + `aria-label="Quick actions"` (label customizable via prop)    |
| Active descendant    | `aria-activedescendant={hoveredIndex >= 0 ? \`rrd-${id}-item-${hoveredIndex}\` : undefined}` |
| Item announcement    | Hidden `<span role="menuitem" id="rrd-${id}-item-${i}">{label}</span>` per slice |
| Decorative paths     | `<path aria-hidden>` — purely visual                                          |
| Decorative icons     | Icon `<div aria-hidden>` — label is the screen-reader name                    |
| Focus management     | On open: focus the container; on close: restore focus to previous element     |
| Focus trap           | Tab/Shift+Tab cycles slices (custom keyboard handler), Esc closes             |
| Reduced motion       | `prefers-reduced-motion: reduce` → instant fade fallback                      |
| Disabled items       | `aria-disabled="true"` + skipped in keyboard cycle + `pointer-events: none`   |

---

## 8. Edge Cases & Error Handling

| Case | Behavior |
|------|----------|
| `items.length < 3` | Component renders nothing; warns once in dev |
| `items.length > 12` and `outerRadius < 140` | Renders, dev-warn about cramped layout |
| `innerRadius > outerRadius - 20` | Throws in dev, falls back to safe values in prod |
| `position` outside viewport | Clamped to viewport with padding = outerRadius + 8 |
| Re-trigger while open | Update position only, no remount |
| Multiple instances both with `triggers.rightClick: true` | Both open on right-click; dev-warn on mount if 2+ detected |
| `portalContainer={null}` | Renders inline (no portal) — useful inside Storybook/CSS isolation |
| `disabled` item clicked or Enter | No-op, focus stays |
| Hotkey conflict (e.g. `mod+r`) | Dev warning printed; binding still applied |
| Hotkey malformed | Dev warning printed; hotkey trigger disabled (treated as `false`) |
| GSAP not installed (peer dep missing) | Throws on first open with clear error message |
| `prefers-reduced-motion` | All presets degrade to 0.08s cross-fade |
| Right-click target inside ignored selector | Native browser context menu shown; dock does not open |
| SSR | Component returns `null` on server; mounts on client via `useSyncExternalStore` |

---

## 9. File Layout

```
react-radial-dock/
├── src/
│   ├── index.ts                  # public barrel
│   ├── RadialDock.tsx            # main component (use client directive at top)
│   ├── RadialDockOverlay.tsx     # mounted-on-open inner content
│   ├── geometry.ts               # arcPath, polarToCartesian, angleToIndex, degToRad, clampPosition
│   ├── hooks/
│   │   ├── useControllableState.ts   # controlled/uncontrolled merge
│   │   ├── useTriggers.ts            # right-click + hotkey + cursor + Esc listeners
│   │   ├── useCursor.ts              # last-known cursor ref
│   │   ├── useGsapTimeline.ts        # builds + drives GSAP timeline
│   │   ├── useExitTransition.ts      # delays unmount until close animation finishes
│   │   ├── useMounted.ts             # SSR guard via useSyncExternalStore
│   │   └── useReducedMotion.ts       # prefers-reduced-motion media query
│   ├── presets/
│   │   ├── index.ts                  # registry { spring, fade, pop, stagger, iris }
│   │   ├── spring.ts
│   │   ├── fade.ts
│   │   ├── pop.ts
│   │   ├── stagger.ts
│   │   └── iris.ts
│   ├── hotkey.ts                     # matchesHotkey, isDangerous, parseHotkey
│   ├── types.ts                      # all public TS types
│   └── styles.css                    # CSS variables + base classes
├── examples/
│   ├── basic.md                      # right-click-only quickstart
│   ├── controlled.md                 # show/setShow pattern
│   ├── custom-render.md              # render={({hovered}) => …}
│   ├── theming.md                    # theme + classNames
│   ├── animations.md                 # all 5 presets + custom
│   └── nextjs-app/                   # tiny Next.js app (one route) for live verification
├── tests/
│   ├── geometry.test.ts
│   ├── hotkey.test.ts
│   ├── RadialDock.test.tsx           # RTL: render, hover, select, controlled
│   ├── triggers.test.tsx             # right-click + hotkey behavior
│   ├── presets.test.ts               # GSAP timeline shape verification (mocked GSAP)
│   └── e2e/
│       └── happy-path.spec.ts        # Playwright: open → hover → click → close
├── tsup.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── README.md
├── CHANGELOG.md
├── LICENSE                           # MIT
└── .changeset/
    └── config.json
```

---

## 10. `package.json` Skeleton

```json
{
  "name": "react-radial-dock",
  "version": "0.0.0",
  "description": "Customizable, GSAP-animated radial action dock for React.",
  "license": "MIT",
  "author": "Rupam Shil",
  "type": "module",
  "sideEffects": ["**/*.css"],
  "files": ["dist", "README.md", "LICENSE"],
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    },
    "./styles.css": "./dist/styles.css",
    "./presets": {
      "types": "./dist/presets.d.ts",
      "import": "./dist/presets.mjs",
      "require": "./dist/presets.cjs"
    }
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "lint": "eslint src",
    "typecheck": "tsc --noEmit",
    "release": "changeset publish"
  },
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18",
    "gsap": ">=3.12"
  },
  "devDependencies": {
    "@changesets/cli": "^2",
    "@playwright/test": "^1",
    "@testing-library/jest-dom": "^6",
    "@testing-library/react": "^16",
    "@types/react": "^18 || ^19",
    "@types/react-dom": "^18 || ^19",
    "eslint": "^9",
    "gsap": "^3.12",
    "jsdom": "^24",
    "react": "^19",
    "react-dom": "^19",
    "tsup": "^8",
    "typescript": "^5",
    "vitest": "^2"
  },
  "keywords": ["react", "radial", "menu", "dock", "context-menu", "gsap", "animation"],
  "repository": "github:rupamshil/react-radial-dock"
}
```

---

## 11. `tsup.config.ts` Skeleton

```ts
import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: { index: 'src/index.ts', presets: 'src/presets/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    sourcemap: false,
    minify: false,
    treeshake: true,
    external: ['react', 'react-dom', 'gsap'],
    banner: { js: "'use client';" },     // ensures Next.js App Router compatibility
  },
  {
    entry: ['src/styles.css'],
    outDir: 'dist',
    format: ['esm'],
    clean: false,
    loader: { '.css': 'copy' },
  },
]);
```

---

## 12. Testing Strategy

### 12.1 Unit (Vitest)
- `geometry.test.ts` — arcPath snapshot at known angles; angleToIndex across all 4 quadrants for n=3,4,6,12; gap calculations; clamp logic at viewport corners.
- `hotkey.test.ts` — `mod` resolution on Mac vs non-Mac (mock navigator.platform); modifier matching; case-insensitivity; malformed inputs.

### 12.2 Integration (RTL)
- Renders nothing when `items.length < 3`.
- Right-click anywhere opens; right-click inside `<input>` does NOT open.
- Controlled mode round-trip: `open={true}` → visible; `open={false}` → not visible; `onOpenChange` fires with right value.
- Hover via mousemove updates `aria-activedescendant`.
- Click on slice fires `item.onSelect` and top-level `onSelect` (in that order).
- Disabled item: click is no-op; keyboard skips it.
- Custom `render({ hovered, index })` receives current hover state.
- ArrowRight / ArrowLeft / Tab cycle correctly; Enter selects; Esc closes.
- Custom `theme` injects CSS variables on container.
- Custom `classNames` merge with defaults (don't replace).

### 12.3 Animation tests
- Mock `gsap` to record timeline calls; assert each preset registers expected tweens (number of tweens, targets, durations within tolerance).
- `prefers-reduced-motion` mock → assert presets short-circuit to fade.

### 12.4 E2E (Playwright)
- Single happy-path spec on the `examples/nextjs-app` build:
  - Right-click → dock visible
  - Hover slice → it gains hover class
  - Click slice → callback fires (via window event), dock closes
  - Hotkey opens at last cursor
  - Esc closes

---

## 13. Versioning, Release, & Branching

- **Versioning**: SemVer via Changesets.
  - v0.x — pre-1.0, breaking changes allowed in minor.
  - v1.0 — API freeze; breaking changes only in major.
- **Branches**: `main` (releases), feature branches via PR. No long-lived dev branch.
- **CI**: GitHub Actions
  - PR: typecheck + lint + unit + e2e (chromium only) + build
  - main push w/ changeset: version PR or publish on tag
- **Changelog**: auto-generated by changesets per release.

---

## 14. Roadmap

### v0.1 (initial release)
Everything in this spec.

### v0.2 — Quality of life
- `<RadialDockProvider>` for cross-instance theming via React Context (opt-in).
- `triggers.longPress?: { duration?: number }` — touch/mobile gesture.
- `submenu` support — second-level radial slices.

### v0.3 — Author tools
- `@react-radial-dock/preset-builder` companion package — visual preset playground.
- Storybook 8 catalog.

### v1.0
- API freeze + mature browser/RN-Web compatibility matrix.

---

## 15. Open Questions / Deferred Decisions

- **iOS Safari `backdrop-filter`** — works on 14+ but flaky inside SVG masks. Documented fallback: solid `--rrd-bg` if `backdrop-filter` unsupported (`@supports not (backdrop-filter: blur(1px))`).
- **GSAP license** — GSAP is free for non-commercial; commercial users may need Club GreenSock. Document this, and consider a `motion`-based variant as a sibling package later (`@react-radial-dock/motion-driver`).
- **React Native** — out of scope for v1; revisit with `react-native-svg` + reanimated.
- **Bundle size budget** — target: < 8 KB min+gzip for the component (excluding GSAP/CSS). Track in CI with `size-limit`.

---

## 16. Definition of Done (v0.1)

- [ ] All public APIs implemented per Sections 3 and 4.
- [ ] All 5 animation presets shipped + custom-preset escape hatch verified.
- [ ] CSS file ships and is documented as required import.
- [ ] All tests in Section 12 passing in CI.
- [ ] README covers: install, basic usage, controlled mode, theming, custom render, custom animation, accessibility notes.
- [ ] `examples/nextjs-app` runs locally with `pnpm dev`, demonstrates each major feature.
- [ ] Changesets initialized, first changeset committed, GH Actions workflow in place.
- [ ] Published to npm under `react-radial-dock@0.1.0`.

---

## Appendix A — Migration from `mark7/components/quick-action/radial-quick-action`

For future code that wants to swap the in-app version for the package:

```diff
-import RadialMenu, { type RadialMenuItem } from '@/components/quick-action/radial-quick-action';
+import RadialDock, { type RadialDockItem } from 'react-radial-dock';
+import 'react-radial-dock/styles.css';

-<RadialMenu items={items} hotkey="mod+e" />
+<RadialDock
+  items={items}
+  triggers={{ hotkey: 'mod+e' }}
+  theme={{ sliceFillHover: 'var(--Color-Cores-Blue-Base)' }}
+/>
```

`RadialMenuItem` → `RadialDockItem` is drop-in compatible (same `id` / `icon` / `label` / `onSelect`).

Hotkey persistence (was hardcoded to localStorage in the in-app version) becomes the consumer's responsibility:

```tsx
const [hotkey, setHotkey] = useState(
  () => localStorage.getItem('app.dock.hotkey') ?? 'mod+e'
);
useEffect(() => { localStorage.setItem('app.dock.hotkey', hotkey); }, [hotkey]);

<RadialDock items={items} triggers={{ hotkey }} />
```

---

*End of brainstorming spec. Ready for /writing-plans once approved.*
