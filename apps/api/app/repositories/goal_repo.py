from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc, and_
from app.models.goal import Goal
import uuid
from typing import List, Optional

class GoalRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_goal(self, goal: Goal) -> Goal:
        self.session.add(goal)
        await self.session.flush()
        await self.session.refresh(goal)
        return goal

    async def get_goals(self, user_id: uuid.UUID, timeframe: Optional[str] = None) -> List[Goal]:
        stmt = select(Goal).where(Goal.user_id == user_id)
        
        if timeframe:
            stmt = stmt.where(Goal.timeframe == timeframe)
            
        stmt = stmt.order_by(Goal.is_achieved, Goal.deadline)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_goal_by_id(self, goal_id: uuid.UUID, user_id: uuid.UUID) -> Optional[Goal]:
        stmt = select(Goal).where(
            and_(
                Goal.id == goal_id,
                Goal.user_id == user_id
            )
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def update_goal(self, goal: Goal) -> Goal:
        await self.session.flush()
        await self.session.refresh(goal)
        return goal

    async def delete_goal(self, goal: Goal) -> None:
        await self.session.delete(goal)
        await self.session.flush()
