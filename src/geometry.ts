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
