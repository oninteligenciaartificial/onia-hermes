# Lucía · G2 v2 «¿Quién pierde la cara? Seis clips con la misma orden» (27,8 s, 1080x1920, 24 fps, muda y cronometrada para voz)

Re-corte de `videos/lucia-g2/` (58 s, muda, con mucho tiempo muerto) con la regla de aire muerto, hecho en HyperFrames 0.8.142 con el método de `.claude/skills/lucia/montaje-hyperframes.md`. **v2.1 = la v2.0 del re-corte mudo del 11-oct (26,5 s, SHA `36a949e8…532f15`) con la revisión 1 aplicada** (`qa/revision-1.md`: 0 ALTA · 4 MEDIA · 5 BAJA). **v2.2 (11-oct, tarde) = v2.1 + el hallazgo posterior de la sesión Lucía: dos de los seis clips RECIBIERON fotos de las 8 con que se mide** — una etiqueta en la lección para el que sale (Kling O3), la advertencia en el pie para los dos y una prueba negativa del build (sección «Hallazgo posterior»). **Los números de la pantalla no cambian.**
**Costo: 0 créditos** (los mismos clips y la misma foto de G2; las 8 referencias, por curl desde las URL públicas del manifiesto de `v4/qa`; nada de Higgsfield ni de voz).
**Estado: PARA VER POR LA MADRE (preview 360p; v2.2 re-renderizada, SHA abajo). No se publica nada.** La pista de audio es AAC en silencio (−91 dB) a propósito: la voz Marcela se agrega después, cuando haya cupo.

**D-N1 (11-oct):** las herramientas SÍ se nombran, como uso propio y no como recomendación pagada: **Kling 3.0 std** (clip 1), **Kling 3.0 pro** (2), **Seedance 2.0 Mini** (3), **Seedance 2.0 Mini + referencias** (4), **Kling O3** (5), **Cinematic Studio 3.0** (6). En pantalla salen tres (Kling 3.0 std, Seedance 2.0 Mini y Kling O3); los otros tres van en el pie con sus números. Sigue prohibido: logos, capturas de interfaces de terceros, «el mejor», recomendaciones y «la foto sola pierde la cara» como regla (`scripts/prohibidas.mjs`; Higgsfield y ArcFace están permitidos solo en el pie).

| Qué | Dónde |
|---|---|
| **Guion de voz** (UNA línea por tramo; 14 líneas, **402 caracteres** con espacios, 72 palabras; **no se generó audio**) | `guion-voz.txt` |
| Cronograma de la voz (17 caracteres/s o duraciones reales; tabla caben / no caben) | `scripts/voz.mjs`, `qa/voz-caben.txt`, `qa/tramos-voz.json` |
| Plan declarativo (los tiempos son anclas: «T6+0.8» = inicio del tramo 6 más 0,8 s; «T7-6f» = 6 cuadros antes del tramo 7; «T10-3f»; «FIN») | `plan.json` |
| Plan con TODOS los tiempos resueltos (lo leen los controles; trae los 14 tramos y las lecturas) | `plan.resuelto.json` |
| Generador: lee `guion-voz.txt`, deriva los tramos, **valida reglas y números contra `v4/PROCEDENCIA.jsonl` (línea 97)** y escribe `index.html` | `scripts/build.mjs` + `estilos.css` + `timeline.js` + `prohibidas.mjs` + `voz.mjs` |
| Final 1080x1920 con AAC en silencio (git lo ignora, 32 MB) | `out/g2-v2-final-1080x1920.mp4` |
| Preview 360p REAL (render de HyperFrames de la misma composición a 360x640; 1,8 MB) | `qa/g2-v2-preview-360p.mp4` |
| Pie para publicar (abre con «Personaje hecho con IA»; lo valida `build.mjs`; **v2.2: lleva la advertencia de las fotos recibidas**, 2.011 caracteres de 2.200) | `pie.txt` |
| **Prueba negativa del build** (32 mutaciones del pie, de la pantalla y de las cifras; cada una debe rechazarse por su motivo) | `scripts/validar-mutaciones.mjs` → `qa/validar-mutaciones.txt` |
| Portada sugerida (1,7 s: pregunta, resultado, rótulo y las 6 miniaturas) | `qa/portada-1.7s.jpg` |
| Voz, para después: mide y mezcla las 14 pistas (adaptado de `lucia-g5-v2`) | `scripts/poner-voz.mjs` |

## Revisión 1 (11-oct): qué se hizo con cada hallazgo
| H | Estado | Qué y por qué |
|---|---|---|
| **H1** voz | **hecho (texto y tramos; sin voz)** | La voz se mide en **caracteres a 17 por segundo** (G1 v2), no en palabras (3,6 pal/s eran 20 c/s). `scripts/voz.mjs` deriva cada tramo = caracteres/17 + hueco (≤ 0,25 s; ≤ 0,30 si la lectura de una tarjeta lo pide: L1, L2 y L11). `guion-voz.txt` se acortó/reescribió: **402 caracteres** (antes 434; cupo de voz que queda hoy 381 hasta el 13-oct 01:17 UTC: **faltan ≈ 21**; con retomas ×1,3 ≈ 520). Tabla caben / no caben en `qa/voz-caben.txt`: las 14 líneas caben a 17 c/s (ninguna pisa, huecos 0,21-0,29 s); a 16 c/s tampoco pisa ninguna; a 18 c/s dejan 0,26-0,40 s y 11 de las 13 pasan de 0,30 (la sensibilidad de ±1 c/s: con voz real se re-derivan los tramos con `poner-voz.mjs --medir` + `build.mjs`). 12 de las 14 líneas caen en las ventanas de caracteres de la revisión; L4 (14 car) y L7 (25 car) quedan fuera de ellas, pero el tramo se deriva de la línea. **Las costuras se movieron** (T3 3,417 → 3,750 s; el video 26,5 → 27,8 s, tabla en `qa/voz-caben.txt`): H6 exige alargar tarjetas y el gancho solo necesita +0,33 s para que c1 y c2 alcancen su lectura. Se **retira** del README la frase «cada empuje cae dentro de un hueco»: con la voz estimada el empuje de 0,25 s cubre el hueco de 0,21-0,25 s y puede pisar hasta 1 cuadro de la voz; con voz real se mide. |
| **H2** gancho | **hecho** | La **pregunta** va primero y ya está en el cuadro 0: c1 «¿Quién pierde la cara?» (4 palabras). Pastilla **«parecido final: 0,64 a 0,82»** (rango de los seis finales: 0,644 Seedance 2.0 Mini y 0,824 Kling O3; `build.mjs` lo calcula de PROCEDENCIA) legible de 0,96 a 3,63 s, a 46 px, entre el rótulo y las miniaturas (y = 838-932). c2 «Misma orden. Seis clips.» a 1,79 s. Rótulo «Lucía Antelo · personaje IA de Onia» a 40 px desde el cuadro 0 (hasta los 3,0 s). Corte del gancho: **3,75 s** (no 3,417): la lectura lo exige (c1 1,75 s y c2 1,79 s legibles, holgura +0,05 y +0,09). |
| **H3** «misma foto» | **hecho** | Ya no se dice «misma foto»: tarjeta «Misma orden. Seis clips.», voz L2 «Seis clips con la misma orden.» y pie «cinco partieron de la misma foto y Kling O3 fue solo referencias, sin foto de arranque». La placa y la tarjeta c7 ya decían «foto sola» / «referencias» / «solo referencias». |
| **H4** los tres que se quitaron | **hecho** | El pie lleva UNA oración con los tres, sus créditos y sus números y que no cupieron: Kling 3.0 pro (9 cr, 0,81 a 0,74), Seedance 2.0 Mini + referencias (6 cr, 0,71 a 0,80) y Cinematic Studio 3.0 (20 cr, clip de 4 s, con la foto sola, 0,79 a 0,77: dentro del ruido). `build.mjs` verifica esos números contra PROCEDENCIA y `prohibidas.mjs` corta cualquier «la foto sola pierde» / «pagar más no» general. La tarjeta c9 («Con referencias, la cara se sostiene.») no se tocó: es cierta para los dos clips con referencias. |
| **H5** límites | **hecho (pie)** | El pie dice: se ven los primeros 2,8 a 4,5 s de cada clip, el parecido final es el del segundo 5,9, las caras miden de 89 a 179 px en el clip (el gate marca «poco confiable» bajo 200) y los números son orientativos (±0,03). Los 2,8-4,5 s y los 89-179 px los calcula `build.mjs` (plan y `caras-por-clip.json`). **No hecho (opcional):** subir la nota «Final = segundo 5,9…» de la placa a la primera tarjeta de clip: añadiría una pastilla de 8 palabras sobre el mentón en las tres escenas de clip, con ventanas de 1,7-2,2 s; el límite ya está en el pie. |
| **H6** ventanas | **hecho** | `scripts/ventanas.mjs` mide ahora las **12 tarjetas** además de los 22 textos (34 en total). Midiendo en el DOM c1, c2, c8 y c11 estaban 0,01-0,16 s cortas; se alargaron (c1/c2 por el gancho de 3,75 s; c8 y c11 empiezan 3 cuadros antes de su línea de voz; L1, L2 y L11 con hueco 0,28-0,29 s). Resultado: **34 de 34 ok; menor holgura +0,05 s (c1)**, c2 +0,09, c11 +0,08, c9 +0,10, c7 +0,14. |
| **H7** redacción | **hecho** | «atado» fuera (voz y pie: «foto sola»); L9 recortada a «…sostiene.» como proponía la revisión; «Kling tres» / «Kling O tres» se mantienen (la pantalla trae el nombre completo). **«O3» legible** (opcional, hecho): la O de Bricolage se leía «03»; el «O3» de la tarjeta c7 va en DM Sans 500 con contorno de 2 px (comparado a 2x contra el cero de «3.0») y en la placa ya es DM Sans. **No hecho:** las miniaturas numeradas 1-6 que no se retoman (no es un error; la placa dice «3 de los 6 clips»). |
| **H8** pie | **hecho** | Higgsfield (créditos de Higgsfield, precios del 8-oct), la orden literal en inglés (PROCEDENCIA l.95), con qué se mide (ArcFace, de 0 a 1, contra 8 fotos oficiales), el piso 0,70 «lo elegí yo», créditos y números de los seis, límites, «Nombro lo que uso; no es una recomendación pagada.» y los 4 hashtags. Abre literal con «Personaje hecho con IA». 1.435 caracteres (tope de Instagram 2.200). |
| **H9** fuentes únicas | **hecho** | Reescritos el guion `hermes-content/docs/cola/lucia-diario/guiones/G2-la-misma-foto-seis-clips.md` (cuerpo v2, pie, tabla «sale / no sale», la línea «sin nombres de modelos» que contradecía D-N1) y SOLO las dos filas de G2 de `…/lucia-diario/PLAN.md` (L1 y la pieza 4). **No tocado (fuera de alcance, para la madre):** la «regla 15» en `edicion-referentes` (la lista llega a la 14) y `lucia/SKILL.md` §0-quater puntos 1-2 («pagar más no la arregla» es falso para Cinematic Studio 3.0). El master no se copió a `videos/lucia-entrega/`. El `index.html` del render es el final (md5 en `qa/specs-final.txt`); dos builds dan el mismo md5. |

## Hallazgo posterior (11-oct, sesión Lucía): dos de los seis clips RECIBIERON fotos de las 8 con que se mide el parecido
**Qué se encontró.** El parecido se puntúa contra el centroide de 8 fotos oficiales (R1-R8). Con `job_display` (0 cr) la sesión Lucía verificó qué recibió cada clip como entrada: dos de los seis llevaron fotos de esas 8. **Fuente única de las cifras:** `hermes-content/references/modelos/lucia/v4/prueba-motores-20261008/medicion-sin-refs-entrada-20261011.txt` (medidor `.claude/skills/lucia/scripts/parecido_sin_refs.py`; la columna A reproduce PROCEDENCIA l.97 en los 25 puntos, diferencia ≤ 0,0005). `build.mjs` lee ese archivo y **corta si una cifra de `plan.json → fuga_refs` no coincide** (fotos recibidas, imágenes de entrada, tamaño de cara y exceso).

| Clip | Entradas | Entre las 8 | Exceso atribuible a la fuga (B−A menos controles) | ¿Sale en pantalla? | Qué se hizo |
|---|---|---|---|---|---|
| **Seedance 2.0 Mini + referencias** (6 cr) | foto de inicio K1 + 3 referencias (R1, R3 y la selfie «look ancla»; K1 y la selfie no están entre las 8) | **2 de 8** (R1, R3) | **≈ 0,026** (B−A bruto −0,042: casi todo es del subconjunto) | **No** (va solo en el pie, con sus números) | **Solo el pie** (la pantalla no cambia por él) |
| **Kling O3** (6 cr) | 5 referencias (R1, R3, R6, R7 y la selfie), sin foto de arranque | **4 de 8** (R1, R3, R6, R7) | **≈ 0,012** (B−A bruto −0,068); cara de **89-168 px** (0 de 7 puntos ≥ 200 px: poco confiable) | **Sí** (clip de 13,8 a 18,25 s y barra de la lección) | **Etiqueta en pantalla + pie** |
| Kling 3.0 std · Kling 3.0 pro · Seedance 2.0 Mini (sin referencias) · Cinematic Studio 3.0 | foto de inicio sola | 0 | — | Kling 3.0 std y Seedance 2.0 Mini sí salen en pantalla; Kling 3.0 pro y Cinematic Studio 3.0 solo en el pie | nada: no recibieron ninguna (la sesión Lucía lo verificó con `job_display`; la medición usa a Kling 3.0 std, Seedance 2.0 Mini y Cinematic Studio 3.0 como controles, Kling 3.0 pro no entra en ella) |

**Lectura (de la medición, sin opinión):** medido contra solo las fotos no recibidas el parecido baja (B−A: −0,042 en Seedance + referencias, −0,068 en Kling O3), pero **casi todo es efecto del subconjunto de fotos**: R2, R4 y R8 puntúan bajo en los cinco clips (0,41-0,65), y un centroide de 4 o 6 fotos no puntúa como uno de 8. Descontado el control, **el exceso atribuible es ≈ 0,026 (Seedance + referencias) y ≈ 0,012 (Kling O3), ambos dentro del ruido de ±0,03.** Por eso **NO se cambian los números de la pantalla** (siguen los de PROCEDENCIA l.97: 0,80 → 0,82 en Kling O3) y **sí se DICE**.

**Qué cambió (v2.2):**
1. **Pie (`pie.txt`):** una advertencia entre «Los otros tres no cupieron…» y «Límites»: «Dos de los seis clips recibieron fotos de referencia como entrada; los otros cuatro, ninguna: Seedance 2.0 Mini + referencias (3 imágenes, 2 de ellas entre las 8 fotos con que se mide) y Kling O3 (5 imágenes, 4 de ellas entre las 8). Medido sin esas fotos y descontado el efecto de usar menos fotos, el exceso atribuible es de ≈ 0,026 en Seedance 2.0 Mini + referencias y ≈ 0,012 en Kling O3, dentro del ruido de ±0,03; los números del video no se corrigieron. En Kling O3 la cara mide solo 89 a 168 px: poco confiable.» Sigue abriendo con «Personaje hecho con IA» y conserva «Nombro lo que uso; no es una recomendación pagada.». **2.011 caracteres** de 2.200 (antes 1.491; `build.mjs` ahora exige el tope). Se escribe 0,026 y no «0,03» para que el exceso no parezca igual al ruido (0,026 < 0,03, al borde).
2. **Pantalla (solo Kling O3, que es el único que sale):** etiqueta **«recibió 4 de las 8 fotos de puntaje»** (8 palabras, ≤ 12; el 4 y el 8 salen de la medición y de `plan.refs.total`, no están escritos a mano) en la fila de Kling O3 de la placa de la lección, a la derecha del nombre (x = 272, y = 808-865, 34 px, fondo opaco: la línea de «mi piso» pasa detrás). **Entra a 19,65 s** (justo después del anillo, 19,50 s) y se queda hasta el empuje de salida: ventana legible medida en el DOM **19,75-24,88 s = 5,13 s (pide 3,10; holgura +2,03)**. «fotos de puntaje» y no «de referencia» a propósito: la regla ya llamó «fotos de referencia» a las 8 del puntaje (placa de la regla) y a las entradas de Kling O3 («solo referencias»); la etiqueta separa las dos cosas.
   **Por qué en la lección y no sobre el clip de Kling O3 (13,8-18,25 s):** esa escena ya lleva una tarjeta de 6 palabras y dos pastillas de dato con holgura de lectura de +0,14 y +0,32 s (c7, dB-m5): una etiqueta más rompe ventanas o tapa la mano. La lección es donde se hace la afirmación («Con referencias, la cara se sostiene.») y la etiqueta convive con su barra 5 s.
3. **`scripts/build.mjs`:** valida `fuga_refs` contra la medición; si un clip con fotos recibidas **sale en pantalla y no lleva etiqueta, no hay build**; el pie debe traer la advertencia con sus cifras. **`scripts/validar-mutaciones.mjs`:** 32 mutaciones (borrar la advertencia entera o una parte, falsear un exceso o un tamaño de cara, quitar la etiqueta, cambiar `de_las_8`…) y cada una se rechaza por su motivo (`qa/validar-mutaciones.txt`). `eventos.mjs` cuenta la etiqueta como evento nuevo.

**Qué NO cambió:** los números de la pantalla y del pie (0,79→0,72 · 0,69→0,64 · 0,80→0,82 · 0,64 a 0,82 de la pastilla), la voz (14 líneas, 402 caracteres, mismos tramos), las 12 tarjetas, las costuras, los clips y la duración (667 cuadros, 27,792 s). Los clips de Seedance 2.0 Mini + referencias y de Kling O3 no se tocaron.

**Dudas para la madre:**
1. **La advertencia es visual y escrita; la voz no la dice** (la pieza es muda y la voz L9 «sostiene» / L11 «Con referencias, la cara se sostiene.» queda igual: es cierta para los dos clips con referencias, pero con la salvedad de arriba). Decirla en voz cuesta ≈ 35 caracteres y ya faltan ≈ 21 para el cupo (402 contra 381); no se tocó la voz.
2. **«Dentro del ruido» con 0,026 contra ±0,03 está al borde.** El pie lo dice con el número exacto; si se prefiere ser más estricto, cambiar «dentro del ruido» por «en el borde del ruido» en `pie.txt` y en las mutaciones.
3. **Etiqueta solo en la lección.** Si se la quiere también sobre el clip de Kling O3, hay que alargar su escena (+0,5 s) o quitar la pastilla «parecido 0 s» de ese clip; no se hizo para no romper las holguras de lectura.
4. **Kling 3.0 pro** no está entre los controles de la medición (sin entradas según la sesión Lucía): «los otros cuatro, ninguna» descansa en esa verificación con `job_display`, no en un número medido.

## Voz: los 14 tramos (17 caracteres por segundo; hueco = silencio hasta la línea siguiente)
| T | Línea de voz | Car | Inicio (s) | Tramo (s) | Hueco a 17 c/s |
|---|---|--:|---:|---:|---:|
| T1 | «¿Quién pierde la cara?» | 22 | 0,125 | 1,583 | 0,29 (extendido) |
| T2 | «Seis clips con la misma orden.» | 30 | 1,708 | 2,042 | 0,28 (extendido) |
| T3 | «Se mide contra ocho fotos suyas.» | 32 | 3,750 | 2,125 | 0,24 |
| T4 | «De cero a uno.» | 14 | 5,875 | 1,042 | 0,22 |
| T5 | «Mi piso: cero setenta.» | 22 | 6,917 | 1,542 | 0,25 |
| T6 | «Kling tres, foto sola: pierde parecido.» | 39 | 8,458 | 2,542 | 0,25 |
| T7 | «Seedance Mini, foto sola.» | 25 | 11,000 | 1,708 | 0,24 |
| T8 | «Queda bajo el piso.» | 19 | 12,708 | 1,333 | 0,22 |
| T9 | «Kling O tres, solo referencias: sostiene.» | 41 | 14,042 | 2,625 | 0,21 |
| T10 | «Pero inventó el cuarto.» | 23 | 16,667 | 1,583 | 0,23 |
| T11 | «Con referencias, la cara se sostiene.» | 37 | 18,250 | 2,458 | 0,28 (extendido) |
| T12 | «Pero el motor inventa la escena.» | 32 | 20,708 | 2,125 | 0,24 |
| T13 | «Una toma por clip: es una prueba.» | 33 | 22,833 | 2,167 | 0,23 |
| T14 | «Seguime: cada semana, una prueba.» | 33 | 25,000 | 2,792 | cola 0,85 s sin voz |

Los nombres: la voz dice «Kling», «Seedance Mini» y «Kling O tres»; la pantalla lee «Kling 3.0 std», «Seedance 2.0 Mini» y «Kling O3». Los números solo se leen. Después de la última línea quedan **0,85 s sin voz** (el CTA se lee 2,79 s, ≥ 2,4 s). Con voz real: `node scripts/poner-voz.mjs --medir DIR` (escribe `duraciones.json`), `node scripts/build.mjs` (re-deriva todos los tiempos), controles, render y mux en silencio; recién después `poner-voz.mjs DIR` (mezcla a −14 LUFS, mide huecos y pico). Si una línea real dura más que su tramo se acorta el texto, no se acelera la voz. Probado solo con pistas sintéticas en una copia temporal (la carpeta no lleva `duraciones.json`).

## Tabla de cortes (t en s; los empujes de 6 cuadros caen en [T−0,25, T])
| t (s) | Capa | Texto en pantalla |
|---|---|---|
| 0,000 – 3,750 | **Foto K1** a pantalla completa con empuje lento 1,00 → 1,05 hacia la cara + las **6 miniaturas** + la **pastilla del resultado** | rótulo del cuadro 0 a los 3,0 s (40 px) · **«¿Quién pierde la cara?» en el cuadro 0** (0 – 1,792; «la cara?» se enciende a 0,95) · miniaturas 0,75 – 1,35 s (a la vista desde 1,5 s) · **«parecido final: 0,64 a 0,82»** (0,85 – 3,5) · «Misma orden. Seis clips.» (1,792 – 3,75; «Seis clips.» se enciende a 2,75) |
| 3,500 – 8,458 | **Placa de la regla**: 5 de las 8 referencias, escala 0-1, marca en 0,70 | «Se mide contra 8 fotos suyas.» (3,75 – 6,667) · referencias desde 4,05 s · «5 de las 8 fotos de referencia» · escala a T4 · «Mi piso: 0,70.» (6,667 – 8,458) |
| 8,208 – 11,000 | **Kling 3.0 std** a 1× (2,8 s) | tarjeta «Kling 3.0 std / 7,5 créditos» · «parecido 0 s: 0,79» · «→ 5,9 s: 0,72» |
| 10,750 – 14,042 | **Seedance 2.0 Mini** a 1× (3,3 s) | tarjeta «Seedance 2.0 Mini / 6 créditos» · «0,69» → «0,64» · sello «bajo el piso» |
| 13,792 – 18,250 | **Kling O3** a 1× (4,5 s) | tarjeta «Kling O3 · 6 créditos / solo referencias» (14,042 – 16,542) · «0,80» → «0,82» · «Inventó el cuarto.» (16,542 – 18,25) |
| 18,000 – 25,000 | **Placa de la lección**: los finales de los tres en barras, marca en 0,70 | título «Parecido al final: 3 de los 6 clips» · barras en el orden de aparición · rótulos «foto sola / foto sola / referencias» que cambian a «mantiene el cuarto / cambió el plano / inventó el cuarto» · nota «Final = segundo 5,9, que no se ve entero.» · tarjetas «Con referencias, la cara se sostiene.» (18,25) → «Pero inventa la escena.» (20,708) → «Una toma: es una prueba.» (22,708) |
| 24,750 – 27,792 | **Cierre**: el clip K1 de 2,25 a 5,25 s | CTA exacto «Seguime: cada semana, una prueba.» (25,0 – 27,79 = 2,79 s) |

## Qué se quitó de G2 y por qué
| Se quitó | Por qué |
|---|---|
| **Kling 3.0 pro** (9 cr), **Seedance 2.0 Mini + referencias** (6 cr, letrero inventado) y **Cinematic Studio 3.0** (20 cr, foto sola) | no caben en 30 s con su tarjeta y su dato (la voz sumaría ~580 caracteres). **Van en el pie con sus números** (H4). |
| Placa del precio de Cinematic Studio 3.0 («5 créditos por segundo», «4×») | no cabe; el precio de cada herramienta que sale sigue en su tarjeta. |
| Lección 1 (tres arranques y tres finales) y la lección de seis barras | una sola placa de tres barras, **en el orden de aparición y no por puntaje** (un orden por puntaje sugeriría un ranking). |
| Segmentos de 5 s por clip | cada clip se ve de 2,8 a 4,5 s, recortado a los primeros cuadros. |

## Decisiones que la madre puede revertir
1. **El gancho dura 3,75 s** (la v2.0: 3,417). Con c1 y c2 de 4 palabras cada una el DOM da +0,05/+0,09 s de holgura; con 3,417 s no alcanzaban (−0,03/−0,16). Alternativa: c2 de 3 palabras («La misma orden.») y volver a 3,417 s.
2. **c2 llega 0,08 s DESPUÉS de que empieza la voz de L2** (c1 tiene que leerse 1,7 s); c8 y c11 llegan 0,125 s ANTES de su voz (la lectura es más rápida que el oído).
3. **Empuje lento 1,00 → 1,05 sobre la foto** del gancho (0 cuadros idénticos). Para una foto fija: `plan.json → medios[foto].zoom = 1`.
4. **«lo elegí yo» está en el pie y en «mi piso», no en la voz.**
5. **Después de la voz quedan 0,85 s de CTA sin voz** (`plan.json → voz.cta_ventana_cuadros`, mínimo 58 = 2,4 s; hoy 67).
6. **Se dice «Kling tres» y «Kling O tres»** (3.0 std y O3); la voz no distingue «std».
7. **«3 de los 6 clips»** en la placa y «Los otros tres no cupieron» en el pie.
8. **El cierre usa el clip de Kling 3.0 std de 2,25 a 5,25 s**; en el final el parecido va de 0,744 a 0,699 (la fuente 0,751 → 0,708): el último cuadro medido queda a 0,001 del piso (±0,01 de medida); no hay cifra sobre ella.
9. **Los tres clips fuera de pantalla** no se pueden meter sin otra pieza: cada herramienta más cuesta ~2,5 s de pantalla y ~40 caracteres de voz.

## Para la madre (fuera de esta carpeta)
- **Cupo de voz:** 402 caracteres contra 381; la voz definitiva espera la renovación (13-oct 01:17 UTC) o se recorta ≈ 21 caracteres (cada línea que se acorta acorta su tramo: `node scripts/build.mjs` dice si alguna tarjeta deja de leerse). Con retomas ≈ 520.
- **`lucia/SKILL.md` §0-quater (1-2) y `PLAN.md` fila L1:** «pagar más no la arregla» se corrigió en `PLAN.md` y en el guion; la skill sigue diciéndolo (Cinematic Studio 3.0, 20 cr, foto sola: 0,79 → 0,77 dentro del ruido). La «regla 15» de `edicion-referentes` no está escrita (la lista llega a la 14).
- **Trampas nuevas para `montaje-hyperframes.md`:** (1) **un tramo de voz se mide en caracteres a 17 c/s, no en palabras** (G2 v2.0: 3,6 pal/s = 20 c/s, cinco líneas pisaban a la siguiente); (2) **las tarjetas se miden en el DOM junto con los demás textos** (el script de la v2.0 decía «todas alcanzan» sin medirlas); (3) **la duración de la raíz se redondea hacia abajo a 6 decimales** (667/24 = 27,791666…: con 27,791667 el render cuenta un cuadro de más); (4) **la O de «O3» se lee como un cero en Bricolage Grotesque**: DM Sans 500 + contorno de 2 px (G2 v2.1); (5) `data-start` se redondea hacia ABAJO (`floor` a 6 decimales, v2.0); (6) el aire se mide contando píxeles que cambian, no la diferencia media (v2.0).
- **Nombres a confirmar antes de publicar:** `Kling 3.0 std`, `Seedance 2.0 Mini`, `Kling O3`, `Kling 3.0 pro`, `Cinematic Studio 3.0` salen de `PLAN.md` §4-bis y de las claves de PROCEDENCIA; no se consultó Higgsfield en vivo.
- **Verlo en el teléfono con la interfaz de Instagram** antes de publicar (rótulo en y = 720-802, pastilla en y = 838-932, CTA en y = 1234-1470, dentro de la zona segura medida). La etiqueta «Información de IA» va por API (`ig-reel.mjs --cuenta lucia` en el VPS, la madre).

## QA medido (final `out/g2-v2-final-1080x1920.mp4`; scripts en `scripts/`, resultados en `qa/`)
| Control | Resultado | Archivo |
|---|---|---|
| `hyperframes check` | exit 0 · **0 errores**; runtime y motion sin avisos; 5 avisos informativos de layout (texto de tarjeta que viaja fuera del lienzo durante un empuje); contraste **40/40 AA**; 19 avisos de estilo que no frenan | `hyperframes-check.txt` |
| `build.mjs` (reglas) | exit 0 · tarjetas ≤ 6 palabras y ≥ 0,35 s/palabra + 0,3; textos que no son tarjeta (22) ≥ lo mismo; líneas de voz que caben a 17 c/s (hueco 0 a 0,30 s) y ≤ 450 caracteres; CTA exacto 2,4-5,5 s; pie con sus números (los 6 clips) contra PROCEDENCIA; 26-30 s | `tabla-de-cortes-y-lecturas.txt` |
| `ventanas.mjs` (DOM, cuadro a cuadro) | exit 0 · **12 tarjetas + 22 textos = 34 de 34 ok**; menor holgura +0,050 s (c1) | `ventanas-de-lectura.txt` |
| `hueco-tarjetas.mjs` | exit 0 · **0 cuadros sin tarjeta de 667** (la pregunta está en el cuadro 0) | `hueco-tarjetas.txt` |
| `medir-dom.mjs` (zona segura, 223 instantes, 1.355 cajas) | exit 0 · todo texto entre mentón+40 y y=1490, nada sobre y=280, nada en x>1000 bajo y=1000, **ningún texto < 34 px**, nada se pisa; barras y marca a 100 + 880 × valor (±1,5 px) | `zona-segura.txt` |
| `costuras.mjs` | exit 0 · los **6 empujes** borde con borde (±0,75 px), sin tiras de fondo, en reposo antes y después | `costuras-rigidas.txt` |
| `marca.mjs` | exit 0 · rótulo a 40 px legible del cuadro 0 al 70 (2,958 s) · título «¿Quién pierde la cara?» (4 palabras) legible en el cuadro 0 · pastilla del resultado legible de 0,958 a 3,625 s · 6 miniaturas desde 1,5 s · CTA exacto 2,875 s legible hasta el último cuadro · ningún «Motor N» | `marca.txt` |
| `grep-prohibidas.mjs` | exit 0 · limpio en pantalla, pie y voz (Higgsfield y ArcFace permitidos solo en el pie) | `grep-prohibidas.txt` |
| **Aire muerto** (`aire.py`, sobre el video) | exit 0 · **mayor tramo quieto 1,000 s (24 cuadros: 7,25-8,25 s, la placa de la regla bajo «Mi piso: 0,70.»); mayor tramo quieto SIN tarjeta en lectura: 0,250 s (6 cuadros; tope 0,3 s)** (la exención: ese tramo está bajo una tarjeta en su tiempo de lectura salvo 0,25 s). 6 tramos idénticos de más de 0,3 s, todos bajo lectura. Clips y foto: 0 cuadros idénticos. Eventos: 52 en 27,8 s, hueco máximo 1,84 s (tope 2,0), mínimo 11 por 10 s (ventana 7-17 s) | `aire.txt`, `eventos-visuales.txt` |
| `vacios.py` | exit 0 · **0 cuadros planos**; saltos de luma de 42-51 solo dentro de los 6 empujes y **≤ 2,9 fuera** | `vacios-y-saltos.txt` |
| `psnr-clips.py` | exit 0 · **12 de 12 picos en el cuadro prometido** (36,1-38,1 dB contra 21,0-36,7 de los vecinos) | `psnr-clips.txt` |
| Control de cara (ArcFace buffalo_l, 8 referencias locales de `lucia-g4-v2/assets/refs-orig/`) | exit 0 · **diferencia máxima final↔fuente 0,012** en 15 cuadros (límite 0,02). Seedance 2.0 Mini bajo 0,70 en la fuente y en el final (0,63-0,67); Kling O3 0,79-0,80; Kling 3.0 std 0,75-0,80; cierre 0,70-0,74. Caras de 115-255 px: orientativo | `face-gate.txt` |
| Especificaciones | H.264 1080x1920, 24 fps, **667 cuadros = 27,792 s**, bt709, 9,2 Mbps; AAC 48 kHz estéreo −91 dB. Preview 360x640, 667 cuadros | `specs-final.txt` |
| Mirado renderizado | hojas a 2 cuadros por segundo (`hoja-qa-1/2/3.jpg`), los 6 empujes cuadro a cuadro (`hoja-costuras.jpg`), cuadros 0 y 60 a resolución completa, las seis miniaturas, tarjeta c7 y rótulo de la lección a 2x | `hoja-qa-*.jpg`, `hoja-costuras.jpg`, `portada-1.7s.jpg` |

**Lo que el video afirma contra los datos (PROCEDENCIA l.97):** «pierde parecido» (0,79 → 0,72), «queda bajo el piso» (0,69 y 0,64 < 0,70), «sostiene la cara» (0,80 → 0,82), «parecido final 0,64 a 0,82» (mínimo y máximo de los seis finales), «inventó el cuarto» (el cuarto de la foto K1 no es el del clip de Kling O3), «cambió el plano» (Seedance 2.0 Mini: la cara crece de 119 a 179 px), «foto sola / referencias / solo referencias» (foto de inicio; foto + 3 referencias; 5 referencias sin foto de inicio). **No afirma** que una herramienta sea «mejor», que 0,70 sea una frontera objetiva ni que la foto sola pierda la cara como regla.

## SHA-256 del final
`1b12e83235124aef3ec53968f732515fd06b1b445e86249e41f3a3de60a2a49e`  `out/g2-v2-final-1080x1920.mp4`
(el preview 360p: `5941c444d9fc9fa983d46ec9b62c7bd543e6f71af53b2503ad8b8015fa99018d`; el crudo de HyperFrames `renders/final-raw.mp4`: `e9e210511505b95092d245cb83437b0bef1ae1e6b0fb289098eb536f5922326d`, solo video). `index.html` md5 `6b3a485f5741b61f0342379748d78825` (dos builds seguidos dan el mismo md5). El render no es bit a bit reproducible entre máquinas: si se vuelve a renderizar, vuelve a medirse. La v2.0 (SHA `36a949e8…`) ya no está en `out/`.

## Reproducir
```bash
node scripts/build.mjs                      # copia el material si falta, valida y escribe index.html + plan.resuelto.json + qa/tramos-voz.json + qa/voz-caben.txt
export PRODUCER_HEADLESS_SHELL_PATH=/opt/pw-browsers/chromium HYPERFRAMES_SKIP_SKILLS=1
npx -y hyperframes@0.8.142 check
node scripts/medir-dom.mjs && node scripts/hueco-tarjetas.mjs && node scripts/eventos.mjs && node scripts/ventanas.mjs && node scripts/costuras.mjs && node scripts/marca.mjs && node scripts/grep-prohibidas.mjs
node scripts/voz.mjs --escribir             # tabla caben / no caben (sale con 1 si una línea no cabe)
# 1) preview 360p REAL primero (~1 min); 2) el final (~3 min). Siempre con flock: nunca dos renders a la vez
node scripts/borrador-360.mjs /ruta/draft360 && (cd /ruta/draft360 && flock /tmp/hf-render.lock npx -y hyperframes@0.8.142 render --quality draft -f 24 -o /ruta/draft.mp4)
flock /tmp/hf-render.lock npx -y hyperframes@0.8.142 render --quality high -f 24 -o renders/final-raw.mp4
ffmpeg -y -i renders/final-raw.mp4 -f lavfi -t 28 -i anullsrc=r=48000:cl=stereo -map 0:v -map 1:a -c:v copy -c:a aac -b:a 128k -shortest -movflags +faststart out/g2-v2-final-1080x1920.mp4
export FACE_GATE_HOME=…/lucia-face-gate     # fuera del repo; venv con numpy, cv2, onnxruntime
python3 scripts/psnr-clips.py out/g2-v2-final-1080x1920.mp4 > qa/psnr-clips.txt
$FACE_GATE_HOME/venv/bin/python scripts/aire.py out/g2-v2-final-1080x1920.mp4 > qa/aire.txt
$FACE_GATE_HOME/venv/bin/python scripts/vacios.py out/g2-v2-final-1080x1920.mp4 > qa/vacios-y-saltos.txt
$FACE_GATE_HOME/venv/bin/python scripts/medir-caras.py > qa/caras-por-clip.json      # SCRFD cada 2 cuadros (2 min); no cambia: los clips son los mismos
# control de cara: FACE_QA_MODELS=…/face_models  python -I scripts/../../../scripts/face_identity_qa.py manifest.json  (8 referencias locales + cuadros del final y de la fuente en el mismo cuadro)
COLS=7 bash scripts/hoja.sh out/g2-v2-final-1080x1920.mp4 hoja.jpg 260 0.0 0.5 …        # «fNNN» = cuadro NNN exacto; con un bucle «while read» agregar < /dev/null (ffmpeg se come la entrada)
```
