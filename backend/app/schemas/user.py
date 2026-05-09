from pydantic import BaseModel, EmailStr

# what the frontend sends when registering
class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    target_band: float = 7.0

# what we send back (never include password)
class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    target_band: float

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str