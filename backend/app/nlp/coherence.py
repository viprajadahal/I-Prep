import re


class CoherenceAnalyzer:
    @staticmethod
    def analyze(text: str) -> dict:
        paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
        if not paragraphs:
            paragraphs = [text.strip()]

        sentences = re.split(r"[.!?]+", text)
        sentences = [s.strip() for s in sentences if s.strip()]

        if not sentences:
            return {
                "transition_score": 0.0,
                "paragraph_structure_score": 0.0,
                "logical_flow_score": 0.0,
                "paragraph_feedback": [],
                "score": 0.0,
            }

        transition_words = {
            "however", "moreover", "furthermore", "additionally",
            "consequently", "therefore", "nevertheless", "nonetheless",
            "alternatively", "conversely", "in contrast", "on the other hand",
            "in addition", "as a result", "for instance", "for example",
            "in conclusion", "to summarize", "firstly", "secondly",
            "thirdly", "finally", "subsequently", "meanwhile",
            "simultaneously", "otherwise", "thus", "hence", "indeed",
            "specifically", "in particular", "accordingly", "evidently",
            "obviously", "clearly",
        }

        transition_count = 0
        for sentence in sentences:
            words = re.findall(r"\b[a-zA-Z]+\b", sentence.lower())
            for word in words:
                if word in transition_words:
                    transition_count += 1

        sentence_count = len(sentences)
        transition_score = min(transition_count / max(sentence_count / 3, 1) * 100, 100) if sentence_count > 0 else 0

        paragraph_count = len(paragraphs)
        if paragraph_count >= 3:
            para_structure_score = min(paragraph_count / 5 * 100, 100)
        elif paragraph_count == 2:
            para_structure_score = 50.0
        else:
            para_structure_score = 25.0

        avg_para_length = sum(len(p.split()) for p in paragraphs) / paragraph_count if paragraph_count > 0 else 0
        if avg_para_length >= 40 and avg_para_length <= 100:
            length_score = 100.0
        elif avg_para_length >= 20 and avg_para_length <= 150:
            length_score = 70.0
        else:
            length_score = 40.0

        logical_flow_score = length_score * 0.6 + transition_score * 0.4

        paragraph_feedback = []
        for i, para in enumerate(paragraphs):
            para_words = re.findall(r"\b[a-zA-Z]+\b", para)
            para_word_count = len(para_words)
            para_sentences = re.split(r"[.!?]+", para)
            para_sentences = [s.strip() for s in para_sentences if s.strip()]
            para_transitions = sum(
                1 for s in para_sentences
                for w in re.findall(r"\b[a-zA-Z]+\b", s.lower())
                if w in transition_words
            )

            issues = []
            if para_word_count < 20:
                issues.append("Too short — expand this paragraph")
            elif para_word_count > 150:
                issues.append("Too long — consider splitting into two paragraphs")

            if len(para_sentences) < 2:
                issues.append("Only one sentence — add more detail or explanation")

            if i > 0 and para_transitions == 0:
                issues.append("Consider adding a transition word to connect with the previous paragraph")

            if i == 0 and para_word_count > 80:
                issues.append("Introduction may be too long — keep it concise")

            if i == len(paragraphs) - 1 and paragraph_count > 1:
                has_conclusion_signal = any(
                    w in para.lower() for w in [
                        "in conclusion", "to conclude", "overall", "in summary",
                        "to summarize", "in summary", "all in all", "to sum up",
                    ]
                )
                if not has_conclusion_signal:
                    issues.append("Conclusion lacks a signal phrase (e.g., 'In conclusion')")

            paragraph_feedback.append({
                "paragraph_number": i + 1,
                "word_count": para_word_count,
                "sentence_count": len(para_sentences),
                "transition_count": para_transitions,
                "issues": issues,
                "ok": len(issues) == 0,
            })

        overall = (
            transition_score * 0.30
            + para_structure_score * 0.30
            + logical_flow_score * 0.40
        )

        return {
            "transition_score": round(transition_score, 2),
            "paragraph_structure_score": round(para_structure_score, 2),
            "logical_flow_score": round(logical_flow_score, 2),
            "paragraph_feedback": paragraph_feedback,
            "score": round(overall, 2),
        }
