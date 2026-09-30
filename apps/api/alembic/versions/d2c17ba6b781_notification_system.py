"""notification_system

Revision ID: d2c17ba6b781
Revises: 78ac1a719881
Create Date: 2026-09-30 21:30:01.190380

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd2c17ba6b781'
down_revision: Union[str, Sequence[str], None] = '78ac1a719881'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
