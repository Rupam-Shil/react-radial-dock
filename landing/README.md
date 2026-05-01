# react-radial-dock — landing

Next.js 15 (App Router) site for [react-radial-dock](https://www.npmjs.com/package/react-radial-dock). Hosts the marketing page, technical drawing, variants showcase, and an interactive **Playground** that exercises the real npm package.

## Local dev

From the repo root:

```bash
pnpm install                # installs all workspace deps
pnpm --filter react-radial-dock build   # build the lib once (creates dist/)
pnpm --filter rrd-landing dev           # starts on http://localhost:3218
```

After the lib builds, hot-reload works for the landing app. To pick up library source changes, run `pnpm --filter react-radial-dock build` again (or `dev` in another terminal for watch mode).

## Deploying to Vercel

1. **Project root**: `landing` (set this in Vercel → Project → Settings → General → Root Directory)
2. The included `vercel.json` runs:
   - `pnpm install --frozen-lockfile=false` — installs the entire workspace
   - `pnpm --filter react-radial-dock build && pnpm --filter rrd-landing build:next` — builds the library, then the site
3. Output dir is `landing/.next` — Vercel auto-detects.

That's it. Push to your git remote and Vercel will deploy.

## Layout

```
landing/
├── app/
│   ├── layout.tsx        — fonts + metadata
│   ├── globals.css       — design tokens + section styles + playground styles
│   └── page.tsx          — page composition
├── components/
│   ├── HeroViz.tsx       — server-rendered SVG technical drawing
│   ├── VariantStage.tsx  — variant card mini-docks
│   ├── LiveDock.tsx      — global right-click dock (real RadialDock)
│   ├── Playground.tsx    — interactive controls + always-open RadialDock
│   ├── CopyButton.tsx    — clipboard helper
│   ├── CursorGhost.tsx   — cursor follower
│   ├── RcHint.tsx        — corner hint that auto-dismisses
│   ├── Icons.tsx         — Lucide-style SVG icons
│   └── geometry.ts       — arc / polar helpers
├── package.json
├── next.config.mjs
├── vercel.json
└── tsconfig.json
```
