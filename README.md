# @junction-kit/ui — Lumen UI kit

Themeable React components for hackathon builds: one markup, three skins (`dreamy`, `depth` 3D, `pixel` 8-bit),
plus SVG charts and a canvas entity graph. Only peer dependency: React 18+.

## Install

From the built `ui-dist` branch of the (private) repo — needs GitHub access to the private repo; run `gh auth setup-git` once so git can use your gh login:

```bash
npm i git+https://github.com/mukulvashisht1026/junction-kit.git#ui-dist          # latest
npm i git+https://github.com/mukulvashisht1026/junction-kit.git#ui-v0.1.0        # pinned version
```

Or from a local checkout: `npm i ../junction-kit/packages/ui` (run `npm run build:ui` in the checkout first).

## Use

```tsx
import { Button, Hero, ThemeCtx, ToastProvider } from "@junction-kit/ui";
import "@junction-kit/ui/styles.css"; // once, at your app entry

export default function Page() {
  return (
    <ThemeCtx.Provider value="dreamy">
      <ToastProvider>
        <div className="ui ui-dreamy">
          <main className="ui-main"><Hero title="Ship it" actions={<Button size="lg">Start</Button>} /></main>
        </div>
      </ToastProvider>
    </ThemeCtx.Provider>
  );
}
```

Fonts (optional, components fall back to system fonts) — add to your HTML head:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Press+Start+2P&family=VT323&display=swap">
```

Works with Vite, Next.js (the bundle is marked `"use client"` and renders on the server without touching `window`) and other bundlers.

Full component guide: `docs/UI_KIT.md` in the repo.

## Develop

Inside the monorepo the starter app imports the TypeScript source directly (export condition `source`), so edits hot-reload
without building. `npm run build:ui` produces `dist/`; `make release-ui` publishes it to the `ui-dist` branch.
