from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from app.models.ai import AIConversation, AIMessage
import uuid
from typing import List, Optional

class AIRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_or_create_conversation(self, user_id: uuid.UUID) -> AIConversation:
        # For phase 15, we assume 1 active conversation thread per user (the "Command Session")
        stmt = select(AIConversation).where(AIConversation.user_id == user_id).order_by(desc(AIConversation.created_at)).limit(1)
        result = await self.session.execute(stmt)
        conv = result.scalars().first()
        
        if not conv:
            conv = AIConversation(user_id=user_id, title="Command Session")
            self.session.add(conv)
            await self.session.flush()
            await self.session.refresh(conv)
            
        return conv

    async def add_message(self, message: AIMessage) -> AIMessage:
        self.session.add(message)
        await self.session.flush()
        await self.session.refresh(message)
        return message

    async def get_conversation_history(self, conversation_id: uuid.UUID, limit: int = 50) -> List[AIMessage]:
        stmt = select(AIMessage).where(
            AIMessage.conversation_id == conversation_id
        ).order_by(AIMessage.created_at).limit(limit)
        
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
