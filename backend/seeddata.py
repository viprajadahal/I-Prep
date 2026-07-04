import json
import os
from sqlmodel import Session, create_engine, select
from app.models.speak import ListeningTest
from app.config import settings

# Database connection
sync_url = settings.DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")
engine = create_engine(sync_url)

# The data for your tests
ielts_test_data = [
    {
  "title": "Wincham Farm Residential Center",
  "audio_path": "/static/audio/beginner_01.mp3",
  "difficulty": "Beginner",
  "questions": [
    {
      "id": 1,
      "text": "The center has a total capacity to sleep ___ guests.",
      "answer": "38"
    },
    {
      "id": 2,
      "text":"The meeting room is currently closed because the ___ was damaged by a flood.",
      "answer": "floor"
    },
    {
      "id": 3,
      "text": "The group is planning to arrive on the 28th of ___.",
      "answer": "September"
    },
    {
      "id": 4,
      "text": "The farm produces food without using artificial fertilizers or ___.",
      "answer": "pesticides"
    },
    {
      "id": 5,
      "text": "Keen visitors on the farm tours are sometimes allowed to drive a ___.",
      "answer": "tractor"
    },
    {
      "id": 6,
      "text": "Visitors are advised to bring old clothing and suitable ___ because it can get messy.",
      "answer": "footwear"
    },
    {
      "id": 7,
      "text": "The survival course is conducted in a large area of ___ on the farm.",
      "answer": "woodland"
    },
    {
      "id": 8,
      "text": "The nearby national park and coast are both about 30 minutes away by ___.",
      "answer": "road"
    },
    {
      "id": 9,
      "text": "The standard charge for accommodation is ___ pounds per head.",
      "answer": "14"
    },
    {
      "id": 10,
      "text": "To secure a booking, the center requires a ___ within five days.",
      "answer": "deposit"
    }
  ]
    },

{
  "title": "Vacation Jobs Survey",
  "audio_path": "/static/audio/intermediate_01.mp3",
  "difficulty": "Intermediate",
  "questions": [
    {
      "id": 1,
      "text": "Students who did supermarket stocktaking particularly enjoyed the ___ involved.",
      "answer": "traveling"
    },
    {
      "id": 2,
      "text": "The main advice for students doing stocktaking is to get good ___.",
      "answer": "shoes"
    },
    {
      "id": 3,
      "text": "The favorite feature of doing office work was the ___.",
      "answer": "air conditioning"
    },
    {
      "id": 4,
      "text": "Students disliked office work because they had to wear formal ___.",
      "answer": "clothes"
    },
    {
      "id": 5,
      "text": "Working as a theme park attendant offered the unexpected benefit of good ___.",
      "answer": "pay"
    },
    {
      "id": 6,
      "text": "Theme park employees are advised to live nearby due to frequent ___ work.",
      "answer": "shift"
    },
    {
      "id": 7,
      "text": "Peter Marshall found out about the zoo job opportunities on the zoo ___.",
      "answer": "website"
    },
    {
      "id": 8,
      "text": "Peter worked at the zoo for just under three ___.",
      "answer": "months"
    },
    {
      "id": 9,
      "text": "Peter especially loved working on the ___ side of the zoo's operations.",
      "answer": "educational"
    },
    {
      "id": 10,
      "text": "Due to upcoming final ___, Peter cannot take on paid work this vacation.",
      "answer": "exams"
    }
  ]
},
{
  "title": "Geology Study Syndicate",
  "audio_path": "/static/audio/intermediate_01.mp3",
  "difficulty": "Intermediate",
  "questions": [
    {
      "id": 1,
      "text": "Andy is taking notes for ___ because he is currently at a tutorial.",
      "answer": "John"
    },
    {
      "id": 2,
      "text": "In a study syndicate, students work together without a ___.",
      "answer": "teacher"
    },
    {
      "id": 3,
      "text": "The students are setting up the syndicate to revise for their ___ course.",
      "answer": "geology"
    },
    {
      "id": 4,
      "text": "Bob volunteers to cover the topic of ___ building on May 9.",
      "answer": "mountain"
    },
    {
      "id": 5,
      "text": "Andy offers to present on glaciated areas because he previously did an ___ on them.",
      "answer": "assignment"
    },
    {
      "id": 6,
      "text": "The final presentation before the exams will cover the topic of ___.",
      "answer": "volcanoes"
    },
    {
      "id": 7,
      "text": "The students agree that the presentations should last between 30 and 40 ___.",
      "answer": "minutes"
    },
    {
      "id": 8,
      "text": "Andy suggests avoiding their ___ notes because they already have that information.",
      "answer": "lecture"
    },
    {
      "id": 9,
      "text": "To help find deeper information, the students will look at the library's ___.",
      "answer": "bibliography"
    },
    {
      "id": 10,
      "text": "During the presentations, the students can write on the ___.",
      "answer": "whiteboard"
    }
  ]
},
{
  "title": "Health on the Night Shift",
  "audio_path": "/static/audio/advanced_01.mp3",
  "difficulty": "Advanced",
  "questions": [
    {
      "id": 1,
      "text": "The internal clock in our brains is linked directly to cycles of light and ___.",
      "answer": "dark"
    },
    {
      "id": 2,
      "text": "Night workers constantly fight against a condition known as a sleep ___.",
      "answer": "debt"
    },
    {
      "id": 3,
      "text": "Studies show that night workers typically get only five to six hours of ___.",
      "answer": "sleep"
    },
    {
      "id": 4,
      "text": "Long-term shift workers have an increased risk of developing ___ problems.",
      "answer": "heart"
    },
    {
      "id": 5,
      "text": "Night workers suffer a high incidence of stomach problems, such as ___.",
      "answer": "ulcers"
    },
    {
      "id": 6,
      "text": "The high frequency of minor illnesses indicates that night shifts damage ___.",
      "answer": "immunity"
    },
    {
      "id": 7,
      "text": "The most common psychological problem reported among night shift workers is ___.",
      "answer": "depression"
    },
    {
      "id": 8,
      "text": "Accident statistics show that night work badly impairs human mental ___.",
      "answer": "abilities"
    },
    {
      "id": 9,
      "text": "The peak time for errors on the roads is between 3am and ___ am.",
      "answer": "5"
    },
    {
      "id": 10,
      "text": "Divorce statistics show that night work frequently causes the breakup of ___ life.",
      "answer": "family"
    }
  ]
}
]
def seed_db():
    print("🚀 Connecting to database to seed Listening Tests...")
    with Session(engine) as session:
        for t in ielts_test_data:
            # Check if it already exists to avoid duplicates
            statement = select(ListeningTest).where(ListeningTest.title == t["title"])
            exists = session.exec(statement).first()

            if not exists:
                new_test = ListeningTest(
                    title=t["title"],
                    audio_path=t["audio_path"],
                    difficulty=t["difficulty"],
                    # Convert the list of questions into a string so it fits in the DB
                    questions_json=json.dumps(t["questions"]),
                    # Create a quick answer key lookup string
                    answers_json=json.dumps({str(q["id"]): q["answer"] for q in t["questions"]})
                )
                session.add(new_test)
                print(f"✅ Added: {t['title']}")
            else:
                print(f"⏭️ Skipped (Exists): {t['title']}")
        
        session.commit()
    print("\n🎉 Database is now ready with Listening Tests!")

if __name__ == "__main__":
     seed_db()