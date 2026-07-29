from typing import Optional

from jose import jwt, JWTError
from pydantic import BaseModel

from app.config import settings


def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except (JWTError, TypeError):
        return None