#!/usr/bin/env bash
# ONIA — VIGIA DEL CI DE GITHUB.
#
# POR QUE EXISTE: el CI ataja `master` roto y NO se lo dice a nadie. Medido el
# 2026-09-06 por la sesion de producto: un `.ico` guardado en RGB (Next lo exige
# en RGBA) tumbo el build, GitHub Actions lo marco `failure`... y se enteraron
# ~10 minutos despues, de casualidad, cuando el build del VPS fallo en sus manos.
# Si en vez de una persona hubiera sido un loop a las 3 de la manana, `master`
# quedaba roto hasta que alguien mirara.
#
# Y no era un agujero chico: `grep -rl "gh run\|actions/runs\|workflow_run"
# /root/bin/*.sh` daba VACIO. Hay ~20 vigias en el crontab —embudo, leads, disco,
# aprobaciones, loops remotos, sin-respuesta— y ninguno miraba el CI. La red
# existia y funcionaba; lo que faltaba era que avisara.
#
# DELIBERADAMENTE TONTO, igual que `vigia-disco.sh`: lee, compara con el estado
# anterior y avisa. No reintenta, no arregla, no revierte. Arreglar sin que nadie
# mire es como se pierden cosas.
#
# AVISA POR CAMBIO, NO POR ESTADO. Un workflow que ya estaba rojo y sigue rojo
# NO manda nada: treinta mensajes iguales logran que nadie lea el 31. Manda uno
# al ponerse rojo y uno al recuperarse — el patron de `vigia-disco.sh`.
#
# 🔴 NO USA `gh`: no esta instalado en el VPS (verificado 2026-09-06). Va por la
# API REST con curl.
#
# 🔴 EL TOKEN NO VIVE ACA. Se lee de $TOKEN_FILE, root-only. `onia-platform` es
# privado, asi que hace falta uno con permiso **Actions: Read-only**. El
# `GITHUB_TOKEN` que ya esta en el contenedor de n8n NO sirve: lee el repo (200)
# pero da 403 "Resource not accessible by personal access token" en
# `actions/runs`, `check-runs` y `status` — las tres puertas, probadas.
# Sin el archivo, este script avisa UNA vez que le falta y sale 0. No grita.
set -uo pipefail

# Que se vigila. `<owner>/<repo>:<rama>`, separados por espacios.
# Hoy solo `onia-platform`: es el repo con `ci.yml` y el que le llega al cliente.
# `onia-hermes` no tiene CI de build —sus workflows son auditorias diarias— asi
# que sumarlo hoy seria ruido. Agregarlo el dia que lo tenga es esta linea.
OBJETIVOS="${ONIA_CI_OBJETIVOS:-oninteligenciaartificial/onia-platform:master}"

TOKEN_FILE="${ONIA_CI_TOKEN_FILE:-/root/.config/onia/github-token}"
MARCA_DIR="${ONIA_CI_MARCA_DIR:-/var/lib}"
# Indirecto para poder PROBAR este script sin mandarle un Telegram falso a Sergio
# Urcullo. Una guarda que no se puede ejercitar es una guarda que nadie sabe si anda.
TG="${ONIA_TG:-/root/bin/onia-tg.sh}"
# Para el autotest: si apunta a un archivo, se usa en vez de llamar a la API.
FIXTURE="${ONIA_CI_FIXTURE:-}"

TABLERO="${ONIA_TABLERO:-/root/bin/onia-tablero.sh}"

# Devuelve por stdout el id de la tarea que el enrutador creo para este aviso
# (linea `TAREA t_xxxxxxxx`), o vacio si el aviso no genero tarea — que es lo
# normal para los informativos y los verdes.
avisar() {
  local salida
  salida=$("$TG" "$1" 2>/dev/null || true)
  printf '%s' "$salida" | grep -oE 't_[0-9a-f]{8}' | head -1
}

# CERRAR LA TAREA QUE CREO EL ROJO ES PARTE DE RECUPERARSE.
#
# Hasta el 2026-09-24 la rama `success` avisaba "recuperado" y borraba la marca,
# pero el aviso de recuperacion es un mensaje NUEVO: nadie cerraba la tarea que
# habia creado el rojo. Medido el 2026-09-10: `t_c8a2d7d5` afirmaba "master esta
# roto y el deploy va a fallar" con el CI verde desde hacia ~21 h. Los carriles
# leen el tablero ANTES que su cola, asi que una tarea roja que ya no es cierta
# no es ruido: manda a un carril a arreglar algo que ya esta arreglado.
#
# Falla en silencio a proposito: si el tablero no esta (nodo sin shim, prueba con
# el binario sustituido), el vigia igual tiene que poder avisar y borrar su marca.
cerrar_tarea() {  # cerrar_tarea <id> <motivo>
  [ -n "${1:-}" ] || return 0
  [ -x "$TABLERO" ] || return 0
  "$TABLERO" comment "$1" "$2" >/dev/null 2>&1 || true
  "$TABLERO" complete "$1" >/dev/null 2>&1 || true
}

# ── El token ────────────────────────────────────────────────────────────────
if [ -z "$FIXTURE" ]; then
  if [ ! -s "$TOKEN_FILE" ]; then
    # Una sola vez. Con la instruccion exacta adentro: un aviso que no dice como
    # arreglarlo obliga a reconstruir el diagnostico cada vez que aparece.
    if [ ! -f "$MARCA_DIR/onia-ci-sin-token.avisado" ]; then
      avisar "⚠️ <b>Vigia de CI sin token</b> — instalado y sin poder mirar nada.

<code>onia-platform</code> es privado, asi que leer Actions pide un token propio.
El de n8n no sirve: da 403 en <code>actions/runs</code>.

Hace falta uno <b>fine-grained</b> con <b>Actions: Read-only</b> sobre
<code>onia-platform</code>, en <code>$TOKEN_FILE</code> (chmod 600).
Mientras tanto este vigia sale 0 y no vuelve a insistir."
      touch "$MARCA_DIR/onia-ci-sin-token.avisado"
    fi
    exit 0
  fi
  rm -f "$MARCA_DIR/onia-ci-sin-token.avisado"
  TOKEN=$(cat "$TOKEN_FILE")
fi

# ── Traer el estado de cada objetivo ────────────────────────────────────────
# Salida normalizada, una linea por workflow:  <workflow>\t<conclusion>\t<sha>\t<url>\t<created_at>
estado_de() {  # estado_de <owner/repo> <rama>
  local repo="$1" rama="$2" json
  if [ -n "$FIXTURE" ]; then
    json=$(cat "$FIXTURE")
  else
    json=$(curl -s --max-time 25 \
      -H "Authorization: Bearer $TOKEN" \
      -H "Accept: application/vnd.github+json" \
      "https://api.github.com/repos/$repo/actions/runs?branch=$rama&per_page=30" 2>/dev/null)
  fi
  # Se parsea con `node`, no con python3: node es dependencia dura de este repo
  # (el gate `loops_registrados.mjs` y media docena mas lo necesitan), asi que
  # esta garantizado en toda maquina donde esto corra. python3 no lo esta.
  printf '%s' "$json" | node -e '
let e = ""; process.stdin.on("data", c => e += c); process.stdin.on("end", () => {
  let d;
  try { d = JSON.parse(e); } catch { process.exit(0); }   // API muda o HTML de error: no inventamos estado
  if (!d || !Array.isArray(d.workflow_runs)) {
    const m = String((d && d.message) || "respuesta inesperada").slice(0, 120);
    console.log(["__ERROR__", m, "", ""].join("\t"));
    return;
  }
  const visto = new Set();
  for (const r of d.workflow_runs) {                      // vienen del mas nuevo al mas viejo
    const n = r.name || "?";
    if (visto.has(n)) continue;                           // solo la corrida COMPLETA mas reciente por workflow
    if (r.status !== "completed") continue;               // en curso: todavia no dice nada
    const c = r.conclusion;
    if (!c || ["cancelled", "skipped", "neutral"].includes(c)) continue;  // no son veredictos sobre el codigo
    visto.add(n);
    console.log([n, c, (r.head_sha || "").slice(0, 7), r.html_url || "", r.created_at || ""].join("\t"));
  }
});
' 2>/dev/null
}

# ── La maquina de estados ───────────────────────────────────────────────────
for objetivo in $OBJETIVOS; do
  REPO="${objetivo%%:*}"
  RAMA="${objetivo##*:}"
  SALIDA=$(estado_de "$REPO" "$RAMA")
  [ -z "$SALIDA" ] && continue

  while IFS=$'\t' read -r WF CONCL SHA URL CREADO; do
    [ -n "${WF:-}" ] || continue

    # La API contesto un error (token vencido, permiso quitado, repo movido). Es
    # un fallo del vigia, no del CI: se avisa aparte y NO se toca ninguna marca,
    # para no dar por "recuperado" algo que no se pudo mirar.
    if [ "$WF" = "__ERROR__" ]; then
      if [ ! -f "$MARCA_DIR/onia-ci-api.avisado" ]; then
        avisar "⚠️ <b>Vigia de CI: la API de GitHub no contesta lo esperado</b>
<code>$REPO</code> — <code>$(printf '%s' "$CONCL" | head -c 120)</code>
No se toco ninguna marca: no se puede declarar verde lo que no se pudo mirar."
        touch "$MARCA_DIR/onia-ci-api.avisado"
      fi
      continue
    fi
    rm -f "$MARCA_DIR/onia-ci-api.avisado"

    # Una marca por repo+workflow. El nombre del workflow puede traer espacios.
    CLAVE=$(printf '%s-%s' "$REPO" "$WF" | tr -c 'A-Za-z0-9._-' '-')
    MARCA="$MARCA_DIR/onia-ci-$CLAVE.rojo"

    # LA RESPUESTA DE LA API NO PUEDE RETROCEDER EN EL TIEMPO.
    #
    # Medido el 2026-09-19 en /var/log/onia-tg.log: 45 avisos «CI en ROJO» y 45
    # «CI recuperado», ALTERNADOS, cada verde exactamente una corrida del cron
    # (10 min) despues de su rojo, con el CI de master verde todo el tiempo. El
    # vigia oscilaba: `actions/runs` es eventualmente consistente y cada tanto
    # contesta una pagina donde la corrida completa mas reciente de un workflow
    # es una VIEJA — la del 5-sep, `failure` de verdad y curada el 6. Se le
    # creia, se avisaba rojo y se dejaba la marca; diez minutos despues la API
    # contestaba bien, se leia como «recuperado» y SE BORRABA LA PROPIA MARCA.
    # Por eso `/var/lib` nunca tuvo una marca y el aviso renacia para siempre,
    # y como el rojo crea TAREA y el verde sale informativo, cada oscilacion
    # dejaba una tarea roja viva que nadie cerraba (tres en un solo dia).
    #
    # `created_at` de un workflow solo AVANZA. Si lo que llega es mas viejo que
    # lo ultimo ya juzgado, la respuesta esta stale: no se toca NADA — ni aviso,
    # ni marca —, la misma politica que rige arriba para `__ERROR__`. Sin fecha
    # legible no hay con que comparar y se juzga igual: un campo ausente no es
    # una respuesta stale, y callarse ahi apagaria el vigia entero.
    VISTO="$MARCA_DIR/onia-ci-$CLAVE.visto"
    T_ESTE=""
    [ -n "${CREADO:-}" ] && T_ESTE=$(date -u -d "$CREADO" +%s 2>/dev/null || true)
    if [ -n "$T_ESTE" ] && [ -s "$VISTO" ]; then
      T_VISTO=$(cat "$VISTO" 2>/dev/null || true)
      case "${T_VISTO:-x}" in
        *[!0-9]*) T_VISTO="" ;;    # marca ilegible: no sirve para comparar
      esac
      if [ -n "$T_VISTO" ] && [ "$T_ESTE" -lt "$T_VISTO" ]; then
        continue
      fi
    fi
    [ -n "$T_ESTE" ] && printf '%s' "$T_ESTE" > "$VISTO"

    if [ "$CONCL" = "success" ]; then
      if [ -f "$MARCA" ]; then
        # La marca guarda el id de la tarea que abrio este episodio (puede estar
        # vacia: marcas viejas, o un rojo que no llego a crear tarea).
        TAREA_ROJA=$(grep -oE 't_[0-9a-f]{8}' "$MARCA" 2>/dev/null | head -1 || true)
        avisar "🟢 <b>CI recuperado</b> — <code>$REPO</code> · <b>$WF</b>
Verde en <code>$SHA</code>." >/dev/null
        cerrar_tarea "$TAREA_ROJA" "Cerrada por el vigia de CI: $REPO · $WF volvio a verde en $SHA. El rojo que abrio esta tarea ya no es cierto."
        rm -f "$MARCA"
      fi
      continue
    fi

    # failure / timed_out / startup_failure / action_required
    [ -f "$MARCA" ] && continue      # ya avisamos de este episodio

    # CUANDO fue el fallo va ADENTRO del aviso.
    #
    # Medido el 2026-09-18: la tarea `t_8e76db40` decia «failure en 545dd28 /
    # mientras siga asi master esta roto y el deploy va a fallar» y ese run era
    # del 5 de septiembre, ya curado el 6 con `.gitleaks.toml`; el CI de master
    # estaba VERDE. Sin la fecha, un rojo de hace trece dias y uno de hace cinco
    # minutos se leen igual — y el 17-sep un carril gasto una vuelta entera
    # corriendo los cinco gates a mano para terminar escribiendo que aun asi no
    # podia juzgarlo. La antiguedad es lo que separa «anda a arreglarlo» de
    # «esto ya se curo y nadie cerro el aviso».
    #
    # Se agrega solo cuando aporta: en un rojo de hoy «hace 0 dias» es ruido, y
    # el caso 11 de la prueba existe para que nadie lo ponga siempre.
    CUANDO=""
    if [ -n "${CREADO:-}" ]; then
      CUANDO="
Corrida del <code>${CREADO%%T*}</code>"
      if T_RUN=$(date -u -d "$CREADO" +%s 2>/dev/null); then
        DIAS=$(( ( $(date -u +%s) - T_RUN ) / 86400 ))
        [ "$DIAS" -ge 1 ] && CUANDO="$CUANDO (hace $DIAS d)"
      fi
      CUANDO="$CUANDO."
    fi

    # La marca guarda el ID de la tarea, no solo su existencia: es lo unico que
    # le permite al verde de mañana cerrar el rojo de hoy. Si el aviso no genero
    # tarea, la marca queda vacia y el episodio se comporta como antes.
    ID_TAREA=$(avisar "🔴 <b>CI en ROJO</b> — <code>$REPO</code> · <b>$WF</b>
Resultado: <code>$CONCL</code> en <code>$SHA</code> (rama <code>$RAMA</code>).$CUANDO

Mientras siga asi, <code>$RAMA</code> esta roto y el deploy va a fallar.
$URL")
    printf '%s' "$ID_TAREA" > "$MARCA"
  done <<< "$SALIDA"
done

exit 0
