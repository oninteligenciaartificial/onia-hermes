---
name: lucia
description: "Invocar para CUALQUIER trabajo del carril Lucía (Lucía Antelo, la influencer IA de Onia): generar fotos o clips en Higgsfield, editar sus reels, armar el paquete semanal, publicar en Instagram o TikTok, medir la prueba o tocar su plan. Dice lo ya medido —costos de Higgsfield, recetas por formato, voz, pantallas reales, circuito de publicación, puerta de demo— para no volver a investigarlo, con trampas e intentos fallidos fechados."
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
  - la pantalla de Onia que muestra es real;
  - no hay generación paga sin `get_cost` y el OK de Sergio Urcullo.

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
| Subir de 720p a 1080p | `bytedance_video_upscale` | ~0,1 por clip |
| Foto 3:4 a 9:16 | `outpaint_image` | 2 |

- **No usar para Lucía:**
  - Seedance 2.5: 42 por 6 s, aunque es el default de la skill oficial;
  - Cinema Studio 3.0, 3.5 y 4.0: de 30 a 42 por 6 s;
  - Marketing Studio: de 42 a 105; inventa guion y voz, y el rol `character_photo` da «Unknown media role» al cotizar
    (no hay forma probada de pasarle la cara de Lucía);
  - `saas_motion`: re-dibuja la captura, y eso es una pantalla falsa;
  - `reframe`: 5 cr/s; para eso está ffmpeg;
  - Shorts Studio: 90 por 30 s.
- **La pantalla real no la pone Higgsfield:** se monta con `editor-videos`. Geometría del flujo ugc-video de
  Higgsfield, que vale copiar: tarjetas de 0,78 del ancho y hasta 0,60 del alto, subidas un 4 %, de 1,2 a 1,5 s cada
  una, con 0,3 a 0,5 s de cara limpia entre tarjetas, nunca en el gancho ni en el cierre, y el 15 % de abajo libre.
- **Esqueleto de la pieza de venta:**
  1. persona en cuadro desde el segundo 0, con subtítulo;
  2. pantalla real después del gancho;
  3. un solo CTA.
  - Lo 1 y lo 3 están en los videos que más duran (mirados el 5-oct).
  - Lo 2 es regla propia («producto visible o no sale»). En la competencia solo lo hacen los testimonios de Doctocliq y
    anuncios nuevos; CitaPro (80 días) usa una placa.
  - Una pieza de 10 s sin pantalla no cumple la regla.
- **Tarjetas (cutlists de Codex, 6-oct):**
  - ≤ 6 palabras contando la palabra titular, y ≥ 0,35 s por palabra + 0,3 s;
  - trato de usted;
  - rótulo «Lucía Antelo · personaje IA de Onia» desde el segundo 0;
  - un solo CTA, «Escríbale a Onia desde la bio» o «Escríbale desde la bio» si no entra;
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
  - reel de personaje con un clip ya pagado: 0 cr y ~1 min de render;
  - reel de venta con un clip nuevo: 7,5 cr (Kling std off, 6 s) + 1 cr (foto Seedream) + la pantalla real;
  - kit K1-K4 completo (3-oct): 30,5 cr.

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

## 5. Pantallas reales

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
- **Puerta de demo:**
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
- **2/3-oct:** Seedream escribe como texto «sheet» y «hex #…»; inventa letreros en las torres; los lotes de más de 5
  dan 429. Están en `higgsfield-generate`.

## 9. Intentos fallidos (no repetir)

- **Placas PIL + ffmpeg a mano (1-oct):** rechazadas por Sergio Urcullo. Se edita con `editor-videos`.
- **Forzar `voice_settings` a Marcela:** le cambia el timbre.
- **Casting de caras nuevas (29-sep, 23 cr):** partió de una premisa falsa del repo. La procedencia de un activo se le
  pregunta a quien lo creó.
- **«Hoy soy odontóloga» en el plan v2 (2-oct):** entró a `main` sin revisión. Antes de renderizar se pasa `grep` contra
  la lista de `editor-videos`.
- **La métrica `src=lucia-*` en `onia.com.bo/llamada` (v3):** la ruta nunca existió. Antes de fijar una puerta, se
  prueba con `curl`.
