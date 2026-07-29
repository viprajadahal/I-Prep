import bcrypt
from jose import jwt, JWTError
from pydantic import BaseModel
from sqlalchemy import select

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, Token, LoginRequest
from app.utils.dependencies import get_current_user
from datetime import datetime, timedelta

router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer()


def hash_password(password: str):
    return bcrypt.hashpw(password[:72].encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password[:72].encode("utf-8"), hashed.encode("utf-8"))


def create_token(user_id: int):
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(
        {"sub": str(user_id), "exp": expire},
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )


@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(select(User).where(User.email == user_data.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=hash_password(user_data.password),
        target_band=user_data.target_band
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.post("/login", response_model=Token)
async def login(email: str, password: str, db: AsyncSession = Depends(get_db)):
    print(f"[LOGIN] Attempt for email={email}")
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if not user:
        print(f"[LOGIN] No user found for email={email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    print(f"[LOGIN] User found id={user.id}, verifying password...")
    if not verify_password(password, user.hashed_password):
        print(f"[LOGIN] Password verification FAILED for email={email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = create_token(user.id)
    print(f"[LOGIN] Success for user_id={user.id}, token={token[:20]}...")
    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


# ---- Update profile ----

class UserUpdate(BaseModel):
    full_name: str
    target_band: float


@router.patch("/me", response_model=UserResponse)
async def update_me(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    current_user.full_name = data.full_name
    current_user.target_band = data.target_band
    await db.commit()
    await db.refresh(current_user)
    return current_user
