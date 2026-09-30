from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.user import User, Profile
import uuid

class UserRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_email(self, email: str) -> User | None:
        stmt = select(User).where(User.email == email)
        result = await self.session.execute(stmt)
        return result.scalars().first()
        
    async def get_by_id(self, user_id: uuid.UUID) -> User | None:
        stmt = select(User).where(User.id == user_id)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def create_user(self, user: User, profile: Profile) -> User:
        self.session.add(user)
        await self.session.flush() # flush to get user.id
        
        profile.user_id = user.id
        self.session.add(profile)
        
        await self.session.commit()
        await self.session.refresh(user)
        return user
