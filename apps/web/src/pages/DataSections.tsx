import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  Badge, BarChart, Button, Card, ChartCard, DonutChart, EntityGraph, GraphEdge, GraphEvent, GraphNode, Heatmap,
  Histogram, Icon, LineChart, ScatterChart, Section, Swatch, Tabs, Toggle, seriesColor, summarize, useReducedMotion, useToast,
} from "@junction-kit/ui";

/** Seeded PRNG so demo data is stable across reloads. */
function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const gauss = (r: () => number) => Math.sqrt(-2 * Math.log(r() || 1e-9)) * Math.cos(2 * Math.PI * r());

/* ---------------- entity graph ---------------- */

const GROUPS = ["People", "Services", "Data stores", "AI models"];
const BASE_NODES: GraphNode[] = [
  ["alice", "Alice", 0], ["bob", "Bob", 0], ["judges", "Judges", 0], ["mentors", "Mentors", 0],
  ["web", "Web app", 1], ["gw", "API gateway", 1], ["auth", "Auth", 1], ["chat", "Chat service", 1], ["search", "Search", 1], ["jobs", "Job queue", 1],
  ["pg", "Postgres", 2], ["vec", "Vector store", 2], ["cache", "Redis cache", 2], ["files", "File store", 2],
  ["claude", "Claude", 3], ["embed", "Embedder", 3], ["anom", "Anomaly model", 3],
].map(([id, label, group]) => {
  const r = rng(String(id).length * 97 + Number(group));
  return { id: String(id), label: String(label), group: Number(group), meta: { "calls / min": Math.round(40 + r() * 900), "p95 latency": `${Math.round(20 + r() * 380)} ms`, uptime: `${(99 + r()).toFixed(2)}%` } };
});
const BASE_EDGES: GraphEdge[] = [
  ["alice", "web"], ["bob", "web"], ["judges", "web"], ["mentors", "web"], ["mentors", "chat"],
  ["web", "gw", 2], ["web", "files"], ["gw", "auth"], ["gw", "chat", 2], ["gw", "search"], ["gw", "jobs"],
  ["auth", "pg"], ["chat", "claude", 2], ["chat", "vec"], ["chat", "cache"], ["search", "vec"], ["search", "embed"],
  ["search", "cache"], ["embed", "vec"], ["jobs", "anom"], ["jobs", "files"], ["anom", "pg"],
].map(([source, target, weight]) => ({ source: String(source), target: String(target), weight: Number(weight ?? 1) }));

export function GraphSection() {
  const toast = useToast();
  const reduced = useReducedMotion();
  const [nodes, setNodes] = useState(BASE_NODES);
  const [edges, setEdges] = useState(BASE_EDGES);
  const [events, setEvents] = useState<(GraphEvent & { at: string })[]>([]);
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [running, setRunning] = useState(!reduced);
  const counter = useRef(0);
  const label = (id: string) => nodes.find((n) => n.id === id)?.label ?? id;

  const fire = (src?: string) => {
    const pool = src ? edges.filter((e) => e.source === src || e.target === src) : edges;
    const e = pool[Math.floor(Math.random() * pool.length)];
    if (!e) return;
    const fwd = src ? e.source === src : Math.random() > 0.3;
    const id = ++counter.current;
    setEvents((p) => [{ id, source: fwd ? e.source : e.target, target: fwd ? e.target : e.source, at: new Date().toLocaleTimeString([], { hour12: false }) }, ...p].slice(0, 40));
  };

  const fireRef = useRef(fire);
  fireRef.current = fire;
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => fireRef.current(), 700);
    return () => clearInterval(t);
  }, [running]);

  const addUser = () => {
    const n = nodes.filter((x) => x.group === 0).length - 3;
    const node: GraphNode = { id: `guest${n}`, label: `Guest ${n}`, group: 0, meta: { "calls / min": 12, "p95 latency": "—", uptime: "new" } };
    setNodes((p) => [...p, node]);
    setEdges((p) => [...p, { source: node.id, target: "web", weight: 1 }]);
    toast({ title: `${node.label} joined`, desc: "New entity linked to Web app", tone: "success" });
  };
  const spike = () => { for (let i = 0; i < 14; i++) setTimeout(() => fire("gw"), i * 70); };
  const links = selected ? edges.filter((e) => e.source === selected.id || e.target === selected.id) : [];

  return (
    <Section id="graph" kicker="08 · Relationships" title="Entity interaction canvas"
      desc="Force-directed graph on canvas. Particles show steady traffic, bright pulses show live events. Hover to trace neighbours, click to inspect. In 3D the whole network orbits."
      code={`<EntityGraph nodes={nodes} edges={edges} groups={groups} events={events} onSelect={setNode} />`}>
      <div className="ui-stack">
        <Card tilt={false} style={{ padding: 10 }}>
          <EntityGraph nodes={nodes} edges={edges} groups={GROUPS} events={events} height={480}
            selected={selected?.id ?? null} onSelect={setSelected} />
        </Card>
        <div className="ui-grid is-2">
          <Card tilt={false}>
            {selected ? (
              <>
                <div className="ui-row" style={{ justifyContent: "space-between" }}>
                  <h3 style={{ margin: 0 }}>{selected.label}</h3>
                  <Badge tone="neutral"><Swatch color={seriesColor(selected.group)} shape={selected.group} />{GROUPS[selected.group]}</Badge>
                </div>
                <dl className="ui-kv">
                  <dt>connections</dt><dd>{links.length}</dd>
                  {Object.entries(selected.meta ?? {}).map(([k, v]) => <Fragment key={k}><dt>{k}</dt><dd>{v}</dd></Fragment>)}
                </dl>
                <div className="ui-row" style={{ marginTop: 14 }}>
                  <Button size="sm" variant="secondary" icon={<Icon.zap />} onClick={() => fire(selected.id)}>Send event</Button>
                  <Button size="sm" variant="ghost" onClick={() => setSelected(null)}>Clear</Button>
                </div>
              </>
            ) : (
              <>
                <h3 style={{ margin: "0 0 4px" }}>Inspect an entity</h3>
                <p>Click any node. Its details and connections show here.</p>
              </>
            )}
          </Card>
          <Card tilt={false}>
            <div className="ui-row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
              <div className="ui-label" style={{ margin: 0 }}>Live interactions</div>
              <Toggle label={running ? "Live" : "Paused"} checked={running} onChange={setRunning} />
            </div>
            <ul className="ui-log" aria-live="off">
              {events.slice(0, 6).map((e) => (
                <li key={e.id}><b>{label(e.source)}</b><Icon.arrow style={{ color: "var(--mut)", flex: "none" }} /><span>{label(e.target)}</span><time>{e.at}</time></li>
              ))}
              {!events.length && <li className="ui-muted">No events yet. Toggle Live or send one.</li>}
            </ul>
            <div className="ui-row" style={{ marginTop: 14 }}>
              <Button size="sm" icon={<Icon.plus />} onClick={addUser}>Add user</Button>
              <Button size="sm" variant="outline" icon={<Icon.zap />} onClick={spike}>Traffic spike</Button>
            </div>
          </Card>
        </div>
      </div>
    </Section>
  );
}

/* ---------------- analytics ---------------- */

const SERVICES = ["Web app", "API", "Chat"];
const day = (offset: number) => { const d = new Date(); d.setDate(d.getDate() - offset); return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }); };

function makeSeries(n: number, seed: number) {
  const r = rng(seed);
  return SERVICES.map((name, k) => {
    let v = [900, 600, 320][k];
    return { name, values: Array.from({ length: n }, (_, i) => Math.round((v = Math.max(80, v * (1 + gauss(r) * 0.06) + (i % 7 === 5 ? -60 : 15))))) };
  });
}

export function AnalyticsSection() {
  const reduced = useReducedMotion();
  const [range, setRange] = useState("30");
  const [live, setLive] = useState(!reduced);
  const [hidden, setHidden] = useState<string[]>([]);
  const n = Number(range);
  const [labels, setLabels] = useState(() => Array.from({ length: n }, (_, i) => day(n - 1 - i)));
  const [series, setSeries] = useState(() => makeSeries(n, n));

  useEffect(() => {
    setLabels(Array.from({ length: n }, (_, i) => day(n - 1 - i)));
    setSeries(makeSeries(n, n));
  }, [n]);

  useEffect(() => {
    if (!live) return;
    const r = rng(Date.now());
    const t = setInterval(() => {
      setLabels((l) => [...l.slice(1), new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })]);
      setSeries((ss) => ss.map((s) => {
        const last = s.values[s.values.length - 1];
        return { ...s, values: [...s.values.slice(1), Math.round(Math.max(80, last * (1 + gauss(r) * 0.08)))] };
      }));
    }, 1600);
    return () => clearInterval(t);
  }, [live]);

  const data = useMemo(() => {
    const r = rng(n * 7 + 3);
    const weeks = ["W1", "W2", "W3", "W4", "W5", "W6"];
    const latency = Array.from({ length: 700 }, () => Math.round(Math.exp(4.9 + gauss(r) * 0.42)));
    const scatter = ["Gateway", "Chat", "Search"].map((name, g) => ({
      name, points: Array.from({ length: 26 }, () => {
        const x = 2 + r() * 48;
        return { x: +x.toFixed(1), y: Math.max(8, Math.round(30 + x * (3 + g * 1.6) + gauss(r) * 28 + g * 25)) };
      }),
    }));
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const heat = days.map((_, d) => Array.from({ length: 24 }, (_, hr) =>
      Math.round(Math.max(0, (d < 5 ? 60 : 30) * Math.exp(-((hr - 14) ** 2) / 30) + (hr > 19 ? 25 : 0) + r() * 15))));
    return {
      weeks,
      bars: [
        { name: "Teams", values: weeks.map((_, i) => Math.round(20 + i * 9 + r() * 14)) },
        { name: "Solo", values: weeks.map((_, i) => Math.round(12 + i * 4 + r() * 10)) },
      ],
      latency, scatter, days, heat,
    };
  }, [n]);

  const [sources, setSources] = useState([
    { name: "Direct", value: 4200 }, { name: "Search", value: 3100 }, { name: "Social", value: 1900 },
    { name: "Referral", value: 1200 }, { name: "Email", value: 600 }, { name: "Ads", value: 380 },
  ]);
  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => setSources((s) => s.map((d) => ({ ...d, value: Math.max(100, Math.round(d.value * (1 + (Math.random() - 0.5) * 0.12))) }))), 2400);
    return () => clearInterval(t);
  }, [live]);

  const st = summarize(data.latency);
  const toggle = (name: string) => setHidden((h) => (h.includes(name) ? h.filter((x) => x !== name) : h.length < series.length - 1 ? [...h, name] : h));

  return (
    <Section id="charts" kicker="09 · Analytics" title="Dynamic charts for statistical data"
      desc="SVG charts with smooth transitions, hover tooltips, legends you can toggle, and a table view on every card. Colours are checked for colour-blind safety in both themes."
      code={`<LineChart labels={days} series={[{ name: "API", values }]} />  <Histogram values={latencies} unit="ms" />`}>
      <div className="ui-filters">
        <Tabs value={range} onChange={setRange} tabs={[{ id: "7", label: "7 days" }, { id: "30", label: "30 days" }, { id: "90", label: "90 days" }]} />
        <Toggle label="Live data" checked={live} onChange={setLive} />
        {live && <Badge tone="ok" dot>Streaming</Badge>}
      </div>
      <div className="ui-stack">
        <ChartCard title="Requests per day" subtitle="By service · click legend to hide a series"
          legend={series.map((s, i) => ({ name: s.name, color: seriesColor(i), active: !hidden.includes(s.name), onToggle: () => toggle(s.name) }))}
          table={{ columns: ["Day", ...series.map((s) => s.name)], rows: labels.map((l, i) => [l, ...series.map((s) => s.values[i])]) }}>
          <LineChart labels={labels} series={series} hidden={hidden} height={280} />
        </ChartCard>
        <div className="ui-grid is-2">
          <ChartCard title="Sign-ups per week" subtitle="Teams vs solo hackers"
            legend={data.bars.map((s, i) => ({ name: s.name, color: seriesColor(i) }))}
            table={{ columns: ["Week", ...data.bars.map((s) => s.name)], rows: data.weeks.map((w, i) => [w, ...data.bars.map((s) => s.values[i])]) }}>
            <BarChart labels={data.weeks} series={data.bars} />
          </ChartCard>
          <ChartCard title="Traffic sources" subtitle="Share of sessions · smaller sources fold into Other"
            table={{ columns: ["Source", "Sessions"], rows: sources.map((s) => [s.name, s.value]) }}>
            <DonutChart slices={sources} label="Sessions" />
          </ChartCard>
          <ChartCard title="Latency vs payload" subtitle="Each point is a request · dashed line is the least-squares fit"
            legend={data.scatter.map((g, i) => ({ name: g.name, color: seriesColor(i), shape: i }))}
            table={{ columns: ["Service", "Payload (KB)", "Latency (ms)"], rows: data.scatter.flatMap((g) => g.points.map((p) => [g.name, p.x, p.y])) }}>
            <ScatterChart groups={data.scatter} xLabel="Payload (KB)" yLabel="Latency (ms)" formatX={(v) => `${v}`} formatY={(v) => `${v}`} />
          </ChartCard>
          <ChartCard title="Response-time distribution" subtitle={`Shaded band is mean ± 1σ · dashed line is the median (${st.median} ms)`}
            table={{ columns: ["Statistic", "Value"], rows: [["n", st.n], ["mean (ms)", Math.round(st.mean)], ["median (ms)", st.median], ["σ (ms)", Math.round(st.sd)], ["p95 (ms)", st.p95]] }}>
            <Histogram values={data.latency} unit="ms" />
          </ChartCard>
        </div>
        <ChartCard title="Activity by hour" subtitle="Events per weekday and hour (UTC)"
          table={{ columns: ["Day", ...Array.from({ length: 24 }, (_, h) => `${h}h`)], rows: data.days.map((d, i) => [d, ...data.heat[i]]) }}>
          <Heatmap rows={data.days} cols={Array.from({ length: 24 }, (_, h) => `${h}`)} values={data.heat} colEvery={3} />
        </ChartCard>
      </div>
    </Section>
  );
}
