# G5 · Revisión independiente 2 (9-oct-2026, corta: solo lo nuevo)

Revisor: el mismo de la revisión 1 (solo lectura; único archivo creado: este informe). Sin commit, créditos, instalación ni publicación.
Se revisó el FINAL nuevo `videos/lucia-g5/out/g5-final-1080x1920.mp4` (57,5 s, SHA-256 `d280cd85a509111dfd6e3f4d56a8003cf9c0e03b73bcc4fc3a5caa97d0dc2468`) y la copia `videos/lucia-entrega/g5-final-1080x1920.mp4` (`5e8d59fbf5ef94cefbf986fc41561f2085f593b059aef87f5d2b033727fe8c91`), no el preview.
Cuadros extraídos con `ffmpeg -vf "select=eq(n\,N)"` y **mirados** a 1080x1920: 0, 14, 36, 60, 72, 575, 600, 790, 850, 900, 936, 960, 990, 1020, 1060, 1085, 1100, 1130, 1160, 1190, 1200, 1230, 1250, 1290, 1320, 1379, más recortes 2x de la llamada del letrero y hojas de los empujes de 37,0 · 43,0 · 48,5 · 53,5 (cuadros 715-720, 883-888, 1027-1032, 1159-1164, 1279-1284).

## Veredicto

- **BLOQUEA: nada.**
- **Mostrar a la madre tal cual: SÍ.** **Publicar tras su validación: SÍ**, con dos frases que conviene suavizar antes (R2-1 y R2-2, una línea de `plan.json` cada una, 0 cr, un render de ~2,5 min) o que la madre acepte explícitamente. No hay cifras mal copiadas ni nada que cambie una decisión de seguridad o de marca.

## 1. Los 5 ARREGLAR de la revisión 1

| # | Estado | Evidencia |
|---|---|---|
| G5-1 «0,66: bajo el piso.» | **CERRADO** | Cuadro 600 (25,0 s): «0,66: bajo el piso.» con acento coral. Es cierto con todas las medidas (PNG 0,658; cuadro 0,676-0,679; fuente al zoom 0,690-0,697, todas < 0,70), y ya no insinúa que la cara de F sea ajena |
| G5-2 «Cara chica: lo reviso a ojo.» | **CERRADO en la tarjeta; queda R2-2 en la nota** | Cuadro 850 (35,4 s): tarjeta nueva, 89 px, lupa. La nota pasó a «Bajo 200 px, el medidor no es fiable.» |
| G5-3 razón 2 | **CERRADO en la mecánica; queda R2-1 en la redacción** | Ver abajo |
| G5-4 letrero difuminado | **CERRADO** | Cuadros 1085-1190: aro grande (x 225-455, y 335-435) sobre la torre, que ahora **abarca las dos manchas** claras (la del letrero y la del borde del techo), más la llamada «Lo difuminé: lo inventó la IA.» (x 490-790, y 314-432). Se lee a 2x; la mancha dentro del aro **queda explicada** por la llamada. No tapa la cara (el pelo empieza en y≈430; la llamada termina en 432, se toca sin cubrir). Cae bajo la línea de 280 px de Instagram (arriba del recuadro: y 314, o sea 34 px de margen) |
| G5-5 escala | **CERRADO** | Cuadros 936-1020: «Zoom: 0,70 a 0,90» a la derecha (y 908), y la marca «mi piso · 0,70» con una línea verde en el extremo izquierdo (x 100). No se pisa con los números de la escala |

### Razón 2 contra PROCEDENCIA línea 97 (Motor 6 = `cinematic_studio_3_0_4s_720p_cc8fa519…`)
- Medidas: 0,785 · 0,772 · 0,787 · 0,799 · 0,790 · 0,771. Mínimo **0,771** (→ 0,77), máximo **0,799** (→ 0,80), rango **0,028**, promedio **0,784**. Coincide con lo que pinta el video: puntos en x = 412 y 536 (`qa/zona-segura.txt`: medido = esperado), banda ±0,03 centrada en 0,784 de 0,754 a 0,814 (x 338-602), y **las seis medidas caen dentro** (la más lejana, 0,799, a 0,015 del centro). Miniatura de la lección: «Mismo clip: 0,771-0,799». Sin cifras mal copiadas.

## 2. Honestidad

### R2-1 · ARREGLAR (baja) · «Esa variación es ruido (±0,03).» afirma más de lo que demuestra
- **Evidencia:** tarjeta c14b (cuadros 960-1020, 40,0-43,0 s) y el pie («el mismo clip varía de 0,77 a 0,80 y eso es ruido (±0,03)»). La base es **un solo clip** con rango 0,028 y una diferencia clip↔remapeo de 0,024 (sync_so, otro dato; `PROCEDENCIA`: 0,748 contra 0,724 es el máximo). En el Motor 6 la cara crece de 117 a 240 px (G2 README, línea 53) y el plano se acerca; por lo tanto parte de esa variación puede ser **cambio real de imagen y no ruido del medidor**. El video no lo dice porque no muestra el clip.
- **Por qué importa:** pasó de «una diferencia de 0,03 no cuenta» (guion) a «esa variación ES ruido»: es una afirmación causal, no una observación. Está más cerca de la verdad que la 1ra pasada (ya no usa dos puntos que difieren 0,02), pero sigue siendo la misma clase de frase que el equipo corrigió con «baja sola».
- **Corrección:** `plan.json → c14b`: «Esa variación cabe en ±0,03.» (5 palabras) o «No distingo esa variación del ruido.» (6), y en el pie «y eso cabe en el ruido (±0,03)». Mismo cambio en la miniatura si repite «ruido».

### R2-2 · ARREGLAR (baja) · «Bajo 200 px, el medidor no es fiable.» es más fuerte que la regla que lo respalda
- **Evidencia:** cuadro 850. La regla del gate dice «poco confiable» y el control de G5 (`qa/cara-chica-control.txt`) muestra que la misma foto reducida a 60 px baja solo 0,004-0,010 en 5 de 6 fotos (F oscila ±0,02); el cuadro mostrado (89 px) da 0,798. «No es fiable» es categórico y repite la objeción G5-2 en la nota, ya corregida en la tarjeta.
- **Corrección:** `plan.json → r1.nota`: «Bajo 200 px, el medidor avisa: lo reviso a ojo.» (9 palabras, ~1 s más de lectura; la ventana actual es 3,58 s y pide ~3,4 s) o «Bajo 200 px, el medidor duda: lo reviso a ojo.» (8).

### Lo que NO está mal (lo busqué)
- **El video no sugiere que el número baje con la cara chica:** el cuadro de 89 px se muestra sin número; la tarjeta dice «lo reviso a ojo», la nota habla de fiabilidad, no de caída; la lección dice «Cara chica» sin más. No aparece «baja» en ningún texto (ni en el pie).
- **«0,66: bajo el piso.»** es cierto con las tres medidas (ver G5-1). **«0,35: otra persona.»** sigue sostenida (PROCEDENCIA: «perdió la cara: otra persona, estilo caricatura») y se rotula «Imagen B · café».
- **«No ve letreros inventados.»** sigue sostenida (M4 a 4 s = 0,796, el número que se muestra es 0,80 con «parecido»). **«El programa solo compara caras.»** no dice «reconoce».
- Todo texto nuevo pasa `grep` de prohibidas (0 coincidencias; 145 tokens de pantalla y 97 palabras de pie): sin marcas de terceros, profesión ni promesas.

### R2-3 · NOTA · «lo inventó la IA»
- Lucía es un personaje hecho con IA; «la IA» en la llamada se refiere al generador del clip, pero la frase cae a 40 px dentro de un video donde el rótulo dice «personaje IA». No confunde (el aro y el difuminado lo aclaran), pero «lo inventó el generador de imagen» o «lo inventó el motor» quitaría la ambigüedad (4-5 palabras; la llamada tiene 4,29 s para 2,40 necesarios).

## 3. Gancho, tiempos, zona segura, vacíos y empujes
- **Gancho** (cuadros 36, 60, 72): «¿Cómo sé que sigue siendo ella?» a opacidad plena desde ~1,4 s, 6 palabras, ventana de 2,79 s para 2,40 necesarios. Funciona mejor que «esta es ella»: pone la apuesta. A 3,0 s entra «Con un número. Y con ojo.» y la caja de cara a 3,3 s. Un solo CTA (cuadro 1379: «Seguime: cada semana, una prueba.», 4,08 s legibles).
- **Cuadro 0:** rótulo «Lucía Antelo · personaje IA de Onia» a 40 px, y 720-800, mentón en 659, sin tapar la cara. **Último cuadro (1379):** K4·5, Lucía mira a cámara y sonríe, tarjeta bajo la cara (y 1235-1470).
- **Lecturas** (`qa/ventanas-de-lectura.txt`, medidas en el DOM): todo ≥ regla. Las más justas: c14b 2,83 s para 2,05, llamada 4,29 para 2,40, nota 2 de la razón 1 3,58 para 3,10, `±0,03` 2,54 para 0,65. Paso 3 de 30,0 a 48,5 s y lección de 48,5 a 53,5 s: cada elemento tiene su ventana.
- **Zona segura** (`qa/zona-segura.txt`, 1426 cajas): nada fuera de y 280-1490, nada en x > 1000 bajo y 1000, textos ≥ 38 px (tamaños 38-66; la escala 0,75-0,90 llega a x = 1025, ver nota de la rev. 1: fuera del rail). Puntos, banda, corchete y marcas de la escala a ±1,5 px de su dato.
- **Vacíos:** cero cuadros planos; cero cuadros congelados dentro de fotos; la racha estática más larga es de **1,83 s** (34,96-36,79 s, la razón 1), todas en placas. Hueco máximo entre eventos 2,50 s (el CTA).
- **Empujes tocados** (37,0 · 43,0 · 48,5 · 53,5): rígidos, sin tira de fondo ni cuadro vacío; saltos de luma grandes solo en los empujes (cuadros 140-142, 501-503, 572-575, 644-647, 716-718, 1161, 1281-1283). Las tarjetas viajan con la placa.

## 4. Técnica

| Chequeo | Resultado |
|---|---|
| ffprobe master | H.264 High 1080x1920, yuv420p, bt709, **24 fps**, **57,500 s**, 1380 cuadros, 5,25 Mbps, 37,8 MB; AAC LC 48 kHz estéreo 57,500 s, **-91,0 dB (silencio)** |
| ffprobe copia | 1080x1920, 24 fps, 57,500 s, 1380 cuadros, 1,81 Mbps, 13,0 MB; mismo AAC en silencio |
| SHA-256 vs README | `videos/lucia-g5/README.md`: master `d280cd85…2468` y copia `5e8d59fb…8c91` **coinciden** con los archivos; `videos/lucia-entrega/README.md` línea 21: `5e8d59fb…8c91` **coincide**; título de la entrega ahora nombra a G5 |
| PSNR copia ↔ master | 50,64 dB (y 49,53 · u 54,48 · v 54,32), mín. **43,96 dB** (cuadro 513); SSIM 0,9963; 62 cuadros bajo 45 dB, todos en 3,0-3,1 s, 5,6-5,8 s y 21,0-23,9 s (la foto A). Coincide con lo que reporta el editor (43,96 dB); imperceptible |
| `pie.txt` | **Idéntico** al bloque «Pie» del guion del repo (`diff` limpio; 97 palabras) |
| `index.html` | md5 `431d65777f252e6cfdb164807a997f8a` = el que registra `qa/sha-master.txt` |
| `hyperframes check` | 0 errores, 34 avisos de estilo, 4 «info» de layout, contraste 23/23 AA |
| git | `git status` limpio; `assets-fijos/` (12 archivos) tracked y no ignorado (`check-ignore` sin salida); 33 archivos en `qa/` tracked; el master queda fuera de git (ignorado) y cubierto por SHA y por la copia de entrega |

## No verificado (lo digo de frente)
1. **No re-medí caras** (ArcFace/SCRFD: no se puede instalar); usé `qa/face-gate*.txt` y `qa/cara-chica-*.txt` tal cual. Las cifras de pantalla las contrasté con PROCEDENCIA a mano.
2. **No re-rendericé** (hyperframes baja paquetes). Sí comprobé que el md5 de `index.html` coincide con el registrado.
3. **No vi el video en un teléfono ni en la interfaz real de Instagram**: la zona segura es una simulación con los márgenes de la regla (arriba ~280 px; la llamada del letrero queda a 34 px de la línea).
4. **No verifiqué si el rango 0,771-0,799 del Motor 6 es ruido del medidor o cambio real de la imagen** (R2-1): requeriría repetir el medidor sobre el mismo cuadro con variaciones de codificación, que no hice.
5. **Fondos:** no repetí la revisión completa de la 1ra ronda (fotos A, F, B, K4·5, referencias, Motor 5): los cuadros nuevos que miré (llamada del letrero y la escala) no traen elementos de fondo nuevos. El letrero difuminado y su aro, a 2x, siguen ilegibles.
6. **No comprobé contra `job_display`** que los clips de G2 sean los jobs de PROCEDENCIA ni si las 8 referencias de medición se solapan con las de entrada de cada motor (pendientes heredados).
