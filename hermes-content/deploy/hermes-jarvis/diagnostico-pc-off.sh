#!/usr/bin/env bash
# Candidato offline de diagnóstico mínimo para preparación del VPS con la PC apagada.
# Ejecuta solo comprobaciones de disponibilidad, versiones y espacio; no lee servicios,
# trabajos, logs, variables, identidades, mensajes ni configuración de negocio.
set -eu
export LC_ALL=C

emit_tool() {
  name=$1
  bin=$2
  version_flag=$3
  if command -v "$bin" >/dev/null 2>&1; then
    version=$("$bin" "$version_flag" 2>&1 | head -n 1 | tr -cd '[:print:]' | cut -c1-100 || true)
    version_re='^[A-Za-z0-9._+(),/: -]{1,100}$'
    [[ "$version" =~ $version_re ]] || version=unknown
    printf 'tool.%s.available=true\n' "$name"
    printf 'tool.%s.version=%s\n' "$name" "${version:-unknown}"
  else
    printf 'tool.%s.available=false\n' "$name"
  fi
}

emit_path() {
  name=$1
  path=$2
  if [ -e "$path" ]; then
    printf 'path.%s.present=true\n' "$name"
  else
    printf 'path.%s.present=false\n' "$name"
  fi
}

emit_tool bash bash --version
emit_tool python3 python3 --version
emit_tool node node --version
emit_tool git git --version
emit_tool chromium chromium --version

# Emit only numeric capacity values; do not expose device, mount, or process names.
disk_kb=$(df -Pk / | awk 'NR==2 {print $4}')
[[ "$disk_kb" =~ ^[0-9]+$ ]] || disk_kb=unknown
printf 'resource.root_free_kb=%s\n' "${disk_kb:-unknown}"
if command -v free >/dev/null 2>&1; then
  mem_kb=$(free -k | awk '/^Mem:/ {print $7}')
  [[ "$mem_kb" =~ ^[0-9]+$ ]] || mem_kb=unknown
  printf 'resource.memory_available_kb=%s\n' "${mem_kb:-unknown}"
else
  printf 'resource.memory_available_kb=unknown\n'
fi

emit_path hermes_home /root/.hermes
emit_path hermes_jobs /root/.hermes/cron/jobs.json
emit_path hermes_python /usr/local/lib/hermes-agent/venv/bin/python
emit_path chromium_bin /usr/bin/chromium
