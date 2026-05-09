from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, writing

app = FastAPI(title="IELTS Prep API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(writing.router)

@app.get("/")
async def root():
    return {"message": "IELTS API running"}