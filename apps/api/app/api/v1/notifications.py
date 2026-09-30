from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any, Optional
import uuid
from pydantic import BaseModel

from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.services.notification_service import NotificationService

router = APIRouter()

class NotificationCreate(BaseModel):
    title: str
    message: str
    notification_type: str
    link_url: Optional[str] = None

@router.get("")
async def list_notifications(
    limit: int = 20,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = NotificationService(db)
    return await service.get_notifications(current_user.id, limit, offset)

@router.get("/unread-count")
async def get_unread_count(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = NotificationService(db)
    count = await service.get_unread_count(current_user.id)
    return {"unread_count": count}

@router.patch("/{notification_id}/read")
async def mark_read(
    notification_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = NotificationService(db)
    success = await service.mark_as_read(current_user.id, notification_id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"status": "success"}

@router.patch("/read-all")
async def mark_all_read(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = NotificationService(db)
    count = await service.mark_all_as_read(current_user.id)
    return {"status": "success", "marked_count": count}

# Internal tool to generate a mock notification
@router.post("")
async def create_mock_notification(
    data: NotificationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = NotificationService(db)
    return await service.create_notification(
        user_id=current_user.id,
        title=data.title,
        message=data.message,
        notification_type=data.notification_type,
        link_url=data.link_url
    )
