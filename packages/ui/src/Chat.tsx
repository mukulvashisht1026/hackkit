import { useEffect, useRef, useState } from "react";
import { cx, uid } from "./core";
import { Dots } from "./Feedback";
import { Icon } from "./icons";

export interface ChatMessage { id: string; role: "user" | "assistant"; text: string }

export interface ChatProps {
  /** Return the assistant reply. Throwing shows the error as a message. */
  onSend: (text: string, history: ChatMessage[]) => Promise<string>;
  title?: string;
  subtitle?: string;
  suggestions?: string[];
  initial?: ChatMessage[];
  placeholder?: string;
  /** Reveal replies character by character. */
  typewriter?: boolean;
}

export function Chat({ onSend, title = "Assistant", subtitle = "Online", suggestions = [], initial = [],
  placeholder = "Message…", typewriter = true }: ChatProps) {
  const [msgs, setMsgs] = useState<ChatMessage[]>(initial);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const body = useRef<HTMLDivElement>(null);
  const ta = useRef<HTMLTextAreaElement>(null);
  const timer = useRef<number>();

  useEffect(() => () => window.clearInterval(timer.current), []);
  useEffect(() => { const el = body.current; if (el) el.scrollTop = el.scrollHeight; }, [msgs, busy]);

  const grow = () => {
    const el = ta.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  };

  const reveal = (id: string, full: string) => {
    window.clearInterval(timer.current);
    const step = Math.max(1, Math.ceil(full.length / 120));
    let i = 0;
    timer.current = window.setInterval(() => {
      i = Math.min(full.length, i + step);
      setMsgs((m) => m.map((x) => (x.id === id ? { ...x, text: full.slice(0, i) } : x)));
      if (i >= full.length) window.clearInterval(timer.current);
    }, 18);
  };

  const send = async (raw = draft) => {
    const text = raw.trim();
    if (!text || busy) return;
    const history = [...msgs, { id: uid(), role: "user" as const, text }];
    setMsgs(history);
    setDraft("");
    if (ta.current) ta.current.style.height = "auto";
    setBusy(true);
    let reply: string;
    try { reply = await onSend(text, history); } catch (e: any) { reply = "⚠️ " + (e?.message || "Something went wrong"); }
    setBusy(false);
    const id = uid();
    setMsgs((m) => [...m, { id, role: "assistant", text: typewriter ? "" : reply }]);
    if (typewriter) reveal(id, reply);
  };

  return (
    <div className="ui-chat">
      <div className="ui-chat-head">
        <span className="ui-avatar ui-chat-bot"><Icon.bot /></span>
        <div>
          <div className="ui-chat-title">{title}</div>
          <div className="ui-chat-sub"><i className="ui-dot-live" />{busy ? "typing…" : subtitle}</div>
        </div>
      </div>

      <div className="ui-chat-body" ref={body}>
        {msgs.length === 0 && (
          <div className="ui-chat-empty">
            <span className="ui-icon-tile"><Icon.sparkle /></span>
            <strong>How can I help?</strong>
            <span>Ask anything, or start with a suggestion.</span>
          </div>
        )}
        {msgs.map((m) => (
          <div key={m.id} className={cx("ui-msg", m.role === "user" && "is-user")}>
            {m.role === "assistant" && <span className="ui-avatar ui-chat-bot is-sm"><Icon.bot /></span>}
            <div className="ui-bubble">{m.text || <Dots />}</div>
          </div>
        ))}
        {busy && (
          <div className="ui-msg">
            <span className="ui-avatar ui-chat-bot is-sm"><Icon.bot /></span>
            <div className="ui-bubble"><Dots /></div>
          </div>
        )}
      </div>

      {msgs.length === 0 && suggestions.length > 0 && (
        <div className="ui-chat-suggest">
          {suggestions.map((s) => <button key={s} type="button" className="ui-chip" onClick={() => send(s)}>{s}</button>)}
        </div>
      )}

      <form className="ui-chat-compose" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <textarea ref={ta} rows={1} className="ui-chat-input" value={draft} placeholder={placeholder}
          onChange={(e) => { setDraft(e.target.value); grow(); }}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} />
        <button type="submit" className="ui-btn ui-btn-primary ui-btn-md is-square ui-chat-send" disabled={!draft.trim() || busy} aria-label="Send">
          <span className="ui-btn-label"><Icon.send /></span>
        </button>
      </form>
    </div>
  );
}
