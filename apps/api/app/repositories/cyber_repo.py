from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from app.models.cybersecurity import CybersecurityTopic, LearningSession
import uuid
from typing import List, Optional

class CyberRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_topic(self, topic: CybersecurityTopic) -> CybersecurityTopic:
        self.session.add(topic)
        await self.session.flush()
        await self.session.refresh(topic)
        return topic

    async def get_topics(self, user_id: uuid.UUID) -> List[CybersecurityTopic]:
        stmt = select(CybersecurityTopic).where(
            CybersecurityTopic.user_id == user_id
        ).order_by(CybersecurityTopic.name)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def create_session(self, session_obj: LearningSession) -> LearningSession:
        self.session.add(session_obj)
        await self.session.flush()
        await self.session.refresh(session_obj)
        return session_obj

    async def get_sessions(self, user_id: uuid.UUID, limit: int = 50) -> List[LearningSession]:
        stmt = select(LearningSession).where(
            LearningSession.user_id == user_id
        ).order_by(desc(LearningSession.created_at)).limit(limit)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
