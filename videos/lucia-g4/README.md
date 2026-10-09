# Lucía · G4 «Seis motores de imagen, una cara: ¿cuál la conserva?» (57 s, 1080x1920, 24 fps)

Montaje con HyperFrames 0.8.142 de `hermes-content/docs/cola/lucia-diario/guiones/G4-seis-motores-de-imagen-una-cara.md`, con el método de G1, G2 y G3
(`.claude/skills/lucia/montaje-hyperframes.md`, plantilla `videos/lucia-g2/`). **Costo: 0 créditos** (las seis fotos y las del café ya se pagaron el 8-oct;
las 8 referencias de cara están en `v4/qa`, bajadas por curl desde las URL públicas del manifiesto).
**Estado: 1ra pasada (9-oct), sin revisor independiente todavía. PARA VER POR LA MADRE (preview 360p) junto con el guion. No se publica nada.**
Sin voz ni música: pista AAC en silencio **a propósito** (queda sitio para la música de Sergio Urcullo).
Aquí **no hay clips**: son seis fotos fijas a pantalla completa con un empuje lento (1,00 → 1,04), tres placas (regla, lección 1, lección 2) y empujes rígidos de 6 cuadros entre escenas.

| Qué | Dónde |
|---|---|
| Plan de capas, tiempos, datos, costuras, agregados | `plan.json` |
| Generador (copia/baja el material, **valida reglas, números y afirmaciones contra `v4/PROCEDENCIA.jsonl`** → escribe `index.html`) | `scripts/build.mjs` + `scripts/estilos.css` + `scripts/timeline.js` |
| Preview 360p (render REAL de HyperFrames a 360x640 de la MISMA composición del final; en `qa/`, que sí va a git) | `qa/g4-preview-360p.mp4` |
| Final 1080x1920 con AAC en silencio (ignorado en git, 68,8 MB) | `out/g4-final-1080x1920.mp4` |
| Copia de entrega (6 Mbps máx., 13,8 MB; PSNR 47,2 dB) | `../lucia-entrega/g4-final-1080x1920.mp4` |
| Pie para publicar (idéntico al del guion: lo comprueba `build.mjs`) | `pie.txt` |
| Portada sugerida (cuadro a 0,6 s: el gancho entra a 0,1 s) | `qa/portada-0.6s.jpg` |
| QA mirado y medido | `qa/` (hojas `hoja-qa-1/2/3`, `hoja-costuras-1/2`, `hoja-360p`; `zona-segura`, `hueco-tarjetas`, `vacios-y-saltos`, `grep-prohibidas`, `psnr-fotos`, `face-gate`, `face-gate-final`, `eventos-visuales`, `ventanas-de-lectura`, `tabla-de-cortes-y-lecturas`, `specs-final`, `hyperframes-check`, `psnr-entrega`, `caras-fotos.json`) |

## Las fotos y los puntajes (la correspondencia letra ↔ motor vive aquí; en pantalla solo «Imagen A a F»)
Control de cara: `face-gate.sh`, ArcFace contra las 8 referencias oficiales, piso 0,70. **Ningún número del guion difiere en 0,03 o más del medido sobre el original** (`qa/face-gate.txt`).

| Imagen | Motor (no se nombra) | Créditos | Guion | PNG original | JPG de 1080 px (el de la pantalla) | Cuadros del final (zoom 1,00-1,04) | Caja de cara (lienzo) · mentón |
|---|---|---:|---:|---:|---:|---:|---|
| A | Seedream 4.5 (método diario) | 1 | 0,81 | — (solo hay el JPG de 1440 px: 0,806) | 0,806 | 0,79-0,80 | [445,453,623,657] · 657 |
| B | Kling Omni Image | 0,5 | 0,79 | 0,794 | 0,789 | 0,78-0,79 | [436,553,672,836] · 836 |
| C | Nano Banana 2.1 | 2 | 0,74 | 0,737 | 0,737 | 0,74 | [448,468,689,777] · 777 |
| D | Seedream 5.0 Pro | 2,5 | 0,70 | 0,702 | 0,707 | 0,69-0,70 | [458,402,639,628] · 628 |
| E | FLUX 3 | 3 | 0,69 | 0,691 | 0,690 | 0,67-0,68 | [395,460,651,747] · 747 |
| F | GPT Image 2.5 | 2,75 | 0,66 | 0,658 | 0,672 | 0,685-0,696 | [413,312,711,667] · 667 |
| A café (escena 2) | Seedream 4.5 | 1 | 0,83 | — (JPG de 1440 px: 0,830) | 0,830 | — | [449,642,618,857] |
| B café (escena 2) | Kling Omni Image | 0,5 | 0,35 | 0,350 | 0,354 | — | [336,257,625,647] |
| B café (escena 3) | Kling Omni Image | 0,5 | 0,83 | 0,831 | 0,834 | — | — |
| A café (escena 3) | Seedream 4.5 | 1 | 0,84 | — (JPG de 1440 px: 0,839) | 0,839 | — | — |

- **Los cuadros del final miden distinto del original sin que la cara se deforme.** Contra la fuente llevada al mismo zoom, sin comprimir, la diferencia es ≤ **0,015** en los 24 cuadros (`qa/face-gate-final.txt`): el escalado y el H.264 no tocan la cara. La diferencia contra el número del guion es ruido del método (±0,03 que el guion ya declara): **F** da 0,658 en el PNG y 0,685-0,696 en el cuadro (+0,03 a +0,04); **D** da 0,702 en el PNG y 0,69-0,70 en el cuadro. Las conclusiones no cambian: E y F siguen bajo 0,70 en todas las medidas, D queda «justo en el piso» (de ahí la pastilla neutra, A3). **El video muestra los números del original (los del guion), como toda la serie.**
- Caras de 180-300 px en el cuadro: D es < 200 px (el gate marca «poco confiable»); los números son orientativos y el guion ya dice «una toma cada uno, no una regla».
- Fotos miradas completas a 540x960 y dos zonas ampliadas 4x: **ningún letrero ni marca legible**. Quedan dos formas incidentales de la imagen generada, ilegibles y que ya estaban en las fotos de la prueba: **foto C**, un perfil gris tipo letra, cortado, en el vidrio del borde derecho (x≈1030-1080, y≈600-680); **foto E**, un óvalo borroso con dos guiones (tipo logo de monitor, ~14 px) en el dorso del monitor blanco (x≈880, y≈750). No son texto del video. **Si la madre quiere cero rastros, se difuminan con pluma como en G3 (no se hizo: cambiaría los píxeles de la foto).**

## Tabla de cortes (la del guion; T = el segundo del guion: desde T la escena nueva está en reposo, el empuje ocupa T−0,25 a T)
| t (s) | Capa | Texto en pantalla |
|---|---|---|
| 0,0 – 6,0 | **Foto A fija** a pantalla completa con empuje lento 1,00 → 1,04 | rótulo «Lucía Antelo · personaje IA de Onia» **desde el cuadro 0 hasta 2,4 s** · «Misma orden. / Seis motores de imagen.» (0,1-3; «Seis motores de imagen.» se enciende a 1,3) · a 3,1 entran las **6 miniaturas** A-F (una cada 0,12 s) · «¿Cuál conserva su cara?» (3-6) |
| 5,75 – 12,0 | **Regla.** Placa oscura: las **8 referencias** (4x2), escala 0-1, marca en 0,70 | «Se mide contra 8 fotos suyas.» (6-9; «8 fotos suyas.» a 7,2) · la escala se dibuja a 7,8 · «Idéntica es 1. Piso, 0,70.» (9-12; «Piso, 0,70.» a 10,0, cuando cae la marca «mi piso · 0,70») |
| 11,75 – 17,0 | **Imagen A** (foto A) | «Imagen A · 1 crédito» · «parecido **0,81**» (12,7) · «1 crédito» se enciende a 14,4 |
| 16,75 – 22,0 | **Imagen B** | «Imagen B · 0,5 créditos» · «parecido **0,79**» (17,7) |
| 21,75 – 27,0 | **Imagen C** | «Imagen C · 2 créditos» · «parecido **0,74**» (22,7) |
| 26,75 – 32,0 | **Imagen D** | «Imagen D · 2,5 créditos» · «parecido **0,70**» con punto **neutro** (27,7) · pastilla **«justo en el piso»** (28,7) |
| 31,75 – 37,0 | **Imagen E** | «Imagen E · 3 créditos» · «parecido **0,69**» (32,7) · sello **«bajo el piso»** (33,7) |
| 36,75 – 42,0 | **Imagen F** | «Imagen F · 2,75 créditos» · «parecido **0,66**» (37,7) · sello **«bajo el piso»** (38,7) |
| 41,75 – 47,5 | **Lección 1.** Placa: las 6 ordenadas por precio sobre la escala (B, A, C, D, F, E) | «Pagar más no la parece más.» («no la parece más.» se enciende a 45,0 cuando están las seis filas) · marca «mi piso · 0,70» · nota **«Una toma cada uno: es una prueba, no una regla.»** (42,3) · una fila cada 0,45 s: etiqueta + línea → punto → valor |
| 47,25 – 53,0 | **Lección 2.** Placa: B en tres escenas y las dos fotos del café lado a lado | «Una foto sola no mide.» (47,5-50) → **«El café: B perdió la cara.»** (50-53) · título «Imagen B · tres escenas» · fichas **0,79 · 0,35 · 0,83** (47,9 · 48,4 · 48,9) · fotos del café A (49,9) y B (50,25) con su pie **«Imagen A · café 0,83»** / **«Imagen B · café 0,35»** · anillo sobre la ficha de 0,35 (50,95) |
| 52,75 – 57,0 | **Cierre:** la foto A otra vez (la misma del gancho) | «Seguime: cada semana, una prueba.» (53-57; «cada semana, una prueba.» a 54,2) |

Tarjetas: todas ≤ 6 palabras y ≥ 0,35 s por palabra + 0,3 s (lo valida `build.mjs`; el mínimo más justo es c1/c3/c11/c13 con 6 palabras: 2,4 s necesarios, 2,9-5,5 s disponibles).
Cada tarjeta entra 1 cuadro antes de que termine la anterior; en los empujes viajan con la imagen. **Medido:** solo los cuadros 0-2 (el gancho entra a 0,1 s) no tienen tarjeta (`qa/hueco-tarjetas.txt`).
Todo texto que no es tarjeta (rótulo, datos, sellos, pastilla, filas, fichas, pies: **32 textos**) cumple también 0,35 s por palabra + 0,3: lo valida `build.mjs` desde el plan (`qa/tabla-de-cortes-y-lecturas.txt`) y `scripts/ventanas.mjs` lo mide en el DOM cuadro a cuadro (`qa/ventanas-de-lectura.txt`); el más justo es el rótulo de IA (2,54 s para 2,40).
Eventos visuales: 87; el hueco máximo es **2,80 s** (54,2 → 57,0: «Seguime» sostenido, lo único que queda en pantalla es el CTA), el siguiente 2,50 s (`qa/eventos-visuales.txt`).

## Costuras — la corriente va a la IZQUIERDA (`motion-doctrine`), sin excepciones
Empuje rígido de 6 cuadros (0,25 s, `power3.inOut`): lo que sale va de 0 a −1080 y lo que entra de +1080 a 0, misma curva, pegados borde con borde. **10 empujes** (6,0 · 12,0 · 17,0 · 22,0 · 27,0 · 32,0 · 37,0 · 42,0 · 47,5 · 53,0).
El medio entrante arranca en T−6 cuadros; las tarjetas viajan con el empuje. Las fotos van en un contenedor `overflow:hidden` que es el que viaja; el zoom lo hace la `<img>` de adentro: los bordes siguen rígidos aunque la foto esté al 1,04.
**Mirado** en el preview 360p y en el final a resolución completa (`qa/hoja-costuras-1/2.jpg`): ningún cuadro vacío, ninguna tira de fondo. Con la `power3.inOut` el movimiento ocupa los cuadros T−3 a T−1.
Como las fotos son fijas, **T es el segundo del guion** (el empuje termina en T), a diferencia de G2 (donde el clip arrancaba al inicio del empuje y las tarjetas llevaban +0,25 s).

## Cambios respecto del guion y decisiones que la madre puede revertir
1. **Tarjeta de la lección 2: «El café: B perdió la cara.» (6 palabras)** en vez de «B perdió la cara en el café.» (**7 palabras: el guion se pasa de su propio máximo de 6**, y `build.mjs` corta). Mismo contenido. Revertir: `plan.json → c13` (y subir el máximo en `build.mjs`).
2. **El dato lleva la palabra «parecido»** («parecido 0,81»): el número solo no dice qué mide. Y es **más grande que el resto de la pastilla** (64 px) porque es el dato de la escena. Revertir: `build.mjs`.
3. **«Una toma cada uno: es una prueba, no una regla.»** va como nota en la placa de la lección 1 (la que ordena por precio y sugiere ranking). El guion dice que «una tarjeta» lo dice, sin decir cuál. Ojo: A y B tienen tres escenas; en la lección 1 (una escena, seis imágenes) la frase es exacta, y en la lección 2 no se repite. Revertir: `plan.json → l1.nota`.
4. **Imagen D con punto y pastilla NEUTROS** (blanco) y la pastilla «justo en el piso»: 0,702 cumple por poco y el guion pide no anunciarla como aprobada. Revertir: `plan.json → imagenes[d].estado = "ok"`.
5. **Marca «mi piso · 0,70»** (el guion dice «Piso, 0,70.»): deja claro que el piso lo fijó la sesión, no una frontera objetiva (igual que G2).
6. **Las 8 referencias se muestran TODAS** (cuadrícula 4x2), no una muestra de 5 como en G2: «Se mide contra 8 fotos suyas.» se ve literal y no hace falta la etiqueta «5 de las 8».
7. **Cierre con la FOTO A** (la orden era «sin clips»; el guion admitía la foto o el clip K1). Hace de marco con el gancho. Revertir: poner el clip K1 como en G2 (de 2,0 a 5,5 s, H7 de G2).
8. **El rótulo de IA se ve entero de 0 a 2,4 s** y recién ahí sale (en G2 salía dentro de esos 2,4 s): 2,4 s legibles para sus 6 palabras.
9. **Empuje lento 1,00 → 1,04** sobre cada foto (línea recta, origen en la cara medida): la orden era «movimiento mínimo». Revertir: `plan.json → zoom.fin = 1`.
10. **Tarjetas de las imágenes con acento tardío** (los créditos se encienden a mitad de escena): evento visual barato para que ningún tramo de foto fija pase de 2,8 s sin evento. Sin texto nuevo.
11. **Lo que el video no afirma:** que un motor sea «mejor» en general. Sin marcas de terceros (grep limpio), sin profesión (el ambo es vestuario, ninguna frase dice dónde está), sin resultados ni clientes. Las únicas cifras son medidas (créditos y parecido).
12. **Agregados al guion con su forma de revertir:** `plan.json → agregados_al_guion` (A1-A9).

## Lo que el video afirma, contra los datos (`build.mjs` corta si alguna falla; `qa/tabla-de-cortes-y-lecturas.txt`)
- «Pagar más no la parece más»: la más cara (E, 3 cr, 0,691) queda bajo la de 1 cr (0,806) y la de 0,5 cr (0,794); ninguna de las que cuestan más que A la parece más que A.
- Pie: «el que ya uso la sostuvo en tres escenas» (A: 0,806 · 0,83 · 0,839, todas ≥ 0,70) y «el más barato la perdió en una de tres» (B: 0,794 · 0,35 · 0,831).
- «bajo el piso»: E (0,691) y F (0,658). D (0,702) cae «justo en el piso». Lección 2: B 0,79 · 0,35 · 0,83 y café A 0,83 contra B 0,35.

## QA medido (final `out/g4-final-1080x1920.mp4`)
- `ffprobe`: H.264 1080x1920, 24 fps, **57,000 s** (1368 cuadros), bt709, 9,6 Mbps; AAC 48 kHz estéreo −91 dB (`qa/specs-final.txt`). Preview 360p REAL: 360x640, 1368 cuadros, render de HyperFrames de la misma composición, no un reescalado (1 min 11 s; el final 3 min 14 s, 4 núcleos, sin GPU).
- `hyperframes check`: 0 errores y 0 avisos de runtime, layout y motion; contraste **15/15 AA**; 31 avisos de estilo (27 `nested_structure_needs_subcomposition`, 2 `timeline_track_too_dense`, 1 `duplicate_media_discovery_risk` por la foto A usada tres veces, 1 `composition_heavy_overlay_count_high`) que no frenan; la `<img>` con zoom lleva `data-layout-allow-overflow` (el contenedor recorta a propósito).
- **Zona segura en el DOM** (`scripts/medir-dom.mjs`, 456 instantes cada 3 cuadros, 1858 cajas de texto): todo texto entre mentón+40 y y=1490 (el mentón sale de `qa/caras-fotos.json` y se corre con el zoom de cada instante), nada sobre y=280, nada en x>1000 bajo y=1000, ningún texto < 34 px (mínimo 34: el rótulo de IA; los demás 36-84), ningún texto se pisa con otro y los 6 cuadros de cada empuje se saltan. **Margen mínimo entre el mentón y el texto de abajo: 61 px** (el rótulo de IA, y=720 contra mentón 659; la regla pide 40). La pila de dato/sello arranca en y=1114-1208 y la cara más baja (B) termina en 836. **Los datos están donde dice el número** (punto y marca a 100 + 880 × valor, ±1,5 px; D cae exactamente sobre la marca) y cada número en pantalla coincide con el del plan — `qa/zona-segura.txt`.
- `grep-prohibidas` sobre pantalla y pie: **0 coincidencias** (sin marcas de terceros —incluidos los seis motores y los teléfonos—, sin promesas, sin «paciente/clínica/doctora», sin «no sé»). «Imagen» es la palabra, no una marca.
- `hueco-tarjetas`: solo los cuadros 0-2 sin tarjeta. `vacios.py`: **0 cuadros planos**; saltos de luma ≤ 52,6 en los 10 empujes (foto clara ↔ placa oscura, repartidos en 3 cuadros) y ≤ 5,0 fuera de ellos (`qa/vacios-y-saltos.txt`).
- **PSNR contra la fuente** (`scripts/psnr-fotos.py`, franja y 0-900, 24 cuadros): en todos el pico es la foto del plan (**34,9-41,7 dB** contra **9-14 dB** de las otras siete) y el pico de zoom cae en la escala del plan (probadas −0,02 a +0,02): ninguna foto cruzada ni empuje lento corrido (`qa/psnr-fotos.txt`).
- Cara del final contra la fuente en el MISMO zoom: diferencias ≤ **0,015** (`qa/face-gate-final.txt`).
- Mirado renderizado (hojas de contacto del FINAL a 1080x1920 con guías y recortes a resolución completa): cuadro 0 (rótulo y foto), las seis escenas con su dato, las dos placas a resolución completa, los 10 empujes cuadro por cuadro y el último cuadro (`qa/hoja-qa-1/2/3.jpg`, `qa/hoja-costuras-1/2.jpg`). Las guías de las hojas: rojo y=1490, magenta x=1000 desde y=1000, cyan y=707 y y=887 (estas dos son del mentón de K1 y de la foto descartada de G3: valen solo para la foto A, no para las otras).
- Copia de entrega recodificada (libx264 crf 21, máx. 6 Mbps; salió a 1,9 Mbps de video por ser casi todo estático): PSNR contra el original **47,2 dB** de promedio, **43,2 dB** en el peor cuadro; 57,00 s, 24 fps, audio copiado (`qa/psnr-entrega.txt`).

## Audio
La pista es silencio (−91 dB) y NO se agregan pops en las costuras, a propósito (dejan sitio a la música de Sergio Urcullo). Si se quiere un golpe por costura: 5,75 / 11,75 / 16,75 / 21,75 / 26,75 / 31,75 / 36,75 / 41,75 / 47,25 / 52,75 s (inicio de cada empuje).

## Publicación
Portada: cuadro a 0,6 s (`qa/portada-0.6s.jpg`). El pie va tal cual en `pie.txt`; las notas de edición van aquí, no en el pie. Etiqueta «Información de IA» por API; la vía real es `ig-reel.mjs --cuenta lucia` en el VPS (la madre).
Según `CLAUDE.md` § «Qué se publica sin preguntar» pasa por el control de calidad y se publica sin pedir el OK pieza por pieza **cuando la madre valide el guion** (G4 sale después de G2 y antes del carrusel C2). Esta sesión no publica nada.

## Reproducir
```bash
node scripts/build.mjs                      # copia el material (fotos JPG del repo, fuentes), baja las referencias por curl (0 cr), valida y escribe index.html
                                            # ⚠️ ref1-8.jpg, th-*.jpg y cf-*.jpg se generan SOLO si faltan (ffmpeg, lanczos); si cambia una caja en plan.json, borrar el derivado antes
export PRODUCER_HEADLESS_SHELL_PATH=/opt/pw-browsers/chromium HYPERFRAMES_SKIP_SKILLS=1
npx -y hyperframes@0.8.142 check
# 1) BORRADOR 360p REAL primero (~1 min 11 s). Mirar las costuras ahí. Lanza 1 «error» de lint (root_zoom_rescales_a_fixed_canvas) y 1 aviso: NO frenan, no usar --strict
node scripts/borrador-360.mjs /ruta/a/draft360 && (cd /ruta/a/draft360 && npx -y hyperframes@0.8.142 render --quality draft -f 24 -o /ruta/draft.mp4)
# 2) recién después el final (~3 min 14 s, 4 núcleos, sin GPU; 9,6 Mbps)
npx -y hyperframes@0.8.142 render --quality high -f 24 -o renders/final-raw.mp4
ffmpeg -y -i renders/final-raw.mp4 -f lavfi -t 57 -i anullsrc=r=48000:cl=stereo -map 0:v -map 1:a -c:v copy -c:a aac -b:a 128k -shortest -movflags +faststart out/g4-final-1080x1920.mp4
node scripts/medir-dom.mjs && node scripts/hueco-tarjetas.mjs && node scripts/grep-prohibidas.mjs && node scripts/eventos.mjs && node scripts/ventanas.mjs
export FACE_GATE_HOME=…/lucia-face-gate     # fuera del repo; venv con numpy, cv2, onnxruntime
$FACE_GATE_HOME/venv/bin/python scripts/psnr-fotos.py out/g4-final-1080x1920.mp4 > qa/psnr-fotos.txt
$FACE_GATE_HOME/venv/bin/python scripts/vacios.py out/g4-final-1080x1920.mp4 > qa/vacios-y-saltos.txt
$FACE_GATE_HOME/venv/bin/python scripts/medir-caras.py --refs assets/refs-orig > qa/caras-fotos.json     # SCRFD: cajas de las 8 fotos y recortes de las 8 referencias
$FACE_GATE_HOME/venv/bin/python scripts/fuente-con-zoom.py out/g4-final-1080x1920.mp4 /ruta/fgf > args.txt && bash .claude/skills/lucia/scripts/face-gate.sh $(cat args.txt)   # final contra fuente en el mismo zoom
COLS=6 bash scripts/hoja.sh out/g4-final-1080x1920.mp4 hoja.jpg 270 f0 f48 f287 …                  # «fNNN» = cuadro NNN exacto
ffmpeg -i out/g4-final-1080x1920.mp4 -c:v libx264 -preset slow -crf 21 -maxrate 6M -bufsize 12M -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -c:a copy -movflags +faststart ../lucia-entrega/g4-final-1080x1920.mp4
```
