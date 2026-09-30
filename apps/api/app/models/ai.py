import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Boolean, ForeignKey, Enum, DateTime, Index, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import BaseModel

class AIConversation(BaseModel):
    __tablename__ = "ai_conversations"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(128), default="Command Session")

class AIMessage(BaseModel):
    __tablename__ = "ai_messages"

    conversation_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("ai_conversations.id", ondelete="CASCADE"), nullable=False)
    role: Mapped[str] = mapped_column(Enum("user", "assistant", "system", "tool", name="message_role"), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    tool_call_id: Mapped[str | None] = mapped_column(String(64))
    tool_name: Mapped[str | None] = mapped_column(String(64))
    tokens_used: Mapped[int | None] = mapped_column(Integer)

    __table_args__ = (
        Index("idx_ai_messages_conv", "conversation_id", "created_at"),
    )

class AIAction(BaseModel):
    __tablename__ = "ai_actions"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    tool_name: Mapped[str] = mapped_column(String(64), nullable=False)
    arguments_json: Mapped[dict] = mapped_column(JSONB, nullable=False)
    is_destructive: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    affected_records_count: Mapped[int] = mapped_column(Integer, default=1)
    status: Mapped[str] = mapped_column(Enum("PENDING_CONFIRMATION", "EXECUTED", "CANCELLED", "FAILED", name="action_status"), default="PENDING_CONFIRMATION", nullable=False)
    confirmation_token: Mapped[str | None] = mapped_column(String(64))
    confirmed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    error_message: Mapped[str | None] = mapped_column(Text)

    __table_args__ = (
        Index("idx_ai_actions_user_status", "user_id", "status"),
    )
