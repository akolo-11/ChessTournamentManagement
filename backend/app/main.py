from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import tournaments, matches

app = FastAPI(title="Chess Tournament API", version="0.1.0")

# CORS Vite (5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tournaments.router)
app.include_router(matches.router)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}