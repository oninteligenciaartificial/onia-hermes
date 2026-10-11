# Viernes · «Casi publico este 0,83» (El error de la semana) — v2

Reel corto del viernes (PLAN.md §4-bis), MUDO, 1080×1920, 24 fps, **360 cuadros / 15,0 s**, con HyperFrames. **0 créditos**, solo material que ya existía: la imagen «café con teclado» de Kling O1 Image (K4, `img-omni-image-k4cafe-dad464de.png`, 1536×2720) y la foto de entrada R3 (`R3_casi_frontal.png`, 1792×2400). La compuso y la renderizó la sesión Lucía (editor, contenedor Linux) el 11-oct-2026 a partir de `videos/lucia-viernes-copia-v1/` (v1.1, que queda como historia: **no se tocó**). **v2 = la placa simplificada por la madre marketing**: de 6 a 15 s ya no hay una pantalla negra con 4-5 barras de letra chica, sino **una cara a la vista y UNA idea por vez en letra grande**. Sin Git, voz, publicación, instalaciones ni descargas. Fuera de esta carpeta no se tocó nada.

<!-- ESTADO -->
**MASTER v2 RENDERIZADO, PENDIENTE DE REVISOR Y VERIFICADOR Y DE «LISTA PARA MOSTRAR: reel viernes v2».** Todos los gates en verde (exit 0). No es aprobación visual ni permiso de publicar. Sigue MUDO: la voz no existe; `guion-voz.txt` es un cronograma estimado a 17 car/s (219 caracteres, ver «Voz futura»).
<!-- FIN ESTADO -->

## Qué cambió respecto de la v1.1

| | v1.1 | v2 |
|---|---|---|
| 6,6 a 15 s | pantalla negra con 3 barras, 7 puntos, una banda, una leyenda, la marca «piso 0,70», la lección y el CTA (46 palabras en 8,4 s, letra de 34-48 px) | **cara a la vista todo el tiempo** (K4|R3 y K4 a pantalla completa) y **un beat por vez**: «Con esa foto: 0,93» → «Con las otras 7: 0,56–0,73» → «Casi copia: no prueba identidad.» → CTA (19 palabras en 4 beats; ≤ 6 por beat) |
| Letra | 34 px la escala, 36 la leyenda, 42-50 los textos | **mínimo 44 px en toda la pieza**; subtítulos de la escena 2, beats y CTA ≥ 48 px; etiqueta del beat 56 px y cifra 112 px (tabla abajo) |
| Cara de Lucía visible | 6,6 s de 15 (44 %) | **30 de 30 muestras (100 %)**, medido en el master con SCRFD (nuevo gate `cara-visible`) |
| Gráfico | barras, puntos, banda de las fotos oficiales, leyenda, marca del piso 0,70, «Promedio de las 4» | **fuera de la pantalla y fuera del pie** (el pie ya no habla de gráfico); el 0,74, la escala 0,51–0,72 (promedio 0,64), «el piso de 0,70 lo elegí yo y es de la cara promedio de las 8» y «no la media de sus cifras» **se quedan en el pie**, con cifras validadas por el build |
| Lección | en pantalla («Mirá el parecido foto por foto.») | **solo en el pie** |
| Escena 2 | panel de 880 px, subtítulos de 42-44 px | panel de 860 px (y 312-1172), subtítulos de 48 px y «misma pose…» de 52 px; el beat A ocupa la misma casilla que ellos cuando salen |
| Voz | 223 caracteres | **219 caracteres** (python `len`, 8 líneas separadas por 1 salto): L3 «Mirá lo que recibió.», L5 «Con esa foto, sale más alto.», L6 «Con las otras siete, mucho menos.» (sin «mucho más alto»); sale la lección |
| Fuente mono | Spline Sans Mono para las cifras | ya no se usa (no hay gráfico; las cifras grandes van en Bricolage 700) |
| Gates | 92 mutaciones | **115 mutaciones**, 8 pruebas negativas del DOM, 2 de la cara visible y los gates nuevos `cara-visible`, `una idea por vez`, letra mínima por nodo y zona segura en píxeles de las 3 escenas |

## Master

| Dato | Valor |
|---|---|
| Archivo | `out/viernes-copia-final-1080x1920.mp4` (`out/` y `renders/` no van a git) |
| SHA-256 | `c33922226628d8db10e59cd2eb26617039e32e2496c56c793ea05f0d5987b397` (`qa/sha-master.txt`) |
| Video | H.264 High, yuv420p, bt709, 1080×1920, 24 fps, 360 cuadros, 15,000 s |
| Audio | AAC LC 48 kHz estéreo, SILENCIO: volumedetect mean −91,0 dB / max −91,0 dB (`qa/aac-silencio.txt`) |
| Tamaño | 2,96 MB (2.957.370 bytes) |
| `index.html` | md5 `0b0ef516089e79fdc4c7ce8098da474a`, idempotente (tres builds, mismo md5; `qa/md5-index.txt`, `qa/idempotencia.txt`) y el master se renderizó desde ese mismo HTML (`correr-gates.sh --master` lo reconstruyó después y el md5 no cambió) |
| Fuentes | `assets/k4.png`, `assets/k4-panel.png` y `assets/k4-s3.png` (tres enlaces al mismo archivo, uno por uso, para que `hyperframes check` no marque `<img>` iguales) y `assets/r3.png`; el build exige su SHA-256 (K4 `2a2e9401…7200`, R3 `0dc08193…f756`) y su tamaño. Los PNG originales no van a git: K4 se recupera a 0 cr con `job_display dad464de-75a8-45f5-b799-8d91e5a63d1d` → `rawUrl`, R3 está en `videos/lucia-g4-v2/assets/refs-orig/`. Cifras: PROCEDENCIA l.97, `medicion-sin-refs-entrada-20261011.txt` y `videos/lucia-p9-luz-cara/qa/face-gate-v31.json` (28 parejas entre las 8 oficiales: 0,509 a 0,719, promedio 0,642) |
| Render | `hyperframes@0.8.142` (caché de npx; `--prefer-offline`), `--quality high -f 24`, ≈ 45 s de pared; captura por pantallazo (Chromium completo, sin GPU); preview 360p real ≈ 26 s |

## La historia (nada inventado; cada cifra la valida el build contra su fuente)

- **El error.** En la prueba de G4/C2 la imagen «café con teclado» de Kling O1 Image dio **parecido 0,83** con Lucía (PROCEDENCIA.jsonl l.97, 0,5 cr), contra la cara promedio de las 8 fotos oficiales. Casi se publica como buen resultado de ese motor.
- **Pero** es casi una copia de la foto de entrada **R3**: misma pose, ventana y taza de barro, otra ropa y una segunda taza blanca al frente (no es copia pixel a pixel).
- **Foto por foto:** con R3 sola **0,93**; con las otras siete **0,56 a 0,73** (R1 0,69 · R2 0,62 · R4 0,56 · R5 0,72 · R6 0,66 · R7 0,73 · R8 0,60). De las 80 comparaciones de las 10 imágenes de la prueba, la de K4·R3 es la más alta; la siguiente, 0,81.
- **Qué recibió:** R1, R3, R6 y R7 (cuatro de las 8), una selfie y una referencia de ropa: por eso el 0,83 sale inflado y no hay control sin entradas. **Sin esas 4 fotos baja a 0,74** (la cara promedio de las 4 que ningún motor recibió, no la media de sus cifras), y sigue sobre el piso de 0,70. Todo esto va **solo en el pie**.
- **Escala (solo en el pie):** entre las propias fotos oficiales, de a dos, 0,51 a 0,72 (promedio 0,64; ninguna de las 28 parejas pasa de 0,72): el 0,56 a 0,73 de K4 contra las otras siete es casi ese mismo rango; el 0,93 con R3, no.
- **Una escena, una toma** (en pantalla: «una sola toma.» bajo «Kling O1 Image»; y en el pie, antes del carácter 481): el mismo motor dio 0,79 y 0,35 (perdió la cara) en otras dos escenas.

## Línea de tiempo y pantalla (24 fps)

| Tiempo | Escena | Qué se ve | Texto en pantalla (una sola idea por vez) |
|---|---|---|---|
| 0,00–3,00 | s1 | K4 a pantalla completa (cara de 480 px). Cuadro 0: rótulo y título | rótulo «Lucía Antelo · personaje IA de Onia» (44 px) · título **«Casi publico este 0,83.»** (66 px, cuadro 0) · **0,5 s:** «Kling O1 Image · parecido 0,83» (48 px; el primer número, antes de 3 s) |
| 2,75–3,00 | empuje | rígido de 6 cuadros | |
| 3,00–5,96 | s2 | K4 (izquierda) y R3 (derecha) lado a lado, y 540×860 cada una; caras de 237 y 265 px | «Kling O1 Image / una sola toma.» (48 px) · **3,0 s «Mirá la foto que recibió.»** (48 px) · **4,125 s «Misma pose, ventana, taza.»** (52 px) con tres aros que **se trazan en 0,6 s**: pose 4,125 · ventana 4,5 · taza 4,875 s |
| 5,96–6,04 | s2 | los tres textos salen (fundido de 0,1 s) 2 cuadros antes de que entre el beat A | |
| **6,04–7,75** | s2 | las mismas dos caras, aros a la vista | **BEAT A «Con esa foto: 0,93»** (etiqueta 56 px, cifra 112 px) |
| 7,875–8,125 | empuje | rígido de 6 cuadros | |
| **8,125–10,17** | s3 | K4 a pantalla completa (cara de 479 px) | **BEAT B «Con las otras 7: 0,56–0,73»** (56 / 112 px) |
| **10,21–12,33** | s3 | idem | **BEAT C «Casi copia: no prueba identidad.»** (64 px, dos líneas «Casi copia: / no prueba identidad.») |
| **12,375–15,0** | s3 | idem | **CTA «Seguime: cada semana, una prueba.»** (66 px; 2,625 s en pantalla) |

Cada salida empieza 1 cuadro antes de la entrada siguiente (2 en la escena 2): nunca hay dos ideas a ≥ 50 % de opacidad a la vez ni un cuadro sin tarjeta (el gate `medir-dom` lo mide cuadro por cuadro; «una idea por vez» es regla del auditor). Los beats ocupan siempre la misma casilla (y 1194). Eventos (`plan.json → eventos`): 25, hueco máximo 1,375 s.

### Tamaños de letra a 1080 px de ancho (cada nodo de texto medido en el DOM: `qa/tamanos.txt`)

| Texto | Tamaño | Fuente | Mínimo exigido |
|---|---:|---|---:|
| Rótulo «Lucía Antelo · personaje IA de Onia» | 44 px | DM Sans | 44 (nunca < 40) |
| Título «Casi publico este 0,83.» | 66 px | Bricolage 700 | 48 |
| Dato «Kling O1 Image · parecido 0,83» | 48 px | DM Sans | 44 |
| «Kling O1 Image / una sola toma.» y «Mirá la foto que recibió.» | 48 px | DM Sans | 48 |
| «Misma pose, ventana, taza.» | 52 px | DM Sans | 48 |
| Beat A y B: etiqueta («Con esa foto:», «Con las otras 7:») | 56 px | DM Sans | 56 |
| Beat A y B: cifra («0,93», «0,56–0,73») | 112 px | Bricolage 700 | 100 |
| Beat C «Casi copia: no prueba identidad.» | 64 px | Bricolage 700 | 56 |
| CTA «Seguime: cada semana, una prueba.» | 66 px | Bricolage 700 | 56 |

La letra más chica de toda la pieza es de **44 px** (el rótulo de IA y, en la v1.1, era de 34 px). A 390 px de ancho eso son ≈ 16 px; las cifras de los beats, ≈ 40 px.

## Cara de Lucía visible (gate nuevo `scripts/cara-visible.mjs`)

SCRFD det_10g (el detector del face-gate) sobre un cuadro exacto cada 0,5 s del master (t = 0, 0,5 … 14,5; 30 muestras), cara ≥ 200 px de ancho en el lienzo: **30 de 30 = 100,0 %** (mínimo exigido > 50 %, objetivo ≥ 85 %). Caras más grandes por escena: 480 px (s1), 262-265 px (s2, la de R3; la de K4 mide 237 px), 290 px a 8,0 s (a mitad del empuje, la cara de R3 que sale), 472-480 px (s3). `qa/cara-visible.txt` y `qa/cara-visible.json` traen las 30 muestras. El build **predice** lo mismo desde el plan (29 de 30: no cuenta las muestras a mitad de un empuje; el empuje de 8,0 s sí detectó cara) y rechaza un plan con ≤ 85 %. **Pruebas negativas:** un master estropeado con fondo negro desde 8,1 s da 17 de 30 = 56,7 % (exit 1, bajo el objetivo) y desde 3 s da 6 de 30 = 20 % (exit 1, bajo la mitad): `qa/negativas-cara-visible.txt`.

## Decisiones (y cómo revertirlas)

1. **El beat C sigue siendo «Casi copia: no prueba identidad.»** (desviación (a) de lo propuesto por la madre marketing: «Casi copia ≠ misma persona»). «≠ misma persona» afirma que la imagen NO es ella y lo medido no lo sostiene: sin las 4 fotos recibidas sigue en 0,74 (sobre el piso) y las otras siete caen en el rango de fotos reales entre sí (0,51 a 0,72). Lo sostenible es que una casi copia **no prueba** que el motor conserve la identidad. Lo fijó la sesión Lucía; el build rechaza la otra redacción y «Era copia, no identidad.». Revertir: `plan.json → textos.beat_c`, la voz (L7), `build.mjs → esperado` y las mutaciones.
2. **«Con las otras 7: 0,56–0,73» con guion largo y no «0,56 a 0,73».** El contador de palabras del repo cuenta los numerales: «Con las otras 7: 0,56 a 0,73» son 7 palabras (> 6 por beat) y pide 2,75 s de lectura, que no caben entre el beat A y el CTA. Con el guion (el rango es una sola afirmación) son 5 palabras y 2,05 s. El build exige `etiqueta: afirmación` con un solo dato y ≤ 6 palabras por beat.
3. **Tiempos de los beats** (los fija la lectura, 0,35 s/palabra + 0,3 s, y la voz a 17 car/s a la vez): A 6,04 s, B 8,125 s (llega con el segundo empuje), C 10,21 s, CTA 12,375 s. Con los empujes de 6 cuadros no caben tres escenas más (cada una pide ≥ 2 s): A comparte escena con las dos caras (la comparación K4|R3 que ya se veía), y B, C y el CTA comparten K4 a pantalla completa con salidas y entradas por fundido de 0,1 s que se cruzan 1-2 cuadros (marcadas `data-layout-allow-overlap`; `hyperframes check` aún lo anota como info, no como aviso). Márgenes de lectura (ventana vs. lo que pide): A 1,875/1,70 s, B 2,167/2,05 s, C 2,083/2,05 s: **ajustados** (0,03 a 0,17 s); mover un beat más de 1-2 cuadros rompe un gate.
4. **El beat A vive sobre las dos caras (K4|R3), no sobre R3 sola:** el 0,93 es el parecido de K4 con R3, y las dos caras con los aros de pose/ventana/taza todavía a la vista lo muestran. Los aros (H5 de la v1.1) siguen: se trazan en 0,6 s y quedan ≥ 1 s a la vista antes del empuje (el último, hasta 7,875 s).
5. **Sin «promedio», «piso», «oficiales», «leyenda» ni «gráfico» en pantalla ni en el pie:** `grep-prohibidas`, `layout-dom` (cero elementos de gráfico en el DOM) y el build lo rechazan.
6. **Cifras grandes en Bricolage 700, no en la mono:** a 112 px la coma de la fuente mono sale separada («0 , 93», H8a de la v1.1).
7. **El rótulo de IA solo está en la escena 1** (como en la v1.1): quien llegue a mitad ve a Lucía sin la palabra IA; cumple la regla (rótulo desde el cuadro 0, pie abierto con «Personaje hecho con IA» y etiqueta por API). Si la madre lo quiere en todo el reel hay que sumarlo como una segunda «idea» o ceder el lugar de «una sola toma».
8. **Panel de la escena 2 de 860 px (y 312-1172):** baja 20 px y sube 58 px para que quepan los subtítulos de 48 px, «misma pose…» de 52 px y el beat A sin pasar de y 1490. Las caras siguen ≥ 200 px.
9. **Sin modo `--estatico`** en los gates (aquí todos corren en Chromium real); **Spline Sans Mono** fuera de la composición.

## Voz futura (no se genera): cronograma estimado a 17 car/s

`guion-voz.txt`: 8 líneas, **219 caracteres** (python `len`, líneas separadas por 1 carácter; cupo de voz 381, tope 255 del build, 15 s a 17 car/s admiten ≈ 255), sin cifras habladas, **una línea por beat** (v1.1: 223).

| Línea | Texto | Car. | Voz (s) | Pantalla que cae con ella |
|---|---|---:|---|---|
| L1 | Casi publico esta imagen. | 25 | 0,00–1,47 | título (cuadro 0) |
| L2 | Parecido alto. | 14 | 1,71–2,53 | (acento del dato, 1,75 s) |
| L3 | Mirá lo que recibió. | 20 | 2,75–3,93 | «Mirá la foto que recibió.» (3,0 s, +0,25) |
| L4 | Misma pose, ventana y taza. | 27 | 4,17–5,76 | «Misma pose, ventana, taza.» (4,125 s, −0,04) |
| L5 | Con esa foto, sale más alto. | 28 | 6,00–7,65 | **beat A** (6,04 s, +0,04) |
| L6 | Con las otras siete, mucho menos. | 33 | 7,875–9,82 | **beat B** (8,125 s, +0,25) |
| L7 | Casi copia: no prueba identidad. | 32 | 10,04–11,92 | **beat C** (10,21 s, +0,17) |
| L8 | Seguime: cada semana, una prueba. | 33 | 12,17–14,11 | **CTA** (12,375 s, +0,21; 2,83 s desde el inicio de la línea; cola sin voz 0,89 s) |

Cambios frente a la v1.1: L5 ya no dice «mucho más alto» (compara 0,93 con 0,83, no con algo «mucho»): «sale más alto» (una palabra más que el ejemplo de la madre, «Con esa foto, más alto.», porque con 23 caracteres el beat B llegaría 0,54 s después de su línea, > 0,5 s); L6 nueva; L3 «Mirá lo que recibió.» (20 caracteres, no 25: tiene que terminar antes de 4,17 s para que «Misma pose…» no entre antes que su línea); sale «Mirá el parecido foto por foto.» (la lección queda en el pie). Las pausas entre líneas son de 0,22 a 0,25 s; el único hueco ≥ 0,3 s es la cola tras el CTA. Con voz real: generar y medir cada pista, escribir `duraciones.json`, correr `node scripts/voz.mjs` y `node scripts/retemporizar.mjs` (fallan si una línea se sale de su entrada −0,05/+0,5 s o si el CTA queda bajo 2,6 s) y corregir `plan.json → eventos` (campo `voz`). La voz mide 3,0 palabras por segundo de habla (por debajo de las 3,2-4,1 de PLAN §4-bis): se re-mide con voz real. La pronunciación de «Kling» por la voz Marcela no se midió. Quedan 162 caracteres de cupo en el tope de 381 y 36 en el de 255.

## Pie (`pie.txt`)

**2.128 caracteres** (python `len`; tope 2.200; v1.1: 2.193). Abre con «Personaje hecho con IA: Lucía Antelo, de @oniahq.», conserva «Nombro lo que uso; no es una recomendación pagada.» y «Una escena, una toma: es una prueba, no una regla.» termina en el carácter 481 (primeros ~500). Sale `por eso en el gráfico lo dibujé solo junto al promedio de las 4` (el pie ya no menciona ningún gráfico; el build lo rechaza); se quedan, con cifras validadas contra las fuentes, el 0,74 («Sin esas 4 fotos baja a 0,74 … no la media de sus cifras»), la escala 0,51-0,72 (promedio 0,64; 28 parejas), «El piso de 0,70 lo elegí yo y es de la cara promedio de las 8 fotos: no se compara con el parecido de una sola foto», el ruido ±0,03, los 677 px de la cara y la lección. 29 mutaciones del pie. Flujo (montaje-hyperframes §12): `node scripts/build.mjs --escribir-pie` (la primera corrida falla a propósito: lee el `pie.txt` viejo) y luego `node scripts/build.mjs` sin flag.

## Lo que se vio (preview 360p real y master)

Mirado: preview 360p real (3 hojas de 10 cuadros, uno cada 12 = cada 0,5 s, `qa/preview-360p-hoja-*.jpg`) antes del master; del master, las mismas 3 hojas a 400 px (`qa/contacto-2fps-*.jpg`, más la de los 30 en una sola, `qa/contacto-2fps.jpg`; **cuadros exactos** `select=not(mod(n,12))`: el filtro `fps=2` de ffmpeg corre hasta 5 cuadros a partir de los 10 s y mostraba el fundido de salida del beat B como si fuera «10,0 s») y a resolución completa los cuadros 0, 24, 72, 108, 144, 150, 170, 192 (a mitad del empuje), 195, 216 (beat B), 245-246 (cruce B→C), 270 (beat C), 297 (CTA), 330 y 359 en `qa/cuadros/`.

- **Cuadro 0:** K4 a pantalla completa con rótulo (44 px) y título; el dato entra a 0,5 s. Cara de 480 px, ningún texto la toca.
- **Escena 2:** las dos caras (237 y 265 px), los tres aros se ven trazar (cuadro 108: la pose a medio dibujo); los tres textos salen a 5,96 s y a 6,04 s entra el beat A sin hueco.
- **Beats:** «Con esa foto: 0,93» (cifra coral de 112 px) sobre las dos caras; el empuje de 7,875-8,125 s es rígido, sin tiras vacías; «Con las otras 7: 0,56–0,73» (cifra verde) sobre K4; el cruce B→C dura 2-3 cuadros (cuadro 245: B al 58 %, C todavía en 0; cuadro 246: C al 88 %); «Casi copia: / no prueba identidad.»; CTA en dos líneas parejas.
- **Defectos hallados:** ninguno en el master. Observaciones sin corregir: (a) en los cuadros 143-145 (5,96-6,04 s) los textos de la escena 2 están a media opacidad y el beat A todavía no entró: 2 cuadros de transición, no un hueco (siempre hay una tarjeta); (b) las franjas y < 312 y y > 1427 de la escena 2 quedan vacías (zona de la interfaz de Instagram); (c) la escena 2 sigue siendo la única con fondo negro grande (de 1427 a 1920 y de 0 a 312), con las dos caras a la vista; (d) el rótulo de IA solo está de 0 a 3 s (decisión 7); (e) los márgenes de lectura de los beats son de 0,03 a 0,17 s (decisión 3); (f) `hyperframes check` anota como info el cruce de 2 cuadros entre los beats B y C (intencional).

## Gates y evidencia (exit codes en `qa/RESUMEN-gates.txt`; `bash scripts/correr-gates.sh [--master]`)

| Gate | Exit | Resultado |
|---|---:|---|
| `build.mjs` SIN flag (×3 + los de `correr-gates`) | 0 | datos y pie validados contra PROCEDENCIA l.97, la medición sin refs de entrada (10 imágenes, 80 comparaciones) y `face-gate-v31.json`; textos de pantalla iguales a lo esperado (un solo dato por beat, ≤ 6 palabras, sin lenguaje de gráfico), tipografía mínima, orden de los beats y salidas 1-2 cuadros antes de cada entrada, CTA ≥ 2,6 s, aros ≥ 0,5 s de trazo y ≥ 1 s a la vista, cara visible predicha 29/30; voz 219 caracteres (cupo 381, tope 255), 360 cuadros; pie 2.128 caracteres; idempotente |
| `master-ready.mjs` | 0 | fuentes completas, SHA de K4 y R3 |
| `voz.mjs` / `retemporizar.mjs` | 0 / 0 | ESTIMADA a 17 car/s; pausas 0,218-0,245 s; L3 empieza con el empuje; cada entrada cae con su línea (−0,04 a +0,25 s); CTA 2,83 s; tabla en `qa/alineacion-voz.txt` |
| `ventanas.mjs` | 0 | 10 textos, cada uno con su ventana de lectura (0,35 s/palabra + 0,3 s): tile2 1,792 s (pide 1,7), beat A 1,875 (1,7), beat B 2,167 (2,05), beat C 2,083 (2,05), CTA 2,583 (2,4); los beats no se pisan (19 palabras en 4 beats, 8,2 s pedidos contra 8,88 s) |
| `hueco-tarjetas.mjs` | 0 | 0 de 360 cuadros sin tarjeta |
| `eventos.mjs` | 0 | 25 eventos (entradas, **salidas**, aros que se trazan —a mitad del dibujo entre 5 % y 95 %—, empujes, acentos): cada uno cambia algo visible; hueco máximo 1,375 s |
| `aire.mjs` | 0 | quieto fuera de lectura 0,167 s (tope 0,3) en el DOM y en píxeles (`qa/aire-pixeles.txt`) |
| `costuras.mjs` | 0 | 2 costuras de 6 cuadros, separación 0,000 px, los tiles viajan con su escena |
| `medir-dom.mjs` | 0 | 581 cajas / 360 cuadros, 0 fallos: zona segura, **letra ≥ 44 px (≥ 48 en los textos grandes, nunca < 40) medida nodo por nodo**, sin solape, **una sola idea por cuadro**, sin texto sobre la cara +40 px, rótulo ≥ 44 px en el cuadro 0, dato antes de 3 s, CTA ≥ 2,4 s |
| `layout-dom.mjs` | 0 | tabla de tamaños (`qa/tamanos.txt`), casilla única de los beats (y 1194), etiqueta y cifra en una línea cada una, «Casi copia: / no prueba identidad.», CTA «Seguime: cada semana, / una prueba.», borde inferior máximo 1470,8, **0 elementos de gráfico en el DOM** y las tres fotos visibles |
| `grep-prohibidas.mjs` | 0 | 0 coincidencias en pantalla, pie y voz (sin «promedio», «piso», «oficiales», «leyenda», «gráfico», «barra», «banda» en pantalla; sin gráfico en el pie) |
| `node /home/user/onia-hermes/scripts/lucia-prohibidas.mjs pie.txt guion-voz.txt qa/pantalla.txt` | 0 | 0 coincidencias |
| `validar-mutaciones.mjs` | 0 | **115** alteraciones rechazadas por el motivo esperado (v1.1: 92). Nuevas: un dato extra en pantalla (2), reaparecen «Promedio de las 4», «piso 0,70», la leyenda, la lección, «promedio» en el beat C o el gráfico en el plan —piso_en, barras— (7), «Casi copia ≠ misma persona» y «Era copia…», **letra bajo el mínimo** (8: etiqueta del beat a 40 y 52, beat C a 44, subtítulos a 42, «misma pose» a 44, CTA a 44, rótulo a 40 y a 36), **cara visible** (4: sin foto en las escenas 2 y 3, 0 % por tamaño), el pie vuelve a hablar del gráfico, la voz vuelve a decir «mucho más alto» o la lección o pierde una línea, orden, salidas y llegada de los beats (6: orden alterado, dos ideas a la vez, aire entre ideas, sin salida del «misma pose», sin salida del beat C, beat B 0,25 s tarde), la segunda costura corrida, CTA tarde, aros (5); las escrituras del build quedan bloqueadas durante la prueba |
| `verificar-auditor.mjs` | 0 | regresión del reporte: 5 fallos conservados (CTA ×2, nota ×2, dos ideas a la vez) y letras de 40 px en un beat y de 36 px rechazadas |
| `negativas-dom.mjs` | 0 | **8** alteraciones del HTML rechazadas por su gate (exit 1): una barra/marca de piso y una banda en el DOM, «Promedio de las 4» como texto, la etiqueta del beat a 40 px, un texto a 36 px, **dos ideas a la vez** (el beat C siempre visible), y la foto de la escena 3 o de la escena 1 oculta (`qa/negativas-dom.txt`) |
| `hyperframes check` (0.8.142) | 0 | 0 errores · 3 avisos `nested_structure_needs_subcomposition` (no frenan) · layout 0 problemas / 9 muestras + 1 info (el cruce de 2 cuadros B→C, intencional) · runtime 0/0 · motion 0/0 · contraste 10/10 AA |
| preview 360p real | 0 | `qa/viernes-preview-360p.mp4`, 360×640, 24 fps, 360 cuadros, 15,000 s; mirado antes del master |
| render high + mux AAC | 0 / 0 | ver «Master» |
| `pixeles.mjs psnr-fotos` | 0 | mínimo **37,11 dB** (umbral 35): K4 pantalla completa escena 1 41,33 · escena 3 41,42 · panel K4 39,18 · panel R3 37,11 |
| `pixeles.mjs vacios` / `aire` | 0 / 0 | 360 cuadros, 0 planos; quietud en píxeles 0,167 s |
| `zona-segura-pixeles.mjs` | 0 | escena 1: texto en y 1176-1471, x 80-999 · escena 3: y 1194-1395, x 80-999 · escena 2: nada sobre el panel (y < 312) y contenido hasta y 1427; límites y 292-1490, x 80-1000 (la caja de las escenas 1 y 3 se mide por diferencia con la foto de K4 llevada al mismo encuadre) |
| **`cara-visible.mjs`** (nuevo) | 0 | **30 de 30 muestras (100 %) con cara ≥ 200 px** (mínimo > 50 %, objetivo ≥ 85 %); negativas: 56,7 % y 20,0 % → exit 1 |
| ArcFace master ↔ fuente (`face-gate.sh` + `arcface-pares.mjs`, 12 pares) | 0 / 0 | diferencia máxima **0,010** (regla ≤ 0,02): escena 1 0,829-0,830 contra 0,825; panel K4 0,824-0,825 contra 0,824; panel R3 0,831-0,832 contra 0,822; escena 3 0,823-0,830 contra 0,825 (`qa/arcface-pares.json`, `qa/arcface-final.txt`) |
| Identidad del master (`face-gate.sh` sobre 8 instantes —0 · 1,5 · 3,5 · 5,5 · 7 · 9,5 · 11,5 · 14 s, uno en cada beat— y 2 paneles, y `lucia-qa-tabla.mjs`) | 0 / 0 | 10 imágenes, 0 bajo el piso 0,70, 0 sin cara, 0 con cara < 200 px (479-480, 262-265, 237 y 265 px): `qa/face-gate.json`, `qa/qa-tabla.md`; `leave_one_out_min` 0,698 |
| `node --check` (25 scripts .mjs/.js), `bash -n` (2), `py_compile` (2) y UTF-8 | 0 | `qa/sintaxis.txt`, `qa/utf8.txt` |

## Cómo reproducir

Desde `videos/lucia-viernes-copia-v2/`. `hyperframes@0.8.142` ya está en la caché de npx de este contenedor (con `--prefer-offline` no descarga nada). Todo render va bajo `flock /tmp/hf-render.lock`, como proceso hijo directo.

```bash
export PRODUCER_HEADLESS_SHELL_PATH=/opt/pw-browsers/chromium HYPERFRAMES_SKIP_SKILLS=1
export PLAYWRIGHT_MODULE=/opt/node-tools/node_modules/playwright
export FACE_GATE_HOME=…/lucia-face-gate     # fuera del repo (venv con onnxruntime + modelos ya existentes)
$FACE_GATE_HOME/venv/bin/python -I scripts/caras-fotos.py > qa/caras-fotos.json    # SCRFD sobre K4 y R3
node scripts/build.mjs --escribir-pie     # la primera corrida FALLA a propósito si cambió el pie (lee el viejo); después:
node scripts/build.mjs                    # SIN flag; valida cifras, textos, pie y voz; escribe index.html y qa/tiles.json
bash scripts/correr-gates.sh              # todos los gates sin master; deja qa/RESUMEN-gates.txt
node scripts/borrador-360.mjs && (cd renders/draft360 && flock /tmp/hf-render.lock npx --prefer-offline -y hyperframes@0.8.142 render --quality draft -f 24 -o ../../qa/viernes-preview-360p.mp4)   # preview 360p REAL: mirarlo antes del master
node scripts/master-ready.mjs && flock /tmp/hf-render.lock npx --prefer-offline -y hyperframes@0.8.142 render --quality high -f 24 -o renders/final-raw.mp4
ffmpeg -y -i renders/final-raw.mp4 -f lavfi -t 15 -i anullsrc=r=48000:cl=stereo -map 0:v -map 1:a -c:v copy -c:a aac -b:a 128k -shortest -movflags +faststart out/viernes-copia-final-1080x1920.mp4
sha256sum out/viernes-copia-final-1080x1920.mp4 > qa/sha-master.txt
bash scripts/correr-gates.sh --master     # además psnr-fotos, vacios, aire, zona segura en píxeles y cara-visible (necesita FACE_GATE_HOME)
bash scripts/recortes-arcface.sh out/viernes-copia-final-1080x1920.mp4 <carpeta> && (cd ../.. && FACE_GATE_OUT=videos/lucia-viernes-copia-v2/qa/arcface-pares.json bash .claude/skills/lucia/scripts/face-gate.sh $(cat <carpeta>/args.txt)) && node scripts/arcface-pares.mjs   # 12 pares master ↔ fuente
(cd ../.. && FACE_GATE_OUT=videos/lucia-viernes-copia-v2/qa/face-gate.json bash .claude/skills/lucia/scripts/face-gate.sh 'videos/lucia-viernes-copia-v2/out/viernes-copia-final-1080x1920.mp4@0,1.5,3.5,5.5,7,9.5,11.5,14' <carpeta>/master-b2-k4-f84.png <carpeta>/master-b2-r3-f84.png) && node ../../scripts/lucia-qa-tabla.mjs qa/face-gate.json > qa/qa-tabla.md
```

El render no es reproducible bit a bit entre máquinas (el `index.html` sí).

## Dudas abiertas y qué falta

1. **Revisor y verificador:** los pone la madre. Ningún resultado de este README es aprobación visual ni permiso de publicar («LISTA PARA MOSTRAR: reel viernes v2»). Falta copiar el master a `videos/lucia-entrega/`.
2. **Voz: NO existe** (cronograma estimado; ver arriba). 219 de 255 caracteres. L5 («sale más alto») y L3 («Mirá lo que recibió.») difieren de lo propuesto por tiempos, no por fondo; «mucho menos» (L6) es de la madre: 0,56 a 0,73 contra 0,93 son 0,20 a 0,37 menos, más que el ruido de ±0,03, pero el 0,73 queda cerca de las fotos reales entre sí; en el reel solo se compara con el 0,93 de la línea anterior.
3. **Márgenes de lectura ajustados** (decisión 3): los tres beats tienen 0,03 a 0,17 s sobre lo que pide la regla de 0,35 s/palabra + 0,3 s. A velocidad real de lectura de Instagram (≈ 3 palabras/s) hay holgura: cada beat dura 1,9 a 2,2 s y tiene 4-5 palabras.
4. **El rótulo de IA solo está de 0 a 3 s** (decisión 7); la cara está a la vista el 100 % del tiempo.
5. **Pose, ventana, taza** miradas a ojo, no medidas; la imagen no es pixel-copia.
6. **Instagram:** no se simuló la interfaz; todo texto está entre x 80 y 1000 y entre y 1176 y 1471 (s1), 1194 y 1427 (s2), 1194 y 1396 (s3).
7. Los PNG originales de K4 y R3 no están en git (los ignoran sus carpetas): el build falla con un mensaje claro si faltan o si su SHA cambia.
8. El render se hizo en modo «screenshot» (el Chromium completo no expone `HeadlessExperimental`): PSNR ≥ 37 dB y ArcFace ≤ 0,010 muestran que no degradó la imagen.
9. `qa/viernes-preview-360p.mp4` y las hojas son evidencia: no son para publicar.
10. **C2** (carrusel del miércoles) dice lo mismo del 0,74 («sin esas 4 fotos baja a 0,74») pero no trae la escala de las fotos oficiales ni la aclaración del piso (fuera de esta carpeta, no se tocó).
