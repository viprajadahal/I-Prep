from datetime import datetime
from typing import Optional, List, Dict

from pydantic import BaseModel


class WritingAnalytics(BaseModel):
    total_attempts: int
    average_score: float
    best_score: float
    recent_scores: List[float]
    performance_trend: str
    average_grammar_score:  float
    average_vocabulary_score: float
    average_coherence_score: float
    score_distribution: Dict


class ReadingAnalytics(BaseModel):
    total_attempts: int
    average_score: float
    best_score: float
    recent_scores: List[float]
    performance_trend: str
    average_accuracy: float
    category_breakdown: Dict