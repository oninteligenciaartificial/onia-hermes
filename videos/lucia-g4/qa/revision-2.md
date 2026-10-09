# G4 · Revisión independiente 2 (9-oct-2026)

Revisor: el mismo de la revisión 1, solo lectura (único archivo creado: este informe). Sin commit, sin créditos, sin instalar, sin publicar.
Se revisó el **FINAL nuevo** `videos/lucia-g4/out/g4-final-1080x1920.mp4` (59,75 s, SHA-256 `8e83ef17aab09a5f1a8d1991ef2871f7a515141e53091f94e09ecfbff29c7b65`) y la copia `videos/lucia-entrega/g4-final-1080x1920.mp4` (SHA-256 `ec4c450f3e0c4f682b675b65ef913a2e1e0400d31b29c35aa948119bf702f997`), no el preview.
Cuadros extraídos con `ffmpeg -i out/g4-final-1080x1920.mp4 -vf "select=eq(n\,N)" -vsync 0 -frames:v 1 f.png` (24 fps) y **mirados** a 1080x1920: 0, 14, 36, 55, 71, 72, 120, 144, 288, 348, 408, 468, 528, 576, 588, 636, 648, 708, 768, 816, 828, 888, 948, 1008, 1075, 1100, 1140, 1160, 1190, 1194, 1210, 1240, 1260, 1290, 1300, 1320, 1340, 1368, 1380, 1410, 1433, más recortes ampliados 2x-4x de C (x 780-1080, y 420-1160), de E (monitor), de F, de K4·5, del café B y de la manga derecha de C. Las capturas viven en el scratchpad de la sesión (no se versionan); el comando regenera cualquiera.

**Severidad.** BLOQUEA = no se publica con esto. ARREGLAR = se corrige antes de publicar si la madre está de acuerdo. NOTA = decisión o mejora, no frena.

## Veredicto

- **¿Se puede mostrar a la madre tal cual?** **SÍ.** No queda ningún BLOQUEA y solo un ARREGLAR, de diseño y no técnico (R2-1, baja). El video es mostrable con el guion actualizado (el guion ya refleja el montaje nuevo).
- **¿Se puede publicar si ella valida el guion?** **SÍ**, con una sola salvedad que debe decidir ella y no el editor: **R2-1** (los sellos rojos «bajo el piso» de E y F, de 28-42 s, dicen lo contrario de la nota de ruido de 45,6 s). No es un engaño de cifras (ver abajo), es una incoherencia de diseño. El resto son NOTA.
- Condiciones que no son de este video pero siguen vigentes: etiqueta «Información de IA» por API al publicar, audio mudo (Sergio Urcullo pone la música), token de Instagram de Lucía que vence entre el 13 y el 18-oct.

## Estado de los hallazgos de la revisión 1

| H | Sev. antes | Estado | Evidencia |
|---|---|---|---|
| H1 consultorio dental en C | BLOQUEA | **CERRADO** | Cuadros 528, 576, 588, 636 (21,75-26,75 s). Ampliado 3x-4x en x 840-1080, y 540-1100: no hay sillón, brazo de equipo, pantalla de consultorio ni letra. Quedan manchas grises suaves donde estaba el equipo (y≈830-900), un triángulo gris de ~12 px en x≈910, y≈750 y un tenue resto en el borde derecho (x≈1050-1080, y≈600-680). Ninguna forma es identificable. Ver R2-2 por el aspecto del parche |
| H2 logos de monitor | ARREGLAR | **CERRADO** | C, monitor (cuadro 576, x 1000-1080, y 1000-1130, 4x): sin aro ni letra; queda un rectángulo tenue. E (cuadros 768 y 816, x 780-1080, y 660-960, 3x): el respaldo del monitor trae solo los dos guiones, sin logo; el hueco se ve natural. B, D, F, café B y K4·5: sin logo ni texto (ver tabla de abajo) |
| H3 cifras y ruido | ARREGLAR | **CERRADO en lo que afirma**; queda R2-1 | Ver sección «H3» |
| H4 A en tres escenas | ARREGLAR | **CERRADO** | Cuadros 1210-1320: tabla A 0,81 · 0,83 · 0,84 y B 0,79 · 0,35 · 0,83, contrastada con PROCEDENCIA línea 97 |
| H5 gancho | ARREGLAR | **CERRADO** (nota R2-5) | Cuadro 36 (1,5 s): pregunta a opacidad plena; 3 s: «Misma orden. Seis motores de imagen.» |
| H6 frase | ARREGLAR | **CERRADO** | «Pagar más no mejora el parecido.» (6 palabras, español correcto) |
| H7 tamaños | ARREGLAR | **CERRADO** | Rótulo 40 px (`estilos.css`: `.tag.tag-r{font-size:40px}`), notas 44 px blancas, textos mínimos 36 px |
| N1 entradas vacías | NOTA | **Casi cerrado** | Entrada de la regla (cuadro 144, 6,0 s): sigue sin elemento 0,1-0,2 s, después entra la primera referencia. Lección 1 (cuadro 1008): ya trae marca, nota y ejes. Lección 2 (cuadro 1194): trae cabecera y etiqueta. Cero rachas de cuadros congelados mayores de 1,9 s |
| N7 copia a ≥ 45 dB | NOTA | **Parcial** | PSNR 49,15 dB promedio, SSIM 0,9944, mínimo 44,17 dB (cuadro 288); 28 de 1434 cuadros bajo 45 dB (en 3-6 s y 12-17 s, la foto A). Mejoró de 300 a 28. A 2x no se ve diferencia |
| N8 SHA | NOTA | **CERRADO** | Ver «Técnica» |
| N9 8 caras | NOTA | **CERRADO** | `assets-fijos/` tracked, no ignorado, con `ORIGEN.md` |

---

## 1. Fondo de C y E, y otras fotos (pedido 1)

**¿Queda algún sillón dental, brazo de equipo, pantalla de consultorio o logo legible?** No.

- **C** (cuadros 528, 576, 588, 636). Zona derecha x 840-1080, y 540-1100 a 3x-4x: pared beige difuminada, restos grises sin forma, el monitor oscuro de abajo con su borde y sin logo. No se distingue ninguna silla, apoyacabezas, lámpara ni pantalla en brazo. En la miniatura C del gancho (cuadro 120) tampoco.
- **E** (cuadros 768, 816, 828): sin logo; los dos guiones del respaldo y un panel de enchufes, nada legible.
- **Otras fotos** a 2x-4x: **A** (balcón, torre de vidrio sin letreros), **B** y **D** (monitor con soporte plateado sin logo), **F** (monitor negro, solo biselado: cuadro 948, x 0-300, y 1330-1890, 2x), **café A y B** (cuadros 1320 y 1368: monitor del café B y el ventanal, sin texto; recorte 5x), **cierre K4·5** (cuadro 1410: el monitor a la izquierda, solo bisel y soporte; la torre curva, con recorte 2x del tramo superior, sin letras ni letrero). Los teléfonos son de diseño tipo iPhone sin logo visible.
- **Identidad de las fotos.** Matriz PSNR cuadro↔fuente (franja superior 1080x1000): A 26,3 · B 23,2 · C **28,8** (contra la limpia) · D 22,4 · E 24,5 · F 25,9 · cierre K4·5 23,2, contra 10-15 dB de las demás en cada fila. Miniaturas A-F del gancho (cuadro 120): pico en su letra (19,1-21,6 contra 10-15). Ninguna foto cruzada. Los `assets/ph-*.jpg` son idénticos byte a byte a sus 9 orígenes y los 9 están tracked y no ignorados.

**¿El parche parece feo o delata algo?** No delata el rubro, y no es feo a 1x. A 2,5x-4x se ve el artificio (R2-2).

### R2-2 · NOTA · El parche de C se come el borde de la manga derecha
- **Evidencia:** cuadro 576, recorte de x 700-1030, y 720-1020 a 2,5x. La caja difuminada empieza en x≈840 y se superpone ~60-90 px con la manga y el hombro derechos de Lucía (x≈850-930, y≈800-960): el borde de la manga queda suave y el naranja sangra hacia la pared. A 1x se lee como una pared «vaporosa» junto al hombro; con el ojo entrenado se nota que algo está desenfocado ahí. Además hay un borde vertical suave en x≈880 junto al hombro (el README ya lo admite en «Lo que no se pudo cerrar», punto 1).
- **Por qué no frena:** no identifica nada y la cara no se toca (0,724 contra 0,737 del original).
- **Corrección si se quiere pulir:** recortar la silueta de Lucía (polígono sobre hombro y manga) fuera de la caja de difuminado, o llevar el borde izquierdo a x≥ 935 en y 800-970. 0 créditos.

---

## 2. H3: nota de ruido, franja y sellos (pedido 2)

### Se lee, tiene tiempo y no tapa nada
- **Nota 1** «Una toma cada uno: es una prueba, no una regla.»: 44 px, blanca, x 90-990 en y 380-425, justo bajo la pastilla «mi piso · 0,70» (cuadros 1008, 1075). Ventana legible 7,71 s para 3,8 s necesarios (`qa/ventanas-de-lectura.txt`). Está desde que llega la placa.
- **Nota 2** «Entre 0,66 y 0,70 la diferencia es ruido (±0,03).»: 44 px, blanca, en y 1105-1150, entre los ejes (y 1058) y la tarjeta (y 1235) (cuadros 1100, 1160). Entra a 45,6 s; ventana 3,92 s para 3,45 s (9 palabras) y se lee **después** de la 1 (3,8 s): bien dosificado.
- Nada se pisa (verificado a ojo en los cuadros 1100, 1160 y 1190; `medir-dom` no reporta choques).
- **Franja de 0,66 a 0,70** (cuadro 1160, 48,3 s): rectángulo gris translúcido de x 681 a 716 sobre todas las filas, al lado de la marca verde de 0,70. Cae justo sobre F (0,66), E (0,69) y D (0,70). **Se entiende por la nota**, que entra 1,6 s antes de que aparezca la franja. Sola, sin la nota, la franja no dice qué es (no tiene rótulo propio).

### ¿Es honesto ahora o sigue engañando? **Es honesto; no engaña con las cifras.**
- Cada número en pantalla es el del original medido y está en PROCEDENCIA (0,702 → 0,70; 0,691 → 0,69; 0,658 → 0,66). Los cuadros que ve el espectador miden (`qa/face-gate-final.txt`): **D 0,691-0,696, E 0,675-0,686, F 0,685-0,695**, o sea D y F son iguales, E apenas más baja, y las tres caen **dentro** de la franja que el video dibuja y declara ruido (0,66-0,70). Lo que el video dice y lo que mide el gate sobre lo que se ve coinciden.
- La corrección del H3 se cumplió por la opción (a)+(dibujo): el ruido está escrito, es legible y está dibujado.

### R2-1 · ARREGLAR (baja; decisión de la madre) · Los sellos rojos de E y F siguen afirmando lo que la nota después llama ruido
- **Evidencia:** cuadros 828 y 948 (33,7-36,6 s y 38,7-41,6 s): sello rojo rotado «bajo el piso» sobre E (0,69) y F (0,66), con pastilla neutra «justo en el piso» sobre D (0,70) en el cuadro 708. En 45,6 s la nota dice que entre 0,66 y 0,70 la diferencia es ruido, y en la placa de la lección 1 los puntos de E y F siguen en rojo dentro de la franja gris (cuadro 1160).
- **Por qué importa:** quien se va antes de los 45 s se lleva «E y F fallaron, D casi». Es literalmente cierto de los números mostrados (0,69 y 0,66 son menores que 0,70) pero el propio video dice después que no se puede separar a D de E ni de F.
- **Corrección (la madre elige):** (a) dejar tal cual: el video se corrige solo a los 45,6 s; (b) cambiar el texto de los dos sellos a «bajo el piso (±0,03)»; (c) neutralizar el rojo de E y F (mismo trato que D) y dejar un solo sello; (d) subir la nota 2 a la escena D (28 s). La (a) es defendible; la (b) cuesta una línea en `plan.json`.

---

## 3. H4: lección 2 (pedido 3)

- **Completa y legible** (cuadros 1194, 1210, 1260, 1320, 1368): cabecera «Escena 1 / 2 / 3» en y 300-345 (bajo los 280 px de Instagram), fila **Imagen A** 0,81 · 0,83 · 0,84 en verde (aparece 49,85-50,15 s), fila **Imagen B** 0,79 · **0,35** (coral, con anillo desde 54,7 s) · 0,83 (52,5-52,8 s) y las dos fotos del café con su pie «Imagen A · café 0,83» / «Imagen B · café 0,35». Celdas de 84 px, etiquetas de 38-40 px.
- **Cifras contrastadas con PROCEDENCIA línea 97** (recalculadas, redondeo a 2 decimales media hacia arriba): A 0,806 → 0,81 · 0,830 → 0,83 · 0,839 → 0,84; B 0,794 → 0,79 · **0,350 → 0,35** · 0,831 → 0,83; café A 0,83 y café B 0,35 iguales a las celdas de escena 2. **Cero cifras mal copiadas.**
- **«Imagen A: la sostuvo en tres.»**: la entiende quien vio el gancho («¿Cuál conserva su cara?») y la tabla de al lado se lo prueba; no exagera: las tres de A son ≥ 0,806, por encima del piso de 0,70, y el pie dice lo mismo («en tres escenas»). Falta decir «escenas», pero el encabezado de la tabla lo da.
- **«El café: B perdió la cara.»**: se entiende (anillo sobre la celda de 0,35 y la foto B del café con estilo de caricatura y 0,35 en coral). No exagera para la escena 2, pero ver R2-3.

### R2-3 · NOTA · «El café» es ambiguo: la escena 3 de B también es un café y ahí **sí** la sostuvo
- **Evidencia:** README líneas 36-39 y PROCEDENCIA: `kling_omni_image_K2cafe` (0,35) y `kling_omni_image_K4cafe` (0,831) son ambas «cafés». La tarjeta dice «El café: B perdió la cara.» y la celda de la escena 3 (0,83) está al lado. Quien sepa que la escena 3 era un café lo lee como contradicción; quien no, lo lee bien.
- **Corrección:** «Escena 2: B perdió la cara.» (5 palabras, mismo tiempo) o «En esa escena, B perdió la cara.» Es un cambio de guion.

---

## 4. H5: gancho y rótulo de IA a 40 px (pedido 4)

- **Funciona.** Cuadro 36 (1,5 s): pregunta a opacidad plena con «su cara?» en verde desde 1,3 s. A 3,0 s (cuadro 72) entra «Misma orden. Seis motores de imagen.» (c2) y a 3,1 s las 6 miniaturas A-F (cuadro 120). Cuadro 0: rótulo a 40 px, cuadros 14-55: sin tarjeta hasta 0,1 s (los únicos 3 cuadros sin tarjeta, medido).
- **El rótulo de 40 px no tapa nada.** Ocupa x 195-885, y 720-800. Su borde inferior queda a 5 px del borde superior del teléfono (y≈805) sin cubrirlo, y a 63 px del mentón (659). Es legible: blanco sobre píldora oscura al 84 %, contraste AA (`hyperframes check`: 40/40). Se ve de 0 a 3,13 s (3,13 s para 2,40 s necesarios).

### R2-5 · NOTA · «¿Cuál conserva su cara?» no tiene objeto hasta los 3 s
- **Evidencia:** cuadros 14-72: durante 3 s el espectador ve a Lucía mirando el teléfono, el rótulo de IA y «¿Cuál conserva su cara?». «Cuál» no tiene aún antecedente (no se dice «motor» ni «foto» hasta 3,0 s). Es una curiosidad válida, pero la pregunta sin objeto puede leerse como «¿cuál de qué?».
- **Corrección opcional:** «¿Qué IA conserva su cara?» (5 palabras) en 0,1-3,0 s y «Misma orden. Seis motores de imagen.» igual. Cambio de guion.

---

## 5. H6 y afirmaciones nuevas (pedido 5)

**«Pagar más no mejora el parecido.»** Los datos lo sostienen (PROCEDENCIA línea 97, parecido sobre el original):

| Imagen | Créditos | Parecido | Contra A (1 cr, 0,806) |
|---|---:|---:|---:|
| B | 0,5 | 0,794 | −0,012 (ruido) |
| **A** | **1** | **0,806** | — |
| C | 2 | 0,737 | −0,069 |
| D | 2,5 | 0,702 | −0,104 |
| F | 2,75 | 0,658 | −0,148 |
| E | 3 | 0,691 | −0,115 |

Ninguna imagen que cuesta más que A la mejora y las cuatro caen 0,07-0,15 (más que el ±0,03 de ruido). Tampoco «mejora» B→A (+0,012) en términos de ruido; la frase dice «no mejora», no «empeora», y es exacta. La salvedad de «una toma cada uno» está en la nota 1. **Ninguna afirmación nueva** que los datos no sostengan: «A la sostuvo en tres» (0,806 · 0,830 · 0,839 ≥ 0,70), «B perdió la cara» en la escena 2 (0,350), «Entre 0,66 y 0,70 la diferencia es ruido (±0,03)» (los tres cuadros mostrados de D, E y F caen en 0,675-0,696, el ±0,03 coincide con las diferencias original/cuadro medidas: F +0,025 a +0,035). No dice «mejor» de ningún motor en general; D 0,70 no se anuncia como aprobado (punto y pastilla neutros: cuadros 708 y 1160).

### R2-4 · NOTA · El número de C no es el de la imagen que se muestra, y el retoque no se avisa en pantalla
- **Evidencia:** C se muestra con la copia «limpia» (cara 0,724, `qa/face-gate-limpias.txt`) pero la pastilla dice **0,74** (original 0,737). Redondeado, la imagen mostrada da 0,72. E: 0,687 contra 0,690 mostrado (0,69 igual). Sobre los cuadros mostrados C mide 0,727-0,743 (`face-gate-final.txt`): dentro del ruido.
- **Por qué importa poco:** la cara no se tocó y la diferencia es de 0,013, la mitad del ruido declarado. Pero el espectador ve una imagen retocada (fondo difuminado) presentada como salida del motor.
- **Corrección:** nada en el video; que el README o el pie interno anoten «fondo difuminado en C y E» (el README ya lo hace en la tabla). Si algún día se publica la comparación de motores con su fondo, mostrar los originales.

---

## 6. H7 y zona segura (pedido 6)

- **Rótulo de IA:** 40 px (antes 34), de 0 a 3,13 s, blanco sobre píldora oscura; margen 63 px bajo el mentón. Notas 1 y 2: 44 px blancas. Filas y ejes de la lección 1: 36-40 px; mínimo del video 36 px.
- **Zona segura, mi simulación de Instagram** (tapan ~280 px arriba y ~380-430 px abajo; rail derecho desde y≈1100): nada clave cae en y < 280 (lo más alto es la pastilla «mi piso · 0,70», en y 292-372, a 12 px de la línea; y el rótulo de la lección 2, en y 300-345). Nada clave en y > 1470 (las tarjetas terminan en 1470, el cierre incluido). Sobre la derecha: la nota 2 termina en **x≈983** en y 1105-1150, dentro de la regla de 80 px (x ≤ 1000) pero pegada al borde.

### R2-6 · NOTA · La nota 2 ocupa casi todo el ancho y la franja no tiene rótulo propio
- **Evidencia:** cuadro 1160: nota 2 de x=97 a x=983 en una sola línea. El rail de «me gusta»/comentar de Instagram suele empezar hacia y≈1150-1250 y x≥950: el punto final queda a 17 px de la línea de la regla y podría rozar el primer icono.
- **Corrección:** partirla en dos líneas (`max-width:860px`) o bajar el tamaño a 40 px. Opcional: rotular la franja («ruido ±0,03») para que se entienda sin la nota.

---

## 7. Estructura y cierre (pedido 7)

- **Estructura de 59,75 s:** **gancho** 0,1-6,0 s (pregunta + contexto + miniaturas); **desarrollo** 6,0-42,0 s (regla + 6 escenas); **lección 1** 42,0-49,75 s; **lección 2** 49,75-57,25 s; **cierre con UN solo CTA**, «Seguime: cada semana, una prueba.» (57,25-59,75 s). Pasa de 30 y no de 60. **Deja algo aprendido**: «pagar más no mejora el parecido» y «una foto sola no mide», con la respuesta a la pregunta del gancho («Imagen A: la sostuvo en tres»).
- **Tramos muertos:** ninguno. Cuadro a cuadro (`signalstats` YDIF): la racha estática más larga es de 1,88 s (47,7-49,5 s, la franja de ruido ya puesta; hueco máximo entre eventos 2,55 s según `qa/eventos-visuales.txt`). Cero cuadros congelados dentro de las escenas de foto.
- **Entradas de placas:** ya no vacías (ver tabla de estado, N1): la regla tiene 0,1-0,2 s de placa vacía al entrar (cuadro 144, solo la tarjeta); la lección 1 y la 2 traen contenido.
- **Cierre con K4·5:** funciona. Lucía mira a cámara y sonríe, cara en x 616-816, y 734-991 (mentón 991, tarjeta desde 1236: 245 px de aire), tarjeta sobre el torso y el escritorio, sin tapar cara ni mano. Identidad 0,826-0,832 sobre el cuadro. Mejora real sobre el cierre anterior (la foto A preocupada).

### R2-7 · NOTA · Detalles del cierre
- El gesto es de **señalar un monitor** a su izquierda (la mano en x 210-390, y 1100-1230), no al CTA ni a la cámara. Es un detalle: no choca con «Seguime» pero no lo refuerza.
- **El CTA queda 2,5 s** (57,25-59,75): lectura 2,58 s para 2,05 s necesarios (margen de 0,5 s: cumple; las tarjetas más justas del video son c14, 0,10 s, y c12, 0,14 s, según `ventanas-de-lectura.txt`). En un reel que se repite en bucle es poco para que se lea «cada semana, una prueba» antes de que reinicie.

### R2-8 · NOTA · Ritmo (sin cambio desde la revisión 1)
- La foto A sigue apareciendo dos veces (0-6 s y 11,75-17 s; ya no en el cierre) y A (la ganadora) abre el bloque de escenas, así que el suspenso se pierde; las seis escenas siguen siendo del mismo formato (30 s). La lección 1 dura ahora 7,75 s (era 5,5). Decisión de guion, no de montaje.

---

## 8. Técnica (pedido 8)

| Chequeo | Resultado |
|---|---|
| ffprobe del master | H.264 High, **1080x1920**, yuv420p, bt709, **24 fps**, **59,750 s**, 1434 cuadros, 8,08 Mbps; AAC LC 48 kHz estéreo 59,750 s (2802 paquetes), **-91,0 dB media y máximo (silencio)** |
| ffprobe de la copia | 1080x1920, 24 fps, 59,750 s, 1434 cuadros, 2,85 Mbps, mismo AAC en silencio (-91,0 dB); crf 18 (21,4 MB) |
| SHA-256 contra README | `videos/lucia-g4/README.md` línea 17: master `8e83ef17…7b65` **coincide**; línea 18: copia `ec4c450f…f997` **coincide**. `videos/lucia-entrega/README.md` línea 19: `ec4c450f…f997` **coincide** (los de g1, g3 y g2 también coinciden) |
| Copia contra master | PSNR 49,15 dB (y 48,06 · u 52,96 · v 52,78), mín. 44,17 dB; SSIM 0,9944 (promedio). Mismo contenido; 28 cuadros bajo 45 dB (R2-9) |
| Preview 360p | 360x640, 24 fps, 59,75 s, 1434 cuadros; `qa/g4-preview-360p.mp4` idéntico byte a byte al de `out/` y tracked |
| `hyperframes check` | 0 errores, 32 avisos de estilo, 1 info de layout (cruce de 1 cuadro entre c12 y c13), contraste 40/40 AA |
| Pie | `pie.txt` idéntico al del guion; 83 palabras; sin prohibidas |
| `videos/lucia-entrega/README.md` al día con G4 | **Casi**: fila de G4 con 59,75 s y preview, SHA y párrafo crf 18 (PSNR 49,2 / 44,2). **Desactualizado:** el título sigue en «G1, G3, G2» y la línea 77 dice «los motores van como «Motor 1 a 6»» (G4 usa «Imagen A a F») |
| Archivos del build en git | `git status` limpio. Tracked y **no ignorados**: `assets-fijos/ref1-8.jpg`, `assets-fijos/ORIGEN.md`, `assets-fijos/vendor/gsap.min.js`; las 9 fotos de origen (incl. `fotos-limpias/` de C y E y `kit/k4-5-senala-342c0ab5.jpg`), las 3 fuentes en `hermes-content/brand/fonts/`, el manifiesto, `plan.json`, `index.html`, `scripts/*`, `qa/*`. `git check-ignore` sobre `assets-fijos/*` no devuelve nada. Ignorados a propósito: `assets/*.jpg`, `assets/refs-orig/`, `assets/fonts/`, `assets/vendor/`, `out/`, `renders/` (se regeneran con `node scripts/build.mjs`). `build.mjs` usa `assets-fijos/` primero (líneas 47-68) y solo cae a CloudFront/jsDelivr si faltan |
| Fotos del plan contra origen | `assets/ph-a..f,k.jpg` y `cafe-a/b.jpg` idénticos (sha256) a sus 9 orígenes de `plan.json → fotos` |

### R2-9 · NOTA · Copia de entrega: 28 cuadros entre 44,2 y 44,9 dB
- **Evidencia:** `qa/psnr-entrega.txt` y mi propio cálculo coinciden: 28 cuadros bajo 45 dB, todos en 3-6 s y 12-17 s (la foto A: paisaje urbano detallado). Imperceptible a 2x. El README ya lo acepta («aceptado»). Si se quiere ≥ 45 dB en todos: `-crf 16` (~28 MB).

### R2-10 · NOTA · `index.html` se reescribió después del render
- **Evidencia:** `index.html` mtime 15:47:06, render final 15:39:24, preview 15:40. El README dice que se verificó `cmp` idéntico al renderizado y no encontré motivo para dudarlo (el contenido coincide con todos los cuadros que miré), pero no pude re-renderizar para comprobarlo (ver «No verificado»).

---

## No verificado (lo digo de frente)

1. **No re-medí caras** (ArcFace/SCRFD): no se puede instalar nada. Usé `qa/face-gate-final.txt`, `face-gate-limpias.txt` y `face-gate.txt` tal cual y verifiqué a mano que cada cifra de pantalla coincide con PROCEDENCIA línea 97.
2. **No re-rendericé** (hyperframes baja paquetes): no pude comprobar que el `index.html` committed sea bit a bit el del render (R2-10).
3. **No vi el video en un teléfono ni en la interfaz real de Instagram**: las zonas tapadas (arriba ~280 px, abajo ~380-430 px, rail derecho) son una simulación con los márgenes de la regla.
4. **La ausencia de sillón dental y de logo en C y E la juzgo sobre cuadros comprimidos del final ampliados 2x-6x**, no sobre los JPG originales de la copia limpia. A 4x no hay forma identificable; no puedo garantizar que un análisis forense del fotograma no encuentre un residuo.
5. **No hice ninguna petición de red**: no sé si las URL de CloudFront de `assets-fijos/ORIGEN.md` siguen vivas (ya no hace falta: los recortes están versionados).
6. **No comprobé** si las 8 referencias de medición se solapan con las de entrada de cada motor (si coinciden, parte del «parecido» mediría copia; es de método y no cambia el video).
7. **No pude verificar la identidad de la cara de la copia limpia contra el original en frames nuevos**: usé la cifra del autor (0,724 / 0,687).
