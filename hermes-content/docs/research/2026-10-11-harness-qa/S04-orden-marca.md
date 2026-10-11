# S04 · Orden de trabajo de Marca personal (para MADRE MARKETING)

Fecha de medición: 11-oct-2026. Solo lectura. Sin git, sin publicar, sin mensajes. Corregido tras la verificación del 11-oct (ver «Cambios respecto de la versión anterior» al final).

## Estado medido

| # | Qué | Evidencia |
|---|---|---|
| 1 | La cola tiene una línea de bloqueo que ya no aplica | `hermes-content/docs/cola/loop/marca-personal.md:10`, texto literal: «- Grabar (N07, DD-A, N02, D03-A, D04-C el vie 9; el resto según el orden del teleprompter).». `GRABAR-NUEVOS-11-OCT.md:3` dice: «Ya grabó N07, DD-A, N02, N06 y S2-D07-A; los demás no se graban». D03-A y D04-C no aparecen en esa lista de grabados: estado UNKNOWN. |
| 2 | Hay 11 guiones nuevos sin grabar (SI-01 a SI-11) | `GRABAR-NUEVOS-11-OCT.md:10-22`, tabla «Resumen». Cada bruto debe llevar el código en el nombre (`GRABAR-NUEVOS-11-OCT.md:6`). |
| 3 | Brutos en Drive: 6 archivos, ninguno con código | Drive, carpeta «Videos Onia Octubre» (id `1Iks0iUsLC5wlznDF6Bbo3VYkekclV987`), búsqueda `parentId = '1Iks0iUsLC5wlznDF6Bbo3VYkekclV987'`, dos páginas, total 6. Cinco con nombre UUID creados 11-oct entre 04:47 y 05:01 UTC (00:47 a 01:01 La Paz): `1CCFE9FE-…`, `F9630B16-…`, `3941A129-…`, `EE23A577-…`, `15270626-…`. Sus `modifiedTime` igualan a `createdTime`: sin edición registrada. Uno con nombre `A0550B92-…mp4`, creado 1-oct 21:17 UTC y modificado 2-oct 23:48 UTC; el handoff lo asocia a N03/D01-B (`handoff/marca-personal.md`, entrada 2-oct). |
| 4 | Medidas que los guiones piden antes de grabar | `GRABAR-NUEVOS-11-OCT.md:34-39`: [X] de SI-05 (gasto de 30 días en LiteLLM, días caído en el log del vigía), [A]/[B] de SI-06, [T] de SI-07, [N] de SI-10, [197] de SI-09. Ninguna medición consta en el repo. El repo tiene configuración de LiteLLM (`hermes-content/deploy/selfhosted/`, `deploy/onia-platform/`), pero no se verificó si la PC tiene acceso a esa instancia ni dónde están los logs del vigía: acceso UNKNOWN. |
| 5 | El mosaico-tablero no tiene render en el repo | `videos/moldes/mosaico-tablero/`: solo `README.md`, `index.html`, `hyperframes.json`, `ledger.json`, `assets/`. No hay `out/`. Su prueba de hecho pide un render de 30 s, 1080×1920, sin audio. |
| 6 | P2 «7 herramientas» tiene fecha y requiere OK previo | `cola/plan-3-semanas/CALENDARIO-PUBLICACION-9-16-OCT.md:73-76`: sale sáb 17-oct 16:00 IG, 16:01 LinkedIn, 16:02 TikTok. Antes de agendarla: «el OK de Sergio Urcullo a la lámina 6 (muestra los avisos del bot a los prospectos)». Render de P2: no verificado (UNKNOWN). |
| 7 | P1 y P3 sin fecha | `CALENDARIO-PUBLICACION-9-16-OCT.md:77-80`. P1 espera N07 y el OK del molde «Niveles». P3 espera tres condiciones. |
| 8 | Lote de 14 imágenes sin generar | `handoff/marca-personal.md:11` (8-oct): 14 prompts en `fotobn`, 14 cr, sin generar. `handoff/marca-personal.md:27`: «el lote de 14 imágenes… sigue sin generar». `cola/plan-3-semanas/lote-14-imagenes.json` existe. Regla de gasto de `CLAUDE.md`: lotes de menos de ~5 cr tienen permiso previo; este supera ese tope. |
| 9 | Historias de la asesoría rechazadas, sin rediseño publicado | `handoff/marca-personal.md:58` (8-oct, entrada 7): Sergio dijo «no me gustan las historias, el diseño hay que mejorarlo». Ninguna historia publicada ni agendada en el handoff. |
| 10 | Último handoff del carril: 8-oct | `handoff/marca-personal.md:5`: la entrada más nueva es «8-oct (noche, 10)». No hay entrada del 9 al 11-oct. |
| 11 | Estado 9 al 11-oct de la sesión nube `session_01WPecmppa9uZEc4fJDjSmaS` | Búsqueda local en `~/.claude/projects` por el id: 0 archivos. El id aparece solo en el handoff y en `research/2026-10-11-harness-qa/D02-skill-sesion-madre.md`. Estado 9 al 11-oct: no verificado. |

## Brecha

1. La cola dice que Grabar está bloqueado por la fecha del «vie 9», y esa fecha ya pasó. La madre no sabe qué grabar primero. Falta confirmar el estado de D03-A y D04-C.
2. Los 5 brutos del 11-oct no tienen código, así que no se sabe a qué guion corresponden ni qué molde editar. Riesgo: editar a ciegas.
3. Las mediciones de los guiones no existen. Si un guion se graba sin ellas, el tramo marcado se corta; es un corte previsto por el guion, no un bloqueo. El acceso de la PC a LiteLLM no está verificado.
4. El mosaico no tiene render. Sin render no hay revisión de Sergio ni uso del molde en P1 o P3.
5. P2 tiene fecha, pero el calendario exige el OK de Sergio sobre la lámina 6 antes de agendarla. Hoy no consta ese OK.
6. Historias: falta rediseño y fotos de Sergio. Sin eso no hay pieza que publicar.
7. El lote de 14 imágenes supera el permiso previo. Sin OK de Sergio no se genera.
8. Falta el estado real del 9 al 11-oct (no verificado; transcript solo en la nube).

## Configuración propuesta

### 1. Reemplazar la línea de bloqueo en `hermes-content/docs/cola/loop/marca-personal.md` (líneas 9-10)

Texto exacto:

```
## Bloqueado (solo Sergio Urcullo)
- Grabar los 11 guiones SI-01 a SI-11 (GRABAR-NUEVOS-11-OCT.md) en el orden de su tabla. Ya grabados: N07, DD-A, N02, N06, S2-D07-A. D03-A y D04-C: estado por confirmar.
- Aprobar el lote de 14 imágenes fotobn (14 cr, supera el tope de ~5 cr: requiere OK).
- Entregar fotos para las historias de la asesoría.
```

### 2. Nombre de los brutos (lo hace la sesión Marca en Drive, no la madre)

La sesión Marca escribe una tabla de mapeo antes de cortar: `id Drive | nombre actual | código | hora de grabación | confianza`. Si el código no se puede mapear con certeza, el bruto queda como `SIN-CODIGO-<id>` y se pregunta a Sergio. No se borra nada.

### 3. Orden de trabajo (máx 7)

1. Mapear los 5 brutos del 11-oct a su código. Editarlos con `editor-videos` (`scripts/cut-plan.mjs` para la tabla, `scripts/preview.mjs` para el preview 360p). Entregar tabla de cortes y preview a Sergio antes del master.
2. Medir [X] (SI-05), [A]/[B] (SI-06), [T] (SI-07), [N] (SI-10) y [197] (SI-09). Si la PC no tiene acceso verificado a LiteLLM, la medición la hace Sergio Urcullo y pega el número en la ficha. Sin medida, se corta el tramo marcado.
3. Renderizar el mosaico-tablero (30 s, 1080×1920, sin audio), mirarlo renderizado y mandarlo a Sergio para revisión. No se usa en pieza antes de su OK.
4. P2 «7 herramientas» (carrusel): render y control de calidad primero. Después, pedir a Sergio el OK de la lámina 6 (avisos del bot a prospectos). Solo con ese OK se agenda para sáb 17-oct 16:00 IG, 16:01 LinkedIn, 16:02 TikTok, por el circuito actual.
5. Historias de la asesoría: rediseño (secuencia de 4 láminas), captura a 390/1440, y pedir a Sergio las fotos. Publicar tras revisión visual.
6. P1 «Niveles» y P3 pizarra: solo después de N07 y del OK del molde. Sin fecha en el calendario hasta entonces.
7. Lote de 14 imágenes fotobn: cotizar y dejar listo. No generar hasta que Sergio dé el OK.

### 4. Contratos Codex (cola `hermes-content/docs/handoff/codex-tareas/`, lanzados solo con `scripts/codex-tarea.sh`)

- CX-MP1 (Luna). Script que lee una lista JSON de brutos (id, nombre, fecha de creación) y escribe una tabla `id | nombre actual | código sugerido | confianza`. Sin renombrar. Prueba: corre con los 6 ids de Drive y devuelve 6 filas.
- CX-MP2: retirado. Ya existe `.claude/skills/editor-videos/scripts/preview.mjs` (preview 360p y `costuras.jpg`) y `cut-plan.mjs` (tabla de cortes). No se encarga un script nuevo. Si la tabla necesita formato de lámina, es un cambio chico en `cut-plan.mjs`: decisión de la madre, sin contrato todavía.
- CX-MP3 (Luna). Ficha de medición para SI-05: script que resume gasto de 30 días y recuenta días caídos desde un archivo exportado de LiteLLM o del log del vigía. Entrada: archivo local (origen UNKNOWN hasta confirmar acceso). Sin SSH. Prueba: el resumen cuadra con la salida que muestre LiteLLM para ese mismo periodo.
- CX-MP4 (Luna). Verificador de prompts fotobn: revisa en `cola/plan-3-semanas/lote-14-imagenes.json` que cada prompt tenga estilo fotobn y costo declarado, sin generar. Prueba: 14 de 14 prompts pasan, o se listan los que fallan.

## Quién la aplica

| Cambio | Quién | Por qué |
|---|---|---|
| Reemplazar la línea de bloqueo en la cola | madre-marketing | La madre ordena el carril; es un cambio de cola. |
| Renombrar brutos y mapear códigos | sesión Marca (nube) | Edita y conoce el teleprompter; la madre no toca Drive. |
| Medir [X], [A]/[B], [T], [N], [197] | madre-marketing con CX-MP3 si la PC tiene acceso a LiteLLM; si no, Sergio Urcullo | El acceso de la PC a LiteLLM no está verificado (UNKNOWN). |
| Render del mosaico y revisión | sesión Marca; el OK de uso lo da Sergio Urcullo | Render en nube; la decisión de uso es de Sergio. |
| Agendar P2 | madre-marketing, solo tras el OK de Sergio sobre la lámina 6 | El calendario exige ese OK antes de agendar. |
| Publicar historias aprobadas | sesión Marca | Regla «Qué se publica sin preguntar». |
| Grabar los 11 guiones, dar fotos, aprobar lote 14 cr, OK de lámina 6 | Sergio Urcullo | Solo él graba, aprueba gasto por encima del tope y da el OK de contenido. |
| Commit de la cola y de este documento | madre-marketing (e integrador por merge a main) | Codex no hace git. |
| Nota de estado 9 al 11-oct | sesión Marca | Su transcript está en la nube; la madre no lo lee. Hasta entonces es no verificado. |

## Prueba de hecho

- Cola: `grep -n "Bloqueado" hermes-content/docs/cola/loop/marca-personal.md` muestra solo la línea nueva, con 3 viñetas y sin «el vie 9».
- Brutos: la búsqueda `parentId = '1Iks0iUsLC5wlznDF6Bbo3VYkekclV987'` lista 6 archivos, y cada uno tiene código en el nombre o está marcado `SIN-CODIGO`.
- Mediciones: la ficha de SI-05 tiene el número [X] con fuente y fecha. Sin número, el guion no está en la lista de grabar.
- Mosaico: existe `videos/moldes/mosaico-tablero/out/*.mp4` de 30 s, 1080×1920, sin audio, y hay un mensaje de Sergio con su OK o cambios.
- P2: el OK de la lámina 6 consta en el handoff antes de la agenda, y el 17-oct a las 16:00 IG figura agendado.
- Historias: 4 historias publicadas con su enlace, y la sesión Marca deja la captura 390/1440 en el handoff.
- Lote 14 cr: 0 imágenes generadas sin OK. Se confirma con `higgsfield generate list`.
- Handoff: `handoff/marca-personal.md` tiene una entrada con fecha del 9 al 11-oct, escrita por la sesión Marca.

## Cambios respecto de la versión anterior (verificador, 11-oct)

- Paso 4 (P2): ahora exige el OK de Sergio sobre la lámina 6 antes de agendar; el render va antes.
- Cita de la cola: reemplazada por el texto literal de `marca-personal.md:10`.
- Transcript: «sin transcript local» cambiado a «no verificado»; búsqueda medida: 0 archivos locales con el id.
- Brutos: el tope de Drive se retiró. Son 6 archivos medidos; el del 1-oct se explica como edición del 2-oct, no como tope.
- LiteLLM y logs del vigía: marcados UNKNOWN; la medición cae en Sergio si la PC no tiene acceso.
- CX-MP2: retirado; la ruta ya existe en `editor-videos/scripts/`.
- Estado de D03-A y D04-C: añadido como UNKNOWN.
