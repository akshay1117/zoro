import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.ai_repo import AIRepository
from app.models.ai import AIConversation, AIMessage
from typing import List, Dict, Any

class AIService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.ai_repo = AIRepository(session)

    async def get_chat_history(self, user_id: uuid.UUID) -> List[Dict[str, Any]]:
        conv = await self.ai_repo.get_or_create_conversation(user_id)
        messages = await self.ai_repo.get_conversation_history(conv.id)
        
        return [
            {
                "id": str(msg.id),
                "role": msg.role,
                "content": msg.content,
                "created_at": msg.created_at.isoformat()
            }
            for msg in messages
        ]

    async def add_message(self, user_id: uuid.UUID, role: str, content: str) -> Dict[str, Any]:
        conv = await self.ai_repo.get_or_create_conversation(user_id)
        
        msg = AIMessage(
            conversation_id=conv.id,
            role=role,
            content=content
        )
        
        msg = await self.ai_repo.add_message(msg)
        await self.session.commit()
        
        return {
            "id": str(msg.id),
            "role": msg.role,
            "content": msg.content,
            "created_at": msg.created_at.isoformat()
        }
