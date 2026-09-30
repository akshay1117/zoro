from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any
import uuid
from pydantic import BaseModel, Field
from datetime import datetime

from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.services.trading_service import TradingService

router = APIRouter()

class TradeCreate(BaseModel):
    ticker: str = Field(..., min_length=1)
    direction: str
    quantity: float = Field(..., gt=0)
    entry_price: float = Field(..., gt=0)
    stop_loss: float = Field(..., gt=0)
    target_price: float = Field(..., gt=0)

class TradeResponse(BaseModel):
    id: uuid.UUID
    ticker: str
    direction: str
    quantity: float
    entry_price: float
    created_at: datetime
    
    class Config:
        from_attributes = True

@router.post("/trades", response_model=TradeResponse)
async def log_trade(
    trade_in: TradeCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = TradingService(db)
    return await service.log_trade(current_user.id, trade_in.model_dump())

@router.get("/trades", response_model=List[TradeResponse])
async def get_recent_trades(
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = TradingService(db)
    return await service.get_recent_trades(current_user.id, limit)

@router.get("/portfolio", response_model=Dict[str, Any])
async def get_portfolio_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = TradingService(db)
    return await service.get_portfolio_summary(current_user.id)
