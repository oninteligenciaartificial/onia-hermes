"""Hermes API canary contract, deliberately blocked before real HTTP.

This is a synthetic planning fixture, not an adapter to an installed Hermes
process. No credentials, provider URL, SDK, network, or AIAgent are imported.
"""

from dataclasses import dataclass
from typing import Callable, Mapping


SOURCE_SHA = "7166071fca"
PROMPT = "Responde exactamente CANARIO_HERMES_API_OK_20261013. No uses herramientas."
MARKER = "CANARIO_HERMES_API_OK_20261013"


class RealCallBlocked(RuntimeError):
    """Required upstream attempt/cost evidence is absent."""


@dataclass(frozen=True)
class Candidate:
    source_sha: str = SOURCE_SHA
    model_requested: str = "gpt-5-mini"
    api_mode: str = "chat_completions"
    max_iterations: int = 1
    max_tokens_candidate: int = 64
    run_budget_seconds: int = 45
    enabled_toolsets: tuple[str, ...] = ()
    skip_context_files: bool = True
    load_soul_identity: bool = False
    skip_memory: bool = True
    skip_background_review: bool = True

    def synthetic_payload(self) -> Mapping[str, object]:
        """Small public fixture for a fake transport; not a provider request."""
        if self.source_sha != SOURCE_SHA or self.enabled_toolsets:
            raise RealCallBlocked("unreviewed source or toolset")
        return {
            "model_requested": self.model_requested,
            "prompt": PROMPT,
            "tools": [],
            "max_output_candidate": self.max_tokens_candidate,
            "timeout_seconds": self.run_budget_seconds,
        }


class FakeOneAttemptGuard:
    """Unit-test boundary only. Does not control a LiteLLM upstream hop."""

    def __init__(self, fake_send: Callable[[Mapping[str, object]], Mapping[str, object]]):
        self._fake_send = fake_send
        self.attempts = 0

    def send(self, payload: Mapping[str, object]) -> Mapping[str, object]:
        if self.attempts >= 1:
            raise RealCallBlocked("second synthetic transport attempt blocked")
        if payload.get("tools") != [] or payload.get("prompt") != PROMPT:
            raise RealCallBlocked("unreviewed synthetic payload")
        self.attempts += 1
        return self._fake_send(payload)


def real_hermes_call(*_args: object, **_kwargs: object) -> None:
    """Fail before HTTP until proxy upstream and billing controls are proven."""
    raise RealCallBlocked(
        "Hermes AIAgent/proxy upstream retries and fallbacks are not bounded; "
        "provider/model output semantics and cost ceiling remain unverified"
    )
