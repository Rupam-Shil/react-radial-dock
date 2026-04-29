import type { CSSProperties, ReactNode, RefObject } from 'react';

/**
 * One entry in the dock.
 */
export interface RadialDockItem {
  id: string;
  onSelect: () => void;
  icon?: ReactNode;
  label?: string;
  render?: (state: { hovered: boolean; index: number }) => ReactNode;
  disabled?: boolean;
}

export interface RadialDockTheme {
  bg: string;
  bgBlur: string;
  sliceFill: string;
  sliceFillHover: string;
  sliceFillActive: string;
  sliceFillDisabled: string;
  iconColor: string;
  iconColorHover: string;
  labelColor: string;
  shadow: string;
  ringStroke: string;
  ringStrokeWidth: string;
}

export interface RadialDockClassNames {
  overlay: string;
  container: string;
  disk: string;
  svg: string;
  slice: string;
  sliceHovered: string;
  sliceDisabled: string;
  icon: string;
  iconHovered: string;
  label: string;
}

export interface RadialDockAnimationContext {
  container: HTMLElement;
  disk: HTMLElement;
  svg: SVGSVGElement;
  slices: SVGPathElement[];
  icons: HTMLElement[];
  n: number;
  sliceSize: number; // radians
  outerRadius: number;
  innerRadius: number;
  centerX: number;
  centerY: number;
}

export type RadialDockAnimationName = 'spring' | 'fade' | 'pop' | 'stagger' | 'iris';

// gsap.core.Timeline is loosely typed here so the package does not import gsap types
// at the public-API boundary. Consumers writing custom presets import gsap themselves.
export interface RadialDockAnimationCustom {
  open(timeline: GsapTimelineLike, ctx: RadialDockAnimationContext): void;
  close(timeline: GsapTimelineLike, ctx: RadialDockAnimationContext): void;
}

/** Minimal subset of `gsap.core.Timeline` we depend on. */
export interface GsapTimelineLike {
  to(target: unknown, vars: Record<string, unknown>, position?: string | number): GsapTimelineLike;
  from(target: unknown, vars: Record<string, unknown>, position?: string | number): GsapTimelineLike;
  fromTo(
    target: unknown,
    fromVars: Record<string, unknown>,
    toVars: Record<string, unknown>,
    position?: string | number,
  ): GsapTimelineLike;
  set(target: unknown, vars: Record<string, unknown>, position?: string | number): GsapTimelineLike;
  play(from?: number): GsapTimelineLike;
  reverse(): GsapTimelineLike;
  pause(): GsapTimelineLike;
  kill(): GsapTimelineLike;
  eventCallback(name: string, cb: (() => void) | null): GsapTimelineLike;
}

export type RadialDockAnimation = RadialDockAnimationName | RadialDockAnimationCustom;

export interface RadialDockTriggers {
  rightClick?: boolean | { ignoreSelectors?: string[] };
  hotkey?: string | false;
}

export type RadialDockReducedMotion = 'auto' | 'always' | 'never';

export interface RadialDockProps {
  items: RadialDockItem[];

  triggers?: RadialDockTriggers;

  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  position?: { x: number; y: number };

  onSelect?: (
    item: RadialDockItem,
    index: number,
    event: React.MouseEvent | KeyboardEvent,
  ) => void;

  outerRadius?: number;
  innerRadius?: number;
  sliceGap?: number;
  iconSize?: number;
  iconRadius?: number | 'auto';
  startAngle?: number;
  direction?: 'clockwise' | 'counter-clockwise';

  theme?: Partial<RadialDockTheme>;
  classNames?: Partial<RadialDockClassNames>;

  animation?: RadialDockAnimation;
  reducedMotion?: RadialDockReducedMotion;

  portalContainer?: HTMLElement | null;
  zIndex?: number;

  ariaLabel?: string;
}

export interface RadialDockHandle {
  open(x?: number, y?: number): void;
  close(): void;
  toggle(x?: number, y?: number): void;
  isOpen(): boolean;
}

/** Internal: refs shared between RadialDockOverlay and useGsapTimeline. */
export interface RadialDockRefs {
  containerRef: RefObject<HTMLDivElement | null>;
  diskRef: RefObject<HTMLDivElement | null>;
  svgRef: RefObject<SVGSVGElement | null>;
  sliceRefs: RefObject<(SVGPathElement | null)[]>;
  iconRefs: RefObject<(HTMLDivElement | null)[]>;
}

/** Internal: resolved geometry passed to overlay render + animation context. */
export interface RadialDockResolvedGeometry {
  n: number;
  outerRadius: number;
  innerRadius: number;
  iconRadius: number;
  iconSize: number;
  sliceGap: number;
  startAngleRad: number;
  dirSign: 1 | -1;
  sliceSize: number; // radians
  /** SVG viewBox / drawing center */
  centerX: number;
  centerY: number;
}

/** Internal: theme-prop → CSS variable map style object. */
export type RadialDockThemeStyle = CSSProperties & Record<`--rrd-${string}`, string | number | undefined>;
