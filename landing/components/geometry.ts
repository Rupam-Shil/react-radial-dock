// Geometry helpers — same math as src/geometry.ts in the package.
export const TAU = Math.PI * 2;

export function polar(r: number, a: number): [number, number] {
  return [r * Math.sin(a), -r * Math.cos(a)];
}

export function arcPath(
  cx: number,
  cy: number,
  ri: number,
  ro: number,
  a0: number,
  a1: number,
): string {
  const span = a1 - a0;
  const large = span > Math.PI ? 1 : 0;
  const [x0o, y0o] = polar(ro, a0);
  const [x1o, y1o] = polar(ro, a1);
  const [x1i, y1i] = polar(ri, a1);
  const [x0i, y0i] = polar(ri, a0);
  return `M ${x0o + cx} ${y0o + cy} A ${ro} ${ro} 0 ${large} 1 ${x1o + cx} ${y1o + cy} L ${x1i + cx} ${y1i + cy} A ${ri} ${ri} 0 ${large} 0 ${x0i + cx} ${y0i + cy} Z`;
}
