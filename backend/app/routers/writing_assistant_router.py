from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User, WritingPrompt
from app.services.writing_assistant import get_assistant_data
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/writing", tags=["Writing Assistant"])


@router.get("/assistant/{prompt_id}")
async def get_writing_assistant(
    prompt_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from sqlalchemy import select

    result = await db.execute(
        select(WritingPrompt).filter(WritingPrompt.id == prompt_id)
    )
    prompt = result.scalar_one_or_none()

    if not prompt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt not found",
        )

    return get_assistant_data(
        module=prompt.module,
        task_type=prompt.task_type,
        subtype=prompt.subtype or "",
        prompt_text=prompt.prompt_text,
    )
