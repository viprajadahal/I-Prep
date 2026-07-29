import os
import re
import math
from collections import Counter

_jlt = None

def _get_tool():
    global _jlt
    if _jlt is None:
        backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        jdk_path = os.path.join(backend_dir, "jdk-21.0.2")
        bin_path = os.path.join(jdk_path, "bin")
        java_exe = os.path.join(bin_path, "java.exe")

        if not os.path.isfile(java_exe):
            java_exe = os.path.join(bin_path, "java")

        if os.path.isfile(java_exe):
            os.environ["JAVA_HOME"] = jdk_path
            current_path = os.environ.get("PATH", "")
            if bin_path not in current_path:
                os.environ["PATH"] = bin_path + os.pathsep + current_path
        else:
            raise FileNotFoundError(
                f"Java not found at {java_exe}. "
                "Please install Java JDK and place it in backend/jdk-21.0.2/"
            )

        import language_tool_python
        _jlt = language_tool_python.LanguageTool("en-US")
    return _jlt


TRANSITION_WORDS = {
    "addition": [
        "furthermore", "moreover", "additionally", "in addition",
        "also", "besides", "another", "similarly", "likewise",
    ],
    "contrast": [
        "however", "nevertheless", "nonetheless", "on the other hand",
        "in contrast", "conversely", "although", "despite", "whereas",
        "while", "yet", "but", "instead", "rather",
    ],
    "cause_effect": [
        "therefore", "thus", "hence", "consequently", "as a result",
        "accordingly", "so", "because", "since", "for this reason",
    ],
    "example": [
        "for example", "for instance", "such as", "namely",
        "specifically", "in particular", "to illustrate",
    ],
    "conclusion": [
        "in conclusion", "to conclude", "to summarize", "in summary",
        "overall", "all things considered", "to sum up", "in short",
    ],
    "sequence": [
        "firstly", "secondly", "thirdly", "finally", "lastly",
        "first", "second", "third", "next", "then", "subsequently",
        "previously", "before", "after", "meanwhile",
    ],
}

ACADEMIC_WORDS = {
    "furthermore", "moreover", "consequently", "nevertheless",
    "predominantly", "subsequently", "fundamental", "significant",
    "substantial", "comprehensive", "adequate", "demonstrate",
    "facilitate", "inevitable", "prevalent", "underlying",
    "perspective", "dimension", "phenomenon", "implications",
    "hence", "accordingly", "notably", "inherent", "ubiquitous",
    "detrimental", "advocate", "encompass", "elaborate", "profound",
    "ambiguous", "unprecedented", "paradigm", "empirical", "coherent",
}

INFORMAL_WORDS = {
    "gonna", "wanna", "gotta", "kinda", "sorta", "dunno",
    "yeah", "ok", "okay", "hey", "wow", "stuff", "things",
    "basically", "literally", "totally", "pretty much",
    "kind of", "sort of", "a bunch", "a lot",
}


def analyze_grammar(text: str) -> dict:
    tool = _get_tool()
    matches = tool.check(text)

    issues = []
    categories = Counter()
    for m in matches:
        issue = {
            "message": m.message,
            "category": m.category,
            "rule_id": m.rule_id,
            "context": m.context,
            "suggestions": m.replacements[:3],
            "offset": m.offset,
            "length": m.error_length,
        }
        issues.append(issue)
        categories[m.category] += 1

    error_count = len(issues)
    categories_dict = dict(categories.most_common(10))

    word_count = len(text.split())
    error_density = error_count / max(word_count, 1) * 100

    score = max(1.0, min(10.0,
        10.0
        - (error_density * 2)
        - (min(error_count, 20) * 0.15)
    ))

    return {
        "error_count": error_count,
        "categories": categories_dict,
        "issues": issues[:20],
        "score": round(score, 1),
        "error_density": round(error_density, 2),
    }


def analyze_vocabulary(text: str) -> dict:
    words = re.findall(r"[a-zA-Z']+", text.lower())
    word_count = len(words)
    unique_words = set(words)
    vocab_richness = len(unique_words) / max(word_count, 1)

    bigrams = [f"{words[i]} {words[i+1]}" for i in range(len(words) - 1)]
    bigram_counts = Counter(bigrams)
    repeated_bigrams = {k: v for k, v in bigram_counts.items() if v > 1}

    word_freq = Counter(words)
    hapax_legomena = sum(1 for w, c in word_freq.items() if c == 1)
    hapax_ratio = hapax_legomena / max(word_count, 1)

    academic_found = [w for w in ACADEMIC_WORDS if w in unique_words]
    informal_found = [w for w in INFORMAL_WORDS if w in words]

    word_lengths = [len(w) for w in words]
    avg_word_length = sum(word_lengths) / max(len(word_lengths), 1)

    syllable_counts = [_count_syllables(w) for w in words]
    total_syllables = sum(syllable_counts)
    avg_syllables = total_syllables / max(word_count, 1)

    long_words = [w for w in words if len(w) >= 8]
    long_word_ratio = len(long_words) / max(word_count, 1)

    score = max(1.0, min(10.0,
        5.0
        + (vocab_richness * 5)
        + (long_word_ratio * 2)
        - (len(informal_found) * 0.5)
        + (min(len(academic_found), 5) * 0.3)
    ))

    return {
        "word_count": word_count,
        "unique_words": len(unique_words),
        "vocabulary_richness": round(vocab_richness * 100, 1),
        "lexical_diversity": round(hapax_ratio * 100, 1),
        "academic_words_used": academic_found[:15],
        "informal_words_found": informal_found,
        "repeated_phrases": {k: v for k, v in list(repeated_bigrams.items())[:5]},
        "avg_word_length": round(avg_word_length, 1),
        "avg_syllables_per_word": round(avg_syllables, 2),
        "complex_word_ratio": round(long_word_ratio * 100, 1),
        "score": round(score, 1),
    }


def analyze_coherence(text: str) -> dict:
    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]
    paragraph_count = max(len(paragraphs), 1)

    sentences = re.split(r"[.!?]+", text)
    sentences = [s.strip() for s in sentences if s.strip()]
    sentence_count = max(len(sentences), 1)

    text_lower = text.lower()
    transitions_found = {}
    total_transitions = 0
    for category, words in TRANSITION_WORDS.items():
        found = [w for w in words if w in text_lower]
        if found:
            transitions_found[category] = found
            total_transitions += len(found)

    sentences_per_paragraph = sentence_count / paragraph_count

    para_lengths = []
    for p in paragraphs:
        para_word_count = len(p.split())
        para_lengths.append(para_word_count)

    para_consistency = 0
    if len(para_lengths) > 1:
        mean_len = sum(para_lengths) / len(para_lengths)
        variance = sum((l - mean_len) ** 2 for l in para_lengths) / len(para_lengths)
        std_dev = math.sqrt(variance)
        para_consistency = max(0, 100 - (std_dev / max(mean_len, 1) * 100))

    has_topic_sentence = 0
    for p in paragraphs:
        first_sentence = re.split(r"[.!?]", p)[0].strip()
        if first_sentence:
            words_in_first = first_sentence.split()
            if len(words_in_first) >= 3:
                has_topic_sentence += 1

    topic_sentence_ratio = has_topic_sentence / paragraph_count

    referencing_words = len(re.findall(
        r"\b(this|that|these|those|it|its|they|them|their|such|which|who|whom)\b",
        text_lower,
    ))

    sentence_lengths = [len(s.split()) for s in sentences]
    length_variation = 0
    if len(sentence_lengths) > 1:
        mean_sl = sum(sentence_lengths) / len(sentence_lengths)
        variance_sl = sum((l - mean_sl) ** 2 for l in sentence_lengths) / len(sentence_lengths)
        std_sl = math.sqrt(variance_sl)
        length_variation = min(100, (std_sl / max(mean_sl, 1)) * 100)

    unique_categories = len(transitions_found)
    score = max(1.0, min(10.0,
        5.0
        + (min(unique_categories, 4) * 0.6)
        + (1.0 if paragraph_count >= 3 else 0)
        + (0.5 if sentences_per_paragraph >= 2 else 0)
        + (0.5 if sentences_per_paragraph <= 6 else 0)
        + (min(total_transitions, 5) * 0.2)
        + (0.3 if topic_sentence_ratio > 0.5 else 0)
        - (1.0 if paragraph_count < 2 else 0)
    ))

    return {
        "paragraph_count": paragraph_count,
        "sentences_per_paragraph": round(sentences_per_paragraph, 1),
        "transitions_used": transitions_found,
        "total_transition_words": total_transitions,
        "unique_transition_categories": unique_categories,
        "topic_sentence_ratio": round(topic_sentence_ratio * 100, 1),
        "referencing_density": round(referencing_words / max(word_count_for_text(text), 1) * 100, 1),
        "paragraph_lengths": para_lengths,
        "para_consistency": round(para_consistency, 1),
        "sentence_length_variation": round(length_variation, 1),
        "score": round(score, 1),
    }


def analyze_task_achievement(text: str, task_number: int) -> dict:
    words = text.split()
    word_count = len(words)

    min_words = 150 if task_number == 1 else 250
    ideal_words = 175 if task_number == 1 else 300
    word_count_met = word_count >= min_words
    word_count_score = min(1.0, word_count / ideal_words)

    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]
    paragraph_count = max(len(paragraphs), 1)

    has_introduction = bool(re.search(
        r"\b(this essay|in my opinion|many people|it is often|there is no doubt|"
        r"i believe|i think|some people|it is widely|the issue of|"
        r"this report|the following|the chart|the graph|the diagram|"
        r"the table|the process|the flow)\b",
        text.lower(),
    ))

    has_conclusion = bool(re.search(
        r"\b(in conclusion|to conclude|in summary|overall|to sum up|"
        r"all things considered|to summarize|in short|to recapitulate|"
        r"overall|in brief)\b",
        text.lower(),
    ))

    has_body = paragraph_count >= 3 or (paragraph_count >= 2 and word_count >= 100)

    sentences = re.split(r"[.!?]+", text)
    sentences = [s.strip() for s in sentences if s.strip()]

    long_sentences = [s for s in sentences if len(s.split()) > 30]
    short_sentences = [s for s in sentences if len(s.split()) < 8]

    word_lower_set = set(w.lower() for w in words)

    if task_number == 1:
        data_words = len(re.findall(
            r"\b(increase|decrease|rise|fall|drop|change|remain|stable|"
            r"fluctuate|peak|trough|high|low|highest|lowest|more|less|"
            r"approximately|roughly|exactly|dramatically|slightly|"
            r"gradually|steadily|sharpest|significant|overall|total|"
            r"average|percent|proportion|figure|number|amount|quantity|"
            r"period|year|month|week|comparison)\b",
            text.lower(),
        ))
        describes_trend = data_words >= 3
        uses_numbers = bool(re.search(r"\d+[%]?", text))
    else:
        data_words = 0
        describes_trend = False
        uses_numbers = False

        opinion_markers = len(re.findall(
            r"\b(i believe|i think|in my opinion|from my perspective|"
            r"i agree|i disagree|i would argue|it seems|in my view|"
            r"i am convinced|personally|from my point of view)\b",
            text.lower(),
        ))
        discusses_both = bool(re.search(
            r"\b(on the one hand|on the other hand|one advantage|"
            r"one disadvantage|however|although|on the contrary|"
            r"some people.*others|while some|others believe)\b",
            text.lower(),
        ))

    structure_score = (
        (1.0 if has_introduction else 0)
        + (1.0 if has_body else 0)
        + (1.0 if has_conclusion else 0)
    )

    min_score = min(1.0, word_count / min_words) if not word_count_met else 1.0

    score = max(1.0, min(10.0,
        5.0
        + (structure_score * 0.8)
        + (min_score * 1.5)
        + (0.5 if paragraph_count >= 3 else 0)
        + (0.3 if len(long_sentences) >= 2 else 0)
        - (0.5 if len(short_sentences) > len(sentences) * 0.5 else 0)
        - (1.0 if word_count < min_words * 0.7 else 0)
    ))

    return {
        "word_count": word_count,
        "min_required": min_words,
        "word_count_met": word_count_met,
        "word_count_score": round(word_count_score * 100, 1),
        "paragraph_count": paragraph_count,
        "has_introduction": has_introduction,
        "has_body": has_body,
        "has_conclusion": has_conclusion,
        "structure_complete": has_introduction and has_body and has_conclusion,
        "sentence_count": len(sentences),
        "long_sentences": len(long_sentences),
        "short_sentences": len(short_sentences),
        "describes_data": describes_trend,
        "uses_numbers": uses_numbers,
        "score": round(score, 1),
    }


def word_count_for_text(text: str) -> int:
    return len(text.split())


def _count_syllables(word: str) -> int:
    word = word.lower().strip()
    if len(word) <= 3:
        return 1
    vowels = "aeiou"
    count = 0
    prev_vowel = False
    for char in word:
        is_vowel = char in vowels
        if is_vowel and not prev_vowel:
            count += 1
        prev_vowel = is_vowel
    if word.endswith("e") and count > 1:
        count -= 1
    if word.endswith("le") and len(word) > 2 and word[-3] not in vowels:
        count += 1
    return max(count, 1)


def run_full_nlp_analysis(text: str, task_number: int) -> dict:
    if not text or not text.strip():
        return {
            "grammar": {"error_count": 0, "categories": {}, "issues": [], "score": 0.0, "error_density": 0.0},
            "vocabulary": {"word_count": 0, "unique_words": 0, "vocabulary_richness": 0.0, "lexical_diversity": 0.0,
                           "academic_words_used": [], "informal_words_found": [], "repeated_phrases": {},
                           "avg_word_length": 0.0, "avg_syllables_per_word": 0.0, "complex_word_ratio": 0.0, "score": 0.0},
            "coherence": {"paragraph_count": 0, "sentences_per_paragraph": 0.0, "transitions_used": {},
                          "total_transition_words": 0, "unique_transition_categories": 0, "topic_sentence_ratio": 0.0,
                          "referencing_density": 0.0, "paragraph_lengths": [], "para_consistency": 0.0,
                          "sentence_length_variation": 0.0, "score": 0.0},
            "task_achievement": {"word_count": 0, "min_required": 150 if task_number == 1 else 250,
                                 "word_count_met": False, "word_count_score": 0.0, "paragraph_count": 0,
                                 "has_introduction": False, "has_body": False, "has_conclusion": False,
                                 "structure_complete": False, "sentence_count": 0, "long_sentences": 0,
                                 "short_sentences": 0, "describes_data": False, "uses_numbers": False, "score": 0.0},
            "suggestions": ["Submit your writing to receive detailed NLP analysis."],
        }

    grammar = analyze_grammar(text)
    vocabulary = analyze_vocabulary(text)
    coherence = analyze_coherence(text)
    task_achievement = analyze_task_achievement(text, task_number)

    suggestions = []
    if grammar["error_count"] > 5:
        suggestions.append(
            f"LanguageTool found {grammar['error_count']} grammar/spelling issues — "
            f"review categories: {', '.join(list(grammar['categories'].keys())[:3])}"
        )
    if vocabulary["vocabulary_richness"] < 50:
        suggestions.append(
            "Vocabulary diversity is low — use more varied vocabulary and avoid repetition"
        )
    if len(vocabulary["informal_words_found"]) > 0:
        suggestions.append(
            f"Found informal words ({', '.join(vocabulary['informal_words_found'][:3])}) — "
            "replace with formal alternatives for IELTS"
        )
    if coherence["unique_transition_categories"] < 2:
        suggestions.append(
            "Use more transition word categories (contrast, cause/effect, addition) "
            "to improve essay flow"
        )
    if not task_achievement["has_introduction"]:
        suggestions.append("Add a clear introduction paragraph to structure your response")
    if not task_achievement["has_conclusion"]:
        suggestions.append("Add a conclusion paragraph to summarize your main points")
    if not task_achievement["word_count_met"]:
        min_req = task_achievement["min_required"]
        suggestions.append(f"Word count ({task_achievement['word_count']}) is below minimum ({min_req})")

    return {
        "grammar": grammar,
        "vocabulary": vocabulary,
        "coherence": coherence,
        "task_achievement": task_achievement,
        "suggestions": suggestions,
    }
