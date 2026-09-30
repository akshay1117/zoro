from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc, update, func
from app.models.notification import Notification
from app.models.base import get_utc_now
import uuid
from typing import List, Tuple

class NotificationRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_notification(self, notification: Notification) -> Notification:
        self.session.add(notification)
        await self.session.flush()
        await self.session.refresh(notification)
        return notification

    async def get_notifications(self, user_id: uuid.UUID, limit: int = 20, offset: int = 0) -> List[Notification]:
        stmt = select(Notification).where(
            Notification.user_id == user_id
        ).order_by(desc(Notification.created_at)).limit(limit).offset(offset)
        
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_unread_count(self, user_id: uuid.UUID) -> int:
        stmt = select(func.count()).select_from(Notification).where(
            Notification.user_id == user_id,
            Notification.is_read == False
        )
        
        result = await self.session.execute(stmt)
        return result.scalar_one()

    async def mark_as_read(self, notification_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        stmt = update(Notification).where(
            Notification.id == notification_id,
            Notification.user_id == user_id
        ).values(
            is_read=True,
            read_at=get_utc_now()
        )
        
        result = await self.session.execute(stmt)
        return result.rowcount > 0

    async def mark_all_as_read(self, user_id: uuid.UUID) -> int:
        stmt = update(Notification).where(
            Notification.user_id == user_id,
            Notification.is_read == False
        ).values(
            is_read=True,
            read_at=get_utc_now()
        )
        
        result = await self.session.execute(stmt)
        return result.rowcount
