#!/usr/bin/env python3
"""Operator-only passive receipt viewer. Does not run Claude or expose raw streams."""
import json
import os
import time
from pathlib import Path


def main():
    folder = Path(__file__).resolve().parent
    previous = None
    print("ONIA | Visor de recibos de esta ejecucion. No es una sesion Claude interactiva.")
    print("La fase actual se lee de los recibos: ejecucion, revision o resultado. Ctrl+C para cerrar.\n")
    while True:
        snapshots = []
        for name in ("implementation-receipt.json", "fallback-receipt.json"):
            path = folder / name
            if path.is_file():
                try:
                    snapshots.append((name, json.loads(path.read_text(encoding="utf-8"))))
                except (OSError, ValueError):
                    pass
        signature = repr(snapshots)
        if signature != previous:
            previous = signature
            print("\n--- Recibo actualizado ---", flush=True)
            for name, receipt in snapshots:
                # Only enumerated safe metadata is displayed; no response/prompt/tool input.
                print(name, "|", receipt.get("state", receipt.get("status", "UNKNOWN")), flush=True)
                print("Modelo:", receipt.get("observed_init_model", receipt.get("observed_model", "UNKNOWN")), flush=True)
                print("Duracion ms:", receipt.get("duration_ms", receipt.get("elapsed_ms", "UNKNOWN")), flush=True)
                uses = receipt.get("tools_observed", [])
                returned = {x.get("tool_use_id"): x for x in receipt.get("tool_results", [])}
                for use in uses:
                    result = returned.get(use.get("id"))
                    state = "completed" if result and not result.get("is_error") else "started/error"
                    role = "subagent" if use.get("parent_tool_use_id") else "parent"
                    print(" ", role, use.get("name"), state, use.get("allowed_file_relative", ""), flush=True)
                if "tests" in receipt:
                    print("Tests:", receipt["tests"], flush=True)
        time.sleep(1)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nVisor cerrado. Ningun proveedor fue iniciado/detenido.")
