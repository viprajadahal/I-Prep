import os
import logging
from dotenv import load_dotenv
load_dotenv()  # Load .env file from the current folder

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Import all models to ensure they're loaded before setting up relationships
from app.models import user, resource
from app.models import reading as reading_model
from app.models.user import setup_user_relationships

app = FastAPI(title="IELTS Prep API", version="1.0")

# Configure CORS - must be added before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

# Fix circular import issue with User and ReadingAttempt
setup_user_relationships()

from app.routers import auth, writing, speaking, listening, reading, analytics, study_resources

app.include_router(auth.router, prefix="/api/v1")
app.include_router(writing.router, prefix="/api/v1")
app.include_router(speaking.router, prefix="/api/v1")
app.include_router(listening.router, prefix="/api/v1")
app.include_router(reading.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1")
app.include_router(study_resources.router, prefix="/api/v1")

# Mount static files directory for serving uploads
os.makedirs("uploads/resources", exist_ok=True)
os.makedirs("uploads/videos", exist_ok=True)
os.makedirs("uploads/thumbnails", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/")
async def root():
    return {"message": "IELTS API running"}