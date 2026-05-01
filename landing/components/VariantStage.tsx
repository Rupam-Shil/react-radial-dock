// Server component — renders a static SVG for each variant theme card.

import { arcPath, polar, TAU } from './geometry';

const ICON_GLYPHS = [
  <path key="star" d="M12 2l2.7 6.3L21 9l-5 4.3L17.5 21 12 17.5 6.5 21 8 13.3 3 9l6.3-.7z" />,
  <g key="edit"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" /></g>,
  <path key="bookmark" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />,
  <g key="pin"><line x1="12" y1="17" x2="12" y2="22" /><path d="M5 17h14l-1.4-3.5a3 3 0 0 1-.6-1.8V5H7v6.7c0 .6-.2 1.2-.5 1.7L5 17z" /></g>,
  <g key="share"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></g>,
  <g key="trash"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></g>,
];

interface Palette {
  fill: string;
  stroke: string;
  strokeW: number;
  icon: string;
  center: string;
  bgRing?: string;
  gap?: number;
}

interface Props {
  palette: Palette;
}

export function VariantStage({ palette }: Props) {
  const RO = 90;
  const RI = 42;
  const IR = 66;
  const N = 6;
  const sliceSize = TAU / N;
  const gap = palette.gap ?? 0.06;

  const slices: { d: string; idx: number }[] = [];
  const icons: { x: number; y: number; idx: number }[] = [];

  for (let i = 0; i < N; i++) {
    const ctr = i * sliceSize;
    const a0 = ctr - sliceSize / 2 + gap / 2;
    const a1 = ctr + sliceSize / 2 - gap / 2;
    slices.push({ d: arcPath(0, 0, RI, RO, a0, a1), idx: i });
    const [x, y] = polar(IR, ctr);
    icons.push({ x, y, idx: i });
  }

  return (
    <svg viewBox="-110 -110 220 220">
      {palette.bgRing && (
        <circle r={100} fill="none" stroke={palette.bgRing} strokeWidth={1} strokeDasharray="2 4" />
      )}
      {slices.map((s) => (
        <path
          key={s.idx}
          d={s.d}
          fill={palette.fill}
          stroke={palette.stroke}
          strokeWidth={palette.strokeW}
        />
      ))}
      {icons.map((it) => (
        <g
          key={it.idx}
          transform={`translate(${it.x} ${it.y}) scale(0.5)`}
          stroke={palette.icon}
          fill="none"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <g transform="translate(-12 -12)">
            {ICON_GLYPHS[it.idx]}
          </g>
        </g>
      ))}
      <circle r={3} fill={palette.center} />
    </svg>
  );
}
