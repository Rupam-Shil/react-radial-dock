export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleRad: number,
): { x: number; y: number } {
  // Convention: 0 rad = up (12 o'clock); +PI/2 = right.
  return {
    x: cx + radius * Math.sin(angleRad),
    y: cy - radius * Math.cos(angleRad),
  };
}

export interface ArcPathInput {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  /** radians; 0 = top */
  startAngle: number;
  /** radians; must be > startAngle */
  endAngle: number;
}

export function arcPath({
  cx,
  cy,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
}: ArcPathInput): string {
  const span = endAngle - startAngle;
  const largeArc = span > Math.PI ? 1 : 0;

  const outerStart = polarToCartesian(cx, cy, outerRadius, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerRadius, endAngle);
  const innerEnd = polarToCartesian(cx, cy, innerRadius, endAngle);
  const innerStart = polarToCartesian(cx, cy, innerRadius, startAngle);

  // sweep=1 (clockwise in SVG y-down) for outer, sweep=0 for inner reverse.
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ');
}
