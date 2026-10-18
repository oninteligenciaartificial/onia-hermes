# Iman Gadzhi: análisis completo de contenido (2026-10-08)

> Lectura rápida (para Sergio Urcullo y la madre):
> 1. Su canal vive del **YouTube largo en inglés** (6,2 M de suscriptores; la pestaña Videos tiene **483 largos** y esta ficha cubre los **80 más recientes**, de oct-2023 a ago-2026; 0 Shorts). El TikTok (@realimangadzhi) es **otro negocio**: vlogs de pareja, entrevistas y clips de archivo, sin un solo CTA en los 8 vistos.
> 2. En 2026 los largos **con IA** rinden 2,6 veces más que los que no la nombran (mediana 509 mil contra 195,5 mil). Los dos que pasaron el millón son tutorial de una herramienta por niveles y lista de negocios con IA.
> 3. El sorteo de MacBook **no explica** los comentarios (0,6 a 5,0 por mil vistas con y sin sorteo). No es la palanca que se pensaba.
> 4. Corrección a `PLAN-REFERENTES.md`: Iman **no publica a diario** en YouTube: 7 largos entre el 24-jun y el 26-ago y nada en las 6 semanas siguientes.
> 5. Lo que sí se copia: rótulo de capítulo, mapa de niveles en el primer minuto, gancho de filtro de dolor, descripción de 2 líneas con un solo recurso y miniatura serial con número real.

Etiquetas de evidencia que se usan abajo:
- **[M]** medido por mí con ffmpeg, fotogramas leídos o datos de yt-dlp.
- **[G]** lo dijo Gemini (modelo `gemini-flash-lite-latest`). Es orientativo, no medido.
- **[T]** dato de un tercero (CreatorDB, WebFetch de una página pública).
- **[NV]** no se pudo verificar.

## 0. Cobertura

### 0.1 Catálogo mirado

| Red | Qué listé | Cómo | Límites |
|---|---|---|---|
| YouTube @ImanGadzhi (largos) | **80 videos** con vistas y duración (de oct-2023 a ago-2026). **Verificación 8-oct: la pestaña Videos tiene 483**; los otros 403 (2017 a oct-2023, incluidos 4 de los 5 más vistos del canal) no están en las tablas de §1 | `yt-dlp --flat-playlist` con fecha aproximada por mes. Para 14 videos pedí además fecha exacta, likes y comentarios con el cliente `mweb` | Las fechas del listado son por **mes aproximado**; solo los 14 de la tabla 0.2 tienen fecha exacta. Los Shorts no existen: yt-dlp responde que el canal no tiene pestaña de Shorts. `@imangadzhibusiness` no tiene pestaña Videos |
| TikTok @realimangadzhi | **120 publicaciones** con vistas, duración y fecha exacta (27-may al 8-oct-2026) | `yt-dlp --flat-playlist` | `@imangadzhi` no abre en yt-dlp (error de JSON). Los metadatos de cada video dicen `uploader=realimangadzhi` y `channel=Iman Gadzhi`. CreatorDB da 559,1 mil seguidores y 5,1 posts por semana para su TikTok, que cuadra en orden de magnitud con los 6,3 por semana que medí. Que sea la misma cuenta «Unscripted» del doc de ecosistema es [NV] |
| Instagram @imangadzhi | **12 posts de la grilla** (30-jun-2023 a 25-ago-2026) | WebFetch del perfil público, resumido por un modelo [T] | Sin vistas ni captions. El lector los rotuló todos «carrusel»: dato débil. **No pude ver ni un reel**. No intenté `fetch-video.mjs` porque no había una URL de reel verificada |
| Resto (X, Threads, LinkedIn, podcast) | No se miró | n/a | n/a |

Seguidores según CreatorDB (actualizado el 2-oct-2026) [T]: YouTube 6,2 M (+143 mil en 30 días), Instagram 3,13 M (engagement 7,2 %), TikTok 559 mil. Total 9,9 M. En YouTube la misma página dice 1,4 posts por semana y «última publicación hace 18 días» (hacia el 14-sep), que no coincide con mi listado (último largo el 26-ago). Puede haber una pieza fuera de la pestaña Videos. [NV]

### 0.2 Videos analizados a fondo (18 piezas: 10 largos, 8 TikToks)

**YouTube largo (10).** Método: **Gemini viendo la URL directa** (imagen y audio) con `GEMINI_MEDIA_RES=low`. Fecha, vistas, likes y comentarios son [M] (yt-dlp, 8-oct-2026).

| ID | Título (resumido) | Fecha | Duración | Vistas | Likes | Coment. |
|---|---|---|---|---|---|---|
| [wtDDjBOfTZo](https://www.youtube.com/watch?v=wtDDjBOfTZo) | Claude en 26 min (10 trucos, 3 niveles). **Reanálisis**: antes sin tabla de guion ni edición medida | 2026-07-22 | 26:27 | 1.489.901 | 42.732 | 5.300 |
| [DZoeGR_tatA](https://www.youtube.com/watch?v=DZoeGR_tatA) | 5 negocios con IA (método CLEAR). **Reanálisis** | 2026-07-09 | 36:31 | 1.471.295 | 50.692 | 4.200 |
| [_FGrUBi7Zno](https://www.youtube.com/watch?v=_FGrUBi7Zno) | Gemini en menos de 26 min (el más reciente) | 2026-08-26 | 23:45 | 380.785 | 9.359 | 1.900 |
| [q1g65sjQI-4](https://www.youtube.com/watch?v=q1g65sjQI-4) | Tier list de 17 negocios con IA | 2026-07-30 | 13:39 | 335.020 | 10.066 | 1.500 |
| [yjFqaRvrqpw](https://www.youtube.com/watch?v=yjFqaRvrqpw) | IA, despidos y economía en K (12 min) | 2026-06-24 | 12:47 | 113.797 | 4.454 | 199 |
| [9CjCs0q6XmY](https://www.youtube.com/watch?v=9CjCs0q6XmY) | Qué haría si fuera pobre a los 20 (6 habilidades) | 2026-07-02 | 17:21 | 155.096 | 6.345 | 274 |
| [_67MWD7XW9Q](https://www.youtube.com/watch?v=_67MWD7XW9Q) | La forma más perezosa de ganar con IA | 2025-09-17 | 26:06 | 1.663.345 | 52.278 | 4.900 |
| [6KB9h-FcD8Q](https://www.youtube.com/watch?v=6KB9h-FcD8Q) | La forma más perezosa de ganar online (Digital Products 2.0) | 2025-04-16 | 27:50 | 2.613.684 | 86.304 | 1.600 |
| [bcQY9UvfMF4](https://www.youtube.com/watch?v=bcQY9UvfMF4) | Desaparecer y volver irreconocible (7 reglas) | 2024-11-06 | 17:19 | 2.252.044 | 103.952 | 2.400 |
| [M0dAK6IQsSk](https://www.youtube.com/watch?v=M0dAK6IQsSk) | Mindset masculino, el más visto de los 80 recientes (4.º de los 483 del canal) | 2023-10-18 | 13:48 | 7.021.082 | 388.657 | 5.900 |

Solo metadatos (ya estaba analizado en `PLAN-REFERENTES.md`): [w-lkP9XcZfg](https://www.youtube.com/watch?v=w-lkP9XcZfg), ChatGPT en 28 min, 2026-08-18, 27:41, 638.975 vistas, 15.488 likes, 1.100 comentarios.

**Por qué esta selección.** Los 4 más vistos **de los 80 recientes** son de lifestyle y mindset de 2023-2024 (7,0 M, 3,2 M, 2,6 M, 2,6 M; re-medido el 8-oct) y no sirven a la marca de Sergio Urcullo. Tomé los 4 más vistos **del carril IA y negocio** (6KB9h, `_67MWD`, Claude, 5 negocios), el más visto de los 80 (M0dAK) como caso de estudio de un valor atípico, y bcQY9 (2,25 M) por ser la pieza de transformación personal más vista. Los más recientes son `_FGrUBi` (26-ago), ChatGPT (18-ago, solo metadatos) y tier list (30-jul). Un video por cada formato largo que usa: tutorial por niveles, lista o ranking, pizarra a mano, opinión y vlog de habilidades.

**TikTok (8).** Método: descargué el mp4 de cada uno, lo pasé por Gemini y **medí yo** cortes, volumen, color y posición de subtítulos con ffmpeg y fotogramas. Todos son de `@realimangadzhi`.

| ID | Qué es | Fecha | Duración | Vistas | Likes (% de vistas) |
|---|---|---|---|---|---|
| [7667596586159033622](https://www.tiktok.com/@realimangadzhi/video/7667596586159033622) | Skit de pareja en un coche deportivo (regalo caro) | 2026-07-28 | 25 s | 3,9 M | 260,9 mil (6,7 %) |
| [7655010350026345750](https://www.tiktok.com/@realimangadzhi/video/7655010350026345750) | Entrevista corta en estudio blanco (Daguestán y Khabib) | 2026-06-24 | 18 s | 3,6 M | 243,6 mil (6,8 %) |
| [7684710280072383766](https://www.tiktok.com/@realimangadzhi/video/7684710280072383766) | Skit de pareja en un descapotable (el chicle) | 2026-09-12 | 23 s | 3,2 M | 274,2 mil (8,6 %) |
| [7694348627237473558](https://www.tiktok.com/@realimangadzhi/video/7694348627237473558) | Skit del ramo de flores («¿platónico?») | 2026-10-08 | 23 s | 24,4 mil (1 día) | 2,3 mil (9,3 %) |
| [7693974857314323734](https://www.tiktok.com/@realimangadzhi/video/7693974857314323734) | Skit «¿los hombres deben cocinar?» | 2026-10-07 | 17 s | 42,7 mil | 3,1 mil (7,2 %) |
| [7692902336619891990](https://www.tiktok.com/@realimangadzhi/video/7692902336619891990) | Clip de archivo de 2019 (retainers, USD 100 mil al mes) | 2026-10-04 | 59 s | 40,3 mil | 3,8 mil (9,3 %) |
| [7688791086965312790](https://www.tiktok.com/@realimangadzhi/video/7688791086965312790) | Clip de archivo de 2018 (primer millón) | 2026-09-23 | 69 s | 87,7 mil | 6,9 mil (7,9 %) |
| [7684370826686123286](https://www.tiktok.com/@realimangadzhi/video/7684370826686123286) | Clip de archivo de 2017 (dejó el colegio) | 2026-09-11 | 65 s | 188,9 mil | 16,0 mil (8,5 %) |

Las vistas de los posts de menos de una semana están incompletas.

### 0.3 Lo que no se pudo ver

- **Instagram reels, carruseles y stories:** no pude abrirlos sin login. La sección de carrusel de §4 queda en [NV].
- **TikTok 7654620792822484246** («Highest highs and lowest lows», 35 s, 3,3 M de vistas, 321,9 mil likes): yt-dlp solo bajó un mp3, así que es un post de fotos con sonido. No vi las imágenes.
- **YouTube sin fotogramas:** YouTube pide login en toda descarga (bot-check). No usé cookies del navegador. Por eso la edición de los largos es [G] y no medí cortes ni colores en ellos. Leí las **12 miniaturas** a mano desde `i.ytimg.com`.
- **Gemini:** `gemini-flash` dio 429 de cuota, así que todo corrió con `flash-lite`, con 503 transitorios que se reintentaron. **Flash-lite se equivocó donde pude medirlo:** dijo 4 a 5 cortes por 10 s en un skit que mide 6,6, y 4 a 6 en los clips de archivo, que miden 1,0 a 2,5. Tomar los cortes por 10 s de los largos como piso y no como dato.
- **Transcripción literal:** no la hay. Los guiones están parafraseados y los tiempos son los que dio Gemini, con un margen de uno a tres segundos.
- **Contenido del lead magnet:** el enlace corto del prompt lleva a una página de Notion que el lector no renderizó. No sé qué hay adentro ni si pide correo.
- **Bug del repo para la madre:** `.claude/skills/ver-videos/scripts/gemini-see-video.mjs` **ignora el segundo argumento** (el prompt) en la línea de comandos y usa siempre su prompt por defecto. Lo usé importándolo como módulo.

### 0.4 Correcciones a lo ya escrito

| Dónde | Decía | Datos de hoy |
|---|---|---|
| `PLAN-REFERENTES.md`, «Qué NO copiar» | «Videos de 26 a 36 min a diario» | Iman publicó **7 largos en 63 días** (24-jun al 26-ago, uno cada 9 días) y luego **6 semanas sin largos**. No es diario [M] |
| `PLAN-REFERENTES.md`, «5 cosas para copiar» n.º 1 | El sorteo de MacBook es el motor de engagement | Comentarios por mil vistas: con sorteo 1,7 a 5,0; sin sorteo 0,6 a 4,5. No hay efecto claro [M]. Ver §1.5 |
| `PLAN-REFERENTES.md` | El método CLEAR (sin letras) | Es Competition, Longevity, Effort, Autonomy, Recurring (criterios de cada negocio) [G] |
| `REFERENTES-ECOSISTEMA.md` | El CTA de YouTube «no visible» | En las 3 descripciones que leí hay **1 o 2 líneas**: un enlace corto al recurso (solo en Claude y en el de Monetise) y/o un «mirá este otro video» [M] |

## 1. Estructura de contenido

### 1.1 Pilares y su peso

**YouTube.** 80 largos, clasificados por título (clasificación mía). Las medianas de los viejos suben porque acumulan vistas: para comparar mirá el recuadro de 2026.

| Pilar | Videos | % | Mediana de vistas | Máximo |
|---|---|---|---|---|
| Mentalidad, riqueza y hábitos | 31 | 39 % | 382 mil | 7,0 M |
| Lifestyle y vlog (autos, jets, «un día en la vida») | 23 | 29 % | 708 mil | 3,2 M |
| Negocio online y dinero (SMMA, productos digitales, marca personal) | 16 | 20 % | 505 mil | 2,6 M |
| IA (Claude, ChatGPT, Gemini, negocios con IA) | 10 | 13 % | 398 mil | 1,66 M |

| Cohorte (fecha aproximada) | Videos | Mediana de vistas |
|---|---|---|
| Antes de oct-2025 | 30 | 939 mil |
| Oct a dic-2025 | 30 | 349,5 mil |
| 2026 (ene a sep) | 20 | 220 mil |
| **2026 con IA** | **6** | **509 mil** |
| **2026 sin IA** | **14** | **195,5 mil** |

- El giro es nítido: de agencia y SMMA (2023-2025) a «productos digitales 2.0» y, desde mediados de 2025, a IA. **Matiz (verificado el 8-oct):** la IA no es nueva en su canal. Fuera de los 80 hay dos listas de 2023: «7 AI Tools That WILL Make You RICH» (2023-08-15, 2,83 M) y «HOW To Get RICH with A.I» (2023-05-09, 1,82 M), con casi 3 años más de edad que los de 2026 y, aun así, más vistas que el Claude de hoy (1,49 M). Ver el Anexo B. En 2026 el 30 % de sus largos nombra una herramienta de IA y rinde 2,6 veces más [M]. La edad de los videos mezcla el efecto: no puedo separar «la IA rinde» de «el canal se enfrió».
- Los 2 que pasaron el millón en 2026 son **Claude por niveles** (1,49 M) y **5 negocios con IA** (1,47 M). El más bajo del carril IA es el de **opinión macro sin herramienta ni número en el título** (113,8 mil). Es una hipótesis mía, con un solo caso.
- **Un número o precio en el título no es palanca probada:** 20 de 80 títulos tienen «$» y su mediana es 528 mil, igual que la del catálogo entero (528 mil) [M].

**TikTok @realimangadzhi.** 120 posts. En los 8 vistos el idioma es inglés y el tema es **lifestyle**: parejas en coches de lujo, entrevistas callejeras, sketches. **Ninguno de los 5 cortos habla de IA ni de negocios.** El tema de negocio solo aparece en 3 clips de archivo de 59 a 69 s [M+G].

### 1.2 Series recurrentes

| Serie | Títulos del catálogo | Resultado |
|---|---|---|
| **«Dame N minutos y te doy…»** | 6 (Claude 26, ChatGPT 28, 16 min «millonario», 12 min IA, 33 min coaching, 39 min YouTube) | Mediana 422 mil. Claude 1,49 M, el de 12 min 113,8 mil |
| **«La forma más perezosa de…»** | 3 (6KB9h 2,6 M, `_67MWD` 1,66 M, una de 2026 con 302 mil) | Es su serie más fuerte de 2025 |
| **«Aprendé X en menos de N min»** (la variante nueva del tutorial) | Gemini (380 mil) | Reemplaza el título de «10.000 horas» |
| **Un día o una semana en la vida** | 23 lifestyle | Mediana 708 mil, la más alta de los pilares, pero sin conexión con IA |
| **Grabé mi vida entera desde que era pobre** | 2 (431 mil y 208 mil; hasta 3 h 21 min) | Largo de archivo, no del tema IA |

### 1.3 Mezcla de formatos por red

| Red | Formato | Peso | Duración |
|---|---|---|---|
| YouTube (80) | 100 % horizontal largo | 0 Shorts | ≤10 min 1 %; 10-20 min **55 %**; 20-30 min 20 %; 30-60 min 20 %; >60 min 4 %. Mediana 18 min (2026: 21 min) |
| TikTok (120) | Cortos de ≤45 s | **95 %** (114) | Mediana 25 s (p25 22 s, p75 31 s) |
| TikTok (120) | Clips de 46 s o más | 5 % (6) | 47 a 163 s |
| Instagram | No visto | [NV] | [NV] |

De los 8 TikToks vistos: 5 de skit o entrevista (62 %) y 3 clips de archivo (38 %). Ese reparto no se extrapola al 95 % de cortos: solo sé por duración que 6 de 120 son largos.

### 1.4 Frecuencia

| Red | Cadencia medida |
|---|---|
| YouTube | 7 largos entre el 24-jun y el 26-ago-2026 (24-jun, 2-jul, 9-jul, 22-jul, 30-jul, 18-ago, 26-ago) y **ninguno desde entonces** [M]. Del listado, unos 25 largos entre nov-2025 y sep-2026 (fecha aproximada), esos 7 incluidos |
| TikTok | **120 posts en 134 días** = 0,9 por día (6,3 por semana). Por mes: jun 26, jul 27, ago 29, sep 28 [M] |
| Instagram | 4 posts de grilla en 2026 [T, débil] |

### 1.5 Qué rinde más y qué menos

**YouTube, 2026 con IA:**

| Video | Vistas | Likes / vistas | Comentarios por mil vistas | Sorteo MacBook |
|---|---|---|---|---|
| Claude por niveles | 1.489.901 | 2,9 % | 3,6 | Sí |
| 5 negocios con IA | 1.471.295 | 3,4 % | 2,9 | Sí |
| ChatGPT por niveles | 638.975 | 2,4 % | 1,7 | Sí |
| Gemini por niveles | 380.785 | 2,5 % | 5,0 | Sí |
| Tier list de 17 negocios | 335.020 | 3,0 % | 4,5 | No |
| IA y empleo (12 min) | 113.797 | 3,9 % | 1,7 | No |

En los de 2025, el de «perezoso con IA» pidió comentar «estoy dentro» y sacó 2,9 por mil; el de «perezoso online», sin pedido, sacó 0,6. **Conclusión honesta:** el sorteo no se separa del resto. Lo que mueve el número son la herramienta nombrada y el tema, no el premio.

**TikTok (120 posts):** mediana 268,6 mil, media 522 mil, p25 150 mil, p75 588 mil, p90 1,1 M, máximo 3,9 M. 14 posts (12 %) superan el millón; 48 (40 %) quedan bajo 200 mil.
- Los **más vistos** son todos cortos de 18 a 35 s y en inglés. Los 3 que vi son de pareja o entrevista y no llevan texto de venta.
- Los títulos con signo de pregunta (27) tienen mediana 365 mil; los que no (93), 245 mil [M].
- Los **clips de archivo de negocio** (≥46 s): mediana 164 mil contra 295 mil de los cortos. Su ratio de likes es igual (7,9 a 9,3 %): gustan lo mismo pero **llegan de 1,6 a 7 veces menos** que la mediana de los cortos (y hasta 20 veces menos que los skits top).
- Comentarios en TikTok: 0,05 a 0,5 por mil vistas. TikTok no conversa, solo da alcance.

### 1.6 Cómo se conectan el largo y el corto

- **No se recortan.** Los 8 TikToks vistos son material propio de otro género, no cortes de los largos. No hay enlace, ni palabra clave, ni «mirá el video completo» en ninguno [M+G].
- **El largo vende y el corto es de marca.** Según CreatorDB, TikTok tiene 559 mil seguidores contra 6,2 M de YouTube. Todo el embudo hacia la plata (§2.6) pasa por la descripción de YouTube.
- **Dentro del largo**, la marca de lujo (autos, jets, la oficina con el cartel de Consulting.com) cumple la función de prueba de estatus. El corto de TikTok es el mismo personaje en versión ligera.

## 2. Comunicación

### 2.1 A quién le habla

Hombres jóvenes, de 18 a 35, que quieren dinero y libertad y **no tienen experiencia**. La IA de 2026 aparece como palanca: «sin experiencia», «sin habilidades», «con cero empleados», «en 2 horas por día». Habla en inglés y no apunta a un rubro ni a un país. No le habla al dueño de un negocio real, sino al aspirante a tener uno. Esa es la diferencia central con Sergio Urcullo, que le habla al dueño de una clínica.

### 2.2 Tono y vocabulario [G]

- Frases cortas y directas. Ritmo estimado: 3,5 a 4,5 palabras por segundo en los tutoriales de herramientas y 2,5 a 3 en los de pizarra. En TikTok, 3,2 a 3,5.
- Voz de «hermano mayor» que ya pasó por lo mismo. Autoridad por logro propio, no por título.
- **Cada video crea una palabra propia:** «Lazy Model», «Digital Products 2.0», «Third Layer Theory», «Model Mismatch», «Influencer Arbitrage», «CLEAR», «Monk Mode». Los niveles Beginner, Intermediate y Advanced se repiten en los tutoriales.
- **Cierre ritual:** una frase de despedida («te miro desde lejos y apuesto por vos») aparece en 8 de los 10 largos analizados [G].

### 2.3 Promesa central

«Más plata, más eficiencia, menos trabajo aburrido» (rótulo de 3 ítems a 00:07 en el video de Gemini) [G]. Variantes: «hacerte rico de forma más fácil», «dominar la herramienta antes que los demás», «no es tarde todavía».

### 2.4 Tipo de prueba

| Tipo | Ejemplos vistos | Observación |
|---|---|---|
| **Pantalla real** | Interfaz de Claude, Gemini y Chrome; menús de modelos; Finder; Gmail con panel lateral | Es lo que más usa en los tutoriales [G] |
| **Método con nombre y tabla propia** | CLEAR (5 criterios), tier list S a F, criterios del «modelo perezoso» | Es su sello: puntúa en vez de opinar |
| **Número propio** | «Consulting.com ganó USD 10.000.000 en Whop» (rótulo a 00:01 del tier list), USD 92,7 M en productos digitales, USD 100 mil al mes en 2019 | Autodeclarado. [NV]. No se puede verificar |
| **Prensa** | Titulares de Forbes sobre despidos por IA (12 min) | Un solo video |
| **Archivo propio** | Clips de 2017, 2018 y 2019 con el año fijo en pantalla | Solo en TikTok |
| **Testimonio de terceros** | No apareció en los videos vistos | [G] |

### 2.5 Objeciones que contesta [G]

«No soy técnico» (Claude Code en lenguaje natural), «gasta muchos créditos» (cómo elegir modelo), «ya uso otra IA» (Gemini integrado en Gmail y Docs), «es demasiado tarde», «está saturado», «no tengo capital» (el problema del dropshipping y FBA), «no soy experto» (el experto es la IA).

### 2.6 Embudo hasta la plata

| Paso | Qué es | Evidencia |
|---|---|---|
| 1. Contenido gratis | YouTube largo, 12 a 37 min | [M] |
| 2. Descripción de 1 o 2 líneas | Un enlace corto (`link.consulting.com/…`) al recurso + «mirá este otro video» | [M]. Claude: enlace a un prompt + video siguiente. Gemini: solo el video siguiente. Perezoso online: solo la lista de espera de Monetise |
| 3. Recurso | Una página pública de Notion con el prompt. El enlace corto redirige a `educateio.notion.site`. No vi formulario de correo antes | [M]. Contenido [NV] |
| 4. Oferta barata | Digital Launchpad, USD 37 por mes, mencionado en un video de transformación personal [G]. USD 37/mes y beneficios por antigüedad según `REFERENTES-ECOSISTEMA.md` | [G] + doc previo |
| 5. Oferta por aplicación | Consulting.com (Apply y llamada de evaluación), Quantum, mastermind | Doc previo |
| 6. Monetise | **Inscripciones cerradas, lista de espera, sin precio** (hoy). Entregables: software propio (Synthesise, Flozy, GhostWriter OS, Shadow Operator Playbook) y marco de lanzamiento | [M], consulting.com/monetise, 8-oct-2026 |
| 7. Whop | Es co-owner. Los videos de negocio lo nombran como el lugar para vender productos digitales | [G] |

- **Un solo «video siguiente» para todo el carril IA (verificado 8-oct en 5 descripciones):** las de Claude, Gemini, 5 negocios y tier list apuntan al **mismo** video, `pPpb4t2eV2M` («Best Online Business to Make $10k+/month», 44:56, 432 mil), con una frase tipo «mirá este otro video donde desarmo el mejor modelo de negocio con IA». Es un video pilar al que todos los demás empujan. La quinta descripción (perezoso online) solo lleva la lista de espera de Monetise.
- **La escasez no es nueva:** la descripción del video de abril de 2025 ya decía «unite a Monetise cuando abra» (6KB9h, 2025-04-16). Son al menos **18 meses de lista de espera**. Es escasez de marketing, no de capacidad [inferencia mía].
- **Estructura de la página de Monetise (8 secciones, en orden):** encabezado con una descripción corta, aviso de inscripciones cerradas, qué es, entregables, sistemas internos, disponibilidad con botón «Join Waitlist», testimonios y pie legal. El precio no está.

### 2.7 CTA por red

| Red | CTA |
|---|---|
| YouTube (en el video) | «Dejá un comentario con tu tip favorito (y por qué) para entrar al sorteo del MacBook». En Claude, **verificado en 2 pasadas de Gemini el 8-oct: un bloque a los ~05:30-06:00 (rótulos «Giving away a MacBook» 05:31 y «Win a MacBook» 05:55, pedido de comentario 06:01) y un recordatorio a los ~26:07**. El pedido **no está en el arranque** (nada entre 00:20 y 01:30). La primera versión de la ficha decía cuatro (05:18, 14:10, 21:05, 26:05): los de 14:10 y 21:05 no se repitieron y se descartan. En Gemini: 01:24 a 01:36 y al final, con la condición de que el comentario hable de IA [G, sin recheck]. En «perezoso con IA»: comentar «estoy dentro» a los 05:38 [G, sin recheck] |
| YouTube (descripción) | Un solo enlace + el video siguiente [M] |
| TikTok | **Ninguno** en los 8 vistos. El caption es una pregunta corta o un comentario [M+G] |
| Instagram | [NV] |

## 3. Guiones

### 3.1 Fórmulas de gancho

| # | Fórmula | Ejemplo (parafraseado) | Dónde | Vistas |
|---|---|---|---|---|
| G1 | **Filtro de dolor**: te dice que te vayas si te gusta lo repetitivo | «Si te alegra hacer el mismo trabajo aburrido cada semana, cerrá el video» | Claude, ChatGPT | 1,49 M y 639 mil |
| G2 | **Contra la corriente de una herramienta** | «Todos miran Claude y ChatGPT, nadie mira esta» | Gemini | 381 mil |
| G3 | **Error masivo** | «La mayoría pierde años en negocios que suenan bien y no pagan» | Tier list | 335 mil |
| G4 | **Cambio de era** | «Hace 3 años no podía hacer este video con integridad» | Perezoso con IA | 1,66 M |
| G5 | **Redefinición con dos opciones en pantalla** | «No hay rico rápido, hay rico fácil» | Perezoso online | 2,6 M |
| G6 | **Dato con número** | «Casi 100.000 despidos este año por IA» | IA y empleo | 114 mil |
| G7 | **Arquetipo y cine** | Autos en blanco y negro saliendo del garaje, la historia de Bruce Wayne | Desaparecer | 2,25 M |
| G8 | **Mitad de conversación** (TikTok): el clip empieza ya hablando, con el primer rótulo en el cuadro 0 | «Quiero una cama inteligente, pero es carísima» | Skits | 3,2 a 3,9 M |
| G9 | **Pregunta binaria como caption** | «¿Los hombres deben cocinar o no?» | Skits | 42,7 mil |
| G10 | **Visión grande en voz de archivo** | «Mi meta final es revolucionar la educación» | Clip de 2019 | 40,3 mil |

Los largos con la mejor mediana de 2026 usan **G1** (filtro de dolor) y **G6** (dato con número, el de peor resultado). Con 6 casos no concluyo cuál gana.

### 3.2 Guiones desarmados

**Pieza A. Claude en 26 min (wtDDjBOfTZo, 1,49 M)** [G, tiempos con margen de 1 a 3 s]

| Tiempo | Qué dice (parafraseado) | Qué se ve | Función |
|---|---|---|---|
| 00:00-00:30 | Si te gusta lo repetitivo, andate; lo que viene es para salir de eso y tener un asistente tipo Jarvis | Animación 2D de un hombre armando algo; rótulo de 3 palabras (Same, Boring, Repetitive) a 00:03; corte a Iman | Filtro de audiencia y promesa |
| 00:30-01:25 | Confiesa que no es técnico y que le costó ponerse al día; las herramientas no traen manual y la gente usa un 10 % de su capacidad; anuncia 10 trucos en 3 niveles. **No menciona el sorteo ni el prompt en este tramo** (verificado 8-oct) | Rótulos «No Instruction Manual Found» con un contador de «Limiting power» de 99 % a 10 % (00:52-01:00), «Mastering Claude» (01:03), «Claude Levels» (01:16) con Beginner (01:15 a 01:24), Intermediate y Advanced | **Mapa de niveles en el primer minuto**; sin CTA todavía |
| 01:26-05:25 | Tips 1 y 2 (verificado: Tip 1 a 01:26, Tip 2 a 02:57): elegir bien el correo, configurar la memoria | Capturas de registro y ajustes; comparación con ChatGPT | Dos victorias rápidas de nivel principiante |
| 05:25-10:30 | Tip 3 a 05:25 (modelos y costo, modo de investigación) | Menú de modelos | Contesta la objeción de gasto de créditos |
| 05:31-06:01 | Sorteo: ya regaló un MacBook en el video anterior y muestra al ganador; pide comentar qué tip fue más útil y por qué | Rótulos «Giving away a MacBook» (05:31), «Win a MacBook» (05:55) y una pantalla de comentarios de YouTube (06:01) | **CTA al 20 % del video, el primero del video** |
| 10:30-14:15 | Tip 4 a 10:30 (skills), Tip 5 a 12:24 (evitar Projects) | Panel de skills | Fin del nivel principiante (Tips 1 a 5) |
| 14:15-18:20 | Tips 6 (conectores, 14:15) y 7 (extensión de Chrome, 16:34): nivel intermedio | Menú de conectores | Nivel intermedio. **Sin CTA verificado a 14:10** |
| 18:20-23:25 | Tip 8 (Cowork, 18:20) y Tip 9 (Claude Code para no programadores, 21:14) | Finder de macOS y un prompt; interfaz de código | Nivel avanzado; rompe «no soy técnico». Sin CTA verificado a 21:05 |
| 23:25-26:26 | Tip 10 (Claude Design, 23:25); a 26:07 repite el sorteo (comentar el tip más útil); despedida «te miro desde lejos y apuesto por vos» (literal en inglés, verificado) | Una web generada; comentarios de YouTube | Cierre con CTA |

**Pieza B. Tier list de 17 negocios con IA (q1g65sjQI-4, 335 mil)** [G]

| Tiempo | Qué dice | Qué se ve | Función |
|---|---|---|---|
| 00:00-00:56 | La mayoría pierde años en negocios que suenan bien y no pagan | Presentador y rótulo «Consulting.com earned $10,000,000 on Whop» (00:01) | Gancho de error común y autoridad autodeclarada |
| 00:56-01:08 | Va a rankear 17 negocios con IA de la nota S a la F | Tragamonedas animada y tier list vacía | Promesa de estructura |
| 01:08-07:05 | Un negocio por vez (bots de trading, UGC, clipping, dropshipping, agentes de voz, chatbots…) con su nota | Avatar 2D del propio Iman; la tabla se va llenando | Retención por lista con veredicto |
| 07:05-07:43 | Productos digitales: la mejor nota | Gráficos y captura de Whop | Pivote al negocio propio |
| 07:43-12:36 | Es co-owner de Whop; muestra resultados | Capturas reales y testimonios en pantalla | Prueba de autoridad |
| 12:36-13:40 | La IA no es el negocio, es palanca; pregunta si resuelve un problema real | Rótulo de la regla (12:37) | Cierre conceptual; sin CTA de venta |

**Pieza C. «La forma más perezosa de ganar con IA» (`_67MWD7XW9Q`, 1,66 M)** [G]

| Tiempo | Qué dice | Qué se ve | Función |
|---|---|---|---|
| 00:00-01:12 | Hace 3 años no podía hacer este video; la IA nivela el terreno | Sofá con luz ámbar; texto 3D flotante; Apple Pencil | Gancho de cambio de era |
| 01:12-03:32 | El problema «model mismatch»: dropshipping y FBA piden capital y horas | **Hoja a mano vista desde arriba** con íconos de Shopify y Amazon | Dolor del espectador |
| 03:32-05:52 | «Perezoso» significa el mayor retorno por esfuerzo | Gráfico de barras dibujado | Redefinición |
| 05:38-05:41 | Comentá «estoy dentro» | Texto en pantalla | **Único CTA**, a los 5 min |
| 05:52-13:08 | IA más productos digitales; 3 criterios (escala, riesgo, recompensa) | Diagrama circular en papel | Marco de evaluación |
| 13:08-19:39 | «Digital Products 2.0» para no expertos; analogía de la ruleta con giros infinitos | Ruleta dibujada, ejemplos de cursos | Analogía que baja el riesgo |
| 19:39-25:00 | Método de 3 pasos: capa de mercado, producto con IA, arbitraje de influencers | Pirámide; captura de un tuit de 44 mil seguidores | Método con nombre |
| 25:00-26:05 | Seguir mirando videos o actuar hoy; despedida | Hoja final | Cierre por contraste |

**Pieza D. IA, despidos y economía en K (yjFqaRvrqpw, 114 mil)** [G]

| Tiempo | Qué dice | Qué se ve | Función |
|---|---|---|---|
| 00:00-01:28 | Casi 100.000 despidos este año por IA y no baja | Autos de noche, entrada a una oficina, rótulo Consulting.com (00:09) | Gancho con dato |
| 01:28-05:30 | La mitad de los empleos de oficina podría desaparecer en 5 años; la IA reemplaza a quien no la usa | Gráficos en rojo, titulares de Forbes (03:16) | Urgencia y prueba de prensa |
| 05:30-07:40 | Casi todos usan la IA de forma superficial | En una limusina de noche | Rompe un mito |
| 07:40-09:33 | La economía en K | Animación neón sobre negro | Contexto |
| 09:33-11:40 | 3 pasos: sumergirte, aplicarla a un negocio existente para comprimir años en meses, no delegar el criterio | Primera clase de un avión; capturas de ChatGPT | Solución |
| 11:47-12:50 | Los próximos 5 años son la mayor oportunidad o una pesadilla; comentá si querés más tácticas (12:11) | Conduce un descapotable | Cierre con CTA suave |

**Pieza E. TikTok skit de 25 s (7667596586159033622, 3,9 M)** [M+G]

| Tiempo | Qué dice | Qué se ve | Función |
|---|---|---|---|
| 0-1,4 s | **Habla él** (medido con fotogramas): ya va por la mitad de una frase sobre una cama inteligente; el rótulo amarillo está en el cuadro 0 | Pantalla partida en dos mitades verticales (él arriba, ella abajo, bebiendo); rótulo **entero en amarillo** sobre la costura | Gancho en medio de la conversación |
| 1,4-6 s | Ella insiste en que lo quiere y que es muy caro | Primer corte a 1,36 s: cara completa de ella, rótulo **blanco**; siguientes cortes a 3,16, 4,2 y 6,08 s | Tensión entre deseo y precio |
| 6-12 s | Se ríen; ella dice que por eso puede confiar en él | Cortes a él; **filtro blanco y negro** en la risa | Pico cómico |
| 12-18 s | Insiste «en serio» y él promete anotarlo | Partida y cara completa alternadas | Giro de falsa seriedad |
| 18-25 s | Pide también una luz infrarroja; él no celebra Navidad; ella: «pero yo sí», señalando a cámara | Cara completa, dedo a cámara | Remate en los últimos 2 s |

**Pieza F. TikTok de archivo de 60 s (7692902336619891990, 40,3 mil)** [M+G]

| Tiempo | Qué dice | Qué se ve | Función |
|---|---|---|---|
| 0-5 s | Su meta es revolucionar la educación | Clip de 2019 en un cuadro 4:3 centrado en lienzo 9:16, con barras negras; rótulo «2019» fijo | Gancho de visión |
| 5-14 s | La edad le ayuda; cierra retainers grandes | Cambio de locación | Ventaja contraintuitiva |
| 14-24 s | Quiere estilo de vida, cuidar a su madre; la agencia paga su renta y un reloj de USD 60 mil | Pizarra, oficina | Aspiración y símbolo de estatus |
| 24-36 s | Sin padres ricos; a los 19 solo se hace eso con un dolor que otros no entienden | Fondo oscuro | Origen y sacrificio |
| 36-50 s | La gente ve que su agencia es real y dice que muestra a cada cliente | Monitor con luz roja | Transparencia |
| 50-60 s | Julio de 2019: primer mes con USD 100 mil de ganancia | Oficina, gesticula | Clímax numérico |

**Pieza G. TikTok entrevista de 18 s (7655010350026345750, 3,6 M)** [M+G]

| Tiempo | Qué dice | Qué se ve | Función |
|---|---|---|---|
| 0-4 s | Le pregunta si es musulmán por su nombre | Estudio blanco, planos medios alternados; la palabra clave en amarillo | Pregunta directa y curiosa |
| 4-8 s | Revela que es de Daguestán | **Un inserto aéreo vertical de ~1 s** a los 6 s | Sorpresa geográfica |
| 8-13 s | «¿De donde es Khabib?» | Plano con un gesto señalando | Cuelga de una celebridad |
| 13-18 s | Bromean que antes de Khabib nadie conocía el lugar y agradecen | Primer plano riéndose | Remate |

### 3.3 Recursos de retención

- **Mapa de niveles en el primer minuto** y rótulo de capítulo en cada tip (Claude: primer tip a 01:25; después uno cada 2 a 3 min; Gemini: a 01:48).
- **Numeración:** «Tip #n» y cada rótulo aparece dentro de 1 a 3 s de empezar el tema.
- **Open loops:** «el tip 9 es increíble», «el modelo ganador al final», «el ranking final».
- **Sorteo en dos golpes** (Claude, verificado: a los ~05:30-06:00 y a los 26:07). No se anuncia al principio: el arranque va limpio, solo con el filtro de dolor y el mapa de niveles.
- **Tabla que se va llenando** (tier list, ranking de 5 negocios).
- **Hoja a mano vista desde arriba** en vez de diapositivas (Perezoso con IA y Perezoso online).
- **Analogías** (receta de panadería, cuchillo de mantequilla, ruleta) para bajar un concepto abstracto.
- **Cambio de ubicación y vehículo** en los de lifestyle (gasolinera en Idaho, limusina, avión, descapotable) cada 2 a 5 min.

### 3.4 Cierres

- **Ritual:** misma despedida en 8 de 10 largos [G].
- **Cierre por contraste:** «seguir mirando videos esperando un milagro o actuar hoy» (Perezoso con IA).
- **Cierre por regla:** una frase que resume (la IA es palanca, no el negocio).
- **TikTok:** el remate de la broma, sin cierre de marca ni CTA.

### 3.5 Largo de frase y ritmo

| Formato | Ritmo | Fuente |
|---|---|---|
| Tutorial de herramienta | 3,5 a 4,5 palabras por segundo, pausas marcadas en cada transición de tip | [G] |
| Pizarra y reflexión | 2,5 a 3 | [G] |
| TikTok skit | 3,2 a 3,5; **5,6 a 6,6 cortes por 10 s** | [G] + [M] |
| TikTok de archivo | 3,2 | [G] |

## 4. Edición

### 4.1 Corto vertical (TikTok), medido

Datos [M] de ffmpeg y fotogramas sobre los 8 mp4 (1080x1920, 25 fps).

| ID | Duración | Cortes (umbral 0,35) | Cortes por 10 s | Volumen (LUFS) |
|---|---|---|---|---|
| 7667596586159033622 (skit) | 25,6 s | 17 | 6,6 | -11,6 |
| 7655010350026345750 (entrevista) | 18,4 s | 8 | 4,3 | -10,7 |
| 7684710280072383766 (skit) | 23,5 s | 15 | 6,4 | -8,4 |
| 7694348627237473558 (skit) | 23,1 s | 13 | 5,6 | -11,8 |
| 7693974857314323734 (skit) | 17,7 s | 10 | 5,6 | -13,2 |
| 7692902336619891990 (archivo) | 60,0 s | 6 | 1,0 | -9,7 |
| 7688791086965312790 (archivo) | 69,1 s | 17 | 2,5 | -7,7 |
| 7684370826686123286 (archivo) | 65,3 s | 16 | 2,5 | -9,1 |

Los skits y la entrevista se midieron con umbral 0,35 sobre el cuadro completo. Los clips de archivo, con umbral 0,25 **dentro del cuadro 4:3** (recorte detectado de 978x732 px), porque las barras negras bajan el puntaje de escena. Los fundidos suman menos de lo real.

- **Cortes:** skits 5,6 a 6,6 por 10 s (mediana 5,6); entrevista 4,3; archivo 1,0 a 2,5.
- **Layout del skit:** alterna **cara completa** y **pantalla partida en dos mitades verticales** (él arriba, ella abajo). El subtítulo cae **en la costura** de las dos mitades. Una sola cámara por persona, selfie dentro de un coche deportivo (asiento con logo GTS) o un descapotable, en mano o con soporte.
- **Subtítulos (medidos en el cuadro 10 del skit 7667…):**
  - Letra sans-serif en negrita, tipo Helvetica o Inter, sin caja ni contorno marcado.
  - **Blanco, con amarillo** (`#F4EC14`; en otro skit medí `#D9E915`, amarillo-lima). **Corrección del 8-oct, con fotogramas de 2 skits:** no hay una sola regla. En el skit de 3,9 M las frases de él (arriba, pantalla partida) van **enteras en amarillo** y las de ella en blanco, es decir, el amarillo marca al hablante de arriba. En el skit del ramo (7694…) todo es blanco y solo la palabra final («platonic.») va en amarillo. Si se copia, elegir UNA regla (propuesta: blanco + palabra de énfasis en el verde de la web).
  - **Centrados al 49-53 % del alto** (el centro del cuadro, a la altura del mentón; re-medido en 2 skits: ~51 % sobre la costura de la pantalla partida y ~52-55 % en cara completa).
  - **1 a 3 palabras por línea**, aparición palabra por palabra, **ya presentes en el cuadro 0**.
  - Alto del glifo ~69 px sobre 1920 (3,6 %).
- **Zooms:** no los medí. Gemini habla de saltos de corte que parecen zoom; el ritmo lo da el corte entre las dos personas.
- **Efecto:** **blanco y negro** durante ~3 s en el pico de la risa (cuadros de 8 s y 10 s del skit 7667…; también en el skit 7684710…, a los 16-20 s). Visto en 2 de 2 skits revisados.
- **B-roll:** solo en la entrevista, **un inserto aéreo vertical de ~1 s** a los 6 s. Los skits no llevan (en los 4 que vi).
- **Audio:** volumen integrado de **-7,7 a -13,2 LUFS (mediana -10,2)**. Más alto que el piso de -13 de Santiago (`edicion-referentes`). Música sutil o ausente y sin SFX relevantes [G].
- **Primeros 3 s, cuadro por cuadro** (skit 7684710…, a 25 fps, medido):

| t | Qué se ve |
|---|---|
| 0,0 s | Primer plano de él mirando hacia abajo; el subtítulo amarillo ya dice la primera frase |
| 0,3 a 0,5 s | Mismo plano, mismo rótulo |
| 1,0 s | Mismo plano, el rótulo cambió |
| 2,0 s | **Corte a ella**; rótulo en blanco |
| 3,0 s | Vuelve a él con otro rótulo |

  Primer corte entre 1 y 2 s, 2 cortes en los 3 s de apertura; nunca hay saludo ni logo.
- **Color y luz:** luz natural de día, tonos cálidos en la piel, sin gradación fuerte. En entrevistas, fondo blanco de estudio, luz pareja.
- **Clips de archivo (los de negocio, 59 a 69 s):**
  - El video original va **centrado en un lienzo 9:16 con barras negras**, ocupando ~978x732 px.
  - **Rótulo del año** (2017, 2018, 2019) en cursiva manuscrita, fijo al centro-abajo, todo el clip.
  - **Subtítulos chicos**, blancos, abajo a la izquierda del cuadro, de 4 a 8 palabras con **negrita en la palabra clave** y aparición suave palabra por palabra.
  - Cambio de locación y ropa visible en la hoja de contacto cada ~6 s; 1,0 a 2,5 cortes por 10 s. Capturas de ingresos y facturas intercaladas, según Gemini [G].
  - Volumen -7,7 a -9,7 LUFS.

### 4.2 Largo horizontal (YouTube) [G, sin fotogramas]

- **Cortes:** ventanas de 10 s que contó Gemini: apertura 3 a 4 cortes, cuerpo 2 a 3, cenital con hojas 1 a 2. Promedio **2 a 4 por 10 s**, con un cambio de plano o de pantalla cada 3 a 7 s. Es un piso (ver §0.3).
- **Presentador:** plano medio corto, fijo en trípode, sentado frente a una laptop. Escenarios: sala con chimenea de mármol negro y cuadro de Consulting.com y Whop en la pared; oficina con ventanal de ciudad al atardecer; mesa oscura con luz lateral y lámpara de vela; en las miniaturas de 2026 usa anteojos redondos. Los de lifestyle van en coches, jet y exteriores.
- **Tema visual por herramienta:** Claude en terracota y tipografía serif; ChatGPT en azul; Gemini en violeta y azul neón. El color y el subtítulo cambian por video.
- **Subtítulos:** no son un estándar: serif blanca con acentos terracota (Claude), cursiva manuscrita blanca con brillo azul (5 negocios), sans-serif en negrita con la palabra clave en azul neón (tier list), cursiva dorada (transformación), cursiva neón roja (12 min). De 1 a 5 palabras por línea. **El de «perezoso online» (2,6 M) no tiene subtítulos incrustados:** el texto vive en las hojas.
- **Rótulos de capítulo:** tarjeta oscura «Mastering X» a ~01:05, «X Levels» a ~01:10 con Beginner, Intermediate y Advanced en verde, azul y violeta, y «Tip #n Nombre» en cada cambio. Menú en cuadrícula con casillas y cápsulas de progreso (Beginner 1 % a 100 %).
- **Zooms:** push-in suaves sobre el rostro al cambiar de tema y entradas rápidas sobre capturas de pantalla.
- **Capturas de pantalla:** la herramienta real, en pantalla dividida (cara a la derecha, captura a la izquierda) o a pantalla completa con zoom.
- **Gráficos:** íconos 3D de cristal translúcido para numerar los 5 negocios; ilustraciones 2D o 3D del propio Iman (avatar tipo caricatura); animaciones vectoriales y neón sobre negro (economía en K); en los de pizarra, **hojas cuadriculadas escritas a mano vistas desde arriba**.
- **Música y SFX:** música lo-fi o electrónica corporativa de bajo volumen que sube en las transiciones. SFX de whoosh, clic de ratón, campanilla y zumbido en cada aparición de texto o gráfico.
- **Primeros 3 s (orientativo):**

| Video | 0 a 3 s |
|---|---|
| Claude | Animación 2D de un hombre armando algo; rótulo de 3 palabras a ~1 s; corte a Iman a los 3 s |
| Gemini | Iman a cuadro desde 0 s, **destello blanco a 0,5 s**, íconos de apps flotando a 1 s |
| 5 negocios | Círculo holográfico azul con «AI» de 0 a 1 s, Iman a 1 s, ilustración a 3 s |
| Tier list | Iman a 0 s, rótulo de autoridad a 1 s, animación a 1 s |
| Perezoso con IA | Iman con una Apple Pencil, texto 3D flotante que se completa en 3 s |
| Desaparecer | **Sin Iman**: autos en blanco y negro saliendo del garaje, 0 a 3 s |
| IA y empleo | Faro de un auto dorado, entrada de un edificio de noche, cartel Consulting.com |

  En ninguno hay saludo. En todos hay un texto o un rótulo en los primeros 3 s.
- **Color y luz:** ámbar cálido con la pantalla fría de la laptop; teal y naranja en los vlogs; blanco y negro cinematográfico en el de transformación.
- **Duración:** 12 a 37 min; mediana del catálogo 18 min.
- **Miniaturas (12 vistas por mí):**
  - **Cara centrada** con anteojos o en capucha, a la mitad del cuadro.
  - **Un número en dólares enorme** (USD 12.950 por mes, USD 100.000, USD 285 por día) o **2 a 4 palabras** («You're Not Late Yet», «Too simple to fail»).
  - **4 a 6 logos de herramientas** en fila o a los costados.
  - **Círculo rojo dibujado** sobre una palabra clave («Yet»).
  - Fondo oscuro o blanco, con alto contraste.
  - **Plantilla serial:** las miniaturas de Claude y ChatGPT son casi idénticas (el mismo texto «You're Not Late Yet» y la misma composición) con otro logo. La de Gemini, la más nueva, abandona la plantilla: un ladrillo de arcilla roto contra el ícono blanco de Gemini sobre azul.

### 4.3 Carrusel

**[NV]** No pude ver ni un carrusel de Instagram de Iman. El único dato es de TikTok: un post de fotos con sonido (7654620792822484246) con 3,3 M de vistas, cuyas imágenes no vi. El WebFetch del perfil público de Instagram lista solo 12 posts de grilla, 4 de ellos de 2026. Con esto no se puede sacar una receta. Pendiente: que la madre lo mire con el navegador.

## 5. Qué copia Sergio Urcullo YA

| # | Qué se copia | Evidencia | Dónde se aplica |
|---|---|---|---|
| 1 | **Mapa de niveles en el primer minuto y un rótulo de capítulo por tema.** «Prueba 1, Prueba 2, Prueba 3» o «Nivel 1, 2, 3», con una tarjeta que aparece dentro de 1 a 3 s de empezar cada tramo | Claude 1,49 M: el primer tip empieza a 01:25 y hay un rótulo en cada cambio | **Edición YouTube.** D01-C (martes 13, ~35 min): sumar la tarjeta de mapa antes del minuto 1 y los rótulos de cada prueba. Skill `editor-videos` |
| 2 | **Gancho de filtro de dolor.** Una frase que descarta al que no es: «si todavía contestás WhatsApp a mano, este video te sirve; si no, seguí», con un rótulo de 3 palabras en el cuadro 0 | G1 verificado en Claude (1,49 M, frase literal en inglés confirmada en 2 pasadas); en ChatGPT es [G] | **Guiones 9-15 oct.** S2-D08-A (lunes 12, la promesa del bot) y S2-D07-A (miércoles 14, la ventana de 24 h). Como gancho alternativo del yap |
| 3 | **Descripción de YouTube de 1 o 2 líneas:** un solo recurso y «mirá este otro video» | 3 de 3 descripciones leídas | **Publicación D01-C.** Una URL al recurso del video (el prompt del test, si Sergio Urcullo lo publica) y otra al siguiente video |
| 4 | **Recurso en una página pública enlazada con un acortador propio** (si pide correo o no, no se sabe) | `link.consulting.com/claude-monthly-checkin` responde 302 a `educateio.notion.site/Claude-Monthly-Check-In-Prompt-…` (verificado 8-oct); el contenido de la página no se pudo leer [NV] | **Comunidad.** El recurso de cada palabra (TRAMPA), además de en Avisos de WhatsApp, en una página pública con URL corta para que la descripción de YouTube pueda llevarla. Es el «archivo público de drops» que ya figura pendiente en `ONIA_COMUNIDAD_CONTENIDO.md` |
| 5 | **Miniatura serial:** cara centrada + logo de la herramienta + **un número real** + círculo rojo en una palabra | 12 miniaturas vistas; plantilla reutilizada en 2 de 3 | **Miniatura D01-C:** cara, logos de Claude y de los dos modelos, y los totales reales del test, «Bs 1.050», con círculo en la palabra que cierra. **Sin cifras de ingresos** |
| 6 | **Método con nombre y tabla de criterios propia** (CLEAR, tier list S a F, 3 criterios del «modelo perezoso») | Es su sello: ordena y justifica | **Asesoría de 20 min** y carruseles de la semana 2: ponerle nombre a la tabla de «qué automatizo primero» (propuesta de criterios: frecuencia, minutos por vez, errores, quién lo hace) y mostrarla puntuada con una tarea real |
| 7 | **Subtítulos de TikTok:** 1 a 3 palabras, centro del cuadro (49-53 % del alto), blanco con una palabra de énfasis en color. **Con el verde de la web como acento**, no amarillo | Medido en 2 skits de 3,2 a 3,9 M y en 2 skits recientes (cuadros leídos el 8-oct); la entrevista de 3,6 M no se re-vio | **Skill `edicion-referentes`.** Mismo centro del cuadro que la costura de Santiago. Solo cambia el color de énfasis |
| 8 | **Cierre ritual de una línea**, siempre la misma, propia de Sergio Urcullo | 8 de 10 largos de Iman | **Todos los guiones del 9 al 15 oct.** Una frase fija de despedida. Se decide con Sergio Urcullo |
| 9 | **Estado de disponibilidad visible en la oferta:** «cupo de 3 por semana» con botón de lista de espera | Monetise, 8 secciones en el orden de la página | **cal.com y landing de la asesoría.** El cupo es real (3 por semana), por eso se muestra. No fingir que está cerrado |
| 10 | **Gancho de dos opciones con numerales flotantes:** «tenés dos opciones con la IA: adoptarla o quedarte atrás», con un «1» y un «2» que aparecen en pantalla en los primeros 3 s y el subtítulo resaltado a 00:03 | `-qReeg7imGc` (2,83 M, 2023-08-15), [G] en una pasada, ver Anexo B | **Guion alterno del lunes 12 (S2-D08-A)**, en vez del filtro de dolor, para probar cuál retiene más. Con una sola pasada de modelo chico, tratar como hipótesis |

## 6. Qué NO se copia y por qué

| Qué | Por qué |
|---|---|
| **Sorteo de MacBook** | No se ve un efecto en los comentarios (§1.5) y cuesta plata con cero clientes. Un sorteo de asesoría choca con «Onia vende software, nunca horas» |
| **Cifras de ingresos en miniatura y rótulos** (USD 373 por día, USD 12.950 por mes, «USD 10 M en Whop») | Choca con «no fabricar cifras». Además, **no es una palanca probada**: los títulos con «$» tienen la misma mediana que el catálogo (528 mil) |
| **Mindset masculino del video de 7,0 M** («desexualizar el cerebro», «dejar de perseguir mujeres») | Es un valor atípico de 2023 fuera de tema y de riesgo para la marca. No es replicable |
| **Lifestyle de autos, jets y relojes** | Es su prueba de estatus y el 95 % de su TikTok. Sergio Urcullo no la tiene. La prueba de Sergio Urcullo es la pantalla real y los números propios de Onia |
| **Skits de pareja y entrevistas callejeras** | No tienen relación con negocio ni con IA. Los 5 cortos que vi no nombran ninguno de los dos temas |
| **Cortes de 5 a 7 por 10 s** | Son de dos personas cruzándose en un coche. Un monólogo a cámara se mantiene en el molde Santiago (3 a 5 s por cambio) |
| **Clips de archivo de 2017 a 2019** | Sergio Urcullo no tiene archivo, y esos clips afirman ingresos que no se pueden verificar. Llegan de 1,6 a 7 veces menos que la mediana de los cortos con el mismo ratio de likes |
| **Cadencia** | Iman publica ~0,9 por día en TikTok con equipo y ritmo de largos irregular (7 en 63 días y luego 6 semanas sin nada). Sergio Urcullo graba 1 h por día |
| **Negocios que enseña** (UGC, SMMA, reventa de agentes de voz, productos digitales) | Es otro negocio. No pasa el test de tres preguntas de `ONIA_ESTRATEGIA_DE_EMPRESA.md` |
| **Lista de espera permanente** | Al menos 18 meses de «inscripciones cerradas» es escasez de marketing. Con 3 cupos reales por semana se muestra el cupo real |
| **Whop, Launchpad, Quantum y masterminds** | Ya descartado en `REFERENTES-ECOSISTEMA.md`. Es otra etapa |
| **Público y país** | Habla a un aspirante global, en inglés. Sergio Urcullo le habla en voseo boliviano a un dueño de Santa Cruz |

## Fuentes (todas leídas el 2026-10-08)

**Datos medidos por mí**
- YouTube @ImanGadzhi, pestaña Videos: https://www.youtube.com/@ImanGadzhi/videos (yt-dlp `--flat-playlist`, 80 videos; metadatos exactos con el cliente `mweb` para 14).
- Descripciones de YouTube: https://www.youtube.com/watch?v=wtDDjBOfTZo, https://www.youtube.com/watch?v=_FGrUBi7Zno, https://www.youtube.com/watch?v=6KB9h-FcD8Q.
- Miniaturas: `https://i.ytimg.com/vi/<id>/maxresdefault.jpg` de los 12 IDs de §0.2.
- TikTok @realimangadzhi: https://www.tiktok.com/@realimangadzhi (yt-dlp, 120 posts) y los 8 videos de §0.2.
- ffmpeg 8-oct-2026: detección de escena, `ebur128`, `cropdetect`, fotogramas y color sobre los 8 mp4.

**Análisis de Gemini (`gemini-flash-lite-latest`)**: los 10 largos de §0.2 por URL; los 8 TikToks por archivo.

**Terceros**
- CreatorDB, Iman Gadzhi (actualizado 2-oct-2026): https://creatordb.app/creatorstats/imangadzhi/
- Instagram, perfil público leído con WebFetch: https://www.instagram.com/imangadzhi/
- Monetise: https://consulting.com/monetise
- Enlace del prompt: https://link.consulting.com/claude-monthly-checkin (redirige a `educateio.notion.site`, contenido no renderizado)
- OpusClip, artículo de mayo de 2024 sobre editar reels como Iman (solo menciona zoom de entrada, planos B y subtítulos; sin datos de este análisis): https://www.opus.pro/blog/how-to-edit-instagram-reels-exactly-like-iman-ghadzi

**Docs internos leídos antes de empezar:** `hermes-content/references/marca-personal/{PLAN-REFERENTES,REFERENTES-ECOSISTEMA,FORMULAS-REFERENTES,FICHAS-MONTAJE-REFERENTES,EXTRACCION-REFERENTES-GUIONES}.md`, `.claude/skills/edicion-referentes/SKILL.md`, `hermes-content/docs/cola/plan-3-semanas/{CALENDARIO-PUBLICACION-9-16-OCT,GRABAR-10-16-OCT}.md`.

## Apéndice A. Catálogo listado

### A.1 YouTube @ImanGadzhi, los 40 largos más recientes de los 80 listados

Fecha exacta (E) para los 14 que consulté uno por uno; para el resto, mes aproximado (A). Vistas redondeadas por YouTube.

| # | ID | Título | Fecha | Duración | Vistas |
|---|---|---|---|---|---|
| 1 | _FGrUBi7Zno | You're Not Late (Yet): Learn 98% of Gemini in Under 26 Minutes | 2026-08-26 (E) | 23:45 | 380 mil |
| 2 | w-lkP9XcZfg | Give Me 28 Minutes, I'll Give You 10,000 Hours of ChatGPT Knowledge | 2026-08-18 (E) | 27:42 | 638 mil |
| 3 | q1g65sjQI-4 | The Best AI Side Hustles To Start In 2026 (No Skills) | 2026-07-30 (E) | 13:39 | 335 mil |
| 4 | wtDDjBOfTZo | Give Me 26 minutes, I'll Give You 10,000 hours of Claude Knowledge | 2026-07-22 (E) | 26:27 | 1,40 M |
| 5 | DZoeGR_tatA | 5 Proven Ways To Make Money With AI (No Experience) | 2026-07-09 (E) | 36:31 | 1,40 M |
| 6 | 9CjCs0q6XmY | If I Was Broke In My 20s, Here's What I'd Do | 2026-07-02 (E) | 17:21 | 155 mil |
| 7 | yjFqaRvrqpw | Give me 12 minutes, I'll open your eyes to how to actually become rich using AI | 2026-06-24 (E) | 12:48 | 113 mil |
| 8 | oapvt-AaFpc | Move Out of Your Hometown (If You Want To Win At Life) | 2026-06 (A) | 13:16 | 181 mil |
| 9 | NqPHDrQwiro | Give me 16 minutes and I'll brainwash you into thinking like a Millionaire | 2026-04 (A) | 16:04 | 374 mil |
| 10 | O6DrQJ5OOlU | How Using 'Dark Motivation' Made Me Rich | 2026-04 (A) | 8:48 | 132 mil |
| 11 | 1QBBldKX4k8 | What to do when you feel like doing NOTHING | 2026-04 (A) | 11:56 | 138 mil |
| 12 | pPpb4t2eV2M | Best Online Business to Make $10k+/month In 2026 (Beginner Friendly) | 2026-04 (A) | 44:56 | 432 mil |
| 13 | bhmWna98Pso | How To Become Unrecognizably Successful in 2026 | 2026-04 (A) | 15:18 | 201 mil |
| 14 | 70VdZlYh8WI | 7 Books I Wish I Had Read Earlier | 2026-03 (A) | 22:10 | 123 mil |
| 15 | HI-DtZ9WEIs | Future Billionaire Shares Expensive Life Lessons From 2025 | 2026-03 (A) | 36:21 | 136 mil |
| 16 | dRVUVBd8FJo | Day In The Life of A Future Billionaire | 2026-03 (A) | 66:40 | 232 mil |
| 17 | pcWp2vAC5N4 | The Psychology of Getting Rich | 2026-02 (A) | 12:31 | 190 mil |
| 18 | pe9ZXIwMBBM | I Recorded My Entire Life Since I Was Broke | 2026-01 (A) | 201:10 | 208 mil |
| 19 | H895ZcG13Hg | Disappear And Come Back Unrecognizable In 3 Months | 2026-01 (A) | 20:29 | 865 mil |
| 20 | HXgbEMBhRx0 | Laziest One-Person Business Model To Start in 2026 ($100/day+) | 2026-01 (A) | 35:48 | 302 mil |
| 21 | Mp2i27w8KPQ | Copy & Paste THIS Strategy to Make $13k/Month with AI in 2026 | 2025-12 (A) | 13:32 | 202 mil |
| 22 | eIvHH8qQOfc | How To Start SMMA For Beginners In 2026 With $0 | 2025-12 (A) | 54:07 | 221 mil |
| 23 | i_36dg1t0e4 | These 3 AI Businesses Will Make You $373/Day (With Zero Employees) | 2025-11 (A) | 23:34 | 251 mil |
| 24 | HgORJd9rNxw | Day In The Life of a Future Billionaire In NYC | 2025-11 (A) | 26:12 | 321 mil |
| 25 | TMiBSmts7hU | If you're trying to get RICH and in your 20s or 30s, please watch this. | 2025-11 (A) | 13:21 | 289 mil |
| 26 | _67MWD7XW9Q | Laziest Way To Make Money With AI ($373/day+) | 2025-09-17 (E) | 26:06 | 1,60 M |
| 27 | G3kpTqTEAJU | The SMARTEST Way to Capitalize on the AI Gold Rush | 2025-08-20 (E) | 19:12 | 416 mil |
| 28 | A-yBamfrXQs | Copy This Method To Make $2,700/Week with Digital Products | 2025-08-13 (E) | 39:21 | 567 mil |
| 29 | 0jk1zGhHb-g | Copy & Paste THIS Strategy To Make Your First $1,000 Online | 2025-08-07 (E) | 17:21 | 759 mil |
| 30 | US47EpxBVHk | Build A One-Person Business As A Beginner (From $0 To $10K) | 2025-10 (A) | 18:16 | 446 mil |
| 31 | OImjfwCujYo | Making MONEY Online is a VIDEO GAME. Here's how to WIN.. | 2025-10 (A) | 19:37 | 238 mil |
| 32 | c0rNGr5ztR8 | I Bought a $75,000,000+ Business | 2025-10 (A) | 37:08 | 515 mil |
| 33 | D_z6n9CO_bc | 17 Money Lessons (I Wish Someone Had Told Me) | 2025-10 (A) | 30:45 | 510 mil |
| 34 | Qw5JcPUATV4 | You're Not Behind: Why Everyone SEEMS To Have More Money Than You | 2025-10 (A) | 24:50 | 227 mil |
| 35 | x5n0nlnTTm8 | How to Escape the "Rat Race" Without Quitting Your 9-5 | 2025-10 (A) | 18:03 | 179 mil |
| 36 | d1xFvRD2knU | Unf*ck Your Life - 7 Productivity Rules of The Top 1% | 2025-10 (A) | 11:48 | 363 mil |
| 37 | SOkYlgDsMDQ | it took me 25+ years to realize what i'll tell you in 13 minutes | 2025-10 (A) | 13:21 | 298 mil |
| 38 | AqTbTxC3R60 | You're not POOR. You're just lacking these skills | 2025-10 (A) | 12:32 | 225 mil |
| 39 | 6KB9h-FcD8Q | Laziest Way to Make Money Online In 2026 ($100/day+) | 2025-04-16 (E) | 27:50 | 2,60 M |
| 40 | 8HZ2PuECPbY | I just became Co-Owner of Whop... | 2025-10 (A) | 27:13 | 336 mil |

Los 40 restantes (2023-2025, mediana 939 mil de los 30 anteriores a oct-2025) están contados en §1.1 y no se repiten acá. El más visto de los 80 es M0dAK6IQsSk (7,0 M). **Corrección:** el más visto de todo el canal es `1-izXBhkiHw` (7 principios para adolescentes millonarios, 2023-06-13, 8,10 M), seguido de `KMWx15H0SFs` (7,3 M) y `XjV4HYZTJB8` (7,1 M); M0dAK es el 4.º. Las vistas de esta tabla están **truncadas** por el listado (Claude figura 1,40 M y mide 1,49 M), no redondeadas.

### A.2 TikTok @realimangadzhi, los 12 más vistos de 120

| # | ID | Caption | Fecha | Duración | Vistas |
|---|---|---|---|---|---|
| 1 | 7667596586159033622 | Always there to help! | 2026-07-28 | 25 s | 3,90 M |
| 2 | 7655010350026345750 | Thank you Khabib! | 2026-06-24 | 18 s | 3,60 M |
| 3 | 7654620792822484246 | Highest highs and lowest lows | 2026-06-23 | 35 s | 3,30 M |
| 4 | 7684710280072383766 | Next time I'm not picking... | 2026-09-12 | 23 s | 3,20 M |
| 5 | 7685470059799612694 | wtf was that? | 2026-09-14 | 23 s | 2,40 M |
| 6 | 7675747862650785047 | Surprise surprise! | 2026-08-19 | 27 s | 1,90 M |
| 7 | 7653137912275438870 | People really like this!? | 2026-06-19 | 24 s | 1,80 M |
| 8 | 7648740975745043734 | Can't cancel my meetings! | 2026-06-07 | 25 s | 1,50 M |
| 9 | 7680960673110691094 | She was so happy when she found out! | 2026-09-02 | 32 s | 1,40 M |
| 10 | 7653501215518526742 | Bros forever! | 2026-06-20 | 38 s | 1,40 M |
| 11 | 7662759033979358486 | Karma is real! | 2026-07-15 | 39 s | 1,30 M |
| 12 | 7650572157700902166 | Did she pass!? | 2026-06-12 | 29 s | 1,10 M |

### A.3 TikTok, las 12 publicaciones más recientes (vistas incompletas)

| ID | Caption | Fecha | Duración | Vistas |
|---|---|---|---|---|
| 7694348627237473558 | I still think it's platonic. | 2026-10-08 | 23 s | 24 mil |
| 7693974857314323734 | Should guys cook or no? | 2026-10-07 | 17 s | 43 mil |
| 7693600898869693718 | Hopefully we'll never find out... | 2026-10-06 | 22 s | 72 mil |
| 7693226911631281410 | It's time to get serious... | 2026-10-05 | 22 s | 86 mil |
| 7692902336619891990 | At 19 I was locking in huge retainers, running an agency that paid fo... | 2026-10-04 | 59 s | 40 mil |
| 7692125705630551318 | The disrespect was real | 2026-10-02 | 26 s | 305 mil |
| 7691770643448237314 | We are so different... | 2026-10-01 | 34 s | 517 mil |
| 7691373841951624470 | Noo way! | 2026-09-30 | 19 s | 179 mil |
| 7691029506995309846 | First breakup is always the hardest | 2026-09-29 | 17 s | 205 mil |
| 7690622059243670806 | Guess who's back! | 2026-09-28 | 44 s | 567 mil |
| 7689925567709252886 | You will still win | 2026-09-26 | 23 s | 94 mil |
| 7689519554023689494 | Work comes first. | 2026-09-25 | 22 s | 658 mil |

### A.4 TikTok, las 6 publicaciones de 46 s o más

| ID | Caption | Fecha | Duración | Vistas |
|---|---|---|---|---|
| 7692902336619891990 | At 19 I was locking in huge retainers, running an agency that paid fo... | 2026-10-04 | 59 s | 40 mil |
| 7688791086965312790 | I used to watch my mom clip coupons every morning. I'd come downstair... | 2026-09-23 | 69 s | 88 mil |
| 7684370826686123286 | I dropped out of school at 17. Signed some clients, lost half of them... | 2026-09-11 | 65 s | 189 mil |
| 7680636620210490646 | I was 16 in this video. Walking around with a camera in front of my f... | 2026-09-01 | 64 s | 245 mil |
| 7669563890023353622 | my mother begging me to slow down, my girl praying it's not too long ... | 2026-08-02 | 163 s | 180 mil |
| 7652031955994791190 | Another bad boy in the fleet! | 2026-06-16 | 47 s | 148 mil |

## Anexo B. Verificación del 8-oct y huecos llenados

### B.1 Qué se re-chequeó contra la fuente (8 afirmaciones)

| # | Afirmación | Resultado |
|---|---|---|
| 1 | «80 largos» y «el más visto del canal es M0dAK (7,0 M)» | **Cayó.** La pestaña Videos tiene 483; M0dAK es el 4.º (8,10 M, 7,3 M y 7,1 M lo superan, los tres de 2023). Las estadísticas de los 80 sí se reprodujeron (mediana 528 mil; 20 títulos con «$» de mediana 528 mil; duraciones 1 / 44 / 16 / 16 / 3) |
| 2 | Cohorte 2026: IA 509 mil contra 195,5 mil | **Se sostiene** (recalculado con el listado: 6 contra 14 videos, medianas 509,5 mil y 195,5 mil). Depende de fechas aproximadas por mes |
| 3 | 7 largos entre 24-jun y 26-ago y ninguno después; vistas, likes y comentarios de los 7 | **Se sostiene** (fechas exactas por `mweb`; vistas dentro de 0,1 % de lo escrito). No existen pestañas Shorts ni Streams |
| 4 | TikTok: vistas y fechas de los 4 posts rechequeados (3,9 M, 3,6 M, 3,2 M, 40,4 mil) y comentarios de 0,05 por mil | **Se sostiene.** El listado de las 120 publicaciones no se pudo repetir: yt-dlp ya no abre el perfil (mismo error de JSON) |
| 5 | Edición medida del skit 7667… y 7694… (cortes y volumen) | **Se sostiene exacto** con ffmpeg: 17 cortes y -11,6 LUFS; 13 cortes y -11,8 LUFS; 1080x1920 a 25 fps. Cayó el detalle del color de subtítulo (ver §4.1) y el primer segundo del guion de la pieza E |
| 6 | Descripciones de YouTube de 1 o 2 líneas | **Se sostiene** (5 leídas, no 3) y se encontró el patrón del video pilar (§2.6) |
| 7 | Claude en 26 min: gancho, mapa de niveles, 4 CTA de sorteo | Gancho y mapa de niveles **se sostienen**; los 10 tips tienen minuto exacto (§3.2, pieza A). **Cayeron** los 4 CTA y «anunciado al principio» |
| 8 | Monetise: inscripciones cerradas, lista de espera, sin precio, 4 entregables con nombre | **Se sostiene.** La página lista además secciones propias de cada entregable y un bloque de testimonios |

Sin rechequear (queda como lo escribió el autor): Instagram, las 12 miniaturas, los guiones de las piezas B a D, G y F, la despedida en 8 de 10 largos (confirmada solo en Claude), el ritmo de palabras por segundo.

### B.2 Hueco llenado: la lista de 7 herramientas de IA de 2023 (`-qReeg7imGc`)

Nadie la había mirado y es la pieza de IA con más vistas que encontré por título en el canal antes de 2026. 2023-08-15, 12:48, 2.828.442 vistas, 122.259 likes (4,3 %), 1.200 comentarios (0,4 por mil). Método: Gemini `flash-lite` por URL, **una pasada**, resolución baja [G]. Sin fotogramas medidos.

- **Mensaje.** A creadores, emprendedores y profesionales. Promesa: de todas las herramientas de IA, 7 que sí ayudan a ganar más o a ahorrar tiempo. Prueba: demostración de cada herramienta en pantalla real. **Sin CTA de comentario, sorteo ni venta**; cierra animando a ponerse a trabajar (~12:20).
- **Gancho (0-3 s).** «Tenés dos opciones con la IA: adoptarla o quedarte atrás». A 00:03 sube el rótulo «You have two choices» con un «1» animado en la esquina. A 00:21 «That's simply NOT TRUE» desmonta que las herramientas de IA sean inútiles.
- **Estructura por tramos (7 herramientas, mismo molde).**

| Tramo | Herramienta | Qué hace | Duración |
|---|---|---|---|
| 00:00-00:51 | Introducción | Filtro de herramientas inútiles | 51 s |
| 00:51-04:10 | 10Web y Durable | Sitios web con IA | 3:19 |
| 04:10-05:13 | Opus Clip | Cortes verticales con detección de hablante | 1:03 |
| 05:13-06:03 | ChatGPT Writer | Correos con IA | 0:50 |
| 06:03-07:45 | Tidio | **Chatbot de atención al cliente** | 1:42 |
| 07:45-08:47 | DocuAsk | Preguntas sobre documentos largos | 1:02 |
| 08:47-10:09 | Microsoft Copilot | Asistente de productividad | 1:22 |
| 10:09-12:20 | Adobe Firefly | Imagen generativa | 2:11 |
| 12:20-12:47 | Conclusión | Cuál conservar | 0:27 |

- **Edición [G].** Plano medio fijo con luz azul y roja; cortes de 3 a 5 s en la apertura; subtítulos sans-serif en negrita, blancos con palabra clave en amarillo, 1 a 4 palabras por línea, aparición palabra por palabra; **rótulo con el nombre de cada herramienta** al empezar su tramo (04:14, 05:51, 06:26, 08:26, 08:56, 11:06); capturas reales de cada interfaz (ChatGPT, extensiones de Chrome, WordPress, Teams); gráficos vectoriales y contadores; zooms digitales suaves; lo-fi con whoosh y clic en cada rótulo; sin b-roll.
- **Qué enseña.** (a) Dentro del propio catálogo de Iman, el formato «lista de herramientas, un tramo de 1 a 3 minutos por herramienta» ya tuvo 2,8 M en 2023, así que el actual «un tutorial por niveles» no es el único que rindió. (b) El chatbot (Tidio) es una herramienta de la lista, no el titular: coincide con la regla de Onia de que el bot es un add-on. (c) Sin CTA y con 0,4 comentarios por mil: confirma que el comentario no se explica por el pedido (§1.5).
- **Lo que no se puede decir:** que se pueda repetir en 2026. Tiene 3 años de ventaja de edad sobre el Claude de hoy y se publicó cuando las listas de herramientas de IA eran lo nuevo.

### B.3 Otros huecos tocados

- **Primeros 90 s del Claude en 26 min** (pieza A): confesión de no ser técnico, «no hay manual de instrucciones» con un contador de «poder limitado» de 99 % a 10 %, y recién después el mapa de niveles (§3.2).
- **Primeros 3 s cuadro por cuadro del skit 7667…:** cuadros a 0, 0,5, 1, 1,5, 2, 3, 8 y 10 s leídos a mano (§3.2, pieza E). El blanco y negro aparece a los 10 s sobre la pantalla partida durante la risa, lo que confirma el efecto del §4.1.
- **Sin llenar:** Instagram (necesita el navegador de la madre), el carrusel de fotos de TikTok, el contenido de Notion y el interior de Digital Launchpad, y la segunda pasada con Gemini `flash` (sigue sin cuota).
