import re


class TaskAchievementAnalyzer:
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
                           "in summary", "overall", "in summary", "all in all",
                           "to sum up", "in closing"]
            ) if paragraphs else False
            if has_intro:
                structure_score += 15.0
            if has_conclusion:
                structure_score += 15.0

        structure_score = min(100.0, structure_score)

        overall = (
            length_score * 0.30
            + topic_score * 0.40
            + structure_score * 0.30
        )

        return {
            "score": round(overall, 2),
            "length_score": round(length_score, 2),
            "topic_coverage_score": round(topic_score, 2),
            "structure_score": round(structure_score, 2),
            "word_count": word_count,
            "min_words": min_words,
            "meets_word_count": word_count >= min_words,
        }
