#!/usr/bin/env bash
# ONIA — registra un GASTO con evidencia + flags fiscales en onia_center (docker exec onia-center).
# Uso: EXPENSE_B64="$(printf '%s' '<json>' | base64 -w0)" bash /opt/onia/expense-insert-run.sh
# JSON: { amount, category, reason, provider, center, hasFactura, esExterior, deducible,
#         facturaRef, spentAt, moneda, note }
# Imprime el JSON con el gasto y su impacto fiscal estimado en stdout.
set -uo pipefail

docker exec -e EXPENSE_B64="${EXPENSE_B64:-}" -i onia-center node - < /opt/onia/expense-insert.mjs
