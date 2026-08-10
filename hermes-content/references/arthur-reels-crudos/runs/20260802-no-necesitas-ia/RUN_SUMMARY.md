# Run — "No necesitás IA" (Arthur) · 2026-08-02

Primer reel de Arthur editado de punta a punta con el pipeline `editor-videos`.
Serie: **Criterio / postura impopular**. Pilar 4 del masterplan
(`hermes-content/docs/ARTHUR_MARCA_PERSONAL_MASTERPLAN_20260730.md`).

## Crudo

| | |
|---|---|
| Archivo | `IMG_4731 (1).MOV` (Drive → local) |
| Formato | HEVC 10 bits, **HDR (HLG)**, 3840x2160 con rotación −90 → se ve vertical |
| Duración | 48,17 s · 60 fps · 612 MB |
| Toma | **Una sola, continua, sin trabadas ni repeticiones** |

## Cadena aplicada

`normalizar → transcribir → cut-plan → PREVIEW+OK → cortar → zoom → subtítulos → keywords → SFX → master`

| Paso | Salida | Notas |
|---|---|---|
| 1. Normalizar | `raw/arthur-no-necesitas-ia.mp4` | HDR→SDR con tone mapping (`hable`, `desat=0`). 1080x1920 @30. **6 min de encode.** |
| 2. Transcribir | `scripts/segments.json` | Speaches en VPS, `Systran/faster-whisper-small`, es. 9 segmentos / 136 palabras |
| 3. Cut-plan | `scripts/cutplan.json` | Con `--video` (silencio medido en AUDIO). 48,17→44,52 s · 6 silencios (3,65 s) · 0 muletillas |
| 3b. Preview | `renders/preview-360.mp4` + `costuras.jpg` | **Aprobado por Arthur en chat** (regla de oro cumplida) |
| 4. Cortar | `renders/cut.mp4` | `render-approved.mjs --apply` |
| 5. Zoom | `renders/zoom.mp4` | punch-in `--auto --anchor top`, 6 ventanas. Disimula el salto del empalme 3 (le entra la mano) |
| 6. Subtítulos | `renders/karaoke.mp4` | Bricolage Grotesque Bold, activa en amarillo, MarginV 220 |
| 7. Keywords | `renders/overlays.mp4` | 2 tarjetas ASS arriba, verde `#00D26A` sobre tinta `#0A0F0D` |
| 8. SFX | `renders/sfx.mp4` | 2 whoosh a −12 dB con ducking |
| 9. Master | `final/arthur-no-necesitas-ia.mp4` | −20,76 → **−14,36 LUFS**, pico −1,36 dBTP |

## Correcciones de transcript (confirmadas por Arthur)

| Whisper entendió | Real | Fix |
|---|---|---|
| "y sí, te **doy** yo que trabajo con esto" | "te **lo digo** yo" | `words[20]` |
| "si te ha pasado **lo** parecido" | "**algo** parecido" | `words[130]` |

Se parchearon en `segments-cut.json` a mano (no con `--fix`: el token "lo" aparece
3 veces en la pieza y el reemplazo global habría roto las otras dos).

## Keywords

| Tiempo (línea cortada) | Texto |
|---|---|
| 18,90 – 23,30 s | `4 LISTAS · 0 REGISTRO` |
| 36,50 – 40,60 s | `PASO 1: ORDENAR` |

Van **arriba** (Alignment 8, MarginV 280) porque abajo vive el rail del karaoke.
Se eligieron los 2 momentos que AGREGAN información; la metáfora del Fórmula 1
se dejó sin apoyo a propósito (el texto competiría con la frase hablada, que es
la que está diseñada para compartirse por DM).

## v2 — "subtítulo más grande + edición al máximo" (pedido de Arthur)

Entregable vigente: **`final/arthur-no-necesitas-ia-v2.mp4`**. La v1 queda como referencia.

| Cambio | v1 | v2 |
|---|---|---|
| Tamaño de subtítulo | 72 pt | **88 pt** (+22%), outline 4→5 |
| Altura del subtítulo | MarginV 220 | **285** (libra la interfaz de Reels) |
| Keywords | 2 | **6**, alternando verde de marca / negro para dar ritmo |
| Grado de color | ninguno | `contrast 1.07 · saturation 1.12` + `unsharp 0.55` |
| SFX | 2 | 3 (hook · dato · CTA), −12/−13 dB con ducking |
| Pasadas de encode | 3 (karaoke → overlays → sfx) | **1** (grado + apoyos + subtítulos juntos), crf 17 preset slow |

**Keywords de la v2:**

| Tiempo | Texto | Estilo |
|---|---|---|
| 5,10 – 8,40 | `Y TRABAJO DE ESTO` | negro |
| 14,30 – 18,20 | `¿DÓNDE ANOTÁN?` | negro |
| 18,90 – 23,30 | `4 LISTAS · 0 REGISTRO` | verde |
| 32,40 – 35,60 | `MÁS RÁPIDO ≠ MEJOR` | negro |
| 36,50 – 40,60 | `PASO 1: ORDENAR` | verde |
| 42,90 – 44,45 | `COMENTÁ ACÁ ↓` | verde |

Verificado que `≠` y `↓` existen en Bricolage Grotesque Bold (no hubo fallback de fuente).

**Lo que NO se hizo, a propósito:**
- **Ken Burns** sobre la línea del Fórmula 1: el punch-in por bloque ya cambia el encuadre ahí;
  apilar un segundo sistema de zoom mete jitter y obliga a re-encodear otra vez.
- **Apoyo sobre la metáfora del Fórmula 1**: es la frase diseñada para compartirse por DM.
  Un cartel encima la hace competir consigo misma.
- **Corte más agresivo** (`--min-sil 0.30`): rendiría ~1-2 s más, pero invalida los timestamps
  de los dos `.ass` y obliga a rehacer la cadena entera. No compensa.

## v3 — tratamiento profesional de los tags (VIGENTE)

Entregable vigente: **`final/arthur-no-necesitas-ia-v3.mp4`**.

**Cambios pedidos por Arthur:** (1) "trabajo de esto" → **"YO TRABAJO CON ESTO"**;
(2) que los textos de arriba se vean más profesionales.

**Diagnóstico del problema de la v2:** los bloques de color sólido + el alternado
verde/negro se leían como *sticker*, no como gráfica de marca. Dos errores: fondo saturado
a pantalla completa (rompe el 60-30-10 de la marca) y **dos estilos distintos** — la
consistencia es justamente lo que se lee como profesional.

**Tratamiento v3 (único para los 6 tags):**

| Atributo | Valor |
|---|---|
| Panel | `#0D0F0A` semitransparente (alpha `1E` ≈ 88% opaco), padding 22 |
| Texto | `#F4F5F2` (blanco hueso, no blanco puro), 54 pt, **tracking 5** |
| Acento | guion `—` en verde `#00D26A` al inicio — el verde queda en unos pocos píxeles |
| Entrada | `\fad(220,220)` |
| Posición | `\an8`, MarginV 250 |

Más chico + más tracking + panel translúcido se lee más premium que grande + apretado + color plano.

**Textos finales:** `YO TRABAJO CON ESTO` · `¿DÓNDE ANOTÁN?` · `4 LISTAS · 0 REGISTRO` ·
`MÁS RÁPIDO NO ES MEJOR` · `PASO 1: ORDENAR` · `COMENTÁ ACÁ ABAJO`

### ⚠ Aprendizaje técnico: `\p1` rompe la línea en libass

El primer intento de v3 dibujaba una barra de acento vertical con dibujo inline
(`{\c&H...&\p1}m 0 -38 l 7 -38 7 6 0 6{\p0}TEXTO`). **libass descarta el evento entero,
sin warning**: no se renderizó ningún tag y el log no dijo nada. Verificado con
`ffmpeg -v info` (libass 0.17.5 cargó bien la fuente, simplemente no pintó las líneas).

**Regla: nada de dibujos `\p1` mezclados con texto en la misma línea.** Si hace falta un
acento gráfico, usar un glifo que la fuente TENGA (el `—` funciona) o un evento separado
con `\pos` absoluto.

También se descartó la variante *kicker* (línea chica arriba + principal abajo con `\N`):
el cuadro de `BorderStyle=3` se autoajusta por línea y queda un borde **escalonado**, peor
que el panel plano. Comprobado con frames antes de renderizar.

## v5 — mockups / b-roll (VIGENTE)

Entregable vigente: **`final/arthur-no-necesitas-ia-v5.mp4`**.

Arthur: *"el video está muy crudo"*. Correcto — hasta la v3 los únicos apoyos eran texto.
Se **desbloqueó el paso 7 del pipeline** (ver "Bloqueos", ítem 2) y se agregaron dos mockups
que cuentan el argumento del video visualmente: **el desorden contra el orden**.

| Apoyo | Tiempo | Qué muestra |
|---|---|---|
| `assets/desorden.png` | 17,4 – 23,4 s | 4 tarjetas de chat separadas, badges rojos "N sin ver", pie `REGISTRO CENTRAL 0` |
| `assets/orden.png` | 36,6 – 41,3 s | Una sola tabla: cliente · atiende · estado, chips verdes, pie `TODO EN UN SOLO LUGAR` |

Generados con `make-mockup.mjs --template custom` desde HTML/CSS escrito en
`assets/build-mockups.mjs` — **cero diseño a mano, cero imágenes generadas con IA**.
Determinista: mismo script → mismo PNG.

**Composición:** `y = H*0.40`, escala 0.86, fade 0.35 s. Primero se probó `position: center`
a 0.78 y quedaba tapando la cara con el texto ilegible; bajarlo al 40% de la altura deja
**los ojos visibles** (mantiene la conexión) y agranda el panel lo suficiente para que se lea
en un celular. El borde inferior del apoyo (~y 1435) libra el rail del karaoke (~y 1520).

**Tags recortados de 6 a 4:** se sacaron `4 LISTAS · 0 REGISTRO` y `PASO 1: ORDENAR` porque
los mockups dicen lo mismo con más fuerza. Un tag y un mockup diciendo lo mismo a la vez es ruido.

**Nota de contenido:** los nombres de los mockups son genéricos (`Cliente 1`, `Vendedor 2`) a
propósito. No hay ningún dato de cliente real, ni captura de un WhatsApp real: son
ilustraciones dibujadas en código, no registros.

### Fuentes de marca en el template `custom`

`make-mockup.mjs` inyecta el trío de fuentes ONIA **solo en las plantillas internas**
(`stat`/`quote`/`browser`/`phone`). El template `custom` NO las recibe — hay que embeberlas
a mano como data URI, porque el script bloquea toda request de red. `build-mockups.mjs` lo
hace leyendo `hermes-content/brand/fonts/BricolageGrotesque-var-latin.woff2` (la oficial,
no la copia que deja el paso de karaoke en `renders/_fonts/`). **Candidato de mejora:**
que `tplCustom` inyecte `fontFaceCss` como el resto.

## v7 — apoyos que NO tapan la cara (VIGENTE)

Entregable vigente: **`final/arthur-no-necesitas-ia-v7.mp4`**.

Arthur: *"que no me tape la cara"*. En la v5 los paneles quedaban sobre la boca.

### La medición que define todo (hacerla SIEMPRE antes de componer)

Se marcaron líneas guía con `drawbox` sobre `zoom.mp4` en 6 momentos distintos:

| Referencia | y (frame de 1920) |
|---|---|
| Barbilla de Arthur (el punto más bajo de la cara) | **≈ 1290** |
| Borde superior del rail del karaoke (88 pt, MarginV 285) | **≈ 1525** |

→ **La franja libre son ~235 px.** Ese es el techo real del apoyo en este encuadre.
El límite NO es de diseño, es de **encuadre**: la cabeza ocupa los dos tercios superiores.
Si en futuras grabaciones Arthur se aleja de la cámara (más aire arriba), se puede volver a
paneles altos tipo v5.

### Consecuencia: apoyos como TIRA COMPACTA

Los mockups se rediseñaron de panel alto (948×681) a **tira de 1044×202**:

| Apoyo | Contenido |
|---|---|
| `desorden.png` | `▌4 LISTAS SEPARADAS` · `REGISTRO CENTRAL 0` (rojo) + 4 chips rojos `V1 3 sin ver`… |
| `orden.png` | `▌UNA SOLA LISTA` · `TODO EN UN LUGAR` (verde) + 4 chips verdes `C1 Cotizado`… |

Composición: `x=(W-w)/2`, `y=1300`, escala 0.94, fade 0.35 s → ocupan y 1300–1496.
Cara 100% libre, sin tocar el rail del karaoke.

### ⚠ Aprendizaje técnico: `overlay-visuals.mjs` exige x E y juntos

Primer intento con solo `"y": "1300"` → **se ignoró silenciosamente** y el apoyo cayó al
centro (y≈862). La condición del script es
`ov.x !== undefined && ov.y !== undefined ? {x,y} : place(pos,…)`: si falta uno de los dos,
usa `position` (default `center`). **Siempre pasar los dos.** Verificable con `--dry-run`,
que imprime el `overlay=x=…:y=…` real.

## v8 — producción (VIGENTE)

Entregable vigente: **`final/arthur-no-necesitas-ia-v8.mp4`**.

Arthur: *"que no se vea tan básico"*. Lo que lo hacía básico no eran los overlays: era que
son **44 s de un plano fijo contra una pared vacía**. Se atacó eso.

| Cambio | Detalle |
|---|---|
| **Ken burns por bloque** (reemplaza el punch estático) | `scripts/zooms.json` — cada bloque arranca en un tamaño distinto (sigue tapando el jump cut) **y se mueve** durante todo el bloque, alternando push-in / pull-out para que no derive siempre hacia adentro. El cuadro nunca queda quieto. |
| **Viñeta** | `vignette=angle=PI/4.4`. La pared beige plana pasa a tener profundidad y el ojo se va a la cara. Se compararon 3 intensidades en cuadros sueltos antes de elegir (`PI/5` suave · `PI/4.2` justa · `PI/3.6` pesada). |
| **Grado más marcado** | contraste 1.07→1.08, saturación 1.12→1.14 |
| **Entrada animada de los tags** | `\move(540,274,540,250,0,260)` — bajan 24 px en 260 ms mientras entra el fade. Antes solo aparecían. |
| **Entrada animada de las tiras** | `overlay=y='1300+34*max(0,1-(t-T)/0.30)'` — suben 34 px en 300 ms. El fade de alpha va por `fade=alpha=1` sobre el PNG. |
| **Una sola pasada** | grade + viñeta + 2 overlays animados + 2 ASS en un solo `filter_complex` (crf 17, preset slow) |

### Techo actual — es de MATERIAL, no de edición

Lo que queda para subir otro escalón **no se puede hacer en post con este crudo**:

1. **No hay b-roll.** Cada cuadro es su cara. La solución real son cutaways: grabación de
   pantalla de un sistema real, una captura de WhatsApp, el panel de ONIA funcionando.
   Con eso el video puede cortar afuera 2-3 veces y cambia por completo.
2. **La cabeza ocupa 2/3 del cuadro.** Deja ~235 px libres (ver v7) y obliga a apoyos en
   tira. Grabando con más aire arriba entran paneles altos.
3. **Fondo liso sin profundidad.** Una lámpara detrás, una estantería desenfocada o
   simplemente más distancia a la pared dan separación que ninguna viñeta reemplaza.
4. **Gráficos DETRÁS del sujeto** (matte) — `embedded-captions` lo soporta y es el look más
   producido posible, además de que nunca tapa la cara. No se intentó en esta pieza: el
   matte sobre 44 s de 1080x1920 es caro y no estaba verificado en esta máquina.

## Bloqueos encontrados

1. **ffmpeg no estaba instalado** en la PC. Se instaló `Gyan.FFmpeg 8.1.2` por winget.
   El PATH necesita shell nuevo; mientras tanto se usa por ruta directa en
   `%LOCALAPPDATA%\Microsoft\WinGet\Packages\Gyan.FFmpeg_*\ffmpeg-8.1.2-full_build\bin`.
2. ~~**`make-mockup.mjs` tiene una ruta hardcodeada a playwright**~~ → **RESUELTO 2026-08-02.**
   El script resolvía playwright con `createRequire("C:/dev/proyectos/onia-hermes/web-factory/
   apps/site/package.json")` — ruta absoluta que no existe en esta máquina (el repo está en
   `C:/dev/proyectos/HERMES/onia-hermes/`) y que rompería en cualquier otra.
   **Arreglo:** resolución relativa a `import.meta.url` subiendo a la raíz del repo, con
   fallback al workspace del panel y a la resolución normal de node, y un mensaje accionable
   si falta. Además se instaló la dependencia: `npm install playwright` + `npx playwright
   install chromium` en la raíz del repo (`node_modules/` ya está en `.gitignore`).
   Verificado generando los dos apoyos de la v5.
   **Pendiente relacionado:** revisar si `illustration-style.mjs` y `make-carousel.mjs`
   tienen el mismo patrón de ruta absoluta.
3. **La librería de SFX de HyperFrames no está en el repo** — 19/19 cues sin `.mp3`
   (el manifest sí está). Se usaron los placeholders locales sintetizados con ffmpeg;
   el `whoosh` es ruido rosa con flanger y suena bien. Bajar los reales de Pixabay
   cuando se pueda (ver `assets/sfx/README.md`).

## Regla de peso

`.gitignore` propio en `arthur-reels-crudos/`: los videos NO van a git (el run pesa
**1,3 GB**; se versionan solo los planes JSON, los `.ass` y las tiras de control =
**190 KB**). Con eso el corte se reproduce exacto sin arrastrar binarios.
