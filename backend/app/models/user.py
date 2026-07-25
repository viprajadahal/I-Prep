from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String(50), unique=True, index=True, nullable=True)

    email = Column(String(100), unique=True, index=True, nullable=False)

    full_name = Column(String, nullable=True)

    hashed_password = Column(String(255), nullable=False)

    target_band = Column(Float, default=7.0)

    current_speaking_level = Column(String(20), default="Beginner")

    current_listening_level = Column(String(20), default="Beginner")

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    reading_attempts = relationship(
        "ReadingAttempt",
        back_populates="user"
    )

    essays = relationship(
        "Essay",
        back_populates="user"
    )

    reading_submissions = relationship(
        "ReadingSubmission",
        back_populates="user"
    )

    writing_results = relationship(
        "WritingResult",
        back_populates="user"
    )

    reading_results = relationship(
        "ReadingResult",
        back_populates="user"
    )


class Essay(Base):
    __tablename__ = "essays"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    prompt_id = Column(
        Integer,
        ForeignKey("writing_prompts.id"),
        nullable=True,
    )

    title = Column(String(200))

    text = Column(Text, nullable=False)

    word_count = Column(Integer, default=0)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    user = relationship(
        "User",
        back_populates="essays"
    )

    writing_result = relationship(
        "WritingResult",
        back_populates="essay",
        uselist=False
    )


class WritingResult(Base):
    __tablename__ = "writing_results"

    id = Column(Integer, primary_key=True, index=True)

    essay_id = Column(
        Integer,
        ForeignKey("essays.id"),
        nullable=False
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    grammar_score = Column(Float, default=0.0)

    vocabulary_score = Column(Float, default=0.0)

    coherence_score = Column(Float, default=0.0)

    task_achievement_score = Column(Float, default=0.0)

    overall_score = Column(Float, default=0.0)

    feedback = Column(Text)

    grammar_errors = Column(Text)

    vocabulary_details = Column(Text)

    coherence_details = Column(Text)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    essay = relationship(
        "Essay",
        back_populates="writing_result"
    )

    user = relationship(
        "User",
        back_populates="writing_results"
    )


class WritingPrompt(Base):
    __tablename__ = "writing_prompts"

    id = Column(Integer, primary_key=True, index=True)

    module = Column(String(20), index=True, nullable=False, default="academic")

    task_type = Column(String(50), index=True, nullable=False)

    subtype = Column(String(50), index=True, nullable=True)

    difficulty = Column(String(20), index=True, nullable=False)

    title = Column(String(200), nullable=False)

    prompt_text = Column(Text, nullable=False)

    image_url = Column(Text)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), server_default=func.now())


class ReadingPassage(Base):
    __tablename__ = "reading_passages"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(200), nullable=False)

    content = Column(Text, nullable=False)

    level = Column(String(20), default="intermediate")

    category = Column(String(50))

    word_count = Column(Integer, default=0)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    questions = relationship(
        "ReadingQuestion",
        back_populates="passage"
    )


class ReadingQuestion(Base):
    __tablename__ = "reading_questions"

    id = Column(Integer, primary_key=True, index=True)

    passage_id = Column(
        Integer,
        ForeignKey("reading_passages.id"),
        nullable=False
    )

    question_text = Column(Text, nullable=False)

    option_a = Column(String(255), nullable=False)

    option_b = Column(String(255), nullable=False)

    option_c = Column(String(255), nullable=False)

    option_d = Column(String(255), nullable=False)

    correct_option = Column(String(1), nullable=False)

    explanation = Column(Text)

    order = Column(Integer, default=0)

    passage = relationship(
        "ReadingPassage",
        back_populates="questions"
    )


class ReadingSubmission(Base):
    __tablename__ = "reading_submissions"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    passage_id = Column(
        Integer,
        ForeignKey("reading_passages.id"),
        nullable=False
    )

    answers = Column(Text, nullable=False)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship(
        "User",
        back_populates="reading_submissions"
    )

    passage = relationship("ReadingPassage")

    reading_result = relationship(
        "ReadingResult",
        back_populates="submission",
        uselist=False
    )


class ReadingResult(Base):
    __tablename__ = "reading_results"

    id = Column(Integer, primary_key=True, index=True)

    submission_id = Column(
        Integer,
        ForeignKey("reading_submissions.id"),
        nullable=False
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    passage_id = Column(
        Integer,
        ForeignKey("reading_passages.id"),
        nullable=False
    )

    score = Column(Float, default=0.0)

    total_questions = Column(Integer, default=0)

    correct_answers = Column(Integer, default=0)

    feedback = Column(Text)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    submission = relationship(
        "ReadingSubmission",
        back_populates="reading_result"
    )

    user = relationship(
        "User",
        back_populates="reading_results"
    )


class ReadingAttempt(Base):
    __tablename__ = "reading_attempts"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    passage_id = Column(
        Integer,
        ForeignKey("reading_passages.id"),
        nullable=False
    )

    answers = Column(Text, nullable=False)

    score = Column(Integer, nullable=True)

    total_questions = Column(Integer, nullable=False)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    skill_type = Column(String, nullable=True)

    user = relationship(
        "User",
        back_populates="reading_attempts"
    )

