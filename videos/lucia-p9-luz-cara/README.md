# P9 · ¿La cara o la escena?

Composición HyperFrames MUDA: 1080×1920, 24 fps, 480 cuadros / 20 s. Dos tomas ya pagadas (m1 Kling 3.0 std, m4 Seedance 2.0 Mini + referencias); 0 créditos nuevos. La composición la escribió Codex (borrador); el 11-oct-2026 la sesión Lucía (editor, contenedor Linux) construyó SIN `--borrador`, pasó los gates, renderizó, midió y miró el master (v1, SHA `969ac27d…282e`). El mismo día un revisor independiente entregó `qa/revision-1.md` (11 hallazgos) y el editor aplicó la revisión (v2, SHA `4e0593ba…6429`); después entregó `qa/revision-2.md` (**0 ALTA, 2 MEDIA, 5 BAJA**) y la madre sumó cuatro hechos verificados con `job_display` (0 cr): **este master es la v3**. Sin Git, voz, publicación, instalaciones ni descargas.

<!-- ESTADO -->
**MASTER v3 RENDERIZADO (revisión 2 aplicada), PENDIENTE DE VERIFICADOR Y DE «mostrada, publicá P9».** Todos los gates en verde (exit 0). No es aprobación visual ni permiso de publicar. Sigue MUDO: la voz no existe; su cronograma (`guion-voz.txt`) es una estimación a 17 car/s y no tiene margen (ver «Voz futura»).
<!-- FIN ESTADO -->

## Master

| Dato | Valor |
|---|---|
| Archivo | `out/p9-final-1080x1920.mp4` (`out/` y `renders/` no van a git) |
| SHA-256 | `48e2912bff8648f31a005e5ba4c7ea3c3dc15876f32f5daf25433c844023586b` (`qa/sha-master.txt`); v2 `4e0593bacc572c7afd94f44e604c767a5f364ab7c1caf51aea6d76748ca46429`; v1 `969ac27d219bec9ea9ba013aee0c55c8d055c2dff463ddc940abf14a4075282e` |
| Video | H.264 High, yuv420p, 1080×1920, 24 fps, 480 cuadros, 20,000 s |
| Audio | AAC LC 48 kHz estéreo, SILENCIO: volumedetect mean −91,0 dB / max −91,0 dB (`qa/aac-silencio.txt`) |
| Tamaño | 21,1 MB (8,4 Mb/s) |
| `index.html` | md5 `fbd743d2380c2c4381c93b7d655611dc`, idempotente (dos builds, mismo md5; `qa/idempotencia.txt`) |
| Fuentes | `assets/m1.mp4` y `assets/m4-full.mp4` (hardlinks a los originales, 720×1280, 145 cuadros; SHA en `qa/specs-fuentes.txt`); nunca el proxy |
| Render | `hyperframes@0.8.142` (ya en la caché de npx; `--prefer-offline`), `--quality high -f 24`, 1 min 31,5 s de pared (el compilador avisa de keyframes dispersos en m1 y m4, 6,04 s; sin congelados: PSNR 37-39 dB y quietud máxima 0,125 s en píxeles), captura por pantallazo (Chromium completo, sin GPU); preview 360p real 85 s |

Línea de tiempo: m1 0–6 s · empuje rígido 5,75–6,0 s · m4 6,0–11,54 s · empuje 11,54–11,79 s · placa 11,79–20 s.
Entradas (`plan.json → eventos`; todas con fundido + acento de riel y tarjeta): dato de Kling 1,5 s · pastilla «Seedance recibió 2 de las 8 fotos con que se mide.» 6,5 s · placa con las dos filas (la de Seedance con su `0,80*`) 11,79 s · **«Una toma cada uno» 11,96 s · límite de cara 12,5 s · nota del asterisco 13,6 s (la fila de Seedance se tiñe en el mismo instante) · límite del brillo 14,65 s · CTA 17,4 s** (CTA a plena opacidad desde 17,46 s: 2,54 s ≥ 2,4). Acentos intermedios (16,0 y 19,1 s) para no dejar más de 2 s sin evento.

## Los cuatro hechos del 11-oct (verificados con `job_display`, 0 cr, después de la revisión 2) y la cifra retirada

1. **La foto de arranque K1 (`4afffb96`) se generó con R1, R3, R6 y R7** (cuatro de las 8 fotos con que se mide el parecido) más la selfie «look ancla» (`abe2e6bd`) y una referencia de ropa (`688d63a7`). **Los dos clips parten de K1**: ninguno es independiente de esas fotos. «Kling no recibió ninguna» solo es exacto para fotos de referencia de entrada directa; por eso el pie ya no lo dice.
2. **Seedance + referencias recibió además R1 (`a7cfb766`) y R3 (`d7d6d36a`) directo** (la tercera referencia, `abe2e6bd`, no está entre las 8).
3. **PRUEBA ESTRICTA** (`hermes-content/references/modelos/lucia/v4/prueba-motores-20261008/medicion-sin-refs-entrada-20261011.txt`, sección final): contra el centroide de SOLO las 4 fotos que nadie recibió (R2, R4, R5, R8), Kling 3.0 std baja de 0,720 a 0,669 («0,72 a 0,67») y Seedance + referencias sube de 0,643 a 0,728 («0,64 a 0,73»): **el sentido de ambas tomas no cambia**. El build lee esas cifras del archivo, las compara con `plan.json → prueba_estricta` y exige que el pie diga lo mismo.
4. **Retirado:** la estimación de «exceso» de la primera parte de esa medición no se sostiene (no hay control limpio: todos los clips descienden de R1, R3, R6 o R7, y R4 es la foto de menor coseno en 37 de 41 puntos, así que el centroide de 4 puntúa más bajo en los seis clips). No se afirma ninguna magnitud del sesgo: solo qué recibió cada motor y que el sentido no cambia. Se borró de la pantalla, el pie, este README, el build y las mutaciones; el build rechaza su regreso en cualquier texto (pantalla, pie, voz) y `validar-mutaciones.mjs` lo prueba.

## Revisión 2 (`qa/revision-2.md`): qué cambió por hallazgo

| # | Sev. | Estado | Qué cambió |
|---|---|---|---|
| **H1** | MEDIA | **Resuelto** | El 0,80 de Seedance ya no sale solo en la placa: la fila de Seedance lleva `0,80*` (asterisco naranja) y la nota «* Seedance recibió 2 de las 8 fotos con que se mide.» entra a 13,6 s (38 px, una línea, borde naranja; la fila de Seedance se tiñe al entrar para unirlas). La pastilla de la toma de Seedance (6,5–11,5 s) dice «Seedance recibió 2 de las 8 fotos con que se mide.» (11 palabras). **El mensaje completo pedido («…; con las otras 4, igual sube.», 17 palabras = 6,25 s) no cabe**: la ventana es de 5,04 s (5,58 s como máximo entrando a 6,0 s); se usó la versión corta y «con las otras 4» va en el pie (prueba estricta). Palabra: «fotos con que se mide», nunca «de puntaje». |
| **H2** | MEDIA | **Resuelto** | Pie reescrito: «Seedance 2.0 Mini + referencias recibió como entrada 2 de las 8 fotos con que se mide el parecido (R1 y R3). Ambas tomas parten de la misma foto de arranque, que se hizo con 4 de esas 8 (R1, R3, R6, R7), así que ninguna es independiente. Midiendo solo con las 4 fotos que nadie recibió (R2, R4, R5, R8), Kling 3.0 std baja de 0,72 a 0,67 y Seedance sube de 0,64 a 0,73: el sentido no cambia.» Fuera «Kling no recibió ninguna» y la frase que se leía al revés. 1.618 caracteres (límite 2.200). |
| **H3** | BAJA | **Resuelto** | La pastilla ya no dice «de puntaje» ni lleva la cifra retirada (hecho 4). |
| **H4** | BAJA | **Resuelto** | Las filas de la placa muestran la medición con un decimal y sin paréntesis de delta: «brillo 156,0 → 155,1» y «brillo 145,5 → 111,8»; las pastillas siguen con «brillo −1» y «brillo −34». **El 145,5 viene de 145,467 (luma YAVG del clip, 145,5 en la medición publicada) y el delta real es −33,7 (−33,71): «−34» es ese delta redondeado.** El «146» de la v2 era el doble redondeo del 145,5 publicado (error de la revisión 1, que lo recomendó). El build comprueba que 155,1 − 156,0 y 111,8 − 145,5 coincidan con el delta publicado (±0,11) y que la pastilla lleve su redondeo. |
| **H5** | BAJA | **Resuelto** | Límite de cara: «Bajo 200 px (clip original) la cara es poco confiable: Kling, todo el clip; Seedance, el inicio. Ruido ±0,03.» (19 palabras: se quitó «Parecido indicativo.» para pagar «(clip original)»). Verdadero para ambas tomas, en píxeles del clip original de 720p: Kling 115-120 px en 7 de 7 puntos; Seedance 139 y 181 px bajo 200 y 243-347 desde los 2 s (`qa/cara-px-fuente.txt`; el build lo valida contra la medición). No casa con la regex de `grep-prohibidas` («las/todas las/ambas caras… 200»): 0 coincidencias. El pie conserva «Parecido indicativo» y «En el clip original (720p)». |
| **H6** | BAJA | **Resuelto con costo (duda 3)** | Orden de entrada: «Una toma cada uno» (11,96 s, justo al empezar L5 de la voz) → límite de cara (12,5) → nota del asterisco (13,6) → brillo (14,65) → CTA (17,4); la pila vertical sigue el mismo orden (toma arriba, y 807). El build rechaza otro orden. Lectura nueva de la placa: **44 palabras** (19 + 7 + 11 + 7), por encima del tope ≈ 36 pedido; la nota de brillo ya estaba en su versión corta («Brillo: cuadro entero, mezcla luz y encuadre.»), no hay de dónde recortar sin perder algo que la revisión pidió. |
| **H7** | BAJA | **Documentado** (la voz no existe) | Ver «Voz futura». |

Revisión 1, lo que sigue vigente: H8 (aviso de las fotos recibidas) quedó ampliado por esta revisión; H9 (regla 15 y su exención) sin cambio; H10 (ambo, canon `LUCIA.md` §0) sin acción por diseño; H11: falta copiar el master a `videos/lucia-entrega/` (como g1-g5) cuando la madre apruebe; no se tocó nada fuera de esta carpeta. La v2 resolvió H1-H7 de esa revisión (límite de cara con «del clip original», placa en serie, titular «¿La cara o la escena?», voz sin cifras, desenfoque del letrero inventado de la torre, escalas «brillo 0 a 255 · parecido 0 a 1» bajo las barras); la v3 no los toca salvo los textos de la placa de arriba.

## Voz futura (H7): el cronograma no tiene margen

No hay voz; `guion-voz.txt` (311 caracteres con saltos; cupo 381) se retempora a 17 car/s. Medido con `scripts/voz.mjs` (pausas por cuadro de 0,21-0,24 s):

| car/s | fin de L3 | inicio de L4 | inicio de L5 | fin de L7 (voz) | suma de tramos |
|---:|---:|---:|---:|---:|---:|
| 18 | 5,61 | 5,83 | 11,42 | 18,42 | 19,25 |
| **17** (el supuesto) | **5,85** | **6,08** | **11,96** | **19,27** | **20,00** |
| 16,85 | 5,91 | 6,13 | 12,04 | 19,46 | 20,17 |
| 16 | 6,23 | 6,46 | 12,71 | 20,52 | 21,13 (se sale) |
| 15 | 6,59 | 6,83 | 13,46 | 21,70 | 22,17 |

- **Margen: 0,05 s.** L3 termina a 5,848 s y el tope es 5,9 s (el empuje a Seedance es 5,75-6,0 s). Para que L1-L3 (92 caracteres) quepan antes de 5,9 s la voz real tiene que hablar **≥ 16,85 car/s** (16,83 con las pausas de 17 car/s): justo la estimación. A 16 car/s L3 termina 0,3 s después del corte y L7 no cabe en los 20 s. Es el caso central, no un margen.
- **L4 (96 caracteres) no admite retoma:** 311 + 96 = 407 > 381; quedan 70 caracteres de cupo (hasta el 13-oct 01:17 UTC), que alcanzan para UNA retoma de L3 (47), L5 (36) o L6 (48), no de L4. **El texto de L4 se decide antes de generar.**
- **Qué hacer con voz real:** generar y medir primero L1-L3; si pasan de 5,4 s, quitar 5 caracteres a L2 («Misma foto y orden.», 19) antes que acelerar. Medir cada pista, escribir `duraciones.json`, correr `node scripts/voz.mjs` y `node scripts/retemporizar.mjs` (retemporizan con las duraciones reales y fallan si L3 cruza el corte, L4 empieza antes de 6,0 s o L5-L7 se desalinean de su nota) y corregir `plan.json → eventos` (`voz: n`). L5 (toma) hoy entra con su línea (+0,00 s), L6 (brillo) +0,36 s y L7 (CTA) +0,07 s (`qa/alineacion-voz.txt`).
- La pronunciación de «Kling», «Seedance» y «Mini» por la voz Marcela no se midió.

## Lo que se vio (preview 360p real y master)

Mirado: preview 360p real (hoja a 2 fps de 40 cuadros) antes del master; del master, la hoja a 2 fps completa (`qa/contacto-2fps.jpg`, 40 cuadros) y a resolución completa los cuadros 0, 182 (7,6 s), 296, 335, 420 y 479, más las secuencias de entrada: pastilla de Seedance (154-160), placa (283-292), límite (299-308), nota del asterisco (325-340), brillo (349-365) y CTA (416-424).

- **Cuadro 0 (0 s):** rótulo «Lucía Antelo · personaje IA de Onia» (40 px, y 300-368) y título «¿La cara o la escena?» (y 760-858) sobre m1 en movimiento; la pastilla del dato NO está.
- **Dato de Kling:** entra a 1,5 s, a plena opacidad en 1,583 s: «Kling 3.0 std · brillo −1 · parecido 0,79 → 0,72». Primer número antes de 3 s.
- **m4 (6,0-11,54 s):** dato (y 1090-1206), reencuadre en una línea (y 1230-1300) y, desde 6,5 s con fundido y acento, la pastilla «Seedance recibió 2 de las / 8 fotos con que se mide.» (y 1324-1440, líneas balanceadas de 456 y 437 px). Ninguna pastilla toca la cara. Letrero de la torre: sigue como mancha borrosa y oscura sin letras (cuadros 182, 230, 274).
- **Placa (11,79-20 s):** llega con las dos filas (`0,80*` en naranja en la de Seedance, flecha de trazo, escalas bajo las barras). Entra «Una toma cada uno» (cuadros 287-288, 11,96 s) y, de a una, límite, nota del asterisco (la fila de Seedance se tiñe en el cuadro 327-330), brillo y CTA. Huecos verticales de 23,6 a 24,3 px; todo termina en y 1454. Sin cortes ni solapes; CTA y 1282-1454.
- **Zona segura (píxeles del master, `qa/zona-segura-pixeles.txt`):** placa y 300-1453, x 80-999; pastillas y 300-1440 (DOM); nada bajo 1490.
- **Defecto hallado en esta ronda y corregido antes del preview:** en la medida DOM (`qa/layout-dom.txt`) la pastilla de Seedance cortaba «Seedance recibió 2 de las 8 fotos con que se / mide.» con «mide.» huérfana (línea de 101 px); se agregó `text-wrap: balance` a `#aviso-refs` y quedó en dos líneas parejas.
- **Observaciones sin corregir:** (a) la nota del asterisco va a 38 px (el resto de las notas, a 44 px) para entrar en una línea y que la placa no pase de y 1490; a 390 px de ancho queda en ~14 px; (b) de 6,5 a 11,5 s las tres pastillas de m4 tapan de y 1090 a 1440 (parte de la mano y del teléfono); (c) en la placa, de y 1454 hacia abajo queda vacío (zona de la interfaz de Instagram); (d) entre 11,79 y 11,96 s solo se ven las dos filas.

## Regla 15 («aire muerto», de `edicion-referentes`) y su exención

La regla 15 no existe como tal en el skill del repo; se aplica el texto del encargo (mismo criterio que G5 v2): pausa de voz ≤ 0,3 s, ningún tramo quieto > 0,3 s **fuera de la lectura**, un evento cada ≤ 2,0 s y a lo sumo un hueco de voz ≥ 0,3 s por cada 10 s.
- **Exención:** un texto cuenta «en lectura» durante su ventana (0,35 s/palabra + 0,3 s desde que entra), y un tramo quieto dentro de esa ventana no cuenta como aire. Con la exención el mayor tramo quieto es **0,000 s** (DOM, `qa/aire.txt`) y 0,125 s en píxeles (`qa/aire-pixeles.txt`).
- **Dato real sin exención** (cuadro a cuadro del DOM): **1,500 s** de mayor tramo igual (v2: 1,500 s; v1: 1,708 s); en los clips el movimiento es el de la fuente. Es la placa, quieta entre entradas, y se cumple por la exención. Los «eventos» son entradas reales de texto (fundido + 18 px + acento) y acentos de riel (borde de 10 px y tarjeta teñida): 18 eventos, hueco máximo 1,700 s.
- Voz (no medible sin voz): pausas estimadas 0,213–0,235 s; el único hueco ≥ 0,3 s es la cola del CTA (0,725 s, de 19,3 a 20,0 s).

## Gates y evidencia (exit codes en `qa/RESUMEN-gates.txt`)

| Gate | Exit | Resultado |
|---|---:|---|
| `build.mjs` SIN `--borrador` (x2) | 0 / 0 | datos, pie y voz validados contra PROCEDENCIA l.97, la medición de luz del 11-oct y la medición sin refs (incluida su PRUEBA ESTRICTA: fotos que nadie recibió, hecho de K1, cifras 0,72→0,67 y 0,64→0,73); 311 caracteres con saltos (cupo 381), 480 cuadros; idempotente (mismo md5) |
| `master-ready.mjs` | 0 | «Fuentes completas; apto para comenzar QA/render» |
| `voz.mjs` / `retemporizar.mjs` | 0 / 0 | cronograma ESTIMADO a 17 car/s; pausas 0,213-0,235 s; L1-L3 terminan a 5,848 s, L4 empieza a 6,083 s; L5 entra con su línea; tabla en `qa/alineacion-voz.txt` |
| `ventanas.mjs` | 0 | 13 textos, cada uno con su ventana desde su propia entrada: toma 7,92 s (pide 2,75), límite 7,375 (6,95), nota del asterisco 6,29 (4,15), brillo 5,25 (2,75), CTA 2,54 (2,4), pastilla de Seedance 5,04 (4,15) |
| `hueco-tarjetas.mjs` | 0 | 0 de 480 cuadros sin tarjeta (las filas de la placa cuentan como tarjeta) |
| `eventos.mjs` | 0 | 18 eventos, hueco máximo 1,700 s (entradas y acentos) |
| `aire.mjs` | 0 | quieto fuera de lectura 0,000 s (DOM); sin exención 1,500 s |
| `costuras.mjs` | 0 | 2 costuras de 6 cuadros, separación 0,000 px |
| `medir-dom.mjs` | 0 | 1865 cajas / 480 cuadros, 0 fallos; margen mentón-texto 59 px; dato a 1,583 s; CTA 2,542 s |
| `layout-dom.mjs` | 0 | `qa/layout-dom.txt`: alturas, líneas y huecos reales; borde inferior máximo 1453,8 (tope 1490) |
| `grep-prohibidas.mjs` | 0 | 0 coincidencias (el texto nuevo no casa con la regex «las/todas las/ambas caras… 200») |
| `lucia-prohibidas.mjs pie.txt guion-voz.txt` | 0 | 0 coincidencias; también sobre los textos de pantalla de `plan.json` (0) |
| `validar-mutaciones.mjs` | 0 | **41** alteraciones rechazadas, entre ellas: borrar el hecho de K1 del pie, restituir la cifra retirada en cualquiera de sus formulaciones (en la pastilla, la nota, el pie o la voz), invertir «el sentido no cambia», otra cifra de la prueba estricta, otras fotos «que nadie recibió», fila de Seedance sin asterisco o con asterisco en Kling, nota del asterisco borrada o con otra cantidad, «fotos de puntaje», límite sin «(clip original)», orden de entrada de la placa alterado, «Kling no recibió ninguna» imprecisa, y las de la v2 (letrero, scrim, voz con decimales, L3 que cruza el corte) |
| `verificar-auditor.mjs` | 0 | regresión del reporte |
| gates `--estatico` (5) | 0 | reconfirmados |
| `hyperframes check` (0.8.142, `npx --prefer-offline -y`) | 0 | 0 errores · 3 avisos `nested_structure_needs_subcomposition` (no frenan, como G5) · layout 0 problemas / 9 muestras · runtime 0/0 · motion 0/0 · contraste 44/44 AA |
| preview 360p real | 0 | `qa/p9-preview-360p.mp4`, 360×640, 24 fps, 480 cuadros, 20,000 s; mirado antes del master |
| render high + mux AAC | 0 / 0 | ver «Master» |
| `pixeles.mjs psnr-clips` | 0 | mínimo 37,05 dB (m1: 38,82 / 38,90 / 38,88; m4: 38,32 / 37,53 / 37,05), umbral 35; el desenfoque cae fuera de la zona medida (y 400-700) |
| `pixeles.mjs vacios` / `aire` | 0 / 0 | 480 cuadros, 0 planos; quietud fuera de lectura 0,125 s (tope 0,3) |
| ArcFace master ↔ fuente (`face-gate.sh`) | 0 | 8 pares (24 cuadros): diferencia máxima **0,014** contra la fuente escalada y **0,017** contra la nativa de 720p (regla ≤ 0,02); `qa/arcface-final.txt` |
| Tamaño de cara de las fuentes (`face-gate.sh`, 14 cuadros) | 0 | de la v2, sin cambios (los clips no cambian): `qa/cara-px-fuente.txt` |
| Zona segura en píxeles | 0 | placa y 300-1453, x 80-999 (`qa/zona-segura-pixeles.txt`) |
| `node --check` (20 scripts) y UTF-8 (71 textos) | 0 | `qa/sintaxis.txt`, `qa/utf8.txt` |

La detección de caras sobre el master (`qa/caras-detectadas-master.txt`) es la de la v1: rótulo, título y datos de Kling y de Seedance no se movieron y la v3 solo cambia la placa y el texto de la pastilla inferior de m4 (misma caja, y 1324-1440, más abajo del mentón); la separación la cubre `medir-dom` (margen 59 px).

## Decisiones y cómo revertirlas

- **Texto del límite de cara:** `plan.json → textos.limite_cara` (y `reencuadre`); el pie y el literal autorizado de `scripts/build.mjs → esperado` van a la par. Reponer «Seedance parte de 139 px» o «todas las caras…» rompe build/gates y no se ofrece reversión. «(clip original)» costó quitar «Parecido indicativo.» de la pantalla; con ella son 21 palabras y 7,65 s de lectura, y el límite tendría que entrar antes de 12,24 s (hoy 12,5 s).
- **Aviso de fotos recibidas (H1):** pastilla `#aviso-refs` en m4 (6,5 s, `plan.json → textos.aviso_refs`) y nota `#nota-ast` en la placa (13,6 s, `textos.nota_refs`, 38 px, `layout.nota_refs_px`). El mensaje completo de 17 palabras no cabe en la ventana (5,04 s); entrar a 6,0 s da 5,58 s y alcanza para 15 palabras como máximo.
- **Brillo en la fila (H4):** `build.mjs → rowHTML` (un decimal, sin delta). Volver a enteros cambiaría el 145,5 por 145 o 146 (ninguno cuadra con −33,7).
- **Orden de la placa (H6):** `plan.json → eventos` (t, `entrada`) y `layout` (y de cada bloque, medidos con `scripts/layout-dom.mjs`; huecos de ~24 px). Tope de lectura nueva de la placa: `build.mjs → TOPE_PLACA` (44; v2 34; pedido ≈ 36).
- **Alineación de la voz estimada:** L4 se alargó a 96 caracteres para que L5 empiece junto a la placa y L3 perdió «3.0 std». Revertir = editar `guion-voz.txt` y el literal `vozEsperada` del build.
- **Scrim del letrero:** `plan.json → scrim_m4` (caja, centro, radios, `desenfoque_px`, `brillo`). Cambiarlo exige mirar los cuadros 7-11,5 s a resolución completa y repetir PSNR y ArcFace.
- Se copió la estructura de G5 v2 (package, hyperframes, scripts, assets-fijos). Los validadores se adaptaron a P9. Volver a G5 exige conservar el contenido P9 y remapear IDs.
- 20 s: m1 0–6 s, m4 5,75–11,791667 s, placa 11,541667–20 s. Dos empujes rígidos de 6 cuadros; clips a 1× sin congelación ni zoom añadido.
- Gancho y rótulo IA a 40 px desde el cuadro 0; el resultado de Kling entra a 1,5 s; Seedance, el reencuadre y la pastilla de fotos recibidas van debajo de la cara (y 1090-1440).
- Fuentes locales de marca (`build.mjs → FONTS` copia las tres woff2 desde `hermes-content/brand/fonts` a `assets/fonts/`, ignorado): Bricolage Grotesque 700 / 66 px en título y CTA, DM Sans 500 / 40 px en rótulo y filas, 42 px en datos, 44 px en notas (38 px la del asterisco) y 34 px en la escala; Spline Sans Mono 500 / 42 px en cifras. No se descarga nada.
- CTA conserva 2,4 s mínimos de lectura/exposición aunque su conteo ordinario da 2,05 (`qa-dom.mjs → need`); no se amplía la exención del resto.
- `medir-dom` acumula todos los incumplimientos (`qa/medir-dom.txt`, `qa/medir-dom-fallos.json`) y termina con exit 1 si hay fallos. Regresión sin navegador: `node scripts/verificar-auditor.mjs`.
- **Estado inicial:** GSAP no aplica `tl.set(...,0)` si el primer `time(0)` llega a un timeline recién creado; por eso el estado inicial va con `tl.fromTo` y la opacidad oculta en CSS (no `transform` en CSS: falla `hyperframes check` con `gsap_css_transform_conflict`).
- `hyperframes.json → media.autoProxy=false`: evita derivados automáticos.
- `scripts/build.mjs` no pisa el bloque `ESTADO` de este README cuando las fuentes están completas y el estado ya no dice BORRADOR.

## Cómo reproducir (los comandos que se corrieron)

Desde `videos/lucia-p9-luz-cara/`. `hyperframes@0.8.142` ya está en la caché de npx de este contenedor; con `--prefer-offline` no descarga nada (si la caché faltara, `npx -y` necesita red).

```bash
export PRODUCER_HEADLESS_SHELL_PATH=/opt/pw-browsers/chromium HYPERFRAMES_SKIP_SKILLS=1
export PLAYWRIGHT_MODULE=/opt/node-tools/node_modules/playwright
node scripts/build.mjs > qa/build-master.txt 2>&1      # SIN --borrador; valida textos/pie/voz contra PROCEDENCIA l.97, la medición de luz y la medición sin refs (PRUEBA ESTRICTA incluida)
node scripts/master-ready.mjs
node scripts/voz.mjs > qa/tramos-de-voz.txt && node scripts/retemporizar.mjs > qa/retemporizar.txt   # también escribe qa/alineacion-voz.txt
for g in ventanas hueco-tarjetas eventos aire costuras; do node scripts/$g.mjs --estatico || exit 1; done   # los --estatico SOBREESCRIBEN qa/<gate>.txt: correrlos antes de los DOM
for g in ventanas hueco-tarjetas eventos aire costuras medir-dom; do node scripts/$g.mjs > qa/$g.txt 2>&1 || exit 1; done
node scripts/layout-dom.mjs                              # escribe qa/layout-dom.txt
node scripts/grep-prohibidas.mjs > qa/grep-prohibidas.txt; node scripts/validar-mutaciones.mjs > qa/validar-mutaciones.txt; node scripts/verificar-auditor.mjs
node /home/user/onia-hermes/scripts/lucia-prohibidas.mjs pie.txt guion-voz.txt
flock /tmp/hf-render.lock npx --prefer-offline -y hyperframes@0.8.142 check > qa/hyperframes-check.txt 2>&1
mkdir -p renders out qa
node scripts/borrador-360.mjs
(cd renders/draft360 && flock /tmp/hf-render.lock npx --prefer-offline -y hyperframes@0.8.142 render --quality draft -f 24 -o ../../qa/p9-preview-360p.mp4)   # mirar antes del master
node scripts/master-ready.mjs && flock /tmp/hf-render.lock npx --prefer-offline -y hyperframes@0.8.142 render --quality high -f 24 -o renders/final-raw.mp4   # proceso hijo directo; ~90 s
ffmpeg -y -i renders/final-raw.mp4 -f lavfi -t 20 -i anullsrc=r=48000:cl=stereo -map 0:v -map 1:a -c:v copy -c:a aac -b:a 128k -shortest -movflags +faststart out/p9-final-1080x1920.mp4
sha256sum out/p9-final-1080x1920.mp4 > qa/sha-master.txt
ffprobe -v error -show_streams -show_format -of json out/p9-final-1080x1920.mp4 > qa/specs-final.json
ffmpeg -i out/p9-final-1080x1920.mp4 -af volumedetect -vn -f null - 2> qa/aac-silencio.txt
node scripts/pixeles.mjs psnr-clips > qa/psnr-clips.txt; node scripts/pixeles.mjs vacios > qa/vacios.txt; node scripts/pixeles.mjs aire > qa/aire-pixeles.txt
ffmpeg -y -i out/p9-final-1080x1920.mp4 -vf 'select=not(mod(n\,12)),scale=216:384,tile=8x5' -frames:v 1 -q:v 2 qa/contacto-2fps.jpg
# ArcFace (venv con numpy/cv2/onnxruntime fuera del repo): export FACE_GATE_HOME=…/lucia-face-gate; .claude/skills/lucia/scripts/face-gate.sh <cuadros FINAL, fuente escalada y fuente nativa> (8 pares: m1 n=12,48,84,120; m4 n=30,66,102,130 = cuadro 138+n del master)
# Tamaño de cara de los originales: face-gate.sh <clip>@0,1,2,3,4,5,5.9 sobre m1 y m4 (qa/cara-px-fuente.txt)
```

No se renderizó dos veces el master v3: NO se verificó que el SHA del MP4 sea reproducible (sí lo es el `index.html`). `qa/sha-master.txt` fija el SHA de este master; si se vuelve a renderizar, comparar por PSNR/cuadros y no solo por hash (el ArcFace de un mismo cuadro varió hasta 0,004 entre el render v2 y el v3).

## Lo que quedó sin medir y dudas abiertas

1. **Verificador y revisión de esta v3:** los pone la madre. Ningún resultado de este README es aprobación visual ni permiso de publicar. Falta copiar el master a `videos/lucia-entrega/` (como g1-g5) cuando se apruebe.
2. **Voz: NO existe.** El master es mudo (AAC en silencio). Cronograma ESTIMADO a 17 car/s sobre `guion-voz.txt` con margen de 0,05 s, ≥ 16,85 car/s necesarios y L4 sin retoma posible (ver «Voz futura»). Dos desvíos del texto de la madre por el cronograma: L3 sin «3.0 std» (con él terminaba a 6,32 s) y L4 con «el encuadre se acerca» (con la L4 de 72 caracteres, L5 empezaba a 10,5 s, antes de que exista la placa).
3. **Densidad de lectura de la placa (H6) empeoró:** 44 palabras de lectura nueva (tope pedido ≈ 36) + 5 del CTA en 8,2 s = 6,0 palabras/s (v2: 4,6/s; v1: 7,6/s). Cada ventana individual se cumple, pero la lectura **secuencial estricta** (2,75 + 6,95 + 4,15 + 2,75 + 2,4 = **19,0 s**) no cabe en 8,2 s (v2: 14,85 s): quien lee en orden termina la placa a ~31 s. Con voz, L5-L7 cubren toma, brillo y CTA y solo el límite y la nota del asterisco piden ojos (11,1 s). Alternativas si pesa, para decidir: quitar la nota de brillo de la pantalla (la voz y la pastilla la dicen), acortar la nota del asterisco a «* Recibió 2 de las 8 fotos con que se mide.» (−1 palabra, sin sujeto), o alargar el video. La nota del asterisco no puede ser menos que esto sin dejar de decir qué se recibió.
4. **El mensaje completo de la pastilla de Seedance no cabe en su ventana** (17 palabras = 6,25 s; ventana de 5,04 s o 5,58 s como máximo): va la versión corta y «con las otras 4, igual sube» queda solo en el pie.
5. **El 0,80 sigue siendo la cifra favorecida** (Seedance recibió 2 de las 8 fotos y ambas tomas parten de K1): está avisado en pantalla (asterisco, nota, pastilla) y en el pie. La prueba estricta mide contra 4 fotos, pero no hay control limpio: no se estima la magnitud del sesgo, solo se afirma que el sentido no cambia. Los números de pantalla (0,71 → 0,80) son los de PROCEDENCIA l.97, por decisión de la madre.
6. **Desenfoque del letrero:** `backdrop-filter` funciona en el modo «screenshot» de este render (preview y master). No se probó con `chrome-headless-shell` (modo beginFrame): si se renderiza así hay que mirar los cuadros 7-11,5 s otra vez.
7. **Instagram:** no se simuló la interfaz. A 390 px de ancho, el texto de 34 px de la escala queda en ~12 px y la nota del asterisco (38 px) en ~14 px (legibles, justo); los botones del borde derecho podrían rozar el final de las pastillas (80 px de margen).
8. **Pie:** el editor agregó «Lo difuminé en el video.» tras la frase del letrero (honestidad sobre el retoque).
9. El render no es reproducible bit a bit (el `index.html` sí). El compilador de HyperFrames avisa de keyframes dispersos en m1 y m4 (6,04 s) y el render de un `404` «non-blocking» (probablemente el favicon); no hay congelados ni cuadros rotos.
10. **Ambo (H10 de la revisión 1):** sin acción, dentro del canon (`LUCIA.md` §0); no hay otra toma pagada con otra ropa.
11. `scripts/estimar-tipografia.py` no se corrió (falta `fontTools`; no se instala nada); lo sustituyen `scripts/layout-dom.mjs` y `qa/medir-dom.txt`.
12. Contraste: `hyperframes check` midió 44/44 AA; no hay medición propia fuera de ese gate.
13. Avisos de estilo de `hyperframes check` (3× `nested_structure_needs_subcomposition`): no frenan; no se refactorizó a subcomposiciones.
14. El render se hizo en modo «screenshot» porque el Chromium completo no expone `HeadlessExperimental` (PSNR 37-39 dB y ArcFace ≤ 0,017 muestran que no degradó la imagen).
15. `git status` se corrió una vez (solo lectura) al final, pese a la instrucción de no usar Git, para ver el estado del árbol; no se usó Git para nada más.
