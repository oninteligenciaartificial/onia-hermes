# Lucía · G5 «Cómo mido si una cara es la de Lucía (y cuándo no creerle al número)» (57,5 s, 1080x1920, 24 fps)

Montaje con HyperFrames 0.8.142 de `hermes-content/docs/cola/lucia-diario/guiones/G5-como-se-mide-una-cara.md` (el guion del repo, ya corregido), con el método de G1-G4
(`.claude/skills/lucia/montaje-hyperframes.md`, plantilla `videos/lucia-g4/` con sus dos revisiones independientes). **Costo: 0 créditos** (tres fotos y el cierre ya pagados el 8-oct, dos cuadros de clips
crudos de G2 y las 8 referencias oficiales; no se llamó a ninguna herramienta de Higgsfield).
**Estado: 3ra pasada MÍNIMA (9-oct): aplica 3 cambios de texto de la 2da revisión independiente `qa/revision-2.md` (0 BLOQUEA: R2-1, R2-2 y la nota R2-3), sobre la 2da pasada, que aplicó `qa/revision-1.md` (5 ARREGLAR: G5-1 a G5-5, más las notas N1, N3 y N10) y las decisiones del orquestador. PARA VER POR LA MADRE (preview 360p) junto con el guion. No se publica nada.**
Sin voz ni música: pista AAC en silencio **a propósito** (queda sitio para la música de Sergio Urcullo).
Aquí **no hay clips**: fotos fijas con empuje lento (1,00 → 1,04), cuadros fijos de dos clips crudos, placas y empujes rígidos de 6 cuadros entre escenas.

> ⚠️ **Lo que la madre tiene que saber antes que nada**
> 1. **«Baja sola» (el guion original y su pie) no era falso por completo: era exagerado.** Los datos muestran una caída pequeña y consistente: la MISMA foto reducida hasta que la cara mida 60 px baja 0,004-0,010 en 5 de 6 fotos
>    (la sexta, F, oscila ±0,02: `qa/cara-chica-control.txt`). Lo falso es que la caída sea apreciable: en el Motor 5 la cara va de 89 a 168 px y el número va de 0,80 a 0,82 (`qa/cara-chica-m5.txt`).
>    El video dice ahora **«Cara chica: lo reviso a ojo.»** (nota «Bajo 200 px, el medidor avisa: lo reviso a ojo.», 3ra pasada; antes «…no es fiable.») y no afirma que el número baje ni que no baje de más.
> 2. **El letrero inventado del Motor 4 va difuminado y ahora SE DICE en pantalla** («Lo difuminé: lo inventó el motor.»; en la 2da pasada decía «…la IA», que en un video con el rótulo «personaje IA» era ambiguo). **G2 NO se tocó:** G2 muestra ese mismo letrero legible (se lee «DMSS»/«DVOSS»). **La madre decide si G2 también se difumina.**
> 3. **El pie ya es idéntico al del guion del repo** (el orquestador actualizó el guion y esta pasada lo dejó al día; `build.mjs` genera `pie.txt` desde ese guion y corta si el pie O la pantalla repiten «baja sola», «poco confiable», «orden de magnitud», «se parece poco», **«es ruido», «no es fiable» o «lo inventó la IA»**).

| Qué | Dónde |
|---|---|
| Guion (fuente única; incluye la tabla de cambios G1-G11, la tabla de cortes, la evidencia y el pie) | `hermes-content/docs/cola/lucia-diario/guiones/G5-como-se-mide-una-cara.md` (`guion-corregido.md` quedó como puntero) |
| Revisiones independientes que se aplicaron | `qa/revision-1.md` (2da pasada) y `qa/revision-2.md` (3ra pasada: R2-1, R2-2, R2-3) |
| Plan de capas, tiempos, datos, costuras, agregados reversibles (A1-A20) | `plan.json` |
| Generador (copia el material, **valida reglas, números y afirmaciones contra `v4/PROCEDENCIA.jsonl`** → escribe `index.html` y los manifiestos de `qa/`) | `scripts/build.mjs` + `scripts/estilos.css` + `scripts/timeline.js` |
| Lo que el build necesita y NO depende de la red (8 referencias, 2 cuadros de clip con su origen, GSAP) | `assets-fijos/` (versionado; `assets-fijos/ORIGEN.md`; los cuadros se extraen con `scripts/extraer-cuadros.sh`) |
| Preview 360p (render REAL de HyperFrames a 360x640 de la MISMA composición del final) | `qa/g5-preview-360p.mp4` |
| Final 1080x1920 con AAC en silencio (**master**, ignorado en git) | `out/g5-final-1080x1920.mp4` · SHA-256 `133346a5fbec4ebfe2f523ca2a4598ee0d9cd6f232d2ee654a4d85ba7564aaea` (3ra pasada) |
| Copia de entrega (crf 18, máx. 6 Mbps, 13,1 MB; **PSNR contra el master: 50,6 dB de promedio (el global de ffmpeg; 53,0 dB promediando los 1380 cuadros) y 43,97 dB en el peor cuadro**) | `../lucia-entrega/g5-final-1080x1920.mp4` · SHA-256 `6eed3adecbaf2eea5b31cfc00edf0fad41cdaa3a70200c2424ea5e0e4931f136` |
| Pie para publicar (el del guion del repo: lo genera y comprueba `build.mjs`) | `pie.txt` |
| Portada sugerida (cuadro a 0,6 s) | `qa/portada-0.6s.jpg` |
| QA mirado y medido | `qa/` (hojas `hoja-qa-1..5`, `hoja-costuras-1/2`, `hoja-360p`, `hoja-letrero-3x`; `zona-segura`, `hueco-tarjetas`, `vacios-y-saltos`, `grep-prohibidas`, `psnr-fotos`, `face-gate`, `face-gate-final`, `eventos-visuales`, `ventanas-de-lectura`, `tabla-de-cortes-y-lecturas`, `specs-final`, `hyperframes-check`, `psnr-entrega`, `cara-chica-control`, `cara-chica-m5`, `caras-fotos.json`) |

## Lo que se cambió en la 3ra pasada MÍNIMA (revisión 2, 0 BLOQUEA; 3 frases de texto, 0 créditos)
| H | Sev. | Antes (2da pasada) → ahora | Por qué | Evidencia |
|---|---|---|---|---|
| R2-1 | ARREGLAR (baja) | «Esa variación **es ruido** (±0,03).» → **«Esa variación cabe en ±0,03.»** (5 palabras; tarjeta c14b, guion, README y el pie: «…y eso cabe en ±0,03») | Con UN clip no se afirma la causa: en el Motor 6 la cara crece de 117 a 240 px y parte del rango puede ser cambio real de imagen, no ruido del medidor. «Cabe en» describe lo medido (las 6 muestras caen dentro de la banda). | `qa/ventanas-de-lectura.txt` (c14b 2,83 s para 2,05); `pie.txt` = pie del guion |
| R2-2 | ARREGLAR (baja) | Nota «Bajo 200 px, el medidor **no es fiable**.» → **«Bajo 200 px, el medidor avisa: lo reviso a ojo.»** (44 px, 10 palabras; entra a 32,0 s en vez de 33,2 s para tener ventana: 4,79 s legibles para 3,80 s) | «No es fiable» es categórico y repetía la objeción G5-2 en la nota; la regla del gate sólo avisa y el control mide −0,004 a −0,010 a 60 px. No hizo falta la variante corta «Bajo 200 px, lo reviso a ojo.». | `qa/ventanas-de-lectura.txt` (r1-nota); `qa/zona-segura.txt` |
| R2-3 | NOTA aplicada | Llamada «Lo difuminé: lo inventó **la IA**.» → **«Lo difuminé: lo inventó el motor.»** (6 palabras, 38 px; 4,29 s legibles para 2,40) | En un video cuyo rótulo dice «personaje IA», «la IA» era ambigua; el motor es el generador del clip. | `qa/ventanas-de-lectura.txt` (r3-call); `qa/hoja-letrero-3x.jpg` |

`build.mjs` ahora CORTA si en pantalla o en el pie queda «es ruido», «no es fiable» o «lo inventó la IA» (y `scripts/grep-prohibidas.mjs` las tiene en su lista). **No se tocó nada más**: mismas cifras, mismos tiempos de las demás piezas, mismas costuras.

## Lo que se cambió por hallazgo de la revisión 1 (2da pasada, 0 créditos; las frases marcadas «3ra» cambiaron después)
| H | Sev. | Qué se hizo | Evidencia |
|---|---|---|---|
| G5-1 | ARREGLAR | **«0,66: se parece poco.» → «0,66: bajo el piso.»** (3 palabras) en pantalla, guion y README. F y B conservan su color coral (decisión: no se separan). | `qa/tabla-de-cortes-y-lecturas.txt` (c10); `build.mjs` valida F = 0,658 < 0,70. El número en pantalla sigue siendo el del original medido |
| G5-2 | ARREGLAR | **«Cara chica: poco confiable.» → «Cara chica: lo reviso a ojo.»** (6 palabras) y la nota «Bajo 200 px, lo reviso a ojo.» → **«Bajo 200 px, el medidor no es fiable.»** (44 px, 8 palabras, 3,58 s legibles para 3,10 s; **3ra pasada R2-2: «el medidor avisa: lo reviso a ojo.»**). El pie dice «con una cara chica lo reviso a ojo». El control propio queda como evidencia (−0,004 a −0,010 a 60 px en 5 de 6, F ±0,02). | `qa/ventanas-de-lectura.txt` (c13, r1-nota); `qa/cara-chica-control.txt` |
| G5-3 | ARREGLAR | **Razón 2 rehecha.** Se sacó «orden de magnitud» y la comparación 0,79 → 0,77. Ancla: el MISMO clip del Motor 6 oscila entre **0,771 y 0,799** (verificado contra `v4/PROCEDENCIA.jsonl` línea 97: 0,785 · 0,772 · 0,787 · 0,799 · 0,790 · 0,771; rango 0,028; **la línea 97 es la única fuente: `videos/lucia-g2/qa/face-gate.txt` mide otros cuadros (m6 a 2 s: 0,796) y no sirve de contraste exacto**). Tarjetas «Mismo clip: de 0,77 a 0,80.» (3 s) → «Esa variación es ruido (±0,03).» (3 s; **3ra pasada R2-1: «Esa variación cabe en ±0,03.»**); la banda de ±0,03 va centrada en el promedio de las 6 medidas (0,784) y las contiene a todas (la mayor separación es 0,015). La miniatura de la lección dice «Mismo clip: 0,771-0,799» (en vez de «Diferencia de 0,03»). `build.mjs` valida las cifras contra los datos. | `build.mjs` (claims «razón 2»), `qa/zona-segura.txt` (puntas y banda a ±1,5 px) |
| G5-4 | ARREGLAR | **Letrero difuminado, ahora dicho.** Pantalla: «Lo difuminé: lo inventó la IA.» (38 px, 6 palabras, 4,29 s legibles para 2,40 s; **3ra pasada R2-3: «…lo inventó el motor.»**) junto al aro. **El aro es un rectángulo redondeado que cubre TODO lo difuminado** (el letrero y el trazo más débil de la fachada derecha, que antes quedaba como segunda mancha fuera del aro). Se sacó la pastilla «letrero inventado» (la reemplaza la llamada). **G2 no se tocó** (la madre decide). | `qa/hoja-letrero-3x.jpg` (recorte a 3x del final), `qa/hoja-qa-4.jpg` |
| G5-5 | ARREGLAR | **Escala ampliada rotulada «Zoom: 0,70 a 0,90»** (44 px) y con el piso marcado: la misma marca vertical y la misma etiqueta «mi piso · 0,70» de la escala 0-1, en el extremo izquierdo. | `qa/zona-segura.txt` (marca del piso a x = 100) |
| N1 | NOTA aplicada | Gancho: «¿Cómo sé que **sigue siendo** ella?» (6 palabras). | c1 |
| N3 | NOTA aplicada | «Baja sola» no era falso por completo: caída pequeña y consistente (−0,004 a −0,010); lo falso es que sea apreciable (aviso ⚠️ 1 y «Lo aprendido»). | arriba |
| N10 | NOTA aplicada | La advertencia «el pie NO es el del guion del repo» ya no es cierta: se quitó de este README y de `../lucia-entrega/README.md`; el título de la entrega nombra a G5. | `pie.txt` = bloque «Pie» del guion |
| N4/N5/N6/N7/N8/N9/N11 | NOTA | Sin cambio (F y B con su color por decisión; N8: la pastilla de B sigue siendo la holgura más justa; N11: la copia sigue sin llegar a ≥ 45 dB en todos los cuadros, ver «Lo que no pude cerrar»). | — |

## Las fotos, los cuadros y los puntajes (en pantalla van los números del ORIGINAL medido, los de `v4/PROCEDENCIA.jsonl` línea 97)
Control de cara: `face-gate.sh`, ArcFace contra las 8 referencias oficiales, piso 0,70 (`qa/face-gate.txt`).

| Qué se ve | Archivo de origen | En pantalla | PROCEDENCIA (PNG original) | JPG/archivo usado | Cuadro del final (con zoom) | Cara (SCRFD) |
|---|---|---:|---:|---:|---:|---|
| Foto A (K1): gancho 0-6 s y ejemplo 21-24 s | `v4/kit/k1-1-recepcion-celular-4afffb96.jpg` | 0,81 | 0,806 (solo hay el JPG de 1440 px) | 0,806 | 0,795-0,798 | 237 px nativos; caja [445,453,623,657] |
| Foto F: ejemplo 24-27 s | `v4/prueba-motores-20261008/fotos/img-gpt-image-2-5-5da2fa1e.jpg` | 0,66 | 0,658 | 0,672 | 0,678-0,683 (**la fuente a ese zoom da 0,690-0,697**) | 297 px; [413,312,711,667] |
| Foto B del café (**no es Lucía**): ejemplo 27-30 s | `…/fotos/img-omni-image-k2cafe-9f4b5172.jpg` | 0,35 | 0,350 | 0,354 | 0,350-0,361 | 288 px; [336,257,625,647] |
| Cuadro 0 del Motor 5 de G2 (razón 1) | `assets-fijos/fr-m5.jpg` | «89 px» | primera muestra 0,798 («cara de 89 a 168 px») | 0,798 el cuadro entero, 0,801 el recorte | — (cuadro fijo) | **89 px** exactos |
| Cuadro 96 (4,0 s) del Motor 4 de G2 (razón 3) | `assets-fijos/fr-m4.jpg` (letrero difuminado) | 0,80 | muestra a 4 s: 0,796 | 0,796 entero, 0,791 recortado y difuminado | — | 312 px |
| Motor 6 de G2 (razón 2) | (sin imagen: se dibuja sobre la escala) | 0,77 y 0,80 (puntas) | mínimo 0,771 y máximo 0,799 de las 6 medidas del clip (promedio 0,784) | — | — | — |
| Cierre: foto K4·5 (la misma de G4) | `v4/kit/k4-5-senala-342c0ab5.jpg` | — | — | 0,832 | 0,829-0,831 | 266 px |

- **Diferencias final ↔ fuente al MISMO zoom: ≤ 0,019** (`qa/face-gate-final.txt`, 15 pares): el escalado, el empuje lento, la caja de cara y el H.264 no deforman la cara. **Ningún número en pantalla difiere en 0,03 o más del cuadro que se ve**
  (A −0,015, F +0,023, B del café +0,011). **F** es el caso donde el número depende de la imagen medida: PNG 0,658 · JPG de 1080 px 0,672 · cuadro del final 0,678-0,683 · fuente con zoom 0,690-0,697 (hasta 0,04); en pantalla va 0,66, el del original, como en G4. Por eso la tarjeta dice «bajo el piso» y no «se parece poco».
- Fondos mirados a 3x-4x **antes de usar** cada foto (lección 1 de G4): A (torre de vidrio, calle, mesón), F (monitor negro sin logo, horizonte), B del café (ventanal, monitor al fondo, sin texto), K4·5 (revisada en G4) y los dos cuadros de clip
  (Motor 5: ventana, plantas, lapicero y una tarjeta de mesa con garabatos ilegibles que queda FUERA del recorte; Motor 4: ver abajo). **Ningún consultorio, equipo dental ni logo de marca.** Nada se difuminó salvo el letrero del Motor 4.
- **El letrero inventado del Motor 4 se difuminó con pluma** (sigma 3,5, caja x 0-220 y 40-130 del recorte, un solo paso RGB): sin difuminar se lee «DMSS»/«DVOSS» y podría confundirse con una marca (la decisión de G2 fue no difuminarlo porque no se parecía a ninguna que conociera; aquí hay duda y se pasó a difuminarlo, como G3). Queda un trazo claro ilegible.
  **2da pasada:** el aro cubre toda la zona difuminada (letrero + el trazo más débil de la derecha) y la pantalla lo dice. Revertir: `scripts/extraer-cuadros.sh` con `SIGMA=0` y volver a una pastilla «letrero inventado».
  **Pendiente de la madre:** si G2 (que muestra el letrero legible) también se difumina; G2 no se tocó.

## Tabla de cortes (la del guion; T = el segundo de la costura: desde T la escena nueva está en reposo, el empuje ocupa T−0,25 a T)
| t (s) | Capa | Texto en pantalla |
|---|---|---|
| 0,0 – 6,0 | **Foto A fija** (empuje lento 1,00 → 1,04); rótulo «Lucía Antelo · personaje IA de Onia» **desde el cuadro 0 hasta 3,0 s, a 40 px**; la caja de la cara entra a 3,3 s y la pastilla «parecido 0,81» a 3,8 s | **«¿Cómo sé que sigue siendo ella?»** (0,083-3; «sigue siendo ella?» se enciende a 1,4) → **«Con un número. Y con ojo.»** (3-6; «Y con ojo.» a 4,4) |
| 5,75 – 11,5 | **Paso 1.** Placa: las **8 referencias** (4x2), la fila de arriba ya está al llegar, la de abajo entra de a una desde 6,15; a 10,0 las 8 se encienden en verde | «1 · Ocho fotos oficiales.» (6-8,75; «fotos oficiales.» a 7,0) → «Su cara oficial, fija.» (8,75-11,5; «oficial, fija.» a 10,0) |
| 11,25 – 21,0 | **Paso 2.** Placa: las 8 en fila (ya están al llegar) → flecha (12,1) → la escala 0-1 se dibuja (14,1) → «idéntica · 1» (16,9) → cae la marca «mi piso · 0,70» (18,6) | «2 · Un programa las compara.» (11,5-14) → «Un número, de 0 a 1.» (14-16,75) → «Idéntica es 1.» (16,75-18,5) → «Piso, 0,70. Lo elegí yo.» (18,5-21) |
| 20,75 – 24,0 | **Imagen A** (foto A) + caja verde + pastilla «Imagen A · parecido 0,81» (21,8) | «0,81: es ella.» |
| 23,75 – 27,0 | **Imagen F** + caja coral + pastilla «Imagen F · parecido 0,66» (24,8) | «0,66: bajo el piso.» (acento coral) |
| 26,75 – 30,0 | **Imagen B del café** (no es Lucía) + caja coral + pastilla «Imagen B · café · parecido 0,35» (27,8) | «0,35: otra persona.» (acento coral) |
| 29,75 – 37,0 | **Razón 1.** Placa: cuadro del Motor 5 con la cara de **89 px**, su caja (30,5) y rótulo «89 px» (30,95), línea y lupa (31,4) | «3 · Desconfiá del número.» (30-32,5) → «Cara chica: lo reviso a ojo.» (32,5-37; acento a 34,7) · **nota 44 px «Bajo 200 px, el medidor avisa: lo reviso a ojo.»** (33,2) |
| 36,75 – 43,0 | **Razón 2.** Placa: escala AMPLIADA **«Zoom: 0,70 a 0,90»** con la marca **«mi piso · 0,70»** (ya está al llegar); punta baja 0,77 (37,1) y punta alta 0,80 (37,8) del MISMO clip; banda de ±0,03 con su corchete (40,0) | «Mismo clip: de 0,77 a 0,80.» (37-40; acento a 38,6) → «Esa variación cabe en ±0,03.» (40-43; acento a 41,5) |
| 42,75 – 48,5 | **Razón 3.** Placa: cuadro del Motor 4 (letrero difuminado), aro coral sobre TODO lo difuminado (43,6), **«Lo difuminé: lo inventó el motor.»** (44,0, 38 px), «parecido 0,80» (44,6) | «No ve letreros inventados.» (43-48,5; acento a 46,6) · **nota 44 px «El programa solo compara caras.»** (45,2) |
| 48,25 – 53,5 | **Lección.** Placa: las tres razones con su miniatura («Cara chica» · «Mismo clip: 0,771-0,799» · «Letrero inventado») se encienden de a una (49,3 · 50,0 · 50,7) y una caja las rodea (51,7) | «Por eso, mirá la imagen entera.» (48,5-53,5; acento a 51,2) |
| 53,25 – 57,5 | **Cierre:** foto K4·5 con empuje lento (Lucía mira a cámara y sonríe) | «Seguime: / cada semana, una prueba.» (53,5-57,5, **4,08 s legible**) |

Tarjetas: todas ≤ 6 palabras y ≥ 0,35 s por palabra + 0,3 s **+ 0,1 s de margen** (el build corta si no). Cada tarjeta entra 1 cuadro antes de que termine la anterior; en los empujes viajan con la imagen. **Medido:** solo los cuadros 0-2 (0,125 s) no tienen tarjeta (`qa/hueco-tarjetas.txt`).
Todo texto que no es tarjeta (rótulo, pastillas, marcas, notas, llamada, filas: **25 textos**) cumple 0,35 s por palabra + 0,3, lo valida `build.mjs` desde el plan y `scripts/ventanas.mjs` lo mide en el DOM cuadro a cuadro con su ventana REAL (`qa/ventanas-de-lectura.txt`); las holguras más justas medidas son la pastilla de B (0,16 s), c6 (0,27 s) y c8 (0,28 s).
Eventos visuales: 65; el hueco máximo es **2,50 (el CTA, 55,0 → 57,5 s) s** (`qa/eventos-visuales.txt`).

## Costuras — la corriente va a la IZQUIERDA (`motion-doctrine`), sin excepciones
Empuje rígido de 6 cuadros (0,25 s, `power3.inOut`): lo que sale va de 0 a −1080 y lo que entra de +1080 a 0, misma curva, pegados borde con borde. **10 empujes** (6,0 · 11,5 · 21,0 · 24,0 · 27,0 · 30,0 · 37,0 · 43,0 · 48,5 · 53,5).
El medio entrante arranca en T−6 cuadros; las tarjetas viajan con el empuje; las fotos van en un contenedor `overflow:hidden` que es el que viaja y el zoom lo hace la `<img>` (y su caja de cara, con el mismo origen).
**Las placas ya traen contenido cuando llegan** (la fila de 4 referencias; las 8 en fila; el cuadro del Motor 5; la escala ampliada con sus marcas, la marca del piso y el rótulo «Zoom»; el cuadro del Motor 4; las tres miniaturas): ninguna entrada casi vacía (lección 4 de G4).
**Mirado** en el final a resolución completa (`qa/hoja-costuras-1/2.jpg`, 7 cuadros por empuje; los empujes tocados en esta pasada son 37,0 · 43,0 · 48,5): ningún cuadro vacío, ninguna tira de fondo.

## Desvíos del guion (todos reversibles, `plan.json → agregados_al_guion`, A1-A20; el detalle y cómo revertir está ahí y en la tabla de cambios del guion)
1. **«Baja sola» → «lo reviso a ojo»** (A5). 2. **Tres tarjetas del guion pasaban de 6 palabras** (7, 10 y 7): se corrigió el guion (A4). 3. «Su cara **de verdad**» → «oficial» (A3: Lucía es IA).
4. **57,5 s** (guion ~56): el Paso 3 necesitó 18,5 s en vez de 12 (A12). 5. Razón 2 en una **escala ampliada «Zoom: 0,70 a 0,90»** con el piso marcado, con las dos puntas del mismo clip (A8).
6. **Letrero difuminado y dicho en pantalla, con el aro sobre todo lo difuminado** (A9). 7. **Cajas de cara** en el gancho y en los tres ejemplos (A1, A7). 8. **Cierre con K4·5** en vez de la foto A / el clip K1 (A11). 9. Las 8 referencias en vez de «tira de 5» (A2).
10. La primera tarjeta entra a 0,083 s (cuadro 2) y no a 0,1 s, que no cae en un cuadro de 24 fps (A14). 11. «0,66: bajo el piso.» (A19). 12. Gancho «sigue siendo ella» (A18). 13. 3ra pasada: «cabe en ±0,03», «el medidor avisa: lo reviso a ojo» y «lo inventó el motor» (A20).

## Números del guion que difieren de lo medido
- **«Baja sola»**: exagerado, no falso por completo (ver arriba). Medido: el Motor 5 pasa de 0,798 (89 px) a 0,831 (169 px); la misma foto a 60 px baja 0,004-0,010 (5 de 6) y F oscila ±0,02.
- **«Una diferencia de 0,03 no cuenta» con «0,79 y 0,77»** (1ra pasada): esas dos medidas difieren 0,02 (0,014 sin redondear). **Ya no se muestran.** Ahora: el mismo clip va de 0,771 a 0,799 (rango 0,028, que redondeado es 0,77 y 0,80: difieren 0,03) y la banda de ±0,03 contiene las 6 medidas alrededor de su promedio (0,784).
  El ±0,03 se apoya en ese rango y en la mayor diferencia entre un clip y su remapeo de labios (0,024, sync_so); es un tamaño aproximado, no un intervalo de confianza. **3ra pasada:** el video ya no dice que esa variación «es ruido» (con un clip no se sabe si es ruido del medidor o cambio real de imagen); dice que «cabe en ±0,03».
- «0,66: bajo el piso»: 0,658 está bajo mi piso en el original medido; sobre el cuadro con zoom F mide 0,678-0,683 y la fuente 0,690-0,697 (a 0,01-0,02 del piso: la misma variación de la razón 2). Por eso la frase es «bajo el piso» y no «se parece poco».
- Todo lo demás coincide con PROCEDENCIA línea 97: A 0,806 → 0,81 · F 0,658 → 0,66 · B del café 0,350 → 0,35 · M6 mínimo 0,771 → 0,77 y máximo 0,799 → 0,80 · M4 a 4 s 0,796 → 0,80 · M5 0 s 0,798.

## Lo que el video afirma, contra los datos (`build.mjs` corta si alguna falla; `qa/tabla-de-cortes-y-lecturas.txt`)
- «0,81: es ella» (0,806 ≥ 0,70) · «0,66: bajo el piso» (0,658 < 0,70, y más que la del café) · «0,35: otra persona» (0,350 y PROCEDENCIA dice «perdió la cara: otra persona, estilo caricatura»).
- «Ocho fotos oficiales» (el manifiesto trae 8) · «Piso, 0,70. Lo elegí yo.» (decisión, no frontera).
- «Cara chica: lo reviso a ojo» + «Bajo 200 px, el medidor avisa: lo reviso a ojo»: la cara del cuadro mide 89 px (< 200 px: el gate avisa «poco confiable»; el video dice la regla como aviso y la acción como acción). NO se afirma que el número baje ni que no baje de más.
- «Mismo clip: de 0,77 a 0,80» → «Esa variación cabe en ±0,03» (descripción, no causa): M6 0,771 (→ 0,77) y 0,799 (→ 0,80); las 6 medidas caen a ≤ 0,015 de su promedio (0,784); mayor diferencia clip ↔ remapeo 0,024.
- «No ve letreros inventados»: PROCEDENCIA dice del Motor 4 «invento un letrero en la torre» y su medida a 4 s (el cuadro mostrado) es 0,796 ≥ 0,70: el número aprueba un clip con letrero inventado. «Lo difuminé: lo inventó el motor»: verdad (sigma 3,5, `assets-fijos/ORIGEN.md`; el motor es el generador del clip, no «la IA» del rótulo). «El programa solo compara caras» (no «reconoce» a nadie).

## QA medido (final `out/g5-final-1080x1920.mp4`)
- `ffprobe`: H.264 High 1080x1920, 24 fps, **57,500 s** (1380 cuadros), bt709, 5,25 Mbps, 37,8 MB (master SHA-256 `133346a5…aaea`); AAC 48 kHz estéreo −91 dB (`qa/specs-final.txt`). Preview 360p REAL: 360x640, 1380 cuadros, render de HyperFrames de la misma composición (el final 2 min 30 s, 4 núcleos, sin GPU). `index.html` idéntico (md5 `af2dd61b…`) al que se renderizó (3ra pasada; el de la 2da era `431d6577…`).
- `hyperframes check`: 0 errores y 0 avisos de runtime, layout y motion (4 «info» de layout: el cruce de un cuadro entre tarjetas consecutivas); contraste **23/23 AA**; 34 avisos de estilo (`nested_structure_needs_subcomposition` en cada tarjeta) que no frenan.
- **Zona segura en el DOM** (`scripts/medir-dom.mjs`, 460 instantes cada 3 cuadros, 1435 cajas de texto): todo texto entre mentón+40 y y=1490, nada sobre y=280, nada en x>1000 bajo y=1000, ningún texto < 34 px (tamaños 38-66 px; las notas y «Zoom» a 44-52 px), ningún texto se pisa y los 6 cuadros de cada empuje se saltan.
  **Margen mínimo entre el mentón y el texto de abajo: 61 px** (el rótulo de IA, y=720 contra mentón 659). **Los datos están donde dice el número** (puntas, banda, corchete, marcas, marca del piso y pista a ±1,5 px; el texto de cada valor coincide con el dato) — `qa/zona-segura.txt`.
- `grep-prohibidas` sobre pantalla (147 tokens) y pie (97 palabras): **0 coincidencias** (sin marcas de terceros ni nombres de motores, sin promesas, sin profesión, sin «reconoce»; el medidor no se nombra). `hueco-tarjetas`: solo los cuadros 0-2. `vacios.py`: **0 cuadros planos**; saltos de luma ≤ 52,3 en los 10 empujes y ≤ 8,3 fuera de ellos (la entrada de la primera tarjeta sobre la foto A, cuadros 2→3; igual que en la 2da pasada: el «≤ 5,5» anterior era de la 1ra) (`qa/vacios-y-saltos.txt`).
- **PSNR contra la fuente** (`scripts/psnr-fotos.py`, 15 cuadros, franja y 0-900 con la caja de cara enmascarada): en todos el pico es la foto del plan (**38,7-41,4 dB contra 9,4-12,7 dB de las otras tres**) y el pico de zoom cae en la escala del plan: ninguna foto cruzada ni empuje lento corrido (`qa/psnr-fotos.txt`).
- Mirado renderizado (hojas de contacto del FINAL a 1080x1920 con guías): cuadro 0, la entrada de cada escena, los 10 empujes cuadro por cuadro, el último cuadro y el recorte del letrero a 3x (`qa/hoja-qa-1..5.jpg`, `qa/hoja-costuras-1/2.jpg`, `qa/hoja-letrero-3x.jpg`).

## Lo que no pude cerrar ni verificar (dicho de frente)
1. **No hubo una 3ra revisión independiente**: esta pasada aplica la 2da (`qa/revision-2.md`, 0 BLOQUEA) con tres cambios de texto; no sé qué encontraría otra persona en las tres frases nuevas («cabe en ±0,03», «el medidor avisa: lo reviso a ojo», «lo inventó el motor»).
2. **No vi el video en un teléfono con la interfaz de Instagram.** La zona segura es una simulación con los márgenes de la regla. La llamada «Lo difuminé» está en y 314-420 (la pantalla de Instagram tapa ~280 px arriba): queda debajo de la línea, pero a 38 px y en un teléfono chico puede leerse apretada.
3. **«Bajo 200 px, el medidor avisa» es la regla del gate** (un umbral que avisa), no una caída medida (el control dice −0,004 a −0,010 a 60 px); la prueba usó reducción limpia (INTER_AREA): en un clip real la cara chica además viene borrosa o comprimida, y eso no lo medí aparte del cuadro del Motor 5.
4. **El letrero difuminado** queda como un trazo claro ilegible dentro de un aro grande; no verifiqué cómo se lee en un teléfono. **G2 sigue mostrando el letrero legible**: la madre decide si también se difumina.
5. **El ±0,03** se apoya en el rango de UN clip (0,028) y en la mayor diferencia clip ↔ remapeo (0,024): son dos conjuntos chicos, no un estudio de ruido; el video dice «cabe en ±0,03» (una descripción), no «es ruido» ni «intervalo de confianza». **No verifiqué si el rango 0,771-0,799 del Motor 6 es ruido del medidor o cambio real de la imagen** (la cara crece de 117 a 240 px en ese clip): requeriría repetir el medidor sobre el mismo cuadro con variaciones de codificación.
6. Los clips crudos de G2 salieron del disco de esta nube (`videos/lucia-g2/assets/m4.mp4` y `m5.mp4`, sus SHA-256 coinciden con los de `v4/prueba-motores-20261008/`); no verifiqué contra `job_display` (no se llamó a Higgsfield).
7. No comprobé si las 8 referencias de medición se solapan con las de entrada de cada motor (pendiente heredado de G4; es de método y no cambia el video).
8. **La copia de entrega no llega a ≥ 45 dB en todos los cuadros**: 62 de 1380 quedan bajo 45 dB (mínimo 43,97 dB en el cuadro 513, 21,4 s), en 21,0-23,9 s (la foto A con su ciudad detallada) y alrededor de los empujes de 3,0 y 5,6-5,8 s (`qa/psnr-entrega.txt`). Imperceptible a simple vista; si hace falta ≥ 45 dB en todos, `-crf 16`.

## Audio
La pista es silencio (−91 dB) y NO se agregan pops en las costuras, a propósito (dejan sitio a la música de Sergio Urcullo). Si se quiere un golpe por costura: 5,75 / 11,25 / 20,75 / 23,75 / 26,75 / 29,75 / 36,75 / 42,75 / 48,25 / 53,25 s (inicio de cada empuje).

## Publicación
Portada: cuadro a 0,6 s (`qa/portada-0.6s.jpg`). El pie va tal cual en `pie.txt`; las notas de edición van aquí, no en el pie. Etiqueta «Información de IA» por API; la vía real es `ig-reel.mjs --cuenta lucia` en el VPS (la madre).
Según `CLAUDE.md` § «Qué se publica sin preguntar» pasa por el control de calidad y se publica sin pedir el OK pieza por pieza **cuando la madre valide el guion** (no muestra ni promete una función del producto ni nombra a terceros). Esta sesión no publica nada.

## Lo aprendido (para `.claude/skills/lucia/montaje-hyperframes.md` §10; el editor no escribe fuera de esta carpeta)
- **Antes de montar una afirmación del guion, medirla con un control.** «Cara chica: baja sola» parecía obvia y estaba en el guion y en el pie; el cuadro elegido para ilustrarla (Motor 5, 89 px) dio 0,798 y una foto reducida a 60 px baja 0,004-0,010. 20 minutos de medir con `scripts/cara-chica.py` (0 cr) lo dejaron en su tamaño:
  **«baja sola» no es falso por completo (hay una caída pequeña y consistente, −0,004 a −0,010); lo falso es que sea apreciable**, y por eso el video dice lo que hace («lo reviso a ojo») y no lo que el número hace.
- **Una frase que sale de una regla del gate («poco confiable», < 200 px) no se presenta como un hallazgo**: el revisor la marcó. Se dice la regla como regla y la acción como acción.
- **«Orden de magnitud» es jerga mal usada para ±0,03** (es potencia de diez). Y dos puntos que difieren 0,02 no ilustran «0,03». El ancla limpia es el rango de UN clip (PROCEDENCIA: mínimo y máximo de sus 6 medidas), con la banda centrada en su promedio, y `build.mjs` valida que contenga las 6.
- **Con UNA muestra se describe, no se explica (3ra pasada, revisión 2 R2-1):** «esa variación es ruido» afirma una causa que el clip no prueba (la cara crece de 117 a 240 px: parte puede ser cambio de imagen); «cabe en ±0,03» dice lo medido. Misma clase de frase que «baja sola». Y en un video con el rótulo «personaje IA», «la IA» como autora de un defecto es ambigua: se dice «el motor».
  El build guarda lista de frases retiradas (`RETIRADAS` en `build.mjs`) y corta si vuelven a la pantalla o al pie: una corrección de redacción sin un control que la sostenga se desanda en la siguiente pasada.
- **Un retoque a la imagen (difuminar un letrero) se dice en pantalla** y el aro cubre TODO lo retocado: una segunda mancha fuera del aro sin explicar lee como un defecto del video (mismo patrón que G4 R2-4).
- **Una escala ampliada se rotula «Zoom: …» y lleva el piso marcado** como la escala completa: si no, es una escala nueva que empieza en un número sin explicación.
- **Un cuadro de un clip crudo se recupera de disco, no de Higgsfield**: `videos/lucia-g2/assets/m*.mp4` (ignorados en git) y `v4/prueba-motores-20261008/*.mp4` son el mismo archivo; el cuadro se versiona en `assets-fijos/` con su origen y `scripts/extraer-cuadros.sh`.
- **Las muestras de `PROCEDENCIA` de un clip son 7 y caen en t = 0, 1, 2, 3, 4, 5 y 5,9 s** (comprobado: el cuadro 96 del Motor 4 da 0,796, la muestra de 4 s). El cuadro que se muestra tiene que coincidir con una muestra para que el número en pantalla sea el de PROCEDENCIA.
- **Dos puntos a 0,03 en una escala de 0-1 miden ~26 px y se pisan**: la comparación fina va en una escala AMPLIADA con sus marcas (`X2(v)`), y `medir-dom` comprueba puntas, banda y marcas a ±1,5 px desde `qa/datos-plan.json`. Dos etiquetas de valor a 132 px de distancia se tocan a 48 px de fuente: se corren ±52 px.
- **Los controles se vuelven genéricos si el build escribe sus manifiestos** (`qa/elementos-texto.json`, `qa/eventos-plan.json`, `qa/datos-plan.json`): `ventanas.mjs`, `eventos.mjs` y `medir-dom.mjs` no dependen de la forma del plan de cada video.
- **La caja de cara hace el mismo empuje lento que la foto** con un envoltorio aparte (`.fz` hace el zoom, `.fbox` la entrada): dos tweens de `scale` sobre el mismo elemento se pisan. En el PSNR contra la fuente la caja se enmascara (en el cuadro y en cada candidata).
- **Una miniatura recortada de un cuadro no puede salirse de la imagen** (queda una franja negra): se sujeta el origen del recorte a ≥ 0.
- **`build.mjs` regenera `pie.txt` desde el guion del repo** y corta si el pie repite una frase que el video ya no dice.

## Reproducir
```bash
node scripts/build.mjs                      # copia el material (3 fotos y el cierre del repo, fuentes, assets-fijos/), valida y escribe index.html, pie.txt y qa/*-plan.json
export PRODUCER_HEADLESS_SHELL_PATH=/opt/pw-browsers/chromium HYPERFRAMES_SKIP_SKILLS=1
npx -y hyperframes@0.8.142 check
# 1) BORRADOR 360p REAL primero (~1 min). Lanza 1 «error» de lint (root_zoom_rescales_a_fixed_canvas) y 1 aviso: NO frenan, no usar --strict
node scripts/borrador-360.mjs /ruta/a/draft360 && (cd /ruta/a/draft360 && npx -y hyperframes@0.8.142 render --quality draft -f 24 -o qa/g5-preview-360p.mp4)
# 2) recién después el final (~2 min 30 s, 4 núcleos, sin GPU)
npx -y hyperframes@0.8.142 render --quality high -f 24 -o renders/final-raw.mp4
ffmpeg -y -i renders/final-raw.mp4 -f lavfi -t 57.5 -i anullsrc=r=48000:cl=stereo -map 0:v -map 1:a -c:v copy -c:a aac -b:a 128k -shortest -movflags +faststart out/g5-final-1080x1920.mp4
node scripts/medir-dom.mjs && node scripts/hueco-tarjetas.mjs && node scripts/grep-prohibidas.mjs && node scripts/eventos.mjs && node scripts/ventanas.mjs
export FACE_GATE_HOME=…/lucia-face-gate     # fuera del repo; venv con numpy, cv2, onnxruntime
$FACE_GATE_HOME/venv/bin/python scripts/medir-caras.py > qa/caras-fotos.json                                        # SCRFD: cajas de las fotos y de los dos cuadros
$FACE_GATE_HOME/venv/bin/python scripts/psnr-fotos.py out/g5-final-1080x1920.mp4 > qa/psnr-fotos.txt
$FACE_GATE_HOME/venv/bin/python scripts/vacios.py out/g5-final-1080x1920.mp4 > qa/vacios-y-saltos.txt
$FACE_GATE_HOME/venv/bin/python scripts/cara-chica.py FOTO.jpg … > qa/cara-chica-control.txt                         # la misma foto reducida: ¿baja el número?
$FACE_GATE_HOME/venv/bin/python scripts/fuente-con-zoom.py out/g5-final-1080x1920.mp4 /ruta/fgf > args.txt && bash .claude/skills/lucia/scripts/face-gate.sh $(cat args.txt)   # final contra fuente en el mismo zoom
bash scripts/extraer-cuadros.sh [DIR_DE_LOS_CLIPS]                                                                  # solo si se quiere regenerar assets-fijos/fr-m4.jpg y fr-m5.jpg
COLS=5 bash scripts/hoja.sh out/g5-final-1080x1920.mp4 hoja.jpg 432 f0 f147 …                                       # «fNNN» = cuadro NNN exacto
ffmpeg -i out/g5-final-1080x1920.mp4 -c:v libx264 -preset slow -crf 18 -maxrate 6M -bufsize 12M -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -c:a copy -movflags +faststart ../lucia-entrega/g5-final-1080x1920.mp4
```
