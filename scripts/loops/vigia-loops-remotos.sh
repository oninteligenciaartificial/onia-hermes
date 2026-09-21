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
# Como se llama la maquina en los avisos. NO es cosmetico: este script nacio para
# los loops de la PC de casa y tenia "La PC de casa" escrito a mano en los cuatro
# mensajes. Reusarlo tal cual para los loops del VPS —que desde el 2026-09-05, con
# `supervisor` congelado, no tenian NADIE que los mirara— habria avisado "la PC de
# casa no da senales" cuando el que murio es el integrador. Un aviso que apunta a
# la maquina equivocada a las 3 de la manana cuesta mas que no tenerlo.
MAQUINA=${ONIA_VIGIA_MAQUINA:-la PC de casa}
CICLOS=${ONIA_VIGIA_CICLOS:-2}          # cuantas cadencias de silencio se toleran

[ -s "$LISTA" ] || exit 0

mkdir -p "$ESTADO" || exit 1
# El aviso de que los loops dejaron de correr debe llegar sin depender de esos
# loops. Una entrega fallida conserva las marcas para reintentar en el proximo
# cron; nunca se registra como notificada solo porque se intento enviar.
notificar() {
  if ONIA_TG_DIRECTO=1 "$TG" "$1" >/dev/null 2>&1; then return 0; fi
  echo "No se entrego el aviso del vigia; se reintentara en la proxima ejecucion" >&2
  return 1
}
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
  LOG="$LOGDIR/onia-loop-$ID.log"
  ULTIMA=$(grep "===== ARRANCA $ID " "$LOG" 2>/dev/null | tail -1 | awk '{print $1}')
  T=0
  [ -n "$ULTIMA" ] && T=$(date -d "$ULTIMA" +%s 2>/dev/null || echo 0)
  LIMITE=$(( CAD * CICLOS * 60 ))

  # GRACIA DEL RECIEN MUDADO. Un id que aparece por primera vez en la lista se
  # anota con su fecha de alta y no se juzga hasta que pase una ventana entera
  # DESDE ESA ALTA — no desde la ultima marca del log. Sin esto, mudar un loop
  # a casa dispara un rojo y despues un verde, los dos falsos: su log
  # sincronizado suele traer corridas viejas (medido el 2026-09-06 con
  # `web-venta`: 19 h de un experimento del 05-sep, dado por caido 9 min despues
  # de la mudanza y antes de su primera corrida programada). El caso "sin ningun
  # registro" que este script ya cubria NO alcanza: ahi hay registro, y viejo se
  # lee como un loop que corria y se callo.
  ALTA_F="$ESTADO/$ID.alta"
  [ -f "$ALTA_F" ] || printf '%s\n' "$AHORA" > "$ALTA_F"
  ALTA=$(cat "$ALTA_F" 2>/dev/null)
  case "$ALTA" in ''|*[!0-9]*) ALTA=$AHORA ;; esac

  # La gracia tapa el ROJO, nunca el verde: si ya arranco, se juzga vivo igual.
  # Y no cuenta para TOTAL, porque si contara, un id en gracia impediria detectar
  # el apagon del resto (MUDOS nunca igualaria a TOTAL).
  if { [ "$T" = 0 ] || [ $(( AHORA - T )) -ge "$LIMITE" ]; } && [ $(( AHORA - ALTA )) -lt "$LIMITE" ]; then
    continue
  fi

  TOTAL=$((TOTAL + 1))
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
  notificar "🔴 <b>$MAQUINA no da senales</b> — sus $TOTAL loops estan callados a la vez.

Eso es la maquina o el corredor, no un loop suelto.
$DETALLE

Desde aca no se distingue 'esta caida' de 'corre y no deja registro'. Hay que mirar $MAQUINA." || exit 1
  touch "$APAGON" || exit 1
  for id in $MUDOS; do touch "$ESTADO/$id" || exit 1; done
  exit 0
fi

# Caso 1b — volvio a aparecer alguna senal despues de un apagon.
if [ -f "$APAGON" ] && [ -n "$VIVOS" ]; then
  notificar "🟢 <b>$MAQUINA volvio</b> — llegan registros de: <code>$(echo $VIVOS | sed 's/ /<\/code>, <code>/g')</code>." || exit 1
  rm -f "$APAGON" || exit 1
  # Este mensaje YA nombra los que volvieron: si ademas se dispara el "recuperado"
  # de mas abajo por cada uno, un apagon de cinco loops manda seis mensajes que
  # dicen lo mismo. Se limpian sus marcas aca y el bloque de abajo los saltea.
  for id in $VIVOS; do rm -f "$ESTADO/$id" || exit 1; done
fi

# Caso 2 — uno solo callado: ese loop. Un aviso por episodio, no uno por vuelta
# del cron (misma disciplina que vigia-disco.sh).
for id in $MUDOS; do
  [ -f "$ESTADO/$id" ] && continue
  CAD=$(awk -v i="$id" '$1==i{print $2}' "$LISTA")
  notificar "🔴 <b>Loop callado</b>: <code>$id</code> — en $MAQUINA

Hace mas de $CICLOS cadencias que no deja un ARRANCA nuevo (cadencia ${CAD} min).
Puede estar caido, o correr y no dejar registro. Desde aca no se distingue.

Los otros loops de $MAQUINA si estan llegando, asi que la maquina esta viva." || exit 1
  touch "$ESTADO/$id" || exit 1
done

# Caso 3 — recuperado. Corto: lo importante era el rojo.
for id in $VIVOS; do
  [ -f "$ESTADO/$id" ] || continue
  notificar "🟢 <b>Loop recuperado</b>: <code>$id</code> volvio a arrancar en $MAQUINA." || exit 1
  rm -f "$ESTADO/$id" || exit 1
done

exit 0
