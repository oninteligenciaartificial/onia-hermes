#!/usr/bin/env bash
# ONIA — VIGIA DE LOS LOOPS QUE CORREN FUERA DEL VPS (la PC de casa).
#
# POR QUE EXISTE: es el bloqueante que PLAN_HOMELAB.md §6 deja escrito con letras
# rojas. El aviso de un loop caido sale por `onia-tg.sh`, que en la PC de casa es
# un shim SSH al VPS: si la PC se apaga, se queda sin luz o sin internet, el que
# tendria que avisar es justamente el que no esta. Y un loop que no corre no
# genera ninguna senal — es silencio, identico al de un loop sano al que todavia
# no le toco. Ya se pago una vez con `contenido-cola`: "se apagaba con la laptop,
# nada lo reponia y nada avisaba".
#
# Por eso vive ACA, en el VPS, mirando desde afuera. Sin esto no se puede dar el
# paso 10 del plan (sacar los loops mudados del crontab del VPS).
#
# 🔴 LIMITACION QUE HAY QUE SABER ANTES DE LEER UN AVISO SUYO:
# este vigia mide la ULTIMA marca `ARRANCA` del log, y el log de un loop mudado
# llega al VPS por rsync desde la PC de casa. Si el rsync se corta pero el loop
# sigue corriendo, desde aca se ve exactamente igual que un loop muerto: silencio.
# NO se puede distinguir, asi que no se miente — los avisos dicen "no llegan sus
# registros", nunca "esta caido". El que lo lea tiene que mirar la PC.
#
# Deliberadamente tonto, igual que vigia-disco.sh: lee, compara con la cadencia y
# avisa. No reinicia nada ni toca el crontab de la otra maquina.
set -uo pipefail

# La lista es EXPLICITA a proposito: nada de adivinar que loops se mudaron
# cruzando crontabs. Mientras el archivo no exista o este vacio —o sea, hoy, con
# todo corriendo en el VPS— este script no hace absolutamente nada y sale 0. Asi
# se puede desplegar y encender en cron ANTES de mudar nada, que es el orden que
# evita el agujero: primero el vigia, despues la mudanza.
# Formato, una linea por loop:   <id> <cadencia-en-minutos>    (ej: "web-venta 60")
LISTA=${ONIA_LOOPS_REMOTOS:-/root/.config/onia/loops-remotos.txt}
LOGDIR=${ONIA_LOG_DIR:-/var/log}
ESTADO=${ONIA_VIGIA_ESTADO:-/var/lib/onia-vigia-remotos}
TG=${ONIA_TG:-/root/bin/onia-tg.sh}
CICLOS=${ONIA_VIGIA_CICLOS:-2}          # cuantas cadencias de silencio se toleran

[ -s "$LISTA" ] || exit 0

mkdir -p "$ESTADO" || exit 0
AHORA=$(date +%s)
TOTAL=0; MUDOS=""; VIVOS=""; DETALLE=""

while read -r ID CAD _; do
  case "$ID" in ''|'#'*) continue ;; esac
  # Un id raro no se interpola en el mensaje: se descarta y se dice. Lo que sale
  # de aca va a Telegram con parse_mode=HTML, y validar en la entrada es mas
  # barato (y mas seguro) que escapar en cada uso.
  if ! printf '%s' "$ID" | grep -qE '^[a-z0-9][a-z0-9_-]*$' || ! printf '%s' "${CAD:-}" | grep -qE '^[0-9]+$'; then
    printf 'linea invalida en %s: %s %s\n' "$LISTA" "$ID" "${CAD:-}" >&2
    continue
  fi
  TOTAL=$((TOTAL + 1))
  LOG="$LOGDIR/onia-loop-$ID.log"
  ULTIMA=$(grep "===== ARRANCA $ID " "$LOG" 2>/dev/null | tail -1 | awk '{print $1}')
  T=0
  [ -n "$ULTIMA" ] && T=$(date -d "$ULTIMA" +%s 2>/dev/null || echo 0)
  LIMITE=$(( CAD * CICLOS * 60 ))
  if [ "$T" -gt 0 ] && [ $(( AHORA - T )) -lt "$LIMITE" ]; then
    VIVOS="$VIVOS $ID"
  else
    MUDOS="$MUDOS $ID"
    if [ "$T" -gt 0 ]; then
      DETALLE="$DETALLE
• <code>$ID</code> — sin arrancar hace $(( (AHORA - T) / 60 )) min (cadencia ${CAD} min)"
    else
      DETALLE="$DETALLE
• <code>$ID</code> — sin ningun registro en el VPS (cadencia ${CAD} min)"
    fi
  fi
done < "$LISTA"

[ "$TOTAL" -gt 0 ] || exit 0
N_MUDOS=$(echo $MUDOS | wc -w)
APAGON="$ESTADO/_apagon"

# Caso 1 — TODOS callados a la vez: no son cinco loops rotos, es la maquina. Un
# solo mensaje. Cinco avisos identicos logran que nadie lea el sexto.
if [ "$N_MUDOS" = "$TOTAL" ] && [ "$TOTAL" -gt 1 ] && [ ! -f "$APAGON" ]; then
  "$TG" "🔴 <b>La PC de casa no da senales</b> — los $TOTAL loops mudados estan callados a la vez.

Eso es la maquina, no los loops: apagada, sin luz, sin internet, o su rsync de logs cortado.
$DETALLE

Desde el VPS no se puede distinguir 'apagada' de 'sin subir registros'. Hay que mirar la PC." >/dev/null 2>&1 || true
  touch "$APAGON"
  for id in $MUDOS; do touch "$ESTADO/$id"; done
  exit 0
fi

# Caso 1b — volvio a aparecer alguna senal despues de un apagon.
if [ -f "$APAGON" ] && [ -n "$VIVOS" ]; then
  rm -f "$APAGON"
  "$TG" "🟢 <b>La PC de casa volvio</b> — llegan registros de: <code>$(echo $VIVOS | sed 's/ /<\/code>, <code>/g')</code>." >/dev/null 2>&1 || true
  # Este mensaje YA nombra los que volvieron: si ademas se dispara el "recuperado"
  # de mas abajo por cada uno, un apagon de cinco loops manda seis mensajes que
  # dicen lo mismo. Se limpian sus marcas aca y el bloque de abajo los saltea.
  for id in $VIVOS; do rm -f "$ESTADO/$id"; done
fi

# Caso 2 — uno solo callado: ese loop. Un aviso por episodio, no uno por vuelta
# del cron (misma disciplina que vigia-disco.sh).
for id in $MUDOS; do
  [ -f "$ESTADO/$id" ] && continue
  CAD=$(awk -v i="$id" '$1==i{print $2}' "$LISTA")
  "$TG" "🔴 <b>Loop remoto callado</b>: <code>$id</code>

No llegan sus registros al VPS hace mas de $CICLOS cadencias (cadencia ${CAD} min).
Puede estar caido en la PC de casa, o estar corriendo bien y no subir el log. Desde aca no se distingue.

Los otros loops remotos si estan llegando, asi que la PC esta viva." >/dev/null 2>&1 || true
  touch "$ESTADO/$id"
done

# Caso 3 — recuperado. Corto: lo importante era el rojo.
for id in $VIVOS; do
  [ -f "$ESTADO/$id" ] || continue
  rm -f "$ESTADO/$id"
  "$TG" "🟢 <b>Loop remoto recuperado</b>: <code>$id</code> volvio a arrancar." >/dev/null 2>&1 || true
done

exit 0
