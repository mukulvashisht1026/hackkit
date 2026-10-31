from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_generic_routes_mounted():
    assert client.get("/api/health").json()["ok"] is True


def test_challenge_route():
    assert client.get("/api/challenge/ping").json() == {"ok": True}
