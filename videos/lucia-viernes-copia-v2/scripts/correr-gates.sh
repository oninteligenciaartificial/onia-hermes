#!/usr/bin/env bash
# Corre los gates de la pieza en orden y deja cada exit code en qa/RESUMEN-gates.txt. Uso (desde videos/lucia-viernes-copia-v2/): bash scripts/correr-gates.sh [--master]
#   sin --master: build, master-ready, voz, retemporizar, ventanas, hueco-tarjetas, eventos, aire, costuras, medir-dom, layout-dom, grep-prohibidas, lucia-prohibidas, mutaciones, verificar-auditor, hyperframes check
#   con --master: además los de píxeles del master (psnr-fotos, vacios, aire)
export PRODUCER_HEADLESS_SHELL_PATH=/opt/pw-browsers/chromium HYPERFRAMES_SKIP_SKILLS=1 PLAYWRIGHT_MODULE=/opt/node-tools/node_modules/playwright
cd "$(dirname "${BASH_SOURCE[0]}")/.."
R=qa/RESUMEN-gates.txt; : > "$R"; MAL=0
g(){ local n="$1"; shift; "$@" > "qa/g-$n.txt" 2>&1; local e=$?; printf '%-34s exit %s\n' "$n" "$e" >> "$R"; [ $e -eq 0 ] || MAL=1; }
g build node scripts/build.mjs
g master-ready node scripts/master-ready.mjs
g voz node scripts/voz.mjs
g retemporizar node scripts/retemporizar.mjs
for x in ventanas hueco-tarjetas eventos aire costuras medir-dom; do g $x node scripts/$x.mjs; done
g layout-dom node scripts/layout-dom.mjs
g grep-prohibidas node scripts/grep-prohibidas.mjs
node -e "const p=require('./plan.json');require('fs').writeFileSync('qa/pantalla.txt',Object.values(p.textos).join('\n')+'\n')"
g lucia-prohibidas node /home/user/onia-hermes/scripts/lucia-prohibidas.mjs pie.txt guion-voz.txt qa/pantalla.txt
g validar-mutaciones node scripts/validar-mutaciones.mjs
g verificar-auditor node scripts/verificar-auditor.mjs
g hyperframes-check flock /tmp/hf-render.lock npx --prefer-offline -y hyperframes@0.8.142 check
cp qa/g-hyperframes-check.txt qa/hyperframes-check.txt
if [ "${1:-}" = "--master" ]; then
 for m in psnr-fotos vacios aire; do g pixeles-$m node scripts/pixeles.mjs $m; done
fi
cat "$R"; exit $MAL
