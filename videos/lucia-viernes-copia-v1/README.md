# Viernes · «Casi publico este 0,83» (El error de la semana) — v1.1

Reel corto del viernes (PLAN.md §4-bis), MUDO, 1080×1920, 24 fps, **360 cuadros / 15,0 s**, con HyperFrames. **0 créditos**, solo material que ya existía: la imagen «café con teclado» de Kling O1 Image (K4, `img-omni-image-k4cafe-dad464de.png`, 1536×2720) y la foto de entrada R3 (`R3_casi_frontal.png`, 1792×2400). La compuso y la renderizó la sesión Lucía (editor, contenedor Linux) el 11-oct-2026 partiendo de la estructura de `videos/lucia-p9-luz-cara` (build que valida cifras contra las fuentes, gates, mutaciones) y de las fotos fijas de G4 v2. **v1.1 = la v1 con la revisión 1 aplicada en un solo ciclo** (`qa/revision-1.md`, 1 ALTA · 2 MEDIA · 5 BAJA; ver «Revisión 1: qué se hizo»). Sin Git, voz, publicación, instalaciones ni descargas. Fuera de esta carpeta no se tocó nada.

<!-- ESTADO -->
**SUPERADA POR LA v2 (`videos/lucia-viernes-copia-v2/`, 11-oct): no publicar este master (SHA `5862aa44…5930`).** La madre marketing decidió simplificar la placa de 6 a 15 s (una idea por pantalla, letra ≥ 48 px, la cara a la vista, datos al pie). Este README queda como historia de la v1.1.
<!-- FIN ESTADO -->

## Master

| Dato | Valor |
|---|---|
| Archivo | `out/viernes-copia-final-1080x1920.mp4` (`out/` y `renders/` no van a git) |
| SHA-256 | `5862aa44b575fd6e8c1b27c3823e2d0f78d4707ddfdee2e5ce670bad3b195930` (`qa/sha-master.txt`) |
| Video | H.264 High, yuv420p, bt709, 1080×1920, 24 fps, 360 cuadros, 15,000 s |
| Audio | AAC LC 48 kHz estéreo, SILENCIO: volumedetect mean −91,0 dB / max −91,0 dB (`qa/aac-silencio.txt`) |
| Tamaño | 2,1 MB (2.154.272 bytes) (el contenido es casi todo estático) |
| `index.html` | md5 `391c281b141aa26f00adfa1dab882548`, idempotente (tres builds, mismo md5; `qa/md5-index.txt`, `qa/idempotencia.txt`) |
| Fuentes | `assets/k4.png`, `assets/k4-panel.png` (enlace al mismo archivo, para que `hyperframes check` no marque dos `<img>` iguales) y `assets/r3.png`; el build exige su SHA-256 (K4 `2a2e9401…7200`, R3 `0dc08193…f756`) y su tamaño. Los PNG originales no van a git: K4 se recupera a 0 cr con `job_display dad464de-75a8-45f5-b799-8d91e5a63d1d` → `rawUrl`, R3 está en `videos/lucia-g4-v2/assets/refs-orig/`. **Nueva fuente (v1.1):** `videos/lucia-p9-luz-cara/qa/face-gate-v31.json` (`refs_internal`: pares entre las 8 oficiales, SHA-256 `a0ce006e…03f2` en `qa/build-status.json`); el build lee su matriz y valida 0,51 / 0,72 / 0,64 antes de escribir nada |
| Render | `hyperframes@0.8.142` (caché de npx; `--prefer-offline`), `--quality high -f 24`, ≈ 40 s de pared; captura por pantallazo (Chromium completo, sin GPU); preview 360p real ≈ 23 s |

## La historia (nada inventado; cada cifra la valida el build contra su fuente)

- **El error.** En la prueba de G4/C2 la imagen «café con teclado» de Kling O1 Image dio **parecido 0,83** con Lucía (PROCEDENCIA.jsonl l.97, `imagen_misma_escena_K1_mismas_6_refs` → `kling_omni_image_K4cafe_dad464de`, 0,5 cr). Casi se publica como buen resultado de ese motor (dentro de «0,79 · 0,35 · 0,83» de la lámina 4 de C2).
- **Pero** esa imagen es casi una copia de una de las fotos que recibió como entrada, **R3**: misma pose (la cabeza apoyada en la mano), misma ventana, misma taza de barro junto a la laptop, con otra ropa y una segunda taza blanca al frente. Esto lo miró el editor a ojo (ver «Decisiones», 4): los aros del video marcan lo que se ve, no se midió.
- **Foto por foto** (`medicion-sin-refs-entrada-20261011.txt`, PRUEBA ESTRICTA PARA LOS MOTORES DE IMAGEN, fila «Kling O1 Image K4»): con **R3 sola 0,927** («0,93»); con las otras siete R1 0,686 · R2 0,619 · R4 0,563 · R5 0,724 · R6 0,659 · R7 0,733 · R8 0,599 (**0,56 a 0,73**). De las **80** comparaciones por foto de las 10 imágenes de esa tabla, la de K4·R3 es la más alta; la siguiente es 0,812.
- **La escala que faltaba (revisión 1, H1).** Entre las propias 8 fotos oficiales, de a dos (28 parejas), el parecido va de **0,509 a 0,719** (promedio **0,642**; ninguna pareja pasa de 0,72). Fuente: `videos/lucia-p9-luz-cara/qa/face-gate-v31.json` → `refs_internal.pairwise_min`, `pairwise_mean` y el máximo fuera de la diagonal de `matrix` (R5↔R6, 0,719). El 0,56 a 0,73 de K4 contra las otras siete cae en ese mismo rango (0,73 pasa 0,72 por 0,01, dentro del ruido de ±0,03): **otra foto de Lucía da lo mismo contra las demás**. El 0,93 con R3 queda muy por encima de cualquier pareja real: esa es la prueba de «casi copia».
- **Qué recibió.** Los motores de imagen de la prueba recibieron como entrada las mismas seis imágenes: R1, R3, R6 y R7 (cuatro de las 8 con que se compara), una selfie y una referencia de ropa. Por eso el número absoluto (contra el promedio de las 8) sale inflado, y **no hay control sin entradas** para decir cuánto.
- **Solo con las 4 fotos que nadie recibió (R2, R4, R5, R8), promedio: 0,743** («0,74»; «sin esas 4 fotos baja a 0,74», igual que el pie de C2), la cara de K4 mide 677 px (≥ 200: confiable). Con 4 fotos el promedio puntúa más bajo que con 8 en las 10 imágenes (de 0,03 a 0,09; en K4, 0,088): esa baja no mide por sí sola la fuga, y sigue sobre el piso de 0,70. El build lo valida (B* − A < 0 en las 10) y el pie lo dice.
- **Una escena, una toma** (en pantalla desde v1.1: «una sola toma.» bajo «Kling O1 Image»; y en el pie, dentro de los primeros 500 caracteres): el mismo motor dio 0,79 (K1) y 0,35 (K2 café: perdió la cara) en otras dos escenas.

## Línea de tiempo y pantalla

| Tiempo | Qué se ve | Texto en pantalla |
|---|---|---|
| 0,00–3,00 (s1) | K4 a pantalla completa, fija. Cuadro 0: rótulo y título | rótulo «Lucía Antelo · personaje IA de Onia» (40 px, y 1190) · título **«Casi publico este 0,83.»** (66 px, cuadro 0) · **0,5 s:** «Kling O1 Image · parecido 0,83» (el primer número, antes de 3 s) · acento 1,75 s |
| 2,75–3,00 | empuje rígido de 6 cuadros | s1 sale a −1080, s2 entra de +1080 |
| 3,00–6,625 (s2) | K4 (izquierda) y R3 (derecha) lado a lado, recortadas al mismo alto, caras visibles (238 y 270 px) | **«Kling O1 Image / una sola toma.»** (H3) · **3,0 s «Mirá la foto que recibió.»** · **4,5 s «Misma pose, ventana, taza.»** con tres aros que **se trazan en 0,6 s cada uno** y quedan a la vista hasta el empuje: pose 4,5 s (1,9 s a la vista) · ventana 4,875 s (1,5 s) · taza 5,25 s (1,1 s) |
| 6,375–6,625 | empuje rígido de 6 cuadros | |
| 6,625–15,0 (placa) | gráfico 0 a 1; **el piso 0,70 solo en la fila del promedio de las 4** | **6,625 s «Con esa foto: 0,93»** (barra, escala «0 · 1») · **7,5 s «Con las otras siete: 0,56 a 0,73»** (siete puntos, uno por foto, sobre una banda gris + leyenda «Fotos oficiales entre sí: 0,51 a 0,72») · **8,25 s «Casi copia: no prueba identidad.»** · **9,25 s «Promedio de las 4 que no recibió: 0,74»** (barra + marca «piso 0,70») · **10,375 s «Mirá el parecido foto por foto.»** · **12,375 s CTA «Seguime: cada semana, una prueba.»** (2,625 s) |

La pila de la placa sigue ahora el orden de entrada (A, B, casi copia, C, lección, CTA): en la v1 «Casi copia» entraba debajo de un hueco donde después llegaba la fila de las 4. Eventos (`plan.json → eventos`): 20, hueco máximo 1,375 s. Zona segura: la pila de texto de s1 está bajo el mentón (mentón y 803, texto desde 1190, termina 1474); s2, texto de 1270 a 1478; placa, de 360 a 1417; nada sobre y 292 ni bajo 1490. Fuentes de marca locales (Bricolage Grotesque 700, DM Sans 500, Spline Sans Mono 500); el cuerpo de las filas es de 48 px, la leyenda de 36 px y la escala de 34 px (ningún texto bajo 34 px).

## Decisiones (y cómo revertirlas)

1. **«Casi copia: no prueba identidad.» en vez de «Era copia, no identidad.»** El encargo traía lo segundo. Lo dejé así porque (a) la imagen no es una copia pixel a pixel (ropa, pelo, una segunda taza blanca con vapor al frente, encuadre), solo casi; y (b) «no era identidad» sobreafirma: sin las 4 fotos recibidas la imagen sigue en 0,74 (> 0,70) y, sin R3 y sin las otras entradas, puntúa como una foto real de ella (H1). Lo que sí se sostiene: una imagen que casi copia una foto de entrada **no prueba** que el motor conserve la identidad. Revertir = `plan.json → textos.nota_copia`, la voz (L6), `build.mjs → esperado` y la mutación; `grep-prohibidas` rechaza «era copia, no identidad». Confirmada por el revisor.
2. **El piso 0,70 va SOLO en la fila del promedio de las 4 (v1.1, H1).** En la v1 cruzaba las tres filas y hacía leer «5 de 7 fotos no pasan»; el 0,70 es del **promedio** (mínimo de «cada oficial contra el promedio de las otras siete» = 0,698) y 23 de las 28 parejas de fotos oficiales quedan bajo 0,70. Ahora el build exige `plan.piso_en = ['fila-c']` y `layout-dom` exige una sola marca, dentro de `#fila-c` (prueba negativa en `qa/mutacion-dom-piso.txt`). En esa fila es conservadora (el promedio de 4 puntúa más bajo que el de 8 en las 10 imágenes). El pie explica que el piso es del promedio de las 8. Quitarlo del todo: borrar `piso` y `escala_piso` de `build.mjs`/`plan.json` y bajar `piso_en` a `[]` (la mutación deja de pedir `['fila-c']`).
3. **«Promedio de las 4 que no recibió: 0,74» (H2) y, en el pie, «Sin esas 4 fotos baja a 0,74» (H4, igual que C2).** Es un promedio y se rotula como tal. El pie añade lo que no cabe en pantalla: con 4 fotos todas las imágenes bajan de 0,03 a 0,09, así que esa baja no mide por sí sola la fuga; no se estima ninguna magnitud (la misma regla que P9: nada de «efecto/ventaja ≈ 0,03», rechazado por el build y las mutaciones). El 0,83 del arranque tampoco decía «promedio»: el pie ahora dice que es contra el promedio de las 8 fotos; en pantalla no se tocó (la ventana del dato no admite una palabra más).
4. **Pose, ventana, taza:** miradas a ojo con los aros; no se midieron. «Misma taza» es la de barro junto a la laptop (K4 suma otra, blanca, al frente, y el pie lo dice desde v1.1). La laptop también coincide (no se rotula: la voz y el texto piden tres cosas; el pie la nombra). K4 muestra a Lucía de ambo (canon: es vestuario, `LUCIA.md` §0; el rótulo dice «personaje IA» y ningún texto habla de profesión). El óvalo de pose de R3 (H5) se ajustó a la zona mano-mejilla (antes cubría antebrazo y manga).
5. **R3 no se nombra en pantalla** («esa foto», «la foto que recibió»); el pie sí («la R3», R1 a R8).
6. **«Una escena, una toma» en pantalla (v1.1, H3):** segunda línea «una sola toma.» del rótulo de K4 (la caja ya era de dos líneas; 0 palabras nuevas en la placa). El pie conserva «Una escena, una toma: es una prueba, no una regla.» y la sube a la primera mitad (termina en el carácter 480).
7. **Texto de s1 bajo el mentón** (y 1190-1474), no arriba como en P9: la cara de K4 ocupa y 201-803 del lienzo y un rótulo en y 300 taparía la frente. Cubre parte de la taza blanca, no la cara.
8. **Fotos con alto y ancho enteros** en los paneles (K4 540×956, R3 657×880: Chromium alinea al píxel de todas formas) para comparar el master contra la foto escalada pixel a pixel.
9. **Sin modo `--estatico`** en los gates (P9 lo tenía para el contenedor de Codex): aquí todos corren en Chromium real.
10. **Aros con `stroke-linecap: butt`:** con remate redondo un aro sin dibujar dejaba un punto naranja visible en el cuadro 72 (lo vio el editor en el primer master).
11. **Los aros ahora SE TRAZAN (v1.1, H5).** Hallazgo propio al medirlos: en la v1 el trazo saltaba de oculto a completo en 2 cuadros porque GSAP redondea `stroke-dashoffset` a enteros y `pathLength="1"` solo tiene dos valores enteros (0 y 1). Ahora `pathLength=1000`, dibujo de 0,6 s con `power1.inOut`, escalonados 4,5 / 4,875 / 5,25 s (el orden del texto «pose, ventana, taza»). El build rechaza un aro que tarde menos de 0,5 s en dibujarse, que quede menos de 1 s a la vista antes del empuje, o con `pathLength` ≠ 1000; `gates.mjs eventos` exige que a mitad del dibujo el trazo esté entre 5 % y 95 %.
12. **Escala de las fotos oficiales en pantalla (v1.1, H1):** la fila de las otras siete trae detrás una banda gris de 0,51 a 0,72 y la leyenda «Fotos oficiales entre sí: 0,51 a 0,72» (7 palabras). Se hizo porque cabe en las ventanas (cada texto desde su entrada: fila de las siete pide 5,2 s y tiene 7,4 s); el costo es densidad (ver H6 abajo). Revertir: quitar `leyenda_oficiales` y la banda de `build.mjs`/`estilos.css` (la banda es lo único que dibuja `pares_oficiales`).

## Voz futura (no se genera): cronograma estimado a 17 car/s

`guion-voz.txt`: 8 líneas, **223 caracteres con saltos** (cupo de voz 381; 15 s a 17 car/s admiten ≈ 255), sin cifras habladas. Se ajustó el texto del encargo para que el cronograma cuadre (el encargo daba 267 caracteres: no cabían en 15 s con el CTA ≥ 2,4 s):

| Línea | Texto | Voz (s) | Pantalla que cae con ella |
|---|---|---|---|
| L1 | Casi publico esta imagen. | 0,00–1,47 | título (cuadro 0) |
| L2 | Parecido alto. | 1,71–2,53 | (acento del dato, 1,75 s) |
| L3 | Mirá la foto que recibió. | 2,75–4,22 | empuje a R3 + «Mirá la foto que recibió.» (3,0 s, +0,25) |
| L4 | Misma pose, ventana y taza. | 4,46–6,05 | «Misma pose, ventana, taza.» + primer aro (4,5 s, +0,04) |
| L5 | Con esa foto, mucho más alto. | 6,29–8,00 | placa + «Con esa foto: 0,93» (6,625 s, +0,33) |
| L6 | Casi copia: no prueba identidad. | 8,21–10,09 | «Casi copia…» (8,25 s, +0,04) |
| L7 | Mirá el parecido foto por foto. | 10,33–12,16 | lección (10,375 s, +0,04) |
| L8 | Seguime: cada semana, una prueba. | 12,375–14,32 | CTA (12,375 s, +0,00); cola sin voz 0,68 s (el único hueco ≥ 0,3 s) |

**H7 (v1.1):** salió «Parecía Lucía.» (insinuaba un engaño que la medición no respalda: la imagen sí puntúa como ella). La madre pidió una línea neutra y verdadera sin reemplazo, pero **sin L2 la voz queda 1,3 s en silencio (de 1,7 a 3,0 s)**: `retemporizar` exige pausas ≤ 0,3 s entre líneas y L3 tiene que empezar con el empuje (±0,25 s), así que el cronograma deja de cuadrar. Quedó **«Parecido alto.»** (14 caracteres, mismo tramo exacto que la anterior: 25 cuadros, nada se mueve): describe lo que el título y el dato dicen en pantalla (0,83), no afirma identidad ni engaño. Si la madre prefiere el silencio, hay que partir L1 o mover el empuje (no se hizo). La voz sigue sin decir el contrapeso (la fila de 0,56 a 0,73 y la de 0,74 solo están en pantalla y pie): decirlo exigiría una cifra o afirmar más de lo que sostiene la medición. Ritmo: 38 palabras en 12,7 s de habla = 3,0 palabras/s (por debajo de las 3,2-4,1 de PLAN §4-bis); se re-mide con voz real.

Con voz real: generar y medir cada pista, escribir `duraciones.json`, correr `node scripts/voz.mjs` y `node scripts/retemporizar.mjs` (fallan si una línea se sale de su entrada ±0,5 s o si el CTA queda bajo 2,4 s) y corregir `plan.json → eventos` (campo `voz`). La pronunciación de «Kling» por la voz Marcela no se midió. Quedan 158 caracteres de cupo para una retoma.

## Revisión 1: qué se hizo (`qa/revision-1.md`)

| Hallazgo | Estado | Qué se hizo / por qué |
|---|---|---|
| H1 ALTA (piso 0,70 sobre cosenos de una foto) | **Resuelto** | Marca y rótulo `piso` fuera de las filas por foto; una sola marca, en la fila del promedio de las 4 (build + `layout-dom` + 4 mutaciones + una prueba negativa del DOM). Escala que faltaba: banda y leyenda «Fotos oficiales entre sí: 0,51 a 0,72» en pantalla, y en el pie (0,51 a 0,72, promedio 0,64, ninguna de las 28 parejas pasa de 0,72). Las cifras salen de `face-gate-v31.json`, validadas por el build (3 mutaciones). Los 0,73 a 0,80 de «fotos reales contra el promedio de las 4» **no se citan**: salen de un script del revisor que no está en el repo |
| H2 MEDIA (0,74 es un promedio) | **Resuelto** | «Promedio de las 4 que no recibió: 0,74» (una línea de 803 px de 866); puntos de 16 a 20 px. Siglas R1…R8 bajo los puntos: **no** (se pisarían: R5 y R7 están a 8 px) |
| H3 MEDIA («una sola toma») | **Resuelto** | Segunda línea del rótulo de K4, 0 palabras nuevas en la placa; mutaciones por ausencia y por otra frase |
| H4 BAJA (pie) | **Resuelto** | Párrafo del 0,74 igual que C2 («Sin esas 4 fotos baja a 0,74»); «Una escena, una toma» a la primera mitad (carácter 480); escala de las fotos oficiales; taza blanca al frente + otra ropa + «no es pixel a pixel»; «casi publico este 0,83 como un buen resultado» (item 4). 2.147 de 2.200 caracteres; 27 mutaciones del pie. **No** se agregó el aviso de R2 y R6 en el límite de 200 px (item 7: sus tamaños no están en una fuente que el build lea) |
| H5 BAJA (aros) | **Resuelto** | Hallazgo propio: eran apariciones por el redondeo de GSAP; ahora se trazan en 0,6 s y quedan 1,1 a 1,9 s; óvalo de R3 en mano-mejilla (decisión 11) |
| H6 BAJA (densidad de la placa) | **Aceptado; empeora** | Ahora 46 palabras en 8,4 s (5,5/s; la v1 tenía 38 y 4,5/s; P9 tuvo 5,4/s): la leyenda de 7 palabras, «Promedio de» y la escala «0 · 1» pagan la corrección de H1/H2. Lectura en orden estricto 18,2 s contra 8,4 s; cada ventana individual se cumple (mínimo de la fila de las siete: 5,2 s pedidos, 7,4 s disponibles). Alternativas si el revisor la quiere más liviana: quitar la leyenda (−7), o la escala «0 · 1» (−2) |
| H7 BAJA (voz) | **Resuelto con una desviación** | «Parecía Lucía.» → «Parecido alto.» (ver «Voz futura»: sin reemplazo el cronograma no cuadra) |
| H8 BAJA (pulido) | **Aceptado sin cambio** | (a) coma separada de la fuente mono, igual que P9; (b) «foto» por «imagen» y la marca de IA después de 3 s: queda el rótulo del cuadro 0 y el pie; (c) «identidad» es jerga: no cabe otra frase en una línea; (d) segunda mitad sin Lucía; (e) interfaz de Instagram: textos entre x 80 y 1000, no se simuló |

## Revisión 2 (v1.1, revisor independiente sonnet + verificador haiku, 11-oct)

Veredicto del revisor: **0 ALTA, 4 MEDIA, 9 BAJA; ninguna cifra ni frase falsa**; H1, H3, H4, H5, H7 resueltos; H2 parcial; H6 y H8 sin cambio.

| Hallazgo | Estado | Qué se hizo |
|---|---|---|
| M1 MEDIA («Promedio de las 4: 0,74» no es la media de las cifras que se ven; 0,743 es el parecido con la cara promedio, las 4 cifras sueltas promedian 0,626) | **Resuelto en el pie** (sin re-render) | El pie dice «contra la cara promedio de las 8 fotos oficiales» y «es el parecido con la cara promedio de solo las 4 … no la media de sus cifras». Pantalla sin cambio. 2 mutaciones nuevas |
| M2 MEDIA (el piso 0,70 sin decir que es decisión del equipo) | **Resuelto en el pie** | «El piso de 0,70 lo elegí yo y es de la cara promedio de las 8 fotos…» (igual que C2). 1 mutación nueva. En pantalla sigue «piso 0,70» |
| M3 MEDIA (la placa no se entiende entera sin sonido; 46 palabras en 8,4 s) | **Abierto, decide la madre** | Dos salidas sin tocar H1: alargar la placa a 17-18 s (PLAN §4-bis admite 15-20 s; el tope de 15 s fue pedido de la madre) o subir la leyenda de 36 a 40 px |
| M4 MEDIA («casi publico este 0,83» pierde sentido si sale después de G4 o C2, que ya traen el 0,83) | **Resuelto por orden de publicación** | `ORDEN-DE-POSTEO-LUCIA.md`: sale antes de G4 y de C2 |
| B6 (voz L5 «mucho más alto» compara 0,93 con 0,83) | Abierto | Se cambia a «más alto» al generar la voz (toca el cronograma; no hay voz aún) |
| B7 (se dice «foto» para imágenes de IA; después de 3 s no queda «IA» en pantalla) | Abierto, igual que H8b | Lo cubren el rótulo del cuadro 0, el pie y la etiqueta de IG |
| B9 (`__pycache__` fuera de la carpeta) | No aplica | `.gitignore` ya lo ignora; no entra a git |
| B1-B5, B8 | Aceptados | Siglas bajo los puntos (se pisarían), textos chicos legibles, aros que rozan la mandíbula, pie sin saltos de línea |

El pie pasó de 2.147 a 2.193 caracteres (tope 2.200). `index.html` no cambió (md5 `391c281b…d033`, el pie no entra al render), así que el master es el mismo.

## Lo que se vio (preview 360p real y master v1.1)

Mirado: preview 360p real (3 hojas de 10 cuadros a 2 fps = los 30 cuadros, `qa/preview-360p-hoja-*.jpg`) antes del master; del master, las mismas 3 hojas a 400 px (`qa/contacto-2fps-*.jpg`, más la de 30 en una sola, `qa/contacto-2fps.jpg`) y a resolución completa los cuadros 0, 24, 72 (entrada de R3), 108, 126 (aro de la ventana a medio trazo), 144 (los tres aros), 160, 216, 288, 350 (el gráfico completo) y 359 (CTA), en `qa/cuadros/`.

- **Cuadro 0:** K4 a pantalla completa, rótulo (40 px) y título «Casi publico este 0,83.»; el dato todavía no está (entra a 0,5 s). Cara entera y limpia.
- **Empuje 1 (2,75–3,0 s)** y **empuje 2 (6,375–6,625 s):** sin tiras vacías ni solapes; el último cuadro de s2 muestra la placa entrando por la derecha.
- **Escena 2:** las dos caras (238 y 270 px) a la vista, «Kling O1 Image / una sola toma.» con la misma altura que «Mirá la foto que recibió.»; los aros se ven trazar (cuadro 126: la ventana a medio dibujo, el aro de pose ya completo); el aro de pose de R3 ahora rodea mano y mejilla y roza la mandíbula, como el de K4 roza la mejilla; ningún texto toca la cara.
- **Placa:** la barra de 0,93 crece a 0,6 s sin piso; la fila de las siete trae sus siete puntos sobre la banda de 0,51 a 0,72 (R5 y R7 sobresalen apenas por la derecha y se pisan entre sí: 8 px); «Casi copia» entra sin hueco encima; la fila de las 4 muestra la barra cruzando la marca «piso 0,70», la única marca de piso del gráfico.
- **Defectos hallados:** ninguno en el master. Observaciones sin corregir: (a) la mitad de abajo de la placa (y > 1417) y la franja de arriba de las escenas 2 y la placa (y < 360) quedan vacías (zona de la interfaz de Instagram); (b) la coma de la fuente mono se ve separada en «0 , 93» (igual que P9); (c) los tiles tienen el fondo del color de la pantalla: solo se ven como tarjeta cuando entra el acento; (d) la leyenda de 36 px queda en ≈ 12 px en el preview de 360 px (legible, pero es el texto más chico); (e) densidad de la placa (H6).

## Gates y evidencia (exit codes en `qa/RESUMEN-gates.txt`; `bash scripts/correr-gates.sh [--master]`)

| Gate | Exit | Resultado |
|---|---:|---|
| `build.mjs` SIN flag (×3) | 0 / 0 / 0 | datos y pie validados contra PROCEDENCIA l.97, la medición sin refs de entrada (10 imágenes, 80 comparaciones, B* − A < 0 en las 10) y **`face-gate-v31.json`** (28 parejas, 0,509 a 0,719, promedio 0,642); fotos con su SHA-256; voz 223 caracteres (cupo 381), 360 cuadros; pie 2.147 caracteres (tope 2.200), «Una escena, una toma» termina en 480; aros ≥ 0,5 s de trazo y ≥ 1 s a la vista; idempotente |
| `master-ready.mjs` | 0 | fuentes completas, SHA de K4 y R3 |
| `voz.mjs` / `retemporizar.mjs` | 0 / 0 | ESTIMADA a 17 car/s; pausas 0,211-0,245 s; L3 empieza con el empuje; CTA 2,625 s; tabla en `qa/alineacion-voz.txt` |
| `ventanas.mjs` | 0 | 12 textos, cada uno con su ventana desde su propia entrada (0,35 s/palabra + 0,3 s); mínimos: tile2 1,917 s (pide 1,7), dato 2,292 s (pide 2,05), fila de las siete 7,375 s (pide 5,2), CTA 2,583 s (pide 2,4). Placa: 46 palabras en 8,4 s (5,5/s; orden estricto 18,2 s) |
| `hueco-tarjetas.mjs` | 0 | 0 de 360 cuadros sin tarjeta |
| `eventos.mjs` | 0 | 20 eventos (entradas, aros que se trazan —a mitad del dibujo el trazo está entre 5 % y 95 %—, barra, empujes, acentos): cada uno cambia algo visible; hueco máximo 1,375 s |
| `aire.mjs` | 0 | quieto fuera de lectura 0,167 s (tope 0,3) en el DOM; 0,167 s en píxeles (`qa/aire-pixeles.txt`) |
| `costuras.mjs` | 0 | 2 costuras de 6 cuadros, separación 0,000 px, los tiles viajan con su escena |
| `medir-dom.mjs` | 0 | 1.238 cajas / 360 cuadros, 0 fallos (zona segura, ≥ 34 px, sin solape, sin texto sobre la cara +40 px, rótulo a 40 px en el cuadro 0, dato antes de 3 s, CTA ≥ 2,4 s) |
| `layout-dom.mjs` | 0 | etiquetas de fila en una línea (803 px la más larga de 866), leyenda 584 px, CTA «Seguime: cada semana, / una prueba.», borde inferior máximo 1478,4; barras, banda (0,509 + 0,210) y puntos coinciden con los datos (±0,004); **una sola marca de piso, en `fila-c`**. Prueba negativa del piso sobre una fila por foto: exit 1 (`qa/mutacion-dom-piso.txt`) |
| `grep-prohibidas.mjs` | 0 | 0 coincidencias en pantalla, pie y voz |
| `node /home/user/onia-hermes/scripts/lucia-prohibidas.mjs pie.txt guion-voz.txt` (y con `qa/pantalla.txt`) | 0 / 0 | 0 coincidencias |
| `validar-mutaciones.mjs` | 0 | **92** alteraciones rechazadas por el motivo esperado (v1: 67). Nuevas o reescritas: piso 0,70 de vuelta sobre una fila por foto (4), «Promedio» ausente, «una sola toma» ausente o distinta, leyenda ausente o con otra cifra, escala oficial distinta de `face-gate-v31.json` (3 en datos y 3 en el pie), «Sin esas 4 fotos baja a 0,74» alterado, taza blanca ausente, «Una escena, una toma» en la segunda mitad, «Parecía Lucía.» de vuelta en la voz, voz sin su segunda línea, aros (corto, tarde, desordenado, `pathLength=1`, hora ≠ evento), pila de la placa fuera de orden; las escrituras del build quedan bloqueadas durante la prueba |
| `verificar-auditor.mjs` | 0 | regresión del reporte |
| `hyperframes check` (0.8.142) | 0 | 0 errores · 3 avisos `nested_structure_needs_subcomposition` (no frenan) · layout 0 problemas / 9 muestras · runtime 0/0 · motion 0/0 · contraste 30/30 AA |
| preview 360p real | 0 | `qa/viernes-preview-360p.mp4`, 360×640, 24 fps, 360 cuadros, 15,000 s; mirado antes del master |
| render high + mux AAC | 0 / 0 | ver «Master» |
| `pixeles.mjs psnr-fotos` | 0 | mínimo **37,18 dB** (umbral 35): K4 pantalla completa 41,34 · panel K4 39,22 · panel R3 37,18 |
| `pixeles.mjs vacios` / `aire` | 0 / 0 | 360 cuadros, 0 planos; quietud en píxeles 0,167 s |
| Zona segura en píxeles | 0 | placa y 360-1417, x 80-999 (51 cuadros); escena 2: nada sobre el panel (y < 370), contenido bajo el panel hasta y 1479 (`qa/zona-segura-pixeles.txt`) |
| ArcFace master ↔ fuente (`face-gate.sh`, 9 pares) | 0 | diferencia máxima **0,006** (regla ≤ 0,02): B1 0,831/0,830/0,831 contra 0,825 de la foto a pantalla completa; panel K4 0,839-0,840 contra 0,838; panel R3 0,834-0,836 contra 0,832 (`qa/arcface-pares.json`, `qa/arcface-final.txt`) |
| Identidad del master (`face-gate.sh` sobre 6 instantes del master + 2 paneles, y `lucia-qa-tabla.mjs`) | 0 / 0 | 8 imágenes, 0 bajo el piso 0,70, 0 sin cara, 0 con cara < 200 px (479, 264-267, 237 y 270 px): `qa/face-gate.json`, `qa/qa-tabla.md`; `leave_one_out_min` 0,698 |
| `node --check` (22 scripts .mjs/.js), `bash -n` (2), `py_compile` (1) y UTF-8 | 0 | `qa/sintaxis.txt`, `qa/utf8.txt` |

Dato lateral (no va a pantalla): R3 medida contra el promedio de las 8 (que la incluye) da ≈ 0,83, igual que K4: la imagen puntúa como la propia foto de referencia.

## Cómo reproducir

Desde `videos/lucia-viernes-copia-v1/`. `hyperframes@0.8.142` ya está en la caché de npx de este contenedor (con `--prefer-offline` no descarga nada). Todo render va bajo `flock /tmp/hf-render.lock`, como proceso hijo directo.

```bash
export PRODUCER_HEADLESS_SHELL_PATH=/opt/pw-browsers/chromium HYPERFRAMES_SKIP_SKILLS=1
export PLAYWRIGHT_MODULE=/opt/node-tools/node_modules/playwright
export FACE_GATE_HOME=…/lucia-face-gate     # fuera del repo (venv con onnxruntime + modelos ya existentes)
$FACE_GATE_HOME/venv/bin/python -I scripts/caras-fotos.py > qa/caras-fotos.json    # SCRFD sobre K4 y R3
node scripts/build.mjs                    # SIN flag; valida cifras, textos, pie y voz; copia fuentes locales y fotos; escribe index.html y qa/tiles.json (--escribir-pie reescribe pie.txt desde las cifras; hay que correr el build dos veces)
bash scripts/correr-gates.sh              # todos los gates sin master; deja qa/RESUMEN-gates.txt
node scripts/borrador-360.mjs && (cd renders/draft360 && flock /tmp/hf-render.lock npx --prefer-offline -y hyperframes@0.8.142 render --quality draft -f 24 -o ../../qa/viernes-preview-360p.mp4)   # preview 360p REAL: mirarlo antes del master
node scripts/master-ready.mjs && flock /tmp/hf-render.lock npx --prefer-offline -y hyperframes@0.8.142 render --quality high -f 24 -o renders/final-raw.mp4
ffmpeg -y -i renders/final-raw.mp4 -f lavfi -t 15 -i anullsrc=r=48000:cl=stereo -map 0:v -map 1:a -c:v copy -c:a aac -b:a 128k -shortest -movflags +faststart out/viernes-copia-final-1080x1920.mp4
sha256sum out/viernes-copia-final-1080x1920.mp4 > qa/sha-master.txt
bash scripts/correr-gates.sh --master     # además psnr-fotos, vacios y aire sobre el master
node scripts/zona-segura-pixeles.mjs      # zona segura medida en píxeles
bash scripts/recortes-arcface.sh out/viernes-copia-final-1080x1920.mp4 <carpeta> && (cd ../.. && FACE_GATE_OUT=videos/lucia-viernes-copia-v1/qa/arcface-pares.json bash .claude/skills/lucia/scripts/face-gate.sh $(cat <carpeta>/args.txt))   # 9 pares master ↔ fuente
(cd ../.. && FACE_GATE_OUT=videos/lucia-viernes-copia-v1/qa/face-gate.json bash .claude/skills/lucia/scripts/face-gate.sh 'videos/lucia-viernes-copia-v1/out/viernes-copia-final-1080x1920.mp4@0,1,2.5,3.5,4.2,5.5' <recortes de los paneles>) && node ../../scripts/lucia-qa-tabla.mjs qa/face-gate.json > qa/qa-tabla.md
```

El render no es reproducible bit a bit entre máquinas (el `index.html` sí). En este contenedor, dos renders del mismo `index.html` dieron el mismo SHA en la v1.

## Dudas abiertas y qué falta

1. **Revisor y verificador:** hechos por la sesión Lucía el 11-oct (ver «Revisión 2»); falta que la madre decida M3 y M4 y escriba «mostrada, publicá el viernes». (Antes: los pone la madre.) Ningún resultado de este README es aprobación visual ni permiso de publicar («mostrada, publicá el viernes»). Falta copiar el master a `videos/lucia-entrega/` cuando se apruebe. La revisión 1 es de la v1: la v1.1 necesita su propia revisión (sobre todo H6, la densidad, y la leyenda de 36 px).
2. **Voz: NO existe** (cronograma estimado; ver arriba). Cupo de voz: 223 de 381. «Parecido alto.» es una desviación del encargo (decisión H7).
3. **Densidad de la placa:** 46 palabras en 8,4 s (5,5 palabras/s). Si el revisor la quiere más liviana, la leyenda de las fotos oficiales (7 palabras) es lo primero que sale sin tocar la corrección de H1: queda el piso solo en la fila del promedio y el contexto va en el pie.
4. **El 0,74 puede leerse como «sin las fotos recibidas igual pasa el piso»** (es cierto) y debilitar el «casi copia». Está dicho con su aclaración en el pie; en pantalla la banda de las fotos oficiales (0,51 a 0,72) y el 0,93 con R3 por encima de cualquier pareja real sostienen el «casi copia».
5. **Pose, ventana, taza** miradas a ojo, no medidas; la imagen no es pixel-copia (decisión 4).
6. **Instagram:** no se simuló la interfaz; a 390 px de ancho el texto de 34-36 px (escala, leyenda) queda en ≈ 12 px y los de 42-50 px en ≈ 15-18 px.
7. Los PNG originales de K4 y R3 no están en git (los ignoran sus carpetas): el build falla con un mensaje claro si faltan o si su SHA cambia.
8. El render se hizo en modo «screenshot» (el Chromium completo no expone `HeadlessExperimental`): PSNR ≥ 37 dB y ArcFace ≤ 0,006 muestran que no degradó la imagen.
9. `qa/viernes-preview-360p.mp4` y las hojas son evidencia: no son para publicar.
10. **C2 y este reel dicen lo mismo del 0,74** («sin esas 4 fotos baja a 0,74»), pero C2 no trae la escala de las fotos oficiales (0,51 a 0,72) ni la aclaración de que el piso es del promedio: si salen en la misma semana, conviene que C2 también la tenga (no se tocó, está fuera de esta carpeta).
