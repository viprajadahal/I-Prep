from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import Optional, Any

# ---- Passage schemas ----

class PassageResponse(BaseModel):
    id: int
    title: str
    passage_text: str
    difficulty: Optional[str] = None

    class Config:
        from_attributes = True


# ---- Question schemas (no correct_answer exposed to user) ----

class QuestionResponse(BaseModel):
    id: int
    question_type: str
    question_text: str
    options: Optional[Any] = None
    skill_type: Optional[str] = None

    class Config:
        from_attributes = True


class QuestionResult(BaseModel):
    question_id: int
    user_answer: str
    correct_answer: Any
    is_correct: bool
    skill_type: Optional[str] = None

    class Config:
        from_attributes = True

class PassageWithQuestions(PassageResponse):
    questions: list[QuestionResponse] = []


# ---- Submission schemas ----
class AnswerSubmit(BaseModel):
    question_id: int
    answer: str

    @field_validator("answer")
    @classmethod
    def answer_not_too_long(cls, v):
        # only enforce word limit for genuinely long inputs
        # MCQ answers can be full sentences, fill_blank is typically 1-3 words
        # hard cap at 50 words to catch accidental essay submissions only
        word_count = len(v.strip().split())
        if word_count > 50:
            raise ValueError("Answer exceeds maximum allowed word count.")
        return v


class ReadingSubmit(BaseModel):
    passage_id: int
    answers: list[AnswerSubmit]


# ---- Result schemas ----

class SkillBreakdown(BaseModel):
    skill_type: str
    correct: int
    total: int


class ReadingResultResponse(BaseModel):
    id: int
    passage_id: int
    score: int
    total_questions: int
    skill_breakdown: list[SkillBreakdown]
    question_results: list[QuestionResult]
    created_at: datetime

    class Config:
        from_attributes = True