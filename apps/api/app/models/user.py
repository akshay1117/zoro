import uuid
from sqlalchemy import String, Boolean, Numeric, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import BaseModel

class User(BaseModel):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    
    profile: Mapped["Profile"] = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")

class Profile(BaseModel):
    __tablename__ = "profiles"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(128), nullable=False)
    college_name: Mapped[str | None] = mapped_column(String(255))
    engineering_major: Mapped[str | None] = mapped_column(String(128))
    current_semester: Mapped[int] = mapped_column(Integer, default=1)
    target_sleep_hours: Mapped[float] = mapped_column(Numeric(3, 1), default=7.5)
    monthly_expense_budget: Mapped[float] = mapped_column(Numeric(10, 2), default=8000.00)
    currency: Mapped[str] = mapped_column(String(3), default='INR', nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="profile")
