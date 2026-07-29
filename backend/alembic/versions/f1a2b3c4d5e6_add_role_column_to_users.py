"""add_role_column_to_users

Revision ID: f1a2b3c4d5e6
Revises: cda24f6f2040
Create Date: 2026-07-26

"""
from typing import Sequence, Union
import alembic
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'f1a2b3c4d5e6'
down_revision: Union[str, Sequence[str], None] = 'cda24f6f2040'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add role column to users table"""
    # Add role column with default value 'student'
    op.add_column('users', sa.Column('role', sa.String(), nullable=False, server_default='student'))
    
    # Update any existing users to have 'student' role
    op.execute("UPDATE users SET role = 'student' WHERE role IS NULL")


def downgrade() -> None:
    """Remove role column from users table"""
    op.drop_column('users', 'role')
