# Erik Taveras: análisis completo de contenido (2026-10-08)

> Pedido de Sergio Urcullo (8-oct): analizar competencias y referentes "hasta su estructura de contenido, comunicación, ediciones, guiones, TODO". Esta ficha cubre a Erik Taveras (@eriktaveras en IG, @erik.py en TikTok, @ErikTaverasT en YouTube). No repite lo que ya está en `marca-personal/PLAN-REFERENTES.md`, `REFERENTES-ECOSISTEMA.md`, `FORMULAS-REFERENTES.md`, `FICHAS-MONTAJE-REFERENTES.md`, `EXTRACCION-REFERENTES-GUIONES.md`, `video-intake/2026-10-01-santiago-erik-edicion-medida.md` ni la receta `edicion-referentes/recetas/erik.json`: los completa y corrige.
>
> Etiquetas de confianza: **[M]** medido por mí con ffmpeg o fotogramas, **[W]** transcripción local Whisper small (texto aproximado; "Claude" sale como "Cloud"), **[G]** lectura de Gemini `gemini-flash-lite-latest` (aproximada: el modelo normal dio 429), **[D]** dato de un doc previo del repo, **[P]** página pública leída hoy.

> **Verificación del 8-oct (segunda pasada, contra la fuente).** Re-listado el catálogo de TikTok (250 piezas: mediana, decil 90, top 5/10, duraciones, meses, días de la semana, vistas del top 12 y de las 9 más recientes **coinciden**), el feed y las pestañas de YouTube, Skool (115 miembros, US$59, sube a US$79 con 250, 30 cupos Fundador llenos), `trabaja-conmigo` (US$75 y US$397) y el taller (agotado, sáb 17-oct). **Cayeron 3 cosas y se corrigieron:** (1) "80 Shorts" eran **130** (mediana 2.100); (2) "la palabra clave multiplica los comentarios por ~10" **no se sostiene** (3 a 8 veces, ver 1.5); (3) los primeros 3 s del corte de Mods: "AHORA ADMITE" entra a ~1,5 s y "MODS" a ~7 s, no a 0,5 y 1,5 s (ver 4.1). Se agregaron los hits #5 y #6 (y #9 y #10) con fotogramas propios (3.2 H-K y la tabla de épocas).

## Resumen en 5 líneas

1. Sus 4 videos más vistos en TikTok (598 mil, 555 mil, 386 mil, 352 mil) **no son su fórmula de edición de noticia**: son una guía larga con objeto en la mano, un clip mudo de 10 s, una reacción nostálgica de 19 s y una lista legal a cámara. Su mediana es 8.445 vistas; la noticia editada rinde 7-13 mil, con picos de 25 mil.
2. **Cambia el sistema visual cada 4-6 semanas** (manuscrito en junio, dorado en agosto, crema y menta a fines de septiembre, panel diseñado + cámara abajo desde el 3-oct). La receta `erik.json` describe el de fines de septiembre; el vigente es otro (sección 4).
3. **Graba un video largo de YouTube y lo corta en 6** el mismo día (8-oct: 9:41 en 6 cortes de 27-42 s). Mismo sistema visual en 16:9 y en 9:16.
4. Embudo verificado hoy: palabra clave, guía o foro gratis, Skool a **US$59/mes** (115 miembros, sube a US$79 con 250), llamada de **US$75**, Power Session de **US$397**. Vende además el sistema con el que produce el contenido (taller de edición con IA).
5. Una palabra clave de CTA se asocia con **unas 3 a 8 veces más comentarios por vista** (mediana 3,3 por mil vistas en 9 piezas con palabra clave, contra 0,4-1,0 en 4 piezas sin ella; la mediana de las 159 piezas de más de 5 mil vistas es 1,7), **no 10 veces**: es muestra chica y varía de 1,7 a 11,5. Para Sergio Urcullo ese mecanismo sigue sin probarse (2 rechazos de Meta). Verificado de nuevo el 8-oct contra el listado de TikTok.

---

## 0. Cobertura

### 0.1 Catálogo mirado

| Red | Qué se listó | Método | Límite |
|---|---|---|---|
| TikTok @erik.py | **250 piezas**, del 15-mar al 8-oct-2026, con vistas, likes, comentarios, duración y fecha | `yt-dlp --impersonate chrome --flat-playlist` | Hay más viejas; se cortó en 250. Captions truncados a 110 caracteres en el listado |
| YouTube @ErikTaverasT, Shorts | **130 Shorts** con vistas redondeadas (re-listado el 8-oct; la primera pasada había devuelto solo 80, corregido) | `yt-dlp --flat-playlist` | Sin fechas (bot-check al pedir metadatos por video). Mediana 2.100; 7 pasan de 10 mil |
| YouTube, videos largos | **29 videos** (la pestaña Videos completa) con vistas y duración | `yt-dlp --flat-playlist` | Sin fechas. Las **15 últimas entradas** (largos y Shorts) con fecha y vistas exactas salieron del feed RSS del canal |
| Instagram @eriktaveras | **No se listó** (429 sin sesión; el navegador es de la madre) | Solo lo ya medido el 3-oct en `FICHAS-MONTAJE-REFERENTES.md` [D] | 12 piezas conocidas (8 con vistas); 141 mil seguidores el 3-oct |
| **Total** | **~421 piezas** (250 + 130 + 29 + 12 de IG) | | |

Catálogos crudos (no versionados): `scratchpad/analisis-contenido/eriktaveras/catalogo/` (`tt_all.txt`, `yt_shorts.txt`, `yt_videos.txt`, `feed.xml`).

Escala por red, hoy: YouTube **19 mil suscriptores** [P]; TikTok 88,3 mil seguidores y 785,6 mil likes [D]; Instagram 141 mil [D]. Vistas típicas: IG 30-55 mil por reel en septiembre-octubre [D]; TikTok mediana 8.446 (250 piezas) y **5.786 en las últimas 4 semanas** (43 piezas); YouTube Shorts mediana 2.100 (130); YouTube largos mediana 11.000 (29). Re-medido el 8-oct: TikTok 88,3 mil seguidores y 785,8 mil likes, YouTube 19 mil suscriptores.

### 0.2 Piezas analizadas a fondo (12 + 1 complementaria)

URL: `https://www.tiktok.com/@erik.py/video/<id>` o `https://www.youtube.com/watch?v=<id>`. Método base: descarga, Gemini lite con los 4 bloques, hoja de 18 fotogramas repartidos + 12 fotogramas de los primeros 3 s (leídos con visión), transcripción Whisper local con tiempos por palabra, escena y loudness con ffmpeg.

| # | Formato | Fecha | Seg | Vistas | ID | Por qué se eligió | Método |
|---|---|---|---|---|---|---|---|
| 1 | Guía larga con objeto (homelab, "cuesta 120 dólares") | 2026-08-12 | 154 | 598.300 | 7673131729980247310 | Top 1 (en IG es el mismo video: 1,43 M) | Gemini + fotogramas + Whisper + ffmpeg |
| 2 | Clip mudo de objeto (Mac mini en estuche 3D) | 2026-09-21 | 10 | 554.800 | 7688002892455890190 | Top 2 | igual, sin voz |
| 3 | Reacción nostálgica (PC de los 90) | 2026-07-23 | 19 | 386.200 | 7665854952421461261 | Top 3 | igual |
| 4 | Lista legal "4 requisitos" a cámara con láminas | 2026-06-19 | 104 | 352.200 | 7653230133716716814 | Top 4 | igual |
| 5 | Prueba de herramienta (ChatGPT-6 Astra a Blender) | 2026-09-05 | 59 | 254.000 | 7682187902972857614 | Top 7; único "demo en vivo" con chips numerados | igual |
| 6 | Respuesta a comentario (reacción muda) | 2026-03-27 | 8 | 121.000 | 7621751404155260173 | Formato que no usa en otro lado | Gemini + fotogramas + ffmpeg |
| 7 | Noticia con edición (Mods de Claude Code) | 2026-10-08 | 38 | 7.680 | 7694138035545459982 | **Más reciente**, sistema vigente | Gemini + fotogramas + Whisper + ffmpeg |
| 8 | Versus largo en vertical (Muse vs Dots) | 2026-10-06 | 145 | 8.537 | 7693635461943725326 | 2º más reciente, el más largo del sistema nuevo | igual |
| 9 | Demo + repositorio (Tamagotchi de Meta, versión TikTok) | 2026-10-03 | 38 | 24.800 | 7692510629109779725 | Mejor de octubre con voz. La versión YouTube Short (`-hDAypOc_pA`) ya estaba por Gemini en el doc previo; aquí con fotogramas y Whisper | igual |
| 10 | B-roll mudo con canción de tendencia | 2026-10-03 | 10 | 38.700 | 7692559795701746958 | Segundo más visto de octubre | Gemini + fotogramas + ffmpeg |
| 11 | YouTube largo 16:9 (Los MODS de Claude Code) | 2026-10-08 | 581 | 1.264 | kAYXY3c0IrY | Largo más reciente; origen de los 6 cortes | Gemini (URL) + miniatura + 3 cuadros de YouTube + descripción del RSS |
| 12 | YouTube largo 16:9 (Los 6 tipos de agentes de IA) | 2026-10-06 | 489 | 5.535 | TtWKMZ43k0Q | 2º largo más reciente; pizarra de tiza | igual |
| +1 | YouTube largo tutorial (OpenClaw en un VPS) | 2026 (sin fecha) | 1165 | 31.000 | X519BLT6wJw | Largo más visto del canal; lectura complementaria | Gemini (URL) + miniatura, sin fotogramas propios |
| 13 | Demo en vivo con terminal (Laboratorio de IA local, Gemma 4) | 2026-04-08 | 150 | 287.500 | 7626438039379741966 | **Hit #5, antes solo listado** (verificación 8-oct) | Gemini lite + 12 fotogramas + 12 de los primeros 3 s + ffmpeg (loudness, cortes) |
| 14 | Explicador con captura (Límites de mensajes en Claude) | 2026-03-23 | 136 | 276.900 | 7620520651023027470 | **Hit #6, antes solo listado** | igual |
| 15 | Truco de un comando (`/model opusplan`, ahorra tokens) | 2026-03-17 | 47 | 180.800 | 7618288974464814350 | Hit #9; molde de noticia corta con captura de terminal arriba | igual |
| 16 | Opinión con 3 puntos (n8n regresa con MCP nativo) | 2026-05-01 | 112 | 180.100 | 7634951537978133773 | Hit #10; solo cámara, sin una sola captura | igual |

Ya medidos en otros docs y **no repetidos**: EVOX2 (`7691461865548860686`), DevDay (`7691157672229424397`), Dots (`7691049048752639246`), Opus 5.5 vs 5 (`7688503963435437325`) y subagentes (`7690076393782234381`) en `erik.json`; Muse (IG `DeABuCap7Gb`), carrusel VENTANA (`Dd6k6QpDnhy`) y portadas de `Db8Lb6ju_b7` y `Dbv6RTBR--5` en `FICHAS-MONTAJE-REFERENTES.md`.

### 0.3 Qué no se pudo ver

- **Instagram**: ni el listado ni un reel. Nada de IG se re-midió hoy; lo de IG sale de docs [D]. El reel de 1,43 M es el mismo video que mi #1 (154 s, mismo caption).
- **#5 y #6 del top** (laboratorio de IA local de 150 s y límites de Claude de 136 s): **vistos en la verificación del 8-oct** (filas 13 y 14, con #9 y #10 como complemento), con Gemini lite y fotogramas propios; sin transcripción Whisper, así que los guiones de 3.2 H-K salen del texto en pantalla que lee Gemini, no de audio.
- **YouTube**: la descarga y los metadatos por video dan bot-check. Los 3 largos se vieron pasando la URL a Gemini y con la miniatura + 3 cuadros automáticos de `i.ytimg.com`. Cortes, subtítulos y zooms de los largos son lectura de Gemini, **sin fotogramas propios**.
- **Gemini lite** es aproximado: sus conteos de cortes y su "música lo-fi" no los trato como medidas. Lo que viene de fotogramas lleva [M].
- **Cortes por 10 s**: un detector de escena no ve los jump cuts sobre el mismo encuadre. Solo doy cortes duros de plano completo (umbral 0,35): Homelab 0,9, Legal 2,9, Astra 1,5, Tamagotchi 1,0 por cada 10 s [M]. En el sistema nuevo (Mods, Muse vs Dots) la cámara no tiene cortes duros: lo que se mueve es el panel (ver 4.1).
- **Música**: el nivel en los huecos entre palabras da -17 a -26 dBFS [M], compatible tanto con una cama audible como con ruido de sala muy comprimido. No concluyo. Para los reels de fines de septiembre vale la medición previa de `erik.json` (sin cama en 3 de 5).
- **Comentarios y DMs**: no se leyeron (no hay sesión). Los números de comentarios vienen del listado de TikTok.
- Los videos bajados se borraron de la carpeta temporal durante la sesión (limpieza del entorno); las cifras ya estaban extraídas y se re-descargaron los de loudness.

### 0.4 Piezas con vistas y fecha

**TikTok, top 20 de 250** (el resto en `catalogo/tt_all.txt`):

| # | Fecha | Seg | Vistas | ID | De qué va |
|---|---|---|---|---|---|
| 1 | 2026-08-12 | 154 | 598.300 | 7673131729980247310 | Homelab: lo que tengo en la mano cuesta 120 dólares |
| 2 | 2026-09-21 | 10 | 554.800 | 7688002892455890190 | Impresión 3D Claude en la Mac mini M4 |
| 3 | 2026-07-23 | 19 | 386.200 | 7665854952421461261 | "Ustedes son muy jóvenes" (PC de los 90) |
| 4 | 2026-06-19 | 104 | 352.200 | 7653230133716716814 | 4 requisitos legales para tu SaaS |
| 5 | 2026-04-08 | 150 | 287.500 | 7626438039379741966 | Laboratorio de IA local con Gemma 4 |
| 6 | 2026-03-23 | 136 | 276.900 | 7620520651023027470 | Cómo funcionan los límites de mensajes en Claude |
| 7 | 2026-09-05 | 59 | 254.000 | 7682187902972857614 | ChatGPT-6 Astra en arquitectura |
| 8 | 2026-08-07 | 67 | 201.500 | 7671358628829334797 | ESP32 para dispositivos IoT |
| 9 | 2026-03-17 | 47 | 180.800 | 7618288974464814350 | Ahorra 30-40 % de tokens en Claude Code |
| 10 | 2026-05-01 | 112 | 180.100 | 7634951537978133773 | n8n regresa con MCP nativo |
| 11 | 2026-03-15 | 12 | 160.900 | 7617585528245914893 | Cambiarte a Claude y dejar ChatGPT |
| 12 | 2026-03-27 | 8 | 121.000 | 7621751404155260173 | Respuesta a un comentario (reacción) |
| 13 | 2026-04-06 | 81 | 119.900 | 7625734233989926157 | Meta banea cuentas por automatizar anuncios |
| 14 | 2026-03-16 | 88 | 113.800 | 7617942338404453646 | Mitos de la Mac mini M4 con OpenClaw |
| 15 | 2026-04-13 | 102 | 101.600 | 7628354514378067214 | Qué son los Proyectos de Claude |
| 16 | 2026-07-15 | 80 | 97.300 | 7662801241201757454 | Reunión completa sin notas con Insta360 |
| 17 | 2026-06-30 | 35 | 81.400 | 7657280578764524813 | WhatsApp: nombre de usuario |
| 18 | 2026-04-22 | 43 | 71.400 | 7631406484575833357 | Claude Code sale del plan Pro: IA local |
| 19 | 2026-06-23 | 113 | 71.000 | 7654718790667668750 | 5 requisitos legales para lanzar tu SaaS |
| 20 | 2026-05-14 | 134 | 61.800 | 7639871602854841613 | Obsidian + Claude Code |

**TikTok, las 8 más recientes**: 2026-10-08 (x6 cortes de "mods", 27-42 s, 948 a 7.680 vistas), 2026-10-06 Muse vs Dots (145 s, 8.537), 2026-10-05 "Hola!" (38 s, 2.988), 2026-10-04 clip sin caption (6 s, 3.776), 2026-10-03 clip de 9 s (38.700), 2026-10-03 Tamagotchi (38 s, 24.800), 2026-10-02 Muse (98 s, 8.533), 2026-10-01 clip de 17 s (3.081).

**YouTube, 15 últimas entradas del feed** (fecha y vistas exactas):

| Fecha | Tipo | Vistas | ID | Título |
|---|---|---|---|---|
| 2026-10-08 | Largo 9:41 | 1.264 | kAYXY3c0IrY | Los MODS de Claude Code: qué son, cómo crearlos y qué riesgo tienen |
| 2026-10-08 | Short | 1.094 | 9LA5OvyMQW4 | Los mods de Claude Code gastan cero tokens? Depende de esto |
| 2026-10-08 | Short | 974 | FxKgIuDRUyw | Claude Code ahora tiene mods (como los videojuegos) |
| 2026-10-08 | Short | 407 | ENXQ0sAxbg8 | Crea un mod de Claude Code sin saber TypeScript |
| 2026-10-08 | Short | 401 | v_x2ZQzathM | Un mod que protege tus datos? Hazle esta pregunta |
| 2026-10-08 | Short | 344 | ISla0rCiZjI | Skill, MCP o mod: cuál usar en Claude Code |
| 2026-10-08 | Short | 197 | 0SOjquC5KHM | Un mod que protege tus datos? (segunda versión) |
| 2026-10-06 | Largo 8:09 | 5.535 | TtWKMZ43k0Q | Agentes de IA en 2026: Claude Code, Dots, Muse, Hermes... cuál te conviene? |
| 2026-10-06 | Short | 2.833 | -hDAypOc_pA | Tamagotchi meta |
| 2026-10-02 | Short | 1.583 | q1ur1EWCXe0 | Muse y todo lo que puede hacer con tus redes sociales |
| 2026-10-01 | Short | 8.074 | OujAloPQHoA | GMKTec EvoX2 mini PC |
| 2026-09-22 | Short | 1.138 | sBH2MkhvuQM | Nuevo modelo Anthropic Opus 5.5 |
| 2026-09-21 | Short | 1.341 | 13g5eAWd7YE | MCP de Meta |
| 2026-09-20 | Short | 1.417 | zUTHeYOyBXc | Edición de video con Claude o ChatGPT |
| 2026-09-18 | Short | 3.308 | yo56Ejm-WIs | Hermes orquestando Codex y Claude Code |

Los **más vistos de YouTube de siempre** (sin fecha): Short "My Home Lab" 258 mil (el mismo video del 1,4 M de IG y los 598 mil de TikTok); largo OpenClaw en un VPS 31 mil (19:25, `X519BLT6wJw`); largo Tesla P40 con 24 GB de VRAM por menos de 200 dólares 27 mil (13:52); largo agente de voz con Retell + n8n 20 mil; largo "Construí mi propio SaaS de WhatsApp" 19 mil; largo "El peligro de Evolution API" 18 mil; largo Chatwoot + API oficial de WhatsApp 17 mil.

**Instagram, ya conocidos** [D]: `Db8Lb6ju_b7` 2026-08-12 154 s **1,43 M**; `Dbv6RTBR--5` 2026-08-07 67 s 485 mil; `DbgkvzWp1HH` 2026-08-01 473 mil; `DckHLSIuDIN` 2026-08-28 313 mil; `DcekIntpDtb` 2026-08-25 204 mil; `DdZ4_d0OFdR` 2026-09-17 y `DcuvivKuciJ` 2026-09-01 115 mil cada uno; `DeABuCap7Gb` 2026-10-02 98 s 36,5 mil; carrusel `Dd6k6QpDnhy` 2026-09-30 con 1.383 me gusta y 1.434 comentarios.

---

## 1. Estructura de contenido

### 1.1 Pilares temáticos y su peso (TikTok, 250 piezas)

Clasificación por palabras en el caption (una etiqueta por pieza, en orden de prioridad). Es orden de magnitud: el 32 % cae en "otros" porque el caption está truncado o es ambiguo.

| Pilar | Piezas | % de piezas | Mediana de vistas | % de las vistas totales |
|---|---|---|---|---|
| Claude / Anthropic (modelos, Claude Code, mods, límites) | 29 | 12 % | 16.800 | **25 %** |
| Homelab, hardware, mini PC, impresión 3D | 19 | 8 % | 21.400 | **18 %** |
| Legal, SaaS, negocio, "WhatsApp cobrará", validar idea | 16 | 6 % | 14.900 | 11 % |
| WhatsApp, Meta, Muse, Instagram | 13 | 5 % | 15.600 | 8 % |
| OpenAI, ChatGPT, Codex, Dots, Kimi | 9 | 4 % | 13.200 | 6 % |
| IA local, modelos locales | 11 | 4 % | 13.600 | 3 % |
| Hermes, OpenClaw, agentes | 10 | 4 % | 15.200 | 4 % |
| n8n | 8 | 3 % | 9.572 | **1 %** |
| Otros | 80 | 32 % | 5.231 | 19 % |
| Sin caption (clips sueltos) | 55 | 22 % | 4.463 | 6 % |

Lectura: **Claude y hardware son el 20 % de las piezas y el 43 % de las vistas**. n8n, su marca original de 2025 en YouTube, hoy casi no suma. Los clips sin caption son el 22 % de las piezas y solo el 6 % de las vistas, **pero uno de ellos es el #2** (lotería barata).

### 1.2 Series recurrentes

| Serie | Cómo se reconoce | Ejemplos |
|---|---|---|
| **Noticia con dueño y verbo, dentro de 24-48 h** | Gancho "X acaba de lanzar Y" + prueba oficial + "qué significa" | Opus 5.5 (22-sep, 25 mil), Dots (29-sep, 13 mil), DevDay (30-sep, 10 mil), Muse (2-oct), Mods (8-oct), Astra (5-sep, 254 mil) |
| **Objeto en mano con precio** | Primer plano, precio en pantalla, comparación | Homelab 120 dólares (598 mil), EVOX2, ESP32 de 19 dólares, silla HBADA |
| **Lista legal con número en el título** | "4 requisitos", luego "5 requisitos" 4 días después | 19-jun (352 mil), 23-jun (71 mil): la segunda rinde la quinta parte |
| **Versus / "cuál gana"** | Dos productos, rondas, veredicto por tipo de negocio | Muse vs Dots, "Cuál gana?" (20-sep, 12.600), "Misma skill, diferente modelo" (22-sep, 11.900) |
| **Clips mudos sin caption** | 6-17 s, sin voz, a veces con canción de tendencia | #2 (555 mil), 9 s (38.700), 10 s (21.600) |
| **Reacción / respuesta a comentario** | Sin hablar; texto del comentario encima | #12 (121 mil), #3 (386 mil) |
| **Un largo, 6 cortes** (nueva, 8-oct) | Mismo día en YouTube Shorts y TikTok | Mods |

### 1.3 Mezcla de formatos

**TikTok por duración (250 piezas):**

| Duración | Piezas | % | Mediana | Máximo | Suma de vistas |
|---|---|---|---|---|---|
| <= 20 s | 53 | 21 % | 4.485 | 554.800 | 1,67 M |
| 21-45 s | 81 | 32 % | 5.106 | 81.400 | 0,85 M |
| 46-75 s | 50 | 20 % | 10.500 | 254.000 | 1,32 M |
| 76-120 s | 44 | 18 % | 14.650 | 352.200 | 1,63 M |
| > 120 s | 22 | 9 % | **24.250** | 598.300 | 1,67 M |

Cuanto más largo, más sube la **mediana** (de 4,5 mil a 24 mil). La franja de 21-45 s, que es el molde de "noticia con edición" y el 32 % de las piezas, es la que menos rinde después de los clips mudos. Los dos extremos (75 piezas de <= 20 s o > 120 s) suman 3,34 M; las 175 del medio, 3,80 M: **las piezas "raras" pesan más de dos veces lo que pesan por cantidad**.

**TikTok, últimas 4 semanas (43 piezas), a ojo por título y duración:** ~60 % noticia o explicador con edición (26 piezas), ~16 % producto o hardware (7), **21 % clips de 20 s o menos (9)**, ~5 % otros.

**Por red:**

| Red | Formato dominante | Dato |
|---|---|---|
| Instagram | Reel vertical, 67-154 s en los hits, 1 por día y algún día 2; carrusel crema de 9 láminas 4:5 cada ~7 días [D] | 29 reels en 30 días + 2 carruseles (3-sep al 2-oct) |
| TikTok | Los mismos reels, más clips mudos | 43 en 4 semanas |
| YouTube Shorts | Los mismos videos que TikTok, título traducido | Mediana 2.100; 7 de 130 pasan de 10 mil |
| YouTube largo | 7-27 min horizontal, tutorial o explicador | Mediana 11.000, duración mediana 12 min |

### 1.4 Frecuencia

- TikTok: **43 piezas en 4 semanas (1,5 por día)**. Desde el 10-ago publicó 38 de 60 días; el domingo es el día flojo (20 piezas contra 37-41 de cada uno de los otros días). Semanas ISO 35 a 40: 8, 7, 8, 10, 12, 8 piezas.
- YouTube: **7 videos el 8-oct** (1 largo + 6 shorts) y 2 el 6-oct; del 18 al 22-sep, 4 Shorts en 5 días.
- IG: 1 reel por día y algún día 2 [D].

### 1.5 Qué rinde más y qué menos (TikTok)

| Medida | Valor |
|---|---|
| Mediana | **8.445** (media 28.547) |
| Decil 90 | 54.790 |
| Piezas >= 100 mil | 15 de 250 (6 %) |
| Piezas < 5 mil | 91 (36 %) |
| Top 5 / top 10 de las vistas | 31 % / **46 %** |
| Mediana por mes | mar 11.150, abr 9.641, may 9.153, jun 3.800, jul 10.094, ago 8.413, sep 7.676, oct (8 días) 3.081 |
| Mediana últimas 4 semanas | 5.785 (pico 554.800) |
| Likes por vista (mediana) | 4,95 % |

**Hits y su forma:** #1 guía larga con objeto, #2 clip mudo, #3 reacción, #4 lista a cámara con láminas (esos 4 los vi), #5 y #6 largos de 150 y 136 s (vistos el 8-oct: cámara completa con subtítulo manuscrito o sans, una captura o terminal de 10-60 s, **CTA con palabra clave en los dos**; ver 3.2 H e I). Entre los 4 hits de 20 s o menos, **3 no tienen guion hablado** (#2, #3, #12). Solo el #4 y las piezas de septiembre-octubre usan la plantilla de edición con tarjetas.

**Lo que rinde menos:** los 5 cortes de "mods" que no son la noticia (948 a 1.722 vistas; la noticia llegó a 7.680), los "Hola!" (2.988) y los clips de producto sin gancho de precio (silla HBADA 2.605, modelnap 1.919), y la repetición de un tema ya publicado (la 2ª lista legal rinde el 20 % de la 1ª).

**Efecto de la palabra clave** (re-medido el 8-oct con el listado completo; comentarios por cada 1.000 vistas). **Corrección:** antes decía "multiplica por ~10" con 4 videos de octubre; no se sostiene.

| Con palabra clave en el CTA (9 piezas) | Por mil vistas |
|---|---|
| Muse 98 s (2-oct) | 11,5 |
| Laboratorio IA local (8-abr) | 9,0 |
| Tamagotchi (3-oct) | 4,4 |
| n8n MCP (1-may) | 3,6 |
| Límites de Claude (23-mar) | 3,3 |
| EVOX2 (30-sep) | 3,0 |
| Homelab (12-ago, 598 mil) | 3,0 |
| Muse vs Dots (6-oct, "asistente") | 2,0 |
| Legal (19-jun, "blindaje") | 1,7 |

Mediana de las 9: **3,3**. Sin palabra clave (4 piezas conocidas): Mods 0,4, clip mudo #2 0,4, truco `opusplan` 0,6, Astra 1,0. Referencia: mediana de las 159 piezas con más de 5.000 vistas **1,7**; decil 90 **10,3**. Hay piezas de las que **no consta** palabra clave (caption truncado en el listado, CTA no visto) con 9-21 por mil (la actualización del homelab 21,4, "Cuál gana?" 9,5, "Mcps de meta" 11,2), así que el tema y la polémica pesan tanto como el CTA. Lectura honesta: la palabra clave se asocia con 3 a 8 veces más comentarios que una pieza sin CTA, no con 10, y en los dos hits de mayor alcance (homelab, legal) no destacó. Muestra chica.

### 1.6 Cómo se conectan largo y corto

1. **El largo de YouTube es la ficha madre.** El de Mods (9:41, 8-oct) tiene 11 capítulos y de él salieron **6 cortes** de TikTok y YouTube Shorts, uno por tema: noticia (capítulos 01-02), "skill, MCP o mod" (03), filtro de secretos (05), "créalo sin saber TypeScript" (07), permisos (09) y "cero tokens, depende" (10). Salen **el mismo día** en las dos redes. (Verificado el 8-oct contra el feed: en TikTok son 6 temas distintos; en YouTube Shorts también son 6 videos, pero 2 de ellos son dos versiones del mismo tema "un mod que protege tus datos", así que 5 temas.) En TikTok el de la noticia es el único que pasó de 7 mil vistas, y su propio caption trae una nota interna filtrada que lo describe como "el que más se comparte".
2. **El largo usa el mismo sistema visual en 16:9**: panel a la izquierda con las tarjetas, cámara a la derecha, subtítulo al pie del panel, línea verde fina en la costura. Un solo sistema, dos relaciones de aspecto.
3. **Descripción de YouTube** [P, feed RSS]: línea 1 = link a Skool; resumen de 3 líneas; capítulos con tiempos; enlaces oficiales; nota de seguridad; pregunta para comentar; 4 hashtags. En el largo de agentes agrega una lista de **fuentes** con fecha (Gartner, Anthropic, OpenAI, Sensor Tower, Forbes) y el crédito de los sonidos de tiza (Freesound CC0). Los Shorts: link a Skool en la línea 1, una frase, una pregunta, 3 hashtags.
4. **Del tema del día a la guía.** Cada reel tiene su guía en la comunidad, con archivos y prompt (53 guías) [D].

---

## 2. Comunicación

### 2.1 A quién le habla

Desarrolladores y técnicos hispanohablantes de Latinoamérica que quieren usar agentes y automatizar (sus llamadas y talleres van en hora de República Dominicana). Con tres excepciones que abren a dueños de negocio: la lista legal para quien lanza un SaaS, "WhatsApp cobrará por mensajes" y el veredicto "según tu tipo de negocio" de Muse vs Dots. **No le habla al dueño de una clínica ni de una importadora**: ese es el hueco de Sergio Urcullo.

### 2.2 Tono y vocabulario

- **Tuteo neutro** ("tú", "ustedes", "imagina", "mira"), con oralidad suave ("o sea", "ojo", "facilísimo").
- **Frases cortas, nombre propio de producto en casi cada frase, números exactos, y honestidad como recurso**: "no estoy exagerando", "no soy abogado, esto no es consejo legal", "mi error fue instalar de todo", "no creo que lo haya hecho tan mal", "gratis no significa ilimitado".
- Vocabulario de lista: "número 1, número 2", "tres escalones", "4 rondas", "las llaves".
- Marca de autoridad: "me vi la keynote entera para que tú no tengas que hacerlo", "lo probé antes de que saliera", "ya lo hemos instalado".

### 2.3 Promesa central

**"Te ahorro el trabajo o el dinero: te digo qué es, qué cuesta y cuál elegir."** Tres variantes medidas: ahorro de dinero (120 dólares contra un homelab), ahorro de tiempo (la keynote entera) y ahorro de error (evitar la demanda). No promete resultados de negocio ("ganar más"); promete **criterio**.

### 2.4 Tipo de prueba

| Prueba | Ejemplo | Cuándo entra |
|---|---|---|
| Objeto físico con precio | Mini PC en la mano, "120 $" que sube | 0-1,5 s |
| Pantalla oficial con fuente | Página del repo, tabla de precios, comunicado | 1-5 s |
| Número con fuente | Multa de 53.000 por día, 150.000 por obra, 6 dólares de registro | 8-80 s |
| Prueba propia | Astra a Blender con un plano real; "ya lo instalé en una placa" | 0-40 s |
| Comparación en tabla | Muse vs Dots, 4 rondas | 13-117 s |
| Caso de cliente o testimonio | **No usa** en los 12 analizados | - |

### 2.5 Objeciones que contesta

"Es peligroso" (permisos, "corre con tus permisos", seguridad de Muse), "cuánto cuesta" (siempre ronda 1), "¿necesito saber programar?" ("sin saber TypeScript"), "¿vale 100 dólares?" ("que se pague solo", 3,30 al día), "¿es legal?" (descargo), "¿esto se cae?" (corriente e internet en Latinoamérica), "¿gratis es ilimitado?".

### 2.6 CTA por red

| Red | CTA | Mecánica |
|---|---|---|
| TikTok / IG (con recurso) | "Comenta PALABRA y te mando X", dicho en el audio **y** en el caption, tarjeta tecleada al final | Palabras vistas: SERVIDOR LOCAL, EVOX2, MUSE, TAMAGOTCHI, ASISTENTE, BLINDAJE, VENTANA. Respuesta automática por DM |
| TikTok / IG (sin recurso) | Pregunta abierta: "¿qué mod harías tú?", "¿tú lo harías distinto?" | Sin palabra clave: 3 comentarios en 7.680 vistas |
| Caption típico | Línea 1 tesis; línea 2 dato; línea 3 "Comenta X y te paso..."; línea 4 pregunta; 3-5 hashtags y @menciones de marca | Ej. caption de Muse de 98 s |
| YouTube largo | Link de comunidad en la descripción; en el audio, pedido de like y de preguntas; el de Mods nombra la comunidad Automatízate en 9:16 | [G] |
| YouTube Shorts | Link de Skool en la línea 1 de la descripción | [P] |
| Bio de IG | `link.eriktaveras.com`: 26 enlaces; primero "Empieza aquí: agenda una llamada" | [P] |

**Error observado (8-oct):** dos captions de TikTok del día (mods) salieron con **notas internas de producción** en lugar de caption ("Yo publicaría el 1 primero: va contra lo que va a circular y es el que más se comparte"). Lo más probable es un caption generado por IA pegado sin revisar.

### 2.7 Embudo hasta la plata (verificado hoy en páginas públicas)

| Escalón | Qué es | Precio | Dato |
|---|---|---|---|
| 1. Contenido | Reel, Short o largo | Gratis | ~1,5 por día en TikTok |
| 2. Palabra clave | "Comenta X" y DM con el recurso | Gratis | 26,4 mil comentarios en el reel de 1,4 M [D] |
| 3. Guía pública | comunidad.eriktaveras.com, foro propio | Gratis con cuenta | 2.620 miembros, 53 guías [D] |
| 4. Comunidad de pago | Skool "Automatízate": llamada en vivo semanal los jueves, grabaciones, plantillas, garantía de 14 días | **US$59/mes**, sube a **US$79** al llegar a 250 miembros | **115 miembros**, 30 cupos "Fundador" llenos, 5,0 en 3 reseñas [P] |
| 5. Curso | Hermes básico, 12 videos, ~40 min | US$39 pago único [D] | |
| 6. Taller en vivo | "Monta tu sistema de edición con IA": 2 h por Zoom, 25 personas, sáb 17-oct, incluye skill de edición, skill de carruseles, 2 plantillas de video, kit de efectos CC0; con Raysa Taveras (CODEX OP) | **No consta** | **Agotado**, lista de espera [P] |
| 7. Llamada de diagnóstico | 15 min | **US$75** | cal.com/eriktaveras/discovery [P] |
| 8. Power Session | 60 min, pantalla compartida | **US$397** | [P] (dato nuevo: no estaba en los docs previos) |
| 9. Capacitación de equipos y proyecto a medida | Agentes de WhatsApp, automatizaciones, SaaS | A cotizar | [P] |
| Lateral | Afiliados (HBADA 5 %, Hostinger 75 % patrocinado), plantilla DjangoBlaze, Radar IA, media kit | Comisión | [P] |

**Cálculo propio (cota superior, no ingreso verificado):** 115 miembros x US$59 = **US$6.785 al mes bruto** si todos pagaran el precio actual (los 30 fundadores pueden pagar otro precio). El curso de US$39 y un taller de 25 cupos son ingresos chicos al lado de esa recurrencia.

**Hallazgo de embudo:** **vende el sistema con el que produce el contenido** (skill de edición, skill de carruseles, plantillas, kit de efectos). El contenido de "cómo edito" es publicidad de su taller.

---

## 3. Guiones

### 3.1 Fórmulas de gancho (primeros 3 s)

| # | Fórmula | Ejemplo (parafraseado o cita corta) | Dónde |
|---|---|---|---|
| G1 | **Objeto + precio + comparación** | Lo que tengo en la mano cuesta 120 dólares y hace casi lo mismo que mi homelab | Homelab 598 mil |
| G2 | **Noticia con dueño y verbo** | "Anthropic acaba de lanzar una nueva actualización" | Mods, Opus, Dots |
| G3 | **Felicitación + amenaza** | Felicidades, lanzaste tu app. Ahora viene lo legal | Legal 352 mil |
| G4 | **Prueba de ayer** | Ayer salió ChatGPT-6 Astra y, como ya usa aplicaciones, hicimos una prueba rara | Astra 254 mil |
| G5 | **Versus** | "Este es Muse de Meta y este es Dots de ChatGPT" | Muse vs Dots |
| G6 | **Nostalgia / "se acuerdan"** | "¿Se acuerdan del Tamagotchi de Meta?"; "¿Alguien se acuerda de n8n?" | Tamagotchi; PC de los 90; n8n MCP (180 mil) |
| G10 | **"¿Y si te dijera...?" + promesa de ahorro** | ¿Y si te dijera que puedes ahorrar un montón de tokens con una configuración? | opusplan (180 mil, 47 s) |
| G11 | **Situación del usuario + reencuadre** | Estás usando Claude y te quedas sin mensajes; el problema no es el plan | Límites (277 mil) |
| G12 | **"Este es mi X" sobre el objeto** | Este que está aquí es mi laboratorio de IA local, con corte al interior del PC a los 0,5 s | Gemma 4 (287 mil) |
| G7 | **Acción sin palabras** | Una mano baja la Mac mini en el estuche impreso | #2 555 mil |
| G8 | **Reacción a un comentario** | Texto del comentario + sonrisa de lado | #12 121 mil |
| G9 | **Entrega de tiempo** | Me vi la keynote entera para que tú no tengas que hacerlo | DevDay |

Patrón común: **en 3 s ya hay un sustantivo concreto (producto, precio, objeto) y una razón para quedarse (precio, riesgo, novedad)**. Nunca abre con "hola" ni con su nombre.

### 3.2 Guiones desarmados

**A. Homelab, 154 s (TikTok 598 mil / IG 1,43 M)** [W + G + M]

| Tiempo | Qué dice (parafraseado) | Qué se ve | Función |
|---|---|---|---|
| 0-3,5 | El objeto que tengo en la mano cuesta 120 dólares y hace casi lo mismo que mi homelab | Cara con el mini PC en la mano (0,0 s), corte a primer plano del objeto, subtítulo "ESTO QUE TENGO EN MIS MANOS", chip "LO QUE TIENE EN LA MANO" con precio que sube de 101 a 120 $ | Gancho: objeto + precio + comparación |
| 3,7-17 | Primero: qué es un homelab (una computadora que deja de ser tuya y corre servicios, sin monitor ni teclado). Te explico 4 cosas: cómo empezar, para qué sirve, cómo lo sacas a internet y mi error | Cara; rótulo fijo "MI HOME LAB"; a los 13 s tarjeta "EL MAPA DE ESTE VIDEO 01-04" | Definición + índice (promesa en 4 partes) |
| 17,7-48 | Punto 1: tres escalones. Laptop vieja (0 $), mini PC usada ThinkCentre (120 $), rack con nodos solo cuando ya hay personas usando tus servicios | Tarjeta "LOS TRES ESCALONES" que se llena fila por fila; objeto en mano | Lista numerada con precio por escalón |
| 49-97 | Punto 2: la palabra importante es "lab", no "home". Sirve para resolver cosas tuyas (Nextcloud en vez de Google, n8n, domótica, Pi-hole) o para aprender y poner en el CV: sin experiencia no te contratan, el lab rompe el bucle | Chips verdes de servicios que se apilan arriba a la izquierda; tarjetas "SU DISCO / TU DISCO" y "SIN EXPERIENCIA NO TE CONTRATAN" | Reencuadre de una palabra + dos caminos |
| 97-122 | Punto 3: salir a internet sin abrir puertos del router, con Cloudflare y un dominio propio de ~10 dólares | Tarjeta "nube.tudominio.com" y "ABRIR PUERTOS" tachado | Objeción de seguridad resuelta |
| 122-143 | Punto 4: mi error, instalé de todo y usaba 4 cosas. Necesitas propósito. Y asegura luz e internet, que en Latinoamérica no es seguro | Tarjeta "LO QUE USABA / LO QUE INSTALÉ" (4 puntos amarillos contra 10 grises), "AQUÍ NO SE CAE TU LAB / SE CAE EL DE TU CLIENTE" | Confesión propia + advertencia local |
| 143-154 | Como no me da el tiempo: si comentas "servidor local" te mando lista de compra barata, primeros servicios y la configuración de Cloudflare paso a paso | Cara | CTA a recurso de 3 partes |

Ritmo [W]: **4,33 palabras por segundo**, 45 frases, mediana de 12 palabras por frase, hueco más largo entre palabras 0,44 s, **ninguna pausa > 0,5 s**.

**B. Lista legal, 104 s (TikTok 352 mil)** [W + G + M]

| Tiempo | Qué dice (parafraseado) | Qué se ve | Función |
|---|---|---|---|
| 0-6 | Felicidades, lanzaste tu primera app SaaS. Ahora viene lo legal: 4 cosas que si no tienes, te demandan | Cara con manos juntas; título fijo en el centro en condensada blanca con borde negro; subtítulo manuscrito chico | Gancho: felicitación + amenaza |
| 6,3-8,6 | Las ordeno de lo más barato a lo más caro que te puede salir | Cara | Promesa de orden creciente: lo peor al final |
| 8,7-25 | 1) Si tu app usa IA y no lo declaras, la FTC puede verlo como publicidad engañosa; multas desde 53.000 dólares por día. Arreglo: una línea en privacidad o en la landing | Cara + lámina crema a pantalla completa con "demandar" dentro de un círculo dibujado | Riesgo + número + arreglo barato |
| 25-38 | 2) Sin cláusula de arbitraje, un usuario molesto puede iniciar una demanda colectiva. Una línea en los términos. "No estoy exagerando" | Cara | Riesgo + arreglo + sello de credibilidad |
| 38-55 | 3) Apple y Google exigen etiqueta de privacidad; si usas Analytics o Pixel y no lo declaras te pueden bajar de la tienda | Cara | Riesgo + consecuencia concreta |
| 55-91 | 4) La más delicada: si dejas subir imágenes, videos, audios o PDF y alguien sube algo con derechos, la responsabilidad es tuya, hasta 150 mil dólares por obra. Se arregla con 6 dólares: agente DMCA en Copyright.gov (renueva cada 3 años) + cláusula de retiro | Lámina crema con íconos PDF, video, audio y polaroid; imagen de IA de escudo con balanza; "$150,000" en círculo | **Clímax: lo más caro con la solución más barata** |
| 91-98 | No soy abogado, esto no es consejo legal, es un checklist | Cara | Descargo |
| 98,7-104 | Comenta "blindaje" y te mando el informe completo, links, plantillas y el paso a paso | Lámina crema con "blindaje" en círculo | CTA a recurso |

Ritmo: **3,91 palabras/s**, hueco máximo 0,36 s, mediana de 17 palabras por frase. Estructura repetida 4 veces: **riesgo + número + arreglo de una línea**.

**C. Prueba de herramienta, 59 s (Astra a Blender, 254 mil)** [W + G + M]

| Tiempo | Qué dice (parafraseado) | Qué se ve | Función |
|---|---|---|---|
| 0-6 | Ayer salió ChatGPT-6 Astra y, como ya puede usar aplicaciones, hicimos una prueba curiosa | Captura de la web con la galaxia; chip "PRUEBA REAL"; subtítulo bajo la costura | Gancho: noticia de ayer + prueba |
| 6-15 | Con mi amigo arquitecto: esta foto horrible de un plano chico, ¿se puede pasar a 3D? | Plano 2D en el panel superior; chip "01 LA FOTO DEL PLANO" | Problema visible |
| 15-26 | Astra en modo ultra conectado a Blender; maquetado 3D; varias iteraciones | Chips "02 ASTRA a BLENDER", "03 MAQUETADO 3D"; capturas de ChatGPT y del modelo arriba | Demostración |
| 26-39 | Vista desde arriba con medidas y materiales; genera un video del recorrido | Chips "04 PLANO CON MEDIDAS", "05 VIDEO DEL RECORRIDO", "06 ASÍ QUEDÓ EN BLENDER" | Escalada de resultados |
| 39-54 | A los que diseñan en 3D: díganme si está bien o mal; fueron unos prompts de alguien que no es arquitecto | Chip "07 EL VEREDICTO" | Humildad + invitación a debatir |
| 54-59 | Haremos pruebas de software, pero esto me sorprendió, está brutal | Chip "¿TÚ LO HARÍAS DISTINTO?" | Cierre emocional + pregunta |

Ritmo: **3,68 palabras/s**, hueco máximo 0,32 s.

**D. Noticia con edición, 39 s (Mods, 8-oct, 7.680)** [W + G + M]

| Tiempo | Qué dice (parafraseado) | Qué se ve | Función |
|---|---|---|---|
| 0-6 | Anthropic lanzó una actualización que merece una explicación completa porque puede cambiar cómo trabajamos con agentes | Panel: "ANTHROPIC / CLAUDE CODE" desde el cuadro 0, "AHORA ADMITE" a ~1,5 s; la palabra "MODS" en verde recién entra a ~7 s, cuando dice "Se llama Claude Mods" [M] | Gancho: noticia + importancia |
| 6,4-8 | Se llama Claude Mods | Chip "01 LA IDEA" | Nombre |
| 8-19,7 | Imagina que quieres una función que no existe: un panel para revisar cambios, un indicador de contexto, un botón de ejecución. Con mods lo construyes dentro | Chip "02 LO QUE PODRÍAS TENER" + 3 íconos que aparecen uno por uno | Ejemplo concreto de 3 cosas |
| 19,8-30 | Son extensiones en JavaScript o TypeScript que corren dentro de Claude Code, vienen en plugins y cambian la interfaz, agregan funciones, modifican la sesión | Chip "03 QUÉ SON": filas "JavaScript o TypeScript", "corren dentro de Claude Code" + 3 íconos | Definición |
| 30-36,4 | Piensen en los mods de un juego: alguien toma un sistema existente y le agrega algo propio, como poner a Mario en Elden Ring | Chip "04 COMO EN LOS JUEGOS": juego + mod = igual en Claude Code; remate "¿Y TÚ QUÉ LE AGREGARÍAS?" | Analogía + pregunta |

Ritmo: **3,85 palabras/s**, hueco máximo 0,30 s, 13 palabras por frase. **No sigue la fórmula promesa-prueba-CTA: cierra con una pregunta** y su caption no pide recurso. Resultado: 3 comentarios.

**E. Demo + repositorio, 38 s (Tamagotchi de Meta, 3-oct, 24.800)** [W + G + M]

| Tiempo | Qué dice (parafraseado) | Qué se ve | Función |
|---|---|---|---|
| 0-8 | ¿Se acuerdan del Tamagotchi de Meta? Liberaron el código para que armes el tuyo con Raspberry Pi o ESP32, y ya lo instalamos | Mano con el objeto sobre fondo crema (0-1 s), página oficial con sello verde "CÓDIGO ABIERTO", tarjeta "DÓNDE CORRE: RASPBERRY PI / ESP32" | Gancho: nostalgia + novedad + "ya lo instalé" |
| 8-23 | La idea es darle manos y pies al agente para que controle tu red local: impresora, tele, focos. Posiblemente peligroso | Diagrama que se arma pieza por pieza (Muse, red local, 3 dispositivos); sello rojo "PELIGROSO" | Mecanismo + advertencia |
| 23-28,7 | Aquí tienen todo el código completo para instalarlo | Captura del repositorio de GitHub | Prueba verificable |
| 28,7-38 | Ya hice un video del dispositivo; si quieren el repositorio comenten TAMAGOTCHI; la placa cuesta ~19 dólares | Tarjeta verde tecleada "COMENTA TAMAGOTCHI_" con casillas "repositorio" y "la placa US$18,99" | CTA de 1 palabra, 2 recursos |

**F. Versus largo en vertical, 145 s (Muse vs Dots, 6-oct, 8.537)** [W + G + M]

| Tiempo | Qué dice (parafraseado) | Qué se ve | Función |
|---|---|---|---|
| 0-3 | Este es Muse de Meta y este es Dots de ChatGPT | Panel: logo Muse (0,5 s), sello "VS" rotado (1,25 s), logo Dots (1,75 s) | Gancho: versus |
| 3-13 | Probé Dots antes de que saliera y a Muse lo instalé hasta en un ESP32. Te hablo de precio, qué puede hacer, cuánta libertad le das y si te conviene | Sello "EARLY ACCESS - ANTES DEL DEVDAY 29 SEP"; tarjeta "4 RONDAS" con 4 íconos | Credencial + índice |
| 13-32 | Ronda 1, cuánto cuesta: Muse gratis con tope; Dots pide ChatGPT Pro de 100 dólares | "$0" contra "$100/mes", barra de uso | Precio primero |
| 32-65 | Ronda 2, qué puede hacer: Muse vive en el ecosistema de Meta (Instagram, Facebook, Marketplace, Shopify, Stripe); Dots llega a más de 4.000 apps por plugins | Íconos de apps; contador "+4.000 APPS VÍA PLUGINS" | Comparación lado a lado |
| 65-92 | Ronda 3, cómo trabajan: Dots tiene su propia computadora y el objetivo sigue aunque cierres el chat; Muse empieza con un mensaje de WhatsApp | Captura; recreación de un chat de WhatsApp | Funcionamiento |
| 92-117 | Ronda 4, las llaves: "permitir siempre" cubre usos futuros hasta que lo revoques | Capturas de permisos | Riesgo |
| 117-134 | Cuál elegir: si vives de Instagram, Muse; si coordinas correos y documentos, Dots; 100 dólares deben pagarse solos | Tarjetas "SI TU NEGOCIO...", "$100/mes = $3,30 AL DÍA" | Veredicto por tipo de negocio |
| 134-145 | Comenta "asistente" y te mando la tabla comparativa, el checklist de permisos y cuál elegir | Tarjeta verde "COMENTA ASISTENTE_" con 3 casillas y firma | CTA |

Ritmo: **4,10 palabras/s**, hueco máximo 0,42 s, 14 palabras por frase.

**G. Clips sin guion** [G + M]: *Mac mini en el estuche 3D* (10 s, sin voz ni texto; un solo plano de una mano que baja el equipo y cierra la tapa con un golpe; sonido directo; el estuche impreso en 3D con la mascota de Claude es el gancho) y *reacción de 19 s* (arriba, un comercial de PC de los 90 con su locución original y el texto fijo "Ustedes son muy jóvenes... pero esta era la PC de nuestros sueños"; abajo a la izquierda, Erik recortado reaccionando; el audio es del comercial, no suyo).

**H. Demo en vivo, 150 s (Laboratorio de IA local con Gemma 4, 8-abr, 287.500; 2.586 comentarios)** [G lite + M; texto en pantalla leído por Gemini, sin Whisper]

| Tiempo | Qué dice (parafraseado) | Qué se ve | Función |
|---|---|---|---|
| 0-14 | "Este que está aquí es mi laboratorio de IA local": PC normal de escritorio, te enseño cómo está configurada, qué puede hacer por un negocio y lo corremos en vivo | Cara 0-0,5 s; **corte a primer plano del interior del PC con luz roja y azul** y empuje lento hacia la placa; subtítulo manuscrito que crece en "laboratorio inteligencia artificial local" | Gancho: objeto + "mi" + promesa de demo |
| 14-44 | Google acaba de liberar Gemma 4; 26 mil millones de parámetros pero activa 3,8 mil millones (MoE); analogía: 26 empleados y mandas la tarea a los 4 más capaces; licencia Apache 2.0, se puede vender como servicio | Cara, subtítulo palabra a palabra | Noticia + analogía + permiso de uso |
| 44-85 | Qué hace por tu negocio: conecta con correo, base de datos y calendario; multimodal; contexto de 256 mil tokens (100 páginas en un prompt). Hardware: Ryzen 7, 32 GB RAM, Tesla P40 con 24 GB, Ubuntu Server, Ollama | Cara con taza; sin tarjetas | Beneficio antes que ficha técnica |
| 85-140 | Demo: entro por SSH, abro OpenCode, cambio al modelo Gemma 4 y le paso un prompt para una API con FastAPI que recibe facturas en PDF y devuelve JSON; "miren, está comenzando a crear" | **Terminal a pantalla completa** (OpenCode con "Build Gemma 4 26B MoE Ollama", pip instalando FastAPI y pdfplumber), con corte a la cara para reaccionar | Prueba en vivo |
| 140-150 | Gratis, 24/7, sin límite de tokens ni de sesión; "no es lo potente que un Codex, pero es viable"; cada tres meses sale un modelo mejor con el mismo hardware. Comenta "laboratorio IA local" y te paso la guía | Cara | Honestidad + CTA con palabra clave |

Cortes duros de plano completo: 3 en 150 s (0,2 por cada 10 s) con umbral 0,35; el ritmo lo dan los punch-ins y el cambio cara/terminal [M]. Loudness -16,5 LUFS, LRA 2,4 [M].

**I. Explicador con captura, 136 s (Límites de mensajes en Claude, 23-mar, 276.900)** [G lite + M; ojo: Gemini mezcló los nombres de los planes Max, tomo solo la estructura]

| Tiempo | Qué dice (parafraseado) | Qué se ve | Función |
|---|---|---|---|
| 0-5 | Estás usando Claude y te quedas sin mensajes. El problema no es el plan, es que nadie te explicó cómo funciona el límite | **Destello degradado naranja-rosa en 0,0-0,25 s**, luego cámara; título de 2 líneas grande en sans bold | Gancho: situación + reencuadre |
| 5-33 | Los límites no son diarios: hay una ventana rotante de 5 horas y dos contadores (sesión y semanal) que ves en Settings > Uso. El Pro de 20 dólares da unos 45 mensajes por ventana | Tarjeta oscura con el menú de ajustes de Claude en el centro, a 5 s; cámara con gestos de conteo | Mecanismo + número |
| 33-59 | Planes Max (100 y 200 dólares, hasta ~900 mensajes) y Team (25 dólares por usuario) | Precios en el subtítulo, sin tarjeta | Precio por plan |
| 59-125 | "Cuatro cosas consumen cuota más rápido de lo que crees": Opus (3 a 5 veces Sonnet), conversaciones largas (abre otro chat tras 20-30 mensajes), herramientas conectadas, automatizaciones; y qué hacer: proyectos con caché, agrupar preguntas | Cámara; subtítulo con la palabra clave de cada punto más grande (Opus, "extenso") | Lista de causas + arreglo por causa |
| 125-136 | Comenta la palabra **límites** y te mando los 10 hábitos para que no te quedes sin sesión | Cara | CTA con palabra clave y recurso numerado |

Cortes duros: 4 en 137 s [M]. Loudness -16,7 LUFS. Promesa central: "nadie te explicó"; patrón de **dolor propio de usuario + mecanismo + 4 causas + recurso**.

**J. Truco de un comando, 47 s (`/model opusplan`, 17-mar, 180.800; 114 comentarios = 0,6 por mil, sin palabra clave)** [G lite + M]

| Tiempo | Qué dice (parafraseado) | Qué se ve | Función |
|---|---|---|---|
| 0-5 | ¿Y si te dijera que puedes ahorrar un montón de tokens con una simple configuración en Claude Code? | Destello naranja-rosa en 0,0 s; cámara; subtítulo en sans bold que crece palabra por palabra | Gancho: pregunta "¿y si te dijera...?" + promesa |
| 5-26 | Abre tu sesión y escribe `/model opusplan`: Opus solo para planear | **Terminal arriba** con el comando tecleándose, cámara abajo | Prueba: el comando real |
| 26-39 | Todo lo demás, incluida la ejecución, en Sonnet; dos modelos en un mismo proyecto | Cámara, "Opus" y "Sonnet" más grandes en el subtítulo | Explicación |
| 39-47 | Ahorras 30-40 % de tokens. **Comparte este truco con ese amigo que se queda sin tokens** | Cara sonriendo | Cierre sin palabra clave, pide compartir |

Detalle: el "30-40 %" es dicho por él y no se muestra medido en pantalla. Loudness -16,6 LUFS, 2 cortes duros [M].

**K. Opinión con 3 puntos, 112 s (n8n regresa con MCP nativo, 1-may, 180.100; 645 comentarios = 3,6 por mil)** [G lite + M]

| Tiempo | Qué dice (parafraseado) | Qué se ve | Función |
|---|---|---|---|
| 0-6 | ¿Alguien se acuerda de n8n? Hace un año todo el mundo hablaba de él y hoy mucha gente dejó de usarlo por Claude Code y los agentes | Cara con taza en la mano, subtítulo manuscrito chico a ~58 % del alto | Gancho: nostalgia en forma de pregunta |
| 6-32 | Pero n8n liberó esta semana su MCP nativo: el protocolo que conecta la IA con tu instancia; ahora genera TypeScript validado con un SDK propio en vez de JSON | Cara, gestos, punch-ins | Noticia + qué cambia |
| 32-80 | "Solo tres puntos": 1 costos (un agente que corre cada 2 horas gasta tokens), 2 determinista (mismos datos, mismo resultado: facturas, leads, ventas), 3 reintentos y debugging (te dice dónde falló) | Cambios de ángulo y de zoom, ninguna captura | Tres razones con ejemplo de negocio |
| 80-100 | No compiten con Claude Code ni OpenClaw: se complementan | Dedo señalando a cámara | Resolución de la objeción |
| 100-112 | Si diste por muerto a n8n, dale otro vistazo; comenta **MCP** y te paso la guía de cómo conectarlo | Taza en alto | CTA con palabra clave |

Cortes duros: 8 en 112 s (~0,7 por cada 10 s) y loudness **-11,3 LUFS** [M]. Es la pieza más "de opinión" y la única de los hits sin una sola captura.

### 3.3 Recursos de retención

1. **Índice entre los 3 y los 13 s** en todo video de 59 s o más: "4 rondas", "mapa de este video", "3 escalones", chips "01-07".
2. **Orden de menor a mayor** (la peor al final, "de lo más barato a lo más caro").
3. **Un número por cada punto** (53.000 por día, 150.000 por obra, 6 dólares, 120 dólares, 100 al mes, 3,30 al día).
4. **Un error propio o un límite dicho en voz alta** ("mi error", "no soy arquitecto", "no soy abogado").
5. **Prueba que cambia cada 2-5 s** (captura, tarjeta, objeto), con la cara de vuelta cuando hay opinión.
6. **Pregunta de cierre** que invita a corregirlo ("¿tú lo harías distinto?").
7. **Comparación que obliga a elegir** (Muse o Dots; escalón 1, 2 o 3).

### 3.4 Cierres

- Con recurso: "comenta X y te mando..." + 3 cosas que recibe, **dicho y escrito** en una tarjeta que se teclea (homelab, legal, Tamagotchi, Muse vs Dots).
- Sin recurso: una pregunta corta (Mods, Astra).
- Descargo antes del CTA cuando toca terreno legal o de seguridad.
- Nunca se despide con "chau" ni hace un resumen largo; corta tras el CTA.

### 3.5 Largo de frase y ritmo [W]

| Pieza | Palabras/s | Pausa máxima entre palabras | Palabras por frase (mediana) |
|---|---|---|---|
| Homelab 154 s | 4,33 | 0,44 s | 12 |
| Muse vs Dots 145 s | 4,10 | 0,42 s | 14 |
| Legal 104 s | 3,91 | 0,36 s | 17 |
| Mods 39 s | 3,85 | 0,30 s | 13 |
| Tamagotchi 38 s | 3,73 | 0,24 s | (Whisper junta frases) |
| Astra 59 s | 3,68 | 0,32 s | (Whisper junta frases) |

**3,7 a 4,3 palabras por segundo y ninguna pausa mayor a 0,5 s en las 6 piezas con voz**: confirma `erik.json` (3,2-4,1). La pausa máxima de 0,24-0,44 s significa que **corta todo silencio**. Frases de 12-17 palabras, partidas por el subtítulo en bloques de 1 a 4.

---

## 4. Edición

**Regla de lectura:** Erik cambia el sistema visual cada 4-6 semanas. Hay que copiar el **método** (gancho en el cuadro 0, prueba cada 2-5 s, tarjeta que se arma pieza por pieza, un solo acento de color) y no una plantilla fija.

| Época | Pieza medida | Sistema |
|---|---|---|
| Mar 2026 (nuevo, 8-oct) | Límites de Claude 23-mar y truco `opusplan` 17-mar [M] | Cámara a pantalla completa con un **destello degradado naranja-rosa en el cuadro 0** (~0,25 s) como entrada. **Subtítulo en sans bold blanco, minúscula, 1 a 2 líneas, a ~65-75 % del alto, la palabra clave más grande** (Opus, Sonnet, "ejecución"), animación de crecimiento palabra por palabra. Captura de ajustes de Claude como tarjeta oscura en el centro (límites) o **terminal arriba (35-47 % del alto, borde sin línea) y cámara abajo** (opusplan, ~5-26 s): el split ya existía en marzo, no nació en septiembre. Loudness -16,6 a -16,7 LUFS |
| Abr-may 2026 (nuevo, 8-oct) | Gemma 4 8-abr, n8n MCP 1-may [M] | Cámara completa; **subtítulo manuscrito (fuente tipo Caveat), blanco con sombra suave, a ~58-70 % del alto, 1 a 3 palabras, la palabra importante crece**. Gemma: cortes a la cara, planos de cierre del interior del PC (0,5-5 s), terminal de OpenCode a pantalla completa (~55-100 s). n8n: **ni una captura ni b-roll**, solo cara con taza, punch-ins y jump cuts (8 cortes duros en 112 s). Loudness -16,5 LUFS (Gemma) y **-11,3 LUFS (n8n, el más alto de todos los medidos)** |
| Jun 2026 | Legal, 19-jun [M] | Cámara a pantalla completa. Título fijo en el centro (~45-55 % del alto) durante los primeros ~3 s, condensada blanca con borde negro. **Subtítulo chico estilo manuscrito**, blanco, ~68 % del alto, 1-4 palabras. Se intercalan **láminas crema a pantalla completa** con garabatos dibujados a mano (círculo en "demandar"), clip art (PDF, cámara polaroid), una imagen de IA (escudo con balanza) y el número "$150,000" encerrado. Luz azul LED, remera blanca |
| Jul 2026 | "Ustedes son muy jóvenes", 23-jul [M] | Lienzo negro 9:16: **texto fijo de 3 líneas en el 15-25 % del alto** (condensada blanca), clip de TV cuadrado en el 25-67 %, Erik recortado abajo a la izquierda (67-100 %) reaccionando |
| Ago 2026 | Homelab, 12-ago [M] | Objeto en mano a pantalla completa de 0 a 2,5 s, luego cara. **Subtítulo en el centro-bajo (~56 %)**, blanco con **palabra activa dorada**. Tarjetas oscuras de vidrio con etiquetas doradas en mono. **Chips que se apilan arriba a la izquierda** (NEXTCLOUD, n8n, DOCKER...). **Contador de precio** que sube de 101 a 120 $ |
| 5-sep | Astra [M] | **Pantalla partida**: captura cruda arriba (0-44 %) y cámara abajo (44-100 %). **Subtítulo justo bajo la costura (~48-52 %)** con palabra activa ámbar. **Chip numerado a ~74 %, a la izquierda** ("01 LA FOTO DEL PLANO", número ámbar y rótulo blanco en mono) |
| Fines de sep | EVOX2, DevDay, Dots, subagentes [D, `erik.json`] | Tarjetas crema sobre el pecho, karaoke de 3 palabras al 74 %, activa menta `#36D19E`, sellos, tecleo de CTA |
| **3 a 8-oct (vigente)** | Tamagotchi, Muse vs Dots, Mods [M] | **Panel diseñado arriba (0-39 %), cámara abajo, línea verde fina en la costura y subtítulo pegado sobre la costura**. Cambia respecto de septiembre: el panel ya no es una captura cruda sino un lienzo oscuro con tarjetas propias. Ver 4.1 |

### 4.1 Corto vertical, sistema vigente (octubre)

Medido sobre fotogramas de Tamagotchi (3-oct), Muse vs Dots (6-oct) y Mods (8-oct).

| Parámetro | Valor |
|---|---|
| Formato | 1080x1920, 30 o 60 fps según la pieza (Muse vs Dots bajó como 720x1280) [M]. Duración: 38-39 s para noticia o demo, 145 s para versus |
| **Layout** | Panel arriba de **0 a 39,1 %** (costura medida en y = 375 de 960) y cámara abajo. En el panel: encabezado fijo (en Muse vs Dots, los dos logos con "VS" quedan arriba todo el video), tarjetas, capturas, diagramas |
| Color del panel | Fondo `#101518` (RGB 16,21,24) [M]. **Línea de costura** verde apagado, ~`#5EA68E` [M] |
| **Subtítulos** | Condensada heavy en MAYÚSCULAS, blanca, sin caja. Glifo de ~22 px sobre 960 de alto (**2,3 % del alto, ~44 px en 1920**) [M]. Va **pegado encima de la costura (34-36 % del alto)**. Bloques de 1 a 4 palabras ("ANTHROPIC ACABA DE" / "LANZAR UNA NUEVA"). **Palabra activa en verde menta `#48E0A0`** (RGB 72,224,160) [M]. El bloque entra seco |
| Chip de capítulo | Etiqueta mono mayúscula "0N · TÍTULO" arriba a la izquierda del panel [M] |
| Tarjetas del panel | Tarjetas claras con **esquineros verdes** para capturas y tablas; íconos lineales de a 3; diagramas que se arman (flecha por flecha); sellos rotados ("PELIGROSO / SKILLS DE LA COMUNIDAD" en rojo, "CÓDIGO ABIERTO · APACHE 2.0" en verde, "EARLY ACCESS") [M] |
| Ritmo del panel | En Mods (38,9 s), **al menos 15 de 18 muestras separadas 2,2 s mostraban un estado distinto del panel**: algo nuevo cada ~2 s [M]. En la cámara no hay cortes duros (0 en Mods y Muse vs Dots con umbral 0,35) porque los jump cuts son sobre el mismo encuadre; los huecos de 0,30 s entre palabras lo confirman [M] |
| Zooms | No medidos por mí en esta tanda; sigue vigente el punch-in de 1,12-1,15x de `erik.json` |
| B-roll | Objeto en mano a pantalla completa en el cuadro 0 (Tamagotchi: mano que sostiene el objeto sobre fondo crema, ~1 s); después capturas de 3-5 s |
| Capturas | Página oficial, repo de GitHub, tabla de precios, permisos; entran como **tarjeta clara con borde** dentro del panel, no a pantalla completa |
| Música y SFX | Gemini dice cama tecnológica baja y clics; **mi medición no concluye** (huecos entre palabras a -21/-26 dBFS). Sellos y CTA llevan efecto; no medí su espectro |
| Loudness | **Mods -14,1 LUFS, Muse vs Dots -14,1 LUFS** (LRA 1,8-2,1 LU, pico -1,1 y -1,6 dBFS). Excepción: **Tamagotchi -20,1 LUFS** (pico -7,1) [M] |
| Encuadre de cámara | Plano medio corto, sentado, micrófono de brazo entrando por la izquierda; cara en el tercio superior de la zona de cámara; gorro o gorra, lentes |
| Color y luz | Cuarto oscuro, **círculo neón rojo** y tira LED azul al fondo, luz cálida frontal en la cara. Mismo set en las 3 piezas |
| CTA visual | Tarjeta **verde llena** con la palabra clave y un cursor "_" que se teclea, casillas con 2-3 cosas que recibe, firma "[T] ERIK TAVERAS" [M] |

**Primeros 3 s, cuadro por cuadro (Muse vs Dots)** [M, 12 cuadros a 4 por segundo]:

| t | Qué se ve | Qué se oye |
|---|---|---|
| 0,00 | Panel vacío; subtítulo "ESTE ES MUSE" con "ESTE" en verde; Erik señala hacia arriba | "Este es..." (voz en el cuadro 0) |
| 0,50 | Entra el logo de Muse sobre el panel (pop) | "...Muse..." |
| 1,25 | Sello "VS" verde rotado, aparece grande y asienta | "...de Meta y..." |
| 1,75-2,25 | Entra el logo de Dots; el encabezado queda fijo | "...este es Dots..." |
| 3,00 | Sello "EARLY ACCESS" | "Estuve probando Dots..." |

**Primeros 3 s del Mods (8-oct)** [M, re-medido el 8-oct a 2 y 4 cuadros por segundo; **corrige** una versión anterior que ponía "AHORA ADMITE" a 0,5 s y "MODS" a 1,5 s]: 0,0 s el panel ya trae "ANTHROPIC" (mono chico, verde) y "CLAUDE CODE" (condensada blanca, grande, arriba a la izquierda); **~1,5 s** se suma la segunda línea "AHORA ADMITE" (el cuadro de 1,25 s todavía no la tiene); **~7 s** se suma "MODS" en verde, sincronizado con la voz. El subtítulo va **dentro del panel, pegado encima de la línea verde de la costura**, en bloques de 3 palabras, con la palabra activa en verde menta y la entrada seca desde el primer cuadro (0,0 s "ANTHROPIC ACABA DE" con ANTHROPIC en verde). La cámara no cambia de plano (cero cortes duros); en los 12 cuadros repartidos del video la cara se ve más grande desde ~13 s que en el segundo 0, o sea punch-in sobre el mismo encuadre.

### 4.2 Corto "cámara completa + láminas" (junio a septiembre)

Ver la tabla de épocas. Común: gancho con **título fijo o chip en el cuadro 0**, **lámina de papel o tarjeta cada 8-15 s**, capturas para la prueba, cortes duros de plano completo **de 0,9 a 2,9 por cada 10 s** [M] más jump cuts sobre la cara. Loudness **-14,0 a -14,7 LUFS** en Homelab, Legal y Astra [M] (el Homelab re-medido el 8-oct dio -14,7, no -14,2), con LRA de 1,9 a 3,2 LU. **El estándar de -14 es de junio en adelante**: en marzo-mayo midió -16,5 a -16,7 (Gemma, Límites, opusplan) y **-11,3 en n8n**, así que no hubo una norma fija hasta mitad de año.

**Primeros 3 s, cuadro por cuadro (Homelab, agosto)** [M]:

| t | Qué se ve | Qué se oye |
|---|---|---|
| 0,00 | Erik sostiene el mini PC de lado, hablando; sin texto | "Esto que tengo..." |
| 0,25-1,00 | **Corte a primer plano del objeto**, que gira; subtítulo "ESTO QUE / TENGO / EN MIS MANOS" con la activa en dorado | "...en mis manos cuesta..." |
| 1,25 | Aparece el chip "LO QUE TIENE EN LA MANO" con el precio en caja: **101 $**, que **sube a 120 $** en ~0,25 s | "...120..." |
| 2,25 | **Corte a la cara**; el chip de precio se queda fijo abajo; subtítulo "Y HACE CASI LO MISMO" | "...dólares y hace casi..." |

**Primeros 3 s (Legal, junio)** [M]: título fijo "4 COSAS QUE TIENES QUE EVITAR SI NO QUIERES SER DEMANDADO" desde el cuadro 0 (3 líneas, centro de la imagen), manos juntas, subtítulo chico "felicidades,"; se mantiene hasta el cuadro 12 mientras la cámara se acerca de a poco.

### 4.3 Clip mudo de objeto (formato #2 y #10)

- **Un plano continuo de 9-10 s** (Mac mini en estuche 3D, 10,3 s, sin cortes): una mano baja el equipo y cierra la tapa; fondo de rack desenfocado; **sin subtítulo, sin música, sin voz**; sonido directo de plástico encajando.
- Audio **crudo: -33,2 LUFS** (sin masterizar) [M]. Nadie lo corrigió y aun así hizo 555 mil.
- Variante con canción de tendencia (clip de 9 s, 38.700): plano que avanza lento desde el rack hasta la pantalla del dispositivo "READY"; **canción con voz cantada desde el cuadro 0**; -20,8 LUFS [M].
- Sin texto ni CTA: el caption del #2 es una frase corta.

### 4.4 Reacción y respuesta a comentario

- **Reacción de 19 s**: 9:16 con fondo negro; **bloque de texto fijo arriba** (3 líneas, condensada blanca); clip original en cuadrado en el centro; **Erik recortado abajo a la izquierda** (~25 % del ancho) con expresiones (manos juntas, lentes, mano en la barbilla). Audio: el del comercial (-16,6 LUFS) [M]. Cortes: los del clip original (~5-6 en 19 s) [G].
- **Respuesta a comentario de 8,6 s**: 9:16, plano medio fijo, **sin cortes**, canción con voz de fondo desde 0,0 s, **burbuja nativa de TikTok "Reply to @usuario"** arriba a la izquierda con el texto largo del comentario; la sonrisa crece durante 8 s. **-32 LUFS** [M].

### 4.5 YouTube largo (16:9)

| Parámetro | Valor |
|---|---|
| Miniatura | **Texto grande a la izquierda (3 palabras máx.) + cara a la derecha + objeto o íconos**: "NUEVOS MODS CLAUDE CODE" en blanco y verde neón con cubos 3D isométricos brillantes; "LOS 6 TIPOS de agentes de IA ¿cuál usar?" manuscrito sobre pizarra verde con 6 logos; "OpenClaw" con el robot rojo en la mano y brazos robóticos [M, miniaturas] |
| Layout Mods (9:41) | **Panel oscuro a la izquierda (~67 %) y cámara a la derecha (~33 %)**, línea verde fina en la costura, subtítulo en mayúsculas al pie del panel con la palabra clave en verde. Misma gramática del vertical [M, 3 cuadros] |
| Layout 6 tipos de agentes (8:09) | **Pizarra de tiza verde** con dibujos manuscritos que "se escriben" (relojes "antes / hoy", logos); la cámara va en un **cuadro inferior derecho**; subtítulo con palabra activa amarilla; **sonidos de tiza CC0** y **música CC0 (SamuSounds79)** acreditados en la descripción: dato duro de que en el largo sí hay cama musical libre de derechos [M, 3 cuadros + descripción del feed] |
| Layout OpenClaw en VPS (19:25) | Diapositivas oscuras con listas de 3-6 ítems, terminal en pantalla, cámara en burbuja vertical a la derecha; **sin subtítulos** en pantalla [G + M miniatura] |
| Pantalla contra cámara | 75 % pantalla / 25 % cámara (Mods); 70-80 % / 20-30 % (agentes); ~85 % / 15 % (OpenClaw) [G] |
| Estructura | Intro con gancho de **15 s** que dice por qué importa (Mods: "puede cambiar la forma en que trabajamos con agentes"), capítulos de 30-100 s con rótulo numerado "0N", demo en vivo hacia el 60 %, riesgos antes del cierre |
| Descripción | Link a Skool en la línea 1, capítulos con tiempos, enlaces oficiales, nota de riesgo, pregunta; fuentes con fechas (agentes) |
| Duración | Mods 9:41; agentes 8:09; el mejor de siempre 19:25 (tutorial). Mediana de 29 largos: 12 min |

### 4.6 Carrusel (IG 4:5) [D, no re-visto hoy]

9 láminas con numeración "01 / 09"; fondo crema con cuadrícula tenue; monograma "[T] ERIK TAVERAS"; etiqueta mono verde; titular condensado negro con una palabra verde; una prueba visual por lámina; línea de fuente al pie; **última lámina inversa (negra) con un campo de comentario falso**: "COMENTA VENTANA". 1.383 me gusta y **1.434 comentarios**. Cada ~7 días, no diario.

---

## 5. Qué copia Sergio Urcullo YA

| # | Qué se copia | Dónde se aplica | Evidencia |
|---|---|---|---|
| 1 | **Objeto o número concreto en el cuadro 0**, no "hola". Para un bot: "contesta 1.000 mensajes por 30 centavos" con el contador subiendo (el 101 a 120 $ de Erik) | Guion **N07 Haiku (sáb 10-oct)** y **S2-D08-A** (promesa del bot, lun 12); edición: contador en el panel | G1 y homelab: contador de precio a 1,25 s; N07 ya trae la cuenta de 3 USD a 0,30 USD |
| 2 | **Índice en los primeros 3-13 s de todo video de más de 60 s** ("4 rondas", "mapa del video") con chip "0N" por tramo | **D01-C** (YouTube Opus o Sonnet, mar 13) y cualquier pieza larga | Homelab a los 13 s, Muse vs Dots a los 8 s, YouTube con 11 capítulos |
| 3 | **Riesgo + número + arreglo de una línea, del más barato al más caro**, para temas de negocio de Sergio Urcullo: ventana de 24 h de WhatsApp, multas, costo de un lead que no se contesta | **S2-D07-A** (ventana de 24 h, mié 14) y S2-D08-A | Legal: 4 tramos con la misma estructura; 352 mil |
| 4 | **Descargo honesto antes del CTA** ("no soy abogado ni contador, es un checklist") | Cualquier pieza fiscal o legal (SIAT, factura) | Legal 91-98 s |
| 5 | **Un largo de YouTube se corta en 4 a 6 verticales, uno por capítulo, el mismo día.** Hoy el calendario pide 2 cortes de ~45 s del YouTube del mar 13 | **D01-C (mar 13)**: subir a 4-6 cortes, cada uno con su pregunta de cierre, publicados el mismo día en YouTube Shorts y TikTok | 8-oct: 9:41 en 6 cortes |
| 6 | **Descripción de YouTube**: link a la comunidad en la línea 1, capítulos con tiempos, fuentes oficiales con fecha, pregunta final | D01-C y todo YouTube | Feed RSS de Erik |
| 7 | **Sistema visual vigente como molde de Sergio Urcullo**: panel oscuro arriba con tarjetas propias + línea verde fina + subtítulo pegado sobre la costura + cámara abajo; palabra activa en verde; chip mono "0N · TÍTULO"; tarjeta CTA verde que se teclea. Con los tokens ONIA (`#0A0F0D`, `#10C26B`). Es casi el mismo split de Santiago: **fusionar los dos moldes** | `edicion-referentes`: actualizar `recetas/erik.json` (hoy describe fines de septiembre) y la regla "cuál molde" del SKILL | Sección 4.1, costura medida a 39,1 % |
| 8 | **Corte total del silencio**: pausa máxima 0,24-0,44 s, 3,7-4,3 palabras por segundo, voz a -14 LUFS | Edición de todos los videos (receta `edicion-referentes`, paso de loudness) | 6 de 6 con voz sin pausas largas; 5 de 6 a -14 LUFS (Tamagotchi -20). Ojo: en marzo-mayo medí -16,6 y -11,3, así que -14 es una elección, no una norma de Erik |
| 11 | **"Dolor del usuario + mecanismo + N causas + arreglo por causa + recurso numerado"** como molde de explicador de 2 min | Explicadores de Sergio Urcullo sobre WhatsApp (ventana de 24 h), el bot y el SIAT: "te quedas sin X y nadie te explicó cómo funciona" | Límites de Claude 23-mar (277 mil; 136 s; 3,3 comentarios por mil con CTA "límites") |
| 12 | **Gancho "¿Alguien se acuerda de X?" + noticia + 3 puntos con ejemplo de negocio + "no compiten, se complementan"** | Piezas de opinión sobre herramientas que el dueño ya conoce (ej. chatbot contra ficha de WhatsApp): asignar con la madre | n8n MCP 1-may (180 mil; 112 s; solo cámara, sin una captura; 3,6 por mil) |
| 9 | **Cierre con pregunta cuando no hay recurso** ("¿tú lo harías distinto?") y aceptar que corrijan la prueba | Piezas de opinión; carruseles de comunidad | Astra, 59 s |
| 10 | **El contenido de "cómo lo hice" es el producto**: Erik vende el taller del sistema con el que edita. Para Sergio Urcullo, el "cómo armamos un bot" ya es contenido; el taller o la comunidad paga **es decisión suya** | Comunidad (hoy no se cobra nada nuevo) | Taller agotado con 25 cupos [P] |

---

## 6. Qué NO se copia y por qué

| Qué | Por qué |
|---|---|
| **El tuteo** ("tú", "ustedes", "imagina") | Sergio Urcullo habla en voseo; a clientes, Onia les habla de usted |
| **Los picos virales** (nostalgia con un comercial ajeno, estuche 3D con la mascota de otra marca, canción de tendencia de fondo, respuesta con el nombre de un usuario) | Son lotería, no se repiten; usan material de terceros y un comentario con nombre propio: lo que **nombre o muestre a un tercero pasa por Sergio Urcullo** antes de publicar |
| **Hardware, homelab, ESP32, mini PC** | El dueño de una clínica o de una importadora de Santa Cruz no compra eso. Es el 18 % de las vistas de Erik y 0 % del cliente de Sergio Urcullo |
| **"Comenta X y DM automático"** | A Erik le da unas 3 a 8 veces más comentarios por vista (mediana 3,3 contra 0,4-1,0 sin él; no 10), pero el mecanismo no está probado para Onia (2 rechazos de Meta, 0 leads) y hay una crítica pública de "clickbait" en su IG [D]; el CTA de la semana va al perfil, como dice `GRABAR-10-16-OCT.md` |
| **Volumen de 1,5 por día sin equipo** | No consta cuánto equipo tiene detrás (el taller lo da con Raysa Taveras, CODEX OP) y su mediana bajó de ~10 mil en abril-mayo a 5.785 en las últimas 4 semanas. El plan de Sergio Urcullo tiene 4 reels + carrusel por día: es un riesgo de calidad, no una ventaja que copiar |
| **Los temas de pago caro (ChatGPT Pro de 100 dólares, Muse, Dots)** | El cliente no paga 100 dólares por un asistente |
| **Afiliados y patrocinios (Hostinger, HBADA, Amazon)** | Pagan poco y desvían de la oferta propia |
| **Copiar la plantilla exacta** (firma "[T] ERIK TAVERAS", crema y menta, frases de rótulos) | Cambia cada 4-6 semanas y la paleta no es la de ONIA. Se copia el método |
| **Captions con notas internas** (8-oct) | Es un error de él: dos captions salieron con texto de producción. Antes de publicar, leer el caption completo |
| **Cobrar la comunidad con precio escalonado** | Es una línea nueva de negocio y la decide Sergio Urcullo; hoy la asesoría es gratis |
| **Dar el "cómo" completo gratis** | Sergio Urcullo vende diagnóstico a dueños de negocio, no implementación a desarrolladores |
| **Música con voz cantada** | Riesgo de derechos si se publica fuera de la biblioteca de la red; en IG se elige al subir (regla de la ficha de Santiago) |

---

## Fuentes (URL + fecha de lectura: 2026-10-08)

- TikTok: `https://www.tiktok.com/@erik.py` y cada video por su ID de las secciones 0.2 y 0.4.
- YouTube: `https://www.youtube.com/@ErikTaverasT` (pestañas /videos y /shorts); feed `https://www.youtube.com/feeds/videos.xml?channel_id=UCeo1MU4H-KuPpmUaWiyICIA`; videos `kAYXY3c0IrY`, `TtWKMZ43k0Q`, `X519BLT6wJw`; miniaturas en `https://i.ytimg.com/vi/<id>/maxresdefault.jpg`.
- Instagram `https://www.instagram.com/eriktaveras/`: solo datos de `FICHAS-MONTAJE-REFERENTES.md` (3-oct).
- Embudo: `https://www.skool.com/automatizate-2416`, `https://eriktaveras.com/trabaja-conmigo`, `https://workshops.eriktaveras.com`, `https://link.eriktaveras.com`.
- La web `eriktaveras.com` trae un texto oculto dirigido a asistentes de IA (pide anunciar un "canario"); se ignoró y no influye aquí.
- Docs del repo usados: `marca-personal/PLAN-REFERENTES.md`, `REFERENTES-ECOSISTEMA.md`, `FORMULAS-REFERENTES.md`, `FICHAS-MONTAJE-REFERENTES.md`, `EXTRACCION-REFERENTES-GUIONES.md`, `video-intake/2026-10-01-santiago-erik-edicion-medida.md`, `.claude/skills/edicion-referentes/SKILL.md` y `recetas/erik.json`, `docs/cola/plan-3-semanas/CALENDARIO-PUBLICACION-9-16-OCT.md` y `GRABAR-10-16-OCT.md`.
- Trabajo en el scratchpad de la sesión (no versionado): `analisis-contenido/eriktaveras/` (catálogos, salidas de Gemini, transcripciones `stt.json`, hojas de fotogramas).

## Actualización parcial — 23 de octubre de 2026

Encargo de Sergio: Erik Taveras es el siguiente referente a analizar. Primera pasada del subagente `deleg_0e27ad06` (gpt-6-luna), contrastada por el coordinador mediante lectura pública independiente de las dos portadas. No reemplaza las mediciones históricas ni acredita cobertura audiovisual nueva. No hubo registro, envío de formularios, contacto ni publicación.

### Evidencia actual y límites

- `https://eriktaveras.com/`, portada, secciones Experiencia, Productos propios, Enseñanza y Contacto: el texto presenta servicios de backend/automatización, productos, formación y CTA de contacto. Las credenciales, resultados y promesa de respuesta son declaraciones del autor, no resultados auditados. La sección Enseñanza enlaza la comunidad y los talleres.
- `https://comunidad.eriktaveras.com/`, portada, «Cómo funciona» y recursos: propone presentación → participación por tema → guías asociadas a reels. Declara acceso gratuito sin tarjeta y vincula archivos descargables con una cuenta. No se probó la descarga ni el registro.
- Los contadores de esa portada coinciden en la lectura del subagente y del coordinador: 2.979 miembros, 153 nuevos esta semana y 59 recursos. Son cifras publicadas por el sitio, no auditoría de usuarios, actividad ni ingresos. No permiten atribuir crecimiento causal al contenido ni trasladar miembros a una oferta de pago.
- La portada enlaza una guía para extender sesiones de Claude/Codex, con promesa de medición de consumo, caché y handoff. Solo se comprobó la existencia y descripción del enlace: sus instrucciones técnicas NO quedaron validadas ni autorizan cambios locales.

### Cobertura de las doce dimensiones

| Dimensión | Estado de esta pasada |
|---|---|
| Patrones | Vínculo explícito reel → guía → comunidad observado; rendimiento no demostrado. |
| Colores/paleta | Sin nueva medición. |
| Tipografía | Sin inspección de CSS/assets. |
| Edición/montaje | Sin nuevos videos observados. |
| Estilo visual | Extracción textual, insuficiente para validación visual. |
| Estructura | Secciones y secuencia de incorporación observadas en texto público. |
| Guion/gancho | Sin nueva observación audiovisual. |
| Idioma/tono | Copy en español; no se extrapola a todos sus canales. |
| UI/UX | CTA y navegación textual; no se probaron formularios, teclado ni estados. |
| Frontend | Sin validación DOM/CSS, móvil, accesibilidad o rendimiento. |
| Backend | No observable mediante estas portadas. |
| Negocio/oferta | Comunidad gratuita declarada y servicios presentados; precios históricos no revalidados. |

### Aplicación propuesta y continuación

Para el workshop, evaluar una pieza que lleve a un recurso específico y comprobable, seguido de una acción de participación. Es propuesta, no cambio de oferta ni autorización para copiar identidad, claims o guiones. La regla local de CTA sigue siendo «Buscá PALABRA en Avisos», con recurso existente.

Estado: registrado; no incorporado como regla nueva ni aplicado en una pieza. Siguiente cobertura: revisar oferta pública vigente y flujo sin envío; observar pantallas/DOM/responsive; seleccionar piezas audiovisuales nuevas o huecos del §0.3 con evidencia temporal real. Preservar lo medido el 8-oct y no volver a titular esta ampliación como análisis completo.

### Segunda pasada: oferta y pantalla estrecha comprobadas

Trabajo delegado `deleg_d0596710` (gpt-6-luna); el coordinador volvió a abrir el detalle del curso y la portada de talleres, y midió el DOM del detalle. No se abrió checkout ni se enviaron formularios.

- `https://cursos.eriktaveras.com/c/hermes-basico/`: oferta publicada de US$39, pago único, acceso permanente y PayPal. Publica 12 lecciones y aproximadamente 40 minutos, temario visible, requisitos previos y una introducción gratuita. Es declaración comercial; no se compró ni verificó entrega/acceso permanente. Los costes externos del proveedor de IA y eventual servidor no deben confundirse con el precio del curso.
- `https://workshops.eriktaveras.com/`: anuncia que no tiene fecha abierta y ofrece recibir avisos mediante nombre/correo. Se vio el formulario sin completarlo. Sustituye como observación actual al estado histórico del taller del 17-oct; no implica ausencia de futuras ofertas.
- `https://comunidad.eriktaveras.com/resources/`: el subagente reportó 59 recursos y cinco páginas de listado; el coordinador corroboró 59 en la portada, pero NO verificó las cinco páginas. No se presenta el catálogo completo como revisado.
- Secuencia transferible observada: resultado concreto → alcance y temario → requisitos → precio → muestra gratuita. Para Sergio es criterio de claridad, no propuesta de copiar la oferta o sus importes.

**DOM del detalle del curso, coordinador:** con ancho `innerWidth=1262`, título `h1` de 84px; con ancho `390`, de 44px. En ambos: familia computada `"Big Shoulders Display", "Arial Narrow", "Roboto Condensed", sans-serif`, peso 800, texto `rgb(16, 19, 24)` y fondo del body `rgb(241, 242, 238)`. Es la lista CSS computada, no prueba de qué archivo tipográfico terminó renderizado. El reporte delegado de 128px corresponde al catálogo, no a este detalle.

La media query `(max-width: 400px)` pasó de false a true en el mismo documento. Anchos de scroll medidos: 1247 y 375px respectivamente, sin desborde horizontal en esa observación. Se usó override de viewport con `mobile=false`: prueba de pantalla estrecha, NO dispositivo móvil ni entrada táctil. Captura inspeccionada: `evidencia-eriktaveras-20261023/curso-390.png`, SHA-256 `a98750a88c20e79dd8e764e49ac546dbd352913ed0ff3d1616fce67e76322d93`. Muestra jerarquía condensada, metadatos previos al título y barra inferior persistente con precio/compra; no acredita todos los estados ni accesibilidad completa.

Pendiente audiovisual acotado: trailer público rotulado 0:31 e introducción gratuita en `https://cursos.eriktaveras.com/c/hermes-basico/preview/`. La duración del rótulo no es duración medida ni prueba de observación del video. No guardar URLs firmadas del CDN. El análisis de montaje/voz sigue histórico hasta observar contenido temporal real.

### Comprobación audiovisual: acceso parcial, reproducción bloqueada

El subagente `deleg_1765a5b0` reportó timeout del reproductor público de la introducción y no observó ninguna de las dos piezas. No produjo capturas ni transcripción. El coordinador hizo una comprobación adicional del trailer: pulsó el enlace público del detalle del curso; apareció un iframe de MediaDelivery con poster y controles. Ese poster aislado NO acredita gancho, estructura o montaje del video.

Al pulsar reproducción, el área del video quedó negra y el contador permaneció en 00:00 después de ocho segundos y en la comprobación posterior. Se inspeccionó y conservó `evidencia-eriktaveras-20261023/trailer-sin-avance.png`, SHA-256 `b12265b5f51085c57ab3cc4424ea05c716ba2a6ea3a26759ecb45fc798f7ecc3`. La consulta del árbol de frames no entregó estado legible del elemento de video; no se estableció causa de red, codec, permiso o expiración. No atribuir el fallo al sitio en todos los navegadores.

**Cobertura nueva:** copy/oferta pública y viewport del detalle comprobados; audiovisual temporal 0 piezas reproducidas, sin audio transcrito. Trailer bloqueado en la prueba del coordinador; introducción bloqueada según prueba delegada, no reproducida por el coordinador. Los rótulos 0:31 y 1:01 siguen siendo duraciones declaradas. No se evaluó eficacia comercial ni todo el catálogo.

**Salida de esta pasada:** análisis web parcial registrado y verificable; audiovisual bloqueado por reproducción pública no operativa en el navegador utilizado. Para levantar el bloqueo hace falta un reproductor público que avance o un archivo de esas mismas piezas obtenido por un acceso autorizado. No requiere por sí mismo compra, nueva cuenta ni instalación; no se pide ninguna de ellas ni se sustituyen los videos por texto promocional. Las mediciones audiovisuales históricas quedan preservadas con sus fechas y límites.
