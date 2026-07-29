from pathlib import Path

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routers import auth, writing_router, writing_compat, writing_assistant_router

STATIC_DIR = Path(__file__).resolve().parent.parent / "static"

app = FastAPI(title="IELTS Prep API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(writing_router.router)
app.include_router(writing_compat.router)
app.include_router(writing_assistant_router.router)

# Main-branch routers (commented out — dependencies not yet available)
# from app.routers import writing, speaking, listening, reading, analytics
# app.include_router(writing.router)
# app.include_router(speaking.router)
# app.include_router(listening.router)
# app.include_router(reading.router)
# app.include_router(analytics.router)

if STATIC_DIR.is_dir():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


@app.get("/")
async def root():
    return {"message": "IELTS API running"}
