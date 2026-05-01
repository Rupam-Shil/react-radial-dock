// Server component — renders the static technical-drawing SVG in the hero.

import { arcPath, polar, TAU } from './geometry';

// Raw SVG glyph data (viewBox 0 0 24 24) — no outer <svg> wrapper so they
// compose safely inside the parent <svg> coordinate space.
const ICON_GLYPHS = [
  <path key="star" d="M12 2l2.7 6.3L21 9l-5 4.3L17.5 21 12 17.5 6.5 21 8 13.3 3 9l6.3-.7z" />,
  <g key="edit"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" /></g>,
  <path key="bookmark" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />,
  <g key="pin"><line x1="12" y1="17" x2="12" y2="22" /><path d="M5 17h14l-1.4-3.5a3 3 0 0 1-.6-1.8V5H7v6.7c0 .6-.2 1.2-.5 1.7L5 17z" /></g>,
  <g key="share"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></g>,
  <g key="trash"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></g>,
];
const RO = 110;
const RI = 55;
const IR = 82;
const N = 6;
const GAP = 0.04;
const FEATURED = 0;

export function HeroViz() {
  const sliceSize = TAU / N;
  const slices: { d: string; featured: boolean; idx: number }[] = [];
  const icons: { x: number; y: number; idx: number; featured: boolean }[] = [];

  for (let i = 0; i < N; i++) {
    const ctr = i * sliceSize;
    const a0 = ctr - sliceSize / 2 + GAP / 2;
    const a1 = ctr + sliceSize / 2 - GAP / 2;
    slices.push({ d: arcPath(0, 0, RI, RO, a0, a1), featured: i === FEATURED, idx: i });
    const [x, y] = polar(IR, ctr);
    icons.push({ x, y, idx: i, featured: i === FEATURED });
  }

  const ticks: { x1: number; y1: number; x2: number; y2: number; cardinal: boolean }[] = [];
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * TAU;
    const r0 = 188;
    const cardinal = i % 6 === 0;
    const r1 = cardinal ? 175 : 182;
    const [x0, y0] = polar(r0, a);
    const [x1, y1] = polar(r1, a);
    ticks.push({ x1: x0, y1: y0, x2: x1, y2: y1, cardinal });
  }

  return (
    <div className="viz" aria-hidden="true">
      <div className="viz-corner tl"><strong>R/110</strong><br />OUTER RADIUS</div>
      <div className="viz-corner tr"><strong>06</strong><br />SLICES</div>
      <div className="viz-corner bl"><strong>R/55</strong><br />INNER RADIUS</div>
      <div className="viz-corner br"><strong>00.0°</strong><br />START ANGLE</div>
      <svg
        className="viz-svg"
        viewBox="-200 -200 400 400"
        role="img"
        aria-label="Technical diagram of the radial dock"
      >
        <g className="ring-tick">
          <circle r={190} fill="none" stroke="#2c2820" strokeWidth={0.5} />
          {ticks.map((t, i) => (
            <line
              key={i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={t.cardinal ? '#ece6d8' : '#5a5446'}
              strokeWidth={t.cardinal ? 0.9 : 0.5}
            />
          ))}
        </g>
        <g className="ring-mid">
          <circle r={170} fill="none" stroke="#3a3528" strokeWidth={0.5} strokeDasharray="2 6" />
        </g>
        <g className="ring-outer">
          <circle r={155} fill="none" stroke="#4a4332" strokeWidth={0.6} strokeDasharray="0.4 4.6" />
        </g>

        <line className="crosshair-faint" x1={-200} y1={0} x2={200} y2={0} />
        <line className="crosshair-faint" x1={0} y1={-200} x2={0} y2={200} />

        <g>
          {slices.map((s) => (
            <path key={s.idx} d={s.d} className={'slice-static' + (s.featured ? ' feature' : '')} />
          ))}
        </g>
        <g>
          {icons.map((it) => (
            <g
              key={it.idx}
              transform={`translate(${it.x} ${it.y}) scale(0.55)`}
              className={`icon-glyph${it.featured ? ' on-feature' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <g transform="translate(-12 -12)">
                {ICON_GLYPHS[it.idx]}
              </g>
            </g>
          ))}
        </g>

        <circle r={3} fill="#d4ff00" />
        <circle r={8} fill="none" stroke="#d4ff00" strokeWidth={0.5} />

        <g>
          <line x1={100} y1={-100} x2={180} y2={-160} stroke="#ece6d8" strokeWidth={0.5} />
          <circle cx={180} cy={-160} r={2} fill="#ece6d8" />
          <text x={186} y={-156} fill="#ece6d8" fontFamily="JetBrains Mono" fontSize={9} letterSpacing={1.4}>01 / WEDGE</text>
        </g>
        <g>
          <line x1={0} y1={-110} x2={0} y2={-178} stroke="#ece6d8" strokeWidth={0.5} />
          <circle cx={0} cy={-178} r={2} fill="#ece6d8" />
          <text x={6} y={-180} fill="#ece6d8" fontFamily="JetBrains Mono" fontSize={9} letterSpacing={1.4}>02 / OUTER</text>
        </g>
        <g>
          <line x1={-65} y1={0} x2={-180} y2={0} stroke="#ece6d8" strokeWidth={0.5} />
          <circle cx={-180} cy={0} r={2} fill="#ece6d8" />
          <text x={-188} y={-4} textAnchor="end" fill="#ece6d8" fontFamily="JetBrains Mono" fontSize={9} letterSpacing={1.4}>03 / INNER</text>
        </g>
        <g>
          <line x1={80} y1={80} x2={170} y2={155} stroke="#d4ff00" strokeWidth={0.5} />
          <circle cx={170} cy={155} r={2.5} fill="#d4ff00" />
          <text x={168} y={170} textAnchor="end" fill="#d4ff00" fontFamily="JetBrains Mono" fontSize={9} letterSpacing={1.4}>04 / ICON</text>
        </g>
      </svg>
    </div>
  );
}
