# Lucía · G5 «Cómo mido si una cara es la de Lucía (y cuándo no creerle al número)» (57,5 s, 1080x1920, 24 fps)

Montaje con HyperFrames 0.8.142 de `hermes-content/docs/cola/lucia-diario/guiones/G5-como-se-mide-una-cara.md`, con el método de G1-G4
(`.claude/skills/lucia/montaje-hyperframes.md`, plantilla `videos/lucia-g4/` con sus dos revisiones independientes). **Costo: 0 créditos** (tres fotos y el cierre ya pagados el 8-oct, dos cuadros de clips
crudos de G2 y las 8 referencias oficiales; no se llamó a ninguna herramienta de Higgsfield).
**Estado: 1ra pasada (9-oct), SIN revisor independiente todavía. PARA VER POR LA MADRE (preview 360p) junto con `guion-corregido.md`. No se publica nada.**
Sin voz ni música: pista AAC en silencio **a propósito** (queda sitio para la música de Sergio Urcullo).
Aquí **no hay clips**: fotos fijas con empuje lento (1,00 → 1,04), cuadros fijos de dos clips crudos, placas y empujes rígidos de 6 cuadros entre escenas.

> ⚠️ **Dos cosas que la madre tiene que saber antes que nada**
> 1. **«Cara chica: baja sola» (guion y pie) es FALSO con los datos y se cambió** por «Cara chica: poco confiable.» En el Motor 5 la cara va de 89 a 168 px y el número va de 0,80 a 0,82 (no baja), y la MISMA foto
>    reducida hasta que la cara mida 60 px baja solo 0,004-0,010 en 5 de 6 fotos (`qa/cara-chica-control.txt`, `qa/cara-chica-m5.txt`). «Poco confiable» es la regla del gate (< 200 px), no una caída medida.
> 2. **`pie.txt` NO es idéntico al pie del guion del repo** (el guion dice «una cara chica baja sola»). Sale de `guion-corregido.md`, que **hay que pasar al guion del repo** (el editor solo escribe en `videos/lucia-g5/`).
>    Además el guion se pasaba de su propio tope de 6 palabras en 3 tarjetas: se corrigió el guion, no el tope (tabla de cambios en `guion-corregido.md`).

| Qué | Dónde |
|---|---|
| Guion con las correcciones (cambios G1-G8, tabla de cortes, evidencia, pie) | `guion-corregido.md` |
| Plan de capas, tiempos, datos, costuras, agregados reversibles | `plan.json` |
| Generador (copia el material, **valida reglas, números y afirmaciones contra `v4/PROCEDENCIA.jsonl`** → escribe `index.html` y los manifiestos de `qa/`) | `scripts/build.mjs` + `scripts/estilos.css` + `scripts/timeline.js` |
| Lo que el build necesita y NO depende de la red (8 referencias, 2 cuadros de clip con su origen, GSAP) | `assets-fijos/` (versionado; `assets-fijos/ORIGEN.md`; los cuadros se extraen con `scripts/extraer-cuadros.sh`) |
| Preview 360p (render REAL de HyperFrames a 360x640 de la MISMA composición del final) | `qa/g5-preview-360p.mp4` |
| Final 1080x1920 con AAC en silencio (**master**, ignorado en git) | `out/g5-final-1080x1920.mp4` · SHA-256 `b9b5fb2a7e938ca4619b068bac74ab989fd3b3ce61165392592b830987fcdd28` |
| Copia de entrega (crf 18, máx. 6 Mbps, 13,1 MB; **PSNR contra el master: 50,6 dB de promedio (el global de ffmpeg; 53,1 dB promediando los 1380 cuadros) y 43,95 dB en el peor cuadro**) | `../lucia-entrega/g5-final-1080x1920.mp4` · SHA-256 `c0138e870bd962adf136b351c529a4862eb09f4deffb926bccf916c5eb2c519e` |
| Pie para publicar (el de `guion-corregido.md`: lo genera y comprueba `build.mjs`) | `pie.txt` |
| Portada sugerida (cuadro a 0,6 s) | `qa/portada-0.6s.jpg` |
| QA mirado y medido | `qa/` (hojas `hoja-qa-1..5`, `hoja-costuras-1/2`; `zona-segura`, `hueco-tarjetas`, `vacios-y-saltos`, `grep-prohibidas`, `psnr-fotos`, `face-gate`, `face-gate-final`, `eventos-visuales`, `ventanas-de-lectura`, `tabla-de-cortes-y-lecturas`, `specs-final`, `hyperframes-check`, `psnr-entrega`, `cara-chica-control`, `cara-chica-m5`, `caras-fotos.json`) |

## Las fotos, los cuadros y los puntajes (en pantalla van los números del ORIGINAL medido, los de `v4/PROCEDENCIA.jsonl` línea 97)
Control de cara: `face-gate.sh`, ArcFace contra las 8 referencias oficiales, piso 0,70 (`qa/face-gate.txt`).

| Qué se ve | Archivo de origen | En pantalla | PROCEDENCIA (PNG original) | JPG/archivo usado | Cuadro del final (con zoom) | Cara (SCRFD) |
|---|---|---:|---:|---:|---:|---|
| Foto A (K1): gancho 0-6 s y ejemplo 21-24 s | `v4/kit/k1-1-recepcion-celular-4afffb96.jpg` | 0,81 | 0,806 (solo hay el JPG de 1440 px) | 0,806 | 0,794-0,800 | 237 px nativos; caja [445,453,623,657] |
| Foto F: ejemplo 24-27 s | `v4/prueba-motores-20261008/fotos/img-gpt-image-2-5-5da2fa1e.jpg` | 0,66 | 0,658 | 0,672 | 0,676-0,679 (**la fuente a ese zoom da 0,690-0,697**) | 297 px; [413,312,711,667] |
| Foto B del café (**no es Lucía**): ejemplo 27-30 s | `…/fotos/img-omni-image-k2cafe-9f4b5172.jpg` | 0,35 | 0,350 | 0,354 | 0,361-0,366 | 288 px; [336,257,625,647] |
| Cuadro 0 del Motor 5 de G2 (razón 1) | `assets-fijos/fr-m5.jpg` | «89 px» | primera muestra 0,798 («cara de 89 a 168 px») | 0,798 el cuadro entero, 0,801 el recorte | — (cuadro fijo) | **89 px** exactos |
| Cuadro 96 (4,0 s) del Motor 4 de G2 (razón 3) | `assets-fijos/fr-m4.jpg` (letrero difuminado) | 0,80 | muestra a 4 s: 0,796 | 0,796 entero, 0,791 recortado y difuminado | — | 312 px |
| Motor 6 de G2 (razón 2) | (sin imagen: se dibuja sobre la escala) | 0,79 y 0,77 | 0,785 (0 s) y 0,771 (3,85 s) | — | — | — |
| Cierre: foto K4·5 (la misma de G4) | `v4/kit/k4-5-senala-342c0ab5.jpg` | — | — | 0,832 | 0,827-0,830 | 266 px |

- **Diferencias final ↔ fuente al MISMO zoom: ≤ 0,019** (`qa/face-gate-final.txt`, 15 pares): el escalado, el empuje lento, la caja de cara y el H.264 no deforman la cara. **Ningún número en pantalla difiere en 0,03 o más del medido sobre el cuadro**
  (A −0,014, F +0,019, B del café +0,016). **F** es el caso donde el número depende de la imagen medida: PNG 0,658 · JPG de 1080 px 0,672 · cuadro del final 0,676-0,679 · fuente con zoom 0,690-0,697 (hasta 0,04); en pantalla va 0,66, el del original, como en G4.
- Fondos mirados a 3x-4x **antes de usar** cada foto (lección 1 de G4): A (torre de vidrio, calle, mesón), F (monitor negro sin logo, horizonte), B del café (ventanal, monitor al fondo, sin texto), K4·5 (revisada en G4) y los dos cuadros de clip
  (Motor 5: ventana, plantas, lapicero y una tarjeta de mesa con garabatos ilegibles que queda FUERA del recorte; Motor 4: ver abajo). **Ningún consultorio, equipo dental ni logo de marca.** Nada se difuminó salvo el letrero del Motor 4.
- **El letrero inventado del Motor 4 se difuminó con pluma** (sigma 3,5, caja x 0-220 y 40-130 del recorte, un solo paso RGB): sin difuminar se lee «DMSS»/«DVOSS» y podría confundirse con una marca (la decisión de G2 fue no difuminarlo porque no se parecía a ninguna que conociera; aquí hay duda y se pasó a difuminarlo, como G3). Queda un trazo claro ilegible, marcado por el aro.
  Costo: el espectador ve «algo claro» en la torre y no letras; la tarjeta, la etiqueta «letrero inventado» y el aro dicen qué es. Revertir: `scripts/extraer-cuadros.sh` con `SIGMA=0`.

## Tabla de cortes (la del guion corregido; T = el segundo de la costura: desde T la escena nueva está en reposo, el empuje ocupa T−0,25 a T)
| t (s) | Capa | Texto en pantalla |
|---|---|---|
| 0,0 – 6,0 | **Foto A fija** (empuje lento 1,00 → 1,04); rótulo «Lucía Antelo · personaje IA de Onia» **desde el cuadro 0 hasta 3,0 s, a 40 px**; la caja de la cara entra a 3,3 s y la pastilla «parecido 0,81» a 3,8 s | **«¿Cómo sé que esta es ella?»** (0,083-3; «esta es ella?» se enciende a 1,4) → **«Con un número. Y con ojo.»** (3-6; «Y con ojo.» a 4,4) |
| 5,75 – 11,5 | **Paso 1.** Placa: las **8 referencias** (4x2), la fila de arriba ya está al llegar, la de abajo entra de a una desde 6,15; a 10,0 las 8 se encienden en verde | «1 · Ocho fotos oficiales.» (6-8,75; «fotos oficiales.» a 7,0) → «Su cara oficial, fija.» (8,75-11,5; «oficial, fija.» a 10,0) |
| 11,25 – 21,0 | **Paso 2.** Placa: las 8 en fila (ya están al llegar) → flecha (12,1) → la escala 0-1 se dibuja (14,1) → «idéntica · 1» (16,9) → cae la marca «mi piso · 0,70» (18,6) | «2 · Un programa las compara.» (11,5-14) → «Un número, de 0 a 1.» (14-16,75) → «Idéntica es 1.» (16,75-18,5) → «Piso, 0,70. Lo elegí yo.» (18,5-21) |
| 20,75 – 24,0 | **Imagen A** (foto A) + caja verde + pastilla «Imagen A · parecido 0,81» (21,8) | «0,81: es ella.» |
| 23,75 – 27,0 | **Imagen F** + caja coral + pastilla «Imagen F · parecido 0,66» (24,8) | «0,66: se parece poco.» (acento coral) |
| 26,75 – 30,0 | **Imagen B del café** (no es Lucía) + caja coral + pastilla «Imagen B · café · parecido 0,35» (27,8) | «0,35: otra persona.» (acento coral) |
| 29,75 – 37,0 | **Razón 1.** Placa: cuadro del Motor 5 con la cara de **89 px**, su caja (30,5) y rótulo «89 px» (30,95), línea y lupa (31,4) | «3 · Desconfiá del número.» (30-32,5) → «Cara chica: poco confiable.» (32,5-37; acento a 34,7) · **nota 44 px «Bajo 200 px, lo reviso a ojo.»** (33,4) |
| 36,75 – 43,0 | **Razón 2.** Placa: escala AMPLIADA de 0,70 a 0,90 (ya está al llegar); medida 0,79 (37,1), banda de ±0,03 con su corchete (37,7), medida 0,77 DENTRO de la banda (38,3) | «Una diferencia de 0,03 no cuenta.» (37-43; acento a 41,2) · «Mismo clip, dos momentos.» (38,5, 44 px) · **nota 44 px «±0,03: solo un orden de magnitud.»** (40,0) |
| 42,75 – 47,5 | **Razón 3.** Placa: cuadro del Motor 4 (letrero difuminado), aro coral (43,7), «letrero inventado» (44,1), «parecido 0,80» (44,5) | «No ve letreros inventados.» (43-47,5; acento a 45,4) · **nota 44 px «El programa solo compara caras.»** (44,2) |
| 47,25 – 53,5 | **Lección.** Placa: las tres razones con su miniatura se encienden de a una (48,4 · 49,2 · 50,0) y una caja las rodea (51,9) | «Por eso, mirá la imagen entera.» (acento a 50,8) |
| 53,25 – 57,5 | **Cierre:** foto K4·5 con empuje lento (Lucía mira a cámara y sonríe) | «Seguime: / cada semana, una prueba.» (53,5-57,5, **4,08 s legible**) |

Tarjetas: todas ≤ 6 palabras y ≥ 0,35 s por palabra + 0,3 s **+ 0,1 s de margen** (el build corta si no). Cada tarjeta entra 1 cuadro antes de que termine la anterior; en los empujes viajan con la imagen. **Medido:** solo los cuadros 0-2 (0,125 s) no tienen tarjeta (`qa/hueco-tarjetas.txt`).
Todo texto que no es tarjeta (rótulo, pastillas, marcas, notas, filas: **26 textos**) cumple 0,35 s por palabra + 0,3, lo valida `build.mjs` desde el plan y `scripts/ventanas.mjs` lo mide en el DOM cuadro a cuadro con su ventana REAL (`qa/ventanas-de-lectura.txt`, 26 textos + 17 tarjetas); las holguras más justas son la pastilla de B (0,16 s medidos, 0,07 s en el plan), c6 (0,27 s) y c8 (0,28 s).
Eventos visuales: 66; el hueco máximo es **2,50 s** (el CTA, 55,0 → 57,5 s) y el siguiente 2,40 s (`qa/eventos-visuales.txt`).

## Costuras — la corriente va a la IZQUIERDA (`motion-doctrine`), sin excepciones
Empuje rígido de 6 cuadros (0,25 s, `power3.inOut`): lo que sale va de 0 a −1080 y lo que entra de +1080 a 0, misma curva, pegados borde con borde. **10 empujes** (6,0 · 11,5 · 21,0 · 24,0 · 27,0 · 30,0 · 37,0 · 43,0 · 47,5 · 53,5).
El medio entrante arranca en T−6 cuadros; las tarjetas viajan con el empuje; las fotos van en un contenedor `overflow:hidden` que es el que viaja y el zoom lo hace la `<img>` (y su caja de cara, con el mismo origen).
**Las placas ya traen contenido cuando llegan** (la fila de 4 referencias; las 8 en fila; el cuadro del Motor 5; la escala ampliada con sus marcas; el cuadro del Motor 4; las tres miniaturas): ninguna entrada casi vacía (lección 4 de G4).
**Mirado** en el final a resolución completa (`qa/hoja-costuras-1/2.jpg`, 7 cuadros por empuje): ningún cuadro vacío, ninguna tira de fondo. Como las fotos son fijas, T es el segundo del guion (el empuje termina en T).

## Desvíos del guion (todos reversibles, `plan.json → agregados_al_guion`, A1-A17; el detalle y cómo revertir está ahí y en `guion-corregido.md`)
1. **«Cara chica: baja sola» → «poco confiable»** (A5; ver arriba). 2. **Tres tarjetas del guion pasaban de 6 palabras** (7, 10 y 7): se corrigió el guion (A4). 3. «Su cara **de verdad**» → «oficial» (A3: Lucía es IA).
4. **57,5 s** (guion ~56): el Paso 3 necesitó 17,5 s en vez de 12 (A12). 5. Razón 2 en una **escala ampliada de 0,70 a 0,90**, porque en la de 0-1 los puntos de 0,79 y 0,77 están a 17 px y se pisan (A8).
6. **Letrero difuminado** (A9). 7. **Cajas de cara** en el gancho y en los tres ejemplos (A1, A7). 8. **Cierre con K4·5** en vez de la foto A / el clip K1 (A11). 9. Las 8 referencias en vez de «tira de 5» (A2).
10. La primera tarjeta entra a 0,083 s (cuadro 2) y no a 0,1 s, que no cae en un cuadro de 24 fps (A14). 11. **`pie.txt` ≠ pie del guion del repo** (A13).

## Números del guion que difieren de lo medido
- **«Cara chica: baja sola»**: falso (ver arriba). Medido: el Motor 5 pasa de 0,798 (89 px) a 0,831 (169 px); la misma foto a 60 px baja 0,004-0,010 (5 de 6) y F oscila ±0,02.
- **«Una diferencia de 0,03 no cuenta» con «dos medidas 0,79 y 0,77»**: esas dos medidas difieren 0,02 en pantalla (0,014 sin redondear), no 0,03; la tarjeta habla del umbral y la banda de ±0,03 contiene a las dos. El ±0,03 se apoya en la mayor diferencia medida entre un clip y su remapeo
  de labios (0,024, sync_so, PROCEDENCIA línea 97) y en el rango de F entre PNG y cuadro (hasta 0,04); es un orden de magnitud, no un intervalo de confianza, y la nota lo dice.
- «0,66: se parece poco»: 0,658 está **bajo mi piso**, pero muy por encima de otras personas (caras negativas del gate: máx. 0,224). «Se parece poco» es una lectura del número, no una frontera; el cuadro de F a ese zoom da 0,676-0,679 y la fuente 0,690-0,697, o sea que sobre el cuadro que se ve F está a 0,02-0,03 del piso (el propio ruido de la razón 2).
  Se dejó la frase del guion; si la madre la considera exagerada: «0,66: bajo el piso.» (3 palabras).
- Todo lo demás coincide con PROCEDENCIA línea 97: A 0,806 → 0,81 · F 0,658 → 0,66 · B del café 0,350 → 0,35 · M6 0,785 → 0,79 y 0,771 → 0,77 · M4 a 4 s 0,796 → 0,80 · M5 0 s 0,798.

## Lo que el video afirma, contra los datos (`build.mjs` corta si alguna falla; `qa/tabla-de-cortes-y-lecturas.txt`)
- «0,81: es ella» (0,806 ≥ 0,70) · «0,66: se parece poco» (0,658 < 0,70, y más que la del café) · «0,35: otra persona» (0,350 y PROCEDENCIA dice «perdió la cara: otra persona, estilo caricatura»).
- «Ocho fotos oficiales» (el manifiesto trae 8) · «Piso, 0,70. Lo elegí yo.» (decisión, no frontera).
- «Cara chica: poco confiable»: la cara del cuadro mide 89 px (< 200 px: regla del gate) y NO se afirma que el número baje.
- «Una diferencia de 0,03 no cuenta»: M6 0,785 → 0,771 (dif. 0,014), dentro de la banda de ±0,03 centrada en 0,79; mayor diferencia clip ↔ remapeo 0,024.
- «No ve letreros inventados»: PROCEDENCIA dice del Motor 4 «invento un letrero en la torre» y su medida a 4 s (el cuadro mostrado) es 0,796 ≥ 0,70: el número aprueba un clip con letrero inventado. «El programa solo compara caras» (no «reconoce» a nadie).

## QA medido (final `out/g5-final-1080x1920.mp4`)
- `ffprobe`: H.264 High 1080x1920, 24 fps, **57,500 s** (1380 cuadros), bt709, 5,27 Mbps, 37,9 MB; AAC 48 kHz estéreo −91 dB (`qa/specs-final.txt`). Preview 360p REAL: 360x640, 1380 cuadros, render de HyperFrames de la misma composición (51 s; el final 2 min 30 s, 4 núcleos, sin GPU). `index.html` idéntico (md5 `5e14c60c…`) al que se renderizó.
- `hyperframes check`: 0 errores y 0 avisos de runtime, layout y motion (4 «info» de layout: el cruce de un cuadro entre tarjetas consecutivas); contraste **24/24 AA**; 33 avisos de estilo (`nested_structure_needs_subcomposition` en cada tarjeta) que no frenan.
- **Zona segura en el DOM** (`scripts/medir-dom.mjs`, 460 instantes cada 3 cuadros, 1455 cajas de texto): todo texto entre mentón+40 y y=1490, nada sobre y=280, nada en x>1000 bajo y=1000, ningún texto < 34 px (tamaños 38-66 px; las tres notas y el pie de la razón 2 a 44 px), ningún texto se pisa y los 6 cuadros de cada empuje se saltan.
  **Margen mínimo entre el mentón y el texto de abajo: 61 px** (el rótulo de IA, y=720 contra mentón 659). **Los datos están donde dice el número** (punto, banda, corchete, marcas y pista a ±1,5 px; el texto de cada valor coincide con el dato) — `qa/zona-segura.txt`.
- `grep-prohibidas` sobre pantalla (135 tokens) y pie (91 palabras): **0 coincidencias** (sin marcas de terceros ni nombres de motores, sin promesas, sin profesión, sin «reconoce»; el medidor no se nombra). `hueco-tarjetas`: solo los cuadros 0-2. `vacios.py`: **0 cuadros planos**; saltos de luma ≤ 52 en los 10 empujes y ≤ 5,5 fuera de ellos (`qa/vacios-y-saltos.txt`).
- **PSNR contra la fuente** (`scripts/psnr-fotos.py`, 15 cuadros, franja y 0-900 con la caja de cara enmascarada): en todos el pico es la foto del plan (**38,7-41,4 dB** contra **9,4-12,7 dB** de las otras tres) y el pico de zoom cae en la escala del plan: ninguna foto cruzada ni empuje lento corrido (`qa/psnr-fotos.txt`).
- Mirado renderizado (hojas de contacto del FINAL a 1080x1920 con guías): cuadro 0, la entrada de cada escena, los 10 empujes cuadro por cuadro y el último cuadro (`qa/hoja-qa-1..5.jpg`, `qa/hoja-costuras-1/2.jpg`).

## Lo que no pude cerrar ni verificar (dicho de frente)
1. **No hubo revisor independiente**: lo que el revisor de G4 encontró recién al final (fondos con consultorio o logo, número del cuadro ≠ el del original, afirmaciones exageradas, placas casi vacías, CTA corto, mirada del último cuadro, notas en gris) se aplicó desde el principio, pero no sé qué más encontraría otra persona.
2. **No vi el video en un teléfono con la interfaz de Instagram.** La zona segura es una simulación con los márgenes de la regla.
3. **«Poco confiable» es una regla mía (el gate marca < 200 px), no una caída medida**; la prueba de control usó reducción limpia (INTER_AREA): en un clip real la cara chica además viene borrosa o comprimida, y eso no lo medí aparte del cuadro del Motor 5.
4. **El letrero difuminado**: queda un trazo claro; no verifiqué cómo se lee en un teléfono. Si la madre prefiere el letrero nítido (G2 lo dejó), `SIGMA=0` en `scripts/extraer-cuadros.sh` y rehacer el build.
5. Los clips crudos de G2 salieron del disco de esta nube (`videos/lucia-g2/assets/m4.mp4` y `m5.mp4`, sus SHA-256 coinciden con los de `v4/prueba-motores-20261008/`); no verifiqué contra `job_display` (no se llamó a Higgsfield).
6. No comprobé si las 8 referencias de medición se solapan con las de entrada de cada motor (pendiente heredado de G4; es de método y no cambia el video).
7. **La copia de entrega no llega a ≥ 45 dB en todos los cuadros**: 62 de 1380 quedan bajo 45 dB (mínimo 43,95 dB en el cuadro 513, 21,4 s), casi todos entre 21,0 y 23,9 s, la foto A con su ciudad detallada, y alrededor de los empujes de 3,0 y 5,8 s (`qa/psnr-entrega.txt`). Imperceptible a simple vista; si hace falta ≥ 45 dB en todos, `-crf 16`.

## Audio
La pista es silencio (−91 dB) y NO se agregan pops en las costuras, a propósito (dejan sitio a la música de Sergio Urcullo). Si se quiere un golpe por costura: 5,75 / 11,25 / 20,75 / 23,75 / 26,75 / 29,75 / 36,75 / 42,75 / 47,25 / 53,25 s (inicio de cada empuje).

## Publicación
Portada: cuadro a 0,6 s (`qa/portada-0.6s.jpg`). El pie va tal cual en `pie.txt`; las notas de edición van aquí, no en el pie. Etiqueta «Información de IA» por API; la vía real es `ig-reel.mjs --cuenta lucia` en el VPS (la madre).
Según `CLAUDE.md` § «Qué se publica sin preguntar» pasa por el control de calidad y se publica sin pedir el OK pieza por pieza **cuando la madre valide el guion corregido** (no muestra ni promete una función del producto ni nombra a terceros). Esta sesión no publica nada.

## Lo aprendido (para `.claude/skills/lucia/montaje-hyperframes.md` §10; el editor no escribe fuera de esta carpeta)
- **Antes de montar una afirmación del guion, medirla con un control.** «Cara chica: baja sola» parecía obvia y estaba en el guion y en el pie; el cuadro elegido para ilustrarla (Motor 5, 89 px) dio 0,798, y una foto reducida a 60 px baja 0,004-0,010. 20 minutos de medir con `scripts/cara-chica.py` (0 cr) evitaron publicar una falsedad.
- **Un cuadro de un clip crudo se recupera de disco, no de Higgsfield**: `videos/lucia-g2/assets/m*.mp4` (ignorados en git) y `v4/prueba-motores-20261008/*.mp4` son el mismo archivo; el cuadro se versiona en `assets-fijos/` con su origen y `scripts/extraer-cuadros.sh`.
- **Las muestras de `PROCEDENCIA` de un clip son 7 y caen en t = 0, 1, 2, 3, 4, 5 y 5,9 s** (comprobado: el cuadro 96 del Motor 4 da 0,796, la muestra de 4 s). El cuadro que se muestra tiene que coincidir con una muestra para que el número en pantalla sea el de PROCEDENCIA.
- **Dos puntos a 0,02 en una escala de 0-1 miden 17 px y se pisan**: la comparación fina va en una escala AMPLIADA con sus marcas (`X2(v)`), y `medir-dom` comprueba punto, banda y marcas a ±1,5 px desde `qa/datos-plan.json`.
- **Los controles se vuelven genéricos si el build escribe sus manifiestos** (`qa/elementos-texto.json`, `qa/eventos-plan.json`, `qa/datos-plan.json`): `ventanas.mjs`, `eventos.mjs` y `medir-dom.mjs` ya no dependen de la forma del plan de cada video.
- **La caja de cara hace el mismo empuje lento que la foto** con un envoltorio aparte (`.fz` hace el zoom, `.fbox` la entrada): dos tweens de `scale` sobre el mismo elemento se pisan. En el PSNR contra la fuente la caja se enmascara (y en el cuadro y en cada candidata).
- **Una miniatura recortada de un cuadro no puede salirse de la imagen** (queda una franja negra): se sujeta el origen del recorte a ≥ 0.
- **`build.mjs` regenera `pie.txt` desde el pie del guion corregido** y avisa si difiere del guion del repo.

## Reproducir
```bash
node scripts/build.mjs                      # copia el material (3 fotos y el cierre del repo, fuentes, assets-fijos/), valida y escribe index.html y qa/*-plan.json
export PRODUCER_HEADLESS_SHELL_PATH=/opt/pw-browsers/chromium HYPERFRAMES_SKIP_SKILLS=1
npx -y hyperframes@0.8.142 check
# 1) BORRADOR 360p REAL primero (~1 min). Lanza 1 «error» de lint (root_zoom_rescales_a_fixed_canvas) y 1 aviso: NO frenan, no usar --strict
node scripts/borrador-360.mjs /ruta/a/draft360 && (cd /ruta/a/draft360 && npx -y hyperframes@0.8.142 render --quality draft -f 24 -o qa/g5-preview-360p.mp4)
# 2) recién después el final (~2 min 31 s, 4 núcleos, sin GPU)
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
