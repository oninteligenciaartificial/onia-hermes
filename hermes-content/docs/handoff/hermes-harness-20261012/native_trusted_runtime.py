"""Trusted in-process wiring for the existing finite native-work harness.

The caller supplies already-open queue/bridge/transport/sink objects. This
module never creates or migrates the operational queue, sends Telegram
messages, submits work, or starts a scheduler. Telegram approval callbacks only
record the authenticated one-use grant; a separate explicit event is required
to reach the native-work entrypoint.
"""
from __future__ import annotations

import time


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
        return self.authority.issue(
            request, actor_id=actor_id, private_chat_id=private_chat_id,
            now=now, ttl=ttl,
        )

    def bind_sent_message(self, callback_data, message_id):
        return self.authority.bind_sent_message(callback_data, message_id)

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
