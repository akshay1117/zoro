import uuid
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.trading_repo import TradingRepository
from app.models.trading import Trade
from app.core.exceptions import ZoroException
from typing import List, Optional, Dict

class TradingService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.trading_repo = TradingRepository(session)

    async def log_trade(self, user_id: uuid.UUID, data: dict) -> Trade:
        trade = Trade(
            user_id=user_id,
            ticker=data['ticker'].upper(),
            direction=data['direction'].upper(),
            quantity=data['quantity'],
            entry_price=data['entry_price'],
            stop_loss=data['stop_loss'],
            target_price=data['target_price']
        )
        
        trade = await self.trading_repo.create_trade(trade)
        await self.session.commit()
        return trade

    async def get_recent_trades(self, user_id: uuid.UUID, limit: int = 50) -> List[Trade]:
        return await self.trading_repo.get_trades_for_user(user_id, limit)

    async def get_portfolio_summary(self, user_id: uuid.UUID) -> Dict:
        allocation = await self.trading_repo.get_asset_allocation(user_id)
        
        return {
            "current_value": 0,
            "cash_balance": 0,
            "allocation": allocation,
            "last_updated": None
        }
