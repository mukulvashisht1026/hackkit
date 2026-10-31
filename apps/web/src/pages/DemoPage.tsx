import { useEffect, useState } from "react";
import { api } from "../api";
import { AnalyticsSection, GraphSection } from "./DataSections";
import {
  Accordion, AvatarGroup, Avatar, Background, Badge, Button, ButtonVariant, Card, Chat, Checkbox, CommandPalette, Dots,
  Field, FileDrop, Footer, Hero, Icon, Logo, Marquee, Modal, Navbar, Progress, ProgressRing, SearchBar, SearchItem,
  MotionCtx, Section, Select, Skeleton, Slider, Spinner, StatCard, Stepper, Tabs, TextArea, ThemeCtx, Toggle, ToastProvider,
  GameLayer, PixelHUD, Tooltip, UITheme, cx, motionClass, prefersReducedMotion, useToast,
} from "@hackkit/ui";

const SECTIONS: [string, string][] = [
  ["buttons", "Buttons"], ["chat", "Chat"], ["forms", "Forms"], ["cards", "Cards"], ["graph", "Graph"], ["charts", "Charts"],
];
const VARIANTS: ButtonVariant[] = ["primary", "secondary", "ghost", "outline", "glow", "gradient", "danger", "success"];
const SEARCH_ITEMS: SearchItem[] = [
  { label: "Upload a dataset", hint: "Ingest", icon: <Icon.upload /> },
  { label: "Ask your documents", hint: "RAG", icon: <Icon.bot /> },
  { label: "Run SQL on tables", hint: "DuckDB", icon: <Icon.layers /> },
  { label: "Detect anomalies", hint: "EWMA", icon: <Icon.chart /> },
  { label: "Open the chat assistant", hint: "LLM", icon: <Icon.sparkle /> },
  { label: "Invite teammates", hint: "Team", icon: <Icon.user /> },
  { label: "Switch theme", hint: "UI", icon: <Icon.cube /> },
  { label: "Read partner playbooks", hint: "Docs", icon: <Icon.info /> },
];
const STACK = ["FastAPI", "React", "Vite", "DuckDB", "Recharts", "TF-IDF RAG", "EWMA drift", "MQTT", "Serial I/O", "Pydantic"];

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
const ROUTES: Record<string, string> = { dreamy: "/demo", depth: "/demo/3d", pixel: "/demo/pixel" };
const NEXT: Record<UITheme, [UITheme, string]> = { dreamy: ["depth", "Try 3D mode"], depth: ["pixel", "Try pixel mode"], pixel: ["dreamy", "Dreamy mode"] };
const PAGE_BG: Record<UITheme, string> = { dreamy: "#f6f2ff", depth: "#060814", pixel: "#1a1c2c" };
const setTheme = (t: string) => { window.location.hash = ROUTES[t] ?? "/demo"; };
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

// Remembered per browser; first visit follows the OS reduce-motion setting.
const readMotion = () => { try { const v = localStorage.getItem("ui-motion"); return v === null ? !prefersReducedMotion() : v === "on"; } catch { return !prefersReducedMotion(); } };
const saveMotion = (on: boolean) => { try { localStorage.setItem("ui-motion", on ? "on" : "off"); } catch { /* storage blocked */ } };

async function chatSend(text: string) {
  try {
    const r = await api<{ text: string }>("/llm", { prompt: text, system: "You are a cheerful hackathon copilot. Answer in under 80 words." });
    return r.text;
  } catch {
    await new Promise((r) => setTimeout(r, 900));
    return `✨ Demo mode (backend LLM not reachable). You said: “${text}”.\n\nPass any async function to <Chat onSend>. This page calls /api/llm and falls back to this reply.`;
  }
}

export default function DemoPage({ theme }: { theme: UITheme }) {
  const [motion, setMotion] = useState(readMotion);
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = PAGE_BG[theme];
    return () => { document.body.style.background = prev; };
  }, [theme]);
  return (
    <ThemeCtx.Provider value={theme}>
      <MotionCtx.Provider value={motion}>
        <ToastProvider>
          <Showcase theme={theme} motion={motion} setMotion={(on) => { setMotion(on); saveMotion(on); }} />
        </ToastProvider>
      </MotionCtx.Provider>
    </ThemeCtx.Provider>
  );
}

function Showcase({ theme, motion, setMotion }: { theme: UITheme; motion: boolean; setMotion: (on: boolean) => void }) {
  const toast = useToast();
  const [palette, setPalette] = useState(false);
  const depth = theme === "depth", pixel = theme === "pixel";
  const [next, nextLabel] = NEXT[theme];

  const onCommand = (i: SearchItem) => {
    if (i.label === "Switch theme") return setTheme(next);
    if (i.label.includes("chat")) return scrollTo("chat");
    toast({ title: i.label, desc: `Command “${i.hint}” selected`, tone: "success" });
  };

  return (
    <div className={cx("ui", `ui-${theme}`, motionClass(motion))}>
     <GameLayer enabled={pixel}>
      <Background key={`bg-${theme}`} />
      {pixel && <PixelHUD />}
      <Navbar
        brand={<><Logo /> Lumen <span className="ui-brand-tag">UI</span></>}
        items={SECTIONS.map(([id, label]) => ({ label, onClick: () => scrollTo(id) }))}
        actions={<>
          <Tooltip tip="Search  ⌘K"><Button variant="ghost" square aria-label="Search" icon={<Icon.search />} onClick={() => setPalette(true)} /></Tooltip>
          <Tooltip tip="Notifications">
            <Button variant="ghost" square aria-label="Notifications" icon={<Icon.bell />}
              onClick={() => toast({ title: "3 new notifications", desc: "Mentors replied to your team", tone: "info" })}>
              <span className="ui-btn-dot" />
            </Button>
          </Tooltip>
          <Button size="sm" pill magnetic onClick={() => scrollTo("forms")}>Get started</Button>
        </>}
      />

      <main className="ui-main" key={theme}>
        <Hero
          eyebrow={<Badge dot>Hackathon UI kit · {depth ? "3D" : pixel ? "Pixel" : "Dreamy"} edition</Badge>}
          title={depth
            ? <>Demos with real <span className="ui-grad-text">depth</span></>
            : pixel ? <>Insert coin. <span className="ui-grad-text">Ship a demo.</span></>
            : <>Build something <span className="ui-grad-text">dreamy</span> by Sunday</>}
          subtitle={pixel
            ? "Every component, rebuilt as an 8-bit game. Each click earns coins, levels unlock achievements, and the robot jumps if you poke it."
            : "Buttons, navbar, search, chat, forms, cards and feedback. Animated, responsive and themeable, ready to drop into a 48-hour build."}
          actions={<>
            <Button size="lg" pill magnetic variant="glow" iconRight={<Icon.arrow />} onClick={() => scrollTo("buttons")}>Explore components</Button>
            <Button size="lg" pill variant="secondary" icon={next === "depth" ? <Icon.cube /> : next === "pixel" ? <Icon.gamepad /> : <Icon.sparkle />}
              onClick={() => setTheme(next)}>
              {nextLabel}
            </Button>
          </>}
        />
        <Marquee items={STACK.map((s) => <><Icon.sparkle /> {s}</>)} />

        <ButtonsSection />
        <SearchSection openPalette={() => setPalette(true)} onCommand={onCommand} />
        <ChatSection />
        <NavSection />
        <FormsSection />
        <CardsSection />
        <FeedbackSection />
        <GraphSection />
        <AnalyticsSection />

        <Footer>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}><Logo /> Lumen UI · built for hackathons</span>
          <span className="ui-row">
            <a className="ui-dock-link" href="#/">Starter app</a>
            <button type="button" className="ui-dock-link" style={{ border: 0, background: "none", cursor: "pointer", font: "inherit" }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Back to top ↑</button>
          </span>
        </Footer>
      </main>

      <div className="ui-dock">
        <a className="ui-dock-link" href="#/" aria-label="Back to starter app"><Icon.back /></a>
        <Tabs value={theme} onChange={setTheme} tabs={[
          { id: "dreamy", label: <><Icon.sparkle /> Dreamy</> },
          { id: "depth", label: <><Icon.cube /> 3D</> },
          { id: "pixel", label: <><Icon.gamepad /> Pixel</> },
        ]} />
        <Tooltip tip={motion ? "Animations on" : "Animations off"}>
          <Button size="sm" pill square ripple={false} variant={motion ? "secondary" : "ghost"} aria-label="Toggle animations"
            aria-pressed={motion} icon={<Icon.zap />} onClick={() => setMotion(!motion)} />
        </Tooltip>
      </div>

      <CommandPalette items={SEARCH_ITEMS} open={palette} onOpenChange={setPalette} onSelect={onCommand} />
     </GameLayer>
    </div>
  );
}

function ButtonsSection() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const save = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); toast({ title: "Saved!", desc: "Loading state finished", tone: "success" }); }, 1600);
  };
  return (
    <Section id="buttons" kicker="01 · Actions" title="Buttons that feel alive"
      desc="Click ripple, magnetic hover, shimmer sweep, glow pulse and loading state. In 3D they become pressable keycaps."
      code={`<Button variant="glow" magnetic loading={busy} iconRight={<Icon.arrow/>}>Ship it</Button>`}>
      <div className="ui-grid is-2">
        <Card>
          <div className="ui-label">Variants</div>
          <div className="ui-row">{VARIANTS.map((v) => <Button key={v} variant={v}>{cap(v)}</Button>)}</div>
        </Card>
        <Card>
          <div className="ui-label">Sizes & shapes</div>
          <div className="ui-row">
            <Button size="sm">Small</Button>
            <Button>Medium</Button>
            <Button size="lg">Large</Button>
            <Button pill variant="gradient">Pill</Button>
            <Tooltip tip="Add"><Button square variant="secondary" aria-label="Add" icon={<Icon.plus />} /></Tooltip>
            <Tooltip tip={liked ? "Unlike" : "Like"}>
              <Button square pill variant={liked ? "danger" : "secondary"} aria-label="Like" icon={<Icon.heart />} onClick={() => setLiked(!liked)} />
            </Tooltip>
          </div>
        </Card>
        <Card>
          <div className="ui-label">States</div>
          <div className="ui-row">
            <Button loading={loading} onClick={save}>Save changes</Button>
            <Button disabled>Disabled</Button>
            <Button variant="success" icon={<Icon.check />}>Done</Button>
            <Button variant="outline" iconRight={<Icon.arrow />}>Continue</Button>
          </div>
        </Card>
        <Card>
          <div className="ui-label">Magnetic + ripple</div>
          <div className="ui-row is-center" style={{ minHeight: 64 }}>
            <Button size="lg" pill magnetic variant="glow" icon={<Icon.zap />}>Hover me</Button>
            <Button size="lg" pill magnetic variant="secondary">Me too</Button>
          </div>
        </Card>
      </div>
    </Section>
  );
}

function SearchSection({ openPalette, onCommand }: { openPalette: () => void; onCommand: (i: SearchItem) => void }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const search = (q: string) => {
    if (!q.trim()) return;
    setBusy(true);
    setTimeout(() => { setBusy(false); toast({ title: `Searched “${q}”`, tone: "info" }); }, 900);
  };
  return (
    <Section id="search" kicker="02 · Find" title="Search & command palette"
      desc="Live filtering with match highlights, keyboard navigation, loading state and a ⌘K palette."
      code={`<SearchBar items={items} shortcut="/" onSelect={go} onSearch={query} />`}>
      <div className="ui-grid is-2">
        <Card tilt={false} className="ui-raise">
          <div className="ui-label">Search bar · press /</div>
          <SearchBar items={SEARCH_ITEMS} shortcut="/" loading={busy} placeholder="Search actions, data, docs…" onSelect={onCommand} onSearch={search} />
          <p style={{ marginTop: 14 }}>Try “data”, arrow keys, Enter.</p>
        </Card>
        <Card tilt={false}>
          <div className="ui-label">Command palette</div>
          <p style={{ marginBottom: 16 }}>Opens from anywhere on the page.</p>
          <div className="ui-row">
            <Button variant="secondary" icon={<Icon.search />} onClick={openPalette}>Open palette</Button>
            <span className="ui-muted"><kbd className="ui-kbd">⌘</kbd> <kbd className="ui-kbd">K</kbd></span>
          </div>
        </Card>
      </div>
    </Section>
  );
}

function ChatSection() {
  return (
    <Section id="chat" kicker="03 · Converse" title="Chat template"
      desc="Typing indicator, typewriter replies, auto-growing input, suggestion chips. Wire onSend to any backend."
      code={`<Chat title="Copilot" onSend={(text, history) => api("/llm", { prompt: text }).then(r => r.text)} />`}>
      <div className="ui-grid is-2">
        <Chat title="Lumen Copilot" subtitle="Online · replies instantly" placeholder="Ask the copilot…"
          suggestions={["Pitch our idea in 1 line", "What should we demo first?", "Name our team"]} onSend={chatSend} />
        <div className="ui-stack">
          <Card tilt={false}>
            <div className="ui-icon-tile"><Icon.bot /></div>
            <h3>Plug in any model</h3>
            <p>This demo calls <code>/api/llm</code>. Set <code>ANTHROPIC_API_KEY</code> in <code>.env</code> to get real replies. Without it you get a mock reply.</p>
          </Card>
          <Card tilt={false}>
            <div className="ui-label">Included</div>
            <div className="ui-row">
              <Badge>Typewriter</Badge><Badge>Typing dots</Badge><Badge>Auto-scroll</Badge>
              <Badge>Enter to send</Badge><Badge>Shift+Enter newline</Badge><Badge tone="ok" dot>Live status</Badge>
            </div>
          </Card>
        </div>
      </div>
    </Section>
  );
}

function NavSection() {
  const [tab, setTab] = useState("overview");
  const [line, setLine] = useState("week");
  const [step, setStep] = useState(1);
  const steps = ["Idea", "Prototype", "Polish", "Pitch"];
  const panels: Record<string, string> = {
    overview: "One sentence: who suffers today, and what your product changes for them.",
    data: "Upload a CSV and query it with SQL, or index PDFs for cited answers.",
    demo: "Show one real input → insight → recommended action. Keep a seeded fallback.",
  };
  return (
    <Section kicker="04 · Navigate" title="Navbar, tabs, stepper, accordion"
      desc="The sticky navbar on top shrinks on scroll and turns into a drawer on mobile. Tabs use a springy sliding indicator.">
      <div className="ui-stack">
        <div className="ui-frame">
          <Navbar sticky={false} brand={<><Logo /> Acme</>}
            items={[{ label: "Product", active: true }, { label: "Pricing" }, { label: "Docs" }, { label: "Blog" }]}
            actions={<><Button size="sm" variant="ghost">Log in</Button><Button size="sm" pill>Sign up</Button></>} />
        </div>
        <div className="ui-grid is-2">
          <Card tilt={false}>
            <Tabs value={tab} onChange={setTab} tabs={[{ id: "overview", label: "Overview" }, { id: "data", label: "Data" }, { id: "demo", label: "Demo" }]} />
            <div className="ui-tabpanel" key={tab}><p>{panels[tab]}</p></div>
            <div style={{ marginTop: 18 }}>
              <Tabs variant="line" value={line} onChange={setLine} tabs={[{ id: "day", label: "Day" }, { id: "week", label: "Week" }, { id: "month", label: "Month" }, { id: "year", label: "Year" }]} />
            </div>
          </Card>
          <Card tilt={false}>
            <div className="ui-label">Stepper</div>
            <Stepper steps={steps} current={step} />
            <div className="ui-row" style={{ marginTop: 22, justifyContent: "space-between" }}>
              <Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)} icon={<Icon.back />}>Back</Button>
              <Button disabled={step === steps.length} onClick={() => setStep(step + 1)} iconRight={<Icon.arrow />}>
                {step >= steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </Card>
        </div>
        <Accordion items={[
          { title: "Can I use this outside the demo page?", content: "Yes. Import from src/ui, wrap your page in ThemeCtx.Provider plus a div with class “ui ui-dreamy” or “ui ui-depth”." },
          { title: "Does it need extra dependencies?", content: "No. Just React and CSS. 3D is pure CSS transforms; animations respect prefers-reduced-motion." },
          { title: "How do I change colors?", content: "Edit the tokens at the top of ui.css (--a1 … --a4, --grad, --surface). Both themes read the same variables." },
        ]} />
      </div>
    </Section>
  );
}

function FormsSection() {
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [track, setTrack] = useState("ai");
  const [notify, setNotify] = useState(true);
  const [dark, setDark] = useState(false);
  const [terms, setTerms] = useState(false);
  const [mentor, setMentor] = useState(true);
  const [size, setSize] = useState(4);
  const emailErr = email && !/^\S+@\S+\.\S+$/.test(email) ? "That doesn’t look like an email" : undefined;

  const upload = async (files: File[]) => {
    const fd = new FormData();
    fd.append("file", files[0]);
    try {
      const r = await api<any>("/ingest/file", undefined, fd);
      toast({ title: "Uploaded to backend", desc: r.kind === "table" ? `${r.rows} rows → table “${r.name}”` : `${r.chunks} text chunks indexed`, tone: "success" });
    } catch (e: any) {
      toast({ title: `${files.length} file(s) selected`, desc: `Backend upload failed: ${e.message}`, tone: "warn" });
    }
  };

  return (
    <Section id="forms" kicker="05 · Input" title="Forms & controls"
      desc="Floating labels, inline validation with a shake, springy toggles, drawn checkmarks, gradient slider and drag-and-drop upload.">
      <div className="ui-grid is-2">
        <Card tilt={false}>
          <form className="ui-stack" onSubmit={(e) => {
            e.preventDefault();
            if (!terms) return toast({ title: "Accept the rules first", tone: "error" });
            toast({ title: `Welcome, ${name || "hacker"}!`, desc: `Registered for the ${track.toUpperCase()} track · team of ${size}`, tone: "success" });
          }}>
            <Field label="Full name" icon={<Icon.user />} value={name} onChange={(e) => setName(e.target.value)} />
            <Field label="Email" type="email" icon={<Icon.mail />} value={email} onChange={(e) => setEmail(e.target.value)} error={emailErr} hint="We only send event updates" />
            <Select value={track} onChange={(e) => setTrack(e.target.value)} aria-label="Track">
              <option value="ai">AI & data track</option>
              <option value="hw">Hardware track</option>
              <option value="fin">Fintech track</option>
              <option value="health">Health track</option>
            </Select>
            <TextArea label="What will you build?" rows={3} />
            <Checkbox label="I accept the hackathon rules" checked={terms} onChange={setTerms} />
            <Button type="submit" block size="lg" variant="glow" iconRight={<Icon.arrow />}>Register team</Button>
          </form>
        </Card>
        <div className="ui-stack">
          <Card tilt={false}>
            <div className="ui-label">Controls</div>
            <div className="ui-stack">
              <Toggle label="Email notifications" checked={notify} onChange={setNotify} />
              <Toggle label="Night owl mode" checked={dark} onChange={setDark} />
              <Checkbox label="Looking for a mentor" checked={mentor} onChange={setMentor} />
              <Slider label="Team size" min={1} max={6} value={size} onChange={setSize} />
            </div>
          </Card>
          <FileDrop hint="CSV / XLSX become SQL tables · PDF / PPTX / TXT become searchable text" onFiles={upload} />
        </div>
      </div>
    </Section>
  );
}

function CardsSection() {
  const features = [
    { icon: <Icon.zap />, title: "Ship fast", text: "Every component is one import. No config, no extra dependencies." },
    { icon: <Icon.layers />, title: "Two skins", text: "Dreamy glass or sleek 3D, same markup. Swap with one class." },
    { icon: <Icon.heart />, title: "Judges love it", text: "Motion that feels intentional, and still respects reduced motion." },
  ];
  return (
    <Section id="cards" kicker="06 · Display" title="Cards, stats & people"
      desc="Cursor-following glow, 3D tilt with layered depth, count-up numbers and drawn sparklines.">
      <div className="ui-stack">
        <div className="ui-grid">
          {features.map((f) => (
            <Card key={f.title} tilt>
              <div className="ui-icon-tile">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
              <span className="ui-card-link">Learn more <Icon.arrow /></span>
            </Card>
          ))}
        </div>
        <div className="ui-grid">
          <StatCard label="Active users" value={12480} delta={12.4} icon={<Icon.user />} spark={[4, 6, 5, 8, 7, 10, 9, 13, 12, 15]} />
          <StatCard label="Answer accuracy" value={94.2} decimals={1} suffix="%" delta={3.1} icon={<Icon.check />} spark={[80, 82, 85, 84, 88, 90, 89, 92, 93, 94]} />
          <StatCard label="Anomalies caught" value={37} delta={-8} icon={<Icon.chart />} spark={[12, 9, 14, 8, 10, 6, 7, 5, 6, 4]} />
        </div>
        <Card>
          <div className="ui-row" style={{ justifyContent: "space-between" }}>
            <div className="ui-row">
              <AvatarGroup names={["Aino Virtanen", "Mika Lahti", "Sara Koski", "Leo Niemi", "Ida Heikkinen", "Otto Mäkelä"]} />
              <div>
                <strong>Team Aurora</strong>
                <div className="ui-muted" style={{ fontSize: 13 }}>6 members · AI & data track</div>
              </div>
            </div>
            <div className="ui-row">
              <Badge tone="ok" dot>Submitted</Badge><Badge tone="warn">Demo at 14:00</Badge><Badge tone="neutral">Table 42</Badge>
              <Avatar name="You" status="online" />
            </div>
          </div>
        </Card>
      </div>
    </Section>
  );
}

function FeedbackSection() {
  const toast = useToast();
  const [modal, setModal] = useState(false);
  const [pct, setPct] = useState(12);
  useEffect(() => {
    const t = setInterval(() => setPct((p) => (p >= 100 ? 8 : Math.min(100, p + 7 + Math.random() * 12))), 900);
    return () => clearInterval(t);
  }, []);
  return (
    <Section id="feedback" kicker="07 · Feedback" title="Toasts, modals & loaders"
      desc="Spring-in toasts with a countdown bar, a modal that pops (or swings in, in 3D), progress, spinners and skeletons."
      code={`const toast = useToast(); toast({ title: "Saved", tone: "success" })`}>
      <div className="ui-grid">
        <Card tilt={false}>
          <div className="ui-label">Toasts</div>
          <div className="ui-row">
            <Button size="sm" variant="success" onClick={() => toast({ title: "Deployed!", desc: "Your demo is live", tone: "success" })}>Success</Button>
            <Button size="sm" variant="secondary" onClick={() => toast({ title: "Heads up", desc: "Judging starts in 30 min", tone: "info" })}>Info</Button>
            <Button size="sm" variant="outline" onClick={() => toast({ title: "Rate limited", desc: "Retrying in 3s", tone: "warn" })}>Warning</Button>
            <Button size="sm" variant="danger" onClick={() => toast({ title: "Build failed", desc: "Check the console", tone: "error" })}>Error</Button>
          </div>
        </Card>
        <Card tilt={false}>
          <div className="ui-label">Modal</div>
          <p style={{ marginBottom: 16 }}>Esc or a backdrop click closes it.</p>
          <Button variant="gradient" pill onClick={() => setModal(true)}>Open modal</Button>
        </Card>
        <Card tilt={false}>
          <div className="ui-label">Progress</div>
          <div className="ui-row" style={{ flexWrap: "nowrap" }}>
            <ProgressRing value={pct} />
            <div className="ui-stack" style={{ flex: 1, gap: 12 }}>
              <Progress value={pct} />
              <Progress indeterminate />
            </div>
          </div>
        </Card>
        <Card tilt={false}>
          <div className="ui-label">Loaders</div>
          <div className="ui-row" style={{ gap: 22, marginBottom: 18 }}>
            <Spinner /><span className="ui-orbit-loader" /><span style={{ color: "var(--acc-ink)" }}><Dots /></span>
          </div>
          <div className="ui-row" style={{ flexWrap: "nowrap" }}>
            <Skeleton circle h={42} />
            <div className="ui-stack" style={{ flex: 1, gap: 8 }}><Skeleton w="70%" h={12} /><Skeleton w="45%" h={10} /></div>
          </div>
        </Card>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title="Ready to pitch? 🎤"
        footer={<><Button variant="ghost" onClick={() => setModal(false)}>Not yet</Button>
          <Button onClick={() => { setModal(false); toast({ title: "Good luck!", tone: "success" }); }}>Let’s go</Button></>}>
        <p className="ui-muted" style={{ margin: 0 }}>Two minutes: hook, problem, live demo, why it works, next steps. Have an offline fallback ready.</p>
      </Modal>
    </Section>
  );
}
