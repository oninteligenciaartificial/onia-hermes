# G5 · Revisión independiente 1 (9-oct-2026)

Revisor: el mismo que revisó G4 (solo lectura; único archivo creado: este informe). Sin commit, sin créditos, sin instalar, sin publicar.
Se revisó el **FINAL** `videos/lucia-g5/out/g5-final-1080x1920.mp4` (57,5 s, SHA-256 `b9b5fb2a7e938ca4619b068bac74ab989fd3b3ce61165392592b830987fcdd28`) y la copia `videos/lucia-entrega/g5-final-1080x1920.mp4` (SHA-256 `c0138e870bd962adf136b351c529a4862eb09f4deffb926bccf916c5eb2c519e`), no el preview.
Cuadros extraídos con `ffmpeg -i out/g5-final-1080x1920.mp4 -vf "select=eq(n\,N)" -vsync 0 -frames:v 1 f.png` (24 fps) y **mirados** a 1080x1920: 0, 2, 14, 36, 60, 72, 80, 96, 110, 140, 144, 190, 230, 260, 276, 300, 340, 400, 450, 480, 504, 530, 575, 600, 640, 648, 672, 710, 720, 750, 790, 820, 850, 880, 888, 920, 950, 990, 1020, 1032, 1060, 1090, 1120, 1140, 1170, 1200, 1230, 1250, 1280, 1284, 1320, 1379 (los que no cito abajo los miré en hojas de contacto) y los 7 cuadros de cada uno de los 10 empujes (270-276, 499-504, 571-576, 643-648, 715-720, 883-888, 1027-1032, 1135-1140, 1279-1284, 139-144). Ampliados 3x-4x: las 8 referencias, el monitor de F, el monitor del café B, el cuadro del Motor 5 (incluida la parte baja), el cuadro del Motor 4 (letrero y fachada), y el cuadro crudo del Motor 4 SIN difuminar (de `videos/lucia-g2/assets/m4.mp4`, solo para juzgar el riesgo).
Las capturas viven en el scratchpad de la sesión (no se versionan); el comando de arriba regenera cualquiera.

**Severidad.** BLOQUEA = no se publica con esto. ARREGLAR = se corrige antes de publicar si la madre está de acuerdo. NOTA = decisión o mejora, no frena.

## Veredicto

- **¿Se puede mostrar a la madre tal cual?** **SÍ.** No hay BLOQUEA: todos los fondos están limpios (ningún consultorio, equipo, logo ni letrero legible), no hay marca de tercero ni palabra de profesión, la IA se declara desde el cuadro 0 a 40 px, las cifras coinciden con PROCEDENCIA, el pie es idéntico al guion y la técnica pasa.
- **¿Se puede publicar si ella valida el guion?** **SÍ, pero conviene que antes decida los 5 ARREGLAR** (G5-1 a G5-5). Ninguno es un engaño de cifras; son frases que dicen más de lo que el video demuestra («se parece poco», «poco confiable») o que la gente no va a entender («orden de magnitud», el letrero difuminado sin aviso). Cada uno se cambia en una línea de `plan.json` y se vuelve a renderizar (0 cr).
- **¿Es honesto el tratamiento del ruido y de «baja sola»?** Sí: el video **no dice ni sugiere que el número baje con la cara chica**. Lo que queda por pulir es que «poco confiable» es una regla del gate y no algo que el video demuestre (G5-2), y que la nota del ±0,03 junto a dos puntos que difieren 0,02 puede leerse como «difieren 0,03» (G5-3).

---

## BLOQUEA

Ninguno.

---

## ARREGLAR

### G5-1 · «0,66: se parece poco.» dice más de lo que muestra el propio video
- **Evidencia:** cuadros 575-640 (24,0-26,9 s): foto F con caja coral, pastilla «Imagen F · parecido 0,66» y tarjeta «0,66: se parece poco.» (acento coral). Lo que mide el gate **sobre el cuadro que ve el espectador** (`qa/face-gate-final.txt`) es **0,676-0,679**, y sobre la fuente al mismo zoom **0,690-0,697**; el 0,66 en pantalla es el del PNG original (0,658). Sobre la fuente a ese zoom F queda a 0,003-0,010 del piso, es decir dentro del ±0,03 que 15 s después el mismo video declara «ruido» (razón 2). Además, a mi ojo la cara de F se parece a la de A (cuadros 600 y 530).
- **Por qué importa:** el espectador ve dos fotos que se parecen, oye «se parece poco», y a los 43 s oye que 0,03 no cuenta. El README (línea 84-85) ya lo sospechaba y lo dejó. El «0,66» difiere 0,03-0,04 de la fuente al mismo zoom (el README, línea 42, dice «ningún número difiere en 0,03 o más», cierto solo contra el cuadro recomprimido, y lo admite en el paréntesis).
- **Corrección:** `plan.json → c10`: «0,66: bajo el piso.» (3 palabras, ya propuesto por el editor) o «0,66: dudosa.»; opcional: pastilla «0,66 (±0,03)». Mismo cambio en cualquier otro texto que repita «se parece poco».

### G5-2 · «Cara chica: poco confiable.» es una regla, no una medición que el video muestre; el propio control dice que el número casi no se mueve
- **Evidencia:** cuadros 790-880 (32,5-37 s): cuadro del Motor 5 con cara de «89 px» en coral, lupa y la tarjeta «Cara chica: poco confiable.» con la nota «Bajo 200 px, lo reviso a ojo.» (cuadro 850). En pantalla no aparece el número de ese cuadro. Lo medido (`qa/cara-chica-control.txt`, `qa/cara-chica-m5.txt`): la misma foto reducida a 60 px baja solo 0,004-0,010 en 5 de 6 fotos, y ese cuadro da 0,798 (por encima del piso). La única foto que se mueve más es F (±0,02), que no se muestra en esa escena.
- **Por qué importa:** la tarjeta afirma una falta de fiabilidad («poco confiable») que el video no enseña y que el control del editor no sostiene salvo en F. Se repite en el pie («con una cara chica el número es poco confiable»). No es «baja sola» (corregido), pero es la misma clase de frase: sale de una regla del gate (< 200 px) presentada como si fuera un hallazgo. La nota de abajo («lo reviso a ojo») sí es exacta.
- **Corrección:** decir lo que es: `plan.json → c13`: «Cara chica: lo reviso a ojo.» (6 palabras) y en el pie «con una cara chica miro la imagen entera, no solo el número». Si la madre prefiere dejar «poco confiable», que la nota diga «Bajo 200 px el programa avisa: lo reviso a ojo.» y que se agregue el número de ese cuadro (0,80) para que se vea que no cayó.

### G5-3 · La razón 2 se explica con jerga mal usada y con una cifra que el espectador puede leer mal
- **Evidencia:** cuadros 950-1090 (39,6-45 s) y lección 1170-1230 (48,7-51,3 s).
  - La nota «±0,03: solo un orden de magnitud.» (44 px, cuadro 1020). «Orden de magnitud» es potencia de diez; ±0,03 no lo es. Quien no sabe matemáticas no lo entiende; quien sí, lo lee como error.
  - La tarjeta dice «Una diferencia de 0,03 no cuenta» mientras los dos puntos de la escala (0,77 y 0,79) difieren **0,02** (0,014 sin redondear), y la miniatura de la lección rotula esos mismos dos puntos como **«Diferencia de 0,03»** (cuadro 1200). Se lee «estos dos difieren 0,03».
  - «Mismo clip, dos momentos.» no dice cuál clip ni por qué el espectador debe creer que son el mismo.
- **Por qué importa:** es la razón más abstracta del video y la que más se pierde. Es honesta en el fondo, pero el formato (dos puntos dentro de una banda) invita a leer una diferencia exacta de 0,03.
- **Corrección:** `plan.json → r2.nota`: «±0,03: una idea aproximada, no exacta.»; `c14`: «Menos de 0,03 no cuenta.» (5 palabras); `lec[1]`: «Diferencia chica (±0,03)». Para anclar la banda con el dato más limpio, usar el rango del propio clip (ver G5-N2).

### G5-4 · El letrero inventado está difuminado, el aro marca una mancha y nada dice que se difuminó
- **Evidencia:** cuadros 1020-1230. En el cuadro 1090 (45 s) se ve el cuadro del Motor 4 con la torre; el aro coral marca una **mancha clara, ilegible** (verificada a 4x: no se lee ninguna letra ni forma de marca) y la pastilla dice «letrero inventado». Hay una **segunda mancha clara** más débil en el borde superior de la torre (≈ x 385-425, y 360-380 del lienzo) fuera del aro. El cuadro crudo sin difuminar (que miré solo para juzgar el riesgo) trae unas letras blancas sueltas tipo «DVESS/DMSS» sin forma de marca conocida; el difuminado es prudente y no encuentro marca real detrás.
- **Por qué importa:** (1) la prueba de que «el programa no ve letreros» es un letrero que el espectador no puede ver: quien mira solo ve un borrón y puede pensar que el borrón es del video original; (2) el editor retocó la imagen sin avisarlo en pantalla (el mismo patrón de G4 R2-4); (3) G2 decidió lo contrario (publicar el letrero legible); si la madre cree que hay riesgo, G2 también lo tiene.
- **Corrección:** `plan.json → r3`: etiqueta «letrero inventado (difuminado)»; dos aros o un aro que abarque las dos manchas; y que la madre decida si G2 también lo difumina.

### G5-5 · La escala ampliada 0,70-0,90 no dice que es una ampliación
- **Evidencia:** cuadros 920-1090 (38,3-45 s). La escala empieza en 0,70 (el piso) pero no lo dice ni lleva la marca «mi piso»; toda la barra va en verde, que en el Paso 2 significaba «sobre el piso»; no hay rótulo «zoom». Alguien que no recuerda el Paso 2 ve una escala nueva de 0,70 a 0,90 (¿por qué empieza ahí?).
- **Corrección:** un rótulo chico «zoom de 0,70 a 0,90» sobre la escala (44 px, mismo estilo que la nota) o la marca «mi piso» en el extremo izquierdo.

---

## NOTA

- **G5-N1 · El gancho no dice por qué importa.** Cuadros 14-72: «¿Cómo sé que esta es ella?» a 0,083-3,0 s, legible a opacidad plena desde 1,4 s; pasa los 3 s y es una pregunta, pero «esta» no dice qué (¿la foto? ¿ella?) y no hay apuesta. Alternativa de 6 palabras: «¿Cómo sé que sigue siendo ella?» (implica que una imagen de IA puede dejar de serlo). Con «Con un número. Y con ojo.» a 3,0 s la promesa queda clara; funciona.
- **G5-N2 · El par «0,79 → 0,77» es la prueba más débil disponible del ±0,03.** `PROCEDENCIA` línea 97, Motor 6: 0,785 · 0,772 · 0,787 · 0,799 · 0,790 · 0,771; el propio clip va de **0,771 a 0,799 = 0,028**, casi exactamente la banda, y la diferencia mayor entre un clip y su remapeo de labios al mismo instante es 0,024 (sync_so: 0,806/0,811, 0,764/0,757, 0,713/0,714, 0,748/0,724, 0,751/0,747, 0,753/0,768; yo calculé 0,024 = |0,748-0,724|). Además, en el Motor 6 la cara crece de 117 a 240 px (G2 README, línea 55): «dos momentos» mezcla ruido con cambio de plano. Mostrar 0,77 y 0,80 (extremos del clip) sostiene mejor el ±0,03 y no cambia el mensaje.
- **G5-N3 · «Era falso» sobreestima en README y skill.** `qa/cara-chica-control.txt` dice «una caída suave y consistente» (−0,004 a −0,010 a 60 px en 5 de 6) y el Motor 5 sube 0,033 mientras la cara crece de 89 a 169 px: la dirección sí es «más chica, un poco más bajo». Lo falso era que **baja de forma apreciable**. Reescribir `SKILL.md` línea 338 y el aviso ⚠️ 1 del README como «baja poco (≈0,01), menos que el ruido».
- **G5-N4 · F y B del café llevan el mismo color coral** (cajas y acentos, cuadros 600 y 672): mezcla «bajo el piso» con «otra persona». Un coral más claro para F, o neutro (como D en G4).
- **G5-N5 · Veredictos del programa.** «0,81: es ella.» y «0,35: otra persona.» los dice Lucía, no el programa; se entiende por el Paso 2 («Piso, 0,70. Lo elegí yo.»), y la nota «El programa solo compara caras» evita el «reconoce». Un espectador apurado puede igual leerlo como que el programa decide. Ya mitigado; nada que cambiar si se aplica G5-1.
- **G5-N6 · «Lo elegí yo» en voz de un personaje IA.** El piso lo fijó la sesión (PROCEDENCIA: «gate 0,70»). Mismo registro que G1-G4; que la madre confirme que le basta.
- **G5-N7 · Referencias.** Cuadro 260 y recorte a 3x: la ref 2 muestra de fondo a dos personas desconocidas (imagen de IA) y la ref 4 una moto sin patente legible; la ref 3, un portátil sin logo. Nada legible. Ya estaban en G4.
- **G5-N8 · Tiempos justos.** Pastilla «Imagen B · café · parecido 0,35» 2,21 s para 2,05 s necesarios; «±0,03: solo un orden de magnitud.» 2,79 s para 2,40 s; la nota del Paso 3 holgada (3,38 s para 2,75 s). Cumplen la regla; el espectador lee ~17 tarjetas y 26 textos en 57 s.
- **G5-N9 · Tramos estáticos.** Cero cuadros congelados en las fotos; las rachas de diferencia 0 caen en placas: la más larga 1,83 s (34,96-36,79 s, razón 1). Hueco máximo entre eventos 2,5 s (el CTA). El CTA es **uno solo** («Seguime: cada semana, una prueba.», 53,5-57,5 s, 4,08 s legible).
- **G5-N10 · Documentos.** `videos/lucia-g5/README.md` (aviso ⚠️ 2 y A13) y `videos/lucia-entrega/README.md` (fila 5) dicen que «el pie NO es el del guion del repo»: **ya es el mismo** (verificado: el bloque «Pie» de `hermes-content/docs/cola/lucia-diario/guiones/G5-como-se-mide-una-cara.md` coincide con `pie.txt` y con `guion-corregido.md`). Quitar esa advertencia, que ya es falsa. El título de la entrega («G1, G3, G2, G4 y los carruseles…») no nombra G5. `lucia-entrega/README.md` línea 83 sigue diciendo «Motor 1 a 6» para los videos (G5 usa «Imagen A a F» y «Motor» solo en el README).
- **G5-N11 · Copia de entrega.** PSNR contra el master **50,62 dB** (ffmpeg global; 53,06 promediando cuadros), SSIM 0,9963, **mínimo 43,95 dB en el cuadro 513**; 62 de 1380 cuadros bajo 45 dB (3,0-3,1 s, 5,6-5,8 s y 21,0-23,8 s, la foto A). Imperceptible; coincide con lo que reporta el editor. Con `-crf 16` bajaría de 45 en pocos o ninguno.

---

## Verificado (para que no se rehaga)

### 1. Fondos, marcas y letreros: cada foto y cada cuadro

| Qué | Cuadros | Resultado |
|---|---|---|
| Foto A (torre de vidrio, ciudad, mesón) | 0-140, 530 | Sin letras, logos ni equipo. Ya revisada en G4 |
| Foto F (monitor negro, ventana, mármol) | 575-640 (2x, 4x) | Monitor negro solo con bisel y soporte, **sin logo**; horizonte sin texto |
| Foto B del café (ventanal, monitor al fondo derecha) | 672-715 (3x) | Monitor negro con un botón gris, **sin logo**, sin texto |
| Cierre K4·5 (torre curva, monitor, mostrador) | 1284, 1379 | Sin letras; igual a G4 |
| Cuadro del Motor 5 (89 px) | 720-880 (2x y 4x en la parte baja) | Solo cielo, ciudad aérea, un teléfono con funda celeste **sin logo**; ninguna tarjeta de mesa ni letra (la que menciona el README queda fuera del recorte) |
| Cuadro del Motor 4 (letrero) | 1020-1230 (4x) | Letrero difuminado: mancha clara **ilegible**; segunda mancha tenue en el borde del techo. Ver G5-4. Fachada y vidrio sin otro texto |
| Las 8 referencias | 190, 260, 340, 480 (3x) | Sin texto ni logos legibles (G5-N7) |
| Consultorio dental / equipo / pantalla de consultorio | todos | **Ninguno** en ningún cuadro |
| Texto en pantalla (README + `qa/elementos-texto.json` + `qa/grep-prohibidas.txt` + DOM) | todos | Sin nombres de modelos ni plataformas, sin «odontóloga», «clínica», «paciente», «consultorio», «resultados», «garantiz», «reconoce». «Onia» solo en el rótulo (marca propia); «@oniahq» en el pie. El medidor no se nombra («un programa») |

### 2. Afirmaciones contra los datos (PROCEDENCIA línea 97, `qa/face-gate*.txt`, `qa/cara-chica-*.txt`)

| Frase en pantalla | Dato | Veredicto |
|---|---|---|
| «0,81: es ella.» (A) | 0,806 (JPG de 1440 px); cuadro final 0,794-0,800 | **Sostenida** |
| «0,66: se parece poco.» (F) | PNG 0,658; cuadro 0,676-0,679; fuente al zoom 0,690-0,697 | **Exagera** (G5-1) |
| «0,35: otra persona.» (B café) | 0,350 (PROCEDENCIA: «perdió la cara: otra persona, estilo caricatura»); cuadro 0,361-0,366 | **Sostenida**; rótulo «Imagen B · café» lo separa de Lucía |
| «Piso, 0,70. Lo elegí yo.» / «mi piso · 0,70» | gate 0,70 fijado por la sesión | **Sostenida** (es decisión, no frontera) |
| «Cara chica: poco confiable.» + «89 px» | 89 px medidos con SCRFD; regla del gate < 200 px; control: −0,004 a −0,010 a 60 px (5 de 6) | **No exagera el número** (no dice que baje), pero afirma una falta de fiabilidad no demostrada (G5-2) |
| «Bajo 200 px, lo reviso a ojo.» | regla del gate | **Sostenida** |
| «Una diferencia de 0,03 no cuenta.» + 0,77 / 0,79 | M6: 0,785 → 0,771 (diferencia 0,014; en pantalla 0,02); sync_so ≤ 0,024 | **Sostenida en el fondo**, mal ilustrada (G5-3, G5-N2) |
| «±0,03: solo un orden de magnitud.» | el propio README: no es un intervalo de confianza | **Honesta pero jerga mal usada** (G5-3) |
| «No ve letreros inventados.» + «parecido 0,80» | M4 a 4,0 s: 0,796 (PROCEDENCIA, muestra de 4 s); «invento un letrero en la torre» | **Sostenida**; el número y el segundo coinciden con PROCEDENCIA |
| «El programa solo compara caras.» | el medidor es ArcFace contra 8 referencias | **Sostenida**; no se dice «reconoce» |
| «Ocho fotos oficiales.» | el manifiesto trae 8 | **Sostenida** |
| ¿El video dice o sugiere que el número BAJA con la cara chica? | — | **No**. No aparece «baja», y el cuadro de 89 px se muestra sin número |
| Cifras 0,81 / 0,66 / 0,35 / 0,80 / 0,79 / 0,77 contra la fuente | A 0,806→0,81 · F 0,658→0,66 · B 0,350→0,35 · M4 0,796→0,80 · M6 0,785→0,79 y 0,771→0,77 | **Coinciden** (redondeo 2 decimales media hacia arriba) |
| Guion corregido contra `plan.json → agregados_al_guion` (A1-A17) | G1-G8 del guion y A1-A17 | **Coinciden**: tarjetas ≤ 6 palabras, «oficial» en vez de «de verdad», «poco confiable» en vez de «baja sola», 57,5 s, cierre K4·5 |

### 3. ¿Se entiende en 57,5 s sin saber qué es un puntaje de cara?
- **Sí, hasta el segundo 30.** El orden «ocho fotos oficiales → un programa las compara → un número de 0 a 1 → idéntica es 1 → piso 0,70, lo elegí yo» es claro; los tres ejemplos con su caja de cara (verde y coral) dan el ancla visual. El gancho (0,1-3 s) es una pregunta y a los 3 s trae la promesa «Con un número. Y con ojo.».
- **La razón 1 se entiende; las razones 2 y 3 se pierden** por jerga («orden de magnitud», «programa» sin explicar qué hace) y por abstracción (una banda sobre una escala; un letrero que no se ve). La lección «Por eso, mirá la imagen entera» deja una enseñanza concreta y accionable.
- **Jerga que se pierde:** «orden de magnitud» (G5-3), «piso» (se explica con «Lo elegí yo» y la marca; en G4 ya se usó), «px».
- **Un solo CTA:** sí. **Estructura:** gancho 0-6 s · pasos 1-2 (6-21 s) · ejemplos (21-30 s) · razones (30-47,5 s) · lección (47,5-53,5 s) · cierre (53,5-57,5 s).

### 4. Nombre/IA y pie
- **Cuadro 0 (y 2, 14, 36, 60, 72):** rótulo «Lucía Antelo · personaje IA de Onia» en píldora oscura, **40 px**, x 195-885, y 720-800; mentón en 659 (margen 61 px); **no tapa la cara** ni el teléfono (que arranca en 805). Visible de 0 a 3,13 s (pide 2,40).
- **Pie:** `pie.txt` es idéntico al bloque «Pie» del guion del repo (verificado con `diff`; 91 palabras). Dice «personaje hecho con IA por @oniahq» y no tiene marcas de terceros, profesión ni promesas. Un solo CTA («Seguime»). Hashtags `#inteligenciaartificial #ia #santacruz #bolivia`.

### 5. Zona segura (mi simulación de Instagram: arriba ~280 px, abajo ~380-430 px, rail derecho desde y≈1100)
- Nada clave por encima de y = 300 (la imagen del Motor 5 empieza en y 320, la del Motor 4 en y 300, las filas de la lección en y 340; la banda «±0,03» de la razón 2 queda en y 570-610). Nada clave bajo y = 1470. Las tarjetas terminan en 1470. La escala de la razón 2 llega a x = 1025 en y ≈ 772 (a 55 px del borde, fuera de la zona del rail). Textos mínimos de 38 px (el rótulo, de 40).

### 6. Técnica
| Chequeo | Resultado |
|---|---|
| ffprobe master | H.264 High, **1080x1920**, yuv420p, bt709, **24 fps**, **57,500 s**, 1380 cuadros, 5,27 Mbps, 37,9 MB; AAC LC 48 kHz estéreo 57,500 s, **-91,0 dB (silencio)** |
| ffprobe copia | 1080x1920, 24 fps, 57,500 s, 1380 cuadros, 1,81 Mbps, 13,1 MB; mismo AAC en silencio (-91,0 dB) |
| SHA-256 contra README | `videos/lucia-g5/README.md` líneas 23-24: master `b9b5fb2a…dd28` y copia `c0138e87…519e` **coinciden** con los archivos; `videos/lucia-entrega/README.md` línea 21: `c0138e87…519e` **coincide**; los de g1-g4 también |
| Copia contra master | PSNR 50,62 dB (y 49,51 · u 54,49 · v 54,35), mín. 43,95 dB; SSIM 0,9963; 62 cuadros bajo 45 dB (G5-N11) |
| Preview 360p | 360x640, 24 fps, 57,5 s, 1380 cuadros; tracked en `qa/` |
| `index.html` | md5 `5e14c60cd7b2e627ac50848581ff5930` = el que registra `qa/sha-master.txt`; mtime 16:31 < render 16:34 |
| `hyperframes check` | 0 errores, 33 avisos de estilo, 4 «info» de layout, contraste 24/24 AA |
| Cuadros congelados / saltos | Cero cuadros planos; saltos de luma grandes **solo** en los empujes (cuadros 140-142, 501-503, 572-575, 644-647, 716-718, 1137, 1281-1283); los otros 3 empujes son placa→placa (menos luma). Los 10 empujes miran bien a 7 cuadros: rígidos, sin tiras de fondo |
| `git` | `git status` limpio. **Tracked y no ignorados:** `assets-fijos/` (ref1-8, fr-m4.jpg, fr-m5.jpg, vendor/gsap.min.js, ORIGEN.md), `plan.json`, `index.html`, `pie.txt`, `guion-corregido.md`, `scripts/*` (incl. `cara-chica.py`, `extraer-cuadros.sh`), `qa/*` (31 archivos, con `g5-preview-360p.mp4`, `cara-chica-control.txt`, `cara-chica-m5.txt`), `lucia-entrega/g5-final-1080x1920.mp4`. `git check-ignore`: solo `out/` (master) y `assets/`/`renders/` (se regeneran con `node scripts/build.mjs`). El master no está en git: lo cubre el SHA y la copia |

---

## No verificado (lo digo de frente)

1. **No re-medí caras** (ArcFace/SCRFD): no se puede instalar. Usé `qa/face-gate*.txt`, `qa/cara-chica-*.txt` y verifiqué a mano que cada cifra de pantalla coincida con PROCEDENCIA.
2. **No re-rendericé** (hyperframes baja paquetes). Sí comprobé que el md5 de `index.html` coincide con el que registra `qa/sha-master.txt`.
3. **No vi el video en un teléfono ni en la interfaz real de Instagram:** las zonas tapadas son una simulación con los márgenes de la regla.
4. **La limpieza de fondos la juzgo sobre cuadros comprimidos ampliados 2x-4x**, no sobre los JPG originales; el cuadro del Motor 5 es de 720p nativos. No descarto residuos que un análisis forense encontraría.
5. **No pude comprobar el letrero difuminado en un teléfono**; a 1080 px la mancha es ilegible, pero en una pantalla pequeña puede verse como una forma clara aún menos definida.
6. **No verifiqué contra `job_display`** que los clips de `videos/lucia-g2/assets/m4.mp4` y `m5.mp4` sean los jobs de PROCEDENCIA (no se llama a Higgsfield); me apoyé en el README del editor (SHA-256 coincidentes) y en que el cuadro 96 del Motor 4 da la muestra de 4 s.
7. **No pude comprobar si las 8 referencias de medición se solapan con las de entrada de cada motor** (pendiente heredado de G4; es de método y no cambia el video).
8. **No hice peticiones de red** (no sé si las URL de CloudFront de `assets-fijos/ORIGEN.md` siguen vivas; ya no hacen falta).

## Orden sugerido para la 2da pasada (0 cr, un render de 2 min 30 s)
1. G5-1 y G5-2 (una línea cada uno en `plan.json`, más el pie si cambia G5-2: hay que pasarlo también al guion del repo).
2. G5-3 y G5-5 (texto de la razón 2 y rótulo «zoom»).
3. G5-4 (etiqueta «difuminado»; la madre decide si G2 también).
4. G5-N2/N3/N10 (documentos y evidencia), después N1/N4 si la madre quiere.
