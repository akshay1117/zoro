from fastapi import APIRouter, Depends, Response, Request, Cookie
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm
import uuid

from app.api.deps import get_current_user
from app.database.session import get_db
from app.schemas.auth import UserRegister, UserLogin, TokenResponse, UserProfileResponse
from app.services.auth_service import AuthService
from app.models.user import User
from app.core.security import decode_token, create_access_token, create_refresh_token
from app.core.exceptions import ZoroException

router = APIRouter()

@router.post("/register", response_model=TokenResponse)
async def register(
    response: Response,
    user_in: UserRegister,
    db: AsyncSession = Depends(get_db)
):
    auth_service = AuthService(db)
    user = await auth_service.register_user(
        email=user_in.email,
        password=user_in.password,
        full_name=user_in.full_name
    )
    tokens = auth_service.create_tokens(user.id)
    
    response.set_cookie(
        key="refresh_token",
        value=tokens["refresh_token"],
        httponly=True,
        secure=True,
        samesite="strict",
        path="/api/v1/auth"
    )
    
    return {"access_token": tokens["access_token"], "token_type": "bearer"}

@router.post("/login", response_model=TokenResponse)
async def login(
    response: Response,
    user_in: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    auth_service = AuthService(db)
    user = await auth_service.authenticate_user(
        email=user_in.email,
        password=user_in.password
    )
    tokens = auth_service.create_tokens(user.id)
    
    response.set_cookie(
        key="refresh_token",
        value=tokens["refresh_token"],
        httponly=True,
        secure=True,
        samesite="strict",
        path="/api/v1/auth"
    )
    
    return {"access_token": tokens["access_token"], "token_type": "bearer"}

@router.post("/login/swagger", response_model=TokenResponse)
async def login_swagger(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    auth_service = AuthService(db)
    user = await auth_service.authenticate_user(
        email=form_data.username,
        password=form_data.password
    )
    tokens = auth_service.create_tokens(user.id)
    
    response.set_cookie(
        key="refresh_token",
        value=tokens["refresh_token"],
        httponly=True,
        secure=True,
        samesite="strict",
        path="/api/v1/auth"
    )
    
    return {"access_token": tokens["access_token"], "token_type": "bearer"}

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    response: Response,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise ZoroException(status_code=401, code="AUTH_NO_REFRESH_TOKEN", message="Refresh token missing")
        
    try:
        payload = decode_token(refresh_token)
        if payload.get("type") != "refresh":
            raise ZoroException(status_code=401, code="AUTH_INVALID_TOKEN", message="Invalid token type")
            
        user_id = uuid.UUID(payload.get("sub"))
    except Exception:
        raise ZoroException(status_code=401, code="AUTH_INVALID_TOKEN", message="Invalid refresh token")
        
    access_token = create_access_token(subject=user_id)
    new_refresh_token = create_refresh_token(subject=user_id)
    
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
        path="/api/v1/auth"
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(
        key="refresh_token",
        path="/api/v1/auth",
        secure=True,
        httponly=True,
        samesite="strict"
    )
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=UserProfileResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user
