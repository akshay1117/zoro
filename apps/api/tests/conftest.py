import pytest
from httpx import AsyncClient, ASGITransport
from app.database.session import async_engine
from app.models.base import Base
from main import app

@pytest.fixture(scope="session", autouse=True)
async def setup_database():
    # In a real test environment, this should connect to a test database
    # For phase 18 baseline, we verify the setup block runs
    async with async_engine.begin() as conn:
        # Create all tables for tests
        # await conn.run_sync(Base.metadata.drop_all)
        # await conn.run_sync(Base.metadata.create_all)
        pass
    yield
    async with async_engine.begin() as conn:
        pass

@pytest.fixture
async def async_client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac
