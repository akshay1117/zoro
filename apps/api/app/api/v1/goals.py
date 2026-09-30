from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import uuid
from pydantic import BaseModel
from datetime import datetime, date

from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.services.goal_service import GoalService

router = APIRouter()

class GoalBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    target_value: Optional[float] = None
    current_value: float = 0
    unit: Optional[str] = None
    timeframe: str = "MONTHLY"
    deadline: Optional[date] = None
    is_achieved: bool = False

class GoalCreate(GoalBase):
    pass

class GoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    target_value: Optional[float] = None
    current_value: Optional[float] = None
    unit: Optional[str] = None
    timeframe: Optional[str] = None
    deadline: Optional[date] = None
    is_achieved: Optional[bool] = None

class GoalResponse(GoalBase):
    id: uuid.UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

@router.post("", response_model=GoalResponse)
async def create_goal(
    goal_in: GoalCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = GoalService(db)
    return await service.create_goal(current_user.id, goal_in.model_dump())

@router.get("", response_model=List[GoalResponse])
async def get_goals(
    timeframe: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = GoalService(db)
    return await service.get_goals(current_user.id, timeframe)

@router.get("/{goal_id}", response_model=GoalResponse)
async def get_goal(
    goal_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = GoalService(db)
    return await service.get_goal(current_user.id, goal_id)

@router.patch("/{goal_id}", response_model=GoalResponse)
async def update_goal(
    goal_id: uuid.UUID,
    goal_in: GoalUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = GoalService(db)
    return await service.update_goal(current_user.id, goal_id, goal_in.model_dump(exclude_unset=True))

@router.delete("/{goal_id}")
async def delete_goal(
    goal_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = GoalService(db)
    await service.delete_goal(current_user.id, goal_id)
    return {"message": "Goal deleted successfully"}
