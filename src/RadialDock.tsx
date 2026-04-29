// src/RadialDock.tsx
'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { clampPosition } from './geometry';
import { useControllableState } from './hooks/useControllableState';
import { useExitTransition } from './hooks/useExitTransition';
import { useMounted } from './hooks/useMounted';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useTriggers } from './hooks/useTriggers';
import { loadGsap } from './gsap-loader';
import { RadialDockOverlay } from './RadialDockOverlay';
import type {
  GsapTimelineLike,
  RadialDockHandle,
  RadialDockProps,
  RadialDockResolvedGeometry,
} from './types';

const DEFAULTS = {
  outerRadius: 110,
  innerRadius: 55,
  sliceGap: 2,
  iconSize: 32,
  iconRadius: 'auto' as const,
  startAngle: 0,
  direction: 'clockwise' as const,
  zIndex: 9999,
  ariaLabel: 'Quick actions',
  reducedMotion: 'auto' as const,
  defaultOpen: false,
  triggers: { rightClick: true, hotkey: false as const },
  animation: 'spring' as const,
};

function resolveGeometry(props: RadialDockProps): RadialDockResolvedGeometry {
  const n = props.items.length;
  const outerRadius = Math.max(60, props.outerRadius ?? DEFAULTS.outerRadius);
  let innerRadius = props.innerRadius ?? DEFAULTS.innerRadius;
  if (innerRadius > outerRadius - 20) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[react-radial-dock] innerRadius (${innerRadius}) must be ≤ outerRadius - 20 (${outerRadius - 20}). Falling back.`,
      );
    }
    innerRadius = Math.max(0, outerRadius - 20);
  }
  const iconRadius =
    props.iconRadius == null || props.iconRadius === 'auto'
      ? (outerRadius + innerRadius) / 2
      : props.iconRadius;
  const startAngleRad = ((props.startAngle ?? DEFAULTS.startAngle) * Math.PI) / 180;
  const dirSign = (props.direction ?? DEFAULTS.direction) === 'clockwise' ? 1 : -1;
  return {
    n,
    outerRadius,
    innerRadius,
    iconRadius,
    iconSize: props.iconSize ?? DEFAULTS.iconSize,
    sliceGap: props.sliceGap ?? DEFAULTS.sliceGap,
    startAngleRad,
    dirSign,
    sliceSize: n > 0 ? (2 * Math.PI) / n : 0,
    centerX: 0,
    centerY: 0,
  };
}

export const RadialDock = forwardRef<RadialDockHandle, RadialDockProps>(function RadialDock(
  props,
  ref,
) {
  const {
    items,
    triggers = DEFAULTS.triggers,
    open: controlledOpen,
    onOpenChange,
    defaultOpen = DEFAULTS.defaultOpen,
    position: controlledPosition,
    onSelect,
    theme,
    classNames,
    animation = DEFAULTS.animation,
    reducedMotion: reducedMotionMode = DEFAULTS.reducedMotion,
    portalContainer,
    zIndex = DEFAULTS.zIndex,
    ariaLabel = DEFAULTS.ariaLabel,
  } = props;

  const mounted = useMounted();
  const reducedMotion = useReducedMotion(reducedMotionMode);
  const [isOpen, setIsOpen] = useControllableState<boolean>(
    controlledOpen,
    onOpenChange,
    defaultOpen,
  );
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    controlledPosition ?? null,
  );

  // Pull controlled position into state. When the consumer transitions from a
  // controlled position back to undefined, clear so the next trigger picks
  // a fresh position from the cursor instead of reusing the last controlled one.
  useEffect(() => {
    setPosition(controlledPosition ?? null);
  }, [controlledPosition?.x, controlledPosition?.y]);

  // Items-too-few guard.
  const enabled = items.length >= 3;
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && items.length > 0 && items.length < 3) {
      console.warn(
        `[react-radial-dock] items.length=${items.length}; minimum is 3. Component will not render.`,
      );
    }
  }, [items.length]);

  const geometry = useMemo(() => resolveGeometry(props), [
    items.length,
    props.outerRadius,
    props.innerRadius,
    props.iconRadius,
    props.iconSize,
    props.sliceGap,
    props.startAngle,
    props.direction,
  ]);

  const trigger = useCallback(
    (x?: number, y?: number) => {
      let pos: { x: number; y: number };
      if (controlledPosition) pos = controlledPosition;
      else if (typeof x === 'number' && typeof y === 'number') pos = { x, y };
      else pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      const clamped = clampPosition(
        pos,
        geometry.outerRadius,
        { width: window.innerWidth, height: window.innerHeight },
      );
      setPosition(clamped);
      setIsOpen(true);
    },
    [controlledPosition, geometry.outerRadius, setIsOpen],
  );
  const close = useCallback(() => setIsOpen(false), [setIsOpen]);

  useTriggers({
    rightClick: triggers.rightClick ?? true,
    hotkey: triggers.hotkey ?? false,
    enabled,
    onTrigger: trigger,
    onClose: close,
  });

  // Stable refs for imperative handle so the returned methods always see latest values.
  const triggerRef = useRef(trigger);
  triggerRef.current = trigger;
  const closeRef = useRef(close);
  closeRef.current = close;
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  useImperativeHandle(
    ref,
    () => ({
      open: (x, y) => triggerRef.current(x, y),
      close: () => closeRef.current(),
      toggle: (x, y) => {
        if (isOpenRef.current) closeRef.current();
        else triggerRef.current(x, y);
      },
      isOpen: () => isOpenRef.current,
    }),
    [],
  );

  // Lazy-load gsap on first open.
  const [gsap, setGsap] = useState<{ timeline: (vars?: Record<string, unknown>) => GsapTimelineLike } | null>(null);
  useEffect(() => {
    if (!isOpen || gsap) return;
    let cancelled = false;
    loadGsap()
      .then((g) => {
        if (!cancelled) setGsap(g as never);
      })
      .catch((err) => {
        if (!cancelled) {
          if (process.env.NODE_ENV !== 'production') console.error(err);
          throw err;
        }
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, gsap]);

  const exit = useExitTransition(isOpen);

  if (!mounted) return null;
  if (!enabled) return null;
  if (!exit.shouldRender) return null;
  if (!position) return null;

  const overlay = (
    <RadialDockOverlay
      items={items}
      geometry={geometry}
      position={position}
      isOpen={isOpen}
      ariaLabel={ariaLabel}
      zIndex={zIndex}
      theme={theme}
      classNames={classNames}
      animation={animation}
      reducedMotion={reducedMotion}
      gsap={gsap}
      onSelect={(item, i, ev) => onSelect?.(item, i, ev)}
      onRequestClose={close}
      onCloseAnimationDone={exit.done}
    />
  );

  if (portalContainer === null) return overlay;
  const target = portalContainer ?? document.body;
  return createPortal(overlay, target);
});

export default RadialDock;
