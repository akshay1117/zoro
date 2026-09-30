import uuid
from datetime import datetime
from sqlalchemy import String, Boolean, ForeignKey, Enum, DateTime, Index, desc
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import BaseModel

class Notification(BaseModel):
    __tablename__ = "notifications"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(128), nullable=False)
    message: Mapped[str] = mapped_column(String(512), nullable=False)
    notification_type: Mapped[str] = mapped_column(Enum("DEADLINE", "HABIT_REMINDER", "EXPENSE_ALERT", "AI_INSIGHT", "SYSTEM", name="notif_type"), nullable=False)
    link_url: Mapped[str | None] = mapped_column(String(255))
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    read_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    __table_args__ = (
        Index("idx_notifications_user", "user_id", "is_read", desc("created_at")),
    )
