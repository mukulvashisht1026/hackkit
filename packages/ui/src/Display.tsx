import { CSSProperties, HTMLAttributes, ReactNode, useLayoutEffect, useRef, useState } from "react";
import { cx, useCountUp, useInView, useTilt, useUITheme } from "./core";
import { Icon } from "./icons";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** true = strong tilt, number = max degrees, false = off. Default: subtle in 3D theme, off in dreamy. */
  tilt?: boolean | number;
}

export function Card({ tilt, className, children, ...rest }: CardProps) {
  const theme = useUITheme();
  const deg = tilt === true ? 14 : tilt === false ? 0 : tilt ?? (theme === "depth" ? 6 : 0);
  const ref = useTilt<HTMLDivElement>(deg);
  return <div ref={ref} className={cx("ui-card", deg > 0 ? "is-tilt" : "is-hover", className)} {...rest}>{children}</div>;
}

export type Tone = "accent" | "ok" | "bad" | "warn" | "neutral";
export const Badge = ({ tone = "accent", dot, children }: { tone?: Tone; dot?: boolean; children: ReactNode }) =>
  <span className={cx("ui-badge", `is-${tone}`, dot && "has-dot")}>{children}</span>;

const hue = (s: string) => [...s].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 360, 7);

export function Avatar({ name, src, size = 36, status }: { name: string; src?: string; size?: number; status?: "online" | "away" | "off" }) {
  const h = hue(name);
  const initials = name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <span className="ui-avatar" title={name}
      style={{ "--s": `${size}px`, background: `linear-gradient(135deg, hsl(${h} 85% 72%), hsl(${(h + 50) % 360} 85% 62%))` } as CSSProperties}>
      {src ? <img src={src} alt={name} /> : initials}
      {status && <i className={`ui-avatar-status is-${status}`} />}
    </span>
  );
}

export function AvatarGroup({ names, max = 4, size = 38 }: { names: string[]; max?: number; size?: number }) {
  const rest = names.length - max;
  return (
    <div className="ui-avatars">
      {names.slice(0, max).map((n) => <Avatar key={n} name={n} size={size} />)}
      {rest > 0 && <span className="ui-avatar is-more" style={{ "--s": `${size}px` } as CSSProperties}>+{rest}</span>}
    </div>
  );
}

export const Tooltip = ({ tip, children }: { tip: string; children: ReactNode }) =>
  <span className="ui-tip" data-tip={tip}>{children}</span>;

export function Sparkline({ data, height = 44 }: { data: number[]; height?: number }) {
  const w = 160, min = Math.min(...data), max = Math.max(...data), span = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, height - 4 - ((v - min) / span) * (height - 8)]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  return (
    <svg className="ui-spark" viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" aria-hidden="true">
      <path d={`${line} L${w},${height} L0,${height} Z`} className="ui-spark-area" />
      <path d={line} className="ui-spark-line" pathLength={1} />
    </svg>
  );
}

export function StatCard({ label, value, prefix = "", suffix = "", decimals = 0, delta, spark, icon }: {
  label: string; value: number; prefix?: string; suffix?: string; decimals?: number; delta?: number; spark?: number[]; icon?: ReactNode;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const n = useCountUp(value, inView);
  return (
    <Card tilt>
      <div ref={ref} className={cx("ui-stat", inView && "is-in")}>
        <div className="ui-stat-top">
          <span className="ui-stat-label">{label}</span>
          {icon && <span className="ui-stat-icon">{icon}</span>}
        </div>
        <div className="ui-stat-value">{prefix}{n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</div>
        {delta !== undefined && <Badge tone={delta >= 0 ? "ok" : "bad"}>{delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}%</Badge>}
        {spark && <Sparkline data={spark} />}
      </div>
    </Card>
  );
}

export interface TabDef { id: string; label: ReactNode }

/** Segmented tabs with a springy sliding indicator. */
export function Tabs({ tabs, value, onChange, variant = "pill" }: {
  tabs: TabDef[]; value: string; onChange: (id: string) => void; variant?: "pill" | "line";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [ind, setInd] = useState({ left: 0, width: 0 });
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const measure = () => {
      const el = root.querySelector<HTMLElement>(`[data-tab="${CSS.escape(value)}"]`);
      if (el) setInd({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, [value, tabs.length]);
  return (
    <div ref={ref} className={cx("ui-tabs", `is-${variant}`)} role="tablist">
      <span className="ui-tabs-ind" style={{ width: ind.width, transform: `translateX(${ind.left}px)` }} />
      {tabs.map((t) => (
        <button key={t.id} type="button" role="tab" data-tab={t.id} aria-selected={t.id === value}
          className={cx("ui-tab", t.id === value && "is-active")} onClick={() => onChange(t.id)}>{t.label}</button>
      ))}
    </div>
  );
}

export function Accordion({ items, defaultOpen = 0 }: { items: { title: ReactNode; content: ReactNode }[]; defaultOpen?: number }) {
  const [open, setOpen] = useState<number>(defaultOpen);
  return (
    <div className="ui-acc">
      {items.map((it, i) => (
        <div key={i} className={cx("ui-acc-item", open === i && "is-open")}>
          <button type="button" className="ui-acc-head" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
            {it.title}<Icon.chevron />
          </button>
          <div className="ui-acc-body"><div><div className="ui-acc-content">{it.content}</div></div></div>
        </div>
      ))}
    </div>
  );
}

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="ui-steps">
      {steps.map((s, i) => (
        <li key={s} className={cx("ui-step", i < current && "is-done", i === current && "is-current")}>
          <span className="ui-step-dot">{i < current ? <Icon.check /> : i + 1}</span>
          <span>{s}</span>
        </li>
      ))}
    </ol>
  );
}
