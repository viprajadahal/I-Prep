"""update study_resources model

Revision ID: update_study_resources_model
Revises: add_study_resources
Create Date: 2026-07-07 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'update_study_resources_model'
down_revision = 'add_study_resources'
branch_labels = None
depends_on = None


def upgrade():
    op.drop_column('study_resources', 'difficulty')
    op.drop_column('study_resources', 'resource_type')
    op.drop_column('study_resources', 'thumbnail')
    op.drop_column('study_resources', 'download_count')
    op.drop_column('study_resources', 'file_url')
    
    op.add_column('study_resources', sa.Column('file_path', sa.String(length=500), nullable=False))


def downgrade():
    op.drop_column('study_resources', 'file_path')
    
    op.add_column('study_resources', sa.Column('file_url', sa.String(length=500), nullable=False))
    op.add_column('study_resources', sa.Column('download_count', sa.Integer(), nullable=False, server_default='0'))
    op.add_column('study_resources', sa.Column('thumbnail', sa.String(length=500), nullable=True))
    op.add_column('study_resources', sa.Column('resource_type', sa.String(length=50), nullable=False, server_default='Document'))
    op.add_column('study_resources', sa.Column('difficulty', sa.String(length=20), nullable=True, server_default='medium'))
