"""Generate a realistic fake dataset so the demo never depends on live APIs or the real data.
Time-series with a planted slow drift + planted outlier, across several groups (wards/stores/sensors)."""
import numpy as np
import pandas as pd
from pathlib import Path

rng = np.random.default_rng(42)
out = Path(__file__).resolve().parents[1] / "data"
out.mkdir(exist_ok=True)

weeks = pd.date_range("2024-01-01", periods=120, freq="W")
rows = []
for group in ["A", "B", "C", "D"]:
    base = rng.uniform(0.1, 0.4)
    for i, w in enumerate(weeks):
        drift = 0.002 * max(0, i - 90) if group == "C" else 0   # planted slow drift in group C
        n = int(rng.integers(20, 80))
        p = min(0.95, base + drift + rng.normal(0, 0.02))
        rows.append({"week": w.date(), "group": group, "n": n, "positives": int(rng.binomial(n, p))})
df = pd.DataFrame(rows)
df.loc[df.sample(1, random_state=1).index, "positives"] *= 3            # planted outlier
df["rate"] = df["positives"] / df["n"]
df.to_csv(out / "demo_timeseries.csv", index=False)
print("wrote", out / "demo_timeseries.csv", len(df), "rows")
