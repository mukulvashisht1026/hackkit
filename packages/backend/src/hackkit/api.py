"""Generic endpoints the frontend (or curl) can use out of the box. Mount with create_app() or include `router` yourself."""
import tempfile
from pathlib import Path

import pandas as pd
from fastapi import APIRouter, File, HTTPException, UploadFile
from pydantic import BaseModel

from .analytics import anomaly
from .core.llm import ask, LLMNotConfigured
from .ingest import loaders, partners
from .retrieval.rag import answer_question
from .retrieval.store import DocStore, chunk_text

router = APIRouter()
store = DocStore()
TABLES: dict[str, pd.DataFrame] = {}


class Prompt(BaseModel):
    prompt: str
    system: str = ""


class Query(BaseModel):
    question: str
    k: int = 5


class UrlIn(BaseModel):
    url: str


class SeriesIn(BaseModel):
    values: list[float]
    method: str = "ewma"  # ewma | cusum | zscore


@router.get("/health")
def health():
    return {"ok": True, "docs": store.count(), "tables": list(TABLES)}


@router.post("/llm")
def llm(body: Prompt):
    try:
        return {"text": ask(body.prompt, body.system)}
    except LLMNotConfigured as e:
        raise HTTPException(400, str(e))


@router.post("/ingest/file")
async def ingest_file(file: UploadFile = File(...)):
    """Upload CSV/XLSX (becomes a queryable table) or PDF/PPTX/HTML/TXT (becomes searchable text)."""
    suffix = Path(file.filename or "x").suffix.lower()
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
    if suffix in {".csv", ".xlsx", ".xls", ".parquet"}:
        df = loaders.load_table(tmp.name)
        name = Path(file.filename).stem
        TABLES[name] = df
        return {"kind": "table", "name": name, "rows": len(df), "columns": list(df.columns)}
    chunks = [c for page in loaders.load_any_text(tmp.name) for c in chunk_text(page)]
    n = store.add_many(chunks, {"source": file.filename})
    return {"kind": "text", "chunks": n}


@router.post("/ingest/url")
def ingest_url(body: UrlIn):
    text = loaders.fetch_url(body.url)
    n = store.add_many(chunk_text(text), {"source": body.url})
    return {"chunks": n}


@router.post("/ask")
def ask_docs(body: Query):
    try:
        return answer_question(store, body.question, body.k)
    except LLMNotConfigured as e:
        raise HTTPException(400, str(e))


@router.get("/tables/{name}")
def table_preview(name: str, limit: int = 50):
    if name not in TABLES:
        raise HTTPException(404, "unknown table")
    return TABLES[name].head(limit).to_dict(orient="records")


@router.post("/tables/sql")
def table_sql(q: dict):
    try:
        return loaders.sql(TABLES, q["query"]).to_dict(orient="records")
    except Exception as e:  # surface SQL errors to the UI
        raise HTTPException(400, str(e))


@router.post("/anomaly")
def anomaly_endpoint(body: SeriesIn):
    s = pd.Series(body.values)
    if body.method == "cusum":
        df = anomaly.cusum(s)
    elif body.method == "zscore":
        df = anomaly.zscore_anomalies(s)
    else:
        df = anomaly.ewma_control(s)
    return df.reset_index().to_dict(orient="records")


@router.post("/search/exa")
def exa(body: Query):
    try:
        return partners.exa_search(body.question, body.k)
    except RuntimeError as e:
        raise HTTPException(400, str(e))
