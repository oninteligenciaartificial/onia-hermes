#!/usr/bin/env bash
# ONIA — Hermes carga tareas en la cola de la orquesta (issues de GitHub) y lee cómo van.
#
# POR QUÉ EXISTE (2026-10-20). Stack v3 de la orquesta (scripts/orquesta/README.md): Hermes planifica,
# el programa fijo scripts/orquesta/orquesta.mjs reparte los issues `orquesta` + `carril:<área>` a
# GitHub Actions y a la PC. Faltaba que Hermes cargara tareas solo. Los guardarraíles son los de la
# sección «v2» de hermes-content/docs/research/harness-orquestacion-autonomia.md, y este comando los
# hace cumplir: tope diario, nada sin `check:` ejecutable, `necesita-ok` para publicar, gastar,
# contactar, producción y merge, y Hermes nunca declara algo hecho (lo declaran el check y el revisor).
# El VPS no tiene `gh` (medido el 19-oct): todo va con curl y el token de Issues de 6g
# (hermes-content/docs/handoff/orquesta.md), que vive en /root/.config/onia/gh-issues-token (600).
#
# Uso (la tarea va SOLO por la ENTRADA ESTÁNDAR, con un heredoc entre comillas cuyo delimitador nadie
# escribe en una tarea: así ningún $, `, comilla ni renglón del texto pasa por la shell. Como
# argumento sale 64):
#   onia-orquesta-hermes.sh --crear <<'FIN_TAREA_ONIA_4b9e'      carga una tarea (formato en la skill
#   titulo: …                                                     planificar-orquesta)
#   carril: plataforma|marca|comunidad|video|investigacion
#   nivel: rapido|normal|profundo
#   donde: pc|nube
#   check: urls  |  check: cmd npm run test:<x>  |  check: cmd npm test  |  check: cmd node --test <ruta>
#   necesita-ok: si|no
#   (opcionales: salida: <ruta> · base: <rama> · ok: sergio)
#
#   Qué hay que hacer.
#   Hecho cuando: cómo se comprueba.
#   FIN_TAREA_ONIA_4b9e
#   onia-orquesta-hermes.sh --revisar          tus tareas (origen:hermes) con su estado; avisa una vez
#                                              cada bloqueada nueva en el resumen de Sergio Urcullo
#   onia-orquesta-hermes.sh --cerrar <número> <<'FIN_TAREA_ONIA_4b9e'   cierra SIN HACER una tarea tuya
#   el motivo                                                          que todavía no empezó
#   FIN_TAREA_ONIA_4b9e
#   onia-orquesta-hermes.sh --estado           ¿token y labels listos? (solo lee; no crea nada)
#   onia-orquesta-hermes.sh --lista            lo mismo que --revisar, sin avisar nada (lo lee el resumen)
#
# 🔴 EL TOKEN ES DE LA CUENTA DE SERGIO URCULLO. Lo que se crea con él lo firma su usuario, y el
# orquestador le cree (autores de carriles.json). Este comando frena el ERROR del modelo —una tarea
# sin check, un `check: cmd` que sería un comando cualquiera en su PC, una publicación sin su ok, un
# bucle que llena la cola—; no frena a alguien con root en el VPS, que puede leer el token.
#
# Salidas: 0 hecho · 64 uso (o el texto como argumento) · 65 tarea inválida · 69 sin token, sin labels
# o sin flock · 75 tope del día, repetida u otra carga en curso · 1 no salió o no se sabe (lo dice).
set +x -uo pipefail   # nunca con traza: el token pasa por una variable (revisión de seguridad, 20-oct)
export LC_ALL=C.UTF-8

# Sin variables de entorno a propósito: un modelo que se equivoca no se sube el tope ni se borra el
# registro con un `VAR=x` delante. Las pruebas reescriben estas rutas (como hermes-jarvis-aplicar.test).
readonly REPO=oninteligenciaartificial/onia-hermes
readonly API=https://api.github.com
readonly TOKEN_ARCHIVO=/root/.config/onia/gh-issues-token
readonly ESTADO=/var/lib/onia-orquesta-hermes
readonly TG=/root/bin/onia-tg.sh
readonly TOPE=10                     # tareas por día de La Paz (sección «v2»: tope diario)
readonly CARRILES="plataforma marca comunidad video investigacion"   # = carriles de carriles.json (una prueba los compara)
readonly LABELS_NECESARIOS="orquesta origen:hermes necesita-ok"

REGISTRO="$ESTADO/creadas.tsv"      # ts_utc numero carril hash url (numero vacío = no se sabe si salió)
AVISADAS="$ESTADO/avisadas"         # números de bloqueadas ya avisadas

uso() { sed -n '/^# Uso/,/^# 🔴/p' "$0" | sed '$d; s/^# \{0,1\}//' >&2; exit 64; }
esc() { sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g'; }
# Bolivia: UTC-4 todo el año, así que el día de La Paz empieza a las 04:00 UTC. Se cuenta con awk sobre
# el registro (sin un `date` por línea bajo el candado).
cargadas_hoy() {
  local inicio=$(( ($(date -u +%s) - 14400) / 86400 * 86400 + 14400 ))
  [ -f "$REGISTRO" ] || { echo 0; return; }
  awk -F'\t' -v d="$inicio" '$1 >= d { n++ } END { print n + 0 }' "$REGISTRO"
}

TMP=$(mktemp -d) || exit 1
trap 'rm -rf "$TMP"' EXIT

# El token nunca va como argumento (se vería en /proc) ni a la salida: va a un archivo 600 de $TMP que
# curl lee con -H @archivo, como pedido-claude.sh.
cargar_token() {
  [ -f "$TOKEN_ARCHIVO" ] || { echo "Falta el token de Issues ($TOKEN_ARCHIVO): la orquesta está apagada para Hermes." >&2; return 69; }
  local permisos; permisos=$(stat -c %a "$TOKEN_ARCHIVO" 2>/dev/null)
  case "$permisos" in 600|400) ;; *) echo "El token de Issues tiene permisos ${permisos:-?}: dejalo en 600 (chmod 600 $TOKEN_ARCHIVO). No lo usé." >&2; return 69 ;; esac
  local t=""
  read -r t 2>/dev/null < "$TOKEN_ARCHIVO"
  # Solo fine-grained (github_pat_): un clásico (ghp_) trae el scope `repo` entero, no solo Issues.
  [[ "$t" =~ ^github_pat_[A-Za-z0-9_]{20,}$ ]] \
    || { echo "El token de Issues no es uno fine-grained de GitHub (github_pat_…; ¿mal pegado o clásico?): no lo usé." >&2; return 69; }
  ( umask 077; printf 'Authorization: Bearer %s\n' "$t" > "$TMP/h" )
}

gh_api() {  # gh_api METODO RUTA [cuerpo.json] -> imprime el código HTTP; la respuesta queda en $TMP/r
  rm -f "$TMP/r"   # sin red, curl no escribe: no se lee la respuesta del llamado anterior
  local a=(-s --max-time 30 -o "$TMP/r" -w '%{http_code}' -X "$1" -H @"$TMP/h"
           -H 'Accept: application/vnd.github+json' -H 'X-GitHub-Api-Version: 2022-11-28')
  [ -n "${3:-}" ] && a+=(-H 'Content-Type: application/json' --data-binary @"$3")
  # Sin -S ni -v: un error de curl no imprime los encabezados (el token).
  curl "${a[@]}" "$API$2" </dev/null 2>/dev/null
}

aviso() {  # aviso <clave> <mensaje> — al resumen de Sergio Urcullo, nunca lo interrumpe
  ONIA_AVISO=resumen ONIA_AVISO_EMISOR=orquesta ONIA_AVISO_CLAVE="$1" "$TG" "$2" </dev/null >/dev/null 2>&1
}

leer_entrada() {  # el texto, SOLO por la entrada estándar; recorta el principio y el final, no la sangría
  ENTRADA=""
  if [ ! -t 0 ]; then
    ENTRADA=$(timeout 5 cat) || { echo "No pude leer la entrada completa: no hice nada." >&2; exit 65; }
  fi
  ENTRADA="${ENTRADA#"${ENTRADA%%[![:space:]]*}"}"
  ENTRADA="${ENTRADA%"${ENTRADA##*[![:space:]]}"}"
}

candado() {
  command -v flock >/dev/null 2>&1 || { echo "Falta «flock» (util-linux): sin candado no cargo nada." >&2; exit 69; }
  { exec 9>"$ESTADO/lock"; } 2>/dev/null || { echo "No pude abrir el candado ($ESTADO/lock): no cargué nada." >&2; exit 1; }
  flock -w 60 9 || { echo "Hay otra carga en curso: probá de nuevo en un momento." >&2; exit 75; }
}

# ── --estado: solo lee ─────────────────────────────────────────────────────────
estado() {
  cargar_token || exit $?
  local code
  code=$(gh_api GET "/repos/$REPO")
  [ "$code" = 200 ] || { echo "El token no llega al repo $REPO (HTTP ${code:-000}): ¿vencido o sin acceso a onia-hermes?" >&2; exit 69; }
  for l in $LABELS_NECESARIOS; do
    code=$(gh_api GET "/repos/$REPO/labels/${l//:/%3A}")
    [ "$code" = 200 ] || { echo "Falta el label «$l» en $REPO (HTTP ${code:-000}): sin él la tarea no entra a la cola o no espera su ok." >&2; exit 69; }
  done
  echo "✅ cola de la orquesta: token y labels listos ($REPO)"
}

# ── --crear ────────────────────────────────────────────────────────────────────
validar() {  # ENTRADA -> $TMP/tarea.json {title, body, labels, carril, hash, forzado} o error (exit 65)
  ENTRADA="$ENTRADA" ORQ_CARRILES="$CARRILES" python3 - "$TMP/tarea.json" <<'PY'
import hashlib, json, os, re, sys, unicodedata

def no(msg):
    print(msg, file=sys.stderr); raise SystemExit(65)

# Solo texto que se lee igual que se ve (revisión de seguridad, 20-oct): sin caracteres invisibles
# (Pub<U+200B>licar), sin controles y sin letras de otros alfabetos (la «р» cirílica de рublicar). Si no, el
# respaldo de palabras de abajo se rodea sin que nadie lo note. Las de ancho completo («ＡＢＣ») tampoco
# entran: su nombre no empieza con LATIN. NFC y no NFKC: NFKC cambiaría «1º» por «1o».
entrada = unicodedata.normalize("NFC", os.environ["ENTRADA"].replace("\r", ""))
for ch in entrada:
    cat = unicodedata.category(ch)
    if ch in "\n\t":
        continue
    if cat[0] == "C" or cat in ("Zl", "Zp") or (cat[0] == "L" and ord(ch) > 0x7F
                                                 and not unicodedata.name(ch, "").startswith(("LATIN", "FEMININE ORDINAL", "MASCULINE ORDINAL"))):
        no(f"la tarea trae un caracter que no se ve o no es del alfabeto latino (U+{ord(ch):04X}): escribila en texto común")
lineas = entrada.split("\n")
PERMITIDOS = ["titulo", "carril", "nivel", "donde", "check", "necesita-ok", "salida", "base", "ok"]
campos, i = {}, 0
def sin_tildes(s):
    return "".join(ch for ch in unicodedata.normalize("NFKD", s) if not unicodedata.combining(ch))

for i, l in enumerate(lineas):
    m = re.match(r"^([^\W\d_][\w-]*)\s*:\s*(.*)$", l)
    if not m:
        break
    clave, valor = sin_tildes(m.group(1)).lower(), m.group(2).strip()
    if clave not in PERMITIDOS:
        no(f"campo desconocido «{clave}:». Van solo: {', '.join(PERMITIDOS)} (el modelo lo elige el nivel)")
    if clave in campos:
        no(f"«{clave}:» está dos veces")
    campos[clave] = valor
else:
    i = len(lineas)
texto = "\n".join(lineas[i:]).strip()

for c in ["titulo", "carril", "nivel", "donde", "check", "necesita-ok"]:
    if not campos.get(c):
        no(f"falta «{c}:» (formato en la skill planificar-orquesta)")
titulo = campos["titulo"]
if len(titulo) > 120 or any(unicodedata.category(ch).startswith("C") for ch in titulo):
    no("el título tiene que ser una línea de hasta 120 caracteres")
if campos["carril"] not in os.environ["ORQ_CARRILES"].split():
    no(f"carril desconocido «{campos['carril']}». Válidos: {os.environ['ORQ_CARRILES']}")
if campos["nivel"] not in ("rapido", "normal", "profundo"):
    no("nivel: rapido, normal o profundo")
if campos["donde"] not in ("pc", "nube"):
    no("donde: pc o nube")
# El check corre FUERA de todo sandbox, con shell, en la PC de Sergio Urcullo o en Actions
# (orquesta.mjs, «check: cmd»). De Hermes solo valen comandos de PRUEBA, sin un solo caracter que la
# shell interprete (ni ; | & $ ` < > ( ) * ? ~ % ^ ! ni comillas), sin opciones propias (un «--require=»
# carga lo que sea) y sin salir de la carpeta de la tarea (ni «/» al principio ni «..»). `npm run`
# solo con scripts `test…`: el package.json también tiene `deploy:*` y `carousel:publish` (revisión de
# seguridad, 20-oct). Y como corre lo que dejó el trabajador, todo `cmd` espera su ok (abajo).
TOK = r"[A-Za-z0-9_.][A-Za-z0-9._/:@=+-]*"
check = campos["check"]
if ".." in check or not re.fullmatch(rf"urls|cmd npm test|cmd npm run test(:[A-Za-z0-9._-]+)*|cmd node --test( {TOK})+", check):
    no("check: «urls», «cmd npm run test:<x>», «cmd npm test» o «cmd node --test <ruta>», sin opciones (nada más: corre sin sandbox)")
if campos["necesita-ok"] not in ("si", "sí", "no"):
    no("necesita-ok: si o no")
# La salida de Hermes es un documento: con `salida: scripts/loops/…` un trabajador escribiría lo que el
# sincronizador copia como root a /root/bin.
if "salida" in campos and (not re.fullmatch(r"(hermes-content/)?docs/[A-Za-z0-9._/-]+", campos["salida"])
                           or ".." in campos["salida"].split("/")):
    no("salida: una ruta dentro de hermes-content/docs/ (docs/ en plataforma), o sin esa línea: va la del carril")
if "base" in campos and (not re.fullmatch(r"[A-Za-z0-9_][A-Za-z0-9_./-]*", campos["base"]) or ".." in campos["base"]):
    no("base: un nombre de rama")
if "ok" in campos and campos["ok"] != "sergio":
    no("ok: sergio (o sin esa línea)")
if not texto:
    no("falta qué hay que hacer (después de una línea en blanco)")
if len(texto) > 4000:
    no(f"la tarea es muy larga ({len(texto)} > 4000 caracteres): partila")
if not re.search(r"(?im)^\s*hecho cuando\s*:\s*\S", texto):
    no("falta «Hecho cuando: …» (cómo se comprueba). Sin eso el revisor no puede juzgar")

# Respaldo del guardarraíl: si el texto habla de publicar, gastar, contactar, producción o merge, la
# tarea espera su ok aunque el modelo haya dicho «no». Un falso positivo solo la demora; por eso van
# los verbos («publicar», «publicá») y no los sustantivos que usa una investigación («publicaciones»).
plano = sin_tildes((titulo + "\n" + texto).lower())
SENSIBLE = re.compile(r"(?<![a-z])(publicar\w*|publique\w*|publica(lo|la|los|las)?|postear\w*|postea(lo|la)?"
                      r"|sub(i|ir|e|a|elo|irlo|ilo)\w*( \w+){0,3} (a|en) (instagram|youtube|tiktok|facebook|redes|buffer)"
                      r"|gastar\w*|gaste\w*|gasta|pagar\w*|pague\w*|paga(lo|la)?|comprar\w*|compre\w*|compra(lo|la)?"
                      r"|paga(le|les)|cobrar\w*|cobra(le|les)?|facturar\w*|factura(le|les)|higgsfield|meta ads|difundi\w*|difund(e|ir|an)\w*"
                      r"|contactar\w*|contacte\w*|contacta(lo|la|los|las)?"
                      r"|escrib\w* a (un |una |el |la |los |las )?(cliente|prospecto|tercero|clinica)\w*"
                      r"|(mand|envi)\w* (un |una |el |la |los |las )?(mensaje|correo|mail|email|whatsapp|dm)\w*"
                      r"|produccion|deploy\w*|despleg\w*|despliegue\w*|merge\w*|mergea\w*|push|vps)(?![a-z])")
hallado = SENSIBLE.search(plano)
# Lo que corre en la PC (con sus logins) y todo `check: cmd` (corre sin sandbox lo que dejó el
# trabajador) esperan su ok SIEMPRE: lo único que arranca solo es `nube` + `urls`.
motivo = ("el texto habla de «" + hallado.group(0) + "»" if hallado else "corre en la PC" if campos["donde"] == "pc"
          else "su check corre un comando" if check.startswith("cmd ") else "")
pide_ok = campos["necesita-ok"] in ("si", "sí") or bool(motivo)

orden = ["nivel", "check", "donde", "salida", "base", "ok"]
cuerpo = "\n".join(f"{c}: {campos[c]}" for c in orden if c in campos) + "\n\n" + texto
labels = ["orquesta", f"carril:{campos['carril']}", "origen:hermes"] + (["necesita-ok"] if pide_ok else [])
huella = hashlib.md5((campos["carril"] + "\n" + titulo + "\n" + texto).encode()).hexdigest()[:12]
json.dump({"title": titulo, "body": cuerpo, "labels": labels, "carril": campos["carril"], "hash": huella,
           "forzado": bool(motivo) and campos["necesita-ok"] == "no", "por": motivo},
          open(sys.argv[1], "w"), ensure_ascii=False)
PY
}

campo_json() {  # campo_json <archivo> <clave> -> valor (labels: separados por espacio)
  python3 - "$1" "$2" <<'PY'
import json, sys
try:
    d = json.load(open(sys.argv[1]))
except Exception:
    d = {}
v = d.get(sys.argv[2], "") if isinstance(d, dict) else ""
if isinstance(v, list):
    v = " ".join(x.get("name", "") if isinstance(x, dict) else str(x) for x in v)
print(v if not isinstance(v, bool) else ("1" if v else ""))
PY
}

crear() {
  leer_entrada
  [ -n "$ENTRADA" ] || { echo "Falta la tarea (por la entrada estándar, con el heredoc de la skill)." >&2; exit 65; }
  validar || exit 65
  cargar_token || exit $?
  mkdir -p "$ESTADO" 2>/dev/null && chmod 700 "$ESTADO" 2>/dev/null
  # Contar, crear y anotar bajo UN candado: sin él, dos cargas en paralelo cuentan lo mismo y se pasan
  # del tope (la trampa de pedido-claude.sh, medida por la madre el 2-oct).
  candado
  local ahora huella carril hechos repe
  ahora=$(date -u +%s)
  huella=$(campo_json "$TMP/tarea.json" hash); carril=$(campo_json "$TMP/tarea.json" carril)
  if [ -f "$REGISTRO" ]; then
    repe=$(awk -F'\t' -v h="$huella" -v desde=$((ahora - 86400)) '$4 == h && $1 >= desde { print ($5 == "" ? "(no se sabe si salió)" : $5) }' "$REGISTRO" | tail -1)
    [ -n "$repe" ] && { echo "Esa misma tarea ya se cargó en las últimas 24 h: $repe. No la repito." >&2; exit 75; }
    hechos=$(cargadas_hoy)
    [ "$hechos" -ge "$TOPE" ] && { echo "Ya cargaste $hechos tareas hoy (tope $TOPE). Lo demás, mañana o que lo cargue Sergio Urcullo." >&2; exit 75; }
  fi
  python3 - "$TMP/tarea.json" "$TMP/cuerpo.json" <<'PY'
import json, sys
t = json.load(open(sys.argv[1]))
json.dump({"title": t["title"], "body": t["body"], "labels": t["labels"]}, open(sys.argv[2], "w"), ensure_ascii=False)
PY
  local http rc numero url pegados pedidos falta=""
  http=$(gh_api POST "/repos/$REPO/issues" "$TMP/cuerpo.json"); rc=$?
  numero=$(campo_json "$TMP/r" number); url=$(campo_json "$TMP/r" html_url)
  if [ "$rc" = 6 ] || [ "$rc" = 7 ] || [[ "${http:-}" =~ ^4[0-9][0-9]$ ]]; then
    echo "La tarea NO se cargó ($([ -n "${http:-}" ] && [ "$http" != 000 ] && echo "GitHub contestó $http" || echo "sin conexión con GitHub")). Se puede reintentar." >&2
    exit 1
  fi
  if [ "$rc" != 0 ] || [ "$http" != 201 ] || ! [[ "$numero" =~ ^[0-9]+$ ]]; then
    # Pudo haberse creado: se anota para no duplicarla y cuenta para el tope.
    printf '%s\t\t%s\t%s\t\n' "$ahora" "$carril" "$huella" >> "$REGISTRO"
    echo "Puede haberse cargado (GitHub no lo confirmó): NO la reintentes. Mirá --revisar." >&2
    exit 1
  fi
  printf '%s\t%s\t%s\t%s\t%s\n' "$ahora" "$numero" "$carril" "$huella" "$url" >> "$REGISTRO"
  # GitHub descarta en silencio los labels que no puede poner: sin `orquesta` no entra a la cola, y
  # sin `necesita-ok` arrancaría sin su ok. Eso último no se deja abierto.
  pegados=" $(campo_json "$TMP/r" labels) "; pedidos=$(python3 -c 'import json,sys; print(" ".join(json.load(open(sys.argv[1]))["labels"]))' "$TMP/tarea.json")
  for l in $pedidos; do [[ "$pegados" == *" $l "* ]] || falta="$falta $l"; done
  if [ -n "$falta" ]; then
    if [[ " $falta " == *" necesita-ok "* ]]; then
      printf '{"state":"closed","state_reason":"not_planned"}' > "$TMP/cerrar.json"
      [ "$(gh_api PATCH "/repos/$REPO/issues/$numero" "$TMP/cerrar.json")" = 200 ] \
        && echo "La tarea #$numero quedó sin «necesita-ok» y la cerré antes de que arranque: $url" >&2 \
        || echo "❗ La tarea #$numero quedó SIN «necesita-ok» y no la pude cerrar: puede arrancar sin su ok. Avisale ya: $url" >&2
    else
      echo "La tarea #$numero se creó sin los labels:$falta (no entra a la cola así): $url" >&2
    fi
    exit 1
  fi
  local titulo pide msg
  titulo=$(campo_json "$TMP/tarea.json" title)
  pide=$([[ "$pegados" == *" necesita-ok "* ]] && echo 1)
  # La primera línea es lo que guarda la aduana si lo retiene (90 BYTES, onia-tg.sh): emoji, número y
  # link entero, nada más; con un número de 4 cifras todavía entra.
  msg="📋 #$numero · $url
Hermes cargó: $(printf '%s' "$titulo" | esc) (carril $carril)"
  [ -n "$pide" ] && msg="$msg
🙋 Espera tu ok: arranca cuando le quites el label «necesita-ok» al issue."
  aviso "orquesta-tarea-$numero" "$msg"
  echo "✅ Tarea #$numero cargada (carril $carril): $url"
  if [ -n "$pide" ]; then
    [ -n "$(campo_json "$TMP/tarea.json" forzado)" ] \
      && echo "Le puse «necesita-ok» aunque dijiste que no: $(campo_json "$TMP/tarea.json" por)."
    echo "🙋 No arranca hasta que Sergio Urcullo le quite «necesita-ok». Ya va en su resumen."
  else
    echo "La toma la orquesta sola. Vos no la das por hecha: la cierran el check y el revisor."
  fi
}

# ── --revisar ──────────────────────────────────────────────────────────────────
listar() {  # las 30 tareas más nuevas de Hermes -> $TMP/lista.tsv (#n estado carril título url). Solo lee.
  cargar_token || exit $?
  local code
  code=$(gh_api GET "/repos/$REPO/issues?labels=origen%3Ahermes&state=all&sort=created&direction=desc&per_page=30")
  [ "$code" = 200 ] || { echo "No pude leer la cola (HTTP ${code:-000})." >&2; exit 1; }
  python3 - "$TMP/r" > "$TMP/lista.tsv" <<'PY'
import json, sys
for it in json.load(open(sys.argv[1])):
    if "pull_request" in it:
        continue
    ls = [l.get("name", "") for l in it.get("labels", [])]
    carril = next((l[7:] for l in ls if l.startswith("carril:")), "?")
    if it.get("state") == "closed":
        e = "hecha" if it.get("state_reason") == "completed" else "cerrada sin hacer"
    else:
        e = next((n for l, n in [("necesita-ok", "espera su ok para empezar"), ("bloqueada", "bloqueada"),
                                 ("espera-ok", "espera su ok de la entrega"), ("en-curso", "en curso")] if l in ls), "en cola")
    print("\t".join([f"#{it['number']}", e, carril, " ".join(str(it.get("title", "")).split()), it.get("html_url", "")]))
PY
}

revisar() {
  listar
  mkdir -p "$ESTADO" 2>/dev/null && chmod 700 "$ESTADO" 2>/dev/null
  echo "Tus tareas en la orquesta (hoy cargaste $(cargadas_hoy) de $TOPE):"
  if [ ! -s "$TMP/lista.tsv" ]; then echo "(ninguna)"; return 0; fi
  cat "$TMP/lista.tsv"
  # Dos rechazos dejan la tarea bloqueada (orquesta.mjs) y la decide Sergio Urcullo: se le avisa UNA
  # vez por bloqueo, en su resumen. Hermes no la destraba. La que dejó de estar bloqueada sale de la
  # lista: si él la destraba y vuelve a trabarse, se avisa otra vez.
  local n e _c t u
  : > "$TMP/avisadas"
  while IFS=$'\t' read -r n e _c t u; do
    [ "$e" = bloqueada ] || continue
    if grep -qx "${n#\#}" "$AVISADAS" 2>/dev/null; then echo "${n#\#}" >> "$TMP/avisadas"; continue; fi
    if aviso "orquesta-bloqueada-${n#\#}" "⛔ $n · $u
Bloqueada: $(printf '%s' "$t" | esc). La orquesta la intentó dos veces: comentá en el issue qué cambiar, o cerrala."; then
      echo "${n#\#}" >> "$TMP/avisadas"
    fi
  done < "$TMP/lista.tsv"
  mv -f "$TMP/avisadas" "$AVISADAS"
}

# ── --cerrar ───────────────────────────────────────────────────────────────────
cerrar() {
  local n="$1"
  [[ "$n" =~ ^[0-9]{1,7}$ ]] || { echo "--cerrar <número del issue>" >&2; exit 64; }
  leer_entrada
  [ -n "$ENTRADA" ] || { echo "Falta el motivo (por la entrada estándar, con el heredoc de la skill)." >&2; exit 65; }
  [ "${#ENTRADA}" -le 500 ] || { echo "El motivo es muy largo (máx. 500 caracteres)." >&2; exit 65; }
  cargar_token || exit $?
  local code ls
  code=$(gh_api GET "/repos/$REPO/issues/$n")
  [ "$code" = 200 ] || { echo "No encontré el issue #$n (HTTP ${code:-000})." >&2; exit 1; }
  [ "$(campo_json "$TMP/r" state)" = open ] || { echo "#$n ya está cerrado." >&2; exit 65; }
  [ -z "$(campo_json "$TMP/r" pull_request)" ] || { echo "#$n es un PR, no una tarea." >&2; exit 65; }
  ls=" $(campo_json "$TMP/r" labels) "
  [[ "$ls" == *" origen:hermes "* ]] || { echo "#$n no es una tarea tuya (sin origen:hermes): esa la decide Sergio Urcullo." >&2; exit 65; }
  for l in en-curso bloqueada espera-ok necesita-ok; do
    [[ "$ls" == *" $l "* ]] && { echo "#$n está «$l»: esa ya es de la orquesta o de Sergio Urcullo, no la cierres." >&2; exit 65; }
  done
  # Primero se cierra y después se comenta: el orquestador mira solo las abiertas, y el comentario lleva
  # la marca <!-- orquesta --> para que nunca se lea como una indicación de Sergio Urcullo.
  printf '{"state":"closed","state_reason":"not_planned"}' > "$TMP/cerrar.json"
  code=$(gh_api PATCH "/repos/$REPO/issues/$n" "$TMP/cerrar.json")
  [ "$code" = 200 ] || { echo "No pude cerrar #$n (HTTP ${code:-000})." >&2; exit 1; }
  ENTRADA="$ENTRADA" python3 -c 'import json, os, sys
json.dump({"body": "<!-- orquesta -->\n🗑️ Hermes la cerró sin hacer. Motivo: " + os.environ["ENTRADA"]}, open(sys.argv[1], "w"), ensure_ascii=False)' "$TMP/comentario.json"
  code=$(gh_api POST "/repos/$REPO/issues/$n/comments" "$TMP/comentario.json")
  [ "$code" = 201 ] || echo "La cerré, pero no pude dejar el motivo en el issue (HTTP ${code:-000})." >&2
  aviso "orquesta-cerrada-$n" "🗑️ #$n · https://github.com/$REPO/issues/$n
Hermes la cerró sin hacer: $(printf '%s' "$ENTRADA" | esc)"
  echo "✅ #$n cerrada sin hacer. Va en el resumen de Sergio Urcullo."
}

case "${1:-}" in
  --estado)  [ "$#" = 1 ] || uso; estado ;;
  --revisar) [ "$#" = 1 ] || uso; revisar ;;
  --lista)   [ "$#" = 1 ] || uso; listar; cat "$TMP/lista.tsv" ;;
  --crear)   [ "$#" = 1 ] || { echo "La tarea va por la entrada estándar (heredoc <<'FIN_TAREA_ONIA_4b9e' de la skill), nunca como argumento: así pasaría por la shell." >&2; exit 64; }
             crear ;;
  --cerrar)  [ "$#" = 2 ] || { echo "--cerrar <número>; el motivo va por la entrada estándar." >&2; exit 64; }
             cerrar "$2" ;;
  *) uso ;;
esac
