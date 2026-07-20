# Reading models are defined in app.models.user to avoid duplicate table
# definitions. This file adds ReadingAnswerRecord from the teammate's branch.
from app.models.user import ReadingPassage, ReadingQuestion, ReadingAttempt  # noqa: F401
from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class ReadingAnswerRecord(Base):
    __tablename__ = "reading_answer_records"

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("reading_attempts.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("reading_questions.id"), nullable=False)
    user_answer = Column(Text, nullable=False)
    is_correct = Column(Boolean, nullable=False)
    skill_type = Column(String, nullable=True)
    question = relationship("ReadingQuestion")
