// src/presets/fade.ts
import type { RadialDockAnimationCustom } from '../types';

export const fade: RadialDockAnimationCustom = {
  open: (tl, ctx) => {
    tl.fromTo(ctx.disk, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: 'power1.out' }, 0)
      .fromTo(ctx.icons, { opacity: 0 }, { opacity: 1, duration: 0.18, ease: 'power1.out' }, 0);
  },
  close: (tl, ctx) => {
    tl.to(ctx.icons, { opacity: 0, duration: 0.1 }, 0).to(
      ctx.disk,
      { opacity: 0, duration: 0.1 },
      0,
    );
  },
};
