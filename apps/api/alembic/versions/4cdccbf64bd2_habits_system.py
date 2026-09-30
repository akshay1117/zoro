"""habits_system

Revision ID: 4cdccbf64bd2
Revises: dd033f43ea71
Create Date: 2026-09-30 21:29:59.943475

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4cdccbf64bd2'
down_revision: Union[str, Sequence[str], None] = 'dd033f43ea71'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
