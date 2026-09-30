"""financial_expenses

Revision ID: abb41e01c51b
Revises: 4cdccbf64bd2
Create Date: 2026-09-30 21:30:00.120353

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'abb41e01c51b'
down_revision: Union[str, Sequence[str], None] = '4cdccbf64bd2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
