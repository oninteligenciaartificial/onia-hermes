# Viernes · «Casi publico este 0,83» (El error de la semana) — v2

Reel corto del viernes (PLAN.md §4-bis), MUDO, 1080×1920, 24 fps, **360 cuadros / 15,0 s**, con HyperFrames. **0 créditos**, solo material que ya existía: la imagen «café con teclado» de Kling O1 Image (K4, `img-omni-image-k4cafe-dad464de.png`, 1536×2720) y la foto de entrada R3 (`R3_casi_frontal.png`, 1792×2400). La compuso y la renderizó la sesión Lucía (editor, contenedor Linux) el 11-oct-2026 a partir de `videos/lucia-viernes-copia-v1/` (v1.1, que queda como historia: **no se tocó**). **v2 = la placa simplificada por la madre marketing, más UNA pasada de arreglos del revisor independiente** (0 ALTA, 4 MEDIA, 8 BAJA; ver «Pasada del revisor»): de 6 a 15 s ya no hay una pantalla negra con 4-5 barras de letra chica, sino **una cara a la vista y UNA idea por vez en letra grande**. Sin Git, voz, publicación, instalaciones ni descargas. Fuera de esta carpeta no se tocó nada.

<!-- ESTADO -->
**LISTA PARA MOSTRAR (11-oct, v2).** Master SHA `c4299c7b…64393aa4` (mudo, 15,0 s, 0 cr), 22 gates en exit 0, `lucia-prohibidas` y `lucia-qa-tabla` exit 0, cara visible 30 de 30 muestras (100 %), 132 mutaciones rechazadas. Revisor independiente (sonnet, 1 ciclo): 0 ALTA, 4 MEDIA, 8 BAJA, veredicto «puede ser lista para mostrar»; los MEDIA M1, M2 y M4 y los BAJA B1, B2 y B4 se aplicaron en una pasada. Verificador mecánico (haiku): 11 de 11 PASS sobre el master anterior, y la sesión Lucía repitió SHA, pie, voz, prohibidas, qa-tabla y gates sobre este. Falta «mostrada, publicá el viernes». Sigue MUDO; la voz no existe (cronograma de 223 caracteres). El master de antes de la pasada (`c3392222…b397`) y el de la v1.1 (`5862aa44…5930`) quedan solo como evidencia: **no publicarlos**.
<!-- FIN ESTADO -->

## Qué cambió respecto de la v1.1

| | v1.1 | v2 |
|---|---|---|
| 6,6 a 15 s | pantalla negra con 3 barras, 7 puntos, una banda, una leyenda, la marca «piso 0,70», la lección y el CTA (46 palabras en 8,4 s, letra de 34-48 px) | **cara a la vista todo el tiempo** (K4|R3 y K4 a pantalla completa) y **un beat por vez**: «Con esa foto: 0,93» → «Con sus otras 7 fotos: 0,56–0,73» → «Casi copia: no prueba identidad.» → CTA (20 palabras en 4 beats; ≤ 6 por beat) |
| Letra | 34 px la escala, 36 la leyenda, 42-50 los textos | **mínimo 48 px en TODO texto visible, sin excepción** (el rótulo de IA también); etiqueta del beat 56 px y cifra 112 px (tabla abajo) |
| Cara de Lucía visible | 6,6 s de 15 (44 %) | **30 de 30 muestras (100 %)**, medido en el master con SCRFD (nuevo gate `cara-visible`) |
| Gráfico | barras, puntos, banda de las fotos oficiales, leyenda, marca del piso 0,70, «Promedio de las 4» | **fuera de la pantalla y fuera del pie** (el pie ya no habla de gráfico); el 0,74, la escala 0,51–0,72 (promedio 0,64), «el piso de 0,70 lo elegí yo y es de la cara promedio de las 8» y «no la media de sus cifras» **se quedan en el pie**, con cifras validadas por el build |
| Lección | en pantalla («Mirá el parecido foto por foto.») | **solo en el pie** |
| Escena 2 | panel de 880 px, subtítulos de 42-44 px | panel de 860 px (y 312-1172), subtítulos de 48 px y «misma pose…» de 52 px; el beat A ocupa la misma casilla que ellos cuando salen; aros de pose más chicos, sobre la mano y el pelo |
| Voz | 223 caracteres | **223 caracteres** (python `len`, 8 líneas separadas por 1 salto): L3 «Mirá una foto suya.», L5 «Con esa foto, sale más alto.», L6 «Con las otras siete, baja el parecido.» (sin «mucho más alto» ni «mucho menos»); sale la lección |
| Fuente mono | Spline Sans Mono para las cifras | ya no se usa (no hay gráfico; las cifras grandes van en Bricolage 700) |
| Gates | 92 mutaciones | **132 mutaciones**, 9 pruebas negativas del DOM, 2 de la cara visible y los gates nuevos `cara-visible`, `una idea por vez`, letra mínima por nodo y zona segura en píxeles de las 3 escenas |

## Master

| Dato | Valor |
|---|---|
| Archivo | `out/viernes-copia-final-1080x1920.mp4` (`out/` y `renders/` no van a git) |
| SHA-256 | `c4299c7b21c7b05cc41181176d8908429b9752d4422c9cc9275964dd64393aa4` (`qa/sha-master.txt`) |
| Video | H.264 High, yuv420p, bt709, 1080×1920, 24 fps, 360 cuadros, 15,000 s |
| Audio | AAC LC 48 kHz estéreo, SILENCIO: volumedetect mean −91,0 dB / max −91,0 dB (`qa/aac-silencio.txt`) |
| Tamaño | 2,98 MB (2.983.672 bytes) |
| `index.html` | md5 `568c01b1cabf9a5f777ce07ba925b04f`, idempotente (tres builds, mismo md5; `qa/md5-index.txt`, `qa/idempotencia.txt`) y el master se renderizó desde ese mismo HTML (`correr-gates.sh --master` lo reconstruyó después y el md5 no cambió) |
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
| 0,00–2,75 | s1 | K4 a pantalla completa (cara de ≈ 475 px). Cuadro 0: rótulo y título | rótulo «Lucía Antelo · personaje IA de Onia» (**48 px**) · título **«Casi publico este 0,83.»** (66 px, cuadro 0) · **0,33 s:** «Kling O1 Image · parecido 0,83» (48 px; el primer número, antes de 3 s) |
| 2,50–2,75 | empuje | rígido de 6 cuadros | |
| 2,75–5,79 | s2 | K4 (izquierda) y R3 (derecha) lado a lado, 540×860 cada una; caras de 237 y 263 px | «Kling O1 Image / una sola toma.» (48 px) · **2,75 s «Mirá una foto suya que recibió.»** (48 px, dos líneas) · **4,04 s «Misma pose, ventana, taza.»** (52 px) con tres aros que **se trazan en 0,6 s**: pose 4,04 · ventana 4,42 · taza 4,79 s. El aro de pose rodea la mano y el pelo, lejos de la mandíbula |
| 5,79–5,875 | s2 | los tres textos salen (fundido de 0,1 s) 2 cuadros antes de que entre el beat A | |
| **5,875–7,625** | s2 | las mismas dos caras, aros a la vista | **BEAT A «Con esa foto: 0,93»** (etiqueta 56 px, cifra 112 px) |
| 7,625–7,875 | empuje | rígido de 6 cuadros | |
| **7,875–10,25** | s3 | K4 a pantalla completa (cara de 479 px) | **BEAT B «Con sus otras 7 fotos: 0,56–0,73»** (56 / 112 px; 6 palabras) |
| **10,29–12,42** | s3 | idem | **BEAT C «Casi copia: no prueba identidad.»** (64 px, dos líneas «Casi copia: / no prueba identidad.») |
| **12,458–15,0** | s3 | idem | **CTA «Seguime: cada semana, una prueba.»** (66 px; 2,542 s en pantalla) |

Cada salida empieza 1 cuadro antes de la entrada siguiente (2 en la escena 2): nunca hay dos ideas a ≥ 50 % de opacidad a la vez ni un cuadro sin tarjeta (el gate `medir-dom` lo mide cuadro por cuadro; «una idea por vez» es regla del auditor). Los beats ocupan siempre la misma casilla (y 1194). Eventos (`plan.json → eventos`): 25, hueco máximo 1,5 s.

### Tamaños de letra a 1080 px de ancho (cada nodo de texto medido en el DOM: `qa/tamanos.txt`)

**Todo texto visible ≥ 48 px, sin excepción** (pasada del revisor, B1: antes el rótulo de IA era de 44 px).

| Texto | Tamaño | Fuente | Mínimo exigido |
|---|---:|---|---:|
| Rótulo «Lucía Antelo · personaje IA de Onia» | **48 px** | DM Sans | 48 |
| Título «Casi publico este 0,83.» | 66 px | Bricolage 700 | 48 |
| Dato «Kling O1 Image · parecido 0,83» | 48 px | DM Sans | 48 |
| «Kling O1 Image / una sola toma.» y «Mirá una foto suya que recibió.» | 48 px | DM Sans | 48 |
| «Misma pose, ventana, taza.» | 52 px | DM Sans | 48 |
| Beat A y B: etiqueta («Con esa foto:», «Con sus otras 7 fotos:») | 56 px | DM Sans | 56 |
| Beat A y B: cifra («0,93», «0,56–0,73») | 112 px | Bricolage 700 | 100 |
| Beat C «Casi copia: no prueba identidad.» | 64 px | Bricolage 700 | 56 |
| CTA «Seguime: cada semana, una prueba.» | 66 px | Bricolage 700 | 56 |

La letra más chica de toda la pieza es de **48 px** (v1.1: 34 px; primera pasada de la v2: 44 px). A 390 px de ancho son ≈ 17 px; las cifras de los beats, ≈ 40 px. El rótulo a 48 px mide 703 px de ancho (cabe en los 866 de la tarjeta) y la pila de s1 queda en y 1172-1471.

## Cara de Lucía visible (gate nuevo `scripts/cara-visible.mjs`)

SCRFD det_10g (el detector del face-gate) sobre un cuadro exacto cada 0,5 s del master (t = 0, 0,5 … 14,5; 30 muestras), cara ≥ 200 px de ancho en el lienzo: **30 de 30 = 100,0 %** (mínimo exigido > 50 %, objetivo ≥ 85 %). Caras más grandes por escena: 472-479 px (s1 y s3), 262-265 px (s2, la de R3; la de K4 mide 237 px); la muestra de 8,0 s ya cae en reposo de la escena 3 (478 px). `qa/cara-visible.txt` y `qa/cara-visible.json` traen las 30 muestras. El build **predice** lo mismo desde el plan (30 de 30: cuenta solo las muestras en reposo de una escena, no las que caen a mitad de un empuje) y rechaza un plan con < 85 %. **Pruebas negativas:** un master estropeado con fondo negro desde 8,1 s da 17 de 30 = 56,7 % (exit 1, bajo el objetivo) y desde 2,8 s da 6 de 30 = 20 % (exit 1, bajo la mitad): `qa/negativas-cara-visible.txt`.

## Decisiones (y cómo revertirlas)

1. **El beat C sigue siendo «Casi copia: no prueba identidad.»** (desviación (a) de lo propuesto por la madre marketing: «Casi copia ≠ misma persona»). «≠ misma persona» afirma que la imagen NO es ella y lo medido no lo sostiene: sin las 4 fotos recibidas sigue en 0,74 (sobre el piso) y las otras siete caen en el rango de fotos reales entre sí (0,51 a 0,72). Lo sostenible es que una casi copia **no prueba** que el motor conserve la identidad. Lo fijó la sesión Lucía (y la pasada del revisor lo confirmó: «Mantené la tercera idea»); el build rechaza la otra redacción y «Era copia, no identidad.». Revertir: `plan.json → textos.beat_c`, la voz (L7), `build.mjs → esperado` y las mutaciones.
2. **Etiqueta del beat B «Con sus otras 7 fotos: 0,56–0,73»** (M1 del revisor; antes «Con las otras 7:»). Sin referente, «Kling baja a 0,56–0,73» se lee como un fallo del motor cuando ese rango es lo normal entre fotos reales de ella, y «otras 7» no decía 7 de qué. Con el guion largo (el rango es una sola afirmación) son **6 palabras** en el contador del repo (con · sus · otras · 7 · fotos · 0,56–0,73; el tope es 6 por beat) y piden 2,4 s de lectura; el beat B tiene 2,5 s. Para ganar esos 0,3 s se adelantó la entrada del beat B 0,25 s y se retrasó su salida 0,08 s (ver 3 y «Pasada del revisor»). El build exige `etiqueta: afirmación`, un solo dato, ≤ 6 palabras y la palabra «fotos»; rechaza «Con las otras 7:» y variantes con > 6 palabras.
3. **Tiempos de los beats** (los fija la lectura, 0,35 s/palabra + 0,3 s, y la voz a 17 car/s a la vez): A 5,875 s, B 7,875 s (llega con el segundo empuje, ahora a 7,625–7,875 s), C 10,292 s, CTA 12,458 s. Con los empujes de 6 cuadros no caben tres escenas más (cada una pide ≥ 2 s): A comparte escena con las dos caras (la comparación K4|R3 que ya se veía), y B, C y el CTA comparten K4 a pantalla completa con salidas y entradas por fundido de 0,1 s que se cruzan 1-2 cuadros (marcadas `data-layout-allow-overlap`; `hyperframes check` aún lo anota como info, no como aviso). Márgenes de lectura (ventana vs. lo que pide): «Misma pose…» 1,708/1,70 s (**0,008 s**), A 1,792/1,70, B 2,5/2,4, C 2,083/2,05, CTA opaco 2,5/2,4: **muy ajustados** (0,008 a 0,10 s); mover un texto más de 1-2 cuadros rompe un gate. **El CTA queda con 2,542 s de exposición** (v2 anterior: 2,625 s); la pasada del revisor fijó el piso en 2,4 s y el build/medir-dom lo exigen en pantalla y en la voz (antes 2,6 s en el cronograma de voz).
4. **El beat A vive sobre las dos caras (K4|R3), no sobre R3 sola:** el 0,93 es el parecido de K4 con R3, y las dos caras con los aros de pose/ventana/taza todavía a la vista lo muestran. Los aros (H5 de la v1.1) siguen: se trazan en 0,6 s y quedan ≥ 1 s a la vista antes del empuje (el último, hasta 7,625 s). **B2 del revisor:** el aro de «pose» es más chico (≤ 130×150 px) y se corrió a la mano y el pelo, lejos de la mandíbula (K4 elipse cx 427 cy 1146 rx 156 ry 171 en el lienzo; R3 cx 795 cy 1334 rx 130 ry 184), sin tocar el aro de la taza; el build lo mide (tamaño, zona de la mandíbula, ≥ 8 px del aro de la taza) y 4 mutaciones nuevas lo rechazan (la geometría vieja en K4 y en R3, un aro chico sobre la mandíbula y un aro que toca el de la taza). Mirados a resolución completa (`qa/cuadros/f130.jpg`).
5. **Sin «promedio», «piso», «oficiales», «leyenda», «gráfico», «barra» ni «banda» en pantalla, y sin ninguna referencia a un gráfico en el pie:** `grep-prohibidas`, `layout-dom` (cero elementos de gráfico en el DOM) y el build lo rechazan. (En el pie «promedio» y «piso» sí aparecen, pero como texto explicado —la cara promedio de las 8 fotos, el piso de 0,70—, no como parte de un gráfico.)
6. **Cifras grandes en Bricolage 700, no en la mono:** a 112 px la coma de la fuente mono sale separada («0 , 93», H8a de la v1.1).
7. **El rótulo de IA solo está en la escena 1** (0 a 2,75 s, como en la v1.1): quien llegue a mitad ve a Lucía sin la palabra IA; cumple la regla (rótulo desde el cuadro 0, pie abierto con «Personaje hecho con IA» y etiqueta por API). Si la madre lo quiere en todo el reel hay que sumarlo como una segunda «idea» o ceder el lugar de «una sola toma». B1: ahora de **48 px**.
8. **Panel de la escena 2 de 860 px (y 312-1172):** baja 20 px y sube 58 px para que quepan los subtítulos de 48 px, «misma pose…» de 52 px y el beat A sin pasar de y 1490. Las caras siguen ≥ 200 px (237 y 265).
9. **Sin modo `--estatico`** en los gates (aquí todos corren en Chromium real); **Spline Sans Mono** fuera de la composición.
10. **M2: «Mirá una foto suya que recibió.»** (antes «Mirá la foto que recibió.»), en dos líneas de 48 px y la misma caja (y 1194). El artículo definido sugería una sola entrada y no decía que R3 es foto de Lucía: sin «suya» puede leerse como una persona real copiada (`LUCIA.md` §9). Es verdad medida: R3 es una de las 8 fotos oficiales y una de las 6 imágenes que recibió el motor.
11. **Excepción M3, no aplicada: hay 3 cajas de texto antes de los 6 s** (rótulo + título + dato en la escena 1; «Kling O1 Image / una sola toma.», «Mirá una foto suya que recibió.» y «Misma pose, ventana, taza.» en la escena 2). Se hereda de la v1.1 y el revisor lo aceptó como excepción al gate «una idea por vez»: ahí el gate cuenta **grupos** (`plan.grupos`: cada grupo es una idea —título+dato; contexto+foto suya+misma pose—), no cajas. Desde los 5,875 s sí hay un solo beat por cuadro. Revertir (si la madre lo quiere cerrar): dejar una sola frase por escena en `plan.json → textos` y rehacer los tiempos.
12. **No aplicadas por indicación de la sesión Lucía: B3, B5 y B7** (el encargo no las describe; quedan como ideas del revisor sin hacer). No se tocó nada por ellas.

## Pasada del revisor independiente (0 ALTA, 4 MEDIA, 8 BAJA; verificador haiku 11/11 PASS)

| Hallazgo | Estado | Qué se hizo |
|---|---|---|
| **M1** etiqueta del beat B | aplicado | «Con las otras 7:» → «Con sus otras 7 fotos:» (cifra 0,56–0,73 igual; 6 palabras). Para darle sus 2,4 s de lectura se adelantaron los dos empujes 0,25 s (de 3,0 a 2,75 s y de 8,125 a 7,875 s; el beat A entra a 5,875 s, antes 6,04 s, y el B a 7,875 s, antes 8,125 s) y la salida de B, la entrada de C y la del CTA se retrasaron 0,08 s (C 10,208 → 10,292 s, CTA 12,375 → 12,458 s); **los empujes siguen siendo de 6 cuadros** (no se acortó ninguno), sin aire muerto ni cuadros sin tarjeta (0 de 360). CTA 2,542 s |
| **M2** «Mirá la foto que recibió.» | aplicado | «Mirá una foto suya que recibió.», dos líneas de 48 px, misma caja (y 1194) |
| **M3** 3 cajas antes de los 6 s | **NO aplicado** (indicación de la sesión Lucía) | excepción documentada del gate «una idea por vez» (decisión 11) |
| **M4** voz | aplicado con 2 desviaciones | L6 «Con las otras siete, baja el parecido.»; L3 «Mirá una foto suya.» (la línea de 31 caracteres no cabe); 223 caracteres exactos (ver «Voz futura») |
| **B1** rótulo de IA | aplicado | 44 → **48 px** (`plan.json → layout.rotulo_px`); el build, `medir-dom`, `layout-dom` y las mutaciones exigen ahora **TODO texto visible ≥ 48 px, sin excepción**; el rótulo a 47 px se rechaza (mutación del build y prueba negativa del DOM) |
| **B2** aros de pose | aplicado | más chicos y desplazados a la mano y el pelo en K4 y en R3, lejos de la mandíbula y sin tocar el aro de la taza; el build los mide (4 mutaciones nuevas); mirados a resolución completa |
| **B3, B5, B7** | **NO aplicados** (indicación de la sesión Lucía) | ideas sin hacer (decisión 12) |
| **B4** pie | aplicado | el piso se define donde se nombra por primera vez (ver «Pie»); 2.110 caracteres |

Tercera idea «Casi copia: no prueba identidad.» sin cambios (pedido explícito). La v1 y la v1.1 no se tocaron.

## Voz futura (no se genera): cronograma estimado a 17 car/s

`guion-voz.txt`: 8 líneas, **223 caracteres** exactos (python `len` del texto sin el salto final; 224 con él; líneas separadas por 1 salto; cupo de voz 381, tope 255 del build, 15 s a 17 car/s admiten ≈ 255), sin cifras habladas, **una línea por beat** (v1.1: 223; v2 antes de la pasada: 219).

| Línea | Texto | Car. | Voz (s) | Pantalla que cae con ella |
|---|---|---:|---|---|
| L1 | Casi publico esta imagen. | 25 | 0,00–1,47 | título (cuadro 0) |
| L2 | Parecido alto. | 14 | 1,71–2,53 | (acento del dato) |
| L3 | Mirá una foto suya. | 19 | 2,75–3,87 | «Mirá una foto suya que recibió.» (2,75 s, +0,00) |
| L4 | Misma pose, ventana y taza. | 27 | 4,08–5,67 | «Misma pose, ventana, taza.» (4,04 s, −0,04) |
| L5 | Con esa foto, sale más alto. | 28 | 5,92–7,56 | **beat A** (5,875 s, −0,04) |
| L6 | Con las otras siete, baja el parecido. | 38 | 7,79–10,03 | **beat B** (7,875 s, +0,08) |
| L7 | Casi copia: no prueba identidad. | 32 | 10,25–12,13 | **beat C** (10,292 s, +0,04) |
| L8 | Seguime: cada semana, una prueba. | 33 | 12,375–14,32 | **CTA** (12,458 s, +0,08; 2,625 s desde el inicio de la línea; 2,542 s en pantalla; cola sin voz 0,68 s) |

**M4 de la pasada del revisor.** L6 ya no dice «mucho menos» (solo es cierto frente al 0,93 y contradice el pie, que dice que 0,56–0,73 es casi el rango entre sus fotos). **Dos desviaciones respecto del texto pedido:** (1) **L3 queda «Mirá una foto suya.»** y no «Mirá una foto suya que recibió.»: la línea pedida tiene 31 caracteres y su tramo (voz + pausa a 17 car/s) dura 2,04 s; para que «Misma pose…» (4,04 s) no entre antes que su línea, L3 tiene que terminar a las 4,08 s, y con 31 caracteres terminaría a las 4,79 s: «Misma pose…» entraría 0,75 s antes de su línea (tolerancia −0,05 s). El texto de pantalla sí dice «…que recibió.». Una mutación del build rechaza la línea de 31 caracteres. (2) **L6 queda «Con las otras siete, baja el parecido.»** (38 car.) y no «Con las otras siete, baja.» (26): con 26 caracteres el tramo de L6 duraría 1,75 s y terminaría a las 9,54 s, L7 empezaría ahí y el beat C (10,292 s) entraría 0,75 s después del inicio de su línea, fuera de la tolerancia −0,05/+0,5 s. «baja el parecido» no promete nada de más (0,56–0,73 es menos que 0,93, y la voz no dice «mucho»). Conteo resultante: **223** (el pedido era ≈ 212–225).

Cambios frente a la v1.1: L5 ya no dice «mucho más alto» (compara 0,93 con 0,83, no con algo «mucho»): «sale más alto» (una palabra más que el ejemplo de la madre, «Con esa foto, más alto.», porque con 23 caracteres el beat B llegaría 0,54 s después de su línea, > 0,5 s); sale «Mirá el parecido foto por foto.» (la lección queda en el pie). Las pausas entre líneas son de 0,22 a 0,25 s; el único hueco ≥ 0,3 s es la cola tras el CTA. Con voz real: generar y medir cada pista, escribir `duraciones.json`, correr `node scripts/voz.mjs` y `node scripts/retemporizar.mjs` (fallan si una línea se sale de su entrada −0,05/+0,5 s o si el CTA queda bajo 2,4 s) y corregir `plan.json → eventos` (campo `voz`). La voz mide 2,9 palabras por segundo de habla (por debajo de las 3,2-4,1 de PLAN §4-bis): se re-mide con voz real. La pronunciación de «Kling» por la voz Marcela no se midió. Quedan 158 caracteres de cupo en el tope de 381 y 32 en el de 255.

## Pie (`pie.txt`)

**2.110 caracteres** (python `len`; tope 2.200; v1.1: 2.193; v2 antes de la pasada: 2.128). Abre con «Personaje hecho con IA: Lucía Antelo, de @oniahq.», conserva «Nombro lo que uso; no es una recomendación pagada.» y «Una escena, una toma: es una prueba, no una regla.» termina en el carácter 481 (primeros ~500). **B4 de la pasada del revisor:** el piso se define donde se nombra por primera vez. Antes, «y sigue sobre el piso de 0,70» (≈ carácter 1.487) iba antes de «El piso de 0,70 lo elegí yo y es de la cara promedio de las 8 fotos» (≈ 1.641) y el lector veía «piso» sin saber qué era. Ahora la frase `piso` va **justo después de la escala** (carácter ≈ 1.100) y antes de «Kling O1 Image recibió seis imágenes…» y del 0,74: «El piso de 0,70 lo elegí yo y es de la cara promedio de las 8 fotos; no se aplica a una sola foto.» Se reordenó `pF`/`PIE_FRASES` (nuevo orden: ia · historia · copia · nocopia · unaescena · oficiales · porfoto · escala · **piso** · entradas · estricta · otras · ruido · cara · lección · nombro · cierre), `esperado` y las mutaciones que citan el orden; el build rechaza el pie si la primera mención de «piso» no es su definición. **Lo huérfano:** «no se compara con el parecido de una sola foto» se reescribió como «no se aplica a una sola foto» (se queda: aclara que 0,70 es un umbral para la cara promedio de las 8 y no para el 0,93 ni el 0,56–0,73, y se entiende sin ningún gráfico); el pie sigue sin mencionar gráfico, barra, banda, leyenda ni «en pantalla» (el build lo rechaza). Se quedan, con cifras validadas contra las fuentes, el 0,74 («Sin esas 4 fotos baja a 0,74 … no la media de sus cifras»), la escala 0,51-0,72 (promedio 0,64; 28 parejas), el ruido ±0,03, los 677 px de la cara y la lección. Flujo (montaje-hyperframes §12): `node scripts/build.mjs --escribir-pie` (la primera corrida falla a propósito: lee el `pie.txt` viejo) y luego `node scripts/build.mjs` sin flag.

## Lo que se vio (preview 360p real y master)

Mirado: preview 360p real (3 hojas de 10 cuadros, uno cada 12 = cada 0,5 s, `qa/preview-360p-hoja-*.jpg`) antes del master; del master, las mismas 3 hojas a 400 px (`qa/contacto-2fps-*.jpg`, más la de los 30 en una sola, `qa/contacto-2fps.jpg`; **cuadros exactos** `select=not(mod(n,12))`: el filtro `fps=2` de ffmpeg corre hasta 5 cuadros a partir de los 10 s y mostraba el fundido de salida del beat B como si fuera «10,0 s») y a resolución completa los cuadros 0, 24, 66, 72, 100 (aros), 130 (los tres aros), 144, 150, 170, 186, 192 (a mitad del empuje), 200 (beat B), 246-247 (cruce B→C), 270 (beat C), 299 (CTA), 330 y 359 en `qa/cuadros/`.

- **Cuadro 0:** K4 a pantalla completa con rótulo (**48 px**) y título; el dato entra a 0,42 s. Cara de 480 px, ningún texto la toca.
- **Escena 2:** las dos caras (237 y 265 px), los tres aros se ven trazar; con la pasada B2 el aro de pose de K4 queda sobre la mano y el pelo y el de R3 sobre la mano y la manga, ninguno toca la mandíbula ni el aro de la taza (cuadro 130 a resolución completa); los tres textos salen a 5,79 s y a 5,875 s entra el beat A sin hueco.
- **Beats:** «Con esa foto: 0,93» (cifra coral de 112 px) sobre las dos caras; el empuje de 7,625-7,875 s es rígido, sin tiras vacías; «Con sus otras 7 fotos: 0,56–0,73» (cifra verde, etiqueta y cifra cada una en su línea) sobre K4; el cruce B→C dura 2-3 cuadros (cuadros 246-247: B se va, C entra); «Casi copia: / no prueba identidad.»; CTA en dos líneas parejas.
- **Defectos hallados:** ninguno en el master. Observaciones sin corregir: (a) en los cuadros ≈ 139-141 los textos de la escena 2 están a media opacidad mientras entra el beat A: 2-3 cuadros de transición, no un hueco (siempre hay una tarjeta); (b) las franjas y < 312 y y > 1427 de la escena 2 quedan vacías (zona de la interfaz de Instagram); (c) la escena 2 sigue siendo la única con fondo negro grande (de 1427 a 1920 y de 0 a 312), con las dos caras a la vista; (d) el rótulo de IA solo está de 0 a 2,75 s (decisión 7); (e) los márgenes de lectura son de 0,008 a 0,10 s (decisión 3); (f) `hyperframes check` anota 3 info de layout: `cap-k4` desborda a la derecha **a mitad del empuje** (2,5 s: el panel entra deslizándose, intencional) y el beat C queda bajo el CTA opaco durante los 2 cuadros del cruce de 12,5 s (intencional).

## Gates y evidencia (exit codes en `qa/RESUMEN-gates.txt`; `bash scripts/correr-gates.sh [--master]`)

`qa/RESUMEN-gates.txt`: **22 gates, todos exit 0** (build, master-ready, voz, retemporizar, ventanas, hueco-tarjetas, eventos, aire, costuras, medir-dom, layout-dom, grep-prohibidas, lucia-prohibidas, validar-mutaciones, verificar-auditor, negativas-dom, hyperframes-check, pixeles-psnr-fotos, pixeles-vacios, pixeles-aire, zona-segura-pixeles, cara-visible).

| Gate | Exit | Resultado |
|---|---:|---|
| `build.mjs` SIN flag (×3 + los de `correr-gates`) | 0 | datos y pie validados contra PROCEDENCIA l.97, la medición sin refs de entrada (10 imágenes, 80 comparaciones) y `face-gate-v31.json`; textos de pantalla iguales a lo esperado (un solo dato por beat, ≤ 6 palabras, sin lenguaje de gráfico), **tipografía mínima 48 px en todo texto**, orden de los beats y salidas 1-2 cuadros antes de cada entrada, CTA ≥ 2,4 s, aros (tamaño, mandíbula, distancia al aro de la taza, ≥ 0,5 s de trazo y ≥ 1 s a la vista), cara visible predicha 30/30; voz 223 caracteres (cupo 381, tope 255), 360 cuadros; pie 2.110 caracteres y «piso» definido en su primera mención; idempotente |
| `master-ready.mjs` | 0 | fuentes completas, SHA de K4 y R3 |
| `voz.mjs` / `retemporizar.mjs` | 0 / 0 | ESTIMADA a 17 car/s; pausas 0,22-0,25 s; cada entrada cae con su línea (−0,04 a +0,08 s); CTA 2,625 s desde su línea, 2,542 s en pantalla; tabla en `qa/alineacion-voz.txt` |
| `ventanas.mjs` | 0 | 10 textos, cada uno con su ventana de lectura (0,35 s/palabra + 0,3 s): «Misma pose…» 1,708 s (pide 1,70), beat A 1,792 (1,70), beat B 2,50 (2,40), beat C 2,083 (2,05), CTA 2,50 (2,40); los beats no se pisan (20 palabras en 4 beats, 8,55 s pedidos contra 9,04 s) |
| `hueco-tarjetas.mjs` | 0 | 0 de 360 cuadros sin tarjeta |
| `eventos.mjs` | 0 | 25 eventos (entradas, **salidas**, aros que se trazan —a mitad del dibujo entre 5 % y 95 %—, empujes, acentos): cada uno cambia algo visible; hueco máximo 1,5 s |
| `aire.mjs` | 0 | quieto fuera de lectura 0,083 s en el DOM (tope 0,3) y 0,167 s en píxeles (`qa/aire-pixeles.txt`) |
| `costuras.mjs` | 0 | 2 costuras de 6 cuadros (2,75 y 7,875 s), separación 0,000 px, los tiles viajan con su escena |
| `medir-dom.mjs` | 0 | 573 cajas / 360 cuadros, 0 fallos: zona segura, **letra ≥ 48 px en TODO texto, medida nodo por nodo**, sin solape, **una sola idea por cuadro**, sin texto sobre la cara +40 px (margen mínimo mentón-texto 369 px), dato a 0,417 s, CTA 2,5 s |
| `layout-dom.mjs` | 0 | tabla de tamaños (`qa/tamanos.txt`, mínimo 48 px), casilla única de los beats (y 1194), etiqueta y cifra en una línea cada una, «Casi copia: / no prueba identidad.», CTA «Seguime: cada semana, / una prueba.», «Mirá una foto suya / que recibió.» en dos líneas, borde inferior máximo 1471,8 (tope 1490), borde superior mínimo 1172, **0 elementos de gráfico en el DOM** y las tres fotos visibles |
| `grep-prohibidas.mjs` | 0 | 0 coincidencias en pantalla, pie y voz (sin «promedio», «piso», «oficiales», «leyenda», «gráfico», «barra», «banda» en pantalla; sin gráfico en el pie) |
| `node /home/user/onia-hermes/scripts/lucia-prohibidas.mjs pie.txt guion-voz.txt qa/pantalla.txt` | 0 | 0 coincidencias (pie + voz, y pie + voz + pantalla) |
| `validar-mutaciones.mjs` | 0 | **132** alteraciones rechazadas por el motivo esperado (v1.1: 92; v2 antes de la pasada: 115). Nuevas en esta pasada: **M1** etiqueta vieja «Con las otras 7:», etiqueta sin «fotos» y etiqueta de > 6 palabras (3) · **M2** «Mirá la foto que recibió.» y «Mirá una foto que recibió.» sin «suya» (2) · **M4** L6 vuelve a «mucho menos», L3 de 31 caracteres y L3 «Mirá lo que recibió.» (3) · **B1** rótulo a 47, 44, 40 y 36 px, dato, título y subtítulos bajo 48 (varias) · **B2** aros: geometría vieja en K4 y en R3, aro chico sobre la mandíbula, aro que toca el de la taza (4) · **B4** el piso se nombra antes de definirlo y el pie vuelve a hablar de un gráfico (2); además las mutaciones de tiempos se ajustaron a los tiempos nuevos; las escrituras del build quedan bloqueadas durante la prueba |
| `verificar-auditor.mjs` | 0 | regresión del reporte: 5 fallos conservados (CTA ×2, nota ×2, dos ideas a la vez) y letras de 47, 40 y 36 px rechazadas |
| `negativas-dom.mjs` | 0 | **9** alteraciones del HTML rechazadas por su gate (exit 1): una barra/marca de piso y una banda en el DOM, «Promedio de las 4» como texto, la etiqueta del beat A a 40 px, un texto a 36 px, **el rótulo de IA a 47 px**, **dos ideas a la vez** (el beat C siempre visible), y la foto de la escena 3 o de la escena 1 oculta (`qa/negativas-dom.txt`) |
| `hyperframes check` (0.8.142) | 0 | 0 errores · 3 avisos `nested_structure_needs_subcomposition` (no frenan) · layout 3 info (`cap-k4` desborda a la derecha a mitad del empuje de 2,5 s; el beat C bajo el CTA opaco 2 cuadros del cruce; intencionales) · runtime 0/0 · motion 0/0 · contraste 10/10 AA |
| preview 360p real | 0 | `qa/viernes-preview-360p.mp4`, 360×640, 24 fps, 360 cuadros, 15,000 s; mirado antes del master |
| render high + mux AAC | 0 / 0 | ver «Master» |
| `pixeles.mjs psnr-fotos` | 0 | mínimo **37,11 dB** (umbral 35): K4 pantalla completa escena 1 41,33 · escena 3 41,42-41,43 · panel K4 39,18 · panel R3 37,11 |
| `pixeles.mjs vacios` / `aire` | 0 / 0 | 360 cuadros, 0 planos; quietud en píxeles 0,167 s |
| `zona-segura-pixeles.mjs` | 0 | escena 1: texto en y 1172-1471, x 80-999 · escena 3: y 1194-1395, x 80-999 · escena 2: nada sobre el panel (y < 312) y contenido hasta y 1427; límites y 292-1490, x 80-1000 (la caja de las escenas 1 y 3 se mide por diferencia con la foto de K4 llevada al mismo encuadre) |
| **`cara-visible.mjs`** | 0 | **30 de 30 muestras (100 %) con cara ≥ 200 px** (mínimo > 50 %, objetivo ≥ 85 %); negativas: 56,7 % y 20,0 % → exit 1 |
| ArcFace master ↔ fuente (`face-gate.sh` + `arcface-pares.mjs`, 12 pares) | 0 / 0 | diferencia máxima **0,007** (regla ≤ 0,02): escena 1 0,825 contra 0,825; panel K4 0,817-0,818 contra 0,824; panel R3 0,826-0,827 contra 0,822; escena 3 0,829-0,832 contra 0,825 (`qa/arcface-pares.json`, `qa/arcface-final.txt`) |
| Identidad del master (`face-gate.sh` sobre 8 instantes —0 · 1,5 · 3,5 · 5,5 · 7 · 9,5 · 11,5 · 14 s, uno en cada beat— y 2 paneles, y `lucia-qa-tabla.mjs`) | 0 / 0 | 10 imágenes, 0 bajo el piso 0,70 (centroides 0,818-0,833), 0 sin cara, 0 con cara < 200 px (472-479, 262-263, 237 y 265 px): `qa/face-gate.json`, `qa/qa-tabla.md` |
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
2. **Voz: NO existe** (cronograma estimado; ver arriba). 223 de 255 caracteres. L3 («Mirá una foto suya.») y L6 («…baja el parecido.») difieren de lo pedido por tiempos, no por fondo (ver «Voz futura»); L5 («sale más alto») difiere de lo propuesto por la madre marketing por lo mismo. «Mucho menos» ya no se dice: el 0,56 a 0,73 queda cerca de las fotos reales entre sí.
3. **Márgenes de lectura muy ajustados** (decisión 3): «Misma pose…» pasa por 0,008 s y los beats por 0,03 a 0,10 s sobre lo que pide la regla de 0,35 s/palabra + 0,3 s. A velocidad real de lectura de Instagram (≈ 3 palabras/s) hay holgura: cada beat dura 1,8 a 2,5 s y tiene 4-6 palabras. El CTA queda con 2,542 s de exposición (el piso del encargo es 2,4 s).
4. **El rótulo de IA solo está de 0 a 2,75 s** (decisión 7); la cara está a la vista el 100 % del tiempo.
5. **Pose, ventana, taza** miradas a ojo, no medidas; la imagen no es pixel-copia. Los aros de pose se dibujan sobre la mano y el pelo (no sobre la mandíbula) y se miraron a resolución completa; su posición exacta es a ojo.
6. **Instagram:** no se simuló la interfaz; todo texto está entre x 80 y 1000 y entre y 1172 y 1471 (s1), 1194 y 1427 (s2), 1194 y 1395 (s3).
7. Los PNG originales de K4 y R3 no están en git (los ignoran sus carpetas): el build falla con un mensaje claro si faltan o si su SHA cambia.
8. El render se hizo en modo «screenshot» (el Chromium completo no expone `HeadlessExperimental`): PSNR ≥ 37 dB y ArcFace ≤ 0,007 muestran que no degradó la imagen.
9. `qa/viernes-preview-360p.mp4` y las hojas son evidencia: no son para publicar.
10. **C2** (carrusel del miércoles) dice lo mismo del 0,74 («sin esas 4 fotos baja a 0,74») pero no trae la escala de las fotos oficiales ni la aclaración del piso (fuera de esta carpeta, no se tocó).
11. **Ideas del revisor sin hacer:** M3 (excepción, decisión 11), B3, B5 y B7 (decisión 12). Si la madre quiere cerrar M3, es un cambio de guion de la escena 1-2, no de gates.
