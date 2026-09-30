import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.notes_repo import NotesRepository
from app.models.note import Note
from app.core.exceptions import ZoroException
from typing import List, Optional

class NotesService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.notes_repo = NotesRepository(session)

    async def create_note(self, user_id: uuid.UUID, data: dict) -> Note:
        note = Note(
            user_id=user_id,
            title=data['title'],
            content_markdown=data['content_markdown'],
            category=data.get('category', 'GENERAL'),
            tags=data.get('tags', []),
            is_pinned=data.get('is_pinned', False)
        )
        
        note = await self.notes_repo.create_note(note)
        await self.session.commit()
        return note

    async def get_notes(self, user_id: uuid.UUID, search: Optional[str] = None, limit: int = 50) -> List[Note]:
        return await self.notes_repo.get_notes(user_id, search, limit)
        
    async def get_note(self, user_id: uuid.UUID, note_id: uuid.UUID) -> Note:
        note = await self.notes_repo.get_note_by_id(note_id, user_id)
        if not note:
            raise ZoroException(message="Note not found", status_code=404)
        return note

    async def update_note(self, user_id: uuid.UUID, note_id: uuid.UUID, data: dict) -> Note:
        note = await self.get_note(user_id, note_id)
        
        if 'title' in data:
            note.title = data['title']
        if 'content_markdown' in data:
            note.content_markdown = data['content_markdown']
        if 'category' in data:
            note.category = data['category']
        if 'tags' in data:
            note.tags = data['tags']
        if 'is_pinned' in data:
            note.is_pinned = data['is_pinned']
            
        note = await self.notes_repo.update_note(note)
        await self.session.commit()
        return note

    async def delete_note(self, user_id: uuid.UUID, note_id: uuid.UUID) -> None:
        note = await self.get_note(user_id, note_id)
        await self.notes_repo.delete_note(note)
        await self.session.commit()
