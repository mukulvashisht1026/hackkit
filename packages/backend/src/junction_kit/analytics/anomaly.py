"""Anomaly / deviation detection + simple forecasting helpers (time series and groups)."""
import numpy as np
import pandas as pd
from scipy import stats  # installed with scikit-learn


def zscore_anomalies(s: pd.Series, threshold: float = 3.0) -> pd.DataFrame:
    """Robust z-score (median/MAD). Returns rows flagged as anomalous."""
    med = s.median()
    mad = (s - med).abs().median() or 1e-9
    z = 0.6745 * (s - med) / mad
    return pd.DataFrame({"value": s, "z": z, "anomaly": z.abs() > threshold})


def ewma_control(s: pd.Series, lam: float = 0.2, L: float = 3.0, baseline_n: int | None = None) -> pd.DataFrame:
    """EWMA control chart: catches slow drifts that no single point reveals."""
    base = s.iloc[:baseline_n] if baseline_n else s
    mu, sigma = base.mean(), base.std(ddof=1) or 1e-9
    ew = s.ewm(alpha=lam, adjust=False).mean()
    n = np.arange(1, len(s) + 1)
    width = L * sigma * np.sqrt(lam / (2 - lam) * (1 - (1 - lam) ** (2 * n)))
    return pd.DataFrame({"value": s.values, "ewma": ew.values, "upper": mu + width,
                         "lower": mu - width, "alarm": (ew.values > mu + width) | (ew.values < mu - width)},
                        index=s.index)


def cusum(s: pd.Series, k: float = 0.5, h: float = 5.0) -> pd.DataFrame:
    """Two-sided CUSUM on standardised values."""
    z = (s - s.mean()) / (s.std(ddof=1) or 1e-9)
    hi = lo = 0.0
    out = []
    for v in z:
        hi, lo = max(0, hi + v - k), min(0, lo + v + k)
        out.append((hi, lo, hi > h or lo < -h))
    return pd.DataFrame(out, columns=["cusum_hi", "cusum_lo", "alarm"], index=s.index)


def compare_proportions(recent_pos: int, recent_n: int, base_pos: int, base_n: int, min_n: int = 30) -> dict:
    """Is the recent rate different from baseline? (e.g. resistance last 4 weeks vs last 12 months).
    Fisher exact test; refuses to judge below min_n so you never show noisy percentages."""
    if recent_n < min_n or base_n < min_n:
        return {"status": "insufficient_data", "recent_n": recent_n, "base_n": base_n}
    _, p = stats.fisher_exact([[recent_pos, recent_n - recent_pos], [base_pos, base_n - base_pos]])
    return {"status": "ok", "recent_rate": recent_pos / recent_n, "base_rate": base_pos / base_n, "p": float(p)}


def benjamini_hochberg(pvals: list[float], q: float = 0.05) -> list[bool]:
    """False-discovery control when testing many (ward x organism x drug) combinations."""
    p = np.asarray(pvals)
    order = np.argsort(p)
    ranked = p[order]
    thresh = q * (np.arange(1, len(p) + 1) / len(p))
    passed = ranked <= thresh
    cutoff = np.max(np.where(passed)[0]) if passed.any() else -1
    keep = np.zeros(len(p), dtype=bool)
    if cutoff >= 0:
        keep[order[: cutoff + 1]] = True
    return keep.tolist()


def isolation_forest_flags(df: pd.DataFrame, cols: list[str], contamination: float = 0.02) -> pd.Series:
    """Multivariate outliers (fraud-ish rows, odd sensor readings)."""
    from sklearn.ensemble import IsolationForest

    m = IsolationForest(contamination=contamination, random_state=0).fit(df[cols].fillna(0))
    return pd.Series(m.predict(df[cols].fillna(0)) == -1, index=df.index, name="outlier")


def linear_forecast(s: pd.Series, horizon: int = 4) -> list[float]:
    """Baseline trend forecast. Replace with statsmodels/prophet if you have time; judges like a baseline."""
    y = s.dropna().values
    x = np.arange(len(y))
    slope, intercept = np.polyfit(x, y, 1)
    return [float(intercept + slope * (len(y) + i)) for i in range(horizon)]
