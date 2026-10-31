/**
 * Dependency-free SVG charts that share the kit's themes.
 * Series colors come from --s1..--s4 (validated categorical order, see ui.css); assign by the
 * series' position in the full list so hiding one never repaints the rest. Max 4 series per chart.
 */
import { CSSProperties, ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { cx, useInView, useReducedMotion, useUITheme } from "./core";
import { Card } from "./Display";

export const seriesColor = (i: number) => `var(--s${(i % 4) + 1})`;
export const fmtCompact = (v: number) => new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(v);

export interface Series { name: string; values: number[] }

/* ---------- shared helpers ---------- */

function useChartBox() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setW(el.clientWidth);
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return { ref, inView, w };
}

/** Eases an array of numbers toward `target` whenever it changes (grow-in + live updates). */
function useTween(target: number[], ms = 700) {
  const reduced = useReducedMotion();
  const [v, setV] = useState(target);
  const cur = useRef(target);
  const key = target.join(",");
  useEffect(() => {
    if (reduced) { cur.current = target; setV(target); return; }
    const start = cur.current, t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - p, 3);
      const nv = target.map((x, i) => (start[i] ?? 0) + (x - (start[i] ?? 0)) * e);
      cur.current = nv;
      setV(nv);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, reduced, ms]);
  return v;
}

function niceTicks(min: number, max: number, count = 4) {
  if (max === min) max = min + 1;
  const raw = (max - min) / count, mag = 10 ** Math.floor(Math.log10(raw)), norm = raw / mag;
  const step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * mag;
  const lo = Math.floor(min / step) * step, hi = Math.ceil(max / step) * step;
  const out: number[] = [];
  for (let t = lo; t <= hi + step / 2; t += step) out.push(+t.toFixed(10));
  return out;
}

/** Path whose top corners are rounded and whose base sits flat on the baseline. */
function barPath(x: number, y: number, w: number, h: number, r = 4) {
  if (h <= 0 || w <= 0) return "";
  r = Math.min(r, w / 2, h);
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}

/** Staircase path (pixel theme). */
function stepped(pts: [number, number][]) {
  return pts.map(([x, y], i) => (i ? `H${(pts[i - 1][0] + x) / 2}V${y}H${x}` : `M${x},${y}`)).join("");
}

/** Smooth path without overshoot (control points share y with their endpoints). */
function smooth(pts: [number, number][]) {
  return pts.map(([x, y], i) => {
    if (!i) return `M${x},${y}`;
    const [px, py] = pts[i - 1], dx = (x - px) / 2;
    return `C${px + dx},${py} ${x - dx},${y} ${x},${y}`;
  }).join("");
}

/** Keep direct labels at least `gap` px apart without leaving the plot. */
function spread(ys: number[], gap: number, lo: number, hi: number) {
  const idx = ys.map((y, i) => ({ y, i })).sort((a, b) => a.y - b.y);
  for (let k = 1; k < idx.length; k++) idx[k].y = Math.max(idx[k].y, idx[k - 1].y + gap);
  const over = idx.length ? idx[idx.length - 1].y - hi : 0;
  if (over > 0) idx.forEach((d) => (d.y = Math.max(lo, d.y - over)));
  const out = [...ys];
  idx.forEach((d) => (out[d.i] = d.y));
  return out;
}

interface Tip { x: number; y: number; title: ReactNode; rows: { color?: string; label: ReactNode; value: ReactNode }[] }

function Tooltip({ tip, width }: { tip: Tip | null; width: number }) {
  if (!tip) return null;
  const left = Math.max(80, Math.min(width - 80, tip.x));
  return (
    <div className="ui-ctip" style={{ left, top: tip.y }} role="status">
      <div className="ui-ctip-title">{tip.title}</div>
      {tip.rows.map((r, i) => (
        <div key={i} className="ui-ctip-row">
          {r.color && <i style={{ background: r.color }} />}<span>{r.label}</span><b>{r.value}</b>
        </div>
      ))}
    </div>
  );
}

function YAxis({ ticks, y, x0, x1, format }: { ticks: number[]; y: (v: number) => number; x0: number; x1: number; format: (v: number) => string }) {
  return (
    <g className="ui-axis">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={x0} x2={x1} y1={y(t)} y2={y(t)} className={t === 0 ? "is-base" : undefined} />
          <text x={x0 - 8} y={y(t)} dy="0.32em" textAnchor="end">{format(t)}</text>
        </g>
      ))}
    </g>
  );
}

function XLabels({ labels, x, y, width }: { labels: string[]; x: (i: number) => number; y: number; width: number }) {
  const every = Math.max(1, Math.ceil(labels.length / Math.max(1, width / 64)));
  return (
    <g className="ui-axis">
      {labels.map((l, i) => (i % every === 0 || i === labels.length - 1) && (
        <text key={i} x={x(i)} y={y} textAnchor="middle">{l}</text>
      ))}
    </g>
  );
}

/* ---------- card, legend, table ---------- */

export interface LegendItem { name: string; color: string; active?: boolean; onToggle?: () => void; shape?: number }

export function Legend({ items }: { items: LegendItem[] }) {
  return (
    <div className="ui-legend">
      {items.map((it) => {
        const body = <><Swatch color={it.color} shape={it.shape} />{it.name}</>;
        return it.onToggle
          ? <button key={it.name} type="button" className={cx("ui-legend-item", it.active === false && "is-off")} aria-pressed={it.active !== false} onClick={it.onToggle}>{body}</button>
          : <span key={it.name} className="ui-legend-item">{body}</span>;
      })}
    </div>
  );
}

/** Shapes double-encode group identity so color is never the only cue. */
export function Swatch({ color, shape = 0, size = 10 }: { color: string; shape?: number; size?: number }) {
  const h = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" className="ui-swatch">
      {shape === 1 ? <rect x={0.5} y={0.5} width={size - 1} height={size - 1} rx={2} fill={color} />
        : shape === 2 ? <path d={`M${h},0L${size},${h}L${h},${size}L0,${h}Z`} fill={color} />
        : shape === 3 ? <path d={`M${h},0.5L${size - 0.5},${size - 0.5}H0.5Z`} fill={color} />
        : <circle cx={h} cy={h} r={h} fill={color} />}
    </svg>
  );
}

export interface TableData { columns: string[]; rows: (string | number)[][] }

export function ChartCard({ title, subtitle, legend, table, actions, children }: {
  title: ReactNode; subtitle?: ReactNode; legend?: LegendItem[]; table?: TableData; actions?: ReactNode; children: ReactNode;
}) {
  const [showTable, setShowTable] = useState(false);
  return (
    <Card tilt={false} className="ui-chart-card">
      <div className="ui-chart-head">
        <div>
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <div className="ui-row">
          {actions}
          {table && (
            <button type="button" className="ui-chip" aria-pressed={showTable} onClick={() => setShowTable(!showTable)}>
              {showTable ? "Chart" : "Table"}
            </button>
          )}
        </div>
      </div>
      {legend && legend.length > 1 && <Legend items={legend} />}
      {showTable && table ? (
        <div className="ui-table-wrap">
          <table className="ui-table">
            <thead><tr>{table.columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
            <tbody>{table.rows.map((r, i) => <tr key={i}>{r.map((v, j) => <td key={j}>{typeof v === "number" ? v.toLocaleString() : v}</td>)}</tr>)}</tbody>
          </table>
        </div>
      ) : children}
    </Card>
  );
}

/* ---------- line / area ---------- */

export function LineChart({ labels, series, height = 260, area = true, hidden = [], format = fmtCompact }: {
  labels: string[]; series: Series[]; height?: number; area?: boolean; hidden?: string[]; format?: (v: number) => string;
}) {
  const { ref, inView, w } = useChartBox();
  const pixel = useUITheme() === "pixel";
  const [hover, setHover] = useState<number | null>(null);
  const n = labels.length;
  const flat = series.flatMap((s) => s.values);
  const anim = useTween(inView ? flat : flat.map(() => 0));
  const vis = series.map((s, i) => ({ ...s, i, v: anim.slice(i * n, (i + 1) * n) })).filter((s) => !hidden.includes(s.name));
  const ticks = niceTicks(0, Math.max(1, ...vis.flatMap((s) => s.values)));
  const yMax = ticks[ticks.length - 1];
  const m = { l: 44, r: vis.length > 1 ? 92 : 18, t: 14, b: 28 };
  const iw = Math.max(10, w - m.l - m.r), ih = height - m.t - m.b;
  const x = (i: number) => m.l + (n <= 1 ? iw / 2 : (i * iw) / (n - 1));
  const y = (v: number) => m.t + ih - (v / yMax) * ih;
  const endY = spread(vis.map((s) => y(s.v[n - 1] ?? 0)), 16, m.t, m.t + ih);

  const move = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - r.left - m.l) / iw) * (n - 1));
    setHover(i >= 0 && i < n ? i : null);
  };
  const tip: Tip | null = hover === null || !vis.length ? null : {
    x: x(hover), y: Math.min(...vis.map((s) => y(s.v[hover]))) - 10, title: labels[hover],
    rows: [...vis].sort((a, b) => b.values[hover] - a.values[hover]).map((s) => ({ color: seriesColor(s.i), label: s.name, value: format(s.values[hover]) })),
  };

  return (
    <div className="ui-chart" ref={ref} style={{ height }}>
      {w > 0 && (
        <svg width={w} height={height} onPointerMove={move} onPointerLeave={() => setHover(null)} role="img"
          aria-label={`Line chart: ${vis.map((s) => s.name).join(", ")}`}>
          <YAxis ticks={ticks} y={y} x0={m.l} x1={m.l + iw} format={format} />
          <XLabels labels={labels} x={x} y={height - 8} width={iw} />
          {vis.map((s) => {
            const pts = s.v.map((v, i) => [x(i), y(v)] as [number, number]);
            const d = pixel ? stepped(pts) : smooth(pts);
            return (
              <g key={s.name} style={{ color: seriesColor(s.i) }}>
                {area && <path d={`${d}L${x(n - 1)},${y(0)}L${x(0)},${y(0)}Z`} className="ui-chart-area" />}
                <path d={d} className="ui-chart-line" />
              </g>
            );
          })}
          {vis.length > 1 && vis.map((s, k) => (
            <g key={s.name} className="ui-chart-endlabel" transform={`translate(${m.l + iw + 10},${endY[k]})`}>
              <circle r={4} fill={seriesColor(s.i)} />
              <text x={9} dy="0.32em">{s.name}</text>
            </g>
          ))}
          {hover !== null && (
            <g>
              <line className="ui-crosshair" x1={x(hover)} x2={x(hover)} y1={m.t} y2={m.t + ih} />
              {vis.map((s) => <circle key={s.name} cx={x(hover)} cy={y(s.v[hover])} r={4.5} fill={seriesColor(s.i)} className="ui-mark-ring" />)}
            </g>
          )}
        </svg>
      )}
      <Tooltip tip={tip} width={w} />
    </div>
  );
}

/* ---------- grouped bars ---------- */

export function BarChart({ labels, series, height = 260, format = fmtCompact }: {
  labels: string[]; series: Series[]; height?: number; format?: (v: number) => string;
}) {
  const { ref, inView, w } = useChartBox();
  const theme = useUITheme(), depth = theme === "depth", radius = theme === "pixel" ? 0 : 4;
  const [hover, setHover] = useState<[number, number] | null>(null);
  const n = labels.length, k = series.length;
  const flat = series.flatMap((s) => s.values);
  const anim = useTween(inView ? flat : flat.map(() => 0), 900);
  const ticks = niceTicks(0, Math.max(1, ...flat));
  const yMax = ticks[ticks.length - 1];
  const m = { l: 44, r: 12, t: 18, b: 28 };
  const iw = Math.max(10, w - m.l - m.r), ih = height - m.t - m.b;
  const band = iw / n, pad = band * 0.26, gap = 2;
  const bw = Math.max(2, (band - pad - gap * (k - 1)) / k);
  const y = (v: number) => m.t + ih - (v / yMax) * ih;
  const bx = (g: number, s: number) => m.l + g * band + pad / 2 + s * (bw + gap);
  const maxIdx = flat.indexOf(Math.max(...flat));
  const ext = depth ? Math.min(7, bw * 0.4) : 0;

  const tip: Tip | null = hover && {
    x: bx(hover[0], hover[1]) + bw / 2, y: y(series[hover[1]].values[hover[0]]) - 10, title: labels[hover[0]],
    rows: [{ color: seriesColor(hover[1]), label: series[hover[1]].name, value: format(series[hover[1]].values[hover[0]]) }],
  };

  return (
    <div className="ui-chart" ref={ref} style={{ height }}>
      {w > 0 && (
        <svg width={w} height={height} role="img" aria-label={`Bar chart: ${series.map((s) => s.name).join(", ")}`} onPointerLeave={() => setHover(null)}>
          <YAxis ticks={ticks} y={y} x0={m.l} x1={m.l + iw} format={format} />
          <XLabels labels={labels} x={(i) => m.l + i * band + band / 2} y={height - 8} width={iw} />
          {labels.map((_, g) => series.map((s, si) => {
            const v = anim[si * n + g], top = y(v), h = m.t + ih - top, bxv = bx(g, si);
            const active = !hover || (hover[0] === g && hover[1] === si);
            return (
              <g key={`${g}-${si}`} style={{ color: seriesColor(si), opacity: active ? 1 : 0.45 }} className="ui-bar"
                onPointerEnter={() => setHover([g, si])}>
                <rect x={m.l + g * band} y={m.t} width={band} height={ih} fill="transparent" />
                {ext > 0 && h > 1 && <>
                  <path d={`M${bxv + bw},${top + 2}l${ext},${-ext}V${m.t + ih - ext}l${-ext},${ext}Z`} fill="currentColor" className="ui-bar-side" />
                  <path d={`M${bxv + 2},${top}l${ext},${-ext}H${bxv + bw + ext}l${-ext},${ext}Z`} fill="currentColor" className="ui-bar-top" />
                </>}
                <path d={barPath(bxv, top, bw, h, radius)} fill="currentColor" />
                {si * n + g === maxIdx && v > 0 && <text className="ui-bar-label" x={bxv + bw / 2} y={top - 6 - ext} textAnchor="middle">{format(series[si].values[g])}</text>}
              </g>
            );
          }))}
        </svg>
      )}
      <Tooltip tip={tip} width={w} />
    </div>
  );
}

/* ---------- donut ---------- */

function arc(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number) {
  const p = (r: number, a: number) => `${cx + r * Math.sin(a)},${cy - r * Math.cos(a)}`;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${p(r1, a0)}A${r1},${r1} 0 ${large} 1 ${p(r1, a1)}L${p(r0, a1)}A${r0},${r0} 0 ${large} 0 ${p(r0, a0)}Z`;
}

export function DonutChart({ slices, size = 210, format = fmtCompact, label = "Total" }: {
  slices: { name: string; value: number }[]; size?: number; format?: (v: number) => string; label?: string;
}) {
  const { ref, inView } = useChartBox();
  const depth = useUITheme() === "depth";
  const [hover, setHover] = useState<number | null>(null);
  // more than 4 parts fold into "Other" so no generated hues appear
  const data = useMemo(() => {
    const s = [...slices].sort((a, b) => b.value - a.value);
    return s.length <= 4 ? s : [...s.slice(0, 4), { name: "Other", value: s.slice(4).reduce((t, d) => t + d.value, 0) }];
  }, [slices]);
  const total = data.reduce((t, d) => t + d.value, 0) || 1;
  const [p] = useTween([inView ? 1 : 0], 1100);
  const c = size / 2, r1 = c - 8, r0 = r1 * 0.62;
  const color = (i: number) => (data[i].name === "Other" && i === 4 ? "var(--s-other)" : seriesColor(i));
  let acc = 0;
  const arcs = data.map((d, i) => {
    const a0 = acc * 2 * Math.PI * p, a1 = (acc + d.value / total) * 2 * Math.PI * p;
    acc += d.value / total;
    return { d, i, a0, a1, mid: (a0 + a1) / 2 };
  });
  const focus = hover === null ? null : data[hover];

  return (
    <div className="ui-donut" ref={ref}>
      <div className="ui-donut-fig" style={{ width: size, height: size }}>
        <svg width={size} height={size} role="img" aria-label={`Donut chart: ${data.map((d) => `${d.name} ${Math.round((d.value / total) * 100)}%`).join(", ")}`}>
          {depth && [6, 5, 4, 3, 2, 1].map((dy) => (
            <g key={dy} transform={`translate(0,${dy * 2})`} className="ui-donut-ext">
              {arcs.map((a) => a.a1 > a.a0 && <path key={a.i} d={arc(c, c, r0, r1, a.a0, a.a1)} fill={color(a.i)} />)}
            </g>
          ))}
          {arcs.map((a) => {
            const off = hover === a.i ? 7 : 0;
            return a.a1 > a.a0 && (
              <path key={a.i} d={arc(c, c, r0, r1, a.a0, a.a1)} fill={color(a.i)} className="ui-donut-slice"
                style={{ transform: `translate(${Math.sin(a.mid) * off}px,${-Math.cos(a.mid) * off}px)`, opacity: hover === null || hover === a.i ? 1 : 0.5 }}
                onPointerEnter={() => setHover(a.i)} onPointerLeave={() => setHover(null)} />
            );
          })}
        </svg>
        <div className="ui-donut-center">
          <b>{focus ? `${Math.round((focus.value / total) * 100)}%` : format(total)}</b>
          <span>{focus ? focus.name : label}</span>
        </div>
      </div>
      <ul className="ui-donut-legend">
        {data.map((d, i) => (
          <li key={d.name} className={cx(hover === i && "is-active")} onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)}>
            <Swatch color={color(i)} /><span>{d.name}</span><b>{format(d.value)}</b><em>{Math.round((d.value / total) * 100)}%</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- scatter + trend ---------- */

export interface ScatterGroup { name: string; points: { x: number; y: number; label?: string }[] }

function ols(pts: { x: number; y: number }[]) {
  const n = pts.length;
  if (n < 3) return null;
  const mx = pts.reduce((s, p) => s + p.x, 0) / n, my = pts.reduce((s, p) => s + p.y, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  pts.forEach((p) => { sxy += (p.x - mx) * (p.y - my); sxx += (p.x - mx) ** 2; syy += (p.y - my) ** 2; });
  if (!sxx || !syy) return null;
  const slope = sxy / sxx;
  return { slope, intercept: my - slope * mx, r: sxy / Math.sqrt(sxx * syy) };
}

function Mark({ shape, x, y, r, color, className }: { shape: number; x: number; y: number; r: number; color: string; className?: string }) {
  const common = { fill: color, className: cx("ui-mark-ring", className) };
  if (shape === 1) return <rect x={x - r * 0.9} y={y - r * 0.9} width={r * 1.8} height={r * 1.8} rx={2} {...common} />;
  if (shape === 2) return <path d={`M${x},${y - r * 1.2}L${x + r * 1.2},${y}L${x},${y + r * 1.2}L${x - r * 1.2},${y}Z`} {...common} />;
  return <circle cx={x} cy={y} r={r} {...common} />;
}

/** Up to 3 groups (validated all-pairs); each group also gets its own marker shape. */
export function ScatterChart({ groups, height = 280, xLabel, yLabel, trend = true, formatX = fmtCompact, formatY = fmtCompact }: {
  groups: ScatterGroup[]; height?: number; xLabel?: string; yLabel?: string; trend?: boolean;
  formatX?: (v: number) => string; formatY?: (v: number) => string;
}) {
  const { ref, inView, w } = useChartBox();
  const [hover, setHover] = useState<{ g: number; i: number } | null>(null);
  const all = groups.flatMap((g) => g.points);
  const xt = niceTicks(Math.min(...all.map((p) => p.x)), Math.max(...all.map((p) => p.x)), 5);
  const yMin = Math.min(...all.map((p) => p.y));
  const yt = niceTicks(yMin >= 0 ? 0 : yMin, Math.max(...all.map((p) => p.y)));
  const m = { l: 48, r: 16, t: 14, b: 42 };
  const iw = Math.max(10, w - m.l - m.r), ih = height - m.t - m.b;
  const x = (v: number) => m.l + ((v - xt[0]) / (xt[xt.length - 1] - xt[0])) * iw;
  const y = (v: number) => m.t + ih - ((v - yt[0]) / (yt[yt.length - 1] - yt[0])) * ih;
  const fit = trend ? ols(all) : null;

  const move = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
    let best: { g: number; i: number } | null = null, bd = 18 ** 2;
    groups.forEach((g, gi) => g.points.forEach((p, i) => {
      const d = (x(p.x) - px) ** 2 + (y(p.y) - py) ** 2;
      if (d < bd) { bd = d; best = { g: gi, i }; }
    }));
    setHover(best);
  };
  const hp = hover && groups[hover.g].points[hover.i];
  const tip: Tip | null = hover && hp ? {
    x: x(hp.x), y: y(hp.y) - 12, title: hp.label ?? groups[hover.g].name,
    rows: [{ color: seriesColor(hover.g), label: xLabel ?? "x", value: formatX(hp.x) }, { label: yLabel ?? "y", value: formatY(hp.y) }],
  } : null;

  return (
    <div className="ui-chart" ref={ref} style={{ height }}>
      {w > 0 && (
        <svg width={w} height={height} onPointerMove={move} onPointerLeave={() => setHover(null)} role="img" aria-label={`Scatter plot of ${yLabel} vs ${xLabel}`}>
          <YAxis ticks={yt} y={y} x0={m.l} x1={m.l + iw} format={formatY} />
          <g className="ui-axis">
            {xt.map((t) => <text key={t} x={x(t)} y={m.t + ih + 18} textAnchor="middle">{formatX(t)}</text>)}
            {xLabel && <text x={m.l + iw / 2} y={height - 4} textAnchor="middle" className="ui-axis-title">{xLabel}</text>}
          </g>
          {fit && inView && (() => {
            const x0 = xt[0], x1 = xt[xt.length - 1];
            return (
              <g className="ui-trend">
                <line x1={x(x0)} y1={y(fit.intercept + fit.slope * x0)} x2={x(x1)} y2={y(fit.intercept + fit.slope * x1)} />
              </g>
            );
          })()}
          {inView && groups.map((g, gi) => g.points.map((p, i) => (
            <g key={`${gi}-${i}`} className="ui-pop-mark" style={{ animationDelay: `${(gi * g.points.length + i) * 12}ms` } as CSSProperties}>
              <Mark shape={gi} x={x(p.x)} y={y(p.y)} r={hover?.g === gi && hover.i === i ? 7 : 5} color={seriesColor(gi)} />
            </g>
          )))}
        </svg>
      )}
      <Tooltip tip={tip} width={w} />
      {fit && <div className="ui-chart-note">Trend: y ≈ {fit.slope.toFixed(1)}x + {fit.intercept.toFixed(0)} · r = {fit.r.toFixed(2)} · n = {all.length}</div>}
    </div>
  );
}

/* ---------- histogram with summary stats ---------- */

export function summarize(values: number[]) {
  const s = [...values].sort((a, b) => a - b), n = s.length;
  const mean = s.reduce((t, v) => t + v, 0) / n;
  const sd = Math.sqrt(s.reduce((t, v) => t + (v - mean) ** 2, 0) / Math.max(1, n - 1));
  const q = (p: number) => s[Math.min(n - 1, Math.floor(p * (n - 1)))];
  return { n, mean, sd, median: q(0.5), p95: q(0.95), min: s[0], max: s[n - 1] };
}

export function Histogram({ values, bins = 18, height = 260, unit = "", format = (v: number) => v.toFixed(0) }: {
  values: number[]; bins?: number; height?: number; unit?: string; format?: (v: number) => string;
}) {
  const { ref, inView, w } = useChartBox();
  const radius = useUITheme() === "pixel" ? 0 : 3;
  const [hover, setHover] = useState<number | null>(null);
  const st = useMemo(() => summarize(values), [values]);
  const width = (st.max - st.min) / bins || 1;
  const counts = useMemo(() => {
    const c = Array(bins).fill(0);
    values.forEach((v) => c[Math.min(bins - 1, Math.floor((v - st.min) / width))]++);
    return c as number[];
  }, [values, bins, st.min, width]);
  const anim = useTween(inView ? counts : counts.map(() => 0), 900);
  const yt = niceTicks(0, Math.max(...counts));
  const m = { l: 40, r: 12, t: 26, b: 28 };
  const iw = Math.max(10, w - m.l - m.r), ih = height - m.t - m.b;
  const x = (v: number) => m.l + ((v - st.min) / (st.max - st.min || 1)) * iw;
  const y = (v: number) => m.t + ih - (v / yt[yt.length - 1]) * ih;
  const bw = iw / bins;
  const tip: Tip | null = hover === null ? null : {
    x: m.l + hover * bw + bw / 2, y: y(counts[hover]) - 10, title: `${format(st.min + hover * width)}–${format(st.min + (hover + 1) * width)}${unit}`,
    rows: [{ color: seriesColor(0), label: "Count", value: counts[hover] }],
  };

  return (
    <>
      <div className="ui-chart" ref={ref} style={{ height }}>
        {w > 0 && (
          <svg width={w} height={height} onPointerLeave={() => setHover(null)} role="img" aria-label={`Histogram, mean ${format(st.mean)}${unit}`}>
            <rect x={x(st.mean - st.sd)} y={m.t} width={Math.max(0, x(st.mean + st.sd) - x(st.mean - st.sd))} height={ih} className="ui-sigma" />
            <YAxis ticks={yt} y={y} x0={m.l} x1={m.l + iw} format={(v) => String(v)} />
            <g className="ui-axis">
              {[0, 0.25, 0.5, 0.75, 1].map((f) => <text key={f} x={m.l + f * iw} y={height - 8} textAnchor="middle">{format(st.min + f * (st.max - st.min))}{unit}</text>)}
            </g>
            {anim.map((c, i) => (
              <g key={i} style={{ color: seriesColor(0), opacity: hover === null || hover === i ? 1 : 0.5 }} onPointerEnter={() => setHover(i)}>
                <rect x={m.l + i * bw} y={m.t} width={bw} height={ih} fill="transparent" />
                <path d={barPath(m.l + i * bw + 1, y(c), bw - 2, m.t + ih - y(c), radius)} fill="currentColor" />
              </g>
            ))}
            <g className="ui-refline"><line x1={x(st.mean)} x2={x(st.mean)} y1={m.t - 6} y2={m.t + ih} /><text x={x(st.mean)} y={m.t - 10} textAnchor="middle">mean</text></g>
            <g className="ui-refline is-dashed"><line x1={x(st.median)} x2={x(st.median)} y1={m.t} y2={m.t + ih} /></g>
          </svg>
        )}
        <Tooltip tip={tip} width={w} />
      </div>
      <div className="ui-stats">
        {([["n", String(st.n)], ["mean", format(st.mean) + unit], ["median", format(st.median) + unit], ["σ", format(st.sd) + unit], ["p95", format(st.p95) + unit]] as const)
          .map(([k, v]) => <div key={k}><span>{k}</span><b>{v}</b></div>)}
      </div>
    </>
  );
}

/* ---------- heatmap (5-step sequential) ---------- */

export function Heatmap({ rows, cols, values, cell = 26, format = fmtCompact, colEvery = 1 }: {
  rows: string[]; cols: string[]; values: number[][]; cell?: number; format?: (v: number) => string; colEvery?: number;
}) {
  const { ref, inView, w } = useChartBox();
  const [hover, setHover] = useState<[number, number] | null>(null);
  const flat = values.flat(), lo = Math.min(...flat), hi = Math.max(...flat);
  const step = (v: number) => Math.min(4, Math.floor(((v - lo) / (hi - lo || 1)) * 5));
  const m = { l: 44, t: 4, b: 24 };
  const cw = Math.max(8, (w - m.l) / cols.length), ch = cell;
  const height = m.t + rows.length * ch + m.b;
  const tip: Tip | null = hover && {
    x: m.l + hover[1] * cw + cw / 2, y: m.t + hover[0] * ch - 6, title: `${rows[hover[0]]} · ${cols[hover[1]]}`,
    rows: [{ color: `var(--q${step(values[hover[0]][hover[1]]) + 1})`, label: "Value", value: format(values[hover[0]][hover[1]]) }],
  };
  return (
    <>
      <div className="ui-chart" ref={ref} style={{ height }}>
        {w > 0 && (
          <svg width={w} height={height} onPointerLeave={() => setHover(null)} role="img" aria-label="Heatmap">
            <g className="ui-axis">
              {rows.map((r, i) => <text key={r} x={m.l - 8} y={m.t + i * ch + ch / 2} dy="0.32em" textAnchor="end">{r}</text>)}
              {cols.map((c, j) => j % colEvery === 0 && <text key={c} x={m.l + j * cw + cw / 2} y={height - 6} textAnchor="middle">{c}</text>)}
            </g>
            {inView && values.map((row, i) => row.map((v, j) => (
              <rect key={`${i}-${j}`} x={m.l + j * cw + 1} y={m.t + i * ch + 1} width={cw - 2} height={ch - 2} rx={3}
                fill={`var(--q${step(v) + 1})`} className={cx("ui-cell", hover && hover[0] === i && hover[1] === j && "is-active")}
                style={{ animationDelay: `${(i + j) * 18}ms` }} onPointerEnter={() => setHover([i, j])} />
            )))}
          </svg>
        )}
        <Tooltip tip={tip} width={w} />
      </div>
      <div className="ui-scale-legend"><span>Low</span>{[1, 2, 3, 4, 5].map((q) => <i key={q} style={{ background: `var(--q${q})` }} />)}<span>High</span></div>
    </>
  );
}
