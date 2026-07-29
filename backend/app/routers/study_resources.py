import os
import shutil
import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form, Request, Query
from fastapi.responses import FileResponse
from sqlalchemy import select, or_, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.resource import StudyResource
from app.models.user import User
from app.schemas.resource import APIResponse, StudyResourceResponse
from app.routers.auth import get_current_user

router = APIRouter(prefix="/resources", tags=["resources"])

logger = logging.getLogger(__name__)

UPLOAD_DIR = os.path.join("uploads", "resources")
VIDEO_DIR = os.path.join("uploads", "videos")
THUMBNAIL_DIR = os.path.join("uploads", "thumbnails")
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".ppt", ".pptx", ".zip", ".mp3", ".mp4", ".webm", ".mov"}
VIDEO_EXTENSIONS = {".mp4", ".webm", ".mov"}
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB for videos


def ensure_upload_dir():
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    os.makedirs(VIDEO_DIR, exist_ok=True)
    os.makedirs(THUMBNAIL_DIR, exist_ok=True)


async def get_current_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can perform this action"
        )
    return current_user


async def save_upload_file(file: UploadFile) -> tuple:
    ensure_upload_dir()
    
    _, ext = os.path.splitext(file.filename)
    ext = ext.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File extension {ext} not allowed. Supported: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
        )
    
    await file.seek(0, 2)
    file_size = await file.tell()
    await file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds maximum allowed size of 100MB"
        )
    
    is_video = ext in VIDEO_EXTENSIONS
    dest_dir = VIDEO_DIR if is_video else UPLOAD_DIR
    
    safe_filename = os.path.basename(file.filename).replace(" ", "_")
    name, ext = os.path.splitext(safe_filename)
    counter = 1
    final_filename = safe_filename
    while os.path.exists(os.path.join(dest_dir, final_filename)):
        final_filename = f"{name}_{counter}{ext}"
        counter += 1
    
    dest_path = os.path.join(dest_dir, final_filename)
    with open(dest_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    file_path = dest_path
    
    return final_filename, file_path, file_size


@router.get("", response_model=APIResponse[List[StudyResourceResponse]])
async def get_resources(
    db: AsyncSession = Depends(get_db),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    # TODO: Re-enable JWT authentication after authentication module is completed.
    # current_user: User = Depends(get_current_user)
):
    logger.info(f"GET /resources - Fetching resources with category={category}, search={search}")
    query = select(StudyResource)
    
    conditions = []
    if category and category != "All":
        conditions.append(StudyResource.category.ilike(f"%{category}%"))
    if search:
        conditions.append(
            or_(
                StudyResource.title.ilike(f"%{search}%"),
                StudyResource.description.ilike(f"%{search}%"),
                StudyResource.category.ilike(f"%{search}%")
            )
        )
    
    if conditions:
        query = query.where(and_(*conditions))
    
    result = await db.execute(query.order_by(StudyResource.created_at.desc()))
    resources = result.scalars().all()
    
    response_data = [StudyResourceResponse.from_attributes(r) for r in resources]
    
    logger.info(f"GET /resources - Returning {len(response_data)} resources")
    return APIResponse(
        success=True,
        message="Resources fetched successfully",
        data=response_data
    )


@router.get("/{id}", response_model=APIResponse[StudyResourceResponse])
async def get_resource(
    id: int,
    db: AsyncSession = Depends(get_db),
    # TODO: Re-enable JWT authentication after authentication module is completed.
    # current_user: User = Depends(get_current_user)
):
    try:
        logger.info(f"GET /resources/{id} - Fetching resource")
        result = await db.execute(select(StudyResource).where(StudyResource.id == id))
        resource = result.scalar_one_or_none()
        
        if not resource:
            logger.warning(f"GET /resources/{id} - Resource not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resource not found"
            )
        
        logger.info(f"GET /resources/{id} - Resource found")
        return APIResponse(
            success=True,
            message="Resource fetched successfully",
            data=StudyResourceResponse.from_attributes(resource)
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"GET /resources/{id} - Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch resource"
        )


@router.post("", response_model=APIResponse[StudyResourceResponse], status_code=status.HTTP_201_CREATED)
async def create_resource(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    category: str = Form(...),
    file_type: str = Form(...),
    duration: Optional[str] = Form(None),
    thumbnail_url: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    try:
        logger.info(f"POST /resources - Uploading resource: {title}")
        
        final_filename, file_path, file_size = await save_upload_file(file)
        
        resource = StudyResource(
            title=title,
            description=description,
            category=category,
            file_name=final_filename,
            file_path=file_path,
            file_size=file_size,
            file_type=file_type,
            duration=duration,
            thumbnail_url=thumbnail_url,
            uploaded_by=current_admin.id
        )
        
        db.add(resource)
        await db.commit()
        await db.refresh(resource)
        
        logger.info(f"POST /resources - Resource created with ID: {resource.id}")
        return APIResponse(
            success=True,
            message="Resource uploaded successfully",
            data=StudyResourceResponse.from_attributes(resource)
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"POST /resources - Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload resource"
        )


@router.put("/{id}", response_model=APIResponse[StudyResourceResponse])
async def update_resource(
    id: int,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    file_type: Optional[str] = Form(None),
    duration: Optional[str] = Form(None),
    thumbnail_url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    try:
        logger.info(f"PUT /resources/{id} - Updating resource")
        
        result = await db.execute(select(StudyResource).where(StudyResource.id == id))
        resource = result.scalar_one_or_none()
        
        if not resource:
            logger.warning(f"PUT /resources/{id} - Resource not found")
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
        if file_type is not None:
            resource.file_type = file_type
        if duration is not None:
            resource.duration = duration
        if thumbnail_url is not None:
            resource.thumbnail_url = thumbnail_url
        
        if file is not None:
            final_filename, file_path, file_size = await save_upload_file(file)
            
            if os.path.exists(resource.file_path):
                try:
                    os.remove(resource.file_path)
                except Exception:
                    pass
            
            resource.file_name = final_filename
            resource.file_path = file_path
            resource.file_size = file_size
        
        await db.commit()
        await db.refresh(resource)
        
        logger.info(f"PUT /resources/{id} - Resource updated")
        return APIResponse(
            success=True,
            message="Resource updated successfully",
            data=StudyResourceResponse.from_attributes(resource)
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"PUT /resources/{id} - Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update resource"
        )


@router.delete("/{id}", response_model=APIResponse[dict])
async def delete_resource(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    try:
        logger.info(f"DELETE /resources/{id} - Deleting resource")
        
        result = await db.execute(select(StudyResource).where(StudyResource.id == id))
        resource = result.scalar_one_or_none()
        
        if not resource:
            logger.warning(f"DELETE /resources/{id} - Resource not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resource not found"
            )
        
        if os.path.exists(resource.file_path):
            try:
                os.remove(resource.file_path)
            except Exception:
                pass
        
        await db.delete(resource)
        await db.commit()
        
        logger.info(f"DELETE /resources/{id} - Resource deleted")
        return APIResponse(
            success=True,
            message="Resource deleted successfully",
            data={}
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"DELETE /resources/{id} - Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete resource"
        )


@router.get("/{id}/download")
async def download_resource(
    id: int,
    db: AsyncSession = Depends(get_db),
    # TODO: Re-enable JWT authentication after authentication module is completed.
    # current_user: User = Depends(get_current_user)
):
    try:
        logger.info(f"GET /resources/{id}/download - Downloading resource")
        
        result = await db.execute(select(StudyResource).where(StudyResource.id == id))
        resource = result.scalar_one_or_none()
        
        if not resource:
            logger.warning(f"GET /resources/{id}/download - Resource not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resource not found"
            )
        
        file_path = resource.file_path
        if not os.path.exists(file_path):
            logger.error(f"GET /resources/{id}/download - File not found on disk")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File does not exist on server disk"
            )
    
        # Increment download count
        resource.download_count += 1
        await db.commit()
        await db.refresh(resource)
        
        logger.info(f"GET /resources/{id}/download - File found, returning FileResponse")
        return FileResponse(
            path=file_path,
            filename=resource.file_name,
            media_type="application/octet-stream"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"GET /resources/{id}/download - Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Download failed"
        )


@router.get("/preview/{id}", response_model=APIResponse[dict])
async def preview_resource(
    id: int,
    request: Request,
    db: AsyncSession = Depends(get_db),
    # TODO: Re-enable JWT authentication after authentication module is completed.
    # current_user: User = Depends(get_current_user)
):
    try:
        logger.info(f"GET /resources/preview/{id} - Generating preview")
        
        result = await db.execute(select(StudyResource).where(StudyResource.id == id))
        resource = result.scalar_one_or_none()
        
        if not resource:
            logger.warning(f"GET /resources/preview/{id} - Resource not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resource not found"
            )
        
        if not os.path.exists(resource.file_path):
            logger.error(f"GET /resources/preview/{id} - File not found on disk")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="File does not exist on server disk"
            )
        
        ext = os.path.splitext(resource.file_name)[1].lower()
        
        if ext == ".pdf":
            base_url = str(request.base_url).rstrip("/")
            preview_url = f"{base_url}/uploads/resources/{resource.file_name}"
            logger.info(f"GET /resources/preview/{id} - Returning preview URL")
            return APIResponse(
                success=True,
                message="Preview URL generated successfully",
                data={"preview_url": preview_url}
            )
        elif ext in (".mp4", ".mp3"):
            logger.info(f"GET /resources/preview/{id} - Returning FileResponse for media")
            return FileResponse(
                path=resource.file_path,
                media_type=f"video/mp4" if ext == ".mp4" else "audio/mpeg",
                headers={"Accept-Ranges": "bytes"}
            )
        else:
            logger.warning(f"GET /resources/preview/{id} - Preview not supported for {ext}")
            return APIResponse(
                success=False,
                message=f"Preview is not supported for file type '{ext}'",
                data=None
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"GET /resources/preview/{id} - Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Preview generation failed"
        )