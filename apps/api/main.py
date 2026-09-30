import datetime
import structlog
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.core.config import settings
from app.core.exceptions import ZoroException
from app.middleware.request_id import RequestIDMiddleware
from app.middleware.logging import StructlogMiddleware
from app.middleware.security_headers import SecurityHeadersMiddleware

# Structlog configuration
structlog.configure(
    processors=[
        structlog.contextvars.merge_contextvars,
        structlog.stdlib.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer(),
    ],
    wrapper_class=structlog.make_filtering_bound_logger(20), # INFO level
    context_class=dict,
    logger_factory=structlog.PrintLoggerFactory(),
)

logger = structlog.get_logger("app.api")

limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: connect to db, init redis, etc.
    logger.info("startup", message="Starting ZORO API")
    yield
    # Shutdown: cleanup resources
    logger.info("shutdown", message="Shutting down ZORO API")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# SlowAPI Rate Limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    # Default open CORS for local development (restrict in production)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Middlewares
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(StructlogMiddleware)
app.add_middleware(RequestIDMiddleware)


# Standard Exception Handler
@app.exception_handler(ZoroException)
async def zoro_exception_handler(request: Request, exc: ZoroException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": exc.details
            },
            "meta": {
                "request_id": getattr(request.state, "request_id", None),
                "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00", "Z")
            }
        }
    )

# Override default rate limit handler to match ZORO standards
@app.exception_handler(RateLimitExceeded)
async def custom_rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={
            "success": False,
            "error": {
                "code": "RATE_LIMIT_EXCEEDED",
                "message": "You are sending commands too quickly. Please slow down.",
                "details": {"limit": str(exc.detail)}
            },
            "meta": {
                "request_id": getattr(request.state, "request_id", None),
                "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00", "Z")
            }
        }
    )


# Health Endpoints
from sqlalchemy import text
from app.database.session import async_engine

@app.get("/health/live", tags=["health"])
async def health_live():
    return {"status": "ok", "type": "liveness"}

@app.get("/health/ready", tags=["health"])
async def health_ready():
    try:
        async with async_engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        db_status = "ok"
    except Exception as e:
        logger.error("database_health_check_failed", error=str(e))
        db_status = "failed"
        
    return {
        "status": "ok" if db_status == "ok" else "error",
        "type": "readiness",
        "components": {
            "database": db_status
        }
    }

from app.api.v1.router import api_router

# Application Routers
app.include_router(api_router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
