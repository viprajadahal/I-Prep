import asyncio
from sqlmodel import Session, create_engine, select
from app.models.speak import SpeakingQuestion
from app.config import settings

# IELTS Question bank
initial_questions = [
     {"text": "What is your full name?", "difficulty": "Beginner", "audio": "q1.mp3"},
    {"text": "Tell me about your hometown.", "difficulty": "Beginner", "audio": "q2.mp3"},
    {"text": "What do you like to do in your free time?", "difficulty": "Beginner", "audio": "q3.mp3"},
    {"text": "What do you usually do on weekends?", "difficulty": "Beginner", "audio": "q4.mp3"},
    {"text": "Do you enjoy reading books? Why or why not?", "difficulty": "Beginner", "audio": "q5.mp3"},
    {"text": "What kind of music do you enjoy listening to?", "difficulty": "Beginner", "audio": "q6.mp3"},
    {"text": "What is your favorite season of the year? Why?", "difficulty": "Beginner", "audio": "q7.mp3"},

    {"text": "Do you prefer living in a house or an apartment? Why?", "difficulty": "Intermediate", "audio": "q8.mp3"},
    {"text": "Describe a memorable trip you have taken.", "difficulty": "Intermediate", "audio": "q9.mp3"},
    {"text": "How do you usually spend time with your friends?", "difficulty": "Intermediate", "audio": "q10.mp3"},
    {"text": "What qualities make someone a good leader?", "difficulty": "Intermediate", "audio": "q11.mp3"},
    {"text": "Do you think online learning is better than classroom learning? Why?", "difficulty": "Intermediate", "audio": "q12.mp3"},
    {"text": "What are the advantages and disadvantages of using social media?", "difficulty": "Intermediate", "audio": "q13.mp3"},
    {"text": "How important is exercise in maintaining a healthy lifestyle?", "difficulty": "Intermediate", "audio": "q14.mp3"},

    {"text": "How has technology changed the way people communicate?", "difficulty": "Advanced", "audio": "q15.mp3"},
    {"text": "Do you think artificial intelligence will replace many jobs in the future? Why?", "difficulty": "Advanced", "audio": "q16.mp3"},
    {"text": "What are the biggest environmental challenges facing the world today?", "difficulty": "Advanced", "audio": "q17.mp3"},
    {"text": "Should governments spend more money on education or healthcare? Explain your opinion.", "difficulty": "Advanced", "audio": "q18.mp3"},
    {"text": "How can young people contribute to solving social problems?", "difficulty": "Advanced", "audio": "q19.mp3"},
    {"text": "In your opinion, what are the most important qualities needed for success in life?", "difficulty": "Advanced", "audio": "q20.mp3"}
]
# 2. Setup the engine (We strip '+asyncpg' because seeding is easier synchronously)
sync_url = settings.DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")
engine = create_engine(sync_url)

def seed_data():
    print("Connecting to database to add questions...")
    with Session(engine) as session:
        for q in initial_questions:
            # Check if the question already exists so we don't add duplicates
            statement = select(SpeakingQuestion).where(SpeakingQuestion.text == q["text"])
            exists = session.exec(statement).first()
            
            if not exists:
                db_q = SpeakingQuestion(
                    text=q["text"], 
                    difficulty=q["difficulty"], 
                    examiner_audio_path=f"/static/questions/{q['audio']}",
                    category="General"
                )
                session.add(db_q)
                print(f"Added: {q['text']}")
            else:
                print(f"Skipped (Already exists): {q['text']}")

            session.commit()
    print("\n✅ Done! Your Question Bank is now full.")

if __name__ == "__main__":
    seed_data()