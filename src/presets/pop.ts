// src/presets/pop.ts
import type { RadialDockAnimationCustom } from '../types';

export const pop: RadialDockAnimationCustom = {
  open: (tl, ctx) => {
    tl.fromTo(
      ctx.disk,
      { scale: 0.5, opacity: 0, transformOrigin: 'center center' },
      { scale: 1, opacity: 1, duration: 0.25, ease: 'elastic.out(0.6, 0.5)' },
      0,
    ).fromTo(
      ctx.icons,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.22, ease: 'back.out(2)' },
      0,
    );
  },
  close: (tl, ctx) => {
    tl.to(ctx.icons, { scale: 0, opacity: 0, duration: 0.12, ease: 'power2.in' }, 0).to(
      ctx.disk,
      { scale: 0.5, opacity: 0, duration: 0.12 },
      0,
    );
  },
};
