// src/RadialDockOverlay.tsx
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  arcPath,
  computeSliceRanges,
  gapToRadians,
  polarToCartesian,
} from './geometry';
import { useGsapTimeline } from './hooks/useGsapTimeline';
import type {
  RadialDockAnimation,
  RadialDockAnimationContext,
  RadialDockClassNames,
  RadialDockItem,
  RadialDockResolvedGeometry,
  RadialDockTheme,
  RadialDockThemeStyle,
} from './types';

export interface RadialDockOverlayProps {
  items: RadialDockItem[];
  geometry: RadialDockResolvedGeometry;
  position: { x: number; y: number };
  isOpen: boolean;
  ariaLabel: string;
  zIndex: number;
  theme?: Partial<RadialDockTheme>;
  classNames?: Partial<RadialDockClassNames>;
  animation: RadialDockAnimation;
  reducedMotion: boolean;
  gsap: Parameters<typeof useGsapTimeline>[0]['gsap'];
  onSelect: (item: RadialDockItem, index: number, ev: React.MouseEvent | KeyboardEvent) => void;
  onRequestClose: () => void;
  onCloseAnimationDone: () => void;
}

function cx(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(' ');
}

function themeToStyle(theme?: Partial<RadialDockTheme>): RadialDockThemeStyle {
  if (!theme) return {};
  const map: Record<keyof RadialDockTheme, `--rrd-${string}`> = {
    bg: '--rrd-bg',
    bgBlur: '--rrd-bg-blur',
    sliceFill: '--rrd-slice-fill',
    sliceFillHover: '--rrd-slice-fill-hover',
    sliceFillActive: '--rrd-slice-fill-active',
    sliceFillDisabled: '--rrd-slice-fill-disabled',
    iconColor: '--rrd-icon-color',
    iconColorHover: '--rrd-icon-color-hover',
    labelColor: '--rrd-label-color',
    shadow: '--rrd-shadow',
    ringStroke: '--rrd-ring-stroke',
    ringStrokeWidth: '--rrd-ring-stroke-width',
  };
  const out: RadialDockThemeStyle = {};
  (Object.keys(map) as Array<keyof RadialDockTheme>).forEach((k) => {
    if (theme[k] != null) out[map[k]] = theme[k]!;
  });
  return out;
}

export function RadialDockOverlay({
  items,
  geometry,
  position,
  isOpen,
  ariaLabel,
  zIndex,
  theme,
  classNames,
  animation,
  reducedMotion,
  gsap,
  onSelect,
  onRequestClose,
  onCloseAnimationDone,
}: RadialDockOverlayProps) {
  const baseId = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const diskRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const sliceRefs = useRef<(SVGPathElement | null)[]>([]);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const [hovered, setHovered] = useState<number>(-1);

  // Pre-compute slice paths and icon positions (pure).
  const { slicePaths, iconPositions } = useMemo(() => {
    const sliceSizeRad = geometry.sliceSize;
    const gapRad = gapToRadians(geometry.sliceGap, geometry.iconRadius, sliceSizeRad);
    const ranges = computeSliceRanges({
      n: geometry.n,
      startRad: geometry.startAngleRad,
      dirSign: geometry.dirSign,
      gapRad,
    });
    const paths = ranges.map((r) =>
      arcPath({
        cx: geometry.centerX,
        cy: geometry.centerY,
        innerRadius: geometry.innerRadius,
        outerRadius: geometry.outerRadius,
        startAngle: Math.min(r.start, r.end),
        endAngle: Math.max(r.start, r.end),
      }),
    );
    const positions = ranges.map((r) =>
      polarToCartesian(geometry.centerX, geometry.centerY, geometry.iconRadius, r.center),
    );
    return { slicePaths: paths, iconPositions: positions };
  }, [geometry]);

  // Build animation context for timeline.
  const [ctx, setCtx] = useState<RadialDockAnimationContext | null>(null);
  useLayoutEffect(() => {
    if (!containerRef.current || !diskRef.current || !svgRef.current) return;
    setCtx({
      container: containerRef.current,
      disk: diskRef.current,
      svg: svgRef.current,
      slices: sliceRefs.current.filter((s): s is SVGPathElement => !!s),
      icons: iconRefs.current.filter((i): i is HTMLDivElement => !!i),
      n: geometry.n,
      sliceSize: geometry.sliceSize,
      outerRadius: geometry.outerRadius,
      innerRadius: geometry.innerRadius,
      centerX: geometry.centerX,
      centerY: geometry.centerY,
    });
  }, [geometry]);

  useGsapTimeline({
    ctx,
    animation,
    isOpen,
    reducedMotion,
    onClosed: onCloseAnimationDone,
    gsap,
  });

  // Focus management: focus container on open, restore on unmount.
  useEffect(() => {
    previousFocusRef.current = (document.activeElement as HTMLElement | null) ?? null;
    containerRef.current?.focus();
    return () => {
      previousFocusRef.current?.focus?.();
    };
  }, []);

  // Keyboard nav.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onRequestClose();
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        const next = nextEnabled(items, hovered, +1);
        if (next !== -1) setHovered(next);
        return;
      }
      if (e.key === 'ArrowLeft' || (e.key === 'Tab' && e.shiftKey)) {
        e.preventDefault();
        const prev = nextEnabled(items, hovered, -1);
        if (prev !== -1) setHovered(prev);
        return;
      }
      if (e.key === 'Enter' || e.key === ' ') {
        if (hovered >= 0 && !items[hovered]?.disabled) {
          e.preventDefault();
          const it = items[hovered]!;
          it.onSelect();
          onSelect(it, hovered, e);
          onRequestClose();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hovered, items, onRequestClose, onSelect]);

  const overlayClass = cx('rrd-overlay', classNames?.overlay);
  const containerClass = cx('rrd-container', classNames?.container);
  const diskClass = cx('rrd-disk', classNames?.disk);
  const svgClass = cx('rrd-svg', classNames?.svg);

  const overlayStyle: React.CSSProperties & RadialDockThemeStyle = {
    ...themeToStyle(theme),
    '--rrd-outer-radius': `${geometry.outerRadius}px`,
    '--rrd-inner-radius': `${geometry.innerRadius}px`,
    '--rrd-icon-size': `${geometry.iconSize}px`,
    '--rrd-z-index': zIndex,
  };

  const containerStyle: React.CSSProperties = {
    left: position.x - geometry.outerRadius,
    top: position.y - geometry.outerRadius,
    width: geometry.outerRadius * 2,
    height: geometry.outerRadius * 2,
  };

  return (
    <div
      role="presentation"
      className={overlayClass}
      style={overlayStyle}
      onMouseDown={(e) => {
        // close on outside click (anything outside the container)
        if (!(e.target as Element).closest('.rrd-container')) onRequestClose();
      }}
      onMouseMove={(e) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const cxLocal = rect.left + rect.width / 2;
        const cyLocal = rect.top + rect.height / 2;
        const dx = e.clientX - cxLocal;
        const dy = e.clientY - cyLocal;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < geometry.innerRadius || dist > geometry.outerRadius) {
          setHovered(-1);
          return;
        }
        // angleToIndex inline (cheaper than calling util to avoid the import in hot path)
        let theta = Math.atan2(dx, -dy);
        if (theta < 0) theta += 2 * Math.PI;
        const sliceSize = geometry.sliceSize;
        let rel = (theta - geometry.startAngleRad) * geometry.dirSign;
        rel = ((rel % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        rel = (rel + sliceSize / 2) % (2 * Math.PI);
        const idx = Math.floor(rel / sliceSize) % geometry.n;
        if (items[idx]?.disabled) {
          setHovered(-1);
        } else {
          setHovered(idx);
        }
      }}
    >
      <div
        ref={containerRef}
        role="menu"
        aria-label={ariaLabel}
        aria-activedescendant={
          hovered >= 0 ? `${baseId}-item-${hovered}` : undefined
        }
        tabIndex={-1}
        className={containerClass}
        style={containerStyle}
      >
        <div ref={diskRef} className={diskClass} aria-hidden="true" />
        <svg
          ref={svgRef}
          className={svgClass}
          viewBox={`${-geometry.outerRadius} ${-geometry.outerRadius} ${geometry.outerRadius * 2} ${geometry.outerRadius * 2}`}
          aria-hidden="true"
        >
          {slicePaths.map((d, i) => {
            const item = items[i]!;
            return (
              <path
                key={item.id}
                ref={(el) => {
                  sliceRefs.current[i] = el;
                }}
                d={d}
                className={cx(
                  'rrd-slice',
                  classNames?.slice,
                  hovered === i && 'rrd-slice--hovered',
                  hovered === i && classNames?.sliceHovered,
                  item.disabled && 'rrd-slice--disabled',
                  item.disabled && classNames?.sliceDisabled,
                )}
                onClick={(e) => {
                  if (item.disabled) return;
                  item.onSelect();
                  onSelect(item, i, e);
                  onRequestClose();
                }}
              />
            );
          })}
        </svg>
        {items.map((item, i) => {
          const pos = iconPositions[i]!;
          return (
            <div
              key={item.id}
              ref={(el) => {
                iconRefs.current[i] = el;
              }}
              className={cx(
                'rrd-icon',
                classNames?.icon,
                hovered === i && 'rrd-icon--hovered',
                hovered === i && classNames?.iconHovered,
              )}
              style={{
                left: geometry.outerRadius + pos.x,
                top: geometry.outerRadius + pos.y,
              }}
              aria-hidden="true"
            >
              {item.render
                ? item.render({ hovered: hovered === i, index: i })
                : (
                  <>
                    {item.icon}
                    {item.label && <span className={cx('rrd-label', classNames?.label)}>{item.label}</span>}
                  </>
                )}
            </div>
          );
        })}
        {/* SR-only menuitems for aria-activedescendant. */}
        <div className="rrd-sr-only">
          {items.map((item, i) => (
            <span
              key={item.id}
              id={`${baseId}-item-${i}`}
              role="menuitem"
              aria-disabled={item.disabled || undefined}
            >
              {item.label ?? item.id}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function nextEnabled(items: RadialDockItem[], from: number, dir: 1 | -1): number {
  const n = items.length;
  if (n === 0) return -1;
  let i = from;
  for (let step = 0; step < n; step++) {
    i = (i + dir + n) % n;
    if (!items[i]?.disabled) return i;
  }
  return -1;
}
