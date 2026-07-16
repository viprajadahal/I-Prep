import re
import language_tool_python


class GrammarChecker:
    _tool = None

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

        if tool is not None:
            try:
                matches = tool.check(text)
                errors = []
                for match in matches:
                    errors.append({
                        "message": match.ruleIssueMsg,
                        "rule": match.ruleId,
                        "suggestion": match.replacements[0] if match.replacements else "",
                        "offset": match.offset,
                        "length": match.errorLength,
                    })
            except Exception:
                errors = cls._basic_grammar_check(text)
        else:
            errors = cls._basic_grammar_check(text)

        error_count = len(errors)
        word_count = len(text.split())
        if word_count == 0:
            score = 100.0
        else:
            error_rate = error_count / word_count
            score = max(0.0, min(100.0, 100.0 - (error_rate * 500)))

        return {
            "score": round(score, 2),
            "errors": errors,
            "error_count": error_count,
        }

    @staticmethod
    def _basic_grammar_check(text: str) -> list:
        errors = []

        sentences = re.split(r'[.!?]+', text)
        for i, sentence in enumerate(sentences):
            sentence = sentence.strip()
            if not sentence:
                continue

            offset = text.find(sentence)

            if sentence and sentence[0].islower() and i > 0:
                errors.append({
                    "message": "Sentence should start with a capital letter",
                    "rule": "capitalization",
                    "suggestion": sentence[0].upper() + sentence[1:],
                    "offset": offset,
                    "length": 1,
                })

            double_spaces = re.finditer(r'  +', sentence)
            for match in double_spaces:
                errors.append({
                    "message": "Extra whitespace detected",
                    "rule": "whitespace",
                    "suggestion": " ",
                    "offset": offset + match.start(),
                    "length": match.end() - match.start(),
                })

            missing_period = i < len(sentences) - 1 and not text[text.find(sentence) + len(sentence):text.find(sentence) + len(sentence) + 1] in '.!?'
            if not missing_period and sentence and not text.endswith(sentence.strip()):
                pass

        pattern_no_comma_and = re.finditer(r'\b[A-Za-z]+ and [A-Za-z]+ and\b', text)
        for match in pattern_no_comma_and:
            errors.append({
                "message": "Consider using commas in a list of three or more items",
                "rule": "comma_list",
                "suggestion": match.group().replace(" and", ", and", 1),
                "offset": match.start(),
                "length": match.end() - match.start(),
            })

        words = re.findall(r'\b[A-Za-z]+\b', text)
        seen = {}
        for j, word in enumerate(words):
            w_lower = word.lower()
            if w_lower in seen and len(seen[w_lower]) < 3:
                seen[w_lower].append(j)
            elif w_lower not in seen:
                seen[w_lower] = [j]

        return errors