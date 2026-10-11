# Lucía · G5 v2 «Cómo mido si una cara es la de Lucía (y cuándo no creerle al número)» — re-corte de 26,8 s, muda, lista para voz

Re-corte de `videos/lucia-g5/` (57,5 s) con la regla de aire de la madre (pausa ≤ 0,3 s entre frases, ningún hueco que se quede quieto) y con el guion aprobado el 10-oct
(`hermes-content/docs/cola/lucia-diario/guiones/G5-como-se-mide-una-cara.md`; `VALIDACION-G4-G5-MADRE.md`) como límite de lo que se puede afirmar. HyperFrames 0.8.142, método de
`.claude/skills/lucia/montaje-hyperframes.md`. **Costo: 0 créditos** (fotos y cuadros ya pagados; no se llamó a Higgsfield, ElevenLabs ni a ningún servicio). **No se generó voz**: la pista
de audio es silencio AAC (−91 dB) a propósito; el video está cronometrado como si hablara (`guion-voz.txt`) y `scripts/poner-voz.mjs` mezcla la voz cuando exista.
**No se tocó nada fuera de esta carpeta** (`videos/lucia-g5/` y `videos/lucia-entrega/` siguen como estaban). Sin comandos git.

> **D-N1 (11-oct-2026) aplicada.** Regla nueva de Sergio Urcullo, pasada por la madre a mitad del trabajo: ahora SÍ se nombran las herramientas, como uso propio y no como recomendación pagada.
> «Imagen A» → **Seedream 4.5**, «Imagen B» → **Kling O1 Image**, «Imagen F» → GPT Image 2.5 (no sale en v2); «Motor 4» → **Seedance 2.0 Mini + referencias**, «Motor 5» → **Kling O3**,
> «Motor 6» → **Cinematic Studio 3.0**. En pantalla: pastilla «Seedream 4.5 · parecido 0,81» (gancho), pastilla «Kling O1 Image · parecido 0,35» (café) y una etiqueta fija en cada placa de clip
> («Kling O3», «Cinematic Studio 3.0», «Seedance 2.0 Mini + referencias»). Cada nombre cuenta para la lectura (0,35 s por palabra + 0,3 s: `ventanas.mjs` lo mide) y **la voz no dice ninguno**
> (los nombres comen caracteres y dicho en voz suena a veredicto de la herramienta; solo se leen). El pie suma «Nombro lo que uso; no es una recomendación pagada.» y sigue abriendo con
> «personaje hecho con IA». `grep-prohibidas.mjs` permite SOLO esos nombres completos (lista `PERMITIDAS`; «kling», «seedream», «gpt», «flux»… sueltos y cualquier otra marca siguen prohibidos) y
> prohíbe «el mejor» y frases de recomendación; `build.mjs` comprueba que cada nombre corresponda a la clave de PROCEDENCIA del archivo que se ve. No hay capturas de interfaces de terceros.
> Intactos: rótulo de IA, CTA, piso 0,70 «lo elegí yo», «cabe en ±0,03», «el medidor avisa: lo reviso a ojo» y la B del café como otra persona.

| Qué | Dónde |
|---|---|
| Final 1080x1920, H.264 + AAC en silencio, **26,833 s** (644 cuadros, 24 fps), 16,4 MB (ignorado en git) | `out/g5-v2-final-1080x1920.mp4` · **SHA-256 `72860a5532757415d97fe9bbf8aba56a7fdeccd723d9175a348e6525097af5fa`** |
| Preview 360p REAL (render de HyperFrames a 360x640 de la MISMA composición, `index.html` md5 `76180374…5b99`) | `qa/g5-v2-preview-360p.mp4` |
| Guion de la voz (voseo, una línea por tramo, 439 caracteres con saltos de línea) y su cronograma | `guion-voz.txt` · `qa/tramos-voz.json` · `qa/tramos-de-voz.txt` |
| Plan (tiempos, capas, datos, herramientas, decisiones reversibles V1-V14 y D-N1) | `plan.json` |
| Generador: valida reglas, **cronograma de voz**, cifras y afirmaciones contra `v4/PROCEDENCIA.jsonl`, nombres de herramientas, pie → escribe `index.html` y los manifiestos de `qa/` | `scripts/build.mjs` + `scripts/voz.mjs` + `scripts/estilos.css` + `scripts/timeline.js` |
| Pie para publicar (nuevo: dice lo que el video dice, abre con «personaje hecho con IA») | `pie.txt` |
| Material que el build necesita sin red (8 referencias, 2 cuadros de clips con su origen, GSAP) | `assets-fijos/` (versionado; `ORIGEN.md`) |
| Mezclar la voz cuando exista | `scripts/poner-voz.mjs` |
| QA mirado y medido | `qa/` (lista y resultados abajo) |

## Duración y cronograma de voz
La voz es `guion-voz.txt`: **una línea = un tramo**. Cada tramo dura `palabras / 3,6 s` + un hueco ≤ 0,25 s bajado al cuadro de 24 fps; las 10 tarjetas coinciden con los 10 tramos
(`build.mjs` corta si no, si el hueco pasa de 0,25 s, si el guion pasa de 450 caracteres o si la voz lleva un decimal). Palabras HABLADAS: «0 a 1» son 4 («de cero a uno»); no se dicen cifras con coma.

| Tramo | t (s) | Dura | Línea de voz (voseo) | Pal. | Car. | Voz | Hueco |
|---:|---|---:|---|---:|---:|---:|---:|
| 1 | 0,000 – 3,292 | 3,292 | ¿Cómo sé que sigue siendo ella? Lo mido con un número. | 11 | 54 | 3,06 | 0,236 |
| 2 | 3,292 – 5,208 | 1,917 | Tengo ocho fotos oficiales de ella. | 6 | 35 | 1,67 | 0,250 |
| 3 | 5,208 – 8,792 | 3,583 | Un programa las compara y da un número de 0 a 1. | 12 | 48 | 3,33 | 0,250 |
| 4 | 8,792 – 11,250 | 2,458 | Uno es idéntica. El piso lo elegí yo. | 8 | 37 | 2,22 | 0,236 |
| 5 | 11,250 – 14,000 | 2,750 | La del café queda bajo el piso: otra persona. | 9 | 45 | 2,50 | 0,250 |
| 6 | 14,000 – 17,000 | 3,000 | Cara chica: el medidor avisa y la reviso a ojo. | 10 | 47 | 2,78 | 0,222 |
| 7 | 17,000 – 19,750 | 2,750 | El mismo clip varía, pero cabe en este margen. | 9 | 46 | 2,50 | 0,250 |
| 8 | 19,750 – 22,500 | 2,750 | El número no ve letreros inventados: este lo difuminé. | 9 | 54 | 2,50 | 0,250 |
| 9 | 22,500 – 24,417 | 1,917 | Por eso, mirá la imagen entera. | 6 | 31 | 1,67 | 0,250 |
| 10 | 24,417 – 26,833 | 2,417 | Seguime: cada semana, una prueba. | 5 | 33 | 1,39 | — |

Total: **85 palabras, 439 caracteres con saltos de línea** (430 sin ellos; cupo 450), 26,833 s. **Único tramo que no sigue la regla: el 10 (CTA).** El CTA tiene que verse ≥ 2,4 s (regla de marca) y su línea habla 1,39 s:
la cola de 1,03 s la ocupa la lectura de la tarjeta (5 palabras = 2,05 s), no es aire. Por qué 26,8 y no más: con ≤ 450 caracteres (~19 por segundo) y 3,6 palabras por segundo no caben más de ~24 s de voz.

## Tabla de cortes (t = segundo del corte; el empuje rígido ocupa T−0,25 a T)
| t (s) | Capa | Texto en pantalla |
|---|---|---|
| 0,000 – 3,292 | **t1 · Foto A** (Seedream 4.5) con empuje lento 1,00 → 1,04. Rótulo «Lucía Antelo · personaje IA de Onia» del cuadro 0 a 3,0 s (40 px). Caja de cara 0,85–2,65 s y pastilla «Seedream 4.5 · parecido 0,81» 0,95–3,0 s | **«¿Cómo sé que sigue siendo ella?»** (desde el cuadro 0; «sigue siendo ella?» se enciende a 0,90) |
| 3,042 – 5,208 | **t2 · Placa paso 1:** las 8 referencias oficiales 4×2 (la fila de abajo entra 3,74–4,04; bordes verdes 4,49) | «Ocho fotos oficiales suyas.» (acento 4,09) |
| 4,958 – 8,792 | **t3 · Placa paso 2:** las 8 en fila, flecha 5,66, la escala 0-1 se dibuja 6,21, «0» e «idéntica · 1» 6,91, un **cursor** la recorre de 0 a 1 (7,61–8,51) | «Un número, de 0 a 1.» (acento 7,41) |
| – 11,250 | **t4 · misma placa:** «idéntica · 1» y el cursor se encienden 9,34; cae la marca del piso y «piso · 0,70» 9,49 | «Piso, 0,70. Lo elegí yo.» (acento 10,49) |
| 11,000 – 14,000 | **t5 · Foto del café** (Kling O1 Image; NO es Lucía), caja coral 11,55, pastilla «Kling O1 Image · parecido 0,35» 11,35–13,80 | «Bajo el piso: otra persona.» (acento coral 13,45) |
| 13,750 – 17,000 | **t6 · Placa razón 1:** cuadro de Kling O3 con la cara de **89 px**; etiqueta «Kling O3» y nota «Bajo 200 px, el medidor avisa.» ya están al llegar; caja 14,40, «89 px» 14,80, línea y lupa 15,20 | «Cara chica: lo reviso a ojo.» (acento 16,50) |
| 16,750 – 19,750 | **t7 · Placa razón 2:** escala «Zoom: 0,70 a 0,90», «Cinematic Studio 3.0» y «piso · 0,70» al llegar; punta 0,77 a 17,30, punta 0,80 a 17,75, banda ±0,03 a 18,30 | «Mismo clip: cabe en ±0,03.» (acento 19,10) |
| 19,500 – 22,500 | **t8 · Placa razón 3:** cuadro con el letrero **difuminado**, «Seedance 2.0 Mini + referencias» y «Lo difuminé: lo inventó el motor.» al llegar; aro 20,05; «parecido 0,80» 20,75; el aro vuelve a marcar 21,70 | «El número no ve letreros inventados.» (acento 21,25) |
| 22,250 – 24,417 | **t9 · Foto K4·5** (Lucía mira a cámara y sonríe) con empuje lento | «Mirá la imagen entera.» (acento 23,50) |
| 24,417 – 26,833 | **t10 · Cierre** (misma foto) | **«Seguime: cada semana, una prueba.»** (2,417 s; se enciende a 26,32) |

7 empujes rígidos de 6 cuadros (3,29 · 5,21 · 11,25 · 14,00 · 17,00 · 19,75 · 22,50). Las tarjetas viajan con la imagen. Entre t3-t4 y t9-t10 no hay empuje: cambia solo la tarjeta.

## Qué se quitó de G5 y por qué
| Quitado | Por qué |
|---|---|
| Ejemplo **F** (0,66 «bajo el piso», 3,25 s) | No es de lo que hay que conservar; además F era el caso donde el número depende de la imagen medida (0,658 / 0,672 / 0,683 / 0,697) y no cabe explicarlo en 27 s |
| Escena propia del ejemplo **A** (0,81 «es ella»), 3,25 s | El 0,81 queda como pastilla en el gancho; la pantalla ya no dice «es ella», solo el número que el programa le dio |
| **Lección** con tres miniaturas (5 s) | Su idea pasa a la tarjeta «Mirá la imagen entera.» sobre la foto de cierre (la voz sí dice «Por eso») |
| Numeración «1 · 2 · 3 ·» y las tarjetas «Su cara oficial, fija.», «Un programa las compara.», «Idéntica es 1.» | La voz las dice y la escala lo muestra («0», «idéntica · 1», cursor de 0 a 1) |
| Nota «El programa solo compara caras.» | El pie y la tarjeta «El número no ve letreros inventados.» ya lo dicen |
| «Mismo clip: de 0,77 a 0,80.» + «Esa variación cabe en ±0,03.» (6 s) | Una tarjeta, «Mismo clip: cabe en ±0,03.»; las dos puntas 0,77 y 0,80 siguen rotuladas sobre la escala ampliada |
| «mi piso · 0,70» → «piso · 0,70» | 2 palabras: ventana de lectura de 1,0 s en vez de 1,35 s |
| Pausas muertas: 3,0 s de foto con tarjeta repetida, 4-6 s de placa sin eventos | Regla de aire; ver abajo |

## Decisiones que la madre puede revertir (detalle y cómo en `plan.json → agregados_al_guion`)
- **V1** duración y cronograma (26,8 s, CTA 2,417 s con cola de lectura) · **V2** F y la escena de A quitados · **V3** lección → tarjeta de 4 palabras · **V4** sin numeración ni tarjetas de paso ·
  **V5** nota partida en «Bajo 200 px, el medidor avisa.» + «Cara chica: lo reviso a ojo.» (dicen lo mismo que G5 y no afirman que el número baje) · **V6** una sola tarjeta para el ±0,03 ·
  **V7** B del café: «Bajo el piso: otra persona.» · **V8** etiqueta «piso · 0,70» · **V9** llamada «Lo difuminé…» ya en la placa al llegar y aro que marca dos veces ·
  **V10** cursor 0 → 1 · **V11** gancho visible desde el cuadro 0, caja y pastilla que salen antes del empuje · **V12** el gancho dura 3,29 s (11 palabras; el rótulo llega a 3,0 s) ·
  **V13** voz solo como guion, sin decimales, «0 a 1» como dígitos (el TTS lo lee «cero a uno»: probar) · **V14** pie nuevo (el del guion aprobado habla de 57 s) ·
  **D-N1** nombres de herramientas, voz sin nombres.
- La frase de la voz «Tengo ocho fotos oficiales de ella» usa «de ella» y la tarjeta «suyas» (sinónimos; la tarjeta no admite 5 palabras en 1,917 s).

## Aire muerto (`qa/aire.txt`, `qa/aire-pixeles.txt`)
- **Mayor tramo quieto fuera de una tarjeta en lectura: 0,250 s** (6 cuadros iguales; límite 0,3 s), medido en el DOM cuadro a cuadro **excluyendo el empuje lento de las fotos** (criterio más estricto que mirar píxeles) y **0,250 s en los píxeles del render**.
  Contando las lecturas (pantalla idéntica con una tarjeta que se está leyendo): 1,79 s en el DOM, 1,08 s en píxeles; «en lectura» = desde que la tarjeta es legible hasta 0,35 s × palabras + 0,3 s.
- **Eventos nuevos: 47 en 26,8 s = 17,5 por 10 s** (22,0 · 17,0 · 11,7 por cada 10 s); **hueco máximo entre eventos 1,90 s** (≤ 2,0 s). Evento = entrada o acento de tarjeta, caja, pastilla, flecha, escala, cursor, marca, punta, banda, aro y cada empuje.
- Cuadros sin tarjeta visible: **0 de 644** (la del gancho está desde el cuadro 0).

## QA medido (final `out/g5-v2-final-1080x1920.mp4`) — todo pasa
| Control | Resultado | Archivo |
|---|---|---|
| `hyperframes check` | 0 errores; runtime, layout y motion sin avisos (2 «info» de layout: la tarjeta que cruza el borde durante un empuje); contraste **25/25 AA**; 22 avisos de estilo que no frenan (`nested_structure_needs_subcomposition` ×19, `timeline_track_too_dense` ×2, `duplicate_media_discovery_risk` ×1) | `qa/hyperframes-check.txt` |
| `build.mjs` (reglas, cronograma de voz, cifras vs PROCEDENCIA, herramientas, pie, frases retiradas) | pasa; cada cifra y afirmación contra `v4/PROCEDENCIA.jsonl` | `qa/tabla-de-cortes-y-lecturas.txt` |
| `voz.mjs` (cronograma) | 10 tramos, huecos 0,222–0,250 s, 439 caracteres, 644 cuadros | `qa/tramos-de-voz.txt` |
| `medir-dom.mjs` (zona segura) | 215 instantes, 732 cajas: todo entre mentón+40 y y=1490, nada sobre y=280, nada en los 80 px de la derecha bajo y=1000, ningún texto < 34 px, nada se pisa; margen mínimo mentón-texto **59 px**; puntas, banda, marcas, pista y cursor en su x ±1,5 px | `qa/zona-segura.txt` |
| `hueco-tarjetas.mjs` | 0 cuadros sin tarjeta | `qa/hueco-tarjetas.txt` |
| `ventanas.mjs` (lectura de todo texto no-tarjeta y de las tarjetas, medida en el DOM) | 32/32 alcanzan 0,35 s × palabras + 0,3 s (las más justas: tarjeta c2 1,88 s para 1,70, pastilla del gancho 1,92 s para 1,70, tarjeta c4 y pastilla del café 2,29 s para 2,05) | `qa/ventanas-de-lectura.txt` |
| `eventos.mjs` | hueco máximo 1,90 s (≤ 2,0) | `qa/eventos-visuales.txt` |
| `aire.mjs` + `aire.py` | 0,250 s / 0,250 s (≤ 0,3) | `qa/aire.txt`, `qa/aire-pixeles.txt` |
| `vacios.py` | 0 cuadros planos; mayor salto de luma fuera de los empujes Δ = 1,8 (dentro de ellos ≤ 46,0, foto clara ↔ placa oscura) | `qa/vacios-y-saltos.txt` |
| `costuras.mjs` | 7 empujes rígidos: separación 0,00 px entre el que entra y el que sale, 1080 px cada uno, tarjetas viajando con la imagen | `qa/costuras-rigidas.txt` |
| `psnr-fotos.py` | cada escena de foto: pico = la foto del plan (39,5-41,1 dB contra 9,1-13,9 dB de las otras tres) y con el zoom del plan | `qa/psnr-fotos.txt` |
| `medir-caras.py` (SCRFD) | cajas idénticas a las de G5 (A 237 px, café 288 px, K 266 px, Motor 5 89 px, Motor 4 312 px) | `qa/caras-fotos.json` |
| `face-gate-final` (ArcFace) | final contra fuente al mismo zoom: **máxima diferencia 0,013** (9 pares; regla ≤ 0,02). Números en pantalla: A 0,81 (cuadro 0,794-0,806), café 0,35 (0,356-0,367), todos a < 0,03 del cuadro que se ve | `qa/face-gate-final.txt` |
| `grep-prohibidas.mjs` | pantalla, pie y voz: 0 coincidencias; herramientas nombradas solo las permitidas por D-N1 | `qa/grep-prohibidas.txt` |
| Control propio de «cara chica» (heredado de G5, no cambia) | −0,004 a −0,010 a 60 px en 5 de 6 fotos; el video no afirma que el número baje | `qa/cara-chica-control.txt`, `qa/cara-chica-m5.txt` |
| ffprobe | H.264 High 1080x1920, 24 fps, 644 cuadros, bt709; AAC 48 kHz estéreo −91 dB; preview 360x640, 644 cuadros | `qa/specs-final.txt`, `qa/specs-preview-360p.txt` |
| **Mirado renderizado** (el final a 1080x1920 con guías, 2 cuadros por segundo; los 7 empujes cuadro por cuadro; recortes a 1x-3x del letrero, las etiquetas de herramienta, la nota y las marcas) | sin cuadros vacíos ni tiras de fondo; el letrero queda ilegible dentro del aro; el texto de las etiquetas se lee a 34 px | `qa/hoja-qa-1..3.jpg`, `qa/hoja-costuras-1..2.jpg`, `qa/hoja-letrero-3x.jpg`, `qa/portada-0.6s.jpg` |

## Pie (`pie.txt`, abre con «personaje hecho con IA» y dice lo que el video dice)
*«Lucía Antelo es un personaje hecho con IA por @oniahq. Así mido si una cara sigue siendo la suya: ocho fotos oficiales, un programa que las compara y da un número de 0 a 1, y un piso de 0,70 que elegí yo. Una imagen de Seedream 4.5 da 0,81; una de Kling O1 Image con otra cara queda bajo el piso: otra persona (0,35). Y tres razones para no creerle del todo: con una cara chica (Kling O3) el medidor avisa y la reviso a ojo, el mismo clip de Cinematic Studio 3.0 varía de 0,77 a 0,80 y eso cabe en ±0,03, y el número no ve los letreros inventados (Seedance 2.0 Mini + referencias). Por eso se mira la imagen entera. Son tomas sueltas, no una comparación de herramientas. Nombro lo que uso; no es una recomendación pagada. Cada semana hago una prueba. Seguime.»* `#inteligenciaartificial #ia #santacruz #bolivia`

«Son tomas sueltas, no una comparación de herramientas» lo agregué yo (no estaba en el encargo): evita que los nombres se lean como ranking (regla (d) de D-N1). Se quita borrando esa oración.

## Cómo agregar la voz después (sin generar nada aquí)
1. Generar UNA pista por línea de `guion-voz.txt` (voz Marcela), nombrada `t01 … t10` (wav/mp3/m4a). No acelerar la voz: si una pista pasa de su tramo, se recortan los silencios de la pista.
2. `node scripts/poner-voz.mjs DIR_DE_PISTAS [salida.mp4]` pone cada pista en el segundo de su tramo (`qa/tramos-voz.json`), avisa si una pista dura más que su tramo, mezcla a −14 LUFS y copia el video sin recodificar.
   Probado con 10 tonos sintéticos de la duración prevista (sin voz real): la mezcla sale con el video intacto (644 cuadros) y el audio a −16,5 dB medio.
3. Con voz, sin cama de música (`edicion-referentes`). Si el TTS lee mal «0 a 1» (línea 3), escribir «cero a uno» (+6 caracteres: caben, quedan 11 libres).

## Lo que no pude cerrar ni verificar (dicho de frente)
1. **«Regla 15 de `edicion-referentes`»** no existe en el skill del repo (tiene 14 reglas; la de pausas es la 2, ≤ 0,5 s, y `lucia/SKILL.md §11` dice 0,25 s). Apliqué el texto del encargo: pausa ≤ 0,3 s (huecos de 0,222-0,250 s), ningún tramo quieto > 0,3 s, un evento cada ≤ 2,0 s.
2. **3,6 palabras por segundo es un supuesto del encargo.** La voz real de Marcela puede salir más lenta o más rápida; `poner-voz.mjs` avisa, pero el cronograma no se puede confirmar hasta tener la voz. El margen del hueco (≤ 0,25 s por línea) es lo único que absorbe diferencias.
3. **El criterio de «tramo quieto»** (firma de lo que el timeline anima, sin el empuje lento de las fotos; lectura de tarjeta exenta) es mío; lo medí también en píxeles y da lo mismo (0,250 s), pero si la madre cuenta distinto (p. ej. sin exención por lectura) el máximo es 1,79 s / 1,08 s.
4. **El hueco entre eventos de 1,90 s** (café 11,55 → 13,45 y CTA 24,42 → 26,32) está a 0,1 s del límite: son tarjetas en lectura; agregar un evento ahí sería decorativo.
5. **No vi el video en un teléfono con la interfaz de Instagram.** La zona segura es la simulación de la regla. Las etiquetas de herramienta van a 34 px (el mínimo) y la nota de la razón 1 a 44 px.
6. **«Kling O1 Image»** viene del encargo y de `higgsfield-mapa.md`; la clave de PROCEDENCIA dice `kling_omni_image`. Las demás claves corresponden por nombre (`seedream_4_5`, `kling_o3_image_reference_5_refs`, `cinematic_studio_3_0`, `seedance_2_0_mini_start_mas_3_refs`). Los otros videos (G2-G4, G5 de 57,5 s) siguen diciendo «Imagen A-F» / «Motor N»: la madre decide si se re-etiquetan.
7. **El pie es nuevo** y no pasó por la madre; `VALIDACION-G4-G5-MADRE.md` aprobó el guion de 57 s, no este recorte. Las cifras y afirmaciones son las mismas que G5 validó.
8. **Sin revisor independiente** (no se pidió). Lo mirado y medido es lo de arriba. Las frases nuevas respecto de G5 son pocas: «Bajo el piso: otra persona.», «Mismo clip: cabe en ±0,03.», «Mirá la imagen entera.», «Ocho fotos oficiales suyas.», las etiquetas de herramienta y las líneas de voz.
9. **«Seedream 4.5 · parecido 0,81»** muestra el número de UNA imagen (0,806 en el original, 0,794-0,806 en los cuadros), no una propiedad de la herramienta; igual con el café (0,350). El pie lo dice («una imagen de…»).
10. El render no es bit a bit reproducible entre ejecuciones (la 2.ª diferencia final ↔ fuente fue 0,010 y 0,013 en dos renders del mismo `index.html`).

## Reproducir
```bash
export PRODUCER_HEADLESS_SHELL_PATH=/opt/pw-browsers/chromium HYPERFRAMES_SKIP_SKILLS=1
node scripts/voz.mjs                          # cronograma de voz (sale con 1 si algo incumple)
node scripts/build.mjs                        # copia el material, valida y escribe index.html y qa/*-plan.json
npx -y hyperframes@0.8.142 check
# 1) preview 360p REAL primero (≈ 40 s). El borrador da 1 «error» de lint (root_zoom_rescales_a_fixed_canvas) y 1 aviso: NO frenan, sin --strict
node scripts/borrador-360.mjs /ruta/draft360 && (cd /ruta/draft360 && flock /tmp/hf-render.lock npx -y hyperframes@0.8.142 render --quality draft -f 24 -o /ruta/qa/g5-v2-preview-360p.mp4)
# 2) recién después el final (≈ 2 min 30 s, 4 núcleos, sin GPU; un solo render a la vez en esta máquina)
flock /tmp/hf-render.lock npx -y hyperframes@0.8.142 render --quality high -f 24 -o renders/final-raw.mp4
ffmpeg -y -i renders/final-raw.mp4 -f lavfi -t 26.8333333 -i anullsrc=r=48000:cl=stereo -map 0:v -map 1:a -c:v copy -c:a aac -b:a 128k -shortest -movflags +faststart out/g5-v2-final-1080x1920.mp4
node scripts/medir-dom.mjs && node scripts/hueco-tarjetas.mjs && node scripts/ventanas.mjs && node scripts/eventos.mjs && node scripts/aire.mjs && node scripts/costuras.mjs && node scripts/grep-prohibidas.mjs
export FACE_GATE_HOME=…/lucia-face-gate     # fuera del repo; venv con numpy, cv2, onnxruntime
$FACE_GATE_HOME/venv/bin/python scripts/vacios.py out/g5-v2-final-1080x1920.mp4 > qa/vacios-y-saltos.txt
$FACE_GATE_HOME/venv/bin/python scripts/psnr-fotos.py out/g5-v2-final-1080x1920.mp4 > qa/psnr-fotos.txt
$FACE_GATE_HOME/venv/bin/python scripts/aire.py out/g5-v2-final-1080x1920.mp4 > qa/aire-pixeles.txt      # necesita qa/lectura-tarjetas.json (lo escribe aire.mjs)
$FACE_GATE_HOME/venv/bin/python scripts/medir-caras.py > qa/caras-fotos.json
$FACE_GATE_HOME/venv/bin/python scripts/fuente-con-zoom.py out/g5-v2-final-1080x1920.mp4 /ruta/fgf > args.txt && bash .claude/skills/lucia/scripts/face-gate.sh $(cat args.txt)
COLS=6 bash scripts/hoja.sh out/g5-v2-final-1080x1920.mp4 hoja.jpg 330 f0 f12 f24 …      # «fNNN» = cuadro NNN exacto; 2 cuadros por segundo = de 12 en 12
```
