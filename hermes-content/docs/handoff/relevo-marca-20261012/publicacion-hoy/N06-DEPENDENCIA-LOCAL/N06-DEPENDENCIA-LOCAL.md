# Dependencia N06 para worker local · sin rehacer montaje

Fuente: fbad86d1cf01de470c0a32107a4ec8f3e8f1d4e3. Renderer .claude/skills/edicion-referentes/scripts/santiago/santiago.py, wrapper videos/marca-personal/2026-10-11/n06-antigravity/borrador/santiago-cv5.py, motor YuNet .claude/skills/editor-videos/assets/models/face_detection_yunet_2023mar.onnx. El worker local ya recuperó sus48 inputs. Cutplan medido en DEPENDENCIA-N06.json: exacto al preservado; no cambié cortes. --sin-aire es la orden original del preview aprobado visualmente por Sergio. Esto no cierra hechos/CTA ni acredita ausencia global de deltas en toda otra rama.

Render exacto (rutas locales adaptadas, preservar el proyecto original):
```
python santiago-cv5.py --bruto BRUTO-N06.mp4 --cutplan ../cutplan.json --transcript segments-cut.json --storyboard storyboard.json --out N06-1080-LIMPIO.mp4 --sin-aire
```
Es1080×1920 a30fps desde bruto1080, no upscale. Comparar1365frames/45.5svideo y45.504scontenedor del preview; si cambia, detener antes de mezclar y explicar diferencia. No recapturar o cambiar cortes silenciosamente.

Pista exacta: House In a Forest Loop—HorrorPen(2012), archivoOGG1430743bytes, SHA25632680f2b2631eb9f6e2902ebbbec1b43ab82b4dbf154fdc9bfbfa17b03270504. DriveID13yjSjS_otbwvVvOI_iWx7akmqlMx-lpi. https://drive.google.com/file/d/13yjSjS_otbwvVvOI_iWx7akmqlMx-lpi/view

LicenciaCCBY3.0 y atribución completas adjuntas. Mezcla final EXACTA del preview en N06-command-EXACTO-PREVIEW.json; equivalente con solo rutas cambiadas en N06-command-PORTABLE.json. No usar intento inicial fallido. Offset0; loopinfinito; trim45.504; fadein0.25s/fadeout0.6s desde44.904; loudnormcamaI−26TP−2LRA8; highpass60/lowpass8000; duckthreshold0.06ratio3attack10msrelease180msknee2.5makeup1RMS; amixnormalize0; limiter0.841395levelFalselatencyTrue; AAC192k48kHz; videoCOPY. El comando produce además cama duckedAAC128k.

Fuentes: este runtime no tiene cinco TTF resueltos comoInter/JetBrains. fc-matchInterBlack devuelveOpenAISansRegularWOFF2. No exportar ese fallback comoInter. Recuperé Inter-SemiBold.ttf ya existente enGit conSHA; faltan exactasBlack/Bold/Regular/JetBrainsMonoSemiBold y su procedencia de versión del entorno original. No instalé ni descargué nuevas fuentes ni inferí sustitución tipográfica. El adaptadorWindows debe resolver archivos originales verificables antes de certificar misma composición.

QA mezcla preview: técnico independientePASS; Madre reportó GeminiAVcompleto favorableN06/N07, no audición deeste modelo. ClaimsN06alcance consumidores vsStandard/Enterprise/API yfrase skills31–39/CTA siguen gates. Ruta coordinación: Marca→MadreMarketing; Desarrollo solo dependencia técnica. No publicación desdeeste worker.
