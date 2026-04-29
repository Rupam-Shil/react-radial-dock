// src/presets/iris.ts
import type { RadialDockAnimationCustom } from '../types';

export const iris: RadialDockAnimationCustom = {
  open: (tl, ctx) => {
    tl.fromTo(
      ctx.disk,
      { clipPath: 'circle(0% at center)', opacity: 1 },
      { clipPath: 'circle(150% at center)', duration: 0.3, ease: 'expo.out' },
      0,
    ).fromTo(
      ctx.icons,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.18, ease: 'power2.out' },
      0.15,
    );
  },
  close: (tl, ctx) => {
    tl.to(ctx.icons, { opacity: 0, scale: 0.8, duration: 0.1 }, 0).to(
      ctx.disk,
      { clipPath: 'circle(0% at center)', duration: 0.18, ease: 'expo.in' },
      0,
    );
  },
};
