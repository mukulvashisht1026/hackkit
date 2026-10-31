.PHONY: setup api web test seed build build-ui release-ui
setup:
	python3 -m venv .venv && . .venv/bin/activate && pip install -e "packages/backend[all,dev]" -r apps/api/requirements.txt
	npm install
	cp -n .env.example .env || true
api:
	. .venv/bin/activate && cd apps/api && uvicorn app.main:app --reload --port 8000
web:
	npm run dev
test:
	. .venv/bin/activate && cd packages/backend && python -m pytest -q && cd ../../apps/api && python -m pytest -q
seed:
	. .venv/bin/activate && python demo/seed_data.py
build:
	npm run build
build-ui:
	npm run build:ui
# Push a built copy of packages/ui to the `ui-dist` branch so other projects can `npm i github:<owner>/<repo>#ui-dist`
release-ui:
	./scripts/release-ui.sh
