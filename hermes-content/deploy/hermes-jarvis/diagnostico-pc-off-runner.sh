#!/usr/bin/env bash
# Candidato de transporte para revisión, NO conectado al workflow y NO ejecutar durante
# la preparación offline. El pin debe llegar por una ruta confiable ya aprobada.
set -euo pipefail

readonly TARGET='root@187.77.16.63'
readonly PINNED_HOST='187.77.16.63'
readonly REMOTE_SCRIPT='hermes-content/deploy/hermes-jarvis/diagnostico-pc-off.sh'

: "${RUNNER_TEMP:?RUNNER_TEMP requerido}"
: "${VPS_SSH_KEY_FILE:?VPS_SSH_KEY_FILE debe apuntar a la identidad ya configurada}"
: "${VPS_KNOWN_HOSTS_FILE:?Falta pin hostkey confiable; cierre seguro}"

[[ -f "$VPS_SSH_KEY_FILE" && -r "$VPS_SSH_KEY_FILE" ]] || { echo 'ssh_identity_available=false' >&2; exit 78; }
[[ -f "$VPS_KNOWN_HOSTS_FILE" && -r "$VPS_KNOWN_HOSTS_FILE" ]] || { echo 'hostkey_pin_available=false' >&2; exit 78; }
ssh-keygen -F "$PINNED_HOST" -f "$VPS_KNOWN_HOSTS_FILE" >/dev/null 2>&1 || {
  echo 'trusted_hostkey_pin_match=false' >&2
  exit 78
}

command -v timeout >/dev/null 2>&1 || { echo 'timeout_available=false' >&2; exit 78; }
command -v ssh >/dev/null 2>&1 || { echo 'ssh_available=false' >&2; exit 78; }
[[ -f "$REMOTE_SCRIPT" && -r "$REMOTE_SCRIPT" ]] || { echo 'diagnostic_candidate_available=false' >&2; exit 78; }

set +e
timeout --signal=TERM 60s ssh \
  -i "$VPS_SSH_KEY_FILE" \
  -o BatchMode=yes \
  -o IdentitiesOnly=yes \
  -o ConnectTimeout=10 \
  -o StrictHostKeyChecking=yes \
  -o "UserKnownHostsFile=$VPS_KNOWN_HOSTS_FILE" \
  -o GlobalKnownHostsFile=/dev/null \
  -o UpdateHostKeys=no \
  -o VerifyHostKeyDNS=no \
  "$TARGET" 'bash -s' < "$REMOTE_SCRIPT" 2>/dev/null | awk '
      /^tool\.(bash|python3|node|git|chromium)\.available=(true|false)$/ { print; next }
      /^tool\.(bash|python3|node|git|chromium)\.version=[A-Za-z0-9._+(),\/ :-]{1,100}$/ { print; next }
      /^resource\.(root_free_kb|memory_available_kb)=(unknown|[0-9]+)$/ { print; next }
      /^path\.(hermes_home|hermes_jobs|hermes_python|chromium_bin)\.present=(true|false)$/ { print; next }
      { rejected=1 }
      END { if (rejected) { print "diagnostic_output_rejected=true" > "/dev/stderr"; exit 65 } }
    '
status=$?
set -e
if [[ $status -ne 0 ]]; then
  printf 'diagnostic_transport_exit=%s\n' "$status" >&2
  exit "$status"
fi
