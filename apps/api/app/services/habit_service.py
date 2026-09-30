import uuid
from datetime import datetime, timezone, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.habit_repo import HabitRepository
from app.models.habit import Habit, HabitLog
from app.core.exceptions import ZoroException
from typing import List, Optional

class HabitService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.habit_repo = HabitRepository(session)

    async def create_habit(self, user_id: uuid.UUID, data: dict) -> Habit:
        habit = Habit(
            user_id=user_id,
            name=data['name'],
            description=data.get('description'),
            frequency=data.get('frequency', 'DAILY'),
            target_days_per_week=data.get('target_days_per_week', 7),
            current_streak=0,
            longest_streak=0
        )
        
        habit = await self.habit_repo.create_habit(habit)
        await self.session.commit()
        return habit

    async def get_habits(self, user_id: uuid.UUID) -> List[dict]:
        habits = await self.habit_repo.get_all_habits_for_user(user_id)
        result = []
        today = datetime.now(timezone.utc).date()
        
        for h in habits:
            # Check if completed today
            log = await self.habit_repo.get_log_for_date(h.id, today)
            habit_dict = {
                "id": h.id,
                "name": h.name,
                "description": h.description,
                "frequency": h.frequency,
                "current_streak": h.current_streak,
                "longest_streak": h.longest_streak,
                "completed_today": log is not None,
                "created_at": h.created_at
            }
            result.append(habit_dict)
            
        return result

    async def log_habit(self, user_id: uuid.UUID, habit_id: uuid.UUID) -> dict:
        habit = await self.habit_repo.get_habit_by_id(habit_id, user_id)
        if not habit:
            raise ZoroException(status_code=404, code="HABIT_NOT_FOUND", message="Habit not found")
            
        today = datetime.now(timezone.utc).date()
        existing_log = await self.habit_repo.get_log_for_date(habit_id, today)
        
        if existing_log:
            raise ZoroException(status_code=400, code="HABIT_ALREADY_LOGGED", message="Habit already logged for today")
            
        # Create log
        new_log = HabitLog(
            habit_id=habit_id,
            completed_date=today,
            notes=None
        )
        await self.habit_repo.create_log(new_log)
        
        # Calculate streak
        yesterday = today - timedelta(days=1)
        yesterday_log = await self.habit_repo.get_log_for_date(habit_id, yesterday)
        
        if yesterday_log or habit.current_streak == 0:
            habit.current_streak += 1
        else:
            # Missed a day
            habit.current_streak = 1
            
        if habit.current_streak > habit.longest_streak:
            habit.longest_streak = habit.current_streak
            
        await self.habit_repo.update_habit(habit)
        await self.session.commit()
        
        return {
            "id": habit.id,
            "current_streak": habit.current_streak,
            "longest_streak": habit.longest_streak,
            "completed_today": True
        }

    async def get_habit_logs(self, user_id: uuid.UUID, habit_id: uuid.UUID, limit: int = 30) -> List[HabitLog]:
        habit = await self.habit_repo.get_habit_by_id(habit_id, user_id)
        if not habit:
            raise ZoroException(status_code=404, code="HABIT_NOT_FOUND", message="Habit not found")
            
        return await self.habit_repo.get_logs_for_habit(habit_id, limit)

    async def delete_habit(self, user_id: uuid.UUID, habit_id: uuid.UUID) -> None:
        habit = await self.habit_repo.get_habit_by_id(habit_id, user_id)
        if not habit:
            raise ZoroException(status_code=404, code="HABIT_NOT_FOUND", message="Habit not found")
            
        habit.is_deleted = True
        habit.deleted_at = datetime.now(timezone.utc)
        
        await self.habit_repo.update_habit(habit)
        await self.session.commit()
