from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)
        
        # Prevent browsers from MIME-sniffing a response away from the declared content-type
        response.headers["X-Content-Type-Options"] = "nosniff"
        
        # Stop pages from loading when they detect reflected cross-site scripting (XSS) attacks
        response.headers["X-XSS-Protection"] = "1; mode=block"
        
        # Protect against clickjacking
        response.headers["X-Frame-Options"] = "DENY"
        
        # Ensure browsers always connect via HTTPS
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        # Content Security Policy (Basic API template)
        csp = (
            "default-src 'none'; "
            "frame-ancestors 'none'; "
            "form-action 'none';"
        )
        response.headers["Content-Security-Policy"] = csp
        
        return response
