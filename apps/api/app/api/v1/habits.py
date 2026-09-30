from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import uuid
from pydantic import BaseModel, Field
from datetime import datetime, date

from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.services.habit_service import HabitService

router = APIRouter()

class HabitCreate(BaseModel):
    name: str = Field(..., min_length=1)
    description: Optional[str] = None
    frequency: str = "DAILY"
    target_days_per_week: int = 7

class HabitResponse(BaseModel):
    id: uuid.UUID
    name: str
    description: Optional[str]
    frequency: str
    current_streak: int
    longest_streak: int
    completed_today: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class HabitLogResponse(BaseModel):
    id: uuid.UUID
    habit_id: uuid.UUID
    completed_date: date
    notes: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

@router.post("", response_model=HabitResponse)
async def create_habit(
    habit_in: HabitCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    habit_service = HabitService(db)
    habit = await habit_service.create_habit(current_user.id, habit_in.model_dump())
    return dict(
        id=habit.id,
        name=habit.name,
        description=habit.description,
        frequency=habit.frequency,
        current_streak=habit.current_streak,
        longest_streak=habit.longest_streak,
        completed_today=False,
        created_at=habit.created_at
    )

@router.get("", response_model=List[HabitResponse])
async def get_habits(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    habit_service = HabitService(db)
    habits = await habit_service.get_habits(current_user.id)
    return habits

@router.post("/{habit_id}/log", response_model=dict)
async def log_habit(
    habit_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    habit_service = HabitService(db)
    result = await habit_service.log_habit(current_user.id, habit_id)
    return result

@router.get("/{habit_id}/logs", response_model=List[HabitLogResponse])
async def get_habit_logs(
    habit_id: uuid.UUID,
    limit: int = 30,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    habit_service = HabitService(db)
    logs = await habit_service.get_habit_logs(current_user.id, habit_id, limit)
    return logs

@router.delete("/{habit_id}")
async def delete_habit(
    habit_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    habit_service = HabitService(db)
    await habit_service.delete_habit(current_user.id, habit_id)
    return {"message": "Habit deleted successfully"}
