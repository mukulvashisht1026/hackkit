import { CSSProperties, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes, useId, useRef, useState } from "react";
import { cx } from "./core";
import { Icon } from "./icons";

/** Input with a floating label. */
export function Field({ label, icon, hint, error, className, ...rest }: InputHTMLAttributes<HTMLInputElement> & {
  label: string; icon?: ReactNode; hint?: string; error?: string;
}) {
  const id = useId();
  return (
    <div className={cx("ui-field", icon && "has-icon", error && "is-error", className)}>
      {icon && <span className="ui-field-icon">{icon}</span>}
      <input id={id} className="ui-input" {...rest} placeholder=" " aria-invalid={!!error || undefined} />
      <label htmlFor={id}>{label}</label>
      {(error || hint) && <small>{error || hint}</small>}
    </div>
  );
}

export function TextArea({ label, hint, className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string }) {
  const id = useId();
  return (
    <div className={cx("ui-field", className)}>
      <textarea id={id} className="ui-input" {...rest} placeholder=" " />
      <label htmlFor={id}>{label}</label>
      {hint && <small>{hint}</small>}
    </div>
  );
}

export function Select({ children, className, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={cx("ui-select-wrap", className)}>
      <select className="ui-select" {...rest}>{children}</select>
      <Icon.chevron />
    </div>
  );
}

export function Toggle({ label, checked, onChange }: { label?: ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="ui-toggle">
      <input type="checkbox" className="ui-sr" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="ui-toggle-track"><span className="ui-toggle-thumb" /></span>
      {label && <span>{label}</span>}
    </label>
  );
}

export function Checkbox({ label, checked, onChange }: { label: ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="ui-check">
      <input type="checkbox" className="ui-sr" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="ui-check-box">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" pathLength={1} /></svg>
      </span>
      <span>{label}</span>
    </label>
  );
}

export function Slider({ value, onChange, min = 0, max = 100, step = 1, label }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; label?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="ui-slider-wrap">
      {label && <span className="ui-slider-top"><span>{label}</span><b>{value}</b></span>}
      <input type="range" className="ui-slider" min={min} max={max} step={step} value={value}
        style={{ "--pct": `${pct}%` } as CSSProperties} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

const fmtSize = (n: number) => (n > 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1e3))} KB`);

export function FileDrop({ onFiles, accept, multiple = true, label = "Drop files or click to browse", hint }: {
  onFiles?: (files: File[]) => void; accept?: string; multiple?: boolean; label?: string; hint?: string;
}) {
  const [over, setOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const input = useRef<HTMLInputElement>(null);
  const take = (list: FileList | null) => {
    if (!list?.length) return;
    const arr = Array.from(list);
    setFiles(arr);
    onFiles?.(arr);
  };
  return (
    <div className={cx("ui-drop", over && "is-over")} role="button" tabIndex={0}
      onClick={() => input.current?.click()}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.current?.click(); } }}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); take(e.dataTransfer.files); }}>
      <input ref={input} type="file" hidden accept={accept} multiple={multiple} onChange={(e) => take(e.target.files)} />
      <span className="ui-drop-icon"><Icon.upload /></span>
      <strong>{label}</strong>
      {hint && <small>{hint}</small>}
      {files.length > 0 && (
        <div className="ui-drop-files">
          {files.map((f) => <span className="ui-badge" key={f.name}>{f.name} · {fmtSize(f.size)}</span>)}
        </div>
      )}
    </div>
  );
}
