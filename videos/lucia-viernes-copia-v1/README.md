# Viernes · «Casi publico este 0,83» (El error de la semana)

Reel corto del viernes (PLAN.md §4-bis), MUDO, 1080×1920, 24 fps, **360 cuadros / 15,0 s**, con HyperFrames. **0 créditos**, solo material que ya existía: la imagen «café con teclado» de Kling O1 Image (K4, `img-omni-image-k4cafe-dad464de.png`, 1536×2720) y la foto de entrada R3 (`R3_casi_frontal.png`, 1792×2400). La compuso y la renderizó la sesión Lucía (editor, contenedor Linux) el 11-oct-2026 partiendo de la estructura de `videos/lucia-p9-luz-cara` (build que valida cifras contra las fuentes, gates, mutaciones) y de las fotos fijas de G4 v2. Sin Git, voz, publicación, instalaciones ni descargas. Fuera de esta carpeta no se tocó nada.

<!-- ESTADO -->
**MASTER v1 RENDERIZADO, PENDIENTE DE REVISOR Y VERIFICADOR Y DE «mostrada, publicá el viernes».** Todos los gates en verde (exit 0). No es aprobación visual ni permiso de publicar. Sigue MUDO: la voz no existe; `guion-voz.txt` es un cronograma estimado a 17 car/s (ver «Voz futura»).
<!-- FIN ESTADO -->

## Master

| Dato | Valor |
|---|---|
| Archivo | `out/viernes-copia-final-1080x1920.mp4` (`out/` y `renders/` no van a git) |
| SHA-256 | `ae3a3d42f6c9f333916a6dbfb0c79df19cc3fbfad1b0c1d4a7db580ac2a0cabd` (`qa/sha-master.txt`) |
| Video | H.264 High, yuv420p, bt709, 1080×1920, 24 fps, 360 cuadros, 15,000 s |
| Audio | AAC LC 48 kHz estéreo, SILENCIO: volumedetect mean −91,0 dB / max −91,0 dB (`qa/aac-silencio.txt`) |
| Tamaño | 2,0 MB (2.083.559 bytes) (el contenido es casi todo estático: ≈ 1,1 Mb/s de video) |
| `index.html` | md5 `488d04d1a3e4f47df1829d881289d033`, idempotente (dos builds, mismo md5; `qa/idempotencia.txt`) |
| Fuentes | `assets/k4.png`, `assets/k4-panel.png` (enlace al mismo archivo, para que `hyperframes check` no marque dos `<img>` iguales) y `assets/r3.png`; el build exige su SHA-256 (K4 `2a2e9401…7200`, R3 `0dc08193…f756`) y su tamaño. Los PNG originales no van a git: K4 se recupera a 0 cr con `job_display dad464de-75a8-45f5-b799-8d91e5a63d1d` → `rawUrl`, R3 está en `videos/lucia-g4-v2/assets/refs-orig/` |
| Render | `hyperframes@0.8.142` (caché de npx; `--prefer-offline`), `--quality high -f 24`, ≈ 40 s de pared; captura por pantallazo (Chromium completo, sin GPU); preview 360p real ≈ 25 s |

## La historia (nada inventado; cada cifra la valida el build contra su fuente)

- **El error.** En la prueba de G4/C2 la imagen «café con teclado» de Kling O1 Image dio **parecido 0,83** con Lucía (PROCEDENCIA.jsonl l.97, `imagen_misma_escena_K1_mismas_6_refs` → `kling_omni_image_K4cafe_dad464de`, 0,5 cr). Casi se publica como prueba de que ese motor conserva su cara.
- **Pero** esa imagen es casi una copia de una de las fotos que recibió como entrada, **R3**: misma pose (la cabeza apoyada en la mano), misma ventana, misma taza de barro junto a la laptop, con otra ropa. Esto lo miró el editor a ojo (ver «Decisiones», 4): los aros del video marcan lo que se ve, no se midió.
- **Foto por foto** (`medicion-sin-refs-entrada-20261011.txt`, PRUEBA ESTRICTA PARA LOS MOTORES DE IMAGEN, fila «Kling O1 Image K4»): con **R3 sola 0,927** («0,93»); con las otras siete R1 0,686 · R2 0,619 · R4 0,563 · R5 0,724 · R6 0,659 · R7 0,733 · R8 0,599 (**0,56 a 0,73**). De las **80** comparaciones por foto de las 10 imágenes de esa tabla, la de K4·R3 es la más alta; la siguiente es 0,812.
- **Qué recibió.** Los motores de imagen de la prueba recibieron como entrada las mismas seis imágenes: R1, R3, R6 y R7 (cuatro de las 8 con que se compara), una selfie y una referencia de ropa. Por eso el número absoluto (contra el promedio de las 8) sale inflado, y **no hay control sin entradas** para decir cuánto.
- **Solo con las 4 fotos que nadie recibió (R2, R4, R5, R8): 0,743** («0,74»), la cara de K4 mide 677 px (≥ 200: confiable). **Ojo:** con 4 fotos el promedio puntúa más bajo que con 8 en las 10 imágenes (de 0,03 a 0,09; en K4, 0,088), así que el 0,74 **no «corrige» el 0,83**: es otra medición, y sigue sobre el piso de 0,70. El build lo valida (B* − A < 0 en las 10) y el pie lo dice.
- **Una escena, una toma** (en el pie): el mismo motor dio 0,79 (K1) y 0,35 (K2 café: perdió la cara) en otras dos escenas.

## Línea de tiempo y pantalla

| Tiempo | Qué se ve | Texto en pantalla |
|---|---|---|
| 0,00–3,00 (s1) | K4 a pantalla completa, fija. Cuadro 0: rótulo y título | rótulo «Lucía Antelo · personaje IA de Onia» (40 px, y 1190) · título **«Casi publico este 0,83.»** (66 px, cuadro 0) · **0,5 s:** «Kling O1 Image · parecido 0,83» (el primer número, antes de 3 s) · acento 1,75 s |
| 2,75–3,00 | empuje rígido de 6 cuadros | s1 sale a −1080, s2 entra de +1080 |
| 3,00–6,625 (s2) | K4 (izquierda) y R3 (derecha) lado a lado, recortadas al mismo alto, caras visibles (238 y 270 px) | «Kling O1 Image» · **3,0 s «Mirá la foto que recibió.»** · **4,5 s «Misma pose, ventana, taza.»** con tres aros que se dibujan en las dos fotos: pose 4,5 s · ventana 5,25 s · taza 6,0 s |
| 6,375–6,625 | empuje rígido de 6 cuadros | |
| 6,625–15,0 (placa) | gráfico 0 a 1 con el piso 0,70 | **6,625 s «Con esa foto: 0,93»** (barra) · **7,5 s «Con las otras siete: 0,56 a 0,73»** (siete puntos, uno por foto) · **8,25 s «Casi copia: no prueba identidad.»** · **9,25 s «Con las 4 que no recibió: 0,74»** · **10,375 s «Mirá el parecido foto por foto.»** · **12,375 s CTA «Seguime: cada semana, una prueba.»** (2,625 s) |

Eventos (`plan.json → eventos`): 20, hueco máximo 1,375 s. Zona segura: la pila de texto de s1 está bajo el mentón (mentón y 803, texto desde 1190, termina 1474); s2, texto de 1270 a 1478; placa, de 380 a 1390; nada sobre y 292 ni bajo 1490. Fuentes de marca locales (Bricolage Grotesque 700, DM Sans 500, Spline Sans Mono 500), ningún texto bajo 34 px.

## Decisiones (y cómo revertirlas)

1. **«Casi copia: no prueba identidad.» en vez de «Era copia, no identidad.»** El encargo traía lo segundo. Lo dejé así porque (a) la imagen no es una copia pixel a pixel (ropa, pelo, una segunda taza blanca con vapor al frente, encuadre), solo casi; y (b) «no era identidad» sobreafirma: sin las 4 fotos recibidas la imagen sigue en 0,74 (> 0,70). Lo que sí se sostiene: una imagen que casi copia una foto de entrada **no prueba** que el motor conserve la identidad. Revertir = `plan.json → textos.nota_copia`, la voz (L6), `build.mjs → esperado` y la mutación; `grep-prohibidas` rechaza «era copia, no identidad».
2. **El piso 0,70 va en el gráfico como referencia, pero el pie aclara que es del promedio de las 8 fotos** (`face-gate`: centroide). Los puntos «foto por foto» son cosenos contra UNA foto y salen más bajos que cualquier promedio, así que no se comparan con ese piso; en pantalla solo lleva «piso 0,70». Si el revisor lo prefiere sin la marca: quitar `piso` de `build.mjs` (marca, escala y `layout-dom` la miden).
3. **«Con las 4 que no recibió: 0,74» sin decir «baja a»:** es un hecho (cosenos, la medición), no una corrección; el pie explica que con 4 fotos todo puntúa más bajo (los 10 casos), y que no hay control limpio, así que no se estima la magnitud del sesgo (la misma regla que P9: nada de «efecto/ventaja ≈ 0,03», rechazado por el build y las mutaciones).
4. **Pose, ventana, taza:** miradas a ojo con los aros; no se midieron. «Misma taza» es la de barro junto a la laptop (K4 suma otra, blanca, al frente). La laptop también coincide (no se rotula: la voz y el texto piden tres cosas; el pie la nombra). K4 muestra a Lucía de ambo (canon: es vestuario, `LUCIA.md` §0; el rótulo dice «personaje IA» y ningún texto habla de profesión).
5. **R3 no se nombra en pantalla** («esa foto», «la foto que recibió»); el pie sí («la R3», R1 a R8).
6. **«Una escena, una toma: es una prueba, no una regla» solo en el pie**, no en pantalla (no hay ranking que neutralizar; la placa ya lleva 37 palabras). Si el revisor lo quiere en pantalla: +5 palabras de lectura en la placa.
7. **Texto de s1 bajo el mentón** (y 1190-1474), no arriba como en P9: la cara de K4 ocupa y 201-803 del lienzo y un rótulo en y 300 taparía la frente. Cubre parte de la taza blanca, no la cara.
8. **Fotos con alto y ancho enteros** en los paneles (K4 540×956, R3 657×880: Chromium alinea al píxel de todas formas) para comparar el master contra la foto escalada pixel a pixel.
9. **Sin modo `--estatico`** en los gates (P9 lo tenía para el contenedor de Codex): aquí todos corren en Chromium real.
10. **Aros con `stroke-linecap: butt`:** con remate redondo un aro sin dibujar dejaba un punto naranja visible en el cuadro 72 (lo vio el editor en el primer master; se corrigió y se volvió a renderizar).

## Voz futura (no se genera): cronograma estimado a 17 car/s

`guion-voz.txt`: 8 líneas, **223 caracteres con saltos** (cupo de voz 381; 15 s a 17 car/s admiten ≈ 255), sin cifras habladas. Se ajustó el texto del encargo para que el cronograma cuadre (el encargo daba 267 caracteres: no cabían en 15 s con el CTA ≥ 2,4 s):

| Línea | Texto | Voz (s) | Pantalla que cae con ella |
|---|---|---|---|
| L1 | Casi publico esta imagen. | 0,00–1,47 | título (cuadro 0) |
| L2 | Parecía Lucía. | 1,71–2,53 | (acento del dato) |
| L3 | Mirá la foto que recibió. | 2,75–4,22 | empuje a R3 + «Mirá la foto que recibió.» (3,0 s, +0,25) |
| L4 | Misma pose, ventana y taza. | 4,46–6,05 | «Misma pose, ventana, taza.» + primer aro (4,5 s, +0,04) |
| L5 | Con esa foto, mucho más alto. | 6,29–8,00 | placa + «Con esa foto: 0,93» (6,625 s, +0,33) |
| L6 | Casi copia: no prueba identidad. | 8,21–10,09 | «Casi copia…» (8,25 s, +0,04) |
| L7 | Mirá el parecido foto por foto. | 10,33–12,16 | lección (10,375 s, +0,04) |
| L8 | Seguime: cada semana, una prueba. | 12,375–14,32 | CTA (12,375 s, +0,00); cola sin voz 0,68 s (el único hueco ≥ 0,3 s) |

Cambios respecto de la propuesta del encargo: «Parecía de Lucía. Pero mirá la foto que recibió.» → L2 «Parecía Lucía.» + L3; «Misma pose, misma ventana, misma taza.» → «Misma pose, ventana y taza.»; «Se parece muchísimo a esa foto y bastante menos a las otras.» (60) → «Con esa foto, mucho más alto.» (29); «No era identidad: era una copia.» → «Casi copia: no prueba identidad.» (decisión 1). Con voz real: generar y medir cada pista, escribir `duraciones.json`, correr `node scripts/voz.mjs` y `node scripts/retemporizar.mjs` (fallan si una línea se sale de su entrada ±0,5 s o si el CTA queda bajo 2,4 s) y corregir `plan.json → eventos` (campo `voz`). La pronunciación de «Kling» por la voz Marcela no se midió. Quedan 158 caracteres de cupo para una retoma.

## Lo que se vio (preview 360p real y master)

Mirado: preview 360p real (3 hojas de 10 cuadros a 2 fps = los 30 cuadros, `qa/preview-360p-hoja-*.jpg`) antes del master; del master, las mismas 3 hojas y la de 32 cuadros (`qa/contacto-2fps*.jpg`) y a resolución completa, del master final, los cuadros 0, 72 (fin del empuje a R3), 110 (aro de pose) y 359 (CTA); los cuadros 162, 200, 300 y 305 (barra, fila de las otras siete, lección y CTA entrando) se miraron a resolución completa en el primer master y no cambiaron (las dos diferencias posteriores son el punto del cuadro 72 y la elipse de pose de R3). Los ocho están en `qa/cuadros/` (del master final).

- **Cuadro 0:** K4 a pantalla completa, rótulo (40 px) y título «Casi publico este 0,83.»; el dato todavía no está (entra a 0,5 s). Cara entera y limpia.
- **Empuje 1 (2,75–3,0 s)** y **empuje 2 (6,375–6,625 s):** sin tiras vacías ni solapes; el último cuadro de s2 muestra «aza.» saliendo por la izquierda mientras entra la placa.
- **Escena 2:** las dos caras (238 y 270 px) a la vista, aros sobre mano, ventana y taza; ningún texto toca la cara. El aro de pose cruza un poco la manga de R3 y el de la taza queda pegado al borde izquierdo de R3 (coherente con la foto).
- **Placa:** la barra de 0,93 crece a 0,6 s, los siete puntos aparecen de a uno sobre la pista de las otras siete (se tocan: R4, R8 y R2 están a 17-31 px entre sí), la marca del piso cruza las tres filas.
- **Defecto hallado y corregido:** un punto naranja suelto en el cuadro 72 (aro sin dibujar con remate redondo), ver decisión 10.
- **Observaciones sin corregir:** (a) la mitad de abajo de la placa (y > 1390) y la franja de arriba de las escenas 2 y la placa (y < 370) quedan vacías (zona de la interfaz de Instagram); (b) la coma de la fuente mono se ve separada en «0 , 93» (igual que P9); (c) los tiles tienen el fondo del color de la pantalla: solo se ven como tarjeta cuando entra el acento; (d) lectura de la placa: 37 palabras en 8,4 s (4,5 palabras/s; en orden estricto 15,4 s contra 8,4 s: cada ventana individual se cumple y la voz cubre el resto; alternativas: quitar la fila de las 4, o la escala «0 · piso 0,70 · 1»).

## Gates y evidencia (exit codes en `qa/RESUMEN-gates.txt`; `bash scripts/correr-gates.sh [--master]`)

| Gate | Exit | Resultado |
|---|---:|---|
| `build.mjs` SIN flag (×2) | 0 / 0 | datos y pie validados contra PROCEDENCIA l.97 y la medición sin refs de entrada (10 imágenes, 80 comparaciones, B* − A < 0 en las 10); fotos con su SHA-256; voz 223 caracteres (cupo 381), 360 cuadros; pie 1.918 caracteres (tope 2.200); idempotente |
| `master-ready.mjs` | 0 | fuentes completas, SHA de K4 y R3 |
| `voz.mjs` / `retemporizar.mjs` | 0 / 0 | ESTIMADA a 17 car/s; pausas 0,211-0,245 s; L3 empieza con el empuje; CTA 2,625 s; tabla en `qa/alineacion-voz.txt` |
| `ventanas.mjs` | 0 | 12 textos, cada uno con su ventana desde su propia entrada (0,35 s/palabra + 0,3 s); mínimos: tile2 1,917 s (pide 1,7), dato 2,292 s (pide 2,05), CTA 2,583 s (pide 2,4) |
| `hueco-tarjetas.mjs` | 0 | 0 de 360 cuadros sin tarjeta |
| `eventos.mjs` | 0 | 20 eventos (entradas, aros que se dibujan, barra, empujes, acentos): cada uno cambia algo visible; hueco máximo 1,375 s |
| `aire.mjs` | 0 | quieto fuera de lectura 0,167 s (tope 0,3) en el DOM; 0,167 s en píxeles (`qa/aire-pixeles.txt`); sin exención 0,5 s |
| `costuras.mjs` | 0 | 2 costuras de 6 cuadros, separación 0,000 px, los tiles viajan con su escena |
| `medir-dom.mjs` | 0 | 1.238 cajas / 360 cuadros, 0 fallos (zona segura, ≥ 34 px, sin solape, sin texto sobre la cara +40 px, rótulo a 40 px en el cuadro 0, dato antes de 3 s, CTA ≥ 2,4 s) |
| `layout-dom.mjs` | 0 | alturas, huecos, líneas (CTA «Seguime: cada semana, / una prueba.»), borde inferior máximo 1478,4; barras y puntos coinciden con los datos (±0,004) |
| `grep-prohibidas.mjs` | 0 | 0 coincidencias en pantalla, pie y voz |
| `node /home/user/onia-hermes/scripts/lucia-prohibidas.mjs pie.txt guion-voz.txt qa/pantalla.txt` | 0 | 0 coincidencias |
| `validar-mutaciones.mjs` | 0 | **67** alteraciones rechazadas por el motivo esperado (0,83 / 0,93 / 0,74 / 0,73 / 0,56 cambiados; título «Era copia, no identidad.»; pie sin «Una escena, una toma», sin la apertura de IA, sin «Nombro lo que uso», con «≈ 0,03», «dentro del ruido», «ventaja», «el mejor»; sin R1, R3, R6 y R7; sin 0,79 y 0,35; voz con cifras o desalineada; orden de entrada y de pila; aro fuera del panel; SHA de las fotos; CTA sin `balance`…) y las escrituras del build quedan bloqueadas durante la prueba |
| `verificar-auditor.mjs` | 0 | regresión del reporte |
| `hyperframes check` (0.8.142) | 0 | 0 errores · 3 avisos `nested_structure_needs_subcomposition` (no frenan) · layout 0 problemas / 9 muestras · runtime 0/0 · motion 0/0 · contraste 29/29 AA |
| preview 360p real | 0 | `qa/viernes-preview-360p.mp4`, 360×640, 24 fps, 360 cuadros, 15,000 s; mirado antes del master |
| render high + mux AAC | 0 / 0 | ver «Master» |
| `pixeles.mjs psnr-fotos` | 0 | mínimo **36,99 dB** (umbral 35): K4 pantalla completa 41,34 · panel K4 39,21 · panel R3 36,99 (la alineación es exacta, desplazamiento 0,0 px; la diferencia es el escalador de Chromium y el color bt709 sobre una foto de mucho detalle) |
| `pixeles.mjs vacios` / `aire` | 0 / 0 | 360 cuadros, 0 planos; quietud en píxeles 0,167 s |
| Zona segura en píxeles | 0 | placa y y 380-1389, x 80-999 (51 cuadros); escena 2: nada sobre el panel (y < 370), contenido bajo el panel hasta y 1477 (`qa/zona-segura-pixeles.txt`) |
| ArcFace master ↔ fuente (`face-gate.sh`, 9 pares) | 0 | diferencia máxima **0,006** (regla ≤ 0,02): B1 0,831/0,830/0,831 contra 0,825 de la foto a pantalla completa; panel K4 0,835-0,836 contra 0,838; panel R3 0,833-0,834 contra 0,832 (`qa/arcface-pares.json`) |
| Identidad del master (`face-gate.sh` + `lucia-qa-tabla.mjs`) | 0 / 0 | 8 cuadros, 0 bajo el piso 0,70, 0 sin cara, 0 con cara < 200 px (479, 264-270 y 238 px): `qa/arcface-master.json`, `qa/qa-tabla.md`; `leave_one_out_min` 0,698 |
| `node --check` (22 scripts .mjs/.js), `bash -n` (2), `py_compile` (1) y UTF-8 | 0 | `qa/sintaxis.txt`, `qa/utf8.txt` |

Dato lateral (no va a pantalla): R3 medida contra el promedio de las 8 (que la incluye) da 0,834, igual que K4 (0,831): la imagen puntúa como la propia foto de referencia.

## Cómo reproducir

Desde `videos/lucia-viernes-copia-v1/`. `hyperframes@0.8.142` ya está en la caché de npx de este contenedor (con `--prefer-offline` no descarga nada). Todo render va bajo `flock /tmp/hf-render.lock`, como proceso hijo directo.

```bash
export PRODUCER_HEADLESS_SHELL_PATH=/opt/pw-browsers/chromium HYPERFRAMES_SKIP_SKILLS=1
export PLAYWRIGHT_MODULE=/opt/node-tools/node_modules/playwright
export FACE_GATE_HOME=…/lucia-face-gate     # fuera del repo (venv con onnxruntime + modelos ya existentes)
$FACE_GATE_HOME/venv/bin/python -I scripts/caras-fotos.py > qa/caras-fotos.json    # SCRFD sobre K4 y R3
node scripts/build.mjs                    # SIN flag; valida cifras, textos, pie y voz; copia fuentes locales y fotos; escribe index.html y qa/tiles.json (--escribir-pie reescribe pie.txt desde las cifras)
bash scripts/correr-gates.sh              # todos los gates sin master; deja qa/RESUMEN-gates.txt
node scripts/borrador-360.mjs && (cd renders/draft360 && flock /tmp/hf-render.lock npx --prefer-offline -y hyperframes@0.8.142 render --quality draft -f 24 -o ../../qa/viernes-preview-360p.mp4)   # preview 360p REAL: mirarlo antes del master
node scripts/master-ready.mjs && flock /tmp/hf-render.lock npx --prefer-offline -y hyperframes@0.8.142 render --quality high -f 24 -o renders/final-raw.mp4
ffmpeg -y -i renders/final-raw.mp4 -f lavfi -t 15 -i anullsrc=r=48000:cl=stereo -map 0:v -map 1:a -c:v copy -c:a aac -b:a 128k -shortest -movflags +faststart out/viernes-copia-final-1080x1920.mp4
sha256sum out/viernes-copia-final-1080x1920.mp4 > qa/sha-master.txt
bash scripts/correr-gates.sh --master     # además psnr-fotos, vacios y aire sobre el master
node scripts/zona-segura-pixeles.mjs      # zona segura medida en píxeles
bash scripts/recortes-arcface.sh out/viernes-copia-final-1080x1920.mp4 <carpeta> && (cd ../.. && FACE_GATE_OUT=…/qa/arcface-pares.json bash .claude/skills/lucia/scripts/face-gate.sh $(cat <carpeta>/args.txt))   # 9 pares master ↔ fuente
(cd ../.. && FACE_GATE_OUT=videos/lucia-viernes-copia-v1/qa/arcface-master.json bash .claude/skills/lucia/scripts/face-gate.sh 'videos/lucia-viernes-copia-v1/out/viernes-copia-final-1080x1920.mp4@0,1,2.5,3.5,4.2,5.5' <recortes de los paneles>) && node scripts/lucia-qa-tabla.mjs videos/lucia-viernes-copia-v1/qa/arcface-master.json > videos/lucia-viernes-copia-v1/qa/qa-tabla.md
```

El render no es reproducible bit a bit entre máquinas (el `index.html` sí). En este contenedor, dos renders del mismo `index.html` dieron el mismo SHA.

## Dudas abiertas y qué falta

1. **Revisor y verificador:** los pone la madre. Ningún resultado de este README es aprobación visual ni permiso de publicar («mostrada, publicá el viernes»). Falta copiar el master a `videos/lucia-entrega/` cuando se apruebe.
2. **Voz: NO existe** (cronograma estimado; ver arriba). Cupo de voz: 223 de 381.
3. **Decisión 1** («Casi copia: no prueba identidad.») y **decisión 2** (el piso 0,70 junto a cosenos por foto) son las dos que más conviene que revise la madre: la primera cambia el texto pedido; la segunda puede leerse como «cinco de las siete fotos están bajo el piso», que no es lo que dice la medición.
4. **El 0,74 puede leerse como «sin las fotos recibidas igual pasa el piso»** (es cierto) y debilitar el «casi copia». Está dicho con su aclaración en el pie; en pantalla no cabe más. Alternativa: quitar la fila de las 4 (−6 palabras) y dejar el 0,74 solo en el pie.
5. **Pose, ventana, taza** miradas a ojo, no medidas; la imagen no es pixel-copia (decisión 4).
6. **Instagram:** no se simuló la interfaz; a 390 px de ancho el texto de 34 px (escala) queda en ≈ 12 px y los de 42-50 px en ≈ 15-18 px.
7. **Densidad de la placa:** 37 palabras en 8,4 s (4,5 palabras/s), menor que P9 (5,5); en orden estricto no cabe sin la voz.
8. Los PNG originales de K4 y R3 no están en git (los ignoran sus carpetas): el build falla con un mensaje claro si faltan o si su SHA cambia.
9. El render se hizo en modo «screenshot» (el Chromium completo no expone `HeadlessExperimental`): PSNR ≥ 36 dB y ArcFace ≤ 0,006 muestran que no degradó la imagen.
10. `qa/viernes-preview-360p.mp4` y las hojas son evidencia: no son para publicar.
