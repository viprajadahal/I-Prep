import re

QUESTION_PATTERNS = {
    "opinion": {
        "keywords": [
            "agree or disagree", "to what extent", "what is your opinion",
            "what is your view", "do you agree", "do you think",
            "what do you think", "express your opinion",
        ],
    },
    "discussion": {
        "keywords": [
            "discuss both", "advantages and disadvantages", "pros and cons",
            "benefits and drawbacks", "positive and negative",
            "advantages and drawbacks", "merits and demerits",
            "strengths and weaknesses",
        ],
    },
    "problem_solution": {
        "keywords": [
            "problem", "solution", "cause", "effect", "challenge",
            "what problems", "what measures", "how to address",
            "how to solve", "what can be done",
        ],
    },
    "complaint_letter": {
        "keywords": [
            "complain", "dissatisfied", "disappointed", "faulty",
            "damaged", "poor service", "unhappy with", "unsatisfactory",
        ],
    },
    "request_letter": {
        "keywords": [
            "i am writing to request", "ask for", "apply for", "application",
            "would like to request", "could you please",
        ],
    },
    "apology_letter": {
        "keywords": [
            "apologise", "apologize", "sorry", "apology",
            "i am writing to apologise",
        ],
    },
    "suggestion_letter": {
        "keywords": [
            "suggest", "recommend", "proposal", "i would like to suggest",
            "improvement", "how to improve",
        ],
    },
    "information_letter": {
        "keywords": [
            "enquire", "inquire", "information about", "i would like to know",
            "i am writing to enquire", "request information",
            "details about", "further information",
        ],
    },
}

RESPONSE_MARKERS = {
    "opinion": [
        "i agree", "i disagree", "in my opinion", "i believe", "i think",
        "from my perspective", "it seems to me", "i am convinced",
        "my view is", "personally",
    ],
    "discussion": [
        "on the one hand", "on the other hand", "however", "while some",
        "although", "some people argue", "others believe",
        "advantages", "disadvantages", "on the contrary",
        "there are both", "it can be argued",
    ],
    "problem_solution": [
        "problem", "solution", "to solve", "to address", "measure",
        "overcome", "resolve", "one way", "another way",
        "this can be", "should be done",
    ],
    "complaint_letter": [
        "dear sir", "dear madam", "i am writing", "complain",
        "disappointed", "refund", "replace", "dissatisfied",
        "i was", "the product", "poor quality", "damaged",
        "i would appreciate", "yours faithfully", "yours sincerely",
    ],
    "request_letter": [
        "dear", "i am writing", "request", "would be grateful",
        "could you please", "i would like", "if possible",
        "thank you", "look forward",
    ],
    "apology_letter": [
        "dear", "i am writing", "apologise", "apologize", "sorry",
        "my sincere", "i regret", "please accept", "yours sincerely",
    ],
    "suggestion_letter": [
        "dear", "i am writing", "suggest", "recommend", "propose",
        "i would like to", "it would be", "improve", "yours faithfully",
    ],
    "information_letter": [
        "dear", "i am writing", "enquire", "inquire", "information",
        "i would like to know", "could you", "please send",
        "thank you", "look forward",
    ],
}


class TaskAchievementAnalyzer:
    @staticmethod
    def detect_question_type(prompt_text: str, task_type: str) -> str | None:
        prompt_lower = prompt_text.lower()
        scores = {}
        if "Task 1" in task_type:
            for qtype, patterns in QUESTION_PATTERNS.items():
                if qtype.endswith("_letter"):
                    count = sum(1 for kw in patterns["keywords"] if kw in prompt_lower)
                    if count > 0:
                        scores[qtype] = count
            if scores:
                return max(scores, key=scores.get)
            return "general_letter"
        for qtype, patterns in QUESTION_PATTERNS.items():
            if not qtype.endswith("_letter"):
                count = sum(1 for kw in patterns["keywords"] if kw in prompt_lower)
                if count > 0:
                    scores[qtype] = count
        if scores:
            return max(scores, key=scores.get)
        return None

    @staticmethod
    def analyze(text: str, prompt_text: str, task_type: str) -> dict:
        words = re.findall(r"\b[a-zA-Z]+\b", text)
        word_count = len(words)

        min_words = 150 if "Task 1" in task_type else 250

        length_score = 0.0
        if word_count >= min_words:
            length_score = min(100.0, 60.0 + (word_count - min_words) / min_words * 40.0)
        elif word_count >= min_words * 0.8:
            length_score = 40.0 + (word_count / min_words) * 20.0
        else:
            length_score = max(0.0, word_count / min_words * 40.0)

        prompt_keywords = set(
            w.lower()
            for w in re.findall(r"\b[a-zA-Z]{3,}\b", prompt_text)
            if w.lower()
            not in {
                "the", "and", "for", "are", "but", "not", "you", "all",
                "can", "had", "her", "was", "one", "our", "out", "day",
                "get", "has", "him", "his", "how", "its", "may", "new",
                "now", "old", "see", "way", "who", "did", "got", "let",
                "say", "she", "too", "use", "this", "that", "with",
                "have", "from", "they", "been", "said", "each", "make",
                "like", "than", "them", "then", "what", "when", "your",
                "will", "would", "there", "their", "about", "which",
                "were", "other", "into", "some", "more", "also", "just",
                "should", "could", "only", "very", "most", "over", "such",
                "after", "before", "between", "while", "where", "these",
                "those", "being", "both", "does", "during", "without",
                "again", "further", "above", "below", "same", "through",
                "first", "second", "third", "many", "much", "few",
            }
        )

        essay_lower = text.lower()
        essay_words = set(w.lower() for w in re.findall(r"\b[a-zA-Z]{3,}\b", essay_lower))

        if prompt_keywords:
            matched = prompt_keywords & essay_words
            coverage = len(matched) / len(prompt_keywords)
        else:
            coverage = 0.5

        topic_score = min(100.0, coverage * 100.0 * 1.5)

        sentences = re.split(r"[.!?]+", text)
        sentences = [s.strip() for s in sentences if s.strip()]
        sentence_count = len(sentences) if sentences else 1

        paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
        paragraph_count = len(paragraphs) if paragraphs else 1

        structure_score = 0.0
        if paragraph_count >= 3:
            structure_score += 40.0
        elif paragraph_count >= 2:
            structure_score += 25.0
        else:
            structure_score += 10.0

        if sentence_count >= 6:
            structure_score += 30.0
        elif sentence_count >= 4:
            structure_score += 20.0
        else:
            structure_score += 10.0

        if "Task 2" in task_type:
            has_intro = any(
                w in paragraphs[0].lower()
                for w in ["opinion", "agree", "disagree", "discuss", "advantage",
                           "disadvantage", "problem", "solution", "cause", "effect",
                           "this essay", "in this", "i believe", "i think", "it is"]
            ) if paragraphs else False
            has_conclusion = any(
                w in paragraphs[-1].lower()
                for w in ["conclusion", "in conclusion", "to conclude", "to summarize",
                           "in summary", "overall", "all in all",
                           "to sum up", "in closing"]
            ) if paragraphs else False
            if has_intro:
                structure_score += 15.0
            if has_conclusion:
                structure_score += 15.0
        else:
            comparison_words = {"while", "whereas", "compared", "in contrast",
                                "on the other hand", "however", "differently",
                                "difference", "different", "unchanged",
                                "remained", "stayed", "still", "similar",
                                "similarly", "likewise", "both", "neither",
                                "previously", "originally", "formerly",
                                "before", "after", "later", "subsequently",
                                "over the", "during the", "between",
                                "transformed", "converted", "replaced",
                                "converted", "turned into", "became",
                                "instead of", "rather than"}
            comparison_found = sum(1 for w in comparison_words if w in text.lower())
            comparison_score = min(20.0, comparison_found * 3)
            structure_score += comparison_score

        structure_score = min(100.0, structure_score)

        question_type = None
        format_score = 50.0
        if prompt_text:
            question_type = TaskAchievementAnalyzer.detect_question_type(prompt_text, task_type)
            if question_type and question_type in RESPONSE_MARKERS:
                markers = RESPONSE_MARKERS[question_type]
                matched_markers = sum(1 for m in markers if m in essay_lower)
                marker_ratio = matched_markers / len(markers)
                format_score = min(100.0, marker_ratio * 150)

        overall = (
            length_score * 0.25
            + topic_score * 0.30
            + structure_score * 0.20
            + format_score * 0.25
        )

        result = {
            "score": round(overall, 2),
            "length_score": round(length_score, 2),
            "topic_coverage_score": round(topic_score, 2),
            "structure_score": round(structure_score, 2),
            "word_count": word_count,
            "min_words": min_words,
            "meets_word_count": word_count >= min_words,
            "question_type": question_type,
            "format_score": round(format_score, 2),
        }

        return result
