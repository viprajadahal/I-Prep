from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, Token, LoginRequest


router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"])

security = HTTPBearer()


def hash_password(password: str):
    return pwd_context.hash(password[:72])


def create_token(user_id: int):
    expire = datetime.utcnow() + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    return jwt.encode(
        {
            "sub": str(user_id),
            "exp": expire
        },
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )


@router.post("/register", response_model=UserResponse)
async def register(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    # Check if email is already registered
    existing = await db.execute(
        select(User).where(User.email == user_data.email)
    )

    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
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
async def login(
    credentials: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    # Find user by email
    result = await db.execute(
        select(User).where(User.email == credentials.email)
    )

    user = result.scalar_one_or_none()

    # Reject if user doesn't exist or password is incorrect
    if not user or not pwd_context.verify(
        credentials.password[:72],
        user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Create and return JWT token
    return {
        "access_token": create_token(user.id),
        "token_type": "bearer"
    }


async def get_current_user(
    token: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Extract JWT from "Authorization: Bearer <token>"
        payload = jwt.decode(
            token.credentials,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        user_id = int(payload.get("sub"))

    except (JWTError, TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

    # Find the authenticated user
    result = await db.execute(
        select(User).where(User.id == user_id)
    )

    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    return user


@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user