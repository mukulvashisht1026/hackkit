"""Challenge-specific routes. Served under /api alongside the generic ones."""
from fastapi import APIRouter

router = APIRouter(tags=["challenge"])


@router.get("/challenge/ping")
def ping():
    return {"ok": True}
