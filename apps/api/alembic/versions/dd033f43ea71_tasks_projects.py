"""tasks_projects

Revision ID: dd033f43ea71
Revises: 9c98ca365ead
Create Date: 2026-09-30 21:29:59.767256

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dd033f43ea71'
down_revision: Union[str, Sequence[str], None] = '9c98ca365ead'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
