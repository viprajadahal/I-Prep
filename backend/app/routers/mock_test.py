import logging
import os
import hashlib
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy import select, and_, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.mock_test import (
    MockTest, MockSection, MockPassage, MockQuestion,
    TestAttempt, UserAnswer, SectionTiming, TestResult,
    WritingAnalysis, SpeakingAnalysis,
)
from app.models.user import User
from app.routers.auth import get_current_user
from app.schemas.mock_test import (
    MockTestListResponse, MockTestDetailResponse, StartTestResponse,
    SaveAnswerRequest, SaveAnswerResponse, SubmitTestRequest,
    TestResultResponse, QuestionReviewItem, SectionTimingDetail,
    WritingAnalysisResponse, SpeakingAnalysisResponse, RecommendationItem,
    AttemptSummary, AnalyzeWritingRequest, AnalyzeWritingResponse,
    ScoreSectionRequest, ScoreSectionResponse, ScoreSectionQuestionResult,
    AnalyzeSpeakingNLPRequest, AnalyzeSpeakingNLPResponse,
    ProgressResponse, ProgressAttemptItem, ProgressSectionScore,
)
from app.services.scoring import (
    score_listening_section, score_reading_section,
    calculate_listening_band, calculate_reading_band,
    calculate_overall_band, analyze_writing, analyze_speaking,
    generate_recommendations, calculate_performance_summary,
    is_answer_correct,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/mock-tests", tags=["mock-tests"])

SECTION_ORDER = ["listening", "reading", "writing", "speaking"]
SECTION_TIME_LIMITS = {
    "listening": 1800,
    "reading": 3600,
    "writing": 3600,
    "speaking": 900,
}

AUDIO_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "static", "audio")


@router.get("/audio/{passage_id}")
async def get_passage_audio(
    passage_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(MockPassage).where(MockPassage.id == passage_id))
    passage = result.scalar_one_or_none()
    if not passage:
        raise HTTPException(status_code=404, detail="Passage not found")

    if passage.audio_url and os.path.exists(os.path.join(AUDIO_DIR, passage.audio_url)):
        return FileResponse(
            os.path.join(AUDIO_DIR, passage.audio_url),
            media_type="audio/mpeg",
            filename=f"passage_{passage_id}.mp3",
        )

    text = passage.passage_text
    if not text:
        raise HTTPException(status_code=400, detail="No text to generate audio from")

    os.makedirs(AUDIO_DIR, exist_ok=True)
    filename = f"passage_{passage_id}.mp3"
    filepath = os.path.join(AUDIO_DIR, filename)

    try:
        from gtts import gTTS
        tts = gTTS(text=text, lang='en', tld='co.uk')
        tts.save(filepath)
    except Exception as e:
        logger.error(f"TTS generation failed for passage {passage_id}: {e}")
        raise HTTPException(status_code=500, detail="Audio generation failed")

    passage.audio_url = filename
    db.add(passage)
    await db.commit()

    return FileResponse(filepath, media_type="audio/mpeg", filename=filename)


@router.get("", response_model=list[MockTestListResponse])
async def list_mock_tests(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(MockTest).where(MockTest.is_active == True).order_by(MockTest.id)
    )
    tests = result.scalars().all()

    response = []
    for test in tests:
        all_completed_result = await db.execute(
            select(TestAttempt).where(
                and_(
                    TestAttempt.user_id == current_user.id,
                    TestAttempt.test_id == test.id,
                    TestAttempt.status == "completed",
                )
            ).order_by(TestAttempt.ended_at)
        )
        completed_attempts = all_completed_result.scalars().all()

        in_progress_result = await db.execute(
            select(TestAttempt).where(
                and_(
                    TestAttempt.user_id == current_user.id,
                    TestAttempt.test_id == test.id,
                    TestAttempt.status == "in_progress",
                )
            )
        )
        in_progress_attempt = in_progress_result.scalars().first()

        section_count_result = await db.execute(
            select(MockSection).where(MockSection.test_id == test.id)
        )
        section_count = len(section_count_result.scalars().all())

        attempt_summaries = []
        best_score = None
        for attempt in completed_attempts:
            res_result = await db.execute(
                select(TestResult).where(TestResult.attempt_id == attempt.id)
            )
            res = res_result.scalar_one_or_none()
            band = res.overall_band if res else None
            attempt_summaries.append(AttemptSummary(
                attempt_id=attempt.id,
                overall_band=band,
                completed_at=attempt.ended_at,
            ))
            if band is not None and (best_score is None or band > best_score):
                best_score = band

        latest_completed = completed_attempts[-1] if completed_attempts else None
        score = None
        attempt_id = None
        if latest_completed:
            attempt_id = latest_completed.id
            res_result = await db.execute(
                select(TestResult).where(TestResult.attempt_id == latest_completed.id)
            )
            res = res_result.scalar_one_or_none()
            if res:
                score = res.overall_band
        elif in_progress_attempt:
            attempt_id = in_progress_attempt.id

        response.append(MockTestListResponse(
            id=test.id,
            title=test.title,
            description=test.description,
            duration_minutes=test.duration_minutes,
            difficulty=test.difficulty,
            sections=section_count,
            completed=len(completed_attempts) > 0,
            score=score,
            best_score=best_score,
            attempt_id=attempt_id,
            total_attempts=len(completed_attempts),
            attempts=attempt_summaries,
        ))

    return response


@router.get("/progress", response_model=ProgressResponse)
async def get_user_progress(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(TestAttempt)
        .where(and_(TestAttempt.user_id == current_user.id, TestAttempt.status == "completed"))
        .options(
            selectinload(TestAttempt.test),
            selectinload(TestAttempt.result),
        )
        .order_by(TestAttempt.ended_at)
    )
    attempts = result.scalars().all()

    total = len(attempts)
    best_band = None
    total_band = 0.0
    band_count = 0
    items = []

    for att in attempts:
        if not att.result:
            continue
        band = att.result.overall_band
        total_band += band
        band_count += 1
        if best_band is None or band > best_band:
            best_band = band

        sections = []
        section_meta = [
            ("listening", att.result.listening_band, float(att.result.listening_score), att.result.listening_total, "Listening"),
            ("reading", att.result.reading_band, float(att.result.reading_score), att.result.reading_total, "Reading"),
            ("writing", att.result.writing_band, att.result.writing_score, 0, "Writing"),
            ("speaking", att.result.speaking_band, att.result.speaking_score, 0, "Speaking"),
        ]
        for st, sb, ss, stot, label in section_meta:
            sections.append(ProgressSectionScore(
                section_type=st, band=sb, score=ss, total=stot, label=label,
            ))

        items.append(ProgressAttemptItem(
            attempt_id=att.id,
            test_id=att.test_id,
            test_title=att.test.title,
            overall_band=band,
            sections=sections,
            completed_at=att.ended_at,
        ))

    avg_band = round(total_band / band_count, 1) if band_count > 0 else None

    return ProgressResponse(
        total_attempts=total,
        best_overall_band=best_band,
        average_overall_band=avg_band,
        attempts=items,
    )


@router.post("/start/{test_id}", response_model=StartTestResponse)
async def start_mock_test(
    test_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    test_result = await db.execute(
        select(MockTest).where(and_(MockTest.id == test_id, MockTest.is_active == True))
    )
    test = test_result.scalar_one_or_none()
    if not test:
        raise HTTPException(status_code=404, detail="Mock test not found")

    in_progress_result = await db.execute(
        select(TestAttempt).where(
            and_(
                TestAttempt.user_id == current_user.id,
                TestAttempt.test_id == test_id,
                TestAttempt.status == "in_progress",
            )
        )
    )
    in_progress = in_progress_result.scalar_one_or_none()
    if in_progress:
        clear_result = await db.execute(
            delete(UserAnswer).where(UserAnswer.attempt_id == in_progress.id)
        )
        in_progress.status = "in_progress"
        in_progress.current_section = "listening"
        total_seconds = test.duration_minutes * 60
        in_progress.remaining_time_seconds = total_seconds
        in_progress.started_at = datetime.utcnow()
        await db.commit()
        return StartTestResponse(
            attempt_id=in_progress.id,
            test_id=in_progress.test_id,
            status=in_progress.status,
            started_at=in_progress.started_at,
            remaining_time_seconds=in_progress.remaining_time_seconds,
            current_section=in_progress.current_section,
        )

    total_seconds = test.duration_minutes * 60

    attempt = TestAttempt(
        user_id=current_user.id,
        test_id=test_id,
        status="in_progress",
        remaining_time_seconds=total_seconds,
        current_section="listening",
    )
    db.add(attempt)
    await db.flush()

    sections_result = await db.execute(
        select(MockSection).where(MockSection.test_id == test_id)
    )
    sections = sections_result.scalars().all()

    for section in sections:
        limit = section.time_limit_minutes * 60
        timing = SectionTiming(
            attempt_id=attempt.id,
            section_type=section.section_type,
            time_limit_seconds=limit,
            time_spent_seconds=0,
            remaining_seconds=limit,
        )
        db.add(timing)

    await db.commit()
    await db.refresh(attempt)

    logger.info(f"Started mock test attempt {attempt.id} for user {current_user.id}")

    return StartTestResponse(
        attempt_id=attempt.id,
        test_id=attempt.test_id,
        status=attempt.status,
        started_at=attempt.started_at,
        remaining_time_seconds=attempt.remaining_time_seconds,
        current_section=attempt.current_section,
    )


@router.get("/{attempt_id}", response_model=MockTestDetailResponse)
async def get_mock_test_attempt(
    attempt_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    attempt_result = await db.execute(
        select(TestAttempt)
        .where(TestAttempt.id == attempt_id)
        .options(
            selectinload(TestAttempt.test).selectinload(MockTest.sections)
            .selectinload(MockSection.passages)
            .selectinload(MockPassage.questions),
            selectinload(TestAttempt.test).selectinload(MockTest.sections)
            .selectinload(MockSection.questions),
            selectinload(TestAttempt.answers),
            selectinload(TestAttempt.timings),
        )
    )
    attempt = attempt_result.scalar_one_or_none()

    if not attempt:
        raise HTTPException(status_code=404, detail="Test attempt not found")

    if attempt.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    test = attempt.test

    sections_data = []
    for section in sorted(test.sections, key=lambda s: s.section_order):
        passages_data = []
        for passage in sorted(section.passages, key=lambda p: p.passage_order):
            passage_questions = [
                {
                    "id": q.id,
                    "question_type": q.question_type,
                    "question_text": q.question_text,
                    "options": q.options,
                    "question_order": q.question_order,
                    "marks": q.marks,
                    "passage_id": q.passage_id,
                    "prompt_text": q.prompt_text,
                    "cue_card": q.cue_card,
                    "time_limit_minutes": q.time_limit_minutes,
                }
                for q in sorted(passage.questions, key=lambda q: q.question_order)
            ]
            passages_data.append({
                "id": passage.id,
                "title": passage.title,
                "passage_text": passage.passage_text,
                "passage_order": passage.passage_order,
                "audio_url": passage.audio_url,
                "questions": passage_questions,
            })

        standalone_questions = [
            {
                "id": q.id,
                "question_type": q.question_type,
                "question_text": q.question_text,
                "options": q.options,
                "question_order": q.question_order,
                "marks": q.marks,
                "passage_id": q.passage_id,
                "prompt_text": q.prompt_text,
                "cue_card": q.cue_card,
                "time_limit_minutes": q.time_limit_minutes,
            }
            for q in sorted(section.questions, key=lambda q: q.question_order)
            if q.passage_id is None
        ]

        sections_data.append({
            "id": section.id,
            "section_type": section.section_type,
            "section_order": section.section_order,
            "time_limit_minutes": section.time_limit_minutes,
            "title": section.title,
            "passages": passages_data,
            "questions": standalone_questions,
        })

    answers_data = [
        {
            "question_id": a.question_id,
            "answer_text": a.answer_text,
            "audio_url": a.audio_url,
            "transcript": a.transcript,
            "is_marked_for_review": a.is_marked_for_review,
            "section": a.section,
        }
        for a in attempt.answers
    ]

    timings_data = [
        {
            "section_type": t.section_type,
            "time_limit_seconds": t.time_limit_seconds,
            "time_spent_seconds": t.time_spent_seconds,
            "remaining_seconds": t.remaining_seconds,
            "started_at": t.started_at,
            "ended_at": t.ended_at,
        }
        for t in attempt.timings
    ]

    return MockTestDetailResponse(
        id=test.id,
        title=test.title,
        description=test.description,
        duration_minutes=test.duration_minutes,
        difficulty=test.difficulty,
        sections=sections_data,
        attempt_id=attempt.id,
        current_section=attempt.current_section,
        remaining_time_seconds=attempt.remaining_time_seconds,
        user_answers=answers_data,
        section_timings=timings_data,
        status=attempt.status,
    )


@router.post("/analyze-writing", response_model=AnalyzeWritingResponse)
async def analyze_writing_endpoint(
    data: AnalyzeWritingRequest,
    current_user: User = Depends(get_current_user),
):
    analysis = analyze_writing(data.text, data.task_number)

    nlp_grammar = None
    nlp_vocabulary = None
    nlp_coherence = None
    nlp_task_achievement = None
    nlp_suggestions = None
    try:
        from app.services.nlp_analysis import run_full_nlp_analysis
        nlp = run_full_nlp_analysis(data.text, data.task_number)
        nlp_grammar = nlp["grammar"]
        nlp_vocabulary = nlp["vocabulary"]
        nlp_coherence = nlp["coherence"]
        nlp_task_achievement = nlp["task_achievement"]
        nlp_suggestions = nlp["suggestions"]
    except Exception as e:
        logger.warning(f"NLP analysis failed, returning basic analysis only: {e}")

    return AnalyzeWritingResponse(
        task_number=data.task_number,
        word_count=analysis["word_count"],
        grammar_score=analysis["grammar_score"],
        vocabulary_score=analysis["vocabulary_score"],
        task_response_score=analysis["task_response_score"],
        coherence_score=analysis["coherence_score"],
        sentence_variety_score=analysis["sentence_variety_score"],
        estimated_band=analysis["estimated_band"],
        feedback=analysis["feedback"],
        strengths=analysis["strengths"],
        weaknesses=analysis["weaknesses"],
        recommendations=analysis["recommendations"],
        punctuation_issues=analysis["punctuation_issues"],
        grammar_issues=analysis["grammar_issues"],
        vocab_richness=analysis["vocab_richness"],
        complex_word_ratio=analysis["complex_word_ratio"],
        avg_sentence_length=analysis["avg_sentence_length"],
        sentence_count=analysis["sentence_count"],
        paragraph_count=analysis["paragraph_count"],
        missing_commas=analysis["missing_commas"],
        missing_fullstops=analysis["missing_fullstops"],
        run_on_sentences=analysis["run_on_sentences"],
        repeated_words=analysis["repeated_words"],
        nlp_grammar=nlp_grammar,
        nlp_vocabulary=nlp_vocabulary,
        nlp_coherence=nlp_coherence,
        nlp_task_achievement=nlp_task_achievement,
        nlp_suggestions=nlp_suggestions,
    )


@router.post("/analyze-speaking", response_model=AnalyzeSpeakingNLPResponse)
async def analyze_speaking_endpoint(
    data: AnalyzeSpeakingNLPRequest,
    current_user: User = Depends(get_current_user),
):
    word_count = len(data.transcript.strip().split()) if data.transcript.strip() else 0
    words_per_minute = (word_count / (data.duration_seconds / 60)) if data.duration_seconds > 0 else 0

    fluency_metrics = {
        "words_per_minute": round(words_per_minute, 1),
        "filler_words": _count_filler_words(data.transcript),
        "avg_words_per_sentence": 0,
        "sentence_count": 0,
    }

    sentences = [s.strip() for s in data.transcript.replace('!', '.').replace('?', '.').split('.') if s.strip()]
    fluency_metrics["sentence_count"] = len(sentences)
    if sentences:
        total_w = sum(len(s.split()) for s in sentences)
        fluency_metrics["avg_words_per_sentence"] = round(total_w / len(sentences), 1)

    nlp_grammar = None
    nlp_vocabulary = None
    nlp_coherence = None
    nlp_suggestions = None
    try:
        from app.services.nlp_analysis import run_full_nlp_analysis
        nlp = run_full_nlp_analysis(data.transcript, 0)
        nlp_grammar = nlp["grammar"]
        nlp_vocabulary = nlp["vocabulary"]
        nlp_coherence = nlp["coherence"]
        nlp_suggestions = nlp.get("suggestions", [])
    except Exception as e:
        logger.warning(f"NLP analysis failed for speaking: {e}")

    estimated_band = _estimate_speaking_band(word_count, data.duration_seconds, nlp_grammar, fluency_metrics)

    return AnalyzeSpeakingNLPResponse(
        part_number=data.part_number,
        word_count=word_count,
        duration_seconds=data.duration_seconds,
        estimated_band=estimated_band,
        nlp_grammar=nlp_grammar,
        nlp_vocabulary=nlp_vocabulary,
        nlp_coherence=nlp_coherence,
        nlp_suggestions=nlp_suggestions,
        fluency_metrics=fluency_metrics,
    )


def _count_filler_words(text: str) -> list:
    fillers = ["um", "uh", "like", "you know", "so", "actually", "basically", "literally", "sort of", "kind of"]
    found = []
    words = text.lower().split()
    for f in fillers:
        if f in words:
            found.append(f)
    return found


def _estimate_speaking_band(word_count, duration, grammar_nlp, fluency_metrics):
    band = 5.0
    if duration > 0 and word_count > 0:
        wpm = word_count / (duration / 60)
        if wpm > 140:
            band += 0.5
        elif wpm < 80:
            band -= 0.5
    if grammar_nlp:
        error_count = grammar_nlp.get("error_count", 0)
        if error_count == 0:
            band += 0.5
        elif error_count > 5:
            band -= 0.5
    if fluency_metrics:
        if fluency_metrics.get("filler_words") and len(fluency_metrics["filler_words"]) > 3:
            band -= 0.5
    return min(max(band, 4.0), 9.0)


@router.post("/save-answer", response_model=SaveAnswerResponse)
async def save_answer(
    data: SaveAnswerRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    attempt_result = await db.execute(
        select(TestAttempt).where(TestAttempt.id == data.attempt_id)
    )
    attempt = attempt_result.scalar_one_or_none()

    if not attempt:
        raise HTTPException(status_code=404, detail="Test attempt not found")

    if attempt.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    if attempt.status != "in_progress":
        raise HTTPException(status_code=400, detail="Cannot save answers to a completed test")

    question_result = await db.execute(
        select(MockQuestion).where(MockQuestion.id == data.question_id)
    )
    question = question_result.scalar_one_or_none()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    answer_result = await db.execute(
        select(UserAnswer).where(
            and_(
                UserAnswer.attempt_id == data.attempt_id,
                UserAnswer.question_id == data.question_id,
            )
        )
    )
    existing_answer = answer_result.scalar_one_or_none()

    now = datetime.utcnow()

    if existing_answer:
        existing_answer.answer_text = data.answer_text
        existing_answer.audio_url = data.audio_url
        existing_answer.transcript = data.transcript
        existing_answer.is_marked_for_review = data.is_marked_for_review
        existing_answer.section = data.section
        existing_answer.updated_at = now
    else:
        answer = UserAnswer(
            attempt_id=data.attempt_id,
            question_id=data.question_id,
            answer_text=data.answer_text,
            audio_url=data.audio_url,
            transcript=data.transcript,
            is_marked_for_review=data.is_marked_for_review,
            section=data.section,
        )
        db.add(answer)

    await db.commit()

    return SaveAnswerResponse(success=True, updated_at=now)


@router.post("/score-section", response_model=ScoreSectionResponse)
async def score_section(
    data: ScoreSectionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    attempt_result = await db.execute(
        select(TestAttempt)
        .where(TestAttempt.id == data.attempt_id)
        .options(
            selectinload(TestAttempt.test).selectinload(MockTest.sections)
            .selectinload(MockSection.passages)
            .selectinload(MockPassage.questions),
            selectinload(TestAttempt.test).selectinload(MockTest.sections)
            .selectinload(MockSection.questions),
            selectinload(TestAttempt.answers),
        )
    )
    attempt = attempt_result.scalar_one_or_none()

    if not attempt:
        raise HTTPException(status_code=404, detail="Test attempt not found")

    if attempt.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    section = None
    for s in attempt.test.sections:
        if s.section_type == data.section_type:
            section = s
            break

    if not section:
        raise HTTPException(status_code=404, detail=f"Section '{data.section_type}' not found")

    all_questions = []
    for passage in section.passages:
        for q in passage.questions:
            all_questions.append(q)
    for q in section.questions:
        if q.passage_id is None:
            all_questions.append(q)
    questions = sorted(all_questions, key=lambda q: q.question_order)

    answer_map = {}
    for ans in attempt.answers:
        answer_map[ans.question_id] = ans

    results = []
    correct_count = 0
    total_marks = 0
    scored_marks = 0.0

    for q in questions:
        user_answer_obj = answer_map.get(q.id)
        user_answer = user_answer_obj.answer_text if user_answer_obj else ""
        correct_list = q.correct_answer if isinstance(q.correct_answer, list) else [q.correct_answer]
        accepted = q.acceptable_answers if hasattr(q, 'acceptable_answers') and q.acceptable_answers else None
        is_correct = is_answer_correct(user_answer or "", correct_list, q.question_type, accepted)

        if is_correct:
            correct_count += 1
            scored_marks += q.marks
        total_marks += q.marks

        results.append(ScoreSectionQuestionResult(
            question_id=q.id,
            question_text=q.question_text,
            question_type=q.question_type,
            user_answer=user_answer or "",
            correct_answer=correct_list,
            is_correct=is_correct,
            is_skipped=not bool(user_answer and user_answer.strip()),
            marks=q.marks,
        ))

    return ScoreSectionResponse(
        section_type=data.section_type,
        correct_count=correct_count,
        total_count=len(questions),
        total_marks=total_marks,
        scored_marks=scored_marks,
        results=results,
    )


@router.post("/submit", response_model=TestResultResponse)
async def submit_mock_test(
    data: SubmitTestRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    attempt_result = await db.execute(
        select(TestAttempt)
        .where(TestAttempt.id == data.attempt_id)
        .options(
            selectinload(TestAttempt.test).selectinload(MockTest.sections)
            .selectinload(MockSection.questions),
            selectinload(TestAttempt.answers).selectinload(UserAnswer.question),
            selectinload(TestAttempt.timings),
        )
    )
    attempt = attempt_result.scalar_one_or_none()

    if not attempt:
        raise HTTPException(status_code=404, detail="Test attempt not found")

    if attempt.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    if attempt.status != "in_progress":
        raise HTTPException(status_code=400, detail="Test already submitted")

    answer_map = {}
    for ans in attempt.answers:
        answer_map[ans.question_id] = ans

    all_results = []

    listening_correct = 0
    listening_total = 0
    reading_correct = 0
    reading_total = 0

    for section in attempt.test.sections:
        questions = sorted(section.questions, key=lambda q: q.question_order)
        question_ids = {q.id for q in questions}
        section_answers = {
            ans.question_id: (ans.answer_text or "")
            for ans in attempt.answers
            if ans.question_id in question_ids
        }

        if section.section_type == "listening":
            c, t, results = score_listening_section(questions, section_answers)
            listening_correct = c
            listening_total = t
            all_results.extend(results)

        elif section.section_type == "reading":
            c, t, results = score_reading_section(questions, section_answers)
            reading_correct = c
            reading_total = t
            all_results.extend(results)

    if data.writing_answers:
        for task_data in data.writing_answers:
            task_num = task_data.get("task_number", 1)
            text = task_data.get("text", "")
            analysis = analyze_writing(text, task_num)
            writing_analysis = WritingAnalysis(
                attempt_id=attempt.id,
                task_number=task_num,
                user_answer=text,
                word_count=analysis["word_count"],
                grammar_score=analysis["grammar_score"],
                vocabulary_score=analysis["vocabulary_score"],
                task_response_score=analysis["task_response_score"],
                coherence_score=analysis["coherence_score"],
                sentence_variety_score=analysis["sentence_variety_score"],
                estimated_band=analysis["estimated_band"],
                feedback=analysis["feedback"],
                strengths=analysis["strengths"],
                weaknesses=analysis["weaknesses"],
                recommendations=analysis["recommendations"],
            )
            db.add(writing_analysis)
    else:
        for section in attempt.test.sections:
            if section.section_type == "writing":
                for q in section.questions:
                    if q.question_type == "writing_task":
                        existing_ans = answer_map.get(q.id)
                        text = existing_ans.answer_text if existing_ans else ""
                        task_num = q.prompt_text or "Task 1"
                        task_number = 1 if "task 1" in str(task_num).lower() else 2
                        analysis = analyze_writing(text or "", task_number)
                        writing_analysis = WritingAnalysis(
                            attempt_id=attempt.id,
                            task_number=task_number,
                            user_answer=text or "",
                            word_count=analysis["word_count"],
                            grammar_score=analysis["grammar_score"],
                            vocabulary_score=analysis["vocabulary_score"],
                            task_response_score=analysis["task_response_score"],
                            coherence_score=analysis["coherence_score"],
                            sentence_variety_score=analysis["sentence_variety_score"],
                            estimated_band=analysis["estimated_band"],
                            feedback=analysis["feedback"],
                            strengths=analysis["strengths"],
                            weaknesses=analysis["weaknesses"],
                            recommendations=analysis["recommendations"],
                        )
                        db.add(writing_analysis)

    if data.speaking_recordings:
        for rec_data in data.speaking_recordings:
            part_num = rec_data.get("part_number", 1)
            audio = rec_data.get("audio_url", "")
            transcript = rec_data.get("transcript", "")
            duration = rec_data.get("duration_seconds", 0)
            analysis = analyze_speaking(transcript, duration, part_num)
            speaking_analysis = SpeakingAnalysis(
                attempt_id=attempt.id,
                part_number=part_num,
                audio_url=audio,
                transcript=transcript,
                duration_seconds=analysis["duration_seconds"],
                grammar_score=analysis["grammar_score"],
                vocabulary_score=analysis["vocabulary_score"],
                fluency_score=analysis["fluency_score"],
                pronunciation_score=analysis["pronunciation_score"],
                coherence_score=analysis["coherence_score"],
                estimated_band=analysis["estimated_band"],
                feedback=analysis["feedback"],
                strengths=analysis["strengths"],
                weaknesses=analysis["weaknesses"],
                recommendations=analysis["recommendations"],
            )
            db.add(speaking_analysis)
    else:
        for section in attempt.test.sections:
            if section.section_type == "speaking":
                for q in section.questions:
                    if q.question_type == "speaking_task":
                        existing_ans = answer_map.get(q.id)
                        transcript = existing_ans.transcript if existing_ans else ""
                        audio_url = existing_ans.audio_url if existing_ans else ""
                        part_num = 1
                        if q.cue_card:
                            part_num = 2
                        elif q.prompt_text and "discussion" in str(q.prompt_text).lower():
                            part_num = 3
                        analysis = analyze_speaking(transcript or "", 0, part_num)
                        speaking_analysis = SpeakingAnalysis(
                            attempt_id=attempt.id,
                            part_number=part_num,
                            audio_url=audio_url or "",
                            transcript=transcript or "",
                            duration_seconds=0,
                            grammar_score=analysis["grammar_score"],
                            vocabulary_score=analysis["vocabulary_score"],
                            fluency_score=analysis["fluency_score"],
                            pronunciation_score=analysis["pronunciation_score"],
                            coherence_score=analysis["coherence_score"],
                            estimated_band=analysis["estimated_band"],
                            feedback=analysis["feedback"],
                            strengths=analysis["strengths"],
                            weaknesses=analysis["weaknesses"],
                            recommendations=analysis["recommendations"],
                        )
                        db.add(speaking_analysis)

    await db.flush()

    listening_band = calculate_listening_band(listening_correct, listening_total) if listening_total > 0 else 5.0
    reading_band = calculate_reading_band(reading_correct, reading_total) if reading_total > 0 else 5.0

    writing_result = await db.execute(
        select(WritingAnalysis).where(WritingAnalysis.attempt_id == attempt.id)
    )
    writing_analyses = writing_result.scalars().all()
    if writing_analyses:
        writing_band = round_band(sum(wa.estimated_band for wa in writing_analyses) / len(writing_analyses))
    else:
        writing_band = 5.0

    speaking_result = await db.execute(
        select(SpeakingAnalysis).where(SpeakingAnalysis.attempt_id == attempt.id)
    )
    speaking_analyses_list = speaking_result.scalars().all()
    if speaking_analyses_list:
        speaking_band = round_band(sum(sa.estimated_band for sa in speaking_analyses_list) / len(speaking_analyses_list))
    else:
        speaking_band = 5.0

    overall_band = calculate_overall_band(listening_band, reading_band, writing_band, speaking_band)

    test_result = TestResult(
        attempt_id=attempt.id,
        overall_band=overall_band,
        listening_band=listening_band,
        reading_band=reading_band,
        writing_band=writing_band,
        speaking_band=speaking_band,
        listening_score=listening_correct,
        listening_total=listening_total,
        reading_score=reading_correct,
        reading_total=reading_total,
        writing_score=writing_band,
        speaking_score=speaking_band,
    )
    db.add(test_result)

    attempt.status = "completed"
    attempt.ended_at = datetime.utcnow()
    attempt.remaining_time_seconds = 0

    await db.commit()
    await db.refresh(test_result)

    logger.info(f"Mock test attempt {attempt.id} submitted. Overall band: {overall_band}")

    return await _build_result_response(attempt, test_result, all_results, db)


def round_band(band: float) -> float:
    return round(band * 2) / 2


async def _build_result_response(
    attempt: TestAttempt,
    test_result: TestResult,
    question_results: list[dict],
    db: AsyncSession,
) -> TestResultResponse:
    question_review = [
        QuestionReviewItem(
            question_id=r["question_id"],
            question_text=r.get("question_text", ""),
            question_type=r["question_type"],
            user_answer=r["user_answer"],
            correct_answer=r["correct_answer"],
            is_correct=r["is_correct"],
            is_skipped=r.get("is_skipped", False),
            section=r["section"],
            marks=r["marks"],
        )
        for r in question_results
    ]

    section_timings = [
        SectionTimingDetail(
            section_type=t.section_type,
            time_limit_seconds=t.time_limit_seconds,
            time_spent_seconds=t.time_spent_seconds,
        )
        for t in attempt.timings
    ]

    writing_result = await db.execute(
        select(WritingAnalysis).where(WritingAnalysis.attempt_id == attempt.id)
    )
    writing_analyses = [
        WritingAnalysisResponse(
            task_number=wa.task_number,
            word_count=wa.word_count,
            grammar_score=wa.grammar_score,
            vocabulary_score=wa.vocabulary_score,
            task_response_score=wa.task_response_score,
            coherence_score=wa.coherence_score,
            sentence_variety_score=wa.sentence_variety_score,
            estimated_band=wa.estimated_band,
            feedback=wa.feedback,
            strengths=wa.strengths,
            weaknesses=wa.weaknesses,
            recommendations=wa.recommendations,
        )
        for wa in writing_result.scalars().all()
    ]

    speaking_result = await db.execute(
        select(SpeakingAnalysis).where(SpeakingAnalysis.attempt_id == attempt.id)
    )
    speaking_analyses = [
        SpeakingAnalysisResponse(
            part_number=sa.part_number,
            duration_seconds=sa.duration_seconds,
            grammar_score=sa.grammar_score,
            vocabulary_score=sa.vocabulary_score,
            fluency_score=sa.fluency_score,
            pronunciation_score=sa.pronunciation_score,
            coherence_score=sa.coherence_score,
            estimated_band=sa.estimated_band,
            feedback=sa.feedback,
            strengths=sa.strengths,
            weaknesses=sa.weaknesses,
            recommendations=sa.recommendations,
        )
        for sa in speaking_result.scalars().all()
    ]

    recommendations = generate_recommendations(
        test_result.listening_band,
        test_result.reading_band,
        test_result.writing_band,
        test_result.speaking_band,
    )
    recommendation_items = [
        RecommendationItem(
            category=r["category"],
            message=r["message"],
            priority=r["priority"],
        )
        for r in recommendations
    ]

    performance = calculate_performance_summary(
        test_result.listening_score, test_result.listening_total,
        test_result.reading_score, test_result.reading_total,
        question_results,
    )

    return TestResultResponse(
        attempt_id=attempt.id,
        test_title=attempt.test.title,
        overall_band=test_result.overall_band,
        listening_band=test_result.listening_band,
        reading_band=test_result.reading_band,
        writing_band=test_result.writing_band,
        speaking_band=test_result.speaking_band,
        listening_score=test_result.listening_score,
        listening_total=test_result.listening_total,
        reading_score=test_result.reading_score,
        reading_total=test_result.reading_total,
        status=attempt.status,
        started_at=attempt.started_at,
        ended_at=attempt.ended_at,
        question_review=question_review,
        section_timings=section_timings,
        writing_analyses=writing_analyses,
        speaking_analyses=speaking_analyses,
        recommendations=recommendation_items,
        performance_summary=performance,
    )


@router.get("/results/{attempt_id}", response_model=TestResultResponse)
async def get_test_results(
    attempt_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    attempt_result = await db.execute(
        select(TestAttempt)
        .where(TestAttempt.id == attempt_id)
        .options(
            selectinload(TestAttempt.test),
            selectinload(TestAttempt.answers).selectinload(UserAnswer.question),
            selectinload(TestAttempt.timings),
        )
    )
    attempt = attempt_result.scalar_one_or_none()

    if not attempt:
        raise HTTPException(status_code=404, detail="Test attempt not found")

    if attempt.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    result_result = await db.execute(
        select(TestResult).where(TestResult.attempt_id == attempt_id)
    )
    test_result = result_result.scalar_one_or_none()

    if not test_result:
        raise HTTPException(status_code=404, detail="Results not found. Test may not be submitted yet.")

    question_results = []
    for ans in attempt.answers:
        q = ans.question
        correct_list = q.correct_answer if isinstance(q.correct_answer, list) else [q.correct_answer]
        accepted = q.acceptable_answers if hasattr(q, 'acceptable_answers') and q.acceptable_answers else None
        is_correct = is_answer_correct(ans.answer_text or "", correct_list, q.question_type, accepted)

        question_results.append({
            "question_id": q.id,
            "question_text": q.question_text,
            "question_type": q.question_type,
            "user_answer": ans.answer_text,
            "correct_answer": correct_list,
            "is_correct": is_correct,
            "is_skipped": not bool(ans.answer_text and ans.answer_text.strip()),
            "section": ans.section,
            "marks": q.marks,
        })

    return await _build_result_response(attempt, test_result, question_results, db)
