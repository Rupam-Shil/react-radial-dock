import { CopyButton } from '@/components/CopyButton';
import { CursorGhost } from '@/components/CursorGhost';
import { HeroViz } from '@/components/HeroViz';
import { LiveDock } from '@/components/LiveDock';
import { Playground } from '@/components/Playground';
import { RcHint } from '@/components/RcHint';
import { VariantStage } from '@/components/VariantStage';

const NPM_CMD = 'npm i react-radial-dock';
const REPO_URL = 'https://github.com/Rupam-Shil/react-radial-dock';
const NPM_URL = 'https://www.npmjs.com/package/react-radial-dock';

export default function Page() {
  return (
    <>
      <CursorGhost />
      <RcHint />
      <LiveDock />

      {/* ═══════════════ TOPBAR ═══════════════ */}
      <header className="topbar">
        <div className="wrap topbar-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true" />
            react-radial-dock
          </div>
          <div className="status">
            <span><span className="dot">●</span> v1.0.0</span>
            <span>MIT</span>
            <span>~6 KB GZ</span>
            <span>REACT 18 +</span>
          </div>
          <nav className="topnav">
            <a href="#playground">Playground</a>
            <a href={NPM_URL} target="_blank" rel="noopener">npm ↗</a>
            <a href={REPO_URL} target="_blank" rel="noopener">github ↗</a>
          </nav>
        </div>
      </header>

      <main>
        {/* ═══════════════ HERO ═══════════════ */}
        <section className="hero">
          <div className="wrap">
            <div className="hero-meta">
              <span className="tab"><strong>FILE</strong> 01 / HERO</span>
              <span className="tab">REACT · COMPONENT · GSAP</span>
              <span className="grow" />
              <span className="tab live">LIVE</span>
              <span className="tab">RIGHT-CLICK READY</span>
            </div>

            <div className="hero-grid">
              <div className="hero-left">
                <h1 className="hero-title">
                  <span className="l1">Radial</span>
                  <span className="l2">
                    <span className="accent">Dock</span>
                    <span className="slash">/</span>
                    <span className="ext">tsx</span>
                  </span>
                </h1>

                <p className="hero-lede">
                  A pie-menu for the modern web.<br />
                  Right-click <em>anywhere</em> on this page —<br />
                  a six-wedge dock will rise to meet your cursor.
                </p>

                <div className="hero-actions">
                  <CopyButton text={NPM_CMD} className="cta" showIcon>
                    {NPM_CMD}
                    <span className="copy-state"><span className="lbl" /></span>
                  </CopyButton>
                  <a className="cta-ghost" href="#playground">
                    Try the playground
                    <span className="arr">↗</span>
                  </a>
                </div>

                <div className="hero-tip">
                  <span className="tag">TIP</span>
                  Right-click anywhere on this page to summon the dock
                </div>
              </div>

              <div className="hero-right">
                <HeroViz />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ VARIANTS ═══════════════ */}
        <section className="sec" id="variants">
          <div className="wrap">
            <div className="sec-head">
              <div className="num"><strong>02</strong> / VARIANTS</div>
              <h2>
                Four flavors,<br />
                one component
                <span className="small">— theme tokens, custom render, or both. The dock bends.</span>
              </h2>
              <div className="meta">SWAP THEMES<br />WITHOUT FORKING</div>
            </div>

            <div className="variants-grid">
              <article className="variant theme-default">
                <div className="v-num">A / DEFAULT</div>
                <h3 className="v-name">Bone</h3>
                <p className="v-desc">Out-of-the-box tokens. Warm slices on near-black canvas. Lime on hover.</p>
                <div className="v-stage">
                  <VariantStage palette={{
                    fill: '#ece6d8', stroke: '#0a0908', strokeW: 0.7,
                    icon: '#0a0908', center: '#d4ff00', bgRing: '#2c2820',
                  }} />
                </div>
              </article>
              <article className="variant theme-glass">
                <div className="v-num">B / GLASS</div>
                <h3 className="v-name">Frosted</h3>
                <p className="v-desc">Translucent slices, backdrop blur, subtle ring. For overlays on busy canvases.</p>
                <div className="v-stage">
                  <VariantStage palette={{
                    fill: 'rgba(236, 230, 216, 0.18)', stroke: 'rgba(236, 230, 216, 0.55)', strokeW: 0.6,
                    icon: '#ece6d8', center: '#ece6d8', bgRing: 'rgba(236, 230, 216, 0.18)',
                  }} />
                </div>
              </article>
              <article className="variant theme-neon">
                <div className="v-num">C / NEON</div>
                <h3 className="v-name">Acid</h3>
                <p className="v-desc">Pure-black slices with electric-lime glow. Game UIs, creative tools, bold brands.</p>
                <div className="v-stage">
                  <VariantStage palette={{
                    fill: '#0a0908', stroke: '#d4ff00', strokeW: 1.2,
                    icon: '#d4ff00', center: '#d4ff00', bgRing: '#2a2a00', gap: 0.08,
                  }} />
                </div>
              </article>
              <article className="variant theme-paper">
                <div className="v-num">D / PAPER</div>
                <h3 className="v-name">Inverted</h3>
                <p className="v-desc">Off-white substrate with ink slices. Editorial tools, document apps, light mode.</p>
                <div className="v-stage">
                  <VariantStage palette={{
                    fill: '#0a0908', stroke: '#0a0908', strokeW: 0.5,
                    icon: '#efe9d9', center: '#ff7a1a', bgRing: '#a8a18e',
                  }} />
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ═══════════════ FEATURES ═══════════════ */}
        <section className="sec">
          <div className="wrap">
            <div className="sec-head">
              <div className="num"><strong>03</strong> / SPECS</div>
              <h2>
                Precision-<br />
                engineered
                <span className="small">— twelve concerns, one tiny component, zero compromises.</span>
              </h2>
              <div className="meta">SIX HIGHLIGHTS<br />OF THIRTY-SOMETHING</div>
            </div>

            <div className="feat-grid">
              <article className="feat">
                <div className="f-num"><span>01</span><strong>GSAP</strong></div>
                <h3>Timeline-driven motion</h3>
                <p>Five built-in animations — spring, fade, pop, stagger, iris — orchestrated through a single GSAP timeline. Bring your own keyframes via the custom hook.</p>
                <div className="f-tag"><span>—</span> 5 PRESETS · CUSTOM TIMELINES</div>
              </article>
              <article className="feat">
                <div className="f-num"><span>02</span><strong>HEADLESS</strong></div>
                <h3>Themable to the bone</h3>
                <p>Twelve CSS variables expose every surface, plus per-element <code>classNames</code> slots. Render anything in any wedge with the <code>render</code> escape hatch.</p>
                <div className="f-tag"><span>—</span> CSS VARS · CLASSES · RENDER PROPS</div>
              </article>
              <article className="feat">
                <div className="f-num"><span>03</span><strong>TRIGGERS</strong></div>
                <h3>Right-click, hotkey, ref</h3>
                <p>Open by context-menu, by keyboard combo, or imperatively through a ref handle. Mix and match. Position controlled or uncontrolled — the dock follows.</p>
                <div className="f-tag"><span>—</span> 3 TRIGGER MODES · CONTROLLED OR NOT</div>
              </article>
              <article className="feat">
                <div className="f-num"><span>04</span><strong>SSR</strong></div>
                <h3>Server-render safe</h3>
                <p>Boundary-aware: defers <code>document</code> reads to <code>useEffect</code>, hydrates without flash, and ships with a <code>&apos;use client&apos;</code> directive baked into the entry bundles.</p>
                <div className="f-tag"><span>—</span> NEXT.JS APP ROUTER READY</div>
              </article>
              <article className="feat">
                <div className="f-num"><span>05</span><strong>A11Y</strong></div>
                <h3>Keyboard, ARIA, motion</h3>
                <p>Full keyboard navigation, <code>menu</code> + <code>menuitem</code> roles, <code>aria-activedescendant</code>, and an automatic <code>prefers-reduced-motion</code> bypass.</p>
                <div className="f-tag"><span>—</span> WCAG-MINDED · REDUCED-MOTION AWARE</div>
              </article>
              <article className="feat">
                <div className="f-num"><span>06</span><strong>SIZE</strong></div>
                <h3>Tree-shakable, ~6 KB</h3>
                <p>Lazy-loads GSAP only on first open. Presets live in a separate entry. ESM + CJS dual exports, full TypeScript types, zero runtime config.</p>
                <div className="f-tag"><span>—</span> ESM · CJS · TYPED · LAZY</div>
              </article>
            </div>
          </div>
        </section>

        {/* ═══════════════ CODE ═══════════════ */}
        <section className="sec" id="docs">
          <div className="wrap">
            <div className="sec-head">
              <div className="num"><strong>04</strong> / USAGE</div>
              <h2>
                Five lines<br />
                of JSX
                <span className="small">— fewer if you trust the defaults. Optional everything else.</span>
              </h2>
              <div className="meta">DROP-IN<br />BY DESIGN</div>
            </div>

            <div className="code-grid">
              <div className="code-block">
                <div className="code-bar">
                  <span className="file">app/page.tsx</span>
                  <span className="lang">TSX</span>
                </div>
                <pre>
{`import { RadialDock } from 'react-radial-dock';
import 'react-radial-dock/styles.css';

export default function Page() {
  return (
    <RadialDock
      items={[
        { id: 'star', label: 'Star',     icon: <Star />,     onSelect: () => star() },
        { id: 'edit', label: 'Edit',     icon: <Pencil />,   onSelect: () => edit() },
        { id: 'mark', label: 'Bookmark', icon: <Bookmark />, onSelect: () => mark() },
        { id: 'pin',  label: 'Pin',      icon: <Pin />,      onSelect: () => pin() },
      ]}
      triggers={{ rightClick: true, hotkey: 'mod+e' }}
      animation="spring"
    />
  );
}`}
                </pre>
              </div>

              <div className="code-side">
                <div className="code-step">
                  <div className="n">01</div>
                  <div><b>Install.</b><br />npm i react-radial-dock<br />(peer: react ≥ 18, gsap ≥ 3.12)</div>
                </div>
                <div className="code-step">
                  <div className="n">02</div>
                  <div><b>Mount once.</b><br />Drop a single <code>&lt;RadialDock/&gt;</code> at the root of your app.</div>
                </div>
                <div className="code-step">
                  <div className="n">03</div>
                  <div><b>Trigger.</b><br />Right-click. Or press the hotkey. Or <code>ref.current.open(x, y)</code>.</div>
                </div>
                <div className="code-step">
                  <div className="n">04</div>
                  <div><b>Theme.</b><br />Override <code>--rrd-*</code> CSS variables, or pass a <code>theme</code> prop.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ PLAYGROUND ═══════════════ */}
        <section className="sec" id="playground">
          <div className="wrap">
            <div className="sec-head">
              <div className="num"><strong>05</strong> / PLAYGROUND</div>
              <h2>
                Tweak everything,<br />
                watch it react
                <span className="small">— real component, real props, live preview. Copy the JSX when you&apos;re happy.</span>
              </h2>
              <div className="meta">REAL LIBRARY<br />NO SHORTCUTS</div>
            </div>

            <Playground />
          </div>
        </section>

        {/* ═══════════════ API ═══════════════ */}
        <section className="sec" id="api">
          <div className="wrap">
            <div className="sec-head">
              <div className="num"><strong>06</strong> / SURFACE</div>
              <h2>
                Eight props,<br />
                one ref handle
                <span className="small">— the public API. Everything else has a sensible default.</span>
              </h2>
              <div className="meta">FULLY TYPED<br />D.TS GENERATED</div>
            </div>

            <table className="api-table">
              <thead>
                <tr><th style={{ width: '22%' }}>Prop</th><th style={{ width: '30%' }}>Type</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td className="prop">items <span className="req">REQ</span></td>
                  <td className="type">{'Array<{ id, label, icon, onSelect, disabled? }>'}</td>
                  <td className="desc">The wedges. Minimum 3 required to render. Each item exposes its own onSelect callback.</td>
                </tr>
                <tr>
                  <td className="prop">triggers</td>
                  <td className="type">{'{ rightClick?: boolean; hotkey?: string | false }'}</td>
                  <td className="desc">How the dock opens. Defaults to right-click only. Hotkey accepts mod+key combos.</td>
                </tr>
                <tr>
                  <td className="prop">animation</td>
                  <td className="type">{"'spring' | 'fade' | 'pop' | 'stagger' | 'iris' | (ctx) => gsap.Timeline"}</td>
                  <td className="desc">Built-in preset name or a custom timeline factory. Receives the animation context.</td>
                </tr>
                <tr>
                  <td className="prop">theme</td>
                  <td className="type">{'Partial<RadialDockTheme>'}</td>
                  <td className="desc">Override colors, blur, shadow, ring stroke. Twelve tokens total. Composes with CSS vars.</td>
                </tr>
                <tr>
                  <td className="prop">outerRadius / innerRadius / iconRadius</td>
                  <td className="type">{"number | 'auto'"}</td>
                  <td className="desc">Geometry. Auto picks midpoint for icon ring. Inner must be ≤ outer − 20.</td>
                </tr>
                <tr>
                  <td className="prop">startAngle / direction</td>
                  <td className="type">{"number (deg) / 'clockwise' | 'counter-clockwise'"}</td>
                  <td className="desc">Slice 0 placement and rotation order. Defaults to 0° (top), clockwise.</td>
                </tr>
                <tr>
                  <td className="prop">open / onOpenChange / position</td>
                  <td className="type">{'boolean / (next) => void / { x, y }'}</td>
                  <td className="desc">Optional controlled mode. Provide all three to manage state externally.</td>
                </tr>
                <tr>
                  <td className="prop">reducedMotion</td>
                  <td className="type">{"'auto' | 'always' | 'never'"}</td>
                  <td className="desc">Motion strategy. Auto reads prefers-reduced-motion. Always disables transitions entirely.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ═══════════════ CTA ═══════════════ */}
        <section className="cta-section">
          <div className="wrap">
            <p className="quote">A pie chart that bites back.</p>
            <CopyButton text={NPM_CMD} className="cta-mega">
              <span className="arr">→</span>{NPM_CMD}
            </CopyButton>
            <div className="cta-sub">
              <span>NO CONFIG</span>
              <span>·</span>
              <span>FIVE PRESETS</span>
              <span>·</span>
              <span>SIX KILOBYTES</span>
              <span>·</span>
              <span>MIT LICENSE</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap foot-inner">
          <div className="colofon">
            &copy; 2026 / RUPAM SHIL<br />
            ENGINEERED IN <b>JAVASCRIPT</b>, ANIMATED BY <b>GSAP</b>
          </div>
          <div className="foot-mark">RRD</div>
          <div className="colofon right">
            <b>VERSION 1.0.0</b> / MIT<br />
            <a href={REPO_URL} target="_blank" rel="noopener">ISSUES &amp; PRs WELCOME ↗</a>
          </div>
        </div>
      </footer>
    </>
  );
}
