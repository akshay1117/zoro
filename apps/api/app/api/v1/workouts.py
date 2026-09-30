from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Any
import uuid
from pydantic import BaseModel
from datetime import datetime

from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.services.workout_service import WorkoutService

router = APIRouter()

class WorkoutCreate(BaseModel):
    type: str
    duration_minutes: Optional[int] = None
    intensity: str = "MEDIUM"
    notes: Optional[str] = None
    start_time: Optional[datetime] = None

class ExerciseCreate(BaseModel):
    name: str
    sets: int
    reps: int
    weight_kg: Optional[float] = None
    notes: Optional[str] = None

class WorkoutResponse(BaseModel):
    id: uuid.UUID
    type: str
    duration_minutes: Optional[int]
    intensity: str
    notes: Optional[str]
    start_time: datetime
    
    class Config:
        from_attributes = True

class ExerciseResponse(BaseModel):
    id: uuid.UUID
    workout_id: uuid.UUID
    name: str
    sets: int
    reps: int
    weight_kg: Optional[float]
    notes: Optional[str]
    
    class Config:
        from_attributes = True

@router.post("", response_model=WorkoutResponse)
async def create_workout(
    workout_in: WorkoutCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = WorkoutService(db)
    return await service.create_workout(current_user.id, workout_in.model_dump())

@router.get("", response_model=List[WorkoutResponse])
async def get_workouts(
    limit: int = 30,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = WorkoutService(db)
    return await service.get_workouts(current_user.id, limit)

@router.get("/{workout_id}", response_model=dict)
async def get_workout_details(
    workout_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = WorkoutService(db)
    details = await service.get_workout_details(current_user.id, workout_id)
    return details

@router.post("/{workout_id}/exercises", response_model=ExerciseResponse)
async def add_exercise(
    workout_id: uuid.UUID,
    exercise_in: ExerciseCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = WorkoutService(db)
    return await service.add_exercise(current_user.id, workout_id, exercise_in.model_dump())
