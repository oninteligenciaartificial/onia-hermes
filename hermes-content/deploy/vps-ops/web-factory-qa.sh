#!/bin/sh
# ONIA Web Factory QA: regenera los demos con el codigo actual y valida el HTML
# (roto / vacio / template sin renderizar). Emite una linea JSON para n8n.
WF=/opt/onia-hermes/web-factory
cd "$WF" 2>/dev/null || { printf '{"ok":false,"checked":0,"broken":"no web-factory dir"}\n'; exit 0; }

# 1. Regenerar demos con el codigo actual (cada uno; skincare usa template store)
for spec in "demo" "skincare-demo --template store" "restaurant-demo" "clinic-demo" "engineering-demo" "saas-demo"; do
  pnpm generate $spec >/dev/null 2>&1
done

# 2. Validar cada index.html generado
broken=""
checked=0
for d in $(ls out 2>/dev/null); do
  f="out/$d/index.html"
  [ -f "$f" ] || { broken="$broken $d(falta-index)"; continue; }
  checked=$((checked + 1))
  size=$(wc -c < "$f")
  if [ "$size" -lt 800 ]; then broken="$broken $d(chico:${size}B)"; continue; fi
  grep -q "</body>" "$f" || { broken="$broken $d(sin-body)"; continue; }
  if grep -qE '\{\{|\[object Object\]|>undefined<|>NaN<|Cannot read|ReferenceError|is not defined' "$f"; then
    broken="$broken $d(markers-rotos)"
  fi
done

ok=true
[ -n "$broken" ] && ok=false
[ "$checked" -eq 0 ] && { ok=false; broken="$broken sin-demos-generados"; }
printf '{"ok":%s,"checked":%s,"broken":"%s"}\n' "$ok" "$checked" "$(echo $broken | xargs)"
