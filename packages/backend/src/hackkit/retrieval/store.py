"""Zero-dependency-on-network retrieval: SQLite for storage, TF-IDF for ranking.

Works offline, instantly. To upgrade to dense embeddings, subclass `Embedder` (e.g. NVIDIA / OpenAI /
sentence-transformers) and pass it in; storage and API stay the same. For MariaDB's challenge, swap the
SQLite part for MariaDB vector columns and keep the `search()` interface.
"""
import json
import sqlite3
from typing import Optional

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer

from ..config import DATA_DIR


class Embedder:
    """Interface for pluggable embedders. Default TF-IDF is fit at query time."""

    def fit_transform(self, texts: list[str]):
        raise NotImplementedError

    def transform(self, texts: list[str]):
        raise NotImplementedError


class TfidfEmbedder(Embedder):
    def __init__(self):
        self.v = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), sublinear_tf=True)

    def fit_transform(self, texts):
        return self.v.fit_transform(texts)

    def transform(self, texts):
        return self.v.transform(texts)


class DocStore:
    def __init__(self, path: Optional[str] = None, embedder: Optional[Embedder] = None):
        self.db = sqlite3.connect(path or str(DATA_DIR / "docs.sqlite"), check_same_thread=False)
        self.db.execute("create table if not exists docs(id integer primary key, text text, meta text)")
        self.embedder = embedder or TfidfEmbedder()

    def add(self, text: str, meta: Optional[dict] = None) -> int:
        cur = self.db.execute("insert into docs(text, meta) values (?, ?)", (text, json.dumps(meta or {})))
        self.db.commit()
        return cur.lastrowid

    def add_many(self, chunks: list[str], meta: Optional[dict] = None) -> int:
        for i, c in enumerate(chunks):
            if c.strip():
                self.add(c, {**(meta or {}), "chunk": i})
        return len(chunks)

    def count(self) -> int:
        return self.db.execute("select count(*) from docs").fetchone()[0]

    def search(self, query: str, k: int = 5) -> list[dict]:
        rows = self.db.execute("select id, text, meta from docs").fetchall()
        if not rows:
            return []
        texts = [r[1] for r in rows]
        X = self.embedder.fit_transform(texts)
        q = self.embedder.transform([query])
        sims = (X @ q.T).toarray().ravel()
        top = np.argsort(-sims)[:k]
        return [{"id": rows[i][0], "text": rows[i][1], "meta": json.loads(rows[i][2]),
                 "score": float(sims[i])} for i in top if sims[i] > 0]


def chunk_text(text: str, size: int = 900, overlap: int = 150) -> list[str]:
    text = text.strip()
    if len(text) <= size:
        return [text] if text else []
    out, i = [], 0
    while i < len(text):
        out.append(text[i:i + size])
        i += size - overlap
    return out
