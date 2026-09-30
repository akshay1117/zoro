import uuid
from datetime import date
from sqlalchemy import String, Integer, Numeric, ForeignKey, Date, Enum, Index, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import BaseModel

class TradingStrategy(BaseModel):
    __tablename__ = "trading_strategies"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    market: Mapped[str] = mapped_column(String(64), default="INDIAN_EQUITY")
    timeframe: Mapped[str] = mapped_column(String(32), default="5M")

class TradingSession(BaseModel):
    __tablename__ = "trading_sessions"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    session_date: Mapped[date] = mapped_column(Date, nullable=False)
    total_trades: Mapped[int] = mapped_column(Integer, default=0)
    gross_pnl: Mapped[float] = mapped_column(Numeric(12, 2), default=0)
    market_notes: Mapped[str | None] = mapped_column(Text)

class Trade(BaseModel):
    __tablename__ = "trades"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    session_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("trading_sessions.id", ondelete="SET NULL"))
    strategy_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("trading_strategies.id", ondelete="SET NULL"))
    ticker: Mapped[str] = mapped_column(String(32), nullable=False)
    direction: Mapped[str] = mapped_column(Enum("LONG", "SHORT", name="trade_direction"), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    entry_price: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    stop_loss: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    target_price: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    exit_price: Mapped[float | None] = mapped_column(Numeric(12, 2))
    pnl: Mapped[float | None] = mapped_column(Numeric(12, 2))
    status: Mapped[str] = mapped_column(Enum("OPEN", "CLOSED", "CANCELLED", name="trade_status"), default="CLOSED", nullable=False)
    chart_image_url: Mapped[str | None] = mapped_column(String(512))
    psychology_notes: Mapped[str | None] = mapped_column(Text)

    __table_args__ = (
        Index("idx_trades_user_ticker", "user_id", "ticker"),
    )
