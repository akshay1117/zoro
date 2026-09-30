from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from app.models.task import Task
import uuid
from typing import List, Optional
from datetime import datetime

class TaskRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, task: Task) -> Task:
        self.session.add(task)
        await self.session.flush()
        await self.session.refresh(task)
        return task

    async def get_by_id(self, task_id: uuid.UUID, user_id: uuid.UUID) -> Optional[Task]:
        stmt = select(Task).where(
            Task.id == task_id,
            Task.user_id == user_id,
            Task.is_deleted == False
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_all_for_user(self, user_id: uuid.UUID, status: Optional[str] = None) -> List[Task]:
        stmt = select(Task).where(
            Task.user_id == user_id,
            Task.is_deleted == False
        )
        if status:
            stmt = stmt.where(Task.status == status)
            
        stmt = stmt.order_by(Task.due_date.asc().nulls_last())
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def update(self, task: Task) -> Task:
        self.session.add(task)
        await self.session.flush()
        await self.session.refresh(task)
        return task
