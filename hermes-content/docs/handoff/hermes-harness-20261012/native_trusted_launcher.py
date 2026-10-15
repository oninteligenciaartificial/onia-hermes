"""One-shot pre-connect hook for the host's existing Telegram adapter.

This module accepts already-open native-work objects. It never discovers or
opens a queue path, starts Telegram, or submits provider work.
"""


def install_native_trusted_runtime_before_connect(
    adapter, *, queue, bridge, transport, request, plan, result_sink,
    claim=None, result_bundle=None, qa_verifier=None,
    result_delivery_contract=None, now_fn=None,
):
    """Install approval callback and explicit private event commands before connect.

    The caller must pass the same queue/bridge/transport and pre-existing
    FileResultSink objects already owned by the host process. No path-based
    construction is available here. The returned runtime can send one request
    prompt only after the adapter has connected, and can dispatch only when an
    explicit ``/onia_native_*`` command is received from an authenticated private
    Update. Approval only records the request grant; it never invokes a command.
    """
    if getattr(adapter, "_app", None) is not None:
        raise RuntimeError("launcher must run before TelegramAdapter.connect()")

    from native_trusted_runtime import NativeTrustedRuntime

    runtime = NativeTrustedRuntime.bind(
        adapter, queue=queue, bridge=bridge, transport=transport,
        request=request, plan=plan, claim=claim, result_sink=result_sink,
        result_bundle=result_bundle, qa_verifier=qa_verifier,
        result_delivery_contract=result_delivery_contract, now_fn=now_fn,
    )
    runtime.install()
    if (getattr(adapter, "_app", None) is not None
            or getattr(getattr(adapter, "_handle_callback_query", None),
                       "_native_trusted_runtime", None) is not runtime):
        runtime.uninstall_before_connect()
        raise RuntimeError("native Telegram callback was not installed before connect")
    command_handler = getattr(adapter, "_handle_command", None)
    if (not callable(command_handler)
            or getattr(command_handler, "_native_trusted_runtime", None) is not runtime):
        runtime.uninstall_before_connect()
        raise RuntimeError("native Telegram command caller was not installed before connect")
    return runtime
