"""trading_journal

Revision ID: dde588827b2d
Revises: 4f34a24cd537
Create Date: 2026-09-30 21:30:00.475124

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dde588827b2d'
down_revision: Union[str, Sequence[str], None] = '4f34a24cd537'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
