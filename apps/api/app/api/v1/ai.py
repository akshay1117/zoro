from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any
from pydantic import BaseModel
import asyncio

from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.services.ai_service import AIService

router = APIRouter()

class MessageCreate(BaseModel):
    content: str

@router.get("/history")
async def get_chat_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = AIService(db)
    return await service.get_chat_history(current_user.id)

@router.post("/chat")
async def chat_with_zoro(
    msg_in: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    service = AIService(db)
    
    # 1. Log the user's message
    user_msg = await service.add_message(current_user.id, "user", msg_in.content)
    
    # 2. Mock AI Processing Delay
    await asyncio.sleep(1.0)
    
    # 3. Generate Mock ZORO Response
    response_content = f"ZORO Acknowledged: '{msg_in.content}'. (Core AI Engine to be fully integrated in subsequent phases)."
    
    # 4. Log the assistant's message
    ai_msg = await service.add_message(current_user.id, "assistant", response_content)
    
    return {
        "user_message": user_msg,
        "ai_message": ai_msg
    }
