# Complemento del 23-oct-2026 — huecos cerrados del barrido Gadzhi → workshop

> **Estado:** borrador privado para revisión independiente de Codex. Venta del taller **pausada**. No cambia `TALLER_31_OCT.md`, la oferta, las skills ni los 19 archivos congelados (`APLICACION-WORKSHOP.md`, `fuentes.json`, `evidencia/` y la ficha); los complementa. Si algo de aquí contradice un archivo congelado, vale esto **solo en lo medido hoy**, y el cambio lo decide Hermes/Sergio.
> **Qué es nuevo y qué no:** todo lo de `evidencia-complemento/` se obtuvo el **23-oct-2026** (fecha de los archivos y `extraido` en cada JSON). Nada de lo anterior se reutiliza como si fuera de hoy. Esto **no** es un barrido nuevo de la web: es una sola pasada sobre los huecos listados en el encargo.
> **Corrección única del 23-oct (tras el dictamen de Codex «cambios necesarios»):** (1) C4 separa CTA comercial, CTA de interacción y ausencia de menciones detectadas; la colocación «solo al final» es **decisión propuesta**, no evidencia del ejemplo. (2) Donde decía ausencia de habla, música sin voz o ausencia de CTA hablado, ahora dice **«el ASR no detecta habla fiable / no detecta mención»**: no escuché ningún audio. (3) Los picos `scene>0.3` y su agrupación son **eventos/candidatos de cambio de escena**, no cortes confirmados ni benchmark de ritmo. (4) S08 pasa a su estado actual según la adenda `S08-VERIFICACION-LOCAL.md` (la adenda no se edita; el bloqueo histórico se conserva). Sin investigación nueva.
> **Etiquetas:** **[OBS]** observado hoy (captura, fotograma, extracto guardado) · **[ASR]** salida de reconocimiento de voz local (no escuché el audio; puede equivocar nombres propios y cifras) · **[DEC]** declarado por la fuente · **[INF]** inferencia mía · **[PROP]** propuesta.

## 0. Resumen ejecutivo

**Cobertura de los seis IDs (todos contabilizados, ninguno omitido):**

| ID | Pieza | Cobertura real hoy | Estado |
|---|---|---|---|
| S11 | Tráiler AIC V6 (YouTube, 5:14) | 313 s de 313 s: archivo completo + transcripción local + 91 picos de escena (candidatos) + 15 fotogramas | **observado** |
| S05 | Post fijado en X (video 0:22) | 22,4 s de 22,4 s: archivo completo + 12 fotogramas + eventos de escena; **el ASR no detecta habla fiable** (audio no escuchado) | **observado** (visual) |
| S12 | Claude, 24 min (YouTube) | 1440 s de 1440 s transcritos (747 segmentos) + 12 fotogramas + 135 picos | **observado** (muestreo visual) |
| S13 | Imperio multimillonario, 27 min | 1621 s de 1621 s transcritos (700 seg.) + 12 fotogramas + 273 picos | **observado** (muestreo visual) |
| S14 | ChatGPT, 28 min (agosto) | 1661 s de 1661 s transcritos (570 seg.) + 12 fotogramas + 273 picos | **observado** (muestreo visual) |
| S08 | VSL de Monetise | **Estado actual (adenda `S08-VERIFICACION-LOCAL.md`, coordinador):** clip público actual de 54,976 s recuperado y decodificado; 18 fotogramas muestreados; aviso de cierre/reapertura con CTA; **no es la VSL larga** y su audio no fue transcrito ni escuchado. **Histórico de mi pasada:** página con extracto DOM/CSS y 2 capturas; video no reproducible en el navegador | **clip actual: observado en muestreo visual (parcial)** · **VSL larga: no observada** · bloqueo del navegador conservado como histórico (§9) |

«Observado» en video significa: **audio transcrito completo por máquina + fotogramas muestreados, no visionado continuo**. Con 12–15 fotogramas por video no afirmo haber visto cada plano; afirmo lo que muestran esos instantes y lo que dicen las transcripciones.

**Qué aprendizaje útil cambia el borrador (detalle y límites en §8):**
1. **Hook con filtro de salida** en los largos de Gadzhi (S12 [0–28 s], S14 [0–11 s]): él dice a quién *no* le sirve el video. Refuerza el «para quién no» y justifica poner esa línea en los reels A/B/C.
2. **Demostración como lista literal de pasos con duración declarada** (S11 [178–258 s]: «here's how I would do it in 50 seconds»; abrir X, buscar Y, copiar Z). Cambia el guion de los reels: la demostración pasa a ser una secuencia de acciones nombradas y contables, no una idea.
3. **Distinguir tres cosas** (detalle en §7 y C4): **CTA comercial** (invitación al reto: el ASR **no detecta** mención hablada en S12 ni S13; sí en el tráiler S11 [299 s] y en la descripción), **CTA de interacción** (S12 [378–418 s] y S14 [522–548, 1652 s] piden like/comentario y sortean un MacBook; S12 cierra además con una acción de uso) y **ausencia de menciones detectadas** (solo vale dentro del texto reconocido por el ASR). Para el workshop, «un CTA por pieza, Link en mi perfil, al final» es **decisión propuesta nuestra**, compatible con el canon, no algo que estos ejemplos demuestren.
4. **Móvil medido (390×700 px) en la landing del reto (S09):** barra superior con CTA, retrato, marca, fecha, titular, subtítulo y CTA principal caben en los primeros 700 px. Cambia el criterio del wireframe móvil: CTA principal dentro de los primeros 700 px.
5. **Toda cifra en pantalla trae su fuente a la vista** (S05: captura de prensa de terceros dentro del video; S11 [30 s]: gráfico con nombres de comparación). Para Sergio: si no hay fuente propia, no hay cifra.

**Qué NO cambia:** la oferta, la escalera (15×Bs 50, 20×Bs 60, 15×Bs 70 por pago acreditado), los 50 cupos, 90 min de contenido más pausa de 5, el CTA canónico «Link en mi perfil → /auditoria → WhatsApp», el voseo, la pausa de venta, el cierre del 29-oct 20:00, ni la prohibición de prometer ahorro/resultados. Tampoco se adopta nada de Gadzhi que sea identidad, claims de ingresos, sorteos de premios ni urgencia falsa.

## 1. Método y límites generales

- **Herramientas:** navegador de Orca (mismo `browserPageId` de la pasada anterior, mismo worktree), `yt-dlp` vía `.claude/skills/ver-videos/scripts/fetch-video.mjs` **sin cookies**, `ffmpeg`/`ffprobe` locales y `faster-whisper` local (modelo `small`, CPU) vía `transcribe.sh`. **Cero costo, cero instalaciones, cero llamadas pagadas.**
- **Gemini no se usó:** no hay gratuidad/autorización comprobada en este encargo y no se leen ni exponen claves.
- **Transcripción:** se forzó `language=en` porque las pistas de audio descargadas están marcadas `en` (comprobado en `S11-info-yt-dlp-resumen.json` y en los `info` de S12–S14). Un primer intento con idioma por defecto (`es`) produjo una «traducción» inservible; quedó guardado como `S11-trailer-transcripcion-forzada-es-DESCARTADA.json` y **no se usa**.
- **Sin acceso a audio real:** no escuché los videos. Lo que digo del habla sale de [ASR]. Donde el ASR no es fiable (S05) lo declaro. **Regla de redacción:** una ausencia en el ASR se escribe «el ASR no detecta habla fiable / no detecta mención», nunca «sin habla», «música sin voz» ni «sin CTA hablado» como hecho.
- **Eventos de escena:** `ffmpeg scene>0.3` devuelve timestamps de **picos de diferencia entre fotogramas**, no cortes verificados (hay picos contiguos, p. ej. S05 2,88/3,04; 6,60/6,72; 9,48/9,52/9,68). Las cifras «agrupados» salen de un criterio mío (picos a < 1 s fundidos), sin validación visual continua. Se informan como **eventos/candidatos agrupados por minuto**, solo como orden de magnitud descriptivo; **no son cortes confirmados ni un benchmark de edición**.
- **Videos descargados:** quedaron fuera del repo, en `%TEMP%\imanvid\` (S11, S12, S13, S14, S05). No se versionan ni se publican. Las transcripciones y hojas de contactos de `evidencia-complemento/` son material de investigación **privado**; no republicar.
- **No se sorteó ningún control:** sin login, sin CAPTCHA, sin paywall, sin enviar formularios, sin contactar a nadie, sin agendar ni comprar.

## 2. Corrección a cifras de la pasada anterior (sin editar los archivos congelados)

| Dato anterior | Medición de hoy | Efecto |
|---|---|---|
| Tráiler: «torre de Almaty ≈ t 76 s» y «three ways ≈ t 117 s» (instantes reportados desde el navegador) | [ASR] la línea de la torre está en **59 s** y «three ways to make money with AI» en **114 s** | Los instantes anteriores quedan **reemplazados** por los de esta pasada. |
| Tráiler: título «Nuevo tráiler de AIC V6» | Título original en inglés (yt-dlp, `S04-yt-dlp-flat-playlist-ultimos14.txt`): «Revealing My $5.4 BILLION Bet...» | La interfaz en español traducía/localizaba el título. |
| S06: titular «serif aprox.» | `dom-S06-consulting-com.json`: titulares en `"Test Tiempos Headline Light"` 42 px; subtítulos en `"Test Tiempos Headline Medium"` | Familia ya **medida**, no aproximada. |
| CTA del reto `rgb(208,254,22)` «reportado» | `dom-S09-reto-landing.json`: botón `rgb(208, 254, 22)`, texto negro, `"Mounsta Regular"` 18 px, radio 50 px, 400×52 px | Ahora con **extracto guardado**. |
| Móvil «no verificado» | Medido en §5 | Cerrado para S01, S06, S08, S09 (con salvedad de S06). |

## 3. S11 — Tráiler AIC V6 (pitch, 5:14)

- **URL original:** https://www.youtube.com/watch?v=YZ6OyZKrRh8 · **Fuente:** primaria (canal oficial, S03).
- **Método:** `fetch-video.mjs` (yt-dlp sin cookies) → mp4 1280×720, 313 s; `ffmpeg` → audio 16 kHz; `faster-whisper small` `en` → 87 segmentos, 862 palabras, habla ≈ 74 % del tiempo; `ffmpeg scene>0.3` → 91 picos de escena (≈ 64 eventos candidatos al agrupar picos a < 1 s, ≈ 12 por minuto; no son cortes confirmados); 15 fotogramas en `S11-hoja-contactos-15-fotogramas.png` (en este orden, de izquierda a derecha y arriba abajo: 0, 3, 6, 9, 30, 60, 90, 120, 150, 178, 200, 236, 276, 296, 308 s).
- **Fecha de publicación:** 2026-10-12 (`upload_date` del `info`, `S11-info-yt-dlp-resumen.json`). **Capítulos del autor:** «Investment in Higgsfield» 0–82, «Meeting the team» 82–107, «The opportunity in AI» 107–178, «Three ways to make money» 178–…
- **Evidencia:** `S11-transcripcion-whisper-local-en.json`, `S11-cortes-escena-gt0.3.txt`, `S11-hoja-contactos-15-fotogramas.png`, `S11-info-yt-dlp-resumen.json`.

**Observado (con timestamp):**
- **Hook visual 0–9 s [OBS]:** apertura en la que el **ASR no detecta habla** (primer segmento reconocido a 9,0 s [ASR]; no escuché el audio); estepa, jinetes, una bandera amarilla con el logo del aliado y otra negra con el nombre de su empresa, él de perfil y luego con gafas de sol (fotogramas 0, 3, 6, 9 s). Eventos de escena a 4,9 s y 9,6 s (candidatos, no cortes confirmados).
- **Hook hablado 9–36 s [ASR]:** «I've just made one of the biggest bets of my career… not in Silicon Valley, not in New York, right here in Almaty» (9–18 s) → «It's official… investor and advisor» (18–24) → «what is Higgs Field?» (24) → «fastest growing AI platform… zero to 5.4 billion in less than 24 months» (27–36). Estructura: **noticia + pregunta que el espectador ya tiene + cifra**.
- **Credibilidad/atmósfera 36–107 s [OBS+ASR]:** gráfico «FASTEST COMPANY TO $1B RUN RATE EVER» a 30 s; cartel exterior «welcomes new investor & advisor Iman Gadzhi» a 178 s; oficina; tono de documental («Lighting up the Almaty Tower», 59 s). En 36–54 s y 59–82 s el **ASR no detecta habla fiable** (qué suena ahí no se sabe: no escuché el audio).
- **Tensión/oportunidad 107–178 s [ASR]:** «You have never been this early… I'm about to show you three ways to make money with AI» (108–114); metáfora de puntos grises «84 % of the dots are gray» (118–127); «the opportunity was real, but the door was locked» (148–160).
- **Demostración 178–258 s [ASR+OBS]:** «Here's how I would do it in 50 seconds… so you can literally just copy it» (178–181). Tres rutas con verbos concretos: Google Maps → negocio sin web → copiar nombre y reseñas → crear sitio (185–197); Airbnb → fotos → prompt → video para venderlo («hundreds if not thousands of dollars», 215–228); canal de YouTube en nicho → prompt → generar → publicar y monetizar (236–253). En pantalla aparece el rótulo «AIRBNB» (fotograma 200 s).
- **Giro a la oferta 258–306 s [ASR]:** «there is one superior way» (263–267) → «I'm hosting a five day live challenge» (276) → «Even if you're a complete beginner or never made a dollar online» (282) → «you and me together live building a 373 dollar a day online income, from November 7th to the 15th» (286–290) → «click the link in the comments section to secure your free seat… first come first serve» (297–303) → cierre «you've never been this early» (307).
- **Prueba [OBS/DEC]:** cifras de valuación y crecimiento de un tercero dicho por él (S11 [30–36 s]); ninguna prueba de resultados de alumnos **dentro del video** (los $155M están en la descripción, ver `S11-info-yt-dlp-resumen.json`, **[DEC]**).
- **CTA:** hablado a 299 s («link in the comments section»; la descripción trae `link.consulting.com/yt-trailer-aic`); el fotograma de 308 s muestra un calendario «NOVEMBER · Live Session #1» como cierre visual.

**Inferencias [INF] (separadas):** el orden noticia → autoridad → oportunidad → demostración corta → invitación es un molde reconocible de «anuncio de evento gratis». La demostración de «50 segundos» sirve de **prueba de que el método es simple**, no de resultados. No hay evidencia de conversión.
**Conexión con la oferta:** el video entero existe para llevar al reto gratis, no vende nada de pago.
**Aplicación concreta al workshop [PROP]:** §8, cambios C1, C2, C3.
**Faltantes:** audio no escuchado (solo ASR); 15 de ~9 400 fotogramas posibles vistos; sin datos de retención ni conversión.

## 4. S05 — Pieza corta: post fijado en X (video 0:22)

- **URL original:** https://x.com/GadzhiIman/status/2109688620051513856 (id sacado del DOM del post fijado, `S05-pinned-status-urls.txt`; perfil oficial S05).
- **Método:** `fetch-video.mjs` sin cookies → mp4 720×900, 22,4 s; ASR; escena >0,3 (22 picos; ≈ 10 eventos candidatos agrupados, ≈ 27/min; no son cortes confirmados); 12 fotogramas en `S05-hoja-contactos-12-fotogramas.png` (0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 21,5 s).
- **Fecha:** «12 oct» visible en el post (`S05-articulos-extracto.txt`, extracto DOM del 23-oct). Año no mostrado en el texto; coincide con 2026 por el contexto de la nota de prensa dentro del video (8-oct-2026) **[INF]**.
- **Evidencia:** `S05-hoja-contactos-12-fotogramas.png`, `S05-cortes-escena-gt0.3.txt`, `S05-transcripcion-whisper-local-en.json` (**no confiable**, ver abajo), `S05-pinned-status-urls.txt`, `S05-articulos-extracto.txt`, `dom-S05-x-perfil.json`.

**Observado (visual):** montaje con cambios frecuentes de plano; el ASR no reconoció diálogo fiable (el audio no fue escuchado):
- **0–2 s:** retrato en blanco y negro, gafas de sol bajándose con la mano; banderas al fondo. **2–4 s:** jinete en corcel levantado (B/N). **4–10 s:** torre iluminada de noche con letras verticales «IMAN GADZHI» y «Higgsfield» (fotogramas 4–10 s). **12–16 s:** plano de él en un puente sobre avenida de noche; autos. **18–20 s:** aéreo nocturno de ciudad. **~20–22 s:** dos capturas de prensa: un artículo con titular «Higgsfield Raises $400 Million at $5.4 Billion Valuation…» y otro de Business Insider/FinanceWire «Iman Gadzhi Acquires Stake in Higgsfield, a $5.4 Billion AI Powerhouse» (8-oct-2026).
- **Texto del post (DOM, `S05-articulos-extracto.txt`):** «I've been keeping this a secret for a while… investor & advisor to @higgsfield».
- **Hook:** en las imágenes no hay texto hablado detectado por el ASR (audio no escuchado); el texto del post hace el trabajo de gancho («secret»). **Estructura:** teaser cinematográfico → ubicación (torre) → prueba externa (prensa). **Prueba:** dos capturas de prensa de terceros **[OBS]**; que esos artículos sean verdaderos o completos no está verificado. **CTA dentro del video:** ninguno **visible** en los 12 fotogramas; un CTA hablado no se puede descartar (el ASR no es fiable y no escuché el audio).
- **Audio:** el ASR devolvió un único segmento «Thanks for watching and don't forget to subscribe…» [14–22,4 s]. Es una salida típica del modelo cuando no reconoce habla; **no se toma como habla ni como su ausencia**. No escuché el audio: **el ASR no detecta habla fiable; qué suena (música, voz, silencio) es desconocido**.

**Aplicación [PROP]:** C5 (cifra con fuente a la vista) y límite: sin prensa propia no se imita.
**Faltantes:** sonido real, métricas del post (272/151/5 mil/758 mil, reportadas el 22-oct en la pasada anterior; **no** re-extraídas hoy y no son del video), segundo video/foto del carrusel (el post muestra fotos 1, 3 y 4 en los enlaces).

## 5. Viewport móvil medido (cierra el hueco de la pasada anterior)

**Método = viewport embebido, NO móvil auténtico** (corrección pedida por el coordinador). Diagnóstico de media queries del mismo documento capturado (S09, `movil-diagnostico-media-queries-S09.txt`): `innerWidth` dentro del iframe 390, `clientWidth` 375, `devicePixelRatio` 1,25, `visualViewport` 375; `(max-width:390px)` = **false** pero `(max-width:391px)` = **true** (ancho efectivo ≈ 390,x); `(max-width:809px)` = true; `(pointer:coarse)` = **false** y `(hover:hover)` = **true** (sin táctil); el user-agent de iPhone proviene solo de `orca set device` previo. **Consecuencia:** los breakpoints ≥ 391 px se aplicaron; una regla con corte exacto en ≤ 390 px **puede no haberse aplicado**, así que no se da por resuelto un comportamiento «de iPhone 14» exacto; lo medido es «layout a ~390 px de ancho en un iframe», sin touch ni UA nativo.

**Método y su límite honesto:** `orca set device` solo cambia el user-agent (comprobado: `innerWidth` siguió en 1095 con UA de iPhone). Para medir un viewport móvil real se abrió cada página y se **reemplazó la pestaña por un iframe de 390×700 CSS px de la misma URL** (mismo origen, así se lee `innerWidth` dentro). Es un **viewport medido**, no un dispositivo físico: sin pantalla táctil real, `devicePixelRatio` 1,25, barra de scroll de 15 px (el documento mide 375 px de ancho útil). Las capturas vienen escaladas ×1,25.

| Fuente | Medición (`*-medicion.txt`) | Captura | Qué se ve en 390×700 [OBS] |
|---|---|---|---|
| S01 iman-gadzhi.com | `inner [390,700]`, `scrollWidth 375`, `max-width:809px = true` | `movil-S01-iman-gadzhi-com.png` | Marca arriba a la izquierda, menú de 2 líneas, foto a pantalla completa, nombre en serif sobre la foto, flecha. **Cero CTA.** |
| S06 consulting.com | `inner [390,700]` | `movil-S06-consulting-com.png` y `…-reintento-espera-22s.png` | Barra con logo y menú; **~700 px de negro sin titular ni CTA visibles**, con el borde de una imagen asomando abajo. Dos intentos, mismo resultado (el hero parece cargar más abajo o por animación): **no se pudo ver el titular ni el CTA móvil de S06**. |
| S08 monetise.com/waitlist | `inner [390,700]` | `movil-S08-monetise-waitlist.png` | Logo + botón «JOIN WAITLIST GROUP» arriba, y debajo **«THIS OFFER IS CLOSED»** (aparece en el render móvil; **no** aparece en el texto del DOM de escritorio guardado), titular, línea de garantía, panel del video («You have already started watching this video / Continue watching? / Start from beginning?») y CTA amarillo ancho con el botón de WhatsApp encima. |
| S09 reto (link de la bio) | `inner [390,700]`, h1 24 px | `movil-S09-reto-landing.png` | **Primera pantalla completa:** barra lima con texto + botón negro «SAVE MY FREE SPOT» a ancho completo, retrato centrado sobre fondo de escenario, logos «Higgsfield \| AI INCOME CHALLENGE», chip rojo «LIVE VIRTUAL EVENT: NOV 7TH – NOV 15TH», titular de 3 líneas, subtítulo de 3 líneas y **CTA principal lima, ancho completo, dentro de los 700 px**. |

**Inferencias [INF]:** S09 está compuesta para que la primera pantalla móvil contenga la decisión (promesa, fecha, acción). S08 en móvil expone un estado «cerrada + lista de espera» sin ocultar la promesa.
**Aplicación [PROP]:** C6 y C7. **Faltante:** S06 móvil no observada; no se midió el resto del scroll móvil (solo la primera pantalla); no se probó orientación horizontal ni dispositivos reales.

## 6. Formularios y estados (inspección visual, sin enviar datos)

| Fuente | Acción | Resultado | Evidencia |
|---|---|---|---|
| S09 «SAVE MY FREE SPOT» | Un clic en el botón (ref `e13`); **no se tecleó ni se envió nada** | No apareció modal, diálogo ni campos (`campos: []`, `dialogs: 0`, `scrollY: 0`); la página quedó igual. **Formulario no observado.** | `form-S09-modal-sin-enviar.png`, `form-S09-campos.txt`, `form-S09-estado-tras-clic.txt` |
| S08 «JOIN WAITLIST GROUP» | Un clic; sin datos | La URL pasó a `…/waitlist?utm_source=www.monetise.com`; sin campos ni diálogo. **Formulario no observado.** | `form-S08-tras-clic-waitlist.png`, `form-S08-campos.txt` |
| S07 agenda Quantum | **No se hizo clic** | El calendario mostraba «Sin disponibilidad en noviembre»; los campos solo se verían tras elegir hora, y agendar está prohibido. | `dom-S07-assessment-call.json` |
| S02 Instagram | Solo lectura del DOM bajo el modal de registro | 12 enlaces `/p/` o `/reel/` visibles en el DOM público (`dom-S02-instagram.json`); **no se abrió ninguno** (fuera de las seis piezas, y no se eludió el modal). | `dom-S02-instagram.json` |

**Causa probable [INF]:** los botones usan un componente que abre formulario externo o dentro de un iframe de edición; bajo la automatización no se mostró. **No se reintentó.** Campos del formulario de captación: **desconocidos**.

## 7. S12, S13, S14 — Videos largos de YouTube

Método común: yt-dlp sin cookies (mp4 720p) → audio → `faster-whisper small` `en` → escena >0,3 → 12 fotogramas. Títulos originales en inglés y capítulos del autor en los `*-info-yt-dlp-resumen.json`. Los títulos en español de la pasada anterior eran localización de YouTube («Con doblaje automático»).

### S12 — Claude, 24 min
- **URL:** https://www.youtube.com/watch?v=LqCPwQ1IcA4 · **Título original:** «Give Me 24 minutes, I'll Give You 1,000+ hours of Claude Knowledge» · **Publicado:** 2026-10-21 · **Duración:** 1440 s · **Cobertura:** transcripción 747 segmentos, habla ≈ 95 %; 135 picos de escena (≈ 124 eventos candidatos agrupados, ≈ 5/min; no son cortes confirmados); hoja `S12-hoja-contactos-12-fotogramas.png` (1, 8, 20, 45, 100, 400, 750, 1000, 1250, 1380, 1410, 1436 s). Sin capítulos del autor.
- **Hook [ASR 0–40 s]:** «Right now, your [Claude] subscription is either a powerful tool in your arsenal or an expensive burden» (0–7) → «You open it, ask one question, close the tab… an expensive version of Google» (15–24) → **filtro:** «if you're happy with that, click away… this video probably isn't for you» (25–28) → «you're probably only using 2 % of what it can do» (33–38) → «in today's video that changes forever» (40). Fotograma a 8 s: gráfico animado «Expensive Burden / Powerful Tool».
- **Credibilidad [ASR 43–92 s]:** confesión («I wasn't an early adopter»), error de empresa («burning through expensive credits… best models for simple tasks»), «1,000+ hours» de uso, y «Claude doesn't come with an instruction manual».
- **Estructura [ASR]:** cuatro niveles: «beginner, novice, intermediate, and pro» anunciados a 95 s; «tier one» 111 s; «tier two» 420 s; «tier three» 739 s; resumen de los cuatro niveles 1399–1406 s. Analogía de la casa (cimientos primero, 164–178 s). Pantalla con tres puntos «Give the right context upfront / Memory is on / You're matching the model to the job» (fotograma 750 s). Demo de pantalla con su cara en un círculo (fotograma 1250 s).
- **Prueba [OBS/DEC]:** demostraciones en pantalla; «1,000+ hours» [DEC]; ninguna cifra de ingresos en el video.
- **CTA de interacción [ASR 378–418 s; `S12-transcripcion-whisper-local-en.json`, tramo 377,64–414,62 s]:** «Give me 20 seconds because I wanna gift you a MacBook… every single video I give away a brand new MacBook… like and leave a comment… if you leave an AI comment you're automatically disqualified». Es un **CTA hablado de interacción** (like + comentario + sorteo), distinto del CTA comercial al reto.
- **CTA comercial [ASR+OBS]:** el **ASR no detecta mención hablada del reto** (búsqueda de «challenge/income/link» en el texto reconocido solo encuentra la frase de los comentarios; vale solo dentro de lo que el ASR reconoció, no certifica que no se diga). El CTA al reto aparece **en la descripción** (`S12-info-yt-dlp-resumen.json`: «FREE LIVE AI Income Challenge… Nov 7th–15th, 2026»). Cierre hablado 1427–1431 s: **«identify the tier you're in, pick one feature to focus on first, and set it up today»** (una acción).
- **Inferencia [INF]:** dentro del texto reconocido, el video informativo no invita hablando al reto y lleva tráfico por descripción; **sí** pide interacción (like/comentario/sorteo). La acción de cierre de uso es **una sola** y pequeña.

### S13 — «What Building a Multi-Billion-Dollar Empire Actually Looks Like»
- **URL:** https://www.youtube.com/watch?v=WO-Gl6-6gLE · **Publicado:** 2026-10-15 · **Duración:** 1621 s · **Capítulos del autor:** 11 (First impressions 0:00 … Reflection on the journey 23:46) · **Cobertura:** 700 segmentos, habla ≈ 74 %; 273 picos (≈ 173 eventos candidatos agrupados, ≈ 6/min; no son cortes confirmados); hoja `S13-hoja-contactos-12-fotogramas.png` (1, 10, 40, 150, 300, 450, 700, 900, 1100, 1300, 1500, 1610 s).
- **Hook [OBS+ASR 0–70 s]:** montaje corto con retrato en B/N y bandera (fotograma 1 s), torre nocturna (10 s), luego entrevista en la oficina del aliado («how was your first day at the office?» a 30 s; «aggressive work culture…», 37–62 s).
- **Estructura:** vlog-documental con subtítulos en pantalla (fotogramas 150–1500 s muestran subtítulos estilizados en inglés), recorridos por equipos (producción, ingeniería) y cierre emocional [1560–1617 s: «seize this moment… I'm watching from afar and I'm rooting for you»].
- **Prueba:** imagen de equipo/oficina **[OBS]**; cifras del aliado dichas por terceros **[DEC]**. **CTA comercial:** el **ASR no detecta mención hablada** del reto (búsqueda en el texto reconocido: ninguna mención de challenge/free/income; no certifica ausencia real); el CTA aparece en la descripción (`S13-info-yt-dlp-resumen.json`).
- **Inferencia [INF]:** es contenido de marca/credibilidad para el aliado; refuerza autoridad, no enseña un método.

### S14 — «Give Me 28 Minutes, I'll Give You 10,000 Hours of ChatGPT Knowledge»
- **URL:** https://www.youtube.com/watch?v=w-lkP9XcZfg · **Publicado:** 2026-08-18 · **Duración:** 1661 s · **Capítulos del autor:** 12 (Introduction 0 … Agent mode and final thoughts 1412 s) · **Cobertura:** 570 segmentos, habla ≈ 99 %; 273 picos (≈ 270 eventos candidatos agrupados, ≈ 10/min; no son cortes confirmados); hoja `S14-hoja-contactos-12-fotogramas.png` (1, 8, 45, 200, 400, 600, 800, 1000, 1200, 1400, 1600, 1655 s).
- **Hook [ASR 0–52 s]:** «if you're happy doing the same boring, repetitive tasks every day for the rest of your life, you can click off right now» (0–6) → «the next 30 minutes are for people who want out of that» (6–11) → «you're probably only using 2 %» (21–25) → «this video probably isn't for you» (34–39) → promesa «learn 98 % of ChatGPT in the next 20 to 30 minutes» (39–44) → «you're literally talking to a stranger» (55–61).
- **Estructura [OBS]:** tarjetas «Tip #4 · Intermediate · Difficulty» (fotograma 45 s), demos de pantalla con su cara en columna (fotogramas 400–800 s), fondo de oficina con el nombre de su empresa en la pared (fotogramas 200 y 1000–1600 s).
- **CTA de interacción [ASR 522–548, 1652 s]:** sorteo de un MacBook por comentario.
- **Prueba / puente a oferta [ASR 1601–1651 s]:** «For specific outcomes you need specialized tools that are built for that specific thing… that is a topic for another day» — **puente** hacia otro producto sin nombrarlo.
- **CTA:** el CTA hablado final detectado por el ASR es el de interacción (sorteo: like + comentario), no uno comercial. La **descripción** de hoy trae el reto de noviembre y además dos enlaces: `yt-video-aic` y `yt-trailer-aic` (`S14-info-yt-dlp-resumen.json`).
- **Dato nuevo [OBS]:** el **último fotograma (1655 s)** es una captura de la página del propio video con su descripción de entonces: «Next, watch this video where I break down the best AI business model to start and make $10k+/month… More stuff here», **distinta de la descripción actual**. Eso **respalda con una observación** que la descripción cambió después de publicarse (de agosto a hoy); sigue siendo **[INF]** que fue una reescritura deliberada de campaña, y no se sabe cuándo.

### Hallazgo transversal sobre S04 (14 títulos más recientes)
`S04-yt-dlp-flat-playlist-ultimos14.txt`: 5 de los 14 títulos más recientes usan el molde «Give me N minutes, I'll give you X…». **[INF]** molde repetido de títulos; **no se usará** (reconocible; ver aplicación).

## 8. Aplicación concreta al workshop (cambios propuestos, ninguno adoptado)

Todos son **[PROP]**; los textos sensibles quedan para decisión de Sergio.

| # | Cambio propuesto | Fuente | Dónde entra | Límite |
|---|---|---|---|---|
| C1 | Añadir al hook de cada reel una línea de **filtro de salida**, p. ej.: «Si en tu negocio no se repite nada, seguí de largo. Si repetís lo mismo cada semana, mirá esto.» | S12 [25–28 s], S14 [0–11 s] | Reels A/B/C de `APLICACION-WORKSHOP.md` §4 | Texto nuevo; no copiar la fórmula «click away / click off». No promete resultado. |
| C2 | La **demostración** de cada reel se escribe como lista de acciones con duración declarada (p. ej. «tres pasos, 40 segundos»: abrir tu lista de pedidos, marcar lo que repetís, anotar minutos). | S11 [178–258 s] | Reels A/B/C | Los ejemplos deben ser reales y rotulados «ejemplo»; **no** se afirma que Sergio ya los grabó. |
| C3 | Orden del **pitch de 60–90 s**: apertura con un hecho concreto → pregunta que la persona ya tiene → demostración mínima → invitación con fecha y **cupos reales** → una sola acción. Ya coincide con el borrador; solo se conserva el orden y se acota la demostración a ≤ 25 s. | S11 [9–307 s] | `APLICACION-WORKSHOP.md` §3.1 | «First come first serve» solo si es verdad; aquí lo vale el pago acreditado. Sin urgencia falsa. |
| C4 | **Decisión propuesta nuestra:** un solo CTA comercial por pieza, al final, con la frase canónica «Link en mi perfil»; el cuerpo informativo no lo repite. Se distingue **CTA comercial** (invitación al taller), **CTA de interacción** (like/comentario/sorteo: **no se adopta**) y **ausencia de menciones detectadas** (solo dentro del ASR). | **Apoyo parcial, no prueba:** S11 [299 s] invita hablando una sola vez al final del tramo de oferta; S12 y S13: el ASR no detecta invitación hablada al reto; **pero** S12 [378–418 s] y S14 [522–548, 1652 s] sí piden interacción hablada en el cuerpo. Los ejemplos no demuestran que «un CTA al final» funcione. | Reels A/B/C, clase gratis | Canon: bio → `/auditoria` → botón de WhatsApp personal de Sergio → QR. Se mantiene por el canon, no por el ejemplo. |
| C5 | **Toda cifra en pantalla** muestra su fuente a la vista; si no hay fuente propia, no hay cifra. | S05 [~20–22 s], S11 [30 s] | Reel B (tarjetas de costo), carruseles | No se importan capturas de prensa ni cifras de Gadzhi. |
| C6 | Criterio móvil de la landing: **CTA principal dentro de los primeros 700 px** y barra superior con el botón. | S09 (390×700 medido) | Wireframe móvil §6 de `APLICACION-WORKSHOP.md` | Sin retrato recortado con degradé ni lima/amarillo. |
| C7 | Estado de **pausa visible** en la página mientras la venta esté cerrada, con un mensaje de aviso de reapertura. | S08 móvil («THIS OFFER IS CLOSED» + botón de espera) | **ALTERNATIVA PENDIENTE DE DECISIÓN** | Una lista de espera sería una **oferta/mecanismo nuevo** no previsto en `TALLER_31_OCT`. No se implementa ni se asume. |

**Adaptaciones que NO se adoptan:** sorteo de premio por comentario (S12 [378–418], S14 [522–548]) — costo, legalidad y regla de un CTA por pieza; promesa de ingresos o «$X al día»; escasez inventada; valor apilado con precios ficticios (S08); testimonios de terceros como si fueran del taller.

**Evidencia propia que sigue faltando (no se resuelve con esta investigación):** un caso real de Sergio con tareas y tiempos medidos, y pagos acreditados reales para los cupos.

## 9. Lo que sigue sin observarse (inventario honesto)

- **S08 — estado actual (adenda `S08-VERIFICACION-LOCAL.md`, del coordinador; no editada aquí):** se recuperó el medio público **actual** (54,976 s, H264 854×480, AAC, decodificación completa exit 0), con 18 fotogramas muestreados (0–54 s, archivos `S08-local-frame_*.jpg`): aviso corto de cierre/reapertura con CTA visible a 44 s. **No es la VSL larga esperada**, no se recuperó la versión histórica, el audio **no fue escuchado ni transcrito** y no se midieron cortes ni ritmo. Esto **supera el «bloqueado» de abajo solo para el clip actual**; la VSL larga sigue **no observada**. El archivo temporal no forma parte de los hashes del complemento.
- **S08 VSL — histórico de mi pasada (bloqueado en el navegador; se conserva):** el reproductor mostró «You have already started watching this video / Continue watching? / Start from beginning?» y se intentó pulsar «Start from beginning?»; la salida de ese comando se perdió al pasar a segundo plano, así que **no hay constancia de que el clic se ejecutara**. Las capturas posteriores (12 s y ~15 min después) siguen mostrando el mismo panel (`S08-vsl-estado-no-reproducido.png`) y `S08-vsl-estado-reproductor.txt` indica `videos: []`: el reproductor no expone `<video>` ni URL descargable en la página. Hook, estructura, prueba y CTA **del video**: **no observados**. Se conserva el extracto DOM de la **página** (`dom-S08-monetise-waitlist.json`, 30 541 px de alto, 9 CTA, 23 titulares).
- **Formularios de S09 y S08:** no aparecieron (§6). Campos desconocidos.
- **S06 en móvil:** no se vio el hero (§5).
- **Instagram:** reels y publicaciones no abiertos (modal de registro; sin eludirlo). TikTok: sin cuenta oficial enlazada.
- **Canal de YouTube en DOM:** no se re-extrajo (la página no renderizó en dos intentos bajo carga de CPU); lo sustituye el listado de `yt-dlp --flat-playlist` (`S04-yt-dlp-flat-playlist-ultimos14.txt`). El extracto de cabecera del canal (suscriptores, enlaces de la bio) **sigue siendo el de la pasada anterior (reportado)**.
- **Audio:** ningún audio fue escuchado; [ASR] de modelo pequeño. Toda «ausencia» (habla, voz, mención de CTA) es **ausencia de detección del ASR**, no certificación de silencio ni de ausencia de CTA hablado.
- **Eventos de escena:** sin validación visual continua; no hay cortes confirmados ni ritmo comprobado (§1).
- **Datos comerciales:** nada sobre conversión, ingresos reales ni resultados; todo es claim **[DEC]**.

## 10. Índice de archivos (todos existen; verificados con código, ver `cobertura-complemento.json › verificacion`)

`COMPLEMENTO.md` · `cobertura-complemento.json` · `evidencia-complemento/` (transcripciones `S11…S14,S05-transcripcion-whisper-local-en.json`; cortes `*-cortes-escena-gt0.3.txt`; hojas de contactos `S05/S11/S12/S13/S14-hoja-contactos-*.png`; `*-info-yt-dlp-resumen.json`; `dom-S01…S09-*.json`; `movil-S01/S06/S08/S09-*.png` y `*-medicion.txt`; `form-S08/S09-*`; `S08-vsl-estado-*`; `S08-local-frame_*.jpg` (18 fotogramas del clip actual, de la adenda); `S04-yt-dlp-flat-playlist-ultimos14.txt`; `S05-articulos-extracto.txt`; `S05-pinned-status-urls.txt`; `S11-trailer-transcripcion-forzada-es-DESCARTADA.json` — conservado como prueba del intento descartado).
