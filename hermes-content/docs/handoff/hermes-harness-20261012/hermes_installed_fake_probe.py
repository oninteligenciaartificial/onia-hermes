"""One-off installed AIAgent fake probe; no credential load or HTTP permitted.

Run only in a disposable process with an empty HERMES_HOME. This script never
calls run_conversation or the provider. It verifies post-init tool schemas and
the kwargs builder on the installed source version, with a fake client.
"""

import argparse
import builtins
import io
import json
import os
from pathlib import Path
import socket
import sys
from unittest.mock import patch

from hermes_api_preflight import Candidate, PROMPT, RealCallBlocked


def _private_path(path: object, hermes_home: Path) -> bool:
    if not isinstance(path, (str, bytes, os.PathLike)):
        return False
    name = Path(os.fsdecode(path)).name.lower()
    if name not in (".env", "config.yaml"):
        return False
    return not Path(os.fsdecode(path)).resolve().is_relative_to(hermes_home)


class _NoNetworkClient:
    def close(self) -> None:
        pass


def fake_probe(source: Path, hermes_home: Path) -> dict[str, object]:
    if not source.is_absolute() or not (source / "run_agent.py").is_file():
        raise RealCallBlocked("exact installed Hermes source required")
    if not hermes_home.is_absolute() or not hermes_home.is_dir() or any(hermes_home.iterdir()):
        raise RealCallBlocked("new empty absolute HERMES_HOME required")
    if "run_agent" in sys.modules:
        raise RealCallBlocked("run_agent already imported before safety hooks")
    for key in list(os.environ):
        if key.endswith(("_API_KEY", "_TOKEN")) or key in ("OPENAI_API_KEY", "ANTHROPIC_API_KEY"):
            os.environ.pop(key, None)  # Child process only; never read or print values.
    os.environ["HERMES_HOME"] = str(hermes_home)
    os.environ["PYTHONDONTWRITEBYTECODE"] = "1"
    sys.dont_write_bytecode = True
    os.chdir(hermes_home)
    sys.path.insert(0, str(source))
    original_open, original_io_open, original_os_open = builtins.open, io.open, os.open
    blocked_network_attempts = 0
    blocked_private_file_attempts = 0

    def guard_private(path):
        nonlocal blocked_private_file_attempts
        if _private_path(path, hermes_home):
            blocked_private_file_attempts += 1
            raise RealCallBlocked("private dotenv/config read blocked")

    def safe_open(path, *args, **kwargs):
        guard_private(path)
        return original_open(path, *args, **kwargs)

    def safe_io_open(path, *args, **kwargs):
        guard_private(path)
        return original_io_open(path, *args, **kwargs)

    def safe_os_open(path, *args, **kwargs):
        guard_private(path)
        return original_os_open(path, *args, **kwargs)

    def no_socket(*_args, **_kwargs):
        nonlocal blocked_network_attempts
        blocked_network_attempts += 1
        raise RealCallBlocked("network blocked in fake probe")

    with patch.object(builtins, "open", safe_open), patch.object(io, "open", safe_io_open), \
         patch.object(os, "open", safe_os_open), patch.object(socket.socket, "connect", no_socket), \
         patch.object(socket.socket, "connect_ex", no_socket), \
         patch.object(socket.socket, "send", no_socket), patch.object(socket.socket, "sendall", no_socket), \
         patch.object(socket.socket, "sendto", no_socket), \
         patch.object(socket, "getaddrinfo", no_socket), patch.object(socket, "create_connection", no_socket):
        # Source run_agent.py otherwise loads the installed checkout's project .env
        # even when HERMES_HOME points to an empty test directory.
        from hermes_cli import env_loader
        with patch.object(env_loader, "load_hermes_dotenv", return_value=[]):
            from run_agent import AIAgent
            from agent.client_lifecycle import ClientLifecycleMixin
            with patch.object(ClientLifecycleMixin, "_create_openai_client", return_value=_NoNetworkClient()):
                candidate = Candidate()
                agent = AIAgent(
                    base_url="https://example.invalid/v1", api_key="synthetic-fake-only",
                    provider="openai", api_mode="chat_completions", model=candidate.model_requested,
                    enabled_toolsets=[], max_iterations=1, max_tokens=candidate.max_tokens_candidate,
                    run_budget_seconds=45, skip_context_files=True, load_soul_identity=False,
                    skip_memory=True, skip_background_review=True, quiet_mode=True,
                )
                try:
                    if agent.tools != []:
                        raise RealCallBlocked("late tool schemas were appended")
                    kwargs = agent._build_api_kwargs([{"role": "user", "content": PROMPT}])
                    if kwargs.get("tools") not in (None, []):
                        raise RealCallBlocked("request builder added tool schemas")
                    if kwargs.get("model") != candidate.model_requested:
                        raise RealCallBlocked("request model changed")
                    return {"source_checked": str(source), "tools_post_init": 0,
                            "tools_payload": 0, "model_configured": kwargs["model"],
                            "blocked_network_attempts": blocked_network_attempts,
                            "blocked_private_file_attempts": blocked_private_file_attempts,
                            "network_calls_completed_by_hooks": 0,
                            "project_dotenv_loader_noop": True,
                            "scope": "installed-agent-fake-init-and-kwargs-only"}
                finally:
                    agent.close()
                    if blocked_network_attempts or blocked_private_file_attempts:
                        raise RealCallBlocked(
                            "blocked side-effect attempts: "
                            f"network={blocked_network_attempts}, private_file={blocked_private_file_attempts}"
                        )


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--home", type=Path, required=True)
    args = parser.parse_args()
    print(json.dumps(fake_probe(args.source, args.home), sort_keys=True))
