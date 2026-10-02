#!/bin/sh
# Retirado el 27-sep-2026: el barrido I..XI podia repetir fases completadas,
# especialmente VIII, cuyo avance vive en un checkpoint separado.
# El portal es la referencia; usar el runner con etapa y caso revisados.
echo "ABORTA: run-fase1-volumen.sh esta retirado; usar fase1-runner.mjs --etapa y --case tras conciliar el portal" >&2
exit 1
