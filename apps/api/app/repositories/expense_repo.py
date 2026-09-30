from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, desc, func
from app.models.expense import Expense
import uuid
from typing import List, Optional, Dict
from datetime import datetime, date

class ExpenseRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, expense: Expense) -> Expense:
        self.session.add(expense)
        await self.session.flush()
        await self.session.refresh(expense)
        return expense

    async def get_by_id(self, expense_id: uuid.UUID, user_id: uuid.UUID) -> Optional[Expense]:
        stmt = select(Expense).where(
            Expense.id == expense_id,
            Expense.user_id == user_id,
            Expense.is_deleted == False
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_all_for_user(self, user_id: uuid.UUID, month: Optional[int] = None, year: Optional[int] = None) -> List[Expense]:
        stmt = select(Expense).where(
            Expense.user_id == user_id,
            Expense.is_deleted == False
        )
        
        if month and year:
            # Assuming expense_date is mapped correctly in SQLAlchemy
            stmt = stmt.where(
                func.extract('month', Expense.expense_date) == month,
                func.extract('year', Expense.expense_date) == year
            )
            
        stmt = stmt.order_by(desc(Expense.expense_date))
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def update(self, expense: Expense) -> Expense:
        self.session.add(expense)
        await self.session.flush()
        await self.session.refresh(expense)
        return expense
        
    async def get_category_breakdown(self, user_id: uuid.UUID, month: int, year: int) -> List[dict]:
        stmt = select(
            Expense.category,
            func.sum(Expense.amount).label('total')
        ).where(
            Expense.user_id == user_id,
            Expense.is_deleted == False,
            func.extract('month', Expense.expense_date) == month,
            func.extract('year', Expense.expense_date) == year
        ).group_by(Expense.category)
        
        result = await self.session.execute(stmt)
        return [{"category": row.category, "total": float(row.total)} for row in result]
