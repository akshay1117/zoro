import uuid
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.expense_repo import ExpenseRepository
from app.models.expense import Expense
from app.core.exceptions import ZoroException
from typing import List, Optional, Dict

class ExpenseService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.expense_repo = ExpenseRepository(session)

    async def create_expense(self, user_id: uuid.UUID, data: dict) -> Expense:
        expense = Expense(
            user_id=user_id,
            amount=data['amount'],
            category=data['category'],
            description=data.get('description'),
            expense_date=data.get('expense_date') or datetime.now(timezone.utc),
            is_recurring=data.get('is_recurring', False)
        )
        
        expense = await self.expense_repo.create(expense)
        await self.session.commit()
        return expense

    async def get_expenses(self, user_id: uuid.UUID, month: Optional[int] = None, year: Optional[int] = None) -> List[Expense]:
        return await self.expense_repo.get_all_for_user(user_id, month, year)

    async def get_analytics(self, user_id: uuid.UUID, month: Optional[int] = None, year: Optional[int] = None) -> Dict:
        if not month or not year:
            today = datetime.now(timezone.utc)
            month = today.month
            year = today.year
            
        breakdown = await self.expense_repo.get_category_breakdown(user_id, month, year)
        
        total = sum(item["total"] for item in breakdown)
        
        return {
            "month": month,
            "year": year,
            "total_spent": total,
            "category_breakdown": breakdown
        }

    async def delete_expense(self, user_id: uuid.UUID, expense_id: uuid.UUID) -> None:
        expense = await self.expense_repo.get_by_id(expense_id, user_id)
        if not expense:
            raise ZoroException(status_code=404, code="EXPENSE_NOT_FOUND", message="Expense not found")
            
        expense.is_deleted = True
        expense.deleted_at = datetime.now(timezone.utc)
        
        await self.expense_repo.update(expense)
        await self.session.commit()
