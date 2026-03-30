import threading
from collections import deque
from statistics import mean
from typing import Any, Dict


class MetricsService:
    """In-memory telemetry for RAG quality and latency signals."""

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._total_requests = 0
        self._error_requests = 0
        self._decomposition_used = 0
        self._language_counts: Dict[str, int] = {"en": 0, "hi": 0}
        self._confidence_buckets: Dict[str, int] = {
            "low": 0,
            "medium": 0,
            "high": 0,
        }
        self._retrieved_doc_counts: deque[int] = deque(maxlen=200)
        self._context_sizes: deque[int] = deque(maxlen=200)
        self._latency_ms: deque[float] = deque(maxlen=200)

    @staticmethod
    def _confidence_bucket(confidence: float) -> str:
        if confidence < 0.5:
            return "low"
        if confidence < 0.8:
            return "medium"
        return "high"

    def record_success(
        self,
        *,
        latency_ms: float,
        decomposition_used: bool,
        retrieved_doc_count: int,
        context_chars: int,
        confidence: float,
        preferred_language: str,
    ) -> None:
        with self._lock:
            self._total_requests += 1
            if decomposition_used:
                self._decomposition_used += 1
            if preferred_language in self._language_counts:
                self._language_counts[preferred_language] += 1
            else:
                self._language_counts[preferred_language] = 1

            self._confidence_buckets[self._confidence_bucket(confidence)] += 1
            self._retrieved_doc_counts.append(retrieved_doc_count)
            self._context_sizes.append(context_chars)
            self._latency_ms.append(latency_ms)

    def record_error(self) -> None:
        with self._lock:
            self._total_requests += 1
            self._error_requests += 1

    def snapshot(self) -> Dict[str, Any]:
        with self._lock:
            total = self._total_requests
            success = total - self._error_requests
            decomposition_rate = (
                float(self._decomposition_used) / success if success > 0 else 0.0
            )
            return {
                "total_requests": total,
                "successful_requests": success,
                "error_requests": self._error_requests,
                "decomposition_used_requests": self._decomposition_used,
                "decomposition_rate": round(decomposition_rate, 4),
                "language_counts": dict(self._language_counts),
                "confidence_buckets": dict(self._confidence_buckets),
                "avg_retrieved_docs": round(mean(self._retrieved_doc_counts), 2)
                if self._retrieved_doc_counts
                else 0.0,
                "avg_context_chars": round(mean(self._context_sizes), 2)
                if self._context_sizes
                else 0.0,
                "avg_latency_ms": round(mean(self._latency_ms), 2)
                if self._latency_ms
                else 0.0,
            }


metrics_service = MetricsService()
