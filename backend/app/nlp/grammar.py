import re
import language_tool_python
from app.nlp.vocabulary import COMMON_ENGLISH_WORDS, ADVANCED_VOCAB


class GrammarChecker:
    _tool = None
    _WORD_LIST = None

    @classmethod
    def get_word_list(cls):
        if cls._WORD_LIST is None:
            cls._WORD_LIST = COMMON_ENGLISH_WORDS | ADVANCED_VOCAB
        return cls._WORD_LIST

    @classmethod
    def get_tool(cls):
        if cls._tool is None:
            try:
                cls._tool = language_tool_python.LanguageTool("en-US")
            except Exception:
                cls._tool = None
        return cls._tool

    @classmethod
    def check_grammar(cls, text: str) -> dict:
        tool = cls.get_tool()
        errors = []

        if tool is not None:
            try:
                matches = tool.check(text)
                for match in matches:
                    errors.append({
                        "message": match.ruleIssueMsg,
                        "rule": match.ruleId,
                        "suggestion": match.replacements[0] if match.replacements else "",
                        "offset": match.offset,
                        "length": match.errorLength,
                    })
            except Exception:
                pass

        errors.extend(cls._mechanical_check(text))

        error_count = len(errors)
        word_count = len(text.split())
        if word_count == 0:
            score = 100.0
            grammar_range_score = 0.0
        else:
            error_rate = error_count / word_count
            score = max(0.0, min(100.0, 100.0 - (error_rate * 1200)))

            sentences = re.split(r"[.!?]+", text)
            sentences = [s.strip() for s in sentences if s.strip()]
            sentence_count = len(sentences) if sentences else 1

            passive_count = len(re.findall(r"\b(?:is|are|was|were|been|being)\s+\w+ed\b", text, re.IGNORECASE))
            has_passive = 20 if passive_count >= 3 else 12 if passive_count >= 1 else 0

            modals = len(re.findall(r"\b(?:can|could|may|might|will|would|shall|should|must|ought)\b", text, re.IGNORECASE))
            has_modals = 15 if modals >= 4 else 8 if modals >= 2 else 0

            relative = len(re.findall(r"\b(?:which|that|who|whom|whose)\b", text, re.IGNORECASE))
            subord = len(re.findall(r"\b(?:because|although|while|whereas|when|where|if|unless|since|though)\b", text, re.IGNORECASE))
            total_clause_markers = relative + subord
            has_clauses = 25 if total_clause_markers >= 8 else 15 if total_clause_markers >= 4 else 5 if total_clause_markers >= 1 else 0

            ing_participle = len(re.findall(r",\s+\w+ing\b", text, re.IGNORECASE))
            ed_participle = len(re.findall(r",\s+\w+ed\b", text, re.IGNORECASE))
            participles = 15 if (ing_participle + ed_participle) >= 2 else 8 if (ing_participle + ed_participle) >= 1 else 0

            sentence_var = 25
            if sentence_count >= 5:
                lengths = [len(re.findall(r"\b[a-zA-Z]+\b", s)) for s in sentences]
                if lengths:
                    avg = sum(lengths) / len(lengths)
                    variance = sum((l - avg) ** 2 for l in lengths) / len(lengths)
                    if variance >= 30:
                        sentence_var = 25
                    elif variance >= 15:
                        sentence_var = 15
                    else:
                        sentence_var = 5

            grammar_range_score = has_passive + has_modals + has_clauses + participles + sentence_var

        return {
            "score": round(score, 2),
            "errors": errors,
            "error_count": error_count,
            "grammar_range_score": grammar_range_score,
        }

    @staticmethod
    def _mechanical_check(text: str) -> list:
        errors = []
        WORD_LIST = COMMON_ENGLISH_WORDS | ADVANCED_VOCAB
        VOWELS = set("aeiouy")

        sentence_runs = []
        raw = re.split(r'(?<=[.!?])\s+', text)
        pos = 0
        for part in raw:
            part = part.strip()
            if not part:
                pos += len(part) + 1
                continue
            offset = text.find(part, pos)
            if offset < 0:
                offset = pos
            sentence_runs.append((part, offset))
            pos = offset + len(part)

        if not sentence_runs:
            stripped = text.strip()
            if stripped:
                sentence_runs.append((stripped, text.find(stripped)))

        for s, offset in sentence_runs:
            s_stripped = s.strip()
            if not s_stripped:
                continue

            if s_stripped[0].islower():
                errors.append({
                    "message": "Sentence should start with a capital letter",
                    "rule": "capitalization",
                    "suggestion": s_stripped[0].upper() + s_stripped[1:],
                    "offset": offset,
                    "length": 1,
                })

            if s_stripped[-1] not in '.!?':
                errors.append({
                    "message": "Sentence should end with a period, question mark, or exclamation mark",
                    "rule": "missing_punctuation",
                    "suggestion": s_stripped + ".",
                    "offset": offset + len(s_stripped) - 1,
                    "length": 0,
                })

            for m in re.finditer(r'  +', s_stripped):
                errors.append({
                    "message": "Extra whitespace detected",
                    "rule": "whitespace",
                    "suggestion": " ",
                    "offset": offset + m.start(),
                    "length": m.end() - m.start(),
                })

        for m in re.finditer(r':', text):
            pos = m.start()
            if pos > 0 and pos < len(text) - 1:
                before = text[pos - 1]
                after = text[pos + 1]
                if before.isalpha() and after.isalpha():
                    errors.append({
                        "message": "Colon should not be used within a word",
                        "rule": "colon_usage",
                        "suggestion": "",
                        "offset": pos,
                        "length": 1,
                    })
                elif after not in (' ', '\n', '\t'):
                    errors.append({
                        "message": "Add a space after the colon",
                        "rule": "colon_spacing",
                        "suggestion": ": ",
                        "offset": pos,
                        "length": 1,
                    })

        words_iter = re.finditer(r'\b[a-zA-Z]+\b', text)
        for m in words_iter:
            word = m.group()
            word_lower = word.lower()
            if len(word) < 4:
                continue
            if word_lower in WORD_LIST:
                continue
            if word[0].isupper():
                in_sentence_start = False
                for s, soff in sentence_runs:
                    if m.start() == soff:
                        in_sentence_start = True
                        break
                if not in_sentence_start:
                    continue
            vowel_count = sum(1 for ch in word_lower if ch in VOWELS)
            vowel_ratio = vowel_count / len(word)
            if vowel_count > 0 and vowel_ratio >= 0.20:
                errors.append({
                    "message": f"Possible spelling error: '{word}' is not recognized",
                    "rule": "spelling",
                    "suggestion": "",
                    "offset": m.start(),
                    "length": len(word),
                })

        return errors
