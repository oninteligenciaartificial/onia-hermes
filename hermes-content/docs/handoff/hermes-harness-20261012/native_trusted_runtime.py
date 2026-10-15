"""Trusted in-process wiring for the existing finite native-work harness.

The caller supplies already-open queue/bridge/transport/sink objects. This
module never creates or migrates the operational queue or starts a scheduler.
``send_approval_prompt`` sends one approval message only after the adapter is
connected. Telegram approval callbacks only record the authenticated one-use
grant; a separate explicit event is required to reach the native-work
entrypoint and may submit through the already-bound transport.
"""
from __future__ import annotations

import hashlib
import importlib
import importlib.metadata
import json
import re
import time
import asyncio
from dataclasses import dataclass
from io import BytesIO
from urllib.parse import urlsplit


_PROMPT_SECRET_MARKER = re.compile(
    r"(?i)(?:\b(?:api[_ -]?key|access[_ -]?token|password|secret|authorization|bearer)\b\s*[:=]"
    r"|\bsk-[A-Za-z0-9_-]{20,}\b|\b(?:ghp|github_pat)_[A-Za-z0-9_]{20,}\b"
    r"|\b\d{6,12}:[A-Za-z0-9_-]{30,}\b|-----BEGIN (?:RSA |OPENSSH )?PRIVATE KEY-----)"
)
_NATIVE_COMMANDS = {
    "/onia_native_submit": "submit",
    "/onia_native_status": "status",
    "/onia_native_result": "result",
    "/onia_native_qa": "qa",
    "/onia_native_deliver": "deliver",
}
_NATIVE_COMMAND_NAMESPACE = "/onia_native_"
_SHA256 = re.compile(r"[0-9a-f]{64}\Z")


@dataclass(frozen=True)
class NativeResultDeliveryContract:
    """Host-trusted, one-use binding for an explicit private result delivery."""

    operation_id: str
    request_sha: str
    bundle_sha256: str
    result_sha: str
    actor_id: str
    private_chat_id: str
    stop_epoch: int

    def __post_init__(self):
        if (not isinstance(self.operation_id, str)
                or not re.fullmatch(r"[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}",
                                    self.operation_id)
                or any(type(getattr(self, key)) is not str
                       or not _SHA256.fullmatch(getattr(self, key))
                       for key in ("request_sha", "bundle_sha256", "result_sha"))
                or type(self.actor_id) is not str or not self.actor_id.isdigit()
                or self.private_chat_id != self.actor_id
                or type(self.stop_epoch) is not int or self.stop_epoch < 0):
            raise ValueError("invalid private result delivery contract")

    def as_record(self):
        return {
            "operation_id": self.operation_id, "request_sha": self.request_sha,
            "bundle_sha256": self.bundle_sha256, "result_sha": self.result_sha,
            "actor_id": self.actor_id, "private_chat_id": self.private_chat_id,
            "stop_epoch": self.stop_epoch,
        }


class NativeTrustedRuntime:
    """Bind one real Telegram adapter and one existing native-work runtime."""

    def __init__(self, adapter, native_runtime, authority, *,
                 result_delivery_contract=None, now_fn=None):
        self.adapter = adapter
        self.native_runtime = native_runtime
        self.authority = authority
        self.result_delivery_contract = result_delivery_contract
        self._now_fn = now_fn or (lambda: int(time.time()))
        self._original_callback = None
        self._original_command = None

    @classmethod
    def bind(cls, adapter, *, queue, bridge, transport, request, plan, result_sink,
             claim=None, result_bundle=None, qa_verifier=None,
             result_delivery_contract=None, now_fn=None):
        """Build a strict binding from trusted live objects; never open a DB path."""
        from native_cloud_cli import CloudTaskPlan, NativeCloudCLI
        from native_receipt_bridge import NativeReceiptBridge, NativeWorkRequest
        from native_result_store import FileResultSink
        from native_telegram_authority import TelegramNativeWorkAuthority
        from native_work_entrypoint import NativeWorkRuntime
        from sqlite_pilot import Claim, SQLiteQueue

        if type(queue) is not SQLiteQueue or type(bridge) is not NativeReceiptBridge:
            raise TypeError("existing exact SQLite queue and native bridge required")
        if bridge.queue is not queue:
            raise ValueError("queue and bridge must be the same existing instance")
        if type(transport) is not NativeCloudCLI or transport.bridge is not bridge:
            raise ValueError("transport must use the same existing bridge")
        if type(request) is not NativeWorkRequest or type(plan) is not CloudTaskPlan:
            raise TypeError("exact native request and reviewed cloud plan required")
        if type(result_sink) is not FileResultSink:
            raise TypeError("existing FileResultSink instance required")
        if claim is not None and type(claim) is not Claim:
            raise TypeError("exact existing queue claim required")
        if (result_delivery_contract is not None
                and type(result_delivery_contract) is not NativeResultDeliveryContract):
            raise TypeError("exact host-bound result delivery contract required")

        authority = TelegramNativeWorkAuthority._from_trusted_launcher(adapter)
        native_runtime = NativeWorkRuntime(
            queue=queue, bridge=bridge, transport=transport, request=request,
            plan=plan, claim=claim, authority=authority,
            result_bundle=result_bundle, qa_verifier=qa_verifier,
            result_sink=result_sink,
        )
        return cls(adapter, native_runtime, authority,
                   result_delivery_contract=result_delivery_contract, now_fn=now_fn)

    @property
    def queue(self):
        return self.native_runtime.queue

    @property
    def result_sink(self):
        return self.native_runtime.result_sink

    def install(self):
        """Bind authenticated callbacks and explicit private event commands.

        The existing handlers remain responsible for every other callback and
        command. The adapter registers these methods during connect, so install
        before connect and before any application rebuild.
        """
        current = getattr(self.adapter, "_handle_callback_query", None)
        if not callable(current):
            raise TypeError("Telegram adapter callback dispatcher unavailable")
        current_command = getattr(self.adapter, "_handle_command", None)
        if not callable(current_command):
            raise TypeError("Telegram adapter command dispatcher unavailable")
        if getattr(current, "_native_trusted_runtime", None) is self:
            if (callable(current_command)
                    and getattr(current_command, "_native_trusted_runtime", None) is not self):
                raise RuntimeError("native command wrapper ownership changed")
            return self
        if getattr(current, "_native_trusted_runtime", None) is not None:
            raise RuntimeError("a different native callback runtime is already installed")
        if (callable(current_command)
                and getattr(current_command, "_native_trusted_runtime", None) is not None):
            raise RuntimeError("a different native command runtime is already installed")
        if getattr(self.adapter, "_app", None) is not None:
            raise RuntimeError("install native callback runtime before TelegramAdapter.connect()")
        self._original_callback = current
        self._original_command = current_command

        async def dispatch(update, context):
            query = getattr(update, "callback_query", None)
            data = getattr(query, "data", None) if query is not None else None
            if isinstance(data, str) and data.startswith("na:"):
                try:
                    decision = await self.authority.handle_callback(query, now=self._now())
                except Exception:
                    decision = "hold_callback_error"
                await self._answer_callback(query, decision)
                return
            return await self._original_callback(update, context)

        dispatch._native_trusted_runtime = self
        self.adapter._handle_callback_query = dispatch
        original_command = self._original_command

        async def command_dispatch(update, context):
            message = getattr(update, "message", None)
            text = getattr(message, "text", None) if message is not None else None
            first = text.split(maxsplit=1)[0] if isinstance(text, str) and text else ""
            if not first.startswith(_NATIVE_COMMAND_NAMESPACE):
                return await original_command(update, context)
            event = _NATIVE_COMMANDS.get(first)
            if event is None or text != first:
                await self._reply_native_command(message, "hold_invalid_command")
                return
            result = await self._handle_authenticated_command(update, message, event)
            state = result.get("state") if type(result) is dict else None
            if type(state) is not str or not re.fullmatch(r"[a-z_]{1,48}", state):
                state = "needs_reconcile"
            await self._reply_native_command(message, state)

        command_dispatch._native_trusted_runtime = self
        self.adapter._handle_command = command_dispatch
        return self

    def uninstall_before_connect(self):
        """Restore the original callback only while no PTB app captured it."""
        if self._original_callback is None:
            raise RuntimeError("native callback runtime is not installed")
        if getattr(self.adapter, "_app", None) is not None:
            raise RuntimeError("cannot uninstall after TelegramAdapter.connect()")
        current = getattr(self.adapter, "_handle_callback_query", None)
        if getattr(current, "_native_trusted_runtime", None) is not self:
            raise RuntimeError("native callback wrapper ownership changed")
        current_command = getattr(self.adapter, "_handle_command", None)
        if getattr(current_command, "_native_trusted_runtime", None) is not self:
            raise RuntimeError("native command wrapper ownership changed")
        self.adapter._handle_callback_query = self._original_callback
        self.adapter._handle_command = self._original_command
        self._original_callback = None
        self._original_command = None
        return self

    def issue_approval(self, request, *, actor_id, private_chat_id, now=None, ttl=120):
        """Prepare a callback only for the exact bound request and a live lease.

        This is read-only against the queue. The returned callback data must be
        sent by the already-authorized Telegram UI path and then bound to its
        returned message ID with ``bind_sent_message``.
        """
        from native_receipt_bridge import NativeWorkRequest

        if type(request) is not NativeWorkRequest or request is not self.native_runtime.request:
            raise TypeError("exact bound request required")
        now = self._now() if now is None else now
        if type(now) is not int or now < 0:
            raise ValueError("invalid current time")
        claim = self.native_runtime.claim
        if claim is None:
            raise RuntimeError("existing queue claim required; approval held")

        expected = {
            "worker_id": request.worker_id, "contract_id": request.contract_id,
            "repo": request.repo, "ref": request.ref, "sha": request.head,
            "input_sha": request.input_sha,
        }
        with self.queue._connection() as conn:
            guard = conn.execute(
                "SELECT stopped FROM controller_guard_state WHERE singleton=1"
            ).fetchone()
            task = conn.execute(
                "SELECT * FROM tasks WHERE task_id=?", (request.task_id,)
            ).fetchone()
            lease = conn.execute(
                "SELECT * FROM worker_leases WHERE worker_id=?", (request.worker_id,)
            ).fetchone()
        if guard is None or guard["stopped"]:
            raise RuntimeError("controller STOP or guard unavailable; approval held")
        if task is None or any(task[key] != value for key, value in expected.items()):
            raise RuntimeError("request is not bound to an existing queue task")
        if (task["status"] != "running" or lease is None
                or lease["task_id"] != claim.task_id
                or lease["owner_id"] != claim.owner_id
                or lease["fencing_token"] != claim.fencing_token
                or lease["expires_at"] <= now
                or claim.task_id != request.task_id
                or claim.worker_id != request.worker_id
                or claim.expires_at <= now):
            raise RuntimeError("current queue lease required; approval held")
        if self.native_runtime.bridge.read(request.operation_id) is not None:
            raise RuntimeError("operation already exists; approval held for reconciliation")
        if str(actor_id).strip() != str(private_chat_id).strip():
            raise ValueError("approval actor must match the private Telegram chat")
        return self.authority.issue(
            request, actor_id=actor_id, private_chat_id=private_chat_id,
            now=now, ttl=ttl,
        )

    def bind_sent_message(self, callback_data, message_id):
        return self.authority.bind_sent_message(callback_data, message_id)

    async def send_approval_prompt(self, *, actor_id, private_chat_id, now=None, ttl=120):
        """Send one request-bound approval to the trusted actor's private chat.

        The adapter bot sends exactly once. Ambiguous delivery leaves the
        challenge unbound and returns HOLD; callers must never retry this
        delivery automatically. A successfully returned Telegram message is
        checked against the requested chat before its message ID is bound.
        """
        now = self._now() if now is None else now
        if type(now) is not int or now < 0:
            return {"state": "hold", "code": "approval_context_unavailable"}
        trusted_actor_id = str(actor_id or "").strip()
        trusted_chat_id = str(private_chat_id or "").strip()
        if not trusted_actor_id or trusted_actor_id != trusted_chat_id:
            return {"state": "hold", "code": "approval_context_unavailable"}
        if (getattr(self.adapter, "_app", None) is None
                or getattr(self.adapter, "_bot", None) is None
                or getattr(self.adapter._app, "running", None) is not True
                or getattr(self.adapter._app, "bot", None) is not self.adapter._bot
                or getattr(getattr(self.adapter, "_handle_callback_query", None),
                            "_native_trusted_runtime", None) is not self):
            return {"state": "hold", "code": "approval_context_unavailable"}

        try:
            button_types = importlib.import_module(type(self.adapter).__module__)
            if type(self.adapter) is not getattr(button_types, "TelegramAdapter", None):
                return {"state": "hold", "code": "approval_context_unavailable"}
            button = getattr(button_types, "InlineKeyboardButton", None)
            markup = getattr(button_types, "InlineKeyboardMarkup", None)
            send_message = getattr(self.adapter._bot, "send_message", None)
            if not callable(button) or not callable(markup) or not callable(send_message):
                return {"state": "hold", "code": "approval_context_unavailable"}
            request = self.native_runtime.request
            plan = self.native_runtime.plan
            _, _, reviewed_plan_sha = plan.request()
            if (request.plan_sha != reviewed_plan_sha
                    or request.input_sha != reviewed_plan_sha
                    or request.repo != "onia-hermes"
                    or request.ref != plan.branch
                    or request.head != plan.expected_remote_head):
                return {"state": "hold", "code": "approval_context_unavailable"}
            public_prompt = plan.public_prompt_file.read_bytes()
            if (len(public_prompt) > 2048
                    or hashlib.sha256(public_prompt).hexdigest() != plan.prompt_sha256):
                return {"state": "hold", "code": "approval_context_unavailable"}
            prompt_text = public_prompt.decode("utf-8", errors="strict")
            purpose_lines = [line[len("ONIA_PURPOSE:"):].strip()
                             for line in prompt_text.splitlines()
                             if line.startswith("ONIA_PURPOSE:")]
            if (len(purpose_lines) != 1
                    or not purpose_lines[0]
                    or len(purpose_lines[0]) > 500
                    or any(ord(char) < 32 for char in purpose_lines[0])
                    or _PROMPT_SECRET_MARKER.search(purpose_lines[0])):
                return {"state": "hold", "code": "approval_context_unavailable"}
            purpose = purpose_lines[0]
            body = (
                "Solicitud de trabajo nativo\n"
                "Acción: enviar una tarea Codex Cloud (un solo envío).\n"
                f"Propósito revisado (input SHA-256 {plan.prompt_sha256}):\n{purpose}\n"
                f"Tarea: {request.task_id}\n"
                f"Contrato: {request.contract_id}\n"
                f"Repositorio/ref: {request.repo} · {request.ref}\n"
                f"HEAD esperado: {request.head}\n"
                f"Solicitud SHA-256: {request.digest()}\n"
                f"Input SHA-256: {request.input_sha}\n"
                f"Operación: {request.operation_id}\n"
                f"Resultados permitidos: {', '.join(request.result_paths)}\n"
                f"Límites: 1 envío; hasta {request.max_status_events}/2 eventos de estado; "
                f"hasta {request.max_result_events}/1 evento de resultado.\n"
                f"Plan SHA-256: {request.plan_sha}\n"
                f"Expira en {ttl} s. Autorizar registra el permiso; no envía el trabajo."
            )
            if len(body) > 3500:
                return {"state": "hold", "code": "approval_context_unavailable"}
            callbacks = self.issue_approval(
                request, actor_id=trusted_actor_id, private_chat_id=trusted_chat_id,
                now=now, ttl=ttl,
            )
        except Exception:
            return {"state": "hold", "code": "approval_preflight_failed",
                    "operation_id": getattr(self.native_runtime.request, "operation_id", None)}

        try:
            keyboard = markup([
                [button("Autorizar", callback_data=callbacks["approve"]),
                 button("Rechazar", callback_data=callbacks["deny"])],
            ])
            sent = await send_message(chat_id=trusted_chat_id, text=body,
                                      reply_markup=keyboard)
            sent_chat = getattr(sent, "chat", None)
            sent_chat_id = getattr(sent_chat, "id", None)
            sent_message_id = getattr(sent, "message_id", None)
            if (str(getattr(sent_chat, "type", "")) != "private"
                    or str(sent_chat_id).strip() != trusted_chat_id
                    or type(sent_message_id) is not int or sent_message_id <= 0):
                return {"state": "hold", "code": "approval_delivery_unknown",
                        "operation_id": request.operation_id}
            self.bind_sent_message(callbacks["approve"], sent_message_id)
            return {"state": "awaiting_telegram_approval",
                    "operation_id": request.operation_id,
                    "message_id": str(sent_message_id), "expires_at": now + ttl}
        except Exception:
            # Sending may have succeeded remotely. Do not resend; without a
            # verified message binding the callback cannot authorize work.
            return {"state": "hold", "code": "approval_delivery_unknown",
                    "operation_id": request.operation_id}

    async def handle_callback(self, query, *, now=None):
        """Expose the same authenticated callback path for adapter integration tests."""
        return await self.authority.handle_callback(query, now=self._now() if now is None else now)

    def handle_event(self, raw_input, *, now=None):
        """Dispatch one explicitly supplied event through the existing entrypoint."""
        from native_work_entrypoint import handle_native_event

        return handle_native_event(raw_input, self.native_runtime,
                                   now=self._now() if now is None else now)

    async def _handle_authenticated_command(self, update, message, event):
        """Build one event only from the bound request and an authenticated Update."""
        request = self.native_runtime.request
        now = self._now()
        try:
            if (getattr(self.adapter, "_app", None) is None
                    or getattr(self.adapter._app, "running", None) is not True
                    or getattr(self.adapter._app, "bot", None) is not getattr(self.adapter, "_bot", None)):
                return {"state": "hold", "code": "runtime_unavailable"}
            if not callable(getattr(self.adapter, "_should_process_message", None)):
                return {"state": "hold", "code": "runtime_unavailable"}
            if self.adapter._should_process_message(message, is_command=True) is not True:
                return {"state": "hold", "code": "message_rejected"}
            user = getattr(message, "from_user", None)
            chat = getattr(message, "chat", None)
            actor_id = self._trusted_telegram_id(getattr(user, "id", None))
            chat_id = self._trusted_telegram_id(getattr(chat, "id", None))
            update_id = getattr(update, "update_id", None)
            if (actor_id is None or chat_id is None or actor_id != chat_id
                    or str(getattr(chat, "type", "")) != "private"
                    or getattr(user, "is_bot", False) is not False
                    or type(update_id) is not int or update_id < 0
                    or type(getattr(message, "message_id", None)) is not int
                    or message.message_id <= 0
                    or any(getattr(message, name, None) is not None
                           for name in ("forward_origin", "sender_chat", "via_bot"))):
                return {"state": "hold", "code": "telegram_identity_mismatch"}
            if (event == "deliver"
                    and (getattr(update, "edited_message", None) is not None
                         or getattr(message, "edit_date", None) is not None
                         or getattr(message, "reply_to_message", None) is not None)):
                return {"state": "hold", "code": "delivery_message_not_original_private_command"}
            if not self._explicit_actor_allowlisted(actor_id):
                return {"state": "hold", "code": "telegram_exact_allowlist_required"}
            gate = getattr(self.adapter, "_is_callback_user_authorized", None)
            if not callable(gate):
                return {"state": "hold", "code": "telegram_auth_gate_unavailable"}
            if gate(actor_id, chat_id=chat_id, chat_type="private", thread_id=None,
                    user_name=getattr(user, "username", None)) is not True:
                return {"state": "hold", "code": "telegram_actor_unauthorized"}
            if request is not self.native_runtime.request or not str(request.operation_id).strip():
                return {"state": "hold", "code": "request_approval_mismatch"}
            if event == "submit":
                authorization = self.authority.verify(request, now)
                if str(getattr(authorization, "actor", "")) != actor_id:
                    return {"state": "hold", "code": "request_approval_mismatch"}
            elif not self._persisted_actor_matches(request, actor_id):
                return {"state": "hold", "code": "durable_work_authority_mismatch"}
            event_id = f"tgcmd:{update_id}:{event}"
            if event == "deliver":
                return await self._deliver_result_once(
                    request, event_id, actor_id, chat_id, now)
            raw_input = json.dumps({
                "schema": 1,
                "event": event,
                "event_id": event_id,
                "operation_id": request.operation_id,
                "request_sha": request.digest(),
            }, sort_keys=True, separators=(",", ":"), allow_nan=False)
        except Exception:
            return {"state": "hold", "code": "authenticated_event_preflight_failed"}
        # The native entrypoint may perform a bounded CLI action; never block PTB's async loop.
        try:
            return await asyncio.to_thread(self.handle_event, raw_input, now=now)
        except Exception:
            return {"state": "needs_reconcile", "code": "dispatch_outcome_unknown"}

    async def _deliver_result_once(self, request, event_id, actor_id, chat_id, now):
        """Send one exact QA-closed bundle to the bound private owner."""
        contract = self.result_delivery_contract
        if (type(contract) is not NativeResultDeliveryContract
                or contract.operation_id != request.operation_id
                or contract.request_sha != request.digest()
                or contract.actor_id != actor_id
                or contract.private_chat_id != chat_id):
            return {"state": "hold", "code": "delivery_contract_unavailable"}
        bot = getattr(self.adapter, "_bot", None)
        app = getattr(self.adapter, "_app", None)
        if (app is None or getattr(app, "running", None) is not True
                or getattr(app, "bot", None) is not bot
                or not callable(getattr(bot, "send_document", None))
                or not self._single_call_document_transport_ready(bot)):
            return {"state": "hold", "code": "delivery_transport_unverified"}

        try:
            receipt = self.native_runtime.bridge.read_result_bundle_receipt(request)
            loader = getattr(self.native_runtime.result_sink, "load", None)
            if (type(receipt) is not dict or not callable(loader)):
                raise ValueError("durable result receipt unavailable")
            raw = loader(receipt["ref"], request.operation_id,
                         request.digest(), receipt["sha256"])
            if (type(raw) is not bytes or len(raw) != receipt["bytes_written"]
                    or hashlib.sha256(raw).hexdigest() != receipt["sha256"]
                    or receipt["sha256"] != contract.bundle_sha256):
                raise ValueError("result bundle differs from host-bound delivery contract")
            from native_work_entrypoint import (
                _pairs_no_duplicates, _reject_constant, _valid_result_bundle,
            )
            bundle = json.loads(raw.decode("utf-8", errors="strict"),
                                object_pairs_hook=_pairs_no_duplicates,
                                parse_constant=_reject_constant)
            if (json.dumps(bundle, sort_keys=True, separators=(",", ":"),
                           ensure_ascii=False, allow_nan=False).encode("utf-8") != raw
                    or not _valid_result_bundle(bundle, request, request.operation_id)):
                raise ValueError("result bundle content is not canonical or request-bound")
            qa_bundle_sha = hashlib.sha256(json.dumps(
                bundle, sort_keys=True, separators=(",", ":"),
                ensure_ascii=True, allow_nan=False).encode("utf-8")).hexdigest()
            native = self.native_runtime.bridge.read(request.operation_id)
            if (type(native) is not dict or native.get("task_id") != request.task_id
                    or native.get("surface") != "cloud_cli_task"
                    or native.get("input_sha") != request.input_sha
                    or native.get("state") != "completed"
                    or native.get("remote_id") != bundle.get("remote_id")):
                raise ValueError("result bundle differs from the completed native task")
            for item in bundle["files"].values():
                artifact = item["json"]
                if (artifact.get("operation_id") != request.operation_id
                        or artifact.get("input_sha") != request.input_sha
                        or artifact.get("repository", {}).get("expected_head") != request.head
                        or artifact.get("repository", {}).get("observed_head") != request.head):
                    raise ValueError("result artifact differs from the exact reviewed request")
            result_sha = hashlib.sha256(json.dumps(
                {path: item["sha256"] for path, item in bundle["files"].items()},
                sort_keys=True, separators=(",", ":"), ensure_ascii=True,
                allow_nan=False).encode("utf-8")).hexdigest()
            if result_sha != contract.result_sha:
                raise ValueError("result file digest differs from host-bound contract")
        except Exception:
            return {"state": "hold", "code": "delivery_bundle_unverified"}

        try:
            consumed = self.native_runtime.bridge.begin_result_delivery_once(
                request, event_id, contract.as_record(), qa_bundle_sha, now)
        except Exception:
            return {"state": "hold", "code": "delivery_reservation_failed"}
        if not consumed:
            return {"state": "needs_reconcile", "code": "delivery_attempt_already_consumed"}

        try:
            sent = await bot.send_document(
                chat_id=contract.private_chat_id,
                document=BytesIO(raw), filename=f"result-{request.operation_id}.json",
            )
            sent_chat = getattr(sent, "chat", None)
            sent_chat_id = self._trusted_telegram_id(getattr(sent_chat, "id", None))
            message_id = getattr(sent, "message_id", None)
            if (str(getattr(sent_chat, "type", "")) != "private"
                    or sent_chat_id != contract.private_chat_id
                    or type(message_id) is not int or message_id <= 0):
                raise RuntimeError("delivery acknowledgement did not bind exact private chat")
            outcome = self.native_runtime.bridge.finish_result_delivery(
                request, event_id, "ack", sent_chat_id, message_id, self._now())
            return {"state": "ack", "code": "ok", "operation_id": request.operation_id,
                    "message_id": outcome["ack_message_id"]}
        except asyncio.CancelledError:
            try:
                self.native_runtime.bridge.finish_result_delivery(
                    request, event_id, "maybe", None, None, self._now())
            except Exception:
                pass
            raise
        except Exception:
            try:
                self.native_runtime.bridge.finish_result_delivery(
                    request, event_id, "maybe", None, None, self._now())
            except Exception:
                pass
            return {"state": "maybe", "code": "delivery_outcome_ambiguous",
                    "operation_id": request.operation_id}

    @staticmethod
    def _single_call_document_transport_ready(bot):
        """Verify the inspected PTB/HTTPX direct transport shape; private API by design.

        PTB has no public transport getter. Unknown versions/shapes, custom
        fallback/proxy transports and retrying pools are rejected before the
        delivery attempt is consumed. This does not prove one network POST.
        """
        try:
            if (importlib.metadata.version("python-telegram-bot") != "22.8"
                    or importlib.metadata.version("httpx") != "0.28.1"
                    or importlib.metadata.version("httpcore") != "1.0.9"):
                return False
            telegram_bot = importlib.import_module("telegram._bot").Bot
            telegram_ext_bot = importlib.import_module("telegram.ext").ExtBot
            httpx = importlib.import_module("httpx")
            httpcore_pool = importlib.import_module("httpcore._async.connection_pool").AsyncConnectionPool
            httpx_request = importlib.import_module("telegram.request").HTTPXRequest
            if (type(bot) not in (telegram_bot, telegram_ext_bot)
                    or not isinstance(bot._request, tuple) or len(bot._request) != 2
                    or (type(bot) is telegram_ext_bot
                        and getattr(bot, "rate_limiter", None) is not None)):
                return False
            request = bot.request
            if type(request) is not httpx_request or bot._request[1] is not request:
                return False
            client = request._client
            if type(client) is not httpx.AsyncClient or client.auth is not None:
                return False
            base = urlsplit(str(bot.base_url))
            if base.scheme != "https" or base.hostname != "api.telegram.org":
                return False
            url = httpx.URL(str(bot.base_url).rstrip("/") + "/sendDocument")
            transport = client._transport
            if (type(transport) is not httpx.AsyncHTTPTransport
                    or client._transport_for_url(url) is not transport
                    or client.follow_redirects is not False):
                return False
            for pattern, mounted in client._mounts.items():
                if pattern.matches(url) and mounted not in (None, transport):
                    return False
            pool = transport._pool
            if (type(pool) is not httpcore_pool or pool._retries != 0
                    or pool._proxy is not None):
                return False
            return True
        except Exception:
            return False

    def _explicit_actor_allowlisted(self, actor_id):
        """Require an exact configured user allowlist; reject absent and wildcard gates."""
        try:
            module = importlib.import_module(type(self.adapter).__module__)
            coerce = getattr(module, "_coerce_allow_set", None)
            scoped_env = getattr(module, "_scoped_gate_env", None)
            if not callable(coerce) or not callable(scoped_env):
                return False
            extra = getattr(getattr(self.adapter, "config", None), "extra", None)
            extra = extra if isinstance(extra, dict) else {}
            configured = []
            if extra.get("allow_from") is not None:
                configured.append(coerce(extra["allow_from"]))
            env_allowlist = str(scoped_env("TELEGRAM_ALLOWED_USERS") or "").strip()
            if env_allowlist:
                configured.append(coerce(env_allowlist))
            return bool(configured) and all(
                isinstance(allowed, (set, frozenset, list, tuple))
                and "*" not in {str(item).strip() for item in allowed}
                and actor_id in {str(item).strip() for item in allowed}
                for allowed in configured)
        except Exception:
            return False

    def _persisted_actor_matches(self, request, actor_id):
        """Bind later events to the exact durable grant, independent of TTL/restart."""
        try:
            from dataclasses import asdict
            native = self.native_runtime.bridge.read(request.operation_id)
            if (type(native) is not dict or native.get("task_id") != request.task_id
                    or native.get("input_sha") != request.input_sha
                    or native.get("nonce") != request.nonce
                    or native.get("dispatch_contract_sha") != request.plan_sha
                    or native.get("surface") != "cloud_cli_task"
                    or native.get("state") not in {
                        "dispatching", "submitted", "running", "unknown",
                        "completed", "failed", "cancelled",
                    }
                    or type(native.get("remote_id")) is not str
                    or not re.fullmatch(r"task_e_[0-9a-f]{32}", native["remote_id"])):
                return False
            payload = native.get("work_authority_json")
            payload_sha = native.get("work_authority_sha")
            if (type(payload) is not str or type(payload_sha) is not str
                    or hashlib.sha256(payload.encode("utf-8")).hexdigest() != payload_sha):
                return False
            proof = json.loads(payload)
            if (type(proof) is not dict
                    or set(proof) != {"request", "authorization"}):
                return False
            canonical_request = json.loads(json.dumps(
                asdict(request), sort_keys=True, separators=(",", ":")))
            if (proof.get("request") != canonical_request
                    or not isinstance(proof.get("authorization"), dict)):
                return False
            authorization = proof["authorization"]
            if (set(authorization) != {"verified", "request_sha", "grant_nonce", "actor",
                                       "authority_source", "evidence_ref", "expires_at", "scope"}
                    or authorization.get("verified") is not True
                    or authorization.get("request_sha") != request.digest()
                    or authorization.get("grant_nonce") != request.nonce
                    or authorization.get("scope") != "native_work_closure"
                    or authorization.get("actor") != actor_id
                    or authorization.get("evidence_ref") != native.get("authorization_ref")
                    or authorization.get("authority_source") != "telegram_callback_allowlist"
                    or type(authorization.get("expires_at")) is not int):
                return False
            return True
        except Exception:
            return False

    @staticmethod
    def _trusted_telegram_id(value):
        if type(value) is int and value > 0:
            return str(value)
        if type(value) is str and 0 < len(value) <= 128 and value.isdigit():
            return value
        return None

    @staticmethod
    async def _reply_native_command(message, state):
        reply = getattr(message, "reply_text", None) if message is not None else None
        if not callable(reply):
            return
        try:
            await reply(f"Native event: {state}")
        except Exception:
            return

    def _now(self):
        value = self._now_fn()
        if type(value) is not int or value < 0:
            raise ValueError("trusted clock must return a nonnegative integer")
        return value

    @staticmethod
    async def _answer_callback(query, decision):
        # The Telegram adapter's existing authorization gate answers denials.
        # Avoid a second answer in that path; all other outcomes get one short
        # acknowledgement with no request text or credentials.
        if decision == "hold_unauthorized":
            return
        answer = getattr(query, "answer", None)
        if not callable(answer):
            return
        labels = {
            "approved": "Approval recorded. No work was submitted.",
            "denied": "Request denied.",
            "hold_stop": "Controller stopped. Approval held.",
            "hold_expired_or_consumed": "Approval expired or already used.",
        }
        text = labels.get(decision, "Approval held.")
        try:
            await answer(text=text)
        except Exception:
            # The authority decision is already in memory; don't retry Telegram.
            return
