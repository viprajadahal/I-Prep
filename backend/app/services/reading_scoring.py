from app.models.reading import ReadingQuestion

# basic normalization for fill-in-blank leniency
def normalize(text: str) -> str:
    return text.strip().lower().rstrip(".,!?")


def is_answer_correct(question: ReadingQuestion, user_answer: str) -> bool:
    correct = question.correct_answer

    if question.question_type == "mcq":
        return normalize(user_answer) == normalize(str(correct))

    if question.question_type == "true_false_ng":
        return normalize(user_answer) == normalize(str(correct))

    if question.question_type == "fill_blank":
        if isinstance(correct, list):
            return normalize(user_answer) in [normalize(c) for c in correct]
        return normalize(user_answer) == normalize(str(correct))

    if question.question_type == "matching":
        return normalize(user_answer) == normalize(str(correct))

    return False


def score_attempt(questions: list[ReadingQuestion], submitted_answers: dict[int, str]):
    """
    questions: all ReadingQuestion objects for the passage
    submitted_answers: {question_id: user_answer}

    Returns:
        score: int
        answer_records_data: list of dicts, each shaped to build a ReadingAnswerRecord row
        skill_breakdown: list of dicts (still computed here for the immediate API response,
                         just no longer stored directly — it's derived from answer_records_data)
    """
    answer_records_data = []
    skill_stats = {}
    score = 0

    for q in questions:
        user_answer = submitted_answers.get(q.id, "")
        correct = is_answer_correct(q, user_answer)

        if correct:
            score += 1

        skill = q.skill_type or "unspecified"
        skill_stats.setdefault(skill, {"correct": 0, "total": 0})
        skill_stats[skill]["total"] += 1
        if correct:
            skill_stats[skill]["correct"] += 1

        # this dict maps directly to ReadingAnswerRecord fields
        answer_records_data.append({
            "question_id": q.id,
            "user_answer": user_answer,
            "is_correct": correct,
            "skill_type": q.skill_type
        })

    skill_breakdown = [
        {"skill_type": k, "correct": v["correct"], "total": v["total"]}
        for k, v in skill_stats.items()
    ]

    return score, answer_records_data, skill_breakdown