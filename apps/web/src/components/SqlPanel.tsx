import { useState } from "react";
import { api } from "../api";

export default function SqlPanel() {
  const [q, setQ] = useState("select * from your_table limit 10");
  const [rows, setRows] = useState<any[]>([]);
  const [err, setErr] = useState("");
  const go = async () => { setErr(""); try { setRows(await api("/tables/sql", { query: q })); } catch (e: any) { setErr(e.message); } };
  const cols = rows[0] ? Object.keys(rows[0]) : [];
  return (
    <div className="card">
      <h2>3. SQL over uploaded tables</h2>
      <textarea rows={3} value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="row"><button onClick={go}>Run</button></div>
      {err && <div className="err">{err}</div>}
      {rows.length > 0 && <div style={{ overflow: "auto", maxHeight: 220 }}><table><thead><tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}>{cols.map((c) => <td key={c}>{String(r[c])}</td>)}</tr>)}</tbody></table></div>}
    </div>
  );
}
