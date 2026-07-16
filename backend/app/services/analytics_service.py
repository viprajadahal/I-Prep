from sqlalchemy.orm import Session

from app.models.user import WritingResult, ReadingResult


class AnalyticsService:
    @staticmethod
    def get_writing_analytics(db: Session, user_id: int) -> dict:
        results = db.query(WritingResult).filter(WritingResult.user_id == user_id).all()

        if not results:
            return {
                "total_attempts": 0,
                "average_score": 0.0,
                "best_score": 0.0,
                "recent_scores": [],
                "performance_trend": "no_data",
                "average_grammar_score": 0.0,
                "average_vocabulary_score": 0.0,
                "average_coherence_score": 0.0,
                "score_distribution": {},
            }

        total = len(results)
        scores = [r.overall_score for r in results]
        avg_score = round(sum(scores) / total, 2)
        best_score = round(max(scores), 2)

        recent = sorted(results, key=lambda x: x.created_at, reverse=True)[:5]
        recent_scores = [round(r.overall_score, 2) for r in recent]

        if len(recent_scores) >= 3:
            recent_three = recent_scores[:3]
            if recent_three[0] > recent_three[1] and recent_three[1] > recent_three[2]:
                trend = "improving"
            elif recent_three[0] < recent_three[1] and recent_three[1] < recent_three[2]:
                trend = "declining"
            else:
                trend = "fluctuating"
        else:
            trend = "insufficient_data"

        avg_grammar = round(sum(r.grammar_score for r in results) / total, 2)
        avg_vocab = round(sum(r.vocabulary_score for r in results) / total, 2)
        avg_coherence = round(sum(r.coherence_score for r in results) / total, 2)

        brackets = {"0-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0}
        for score in scores:
            if score <= 20:
                brackets["0-20"] += 1
            elif score <= 40:
                brackets["21-40"] += 1
            elif score <= 60:
                brackets["41-60"] += 1
            elif score <= 80:
                brackets["61-80"] += 1
            else:
                brackets["81-100"] += 1

        return {
            "total_attempts": total,
            "average_score": avg_score,
            "best_score": best_score,
            "recent_scores": recent_scores,
            "performance_trend": trend,
            "average_grammar_score": avg_grammar,
            "average_vocabulary_score": avg_vocab,
            "average_coherence_score": avg_coherence,
            "score_distribution": brackets,
        }

    @staticmethod
    def get_reading_analytics(db: Session, user_id: int) -> dict:
        results = db.query(ReadingResult).filter(ReadingResult.user_id == user_id).all()

        if not results:
            return {
                "total_attempts": 0,
                "average_score": 0.0,
                "best_score": 0.0,
                "recent_scores": [],
                "performance_trend": "no_data",
                "average_accuracy": 0.0,
                "category_breakdown": {},
            }

        total = len(results)
        scores = [r.score for r in results]
        avg_score = round(sum(scores) / total, 2)
        best_score = round(max(scores), 2)

        recent = sorted(results, key=lambda x: x.created_at, reverse=True)[:5]
        recent_scores = [round(r.score, 2) for r in recent]

        if len(recent_scores) >= 3:
            recent_three = recent_scores[:3]
            if recent_three[0] > recent_three[1] and recent_three[1] > recent_three[2]:
                trend = "improving"
            elif recent_three[0] < recent_three[1] and recent_three[1] < recent_three[2]:
                trend = "declining"
            else:
                trend = "fluctuating"
        else:
            trend = "insufficient_data"

        avg_accuracy = round(sum(r.correct_answers / r.total_questions for r in results) / total * 100, 2)

        categories = {}
        for r in results:
            passage = r.passage if hasattr(r, "passage") else None
            cat = passage.category if passage and passage.category else "general"
            if cat not in categories:
                categories[cat] = {"attempts": 0, "avg_score": 0.0}
            categories[cat]["attempts"] += 1
            categories[cat]["avg_score"] += r.score

        for cat in categories:
            categories[cat]["avg_score"] = round(categories[cat]["avg_score"] / categories[cat]["attempts"], 2)

        return {
            "total_attempts": total,
            "average_score": avg_score,
            "best_score": best_score,
            "recent_scores": recent_scores,
            "performance_trend": trend,
            "average_accuracy": avg_accuracy,
            "category_breakdown": categories,
        }