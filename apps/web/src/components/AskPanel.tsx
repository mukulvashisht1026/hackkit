import { useState } from "react";
import { api } from "../api";

export default function AskPanel() {
  const [q, setQ] = useState("");
  const [res, setRes] = useState<any>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const go = async () => { setBusy(true); setErr(""); try { setRes(await api("/ask", { question: q })); } catch (e: any) { setErr(e.message); } setBusy(false); };
  return (
    <div className="card">
      <h2>2. Ask (grounded + cited)</h2>
      <textarea rows={3} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask about the uploaded documents…" />
      <div className="row"><button disabled={busy || !q} onClick={go}>{busy ? "Thinking…" : "Ask"}</button></div>
      {err && <div className="err">{err}</div>}
      {res && (<>
        <p>{res.answer} {res.insufficient_evidence && <span className="pill">insufficient evidence</span>}</p>
        {res.sources?.map((s: any) => (
          <div className="src" key={s.id}>{res.cited_ids?.includes(s.id) ? "★ " : ""}[{s.id}] {s.meta?.source} — {s.text.slice(0, 160)}…</div>
        ))}
      </>)}
    </div>
  );
}
