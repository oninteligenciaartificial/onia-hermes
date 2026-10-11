# Lucía · G2 v2 «La misma foto, seis clips: ¿quién pierde la cara?» (26,5 s, 1080x1920, 24 fps, muda y cronometrada para voz)

Re-corte de `videos/lucia-g2/` (58 s, muda, con mucho tiempo muerto) con la regla de aire muerto, hecho en HyperFrames 0.8.142 con el método de `.claude/skills/lucia/montaje-hyperframes.md`.
**Costo: 0 créditos** (los mismos clips y la misma foto de G2; las 8 referencias, por curl desde las URL públicas del manifiesto de `v4/qa`; nada de Higgsfield ni de voz).
**Estado: PARA VER POR LA MADRE (preview 360p). No se publica nada.** La pista de audio es AAC en silencio (−91 dB) a propósito: la voz Marcela se agrega después, cuando haya cupo.

**D-N1 (11-oct, regla nueva que se aplicó):** ahora SÍ se nombran las herramientas, como uso propio y no como recomendación pagada. En toda la pieza «Motor 1 a 6» pasó a los nombres reales: **Kling 3.0 std** (clip 1), **Kling 3.0 pro** (2), **Seedance 2.0 Mini** (3), **Seedance 2.0 Mini + referencias** (4), **Kling O3** (5), **Cinematic Studio 3.0** (6). En pantalla salen solo tres (Kling 3.0 std, Seedance 2.0 Mini y Kling O3); cada nombre cuenta como una palabra más para el tiempo de lectura (0,35 s por palabra + 0,3) y para el cupo de voz; el pie lleva «Nombro lo que uso; no es una recomendación pagada.». Sigue prohibido: logos, capturas de interfaces de terceros y cualquier frase de «el mejor» o de recomendación general (`scripts/prohibidas.mjs` solo dejó de prohibir «kling», «seedance» y «cinematic»; el resto de las marcas sigue prohibido y hay una lista nueva de frases de recomendación que se busca en la pantalla, el pie y la voz).

| Qué | Dónde |
|---|---|
| **Guion de voz** (UNA línea por tramo; 14 líneas, 434 caracteres con espacios, 78 palabras; 447 caracteres con los saltos de línea; **no se generó audio**) | `guion-voz.txt` |
| Plan declarativo (los tiempos se escriben anclados a los tramos: «T6+0.8» = inicio del tramo 6 más 0,8 s; «T7-6f» = 6 cuadros antes del tramo 7; «FIN») | `plan.json` |
| Plan con TODOS los tiempos resueltos (lo leen los controles; lleva los 14 tramos con inicio, fin y ventana) | `plan.resuelto.json` |
| Generador: lee `guion-voz.txt`, calcula los tramos, **valida reglas y números contra `v4/PROCEDENCIA.jsonl`** y escribe `index.html` | `scripts/build.mjs` + `scripts/estilos.css` + `scripts/timeline.js` + `scripts/prohibidas.mjs` |
| Final 1080x1920 con AAC en silencio (git lo ignora, 30,3 MB) | `out/g2-v2-final-1080x1920.mp4` |
| Preview 360p REAL (render de HyperFrames de la misma composición a 360x640, no un reescalado; 1,8 MB) | `qa/g2-v2-preview-360p.mp4` |
| Pie para publicar (abre con «Personaje hecho con IA»; lo valida `build.mjs`) | `pie.txt` |
| Portada sugerida (1,6 s: promesa y las 6 miniaturas) | `qa/portada-1.6s.jpg` |
| QA | `qa/` (ver «QA medido») |

## Voz: los 14 tramos (3,6 palabras por segundo, huecos de 0,25 s exactos = 6 cuadros)
Cada tramo dura `round(24 × palabras ÷ 3,6)` cuadros; entre una línea y la siguiente hay 6 cuadros (0,25 s, el máximo). **Cada empuje de pantalla cae dentro de uno de esos huecos.** Si se cambia una línea de `guion-voz.txt`, `node scripts/build.mjs` vuelve a calcular todos los tiempos y se corta si algo deja de cumplir (lectura, 450 caracteres, 26-30 s).

| T | Línea de voz | Palabras | Voz (s) | Dura | La ventana llega hasta |
|---|---|---:|---|---:|---:|
| T1 | «Misma foto, misma orden, seis clips.» | 6 | 0,125 – 1,792 | 1,667 s (40 cuadros) | 2,042 |
| T2 | «¿Quién pierde la cara?» | 4 | 2,042 – 3,167 | 1,125 s (27) | 3,417 |
| T3 | «Se mide contra ocho fotos suyas.» | 6 | 3,417 – 5,083 | 1,667 s (40) | 5,333 |
| T4 | «De cero a uno.» | 4 | 5,333 – 6,458 | 1,125 s (27) | 6,708 |
| T5 | «Mi piso: cero setenta.» | 4 | 6,708 – 7,833 | 1,125 s (27) | 8,083 |
| T6 | «Kling tres, atado a la foto: pierde parecido.» | 8 | 8,083 – 10,292 | 2,208 s (53) | 10,542 |
| T7 | «Seedance Mini, también atado.» | 4 | 10,542 – 11,667 | 1,125 s (27) | 11,917 |
| T8 | «Queda bajo el piso.» | 4 | 11,917 – 13,042 | 1,125 s (27) | 13,292 |
| T9 | «Kling O tres, solo referencias: sostiene la cara.» | 8 | 13,292 – 15,500 | 2,208 s (53) | 15,750 |
| T10 | «Pero inventó el cuarto.» | 4 | 15,750 – 16,875 | 1,125 s (27) | 17,125 |
| T11 | «Con fotos de referencia, la cara se sostiene.» | 8 | 17,125 – 19,333 | 2,208 s (53) | 19,583 |
| T12 | «Pero el motor inventa la escena.» | 6 | 19,583 – 21,250 | 1,667 s (40) | 21,500 |
| T13 | «Una toma cada uno: es una prueba.» | 7 | 21,500 – 23,458 | 1,958 s (47) | 23,708 |
| T14 | «Seguime: cada semana, una prueba.» | 5 | 23,708 – 25,083 | 1,375 s (33) | 26,500 (fin) |

Qué nombres se dicen y cuáles solo se leen (D-N1, el cupo no alcanza para decirlos completos): la voz dice «Kling», «Seedance Mini» y «Kling O tres»; la pantalla lee «Kling 3.0 std», «Seedance 2.0 Mini» y «Kling O3». Los números (0,79, 0,72…) solo se leen: decirlos costaba ~60 caracteres.
**Después del último tramo quedan 1,4 s sin voz** (25,083 → 26,5 s): es el tiempo que el CTA tiene que estar en pantalla (2,79 s; la marca pide 2,4-5,5 s y la lectura de sus 5 palabras, 2,05 s). Cuando haya audio, el largo real de cada línea puede diferir de las 3,6 palabras por segundo del cronograma (434 caracteres a ~19 por segundo son ~23 s de habla): si una línea real dura más que su tramo se acorta el texto, no se acelera la voz.

## Tabla de cortes (t en s; los empujes de 6 cuadros caen en [T−0,25, T])
| t (s) | Capa | Texto en pantalla |
|---|---|---|
| 0,000 – 3,417 | **Foto K1** a pantalla completa con empuje lento 1,00 → 1,05 hacia la cara (nunca hay dos cuadros idénticos) + las **6 miniaturas** | rótulo «Lucía Antelo · personaje IA de Onia» **del cuadro 0 a los 3,0 s, 40 px** · «Misma foto. Seis clips.» **ya en el cuadro 0** (0 – 1,708; «Seis clips.» se enciende a 0,95) · miniaturas 1 a 6 entran de 0,75 a 1,35 s (cada 0,12 s; todas a la vista desde 1,5 s) · «¿Quién pierde la cara?» (1,708 – 3,417; «la cara?» se enciende a 2,45) |
| 3,167 – 8,083 | **Placa de la regla**: 5 de las 8 referencias, escala 0-1, marca en 0,70 | «Se mide contra 8 fotos suyas.» (3,417 – 6,458; acento a 4,617) · referencias 3,717 – 4,317 (cada 0,15 s) · «5 de las 8 fotos de referencia» (4,367) · la escala se dibuja a 5,333 (voz «de cero a uno») · ejes 5,783 · «idéntica · 1» se enciende a 6,083 · «Mi piso: 0,70.» (6,458 – 8,083) · marca 0,70 y zona verde a 6,758 |
| 7,833 – 10,542 | **Kling 3.0 std**, cuadros 0-64 del clip a 1× (el cuadro 0 es la foto K1) | tarjeta «Kling 3.0 std / 7,5 créditos» (8,083 – 10,542) · «parecido 0 s: 0,79» (8,183) · «→ 5,9 s: 0,72» (8,733) |
| 10,292 – 13,292 | **Seedance 2.0 Mini**, cuadros 0-71 a 1× | tarjeta «Seedance 2.0 Mini / 6 créditos» (10,542 – 13,292) · «parecido 0 s: 0,69» (10,642) · «→ 5,9 s: 0,64» (11,142) · sello «bajo el piso» (11,492) |
| 13,042 – 17,125 | **Kling O3**, cuadros 0-97 a 1× | tarjeta «Kling O3 · 6 créditos / solo referencias» (13,292 – 15,750) · «parecido 0 s: 0,80» (13,392) · «→ 5,9 s: 0,82» (13,992) · tarjeta «Inventó el cuarto.» (15,750 – 17,125) |
| 16,875 – 23,708 | **Placa de la lección**: los finales de los tres en barras sobre la escala 0-1, marca en 0,70 | título «Parecido al final: 3 de los 6 clips» (17,275) · «mi piso · 0,70» (17,175) · barras Kling 3.0 std 0,72 · Seedance 2.0 Mini 0,64 · Kling O3 0,82 (17,475; cada 0,3 s) · anillo en Kling O3 (18,375) · nota «Final = segundo 5,9, que no se ve entero.» (18,925) · tarjetas «Con referencias, la cara se sostiene.» (17,125; acento 18,325) → «Pero inventa la escena.» (19,583; acento 20,383) → «Una toma: es una prueba.» (21,5; acento 22,4) · los rótulos de las barras cambian: «inventó el cuarto» (19,783), «cambió el plano» (20,133), «mantiene el cuarto» (20,483) |
| 23,458 – 26,500 | **Cierre**: el clip K1 (el de Kling 3.0 std) de 2,25 a 5,25 s | CTA exacto «Seguime: cada semana, una prueba.» (23,708 – 26,5 = 2,79 s; «cada semana, una prueba.» se enciende a 24,708) |

## Qué se conservó de G2
- **El gancho** «Misma foto. Seis clips. ¿Quién pierde la cara?» con las 6 miniaturas a la vista antes de los 3 s; la promesa ya está en el cuadro 0.
- **La regla de medición:** 8 fotos suyas (5 a la vista), escala 0 a 1, **«mi piso» 0,70** (la tarjeta, el rótulo de la lección y el pie dicen que lo elegí yo).
- **El contraste esencial en tres herramientas:** Kling 3.0 std (atado a la foto, pierde parecido: 0,79 → 0,72), Seedance 2.0 Mini (bajo el piso: 0,69 → 0,64), Kling O3 (solo referencias, sostiene la cara: 0,80 → 0,82, pero inventó el cuarto). Los clips van a 1×, sin acelerar, estirar ni congelar, recortados a sus primeros 2,7 / 3,0 / 4,1 s.
- **La lección** («con referencias la cara se sostiene, pero el motor inventa la escena») y el **CTA** exacto.
- **Las aclaraciones honestas:** «Final = segundo 5,9, que no se ve entero.» (en la placa; los clips se ven hasta los 2,7-4,1 s y el «final» de `PROCEDENCIA.jsonl` es del 5,9); «mi piso» (arriba); «3 de los 6 clips» (la pieza no esconde que mostró solo tres); «Una toma: es una prueba.» (y el pie: «no es una regla»). La aclaración «1080p» ya no hace falta: el único clip de 1080p (Kling 3.0 pro) no sale.
- **Todo número sale de `v4/PROCEDENCIA.jsonl` y `build.mjs` se corta si no coincide** (arranque y final a 2 decimales con media hacia arriba, créditos, segundo de la última muestra) y también las afirmaciones: «pierde parecido» (final < arranque), «queda bajo el piso» (arranque y final < 0,70), «sostiene la cara» (≥ 0,70 de punta a punta). El pie solo puede llevar cifras que la pantalla muestre.

## Qué se quitó de G2 y por qué
| Se quitó | Por qué |
|---|---|
| **Kling 3.0 pro** (9 cr, 1080p) y **Seedance 2.0 Mini + referencias** (6 cr, letrero inventado) | el contraste esencial cabe en 3 herramientas; con tres más, la voz sumaría ~580 caracteres (estimado: ~50 por herramienta), sobre el tope de 450. Con ellos se van la pastilla «1080p» y el aro verde del letrero. |
| **Cinematic Studio 3.0** (20 cr, 4 s): placa del precio («5 créditos por segundo», «4×») | la nota de precio «solo si cabe»: **no cabe** (+55 caracteres de voz y +3 s dejarían el guion en ~490 caracteres, sobre el tope de 450). El precio de cada herramienta que sí sale sigue en su tarjeta. |
| Lección 1 (tres arranques y tres finales) y la lección de seis barras | una sola placa de tres barras, **en el orden en que aparecen en el video y no ordenadas por puntaje** (ordenar por final sugería un ranking, justo lo que D-N1 prohíbe). |
| Segmentos de 5 s por clip | cada clip se ve de 2,7 a 4,1 s, recortado a los primeros cuadros. |
| Los datos separados «0 s» y «5,9 s» en tres pastillas por clip, la tarjeta de dato larga y las notas de 10-11 palabras | quedan dos pastillas cortas (4 y 3 palabras) y una nota de 8; todo lo que se lee cabe en el tiempo de lectura. |
| La pista de pops, la música y el silencio de la 1ª pasada | sigue muda (a propósito); el montaje ya no deja ningún hueco que «espere» a la música. |

## Decisiones que la madre puede revertir
1. **El gancho dura 3,417 s y no 3,0.** Sus 8 palabras necesitan 3,4 s de lectura (4 + 4 palabras, 0,35 s por palabra + 0,3 por tarjeta, 1,708 s cada una). La promesa está en el cuadro 0, las 6 miniaturas a la vista desde 1,5 s y el rótulo sale a los 3,0 s. Acortarlo exige dejar de cumplir el tiempo de lectura.
2. **Dos tarjetas llegan antes que su voz:** «¿Quién pierde la cara?» (0,33 s antes de T2) y «Mi piso: 0,70.» (0,25 s antes de T5). El ojo lee más rápido de lo que se habla; si prefiere pegarlas a la voz hay que acortar las tarjetas vecinas. `plan.json → tarjetas c3/c4/c1/c2`.
3. **Empuje lento 1,00 → 1,05 sobre la foto** del gancho: con él el gancho tiene 0 cuadros idénticos (`qa/aire.txt`). Sin él, de ~1,7 a 3,4 s la foto solo cambiaría por dos acentos de color (no lo medí sin el zoom). Para una foto fija: `plan.json → medios[foto].zoom = 1`.
4. **«lo elegí yo» está en el pie y en «mi piso», pero no en la voz** (13 caracteres de voz; con la línea «Mi piso, cero setenta: lo elegí yo.» el guion sube a 447 caracteres, que sigue ≤ 450 por suma, pero con los saltos de línea pasaría de 450 y la pieza crece 0,83 s). Revertir: `guion-voz.txt` línea 5.
5. **Después de la voz quedan 1,4 s de CTA sin voz.** Si no se quiere cola: `plan.json → voz.cta_ventana_cuadros` (mínimo 58 = 2,4 s; hoy 67).
6. **Se dice «Kling tres» y «Kling O tres»** (3.0 std y O3): la voz no distingue «std», que solo se lee. Si se quiere decir más, cada palabra cuesta ~6 caracteres y ~0,28 s.
7. **«3 de los 6 clips»** en el título de la placa y «Acá van tres de los seis» en el pie: la pieza declara que mostró tres. Revertir: `plan.json → leccion.titulo` (y la frase del pie, que `build.mjs` compara con los nombres).
8. **El cierre usa el clip de Kling 3.0 std de 2,25 a 5,25 s** (el cuadro 54 es cuando Lucía ya mira a cámara, según G2 H7): medido cada 6 cuadros, el parecido va de 0,71 a 0,76 y ninguno baja de 0,70. Mi primera ventana (desde 2,75 s) terminaba en un cuadro de 0,680 (el 132, entre vecinos de 0,71-0,72) y la descarté. `plan.json → medios[k1].media_inicio`.
9. **El Kling 3.0 pro y el Seedance 2.0 Mini + referencias salen de la pieza** (y con ellos el «1080p» y el aro del letrero, que los revisores de G2 pidieron). Si la madre los quiere, hay que sacar otra cosa: no caben en 450 caracteres de voz.
10. **Los nombres completos (versión y «std») solo se leen.** Dejar «Motor N» otra vez es imposible: `build.mjs` y `marca.mjs` cortan si queda un «Motor N».

## Dos cosas que la madre debe saber (fuera de esta carpeta, no las toqué)
- **La «regla 15» de `edicion-referentes` no está en el repo:** `.claude/skills/edicion-referentes/SKILL.md` llega hasta la regla 14. Apliqué la definición del encargo (pausa ≤ 0,3 s entre frases —acá ≤ 0,25 s, el máximo de `lucia` §11—, ningún tramo de más de 0,3 s con la pantalla idéntica y sin una tarjeta en lectura, un evento visual nuevo como máximo cada 2,0 s). Si ya la tiene escrita en otra rama, conviene comparar.
- **El guion `G2-la-misma-foto-seis-clips.md` sigue describiendo la pieza de 58 s** (y dice «Motor 1 a 6»). Esta v2 cambió tarjetas, cortes y nombres. Propuesta para quien commitea: una sección «v2» en ese guion, o archivar la tabla vieja. **Trampas nuevas para `montaje-hyperframes.md`** (con su caso):
  1. **`data-start` se redondea hacia ABAJO.** Con 10,291667 en vez de 10,2916666… el render muestra el cuadro 0 del clip dos veces y el clip llega un cuadro atrasado: el PSNR dio el pico en n−1 en 6 de 12 casos (Seedance y Kling O3), y en 0 de 12 después de redondear con `floor` a 6 decimales (los de Kling 3.0 std habían caído en el lado bueno por azar).
  2. **El aire se mide contando píxeles que cambian, no con la diferencia media.** La escala que se dibuja o un rótulo que cambia de color mueven 0,03-0,10 de diferencia media y parecen «quietos»; con «menos de 8 píxeles cambian más de 6 niveles» el primer render tenía un tramo de 0,71 s sin tarjeta en lectura (la escala ya dibujada) y se arregló adelantando la marca «1» y la tarjeta «Mi piso».
  3. **Lo que cuelga de una tarjeta que viaja en un empuje (pastillas, sellos) va en la lista del empuje**; si no, se queda donde está y la pila se parte.
  4. **Una ventana de un clip que se reusa (el cierre) se elige mirando el parecido por cuadro** (el cuadro 132 de Kling 3.0 std da 0,680 entre 0,71 vecinos).
  5. **Los nombres cuentan como palabras** (D-N1): «Seedance 2.0 Mini» es una tarjeta de 5 palabras y no cabía como etiqueta dentro de una barra de 563 px; el nombre pasó a una fila aparte sobre la barra.

## QA medido (final `out/g2-v2-final-1080x1920.mp4`; todos los scripts están en `scripts/` y los resultados en `qa/`)
| Control | Resultado | Archivo |
|---|---|---|
| `hyperframes check` | 0 errores; runtime, layout y motion sin advertencias; 10 avisos informativos de layout (texto que viaja fuera del lienzo durante el empuje y el cuadro de solape de la cadena de tarjetas); contraste **34/34 AA**; 19 avisos de estilo que no frenan (`nested_structure_needs_subcomposition`, `timeline_track_too_dense`) | `hyperframes-check.txt` |
| `build.mjs` (reglas) | tarjetas ≤ 6 palabras y ≥ 0,35 s por palabra + 0,3; 21 textos que no son tarjeta ≥ lo mismo (descontada la entrada de 0,18 s); voz ≤ 450 caracteres y huecos ≤ 0,25 s; CTA exacto de 2,4 a 5,5 s; pie abre con «Personaje hecho con IA» y no tiene cifras que la pantalla no muestre; números contra `PROCEDENCIA.jsonl`; 26-30 s | `tabla-de-cortes-y-lecturas.txt` |
| **Aire muerto** (`aire.py`, sobre el video renderizado) | **mayor tramo quieto: 0,875 s, y siempre bajo una tarjeta en su tiempo de lectura; mayor tramo quieto SIN tarjeta en lectura: 0,167 s (4 cuadros; tope 0,3 s).** 6 tramos idénticos de más de 0,3 s, todos bajo lectura. Clips y foto: 0 cuadros idénticos. Eventos visuales: **52 en 26,5 s (mínimo 12 por 10 s, máximo 27, promedio 19,6); hueco máximo entre eventos 1,79 s** (tope 2,0) | `aire.txt`, `eventos-visuales.txt` |
| `hueco-tarjetas.mjs` | **0 cuadros sin tarjeta de 636** (la promesa está en el cuadro 0) | `hueco-tarjetas.txt` |
| `medir-dom.mjs` (zona segura en el DOM, 212 instantes, 1.258 cajas de texto) | todo texto entre mentón+40 (el mentón sale de `caras-por-clip.json` por cuadro y, en la foto, con el zoom) y y=1490, nada sobre y=280, nada en x>1000 bajo y=1000, **ningún texto < 34 px**, ningún texto se pisa; barras y marca a 100 + 880 × valor (±1,5 px) | `zona-segura.txt` |
| `ventanas.mjs` (ventana REAL de lectura en el DOM, cuadro a cuadro) | **21 textos, todos alcanzan** (la menor holgura: 0,28 s) | `ventanas-de-lectura.txt` |
| `marca.mjs` | rótulo legible del cuadro 0 al 70 (2,958 s), a 40 px, fuera desde los 3,0 s · promesa legible en el cuadro 0 · 6 miniaturas a la vista desde 1,5 s · CTA exacto legible hasta el último cuadro, 2,875 s · cero «Motor N» y los tres nombres en pantalla | `marca.txt` |
| `grep-prohibidas.mjs` | limpio en pantalla, en el pie y en `guion-voz.txt` (sin marcas fuera de las tres herramientas nombradas, sin promesas, sin profesión de salud, sin Sergio Urcullo, sin producto de Onia, sin frases de «el mejor» ni recomendación salvo el aviso del pie) | `grep-prohibidas.txt` |
| `vacios.py` | **0 cuadros planos**; saltos de luma de 42-52 solo dentro de los 6 empujes (foto clara ↔ placa oscura) y **≤ 2,8 fuera de ellos** | `vacios-y-saltos.txt` |
| `costuras.mjs` (costuras rígidas de 6 cuadros, medidas en el DOM) | los **6 empujes**: borde con borde (±0,75 px) cuadro a cuadro de T−6 a T, sin tiras de fondo, en reposo antes y después | `costuras-rigidas.txt` |
| `psnr-clips.py` (PSNR del final contra la fuente) | **12 de 12 casos con el pico en el cuadro prometido** (36,1-38,1 dB contra 21,0-36,7 de los vecinos); diferencia de media RGB ≤ ±2 niveles | `psnr-clips.txt` |
| `medir-caras.py` (SCRFD cada 2 cuadros) | idéntico a G2 (73 filas por clip, diferencia máxima de mentón 0 px) | `caras-por-clip.json` |
| `face-gate.sh` (8 cuadros del final contra la fuente en el mismo cuadro) | diferencias **0,004 / 0,014 / 0,001 / 0,001 / 0,000 / 0,001 / 0,011 / 0,001** (≤ 0,02): el escalado ×1,5 y el H.264 no deforman la cara. Seedance 2.0 Mini sigue bajo 0,70 en la fuente y en el final (0,67 y 0,63, como dice el sello). Cierre: 0,74 → 0,71. Caras de 115-255 px: cifras orientativas | `face-gate.txt` |
| Especificaciones | H.264 1080x1920, 24 fps, **636 cuadros = 26,500 s**, bt709, 9,1 Mbps; AAC 48 kHz estéreo −91 dB. Preview 360x640, 636 cuadros | `specs-final.txt` |
| Mirado renderizado (hojas de contactos del FINAL a 2 cuadros por segundo, con las guías de Instagram, y los 6 empujes cuadro a cuadro) | sin cuadros vacíos, sin tiras de fondo, nada tapa la cara; la placa de la lección y la pila de datos mirados a resolución completa | `hoja-qa-1/2/3.jpg`, `hoja-costuras.jpg` |

**Lo que el video afirma contra los datos:** «pierde parecido» (0,79 → 0,72), «queda bajo el piso» (0,69 y 0,64 < 0,70), «sostiene la cara» (0,80 → 0,82), «inventó el cuarto» (el cuarto de la foto K1 no es el del clip de Kling O3: se ve desde el cuadro 0), «cambió el plano» (Seedance 2.0 Mini: la cara crece de 119 a 179 px y cambian el edificio y la calle), «mantiene el cuarto» (Kling 3.0 std, mirado en G2), «con referencias / solo referencias / foto sola» (PROCEDENCIA: foto de inicio + 3 referencias, 5 referencias sin foto, foto de inicio). **No afirma** que una herramienta sea «mejor» ni que 0,70 sea una frontera objetiva.
**Avisos:** (1) antes de publicar, la madre debe ver el reel en el teléfono con la interfaz de Instagram (el rótulo de IA está en y=720-802 y el CTA en y=1234-1470, dentro de la zona segura medida); (2) la etiqueta «Información de IA» va por API, y la vía real es `ig-reel.mjs --cuenta lucia` en el VPS (la madre). Esta sesión no publica nada.

## SHA-256 del final
`36a949e89ac70d46e6ad461247a80687934efecbd5f3d999db6579af5a532f15`  `out/g2-v2-final-1080x1920.mp4`
(el preview 360p: `ef33eee284040aadc54103abe0a6deee8ae870dd19c67d69d14a3edaccc726d6`). El render no es bit a bit reproducible entre máquinas: si se vuelve a renderizar, vuelve a medirse.

## Reproducir
```bash
node scripts/build.mjs                      # copia el material si falta (clips, foto, fuentes; todo va al .gitignore), valida y escribe index.html + plan.resuelto.json
export PRODUCER_HEADLESS_SHELL_PATH=/opt/pw-browsers/chromium HYPERFRAMES_SKIP_SKILLS=1
npx -y hyperframes@0.8.142 check
node scripts/medir-dom.mjs && node scripts/hueco-tarjetas.mjs && node scripts/eventos.mjs && node scripts/ventanas.mjs && node scripts/costuras.mjs && node scripts/marca.mjs && node scripts/grep-prohibidas.mjs
# 1) preview 360p REAL primero (~1 min); 2) recién después el final (~2,5 min). Siempre con flock: nunca dos renders a la vez
node scripts/borrador-360.mjs /ruta/draft360 && (cd /ruta/draft360 && flock /tmp/hf-render.lock npx -y hyperframes@0.8.142 render --quality draft -f 24 -o /ruta/draft.mp4)
flock /tmp/hf-render.lock npx -y hyperframes@0.8.142 render --quality high -f 24 -o renders/final-raw.mp4
ffmpeg -y -i renders/final-raw.mp4 -f lavfi -t 26.5 -i anullsrc=r=48000:cl=stereo -map 0:v -map 1:a -c:v copy -c:a aac -b:a 128k -shortest -movflags +faststart out/g2-v2-final-1080x1920.mp4
export FACE_GATE_HOME=…/lucia-face-gate     # fuera del repo; venv con numpy, cv2, onnxruntime
python3 scripts/psnr-clips.py out/g2-v2-final-1080x1920.mp4 > qa/psnr-clips.txt
$FACE_GATE_HOME/venv/bin/python scripts/aire.py out/g2-v2-final-1080x1920.mp4 > qa/aire.txt
$FACE_GATE_HOME/venv/bin/python scripts/vacios.py out/g2-v2-final-1080x1920.mp4 > qa/vacios-y-saltos.txt
$FACE_GATE_HOME/venv/bin/python scripts/medir-caras.py > qa/caras-por-clip.json      # SCRFD cada 2 cuadros (2 min)
bash .claude/skills/lucia/scripts/face-gate.sh out/g2-v2-final-1080x1920.mp4@T1,T2,… assets/m1.mp4@… assets/m3.mp4@… assets/m5.mp4@…   # «T» = (cuadro − 0,4)/24 s para caer en el cuadro exacto
COLS=6 bash scripts/hoja.sh out/g2-v2-final-1080x1920.mp4 hoja.jpg 330 f0 f12 …                                                      # «fNNN» = cuadro NNN exacto
```
