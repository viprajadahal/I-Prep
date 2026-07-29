import uuid
import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy import func
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

try:
    from pydub import AudioSegment
    import whisper
except ImportError:
    AudioSegment = None
    whisper = None

# --- DATABASE IMPORTS ---
from app.database import get_db
from app.models.user import User
from app.models.speak import SpeakingQuestion, SpeakingAttempt

router = APIRouter(
    prefix="/speaking",
    tags=["speaking"]
)

# Load AI model
try:
    model = whisper.load_model("tiny") if whisper else None
except Exception:
    model = None

# --- 1. SMART GET: Automatically pick question based on User's Level ---
@router.get("/get-next-test")
async def get_next_test(db: AsyncSession = Depends(get_db)):
    """
    Way 3: Automatically detects the user's level from the database 
    and returns a random question for that level.
    """
    # 1. Fetch User #1 (Hardcoded for now until Login is integrated)
    user_result = await db.execute(select(User).where(User.id == 1))
    user = user_result.scalar_one_or_none()
    
    if not user:
        # Fallback if no user exists in DB yet
        current_level = "Beginner"
    else:
        current_level = user.current_speaking_level

    # 2. Fetch random question matching that level
    statement = select(SpeakingQuestion).where(SpeakingQuestion.difficulty == current_level).order_by(func.random())
    result = await db.execute(statement)
    question = result.scalars().first()

    if not question:
        raise HTTPException(status_code=404, detail=f"No questions found for your level: {current_level}")
    
    return {
        "user_current_level": current_level,
        "question": question
    }

# --- 2. EVALUATE & ADAPT: Grade the voice and update User's Level ---
@router.post("/evaluate")
async def evaluate_speaking(
    question_id: int, 
    file: UploadFile = File(...), 
    db: AsyncSession = Depends(get_db)
):
    if not file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="Please upload an audio file.")

    unique_id = str(uuid.uuid4())
    filename = f"{unique_id}_{file.filename}"
    file_path = f"uploads/{filename}"

    if not os.path.exists("uploads"):
        os.makedirs("uploads")

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # A. Signal Processing & AI
        audio = AudioSegment.from_file(file_path)
        duration_sec = len(audio) / 1000.0

        result = model.transcribe(file_path)
        text = result.get("text", "")
        
        word_count = len(text.split())
        wpm = (word_count / duration_sec) * 60 if duration_sec > 0 else 0

        # B. IELTS scoring logic
        if wpm > 130: band = 7.5
        elif wpm > 100: band = 6.5
        else: band = 5.5

        # C. SAVE ATTEMPT TO DATABASE
        new_attempt = SpeakingAttempt(
            user_id=1, 
            question_id=question_id,
            audio_path=file_path,
            transcript=text,
            wpm=round(wpm, 2),
            estimated_band=band
        )
        db.add(new_attempt)

        # D. ADAPTIVE LOGIC: Update User Level (Way 3)
        user_result = await db.execute(select(User).where(User.id == 1))
        user = user_result.scalar_one_or_none()

        if user:
            old_level = user.current_speaking_level
            # Decide new level
            if band >= 7.5:
                user.current_speaking_level = "Advanced"
            elif band >= 6.0:
                user.current_speaking_level = "Intermediate"
            else:
                user.current_speaking_level = "Beginner"
            
            db.add(user) # Stage the user update

        # E. Final Commit
        await db.commit()
        await db.refresh(new_attempt)

        return {
            "attempt_id": new_attempt.id,
            "transcript": text,
            "wpm": round(wpm, 2),
            "band_score": band,
            "new_user_level": user.current_speaking_level if user else "Beginner"
        }

    except Exception as e:
        print(f"CRASH ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal Logic Error: {str(e)}")