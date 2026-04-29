// src/presets/spring.ts
import type { RadialDockAnimationCustom } from '../types';

export const spring: RadialDockAnimationCustom = {
  open: (tl, ctx) => {
    tl.fromTo(
      ctx.disk,
      { scale: 0.7, opacity: 0, transformOrigin: 'center center' },
      { scale: 1, opacity: 1, duration: 0.2, ease: 'power3.out' },
      0,
    ).fromTo(
      ctx.icons,
      { scale: 0, x: 0, y: 0, opacity: 0 },
      { scale: 1, x: 0, y: 0, opacity: 1, duration: 0.22, ease: 'back.out(1.4)' },
      0,
    );
  },
  close: (tl, ctx) => {
    tl.to(ctx.icons, { scale: 0, opacity: 0, duration: 0.12, ease: 'power2.in' }, 0).to(
      ctx.disk,
      { scale: 0.7, opacity: 0, duration: 0.12, ease: 'power2.in' },
      0,
    );
  },
};
