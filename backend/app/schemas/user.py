from pydantic import BaseModel, EmailStr

# what the frontend sends when registering
class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    target_band: float = 7.0
    role: str = "student"

# what we send back (never include password)
class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    target_band: float
    role: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str