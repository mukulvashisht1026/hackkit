# Partner playbooks (predicted, not official)

Junction had not published the 2026 challenge briefs when this was written. These map likely challenge types to the generic tools in this repo. Re-check on the day.

| Partner type | Likely task | Start from |
|---|---|---|
| Exa, Context.dev, Cala | Agent that turns live web data into cited answers or monitoring | `ingest/partners.py`, `retrieval/rag.py`, `core/evidence.py` |
| AfterQuery | Expert-grade datasets / RL environments with quality checks | `core/llm.py` (`ask_structured`), `analytics/anomaly.py` for QA on data |
| MariaDB | App using vector search on messy data | `retrieval/store.py` (swap SQLite for MariaDB vectors, keep `search()`) |
| Hostinger | Idea to live website with AI | `core/llm.py`, `apps/web` |
| Valio Aimo, Bahn Express | Forecast / optimise orders, pricing, routing, fraud | `analytics/anomaly.py` (`linear_forecast`, `isolation_forest_flags`), `ingest/loaders.py` (`sql`) |
| S-Pankki | Personal finance assistant, anomaly / fraud detection | `analytics/anomaly.py`, `core/evidence.py` |
| AstraZeneca, Tyks-style health | Make clinical/research data decision-ready; surveillance | `analytics/anomaly.py` (`compare_proportions`, `benjamini_hochberg`, EWMA), `ingest/loaders.py` |
| City of Espoo, Aalto | Resident services, campus / research tools | `retrieval/rag.py`, `apps/web` |
| Ignite Next, Redstone-style | Startup scouting: assess readiness, thesis fit, match to investors, next actions | `core/evidence.py` (`Evidenced`, `Scored`), `core/llm.py`, `ingest/loaders.py` |
| Intel, NVIDIA, Verda | Edge / GPU workloads | `core/llm.py` with `LLM_PROVIDER=openai` + `OPENAI_BASE_URL` for hosted open models |
| Arduino, Rokoko | Sensors, robots, motion data | `hardware/io.py` (serial, MQTT, `fake_sensor`) |

## Pattern that matched both Turku briefs
1. Say in one sentence what manual workflow you replace.
2. Not a plain dashboard or summariser: add something that connects data to an action (alerts, ranking, next step).
3. Show evidence and confidence for every AI output (`Evidenced`).
4. Handle gaps honestly: `null` + "not found" instead of guessing; refuse to judge below a minimum sample size.
5. Cache everything so the demo is deterministic.

## Problem-statement template
> **Who:** [role] at [org]. **Today:** they [manual workflow], which is [slow / coarse / inconsistent] because [reason]. **We build:** a [tool] that [input] → [insight] → [recommended action], continuously updated. **Success:** [metric judges can see in the demo].
