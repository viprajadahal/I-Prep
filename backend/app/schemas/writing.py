from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, Field, constr


class EssaySubmit(BaseModel):
    title: Optional[str] = None
    text: constr(min_length=10) = Field(..., description="Essay text content")


class EssayResponse(BaseModel):
    id: int
    user_id: int
    title: Optional[str]
    text: str
    word_count: int
    created_at: datetime

    class Config:
        from_attributes = True


class WritingEvaluateRequest(BaseModel):
    essay_id: int = Field(..., description="ID of the essay to evaluate")


class GrammarError(BaseModel):
    message: str
    rule: str
    suggestion: str
    offset: int
    length: int


class VocabularyDetails(BaseModel):
    word_count: int
    unique_word_count: int
    type_token_ratio: float
    average_sentence_length: float
    sentence_count: int
    advanced_vocab_count: int
    advanced_vocab_percentage: float
    repeated_words: list


class CoherenceDetails(BaseModel):
    transition_score: float
    paragraph_structure_score: float
    logical_flow_score: float


class WritingResultResponse(BaseModel):
    id: int
    essay_id: int
    user_id: int
    grammar_score: float
    vocabulary_score: float
    coherence_score: float
    overall_score: float
    feedback: Optional[str]
    grammar_errors: Optional[str]
    vocabulary_details: Optional[str]
    coherence_details: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class WritingHistoryItem(BaseModel):
    date: datetime
    score: float


class WritingEvaluationResponse(BaseModel):
    essay_id: int
    grammar_score: float
    vocabulary_score: float
    coherence_score: float
    overall_score: float
    feedback: str
    grammar_errors: List[GrammarError]
    vocabulary_details: VocabularyDetails
    coherence_details: CoherenceDetails


class WritingPromptResponse(BaseModel):
    id: int
    module: str = "academic"
    task_type: str
    subtype: Optional[str] = None
    difficulty: str
    title: str
    prompt_text: str
    image_url: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TaskSubmitRequest(BaseModel):
    title: Optional[str] = None
    text: constr(min_length=10) = Field(..., description="Essay text content")


class TaskResponse(BaseModel):
    id: int
    title: str
    description: str
    duration: str = "40 min"
    difficulty: str
    type: str
    score: float = 0.0
    completed: bool = False

    class Config:
        from_attributes = True


class ScoreItem(BaseModel):
    id: int
    essay_id: int
    title: Optional[str] = None
    overall_score: float
    grammar_score: float
    vocabulary_score: float
    coherence_score: float
    feedback: Optional[str] = None
    date: datetime

    class Config:
        from_attributes = True


class ProgressResponse(BaseModel):
    completed: int = 0
    total: int = 0
    avgScore: float = 0.0
    task1Completed: int = 0
    task2Completed: int = 0
    recentScores: list[float] = []
    performanceTrend: str = "no_data"


class DifficultWord(BaseModel):
    word: str
    meaning: str


class WritingAssistantResponse(BaseModel):
    simplified_question: str
    difficult_words: list[DifficultWord]
    examiner_expectations: list[str]
    common_mistakes: list[str]
    tips: list[str]
    minimum_words: int
    recommended_time: int
