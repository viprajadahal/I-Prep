import os
import json
import shutil
from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File, Form
from sqlalchemy import select, func, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.config import settings
from app.models.user import User
from app.models.reading import ReadingPassage, ReadingQuestion, ReadingAttempt, ReadingAnswerRecord
from app.models.resource import StudyResource
from app.models.speak import SpeakingQuestion, ListeningTest
from app.models.admin_models import AuditLog, Notification, SiteSettings
from app.routers.auth import get_current_admin, get_current_user, hash_password

router = APIRouter(prefix="/admin", tags=["admin"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
os.makedirs(os.path.join(UPLOAD_DIR, "resources"), exist_ok=True)


async def log_audit(db: AsyncSession, admin: User, action: str, module: str, description: str, target_id: int = None):
    log = AuditLog(
        admin_id=admin.id,
        admin_email=admin.email,
        action=action,
        module=module,
        description=description,
        target_id=target_id,
    )
    db.add(log)
    await db.flush()


# ========== DASHBOARD ==========

@router.get("/dashboard/stats")
async def dashboard_stats(
    current_user: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db)
):
    total_students = (await db.execute(select(func.count(User.id)).where(User.role == "student"))).scalar() or 0
    total_admins = (await db.execute(select(func.count(User.id)).where(User.role == "admin"))).scalar() or 0
    total_users = (await db.execute(select(func.count(User.id)))).scalar() or 0
    total_resources = (await db.execute(select(func.count(StudyResource.id)))).scalar() or 0
    total_passages = (await db.execute(select(func.count(ReadingPassage.id)))).scalar() or 0
    total_questions = (await db.execute(select(func.count(ReadingQuestion.id)))).scalar() or 0
    total_attempts = (await db.execute(select(func.count(ReadingAttempt.id)))).scalar() or 0
    total_speaking = (await db.execute(select(func.count(SpeakingQuestion.id)))).scalar() or 0
    total_listening = (await db.execute(select(func.count(ListeningTest.id)))).scalar() or 0

    avg_score_result = await db.execute(
        select(func.avg(ReadingAttempt.score * 100.0 / ReadingAttempt.total_questions))
        .where(and_(ReadingAttempt.score.isnot(None), ReadingAttempt.total_questions > 0))
    )
    avg_score = round(avg_score_result.scalar() or 0, 1)

    recent_users = (await db.execute(
        select(User).order_by(User.created_at.desc()).limit(5)
    )).scalars().all()

    recent_logs = (await db.execute(
        select(AuditLog).order_by(AuditLog.created_at.desc()).limit(10)
    )).scalars().all()

    return {
        "total_students": total_students,
        "total_admins": total_admins,
        "total_users": total_users,
        "total_resources": total_resources,
        "total_passages": total_passages,
        "total_questions": total_questions,
        "total_attempts": total_attempts,
        "total_speaking_questions": total_speaking,
        "total_listening_tests": total_listening,
        "avg_score": avg_score,
        "recent_users": [
            {"id": u.id, "email": u.email, "full_name": u.full_name, "role": u.role,
             "is_active": u.is_active, "created_at": u.created_at.isoformat() if u.created_at else None}
            for u in recent_users
        ],
        "recent_activities": [
            {"id": l.id, "admin_email": l.admin_email, "action": l.action, "module": l.module,
             "description": l.description, "created_at": l.created_at.isoformat() if l.created_at else None}
            for l in recent_logs
        ],
    }


# ========== USER MANAGEMENT ==========

@router.get("/users")
async def list_users(
    current_user: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str = Query("", max_length=100),
    role: str = Query("", max_length=20),
    is_active: Optional[bool] = Query(None),
    sort_by: str = Query("created_at", max_length=20),
    sort_order: str = Query("desc", max_length=4),
):
    query = select(User)
    count_query = select(func.count(User.id))

    filters = []
    if search:
        filters.append(or_(User.email.ilike(f"%{search}%"), User.full_name.ilike(f"%{search}%")))
    if role:
        filters.append(User.role == role)
    if is_active is not None:
        filters.append(User.is_active == is_active)

    if filters:
        query = query.where(and_(*filters))
        count_query = count_query.where(and_(*filters))

    total = (await db.execute(count_query)).scalar() or 0

    sort_col = getattr(User, sort_by, User.created_at)
    if sort_order == "asc":
        query = query.order_by(sort_col.asc())
    else:
        query = query.order_by(sort_col.desc())

    offset = (page - 1) * limit
    users = (await db.execute(query.offset(offset).limit(limit))).scalars().all()

    return {
        "users": [
            {"id": u.id, "email": u.email, "full_name": u.full_name, "role": u.role,
             "target_band": u.target_band, "is_active": u.is_active,
             "created_at": u.created_at.isoformat() if u.created_at else None}
            for u in users
        ],
        "total": total, "page": page, "limit": limit,
        "total_pages": max(1, (total + limit - 1) // limit),
    }


@router.get("/users/{user_id}")
async def get_user(user_id: int, current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    user = (await db.execute(select(User).where(User.id == user_id))).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": user.id, "email": user.email, "full_name": user.full_name, "role": user.role,
            "target_band": user.target_band, "is_active": user.is_active,
            "created_at": user.created_at.isoformat() if user.created_at else None}


@router.post("/users")
async def create_user(data: dict, current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    existing = (await db.execute(select(User).where(User.email == data.get("email")))).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=data["email"], full_name=data["full_name"],
        hashed_password=hash_password(data["password"]),
        target_band=data.get("target_band", 7.0), role=data.get("role", "student"),
        is_active=data.get("is_active", True),
    )
    db.add(user)
    await db.flush()
    await log_audit(db, current_user, "create", "users", f"Created user {user.email}", user.id)
    await db.commit()
    return {"id": user.id, "email": user.email, "full_name": user.full_name, "role": user.role,
            "target_band": user.target_band, "is_active": user.is_active}


@router.put("/users/{user_id}")
async def update_user(user_id: int, data: dict, current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    user = (await db.execute(select(User).where(User.id == user_id))).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    for field in ["full_name", "email", "role", "target_band", "is_active"]:
        if field in data:
            setattr(user, field, data[field])
    if "password" in data and data["password"]:
        user.hashed_password = hash_password(data["password"])

    await log_audit(db, current_user, "update", "users", f"Updated user {user.email}", user.id)
    await db.commit()
    return {"id": user.id, "email": user.email, "full_name": user.full_name, "role": user.role,
            "target_band": user.target_band, "is_active": user.is_active}


@router.put("/users/{user_id}/toggle-active")
async def toggle_user_active(user_id: int, current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    user = (await db.execute(select(User).where(User.id == user_id))).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot deactivate yourself")

    user.is_active = not user.is_active
    action = "activated" if user.is_active else "deactivated"
    await log_audit(db, current_user, action, "users", f"{action.title()} user {user.email}", user.id)
    await db.commit()
    return {"id": user.id, "email": user.email, "is_active": user.is_active,
            "message": f"User {action} successfully"}


@router.delete("/users/{user_id}")
async def delete_user(user_id: int, current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    user = (await db.execute(select(User).where(User.id == user_id))).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    email = user.email
    await log_audit(db, current_user, "delete", "users", f"Deleted user {email}", user.id)
    await db.delete(user)
    await db.commit()
    return {"message": "User deleted successfully"}


# ========== RESOURCES ==========

@router.get("/resources")
async def list_resources(
    current_user: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str = Query("", max_length=100),
    category: str = Query("", max_length=50),
):
    query = select(StudyResource)
    count_query = select(func.count(StudyResource.id))
    filters = []
    if search:
        filters.append(or_(StudyResource.title.ilike(f"%{search}%"), StudyResource.description.ilike(f"%{search}%")))
    if category:
        filters.append(StudyResource.category == category)
    if filters:
        query = query.where(and_(*filters))
        count_query = count_query.where(and_(*filters))

    total = (await db.execute(count_query)).scalar() or 0
    offset = (page - 1) * limit
    resources = (await db.execute(query.order_by(StudyResource.created_at.desc()).offset(offset).limit(limit))).scalars().all()

    return {
        "resources": [
            {"id": r.id, "title": r.title, "description": r.description, "category": r.category,
             "file_type": r.file_type, "file_name": r.file_name, "file_path": r.file_path,
             "file_size": r.file_size, "download_count": r.download_count,
             "created_at": r.created_at.isoformat() if r.created_at else None}
            for r in resources
        ],
        "total": total, "page": page, "limit": limit,
        "total_pages": max(1, (total + limit - 1) // limit),
    }


@router.post("/resources")
async def create_resource(
    title: str = Form(...), description: str = Form(""), category: str = Form(...),
    file: UploadFile = File(None),
    current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db),
):
    file_name = ""
    file_path = ""
    file_size = 0
    file_type = "OTHER"

    if file:
        file_name = file.filename
        ext = file_name.rsplit(".", 1)[-1].upper() if "." in file_name else "OTHER"
        file_type = ext
        safe_name = f"{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{file_name}"
        dest = os.path.join(UPLOAD_DIR, "resources", safe_name)
        with open(dest, "wb") as f:
            content = await file.read()
            f.write(content)
        file_size = len(content)
        file_path = f"uploads/resources/{safe_name}"

    resource = StudyResource(
        title=title, description=description, category=category,
        file_name=file_name, file_path=file_path, file_size=file_size,
        file_type=file_type, uploaded_by=current_user.id,
    )
    db.add(resource)
    await db.flush()
    await log_audit(db, current_user, "create", "resources", f"Uploaded resource: {title}", resource.id)
    await db.commit()
    return {"id": resource.id, "title": resource.title, "message": "Resource created"}


@router.put("/resources/{resource_id}")
async def update_resource(resource_id: int, data: dict, current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    resource = (await db.execute(select(StudyResource).where(StudyResource.id == resource_id))).scalar_one_or_none()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    for field in ["title", "description", "category"]:
        if field in data:
            setattr(resource, field, data[field])
    await log_audit(db, current_user, "update", "resources", f"Updated resource: {resource.title}", resource.id)
    await db.commit()
    return {"id": resource.id, "title": resource.title, "message": "Resource updated"}


@router.delete("/resources/{resource_id}")
async def delete_resource(resource_id: int, current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    resource = (await db.execute(select(StudyResource).where(StudyResource.id == resource_id))).scalar_one_or_none()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    title = resource.title
    if resource.file_path and os.path.exists(resource.file_path):
        os.remove(resource.file_path)
    await log_audit(db, current_user, "delete", "resources", f"Deleted resource: {title}", resource.id)
    await db.delete(resource)
    await db.commit()
    return {"message": "Resource deleted"}


@router.get("/resources/{resource_id}/download")
async def download_resource(resource_id: int, db: AsyncSession = Depends(get_db)):
    resource = (await db.execute(select(StudyResource).where(StudyResource.id == resource_id))).scalar_one_or_none()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    resource.download_count = (resource.download_count or 0) + 1
    await db.commit()
    from fastapi.responses import FileResponse
    if not resource.file_path or not os.path.exists(resource.file_path):
        raise HTTPException(status_code=404, detail="File not found on disk")
    return FileResponse(resource.file_path, filename=resource.file_name)


# ========== MOCK TESTS - READING ==========

@router.get("/mock-tests/reading")
async def list_reading_passages(
    current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1), limit: int = Query(10, ge=1, le=100), search: str = Query(""),
):
    query = select(ReadingPassage)
    count_query = select(func.count(ReadingPassage.id))
    if search:
        f = ReadingPassage.title.ilike(f"%{search}%")
        query = query.where(f)
        count_query = count_query.where(f)
    total = (await db.execute(count_query)).scalar() or 0
    passages = (await db.execute(query.order_by(ReadingPassage.created_at.desc()).offset((page - 1) * limit).limit(limit))).scalars().all()

    result = []
    for p in passages:
        qcount = (await db.execute(select(func.count(ReadingQuestion.id)).where(ReadingQuestion.passage_id == p.id))).scalar() or 0
        result.append({"id": p.id, "title": p.title, "passage_text": (p.passage_text or "")[:200],
                        "difficulty": p.difficulty, "question_count": qcount,
                        "created_at": p.created_at.isoformat() if p.created_at else None})
    return {"passages": result, "total": total, "page": page, "limit": limit,
            "total_pages": max(1, (total + limit - 1) // limit)}


@router.post("/mock-tests/reading")
async def create_reading_passage(data: dict, current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    passage = ReadingPassage(title=data["title"], passage_text=data["passage_text"], difficulty=data.get("difficulty", "medium"))
    db.add(passage)
    await db.flush()
    for q_data in data.get("questions", []):
        db.add(ReadingQuestion(passage_id=passage.id, question_type=q_data["question_type"],
                                question_text=q_data["question_text"], options=q_data.get("options"),
                                correct_answer=q_data["correct_answer"], skill_type=q_data.get("skill_type")))
    await log_audit(db, current_user, "create", "mock_tests", f"Created reading passage: {data['title']}", passage.id)
    await db.commit()
    return {"id": passage.id, "title": passage.title}


@router.put("/mock-tests/reading/{passage_id}")
async def update_reading_passage(passage_id: int, data: dict, current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    passage = (await db.execute(select(ReadingPassage).where(ReadingPassage.id == passage_id))).scalar_one_or_none()
    if not passage:
        raise HTTPException(status_code=404, detail="Passage not found")
    for field in ["title", "passage_text", "difficulty"]:
        if field in data:
            setattr(passage, field, data[field])
    await log_audit(db, current_user, "update", "mock_tests", f"Updated reading passage: {passage.title}", passage.id)
    await db.commit()
    return {"id": passage.id, "title": passage.title}


@router.delete("/mock-tests/reading/{passage_id}")
async def delete_reading_passage(passage_id: int, current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    passage = (await db.execute(select(ReadingPassage).where(ReadingPassage.id == passage_id))).scalar_one_or_none()
    if not passage:
        raise HTTPException(status_code=404, detail="Passage not found")
    title = passage.title
    await log_audit(db, current_user, "delete", "mock_tests", f"Deleted reading passage: {title}", passage.id)
    await db.delete(passage)
    await db.commit()
    return {"message": "Passage deleted"}


# ========== MOCK TESTS - SPEAKING ==========

@router.get("/mock-tests/speaking")
async def list_speaking_questions(
    current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1), limit: int = Query(10, ge=1, le=100), search: str = Query(""),
):
    query = select(SpeakingQuestion)
    count_query = select(func.count(SpeakingQuestion.id))
    if search:
        f = SpeakingQuestion.text.ilike(f"%{search}%")
        query = query.where(f)
        count_query = count_query.where(f)
    total = (await db.execute(count_query)).scalar() or 0
    questions = (await db.execute(query.order_by(SpeakingQuestion.id.desc()).offset((page - 1) * limit).limit(limit))).scalars().all()
    return {"questions": [{"id": q.id, "text": q.text, "difficulty": q.difficulty,
                            "category": q.category, "examiner_audio_path": q.examiner_audio_path} for q in questions],
            "total": total, "page": page, "limit": limit, "total_pages": max(1, (total + limit - 1) // limit)}


@router.post("/mock-tests/speaking")
async def create_speaking_question(data: dict, current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    q = SpeakingQuestion(text=data["text"], examiner_audio_path=data.get("examiner_audio_path", ""),
                          difficulty=data.get("difficulty", "Beginner"), category=data.get("category", "General"))
    db.add(q)
    await db.flush()
    await log_audit(db, current_user, "create", "mock_tests", f"Created speaking question", q.id)
    await db.commit()
    return {"id": q.id, "text": q.text}


@router.put("/mock-tests/speaking/{question_id}")
async def update_speaking_question(question_id: int, data: dict, current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    q = (await db.execute(select(SpeakingQuestion).where(SpeakingQuestion.id == question_id))).scalar_one_or_none()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    for field in ["text", "difficulty", "category", "examiner_audio_path"]:
        if field in data:
            setattr(q, field, data[field])
    await log_audit(db, current_user, "update", "mock_tests", "Updated speaking question", q.id)
    await db.commit()
    return {"id": q.id, "text": q.text}


@router.delete("/mock-tests/speaking/{question_id}")
async def delete_speaking_question(question_id: int, current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    q = (await db.execute(select(SpeakingQuestion).where(SpeakingQuestion.id == question_id))).scalar_one_or_none()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    await log_audit(db, current_user, "delete", "mock_tests", "Deleted speaking question", q.id)
    await db.delete(q)
    await db.commit()
    return {"message": "Question deleted"}


# ========== MOCK TESTS - LISTENING ==========

@router.get("/mock-tests/listening")
async def list_listening_tests(
    current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1), limit: int = Query(10, ge=1, le=100), search: str = Query(""),
):
    query = select(ListeningTest)
    count_query = select(func.count(ListeningTest.id))
    if search:
        f = ListeningTest.title.ilike(f"%{search}%")
        query = query.where(f)
        count_query = count_query.where(f)
    total = (await db.execute(count_query)).scalar() or 0
    tests = (await db.execute(query.order_by(ListeningTest.id.desc()).offset((page - 1) * limit).limit(limit))).scalars().all()
    return {"tests": [{"id": t.id, "title": t.title, "difficulty": t.difficulty, "audio_path": t.audio_path} for t in tests],
            "total": total, "page": page, "limit": limit, "total_pages": max(1, (total + limit - 1) // limit)}


@router.post("/mock-tests/listening")
async def create_listening_test(data: dict, current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    t = ListeningTest(title=data["title"], audio_path=data.get("audio_path", ""),
                       difficulty=data.get("difficulty", "easy"),
                       questions_json=data.get("questions_json", "[]"), answers_json=data.get("answers_json", "[]"))
    db.add(t)
    await db.flush()
    await log_audit(db, current_user, "create", "mock_tests", f"Created listening test: {data['title']}", t.id)
    await db.commit()
    return {"id": t.id, "title": t.title}


@router.put("/mock-tests/listening/{test_id}")
async def update_listening_test(test_id: int, data: dict, current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    t = (await db.execute(select(ListeningTest).where(ListeningTest.id == test_id))).scalar_one_or_none()
    if not t:
        raise HTTPException(status_code=404, detail="Test not found")
    for field in ["title", "difficulty", "audio_path", "questions_json", "answers_json"]:
        if field in data:
            setattr(t, field, data[field])
    await log_audit(db, current_user, "update", "mock_tests", f"Updated listening test: {t.title}", t.id)
    await db.commit()
    return {"id": t.id, "title": t.title}


@router.delete("/mock-tests/listening/{test_id}")
async def delete_listening_test(test_id: int, current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    t = (await db.execute(select(ListeningTest).where(ListeningTest.id == test_id))).scalar_one_or_none()
    if not t:
        raise HTTPException(status_code=404, detail="Test not found")
    await log_audit(db, current_user, "delete", "mock_tests", f"Deleted listening test: {t.title}", t.id)
    await db.delete(t)
    await db.commit()
    return {"message": "Test deleted"}


# ========== QUESTION BANK ==========

@router.get("/question-bank")
async def list_questions(
    current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1), limit: int = Query(10, ge=1, le=100),
    search: str = Query(""), question_type: str = Query(""), skill_type: str = Query(""),
):
    query = select(ReadingQuestion).join(ReadingPassage, ReadingQuestion.passage_id == ReadingPassage.id)
    count_query = select(func.count(ReadingQuestion.id)).join(ReadingPassage, ReadingQuestion.passage_id == ReadingPassage.id)
    filters = []
    if search:
        filters.append(ReadingQuestion.question_text.ilike(f"%{search}%"))
    if question_type:
        filters.append(ReadingQuestion.question_type == question_type)
    if skill_type:
        filters.append(ReadingQuestion.skill_type == skill_type)
    if filters:
        query = query.where(and_(*filters))
        count_query = count_query.where(and_(*filters))

    total = (await db.execute(count_query)).scalar() or 0
    questions = (await db.execute(query.order_by(ReadingQuestion.id.desc()).offset((page - 1) * limit).limit(limit))).scalars().all()

    result = []
    for q in questions:
        passage = (await db.execute(select(ReadingPassage).where(ReadingPassage.id == q.passage_id))).scalar_one_or_none()
        result.append({"id": q.id, "passage_id": q.passage_id, "passage_title": passage.title if passage else "Unknown",
                        "question_type": q.question_type, "question_text": q.question_text,
                        "options": q.options, "correct_answer": q.correct_answer, "skill_type": q.skill_type})
    return {"questions": result, "total": total, "page": page, "limit": limit,
            "total_pages": max(1, (total + limit - 1) // limit)}


@router.post("/question-bank")
async def create_question(data: dict, current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    q = ReadingQuestion(passage_id=data["passage_id"], question_type=data["question_type"],
                         question_text=data["question_text"], options=data.get("options"),
                         correct_answer=data["correct_answer"], skill_type=data.get("skill_type"))
    db.add(q)
    await db.flush()
    await log_audit(db, current_user, "create", "question_bank", f"Created question", q.id)
    await db.commit()
    return {"id": q.id, "question_text": q.question_text}


@router.put("/question-bank/{question_id}")
async def update_question(question_id: int, data: dict, current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    q = (await db.execute(select(ReadingQuestion).where(ReadingQuestion.id == question_id))).scalar_one_or_none()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    for field in ["passage_id", "question_type", "question_text", "options", "correct_answer", "skill_type"]:
        if field in data:
            setattr(q, field, data[field])
    await log_audit(db, current_user, "update", "question_bank", "Updated question", q.id)
    await db.commit()
    return {"id": q.id, "question_text": q.question_text}


@router.delete("/question-bank/{question_id}")
async def delete_question(question_id: int, current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    q = (await db.execute(select(ReadingQuestion).where(ReadingQuestion.id == question_id))).scalar_one_or_none()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    await log_audit(db, current_user, "delete", "question_bank", "Deleted question", q.id)
    await db.delete(q)
    await db.commit()
    return {"message": "Question deleted"}


# ========== STUDENT RESULTS ==========

@router.get("/results")
async def list_student_results(
    current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1), limit: int = Query(10, ge=1, le=100),
    search: str = Query(""), user_id: int = Query(0),
):
    query = select(ReadingAttempt, User.full_name, User.email).join(User, ReadingAttempt.user_id == User.id)
    count_query = select(func.count(ReadingAttempt.id)).join(User, ReadingAttempt.user_id == User.id)
    filters = []
    if search:
        filters.append(or_(User.full_name.ilike(f"%{search}%"), User.email.ilike(f"%{search}%")))
    if user_id:
        filters.append(ReadingAttempt.user_id == user_id)
    if filters:
        query = query.where(and_(*filters))
        count_query = count_query.where(and_(*filters))

    total = (await db.execute(count_query)).scalar() or 0
    rows = (await db.execute(query.order_by(ReadingAttempt.created_at.desc()).offset((page - 1) * limit).limit(limit))).all()
    results = [
        {"id": a.id, "user_id": a.user_id, "user_name": name, "user_email": email,
         "passage_id": a.passage_id, "score": a.score, "total_questions": a.total_questions,
         "percentage": round((a.score / a.total_questions * 100) if a.total_questions and a.score else 0, 1),
         "skill_type": a.skill_type, "created_at": a.created_at.isoformat() if a.created_at else None}
        for a, name, email in rows
    ]
    return {"results": results, "total": total, "page": page, "limit": limit,
            "total_pages": max(1, (total + limit - 1) // limit)}


@router.delete("/results/{result_id}")
async def delete_result(result_id: int, current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    attempt = (await db.execute(select(ReadingAttempt).where(ReadingAttempt.id == result_id))).scalar_one_or_none()
    if not attempt:
        raise HTTPException(status_code=404, detail="Result not found")
    await log_audit(db, current_user, "delete", "results", f"Deleted result #{result_id}", result_id)
    await db.delete(attempt)
    await db.commit()
    return {"message": "Result deleted"}


# ========== NOTIFICATIONS ==========

@router.get("/notifications")
async def list_notifications(current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    notifs = (await db.execute(select(Notification).order_by(Notification.created_at.desc()))).scalars().all()
    return {"notifications": [
        {"id": n.id, "title": n.title, "message": n.message, "type": n.type,
         "broadcast": n.broadcast, "created_at": n.created_at.isoformat() if n.created_at else None}
        for n in notifs
    ]}


@router.post("/notifications")
async def create_notification(data: dict, current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    n = Notification(title=data["title"], message=data["message"], type=data.get("type", "info"),
                      broadcast=data.get("broadcast", False), created_by=current_user.id)
    db.add(n)
    await db.flush()
    await log_audit(db, current_user, "create", "notifications", f"Created notification: {data['title']}", n.id)
    await db.commit()
    return {"id": n.id, "title": n.title, "message": n.message, "type": n.type, "broadcast": n.broadcast,
            "created_at": n.created_at.isoformat() if n.created_at else None}


@router.put("/notifications/{notification_id}")
async def update_notification(notification_id: int, data: dict, current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    n = (await db.execute(select(Notification).where(Notification.id == notification_id))).scalar_one_or_none()
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found")
    for field in ["title", "message", "type", "broadcast"]:
        if field in data:
            setattr(n, field, data[field])
    await log_audit(db, current_user, "update", "notifications", f"Updated notification: {n.title}", n.id)
    await db.commit()
    return {"id": n.id, "title": n.title, "message": n.message}


@router.delete("/notifications/{notification_id}")
async def delete_notification(notification_id: int, current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    n = (await db.execute(select(Notification).where(Notification.id == notification_id))).scalar_one_or_none()
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found")
    await log_audit(db, current_user, "delete", "notifications", f"Deleted notification: {n.title}", n.id)
    await db.delete(n)
    await db.commit()
    return {"message": "Notification deleted"}


# ========== SETTINGS ==========

DEFAULT_SETTINGS = {
    "site_name": "iPrep IELTS",
    "contact_email": "admin@iprep.com",
    "maintenance_mode": "false",
    "about": "iPrep IELTS is a comprehensive IELTS preparation platform.",
    "privacy_policy": "",
    "terms": "",
    "logo_url": "",
}


@router.get("/settings")
async def get_settings(current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    rows = (await db.execute(select(SiteSettings))).scalars().all()
    settings_dict = {s.key: s.value for s in rows}
    for key, default in DEFAULT_SETTINGS.items():
        if key not in settings_dict:
            settings_dict[key] = default
    return settings_dict


@router.put("/settings")
async def update_settings(data: dict, current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    for key, value in data.items():
        row = (await db.execute(select(SiteSettings).where(SiteSettings.key == key))).scalar_one_or_none()
        if row:
            row.value = str(value) if value is not None else ""
        else:
            db.add(SiteSettings(key=key, value=str(value) if value is not None else ""))
    await log_audit(db, current_user, "update", "settings", "Updated site settings")
    await db.commit()
    return {"message": "Settings updated"}


# ========== ANALYTICS ==========

@router.get("/analytics/overview")
async def analytics_overview(current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db)):
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)

    user_growth = [
        {"date": str(r[0]), "count": r[1]}
        for r in (await db.execute(
            select(func.date(User.created_at).label("date"), func.count(User.id).label("count"))
            .where(User.created_at >= thirty_days_ago)
            .group_by(func.date(User.created_at)).order_by(func.date(User.created_at))
        )).all()
    ]

    attempts_growth = [
        {"date": str(r[0]), "count": r[1]}
        for r in (await db.execute(
            select(func.date(ReadingAttempt.created_at).label("date"), func.count(ReadingAttempt.id).label("count"))
            .where(ReadingAttempt.created_at >= thirty_days_ago)
            .group_by(func.date(ReadingAttempt.created_at)).order_by(func.date(ReadingAttempt.created_at))
        )).all()
    ]

    score_by_difficulty = [
        {"difficulty": r[0] or "unknown", "avg_score": round(r[1] or 0, 1)}
        for r in (await db.execute(
            select(ReadingPassage.difficulty, func.avg(ReadingAttempt.score * 100.0 / ReadingAttempt.total_questions))
            .join(ReadingPassage, ReadingAttempt.passage_id == ReadingPassage.id)
            .where(and_(ReadingAttempt.score.isnot(None), ReadingAttempt.total_questions > 0))
            .group_by(ReadingPassage.difficulty)
        )).all()
    ]

    resource_by_category = [
        {"category": r[0], "count": r[1]}
        for r in (await db.execute(
            select(StudyResource.category, func.count(StudyResource.id))
            .group_by(StudyResource.category)
        )).all()
    ]

    return {
        "user_growth": user_growth,
        "attempts_growth": attempts_growth,
        "score_by_difficulty": score_by_difficulty,
        "resource_by_category": resource_by_category,
    }


# ========== AUDIT LOGS ==========

@router.get("/audit-logs")
async def list_audit_logs(
    current_user: User = Depends(get_current_admin), db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1), limit: int = Query(20, ge=1, le=100),
    module: str = Query(""),
):
    query = select(AuditLog)
    count_query = select(func.count(AuditLog.id))
    if module:
        query = query.where(AuditLog.module == module)
        count_query = count_query.where(AuditLog.module == module)

    total = (await db.execute(count_query)).scalar() or 0
    logs = (await db.execute(query.order_by(AuditLog.created_at.desc()).offset((page - 1) * limit).limit(limit))).scalars().all()

    return {
        "logs": [
            {"id": l.id, "admin_email": l.admin_email, "action": l.action, "module": l.module,
             "description": l.description, "target_id": l.target_id,
             "created_at": l.created_at.isoformat() if l.created_at else None}
            for l in logs
        ],
        "total": total, "page": page, "limit": limit,
        "total_pages": max(1, (total + limit - 1) // limit),
    }
