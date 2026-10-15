#!/usr/bin/env python3
"""One approved remote review through installed Hermes registry + genuine CLI consent."""
import hashlib
import functools
import json
import os
import sys
import time
from pathlib import Path

sys.path.insert(0, "/usr/local/lib/hermes-agent")
sys.path.insert(0, "/opt/onia/claude-text/20261015/evidence/cli-integration-prep-20261015")
import claude_task as task
from tools.mcp_tool_discovery import discover_mcp_tools
from tools.registry import registry


def main():
    store = Path("/var/lib/onia/claude-text/receipts")
    contract = {
        "schema_version": 1, "task_id": "onia-hermes-native-review-20261015", "attempt_id": "attempt-1",
        "operation": "review_text", "goal": "Revisar evidencia de integración sin ejecutar acciones",
        "proof": "Tres puntos breves apoyados en el contexto y la skill explícita",
        "stop": "Una respuesta de menos de 150 palabras; sin herramientas, acciones ni subagentes",
        "instructions": [{"path": ".claude/skills/onia-continuidad/SKILL.md", "sha256": "5c3f6a5ecd0ee32fe7423ce36631520338e3defd1952fec4f1fb8cd2062afc8e"}],
        "input": "Orden humana vigente: revisar texto solamente, sin acciones. Prioridad humana y evidencia antes de afirmar éxito. Datos observados: CLI nativa2.1.288, OAuth Claude.ai Max misma cuenta con extra usage off confirmado; childenv sin API/provider overrides y auth preflight en ese mismo entorno; gateway activo tras configurar MCP trust=untrusted. Esta llamada pasa por el registry/handler nativo de Hermes en una sesión CLI SSH con consentimiento humano real en su terminal; no invoca el modelo API de Hermes. No demuestra una tarea originada por Telegram ni por el proceso gateway en ejecución, agentes con herramientas, ahorro ni PC-off. Devuelva SOLO3puntos cortos, máximo30palabras cada uno, distinguiendo prueba real y límites; incluya una regla de continuidad suministrada."
    }
    prompt, _ = task.build_prompt(contract, "/opt/onia/claude-text/20261015/policy")
    continuation = "--resume-pre-effect" in sys.argv
    if continuation:
        prior = json.loads((store / "native-smoke-runner-20261015.result.json").read_text())
        if prior.get("task_receipt", {}).get("provider_started") is not False or task.status(store, contract["task_id"])["state"] != "not_found":
            raise RuntimeError("continuation_not_proven_pre_effect")
    tag = "native-smoke-runner-20261015" + (".pre-effect-continuation" if continuation else "")
    marker = store / (tag + ".started.json")
    task.write_once(marker, {"state": "reserved", "task_id": contract["task_id"], "input_sha256": task.digest(prompt)})
    names = discover_mcp_tools(allowed_mcp_names=["onia_claude_text"])
    review_name = "mcp__onia_claude_text__review_text"
    if review_name not in names or registry.get_entry(review_name) is None:
        raise RuntimeError("native_tool_not_registered")
    # Pass the native consent API's existing deadline parameter; retain the real
    # implementation, TTY input, trust checks and verdict. No fabricated callback/accept.
    import tools.approval_prompt as native_approval
    native_approval.request_elicitation_consent = functools.partial(native_approval.request_elicitation_consent, timeout_seconds=300)
    print("Approved bounded smoke task: " + contract["task_id"], flush=True)
    print("Input SHA256: " + task.digest(prompt), flush=True)
    print("Native Hermes consent follows. Human may choose once (o); no callback/answer is automated.", flush=True)
    started = time.monotonic()
    raw = registry.dispatch(review_name, {"contract": contract})
    final = task.status(store, contract["task_id"])
    evidence = {
        "schema_version": 1, "state": final.get("state"), "task_id": contract["task_id"],
        "native_tool_name": review_name, "registered_tools": names,
        "surface": "human-owned SSH TTY / installed Hermes CLI native approval",
        "same_running_gateway_process": False, "hermes_model_api_called": False,
        "consent_timeout_seconds": 300,
        "approval_actor": "approved_by_authorized_agent_for_user" if continuation else "human_owned_terminal",
        "approval_authority_reference": "root relay of explicit human approval call482 and continuation order" if continuation else None,
        "native_dispatch_elapsed_ms": int((time.monotonic() - started) * 1000),
        "dispatch_result_sha256": hashlib.sha256(raw.encode()).hexdigest(),
        "task_receipt": final,
    }
    result = store / (tag + ".result.json")
    task.write_once(result, evidence)
    print(json.dumps({"state": evidence["state"], "task_id": contract["task_id"], "result_path": str(result), "model": final.get("provider_receipt", {}).get("model")}), flush=True)


if __name__ == "__main__":
    main()
