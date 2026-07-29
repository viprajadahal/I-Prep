from sqlalchemy import (
    Column, Integer, String, Text, Float, Boolean,
    DateTime, ForeignKey, Index
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class MockTest(Base):
    __tablename__ = "mock_tests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    duration_minutes = Column(Integer, nullable=False, default=165)
    difficulty = Column(String(50), nullable=False, default="Academic")
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    sections = relationship("MockSection", back_populates="test", cascade="all, delete-orphan", order_by="MockSection.section_order")
    attempts = relationship("TestAttempt", back_populates="test", cascade="all, delete-orphan")


class MockSection(Base):
    __tablename__ = "mock_sections"

    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("mock_tests.id", ondelete="CASCADE"), nullable=False)
    section_type = Column(String(50), nullable=False)
    section_order = Column(Integer, nullable=False)
    time_limit_minutes = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)

    test = relationship("MockTest", back_populates="sections")
    passages = relationship("MockPassage", back_populates="section", cascade="all, delete-orphan", order_by="MockPassage.passage_order")
    questions = relationship("MockQuestion", back_populates="section", cascade="all, delete-orphan", order_by="MockQuestion.question_order")

    __table_args__ = (
        Index("idx_section_test_type", "test_id", "section_type", unique=True),
    )


class MockPassage(Base):
    __tablename__ = "mock_passages"

    id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("mock_sections.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    passage_text = Column(Text, nullable=False)
    passage_order = Column(Integer, nullable=False, default=1)
    audio_url = Column(String(500), nullable=True)

    section = relationship("MockSection", back_populates="passages")
    questions = relationship("MockQuestion", back_populates="passage", cascade="all, delete-orphan", order_by="MockQuestion.question_order")


class MockQuestion(Base):
    __tablename__ = "mock_questions"

    id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("mock_sections.id", ondelete="CASCADE"), nullable=False)
    passage_id = Column(Integer, ForeignKey("mock_passages.id", ondelete="SET NULL"), nullable=True)
    question_type = Column(String(100), nullable=False)
    question_text = Column(Text, nullable=False)
    options = Column(JSONB, nullable=True)
    correct_answer = Column(JSONB, nullable=False)
    acceptable_answers = Column(JSONB, nullable=True)
    question_order = Column(Integer, nullable=False)
    marks = Column(Integer, nullable=False, default=1)
    prompt_text = Column(Text, nullable=True)
    cue_card = Column(JSONB, nullable=True)
    time_limit_minutes = Column(Integer, nullable=True)

    section = relationship("MockSection", back_populates="questions")
    passage = relationship("MockPassage", back_populates="questions")

    __table_args__ = (
        Index("idx_question_section", "section_id", "question_order"),
    )


class TestAttempt(Base):
    __tablename__ = "test_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    test_id = Column(Integer, ForeignKey("mock_tests.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(50), nullable=False, default="in_progress")
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True), nullable=True)
    remaining_time_seconds = Column(Integer, nullable=False, default=9900)
    current_section = Column(String(50), nullable=False, default="listening")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    test = relationship("MockTest", back_populates="attempts")
    answers = relationship("UserAnswer", back_populates="attempt", cascade="all, delete-orphan")
    timings = relationship("SectionTiming", back_populates="attempt", cascade="all, delete-orphan")
    result = relationship("TestResult", back_populates="attempt", uselist=False, cascade="all, delete-orphan")
    writing_analyses = relationship("WritingAnalysis", back_populates="attempt", cascade="all, delete-orphan")
    speaking_analyses = relationship("SpeakingAnalysis", back_populates="attempt", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_attempt_user_test", "user_id", "test_id"),
        Index("idx_attempt_status", "user_id", "status"),
    )


class UserAnswer(Base):
    __tablename__ = "user_answers"

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("test_attempts.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(Integer, ForeignKey("mock_questions.id", ondelete="CASCADE"), nullable=False)
    answer_text = Column(Text, nullable=True)
    audio_url = Column(String(500), nullable=True)
    transcript = Column(Text, nullable=True)
    is_marked_for_review = Column(Boolean, nullable=False, default=False)
    section = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    attempt = relationship("TestAttempt", back_populates="answers")
    question = relationship("MockQuestion")

    __table_args__ = (
        Index("idx_answer_attempt_question", "attempt_id", "question_id", unique=True),
        Index("idx_answer_attempt_section", "attempt_id", "section"),
    )


class SectionTiming(Base):
    __tablename__ = "section_timings"

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("test_attempts.id", ondelete="CASCADE"), nullable=False)
    section_type = Column(String(50), nullable=False)
    time_limit_seconds = Column(Integer, nullable=False)
    time_spent_seconds = Column(Integer, nullable=False, default=0)
    remaining_seconds = Column(Integer, nullable=False)
    started_at = Column(DateTime(timezone=True), nullable=True)
    ended_at = Column(DateTime(timezone=True), nullable=True)

    attempt = relationship("TestAttempt", back_populates="timings")

    __table_args__ = (
        Index("idx_timing_attempt_section", "attempt_id", "section_type", unique=True),
    )


class TestResult(Base):
    __tablename__ = "test_results"

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("test_attempts.id", ondelete="CASCADE"), nullable=False, unique=True)
    overall_band = Column(Float, nullable=False)
    listening_band = Column(Float, nullable=False)
    reading_band = Column(Float, nullable=False)
    writing_band = Column(Float, nullable=False)
    speaking_band = Column(Float, nullable=False)
    listening_score = Column(Integer, nullable=False, default=0)
    listening_total = Column(Integer, nullable=False, default=0)
    reading_score = Column(Integer, nullable=False, default=0)
    reading_total = Column(Integer, nullable=False, default=0)
    writing_score = Column(Float, nullable=False, default=0.0)
    speaking_score = Column(Float, nullable=False, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    attempt = relationship("TestAttempt", back_populates="result")


class WritingAnalysis(Base):
    __tablename__ = "writing_analyses"

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("test_attempts.id", ondelete="CASCADE"), nullable=False)
    task_number = Column(Integer, nullable=False)
    user_answer = Column(Text, nullable=False)
    word_count = Column(Integer, nullable=False, default=0)
    grammar_score = Column(Float, nullable=False, default=0.0)
    vocabulary_score = Column(Float, nullable=False, default=0.0)
    task_response_score = Column(Float, nullable=False, default=0.0)
    coherence_score = Column(Float, nullable=False, default=0.0)
    sentence_variety_score = Column(Float, nullable=False, default=0.0)
    estimated_band = Column(Float, nullable=False, default=0.0)
    feedback = Column(Text, nullable=True)
    strengths = Column(JSONB, nullable=True)
    weaknesses = Column(JSONB, nullable=True)
    recommendations = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    attempt = relationship("TestAttempt", back_populates="writing_analyses")

    __table_args__ = (
        Index("idx_writing_attempt_task", "attempt_id", "task_number", unique=True),
    )


class SpeakingAnalysis(Base):
    __tablename__ = "speaking_analyses"

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("test_attempts.id", ondelete="CASCADE"), nullable=False)
    part_number = Column(Integer, nullable=False)
    audio_url = Column(String(500), nullable=True)
    transcript = Column(Text, nullable=True)
    duration_seconds = Column(Float, nullable=False, default=0.0)
    grammar_score = Column(Float, nullable=False, default=0.0)
    vocabulary_score = Column(Float, nullable=False, default=0.0)
    fluency_score = Column(Float, nullable=False, default=0.0)
    pronunciation_score = Column(Float, nullable=False, default=0.0)
    coherence_score = Column(Float, nullable=False, default=0.0)
    estimated_band = Column(Float, nullable=False, default=0.0)
    feedback = Column(Text, nullable=True)
    strengths = Column(JSONB, nullable=True)
    weaknesses = Column(JSONB, nullable=True)
    recommendations = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    attempt = relationship("TestAttempt", back_populates="speaking_analyses")

    __table_args__ = (
        Index("idx_speaking_attempt_part", "attempt_id", "part_number", unique=True),
    )
