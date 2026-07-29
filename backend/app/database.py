from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlmodel import SQLModel
from app.config import settings

engine = create_async_engine(settings.DATABASE_URL, echo=True)

AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

class Base(DeclarativeBase):
    registry = SQLModel._sa_registry

# dependency - used in every router that needs DB
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session