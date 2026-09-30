from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc, func
from app.models.trading import Trade
import uuid
from typing import List, Optional
from datetime import datetime

class TradingRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_trade(self, trade: Trade) -> Trade:
        self.session.add(trade)
        await self.session.flush()
        await self.session.refresh(trade)
        return trade

    async def get_trades_for_user(self, user_id: uuid.UUID, limit: int = 50) -> List[Trade]:
        stmt = select(Trade).where(
            Trade.user_id == user_id
        ).order_by(desc(Trade.created_at)).limit(limit)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
        
    async def get_asset_allocation(self, user_id: uuid.UUID) -> List[dict]:
        # Calculate approximate current holdings based on buys and sells
        stmt = select(
            Trade.ticker,
            func.sum(
                func.case(
                    (Trade.direction == 'LONG', Trade.quantity),
                    (Trade.direction == 'SHORT', -Trade.quantity),
                    else_=0
                )
            ).label('net_quantity')
        ).where(
            Trade.user_id == user_id
        ).group_by(Trade.ticker).having(
            func.sum(
                func.case(
                    (Trade.direction == 'LONG', Trade.quantity),
                    (Trade.direction == 'SHORT', -Trade.quantity),
                    else_=0
                )
            ) > 0
        )
        
        result = await self.session.execute(stmt)
        return [{"symbol": row.ticker, "quantity": float(row.net_quantity)} for row in result]
