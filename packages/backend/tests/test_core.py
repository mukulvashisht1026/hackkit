import numpy as np
import pandas as pd
from fastapi.testclient import TestClient

from junction_kit.analytics import anomaly
from junction_kit.app import create_app
from junction_kit.retrieval.store import DocStore, chunk_text

client = TestClient(create_app())


def test_health():
    assert client.get("/api/health").json()["ok"] is True


def test_zscore_flags_spike():
    s = pd.Series([10, 10.2, 9.8, 10.1, 30, 9.9, 10.0])
    assert anomaly.zscore_anomalies(s)["anomaly"].iloc[4]


def test_ewma_detects_drift():
    rng = np.random.default_rng(0)
    s = pd.Series(np.concatenate([rng.normal(0, 1, 40), rng.normal(1.5, 1, 30)]))
    assert anomaly.ewma_control(s, baseline_n=40)["alarm"].iloc[40:].any()


def test_compare_proportions_guards_small_n():
    assert anomaly.compare_proportions(3, 10, 30, 100)["status"] == "insufficient_data"
    assert anomaly.compare_proportions(40, 60, 30, 100)["status"] == "ok"


def test_bh_correction():
    keep = anomaly.benjamini_hochberg([0.001, 0.2, 0.9, 0.003])
    assert keep == [True, False, False, True]


def test_docstore_search(tmp_path):
    s = DocStore(str(tmp_path / "t.sqlite"))
    s.add("Valio Aimo delivers fresh food to restaurants")
    s.add("Rokoko makes motion capture suits")
    assert "motion capture" in s.search("mocap suit animation motion capture")[0]["text"]


def test_chunking():
    assert len(chunk_text("a" * 2000)) >= 2


def test_sql_over_uploaded_table():
    csv = b"ward,n\nA,1\nB,2\n"
    r = client.post("/api/ingest/file", files={"file": ("t.csv", csv, "text/csv")})
    assert r.json()["rows"] == 2
    r = client.post("/api/tables/sql", json={"query": "select sum(n) as s from t"})
    assert r.json()[0]["s"] == 3
