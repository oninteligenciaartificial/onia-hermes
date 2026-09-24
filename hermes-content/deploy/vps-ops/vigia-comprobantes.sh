#!/usr/bin/env bash
# ONIA — VIGIA DE COMPROBANTES DE PAGO.
#
# POR QUE EXISTE (2026-09-24, goal de cerrar la 1.0). Cuando un cliente sube el
# comprobante de su pago, el producto guarda la fila en `subscription_payments` con
# status PENDING y manda UN correo. Nada mas. Si ese correo se pierde entre los otros,
# un cliente que PAGO se queda sin plan y nadie se entera — y le fallamos justo en el
# primer momento en que puso plata. El add-on del chatbot va por la MISMA tabla
# (plan `whatsapp_addon`, lib/addon-payment.ts), asi que este vigia cubre los dos.
#
# Va por Telegram DIRECTO (ONIA_TG_DIRECTO=1), no al tablero: aprobar un pago es una
# decision de Sergio Urcullo, no trabajo que un loop pueda arreglar solo.
#
# QUE HACE (cron cada 10 min):
#   - UN aviso por cada pago PENDING nuevo: negocio, plan, ciclo, monto, cuanto lleva
#     esperando y el enlace al panel. La marca es el id del pago en $ESTADO/avisados,
#     y se escribe SOLO si Telegram confirmo: si el envio falla, reintenta en 10 min.
#   - UN recordatorio al dia (desde las $HORA hs de La Paz) con los PENDING de mas de
#     24 h. Un dia entero sin revisar es un cliente que pago y sigue sin plan.
#   - Si no puede leer la base lo dice UNA vez (tarea del tablero, es un problema del
#     sistema) y avisa cuando vuelve, cerrando esa tarea. Un vigia que falla callado
#     es exactamente el agujero que vino a tapar.
#
# SOLO LECTURA: un SELECT. No aprueba ni rechaza — aprobar sin mirar el comprobante
# es regalar el plan.
#
# DATOS PERSONALES: ninguno. El comprobante trae pagador, CI, telefono y banco; nada
# de eso sale del SELECT. Por Telegram viaja el nombre del NEGOCIO y nada mas.
#
# QUIEN NO ES CLIENTE NO AVISA — la regla del producto, traducida a SQL:
# lib/platform/cuentas-que-no-son-clientes.ts de onia-platform (prefijos `demo-` y
# `zz-qa-` en slug o correo, dominio @onia.com.bo, los correos propios con o sin
# `+etiqueta`), mas la org interna `onia-interna`. 🔴 Es una COPIA: si ese archivo
# cambia, cambia aca. La prueba la compara contra el fuente con ONIA_PLATFORM_SRC.
# La vara es la del producto y es asimetrica: excluir de mas deja a un cliente que
# pago sin aviso; por eso no se agrega nada que un negocio real pudiera llamarse.
#
# Cron propuesto: */10 * * * * /root/bin/onia-vigia-comprobantes.sh >> /var/log/onia-vigia-comprobantes.log 2>&1
set -uo pipefail

TG="${ONIA_TG:-/root/bin/onia-tg.sh}"
TABLERO="${ONIA_TABLERO:-/root/bin/onia-tablero.sh}"
ESTADO="${ONIA_COMPROBANTES_ESTADO:-/var/lib/onia-comprobantes}"
HORA="${ONIA_COMPROBANTES_HORA:-8}"      # hora de La Paz desde la que sale el recordatorio
PANEL="https://app.onia.com.bo/admin/payments"
AVISADOS="$ESTADO/avisados"               # un id de pago por linea
SIN_BASE="$ESTADO/sin-base.avisado"       # incidente abierto; guarda el id de su tarea

mkdir -p "$ESTADO" && touch "$AVISADOS" || { echo "$(date -u +%FT%TZ) FALLO: no puedo escribir $ESTADO"; exit 1; }

log() { printf '%s %s\n' "$(date -u +%FT%TZ)" "$*"; }
esc() { sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g'; }
directo() { ONIA_TG_DIRECTO=1 "$TG" "$1" >/dev/null 2>&1; }
espera() {  # minutos -> texto corto
  local m=$1
  if [ "$m" -lt 60 ]; then echo "$m min"
  elif [ "$m" -lt 1440 ]; then echo "$((m / 60)) h $((m % 60)) min"
  else echo "$((m / 1440)) d $((m % 1440 / 60)) h"; fi
}

# El correo como lo compara esCorreoDeOnia(): minusculas y sin `+etiqueta`.
EMAIL="lower(regexp_replace(coalesce(o.email, ''), '\+[^@]*(@[^@]*)\$', '\1'))"
NO_CLIENTE="starts_with(o.slug, 'demo-') or starts_with(o.slug, 'zz-qa-') or starts_with(o.slug, 'onia-interna')
  or starts_with(coalesce(o.email, ''), 'demo-') or starts_with(coalesce(o.email, ''), 'zz-qa-')
  or $EMAIL like '%@onia.com.bo'
  or $EMAIL in ('sergio.urcullo.m@gmail.com', 'oninteligenciaartificial@gmail.com')"
SQL="select sp.id,
  regexp_replace(o.name, '[[:cntrl:]]+', ' ', 'g'),
  case sp.plan when 'whatsapp_addon' then 'Add-on Chatbot WhatsApp' else sp.plan end,
  case sp.cycle when 'monthly' then 'mensual' when 'annual' then 'anual' else sp.cycle end,
  trim_scale(sp.amount),
  greatest(0, floor(extract(epoch from (now() at time zone 'utc') - sp.\"createdAt\") / 60))::int
from subscription_payments sp
join organizations o on o.id = sp.\"organizationId\"
where sp.status = 'PENDING' and not ($NO_CLIENTE)
order by sp.\"createdAt\""

ERR=$(mktemp)
trap 'rm -f "$ERR"' EXIT
FILAS=$(docker exec supabase-db psql -U postgres -d postgres -AtqX -v ON_ERROR_STOP=1 -F $'\t' -c "$SQL" 2>"$ERR" | esc)
RC=$?

# ── La base no contesta: un aviso por incidente, al tablero ──────────────────
if [ "$RC" -ne 0 ]; then
  if [ ! -f "$SIN_BASE" ]; then
    DETALLE=$(head -c 200 "$ERR" | tr -d '\000-\037' | esc)
    ID=$("$TG" "🔴 <b>Vigia de comprobantes: no puedo leer la base</b>
<code>subscription_payments</code> no contesta (rc=$RC): <code>${DETALLE:-sin detalle}</code>
Mientras siga asi, un cliente que sube su comprobante solo genera un correo." 2>/dev/null | grep -oE 't_[0-9a-f]{8}' | head -1)
    printf '%s' "$ID" > "$SIN_BASE"
  fi
  log "FALLO leyendo la base (rc=$RC)"
  exit 1
fi
if [ -f "$SIN_BASE" ]; then
  TAREA=$(grep -oE 't_[0-9a-f]{8}' "$SIN_BASE" | head -1)
  "$TG" "🟢 <b>Vigia de comprobantes</b> vuelve a leer la base." >/dev/null 2>&1 || true
  if [ -n "$TAREA" ] && [ -x "$TABLERO" ]; then
    "$TABLERO" comment "$TAREA" "Cerrada por el vigia de comprobantes: la base volvio a contestar." >/dev/null 2>&1 || true
    "$TABLERO" complete "$TAREA" >/dev/null 2>&1 || true
  fi
  rm -f "$SIN_BASE"
  log "la base volvio a contestar"
fi

# ── Un aviso por pago nuevo; juntar los de mas de 24 h ──────────────────────
VIEJOS=""
while IFS=$'\t' read -r ID NEGOCIO PLAN CICLO MONTO MIN; do
  [ -n "${ID:-}" ] || continue
  if ! grep -qxF "$ID" "$AVISADOS"; then
    if directo "💰 <b>Comprobante nuevo: un cliente PAGO y espera su plan</b>
<b>$NEGOCIO</b>
$PLAN · $CICLO · <b>Bs $MONTO</b>
Esperando hace $(espera "$MIN").
Revisar y aprobar: $PANEL"; then
      echo "$ID" >> "$AVISADOS"
      log "avisado $ID"
    else
      log "FALLO Telegram con $ID (se reintenta en la proxima vuelta)"
    fi
  fi
  [ "$MIN" -ge 1440 ] && VIEJOS+="• <b>$NEGOCIO</b> · $PLAN · Bs $MONTO · hace $(espera "$MIN")"$'\n'
done <<< "$FILAS"

# ── Recordatorio diario ─────────────────────────────────────────────────────
# La Paz es UTC-4 fijo (Bolivia no tiene horario de verano): no depende de tzdata.
HOY=$(date -u -d '-4 hours' +%F)
AHORA_H=$(date -u -d '-4 hours' +%H)
if [ -n "$VIEJOS" ] && [ "$(cat "$ESTADO/recordatorio.dia" 2>/dev/null)" != "$HOY" ] && [ "$((10#$AHORA_H))" -ge "$HORA" ]; then
  N=$(printf '%s' "$VIEJOS" | grep -c .)
  if directo "⏰ <b>$N comprobante(s) sin revisar hace mas de 24 h</b> — clientes que pagaron y siguen sin plan:
$VIEJOS
$PANEL"; then
    echo "$HOY" > "$ESTADO/recordatorio.dia"
    log "recordatorio diario: $N pendiente(s) de mas de 24 h"
  else
    log "FALLO Telegram con el recordatorio (se reintenta)"
  fi
fi

exit 0
