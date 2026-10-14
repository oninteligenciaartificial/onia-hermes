"""Request-bound, one-use Telegram approval adapter for finite native work.

This is an uninstalled integration module. A trusted runtime must bind the
actual Telegram adapter instance and call ``issue`` only for a reviewed NEW
NativeWorkRequest. It does not register handlers, send messages, call a
provider, or persist approval state. Restart loses pending grants (fail closed).
"""
from dataclasses import dataclass
import hashlib
import secrets
import threading


_PREFIX = "na"
_CHOICES = frozenset(("a", "d"))
_MAX_TTL_SECONDS = 600
_FACTORY_CAPABILITY = object()


def _id(value, name):
    result = str(value or "").strip()
    if not result or len(result) > 128:
        raise ValueError(f"invalid {name}")
    return result


@dataclass
class _Pending:
    request: object
    request_sha: str
    actor_id: str
    chat_id: str
    expires_at: int
    message_id: str | None = None


class TelegramNativeWorkAuthority:
    """NativeWorkAuthority backed by the adapter's real callback auth gate.

    ``adapter`` must be the live trusted adapter instance whose callback route
    invokes ``handle_callback``. Do not construct this from event JSON, a
    worker, or caller-provided authorization booleans.
    """

    def __init__(self, adapter, *, _capability=None):
        if _capability is not _FACTORY_CAPABILITY:
            raise PermissionError("authority must be created by the trusted launcher factory")
        self._adapter = adapter
        self._lock = threading.RLock()
        self._pending = {}       # challenge digest -> _Pending
        self._approved = {}      # request digest -> NativeWorkAuthorization
        self._denied = set()

    @classmethod
    def _from_trusted_launcher(cls, adapter):
        """Bind only the exact installed adapter class; import the plugin lazily.

        Call only from the trusted native launcher after it obtains the live,
        configured adapter. This private path is not an event/JSON factory.
        """
        try:
            from plugins.platforms.telegram.adapter import TelegramAdapter
        except (ImportError, AttributeError) as exc:
            raise RuntimeError("real Telegram adapter type unavailable; approval held") from exc
        if type(adapter) is not TelegramAdapter:
            raise TypeError("exact TelegramAdapter instance required; approval held")
        if (not callable(getattr(adapter, "_callback_ctx", None))
                or not callable(getattr(adapter, "_callback_authorized", None))):
            raise TypeError("TelegramAdapter callback gate unavailable; approval held")
        return cls(adapter, _capability=_FACTORY_CAPABILITY)

    def issue(self, request, *, actor_id, private_chat_id, now, ttl=120):
        """Create callback data for one exact request and explicitly chosen actor/chat."""
        from native_receipt_bridge import NativeWorkRequest

        if type(request) is not NativeWorkRequest:
            raise TypeError("exact NativeWorkRequest required")
        if type(now) is not int or now < 0:
            raise ValueError("invalid current time")
        if type(ttl) is not int or not 1 <= ttl <= _MAX_TTL_SECONDS:
            raise ValueError("ttl outside bounded approval window")
        actor_id = _id(actor_id, "actor_id")
        chat_id = _id(private_chat_id, "private_chat_id")
        request_sha = request.digest()
        token = secrets.token_urlsafe(24)
        challenge_sha = hashlib.sha256(token.encode("ascii")).hexdigest()
        pending = _Pending(request, request_sha, actor_id, chat_id, now + ttl)
        with self._lock:
            self._prune(now)
            if request_sha in self._approved or request_sha in self._denied:
                raise RuntimeError("request already received a Telegram decision")
            if any(item.request_sha == request_sha for item in self._pending.values()):
                raise RuntimeError("request already has a pending Telegram challenge")
            self._pending[challenge_sha] = pending
        return {"approve": f"{_PREFIX}:a:{token}", "deny": f"{_PREFIX}:d:{token}"}

    def bind_sent_message(self, callback_data, message_id):
        """Bind challenge to the message ID returned by the trusted send path."""
        token = self._parse_token(callback_data)
        challenge_sha = hashlib.sha256(token.encode("ascii")).hexdigest()
        message_id = _id(message_id, "message_id")
        with self._lock:
            pending = self._pending.get(challenge_sha)
            if pending is None:
                raise RuntimeError("challenge absent or expired")
            if pending.message_id is not None and pending.message_id != message_id:
                raise RuntimeError("challenge already bound to another message")
            pending.message_id = message_id

    async def handle_callback(self, query, *, now):
        """Authenticate with the real adapter, then consume one exact callback."""
        if type(now) is not int or now < 0:
            return "hold_invalid_time"
        data = getattr(query, "data", None)
        try:
            choice, token = self._parse_callback(data)
        except ValueError:
            return "hold_invalid_callback"
        challenge_sha = hashlib.sha256(token.encode("ascii")).hexdigest()
        with self._lock:
            pending = self._pending.get(challenge_sha)
            if pending is None or pending.expires_at <= now or pending.message_id is None:
                return "hold_expired_or_consumed"

        # This is the adapter's existing user/allowlist check, not a callback
        # field or bool supplied by the event caller.
        try:
            context = self._adapter._callback_ctx(query)
            authorized = await self._adapter._callback_authorized(
                query, context, "You are not authorized to approve this operation.")
        except Exception:
            return "hold_auth_gate_error"
        if authorized is not True:
            return "hold_unauthorized"

        message = getattr(query, "message", None)
        user = getattr(query, "from_user", None)
        chat = getattr(message, "chat", None)
        try:
            matches = (message is not None and user is not None and chat is not None
                       and str(getattr(chat, "type", "")) == "private"
                       and _id(getattr(user, "id", None), "callback actor") == pending.actor_id
                       and _id(getattr(message, "chat_id", None), "callback chat") == pending.chat_id
                       and _id(getattr(message, "message_id", None), "callback message") == pending.message_id)
        except (TypeError, ValueError):
            matches = False
        if not matches:
            return "hold_callback_binding_mismatch"

        from native_receipt_bridge import NativeWorkAuthorization
        with self._lock:
            current = self._pending.get(challenge_sha)
            if current is not pending or pending.expires_at <= now:
                return "hold_expired_or_consumed"
            del self._pending[challenge_sha]
            if choice == "d":
                self._denied.add(pending.request_sha)
                return "denied"
            authorization = NativeWorkAuthorization(
                verified=True,
                request_sha=pending.request_sha,
                grant_nonce=pending.request.nonce,
                actor=pending.actor_id,
                authority_source="telegram_callback_allowlist",
                evidence_ref="telegram_callback_sha256:" + challenge_sha,
                expires_at=pending.expires_at,
                scope="native_work_closure",
            )
            self._approved[pending.request_sha] = authorization
            return "approved"

    def verify(self, request, now):
        """Return the same decision on preflight repeats; durable core consumes it."""
        from native_receipt_bridge import NativeWorkRequest, NativeWorkAuthorization

        if type(request) is not NativeWorkRequest or type(now) is not int or now < 0:
            raise RuntimeError("exact native request and timestamp required")
        request_sha = request.digest()
        with self._lock:
            self._prune(now)
            if request_sha in self._denied:
                raise RuntimeError("native request denied")
            decision = self._approved.get(request_sha)
            if (type(decision) is not NativeWorkAuthorization
                    or decision.request_sha != request_sha
                    or decision.grant_nonce != request.nonce
                    or decision.expires_at <= now
                    or decision.scope != "native_work_closure"):
                raise RuntimeError("native request lacks a current Telegram approval")
            return decision

    def _prune(self, now):
        expired = [key for key, value in self._pending.items() if value.expires_at <= now]
        for key in expired:
            del self._pending[key]
        self._approved = {key: value for key, value in self._approved.items()
                          if value.expires_at > now}
        # Denials remain sticky for the authority instance; restart is fail closed.

    @staticmethod
    def _parse_callback(data):
        if not isinstance(data, str) or len(data.encode("utf-8")) > 64:
            raise ValueError("invalid callback data")
        parts = data.split(":", 2)
        if len(parts) != 3 or parts[0] != _PREFIX or parts[1] not in _CHOICES:
            raise ValueError("invalid callback data")
        token = parts[2]
        if not token or len(token) > 48 or not token.isascii():
            raise ValueError("invalid callback token")
        return parts[1], token

    @classmethod
    def _parse_token(cls, callback_data):
        return cls._parse_callback(callback_data)[1]
