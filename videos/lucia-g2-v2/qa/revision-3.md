# Revisión 3 · Lucía G2 v2.3 (K1 con R1, R3, R6 y R7; prueba estricta; avisos en pantalla, 11-oct-2026) — revisor independiente

**Veredicto: APROBADO CON CAMBIOS MENORES (ninguno bloquea).** 5 hallazgos: **0 ALTA · 1 MEDIA · 4 BAJA.**

Lo esencial de la revisión 2 quedó resuelto y **verificado en el master real, cuadro por cuadro, no en el plan**: el aviso acompaña al «0,82» **en las tres veces que sale** (gancho, clip de Kling O3, lección), entra y sale en el mismo cuadro que el número; Seedance 2.0 Mini + referencias **no aparece en pantalla**; el pie abre con el aviso en los caracteres 51-121; «los otros cuatro, ninguna», la estimación del «exceso» y «dentro del ruido» **ya no existen** en pie, voz ni pantalla; todo lo que el pie dice sobre la prueba estricta es fiel al archivo de la medición. Nada de lo que se muestra o dice es falso.
Lo que queda es de **claridad**, no de verdad: (H1) el aviso del gancho, de 6 palabras, no se entiende por sí solo para quien no sabe qué son «las 8 fotos» (el único aviso que ve quien deja el video a los 8 s); (H2) el pie da la caída de la prueba estricta y una lista descendente sin decir que cualquier clip baja con ese centroide ni que no se compara con el piso 0,70 (el propio archivo de la medición lo advierte).
**Sin re-render:** H2, H3, H5 (solo cadenas de `build.mjs`/`pie.txt` y sus mutaciones) y H4 (decisión). **Pide re-render (0 cr, ≈ 4 min):** H1 (texto/tiempo del aviso del gancho).

**Cómo revisé.** SHA-256 completo + `ffprobe` (667 cuadros leídos) + `volumedetect` del master; `index.html` md5 y preview 360p SHA contra el README. 56 cuadros a 2 por segundo en dos hojas de contacto con `montage` (miradas completas), resolución completa en 0 · 2,0 · 15,5 · 17,5 · 22,0 · 27,2 s y a 390 px de ancho en 2,0 · 15,5 · 22,0. **Entradas y salidas de los tres avisos cuadro a cuadro**: gancho n18-n32 y n80-n92, clip n330-n355 y n384-n402, lección n456-n482. Barrí los 667 cuadros con **mi propia medida** (`mi_aire.py`: píxeles que cambian, parpadeos por cambio de luma) y corrí `scripts/vacios.py` (solo lee el video). **ArcFace** (venv y modelos del scratchpad, `scripts/face_identity_qa.py` importado por ruta) en **18 cuadros válidos nuevos** (19 medidos, uno descartado), distintos de los 15 del editor y de los 12 de la revisión 2. Releí README, `plan.json`/`plan.resuelto.json`, `pie.txt`, `guion-voz.txt`, la sección «PRUEBA ESTRICTA» de la medición completa y las partes de `build.mjs` que validan el pie. Recalculé la tabla de voz a 16/17/18 c/s con mi propio script. Corrí `lucia-prohibidas.mjs`. **No usé git, no rendericé, no gasté créditos, no generé voz, no publiqué, no instalé nada, no corrí `build.mjs` ni `validar-mutaciones.mjs`.** Lo único que escribí en el repo es este archivo (intermedios en mi scratchpad).

---

## Hallazgos

### H1 · MEDIA · El aviso del gancho («0,82 recibió 4 de 8 fotos») no se entiende solo; para quien se va a los 8 s, el 0,82 sigue sin explicación útil
- **Dónde:** pastilla pequeña bajo «parecido final: 0,64 a 0,82» (y = 945-1000, x = 410-900), 0,96-3,63 s; también en `qa/portada-1.7s.jpg`.
- **Evidencia.** (1) **El sujeto gramatical de «recibió» es el número**: «0,82 recibió 4 de 8 fotos» se lee como «el 0,82 recibió fotos». No dice que es el clip, ni qué recibió (entrada del generador), ni de qué son esas fotos. (2) **«8 fotos» no está definido todavía**: la tarjeta que lo define («Se mide contra 8 fotos suyas», c3) entra a los 3,75 s, **después** de que el aviso salió (3,63 s); y la voz que lo dice (L3) llega a 3,75 s. (3) **Directamente debajo hay seis miniaturas numeradas de fotos** (1-6): «4 de 8 fotos» junto a seis fotos invita a leer que las 8 son las miniaturas (son 6). (4) La explicación completa llega a los 14,0 s (clip: «con que se mide») y a los 19,75 s (lección). (5) En el gancho además se apilan cinco capas sobre y = 720-1470 (rótulo, pastilla, aviso, miniaturas, tarjeta): el aviso cierra el hueco de 28 px que había en la v2.2 y **teléfono y manos quedan ocultos** de 0,96 a 3,6 s (la cara queda limpia; a 390 px el aviso mide ≈ 12-13 px y se lee).
- **Juicio.** **No es falso ni oculto**: el aviso existe, está pegado al número y entra con él (n21 a medio fundido los dos; verificado). Pero para el espectador frío es una etiqueta de aspecto legal que no comunica, y es el único aviso que ve quien deja el video temprano. La corrección de la revisión 2 (H2) cumple en forma y queda corta en función. Es una duda que el propio editor dejó anotada (duda 3).
- **Arreglo (re-render, 0 cr).** Que el sujeto sea el clip y que la palabra sea la de la tarjeta c3: «0,82: recibió 4 de 8 fotos suyas» (7 palabras, pide 2,75 s: adelantar la pastilla y el aviso de 0,85 a ≈ 0,75 s, el primer resultado sigue antes de 3 s) o «clip 0,82: recibió 4 de 8 fotos suyas» (8 palabras, 3,10 s: entrada a ≈ 0,5 s). Repasar `ventanas.mjs`/`medir-dom.mjs`. **Alternativa sin tocar la pantalla:** aceptarlo como bandera (la explicación está en el clip, la lección y el pie) y decirlo en la nota de publicación. Mi recomendación: arreglarlo solo si se vuelve a renderizar por otra cosa.

### H2 · BAJA · El pie da la caída de la prueba estricta y una lista descendente sin decir tres cosas que el archivo de la medición sí dice
- **Dónde:** `pie.txt`, «Midiendo solo con las 4 fotos que nadie recibió (R2, R4, R5 y R8), los seis clips bajan entre 0,03 y 0,09 y el orden de los finales no cambia: Kling O3 0,75, … Seedance 2.0 Mini 0,60.»
- **Evidencia.** La frase es **fiel**: 0,03 y 0,09 son el mínimo (−0,030, Seedance 2.0 Mini t = 5) y el máximo (−0,094, Seedance + referencias t = 5) de B\*−A en los 41 puntos (el build los calcula del archivo, `build.mjs` l.340); el orden por valor final es idéntico y los seis finales son 0,749 · 0,728 · 0,711 · 0,678 · 0,669 · 0,596. Lo que **no** dice y la medición advierte (l.196-198, 320-326):
  1. **La caída no es el tamaño de la fuga.** «Un centroide de 4 fotos no puntúa igual que uno de 8 … R4 es la foto de menor coseno en 37 de los 41 puntos … la columna B\*−A no aísla una fuga». Los clips que **no recibieron ninguna foto directa** caen casi igual (Kling 3.0 std −0,052, Seedance 2.0 Mini −0,048) que Kling O3 (−0,075). Un lector toma «bajan entre 0,03 y 0,09» como «el puntaje estaba inflado en ese monto».
  2. **No se compara con el piso.** Con las 4 fotos, 3 de 6 finales quedan bajo 0,70 (0,678 · 0,669 · 0,596) y el pie los lista a renglón seguido de «Mi piso es 0,70». Kling 3.0 std sale en pantalla en verde sobre el piso (0,72) y en el pie con 0,67. El README lo dice («se compara entre clips, no con el piso»); el pie no.
  3. **La lista se lee como ranking, y entre vecinos casi no hay diferencia.** Diferencias entre vecinos en B\*: +0,021 · +0,017 · +0,033 · +0,009 · +0,073: **tres de las cinco están dentro del ±0,03**. El video evitó a propósito un orden por puntaje («sugeriría un ranking», README); el pie lo da en orden descendente. «El orden de los finales no cambia» es cierto y dice «finales»; por media de los 7 puntos SÍ cambia un lugar (Seedance + referencias pasa al 5.º) y el pie no lo dice.
- **Arreglo (sin re-render; cadenas de `build.mjs` l.352 y mutaciones).** Añadir en la misma frase «(son fotos más difíciles: se compara entre clips, no con el piso)» y, si hay espacio, «las diferencias de menos de 0,03 entre vecinos no cuentan». **Cuesta ≈ 40-66 caracteres y el pie tiene 14 libres (2.186 de 2.200)**: recortar, por ejemplo, «(R1 a R8)» (10) y compactar «(créditos de Higgsfield, precios del 8-oct)». Si no cabe, lo que importa es el «no con el piso».

### H3 · BAJA · Redacción residual del pie: «parten/partieron» con dos sentidos, identificadores R1…R8 y 415 palabras
- **Dónde:** `pie.txt`: «Aviso: los 6 clips **parten de** 4 de las 8 fotos…» (carácter 51-121) y, 100 caracteres después, «cinco **partieron de** la misma foto».
- **Evidencia.** «Partir de» aparece dos veces con referentes distintos (las 4 fotos / la misma foto de arranque); la primera es más vaga que la verdad (cinco clips descienden de las 4 fotos **a través de K1** y Kling O3 las recibió **directo**). Los identificadores «R1 a R8», «R1, R3, R6 y R7», «R2, R4, R5 y R8» no le dicen nada a un espectador (el editor ya lo anotó, duda 4); y el pie entero son **415 palabras** en una sola pieza de texto, con el párrafo «Sobre la medición» de 118 palabras. Medí que el aviso cae en los caracteres **51-121 de 2.186**; el corte exacto de Instagram (≈ 125) no lo vi en un teléfono (ver «No pude verificar»): si el corte cae antes de «(abajo)», el aviso queda sin su remate.
- **Arreglo (sin re-render).** Dejar el aviso como está (termina en el carácter 121; «descienden de» lo empujaría al 125, el borde del corte) y cambiar el **segundo** uso: «cinco salieron de la misma foto de arranque» (+1 carácter). Quitar los ids «R1 a R8» libera ≈ 10 caracteres para H2 (y «R1, R3, R6 y R7» / «R2, R4, R5 y R8» otros ≈ 36 si se prefiere «4 de esas 8» y «las otras 4»).

### H4 · BAJA · En pantalla, solo Kling O3 lleva aviso; nada dice que la foto de arranque de los otros clips también viene de 4 de las 8
- **Dónde:** gancho (el «0,64» del rango no lleva aviso), placa de la lección (barras «foto sola» de Kling 3.0 std y Seedance 2.0 Mini sin aviso), clip de la foto de arranque.
- **Evidencia.** Es la **decisión 10 del README**, tomada a conciencia, y el pie sí lo declara para los seis (carácter 51-121: «los 6 clips parten de 4 de las 8»). Pero en pantalla un aviso solo sobre el 0,82 sugiere que el resto es limpio, y «foto sola» lo refuerza. La medición dice lo contrario: ningún clip es independiente. El efecto práctico es pequeño (el mismo K1 abre todos los clips, así que lo que se compara es la caída desde esa foto) y no cambia ninguna cifra de la pantalla.
- **Arreglo.** Aceptarlo (la divulgación completa va al principio del pie) **o** que la nota «Final = segundo 5,9, que no se ve entero.» de la lección agregue una línea «todas parten de 4 de las 8 fotos»: re-render, sin urgencia. Lo decide la madre.

### H5 · BAJA · El pie sigue en presente («sostiene la cara», «pierde parecido») mientras la voz y la tarjeta c9 pasaron a «aguantó»
- **Dónde:** `pie.txt`: «Kling O3 (6 créditos), solo con referencias, **sostiene la cara** (0,80 a 0,82) pero inventa el cuarto»; voz L9/L11 y c9: «aguantó».
- **Evidencia.** El README dice que el cambio a pasado es «lo que una toma por clip puede decir» (decisión 12) y lo aplica a voz y tarjeta, no al pie. El pie cierra con «Una toma por clip: es una prueba, no una regla», así que no es falso; es una inconsistencia de tono entre superficies.
- **Arreglo (sin re-render).** «sostuvo la cara», «perdió parecido», «quedó bajo el piso» en la oración de los tres clips (misma longitud ±2 caracteres).

---

## Respuestas a los cinco puntos del encargo

| # | Pregunta | Respuesta |
|---|---|---|
| 1a | ¿El aviso del 0,82 aparece SIEMPRE que el 0,82 está en pantalla? | **Sí, las tres veces, verificado cuadro a cuadro.** Gancho: pastilla y aviso entran juntos (n21, 0,875 s, ambos a medio fundido) y salen juntos con el empuje (n86-n88). Clip de O3: el aviso llega con el empuje en n334 (13,92 s), el «0,80» en n340, el «5,9 s: 0,82» en n354; el aviso sigue hasta el empuje de salida (n432), el «0,82» se va en n396. Lección: la barra, el «0,82» y el aviso: número y aviso entran en el mismo cuadro (n472, 19,667 s) y no hay ningún cuadro con el 0,82 sin aviso. No existe un cuadro con el 0,82 fuera de esas tres escenas (el cierre y las demás placas no lo traen). |
| 1b | ¿Se entiende para quien no sabe qué son «las 8 fotos»? | **El del gancho no** (H1); **el del clip y el de la lección sí**: «recibió 4 de las 8 fotos con que se mide» (10 palabras, 36 px, ≈ 13 px a 390 de ancho, legible), con la tarjeta «solo referencias» al lado y «Se mide contra 8 fotos suyas» ya dicho a los 3,75 s. |
| 1c | ¿Seedance + referencias aparece con su 0,80 sin aviso? | **No aparece.** Ningún cuadro lo muestra (`plan.json → medios` no tiene m4). El «0,80» de pantalla (14,25-16,50 s) es el de arranque de Kling O3 (0,798) y lleva el aviso encima. El 0,801 de Seedance + referencias solo está en el pie, junto con «recibió R1 y R3 como entrada». |
| 1d | ¿El pie dice la verdad completa y se lee? | **Verdadero: sí, cada cifra** (tabla abajo). **Completo: casi** (H2). **Se lee: mucho mejor que la v2.2**: aviso en los caracteres 51-121, sin la trampa de «ninguna:», «referencia» con un solo sentido («fotos que recibió como entrada»), sin «exceso»/«atribuible», un solo tamaño de cara por clip (89 a 168 px en O3; «menos de 200 px» para los tres); queda H3. |
| 1e | ¿La frase de la prueba estricta es fiel a la medición? | **Sí, literalmente**: orden idéntico («¿Cambia el orden por valor final? NO»), 0,03-0,09 = mínimo y máximo de los 41 puntos, finales 0,749 · 0,728 · 0,711 · 0,678 · 0,669 · 0,596 → 0,75 · 0,73 · 0,71 · 0,68 · 0,67 · 0,60 (redondeo correcto). Lo que le falta es contexto (H2). |
| 2 | Voz: L9 «Kling O tres, solo referencias: aguantó.» y L11 «Con referencias, aquí la cara aguantó.» | **No dicen nada falso.** «Aguantó» (la cara se mantuvo) es cierto con las 8 fotos (0,798 → 0,824) y con las 4 que nadie recibió (0,753 → 0,749, siempre ≥ 0,72), y «aquí» lo limita a esta toma; Kling O3 sigue primero en la prueba estricta. Lo que no dicen es el aviso (la voz tampoco lo puede decir en el cupo de hoy: +≈ 35 caracteres). El aviso en pantalla coincide en el tiempo con ambas líneas: L9 empieza a 14,04 s con el aviso ya visible desde 13,92 s; L11 empieza a 18,25 s y la lección no muestra el 0,82 hasta 19,67 s, que es cuando entra **con** su aviso (la voz dice «aguantó» 1,4 s antes de que el número aparezca, pero la pantalla no lo contradice). Cupo: **402 caracteres sin saltos** (415 con saltos) contra **381 de hoy: faltan 21**, confirmado (tabla abajo). |
| 3 | Marca | Todo cumple (ver «Lo que verifiqué»). `lucia-prohibidas.mjs` sobre `pie.txt` y `guion-voz.txt`: **«0 coincidencias en 0 archivos», salida 0.** |
| 4 | Cuadros | Sin texto cortado ni pisado, sin parpadeos, sin cuadros planos. Los avisos no tapan cara ni manos en las escenas de clip; **en el gancho sí quedan ocultos teléfono y manos (H1)**. |
| 5 | ArcFace | **18 cuadros válidos, máx. final↔fuente 0,019** (el editor: 0,018; límite 0,02): cumple pero con 0,001 de margen. Tabla abajo. |

### Voz a 17 c/s contra los tramos (mi cálculo; el texto es idéntico línea a línea a `plan.resuelto.json → tramos`)
402 caracteres sin saltos, 14 líneas, 72 palabras. Hueco = tramo − (caracteres / cps). Ninguna pisa a la siguiente a 16, 17 ni 18 c/s.

| L | Car | Tramo (s) | Voz a 17 c/s | **Hueco a 17** | Hueco a 16 | Hueco a 18 | Línea |
|---|---:|---|---:|---:|---:|---:|---|
| 1 | 22 | 0,125-1,708 (1,58) | 1,29 | **+0,29** | +0,21 | +0,36 | ¿Quién pierde la cara? |
| 2 | 30 | 1,708-3,750 (2,04) | 1,76 | **+0,28** | +0,17 | +0,38 | Seis clips con la misma orden. |
| 3 | 32 | 3,750-5,875 (2,12) | 1,88 | **+0,24** | +0,12 | +0,35 | Se mide contra ocho fotos suyas. |
| 4 | 14 | 5,875-6,917 (1,04) | 0,82 | **+0,22** | +0,17 | +0,26 | De cero a uno. |
| 5 | 22 | 6,917-8,458 (1,54) | 1,29 | **+0,25** | +0,17 | +0,32 | Mi piso: cero setenta. |
| 6 | 39 | 8,458-11,000 (2,54) | 2,29 | **+0,25** | +0,10 | +0,37 | Kling tres, foto sola: pierde parecido. |
| 7 | 25 | 11,000-12,708 (1,71) | 1,47 | **+0,24** | +0,15 | +0,32 | Seedance Mini, foto sola. |
| 8 | 19 | 12,708-14,042 (1,33) | 1,12 | **+0,22** | +0,15 | +0,28 | Queda bajo el piso. |
| 9 | 40 | 14,042-16,667 (2,63) | 2,35 | **+0,27** | +0,13 | +0,40 | Kling O tres, solo referencias: aguantó. |
| 10 | 23 | 16,667-18,250 (1,58) | 1,35 | **+0,23** | +0,15 | +0,31 | Pero inventó el cuarto. |
| 11 | 38 | 18,250-20,708 (2,46) | 2,24 | **+0,22** | +0,08 | +0,35 | Con referencias, aquí la cara aguantó. |
| 12 | 32 | 20,708-22,833 (2,12) | 1,88 | **+0,24** | +0,12 | +0,35 | Pero el motor inventa la escena. |
| 13 | 33 | 22,833-25,000 (2,17) | 1,94 | **+0,23** | +0,10 | +0,33 | Una toma por clip: es una prueba. |
| 14 | 33 | 25,000-27,792 (2,79) | 1,94 | **cola 0,85** | +0,73 | +0,96 | Seguime: cada semana, una prueba. |

Los huecos a 17 c/s (0,22-0,29 s) son los de la revisión 2 y los del editor: **L9 y L11 cambiaron de texto sin cambiar de largo ni de tramo** (40 y 38 caracteres). La pieza **no cabe en el cupo de hoy** (402 > 381): la voz definitiva espera al 13-oct 01:17 UTC o se recorta ≈ 21 caracteres.

### Cifras del pie contra la medición

| Cifra del pie | Fuente | Estado |
|---|---|---|
| «los 6 clips parten de 4 de las 8 fotos» · «la foto de arranque se hizo con 4 de esas 8 (R1, R3, R6 y R7)» | cabecera de la prueba estricta l.170-171 | ok |
| Seedance 2.0 Mini + referencias recibió R1 y R3 · Kling O3, R1, R3, R6 y R7 | cabecera l.3-6 | ok |
| «cinco partieron de la misma foto» | cabecera l.170 (K1 en Kling std, pro, Seedance Mini, Seedance + ref., Cinematic) | ok |
| Fotos que nadie recibió: R2, R4, R5, R8 · «bajan entre 0,03 y 0,09» · «el orden de los finales no cambia» | l.167, 197, 288 | ok (H2: falta contexto) |
| 0,75 · 0,73 · 0,71 · 0,68 · 0,67 · 0,60 | l.282-287 (0,749 · 0,728 · 0,711 · 0,678 · 0,669 · 0,596) | ok |
| «89 a 168 px» en Kling O3 | l.253, 271 | ok |
| 0,81→0,74 · 0,71→0,80 · 0,79→0,77 (los tres que no salen) · 0,79→0,72 · 0,69→0,64 · 0,80→0,82 | l.267-272 columna A | ok |
| créditos 7,5 · 6 · 6 · 9 · 6 · 20 · piso 0,70 · ±0,03 · «segundo 5,9» | PROCEDENCIA / skill | ok (no recomputado) |

### Control de cara (ArcFace buffalo_l, 8 referencias oficiales de `lucia-g4-v2/assets/refs-orig/`; cuadros nuevos; fuente = el mismo cuadro del clip o `k1.jpg`)

| Cuadro del final | Final | px | Fuente | px | Dif. |
|---|---:|---:|---:|---:|---:|
| gancho n10 (K1, zoom) | 0,798 | 180 | 0,806 | 237 | 0,008 |
| gancho n50 | 0,799 | 181 | 0,806 | 237 | 0,007 |
| gancho n75 | 0,798 | 186 | 0,806 | 237 | 0,008 |
| Kling 3.0 std n212 (c15) | 0,793 | 179 | 0,793 | 119 | 0,000 |
| Kling 3.0 std n235 (c38) | 0,753 | 179 | 0,760 | 119 | 0,008 |
| Kling 3.0 std n250 (c53) | 0,723 | 179 | 0,742 | 119 | **0,019** |
| Seedance 2.0 Mini n265 (c7) | 0,687 | 187 | 0,682 | 124 | 0,005 |
| Seedance 2.0 Mini n280 (c22) | 0,658 | 216 | 0,650 | 144 | 0,008 |
| Seedance 2.0 Mini n305 (c47) | 0,665 | 251 | 0,670 | 168 | 0,005 |
| Seedance 2.0 Mini n320 (c62) | 0,619 | 259 | 0,637 | 173 | 0,018 |
| Kling O3 n340 (c9) | 0,792 | 141 | 0,780 | 94 | 0,012 |
| Kling O3 n355 (c24) | 0,789 | 150 | 0,783 | 100 | 0,007 |
| Kling O3 n372 (c41) | 0,818 | 162 | 0,805 | 108 | 0,013 |
| Kling O3 n400 (c69) | 0,805 | 194 | 0,808 | 129 | 0,003 |
| Kling O3 n425 (c94) | 0,792 | 209 | 0,801 | 139 | 0,009 |
| cierre n600 (c60) | 0,734 | 179 | 0,742 | 119 | 0,008 |
| cierre n645 (c105) | 0,746 | 175 | 0,736 | 116 | 0,010 |
| cierre n665 (c125) | 0,699 | 173 | 0,712 | 115 | 0,014 |

**Máx. 0,019 (límite 0,02).** Descarté el cuadro n200 (final 0,640 contra fuente 0,788): cae **dentro del empuje 8,208-8,458 s** (cuadros 197-203), con la cara a medio entrar; es un cuadro mal elegido por mí, no un defecto. Lo declarado (máx. 0,018 en n247) coincide: **el mismo tramo de Kling 3.0 std (8,5-10,4 s) da la mayor diferencia, con el final por debajo de la fuente en 0,018-0,019**: queda a 0,001 del límite y el render no es reproducible bit a bit, así que un re-render podría cruzarlo. Seedance 2.0 Mini baja de 0,70 en la fuente y en el final (0,619-0,687); Kling O3 ≥ 0,70 siempre; el cierre termina en 0,699 contra 0,712 de la fuente (el README ya lo declara y no hay cifra sobre ese cuadro).

---

## Estado de los hallazgos de la revisión 2

| H | Estado en el master real | Nota |
|---|---|---|
| **H1** MEDIA: «los otros cuatro, ninguna» y «dentro del ruido» contra una base no independiente | **Resuelto** | El pie dice que K1 se hizo con R1, R3, R6 y R7 y que **ningún clip es independiente**; la estimación (≈ 0,026 / 0,012), «exceso» y «dentro del ruido» **no aparecen** en `pie.txt`, `guion-voz.txt` ni `index.html` (grep: solo en notas internas de `plan.json`). Las cifras de mi tabla de la revisión 2 (0,75 · 0,67 · 0,60…) están ahora en la sección «PRUEBA ESTRICTA» de la medición, que reproduce PROCEDENCIA en 41 puntos, y el build las lee de ahí. **Sigue sin haber control limpio** (cuesta créditos; lo decide la madre). Nuevo matiz: H2 de esta revisión. |
| **H2** MEDIA: divulgación a los 19,7 s | **Resuelto en forma; pendiente de claridad en el gancho** | Avisos en gancho, clip y lección, más el aviso en los caracteres 51-121 del pie (verificado). Reserva: H1 de esta revisión. |
| **H3** MEDIA: pie difícil de leer | **Resuelto en lo principal** | Aviso dentro del pliegue, sin «ninguna:», «referencia» con un solo sentido, sin jerga de «exceso», cifras de cara de un solo tipo por clip. Quedan H3 y H5 de esta revisión (BAJA). |
| **H4** BAJA: «fotos de puntaje», letra chica | **Resuelto** | «con que se mide», 36 px, ≈ 13 px a 390 px de ancho, legible. La ventana de la lección es de 5,13 s (pide 3,80). |
| **H5** BAJA: README sobregeneraliza | **Resuelto** | README: «81 % en Kling O3, 40 % en Seedance + referencias; la frase ya no se usa»; la fila H8 ya no dice 1.435; un solo tamaño de cara por clip. La cabecera de la medición («25 puntos») sigue sin corregirse (no es de esta carpeta). |
| **H6** BAJA: «sostiene» como regla en la voz | **Resuelto (texto)** | L9 y L11 en pasado y con «aquí»; mismos largos y tramos; el README dice que «con referencias la cara aguantó» se confirmó contra las 4 fotos que ningún clip recibió. Cupo igual: 402 > 381. Residuo: el pie (H5 de esta revisión). |
| **H7** BAJA: la prueba negativa comprobaba presencia, no verdad | **Resuelto (leído, no corrido)** | `build.mjs` construye las frases esperadas del pie desde el archivo de la medición (l.352), recalcula el rango 0,03-0,09 como mínimo/máximo de los 41 puntos (l.340), el orden de los finales (l.335-338) y las cifras de PROCEDENCIA (l.318); 58 mutaciones declaradas (`qa/validar-mutaciones.txt`). **No lo corrí** (importa `build.mjs`). |

---

## Lo que verifiqué y está bien

- **Master:** SHA-256 completo = `b7f07e179bc7758740f748b865e7a24a88f197c6a104c748ea913e74d0a24229` (igual al declarado); H.264 1080x1920, 24 fps, bt709, 9,12 Mbps, **667 cuadros leídos = 27,792 s**; AAC 48 kHz estéreo, `volumedetect` −91,0 dB medio y máximo (muda). Preview 360p SHA `142c4699…` e `index.html` md5 `ca9476c5…` iguales a los del README.
- **Marca:** rótulo «Lucía Antelo · personaje IA de Onia» (y = 720-800, 40 px) y título «¿Quién pierde la cara?» (tarjeta, y = 1308-1468) **desde el cuadro 0**, ambos legibles; el primer resultado («parecido final: 0,64 a 0,82») entra a 0,875 s y es legible desde 0,96 s (< 3 s); **CTA exacto «Seguime: cada semana, una prueba.»** de 25,0 a 27,79 s en el master (≥ 2,79 s; el DOM da 2,88 s; ≥ 2,4); sin logos ni capturas de terceros, sin producto de Onia ni de Sergio, sin profesión; las herramientas se nombran como uso propio (D-N1) y el pie trae **«Nombro lo que uso; no es una recomendación pagada.»** (carácter 2.050).
- **Pie:** abre con «Personaje hecho con IA» (carácter 0); **2.186 caracteres de 2.200** (2.211 bytes); 4 hashtags; aviso en los caracteres 51-121.
- **Zona segura (cuadros):** texto más alto en y = 300 (título de la lección; nada sobre ≈ 280); lo más bajo, las tarjetas, termina en y ≈ 1470 (nada bajo ≈ 1490); los avisos terminan en x = 900 (gancho), 973 (clip) y 982 (lección), todos < 1000; ningún texto < 36 px (DOM, 223 instantes). Los tres avisos no tocan cara ni, en clip y lección, manos ni barras; el de la lección tiene fondo opaco y corta la línea de «mi piso» 57 px entre las barras de Seedance y Kling O3 (igual que en la v2.2; no toca el anillo ni el «0,64»).
- **A 390 px de ancho** (2,0 · 15,5 · 22,0 s): los tres avisos miden ≈ 12-13 px y se leen; el del gancho queda pequeño frente a la pastilla de 46 px.
- **Costuras y movimiento (mi medida, 667 cuadros en gris 270x480):** 0 cuadros planos (luma mín. 16,1; en `vacios.py` también 0); los saltos de luma de 15-51 solo caen en los 6 empujes y **fuera de ellos el mayor es 2,8** (n396→397, la salida del «0,82» de la escena); 0 parpadeos (cambio de luma > 3 con inversión de signo). Tramos quietos > 0,3 s: 5,21-5,88 · 7,29-8,21 · 21,88-22,54 · 22,92-23,71 · 24,00-24,75 s, **todos bajo una tarjeta dentro de su lectura** (c3, c4, c10, c11) o con ≤ 0,15 s fuera de ella. No hay línea suelta en los bordes (columnas 0-3 y 1074-1079 uniformes en n420; lo que parecía una línea en la hoja era el borde de la celda vecina).
- **Lectura:** las 37 ventanas del DOM alcanzan la regla (menor holgura +0,05 s, c1); el aviso del gancho +0,27, el del clip +0,28, el de la lección +1,33.
- **Lo que no cambió y debía seguir igual:** las 12 tarjetas (salvo c9), los 14 tramos de voz a los mismos cuadros, los clips y la duración; los números de la pantalla (0,79→0,72 · 0,69→0,64 · 0,80→0,82 · 0,64 a 0,82) coinciden con PROCEDENCIA l.97 y con la columna A de la medición (diferencia ≤ 0,0005).
- **El «mapa de ids»:** K1 con `abe2e6bd`, R1 (`a7cfb766`), R3 (`d7d6d36a`), R6 (`df491c87`), R7 (`8ce2f65c`) y el maniquí; O3 con las mismas cinco menos el maniquí: coincide con la cabecera de la medición (l.170-171) y con la revisión 2.

## Lo que no pude verificar

- **`job_display` de los seis clips** (qué recibió cada uno): no uso el MCP de Higgsfield en esta revisión. Me apoyo en la cabecera de la medición, PROCEDENCIA, `LUCIA-HIGGSFIELD-IDENTITY.json` y la revisión 2.
- **Que la selfie «ancla espejo» (`abe2e6bd`) sea de verdad una foto distinta de las 8:** la medición la declara fuera de las 8 y la recibieron K1, Seedance + referencias y Kling O3; no hay copia local y no pude compararla con R1-R8 (en particular con R8 «anchor»).
- **Cómo se ve en el teléfono con la interfaz de Instagram** (corte del pie en ≈ 125 caracteres, columna de iconos sobre las pastillas): solo simulé 390 px de ancho. Si el corte cae antes del 121 el aviso pierde su «(abajo)» (H3).
- **Voz real:** no existe; los tramos son los derivados a 17 c/s (una línea pisaría a la siguiente si la voz real fuera más lenta que ≈ 15,1 c/s en L3 y L12, ≈ 15,2-15,5 en L6, L9, L11 y L13).
- **`validar-mutaciones.mjs`, `hyperframes check`, `medir-dom.mjs` y `ventanas.mjs`:** leí sus salidas, no los volví a correr (los dos primeros entran a `build.mjs`/renderizan).
- **El tamaño real de la fuga:** sigue sin existir un clip cuya foto de arranque no descienda de R1, R3, R6 y R7. La prueba estricta (la caída, el mismo orden) no es una medida de fuga (H2).
- Los nombres comerciales de las herramientas: no consulté Higgsfield en vivo.
