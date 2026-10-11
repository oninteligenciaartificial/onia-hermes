# Lucía · G4 v2 «Seis motores de imagen, una cara: ¿cuál la conserva?» (28,04 s, 1080x1920, 24 fps)

Re-corte de `videos/lucia-g4/` (59,75 s) pedido por la madre el 11-oct-2026: **sin aire muerto** (regla 15), **26-30 s** y **cronometrado para una voz que se agrega después**.
Montaje con HyperFrames 0.8.142 y el método de G1-G5 (`.claude/skills/lucia/montaje-hyperframes.md`). **Costo: 0 créditos** (fotos ya pagadas el 8-oct, 8 referencias oficiales; ningún servicio pago ni de voz).
**Estado: PARA VER POR LA MADRE (preview 360p). No se publica nada.** Sin voz ni música: pista AAC en silencio (−91 dB) a propósito.
El guion aprobado el 10-oct (`hermes-content/docs/cola/lucia-diario/guiones/G4-seis-motores-de-imagen-una-cara.md`) manda en cifras y límites; este re-corte cambia la forma, no los datos. El pie nuevo es `pie.txt`, no el del guion.

**D-N1 (11-oct-2026, decisión de Sergio Urcullo, transmitida por la madre): los motores se NOMBRAN**, como uso propio y no como recomendación pagada. Se reemplazó «Imagen A a F» por los nombres reales en tarjetas, rótulos de fila, pies de foto, `guion-voz.txt`, `pie.txt`, `plan.json` y las validaciones (`build.mjs` y `grep-prohibidas.mjs` solo dejan de prohibir estas seis herramientas; todo lo demás sigue prohibido, incluido «Omni» y «ChatGPT»).
Equivalencias (la clave de PROCEDENCIA se comprueba en el build): **Seedream 4.5** 1 cr · **Kling O1 Image** 0,5 cr (el guion lo llamaba «Kling Omni Image»; O1 Image es el nombre con que Higgsfield lo lista) · **Nano Banana 2.1** 2 cr · **Seedream 5.0 Pro** 2,5 cr · **FLUX 3** 3 cr · **GPT Image 2.5** 2,75 cr.
Siguen valiendo: rótulo de IA, CTA exacto, piso 0,70 «lo elegí yo» (marca «mi piso · 0,70» y la voz), «Una toma cada uno: es una prueba, no una regla.» y «Entre 0,66 y 0,70 la diferencia es ruido (±0,03).» (44 px), fotos limpias de C y E, nada de «el mejor» ni de recomendación general (el grep lo corta).

| Qué | Dónde |
|---|---|
| Plan de capas, tiempos, datos, costuras, énfasis | `plan.json` |
| Voz de Lucía en voseo, UNA línea por tramo, 448 caracteres con saltos (cupo 450). **No se generó audio.** | `guion-voz.txt` |
| Generador: valida reglas, cronograma de la voz y **cada cifra y afirmación contra `v4/PROCEDENCIA.jsonl`** → escribe `index.html` | `scripts/build.mjs` + `scripts/estilos.css` + `scripts/timeline.js` |
| Controles (todos en Node + ffmpeg + el Playwright de `/opt/node-tools`; nada se instaló) | `scripts/aire.mjs` · `eventos.mjs` · `hueco-tarjetas.mjs` · `ventanas.mjs` · `medir-dom.mjs` · `costuras.mjs` · `vacios.mjs` · `psnr-fotos.mjs` · `grep-prohibidas.mjs` · `lib-dom.mjs` |
| Material que el build necesita sin red (8 recortes de las referencias con su origen, GSAP) | `assets-fijos/` (versionado) |
| Preview 360p (render REAL de HyperFrames a 360x640 de la MISMA composición, con AAC en silencio) | `qa/g4-v2-preview-360p.mp4` |
| Final 1080x1920 con AAC en silencio (**master**, ignorado en git, 27,8 MB) | `out/g4-v2-final-1080x1920.mp4` |
| **SHA-256 del final** | `fd7769e80fba19a85cecf4ac3df05a0e76a51450050c57913ea624b34825fe32` (`qa/sha256-final.txt`) |
| Pie para publicar (abre con «personaje hecho con IA»; lo comprueba `build.mjs`) | `pie.txt` |
| Portada sugerida (cuadro a 0,6 s) | `qa/portada-0.6s.jpg` |
| Medición del aire (mayor tramo quieto, eventos por 10 s) | `qa/aire.txt` |

## Cronograma de la voz (cada tramo dura palabras ÷ 3,6 s; huecos de 0,25 s; empieza a 0,10 s)
El cronograma de la imagen sigue estos tramos: **cada costura cae en el comienzo de un tramo** (el build lo comprueba a ±½ cuadro). El video termina 1,03 s después de la última palabra, para que el CTA se lea entero (2,42 s en pantalla; pedido: 2,4 a 5,5 s).

| Tramo | t (s) | Palabras · car. | Línea para la voz | Qué se ve mientras tanto |
|---:|---|---|---|---|
| 1 | 0,10 – 1,77 | 6 · 30 | A ver, ¿cuál conserva su cara? | gancho, c1 |
| 2 | 2,02 – 4,52 | 9 · 44 | Probé la misma orden en 6 motores de imagen. | c2 + 6 miniaturas |
| 3 | 4,77 – 6,16 | 5 · 26 | Medí contra 8 fotos suyas. | las 8 referencias |
| 4 | 6,41 – 8,07 | 6 · 31 | Piso cero setenta: lo elegí yo. | marca «mi piso · 0,70» |
| 5 | 8,32 – 9,99 | 6 · 38 | Seedream, con un crédito, la sostiene. | Seedream 4.5 |
| 6 | 10,24 – 12,74 | 9 · 42 | Seedream Pro, 2 y medio: justo en el piso. | Seedream 5.0 Pro |
| 7 | 12,99 – 14,93 | 7 · 32 | FLUX, el más caro, bajo el piso. | FLUX 3 |
| 8 | 15,18 – 17,41 | 8 · 39 | Y ojo: pagar más no mejoró el parecido. | lección, c7 |
| 9 | 17,66 – 19,88 | 8 · 40 | Fue una toma cada uno: prueba, no regla. | nota 1 (ya en la placa) |
| 10 | 20,13 – 22,63 | 9 · 42 | Si dos puntajes se rozan, eso ya es ruido. | nota 2 + franja |
| 11 | 22,88 – 25,38 | 9 · 40 | En la escena 2, el Kling perdió la cara. | escena 2 |
| 12 | 25,63 – 27,02 | 5 · 33 | Seguime: cada semana, una prueba. | CTA |

Se dicen en voz «Seedream», «Seedream Pro», «FLUX» y «el Kling»; **«Nano Banana 2.1», «GPT Image 2.5» y los números de versión solo se leen** (comen caracteres y la voz los diría como «dos punto uno»). Los números de la voz van en palabras o en cifras que ElevenLabs dice igual en español («6», «8», «escena 2», «2 y medio»): una cifra con coma («0,70») se dice como tres palabras y desajusta el reloj.
**Cuando haya voz:** medir cada línea; si alguna dura distinto de palabras ÷ 3,6, cambiar `plan.json → voz.palabras_por_s` o el texto y volver a derivar las costuras (la tabla de arriba sale de `node scripts/build.mjs`).

## Tabla de cortes (T = comienzo de la escena en reposo; el empuje rígido de 6 cuadros ocupa T−0,25 a T)
| t (s) | Capa | Texto en pantalla |
|---|---|---|
| 0,00 – 4,75 | **Foto de Seedream 4.5** fija, empuje lento 1,00 → 1,04 | rótulo «Lucía Antelo · personaje IA de Onia» del cuadro 0 a 3,0 s a 40 px · c1 **«¿Cuál conserva su cara?»** 0,10-2,04 (acento «su cara?» 1,2) · c2 **«Misma orden. Seis motores de imagen.»** 2,04-4,75 (acento 3,4) con las 6 miniaturas (sin letras) entrando de 2,10 a 2,70 |
| 4,50 – 8,33 | **Regla.** Placa: 4 referencias presentes, 4 entran 4,75-5,05; escala 4,95; «idéntica · 1» 5,20 | c3 **«Contra 8 fotos suyas. Piso: 0,70.»** (UNA tarjeta, 5,50-8,33; acento «Piso: 0,70.» 6,4) · marca «mi piso · 0,70» cae a 6,35 |
| 8,08 – 10,25 | **Seedream 4.5** | c4 «Seedream 4.5 · 1 crédito» (acento «1 crédito» 8,9) · «parecido 0,81» 8,68 (su cifra se enciende en verde a 9,58) |
| 10,00 – 13,00 | **Seedream 5.0 Pro** | c5 «Seedream 5.0 Pro · 2,5 créditos» (acento 10,8) · «parecido 0,70» 10,65 · pastilla neutra «justo en el piso» 10,90 (golpe 11,8; el dato 12,3) |
| 12,75 – 15,17 | **FLUX 3** (foto limpia) | c6 «FLUX 3 · 3 créditos» (acento 13,5) · «parecido 0,69» 13,35 · sello «bajo el piso» 13,50 (golpe 14,5) |
| 14,92 – 22,88 | **Lección.** Placa con los 6 motores por precio sobre la escala (filas de 15,31 a 16,31, cada 0,2 s; pulsos Seedream 4.5 y FLUX 3 a 16,87 y 17,47) | c7 **«Pagar más no mejoró el parecido.»** 15,17-17,75 (acento 16,6) · **nota 1 a 44 px «Una toma cada uno: es una prueba, no una regla.»** ya en la placa al llegar (15,17) · **nota 2 «Entre 0,66 y 0,70 la diferencia es ruido (±0,03).»** a 18,97 · franja 0,66-0,70 a 20,17 · pulsos de Seedream 5.0 Pro, FLUX 3 y GPT Image 2.5 a 20,57 / 20,87 / 21,17 |
| 22,63 – 25,63 | **Escena 2.** Placa con las dos fotos del café (430x764): Seedream 4.5 ya está al llegar; Kling O1 Image entra a 23,21, su pie a 23,46 y el anillo a 24,00 | c8 **«Escena 2: Kling perdió la cara.»** 22,88-25,63 (acento 24,3) · pies «Seedream 4.5 0,83» y «Kling O1 Image 0,35» |
| 25,38 – 28,04 | **Cierre:** foto K4·5 (Lucía mira a cámara y sonríe) con empuje lento | c9 **«Seguime: cada semana, una prueba.»** 25,63-28,04 (acento 26,2; la raya de la tarjeta pulsa a 27,63 como último evento) |

Costuras: 7 empujes rígidos de 6 cuadros a la izquierda en T = 4,750 · 8,333 · 10,250 · 13,000 · 15,167 · 22,875 · 25,625 s. Las tarjetas **y el dato, la pastilla y el sello** viajan con la imagen que los lleva (así ganan tiempo de lectura).

## Qué se quitó de G4 y por qué (59,75 s → 28,04 s)
| Quitado | Por qué |
|---|---|
| Las escenas completas de **B, C y F** (3 × 5 s) | El contraste esencial cabe en tres: el que sostiene (Seedream 4.5), el que queda justo en el piso (Seedream 5.0 Pro) y el más caro bajo el piso (FLUX 3). Los seis siguen visibles: las 6 miniaturas del gancho y las 6 filas de la lección con su cifra, para que el «pagar más no mejoró» no dependa de tres elegidos |
| La **tabla de tres escenas** de A y B y las tarjetas «Imagen A: la sostuvo en tres.» y «Una foto sola no mide.» | 5,5 s de lectura. Queda la escena 2 con el par del café (Seedream 4.5 0,83 contra Kling O1 Image 0,35). **El pie ya no dice «tres escenas» ni «una de tres»** (el video no lo muestra) |
| La regla en **dos tarjetas** (3 s cada una) | Una sola tarjeta de 6 palabras («Contra 8 fotos suyas. Piso: 0,70.») que entra cuando ya llegaron las referencias y sale con el empuje; «lo elegí yo» queda en la voz y en la marca «mi piso» |
| Los **5 s fijos por foto**, con el dato y el sello quietos 3 s | Era el aire muerto: G4 tenía un hueco de hasta 2,55 s entre eventos (`../lucia-g4/qa/eventos-visuales.txt`) y escenas de 5 s sostenidas con una tarjeta y un dato. Ahora cada escena dura lo que su línea de voz (1,9-2,8 s) y el último tramo de cada una lo llena un golpe de énfasis |
| Las filas de la lección cada 0,4 s y la espera de 4 s por la nota 2 | Filas cada 0,2 s; la nota 1 ya está en la placa al llegar y la 2 entra cuando la 1 terminó de leerse (3,8 s), el piso de lectura que no se puede acortar: **la lección dura 7,71 s porque las dos notas de honestidad piden 7,25 s** |
| Las letras A-F en las miniaturas y las «Imagen X» | D-N1: ahora se lee el nombre real |

## Decisiones que la madre puede revertir (todas en `plan.json`; la que cambia texto, también en `guion-voz.txt`)
1. **«Escena 2: Kling perdió la cara.»** (la tarjeta usa «Kling» a secas para caber en 6 palabras; el pie de la foto dice «Kling O1 Image»). Con el nombre completo la tarjeta tiene 8 palabras y rompe el tope de 6.
2. **Énfasis de cierre en cada escena de motor** (un golpe de escala del dato, la pastilla o el sello, y el número de Seedream 4.5 pasa a verde): son los eventos que cubren el último tramo antes del empuje. Revertir = `imagenes[].enfasis = []` y `aire.mjs` falla.
3. **Pulsos en la lección** (Seedream 4.5 y FLUX 3 a 16,87 / 17,47; Seedream 5.0 Pro, FLUX 3 y GPT Image 2.5 dentro de la franja): evitan 2,4 s sin evento antes de la nota 2.
4. **La A del café se muestra junto a la B** (comparación en la misma escena); sin ella la escena 2 sería más corta, pero Kling O1 Image quedaría sin referencia.
5. **Tarjetas que se quedan más que su lectura** (medido en `qa/hueco-tarjetas.txt`): c5 sobra 0,66 s, c6 0,43, c8 0,31, c9 0,45 y la nota 1 3,87 (la nota 2 la releva). En todas hay otro texto en lectura o un evento en pantalla (pastilla, sello, pie, nota), y `aire.mjs` mide que ningún tramo queda idéntico más de 0,21 s. Si la regla 15 se lee «la tarjeta sale al terminar su lectura», hay que hacer salir c5, c6, c8 y c9 antes y dejar solos los datos: pídalo y se hace.
6. **El CTA dura 2,42 s** (el mínimo del pedido es 2,4) y el video termina 1,03 s después de la última palabra de la voz.
7. **Las referencias**: 4 llegan con la placa y 4 entran (antes entraban las 8: la placa llegaba casi vacía).
8. El pie suma «Nombro lo que uso; no es una recomendación pagada.» (D-N1) y nombra los seis motores; ya no menciona «el que ya uso».

## Lo que el video afirma, contra los datos (`build.mjs` corta si alguna falla; `qa/build-y-cronograma.txt`)
- «Pagar más no mejoró el parecido»: FLUX 3 (3 cr, 0,691) queda bajo Seedream 4.5 (1 cr, 0,806) y Kling O1 Image (0,5 cr, 0,794); ninguno de los que cuestan más que Seedream 4.5 lo supera.
- «Seedream… la sostiene» 0,806 ≥ 0,70 · «justo en el piso» Seedream 5.0 Pro 0,702 (entre 0,70 y 0,71) · «bajo el piso» FLUX 3 0,691 y GPT Image 2.5 0,658 · franja 0,66-0,70: GPT Image 2.5, FLUX 3 y Seedream 5.0 Pro caen adentro.
- «Escena 2: Kling perdió la cara»: Seedream 4.5 da 0,83 y Kling O1 Image 0,35 en esa escena. Kling O1 Image es el más barato (0,5 cr). Todo número en pantalla = el de PROCEDENCIA redondeado a 2 decimales.
- No afirma que un motor sea «mejor» en general, ni promete nada de Onia; sin logos incidentales (C y E son las copias limpias de `v4/prueba-motores-20261008/fotos-limpias/`), sin profesión, sin cara ni voz de Sergio Urcullo.

## QA medido (final `out/g4-v2-final-1080x1920.mp4`; los resultados están en `qa/`)
| Control | Resultado | Archivo |
|---|---|---|
| `build.mjs`: tope de 6 palabras, lectura, costuras, cronograma de la voz (≤ 450 car., huecos ≤ 0,25 s, 26-30 s, CTA 2,4-5,5 s), cifras y afirmaciones, frases exactas, pie | **ok** | `qa/build-y-cronograma.txt` |
| `hyperframes check` | **0 errores, 0 avisos** de runtime, layout y motion; contraste **31/31 AA**; 22 avisos de estilo que no frenan; 3 «info» de layout = la primera costura a mitad del empuje (la tarjeta c2 y la miniatura F ya van saliendo) | `qa/hyperframes-check.txt` |
| `aire.mjs` (regla 15) en el DOM | mayor tramo quieto **0,208 s** (estricta: solo tarjetas y notas cuentan como lectura) y **0,167 s** (completa); límite 0,3 s | `qa/aire.txt` |
| `aire.mjs` sobre los píxeles del final | placas: mayor tramo quieto fuera de lectura **0,167 s** (coincide con el DOM) | `qa/aire.txt` |
| `eventos.mjs` | 65 eventos visuales nuevos (23 por 10 s); **hueco máximo 1,68 s** (límite 2,0 s) | `qa/eventos-visuales.txt` |
| `hueco-tarjetas.mjs` | cada tarjeta y nota se lee entera; holguras 0,09-0,66 s; sobras por tarjeta (ver decisión 5) | `qa/hueco-tarjetas.txt` |
| `ventanas.mjs` | **34 de 34** textos alcanzan 0,35 s por palabra + 0,3 s en la ventana REAL (empujes incluidos); holgura más justa c1 con 0,09 s | `qa/ventanas-de-lectura.txt` |
| `medir-dom.mjs` | todo texto entre mentón+40 y y=1490, nada sobre y=280, ninguno < 34 px (rótulo 40 px, notas 44 px), ningún texto se pisa; **margen mínimo mentón-texto 60 px**; los puntos y la franja están donde dice el número (±1,5 px); los nombres de fila terminan 82 px antes de la marca de 0,70; la escena 2 no tapa ninguna foto | `qa/zona-segura.txt` |
| `costuras.mjs` | **7 de 7** empujes rígidos: junta borde con borde 0,00 px en los 7 cuadros, empiezan en T−6 y terminan en T; lo que viaja se desvía 0,00 px | `qa/costuras-rigidas.txt` |
| `vacios.mjs` | **0 cuadros planos**; saltos de luma solo en los empujes (foto clara ↔ placa oscura); fuera de ellos ≤ 8,2 | `qa/vacios-y-saltos.txt` |
| `psnr-fotos.mjs` | **15 de 15** cuadros: el pico es la foto del plan y el zoom del plan (29,4-38,6 dB contra ≤ 14,5 dB de las otras 8); en la caja de la cara ≥ 31,6 dB | `qa/psnr-fotos.txt` |
| `grep-prohibidas.mjs` | 0 coincidencias en pantalla, pie y voz; las 14 frases obligatorias están | `qa/grep-prohibidas.txt` |
| `ffprobe` | final H.264 1080x1920, 24 fps, 673 cuadros = 28,042 s, bt709, 7,9 Mbps; AAC 48 kHz estéreo −91 dB. Preview 360x640, 673 cuadros | `qa/specs-final.txt`, `qa/specs-preview-360p.txt` |
| Mirado | 5 hojas de contacto a 2 cuadros por segundo del FINAL (57 cuadros, con las guías y=1490 / x=1000) leídas una por una | `qa/hoja-2fps-1…5.jpg` |
| `build.mjs` repetido | `index.html` idéntico (`cmp`) al que se renderizó | `qa/index-idempotente.txt` |
| Fotos | las 9 fotos del montaje tienen el mismo SHA que las de G4: los puntajes de cara medidos en G4 (0,806 · 0,794 · 0,724/0,737 · 0,707 · 0,687/0,690 · 0,672; limpias dentro de 0,02) siguen valiendo | `qa/procedencia-fotos.txt`, `qa/face-gate-heredado-de-g4.txt` |

Hallazgos del mirado que se corrigieron antes del render: (1) la placa de la regla llegaba casi vacía (0,6 s con 3 referencias) → 4 referencias ya están al llegar y la escala se dibuja antes; (2) la tarjeta «Seedream 5.0 Pro · 2,5 créditos» partía el nombre en dos líneas («Seedream 5.0 / Pro») → espacios de no separación: el corte cae entre el nombre y el costo.

## Lo que no se pudo cerrar (dicho de frente)
1. **El control de cara ArcFace (`face-gate.sh`) no se volvió a correr sobre el final**: pide `pip install` de `onnxruntime`/`opencv`/`numpy` y bajar el modelo `buffalo_l` (~280 MB), y `CLAUDE.md` exige aprobación antes de instalar. Sustituto: las fotos son **idénticas** a las de G4 (SHA) y el PSNR del final contra la foto fuente al mismo zoom, medido en la caja de la cara, da ≥ 31,6 dB en 15 cuadros (la cara no se deformó con el escalado ni el H.264). `psnr-fotos.py`, `vacios.py` y `medir-caras.py` de G4 (numpy/cv2) se reemplazaron por `.mjs` con ffmpeg; `medir-caras.py` queda sin correr porque `qa/caras-fotos.json` es el de G4 (mismas fotos).
2. **La «regla 15» de `edicion-referentes` no está escrita en la copia del repo** (la skill termina en la regla 14 de «Reglas medidas el 8-oct»). Apliqué los criterios tal como los dio el encargo: pausa ≤ 0,3 s entre frases, ningún tramo de más de 0,3 s con la pantalla idéntica y sin una tarjeta en lectura, un evento nuevo como máximo cada 2,0 s. Si la regla escrita en otra rama dice algo más, hay que pasarla por `aire.mjs`.
3. **«Tarjeta en lectura»**: lo medí de dos maneras (estricta: solo las tarjetas y las notas; completa: cualquier texto con tiempo de lectura). Las dos pasan; la estricta lo logra con los golpes de énfasis (decisión 2).
4. **No hubo revisor independiente** ni vi el video en un teléfono con la interfaz de Instagram.
5. `hyperframes check` no vio el `index.html` de un render con voz: la voz real puede durar distinto (ver «Cuando haya voz»).
6. La B del café (Kling O1 Image, 0,35) en la placa se ve como una mujer parecida pero otra persona; el pie dice su nombre y su cifra, y la tarjeta que perdió la cara. La foto es la misma que aprobó la madre el 10-oct.

## Reproducir
```bash
node scripts/build.mjs                      # copia el material (fotos JPG del repo —C y E las limpias—, fuentes y assets-fijos/), valida y escribe index.html; imprime el cronograma de la voz
export PRODUCER_HEADLESS_SHELL_PATH=/opt/pw-browsers/chromium HYPERFRAMES_SKIP_SKILLS=1
npx -y hyperframes@0.8.142 check
# 1) BORRADOR 360p REAL primero (~40 s). Lanza 1 «error» de lint (root_zoom_rescales_a_fixed_canvas): NO frena, no usar --strict
node scripts/borrador-360.mjs /ruta/a/draft360 && (cd /ruta/a/draft360 && flock /tmp/hf-render.lock npx -y hyperframes@0.8.142 render --quality draft -f 24 -o preview.mp4)
# 2) recién después el final (~1 min 35 s, 4 núcleos, sin GPU). SIEMPRE con flock: nunca dos renders a la vez en esta máquina
flock /tmp/hf-render.lock npx -y hyperframes@0.8.142 render --quality high -f 24 -o renders/final-raw.mp4
ffmpeg -y -i renders/final-raw.mp4 -f lavfi -t 28.0417 -i anullsrc=r=48000:cl=stereo -map 0:v -map 1:a -c:v copy -c:a aac -b:a 128k -shortest -movflags +faststart out/g4-v2-final-1080x1920.mp4
for s in medir-dom ventanas hueco-tarjetas costuras eventos grep-prohibidas; do node scripts/$s.mjs; done
node scripts/aire.mjs out/g4-v2-final-1080x1920.mp4 > qa/aire.txt
node scripts/vacios.mjs out/g4-v2-final-1080x1920.mp4 > qa/vacios-y-saltos.txt
node scripts/psnr-fotos.mjs out/g4-v2-final-1080x1920.mp4 > qa/psnr-fotos.txt
COLS=6 bash scripts/hoja.sh out/g4-v2-final-1080x1920.mp4 qa/hoja.jpg 270 f0 f12 f24 …      # «fNNN» = cuadro NNN exacto (2 cuadros por segundo = de 12 en 12)
```
Trampas de esta pasada: `ventanas`/`aire` miden en el DOM con el timeline pausado (no hace falta renderizar); cambiar una medida de foto en `plan.json` exige borrar el derivado (`assets/cf-*.jpg`, `th-*.jpg`) antes de reconstruir; el hook Stop de auto-sync puede commitear a mitad de trabajo (no rompe nada: solo scripts de video).
