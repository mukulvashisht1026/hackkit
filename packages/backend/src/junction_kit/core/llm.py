"""LLM wrapper: structured (schema-validated) output, retries, caching, provider switch.

    from app.core.llm import ask, ask_structured
    text = ask("Summarise this", system="Be brief")
    obj  = ask_structured("Extract fields", MySchema)   # returns a MySchema instance

Anthropic is the default. Set LLM_PROVIDER=openai (+ OPENAI_BASE_URL) to use any
OpenAI-compatible endpoint, e.g. a Verda- or Featherless-hosted open model.
"""
import json
import time
from typing import Type, TypeVar

from pydantic import BaseModel

from .. import config
from .cache import cached, key_for

T = TypeVar("T", bound=BaseModel)


class LLMNotConfigured(RuntimeError):
    pass


def _anthropic():
    if not config.ANTHROPIC_API_KEY:
        raise LLMNotConfigured("Set ANTHROPIC_API_KEY in .env")
    import anthropic

    return anthropic.Anthropic(api_key=config.ANTHROPIC_API_KEY)


def _openai():
    if not config.OPENAI_API_KEY:
        raise LLMNotConfigured("Set OPENAI_API_KEY in .env")
    import openai

    kwargs = {"api_key": config.OPENAI_API_KEY}
    if config.OPENAI_BASE_URL:
        kwargs["base_url"] = config.OPENAI_BASE_URL
    return openai.OpenAI(**kwargs)


def _retry(fn, attempts: int = 3):
    for i in range(attempts):
        try:
            return fn()
        except LLMNotConfigured:
            raise
        except Exception:
            if i == attempts - 1:
                raise
            time.sleep(1.5 * (i + 1))


def ask(prompt: str, system: str = "", max_tokens: int = 1500, use_cache: bool = True) -> str:
    def call() -> str:
        if config.LLM_PROVIDER == "openai":
            msgs = ([{"role": "system", "content": system}] if system else []) + [
                {"role": "user", "content": prompt}
            ]
            r = _retry(lambda: _openai().chat.completions.create(
                model=config.OPENAI_MODEL, messages=msgs, max_tokens=max_tokens))
            return r.choices[0].message.content or ""
        r = _retry(lambda: _anthropic().messages.create(
            model=config.ANTHROPIC_MODEL, max_tokens=max_tokens, system=system or None,
            messages=[{"role": "user", "content": prompt}]))
        return "".join(b.text for b in r.content if b.type == "text")

    if not use_cache:
        return call()
    return cached(key_for("ask", config.LLM_PROVIDER, prompt, system), call)


def ask_structured(prompt: str, schema: Type[T], system: str = "", max_tokens: int = 2000,
                   use_cache: bool = True) -> T:
    """Force the model to return JSON matching a pydantic schema."""
    json_schema = schema.model_json_schema()

    def call() -> dict:
        if config.LLM_PROVIDER == "openai":
            sys_msg = (system + "\n" if system else "") + "Reply ONLY with JSON matching: " + json.dumps(json_schema)
            r = _retry(lambda: _openai().chat.completions.create(
                model=config.OPENAI_MODEL, max_tokens=max_tokens,
                response_format={"type": "json_object"},
                messages=[{"role": "system", "content": sys_msg}, {"role": "user", "content": prompt}]))
            return json.loads(r.choices[0].message.content or "{}")
        tool = {"name": "return_result", "description": "Return the structured result.",
                "input_schema": json_schema}
        r = _retry(lambda: _anthropic().messages.create(
            model=config.ANTHROPIC_MODEL, max_tokens=max_tokens, system=system or None,
            tools=[tool], tool_choice={"type": "tool", "name": "return_result"},
            messages=[{"role": "user", "content": prompt}]))
        for b in r.content:
            if b.type == "tool_use":
                return b.input
        raise RuntimeError("Model returned no structured result")

    data = call() if not use_cache else cached(
        key_for("struct", config.LLM_PROVIDER, prompt, system, json_schema), call)
    return schema.model_validate(data)
