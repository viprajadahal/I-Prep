import asyncio
import copy
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import AsyncSessionLocal, engine
from app.models.mock_test import MockTest, MockSection, MockPassage, MockQuestion
from sqlalchemy import select, text

from seed_test1 import MOCK_TEST as TEST1
from seed_test2 import MOCK_TEST as TEST2
from seed_test3 import MOCK_TEST as TEST3


async def seed():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(MockTest).limit(1))
        existing = result.scalar_one_or_none()
        if existing:
            print("Mock tests already exist. Skipping seed.")
            return

        for test_data in [TEST1, TEST2, TEST3]:
            data = copy.deepcopy(test_data)
            sections_data = data.pop("sections")
            mock_test = MockTest(**data)
            session.add(mock_test)
            await session.flush()

            for section_data in sections_data:
                passages_data = section_data.pop("passages", [])
                standalone_questions_data = section_data.pop("standalone_questions", [])

                mock_section = MockSection(
                    test_id=mock_test.id,
                    section_type=section_data["type"],
                    section_order=section_data["order"],
                    time_limit_minutes=section_data["time_limit"],
                    title=section_data["title"],
                )
                session.add(mock_section)
                await session.flush()

                for passage_data in passages_data:
                    questions_data = passage_data.pop("questions", [])
                    mock_passage = MockPassage(
                        section_id=mock_section.id,
                        title=passage_data["title"],
                        passage_text=passage_data["text"],
                        passage_order=passage_data["order"],
                    )
                    session.add(mock_passage)
                    await session.flush()

                    for q_data in questions_data:
                        mock_question = MockQuestion(
                            section_id=mock_section.id,
                            passage_id=mock_passage.id,
                            question_type=q_data["type"],
                            question_text=q_data["text"],
                            correct_answer=q_data["correct"],
                            question_order=q_data["order"],
                            marks=q_data.get("marks", 1),
                        )
                        session.add(mock_question)

                for q_data in standalone_questions_data:
                    mock_question = MockQuestion(
                        section_id=mock_section.id,
                        passage_id=None,
                        question_type=q_data["type"],
                        question_text=q_data["text"],
                        correct_answer=q_data.get("correct", []),
                        question_order=q_data["order"],
                        marks=q_data.get("marks", 0),
                        prompt_text=q_data.get("prompt_text"),
                        cue_card=q_data.get("cue_card"),
                        time_limit_minutes=q_data.get("time_limit_minutes"),
                    )
                    session.add(mock_question)

            await session.commit()
            print(f"Created mock test: {mock_test.title}")

        print("Seed completed successfully.")


if __name__ == "__main__":
    asyncio.run(seed())
