# from sqlalchemy import Column, Integer, String, DateTime, Float
# from sqlalchemy.sql import func
# from app.database import Base

# class User(Base):
#     __tablename__ = "users"
 
#     id = Column(Integer, primary_key=True, index=True)
#     email = Column(String, unique=True, index=True, nullable=False)
#     full_name = Column(String, nullable=False)
#     hashed_password = Column(String, nullable=False)
#     target_band = Column(Float, default=7.0)
#     created_at = Column(DateTime(timezone=True), server_default=func.now())

#SQLModel version
from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime

class User(SQLModel, table=True):
    __tablename__: str = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True, nullable=False)
    full_name: str = Field(nullable=False)
    hashed_password: str = Field(nullable=False)
    target_band: float = Field(default=7.0)
    created_at: datetime = Field(default_factory=datetime.utcnow)
#added lines
    current_speaking_level: str = Field(default="Beginner")
    current_listening_level: str = Field(default="Beginner")
