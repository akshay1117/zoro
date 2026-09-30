from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import uuid
from pydantic import BaseModel, Field
from datetime import datetime

from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.services.task_service import TaskService

router = APIRouter()

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1)
    description: Optional[str] = None
    priority: str = "MEDIUM"
    due_date: Optional[datetime] = None
    estimated_duration_minutes: Optional[int] = None
    tags: List[str] = []

class TaskResponse(BaseModel):
    id: uuid.UUID
    title: str
    description: Optional[str]
    priority: str
    status: str
    due_date: Optional[datetime]
    estimated_duration_minutes: Optional[int]
    completed_at: Optional[datetime]
    tags: List[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

@router.post("", response_model=TaskResponse)
async def create_task(
    task_in: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    task_service = TaskService(db)
    task = await task_service.create_task(current_user.id, task_in.model_dump())
    return task

@router.get("", response_model=List[TaskResponse])
async def get_tasks(
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    task_service = TaskService(db)
    tasks = await task_service.get_tasks(current_user.id, status)
    return tasks

@router.patch("/{task_id}/complete", response_model=TaskResponse)
async def complete_task(
    task_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    task_service = TaskService(db)
    task = await task_service.complete_task(current_user.id, task_id)
    return task

@router.delete("/{task_id}")
async def delete_task(
    task_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    task_service = TaskService(db)
    await task_service.delete_task(current_user.id, task_id)
    return {"message": "Task deleted successfully"}
