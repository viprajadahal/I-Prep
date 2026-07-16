from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Generic, TypeVar

T = TypeVar("T")

class APIResponse(BaseModel, Generic[T]):
    success: bool
    message: str
    data: Optional[T] = None


class ResourceCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    resource_type: str
    thumbnail_url: Optional[str] = None


class ResourceResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    category: str
    resource_type: str
    thumbnail_url: Optional[str] = None
    file_name: str
    file_path: str
    file_size: int
    download_count: int
    uploaded_by: int
    created_at: datetime

    @classmethod
    def from_orm(cls, obj):
        return cls.model_validate(obj, from_attributes=True)


class StudyResourceCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    file_type: str


class StudyResourceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    file_type: Optional[str] = None


class StudyResourceResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    category: str
    file_name: str
    file_path: str
    file_size: int
    file_type: str
    thumbnail_url: Optional[str] = None
    duration: Optional[str] = None
    download_count: int
    created_at: datetime
    updated_at: datetime
    uploaded_by: int

    @classmethod
    def from_attributes(cls, obj):
        return cls.model_validate(obj, from_attributes=True)
