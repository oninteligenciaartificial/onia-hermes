# @adrien.ninet: edición y montaje de 4 reels (perfil y vibe)
Recepción: 2026-10-10 · Análisis: 2026-10-10 (reels publicados del 8 al 10-oct) · Tipo: 4 reels de Instagram + capturas del perfil
Fuente: perfil `@adrien.ninet`; reels `DeUZJC6g-g1` (R1), `DeUP_JBz1IC` (R2), `DeSFD-XzDqc` (R3), `DeO7DugISSR` (R4). URL de cada uno = `https://www.instagram.com/reel/<ID>/` (armada con el ID). Instrucción de Sergio Urcullo: «Me encanta la vibe del perfil y demás» + «Y edición» (literal; no pidió producir nada: es para aprender)
Acceso: parcial. Los 4 MP4 se bajaron y se miraron; el perfil solo en 2 capturas (`perfil-1.png`, `perfil-2.png`). No se escuchó el audio; el transcript trae tiempos por segmento, no por palabra · Sesión/carril: sesión madre v2 revisión (worktree `sesion-madre-v2-revision-696bb0`), carril edición/marca personal

Etiquetas: **observado** (visto en cuadros o medido con ffmpeg), **declarado** (lo dice el autor o el perfil), **inferencia** (mía, sin verificar), **propuesta** (para Onia). Los colores son muestreo de cuadros 1080x1920: **aproximados**.

## Cobertura y límites

- Qué se miró: las 4 hojas originales, hojas propias a 4 fps de los segundos 0-5 y a 2 fps de cada reel completo (todas con el segundo impreso), cortes duros con `select=gt(scene,0.30)`, volumen con `ebur128`, espectrogramas de 0-12 s de R2 y R4, colores muestreados. No se instaló nada.
- Tipografías: **no verificables** (sin CSS ni archivos de fuente). Todo lo que se dice de familias es inferencia por captura.
- Música y SFX: inferencia, no se escuchó. R1 trae un film generado cuya música se lee en pantalla (27 s: «original 120 BPM score»).
- Terceros que aparecen en R1 y R3: no identificados, y no hace falta.
- Los -14 LUFS de los 4 reels son probablemente la normalización de la plataforma (trampa ya registrada en `edicion-referentes`, Rocha). No se toman como decisión de mezcla.
- Los números de likes y comentarios son metadatos de la captura, no resultados de Onia ni prueba del mecanismo de DM.

## Números por reel (observado)

| Reel | Dur. | Cortes duros (umbral 0,30) | Por 10 s | Plano medio | Capa nueva cada* | Palabras/s | Pausas ≥0,2 s | LUFS | Likes / coment. |
|---|---|---|---|---|---|---|---|---|---|
| R1 `DeUZJC6g-g1` motion | 53,2 s | 17 | 3,2 | 3,0 s | ~2,4 s | 3,28 (con voz) | 0 | -14,2 | 61 / 50 |
| R2 `DeUP_JBz1IC` tráiler YT | 46,3 s | 11 | 2,4 | 3,9 s | ~2,4 s | 3,77 | 1 (0,20 s) | -14,2 | 33 / 2 |
| R3 `DeSFD-XzDqc` noticia | 42,1 s | 10 | 2,4 | 3,8 s | ~2,1 s | 3,45 | 0 | -14,4 | 85 / 3 |
| R4 `DeO7DugISSR` librería UI | 28,0 s | 8 | 2,9 | 3,1 s | ~1,5 s | 3,80 | 0 | -14,4 | 6.019 / 2.591 |

\*«Capa nueva» es un conteo a mano en las hojas de 2 fps (±2). R4 rinde 70 a 180 veces los likes de los otros tres.

## Qué se aprende por dimensión

| Dimensión (las 12) | Hallazgo | Evidencia/localizador | Estado de evidencia | Regla transferible y límite | Skill destino + sección |
|---|---|---|---|---|---|
| Patrones | Resultado o producto ya en el cuadro 0; píldora de 1 palabra fija en el mentón; tesis en serif itálica; cursor sincronizado con el verbo («hold down» con el clic sostenido, «copy» con el clic en Copy) | R4 0,2 s, 10,5-12,0 s y 22 s; R1 46,6 s; R2 11,0-12,5 s | observado (4 reels de UNA cuenta: candidato, no patrón probado) | Probar cada uno en una pieza y medir contra esta ficha. Límite: una cuenta | `edicion-referentes`, «Receta Adrien» |
| Colores y paleta | Lienzo #F6F6F6-#FBFBFB, texto ~#111, azul marino y gris; el acento lo pone el producto mostrado (naranja del CTA ~#914A2E sobre oscuro; violeta de la marca en R1) | Muestreo en cuadros R2, R4 | observado, aproximado | Lienzo blanco #FFFFFF (tema `blanco`) + texto #0A0F0D; el verde #10C26B va en UN objeto por cuadro, no en el subtítulo | `diseno-contenido-onia` (propuesta); «Receta Adrien» |
| Tipografía | Sans bold para el arranque del titular + **serif itálica de contraste a 1,6-2x** en la palabra clave; serif condensada en mayúsculas en la palabra del CTA | R2 1,0-1,5 s («build an app» / «by tomorrow.»); R4 1,25 s («premium»); CTA R1 y R4 | inferencia (grotesca tipo Inter/SF y serif tipo Instrument Serif: sin verificar) | Decidir la familia con `diseno-contenido-onia`; no copiar la serif a ciegas | `diseno-contenido-onia` (pendiente de familia) |
| Edición y montaje | 2,4-3,2 cortes duros por 10 s, capa nueva cada 1,5-2,4 s, cero pausas ≥0,2 s en 3 de 4 reels, corte seco entre layouts | Tabla de arriba; hojas a 2 fps | observado y medido | Va más lejos que la regla 2 (nuestro máximo es 0,5 s). No bajar la pausa a 0,2 s sin escuchar el resultado | `edicion-referentes`, reglas 2 y 3 (ya existen) + «Receta Adrien» |
| Estilo visual | Tarjetas flotantes con radio grande y sombra amplia y suave que entran con fundido + desenfoque; la cámara también se vuelve tarjeta y la UI de atrás se desenfoca; costura en degradado, nunca línea | R2 21,68 s; R3 5,0 s; R1 0-7 s; R4 0-2 s | observado | Costura en degradado: blanca sobre lienzo claro, oscura sobre material oscuro | «Receta Adrien» |
| Estructura de contenido | R4: gancho superlativo con producto real → por qué (detalles) → 3 microinteracciones → «se copia y pega» → remate → CTA de palabra, todo en 28 s. R1: resultado → ancla de costo → reto → pasos → CTA → revelación de 15 s → CTA. R2: escenario → secreto no revelado → pasos 1/2/3 → tarjeta de YouTube. R3: noticia → giro → tweets → insight → tesis sin CTA | Hojas a 2 fps de cada reel | observado | Showcase de un recurso en ~28 s; tráiler de un YouTube como alternativa a la regla 13 | «Receta Adrien» |
| Guion y gancho | Superlativo, pregunta-escenario o noticia en 0,0 s, con la prueba antes de los 0,5 s | R4 0-1,75 s (la impresora imprime el ticket); R2 0,0-1,5 s; R3 0-1,5 s | observado | Coincide con la regla 1. No copiar frases («premium», «doesn't look AI-made») | `edicion-referentes`, regla 1 (ya existe) |
| Idioma y tono | Inglés, primera persona, calma y conversada, léxico de gusto/diseño | Transcripts de los 4 reels | observado | En Onia: marca personal = vos; producto y clientes = usted. No se traslada el inglés | `diseno-contenido-onia` (sin cambio) |
| UI y UX | Lo que vende R4 son microinteracciones físicas (casete con carretes, borrar manteniendo apretado, recibo que se imprime) | R4 8,0-17,5 s | observado en el video; **no** se probó en la web de la librería | Un recurso con micro-demostraciones reales vende mejor que describirlo. Sin verificar que la librería funcione así | `onia-web-factory` (idea para el banco; no se adopta) |
| Frontend | En pantalla se ve TSX, phosphor-icons y motion/react | R4 20,0 s (dropzone y código) | observado en cuadro; no se revisó ningún repo | No afirmar el stack de la librería | No aplica a ONIA hoy; solo ficha |
| Backend y arquitectura | No aplica | n/a | no aplica | n/a | n/a |
| Negocio y oferta | CTA «Comment PALABRA» → DM (R4: 2.591 comentarios); R2 deriva a un YouTube; el perfil se presenta «AI Designer & Founder», 298 mil seguidores | Caption R4; perfil-1.png y perfil-2.png | declarado (cifras y el envío del DM no probados) | En Onia el CTA es «Buscá PALABRA en Avisos» con recurso existente; no prometer comentario→DM sin prueba | `edicion-referentes` (CTA ya adaptado) |

## Edición segundo a segundo (observado en hojas a 4 y 2 fps)

### Primeros 5 s de cada reel

- **R1:** a 0,0 s el layout de reacción ya está armado y la voz arranca en 0,0. Arriba, tarjeta chica con su cámara (0-22 % del alto a 0,04 s; 0-27 % a 5,0 s) donde mira hacia abajo; abajo, tarjeta grande (24-100 %; 29-97 % a 5,0 s) con el clip de **un tercero** que reacciona al resultado, con su propio subtítulo quemado. No es un resultado propio. Dentro de la tarjeta grande el contenido cambia cada 0,25-1 s: papel, «Claude Motion Designer», barrido naranja a 1,75 s, «TYPE» a 2,0 s, glitch a 3,0 s, «type» en serif itálica a 3,25 s, transición circular a 4,5 s, «FORM» a 4,75 s. El layout de afuera no tiene corte duro hasta los 7,0 s.
- **R2:** 0,0 s cara completa con **push-in animado sin corte** (ojos de ~36 % a ~29 % del alto entre 0,0 y 2,1 s; cero cambios de escena a umbral 0,15); el titular se arma palabra por palabra: «What if you had to» (≤0,5 s), «build an app» en bold (1,0), «by tomorrow.» en serif itálica desenfocada que queda nítida a 1,5 s. 2,2 s corte duro a lienzo claro con tarjeta ilustrada (el foco se prende y apaga 2,5-4,0 s), debajo «Maybe it's an / *app idea*». 4,24 s corte duro a la cara, con la píldora de una palabra.
- **R3:** 0,0 s pantalla partida: arriba el logo oficial del lanzamiento sobre negro (~0-50 %), el borde de abajo se difumina sobre la cámara sin línea; abajo la cara, con la píldora en la costura (~55 %). El panel cambia a 1,0 s (captura de la app) y 1,5 s (render de la mascota). 2,64 s corte duro a b-roll de archivo a pantalla completa con una tarjeta blanca donde se teclea «dot.com» letra por letra (2,75-3,5 s); 4,25 s check naranja; 5,0 s barra de navegador con la cámara en tarjeta redondeada abajo.
- **R4:** el cuadro 0 es una portada (corte a 0,04 s). La impresora de recibos entra desde arriba a 0,2 s e imprime el ticket hasta 1,75 s. La cabeza queda **recortada sobre el lienzo blanco** (la pared se funde a blanco detrás de ella: hace falta recorte de persona, un degradado solo la taparía) y los hombros van en una tarjeta redondeada abajo (~73-100 % desde 1,0 s). El titular negro se arma palabra por palabra: «This», «might be» (entra gris y se oscurece), «one of the most», y a ~1,5 s «*premium*» en serif itálica gigante (a 1,3 s todavía no está). 2,0 s el panel pasa a la grilla de la librería y el subtítulo cambia a la píldora. 4,4 s corte duro a la web de la librería, con texto que se teclea. 5,4 s cara + un GIF de cocina en tarjeta sobre el pecho.

### Cómo sigue cada timeline (cortes duros, en s)

- **R1:** 7,0 cara + tarjeta del producto arriba (0-22 %) · 11,4 cara · 13,2-19,6 grabación de pantalla (dock, selector de modelo, slider de esfuerzo, prompt) · 19,6 cara con el CTA intermedio · 20,9-23,8 prompt + URL · 23,8 cara · 25,7-30,4 salida de Claude (scroll) · 30,4 cara · 32,6-47,4 el film generado a pantalla completa (15 s), **cortado por una reacción de 0,8 s («Nice.», 37,08-37,8)** · 47,6 cara con el CTA final.
- **R2:** 4,24 cara · 7,32 tarjeta de flujo · 9,0-12,96 chips Claude Code / Codex / Grok que aparecen con un clic de cursor cada uno · 12,96 cara · 17,12 app grabada con push-in lento (17,0 a 19,5) · 21,68 **cámara convertida en tarjeta vertical con sombra sobre la UI desenfocada** · 24,4 cara · 28,88 pantallas · 32,08 cara · 33,12 «Step 1/2/3» tecleados sobre blanco · 42,64 tarjeta final de YouTube con la cara en PIP.
- **R3:** 7,16-12,2 hilo de tweets oscuro · 12,2 cara (~14-16,5 fotos del lanzamiento como tarjetas en el tercio de abajo; a 13,6 y 17,0 no están) · 20-21,8 GIF dentro de una tarjeta · 21,84 ilustración plana del agente · 24,56 titular sobre pantalla oscura · 26,5 lista de la app oscura · 28,04 mascotas · 29,68 cara hasta el final.
- **R4:** 8,0 diálogo «Hold to delete» bajo el titular «are crazy!» · 8,96 casete con los carretes girando · ~10,5-11,0 el diálogo otra vez con el clic sostenido · ~12,0 «Project deleted», justo en la palabra «hold» · 13,0-17,5 recibo que se imprime hasta «Order complete» · 17,5 GIF del botón «easy» · 20,0 dropzone y código · 22,0 «Copy» con clic · 23,48 clip deportivo + «It's too easy!» (transcript 24,16-25,12) · 25,12 b-roll de espaldas frente al monitor + CTA.

### El sistema de edición

- **Dos registros de texto, nunca a la vez.**
  - (a) **Píldora de UNA palabra** que cambia con cada palabra (~0,27 s); a veces dos cortas o un nombre («and a», R4 11,0 s; «Claude Code,», R2 11,0 s): sans bold blanca sobre rectángulo gris translúcido redondeado. Fija a 53-55 % del alto (R2 4,4 s, R3 13,6 s, R4 5,6 s) y 63 % en R1 (11,6 s). **Queda en el mismo lugar sobre cualquier layout**, también sobre la UI a pantalla completa.
  - (b) **Titular cinético** en los momentos de tesis, 2-4 por reel: la frase entra palabra por palabra, cada una desde gris o desenfocada hasta nítida en ~0,25 s; el arranque en sans bold y la palabra clave en **serif itálica a 1,6-2x** en una segunda línea («by tomorrow.», «app idea», «premium.», «details», «everything.», «scary idea», «the same brand.», «trained for.»). Blanco sobre la cara, casi negro (~#111) sobre el lienzo. Mientras está el titular, la píldora se apaga.
- **Lienzo claro con profundidad:** fondo #F6F6F6-#FBFBFB; la UI real va en tarjetas flotantes con radio grande y sombra amplia y suave; entran con fundido + desenfoque, no con slide ni rebote. La costura entre panel y cámara es un degradado (blanco en R4 0-0,8 s, oscuro en R3 0-2,6 s), nunca una línea. En R3 5,2 s y R4 1,0-14 s la cabeza **sale por encima del borde** de la tarjeta de cámara: recorte de persona.
- **Cursor sincronizado con el verbo:** el clic sostenido completa el borrado en «hold» (R4 ~10,5-12,0 s), «copy» con el clic en Copy (R4 22 s), «Start Creating» (R1 46,6 s); los chips de R2 aparecen con un clic cada uno (11,0-12,5 s).
- **Zoom:** push-in lento sobre la UI (R2 17-19,5 s) y push-in animado sobre la cara en la apertura de R2 (0-2,1 s, ~1,3x, sin corte). La escala de la cara **sí cambia entre planos**: ojos entre ~29 y ~40 % del alto medidos con grilla en 12 cuadros (R1 11,6 s 31 %, R1 48 s 38 %, R2 2,1 s 29 %, R2 4,4 s 39 %, R3 13,6 s 40 %, R4 5,6 s 39 %). No se vieron golpes de zoom instantáneos en la cara.
- **B-roll y memes:** pegatinas literales de la palabra. R4: cocina con «Kitchen… the name fits», botón rojo con «easy», clip deportivo con «too easy». R3: minions con «minions». Duran 0,8-2 s, en tarjeta sobre el pecho o a pantalla completa con titular. Material de terceros con derechos.
- **Transiciones:** corte seco entre layouts; el movimiento vive dentro de las capas (tecleo, desenfoque, scroll).
- **Sonido:** pausas prácticamente borradas (ninguna de ≥0,2 s en 3 de 4 reels), voz tranquila. Inferencia: probable cama musical bajo la voz (mínimo por segundo en -22/-45 dBFS, casi nunca bajo -45; el espectrograma de R4 muestra energía continua en 20-60 Hz entre palabras, que no sale de la voz). SFX no verificables.
- **Cierre:** R1 y R4 cierran con «Comment» en sans blanca y «"PALABRA"» en serif condensada en mayúsculas sobre un bloque translúcido naranja ladrillo (~#914A2E sobre fondo oscuro), seguido de «to get it.» / «to the full library.» en serif itálica. R1 pone el CTA **dos veces** (18,4-20,8 s cuando aparece el prompt, y 47,4 s). R2 cierra con la tarjeta de YouTube y la cara en PIP. R3 termina en la frase de tesis, sin CTA.

## La vibe (lo que le gustó a Sergio Urcullo)

- **Set (observado):** pared gris azulada fría (~#606569-#696D71, en sombra), cuadros de líneas negras en marcos negros, lámpara colgante de vidrio, sillón detrás, moldura de madera arriba y borde de mesa de madera abajo (~#351E1B). **Luz** clave frontal suave, poco contraste, sin contraluz visible (inferencia: luz de día fría). R1 es el mismo set (mismos cuadros y lámpara) con la pared más oscura (~#34373E), más cálida y en penumbra.
- **Vestuario:** la misma remera lisa azul marino (~#242341) en los 4 reels: uniforme.
- **Micrófono:** de podcast, negro, en pie de mesa, centrado y tapando el pecho, siempre en cuadro.
- **Encuadre:** plano medio corto, simétrico, cámara a la altura de los ojos, ojos entre ~29 y ~40 % del alto según el plano (grilla, 12 cuadros), fondo apenas suave.
- **Paleta:** lienzo blanco + texto casi negro + azul marino + gris; el acento lo pone el producto que se muestra.
- **Tono:** primera persona y calma, vocabulario de gusto («premium», «taste», «doesn't look AI-made»).
- **Perfil (declarado):** 298 mil seguidores; bio «AI Designer & Founder / Follow to design better with AI». La grilla repite el mismo sistema de portada: cara + 2-4 palabras con la clave en serif itálica, más portadas sin cara de UI sobre blanco.

## Contra `edicion-referentes`: qué ya está

Promesa + prueba en el cuadro 0 = regla 1 · pausas apretadas = regla 2 (él va más allá: ≤0,2 s contra nuestro 0,5 s) · capas en vez de cortes = regla 3 · pegatina sincronizada con la palabra = regla 11 (todavía candidata) · CTA de palabra tecleada = Erik, adaptado como «Buscá PALABRA en Avisos» · palabra serif grande sobre la cara = variante G1 de Santiago · clic → estado confirmado = ficha del 4-oct de Lucía · pantalla partida con material oficial = Santiago · un largo cortado en verticales = regla 13.

## Qué es nuevo (candidato, para la skill)

1. **Doble registro tipográfico:** píldora de 1 palabra + titular cinético mixto sans/serif itálica que se arma con desenfoque y solo aparece en la tesis (2-4 por pieza).
2. **Una sola altura de subtítulo, el mentón (~54 %), sobre todos los layouts**, también sobre la UI a pantalla completa. Es otra posición para la regla 5.
3. **Costura en degradado**, sin línea.
4. **Cámara como tarjeta flotante** con sombra sobre la UI desenfocada, y el **layout de reacción** (tu cara chica arriba, tu resultado grande abajo) para abrir con un resultado propio.
5. **Una revelación larga** (15 s de resultado) cortada por **una reacción de cara de 0,8 s y 1 palabra**.
6. **Tráiler vertical de un YouTube:** escenario → secreto sin revelar → pasos 1/2/3 tecleados → tarjeta «video completo» con la cara en PIP. Alternativa a la regla 13.
7. **CTA repetido** cuando aparece el recurso y otra vez al final. **Choca** con «CTA una sola acción»: es la misma acción dos veces. **Propuesta, no adoptada** sin el OK de Sergio Urcullo.
8. **Cierre de opinión sin CTA**, terminando en la tesis en serif.
9. **Showcase de producto en 28 s a base de microinteracciones reales**, el formato que más rindió de los 4.

**Contradicción a verificar:** que haya cama musical (inferencia) choca con la regla 4 («con voz, sin cama»). No cambia la regla; se confirma escuchando o separando fuentes.

## Cómo se traduce a la marca de Sergio Urcullo (propuesta, sin copiar identidad)

- **Píldora:** casi negra translúcida (#0A0F0D al ~60 %, aproximado) con una palabra blanca a la altura del mentón; si se usa este molde, es la única posición de subtítulo de la pieza.
- **Titular de tesis:** sans blanca + palabra clave en serif itálica (la familia la decide `diseno-contenido-onia`). El verde #10C26B no va en el subtítulo: va en **un solo objeto por cuadro** (el bloque del CTA o la pieza clave de UI), igual que el `fotobn`.
- **Lienzo:** blanco #FFFFFF (tema `blanco`) con UI real de Onia o de Claude en tarjetas con sombra suave, texto negro y costura en degradado blanco.
- **Memes y clips de terceros:** se reemplazan por una imagen `fotobn` (foto B/N + 1 objeto verde) sincronizada con la palabra de la analogía (ejemplo: «fácil» con un botón verde en una foto B/N). Es la prueba única de la regla 11. Sin material con derechos ajenos.
- **CTA:** «Buscá» en sans + «PALABRA» en serif en mayúsculas sobre un bloque verde translúcido + «en Avisos» en serif itálica. Una sola acción, con recurso existente, en voseo.
- **Abrir con un resultado propio en layout de reacción** (Sergio Urcullo chico arriba, lo que hizo con Claude grande abajo), con voz desde el cuadro 0.
- **Uniforme:** la misma remera lisa en toda la serie (lo que se copia es el mecanismo de reconocimiento, no el color de él). Micrófono de solapa (regla vigente, no el de podcast), trípode, set propio.
- **Duración objetivo:** 28-50 s; el showcase de un recurso, más cerca de 28 s.

## No se copia

Su cara, el set (cuadros, pared, micrófono en cuadro), la remera azul marino, sus frases («premium», «doesn't look AI-made»), los productos ajenos, los memes y clips deportivos o de cine, la música, el «Comment → DM» (en Onia no está probado) ni el inglés.

## Hojas de contacto y material de medición

- **Copia en el repo:** `hermes-content/references/video-intake/img/2026-10-10-adrien-ninet-hoja.png` (R4 `DeO7DugISSR`, segundos 0-4,75 a 4 fps, con el segundo impreso; es la hoja que muestra la apertura del reel que más rindió). Copia también en el tablero de la madre: `C:/Users/PC/.claude/madre-capturas/` («Adrien Ninet: hoja de contacto de un reel»).
- **Originales de los 4 reels (temporales, no están en Git):** `C:/Users/PC/AppData/Local/Temp/claude/C--dev-proyectos-onia-hermes--claude-worktrees-sesion-madre-v2-revision-696bb0/d5e87d2e-f669-455c-9881-aa1532fef429/scratchpad/adrien/reels/<ID>/hoja.png` (con `reel.mp4`, `transcript.txt`, `caption.txt`) y las capturas `perfil-1.png` y `perfil-2.png` en esa misma carpeta `adrien/`.
- **Hojas propias de medición** (misma base, subcarpeta `medir/`): `g5_<ID>.png` (0-5 s a 4 fps), `f2_<ID>_NN.png` (reel completo a 2 fps), `fr_<ID>_<s>.png` (cuadros sueltos), `clave.png`, `spec_r2.png` y `spec_r4.png` (espectrogramas 0-12 s), `audio.py`, `floor.py`, `samp.py`.
- Son temporales: esta ficha conserva la lectura, no una copia de los videos.

## Incorporación

- 2026-10-10: sección «Receta Adrien (@adrien.ninet), medida el 10-oct-2026» agregada a `.claude/skills/edicion-referentes/SKILL.md`, como **candidata** (4 reels de una cuenta). No se tocaron las otras recetas ni las 14 reglas.
- 2026-10-10, revisión contra cuadros (Opus, 6 cuadros al azar + hojas con grilla y recuento de cortes con ffmpeg): cortes de R1-R4 coinciden; se corrigieron ojos 30-33 % (eran 29-40 % y la cara se reescala), tarjetas de R1 (0-22 %/24-100 %, clip de un tercero), tiempos de R4 («premium» ~1,5 s, impresora 0,2 s, «hold» ~12 s), píldora de 2 palabras, recorte de persona en la costura y lienzo #FAFAFA → #FFFFFF (token de marca).
- Propuesta no adoptada: CTA dos veces (choca con CTA de una sola acción; decide Sergio Urcullo). Contradicción pendiente: cama musical (inferencia) contra regla 4.
- Pendiente: la píldora negra y la serif itálica de tesis son decisión de `diseno-contenido-onia`; no se editó esa skill.

## Prueba de uso por sesión

Estado: incorporado (receta en la skill; sin pieza aplicada)
Sesión + fecha: sesión madre v2 revisión, 2026-10-10
Tarea de cola: pendiente de asignar, la próxima pieza de recurso o showcase de la cola
Regla usada: Edición y montaje + Estilo visual, «Receta Adrien» en `edicion-referentes`
Artefacto: ninguno todavía (no se produce una pieza solo para marcar la casilla)
Verificación: cuando exista, una sola versión del render, con hojas a 2 fps medidas contra esta ficha (píldora a ~54 %, titular solo en tesis, costura en degradado, cortes y capas por 10 s)
Pendiente: aplicar en la próxima pieza de recurso o showcase y registrar aquí el resultado.
