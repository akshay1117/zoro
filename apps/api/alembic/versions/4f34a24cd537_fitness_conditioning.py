"""fitness_conditioning

Revision ID: 4f34a24cd537
Revises: abb41e01c51b
Create Date: 2026-09-30 21:30:00.296527

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4f34a24cd537'
down_revision: Union[str, Sequence[str], None] = 'abb41e01c51b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
