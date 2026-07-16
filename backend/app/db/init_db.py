"""
Initialize database: create tables, seed data if empty
"""
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from app.database import Base, engine
from app.models.resource import StudyResource
from app.models.user import User
from datetime import datetime


async def get_session():
    """Create a session factory"""
    AsyncSessionLocal = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    async with AsyncSessionLocal() as session:
        yield session


async def create_database_if_not_exists():
    """Create the iprep database if it doesn't exist"""
    # Use a separate sync engine for database creation
    from sqlalchemy import create_engine
    
    try:
        # Try without password (trust authentication)
        sync_engine = create_engine("postgresql://postgres@localhost:5432/postgres")
        with sync_engine.connect() as conn:
            # Check if database exists - this must be done outside a transaction
            # For sync connections, we need to set autocommit
            conn = conn.execution_options(isolation_level="AUTOCOMMIT")
            result = conn.execute(text("SELECT 1 FROM pg_database WHERE datname = 'iprep'"))
            if result.fetchone() is None:
                conn.execute(text("CREATE DATABASE iprep"))
                conn.commit()
                print("Created database 'iprep'")
            else:
                print("Database 'iprep' already exists")
        sync_engine.dispose()
        return True
    except Exception as e:
        print(f"Error creating database: {e}")
        return False


async def create_tables():
    """Create all tables using SQLAlchemy"""
    async with engine.begin() as conn:
        # Drop study_resources table if it exists (to handle schema changes)
        await conn.execute(text("DROP TABLE IF EXISTS study_resources CASCADE"))
        await conn.execute(text("DROP TABLE IF EXISTS resources CASCADE"))
        
        await conn.run_sync(Base.metadata.create_all)
        print("Tables created/verified")


async def seed_admin_user():
    """Create admin user if not exists"""
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated=["auto"])
    
    AsyncSessionLocal = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.email == "admin@iprep.com"))
        if result.scalar_one_or_none() is None:
            # Use a shorter password to avoid bcrypt 72-byte limit
            short_password = "admin123"
            admin = User(
                email="admin@iprep.com",
                hashed_password=pwd_context.hash(short_password),
                full_name="Admin User",
                role="admin"
            )
            session.add(admin)
            await session.commit()
            print("Created admin user: admin@iprep.com / admin123")
        else:
            print("Admin user already exists")


async def seed_study_resources():
    """Seed StudyResource table with IELTS study materials if empty"""
    AsyncSessionLocal = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    
    async with AsyncSessionLocal() as session:
        # First ensure a user exists for foreign key
        result = await session.execute(select(User).where(User.id == 1))
        if result.scalar_one_or_none() is None:
            # Create a simple user without password hashing
            from sqlalchemy import text as sql_text
            await session.execute(sql_text("INSERT INTO users (id, email, full_name, hashed_password, role) VALUES (1, 'system@iprep.com', 'System User', 'placeholder', 'admin')"))
            await session.commit()
            print("Created system user for foreign key")
        
        result = await session.execute(select(StudyResource))
        count = len(result.scalars().all())
        
        if count == 0:
            print("Seeding StudyResource table with IELTS materials...")
            
            resources = [
                {
                    "title": "IELTS Reading Practice Test 1",
                    "description": "Academic Reading practice test with 3 passages and 40 questions",
                    "category": "Reading",
                    "file_name": "ielts_reading_test_1.pdf",
                    "file_path": "uploads/resources/ielts_reading_test_1.pdf",
                    "file_size": 2450000,
                    "file_type": "PDF",
                    "uploaded_by": 1
                },
                {
                    "title": "IELTS Writing Task 1 Academic Samples",
                    "description": "Sample answers for Academic Writing Task 1 (Graphs, Charts, Tables)",
                    "category": "Writing",
                    "file_name": "writing_task1_samples.pdf",
                    "file_path": "uploads/resources/writing_task1_samples.pdf",
                    "file_size": 1800000,
                    "file_type": "PDF",
                    "uploaded_by": 1
                },
                {
                    "title": "IELTS Writing Task 2 Essay Samples",
                    "description": "Band 8+ sample essays for common IELTS Writing Task 2 topics",
                    "category": "Writing",
                    "file_name": "writing_task2_essays.pdf",
                    "file_path": "uploads/resources/writing_task2_essays.pdf",
                    "file_size": 2100000,
                    "file_type": "PDF",
                    "uploaded_by": 1
                },
                {
                    "title": "IELTS Listening Practice Test 1",
                    "description": "Complete Listening test with audio and answer key",
                    "category": "Listening",
                    "file_name": "listening_test_1.zip",
                    "file_path": "uploads/resources/listening_test_1.zip",
                    "file_size": 4500000,
                    "file_type": "ZIP",
                    "uploaded_by": 1
                },
                {
                    "title": "IELTS Speaking Part 1 Common Questions",
                    "description": "List of common Part 1 questions with sample answers",
                    "category": "Speaking",
                    "file_name": "speaking_part1_questions.pdf",
                    "file_path": "uploads/resources/speaking_part1_questions.pdf",
                    "file_size": 1200000,
                    "file_type": "PDF",
                    "uploaded_by": 1
                },
                {
                    "title": "IELTS Speaking Part 2 Cue Cards",
                    "description": "Collection of Part 2 cue cards with sample responses",
                    "category": "Speaking",
                    "file_name": "speaking_part2_cue_cards.pdf",
                    "file_path": "uploads/resources/speaking_part2_cue_cards.pdf",
                    "file_size": 1500000,
                    "file_type": "PDF",
                    "uploaded_by": 1
                },
                {
                    "title": "IELTS Speaking Part 3 Discussion Topics",
                    "description": "Common Part 3 discussion topics with vocabulary and ideas",
                    "category": "Speaking",
                    "file_name": "speaking_part3_topics.pdf",
                    "file_path": "uploads/resources/speaking_part3_topics.pdf",
                    "file_size": 1300000,
                    "file_type": "PDF",
                    "uploaded_by": 1
                },
                {
                    "title": "IELTS Vocabulary List - Academic",
                    "description": "Essential academic vocabulary for IELTS with examples",
                    "category": "General",
                    "file_name": "academic_vocabulary.pdf",
                    "file_path": "uploads/resources/academic_vocabulary.pdf",
                    "file_size": 1600000,
                    "file_type": "PDF",
                    "uploaded_by": 1
                },
                {
                    "title": "IELTS Grammar Guide",
                    "description": "Comprehensive grammar guide for IELTS preparation",
                    "category": "General",
                    "file_name": "grammar_guide.pdf",
                    "file_path": "uploads/resources/grammar_guide.pdf",
                    "file_size": 1900000,
                    "file_type": "PDF",
                    "uploaded_by": 1
                },
                {
                    "title": "IELTS Listening Test 2 with Audio",
                    "description": "Full Listening test with MP3 audio files",
                    "category": "Listening",
                    "file_name": "listening_test_2.mp3",
                    "file_path": "uploads/resources/listening_test_2.mp3",
                    "file_size": 25000000,
                    "file_type": "MP3",
                    "uploaded_by": 1
                }
            ]
            
            for resource_data in resources:
                resource = StudyResource(**resource_data)
                session.add(resource)
            
            await session.commit()
            print(f"Seeded {len(resources)} study resources")
        else:
            print(f"StudyResource table already has {count} records - skipping seed")


async def main():
    print("Initializing database...")
    await create_database_if_not_exists()
    await create_tables()
    try:
        await seed_admin_user()
    except Exception as e:
        print(f"Skipping admin user creation (bcrypt issue): {e}")
    await seed_study_resources()
    print("Database initialization complete!")


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
