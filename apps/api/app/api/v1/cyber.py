from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import uuid
from pydantic import BaseModel
from datetime import datetime

from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.services.cyber_service import CyberService

router = APIRouter()

class TopicCreate(BaseModel):
    name: str
    domain: str
    difficulty: str = "INTERMEDIATE"

class SessionCreate(BaseModel):
    topic_id: Optional[uuid.UUID] = None
    platform: str
    session_title: str
    duration_minutes: int
    flags_captured: int = 0
    notes_markdown: Optional[str] = None

class TopicResponse(BaseModel):
    id: uuid.UUID
    name: str
    domain: str
    difficulty: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class SessionResponse(BaseModel):
    id: uuid.UUID
    topic_id: Optional[uuid.UUID]
    platform: str
    session_title: str
    duration_minutes: int
    flags_captured: int
    notes_markdown: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

@router.post("/topics", response_model=TopicResponse)
async def create_topic(
    topic_in: TopicCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = CyberService(db)
    return await service.create_topic(current_user.id, topic_in.model_dump())

@router.get("/topics", response_model=List[TopicResponse])
async def get_topics(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = CyberService(db)
    return await service.get_topics(current_user.id)

@router.post("/sessions", response_model=SessionResponse)
async def log_session(
    session_in: SessionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = CyberService(db)
    return await service.log_session(current_user.id, session_in.model_dump())

@router.get("/sessions", response_model=List[SessionResponse])
async def get_sessions(
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = CyberService(db)
    return await service.get_sessions(current_user.id, limit)
