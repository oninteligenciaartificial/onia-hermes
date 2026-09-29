#!/bin/sh
# Archivo historico de la corrida del PdV 1 de septiembre de 2026.
# Su segunda pasada invocaba el runner sin --etapa y podia enviar I..XI antes
# de conciliar VI/IX. Ademas, VIII vive en un checkpoint separado.
# La cobertura pendiente se ejecuta con --etapa y --case tras la lectura actual
# del portal; ver README.md y docs/ONIA_SIAT_ESTADO_HOMOLOGACION.md.
echo "ABORTA: run-fase1-pdv1.sh esta retirado; usar fase1-runner.mjs --etapa explicita tras conciliar el portal" >&2
exit 1
