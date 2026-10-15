"""Narrow local caller for Root-reviewed R4 queue admission.

This module serializes the operation grant already verified by the trusted Root
operator. It is not a human-authentication provider and does not dispatch work.
The existing bridge remains responsible for STOP, lease, TaskSpec, predecessor,
one-use nonce, and durable reservation checks.
"""
from native_receipt_bridge import (
    NativeReceiptBridge,
    NativeWorkAuthorization,
    NativeWorkRequest,
)


R4_OPERATION_ID = "f90f55bc-48d8-406f-a11e-05ddd2683014"
R4_OPERATION_NONCE = "planned-browser-009625eb-36ea-47cc-830c-7957aa96a4d4"
R4_PLAN_SHA256 = "29c436fab49dc85b6797022e41708e44ccbd9cf997fd2b9127849a09c823b65b"
R4_OPERATION_GRANT = "user:01a13cc1-12e9-79a0-97e8-4899f05a5c95:R4-20261014"
R4_SETUP_GRANT = "user:01a13cc1-12e9-79a0-97e8-4899f05a5c95:setup-R4-autonomia-20261014"
R4_REPOSITORY = "onia-hermes"
R4_REF = "codex/orquestacion-subagentes-20261013"
R4_HEAD = "0e01dc094184ea479ea032a75be1250f8def1b48"
LOCAL_AUTHORIZATION_TTL_SECONDS = 900


class RootReviewedR4Authority:
    """Authority for only the operation grant Root already verified in-chat."""

    def verify(self, request: NativeWorkRequest, now: int) -> NativeWorkAuthorization:
        if type(request) is not NativeWorkRequest:
            raise ValueError("Root R4 authority requires the typed work request")
        if (request.operation_id != R4_OPERATION_ID
                or request.nonce != R4_OPERATION_NONCE
                or request.plan_sha != R4_PLAN_SHA256
                or request.repo != R4_REPOSITORY
                or request.ref != R4_REF
                or request.head != R4_HEAD
                or request.approval_claim_ref != R4_OPERATION_GRANT
                or request.max_status_events != 2
                or request.max_result_events != 1):
            raise ValueError("request differs from Root-reviewed R4 pins")
        if type(now) is not int or now < 0:
            raise ValueError("invalid local authorization time")
        return NativeWorkAuthorization(
            verified=True,
            request_sha=request.digest(),
            grant_nonce=R4_OPERATION_NONCE,
            actor="root-verified-human-grant",
            authority_source="root-reviewed-r4-operation-grant",
            evidence_ref=R4_OPERATION_GRANT,
            expires_at=now + LOCAL_AUTHORIZATION_TTL_SECONDS,
        )


def authorize_and_reserve_root_r4(
    bridge: NativeReceiptBridge,
    claim,
    request: NativeWorkRequest,
    now: int,
) -> str:
    """Use the canonical finite-work API; never reset or rewrite bootstrap.

    `claim` and `request` must come from the local controller, not task-produced
    JSON. The operation grant is pinned independently; the request's grant field
    is checked only for consistency. No queue write occurs until the existing
    bridge validates STOP, lease, exact TaskSpec, and terminal predecessor.
    """
    if (type(request) is not NativeWorkRequest
            or getattr(claim, "task_id", None) != request.task_id
            or getattr(claim, "worker_id", None) != request.worker_id):
        raise ValueError("request does not match controller claim")
    return bridge.authorize_and_reserve_work(
        claim, request, RootReviewedR4Authority(), now
    )


def revalidate_reserved_root_r4(
    bridge: NativeReceiptBridge,
    request: NativeWorkRequest,
    now: int,
) -> dict:
    """Revalidate the same reserved R4 grant once; never create a new claim."""
    if type(request) is not NativeWorkRequest:
        raise ValueError("Root R4 revalidation requires the exact typed request")
    return bridge.revalidate_reserved_work(request, RootReviewedR4Authority(), now)
