import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.cyber_repo import CyberRepository
from app.models.cybersecurity import CybersecurityTopic, LearningSession
from typing import List

class CyberService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.cyber_repo = CyberRepository(session)

    async def create_topic(self, user_id: uuid.UUID, data: dict) -> CybersecurityTopic:
        topic = CybersecurityTopic(
            user_id=user_id,
            name=data['name'],
            domain=data['domain'],
            difficulty=data.get('difficulty', 'INTERMEDIATE')
        )
        
        topic = await self.cyber_repo.create_topic(topic)
        await self.session.commit()
        return topic

    async def get_topics(self, user_id: uuid.UUID) -> List[CybersecurityTopic]:
        return await self.cyber_repo.get_topics(user_id)

    async def log_session(self, user_id: uuid.UUID, data: dict) -> LearningSession:
        session_obj = LearningSession(
            user_id=user_id,
            topic_id=data.get('topic_id'),
            platform=data['platform'],
            session_title=data['session_title'],
            duration_minutes=data['duration_minutes'],
            flags_captured=data.get('flags_captured', 0),
            notes_markdown=data.get('notes_markdown')
        )
        
        session_obj = await self.cyber_repo.create_session(session_obj)
        await self.session.commit()
        return session_obj

    async def get_sessions(self, user_id: uuid.UUID, limit: int = 50) -> List[LearningSession]:
        return await self.cyber_repo.get_sessions(user_id, limit)
