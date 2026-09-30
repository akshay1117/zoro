from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc, func
from app.models.fitness import Workout, Exercise
import uuid
from typing import List, Optional
from datetime import datetime

class WorkoutRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_workout(self, workout: Workout) -> Workout:
        self.session.add(workout)
        await self.session.flush()
        await self.session.refresh(workout)
        return workout

    async def get_workout_by_id(self, workout_id: uuid.UUID, user_id: uuid.UUID) -> Optional[Workout]:
        stmt = select(Workout).where(
            Workout.id == workout_id,
            Workout.user_id == user_id,
            Workout.is_deleted == False
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_all_for_user(self, user_id: uuid.UUID, limit: int = 30) -> List[Workout]:
        stmt = select(Workout).where(
            Workout.user_id == user_id,
            Workout.is_deleted == False
        ).order_by(desc(Workout.start_time)).limit(limit)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def create_exercise(self, exercise: Exercise) -> Exercise:
        self.session.add(exercise)
        await self.session.flush()
        await self.session.refresh(exercise)
        return exercise

    async def get_exercises_for_workout(self, workout_id: uuid.UUID) -> List[Exercise]:
        stmt = select(Exercise).where(
            Exercise.workout_id == workout_id
        ).order_by(Exercise.created_at)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
