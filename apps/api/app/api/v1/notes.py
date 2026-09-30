from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import uuid
from pydantic import BaseModel
from datetime import datetime

from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.services.notes_service import NotesService

router = APIRouter()

class NoteBase(BaseModel):
    title: str
    content_markdown: str
    category: str = "GENERAL"
    tags: List[str] = []
    is_pinned: bool = False

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content_markdown: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    is_pinned: Optional[bool] = None

class NoteResponse(NoteBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

@router.post("", response_model=NoteResponse)
async def create_note(
    note_in: NoteCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = NotesService(db)
    return await service.create_note(current_user.id, note_in.model_dump())

@router.get("", response_model=List[NoteResponse])
async def get_notes(
    search: Optional[str] = None,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = NotesService(db)
    return await service.get_notes(current_user.id, search, limit)

@router.get("/{note_id}", response_model=NoteResponse)
async def get_note(
    note_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = NotesService(db)
    return await service.get_note(current_user.id, note_id)

@router.patch("/{note_id}", response_model=NoteResponse)
async def update_note(
    note_id: uuid.UUID,
    note_in: NoteUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = NotesService(db)
    return await service.update_note(current_user.id, note_id, note_in.model_dump(exclude_unset=True))

@router.delete("/{note_id}")
async def delete_note(
    note_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = NotesService(db)
    await service.delete_note(current_user.id, note_id)
    return {"message": "Note deleted successfully"}
