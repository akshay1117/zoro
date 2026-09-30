import uuid
from datetime import datetime, date
from sqlalchemy import String, Boolean, Numeric, Integer, ForeignKey, Enum, DateTime, Date, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import BaseModel

class Goal(BaseModel):
    __tablename__ = "goals"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(String)
    category: Mapped[str] = mapped_column(String(64), nullable=False)
    target_value: Mapped[float | None] = mapped_column(Numeric(10, 2))
    current_value: Mapped[float] = mapped_column(Numeric(10, 2), default=0)
    unit: Mapped[str | None] = mapped_column(String(32))
    timeframe: Mapped[str] = mapped_column(Enum("WEEKLY", "MONTHLY", "SEMESTER", "ANNUAL", name="goal_timeframe"), default="MONTHLY", nullable=False)
    deadline: Mapped[date | None] = mapped_column(Date)
    is_achieved: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
