from typing import Any, Dict, Optional

class ZoroException(Exception):
    def __init__(
        self,
        code: str,
        message: str,
        status_code: int = 400,
        details: Optional[Dict[str, Any]] = None
    ):
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(message)

class ResourceNotFoundException(ZoroException):
    def __init__(self, resource: str, resource_id: str):
        super().__init__(
            code=f"{resource.upper()}_NOT_FOUND",
            message=f"{resource.capitalize()} with identifier '{resource_id}' was not found.",
            status_code=404
        )

class AIExecutionException(ZoroException):
    def __init__(self, tool_name: str, reason: str):
        super().__init__(
            code="AI_TOOL_EXECUTION_FAILED",
            message=f"Failed to execute AI tool '{tool_name}': {reason}",
            status_code=500
        )
