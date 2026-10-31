# hackkit-backend

FastAPI building blocks for hackathons, importable as `hackkit`:

| Module | What it gives you |
|---|---|
| `hackkit.app` | `create_app(routers=[...])` — FastAPI app with CORS and the generic `/api` routes |
| `hackkit.api` | the generic router: `/health`, `/llm`, `/ingest/file`, `/ingest/url`, `/ask`, `/tables/{name}`, `/tables/sql`, `/anomaly`, `/search/exa` |
| `hackkit.core.llm` | `ask()`, `ask_structured(prompt, PydanticModel)` — Anthropic or any OpenAI-compatible endpoint, retries, disk cache |
| `hackkit.core.evidence` | `Evidenced[T]`, `Scored` — value + source + quote + confidence |
| `hackkit.ingest.loaders` | CSV/Excel/Parquet → DataFrame, PDF/PPTX/HTML/URL → text, `sql()` over DataFrames via DuckDB |
| `hackkit.ingest.partners` | Exa search, Context.dev scrape |
| `hackkit.retrieval` | `DocStore` (SQLite + TF-IDF, pluggable embedder), `answer_question()` with citations |
| `hackkit.analytics.anomaly` | robust z-score, EWMA, CUSUM, Fisher test with min-n guard, Benjamini-Hochberg, Isolation Forest, forecast |
| `hackkit.hardware.io` | serial, MQTT, fake sensor stream |

## Install

```bash
pip install "hackkit-backend[all] @ git+https://github.com/mukulvashisht1026/hackkit.git#subdirectory=packages/backend"
# pin a release:  ...hackkit.git@v0.2.0#subdirectory=packages/backend
```

Extras: `llm` (anthropic, openai), `docs` (pypdf, python-pptx, openpyxl), `hardware` (pyserial, paho-mqtt), `server` (uvicorn), `all`, `dev` (pytest).
The core install is enough for analytics, retrieval and SQL; optional imports are loaded lazily.

## Use

```python
# main.py
from fastapi import APIRouter
from hackkit.app import create_app
from hackkit.core.llm import ask

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
