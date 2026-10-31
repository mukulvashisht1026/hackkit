import { KeyboardEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { cx } from "./core";
import { Modal, Spinner } from "./Feedback";
import { Icon } from "./icons";

export interface SearchItem { label: string; hint?: string; icon?: ReactNode }

function Highlight({ text, q }: { text: string; q: string }) {
  const i = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (i < 0) return <>{text}</>;
  return <>{text.slice(0, i)}<mark>{text.slice(i, i + q.length)}</mark>{text.slice(i + q.length)}</>;
}

const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);

export function SearchBar({ items = [], placeholder = "Search…", onSearch, onSelect, loading, shortcut, autoFocus, inline }: {
  items?: SearchItem[];
  placeholder?: string;
  onSearch?: (q: string) => void;
  onSelect?: (item: SearchItem) => void;
  loading?: boolean;
  /** Single key that focuses the bar from anywhere, e.g. "/". */
  shortcut?: string;
  autoFocus?: boolean;
  /** Results list always shown below (used by CommandPalette). */
  inline?: boolean;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (s ? items.filter((i) => i.label.toLowerCase().includes(s) || i.hint?.toLowerCase().includes(s)) : items).slice(0, 8);
  }, [q, items]);

  useEffect(() => setIdx(0), [q]);
  useEffect(() => {
    if (!shortcut) return;
    const f = (e: globalThis.KeyboardEvent) => {
      if (e.key === shortcut && !isTyping(e.target)) { e.preventDefault(); input.current?.focus(); }
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [shortcut]);

  const choose = (item: SearchItem) => { setQ(""); setOpen(false); input.current?.blur(); onSelect?.(item); };
  const key = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setIdx((i) => Math.min(results.length - 1, i + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)); }
    else if (e.key === "Enter") { if ((open || inline) && results[idx]) choose(results[idx]); else onSearch?.(q); }
    else if (e.key === "Escape" && !inline) { setOpen(false); input.current?.blur(); }
  };
  const showMenu = inline || (open && results.length > 0);

  return (
    <div className={cx("ui-search", inline && "is-inline")}>
      <div className="ui-search-box">
        <Icon.search />
        <input ref={input} type="text" className="ui-search-input" value={q} placeholder={placeholder} autoFocus={autoFocus}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)} onKeyDown={key} role="combobox" aria-expanded={showMenu} aria-autocomplete="list" />
        {loading && <Spinner size={18} />}
        {q && !loading && <button type="button" className="ui-icon-btn" aria-label="Clear" onMouseDown={(e) => e.preventDefault()} onClick={() => setQ("")}><Icon.x /></button>}
        {shortcut && !q && <kbd className="ui-kbd">{shortcut}</kbd>}
      </div>
      {showMenu && (
        <ul className="ui-search-menu" role="listbox">
          {results.length === 0 && <li className="ui-search-empty">No results for “{q}”</li>}
          {results.map((r, i) => (
            <li key={r.label} role="option" aria-selected={i === idx} className={cx("ui-search-item", i === idx && "is-active")}
              onMouseEnter={() => setIdx(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => choose(r)}>
              <span className="ui-search-ic">{r.icon ?? <Icon.sparkle />}</span>
              <span className="ui-search-lbl"><Highlight text={r.label} q={q.trim()} /></span>
              {r.hint && <span className="ui-search-hint">{r.hint}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** ⌘K / Ctrl+K palette: a SearchBar in a modal. */
export function CommandPalette({ items, open, onOpenChange, onSelect }: {
  items: SearchItem[]; open: boolean; onOpenChange: (open: boolean) => void; onSelect?: (item: SearchItem) => void;
}) {
  useEffect(() => {
    const f = (e: globalThis.KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); onOpenChange(!open); }
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [open, onOpenChange]);

  return (
    <Modal open={open} onClose={() => onOpenChange(false)} bare>
      <SearchBar inline autoFocus items={items} placeholder="Type a command or search…"
        onSelect={(i) => { onOpenChange(false); onSelect?.(i); }} />
      <div className="ui-palette-foot"><span><kbd className="ui-kbd">↑↓</kbd> navigate</span><span><kbd className="ui-kbd">↵</kbd> select</span><span><kbd className="ui-kbd">esc</kbd> close</span></div>
    </Modal>
  );
}
