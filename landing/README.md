# react-radial-dock — landing

A single-file landing page. Zero build step, no dependencies, deploys anywhere static.

## Preview locally

```bash
# from the landing/ directory
python3 -m http.server 4567
# or
npx serve .
```

Then open <http://localhost:4567>.

## Deploy

### Vercel
```bash
vercel deploy landing --prod
```
or drag-drop the `landing/` folder at <https://vercel.com/new>.

### Netlify
```bash
netlify deploy --dir=landing --prod
```
or drag-drop the folder at <https://app.netlify.com/drop>.

### GitHub Pages
Copy the directory contents to a `gh-pages` branch (or `/docs` on main) and enable Pages in repo settings.

### Cloudflare Pages
Connect the repo in the dashboard, set the publish directory to `landing/`, leave the build command blank.

## What's inside

- `index.html` — the entire page. Inline CSS, inline JS, fonts from Google Fonts CDN.
- The interactive radial dock is a vanilla-JS reimplementation of the package's geometry — same arc math, same hover/keyboard model. Right-click anywhere on the page to summon it.
- Keyboard: `Cmd/Ctrl+E` opens the dock at viewport center. Arrow keys navigate, Enter selects, Esc closes.

## Editing

Update copy, colors, or feature cards directly in `index.html`. The CSS is organized top-to-bottom by section; the JS lives at the bottom of `<body>`.
