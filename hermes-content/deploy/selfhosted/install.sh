#!/usr/bin/env bash
set -euo pipefail

PROFILE="${1:-monitor}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

log() {
  printf '[onia-selfhosted] %s\n' "$*"
}

fail() {
  printf '[onia-selfhosted] ERROR: %s\n' "$*" >&2
  exit 1
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || fail "Missing command: $1"
}

env_value() {
  local key="$1"
  local env_file="${ROOT_DIR}/.env"
  if [ ! -f "$env_file" ]; then
    return 0
  fi
  grep -E "^${key}=" "$env_file" | tail -n 1 | cut -d= -f2- || true
}

set_env_value() {
  local key="$1"
  local value="$2"
  local env_file="${ROOT_DIR}/.env"
  if grep -qE "^${key}=" "$env_file"; then
    sed -i "s|^${key}=.*|${key}=${value}|" "$env_file"
  else
    printf '%s=%s\n' "$key" "$value" >> "$env_file"
  fi
}

ensure_secret() {
  local key="$1"
  local prefix="${2:-}"
  local current
  current="$(env_value "$key")"
  if [ -z "$current" ] || [[ "$current" == *change* ]]; then
    set_env_value "$key" "${prefix}$(openssl rand -hex 24)"
  fi
}

ensure_env() {
  if [ ! -f .env ]; then
    cp .env.example .env
    chmod 600 .env
  fi
  mkdir -p /root/.hermes
  touch /root/.hermes/.env
  chmod 600 /root/.hermes/.env

  ensure_secret "LITELLM_MASTER_KEY" "sk-"
  ensure_secret "LITELLM_SALT_KEY" "sk-"
  ensure_secret "LITELLM_POSTGRES_PASSWORD"
  ensure_secret "WEBUI_SECRET_KEY"
  ensure_secret "STIRLING_INITIALLOGIN_PASSWORD"
  ensure_secret "CRAWL4AI_API_TOKEN"
  ensure_secret "CRAWL4AI_SECRET_KEY"
  ensure_secret "CRAWL4AI_REDIS_PASSWORD"
  ensure_secret "LISTMONK_POSTGRES_PASSWORD"
  ensure_secret "LISTMONK_ADMIN_PASSWORD"
  ensure_secret "FIRECRAWL_POSTGRES_PASSWORD"
  ensure_secret "FIRECRAWL_BULL_AUTH_KEY"
}

audit() {
  log "Host"
  hostname || true
  date -Is || true
  log "OS"
  uname -a || true
  if [ -f /etc/os-release ]; then
    . /etc/os-release
    printf '%s\n' "${PRETTY_NAME:-unknown}"
  fi
  log "Resources"
  nproc || true
  free -h || true
  df -h / /opt /var 2>/dev/null || df -h
  uptime || true
  log "Docker"
  docker --version || true
  docker compose version || true
  docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}' || true
  log "Ports"
  ss -ltnp || true
  log "Existing ONIA paths"
  for p in /opt/onia-supabase/supabase/docker /opt/onia-calcom /opt/onia-selfhosted /root/backups/supabase /root/.hermes; do
    if [ -e "$p" ]; then
      ls -ld "$p"
    else
      printf 'missing %s\n' "$p"
    fi
  done
}

check_docker() {
  require_command docker
  docker compose version >/dev/null 2>&1 || fail "Docker Compose v2 is required"
}

total_mem_mb() {
  awk '/MemTotal/ {print int($2/1024)}' /proc/meminfo
}

start_profiles() {
  local profiles=("$@")
  local args=()
  for p in "${profiles[@]}"; do
    args+=(--profile "$p")
  done
  log "Starting profiles: ${profiles[*]}"
  docker compose "${args[@]}" up -d
  docker compose "${args[@]}" ps
}

install_monitor() {
  ensure_env
  check_docker
  start_profiles monitor
}

install_utility() {
  ensure_env
  check_docker
  start_profiles monitor utility
}

install_ai() {
  ensure_env
  check_docker
  if ! grep -qE '^OPENAI_API_KEY=.{20,}' /root/.hermes/.env; then
    fail "OPENAI_API_KEY is not present in /root/.hermes/.env. Add it there before starting LiteLLM/Open WebUI."
  fi
  if [ "$(total_mem_mb)" -lt 7000 ]; then
    fail "AI profile needs about 8 GB RAM to be safe on this VPS."
  fi
  start_profiles monitor ai
}

install_research() {
  ensure_env
  check_docker
  if [ "$(total_mem_mb)" -lt 7000 ]; then
    fail "Research profile with Crawl4AI needs about 8 GB RAM to be safe on this VPS."
  fi
  start_profiles research
}

install_mail() {
  ensure_env
  check_docker
  log "Mail profile is private-first: Mailpit for QA and Listmonk for lists/templates."
  log "Do not configure production SMTP until domain, PTR/rDNS, SPF, DKIM, DMARC and unsubscribe are ready."
  start_profiles mail
}

install_all_safe() {
  ensure_env
  check_docker
  start_profiles monitor utility

  if grep -qE '^OPENAI_API_KEY=.{20,}' /root/.hermes/.env && [ "$(total_mem_mb)" -ge 7000 ]; then
    start_profiles ai
  else
    log "Skipping ai profile: missing OPENAI_API_KEY or VPS has less than 8 GB RAM."
  fi

  if [ "$(total_mem_mb)" -ge 9000 ]; then
    start_profiles research
  else
    log "Skipping research profile: Crawl4AI is memory-heavy; use a larger VPS or run manually."
  fi

  log "Skipping mail profile: start it explicitly with './install.sh mail' after DNS/send decision."
}

prepare_dify() {
  check_docker
  require_command git
  require_command curl
  require_command python3

  local mem
  mem="$(total_mem_mb)"
  if [ "$mem" -lt 8000 ]; then
    fail "Dify should not be prepared on this VPS until it has at least 8 GB RAM free/available. Current total MB: $mem"
  fi

  mkdir -p /opt/onia-selfhosted/dify
  cd /opt/onia-selfhosted/dify
  if [ ! -d src/.git ]; then
    local tag
    tag="$(curl -fsSL https://api.github.com/repos/langgenius/dify/releases/latest | python3 -c 'import json,sys; print(json.load(sys.stdin)["tag_name"])')"
    git clone --branch "$tag" https://github.com/langgenius/dify.git src
  fi
  cd src/docker
  if [ ! -f .env ]; then
    cp .env.example .env
    chmod 600 .env
  fi
  log "Dify is prepared at /opt/onia-selfhosted/dify/src/docker but NOT started."
  log "Do not run its compose until ports 80/443 are patched behind Easypanel/Traefik."
}

prepare_firecrawl() {
  ensure_env
  check_docker
  require_command git
  require_command curl
  require_command python3

  if [ "$(total_mem_mb)" -lt 14000 ]; then
    fail "Firecrawl is a heavy Playwright workload. Prepare it only on KVM 4+ or a worker VPS with at least 14 GB RAM."
  fi

  mkdir -p /opt/onia-selfhosted/firecrawl
  cd /opt/onia-selfhosted/firecrawl

  if [ ! -d src/.git ]; then
    local tag
    tag="$(curl -fsSL https://api.github.com/repos/firecrawl/firecrawl/releases/latest | python3 -c 'import json,sys; data=json.load(sys.stdin); print(data.get("tag_name",""))' 2>/dev/null || true)"
    if [ -n "$tag" ]; then
      git clone --depth 1 --branch "$tag" https://github.com/firecrawl/firecrawl.git src
    else
      git clone --depth 1 https://github.com/firecrawl/firecrawl.git src
    fi
  fi

  local pg_user pg_pass pg_db bull_key fc_bind fc_port concurrency max_jobs pool_size max_cpu max_ram
  pg_user="$(env_value FIRECRAWL_POSTGRES_USER)"
  pg_pass="$(env_value FIRECRAWL_POSTGRES_PASSWORD)"
  pg_db="$(env_value FIRECRAWL_POSTGRES_DB)"
  bull_key="$(env_value FIRECRAWL_BULL_AUTH_KEY)"
  fc_bind="$(env_value FIRECRAWL_BIND)"
  fc_port="$(env_value FIRECRAWL_PORT)"
  concurrency="$(env_value FIRECRAWL_CRAWL_CONCURRENT_REQUESTS)"
  max_jobs="$(env_value FIRECRAWL_MAX_CONCURRENT_JOBS)"
  pool_size="$(env_value FIRECRAWL_BROWSER_POOL_SIZE)"
  max_cpu="$(env_value FIRECRAWL_MAX_CPU)"
  max_ram="$(env_value FIRECRAWL_MAX_RAM)"

  cat > /opt/onia-selfhosted/firecrawl/src/.env <<EOF
# ONIA generated Firecrawl config. Private research capability only.
PORT=${fc_bind:-127.0.0.1}:${fc_port:-3106}
INTERNAL_PORT=3002
HOST=0.0.0.0
USE_DB_AUTHENTICATION=false
POSTGRES_USER=${pg_user:-firecrawl}
POSTGRES_PASSWORD=${pg_pass}
POSTGRES_DB=${pg_db:-firecrawl}
BULL_AUTH_KEY=${bull_key}
SEARXNG_ENDPOINT=http://host.docker.internal:8080
NUM_WORKERS_PER_QUEUE=1
CRAWL_CONCURRENT_REQUESTS=${concurrency:-2}
MAX_CONCURRENT_JOBS=${max_jobs:-1}
BROWSER_POOL_SIZE=${pool_size:-1}
MAX_CPU=${max_cpu:-0.70}
MAX_RAM=${max_ram:-0.70}
BLOCK_MEDIA=true
LOGGING_LEVEL=info
EOF
  chmod 600 /opt/onia-selfhosted/firecrawl/src/.env

  log "Firecrawl is prepared at /opt/onia-selfhosted/firecrawl/src but NOT started."
  log "It is intentionally bound for localhost via PORT=${fc_bind:-127.0.0.1}:${fc_port:-3106}."
  log "Before starting, review upstream compose resource limits: API defaults near 8G and Playwright near 4G."
  log "Start manually only during a maintenance window: cd /opt/onia-selfhosted/firecrawl/src && docker compose up -d"
}

case "$PROFILE" in
  audit)
    audit
    ;;
  monitor)
    install_monitor
    ;;
  utility)
    install_utility
    ;;
  ai)
    install_ai
    ;;
  research)
    install_research
    ;;
  mail)
    install_mail
    ;;
  all-safe)
    install_all_safe
    ;;
  prepare-dify)
    prepare_dify
    ;;
  prepare-firecrawl)
    prepare_firecrawl
    ;;
  *)
    fail "Unknown profile '$PROFILE'. Use: audit, monitor, utility, ai, research, mail, all-safe, prepare-dify, prepare-firecrawl."
    ;;
esac
