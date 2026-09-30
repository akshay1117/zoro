import uuid
from datetime import datetime
from sqlalchemy import String, Boolean, Numeric, Integer, ForeignKey, DateTime, Enum, Index, Text, desc
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import BaseModel

class Workout(BaseModel):
    __tablename__ = "workouts"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    start_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    end_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    duration_minutes: Mapped[int | None] = mapped_column(Integer)
    notes: Mapped[str | None] = mapped_column(Text)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    
    __table_args__ = (
        Index("idx_workouts_user_time", "user_id", desc("start_time")),
    )

class Exercise(BaseModel):
    __tablename__ = "exercises"

    name: Mapped[str] = mapped_column(String(128), nullable=False, unique=True, index=True)
    target_muscle_group: Mapped[str] = mapped_column(String(64), nullable=False)
    equipment: Mapped[str | None] = mapped_column(String(64))

class WorkoutSet(BaseModel):
    __tablename__ = "workout_sets"

    workout_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("workouts.id", ondelete="CASCADE"), nullable=False, index=True)
    exercise_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("exercises.id", ondelete="CASCADE"), nullable=False)
    set_number: Mapped[int] = mapped_column(Integer, nullable=False)
    weight_kg: Mapped[float] = mapped_column(Numeric(6, 2), nullable=False)
    repetitions: Mapped[int] = mapped_column(Integer, nullable=False)
    set_type: Mapped[str] = mapped_column(Enum("WARMUP", "NORMAL", "DROPSET", "FAILURE", name="set_type_enum"), default="NORMAL", nullable=False)
    rpe: Mapped[float | None] = mapped_column(Numeric(3, 1))
