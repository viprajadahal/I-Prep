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

        overall = (
            transition_score * 0.30
            + para_structure_score * 0.30
            + logical_flow_score * 0.40
        )

        return {
            "transition_score": round(transition_score, 2),
            "paragraph_structure_score": round(para_structure_score, 2),
            "logical_flow_score": round(logical_flow_score, 2),
            "score": round(overall, 2),
        }