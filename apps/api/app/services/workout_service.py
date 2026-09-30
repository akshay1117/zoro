import uuid
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.workout_repo import WorkoutRepository
from app.models.fitness import Workout, Exercise
from app.core.exceptions import ZoroException
from typing import List, Optional

class WorkoutService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.workout_repo = WorkoutRepository(session)

    async def create_workout(self, user_id: uuid.UUID, data: dict) -> Workout:
        workout = Workout(
            user_id=user_id,
            type=data['type'],
            duration_minutes=data.get('duration_minutes'),
            intensity=data.get('intensity', 'MEDIUM'),
            notes=data.get('notes'),
            start_time=data.get('start_time') or datetime.now(timezone.utc)
        )
        
        workout = await self.workout_repo.create_workout(workout)
        await self.session.commit()
        return workout

    async def get_workouts(self, user_id: uuid.UUID, limit: int = 30) -> List[Workout]:
        workouts = await self.workout_repo.get_all_for_user(user_id, limit)
        return workouts

    async def get_workout_details(self, user_id: uuid.UUID, workout_id: uuid.UUID) -> dict:
        workout = await self.workout_repo.get_workout_by_id(workout_id, user_id)
        if not workout:
            raise ZoroException(status_code=404, code="WORKOUT_NOT_FOUND", message="Workout not found")
            
        exercises = await self.workout_repo.get_exercises_for_workout(workout_id)
        
        return {
            "workout": workout,
            "exercises": exercises
        }

    async def add_exercise(self, user_id: uuid.UUID, workout_id: uuid.UUID, data: dict) -> Exercise:
        workout = await self.workout_repo.get_workout_by_id(workout_id, user_id)
        if not workout:
            raise ZoroException(status_code=404, code="WORKOUT_NOT_FOUND", message="Workout not found")
            
        exercise = Exercise(
            workout_id=workout_id,
            name=data['name'],
            sets=data['sets'],
            reps=data['reps'],
            weight_kg=data.get('weight_kg'),
            notes=data.get('notes')
        )
        
        exercise = await self.workout_repo.create_exercise(exercise)
        await self.session.commit()
        return exercise
