import json
import random

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import Essay, WritingPrompt, WritingResult
from app.nlp.grammar import GrammarChecker
from app.nlp.vocabulary import VocabularyAnalyzer
from app.nlp.coherence import CoherenceAnalyzer
from app.nlp.task_achievement import TaskAchievementAnalyzer

from app.schemas.writing import EssaySubmit, WritingEvaluateRequest
from app.utils.helpers import count_words, serialize_to_json


class WritingService:
    MIN_WORDS = {"Task 1": 150, "Task 2": 250}

    @staticmethod
    async def submit_essay(db: AsyncSession, user_id: int, essay_data: EssaySubmit) -> Essay:
        word_count = count_words(essay_data.text)

        prompt = None
        if essay_data.prompt_id:
            prompt_result = await db.execute(
                select(WritingPrompt).filter(WritingPrompt.id == essay_data.prompt_id)
            )
            prompt = prompt_result.scalar_one_or_none()

        task_type = prompt.task_type if prompt else "Task 2"

        essay = Essay(
            user_id=user_id,
            prompt_id=essay_data.prompt_id,
            title=essay_data.title,
            text=essay_data.text,
            word_count=word_count,
        )
        db.add(essay)
        await db.commit()
        await db.refresh(essay)
        return essay

    @staticmethod
    async def evaluate_essay(db: AsyncSession, user_id: int, request: WritingEvaluateRequest) -> dict:
        result = await db.execute(
            select(Essay).filter(
                Essay.id == request.essay_id,
                Essay.user_id == user_id,
            )
        )
        essay = result.scalar_one_or_none()

        if not essay:
            raise ValueError("Essay not found or not owned by user")

        grammar_result = GrammarChecker.check_grammar(essay.text)
        grammar_combined = grammar_result["score"] * 0.3 + grammar_result.get("grammar_range_score", 50) * 0.7

        vocab_result = VocabularyAnalyzer.analyze(essay.text)

        coherence_result = CoherenceAnalyzer.analyze(essay.text)

        prompt_text = ""
        task_type = "Task 2"
        if essay.prompt_id:
            prompt_result = await db.execute(
                select(WritingPrompt).filter(WritingPrompt.id == essay.prompt_id)
            )
            prompt = prompt_result.scalar_one_or_none()
            if prompt:
                prompt_text = prompt.prompt_text
                task_type = prompt.task_type

        task_result = TaskAchievementAnalyzer.analyze(essay.text, prompt_text, task_type)

        is_gibberish = vocab_result.get("is_gibberish", False)
        if is_gibberish:
            penalty = 0.15
            grammar_combined *= penalty
            coherence_result["score"] *= penalty
            task_result["score"] *= penalty

        overall_score = round(
            grammar_combined * 0.25
            + vocab_result["score"] * 0.25
            + coherence_result["score"] * 0.25
            + task_result["score"] * 0.25,
            2,
        )

        grammar_band = round(max(grammar_combined, 0) / 10 * 2) / 2
        vocab_band = round(max(vocab_result["score"], 0) / 10 * 2) / 2
        coherence_band = round(max(coherence_result["score"], 0) / 10 * 2) / 2
        task_band = round(max(task_result["score"], 0) / 10 * 2) / 2

        feedback_parts = []

        if grammar_band >= 8.0:
            feedback_parts.append("Grammatical Range & Accuracy — Band " + str(grammar_band) + ": Excellent command. Wide range of structures with minimal errors.")
        elif grammar_band >= 7.0:
            feedback_parts.append("Grammatical Range & Accuracy — Band " + str(grammar_band) + ": Good control. Uses a variety of complex structures with some errors.")
        elif grammar_band >= 6.0:
            feedback_parts.append("Grammatical Range & Accuracy — Band " + str(grammar_band) + ": Adequate range but errors occur when attempting complex sentences.")
        elif grammar_band >= 5.0:
            feedback_parts.append("Grammatical Range & Accuracy — Band " + str(grammar_band) + ": Limited range. Frequent errors may cause some difficulty for the reader.")
        else:
            feedback_parts.append("Grammatical Range & Accuracy — Band " + str(grammar_band) + ": Frequent basic errors. Focus on fundamental grammar and sentence structure.")

        if vocab_band >= 8.0:
            feedback_parts.append("Lexical Resource — Band " + str(vocab_band) + ": Wide and sophisticated vocabulary. Skillfully uses uncommon words.")
        elif vocab_band >= 7.0:
            feedback_parts.append("Lexical Resource — Band " + str(vocab_band) + ": Good range. Uses some less common vocabulary with awareness of style and collocation.")
        elif vocab_band >= 6.0:
            feedback_parts.append("Lexical Resource — Band " + str(vocab_band) + ": Adequate range for the task. Attempts to use less common vocabulary but with some inaccuracy.")
        elif vocab_band >= 5.0:
            feedback_parts.append("Lexical Resource — Band " + str(vocab_band) + ": Limited range. Repetition and basic vocabulary dominate.")
        else:
            feedback_parts.append("Lexical Resource — Band " + str(vocab_band) + ": Very limited vocabulary. Frequent repetition and basic word choices.")

        if coherence_band >= 8.0:
            feedback_parts.append("Coherence & Cohesion — Band " + str(coherence_band) + ": Logical organization with skilled use of cohesive devices.")
        elif coherence_band >= 7.0:
            feedback_parts.append("Coherence & Cohesion — Band " + str(coherence_band) + ": Clear progression throughout. Uses a range of cohesive devices appropriately.")
        elif coherence_band >= 6.0:
            feedback_parts.append("Coherence & Cohesion — Band " + str(coherence_band) + ": Information and ideas are generally arranged coherently with adequate use of cohesive devices.")
        elif coherence_band >= 5.0:
            feedback_parts.append("Coherence & Cohesion — Band " + str(coherence_band) + ": Some organization but lacks overall progression. Limited use of cohesive devices.")
        else:
            feedback_parts.append("Coherence & Cohesion — Band " + str(coherence_band) + ": Poorly organized. Lacks clear progression and cohesive devices.")

        if task_band >= 8.0:
            feedback_parts.append("Task Response — Band " + str(task_band) + ": Fully addresses all parts of the task. Well-developed ideas with relevant examples.")
        elif task_band >= 7.0:
            feedback_parts.append("Task Response — Band " + str(task_band) + ": Addresses all parts. Main ideas are extended and supported.")
        elif task_band >= 6.0:
            feedback_parts.append("Task Response — Band " + str(task_band) + ": Addresses the task but some parts may be more fully covered than others.")
        elif task_band >= 5.0:
            feedback_parts.append("Task Response — Band " + str(task_band) + ": Addresses the task only partially. Ideas may be limited or not well developed.")
        else:
            feedback_parts.append("Task Response — Band " + str(task_band) + ": Does not adequately address the task. Main ideas are unclear or irrelevant.")

        if not task_result["meets_word_count"]:
            feedback_parts.append(
                f"Word Count: Your essay has {task_result['word_count']} words. "
                f"Minimum required is {task_result['min_words']} words."
            )

        feedback = "\n\n".join(feedback_parts)

        writing_result = WritingResult(
            essay_id=essay.id,
            user_id=user_id,
            grammar_score=grammar_result["score"],
            vocabulary_score=vocab_result["score"],
            coherence_score=coherence_result["score"],
            task_achievement_score=task_result["score"],
            overall_score=overall_score,
            feedback=feedback,
            grammar_errors=serialize_to_json(grammar_result["errors"]),
            vocabulary_details=serialize_to_json(vocab_result),
            coherence_details=serialize_to_json(coherence_result),
        )

        existing_result = await db.execute(
            select(WritingResult).filter(WritingResult.essay_id == essay.id)
        )
        existing = existing_result.scalar_one_or_none()

        if existing:
            existing.grammar_score = grammar_result["score"]
            existing.vocabulary_score = vocab_result["score"]
            existing.coherence_score = coherence_result["score"]
            existing.task_achievement_score = task_result["score"]
            existing.overall_score = overall_score
            existing.feedback = feedback
            existing.grammar_errors = serialize_to_json(grammar_result["errors"])
            existing.vocabulary_details = serialize_to_json(vocab_result)
            existing.coherence_details = serialize_to_json(coherence_result)
            await db.commit()
            await db.refresh(existing)
            result_id = existing.id
        else:
            db.add(writing_result)
            await db.commit()
            await db.refresh(writing_result)
            result_id = writing_result.id

        return {
            "essay_id": essay.id,
            "grammar_score": grammar_result["score"],
            "vocabulary_score": vocab_result["score"],
            "coherence_score": coherence_result["score"],
            "task_achievement_score": task_result["score"],
            "overall_score": overall_score,
            "feedback": feedback,
            "grammar_errors": grammar_result["errors"],
            "vocabulary_details": vocab_result,
            "coherence_details": coherence_result,
        }

    @staticmethod
    async def get_user_essays(db: AsyncSession, user_id: int, limit: int = 50, offset: int = 0) -> list:
        result = await db.execute(
            select(Essay).filter(Essay.user_id == user_id)
            .order_by(Essay.created_at.desc())
            .limit(limit).offset(offset)
        )
        return list(result.scalars().all())

    @staticmethod
    async def get_essay_by_id(db: AsyncSession, essay_id: int, user_id: int) -> Essay | None:
        result = await db.execute(
            select(Essay).filter(
                Essay.id == essay_id,
                Essay.user_id == user_id,
            )
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_writing_history(db: AsyncSession, user_id: int, limit: int = 50, offset: int = 0) -> list:
        result = await db.execute(
            select(WritingResult)
            .filter(WritingResult.user_id == user_id)
            .order_by(WritingResult.created_at.asc())
            .limit(limit).offset(offset)
        )
        results = list(result.scalars().all())

        return [
            {
                "date": r.created_at,
                "score": r.overall_score,
            }
            for r in results
        ]

    @staticmethod
    async def get_prompts(db: AsyncSession, module: str = None, task_type: str = None, subtype: str = None) -> list:
        query = select(WritingPrompt)
        if module:
            query = query.filter(WritingPrompt.module == module)
        if task_type:
            query = query.filter(WritingPrompt.task_type == task_type)
        if subtype:
            query = query.filter(WritingPrompt.subtype == subtype)
        query = query.order_by(WritingPrompt.difficulty, WritingPrompt.id)
        result = await db.execute(query)
        return list(result.scalars().all())

    @staticmethod
    async def get_prompts_by_task_type(db: AsyncSession, task_type: str) -> list:
        result = await db.execute(
            select(WritingPrompt)
            .filter(WritingPrompt.task_type == task_type)
            .order_by(WritingPrompt.difficulty, WritingPrompt.id)
        )
        return list(result.scalars().all())

    @staticmethod
    async def get_random_prompt(db: AsyncSession, task_type: str, user_id: int) -> WritingPrompt | None:
        result = await db.execute(
            select(WritingResult).filter(WritingResult.user_id == user_id)
        )
        results = list(result.scalars().all())
        average_score = sum(r.overall_score for r in results) / len(results) if results else 0

        if average_score < 50:
            difficulty = "beginner"
        elif average_score <= 70:
            difficulty = "intermediate"
        else:
            difficulty = "advanced"

        result = await db.execute(
            select(WritingPrompt).filter(
                WritingPrompt.task_type == task_type,
                WritingPrompt.difficulty == difficulty,
            )
        )
        prompts = list(result.scalars().all())

        if not prompts:
            result = await db.execute(
                select(WritingPrompt).filter(WritingPrompt.task_type == task_type)
            )
            prompts = list(result.scalars().all())

        return random.choice(prompts) if prompts else None

    @staticmethod
    async def get_prompt_by_id(db: AsyncSession, prompt_id: int) -> WritingPrompt | None:
        result = await db.execute(
            select(WritingPrompt).filter(WritingPrompt.id == prompt_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_scores(db: AsyncSession, user_id: int) -> list:
        result = await db.execute(
            select(WritingResult)
            .filter(WritingResult.user_id == user_id)
            .order_by(WritingResult.created_at.desc())
        )
        results = list(result.scalars().all())

        essay_ids = [r.essay_id for r in results]
        if essay_ids:
            essay_result = await db.execute(
                select(Essay).filter(Essay.id.in_(essay_ids))
            )
            essays = {e.id: e for e in essay_result.scalars().all()}
        else:
            essays = {}

        return [
            {
                "id": r.id,
                "essay_id": r.essay_id,
                "title": essays[r.essay_id].title if r.essay_id in essays else None,
                "overall_score": r.overall_score,
                "grammar_score": r.grammar_score,
                "vocabulary_score": r.vocabulary_score,
                "coherence_score": r.coherence_score,
                "task_achievement_score": r.task_achievement_score,
                "feedback": r.feedback,
                "date": r.created_at,
            }
            for r in results
        ]

    @staticmethod
    async def get_progress(db: AsyncSession, user_id: int) -> dict:
        result = await db.execute(
            select(WritingResult).filter(WritingResult.user_id == user_id)
        )
        results = list(result.scalars().all())

        essay_result = await db.execute(
            select(Essay).filter(Essay.user_id == user_id)
        )
        essays = list(essay_result.scalars().all())

        total_essays = len(essays)
        evaluated = len(results)

        if not results:
            return {
                "completed": 0,
                "total": 0,
                "avgScore": 0.0,
                "task1Completed": 0,
                "task2Completed": 0,
                "recentScores": [],
                "performanceTrend": "no_data",
            }

        scores = [r.overall_score for r in results]
        avg_score = round(sum(scores) / len(scores), 2)

        recent = sorted(results, key=lambda x: x.created_at, reverse=True)[:5]
        recent_scores = [round(r.overall_score, 2) for r in recent]

        if len(recent_scores) >= 3:
            if recent_scores[0] > recent_scores[1] and recent_scores[1] > recent_scores[2]:
                trend = "improving"
            elif recent_scores[0] < recent_scores[1] and recent_scores[1] < recent_scores[2]:
                trend = "declining"
            else:
                trend = "fluctuating"
        else:
            trend = "insufficient_data"

        prompt_result = await db.execute(select(WritingPrompt))
        all_prompts = list(prompt_result.scalars().all())
        total_prompts = len(all_prompts)

        return {
            "completed": evaluated,
            "total": total_prompts if total_prompts > 0 else evaluated,
            "avgScore": avg_score,
            "task1Completed": evaluated,
            "task2Completed": 0,
            "recentScores": recent_scores,
            "performanceTrend": trend,
        }
