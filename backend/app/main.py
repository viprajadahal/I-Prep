from dotenv import load_dotenv
load_dotenv()  # This loads the .env file from the current folder
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, writing, speaking, listening, reading, analytics 

app = FastAPI(title="IELTS Prep API", version="1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
app.include_router(writing.router)
app.include_router(speaking.router)
app.include_router(listening.router)
app.include_router(reading.router)
app.include_router(analytics.router)

@app.get("/")
async def root():
    return {"message": "IELTS API running"}