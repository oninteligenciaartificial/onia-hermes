# BORRADOR, no es master · N02 · Sonnet 4.5 se apaga el 30 de noviembre

Molde: Santiago «noticia con tarjetas» (`edicion-referentes/scripts/santiago/`). 111,3 s, 1080x1920, 30 fps, −13,2 LUFS.
Armado sobre el corte **PROPUESTO** (`../cutplan.json`: 55 bloques de pausa = los 12 bloques de `../tabla-de-cortes.md`), todavía
**sin el «ok cortes»** de Sergio Urcullo. Si el corte cambia, se rehace con un solo comando. No se publicó ni agendó nada; no toqué
`santiago.py` ni `capturar.mjs`. **Nadie escuchó el audio:** todo lo dudoso (lista abajo) se confirma oyendo el bruto.

## Rehacerlo con un comando

```bash
bash /home/user/onia-hermes/videos/marca-personal/2026-10-11/n02-sonnet-45/borrador/rehacer.sh
```

Con el corte aprobado, otro bruto o carpeta de trabajo, y las páginas de Anthropic de nuevo (hacerlo el día del master):

```bash
RECAPTURAR=1 CUTPLAN=/ruta/cutplan-aprobado.json BRUTO=/ruta/D_EE23A577.mp4 S=/ruta/de/trabajo \
  bash /home/user/onia-hermes/videos/marca-personal/2026-10-11/n02-sonnet-45/borrador/rehacer.sh
```

`BRUTO` (default: el de esta sesión en el scratchpad; en Drive «Videos Onia Octubre», `EE23A577-932C-44A3-90F0-3AFEAA976AD6.mp4`),
`S` (default `scratchpad/N02/borrador`: ahí quedan `video.mp4` a 1080x1920, `sheets/` y `work/`; **no van al repo**), `CUTPLAN` (default
`../cutplan.json`), `RECAPTURAR=1` (vuelve a sacar las 9 capturas y sella fecha y hora UTC en `capturas.json`: `capturar.mjs` no guarda fecha).
Hace, en orden: `armar-transcript.py` (transcript en tiempo de salida) · [`capturar.mjs`] · `santiago.py --plan` (→ `plan.txt`) · render completo con
**`--sin-aire`** (la regla 15 manda sobre el aire de 0,34-0,52 s del molde) · `silencedetect`, `ebur128` y `medir-saltos.py` (→ `medicion.txt`) ·
`BORRADOR-no-es-master-360p.mp4` y `cuadros/`. `santiago.py` se llama directo, sin rodeos: ya corre con OpenCV 5 (arreglo `80a03dd24`).

**Tiempos medidos (4 CPU, esta máquina):** transcript <1 s · 9 capturas oficiales ≈ 40-70 s · primera pasada de `santiago.py` (analiza el bruto de 156 s:
saltos, cara por toma, voz) **113 s**, queda en `work/` y después `--plan` tarda 2-3 s · **render completo 256 s y 305 s** (dos corridas; 2,3-2,7 veces
la duración del video) · medición (`silencedetect`, `ebur128`, `medir-saltos.py`) + 360p + cuadros ≈ 100 s en total. `rehacer.sh` entero con caché: 405 s (454 s con `RECAPTURAR=1`); desde cero
(sin `work/`) ≈ 9-10 min. Los dos `rehacer.sh` terminaron con exit 0.

## Si el corte cambia, o se agrega / saca un bloque

- **Se recalcula solo:** `segments-cut.json` (palabras dentro de cada `keep`, restando el corrimiento acumulado), `plan.txt`, el render y la medición.
  `arreglos.json` se aplica por texto y avisa si una frase ya no está en el corte.
- **Depende del corte: el storyboard.** Cada escena se dispara por una frase real; `"corte": true` la pega al límite del corte más cercano.
  Mapa bloque de la tabla de cortes (tiempo de salida) → escenas de `storyboard.json`:

  | Bloque (salida, s) | Escenas |
  |---|---|
  | B1 · 0,00-11,21 | `gancho`, `anuncio` |
  | B2 · 11,21-15,57 | `tres-cosas` |
  | B3 · 15,57-37,52 | `uno-buscalo`, `consola`, `n8n`, `armaste` |
  | B4 · 37,52-49,89 | `mi-caso`, `agentes` |
  | B5 · 49,89-63,39 | `segundo`, `abri`, `comando`, `antes` |
  | B6 · 63,39-79,94 | `precio`, `tokens`, `cuenta`, `piensa` |
  | B7 · 79,94-88,16 | `probalo` |
  | B8 · 88,16-92,44 | `prellenada` |
  | B9 · 92,44-98,06 | `mandar` |
  | B10 · 98,06-102,89 | `ojo` |
  | B11 · 102,89-105,16 (sin palabras) | `sin-palabras` |
  | B12 · 105,16-111,27 | `cta-lista`, `cta-link` |

  - **Sacar un bloque:** las escenas cuya frase ya no está hacen que `santiago.py` aborte con «el storyboard pide «frase» y no está en el transcript»;
    se borra o se reescribe esa escena. **Sacar B11 (lo que recomiendo, ver «Bloque sin transcripción»):** borrar la escena `sin-palabras`: es la única
    fijada por tiempo (`"desde": {"t": 102.89}`) y no por frase; si queda, cae en el mismo segundo que `cta-lista`.
  - **Sacar «Para que se vea el resultado» del arranque del bloque 3:** la escena `uno-buscalo` dispara con `"para que se"`; pasar a `"uno"` y borrar la
    entrada de `dudosas-extra.json`.
  - **Agregar un bloque** (o devolver un hueco tirado): sus palabras entran a los subtítulos pero sin escena el apoyo anterior se queda. Hay que escribir
    la escena con su frase. Si el audio es nuevo, transcribir (faster-whisper `small`, el mismo modelo) y reemplazar `../transcript-whisper-small.json`;
    las lecturas dudosas nuevas van a `arreglos.json` / `dudosas-extra.json`.
  - **Mover un borde de bloque:** no pide nada. Mirar en `plan.txt` «pide corte y no hay corte…» (hoy 7 avisos de 5 frases, todos en pausas donde el cutplan no corta: el cambio
    de panel queda en la palabra, sin salto de cara que tapar) y «a la vista».
  - **Si el reel sale otro día que el jueves 15-oct:** «quedan 46 días» sigue en los subtítulos (lo dijo él) y **no hay tarjeta que cambiar**; ver «Verificación».

## Puntos que mira Sergio Urcullo (lo dudoso, de más a menos importante)

1. **Bloque 11 sin transcripción** (bruto 142,15-144,52 = salida 102,89-105,16, 2,3 s): hay audio y la 1.ª pasada de Whisper no oyó palabras. Medido: una ráfaga de
   0,33 s a −21 dBFS en 142,45-142,78 y una cola más baja (−31 a −44 dB) en 143,3-144,35; la 2.ª pasada (con vocabulario) oyó «La lista» ahí; y el bruto trae un
   **salto interno de toma a los 144,4 s**, justo al final del bloque; después arranca la toma buena de «La lista con los 5 ajustes…» (148,85). Todo apunta a un
   arranque en falso del cierre. **No inventé subtítulo ni tarjeta:** la escena `sin-palabras` es solo la cara, sin texto. Recomiendo cortarlo (ahorra 2,3 s).
2. **«Para que se vea el resultado» (bruto 27,94-29,28)**: la voz continua de 1,3 s antes de «buscalo» tiene 7 núcleos silábicos (no solo «uno»), y las dos pasadas de
   Whisper oyeron «Para que se vea el resultado uno». El guion de `GRABAR-10-16-OCT.md` lo trae solo en la columna de Edición («Pausa de 0,5 s después de «cinco», para
   que se vea el resultado»): parece una nota de producción leída en voz alta. **El subtítulo la muestra tal cual** (no apliqué el «[?] Uno» de `arreglos.json` porque
   escondería 1,3 s de voz). Si es una nota, mover el inicio del bloque 3 de 27,82 a ~29,3 s.
3. **«te aromó» / «no programaste»** (bruto 45,93-51,47): puse «no lo armaste vos… a quién te lo armó… si es que él te lo armó» (el guion dice «¿No lo armaste vos?
   Preguntale a quien te lo armó»; la 2.ª pasada oyó «no lo llamaste de vos»). `arreglos.json` traía «programó [?]». Cualquiera de las dos lecturas dice lo mismo; hay que oír cuál.
4. **«se va a apagar»** (bruto 7,86-8,66): la 1.ª pasada oyó «pagar», la 2.ª «apagar».
5. **«quedan 46 días»** (bruto 11,42-12,52): **solo es verdad el jueves 15-oct** (30-nov menos 46 días; hoy domingo 11-oct quedan 50). Está solo en los subtítulos, sin tarjeta.
   Si el reel no sale el 15, esa frase se corta o se regraba.
6. **«te pregunta qué archivos | al final te deja una lista»** (bruto 83,41-84,73): la frase queda abierta, falta quizá «tocar»; se muestra sin completarla.
7. **«una pantalla»** (bruto 27,5-28,2): la página dice que Export baja un **CSV**; el guion decía «una planilla». En pantalla va el texto de la página (CSV), el subtítulo dice «pantalla».

## Palabras a confirmar con el audio (segundo del BRUTO)

Los subtítulos NO llevan `[?]`: llevan la mejor lectura. La lista sale sola en `palabras-a-confirmar.txt`; la 2.ª pasada de Whisper está en `whisper-segunda-pasada.txt`.

| Bruto (s) | 1.ª pasada oyó · 2.ª con vocabulario | Subtítulo dice | Nota |
|---|---|---|---|
| 27,41-29,79 | «Para que se vea el resultado uno» · igual | igual | punto 2 de arriba |
| 7,86-8,66 | «se va a pagar» · «apagar» | «se va a apagar» | punto 4 |
| 36,93-37,71 | «no programas» · igual | «no programás» | voseo; guion: «¿No programás?» |
| 38,79-39,77 | «cloud and iusage export» · igual | «Claude andá a Usage export» | guion: «andá a Usage y Export»; página: «Go to the Usage page… Click Export» |
| 44,09-45,89 | «abrica nodo antropiq» · «antropic» | «abrí cada nodo de Anthropic» | guion igual |
| 45,93-46,49 | «no programaste» · «no lo llamaste de vos» | «no lo armaste vos» | punto 3 |
| 47,93-48,63 y 50,71-51,47 | «te aromó» ×2 · igual | «te lo armó» | punto 3 |
| 46,49-47,93 | «preguntarle a quién» · igual | igual | ¿«preguntale»? el guion dice «Preguntale» |
| 30,11-30,49 | «buscadlo» · «buscálo» | «buscalo» | ortografía |
| 31,13-32,35 | «busca este texto» · igual | «buscá este texto» | voseo |
| 32,85-33,55 | «cloud de guión» · igual | «Claude guion» | se quitó «de» (¿la «e» de «Claude»?); «guion» sin tilde (RAE 2010) |
| 104,83-105,91 | «recontálo» · «recontálo» | «recontalo» | ortografía (acento) |
| 129,17-130,15 | «contesta, paso» · «pasó» | «pasó» | acento |
| 150,19-150,95 | «los 5 justos es esta» · «justes está» | «los 5 ajustes está» | el guion dice «la lista con los cinco ajustes está en mi comunidad» |
| 153,63-155,19 | «Busca migrar en avisos» · igual | «Buscá migrar en Avisos» | CTA; el guion: «buscá MIGRAR en Avisos» |
| 3,48-5,04 · 115,95-117,73 | «ahora viene el 30 de noviembre» · «una temperatura cambiada» | igual | las dos pasadas y el guion coinciden; solo confirmar |
| 142,15-144,52 | sin palabras · «La lista» | sin subtítulo | punto 1 |

Diccionario de marcas aplicado (regla 9 de `edicion-referentes`): «Cloud» → «Claude» en 8 lugares, «BetRock» → «Bedrock», «Google Claude» → «Google Cloud»,
«sonnet» → «Sonnet», «Claude code» → «Claude Code», «API Migrate» → «API migrate» (es el comando), «guión» → «guion». Whisper parte «4» + «.5,» y «30» + «%»:
`armar-transcript.py` los pega («4.5,», «30%»).

Tiempos por palabra: son los de Whisper small, no alineación forzada. Se ajustaron a la voz (ni empiezan ni terminan dentro de un silencio medido: 45 bordes), pero
palabras largas siguen con tramos cortos. El karaoke puede ir unas centésimas corrido. Para el master conviene alinear de nuevo.

## Verificación contra las páginas oficiales (sacadas el 11-oct-2026)

Capturas con `capturar.mjs`, Chromium por el proxy de la sesión, TLS intacto, el **11-oct-2026 ~08:41-08:43 UTC (~04:42 en La Paz)**; `capturas/capturas.json` guarda URL y fecha de cada una.
Las tres páginas abren desde la nube: `platform.claude.com/docs/en/about-claude/model-deprecations`, `…/about-claude/pricing`, `…/models/sonnet-5-5/migration-guide`
(también `docs.anthropic.com` da 200). Ninguna cifra ni fecha en pantalla quedó sin respaldo en esas páginas (no hizo falta ninguna tarjeta «[VERIFICAR]»); lo que ninguna página cubre es su propio caso y n8n, y va sin cifras (ver la fila).

| Dicho | Página (texto exacto) | Resultado |
|---|---|---|
| «Anthropic lo anunció el 30 de septiembre» | model-deprecations, «2026-09-30: Claude Sonnet 4.5 model — On September 30, 2026, Anthropic notified developers using Claude Sonnet 4.5 of its upcoming retirement on the Claude API» | cuadra |
| «30 de noviembre» | misma entrada: «Retirement date November 30, 2026 · claude-sonnet-4-5-20250929 · Recommended replacement claude-sonnet-5-5». La tabla de estado dice «Deprecated · September 30, 2026 · November 30, 2026» y rotula la última columna «Tentative retirement date» | cuadra. La fecha vale para la API de Claude, Claude Platform on AWS y Microsoft Foundry |
| «quedan 46 días» | cálculo: 30-nov − 15-oct = 46 | solo el jue 15-oct; en pantalla no hay tarjeta |
| «buscá este texto, claude-sonnet-4-5» | el ID completo es `claude-sonnet-4-5-20250929` | cuadra (lo dictado es el prefijo; la tarjeta marca el ID completo en la tabla) |
| «consola de Claude, Usage, Export, … cada modelo que usaste» | «Auditing model usage: Go to the Usage page in Claude Console. Click Export. Review the downloaded CSV to see usage broken down by API key and model» | cuadra en los pasos; **la página dice CSV descargado, no «pantalla»** (punto 7) |
| «en n8n abrí cada nodo de Anthropic» · «lo cambié a mis agentes, mis nodos, mi infraestructura» | ninguna página lo cubre: es su procedimiento y su caso | sin prueba en pantalla; el plan pedía una captura del nodo de n8n (la saca la madre) y el control del «cero en 4.5» (`GRABAR-10-16-OCT.md`, T5). **Desde la nube no se puede verificar lo de su infraestructura** |
| «Sonnet 5.5, el nuevo modelo» | «Recommended replacement claude-sonnet-5-5» | cuadra como reemplazo recomendado; la página **no dice cuándo salió**, por eso en pantalla va solo el ID |
| «barra Claude API migrate y el modelo nuevo» | migration-guide: «/claude-api migrate this project to claude-sonnet-5-5» | cuadra |
| «te pregunta qué archivos… una lista para que revise» | «It asks you to confirm the migration scope (entire working directory, a subdirectory, or a specific file list) before editing any files» y «produces a checklist of items to verify manually» | cuadra (pregunta el **alcance**, no archivos sueltos) |
| «de 3 dólares a 2» | pricing: Sonnet 4.5 Input $3 / Output $15 por MTok; Sonnet 5.5 Input $2 / Output $10 | cuadra (entrada; la salida baja igual: 15 → 10) |
| «30% más largo» | pricing, nota: «Claude 4.7 and later models… This tokenizer produces approximately 30% more tokens for the same text… Claude Sonnet 4.6 and earlier models use the previous tokenizer» | cuadra |
| «puede bajar cerca de un 13%» | cálculo con la página: entrada 2 × 1,3 = 2,60 contra 3 → **−13,3 %**; salida 10 × 1,3 = 13 contra 15 → **−13,3 %** | **cuadra.** Es solo precio y tokenizador; no incluye el pensamiento (siguiente fila) |
| «ahora piensa antes de contestar y ese pensamiento se cobra» | guía: «a request with no thinking field runs with adaptive thinking» y «thinking tokens are billed as output tokens» | cuadra: por eso el total puede subir aunque el precio baje; él lo dice con «puede» y «recontalo» |
| «cinco ajustes… rechaza con error» y sus tres (temperatura, respuesta prellenada, obligarlo a usar una herramienta) | guía: «five settings that return a 400 error: thinking budgets, sampling parameters, assistant prefill, forced tool choice, and thinking: {"type": "disabled"}» | cuadra: sus tres = sampling parameters, assistant prefill, forced tool choice. «El viejo los aceptaba» está implícito en la guía (tabla de `thinking`); no lo verifiqué uno por uno |
| «Bedrock y Google Cloud, la fecha es otra» | model-deprecations: «Partner-operated platforms (Amazon Bedrock and Google Cloud) set their own retirement schedules, so a model's lifecycle status and dates can differ» | cuadra |
| «Busca migrar en avisos» | el aviso MIGRAR existe: `hermes-content/docs/cola/plan-3-semanas/AVISOS-COMUNIDAD-8-16-OCT.md` («MIGRAR · De Sonnet 4.5 a Sonnet 5.5») con el mismo checklist | existe en el repo; **tiene que estar pegado en Avisos antes de publicar** (condición bloqueante del plan) |

Cuentas: la del 13 % cuadra (arriba). No puse ninguna cifra que él no dijo (no hay «2,60», «× 1,3» ni «ESTIMADO» en pantalla: en `GRABAR-10-16-OCT.md` T7 estaban planeados, acá no).
En la captura de precios se ven además las filas de Claude Fable 5.1 (US$10 / 50) y Opus 5.5 (US$4 / 20): son la tabla oficial, sin marcar. Las capturas conservan el estilo de la página (el código en línea
se ve en salmón y el icono de Opus es naranja: no es diseño nuestro).

## Qué hay en pantalla y de dónde sale (cada texto: sus palabras o una página oficial de hoy)

| Desde (s) | Escena · layout | Qué muestra | Fuente |
|---|---|---|---|
| 0,00 | `gancho` · split | «Sonnet 4.5 / 30 de noviembre» + entrada del historial, fecha marcada | model-deprecations |
| 7,55 | `anuncio` · split | «Lo anunció el 30 de septiembre» + logo Anthropic + «On September 30, 2026» marcada | model-deprecations |
| 11,21 | `tres-cosas` · pip | «Tres cosas»: 1 Buscarlo · 2 Cambiarlo · 3 Probarlo (entran con cada verbo) | sus palabras |
| 15,57 | `uno-buscalo` · split | «Buscalo en tu código», `claude-sonnet-4-5` y la tabla con el ID marcado | sus palabras + model-deprecations |
| 24,60 | `consola` · split | «En la consola: Usage, Export» + sección «Auditing model usage» con Usage, Export y «down by API key and model» marcados | model-deprecations |
| 29,74 | `n8n` · split | «En n8n: abrí cada nodo de Anthropic» + logo Anthropic | sus palabras |
| 32,09 | `armaste` · cara completa | «No lo armaste vos / Preguntarle a quién te lo armó» | sus palabras |
| 37,52 | `mi-caso` · split | «Lo cambié al nuevo modelo» + `claude-sonnet-5-5` marcado como reemplazo | model-deprecations |
| 43,03 | `agentes` · pip | «Se lo cambié a»: mis agentes · mis nodos de n8n · toda mi infraestructura de desarrollo de Claude Code | sus palabras |
| 49,89 | `segundo` · cara completa | «Como segundo, cambiarlo» | sus palabras |
| 51,60 | `abri` · split | «Abrí Claude Code en esa carpeta» + logo Claude (blanco) | sus palabras |
| 54,04 | `comando` · split | «Escribí lo que ves» + `/claude-api migrate this project to claude-sonnet-5-5` marcado | migration-guide |
| 58,76 | `antes` · split | «Antes de tocar nada»: «confirm the migration scope» y «checklist of items to verify manually» marcados | migration-guide |
| 63,39 | `precio` · split | «De 3 dólares a 2»: fila Sonnet 4.5 ($3) y tabla con Sonnet 5.5 ($2) marcados | pricing |
| 65,82 | `tokens` · split | «Tu texto: 30% más largo» + nota del tokenizador, «approximately 30% more tokens» marcado | pricing |
| 70,44 | `cuenta` · pip | «La cuenta puede bajar / cerca de un 13%» | sus palabras |
| 73,80 | `piensa` · split | «Ahora piensa antes de contestar» + «thinking tokens are billed as output tokens» marcado + sello «SE COBRA» | migration-guide |
| 79,94 | `probalo` · split | «Tres: probalo» + párrafo de los cinco ajustes, sello «3 DE LOS 5», «sampling parameters» marcado | migration-guide |
| 88,16 | `prellenada` · split | «Una respuesta prellenada / obligarlo a usar una herramienta»: «prefill» y «forced tool choice» marcados | migration-guide |
| 92,44 | `mandar` · split (papel) | «Mandar un mensaje a tu bot»: Si contesta → Pasó · Si tira error 400 → Es uno de los 5 | sus palabras |
| 98,06 | `ojo` · split | «Ojo: esto vale para la API de Claude» + «Bedrock and Google Cloud» marcado + sello «OTRA FECHA» | model-deprecations |
| 102,89 | `sin-palabras` · cara completa | solo la cara, sin texto ni subtítulo | (bloque 11) |
| 105,16 | `cta-lista` · split | «La lista con los 5 AJUSTES en mi comunidad» + sello «GRATIS» | sus palabras |
| 108,48 | `cta-link` · split | «Link en MI PERFIL» y «Buscá MIGRAR en Avisos» (entera, hasta el último cuadro) | sus palabras |

Logos: los de `hermes-content/references/brand-claude/` (`anthropic--dark.png`, `claude--dark.png`: versiones blancas, reducidas a 240 px; ninguno recreado). Usé la estrella
**monocroma**, no la terracota, para cumplir «sin rojo». **No usé el logo de n8n**: su SVG oficial es `#EA4B71` (rosa-rojo) y no tiene versión monocroma; si Sergio Urcullo lo quiere, se suma una línea
al storyboard y se acepta ese color.

## Medido (render final; `medicion.txt` y `plan.txt`)

| Qué | Resultado |
|---|---|
| **Regla 15**, `silencedetect noise=-35dB d=0.3` sobre el audio del render | **0 silencios** (a d=0,2: 18, que son los empalmes de 0,24 s y pausas de 0,2-0,3 s) |
| Pausa más larga medida por el molde (voz del bruto en la salida) | 0,41 s; 10 pausas de 0,18-0,5 s; ninguna de más de 0,5 s (piso p1 −64,6 dBFS) |
| Sonido | **−13,2 LUFS · LRA 2,0 LU · true peak −1,3 dBFS** (receta −13 ±0,5; LRA 2,3-3,4: queda corto; TP ≤ −1: cumple) |
| Duración / ritmo | 111,3 s (receta 65-120) · 2,88 palabras/s (receta 2,65-3,2) · 320 palabras |
| Layouts | 11 cambios (0,99 por 10 s; receta 0,75-2,1) · split 78 % · cara completa 8 % · persona reducida 13 % · sin lámina sin cara: **tramo sin cara más largo 0 s** |
| Cámara | ojos al 67,5 % en split y 46,0 % en cara completa; paso split→cara 413 px; 4 tomas con escala ×1,07-1,10 |
| Gancho | primera palabra a 0,12 s, subtítulo a 0,12 s, entrada del historial oficial en el cuadro 0 |
| Elementos nuevos | 68 (6,1 por 10 s; receta 6-9) · algo cambia cada 1,8 s de media (máx 4,8 s) · 3 golpes de zoom (receta 1-3) |
| **Cara en los empalmes** (YuNet sobre el render, `medir-saltos.py`) | 37 empalmes dentro de una escena: salto de ojos **máx 16 px en x y 15 px en y** (mediana 2,6 y 2,2). Los 17 que caen en un cambio de layout se mueven a propósito (la cámara sube y baja). Incluye 2 cuadros de movimiento natural |
| Saltos internos del bruto | 52,9 · 119,4 · 144,4 s: los dos primeros caen en tramos que el corte tira; **el de 144,4 cae dentro del bloque 11** (a 0,1 s de su final) |
| Cortes «a la vista» (sin cambio de panel) | 34 (33 micro-cortes de pausa + el salto interno del bruto a los 105,04 s) y 4 dentro de la ventana reducida: el cutplan trae un corte cada ~2 s. Con los saltos de cara de arriba no se ven. **Excepción a mirar: el salto de 105,04 s cae dentro de la escena de la cara sola (bloque 11)**: es el cambio de toma del bruto (punto 1) |
| **No cumple la receta** | cola tras la última palabra 0,17 s (receta 0,3-0,65: el bruto termina ahí) · sin remate de 3-10 s ni despedida (falta la toma) · LRA 2,0 |
| No medido | alineación de los subtítulos con la voz (no hay alineación forzada) |

Mirado con los ojos: hoja de control completa (12 hojas a 2 fps, 0-111 s) del primer render completo (igual al final salvo «guion» sin tilde, «Claude Code» y el crédito de `mi-caso`), de la corrida final las hojas 4 y 12, unos 40 cuadros sueltos con `--fotos` y los 6 de `cuadros/` del render final: subtítulos legibles sobre la costura,
tarjetas dentro del cuadro, CTA entero en los últimos cuadros (1:49-1:51), la cara no salta en los empalmes de pausa. Antes del render final se ajustó varias veces el diseño de las capturas
(texto más grande, marcas en frases de una sola línea, escena `precio` con título). **Nadie lo escuchó.**

## Trampas nuevas de este armado (para `edicion-referentes`)

1. **`capturar.mjs` anda tal cual en `platform.claude.com`** (las 9 capturas en una corrida, sin el problema del BODY que scrollea de `developers.openai.com`). Truco para una celda de tabla:
   usar el nombre de la fila como `ancla` («Claude Sonnet 4.5») y buscar «$3 / MTok» **desde ahí**: `frases` toma la primera coincidencia debajo del ancla, así no agarra la fila de arriba;
   «$2 / MTok» no choca con «$20 / MTok» porque la búsqueda es de texto exacto.
2. **Una `marca` sobre una frase que se parte en dos renglones dibuja un rectángulo que cubre los dos renglones enteros.** Marcar el tramo que cabe en un renglón («prefill» en vez de «assistant prefill»,
   «down by API key and model» en vez de «broken down by…»). Bajar `ancho_css` de 560 a 460 agranda el texto de la tarjeta ×1,27 en el cuadro de 984 px (más legible en el teléfono), pero **vuelve a cortar los renglones: hay que revisar las marcas**.
3. **Un disparador toma la PRIMERA aparición de la frase** (ya estaba en DD-A, volvió a pasar 3 veces): «cambiarlo» pegó a 14,13 s en vez de 50,93; «claude code» a 49,25; «cerca» a 67,85. Se vio en «— disparos —» de `plan.txt`.
   En la forma de diccionario la repetición va con `"n": 2` (la sintaxis `frase#2` solo se interpreta en la forma de texto; lo leí en `santiago.py`, no lo probé fallando).
4. **Whisper parte «4» + «.5,» y «30» + «%»** y el subtítulo muestra «.5» como palabra suelta: `armar-transcript.py` los pega. «guión» va «guion» (RAE 2010); el molde no lo arregla.
5. **El texto que dictás letra por letra («Claude guion Sonnet guion 4 guion 5») va en los subtítulos como lo dijo, y la cadena real (`claude-sonnet-4-5`) va en una tarjeta con el ID completo de la página marcado.**
6. **`pip` (persona reducida) en vez de `lamina` para listas:** deja la cara en pantalla y el «tramo sin cara» queda en 0 s.
7. **`desde: {"t": X}` no se pega a ningún corte:** para la escena de la cara sola usé el límite exacto del cutplan (102,89). Si el corte cambia hay que moverla o borrarla.
8. **Un `credito` sin `en` aparece antes que la captura que cita** (visto en `mi-caso`): darle el mismo `en` que a su captura.
9. **`medir-saltos.py` (nuevo):** mide la cara (YuNet) a ±1 cuadro de cada empalme del RENDER y separa los empalmes con cambio de layout (la cámara se mueve a propósito) de los internos. Reemplaza el «los miré antes/después».
10. **Primera pasada de `santiago.py` sobre un bruto de 156 s: 113 s** (el de N06, 52 s, tardó 28 s): escala con la duración del BRUTO, no del corte.
11. **El logo de Claude oficial es terracota** y el de n8n es rosa-rojo: para «sin rojo» van las versiones monocromas de `brand-claude/` (`--dark` = blanco) y n8n queda sin logo.
12. **El guion de `GRABAR-10-16-OCT.md` sirve para leer a Whisper** (T4: «andá a Usage y Export», «¿No lo armaste vos?»): tres lecturas dudosas se resolvieron por el guion, pero el guion es lo que pensaba decir, no lo que dijo.

## Archivos

`rehacer.sh` · `armar-transcript.py` + `arreglos.json` + `dudosas-extra.json` → `segments-cut.json` + `palabras-a-confirmar.txt` · `storyboard.json` · `capturas/` (9 PNG + 2 logos +
`capturas.json` con URL y fecha) · `plan.txt` (control de `--plan`) · `medicion.txt` · `medir-saltos.py` · `whisper-segunda-pasada.txt` · `cuadros/` (6 JPG del render: 2,0 · 22,8 · 56,5 · 65,5 · 86,0 · 109,9 s) ·
`BORRADOR-no-es-master-360p.mp4` (2,7 MB). El render a 1080x1920 (`video.mp4`, 57 MB) y las hojas de control (`sheets/`, 2 fps) quedan en
`/tmp/claude-0/-home-user-onia-hermes/0fd2553b-524b-53fe-9e97-5c1ac80566e6/scratchpad/N02/borrador/`, no en el repo.
