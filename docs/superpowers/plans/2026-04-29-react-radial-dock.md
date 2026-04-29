# react-radial-dock Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `react-radial-dock@0.1.0` — a framework-agnostic, GSAP-animated radial dock React component — to npm, matching the spec in `BRAINSTORMING.md`.

**Architecture:** A single React component (`RadialDock`) renders a portal overlay containing a donut SVG whose wedge paths are computed from polar geometry. State is split between an always-mounted outer component (open/close orchestration, triggers, controllable state) and an inner overlay component (mounted only while open) that owns hover state and a GSAP timeline keyed off `animation`. CSS variables drive theming; presets are pluggable `{ open(timeline, ctx), close(timeline, ctx) }` modules.

**Tech Stack:** TypeScript 5, React 19 (peer ≥18), GSAP 3.12+ (peer), tsup (build), Vitest + Testing Library + jsdom (unit/integration), Playwright (e2e), Changesets (release), pnpm (package manager).

---

## Working directory

All paths are **relative to** `/Users/rupamshil/dev/plugins/react-radial-dock/`.

Run all commands from that directory unless stated otherwise.

---

## Phase 0 — Scaffolding

No tests in this phase; the goal is a working build pipeline. Each task ends with a verification command and a commit.

### Task 0.1: Initialize git, .gitignore, .npmrc, .nvmrc

**Files:**
- Create: `.gitignore`
- Create: `.npmrc`
- Create: `.nvmrc`

- [ ] **Step 1: Init git**

```bash
git init -b main
git add BRAINSTORMING.md docs
git commit -m "chore: initial spec and plan"
```

- [ ] **Step 2: Write `.gitignore`**

```
node_modules/
dist/
coverage/
.DS_Store
*.log
.env
.env.*
!.env.example
playwright-report/
test-results/
.turbo/
.next/
.tsbuildinfo
.vscode/
.idea/
```

- [ ] **Step 3: Write `.npmrc`**

```
auto-install-peers=true
strict-peer-dependencies=false
engine-strict=true
```

- [ ] **Step 4: Write `.nvmrc`**

```
24
```

- [ ] **Step 5: Commit**

```bash
git add .gitignore .npmrc .nvmrc
git commit -m "chore: gitignore + npmrc"
```

---

### Task 0.2: Author `package.json`

**Files:**
- Create: `package.json`

- [ ] **Step 1: Write `package.json`** (do not run `pnpm init`; this is the canonical version)

```json
{
  "name": "react-radial-dock",
  "version": "0.0.0",
  "description": "Customizable, GSAP-animated radial action dock for React.",
  "license": "MIT",
  "author": "Rupam Shil",
  "type": "module",
  "sideEffects": ["**/*.css"],
  "files": ["dist", "README.md", "LICENSE"],
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    },
    "./styles.css": "./dist/styles.css",
    "./presets": {
      "types": "./dist/presets.d.ts",
      "import": "./dist/presets.mjs",
      "require": "./dist/presets.cjs"
    }
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "lint": "eslint src",
    "typecheck": "tsc --noEmit",
    "release": "changeset publish"
  },
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18",
    "gsap": ">=3.12"
  },
  "devDependencies": {
    "@changesets/cli": "^2.27.0",
    "@playwright/test": "^1.47.0",
    "@testing-library/jest-dom": "^6.5.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "eslint": "^9.0.0",
    "eslint-plugin-react": "^7.35.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "gsap": "^3.12.5",
    "jsdom": "^25.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tsup": "^8.3.0",
    "typescript": "^5.6.0",
    "vitest": "^2.1.0"
  },
  "keywords": ["react", "radial", "menu", "dock", "context-menu", "gsap", "animation"],
  "repository": "github:rupamshil/react-radial-dock",
  "engines": {
    "node": ">=20"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `pnpm install`
Expected: success, `pnpm-lock.yaml` created.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: package.json + dependencies"
```

---

### Task 0.3: Author `tsconfig.json`

**Files:**
- Create: `tsconfig.json`
- Create: `tsconfig.build.json`

- [ ] **Step 1: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": false,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "types": ["vitest/globals", "@testing-library/jest-dom", "node"]
  },
  "include": ["src", "tests", "vitest.config.ts", "tsup.config.ts", "playwright.config.ts"],
  "exclude": ["dist", "node_modules", "examples/nextjs-app"]
}
```

- [ ] **Step 2: Verify typecheck runs (and passes vacuously — no source yet)**

Run: `pnpm typecheck`
Expected: exits 0 (no files to type-check yet, or trivial pass).

- [ ] **Step 3: Commit**

```bash
git add tsconfig.json
git commit -m "chore: tsconfig"
```

---

### Task 0.4: Author `tsup.config.ts`

**Files:**
- Create: `tsup.config.ts`
- Create stubs: `src/index.ts`, `src/presets/index.ts`, `src/styles.css`

- [ ] **Step 1: Write `tsup.config.ts`**

```ts
import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: { index: 'src/index.ts', presets: 'src/presets/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    sourcemap: false,
    minify: false,
    treeshake: true,
    external: ['react', 'react-dom', 'gsap'],
    banner: { js: "'use client';" },
  },
  {
    entry: ['src/styles.css'],
    outDir: 'dist',
    format: ['esm'],
    clean: false,
    loader: { '.css': 'copy' },
  },
]);
```

- [ ] **Step 2: Write stub `src/index.ts`**

```ts
export {};
```

- [ ] **Step 3: Write stub `src/presets/index.ts`**

```ts
export {};
```

- [ ] **Step 4: Write stub `src/styles.css`**

```css
/* react-radial-dock styles — see Phase 7 */
```

- [ ] **Step 5: Run a build to confirm tsup wiring works**

Run: `pnpm build`
Expected: exits 0; `dist/index.mjs`, `dist/index.cjs`, `dist/index.d.ts`, `dist/presets.*`, `dist/styles.css` exist.

- [ ] **Step 6: Commit**

```bash
git add tsup.config.ts src/
git commit -m "chore: tsup build config + stubs"
```

---

### Task 0.5: Author `vitest.config.ts` and test setup

**Files:**
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`

- [ ] **Step 1: Write `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    exclude: ['tests/e2e/**', 'node_modules/**', 'dist/**'],
    css: false,
  },
});
```

- [ ] **Step 2: Write `tests/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
```

- [ ] **Step 3: Verify vitest can boot**

Run: `pnpm test`
Expected: "No test files found" (exits 0 or with a "no tests" message — that's fine).

- [ ] **Step 4: Commit**

```bash
git add vitest.config.ts tests/setup.ts
git commit -m "chore: vitest config + setup"
```

---

### Task 0.6: Author ESLint config

**Files:**
- Create: `eslint.config.js`

- [ ] **Step 1: Write `eslint.config.js`**

```js
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'examples/nextjs-app/**', 'coverage/**'],
  },
  {
    files: ['src/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        HTMLElement: 'readonly',
        SVGSVGElement: 'readonly',
        SVGPathElement: 'readonly',
        KeyboardEvent: 'readonly',
        MouseEvent: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooks,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
    settings: { react: { version: 'detect' } },
  },
];
```

- [ ] **Step 2: Verify lint runs**

Run: `pnpm lint`
Expected: exits 0 (only stub files; nothing to lint or trivial pass).

- [ ] **Step 3: Commit**

```bash
git add eslint.config.js
git commit -m "chore: eslint config"
```

---

## Phase 1 — Public types

### Task 1.1: Write `src/types.ts`

**Files:**
- Create: `src/types.ts`

- [ ] **Step 1: Write `src/types.ts`** — verbatim from spec sections 3.1–3.5, plus an internal animation preset shape.

```ts
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
```

- [ ] **Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/types.ts
git commit -m "feat(types): public type definitions"
```

---

## Phase 2 — Geometry (TDD)

### Task 2.1: `degToRad` + `polarToCartesian`

**Files:**
- Create: `src/geometry.ts`
- Create: `tests/geometry.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// tests/geometry.test.ts
import { describe, it, expect } from 'vitest';
import { degToRad, polarToCartesian } from '../src/geometry';

describe('degToRad', () => {
  it('converts 0deg to 0rad', () => {
    expect(degToRad(0)).toBe(0);
  });
  it('converts 180deg to PI', () => {
    expect(degToRad(180)).toBeCloseTo(Math.PI, 10);
  });
  it('converts 90deg to PI/2', () => {
    expect(degToRad(90)).toBeCloseTo(Math.PI / 2, 10);
  });
});

describe('polarToCartesian', () => {
  // Convention: angle 0 = top (12 o'clock), angle PI/2 = right (3 o'clock).
  it('places angle 0 at top of circle', () => {
    const { x, y } = polarToCartesian(0, 0, 100, 0);
    expect(x).toBeCloseTo(0, 10);
    expect(y).toBeCloseTo(-100, 10);
  });
  it('places angle PI/2 at right', () => {
    const { x, y } = polarToCartesian(0, 0, 100, Math.PI / 2);
    expect(x).toBeCloseTo(100, 10);
    expect(y).toBeCloseTo(0, 10);
  });
  it('places angle PI at bottom', () => {
    const { x, y } = polarToCartesian(0, 0, 100, Math.PI);
    expect(x).toBeCloseTo(0, 10);
    expect(y).toBeCloseTo(100, 10);
  });
  it('respects center offset', () => {
    const { x, y } = polarToCartesian(50, 50, 10, 0);
    expect(x).toBeCloseTo(50, 10);
    expect(y).toBeCloseTo(40, 10);
  });
});
```

- [ ] **Step 2: Run tests, expect failure**

Run: `pnpm test geometry`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/geometry.ts` (this task only)**

```ts
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
```

- [ ] **Step 4: Run tests, expect pass**

Run: `pnpm test geometry`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/geometry.ts tests/geometry.test.ts
git commit -m "feat(geometry): degToRad + polarToCartesian"
```

---

### Task 2.2: `arcPath` (donut-wedge SVG path)

**Files:**
- Modify: `src/geometry.ts`
- Modify: `tests/geometry.test.ts`

- [ ] **Step 1: Append failing tests**

```ts
// append to tests/geometry.test.ts
import { arcPath } from '../src/geometry';

describe('arcPath', () => {
  it('produces a closed path with M/L/A/A/Z commands', () => {
    const d = arcPath({
      cx: 100,
      cy: 100,
      innerRadius: 30,
      outerRadius: 80,
      startAngle: 0,
      endAngle: Math.PI / 2,
    });
    expect(d).toMatch(/^M /);
    expect(d).toMatch(/Z\s*$/);
    // outer arc + inner arc = two A commands
    expect(d.match(/A /g)?.length).toBe(2);
  });

  it('uses largeArcFlag=1 for spans > PI', () => {
    const d = arcPath({
      cx: 0,
      cy: 0,
      innerRadius: 10,
      outerRadius: 20,
      startAngle: 0,
      endAngle: (3 * Math.PI) / 2,
    });
    // Outer arc command should contain "1 1" (large-arc=1, sweep=1) somewhere.
    expect(d).toMatch(/A \d+(\.\d+)? \d+(\.\d+)? 0 1 1/);
  });

  it('uses largeArcFlag=0 for spans <= PI', () => {
    const d = arcPath({
      cx: 0,
      cy: 0,
      innerRadius: 10,
      outerRadius: 20,
      startAngle: 0,
      endAngle: Math.PI / 2,
    });
    expect(d).toMatch(/A \d+(\.\d+)? \d+(\.\d+)? 0 0 1/);
  });

  it('matches snapshot at known coordinates', () => {
    const d = arcPath({
      cx: 100,
      cy: 100,
      innerRadius: 50,
      outerRadius: 100,
      startAngle: 0,
      endAngle: Math.PI / 2,
    });
    expect(d).toMatchInlineSnapshot();
  });
});
```

> Inline snapshot is created on first pass; let Vitest fill it.

- [ ] **Step 2: Run tests, expect failure**

Run: `pnpm test geometry`
Expected: FAIL — `arcPath` not exported.

- [ ] **Step 3: Implement `arcPath` in `src/geometry.ts`**

```ts
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
```

- [ ] **Step 4: Run tests, accept inline snapshot**

Run: `pnpm test geometry -u`
Expected: PASS, snapshot inlined.

- [ ] **Step 5: Re-run without `-u`**

Run: `pnpm test geometry`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/geometry.ts tests/geometry.test.ts
git commit -m "feat(geometry): arcPath donut wedge"
```

---

### Task 2.3: `angleToIndex`

**Files:**
- Modify: `src/geometry.ts`
- Modify: `tests/geometry.test.ts`

- [ ] **Step 1: Append failing tests**

```ts
import { angleToIndex } from '../src/geometry';

describe('angleToIndex', () => {
  // Center 100,100; n=4; startAngle=0 (slice 0 centered at top); clockwise.
  // Slices (cw, top→right→bottom→left): 0, 1, 2, 3.
  const cx = 100;
  const cy = 100;

  it('top of circle is slice 0 (n=4 cw, start=0)', () => {
    expect(angleToIndex(cx, cy - 50, cx, cy, 4, 0, 1)).toBe(0);
  });
  it('right of circle is slice 1 (n=4 cw)', () => {
    expect(angleToIndex(cx + 50, cy, cx, cy, 4, 0, 1)).toBe(1);
  });
  it('bottom of circle is slice 2 (n=4 cw)', () => {
    expect(angleToIndex(cx, cy + 50, cx, cy, 4, 0, 1)).toBe(2);
  });
  it('left of circle is slice 3 (n=4 cw)', () => {
    expect(angleToIndex(cx - 50, cy, cx, cy, 4, 0, 1)).toBe(3);
  });
  it('counter-clockwise reverses indices', () => {
    expect(angleToIndex(cx + 50, cy, cx, cy, 4, 0, -1)).toBe(3);
    expect(angleToIndex(cx - 50, cy, cx, cy, 4, 0, -1)).toBe(1);
  });
  it('startAngle=PI/2 shifts slice 0 to the right (n=4, cw)', () => {
    expect(angleToIndex(cx + 50, cy, cx, cy, 4, Math.PI / 2, 1)).toBe(0);
  });
  it('handles n=3 across all three sectors', () => {
    expect(angleToIndex(cx, cy - 50, cx, cy, 3, 0, 1)).toBe(0);
    // Slice 1 center: 0 + 1*(2π/3) ≈ 120°
    const a = (2 * Math.PI) / 3;
    const p1 = { x: cx + 50 * Math.sin(a), y: cy - 50 * Math.cos(a) };
    expect(angleToIndex(p1.x, p1.y, cx, cy, 3, 0, 1)).toBe(1);
  });
  it('handles n=12', () => {
    expect(angleToIndex(cx, cy - 50, cx, cy, 12, 0, 1)).toBe(0);
    // Slice 6 is opposite (bottom).
    expect(angleToIndex(cx, cy + 50, cx, cy, 12, 0, 1)).toBe(6);
  });
});
```

- [ ] **Step 2: Run tests, expect failure**

Run: `pnpm test geometry`
Expected: FAIL — `angleToIndex` not exported.

- [ ] **Step 3: Implement `angleToIndex` in `src/geometry.ts`**

```ts
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
```

- [ ] **Step 4: Run tests, expect pass**

Run: `pnpm test geometry`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/geometry.ts tests/geometry.test.ts
git commit -m "feat(geometry): angleToIndex"
```

---

### Task 2.4: `clampPosition`

**Files:**
- Modify: `src/geometry.ts`
- Modify: `tests/geometry.test.ts`

- [ ] **Step 1: Append failing tests**

```ts
import { clampPosition } from '../src/geometry';

describe('clampPosition', () => {
  const vp = { width: 1000, height: 800 };
  const r = 100;
  const pad = 8;
  const min = r + pad; // 108
  const maxX = vp.width - r - pad; // 892
  const maxY = vp.height - r - pad; // 692

  it('passes through points already inside', () => {
    expect(clampPosition({ x: 500, y: 400 }, r, vp)).toEqual({ x: 500, y: 400 });
  });
  it('clamps top-left corner', () => {
    expect(clampPosition({ x: 0, y: 0 }, r, vp)).toEqual({ x: min, y: min });
  });
  it('clamps bottom-right corner', () => {
    expect(clampPosition({ x: 9999, y: 9999 }, r, vp)).toEqual({ x: maxX, y: maxY });
  });
  it('handles viewport smaller than 2*radius (degenerate)', () => {
    const tiny = { width: 50, height: 50 };
    const out = clampPosition({ x: 25, y: 25 }, 100, tiny);
    expect(out.x).toBe(25);
    expect(out.y).toBe(25);
  });
});
```

- [ ] **Step 2: Run tests, expect failure**

Run: `pnpm test geometry`
Expected: FAIL — `clampPosition` not exported.

- [ ] **Step 3: Implement in `src/geometry.ts`**

```ts
export function clampPosition(
  pos: { x: number; y: number },
  outerRadius: number,
  viewport: { width: number; height: number },
  padding = 8,
): { x: number; y: number } {
  const min = outerRadius + padding;
  const maxX = viewport.width - outerRadius - padding;
  const maxY = viewport.height - outerRadius - padding;
  if (maxX < min || maxY < min) return pos;
  return {
    x: Math.min(Math.max(pos.x, min), maxX),
    y: Math.min(Math.max(pos.y, min), maxY),
  };
}
```

- [ ] **Step 4: Run tests, expect pass**

Run: `pnpm test geometry`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/geometry.ts tests/geometry.test.ts
git commit -m "feat(geometry): clampPosition"
```

---

### Task 2.5: `gapToRadians` and slice-range helper `computeSliceRanges`

**Files:**
- Modify: `src/geometry.ts`
- Modify: `tests/geometry.test.ts`

- [ ] **Step 1: Append failing tests**

```ts
import { gapToRadians, computeSliceRanges } from '../src/geometry';

describe('gapToRadians', () => {
  it('returns gap/iconRadius (small angle)', () => {
    expect(gapToRadians(2, 80)).toBeCloseTo(2 / 80, 10);
  });
  it('clamps to half-slice when gap too big', () => {
    // n=4, sliceSize=PI/2. half = PI/4 ≈ 0.785.
    // gapRad = 100/10 = 10 (huge). Clamp to half.
    const gap = gapToRadians(100, 10, Math.PI / 2);
    expect(gap).toBeCloseTo(Math.PI / 4 * 0.9, 5);
  });
});

describe('computeSliceRanges', () => {
  it('returns n ranges that span the circle minus gaps (cw, start=0)', () => {
    const r = computeSliceRanges({ n: 4, startRad: 0, dirSign: 1, gapRad: 0 });
    expect(r).toHaveLength(4);
    expect(r[0]!.start).toBeCloseTo(-Math.PI / 4, 10);
    expect(r[0]!.end).toBeCloseTo(Math.PI / 4, 10);
    expect(r[1]!.start).toBeCloseTo(Math.PI / 4, 10);
    expect(r[1]!.end).toBeCloseTo((3 * Math.PI) / 4, 10);
  });
  it('inserts gap on each side of every slice', () => {
    const gap = 0.05;
    const r = computeSliceRanges({ n: 4, startRad: 0, dirSign: 1, gapRad: gap });
    expect(r[0]!.start).toBeCloseTo(-Math.PI / 4 + gap / 2, 10);
    expect(r[0]!.end).toBeCloseTo(Math.PI / 4 - gap / 2, 10);
  });
  it('reverses for counter-clockwise', () => {
    const r = computeSliceRanges({ n: 4, startRad: 0, dirSign: -1, gapRad: 0 });
    // Slice 0 still centered at top (start=0), slice 1 to the LEFT.
    expect(r[1]!.start).toBeCloseTo(-(3 * Math.PI) / 4, 10);
    expect(r[1]!.end).toBeCloseTo(-Math.PI / 4, 10);
  });
});
```

- [ ] **Step 2: Run tests, expect failure**

Run: `pnpm test geometry`
Expected: FAIL.

- [ ] **Step 3: Implement in `src/geometry.ts`**

```ts
export function gapToRadians(sliceGapPx: number, iconRadius: number, sliceSize?: number): number {
  if (iconRadius <= 0) return 0;
  const raw = sliceGapPx / iconRadius;
  if (sliceSize == null) return raw;
  // Don't let the gap eat more than 90% of a slice.
  const cap = (sliceSize / 2) * 0.9;
  return Math.min(raw, cap);
}

export interface SliceRangesInput {
  n: number;
  startRad: number;
  dirSign: 1 | -1;
  /** Pre-clamped (use gapToRadians). */
  gapRad: number;
}

export interface SliceRange {
  /** Slice center angle (rad). */
  center: number;
  /** Slice start angle (rad), with gap inset applied. */
  start: number;
  /** Slice end angle (rad), with gap inset applied. */
  end: number;
}

export function computeSliceRanges({
  n,
  startRad,
  dirSign,
  gapRad,
}: SliceRangesInput): SliceRange[] {
  const sliceSize = (2 * Math.PI) / n;
  const half = sliceSize / 2;
  const ranges: SliceRange[] = [];
  for (let i = 0; i < n; i++) {
    const center = startRad + dirSign * i * sliceSize;
    const start = center - half + gapRad / 2;
    const end = center + half - gapRad / 2;
    ranges.push({ center, start, end });
  }
  return ranges;
}
```

- [ ] **Step 4: Run tests, expect pass**

Run: `pnpm test geometry`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/geometry.ts tests/geometry.test.ts
git commit -m "feat(geometry): gapToRadians + computeSliceRanges"
```

---

## Phase 3 — Hotkey parsing (TDD)

### Task 3.1: `parseHotkey` and `matchesHotkey`

**Files:**
- Create: `src/hotkey.ts`
- Create: `tests/hotkey.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// tests/hotkey.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { parseHotkey, matchesHotkey, isMacPlatform } from '../src/hotkey';

describe('parseHotkey', () => {
  it('parses single letter', () => {
    expect(parseHotkey('e')).toEqual({
      key: 'e',
      mod: false,
      shift: false,
      alt: false,
      meta: false,
      ctrl: false,
    });
  });
  it('parses mod+e', () => {
    expect(parseHotkey('mod+e')).toMatchObject({ key: 'e', mod: true });
  });
  it('parses shift+space (lowercased + space token)', () => {
    expect(parseHotkey('shift+space')).toMatchObject({ key: ' ', shift: true });
  });
  it('parses mod+shift+k', () => {
    expect(parseHotkey('mod+shift+k')).toMatchObject({
      key: 'k',
      mod: true,
      shift: true,
    });
  });
  it('is case-insensitive', () => {
    expect(parseHotkey('Mod+Shift+K')).toMatchObject({
      key: 'k',
      mod: true,
      shift: true,
    });
  });
  it('returns null for empty string', () => {
    expect(parseHotkey('')).toBeNull();
  });
  it('returns null for missing key', () => {
    expect(parseHotkey('mod+')).toBeNull();
  });
  it('returns null for "mod" alone (no key)', () => {
    expect(parseHotkey('mod')).toBeNull();
  });
});

describe('matchesHotkey', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'platform', { value: 'MacIntel', configurable: true });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  function makeEvent(init: Partial<KeyboardEvent>): KeyboardEvent {
    return new KeyboardEvent('keydown', { ...init });
  }

  it('mod+e matches metaKey on Mac', () => {
    const parsed = parseHotkey('mod+e')!;
    expect(matchesHotkey(makeEvent({ key: 'e', metaKey: true }), parsed)).toBe(true);
    expect(matchesHotkey(makeEvent({ key: 'e', ctrlKey: true }), parsed)).toBe(false);
  });
  it('mod+e matches ctrlKey on non-Mac', () => {
    Object.defineProperty(navigator, 'platform', { value: 'Win32', configurable: true });
    const parsed = parseHotkey('mod+e')!;
    expect(matchesHotkey(makeEvent({ key: 'e', ctrlKey: true }), parsed)).toBe(true);
    expect(matchesHotkey(makeEvent({ key: 'e', metaKey: true }), parsed)).toBe(false);
  });
  it('shift+space matches', () => {
    const parsed = parseHotkey('shift+space')!;
    expect(matchesHotkey(makeEvent({ key: ' ', shiftKey: true }), parsed)).toBe(true);
  });
  it('does not match if extra modifiers are pressed', () => {
    const parsed = parseHotkey('e')!;
    expect(matchesHotkey(makeEvent({ key: 'e', metaKey: true }), parsed)).toBe(false);
  });
  it('does not match if key differs', () => {
    const parsed = parseHotkey('e')!;
    expect(matchesHotkey(makeEvent({ key: 'f' }), parsed)).toBe(false);
  });
  it('matches case-insensitively for letter keys', () => {
    const parsed = parseHotkey('e')!;
    expect(matchesHotkey(makeEvent({ key: 'E' }), parsed)).toBe(true);
  });
});

describe('isMacPlatform', () => {
  it('detects Mac', () => {
    Object.defineProperty(navigator, 'platform', { value: 'MacIntel', configurable: true });
    expect(isMacPlatform()).toBe(true);
  });
  it('detects iPhone', () => {
    Object.defineProperty(navigator, 'platform', { value: 'iPhone', configurable: true });
    expect(isMacPlatform()).toBe(true);
  });
  it('detects non-Mac', () => {
    Object.defineProperty(navigator, 'platform', { value: 'Win32', configurable: true });
    expect(isMacPlatform()).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests, expect failure**

Run: `pnpm test hotkey`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/hotkey.ts`**

```ts
export interface ParsedHotkey {
  key: string; // lowercased
  mod: boolean; // 'mod' token — Cmd on Mac, Ctrl elsewhere
  shift: boolean;
  alt: boolean;
  meta: boolean; // explicit 'meta' or 'cmd'
  ctrl: boolean; // explicit 'ctrl'
}

const SPECIAL_KEYS: Record<string, string> = {
  space: ' ',
  enter: 'enter',
  return: 'enter',
  esc: 'escape',
  escape: 'escape',
  tab: 'tab',
  up: 'arrowup',
  down: 'arrowdown',
  left: 'arrowleft',
  right: 'arrowright',
};

export function parseHotkey(input: string): ParsedHotkey | null {
  if (!input || typeof input !== 'string') return null;
  const tokens = input
    .toLowerCase()
    .split('+')
    .map((t) => t.trim())
    .filter(Boolean);
  if (tokens.length === 0) return null;

  let key = '';
  let mod = false;
  let shift = false;
  let alt = false;
  let meta = false;
  let ctrl = false;

  for (const t of tokens) {
    if (t === 'mod') mod = true;
    else if (t === 'shift') shift = true;
    else if (t === 'alt' || t === 'option' || t === 'opt') alt = true;
    else if (t === 'meta' || t === 'cmd' || t === 'command') meta = true;
    else if (t === 'ctrl' || t === 'control') ctrl = true;
    else {
      key = SPECIAL_KEYS[t] ?? t;
    }
  }

  if (!key) return null;
  return { key, mod, shift, alt, meta, ctrl };
}

export function isMacPlatform(): boolean {
  if (typeof navigator === 'undefined') return false;
  const p = navigator.platform || '';
  return /mac|iphone|ipad|ipod/i.test(p);
}

export function matchesHotkey(event: KeyboardEvent, hk: ParsedHotkey): boolean {
  const isMac = isMacPlatform();
  const wantMeta = hk.meta || (hk.mod && isMac);
  const wantCtrl = hk.ctrl || (hk.mod && !isMac);
  if (event.metaKey !== wantMeta) return false;
  if (event.ctrlKey !== wantCtrl) return false;
  if (event.shiftKey !== hk.shift) return false;
  if (event.altKey !== hk.alt) return false;
  const k = (event.key ?? '').toLowerCase();
  return k === hk.key;
}

export function isDangerousHotkey(hk: ParsedHotkey): boolean {
  // Reserve for browser-critical bindings.
  if (hk.mod && !hk.shift && !hk.alt && (hk.key === 'r' || hk.key === 't' || hk.key === 'w')) {
    return true;
  }
  return false;
}
```

- [ ] **Step 4: Run tests, expect pass**

Run: `pnpm test hotkey`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hotkey.ts tests/hotkey.test.ts
git commit -m "feat(hotkey): parse + match, mac-aware mod"
```

---

## Phase 4 — Hooks (TDD where possible)

### Task 4.1: `useMounted`

**Files:**
- Create: `src/hooks/useMounted.ts`
- Create: `tests/hooks/useMounted.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// tests/hooks/useMounted.test.tsx
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMounted } from '../../src/hooks/useMounted';

describe('useMounted', () => {
  it('returns true after mount in jsdom', () => {
    const { result } = renderHook(() => useMounted());
    expect(result.current).toBe(true);
  });
});
```

- [ ] **Step 2: Run, expect failure**

Run: `pnpm test useMounted`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

```ts
// src/hooks/useMounted.ts
import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/** True only after client hydration; false during SSR. */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
```

- [ ] **Step 4: Run, expect pass**

Run: `pnpm test useMounted`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useMounted.ts tests/hooks/useMounted.test.tsx
git commit -m "feat(hooks): useMounted SSR guard"
```

---

### Task 4.2: `useReducedMotion`

**Files:**
- Create: `src/hooks/useReducedMotion.ts`
- Create: `tests/hooks/useReducedMotion.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// tests/hooks/useReducedMotion.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useReducedMotion } from '../../src/hooks/useReducedMotion';

describe('useReducedMotion', () => {
  let listeners: Array<(e: { matches: boolean }) => void> = [];
  let matches = false;
  const original = window.matchMedia;

  beforeEach(() => {
    listeners = [];
    matches = false;
    window.matchMedia = vi.fn().mockImplementation((q: string) => ({
      get matches() {
        return matches;
      },
      media: q,
      addEventListener: (_: string, cb: (e: { matches: boolean }) => void) => {
        listeners.push(cb);
      },
      removeEventListener: (_: string, cb: (e: { matches: boolean }) => void) => {
        listeners = listeners.filter((l) => l !== cb);
      },
      addListener: () => {},
      removeListener: () => {},
      onchange: null,
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;
  });
  afterEach(() => {
    window.matchMedia = original;
  });

  it('returns false when prefers-reduced-motion is no-preference', () => {
    const { result } = renderHook(() => useReducedMotion('auto'));
    expect(result.current).toBe(false);
  });

  it('returns true when mode is "always"', () => {
    const { result } = renderHook(() => useReducedMotion('always'));
    expect(result.current).toBe(true);
  });

  it('returns false when mode is "never" even if media matches', () => {
    matches = true;
    const { result } = renderHook(() => useReducedMotion('never'));
    expect(result.current).toBe(false);
  });

  it('updates when the media query changes (auto mode)', () => {
    const { result } = renderHook(() => useReducedMotion('auto'));
    expect(result.current).toBe(false);
    act(() => {
      matches = true;
      listeners.forEach((l) => l({ matches: true }));
    });
    expect(result.current).toBe(true);
  });
});
```

- [ ] **Step 2: Run, expect failure**

Run: `pnpm test useReducedMotion`
Expected: FAIL.

- [ ] **Step 3: Implement**

```ts
// src/hooks/useReducedMotion.ts
import { useSyncExternalStore } from 'react';
import type { RadialDockReducedMotion } from '../types';

const QUERY = '(prefers-reduced-motion: reduce)';

function getSnapshot(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia(QUERY).matches;
}

function subscribe(cb: () => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {};
  }
  const m = window.matchMedia(QUERY);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
}

const getServerSnapshot = () => false;

export function useReducedMotion(mode: RadialDockReducedMotion = 'auto'): boolean {
  const auto = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (mode === 'always') return true;
  if (mode === 'never') return false;
  return auto;
}
```

- [ ] **Step 4: Run, expect pass**

Run: `pnpm test useReducedMotion`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useReducedMotion.ts tests/hooks/useReducedMotion.test.tsx
git commit -m "feat(hooks): useReducedMotion"
```

---

### Task 4.3: `useControllableState`

**Files:**
- Create: `src/hooks/useControllableState.ts`
- Create: `tests/hooks/useControllableState.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// tests/hooks/useControllableState.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useControllableState } from '../../src/hooks/useControllableState';

describe('useControllableState', () => {
  it('uses defaultValue when uncontrolled', () => {
    const { result } = renderHook(() => useControllableState(undefined, undefined, false));
    expect(result.current[0]).toBe(false);
  });

  it('updates internal state in uncontrolled mode and fires onChange', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState(undefined, onChange, false));
    act(() => result.current[1](true));
    expect(result.current[0]).toBe(true);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('returns controlled value when controlled', () => {
    const { result, rerender } = renderHook(
      ({ controlled }: { controlled: boolean }) =>
        useControllableState(controlled, undefined, false),
      { initialProps: { controlled: true } },
    );
    expect(result.current[0]).toBe(true);
    rerender({ controlled: false });
    expect(result.current[0]).toBe(false);
  });

  it('does not modify internal state when controlled, but still calls onChange', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState(true, onChange, false));
    act(() => result.current[1](false));
    // controlled — value unchanged this render
    expect(result.current[0]).toBe(true);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('accepts updater function', () => {
    const { result } = renderHook(() => useControllableState(undefined, undefined, 0));
    act(() => result.current[1]((v: number) => v + 1));
    expect(result.current[0]).toBe(1);
  });
});
```

- [ ] **Step 2: Run, expect failure**

Run: `pnpm test useControllableState`
Expected: FAIL.

- [ ] **Step 3: Implement**

```ts
// src/hooks/useControllableState.ts
import { useCallback, useRef, useState } from 'react';

type Updater<T> = T | ((prev: T) => T);

export function useControllableState<T>(
  controlled: T | undefined,
  onChange: ((value: T) => void) | undefined,
  defaultValue: T,
): [T, (value: Updater<T>) => void] {
  const isControlled = controlled !== undefined;
  const [internal, setInternal] = useState<T>(defaultValue);
  const value = isControlled ? (controlled as T) : internal;

  // Keep latest in a ref so updater functions see fresh "prev".
  const valueRef = useRef(value);
  valueRef.current = value;

  const set = useCallback(
    (next: Updater<T>) => {
      const resolved =
        typeof next === 'function' ? (next as (p: T) => T)(valueRef.current) : next;
      if (!isControlled) setInternal(resolved);
      onChange?.(resolved);
    },
    [isControlled, onChange],
  );

  return [value, set];
}
```

- [ ] **Step 4: Run, expect pass**

Run: `pnpm test useControllableState`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useControllableState.ts tests/hooks/useControllableState.test.tsx
git commit -m "feat(hooks): useControllableState"
```

---

### Task 4.4: `useCursor`

**Files:**
- Create: `src/hooks/useCursor.ts`
- Create: `tests/hooks/useCursor.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// tests/hooks/useCursor.test.tsx
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCursor } from '../../src/hooks/useCursor';

describe('useCursor', () => {
  it('starts with null', () => {
    const { result } = renderHook(() => useCursor());
    expect(result.current.current).toBeNull();
  });
  it('updates ref on window mousemove', () => {
    const { result } = renderHook(() => useCursor());
    act(() => {
      window.dispatchEvent(
        new MouseEvent('mousemove', { clientX: 123, clientY: 456 }),
      );
    });
    expect(result.current.current).toEqual({ x: 123, y: 456 });
  });
  it('removes listener on unmount', () => {
    const { result, unmount } = renderHook(() => useCursor());
    unmount();
    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 1, clientY: 1 }));
    });
    // Ref still exists post-unmount; just shouldn't crash.
    expect(result.current.current).toBeNull();
  });
});
```

- [ ] **Step 2: Run, expect failure**

Run: `pnpm test useCursor`
Expected: FAIL.

- [ ] **Step 3: Implement**

```ts
// src/hooks/useCursor.ts
import { useEffect, useRef, type MutableRefObject } from 'react';

export interface CursorPos {
  x: number;
  y: number;
}

/** Track last-known cursor position via window mousemove. */
export function useCursor(): MutableRefObject<CursorPos | null> {
  const ref = useRef<CursorPos | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onMove = (e: MouseEvent) => {
      ref.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return ref;
}
```

- [ ] **Step 4: Run, expect pass**

Run: `pnpm test useCursor`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useCursor.ts tests/hooks/useCursor.test.tsx
git commit -m "feat(hooks): useCursor"
```

---

### Task 4.5: `useTriggers`

**Files:**
- Create: `src/hooks/useTriggers.ts`
- Create: `tests/hooks/useTriggers.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// tests/hooks/useTriggers.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTriggers } from '../../src/hooks/useTriggers';

describe('useTriggers', () => {
  let onTrigger: ReturnType<typeof vi.fn>;
  let onClose: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    onTrigger = vi.fn();
    onClose = vi.fn();
    Object.defineProperty(navigator, 'platform', { value: 'MacIntel', configurable: true });
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('right-click anywhere fires onTrigger with cursor', () => {
    renderHook(() =>
      useTriggers({
        rightClick: true,
        hotkey: false,
        enabled: true,
        onTrigger,
        onClose,
      }),
    );
    const evt = new MouseEvent('contextmenu', { clientX: 50, clientY: 60, cancelable: true, bubbles: true });
    act(() => {
      document.body.dispatchEvent(evt);
    });
    expect(onTrigger).toHaveBeenCalledWith(50, 60);
    expect(evt.defaultPrevented).toBe(true);
  });

  it('right-click inside <input> does NOT fire and lets default through', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    renderHook(() =>
      useTriggers({
        rightClick: true,
        hotkey: false,
        enabled: true,
        onTrigger,
        onClose,
      }),
    );
    const evt = new MouseEvent('contextmenu', { cancelable: true, bubbles: true });
    act(() => {
      input.dispatchEvent(evt);
    });
    expect(onTrigger).not.toHaveBeenCalled();
    expect(evt.defaultPrevented).toBe(false);
    input.remove();
  });

  it('honors custom ignoreSelectors', () => {
    const div = document.createElement('div');
    div.className = 'no-radial';
    document.body.appendChild(div);
    renderHook(() =>
      useTriggers({
        rightClick: { ignoreSelectors: ['.no-radial'] },
        hotkey: false,
        enabled: true,
        onTrigger,
        onClose,
      }),
    );
    act(() => {
      div.dispatchEvent(new MouseEvent('contextmenu', { cancelable: true, bubbles: true }));
    });
    expect(onTrigger).not.toHaveBeenCalled();
    div.remove();
  });

  it('hotkey fires onTrigger with last-known cursor', () => {
    renderHook(() =>
      useTriggers({
        rightClick: false,
        hotkey: 'mod+e',
        enabled: true,
        onTrigger,
        onClose,
      }),
    );
    // First, set cursor.
    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 200 }));
    });
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'e', metaKey: true, cancelable: true, bubbles: true }),
      );
    });
    expect(onTrigger).toHaveBeenCalledWith(100, 200);
  });

  it('Escape fires onClose', () => {
    renderHook(() =>
      useTriggers({
        rightClick: false,
        hotkey: false,
        enabled: true,
        onTrigger,
        onClose,
      }),
    );
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(onClose).toHaveBeenCalled();
  });

  it('disabled (enabled=false) attaches no triggers', () => {
    renderHook(() =>
      useTriggers({
        rightClick: true,
        hotkey: 'mod+e',
        enabled: false,
        onTrigger,
        onClose,
      }),
    );
    act(() => {
      document.body.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', metaKey: true }));
    });
    expect(onTrigger).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run, expect failure**

Run: `pnpm test useTriggers`
Expected: FAIL.

- [ ] **Step 3: Implement**

```ts
// src/hooks/useTriggers.ts
import { useEffect, useRef } from 'react';
import { matchesHotkey, parseHotkey } from '../hotkey';

export interface UseTriggersOptions {
  rightClick: boolean | { ignoreSelectors?: string[] };
  hotkey: string | false;
  enabled: boolean;
  onTrigger: (x?: number, y?: number) => void;
  onClose: () => void;
}

const DEFAULT_IGNORE = ['input', 'textarea', '[contenteditable]', '[contenteditable="true"]'];

export function useTriggers({
  rightClick,
  hotkey,
  enabled,
  onTrigger,
  onClose,
}: UseTriggersOptions): void {
  // Stable refs for callbacks so listeners don't churn.
  const onTriggerRef = useRef(onTrigger);
  const onCloseRef = useRef(onClose);
  onTriggerRef.current = onTrigger;
  onCloseRef.current = onClose;

  // Track cursor for hotkey-triggered open.
  const cursorRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !enabled) return;

    const ignoreSelectors = [
      ...DEFAULT_IGNORE,
      ...(typeof rightClick === 'object' && rightClick?.ignoreSelectors
        ? rightClick.ignoreSelectors
        : []),
    ];

    const cleanups: Array<() => void> = [];

    if (rightClick !== false) {
      const onContext = (e: MouseEvent) => {
        const target = e.target as Element | null;
        if (target && ignoreSelectors.some((sel) => target.closest(sel))) return;
        e.preventDefault();
        onTriggerRef.current(e.clientX, e.clientY);
      };
      window.addEventListener('contextmenu', onContext);
      cleanups.push(() => window.removeEventListener('contextmenu', onContext));
    }

    if (hotkey) {
      const parsed = parseHotkey(hotkey);
      if (parsed) {
        const onKey = (e: KeyboardEvent) => {
          if (matchesHotkey(e, parsed)) {
            e.preventDefault();
            const c = cursorRef.current;
            onTriggerRef.current(c?.x, c?.y);
          }
        };
        window.addEventListener('keydown', onKey);
        cleanups.push(() => window.removeEventListener('keydown', onKey));
      } else if (process.env.NODE_ENV !== 'production') {
        console.warn(`[react-radial-dock] Could not parse hotkey "${hotkey}" — disabled.`);
      }
    }

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', onEsc);
    cleanups.push(() => window.removeEventListener('keydown', onEsc));

    return () => {
      for (const fn of cleanups) fn();
    };
  }, [enabled, hotkey, JSON.stringify(rightClick)]);
}
```

> Note: `JSON.stringify(rightClick)` is used as a dependency to avoid re-attaching when an inline object literal has the same shape. Acceptable for this small object.

- [ ] **Step 4: Run, expect pass**

Run: `pnpm test useTriggers`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useTriggers.ts tests/hooks/useTriggers.test.tsx
git commit -m "feat(hooks): useTriggers (right-click + hotkey + esc)"
```

---

### Task 4.6: `useExitTransition`

**Files:**
- Create: `src/hooks/useExitTransition.ts`
- Create: `tests/hooks/useExitTransition.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// tests/hooks/useExitTransition.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useExitTransition } from '../../src/hooks/useExitTransition';

describe('useExitTransition', () => {
  it('mounts immediately when open=true', () => {
    const { result } = renderHook(() => useExitTransition(true));
    expect(result.current.shouldRender).toBe(true);
    expect(result.current.phase).toBe('open');
  });
  it('starts unmounted when open=false', () => {
    const { result } = renderHook(() => useExitTransition(false));
    expect(result.current.shouldRender).toBe(false);
    expect(result.current.phase).toBe('closed');
  });
  it('keeps mounted during exit until done() is called', () => {
    const { result, rerender } = renderHook(({ open }: { open: boolean }) => useExitTransition(open), {
      initialProps: { open: true },
    });
    expect(result.current.shouldRender).toBe(true);
    rerender({ open: false });
    expect(result.current.shouldRender).toBe(true);
    expect(result.current.phase).toBe('closing');
    act(() => result.current.done());
    expect(result.current.shouldRender).toBe(false);
    expect(result.current.phase).toBe('closed');
  });
  it('cancels exit if reopened', () => {
    const { result, rerender } = renderHook(({ open }: { open: boolean }) => useExitTransition(open), {
      initialProps: { open: true },
    });
    rerender({ open: false });
    expect(result.current.phase).toBe('closing');
    rerender({ open: true });
    expect(result.current.phase).toBe('open');
    expect(result.current.shouldRender).toBe(true);
  });
});
```

- [ ] **Step 2: Run, expect failure**

Run: `pnpm test useExitTransition`
Expected: FAIL.

- [ ] **Step 3: Implement**

```ts
// src/hooks/useExitTransition.ts
import { useCallback, useEffect, useState } from 'react';

export type ExitPhase = 'closed' | 'open' | 'closing';

export interface ExitTransitionState {
  shouldRender: boolean;
  phase: ExitPhase;
  /** Call when the close animation has finished. */
  done: () => void;
}

export function useExitTransition(open: boolean): ExitTransitionState {
  const [phase, setPhase] = useState<ExitPhase>(open ? 'open' : 'closed');

  useEffect(() => {
    if (open) {
      setPhase('open');
    } else {
      setPhase((p) => (p === 'closed' ? 'closed' : 'closing'));
    }
  }, [open]);

  const done = useCallback(() => {
    setPhase((p) => (p === 'closing' ? 'closed' : p));
  }, []);

  return {
    shouldRender: phase !== 'closed',
    phase,
    done,
  };
}
```

- [ ] **Step 4: Run, expect pass**

Run: `pnpm test useExitTransition`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useExitTransition.ts tests/hooks/useExitTransition.test.tsx
git commit -m "feat(hooks): useExitTransition"
```

---

## Phase 5 — Animation Presets (TDD)

### Task 5.1: GSAP test mock + preset registry

**Files:**
- Create: `tests/mocks/gsap.ts`
- Create: `src/presets/index.ts` (replace stub)

- [ ] **Step 1: Write GSAP mock**

```ts
// tests/mocks/gsap.ts
import { vi } from 'vitest';

export interface MockTimelineCall {
  method: string;
  args: unknown[];
}

export function createMockTimeline() {
  const calls: MockTimelineCall[] = [];
  let onCompleteCb: (() => void) | null = null;
  const tl = {
    calls,
    to: vi.fn((target: unknown, vars: unknown, pos?: unknown) => {
      calls.push({ method: 'to', args: [target, vars, pos] });
      return tl;
    }),
    from: vi.fn((target: unknown, vars: unknown, pos?: unknown) => {
      calls.push({ method: 'from', args: [target, vars, pos] });
      return tl;
    }),
    fromTo: vi.fn((target: unknown, fromV: unknown, toV: unknown, pos?: unknown) => {
      calls.push({ method: 'fromTo', args: [target, fromV, toV, pos] });
      return tl;
    }),
    set: vi.fn((target: unknown, vars: unknown, pos?: unknown) => {
      calls.push({ method: 'set', args: [target, vars, pos] });
      return tl;
    }),
    play: vi.fn(() => tl),
    reverse: vi.fn(() => tl),
    pause: vi.fn(() => tl),
    kill: vi.fn(() => tl),
    eventCallback: vi.fn((name: string, cb: (() => void) | null) => {
      if (name === 'onComplete') onCompleteCb = cb;
      return tl;
    }),
    /** Test helper. */
    fireOnComplete() {
      onCompleteCb?.();
    },
  };
  return tl;
}

export function makeMockContext() {
  const container = document.createElement('div');
  const disk = document.createElement('div');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const slices = Array.from({ length: 4 }, () =>
    document.createElementNS('http://www.w3.org/2000/svg', 'path'),
  );
  const icons = Array.from({ length: 4 }, () => document.createElement('div'));
  return {
    container,
    disk,
    svg,
    slices,
    icons,
    n: 4,
    sliceSize: Math.PI / 2,
    outerRadius: 110,
    innerRadius: 55,
    centerX: 0,
    centerY: 0,
  };
}
```

- [ ] **Step 2: Replace `src/presets/index.ts` with the registry**

```ts
// src/presets/index.ts
import { spring } from './spring';
import { fade } from './fade';
import { pop } from './pop';
import { stagger } from './stagger';
import { iris } from './iris';
import type { RadialDockAnimationCustom, RadialDockAnimationName } from '../types';

export { spring, fade, pop, stagger, iris };

export const presets: Record<RadialDockAnimationName, RadialDockAnimationCustom> = {
  spring,
  fade,
  pop,
  stagger,
  iris,
};
```

- [ ] **Step 3: Stub each preset file (will be filled by 5.2–5.6)**

Create files `src/presets/{spring,fade,pop,stagger,iris}.ts` each with content:

```ts
// src/presets/spring.ts (etc.)
import type { RadialDockAnimationCustom } from '../types';

export const spring: RadialDockAnimationCustom = {
  open: () => {
    throw new Error('not implemented');
  },
  close: () => {
    throw new Error('not implemented');
  },
};
```

(Repeat for `fade`, `pop`, `stagger`, `iris`.)

- [ ] **Step 4: Verify typecheck**

Run: `pnpm typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add tests/mocks/gsap.ts src/presets/
git commit -m "feat(presets): registry + GSAP test mock"
```

---

### Task 5.2: `spring` preset

**Files:**
- Replace: `src/presets/spring.ts`
- Create: `tests/presets.test.ts`

- [ ] **Step 1: Write failing tests for `spring`**

```ts
// tests/presets.test.ts
import { describe, it, expect } from 'vitest';
import { createMockTimeline, makeMockContext } from './mocks/gsap';
import { spring, fade, pop, stagger, iris } from '../src/presets';

describe('spring preset', () => {
  it('open registers a tween on the disk and on icons', () => {
    const tl = createMockTimeline();
    const ctx = makeMockContext();
    spring.open(tl, ctx);
    const targets = tl.calls.map((c) => c.args[0]);
    expect(targets).toContain(ctx.disk);
    expect(targets).toContain(ctx.icons);
  });
  it('open uses fromTo for at least one target', () => {
    const tl = createMockTimeline();
    spring.open(tl, makeMockContext());
    expect(tl.calls.some((c) => c.method === 'fromTo')).toBe(true);
  });
  it('close registers tweens', () => {
    const tl = createMockTimeline();
    spring.close(tl, makeMockContext());
    expect(tl.calls.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run, expect failure**

Run: `pnpm test presets`
Expected: FAIL.

- [ ] **Step 3: Implement `src/presets/spring.ts`**

```ts
// src/presets/spring.ts
import type { RadialDockAnimationCustom } from '../types';

export const spring: RadialDockAnimationCustom = {
  open: (tl, ctx) => {
    tl.fromTo(
      ctx.disk,
      { scale: 0.7, opacity: 0, transformOrigin: 'center center' },
      { scale: 1, opacity: 1, duration: 0.2, ease: 'power3.out' },
      0,
    ).fromTo(
      ctx.icons,
      { scale: 0, x: 0, y: 0, opacity: 0 },
      { scale: 1, x: 0, y: 0, opacity: 1, duration: 0.22, ease: 'back.out(1.4)' },
      0,
    );
  },
  close: (tl, ctx) => {
    tl.to(ctx.icons, { scale: 0, opacity: 0, duration: 0.12, ease: 'power2.in' }, 0).to(
      ctx.disk,
      { scale: 0.7, opacity: 0, duration: 0.12, ease: 'power2.in' },
      0,
    );
  },
};
```

- [ ] **Step 4: Run, expect pass**

Run: `pnpm test presets`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/presets/spring.ts tests/presets.test.ts
git commit -m "feat(presets): spring"
```

---

### Task 5.3: `fade` preset

**Files:**
- Replace: `src/presets/fade.ts`
- Modify: `tests/presets.test.ts`

- [ ] **Step 1: Append failing tests**

```ts
// append to tests/presets.test.ts
describe('fade preset', () => {
  it('open uses opacity-only fromTo', () => {
    const tl = createMockTimeline();
    fade.open(tl, makeMockContext());
    const targets = tl.calls.map((c) => c.args[0]);
    expect(targets).toContain(tl.calls[0]!.args[0]);
    // every fromTo must include opacity in to-vars
    tl.calls
      .filter((c) => c.method === 'fromTo')
      .forEach((c) => {
        expect(c.args[2]).toMatchObject({ opacity: 1 });
      });
  });
  it('close registers an opacity tween to 0', () => {
    const tl = createMockTimeline();
    fade.close(tl, makeMockContext());
    const hasOpacityZero = tl.calls.some(
      (c) => (c.args[1] as { opacity?: number })?.opacity === 0,
    );
    expect(hasOpacityZero).toBe(true);
  });
});
```

- [ ] **Step 2: Run, expect failure**

Run: `pnpm test presets`
Expected: FAIL.

- [ ] **Step 3: Implement**

```ts
// src/presets/fade.ts
import type { RadialDockAnimationCustom } from '../types';

export const fade: RadialDockAnimationCustom = {
  open: (tl, ctx) => {
    tl.fromTo(ctx.disk, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: 'power1.out' }, 0)
      .fromTo(ctx.icons, { opacity: 0 }, { opacity: 1, duration: 0.18, ease: 'power1.out' }, 0);
  },
  close: (tl, ctx) => {
    tl.to(ctx.icons, { opacity: 0, duration: 0.1 }, 0).to(
      ctx.disk,
      { opacity: 0, duration: 0.1 },
      0,
    );
  },
};
```

- [ ] **Step 4: Run, expect pass**

Run: `pnpm test presets`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/presets/fade.ts tests/presets.test.ts
git commit -m "feat(presets): fade"
```

---

### Task 5.4: `pop` preset

**Files:**
- Replace: `src/presets/pop.ts`
- Modify: `tests/presets.test.ts`

- [ ] **Step 1: Append failing tests**

```ts
describe('pop preset', () => {
  it('open uses scale fromTo for icons', () => {
    const tl = createMockTimeline();
    pop.open(tl, makeMockContext());
    const fromTos = tl.calls.filter((c) => c.method === 'fromTo');
    const iconsCall = fromTos.find((c) => Array.isArray(c.args[0]));
    expect(iconsCall).toBeDefined();
    expect(iconsCall?.args[1]).toMatchObject({ scale: 0 });
  });
});
```

- [ ] **Step 2: Run, expect failure**

Run: `pnpm test presets`
Expected: FAIL.

- [ ] **Step 3: Implement**

```ts
// src/presets/pop.ts
import type { RadialDockAnimationCustom } from '../types';

export const pop: RadialDockAnimationCustom = {
  open: (tl, ctx) => {
    tl.fromTo(
      ctx.disk,
      { scale: 0.5, opacity: 0, transformOrigin: 'center center' },
      { scale: 1, opacity: 1, duration: 0.25, ease: 'elastic.out(0.6, 0.5)' },
      0,
    ).fromTo(
      ctx.icons,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.22, ease: 'back.out(2)' },
      0,
    );
  },
  close: (tl, ctx) => {
    tl.to(ctx.icons, { scale: 0, opacity: 0, duration: 0.12, ease: 'power2.in' }, 0).to(
      ctx.disk,
      { scale: 0.5, opacity: 0, duration: 0.12 },
      0,
    );
  },
};
```

- [ ] **Step 4: Run, expect pass**

Run: `pnpm test presets`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/presets/pop.ts tests/presets.test.ts
git commit -m "feat(presets): pop"
```

---

### Task 5.5: `stagger` preset

**Files:**
- Replace: `src/presets/stagger.ts`
- Modify: `tests/presets.test.ts`

- [ ] **Step 1: Append failing tests**

```ts
describe('stagger preset', () => {
  it('open icons fromTo includes a stagger value', () => {
    const tl = createMockTimeline();
    stagger.open(tl, makeMockContext());
    const fromTos = tl.calls.filter((c) => c.method === 'fromTo');
    const iconsCall = fromTos.find((c) => Array.isArray(c.args[0]));
    expect(iconsCall).toBeDefined();
    const toVars = iconsCall!.args[2] as Record<string, unknown>;
    expect(typeof toVars.stagger === 'number' || typeof toVars.stagger === 'object').toBe(true);
  });
});
```

- [ ] **Step 2: Run, expect failure**

Run: `pnpm test presets`
Expected: FAIL.

- [ ] **Step 3: Implement**

```ts
// src/presets/stagger.ts
import type { RadialDockAnimationCustom } from '../types';

export const stagger: RadialDockAnimationCustom = {
  open: (tl, ctx) => {
    tl.fromTo(
      ctx.disk,
      { scale: 0.7, opacity: 0, transformOrigin: 'center center' },
      { scale: 1, opacity: 1, duration: 0.18, ease: 'power3.out' },
      0,
    ).fromTo(
      ctx.icons,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.22, ease: 'back.out(1.4)', stagger: 0.04 },
      0.05,
    );
  },
  close: (tl, ctx) => {
    tl.to(
      ctx.icons,
      { scale: 0, opacity: 0, duration: 0.1, stagger: { each: 0.02, from: 'end' } },
      0,
    ).to(ctx.disk, { scale: 0.7, opacity: 0, duration: 0.12 }, 0.05);
  },
};
```

- [ ] **Step 4: Run, expect pass**

Run: `pnpm test presets`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/presets/stagger.ts tests/presets.test.ts
git commit -m "feat(presets): stagger"
```

---

### Task 5.6: `iris` preset

**Files:**
- Replace: `src/presets/iris.ts`
- Modify: `tests/presets.test.ts`

- [ ] **Step 1: Append failing tests**

```ts
describe('iris preset', () => {
  it('open animates clip-path on disk', () => {
    const tl = createMockTimeline();
    iris.open(tl, makeMockContext());
    const diskCall = tl.calls.find(
      (c) => c.method === 'fromTo' && (c.args[1] as Record<string, unknown>)?.clipPath != null,
    );
    expect(diskCall).toBeDefined();
  });
});
```

- [ ] **Step 2: Run, expect failure**

Run: `pnpm test presets`
Expected: FAIL.

- [ ] **Step 3: Implement**

```ts
// src/presets/iris.ts
import type { RadialDockAnimationCustom } from '../types';

export const iris: RadialDockAnimationCustom = {
  open: (tl, ctx) => {
    tl.fromTo(
      ctx.disk,
      { clipPath: 'circle(0% at center)', opacity: 1 },
      { clipPath: 'circle(150% at center)', duration: 0.3, ease: 'expo.out' },
      0,
    ).fromTo(
      ctx.icons,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.18, ease: 'power2.out' },
      0.15,
    );
  },
  close: (tl, ctx) => {
    tl.to(ctx.icons, { opacity: 0, scale: 0.8, duration: 0.1 }, 0).to(
      ctx.disk,
      { clipPath: 'circle(0% at center)', duration: 0.18, ease: 'expo.in' },
      0,
    );
  },
};
```

- [ ] **Step 4: Run, expect pass**

Run: `pnpm test presets`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/presets/iris.ts tests/presets.test.ts
git commit -m "feat(presets): iris"
```

---

## Phase 6 — `useGsapTimeline` hook

> Why a hook test rather than full E2E here: GSAP touches real DOM. We isolate by injecting a `gsap` dependency we can swap with the mock.

### Task 6.1: GSAP loader (lazy import + missing-peer error)

**Files:**
- Create: `src/gsap-loader.ts`
- Create: `tests/gsap-loader.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// tests/gsap-loader.test.ts
import { describe, it, expect, vi } from 'vitest';
import { loadGsap, GsapMissingError } from '../src/gsap-loader';

describe('loadGsap', () => {
  it('returns gsap when peer is installed', async () => {
    const g = await loadGsap();
    expect(g).toBeTruthy();
    expect(typeof g.timeline).toBe('function');
  });
  it('exports GsapMissingError', () => {
    const err = new GsapMissingError();
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('GsapMissingError');
  });
});
```

- [ ] **Step 2: Run, expect failure**

Run: `pnpm test gsap-loader`
Expected: FAIL.

- [ ] **Step 3: Implement**

```ts
// src/gsap-loader.ts
type GsapModule = typeof import('gsap');

let cached: GsapModule['default'] | GsapModule | null = null;

export class GsapMissingError extends Error {
  constructor() {
    super(
      '[react-radial-dock] gsap is required as a peer dependency. ' +
        'Install it with: npm i gsap',
    );
    this.name = 'GsapMissingError';
  }
}

export async function loadGsap(): Promise<GsapModule['default']> {
  if (cached && 'timeline' in cached) return cached as GsapModule['default'];
  try {
    const mod = (await import('gsap')) as GsapModule;
    const g = mod.default ?? (mod as unknown as GsapModule['default']);
    cached = g;
    return g;
  } catch {
    throw new GsapMissingError();
  }
}
```

- [ ] **Step 4: Run, expect pass**

Run: `pnpm test gsap-loader`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/gsap-loader.ts tests/gsap-loader.test.ts
git commit -m "feat(gsap-loader): lazy gsap with missing-peer error"
```

---

### Task 6.2: `useGsapTimeline` hook

**Files:**
- Create: `src/hooks/useGsapTimeline.ts`
- Create: `tests/hooks/useGsapTimeline.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// tests/hooks/useGsapTimeline.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useGsapTimeline } from '../../src/hooks/useGsapTimeline';
import { createMockTimeline } from '../mocks/gsap';
import type { RadialDockAnimationContext } from '../../src/types';

function makeCtx(): RadialDockAnimationContext {
  return {
    container: document.createElement('div'),
    disk: document.createElement('div'),
    svg: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
    slices: [],
    icons: [],
    n: 4,
    sliceSize: Math.PI / 2,
    outerRadius: 110,
    innerRadius: 55,
    centerX: 0,
    centerY: 0,
  };
}

describe('useGsapTimeline', () => {
  it('does nothing when ctx is null', () => {
    const onClosed = vi.fn();
    const fakeGsap = { timeline: vi.fn() };
    renderHook(() =>
      useGsapTimeline({
        ctx: null,
        animation: 'spring',
        isOpen: false,
        reducedMotion: false,
        onClosed,
        gsap: fakeGsap as never,
      }),
    );
    expect(fakeGsap.timeline).not.toHaveBeenCalled();
  });

  it('plays open timeline when isOpen flips true', async () => {
    const tl = createMockTimeline();
    const fakeGsap = { timeline: vi.fn(() => tl) };
    const ctx = makeCtx();
    const { rerender } = renderHook(
      ({ isOpen }: { isOpen: boolean }) =>
        useGsapTimeline({
          ctx,
          animation: 'fade',
          isOpen,
          reducedMotion: false,
          onClosed: vi.fn(),
          gsap: fakeGsap as never,
        }),
      { initialProps: { isOpen: false } },
    );
    rerender({ isOpen: true });
    await waitFor(() => expect(tl.play).toHaveBeenCalled());
  });

  it('reverses (or runs close timeline) and fires onClosed when isOpen flips false', async () => {
    const openTl = createMockTimeline();
    const closeTl = createMockTimeline();
    const timelineFn = vi
      .fn()
      .mockImplementationOnce(() => openTl)
      .mockImplementationOnce(() => closeTl);
    const fakeGsap = { timeline: timelineFn };
    const onClosed = vi.fn();
    const ctx = makeCtx();
    const { rerender } = renderHook(
      ({ isOpen }: { isOpen: boolean }) =>
        useGsapTimeline({
          ctx,
          animation: 'fade',
          isOpen,
          reducedMotion: false,
          onClosed,
          gsap: fakeGsap as never,
        }),
      { initialProps: { isOpen: true } },
    );
    rerender({ isOpen: false });
    await waitFor(() => expect(closeTl.eventCallback).toHaveBeenCalledWith('onComplete', expect.any(Function)));
    act(() => closeTl.fireOnComplete());
    expect(onClosed).toHaveBeenCalled();
  });

  it('skips animation under reducedMotion (still calls onClosed on close)', async () => {
    const tl = createMockTimeline();
    const fakeGsap = { timeline: vi.fn(() => tl) };
    const onClosed = vi.fn();
    const ctx = makeCtx();
    const { rerender } = renderHook(
      ({ isOpen }: { isOpen: boolean }) =>
        useGsapTimeline({
          ctx,
          animation: 'fade',
          isOpen,
          reducedMotion: true,
          onClosed,
          gsap: fakeGsap as never,
        }),
      { initialProps: { isOpen: true } },
    );
    rerender({ isOpen: false });
    await waitFor(() => expect(onClosed).toHaveBeenCalled());
  });
});
```

- [ ] **Step 2: Run, expect failure**

Run: `pnpm test useGsapTimeline`
Expected: FAIL.

- [ ] **Step 3: Implement**

```ts
// src/hooks/useGsapTimeline.ts
import { useEffect, useRef } from 'react';
import { presets } from '../presets';
import type {
  GsapTimelineLike,
  RadialDockAnimation,
  RadialDockAnimationContext,
  RadialDockAnimationCustom,
} from '../types';

export interface UseGsapTimelineOptions {
  ctx: RadialDockAnimationContext | null;
  animation: RadialDockAnimation;
  isOpen: boolean;
  reducedMotion: boolean;
  onClosed: () => void;
  /** Inject gsap (real or mock). Falsy → bail out. */
  gsap: { timeline: (vars?: Record<string, unknown>) => GsapTimelineLike } | null;
}

function resolvePreset(animation: RadialDockAnimation): RadialDockAnimationCustom {
  if (typeof animation === 'string') return presets[animation];
  return animation;
}

const REDUCED: RadialDockAnimationCustom = {
  open: (tl, ctx) => {
    tl.fromTo(ctx.disk, { opacity: 0 }, { opacity: 1, duration: 0.08 }, 0).fromTo(
      ctx.icons,
      { opacity: 0 },
      { opacity: 1, duration: 0.08 },
      0,
    );
  },
  close: (tl, ctx) => {
    tl.to(ctx.icons, { opacity: 0, duration: 0.08 }, 0).to(
      ctx.disk,
      { opacity: 0, duration: 0.08 },
      0,
    );
  },
};

export function useGsapTimeline({
  ctx,
  animation,
  isOpen,
  reducedMotion,
  onClosed,
  gsap,
}: UseGsapTimelineOptions): void {
  const openTlRef = useRef<GsapTimelineLike | null>(null);
  const closeTlRef = useRef<GsapTimelineLike | null>(null);
  const onClosedRef = useRef(onClosed);
  onClosedRef.current = onClosed;

  // Build open timeline once we have ctx + gsap.
  useEffect(() => {
    if (!ctx || !gsap) return;
    const preset = reducedMotion ? REDUCED : resolvePreset(animation);
    const tl = gsap.timeline({ paused: true });
    preset.open(tl, ctx);
    openTlRef.current = tl;
    return () => {
      tl.kill();
      openTlRef.current = null;
    };
  }, [ctx, animation, reducedMotion, gsap]);

  // Drive open / close.
  useEffect(() => {
    if (!ctx || !gsap) return;
    if (isOpen) {
      openTlRef.current?.play(0);
      return;
    }
    // closing
    const preset = reducedMotion ? REDUCED : resolvePreset(animation);
    const closeTl = gsap.timeline();
    closeTlRef.current = closeTl;
    preset.close(closeTl, ctx);
    closeTl.eventCallback('onComplete', () => onClosedRef.current());
    return () => {
      closeTl.kill();
      closeTlRef.current = null;
    };
  }, [isOpen, ctx, animation, reducedMotion, gsap]);
}
```

- [ ] **Step 4: Run, expect pass**

Run: `pnpm test useGsapTimeline`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useGsapTimeline.ts tests/hooks/useGsapTimeline.test.tsx
git commit -m "feat(hooks): useGsapTimeline (gsap injectable)"
```

---

## Phase 7 — Styles

### Task 7.1: Author `src/styles.css`

**Files:**
- Replace: `src/styles.css`

- [ ] **Step 1: Write `src/styles.css`** (verbatim from spec section 6.1, with `--rrd-icon-size` and `--rrd-z-index` added)

```css
:root {
  --rrd-bg: rgba(20, 20, 20, 0.55);
  --rrd-bg-blur: 20px;
  --rrd-slice-fill: transparent;
  --rrd-slice-fill-hover: #1e73ff;
  --rrd-slice-fill-active: rgba(0, 0, 0, 0.7);
  --rrd-slice-fill-disabled: rgba(255, 255, 255, 0.05);
  --rrd-icon-color: #fff;
  --rrd-icon-color-hover: #fff;
  --rrd-label-color: rgba(255, 255, 255, 0.85);
  --rrd-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  --rrd-ring-stroke: transparent;
  --rrd-ring-stroke-width: 0;
  --rrd-icon-size: 32px;
  --rrd-inner-radius: 55px;
  --rrd-outer-radius: 110px;
  --rrd-z-index: 9999;
}

.rrd-overlay {
  position: fixed;
  inset: 0;
  background: transparent;
  z-index: var(--rrd-z-index);
}
.rrd-container {
  position: absolute;
  pointer-events: none;
  filter: drop-shadow(var(--rrd-shadow));
  width: calc(var(--rrd-outer-radius) * 2);
  height: calc(var(--rrd-outer-radius) * 2);
}
.rrd-disk {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--rrd-bg);
  backdrop-filter: blur(var(--rrd-bg-blur));
  -webkit-backdrop-filter: blur(var(--rrd-bg-blur));
  -webkit-mask: radial-gradient(circle, transparent var(--rrd-inner-radius), #000 var(--rrd-inner-radius));
  mask: radial-gradient(circle, transparent var(--rrd-inner-radius), #000 var(--rrd-inner-radius));
  pointer-events: none;
}
.rrd-svg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: visible;
}
.rrd-slice {
  fill: var(--rrd-slice-fill);
  stroke: var(--rrd-ring-stroke);
  stroke-width: var(--rrd-ring-stroke-width);
  pointer-events: all;
  cursor: pointer;
  transition: fill 120ms ease;
}
.rrd-slice--hovered {
  fill: var(--rrd-slice-fill-hover);
}
.rrd-slice--disabled {
  fill: var(--rrd-slice-fill-disabled);
  cursor: not-allowed;
  pointer-events: none;
}
.rrd-slice:active {
  fill: var(--rrd-slice-fill-active);
}

.rrd-icon {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  pointer-events: none;
  color: var(--rrd-icon-color);
  width: var(--rrd-icon-size);
  height: var(--rrd-icon-size);
  transform: translate(-50%, -50%);
}
.rrd-icon--hovered {
  color: var(--rrd-icon-color-hover);
}
.rrd-label {
  color: var(--rrd-label-color);
  font: 11px/1.2 inherit;
  text-align: center;
}

.rrd-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@supports not (backdrop-filter: blur(1px)) {
  .rrd-disk {
    background: rgba(20, 20, 20, 0.85);
  }
}
```

- [ ] **Step 2: Verify build copies CSS**

Run: `pnpm build`
Expected: `dist/styles.css` exists and is non-empty (compare line count to source).

```bash
wc -l src/styles.css dist/styles.css
```

- [ ] **Step 3: Commit**

```bash
git add src/styles.css
git commit -m "feat(styles): base CSS + variables"
```

---

## Phase 8 — `RadialDockOverlay` (the in-DOM piece)

This is the largest single file. We'll author it in one task, verified by integration tests in Phase 9.

### Task 8.1: Implement `RadialDockOverlay`

**Files:**
- Create: `src/RadialDockOverlay.tsx`

- [ ] **Step 1: Write `src/RadialDockOverlay.tsx`**

```tsx
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
```

- [ ] **Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/RadialDockOverlay.tsx
git commit -m "feat(overlay): RadialDockOverlay component"
```

---

## Phase 9 — `RadialDock` (the public component)

### Task 9.1: Implement `RadialDock`

**Files:**
- Create: `src/RadialDock.tsx`

- [ ] **Step 1: Write `src/RadialDock.tsx`**

```tsx
// src/RadialDock.tsx
'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { clampPosition } from './geometry';
import { useControllableState } from './hooks/useControllableState';
import { useExitTransition } from './hooks/useExitTransition';
import { useMounted } from './hooks/useMounted';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useTriggers } from './hooks/useTriggers';
import { loadGsap } from './gsap-loader';
import { RadialDockOverlay } from './RadialDockOverlay';
import type {
  GsapTimelineLike,
  RadialDockHandle,
  RadialDockProps,
  RadialDockResolvedGeometry,
} from './types';

const DEFAULTS = {
  outerRadius: 110,
  innerRadius: 55,
  sliceGap: 2,
  iconSize: 32,
  iconRadius: 'auto' as const,
  startAngle: 0,
  direction: 'clockwise' as const,
  zIndex: 9999,
  ariaLabel: 'Quick actions',
  reducedMotion: 'auto' as const,
  defaultOpen: false,
  triggers: { rightClick: true, hotkey: false },
  animation: 'spring' as const,
};

function resolveGeometry(props: RadialDockProps): RadialDockResolvedGeometry {
  const n = props.items.length;
  const outerRadius = Math.max(60, props.outerRadius ?? DEFAULTS.outerRadius);
  let innerRadius = props.innerRadius ?? DEFAULTS.innerRadius;
  if (innerRadius > outerRadius - 20) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[react-radial-dock] innerRadius (${innerRadius}) must be ≤ outerRadius - 20 (${outerRadius - 20}). Falling back.`,
      );
    }
    innerRadius = Math.max(0, outerRadius - 20);
  }
  const iconRadius =
    props.iconRadius == null || props.iconRadius === 'auto'
      ? (outerRadius + innerRadius) / 2
      : props.iconRadius;
  const startAngleRad = ((props.startAngle ?? DEFAULTS.startAngle) * Math.PI) / 180;
  const dirSign = (props.direction ?? DEFAULTS.direction) === 'clockwise' ? 1 : -1;
  return {
    n,
    outerRadius,
    innerRadius,
    iconRadius,
    iconSize: props.iconSize ?? DEFAULTS.iconSize,
    sliceGap: props.sliceGap ?? DEFAULTS.sliceGap,
    startAngleRad,
    dirSign,
    sliceSize: n > 0 ? (2 * Math.PI) / n : 0,
    centerX: 0,
    centerY: 0,
  };
}

export const RadialDock = forwardRef<RadialDockHandle, RadialDockProps>(function RadialDock(
  props,
  ref,
) {
  const {
    items,
    triggers = DEFAULTS.triggers,
    open: controlledOpen,
    onOpenChange,
    defaultOpen = DEFAULTS.defaultOpen,
    position: controlledPosition,
    onSelect,
    theme,
    classNames,
    animation = DEFAULTS.animation,
    reducedMotion: reducedMotionMode = DEFAULTS.reducedMotion,
    portalContainer,
    zIndex = DEFAULTS.zIndex,
    ariaLabel = DEFAULTS.ariaLabel,
  } = props;

  const mounted = useMounted();
  const reducedMotion = useReducedMotion(reducedMotionMode);
  const [isOpen, setIsOpen] = useControllableState<boolean>(
    controlledOpen,
    onOpenChange,
    defaultOpen,
  );
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    controlledPosition ?? null,
  );

  // Pull controlled position into state.
  useEffect(() => {
    if (controlledPosition) setPosition(controlledPosition);
  }, [controlledPosition?.x, controlledPosition?.y]);

  // Items-too-few guard.
  const enabled = items.length >= 3;
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && items.length > 0 && items.length < 3) {
      console.warn(
        `[react-radial-dock] items.length=${items.length}; minimum is 3. Component will not render.`,
      );
    }
  }, [items.length]);

  const geometry = useMemo(() => resolveGeometry(props), [
    items.length,
    props.outerRadius,
    props.innerRadius,
    props.iconRadius,
    props.iconSize,
    props.sliceGap,
    props.startAngle,
    props.direction,
  ]);

  const trigger = useCallback(
    (x?: number, y?: number) => {
      let pos: { x: number; y: number };
      if (controlledPosition) pos = controlledPosition;
      else if (typeof x === 'number' && typeof y === 'number') pos = { x, y };
      else pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      const clamped = clampPosition(
        pos,
        geometry.outerRadius,
        { width: window.innerWidth, height: window.innerHeight },
      );
      setPosition(clamped);
      setIsOpen(true);
    },
    [controlledPosition, geometry.outerRadius, setIsOpen],
  );
  const close = useCallback(() => setIsOpen(false), [setIsOpen]);

  useTriggers({
    rightClick: triggers.rightClick ?? true,
    hotkey: triggers.hotkey ?? false,
    enabled,
    onTrigger: trigger,
    onClose: close,
  });

  useImperativeHandle(
    ref,
    () => ({
      open: (x, y) => trigger(x, y),
      close,
      toggle: (x, y) => {
        if (isOpen) close();
        else trigger(x, y);
      },
      isOpen: () => isOpen,
    }),
    [trigger, close, isOpen],
  );

  // Lazy-load gsap on first open.
  const [gsap, setGsap] = useState<{ timeline: (vars?: Record<string, unknown>) => GsapTimelineLike } | null>(null);
  useEffect(() => {
    if (!isOpen || gsap) return;
    let cancelled = false;
    loadGsap()
      .then((g) => {
        if (!cancelled) setGsap(g as never);
      })
      .catch((err) => {
        if (!cancelled) {
          if (process.env.NODE_ENV !== 'production') console.error(err);
          throw err;
        }
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, gsap]);

  const exit = useExitTransition(isOpen);

  if (!mounted) return null;
  if (!enabled) return null;
  if (!exit.shouldRender) return null;
  if (!position) return null;

  const overlay = (
    <RadialDockOverlay
      items={items}
      geometry={geometry}
      position={position}
      isOpen={isOpen}
      ariaLabel={ariaLabel}
      zIndex={zIndex}
      theme={theme}
      classNames={classNames}
      animation={animation}
      reducedMotion={reducedMotion}
      gsap={gsap}
      onSelect={(item, i, ev) => onSelect?.(item, i, ev)}
      onRequestClose={close}
      onCloseAnimationDone={exit.done}
    />
  );

  if (portalContainer === null) return overlay;
  const target = portalContainer ?? document.body;
  return createPortal(overlay, target);
});

export default RadialDock;
```

- [ ] **Step 2: Run typecheck**

Run: `pnpm typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/RadialDock.tsx
git commit -m "feat(component): RadialDock orchestrator"
```

---

### Task 9.2: Wire `src/index.ts` barrel

**Files:**
- Replace: `src/index.ts`

- [ ] **Step 1: Write `src/index.ts`**

```ts
export { default, RadialDock } from './RadialDock';
export type {
  RadialDockProps,
  RadialDockItem,
  RadialDockTheme,
  RadialDockClassNames,
  RadialDockAnimation,
  RadialDockAnimationName,
  RadialDockAnimationCustom,
  RadialDockAnimationContext,
  RadialDockHandle,
  RadialDockReducedMotion,
  RadialDockTriggers,
} from './types';
```

- [ ] **Step 2: Run build**

Run: `pnpm build`
Expected: PASS; `dist/index.{mjs,cjs,d.ts}` and `dist/presets.{mjs,cjs,d.ts}` exist; check for the `'use client';` banner:

```bash
head -1 dist/index.mjs
```
Expected: `'use client';`

- [ ] **Step 3: Commit**

```bash
git add src/index.ts
git commit -m "feat: public barrel"
```

---

## Phase 10 — Integration tests (RTL)

GSAP is heavy in tests; we'll provide a `gsap` mock module that records calls and immediately fires `onComplete` so close transitions don't hang.

### Task 10.1: Per-test GSAP module mock

**Files:**
- Create: `tests/mocks/gsap-module.ts`

- [ ] **Step 1: Write `tests/mocks/gsap-module.ts`** — exports a `default` that resembles the real `gsap` (`{ timeline }`).

```ts
// tests/mocks/gsap-module.ts
import { vi } from 'vitest';

const tlSink: Array<unknown> = [];

function createTimeline() {
  let onCompleteCb: (() => void) | null = null;
  const tl = {
    to: vi.fn(() => tl),
    from: vi.fn(() => tl),
    fromTo: vi.fn(() => tl),
    set: vi.fn(() => tl),
    play: vi.fn(() => tl),
    reverse: vi.fn(() => tl),
    pause: vi.fn(() => tl),
    kill: vi.fn(() => tl),
    eventCallback: vi.fn((name: string, cb: (() => void) | null) => {
      if (name === 'onComplete') {
        onCompleteCb = cb;
        // Fire next microtask so close-flow completes synchronously enough for tests.
        if (cb) queueMicrotask(() => onCompleteCb?.());
      }
      return tl;
    }),
  };
  tlSink.push(tl);
  return tl;
}

const gsap = {
  timeline: vi.fn((_vars?: Record<string, unknown>) => createTimeline()),
};

export default gsap;
export { gsap };
```

- [ ] **Step 2: Configure vitest to alias `gsap` to this module**

Modify `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      gsap: path.resolve(__dirname, 'tests/mocks/gsap-module.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    exclude: ['tests/e2e/**', 'node_modules/**', 'dist/**'],
    css: false,
  },
});
```

- [ ] **Step 3: Re-run all unit tests to ensure no regression**

Run: `pnpm test`
Expected: all PASS.

- [ ] **Step 4: Commit**

```bash
git add tests/mocks/gsap-module.ts vitest.config.ts
git commit -m "test: alias gsap to local mock for integration tests"
```

---

### Task 10.2: `RadialDock.test.tsx` — render + items + classNames + theme

**Files:**
- Create: `tests/RadialDock.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// tests/RadialDock.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RadialDock from '../src/RadialDock';
import type { RadialDockItem } from '../src/types';

const items: RadialDockItem[] = [
  { id: 'a', label: 'A', icon: 'A', onSelect: vi.fn() },
  { id: 'b', label: 'B', icon: 'B', onSelect: vi.fn() },
  { id: 'c', label: 'C', icon: 'C', onSelect: vi.fn() },
];

describe('RadialDock', () => {
  it('renders nothing when items < 3', () => {
    const { container } = render(
      <RadialDock items={items.slice(0, 2)} open />,
    );
    expect(container.querySelector('.rrd-overlay')).toBeNull();
  });

  it('renders nothing when closed and uncontrolled', () => {
    const { container } = render(<RadialDock items={items} />);
    expect(container.querySelector('.rrd-overlay')).toBeNull();
  });

  it('renders overlay when open', () => {
    render(<RadialDock items={items} open position={{ x: 200, y: 200 }} />);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menu')).toHaveAttribute('aria-label', 'Quick actions');
  });

  it('honors custom ariaLabel', () => {
    render(<RadialDock items={items} open position={{ x: 200, y: 200 }} ariaLabel="Tools" />);
    expect(screen.getByRole('menu', { name: 'Tools' })).toBeInTheDocument();
  });

  it('applies custom classNames in addition to defaults', () => {
    const { container } = render(
      <RadialDock
        items={items}
        open
        position={{ x: 200, y: 200 }}
        classNames={{ overlay: 'extra-overlay', container: 'extra-container' }}
      />,
    );
    expect(container.querySelector('.rrd-overlay.extra-overlay')).not.toBeNull();
    expect(container.querySelector('.rrd-container.extra-container')).not.toBeNull();
  });

  it('injects CSS variables from theme prop', () => {
    const { container } = render(
      <RadialDock
        items={items}
        open
        position={{ x: 200, y: 200 }}
        theme={{ sliceFillHover: '#ff4d4f', shadow: '0 12px 40px red' }}
      />,
    );
    const overlay = container.querySelector('.rrd-overlay') as HTMLElement;
    expect(overlay.style.getPropertyValue('--rrd-slice-fill-hover')).toBe('#ff4d4f');
    expect(overlay.style.getPropertyValue('--rrd-shadow')).toBe('0 12px 40px red');
  });

  it('clicking a slice fires both item.onSelect and top-level onSelect, then closes', () => {
    const onItem = vi.fn();
    const onTop = vi.fn();
    const onOpenChange = vi.fn();
    const my: RadialDockItem[] = [
      { id: 'a', label: 'A', icon: 'A', onSelect: onItem },
      { id: 'b', label: 'B', icon: 'B', onSelect: vi.fn() },
      { id: 'c', label: 'C', icon: 'C', onSelect: vi.fn() },
    ];
    const { container } = render(
      <RadialDock
        items={my}
        open
        onOpenChange={onOpenChange}
        position={{ x: 200, y: 200 }}
        onSelect={onTop}
      />,
    );
    const firstSlice = container.querySelectorAll('path.rrd-slice')[0]!;
    fireEvent.click(firstSlice);
    expect(onItem).toHaveBeenCalledTimes(1);
    expect(onTop).toHaveBeenCalledTimes(1);
    expect(onTop.mock.calls[0]![0]).toMatchObject({ id: 'a' });
    expect(onTop.mock.calls[0]![1]).toBe(0);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('disabled item: click is no-op', () => {
    const onItem = vi.fn();
    const my: RadialDockItem[] = [
      { id: 'a', label: 'A', icon: 'A', onSelect: onItem, disabled: true },
      { id: 'b', label: 'B', icon: 'B', onSelect: vi.fn() },
      { id: 'c', label: 'C', icon: 'C', onSelect: vi.fn() },
    ];
    const { container } = render(
      <RadialDock items={my} open position={{ x: 200, y: 200 }} />,
    );
    const firstSlice = container.querySelectorAll('path.rrd-slice')[0]!;
    fireEvent.click(firstSlice);
    expect(onItem).not.toHaveBeenCalled();
  });

  it('custom render prop replaces default content and receives hover state', () => {
    const my: RadialDockItem[] = [
      {
        id: 'a',
        onSelect: vi.fn(),
        render: ({ hovered, index }) => (
          <span data-testid={`custom-${index}`}>{hovered ? 'HOT' : 'cold'}</span>
        ),
      },
      { id: 'b', label: 'B', icon: 'B', onSelect: vi.fn() },
      { id: 'c', label: 'C', icon: 'C', onSelect: vi.fn() },
    ];
    render(<RadialDock items={my} open position={{ x: 200, y: 200 }} />);
    expect(screen.getByTestId('custom-0')).toHaveTextContent('cold');
  });
});
```

- [ ] **Step 2: Run tests, expect all PASS**

Run: `pnpm test RadialDock`
Expected: PASS.
If a test fails, fix the implementation in `RadialDock.tsx` / `RadialDockOverlay.tsx` until green. Do not change the tests except to fix typos.

- [ ] **Step 3: Commit**

```bash
git add tests/RadialDock.test.tsx
git commit -m "test(integration): RadialDock render + select + theme"
```

---

### Task 10.3: `triggers.test.tsx` — right-click + hotkey + Escape

**Files:**
- Create: `tests/triggers.test.tsx`

- [ ] **Step 1: Write tests**

```tsx
// tests/triggers.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import RadialDock from '../src/RadialDock';
import type { RadialDockItem } from '../src/types';

const items: RadialDockItem[] = [
  { id: 'a', label: 'A', icon: 'A', onSelect: vi.fn() },
  { id: 'b', label: 'B', icon: 'B', onSelect: vi.fn() },
  { id: 'c', label: 'C', icon: 'C', onSelect: vi.fn() },
];

describe('triggers', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'platform', { value: 'MacIntel', configurable: true });
  });

  it('right-click on body opens the dock', () => {
    render(<RadialDock items={items} />);
    expect(screen.queryByRole('menu')).toBeNull();
    act(() => {
      window.dispatchEvent(
        new MouseEvent('contextmenu', { clientX: 300, clientY: 300, cancelable: true, bubbles: true }),
      );
    });
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('right-click in <input> does NOT open', () => {
    render(
      <>
        <input data-testid="i" />
        <RadialDock items={items} />
      </>,
    );
    const input = screen.getByTestId('i');
    act(() => {
      input.dispatchEvent(
        new MouseEvent('contextmenu', { cancelable: true, bubbles: true }),
      );
    });
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('hotkey opens at last cursor', () => {
    render(<RadialDock items={items} triggers={{ rightClick: false, hotkey: 'mod+e' }} />);
    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 200 }));
    });
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', metaKey: true, bubbles: true }));
    });
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('Escape closes the dock', async () => {
    const onOpenChange = vi.fn();
    render(<RadialDock items={items} open onOpenChange={onOpenChange} position={{ x: 200, y: 200 }} />);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
```

- [ ] **Step 2: Run tests, expect PASS**

Run: `pnpm test triggers`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add tests/triggers.test.tsx
git commit -m "test(integration): triggers (right-click + hotkey + esc)"
```

---

### Task 10.4: `imperative-handle.test.tsx`

**Files:**
- Create: `tests/imperative-handle.test.tsx`

- [ ] **Step 1: Write tests**

```tsx
// tests/imperative-handle.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useRef } from 'react';
import RadialDock from '../src/RadialDock';
import type { RadialDockHandle, RadialDockItem } from '../src/types';

const items: RadialDockItem[] = [
  { id: 'a', label: 'A', onSelect: vi.fn() },
  { id: 'b', label: 'B', onSelect: vi.fn() },
  { id: 'c', label: 'C', onSelect: vi.fn() },
];

function Harness({ onReady }: { onReady: (h: RadialDockHandle) => void }) {
  const ref = useRef<RadialDockHandle>(null);
  return (
    <>
      <button data-testid="ready" onClick={() => onReady(ref.current!)}>r</button>
      <RadialDock ref={ref} items={items} />
    </>
  );
}

describe('imperative handle', () => {
  it('open() / close() / toggle() / isOpen()', async () => {
    let h: RadialDockHandle | null = null;
    render(<Harness onReady={(handle) => (h = handle)} />);
    screen.getByTestId('ready').click();
    expect(h).not.toBeNull();

    act(() => h!.open(100, 100));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(h!.isOpen()).toBe(true);

    act(() => h!.toggle());
    expect(h!.isOpen()).toBe(false);

    act(() => h!.toggle(50, 50));
    expect(h!.isOpen()).toBe(true);

    act(() => h!.close());
    expect(h!.isOpen()).toBe(false);
  });
});
```

- [ ] **Step 2: Run, expect PASS**

Run: `pnpm test imperative-handle`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add tests/imperative-handle.test.tsx
git commit -m "test(integration): imperative handle"
```

---

### Task 10.5: Run full test suite & build

- [ ] **Step 1: Run all tests**

Run: `pnpm test`
Expected: ALL PASS.

- [ ] **Step 2: Lint**

Run: `pnpm lint`
Expected: 0 errors.

- [ ] **Step 3: Typecheck**

Run: `pnpm typecheck`
Expected: PASS.

- [ ] **Step 4: Build**

Run: `pnpm build`
Expected: success; `dist/` populated.

- [ ] **Step 5: Commit (only if anything changed)**

If lint/typecheck flagged anything to fix, commit those fixes:

```bash
git add -A
git commit -m "chore: clean up lint/typecheck"
```

---

## Phase 11 — Examples & E2E

### Task 11.1: Example markdown files

**Files:**
- Create: `examples/basic.md`
- Create: `examples/controlled.md`
- Create: `examples/custom-render.md`
- Create: `examples/theming.md`
- Create: `examples/animations.md`

- [ ] **Step 1: Write `examples/basic.md`**

````markdown
# Basic — right-click anywhere

```tsx
'use client';
import RadialDock from 'react-radial-dock';
import 'react-radial-dock/styles.css';
import { Star, Bookmark, Pin } from 'lucide-react';

export default function Demo() {
  const items = [
    { id: 'star', icon: <Star size={20} />, label: 'Star', onSelect: () => console.log('star') },
    { id: 'mark', icon: <Bookmark size={20} />, label: 'Mark', onSelect: () => console.log('mark') },
    { id: 'pin', icon: <Pin size={20} />, label: 'Pin', onSelect: () => console.log('pin') },
  ];
  return <RadialDock items={items} />;
}
```

Right-click anywhere on the page (outside `<input>` / `<textarea>`) to open.
````

- [ ] **Step 2: Write `examples/controlled.md`**

````markdown
# Controlled mode

```tsx
'use client';
import { useState } from 'react';
import RadialDock from 'react-radial-dock';
import 'react-radial-dock/styles.css';

export default function Demo() {
  const [open, setOpen] = useState(false);
  const items = [/* … */];
  return (
    <>
      <button onClick={() => setOpen((o) => !o)}>Toggle dock</button>
      <RadialDock
        items={items}
        open={open}
        onOpenChange={setOpen}
        position={{ x: 400, y: 300 }}
      />
    </>
  );
}
```
````

- [ ] **Step 3: Write `examples/custom-render.md`**

````markdown
# Custom slice content

```tsx
import RadialDock from 'react-radial-dock';
import 'react-radial-dock/styles.css';

const items = [
  {
    id: 'star',
    onSelect: () => {},
    render: ({ hovered }) => (
      <div style={{ transform: hovered ? 'scale(1.2)' : 'scale(1)', transition: 'transform .15s' }}>
        ⭐
      </div>
    ),
  },
  // …
];

export default () => <RadialDock items={items} />;
```
````

- [ ] **Step 4: Write `examples/theming.md`**

````markdown
# Theming

```tsx
<RadialDock
  items={items}
  theme={{
    sliceFillHover: '#FF4D4F',
    shadow: '0 12px 40px rgba(255,77,79,0.4)',
    bg: 'rgba(0, 0, 0, 0.7)',
  }}
  classNames={{
    container: 'my-custom-glow',
  }}
/>
```

You can also set the CSS variables on a parent element to theme multiple instances at once:

```css
.my-app {
  --rrd-slice-fill-hover: var(--brand-blue);
  --rrd-shadow: 0 8px 24px rgba(0, 50, 200, 0.4);
}
```
````

- [ ] **Step 5: Write `examples/animations.md`**

````markdown
# Animations

```tsx
// One of: 'spring' (default) | 'fade' | 'pop' | 'stagger' | 'iris'
<RadialDock items={items} animation="iris" />
```

## Custom timeline

```tsx
import RadialDock, { type RadialDockAnimationCustom } from 'react-radial-dock';
import 'react-radial-dock/styles.css';

const flipIn: RadialDockAnimationCustom = {
  open: (tl, ctx) => {
    tl.fromTo(
      ctx.container,
      { rotateY: 90, opacity: 0 },
      { rotateY: 0, opacity: 1, duration: 0.3, ease: 'power3.out' },
    ).fromTo(
      ctx.icons,
      { scale: 0 },
      { scale: 1, duration: 0.2, stagger: 0.03 },
      '-=0.1',
    );
  },
  close: (tl, ctx) => {
    tl.to(ctx.container, { rotateY: -90, opacity: 0, duration: 0.18, ease: 'power3.in' });
  },
};

<RadialDock items={items} animation={flipIn} />;
```
````

- [ ] **Step 6: Commit**

```bash
git add examples/*.md
git commit -m "docs(examples): basic / controlled / custom-render / theming / animations"
```

---

### Task 11.2: Example Next.js app for E2E

**Files:**
- Create directory: `examples/nextjs-app/`
- Create: `examples/nextjs-app/package.json`
- Create: `examples/nextjs-app/next.config.mjs`
- Create: `examples/nextjs-app/tsconfig.json`
- Create: `examples/nextjs-app/app/layout.tsx`
- Create: `examples/nextjs-app/app/page.tsx`
- Create: `examples/nextjs-app/.gitignore`

- [ ] **Step 1: Write `examples/nextjs-app/package.json`**

```json
{
  "name": "rrd-example-nextjs",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-radial-dock": "workspace:*",
    "gsap": "^3.12.5"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.6.0"
  }
}
```

- [ ] **Step 2: Write `examples/nextjs-app/next.config.mjs`**

```js
/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
};
export default config;
```

- [ ] **Step 3: Write `examples/nextjs-app/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Write `examples/nextjs-app/app/layout.tsx`**

```tsx
import 'react-radial-dock/styles.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui', background: '#111', color: '#fff', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  );
}

export const metadata = { title: 'react-radial-dock demo' };
```

- [ ] **Step 5: Write `examples/nextjs-app/app/page.tsx`**

```tsx
'use client';

import { useState } from 'react';
import RadialDock from 'react-radial-dock';

declare global {
  interface Window {
    __rrdLastSelected?: string;
  }
}

export default function Page() {
  const [last, setLast] = useState<string>('—');
  const items = [
    { id: 'star', label: 'Star', icon: '⭐', onSelect: () => setAndExpose('star', setLast) },
    { id: 'mark', label: 'Mark', icon: '🔖', onSelect: () => setAndExpose('mark', setLast) },
    { id: 'pin', label: 'Pin', icon: '📍', onSelect: () => setAndExpose('pin', setLast) },
    { id: 'edit', label: 'Edit', icon: '✏️', onSelect: () => setAndExpose('edit', setLast) },
  ];

  return (
    <main style={{ padding: 24 }}>
      <h1>react-radial-dock</h1>
      <p data-testid="instructions">Right-click anywhere or press Cmd/Ctrl+E.</p>
      <p>
        Last selected: <span data-testid="last">{last}</span>
      </p>
      <RadialDock items={items} triggers={{ rightClick: true, hotkey: 'mod+e' }} />
    </main>
  );
}

function setAndExpose(value: string, setter: (v: string) => void) {
  setter(value);
  if (typeof window !== 'undefined') window.__rrdLastSelected = value;
}
```

- [ ] **Step 6: Write `examples/nextjs-app/.gitignore`**

```
node_modules/
.next/
out/
*.log
```

- [ ] **Step 7: Add the workspace root config so the example app sees the local package**

Create: `pnpm-workspace.yaml`

```yaml
packages:
  - "."
  - "examples/*"
```

- [ ] **Step 8: Install in workspace mode**

Run: `pnpm install`
Expected: success; `examples/nextjs-app/node_modules/react-radial-dock` symlinks to root.

- [ ] **Step 9: Build the package, then run the example dev server in the background to confirm it boots**

Run: `pnpm build && cd examples/nextjs-app && pnpm dev` (open in another terminal or kill after 10s).
Expected: starts on http://localhost:3000 with no compile errors.

(If the engineer can't keep the server running for verification, just confirm `pnpm build` of the example passes:)

```bash
cd examples/nextjs-app && pnpm build
```
Expected: clean build.

- [ ] **Step 10: Commit**

```bash
git add pnpm-workspace.yaml examples/nextjs-app/ pnpm-lock.yaml
git commit -m "examples: nextjs-app demo"
```

---

### Task 11.3: Playwright E2E happy path

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/happy-path.spec.ts`

- [ ] **Step 1: Install Playwright browsers**

Run: `pnpm exec playwright install chromium`
Expected: chromium installed.

- [ ] **Step 2: Write `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm --filter rrd-example-nextjs dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [{ name: 'chromium', use: devices['Desktop Chrome'] }],
});
```

- [ ] **Step 3: Write `tests/e2e/happy-path.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test('right-click → hover → click → select', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('instructions')).toBeVisible();
  await expect(page.locator('[role="menu"]')).toHaveCount(0);

  // Right-click in the page body, away from text.
  await page.mouse.move(400, 300);
  await page.mouse.click(400, 300, { button: 'right' });
  await expect(page.locator('[role="menu"]')).toBeVisible();

  // Move cursor up (toward slice 0 — top by default), then click.
  await page.mouse.move(400, 220);
  const slice0 = page.locator('path.rrd-slice').first();
  await expect(slice0).toBeVisible();
  await slice0.click();

  // Menu should close.
  await expect(page.locator('[role="menu"]')).toHaveCount(0);
  // Last selected should be set.
  await expect(page.getByTestId('last')).not.toHaveText('—');
});

test('Escape closes the dock', async ({ page }) => {
  await page.goto('/');
  await page.mouse.click(400, 300, { button: 'right' });
  await expect(page.locator('[role="menu"]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('[role="menu"]')).toHaveCount(0);
});

test('hotkey opens the dock at last cursor', async ({ page }) => {
  await page.goto('/');
  await page.mouse.move(500, 400);
  // Mac vs non-Mac — Playwright runs Linux/Mac in CI; test both with `Meta`+e and `Control`+e.
  // Page reports navigator.platform; we just press Control+E since the example app's hotkey is "mod+e"
  // which resolves to Cmd on Mac / Ctrl elsewhere. Playwright's default headless Chromium runs on Linux,
  // so Control+E is the right one.
  await page.keyboard.press('Control+E');
  await expect(page.locator('[role="menu"]')).toBeVisible();
});
```

- [ ] **Step 4: Run e2e**

Run: `pnpm build && pnpm test:e2e`
Expected: all 3 specs PASS.

- [ ] **Step 5: Commit**

```bash
git add playwright.config.ts tests/e2e/
git commit -m "test(e2e): happy path on nextjs example"
```

---

## Phase 12 — Documentation, Changesets, CI

### Task 12.1: README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write `README.md`**

````markdown
# react-radial-dock

A customizable, GSAP-animated radial action dock (donut-shaped quick-action menu) for React. Drop-in for Next.js App Router, Vite, and CRA. Bring your own icons.

> **Status:** v0.1 — pre-release. API may change in minor versions until v1.0.

## Install

```bash
npm i react-radial-dock gsap
```

`gsap` is a peer dependency. Then import the CSS once at the root of your app:

```ts
import 'react-radial-dock/styles.css';
```

## Quick start

```tsx
'use client';
import RadialDock from 'react-radial-dock';
import 'react-radial-dock/styles.css';

const items = [
  { id: 'a', label: 'Star', icon: '⭐', onSelect: () => console.log('star') },
  { id: 'b', label: 'Mark', icon: '🔖', onSelect: () => console.log('mark') },
  { id: 'c', label: 'Pin',  icon: '📍', onSelect: () => console.log('pin') },
];

export default function Page() {
  return <RadialDock items={items} />;
}
```

Right-click anywhere on the page to open. Press `Esc` to close.

## Triggers

```tsx
<RadialDock items={items} triggers={{ rightClick: true, hotkey: 'mod+e' }} />
```

- `rightClick`: `true` (default) | `false` | `{ ignoreSelectors: string[] }`
- `hotkey`: e.g. `'mod+e'` (Cmd on Mac, Ctrl elsewhere), `'shift+space'`, `false`

## Controlled mode

```tsx
const [open, setOpen] = useState(false);
<RadialDock items={items} open={open} onOpenChange={setOpen} position={{ x: 400, y: 300 }} />;
```

## Imperative handle

```tsx
const ref = useRef<RadialDockHandle>(null);
ref.current?.open(100, 200);
ref.current?.close();
ref.current?.toggle();
```

## Theming

CSS variables (e.g. `--rrd-slice-fill-hover`, `--rrd-shadow`) drive the look. Override per instance with the `theme` prop or globally with CSS:

```tsx
<RadialDock theme={{ sliceFillHover: '#FF4D4F', shadow: '0 12px 40px rgba(255,77,79,0.4)' }} />
```

```css
.my-app { --rrd-slice-fill-hover: var(--brand-blue); }
```

## Custom render per slice

```tsx
{
  id: 'star',
  onSelect: () => {},
  render: ({ hovered }) => <div style={{ transform: hovered ? 'scale(1.2)' : 'scale(1)' }}>⭐</div>,
}
```

## Animations

Built-in: `spring` (default), `fade`, `pop`, `stagger`, `iris`. Or pass a custom `{ open, close }`:

```tsx
import gsap from 'gsap';

const flip = {
  open:  (tl, ctx) => tl.fromTo(ctx.container, { rotateY: 90, opacity: 0 }, { rotateY: 0, opacity: 1, duration: .3 }),
  close: (tl, ctx) => tl.to(ctx.container, { opacity: 0, duration: .18 }),
};
<RadialDock items={items} animation={flip} />
```

## Geometry

| Prop          | Default | Notes                               |
| ------------- | ------- | ----------------------------------- |
| `outerRadius` | 110     | min 60                              |
| `innerRadius` | 55      | must be ≤ outerRadius − 20          |
| `iconRadius`  | `'auto'` | resolves to `(outer + inner) / 2`  |
| `iconSize`    | 32      |                                     |
| `sliceGap`    | 2       | px on the icon-radius arc           |
| `startAngle`  | 0       | degrees, 0 = top                    |
| `direction`   | `'clockwise'` |                               |

## Accessibility

- `role="menu"` with `aria-label` (default `"Quick actions"`).
- Hidden `<span role="menuitem">` per slice, indexed via `aria-activedescendant`.
- Keyboard: `ArrowLeft` / `ArrowRight` / `Tab` / `Shift+Tab` cycle slices, `Enter` selects, `Esc` closes.
- Disabled items: `aria-disabled`, skipped in cycle.
- Respects `prefers-reduced-motion: reduce` (override with `reducedMotion="never"`).

## Browser support

- Chrome, Edge, Safari ≥ 14, Firefox ≥ latest, Safari iOS 14+.
- `backdrop-filter` falls back to a solid disk on older browsers.

## License

MIT © Rupam Shil
````

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: README"
```

---

### Task 12.2: LICENSE + CHANGELOG

**Files:**
- Create: `LICENSE`
- Create: `CHANGELOG.md`

- [ ] **Step 1: Write `LICENSE`** (standard MIT)

```
MIT License

Copyright (c) 2026 Rupam Shil

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 2: Write `CHANGELOG.md`**

```markdown
# Changelog

All notable changes documented here. Generated by Changesets.

## 0.1.0 - Unreleased

Initial release.
```

- [ ] **Step 3: Commit**

```bash
git add LICENSE CHANGELOG.md
git commit -m "docs: LICENSE + CHANGELOG"
```

---

### Task 12.3: Initialize Changesets

**Files:**
- Create: `.changeset/config.json`
- Create: `.changeset/initial-release.md`

- [ ] **Step 1: Init changesets**

Run: `pnpm exec changeset init`
Expected: creates `.changeset/config.json` (or skip if it does).

- [ ] **Step 2: Verify `.changeset/config.json` looks like this (edit if needed)**

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["rrd-example-nextjs"]
}
```

- [ ] **Step 3: Write the initial changeset `.changeset/initial-release.md`**

```markdown
---
"react-radial-dock": minor
---

Initial public release. Customizable, GSAP-animated radial action dock with right-click + hotkey triggers, controlled & uncontrolled modes, 5 animation presets, theming via CSS variables, and a custom-preset escape hatch.
```

- [ ] **Step 4: Commit**

```bash
git add .changeset/
git commit -m "chore: changesets init + initial release entry"
```

---

### Task 12.4: GitHub Actions

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/release.yml`

- [ ] **Step 1: Write `.github/workflows/ci.yml`**

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
      - run: pnpm exec playwright install --with-deps chromium
      - run: pnpm test:e2e
```

- [ ] **Step 2: Write `.github/workflows/release.yml`**

```yaml
name: Release
on:
  push:
    branches: [main]
permissions:
  contents: write
  pull-requests: write
  id-token: write
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
          registry-url: 'https://registry.npmjs.org'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: changesets/action@v1
        with:
          publish: pnpm release
          version: pnpm exec changeset version
          commit: 'chore: release'
          title: 'chore: release'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

- [ ] **Step 3: Commit**

```bash
git add .github/
git commit -m "ci: github actions for test + release"
```

---

## Phase 13 — Final verification

### Task 13.1: Full local verification

- [ ] **Step 1: Run everything fresh**

```bash
rm -rf node_modules dist examples/nextjs-app/node_modules examples/nextjs-app/.next
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

Expected: all green.

- [ ] **Step 2: Inspect the published artifacts**

```bash
ls -la dist/
head -5 dist/index.mjs
head -5 dist/index.cjs
head -5 dist/presets.mjs
file dist/styles.css
```

Expected:
- `dist/index.mjs` and `dist/index.cjs` start with `'use client';`
- `dist/index.d.ts`, `dist/presets.d.ts` exist
- `dist/styles.css` is the copied file (non-empty)

- [ ] **Step 3: Smoke-test the package via `pnpm pack`**

```bash
pnpm pack
tar -tf react-radial-dock-0.0.0.tgz | head -30
rm react-radial-dock-0.0.0.tgz
```

Expected: tarball includes `dist/`, `README.md`, `LICENSE`, `package.json`. Excludes `src/`, `tests/`, `examples/`, `node_modules/`.

- [ ] **Step 4: Manual smoke test in the example app**

```bash
pnpm --filter rrd-example-nextjs dev
```

Open http://localhost:3000 and verify:
- Page renders.
- Right-click anywhere outside text → dock appears with 4 wedges.
- Hover a wedge → it highlights.
- Click a wedge → dock closes, "Last selected" updates.
- Press `Esc` while open → dock closes.
- Press `Cmd/Ctrl+E` → dock opens at cursor.
- Resize window, right-click near a corner → dock is clamped inside the viewport.

(If the engineer can't run a dev server in this environment, mark this step as **manually verified by Playwright e2e** and proceed.)

- [ ] **Step 5: Commit any final fixes**

```bash
git add -A
git commit --allow-empty -m "chore: final verification"
```

---

### Task 13.2: Tag v0.1.0 (do NOT publish — that's a separate, deliberate step)

- [ ] **Step 1: Bump version via changesets**

Run: `pnpm exec changeset version`
Expected: `package.json` bumped to `0.1.0`; `CHANGELOG.md` updated; the `.changeset/initial-release.md` consumed.

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "chore: release 0.1.0"
git tag v0.1.0
```

- [ ] **Step 3: Stop here — do not push or publish without explicit user approval.**

The Release workflow + `NPM_TOKEN` secret will publish on push to `main` once configured. That's a deliberate, user-driven step.

---

## Definition of Done

- [ ] `pnpm test` — green (all unit + integration)
- [ ] `pnpm test:e2e` — green
- [ ] `pnpm typecheck` — green
- [ ] `pnpm lint` — 0 errors
- [ ] `pnpm build` — produces ESM + CJS + d.ts + CSS in `dist/`
- [ ] `pnpm pack` tarball matches expected file set
- [ ] All 5 animation presets exported from `react-radial-dock/presets`
- [ ] Custom-preset escape hatch verified by `flipIn` in `examples/animations.md` and the custom-preset acceptance in `useGsapTimeline.test.tsx`
- [ ] `examples/nextjs-app` runs locally
- [ ] README covers install, basic usage, controlled mode, theming, custom render, custom animation, accessibility
- [ ] Changesets initialized, first changeset committed, GH Actions workflow in place
- [ ] Tag `v0.1.0` exists locally (publish is the user's call)

---

## Self-review notes

**Spec coverage scan:**
- §3.1 Props → resolved in `RadialDock.tsx` (Task 9.1) and `types.ts` (1.1).
- §3.2 Item shape → 1.1 + render-prop test in 10.2.
- §3.3 Theme & classNames → 9.1 themeToStyle + 10.2 tests.
- §3.4 Animation type → 1.1 + presets 5.x + custom hook in 6.2.
- §3.5 Imperative handle → 9.1 + 10.4.
- §3.6 Public exports → 9.2 + 5.1.
- §4.1 Component tree → split RadialDock / RadialDockOverlay (8, 9).
- §4.2 State machine → useExitTransition (4.6) + useGsapTimeline (6.2).
- §4.3 Geometry → 2.x.
- §4.4 Position resolution → 9.1 trigger().
- §4.5 Trigger orchestration → 4.5.
- §4.6 GSAP timeline → 6.2.
- §5 Presets → 5.2–5.6.
- §6 Styles → 7.1.
- §7 A11y → overlay implementation (8.1) + tests (10.x).
- §8 Edge cases → covered in 9.1 (innerRadius clamp, items < 3) and 10.x.
- §9 File layout → mirrored.
- §10 package.json → 0.2.
- §11 tsup.config.ts → 0.4.
- §12 Tests → 2.x, 3.x, 4.x, 5.x, 6.x, 10.x, 11.3.
- §13 CI → 12.4.
- §14–16 → covered by 12.x and 13.x.

**Placeholder scan:** none — every step shows code, exact paths, and expected output.

**Type consistency:** `RadialDockHandle`, `RadialDockAnimationContext`, `RadialDockResolvedGeometry` defined once in 1.1 and reused unchanged. `gsap` injected via `useGsapTimeline` matches `{ timeline }` shape used in `RadialDock.tsx`.
