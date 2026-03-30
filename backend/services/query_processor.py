import re
from typing import List


class QueryProcessor:
    """Lightweight decomposition for multi-intent legal questions."""

    _split_patterns = [
        r"\b(?:and|or|vs|versus|compare|between)\b",
        r"[;|]",
        r"\?\s*",
    ]

    def decompose(self, question: str) -> List[str]:
        cleaned = question.strip()
        if not cleaned:
            return []

        lower_question = cleaned.lower()
        likely_multi_intent = any(
            token in lower_question
            for token in [" and ", " or ", " compare ", " versus ", " vs "]
        )

        if not likely_multi_intent:
            return [cleaned]

        parts = [cleaned]
        for pattern in self._split_patterns:
            next_parts: List[str] = []
            for part in parts:
                split_result = re.split(pattern, part, flags=re.IGNORECASE)
                next_parts.extend(split_result)
            parts = next_parts

        normalized_parts: List[str] = []
        for part in parts:
            compact = " ".join(part.split()).strip(" .,-")
            if len(compact) < 8:
                continue
            normalized_parts.append(compact)

        # Keep decomposition conservative to avoid harming retrieval quality.
        if len(normalized_parts) < 2:
            return [cleaned]

        return list(dict.fromkeys(normalized_parts))[:3]
