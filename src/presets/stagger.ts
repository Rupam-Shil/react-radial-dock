// src/presets/stagger.ts
import type { RadialDockAnimationCustom } from '../types';

export const stagger: RadialDockAnimationCustom = {
  open: (tl, ctx) => {
    tl.fromTo(
      ctx.disk,
      { scale: 0.7, opacity: 0, transformOrigin: 'center center' },
      { scale: 1, opacity: 1, duration: 0.18, ease: 'power3.out' },
      0,
    ).fromTo(
      ctx.icons,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.22, ease: 'back.out(1.4)', stagger: 0.04 },
      0.05,
    );
  },
  close: (tl, ctx) => {
    tl.to(
      ctx.icons,
      { scale: 0, opacity: 0, duration: 0.1, stagger: { each: 0.02, from: 'end' } },
      0,
    ).to(ctx.disk, { scale: 0.7, opacity: 0, duration: 0.12 }, 0.05);
  },
};
