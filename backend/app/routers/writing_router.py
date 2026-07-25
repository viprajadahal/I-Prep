from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User, WritingResult
from app.schemas.writing import (
    EssaySubmit,
    EssayResponse,
    WritingEvaluateRequest,
    WritingEvaluationResponse,
    WritingHistoryItem,
    WritingPromptResponse,
    WritingResultResponse,
)
from app.services.writing_service import WritingService
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/writing", tags=["Writing"])


@router.get("/prompts", response_model=list[WritingPromptResponse])
async def get_writing_prompts(
    module: str = None,
    task_type: str = None,
    subtype: str = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await WritingService.get_prompts(db, module=module, task_type=task_type, subtype=subtype)


@router.get("/prompts/{task_type}", response_model=list[WritingPromptResponse])
async def get_writing_prompts_by_task_type(
    task_type: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    prompts = await WritingService.get_prompts_by_task_type(db, task_type)
    if not prompts:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Writing prompts not found")
    return prompts


@router.get("/prompts/{task_type}/random", response_model=WritingPromptResponse)
async def get_random_writing_prompt(
    task_type: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    prompt = await WritingService.get_random_prompt(db, task_type, current_user.id)
    if not prompt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Writing prompt not found")
    return prompt


@router.post("/submit", response_model=EssayResponse, status_code=status.HTTP_201_CREATED)
async def submit_essay(
    essay_data: EssaySubmit,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        essay = await WritingService.submit_essay(db, current_user.id, essay_data)
        return essay
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/evaluate", response_model=WritingEvaluationResponse)
async def evaluate_essay(
    request: WritingEvaluateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        result = await WritingService.evaluate_essay(db, current_user.id, request)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.get("/essays", response_model=list[EssayResponse])
async def get_user_essays(
    limit: int = 50,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    essays = await WritingService.get_user_essays(db, current_user.id, limit=limit, offset=offset)
    return essays


@router.get("/essays/{essay_id}", response_model=EssayResponse)
async def get_essay(
    essay_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    essay = await WritingService.get_essay_by_id(db, essay_id, current_user.id)
    if not essay:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Essay not found")
    return essay


@router.get("/history", response_model=list[WritingHistoryItem])
async def get_writing_history(
    limit: int = 50,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await WritingService.get_writing_history(db, current_user.id, limit=limit, offset=offset)


@router.get("/results/{essay_id}", response_model=WritingResultResponse)
async def get_writing_result(
    essay_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(WritingResult).filter(
            WritingResult.essay_id == essay_id,
            WritingResult.user_id == current_user.id,
        )
    )
    wr = result.scalar_one_or_none()

    if not wr:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Writing result not found")
    return wr


@router.get("/results-batch", response_model=list[WritingResultResponse])
async def get_results_batch(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(WritingResult).filter(WritingResult.user_id == current_user.id)
    )
    return list(result.scalars().all())
