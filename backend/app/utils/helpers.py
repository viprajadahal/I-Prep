import json
import re


def serialize_to_json(data) -> str:
    return json.dumps(data, default=str)


def deserialize_from_json(data_str: str) -> dict | list:
    if not data_str:
        return {}
    return json.loads(data_str)


def count_words(text: str) -> int:
    words = re.findall(r"\b[a-zA-Z]+\b", text)
    return len(words)