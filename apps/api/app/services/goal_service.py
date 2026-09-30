import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.goal_repo import GoalRepository
from app.models.goal import Goal
from app.core.exceptions import ZoroException
from typing import List, Optional

class GoalService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.goal_repo = GoalRepository(session)

    async def create_goal(self, user_id: uuid.UUID, data: dict) -> Goal:
        goal = Goal(
            user_id=user_id,
            title=data['title'],
            description=data.get('description'),
            category=data['category'],
            target_value=data.get('target_value'),
            current_value=data.get('current_value', 0),
            unit=data.get('unit'),
            timeframe=data.get('timeframe', 'MONTHLY'),
            deadline=data.get('deadline'),
            is_achieved=data.get('is_achieved', False)
        )
        
        goal = await self.goal_repo.create_goal(goal)
        await self.session.commit()
        return goal

    async def get_goals(self, user_id: uuid.UUID, timeframe: Optional[str] = None) -> List[Goal]:
        return await self.goal_repo.get_goals(user_id, timeframe)
        
    async def get_goal(self, user_id: uuid.UUID, goal_id: uuid.UUID) -> Goal:
        goal = await self.goal_repo.get_goal_by_id(goal_id, user_id)
        if not goal:
            raise ZoroException(message="Goal not found", status_code=404)
        return goal

    async def update_goal(self, user_id: uuid.UUID, goal_id: uuid.UUID, data: dict) -> Goal:
        goal = await self.get_goal(user_id, goal_id)
        
        if 'title' in data:
            goal.title = data['title']
        if 'description' in data:
            goal.description = data['description']
        if 'category' in data:
            goal.category = data['category']
        if 'target_value' in data:
            goal.target_value = data['target_value']
        if 'current_value' in data:
            goal.current_value = data['current_value']
        if 'unit' in data:
            goal.unit = data['unit']
        if 'timeframe' in data:
            goal.timeframe = data['timeframe']
        if 'deadline' in data:
            goal.deadline = data['deadline']
        if 'is_achieved' in data:
            goal.is_achieved = data['is_achieved']
            
        goal = await self.goal_repo.update_goal(goal)
        await self.session.commit()
        return goal

    async def delete_goal(self, user_id: uuid.UUID, goal_id: uuid.UUID) -> None:
        goal = await self.get_goal(user_id, goal_id)
        await self.goal_repo.delete_goal(goal)
        await self.session.commit()
