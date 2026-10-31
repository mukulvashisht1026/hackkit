from junction_kit.app import create_app

from .routers import challenge

# Generic routes (/api/health, /ingest/*, /ask, /tables/*, /anomaly, /llm, /search/exa) come from the
# junction_kit package; put challenge-specific routes in app/routers/ and list them here.
app = create_app(routers=[challenge.router])
