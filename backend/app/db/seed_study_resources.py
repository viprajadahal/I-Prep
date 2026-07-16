import os
import asyncio
from sqlalchemy import select
from app.database import AsyncSessionLocal, Base
from app.models.resource import StudyResource
from app.models.user import User


STUDY_RESOURCES_SEED = [
    {
        "title": "Cambridge IELTS 18 Reading Practice",
        "description": "Official Cambridge IELTS 18 reading practice test with academic passages and questions",
        "category": "Reading",
        "file_name": "Cambridge_IELTS_18_Reading_Practice.pdf",
        "file_path": "uploads/resources/Cambridge_IELTS_18_Reading_Practice.pdf",
        "file_size": 1024,
        "file_type": "PDF"
    },
    {
        "title": "Reading Band 9 Strategies",
        "description": "Proven strategies and techniques to achieve Band 9 in IELTS Reading",
        "category": "Reading",
        "file_name": "Reading_Band_9_Strategies.pdf",
        "file_path": "uploads/resources/Reading_Band_9_Strategies.pdf",
        "file_size": 1024,
        "file_type": "PDF"
    },
    {
        "title": "Academic Reading Vocabulary",
        "description": "Essential academic vocabulary for IELTS Reading with example sentences",
        "category": "Reading",
        "file_name": "Academic_Reading_Vocabulary.pdf",
        "file_path": "uploads/resources/Academic_Reading_Vocabulary.pdf",
        "file_size": 1024,
        "file_type": "PDF"
    },
    {
        "title": "IELTS Writing Task 1 Guide",
        "description": "Comprehensive guide to IELTS Writing Task 1 with examples and strategies",
        "category": "Writing",
        "file_name": "IELTS_Writing_Task_1_Guide.pdf",
        "file_path": "uploads/resources/IELTS_Writing_Task_1_Guide.pdf",
        "file_size": 1024,
        "file_type": "PDF"
    },
    {
        "title": "IELTS Essay Templates",
        "description": "Ready-to-use essay templates for all IELTS Writing Task 2 question types",
        "category": "Writing",
        "file_name": "IELTS_Essay_Templates.pdf",
        "file_path": "uploads/resources/IELTS_Essay_Templates.pdf",
        "file_size": 1024,
        "file_type": "PDF"
    },
    {
        "title": "Writing Sample Answers",
        "description": "Collection of high-scoring IELTS Writing samples with band 8+ responses",
        "category": "Writing",
        "file_name": "Writing_Sample_Answers.pdf",
        "file_path": "uploads/resources/Writing_Sample_Answers.pdf",
        "file_size": 1024,
        "file_type": "PDF"
    },
    {
        "title": "Listening Practice Test 1",
        "description": "Complete IELTS listening practice test with audio and answer key",
        "category": "Listening",
        "file_name": "ielts_listening_test_1.mp3",
        "file_path": "uploads/resources/ielts_listening_test_1.mp3",
        "file_size": 1024,
        "file_type": "MP3"
    },
    {
        "title": "Listening Answer Sheet",
        "description": "Official IELTS Listening answer sheet for practice",
        "category": "Listening",
        "file_name": "Listening_Answer_Sheet.pdf",
        "file_path": "uploads/resources/Listening_Answer_Sheet.pdf",
        "file_size": 1024,
        "file_type": "PDF"
    },
    {
        "title": "Listening Tips",
        "description": "Essential tips and strategies to improve your IELTS Listening score",
        "category": "Listening",
        "file_name": "Listening_Tips.pdf",
        "file_path": "uploads/resources/Listening_Tips.pdf",
        "file_size": 1024,
        "file_type": "PDF"
    },
    {
        "title": "Speaking Cue Cards 2026",
        "description": "Updated IELTS Speaking Part 2 cue cards for 2026 with sample responses",
        "category": "Speaking",
        "file_name": "Speaking_Cue_Cards_2026.pdf",
        "file_path": "uploads/resources/Speaking_Cue_Cards_2026.pdf",
        "file_size": 1024,
        "file_type": "PDF"
    },
    {
        "title": "Speaking Sample Answers",
        "description": "High-scoring sample answers for IELTS Speaking Parts 1, 2, and 3",
        "category": "Speaking",
        "file_name": "Speaking_Sample_Answers.pdf",
        "file_path": "uploads/resources/Speaking_Sample_Answers.pdf",
        "file_size": 1024,
        "file_type": "PDF"
    },
    {
        "title": "Band Descriptor",
        "description": "Official IELTS Band Descriptors for Speaking and Writing",
        "category": "Speaking",
        "file_name": "Band_Descriptor.pdf",
        "file_path": "uploads/resources/Band_Descriptor.pdf",
        "file_size": 1024,
        "file_type": "PDF"
    },
    {
        "title": "IELTS Registration Guide",
        "description": "Step-by-step guide to registering for the IELTS exam",
        "category": "General",
        "file_name": "IELTS_Registration_Guide.pdf",
        "file_path": "uploads/resources/IELTS_Registration_Guide.pdf",
        "file_size": 1024,
        "file_type": "PDF"
    },
    {
        "title": "IELTS Band Score Chart",
        "description": "Official IELTS band score chart and CEFR equivalence",
        "category": "General",
        "file_name": "IELTS_Band_Score_Chart.pdf",
        "file_path": "uploads/resources/IELTS_Band_Score_Chart.pdf",
        "file_size": 1024,
        "file_type": "PDF"
    },
    {
        "title": "Exam Day Checklist",
        "description": "Complete checklist of what to bring and do on your IELTS exam day",
        "category": "General",
        "file_name": "Exam_Day_Checklist.pdf",
        "file_path": "uploads/resources/Exam_Day_Checklist.pdf",
        "file_size": 1024,
        "file_type": "PDF"
    }
]


async def seed_study_resources():
    async with AsyncSessionLocal() as session:
        try:
            result = await session.execute(select(User).where(User.email == "admin@iprep.com"))
            admin_user = result.scalar_one_or_none()
            
            if not admin_user:
                admin_user = User(
                    email="admin@iprep.com",
                    full_name="Admin User",
                    hashed_password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
                    target_band=9.0,
                    role="admin"
                )
                session.add(admin_user)
                await session.commit()
                await session.refresh(admin_user)
            
            for resource_data in STUDY_RESOURCES_SEED:
                result = await session.execute(
                    select(StudyResource).where(StudyResource.title == resource_data["title"])
                )
                existing = result.scalar_one_or_none()
                
                if not existing:
                    resource = StudyResource(
                        title=resource_data["title"],
                        description=resource_data["description"],
                        category=resource_data["category"],
                        file_name=resource_data["file_name"],
                        file_path=resource_data["file_path"],
                        file_size=resource_data["file_size"],
                        file_type=resource_data["file_type"],
                        uploaded_by=admin_user.id
                    )
                    session.add(resource)
            
            await session.commit()
            print(f"Seeded {len(STUDY_RESOURCES_SEED)} study resources")
            
        except Exception as e:
            await session.rollback()
            print(f"Error seeding study resources: {e}")
            raise


if __name__ == "__main__":
    asyncio.run(seed_study_resources())