# L02 · Este video no fue grabado

Reel 9:16 de 6,04 s, **sin voz** (el texto es la narración): b-roll Kling de Lucía caminando por una calle a la hora
dorada + dos tarjetas de frase + sello «SEGUIME.» con golpe de zoom + 3 pops. Fórmula revelación → contraste → acción,
en primera persona. Costo: **0** (nada generado: el clip ya existía; tarjetas y sello en HTML/CSS; SFX de la librería
de HyperFrames).
Instrucción ejecutada: [`INSTRUCCION.md`](INSTRUCCION.md) · receta: `.claude/skills/editor-videos/SKILL.md` § «Reels de
Lucía» · guion: `hermes-content/docs/cola/lucia-diario/S1-GUIONES.md` § L02.

| Qué | Ruta |
|---|---|
| Final (gen1 + SFX, sin master) | `final/l02.mp4` (ignorado en git) · md5 `16c92c1ea4114c4c43d31f684adbe270` |
| Feed (copia byte a byte del final) | `hermes-content/references/modelos/lucia/v4/feed/l02-este-video-no-fue-grabado.mp4` |
| Preview para el OK | `renders/preview-360.mp4` (360×640, CRF 28) · tira de 6 cuadros: `renders/qa/preview-tira.jpg` |
| Hoja de cuadros con guías (y=939, y=1490, 80 px derecha) | `renders/qa-frames.jpg` |
| Stills de cada entrada (mismo grafo, antes del render) | `renders/stills/` + `renders/stills-hoja.jpg` |
| Sombra de las tarjetas, mirada | `renders/qa/sombra-f030-1a1.png` (final al 100 %) · `renders/qa/preview-f030-zoom.png` (preview ×3) |
| QA en números | `renders/qa/qa.json` · identidad: `renders/qa/identidad-l02.json` + `renders/qa/caras-identidad.jpg` · recorte 1:1: `renders/qa/cara-1a1-f097.png` |

**Estado: esperando a Sergio Urcullo** — (1) el OK sobre la tabla de cortes y el preview 360p, y (2) la decisión de
identidad (ver Pendiente: fallan 2 de 5 cuadros y la edición no lo puede arreglar). Sin eso no se publica.

**Pie (va en el post, no en pantalla):** Lucía es un personaje hecho con IA por @oniahq. No existo, pero lo que te
muestro sí funciona: sistemas que trabajan solos para tu negocio. Seguime.

## Tabla de cortes

El clip no se corta: arranca en caliente (cuadro 0 ya camina y sonríe; la primera tarjeta entra en el cuadro 2) y
termina con Lucía mirando a cámara y sonriendo, que es el remate visual. Lo que se recorta es texto.

| # | Me quedo con | Tiro | Por qué |
|---|---|---|---|
| 1 | Clip Kling entero, 0,000–6,042 s (145 cuadros) | Nada del clip | Sin tiempo muerto al inicio y el final es la mirada a cámara. No se congela ni se acelera. |
| 2 | «Este video no fue grabado.» · «No existo. **Soy IA.**» · «SEGUIME.» | «lo que te muestro sí funciona» en pantalla | Sin voz: ≤ 6 palabras por tarjeta y ≥ 0,35 s por palabra + 0,3 s. La promesa va al pie (en la versión PIL eran 11 palabras en 1,9 s, ilegibles). |
| 3 | Todo el texto en la franja y=939–1490, debajo del mentón | Texto arriba, sobre la cabeza | En la versión PIL «Es IA.» tapaba la frente. Mentón máx medido con SCRFD: 899 (cuadro 144). |
| 4 | Tarjetas y sello en código (`make-mockup.mjs`) | Placas PIL del 1-oct | Regla de Sergio Urcullo del 1-oct: todo reel se edita con la skill; las placas PIL fueron rechazadas. |
| 5 | Velo oscuro en degradé debajo del sello, de 3,96 s al final | Sello blanco a pelo / velo todo el video | Bajo el sello, el suéter crema y la vereda al sol dan luminancia p90 de 188 a 223 (criterio de L08: > 200 → velo). Con velo, el fondo queda en 130. |
| 6 | Sombra de las tarjetas entera, que se desvanece sola ~113 px debajo de la tarjeta | La sombra cortada en seco en y=1162 (render anterior) | La captura de la plantilla dejaba 40u de aire y la sombra baja ~137u: quedaba una franja gris de ~40 px que terminaba en una línea recta sobre el suéter, en el 65 % del video. |

## Storyboard con los tiempos REALES del render (24 fps)

Tiempos de la instrucción cuantizados al cuadro más cercano. Cajas = lo visible (cuerpo opaco de la tarjeta, letra +
raya del sello) en coordenadas 1080×1920.

| Cuadros | t real (s) | Qué | Caja visible (x1,y1 → x2,y2) |
|---|---|---|---|
| 2–51 | 0,083 → 2,125 (sale a 2,167) | `frase-card` «Este video no fue grabado.» (900 de ancho visible, letra 65,8 px) + sombra que se apaga en y≈1234 | 90,960 → 989,1121 |
| 52–94 | 2,167 → 3,917 (sale a 3,958) | `frase-card` «No existo.» + «Soy IA.» en #10C26B (misma escala) | 228,960 → 853,1121 |
| 95–144 | 3,958 → 6,000 (último cuadro) | velo negro en degradé: alfa 0 en y=940 → 0,48 en 1200 → 0,52 en 1490 → 0,55 en 1920; entra con fade 0,22 s | lienzo entero |
| 95–144 | 3,958 → 6,000 (último cuadro) | sello «SEGUIME.» (`keyword-marca`, 640 de ancho, −5°): 130 % → 114 % → 104 % → 100 % en los cuadros 95–98, opacidad 70 → 90 → 100 % | 217,1149 → 860,1366 (al 130 %: 120,1115 → 956,1399) |
| 95–99 | 3,958 → 4,125 | golpe de zoom +3 % (5 cuadros, ancla `top`) | medido con ECC contra el crudo: ×1,0301 en 95–99, ×1,0000 en 93–94 y 100–101 |

Fades de las tarjetas: entrada 0,15 s (el overlay arranca un cuadro antes con alfa 0, así el cuadro de entrada ya se ve
al 28 %), salida 0,22 s; la tarjeta 2 entra en el cuadro en que termina de salir la 1. El sello no tiene fade: entra
con su escala y se queda hasta el último cuadro.

**SFX** (`duck:false`): 3 × `pop`. El archivo trae **0,116 s** de silencio antes del golpe (medido con librosa), así
que `at` = entrada visual − 0,116 (el primero se clampa a 0). Golpes medidos en el final: **0,117 · 2,168 · 3,958 s**
contra entradas visuales 0,083 · 2,167 · 3,958 s. Ganancias −10 / −10 / −8 dB (sello).

## Comandos para regenerar (desde la raíz del repo)

```bash
P=videos/lucia-l02; ES=.claude/skills/editor-videos/scripts; H=.claude/skills/editor-videos/assets/html
# 0) medir la cara en todo el clip (SCRFD) → franja libre (mentón máx + 40 → 1490)
python3 $P/scripts/medir-cara.py $P/raw/l02-calle-kling-1d2b5631.mp4
# 1) assets (HTML/CSS → PNG alpha @2x). Las tarjetas usan la copia LOCAL $P/assets/frase-card.html (ver decisión 10)
node $ES/make-mockup.mjs --template custom --html-file $P/assets/frase-card.html --title "Este video no fue grabado." --accent "#10C26B" --width 1000 --out $P/assets/card1-grabado.png
node $ES/make-mockup.mjs --template custom --html-file $P/assets/frase-card.html --title "No existo." --value "Soy IA." --accent "#10C26B" --width 1000 --out $P/assets/card2-ia.png
node $ES/make-mockup.mjs --template custom --html-file $H/keyword-marca.html --title "SEGUIME." --accent "#10C26B" --width 1000 --out $P/assets/sello-seguime.png
# 2) overlays a tamaño de lienzo + pasos del sello + velo + layout.json (posiciones y cuadros)
python3 $P/scripts/prep-assets.py
# 3) stills de cada entrada con el MISMO grafo (mirarlos antes del render)
node $P/scripts/build.mjs --stills 0,1,2,3,26,30,51,52,53,73,75,94,95,96,97,98,99,100,120,143,144
# 4) gen1 en UNA pasada (CRF 14 slow, bt709, aac 48 kHz en silencio)
node $P/scripts/build.mjs
# 5) SFX (plan: scripts/sfx-plan.json) → final → feed → preview
node $ES/sfx.mjs --video $P/renders/gen1.mp4 --plan $P/scripts/sfx-plan.json --out $P/renders/sfx.mp4
cp $P/renders/sfx.mp4 $P/final/l02.mp4
cp $P/final/l02.mp4 hermes-content/references/modelos/lucia/v4/feed/l02-este-video-no-fue-grabado.mp4
ffmpeg -y -i $P/final/l02.mp4 -vf scale=360:640:flags=lanczos -c:v libx264 -crf 28 -pix_fmt yuv420p \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 -c:a aac -b:a 96k -movflags +faststart $P/renders/preview-360.mp4
# 6) QA (hoja con guías, YuNet, SCRFD, identidad sin redondear + barrido de 145 cuadros, color, velo, SFX, entradas
#    cuadro a cuadro, sombra de las tarjetas, ECC del golpe, specs). Necesita el preview del paso 5.
python3 $P/scripts/qa.py      # refs: env LUCIA_REFS (default: refs locales de la sesión de L08); ~2,5–4 min
```

Sin master a −14 LUFS: sin voz, `loudnorm` subiría los pops a nivel de voz (instrucción § ORDEN 4).

## QA (medido sobre `final/l02.mp4`, md5 `16c92c1ea4114c4c43d31f684adbe270`)

| Chequeo | Resultado |
|---|---|
| Specs | h264 High 1080×1920, 24 fps, 145 cuadros, yuv420p, bt709 (matriz/primarios/transferencia), aac LC 48 kHz estéreo, `+faststart` ✓ · 16,3 Mbps de video · 12,3 MB |
| Duración | video 6,042 s · audio 6,058 s (relleno del último cuadro AAC, 16 ms) |
| Audio | −30,4 LUFS integrado · pico **−11,1 dBTP** (tope −3) ✓ |
| Caras YuNet | crudo 145/145 cuadros con 1 cara · final 145/145 · 0 cuadros distintos ✓ |
| Texto vs cara | mentón máx 899 (SCRFD) en crudo y final · texto entre y=960 y y=1399 (sello al 130 %) → dentro de 939–1490 ✓ · 0 cuadros con texto a < 40 px del mentón ✓ · borde derecho máx 989 < 1000 ✓ |
| **Sombra de las tarjetas** | alfa de los 4 bordes de `card1-grabado.png` y `card2-ia.png` (y de sus versiones de lienzo): **0** (antes: 55 abajo, 10 a los lados) ✓ · oscurecimiento contra el crudo, promedio x 150–930: **salto 1162→1163 = 0,40 / 0,36 / 0,36 / 0,65 niveles** en f010 / f030 / f075 / f090 (antes: +31,6 a +33,3) ✓ · mayor salto anómalo entre filas seguidas (Δ contra la mediana de sus 7 vecinas), y=1125–1360: 0,58 / 0,72 / 0,53 / 0,80 ✓ (< 2) · el degradé baja de 85 niveles pegado a la tarjeta a < 1 nivel en y=1234–1240 · f030 al 100 % y preview ×3 mirados: sin franja ni línea ✓ |
| Identidad (ArcFace, centroide de R1–R8, **sin redondear**, gate ≥ 0,70) | 0,50 s **0,7272** ✓ · 1,50 s **0,6945** ✗ · 3,00 s **0,6300** ✗ · 4,50 s **0,7160** ✓ · 6,00 s **0,7117** ✓ → **fallan 2 de 5** ✗ (negativos máx 0,224; refs leave-one-out mín 0,698) |
| Identidad, barrido de los 145 cuadros | final: **42/145 < 0,70**, mín **0,5855 en f042** (1,75 s, casi de perfil), mediana 0,7117 · crudo: 45/145 < 0,70, mín 0,5862 en f042, mediana 0,7092 · cada 6 cuadros: **17/25** ≥ 0,70 · final − crudo: diferencia máx 0,025, media +0,0004 → la edición no toca la identidad · tramo bajo: f036–f062 (1,50–2,63 s), 26 de 27 cuadros < 0,70 (f049 da 0,7006), más f069–f076 (2,88–3,21 s, parpadeo) |
| Golpe de zoom | ECC contra el crudo: ×1,0301 exacto en los cuadros 95–99, ×1,0000 fuera · SCRFD (ancho de cara): ×1,022 |
| Entradas cuadro a cuadro | tarjeta 1: diferencia contra el crudo 1,8 / 1,9 en f000–f001 (no está) → 32,2 en f002 (28 %) → 96,2 en f004 ✓ · tarjeta 2: 32,2 en f052 → 97,1 en f054 ✓ · sello: ancho de raya 799 / 701 / 641 / 615 px en f095–f098 = escala 1,299 / 1,14 / 1,042 / 1,00 ✓ · sello presente en f144 ✓ |
| Lectura (≥ 0,35 s/palabra + 0,3 s) | tarjeta 1: 2,083 s para 5 palabras (necesita 2,05) ✓ · tarjeta 2: 1,792 s / 4 (1,70) ✓ · sello: 2,083 s / 1 (0,65) ✓ |
| Contraste bajo el sello | fondo p90 crudo 188 → 223 · final 150 (f095, velo entrando) y **130** de f102 en adelante ✓ |
| Color | «Soy IA.» **(13,193,106)** y raya del sello **(15,193,107)** vs #10C26B (16,194,107) ✓ · cara/fondo vs crudo PSNR 41,4 dB, desvío medio RGB +1,2 / +0,4 / +1,0 |
| Ortografía leída en los cuadros | «Este video no fue grabado.» · «No existo. Soy IA.» (IA en mayúsculas, con punto) · «SEGUIME.» ✓ |
| Recorte 1:1 de la cara en el zoom máx | `renders/qa/cara-1a1-f097.png` (×1,545 sobre el 720p): blando pero sin bloques; pecas visibles |

## Decisiones tomadas al ejecutar

1. **Fades 0,15 s de entrada / 0,22 s de salida.** La instrucción dice «fade 0,22 s»; la receta (§ 9) dice entrada
   0,15 y salida 0,22, y así salieron L05 y L08. Se siguió la receta para que la serie sea una sola.
2. **«ancho 900» = ancho VISIBLE de la tarjeta 1**, y la tarjeta 2 usa la misma escala (letra 65,8 px en las dos).
   Centradas por lo visible, no por el PNG con su sombra.
3. **«y» = borde superior de lo visible.** En el sello, y=1170 es el borde superior de la letra sin rotar; rotada −5°
   la esquina sube a 1149.
4. **Tiempos cuantizados al cuadro**: 0,10 → 0,083 (cuadro 2) · 2,15 → 2,167 (52) · 3,95 → 3,958 (95).
5. **Sello**: 130 → 114 → 104 → 100 % en 3 cuadros (receta § 8) con opacidad 70 → 90 → 100 %, rotado −5° (antihorario,
   como `rotate(-5deg)` de CSS), blanco con raya verde (`keyword-marca`, como pide la instrucción).
6. **Velo oscuro debajo del sello (no estaba en la instrucción).** El sello blanco caía sobre el suéter crema y la
   vereda al sol (p90 > 200 desde el cuadro ~102) y se leía solo por la sombra. Se aplicó el criterio del velo de L08,
   pero solo desde el sello (3,96 s), no todo el video: las tarjetas son oscuras y no lo necesitan, y oscurecer los 6 s
   le saca a la hora dorada lo que la hace linda. Es además el «oscurecer el fondo en el CTA» de Santiago.
7. **Bug de cuadro encontrado y corregido en `build.mjs`** (calcado del de L05): `setpts=PTS-STARTPTS+3.958333/TB`
   da 94,99999 y ffmpeg lo trunca a 94, así que cada overlay arrancaba un cuadro antes. Arreglo:
   `setpts=…+round(t/TB)` + 0,2 s de cola en cada overlay (la ventana la fija `enable`). Las entradas se verifican
   cuadro a cuadro en `qa.py` (§ 11).
8. **Pops adelantados 0,116 s** para que el golpe suene en la entrada visual. El primero no se puede adelantar más
   (clamp a 0): suena a 0,117 s contra 0,083 s visual (34 ms, menos de un cuadro).
9. **Etiqueta bt709 en la base** (el clip Kling viene sin etiquetar; mismo arreglo que L05): el verde sale exacto y la
   cara queda a 41 dB del crudo.
10. **Sombra de las tarjetas: copia LOCAL de la plantilla, `assets/frase-card.html`** (corrección de la verificación
    del 2-oct). La plantilla de la skill no se tocó (fuera de esta carpeta). Cambian tres cosas, cada una medida:
    - **Aire de captura 80u arriba · 130u a los lados · 190u abajo** (la plantilla trae 40u en los cuatro lados). La
      corrección pedía 40 / 80 / 130 como mínimo; con eso la última fila todavía quedaba en alfa 1 (abajo, arriba e
      izquierda): la sombra llega con alfa ≥ 1 a 137u debajo del cuerpo, 91u a los lados y 44u arriba.
    - **`width: max-content` en `#stage`.** Con el aire nuevo, el `#stage` pasa los 1000 css del viewport de
      make-mockup y la frase se partía en DOS líneas (medido @2x: cuerpo 1750×316 → 1680×458 px). Con max-content
      queda en una línea, del mismo tamaño que antes (1750×316 y 1216×316).
    - **La sombra va en dos `<div>` con `filter: blur()`, no con `box-shadow`.** Con la captura más grande, el
      `box-shadow` de Chromium headless sale en mosaicos de 256 px con costuras (se ve una grilla en el alfa): un
      escalón de 11 niveles a +38 px debajo de la tarjeta y de 8 niveles a +24 px a la derecha (medido sobre gris 190
      a escala de lienzo) — o sea, otra línea recta sobre el suéter, más tenue. Los `<div>` reproducen los mismos
      parámetros de `--shadow` de make-mockup (0 46u 96u −24u .62 + 0 10u 26u .32, con σ = blur/2 como manda la spec
      de box-shadow): el perfil coincide (99 → 6,7 niveles en los primeros 100 px, contra 93 → 6,7 del box-shadow) y es
      liso.
    La posición no cambia: `prep-assets.py` centra por el cuerpo opaco (alfa > 240). Las cajas visibles se movieron
    1 px por redondeo (90 y 853 en vez de 91 y 852).
11. **El gate de identidad compara el puntaje SIN redondear.** `face_identity_qa.py` redondea a 3 decimales y en el
    render anterior un 0,6996 pasaba como 0,700. `qa.py` ahora recalcula el puntaje con las mismas piezas (SCRFD →
    cara más grande → ArcFace → coseno contra el centroide de R1–R8) y barre los 145 cuadros del final y del crudo
    (antes: cada 6 cuadros, sobre JPEG). El crudo da lo mismo que midió la verificación (45/145, mín 0,5862), lo que
    valida el método.

## Pendiente

- **OK de Sergio Urcullo** sobre la tabla de cortes y `renders/preview-360.mp4`.
- **Identidad: decide Sergio Urcullo.** No pasa el gate «≥ 0,70 en cada uno de los 5 cuadros»: **fallan 2 de 5**
  (1,50 s 0,6945 y 3,00 s 0,6300). En el render anterior la verificación midió 0,6996 y 0,6285, y 43/145 con mínimo
  0,576 en f043; re-encodear cambia los píxeles de la cara lo justo para mover el puntaje ±0,02, no la conclusión. El
  crudo da lo mismo (45/145 < 0,70, mín 0,5862): no es la edición, es el clip. En f036 mira a 3/4 hacia la derecha del cuadro, en
  f042 está casi de perfil y en f072 parpadea a 3/4 a contraluz (`renders/qa/caras-identidad.jpg`). Editando no se
  arregla: recortar o hacer zoom no cambia la identidad y el tramo bajo (1,50–2,63 s) cae en el medio del clip, mientras
  están las dos tarjetas. Opciones:
  (a) **excepción explícita para L02** con estos números: es la misma persona (negativos ≤ 0,224, mediana del clip 0,712,
  los otros 3 de los 5 cuadros dan 0,712–0,727) y los bajos son perfil o parpadeo del clip Kling; o
  (b) **rehacer el clip Kling** (pago): primero `higgsfield generate cost` y después su aprobación.
- **El velo no estaba en la instrucción**: confirmarlo al mirar el preview (si no gusta, sale editando `VELO` en
  `prep-assets.py` y re-renderizando).
- **La plantilla de la skill tiene el defecto de la sombra** (`.claude/skills/editor-videos/assets/html/frase-card.html`)
  y **L05 lo hereda** (`videos/lucia-l05/assets/card*.png`: última fila con alfa 54–55). Arreglarla ahí pide los tres
  cambios de la decisión 10, no solo el padding: con el padding solo, la frase se parte en dos líneas y el box-shadow
  sale con costuras de mosaico. No se tocó: no es de esta carpeta.
- **El sello tiene alfa 1–2 en sus bordes izquierdo y derecho** (`assets/sello-seguime.png`, sombra del texto de
  `keyword-marca`): sobre el velo es ≤ 1 nivel de luma, invisible; no se tocó.
- **El builder de L05 tiene el mismo bug de cuadro** (medido en `lucia-l05/final/l05.mp4`: la raya del sello mide 499 /
  455 / 439 / 437 px en los cuadros 58–61, o sea que entra al 114 % y el 130 % no se ve). L08 usa el mismo patrón
  `+${start}/TB` (sin medir). No se tocó: no es de esta pieza.
