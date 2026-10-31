import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceDot } from "recharts";
import { api } from "../api";

// demo series: stable, then a slow upward drift (EWMA catches it, single-point rules don't)
const demo = Array.from({ length: 70 }, (_, i) => 10 + Math.sin(i) * 0.6 + (i > 40 ? (i - 40) * 0.08 : 0));

export default function AnomalyChart() {
  const [data, setData] = useState<any[]>([]);
  const [err, setErr] = useState("");
  useEffect(() => { api("/anomaly", { values: demo, method: "ewma" }).then(setData).catch((e) => setErr(e.message)); }, []);
  return (
    <div className="card">
      <h2>4. Drift / anomaly detection (EWMA)</h2>
      {err && <div className="err">{err}</div>}
      <div style={{ height: 220 }}>
        <ResponsiveContainer><LineChart data={data}>
          <CartesianGrid stroke="#2a2f3a" /><XAxis dataKey="index" stroke="#8b93a7" /><YAxis stroke="#8b93a7" domain={["auto", "auto"]} /><Tooltip />
          <Line dataKey="value" stroke="#8b93a7" dot={false} /><Line dataKey="ewma" stroke="#6ea8fe" dot={false} strokeWidth={2} />
          <Line dataKey="upper" stroke="#ff6b6b" dot={false} strokeDasharray="4 4" />
          {data.filter((d) => d.alarm).slice(0, 1).map((d) => <ReferenceDot key="a" x={d.index} y={d.ewma} r={6} fill="#ff6b6b" />)}
        </LineChart></ResponsiveContainer>
      </div>
    </div>
  );
}
