#!/bin/sh
# Deja el renderer de carruseles (scripts/carousel_render.js) andando en una sesión de Claude en la nube.
#
# Uso:  eval "$(sh scripts/carousel_cloud_setup.sh)"
#       node scripts/carousel_render.js --brief <brief.json> --out <dir>
#
# Por qué existe (medido el 2026-09-30, sesión Mercado):
# - El renderer no encuentra solo el Chromium preinstalado (/opt/pw-browsers).
# - Con el Chromium completo y --window-size, la ventana visible queda ~88 px más baja que la
#   captura: la portada sale con una franja clara al pie y se corta el footer (@oniahq, 02/07).
#   El headless_shell no tiene ese problema.
# - Chromium no llega a Google Fonts desde la nube, así que cae en DejaVu. Instalar las fuentes en local
#   las arregla, pero solo en TTF: en WOFF, fontconfig las lista y Chromium igual no las usa (probado).
# Resultado: las láminas salen iguales a las que se renderizan en la PC.
set -e

DEST="$HOME/.fonts/onia-carruseles"
mkdir -p "$DEST"

# Las familias que piden los packs (grep "family=" scripts/carousel_*.js). Pesos que existan de verdad:
# un peso inexistente hace que Google Fonts rechace la familia entera (DM Mono no tiene 600).
for fam in \
  "DM+Sans:wght@400;500;600;700;800" \
  "DM+Mono:wght@400;500" \
  "Instrument+Serif:ital@0;1" \
  "Instrument+Sans:wght@400;500;600" \
  "Inter:wght@400;500;600;700;800;900" \
  "Archivo:wght@500;800;900" \
  "Fraunces:ital,wght@1,500;1,600" \
  "Space+Grotesk:wght@500;700" \
  "IBM+Plex+Mono:wght@500" \
  "JetBrains+Mono:wght@600" \
  "Caveat:wght@600;700"; do
  # Sin User-Agent de navegador, Google Fonts entrega TTF.
  curl -fsS "https://fonts.googleapis.com/css2?family=$fam" | grep -o 'https://fonts.gstatic.com[^)]*\.ttf' || true
done | sort -u | while read -r url; do
  file="$DEST/$(echo "$url" | sed 's#.*/s/##; s#/#_#g')"
  [ -s "$file" ] || curl -fsS -o "$file" "$url"
done
fc-cache -f >/dev/null 2>&1 || true

SHELL_BIN=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/*/headless_shell 2>/dev/null | head -1)
if [ -z "$SHELL_BIN" ]; then
  echo "echo 'No hay headless_shell en /opt/pw-browsers: renderizar en la PC' >&2"
  exit 0
fi
WRAP="$DEST/chromium-headless.sh"
printf '#!/bin/sh\nexec "%s" "$@"\n' "$SHELL_BIN" > "$WRAP"
chmod +x "$WRAP"
echo "export CAROUSEL_BROWSER='$WRAP'"
