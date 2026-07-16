from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.schemas.writing import (
    TaskResponse,
    TaskSubmitRequest,
    EssayResponse,
    ScoreItem,
    ProgressResponse,
    WritingResultResponse,
)
from app.services.writing_service import WritingService
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/writing", tags=["Writing-Compat"])


def _prompt_to_task(prompt) -> TaskResponse:
    return TaskResponse(
        id=prompt.id,
        title=prompt.title,
        description=prompt.prompt_text,
        duration="40 min",
        difficulty=prompt.difficulty,
        type=prompt.task_type,
        score=0.0,
        completed=False,
    )


@router.get("/tasks", response_model=list[TaskResponse])
async def get_tasks(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    prompts = await WritingService.get_prompts(db)
    return [_prompt_to_task(p) for p in prompts]


@router.get("/tasks/task1", response_model=list[TaskResponse])
async def get_task1_lessons(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    prompts = await WritingService.get_prompts_by_task_type(db, "task1")
    return [_prompt_to_task(p) for p in prompts]


@router.get("/tasks/task2", response_model=list[TaskResponse])
async def get_task2_lessons(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    prompts = await WritingService.get_prompts_by_task_type(db, "task2")
    return [_prompt_to_task(p) for p in prompts]


@router.get("/tasks/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    prompt = await WritingService.get_prompt_by_id(db, task_id)
    if not prompt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return _prompt_to_task(prompt)


@router.post("/tasks/{task_id}/submit", response_model=EssayResponse, status_code=status.HTTP_201_CREATED)
async def submit_task(
    task_id: int,
    data: TaskSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    prompt = await WritingService.get_prompt_by_id(db, task_id)
    if not prompt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    from app.schemas.writing import EssaySubmit
    essay_data = EssaySubmit(title=data.title or prompt.title, text=data.text)
    essay = await WritingService.submit_essay(db, current_user.id, essay_data)
    return essay


@router.get("/tasks/{task_id}/feedback", response_model=WritingResultResponse)
async def get_feedback(
    task_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from sqlalchemy import select
    from app.models.user import WritingResult, Essay

    result = await db.execute(
        select(WritingResult)
        .join(Essay, WritingResult.essay_id == Essay.id)
        .filter(
            Essay.user_id == current_user.id,
            Essay.id == task_id,
        )
        .order_by(WritingResult.created_at.desc())
        .limit(1)
    )
    wr = result.scalar_one_or_none()

    if not wr:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No feedback found for this task",
        )
    return wr


@router.get("/scores", response_model=list[ScoreItem])
async def get_scores(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await WritingService.get_scores(db, current_user.id)


@router.get("/progress", response_model=ProgressResponse)
async def get_progress(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await WritingService.get_progress(db, current_user.id)
