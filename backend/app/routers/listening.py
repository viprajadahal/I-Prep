import json
from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import select
from sqlalchemy import func
from app.database import get_db
from app.models.speak import ListeningTest
from app.models.user import User
from sqlmodel.ext.asyncio.session import AsyncSession

router = APIRouter(prefix="/listening", tags=["listening"])

@router.get("/get-test")
async def get_listening_test(db: AsyncSession = Depends(get_db)):
    # Fetch User #1's level (Place holder logic)
    user_result = await db.execute(select(User).where(User.id == 1))
    user = user_result.scalar_one_or_none()
    current_level = user.current_listening_level if user else "Beginner"

    # Fetch a random test for that level
    statement = select(ListeningTest).where(ListeningTest.difficulty == current_level).order_by(func.random())
    result = await db.execute(statement)
    test = result.scalars().first()

    if not test:
        raise HTTPException(status_code=404, detail="No listening tests found.")

    return {
        "test_id": test.id,
        "title": test.title,
        "audio_url": test.audio_path,
        "questions": json.loads(test.questions_json) 
    }

# --- 2. GRADE THE TEST ---
@router.post("/submit/{test_id}")
async def submit_listening_test(
    test_id: int, 
    user_answers: dict, # Expecting something like {"1": "38", "2": "flood"}
    db: AsyncSession = Depends(get_db)
):
    # 1. Fetch the specific test from DB
    test = await db.get(ListeningTest, test_id)
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    # 2. Convert the stored answer string back to a Python dictionary
    correct_answers = json.loads(test.answers_json)
    
    # 3. Grading Logic
    score = 0
    total = len(correct_answers)
    results_breakdown = {}

    for q_id, correct_val in correct_answers.items():
        # Clean the student's answer (remove spaces and make lowercase)
        student_val = user_answers.get(str(q_id), "").strip().lower()
        
        if student_val == correct_val.lower():
            score += 1
            results_breakdown[q_id] = "Correct"
        else:
            results_breakdown[q_id] = f"Incorrect (Correct was: {correct_val})"

    # 4. Simple Band Score Calculation
    band = (score / total) * 9

    # 5. ADAPTIVE LOGIC: Level up the user if they did well
    user_result = await db.execute(select(User).where(User.id == 1))
    user = user_result.scalar_one_or_none()
    
    if user:
        if band >= 7.0: 
            user.current_listening_level = "Advanced"
        elif band >= 5.0: 
            user.current_listening_level = "Intermediate"
        # If low, they stay or go to Beginner
        
        db.add(user)
        await db.commit()

    return {
        "score": f"{score}/{total}",
        "band_score": round(band, 1),
        "new_level": user.current_listening_level if user else "N/A",
        "results": results_breakdown
    }