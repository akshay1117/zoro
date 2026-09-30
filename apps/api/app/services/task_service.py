import uuid
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.task_repo import TaskRepository
from app.models.task import Task
from app.core.exceptions import ZoroException
from typing import List, Optional

class TaskService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.task_repo = TaskRepository(session)

    async def create_task(self, user_id: uuid.UUID, data: dict) -> Task:
        task = Task(
            user_id=user_id,
            title=data['title'],
            description=data.get('description'),
            priority=data.get('priority', 'MEDIUM'),
            status='TODO',
            due_date=data.get('due_date'),
            estimated_duration_minutes=data.get('estimated_duration_minutes'),
            tags=data.get('tags', []),
            is_recurring=False
        )
        
        task = await self.task_repo.create(task)
        await self.session.commit()
        return task

    async def get_tasks(self, user_id: uuid.UUID, status: Optional[str] = None) -> List[Task]:
        return await self.task_repo.get_all_for_user(user_id, status)

    async def complete_task(self, user_id: uuid.UUID, task_id: uuid.UUID) -> Task:
        task = await self.task_repo.get_by_id(task_id, user_id)
        if not task:
            raise ZoroException(status_code=404, code="TASK_NOT_FOUND", message="Task not found")
            
        task.status = "DONE"
        task.completed_at = datetime.now(timezone.utc)
        
        task = await self.task_repo.update(task)
        await self.session.commit()
        return task

    async def delete_task(self, user_id: uuid.UUID, task_id: uuid.UUID) -> None:
        task = await self.task_repo.get_by_id(task_id, user_id)
        if not task:
            raise ZoroException(status_code=404, code="TASK_NOT_FOUND", message="Task not found")
            
        task.is_deleted = True
        task.deleted_at = datetime.now(timezone.utc)
        
        await self.task_repo.update(task)
        await self.session.commit()
