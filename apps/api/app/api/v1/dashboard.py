from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.services.dashboard_service import DashboardService
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class TasksSummary(BaseModel):
    incomplete_count: int
    urgent_deadline: Optional[str]

class HabitsSummary(BaseModel):
    completed_today: int

class ExpensesSummary(BaseModel):
    spent_today: float
    spent_this_month: float
    monthly_budget: float

class FitnessSummary(BaseModel):
    workout_completed_today: bool

class DashboardSummaryResponse(BaseModel):
    tasks: TasksSummary
    habits: HabitsSummary
    expenses: ExpensesSummary
    fitness: FitnessSummary

@router.get("/summary", response_model=DashboardSummaryResponse)
async def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    dashboard_service = DashboardService(db)
    summary = await dashboard_service.get_summary(current_user.id)
    return summary
