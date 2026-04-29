import { useEffect, useRef } from 'react';
import { presets } from '../presets';
import type {
  GsapTimelineLike,
  RadialDockAnimation,
  RadialDockAnimationContext,
  RadialDockAnimationCustom,
} from '../types';

export interface UseGsapTimelineOptions {
  ctx: RadialDockAnimationContext | null;
  animation: RadialDockAnimation;
  isOpen: boolean;
  reducedMotion: boolean;
  onClosed: () => void;
  /** Inject gsap (real or mock). Falsy → bail out. */
  gsap: { timeline: (vars?: Record<string, unknown>) => GsapTimelineLike } | null;
}

function resolvePreset(animation: RadialDockAnimation): RadialDockAnimationCustom {
  if (typeof animation === 'string') return presets[animation];
  return animation;
}

const REDUCED: RadialDockAnimationCustom = {
  open: (tl, ctx) => {
    tl.fromTo(ctx.disk, { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0).fromTo(
      ctx.icons,
      { opacity: 0 },
      { opacity: 1, duration: 0.08 },
      0,
    );
  },
  close: (tl, ctx) => {
    tl.to(ctx.icons, { opacity: 0, duration: 0.08 }, 0).to(
      ctx.disk,
      { opacity: 0, duration: 0.08 },
      0,
    );
  },
};

export function useGsapTimeline({
  ctx,
  animation,
  isOpen,
  reducedMotion,
  onClosed,
  gsap,
}: UseGsapTimelineOptions): void {
  const openTlRef = useRef<GsapTimelineLike | null>(null);
  const closeTlRef = useRef<GsapTimelineLike | null>(null);
  const onClosedRef = useRef(onClosed);
  onClosedRef.current = onClosed;

  // Build open timeline once we have ctx + gsap.
  useEffect(() => {
    if (!ctx || !gsap) return;
    const preset = reducedMotion ? REDUCED : resolvePreset(animation);
    const tl = gsap.timeline({ paused: true });
    preset.open(tl, ctx);
    openTlRef.current = tl;
    return () => {
      tl.kill();
      openTlRef.current = null;
    };
  }, [ctx, animation, reducedMotion, gsap]);

  // Drive open / close.
  useEffect(() => {
    if (!ctx || !gsap) return;
    if (isOpen) {
      openTlRef.current?.play(0);
      return;
    }
    // closing
    const preset = reducedMotion ? REDUCED : resolvePreset(animation);
    const closeTl = gsap.timeline();
    closeTlRef.current = closeTl;
    preset.close(closeTl, ctx);
    closeTl.eventCallback('onComplete', () => onClosedRef.current());
    return () => {
      closeTl.kill();
      closeTlRef.current = null;
    };
  }, [isOpen, ctx, animation, reducedMotion, gsap]);
}
