# junction-kit-backend

FastAPI building blocks for hackathons, importable as `junction_kit`:

| Module | What it gives you |
|---|---|
| `junction_kit.app` | `create_app(routers=[...])` — FastAPI app with CORS and the generic `/api` routes |
| `junction_kit.api` | the generic router: `/health`, `/llm`, `/ingest/file`, `/ingest/url`, `/ask`, `/tables/{name}`, `/tables/sql`, `/anomaly`, `/search/exa` |
| `junction_kit.core.llm` | `ask()`, `ask_structured(prompt, PydanticModel)` — Anthropic or any OpenAI-compatible endpoint, retries, disk cache |
| `junction_kit.core.evidence` | `Evidenced[T]`, `Scored` — value + source + quote + confidence |
| `junction_kit.ingest.loaders` | CSV/Excel/Parquet → DataFrame, PDF/PPTX/HTML/URL → text, `sql()` over DataFrames via DuckDB |
| `junction_kit.ingest.partners` | Exa search, Context.dev scrape |
| `junction_kit.retrieval` | `DocStore` (SQLite + TF-IDF, pluggable embedder), `answer_question()` with citations |
| `junction_kit.analytics.anomaly` | robust z-score, EWMA, CUSUM, Fisher test with min-n guard, Benjamini-Hochberg, Isolation Forest, forecast |
| `junction_kit.hardware.io` | serial, MQTT, fake sensor stream |

## Install

```bash
pip install "junction-kit-backend[all] @ git+https://github.com/mukulvashisht1026/junction-kit.git#subdirectory=packages/backend"
# pin a release:  ...junction-kit.git@v0.1.0#subdirectory=packages/backend
```

Extras: `llm` (anthropic, openai), `docs` (pypdf, python-pptx, openpyxl), `hardware` (pyserial, paho-mqtt), `server` (uvicorn), `all`, `dev` (pytest).
The core install is enough for analytics, retrieval and SQL; optional imports are loaded lazily.

## Use

```python
# main.py
from fastapi import APIRouter
from junction_kit.app import create_app
from junction_kit.core.llm import ask

mine = APIRouter()

@mine.get("/summary")
def summary(topic: str):
    return {"text": ask(f"Summarise {topic} in one line")}

app = create_app(routers=[mine])   # serves /api/summary plus all generic routes
```

`uvicorn main:app --reload`

## Configuration

Read from environment variables or the nearest `.env` found by walking up from the working directory:
`LLM_PROVIDER` (anthropic | openai), `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`, `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENAI_MODEL`,
`EXA_API_KEY`, `CONTEXT_DEV_API_KEY`, `SERIAL_PORT`, `MQTT_HOST`, `MQTT_PORT`.
`DATA_DIR` (SQLite doc store + LLM cache) defaults to `data/` next to that `.env`, or under the working directory.

## Test

`pip install -e ".[all,dev]" && pytest`
