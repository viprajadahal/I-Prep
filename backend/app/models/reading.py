from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class ReadingPassage(Base):
    __tablename__ = "reading_passages"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    passage_text = Column(Text, nullable=False)
    difficulty = Column(String, nullable=True)  # "easy", "medium", "hard"
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    questions = relationship("ReadingQuestion", backref="passage")


class ReadingQuestion(Base):
    __tablename__ = "reading_questions"

    id = Column(Integer, primary_key=True, index=True)
    passage_id = Column(Integer, ForeignKey("reading_passages.id"), nullable=False)
    question_type = Column(String, nullable=False)  # "mcq", "true_false_ng", "fill_blank", "matching"
    question_text = Column(Text, nullable=False)
    options = Column(JSONB, nullable=True)          # for MCQ/matching: choices
    correct_answer = Column(JSONB, nullable=False)  # flexible: string, list, or dict
    skill_type = Column(String, nullable=True)      # "detail", "inference", "vocabulary", "main_idea"


class ReadingAttempt(Base):
    __tablename__ = "reading_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    passage_id = Column(Integer, ForeignKey("reading_passages.id"), nullable=False)
    score = Column(Integer, nullable=True)
    total_questions = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
    answer_records = relationship("ReadingAnswerRecord", backref="attempt")


class ReadingAnswerRecord(Base):
    __tablename__ = "reading_answer_records"

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("reading_attempts.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("reading_questions.id"), nullable=False)
    user_answer = Column(Text, nullable=False)
    is_correct = Column(Boolean, nullable=False)
    skill_type = Column(String, nullable=True) # denormalized copy for fast analytics queries
    question = relationship("ReadingQuestion") 