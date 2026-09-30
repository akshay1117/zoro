from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc, or_, and_
from app.models.note import Note
import uuid
from typing import List, Optional

class NotesRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_note(self, note: Note) -> Note:
        self.session.add(note)
        await self.session.flush()
        await self.session.refresh(note)
        return note

    async def get_notes(self, user_id: uuid.UUID, search: Optional[str] = None, limit: int = 50) -> List[Note]:
        stmt = select(Note).where(
            and_(
                Note.user_id == user_id,
                Note.is_deleted == False
            )
        ).order_by(desc(Note.is_pinned), desc(Note.updated_at))
        
        if search:
            stmt = stmt.where(
                or_(
                    Note.title.ilike(f"%{search}%"),
                    Note.content_markdown.ilike(f"%{search}%")
                )
            )
            
        stmt = stmt.limit(limit)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_note_by_id(self, note_id: uuid.UUID, user_id: uuid.UUID) -> Optional[Note]:
        stmt = select(Note).where(
            and_(
                Note.id == note_id,
                Note.user_id == user_id,
                Note.is_deleted == False
            )
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def update_note(self, note: Note) -> Note:
        await self.session.flush()
        await self.session.refresh(note)
        return note

    async def delete_note(self, note: Note) -> None:
        note.is_deleted = True
        await self.session.flush()
