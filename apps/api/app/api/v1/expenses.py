from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
import uuid
from pydantic import BaseModel, Field
from datetime import datetime

from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.services.expense_service import ExpenseService

router = APIRouter()

class ExpenseCreate(BaseModel):
    amount: float = Field(..., gt=0)
    category: str
    description: Optional[str] = None
    expense_date: Optional[datetime] = None
    is_recurring: bool = False

class ExpenseResponse(BaseModel):
    id: uuid.UUID
    amount: float
    category: str
    description: Optional[str]
    expense_date: datetime
    is_recurring: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

@router.post("", response_model=ExpenseResponse)
async def create_expense(
    expense_in: ExpenseCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    expense_service = ExpenseService(db)
    expense = await expense_service.create_expense(current_user.id, expense_in.model_dump())
    return expense

@router.get("", response_model=List[ExpenseResponse])
async def get_expenses(
    month: Optional[int] = None,
    year: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    expense_service = ExpenseService(db)
    expenses = await expense_service.get_expenses(current_user.id, month, year)
    return expenses

@router.get("/analytics", response_model=Dict[str, Any])
async def get_analytics(
    month: Optional[int] = None,
    year: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    expense_service = ExpenseService(db)
    analytics = await expense_service.get_analytics(current_user.id, month, year)
    return analytics

@router.delete("/{expense_id}")
async def delete_expense(
    expense_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    expense_service = ExpenseService(db)
    await expense_service.delete_expense(current_user.id, expense_id)
    return {"message": "Expense deleted successfully"}
