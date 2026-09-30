import uuid
from datetime import date, datetime
from sqlalchemy import String, Boolean, Numeric, ForeignKey, Date, DateTime, Index, Enum, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import BaseModel

class ExpenseCategory(BaseModel):
    __tablename__ = "expense_categories"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(64), nullable=False)
    color_hex: Mapped[str] = mapped_column(String(7), default="#8B5CF6")
    monthly_budget: Mapped[float | None] = mapped_column(Numeric(10, 2))

class Expense(BaseModel):
    __tablename__ = "expenses"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    category_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("expense_categories.id", ondelete="SET NULL"))
    amount: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="INR", nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    expense_date: Mapped[date] = mapped_column(Date, nullable=False)
    payment_method: Mapped[str] = mapped_column(Enum("UPI", "CASH", "DEBIT_CARD", "CREDIT_CARD", "NET_BANKING", name="payment_mode"), default="UPI", nullable=False)
    notes: Mapped[str | None] = mapped_column(Text)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    __table_args__ = (
        Index("idx_expenses_user_date", "user_id", "expense_date", postgresql_where="NOT is_deleted"),
    )
