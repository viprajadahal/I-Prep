from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models.reading import ReadingAttempt, ReadingAnswerRecord
from app.models.user import User
from app.routers.auth import get_current_user

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/summary")
async def get_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # total attempts
    attempts_result = await db.execute(
        select(func.count(ReadingAttempt.id))
        .where(ReadingAttempt.user_id == current_user.id)
    )
    total_attempts = attempts_result.scalar() or 0

    # average score as percentage
    avg_result = await db.execute(
        select(func.avg(ReadingAttempt.score / ReadingAttempt.total_questions * 100))
        .where(ReadingAttempt.user_id == current_user.id)
    )
    avg_accuracy = round(avg_result.scalar() or 0, 1)

    # total questions answered
    total_answered_result = await db.execute(
        select(func.count(ReadingAnswerRecord.id))
        .join(ReadingAttempt, ReadingAnswerRecord.attempt_id == ReadingAttempt.id)
        .where(ReadingAttempt.user_id == current_user.id)
    )
    total_answered = total_answered_result.scalar() or 0

    # total correct
    total_correct_result = await db.execute(
        select(func.count(ReadingAnswerRecord.id))
        .join(ReadingAttempt, ReadingAnswerRecord.attempt_id == ReadingAttempt.id)
        .where(ReadingAttempt.user_id == current_user.id)
        .where(ReadingAnswerRecord.is_correct == True)
    )
    total_correct = total_correct_result.scalar() or 0

    return {
        "total_attempts": total_attempts,
        "avg_accuracy": avg_accuracy,
        "total_questions_answered": total_answered,
        "total_correct": total_correct,
        "overall_band": round(avg_accuracy / 100 * 9, 1)  # rough band estimate
    }


@router.get("/skill-breakdown")
async def get_skill_breakdown(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(
            ReadingAnswerRecord.skill_type,
            func.count(ReadingAnswerRecord.id).label("total"),
            func.count(ReadingAnswerRecord.id).filter(
                ReadingAnswerRecord.is_correct == True
            ).label("correct")
        )
        .join(ReadingAttempt, ReadingAnswerRecord.attempt_id == ReadingAttempt.id)
        .where(ReadingAttempt.user_id == current_user.id)
        .group_by(ReadingAnswerRecord.skill_type)
    )
    rows = result.all()

    return [
        {
            "skill_type": row.skill_type or "unspecified",
            "total": row.total,
            "correct": row.correct or 0,
            "accuracy": round((row.correct or 0) / row.total * 100, 1)
        }
        for row in rows
    ]

@router.get("/progress")
async def get_progress(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(ReadingAttempt)
        .where(ReadingAttempt.user_id == current_user.id)
        .order_by(ReadingAttempt.created_at.asc())
    )
    attempts = result.scalars().all()

    return [
        {
            "attempt_id": a.id,
            "score": a.score,
            "total_questions": a.total_questions,
            "accuracy": round(a.score / a.total_questions * 100, 1) if a.total_questions else 0,
            "created_at": a.created_at.strftime("%b %d")
        }
        for a in attempts
    ]


@router.get("/recent-activity")
async def get_recent_activity(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(ReadingAttempt)
        .where(ReadingAttempt.user_id == current_user.id)
        .order_by(ReadingAttempt.created_at.desc())
        .limit(5)
    )
    attempts = result.scalars().all()

    return [
        {
            "id": a.id,
            "type": "reading",
            "title": f"Reading Attempt #{a.id}",
            "score": a.score,
            "total_questions": a.total_questions,
            "accuracy": round(a.score / a.total_questions * 100, 1) if a.total_questions else 0,
            "date": a.created_at.strftime("%Y-%m-%d")
        }
        for a in attempts
    ]