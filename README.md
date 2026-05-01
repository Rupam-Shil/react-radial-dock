# react-radial-dock

[![npm](https://img.shields.io/npm/v/react-radial-dock)](https://www.npmjs.com/package/react-radial-dock)
[![MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

A customizable, GSAP-animated radial action dock (donut-shaped quick-action menu) for React. Drop-in for Next.js App Router, Vite, and CRA. Bring your own icons.

**[Demo](https://react-radial-dock.vercel.app) · [npm](https://www.npmjs.com/package/react-radial-dock) · [GitHub](https://github.com/Rupam-Shil/react-radial-dock)**

## Install

```bash
npm i react-radial-dock gsap
```

`gsap` is a peer dependency. Then import the CSS once at the root of your app:

```ts
import 'react-radial-dock/styles.css';
```

## Quick start

```tsx
'use client';
import RadialDock from 'react-radial-dock';
import 'react-radial-dock/styles.css';

const items = [
  { id: 'a', label: 'Star', icon: '⭐', onSelect: () => console.log('star') },
  { id: 'b', label: 'Mark', icon: '🔖', onSelect: () => console.log('mark') },
  { id: 'c', label: 'Pin',  icon: '📍', onSelect: () => console.log('pin') },
];

export default function Page() {
  return <RadialDock items={items} />;
}
```

Right-click anywhere on the page to open. Press `Esc` to close.

## Triggers

```tsx
<RadialDock items={items} triggers={{ rightClick: true, hotkey: 'mod+e' }} />
```

- `rightClick`: `true` (default) | `false` | `{ ignoreSelectors: string[] }`
- `hotkey`: e.g. `'mod+e'` (Cmd on Mac, Ctrl elsewhere), `'shift+space'`, `false`

## Controlled mode

```tsx
const [open, setOpen] = useState(false);
<RadialDock items={items} open={open} onOpenChange={setOpen} position={{ x: 400, y: 300 }} />;
```

## Imperative handle

```tsx
const ref = useRef<RadialDockHandle>(null);
ref.current?.open(100, 200);
ref.current?.close();
ref.current?.toggle();
```

## Theming

CSS variables (e.g. `--rrd-slice-fill-hover`, `--rrd-shadow`) drive the look. Override per instance with the `theme` prop or globally with CSS:

```tsx
<RadialDock theme={{ sliceFillHover: '#FF4D4F', shadow: '0 12px 40px rgba(255,77,79,0.4)' }} />
```

```css
.my-app { --rrd-slice-fill-hover: var(--brand-blue); }
```

## Custom render per slice

```tsx
{
  id: 'star',
  onSelect: () => {},
  render: ({ hovered }) => <div style={{ transform: hovered ? 'scale(1.2)' : 'scale(1)' }}>⭐</div>,
}
```

## Animations

Built-in: `spring` (default), `fade`, `pop`, `stagger`, `iris`. Or pass a custom `{ open, close }`:

```tsx
import gsap from 'gsap';

const flip = {
  open:  (tl, ctx) => tl.fromTo(ctx.container, { rotateY: 90, opacity: 0 }, { rotateY: 0, opacity: 1, duration: .3 }),
  close: (tl, ctx) => tl.to(ctx.container, { opacity: 0, duration: .18 }),
};
<RadialDock items={items} animation={flip} />
```

## Geometry

| Prop          | Default | Notes                               |
| ------------- | ------- | ----------------------------------- |
| `outerRadius` | 110     | min 60                              |
| `innerRadius` | 55      | must be ≤ outerRadius − 20          |
| `iconRadius`  | `'auto'` | resolves to `(outer + inner) / 2`  |
| `iconSize`    | 32      |                                     |
| `sliceGap`    | 2       | px on the icon-radius arc           |
| `startAngle`  | 0       | degrees, 0 = top                    |
| `direction`   | `'clockwise'` |                               |

## Accessibility

- `role="menu"` with `aria-label` (default `"Quick actions"`).
- Hidden `<span role="menuitem">` per slice, indexed via `aria-activedescendant`.
- Keyboard: `ArrowLeft` / `ArrowRight` / `Tab` / `Shift+Tab` cycle slices, `Enter` selects, `Esc` closes.
- Disabled items: `aria-disabled`, skipped in cycle.
- Respects `prefers-reduced-motion: reduce` (override with `reducedMotion="never"`).

## Browser support

- Chrome, Edge, Safari ≥ 14, Firefox ≥ latest, Safari iOS 14+.
- `backdrop-filter` falls back to a solid disk on older browsers.

## License

MIT © Rupam Shil
