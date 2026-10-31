"""Central settings, read from environment / .env."""
import os
from pathlib import Path

from dotenv import find_dotenv, load_dotenv

# The nearest .env walking up from the working directory; data/ defaults to sit beside it.
_ENV_FILE = find_dotenv(usecwd=True)
load_dotenv(_ENV_FILE)
ROOT = Path(_ENV_FILE).parent if _ENV_FILE else Path.cwd()

DATA_DIR = Path(os.getenv("DATA_DIR", ROOT / "data"))
CACHE_DIR = DATA_DIR / "cache"
DATA_DIR.mkdir(parents=True, exist_ok=True)
CACHE_DIR.mkdir(parents=True, exist_ok=True)

LLM_PROVIDER = os.getenv("LLM_PROVIDER", "anthropic")  # anthropic | openai
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
ANTHROPIC_MODEL = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-5-5")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "")  # e.g. Verda / Featherless endpoints
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

# Optional partner APIs (leave empty if unused)
EXA_API_KEY = os.getenv("EXA_API_KEY", "")
CONTEXT_DEV_API_KEY = os.getenv("CONTEXT_DEV_API_KEY", "")
CALA_API_KEY = os.getenv("CALA_API_KEY", "")

MQTT_HOST = os.getenv("MQTT_HOST", "localhost")
MQTT_PORT = int(os.getenv("MQTT_PORT", "1883"))
SERIAL_PORT = os.getenv("SERIAL_PORT", "")
