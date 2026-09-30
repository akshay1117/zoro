import pytest
from fastapi.testclient import TestClient
from main import app
from app.core.exceptions import ZoroException

client = TestClient(app)

def test_health_live():
    response = client.get("/health/live")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "type": "liveness"}

def test_health_ready():
    response = client.get("/health/ready")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "type": "readiness"}

def test_request_id_middleware():
    response = client.get("/health/live")
    assert "X-Request-ID" in response.headers
    request_id = response.headers["X-Request-ID"]
    assert request_id.startswith("req_")

def test_request_id_custom_header():
    custom_id = "req_custom123"
    response = client.get("/health/live", headers={"X-Request-ID": custom_id})
    assert response.headers["X-Request-ID"] == custom_id

@app.get("/test-error")
def dummy_error_endpoint():
    raise ZoroException(
        code="TEST_ERROR",
        message="This is a test error",
        status_code=400,
        details={"info": "additional info"}
    )

def test_standard_error_response():
    response = client.get("/test-error")
    assert response.status_code == 400
    
    data = response.json()
    assert data["success"] is False
    assert "error" in data
    assert data["error"]["code"] == "TEST_ERROR"
    assert data["error"]["message"] == "This is a test error"
    assert data["error"]["details"] == {"info": "additional info"}
    
    assert "meta" in data
    assert "request_id" in data["meta"]
    assert "timestamp" in data["meta"]
