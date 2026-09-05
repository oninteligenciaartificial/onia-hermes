#!/usr/bin/env bash
# ONIA — deja una PC de casa lista para correr loops de carril, como segundo nodo
# del VPS. Se corre EN LA PC DE CASA, nunca en el VPS.
#
# ── LA DECISION DE DISENO, y es la que hace que este script sea corto ─────────
# La PC de casa REPLICA LAS RUTAS DEL VPS (/root/bin, /root/loops,
# /root/.hermes). No es capricho: `onia-loop.sh` tiene /root/... escrito adentro
# en catorce lugares, y ese archivo lo ejecutan hoy quince loops vivos. La regla
# del README de esta carpeta es explicita — "el que corre es el que manda" — y
# parametrizarlo para el homelab significaria tocar el corredor de produccion
# para un caso que todavia no existe. Replicando las rutas, el corredor corre
# SIN UN SOLO CAMBIO, y `sincronizar.sh` —que ya despliega desde origin/main—
# mantiene la PC al dia con el mismo mecanismo que ya mantiene al VPS. Cero
# maquinaria nueva.
#
# Lo unico que se agrega son CUATRO shims: los helpers que en el VPS son locales
# (tablero, memoria, telegram) y desde casa tienen que salir por SSH. Ver abajo.
#
# Uso:
#   sudo ONIA_LOOPS_HOMELAB="web-factory-dev web-venta tendencias lucia marca-personal" \
#        scripts/loops/instalar-homelab.sh
#
#   --prueba    solo corre el humo (no instala nada)
#
# Es IDEMPOTENTE: correrlo dos veces no duplica nada. Falla FUERTE y temprano:
# un paso que no se puede verificar no se da por hecho.
set -uo pipefail

VPS="${ONIA_VPS:-root@187.77.16.63}"
LLAVE="${ONIA_VPS_KEY:-/root/.ssh/onia_hermes_vps_ed25519}"
REPO_URL="${ONIA_REPO_URL:-git@github.com:oninteligenciaartificial/onia-hermes.git}"
BASE="${ONIA_LOOPS_BASE:-/root/loops}"
BIN="${ONIA_LOOPS_BIN:-/root/bin}"
HERMES_DIR="${ONIA_HERMES_DIR:-/root/.hermes}"
CLON="$BASE/onia-hermes"
# El PRODUCTO, en solo lectura. La rama por defecto es `master`, no `main`.
PLATFORM="${ONIA_PLATFORM_DIR:-$BASE/onia-platform}"
PLATFORM_URL="${ONIA_PLATFORM_URL:-git@github.com:oninteligenciaartificial/onia-platform.git}"

# Qué loops corre ESTA maquina. Cada linea: <id> <rama> <cron>.
# Los horarios salen de hermes-content/docs/cola/loops.md — con un DESFASE de
# unos minutos respecto del VPS, a proposito: si los dos nodos arrancan al mismo
# minuto se pisan la cuota de Claude, que es COMPARTIDA por cuenta y no por
# maquina (ver el bloque "session limit" de onia-loop.sh).
CATALOGO=$(cat <<'EOF'
web-factory-dev   claude/web-factory-dev              24 2,8,14,20 * * *
web-venta         claude/web-venta                    52 * * * *
tendencias        claude/tendencias                   54 11,23 * * *
lucia             claude/lucia-vps                    40 0,3,6,9,12,15,18,21 * * *
marca-personal    claude/marca-personal-loop          59 13,21 * * *
investigacion     claude/investigacion                29 9 * * *
supervisor        claude/supervisor                   32 2,8,14,20 * * *
calidad-generado  claude/calidad-generado             8 3,9,15,21 * * *
contenido-cola    claude/ads-creatividades-publicos   14 */3 * * *
EOF
)
ASIGNADOS="${ONIA_LOOPS_HOMELAB:-web-factory-dev web-venta tendencias lucia marca-personal}"

SOLO_PRUEBA=0
[ "${1:-}" = "--prueba" ] && SOLO_PRUEBA=1

rojo()  { printf '\033[31m✗ %s\033[0m\n' "$*" >&2; }
ok()    { printf '\033[32m✓ %s\033[0m\n' "$*"; }
paso()  { printf '\n\033[1m── %s\033[0m\n' "$*"; }
morir() { rojo "$*"; exit 1; }

# ── 0. Guardas: donde NO se corre esto ───────────────────────────────────────
# El VPS tiene el CLI de Hermes instalado; la PC de casa no. Es la misma prueba
# que usa scripts/kanban/tablero.sh para decidir si sale por SSH: pregunta por el
# binario, no por la IP ni el hostname (una IP se mueve, un hostname se renombra).
if [ -x /usr/local/lib/hermes-agent/venv/bin/python ]; then
  morir "esto es el VPS (esta el CLI de Hermes). Este script es para la PC de casa: correrlo aca pisaria el cron de los 15 loops de produccion."
fi
[ "$(uname -s)" = "Linux" ] || morir "solo Linux. En Windows, instalar WSL2 con Ubuntu y correrlo adentro (ver hermes-content/docs/PLAN_HOMELAB.md)."
[ "$(id -u)" = "0" ] || morir "hay que ser root: las rutas replican las del VPS (/root/bin, /root/loops) para que onia-loop.sh corra sin cambios."

# ── 1. Requisitos ────────────────────────────────────────────────────────────
paso "1/7 · requisitos"
FALTA=""
for c in git ssh rsync flock crontab node npm claude; do
  command -v "$c" >/dev/null 2>&1 || FALTA="$FALTA $c"
done
[ -n "$FALTA" ] && morir "faltan comandos:$FALTA
  git ssh rsync flock cron → apt install git openssh-client rsync util-linux cron
  node (>=20)              → https://github.com/nodesource/distributions
  claude                   → npm i -g @anthropic-ai/claude-code"

NODE_MAJOR=$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0)
[ "$NODE_MAJOR" -ge 20 ] || morir "node $NODE_MAJOR es muy viejo; hace falta >= 20 (el VPS corre v20.20.2)."
ok "git, ssh, rsync, flock, cron, node v$NODE_MAJOR, claude"

[ -f "$LLAVE" ] || morir "no esta la llave SSH del VPS en $LLAVE.
  Copiarla desde la laptop de Sergio (~/.ssh/onia_hermes_vps_ed25519) y darle chmod 600."
chmod 600 "$LLAVE" 2>/dev/null || true

# ── 2. Conexion al VPS ───────────────────────────────────────────────────────
# Se prueba ANTES de clonar 13 GB: si el VPS no contesta, nada de lo de abajo
# sirve (el tablero, la memoria y los avisos viven ahi).
paso "2/7 · conexion al VPS"
SSH=(ssh -i "$LLAVE" -o StrictHostKeyChecking=accept-new -o ConnectTimeout=15 -o BatchMode=yes "$VPS")
"${SSH[@]}" 'test -x /root/bin/onia-aprender.sh && test -x /root/bin/onia-tg.sh' \
  || morir "no llego al VPS ($VPS) con esa llave, o le faltan los helpers en /root/bin.
  Probar a mano:  ssh -i $LLAVE $VPS 'ls /root/bin/onia-*'"
ok "SSH al VPS y helpers presentes"

MS=$( { TIMEFORMAT=%R; time "${SSH[@]}" true; } 2>&1 | tail -1 )
ok "ida y vuelta SSH: ${MS}s  (>1.5s hace lento cada tablero/aprender; ver 'Riesgos' en el plan)"

if [ "$SOLO_PRUEBA" = 1 ]; then paso "solo prueba: no instalo nada"; fi

# ── 3. Clon y worktrees ──────────────────────────────────────────────────────
paso "3/7 · repo y worktrees"
if [ "$SOLO_PRUEBA" = 0 ]; then
  mkdir -p "$BASE" "$BIN" "$BIN/loops" "$HERMES_DIR/memories" "$BASE/estado" || morir "no pude crear las carpetas base"
  if [ ! -d "$CLON/.git" ]; then
    # --filter=blob:none: el clon completo son 13 GB medidos en el VPS. El
    # blobless baja ~1 GB y trae el resto por demanda; para un carril que toca
    # unos pocos archivos por vuelta es la diferencia entre entrar o no en un
    # disco de casa.
    git clone --filter=blob:none "$REPO_URL" "$CLON" || morir "no pude clonar $REPO_URL (¿la llave de GitHub esta en el agente?)"
  fi
  git -C "$CLON" fetch origin --quiet || rojo "aviso: fetch fallo, sigo con lo que hay"
  RAMA_CLON=$(git -C "$CLON" branch --show-current 2>/dev/null)
  [ "$RAMA_CLON" = "main" ] && git -C "$CLON" merge --ff-only origin/main --quiet 2>/dev/null
fi
ok "clon en $CLON"

# 🔴 EL PRODUCTO, EN SOLO LECTURA. Cuatro de los cinco loops de la primera tanda
# LEEN precios de $PLATFORM: web-venta:16 y web-factory-dev:290 de
# lib/subscription-plans.ts, chatbot-cola:17 de lib/pricing.ts, y
# marca-personal:178 el app/layout.tsx de la landing. Sin este clon un loop que no
# puede leer la fuente unica NO se calla: escribe el precio igual, sacado de un doc
# viejo. Falla PARECIENDO que funciono, que es el modo de falla mas caro que tiene
# este sistema. Medido el 2026-09-04: el instalador no lo clonaba y nada lo avisaba.
#
# El push queda ROTO a proposito. Los prompts ya prohiben escribir aca ("leer esta
# permitido, escribir en onia-platform no", tendencias:280) — pero un prompt es una
# instruccion y una URL rota es un hecho. Este nodo no despliega el producto.
if [ "$SOLO_PRUEBA" = 0 ]; then
  if [ ! -d "$PLATFORM/.git" ]; then
    git clone --filter=blob:none "$PLATFORM_URL" "$PLATFORM" >/dev/null 2>&1 \
      || rojo "aviso: no pude clonar el producto en $PLATFORM"
  fi
  if [ -d "$PLATFORM/.git" ]; then
    git -C "$PLATFORM" remote set-url --push origin DESHABILITADO-NODO-DE-DESARROLLO
    git -C "$PLATFORM" fetch origin --quiet 2>/dev/null || true
  fi
fi
if [ -s "$PLATFORM/lib/subscription-plans.ts" ]; then
  ok "producto en $PLATFORM (solo lectura, push deshabilitado)"
else
  rojo "aviso: falta $PLATFORM/lib/subscription-plans.ts — los loops no van a poder leer los precios"
fi

for id in $ASIGNADOS; do
  RAMA=$(echo "$CATALOGO" | awk -v i="$id" '$1==i{print $2}')
  [ -n "$RAMA" ] || morir "'$id' no esta en el catalogo de este script. Ids validos: $(echo "$CATALOGO" | awk '{printf "%s ", $1}')"
  # 🔴 El nombre del worktree lo manda el CORREDOR, no este script. No siempre
  # coincide con el id: `web-factory-dev` vive en `onia-hermes-webfactory` y
  # `calidad-generado` en `onia-hermes-calidad`. Tener esa tabla escrita en DOS
  # archivos es exactamente como se desincronizan — medido el 2026-09-04 en el
  # nodo de casa: el instalador creo `onia-hermes-web-factory-dev`, el corredor
  # busco `onia-hermes-webfactory`, y la primera vuelta murio con "no existe el
  # worktree" y su cron INTACTO. Se LEE de onia-loop.sh, que es el que ejecuta.
  WT=$(awk -v id="$id" '$0 ~ ("^[[:space:]]*" id "[)]") {f=1} f && /WT=\/root\/loops/ {sub(/^[[:space:]]*WT=/,""); print $1; exit}' "$(dirname "$0")/onia-loop.sh" 2>/dev/null)
  [ -n "$WT" ] || morir "no encontre 'WT=' para '$id' en $(dirname "$0")/onia-loop.sh — el corredor no conoce ese carril."
  if [ "$SOLO_PRUEBA" = 0 ] && [ ! -e "$WT/.git" ]; then
    git -C "$CLON" worktree add "$WT" "$RAMA" 2>/dev/null \
      || git -C "$CLON" worktree add -b "$RAMA" "$WT" "origin/$RAMA" 2>/dev/null \
      || morir "no pude crear el worktree de $id en $RAMA (¿existe origin/$RAMA?)"
  fi
  if [ -e "$WT/.git" ]; then
    ACTUAL=$(git -C "$WT" branch --show-current 2>/dev/null || echo '?')
    [ "$ACTUAL" = "$RAMA" ] || morir "el worktree $WT esta en '$ACTUAL' y se esperaba '$RAMA'. onia-loop.sh se niega a correr asi (y hace bien)."
    ok "$id → $WT ($RAMA)"
  fi
done

# El hook que bloquea push a main: este nodo NO es el integrador. El integrador
# (onia-cola) se queda en el VPS a proposito, y dos maquinas mergeando a main es
# exactamente la carrera que CLAUDE.md prohibe.
if [ "$SOLO_PRUEBA" = 0 ]; then
  install -d "$CLON/.githooks"
  install -m 755 "$CLON/scripts/loops/pre-push" "$CLON/.githooks/pre-push" 2>/dev/null \
    && git -C "$CLON" config core.hooksPath .githooks && ok "pre-push instalado (main bloqueado en este nodo)"
fi

# ── 4. Los cuatro shims ──────────────────────────────────────────────────────
# En el VPS estos helpers son locales. Desde casa tienen que salir por SSH, y
# eso NO es un rodeo: es lo que mantiene UNA sola fuente de verdad.
#   · el tablero es un SQLite con cerrojo atomico que vive en el VPS;
#   · MEMORY.md lo escribe UN solo consolidador, con flock, en el VPS;
#   · el token de Telegram se queda en el VPS y nunca baja a la PC de casa.
# Un flock sobre sshfs/NFS no serializa de verdad — por eso la PC NUNCA escribe
# esos archivos: deja el hecho en la bandeja del VPS y el consolidador de alla
# hace el resto.
paso "4/7 · shims hacia el VPS"
shim() { # shim <nombre> <comando remoto>
  local n="$1" cmd="$2"
  [ "$SOLO_PRUEBA" = 1 ] && return 0
  cat > "$BIN/$n.nuevo" <<SHIM
#!/usr/bin/env bash
# Generado por instalar-homelab.sh — este nodo delega en el VPS a proposito.
#
# 🔴 Los argumentos se CITAN con printf %q para el shell remoto, y no es cosmetico.
# ssh NO manda un vector de argumentos: concatena todo en UNA cadena que el shell
# del VPS vuelve a partir. Sin citar:
#   · un mensaje con <b>, (), ; o comillas muere alla con "syntax error" —
#     medido el 2026-09-04: el aviso del propio instalador fallaba por sus
#     <code> y sus "(5 loop(s))", y era el unico rojo de la prueba de humo;
#   · y onia-aprender.sh recibe TEXTO LIBRE escrito por un modelo. Un hecho con
#     \$(...) o comillas invertidas se habria EJECUTADO como comando en el VPS de
#     produccion. Eso es ejecucion remota de codigo, no un problema de formato.
# Y se reenvia ONIA_LOOP_ID: `ssh` NO lleva variables de entorno. Sin esto todo
# hecho que este nodo deje en la memoria compartida aterriza firmado como
# "desconocido" —lo hace `aprender.sh` con su ${ONIA_LOOP_ID:-...}— y el
# supervisor, que cuenta por carril, no puede atribuir nada. Medido el 2026-09-04.
exec ssh -i "$LLAVE" -o StrictHostKeyChecking=accept-new -o ConnectTimeout=20 -o BatchMode=yes "$VPS" "ONIA_LOOP_ID=\$(printf '%q' "\${ONIA_LOOP_ID:-}") $cmd \$(printf '%q ' "\$@")"
SHIM
  bash -n "$BIN/$n.nuevo" || { rm -f "$BIN/$n.nuevo"; morir "shim $n salio con sintaxis rota"; }
  chmod 755 "$BIN/$n.nuevo"; mv -f "$BIN/$n.nuevo" "$BIN/$n"   # mv es atomico: no se pisa un shim en uso
  ok "$BIN/$n → $VPS"
}
shim onia-aprender.sh          /root/bin/onia-aprender.sh
shim onia-tg.sh                /root/bin/onia-tg.sh
shim onia-consolidar-memoria.sh /root/bin/onia-consolidar-memoria.sh
shim onia-tablero.sh           "export HOME=/root; /root/bin/onia-tablero.sh"

# Bajada de la memoria: SOLO LECTURA. Es una copia; el original vive en el VPS.
# Si el VPS no contesta, se deja la copia vieja y se sigue: un loop con memoria
# de hace una hora trabaja; uno que no arranca, no.
if [ "$SOLO_PRUEBA" = 0 ]; then
  cat > "$BIN/onia-memoria-bajar.sh.nuevo" <<BAJAR
#!/usr/bin/env bash
# Copia local de la memoria compartida. Este nodo NUNCA la escribe (ver el
# bloque de shims de instalar-homelab.sh).
set -uo pipefail
D="$HERMES_DIR/memories"; mkdir -p "\$D"
for f in MEMORY.md USER.md; do
  T=\$(mktemp "\$D/.\$f.XXXXXX") || continue
  if rsync -q -e "ssh -i $LLAVE -o StrictHostKeyChecking=accept-new -o ConnectTimeout=20 -o BatchMode=yes" \\
      "$VPS:/root/.hermes/memories/\$f" "\$T" 2>/dev/null && [ -s "\$T" ]; then
    chmod 600 "\$T"; mv -f "\$T" "\$D/\$f"
  else
    rm -f "\$T"   # se conserva la copia anterior
  fi
done
BAJAR
  bash -n "$BIN/onia-memoria-bajar.sh.nuevo" || morir "onia-memoria-bajar.sh salio con sintaxis rota"
  chmod 755 "$BIN/onia-memoria-bajar.sh.nuevo"; mv -f "$BIN/onia-memoria-bajar.sh.nuevo" "$BIN/onia-memoria-bajar.sh"
  "$BIN/onia-memoria-bajar.sh" || true
  [ -s "$HERMES_DIR/memories/MEMORY.md" ] && ok "memoria bajada ($(wc -c < "$HERMES_DIR/memories/MEMORY.md") bytes)" || rojo "aviso: MEMORY.md quedo vacio; los loops arrancaran sin memoria"
  touch "$HERMES_DIR/.env"; chmod 600 "$HERMES_DIR/.env"
fi

# ── 5. Corredor y prompts, desde origin/main ─────────────────────────────────
# Se REUSA sincronizar.sh tal cual. Ya despliega desde origin/main de forma
# atomica y trae las dos guardas anti-degradacion; escribir un segundo
# desplegador para el homelab seria mantener dos.
paso "5/7 · corredor y prompts"
if [ "$SOLO_PRUEBA" = 0 ]; then
  ONIA_LOOPS_REPO="$CLON" ONIA_LOOPS_BIN="$BIN" ONIA_TG="$BIN/onia-tg.sh" \
    bash "$CLON/scripts/loops/sincronizar.sh" || morir "sincronizar.sh fallo: sin corredor no hay loops"
fi
[ -x "$BIN/onia-loop.sh" ] && ok "corredor en $BIN/onia-loop.sh" || rojo "aviso: falta $BIN/onia-loop.sh"

# ── 6. Cron ──────────────────────────────────────────────────────────────────
# Cron y no systemd timers, a proposito. Un timer con Persistent=true "recupera"
# las corridas perdidas mientras la PC estaba apagada: seis vueltas del mismo
# loop disparando juntas al prender. Es EXACTAMENTE la rafaga que hizo que estos
# loops se fueran de Windows (ver el README de esta carpeta). Una vuelta perdida
# se pierde; la siguiente llega a horario.
paso "6/7 · cron"
MARCA="# --- onia loops homelab (instalar-homelab.sh) ---"
FIN="# --- fin onia loops homelab ---"
if [ "$SOLO_PRUEBA" = 0 ]; then
  # Los logs SUBEN al VPS. No es telemetria de lujo: es lo unico que le da de
  # comer al vigia que corre alla (onia-vigia-loops-remotos.sh). Si esta linea no
  # esta, ese vigia ve silencio permanente y avisa que no llegan los registros —
  # que es la verdad, pero inutil como alarma. Cada 10 min, y si el VPS no
  # contesta se pierde esta subida y la siguiente lo alcanza (rsync manda el
  # archivo entero, no un delta que se pueda desincronizar).
  BLOQUE="$MARCA"$'\n'"*/10 * * * * rsync -q -e 'ssh -i $LLAVE -o StrictHostKeyChecking=accept-new -o BatchMode=yes -o ConnectTimeout=20' /var/log/onia-loop-*.log $VPS:/var/log/ >/dev/null 2>&1"$'\n'"*/15 * * * * $BIN/onia-memoria-bajar.sh >/dev/null 2>&1"$'\n'"44 * * * * ONIA_LOOPS_REPO=$CLON ONIA_LOOPS_BIN=$BIN ONIA_TG=$BIN/onia-tg.sh $CLON/scripts/loops/sincronizar.sh >/var/log/onia-loops-sync.log 2>&1"
  for id in $ASIGNADOS; do
    CRON=$(echo "$CATALOGO" | awk -v i="$id" '$1==i{$1="";$2="";sub(/^ +/,"");print}')
    BLOQUE="$BLOQUE"$'\n'"$CRON $BIN/onia-loop.sh $id"
  done
  BLOQUE="$BLOQUE"$'\n'"$FIN"
  # Se reemplaza el bloque entero: idempotente, y no toca ninguna otra linea de
  # cron que Sergio tenga en esta maquina.
  ACTUAL=$(crontab -l 2>/dev/null | sed "/^$(printf '%s' "$MARCA" | sed 's/[[\.*^$/]/\\&/g')\$/,/^$(printf '%s' "$FIN" | sed 's/[[\.*^$/]/\\&/g')\$/d")
  printf '%s\n%s\n' "$ACTUAL" "$BLOQUE" | grep -v '^$' | crontab - || morir "no pude escribir el crontab"
fi
crontab -l 2>/dev/null | grep -c "onia-loop.sh" | xargs -I{} echo "  {} loop(s) en cron"
ok "cron escrito (marca: '$MARCA')"

# ── 7. Humo ──────────────────────────────────────────────────────────────────
# Verifica lo que de verdad puede fallar en silencio. Cada linea es una cosa que
# ya se rompio antes en este sistema.
paso "7/7 · prueba de humo"
FALLOS=0
probar() { # probar <que> <comando>
  if eval "$2" >/dev/null 2>&1; then ok "$1"; else rojo "$1"; FALLOS=$((FALLOS+1)); fi
}
# 🔴 `probar_instalado` es para lo que --prueba NO CREA: los pasos 4 y 5 se
# saltean a proposito en ese modo, y despues este bloque verificaba los archivos
# que esos pasos crean. Resultado: `--prueba` NUNCA podia salir verde — siempre
# terminaba en "8 chequeo(s) en rojo · NO dejar los loops corriendo asi", que
# asusta y es mentira en ese modo. Medido el 2026-09-04 montando el nodo de casa.
# Lo que --prueba SI prueba de verdad: requisitos, SSH al VPS, GitHub y claude.
probar_instalado() {
  if [ "$SOLO_PRUEBA" = 1 ]; then
    printf '  \033[2m· %s — no aplica en --prueba (lo crea la instalacion real)\033[0m\n' "$1"
    return 0
  fi
  probar "$@"
}

probar "SSH al VPS"                    "\"\${SSH[@]}\" true"
probar "GitHub alcanzable (git ls-remote)" "git -C '$CLON' ls-remote --exit-code origin HEAD"
probar "claude autenticado (sin API key)" "unset ANTHROPIC_API_KEY; echo 'responde OK y nada mas' | timeout 90 claude -p --max-turns 1 2>&1 | grep -qi ok"
probar_instalado "tablero legible (SQLite del VPS)" "$BIN/onia-tablero.sh list 2>&1 | head -1 | grep -qv 'Permission denied'"
probar_instalado "memoria local presente"        "[ -s '$HERMES_DIR/memories/MEMORY.md' ]"
probar_instalado "corredor ejecutable"           "[ -x '$BIN/onia-loop.sh' ]"
# Los precios son fuente unica: un loop que no los puede leer escribe uno viejo.
probar_instalado "precios del producto legibles" "[ -s '$PLATFORM/lib/subscription-plans.ts' ]"
probar_instalado "producto sin push (este nodo no despliega)" "git -C '$PLATFORM' remote get-url --push origin | grep -q DESHABILITADO"
for id in $ASIGNADOS; do
  probar_instalado "prompt de $id desplegado"    "[ -s '$BIN/loops/$id.md' ]"
done
# El aviso a Telegram es lo ULTIMO que se prueba y lo unico que manda un mensaje:
# si el resto fallo, Sergio se entera igual, y con el numero de fallos adentro.
if [ "$SOLO_PRUEBA" = 0 ]; then
  "$BIN/onia-tg.sh" "🏠 <b>Homelab</b>: instalador corrido en <code>$(hostname)</code> — $(echo $ASIGNADOS | wc -w) loop(s), $FALLOS fallo(s) de humo." >/dev/null 2>&1 \
    && ok "aviso a Telegram (por el VPS)" || { rojo "aviso a Telegram"; FALLOS=$((FALLOS+1)); }
fi

echo
if [ "$FALLOS" = 0 ]; then
  ok "TODO VERDE. Primera vuelta a mano para verla entera:  $BIN/onia-loop.sh $(echo $ASIGNADOS | awk '{print $1}')"
  echo "   El log queda en /var/log/onia-loop-<id>.log"
  exit 0
fi
morir "$FALLOS chequeo(s) en rojo. NO dejar los loops corriendo asi: un loop que arranca sin tablero o sin credencial gasta una vuelta y no avisa."
