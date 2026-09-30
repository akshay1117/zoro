import uuid
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.notification_repo import NotificationRepository
from app.models.notification import Notification

class NotificationService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = NotificationRepository(session)

    async def create_notification(self, user_id: uuid.UUID, title: str, message: str, notification_type: str, link_url: Optional[str] = None) -> Dict[str, Any]:
        notif = Notification(
            user_id=user_id,
            title=title,
            message=message,
            notification_type=notification_type,
            link_url=link_url
        )
        notif = await self.repo.create_notification(notif)
        await self.session.commit()
        return self._format_notification(notif)

    async def get_notifications(self, user_id: uuid.UUID, limit: int = 20, offset: int = 0) -> List[Dict[str, Any]]:
        notifs = await self.repo.get_notifications(user_id, limit, offset)
        return [self._format_notification(n) for n in notifs]

    async def get_unread_count(self, user_id: uuid.UUID) -> int:
        return await self.repo.get_unread_count(user_id)

    async def mark_as_read(self, user_id: uuid.UUID, notification_id: uuid.UUID) -> bool:
        success = await self.repo.mark_as_read(notification_id, user_id)
        if success:
            await self.session.commit()
        return success

    async def mark_all_as_read(self, user_id: uuid.UUID) -> int:
        count = await self.repo.mark_all_as_read(user_id)
        if count > 0:
            await self.session.commit()
        return count

    def _format_notification(self, notif: Notification) -> Dict[str, Any]:
        return {
            "id": str(notif.id),
            "title": notif.title,
            "message": notif.message,
            "notification_type": notif.notification_type,
            "link_url": notif.link_url,
            "is_read": notif.is_read,
            "created_at": notif.created_at.isoformat(),
            "read_at": notif.read_at.isoformat() if notif.read_at else None
        }
