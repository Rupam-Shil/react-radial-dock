'use client';

import { useEffect, useMemo, useState } from 'react';
import { RadialDock } from 'react-radial-dock';
import type {
  RadialDockAnimationName,
  RadialDockReducedMotion,
} from 'react-radial-dock';
import { CopyButton } from './CopyButton';

const EMOJIS = [
  '⭐', '✏️', '🔖', '📍', '📤', '🗑️',
  '❤️', '👀', '🔥', '🎯', '🌟', '⚡',
  '🚀', '🎨', '📌', '📋', '🔗', '✂️',
  '💾', '📷', '🎵', '🌙', '☀️', '🍀',
];

interface PgItem {
  id: string;
  label: string;
  emoji: string;
  disabled: boolean;
}

const INITIAL_ITEMS: PgItem[] = [
  { id: '1', label: 'Star',     emoji: '⭐', disabled: false },
  { id: '2', label: 'Edit',     emoji: '✏️', disabled: false },
  { id: '3', label: 'Bookmark', emoji: '🔖', disabled: false },
  { id: '4', label: 'Pin',      emoji: '📍', disabled: false },
];

const ANIMATIONS: RadialDockAnimationName[] = ['spring', 'fade', 'pop', 'stagger', 'iris'];
const REDUCED: RadialDockReducedMotion[] = ['auto', 'never', 'always'];

export function Playground() {
  const [items, setItems] = useState<PgItem[]>(INITIAL_ITEMS);
  const [pickingItem, setPickingItem] = useState<string | null>(null);

  // Geometry
  const [outerRadius, setOuterRadius] = useState(110);
  const [innerRadius, setInnerRadius] = useState(55);
  const [sliceGap, setSliceGap] = useState(2);
  const [iconSize, setIconSize] = useState(32);
  const [startAngle, setStartAngle] = useState(0);
  const [direction, setDirection] = useState<'clockwise' | 'counter-clockwise'>('clockwise');

  // Animation
  const [animation, setAnimation] = useState<RadialDockAnimationName>('spring');
  const [reducedMotion, setReducedMotion] = useState<RadialDockReducedMotion>('auto');

  // Theme
  const [bg, setBg] = useState('rgba(20, 20, 20, 0.78)');
  const [sliceFill, setSliceFill] = useState('rgba(236, 230, 216, 0.06)');
  const [sliceFillHover, setSliceFillHover] = useState('#d4ff00');
  const [iconColor, setIconColor] = useState('#ece6d8');
  const [labelColor, setLabelColor] = useState('rgba(255,255,255,0.85)');

  // Custom render
  const [customRender, setCustomRender] = useState(false);

  // Stage tracking
  const [stage, setStage] = useState<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // Last-selected toast
  const [lastSelected, setLastSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!stage) return;
    const update = () => {
      const r = stage.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    };
    const ro = new ResizeObserver(update);
    ro.observe(stage);
    update();
    return () => ro.disconnect();
  }, [stage]);

  useEffect(() => {
    if (!lastSelected) return;
    const t = setTimeout(() => setLastSelected(null), 1500);
    return () => clearTimeout(t);
  }, [lastSelected]);

  // Auto-clamp innerRadius when outerRadius shrinks
  useEffect(() => {
    setInnerRadius((cur) => Math.min(cur, Math.max(0, outerRadius - 20)));
  }, [outerRadius]);

  const dockItems = useMemo(() => {
    return items.map((it) => {
      const base = {
        id: it.id,
        label: it.label,
        disabled: it.disabled,
        onSelect: () => setLastSelected(it.label),
      };
      if (customRender) {
        return {
          ...base,
          render: ({ hovered }: { hovered: boolean }) => (
            <div className="pg-custom-render">
              <span
                className="big"
                style={{
                  transform: hovered ? 'scale(1.3) rotate(-5deg)' : 'scale(1)',
                  transition: 'transform .25s cubic-bezier(.34, 1.56, .64, 1)',
                  display: 'inline-block',
                }}
              >
                {it.emoji}
              </span>
              <span className="lbl">{it.label}</span>
            </div>
          ),
        };
      }
      return {
        ...base,
        icon: <span style={{ fontSize: 22, display: 'block' }}>{it.emoji}</span>,
      };
    });
  }, [items, customRender]);

  const updateItem = (id: string, patch: Partial<PgItem>) =>
    setItems((cur) => cur.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const addItem = () => {
    if (items.length >= 8) return;
    const id = `i_${Date.now()}`;
    setItems((cur) => [...cur, { id, label: 'New', emoji: '🎯', disabled: false }]);
  };
  const removeItem = (id: string) => {
    if (items.length <= 3) return;
    setItems((cur) => cur.filter((it) => it.id !== id));
  };

  const reset = () => {
    setItems(INITIAL_ITEMS);
    setPickingItem(null);
    setOuterRadius(110);
    setInnerRadius(55);
    setSliceGap(2);
    setIconSize(32);
    setStartAngle(0);
    setDirection('clockwise');
    setAnimation('spring');
    setReducedMotion('auto');
    setBg('rgba(20, 20, 20, 0.78)');
    setSliceFill('rgba(236, 230, 216, 0.06)');
    setSliceFillHover('#d4ff00');
    setIconColor('#ece6d8');
    setLabelColor('rgba(255,255,255,0.85)');
    setCustomRender(false);
  };

  const generatedCode = useMemo(() => {
    const itemsJsx = items
      .map((it) => {
        const dis = it.disabled ? ', disabled: true' : '';
        if (customRender) {
          return `    { id: '${it.id}', label: '${it.label}'${dis}, onSelect: () => {}, render: ({ hovered }) => <BigEmoji hovered={hovered}>${it.emoji}</BigEmoji> },`;
        }
        return `    { id: '${it.id}', label: '${it.label}', icon: <span>${it.emoji}</span>${dis}, onSelect: () => {} },`;
      })
      .join('\n');
    return `<RadialDock
  items={[
${itemsJsx}
  ]}
  outerRadius={${outerRadius}}
  innerRadius={${innerRadius}}
  sliceGap={${sliceGap}}
  iconSize={${iconSize}}
  startAngle={${startAngle}}
  direction="${direction}"
  animation="${animation}"
  reducedMotion="${reducedMotion}"
  theme={{
    bg: '${bg}',
    sliceFill: '${sliceFill}',
    sliceFillHover: '${sliceFillHover}',
    iconColor: '${iconColor}',
    labelColor: '${labelColor}',
  }}
/>`;
  }, [
    items, outerRadius, innerRadius, sliceGap, iconSize, startAngle, direction,
    animation, reducedMotion, bg, sliceFill, sliceFillHover, iconColor,
    labelColor, customRender,
  ]);

  const dockReady = stage && size.w > 0 && size.h > 0;

  return (
    <div className="pg-grid">
      {/* ───────── CONTROLS ───────── */}
      <div className="pg-controls">
        <PgSection title="Items / Wedges">
          <div className="pg-items-list">
            {items.map((it) => (
              <div key={it.id} className="pg-item">
                <button
                  type="button"
                  className="pg-emoji"
                  aria-label="Pick emoji"
                  onClick={() => setPickingItem(pickingItem === it.id ? null : it.id)}
                >
                  {it.emoji}
                </button>
                <input
                  type="text"
                  value={it.label}
                  maxLength={20}
                  onChange={(e) => updateItem(it.id, { label: e.target.value })}
                  aria-label={`Label for ${it.id}`}
                />
                <label className="pg-checkbox" title="Disable">
                  <input
                    type="checkbox"
                    checked={it.disabled}
                    onChange={(e) => updateItem(it.id, { disabled: e.target.checked })}
                  />
                  off
                </label>
                <button
                  type="button"
                  className="pg-btn danger"
                  onClick={() => removeItem(it.id)}
                  disabled={items.length <= 3}
                  aria-label="Remove"
                  title={items.length <= 3 ? 'Minimum 3 items' : 'Remove'}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {pickingItem && (
            <div className="pg-emoji-picker">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => { updateItem(pickingItem, { emoji: e }); setPickingItem(null); }}
                  aria-label={`Pick ${e}`}
                >
                  {e}
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            className="pg-btn full"
            onClick={addItem}
            disabled={items.length >= 8}
            style={{ marginTop: 10 }}
          >
            + Add Item ({items.length}/8)
          </button>
        </PgSection>

        <PgSection title="Geometry">
          <Slider label="Outer Radius" value={outerRadius} min={60} max={200} unit="px" onChange={setOuterRadius} />
          <Slider label="Inner Radius" value={innerRadius} min={0} max={Math.max(0, outerRadius - 20)} unit="px" onChange={setInnerRadius} />
          <Slider label="Slice Gap" value={sliceGap} min={0} max={20} unit="px" onChange={setSliceGap} />
          <Slider label="Icon Size" value={iconSize} min={16} max={48} unit="px" onChange={setIconSize} />
          <Slider label="Start Angle" value={startAngle} min={0} max={359} unit="°" onChange={setStartAngle} />
          <Seg
            label="Direction"
            value={direction}
            options={[
              { value: 'clockwise', label: 'CW' },
              { value: 'counter-clockwise', label: 'CCW' },
            ]}
            onChange={setDirection}
          />
        </PgSection>

        <PgSection title="Animation">
          <Seg
            label="Preset"
            value={animation}
            options={ANIMATIONS.map((a) => ({ value: a, label: a }))}
            onChange={setAnimation}
          />
          <Seg
            label="Reduced Motion"
            value={reducedMotion}
            options={REDUCED.map((r) => ({ value: r, label: r }))}
            onChange={setReducedMotion}
          />
        </PgSection>

        <PgSection title="Theme">
          <ColorRow label="Slice fill (hover)" value={sliceFillHover} onChange={setSliceFillHover} />
          <ColorRow label="Icon color" value={iconColor} onChange={setIconColor} />
          <TextRow label="Slice fill" value={sliceFill} onChange={setSliceFill} />
          <TextRow label="Background" value={bg} onChange={setBg} />
          <TextRow label="Label color" value={labelColor} onChange={setLabelColor} />
        </PgSection>

        <PgSection title="Custom Render">
          <label className="pg-checkbox" style={{ marginBottom: 4 }}>
            <input
              type="checkbox"
              checked={customRender}
              onChange={(e) => setCustomRender(e.target.checked)}
            />
            Use a custom render fn (big emoji + chip label)
          </label>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--mute)', margin: '6px 0 0' }}>
            Each item.render receives <code>{'{ hovered, index }'}</code> — return any JSX.
          </p>
        </PgSection>

        <PgSection title="">
          <button type="button" className="pg-btn full primary" onClick={reset}>
            ↺ Reset to defaults
          </button>
        </PgSection>
      </div>

      {/* ───────── STAGE + CODE ───────── */}
      <div className="pg-stage-wrap">
        <div className="pg-stage-bar">
          <span>STAGE / ALWAYS-OPEN</span>
          <span className="grow" />
          <span className={lastSelected ? 'selected' : ''}>
            {lastSelected ? `▸ Selected · ${lastSelected}` : '— hover any wedge —'}
          </span>
        </div>

        <div className="pg-stage" ref={setStage}>
          {dockReady && (
            <RadialDock
              items={dockItems}
              open
              onOpenChange={() => { /* always-open */ }}
              position={{ x: size.w / 2, y: size.h / 2 }}
              portalContainer={stage}
              classNames={{ overlay: 'pg-overlay' }}
              triggers={{ rightClick: false, hotkey: false }}
              outerRadius={outerRadius}
              innerRadius={Math.min(innerRadius, Math.max(0, outerRadius - 20))}
              sliceGap={sliceGap}
              iconSize={iconSize}
              startAngle={startAngle}
              direction={direction}
              animation={animation}
              reducedMotion={reducedMotion}
              ariaLabel="Playground dock"
              theme={{
                bg,
                bgBlur: '14px',
                sliceFill,
                sliceFillHover,
                iconColor,
                iconColorHover: '#0a0908',
                labelColor,
                shadow: '0 16px 40px rgba(0, 0, 0, 0.55)',
              }}
            />
          )}
        </div>

        <div className="pg-code-wrap">
          <div className="pg-code-bar">
            <span>GENERATED · YOUR CONFIG · TSX</span>
            <CopyButton text={generatedCode} className="pg-btn">
              Copy JSX
            </CopyButton>
          </div>
          <pre><code>{generatedCode}</code></pre>
        </div>
      </div>
    </div>
  );
}

/* ───────── helper components ───────── */

function PgSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="pg-section">
      {title && <h4>{title}</h4>}
      {children}
    </section>
  );
}

function Slider({
  label, value, min, max, unit, onChange,
}: {
  label: string; value: number; min: number; max: number; unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="pg-row">
      <span className="pg-label">{label}</span>
      <span className="pg-value">{value}{unit ?? ''}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        aria-label={label}
      />
    </div>
  );
}

function Seg<T extends string>({
  label, value, options, onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="pg-row">
      <span className="pg-label">{label}</span>
      <span className="pg-value">{value}</span>
      <div className="pg-seg">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            className={value === o.value ? 'on' : ''}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ColorRow({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  // Strip alpha for the color input (it doesn't support rgba).
  const hex = toHex(value) ?? '#000000';
  return (
    <div className="pg-row">
      <span className="pg-label">{label}</span>
      <input
        type="color"
        value={hex}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      />
    </div>
  );
}

function TextRow({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="pg-row">
      <span className="pg-label">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        style={{ width: 130 }}
      />
    </div>
  );
}

function toHex(raw: string): string | null {
  if (raw.startsWith('#')) return raw.slice(0, 7);
  return null;
}
