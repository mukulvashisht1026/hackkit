import { ButtonHTMLAttributes, MouseEvent, PointerEvent, ReactNode, useState } from "react";
import { cx } from "./core";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "glow" | "gradient" | "danger" | "success";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  pill?: boolean;
  /** Equal width/height, for icon-only buttons (pass aria-label). */
  square?: boolean;
  block?: boolean;
  /** Button drifts toward the pointer. */
  magnetic?: boolean;
  ripple?: boolean;
}

export function Button({
  variant = "primary", size = "md", loading, icon, iconRight, pill, square, block, magnetic, ripple = true,
  className, children, disabled, onClick, onPointerMove, onPointerLeave, ...rest
}: ButtonProps) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const click = (e: MouseEvent<HTMLButtonElement>) => {
    if (ripple) {
      const r = e.currentTarget.getBoundingClientRect();
      const id = Date.now() + Math.random();
      setRipples((p) => [...p, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
      setTimeout(() => setRipples((p) => p.filter((q) => q.id !== id)), 650);
    }
    onClick?.(e);
  };
  const move = (e: PointerEvent<HTMLButtonElement>) => {
    if (magnetic) {
      const el = e.currentTarget, r = el.getBoundingClientRect();
      el.style.setProperty("--tx", `${(e.clientX - r.left - r.width / 2) * 0.25}px`);
      el.style.setProperty("--ty", `${(e.clientY - r.top - r.height / 2) * 0.35}px`);
    }
    onPointerMove?.(e);
  };
  const leave = (e: PointerEvent<HTMLButtonElement>) => {
    if (magnetic) { e.currentTarget.style.setProperty("--tx", "0px"); e.currentTarget.style.setProperty("--ty", "0px"); }
    onPointerLeave?.(e);
  };

  return (
    <button
      type="button"
      {...rest}
      className={cx("ui-btn", `ui-btn-${variant}`, `ui-btn-${size}`, pill && "is-pill", square && "is-square",
        block && "is-block", loading && "is-loading", className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={click}
      onPointerMove={move}
      onPointerLeave={leave}
    >
      {loading && <span className="ui-btn-spin" aria-hidden />}
      <span className="ui-btn-label">{icon}{children}{iconRight}</span>
      {ripples.map((r) => <span key={r.id} className="ui-ripple" style={{ left: r.x, top: r.y }} />)}
    </button>
  );
}
