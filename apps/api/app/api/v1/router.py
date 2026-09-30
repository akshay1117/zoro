from fastapi import APIRouter
from app.api.v1 import auth, dashboard, tasks, habits, expenses, workouts, trading, cyber, notes, goals, ai, notifications

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
api_router.include_router(habits.router, prefix="/habits", tags=["habits"])
api_router.include_router(expenses.router, prefix="/expenses", tags=["expenses"])
api_router.include_router(workouts.router, prefix="/workouts", tags=["workouts"])
api_router.include_router(trading.router, prefix="/trading", tags=["trading"])
api_router.include_router(cyber.router, prefix="/cyber", tags=["cybersecurity"])
api_router.include_router(notes.router, prefix="/notes", tags=["notes"])
api_router.include_router(goals.router, prefix="/goals", tags=["goals"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
