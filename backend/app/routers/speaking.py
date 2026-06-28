import uuid #for unique naming
import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException # Added HTTPException here
from pydub import AudioSegment #for measuring time
import whisper

router = APIRouter(
    prefix="/speaking",
    tags=["speaking"]
)

# Load the AI model
model = whisper.load_model("tiny")

@router.post("/evaluate")
async def evaluate_speaking(file: UploadFile = File(...)):
    # 1. GENERATE UNIQUE FILENAME (The Smart Move)
    # This prevents users from overwriting each other's files
    unique_id = str(uuid.uuid4())
    filename = f"{unique_id}_{file.filename}"
    file_path = f"uploads/{filename}"

    if not os.path.exists("uploads"):
        os.makedirs("uploads")

    # 2. SAVE THE FILE
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # 3. MEASURE DURATION (Signal Processing)
        audio = AudioSegment.from_file(file_path)
        duration_seconds = len(audio) / 1000.0  # pydub works in milliseconds

        # 4. TRANSCRIBE (AI Part)
        result = model.transcribe(file_path)
        text = result["text"]
        
        # 5. CALCULATE WPM (The Fluency Metric)
        word_list = text.split()
        word_count = len(word_list)
        
        # Formula: (Words / Seconds) * 60
        wpm = (word_count / duration_seconds) * 60 if duration_seconds > 0 else 0

        # 6. SIMPLE BAND SCORE LOGIC (Based on WPM)
        # 120-150 is typical for a native speaker
        if wpm > 130: band = 8.0
        elif wpm > 100: band = 6.5
        elif wpm > 60: band = 5.0
        else: band = 4.0

        return {
            "filename": filename,
            "duration_sec": round(duration_seconds, 2),
            "word_count": word_count,
            "words_per_minute": round(wpm, 2),
            "estimated_fluency_band": band,
            "transcript": text
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis Error: {str(e)}")
