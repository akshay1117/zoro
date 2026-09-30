"""cybersecurity_study

Revision ID: 1e97e299f0fb
Revises: dde588827b2d
Create Date: 2026-09-30 21:30:00.653910

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1e97e299f0fb'
down_revision: Union[str, Sequence[str], None] = 'dde588827b2d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
