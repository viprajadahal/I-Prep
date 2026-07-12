from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.reading import ReadingPassage, ReadingQuestion, ReadingAttempt, ReadingAnswerRecord
from app.models.user import User
from app.routers.auth import get_current_user
from app.schemas.reading import (
    PassageResponse, PassageWithQuestions, ReadingSubmit, ReadingResultResponse
)
from app.services.reading_scoring import score_attempt

router = APIRouter(prefix="/reading", tags=["reading"])


@router.get("/passages", response_model=list[PassageResponse])
async def list_passages(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ReadingPassage))
    return result.scalars().all()


@router.get("/passages/{passage_id}", response_model=PassageWithQuestions)
async def get_passage(passage_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ReadingPassage)
        .where(ReadingPassage.id == passage_id)
        .options(selectinload(ReadingPassage.questions))
    )
    passage = result.scalar_one_or_none()

    if not passage:
        raise HTTPException(status_code=404, detail="Passage not found")

    return passage


@router.post("/submit", response_model=ReadingResultResponse)
async def submit_reading(
    data: ReadingSubmit,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(ReadingQuestion).where(ReadingQuestion.passage_id == data.passage_id)
    )
    questions = result.scalars().all()

    if not questions:
        raise HTTPException(status_code=404, detail="No questions found for this passage")

    submitted = {a.question_id: a.answer for a in data.answers}

    score, answer_records_data, skill_breakdown = score_attempt(questions, submitted)

    # create the attempt first so we have its id
    attempt = ReadingAttempt(
        user_id=current_user.id,
        passage_id=data.passage_id,
        score=score,
        total_questions=len(questions)
    )
    db.add(attempt)
    await db.flush()  # generates attempt.id without committing yet

    # build a quick lookup so we can attach correct_answer for the response
    questions_by_id = {q.id: q for q in questions}

    question_results = []
    for record_data in answer_records_data:
        record = ReadingAnswerRecord(
            attempt_id=attempt.id,
            question_id=record_data["question_id"],
            user_answer=record_data["user_answer"],
            is_correct=record_data["is_correct"],
            skill_type=record_data["skill_type"]
        )
        db.add(record)

        # for the API response only — not stored, just joined here from the question object
        q = questions_by_id[record_data["question_id"]]
        question_results.append({
            "question_id": q.id,
            "user_answer": record_data["user_answer"],
            "correct_answer": q.correct_answer,
            "is_correct": record_data["is_correct"],
            "skill_type": q.skill_type
        })

    await db.commit()
    await db.refresh(attempt)

    return {
        "id": attempt.id,
        "passage_id": attempt.passage_id,
        "score": attempt.score,
        "total_questions": attempt.total_questions,
        "skill_breakdown": skill_breakdown,
        "question_results": question_results,
        "created_at": attempt.created_at
    }


@router.get("/history", response_model=list[ReadingResultResponse])
async def get_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(ReadingAttempt)
        .where(ReadingAttempt.user_id == current_user.id)
        .options(
            selectinload(ReadingAttempt.answer_records).selectinload(ReadingAnswerRecord.question)
        )
    )
    attempts = result.scalars().all()

    history = []
    for attempt in attempts:
        skill_stats = {}
        question_results = []

        for record in attempt.answer_records:
            skill = record.skill_type or "unspecified"
            skill_stats.setdefault(skill, {"correct": 0, "total": 0})
            skill_stats[skill]["total"] += 1
            if record.is_correct:
                skill_stats[skill]["correct"] += 1

            question_results.append({
                "question_id": record.question_id,
                "user_answer": record.user_answer,
                "correct_answer": record.question.correct_answer,
                "is_correct": record.is_correct,
                "skill_type": record.skill_type
            })

        skill_breakdown = [
            {"skill_type": k, "correct": v["correct"], "total": v["total"]}
            for k, v in skill_stats.items()
        ]

        history.append({
            "id": attempt.id,
            "passage_id": attempt.passage_id,
            "score": attempt.score,
            "total_questions": attempt.total_questions,
            "skill_breakdown": skill_breakdown,
            "question_results": question_results,
            "created_at": attempt.created_at
        })

    return history