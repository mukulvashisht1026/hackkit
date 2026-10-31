import { useState } from "react";
import { api } from "../api";

export default function UploadPanel() {
  const [out, setOut] = useState<any>(null);
  const [url, setUrl] = useState("");
  const [err, setErr] = useState("");
  const run = async (f: () => Promise<any>) => { setErr(""); try { setOut(await f()); } catch (e: any) { setErr(e.message); } };
  return (
    <div className="card">
      <h2>1. Ingest</h2>
      <input type="file" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; const fd = new FormData(); fd.append("file", f); run(() => api("/ingest/file", undefined, fd)); }} />
      <div className="row"><input type="text" placeholder="https://… page to index" value={url} onChange={(e) => setUrl(e.target.value)} />
        <button onClick={() => run(() => api("/ingest/url", { url }))}>Fetch</button></div>
      {out && <pre className="src">{JSON.stringify(out, null, 1)}</pre>}
      {err && <div className="err">{err}</div>}
      <div className="src">CSV/XLSX → SQL table · PDF/PPTX/HTML/TXT → searchable text</div>
    </div>
  );
}
