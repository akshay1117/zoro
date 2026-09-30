import uuid
from datetime import datetime, timezone, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, String
from app.models.task import Task
from app.models.habit import HabitLog
from app.models.expense import Expense
from app.models.fitness import Workout

class DashboardService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_summary(self, user_id: uuid.UUID) -> dict:
        now = datetime.now(timezone.utc)
        today = now.date()
        start_of_month = today.replace(day=1)

        # 1. Tasks Summary
        # Count incomplete tasks
        stmt_tasks = select(func.count(Task.id)).where(
            Task.user_id == user_id,
            Task.status != "DONE",
            Task.is_deleted == False
        )
        result_tasks = await self.session.execute(stmt_tasks)
        incomplete_tasks = result_tasks.scalar() or 0

        # Urgent deadline (next due date)
        stmt_urgent = select(Task).where(
            Task.user_id == user_id,
            Task.status != "DONE",
            Task.is_deleted == False,
            Task.due_date >= now
        ).order_by(Task.due_date.asc()).limit(1)
        result_urgent = await self.session.execute(stmt_urgent)
        urgent_task = result_urgent.scalars().first()
        urgent_deadline = urgent_task.title if urgent_task else None

        # 2. Habits Today
        stmt_habits = select(func.count(HabitLog.id)).where(
            HabitLog.user_id == user_id,
            HabitLog.log_date == today,
            HabitLog.completion_count > 0
        )
        result_habits = await self.session.execute(stmt_habits)
        habits_completed_today = result_habits.scalar() or 0

        # 3. Expense Burn
        stmt_expense_today = select(func.sum(Expense.amount)).where(
            Expense.user_id == user_id,
            Expense.expense_date == today,
            Expense.is_deleted == False
        )
        result_expense_today = await self.session.execute(stmt_expense_today)
        spent_today = result_expense_today.scalar() or 0.0

        stmt_expense_month = select(func.sum(Expense.amount)).where(
            Expense.user_id == user_id,
            Expense.expense_date >= start_of_month,
            Expense.expense_date <= today,
            Expense.is_deleted == False
        )
        result_expense_month = await self.session.execute(stmt_expense_month)
        spent_this_month = result_expense_month.scalar() or 0.0

        # 4. Fitness Status
        stmt_workout = select(Workout).where(
            Workout.user_id == user_id,
            Workout.start_time >= datetime.combine(today, datetime.min.time()).replace(tzinfo=timezone.utc)
        ).limit(1)
        result_workout = await self.session.execute(stmt_workout)
        workout_today = result_workout.scalars().first() is not None

        return {
            "tasks": {
                "incomplete_count": incomplete_tasks,
                "urgent_deadline": urgent_deadline
            },
            "habits": {
                "completed_today": habits_completed_today
            },
            "expenses": {
                "spent_today": float(spent_today),
                "spent_this_month": float(spent_this_month),
                "monthly_budget": 50000.0 # Mock budget, could be sourced from user settings
            },
            "fitness": {
                "workout_completed_today": workout_today
            }
        }
