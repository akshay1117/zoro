"""ai_agent_audit

Revision ID: 78ac1a719881
Revises: 1907b598e9f8
Create Date: 2026-09-30 21:30:01.010809

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '78ac1a719881'
down_revision: Union[str, Sequence[str], None] = '1907b598e9f8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
