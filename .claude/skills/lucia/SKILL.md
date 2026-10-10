---
name: lucia
description: "Invocar para CUALQUIER trabajo del carril Lucía (Lucía Antelo, la influencer IA de Onia): generar fotos o clips en Higgsfield, editar sus reels, armar el paquete semanal, publicar en Instagram o TikTok, medir la prueba o tocar su plan. Su tarea (Sergio Urcullo, 8-oct) es grabar videos estructurados y aprender Higgsfield; no tiene que mostrar el producto. Dice lo ya medido —costos de Higgsfield, recetas por formato, currículo de pruebas, voz, circuito de publicación— para no volver a investigarlo, con trampas e intentos fallidos fechados."
---

# Lucía — lo que ya se sabe

> Nace el 5-oct-2026: el carril no tenía skill y sus reglas estaban repartidas en `editor-videos`, `LUCIA.md` y el
> handoff. Sergio Urcullo: *«tienen que aprender a hacer las cosas, que quede como autoconocimiento»*. **Antes de
> investigar, leé esto.** Al cerrar una tarea, sumá lo aprendido acá (con fecha y caso) en el mismo commit.

## 0. Qué es de este carril y qué no

- **Es de Lucía:**
  - su identidad: `hermes-content/references/modelos/lucia/**`, con `LUCIA.md` §0 como biblia del personaje;
  - el plan y la cola: `hermes-content/docs/cola/lucia-diario/`, donde `PLAN.md` manda;
  - los videos `videos/lucia-*`;
  - el contenido orgánico de `@lucia.antelo.oficial`;
  - la política de Higgsfield: `hermes-content/docs/HIGGSFIELD_VIDEO_SYSTEM.md`.
- **No es de Lucía:**
  - la campaña de Meta y sus piezas: Ventas y pauta. Lucía entra solo con el brief de ellos;
  - la web y la cuenta demo: Plataforma;
  - el bot de WhatsApp: el carril chatbot o Sergio Urcullo;
  - el VPS: la madre o infra.
- **Reglas que no se discuten** (`LUCIA.md` §0):
  - declara siempre que es IA;
  - nunca se presenta como profesional de salud: el ambo es vestuario;
  - no promete resultados;
  - si muestra una pantalla de Onia, es real;
  - no hay generación paga sin `get_cost` y el OK de Sergio Urcullo.

## 0-ter. La premisa vigente (Sergio Urcullo, 8-oct) — leela antes que el resto

> *«Lucía, no es necesario que muestres el producto, recordá que sos una influencer. Grabar y aprender a usar Higgsfield:
> esa es tu tarea.»*

- **Lucía es una influencer IA de Santa Cruz que declara que es IA.** Su tarea: grabar videos estructurados y aprender a
  usar Higgsfield haciéndolos. **No tiene que mostrar ni vender el producto.** `PLAN.md` v5 lo desarrolla.
- **Qué se pausó (no se borró):** la puerta de demo, la cuenta demo, las capturas de Pendientes y el trato de usted. El
  guion de producto quedó en `guiones/G-producto-1-recordatorio-de-cita.md`. Vuelve solo si Sergio Urcullo lo pide.
- **Trato:** voseo cruceño, que es su canon.
- **Sin marcas de terceros** en pantalla ni en el pie (modelos, plataformas, competidores): se dice «imagen», «video»,
  «Motor 1». Así la pieza queda dentro de lo que `CLAUDE.md` § «Qué se publica sin preguntar» deja publicar sin el OK
  pieza por pieza. Con una marca, o con una función del producto, pasa por Sergio Urcullo.
- **Cada prueba de Higgsfield deja dos cosas:** un video y un aprendizaje escrito acá (caso, costo, fecha).
- **Currículo** (cotizaciones en vivo del 8-oct; el detalle y los costos están en `PLAN.md` §3):

  | Prueba | Créditos | Se aprende | Video |
  |---|---:|---|---|
  | Foto → orden → revisión, con lo ya pagado | 0 | método y costo real de una pieza | G1 |
  | Errores que se escapan, con lo ya pagado | 0 | qué mirar en cada cuadro | G3 |
  | **L1** misma foto y orden en 5 motores de video y 7 de imagen | **86,5 gastados el 8-oct** (con labios) | qué cambia al pagar más y **cuánto sostiene cada uno la cara** | G2 |
  | L2 voz y labios con audio propio | ~10-20 | si hay una voz cruceña (D4) | por definir |
  | L3 Motion Control con un video guía | 17 | control del gesto | por definir |

- **Cotizado en vivo el 8-oct para L1** (`get_cost`, 6 s salvo Cinema Studio; foto K1 de entrada): Kling 3.0 std
  `sound:"off"` 7,5 (ya pagado) · Kling 3.0 pro 9 · Seedance 2.0 mini 720p 6 · **Cinema Studio 3.0 de 4 s a 720p: 20** ·
  mejora a 1080p **1** (la tabla vieja decía ~0,1). Cinema Studio 3.0 nunca se había probado: es parte del aprendizaje y por eso entró al lote aunque
  la tabla de §3 lo marque «no usar» para el día a día.

## 0-bis. Qué es un video de Lucía (Sergio Urcullo, 8-oct) — la regla que más pesa

> *«No tiene el contenido estructurado, es literal un video de 10 segundos. Tienen que ser videos estructurados.»*
> Sergio Urcullo, 8-oct, sobre el chiste «¿Lucía Antelo es real?».

**Un clip suelto con tres tarjetas NO es un video.** Cada video de Lucía lleva, escrito ANTES de editar:
1. **Gancho** en los primeros 3 s, con una promesa o una pregunta.
2. **Desarrollo con valor:** pasos, un caso o una demostración. Con la premisa v5 la demostración sale de las pruebas de
   Higgsfield (la orden real, el costo real, el cuadro revisado); la pantalla de Onia ya no es obligatoria.
3. **Cierre** con un solo CTA.
- Dura de **30 a 60 s** y **deja algo aprendido** (la unidad de enseñanza va completa antes del CTA).
- El guion se valida con la madre **antes** de editar. Moldes: `hermes-content/references/marca-personal/FORMULAS-REFERENTES.md`
  (F3, F4, F5, F7) y la skill `edicion-referentes`. Primer guion: `docs/cola/lucia-diario/guiones/G1-de-una-foto-a-un-video.md`.
- **Orden de trabajo de cada video** (regla de oro de `CLAUDE.md`, sin excepción para Lucía): guion validado por la madre →
  preview 360p a la madre → render final → QA → publicar.
- **Prueba rápida:** si se puede resumir como «un clip con tarjetas», no es un video. Si no hay una frase que diga qué
  aprende quien lo ve, tampoco.
- **Cómo se llegó:** el 8-oct se editó el chiste (9,6 s, un clip del café y 3 tarjetas, 0 cr) en una pasada, con QA y
  guardas de layout, y Sergio Urcullo lo rechazó. El oficio estaba bien; el error era de contenido y se lo medía mal: se
  verificó la forma (legibilidad, mentón, specs) y no si la pieza enseñaba algo. L02 (6 s) tiene el mismo defecto.


## 0-quater. Lo medido el 8-oct: control de cara en la nube, Higgsfield completo y montaje (leelo antes de gastar o editar)

> Sergio Urcullo, 8-oct: *«aprendas todo lo que es Higgsfield, todas sus funciones, y no perder la cara de Lucía… podés editarlo
> con el material que aprendimos»*. Se gastaron **86,5 cr** (tope que se fijó la sesión: 97; octubre queda en 139 de 150) y se montó G1.

- **Control de cara en la nube — `scripts/face-gate.sh`** (en esta skill). `bash .claude/skills/lucia/scripts/face-gate.sh foto.png clip.mp4@0,3,5.9 …`
  mide ArcFace (buffalo_l) contra las 8 referencias oficiales del repo y las caras negativas; los videos se miden en los segundos
  que se pidan. La primera vez crea un venv fuera del repo (pip: opencv-python-headless, onnx, onnxruntime, numpy, pillow) y baja
  buffalo_l (~280 MB) de GitHub; con `FACE_GATE_HOME` se elige dónde vive (por defecto `/tmp/lucia-face-gate`).
  - **Reproduce lo guardado:** K1 0,806 (guardado 0,808), K2 0,830 (0,829), K4·1 0,812 (0,81), K4·4 0,851 (0,851).
  - **Gate 0,70; piso de las caras negativas 0,224.** Una cara de menos de 200 px es poco confiable (en un clip crudo de 720p son
    ~115 px): ahí el número es poco confiable (es la regla del gate, no una caída: medido el 9-oct, achicar una cara de 89 a 60 px mueve el puntaje solo 0,004-0,010 en 5 de 6 fotos, y F oscila ±0,02) y la imagen se MIRA. Los refs de 8 ángulos dan un centroide más alto que el de 5 del
    photoshoot (K1 0,704 contra el photoshoot): **se mide siempre contra las 8 oficiales**, no contra otro juego.
  - Higgsfield `sandbox_exec` no hace falta (y el control de permisos lo rechazó).
- **Mapa de TODAS las funciones de Higgsfield, con costos y cara:** `higgsfield-mapa.md` (en esta carpeta). Lo que más pesa:
  1. **`start_image` ata la escena solo en Kling std/pro y la cara decae** (0,79 → 0,72 en 6 s; Seedance mini y Cinema 3.0 con `start_image` también reencuadran y cambian el fondo); **las referencias de cara la sostienen pero la
     escena la inventa el motor** (Kling Omni, 5 refs, sin `start_image`: 0,80 → 0,82, a 6 cr, el más barato). Seedance mini con
     `start_image` + 3 refs sube de 0,69 a 0,80 al mismo precio, pero reencuadra e **inventa letreros**.
  2. Kling pro no mejora el movimiento de std (solo la nitidez, a 1080p nativo): no vale +1,5 cr si se publica a 720p.
  3. **Imagen: Seedream 4.5 sigue siendo el método** (3 escenas ≥ 0,80). Kling Omni Image (0,5 cr) perdió la cara en 1 de 3
     (0,35): no confiable. Nano Banana 2.1 0,74 · Seedream 5 Pro 0,70 · FLUX 3 0,69 · GPT Image 2.5 0,66 (una foto cada uno).
  4. **Labios:** Seedance mini de un paso cae bajo el gate y no trae audio; **`sync_so` conserva la identidad del clip base**
     (dif ≤ 0,03) y trae el audio: 3,6 cr por segundo de origen (21,75 por 6,04 s), el clip base aparte.
  5. Una cotización de `get_cost` es el cobro exacto (leer `credits_exact`), salvo `sync_so` que no se cotiza. Máximo 3 trabajos
     simultáneos. `jobs_wait` acepta `jobs:[{index,job_id}]`; `job_display` por id mira el estado sin gastar.
  6. Música y efectos sueltos **no** salen del MCP. La voz: Higgsfield no trae acento cruceño ni licencia (D4 sigue abierta).
- **Montaje con HyperFrames — `montaje-hyperframes.md`** (en esta carpeta): comandos, estructura del proyecto, técnicas (empuje
  rígido, morph, tarjetas en HTML), controles numéricos y trampas. Caso G1: tres pasadas con revisor independiente.
- **Pruebas guardadas:** `hermes-content/references/modelos/lucia/v4/prueba-motores-20261008/` (hojas, proxies 360p, README) y
  `v4/PROCEDENCIA.jsonl` (ids de cada job y puntajes). Los originales se recuperan a 0 cr con `job_display` → `rawUrl`.

## 1. Arranque (5 minutos)

1. `git branch --show-current`; leé el «ESTADO VIGENTE» de `docs/handoff/higgsfield-lucia.md` y `PLAN.md` §0, §5 y §8.
2. Escribí en el transcript **META / PRUEBA / PARADA** (regla de la madre, 3-oct).
3. Mirá el saldo con `mcp__higgsfield__balance` y anotalo: cada lote registra antes y después en
   `v4/PROCEDENCIA.jsonl`.
4. **Workflows de 5 agentes como máximo**, y cada agente lee solo la sección que necesita (tokens).

## 2. Identidad (decidida; no se reabre)

- **Fotos:** `seedream_v4_5`, 9:16, `image_references` con el ancla espejo `abe2e6bd` PRIMERA y las 4 fuentes de cara.
  En el prompt van la escena, «Same face, skin and freckles as the first reference image» y la cláusula de belleza
  (`LUCIA-HIGGSFIELD-IDENTITY.json` → `v4.metodo_diario`). Cuesta **1 cr** y midió 0,83-0,87.
- **Respaldo:** Soul `LUCIA-v5` (`cd42c065`), `soul_2`, 0,12 cr. En el A/B midió 0,803 contra 0,838 de Seedream y
  quedó de respaldo.
- **Ropa:** la prenda va como ÚLTIMA referencia, con «Ignore everything that is not the garment». La prenda fija del
  ambo es el maniquí `v4/vestuario/ambo-terracota-frente-8d138bd6.jpg`.
- **QA:** `scripts/face_identity_qa.py`, con un gate de ≥ 0,70 en caras frontales o de tres cuartos. Los perfiles,
  los parpadeos y las caras de ~120 px (Kling a 720p) bajan solos: esos se MIRAN.

## 3. Video — recetas y costos (cotizado con `get_cost` el 5-oct, 0 cr gastados)

| Para qué | Modelo y parámetros | Créditos |
|---|---|---:|
| **Clip de Lucía (todos los formatos)** | `kling3_0`, `mode: std`, **`sound: "off"`** (texto, no `false`), 9:16, `start_image` = foto aprobada | 3 s 3,75 · 6 s **7,5** · 10 s 12,5 |
| Kling pro | ídem, `mode: pro` | 6 s 9 · 10 s 15 |
| Respaldo barato | `seedance_2_0_mini`, 720p | 6 s 6 (con la cara algo inestable el 30-sep) |
| Lipsync con nuestro audio (cuando haya voz) | `seedance_2_0_mini` 720p + `audio_references` → se monta el mp3 | 10 s = 10 |
| Lipsync fino (solo para una pieza estrella) | `sync_so` | 3,6 cr/s (10 s = 36) |
| Cambio de voz conservando los tiempos | `voice_change` (solo hacia voces de Higgsfield) | 1 por 10 s |
| Subir de 720p a 1080p | `bytedance_video_upscale` standard (4K: 4; pro 1080p: 10) | **1** por clip de 6 s (cotizado el 8-oct; antes se anotaba ~0,1) |
| Foto 3:4 a 9:16 | `outpaint_image` | 2 |

- **No usar para Lucía:**
  - Seedance 2.5: 42 por 6 s, aunque es el default de la skill oficial;
  - Cinema Studio 3.0, 3.5 y 4.0: de 30 a 42 por 6 s (el 3.0 de 4 s a 720p cuesta 20: se probó el 8-oct, sostiene la cara y
    sale 4 veces más caro por segundo que Kling std y 2,7 veces por clip);
  - Marketing Studio: de 42 a 105; inventa guion y voz, y el rol `character_photo` da «Unknown media role» al cotizar
    (no hay forma probada de pasarle la cara de Lucía);
  - `saas_motion`: re-dibuja la captura, y eso es una pantalla falsa;
  - `reframe`: 5 cr/s; para eso está ffmpeg;
  - Shorts Studio: 90 por 30 s.
- **La pantalla real no la pone Higgsfield:** se monta con `editor-videos`. Geometría del flujo ugc-video de
  Higgsfield, que vale copiar: tarjetas de 0,78 del ancho y hasta 0,60 del alto, subidas un 4 %, de 1,2 a 1,5 s cada
  una, con 0,3 a 0,5 s de cara limpia entre tarjetas, nunca en el gancho ni en el cierre, y el 15 % de abajo libre.
- **Esqueleto de la pieza de venta (EN PAUSA desde el 8-oct, ver §0-ter):**
  1. persona en cuadro desde el segundo 0, con subtítulo;
  2. pantalla real después del gancho;
  3. un solo CTA.
  - Lo 1 y lo 3 están en los videos que más duran (mirados el 5-oct).
  - Lo 2 es regla propia («producto visible o no sale»). En la competencia solo lo hacen los testimonios de Doctocliq y
    anuncios nuevos; CitaPro (80 días) usa una placa.
  - Una pieza de 10 s sin pantalla no cumple la regla.
- **Tarjetas (cutlists de Codex, 6-oct; trato y CTA al día con la v5, 8-oct):**
  - ≤ 6 palabras contando la palabra titular, y ≥ 0,35 s por palabra + 0,3 s;
  - voseo cruceño (el usted de las cutlists K1-K4 era de la pieza de venta, hoy en pausa);
  - rótulo «Lucía Antelo · personaje IA de Onia» desde el segundo 0;
  - un solo CTA. Con la v5: «Seguime: cada semana, una prueba.». Los de venta («Escríbale a Onia desde la bio») quedan
    pausados con la puerta de demo;
  - nunca «Agende su demo»: ese destino daba 404.
- **Recuperar un clip ya pagado (8-oct, 0 cr):** `mcp__higgsfield__job_display` con el id del job → `results.rawUrl` es el
  clip LIMPIO, sin texto. Se baja con `curl` del CDN, se pasa por `ffprobe` y se MIRA. Así volvió el de K3
  (`07b938b2`), que Codex no encontró en la PC. Nunca se regenera lo que ya se pagó.
- La edición sigue en **`editor-videos` § «Reels de Lucía»**. Higgsfield solo genera el clip.
- **Editar en una nube sin PIL, numpy, cv2, insightface ni SFX (8-oct, chiste de 10 s, 0 cr).** Instalar pide
  aprobación (CLAUDE.md), así que se arma con lo que hay. Modelo: `videos/lucia-chiste/scripts/build.mjs`.
  - Tarjetas: `make-mockup.mjs` (Playwright + Chromium local; el proxy no molesta porque es HTML local).
  - Geometría: `ffprobe` del PNG + el aire conocido de la plantilla (130u a los lados, 80u arriba, 190u abajo, @2x).
  - Montaje: ffmpeg en una pasada (overlay + fade alfa + pista en silencio, CRF 14).
  - QA: hoja de 8 cuadros con guías (mentón + 40, y=1490, x=1000), y se MIRA.
  - Sin cara nueva no hace falta medir: se reusan el mentón y las escalas ya validadas del mismo clip (café: mentón
    YuNet 1148; tarjeta F = 0,51429 de L02; rótulo 520/(1353−88) de L08).
  - Sin SFX la pieza sale muda: la música la pone Sergio Urcullo.
- **Trampa del ancho (8-oct):** la `frase-card` de L02 tiene `width: max-content`, así que la frase NO se parte en dos
  líneas. Con F = 0,51429 entran unos **22 caracteres**: «Las pantallas que le muestro, sí.» (33) invadía los 80 px de
  la derecha. La guarda del build (`x + visible > 1000 → error`) lo frena antes de renderizar. Se acorta el texto; no se
  achica la letra.
- **Costo real por pieza (8-oct):**
  - montaje con clips ya pagados: 0 cr y ~1 min de render (el costo no es el límite: lo es el guion, ver §0-bis);
  - reel de venta con un clip nuevo: 7,5 cr (Kling std off, 6 s) + 1 cr (foto Seedream) + la pantalla real;
  - kit K1-K4 completo (3-oct): 30,5 cr.

- **Armar el guion contra la duración REAL de cada clip (8-oct, G3).** Los clips de Kling de 6 s duran 6,04 s (145 cuadros a
  24 fps). El primer G3 le daba 14,5 s al clip K4 y no se podía montar sin acelerar o congelar. Antes de validar, cada
  bloque de clip se dibuja con su duración real; lo que sobra va a una placa de evidencia o a otro clip, nunca a un estiramiento.
- **Afirmar un conteo solo sobre cuadros mirados (8-oct, G1 y G3).** «Cinco dedos. Revisados.» se escribió sobre un conteo
  heredado de 9 cuadros. Mirado de nuevo a resolución completa (recorte de la mano, cuadro por cuadro): contables 0, 60, 84, 96, 112
  y 120; en 72 y 104 el dedo de la otra mano cruza. (La primera versión decía «72 a 104» en bloque y un
  revisor independiente lo desmintió: un bloque no se rotula por dos muestras de los extremos.) La tarjeta cita el cuadro («Cuadro 120: cinco dedos.») y la hoja de
  evidencia queda en `v4/kit/k4-revision-manos-20261008.jpg`.
- **El prompt que se muestra en pantalla se guarda literal en el repo (8-oct).** Se baja con `job_display` (0 cr) y se
  registra en `v4/PROCEDENCIA.jsonl` con el id del job. Un guion que cita «el prompt real» sin ese archivo no se puede
  verificar. Pasó con el prompt de K1 y con el fragmento «no text, no logos, no signs anywhere» de la foto descartada.
- **Una cara aprobada no aprueba la foto (8-oct, G3).** La foto descartada de K4·1 midió 0,835 de identidad (gate ≥ 0,70) y
  tenía un letrero inventado en la torre aunque el prompt decía «no text, no logos, no signs anywhere». El puntaje de cara no
  mira el fondo: el fondo se mira.
- **Cuando un `job_display` falla, el id se copia del registro, no de memoria (8-oct).** Se inventó un uuid parecido y dio error;
  el id correcto salió de `PROCEDENCIA.jsonl`.

## 4. Voz (5-oct)

- **No existe una voz cruceña ni boliviana lista.** ElevenLabs no tiene el acento boliviano (`es-BO` da 400), y las
  voces de Higgsfield no traen la etiqueta de acento: hay que escucharlas.
- Marcela tiene **acento colombiano** y Voice Remix no la puede tocar (su aviso es de 730 días, no infinito).
- ⚠️ **Licencia:** la cuenta de ElevenLabs es `tier: payg`, y según su documentación eso es el plan **gratis** con pago
  por uso, **sin licencia comercial**. No se publica ninguna voz de ElevenLabs hasta que Sergio Urcullo confirme el plan
  en el panel. Starter cuesta US$6 al mes.
- **Hoy, sin voz (D4).** Para elegir de oído hay 18 muestras gratis de ElevenLabs en
  `research/competencia/lucia-20261005/voces/` (`_urls.tsv` trae el `voice_id`). Bajar `preview_url` no gasta
  caracteres.
- La única voz cruceña de verdad sería clonar a una persona real, con su consentimiento escrito (Starter o
  `create_voice`).

## 5. Pantallas reales (EN PAUSA desde el 8-oct: la premisa v5 no las exige)

Se conserva lo medido por si Sergio Urcullo vuelve a pedir una pieza de producto.
- La cuenta demo **«Clínica Demo Onia»** existe desde el 2-oct (`handoff/onia-1.0-nube.md` §2). Tiene 25 pacientes,
  50 citas y 28 cobros. **Sus pacientes no tienen correo** y tiene 0 canales de envío.
- Le falta que Sergio Urcullo confirme su correo y le dé `module.agents` (plan de la 1.0, punto 9).
- **Desde la nube no se graba:**
  - el Chromium headless no tiene la CA del proxy, y el control de permisos frena saltear la verificación TLS;
  - no hay sesión de la demo.
  Graban la madre o Plataforma.
- **Se puede grabar sin escribir en producción:** la página pública de reserva (sin reservar), Pendientes (si la demo
  tiene `module.agents`) y la agenda.
- **Pide un OK para escribir en producción:**
  - una plantilla IA aprobada (K1);
  - un paciente con un correo que controle Onia (el recordatorio de K2);
  - la carga desde la web (K3).

## 6. Publicación (circuito medido el 5-oct)

- **Instagram:**
  - con la app propia «OnIA Social API», que está en modo Live;
  - `@lucia.antelo.oficial` es cuenta Creador, conectada a la app desde el 20-ago;
  - su token vivía en Postiz (integración `cmt1sv4eh001alq9cl3y6q7es`). El 4-sep las tres cuentas vencían entre el 13
    y el 18-oct, y no se midió desde entonces;
  - hay que pasarlo a `/root/.config/onia-publicar/ig-lucia.env` (`IG_USER_ID`, `IG_TOKEN`) y renovarlo con
    `ig-refrescar.sh`.
  - **Renovación, leída del script el 10-oct (caso: pedido de la madre «dejá los pasos exactos»):** es
    `graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token`, token de 60 días que debe tener más de 24 h y no estar
    vencido; el script recorre todos los `ig-*.env` (cron lunes 13:00 UTC), así que `ig-lucia.env` se renueva solo apenas existe. Si ya
    venció no hay refresh: hay que generar uno nuevo en developers.facebook.com. Los pasos completos están en
    `hermes-content/docs/cola/loop/lucia.md`. Sin correr desde la nube (no tiene `ssh`).
  - ⚠️ Para leerlo se levanta **solo** `postiz-postgres`. Si se levanta Postiz entero, se publican posts vencidos sin OK:
    pasó el 4-sep.
- **Etiqueta IA por pieza:** `is_ai_generated=true`, que Meta acepta desde el 22-jun-2026, también con Instagram Login.
  - `ig-reel.mjs` e `ig-carrusel.mjs` la mandan solos con `--cuenta lucia` (`CUENTAS_IA`). En el carrusel va solo en el
    contenedor padre.
  - Después de publicar se lee `is_ai_generated`. `leerPublicado` **nunca lanza**: si falla, la pieza igual queda en
    `publicado.jsonl`. Si no, `agendar-publicacion.sh` avisaría «falló» y alguien la publicaría dos veces.
  - ⚠️ **Está en el repo desde el 5/8-oct; en el VPS falta desplegarlo y nunca se probó en vivo.** Se copian LOS DOS
    juntos a `/root/bin` y después se corre `--selftest` en los dos: `ig-carrusel.mjs` importa de `ig-reel.mjs`, y
    copiar uno solo rompe los carruseles agendados de `@sergiourcullo`. Se le avisa a Marca personal.
  - En el ensayo, «etiqueta IA» solo confirma que se mandó el parámetro.
- **Por pieza** (en el VPS; esta nube no tiene ssh):
  1. `ig-reel.mjs --cuenta lucia --video … --caption …` sin `--publicar`: es el ensayo y debe decir FINISHED;
  2. `agendar-publicacion.sh lucia-<pieza> "AAAA-MM-DD 23:00:00" node /root/bin/ig-reel.mjs … --publicar`, que son las
     19:00 en La Paz;
  3. la madre abre el permalink y confirma «Información de IA».
- **TikTok:**
  - por Buffer, con una cuenta gratis aparte (el Buffer actual tiene sus 3 canales llenos);
  - `buffer-post.mjs --meta` con `{"tiktok":{"isAiGenerated":true}}`, y hay que sumarle una segunda clave;
  - el TikTok de Higgsfield no sirve para el día a día: pide un clic humano en un widget por cada pieza y no se puede
    agendar.
- **Sin API:**
  - la música de tendencia: la Audio API es solo para Facebook Login, así que esas piezas se publican a mano;
  - las historias y la foto suelta: no hay script todavía.
- **Qué se publica sin el OK pieza por pieza (`CLAUDE.md`, 8-oct):** una pieza que pasa el QA de esta skill y se MIRÓ
  renderizada completa sale por `ig-reel.mjs`, y después se le avisa a Sergio Urcullo con el enlace. Siguen pasando por él:
  - las piezas que prometen o muestran una función del producto, hasta que exista la tabla «se promete / funciona»;
  - las que nombran, citan o muestran a un cliente, a un tercero o a un competidor (imagen, voz o marca);
  - los CTA de mecanismos sin probar, como comentario → DM de Instagram;
  - toda generación paga.
- **Puerta de demo (EN PAUSA desde el 8-oct):**
  - `https://wa.me/59175414930?text=Hola%2C%20vengo%20de%20Luc%C3%ADa…`;
  - `onia.com.bo/llamada` da 404 y Onia ya no tiene Cal.com;
  - los links del pie de Instagram no se pueden tocar: todo pasa por la bio o por la respuesta a «Comentá DEMO».

## 7. Lo que la competencia ya enseñó (5-oct)

Fuente: `research/competencia/LUCIA_COMPETENCIA_20261005.md`.
- **Ninguno declara la IA en la pieza:** Doctocliq pauta una «doctora IA» con ambo y Medizona un médico IA con bata. La
  etiqueta de Meta en el feed no se pudo ver. Lucía lleva el rótulo desde el segundo 0, y en un anuncio va sin ambo.
- **El orgánico de la categoría rinde poco** (mediana de 186 a 1.648 vistas). Se mide por mensajes.
- **No se encontró ninguna presentadora IA que se declare IA** vendiendo software de clínicas (nivel buscador y
  metadato): no hay a quién copiar resultados.

## 8. Trampas (fechadas)

- **5-oct · cotizar:**
  - una cotización de Kling o Seedance con un prompt que «suena a escena» devuelve la sugerencia del preset «IN THE
    DARK» y no el precio. Se pasa `declined_preset_id 24bae836-2c4a-48e0-89b6-49fcc0b21612` también en `get_cost`;
  - en Seedance, Cinema Studio y Veo, `generate_audio:false` **no baja el precio**: solo Kling con `sound:"off"` lo
    baja;
  - `sync_so` y `voice_change` cotizan solo con `duration`: con `sync_mode` o `voice_id` dan 422;
  - `models_explore recommend` ordena por etiquetas, no por calidad: para «persona a cámara» propuso Grok, a 27 cr;
  - Cinema Studio 3.5 viene con `prompt_language "zh"` y 15 s por defecto, y el 4.0 con el audio prendido.
- **5-oct · créditos:** los que sobran **se borran en cada renovación** (−387,57 el 1-oct). El tope de Lucía es 150
  por mes sobre un plan de 600.
- **5-oct · nube:**
  - no hay cliente ssh, y el control de permisos frenó instalarlo («Unauthorized Persistence») cuando el pedido no
    estaba claro. Otra sesión de la nube lo instaló el 5-oct porque Sergio Urcullo lo pidió EN ESA sesión (README del
    publicador). La madre recomienda no tener la llave del VPS en una sesión que lee páginas de terceros, y este
    entorno trae `ONIA_VPS_SSH_KEY_B64`: decide Sergio Urcullo;
  - Chromium falla con ERR_CERT_AUTHORITY_INVALID, y saltearlo lo frena el clasificador («TLS/Auth Weaken»). Para
    TikTok se usa curl: JSON de la página, embed del creador y mp4;
  - Instagram da 429 con muro de login.
- **5-oct · repo:** el hook Stop (`git-autosync.js`) commitea con «chore: auto-sync» y empuja la rama. Reescribir ese
  mensaje (amend + force) lo frena el clasificador («Git Destructive»). Se commitea a mano antes de soltar el turno.
- **8-oct · jobs y permisos:** no inventar el uuid largo de un job (dos veces dio error o 404: se copia de `PROCEDENCIA.jsonl`); un
  agente de workflow que llama `sandbox_exec` queda esperando la aprobación para siempre (el relevamiento perdió así su quinto
  grupo): a los agentes se les prohíbe esa herramienta. El control de permisos rechazó una vez `jobs_wait` («Real-World
  Transactions») justo después de lanzar un job que no se puede cotizar; el estado se mira con `job_display`.
- **8-oct · una sola toma no es una medición:** Kling Omni Image dio 0,79 en una escena y 0,35 en otra con el mismo método. Antes de
  cambiar de motor se repite en al menos 3 escenas.
- **9-oct · carrusel con franja blanca de 88 px:** `carousel_render.js` con el Chromium normal de la nube (`--headless=new`) deja el
  visor en 1262 px aunque la ventana pida 1350, y cada lámina sale con una franja blanca abajo. L01 del 8-oct la tenía y nadie la
  miró completa. Se renderiza con el `headless_shell` (`CAROUSEL_BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`
  y `--pack editorial-photo --account lucia`): mide 1080×1350 exacto. Las fotos del carrusel van por lámina (`slide.bg`) y solo
  el pack `editorial-photo` las pone en las 5; con `community-editorial` solo salían en portada y cierre.
- **9-oct · el contenedor se recicla y `out/` no está en git:** los finales de G1/G3/G2 vivían solo en el disco de la nube. Se
  entregan en `videos/lucia-entrega/` (G2 recodificado a 6 Mbps, PSNR 47,9 dB, para entrar bajo el límite de GitHub). Todo video
  final se copia ahí en el mismo commit que se monta; si no, quien tiene la llave del VPS no puede publicar.
- **9-oct · el fondo de una foto de IA se mira a 3x antes de publicar** (revisor de G4): la Imagen C tenía dos sillones dentales y una pantalla al
  fondo (da a entender el rubro de salud, y Lucía nunca es profesional de salud) y los monitores de C y E llevaban un logo tipo marca. Ni el puntaje de
  cara ni el grep lo ven; se encuentran ampliando el borde del cuadro. Se tapan con desenfoque con pluma en UN paso en RGB (`format=gbrp` + `gblur` +
  `maskedmerge`, salida `yuvj420p`): dos pasos por YUV corren los colores. Copias en `v4/prueba-motores-20261008/fotos-limpias/` (con README); el
  original queda como evidencia. Las fotos K1, K2·1, K4·3 y K4·5 se miraron enteras y están limpias.
- **9-oct · «una cara chica baja sola» exagera** (editor y revisor de G5): el guion lo afirmaba desde una intuición. El cuadro 0 del Motor 5 (cara de 89 px) da 0,798 y a 169 px da
  0,831; la misma foto reducida a 60 px baja de forma pequeña y consistente, −0,004 a −0,010 en 5 de 6 fotos, y F oscila ±0,02 (`videos/lucia-g5/qa/cara-chica-*.txt`). Lo falso es
  que sea apreciable. Se dice «lo reviso a ojo» (la regla < 200 px del gate), nunca «baja». Las medidas 0,79 y 0,77 difieren 0,02, no 0,03, y el mejor ancla del ruido es el
  MISMO clip del Motor 6, que oscila 0,771-0,799. Todo número o tendencia que un guion afirme se mide con el control propio (0 cr) antes de renderizar.
- **2/3-oct:** Seedream escribe como texto «sheet» y «hex #…»; inventa letreros en las torres; los lotes de más de 5
  dan 429. Están en `higgsfield-generate`.

## 9. Intentos fallidos (no repetir)

- **Chiste de 10 s «¿Lucía Antelo es real?» (8-oct): RECHAZADO por Sergio Urcullo.** Un clip suelto con 3 tarjetas no es
  un video: sin gancho con promesa, sin desarrollo y sin nada que aprender. Se retira del plan; su clip (el café) sirve
  de plano de apoyo. El proyecto quedó en `videos/lucia-chiste/` como ejemplo de lo que NO se vuelve a entregar.
  **Regla: §0-bis.**
- **L02 «Este video no fue grabado» (6 s):** mismo defecto. Se retira; su clip (la calle) queda para «un día en Santa
  Cruz» como apoyo.
- **Plan v4 «Lucía vende Onia» (5-8-oct): la premisa estaba mal.** Todo el plan (puerta de demo, capturas de Pendientes,
  cuenta demo, usted) partió de que Lucía conseguía clínicas. Sergio Urcullo, 8-oct: *«no es necesario que muestres el
  producto, sos una influencer; tu tarea es grabar y aprender Higgsfield»*. El mismo día la madre dio por aprobado el
  guion de producto G1 (recordatorio de cita) y no mencionó esa corrección; no consta si ya la había leído.
  **Cuando dos instrucciones chocan, manda la que Sergio Urcullo escribió en su propio mensaje; la otra se le muestra a la
  madre con la cita y se espera su respuesta, sin editar el guion de producto entre tanto.** Costo del error: 3 días de
  plan alrededor de una premisa que no era la suya; el guion de producto no llegó a editarse ni a publicarse.

- **Placas PIL + ffmpeg a mano (1-oct):** rechazadas por Sergio Urcullo. Se edita con `editor-videos`.
- **Forzar `voice_settings` a Marcela:** le cambia el timbre.
- **Casting de caras nuevas (29-sep, 23 cr):** partió de una premisa falsa del repo. La procedencia de un activo se le
  pregunta a quien lo creó.
- **«Hoy soy odontóloga» en el plan v2 (2-oct):** entró a `main` sin revisión. Antes de renderizar se pasa `grep` contra
  la lista de `editor-videos`.
- **La métrica `src=lucia-*` en `onia.com.bo/llamada` (v3):** la ruta nunca existió. Antes de fijar una puerta, se
  prueba con `curl`.
