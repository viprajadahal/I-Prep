from sqlalchemy import Column, Integer, String, DateTime, Float
from sqlalchemy.sql import func
from app.database import Base
from sqlalchemy.orm import relationship # wrote this to import writing_attempts below

class User(Base):
    __tablename__ = "users"
   
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    target_band = Column(Float, default=7.0)
    role = Column(String, default="student", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now()) 


def setup_user_relationships():
    User.reading_attempts = relationship("ReadingAttempt", back_populates="user")
    User.study_resources = relationship("StudyResource", back_populates="uploader")