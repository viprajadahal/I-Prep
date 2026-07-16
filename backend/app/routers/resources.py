import os
import shutil
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form, Request
from fastapi.responses import FileResponse
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.resource import Resource
from app.models.user import User
from app.schemas.resource import APIResponse, ResourceResponse
from app.routers.auth import get_current_user
from fastapi import Query

router = APIRouter(prefix="/resources", tags=["resources"])

UPLOAD_DIR = os.path.join("uploads", "resources")
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".mp3", ".mp4"}

def ensure_upload_dir():
    os.makedirs(UPLOAD_DIR, exist_ok=True)

async def get_current_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can perform this action"
        )
    return current_user

# Helper to validate and save upload file
async def save_upload_file(file: UploadFile) -> str:
    ensure_upload_dir()
    
    # 1. Validate File Extension
    _, ext = os.path.splitext(file.filename)
    ext = ext.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File extension {ext} not allowed. Supported: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # 2. Validate File Size (Max 20MB)
    await file.seek(0, 2)
    file_size = await file.tell()
    await file.seek(0)
    
    if file_size > 20 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds maximum allowed size of 20MB"
        )
        
    # 3. Save File
    # Clean filename to avoid directory traversal
    safe_filename = os.path.basename(file.filename).replace(" ", "_")
    # Avoid duplicate name issues by appending numbers if needed
    name, ext = os.path.splitext(safe_filename)
    counter = 1
    final_filename = safe_filename
    while os.path.exists(os.path.join(UPLOAD_DIR, final_filename)):
        final_filename = f"{name}_{counter}{ext}"
        counter += 1
        
    dest_path = os.path.join(UPLOAD_DIR, final_filename)
    with open(dest_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return final_filename

@router.get("", response_model=APIResponse[List[ResourceResponse]])
async def get_resources(
    db: AsyncSession = Depends(get_db),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    query = select(Resource).order_by(Resource.created_at.desc())
    
    if category and category != "All":
        query = query.where(Resource.category.ilike(f"%{category}%"))
    
    if search:
        query = query.where(
            or_(
                Resource.title.ilike(f"%{search}%"),
                Resource.category.ilike(f"%{search}%"),
                Resource.description.ilike(f"%{search}%")
            )
        )
    
    result = await db.execute(query)
    resources = result.scalars().all()
    return APIResponse(
        success=True,
        message="Resources fetched successfully",
        data=[ResourceResponse.from_orm(r) for r in resources]
    )

@router.get("/search", response_model=APIResponse[List[ResourceResponse]])
async def search_resources(q: str = "", db: AsyncSession = Depends(get_db)):
    query = select(Resource)
    if q:
        query = query.where(
            or_(
                Resource.title.ilike(f"%{q}%"),
                Resource.category.ilike(f"%{q}%")
            )
        )
    result = await db.execute(query.order_by(Resource.created_at.desc()))
    resources = result.scalars().all()
    return APIResponse(
        success=True,
        message="Search completed successfully",
        data=[ResourceResponse.from_orm(r) for r in resources]
    )

@router.get("/category/{category}", response_model=APIResponse[List[ResourceResponse]])
async def get_resources_by_category(category: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Resource)
        .where(Resource.category.ilike(category))
        .order_by(Resource.created_at.desc())
    )
    resources = result.scalars().all()
    return APIResponse(
        success=True,
        message=f"Category '{category}' resources fetched successfully",
        data=[ResourceResponse.from_orm(r) for r in resources]
    )

@router.get("/{id}", response_model=APIResponse[ResourceResponse])
async def get_resource(id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Resource).where(Resource.id == id))
    resource = result.scalar_one_or_none()
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )
    return APIResponse(
        success=True,
        message="Resource fetched successfully",
        data=ResourceResponse.from_orm(resource)
    )

@router.post("/upload", response_model=APIResponse[ResourceResponse], status_code=status.HTTP_201_CREATED)
async def upload_resource(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    category: str = Form(...),
    resource_type: str = Form(...),
    thumbnail_url: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    # Save the file
    final_filename = await save_upload_file(file)
    file_path = os.path.join(UPLOAD_DIR, final_filename)
    file_size = os.path.getsize(file_path)

    resource = Resource(
        title=title,
        description=description,
        category=category,
        resource_type=resource_type,
        thumbnail_url=thumbnail_url,
        file_name=final_filename,
        file_path=file_path,
        file_size=file_size,
        uploaded_by=current_admin.id
    )

    db.add(resource)
    await db.commit()
    await db.refresh(resource)

    return APIResponse(
        success=True,
        message="Resource uploaded successfully",
        data=ResourceResponse.from_orm(resource)
    )

@router.put("/{id}", response_model=APIResponse[ResourceResponse])
async def update_resource(
    id: int,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    resource_type: Optional[str] = Form(None),
    thumbnail_url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    result = await db.execute(select(Resource).where(Resource.id == id))
    resource = result.scalar_one_or_none()
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )

    if title is not None:
        resource.title = title
    if description is not None:
        resource.description = description
    if category is not None:
        resource.category = category
    if resource_type is not None:
        resource.resource_type = resource_type
    if thumbnail_url is not None:
        resource.thumbnail_url = thumbnail_url

    if file is not None:
        # Save new file
        final_filename = await save_upload_file(file)
        new_file_path = os.path.join(UPLOAD_DIR, final_filename)
        new_file_size = os.path.getsize(new_file_path)

        # Delete old file
        if os.path.exists(resource.file_path):
            try:
                os.remove(resource.file_path)
            except Exception:
                pass

        resource.file_name = final_filename
        resource.file_path = new_file_path
        resource.file_size = new_file_size

    await db.commit()
    await db.refresh(resource)

    return APIResponse(
        success=True,
        message="Resource updated successfully",
        data=ResourceResponse.from_orm(resource)
    )

@router.delete("/{id}", response_model=APIResponse[dict])
async def delete_resource(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    result = await db.execute(select(Resource).where(Resource.id == id))
    resource = result.scalar_one_or_none()
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )

    # Delete local file
    if os.path.exists(resource.file_path):
        try:
            os.remove(resource.file_path)
        except Exception:
            pass

    await db.delete(resource)
    await db.commit()

    return APIResponse(
        success=True,
        message="Resource deleted successfully",
        data={}
    )

@router.get("/{id}/download")
async def download_resource(id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Resource).where(Resource.id == id))
    resource = result.scalar_one_or_none()
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )

    if not os.path.exists(resource.file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File does not exist on server disk"
        )

    # Increment download count
    resource.download_count += 1
    await db.commit()

    return FileResponse(
        path=resource.file_path,
        filename=resource.file_name,
        media_type="application/octet-stream"
    )

@router.get("/preview/{id}", response_model=APIResponse[dict])
async def preview_resource(id: int, request: Request, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Resource).where(Resource.id == id))
    resource = result.scalar_one_or_none()
    if not resource:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found"
        )

    if not os.path.exists(resource.file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File does not exist on server disk"
        )

    ext = os.path.splitext(resource.file_name)[1].lower()
    
    if ext == ".pdf":
        # Return a preview URL
        # Construct absolute URL pointing to static files
        base_url = str(request.base_url).rstrip("/")
        # In main, we mount uploads directory.
        preview_url = f"{base_url}/uploads/resources/{resource.file_name}"
        return APIResponse(
            success=True,
            message="Preview URL generated successfully",
            data={"preview_url": preview_url}
        )
    elif ext == ".mp4":
        # Video streaming - return FileResponse with stream headers
        # FastAPI's FileResponse automatically implements range requests for video streaming.
        return FileResponse(
            path=resource.file_path,
            media_type="video/mp4",
            headers={"Accept-Ranges": "bytes"}
        )
    else:
        return APIResponse(
            success=False,
            message=f"Preview is not supported for file type '{ext}'",
            data=None
        )
