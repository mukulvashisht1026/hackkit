# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Hackathon starter monorepo (Junction 2026). Generic building blocks; the demo UI is meant to be replaced with challenge-specific work. `docs/PLAYBOOKS.md` maps likely partner challenges to the modules to start from; `demo/DEMO_SCRIPT.md` is the pitch outline.

- `apps/api` — FastAPI backend (Python, venv at repo-root `.venv`)
- `apps/web` — React 18 + Vite + TypeScript + Recharts
- `demo/seed_data.py` — writes `data/demo_timeseries.csv` (drift demo data)

## Commands

All `make` targets run from repo root and activate `.venv` themselves.

```bash
make setup     # .venv + editable backend package, npm workspace install, cp .env.example .env
make api       # uvicorn --reload on :8000 (OpenAPI UI at /docs)
make web       # vite dev server on :5173, proxies /api -> :8000
make test      # pytest in packages/backend, then apps/api
make seed      # generate demo time series
make build     # build @junction-kit/ui (dist/) then the web app
make release-ui  # build packages/ui and force-push it to the ui-dist branch (+ ui-v<version> tag) for git installs
docker compose up --build   # api :8000, web (nginx) :8080
```

Single test: `. .venv/bin/activate && cd packages/backend && python -m pytest tests/test_core.py::test_health -q`

Frontend type-check + build: `npm run build` from the root (UI package, then `tsc --noEmit` + vite for apps/web). No linter configured.

Other projects install the packages from GitHub: `npm i git+https://github.com/mukulvashisht1026/junction-kit.git#ui-dist` and `pip install "junction-kit-backend[all] @ git+https://github.com/mukulvashisht1026/junction-kit.git#subdirectory=packages/backend"`. Bump `version` in `packages/ui/package.json` / `packages/backend/pyproject.toml` when releasing.

## Architecture

**Monorepo layout** — `packages/backend` is the pip package `junction-kit-backend` (import `junction_kit`); `packages/ui` is the npm package `@junction-kit/ui`; `apps/api` and `apps/web` are the starter apps that consume them. Root `package.json` defines npm workspaces (`packages/ui`, `apps/web`); `make setup` installs the backend editable (`pip install -e "packages/backend[all,dev]"`).

**Config** — `junction_kit/config.py` loads the nearest `.env` walking up from the working directory (`find_dotenv(usecwd=True)`) and is the single source of settings. `DATA_DIR` defaults to `data/` beside that `.env` (`/data` in Docker); `data/cache/` and `data/docs.sqlite` live there.

**LLM layer** (`core/llm.py`) — all model calls go through `ask()` / `ask_structured(prompt, PydanticSchema)`. Provider switch via `LLM_PROVIDER=anthropic|openai` (openai = any OpenAI-compatible endpoint via `OPENAI_BASE_URL`). Structured output uses Anthropic forced tool-use (`return_result` tool with the schema as `input_schema`) or OpenAI JSON mode. Retries built in; missing keys raise `LLMNotConfigured`, which routers map to HTTP 400.

**Caching** — LLM responses are cached on disk by default (`core/cache.py`, sha256 of provider+prompt+system[+schema]) for deterministic demos. Changing a prompt busts the cache; pass `use_cache=False` or delete `data/cache/` to force fresh calls.

**Evidence pattern** (`core/evidence.py`) — `Evidenced[T]` (value, source, quote, confidence) and `Scored` are the intended shape for every AI-produced field. Convention: leave `value=None` / confidence 0 rather than guess.

**Routing** — `apps/api/app/main.py` calls `junction_kit.app.create_app(routers=[...])`, which mounts the generic router (`junction_kit/api.py`) plus the starter's own routers under `/api`. Add challenge-specific routes in `apps/api/app/routers/` rather than editing the package. State in `api.py` is module-global: `store = DocStore()` (persistent SQLite) and `TABLES: dict[str, DataFrame]` (in-memory, lost on restart).

**Ingestion flow** — `POST /api/ingest/file`: tabular files (csv/xlsx/xls/parquet) become a DataFrame in `TABLES` keyed by filename stem, queryable via DuckDB SQL (`/api/tables/sql`, `loaders.sql`). Everything else goes through `loaders.load_any_text` → `chunk_text` (900 chars, 150 overlap) → `DocStore`.

**Retrieval** (`retrieval/`) — `DocStore` refits TF-IDF over all rows on every `search()` (fine for hackathon scale, offline). Swap embeddings by passing a custom `Embedder`; keep the `search()` interface. `rag.answer_question` does grounded Q&A via `ask_structured` returning `cited_ids` + `insufficient_evidence`.

**Analytics** (`analytics/anomaly.py`) — robust z-score, EWMA control chart, CUSUM, Fisher test with `min_n` guard (returns `insufficient_data`), Benjamini-Hochberg, Isolation Forest, linear forecast. `/api/anomaly` exposes ewma/cusum/zscore.

**Partners / hardware** — `ingest/partners.py` (Exa, Context.dev; endpoints unverified, check current docs) and `hardware/io.py` (serial, MQTT, `fake_sensor` for demos without hardware). Optional deps are imported lazily inside functions.

**UI kit** (`packages/ui/src/`, import from `"@junction-kit/ui"`; apps/web resolves it to TS source via the `source` export condition set in `vite.config.ts` and `tsconfig.json` `customConditions`, so no UI build is needed in dev; full usage guide in `docs/UI_KIT.md`, keep it in sync when props change) — dependency-free component library (Button, Navbar, SearchBar/CommandPalette, Chat, Field/Toggle/Slider/FileDrop, Card/StatCard/Tabs/Accordion/Stepper, Toast/Modal/Progress, Hero/Background, SVG charts in `Charts.tsx`, canvas force graph in `EntityGraph.tsx`). One markup, three skins: wrap in `<ThemeCtx.Provider value="dreamy"|"depth"|"pixel">` plus `<div className="ui ui-dreamy">` / `ui-depth` / `ui-pixel`; all styling is token-driven in `ui.css`. Modals/toasts portal to `<body>` and re-apply the theme class. Animations obey `prefers-reduced-motion` unless `MotionCtx` forces them (`.is-motion` / `.is-still`). Chart series colors are `--s1..--s4` per theme, an order validated for colour-blind separation; assign by series position, max 4 series (3 for scatter/graph groups, which also get distinct marker shapes), extra donut slices fold into "Other". The pixel skin (`.ui-pixel` block in `ui.css`, extras in `Pixel.tsx`) uses `steps()` timing via `--spring`/`--ease`, forces square corners, and adds `GameLayer` (clicks on buttons/links earn coins; elements marked `data-coin` opt out). Showcase lives at `#/demo` (dreamy), `#/demo/3d` (3D) and `#/demo/pixel` (pixel) via the hash router in `src/router.ts` + `main.tsx`.

**Frontend** — `src/api.ts` `api(path, body?, form?)` prefixes `/api`: no body → GET, JSON body or FormData → POST. Dev uses the Vite proxy; prod uses `nginx.conf` proxying `/api/` to the `api` compose service. Panels in `src/components/` map 1:1 to endpoints (upload, ask, SQL, anomaly chart).

## Tests

`packages/backend/tests/test_core.py` uses `TestClient(create_app())`; `apps/api/tests/test_app.py` checks the starter wiring. Both hit the real app — note it shares the module-level `DocStore` at `data/docs.sqlite` and `TABLES`. Use `DocStore(str(tmp_path / ...))` for isolated store tests. Tests do not call the LLM.
