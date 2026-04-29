# Animations

```tsx
// One of: 'spring' (default) | 'fade' | 'pop' | 'stagger' | 'iris'
<RadialDock items={items} animation="iris" />
```

## Custom timeline

```tsx
import RadialDock, { type RadialDockAnimationCustom } from 'react-radial-dock';
import 'react-radial-dock/styles.css';

const flipIn: RadialDockAnimationCustom = {
  open: (tl, ctx) => {
    tl.fromTo(
      ctx.container,
      { rotateY: 90, opacity: 0 },
      { rotateY: 0, opacity: 1, duration: 0.3, ease: 'power3.out' },
    ).fromTo(
      ctx.icons,
      { scale: 0 },
      { scale: 1, duration: 0.2, stagger: 0.03 },
      '-=0.1',
    );
  },
  close: (tl, ctx) => {
    tl.to(ctx.container, { rotateY: -90, opacity: 0, duration: 0.18, ease: 'power3.in' });
  },
};

<RadialDock items={items} animation={flipIn} />;
```
