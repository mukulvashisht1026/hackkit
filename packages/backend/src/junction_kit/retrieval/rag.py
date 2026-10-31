"""Grounded Q&A over the DocStore with citations."""
from pydantic import BaseModel

from ..core.llm import ask_structured
from .store import DocStore


class Answer(BaseModel):
    answer: str
    cited_ids: list[int] = []
    insufficient_evidence: bool = False


def answer_question(store: DocStore, question: str, k: int = 5) -> dict:
    hits = store.search(question, k)
    context = "\n\n".join(f"[{h['id']}] {h['text']}" for h in hits)
    res = ask_structured(
        f"Question: {question}\n\nSources:\n{context}\n\n"
        "Answer using ONLY the sources. Cite source ids in cited_ids. "
        "If the sources do not contain the answer, set insufficient_evidence=true.",
        Answer, system="You are a careful analyst. Never invent facts.")
    return {**res.model_dump(), "sources": hits}
