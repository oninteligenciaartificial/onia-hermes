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
  **139 de 150** (52,5 + 86,5 del lote de aprendizaje del 8-oct); saldo 454,76.
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

## 5. Primeras 2 semanas (hasta 3 piezas por semana)

| Pieza | Costo | Estado |
|---|---:|---|
| **G1** «Este video no fue grabado: así se hace, en 3 pasos» (56 s) | 0 | guion para validar por la madre; todo el material ya está pagado |
| **G3** «Tres errores de la IA que atrapé antes de publicar» (58 s) | 0 | **montado** (`videos/lucia-g3/`); la madre mira el preview 360p; evidencia real en `v4/kit/` |
| **G2** «La misma foto, seis clips: ¿quién pierde la cara?» (58 s) | 0 más | **montado** (`videos/lucia-g2/`); la madre mira el preview 360p; los 6 clips ya estaban pagados y medidos |
| **L01** «Hola, soy Lucía. No existo.» (carrusel de presentación, fijado) | 0 | **reescrito a la v5 el 9-oct** (una prueba por semana, lo que cuesta, lo que no hace) y renderizado sin franja blanca. Va fijado **después** de G1 |
| **G4** «Seis motores de imagen, una cara: ¿cuál la conserva?» (59,75 s) | 0 | **montado** (`videos/lucia-g4/`, tres pasadas con revisor independiente el 9-oct); falta que la madre valide el guion y mire el preview |
| **C1** «Un video sin grabar, en 3 pasos» y **C2** «Seis motores de imagen» (carruseles) | 0 | **hechos y mirados** (`hermes-content/carousels/out/lucia-c1-…`, `lucia-c2-…`); salen después de G1 y de G4 |
| **G5** «Cómo mido si una cara es la de Lucía» (~56 s) | 0 | **montado** (`videos/lucia-g5/`, tres pasadas con revisor independiente el 9-oct); falta que la madre valide el guion y mire el preview |
| ~~L02~~ y ~~el chiste de 10 s~~ | — | retirados el 8-oct; sus clips son planos de apoyo |

- **Qué se mide por pieza:** guardados y envíos (señal de que enseñó algo), seguidores nuevos y que la cuenta siga «apta
  para recomendaciones». No hay umbral de conversaciones.
- **Día 14:** Sergio Urcullo decide con los números delante. **Se para** cualquier día si la cuenta queda «no recomendable»
  o si domina el comentario «esto reemplaza gente».

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
