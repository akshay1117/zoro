import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User, Profile
from app.repositories.user_repo import UserRepository
from app.core.security import get_password_hash, verify_password, create_access_token, create_refresh_token
from app.core.exceptions import ZoroException

class AuthService:
    def __init__(self, session: AsyncSession):
        self.user_repo = UserRepository(session)

    async def register_user(self, email: str, password: str, full_name: str) -> User:
        existing_user = await self.user_repo.get_by_email(email)
        if existing_user:
            raise ZoroException(
                status_code=400,
                code="AUTH_EMAIL_ALREADY_EXISTS",
                message="A user with this email already exists."
            )
        
        hashed_password = get_password_hash(password)
        
        new_user = User(email=email, hashed_password=hashed_password)
        new_profile = Profile(full_name=full_name)
        
        return await self.user_repo.create_user(new_user, new_profile)

    async def authenticate_user(self, email: str, password: str) -> User:
        user = await self.user_repo.get_by_email(email)
        if not user:
            raise ZoroException(
                status_code=401,
                code="AUTH_INVALID_CREDENTIALS",
                message="Invalid email or password."
            )
        
        if not verify_password(password, user.hashed_password):
            raise ZoroException(
                status_code=401,
                code="AUTH_INVALID_CREDENTIALS",
                message="Invalid email or password."
            )
            
        if not user.is_active:
            raise ZoroException(
                status_code=403,
                code="AUTH_USER_INACTIVE",
                message="User account is inactive."
            )
            
        return user
        
    def create_tokens(self, user_id: uuid.UUID) -> dict:
        access_token = create_access_token(subject=user_id)
        refresh_token = create_refresh_token(subject=user_id)
        return {
            "access_token": access_token,
            "refresh_token": refresh_token
        }
