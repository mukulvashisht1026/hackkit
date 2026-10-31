# Hackkit

Hackathon monorepo: two reusable packages plus a starter app that uses them. Replace the demo UI with your challenge.

```
packages/ui        @hackkit/ui — Lumen UI kit: React components in 3 skins, SVG charts, canvas entity graph
packages/backend   hackkit-backend (import hackkit) — LLM wrapper, ingestion, RAG, anomaly detection, hardware I/O
apps/api           starter FastAPI app: create_app() from hackkit + your routes in app/routers/
apps/web           starter React app: original panels at /#/, component showcase at /#/demo, /#/demo/3d, /#/demo/pixel
demo/              seeded fake data + 2-minute demo script
docs/              UI_KIT.md (component guide), partner playbooks, problem-statement template
```

## Use the packages in another project

```bash
npm i git+https://github.com/mukulvashisht1026/hackkit.git#ui-dist
pip install "hackkit-backend[all] @ git+https://github.com/mukulvashisht1026/hackkit.git#subdirectory=packages/backend"
```

See `packages/ui/README.md` and `packages/backend/README.md`. After changing the UI package, run `make release-ui` to update the `ui-dist` branch.

## Run (5 minutes)
```bash
make setup            # venv + editable backend package, npm workspaces, copies .env.example to .env
# put ANTHROPIC_API_KEY (or OPENAI_* ) in .env
make seed             # writes data/demo_timeseries.csv
make api              # http://localhost:8000/docs
make web              # http://localhost:5173
make test
docker compose up --build   # alternative, web on :8080
```

## What is included
| Need | Where |
|---|---|
| Structured LLM output, retries, disk cache, provider switch (Anthropic / any OpenAI-compatible, e.g. hosted open models) | `packages/backend/src/hackkit/core/llm.py` |
| Evidence + confidence on every AI value | `core/evidence.py` |
| CSV/Excel/PDF/PPTX/HTML/URL loading, SQL via DuckDB | `ingest/loaders.py` |
| Exa search, Context.dev scrape (verify endpoints against current docs) | `ingest/partners.py` |
| Offline retrieval (SQLite + TF-IDF), grounded cited answers | `retrieval/` |
| Robust z-score, EWMA, CUSUM, Fisher test with min-n guard, Benjamini-Hochberg, Isolation Forest, baseline forecast | `analytics/anomaly.py` |
| Serial, MQTT, fake sensor stream | `hardware/io.py` |
| Generic endpoints | `hackkit/api.py` (`/api/ingest/file`, `/ask`, `/tables/sql`, `/anomaly`, `/llm`) |

## Before the event
- [ ] `make setup && make test` works on every teammate's laptop
- [ ] API keys in `.env`; one `ask()` call succeeds
- [ ] Partner API endpoints in `ingest/partners.py` checked against their docs
- [ ] `make seed` and the UI show the drift alarm
- [ ] Deploy target decided (Vercel + Railway, or `docker compose`)
- [ ] Read `docs/PLAYBOOKS.md`; agree roles (data, AI, UI, pitch)
