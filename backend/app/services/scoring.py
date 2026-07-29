import re
import math
import random
from typing import Optional


def normalize_answer(text: str) -> str:
    if not text:
        return ""
    text = text.strip().lower()
    text = re.sub(r'[.,!?;:]+$', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text


def is_answer_correct(
    user_answer: str,
    correct_answer: list[str],
    question_type: str,
    acceptable_answers: Optional[list[str]] = None
) -> bool:
    if not user_answer or not user_answer.strip():
        return False

    normalized_user = normalize_answer(user_answer)
    all_accepted = list(correct_answer)
    if acceptable_answers:
        all_accepted.extend(acceptable_answers)

    normalized_corrects = [normalize_answer(a) for a in all_accepted]

    if question_type == "mcq":
        return normalized_user in normalized_corrects

    if question_type in ("true_false_ng", "true_false_not_given"):
        return normalized_user in normalized_corrects

    if question_type in ("fill_blank", "sentence_completion", "summary_completion", "form_completion", "short_answer"):
        return normalized_user in normalized_corrects

    if question_type in ("matching", "matching_headings", "matching_information", "matching_paragraphs", "map_labelling"):
        return normalized_user in normalized_corrects

    return normalized_user in normalized_corrects


def score_listening_section(questions: list, answers: dict[int, str]) -> tuple[int, int, list[dict]]:
    correct_count = 0
    total = len(questions)
    results = []

    for q in questions:
        user_answer = answers.get(q.id, "")
        accepted = q.acceptable_answers if hasattr(q, 'acceptable_answers') and q.acceptable_answers else None
        correct_list = q.correct_answer if isinstance(q.correct_answer, list) else [q.correct_answer]

        is_correct = is_answer_correct(user_answer, correct_list, q.question_type, accepted)
        if is_correct:
            correct_count += 1

        results.append({
            "question_id": q.id,
            "user_answer": user_answer,
            "correct_answer": correct_list,
            "is_correct": is_correct,
            "is_skipped": not bool(user_answer and user_answer.strip()),
            "question_type": q.question_type,
            "question_text": q.question_text,
            "section": "listening",
            "marks": q.marks,
        })

    return correct_count, total, results


def score_reading_section(questions: list, answers: dict[int, str]) -> tuple[int, int, list[dict]]:
    correct_count = 0
    total = len(questions)
    results = []

    for q in questions:
        user_answer = answers.get(q.id, "")
        accepted = q.acceptable_answers if hasattr(q, 'acceptable_answers') and q.acceptable_answers else None
        correct_list = q.correct_answer if isinstance(q.correct_answer, list) else [q.correct_answer]

        is_correct = is_answer_correct(user_answer, correct_list, q.question_type, accepted)
        if is_correct:
            correct_count += 1

        results.append({
            "question_id": q.id,
            "user_answer": user_answer,
            "correct_answer": correct_list,
            "is_correct": is_correct,
            "is_skipped": not bool(user_answer and user_answer.strip()),
            "question_type": q.question_type,
            "question_text": q.question_text,
            "section": "reading",
            "marks": q.marks,
        })

    return correct_count, total, results


def calculate_listening_band(correct: int, total: int) -> float:
    if total == 0:
        return 0.0
    raw_score = correct / total * 40
    return _raw_to_band(raw_score)


def calculate_reading_band(correct: int, total: int) -> float:
    if total == 0:
        return 0.0
    raw_score = correct / total * 40
    return _raw_to_band(raw_score)


def _raw_to_band(raw: float) -> float:
    band_map = [
        (1, 1.0), (2, 1.5), (3, 2.0), (4, 2.5), (5, 3.0),
        (6, 3.0), (7, 3.5), (8, 3.5), (9, 4.0), (10, 4.0),
        (11, 4.0), (12, 4.5), (13, 4.5), (14, 4.5),
        (15, 5.0), (16, 5.0), (17, 5.0), (18, 5.5), (19, 5.5),
        (20, 5.5), (21, 6.0), (22, 6.0), (23, 6.0), (24, 6.5),
        (25, 6.5), (26, 6.5), (27, 7.0), (28, 7.0),
        (29, 7.0), (30, 7.5), (31, 7.5), (32, 7.5),
        (33, 8.0), (34, 8.0), (35, 8.5), (36, 8.5),
        (37, 9.0), (38, 9.0), (39, 9.0), (40, 9.0),
    ]

    raw_int = max(0, min(40, round(raw)))

    for score, band in band_map:
        if raw_int <= score:
            return band

    return 9.0


def calculate_overall_band(listening: float, reading: float, writing: float, speaking: float) -> float:
    overall = (listening + reading + writing + speaking) / 4
    return round_band(overall)


def round_band(band: float) -> float:
    return round(band * 2) / 2


def _is_english_like(word: str) -> bool:
    if not word or len(word) < 2:
        return False
    word = word.strip().lower()
    if not re.search(r'[aeiou]', word):
        return False
    if len(set(word)) <= 2 and len(word) > 3:
        return False
    v = sum(1 for c in word if c in 'aeiou')
    if v / len(word) < 0.2:
        return False
    return True


def _count_spelling_errors(words: list) -> int:
    errors = 0
    for w in words:
        w = w.strip().lower().strip('.,!?;"\'()[]{}/\\')
        if len(w) < 2:
            continue
        if re.search(r'[bcdfghjklmnpqrstvwxz]{4,}', w):
            errors += 1
            continue
        if re.search(r'(.)\1{2}', w) and not re.search(r'(ll|ss|ee|oo|tt|pp|rr|nn|mm|cc|ff|gg|bb|dd)\1', w):
            errors += 1
            continue
    return errors


def _detect_complex_structures(sentences: list) -> dict:
    relative_clauses = 0
    conditionals = 0
    passive_voice = 0
    for sent in sentences:
        lower = sent.lower()
        relative_clauses += len(re.findall(r'\b(which|that|who|whom|whose)\s+\w+', lower))
        conditionals += len(re.findall(r'\b(if|unless|provided that|as long as)\s+\w+.{0,50}\b(would|could|might|will|can)\b', lower))
        conditionals += len(re.findall(r'\b(would|could|might)\s+have\s+\w+en\b', lower))
        passive_voice += len(re.findall(r'\b(is|are|was|were|been|being)\s+\w+ed\b', lower))
        passive_voice += len(re.findall(r'\b(is|are|was|were|been|being)\s+(built|written|known|shown|given|taken|made|done|found|seen|kept|held|said|told|brought|left|lost|sent|set|led|meant|put)\b', lower))
    return {
        "relative_clauses": relative_clauses,
        "conditionals": conditionals,
        "passive_voice": passive_voice,
        "total_complex": relative_clauses + conditionals + passive_voice,
    }


def _detect_topic_sentences(paragraphs: list) -> int:
    topic_markers = [
        'firstly', 'first of all', 'to begin with', 'primarily',
        'one of the', 'the main', 'another', 'in addition',
        'furthermore', 'moreover', 'secondly', 'thirdly',
        'turning to', 'with regard to', 'regarding', 'as for',
        'it is clear', 'it is evident', 'there are several',
        'the primary', 'the most significant',
    ]
    count = 0
    for p in paragraphs:
        if not p.strip():
            continue
        first_sent = p.strip().split('.')[0].strip().lower()
        if any(marker in first_sent for marker in topic_markers):
            count += 1
        elif len(first_sent.split()) > 5:
            count += 1
    return max(0, count - 1)


def _detect_prompt_reuse(text: str, task_number: int) -> float:
    repeated_bigrams = re.findall(r'\b(\w+\s+\w+)\b.*\b\1\b', text.lower())
    return len(repeated_bigrams) / max(len(text.split()), 1)


def analyze_writing(text: str, task_number: int) -> dict:
    if not text or not text.strip():
        return {
            "word_count": 0,
            "grammar_score": 0.0,
            "vocabulary_score": 0.0,
            "task_response_score": 0.0,
            "coherence_score": 0.0,
            "sentence_variety_score": 0.0,
            "estimated_band": 0.0,
            "feedback": "No answer provided.",
            "strengths": [],
            "weaknesses": ["No response submitted"],
            "recommendations": ["Submit an answer to receive feedback."],
            "punctuation_issues": [],
            "grammar_issues": [],
            "vocab_richness": 0.0,
            "complex_word_ratio": 0.0,
            "avg_sentence_length": 0.0,
            "sentence_count": 0,
            "paragraph_count": 0,
            "missing_commas": 0,
            "missing_fullstops": 0,
            "run_on_sentences": 0,
            "repeated_words": 0,
            "spelling_errors": 0,
            "complex_structures": 0,
            "relative_clauses": 0,
            "conditionals": 0,
            "passive_voice": 0,
            "topic_sentence_count": 0,
            "pronoun_references": 0,
            "has_introduction": False,
            "has_conclusion": False,
            "has_data_description": False,
            "has_position_statement": False,
            "has_examples": False,
            "low_reuse": False,
        }

    words = text.split()
    word_count = len(words)

    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    sentence_count = max(len(sentences), 1)

    avg_words_per_sentence = word_count / sentence_count

    unique_words = set(w.lower() for w in words)
    vocab_richness = len(unique_words) / max(word_count, 1)

    paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
    paragraph_count = max(len(paragraphs), 1)

    complex_words = 0
    for word in words:
        if len(word) > 8 or word.endswith(('tion', 'ment', 'ness', 'able', 'ible', 'ous', 'ive')):
            complex_words += 1
    complex_ratio = complex_words / max(word_count, 1)

    english_like_ratio = sum(1 for w in words if _is_english_like(w)) / max(word_count, 1)

    all_chars = [c for c in text.lower() if c.isalpha()]
    vowel_ratio = sum(1 for c in all_chars if c in 'aeiou') / max(len(all_chars), 1) if all_chars else 0
    is_gibberish = (english_like_ratio < 0.4 or vowel_ratio < 0.2) and word_count > 0

    # --- Detailed punctuation analysis ---
    comma_count = text.count(',')
    period_count = text.count('.')
    question_count = text.count('?')
    exclamation_count = text.count('!')
    semicolon_count = text.count(';')
    colon_count = text.count(':')

    missing_commas = 0
    # Detect "and" / "but" / "or" / "so" / "yet" joining two clauses without comma
    missing_commas += len(re.findall(r'\b\w+\s+(and|but|or|so|yet)\s+\w+\s+\w+', text, re.IGNORECASE))
    # Detect introductory phrases missing comma (However / Therefore / Furthermore / Moreover / In addition / For example)
    missing_commas += len(re.findall(r'^(However|Therefore|Furthermore|Moreover|In addition|For example|In contrast|On the other hand|Similarly|Consequently)\s+\S', text, re.MULTILINE))
    # Detect "although/though/while/because/since/if/unless/when" subordinate clauses without comma before them
    missing_commas += len(re.findall(r'\w+\s+(although|though|while|because|since|if|unless|when|whereas)\s+\S', text, re.IGNORECASE))

    missing_fullstops = 0
    # Detect sentences with >40 words and no period (run-on)
    for sent in sentences:
        if len(sent.split()) > 40 and not sent.rstrip().endswith(('.', '!', '?')):
            missing_fullstops += 1

    # Detect run-on sentences: two independent clauses joined without punctuation
    run_on_sentences = len(re.findall(
        r'\w+\s+(the|a|an|he|she|it|they|we|you|I|this|that|there|here)\s+\w+\s+\w+\s+\w+',
        text, re.IGNORECASE
    ))
    # More conservative: long comma-less segments
    long_segments = [s for s in sentences if len(s.split()) > 25]
    run_on_sentences = max(run_on_sentences, len(long_segments))

    # Repeated consecutive words ("the the", "is is", "a a")
    repeated_words = len(re.findall(r'\b(\w+)\s+\1\b', text, re.IGNORECASE))

    # --- Common grammar errors ---
    common_errors = len(re.findall(
        r'\b(he go|she go|they goes|he are|she is a good|more better|most best|irregardless|alot|could of|should of|would of|must of)\b',
        text.lower()
    ))

    # Subject-verb agreement issues
    sv_errors = len(re.findall(
        r'\b(he have|she have|it have|they has|we has|I has|he do|she do|they does|we does)\b',
        text.lower()
    ))

    # Tense errors — broad detection
    te_errors = 0
    # 1. Past time marker + present tense auxiliary
    past_markers = r'(?:yesterday|last\s+\w+|ago|in\s+\d{4}|previously|formerly|earlier|back\s+then|at\s+that\s+time|in\s+the\s+past|in\s+those\s+days|once\s+upon\s+a\s+time|in\s+my\s+childhood|when\s+I\s+was|used\s+to)'
    present_aux = r'\b(is|are|am|has|have|does|do)\b'
    te_errors += len(re.findall(
        rf'{past_markers}.{{0,30}}?{present_aux}',
        text.lower(), re.DOTALL
    ))
    # 2. Past time marker + common 3rd person singular present verbs
    te_errors += len(re.findall(
        rf'{past_markers}.{{0,30}}?\b(goes|does|makes|takes|writes|buys|says|comes|gives|puts|thinks|knows|believes|seems|appears|needs|wants|shows|means|gets|finds|tells|leaves|brings|looks|works|plays|lives|moves|starts|keeps|holds|turns|calls|asks|tries|stops|runs|reads|speaks|eats|drinks|sings|swims|drives|flies|wears|grows|chooses|rides|draws|throws|breaks|steals|freezes|begins|sits|sleeps|teaches|catches|buys|fights|tears)\b',
        text.lower(), re.DOTALL
    ))
    # 3. Wrong participle after have/has/had
    te_errors += len(re.findall(r'\b(have\s+went|have\s+did|have\s+saw|have\s+wrote|have\s+took|have\s+began|have\s+drew|have\s+drank|have\s+sang|have\s+ran|have\s+ate|have\s+broke|have\s+spoke|have\s+froze|have\s+stole|have\s+wore)\b', text.lower()))
    te_errors += len(re.findall(r'\b(has\s+went|has\s+did|has\s+saw|has\s+wrote|has\s+took|has\s+began|has\s+drew|has\s+ran|has\s+ate|has\s+broke|has\s+spoke)\b', text.lower()))
    te_errors += len(re.findall(r'\b(had\s+went|had\s+did|had\s+saw|had\s+wrote|had\s+took|had\s+began|had\s+ran|had\s+ate)\b', text.lower()))
    # 4. Wrong form after modals
    te_errors += len(re.findall(r'\b(can\s+\w+s|must\s+\w+s|will\s+\w+s|would\s+\w+s|should\s+\w+s|could\s+\w+s)\b', text.lower()))
    # 5. did/didn't + past tense verb
    te_errors += len(re.findall(r"\b(did|didn't)\s+\w+ed\b", text.lower()))
    te_errors += len(re.findall(r"\b(did|didn't)\s+(took|went|saw|wrote|broke|spoke|drank|ran|ate|gave|knew|threw|drew|grew|chose|rode|sang|swam|drove|flew|wore|stole|froze)\b", text.lower()))
    # 6. doesn't/don't + past tense
    te_errors += len(re.findall(r"\b(doesn't|does\s+not|don't|do\s+not)\s+\w+ed\b", text.lower()))
    te_errors += len(re.findall(r"\b(doesn't|does\s+not|don't|do\s+not)\s+(took|went|saw|wrote|broke|spoke|drank|ran|ate|gave|knew|threw|drew|grew|chose|rode|sang|swam|drove|flew|wore|stole|froze)\b", text.lower()))
    # 7. if I was (subjunctive — should be "if I were")
    te_errors += len(re.findall(r'\bif\s+I\s+was\b', text.lower()))
    # 8. Future time marker + past tense
    future_markers = r'(?:tomorrow|next\s+\w+|soon|in\s+the\s+future|in\s+the\s+coming\s+\w+|in\s+\d+\s+(day|week|month|year)s?)'
    te_errors += len(re.findall(
        rf'{future_markers}.{{0,30}}?\b(went|did|saw|was|were|had|took|wrote|broke|spoke|drank|ran|ate|gave|knew|threw|drew|grew|chose|rode|sang|swam|drove|flew|wore|stole|froze|began|found|left|told|meant|felt|kept|built|sent|sold|bought|caught|taught|thought)\b',
        text.lower(), re.DOTALL
    ))

    # articles errors (a/an misuse — "a" before vowel sound)
    article_errors = len(re.findall(r'\ba\s+[aeiou]\w*\b', text.lower())) // 3  # rough estimate

    # Missing articles before singular countable nouns
    missing_articles = len(re.findall(r'\b(is|are|was|were)\s+(good|bad|important|big|small|large|great|important)\s+(thing|person|people|idea|way|reason)\b', text.lower()))

    # Capitalization issues: sentence-start lowercase
    lines = text.split('\n')
    cap_issues = 0
    for line in lines:
        line = line.strip()
        if line and line[0].islower():
            cap_issues += 1
    # Also check after periods
    cap_issues += len(re.findall(r'[.!?]\s+[a-z]', text))

    # --- Spelling errors ---
    spelling_errors = _count_spelling_errors(words)
    spelling_error_rate = spelling_errors / max(word_count, 1)

    # --- Complex structures ---
    complex_struct = _detect_complex_structures(sentences)
    complex_structure_score = min(complex_struct["total_complex"] / max(sentence_count, 1), 1.0)

    # --- Topic sentences ---
    topic_sentence_count = _detect_topic_sentences(paragraphs)

    # --- Pronoun referencing ---
    ref_pronouns = len(re.findall(r'(?:^|\.)\s*(it|this|these|those|they|them|such|the former|the latter)\s+\w+', text))
    pronoun_reference_ratio = ref_pronouns / max(sentence_count, 1)

    # --- Exact repetition / paraphrasing ---
    reuse_ratio = _detect_prompt_reuse(text, task_number)
    low_reuse = reuse_ratio > 0.15

    # --- Task-specific checks ---
    has_data_description = False
    has_examples = False
    has_position_statement = False
    if task_number == 1:
        has_data_description = any(kw in text.lower() for kw in [
            'the chart', 'the graph', 'the table', 'the diagram', 'the figure',
            'shows', 'illustrates', 'compares', 'represents', 'depicts',
            'according to', 'as can be seen', 'it can be seen',
            'the highest', 'the lowest', 'the most', 'the least',
            'increased', 'decreased', 'rose', 'fell', 'remained stable',
            'percentage', 'proportion', 'figure', 'data', 'statistics',
        ])
    else:
        has_position_statement = any(kw in text.lower() for kw in [
            'i agree', 'i disagree', 'i believe', 'in my opinion',
            'i think', 'i firmly believe', 'it is my view',
            'this essay argues', 'this essay will discuss',
            'from my perspective', 'it seems to me',
        ])
        has_examples = any(kw in text.lower() for kw in [
            'for example', 'for instance', 'such as', 'to illustrate',
            'as an example', 'a case in point', 'in particular',
            'specifically', 'namely',
        ])

    # --- Build punctuation_issues list ---
    punctuation_issues = []
    if missing_commas > 0:
        punctuation_issues.append(f"{missing_commas} missing comma(s) — use commas after introductory words, before 'and/but/or' in lists, and around 'although/because/while' clauses")
    if missing_fullstops > 0:
        punctuation_issues.append(f"{missing_fullstops} sentence(s) too long without full stop — break into shorter sentences with periods")
    if repeated_words > 0:
        punctuation_issues.append(f"{repeated_words} repeated word(s) found (e.g., 'the the', 'is is') — proofread carefully")
    if cap_issues > 0:
        punctuation_issues.append(f"{cap_issues} capitalization issue(s) — always capitalize the first word of a sentence")
    if semicolon_count == 0 and colon_count == 0 and word_count > 200:
        punctuation_issues.append("No semicolons or colons used — try using ';' to connect related clauses and ':' to introduce lists or explanations")
    if comma_count == 0 and word_count > 100:
        punctuation_issues.append("No commas used at all — commas are essential for clarity, lists, and clause separation")
    if period_count == 0 and word_count > 50:
        punctuation_issues.append("No periods found — end each sentence with a period (.)")
    if question_count == 0 and exclamation_count == 0 and word_count > 50:
        punctuation_issues.append("Only periods used — vary punctuation with question marks (?) or exclamation marks (!) where appropriate")

    # --- Build grammar_issues list ---
    grammar_issues = []
    if common_errors > 0:
        grammar_issues.append(f"{common_errors} common error(s) detected (e.g., 'could of' instead of 'could have', 'alot' instead of 'a lot')")
    if sv_errors > 0:
        grammar_issues.append(f"{sv_errors} subject-verb agreement error(s) — 'he/she/it has' not 'he/she/it have'; 'they have' not 'they has'")
    if te_errors > 0:
        grammar_issues.append(f"{te_errors} tense error(s) — use correct verb tense (e.g., 'yesterday I went' not 'yesterday I go')")
    if missing_articles > 0:
        grammar_issues.append(f"{missing_articles} missing article(s) — use 'a/an/the' before singular countable nouns")
    if avg_words_per_sentence > 30:
        grammar_issues.append(f"Average sentence length is {avg_words_per_sentence:.0f} words — IELTS examiners prefer 15-25 words per sentence")
    if avg_words_per_sentence < 8:
        grammar_issues.append(f"Average sentence length is only {avg_words_per_sentence:.0f} words — try combining short sentences for better flow")
    for sent in sentences:
        word_list = sent.split()
        if len(word_list) > 40:
            grammar_issues.append(f"Very long sentence ({len(word_list)} words) — consider splitting with a period or semicolon")
            break

    has_introduction = any(
        kw in text.lower()
        for kw in ['i believe', 'in my opinion', 'this essay', 'it is often', 'many people', 'there is no doubt']
    )
    has_conclusion = any(
        kw in text.lower()
        for kw in ['in conclusion', 'to conclude', 'in summary', 'overall', 'to sum up', 'all things considered']
    )

    # --- Score calculations ---
    grammar_score = min(10.0, max(1.0,
        7.0
        + (0.5 if avg_words_per_sentence > 12 else 0)
        + (0.5 if sentence_count > 4 else 0)
        - (common_errors * 0.5)
        - (sv_errors * 0.3)
        - (te_errors * 0.5)
        - (missing_commas * 0.1)
        - (repeated_words * 0.3)
        - (spelling_error_rate * 5)
        + (0.5 if complex_structure_score > 0.3 else 0)
        + (0.3 if vocab_richness > 0.6 else 0)
    ))

    vocabulary_score = min(10.0, max(1.0,
        5.0
        + (vocab_richness * 5)
        + (complex_ratio * 3)
        - (spelling_error_rate * 8)
        - (1.0 if low_reuse else 0)
        + (0.5 if word_count > (150 if task_number == 1 else 250) else 0)
        + (0.5 if complex_ratio > 0.2 else 0)
    ))

    task_response_score = min(10.0, max(1.0,
        5.0
        + (1.0 if has_introduction else 0)
        + (1.0 if has_conclusion else 0)
        + (1.0 if word_count >= (150 if task_number == 1 else 250) else 0)
        + (0.5 if paragraph_count >= 3 else 0)
        + (0.5 if avg_words_per_sentence > 10 else 0)
        + (1.0 if (task_number == 1 and has_data_description) or (task_number == 2 and has_position_statement) else 0)
        + (0.5 if task_number == 2 and has_examples else 0)
    ))

    coherence_score = min(10.0, max(1.0,
        5.0
        + (1.0 if paragraph_count >= 3 else 0)
        + (0.5 if avg_words_per_sentence > 12 else 0)
        + (0.5 if avg_words_per_sentence < 30 else 0)
        + (1.0 if vocab_richness > 0.55 else 0)
        + (1.0 if topic_sentence_count >= 2 else 0)
        + (0.5 if pronoun_reference_ratio > 0.2 else 0)
    ))

    sentence_variety_score = min(10.0, max(1.0,
        5.0
        + (1.0 if avg_words_per_sentence > 15 else 0)
        + (0.5 if complex_ratio > 0.15 else 0)
        + (0.5 if sentence_count > 6 else 0)
        + (1.0 if vocab_richness > 0.6 else 0)
        + (1.0 if complex_structure_score > 0.3 else 0)
    ))

    raw_band = (
        grammar_score * 0.25
        + vocabulary_score * 0.25
        + task_response_score * 0.25
        + coherence_score * 0.15
        + sentence_variety_score * 0.1
    )

    if is_gibberish:
        raw_band = min(raw_band, 4.0)
        raw_band -= 1.0
    estimated_band = round_band(raw_band)

    strengths = []
    weaknesses = []
    recommendations = []

    if is_gibberish:
        weaknesses = ["Text does not appear to contain meaningful English — the writing could not be properly assessed"]
        recommendations = ["Write your response using proper English words and sentences"]

    if not is_gibberish:
        if grammar_score >= 7.0:
            strengths.append("Good grammatical accuracy")
        else:
            weaknesses.append("Grammatical errors detected")
            recommendations.append("Review common grammar patterns and practice error correction")
        if te_errors > 0:
            recommendations.append("Practice using correct verb tenses — be consistent with past, present, and future forms")
        if spelling_errors > 0:
            weaknesses.append(f"{spelling_errors} possible spelling error(s) — proofread carefully")

        if vocabulary_score >= 7.0:
            strengths.append("Strong vocabulary range")
        else:
            weaknesses.append("Limited vocabulary range")
            recommendations.append("Learn and use more academic vocabulary and collocations")
        if low_reuse:
            weaknesses.append("Exact word patterns repeated — paraphrase to show lexical flexibility")
            recommendations.append("Avoid repeating the same phrases — use synonyms and rephrase ideas")
        if complex_struct["total_complex"] > 2:
            strengths.append(f"Good use of complex structures ({complex_struct['total_complex']} instances)")
        else:
            recommendations.append("Use more complex sentences — relative clauses, conditionals, and passive voice")

        if task_response_score >= 7.0:
            strengths.append("Good task response with clear structure")
        else:
            weaknesses.append("Task response could be improved")
            recommendations.append("Ensure introduction, body paragraphs, and conclusion address the prompt fully")
        if task_number == 1 and not has_data_description:
            weaknesses.append("Task 1 essay should describe data from the chart/table — include specific figures")
            recommendations.append("Refer to data trends, compare values, and highlight key features")
        if task_number == 2 and not has_position_statement:
            weaknesses.append("Task 2 essay needs a clear position or opinion statement")
            recommendations.append("Clearly state your position in the introduction and support it throughout")
        if task_number == 2 and not has_examples:
            recommendations.append("Support arguments with specific examples or evidence")

        if coherence_score >= 7.0:
            strengths.append("Well-organized with good cohesion")
        else:
            weaknesses.append("Organization and coherence need improvement")
            recommendations.append("Use paragraphing, linking words, and clear topic sentences")
        if topic_sentence_count < paragraph_count - 1:
            recommendations.append("Start each body paragraph with a clear topic sentence")
        if pronoun_reference_ratio < 0.1:
            recommendations.append("Use pronoun referencing (it, this, they) to connect ideas between sentences")

        if complex_struct["total_complex"] < 2:
            weaknesses.append("Limited sentence variety — use a mix of simple, compound, and complex sentences")

        if word_count < (150 if task_number == 1 else 250):
            weaknesses.append(f"Word count ({word_count}) is below minimum ({150 if task_number == 1 else 250})")
            recommendations.append(f"Write at least {'150' if task_number == 1 else '250'} words")

        if not has_introduction:
            recommendations.append("Include a clear introduction stating your position or overview")

        if not has_conclusion:
            recommendations.append("Add a conclusion summarizing your main points")

    feedback_parts = []
    feedback_parts.append(f"Word count: {word_count}")
    feedback_parts.append(f"Paragraphs: {paragraph_count}")
    feedback_parts.append(f"Sentences: {sentence_count}")
    feedback_parts.append(f"Vocabulary richness: {vocab_richness:.1%}")
    if task_number == 1:
        feedback_parts.append("Task 1 requires you to summarize the information presented in a graph, chart, table, or diagram.")
    else:
        feedback_parts.append("Task 2 requires you to write a well-structured essay responding to the given prompt.")

    return {
        "word_count": word_count,
        "grammar_score": round(grammar_score, 1),
        "vocabulary_score": round(vocabulary_score, 1),
        "task_response_score": round(task_response_score, 1),
        "coherence_score": round(coherence_score, 1),
        "sentence_variety_score": round(sentence_variety_score, 1),
        "estimated_band": estimated_band,
        "feedback": ". ".join(feedback_parts) + ".",
        "strengths": strengths,
        "weaknesses": weaknesses,
        "recommendations": recommendations,
        "punctuation_issues": punctuation_issues,
        "grammar_issues": grammar_issues,
        "vocab_richness": round(vocab_richness * 100, 1),
        "complex_word_ratio": round(complex_ratio * 100, 1),
        "avg_sentence_length": round(avg_words_per_sentence, 1),
        "sentence_count": sentence_count,
        "paragraph_count": paragraph_count,
        "missing_commas": missing_commas,
        "missing_fullstops": missing_fullstops,
        "run_on_sentences": run_on_sentences,
        "repeated_words": repeated_words,
        "spelling_errors": spelling_errors,
        "complex_structures": complex_struct["total_complex"],
        "relative_clauses": complex_struct["relative_clauses"],
        "conditionals": complex_struct["conditionals"],
        "passive_voice": complex_struct["passive_voice"],
        "topic_sentence_count": topic_sentence_count,
        "pronoun_references": ref_pronouns,
        "has_introduction": has_introduction,
        "has_conclusion": has_conclusion,
        "has_data_description": has_data_description,
        "has_position_statement": has_position_statement,
        "has_examples": has_examples,
        "low_reuse": low_reuse,
    }


def analyze_speaking(
    transcript: Optional[str],
    duration_seconds: float,
    part_number: int
) -> dict:
    if not transcript or not transcript.strip() or duration_seconds <= 0:
        return {
            "duration_seconds": duration_seconds,
            "grammar_score": 0.0,
            "vocabulary_score": 0.0,
            "fluency_score": 0.0,
            "pronunciation_score": 0.0,
            "coherence_score": 0.0,
            "estimated_band": 0.0,
            "feedback": "No speaking data recorded.",
            "strengths": [],
            "weaknesses": ["No response recorded"],
            "recommendations": ["Record a response to receive feedback."],
        }

    words = transcript.split()
    word_count = len(words)
    minutes = duration_seconds / 60
    wpm = word_count / max(minutes, 0.1)

    sentences = re.split(r'[.!?]+', transcript)
    sentences = [s.strip() for s in sentences if s.strip()]
    sentence_count = max(len(sentences), 1)

    unique_words = set(w.lower().strip('.,!?') for w in words)
    vocab_richness = len(unique_words) / max(word_count, 1)

    fillers = len(re.findall(r'\b(um|uh|like|you know|I mean|sort of|kind of)\b', transcript.lower()))
    filler_ratio = fillers / max(word_count, 1)

    fluency_score = min(10.0, max(1.0,
        5.0
        + (1.0 if 120 <= wpm <= 180 else 0)
        + (0.5 if wpm > 100 else 0)
        - (filler_ratio * 10)
        + (0.5 if duration_seconds > 60 else 0)
    ))

    grammar_score = min(10.0, max(1.0,
        5.0
        + (0.5 if sentence_count > 3 else 0)
        + (0.5 if vocab_richness > 0.6 else 0)
        + (0.5 if avg_words_per_sentence(sentences) > 8 else 0)
    ))

    vocabulary_score = min(10.0, max(1.0,
        5.0
        + (vocab_richness * 4)
        + (0.5 if word_count > 100 else 0)
    ))

    pronunciation_score = min(10.0, max(1.0,
        5.0
        + (0.5 if 110 <= wpm <= 170 else 0)
        - (filler_ratio * 8)
        + (0.5 if vocab_richness > 0.55 else 0)
    ))

    coherence_score = min(10.0, max(1.0,
        5.0
        + (0.5 if sentence_count > 3 else 0)
        + (1.0 if vocab_richness > 0.55 else 0)
        + (0.5 if avg_words_per_sentence(sentences) > 8 else 0)
    ))

    raw_band = (
        grammar_score * 0.2
        + vocabulary_score * 0.2
        + fluency_score * 0.25
        + pronunciation_score * 0.15
        + coherence_score * 0.2
    )
    estimated_band = round_band(raw_band)

    strengths = []
    weaknesses = []
    recommendations = []

    if fluency_score >= 7.0:
        strengths.append("Good fluency and natural speech pace")
    else:
        weaknesses.append("Fluency could be improved")
        recommendations.append("Practice speaking continuously without long pauses")

    if vocabulary_score >= 7.0:
        strengths.append("Good vocabulary range")
    else:
        weaknesses.append("Limited vocabulary usage")
        recommendations.append("Use a wider range of vocabulary and less common words")

    if grammar_score >= 7.0:
        strengths.append("Good grammatical accuracy in speech")
    else:
        weaknesses.append("Grammatical errors in speech")
        recommendations.append("Practice complex sentence structures")

    if filler_ratio > 0.05:
        weaknesses.append(f"Excessive use of fillers ({fillers} instances)")
        recommendations.append("Reduce filler words like 'um', 'uh', 'like'")

    min_duration = 60 if part_number == 2 else 30
    if duration_seconds < min_duration:
        weaknesses.append(f"Speaking duration ({duration_seconds:.0f}s) was short")
        recommendations.append(f"Try to speak for at least {min_duration} seconds")

    feedback = f"Speaking duration: {duration_seconds:.0f}s. Words spoken: {word_count}. Speech rate: {wpm:.0f} WPM."

    return {
        "duration_seconds": round(duration_seconds, 1),
        "grammar_score": round(grammar_score, 1),
        "vocabulary_score": round(vocabulary_score, 1),
        "fluency_score": round(fluency_score, 1),
        "pronunciation_score": round(pronunciation_score, 1),
        "coherence_score": round(coherence_score, 1),
        "estimated_band": estimated_band,
        "feedback": feedback,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "recommendations": recommendations,
    }


def avg_words_per_sentence(sentences: list[str]) -> float:
    if not sentences:
        return 0
    word_counts = [len(s.split()) for s in sentences if s.strip()]
    return sum(word_counts) / max(len(word_counts), 1)


def generate_recommendations(
    listening_band: float,
    reading_band: float,
    writing_band: float,
    speaking_band: float,
) -> list[dict]:
    recommendations = []
    bands = {
        "Listening": listening_band,
        "Reading": reading_band,
        "Writing": writing_band,
        "Speaking": speaking_band,
    }

    weakest = min(bands, key=bands.get)
    strongest = max(bands, key=bands.get)

    for skill, band in bands.items():
        if band < 5.0:
            priority = "high"
            if skill == "Listening":
                recommendations.append({
                    "category": skill,
                    "message": f"Your {skill} band ({band}) is below average. Focus on regular listening practice with academic English. Use note-taking strategies while listening.",
                    "priority": priority,
                })
            elif skill == "Reading":
                recommendations.append({
                    "category": skill,
                    "message": f"Your {skill} band ({band}) is below average. Practice skimming and scanning techniques. Build academic vocabulary systematically.",
                    "priority": priority,
                })
            elif skill == "Writing":
                recommendations.append({
                    "category": skill,
                    "message": f"Your {skill} band ({band}) is below average. Focus on essay structure, grammar accuracy, and meeting word count requirements.",
                    "priority": priority,
                })
            elif skill == "Speaking":
                recommendations.append({
                    "category": skill,
                    "message": f"Your {skill} band ({band}) is below average. Practice speaking daily on varied topics. Record yourself and review.",
                    "priority": priority,
                })
        elif band < 6.5:
            priority = "medium"
            recommendations.append({
                "category": skill,
                "message": f"Your {skill} band ({band}) has room for improvement. Target specific question types and practice timed exercises.",
                "priority": priority,
            })
        else:
            priority = "low"
            recommendations.append({
                "category": skill,
                "message": f"Your {skill} band ({band}) is strong. Maintain consistency and work on eliminating minor errors.",
                "priority": priority,
            })

    overall = calculate_overall_band(listening_band, reading_band, writing_band, speaking_band)
    if overall < 6.0:
        recommendations.append({
            "category": "Overall",
            "message": "Consider intensifying your study schedule. Focus on your weakest skill first, then distribute practice evenly.",
            "priority": "high",
        })
    elif overall < 7.0:
        recommendations.append({
            "category": "Overall",
            "message": "You are progressing well. Target your weakest section for focused improvement to reach your target band.",
            "priority": "medium",
        })

    return recommendations


def calculate_performance_summary(
    listening_score: int, listening_total: int,
    reading_score: int, reading_total: int,
    question_results: list[dict]
) -> dict:
    total_correct = sum(1 for r in question_results if r.get("is_correct"))
    total_questions = len(question_results)
    total_skipped = sum(1 for r in question_results if r.get("is_skipped", False))

    section_stats = {}
    for r in question_results:
        sec = r.get("section", "unknown")
        if sec not in section_stats:
            section_stats[sec] = {"correct": 0, "total": 0, "skipped": 0}
        section_stats[sec]["total"] += 1
        if r.get("is_correct"):
            section_stats[sec]["correct"] += 1
        if r.get("is_skipped"):
            section_stats[sec]["skipped"] += 1

    return {
        "total_correct": total_correct,
        "total_questions": total_questions,
        "total_skipped": total_skipped,
        "accuracy": round(total_correct / max(total_questions, 1) * 100, 1),
        "section_stats": section_stats,
    }
