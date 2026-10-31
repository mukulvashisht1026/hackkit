import AskPanel from "./components/AskPanel";
import UploadPanel from "./components/UploadPanel";
import SqlPanel from "./components/SqlPanel";
import AnomalyChart from "./components/AnomalyChart";

export default function App() {
  return (
    <div className="wrap">
      <h1>Junction starter</h1>
      <div className="sub">Upload data → ask questions with citations → query tables → spot anomalies. Replace panels with your challenge UI. · <a href="#/demo" style={{ color: "var(--acc)" }}>UI kit demo →</a></div>
      <div className="grid">
        <UploadPanel />
        <AskPanel />
        <SqlPanel />
        <AnomalyChart />
      </div>
    </div>
  );
}
