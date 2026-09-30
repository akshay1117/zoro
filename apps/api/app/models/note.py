import uuid
from datetime import datetime
from sqlalchemy import String, Boolean, ForeignKey, Index, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import BaseModel

class Note(BaseModel):
    __tablename__ = "notes"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content_markdown: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(64), default="GENERAL")
    tags: Mapped[list[str]] = mapped_column(ARRAY(String(32)), default=list)
    is_pinned: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    __table_args__ = (
        Index("idx_notes_user", "user_id", postgresql_where="NOT is_deleted"),
        # Full text search index is added manually via alembic migration script due to specific postgres functions
    )
