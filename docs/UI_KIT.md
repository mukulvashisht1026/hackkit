# Lumen UI kit — developer guide

A dependency-free React component kit for hackathon builds. One set of components, three skins:

| Theme id | Look | Route in the showcase |
|---|---|---|
| `dreamy` | Light pastel glass, drifting aurora blobs, soft glows | `/#/demo` |
| `depth` | Dark nebula, raised/recessed surfaces, real CSS 3D (tilt, orbit, extrusion) | `/#/demo/3d` |
| `pixel` | Retro 8-bit game: square pixel frames, stepped motion, CRT scanlines, coins and levels | `/#/demo/pixel` |

The kit is the `@junction-kit/ui` package in `packages/ui/` (source in `packages/ui/src/`). The only runtime dependency is React; 3D and animation are plain CSS, charts are SVG, the entity graph is a `<canvas>`.

The live showcase (`apps/web/src/pages/DemoPage.tsx` and `DataSections.tsx`) uses every component and is the best copy-paste reference after this guide.

---

## Contents

1. [Quick start](#1-quick-start)
2. [How theming works](#2-how-theming-works)
3. [Motion and accessibility](#3-motion-and-accessibility)
4. [Page layout](#4-page-layout)
5. [Actions: Button, Tooltip](#5-actions)
6. [Navigation: Navbar, Tabs, Stepper, Accordion](#6-navigation)
7. [Search: SearchBar, CommandPalette](#7-search)
8. [Chat](#8-chat)
9. [Forms](#9-forms)
10. [Display: Card, StatCard, Badge, Avatar, Sparkline](#10-display)
11. [Feedback: Toast, Modal, Progress, loaders](#11-feedback)
12. [Charts](#12-charts)
13. [Entity graph](#13-entity-graph)
14. [Pixel theme extras and the game layer](#14-pixel-theme-extras)
15. [Hooks and helpers](#15-hooks-and-helpers)
16. [CSS utility classes and tokens](#16-css-utility-classes-and-tokens)
17. [Recipes: wiring to the starter backend](#17-recipes)
18. [Customising and extending](#18-customising-and-extending)
19. [Gotchas](#19-gotchas)

---

## 1. Quick start

### Install

**Inside this monorepo** the starter app (`apps/web`) already depends on the workspace package and imports its TypeScript source, so edits to `packages/ui/src` hot-reload with no build step.

**In another project** (React 18+, any bundler — Vite, Next.js, webpack):

```bash
npm i git+https://github.com/mukulvashisht1026/junction-kit.git#ui-dist      # private repo: needs GitHub access (run `gh auth setup-git` once)
```

Then import the stylesheet once at your app entry, and optionally add the fonts to your HTML head:

```tsx
import "@junction-kit/ui/styles.css";
```

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Press+Start+2P&family=VT323&display=swap">
```

The bundle is marked `"use client"` and renders on the server without touching `window`, so it works in Next.js App Router client components.

### Run the showcase

```bash
make setup      # once
make api        # backend on :8000 (optional — the kit works without it)
make web        # frontend on :5173
# open http://localhost:5173/#/demo
```

### Minimal page

Every page built with the kit needs three wrappers, in this order:

1. `ThemeCtx.Provider` — tells components which skin is active (some render different visuals per theme).
2. `ToastProvider` — only if you use toasts (`useToast`).
3. A `<div className="ui ui-<theme>">` — carries the CSS tokens every component reads.

```tsx
// apps/web/src/pages/MyPage.tsx
import { Background, Button, Card, Hero, Navbar, Logo, Section, ThemeCtx, ToastProvider, useToast } from "@junction-kit/ui";

export default function MyPage() {
  const theme = "dreamy"; // or "depth" | "pixel"
  return (
    <ThemeCtx.Provider value={theme}>
      <ToastProvider>
        <div className={`ui ui-${theme}`}>
          <Background />
          <Navbar brand={<><Logo /> MyApp</>} items={[{ label: "Features", onClick: () => scrollTo("features") }]} />
          <main className="ui-main">
            <Hero title="Ship it" subtitle="One sentence about your idea." actions={<Button size="lg">Try it</Button>} />
            <Section id="features" title="Features"><Body /></Section>
          </main>
        </div>
      </ToastProvider>
    </ThemeCtx.Provider>
  );
}

function Body() {
  const toast = useToast(); // must be inside ToastProvider
  return <Card><Button onClick={() => toast({ title: "Hello!", tone: "success" })}>Toast</Button></Card>;
}

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
```

### Add it as a route

Routing is a tiny hash router (`src/router.ts`), so nothing changes in Vite or nginx. Add a branch in `src/main.tsx`:

```tsx
if (route.startsWith("/my-page")) return <MyPage />;
```

and link to it with `<a href="#/my-page">`.

### Importing

Import everything from the package root:

```tsx
import { Button, Chat, LineChart, Icon } from "@junction-kit/ui";
```

---

## 2. How theming works

All components use the same markup. Their look comes from CSS custom properties (tokens) defined on `.ui-dreamy`, `.ui-depth` and `.ui-pixel` in `ui.css`, plus a few theme-specific override blocks.

**The theme class and `ThemeCtx` must agree.** The class drives CSS; the context drives JS-level differences:

| Component | What changes per theme in JS |
|---|---|
| `Hero` | default visual: `Orb` (dreamy), `HeroScene` cube (depth), `PixelScene` robot (pixel) |
| `Background` | blobs+sparkles / starfield+grid floor+cubes / pixel sky+mountains |
| `Logo` | sparkle tile / spinning cube / pixel robot |
| `Card` | default tilt: off / subtle / off |
| `BarChart`, `Histogram` | rounded tops / extruded 3D bars / square bars |
| `LineChart` | smooth / smooth with glow / staircase |
| `EntityGraph` | flat / 3D orbiting spheres / pixel sprites |

### Switching themes at runtime

Keep the theme in state (or the URL, like the showcase does) and pass it to both places:

```tsx
const [theme, setTheme] = useState<UITheme>("dreamy");
<ThemeCtx.Provider value={theme}>
  <div className={`ui ui-${theme}`}>
    <Tabs value={theme} onChange={(t) => setTheme(t as UITheme)}
      tabs={[{ id: "dreamy", label: "Dreamy" }, { id: "depth", label: "3D" }, { id: "pixel", label: "Pixel" }]} />
    …
```

### Body background

`.ui` sets its own background, but overscroll can reveal `<body>`. The showcase sets `document.body.style.background` to the theme's page colour (`#f6f2ff`, `#060814`, `#1a1c2c`) — copy that effect from `DemoPage.tsx` if you use the dreamy (light) theme.

### Fonts

`index.html` loads Outfit (dreamy/3D) and Press Start 2P + VT323 (pixel) from Google Fonts. Offline, the kit falls back to system fonts and still works.

---

## 3. Motion and accessibility

- All animation respects the OS **Reduce Motion** setting by default.
- `MotionCtx` lets the user override it:
  - `undefined` (default) — follow the OS.
  - `true` — force animations on (add class `is-motion` to the `.ui` div).
  - `false` — force them off (class `is-still`).

```tsx
import { MotionCtx, motionClass, cx } from "@junction-kit/ui";

const [motion, setMotion] = useState<boolean | undefined>(undefined);
<MotionCtx.Provider value={motion}>
  <div className={cx("ui", `ui-${theme}`, motionClass(motion))}>
```

The showcase stores this choice in `localStorage` and exposes it as the ⚡ button in its bottom dock.

Other accessibility built in:

- Buttons, tabs, toggles and checkboxes are real `<button>`/`<input>` elements with focus rings.
- `SearchBar` is a combobox with arrow-key navigation; `Modal` closes on Esc and locks scroll.
- Charts have `role="img"` + `aria-label`, a legend for ≥2 series, direct labels, and a **Table** view in `ChartCard`. Chart colours were validated for colour-blind separation (see §12).
- Graph and scatter groups use distinct marker shapes so colour is never the only cue.

---

## 4. Page layout

### `Background`

Fixed, animated backdrop for the current theme. Render it once, first child of `.ui`.

```tsx
<div className="ui ui-depth"><Background /> …</div>
```

### `Hero`

| Prop | Type | Notes |
|---|---|---|
| `title` | ReactNode | required; wrap a word in `<span className="ui-grad-text">` for the animated accent |
| `eyebrow` | ReactNode | small line above the title, usually a `Badge` |
| `subtitle` | ReactNode | |
| `actions` | ReactNode | buttons |
| `visual` | ReactNode | right-hand visual; defaults to the theme's scene |

```tsx
<Hero
  eyebrow={<Badge dot>Live beta</Badge>}
  title={<>Find anomalies <span className="ui-grad-text">before</span> they cost you</>}
  subtitle="Upload a CSV, get alerts with evidence."
  actions={<><Button size="lg" pill variant="glow">Upload data</Button><Button size="lg" pill variant="secondary">Watch demo</Button></>}
/>
```

### `Section`

Page section with an animated heading block. The `id` doubles as a scroll target.

| Prop | Type | Notes |
|---|---|---|
| `title` | ReactNode | required |
| `id` | string | anchor for nav scrolling (`scroll-margin-top` accounts for the sticky nav) |
| `kicker` | string | small uppercase label above the title |
| `desc` | ReactNode | paragraph under the title |
| `code` | string | shows a one-line code sample (handy for docs pages) |
| `children` | ReactNode | content; fades/tilts in when scrolled into view |

### `Marquee`

Infinite horizontal ticker (pauses on hover). `items: ReactNode[]`, `speed` = seconds per loop (default 28).

```tsx
<Marquee items={["Partner A", "Partner B", "Partner C"].map((p) => <><Icon.sparkle /> {p}</>)} />
```

### `Footer`

A flex row with a top border: `<Footer><span>© Team</span><a className="ui-dock-link" href="#/">Home</a></Footer>`.

### `Logo`, `Cube`, `Orb`, `HeroScene`

Theme visuals you can reuse anywhere: `<Cube size={80} />` is a pure-CSS 3D cube (wrap it in an element with `perspective` for depth); `<Orb />` is the dreamy hero orb; `<HeroScene />` is the 3D cube with orbit rings that tilts toward the pointer.

### Layout classes

```tsx
<main className="ui-main">                    {/* centred, max 1160px, responsive gutters */}
  <div className="ui-grid">…</div>            {/* auto-fit columns, min 260px */}
  <div className="ui-grid is-2">…</div>       {/* auto-fit columns, min 440px (two-up on desktop) */}
  <div className="ui-row">…</div>             {/* wrapping flex row, 12px gap */}
  <div className="ui-stack">…</div>           {/* vertical flex, 16px gap */}
</main>
```

---

## 5. Actions

### `Button`

Accepts every native `<button>` attribute plus:

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `primary` `secondary` `ghost` `outline` `glow` `gradient` `danger` `success` | `primary` | `glow` pulses; `gradient` animates |
| `size` | `sm` `md` `lg` | `md` | |
| `pill` | boolean | | fully rounded (square in pixel theme) |
| `square` | boolean | | icon-only; **pass `aria-label`** |
| `block` | boolean | | full width |
| `icon` / `iconRight` | ReactNode | | e.g. `<Icon.arrow />` |
| `loading` | boolean | | shows a spinner, disables the button, keeps its width |
| `magnetic` | boolean | | drifts toward the pointer |
| `ripple` | boolean | `true` | click ripple |

`type` defaults to `"button"`; pass `type="submit"` inside forms.

```tsx
<Button variant="glow" size="lg" pill magnetic iconRight={<Icon.arrow />} onClick={start}>Get started</Button>
<Button loading={saving} onClick={save}>Save</Button>
<Button square variant="ghost" aria-label="Notifications" icon={<Icon.bell />}><span className="ui-btn-dot" /></Button>
```

In 3D the buttons become keycaps that press down; in pixel they are bevelled blocks.

### `Tooltip`

Wraps any element and shows `tip` on hover or keyboard focus.

```tsx
<Tooltip tip="Delete"><Button square variant="danger" aria-label="Delete" icon={<Icon.x />} /></Tooltip>
```

### `Icon`

A small inline SVG set that inherits `currentColor` and sizes to `1em`:
`search send sparkle menu x check bell arrow upload bot plus chevron heart zap user mail cube chart info alert layers gamepad back`.

```tsx
<Icon.upload style={{ fontSize: 20 }} />
```

Add more in `packages/ui/src/icons.tsx` with `make("<svg path d>")`.

---

## 6. Navigation

### `Navbar`

Sticky glass bar that shrinks on scroll and turns into an animated drawer under 820px.

| Prop | Type | Notes |
|---|---|---|
| `brand` | ReactNode | logo + name |
| `items` | `NavItem[]` | `{ label, href?, onClick?, active? }` |
| `actions` | ReactNode | right-side buttons (also shown in the mobile drawer) |
| `sticky` | boolean | default `true` |

```tsx
<Navbar
  brand={<><Logo /> Acme</>}
  items={[
    { label: "Product", onClick: () => scrollTo("product"), active: true },
    { label: "Docs", href: "#/docs" },
  ]}
  actions={<><Button size="sm" variant="ghost">Log in</Button><Button size="sm" pill>Sign up</Button></>}
/>
```

> With the hash router, use `onClick` + `scrollIntoView` for in-page anchors. `href="#section"` would be read as a route change.

### `Tabs`

Controlled segmented tabs with a springy sliding indicator.

| Prop | Type | Notes |
|---|---|---|
| `tabs` | `{ id, label }[]` | `label` can include icons |
| `value` | string | active id |
| `onChange` | `(id) => void` | |
| `variant` | `pill` \| `line` | default `pill` |

Pair with a keyed panel to animate content changes:

```tsx
const [tab, setTab] = useState("overview");
<Tabs value={tab} onChange={setTab} tabs={[{ id: "overview", label: "Overview" }, { id: "data", label: "Data" }]} />
<div className="ui-tabpanel" key={tab}>{panels[tab]}</div>
```

### `Stepper`

`<Stepper steps={["Idea", "Build", "Pitch"]} current={1} />` — steps before `current` are done (checkmark), `current` is highlighted. Drive it with your own Back/Next buttons.

### `Accordion`

`items: { title, content }[]`, `defaultOpen` index (default 0; pass `-1` for all closed). One item open at a time.

```tsx
<Accordion items={[{ title: "Is it free?", content: "Yes." }, { title: "Offline?", content: "Yes." }]} />
```

---

## 7. Search

### `SearchBar`

Filtering search with match highlighting, keyboard navigation (↑ ↓ Enter Esc) and a loading state.

| Prop | Type | Notes |
|---|---|---|
| `items` | `SearchItem[]` | `{ label, hint?, icon? }`; filtered by label and hint |
| `onSelect` | `(item) => void` | picking a suggestion |
| `onSearch` | `(query) => void` | Enter with no suggestion highlighted / open |
| `loading` | boolean | spinner in the box |
| `placeholder` | string | |
| `shortcut` | string | single key that focuses the bar from anywhere, e.g. `"/"` |
| `autoFocus`, `inline` | boolean | `inline` keeps the result list always visible (used by the palette) |

```tsx
const [busy, setBusy] = useState(false);
<Card tilt={false} className="ui-raise">
  <SearchBar items={commands} shortcut="/" loading={busy}
    onSelect={(i) => run(i.label)}
    onSearch={async (q) => { setBusy(true); await search(q); setBusy(false); }} />
</Card>
```

> Put `className="ui-raise"` on the card that contains a `SearchBar` so its dropdown isn't covered by the cards after it.

**Server-side results:** keep `items` in state and update it from your API as the user types (debounce in your handler); the bar re-filters whatever list you pass.

### `CommandPalette`

A ⌘K / Ctrl+K palette: a `SearchBar` inside a `Modal`. It registers the shortcut itself.

```tsx
const [open, setOpen] = useState(false);
<CommandPalette items={commands} open={open} onOpenChange={setOpen} onSelect={(i) => run(i.label)} />
<Button variant="ghost" square aria-label="Search" icon={<Icon.search />} onClick={() => setOpen(true)} />
```

---

## 8. Chat

`Chat` is a full chat window: header with live status, empty state with suggestion chips, user/assistant bubbles, typing indicator, typewriter reveal, auto-scroll and an auto-growing input (Enter sends, Shift+Enter adds a newline).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `onSend` | `(text, history) => Promise<string>` | required | return the assistant reply; a thrown error is shown as a message |
| `title`, `subtitle` | string | `"Assistant"`, `"Online"` | subtitle switches to "typing…" while waiting |
| `suggestions` | string[] | `[]` | chips shown while the chat is empty |
| `initial` | `ChatMessage[]` | `[]` | seed messages `{ id, role: "user" \| "assistant", text }` |
| `placeholder` | string | | |
| `typewriter` | boolean | `true` | reveal replies character by character |

### Wire it to the starter backend

```tsx
import { api } from "../api";

// Plain LLM call
const askLLM = async (text: string) =>
  (await api<{ text: string }>("/llm", { prompt: text, system: "Be concise." })).text;

// Grounded answer over uploaded documents, with citations
const askDocs = async (text: string) => {
  const r = await api<{ answer: string; cited_ids: number[]; sources: { id: number; meta: { source?: string } }[] }>("/ask", { question: text });
  const cites = r.sources.filter((s) => r.cited_ids.includes(s.id)).map((s) => `[${s.id}] ${s.meta.source ?? ""}`);
  return cites.length ? `${r.answer}\n\nSources: ${cites.join(", ")}` : r.answer;
};

<Chat title="Docs copilot" onSend={askDocs} suggestions={["Summarise the deck", "What are the risks?"]} />
```

`history` contains every message including the new one, so you can send the whole conversation to a multi-turn endpoint.

Per theme: tilted panel in 3D, RPG dialogue box with a blinking ▼ in pixel.

---

## 9. Forms

All inputs are controlled — you own the state.

### `Field` (text input with floating label)

Accepts every `<input>` attribute plus `label` (required), `icon`, `hint`, `error`. **Don't pass `placeholder`** — the floating label uses it internally.

```tsx
const [email, setEmail] = useState("");
const error = email && !/^\S+@\S+\.\S+$/.test(email) ? "Not an email" : undefined;
<Field label="Email" type="email" icon={<Icon.mail />} value={email} onChange={(e) => setEmail(e.target.value)} error={error} hint="We never spam" />
```

`error` turns the field red and shakes it once.

### `TextArea`

Same floating label: `<TextArea label="Describe your idea" rows={4} value={v} onChange={(e) => setV(e.target.value)} />`.

### `Select`

A styled native `<select>`; pass `<option>` children and `aria-label`.

```tsx
<Select aria-label="Track" value={track} onChange={(e) => setTrack(e.target.value)}>
  <option value="ai">AI</option><option value="hw">Hardware</option>
</Select>
```

### `Toggle`, `Checkbox`

```tsx
<Toggle label="Email notifications" checked={notify} onChange={setNotify} />
<Checkbox label="I accept the rules" checked={terms} onChange={setTerms} />
```

### `Slider`

`<Slider label="Team size" min={1} max={6} value={size} onChange={setSize} />` — shows the value; the track fills with the theme gradient.

### `FileDrop`

Drag-and-drop or click-to-browse upload box. Lists the chosen files.

| Prop | Type | Notes |
|---|---|---|
| `onFiles` | `(files: File[]) => void` | |
| `accept` | string | e.g. `".csv,.xlsx,.pdf"` |
| `multiple` | boolean | default `true` |
| `label`, `hint` | string | |

```tsx
<FileDrop accept=".csv,.xlsx,.pdf,.pptx" hint="CSV becomes a SQL table, PDF becomes searchable" onFiles={upload} />
```

See [§17](#17-recipes) for an `upload` that posts to `/api/ingest/file`.

### A complete form

```tsx
<Card tilt={false}>
  <form className="ui-stack" onSubmit={(e) => { e.preventDefault(); submit(); }}>
    <Field label="Name" icon={<Icon.user />} value={name} onChange={(e) => setName(e.target.value)} />
    <Field label="Email" type="email" icon={<Icon.mail />} value={email} onChange={(e) => setEmail(e.target.value)} />
    <Checkbox label="I accept the rules" checked={terms} onChange={setTerms} />
    <Button type="submit" block size="lg" variant="glow">Register</Button>
  </form>
</Card>
```

---

## 10. Display

### `Card`

A surface with cursor-following glow. Accepts all `<div>` attributes plus `tilt`:

| `tilt` value | Effect |
|---|---|
| omitted | theme default: off in dreamy/pixel, subtle (6°) in 3D |
| `true` | strong tilt (14°); in 3D the card's children float on separate depth layers |
| number | max tilt in degrees |
| `false` | no tilt, lifts on hover instead — **use this for cards holding inputs, search, charts or graphs** |

```tsx
<Card tilt>
  <div className="ui-icon-tile"><Icon.zap /></div>
  <h3>Fast</h3>
  <p>Answers in under a second.</p>
  <span className="ui-card-link">Learn more <Icon.arrow /></span>
</Card>
```

### `StatCard`

KPI tile that counts up when scrolled into view, with optional delta badge and sparkline.

| Prop | Type | Notes |
|---|---|---|
| `label` | string | |
| `value` | number | |
| `prefix`, `suffix` | string | e.g. `"$"`, `"%"` |
| `decimals` | number | default 0 |
| `delta` | number | positive renders ▲ green, negative ▼ red |
| `spark` | number[] | sparkline data |
| `icon` | ReactNode | |

```tsx
<div className="ui-grid">
  <StatCard label="Revenue" value={48210} prefix="€" delta={12.4} spark={weekly} icon={<Icon.chart />} />
  <StatCard label="Accuracy" value={94.2} decimals={1} suffix="%" delta={3.1} />
</div>
```

### `Badge`

`tone`: `accent` (default) `ok` `bad` `warn` `neutral`; `dot` adds a pulsing dot.

```tsx
<Badge tone="ok" dot>Live</Badge> <Badge tone="warn">Demo at 14:00</Badge>
```

### `Avatar`, `AvatarGroup`

```tsx
<Avatar name="Ada Lovelace" status="online" />           {/* initials on a colour derived from the name */}
<Avatar name="Ada" src="/ada.png" size={48} />
<AvatarGroup names={team.map((m) => m.name)} max={4} />  {/* overlapping, "+N" for the rest */}
```

### `Sparkline`

`<Sparkline data={[3, 5, 4, 8, 7]} height={44} />` — draws itself in when it appears (inside a `StatCard`).

---

## 11. Feedback

### Toasts

Wrap the app in `ToastProvider` (inside `ThemeCtx.Provider`), then call `useToast()` anywhere below it.

```tsx
const toast = useToast();
toast({ title: "Saved", desc: "All changes stored", tone: "success" }); // tone: info | success | warn | error
```

`<ToastProvider duration={3800}>` sets how long toasts stay. At most 4 show at once; each has a countdown bar.

### `Modal`

| Prop | Type | Notes |
|---|---|---|
| `open`, `onClose` | boolean, `() => void` | Esc and backdrop click call `onClose` |
| `title` | ReactNode | |
| `footer` | ReactNode | right-aligned buttons |
| `bare` | boolean | no header/padding (used by the palette) |

```tsx
<Modal open={open} onClose={() => setOpen(false)} title="Delete project?"
  footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button variant="danger" onClick={del}>Delete</Button></>}>
  <p className="ui-muted">This can't be undone.</p>
</Modal>
```

Modals and toasts render into `<body>` through `Portal`, which re-applies the theme class, so they're styled correctly anywhere.

### Progress and loaders

```tsx
<Progress value={uploadPct} />          {/* 0–100, animated stripes */}
<Progress indeterminate />
<ProgressRing value={72} size={84} />   {/* gradient ring with % in the middle */}
<Spinner size={28} />
<Dots />                                {/* typing dots */}
<span className="ui-orbit-loader" />    {/* two orbiting dots */}
<Skeleton w="70%" h={12} />  <Skeleton circle h={40} />
```

A loading card pattern:

```tsx
{data ? <Result data={data} /> : (
  <div className="ui-row" style={{ flexWrap: "nowrap" }}>
    <Skeleton circle h={42} />
    <div className="ui-stack" style={{ flex: 1, gap: 8 }}><Skeleton w="70%" /><Skeleton w="40%" h={10} /></div>
  </div>
)}
```

---

## 12. Charts

SVG charts that share the theme. Common behaviour:

- **Responsive** — they fill their container's width.
- **Animated** — they grow in when scrolled into view and tween smoothly whenever data changes, so feeding new arrays gives you live charts for free.
- **Hover** — crosshair or per-mark tooltip.
- **Colours** — series use `--s1`…`--s4` in a fixed order validated for colour-blind separation and contrast in each theme. Colour follows a series' **position in the array**, so keep the array stable and hide series with `hidden` rather than removing them.
- **Limits** — at most **4 series** per line/bar chart, **3 groups** in a scatter (each group also gets its own marker shape), donuts fold anything beyond 4 slices into "Other". Need more? Split into small multiples (several charts) rather than adding colours.
- **One y-axis per chart.** Two measures with different units go in two charts.

### `ChartCard` (wrap every chart in this)

| Prop | Type | Notes |
|---|---|---|
| `title`, `subtitle` | ReactNode | |
| `legend` | `LegendItem[]` | shown when ≥2 items; `{ name, color, active?, onToggle?, shape? }` |
| `table` | `{ columns, rows }` | adds a **Table** toggle showing the raw numbers (accessibility + judges love it) |
| `actions` | ReactNode | extra controls in the header |

### `LineChart`

| Prop | Type | Default |
|---|---|---|
| `labels` | string[] | x-axis labels |
| `series` | `{ name, values: number[] }[]` | ≤4 |
| `hidden` | string[] | series names to hide (keeps colours stable) |
| `area` | boolean | `true` |
| `height` | number | 260 |
| `format` | `(v) => string` | compact numbers (`1.2k`) |

```tsx
const [hidden, setHidden] = useState<string[]>([]);
const toggle = (n: string) => setHidden((h) => (h.includes(n) ? h.filter((x) => x !== n) : [...h, n]));

<ChartCard title="Requests per day" subtitle="Click the legend to hide a series"
  legend={series.map((s, i) => ({ name: s.name, color: seriesColor(i), active: !hidden.includes(s.name), onToggle: () => toggle(s.name) }))}
  table={{ columns: ["Day", ...series.map((s) => s.name)], rows: labels.map((l, i) => [l, ...series.map((s) => s.values[i])]) }}>
  <LineChart labels={labels} series={series} hidden={hidden} />
</ChartCard>
```

**Live streaming:** push a new point and drop the oldest; the chart animates the change.

```tsx
useEffect(() => {
  const t = setInterval(() => {
    setLabels((l) => [...l.slice(1), new Date().toLocaleTimeString()]);
    setSeries((ss) => ss.map((s) => ({ ...s, values: [...s.values.slice(1), nextValue(s)] })));
  }, 1500);
  return () => clearInterval(t);
}, []);
```

### `BarChart`

Grouped bars. Same `labels` / `series` / `height` / `format` props as `LineChart`. The tallest bar is labelled; others show values on hover.

```tsx
<BarChart labels={["W1", "W2", "W3"]} series={[{ name: "Teams", values: [20, 31, 44] }, { name: "Solo", values: [12, 15, 22] }]} />
```

### `DonutChart`

Part-to-whole. `slices: { name, value }[]`, `size` (px, default 210), `label` (centre caption), `format`. Hovering a slice or legend row pops it out and shows its share in the centre.

```tsx
<DonutChart slices={[{ name: "Direct", value: 4200 }, { name: "Search", value: 3100 }, { name: "Social", value: 1900 }]} label="Sessions" />
```

### `ScatterChart`

Relationship between two measures, with an optional least-squares trend line and its correlation `r`.

| Prop | Type | Notes |
|---|---|---|
| `groups` | `{ name, points: { x, y, label? }[] }[]` | ≤3 groups |
| `xLabel`, `yLabel` | string | axis titles (also used in tooltips) |
| `trend` | boolean | default `true` |
| `formatX`, `formatY` | `(v) => string` | |

### `Histogram`

Distribution of raw values, with mean line, median (dashed), a shaded ±1σ band, and a stats row (n, mean, median, σ, p95).

```tsx
<Histogram values={latenciesMs} bins={18} unit="ms" />
```

Need the numbers elsewhere? `summarize(values)` returns `{ n, mean, sd, median, p95, min, max }`.

### `Heatmap`

Matrix of values in a 5-step single-hue scale (with a Low→High legend).

```tsx
<Heatmap rows={["Mon", "Tue", "Wed"]} cols={hours.map(String)} values={matrix /* rows × cols */} colEvery={3} />
```

`colEvery` thins column labels; `cell` sets row height (px).

### Small pieces

`Legend`, `Swatch` (colour chip with optional `shape` 0–3: circle, square, diamond, triangle), `seriesColor(i)`, `fmtCompact(v)` are exported for building your own chart chrome.

### Filters row

Put filters in one row above the charts:

```tsx
<div className="ui-filters">
  <Tabs value={range} onChange={setRange} tabs={[{ id: "7", label: "7 days" }, { id: "30", label: "30 days" }]} />
  <Toggle label="Live data" checked={live} onChange={setLive} />
</div>
```

---

## 13. Entity graph

`EntityGraph` is a canvas force-directed graph for showing interactions between entities — services, people, accounts, devices, papers, anything with links.

| Prop | Type | Notes |
|---|---|---|
| `nodes` | `{ id, label, group, meta? }[]` | `group` is an index into `groups`; `meta` is free-form data for your inspector panel |
| `edges` | `{ source, target, weight? }[]` | `weight` thickens the line and speeds its particles |
| `groups` | string[] | legend names; ≤4 (each gets a colour **and** a shape) |
| `events` | `{ id, source, target }[]` | each **new** `id` fires a pulse from source to target |
| `selected` | string \| null | highlighted node id |
| `onSelect` | `(node \| null) => void` | click a node, or empty space to clear |
| `height` | number | default 460 |

Interactions: drag nodes, scroll to zoom, drag empty space to pan (in 3D: to orbit; Shift+drag pans), hover to highlight neighbours, zoom/reset buttons in the corner. The view auto-fits until the user zooms or pans. Adding or removing nodes keeps existing positions; new nodes appear next to a neighbour.

```tsx
const [selected, setSelected] = useState<GraphNode | null>(null);
const [events, setEvents] = useState<GraphEvent[]>([]);

// e.g. from a WebSocket / polling endpoint:
const onMessage = (m: { from: string; to: string }) =>
  setEvents((p) => [{ id: crypto.randomUUID(), source: m.from, target: m.to }, ...p].slice(0, 50));

<Card tilt={false} style={{ padding: 10 }}>
  <EntityGraph nodes={nodes} edges={edges} groups={["Users", "Services", "Databases", "Models"]}
    events={events} selected={selected?.id ?? null} onSelect={setSelected} />
</Card>
{selected && (
  <Card tilt={false}>
    <h3>{selected.label}</h3>
    <dl className="ui-kv">{Object.entries(selected.meta ?? {}).map(([k, v]) => <Fragment key={k}><dt>{k}</dt><dd>{v}</dd></Fragment>)}</dl>
  </Card>
)}
```

Keep `events` bounded (e.g. last 50); the graph only reacts to ids it hasn't seen. `GraphSection` in `DataSections.tsx` shows an inspector panel, a live interaction log, "add node" and a traffic-spike simulation.

**Scale:** layout is O(n²) per frame — comfortable up to ~150 nodes. For bigger graphs, pre-filter to the neighbourhood the user is looking at.

---

## 14. Pixel theme extras

The pixel skin works with every component automatically. These extras add the game feel.

### `Sprite`

Pixel art from strings: one character per pixel, `.` is transparent, letters map to a palette.

```tsx
import { Sprite, COIN, HEART, ROBOT, STAR } from "@junction-kit/ui";

<Sprite art={COIN} scale={4} title="Coin" />
<Sprite art={["..RR..", ".RRRR.", "RRRRRR"]} scale={6} colors={{ R: "#ef7d57" }} />
```

Built-in palette letters: `K` outline, `B` blue, `L` light cyan, `D` dark blue, `Y` yellow, `O` orange, `W` white, `R` red, `G` green, `M` grey, `P` purple. Any other character is used as a literal colour.

### `GameLayer`, `useGame`, `PixelHUD`

`GameLayer` turns clicks into coins: every click on a button or link inside `.ui` gives +10 and a floating "+10". Thresholds unlock achievement toasts, every 200 coins is a level, ↑↑↓↓←→←→BA gives +999, and the score persists in `localStorage`. It needs `ToastProvider` above it.

```tsx
<ToastProvider>
  <div className="ui ui-pixel">
    <GameLayer enabled={theme === "pixel"}>
      <PixelHUD />          {/* coins, level, XP bar, hearts, sound toggle */}
      …page…
    </GameLayer>
  </div>
</ToastProvider>
```

Award points from your own logic:

```tsx
const game = useGame();                        // null outside GameLayer
game?.add(100, { x: e.clientX, y: e.clientY }); // position is optional (for the floating "+100")
game?.score; game?.level; game?.xp;            // xp is 0–1 progress to the next level
```

Opt an element out of automatic coins with `data-coin` (use it on anything that awards its own points):

```tsx
<button data-coin onClick={(e) => game?.add(50, { x: e.clientX, y: e.clientY })}>Open chest</button>
```

Sound (8-bit blips via WebAudio) is off by default; the HUD has the toggle.

### `PixelScene`, `PixelBackground`

The hero robot scene (clickable robot, collectable coins) and the parallax sky. `Hero` and `Background` pick them automatically in the pixel theme.

---

## 15. Hooks and helpers

| Export | Use |
|---|---|
| `useUITheme()` | current theme id |
| `useReducedMotion()` | `true` when animations should be skipped (OS setting or `MotionCtx`) |
| `useTilt<T>(maxDeg)` | returns a ref; sets `--rx/--ry` (tilt) and `--mx/--my` (pointer %) on the element |
| `useInView<T>(once = true)` | `[ref, inView]` via IntersectionObserver |
| `useCountUp(target, run, ms)` | eased number for count-up effects |
| `Reveal` | `<Reveal delay={120}>…</Reveal>` fades/slides children in when visible |
| `Portal` | render into `<body>` while keeping theme styles |
| `cx(...classes)` | join truthy class names |
| `uid()` | short random id |

Make your own tilting element:

```tsx
const ref = useTilt<HTMLDivElement>(12);
<div ref={ref} style={{ transform: "perspective(800px) rotateX(var(--rx)) rotateY(var(--ry))", transition: "transform .2s" }}>…</div>
```

---

## 16. CSS utility classes and tokens

### Utility classes

| Class | Purpose |
|---|---|
| `ui-main` | centred page column |
| `ui-grid`, `ui-grid is-2` | responsive card grids |
| `ui-row` (`is-center`), `ui-stack` | flex row / column |
| `ui-label` | small uppercase caption |
| `ui-muted` | secondary text colour |
| `ui-grad-text` | animated gradient text (colour-cycling in pixel) |
| `ui-icon-tile` | gradient icon square for feature cards |
| `ui-card-link` | "Learn more →" link with animated arrow |
| `ui-raise` | lift a card above its siblings (for dropdowns) |
| `ui-frame` | dashed outline box (for showcasing a component) |
| `ui-kbd` | keyboard key chip |
| `ui-chip` | small pill button |
| `ui-icon-btn` | round icon-only button |
| `ui-btn-dot` | notification dot inside a button |
| `ui-code` | inline code sample block |
| `ui-tabpanel` | fade-up animation for tab content (use with `key`) |
| `ui-filters` | filter row above charts |
| `ui-kv` | key/value `<dl>` grid |
| `ui-log` | animated event list |
| `ui-table` (in `ui-table-wrap`) | themed data table |
| `ui-dock`, `ui-dock-link` | floating bottom bar |

### Tokens (set per theme in `ui.css`)

| Token | Meaning |
|---|---|
| `--page`, `--page-solid` | page background |
| `--ink`, `--mut`, `--acc-ink` | primary text, secondary text, accent text |
| `--surface`, `--surface-2` | card / raised surfaces (may be gradients) |
| `--line`, `--line-strong` | borders |
| `--hl`, `--hl-2` | highlight fills (hover, skeleton shimmer) |
| `--a1`…`--a4` | accent colours |
| `--grad`, `--grad-2` | accent gradients (buttons, indicators) |
| `--ok`, `--bad`, `--warn` | status colours (always paired with an icon or label) |
| `--shadow`, `--shadow-lg`, `--ring` | elevation and focus ring |
| `--blur` | backdrop blur for glass surfaces |
| `--r`, `--r-sm`, `--r-btn` | corner radii |
| `--s1`…`--s4`, `--s-other` | chart series colours (validated order) |
| `--q1`…`--q5` | sequential scale (heatmap) |
| `--chart-surface`, `--grid` | chart background (for mark rings/gaps) and gridlines |
| `--spring`, `--ease` | motion curves (`steps()` in pixel) |

Use tokens in your own CSS so new components follow the theme:

```css
.my-banner { background: var(--surface); color: var(--ink); border: 1px solid var(--line); border-radius: var(--r); box-shadow: var(--shadow); }
```

---

## 17. Recipes

All examples use the starter's `api()` helper (`src/api.ts`), which prefixes `/api` and throws with the server's error message.

### Upload → table → chart

```tsx
const toast = useToast();
const upload = async (files: File[]) => {
  const fd = new FormData();
  fd.append("file", files[0]);
  try {
    const r = await api<any>("/ingest/file", undefined, fd);
    toast({ title: "Uploaded", desc: r.kind === "table" ? `${r.rows} rows → table "${r.name}"` : `${r.chunks} chunks indexed`, tone: "success" });
    if (r.kind === "table") setRows(await api<any[]>("/tables/sql", { query: `select * from "${r.name}" limit 200` }));
  } catch (e: any) {
    toast({ title: "Upload failed", desc: e.message, tone: "error" });
  }
};

<FileDrop accept=".csv,.xlsx" onFiles={upload} />
{rows.length > 0 && (
  <ChartCard title="Revenue by month" table={{ columns: Object.keys(rows[0]), rows: rows.map((r) => Object.values(r)) }}>
    <BarChart labels={rows.map((r) => r.month)} series={[{ name: "Revenue", values: rows.map((r) => r.revenue) }]} />
  </ChartCard>
)}
```

### Drift alarm from `/api/anomaly`

The endpoint returns rows with `value`, `ewma`, `upper`, `lower`, `alarm`.

```tsx
const [res, setRes] = useState<any[]>([]);
useEffect(() => { api<any[]>("/anomaly", { values, method: "ewma" }).then(setRes); }, [values]);
const firstAlarm = res.findIndex((r) => r.alarm);

<ChartCard title="Sensor drift" subtitle={firstAlarm >= 0 ? `Alarm from point ${firstAlarm}` : "No drift detected"}
  legend={[{ name: "Reading", color: seriesColor(0) }, { name: "EWMA", color: seriesColor(1) }]}>
  <LineChart area={false} labels={res.map((_, i) => String(i))}
    series={[{ name: "Reading", values: res.map((r) => r.value) }, { name: "EWMA", values: res.map((r) => r.ewma) }]} />
</ChartCard>
{firstAlarm >= 0 && <Badge tone="bad" dot>Drift alarm</Badge>}
```

### Evidence-backed AI answers

The backend's `Evidenced` pattern (value + source + quote + confidence) maps neatly onto a card:

```tsx
<Card tilt={false}>
  <div className="ui-row" style={{ justifyContent: "space-between" }}>
    <h3>{field.value ?? "Not found"}</h3>
    <Badge tone={field.confidence > 0.7 ? "ok" : field.confidence > 0.4 ? "warn" : "bad"}>{Math.round(field.confidence * 100)}% sure</Badge>
  </div>
  {field.quote && <p>“{field.quote}”</p>}
  <span className="ui-muted">{field.source}</span>
</Card>
```

### Landing page skeleton

`Background` → `Navbar` → `Hero` → `Marquee` (partners/stack) → `Section` with a `ui-grid` of tilted feature `Card`s → `Section` with `StatCard`s → `Section` with `Accordion` FAQ → `Footer`.

### Dashboard skeleton

`Navbar` with a `CommandPalette` → a `ui-filters` row → `ui-grid` of `StatCard`s → full-width `ChartCard` + `LineChart` → `ui-grid is-2` of chart cards → an `EntityGraph` card with an inspector `Card` beside it.

### AI assistant page

`Section` with `ui-grid is-2`: `Chat` on the left wired to `/api/ask`; on the right a `FileDrop` (feeds `/api/ingest/file`) and a `Card` listing indexed documents.

---

## 18. Customising and extending

### Change colours

Edit the token block for the theme at the top of `packages/ui/src/ui.css` (`.ui-dreamy`, `.ui-depth`, `.ui-pixel`). Accents, gradients and surfaces can change freely.

**Chart colours (`--s1`…`--s4`)** are an ordered, validated set. If you replace them, re-check colour-blind separation and contrast against `--chart-surface`, and keep the order that passes — adjacent colours must stay distinguishable.

### Add a component

1. Create `packages/ui/src/MyThing.tsx`, style it with `ui-` prefixed classes that read tokens only (no hard-coded colours).
2. Export it from `packages/ui/src/index.ts`.
3. If it needs theme-specific behaviour, read `useUITheme()`; for theme-specific styling add rules under `.ui-depth …` / `.ui-pixel …`.
4. Respect motion: CSS animations are covered by the global reduced-motion rule; JS animations should check `useReducedMotion()`.
5. Add it to the showcase so the team can see it in all three themes, then `make release-ui` so other projects get it.

### Add a fourth theme

1. Add the id to `UITheme` in `core.tsx`.
2. Add a `.ui-<id>` token block (copy one of the existing ones) and any override rules.
3. Optionally branch `Hero`, `Background`, `Logo` in `Layout.tsx` for theme visuals.
4. Add the route in `main.tsx` and a tab in the showcase dock.

---

## 19. Gotchas

- **Nothing styled?** The component isn't inside a `.ui ui-<theme>` element, the class and `ThemeCtx` disagree, or (outside this repo) you forgot `import "@junction-kit/ui/styles.css"`.
- **`useToast` does nothing** — it's outside `ToastProvider`. Achievement toasts need `ToastProvider` above `GameLayer`.
- **Plain `<button>`s look like the old starter app** — the starter's `styles.css` styles bare buttons and inputs. Use `Button`, or give elements a kit class (`ui-chip`, `ui-icon-btn`, `ui-input`).
- **Search dropdown hidden behind the next card** — add `className="ui-raise"` to the card containing the `SearchBar`.
- **Card wobbles while typing** — in 3D, cards tilt by default; pass `tilt={false}` for cards with inputs, charts or graphs.
- **Floating label overlaps text** — you passed `placeholder` to `Field`/`TextArea`; remove it.
- **Chart colours jump when hiding a series** — you removed it from `series`; use the `hidden` prop instead.
- **In-page nav links change the page** — the app uses hash routing; scroll with `onClick` instead of `href="#id"`.
- **Every click adds coins in pixel mode** — that's `GameLayer`; mark elements with `data-coin` to opt out, or pass `enabled={false}`.
- **No animations on your machine** — the OS has Reduce Motion on; force them with `MotionCtx` (`true`).
- **Bundle-size warning on build** — harmless; it's mostly the starter's Recharts dependency used by the original panels.
