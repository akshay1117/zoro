"""notes_knowledge

Revision ID: 1907b598e9f8
Revises: 1e97e299f0fb
Create Date: 2026-09-30 21:30:00.830784

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1907b598e9f8'
down_revision: Union[str, Sequence[str], None] = '1e97e299f0fb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
