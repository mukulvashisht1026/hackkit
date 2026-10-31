/** Shared plumbing for the UI kit: theme context, class helper, motion hooks, portal. */
import { ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type UITheme = "dreamy" | "depth" | "pixel";
export const ThemeCtx = createContext<UITheme>("dreamy");
export const useUITheme = () => useContext(ThemeCtx);

/** undefined = follow the OS reduced-motion setting; true/false = user forced animations on/off. */
export const MotionCtx = createContext<boolean | undefined>(undefined);
export const motionClass = (m: boolean | undefined) => (m === true ? "is-motion" : m === false ? "is-still" : undefined);

export const cx = (...c: (string | false | null | undefined | 0)[]) => c.filter(Boolean).join(" ");
export const uid = () => Math.random().toString(36).slice(2, 10);
export const prefersReducedMotion = () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
export const useReducedMotion = () => { const m = useContext(MotionCtx); return m === undefined ? prefersReducedMotion() : !m; };

/** Pointer-follow tilt. Always sets --mx/--my (for glow); rotates only when max > 0. */
export function useTilt<T extends HTMLElement>(max = 10) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
      el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
      if (max > 0 && !reduced) {
        el.style.setProperty("--rx", `${-y * max}deg`);
        el.style.setProperty("--ry", `${x * max}deg`);
      }
    };
    const leave = () => { el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, [max, reduced]);
  return ref;
}

export function useInView<T extends Element>(once = true) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); if (once) io.disconnect(); } else if (!once) setInView(false);
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, [once]);
  return [ref, inView] as const;
}

/** Eased count from 0 to target once `run` turns true. */
export function useCountUp(target: number, run: boolean, ms = 1400) {
  const [v, setV] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!run) return;
    if (reduced) { setV(target); return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      setV(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, ms, reduced]);
  return v;
}

/** Renders into <body> but re-applies the theme class so tokens still resolve. */
export function Portal({ children }: { children: ReactNode }) {
  const theme = useUITheme();
  const motion = useContext(MotionCtx);
  const [mounted, setMounted] = useState(false); // document.body only exists in the browser
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(<div className={cx("ui-portal", `ui-${theme}`, motionClass(motion))}>{children}</div>, document.body);
}

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={cx("ui-reveal", inView && "is-in", className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
