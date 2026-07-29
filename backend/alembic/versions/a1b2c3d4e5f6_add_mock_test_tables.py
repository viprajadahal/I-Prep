"""add mock test tables

Revision ID: a1b2c3d4e5f6
Revises: 148d2f1f4e7c
Create Date: 2026-07-14 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = 'a1b2c3d4e5f6'
down_revision = 'c7944f771840'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'mock_tests',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('duration_minutes', sa.Integer(), nullable=False, server_default='165'),
        sa.Column('difficulty', sa.String(length=50), nullable=False, server_default='Academic'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        'mock_sections',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('test_id', sa.Integer(), sa.ForeignKey('mock_tests.id', ondelete='CASCADE'), nullable=False),
        sa.Column('section_type', sa.String(length=50), nullable=False),
        sa.Column('section_order', sa.Integer(), nullable=False),
        sa.Column('time_limit_minutes', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
    )
    op.create_index('idx_section_test_type', 'mock_sections', ['test_id', 'section_type'], unique=True)

    op.create_table(
        'mock_passages',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('section_id', sa.Integer(), sa.ForeignKey('mock_sections.id', ondelete='CASCADE'), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('passage_text', sa.Text(), nullable=False),
        sa.Column('passage_order', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('audio_url', sa.String(length=500), nullable=True),
    )

    op.create_table(
        'mock_questions',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('section_id', sa.Integer(), sa.ForeignKey('mock_sections.id', ondelete='CASCADE'), nullable=False),
        sa.Column('passage_id', sa.Integer(), sa.ForeignKey('mock_passages.id', ondelete='SET NULL'), nullable=True),
        sa.Column('question_type', sa.String(length=100), nullable=False),
        sa.Column('question_text', sa.Text(), nullable=False),
        sa.Column('options', postgresql.JSONB(), nullable=True),
        sa.Column('correct_answer', postgresql.JSONB(), nullable=False),
        sa.Column('acceptable_answers', postgresql.JSONB(), nullable=True),
        sa.Column('question_order', sa.Integer(), nullable=False),
        sa.Column('marks', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('prompt_text', sa.Text(), nullable=True),
        sa.Column('cue_card', postgresql.JSONB(), nullable=True),
        sa.Column('time_limit_minutes', sa.Integer(), nullable=True),
    )
    op.create_index('idx_question_section', 'mock_questions', ['section_id', 'question_order'])

    op.create_table(
        'test_attempts',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('test_id', sa.Integer(), sa.ForeignKey('mock_tests.id', ondelete='CASCADE'), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='in_progress'),
        sa.Column('started_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('ended_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('remaining_time_seconds', sa.Integer(), nullable=False, server_default='9900'),
        sa.Column('current_section', sa.String(length=50), nullable=False, server_default='listening'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('idx_attempt_user_test', 'test_attempts', ['user_id', 'test_id'])
    op.create_index('idx_attempt_status', 'test_attempts', ['user_id', 'status'])

    op.create_table(
        'user_answers',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('attempt_id', sa.Integer(), sa.ForeignKey('test_attempts.id', ondelete='CASCADE'), nullable=False),
        sa.Column('question_id', sa.Integer(), sa.ForeignKey('mock_questions.id', ondelete='CASCADE'), nullable=False),
        sa.Column('answer_text', sa.Text(), nullable=True),
        sa.Column('audio_url', sa.String(length=500), nullable=True),
        sa.Column('transcript', sa.Text(), nullable=True),
        sa.Column('is_marked_for_review', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('section', sa.String(length=50), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('idx_answer_attempt_question', 'user_answers', ['attempt_id', 'question_id'], unique=True)
    op.create_index('idx_answer_attempt_section', 'user_answers', ['attempt_id', 'section'])

    op.create_table(
        'section_timings',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('attempt_id', sa.Integer(), sa.ForeignKey('test_attempts.id', ondelete='CASCADE'), nullable=False),
        sa.Column('section_type', sa.String(length=50), nullable=False),
        sa.Column('time_limit_seconds', sa.Integer(), nullable=False),
        sa.Column('time_spent_seconds', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('remaining_seconds', sa.Integer(), nullable=False),
        sa.Column('started_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('ended_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('idx_timing_attempt_section', 'section_timings', ['attempt_id', 'section_type'], unique=True)

    op.create_table(
        'test_results',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('attempt_id', sa.Integer(), sa.ForeignKey('test_attempts.id', ondelete='CASCADE'), nullable=False, unique=True),
        sa.Column('overall_band', sa.Float(), nullable=False),
        sa.Column('listening_band', sa.Float(), nullable=False),
        sa.Column('reading_band', sa.Float(), nullable=False),
        sa.Column('writing_band', sa.Float(), nullable=False),
        sa.Column('speaking_band', sa.Float(), nullable=False),
        sa.Column('listening_score', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('listening_total', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('reading_score', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('reading_total', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('writing_score', sa.Float(), nullable=False, server_default='0'),
        sa.Column('speaking_score', sa.Float(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        'writing_analyses',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('attempt_id', sa.Integer(), sa.ForeignKey('test_attempts.id', ondelete='CASCADE'), nullable=False),
        sa.Column('task_number', sa.Integer(), nullable=False),
        sa.Column('user_answer', sa.Text(), nullable=False),
        sa.Column('word_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('grammar_score', sa.Float(), nullable=False, server_default='0'),
        sa.Column('vocabulary_score', sa.Float(), nullable=False, server_default='0'),
        sa.Column('task_response_score', sa.Float(), nullable=False, server_default='0'),
        sa.Column('coherence_score', sa.Float(), nullable=False, server_default='0'),
        sa.Column('sentence_variety_score', sa.Float(), nullable=False, server_default='0'),
        sa.Column('estimated_band', sa.Float(), nullable=False, server_default='0'),
        sa.Column('feedback', sa.Text(), nullable=True),
        sa.Column('strengths', postgresql.JSONB(), nullable=True),
        sa.Column('weaknesses', postgresql.JSONB(), nullable=True),
        sa.Column('recommendations', postgresql.JSONB(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('idx_writing_attempt_task', 'writing_analyses', ['attempt_id', 'task_number'], unique=True)

    op.create_table(
        'speaking_analyses',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('attempt_id', sa.Integer(), sa.ForeignKey('test_attempts.id', ondelete='CASCADE'), nullable=False),
        sa.Column('part_number', sa.Integer(), nullable=False),
        sa.Column('audio_url', sa.String(length=500), nullable=True),
        sa.Column('transcript', sa.Text(), nullable=True),
        sa.Column('duration_seconds', sa.Float(), nullable=False, server_default='0'),
        sa.Column('grammar_score', sa.Float(), nullable=False, server_default='0'),
        sa.Column('vocabulary_score', sa.Float(), nullable=False, server_default='0'),
        sa.Column('fluency_score', sa.Float(), nullable=False, server_default='0'),
        sa.Column('pronunciation_score', sa.Float(), nullable=False, server_default='0'),
        sa.Column('coherence_score', sa.Float(), nullable=False, server_default='0'),
        sa.Column('estimated_band', sa.Float(), nullable=False, server_default='0'),
        sa.Column('feedback', sa.Text(), nullable=True),
        sa.Column('strengths', postgresql.JSONB(), nullable=True),
        sa.Column('weaknesses', postgresql.JSONB(), nullable=True),
        sa.Column('recommendations', postgresql.JSONB(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index('idx_speaking_attempt_part', 'speaking_analyses', ['attempt_id', 'part_number'], unique=True)


def downgrade() -> None:
    op.drop_table('speaking_analyses')
    op.drop_table('writing_analyses')
    op.drop_table('test_results')
    op.drop_table('section_timings')
    op.drop_table('user_answers')
    op.drop_table('test_attempts')
    op.drop_table('mock_questions')
    op.drop_table('mock_passages')
    op.drop_table('mock_sections')
    op.drop_table('mock_tests')
