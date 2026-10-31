"""Thin clients for partner APIs (Exa, Context.dev). Endpoints follow their public docs at the
time of writing; check the docs on the day and adjust if a field changed. Each returns plain dicts.
"""
import httpx

from .. import config


def exa_search(query: str, num_results: int = 5, with_text: bool = True) -> list[dict]:
    if not config.EXA_API_KEY:
        raise RuntimeError("Set EXA_API_KEY in .env")
    body = {"query": query, "numResults": num_results}
    if with_text:
        body["contents"] = {"text": True}
    r = httpx.post("https://api.exa.ai/search", json=body, timeout=30,
                   headers={"x-api-key": config.EXA_API_KEY})
    r.raise_for_status()
    return r.json().get("results", [])


def context_dev_scrape(url: str) -> dict:
    """Scrape a URL to LLM-ready markdown via Context.dev (handles JS rendering / anti-bot)."""
    if not config.CONTEXT_DEV_API_KEY:
        raise RuntimeError("Set CONTEXT_DEV_API_KEY in .env")
    r = httpx.get("https://api.context.dev/v1/web/scrape/markdown", params={"url": url}, timeout=60,
                  headers={"Authorization": f"Bearer {config.CONTEXT_DEV_API_KEY}"})
    r.raise_for_status()
    return r.json()
