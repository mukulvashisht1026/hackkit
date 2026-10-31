"""Evidence + confidence pattern: every AI-produced value carries its source and a confidence.

Judges at past challenges rewarded 'why did it say that?'. Use Evidenced[...] for every
extracted/scored field, and leave value=None (confidence 0) instead of guessing.
"""
from typing import Generic, Optional, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class Evidenced(BaseModel, Generic[T]):
    value: Optional[T] = None
    source: Optional[str] = Field(None, description="Where it came from: url, file, slide, row")
    quote: Optional[str] = Field(None, description="Short supporting snippet")
    confidence: float = Field(0.0, ge=0, le=1)
    note: Optional[str] = None  # e.g. "not found", "conflict between deck and website"


class Scored(BaseModel):
    """A 1-9 (TRL/BRL style) or 0-100 score with reasoning."""
    score: Optional[float] = None
    reasoning: str = ""
    evidence: list[Evidenced[str]] = []
