"""Tiny on-disk JSON cache so reruns and demos are fast, cheap and deterministic."""
import hashlib
import json
from typing import Any, Callable

from ..config import CACHE_DIR


def key_for(*parts: Any) -> str:
    raw = json.dumps(parts, sort_keys=True, default=str)
    return hashlib.sha256(raw.encode()).hexdigest()[:32]


def cached(key: str, fn: Callable[[], Any]) -> Any:
    path = CACHE_DIR / f"{key}.json"
    if path.exists():
        return json.loads(path.read_text())
    value = fn()
    path.write_text(json.dumps(value, default=str))
    return value
