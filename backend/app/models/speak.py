from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

# 1. THE QUESTION BANK (Robot's part)
class SpeakingQuestion(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    text: str                               # The question text
    examiner_audio_path: str                # Link to MP3 of robot asking
    difficulty: str                         # Beginner/Intermediate/Advanced
    category: str = "General"

# This defines the table in your Database(students part)
class SpeakingAttempt(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = None           # Link to the user
    audio_path: str                         # Where the file is saved
    transcript: str                         # What the AI heard
    wpm: float                              # Fluency speed
    estimated_band: float                   # Score
    created_at: datetime = Field(default_factory=datetime.utcnow)
class ListeningTest(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    audio_path: str
    difficulty: str
    questions_json: str
    answers_json: str
