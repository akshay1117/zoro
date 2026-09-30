from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.core.config import settings
from app.core.security import ALGORITHM
from app.database.session import get_db
from app.models.user import User
from app.repositories.user_repo import UserRepository
from app.core.exceptions import ZoroException

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login/swagger" # For swagger UI
)

async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        user_id_str: str = payload.get("sub")
        if user_id_str is None:
            raise ZoroException(status_code=401, code="AUTH_INVALID_TOKEN", message="Could not validate credentials")
        try:
            user_id = uuid.UUID(user_id_str)
        except ValueError:
            raise ZoroException(status_code=401, code="AUTH_INVALID_TOKEN", message="Could not validate credentials")
            
        token_type = payload.get("type")
        if token_type != "access":
            raise ZoroException(status_code=401, code="AUTH_INVALID_TOKEN", message="Invalid token type")
            
    except JWTError:
        raise ZoroException(status_code=401, code="AUTH_INVALID_TOKEN", message="Could not validate credentials")

    user_repo = UserRepository(db)
    user = await user_repo.get_by_id(user_id)
    
    if not user:
        raise ZoroException(status_code=404, code="AUTH_USER_NOT_FOUND", message="User not found")
        
    if not user.is_active:
        raise ZoroException(status_code=403, code="AUTH_USER_INACTIVE", message="Inactive user")
        
    return user
