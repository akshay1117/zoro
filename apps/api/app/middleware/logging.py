import time
import structlog
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request

logger = structlog.get_logger("app.api")

class StructlogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.perf_counter()
        request_id = getattr(request.state, "request_id", "unknown")
        
        structlog.contextvars.clear_contextvars()
        structlog.contextvars.bind_contextvars(
            request_id=request_id,
            method=request.method,
            path=request.url.path
        )
        
        try:
            response = await call_next(request)
            process_time = (time.perf_counter() - start_time) * 1000
            
            # Don't log health checks to avoid noise
            if request.url.path not in ["/health/live", "/health/ready"]:
                logger.info(
                    "request_completed",
                    status_code=response.status_code,
                    duration_ms=round(process_time, 2)
                )
            return response
        except Exception as e:
            process_time = (time.perf_counter() - start_time) * 1000
            logger.error(
                "request_failed",
                error=str(e),
                duration_ms=round(process_time, 2)
            )
            raise
