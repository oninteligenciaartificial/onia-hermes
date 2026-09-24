#!/usr/bin/env bash
# Despliega el corredor y los prompts DESDE `main` a /root/bin, en el VPS mismo.
#
# 🔴 POR QUE, y son dos razones distintas:
#
# 1. **Sin esto, el sistema de loops depende de la laptop de Sergio.** Un prompt
#    mejorado se commitea, se mergea a `main`… y sigue sin correr, porque lo que
#    se ejecuta vive en /root/bin y nadie lo copia. Ya pasó: el canario estuvo un
#    día entero mirando CINCO pantallas mientras `main` tenía la versión de DIEZ,
#    commiteada y mergeada. Commitear una mejora NO la enciende.
#
# 2. **Copiar desde Windows mete CRLF.** Los prompts escritos en la laptop llegan
#    con fin de línea de Windows, el checkout del VPS los tiene con LF, y la
#    guarda anti-drift del corredor (`cmp -s`) los ve distintos para siempre:
#    avisa de un drift que no existe, cada 6 h, hasta que nadie le crea. Copiando
#    desde el propio checkout, los dos lados salen del mismo git y son idénticos
#    por construcción.
#
# Escribe a un temporal y hace `mv` — atómico. Un loop que esté corriendo se
# queda con el inodo viejo hasta terminar; la vuelta siguiente arranca con el
# nuevo. Editar en caliente el mismo inodo YA rompió una vuelta (ver la trampa 5
# de hermes-content/docs/COMO_SE_ARMA_UN_LOOP.md).
#
# Corre por cron unos minutos después del integrador: lo que se mergea a `main`
# queda desplegado en la vuelta siguiente, sin que nadie toque nada.
set -uo pipefail

REPO=${ONIA_LOOPS_REPO:-/root/loops/onia-hermes}
DESTINO_BIN=${ONIA_LOOPS_BIN:-/root/bin}
CAMBIOS=0
# Indirecto para poder PROBAR este script sin mandarle un Telegram falso a Sergio.
# Una guarda que no se puede ejercitar es una guarda que nadie sabe si anda.
TG=${ONIA_TG:-/root/bin/onia-tg.sh}

log() { printf '%s %s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" "$*"; }

# 🔴 De donde se copia NO depende del checkout. El 2026-09-04 este clon quedo en
# 'feature/menu-limpio-t_54ff72b5' (un carril lo dejo ahi) y el sincronizador
# desplego los prompts DE ESA RAMA a los 15 loops: el supervisor nuevo no llego y
# los loops podrian haber corrido con prompts a medias de otro carril. Ahora el
# contenido sale SIEMPRE de origin/main, se materializa en un directorio temporal
# y de ahi se copia; si el fetch fallo y no hay origin/main, se cae al arbol y se
# avisa, en vez de publicar una rama de trabajo en silencio.
# 🔴 RAMA se calcula ACA y no 20 lineas mas abajo: los avisos de las dos ramas de
# error de este bloque la usan, y con `set -u` una variable sin asignar MATA el
# script. Medido el 2026-09-04 en el nodo de casa: el aviso "no pude materializar
# origin/main" —que existe justamente para DEGRADAR CON GRACIA— reventaba con
# "RAMA: unbound variable" y se llevaba puesto el despliegue entero. El camino de
# rescate era el unico que no se podia ejecutar. Mismo patron que el `avisar()`
# definido despues del `exit` que lo necesitaba (ver el README de esta carpeta).
RAMA=$(git -C "$REPO" branch --show-current 2>/dev/null)

# 🔴 Los subarboles que este script REALMENTE copia. Antes archivaba el repo
# entero, y eso son 5,4 GB en /tmp por vuelta — horaria en el VPS (`44 * * * *`).
# En WSL /tmp es un tmpfs de 5,4 GB EN RAM: se llenaba al ras y tar moria sin
# espacio, mudo, por el 2>/dev/null de abajo. Medido: 5,4 GB y minutos -> 4,2 MB
# y 0 s. Si alguna vez agregas un `poner "$RAIZ/..."` de otra carpeta, sumala aca
# o el archivo no va a existir y `poner` va a avisar que falta.
RUTAS_SYNC="scripts/loops scripts/kanban scripts/postiz_schedule.mjs scripts/cerebro hermes-content/deploy"
TARERR="/tmp/onia-sync-tar.$$.err"

RAIZ="$REPO"
TMPMAIN=""
if git -C "$REPO" rev-parse --verify -q origin/main >/dev/null 2>&1; then
  TMPMAIN=$(mktemp -d /tmp/onia-sync-main-XXXXXX) || TMPMAIN=""
  if [ -n "$TMPMAIN" ] && git -C "$REPO" archive origin/main $RUTAS_SYNC | tar -x -C "$TMPMAIN" 2>"$TARERR"; then
    RAIZ="$TMPMAIN"
    trap 'rm -rf "$TMPMAIN"' EXIT
    log "fuente: origin/main ($(git -C "$REPO" rev-parse --short origin/main))"
  else
    # El motivo ya no se pierde. Con `2>/dev/null` este fallo fue MUDO el
    # 2026-09-04 y parecia culpa de git, cuando era /tmp lleno.
    MOTIVO=$(head -1 "$TARERR" 2>/dev/null)
    [ -n "$TMPMAIN" ] && rm -rf "$TMPMAIN"; TMPMAIN=""
    log "aviso: no pude materializar origin/main (${MOTIVO:-sin detalle de tar}) — copio del arbol de $REPO ($RAMA)"
  fi
else
  log "aviso: no hay origin/main — copio del arbol de $REPO ($RAMA)"
fi
rm -f "$TARERR"
FUENTE="$RAIZ/scripts/loops"

[ -d "$FUENTE/prompts" ] || { log "FALLO: no existe $FUENTE/prompts"; exit 2; }

# `main` al día. Sólo fast-forward: si el árbol del integrador quedó con trabajo
# propio a medias, esto NO lo pisa — se queja y sale.
if ! git -C "$REPO" fetch origin --quiet; then log "aviso: fetch fallo, sincronizo con lo que hay"; fi
# RAMA ya se calculo arriba (un fetch no cambia de rama). Se dejaba aca y por eso
# los avisos de mas arriba morian con "unbound variable".
if [ "$RAMA" = "main" ]; then
  git -C "$REPO" merge --ff-only origin/main --quiet 2>/dev/null || log "aviso: main no avanzo por ff (el integrador tiene trabajo local)"
else
  log "aviso: $REPO esta en '$RAMA', no en main"
fi


poner() {  # poner <origen> <destino>
  local origen="$1" destino="$2" tmp="$2.nuevo.$$"

  # 🔴 UN SHIM DEL NODO DE CASA NO SE PISA. En el VPS estos helpers son locales;
  # en la PC de casa son shims que salen por SSH, y eso NO es un rodeo: es lo que
  # mantiene UNA sola fuente de verdad. El tablero es un SQLite con cerrojo que
  # vive en el VPS, y MEMORY.md lo escribe UN solo consolidador, alla.
  #
  # Medido el 2026-09-04 montando el nodo: el paso 4 del instalador dejaba los 4
  # shims en /root/bin y el paso 5 —este script— los pisaba con los scripts reales.
  # Consecuencias, las dos silenciosas:
  #   · onia-aprender.sh escribia en la bandeja LOCAL de la PC. El loop
  #     web-factory-dev ya habia dejado 2 hechos ahi que nunca iban a llegar a
  #     MEMORY.md. Un nodo que aprende hacia un pozo y no se queja.
  #   · onia-consolidar-memoria.sh quedaba local, o sea un SEGUNDO escritor de
  #     MEMORY.md — exactamente lo que el diseno prohibe por construccion, y que
  #     el 2026-09-03 ya metio una entrada vacia con el cerrojo funcionando bien.
  #
  # Reordenar los pasos del instalador no alcanzaba: este script corre por cron
  # cada hora (`44 * * * *`) y los volveria a pisar. La guarda va aca.
  #
  # 🔴 SOLO EL ENCABEZADO (head -5). La marca esta en la LINEA 2 de todo shim que
  # genera el instalador. Buscarla en el archivo entero hacia que este script se
  # bloqueara A SI MISMO: `poner` lo despliega como /root/bin/onia-loops-sync.sh,
  # y su copia contiene el literal 'Generado por instalar-homelab.sh' — el de esta
  # linea de aca abajo. Medido el 2026-09-05: el sync desplegado del VPS quedo
  # congelado en las 00:43 y cada vuelta horaria desde entonces loggeaba
  # "conservado (shim del nodo de casa)" EN EL VPS, donde no hay ningun nodo de
  # casa. El mensaje absurdo era la pista, y estuvo 15 horas en el log.
  #
  # Una guarda que se apaga a si misma no falla ruidosa: deja de aplicar arreglos
  # en silencio, que es la unica forma de fallo que este script existe para evitar.
  if head -5 "$destino" 2>/dev/null | grep -q 'Generado por instalar-homelab.sh'; then
    log "conservado (shim del nodo de casa, no se pisa): $destino"
    return 0
  fi

  cmp -s "$origen" "$destino" 2>/dev/null && return 0
  cp -- "$origen" "$tmp" || { log "FALLO copiando $destino"; return 1; }
  # Un corredor roto NO reemplaza a uno que anda.
  case "$destino" in
    *.sh) bash -n "$tmp" || { rm -f "$tmp"; log "RECHAZADO (sintaxis): $destino"; return 1; }
          chmod 755 "$tmp" ;;
    *)    chmod 644 "$tmp" ;;
  esac
  mv -f -- "$tmp" "$destino" || { rm -f "$tmp"; log "FALLO renombrando $destino"; return 1; }
  log "actualizado $destino"
  CAMBIOS=$((CAMBIOS + 1))
}

# 🔴 DOS GUARDAS contra que `main` DEGRADE el corredor. Son dos casos distintos,
# medidos en dias distintos, y hacen falta las dos:
#
# GUARDA 1 — main NO puede apagar un loop que el cron sigue llamando.
# Nace del 2026-09-02 20:32 UTC, medido por el loop supervisor. Este script copia
# el corredor DESDE main, siempre, en una direccion sola. Ese dia main estaba CINCO
# commits atras (los `case` de supervisor, web-factory-dev, recorrido-cliente,
# tendencias y calidad-generado vivian solo en `claude/git-status-935f47`, sin
# mergear) mientras los cinco ya tenian linea de cron, prompt en disco y worktree
# vivo. La corrida de las :44 los habria borrado del corredor sin decir una palabra,
# y cada uno habria muerto en el `*)` con exit 64.
# El criterio NO es "main nunca puede sacar un case" — retirar un loop tiene que
# seguir siendo posible. Es: **si el cron lo sigue llamando, sacarle el case lo mata**.
# Un loop retirado de verdad se saca primero del crontab; entonces pasa sola.
#
# GUARDA 2 — main NO puede quitarle una CAPACIDAD al corredor desplegado.
# Nace del 2026-09-03: el runner con la inyeccion de memoria compartida se
# desplego a mano al VPS a las 11:5x y main todavia no lo tenia. La corrida de las
# 12:44 lo habria pisado con la version vieja y los 15 loops habrian vuelto a
# arrancar sin memoria, sin alerta. "Sincronizar desde main" es correcto cuando
# main va ADELANTE; cuando va atras, es borrar trabajo. La marca se elige por
# capacidad, no por fecha: si el desplegado sabe algo que el de main no, se espera.
ids_case() { grep -oE '^  [a-z0-9-]+\)' "$1" 2>/dev/null | tr -d ' )' | sort -u; }

PERDIDOS=""
if [ -f "$DESTINO_BIN/onia-loop.sh" ] && [ -f "$FUENTE/onia-loop.sh" ]; then
  while read -r id; do
    [ -n "$id" ] || continue
    if crontab -l 2>/dev/null | grep -qE "onia-loop\.sh +${id}([[:space:]]|\$)"; then
      PERDIDOS="$PERDIDOS $id"
    fi
  done < <(comm -13 <(ids_case "$FUENTE/onia-loop.sh") <(ids_case "$DESTINO_BIN/onia-loop.sh"))
fi

MARCA_RUNNER="memoria inyectada"
DEGRADA=0
if grep -q "$MARCA_RUNNER" "$DESTINO_BIN/onia-loop.sh" 2>/dev/null \
   && ! grep -q "$MARCA_RUNNER" "$FUENTE/onia-loop.sh" 2>/dev/null; then
  DEGRADA=1
fi

if [ -n "$PERDIDOS" ]; then
  log "RECHAZADO: el corredor de main no conoce a$PERDIDOS, y el cron los sigue llamando — dejo el desplegado"
  "$TG" "🔴 <b>Sync de loops frenado</b>: el corredor de <code>main</code> no conoce a <code>$(echo "$PERDIDOS" | sed 's/^ //; s/ /<\/code>, <code>/g')</code>, pero el cron los llama igual. Los habria matado con exit 64. Falta mergear su rama a main; mientras tanto dejo el corredor que anda." >/dev/null 2>&1 || true
elif [ "$DEGRADA" = 1 ]; then
  log "RECHAZADO onia-loop.sh: main esta ATRAS del VPS (le falta '$MARCA_RUNNER') — se espera al integrador"
  if [ ! -f /var/lib/onia-sync-degradacion.avisado ] || [ $(( $(date +%s) - $(stat -c %Y /var/lib/onia-sync-degradacion.avisado) )) -gt 21600 ]; then
    "$TG" "⚠️ <b>Sync</b>: <code>main</code> tiene un corredor MAS VIEJO que el desplegado (sin memoria compartida). No lo pisé. Falta que el integrador mergee la rama que lo trae." >/dev/null 2>&1 || true
    touch /var/lib/onia-sync-degradacion.avisado
  fi
else
  poner "$FUENTE/onia-loop.sh" "$DESTINO_BIN/onia-loop.sh"
fi

# El sincronizador se despliega A SI MISMO. Sin esta linea es el unico archivo del
# sistema que hay que copiar a mano, y por lo tanto el unico cuyas mejoras nunca se
# encienden solas — el mismo bug que este script existe para resolver, aplicado a
# si mismo. Medido el 2026-09-02: se le agrego el despliegue del tablero, corrio, y
# desplego los 8 prompts pero NO el tablero, porque el que corria era el viejo.
# Es seguro auto-reemplazarse: `poner` hace `mv`, que cambia el inodo, y bash sigue
# leyendo el inodo viejo que ya tiene abierto hasta terminar esta corrida.
poner "$FUENTE/sincronizar.sh" "$DESTINO_BIN/onia-loops-sync.sh"

# El tablero, como herramienta del VPS y NO como archivo del worktree.
#
# Nace del 2026-09-02: el prompt de los nueve loops dice "el tablero va primero" e
# invocaba `scripts/kanban/tablero.sh`, ruta RELATIVA al worktree de cada carril.
# Pero cada carril esta parado en SU rama, y el script se creo en `main` ese mismo
# dia: en `onia-hermes-chatbot`, `-canario` y `-web-venta` el archivo directamente
# NO EXISTIA. La regla mas importante del arranque fallaba con "No such file".
#
# El corredor no mergea `main` hacia las ramas de carril (a proposito: le arrancaria
# el arbol de abajo a un loop en curso), asi que una herramienta compartida NO puede
# vivir en una rama — llega solo a quien casualmente este actualizado. Va a /root/bin
# junto a onia-tg.sh, que es exactamente el mismo caso.
poner "$RAIZ/scripts/kanban/tablero.sh" "$DESTINO_BIN/onia-tablero.sh"

# El ENRUTADOR de avisos, que es como un carril le habla a Sergio Urcullo y como
# nacen las tareas [auto:] del tablero.
#
# ⚠️ Aca arriba decia "junto a onia-tg.sh, que es exactamente el mismo caso y por eso
# nunca fallo" — y era FALSO: onia-tg.sh NO tenia linea `poner`. Corregido el
# 2026-09-10. Su copia de /root/bin del VPS estaba puesta a mano (mtime 08-sep 16:39)
# y se atraso: el 2026-09-08 chatbot-cola arreglo la dedup para que la clave se
# calcule sobre el titulo NORMALIZADO —sin eso, dos avisos que solo difieren en la
# duracion ("chatbot-cola · 433s" y "· 7s") hashean distinto y el aviso se duplica—,
# el arreglo entro a main con su gate verde (test:tg-dedup) y la maquina que lo corre
# siguio con `CLAVE=$(printf '%s' "$TITULO" | md5sum ...)`. Dos dias despues habia 22
# tareas [auto:] vivas que eran el MISMO aviso, sobre el tablero del que los cuatro
# carriles sacan trabajo.
#
# La frase importa porque manda al revés: quien la lee da el caso por cubierto y no
# mira las lineas `poner`. Un comentario que explica por que algo no hace falta es una
# hipotesis con fecha, no un hecho.
#
# En el nodo de casa esto es un SHIM que sale por SSH (el token vive en el VPS), y la
# guarda de `poner` lo conserva por su marca de la linea 2. Lo cubre
# `npm run test:herramientas-desplegadas`, que deriva el universo del disco.
poner "$FUENTE/onia-tg.sh" "$DESTINO_BIN/onia-tg.sh"

# El lector de Telegram de RESPALDO, por la misma razon que el tablero: es una
# herramienta del VPS, no un archivo de carril.
#
# ⚠️ Acá decía que es "el unico camino de ENTRADA de Sergio", y es FALSO —
# corregido el 2026-09-03. El camino de entrada vivo es el gateway de Hermes
# (`hermes_cli.main gateway run`), que pollea ese mismo bot: verificado con
# `ss -tnp | grep 149.154` (socket abierto, PID del gateway) y con dos actos
# suyos, la tarea t_13eaa0ae nacida de un mensaje de Sergio y t_04baed70
# desbloqueada con su veredicto a las 18:42:55.
#
# La frase importa porque manda al revés: leerla lleva a programar el script
# "para que por fin ande", y eso le PARTE el circuito a Sergio en vez de
# arreglarlo — Telegram entrega cada mensaje una sola vez, al que lo pida
# primero. El script ya se niega solo si el gateway está vivo; esto es para que
# nadie llegue hasta ahí. Lo cubre `npm run test:telegram-un-consumidor`.
poner "$RAIZ/scripts/kanban/telegram-entrada.py" "$DESTINO_BIN/onia-tg-entrada.py"

# El publicador que corre cuando Sergio contesta `ok <id>`, y el cliente de Postiz
# que usa. Van a /root/bin por la MISMA razon que el tablero: los llama el lector
# de Telegram, que no vive en ningun worktree y por lo tanto no tiene el repo al
# lado. Sin estos dos, `ok <id>` vuelve a ser solo un `unblock` y la pieza se
# queda en el disco — que es exactamente el bug que se arreglo el 2026-09-04.
poner "$RAIZ/scripts/kanban/publicar-aprobado.mjs" "$DESTINO_BIN/onia-publicar-aprobado.mjs"
poner "$RAIZ/scripts/postiz_schedule.mjs"          "$DESTINO_BIN/onia-postiz-schedule.mjs"
# El brazo del `ok <id>` cuando la tarea es un DEPLOY y no una pieza. Sin el,
# `ok` sobre un pedido de publicar el sitio desbloquea la tarea y no despliega
# nada: el mismo bug del 2026-09-04, un escalon mas abajo. Medido el 2026-09-05
# sobre t_4cd13524 (codigo 2, "no era una pieza"), con 30 arreglos esperando.
poner "$RAIZ/scripts/kanban/desplegar-en-segundo-plano.sh" "$DESTINO_BIN/onia-desplegar-fondo.sh"

# El publicador AUTOMATICO (cron `50 */3`), que publica solo lo que NO toca una fuente de
# precio. Estaba en el repo y en /root/bin del VPS, pero nadie lo copiaba: la que ejecutaba
# era una copia a mano. Lo destapo `npm run test:herramientas-desplegadas` el 2026-09-12, en
# cuanto `deploy_sin_pedido.mjs` empezo a NOMBRARLO para preguntarle si un destino se publica
# solo — o sea que la herramienta se volvio sujeto del gate recien cuando alguien la cito.
# Hoy las dos copias son identicas (mismo md5), asi que cablearlo no revierte nada; manana,
# sin esta linea, un arreglo suyo se quedaria en el repo mientras el cron corre el fosil.
poner "$FUENTE/extras/publicar-solo.sh"            "$DESTINO_BIN/onia-publicar-solo.sh"

# Las dos herramientas del "cerebro", que entraron a main el 2026-09-18 con su destino
# de /root/bin escrito en su propia cabecera y sin nadie que las copiara: el jarvis
# matinal tiene cron VIVO en el VPS (`25 12 * * *`, 08:25 La Paz) y el refrescador del
# panel esta pausado pero instalado. Lo destapo `npm run test:herramientas-desplegadas`
# al mergear. Verificado el diff INVERSO antes de cablearlas —un deploy por lista blanca
# revierte lo que solo existe en produccion—: las copias vivas del VPS y las del repo
# tienen el MISMO md5 (0c23cb37 y 29108494), asi que esto no pisa nada hoy y evita que
# manana el cron ejecute un fosil.
poner "$FUENTE/extras/jarvis-voz.sh"               "$DESTINO_BIN/onia-jarvis-voz.sh"
poner "$RAIZ/scripts/cerebro/onia-cerebro-datos.py" "$DESTINO_BIN/onia-cerebro-datos.py"

# La marca de Onia sobre Chatwoot. Cron VIVO en el VPS (`17 * * * *`) y NADIE lo copiaba:
# la copia que ejecutaba era la de 14 lineas que defiende 3 claves, y el arreglo del
# 2026-08-31 —que defiende NUEVE, porque el reconcile de Chatwoot restaura diez— entro a
# main y se quedo ahi 19 dias.
#
# Aca el diff INVERSO da al reves que en los dos bloques de arriba, y por eso esta linea
# no es prevencion sino cura: produccion corre el FOSIL y el repo tiene el arreglo. Medido
# el 2026-09-19 preguntandole al contenedor vivo (`bash <copia del repo> --check`, que no
# escribe): `REVERTIDAS 6/9` — BRAND_URL, TERMS_URL y PRIVACY_URL en `www.chatwoot.com`, y
# los tres LOGO de fabrica. Las tres URL viajan en el objeto de config que el front embebe
# en https://chat.onia.com.bo/app/login, o sea que la pantalla por la que se atiende a un
# cliente enlaza a los terminos y la privacidad de Chatwoot.
#
# Que lo mantuvo invisible: `test:herramientas-desplegadas` deriva su universo con el regex
# `/root/bin/(onia-[...])`, asi que una herramienta que no empieza con `onia-` no es sujeto
# suyo POR CONSTRUCCION — y las dos que hoy estan separadas de su fuente (esta y
# claude-guardia.sh) son justo las dos que el prefijo deja afuera.
poner "$RAIZ/hermes-content/deploy/vps-ops/chatwoot-brand-onia.sh" "$DESTINO_BIN/chatwoot-brand-onia.sh"

# La memoria compartida: el corredor la inyecta y los loops le escriben por estos
# dos. Si no se despliegan solos, el corredor de main llama a un script que no
# existe en /root/bin y los 15 loops fallan mudos en la primera linea.
poner "$FUENTE/aprender.sh"            "$DESTINO_BIN/onia-aprender.sh"
poner "$FUENTE/consolidar-memoria.sh"  "$DESTINO_BIN/onia-consolidar-memoria.sh"
# El extractor de patrones de fallo: la otra mitad del circuito de aprendizaje.
# `aprender.sh` sabe ESCRIBIR una leccion; sin esto, nadie sabe QUE leccion hace
# falta, porque nadie compara una vuelta con la anterior. Lo corre el supervisor.
poner "$FUENTE/extraer-fallos.sh"      "$DESTINO_BIN/onia-extraer-fallos.sh"
# El parte diario: el UNICO mensaje que le sale a Sergio Urcullo por Telegram sin que
# el pregunte (todo lo demas de onia-tg.sh se vuelve tarea del tablero). Le faltaba su
# `poner` desde que nacio: el 2026-09-24 el vivo y el versionado coincidian por md5 pero
# NADIE los sincronizaba — alguien lo habia copiado a mano el 21-sep. Un arreglo al canal
# de salida del negocio que no viaja vale cero, y peor: la copia a mano se lee como
# "desplegado" en el proximo md5sum.
poner "$FUENTE/parte-diario.sh"            "$DESTINO_BIN/onia-parte-diario.sh"
# Los vigias y el renovador de horarios, por la misma razon: existian solo en
# /root/bin y una reinstalacion desde el repo los borraba sin avisar.
poner "$FUENTE/vigia-disco.sh"             "$DESTINO_BIN/onia-vigia-disco.sh"
# El vigia de los loops que corren FUERA del VPS. Corre en el VPS a proposito: el
# aviso de la PC de casa sale por un shim SSH a esta maquina, asi que la PC no
# puede avisar de su propia muerte (PLAN_HOMELAB.md §6). Sin lista de loops
# mudados no hace nada, asi que es seguro tenerlo desplegado desde antes.
poner "$FUENTE/vigia-loops-remotos.sh"     "$DESTINO_BIN/onia-vigia-loops-remotos.sh"
# El vigia del CI de GitHub. Sin el, un `master` roto por Actions no se lo dice
# a nadie: el 2026-09-06 un .ico en RGB lo tumbo y se supo 10 min despues, de
# casualidad. Sale 0 y avisa una sola vez mientras le falte el token.
poner "$FUENTE/vigia-ci.sh"                "$DESTINO_BIN/onia-vigia-ci.sh"
poner "$FUENTE/aligerar-worktrees.sh"      "$DESTINO_BIN/onia-aligerar-worktrees.sh"
poner "$FUENTE/respaldar-memoria-hermes.sh" "$DESTINO_BIN/onia-respaldar-memoria.sh"
poner "$FUENTE/renovar-slots-bot.py"       "$DESTINO_BIN/onia-renovar-slots.py"
poner "$FUENTE/hermes-vigia.sh"            "$DESTINO_BIN/hermes-vigia.sh"
# El vigia de aprobaciones: cada pregunta de un loop le llega a Sergio al instante,
# con la foto. Es la mitad del circuito "el loop pregunta -> Sergio contesta ok"
# que faltaba del lado de Sergio (2026-09-03).
poner "$FUENTE/vigia-aprobaciones.sh"      "$DESTINO_BIN/onia-vigia-aprobaciones.sh"
# Renovar la sesion OAuth de Higgsfield desde un VPS sin navegador (2026-09-03:
# el servidor la revoco sin que venciera; el CLI solo sabe abrir un navegador).
# Reinicio del gateway de Hermes con SUS comandos (gateway stop / run), nunca
# pkill: el 2026-09-03 pkill dejaba vivo al supervisor de Hermes, que relanzaba
# al hijo -> "Gateway (re)started 6 times in 120s", dos instancias peleando.
poner "$FUENTE/hermes-gateway-restart.sh"  "$DESTINO_BIN/hermes-gateway-restart.sh"
poner "$FUENTE/hf-login-start.sh"          "$DESTINO_BIN/hf-login-start.sh"
poner "$FUENTE/hf-login-finish.sh"         "$DESTINO_BIN/hf-login-finish.sh"

# Ocho herramientas que el cron del VPS EJECUTA y que nadie copiaba — la misma
# pantomima que ya habia mordido a `parte-diario.sh` aca arriba: el vivo y el
# versionado coinciden por md5, asi que el proximo md5sum las lee como
# "desplegadas", pero la coincidencia es de alguien que copio a mano una vez.
# El dia que alguien arregle la fuente, produccion sigue con el fosil y el
# arreglo vale cero.
#
# Medido el 2026-09-24 antes de cablearlas, en las DOS direcciones (que es la
# unica forma de que un `poner` nuevo no REVIERTA lo que solo existe en el VPS):
# los 8 md5 de `origin/main` y los 8 de /root/bin son identicos, uno a uno. O sea
# que hoy cablearlas no cambia ni un byte en produccion — por eso es el momento
# seguro de hacerlo, y por eso no hay que esperar a que diverjan.
#
# `hermes-content/deploy` y `scripts/loops` ya estan en RUTAS_SYNC, asi que los
# archivos viajan. Las OTRAS 6 de `npm run herramientas:vivas` (los respaldos y
# los crons del producto) viven en `hermes-content/infra`, que NO esta en
# RUTAS_SYNC: esas no se arreglan con una linea y quedan anotadas, no a medias.
poner "$RAIZ/hermes-content/deploy/vps-ops/claude-guardia.sh"             "$DESTINO_BIN/claude-guardia.sh"
poner "$RAIZ/hermes-content/deploy/vps-ops/onia-mirar-cliente.sh"         "$DESTINO_BIN/onia-mirar-cliente.sh"
# El .sh de arriba es un envoltorio de tres lineas: su trabajo real es `node
# /root/bin/onia-mirar-cliente.mjs`. Cablear el envoltorio y NO el modulo que ejecuta
# deja el agujero donde esta el codigo — y este es el monitor que mira la pantalla de
# login del cliente. El -prueba.sh es su sonda a mano, y declara /root/bin en su propia
# cabecera. Los dos aparecieron al declarar la carpeta entera en herramientas-desplegadas.
poner "$RAIZ/hermes-content/deploy/vps-ops/onia-mirar-cliente.mjs"        "$DESTINO_BIN/onia-mirar-cliente.mjs"
poner "$RAIZ/hermes-content/deploy/vps-ops/onia-mirar-cliente-prueba.sh"  "$DESTINO_BIN/onia-mirar-cliente-prueba.sh"
poner "$RAIZ/hermes-content/deploy/vps-ops/onia-rescate-mensaje-perdido.sh" "$DESTINO_BIN/onia-rescate-mensaje-perdido.sh"
poner "$RAIZ/hermes-content/deploy/vps-ops/onia-siat-vigia.sh"            "$DESTINO_BIN/onia-siat-vigia.sh"
poner "$RAIZ/hermes-content/deploy/vps-ops/onia-vigia-sin-respuesta.sh"   "$DESTINO_BIN/onia-vigia-sin-respuesta.sh"
# El vigia de comprobantes de pago (2026-09-24): un cliente que sube su comprobante solo
# generaba un correo; si se perdia, el cliente que PAGO se quedaba sin plan. Nace cableado,
# no copiado a mano: la copia a mano es la que despues se atrasa sin avisar.
poner "$RAIZ/hermes-content/deploy/vps-ops/vigia-comprobantes.sh"         "$DESTINO_BIN/onia-vigia-comprobantes.sh"
# El vigia de seguridad (2026-09-24). El viejo vivia solo en /opt/onia/security-watch.sh,
# copiado a mano, y estuvo ~41 dias mirando un contenedor que ya no existia sin que nadie
# lo supiera. Nace en /root/bin y cableado; el crontab se muda a esta ruta (no se pisa /opt).
poner "$RAIZ/hermes-content/deploy/vps-ops/security-watch.sh"             "$DESTINO_BIN/onia-security-watch.sh"
poner "$FUENTE/extras/onia-drop-recordatorio.sh"  "$DESTINO_BIN/onia-drop-recordatorio.sh"
poner "$FUENTE/extras/onia-leads-vigia.sh"        "$DESTINO_BIN/onia-leads-vigia.sh"
poner "$FUENTE/extras/onia-vigia-embudo.sh"       "$DESTINO_BIN/onia-vigia-embudo.sh"

# El runbook de deploy de la LANDING (onia.com.bo). Vivia solo en
# /opt/onia-landing/_deploy: build-and-stage.sh sin versionar, y
# swap-and-verify.sh con el bit de ejecucion perdido ("Permission denied" el
# 2026-09-03, a mitad de un deploy). `poner` hace bash -n y chmod 755 en cada
# copia: un runbook que no se puede ejecutar no vuelve a pasar en silencio.
if [ -d /opt/onia-landing/_deploy ]; then
  poner "$RAIZ/hermes-content/deploy/onia-landing/build-and-stage.sh"  /opt/onia-landing/_deploy/build-and-stage.sh
  poner "$RAIZ/hermes-content/deploy/onia-landing/swap-and-verify.sh"  /opt/onia-landing/_deploy/swap-and-verify.sh
  poner "$RAIZ/hermes-content/deploy/onia-landing/publicar.sh"         /opt/onia-landing/_deploy/publicar.sh
fi

# El runbook de deploy de la PLATAFORMA (app.onia.com.bo). Mismo agujero que la
# landing, en la mitad de al lado: deploy-gates-swap.sh estaba scripteado y el
# BUILD no. Habia un build-<sha>.sh suelto por deploy (copias identicas salvo el
# sha) y el deploy del 2026-09-03 se hizo entero a mano, sin dejar script. Un
# paso a mano en el medio de la cadena es por que un commit verde pasa dias sin
# llegar al cliente.
#
# Desde el 2026-09-24 produccion es una IMAGEN (onia-platform:release-<sha8>) y el
# swap es swap-imagen.sh, que ahora SI se sincroniza. El viejo deploy-gates-swap.sh
# se editaba en el VPS a proposito "porque pide OK de Sergio", pero quien lo llama
# es publicar.sh, y a publicar.sh ya lo disparan el `ok <id>` (publicar-aprobado) y
# el cron publicar-solo con su freno de precio: la firma vive ahi, no en el swap.
# Un swap sin versionar al lado de un publicador versionado es la copia que se
# desincroniza. Y el viejo copia a runtime-next, que el contenedor por imagen ya
# no monta: no hay que correrlo.
if [ -d /opt/onia-platform ]; then
  mkdir -p /opt/onia-platform/_deploy
  poner "$RAIZ/hermes-content/deploy/onia-platform/build-and-stage.sh"    /opt/onia-platform/build-and-stage.sh
  poner "$RAIZ/hermes-content/deploy/onia-platform/swap-imagen.sh"        /opt/onia-platform/swap-imagen.sh
  poner "$RAIZ/hermes-content/deploy/onia-platform/recreate-container.sh" /opt/onia-platform/recreate-container.sh
  poner "$RAIZ/hermes-content/deploy/onia-platform/publicar.sh"           /opt/onia-platform/_deploy/publicar.sh
fi

# 🔴 LOS TRES `publicar.sh` SE SINCRONIZAN, no solo el del bot. Medido el
# 2026-09-06: de los tres destinos que el `ok <id>` de Sergio ejecuta, este
# script copiaba UNO — el del bot, agregado el 05-sep cuando ese destino no
# estaba en la lista blanca del ejecutor. El arreglo se aplico a la instancia
# que lo motivo y no viajo a sus dos hermanas, asi que /opt/onia-landing y
# /opt/onia-platform corrian copias hechas a mano: coincidian con main por
# diligencia, no por construccion. El fallo es mudo en las dos direcciones —
# un arreglo commiteado no llega, y un arreglo hecho en /opt no esta en git.
# Anclado en scripts/publicadores-desplegados.test.mjs (`npm run
# test:publicadores`), que deriva los sujetos de la lista blanca del ejecutor y
# del disco: un publicador nuevo nace cubierto.
#
# El publicador del BOT, el tercer destino que Sergio aprueba con `ok <id>`.
# Hasta el 2026-09-05 el bot no estaba en la lista blanca de
# publicar-aprobado.mjs: el `ok` devolvia "destino desconocido" y no desplegaba
# nada, con DOS tareas `ready` pidiendo el mismo swap sobre un bot que le decia
# "en construccion" a 2 de los 5 rubros que se venden. A diferencia de
# /opt/onia-landing/_deploy y /opt/onia-platform, este directorio NO existia:
# hay que crearlo, o el `poner` falla y el circuito queda cableado a una ruta
# que no esta — que es justo el fallo mudo que este envoltorio viene a cerrar.
if [ -d /opt/onia/bot ]; then
  mkdir -p /opt/onia/bot/_deploy
  poner "$RAIZ/hermes-content/deploy/vps-ops/bot/publicar.sh" /opt/onia/bot/_deploy/publicar.sh
fi

# El publicador del EMISOR SIAT, el cuarto destino. Es el que faltaba: hasta el
# 2026-09-08 era el unico de los cuatro sin circuito — sin _deploy/, fuera de la
# lista blanca del ejecutor y sin linea aca —, asi que un pedido
# `DESPLEGAR: siat` nacia inejecutable y el `ok` de Sergio Urcullo daba tilde
# verde sin desplegar nada. Por eso el arreglo del CUFD (a28b3689) llevaba
# CUATRO DIAS en main sin llegar al archivo que el VPS ejecuta: con el emisor
# viejo, las etapas VI y IX de la Fase 1 vuelven a fallar y queman la corrida.
# Mismo caso que el bot: el directorio _deploy NO existe y hay que crearlo, o el
# `poner` falla y el circuito queda cableado a una ruta que no esta.
if [ -d /opt/onia-siat ]; then
  mkdir -p /opt/onia-siat/_deploy
  poner "$RAIZ/hermes-content/deploy/onia-siat/publicar.sh" /opt/onia-siat/_deploy/publicar.sh
fi

mkdir -p "$DESTINO_BIN/loops"
# La misma guarda que el corredor, para los prompts. Medido el 2026-09-03 a las
# 12:04: la guarda de arriba salvo onia-loop.sh, y en la MISMA corrida el sync
# piso los 15 prompts con la version de main, que no tenia el bloque de memoria
# compartida — los loops seguian recibiendo la memoria (la inyecta el runner)
# pero perdieron las instrucciones de como ESCRIBIRLE. Un prompt desplegado que
# sabe algo que el de main no sabe, no se reemplaza.
MARCA_PROMPT="MEMORIA COMPARTIDA — la leés al arrancar"
RECHAZADOS_PROMPT=0
for f in "$FUENTE"/prompts/*.md; do
  [ -f "$f" ] || continue
  dest="$DESTINO_BIN/loops/$(basename "$f")"
  if grep -q "$MARCA_PROMPT" "$dest" 2>/dev/null && ! grep -q "$MARCA_PROMPT" "$f" 2>/dev/null; then
    RECHAZADOS_PROMPT=$((RECHAZADOS_PROMPT + 1))
    continue
  fi
  poner "$f" "$dest"
done
[ "$RECHAZADOS_PROMPT" -gt 0 ] && log "RECHAZADOS $RECHAZADOS_PROMPT prompt(s): main esta ATRAS del VPS (sin '$MARCA_PROMPT') — se espera al integrador"

# Un prompt que quedo en /root/bin/loops y ya no existe en el repo es un loop
# borrado a medias: el corredor lo seguiria encontrando. Se avisa, no se borra
# solo — borrar sin que nadie mire es como se pierden cosas.
for f in "$DESTINO_BIN"/loops/*.md; do
  [ -f "$f" ] || continue
  n=$(basename "$f")
  [ -f "$FUENTE/prompts/$n" ] || log "aviso: $n esta desplegado y NO existe en el repo — sobra o falta commitear"
done

if [ "$CAMBIOS" -gt 0 ]; then
  log "sincronizados $CAMBIOS archivo(s) desde main"
  "$TG" "🔄 <b>Loops</b>: $CAMBIOS archivo(s) desplegados desde <code>main</code> en el VPS" >/dev/null 2>&1 || true
fi
exit 0
