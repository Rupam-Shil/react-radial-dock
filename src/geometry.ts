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

/**
 * Resolve which slice index a cursor point falls into.
 *
 * @param px        cursor X (any coord space, same origin as cx)
 * @param py        cursor Y
 * @param cx        donut center X
 * @param cy        donut center Y
 * @param n         number of slices
 * @param startRad  angle of slice 0 center, in radians (0 = top)
 * @param dirSign   +1 = clockwise, -1 = counter-clockwise
 */
export function angleToIndex(
  px: number,
  py: number,
  cx: number,
  cy: number,
  n: number,
  startRad: number,
  dirSign: 1 | -1,
): number {
  if (n <= 0) return -1;
  // Angle of cursor relative to "up = 0".
  const dx = px - cx;
  const dy = py - cy;
  // atan2 with our convention (0 = up):
  // standard atan2(y, x) measures from +X axis CCW; we want from +Y-down (top) CW.
  // Convert: angle_from_top = atan2(dx, -dy)  ⇒ 0 at top, +π/2 at right.
  let theta = Math.atan2(dx, -dy);
  // Map to [0, 2π)
  if (theta < 0) theta += 2 * Math.PI;

  const sliceSize = (2 * Math.PI) / n;
  // Cursor's angle relative to slice 0 center, walking in the slice's direction.
  let rel = (theta - startRad) * dirSign;
  // Normalize to [-PI, PI]
  rel = ((rel % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  // Shift so slice 0 spans [-sliceSize/2, +sliceSize/2]
  rel = (rel + sliceSize / 2) % (2 * Math.PI);
  return Math.floor(rel / sliceSize) % n;
}
