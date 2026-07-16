import re
from collections import Counter

ADVANCED_VOCAB = {
    "abundant", "accommodate", "accomplish", "acquire", "adequate", "advocate",
    "alleviate", "ambiguous", "anticipate", "apprehensive", "articulate",
    "augment", "benevolent", "cacophony", "capacious", "collaborate",
    "comprehensive", "conundrum", "contemplate", "contend", "conundrum",
    "convey", "culminate", "debilitate", "deliberate", "delineate",
    "detrimental", "diminutive", "disseminate", "elaborate", "elicit",
    "emancipate", "encompass", "endorse", "exacerbate", "exemplify",
    "facilitate", "fluctuate", "formidable", "harbinger", "implement",
    "inadvertent", "incongruous", "indigenous", "indispensable", "integrate",
    "juxtaposition", "meticulous", "mitigate", "negate", "notorious",
    "obscure", "paradigm", "perpetuate", "pragmatic", "profound",
    "propagate", "quintessential", "reconcile", "relegate", "scrutinize",
    "solicit", "substantiate", "succinct", "superfluous", "tangible",
    "tenacious", "ubiquitous", "viable", "volatile", "warrant",
    "prevalent", "catalyst", "dichotomy", "empirical", "extraneous",
    "impede", "intrinsic", "malleable", "nuance", "ostracize",
    "pertinent", "resilient", "salient", "transcend", "unprecedented",
    "versatile", "aesthetic", "benevolent", "consecutive", "detrimental",
    "efficacious", "gratify", "heterogeneous", "implication", "legitimate",
    "mandate", "optimization", "paramount", "repercussion", "subsequent",
    "terminology", "vindicate", "widespread", "acknowledge", "assess",
    "attribute", "coherent", "consequence", "demonstrate", "enhance",
    "fundamental", "illustrate", "methodology", "perspective", "phenomenon",
    "significant", "theoretical", "vary", "complement", "constitute",
    "derive", "distinct", "evaluate", "inevitable", "predominant",
    "principal", "relevant", "sufficient", "transform", "undertake",
    "abstract", "accumulate", "allocate", "approximate", "circumstance",
    "component", "controversial", "correspond", "criteria", "deviate",
    "dominate", "emerge", "emphasize", "exclude", "exploit", "generate",
    "hypothesis", "identify", "indicate", "investigate", "manifest",
    "modify", "necessitate", "parallel", "perceive", "proportion",
    "regulate", "stimulate", "submit", "terminate", "validate",
}

TRANSITION_WORDS = {
    "however", "moreover", "furthermore", "additionally", "consequently",
    "therefore", "nevertheless", "nonetheless", "alternatively",
    "conversely", "in contrast", "on the other hand", "in addition",
    "as a result", "for instance", "for example", "in conclusion",
    "to summarize", "firstly", "secondly", "thirdly", "finally",
    "subsequently", "meanwhile", "simultaneously", "otherwise",
    "thus", "hence", "indeed", "specifically", "in particular",
    "accordingly", "evidently", "obviously", "clearly",
}


class VocabularyAnalyzer:
    @staticmethod
    def analyze(text: str) -> dict:
        words = re.findall(r"\b[a-zA-Z]+\b", text.lower())
        word_count = len(words)
        unique_words = set(words)
        unique_word_count = len(unique_words)

        if word_count == 0:
            return {
                "word_count": 0,
                "unique_word_count": 0,
                "type_token_ratio": 0.0,
                "average_sentence_length": 0.0,
                "sentence_count": 0,
                "advanced_vocab_count": 0,
                "advanced_vocab_percentage": 0.0,
                "repeated_words": [],
                "score": 0.0,
            }

        type_token_ratio = unique_word_count / word_count if word_count > 0 else 0.0

        sentences = re.split(r"[.!?]+", text)
        sentences = [s.strip() for s in sentences if s.strip()]
        sentence_count = len(sentences)

        avg_sentence_length = word_count / sentence_count if sentence_count > 0 else 0.0

        advanced_found = [w for w in unique_words if w in ADVANCED_VOCAB]
        advanced_count = len(advanced_found)
        advanced_percentage = (advanced_count / unique_word_count * 100) if unique_word_count > 0 else 0.0

        word_freq = Counter(words)
        repeated = [
            {"word": w, "count": c}
            for w, c in word_freq.items()
            if c > 2 and len(w) > 3
        ]

        ttr_score = min(type_token_ratio / 0.7 * 40, 40)
        adv_score = min(advanced_percentage / 15 * 30, 30)
        length_score = min(max(0, 30 - abs(avg_sentence_length - 15) * 2), 30)
        score = round(ttr_score + adv_score + length_score, 2)

        return {
            "word_count": word_count,
            "unique_word_count": unique_word_count,
            "type_token_ratio": round(type_token_ratio, 4),
            "average_sentence_length": round(avg_sentence_length, 2),
            "sentence_count": sentence_count,
            "advanced_vocab_count": advanced_count,
            "advanced_vocab_percentage": round(advanced_percentage, 2),
            "repeated_words": repeated,
            "score": score,
        }