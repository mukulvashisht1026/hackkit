/**
 * Canvas force-directed graph for "who talks to whom": drag nodes, scroll to zoom, drag the
 * background to pan (dreamy) or orbit (3D theme, nodes live in 3D and auto-rotate).
 * Pass `events` to animate interactions: each new {id, source, target} fires a pulse along that edge.
 */
import { useEffect, useRef, useState } from "react";
import { useReducedMotion, useUITheme } from "./core";
import { Icon } from "./icons";
import { Swatch, seriesColor } from "./Charts";

export interface GraphNode { id: string; label: string; group: number; meta?: Record<string, string | number> }
export interface GraphEdge { source: string; target: string; weight?: number }
export interface GraphEvent { id: string | number; source: string; target: string }

interface Sim { node: GraphNode; x: number; y: number; z: number; vx: number; vy: number; vz: number; deg: number; fixed?: boolean }
interface Burst { a: string; b: string; t0: number }
interface Pulse { id: string; t0: number }
interface Proj { s: Sim; sx: number; sy: number; zr: number; r: number }

const F = 700; // perspective focal length (3D only)

export function EntityGraph({ nodes, edges, groups, height = 460, events = [], selected = null, onSelect }: {
  nodes: GraphNode[]; edges: GraphEdge[]; groups: string[]; height?: number; events?: GraphEvent[];
  selected?: string | null; onSelect?: (n: GraphNode | null) => void;
}) {
  const theme = useUITheme();
  const reduced = useReducedMotion();
  const depth = theme === "depth", pixel = theme === "pixel";
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const sims = useRef(new Map<string, Sim>());
  // `fit` = auto-zoom to the layout until the user zooms or pans
  const view = useRef({ zoom: 1, px: 0, py: 0, ry: 0.5, rx: -0.32, alpha: 1, fit: true });
  const bursts = useRef<Burst[]>([]);
  const pulses = useRef<Pulse[]>([]);
  const seen = useRef(new Set<string | number>());
  const hoverId = useRef<string | null>(null);
  const drag = useRef<{ node: Sim | null; zr: number; x: number; y: number; sx: number; sy: number; moved: boolean } | null>(null);
  const live = useRef({ edges, selected, onSelect, depth, reduced, pixel });
  live.current = { edges, selected, onSelect, depth, reduced, pixel };
  const [cursor, setCursor] = useState("grab");

  // keep simulation state across prop changes; new nodes spawn near a neighbour
  useEffect(() => {
    const map = sims.current;
    const ids = new Set(nodes.map((n) => n.id));
    [...map.keys()].forEach((id) => { if (!ids.has(id)) map.delete(id); });
    const deg = new Map<string, number>();
    edges.forEach((e) => { deg.set(e.source, (deg.get(e.source) ?? 0) + 1); deg.set(e.target, (deg.get(e.target) ?? 0) + 1); });
    nodes.forEach((n) => {
      const cur = map.get(n.id);
      if (cur) { cur.node = n; cur.deg = deg.get(n.id) ?? 0; return; }
      const nb = edges.find((e) => e.source === n.id || e.target === n.id);
      const anchor = nb && map.get(nb.source === n.id ? nb.target : nb.source);
      const j = () => (Math.random() - 0.5) * 80;
      map.set(n.id, {
        node: n, deg: deg.get(n.id) ?? 0, vx: 0, vy: 0, vz: 0,
        x: (anchor?.x ?? 0) + j(), y: (anchor?.y ?? 0) + j(), z: depth ? (anchor?.z ?? 0) + j() : 0,
      });
    });
    view.current.alpha = 1;
  }, [nodes, edges, depth]);

  // flatten / inflate the z axis when the theme switches
  useEffect(() => {
    sims.current.forEach((s) => { s.z = depth ? (Math.random() - 0.5) * 160 : 0; s.vz = 0; });
    view.current.alpha = 1;
  }, [depth]);

  // new interaction events become bursts
  useEffect(() => {
    const now = performance.now();
    events.forEach((ev) => {
      if (seen.current.has(ev.id)) return;
      seen.current.add(ev.id);
      bursts.current.push({ a: ev.source, b: ev.target, t0: now });
    });
    if (seen.current.size > 500) seen.current = new Set(events.map((e) => e.id));
  }, [events]);

  useEffect(() => {
    const cv = canvas.current!, ctx = cv.getContext("2d")!;
    let w = 0, h = 0, raf = 0, visible = true, proj: Proj[] = [];
    let colors = { ink: "#000", mut: "#888", line: "#ccc", surface: "#fff", glow: "#fff", groups: [] as string[] };

    const readColors = () => {
      const cs = getComputedStyle(cv);
      const v = (n: string) => cs.getPropertyValue(n).trim();
      colors = { ink: v("--ink"), mut: v("--mut"), line: v("--line-strong"), surface: v("--chart-surface"), glow: v("--a2"), groups: [1, 2, 3, 4].map((i) => v(`--s${i}`)) };
    };
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = wrap.current!.clientWidth; h = height;
      cv.width = w * dpr; cv.height = h * dpr; cv.style.width = `${w}px`; cv.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      readColors();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap.current!);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(cv);

    const project = (s: Sim): Proj => {
      const V = view.current, d = live.current.depth;
      let x = s.x, y = s.y, z = s.z;
      if (d) {
        const ca = Math.cos(V.ry), sa = Math.sin(V.ry), cb = Math.cos(V.rx), sb = Math.sin(V.rx);
        const x1 = x * ca + z * sa, z1 = -x * sa + z * ca;
        const y2 = y * cb - z1 * sb, z2 = y * sb + z1 * cb;
        x = x1; y = y2; z = z2;
      }
      const sc = d ? F / (F + z) : 1;
      const r = (7 + Math.sqrt(s.deg) * 3) * sc * V.zoom;
      return { s, sx: w / 2 + V.px + x * sc * V.zoom, sy: h / 2 + V.py + y * sc * V.zoom, zr: d ? z : 0, r };
    };
    // inverse of project for a dragged node at its current depth
    const unproject = (s: Sim, sx: number, sy: number, zr: number) => {
      const V = view.current, d = live.current.depth, sc = d ? F / (F + zr) : 1;
      const xr = (sx - w / 2 - V.px) / (sc * V.zoom), yr = (sy - h / 2 - V.py) / (sc * V.zoom);
      if (!d) { s.x = xr; s.y = yr; return; }
      const cb = Math.cos(-V.rx), sb = Math.sin(-V.rx), ca = Math.cos(-V.ry), sa = Math.sin(-V.ry);
      const y = yr * cb - zr * sb, z1 = yr * sb + zr * cb;
      s.x = xr * ca + z1 * sa; s.z = -xr * sa + z1 * ca; s.y = y;
    };

    const step = () => {
      const V = view.current, list = [...sims.current.values()], d = live.current.depth;
      if (V.alpha < 0.003) return;
      for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
        const a = list[i], b = list[j];
        let dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
        let d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < 1) { dx = Math.random(); dy = Math.random(); d2 = 1; }
        const f = (7000 / d2) * V.alpha, dd = Math.sqrt(d2);
        a.vx += (dx / dd) * f; a.vy += (dy / dd) * f; b.vx -= (dx / dd) * f; b.vy -= (dy / dd) * f;
        if (d) { a.vz += (dz / dd) * f; b.vz -= (dz / dd) * f; }
      }
      live.current.edges.forEach((e) => {
        const a = sims.current.get(e.source), b = sims.current.get(e.target);
        if (!a || !b) return;
        const dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z, dd = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
        const f = (dd - 120) * 0.03 * V.alpha;
        a.vx += (dx / dd) * f; a.vy += (dy / dd) * f; b.vx -= (dx / dd) * f; b.vy -= (dy / dd) * f;
        if (d) { a.vz += (dz / dd) * f; b.vz -= (dz / dd) * f; }
      });
      list.forEach((s) => {
        s.vx -= s.x * 0.006 * V.alpha; s.vy -= s.y * 0.006 * V.alpha; s.vz -= s.z * 0.006 * V.alpha;
        if (s.fixed) { s.vx = s.vy = s.vz = 0; return; }
        s.vx *= 0.82; s.vy *= 0.82; s.vz *= 0.82;
        s.x += s.vx; s.y += s.vy; s.z = d ? s.z + s.vz : 0;
      });
      V.alpha *= 0.992;
    };

    const shape = (g: number, x: number, y: number, r: number) => {
      ctx.beginPath();
      if (live.current.pixel) { x = Math.round(x / 3) * 3; y = Math.round(y / 3) * 3; r = Math.max(6, Math.round(r / 3) * 3); }
      if (g % 4 === 1) ctx.roundRect(x - r * 0.9, y - r * 0.9, r * 1.8, r * 1.8, live.current.pixel ? 0 : r * 0.35);
      else if (g % 4 === 2) { ctx.moveTo(x, y - r * 1.2); ctx.lineTo(x + r * 1.2, y); ctx.lineTo(x, y + r * 1.2); ctx.lineTo(x - r * 1.2, y); ctx.closePath(); }
      else if (g % 4 === 3) { ctx.moveTo(x, y - r * 1.15); ctx.lineTo(x + r * 1.1, y + r * 0.8); ctx.lineTo(x - r * 1.1, y + r * 0.8); ctx.closePath(); }
      else ctx.arc(x, y, r, 0, Math.PI * 2);
    };

    const draw = (now: number) => {
      const L = live.current, V = view.current;
      if (L.depth && !L.reduced && !drag.current && !hoverId.current) V.ry += 0.0025; // pause orbit under the cursor so nodes stay clickable
      step();
      if (V.fit && sims.current.size) {
        let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
        sims.current.forEach((s) => {
          const ext = L.depth ? Math.hypot(s.x, s.z) : 0;
          x0 = Math.min(x0, L.depth ? -ext : s.x); x1 = Math.max(x1, L.depth ? ext : s.x);
          y0 = Math.min(y0, s.y); y1 = Math.max(y1, s.y);
        });
        const target = Math.max(0.35, Math.min(1.8, Math.min((w - 120) / (x1 - x0 || 1), (h - 110) / (y1 - y0 || 1))));
        V.zoom += (target - V.zoom) * 0.08;
        V.px += (-((x0 + x1) / 2) * V.zoom - V.px) * 0.08;
        V.py += (-((y0 + y1) / 2) * V.zoom - V.py) * 0.08;
      }
      ctx.clearRect(0, 0, w, h);
      proj = [...sims.current.values()].map(project).sort((a, b) => b.zr - a.zr);
      const P = new Map(proj.map((p) => [p.s.node.id, p]));
      const focus = hoverId.current ?? L.selected;
      const nbrs = new Set<string>();
      if (focus) L.edges.forEach((e) => { if (e.source === focus) nbrs.add(e.target); if (e.target === focus) nbrs.add(e.source); });
      const lit = (id: string) => !focus || id === focus || nbrs.has(id);

      // edges + ambient flow
      L.edges.forEach((e, k) => {
        const a = P.get(e.source), b = P.get(e.target);
        if (!a || !b) return;
        const on = focus && (e.source === focus || e.target === focus);
        ctx.globalAlpha = focus && !on ? 0.12 : on ? 0.95 : 0.45;
        ctx.strokeStyle = on ? colors.groups[a.s.node.group % 4] : colors.line;
        ctx.lineWidth = L.pixel ? (on ? 3 : 2) : (on ? 2 : 1.2) * Math.sqrt(e.weight ?? 1) * Math.min(1.4, (a.r + b.r) / 18);
        ctx.setLineDash(L.pixel ? [6, 4] : []);
        ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
        ctx.setLineDash([]);
        if (!L.reduced && (!focus || on)) {
          const t = ((now / 2600) * (e.weight ?? 1) + k * 0.137) % 1;
          ctx.globalAlpha = on ? 0.9 : 0.5;
          ctx.fillStyle = colors.groups[a.s.node.group % 4];
          const fx = a.sx + (b.sx - a.sx) * t, fy = a.sy + (b.sy - a.sy) * t;
          if (L.pixel) ctx.fillRect(Math.round(fx / 3) * 3 - 2, Math.round(fy / 3) * 3 - 2, 4, 4);
          else { ctx.beginPath(); ctx.arc(fx, fy, 1.8 * Math.min(1.5, a.r / 9), 0, Math.PI * 2); ctx.fill(); }
        }
      });

      // interaction bursts
      ctx.globalAlpha = 1;
      bursts.current = bursts.current.filter((bu) => {
        const a = P.get(bu.a), b = P.get(bu.b);
        if (!a || !b) return false;
        const t = (now - bu.t0) / (L.reduced ? 1 : 900);
        if (t >= 1) { pulses.current.push({ id: bu.b, t0: now }); return false; }
        const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
        const x = a.sx + (b.sx - a.sx) * e, y = a.sy + (b.sy - a.sy) * e;
        if (L.pixel) {
          const px = Math.round(x / 3) * 3, py = Math.round(y / 3) * 3;
          ctx.fillStyle = colors.glow; ctx.fillRect(px - 6, py - 6, 12, 12);
          ctx.fillStyle = "#f4f4f4"; ctx.fillRect(px - 3, py - 3, 6, 6);
          return true;
        }
        const g = ctx.createRadialGradient(x, y, 0, x, y, 12);
        g.addColorStop(0, colors.glow); g.addColorStop(1, "transparent");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(x, y, 2.6, 0, Math.PI * 2); ctx.fill();
        return true;
      });

      // nodes, far to near
      const zoomedOut = V.zoom < 0.7;
      proj.forEach((p) => {
        const n = p.s.node, col = colors.groups[n.group % 4], isFocus = n.id === focus, isSel = n.id === L.selected;
        ctx.globalAlpha = lit(n.id) ? 1 : 0.22;
        const pu = pulses.current.find((q) => q.id === n.id);
        if (pu) {
          const t = (now - pu.t0) / 700;
          ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.globalAlpha *= Math.max(0, 1 - t);
          shape(n.group, p.sx, p.sy, p.r + 4 + (L.pixel ? Math.floor(t * 4) * 5 : t * 18)); ctx.stroke();
          ctx.globalAlpha = lit(n.id) ? 1 : 0.22;
        }
        ctx.shadowColor = col; ctx.shadowBlur = L.pixel ? 0 : isFocus || isSel ? 22 : L.depth ? 10 : 6;
        if (L.pixel) { ctx.fillStyle = "rgba(0,0,0,.45)"; shape(n.group, p.sx + 4, p.sy + 4, p.r); ctx.fill(); }
        if (L.depth) {
          const g = ctx.createRadialGradient(p.sx - p.r * 0.4, p.sy - p.r * 0.5, p.r * 0.1, p.sx, p.sy, p.r * 1.3);
          g.addColorStop(0, "#ffffff"); g.addColorStop(0.25, col); g.addColorStop(1, "#05060f");
          ctx.fillStyle = g;
        } else ctx.fillStyle = col;
        shape(n.group, p.sx, p.sy, p.r); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = L.pixel ? (isSel || isFocus ? "#ffcd75" : "#0d0e18") : isSel ? colors.ink : colors.surface;
        ctx.lineWidth = L.pixel ? 3 : isSel ? 2.5 : 2;
        shape(n.group, p.sx, p.sy, p.r); ctx.stroke();
        if (!zoomedOut || isFocus || nbrs.has(n.id)) {
          ctx.font = L.pixel ? `8px "Press Start 2P", monospace` : `${isFocus ? 600 : 500} ${Math.max(10, 12 * Math.min(1.2, p.r / 10))}px Outfit, system-ui, sans-serif`;
          ctx.textAlign = "center"; ctx.textBaseline = "top";
          const ly = Math.round(p.sy + p.r * 1.25 + 6);
          if (L.pixel) { ctx.fillStyle = "#0d0e18"; ctx.fillText(n.label.toUpperCase(), Math.round(p.sx) + 2, ly + 2); }
          ctx.fillStyle = isFocus ? colors.ink : colors.mut;
          ctx.fillText(L.pixel ? n.label.toUpperCase() : n.label, Math.round(p.sx), ly);
        }
      });
      pulses.current = pulses.current.filter((q) => now - q.t0 < 700);
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => { if (visible) draw(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);

    // pointer interaction
    const hit = (x: number, y: number) => {
      for (let i = proj.length - 1; i >= 0; i--) {
        const p = proj[i];
        if ((p.sx - x) ** 2 + (p.sy - y) ** 2 <= (p.r + 6) ** 2) return p;
      }
      return null;
    };
    const pos = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    const down = (e: PointerEvent) => {
      const [x, y] = pos(e), p = hit(x, y);
      cv.setPointerCapture(e.pointerId);
      drag.current = { node: p?.s ?? null, zr: p?.zr ?? 0, x, y, sx: x, sy: y, moved: false };
      if (p) { p.s.fixed = true; view.current.alpha = Math.max(view.current.alpha, 0.5); }
      setCursor("grabbing");
    };
    const move = (e: PointerEvent) => {
      const [x, y] = pos(e), D = drag.current, V = view.current;
      if (!D) {
        const p = hit(x, y);
        hoverId.current = p?.s.node.id ?? null;
        setCursor(p ? "pointer" : "grab");
        return;
      }
      if (Math.abs(x - D.sx) + Math.abs(y - D.sy) > 4) D.moved = true;
      if (D.node) { unproject(D.node, x, y, D.zr); V.alpha = Math.max(V.alpha, 0.3); }
      else if (live.current.depth && !e.shiftKey) { V.ry += (x - D.x) * 0.008; V.rx = Math.max(-1.2, Math.min(1.2, V.rx - (y - D.y) * 0.006)); }
      else { V.px += x - D.x; V.py += y - D.y; V.fit = false; }
      D.x = x; D.y = y;
    };
    const up = () => {
      const D = drag.current;
      if (D) {
        if (D.node) D.node.fixed = false;
        if (!D.moved) live.current.onSelect?.(D.node ? D.node.node : null);
      }
      drag.current = null;
      setCursor("grab");
    };
    const leave = () => { hoverId.current = null; };
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      const V = view.current, [x, y] = pos(e as unknown as PointerEvent);
      const z = Math.max(0.35, Math.min(2.6, V.zoom * Math.exp(-e.deltaY * 0.0015)));
      const k = z / V.zoom;
      V.px = x - w / 2 - (x - w / 2 - V.px) * k; V.py = y - h / 2 - (y - h / 2 - V.py) * k; V.zoom = z; V.fit = false;
    };
    cv.addEventListener("pointerdown", down);
    cv.addEventListener("pointermove", move);
    cv.addEventListener("pointerup", up);
    cv.addEventListener("pointercancel", up);
    cv.addEventListener("pointerleave", leave);
    cv.addEventListener("wheel", wheel, { passive: false });
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      cv.removeEventListener("pointerdown", down); cv.removeEventListener("pointermove", move);
      cv.removeEventListener("pointerup", up); cv.removeEventListener("pointercancel", up);
      cv.removeEventListener("pointerleave", leave); cv.removeEventListener("wheel", wheel);
    };
  }, [height, theme]);

  const zoomBy = (f: number) => { const V = view.current; V.fit = false; V.zoom = Math.max(0.35, Math.min(2.6, V.zoom * f)); };
  const reset = () => { Object.assign(view.current, { rx: -0.32, alpha: 1, fit: true }); };

  return (
    <div className="ui-graph" ref={wrap} style={{ height }}>
      <canvas ref={canvas} style={{ cursor, touchAction: "none" }} role="img"
        aria-label={`Entity graph: ${nodes.length} entities, ${edges.length} connections`} />
      <div className="ui-graph-legend">
        {groups.map((g, i) => <span key={g}><Swatch color={seriesColor(i)} shape={i % 4} />{g}</span>)}
      </div>
      <div className="ui-graph-tools">
        <button type="button" className="ui-icon-btn" aria-label="Zoom in" onClick={() => zoomBy(1.25)}><Icon.plus /></button>
        <button type="button" className="ui-icon-btn" aria-label="Zoom out" onClick={() => zoomBy(0.8)}><svg viewBox="0 0 24 24" width="1em" height="1em" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true"><path d="M5 12h14" /></svg></button>
        <button type="button" className="ui-icon-btn" aria-label="Reset view" onClick={reset}><Icon.back style={{ transform: "rotate(45deg)" }} /></button>
      </div>
      <div className="ui-graph-hint">{pixel ? "DRAG · SCROLL · CLICK" : depth ? "Drag nodes · drag space to orbit · shift-drag to pan · scroll to zoom" : "Drag nodes · drag space to pan · scroll to zoom · click to inspect"}</div>
    </div>
  );
}
