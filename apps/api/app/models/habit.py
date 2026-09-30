import uuid
from datetime import date
from sqlalchemy import String, Boolean, Integer, ForeignKey, Date, Index, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import BaseModel

class Habit(BaseModel):
    __tablename__ = "habits"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(128), nullable=False)
    description: Mapped[str | None] = mapped_column(String(255))
    icon: Mapped[str] = mapped_column(String(32), default="zap")
    frequency: Mapped[str] = mapped_column(String(32), default="DAILY", nullable=False)
    target_count_per_day: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    current_streak: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    longest_streak: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    __table_args__ = (
        Index("idx_habits_user", "user_id", postgresql_where="is_active AND NOT is_deleted"),
    )

class HabitLog(BaseModel):
    __tablename__ = "habit_logs"

    habit_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("habits.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    log_date: Mapped[date] = mapped_column(Date, nullable=False)
    completion_count: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    notes: Mapped[str | None] = mapped_column(String(255))

    __table_args__ = (
        UniqueConstraint("habit_id", "log_date", name="uq_habit_date"),
        Index("idx_habit_logs_date", "user_id", "log_date"),
    )
