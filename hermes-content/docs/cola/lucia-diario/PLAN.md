# Plan de Lucía — v5 (8-oct-2026): influencer que graba y aprende Higgsfield

> **Este archivo manda** sobre qué publica Lucía y por qué. Reemplaza la v4 (queda en git).
> **Premisa de Sergio Urcullo, 8-oct:** *«Lucía no es necesario que muestres el producto, recordá que sos una influencer.
> Grabar y aprender a usar Higgsfield: esa es tu tarea.»*
> - **Evidencia de mercado:** `research/competencia/LUCIA_COMPETENCIA_20261005.md`.
> - **Personaje y límites:** `references/modelos/lucia/LUCIA.md` §0.
> - **Método, costos y trampas de Higgsfield:** skill `lucia`.
> - **Guiones:** `guiones/`.

## 0. En una línea

Lucía es una **influencer IA de Santa Cruz que declara que es IA**. Su tarea es **grabar videos estructurados y aprender a
usar Higgsfield haciéndolos**. No tiene que mostrar ni vender el producto. Cada prueba deja un video y deja un aprendizaje
escrito en la skill `lucia`, con el caso, el costo y la fecha.

## 1. Qué cambia respecto de la v4

| Antes (v4) | Ahora (v5) |
|---|---|
| Prueba para conseguir clínicas: se medían conversaciones | Influencer que enseña; se mide si el video sirvió (guardados, envíos) y qué se aprendió |
| Toda pieza de venta llevaba la pantalla real de Onia | **No hace falta mostrar el producto.** La cuenta demo y las capturas ya no bloquean nada |
| Puerta de demo (WhatsApp o cal.com) y trato de usted | La puerta queda **pausada**. El trato es **voseo cruceño**, que es su canon |
| 5 rubros → solo dental | No hay rubro: no habla de un negocio |

- **Si una pieza nombra o muestra una función de Onia**, vuelve la regla de `CLAUDE.md` § «Qué se publica sin preguntar»:
  tabla «se promete / funciona» y OK de Sergio Urcullo. El guion de producto quedó en pausa:
  `guiones/G-producto-1-recordatorio-de-cita.md`.
- **Lo que enseñó el mercado y sigue valiendo** (5-oct): nadie declara la IA en la pieza, y eso es lo que distingue a
  Lucía; el orgánico rinde poco, así que ganan la constancia y el contenido que se guarda; Aria Cruz declara la IA hasta
  en el nombre.

## 2. Reglas de toda pieza

- **⛔ Un video de Lucía es un video estructurado** (Sergio Urcullo, 8-oct; el chiste de 10 s y L02 se rechazaron):
  - **gancho** en los primeros 3 s;
  - **desarrollo con valor**: pasos, un caso o una demostración;
  - **cierre** con un solo CTA;
  - **30 a 60 s**, y deja algo aprendido;
  - el **guion se escribe y se valida ANTES de editar**. Moldes: `FORMULAS-REFERENTES.md` y `edicion-referentes`.
- **IA declarada, siempre:** nombre «Lucía Antelo · IA de Onia», bio, etiqueta de perfil IA, etiqueta «Información de IA» en
  cada pieza por API, rótulo «Lucía Antelo · personaje IA de Onia» desde el cuadro 0 y el pie.
- **Nunca profesional de salud.** El ambo es vestuario. No consejo clínico ni legal, no testimonio, no clienta, no
  «agenda llena», no resultados, no dice que estuvo en un lugar o evento real. No toca política.
- **Sin marcas de terceros** (modelos, plataformas, competidores) en pantalla ni en el pie, salvo el OK de Sergio Urcullo.
  Se dice «imagen», «video», «Motor 1».
- **Sin voz** hasta resolver D4. Ninguna voz de ElevenLabs se publica sin licencia comercial confirmada. Sin música sin
  licencia: la pone Sergio Urcullo.
- **Nombre con apellido** siempre.
- **QA completo antes de publicar:** receta de `editor-videos` § «Reels de Lucía» §12 (cuadro 0, cada entrada, último
  cuadro, texto debajo del mentón + 40 y sobre y=1490) y `grep` contra la lista de frases prohibidas.
- **Publicación** (`CLAUDE.md`, 8-oct): una pieza que pasa el QA, se miró renderizada completa y no toca el producto ni
  nombra a terceros, se publica sin el OK pieza por pieza; después se le avisa a Sergio Urcullo con el enlace.
- **Regla de oro del video** (`CLAUDE.md` § Video, sin excepción decidida para Lucía): la tabla de cortes y el preview 360p
  se muestran ANTES del render final. La tabla de tiempos del guion es la tabla de cortes. Orden: guion validado por la
  madre → preview 360p a la madre → render final → QA → publicar. Si Sergio Urcullo quiere eximir a Lucía de ver el preview,
  lo dice él.
- **Toda generación paga:** costo cotizado con `get_cost` y OK de Sergio Urcullo al lote.

## 3. Qué se aprende de Higgsfield (currículo)

Cada fila es una prueba chica, con su video. Los costos son cotizaciones en vivo del 8-oct, sin gastar.

| # | Prueba | Costo | Qué se aprende | Video que sale |
|---|---|---:|---|---|
| — | Cómo se hace un clip: foto, orden, revisión (ya pagado) | 0 | El método y el costo real de una pieza | **G1** |
| — | Errores que se escapan: letrero inventado, letra que no dice nada, mano que tapa a la otra (ya pagado) | 0 | Qué mirar en cada cuadro | **G3** |
| **L1** ✅ hecho el 8-oct: misma foto y orden en 6 clips (Kling std ya pagado, Kling pro 9, Seedance mini 6, mini + 3 referencias 6, Kling Omni 5 referencias 6, Cinema Studio 3.0 de 4 s 20) y 6 motores de imagen | **86,5 gastados** (clips 47, fotos 11,75, labios 27,75) | Cuánto sostiene cada vía la cara: `start_image` la deja decaer, las referencias la sostienen pero el motor inventa la escena; pagar más no la arregla. Detalle: skill `lucia` §0-quater | **G2** (guion listo) |
| L2 | Voz y labios con audio propio. **Labios medidos el 8-oct:** Seedance mini 6 cr (cae bajo el gate, sin audio en el mp4) y `sync_so` 21,75 cr sobre un clip hecho (conserva la cara y trae el audio). Falta la voz | ~10-20 | Si hay una voz que suene cruceña. Primero Sergio Urcullo escucha las muestras (`research/competencia/lucia-20261005/voces/`) | por definir |
| L3 | Copiar los gestos de un video guía (Motion Control, 17 por 10 s) | 17 | Control de «mira a cámara y gesticula». Requiere que Sergio Urcullo grabe 10 s | por definir |
| — | Fotos de lifestyle con la cara fija (Seedream + ancla, 1 por foto) | 0-5 | Consistencia en escenas nuevas | carruseles |

- **Créditos:** al 8-oct hay 541,26 (medido en vivo) y lo que sobra se **borra en cada renovación** (el 1-oct se borraron 387,57). Octubre va
  **139 de 150** (52,5 + 86,5 del lote de aprendizaje del 8-oct); saldo real **438,17** medido el 10-oct (454,76 era una resta; el libro de movimientos muestra 16,59 cr más gastados el 8-oct por otra mano).
- Lo que se aprende se escribe en la skill `lucia`, en el mismo commit que el video.

## 4. Formatos

| Formato | Molde (`FORMULAS-REFERENTES.md`) | Créditos |
|---|---|---:|
| **Receta en pasos con el paso crítico marcado** (G1) | F7 | 0 |
| **Misma tarea, varios niveles: «así no / así sí»** (G2) | F4 | según la prueba |
| **Caso real → error → por qué → corrección → regla** (G3) | F3 | 0 |
| **Carrusel paso a paso** con fotos reales de las pruebas | C1 | 0-5 |
| **Historias:** recortes del mismo lote | — | 0 |

~~Reel de personaje de 6-10 s~~: **rechazado el 8-oct.**

## 4-bis. Estructura semanal fija (11-oct)

> **LISTA PARA MOSTRAR: estructura Lucía.** Dirección de Sergio Urcullo, 11-oct: *«arma su estructura de contenido y enseña cosas de IA»*, sobre
> *«Lucía sigue aprendiendo Higgsfield para venderlo y ser una modelo AI independiente»*. **Una prueba por semana saca tres piezas:** lo que cuesta
> se paga una vez y lo demás sale de la misma prueba a 0 créditos. Hasta 3 piezas por semana, **19:00 La Paz (23:00 UTC)**.

| Día | Formato | Duración | Qué enseña | Gancho (0 a 3 s) | Cierre |
|---|---|---|---|---|---|
| **Lun** | **Reel «La prueba»**, con voz | 20-30 s | La prueba de la semana: la orden, **el número medido** y **el costo real en créditos** | La pregunta de la prueba en 3-7 palabras, rótulo de IA desde el cuadro 0 y el resultado en pantalla antes de los 3 s | «Seguime: cada semana, una prueba.» en los últimos 2,4-5,5 s |
| **Mié** | **Carrusel «Para guardar»** | 5 láminas, 1080×1350 | La misma prueba como tabla o receta: la orden exacta, los créditos y el parecido | Lámina 1: la pregunta y la foto del resultado | Lámina 5 y pie: «Guardalo para cuando armes el tuyo. Cada semana hago una prueba. Seguime.» |
| **Vie** | **Reel corto «El error de la semana»**, con voz | 15-20 s | El error que se atrapó en esa prueba: qué era, cómo se vio y qué se hizo | El error ya en el cuadro 0 («Casi publico esto.») | «Seguime: cada semana, una prueba.» |

- **Qué se enseña, en rotación de 4 semanas:** A) **Imagen** (motor, prompt, fondo) · B) **Video** (clip, referencias, escena) · C) **Medir** (cara, manos, luz,
  movimiento) · D) **Otras herramientas de IA** (cuánto cuesta un segundo de voz, transcripción, render). Siempre el número medido, el costo en créditos y un límite dicho.
- **Historia: extra, no cuenta entre las 3.** La lámina 1 del carrusel en 1080×1920 el mismo miércoles, solo foto (la API no admite stickers). Se suma cuando haya seguidores a quienes
  avisarles: una historia solo la ven los seguidores, y hoy la cuenta no tiene ninguno. El reel es el único formato que llega a quien no la sigue.
- **Reglas de toda pieza (no cambian):** rótulo «Lucía Antelo · personaje IA de Onia» desde el cuadro 0, a 40 px · etiqueta de IA por API · el pie abre con «personaje hecho con IA» · ni
  profesional de salud, ni producto de Onia, ni cifra inventada, ni cara o voz de Sergio Urcullo · motores como «Motor 1 a 6» e «Imagen A a F» hasta resolver D-N1 (abajo).
- **Regla de edición con voz (11-oct):** voz Marcela (ElevenLabs) · **pausa máxima 0,25 s entre frases**, sin acelerar la voz (se aprietan las pausas) · 3,2-4,1 palabras por segundo · −14 LUFS ·
  sin cama de música · título de 3-7 palabras con la promesa en el cuadro 0 · CTA en los últimos 2,4-5,5 s. Es la receta Erik de `edicion-referentes`; **G1 v2 (20 s) es el modelo**.
- **Cupo de voz:** G1 v2 usó **320 caracteres** para unos 19 s hablados, o sea **≈ 17 caracteres por segundo** (corregido por la madre el 11-oct; antes decía 381, que es lo que *queda* hasta el 13-oct 01:17 UTC). Un reel de 25 s ≈ 425;
  uno corto de 18 s ≈ 305. Una semana ≈ 730 caracteres, y con retomas (×1,3) ≈ 950. **Hasta el 13-oct solo quedan 381**; el cupo renovado hay que confirmarlo (lo sabe la madre).
- **Decisión abierta D-N1 (Sergio Urcullo):** ¿se nombran las herramientas como uso propio, no como recomendación pagada, o siguen «Motor 1 a 6»? La estructura funciona con las dos. Nombrarlas hace que
  quien mira pueda repetir la prueba; no nombrarlas la vuelve menos útil para «enseñar cosas de IA». Hasta que decida, no se nombran.
- **Voz Marcela:** tiene acento colombiano (D4). Si Sergio Urcullo lo aprobó sabiendo eso, sigue; es el riesgo de que una cruceña suene colombiana.

## 5. Las próximas 6 piezas, y las que siguen (todas las listas entran primero)

La semana 1 (S1) empieza el día en que salga G1; hoy no hay fecha porque falta el token (abajo).

| # | Semana · día | Pieza | Formato | Qué enseña y con qué número | Gancho (propuesta) | Créditos | Voz | Qué falta |
|---|---|---|---|---|---|---:|---:|---|
| 1 | S1 · Lun | **G1 v2** «Este video no fue grabado» | Reel 20 s | Cómo se hace un video: orden, foto y clip, **8,5 cr** | «Este video no fue grabado.» | 0 | 320 (hecha) | La armó la madre; falta su SHA. Sergio Urcullo dijo «publicá G1». **Bloqueada por el token** |
| 2 | S1 · Mié | **L01** «Hola, soy Lucía. No existo.» | Carrusel, se fija | Quién es y qué hace: una prueba por semana | — | 0 | — | Nada: lista |
| 3 | S1 · Vie | **G3 v2** «Tres errores que atrapé» | Reel ≤ 30 s | Tres errores reales: letrero inventado, letra que no dice nada, mano que tapa a la otra | «Casi publico esto.» | 0 | ≤ 450 | Re-corte mudo en curso (11-oct); falta voz, revisión y SHA |
| 4 | S2 · Lun | **G2 v2** «La misma foto, seis clips» | Reel ≤ 30 s | 6 motores de video: **6 a 20 cr**, parecido final **0,64 a 0,82** | «¿Quién pierde la cara?» | 0 | ≤ 450 | Lo mismo que G3 |
| 5 | S2 · Mié | **C1** «Un video sin grabar, en 3 pasos» | Carrusel | G1 para guardar, con la orden real | — | 0 | — | Nada: lista |
| 6 | S2 · Vie | **G5 v2** «¿Cómo sé que sigue siendo ella?» | Reel ≤ 30 s | El control de cara: piso 0,70 (lo elegí yo), ruido ±0,03, bajo 200 px se mira a ojo | «¿Cómo sé que sigue siendo ella?» | 0 | ≤ 450 | Lo mismo que G3 |
| 7 | S3 · Lun | **G4 v2** «Seis motores de imagen, una cara» | Reel ≤ 30 s | 6 motores de imagen: **0,5 a 3 cr**, parecido **0,66 a 0,81**; pagar más no mejoró | «¿Cuál conserva su cara?» | 0 | ≤ 450 | Lo mismo que G3 |
| 8 | S3 · Mié | **C2** «Seis motores de imagen» | Carrusel | G4 para guardar | — | 0 | — | Nada: lista |
| 9 | S3 · Vie | **NUEVA** «La luz cambia cuando la cara se sostiene» | Reel corto 18 s | Medido el 11-oct con los 6 clips ya pagados: el clip atado a la foto mantiene la luz (Motor 1: luma −1,0) y pierde la cara (parecido 0,79 a 0,72); el que mejor la sostiene con referencias (Motor 4: 0,71 a 0,80) oscurece la imagen (luma −34) y reencuadra | «La cara o la escena.» | 0 | ≈ 305 | Guion, voz, montaje. Datos: `v4/prueba-motores-20261008/medicion-luz-movimiento-20261011.txt` |

**Qué falta producir, en orden:**

1. **El token de Instagram de Lucía (`ig-lucia.env`).** Sin él no sale nada. La madre le pidió a Sergio Urcullo elegir A (bajar `postgres:17` en el VPS y sacar el token viejo de Postiz) o B (token nuevo
   desde Meta). **Recomiendo B:** A corre contra el vencimiento (estimado entre el 13 y el 18-oct, sin medir; si ya venció, A falla y hay que hacer B igual), pide instalar una imagen en el VPS
   y obliga a tocar la base de Postiz, que ya publicó posts viejos sin OK una vez. B no depende de nada viejo y da 60 días. Pasos en la cola.
2. **Cuatro versiones con voz: G3, G2, G5 y G4** (las que hoy son mudas de 56 a 59 s). Por pieza: guion de voz de ≤ 30 s, voz, retemporizar `plan.json` a la voz con pausa ≤ 0,25 s, render (3 a 4 min),
   preview 360p, revisión independiente y SHA nuevo en `videos/lucia-entrega/README.md`. **0 créditos.** En total ≤ 1.800 caracteres de voz: **no caben en los 381 que quedan antes del 13-oct.**
3. **La pieza 9** (luz): guion, voz y montaje. Los datos ya están medidos (honesto: son promedios del cuadro entero, mezclan luz con lo que entra al plano; miden «cuánto cambia la imagen»).
4. **De la semana 4 en adelante, una prueba nueva por semana** (tema B, C y D de la rotación): **P1** fondo en positivo (3 cr, lote chico) · **P2** referencias con cámara fija (6 cr, video) · **P3** MiniMax H3 (12 cr, video) ·
   **L2** voz y labios · **L3** Motion Control (17 cr; Sergio Urcullo graba 10 s). Los de video piden su sí escrito en esta sesión; **P3 no cabe en el tope de octubre** (quedan 11 de 150).
5. **D-N1** (nombrar las herramientas) y el **cupo de voz renovado**.

- **Qué se mide por pieza:** guardados y envíos (señal de que enseñó algo), seguidores nuevos y que la cuenta siga «apta
  para recomendaciones». No hay umbral de conversaciones.
- **Día 14:** Sergio Urcullo decide con los números delante. **No se pausa** (Sergio Urcullo, 10-oct): se sigue, se extiende
  2 semanas una sola vez o se ajusta formato y ritmo. **Se para** cualquier día si la cuenta queda «no recomendable»
  o si domina el comentario «esto reemplaza gente». (`LUCIA_COMO_SE_USA.md` §1 propone medir demos con `src=lucia-<pieza>`, pero `onia.com.bo/llamada` da 404 al 11-oct: falta definir la puerta.)

## 6. Cómo se publica

Circuito completo en la skill `lucia` § 6.
- **Instagram:** `ig-reel.mjs` / `ig-carrusel.mjs --cuenta lucia`, que ponen la etiqueta IA solos. Corre en el VPS: esta
  nube no tiene ssh, así que lo corre la madre.
- **Antes de la primera pieza:**
  1. el token de Lucía (estaba en Postiz el 4-sep; vencía entre el 13 y el 18-oct; no se midió desde entonces);
  2. los dos publicadores nuevos copiados **juntos** a `/root/bin`, con `--selftest` en los dos; se le avisa a Marca
     personal, porque sus carruseles usan el mismo archivo;
  3. en el ensayo, el reel dice FINISHED y el carrusel «listo en Instagram»; la etiqueta se confirma después de publicar
     (`is_ai_generated` en `publicado.jsonl`) y mirando la pieza.
- **TikTok:** por Buffer, con una cuenta gratis aparte y `isAiGenerated`. Falta crear la cuenta.
- **Perfil:** nombre `Lucía Antelo · IA de Onia`. Bio: `Personaje IA creado por @oniahq` / `Pruebas con IA, cada semana.`
  Sin link de venta. La etiqueta de perfil IA se informó activa el 31-ago y nadie la miró.

## 7. Decisiones de Sergio Urcullo

| # | Decisión | Recomendación |
|---|---|---|
| ~~L1~~ | Ya ejecutado el 8-oct (86,5 cr con los labios, dentro del tope de 97 que se fijó la sesión): Sergio Urcullo había escrito *«tenés derecho a usar todo lo que querrás»* sin dar una cifra | **Confirmar o corregir el tope.** Quedan 10,5 del tope y 11 del mes (150) |
| D4 | La voz | Sin voz por ahora. L2 empieza cuando escuches las muestras |
| D5 | El canon de 10 datos (`LUCIA.md` §0-canon) | Entra con tu OK al primer video |

**Lo que lo destraba** (la madre o vos): token de Instagram antes del 13-oct, nombre y bio desde el celular de Lucía,
publicadores en el VPS, y la cuenta de TikTok en Buffer cuando se quiera.
