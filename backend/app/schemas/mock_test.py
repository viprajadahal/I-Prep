from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime


class AttemptSummary(BaseModel):
    attempt_id: int
    overall_band: Optional[float] = None
    completed_at: Optional[datetime] = None


class ProgressSectionScore(BaseModel):
    section_type: str
    band: float
    score: float
    total: int
    label: str = ""


class ProgressAttemptItem(BaseModel):
    attempt_id: int
    test_id: int
    test_title: str
    overall_band: float
    sections: list[ProgressSectionScore] = []
    completed_at: Optional[datetime] = None


class ProgressResponse(BaseModel):
    total_attempts: int
    best_overall_band: Optional[float] = None
    average_overall_band: Optional[float] = None
    attempts: list[ProgressAttemptItem] = []


class MockTestListResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    duration_minutes: int
    difficulty: str
    sections: int
    completed: bool = False
    score: Optional[float] = None
    best_score: Optional[float] = None
    attempt_id: Optional[int] = None
    total_attempts: int = 0
    attempts: list[AttemptSummary] = []


class QuestionOption(BaseModel):
    label: str
    text: str


class QuestionResponse(BaseModel):
    id: int
    question_type: str
    question_text: str
    options: Optional[Any] = None
    question_order: int
    marks: int
    passage_id: Optional[int] = None
    prompt_text: Optional[str] = None
    cue_card: Optional[dict] = None
    time_limit_minutes: Optional[int] = None


class PassageResponse(BaseModel):
    id: int
    title: str
    passage_text: str
    passage_order: int
    audio_url: Optional[str] = None
    questions: list[QuestionResponse] = []


class SectionTimingResponse(BaseModel):
    section_type: str
    time_limit_seconds: int
    time_spent_seconds: int
    remaining_seconds: int
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None


class UserAnswerResponse(BaseModel):
    question_id: int
    answer_text: Optional[str] = None
    audio_url: Optional[str] = None
    transcript: Optional[str] = None
    is_marked_for_review: bool = False
    section: str


class SectionResponse(BaseModel):
    id: int
    section_type: str
    section_order: int
    time_limit_minutes: int
    title: str
    passages: list[PassageResponse] = []
    questions: list[QuestionResponse] = []


class MockTestDetailResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    duration_minutes: int
    difficulty: str
    sections: list[SectionResponse] = []
    attempt_id: Optional[int] = None
    current_section: Optional[str] = None
    remaining_time_seconds: Optional[int] = None
    user_answers: list[UserAnswerResponse] = []
    section_timings: list[SectionTimingResponse] = []
    status: Optional[str] = None


class StartTestResponse(BaseModel):
    attempt_id: int
    test_id: int
    status: str
    started_at: datetime
    remaining_time_seconds: int
    current_section: str


class SaveAnswerRequest(BaseModel):
    attempt_id: int
    question_id: int
    answer_text: Optional[str] = None
    audio_url: Optional[str] = None
    transcript: Optional[str] = None
    is_marked_for_review: bool = False
    section: str


class SaveAnswerResponse(BaseModel):
    success: bool
    updated_at: Optional[datetime] = None


class SubmitTestRequest(BaseModel):
    attempt_id: int
    writing_answers: Optional[list[dict]] = None
    speaking_recordings: Optional[list[dict]] = None


class ScoreSectionRequest(BaseModel):
    attempt_id: int
    section_type: str


class ScoreSectionQuestionResult(BaseModel):
    question_id: int
    question_text: str
    question_type: str
    user_answer: Optional[str] = None
    correct_answer: list[str] = []
    is_correct: bool
    is_skipped: bool
    marks: int


class ScoreSectionResponse(BaseModel):
    section_type: str
    correct_count: int
    total_count: int
    total_marks: int
    scored_marks: float
    results: list[ScoreSectionQuestionResult]


class AnalyzeSpeakingNLPRequest(BaseModel):
    transcript: str
    part_number: int = 1
    duration_seconds: float = 0


class AnalyzeSpeakingNLPResponse(BaseModel):
    part_number: int
    word_count: int
    duration_seconds: float
    estimated_band: Optional[float] = None
    nlp_grammar: Optional[dict] = None
    nlp_vocabulary: Optional[dict] = None
    nlp_coherence: Optional[dict] = None
    nlp_suggestions: Optional[list[str]] = None
    fluency_metrics: Optional[dict] = None


class AnalyzeWritingRequest(BaseModel):
    text: str
    task_number: int = 1


class AnalyzeWritingResponse(BaseModel):
    task_number: int
    word_count: int
    grammar_score: float
    vocabulary_score: float
    task_response_score: float
    coherence_score: float
    sentence_variety_score: float
    estimated_band: float
    feedback: Optional[str] = None
    strengths: Optional[list[str]] = None
    weaknesses: Optional[list[str]] = None
    recommendations: Optional[list[str]] = None
    punctuation_issues: Optional[list[str]] = None
    grammar_issues: Optional[list[str]] = None
    vocab_richness: Optional[float] = None
    complex_word_ratio: Optional[float] = None
    avg_sentence_length: Optional[float] = None
    sentence_count: Optional[int] = None
    paragraph_count: Optional[int] = None
    missing_commas: Optional[int] = None
    missing_fullstops: Optional[int] = None
    run_on_sentences: Optional[int] = None
    repeated_words: Optional[int] = None
    nlp_grammar: Optional[dict] = None
    nlp_vocabulary: Optional[dict] = None
    nlp_coherence: Optional[dict] = None
    nlp_task_achievement: Optional[dict] = None
    nlp_suggestions: Optional[list[str]] = None


class WritingAnalysisResponse(BaseModel):
    task_number: int
    word_count: int
    grammar_score: float
    vocabulary_score: float
    task_response_score: float
    coherence_score: float
    sentence_variety_score: float
    estimated_band: float
    feedback: Optional[str] = None
    strengths: Optional[list[str]] = None
    weaknesses: Optional[list[str]] = None
    recommendations: Optional[list[str]] = None
    punctuation_issues: Optional[list[str]] = None
    grammar_issues: Optional[list[str]] = None
    vocab_richness: Optional[float] = None
    complex_word_ratio: Optional[float] = None
    avg_sentence_length: Optional[float] = None
    sentence_count: Optional[int] = None
    paragraph_count: Optional[int] = None
    missing_commas: Optional[int] = None
    missing_fullstops: Optional[int] = None
    run_on_sentences: Optional[int] = None
    repeated_words: Optional[int] = None
    nlp_grammar: Optional[dict] = None
    nlp_vocabulary: Optional[dict] = None
    nlp_coherence: Optional[dict] = None
    nlp_task_achievement: Optional[dict] = None
    nlp_suggestions: Optional[list[str]] = None
    spelling_errors: Optional[int] = None
    complex_structures: Optional[int] = None
    relative_clauses: Optional[int] = None
    conditionals: Optional[int] = None
    passive_voice: Optional[int] = None
    topic_sentence_count: Optional[int] = None
    pronoun_references: Optional[int] = None
    has_introduction: Optional[bool] = None
    has_conclusion: Optional[bool] = None
    has_data_description: Optional[bool] = None
    has_position_statement: Optional[bool] = None
    has_examples: Optional[bool] = None
    low_reuse: Optional[bool] = None


class SpeakingAnalysisResponse(BaseModel):
    part_number: int
    duration_seconds: float
    grammar_score: float
    vocabulary_score: float
    fluency_score: float
    pronunciation_score: float
    coherence_score: float
    estimated_band: float
    feedback: Optional[str] = None
    strengths: Optional[list[str]] = None
    weaknesses: Optional[list[str]] = None
    recommendations: Optional[list[str]] = None


class QuestionReviewItem(BaseModel):
    question_id: int
    question_text: str
    question_type: str
    user_answer: Optional[str] = None
    correct_answer: list[str] = []
    is_correct: bool
    is_skipped: bool
    section: str
    marks: int


class SectionTimingDetail(BaseModel):
    section_type: str
    time_limit_seconds: int
    time_spent_seconds: int


class RecommendationItem(BaseModel):
    category: str
    message: str
    priority: str


class TestResultResponse(BaseModel):
    attempt_id: int
    test_title: str
    overall_band: float
    listening_band: float
    reading_band: float
    writing_band: float
    speaking_band: float
    listening_score: int
    listening_total: int
    reading_score: int
    reading_total: int
    status: str
    started_at: datetime
    ended_at: Optional[datetime] = None
    question_review: list[QuestionReviewItem] = []
    section_timings: list[SectionTimingDetail] = []
    writing_analyses: list[WritingAnalysisResponse] = []
    speaking_analyses: list[SpeakingAnalysisResponse] = []
    recommendations: list[RecommendationItem] = []
    performance_summary: dict = {}
