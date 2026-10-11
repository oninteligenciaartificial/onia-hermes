# P9 · ¿La cara o la escena?

Composición HyperFrames MUDA: 1080×1920, 24 fps, 480 cuadros / 20 s. Dos tomas ya pagadas (m1 Kling 3.0 std, m4 Seedance 2.0 Mini + referencias); 0 créditos nuevos. La composición la escribió Codex (borrador); el 11-oct-2026 la sesión Lucía (editor, contenedor Linux) construyó SIN `--borrador`, pasó los gates, renderizó, midió y miró el master (v1, SHA `969ac27d…282e`). El mismo día un revisor independiente entregó `qa/revision-1.md` (11 hallazgos: 1 ALTA, 4 MEDIA, 6 BAJA) y el editor aplicó la revisión: **este master es la v2**. Sin Git, voz, publicación, instalaciones ni descargas.

<!-- ESTADO -->
**MASTER v2 RENDERIZADO (revisión 1 aplicada), PENDIENTE DE VERIFICADOR Y DE «mostrada, publicá P9».** Todos los gates en verde (exit 0). No es aprobación visual ni permiso de publicar. Sigue MUDO: la voz no existe; su cronograma (`guion-voz.txt`) es una estimación a 17 car/s.
<!-- FIN ESTADO -->

## Master

| Dato | Valor |
|---|---|
| Archivo | `out/p9-final-1080x1920.mp4` (`out/` y `renders/` no van a git) |
| SHA-256 | `@@SHA@@` (`qa/sha-master.txt`); el de la v1 era `969ac27d219bec9ea9ba013aee0c55c8d055c2dff463ddc940abf14a4075282e` |
| Video | H.264 High, yuv420p, 1080×1920, 24 fps, 480 cuadros, 20,000 s |
| Audio | AAC LC 48 kHz estéreo, SILENCIO: volumedetect mean −91,0 dB / max −91,0 dB (`qa/aac-silencio.txt`) |
| Tamaño | @@TAM@@ |
| `index.html` | md5 `@@MD5@@`, idempotente (dos builds, mismo md5; `qa/idempotencia.txt`) |
| Fuentes | `assets/m1.mp4` y `assets/m4-full.mp4` (hardlinks a los originales, 720×1280, 145 cuadros; SHA en `qa/specs-fuentes.txt`); nunca el proxy |
| Render | `hyperframes@0.8.142`, `--quality high -f 24`, @@TRENDER@@, captura por pantallazo (Chromium completo, sin GPU); preview 360p real 37 s |

Línea de tiempo: m1 0–6 s · empuje rígido 5,75–6,0 s · m4 6,0–11,54 s · empuje 11,54–11,79 s · placa 11,79–20 s.
Entradas (`plan.json → eventos`; todas con fundido + acento de riel y tarjeta): dato de Kling 1,5 s · aviso de las fotos recibidas por Seedance 6,5 s · placa con las dos filas 11,79 s · **límite de cara 11,85 s · «Una toma cada uno» 12,35 s · límite del brillo 14,65 s · CTA 17,4 s** (CTA a plena opacidad desde 17,46 s: 2,54 s ≥ 2,4). Acentos intermedios (13,5 · 16,0 · 19,1 s) para no dejar más de 2 s sin evento.

## Revisión 1 (`qa/revision-1.md`): qué cambió por hallazgo

| # | Sev. | Estado | Qué cambió |
|---|---|---|---|
| **H1** | ALTA | **Resuelto** | La pantalla dice «Parecido indicativo. Bajo 200 px la cara es poco confiable: Kling, todo el clip; Seedance, el inicio. Ruido ±0,03.» (19 palabras) y la etiqueta «Cara: 139 → 347 px del clip original · reencuadra». El pie lleva la frase propuesta por el revisor. Evidencia: `qa/cara-px-fuente.txt` (corrida propia de `face-gate.sh` sobre los dos originales, 7 puntos por clip: Kling 115-120 px en 7 de 7; Seedance 139 y 181 px y de 243 a 347 desde los 2 s). El build valida «todo el clip / el inicio» contra la medición sin refs; las mutaciones rechazan «Seedance parte de 139 px» como única mención de tamaño (pantalla y pie). |
| **H2** | MEDIA | **Resuelto (con una reserva, ver dudas)** | La placa ya no es una pared: desde 11,79 s solo las dos filas; las notas entran **de a una**, cada una con su acento (riel naranja + tarjeta teñida 0,55 s): límite de cara 11,85 s → «Una toma cada uno: prueba, no regla.» 12,35 s → «Brillo: cuadro entero, mezcla luz y encuadre.» 14,65 s → CTA 17,4 s. Lectura nueva de la placa: 33 palabras (19 + 7 + 7) + 5 del CTA en 8,2 s (4,6 palabras/s; antes 7,6). Cada texto cumple 0,35 s/palabra + 0,3 desde su propia entrada (`qa/ventanas.txt`: límite 8,04 s con 6,95 pedidos; toma 7,54/2,75; brillo 5,25/2,75; CTA 2,54/2,4). Huecos verticales iguales (40 px) y flecha en DM Sans (ya no diminuta). |
| **H3** | MEDIA | **Resuelto** | Titular «¿La cara o la escena?» (mismas 5 palabras, pregunta). |
| **H4** | MEDIA | **Resuelto en el plan; la voz sigue sin existir** | `guion-voz.txt` sin cifras ni decimales hablados. L1-L3 terminan a 5,848 s (el corte a Seedance es 5,75-6,0 s) y L4 empieza a 6,083 s. L5, L6 y L7 empiezan a 11,96 / 14,29 / 17,33 s y sus notas entran a +0,39 / +0,36 / +0,07 s (`qa/alineacion-voz.txt`). Dos desvíos del texto de la madre, por el cronograma: L3 sin «3.0 std» (con él, L3 terminaba a 6,32 s) y L4 con «el encuadre se acerca» (sin eso, L5 empezaba a 10,5 s, antes de la placa). 311 caracteres (298 + 6 saltos + …; cupo 381), sube de 304 por esa L4. |
| **H5** | MEDIA | **Resuelto** | Desenfoque + oscurecido fijo (`backdrop-filter`, máscara radial; esquina superior izquierda x 0-440, y 0-290) dentro de `#overlay-m4`: viaja con m4 y no toca la cara ni la zona del PSNR (y 400-700). Pie: «Seedance 2.0 Mini inventó un letrero en la torre (de 7 a 11,5 s): no existe. Lo oscurecí en el video.» (la segunda frase la agregó el editor). |
| **H6** | BAJA | **Resuelto** | Brillo en enteros: «brillo 156 → 155 (−1)» y «brillo 146 → 112 (−34)»; pastillas «brillo −1» y «brillo −34»; «de 0 a 255» en la escala de cada fila. El build comprueba que el redondeo cuadre (156→155 = −1; 146→112 = −34) contra la medición de luz. |
| **H7** | BAJA | **Resuelto** | Cada fila lleva debajo de sus dos barras «brillo 0 a 255 · parecido 0 a 1», con el color de su barra. |
| **H8** | BAJA | **Resuelto y ampliado** | Ver «Dato nuevo» abajo: Seedance recibió 3 imágenes de referencia, 2 de ellas entre las 8 fotos con que se mide; Kling, ninguna. En pantalla (aviso de ≤ 12 palabras) y en el pie. |
| **H9** | BAJA | **Resuelto** | Regla 15 explicada con su exención (sección «Regla 15»). |
| **H10** | BAJA | Sin acción (por diseño) | El ambo naranja está dentro del canon (`LUCIA.md` §0: vestuario, nunca se presenta como profesional); la pieza no dice ni insinúa rubro. No hay otra toma pagada con otra ropa. |
| **H11** | BAJA | **Resuelto (README y rastro)** | SHA nuevo, gates, ArcFace con las dos fuentes (ver Gates), README al día. Falta copiar el master a `videos/lucia-entrega/` (como g1-g5) cuando la madre apruebe: no se tocó nada fuera de esta carpeta. |

### Dato nuevo (sesión Lucía, 11-oct): lo que recibió Seedance
- `job_display` del job `dd2d7c91` (0 cr): `start_image` = foto K1 (`4afffb96`) + 3 referencias: `a7cfb766` = R1_frontal_canon y `d7d6d36a` = R3_casi_frontal, que **son dos de las 8 fotos oficiales** con que se puntúa el parecido (manifest del face-gate, `$FACE_GATE_HOME/manifest.json`: R1..R8), y `abe2e6bd` = la selfie de espejo «look ancla» (no está entre las 8). Kling 3.0 std no recibió ninguna.
- Consecuencia: el 0,80 final de Seedance está medido en parte contra fotos que el motor recibió (favorecido).
- Medición independiente: `hermes-content/references/modelos/lucia/v4/prueba-motores-20261008/medicion-sin-refs-entrada-20261011.txt` (método: `.claude/skills/lucia/scripts/parecido_sin_refs.py`, ArcFace buffalo_l contra el centroide de SOLO las 6 fotos que Seedance no recibió, con matriz cruzada y tres clips de control sin entradas). Contra esas 6 fotos el parecido de Seedance baja de 0,707–0,801 a 0,673–0,761 (B−A media −0,042), pero casi todo es efecto del subconjunto (R2, R4 y R8 puntúan bajo en todos los clips: los controles caen −0,017 con el mismo subconjunto). Exceso atribuible a la fuga: **−0,026 ≈ 0,03, dentro del ruido de ±0,03**. La señal individual existe (coseno a R1/R3 +0,126 sobre las otras seis, contra +0,03 a +0,05 en controles) pero se diluye en el centroide de 8.
- Decisión de la madre: no se cambian los números de pantalla (0,71 → 0,80 siguen siendo los de PROCEDENCIA l.97); se agrega la divulgación. El build lee el archivo anterior y valida «2 de las 8», las 3 referencias y el «≈ 0,03» (`scripts/build.mjs`); la mutación que borra la divulgación (pantalla o pie) se rechaza.

## Lo que se vio (@@VISTO_RESUMEN@@)

@@VISTO@@

## Regla 15 («aire muerto», de `edicion-referentes`) y su exención

La regla 15 no existe como tal en el skill del repo; se aplica el texto del encargo (mismo criterio que G5 v2): pausa de voz ≤ 0,3 s, ningún tramo quieto > 0,3 s **fuera de la lectura**, un evento cada ≤ 2,0 s y a lo sumo un hueco de voz ≥ 0,3 s por cada 10 s.
- **Exención:** un texto cuenta «en lectura» durante su ventana (0,35 s/palabra + 0,3 s desde que entra), y un tramo quieto dentro de esa ventana no cuenta como aire. Con la exención el mayor tramo quieto es **0,000 s** (DOM, `qa/aire.txt`) y 0,083 s en píxeles (`qa/aire-pixeles.txt`).
- **Dato real sin exención** (cuadro a cuadro del DOM): **1,500 s** de mayor tramo igual (v1: 1,708 s); en los clips el movimiento es el de la fuente (el revisor midió que no hay quietos de 0,13 s). Es la placa, quieta entre entradas, y se cumple por la exención (cada nota está dentro de su ventana de lectura). Los «eventos» son entradas reales de texto (fundido + 18 px + acento) y acentos de riel (borde de 10 px y tarjeta teñida): 17 eventos, hueco máximo 1,700 s.
- Voz (no medible sin voz): pausas estimadas 0,213–0,235 s; el único hueco ≥ 0,3 s es la cola del CTA (0,725 s, de 19,3 a 20,0 s).

## Gates y evidencia (exit codes en `qa/RESUMEN-gates.txt`)

@@GATES@@

## Decisiones y cómo revertirlas

- **Texto del límite de cara:** reemplazado por la reformulación de la revisión (H1) por decisión de la sesión Lucía. Constante: `plan.json → textos.limite_cara` (y `reencuadre`); el pie y el literal autorizado de `scripts/build.mjs → esperado` van a la par. Reponer la frase vieja («Seedance parte de 139 px») o «todas las caras…» rompe build/gates y no se ofrece reversión.
- **Alineación de la voz estimada (H4):** L4 se alargó a 96 caracteres para que L5 empiece junto a la placa y L3 perdió «3.0 std». Revertir = editar `guion-voz.txt` y el literal `vozEsperada` del build; el build avisa si L3 cruza el corte o si L5-L7 se desalinean de su nota. Cuando haya voz real: medir cada pista, `duraciones.json`, retemporizar y corregir `plan.json → eventos` (`voz: n`).
- **Placa en serie (H2):** el orden de entrada es límite → toma → brillo → CTA, con el límite primero porque pide más lectura. Para cambiarlo: `plan.json → eventos` (t, `entrada`) y `layout` (y de cada bloque, medidos en el DOM; huecos de 40 px).
- **Scrim del letrero (H5):** `plan.json → scrim_m4` (caja, centro, radios, `desenfoque_px`, `brillo`). Cambiarlo exige mirar los cuadros 7-11,5 s a resolución completa y repetir PSNR y ArcFace.
- **Aviso de fotos recibidas:** pastilla `#aviso-refs` en m4 (6,5 s), no en la placa, para no pasar el tope de ≈ 34 palabras nuevas de lectura en la placa; es la duda 3 de abajo.
- Se copió la estructura de G5 v2 (package, hyperframes, scripts, assets-fijos). Los validadores se adaptaron a P9 (IDs, placas, rutas). Volver a G5 exige conservar el contenido P9 y remapear IDs.
- 20 s: m1 0–6 s, m4 5,75–11,791667 s, placa 11,541667–20 s. Dos empujes rígidos de 6 cuadros; clips a 1× sin congelación ni zoom añadido.
- Gancho y rótulo IA a 40 px desde el cuadro 0; el resultado de Kling entra a 1,5 s; Seedance y el reencuadre van rotulados debajo de las caras (y 1090-1440). Cambiar `textos`, `layout` y el build; medir DOM otra vez.
- Fuentes locales de marca (`build.mjs → FONTS` copia las tres woff2 desde `hermes-content/brand/fonts` a `assets/fonts/`, ignorado): Bricolage Grotesque 700 / 66 px en título y CTA, DM Sans 500 / 40 px en rótulo y filas, 42 px en datos, 44 px en notas y 34 px en la escala; Spline Sans Mono 500 / 42 px en cifras. No se descarga nada.
- CTA conserva 2,4 s mínimos de lectura/exposición aunque su conteo ordinario da 2,05 (`qa-dom.mjs → need`); no se amplía la exención del resto.
- `medir-dom` acumula todos los incumplimientos (`qa/medir-dom.txt`, `qa/medir-dom-fallos.json`) y termina con exit 1 si hay fallos. Regresión sin navegador: `node scripts/verificar-auditor.mjs`.
- **Estado inicial:** GSAP no aplica `tl.set(...,0)` si el primer `time(0)` llega a un timeline recién creado; por eso el estado inicial va con `tl.fromTo` y la opacidad oculta en CSS (no `transform` en CSS: falla `hyperframes check` con `gsap_css_transform_conflict`).
- `hyperframes.json → media.autoProxy=false`: evita derivados automáticos.
- `scripts/build.mjs` no pisa el bloque `ESTADO` de este README cuando las fuentes están completas y el estado ya no dice BORRADOR.

## Cómo reproducir (los comandos que se corrieron)

Desde `videos/lucia-p9-luz-cara/`. Con red para `npx -y` (en este contenedor la 0.8.142 se resuelve así; `--offline` no tiene caché).

```bash
export PRODUCER_HEADLESS_SHELL_PATH=/opt/pw-browsers/chromium HYPERFRAMES_SKIP_SKILLS=1
export PLAYWRIGHT_MODULE=/opt/node-tools/node_modules/playwright
node scripts/build.mjs > qa/build-master.txt 2>&1      # SIN --borrador; valida textos/pie/voz contra PROCEDENCIA l.97, la medición de luz y la medición sin refs
node scripts/master-ready.mjs
node scripts/voz.mjs > qa/tramos-de-voz.txt && node scripts/retemporizar.mjs > qa/retemporizar.txt   # también escribe qa/alineacion-voz.txt
for g in ventanas hueco-tarjetas eventos aire costuras medir-dom; do node scripts/$g.mjs > qa/$g.txt 2>&1 || exit 1; done   # los --estatico SOBREESCRIBEN qa/<gate>.txt: correrlos antes o repetir los DOM después
node scripts/grep-prohibidas.mjs > qa/grep-prohibidas.txt; node scripts/validar-mutaciones.mjs > qa/validar-mutaciones.txt; node scripts/verificar-auditor.mjs
node /home/user/onia-hermes/scripts/lucia-prohibidas.mjs pie.txt guion-voz.txt
flock /tmp/hf-render.lock npx -y hyperframes@0.8.142 check > qa/hyperframes-check.txt 2>&1
mkdir -p renders out qa
node scripts/borrador-360.mjs
(cd renders/draft360 && flock /tmp/hf-render.lock npx -y hyperframes@0.8.142 render --quality draft -f 24 -o ../../qa/p9-preview-360p.mp4)   # mirar antes del master
node scripts/master-ready.mjs && flock /tmp/hf-render.lock npx -y hyperframes@0.8.142 render --quality high -f 24 -o renders/final-raw.mp4   # proceso hijo directo; ~70 s
ffmpeg -y -i renders/final-raw.mp4 -f lavfi -t 20 -i anullsrc=r=48000:cl=stereo -map 0:v -map 1:a -c:v copy -c:a aac -b:a 128k -shortest -movflags +faststart out/p9-final-1080x1920.mp4
sha256sum out/p9-final-1080x1920.mp4 > qa/sha-master.txt
ffprobe -v error -show_streams -show_format -of json out/p9-final-1080x1920.mp4 > qa/specs-final.json
ffmpeg -i out/p9-final-1080x1920.mp4 -af volumedetect -vn -f null - 2> qa/aac-silencio.txt
node scripts/pixeles.mjs psnr-clips > qa/psnr-clips.txt; node scripts/pixeles.mjs vacios > qa/vacios.txt; node scripts/pixeles.mjs aire > qa/aire-pixeles.txt
ffmpeg -y -i out/p9-final-1080x1920.mp4 -vf 'select=not(mod(n\,12)),scale=216:384,tile=8x5' -frames:v 1 -q:v 2 qa/contacto-2fps.jpg
# ArcFace (venv con numpy/cv2/onnxruntime fuera del repo): export FACE_GATE_HOME=…/lucia-face-gate; .claude/skills/lucia/scripts/face-gate.sh <cuadros FINAL y fuente>
# Tamaño de cara de los originales: face-gate.sh <clip>@0,1,2,3,4,5,5.9 sobre m1 y m4 (qa/cara-px-fuente.txt)
```

No se renderizó dos veces el master: NO se verificó que el SHA del MP4 sea reproducible (sí lo es el `index.html`). `qa/sha-master.txt` fija el SHA de este master; si se vuelve a renderizar, comparar por PSNR/cuadros y no solo por hash.

## Lo que quedó sin medir y dudas abiertas

@@DUDAS@@
