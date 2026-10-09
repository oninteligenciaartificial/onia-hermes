# Lucía · G4 «Seis motores de imagen, una cara: ¿cuál la conserva?» (59,75 s, 1080x1920, 24 fps)

Montaje con HyperFrames 0.8.142 de `hermes-content/docs/cola/lucia-diario/guiones/G4-seis-motores-de-imagen-una-cara.md`, con el método de G1, G2 y G3
(`.claude/skills/lucia/montaje-hyperframes.md`, plantilla `videos/lucia-g2/`). **Costo: 0 créditos** (las seis fotos, las del café y la del cierre ya se pagaron;
las 8 referencias de cara están en `v4/qa`).
**Estado: 3ra pasada (9-oct): aplica la revisión independiente `qa/revision-1.md` (H1-H7 y notas, ver «2da pasada») y, en la 3ra, la foto C con el fondo difuminado desde y=540 y la frase «Pagar más no mejora el parecido.». PARA VER POR LA MADRE (preview 360p) junto con el guion. No se publica nada.**
Sin voz ni música: pista AAC en silencio **a propósito** (queda sitio para la música de Sergio Urcullo).
Aquí **no hay clips**: son fotos fijas a pantalla completa con un empuje lento (1,00 → 1,04), placas (regla, lección 1, lección 2) y empujes rígidos de 6 cuadros entre escenas.
**G4 rotula «Imagen A a F»** (no «Motor 1-6» como G2); la correspondencia letra ↔ motor vive aquí y en el guion, nunca en pantalla.

| Qué | Dónde |
|---|---|
| Plan de capas, tiempos, datos, costuras, agregados | `plan.json` |
| Generador (copia/baja el material, **valida reglas, números y afirmaciones contra `v4/PROCEDENCIA.jsonl`** → escribe `index.html`) | `scripts/build.mjs` + `scripts/estilos.css` + `scripts/timeline.js` |
| Lo que el build necesita y NO depende de la red (8 recortes de las referencias con su origen, GSAP) | `assets-fijos/` (versionado; ver `assets-fijos/ORIGEN.md`) |
| Preview 360p (render REAL de HyperFrames a 360x640 de la MISMA composición del final; en `qa/`, que sí va a git) | `qa/g4-preview-360p.mp4` |
| Final 1080x1920 con AAC en silencio (**master**, ignorado en git, 60,4 MB) | `out/g4-final-1080x1920.mp4` · SHA-256 `8e83ef17aab09a5f1a8d1991ef2871f7a515141e53091f94e09ecfbff29c7b65` |
| Copia de entrega (crf 18, máx. 6 Mbps, 21,4 MB; PSNR 49,2 dB de promedio, peor cuadro 44,2 dB) | `../lucia-entrega/g4-final-1080x1920.mp4` · SHA-256 `ec4c450f3e0c4f682b675b65ef913a2e1e0400d31b29c35aa948119bf702f997` |
| Pie para publicar (idéntico al del guion: lo comprueba `build.mjs`) | `pie.txt` |
| Portada sugerida (cuadro a 0,6 s: el gancho entra a 0,1 s) | `qa/portada-0.6s.jpg` |
| Revisión independiente que se aplicó | `qa/revision-1.md` |
| QA mirado y medido | `qa/` (hojas `hoja-qa-1/2/3/4`, `hoja-costuras-1/2`, `hoja-360p`; `zona-segura`, `hueco-tarjetas`, `vacios-y-saltos`, `grep-prohibidas`, `psnr-fotos`, `face-gate`, `face-gate-limpias`, `face-gate-final`, `eventos-visuales`, `ventanas-de-lectura`, `tabla-de-cortes-y-lecturas`, `specs-final`, `hyperframes-check`, `psnr-entrega`, `caras-fotos.json`) |

## Las fotos y los puntajes (la correspondencia letra ↔ motor vive aquí; en pantalla solo «Imagen A a F»)
Control de cara: `face-gate.sh`, ArcFace contra las 8 referencias oficiales, piso 0,70. **Ningún número del guion difiere en 0,03 o más del medido sobre el original** (`qa/face-gate.txt`).
**C y E se muestran con la copia limpia** (`v4/prueba-motores-20261008/fotos-limpias/`; los originales quedan en `fotos/` como evidencia; la de C es la versión de la 3ra pasada, que difumina desde y=540). Cara de las limpias contra su original: **C 0,724 contra 0,737 (−0,013); E 0,687 contra 0,690 (−0,003)**, ambas dentro de 0,02 (`qa/face-gate-limpias.txt`): los números en pantalla siguen siendo los del original.

| Imagen | Motor (no se nombra) | Créditos | Guion | PNG original | JPG de 1080 px (el original) | Foto que se muestra | Cuadros del final (zoom 1,00-1,04) | Caja de cara (lienzo) · mentón |
|---|---|---:|---:|---:|---:|---:|---:|---|
| A | Seedream 4.5 (método diario) | 1 | 0,81 | — (solo hay el JPG de 1440 px: 0,806) | 0,806 | 0,806 | 0,789-0,804 | [445,453,623,657] · 657 |
| B | Kling Omni Image | 0,5 | 0,79 | 0,794 | 0,789 | 0,789 | 0,783-0,788 | [436,553,672,836] · 836 |
| C | Nano Banana 2.1 | 2 | 0,74 | 0,737 | 0,737 | **0,724 (limpia)** | 0,727-0,743 | [447,467,690,776] · 776 |
| D | Seedream 5.0 Pro | 2,5 | 0,70 | 0,702 | 0,707 | 0,707 | 0,691-0,696 | [458,402,639,628] · 628 |
| E | FLUX 3 | 3 | 0,69 | 0,691 | 0,690 | **0,687 (limpia)** | 0,675-0,686 | [395,460,651,747] · 747 |
| F | GPT Image 2.5 | 2,75 | 0,66 | 0,658 | 0,672 | 0,672 | 0,685-0,695 | [413,312,711,667] · 667 |
| A café (escena 2) | Seedream 4.5 | 1 | 0,83 | — (JPG de 1440 px: 0,830) | 0,830 | 0,830 | — | [449,642,618,857] |
| B café (escena 2) | Kling Omni Image | 0,5 | 0,35 | 0,350 | 0,354 | 0,354 | — | [336,257,625,647] |
| B café (escena 3) | Kling Omni Image | 0,5 | 0,83 | 0,831 | 0,834 | — (solo el número) | — | — |
| A café (escena 3) | Seedream 4.5 | 1 | 0,84 | — (JPG de 1440 px: 0,839) | 0,839 | — (solo el número) | — | — |
| Cierre (K4·5) | Seedream 4.5 | — | — (sin número en pantalla) | — | 0,832 | 0,832 | 0,826-0,832 | [616,734,816,991] |

- **Los cuadros del final miden distinto del original sin que la cara se deforme.** Contra la fuente llevada al mismo zoom, sin comprimir, la diferencia es ≤ **0,012** en los 24 cuadros (`qa/face-gate-final.txt`): el escalado y el H.264 no tocan la cara. La diferencia contra el número del guion es ruido del método (±0,03 que el guion declara). **Sobre el cuadro con zoom, F mide 0,685-0,699** (1ra pasada 0,685-0,696; 2da 0,686-0,699; 3ra 0,685-0,695; el original da 0,658), **D 0,69-0,70** (original 0,702) y **E 0,67-0,69**: D, E y F quedan en 0,67-0,70 y **el video muestra los números del original** (los del guion), como toda la serie. Desde la 2da pasada **el ruido se ve en pantalla** (nota de la lección 1, franja de 0,66 a 0,70; H3).
- Caras de 180-300 px en el cuadro: A y D < 200 px (el gate marca «poco confiable»); los números son orientativos y el guion ya dice «una toma cada uno, no una regla».

## Tabla de cortes (la del guion; T = el segundo del guion: desde T la escena nueva está en reposo, el empuje ocupa T−0,25 a T)
| t (s) | Capa | Texto en pantalla |
|---|---|---|
| 0,0 – 6,0 | **Foto A fija** a pantalla completa con empuje lento 1,00 → 1,04 | rótulo «Lucía Antelo · personaje IA de Onia» **desde el cuadro 0 hasta 3,0 s, a 40 px** · **«¿Cuál conserva su cara?»** (0,1-3; «su cara?» se enciende a 1,3) · **«Misma orden. / Seis motores de imagen.»** (3-6; «Seis motores de imagen.» a 4,3) con las **6 miniaturas** A-F entrando desde 3,1 (una cada 0,12 s) |
| 5,75 – 12,0 | **Regla.** Placa oscura: las **8 referencias** (4x2, la primera ya entra a 6,0), escala 0-1, marca en 0,70 | «Se mide contra 8 fotos suyas.» (6-9; «8 fotos suyas.» a 7,2) · la escala se dibuja a 7,8 · «Idéntica es 1. Piso, 0,70.» (9-12; «Piso, 0,70.» a 10,0, cuando cae la marca «mi piso · 0,70») |
| 11,75 – 17,0 | **Imagen A** (foto A) | «Imagen A · 1 crédito» · «parecido **0,81**» (12,7) · «1 crédito» se enciende a 14,4 |
| 16,75 – 22,0 | **Imagen B** | «Imagen B · 0,5 créditos» · «parecido **0,79**» (17,7) |
| 21,75 – 27,0 | **Imagen C** (foto limpia) | «Imagen C · 2 créditos» · «parecido **0,74**» (22,7) |
| 26,75 – 32,0 | **Imagen D** | «Imagen D · 2,5 créditos» · «parecido **0,70**» con punto **neutro** (27,7) · pastilla **«justo en el piso»** (28,7) |
| 31,75 – 37,0 | **Imagen E** (foto limpia) | «Imagen E · 3 créditos» · «parecido **0,69**» (32,7) · sello **«bajo el piso»** (33,7) |
| 36,75 – 42,0 | **Imagen F** | «Imagen F · 2,75 créditos» · «parecido **0,66**» (37,7) · sello **«bajo el piso»** (38,7) |
| 41,75 – 49,75 | **Lección 1.** Placa: las 6 ordenadas por precio sobre la escala (B, A, C, D, F, E) | **«Pagar más no mejora el parecido.»** (6 palabras; «mejora el parecido.» se enciende a 44,3) · marca «mi piso · 0,70» y **nota 1 a 44 px, blanca: «Una toma cada uno: es una prueba, no una regla.»** ya en la placa cuando llega · una fila cada 0,4 s desde 42,1: etiqueta + línea → punto → valor · **nota 2 (45,6): «Entre 0,66 y 0,70 la diferencia es ruido (±0,03).»** · franja de 0,66 a 0,70 sobre la escala (47,2) |
| 49,5 – 57,25 | **Lección 2.** Placa: **tabla de A y B en tres escenas** y las dos fotos del café lado a lado | «Imagen A: la sostuvo en tres.» (49,75-52,25) con **A 0,81 · 0,83 · 0,84** (49,85-50,15) → «Una foto sola no mide.» (52,25-54,55) con **B 0,79 · 0,35 · 0,83** (52,5-52,8) → **«El café: B perdió la cara.»** (54,55-57,25) con las fotos del café A (53,6) y B (53,9) y su pie «Imagen A · café 0,83» / «Imagen B · café 0,35»; anillo sobre la celda de 0,35 (54,7) |
| 57,0 – 59,75 | **Cierre:** la foto K4·5 (Lucía mira a cámara y sonríe) con empuje lento | «Seguime: cada semana, una prueba.» (57,25-59,75; «cada semana, una prueba.» a 58,3) |

Tarjetas: todas ≤ 6 palabras y ≥ 0,35 s por palabra + 0,3 s **+ 0,1 s de margen** (la salida cuenta; lo valida `build.mjs`), sin excepciones (la 2da pasada tenía una de 7 palabras en c11; ya no). Cada tarjeta entra 1 cuadro antes de que termine la anterior; en los empujes viajan con la imagen. **Medido:** solo los cuadros 0-2 (el gancho entra a 0,1 s) no tienen tarjeta (`qa/hueco-tarjetas.txt`).
Todo texto que no es tarjeta (rótulo, datos, sellos, pastilla, filas, tabla, notas, pies: **40 textos**) cumple también 0,35 s por palabra + 0,3. Lo valida `build.mjs` desde el plan y `scripts/ventanas.mjs` lo mide en el DOM cuadro a cuadro **en 55 elementos (los 40 y las 15 tarjetas)** con su ventana REAL, empujes incluidos (`qa/ventanas-de-lectura.txt`): las holguras más justas son c14 (0,10 s: 2,50 para 2,40), c12 (0,14 s) y c13 (0,16 s).
Las dos notas de la lección 1 se leen **una después de la otra** (no son 19 palabras juntas en 3,8 s): la nota 2 entra cuando la 1 ya tuvo su tiempo (10 palabras = 3,8 s); el build corta si no.
Eventos visuales: 89; el hueco máximo es **2,55 s** (47,2 → 49,75 s: de la franja de ruido a la costura), el siguiente 2,30 s (`qa/eventos-visuales.txt`).

## Costuras — la corriente va a la IZQUIERDA (`motion-doctrine`), sin excepciones
Empuje rígido de 6 cuadros (0,25 s, `power3.inOut`): lo que sale va de 0 a −1080 y lo que entra de +1080 a 0, misma curva, pegados borde con borde. **10 empujes** (6,0 · 12,0 · 17,0 · 22,0 · 27,0 · 32,0 · 37,0 · 42,0 · 49,75 · 57,25).
El medio entrante arranca en T−6 cuadros; las tarjetas viajan con el empuje. Las fotos van en un contenedor `overflow:hidden` que es el que viaja; el zoom lo hace la `<img>` de adentro: los bordes siguen rígidos aunque la foto esté al 1,04.
**Las placas ya traen contenido cuando llegan** (la regla: la primera referencia a 6,0; la lección 1: marca, nota 1 y ejes presentes; la lección 2: cabecera y etiqueta de A): se acabaron las entradas casi vacías de 0,25-0,5 s (N1).
**Mirado** en el preview 360p y en el final a resolución completa (`qa/hoja-costuras-1/2.jpg`): ningún cuadro vacío, ninguna tira de fondo. Con la `power3.inOut` el movimiento ocupa los cuadros T−3 a T−1. Como las fotos son fijas, **T es el segundo del guion** (el empuje termina en T), a diferencia de G2.

## 2da pasada (9-oct): lo que pidió el revisor independiente y qué se hizo
Revisor: miró el FINAL de la 1ra pasada y dio «mostrar a la madre: sí; publicar tal cual: no» (1 BLOQUEA, 6 ARREGLAR). Decisiones del orquestador, aplicadas sin reabrirlas.

| H | Sev. | Qué se hizo | Evidencia |
|---|---|---|---|
| H1 | BLOQUEA | **C usa la foto limpia** (`fotos-limpias/img-nano-banana-2-1-a4dd1a48-limpia.jpg`): se tapó el consultorio dental del fondo. **3ra pasada: la limpia difumina desde y=540** (caja x 840-1080, y 540-970, más el logo del monitor) y el fragmento del borde derecho que quedaba en la 2da pasada ya no está. El README de la 1ra pasada decía «un perfil gris tipo letra»: **era falso**, eran el brazo y los sillones de un consultorio dental. | Cara de la limpia 0,724 (original 0,737; `qa/face-gate-limpias.txt`); `psnr-fotos.txt`: C da 42,0 dB contra la limpia. Mirado a 2x y 4x en el cuadro RENDERIZADO 576 (24,0 s), zona x 840-1080, y 540-1100: no hay sillón, equipo ni logo; se lee como fondo fuera de foco (queda un triángulo gris de ~10 px en x≈910, y≈750 y manchas suaves, ilegibles). |
| H2 | ARREGLAR | **C y E usan las fotos limpias** (logo de monitor de C, logo del respaldo del monitor de E). Se conserva el original en `fotos/` como evidencia. | Cuadro 576 (C, x 1000-1080, y 1000-1100): sin logo (queda un rectángulo tenue); cuadro 816 (E, x 820-960, y 700-820) a 4x: sin logo, solo los dos guiones del respaldo. Cara de E 0,687 (original 0,690). |
| H3 | ARREGLAR | **Los números quedan** (los del original medido) y **el ruido se hace visible**: la nota de la lección 1 pasa a texto principal (44 px, blanco pleno) y trae una 2da línea «Entre 0,66 y 0,70 la diferencia es ruido (±0,03).» en un 2do instante; una franja de 0,66 a 0,70 sobre la escala lo dibuja (agregado A11). Los sellos de E y F («bajo el piso») y la pastilla neutra de D («justo en el piso») siguen. | `qa/face-gate-final.txt`: F 0,685-0,695, D 0,691-0,696, E 0,675-0,686 sobre el cuadro (3ra pasada). `qa/ventanas-de-lectura.txt`: nota 1 7,5 s (pide 3,8), nota 2 3,7 s (pide 3,45). La franja cae en x = 681 y 716 (`qa/zona-segura.txt`). |
| H4 | ARREGLAR | **La lección 2 es una tabla con A y B en tres escenas**: A 0,81 · 0,83 · 0,84 y B 0,79 · 0,35 · 0,83, más la tarjeta nueva «Imagen A: la sostuvo en tres.» (6 palabras). El video ya contesta su pregunta. | `build.mjs` valida las seis cifras contra `v4/PROCEDENCIA.jsonl` línea 97: A 0,806 · 0,830 · **0,839 → 0,84**; B 0,794 · 0,350 · 0,831. Afirmación «A la sostuvo en tres» validada (las tres ≥ 0,70). Para darle tiempo: lección 1 de 5,5 a 7,75 s, lección 2 de 5,5 a 7,5 s, cierre de 4 a 2,5 s; **el video pasa de 57 a 59,75 s** (≤ 60). |
| H5 | ARREGLAR | **c1 y c2 invertidas:** 0,1-3 s «¿Cuál conserva su cara?» y 3-6 s «Misma orden. Seis motores de imagen.», con las miniaturas entrando en la segunda (3,1 s). | Cuadros 14, 48, 72, 120 (`qa/hoja-qa-1.jpg`). |
| H6 | ARREGLAR | «Pagar más no la parece más.» → «Pagar más no la hace más parecida.» (2da pasada, 7 palabras: el revisor contó 6, y el tope del guion es 6) → **3ra pasada: «Pagar más no mejora el parecido.» (6 palabras)**, sin excepción (se sacó `max_palabras` de `plan.json` y el build ya no la admite). En pantalla, guion, README y validación. | El build valida la afirmación: la más cara (E, 0,691) queda bajo A (0,806) y B (0,794); ninguna de las que cuestan más que A mejora el parecido de A. Dura 7,7 s en pantalla (pide 2,40). |
| H7 | ARREGLAR | **Nota a 44 px y blanca** (era 36 px a 82 %); **rótulo de IA a 40 px** (era 34) y visible de 0 a 3,0 s (era 2,4 s: 6 palabras necesitan 2,4); gris de los ejes y cabeceras subido de 66 % a 88-92 %. | `qa/zona-segura.txt`: textos de 36-84 px, ninguno < 34; margen mínimo mentón-texto 61 px (el rótulo). Contraste **40/40 AA** (antes 15/15). |
| N1 | NOTA | Entradas casi vacías de las placas: ver «Costuras». | `qa/hoja-qa-3.jpg` cuadros 1008 (42,0 s) y 1194 (49,75 s). |
| N2/N3 | NOTA | Sin cambio (decisión del orquestador): el orden A-F y el «parecido 0,81» (ya dice qué mide). | — |
| N4 | NOTA | Sin cambio: el pie «Imagen B · café 0,35» está en coral y la tarjeta dice «B perdió la cara»; la foto B está 0,25 s sin pie (entra la foto a 53,9 y el pie a 54,15). | — |
| N5 | NOTA | **El cierre usa la foto K4·5** (Lucía mira a cámara y sonríe; ya pagada; **sin clips**). K4·4 (cuerpo entero) se descartó: al fondo parece haber un folleto con dibujo dental (rubro) y la cara queda bajo la barra de arriba (y<280); K4·1 (saluda) tiene la cara a y≈1100-1330 (estimado sobre la hoja del kit), en la franja de la tarjeta. | face-gate 0,832; mirada en el cuadro 1410 (58,75 s): la tarjeta tapa parte de la mano, no la cara (mentón y=991, tarjeta desde 1236). |
| N7 | NOTA | Copia de entrega a **crf 18** (máx. 6 Mbps): 21,4 MB (< 30 MB, cabe en git). **PSNR 49,2 dB de promedio y 44,2 dB MÍNIMO** (28 de 1434 cuadros bajo 45 dB; en la 2da pasada eran 35, todos sobre la foto A: paisaje urbano detallado). No llega a ≥ 45 dB en todos los cuadros; el orquestador aceptó el mínimo (no hace falta crf 16). | `qa/psnr-entrega.txt` |
| N8 | NOTA | **SHA-256 del master y de la copia** en la tabla de arriba. `index.html` se comprobó idéntico (`cmp`) al que se renderizó. «Imagen A a F» aclarado arriba. | — |
| N9 | NOTA | **Las 8 caras de la regla están versionadas** en `assets-fijos/` con su origen (`ORIGEN.md`: archivo, URL de CloudFront, recorte, SHA-256), y GSAP también; `build.mjs` los usa primero y solo baja de CloudFront si faltan. | `git check-ignore`: `assets-fijos/` no está ignorado. |

### Lo que no se pudo cerrar (dicho de frente)
1. **El parche de la limpia en C** (x 840-1080, y 540-970) se ve como un fondo fuera de foco, **con un borde vertical suave y un tono más gris que la pared**: a primera vista se nota que está difuminado (se ve bien en los cuadros 540-648 de `qa/hoja-qa-2.jpg` y en `hoja-costuras-1.jpg`, f642-f644). No parece equipo ni logo. En un teléfono con la interfaz de Instagram no lo verifiqué.
2. **No vi el video en un teléfono con la interfaz de Instagram.**
3. **Copia de entrega:** 28 cuadros bajo 45 dB (mín. 44,2); aceptado.
4. **`hyperframes check` marca 1 «info»** (`content_overlap`, t=52,25 s): el cruce de un cuadro entre las tarjetas c12 y c13, que es el comportamiento previsto (la siguiente entra un cuadro antes de que salga la anterior).

## Cambios respecto del guion y decisiones que la madre puede revertir (todos en `plan.json → agregados_al_guion`, A1-A14)
1. **Tarjeta de la lección 2: «El café: B perdió la cara.» (6 palabras)** en vez de «B perdió la cara en el café.» (7: el guion se pasa de su propio máximo de 6). 
2. **El dato lleva la palabra «parecido»** («parecido 0,81»), con el número a 64 px. Revertir: `build.mjs`.
3. **Imagen D con punto y pastilla NEUTROS** y la pastilla «justo en el piso»: 0,702 cumple por poco y el guion pide no anunciarla como aprobada. Revertir: `plan.json → imagenes[d].estado = "ok"`.
4. **Marca «mi piso · 0,70»** (el guion dice «Piso, 0,70.»): deja claro que el piso lo fijó la sesión (igual que G2).
5. **Las 8 referencias se muestran TODAS** (cuadrícula 4x2), no una muestra de 5 como en G2.
6. **Cierre con la foto K4·5** (antes la foto A, que mira el celular). Revertir: `plan.json → medios[f-cierre].foto = "a"`.
7. **Rótulo de IA a 40 px y de 0 a 3,0 s** (el guion decía 0 a 2,4 s). Revertir: `plan.json → rotulo.b = 2.4`.
8. **Empuje lento 1,00 → 1,04** sobre cada foto (línea recta, origen en la cara medida). Revertir: `plan.json → zoom.fin = 1`.
9. **Acento tardío en las tarjetas de las imágenes** (los créditos se encienden a mitad de escena): evento visual barato. Sin texto nuevo.
10. **Lo que el video no afirma:** que un motor sea «mejor» en general. Sin marcas de terceros (grep limpio), sin profesión (el ambo es vestuario, ninguna frase dice dónde está, y desde la 2da pasada **tampoco la imagen**: se tapó el consultorio de C), sin resultados ni clientes. Las únicas cifras son medidas (créditos y parecido).

## Lo que el video afirma, contra los datos (`build.mjs` corta si alguna falla; `qa/tabla-de-cortes-y-lecturas.txt`)
- «Pagar más no mejora el parecido»: la más cara (E, 3 cr, 0,691) queda bajo la de 1 cr (0,806) y la de 0,5 cr (0,794); ninguna de las que cuestan más que A mejora el parecido de A.
- «Imagen A: la sostuvo en tres» y pie «el que ya uso la sostuvo en tres escenas»: A 0,806 · 0,830 · 0,839 (todas ≥ 0,70). «El más barato la perdió en una de tres»: B 0,794 · 0,350 · 0,831.
- «bajo el piso»: E (0,691) y F (0,658). D (0,702) cae «justo en el piso». Tabla de la lección 2: A 0,81 · 0,83 · 0,84, B 0,79 · 0,35 · 0,83.

## QA medido (final `out/g4-final-1080x1920.mp4`, 2da pasada)
- `ffprobe`: H.264 1080x1920, 24 fps, **59,750 s** (1434 cuadros), bt709, 8,1 Mbps; AAC 48 kHz estéreo −91 dB (`qa/specs-final.txt`). Preview 360p REAL: 360x640, 1434 cuadros, render de HyperFrames de la misma composición (1 min 3 s; el final 3 min 21 s, 4 núcleos, sin GPU). `index.html` idéntico (`cmp`) al que se renderizó.
- `hyperframes check`: 0 errores y 0 avisos de runtime, layout y motion (1 info de layout, ver arriba); contraste **40/40 AA**; 32 avisos de estilo (`nested_structure_needs_subcomposition`, `timeline_track_too_dense`, `duplicate_media_discovery_risk` por la foto A usada tres veces, `composition_heavy_overlay_count_high`) que no frenan.
- **Zona segura en el DOM** (`scripts/medir-dom.mjs`, 478 instantes cada 3 cuadros, 2602 cajas de texto): todo texto entre mentón+40 y y=1490 (el mentón sale de `qa/caras-fotos.json` y se corre con el zoom de cada instante), nada sobre y=280, nada en x>1000 bajo y=1000, ningún texto < 34 px, ningún texto se pisa con otro y los 6 cuadros de cada empuje se saltan. **Margen mínimo entre el mentón y el texto de abajo: 61 px** (el rótulo de IA a 40 px, y=720 contra mentón 659; la regla pide 40). **Los datos están donde dice el número** (punto, marca y franja a 100 + 880 × valor, ±1,5 px) y cada número en pantalla coincide con el del plan — `qa/zona-segura.txt`.
- `grep-prohibidas` sobre pantalla (161 tokens) y pie (83 palabras): **0 coincidencias** (sin marcas de terceros, sin promesas, sin «paciente/clínica/doctora», sin «no sé»).
- `hueco-tarjetas`: solo los cuadros 0-2 sin tarjeta. `vacios.py`: **0 cuadros planos**; saltos de luma ≤ 50,8 en los 10 empujes (foto clara ↔ placa oscura, repartidos en 3 cuadros) y ≤ 3,5 fuera de ellos (`qa/vacios-y-saltos.txt`).
- **PSNR contra la fuente** (`scripts/psnr-fotos.py`, franja y 0-900, 24 cuadros): en todos el pico es la foto del plan (**34,9-42,0 dB** contra **8,9-14,5 dB** de las otras ocho, ya con la del cierre y las limpias) y el pico de zoom cae en la escala del plan: ninguna foto cruzada ni empuje lento corrido (`qa/psnr-fotos.txt`).
- Cara del final contra la fuente en el MISMO zoom: diferencias ≤ **0,012** (`qa/face-gate-final.txt`).
- Mirado renderizado (hojas de contacto del FINAL a 1080x1920 con guías y recortes ampliados): cuadro 0 (rótulo a 40 px), la entrada de cada escena, las dos placas, las zonas tapadas de C y E a 2x-4x, los 10 empujes cuadro por cuadro y el último cuadro (`qa/hoja-qa-1/2/3/4.jpg`, `qa/hoja-costuras-1/2.jpg`). Las guías de las hojas: rojo y=1490, magenta x=1000 desde y=1000, cyan y=707 y y=887 (estas dos son del mentón de K1 y de la foto descartada de G3: valen solo para la foto A).

## Audio
La pista es silencio (−91 dB) y NO se agregan pops en las costuras, a propósito (dejan sitio a la música de Sergio Urcullo). Si se quiere un golpe por costura: 5,75 / 11,75 / 16,75 / 21,75 / 26,75 / 31,75 / 36,75 / 41,75 / 49,5 / 57,0 s (inicio de cada empuje).

## Publicación
Portada: cuadro a 0,6 s (`qa/portada-0.6s.jpg`). El pie va tal cual en `pie.txt`; las notas de edición van aquí, no en el pie. Etiqueta «Información de IA» por API; la vía real es `ig-reel.mjs --cuenta lucia` en el VPS (la madre).
Según `CLAUDE.md` § «Qué se publica sin preguntar» pasa por el control de calidad y se publica sin pedir el OK pieza por pieza **cuando la madre valide el guion** (G4 sale después de G2 y antes del carrusel C2). Esta sesión no publica nada.

## Reproducir
```bash
node scripts/build.mjs                      # copia el material (fotos JPG del repo —C y E las limpias—, fuentes y assets-fijos/), valida y escribe index.html
                                            # copia solo si falta O si cambió el contenido; th-*.jpg y cf-*.jpg se regeneran si su fuente es más nueva
export PRODUCER_HEADLESS_SHELL_PATH=/opt/pw-browsers/chromium HYPERFRAMES_SKIP_SKILLS=1
npx -y hyperframes@0.8.142 check
# 1) BORRADOR 360p REAL primero (~1 min). Lanza 1 «error» de lint (root_zoom_rescales_a_fixed_canvas) y 1 aviso: NO frenan, no usar --strict
node scripts/borrador-360.mjs /ruta/a/draft360 && (cd /ruta/a/draft360 && npx -y hyperframes@0.8.142 render --quality draft -f 24 -o /ruta/draft.mp4)
# 2) recién después el final (~3 min 21 s, 4 núcleos, sin GPU; 8,1 Mbps)
npx -y hyperframes@0.8.142 render --quality high -f 24 -o renders/final-raw.mp4
ffmpeg -y -i renders/final-raw.mp4 -f lavfi -t 59.75 -i anullsrc=r=48000:cl=stereo -map 0:v -map 1:a -c:v copy -c:a aac -b:a 128k -shortest -movflags +faststart out/g4-final-1080x1920.mp4
node scripts/medir-dom.mjs && node scripts/hueco-tarjetas.mjs && node scripts/grep-prohibidas.mjs && node scripts/eventos.mjs && node scripts/ventanas.mjs
export FACE_GATE_HOME=…/lucia-face-gate     # fuera del repo; venv con numpy, cv2, onnxruntime
$FACE_GATE_HOME/venv/bin/python scripts/psnr-fotos.py out/g4-final-1080x1920.mp4 > qa/psnr-fotos.txt
$FACE_GATE_HOME/venv/bin/python scripts/vacios.py out/g4-final-1080x1920.mp4 > qa/vacios-y-saltos.txt
$FACE_GATE_HOME/venv/bin/python scripts/medir-caras.py --refs assets/refs-orig > qa/caras-fotos.json     # SCRFD: cajas de las fotos y recortes de las 8 referencias (solo si se quiere regenerar assets-fijos/)
$FACE_GATE_HOME/venv/bin/python scripts/fuente-con-zoom.py out/g4-final-1080x1920.mp4 /ruta/fgf > args.txt && bash .claude/skills/lucia/scripts/face-gate.sh $(cat args.txt)   # final contra fuente en el mismo zoom
COLS=6 bash scripts/hoja.sh out/g4-final-1080x1920.mp4 hoja.jpg 270 f0 f48 f287 …                  # «fNNN» = cuadro NNN exacto
ffmpeg -i out/g4-final-1080x1920.mp4 -c:v libx264 -preset slow -crf 18 -maxrate 6M -bufsize 12M -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -c:a copy -movflags +faststart ../lucia-entrega/g4-final-1080x1920.mp4
```
