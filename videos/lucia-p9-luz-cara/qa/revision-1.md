# Revisión 1 · Lucía P9 «La cara o la escena.» (mudo, 20 s) — revisor independiente, 11-oct-2026

**Veredicto: NO LISTO PARA MOSTRAR TAL CUAL. Aprobado con cambios, y uno es obligatorio y pide re-render (H1).** 11 hallazgos: **1 ALTA · 4 MEDIA · 6 BAJA.**

Las cifras de pantalla, pie y guion de voz son fieles a `v4/PROCEDENCIA.jsonl` l.97 y a `medicion-luz-movimiento-20261011.txt` (las reproduje midiendo yo). No hay ranking, ni «el mejor», ni producto de Onia, ni cara o voz de Sergio Urcullo, ni profesión dicha. Rótulo, título, primer número (1,54 s), CTA (2,417 s) y zona segura se cumplen. El master es el declarado y los empujes son rígidos. Lo que impide darlo por bueno:

- **H1 (ALTA):** el texto del límite de cara **invierte la confiabilidad**: nombra solo a Seedance, cuando 3 de las 4 cifras en pantalla (0,79, 0,72 y 0,71) están medidas sobre caras bajo 200 px y la única medida sobre una cara confiable es el 0,80 de Seedance. No es una cifra falsa; es una omisión que lleva a una conclusión equivocada.
- **H2 (MEDIA):** la placa final es una pared: 63 palabras a la vez (7,6 palabras/s de lectura pedida frente a 3,0-3,6 en los otros dos tramos).
- **H3 (MEDIA):** «una toma cada uno: prueba, no regla» recién entra a los 11,8 s; antes el titular y las dos pastillas afirman una disyuntiva.
- **H4 (MEDIA):** la voz futura no está calculada contra el corte: la línea de Kling se habla encima de Seedance, y los decimales hablados alargan las líneas con cifras (estimación mía; la voz no existe).
- **H5 (MEDIA):** el letrero inventado de la torre se ve ~4,5 s sin decirlo.

H1, H2, H3 piden **un solo re-render** (0 cr). El resto se arregla sin render (pie, README, guion de voz).

**Cómo revisé.** SHA-256 completo, `ffprobe`, `volumedetect`, md5 de `index.html` y SHA de las dos fuentes. 40 cuadros a 2 fps en 4 hojas de contacto (`montage`), todas **miradas**. A resolución completa: cuadros 0, 39 y 479; mosaicos de los 9 cuadros de cada empuje (137-145 y 274-283); la entrada de la pastilla (35-40); recortes a 3x del letrero (cuadro 216), de la mano y el teléfono (204, 250). Simulé 390 px de ancho (cuadros 39, 400, 479). Barrí en píxeles los 480 cuadros (gris 108x192, independiente de `pixeles.mjs`), medí en píxeles la zona segura (4 cuadros de placa y 4 de clips), el cuadro de arranque del CTA y las costuras. Corrí `face-gate.sh` (venv ya instalado) sobre **14 cuadros del clip fuente** (los 7 puntos de PROCEDENCIA por clip), **8 cuadros del master** y los 8 equivalentes de la fuente. Medí `signalstats` (luma) de los dos clips y el PSNR de dos cuadros. Contrasté cada texto contra PROCEDENCIA, la medición de luz, `PLAN.md` §4/§4-bis, `LUCIA.md` §0, `SKILL.md` y el contrato de Codex. No usé git, no rendericé, no ejecuté `build.mjs` ni los gates que escriben en `qa/` (`grep-prohibidas.mjs` guarda su salida ahí: hice el barrido equivalente con `grep`), no instalé nada, no gasté créditos ni generé voz. Solo escribí este archivo; lo demás quedó en el scratchpad.

---

## Hallazgos

### H1 · ALTA · El límite de cara nombra solo a Seedance y deja a Kling como si fuera sólido
- **Dónde:** placa 11,79-20 s (`#limite-cara`, «El parecido es indicativo: bajo 200 px la cara es poco confiable (Seedance parte de 139 px). Ruido de ±0,03.»); `pie.txt` («…(en Seedance 2.0 Mini parte de 139 px) y el ruido es de ±0,03.»); `plan.json → textos.limite_cara`. La etiqueta «Cara: 139 → 347 px · reencuadra» (6-11,5 s) comparte parte del problema (unidades).
- **Evidencia (medida por mí con `face-gate.sh` sobre el clip original de 720p; `cara_px` = ancho de la caja SCRFD).** Reproduce PROCEDENCIA al milésimo.

  | Clip | t (s) | 0 | 1 | 2 | 3 | 4 | 5 | 5,9 |
  |---|---|---:|---:|---:|---:|---:|---:|---:|
  | **Kling 3.0 std** | parecido | 0,791 | 0,793 | 0,762 | 0,734 | 0,761 | 0,708 | 0,721 |
  | | cara (px) | 119 | 118 | 120 | 116 | 116 | 115 | 116 |
  | **Seedance 2.0 Mini + ref.** | parecido | 0,707 | 0,762 | 0,754 | 0,726 | 0,796 | 0,777 | 0,801 |
  | | cara (px) | 139 | 181 | 243 | 290 | 305 | 328 | 347 |

  **Kling: 7 de 7 puntos bajo 200 px (115-120 px). Seedance: 2 de 7** (139 y 181; desde los 2 s pasa de 243 y termina en 347). De las cuatro cifras que el espectador lee en pantalla, **tres** están sobre caras bajo 200 px: 0,79 (119 px), 0,72 (116 px) y 0,71 (139 px). **Solo el 0,80 de Seedance (347 px) está sobre una cara confiable.**
- **¿Es verdadera la frase tal cual?** Cada pieza es verdadera: «bajo 200 px la cara es poco confiable» es la regla del gate (`face-gate.sh` l.9 y l.60; `SKILL.md`: «en un clip crudo de 720p son ~115 px»), y «Seedance parte de 139 px» es el primer punto medido. **Pero la frase, leída entera, deja creer tres cosas falsas:**
  1. que el problema de tamaño es de Seedance y no de Kling (es al revés: Kling está bajo 200 px todo el clip);
  2. que el 0,72 de Kling es una medida sólida (está medido a ~116 px; la cifra en pantalla más débil, y es justo la que dice «baja»);
  3. que lo dudoso de Seedance es su cifra (el 0,71 inicial, a 139 px, sí; el 0,80 final, a 347 px, es la más confiable de las cuatro).
  El editor lo avisó (README obs. 3 y duda 4) pero dejó el texto. **Mi juicio: hay que cambiarlo.** No porque haya un número falso, sino porque la frase única de honestidad de la pieza invierte quién es el confiable.
- **Unidades.** Los «139 → 347 px» y los «200 px» son píxeles del **clip original de 720p** (`qa/arcface-final.txt`: el lienzo se escala x1,5). En el cuadro de 1080 que ve el espectador la cara de Seedance mide ~209 → ~520 px (SCRFD sobre el master: 222 px de ancho en el cuadro 144, 522 px en el 276) y la de Kling 172-181 px. Quien mire la pantalla y estime la cara de Seedance en 500 px leerá «347 px» como un error. Ninguna pantalla dice «del clip original».
- **¿El 0,72 sostiene «baja» (−0,07) con ruido de ±0,03? Sí, con cautela, y el texto debe decir «baja», no «pierde la cara».**
  - La diferencia entre extremos es 2,3 veces el ruido, y supera incluso el peor caso de dos medidas con ±0,03 cada una (0,06).
  - La serie de 7 puntos va en la misma dirección (ajuste lineal mío sobre los números de PROCEDENCIA: de 0,794 a 0,713, pendiente −0,014/s, unas 4 veces su error, residuo típico 0,017, bajo 0,03). Una medida mía en el cuadro de 5,5 s da 0,680, que cae todavía más (el gate del repo es 0,70).
  - Pero el 0,72 final queda a solo 0,02 sobre el piso del repo (0,70) y está medido con una cara de 116 px: «baja un poco y sigue cerca del piso», no «pierde la cara».
  - Seedance: +0,094 entre extremos (3 veces el ruido), pendiente más débil (~2,8 errores; el punto de 3 s, 0,726, cae a 0,796 a los 4 s) y confundida con el reencuadre (la cara crece 2,5 veces). La prueba del 9-oct (`videos/lucia-g5/qa/cara-chica-control.txt`) acota el efecto del tamaño en reducciones limpias (−0,004 a −0,010 en 5 de 6 fotos, ±0,02 en la sexta), pero no se midió en este clip.
- **Arreglo.**
  - **Pantalla (re-render), 19 palabras:**
    > **«Parecido indicativo. Bajo 200 px la cara es poco confiable: Kling, todo el clip; Seedance, el inicio. Ruido ±0,03.»**
    Verdadera para ambas tomas, sin cifras nuevas (200 px y ±0,03 ya están en el contrato; «todo el clip» e «inicio» salen de mi medición con `face-gate.sh` arriba). No casa con la regex prohibida de `grep-prohibidas.mjs` («las/todas las/ambas caras…menos de 200»), porque no afirma que las dos caras estén bajo 200 px todo el clip.
    *Versión mínima (12 palabras) si la madre prefiere densidad:* **«Parecido indicativo: bajo 200 px la cara es poco confiable. Ruido ±0,03.»** No señala a nadie y es verdadera para ambas; los detalles quedan en el pie.
  - **Etiqueta (re-render):** «Cara: 139 → 347 px **del clip original** · reencuadra» (8 palabras; su ventana de 5,75 s sobra: 3,1 s pedidos).
  - **Pie (sin re-render):** reemplazar «el parecido es indicativo: bajo 200 px la cara es poco confiable (en Seedance 2.0 Mini parte de 139 px) y el ruido es de ±0,03.» por:
    > «el parecido es indicativo: bajo 200 px la cara es poco confiable. En el clip original (720p), la cara de Kling 3.0 std queda bajo 200 px todo el clip; la de Seedance 2.0 Mini, solo al inicio (pasa de 139 a 347 px porque el encuadre se acerca). El ruido es de ±0,03: las dos diferencias (0,07 y 0,09) lo superan, pero son una toma cada una.»
  - Sitios a tocar: `plan.json → textos.limite_cara` y `reencuadre`, `pie.txt`, y el literal `esperado` de `scripts/build.mjs` (l.30), como dice el README.

### H2 · MEDIA · La placa final es una pared de texto
- **Dónde:** 11,79-20 s (8,29 s; 11,79-17,58 sin CTA).
- **Evidencia.** 63 palabras a la vez (68 con el CTA), contadas igual que el editor, sin flechas ni «+»: filas 21, «toma» 10, «brillo» 12, límite 20. Con la regla de lectura del propio proyecto (0,35 s/palabra + 0,3 s por texto) piden ~23 s; a 3 palabras/s, ~21 s; hay 8,29 s. Comparación de lo que se pide leer por segundo: tramo de Kling 21 palabras en 5,9 s (3,6/s), tramo de Seedance 17 en 5,75 s (3,0/s), **placa 7,6/s**. `ventanas.mjs` marca todo en verde porque mide cada texto contra la placa entera como ventana; eso prueba que cada texto *podría* leerse, no que se lean los cuatro.
  - Las filas repiten cifras ya vistas en las pastillas: se pasan de vista. Lo nuevo y lo que de verdad importa (los tres límites: 42 palabras, ~14 s de lectura) es lo que no cabe, y el de la cara (20 palabras, 7,3 s pedidos por el propio gate) es el único que la voz futura **no dice** (guion L5 dice «toma», L6 dice «brillo»).
  - Estática: en mi barrido de píxeles la placa está **quieta 5,7 s (11,79-17,5) y otros 2,4 s (17,58-20)**; los «eventos» son tres cambios de color de un borde de 10 px (13,5, 15,2 y 16,9 s) y el CTA. Cumple la regla 15 con la exención, pero mudo es una imagen fija.
  - **La «mitad inferior vacía» no es espacio libre:** la zona útil es y 300-1490 (1190 px) y la placa llega a 1451 con el CTA (97 %); lo que queda debajo de 1490 es la interfaz de Instagram. No hay dónde ampliar.
- **Arreglo (re-render; decisión de la madre).** Con 20 s el techo de duración es fijo, así que no se arregla solo con redacción: hay que **sacar texto y escalonar**.
  1. Dejar las filas (se miran de pasada) y, de las notas, que lo nuevo para leer sea ≤ ~26 palabras: «Una toma cada uno: prueba, no regla.» (7), el límite de H1 (19). La nota del brillo (12 palabras) pasa a un texto de 6-8 palabras («Brillo: cuadro entero, mezcla luz y encuadre.»; o «Brillo del cuadro entero: luz y encuadre.») o se fusiona con la de «toma». Con voz, lo dicho (L5, L6) se acompaña leyendo; el límite de cara es lo único que pide ojos. Mudo, sigue denso: aceptar o escalonar.
  2. Que las notas **entren de a una** (p. ej. filas a 11,79 s; «toma» a ~12,5; «brillo» a ~14,2; límite a ~15,2 s), cada una con su acento al entrar, en lugar de aparecer juntas y teñirse luego. Así los «eventos» son visibles de verdad.
  3. Opción de tiempo (no recomendada): acortar el último segundo de m1 para ganar ~1 s de placa; la pantalla dejaría de mostrar el instante medido (5,9 s).
- **Cosmético de la misma placa:** los huecos entre notas son desiguales (14 px entre «toma» y «brillo», 64 px entre «brillo» y el límite) y la flecha mono (→) queda diminuta; se resuelve al reordenar.

### H3 · MEDIA · «Una toma cada uno: prueba, no regla» llega a los 11,8 s; antes, el titular afirma una disyuntiva
- **Dónde:** 0-11,5 s (titular «La cara o la escena.» + pastillas de Kling y de Seedance); el límite está en la placa y en el pie.
- **Evidencia.** El contrato prohíbe la afirmación general («la luz cambia cuando la cara se sostiene») y lo respalda: Kling O3 con 5 referencias sostiene cara y brillo (0,80 → 0,82; +2,1) y Cinematic Studio 3.0 sostiene la cara dentro del ruido. Durante los primeros 11,8 s la pantalla muestra «La cara o la escena.», una toma que mantiene la escena y pierde parecido y otra que lo contrario, sin ninguna calificación. La mayoría de la gente no ve los 20 s ni abre el pie. Las pastillas son correctas; el titular, como afirmación, hace de regla. (Nota: el titular tiene 5 palabras, no 4 como dice el contrato; está en el rango de 3-7.)
- **Arreglo (re-render, 0 palabras nuevas):** titular **«¿La cara o la escena?»**. Pasa de afirmación a pregunta, como los otros ganchos de la serie («¿Cómo sé que sigue siendo ella?», «¿Quién pierde la cara?»), y la placa y el pie responden «una toma». No agregar «una toma» a la pastilla de Kling: con 12 palabras pide 4,5 s y su ventana tiene 4,29 s. Cambiar `textos.titulo` y el literal de `build.mjs`.

### H4 · MEDIA · La voz futura no cabe en su cronograma: cruza el corte y los decimales hablados la alargan
- **Dónde:** `guion-voz.txt` L3 y L4; `qa/tramos-voz.json`; `scripts/voz.mjs` (17 car/s sobre el texto escrito).
- **Tabla línea por línea a 17 caracteres/segundo (lo pedido), contra su tramo.** «Hueco» = tramo menos voz; nada se desborda *por construcción*, porque los tramos salen de esta misma estimación:

  | L | Línea | Car | Voz (s) | Tramo (s) | Hueco | Pantalla durante el tramo |
  |---:|---|---:|---:|---|---:|---|
  | 1 | La cara o la escena. | 20 | 1,18 | 0-1,42 | 0,24 | título |
  | 2 | Dos clips, misma foto y misma orden. | 36 | 2,12 | 1,42-3,75 | 0,22 | la pastilla de Kling entra a 1,5 s (antes que la voz diga Kling) |
  | 3 | Kling 3.0 std: brillo casi igual, cara de 0,79 a 0,72. | 54 | 3,18 | 3,75-7,17 | 0,24 | **cruza el empuje a Seedance (5,75-6,0 s)** |
  | 4 | Seedance Mini con referencias: cara a 0,80, pero la imagen se oscurece. | 71 | 4,18 | 7,17-11,58 | 0,24 | Seedance; el empuje a la placa empieza a 11,54 s |
  | 5 | Una toma cada uno: prueba, no regla. | 36 | 2,12 | 11,58-13,92 | 0,22 | placa |
  | 6 | Brillo del cuadro entero: mezcla luz y encuadre. | 48 | 2,82 | 13,92-16,96 | 0,22 | placa |
  | 7 | Seguime: cada semana, una prueba. | 33 | 1,94 | 16,96-20,0 | 1,10 (cola; CTA desde 17,58) | placa + CTA |

  Total 304 caracteres (298 + 6 saltos) = 17,9 s de voz en 20 s; cupo de 381 hasta el 13-oct 01:17 UTC: sobran 77.
- **Defecto 1: la línea de Kling se dice sobre la imagen de Seedance.** L3 termina a 3,75 + 3,18 = **6,93 s**, y el corte a Seedance es a 5,75-6,0 s. Las cifras de la línea («de 0,79 a 0,72», ~0,8 s) caen de ~6,1 a ~6,9 s, cuando la pantalla ya muestra la pastilla de Seedance con «0,71 → 0,80». Entre 6,0 y 7,17 s no se habla de Seedance. Los tramos se calcularon sin mirar los cortes de imagen.
- **Defecto 2 (riesgo, estimación mía; no hay voz):** la voz leerá los decimales («cero coma setenta y nueve a cero coma setenta y dos»). Con el texto hablado, L3 sube a ~106 caracteres = **~6,2 s a 17 car/s (+2,8 s sobre su tramo)** y L4 a ~84 = ~4,9 s (+0,5 s); en total ~21,7 s > 20 s. Un cruce por sílabas a 5,9 sil/s da el mismo signo (L3 ~5,6 s, L4 ~5,3 s). Si se escribieran los números con letras para controlar la pronunciación, el cupo usado sube a ~369 de 381 y no queda margen para una retoma.
- **Defecto 3 (menor):** los acentos de la placa (13,5, 15,2, 16,9 s) no caen sobre las palabras de la voz; el del límite (16,9 s) cae cuando L6 ya terminó.
- **Arreglo (sin gasto, antes de pedir la voz).**
  1. Hacer coincidir tramos y cortes: L1-L3 dentro de 0-5,9 s y L4 desde 6,0 s. Eso obliga a ~1 s menos de voz antes del corte con el texto escrito, y mucho más con los decimales hablados. La salida limpia es **no hablar los decimales de Kling** (están en pantalla): p. ej. L3 = «Kling 3.0 std: brillo casi igual, la cara baja un poco.» (sin cifras) y L4 = «Seedance Mini con referencias: la cara sube, pero la imagen se oscurece.» (sin cifras). Acortar L2 a «Misma foto, misma orden.» si hace falta.
  2. Generar primero las pistas (con el OK de cupo de la madre), medirlas y **derivar los tramos de las duraciones reales**; apretar pausas, no acelerar (receta de G1 v2).
  3. Con la voz mezclada: `silencedetect` por cada 10 s, LUFS integrado a −14 con `ebur128`, SHA nuevo (el actual cambia).

### H5 · MEDIA · El letrero inventado de la torre se ve ~4,5 s y nada dice que es inventado
- **Dónde:** m4, de ~7,0 s hasta el empuje de 11,54 s (esquina superior izquierda, a unos 90-170 px del borde superior del lienzo, o sea por encima de la zona segura de texto).
- **Evidencia.** Recorte a 3x (cuadro 216): letras claras tipo «DMOSS»/«DAISS» (así lo llama `higgsfield-mapa.md`) sobre la torre, y una segunda mancha clara en la otra cara del edificio. En la hoja de 2 fps se lee como un cartel de verdad durante todo el tramo. Es justo el error que la serie enseña en G3 («letrero inventado») y que G5 v2 resolvió con el cuadro difuminado y «Lo difuminé: lo inventó el motor». `SKILL.md` («9-oct · el fondo… se mira a 3x antes de publicar») pide tapar los logos tipo marca. PROCEDENCIA ya lo anota («invento un letrero en la torre»), pero ni pantalla ni pie lo dicen. La madre pidió que no se lea como real.
- **Arreglo.**
  - **Sin re-render:** una frase en el pie: «Seedance 2.0 Mini inventó un letrero en la torre (de 7 a 11,5 s): no existe.»
  - **Con re-render (mismo render que H1-H3):** como el letrero siempre está en y < 180 px del lienzo, basta un degradado oscuro (scrim) o un desenfoque fijo en la franja superior izquierda (y 0-260, x 0-420) de 7 a 11,5 s: no cambia los píxeles medidos (PSNR se mide en y 400-700) ni toca la cara, y queda dentro de la zona que la interfaz de Instagram ya cubre. Si la madre prefiere dejarlo como «error atrapado», entonces va en pantalla («Lo inventó el motor.»), con su ventana de lectura.

### H6 · BAJA · «156 → 155,1 (−1,0)»: la aritmética no cuadra a simple vista, y el brillo no lleva escala en pantalla
- **Dónde:** placa, fila de Kling; pastillas («brillo −1,0», «brillo −34»).
- **Evidencia.** Medí `signalstats`: m1 = 156,041 → 155,077 (Δ −0,964 → «−1,0»), m4 = 145,5 → 111,8 (Δ −33,7 → «−34»). **El −1,0 es correcto, pero «156 → 155,1» se resta en la cabeza a −0,9.** Pasar «156» a «156,0» (la duda del editor) **no lo resuelve**: 156,0 − 155,1 sigue siendo −0,9. Es doble redondeo. En pantalla no aparece «de 0 a 255» (solo en el pie): «brillo −34» puede leerse como −34 %.
- **Arreglo (re-render, trivial):** poner todo en enteros: «brillo 156 → 155 (−1)» y «145,5 → 111,8» como «146 → 112 (−34)» (suman −1 y −34 exactos); las pastillas «brillo −1» y «−34»; y escribir «(0 a 255)» una vez en la placa. Mantener el criterio de `build.mjs` (redondeo de la fuente). El «−»: en la fuente mono se ve como guion corto y se lee bien a 390 px; no hace falta cambiarlo.

### H7 · BAJA · Las barras no tienen escala y solo muestran el valor final: comparan lo que el límite dice no comparar
- **Dónde:** placa, cuatro barras (verde = brillo final, naranja = parecido final).
- **Evidencia.** Ninguna barra dice su escala (0-255, 0-1) ni qué mide; el largo es el valor final (155,1/255, 111,8/255, 0,72, 0,80), no el cambio. Lo que el ojo compara es 0,72 contra 0,80, es decir, una cifra medida a ~116 px de cara contra una medida a 347 px, justo lo que H1 dice que no es comparable. Con la lectura «cada uno gana una barra» refuerza la disyuntiva de H3 sin decirla (no hay ranking escrito, y no lo hay).
- **Arreglo:** rotular la escala debajo de cada pareja de barras («0 a 255», «0 a 1»), o mostrar inicio y fin en cada barra (marca y relleno). Opcional si no se re-renderiza por H1-H3.

### H8 · BAJA · Confusores que nadie dice: dos motores distintos, referencias de entrada y reencuadre
- **Evidencia.** (a) Se comparan dos motores (Kling, Seedance) y además Seedance lleva 3 imágenes de referencia: «misma foto y misma orden» es cierto, pero las diferencias no se pueden atribuir a «sostener la cara» (la pieza no lo afirma; el contrato pidió evitarlo). (b) La subida de Seedance coincide con el reencuadre: la pantalla dice «reencuadra» (bien). (c) **No pude verificar** si las 3 referencias de entrada de Seedance están entre las 8 oficiales contra las que se puntúa: de ser así, el 0,80 estaría medido contra fotos que el motor recibió, lo que favorece a Seedance. Es el pendiente del 10-oct (G5, «afecta a todos los motores por igual»), pero acá **solo un clip tiene referencias**, y los parámetros del job no están en el repo.
- **Arreglo (sin re-render):** una frase al pie o al README: «Seedance recibió 3 imágenes de referencia; Kling, ninguna.» (la primera mitad está en la etiqueta «+ referencias», la segunda no). Resolver (c) leyendo los parámetros del job `dd2d7c91` en Higgsfield (`job_display`, 0 cr).

### H9 · BAJA · La regla 15 se cumple por la exención, no «sin aire»
- **Evidencia.** README: «quieto fuera de lectura 0,000 s (DOM)» / «0,083 s (píxeles)». Mi barrido: sin ninguna exención, los clips no tienen ni un tramo quieto de 0,13 s (umbral 0,35 de diferencia media), pero la placa tiene dos tramos estáticos de 5,7 y 2,4 s. Se cumple porque cada texto cuenta como «en lectura» durante 8,29 s (H2), y el «hueco máximo entre eventos de 1,708 s» cuenta como evento el cambio de color de un borde de 10 px. Ambos son defendibles, pero el README debe decirlo con su exención (el editor ya lo anota como «sin exención 1,708 s»). La mitad de audio de la regla (hueco ≥ 0,3 s ≤ 1 por 10 s) no se mide sin voz: la cola del CTA (1,10 s) es el único hueco previsto, dentro del cupo de 2 en 20 s.
- **Arreglo:** README; y que el rediseño de H2 haga visibles los eventos.

### H10 · BAJA · Ambo: pista visual dentro del canon; sin acción
- **Evidencia.** Lucía lleva un conjunto naranja tipo ambo, con cuello en V, bolsillo de pecho y pantalón cargo, en ambos clips. `LUCIA.md` §0 lo permite expresamente (Sergio Urcullo, 3-oct: «que no se identifique como ello pero que tenga la ropa»: vestuario, nunca se presenta como profesional) y prohíbe decirlo o darlo a entender con texto. La pieza lleva «personaje IA de Onia» desde el cuadro 0, no dice ni insinúa rubro, no tiene paciente, consultorio ni consejo, y el fondo es el depto de Equipetrol (torre y ventanal), no una clínica. El caso en que `SKILL.md` pide ir sin ambo es la pauta (anuncio), no esta pieza orgánica.
- **Arreglo:** ninguno. Si la madre quiere cero pista, no hay otra toma pagada con otra ropa; sería generar (con costo y su OK).

### H11 · BAJA · Rastro, entrega y README
- `out/` y `renders/` no van a git y el render no es reproducible bit a bit: el SHA del README (`969ac27d…282e`, verificado) es el único ancla. Al aprobar, copiar el master a `videos/lucia-entrega/` como g1-g5 (hoy no hay `p9`).
- Al mezclar la voz y tras el re-render el SHA cambia: repetir ArcFace master↔fuente, PSNR y la parte de audio del QA.
- README: duda 1 («revisión independiente») queda resuelta con este archivo; las dudas 3 y 4 las responde H2 y H1; la observación «mitad inferior vacía» (H2) se corrige; «Eventos 14 / hueco 1,708 s» y «quieto fuera de lectura» llevan su exención (H9).
- Quien vuelva a correr los gates: `qa/arcface-final.txt` mide el master contra la fuente **escalada** (máx. 0,017). Contra la fuente nativa de 720p, mi corrida da hasta **0,020** (m1, t = 2 s: 0,742 contra 0,762), en el límite de la regla ≤ 0,02 y sin consecuencias (ambos dentro de ±0,03); conviene dejar escrito con cuál de las dos fuentes se compara.

---

## Qué se arregla sin re-render y cuál pide re-render

| Cambio | Hallazgo | Re-render |
|---|---|---|
| Texto del límite de cara en pantalla y etiqueta «del clip original» | H1 | **Sí** (obligatorio) |
| Pie con el límite completo, el letrero, las referencias | H1, H5, H8 | No |
| Placa: recortar y escalonar | H2 | **Sí** |
| Titular «¿La cara o la escena?» | H3 | **Sí** |
| Guion de voz (cortes, decimales, longitudes) y tramos | H4 | No (la voz no existe); el cronograma sí se retemporiza después |
| Letrero: franja oscura o difuminada | H5 | Sí (opcional; la frase del pie no lo pide) |
| Enteros en el brillo, escala (0 a 255), escala de las barras | H6, H7 | Sí (conviene sumarlo al mismo render) |
| README (exención, mitad inferior, estado) | H9, H11 | No |

Todo el re-render es un solo ciclo de `build.mjs` + gates + render (0 cr, ~2,5 min de render). Re-medir ventanas (`ventanas.mjs`), zona segura y `face-gate.sh` master↔fuente.

---

## Juicio sobre cada duda abierta del editor

| # | Duda / decisión del editor | Juicio |
|---:|---|---|
| 1 | Revisión independiente y verificador | Este archivo cumple lo primero. El verificador (Haiku) lo pone la madre. Ningún resultado de `qa/` ni este archivo es permiso de publicar. |
| 2 | Voz inexistente; cronograma estimado a 17 car/s | Razonable como método, **insuficiente** como garantía: ignora cortes (L3 sobre Seedance) y la lectura de decimales (H4). La estimación es de la madre, no medida: derivar de las pistas reales. |
| 3 | Legibilidad real de la placa (63 palabras) | **No se lee de golpe**: ~21-24 s pedidos en 8,29 s; lo nuevo y crítico (los límites) es lo que no cabe (H2). Decisión: recortar y escalonar, no dejarla. |
| 4 | Texto «139 → 347 px» / «bajo 200 px la cara…»: la madre confirma o reformula | **Reformular** (H1). Las dos observaciones del editor son correctas: son px del clip y Kling también está bajo 200 px. Además: Kling está bajo 200 px en 7 de 7 puntos y Seedance en 2 de 7. Texto exacto en H1. |
| 5 | Contraste: 26/26 AA del gate, sin medición propia | Mi cálculo: blanco sobre `#11191b` ≈ 17,8:1; las pastillas son opacas sobre el video, así que el contraste no depende del fondo. Sin problema. A 390 px de ancho los textos de 40-44 px quedan en ~14-16 px, legibles; el rótulo y los nombres de herramienta, 14 px, justos pero legibles. |
| 6 | «Una toma cada una, prueba no regla»: así lo dicen pantalla y pie | Verdadero y en pantalla, pero tarde (H3). La pieza no afirma otra cosa en ningún sitio: cero «el mejor», cero «recomiendo», cero ranking escrito. El editor no añadió ninguna afirmación general: correcto. |
| 7 | Avisos `nested_structure_needs_subcomposition` (3) | Sin consecuencias; iguales a G5. No lo rehice (no puedo instalar `hyperframes`). |
| 8 | 404 «non-blocking» en el render | Probable favicon; todos los recursos del HTML existen y no hay cuadros rotos. Sin acción. |
| 9 | Render por captura de pantalla (sin GPU); PSNR 37-39 dB | Verificado: m1 f60 = 38,87 dB, m4 f60 = 37,53 dB, idénticos a los del editor. Sin pérdida visible. |
| Obs. 2 | «156 → 155,1»: ¿debería ser 156,0? | No resuelve nada: el problema es el doble redondeo (H6); poner enteros. |
| Obs. 3 | px del clip contra el lienzo | Confirmada y ampliada en H1. |
| Obs. 4 | Letrero inventado | H5: visible ~4,5 s; ponerlo en el pie y tapar la esquina. |
| Obs. 5 | Ropa tipo uniforme sanitario | H10: dentro del canon, sin cambios. |
| Decisión | «Texto del límite se mantiene como lo dejó Codex» | No se sostiene (H1). La sesión Lucía no tocó el texto por respeto a la madre; ahora hay evidencia para cambiarlo. |
| Decisión | CTA con 2,4 s aunque su conteo ordinario da 2,05 | Correcto: 58 cuadros plenos = 2,417 s (ver abajo). Margen de 0,017 s (menos de medio cuadro): no se puede recortar ni un cuadro. |
| Decisión | Acentos de riel cuentan como eventos | Defendible, pero son parpadeos de un borde de 10 px (H2, H9). |

---

## Lo que verifiqué y está bien

- **Master.** SHA-256 `969ac27d…282e` = README y `qa/sha-master.txt`, completo. H.264 High yuv420p 1080x1920 24 fps, 480 cuadros, 20,000 s. AAC LC 48 kHz estéreo, `volumedetect` −91,0 dB (mean y max). `index.html` md5 `0cb8fb6c71c5a6453dc52c3aabb7eb71` = README. SHA de `assets/m1.mp4` y `assets/m4-full.mp4` = los de las fuentes en `hermes-content` (los dos clips de 145 cuadros y 6,042 s).
- **Cifras, una por una (nada que no esté en las dos fuentes).** 0,79 → 0,72 (0,791 y 0,721) · 0,71 → 0,80 (0,707 y 0,801) · 7,5 y 6 créditos (`cr` de PROCEDENCIA) · brillo −1,0 (156,041 → 155,077) y −34 (145,5 → 111,8, Δ −33,7), medidos de nuevo con `signalstats` · «139 → 347 px» (nota de PROCEDENCIA, reproducido: 139 y 347) · «ocho fotos oficiales» (8 refs del gate) · «de 0 a 255» (escala de luma) · «200 px» y «±0,03» (gate del repo y contrato). «De 0 a 1» simplifica el coseno de ArcFace (puede ser negativo; las caras negativas dan ≤ 0,224); es la misma simplificación de G4/G5 ya aprobados.
- **D-N1.** Nombres de herramienta de la lista válida (Kling 3.0 std, Seedance 2.0 Mini + referencias, Higgsfield, ArcFace); la frase exacta «Nombro lo que uso; no es una recomendación pagada.» está en el pie; sin logos ni capturas de terceros (el teléfono tiene tres lentes y no muestra marca; el letrero es lo único que parece una marca, H5). Sin «el mejor», «recomend[ar]» (solo la frase de D-N1), «gana», «pierde» ni «ranking»; sin «Sergio», rubro, paciente, clínica, demo ni URL.
- **Marca, con el segundo.** Rótulo «Lucía Antelo · personaje IA de Onia» a 40 px en el cuadro 0 y hasta el empuje de 5,75 s. Título en el cuadro 0, sin pastilla (el arreglo del estado inicial funciona). Primera cifra: la pastilla entra a 1,5 s (cuadros 35-36 sin pastilla, 37 a media opacidad, 38 completa): 1,54 s < 3 s. CTA exacto «Seguime: cada semana, una prueba.»: cuadro 421 a media opacidad y 422-479 a plena = 58 cuadros = **2,417 s** (≥ 2,4 por 0,017 s). Pie abre literal «Personaje hecho con IA» (`startsWith` verdadero). Ninguna profesión dicha; ningún producto de Onia; ni cara ni voz de Sergio Urcullo.
- **Zona segura (píxeles).** Placa: contenido en y 300-1208 (hasta el CTA) y 300-1451 (con él), x 80-977; ni una fila sobre y 280 ni bajo 1490. Pastillas (por color de caja): y 300-367, 760-857, 1030-1099, 1090-1205, 1270-1339. El margen de 80+ px a la derecha cumple. Cara-pastilla: SCRFD del editor da ≥ 58 px; en mis cuadros se ve que las pastillas caen sobre camisa, manos y mesa.
- **Cuadros y costuras.** 0 cuadros vacíos (luma media mínima 33 en la placa); los únicos saltos de píxeles son los dos empujes (cuadros 138-143 y 277-282), con la costura que avanza 1072 → 972 → 539 → 105 → 5 px sin separación ni rendija (nada de columnas de fondo entre salida y entrada); sin parpadeos fuera de ellos. En los clips no hay quietos de más de 0,13 s.
- **Cuadro 0 y el arreglo de `timeline.js`.** El cuadro 0 muestra solo rótulo y título sobre m1; no se ve la pastilla ni m4 ni la placa. El CTA no aparece hasta 17,5 s; m4 y la placa solo entran por sus empujes. El `fromTo` en t = 0 no dejó ningún cambio visible fuera de lo previsto. El `index.html` (md5 igual al declarado) y `scripts/timeline.js` coinciden.
- **Control de cara master↔fuente.** `face-gate.sh` en 8 cuadros del master contra los mismos instantes de la fuente nativa: m1 0,790/0,791 · 0,742/0,762 · 0,764/0,761 · 0,674/0,680; m4 0,760/0,762 · 0,728/0,726 · 0,790/0,777 · 0,812/0,818. Máxima diferencia **0,020** (ver H11); el editor midió 0,017 contra la fuente escalada. En ningún caso el render deforma la cara.
- **Lo que mostré en H1:** los 14 puntajes (7 por clip) reproducen PROCEDENCIA l.97 y dan el tamaño de cara en cada uno.
- **PSNR.** m1 cuadro 60 = 38,87 dB, m4 cuadro 60 = 37,53 dB (ROI y 400-700): idéntico a `qa/psnr-clips.txt`.
- **Empujes y reencuadre.** Rígidos; m1 y su rótulo/título salen juntos; el reencuadre de m4 es visible (SCRFD: cara de 222 a 522 px de ancho en el lienzo, de 6,0 a 11,5 s).
- **Aviso de tipografía.** Los guiones «−1,0» y «−34» en la fuente mono se leen como signo menos a 390 px; no confunden.

## Lo que no pude verificar

- Cómo se ve en un teléfono con la interfaz de Instagram (solo simulé 390 px de ancho), y si el letrero de la esquina superior queda bajo la barra superior.
- **Voz:** no existe. H4 es una estimación con la tasa de G1 v2 (17 car/s) y un cruce por sílabas; la lectura hablada de «0,79» es lo habitual en TTS en español pero no la medí.
- Si las 3 referencias de entrada de Seedance están entre las 8 oficiales con que se puntúa (los parámetros del job `dd2d7c91` no están en el repo).
- `hyperframes check`, `medir-dom.mjs`, `ventanas.mjs` y `build.mjs`: necesitan `npx -y` (descarga) o escriben en `qa/`; confío en las salidas de `qa/` (las leí) y las contrasté con medición propia donde fue posible (zona segura, ventanas por conteo de palabras, costuras, CTA, quietud).
- Que no se haya tocado nada fuera de la carpeta (sin git no lo puedo comprobar).
