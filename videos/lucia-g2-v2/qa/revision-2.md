# Revisión 2 · Lucía G2 v2.2 (hallazgo de las fotos recibidas, 11-oct-2026) — revisor independiente

**Veredicto: APROBADO CON CAMBIOS.** 7 hallazgos: **0 ALTA · 3 MEDIA · 4 BAJA.**

Lo que el video dice en pantalla es verdadero y la advertencia del pie es fiel a la medición: cada cifra (2 y 4 de las 8, 5 imágenes, 0,026, 0,012, 89 a 168 px) coincide con `medicion-sin-refs-entrada-20261011.txt`; el master es el declarado (SHA-256 completo igual), la v2.2 difiere de la v2.1 **solo en la etiqueta** (medido), el pie abre con «Personaje hecho con IA», trae «Nombro lo que uso; no es una recomendación pagada.», mide 2.011 de 2.200 caracteres y `lucia-prohibidas.mjs` da 0. El control de cara se repitió en 12 cuadros nuevos: máx. 0,013.
Lo que impide darlo por cerrado no es lo que dice sino **lo que la medición no puede decir**: (H1) los cuatro clips «sin fotos» descienden de las mismas fotos a través de K1, así que el «exceso ≈ 0,026 / 0,012, dentro del ruido» se mide contra una base que no es independiente y puede estar subestimado; (H2) la divulgación en pantalla llega a los 19,7 s y el 0,82 aparece dos veces antes sin ella; (H3) la advertencia del pie está a 1.065 caracteres de profundidad y tiene una trampa de lectura.
**Sin re-render:** H1, H3, H5, H6 (texto) y H7. **Piden re-render (0 cr, ≈ 4 min):** H2 (opción A) y H4, ambos opcionales: ninguno hace falsa a la pieza.

**Cómo revisé.** SHA-256 completo + `ffprobe` + `volumedetect` del master; 56 cuadros a 2 por segundo (2 hojas de contacto con `montage`), resolución completa en 0 · 2,0 · 19,65 · 20,0 · 22,0 · 24,5 · 27,7 s, 24 cuadros consecutivos de 19,33 a 19,96 s (entrada de la etiqueta) y el par 22,0/15,5 s reducido a 390 px de ancho. **Comparé el final contra el master anterior (v2.1, SHA `1b12e832…`, que estaba en el scratchpad de la sesión del editor, intacto)** cuadro a cuadro con PSNR y ubiqué la zona de diferencia con ImageMagick. Barrí los 667 cuadros en gris (270x480) con **mi propia medida** (píxeles que cambian, sin `aire.py`). Rehice el control de ArcFace con otros 12 cuadros (`scripts/face_identity_qa.py` importado por ruta, venv y modelos ya instalados, sin red) y **calculé de nuevo el parecido de los seis clips contra solo las 4 fotos que ninguno recibió** (H1). Releí PROCEDENCIA l.95-97, `ORIGEN.md` (mapa de ids a R1-R8), la medición, `plan.json`/`plan.resuelto.json`, `build.mjs` y `validar-mutaciones.mjs`. Corrí `lucia-prohibidas.mjs`. **No usé git, no rendericé, no gasté créditos, no generé voz, no publiqué, no instalé nada.** Lo único que escribí en el repo es este archivo (los intermedios están en mi scratchpad).

---

## Hallazgos

### H1 · MEDIA · «Los otros cuatro, ninguna» y «dentro del ruido» se miden contra una base que no es independiente: K1 se hizo con R1, R3, R6 y R7
- **Dónde:** `pie.txt` (advertencia: «los otros cuatro, ninguna», «exceso atribuible ≈ 0,026 / ≈ 0,012, dentro del ruido»), `README.md` («Hallazgo posterior», lectura y decisión 11), cabecera de la medición («K1 y abe2e6bd NO están entre las 8: no se excluyen»).
- **Evidencia.**
  1. **Linaje de K1.** `PROCEDENCIA.jsonl` l.96 (`foto_K1_prompt_literal.referencias_en_orden`): K1 (`4afffb96`, Seedream 4.5) se generó con `abe2e6bd` (selfie), `a7cfb766` (=R1), `d7d6d36a` (=R3), `df491c87` (=R6), `8ce2f65c` (=R7) y el maniquí; el mapa de ids sale de `videos/lucia-g4-v2/assets-fijos/ORIGEN.md` y de la cabecera de la medición. **Kling O3 recibió exactamente esas cinco** (menos el maniquí). Los cuatro clips «limpios» (Kling 3.0 std, Kling 3.0 pro, Seedance 2.0 Mini, Cinematic Studio 3.0) y Seedance + referencias parten de K1. Por tanto **los seis clips descienden de R1, R3, R6 y R7**; la diferencia entre los dos grupos es «directo» contra «vía K1», no «con fotos» contra «sin fotos».
  2. **Se ve en los números.** Mi ArcFace de K1 (237 px): coseno medio a R1,R3,R6,R7 = **0,720** y a R2,R4,R5,R8 = **0,616** (hueco +0,104); entre las 8 fotos mismas, ese hueco es ≈ +0,02 (R2 −0,01 · R4 −0,01 · R5 +0,07 · R8 +0,05 al compararlas con R1,R3,R6,R7 y con las otras tres). La medición de la sesión muestra la misma huella en los **controles**: «gap» +0,073 de Kling 3.0 std contra el subconjunto de O3 (O3: +0,092), y su exceso de O3 sobre los controles es solo +0,019 en gap. O3 queda cerca de los controles porque **los controles ya traen las mismas cuatro fotos por K1**.
  3. **Consecuencia.** El exceso se calcula como «caída del clip menos caída de los controles». Si los controles ya llevan parte de la fuga, el resultado **subestima** la diferencia contra un clip realmente independiente. Con la relación que sale de la propia medición (B−A ≈ −0,75 × gap, igual en O3 y en los controles) y un hueco de base de ≈ +0,02 en vez de +0,073, el exceso de O3 sería ≈ 0,05, **fuera de ±0,03**. Es un indicio mío, no una medición: no hay control limpio en el repo. Además el pie calla la caída cruda (−0,042 en Seedance + referencias y −0,068 en O3, ambas mayores que 0,03) y presenta solo la neta.
  4. «Dentro del ruido de ±0,03» compara un **desvío sistemático** (negativo en 7 de 7 puntos de cada clip) con un ruido aleatorio entre cuadros: aunque sea del mismo tamaño, no se promedia a cero. Y 0,026 está «al borde» (el propio README lo admite, duda 2).
- **Lo que sí aguanta (y es más simple de decir).** Contra **solo las 4 fotos que ningún clip ni K1 recibió** (R2, R4, R5, R8), calculado por mí con el mismo método (A reproduce PROCEDENCIA en los puntos que repetí: 0,721 · 0,644 · 0,824 · 0,801 · 0,739 al segundo 5,9):

  | Parecido contra R2,R4,R5,R8 | 0 s | 1 | 2 | 3 | 4 | 5 | **5,9 s** |
  |---|---:|---:|---:|---:|---:|---:|---:|
  | **Kling O3** | 0,753 | 0,728 | 0,720 | 0,741 | 0,732 | 0,733 | **0,749** |
  | Kling 3.0 std | 0,720 | 0,730 | 0,700 | 0,680 | 0,717 | 0,663 | **0,669** |
  | Seedance 2.0 Mini (sin refs) | 0,644 | 0,613 | 0,616 | 0,589 | 0,579 | 0,605 | **0,596** |
  | Seedance 2.0 Mini + refs | 0,643 | 0,689 | 0,688 | 0,640 | 0,705 | 0,683 | 0,728 |
  | Kling 3.0 pro | 0,735 | 0,728 | 0,702 | 0,692 | 0,681 | 0,681 | 0,678 |

  Es un centroide de 4 fotos difíciles (R4 de perfil, R8…), por eso todos puntúan más bajo que contra las 8: no se compara con el piso de 0,70, se compara entre clips. **El orden de la placa (O3 > Kling 3.0 std > Seedance 2.0 Mini) no cambia** y O3 queda ≥ 0,72 en los 7 puntos. La lección «con referencias, la cara se sostiene» sobrevive a la prueba más estricta que permiten los datos.
- **Arreglo (sin re-render, solo texto del pie y del README).** (a) Cambiar «los otros cuatro, ninguna» por «los otros cuatro solo recibieron la foto de arranque, que a su vez se hizo con 4 de esas 8»; (b) quitar «dentro del ruido» o cambiarlo por «del mismo orden que el ruido, pero siempre en el mismo sentido»; (c) sustituir el par «≈ 0,026 / ≈ 0,012» por los números de la tabla de arriba (segundo 5,9) o decir los dos: neto y crudo. **Hay que agregar esas cifras al archivo de medición** (la sesión Lucía corre `parecido_sin_refs.py` con el subconjunto R2,R4,R5,R8 para los seis clips, 0 cr) y que `build.mjs` las lea de ahí, como ya hace con `fuga_refs`. Texto propuesto en H3. Lo único que daría una cifra de fuga limpia es **un clip cuya foto de arranque no se haya hecho con R1,R3,R6,R7**; cuesta créditos (imagen + 6 s de video) y no lo ejecuté ni lo pido: lo decide la madre.

### H2 · MEDIA · La divulgación en pantalla llega a los 19,7 s; el 0,82 de Kling O3 aparece dos veces antes sin ella y el pie queda bajo el pliegue
- **Dónde:** pastilla del gancho «parecido final: 0,64 a 0,82» (0,96-3,63 s); escena de Kling O3 (13,79-18,25 s: «parecido 0 s: 0,80» 14,25-16,50 s y «5,9 s: 0,82» 14,83-16,50 s, con la tarjeta «solo referencias»); etiqueta de la lección (entra a 19,65 s, legible desde 19,75).
- **Evidencia.** Miré los 24 cuadros de 19,33 a 19,96 s: **la etiqueta y el «0,82» de la barra entran juntos** (cuadro 472, 19,667 s, ambos a medio fundido); en la lección no hay ningún cuadro con el 0,82 sin su etiqueta, y no hay ningún número de Seedance + referencias en pantalla (el «0,80» de la pantalla es el de arranque de O3). En cambio, **el máximo de la pastilla del gancho (0,824) es el de O3** y se muestra 2,7 s, más 1,7 s en la escena del clip, sin nada que lo califique; la etiqueta llega 5 s después de que termina el clip y la **voz dice «sostiene» a los 14,04 s y «Con referencias, la cara se sostiene» a los 18,25 s**, antes. Y el pie, que es el único lugar donde se dice «dos de los seis» (incluye a Seedance + referencias), pone esa frase en el **carácter 1.065 de 2.011**: Instagram corta un pie de ese largo tras ≈ 125 caracteres («… más»); lo que se ve sin tocar es «Misma orden en seis clips de Higgsfield (créditos de Higgsfield, precios d…». (El corte exacto no lo pude ver en un teléfono.)
- **Juicio.** No es deshonesto: nada falso se muestra, el efecto neto sobre el número es ≈ 0,01 (0,824 → ≈ 0,812, o sea «0,81») y Seedance + referencias no sale. Pero la divulgación depende de que el espectador llegue al 19,7 s o abra el pie. Para quien deja el video a los 8 s (lo normal), los dos números que ve del clip con fotos recibidas no llevan nada.
- **Arreglo.** *Sin re-render:* una línea de aviso **dentro de los primeros 125 caracteres del pie** (texto en H3). *Con re-render (0 cr), opción A:* poner la misma etiqueta sobre la escena de O3 en lugar de la pastilla «parecido 0 s: 0,80» (el dato de arranque no es necesario para el argumento), con ventana ≥ 3,1 s (por ejemplo 14,4-18,0 s) y repasar `ventanas.mjs` y `medir-dom.mjs`; la de la lección se queda. *Opción B:* dejarlo como está y aceptar que la divulgación en pantalla es la de la lección. Mi recomendación: la línea del pie sí; la opción A solo si se va a hacer otro render por H4.

### H3 · MEDIA · La advertencia del pie es verdadera pero difícil de leer: trampa de los dos puntos, «referencia» con tres sentidos, «3 imágenes» sin la foto de arranque y jerga
- **Dónde:** `pie.txt`, de «Dos de los seis clips recibieron…» a «…poco confiable.» (520 caracteres, tres frases; el pie entero son 376 palabras).
- **Evidencia.**
  - **Los dos puntos.** «…recibieron fotos de referencia como entrada; **los otros cuatro, ninguna: Seedance 2.0 Mini + referencias (3 imágenes, 2 de ellas entre las 8…) y Kling O3 (5 imágenes, 4…)**». Después de «ninguna:» se lee que la lista nombra a los cuatro que no recibieron nada; nombra a los dos que sí. (La mutación 4 de `validar-mutaciones.mjs` fija esa construcción: `cambiar('; los otros cuatro, ninguna:', ':')`.)
  - **«Referencia» significa tres cosas:** las 8 fotos con que se mide (placa de la regla: «5 de las 8 fotos de referencia»), las entradas del clip («solo referencias») y, en el pie, «fotos de referencia como entrada». El editor lo evitó en la etiqueta («de puntaje») pero la placa de la regla sigue llamándolas «de referencia» y el pie las llama de tres maneras («fotos de referencia», «8 fotos oficiales suyas», «las 8 fotos con que se mide»).
  - **«3 imágenes» no es el total** de Seedance + referencias: recibió la foto de arranque K1 **más** 3 referencias (4 imágenes; PROCEDENCIA l.96: `start_image_mas_3_refs`); para Kling O3 «5 imágenes» sí es el total. El criterio de conteo cambia de una a otra.
  - **Jerga:** «exceso atribuible», «descontado el efecto de usar menos fotos», «dentro del ruido de ±0,03» no se entienden sin haber leído la medición.
- **Arreglo (sin re-render; hay que cambiar las cadenas fijas de `build.mjs` y las mutaciones).** Propuesta, ya probada contra `lucia-prohibidas.mjs` (0 coincidencias) y de **2.063 caracteres**:
  - Apertura: «Personaje hecho con IA: Lucía Antelo, por @oniahq. **Aviso: 2 de los 6 clips recibieron fotos con que se mide el parecido (detalle abajo).** Misma orden en seis clips de Higgsfield…» (el aviso queda en el carácter 52-135, dentro del pliegue).
  - Cuerpo, en lugar de las tres frases actuales: «**Sobre la medición:** Seedance 2.0 Mini + referencias recibió 3 fotos de referencia (2 de las 8 con que se mide) y Kling O3 recibió 5 (4 de las 8); los otros cuatro clips solo recibieron la foto de arranque, hecha a su vez con 4 de esas 8 (R1, R3, R6 y R7), así que ningún clip es independiente de ellas. Contra las 4 que nadie recibió (R2, R4, R5 y R8), al segundo 5,9: Kling O3 0,75, Kling 3.0 std 0,67, Seedance 2.0 Mini 0,60. En Kling O3 la cara mide solo 89 a 168 px: poco confiable.» Las cifras 0,75 · 0,67 · 0,60 son las de H1 (mías: hay que agregarlas a la medición antes de que el build las acepte). Los identificadores R1…R8 son opcionales: se pueden quitar y dejar «4 de esas 8».

### H4 · BAJA · La etiqueta de pantalla usa un término que nadie ha visto antes («fotos de puntaje»), mide ≈ 12 px a 390 px de ancho y pesa lo mismo que una nota de relleno
- **Dónde:** etiqueta «recibió 4 de las 8 fotos de puntaje» (x = 272-865, y = 808-865, 34 px; 19,65-24,75 s).
- **Evidencia.** Las 8 fotos se llamaron «8 fotos suyas» (3,75 s) y «5 de las 8 fotos de referencia» (4,8-8,3 s); «puntaje» aparece por primera vez a los 19,7 s. «Recibió» tampoco dice qué (entrada del generador). A 390 px de ancho la letra queda en ≈ 12 px, con el mismo peso visual que «Final = segundo 5,9, que no se ve entero.», que es una nota de método; es el único texto de la placa que sostiene la divulgación. Rodea la línea de «mi piso 0,70» con un fondo opaco: la línea se corta 57 px entre las barras de Seedance y Kling O3 (aceptable, medido: no toca el anillo ni el «0,64»); durante el fundido de entrada (19,67-19,75 s) la línea se ve a través.
- **Arreglo (con re-render, opcional).** «recibió 4 de las 8 fotos con que se mide» (10 palabras, ≤ 12; ventana 3,85 s, cabe: la etiqueta termina cerca de x = 960 < 1000) o «usó 4 de las 8 fotos suyas», que repite la palabra de la tarjeta c3. Subir a 38-40 px solo si no choca con el nombre «Kling O3» (x = 100-242).

### H5 · BAJA · El README y la lectura de la medición sobregeneralizan «casi todo es efecto del subconjunto»; y tres detalles menores de números
- **Dónde:** `README.md` l.45 («casi todo es efecto del subconjunto de fotos»; también en el encargo de esta revisión), cabecera de la medición («en los 25 puntos»), `README.md` l.33 («1.435 caracteres»).
- **Evidencia.** La frase es cierta para Kling O3 (los controles caen −0,055 de −0,068: 81 %) y **falsa para Seedance + referencias**: los controles caen −0,017 y el clip −0,042, o sea **40 % subconjunto y 60 % exceso** (de ahí el 0,026). La cifra del pie no lo dice mal (solo da el exceso), pero quien lea el README se lleva «casi todo» para los dos. Detalles: la medición dice que la columna A reproduce PROCEDENCIA «en los 25 puntos» y la tabla tiene **34** (7+7+7+6+7); la fila H8 del README dice «1.435 caracteres» y el pie ahora tiene 2.011; el pie da «89 a 168 px» para O3 (medición, 7 puntos) y «89 a 179 px» para las caras de los tres clips (`caras-por-clip.json`, cada 2 cuadros, incluye lo que no se ve), cuando en lo que sí se ve de cada clip el máximo es 177 y en O3 el SCRFD llega a 170: inofensivo, pero no es la misma cifra dos veces.
- **Arreglo (sin re-render).** README: «casi todo, en Kling O3 (81 %); en Seedance + referencias el 40 %».

### H6 · BAJA · La voz no contradice la medición, pero dice «sostiene» como regla antes de que aparezca la etiqueta, y la prueba de «con referencias» descansa solo en los dos clips con fotos recibidas
- **Dónde:** `guion-voz.txt` L9 «Kling O tres, solo referencias: sostiene.» (14,04 s) y L11 «Con referencias, la cara se sostiene.» (18,25 s); tarjeta c9.
- **Evidencia.** (i) **Los dos únicos clips «con referencias» son justamente los dos que recibieron fotos de las 8**; no hay un clip con referencias que sea independiente del puntaje. Con la tabla de H1 la afirmación se sostiene contra las fotos que no recibieron, así que no es falsa, pero «con referencias, la cara se sostiene» como lección general sale de n = 1 limpio (O3) más Seedance + referencias, que tampoco es limpio. (ii) La voz lo dice sin matiz a los 14,04 s y a los 18,25 s; la etiqueta llega a los 19,65 s. La voz **no dice la advertencia** y, con el cupo de hoy, tampoco cabe: 402 caracteres contra **381**; faltan 21 (415 con los saltos de línea; con retomas ×1,3 ≈ 520).
- **Cupo y tramos (verificado):** las 14 líneas (402 caracteres, mismo texto que `plan.resuelto.json → tramos`) a **17 c/s no pisan a la siguiente: huecos de 0,21 a 0,29 s** (L1 0,29 · L2 0,28 · L3 0,24 · L4 0,22 · L5 0,25 · L6 0,25 · L7 0,24 · L8 0,22 · L9 0,21 · L10 0,23 · L11 0,28 · L12 0,24 · L13 0,23 · cola de L14 0,85 s); a 16 c/s tampoco (la más justa, L9: +0,06 s); a 18 c/s dejan 0,26-0,40 s. **La pieza no cabe en el cupo de voz de hoy** (402 > 381): la voz definitiva espera al 13-oct 01:17 UTC o se recorta.
- **Arreglo.** Sin tocar el cupo ni los tramos: mantener la voz tal cual y dejar que la etiqueta y el pie la califiquen (no contradice la medición). Si se quiere una sola salvedad hablada, el lugar es L9 (el momento en que se ve el clip de O3) y debe conservar su largo (41 caracteres, ventana 40-44) para no mover las costuras: cualquier cambio de largo cambia el tramo, las tarjetas y exige otro render. En el README, decir que «con referencias, la cara se sostiene» **se confirmó contra las 4 fotos que ningún clip recibió** (H1) y no solo contra las 8.

### H7 · BAJA · La prueba negativa del build comprueba presencia de cadenas, no verdad; y dos «ninguna» dependen de evidencia que no se puede reproducir aquí
- **Dónde:** `scripts/validar-mutaciones.mjs` (32 mutaciones), `build.mjs` l.319-328.
- **Evidencia.** Las 11 mutaciones del pie borran o cambian una frase fija que `build.mjs` busca con `includes`: prueban que el editor no puede quitar la advertencia, no que sea cierta. Lo que **no** se valida: que «los otros cuatro, ninguna» sea verdad (H1: depende de K1), que el pie describa el exceso en el sentido correcto (la medición trae −0,026 y −0,012; el pie escribe «≈ 0,026» y «≈ 0,012» sin decir hacia dónde, y el mensaje de rechazo de la mutación «exceso de Kling O3 0,02» habla de «−0.012»: el build compara en valor absoluto), ni que la etiqueta de pantalla diga lo mismo que el pie. «Kling 3.0 pro: foto sola» tiene respaldo en `higgsfield-mapa.md` l.21 y en el relevamiento (`start_image`, K1), pero la comprobación con `job_display` que menciona el encargo no la pude repetir (sin MCP, sin créditos).
- **Arreglo.** Una mutación que invierta el sentido de la advertencia (p. ej. «los otros cuatro, ninguna» → «los seis recibieron fotos») y que el build lea del archivo de medición las cifras nuevas del pie (H1) en lugar de fijarlas a mano.

---

## Respuestas a los cinco puntos del encargo

| # | Pregunta | Respuesta |
|---|---|---|
| 1 | ¿La advertencia del pie y la etiqueta son verdaderas y suficientes? | **Verdaderas, sí** (tabla abajo). **Suficientes, no del todo:** el pie esconde la advertencia bajo el pliegue y tiene la trampa de «ninguna:» (H3); no dice la caída cruda ni que K1 desciende de las mismas fotos (H1). La etiqueta es correcta y legible (H4). El pie abre con «Personaje hecho con IA», contiene «Nombro lo que uso; no es una recomendación pagada.», mide 2.011 caracteres (tope 2.200) y `lucia-prohibidas.mjs` sobre `pie.txt` y `guion-voz.txt` da **0**. |
| 2 | Seedance + referencias no sale en pantalla: ¿es honesto mostrar 0,80 / «0,64 a 0,82» sin etiqueta? | **Honesto en el contenido** (ningún número de Seedance + referencias en pantalla; el efecto neto del 0,82 es ≈ 0,01), **tarde en la forma:** el 0,82 aparece sin etiqueta 0,96-3,63 s (rango del gancho) y 14,83-16,50 s (clip de O3); la etiqueta llega a los 19,7 s. Propuesta: línea de aviso dentro de los primeros 125 caracteres del pie (sin re-render) y, si hay otro render, la etiqueta sobre el clip de O3 (H2). |
| 3 | Cuadros | Solo difiere la lección: cuadros 0-469 **idénticos** al master anterior (99 dB), 472-597 difieren **solo** en la zona de la etiqueta (x 272-865, y 808-865; PSNR 31,5 dB de media), 598-666 a 51-53 dB (render no reproducible bit a bit; invisible). Ver «Lo que verifiqué». |
| 4 | Control de cara | Funcionó (venv del scratchpad): **12 cuadros nuevos, máx. final↔fuente 0,013** (tabla abajo; el editor: 0,012 en 15). |
| 5 | Voz | No contradice la medición; dice «sostiene» sin matiz antes de la etiqueta (H6); cabe a 17 c/s en sus 14 tramos (huecos 0,21-0,29 s); **no cabe en el cupo: 402 contra 381** (415 con saltos). |

**Cifras del pie contra la medición:**

| Cifra | Pie / pantalla | Fuente | Estado |
|---|---|---|---|
| Clips con fotos de las 8 | «2 de las 8» (Seedance + ref.) · «4 de las 8» (O3, y en pantalla) | cabecera: R1,R3 · R1,R3,R6,R7 | ok |
| Imágenes de entrada | «3» · «5» | 3 refs + K1 de arranque = **4** · 5 refs | «3» no es el total (H3) |
| Exceso | «≈ 0,026» · «≈ 0,012» | «EXCESO … −0,026 / −0,012» | ok, pero contra controles que descienden de K1 (H1) |
| Cara en O3 | «89 a 168 px» | tabla: 89-168 (7 puntos) | ok (el SCRFD cada 2 cuadros llega a 170) |
| Ruido | «±0,03» | skill / G3 v2 | ok; «dentro del» es discutible (H1) |
| Cuántos clips no reciben nada | «los otros cuatro, ninguna» | PROCEDENCIA l.96-97 + `ORIGEN.md` | cierto solo para entradas directas (H1) |
| Cinco partieron de K1 · O3 sin foto de arranque | pie | PROCEDENCIA | ok |

**Control de cara (ArcFace buffalo_l, 8 referencias oficiales de `lucia-g4-v2/assets/refs-orig/`; cuadros nuevos, distintos de los del editor):**

| Cuadro del final | Final | px | Fuente (mismo cuadro del clip) | px | Dif. |
|---|---:|---:|---:|---:|---:|
| gancho n40 (K1, zoom) | 0,800 | 181 | 0,806 | 237 | 0,006 |
| gancho n80 (K1, zoom) | 0,793 | 186 | 0,806 | 237 | 0,013 |
| Kling 3.0 std n220 (c23) | 0,786 | 178 | 0,799 | 118 | 0,013 |
| Kling 3.0 std n240 (c43) | 0,769 | 180 | 0,778 | 120 | 0,009 |
| Seedance 2.0 Mini n262 (c4) | 0,735 | 182 | 0,725 | 121 | 0,010 |
| Seedance 2.0 Mini n300 (c42) | 0,677 | 244 | 0,683 | 165 | 0,006 |
| Seedance 2.0 Mini n325 (c67) | 0,636 | 262 | 0,627 | 175 | 0,009 |
| Kling O3 n350 (c19) | 0,778 | 148 | 0,778 | 99 | 0,000 |
| Kling O3 n395 (c64) | 0,792 | 186 | 0,794 | 124 | 0,003 |
| Kling O3 n420 (c89) | 0,809 | 203 | 0,822 | 136 | 0,013 |
| cierre n600 (c60) | 0,735 | 179 | 0,742 | 119 | 0,007 |
| cierre n650 (c110) | 0,708 | 173 | 0,710 | 116 | 0,002 |

Máx. 0,013 (límite 0,02). Seedance 2.0 Mini baja de 0,70 en la fuente y en el final desde el cuadro 300; Kling O3 ≥ 0,70 siempre; Kling 3.0 std baja; el cierre (0,708-0,735) queda sobre el piso.

---

## Lo que verifiqué y está bien

- **Master:** SHA-256 completo = `5be39413cd303cb38444ee76b4017c0099dbe207f4aa3a5f80661cef5db2bdbd` (igual al README); H.264 1080x1920, 24 fps, bt709, **667 cuadros leídos = 27,792 s**; AAC 48 kHz estéreo, `volumedetect` −91,0 dB medio y máximo. Preview 360x640 de 667 cuadros (SHA `e2ae6664…` y crudo `52e8f426…` igual a lo declarado); `index.html` md5 `0405f438…` igual al declarado.
- **v2.1 → v2.2:** PSNR cuadro a cuadro (540x960) contra `master-anterior-1b12e832` (SHA verificado `1b12e832…`): 0-469 = 99 dB (idénticos), 472-597 = 31,5 dB, 598-666 = 51-53 dB. La zona de diferencia en 21,0 y 23,5 s es el rectángulo de la etiqueta (x 272-865, y 808-865) y un par de píxeles sueltos; **no cambió ninguna cifra, ni tarjeta, ni barra**. (El README dice 74-99 dB para ≥ 24,9 s; yo medí 51-53 dB a esa escala: invisible y coherente con «el render no es bit a bit reproducible», pero no es lo que dice el README.)
- **Pie:** abre con «Personaje hecho con IA» · «Nombro lo que uso; no es una recomendación pagada.» presente · 2.011 caracteres (2.036 bytes) de 2.200 · 4 hashtags · `lucia-prohibidas.mjs` sobre `pie.txt` y `guion-voz.txt`: «0 coincidencias en 0 archivos», salida 0.
- **Etiqueta y lección:** la etiqueta cae sobre el nombre de Kling O3 sin pisarlo (x 272 contra 242), no toca el anillo de la barra ni el «0,82»/«0,64»; entra con el «0,82» y se queda hasta el empuje de salida (24,75 s): ventana legible 19,75-24,88 s = 5,13 s (pide 3,10); nada se corta; texto más alto de la placa: y = 300 (ningún texto sobre 280).
- **Cuadro 0:** rótulo «Lucía Antelo · personaje IA de Onia» (y = 720) y título «¿Quién pierde la cara?» legibles desde el primer cuadro; CTA exacto «Seguime: cada semana, una prueba.» legible 24,92-27,79 s = **2,88 s** (≥ 2,4).
- **Aire (mi medida, 667 cuadros en gris 270x480, píxeles que cambian):** 0 cuadros planos (desviación de luma mínima 19,7). Tramos quietos > 0,3 s: 3,75-4,08 · 5,17-5,92 · **7,29-8,25 (0,96 s, el mayor)** · 20,21-20,58 · 21,83-22,58 · 22,83-23,75 · 23,96-24,79 s: **todos bajo una tarjeta en lectura** (c3, c4, c9, c10, c11, con holgura +0,08 a +0,22 s). Con un umbral más laxo aparecen 5,96-6,54 y 20,83-21,54 s, también bajo tarjeta.
- **Cifras contra PROCEDENCIA l.97:** 0,79→0,72 · 0,69→0,64 · 0,80→0,82 · 0,64 a 0,82 (mín. 0,644 Seedance 2.0 Mini, máx. 0,824 Kling O3) · Kling 3.0 pro 0,81→0,74 · Seedance + referencias 0,71→0,80 · Cinematic Studio 3.0 0,79→0,77 (0,785→0,771) · créditos 7,5 / 6 / 6 / 9 / 6 / 20. Todas redondean bien.
- **Mapa de ids:** `a7cfb766`=R1, `d7d6d36a`=R3, `df491c87`=R6, `8ce2f65c`=R7 confirmado en `videos/lucia-g4-v2/assets-fijos/ORIGEN.md` y `higgsfield-relevamiento-20261008.json`.
- **Voz a 16 · 17 · 18 c/s:** recomputé desde `plan.resuelto.json` los 14 tramos y `guion-voz.txt` (el texto es idéntico línea a línea): ninguna pisa a la siguiente a 16 ni 17 c/s.
- **Lo que no cambió:** 12 tarjetas, costuras, clips, duración, las cifras de la pantalla.

## Lo que no pude verificar

- **`job_display` de los seis clips** (qué recibió cada uno): no uso el MCP de Higgsfield en esta revisión. Me apoyo en la cabecera de la medición, PROCEDENCIA l.96-97, `ORIGEN.md`, `higgsfield-mapa.md` y el relevamiento. En particular «Kling 3.0 pro: solo la foto de arranque» no tiene respaldo medido en el repo (no entra en la medición).
- **Cómo se ve en el teléfono con la interfaz de Instagram** (la columna de iconos, el pliegue exacto del pie en ≈ 125 caracteres): solo simulé 390 px de ancho.
- **Que K1 no esté sesgada hacia R1,R3,R6,R7 de otra forma** y el **tamaño real del exceso contra un clip independiente** (H1): mi estimación de ≈ 0,05 es un indicio con una relación empírica de dos puntos; hace falta un control limpio.
- **Cualquier tiempo de voz real:** no hay voz; los tramos son los derivados a 17 c/s.
- Mis cifras de la tabla de H1 (parecido contra R2,R4,R5,R8) las calculé con un script propio que importa `face_identity_qa.py` por ruta (mismas clases SCRFD y ArcFace, mismos 7 tiempos que la medición, cuadros con `ffmpeg -ss`); **la columna A reproduce PROCEDENCIA en los 5 clips al segundo 5,9**, pero no usé `parecido_sin_refs.py`: la sesión Lucía debe reproducirlas con su script antes de que entren a la pieza.
- No volví a correr `hyperframes check`, `medir-dom.mjs`, `ventanas.mjs` ni los demás controles del editor (leí sus salidas); no corrí `validar-mutaciones.mjs` (entra a `build.mjs`: lo leí).
- Los nombres comerciales (`Kling 3.0 std`, `Seedance 2.0 Mini`, `Kling O3`, `Kling 3.0 pro`, `Cinematic Studio 3.0`): no consulté Higgsfield en vivo.
