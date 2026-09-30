from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, desc
from app.models.habit import Habit, HabitLog
import uuid
from typing import List, Optional
from datetime import date

class HabitRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_habit(self, habit: Habit) -> Habit:
        self.session.add(habit)
        await self.session.flush()
        await self.session.refresh(habit)
        return habit

    async def get_habit_by_id(self, habit_id: uuid.UUID, user_id: uuid.UUID) -> Optional[Habit]:
        stmt = select(Habit).where(
            Habit.id == habit_id,
            Habit.user_id == user_id,
            Habit.is_deleted == False
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_all_habits_for_user(self, user_id: uuid.UUID) -> List[Habit]:
        stmt = select(Habit).where(
            Habit.user_id == user_id,
            Habit.is_deleted == False
        ).order_by(desc(Habit.created_at))
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def update_habit(self, habit: Habit) -> Habit:
        self.session.add(habit)
        await self.session.flush()
        await self.session.refresh(habit)
        return habit

    async def get_log_for_date(self, habit_id: uuid.UUID, log_date: date) -> Optional[HabitLog]:
        stmt = select(HabitLog).where(
            HabitLog.habit_id == habit_id,
            HabitLog.completed_date == log_date
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_logs_for_habit(self, habit_id: uuid.UUID, limit: int = 30) -> List[HabitLog]:
        stmt = select(HabitLog).where(
            HabitLog.habit_id == habit_id
        ).order_by(desc(HabitLog.completed_date)).limit(limit)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def create_log(self, log: HabitLog) -> HabitLog:
        self.session.add(log)
        await self.session.flush()
        return log
