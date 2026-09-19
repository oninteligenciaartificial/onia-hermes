#!/usr/bin/env bash
# Prueba de `vigia-ci.sh`. Lo unico que ese script tiene de dificil es CUANDO
# habla y cuando se calla, asi que eso es lo que se prueba — con Telegram y la
# API de GitHub sustituidos, sin red y sin token.
#
# El caso 3 (rojo -> rojo = silencio) es el que justifica el archivo: un vigia que
# repite el mismo aviso cada 10 minutos se apaga solo en la cabeza del que lo lee,
# y eso NO se nota mirando el codigo una vez.
set -uo pipefail

DIR=$(cd "$(dirname "$0")" && pwd)
SUT="$DIR/vigia-ci.sh"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

FALLOS=0
ok()    { printf '  ok   — %s\n' "$1"; }
falla() { printf '  FALLA — %s\n     esperaba: %s\n     obtuvo:   %s\n' "$1" "$2" "$3"; FALLOS=$((FALLOS+1)); }

# Telegram falso: escribe lo que le mandan, no manda nada.
cat > "$TMP/tg.sh" <<'FIN'
#!/usr/bin/env bash
printf '%s\n---\n' "$1" >> "$TMP_MENSAJES"
FIN
chmod 755 "$TMP/tg.sh"

fixture() { printf '%s' "$1" > "$TMP/fx.json"; }

run() {
  : > "$TMP/mensajes.txt"
  TMP_MENSAJES="$TMP/mensajes.txt" \
  ONIA_TG="$TMP/tg.sh" \
  ONIA_CI_MARCA_DIR="$TMP" \
  ONIA_CI_FIXTURE="$TMP/fx.json" \
  ONIA_CI_OBJETIVOS="oninteligenciaartificial/onia-platform:master" \
  bash "$SUT"
  RC=$?
  MSGS=$(cat "$TMP/mensajes.txt")
  return $RC
}

corridas() {  # corridas <conclusion> [status] [created_at]
  printf '{"workflow_runs":[{"name":"CI","status":"%s","conclusion":%s,"head_sha":"0c54d65abc","html_url":"https://x/1","created_at":"%s"}]}' \
    "${2:-completed}" "$([ "$1" = "null" ] && echo null || printf '"%s"' "$1")" \
    "${3:-$(date -u +%Y-%m-%dT%H:%M:%SZ)}"
}

echo "vigia-ci — maquina de estados"

# 1. Verde de entrada: no molesta a nadie.
fixture "$(corridas success)"; run
[ -z "$MSGS" ] && ok "verde sin historial: no manda nada" || falla "verde sin historial" "(nada)" "$MSGS"

# 2. Se pone rojo: avisa una vez y deja la marca.
fixture "$(corridas failure)"; run
case "$MSGS" in *"CI en ROJO"*) ok "verde -> rojo: avisa" ;; *) falla "verde -> rojo" "CI en ROJO" "$MSGS" ;; esac
ls "$TMP"/onia-ci-*.rojo >/dev/null 2>&1 && ok "deja la marca del episodio" || falla "marca" "un .rojo" "ninguno"

# 3. EL CASO QUE IMPORTA: sigue rojo, se calla.
fixture "$(corridas failure)"; run
[ -z "$MSGS" ] && ok "rojo -> rojo: SILENCIO (no repite cada vuelta)" || falla "rojo -> rojo" "(nada)" "$MSGS"

# 4. Vuelve a verde: avisa recuperado y limpia.
fixture "$(corridas success)"; run
case "$MSGS" in *"CI recuperado"*) ok "rojo -> verde: avisa recuperado" ;; *) falla "rojo -> verde" "CI recuperado" "$MSGS" ;; esac
ls "$TMP"/onia-ci-*.rojo >/dev/null 2>&1 && falla "limpieza de marca" "sin .rojo" "quedo la marca" || ok "borra la marca"

# 5. Una corrida EN CURSO no es un veredicto.
fixture "$(corridas null in_progress)"; run
[ -z "$MSGS" ] && ok "corrida en curso: no dice nada" || falla "en curso" "(nada)" "$MSGS"

# 6. cancelled tampoco es un veredicto sobre el codigo.
fixture "$(corridas cancelled)"; run
[ -z "$MSGS" ] && ok "cancelled: no dice nada" || falla "cancelled" "(nada)" "$MSGS"

# 7. La API contesta un error: avisa del VIGIA y NO declara verde.
fixture "$(corridas failure)"; run    # dejamos una marca roja puesta
fixture '{"message":"Bad credentials"}'; run
case "$MSGS" in *"la API de GitHub no contesta"*) ok "error de API: avisa del vigia" ;; *) falla "error de API" "aviso de API" "$MSGS" ;; esac
ls "$TMP"/onia-ci-*.rojo >/dev/null 2>&1 && ok "con la API caida NO borra la marca roja" || falla "marca tras error de API" "la marca sigue" "se borro"

# 8. Sin token y sin fixture: avisa UNA vez y sale 0.
rm -f "$TMP"/onia-ci-*.avisado
: > "$TMP/mensajes.txt"
TMP_MENSAJES="$TMP/mensajes.txt" ONIA_TG="$TMP/tg.sh" ONIA_CI_MARCA_DIR="$TMP" \
  ONIA_CI_TOKEN_FILE="$TMP/no-existe" bash "$SUT"; RC=$?
MSGS=$(cat "$TMP/mensajes.txt")
[ "$RC" = "0" ] && ok "sin token: sale 0 (no rompe la cadena)" || falla "sin token exit" "0" "$RC"
case "$MSGS" in *"Vigia de CI sin token"*) ok "sin token: avisa que le falta" ;; *) falla "sin token aviso" "Vigia de CI sin token" "$MSGS" ;; esac
: > "$TMP/mensajes.txt"
TMP_MENSAJES="$TMP/mensajes.txt" ONIA_TG="$TMP/tg.sh" ONIA_CI_MARCA_DIR="$TMP" \
  ONIA_CI_TOKEN_FILE="$TMP/no-existe" bash "$SUT"
[ -z "$(cat "$TMP/mensajes.txt")" ] && ok "sin token: no vuelve a insistir" || falla "sin token repite" "(nada)" "$(cat "$TMP/mensajes.txt")"

# 9. EL AVISO DICE CUANDO FUE EL FALLO.
#
# Nace del 2026-09-18: la tarea `t_8e76db40` decia «CI en ROJO ... failure en
# 545dd28 / Mientras siga asi, master esta roto y el deploy va a fallar», y ese
# run era del **5 de septiembre**, ya curado el 6 por `.gitleaks.toml`. El CI de
# master estaba VERDE (medido por la API: `Security success` en `8bf65db`).
# Sin la fecha adentro, el que lee no puede distinguir un rojo de hace cinco
# minutos de uno de hace trece dias — y el 17-sep un carril gasto una vuelta
# ENTERA corriendo los cinco gates a mano para terminar escribiendo que igual no
# podia juzgarlo. Un aviso sin fecha convierte cada lectura en una investigacion.
#
# Se borra TODO el historial, no solo la marca roja: este caso es «la primera vez
# que miro este workflow», y ahi un rojo viejo SI se avisa — puede llevar trece
# dias roto. Lo que el caso 12 prohibe es RETROCEDER sobre algo ya juzgado.
rm -f "$TMP"/onia-ci-*
VIEJA=$(date -u -d "-13 days" +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u -v-13d +%Y-%m-%dT%H:%M:%SZ)
fixture "$(corridas failure completed "$VIEJA")"; run
case "$MSGS" in
  *"${VIEJA%%T*}"*) ok "el aviso rojo nombra la FECHA del run" ;;
  *) falla "fecha en el aviso" "la fecha del run ($VIEJA)" "$MSGS" ;;
esac

# 10. Y si el fallo es VIEJO, lo dice con todas las letras.
# «hace 13 dias» es lo que separa «andá a arreglarlo ahora» de «esto ya se curó
# y nadie cerró el aviso». La antiguedad es el dato, no el adorno.
case "$MSGS" in
  *"hace 13 d"*) ok "un fallo viejo se anuncia como viejo" ;;
  *) falla "antiguedad del fallo" "hace 13 d..." "$MSGS" ;;
esac

# 11. Un rojo RECIEN salido no se disfraza de viejo.
# Sin este caso, poner la palabra "hace" siempre pasaria el 10 y el aviso diria
# "hace 0 dias" en el unico momento en que la antiguedad no aporta nada.
rm -f "$TMP"/onia-ci-*.rojo
fixture "$(corridas failure)"; run
case "$MSGS" in
  *"hace "*" d"*) falla "rojo reciente" "sin antiguedad" "$MSGS" ;;
  *) ok "rojo de hoy: no agrega antiguedad" ;;
esac

# ── 12-14. LA RESPUESTA DE LA API NO PUEDE RETROCEDER EN EL TIEMPO ──────────
#
# Medido el 2026-09-19 en /var/log/onia-tg.log del VPS: **45 avisos «CI en ROJO»
# y 45 «CI recuperado»**, alternados, cada verde exactamente UNA corrida del cron
# (10 min) despues de su rojo, con el CI de `master` VERDE todo el tiempo (la API
# da `success` en las 30 corridas mas recientes). O sea el vigia OSCILA.
#
# La causa: `actions/runs` es eventualmente consistente y cada tanto contesta una
# pagina donde la corrida completa mas reciente de un workflow es una VIEJA — la
# del 5-sep, que fue `failure` de verdad y se curo el 6. El vigia le creia,
# avisaba rojo y dejaba su marca; diez minutos despues la API contestaba bien, lo
# leia como «recuperado» y BORRABA SU PROPIA MARCA. Por eso `/var/lib` nunca tuvo
# una marca `onia-ci-*.rojo` y el mismo aviso renacia para siempre.
#
# Y el daño no es simetrico: el rojo CREA TAREA y el verde sale «INFORMATIVO (sin
# tarea)», asi que cada oscilacion deja una tarea roja viva que nadie cierra —
# tres en un solo dia (t_2d47c3aa, t_8e76db40, t_24519a2b). El 17-sep un carril
# gasto una vuelta ENTERA corriendo los cinco gates a mano por creerle a una.
#
# `created_at` de un workflow solo AVANZA. Si la corrida que llega es mas vieja
# que la ultima ya juzgada, la respuesta esta stale y no se toca NADA — ni aviso,
# ni marca —, la misma politica que ya rige para `__ERROR__`.
AHORA=$(date -u +%Y-%m-%dT%H:%M:%SZ)
ANTIGUA=$(date -u -d "-14 days" +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u -v-14d +%Y-%m-%dT%H:%M:%SZ)

# 12. Verde ya juzgado y despues la API retrocede a un rojo viejo: no avisa nada.
rm -f "$TMP"/onia-ci-*
fixture "$(corridas success completed "$AHORA")"; run
fixture "$(corridas failure completed "$ANTIGUA")"; run
[ -z "$MSGS" ] && ok "API stale con un rojo VIEJO: no avisa" || falla "rojo stale" "(nada)" "$MSGS"
ls "$TMP"/onia-ci-*.rojo >/dev/null 2>&1 && falla "marca por rojo stale" "sin .rojo" "dejo la marca" || ok "rojo stale: tampoco deja marca"

# 13. La direccion SIMETRICA, que es la que borraba la marca: un verde stale NO
# puede declarar «recuperado» sobre un rojo vigente ni limpiar su marca.
rm -f "$TMP"/onia-ci-*
fixture "$(corridas failure completed "$AHORA")"; run
case "$MSGS" in *"CI en ROJO"*) ok "rojo de verdad: avisa" ;; *) falla "rojo real" "CI en ROJO" "$MSGS" ;; esac
fixture "$(corridas success completed "$ANTIGUA")"; run
case "$MSGS" in *"recuperado"*) falla "verde stale" "(nada)" "$MSGS" ;; *) ok "API stale con un verde VIEJO: no dice recuperado" ;; esac
ls "$TMP"/onia-ci-*.rojo >/dev/null 2>&1 && ok "verde stale: NO borra la marca roja" || falla "marca tras verde stale" "la marca sigue" "se borro"

# 14. Y la red sigue viva: un rojo POSTERIOR al ultimo verde se avisa igual.
# Sin este caso, negarse a mirar siempre pasaria el 12 y el 13, y el vigia
# quedaria apagado con cara de arreglado — que es peor que el oscilador.
rm -f "$TMP"/onia-ci-*
POSTERIOR=$(date -u -d "+1 hour" +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u -v+1H +%Y-%m-%dT%H:%M:%SZ)
fixture "$(corridas success completed "$AHORA")"; run
fixture "$(corridas failure completed "$POSTERIOR")"; run
case "$MSGS" in *"CI en ROJO"*) ok "rojo mas NUEVO que el ultimo verde: avisa" ;; *) falla "rojo nuevo" "CI en ROJO" "$MSGS" ;; esac

# 15. Sin `created_at` no se puede comparar: se juzga, no se calla.
# Un campo ausente no es una respuesta stale, y callarse ahi apagaria el vigia
# entero el dia que GitHub deje de mandar la fecha.
rm -f "$TMP"/onia-ci-*
fixture '{"workflow_runs":[{"name":"CI","status":"completed","conclusion":"success","head_sha":"0c54d65abc","html_url":"https://x/1"}]}'; run
fixture '{"workflow_runs":[{"name":"CI","status":"completed","conclusion":"failure","head_sha":"0c54d65abc","html_url":"https://x/1"}]}'; run
case "$MSGS" in *"CI en ROJO"*) ok "sin fecha: juzga igual (no apaga la red)" ;; *) falla "sin created_at" "CI en ROJO" "$MSGS" ;; esac

echo
if [ "$FALLOS" = "0" ]; then echo "vigia-ci: TODO VERDE"; exit 0; fi
echo "vigia-ci: $FALLOS fallo(s)"; exit 1
