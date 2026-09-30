import uuid
from sqlalchemy import String, Integer, ForeignKey, Index, Text, desc
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import BaseModel

class CybersecurityTopic(BaseModel):
    __tablename__ = "cybersecurity_topics"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    domain: Mapped[str] = mapped_column(String(64), nullable=False)
    difficulty: Mapped[str] = mapped_column(String(32), default="INTERMEDIATE")

class LearningSession(BaseModel):
    __tablename__ = "learning_sessions"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    topic_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("cybersecurity_topics.id", ondelete="SET NULL"))
    platform: Mapped[str] = mapped_column(String(64), nullable=False)
    session_title: Mapped[str] = mapped_column(String(255), nullable=False)
    duration_minutes: Mapped[int] = mapped_column(Integer, nullable=False)
    flags_captured: Mapped[int] = mapped_column(Integer, default=0)
    notes_markdown: Mapped[str | None] = mapped_column(Text)

    __table_args__ = (
        Index("idx_learning_sessions_user", "user_id", desc("created_at")),
    )
