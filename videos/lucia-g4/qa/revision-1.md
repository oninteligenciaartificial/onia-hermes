# G4 · Revisión independiente 1 (9-oct-2026)

Revisor: sesión independiente, solo lectura (único archivo creado: este informe). No se gastaron créditos, no se instaló nada, no se publicó nada.
Se revisó el **FINAL** `videos/lucia-g4/out/g4-final-1080x1920.mp4` (SHA-256 `4a24a0eb55131086f74415e9e8595dcf0bd18142d4f64486e5eea0fa2305162c`), no el preview, y la copia `videos/lucia-entrega/g4-final-1080x1920.mp4`.
Los cuadros se extrajeron con `ffmpeg -i out/g4-final-1080x1920.mp4 -vf "select=eq(n\,N)" -vsync 0 -frames:v 1 f.png` (N = cuadro exacto, 24 fps) y se **miraron** a 1080x1920: 0, 14, 55, 58, 72, 108, 138, 144, 216, 276, 288, 348, 402, 408, 468, 522, 528, 588, 642, 648, 708, 762, 768, 828, 882, 888, 948, 1002, 1008, 1075, 1133, 1140, 1212, 1224, 1236, 1250, 1266, 1272, 1300, 1320, 1340, 1360, 1367 y 19 cuadros de costura (140-142, 285-287, 405-407, 525-526, 766, 886, 1005-1006, 1137, 1139, 1269-1270), más recortes ampliados de los fondos de C, D, E, B y del teléfono de E.
Las capturas viven en el scratchpad de la sesión (no se versionan); el comando de arriba las regenera.

**Severidad.** BLOQUEA = no se publica con esto (la madre lo puede ver igual para validar el guion). ARREGLAR = se corrige en la 2da pasada. NOTA = decisión o mejora, no frena.

## Veredicto (resumen)

- **Mostrarlo a la madre tal cual como primera pasada (borrador para validar el guion): SÍ**, acompañado de este informe. Técnicamente está limpio: specs, números contra la fuente, letras y fotos, costuras, cuadros vacíos, zona segura, SHA y copia de entrega.
- **Publicarlo tal cual: NO.** Hay **1 BLOQUEA** (H1: un consultorio dental visible detrás de la Imagen C, contra la regla «nunca profesional de salud / no se da a entender el rubro») y **6 ARREGLAR** (H2-H7). H2 además la saca del carril «se publica sin preguntar» (muestra una marca de tercero).

---

## BLOQUEA

### H1 · La foto de la Imagen C muestra un consultorio dental al fondo (y el README lo describe mal)
- **Evidencia:** cuadros 528-640 (21,75-26,75 s; la foto está 5,25 s en pantalla), zona derecha del lienzo x≈880-1080, y≈600-950. Ampliado 2x: dos **sillones dentales beige con apoyacabezas**, una unidad con pantalla en brazo articulado y, en el borde (x≈1040-1080, y≈600-680), el **brazo/apoyacabezas blanco** que el README llama «un perfil gris tipo letra, en el vidrio» (README línea 39). No es una letra: es parte del sillón. También aparece en la miniatura C del gancho (3,1-6,0 s), muy chico.
- **Por qué importa:** `CLAUDE.md` y `lucia/SKILL.md` §0: Lucía lleva el ambo como vestuario y **nunca da a entender que es del rubro**; el guion promete «ninguna frase habla de profesión… no se dice dónde está». Un ambo terracota + sillones dentales detrás dice «odontóloga» sin una palabra: es exactamente el caso «Hoy soy odontóloga» (2-oct), esta vez por imagen. El control de reglas del guion y `grep-prohibidas` solo miran texto, así que no podían verlo.
- **Corrección:** (a) difuminar con pluma la franja derecha de la foto C (x≈870-1080, y≈560-1160), receta de G3 en `montaje-hyperframes.md` §7 (`gblur` + `geq` con pluma, sigma 6-9); o (b) llevar el origen del zoom y un recorte para sacar esa franja (no alcanza: el fondo está dentro del cuadro); o (c) que la madre acepte explícitamente la foto C tal cual. Corregir también el README (línea 39) con lo que realmente es.
- **Qué NO pude verificar:** si los otros cuatro fondos (A, B, E, F) tienen algo del rubro; los miré completos a 1080x1920 y no vi nada más.

---

## ARREGLAR

### H2 · Logos de una marca de tercero (tipo Dell) en los monitores de C y E
- **Evidencia (ampliado):**
  - **C**, cuadro 528-642: aro con «E» tipo logo Dell en el pie del monitor, **recortado por el borde derecho**, x≈1070-1080, y≈1040-1060, ~15 px.
  - **E**, cuadros 768-882 (31,75-37,0 s): logo circular entre dos guiones sobre el dorso del monitor blanco, x≈885-900, y≈745-765, ~20 px, borroso. El README lo llama «óvalo borroso… tipo logo de monitor» (línea 39) y lo deja como decisión de la madre.
  - D y B: monitores sin logo (soporte plateado con agujero). Teléfonos: modelo tipo iPhone Pro, sin logo visible.
- **Por qué importa:** regla «Sin marcas de terceros en pantalla» (`lucia/SKILL.md` §0-ter) y `CLAUDE.md` § «Qué se publica sin preguntar»: lo que muestre a un tercero exige el OK de Sergio Urcullo. Es chico e incidental, pero es una marca y la pieza dejaría de ser publicable sin pedirlo.
- **Corrección:** el mismo desenfoque con pluma de H1 sobre las dos cajas (C: x 1040-1080, y 1020-1070; E: x 860-920, y 730-785). Costo: 0 créditos, 2 cajas en `plan.json`. Si se prefiere no tocar píxeles, la madre lo acepta por escrito.

### H3 · Las cifras de D, E y F en pantalla no coinciden con lo que mide el gate sobre los cuadros que ve el espectador
- **Evidencia** (`qa/face-gate-final.txt`, cuadro FINAL a 3 instantes por escena; mi lectura de la tabla):

  | Imagen | En pantalla (original) | Medido en el cuadro FINAL | Estado que muestra el video |
  |---|---:|---:|---|
  | A | 0,81 | 0,784-0,800 | verde |
  | B | 0,79 | 0,779-0,787 | verde |
  | C | 0,74 | 0,736-0,741 | verde |
  | **D** | **0,70** | **0,690-0,699 (los 3 cuadros «BAJO: mirar»)** | neutro «justo en el piso» |
  | E | 0,69 | 0,673-0,678 | rojo «bajo el piso» |
  | **F** | **0,66** | **0,685-0,697 (+0,025 a +0,037)** | rojo «bajo el piso» |

- Sobre lo que se ve, **D y F miden lo mismo (≈0,69)** y el video las trata distinto (D neutro, F con sello rojo). E (0,69 en pantalla, 0,675 medido) y D (0,70) están a 0,011 en el original, dentro del ±0,03 que el propio guion declara, y aun así una lleva sello rojo y la otra no. El README (línea 22) dice «ningún número difiere 0,03 o más del original»: cierto contra el PNG, no contra el cuadro mostrado (F +0,037). Además las caras de A y D en pantalla miden 180-186 px y el gate las marca «poco confiable».
- **Por qué importa:** el video muestra una frontera nítida (verde / neutro / rojo) que su propia nota dice que no existe, y el cuadro que ve el espectador no la respeta. D 0,70 no se anuncia como aprobado (bien: punto y pastilla neutros, cuadros 708 y 1075).
- **Corrección (que decida la madre):** (a) la mínima: la nota de la lección 1 pasa a «Una toma cada uno, ±0,03: es una prueba, no una regla.» (11 palabras: pide 4,15 s y su ventana actual es de 4,96 s); (b) la honesta: D, E y F con el mismo tratamiento neutro y un solo sello «alrededor del piso» para las tres; o (c) medir las seis fotos sobre el mismo archivo que se muestra (JPG de 1080 px: A 0,806 · B 0,789 · C 0,737 · D 0,707 · E 0,690 · F 0,672, `qa/face-gate.txt`) y volver a decidir los estados.

### H4 · El video nunca contesta su propia pregunta: la Imagen A «la sostuvo en tres escenas» no se ve en pantalla
- **Evidencia:** el gancho pregunta «¿Cuál conserva su cara?» (cuadro 72). En pantalla de A solo aparecen **0,81** (12,7-16,7 s) y, en la lección 2, **0,83** del café (49,9-53 s). **0,84 nunca aparece** y A nunca se muestra «en tres escenas». Lo que sí se muestra con sus tres escenas es **B** (0,79 · 0,35 · 0,83). La frase «el que ya uso la sostuvo en tres escenas» vive solo en el pie y en «Qué aprende» del guion.
- **Por qué importa:** `lucia/SKILL.md` §0-bis: «la unidad de enseñanza va completa antes del CTA». Quien mira sin leer el pie ve una promesa («¿cuál?») y dos lecciones sobre otras cosas; el ganador no se nombra. Además lo único que se le enseña con tres escenas es el fallo.
- **Corrección:** en la placa de la lección 2 agregar una fila simétrica «Imagen A · tres escenas 0,81 · 0,83 · 0,84» (verde) sobre la de B, y que la tarjeta c12 pase a algo como «A la sostuvo en tres.» / «Una foto sola no mide.» (cuidar ≥ 0,35 s por palabra + 0,3 s y ≤ 6 palabras). Si no cabe, mover el dato a c11. Valores contra PROCEDENCIA línea 97: A 0,806 · 0,830 · 0,839 → 0,81 · 0,83 · 0,84.

### H5 · El gancho no trae pregunta ni promesa en los primeros 3 s
- **Evidencia:** 0,1-3,0 s solo dice «Misma orden. / Seis motores de imagen.» (cuadros 14 y 55): un enunciado de contexto. La pregunta («¿Cuál conserva su cara?», c2) entra en **2,958 s** y a 3,0 s está a ~60 % de opacidad (cuadro 72): queda legible recién hacia 3,15 s. `lucia/SKILL.md` §0-bis pide «gancho en los primeros 3 s, con una promesa o una pregunta».
- Además «orden» (instrucción al modelo) y «motores de imagen» son jerga para quien no sigue IA; el rótulo «personaje IA» no los explica.
- **Corrección:** invertir los dos bloques: c1 = «¿Cuál motor de imagen / conserva su cara?» (0,1-2,2 s, 6 palabras) y c2 = «Misma orden. Seis motores.» (2,2-6,0 s). Es un cambio de guion: va a la madre. Variante sin cambiar el guion: mantener el orden pero adelantar c2 a 2,0 s (c1 queda de 0,1 a 2,0 = 1,9 s: alcanza solo con 4 palabras, «Misma orden. Seis motores.», que piden 1,7 s).

### H6 · «Pagar más no la parece más» no es español estándar
- **Evidencia:** tarjeta c11 (cuadros 1008-1133) y su ventana de 5,5 s. «Parecer» no admite «la» como complemento («no la parece» se lee «no la parece a ella más» o, peor, «no parece más la»). Se repite el verbo «parecer» también como dato («parecido»), lo que ayuda, pero la frase que cierra la lección 1 es la más citable del video.
- **Corrección:** «Pagar más no la hace más parecida.» (6 palabras: pide 2,4 s y la tarjeta dura 5,5 s) o «Pagar más no se le parece más». Cambia el guion: va a la madre. Aprovechar para decir «Acá» o «En esta prueba» al inicio si hay sitio: la tarjeta afirma en presente general lo que es una toma por motor.

### H7 · La nota que protege todas las conclusiones es el texto más chico y apagado del video
- **Evidencia:** cuadro 1075/1133: «Una toma cada uno: es una prueba, no una regla.» en gris claro, trazo fino, 36 px (la `qa/zona-segura.txt` lista los tamaños: 34 px el rótulo de IA, 36 px estos), sobre fondo oscuro, arriba de la placa. Es la única frase que dice que A y B tienen tres tomas y el resto una, y que la lección no es una regla. En un teléfono (1080 px → ~390 pt) son ~13 pt.
- **Corrección:** subirla a 44-48 px y blanco pleno (hay ancho: ocupa 760 de 880 px; pasaría a dos líneas), o llevarla a la tarjeta c11 en la costura. Mismo criterio para el rótulo de IA del cuadro 0 (34 px, ventana 2,54 s para 2,40 s necesarios, es decir 6 % de margen): 40 px y 3,0 s.

---

## NOTA

- **N1 · Entradas casi vacías de las placas.** Cuadros 145-150 (6,04-6,25 s), 1008-1020 (42,0-42,5 s) y 1140-1146 (47,5-47,9 s): solo la tarjeta sobre fondo oscuro 0,25-0,5 s antes de que entre el primer elemento (refs a 6,25, marca a 42,1, ficha a 47,9). Medido con YDIF por cuadro: no hay cuadros congelados fuera de lo previsto (ver «Verificado»). Si se quiere más pulso, anticipar el primer elemento dentro del empuje.
- **N2 · Ritmo.** Los primeros 17 s son: la foto A (0-6 s) → placa → **la misma foto A otra vez (11,75-17 s)**; el bloque 12-42 s son seis escenas idénticas en forma (30 s). A (la ganadora) abre el bloque, así que no hay suspenso. Opciones para la 2da pasada: 3,5-4 s por escena (el guion dice 5), o ordenar de modo que A quede al final. Es de guion.
- **N3 · El número no es un porcentaje.** «Idéntica es 1» + «parecido 0,81» se lee «81 % parecida». Es similitud coseno ArcFace; contra cada referencia suelta las fotos miden 0,47-0,76 (`face-gate.txt`, min_ref/max_ref), y el centroide, que es lo que se muestra, queda más alto. Un rótulo «no es porcentaje» o una marca «una foto real suya contra las otras 7: ~X» ayudaría; no la pude medir (ver «No verificado»).
- **N4 · Foto B del café (0,35, «otra persona»).** Queda claro que no es Lucía: pie «Imagen B · café 0,35» en coral, tarjeta «El café: B perdió la cara.» y anillo sobre «Escena 2 0,35» (cuadros 1236/1250). El render es de estilo caricatura, con el mismo ambo y la misma taza, así que quien mira 1 s podría leerlo como «Lucía en otro estilo». Riesgo bajo. Rótulo opcional bajo el 0,35: «no es ella». Hay 0,3 s (50,25-50,55 s) en que la foto B está sin su pie.
- **N5 · Cierre.** El CTA «Seguime: cada semana, una prueba.» (único, correcto) va sobre la foto A de cara preocupada y sin mirar a cámara; el guion admitía el clip K1 mirando a cámara. «Cada semana» es un compromiso de frecuencia; el pie lo repite. Decisión de la madre.
- **N6 · Densidad de la lección 2.** En 5,5 s (47,5-53) hay rótulo, 3 fichas con 6 cifras, 2 fotos con pie, un anillo y 2 tarjetas. Cada texto cumple sus 0,35 s/palabra + 0,3 (`ventanas-de-lectura.txt`), pero el espectador lee ~26 elementos. Si se agrega la fila de A (H4), conviene que la lección 2 dure +1 s.
- **N7 · Copia de entrega.** PSNR contra el original **47,17 dB promedio (pasa 45), SSIM 0,9915**; pero **300 de 1368 cuadros dan 43,2-44,9 dB**, todos sobre la foto A (gancho, escena A, cierre: el paisaje urbano detallado). A 2x no se ve diferencia (comparé el cuadro 400). Si se quiere ≥ 45 dB en todos: `-crf 18 -maxrate 8M`, ~25-30 MB, cabe en git.
- **N8 · Trazabilidad.** (a) El README de G4 no registra el SHA-256 del master `out/` (que no está en git y se pierde con el contenedor); el de la copia sí está en `lucia-entrega/README.md` y **coincide** (`20b2f943…5259`). Anotar el del master. (b) `index.html` tiene mtime 14:49:16, **posterior** al render final (14:43:21) y al preview (14:46:15); los scripts de entrada son anteriores, así que probablemente es una re-corrida idéntica de `build.mjs` en el QA, y el contenido coincide con lo que vi en los cuadros, pero no pude re-renderizar para comprobarlo (ver «No verificado»). (c) `lucia-entrega/README.md` dice «Motor 1 a 6» para toda la serie y G4 usa «Imagen A a F»; el título habla de «G1, G3, G2» e incluye la fila de G4.
- **N9 · Reproducibilidad: las 8 caras de la placa de la regla no están en git.** Se bajan por curl de URL de CloudFront del manifiesto (`v4/qa/manifest-escenas-seedream-20260930.json`); si esas URL caducan o cambia el contenedor sin red, `build.mjs` falla y no hay forma de reconstruir esa placa. Los 8 recortes de 360x360 pesan ~20 KB cada uno: versionarlos (por ejemplo en `videos/lucia-g4/refs/`, fuera de `assets/*.jpg` que está ignorado) y que `build.mjs` los use primero. GSAP también cae a jsDelivr si desaparecen `lucia-g1/g2/g3/assets/vendor` (ignorados en git). Lo demás sí está en git y no ignorado: las 8 fotos de origen (tracked), las 3 fuentes, el manifiesto, `plan.json`, `index.html`, `scripts/*`, `qa/*` y el preview 360p (`qa/g4-preview-360p.mp4`, idéntico byte a byte al de `out/`). Los derivados (`ph-*`, `th-*`, `cf-*`, `ref*.jpg`) se regeneran y están ignorados a propósito.
- **N10 · Audio.** Silencio en ambos (−91,0 dB media y máximo; AAC LC 48 kHz estéreo, 57,000 s). `editor-videos` §10 pide «un pop por tarjeta» sin voz; G4 los omite a propósito (queda sitio a la música de Sergio Urcullo), igual que G1-G3 y está documentado. Un reel 100 % mudo se publica sin pista de música: si Instagram lo trata como «sin audio», conviene que Sergio Urcullo ponga la música antes de publicar.
- **N11 · Honestidad del lenguaje en primera persona.** El pie dice «probé», «medí», «el que ya uso», «hago una prueba» en voz de Lucía (personaje IA declarado desde el cuadro 0 y en el pie). Es el mismo registro que G1-G3; lo anoto porque la regla es «IA declarada» y no «yo hice»: que la madre confirme que le basta.

---

## Verificado (para que no se rehaga)

| # | Chequeo | Resultado |
|---|---|---|
| 1 | Cuadro 0 con rótulo «Lucía Antelo · personaje IA de Onia» | OK, a opacidad plena desde el cuadro 0 (rótulo y 720-795, mentón A en 657: 63 px) |
| 1 | Foto correcta para cada letra | OK. Matriz PSNR cuadro↔fuente (franja superior 1080x1000, 8 cuadros × 6 fuentes): el pico cae en la letra correcta en los 8 (A 26,3-26,6 dB; B 23,2; C 26,8; D 22,4; E 24,0; F 25,9; cierre = A 26,2) contra 10-14 dB de las otras. Miniaturas A-F del gancho: pico en su letra (19-21 dB contra 10-14). Los `assets/ph-*.jpg` son **idénticos byte a byte** a los de origen (sha256) y los 8 origenes están tracked en git |
| 1 | Texto cortado, tapando cara, ilegible, cuadros vacíos/blancos, franjas | **Ninguno** en los ~63 cuadros mirados. Los 10 empujes (cuadros 140-143, 285-288, 405-408, 525-528, 645-648, 765-768, 885-888, 1004-1007, 1135-1139, 1268-1272) son rígidos, sin tiras de fondo. Último cuadro 1367: la foto A con el CTA, sin negro |
| 2 | Cifras contra PROCEDENCIA línea 97 | OK: A 0,806→0,81 · B 0,794→0,79 · C 0,737→0,74 · D 0,702→0,70 · E 0,691→0,69 · F 0,658→0,66 · café A 0,830→0,83 · café B 0,350→0,35 · B escena 3 0,831→0,83 · créditos 1 / 0,5 / 2 / 2,5 / 3 / 2,75. Orden de filas de la lección 1 por precio: B, A, C, D, F, E correcto |
| 2 | Desvíos | Ver H3 (cuadro mostrado contra original) y H4 (0,84 de A no aparece) |
| 3 | «Pagar más no la parece más» | Sostenida por los datos (ninguna de las más caras supera a A; E, la más cara, 0,691 < 0,806) con la salvedad de H3/H6. «el más barato la perdió» (pie): B 0,5 cr, 0,35 en el café, correcto. «una toma cada uno»: exacto para C-F; A y B tienen tres (la frase está en la placa de la lección 1, donde es exacta) |
| 3 | D 0,70 | **No se anuncia como aprobado**: punto blanco y pastilla «justo en el piso» sin verde (cuadros 708, 1075, 1133). Ningún texto dice «mejor» en general |
| 4 | Texto en pantalla (DOM de `index.html` + cuadros) | Transcripción completa: «Lucía Antelo · personaje IA de Onia» · «Misma orden. Seis motores de imagen.» · «¿Cuál conserva su cara?» · A-F · «Se mide contra 8 fotos suyas.» · «Idéntica es 1. Piso, 0,70.» · «0» «idéntica · 1» «mi piso · 0,70» · «Imagen X · n crédito(s)» + «parecido 0,xx» · «justo en el piso» · «bajo el piso» ×2 · «Pagar más no la parece más.» · «Una toma cada uno: es una prueba, no una regla.» · filas «Imagen B · 0,5 créditos 0,79 … Imagen E · 3 créditos 0,69» · «Imagen B · tres escenas» · «Escena 1/2/3 0,79 0,35 0,83» · «Imagen A · café 0,83» · «Imagen B · café 0,35» · «Una foto sola no mide.» · «El café: B perdió la cara.» · «Seguime: cada semana, una prueba.». Sin nombres de modelos, plataformas, «odontóloga», «clínica», «paciente», «consultorio», «resultados», «garantiz». «Onia» solo en el rótulo (marca propia). Pie: idéntico al del guion y a `pie.txt` (83 palabras), sin prohibidas. Los problemas son de las **fotos** (H1, H2), no del texto |
| 6 | Zona segura (medida sobre cuadros, independiente del DOM) | Tarjetas y pastillas y 1235-1470 (≤ 1490); datos y 1210-1290 y sellos y 1115-1195, todos bajo el mentón + 40 (mentón máx. B = 836); nada sobre y = 292 (rótulo de las placas, 12 px bajo la línea de 280); nada en x > 1000 bajo y = 1000 (la miniatura F llega a x≈988); textos ≥ 34 px. En IG: arriba ~280 px y abajo ~380-430 px: nada clave queda tapado. Las pastillas y sellos **sí cubren las manos/dedos** de la foto (cuadros 468, 588, 828, 948), no la cara |
| 7 | Tiempos | Todas las tarjetas ≥ 0,35 s/palabra + 0,3 s (c12, la más justa en lectura real: 2,28 s para 2,05 s necesarios; rótulo de IA: 2,54 s para 2,40 s). Estructura: gancho 0-6 s, desarrollo 6-47,5 s, 2 lecciones 42-53 s, cierre 53-57 s con **un solo CTA**. Dura 57,000 s. Deja algo aprendido (con H4 incompleto) |
| 8 | ffprobe del final | H.264 High L5.0 1080x1920 yuv420p bt709, 24 fps (1368 cuadros), 57,000 s, 9,64 Mbps; AAC LC 48 kHz estéreo 57,000 s, −91 dB; `ftyp, moov, free, mdat` (faststart). Copia de entrega: mismos 1080x1920/24 fps/1368 cuadros/57,000 s, 1,93 Mbps, audio igual |
| 8 | Cuadros congelados | YDIF por cuadro (`signalstats`): las rachas de diferencia 0 caen **solo** en tramos estáticos previstos de las placas (6,04-6,25 · tramos entre animaciones de la regla de 7,46 a 11,75 s · 42,04-42,5 · 45,25-47,25 · tramos de la lección 2 de 47,54 a 52,75 s; el más largo, 2,04 s, en la placa de la lección 1). **Ningún cuadro duplicado en las escenas de foto** (el empuje lento lo evita) |
| 8 | Copia de entrega | PSNR 47,17 dB (y 46,0 · u 51,4 · v 51,2), mín. 43,21 dB en el cuadro 403; SSIM 0,9915. 2x sin banding en la placa oscura (cuadro 250) |
| 8 | SHA-256 del README de entrega | **Coincide** para g1, g3, g2 y g4 (`20b2f943d6e3be17e9b367586571d7eac71b96ed59402cf8688af1165f085259` para g4). El README de G4 no trae SHA (N8) |
| 8 | Portada `qa/portada-0.6s.jpg` | 1080x1920, PSNR 40,6 dB contra el cuadro 14 del final: es del final |
| 9 | Git | `git status` limpio; `videos/lucia-g4/*` (menos `assets/*.jpg`, `assets/*.mp4`, `fonts`, `vendor`, `refs-orig`, `out/`, `renders/`, `node_modules/`) está tracked; `lucia-entrega/g4-final-1080x1920.mp4` está tracked; ninguna foto de origen está ignorada. README tiene sección «Reproducir» completa (ver N9 por lo que falta) |

## No verificado (lo digo de frente)

1. **No re-medí caras** (ArcFace/SCRFD): no se puede instalar nada. Usé `qa/face-gate.txt` y `qa/face-gate-final.txt` tal cual, y verifiqué a mano que las cifras en pantalla coincidan con PROCEDENCIA.
2. **No re-rendericé** (necesita `npx hyperframes`, que baja paquetes): no pude comprobar que `index.html` committed sea bit a bit el que produjo el final (N8b). Sí comprobé que cada cuadro mirado coincide con el DOM y el plan.
3. **No vi el video en Instagram ni en un teléfono**: las zonas tapadas por la UI se simularon con los márgenes de la regla (arriba 280, abajo 1490, derecha 80).
4. **H1 y H2 se identificaron sobre recortes ampliados del cuadro comprimido del final** (2x y 6x), no sobre los JPG originales de 1080-1440 px; la identificación del sillón dental es fiable (forma, brazo con pantalla, dos sillones); la del logo de monitor es probable (aro con «E», dos guiones), no certera.
5. **No hice ningún request de red**: no sé si las URL de CloudFront de las 8 referencias siguen vivas hoy (N9).
6. **No pude comprobar** si las 8 referencias de medición se solapan con las imágenes de referencia que recibió cada motor al generar (si coinciden, parte del «parecido» mediría copia y no identidad). Es de método, no del video, pero cambia cómo se lee «Se mide contra 8 fotos suyas».

## Orden sugerido para la 2da pasada

1. H1 y H2 (difuminar fondos de C y E; 0 créditos, 1 sola corrida de ffmpeg + `build.mjs`).
2. H4 y H6 (cambian guion: decidir con la madre: fila de A, frase de la lección 1).
3. H5 (decidir con la madre el orden del gancho).
4. H3 y H7 (nota con ±0,03 y más grande; D/E/F con el mismo trato o con medición sobre el archivo mostrado).
5. N7-N9 (CRF 18, SHA del master, versionar las 8 caras de la regla).
