# L05 · Lunes: cero llamadas para agendar

Reel 9:16 de 6,04 s, **sin voz** (el texto es la narración), b-roll Kling de Lucía + tarjetas + sello + 4 pops.
Costo: **0** (nada generado: el clip ya existía; tarjetas en HTML/CSS, SFX de la librería de HyperFrames).
Instrucción ejecutada: [`INSTRUCCION.md`](INSTRUCCION.md) · receta: `.claude/skills/editor-videos/SKILL.md` § «Reels de Lucía».

**Versión 2 (2-oct):** aplica las dos correcciones de la verificación — sombra de las tarjetas y del rótulo sin borde
duro, y tarjeta 3 recortada a «Tu cliente elige horario.» para cumplir el tiempo de lectura.

| Qué | Ruta |
|---|---|
| Final (gen1 + SFX, sin master) | `final/l05.mp4` (ignorado en git) · md5 `d4c7af1ab9d8dc0128f3754ff14185f1` |
| Feed (copia byte a byte del final) | `hermes-content/references/modelos/lucia/v4/feed/l05-lunes-link-de-reserva.mp4` (mismo md5) |
| Preview para el OK | `renders/preview-360.mp4` (360×640, CRF 28, 145 cuadros) |
| Hoja de cuadros con guías | `renders/qa-frames.jpg` |
| QA en números | `renders/qa/qa.json` · identidad: `renders/qa/identidad-l05.json` |
| Verificación de la corrección | `renders/verif-correccion/` (recortes 1:1 y ×3, saltos medidos, texto 1:1) |

**Estado: esperando el OK de Sergio Urcullo** sobre la tabla de cortes y el preview 360p. Sin ese OK no se publica.

## Tabla de cortes

El clip no se corta: arranca en caliente (la primera tarjeta entra a 0,083 s) y termina con Lucía mirando a cámara y
sonriendo, que es el remate visual. Lo que se recorta es texto.

| # | Me quedo con | Tiro | Por qué |
|---|---|---|---|
| 1 | Clip Kling entero, 0,000–6,042 s (145 cuadros) | Nada del clip | Sin tiempo muerto al inicio (cuadro 0 ya mira a cámara, la tarjeta entra en el cuadro 2) y el final es la sonrisa a cámara. No se congela ni se acelera. |
| 2 | «Tu cliente elige horario.» en la tarjeta 3 (4 palabras) | «el» de «Tu cliente elige el horario.» | 5 palabras piden 0,35 × 5 + 0,3 = 2,05 s y la tarjeta tiene 1,958 s (47 cuadros). Desempate de la instrucción: «si el texto queda apretado, se recorta texto». Con 4 palabras pide 1,70 s ✓. El pie ya dice «tu cliente elige el horario solo». |
| 3 | El mecanismo hasta «elige horario» | «…y aparece en tu agenda» | Sin voz: ≤ 6 palabras por tarjeta. La segunda mitad del mecanismo va en el pie («la cita aparece en tu agenda»). |
| 4 | Rótulo IA + tarjetas en código | Placas PIL de la versión del 1-oct | Regla del 1-oct: todo reel se edita con la skill; las placas PIL fueron rechazadas. |
| 5 | Tarjeta sin pantalla | Cualquier pantalla dibujada del link de reserva | La captura REAL no existe todavía (no hay cuenta demo). No se fabrica UI. |

Alternativa que **no** se aplicó (pide el OK de Sergio Urcullo porque mueve la tarjeta 3 0,142 s antes del storyboard):
dejar «el» y reacomodar tiempos — tarjeta 1 y rótulo con salida en el cuadro 45, tarjeta 2 del 45 al 95, sello del 58
al 95, tarjeta 3 del 95 al 145 (2,083 s cada una) y pops en `at` 0 / 1,759 / 2,301 / 3,842.

## Storyboard con los tiempos REALES del render (24 fps)

Tiempos de la instrucción cuantizados al cuadro más cercano. `y` = borde superior de lo visible. Cajas en coordenadas
1080×1920: «visible» = cuerpo opaco (sin sombra); «PNG» = el overlay entero con su margen de sombra (alpha 0 en el borde).

| Cuadros | t real (s) | Qué | Caja visible (x1,y1 → x2,y2) | PNG con sombra |
|---|---|---|---|---|
| 2–46 | 0,083 → 1,917 (sale a 1,958) | `tag-ia` «Lucía · personaje creado con IA» (pastilla de 477 px) | 301,730 → 778,795 | 256,685 → 824,840 |
| 2–46 | 0,083 → 1,917 | `frase-card` cejilla «LUNES» + «¿Cuántas llamadas para agendar?» (828 px visibles) | 126,850 → 954,1096 | 27,777 → 1053,1223 |
| 47–97 | 1,958 → 4,042 | `frase-card` «Con un link de reserva:» | 196,850 → 884,992 | 97,778 → 983,1118 |
| 58–97 | 2,417 → 4,042 | sello «CERO.» (`keyword-marca`, letra + raya de 455 px, −5°): 130 % → 114 % → 104 % → 100 % en los cuadros 58-61 | 310,1158 → 768,1381 (al 130 %: 241,1126 → 836,1416) | — |
| 58–62 | 2,417 → 2,583 | golpe de zoom +3 % (5 cuadros, ancla `top`) | ancho de cara medido 352,1–353,7 → 367,2–369,3 px (×1,039) | — |
| 98–144 | 4,083 → 6,000 (último cuadro; dura hasta 6,042) | `frase-card` «Tu cliente elige horario.» | 192,850 → 887,992 | 92,778 → 987,1118 |

Fades: entrada 0,15 s (el overlay arranca un cuadro antes con alpha 0: el cuadro de entrada ya se ve), salida 0,22 s;
la tarjeta nueva entra en el cuadro en que sale la anterior. Medido en la tarjeta 3: 25 % en el cuadro 98, opaca desde
el 101 (4,208 s). Todo el texto cae en la franja libre **714–1490** (mentón máx 670 en el final) y ningún texto toca los
80 px de la derecha bajo y=1000 (borde derecho máx 954); ahí sólo llega la cola de la sombra de la tarjeta 1, alpha ≤ 8/255.

**SFX** (`duck:false`): 4 × `pop`. El pop trae **0,116 s** de silencio antes del golpe (medido con librosa), así que
`at` = entrada visual − 0,116 (el primero se clampa a 0). Golpes medidos en el final: **0,117 · 1,959 · 2,417 · 4,084 s**
contra entradas visuales 0,083 · 1,958 · 2,417 · 4,083 s. Ganancias −10/−10/−8 (sello)/−10 dB.

## Comandos para regenerar (desde la raíz del repo)

```bash
P=videos/lucia-l05; ES=.claude/skills/editor-videos/scripts; HL=$P/assets/html
# 0) medir la cara en todo el clip (SCRFD) → franja libre
python3 $P/scripts/medir-cara.py $P/raw/l05-coworking-kling-07b938b2.mp4
# 1) assets (HTML/CSS → PNG alpha @2x) con las COPIAS L05 de las plantillas (margen de sombra completo)
node $ES/make-mockup.mjs --template custom --html-file $HL/tag-ia-l05.html --title "Lucía · personaje creado con IA" --accent "#10C26B" --width 1000 --out $P/assets/tag-ia.png
node $ES/make-mockup.mjs --template custom --html-file $HL/frase-card-l05.html --label "LUNES" --title "¿Cuántas llamadas para agendar?" --accent "#10C26B" --width 1000 --out $P/assets/card1-lunes.png
node $ES/make-mockup.mjs --template custom --html-file $HL/frase-card-l05.html --title "Con un link de reserva:" --accent "#10C26B" --width 1000 --out $P/assets/card2-link.png
node $ES/make-mockup.mjs --template custom --html-file $HL/frase-card-l05.html --title "Tu cliente elige horario." --accent "#10C26B" --width 1000 --out $P/assets/card3-horario.png
node $ES/make-mockup.mjs --template custom --html-file $HL/keyword-marca-l05.html --title "CERO." --accent "#10C26B" --width 1000 --out $P/assets/sello-cero.png
# 1b) gate de los PNG: alpha 0 en el borde y sin costuras internas en la sombra (exit 1 si falla)
python3 $P/scripts/check-png.py $P/assets/*.png
# 2) overlays a tamaño de lienzo (escala por ANCHO VISIBLE) + entrada del sello + layout.json
python3 $P/scripts/prep-assets.py
# 3) stills de cada entrada con el MISMO grafo (mirarlos antes del render)
node $P/scripts/build.mjs --stills 0,2,3,25,46,47,58,60,61,72,97,98,99,102,120,144
# 4) gen1 en UNA pasada (CRF 14 slow, bt709, aac 48 kHz en silencio)
node $P/scripts/build.mjs
# 5) SFX (plan: scripts/sfx-plan.json) → final → feed → preview
node $ES/sfx.mjs --video $P/renders/gen1.mp4 --plan $P/scripts/sfx-plan.json --out $P/renders/sfx.mp4
cp $P/renders/sfx.mp4 $P/final/l05.mp4
cp $P/final/l05.mp4 hermes-content/references/modelos/lucia/v4/feed/l05-lunes-link-de-reserva.mp4
ffmpeg -y -i $P/final/l05.mp4 -vf scale=360:640:flags=lanczos -c:v libx264 -crf 28 -pix_fmt yuv420p \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 -c:a aac -b:a 96k -movflags +faststart $P/renders/preview-360.mp4
# 6) QA (hoja con guías, YuNet, SCRFD, identidad, color, SFX, specs) → renders/qa-frames.jpg + renders/qa/qa.json
(cd $P && python3 scripts/qa.py)      # refs: env LUCIA_REFS (default: refs locales de la sesión de L08)
# 7) saltos de luminancia en los bordes de sombra (nuevo vs versión anterior, si se pasa)
(cd $P && python3 scripts/medir-bordes.py final/l05.mp4)   # → stdout: horizontales · stderr: laterales
```

Sin master a −14 LUFS: sin voz, `loudnorm` subiría los pops a nivel de voz (instrucción §ORDEN 4).

## QA (medido sobre `final/l05.mp4`, md5 `d4c7af1ab9d8dc0128f3754ff14185f1`)

| Chequeo | Resultado |
|---|---|
| Specs | h264 High 1080×1920, 24 fps, 145 cuadros, yuv420p, bt709 (matriz/primarios/transferencia), aac LC 48 kHz estéreo, `+faststart` (moov antes de mdat) ✓ · 10,6 Mbps de video |
| Duración | video 6,042 s · audio 6,058 s (relleno del último cuadro AAC, 16 ms) |
| Audio | −30,9 LUFS integrado · pico **−11,2 dBTP** (tope −3) ✓ |
| **Bordes de sombra (corrección 1)** | Los 5 PNG: alpha máx **0** en filas y columnas exteriores y **0 costuras internas** (`scripts/check-png.py`). Salto de oscurecimiento de 1 px en el video, x=300/600/850: y=1133 (f024) **2,0/1,3/1,4** (antes 42,7/46,9/26,0) · y=1028 (f072) **0,1/1,0/0,6** (antes 46,1/47,7/27,6) · y=1028 (f120) **0,6/1,4/1,1** (antes 48,1/47,3/41,6) · rótulo y=816 **0,4/0,3/−0,4** (antes 12,6 en x=600) · bordes nuevos del PNG (y=1118/1223/840) ≤ 2,0. Lados viejos (x=90/990/160/921/128/952): ≤ 0,7 (antes hasta 7,2). Mirado: `renders/verif-correccion/bordes-sombra-1a1.png` y `zoom-sombra-x3.png` — la sombra se desvanece sin borde. |
| **Lectura (corrección 2)** | tarjeta 1: 1,875 s / 4 palabras de frase (pide 1,70) ✓ — contando la cejilla «LUNES» serían 5 (2,05): tiempos y cejilla los fija la instrucción, queda a ojo de Sergio Urcullo · tarjeta 2: 2,125 s / 5 (2,05) ✓ · sello 1,667 s / 1 ✓ · **tarjeta 3: 1,958 s / 4 (1,70) ✓** |
| Caras YuNet | crudo 145/145 cuadros con 1 cara · final 145/145 · 0 cuadros distintos ✓ |
| Texto vs cara | mentón máx 670 (SCRFD, final, cuadro 28) < 714 ✓ · texto entre 730 y 1416 (sello al 130 %) < 1490 ✓ · borde derecho del texto máx 954 < 1000 ✓ |
| Identidad (ArcFace, centroide de R1-R8) | 0,50 s **0,786** · 1,50 s **0,805** · 3,00 s **0,751** · 4,50 s **0,797** · 6,00 s **0,813** (≥ 0,70 ✓; negativos máx 0,224; refs leave-one-out mín 0,698) |
| Color | verde de la raya en el final (decodificado bt709) **(15,193,107)** vs #10C26B (16,194,107) ✓ · piel/fondo vs crudo PSNR 42,0 dB, desvío medio RGB +1,3/+0,3/+1,1 |
| Ortografía leída en los cuadros | «Lucía» (tilde), «LUNES», «¿Cuántas llamadas para agendar?» (¿ de apertura + tilde), «Con un link de reserva:», «CERO.», «Tu cliente elige horario.» ✓ (`renders/verif-correccion/texto-1a1.png`) |
| Recorte 1:1 de la cara en el zoom máx | `renders/qa/cara-1a1-f060.png`: blando pero sin bloques; pecas visibles |

## Decisiones tomadas al ejecutar

1. **Una sola escala para las tres tarjetas de frase**, la que deja la tarjeta 1 en **828 px visibles** (factor 0,45
   sobre el PNG @2x): la letra mide 57,6 px en las tres. **Desde la v2 se escala por el ANCHO VISIBLE** (cuerpo opaco),
   no por el del PNG: el PNG ahora trae el margen de sombra entero y escalarlo a un ancho fijo achicaba la letra. Igual
   para el rótulo (pastilla 477 px) y el sello (letra + raya 455 px): las cajas visibles quedaron iguales a la v1 (±1 px; la tarjeta 3 cambia porque cambió el texto).
2. **`y` = borde superior de lo visible** (tarjeta, pastilla, letra del sello), no del PNG con su margen de sombra.
3. **Tiempos cuantizados al cuadro más cercano** (0,10→0,083 · 1,95→1,958 · 2,40→2,417 · 4,10→4,083).
4. **La tarjeta 3 no se desvanece al final**: queda hasta el último cuadro (1,958 s). Con el texto recortado a 4
   palabras cumple la regla (pide 1,70 s). Se eligió recortar «el» (desempate de la instrucción) y no reacomodar
   tiempos, porque eso adelanta la tarjeta 3 respecto del storyboard y necesita el OK de Sergio Urcullo.
5. **Sombra sin borde duro (corrección 1).** Copias de las plantillas en `assets/html/*-l05.html` (la skill no se toca
   desde esta pieza). `frase-card-l05.html`: `#stage` con padding **80u / 110u / 140u** (arriba / lados / abajo). La
   verificación pedía 90u a los lados; con 90u la cola del desenfoque dejaba alpha **1/255** en la columna exterior, así
   que se subió a 110u para cumplir «alpha = 0» en todo el borde. Además `width: max-content`: con ese padding el
   `#stage` no entraba en el viewport de 1000u y el inline-block angostaba la tarjeta (cambiaba el corte de línea).
   `tag-ia-l05.html`: padding 60u. `keyword-marca-l05.html`: lados 60u (el text-shadow pasaba 4u el padding de 30u y
   dejaba alpha 1–2 en los costados del sello; no lo pedía la verificación, se corrigió por lo mismo).
6. **Sombra dibujada con `filter: blur()` y no con `box-shadow`** (encontrado al mirar el PNG nuevo, no lo pedía la
   verificación). Con el margen más grande, el `box-shadow` de Chromium salía con **costuras rectas dentro de la sombra**
   en los bordes de sus tiles de 254 px (tarjeta 3, fila 508→509: alpha 93→86 en la columna 1000 y 70→65 en la 300): sobre la
   camisa blanca se leían como otro borde de rectángulo. La v1 también las tenía (fila 509 de la tarjeta 1, columnas
   1525/1779 de las tarjetas 2 y 3), tapadas en parte por el corte. Se reemplazó por dos capas con la MISMA sombra
   (`0 46u 96u −24u .62` + `0 10u 26u .32` → `blur(48u)` y `blur(13u)`): la sombra queda en promedio +3–4 niveles de alpha
   sobre la original (p99 +13, apenas más oscura junto al cuerpo); el cuerpo de la tarjeta es idéntico (dif. media 0,005;
   sólo cambia el antialias de las esquinas, donde ahora hay sombra debajo).
   `scripts/check-png.py` detecta las dos cosas (borde y costura) y corta el pipeline si aparecen.
7. **Sello: entrada 130 % → 100 % en 3 cuadros** (receta §8) con opacidad 70 % → 90 % → 100 %, rotado −5°, blanco con
   raya verde (`keyword-marca`). Sobre la camisa blanca se lee por la sombra de la plantilla; se miró en los cuadros 58-97.
8. **Pops adelantados 0,116 s** para que el golpe suene en la entrada visual (el archivo trae silencio antes).
9. **Etiqueta bt709 en la base**: el clip Kling viene sin etiquetar y el `scale` final convertía 601→709 todo el
   cuadro (verde salía (30,219,110)). Con la etiqueta, el final reproduce el crudo leído como HD/bt709.

## Pendiente

- **OK de Sergio Urcullo** sobre la tabla de cortes y `renders/preview-360.mp4` (incluye el recorte «elige horario»).
- **Guion:** `hermes-content/docs/cola/lucia-diario/S1-GUIONES.md` § L05 todavía dice «Tu cliente elige el horario.»;
  hay que dejarlo como «Tu cliente elige horario.» (fuera de la carpeta de esta pieza: lo hace el orquestador).
- **Plantillas de la skill con el mismo defecto:** `.claude/skills/editor-videos/assets/html/frase-card.html` (padding
  40u corta la sombra + costuras del `box-shadow`), `tag-ia.html` (28u) y `keyword-marca.html` (30u a los lados). L02 y
  L08 las usan: probablemente tienen el mismo rectángulo. El arreglo probado está en `assets/html/*-l05.html`.
- **Captura REAL del link de reserva** (la pide la madre; hoy no hay cuenta demo): entra en la tarjeta 3 con crédito
  «pantalla real de Onia».
- **Decisión de voz** (hoy sin voz, por instrucción).
- Artefacto del propio clip Kling: bloques en el pelo arriba de la cabeza (≈ 0,5–3 s), viene así del crudo.
