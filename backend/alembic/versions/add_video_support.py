"""add video support columns to study_resources

Revision ID: add_video_support
Revises: update_study_resources_model
Create Date: 2026-07-14 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_video_support'
down_revision = 'update_study_resources_model'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('study_resources', sa.Column('thumbnail_url', sa.String(length=500), nullable=True))
    op.add_column('study_resources', sa.Column('duration', sa.String(length=20), nullable=True))


def downgrade():
    op.drop_column('study_resources', 'duration')
    op.drop_column('study_resources', 'thumbnail_url')
