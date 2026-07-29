from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.analytics import WritingAnalytics, ReadingAnalytics
from app.services.analytics_service import AnalyticsService
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/writing", response_model=WritingAnalytics)
def get_writing_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return AnalyticsService.get_writing_analytics(db, current_user.id)


@router.get("/reading", response_model=ReadingAnalytics)
def get_reading_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return AnalyticsService.get_reading_analytics(db, current_user.id)