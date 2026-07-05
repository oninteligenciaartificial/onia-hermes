#!/usr/bin/env bash
# ONIA — Generate a commercial proposal for a client slug, autonomously, on the VPS.
# Runs the OFFICIAL generator (hermes-content/propuestas/generador) for HTML, then
# renders the PDF with the VPS chromium (the generator's own PDF path is Windows-only).
# Prints a single JSON line on stdout: {ok, slug, pdf_b64} or {ok:false, stage, slug}.
#
# Usage: generar-propuesta-pdf.sh <slug>     (slug must be kebab-case [a-z0-9-])
# Called by the n8n workflow "ONIA - Generar Propuesta (oficial)" over SSH.
set -uo pipefail

SLUG="${1:-}"
case "$SLUG" in
  ''|*[!a-z0-9-]*) echo '{"ok":false,"stage":"bad_slug"}'; exit 0 ;;
esac

GEN=/root/.hermes/propuestas/generador
OUT=/root/.hermes/propuestas
LOG=/tmp/propuesta-$SLUG.log

[ -f "$GEN/generar-propuestas.js" ] || { echo '{"ok":false,"stage":"no_generador"}'; exit 0; }
cd "$GEN" || { echo '{"ok":false,"stage":"cd"}'; exit 0; }

if ! node generar-propuestas.js "$SLUG" >"$LOG" 2>&1; then
  echo "{\"ok\":false,\"stage\":\"generador\",\"slug\":\"$SLUG\"}"; exit 0
fi
[ -f "$OUT/propuesta-$SLUG.html" ] || { echo "{\"ok\":false,\"stage\":\"no_html\",\"slug\":\"$SLUG\"}"; exit 0; }

HS=$(find /root/.cache/ms-playwright -type f -name chrome 2>/dev/null | head -1)
[ -n "$HS" ] || { echo "{\"ok\":false,\"stage\":\"no_chromium\",\"slug\":\"$SLUG\"}"; exit 0; }

if ! "$HS" --headless --no-sandbox --disable-gpu \
     --print-to-pdf="$OUT/propuesta-$SLUG.pdf" \
     "file://$OUT/propuesta-$SLUG.html" >>"$LOG" 2>&1; then
  echo "{\"ok\":false,\"stage\":\"pdf\",\"slug\":\"$SLUG\"}"; exit 0
fi
[ -f "$OUT/propuesta-$SLUG.pdf" ] || { echo "{\"ok\":false,\"stage\":\"no_pdf\",\"slug\":\"$SLUG\"}"; exit 0; }

B64=$(base64 -w0 "$OUT/propuesta-$SLUG.pdf")
printf '{"ok":true,"slug":"%s","pdf_b64":"%s"}\n' "$SLUG" "$B64"
