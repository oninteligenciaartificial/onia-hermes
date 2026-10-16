"""Bounded artifact reader for an ALREADY bound native Cloud chat thread.

No transport, dispatch, authentication provider, scheduler or authority is created.
The trusted in-process caller supplies both an authenticated reader and independently
verified Cloud provenance. Never construct those bindings from agent text/metadata.
Use collect_result ONLY through the existing admitted finite-work result event.
"""
from dataclasses import asdict, dataclass
import hashlib
import json
import re
from typing import Protocol

from native_cloud_cli import _validate_artifact_paths
from native_receipt_bridge import NativeWorkRequest

MAX_ARTIFACT_BYTES = 128 * 1024
_UUID = re.compile(r"[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}\Z")
_SHA = re.compile(r"[0-9a-f]{64}\Z")
_REF = re.compile(r"[A-Za-z0-9][A-Za-z0-9._:-]{0,127}\Z")


@dataclass(frozen=True)
class CloudThreadProvenance:
    """Trusted runtime attestation, NOT a caller/agent assertion of verification.

    The integration must authenticate the thread and independently establish actual
    native cloud execution (not just UUID or host label) before constructing this.
    evidence_ref locates that verification; no credentials or raw transcripts.
    """
    thread_id: str
    host_id: str
    cloud_execution_verified: bool
    evidence_ref: str
    surface: str = "codex_app_chat"


@dataclass(frozen=True)
class ThreadArtifactBytes:
    path: str
    content: bytes
    sha256: str


@dataclass(frozen=True)
class AuthenticatedThreadArtifacts:
    provenance: CloudThreadProvenance
    operation_id: str
    input_sha: str
    observed_head: str
    source_ref: str
    artifacts: tuple[ThreadArtifactBytes, ...]


class AuthenticatedThreadArtifactReader(Protocol):
    def read_artifacts(self, provenance: CloudThreadProvenance,
                       request: NativeWorkRequest, max_bytes: int
                       ) -> AuthenticatedThreadArtifacts:
        """One authenticated read; no retry, fallback, discovery or text scraping.

        Enforce max_bytes while receiving, before allocating an unbounded body.
        Return only explicitly exported allowlisted file bytes with hashes and
        exact provenance/identity. READY, narrative text and metadata are not files.
        Fail closed on timeout, absent artifact, authentication or provenance doubt.
        """
        ...


def validate_provenance(provenance):
    if (type(provenance) is not CloudThreadProvenance
            or provenance.surface != "codex_app_chat"
            or type(provenance.thread_id) is not str
            or not _UUID.fullmatch(provenance.thread_id)
            or provenance.host_id != "durable"
            or provenance.cloud_execution_verified is not True
            or type(provenance.evidence_ref) is not str
            or not _REF.fullmatch(provenance.evidence_ref)
            or ".." in provenance.evidence_ref):
        raise ValueError("verified native cloud thread provenance required")


def _pairs(pairs):
    value = {}
    for key, item in pairs:
        if key in value:
            raise ValueError("duplicate artifact key")
        value[key] = item
    return value


def _constant(_value):
    raise ValueError("nonfinite artifact number")


def canonical_bytes(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"),
                      ensure_ascii=False, allow_nan=False).encode("utf-8")


def validate_files(files, request):
    """Recheck canonical bytes/hash/identity after durable sink recovery as well."""
    _validate_artifact_paths(request.result_paths)
    if type(files) is not dict or set(files) != set(request.result_paths):
        raise ValueError("exact exported artifact paths required")
    total = 0
    for item in files.values():
        if type(item) is not dict or set(item) != {"sha256", "bytes", "json"}:
            raise ValueError("invalid artifact record")
        value = item["json"]
        if type(value) is not dict:
            raise ValueError("exported artifact must be an object")
        raw = canonical_bytes(value)
        total += len(raw)
        if (total > MAX_ARTIFACT_BYTES or type(item["bytes"]) is not int
                or item["bytes"] != len(raw) or item["sha256"] != hashlib.sha256(raw).hexdigest()
                or value.get("operation_id") != request.operation_id
                or value.get("input_sha") != request.input_sha
                or type(value.get("repository")) is not dict
                or value["repository"].get("expected_head") != request.head
                or value["repository"].get("observed_head") != request.head):
            raise ValueError("artifact identity, head, size or hash conflict")


def validate_bundle_provenance(bundle, request, provenance):
    validate_provenance(provenance)
    if (bundle.get("remote_id") != provenance.thread_id
            or bundle.get("native_thread_provenance") != asdict(provenance)
            or type(bundle.get("artifact_source_ref")) is not str
            or not _REF.fullmatch(bundle["artifact_source_ref"])
            or ".." in bundle["artifact_source_ref"]):
        raise ValueError("persisted bundle differs from trusted cloud provenance")
    validate_files(bundle.get("files"), request)


class NativeThreadArtifacts:
    """Result-only adapter. Existing ledger admits events; sink stores the bundle.

    No submit/status/QA implementation: it cannot create a thread or mark it done.
    Like the CLI transport, its internal collect_result is called by the existing
    step only AFTER durable admission. A failed call remains consumed, no retry.
    """
    def __init__(self, bridge, request: NativeWorkRequest,
                 provenance: CloudThreadProvenance,
                 reader: AuthenticatedThreadArtifactReader):
        if (type(request) is not NativeWorkRequest
                or not _UUID.fullmatch(request.operation_id)
                or not _SHA.fullmatch(request.input_sha)
                or not re.fullmatch(r"[0-9a-f]{40}", request.head)
                or not callable(getattr(reader, "read_artifacts", None))):
            raise ValueError("exact request and trusted authenticated reader required")
        validate_provenance(provenance)
        _validate_artifact_paths(request.result_paths)
        self.bridge, self.request, self.provenance, self.reader = bridge, request, provenance, reader
        self._attempted = False

    def collect_result(self, operation_id, _unused_executable, allowed_paths):
        request = self.request
        row = self.bridge.read(operation_id)
        if (operation_id != request.operation_id or allowed_paths != request.result_paths
                or row is None or row.get("task_id") != request.task_id
                or row.get("surface") != "codex_app_chat"
                or row.get("remote_id") != self.provenance.thread_id
                or row.get("input_sha") != request.input_sha
                or row.get("dispatch_contract_sha") != request.plan_sha):
            raise ValueError("result requires exact previously bound native thread")
        if self._attempted:
            raise RuntimeError("read already attempted; retry forbidden")
        self._attempted = True
        try:
            observed = self.reader.read_artifacts(self.provenance, request, MAX_ARTIFACT_BYTES)
            if (type(observed) is not AuthenticatedThreadArtifacts
                    or observed.provenance != self.provenance
                    or observed.operation_id != operation_id or observed.input_sha != request.input_sha
                    or observed.observed_head != request.head
                    or type(observed.artifacts) is not tuple
                    or len(observed.artifacts) != len(allowed_paths)
                    or type(observed.source_ref) is not str or not _REF.fullmatch(observed.source_ref)
                    or ".." in observed.source_ref):
                raise ValueError("authenticated artifact response identity conflict")
            files, total = {}, 0
            for artifact in observed.artifacts:
                if (type(artifact) is not ThreadArtifactBytes or type(artifact.path) is not str
                        or artifact.path not in allowed_paths or artifact.path in files
                        or type(artifact.content) is not bytes or not artifact.content
                        or type(artifact.sha256) is not str or not _SHA.fullmatch(artifact.sha256)):
                    raise ValueError("ambiguous exported artifact")
                total += len(artifact.content)
                if total > MAX_ARTIFACT_BYTES or hashlib.sha256(artifact.content).hexdigest() != artifact.sha256:
                    raise ValueError("artifact limit or SHA conflict")
                value = json.loads(artifact.content.decode("utf-8", errors="strict"),
                                   object_pairs_hook=_pairs, parse_constant=_constant)
                if canonical_bytes(value) != artifact.content:
                    raise ValueError("artifact must have exact canonical JSON bytes")
                files[artifact.path] = {"sha256": artifact.sha256,
                                        "bytes": len(artifact.content), "json": value}
            bundle = {"state": "awaiting_independent_qa", "operation_id": operation_id,
                      "remote_id": self.provenance.thread_id, "input_sha": request.input_sha,
                      "files": files, "native_thread_provenance": asdict(self.provenance),
                      "artifact_source_ref": observed.source_ref, "provider_read_attempt_count": 1,
                      "cost": "UNKNOWN", "tokens": "UNKNOWN"}
            validate_bundle_provenance(bundle, request, self.provenance)
            return bundle
        except Exception:
            # No response/exception text escapes; uncertain outcomes stay consumed.
            return {"state": "needs_reconcile", "operation_id": operation_id,
                    "remote_id": self.provenance.thread_id, "retry": "forbidden",
                    "provider_read_attempt_count": 1, "cost": "UNKNOWN", "tokens": "UNKNOWN"}
