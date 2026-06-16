from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class WritingAttempt(Base):
    __tablename__ = "writing_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    task_type = Column(String, nullable=False)  # "task1" or "task2"
    prompt = Column(Text, nullable=False)        # the question given
    essay = Column(Text, nullable=False)         # what the user wrote
    band_score = Column(Float, nullable=True)    # null until graded
    feedback = Column(Text, nullable=True)       # null until graded
    word_count = Column(Integer, nullable=True)  
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="writing_attempts")