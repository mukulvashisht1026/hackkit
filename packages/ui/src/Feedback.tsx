import { CSSProperties, ReactNode, createContext, useCallback, useContext, useEffect, useId, useState } from "react";
import { Portal, cx } from "./core";
import { Icon } from "./icons";

export const Spinner = ({ size = 28 }: { size?: number }) =>
  <span className="ui-spinner" style={{ "--s": `${size}px` } as CSSProperties} role="status" aria-label="Loading" />;

export const Dots = () => <span className="ui-typing" aria-label="Loading"><i /><i /><i /></span>;

export const Skeleton = ({ w = "100%", h = 12, circle }: { w?: number | string; h?: number; circle?: boolean }) =>
  <span className={cx("ui-skel", circle && "is-circle")} style={{ width: circle ? h : w, height: h }} />;

export function Progress({ value = 0, indeterminate }: { value?: number; indeterminate?: boolean }) {
  return (
    <div className={cx("ui-progress", indeterminate && "is-indeterminate")} role="progressbar"
      aria-valuenow={indeterminate ? undefined : Math.round(value)} aria-valuemin={0} aria-valuemax={100}>
      <span style={{ width: indeterminate ? undefined : `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function ProgressRing({ value, size = 84, stroke = 8 }: { value: number; size?: number; stroke?: number }) {
  const gid = "g" + useId().replace(/:/g, "");
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <div className="ui-ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <defs>
          <linearGradient id={gid} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" style={{ stopColor: "var(--a1)" }} />
            <stop offset="100%" style={{ stopColor: "var(--a2)" }} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--hl)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`url(#${gid})`} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: "stroke-dashoffset .8s cubic-bezier(.22,1,.36,1)" }} />
      </svg>
      <span>{Math.round(value)}%</span>
    </div>
  );
}

export function Modal({ open, onClose, title, children, footer, bare }: {
  open: boolean; onClose: () => void; title?: ReactNode; children: ReactNode; footer?: ReactNode; bare?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const f = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", f);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", f); document.body.style.overflow = prev; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <Portal>
      <div className="ui-modal-backdrop" onMouseDown={onClose}>
        <div className={cx("ui-modal", bare && "is-bare")} role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
          {!bare && (
            <div className="ui-modal-head">
              <h3>{title}</h3>
              <button type="button" className="ui-icon-btn" aria-label="Close" onClick={onClose}><Icon.x /></button>
            </div>
          )}
          {children}
          {footer && <div className="ui-modal-foot">{footer}</div>}
        </div>
      </div>
    </Portal>
  );
}

export type ToastTone = "info" | "success" | "error" | "warn";
interface ToastItem { id: number; title: string; desc?: string; tone: ToastTone }
type PushToast = (t: { title: string; desc?: string; tone?: ToastTone }) => void;

const ToastCtx = createContext<PushToast>(() => {});
export const useToast = () => useContext(ToastCtx);
const toneIcon = { info: Icon.info, success: Icon.check, error: Icon.x, warn: Icon.alert };

export function ToastProvider({ children, duration = 3800 }: { children: ReactNode; duration?: number }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const dismiss = useCallback((id: number) => setItems((p) => p.filter((x) => x.id !== id)), []);
  const push = useCallback<PushToast>((t) => {
    const id = Date.now() + Math.random();
    setItems((p) => [...p.slice(-3), { tone: "info", ...t, id }]);
    setTimeout(() => dismiss(id), duration);
  }, [duration, dismiss]);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <Portal>
        <div className="ui-toasts" aria-live="polite">
          {items.map((t) => {
            const I = toneIcon[t.tone];
            return (
              <div key={t.id} className={`ui-toast is-${t.tone}`} style={{ "--dur": `${duration}ms` } as CSSProperties}>
                <span className="ui-toast-icon"><I /></span>
                <div className="ui-toast-text"><strong>{t.title}</strong>{t.desc && <p>{t.desc}</p>}</div>
                <button type="button" className="ui-icon-btn" aria-label="Dismiss" onClick={() => dismiss(t.id)}><Icon.x /></button>
              </div>
            );
          })}
        </div>
      </Portal>
    </ToastCtx.Provider>
  );
}
