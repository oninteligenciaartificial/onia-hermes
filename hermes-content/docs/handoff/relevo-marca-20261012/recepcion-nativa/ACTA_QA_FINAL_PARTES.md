# QA independiente final de partes y recepción

12-oct-2026. Revisor `/root/qa_sol`, separado del autor de recepción. Fuente base Git `1467b2d3ed4e794137311d6451165430124b30c6`, delta de partes `471f05170b64809d4505dc5c4be64f9a01bcf625`.

## Recepción binaria — PASS

Se volvieron a medir en destino las 59 rutas del manifiesto base: **59/59 SHA256 y bytes exactos**, 55 contenidos únicos. Ningún faltante local. La copia del delta de partes coincide byte por byte con Git.

Se hashearon de forma independiente los archivos de descarga local de las doce partes, incluida la primera descargada por root; coinciden bytes/SHA256 declarados, orden y offsets. Se compararon además con las copias de `parts/`. El hash incremental de la concatenación de cada grupo coincide con los tres objetos completos recibidos y sus hashes/bytes originales. **12/12 partes, 3/3 objetos completos, 49/49 miembros ZIP PASS**. No se rehizo descarga ni se modificaron medios.

Prueba exhaustiva: `reception-final-independent.json`. Hash del `RECEPCION-59-FINAL.json` autor comprobado: `85f0b26d111d5e81632fd07244b3d9903d6ab6a7d889bf9d3572ab51ca06c0b7`.

## Tres medios nuevos — PASS técnico

Se ejecutaron ffprobe y decodificación completa video/audio con `ffmpeg -v error -xerror ... -map 0 -f null -` únicamente para:

- `media-adjustment/DD-A-bruto-original.mp4`.
- `media-review-n06/bruto.mp4` (N06 bruto).
- `media-adjustment/N02-preview-sin-arranque-falso.mp4` (lossless48MB).

3/3 exit0 y stderr vacío. Los ocho medios previos ya pasaban y no se repitieron: **11 medios en total con decodificación completa PASS**. Evidencia `media-new-independent.json` y tres probes/logs.

## N02 lossless — prueba propia nueva

Se decodificaron todos los cuadros del original Claude y del lossless recebido con `framemd5`:

- Original3339cuadros; pérdida eliminada [3087,3155),68cuadros.
- Lista retenida3271; lossless3271.
- **3271/3271 hashes de cuadros retenidos idénticos, cero diferencias**. SHA256 de ambas listas: `8bab18c8542485bda8694c3e2891845315b143e027c63c3f5b45752953f5ddcb`.

Esta prueba ahora se aplica al lossless realmente recibido, no al preview revisable recodificado. No se generó un video nuevo.

Audio: se decodificó la referencia original recortada y el lossless a PCMmono48kHz float32, con hashes registrados. Por recodificación AAC no se exige igualdad PCM. Pearson sin desplazar muestras en cuatro ventanas de0,5s (20,0 /102,7 /103,2 /106,0s) dio0,999996 /0,999993 /0,999894 /0,999977. Es evidencia numérica de conservación y alineación en ventanas, no escucha, comprensión de palabras o QA fonética de todo el audio. No se buscó el mejor lag fuera del cero; no afirmar esa prueba.

## DD-A original61–69 — prueba propia nueva

Extracción diagnóstica a memoria, con seek antes del input: `ffmpeg -ss61 -i DD-A-bruto-original.mp4 -t8 -ac1 -ar16000 -f s16le -`. Produce256000bytesPCM exactos al WAV recibido decodificado; SHA256 ambos `367b0d122a2d1420b5571ed386891cbc219ed20f03de4d36c07cf5642a1bf1b7`, correlación1,0. Confirma la procedencia del intervalo[61,69).

Primer intento con seek después del input dio otro hashPCM: ambos pipelines tienen distinta frontera/fase de resampling; se preservan resultados y el segundo usa el procedimiento que reproduce exactamente la extracción de origen. No ocultar primer intento ni tratarlo como pérdida del transporte.

Evidencia audiovisual numérica: `av-new-independent.json`.

## Gate audiovisual humano/nativo

La recepción técnica completa no resuelve «Astra»/«Sol». **No se escuchó ningún audio**: harness rechazó entrada nativa y no se instaló/contrató ASR. Hash de audio, correlación y transcript no demuestran nombre hablado, música/SFX o sincronía fonética.

Las revisiones visuales previas corresponden a muestras temporales de los cuatro montajes Claude y contexto, no video completo. N02 lossless preserva todos los cuadros retenidos por prueba numérica; eso no convierte la muestra del empalme en aprobación editorial/master. No nuevas ediciones, renders, masters, gasto, instalación o publicación.

Resultado: recepción binaria **59/59 completada y cotejada independientemente**; gate de escucha/aprobación audiovisual separado y bloqueado. Fuentes preservadas. No archivar por inferencia ni declarar piezas listas para publicar.
