# Lucía · G5 v2 «Cómo mido si una cara es la de Lucía (y cuándo no creerle al número)» — re-corte de 26,6 s, muda, revisión 1 aplicada: LISTA PARA MOSTRAR

**Estado: LISTA PARA MOSTRAR (muda).** Aplicada la revisión independiente `qa/revision-1.md` (11-oct-2026: 11 hallazgos, 0 ALTA · 5 MEDIA · 6 BAJA; qué se hizo con cada uno, abajo). **No es todavía para publicar:**
falta la voz (cupo + sí escrito de Sergio Urcullo) y el pie nuevo tiene que pasar por la madre.

Re-corte de `videos/lucia-g5/` (57,5 s) con la regla de aire de la madre (pausa ≤ 0,3 s entre frases, ningún hueco que se quede quieto) y con el guion aprobado el 10-oct
(`hermes-content/docs/cola/lucia-diario/guiones/G5-como-se-mide-una-cara.md`; `VALIDACION-G4-G5-MADRE.md`) como límite de lo que se puede afirmar. HyperFrames 0.8.142, método de
`.claude/skills/lucia/montaje-hyperframes.md`. **Costo: 0 créditos** (fotos y cuadros ya pagados; no se llamó a Higgsfield, ElevenLabs ni a ningún servicio). **No se generó voz**: la pista
de audio es silencio AAC (−91 dB) a propósito; el video está cronometrado como si hablara (`guion-voz.txt`) y `scripts/poner-voz.mjs` mide y mezcla la voz cuando exista.
**No se tocó nada fuera de esta carpeta** (`videos/lucia-g5/` y `videos/lucia-entrega/` siguen como estaban). Sin comandos git, salvo un `git status` de solo lectura al final para comprobar que lo único mío estaba acá.

> **D-N1 (11-oct-2026) aplicada.** Regla nueva de Sergio Urcullo, pasada por la madre a mitad del trabajo: ahora SÍ se nombran las herramientas, como uso propio y no como recomendación pagada.
> «Imagen A» → **Seedream 4.5**, «Imagen B» → **Kling O1 Image**, «Imagen F» → GPT Image 2.5 (no sale en v2); «Motor 4» → **Seedance 2.0 Mini + referencias**, «Motor 5» → **Kling O3**,
> «Motor 6» → **Cinematic Studio 3.0**. En pantalla: pastilla «Seedream 4.5 · parecido 0,81» (gancho), pastilla «Kling O1 Image · parecido 0,35» (café) y una etiqueta fija en cada placa de clip
> («Kling O3», «Cinematic Studio 3.0 · mismo clip», «Seedance 2.0 Mini + referencias»). Cada nombre cuenta para la lectura (0,35 s por palabra + 0,3 s: `ventanas.mjs` lo mide) y **la voz no dice ninguno**
> (los nombres comen caracteres y dicho en voz suena a veredicto de la herramienta; solo se leen). El pie suma «Nombro lo que uso; no es una recomendación pagada.», **abre con
> «Personaje hecho con IA: Lucía Antelo, de @oniahq.»** (el README de la mañana decía que abría con «personaje hecho con IA», pero la primera frase era «Lucía Antelo es un personaje hecho con IA…»: H3, corregido
> y comprobado por `build.mjs` con `startsWith`) y nombra al medidor («ArcFace»). `grep-prohibidas.mjs` permite SOLO esos nombres completos (lista `PERMITIDAS`; «kling», «seedream», «gpt», «flux»… sueltos y cualquier otra marca siguen prohibidos) y
> prohíbe «el mejor» y frases de recomendación; `build.mjs` comprueba que cada nombre corresponda a la clave de PROCEDENCIA del archivo que se ve. No hay capturas de interfaces de terceros.
> Intactos: rótulo de IA, CTA, piso 0,70 «lo elegí yo», «cabe en ±0,03», «el medidor avisa: lo reviso a ojo» y la B del café como otra persona.

| Qué | Dónde |
|---|---|
| Final 1080x1920, H.264 + AAC en silencio, **26,625 s** (639 cuadros, 24 fps), 17,0 MB (ignorado en git) | `out/g5-v2-final-1080x1920.mp4` · **SHA-256 `030e8f65aabc0fddda83f234acebb410b951b7b81c3dc9c2657410f5ec399b3f`** (también en `qa/sha-master.txt`) |
| Preview 360p REAL (render de HyperFrames a 360x640 de la MISMA composición, `index.html` md5 `344ac0f807d8dc70383b1fef7b681f00`) | `qa/g5-v2-preview-360p.mp4` |
| Guion de la voz (voseo, una línea por tramo, 418 caracteres con saltos de línea) y su cronograma (estimado a 17 caracteres por segundo hasta que haya voz) | `guion-voz.txt` · `qa/tramos-voz.json` · `qa/tramos-de-voz.txt` |
| Plan (tiempos, capas, datos, herramientas, decisiones reversibles V1-V14, D-N1 y R1-\*). Los tiempos de tramos, tarjetas, costuras, medios y eventos los escribe `scripts/retemporizar.mjs` desde el guion de voz y la tabla `rel` | `plan.json` |
| Generador: valida reglas, **cronograma de voz**, cifras y afirmaciones contra `v4/PROCEDENCIA.jsonl`, nombres de herramientas, pie → escribe `index.html` y los manifiestos de `qa/` | `scripts/build.mjs` + `scripts/voz.mjs` + `scripts/retemporizar.mjs` + `scripts/estilos.css` + `scripts/timeline.js` |
| Pie para publicar (abre con «Personaje hecho con IA», dice lo que el video dice, pone el límite de las herramientas) | `pie.txt` |
| Material que el build necesita sin red (8 referencias, 2 cuadros de clips con su origen, GSAP) | `assets-fijos/` (versionado; `ORIGEN.md`) |
| Medir y mezclar la voz cuando exista (huecos, solapes, −14 LUFS, pico) | `scripts/poner-voz.mjs` |
| QA mirado y medido | `qa/` (lista y resultados abajo) |

## Revisión 1 (`qa/revision-1.md`): qué se hizo con cada hallazgo
**Resueltos 9 · parciales 2 (H2 en pantalla, H11) · ninguno sin tocar.** Lo que no pude cerrar con evidencia está en «Lo que no pude cerrar ni verificar».

| # | Gravedad | Estado | Qué cambió |
|---|---|---|---|
| **H1** voz fuera del cronograma | MEDIA | **Resuelto en todo lo que se puede sin voz; el paso correcto (derivar los tramos de las duraciones reales) queda listo.** | (a) `guion-voz.txt`: L2 «Ocho fotos oficiales de ella.», L3 «Un medidor las compara y da un número de 0 a 1.», L4 «Idéntica es uno. El piso lo elegí yo.», L8 «El número no ve **los** letreros inventados.» (ver «Decisión sobre L8»). (b) `voz.mjs` estima en **caracteres a 17 por segundo** (G1 v2: 320 car en ~19 s) y lee `duraciones.json` (duración REAL de cada pista) con prioridad; recalcula los tramos con hueco ≤ 0,25 s (tope 0,30 s); `retemporizar.mjs` mueve tarjetas, costuras, medios y eventos. (c) `poner-voz.mjs`: avisa de pistas que se pasan del tramo, pistas cortas (hueco > 0,3 s) y solapes; mide la mezcla con `silencedetect` (−35 dB, 0,3 s) por cada 10 s y con `ebur128` (−14 LUFS, pico verdadero); loudnorm en dos pasadas. Probado con tonos sintéticos (no hay voz). Tramos y eventos nuevos en `qa/tramos-de-voz.txt`, `qa/tramos-voz.json`. |
| **H2** herramientas nombradas, se lee como ranking | MEDIA | **Resuelto en el pie; parcial en pantalla.** | Pie: «Una toma de cada una: es una prueba, no una regla. En otras dos escenas, Kling O1 Image dio 0,79 y 0,83.» en lugar de «Son tomas sueltas…» (0,794 y 0,831 de PROCEDENCIA l.97; `build.mjs` los comprueba). **«Una toma» en la pastilla del café: NO cabe.** La pastilla ya tiene el máximo de 5 palabras que permite el tiempo de lectura (0,35 s × palabras + 0,3 s) dentro de su tarjeta: puede vivir desde 0,1 s después del empuje de entrada hasta antes del empuje de salida (≤ 2,6 s con el tramo de 2,875 s) y 7 palabras piden 2,75 s. Con 6 palabras (quitando «parecido») el build mismo la rechaza (2,35 s < 2,40). Se dejó solo el pie. |
| **H3** pie no abre con «personaje hecho con IA» | MEDIA | **Resuelto** | `pie.txt` abre «Personaje hecho con IA: Lucía Antelo, de @oniahq. Así mido si una cara sigue siendo la suya: …» (resto aprobado conservado). Este README (párrafo D-N1 y sección Pie) dice ahora lo que es. |
| **H4** tarjeta c7 sin sujeto | MEDIA | **Resuelto** | Tarjeta «Esa variación cabe en ±0,03.» (5 palabras, ventana de lectura 2,88 s para 2,05) y etiqueta «Cinematic Studio 3.0 · mismo clip» (5 palabras, 2,88 s). |
| **H5** redacción de la voz | MEDIA | **Resuelto en L3 y L4; L5 opcional, no aplicado** | L4 «Idéntica es uno.» (coincide con la escala «idéntica · 1»); L3 «Un medidor…» (el pie también dice «un medidor (ArcFace)»). L5 «La del café…» queda: «La imagen del café…» suma 8 caracteres (+0,47 s de tramo) y la pantalla ya muestra la foto. |
| **H6** nombres a 34 px | BAJA | **Resuelto** | Etiquetas de herramienta, nombres dentro de las pastillas, marcas de las escalas («0,75»…«0,90», «0», «idéntica · 1», «piso · 0,70», «89 px») a **42 px** (`estilos.css`); la nota de la razón 1 baja a y 1050 para no tocar la etiqueta. `medir-dom` y `ventanas` repasados (abajo). |
| **H7** el 0,81 del gancho y la cara de ~180 px | BAJA | **Resuelto (una línea)** | El 0,81 del gancho es el de la **foto original (cara de 237 px, 0,806 en PROCEDENCIA)**; en pantalla la cara mide ~182–185 px (`qa/face-gate-final.txt`, «cara < 200 px: poco confiable»). La diferencia final ↔ fuente es ≤ 0,013: el número se sostiene, pero el primer número del video está sobre una cara que, vista, mide menos de 200 px. |
| **H8** «sin aire muerto» sobreafirmado | BAJA | **Resuelto** | Frases reescritas con la exención y datos sin exención como dato (sección «Aire muerto»). |
| **H9** el medidor no se nombra | BAJA | **Resuelto** | Pie: «un medidor (ArcFace) que las compara»; `ArcFace` se suma a `PERMITIDAS` de `grep-prohibidas.mjs` (scrfd, buffalo e insightface siguen prohibidos). |
| **H10** pulido visual | BAJA | **Resuelto** | Aro coral de r3: x 4, ancho 224 → queda dentro del marco del cuadro (antes salía ~6 px). Marca del piso de la escala 0-1: la pastilla «piso · 0,70» sube a y 700 y la raya ya no entra en ella. Etiqueta de r2: ahora dice «Cinematic Studio 3.0 · mismo clip» (se lee como título de la placa). Mirado en los cuadros 240, 288, 372, 456 y 504 del render. |
| **H11** rastro del master y flujo con voz | BAJA | **Parcial** | Duda 8 resuelta por `qa/revision-1.md`. SHA nuevo arriba y en `qa/sha-master.txt`. El audio (**−14 LUFS con `ebur128`, pico verdadero, `silencedetect`**) se re-mide cuando haya voz: `poner-voz.mjs` lo hace. No hice lo que cae fuera de esta carpeta: copiar el master aprobado a `videos/lucia-entrega/` y marcar la G5 v1 (57,5 s, «Imagen A» / «Motor 4») como reemplazada. |

Además (no lo pidió el revisor): **el acento de la tarjeta c5 («otra persona.») se enciende ahora en CORAL**, el color de lo que cae bajo el piso (como su caja y su pastilla). El README de la mañana ya lo describía como coral, pero el timeline heredado de G4/G5 lo encendía
en verde, el color de lo que pasa. Se revierte con una línea (`R1-extra` en `plan.json`).

### Decisión sobre L8 (el único punto en que no seguí el texto del encargo)
El encargo decía L8 = «El número no ve letreros inventados.» (36 caracteres, 2,12 s). Con eso el tramo no puede pasar de 2,42 s si el hueco tiene que ser ≤ 0,30 s, pero la tarjeta c8 (6 palabras) pide ≥ 2,5 s de tramo y la llamada «Lo difuminé: lo inventó el motor.» de la placa
(6 palabras, ya está al llegar) pide 2,6 s. Para no pasar de 0,30 s de hueco ni acortar el texto en pantalla, L8 queda **«El número no ve los letreros inventados.»** (40 caracteres, 2,35 s de voz, tramo de 2,625 s, hueco 0,272 s). Se revierte borrando «los» en
`guion-voz.txt` y aceptando un hueco de 0,51 s (o recortando la tarjeta y la llamada a 5 palabras); `plan.json → voz.lectura_min_cuadros` guarda el 63 que pide la lectura.

## Duración y cronograma de voz
La voz es `guion-voz.txt`: **una línea = un tramo**. Cada tramo dura (caracteres ÷ 17 s, o la duración real de `duraciones.json`) + un hueco ≤ 0,25 s bajado al cuadro de 24 fps (tope 0,30 s si la lectura de la tarjeta o de la placa lo pide); las 10 tarjetas coinciden con los 10 tramos
(`build.mjs` corta si no, si el hueco pasa de 0,30 s, si el guion pasa de 450 caracteres, si la voz lleva un decimal o si `plan.json` está desfasado del cronograma). «0 a 1» se dice como dígitos (el TTS lo lee «cero a uno»: probar).

| Tramo | t (s) | Dura | Línea de voz (voseo) | Car. | Voz (17 car/s) | Hueco |
|---:|---|---:|---|---:|---:|---:|
| 1 | 0,000 – 3,417 | 3,417 | ¿Cómo sé que sigue siendo ella? Lo mido con un número. | 54 | 3,18 | 0,240 |
| 2 | 3,417 – 5,333 | 1,917 | Ocho fotos oficiales de ella. | 29 | 1,71 | 0,211 |
| 3 | 5,333 – 8,333 | 3,000 | Un medidor las compara y da un número de 0 a 1. | 47 | 2,76 | 0,235 |
| 4 | 8,333 – 10,750 | 2,417 | Idéntica es uno. El piso lo elegí yo. | 37 | 2,18 | 0,240 |
| 5 | 10,750 – 13,625 | 2,875 | La del café queda bajo el piso: otra persona. | 45 | 2,65 | 0,228 |
| 6 | 13,625 – 16,625 | 3,000 | Cara chica: el medidor avisa y la reviso a ojo. | 47 | 2,76 | 0,235 |
| 7 | 16,625 – 19,542 | 2,917 | El mismo clip varía, pero cabe en este margen. | 46 | 2,71 | 0,211 |
| 8 | 19,542 – 22,167 | 2,625 | El número no ve los letreros inventados. | 40 | 2,35 | 0,272 |
| 9 | 22,167 – 24,208 | 2,042 | Por eso, mirá la imagen entera. | 31 | 1,82 | 0,218 |
| 10 | 24,208 – 26,625 | 2,417 | Seguime: cada semana, una prueba. | 33 | 1,94 | 0,475 (cola del CTA) |

Total: **82 palabras, 418 caracteres con saltos de línea** (409 sin ellos; cupo 450), 26,625 s. Huecos entre líneas **0,211–0,272 s** (antes, con palabras / 3,6: 0,222–0,250 s «en el papel», pero medidos a 17 car/s esos tramos daban de −0,43 s —la voz se pasa, L8— a +0,76 s —hueco largo, L3—). **Único tramo que no sigue la regla: el 10 (CTA).**
El CTA tiene que verse ≥ 2,4 s (regla de marca) y su línea habla ~1,94 s: la cola de 0,48 s la ocupa la lectura de la tarjeta (5 palabras = 2,05 s), no es aire (cuenta como un hueco ≥ 0,3 s en la regla de audio: ≤ 2 en 26,6 s).
**La estimación es una media:** 17 car/s puede salir ±10 % por línea, y la pausa DENTRO de L1 y L4 (dos frases cada una) la decide el TTS. Con voz real: `poner-voz.mjs --medir` → `duraciones.json` → `retemporizar.mjs` (abajo).

## Tabla de cortes (t = segundo del corte; el empuje rígido ocupa T−0,25 a T)
| t (s) | Capa | Texto en pantalla |
|---|---|---|
| 0,000 – 3,417 | **t1 · Foto A** (Seedream 4.5) con empuje lento 1,00 → 1,04. Rótulo «Lucía Antelo · personaje IA de Onia» del cuadro 0 a 3,0 s (40 px). Caja de cara 0,85–2,65 s y pastilla «Seedream 4.5 · parecido 0,81» 0,95–3,0 s | **«¿Cómo sé que sigue siendo ella?»** (desde el cuadro 0; «sigue siendo ella?» se enciende a 0,77) |
| 3,167 – 5,333 | **t2 · Placa paso 1:** las 8 referencias oficiales 4×2 (la fila de abajo entra 3,87–4,17; bordes verdes 4,37) | «Ocho fotos oficiales suyas.» (acento 4,06) |
| 5,083 – 10,750 | **t3 · Placa paso 2:** las 8 en fila, flecha 5,73, la escala 0-1 se dibuja 6,28, «0» e «idéntica · 1» 6,88, un **cursor** la recorre de 0 a 1 (7,18–8,08) | «Un número, de 0 a 1.» (acento 7,47) |
| – 10,750 | **t4 · misma placa:** «idéntica · 1» y el cursor se encienden 8,93; cae la marca del piso y «piso · 0,70» 9,23 | «Piso, 0,70. Lo elegí yo.» (acento 9,80) |
| 10,500 – 13,625 | **t5 · Foto del café** (Kling O1 Image; NO es Lucía), pastilla «Kling O1 Image · parecido 0,35» 10,85–13,20, caja coral 11,05 | «Bajo el piso: otra persona.» (acento **coral** 12,63) |
| 13,375 – 16,625 | **t6 · Placa razón 1:** cuadro de Kling O3 con la cara de **89 px**; etiqueta «Kling O3» y nota «Bajo 200 px, el medidor avisa.» ya están al llegar; caja 14,03, «89 px» 14,43, línea y lupa 14,83, la lupa vuelve a marcar 16,04 («a ojo») | «Cara chica: lo reviso a ojo.» (acento 15,45) |
| 16,375 – 19,542 | **t7 · Placa razón 2:** escala «Zoom: 0,70 a 0,90», «Cinematic Studio 3.0 · mismo clip» y «piso · 0,70» al llegar; punta 0,77 a 16,93, punta 0,80 a 17,45, banda ±0,03 a 18,15, la banda destella 18,63 («este margen») | «Esa variación cabe en ±0,03.» (acento 18,15) |
| 19,292 – 22,167 | **t8 · Placa razón 3:** cuadro con el letrero **difuminado**, «Seedance 2.0 Mini + referencias» y «Lo difuminé: lo inventó el motor.» al llegar; aro 19,84; «parecido 0,80» 20,44; el aro vuelve a marcar 21,25 («inventados») | «El número no ve letreros inventados.» (acento 20,72) |
| 21,917 – 24,208 | **t9 · Foto K4·5** (Lucía mira a cámara y sonríe) con empuje lento | «Mirá la imagen entera.» (acento 23,58) |
| 24,208 – 26,625 | **t10 · Cierre** (misma foto) | **«Seguime: cada semana, una prueba.»** (2,417 s; se enciende a 26,11) |

7 empujes rígidos de 6 cuadros (3,42 · 5,33 · 10,75 · 13,63 · 16,63 · 19,54 · 22,17). Las tarjetas viajan con la imagen. Entre t3-t4 y t9-t10 no hay empuje: cambia solo la tarjeta. Los acentos y los eventos van **con la palabra de la voz** (reparto lineal por caracteres de la línea,
`plan.json → rel`); en la versión de la mañana los de c6 y c7 llegaban ~0,5 s tarde. Con voz real se vuelven a medir en el audio.

## Qué se quitó de G5 y por qué
| Quitado | Por qué |
|---|---|
| Ejemplo **F** (0,66 «bajo el piso», 3,25 s) | No es de lo que hay que conservar; además F era el caso donde el número depende de la imagen medida (0,658 / 0,672 / 0,683 / 0,697) y no cabe explicarlo en 27 s |
| Escena propia del ejemplo **A** (0,81 «es ella»), 3,25 s | El 0,81 queda como pastilla en el gancho; la pantalla ya no dice «es ella», solo el número que el medidor le dio |
| **Lección** con tres miniaturas (5 s) | Su idea pasa a la tarjeta «Mirá la imagen entera.» sobre la foto de cierre (la voz sí dice «Por eso») |
| Numeración «1 · 2 · 3 ·» y las tarjetas «Su cara oficial, fija.», «Un programa las compara.», «Idéntica es 1.» | La voz las dice y la escala lo muestra («0», «idéntica · 1», cursor de 0 a 1) |
| Nota «El programa solo compara caras.» | El pie y la tarjeta «El número no ve letreros inventados.» ya lo dicen |
| «Mismo clip: de 0,77 a 0,80.» + «Esa variación cabe en ±0,03.» (6 s) | Una tarjeta, «Esa variación cabe en ±0,03.», con «mismo clip» en la etiqueta de la placa; las dos puntas 0,77 y 0,80 siguen rotuladas sobre la escala ampliada |
| «mi piso · 0,70» → «piso · 0,70» | 2 palabras: ventana de lectura de 1,0 s en vez de 1,35 s |
| Pausas muertas: 3,0 s de foto con tarjeta repetida, 4-6 s de placa sin eventos | Regla de aire; ver abajo |

## Decisiones que la madre puede revertir (detalle y cómo en `plan.json → agregados_al_guion`)
- **V1** duración y cronograma (26,6 s, CTA 2,417 s con cola de lectura) · **V2** F y la escena de A quitados · **V3** lección → tarjeta de 4 palabras · **V4** sin numeración ni tarjetas de paso ·
  **V5** nota partida en «Bajo 200 px, el medidor avisa.» + «Cara chica: lo reviso a ojo.» (dicen lo mismo que G5 y no afirman que el número baje) · **V6** una sola tarjeta para el ±0,03 («Esa variación cabe en ±0,03.») ·
  **V7** B del café: «Bajo el piso: otra persona.» · **V8** etiqueta «piso · 0,70» · **V9** llamada «Lo difuminé…» ya en la placa al llegar y aro que marca dos veces ·
  **V10** cursor 0 → 1 · **V11** gancho visible desde el cuadro 0, caja y pastilla que salen antes del empuje · **V12** el gancho dura 3,42 s (11 palabras; el rótulo llega a 3,0 s) ·
  **V13** voz solo como guion, sin decimales, «0 a 1» como dígitos (el TTS lo lee «cero a uno»: probar) · **V14** pie nuevo (el del guion aprobado habla de 57 s) ·
  **D-N1** nombres de herramientas, voz sin nombres · **R1-H1, H4, H6, H10, aire, extra** (revisión 1: voz, tarjeta c7, 42 px, pulido, eventos con sentido, acento coral).
- La frase de la voz «Ocho fotos oficiales de ella» usa «de ella» y la tarjeta «suyas» (sinónimos; la tarjeta no admite 5 palabras en 1,917 s).

## Aire muerto (`qa/aire.txt`, `qa/aire-pixeles.txt`)
Regla de la madre, traducida a mudo: **pausa de voz ≤ 0,3 s entre frases; ninguna pantalla quieta de más de 0,3 s FUERA del tiempo de lectura de una tarjeta; un evento visual nuevo cada ≤ 2,0 s.** «Tiempo de lectura» = desde que la tarjeta es legible hasta 0,35 s × palabras + 0,3 s.
La regla de pantalla se cumple **con esa exención**, no sin ella (H8):
- **Mayor tramo quieto fuera de una tarjeta en lectura: 0,208 s** (5 cuadros iguales), medido en el DOM cuadro a cuadro **excluyendo el empuje lento de las fotos** (criterio más estricto que mirar píxeles), y **0,167 s** en los píxeles del render (límite 0,3 s). Antes: 0,250 s.
- **Sin la exención (dato, no nota):** pantalla idéntica con una tarjeta en lectura hasta **1,79 s en el DOM** (la cola del CTA: tarjeta quieta con la foto acercándose lento) y **0,542 s en los píxeles** (en la mañana: 1,79 s / 1,08 s; el revisor midió 1,04 s con otro umbral).
  Eso es lo que la exención cubre: las tarjetas se quedan en pantalla mientras se leen.
- **Eventos nuevos: 48 en 26,6 s = 18,0 por 10 s** (23,0 · 18,0 · 10,6 por cada 10 s); **hueco máximo entre eventos 1,90 s** (≤ 2,0 s). Evento = entrada o acento de tarjeta, caja, pastilla, flecha, escala, cursor, marca, punta, banda, aro, destello y cada empuje.
  Ese 1,90 s **cuenta el cambio de color del acento de cada tarjeta** como evento (10 de las 58 entradas de `qa/eventos-plan.json`): sin ellos los huecos mayores son **2,42 s (CTA, 24,21 → 26,63)**, **2,15 s (café, 11,05 → 13,20)** y **2,04 s (c9, 22,17 → 24,21)**: tarjetas en lectura, legítimos, pero el 1,90 es producto de la definición.
- Cuadros sin tarjeta visible: **0 de 639** (la del gancho está desde el cuadro 0).
- **La mitad de audio de la regla no se mide hasta que haya voz** (`poner-voz.mjs`: `silencedetect` a −35 dB, 0,3 s, por cada 10 s; máximo un hueco ≥ 0,3 s por cada 10 s). La cola de 0,48 s del CTA ya cuenta como uno.

## QA medido (final `out/g5-v2-final-1080x1920.mp4`)
| Control | Resultado | Archivo |
|---|---|---|
| `hyperframes check` | 0 errores; runtime y motion sin avisos; layout: 6 «info» (tarjetas y textos que cruzan el borde durante un empuje, t = 22,19 s); contraste **24/24 AA**; 22 avisos de estilo que no frenan (`nested_structure_needs_subcomposition` ×19, `timeline_track_too_dense` ×2, `duplicate_media_discovery_risk` ×1) | `qa/hyperframes-check.txt` |
| `build.mjs` (reglas, cronograma de voz, plan al día, cifras vs PROCEDENCIA, herramientas, pie, frases retiradas) | pasa; cada cifra y afirmación contra `v4/PROCEDENCIA.jsonl` (incluidos 0,79 y 0,83 del pie) | `qa/tabla-de-cortes-y-lecturas.txt` |
| `voz.mjs` (cronograma) | 10 tramos, huecos 0,211–0,272 s, 418 caracteres, 639 cuadros | `qa/tramos-de-voz.txt` |
| `medir-dom.mjs` (zona segura) | 213 instantes, 720 cajas: todo entre mentón+40 y y=1490, nada sobre y=280, nada en los 80 px de la derecha bajo y=1000, ningún texto < 34 px (tamaños: 42 px ×17, 44 ×2, 48 ×3, 40 ×1 el rótulo, 38 ×1 la llamada del letrero), nada se pisa; margen mínimo mentón-texto **59 px**; puntas, banda, marcas, pista y cursor en su x ±1,5 px | `qa/zona-segura.txt` |
| `hueco-tarjetas.mjs` | 0 cuadros sin tarjeta | `qa/hueco-tarjetas.txt` |
| `ventanas.mjs` (lectura de todo texto no-tarjeta y de las tarjetas, medida en el DOM) | 32/32 alcanzan 0,35 s × palabras + 0,3 s (las más justas: pastilla del café 2,17 s para 2,05; tarjeta c4 2,25 para 2,05; llamada «Lo difuminé…» y tarjeta c8 2,58 s para 2,40) | `qa/ventanas-de-lectura.txt` |
| `eventos.mjs` | hueco máximo 1,90 s (≤ 2,0) | `qa/eventos-visuales.txt` |
| `aire.mjs` + `pixeles.mjs aire` | 0,208 s / 0,167 s (≤ 0,3) | `qa/aire.txt`, `qa/aire-pixeles.txt` |
| `pixeles.mjs vacios` | 0 cuadros planos; mayor salto de luma fuera de los empujes Δ = 1,9 (dentro de ellos ≤ 46, foto clara ↔ placa oscura) | `qa/vacios-y-saltos.txt` |
| `costuras.mjs` | 7 empujes rígidos: separación 0,00 px entre el que entra y el que sale, 1080 px cada uno, tarjetas viajando con la imagen | `qa/costuras-rigidas.txt` |
| `pixeles.mjs psnr` | cada escena de foto: pico = la foto del plan (39–41 dB contra 9–14 dB de las otras tres) y con el zoom del plan; **PSNR dentro de la caja de la cara contra la fuente al mismo zoom: mínimo 37,1 dB** (9 cuadros) | `qa/psnr-fotos.txt` |
| `medir-caras.py` (SCRFD) | no se volvió a correr: las 4 fotos, los 2 cuadros de clip y sus cajas son los mismos (`qa/caras-fotos.json` sin cambios) | `qa/caras-fotos.json` |
| `face-gate-final` (ArcFace) | **Medido por la madre el 11-oct (`qa/arcface-madre-11oct.txt`, diferencia final↔fuente ≤ 0,009); el editor NO lo corrió**: (no hay venv ni modelo buffalo_l en este contenedor y instalarlos pide aprobación). Nada de lo que toca la cara cambió: mismas fotos, mismo empuje lento (1,00 → 1,04, origen en la cara), mismas cajas; solo cambió la duración de cada escena. Lo medido en su lugar: PSNR de la cara contra la fuente (arriba, ≥ 37,1 dB) y **la cara del master nuevo contra la del master de la mañana: 40,7 a 43,7 dB** en 4 cuadros (ruido H.264). `qa/face-gate-final.txt` es el de la mañana (máxima diferencia final ↔ fuente 0,013; regla ≤ 0,02), con una nota | `qa/face-gate-final.txt`, `qa/cara-vs-manana.txt` |
| `grep-prohibidas.mjs` | pantalla, pie y voz: 0 coincidencias; herramientas nombradas solo las permitidas por D-N1 (más ArcFace en el pie) | `qa/grep-prohibidas.txt` |
| Control propio de «cara chica» (heredado de G5, no cambia) | −0,004 a −0,010 a 60 px en 5 de 6 fotos; el video no afirma que el número baje | `qa/cara-chica-control.txt`, `qa/cara-chica-m5.txt` |
| ffprobe | H.264 High 1080x1920, 24 fps, 639 cuadros, bt709; AAC 48 kHz estéreo −91 dB; preview 360x640, 639 cuadros | `qa/specs-final.txt`, `qa/specs-preview-360p.txt` |
| **Mirado renderizado** (el final a 1080x1920 con guías, 2 cuadros por segundo; los 7 empujes cuadro por cuadro; cuadros 0, 240, 288, 372, 456, 504 y 600 a tamaño completo) | sin cuadros vacíos ni tiras de fondo; las etiquetas de herramienta se leen a 42 px; el aro del letrero queda dentro del marco; la marca del piso no toca su pastilla; la tarjeta c5 enciende «otra persona.» en coral | `qa/hoja-qa-1..3.jpg`, `qa/hoja-costuras-1..2.jpg`, `qa/portada-0.6s.jpg` |

Los controles de píxeles (`vacios`, `aire`, `psnr`) se corrieron con `scripts/pixeles.mjs` (Node + ffmpeg, mismos umbrales y mismas reglas que `vacios.py`, `aire.py` y `psnr-fotos.py`) porque en este contenedor no hay numpy/cv2; los `.py` siguen siendo la referencia donde haya venv. Sobre el master nuevo, `pixeles.mjs psnr` da los mismos picos y el mismo zoom que dio `psnr-fotos.py` sobre el master de la mañana (foto A: 39,4 dB contra 39,9 dB).

## Pie (`pie.txt`, abre con «Personaje hecho con IA», dice lo que el video dice y pone el límite de las herramientas)
*«Personaje hecho con IA: Lucía Antelo, de @oniahq. Así mido si una cara sigue siendo la suya: ocho fotos oficiales, un medidor (ArcFace) que las compara y da un número de 0 a 1, y un piso de 0,70 que elegí yo. Una imagen de Seedream 4.5 da 0,81; una de Kling O1 Image con otra cara queda bajo el piso: otra persona (0,35). Y tres razones para no creerle del todo: con una cara chica (Kling O3) el medidor avisa y la reviso a ojo, el mismo clip de Cinematic Studio 3.0 varía de 0,77 a 0,80 y eso cabe en ±0,03, y el número no ve los letreros inventados (Seedance 2.0 Mini + referencias). Por eso se mira la imagen entera. Una toma de cada una: es una prueba, no una regla. En otras dos escenas, Kling O1 Image dio 0,79 y 0,83. Nombro lo que uso; no es una recomendación pagada. Cada semana hago una prueba. Seguime.»* `#inteligenciaartificial #ia #santacruz #bolivia`

«Una toma de cada una: es una prueba, no una regla. En otras dos escenas, Kling O1 Image dio 0,79 y 0,83.» sale del revisor (H2): conserva la idea de «tomas sueltas, no una comparación» pero con la contraevidencia (0,794 y 0,831, `PROCEDENCIA` línea 97) y sin contradecir a G2 y G4, que sí comparan estas herramientas.
Se quita borrando esas dos oraciones.

## Cómo agregar la voz después (sin generar nada aquí)
La voz necesita cupo (caracteres de ElevenLabs) y el **sí escrito de Sergio Urcullo**; hasta entonces el video es mudo. En este orden:
1. Generar UNA pista por línea de `guion-voz.txt` (voz Marcela), nombrada `t01 … t10` (wav/mp3/m4a). No acelerar la voz: si una línea es larga por sí misma se acorta el texto, no se la apura.
2. `node scripts/poner-voz.mjs --medir DIR_DE_PISTAS` → mide la voz útil de cada pista (sin silencio de cabeza ni de cola), la compara con su tramo y escribe `duraciones.json`.
3. `node scripts/retemporizar.mjs && node scripts/build.mjs` → tramos desde las duraciones reales (hueco ≤ 0,25 s), y con ellos tarjetas, costuras, medios y eventos; `build.mjs` corta si una tarjeta o placa no alcanza a leerse (entonces se cambia el texto o se pide `lectura_min_cuadros`). Re-pasar TODOS los controles (abajo), renderizar y poner el audio en silencio.
   Los acentos de las tarjetas se re-reparten con la duración real; corregir `dt` en `plan.json → rel` donde el audio mezclado muestre otra cosa.
4. `node scripts/poner-voz.mjs DIR_DE_PISTAS [salida.mp4]` → pone cada pista en el segundo de su tramo, mezcla con loudnorm de dos pasadas, copia el video sin recodificar y **mide la mezcla**: avisa de pistas que se pasan de su tramo, pistas cortas (hueco > 0,3 s) y solapes;
   `silencedetect` (−35 dB, 0,3 s) cuenta los huecos por cada 10 s (máximo 1; la cola del CTA cuenta) y `ebur128` da el LUFS integrado (objetivo −14 ±1) y el pico verdadero (≤ −1 dBTP). Sale con 1 si algo incumple. Probado con 10 tonos sintéticos (no hay voz real): detecta pista corta, pista larga y solape, y da −13,9 LUFS.
5. Con voz, sin cama de música (`edicion-referentes`). Si el TTS lee mal «0 a 1» (línea 3), escribir «cero a uno» (+6 caracteres: caben). Al mezclar cambia el SHA-256: se vuelve a anotar acá y en `qa/sha-master.txt`.

## Lo que no pude cerrar ni verificar (dicho de frente)
1. **«Regla 15 de `edicion-referentes`»** no existe en el skill del repo (tiene 14 reglas; la de pausas es la 2, ≤ 0,5 s; `lucia/SKILL.md §11` dice 0,25 s; la revisión confirma que `PLAN.md` §4 fija 0,25 s). Apliqué el texto del encargo: pausa ≤ 0,3 s (huecos de 0,21–0,27 s), ningún tramo quieto > 0,3 s fuera de la lectura, un evento cada ≤ 2,0 s, y a lo sumo un hueco de voz ≥ 0,3 s por cada 10 s. Falta incorporarla al skill (no lo toqué: está fuera de esta carpeta).
2. **17 caracteres por segundo es una media** medida en G1 v2, no la voz de esta pieza. Cada línea puede salir ±10 %; el cronograma no se confirma hasta tener la voz (`--medir`). Los acentos y eventos repartidos «con la palabra» son una estimación lineal por caracteres.
3. **El criterio de «tramo quieto»** (firma de lo que el timeline anima, sin el empuje lento de las fotos; lectura de tarjeta exenta) es del editor; está medido también en píxeles. Sin la exención: 1,79 s DOM / 0,542 s píxeles.
4. **L8 lleva «los»** (ver «Decisión sobre L8») y **L5 sigue «La del café…»** (opcional del revisor). **«Una toma» no entra en la pastilla del café** (ver H2): el límite de las herramientas vive en el pie.
5. **No vi el video en un teléfono con la interfaz de Instagram.** La zona segura es la simulación de la regla. Los nombres de herramienta suben de 34 a 42 px; a 390 px de ancho quedan en ~15 px (antes ~12).
6. **Actualizado 11-oct: la madre lo midió** con el venv ya instalado (`qa/arcface-madre-11oct.txt`, ≤ 0,009). Lo que sigue es lo que decía el editor: **el face-gate con ArcFace no se re-corrió** (sin venv ni modelo): lo medido es el PSNR de la cara y que las entradas no cambiaron. Si la madre quiere el puntaje, correr `fuente-con-zoom.py` + `face-gate.sh` donde esté el venv (comando abajo).
7. **El pie es nuevo** y no pasó por la madre; `VALIDACION-G4-G5-MADRE.md` aprobó el guion de 57 s, no este recorte. Las cifras del pie están todas en `PROCEDENCIA` (0,81, 0,35, 0,77, 0,80, 0,79, 0,83) y `build.mjs` las comprueba.
8. **Sin hacer, fuera de esta carpeta:** copiar el master aprobado a `videos/lucia-entrega/` y marcar la G5 v1 (57,5 s, «Imagen A» / «Motor 4») como reemplazada para que no se publique por error tras D-N1; los otros videos (G2-G4) siguen con «Imagen A-F» / «Motor N».
9. **«Seedream 4.5 · parecido 0,81»** muestra el número de UNA imagen (0,806 en el original, 0,794-0,806 en los cuadros), no una propiedad de la herramienta; igual con el café (0,350). El pie lo dice («una imagen de…», «una toma de cada una»).
10. El render no es bit a bit reproducible entre ejecuciones (la 2.ª diferencia final ↔ fuente fue 0,010 y 0,013 en dos renders del mismo `index.html`); el ancla del master es el SHA-256 de arriba. Durante esta revisión un render murió a los 74 % (señal 9, la máquina estaba cargada: promedio de carga ~10 en 4 núcleos); se repitió bajo `flock` y salió completo.

## Reproducir
```bash
export PRODUCER_HEADLESS_SHELL_PATH=/opt/pw-browsers/chromium HYPERFRAMES_SKIP_SKILLS=1
node scripts/voz.mjs                          # cronograma de voz (sale con 1 si algo incumple)
node scripts/retemporizar.mjs                 # pone en plan.json los tiempos del cronograma (--ver: solo avisa si está desfasado)
node scripts/build.mjs                        # copia el material, valida y escribe index.html y qa/*-plan.json
npx -y hyperframes@0.8.142 check
# 1) preview 360p REAL primero (≈ 45 s). El borrador da 1 «error» de lint (root_zoom_rescales_a_fixed_canvas) y 1 aviso: NO frenan, sin --strict
node scripts/borrador-360.mjs /ruta/draft360 && (cd /ruta/draft360 && flock /tmp/hf-render.lock npx -y hyperframes@0.8.142 render --quality draft -f 24 -o /ruta/qa/g5-v2-preview-360p.mp4)
# 2) recién después el final (≈ 2 min, 4 núcleos, sin GPU; un solo render a la vez en esta máquina; correrlo como proceso hijo directo del shell: si el padre termina, el render se cancela)
flock /tmp/hf-render.lock npx -y hyperframes@0.8.142 render --quality high -f 24 -o renders/final-raw.mp4
ffmpeg -y -i renders/final-raw.mp4 -f lavfi -t 26.625 -i anullsrc=r=48000:cl=stereo -map 0:v -map 1:a -c:v copy -c:a aac -b:a 128k -shortest -movflags +faststart out/g5-v2-final-1080x1920.mp4
node scripts/medir-dom.mjs && node scripts/hueco-tarjetas.mjs && node scripts/ventanas.mjs && node scripts/eventos.mjs && node scripts/aire.mjs && node scripts/costuras.mjs && node scripts/grep-prohibidas.mjs
node scripts/pixeles.mjs vacios out/g5-v2-final-1080x1920.mp4 > qa/vacios-y-saltos.txt          # sin Python
node scripts/pixeles.mjs aire   out/g5-v2-final-1080x1920.mp4 > qa/aire-pixeles.txt            # necesita qa/lectura-tarjetas.json (lo escribe aire.mjs)
node scripts/pixeles.mjs psnr   out/g5-v2-final-1080x1920.mp4 > qa/psnr-fotos.txt              # incluye el PSNR de la caja de la cara
# con venv (numpy, cv2, onnxruntime): las referencias originales y el face-gate con ArcFace
export FACE_GATE_HOME=…/lucia-face-gate     # fuera del repo
$FACE_GATE_HOME/venv/bin/python scripts/vacios.py out/g5-v2-final-1080x1920.mp4 > qa/vacios-y-saltos.txt
$FACE_GATE_HOME/venv/bin/python scripts/psnr-fotos.py out/g5-v2-final-1080x1920.mp4 > qa/psnr-fotos.txt
$FACE_GATE_HOME/venv/bin/python scripts/aire.py out/g5-v2-final-1080x1920.mp4 > qa/aire-pixeles.txt
$FACE_GATE_HOME/venv/bin/python scripts/medir-caras.py > qa/caras-fotos.json
$FACE_GATE_HOME/venv/bin/python scripts/fuente-con-zoom.py out/g5-v2-final-1080x1920.mp4 /ruta/fgf > args.txt && bash .claude/skills/lucia/scripts/face-gate.sh $(cat args.txt)
COLS=6 bash scripts/hoja.sh out/g5-v2-final-1080x1920.mp4 hoja.jpg 330 f0 f12 f24 …      # «fNNN» = cuadro NNN exacto; 2 cuadros por segundo = de 12 en 12
```

## Cambio de pie del 11-oct (sesgo de referencias; sin re-render; corregido 07:50 UTC)

El pie suma: «Esas dos tomas (Kling O3 y Seedance 2.0 Mini + referencias) recibieron como entrada fotos que están entre las 8 con que se mide el parecido; midiendo solo con las 4 que nadie recibió, todos los clips bajan y el orden no cambia.»
La primera versión decía «efecto estimado ≈ 0,03 o menos, dentro del ruido»: **se retiró** porque la foto de arranque K1 (4afffb96) se generó con R1, R3, R6 y R7, así que no hay control limpio (revisión 2 de G2 v2.2).
Evidencia: sección «PRUEBA ESTRICTA» de `hermes-content/references/modelos/lucia/v4/prueba-motores-20261008/medicion-sin-refs-entrada-20261011.txt` (seis clips contra R2, R4, R5, R8: todos bajan de 0,03 a 0,09 y el orden por valor final es idéntico) y `job_display` de dd2d7c91, 948a89d3 y 4afffb96.
`scripts/build.mjs` exige las dos frases en el pie. El video no cambia: `index.html` md5 y master SHA `030e8f65…` intactos. `lucia-prohibidas.mjs pie.txt` → exit 0.
