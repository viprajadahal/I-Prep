from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from app.database import Base
from sqlalchemy.orm import relationship

user = relationship("User", back_populates="reading_attempts")

class ReadingPassage(Base):
    __tablename__ = "reading_passages"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    passage_text = Column(Text, nullable=False)
    difficulty = Column(String, nullable=True)  # "easy", "medium", "hard"
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ReadingQuestion(Base):
    __tablename__ = "reading_questions"

    id = Column(Integer, primary_key=True, index=True)
    passage_id = Column(Integer, ForeignKey("reading_passages.id"), nullable=False)
    question_type = Column(String, nullable=False)  # "mcq", "true_false_ng", "fill_blank", "matching"
    question_text = Column(Text, nullable=False)
    options = Column(JSONB, nullable=True)          # for MCQ/matching: choices
    correct_answer = Column(JSONB, nullable=False)  # flexible: string, list, or dict depending on type


class ReadingAttempt(Base):
    __tablename__ = "reading_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    passage_id = Column(Integer, ForeignKey("reading_passages.id"), nullable=False)
    answers = Column(JSONB, nullable=False)   # {question_id: user_answer}
    score = Column(Integer, nullable=True)
    total_questions = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    skill_type = Column(String, nullable=True)  # "detail", "inference", "vocabulary", "main_idea"