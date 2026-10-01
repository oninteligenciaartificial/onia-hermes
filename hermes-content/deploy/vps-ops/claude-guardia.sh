#!/usr/bin/env bash
# Guardian de errores de Onia Platform.
#
# Cada 10 min: mira los issues nuevos de Sentry. Para cada uno que no vio antes:
#   1) si es una clase de fallo de INFRA conocida y reversible, la arregla solo;
#   2) si es un error de CODIGO, corre Claude Code headless para diagnosticarlo
#      con los logs y el codigo fuente reales, y deja diagnostico + parche
#      propuesto como tarea del tablero. NO aplica parches.
#
# 🔴 Nada sale directo a Telegram (2026-09-29). Sergio Urcullo: «me manda puros errores».
# Este script hacia curl propio: esquivaba el silencio de la noche, sus bloques y el
# enfriamiento, y un Sentry que no responde repetia el mismo error cada 10 minutos. Ahora
# todo pasa por la aduana (onia-tg.sh), con la categoria que corresponde:
#   contenedor levantado solo -> resumen  (se arreglo: se entera en el cierre de las 21:30)
#   Sentry no responde        -> sistema  (tarea deduplicada: la arregla el sistema)
#   error nuevo diagnosticado -> sistema  (tarea con diagnostico, una por lugar del error)
#
# Estado en /root/claude-guardia/. Claves: ANTHROPIC de /root/.hermes/.env,
# SENTRY de /opt/onia-platform/app.env.
set -uo pipefail
D=/root/claude-guardia
mkdir -p $D/diagnosticos
SEEN=$D/vistos.txt; touch $SEEN

set -a; . /root/.hermes/.env 2>/dev/null; set +a
# Claude Code usa la SUSCRIPCION (credencial en /root/.claude/.credentials.json,
# copiada de la maquina de Sergio el 2026-08-15). Una ANTHROPIC_API_KEY en el
# entorno la pisaria — y la que hay en .hermes/.env esta VENCIDA. Se limpia.
unset ANTHROPIC_API_KEY ANTHROPIC_TOKEN
ST=$(grep -oP '(?<=^SENTRY_AUTH_TOKEN=).*' /opt/onia-platform/app.env | tr -d '"')
ORG=onia-agency; PROJ=onia-platform

avisar() {  # avisar <resumen|sistema> <mensaje>
  ONIA_AVISO="$1" ONIA_AVISO_EMISOR=guardia "${ONIA_TG:-/root/bin/onia-tg.sh}" "$2" >/dev/null 2>&1 || true
}

# ── 0. autocuracion de infra: contenedores clave caidos se levantan solos
for c in onia-platform onia-landing onia-mail supabase-kong supabase-db; do
  EST=$(docker inspect -f '{{.State.Status}}' $c 2>/dev/null || echo ausente)
  if [ "$EST" = "exited" ] || [ "$EST" = "dead" ]; then
    docker start $c >/dev/null 2>&1
    avisar resumen "🩹 <b>Guardia Onia</b>: el contenedor <code>$c</code> estaba <b>$EST</b> y lo levante solo."
  fi
done

# ── 0b. canarios de flujo (login/auth-kong/bot) — hermano; avisa solo en cambio de estado
/root/bin/claude-guardia-canario.sh

# ── 1. issues nuevos de Sentry (ultima hora)
# La API de issues por proyecto SOLO acepta statsPeriod 24h o 14d; con 1h
# devolvia {"detail":...} y el parser lo tragaba en silencio — el guardian
# corria y no hacia nada. Si la respuesta no es una lista, se avisa.
ISSUES=$(curl -s --max-time 30 -H "Authorization: Bearer $ST" \
  "https://sentry.io/api/0/projects/$ORG/$PROJ/issues/?query=is:unresolved&statsPeriod=24h&limit=5")
case "$ISSUES" in
  "["*) : ;;
  *) avisar sistema "⚠️ <b>Guardia Onia</b>: Sentry no devolvio una lista de issues
<code>$(echo $ISSUES | head -c 150)</code>"; exit 0 ;;
esac
echo "$ISSUES" | node -e '
let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>{
  try{JSON.parse(d).forEach(i=>console.log(i.id+"\t"+(i.culprit||"").slice(0,60)+"\t"+((i.metadata&&i.metadata.value)||i.title||"").replace(/\s+/g," ").slice(0,220)))}catch(e){}
});' | while IFS=$'\t' read -r ID CULPRIT VALOR; do
  [ -z "$ID" ] && continue
  grep -q "^$ID$" $SEEN && continue
  echo "$ID" >> $SEEN

  # ── 2. diagnostico con Claude Code, headless, solo lectura
  LOGS=$(docker logs onia-platform --since 30m 2>&1 | tail -80)
  OUT=$D/diagnosticos/$ID.md
  # Resolver la fuente para el diagnostico. build-src NO existe: el deploy deja
  # runtime-next (build compilado, sin app/ ni lib/) y los tarballs src-<sha>.tar.gz.
  # Se rompio en algun deploy que limpio build-src y NADIE se entero, porque este
  # script solo escribe en su log cuando falla. Corregido 2026-09-01.
  SRC_TGZ=$(ls -t /opt/onia-platform/src-*.tar.gz 2>/dev/null | head -1)
  SRC_SHA=$(basename "$SRC_TGZ" .tar.gz 2>/dev/null)
  SRC_DIR=/opt/onia-platform/diag-$SRC_SHA
  if [ -n "$SRC_TGZ" ] && [ ! -d "$SRC_DIR" ]; then
    mkdir -p "$SRC_DIR" && tar xzf "$SRC_TGZ" -C "$SRC_DIR" 2>/dev/null
    # dejar solo las 2 extracciones mas nuevas: cada una pesa y esto corre seguido
    ls -dt /opt/onia-platform/diag-* 2>/dev/null | tail -n +3 | xargs -r rm -rf
  fi
  cd "$SRC_DIR" 2>/dev/null || cd /opt/onia-platform || true
  timeout 600 claude -p --model claude-sonnet-5 --max-turns 15 \
    --allowedTools "Read" "Grep" "Glob" \
    "Sos el guardian de produccion de Onia Platform (Next.js + Prisma + Supabase self-hosted).
Error nuevo en Sentry:
  donde: $CULPRIT
  error: $VALOR
Logs recientes del contenedor:
$LOGS

El codigo fuente esta en el directorio actual. Diagnostica la CAUSA RAIZ leyendo el codigo
implicado. Respond en espanol, corto:
1) CAUSA (2-3 frases, con archivo:linea)
2) PARCHE PROPUESTO (diff minimo, o 'no requiere codigo' si es config/infra)
3) RIESGO de aplicarlo
No inventes: si no encontras la causa, decilo." > $OUT 2>&1

  # sin diagnostico util (key invalida, timeout) el aviso sale igual, sin basura
  if [ ! -s $OUT ] || grep -qiE "invalid|not logged in|error" <(head -c 200 $OUT); then
    echo "(diagnostico automatico no disponible: revisar credencial de Claude en el VPS)" > $OUT
  fi
  RESUMEN=$(head -c 900 $OUT)
  avisar sistema "🔍 <b>Guardia Onia</b> — error nuevo en <code>$(echo $CULPRIT | head -c 60)</code>

<b>Donde:</b> <code>$(echo $CULPRIT | head -c 80)</code>
<b>Error:</b> $(echo $VALOR | head -c 160)

$RESUMEN

📄 Diagnostico completo: <code>$OUT</code>
⚠️ El parche NO se aplico."
done
