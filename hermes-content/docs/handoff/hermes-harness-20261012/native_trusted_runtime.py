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
import re
import time


_PROMPT_SECRET_MARKER = re.compile(
    r"(?i)(?:\b(?:api[_ -]?key|access[_ -]?token|password|secret|authorization|bearer)\b\s*[:=]"
    r"|\bsk-[A-Za-z0-9_-]{20,}\b|\b(?:ghp|github_pat)_[A-Za-z0-9_]{20,}\b"
    r"|\b\d{6,12}:[A-Za-z0-9_-]{30,}\b|-----BEGIN (?:RSA |OPENSSH )?PRIVATE KEY-----)"
)


class NativeTrustedRuntime:
    """Bind one real Telegram adapter and one existing native-work runtime."""

    def __init__(self, adapter, native_runtime, authority, *, now_fn=None):
        self.adapter = adapter
        self.native_runtime = native_runtime
        self.authority = authority
        self._now_fn = now_fn or (lambda: int(time.time()))
        self._original_callback = None

    @classmethod
    def bind(cls, adapter, *, queue, bridge, transport, request, plan, result_sink,
             claim=None, result_bundle=None, qa_verifier=None, now_fn=None):
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

        authority = TelegramNativeWorkAuthority._from_trusted_launcher(adapter)
        native_runtime = NativeWorkRuntime(
            queue=queue, bridge=bridge, transport=transport, request=request,
            plan=plan, claim=claim, authority=authority,
            result_bundle=result_bundle, qa_verifier=qa_verifier,
            result_sink=result_sink,
        )
        return cls(adapter, native_runtime, authority, now_fn=now_fn)

    @property
    def queue(self):
        return self.native_runtime.queue

    @property
    def result_sink(self):
        return self.native_runtime.result_sink

    def install(self):
        """Route only ``na:`` callbacks through the authenticated authority.

        The adapter's existing callback method remains responsible for all
        other callback prefixes. Install before TelegramAdapter.connect() so
        initial and rebuilt applications register the same bound method.
        """
        current = getattr(self.adapter, "_handle_callback_query", None)
        if not callable(current):
            raise TypeError("Telegram adapter callback dispatcher unavailable")
        if getattr(current, "_native_trusted_runtime", None) is self:
            return self
        if getattr(current, "_native_trusted_runtime", None) is not None:
            raise RuntimeError("a different native callback runtime is already installed")
        if getattr(self.adapter, "_app", None) is not None:
            raise RuntimeError("install native callback runtime before TelegramAdapter.connect()")
        self._original_callback = current

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
        self.adapter._handle_callback_query = self._original_callback
        self._original_callback = None
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
