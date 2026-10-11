# Revisión 1 · Lucía G4 v2 (re-corte mudo de 28,0 s) — revisor independiente, 11-oct-2026

**Veredicto: APROBADO CON CAMBIOS.** 10 hallazgos: **0 ALTA · 4 MEDIA · 6 BAJA.**

Las cifras del video son fieles a `v4/PROCEDENCIA.jsonl` (línea 97) y a lo aprobado por la madre el 10-oct; el límite («Una toma cada uno: es una prueba, no una regla.») está en pantalla; no hay cuadros vacíos, parpadeos ni empujes sueltos; no hay logos, capturas de terceros, producto de Onia, profesión ni cara o voz de Sergio Urcullo; y el control de cara que el editor no pudo correr **sí se pudo correr** (ArcFace, abajo): el final sostiene los puntajes de las fotos fuente a ≤ 0,012.
Lo que impide darlo por listo: dos reglas del plan que la pieza no cumple en pantalla (H3: el título no está en el cuadro 0; H4: ningún número antes de los 3 s), el pie, que dice «Una toma cada uno» y deja a dos herramientas con nombre con medio veredicto (H2), y la voz, que como está escrita pisa a una línea y deja huecos de más (H1).
**Sin re-render (solo texto):** H1 (texto de la voz y tramos), H2, H6, H8, H9, H10. **Piden re-render (0 cr, ~2,5 min):** H3, H4 y, si se quiere, H5 y H7.

**Cómo revisé.** Extraje el final a 2 cuadros por segundo (56 cuadros, 5 hojas de contacto con ImageMagick) y los 12 primeros cuadros uno por uno; miré a resolución completa los cuadros 0, 60, 72, 150, 240, 330, 385, 480, 600 y 672, los 7 empujes (7 cuadros cada uno), recortes 1x/2x/4x de pastillas, monitores, teléfonos y la manga del cuadro de FLUX, y tres placas a 390 px de ancho. Barrí los 673 cuadros en gris (270x480) con dos medidas mías, independientes de `aire.mjs`/`vacios.mjs`: diferencia media y **conteo de píxeles que cambian** por cuadro; ajusté además un modelo de dos capas rígidas a cada empuje. Comprobé el SHA-256 completo del master (coincide con el README: `fd7769e8…25fe32`), `ffprobe`, el silencio del audio (`volumedetect` −91 dB), el preview 360p (673 cuadros, PSNR medio 26,7 dB contra el final reducido: borrador, misma composición, sin desfase) y el md5 de `index.html` (`14fa9356…c9`). Volví a correr `grep-prohibidas.mjs`, `hueco-tarjetas.mjs` y `ventanas.mjs` (solo lectura; salidas idénticas a las de `qa/`, exit 0). **Corrí ArcFace** (`scripts/face_identity_qa.py`) sobre cuadros del final con el venv y los modelos que ya estaban instalados en el scratchpad de la sesión (nada se instaló, sin red: usé las 8 referencias locales de `assets/refs-orig/`). Contrasté cada cifra con PROCEDENCIA, el guion G4 aprobado, `VALIDACION-G4-G5-MADRE.md`, `PLAN.md` §2/§4/§4-bis y la skill `lucia`. No rendericé, no usé servicios pagos, no generé voz, no publiqué. Un solo comando mío incluyó un `git status` de solo lectura por descuido (sin salida, sin efecto); fuera de este archivo solo escribí en el scratchpad.

---

## Hallazgos

### H1 · MEDIA · La voz no cabe como está escrita: una línea se pisa con la siguiente y tres dejan hueco de más
- **Dónde:** `guion-voz.txt` L5, L7, L11 y la cola de L12; el cronograma de `qa/build-y-cronograma.txt`; en G4 v2 **no existe** un script que mezcle la voz (G5 v2 trae `poner-voz.mjs`; aquí no).
- **Evidencia.** El tramo de cada línea se calculó en **palabras** (3,6 pal/s). Este guion promedia 5,02 car por palabra, o sea 18,1 car/s: +6 % sobre los ≈ 17 car/s que `PLAN.md` §4-bis midió en G1 v2 (320 car ≈ 19 s). Línea por línea, a 17 car/s (estimación mía, **no hay voz**), con cada pista puesta en el segundo de su tramo (lo que haría un `adelay`):

  | Línea | Car | Voz a 17 c/s | Tramo del editor | Contra su tramo | Hueco (+) / solape (−) hasta la línea siguiente a 16 · **17** · 18 c/s |
  |---:|---:|---:|---:|---|---|
  | 1 | 30 | 1,76 | 1,67 | se pasa 0,10 | +0,04 · **+0,15** · +0,25 |
  | 2 | 44 | 2,59 | 2,50 | se pasa 0,09 | 0,00 · **+0,16** · +0,31 |
  | 3 | 26 | 1,53 | 1,39 | se pasa 0,14 | +0,01 · **+0,11** · +0,19 |
  | 4 | 31 | 1,82 | 1,67 | se pasa 0,16 | −0,02 · **+0,09** · +0,19 |
  | **5** | 38 | 2,24 | 1,67 | **se pasa 0,57** | −0,46 · **−0,32** · −0,19 (**voz sobre voz**) |
  | 6 | 42 | 2,47 | 2,50 | hueco 0,03 | +0,12 · **+0,28** · +0,42 |
  | 7 | 32 | 1,88 | 1,94 | hueco 0,06 | +0,19 · **+0,31** · +0,42 |
  | 8 | 39 | 2,29 | 2,22 | se pasa 0,07 | +0,04 · **+0,18** · +0,31 |
  | 9 | 40 | 2,35 | 2,22 | se pasa 0,13 | −0,03 · **+0,12** · +0,25 |
  | 10 | 42 | 2,47 | 2,50 | hueco 0,03 | +0,12 · **+0,28** · +0,42 |
  | 11 | 40 | 2,35 | 2,50 | hueco 0,15 | +0,25 · **+0,40** · +0,53 (> 0,3) |
  | 12 | 33 | 1,94 | 1,39 | se pasa 0,55 | cola +0,35 · **+0,47** · +0,58 hasta el final del video |

  L5 es la más corta de la lista (la escena de Seedream 4.5 dura 1,92 s entre costuras) y la que lleva la frase más larga; L12 «se pasa» de su tramo de 1,39 s, pero ese tramo es artificial (el video sigue 1,03 s después): no es problema. Si se hiciera en secuencia en vez de anclar a las costuras, la voz terminaría a los 28,56 s (437 car = 25,7 s de voz + 11 pausas de 0,25 s) y el video dura 28,04: **no cabe**, y L11-L12 llegarían ~1 s tarde sobre su imagen. Con las pistas ancladas a las costuras caben, salvo L5. La regla de pausa del plan es ≤ 0,25 s: L7 (0,31), L11 (0,40) y la cola (0,47) la superan a 17 c/s.
- **Arreglo, sin gastar.** (1) L5 → «Seedream, 1 crédito: la sostiene.» (33 car, ~1,94 s; cae a −0,02 s). (2) L11: el hueco de 0,40 s antes del CTA se arregla arrancando esa pista 0,10 s más tarde (o con «En la escena 2, el Kling perdió la cara.» + 3 car de relleno natural). (3) Tras la mezcla medir con `silencedetect` (−35 dB, 0,3 s) cuántos huecos hay por 10 s.
  **Arreglo correcto** (necesita el sí escrito de gasto de cupo de voz, que no tengo; y hoy quedan 381 car hasta el 13-oct 01:17 UTC contra 437/448 de este guion): generar primero las 12 pistas, **derivar los tramos de las duraciones reales** (no de palabras) y escribir un `poner-voz.mjs` que avise de solapes y de huecos > 0,25 s. Si los tramos se mueven, hay que re-renderizar; por eso conviene medir antes de la voz definitiva.

### H2 · MEDIA · El pie dice «Una toma cada uno» y deja a dos herramientas con nombre con medio veredicto
- **Dónde:** `pie.txt` (frase «Una toma cada uno: es una prueba, no una regla.», «FLUX 3, con 3, quedó bajo el piso», «En la escena 2, Kling O1 Image perdió la cara.»).
- **Evidencia.** (a) **«Una toma cada uno» no es cierto para dos de las seis**: el video muestra a Seedream 4.5 con 0,81 y 0,83 y a Kling O1 Image con 0,79 y 0,35 (dos escenas). La nota de pantalla («Una toma cada uno», 15,17-22,9 s) se refiere a la escena de la recepción, pero el pie no lo dice. (b) **Kling O1 Image dio 0,794 · 0,35 · 0,831** (PROCEDENCIA l.97); la skill `lucia` §0 ya lo escribió así: «perdió la cara en **1 de 3**». El pie v1 aprobado decía «el más barato la perdió en una de tres»; el v2 quitó «una de tres» (el README: «el video no lo muestra») y quedó «perdió la cara» sin denominador, sobre una marca con nombre. En pantalla se ve el 0,79 de la recepción pero no el 0,83 del café 3. (c) **«FLUX 3 … quedó bajo el piso»** con 0,691: el propio video dice (18,97 s) que entre 0,66 y 0,70 la diferencia es ruido de ±0,03 y deja a Seedream 5.0 Pro (0,702) como «justo en el piso» neutro; la evidencia real de «pagar más no mejoró» es la brecha contra Seedream 4.5 (0,806, +0,115, bien fuera del ruido), no el piso. El pie no menciona el ruido.
- **Arreglo (sin re-render).** Pie propuesto: «Personaje hecho con IA: Lucía Antelo, de @oniahq. Probé la misma orden y las mismas fotos de referencia en seis motores de imagen (Seedream 4.5, Kling O1 Image, Nano Banana 2.1, Seedream 5.0 Pro, FLUX 3 y GPT Image 2.5) y medí cuánto se parece cada cara a la de ella, con un piso de 0,70 que fijé yo y un ruido de ±0,03. Con 1 crédito, Seedream 4.5 dio 0,81; FLUX 3, con 3 créditos, dio 0,69: pagar más no mejoró el parecido. En el café (escena 2), Kling O1 Image dio 0,35 y perdió la cara; en las otras dos escenas dio 0,79 y 0,83. Una toma por motor en la primera escena; repetí solo Seedream 4.5 y Kling O1 Image. Es una prueba, no una regla. Nombro lo que uso; no es una recomendación pagada. Cada semana hago una prueba. Seguime.» + los 4 hashtags. Abre literalmente con «Personaje hecho con IA»; todas las cifras salen de PROCEDENCIA (0,806 · 0,691 · 0,35 · 0,794 · 0,831). Alinear la frase con el pie de G5 v2 (que también usa el 0,35), para que dos piezas seguidas cuenten lo mismo de Kling.

### H3 · MEDIA · El título no está en el cuadro 0: aparece a los 0,125 s y queda pleno a los 0,21 s
- **Dónde:** `plan.json` c1 `a: 0,1`; `timeline.js` `enter('#c1', 0.1)`.
- **Evidencia.** Cuadros 0, 1 y 2 muestran solo el rótulo de IA y la foto; el cuadro 3 (0,125 s) trae la tarjeta a medio fundido; pleno en el cuadro 5. `qa/hueco-tarjetas.txt` lo dice sin querer: «cuadros 0–4 (0,000–0,208 s) sin tarjeta ni nota legible». `PLAN.md` §4-bis y el encargo piden el título de 3-7 palabras **en el cuadro 0** («¿Cuál conserva su cara?» son 4, bien). G5 v2 sí lo cumple (`a: 0` y `desde_cero` en su `timeline.js`) y G2 v2 también arranca su primera tarjeta en `a: 0`. Es el primer cuadro que Instagram puede tomar como vista previa.
- **Arreglo (re-render, 0 cr):** `c1.a = 0` con `desde_cero: true` (copiar el tratamiento de G5 v2); la voz puede seguir arrancando a 0,10 s. Re-correr `hueco-tarjetas.mjs` (c1 pasa de 1,79 a 2,04 s de lectura).

### H4 · MEDIA · Ningún número medido en pantalla antes de los 3 s
- **Dónde:** 0–3 s (foto, c1, c2, 6 miniaturas a 2,10-2,70 s, todo sin cifras).
- **Evidencia.** `PLAN.md` §4-bis, fila del reel «La prueba»: gancho = «la pregunta de la prueba en 3-7 palabras, rótulo de IA desde el cuadro 0 **y el resultado en pantalla antes de los 3 s**». El primer puntaje de G4 v2 aparece a los **8,68 s** («parecido 0,81»); antes solo hay «Piso: 0,70.» (5,5 s) y la escala «0 · idéntica · 1» (5,2 s). G5 v2 muestra caja de cara y «0,81» a los 0,95 s. La G4 v1 aprobada tampoco lo traía (es anterior a §4-bis), pero la regla vale para el re-corte.
- **Arreglo (re-render, 0 cr).** Opción A: debajo de cada miniatura, su número (0,81 · 0,79 · 0,74 · 0,70 · 0,69 · 0,66, en mono 38-40 px; las miniaturas suben ~50 px para que el número no pise la tarjeta de y=1236) a 2,3-2,7 s: la pregunta ya viene con seis respuestas sin nombres, y la lección las explica. Opción B (más barata): la pastilla «parecido 0,81» sobre la foto del gancho a 1,2-2,0 s. Con cualquiera, volver a pasar `medir-dom.mjs`, `ventanas.mjs` y `aire.mjs`.

### H5 · BAJA · «Escena 2: Kling perdió la cara.»: nombre incompleto y una escena 2 sin escena 1
- **Dónde:** tarjeta c8 (22,88-25,63 s) y L11 de la voz.
- **Evidencia.** (a) «Kling» no está en la lista de nombres válidos de `PLAN.md` §4-bis («Kling O1 Image» es el de imagen; Kling 3.0 std/pro y Kling O3 son los de video de G2/G5): un espectador que vio G2 v2 puede leer «Kling» como la familia, y la tarjeta es el único texto que dice «perdió la cara» sobre un nombre de marca. Mitiga que la placa rotula «Kling O1 Image» justo debajo. (b) «Escena 2» no tiene referente: v1 mostraba la tabla de tres escenas; v2 nunca dijo «escena 1». (c) La tarjeta llega a los 22,88 s y la imagen de Kling recién a los 23,21 s (la tarjeta afirma 0,33 s antes de que se vea la evidencia).
- **Arreglo.** Pie y voz (H2, H1) ya cubren lo importante. Si se re-renderiza por H3/H4: «Kling O1 Image perdió la cara.» (6 palabras, cabe en 2 líneas, mismo tiempo de lectura 2,4 s en una ventana de 2,75 s) y, en la voz, «En otra escena, el Kling perdió la cara.» (la voz no lee «O1»).

### H6 · BAJA · Cinco detalles de redacción de la voz (todavía gratis de cambiar)
- **L5-L6:** «Seedream» y luego «Seedream Pro» son dos versiones (4.5 y 5.0 Pro); quien solo escucha no lo sabe. Y «2 y medio» no dice la unidad (L5 la dio en «un crédito»). Con «Seedream Pro, 2 y medio de crédito» desborda el tramo (2,75 s); alternativa: dejarlo (la tarjeta dice «2,5 créditos» sobre la voz).
- **L10 «Si dos puntajes se rozan, eso ya es ruido.»:** en pantalla la palabra es **«parecido»**, nunca «puntaje»; y la voz generaliza («si se rozan») sin el ±0,03 que la pantalla sí trae. → «Si dos parecidos se rozan, eso ya es ruido.» (+1 car).
- **L5 «la sostiene»:** el antecedente («su cara») está 5 líneas atrás; funciona porque la pantalla muestra la foto.
- **L11 «el Kling»:** coloquial y ambiguo (H5).
- **L4 «Piso cero setenta»:** «piso» no se define nunca en voz; en pantalla lo dice la escala. Aceptable (viene de G5, que lo explica mejor).

### H7 · BAJA · El límite llega con la conclusión, no antes; los sellos rojos con nombre salen antes del ruido; la lección es densa
- **Dónde:** 13,5-15,17 s («bajo el piso» sobre FLUX 3), 15,17-22,9 s (placa), franja de ruido (20,17 s).
- **Evidencia.** El orden «tres veredictos con nombre (8,7 / 10,9 / 13,5 s) → «Una toma cada uno» (15,17 s) → «ruido ±0,03» (18,97 s)» lo aprobó la madre para v1 con los motores anónimos («se dejan como están», R2-1). Con nombres, FLUX 3 queda 1,7 s en rojo («bajo el piso» a 44 px, 0,69) y Seedream 5.0 Pro en neutro (0,70) por 0,011 de diferencia, 3 veces menos que el ruido que el video admite 3,5 s después. La placa de la lección (15,17-22,9 s) junta tarjeta (6 palabras), nota 1 (10), seis filas (28) y nota 2 (9): ≈ 53 palabras en 7,7 s, con la nota del límite compitiendo con la tarjeta y las filas durante los primeros ~2,5 s (con voz se ordena: L8 la tarjeta, L9 la nota). La franja de ruido es una banda gris de ~35 px de ancho a ~15 % de contraste (13 px a 390 px): existe, está bien ubicada (0,66-0,70), pero casi no se ve.
- **Arreglo (re-render opcional):** franja en coral suave; y, si la madre quiere el nombre más protegido, «cerca del piso» en vez de «bajo el piso» en el sello de FLUX 3 (0,69 vs 0,70). Sin re-render, H2 ya lo dice en el pie.

### H8 · BAJA · El pie no dice de qué plataforma son los créditos ni con qué se mide
- **Evidencia.** «1 crédito», «2,5 créditos», «3 créditos» son créditos de Higgsfield (PLAN §3); sin decirlo, «Seedream 4.5 cuesta 1 crédito» suena a precio de la herramienta. D-N1 pide que «quien mira pueda repetir la prueba»: eso exige plataforma y medidor (ArcFace; el pie de G5 dice «un programa»).
- **Arreglo (sin re-render):** «… en seis motores de imagen de Higgsfield (…) y medí con ArcFace contra ocho fotos oficiales cuánto se parece cada cara a la de ella», y «créditos de Higgsfield, precios del 8-oct». D-N1 nombra a Higgsfield explícitamente.

### H9 · BAJA · «Sin aire muerto» está dicho sin su exención
- **Evidencia.** (a) Con el criterio del editor (una tarjeta o nota cuenta mientras se lee: 0,35 s × palabras + 0,3 s), mi barrido de píxeles da el mismo máximo: **0,21 s fuera de lectura** (25,21-25,42 s, el final de la placa del café justo antes del empuje al cierre) contra su 0,208 s; el README lo presenta así y es correcto. (b) **Sin** la exención hay quietos de 1,0-1,5 s: 6,63-8,13 (1,50 s, c3), 19,17-20,54 (1,37 s, nota 2; la franja de 20,17 s no mueve ni un píxel por encima de 14/255), 17,88-18,96 (1,08 s) y 21,58-22,63 (1,04 s), todos dentro de lectura de una nota. (c) El `qa/aire.txt` mide el DOM y el empuje lento de las fotos «no cuenta como cambio»; en las escenas de foto el movimiento visible es solo ese zoom del 4 %. (d) La mitad de audio de la regla (pausas ≤ 0,25 s; ≤ 1 hueco ≥ 0,3 s por 10 s) no se puede medir hasta que haya voz; a 17 c/s la cola final es de 0,47 s (H1).
- **Arreglo:** reescribir «sin aire muerto» como «sin aire muerto fuera de lectura (máx. 0,21 s); la lectura de tarjetas y notas está exenta; el audio se mide con voz».

### H10 · BAJA · Rastro del master, flujo con voz y nombres que conviene confirmar en vivo
- `out/` está ignorado por git: el único ancla del master aprobado es el SHA del README. Cuando la madre lo apruebe, copiarlo a `videos/lucia-entrega/` como g1-g5 (hoy ahí solo está la v1, ya marcada «no publicar» en el README de entrega, bien). Al mezclar la voz el SHA cambia y hay que repetir el QA de audio: LUFS integrado (−14) con `ebur128`, pico verdadero, `silencedetect`.
- `lucia/SKILL.md` l.103 escribe «Seedream 5 Pro»; `PLAN.md` y la pieza, «Seedream 5.0 Pro». `higgsfield-generate/references/model-catalog.md` (viejo) trae Seedream 4.5, Kling O1 Image y GPT Image 2.5 pero **no** FLUX 3, Seedream 5.0 Pro ni Nano Banana 2.1; esos tres nombres salen de la lista de la madre (PLAN §4-bis) y de las claves de PROCEDENCIA. Antes de publicar, un `models_explore` (gratis) los confirma; si cambia alguno, se cambia en `plan.json`, el pie y la voz.
- README, «Lo que no se pudo cerrar» 1 (ArcFace) y 4 (sin revisor) quedan obsoletas con esta revisión.

---

## Juicio sobre cada duda abierta del editor

| # | Duda del editor | Juicio |
|---:|---|---|
| 1 | «Regla 15» no escrita en `edicion-referentes` (llega a la 14) | Razonable aplicar el texto del encargo. `PLAN.md` §4-bis ya fija pausa ≤ 0,25 s y ≈ 17 c/s; el editor aplicó 0,25 s y su traducción a mudo (tramo quieto, evento cada ≤ 2 s) la confirmé en píxeles (H9). Falta escribirla en la skill; el audio de la regla queda por medir con voz. |
| 2 | «Escena 2: Kling perdió la cara.» (6 palabras) | Cumple el tope de 6 y los datos, pero «Kling» a secas no es un nombre de la lista y «escena 2» no tiene escena 1 (H5). Recomiendo «Kling O1 Image perdió la cara.» si se re-renderiza, y el contrapeso (0,79 y 0,83) en el pie (H2) en todo caso. |
| 3 | Tarjetas c5/c6/c8/c9 que sobran 0,31-0,66 s sobre su lectura | **No recortarlas.** (a) La regla del encargo habla de pantalla idéntica, no de «la tarjeta sale al terminar su lectura»; (b) en esas ventanas hay pastilla, sello, pie o golpe de acento (lo confirmé en píxeles); (c) la holgura es el margen para el desborde de voz de H1: con la voz real, c5 (+0,66) y c9 (+0,45) son lo que absorbe L5/L12. Sacarlas antes dejaría solo el dato en pantalla mientras la voz todavía habla. |
| 4 | Sin revisor independiente | Resuelto con esta revisión (y con ArcFace corrido por mí). |
| 5 | Decisión 1 (tarjeta «Kling»), 4 (A del café junto a B) | 4 es correcta (sin la A el 0,35 queda sin referencia). 1: ver 2. |
| 6 | Decisiones 2 y 3 (golpes de énfasis y pulsos en la lección) | Razonables: son eventos reales y la franja de 20,17 s es el único cuya señal casi no se ve (H7). Revertirlos reabre un hueco de ~2,4 s con lectura exenta; no vale la pena. |
| 7 | Decisión 6 (CTA de 2,42 s) | Correcto: 25,625 a 28,042 s = 2,417 s (≥ 2,4 s por 0,017 s: no se puede recortar un cuadro). |
| 8 | Decisión 8 (pie con D-N1, sin «el que ya uso») | Bien quitar «el que ya uso»; el pie nuevo necesita H2 y H8. |
| 9 | No cerrado 1: ArcFace no se corrió | Lo corrí (ver abajo): ≤ 0,012. El sustituto del editor (SHA + PSNR de caja de cara ≥ 31,6 dB) era válido y coincide. |
| 10 | No cerrado 5: `hyperframes check` no vio una versión con voz | Cierto y sin remedio hoy: si los tramos se mueven con la voz real habrá que re-renderizar y repetir `check`. |
| 11 | No cerrado 6: la B del café «se ve como otra persona» | Correcto y bien manejado: el pie, la tarjeta y la placa dicen «Kling O1 Image · 0,35 · perdió la cara»; nunca la presentan como Lucía (ArcFace: 0,371 sobre el recorte de la placa). |

---

## Lo que verifiqué y está bien

- **Master:** SHA-256 completo = `fd7769e80fba19a85cecf4ac3df05a0e76a51450050c57913ea624b34825fe32`; H.264 1080x1920, 24 fps, 673 cuadros leídos = 28,042 s; AAC 48 kHz estéreo en silencio (−91 dB medio y máximo). Preview 360x640, 673 cuadros, misma composición. `index.html` md5 `14fa93565e1bf2d4c3c5a27091c0bfc9` (idempotente según `qa/index-idempotente.txt`).
- **Cifras contra PROCEDENCIA l.97:** Seedream 4.5 0,806 (1 cr) → «0,81» · Kling O1 Image 0,794 (0,5 cr) → «0,79» · Nano Banana 2.1 0,737 (2 cr) → «0,74» · Seedream 5.0 Pro 0,702 (2,5 cr) → «0,70» · FLUX 3 0,691 (3 cr) → «0,69» · GPT Image 2.5 0,658 (2,75 cr) → «0,66»; café: Seedream 4.5 0,83 · Kling O1 Image 0,35. Todas redondean bien; archivos y claves coinciden (`k2cafe_9f4b5172`, `…4afffb96`). Posiciones de los puntos sobre la escala medidas a ±1,5 px (zona-segura) y vistas a 1x.
- **Aprobado por la madre:** nada afirma más que el guion G4 del 10-oct. «Pagar más no mejoró el parecido» es verdad con los datos (FLUX 3 y GPT Image 2.5 quedan 0,115-0,148 bajo Seedream 4.5; ninguno de los que cuestan más lo supera). «Una toma cada uno: es una prueba, no una regla.» y «Entre 0,66 y 0,70 la diferencia es ruido (±0,03).» están en pantalla a 44 px (15,17-22,9 s y 18,97-22,75 s). La placa **ordena por precio, no por puntaje**, no dice «el mejor» ni recomienda: no se lee como ranking de marcas. Sin logos ni capturas de interfaces de terceros (recortes de monitores, teléfonos y cuadro de manga a 2-4x: sin marca legible; la etiqueta de la manga de FLUX 3 es un cosido de ~16 px ilegible, ya aprobado en v1).
- **Marca (PLAN §4):** rótulo «Lucía Antelo · personaje IA de Onia» a 40 px desde el cuadro 0 hasta ~3,0 s (sale con el empuje de 3,04 s) · título de 4 palabras (pero ver H3) · CTA exacto «Seguime: cada semana, una prueba.» de 25,625 a 28,042 s = **2,417 s** · el pie abre literal con «Personaje hecho con IA» y trae «Nombro lo que uso; no es una recomendación pagada.» · ninguna profesión (el ambo es vestuario; C y E son las copias limpias, SHA verificado) · ningún producto de Onia · ni cara ni voz de Sergio Urcullo · seis nombres válidos y completos en pantalla y pie (con H10).
- **Zona segura:** nada sobre y=292 (arriba_minimo 280); el texto más bajo termina en y=1470; ningún texto cortado ni sobre una cara (la tarjeta de la foto queda a ≥ 60 px del mentón; «bajo el piso» cae sobre las manos). Nombres de herramienta a 40 px en filas y pies y a 66 px en tarjetas (a 390 px quedan en ~14 px: legibles).
- **Cuadros y costuras:** 0 cuadros vacíos; los únicos saltos de luma/píxel son los 7 empujes (4,54-4,71 · 8,13-8,33 · 10,04-10,25 · 12,79-13,0 · 14,96-15,13 · 22,67-22,88 · 25,42-25,63 s) y la entrada de la foto de Kling (23,25 s, Δ 8). Ajuste de dos capas rígidas a cada empuje: el mismo perfil 0 · 8 · 108 · 540 · 972 · 1072 · 1080 px en los 7 (power3.inOut, error ≤ 4,1/255, solo por el zoom lento), sin morph.
- **Tiempo de lectura:** `ventanas.mjs` 34/34 (la más justa, c1, 0,09 s de holgura; «Kling O1 Image» 1,79 s contra 1,70); `hueco-tarjetas.mjs` sin faltas. Repetido por mí: salidas idénticas.
- **Control de cara (ArcFace buffalo_l, 8 referencias oficiales; mi corrida sobre las fotos fuente reproduce los puntajes heredados):**

  | Cuadro del final | Puntaje | Cara (px en pantalla) | Fuente | Dif. |
  |---|---:|---:|---:|---:|
  | gancho 0,5 / 3,0 / 4,4 s (Seedream 4.5) | 0,799 · 0,802 · 0,797 | 179-185 | 0,806 | ≤ 0,009 |
  | Seedream 4.5, 9,2 s | 0,797 | 182 | 0,806 | 0,009 |
  | Seedream 5.0 Pro, 11,5 s | 0,695 | 184 | 0,707 (JPG) / 0,702 (PNG) | 0,012 |
  | FLUX 3 (limpia), 14,0 s | 0,678 | 259 | 0,687 | 0,009 |
  | cierre, 26,7 / 27,5 s (K4·5) | 0,828 · 0,827 | 205-207 | 0,832 | ≤ 0,005 |
  | café Seedream 4.5 (recorte de la placa, 24 s) | 0,821 | 66 (poco confiable) | 0,830 | 0,009 |
  | café Kling O1 Image (recorte, 24 s) | 0,371 | 115 (poco confiable) | 0,354 | 0,017 |

  Máxima diferencia en las 8 cuadros con cara ≥ 179 px: **0,012**, bien dentro de los ±0,03 que el video declara. El 0,70 de Seedream 5.0 Pro sale de la foto PNG de 256 px (0,702); en el final mide 0,695: sigue siendo «justo en el piso» con el margen declarado. Las 9 fotos del montaje (`assets/ph-*.jpg`, `cafe-*.jpg`) tienen el **mismo SHA-256** que las de G4 v1 y que sus archivos de origen en `hermes-content/…/v4/` (para C y E, las copias `-limpia`): 9 de 9 pares iguales.
- **Sincronía idea-voz (si la voz cabe, H1):** la marca «mi piso» (6,35 s) cae con «Piso cero setenta», la tarjeta c2 con «6 motores», el acento «1 crédito» (8,9 s) con «con un crédito», el aro de Kling (24,0 s) y el acento (24,3 s) con «el Kling perdió la cara»; la pastilla y el sello llegan 0,5-1 s antes que sus palabras (aceptable).
- **Controles del editor que repetí:** `grep-prohibidas.mjs` (0 coincidencias; 14 frases obligatorias; el pie abre con «personaje hecho con IA»), `hueco-tarjetas.mjs` y `ventanas.mjs`, exit 0 e idénticos a `qa/`. Leí `hyperframes-check.txt`: 0 errores, 0 avisos de runtime/layout/motion, contraste 31/31 AA, avisos de estilo que no frenan.
- **Gancho en 3 s y estructura:** pregunta en 4 palabras, desarrollo con la prueba de 6 motores y su conclusión, CTA único; 28,04 s (dentro de 26-30 s).

## Lo que no pude verificar

- Cómo se ve en un teléfono con la interfaz de Instagram (solo simulé 390 px de ancho): la columna de iconos de la derecha y el pie de la cuenta no se pueden confirmar sin el teléfono. La tarjeta termina en y=1470 y el texto a ≥ 80 px de la derecha, según la medición del editor, que sí repasé a ojo.
- Cualquier tiempo de voz: **no hay voz**; la tabla de H1 es una estimación con la tasa de G1 v2 (17 c/s) y sensibilidad de ±1 c/s. Tampoco el cupo de voz ni el sí escrito de Sergio Urcullo.
- No volví a correr `hyperframes check`, `medir-dom.mjs`, `costuras.mjs`, `eventos.mjs`, `aire.mjs`, `vacios.mjs`, `psnr-fotos.mjs` ni `medir-caras.py` (los sustituí por mis propias medidas: conteo de píxeles, ajuste rígido de empujes, barrido de luma, ArcFace). Confío en sus salidas (las leí; coinciden con lo que medí) pero no las reproduje.
- ArcFace sobre las seis miniaturas del gancho (caras de ~60 px) y sobre las placas con caras < 120 px (café: 66 y 115 px): solo indicativo. Que las «8 fotos oficiales» de medición no se solapen con las 6 referencias de entrada de las imágenes (pendiente de la validación de la madre del 10-oct; afecta por igual a los seis motores).
- Que `FLUX 3`, `Seedream 5.0 Pro` y `Nano Banana 2.1` sean hoy los nombres comerciales exactos (H10): no consulté Higgsfield en vivo.
- «Sin git» y «no se tocó nada fuera de esta carpeta»: no tengo cómo comprobarlo más allá de lo que declara el README.
