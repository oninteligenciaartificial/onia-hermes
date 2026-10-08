# Enrique Rocha: analisis completo de contenido (2026-10-08)

Referente de la marca personal de Sergio Urcullo (@soyenriquerocha / tododeia). Esta ficha mide el montaje en movimiento y el catalogo completo, que los docs previos no tenian (`PLAN-REFERENTES.md`, `REFERENTES-ECOSISTEMA.md`, `FICHAS-MONTAJE-REFERENTES.md`, `FORMULAS-REFERENTES.md`).

Etiquetas de evidencia: **[M]** medido por mi con ffmpeg/numpy sobre el mp4 · **[V]** visto en fotogramas (contact sheets leidas con vision) · **[G]** solo lo dijo Gemini (modelo chico, falla) · **[D]** sale de un doc previo del repo · **[I]** inferencia mia · **[NV]** no verificado.

## Lectura rapida (lo que cambia)

1. **Su motor es Instagram, no TikTok ni YouTube.** Mediana de un reel de IG 72,8 mil vistas (4-ago a 3-oct) [D]; mediana de TikTok 1,3 mil (29-sep a 8-oct) [M]: ~55 veces menos, pero son ventanas y cuentas de vistas distintas, tomalo como orden de magnitud. El caso limpio es el mismo master en las dos redes: design.md IG 466 mil, TikTok 88 mil (5,3 veces); Claude + Instagram IG 301 mil, TikTok 8,3 mil (36 veces) [M+D].
2. **Parte de lo que sube a TikTok son masters de IG resubidos, pero no todo.** Verificado por cortes identicos al decimo de segundo en **2 casos** (design.md; Claude se conecta a Instagram). **No coinciden** (distinta duracion o distinto corte) GPT-6 Astra (IG 53 s vs TikTok 85 s) ni "los 4 equipos" frente al Socio (89,8 s sin cortes vs 10 cortes). Ademas el volumen no cierra: IG saca ~1,3 reels por dia y TikTok 5-6, asi que la mayoria de TikTok es produccion propia de TikTok y Shorts, no copia de IG. TikTok era de reflexiones y retos hasta el 28-sep-2026 (mediana ~700 vistas); desde el 29-sep sube 5-6 piezas por dia, todos los dias, sin faltar uno [M]. Los **Shorts ya salian ~3 por dia desde el 25-ago** y subieron a 5-6 por dia el 28-29-sep (fechas leidas de cada pagina de Short) [M].
3. **La edicion es mas barata de lo que dicen los docs previos.** Toma continua de cara a camara + 2-7 inserts de pantalla, 0-2,1 cortes duros cada 10 s (mediana ~1,1), tomas de cara de 16 a 45 s sin corte [M]. No es "un corte cada 3-4 s".
4. **Los subtitulos no llevan color.** Son blancos, en minusculas, de 1-3 palabras. El color/resaltado lo hace una caja blanca aparte con texto negro [V]. Los docs previos decian "palabra clave en amarillo": no se vio en ningun fotograma.
5. **Lo que rinde es "construir algo concreto" y "ahorrar la cuenta", no la noticia del modelo.** Construir/agentes/cuenta = 80% de las vistas de TikTok con 59% de las piezas. Noticias de modelos = 1% de las vistas con 9% de las piezas [M]. Ojo: poner el nombre del modelo en el gancho no hace noticia. El reel de IG "GPT6 Astra + Fable5.1" (464 mil) es un tutorial de ahorro (instalar el plugin de Codex en Claude Code en 3 lineas) [V], igual que "Cuando Claude no puede, Codex lo termina" (13,6 mil en TikTok).
6. **Su "recurso gratis" es un repo propio en GitHub** (whatsapp-agentkit 529 estrellas, the-architect 535, open-carrusel 479), mas una boveda de 299 guias. El reel lo anuncia; el repo es el iman [D+web].
7. **Senal de calidad real: guardados.** Los tutoriales que pegan tienen 5,6-7,6% de guardados sobre vistas; el sketch de comedia, 1,1% [M].

## 0. Cobertura

### 0.1 Catalogo mirado

| Red | Que se listo | Con que | Vistas | Fecha |
|---|---|---|---|---|
| TikTok | **234 videos** (el perfil dice 237), de 2021-05 a 2026-10-08 | yt-dlp `--flat-playlist` con `--impersonate chrome-133` (sin eso falla el JSON) | si, todas | si, todas |
| YouTube | **166 Shorts** (la primera pasada leyo solo 80: el listado se cortaba). El canal **no tiene pestana de videos largos** (yt-dlp: "does not have a videos tab") | yt-dlp sobre `/shorts` y fecha por `curl` a cada pagina del Short (campo `uploadDate`; yt-dlp por video falla con anti-bot) | si, redondeadas (p. ej. 1,2K) | **si** (verificacion): de 18-may a 8-oct-2026 |
| Instagram | **11 reels con vistas y fecha** [D] + estadistica agregada de 77 reels (4-ago a 3-oct) [D] | docs previos de la madre (IG no lista bien) | si | si |
| Threads | 4 posts recientes | WebFetch | likes solo (4-18) | relativa ("12h", "1d") |
| GitHub | 31 repos publicos | WebFetch | estrellas | si |
| Web | tododeia.com (inicio, /community, /llamadas, /tienda/claude-de-cero-a-cien) | WebFetch, hoy | n/a | 2026-10-08 |

Total de piezas con vistas: 234 + 166 + 11 = **411** (mas 77 reels de IG solo en agregado).

TikTok, estadistica de la cuenta completa [M]: mediana 827 vistas, media 5.008, maximo 87.900. Por era:

| Era | Piezas | Mediana | Max | Contenido |
|---|---|---|---|---|
| feb-2024 | 21 | 25.700 | 32.300 | lifestyle y motivacion ("Dia 40-47, soy Enrique Rocha"). Su pico anterior en TikTok |
| oct-2025 | 3 | 1.298 | 3.122 | serie "ChatGPT resuelve tu vida" |
| dic-2025 a feb-2026 | 92 | ~700 | 9.515 | reflexiones, retos 100 dias (peso, hablar en publico). El 12-feb sube "No dejes que ChatGPT te mienta" (9,5 mil en TikTok, **2,1 M en IG**) |
| **29-sep a 8-oct-2026** | **56** | **1.328** | **87.900** | todo Claude. Es el bloque que se analiza abajo |

### 0.2 Analizado a fondo (14 videos + 1 carrusel; los 2 reels de IG de las filas 14-15 son de la verificacion)

Todos bajados y medidos. Metodo: **Gemini** (`gemini-flash-latest` dio 429 "exceeded your current quota", un solo intento; pase a `gemini-flash-lite-latest`, que si respondio) en 1 a 3 pasadas por video (analisis en 4 bloques en los 12; tabla de guion en 7; transcripcion literal en 9, solo para contar palabras, no se guarda) + **ffmpeg/numpy** (cortes duros, saltos de cuadro, LUFS, silencios, piso de ruido) + **12 fotogramas repartidos + 6 del gancho por video, leidos con vision**.

| # | Pieza | URL | Fecha | Dur. | Vistas | Likes / coment. / compart. |
|---|---|---|---|---|---|---|
| 1 | TT design.md ("Diseña páginas web BIEN") | https://www.tiktok.com/@soyenriquerocha/video/7693013578307308820 | 5-oct | 57,9 s | 87.900 | 7.294 / 71 / 926 |
| 2 | TT "Claude no te vuelve a construir basura" | https://www.tiktok.com/@soyenriquerocha/video/7693338326664776981 | 6-oct | 66,3 s | 62.400 | 4.367 / 72 / 807 |
| 3 | TT "Opus 5.5 tu agencia de anuncios" | https://www.tiktok.com/@soyenriquerocha/video/7691158012496448820 | 30-sep | 80,2 s | 59.900 | 4.728 / 160 / 1.468 |
| 4 | TT "Agente de WhatsApp con Claude" | https://www.tiktok.com/@soyenriquerocha/video/7692920755184504116 | 4-oct | 83,2 s | 42.400 | 2.448 / 258 / 524 |
| 5 | TT "Todos los agentes que necesitas" | https://www.tiktok.com/@soyenriquerocha/video/7692549505438272774 | 3-oct | 66,9 s | 34.100 | 2.363 / 123 / 352 |
| 6 | TT "Mini agente mascota (PET)" | https://www.tiktok.com/@soyenriquerocha/video/7693895011259239700 | 7-oct | 34,2 s | 16.300 | 1.247 / 22 / 120 |
| 7 | TT "Vuelve realidad tu propia aplicación" (reciente) | https://www.tiktok.com/@soyenriquerocha/video/7694317070107807028 | 8-oct | 80,3 s | 1.833 | 129 / 2 / 16 |
| 8 | TT "Claude hace tus Meta ADs y contenido" (el mas reciente) | https://www.tiktok.com/@soyenriquerocha/video/7694359163064847637 | 8-oct | 96,8 s | 1.185 | 78 / 3 / 23 |
| 9 | TT "El ultra Prompt Maestro" (comedia) | https://www.tiktok.com/@soyenriquerocha/video/7693523825606085940 | 6-oct | 12,4 s | 922 | 43 / 1 / 2 |
| 10 | IG remate "No dejes que ChatGPT te mienta" (fijado, el mas visto) | https://www.instagram.com/soyenriquerocha/reel/DUnSLm0DqPO/ | feb-2026 | 12,4 s | 2,1 M [D] | 45.345 / 762 |
| 11 | IG "Claude ahora es tu Socio en tus Negocios" | https://www.instagram.com/soyenriquerocha/reel/DcepXPLh1S7/ | 25-ago | 89,4 s | 467 mil [D] | 13.464 / 2.317 |
| 12 | IG "Claude aprende a diseñar páginas web BIEN" | https://www.instagram.com/soyenriquerocha/reel/DdX3Hp4CnL0/ | 16-sep | 58,0 s | 466 mil [D] | 13.975 / 2.145 / 246 |
| 13 | IG carrusel PagoKit, 7 laminas | https://www.instagram.com/soyenriquerocha/p/DeBChXEG77k/ | ~2-3-oct [D] | 7 lam. | 219 likes, 71 coment. en 11 h [D] | n/a |
| 14 | IG "La solucion siempre fue GPT6 Astra + Fable5.1" (verificacion) | https://www.instagram.com/soyenriquerocha/reel/DdFwzr_qKes/ | 9-sep [D] | 53,3 s | 464 mil [D] | n/d |
| 15 | IG "Claude se conecta a tu Instagram 24/7" (verificacion) | https://www.instagram.com/soyenriquerocha/reel/DdUMFmcKYsp/ | 15-sep [D] | 66,4 s | 301 mil [D] | n/d |

Notas:
- Los videos 1, 2 y 3 ya tenian un analisis de Gemini en `PLAN-REFERENTES.md` con cortes estimados. Aqui se **midieron**. Los videos 4-13 son nuevos.
- **El video 12 es el mismo master que el 1**: los instantes de corte coinciden al decimo de segundo [M]. IG lo publico el 16-sep y TikTok el 5-oct. Lo mismo para la fila 15 (IG 15-sep) y su TikTok del 6-oct (cortes en 2,4; 18,9; 23,6; 27,2; 28,1; 29,4 s en los dos, duracion 66,2 vs 66,4 s) (verificado).
- Solo portada [D], no analizados en movimiento: Dc4BoyYxp5R (258 mil, sketch), DeB6YnQCpsM (el 3-oct, 17,6 mil a las 3 h). DdFwzr_qKes y DdUMFmcKYsp se bajaron y midieron en la verificacion (filas 14 y 15).
- Verificacion (2da pasada, mismo dia): se rehicieron el catalogo de TikTok y de YouTube, las razones de engagement de 4 videos, las estrellas de GitHub, los precios de tododeia.com y los cortes de 3 videos; cada cambio esta marcado abajo con "(verificado)".
- Descarga: los reels de IG se bajaron a una carpeta corta fuera del scratchpad (`C:\Users\PC\AppData\Local\Temp\rch\`) porque la ruta del scratchpad pasa los 260 caracteres de Windows y yt-dlp fallaba con "No such file"; se copiaron al scratchpad despues.

### 0.3 Lo que ya estaba cubierto y lo que no

| Tema | Ya estaba | Esta ficha agrega |
|---|---|---|
| Canales, bio, web, precios del embudo | `REFERENTES-ECOSISTEMA.md` ficha Rocha (completa) | solo verificacion de hoy: 299 guias, ebook USD 29, llamadas 15/79/297; repos de GitHub con estrellas |
| 3 TikToks (87,6 / 59,9 / 62,2 mil) | `PLAN-REFERENTES.md`, Gemini, cortes **estimados** | cortes duros medidos, % de pantalla, piso de audio, fotogramas del gancho |
| Portadas de 7 reels de IG, carrusel PagoKit | `FICHAS-MONTAJE-REFERENTES.md`, "montaje no medido" | 3 reels de IG vistos en movimiento; las 7 laminas del carrusel leidas |
| Catalogo, pilares, ritmo de publicacion, rendimiento por tema | casi nada | 234 TikToks + 166 Shorts con fecha, pilares con peso, saves/comentarios por vista, IG vs TikTok |
| Guiones | 3 de TikTok por tramos | 6 desarmados, formulas de gancho, ritmo en palabras por segundo |

### 0.4 Lo que no se pudo ver

- **Audio escuchado**: nadie lo escucho. Musica y SFX se infieren del piso de ruido y de Gemini [I/G]. Gemini se contradijo de un pase a otro: afirma musica y efectos en 6 de los 8 videos que revise del pase 1 y los niega o "no los distingue" en 5 de 7 del pase 2. En la verificacion lo repeti con solo el audio (2 videos, 2 pasadas): "agencia" = musica en 2 de 2 pasadas (generos distintos: electronica y rap), "design.md" = musica en 1 de 2; los SFX salen en tiempos distintos en cada pasada. El piso de ruido si es consistente (seccion 4.1). Sigue sin escucharlo una persona.
- **Datos por video de YouTube** (vistas exactas, comentarios, likes; login/anti-bot): las fechas de subida si se leyeron (verificado); lo demas no.
- **Instagram**: lista completa de reels, comentarios, insights. Solo 3 reels y 1 carrusel.
- **Comentarios** de TikTok/IG (no se leyeron); el "no me llego" de FICHAS sugiere DM automatico [D][NV].
- **Zoom digital**: no se pudo aislar del movimiento del cuerpo. No hay cifra.
- **Contenido de las 299 guias** (la pagina no lista titulos) y del ebook de 500+ paginas.
- Las vistas de los videos del 7 y 8-oct **no maduraron** (horas de vida). No se usan como veredicto.
- Gemini flash-lite inventa detalles: dijo "Michael Scott" (en el fotograma es Joey de Friends), "subtitulos con palabra clave amarilla" (no hay amarillo en ningun fotograma) y "titulo en caja negra translucida" (es texto blanco con sombra). Donde Gemini y el fotograma discrepan, gana el fotograma.

## 1. Estructura de contenido

### 1.1 Que es la cuenta

- **Un solo formato madre**: video vertical de 34-96 s, a camara, tutorial o recomendacion de una herramienta de Claude. 54 de 56 piezas de TikTok del bloque Claude (96%) son asi [M/I, por titulo y duracion]. Las otras 2 son comedia de 8-12 s.
- **Tres redes, mismo molde, no siempre el mismo archivo.** Algunos masters de IG se resuben tal cual a TikTok (2 casos probados por cortes); el resto del volumen de TikTok y Shorts es produccion propia con el mismo molde. TikTok lleva emoji final y tono de afirmacion; YouTube reescribe el titulo como frase de busqueda sin emoji ("Cómo crear contenido viral con Claude") [M]. En los 10 dias del bloque, TikTok y Shorts publican casi la misma cantidad por dia (TikTok 5,6,6,6,5,6,5,6,6,6; Shorts 5,6,6,6,6,6,6,6,6) (verificado).
- **El "largo" no es video.** YouTube no tiene ni un video largo. Lo largo es texto: la boveda de 299 guias, el ebook de 500+ paginas, los README de GitHub y los talleres en vivo de Luma [web].
- **Equipo detras** (@tododeia). Cuenta de IG con 282 mil seguidores, TikTok 31,1 mil, YouTube ~4,7 mil [D], Threads 5,9 mil [web].

### 1.2 Linea de tiempo del pivote

| Fecha | Que paso | Efecto en vistas |
|---|---|---|
| feb-2024 | 21 videos de motivacion personal en TikTok | mediana 25,7 mil (su mejor era en TikTok) |
| oct-2025 | serie "ChatGPT resuelve tu vida" | 0,6-3,1 mil |
| dic-2025 a ene-2026 | reflexiones y motivacion en TikTok ("el universo...") | ~700 |
| 12-feb-2026 | "No dejes que ChatGPT te mienta", 12 s | **IG 2,1 M**, TikTok 9,5 mil |
| 4-ago a 3-oct-2026 | IG: 77 reels de Claude, 1,3 por dia | mediana 72,8 mil, 30 de 77 pasan 100 mil [D] |
| 25-ago-2026 | YouTube Shorts: arranca el ritmo de ~3 por dia (el Short mas viejo del listado es del 18-may; el siguiente, 25-ago) (verificado) | mediana de los 110 Shorts hasta el 28-sep: 734; el mejor, 6 mil |
| **29-sep-2026** | TikTok pasa a 5-6 piezas diarias de Claude, igual que Shorts (que sube de 3 a 5-6 el 28-29-sep) | TikTok mediana 1,3 mil; un golpe de 10-88 mil casi todos los dias. Shorts de ese bloque: mediana ~410 (inmaduros) |

Algunos masters de IG se resuben: design.md salio en IG el 16-sep y en TikTok el 5-oct; "Claude se conecta a tu Instagram" salio en IG el 15-sep (301 mil) y en TikTok el 6-oct (8,3 mil) [M+D]. Son 2 casos probados de 57 piezas; no se puede decir cuantos mas hay.

### 1.3 Pilares tematicos y su peso (TikTok, 56 piezas del 29-sep al 8-oct)

Clasificacion hecha por mi a partir del titulo (la cuenta no usa pilares explicitos), corregida en la verificacion tras mirar el contenido de dos reels. Vistas = suma de las 56 piezas del 29-sep al 8-oct = 508.823 (al releer el catalogo hay 57 piezas y 510.341 vistas por una pieza nueva del 8-oct; los porcentajes casi no se mueven).

| Pilar | Piezas | % piezas | Vistas | % vistas | Mediana | Mejor pieza |
|---|---|---|---|---|---|---|
| **CONSTRUIR** (webs, apps, skills, automatizar) | 14 | 25% | 196.606 | 39% | 1.868 | 87,9 mil design.md; 62,4 mil "sin basura" |
| **AGENTES** (agentes, equipos, mascota) | 9 | 16% | 110.139 | 22% | 2.560 | 42,4 mil WhatsApp; 34,1 mil "todos los agentes" |
| **CUENTA** (no quemar tokens, ahorrar, prompts) | 10 | 18% | 99.784 | 20% | 1.512 | 30,2 mil "lo ve todo sin quemar tu cuenta"; 13,6 mil "cuando Claude no puede, Codex lo termina" (verificado: es un tutorial de ahorro, antes estaba en MODELOS) |
| **NEGOCIO** (ads, ventas, redes, finanzas) | 11 | 20% | 78.336 | 15% | 1.174 | 59,9 mil "agencia de anuncios" |
| **MODELOS / noticia** (Opus 5.5, Sonnet 5.5, GPT-6 vs Fable) | 5 | 9% | 5.304 | 1% | 1.006 | 1,4 mil "GPT 6 Astra esta superando Fable 5.1" |
| **CREATIVO** (imagenes, video, animacion, diseno) | 5 | 9% | 16.878 | 3% | 1.214 | 12,8 mil "adios disenos y textos basura de IA" |
| **COMEDIA** | 2 | 4% | 1.776 | 0,3% | 888 | 922 |

Lecturas:
- **Construir + agentes + cuenta = 80% de las vistas con 59% de las piezas.** Se gana con un resultado concreto y una herramienta con nombre.
- **Las noticias de modelo son el pilar mas flojo despues de la comedia** (5 piezas, mediana 1,0 mil, 1% de las vistas). El PLAN dice que Rocha es el nicho de "noticias de Claude del mismo dia"; en TikTok no es lo que rinde. Limite: la clasificacion es por titulo y el pilar es chico (5 piezas); los hits de nombre de modelo ("Opus 5.5 tu agencia de anuncios", 59,9 mil) cayeron en NEGOCIO porque lo que venden es el resultado, no el lanzamiento.
- **En IG tampoco es noticia lo que mas rinde** (verificado mirando los reels): los mas vistos son tutoriales (Socio, design.md), "GPT6 Astra + Fable5.1" (464 mil) que es un tutorial de 3 lineas para ahorrar cuenta con el plugin de Codex, conexion de herramientas (Claude + Instagram, 301 mil, tutorial de 5 pasos con Composio) y humor (sketch 258 mil, remate 2,1 M) [D+V]. Lo que sigue sin medirse es un reel IG de noticia pura del dia con montaje medido: en los 4 reels de IG analizados la "novedad" es solo el gancho y el cuerpo es un tutorial.
- **Hits por titulo**: casi todos los de mas de 20 mil combinan *Claude + resultado + adverbio de calidad o ahorro*: "BIEN", "sin basura", "sin quemar tu cuenta", "no tiene limites" [M].

### 1.4 Series recurrentes

| Patron | TikTok (n) | YouTube (n) | Mediana TikTok |
|---|---|---|---|
| "Claude ahora [verbo]..." | 7 | 11 | 10.900 |
| "...sin quemar / no quemes tu cuenta" | 5 | 6 | 1.469 |
| "Opus 5.5 [rol]" (agencia, Excel, velocidad) | 7 | 7 | 1.228 |
| titulo con "agente(s)" | 7 | 10 | 10.900 |
| "Cómo [verbo] con Claude" | 2 | 12 | 1.072 (YouTube lo prefiere: titulo de busqueda) |

- **Emoji de firma al final del titulo de TikTok**: 😮‍💨 en 25 de 56 (45%), mediana 1.924; 😬 en 20 (1.293); 😎, 😅, 😂 el resto. Todos los de mas de 50 mil llevan 😮‍💨 [M]. Correlacion, no causa.
- **Series de producto propio** (cada una tiene su repo): AgentKit de WhatsApp, WebKit (paginas web), The Architect (planear apps), PagoKit (pagos), open-carrusel, Editor Pro Max (video con Remotion) [web].

### 1.5 Mezcla de formatos por red

| Red | Mezcla |
|---|---|
| TikTok (56 piezas, 29-sep a 8-oct) | 96% tutorial/recomendacion a camara con capturas (54); 4% comedia/sketch (2) [M] |
| Instagram | 7 reels leidos: 5 tutoriales de 53-89 s y 2 remates o sketches de 12-15 s; cuadricula: 4 de los ultimos 12 items eran carruseles (33%) [D] |
| YouTube | 100% Shorts (166 de 166), sin videos largos [M] |
| Threads | 4 posts: 2 videos, 2 carruseles de 5 imagenes, texto con "Comenta TOKENS" [web] |

### 1.6 Frecuencia

- **TikTok: 5-6 por dia, todos los dias**: 5, 6, 6, 6, 5, 6, 5, 6, 6, 5 del 29-sep al 8-oct [M]. Es metronomico: se ve como un lote programado.
- **Instagram: 77 reels en 61 dias** (1,3 por dia): 34 dias con 1, 14 con 2, 5 con 3, y 8 dias sin publicar [D].
- **Shorts: ~3 por dia del 25-ago al 27-sep (3,3,3 los ultimos tres dias), 5-6 por dia desde el 28-sep** (verificado, fecha de cada Short). Del 29-sep al 7-oct, practicamente el mismo ritmo que TikTok; los titulos mas recientes coinciden con los de TikTok, reescritos como frase de busqueda.
- **Cada dia de TikTok tiene al menos un video de mas de 10 mil** (8 de 8 dias maduros): 23,9; 59,9; 24,7; 13,6; 34,1; 42,4; 87,9 y 62,4 mil. Con 5-6 tiros por dia, ~1 de cada 5 pega [M].

### 1.7 Duraciones

TikTok, 56 piezas [M]:

| Duracion | Piezas | Mediana de vistas | Maximo |
|---|---|---|---|
| menos de 30 s | 2 | 888 | 922 |
| 30-59 s | 16 | 1.357 | 87.900 |
| 60-74 s | 18 | 1.428 | 62.400 |
| 75-89 s | 18 | 1.328 | 59.900 |
| 90 s o mas | 2 | 1.280 | 1.386 |

La duracion no mueve la mediana. Los **9 videos de mas de 20 mil duran entre 57 y 83 s** (ninguno de menos de 30 s). Mediana de la serie: 68,5 s. IG: tutoriales de 53-89 s y remates de 12-15 s [D].

### 1.8 Que rinde mas y menos

TikTok, bloque Claude (n=56) [M]:
- Mediana **1.328**; media **9.086**; maximo **87.900** (66 veces la mediana).
- **Los 5 mejores suman 56% de todas las vistas; los 10 mejores, 80%.** Es una loteria: 23% de las piezas pasan 10 mil, 5% pasan 50 mil.
- Excluyendo el 7 y 8-oct (inmaduros): 45 piezas, mediana 1.299, 10 pasan 10 mil.

**IG vs TikTok vs YouTube**:

| Red | Mediana | Maximo | Nota |
|---|---|---|---|
| Instagram (77 reels, 4-ago a 3-oct) | 72.800 | 2,1 M (feb); 467 mil (ago-oct) | 39% pasa 100 mil [D] |
| TikTok (56 piezas, 29-sep a 8-oct) | 1.328 | 87.900 | mismo master: 5,3 veces menos que IG |
| YouTube Shorts (166, 25-ago a 8-oct, mas 1 del 18-may) | 662 | 6.000 ("Construye apps, webs, sin saber codigo con Claude", 18-may) | 42 pasan 1.000; 9 pasan 2.000. Del 29-sep al 8-oct (56 Shorts): mediana ~410, max 2.500 (verificado; la primera lectura de 80 Shorts decia mediana 658, max 2.900) |

**Engagement por vista, TikTok** [M] (guardados salen de `save_count`):

| Pieza | Vistas | Likes | Coment. | Compart. | **Guardados** |
|---|---|---|---|---|---|
| design.md | 87.900 | 8,3% | 0,08% | 1,05% | **7,6%** |
| sin basura | 62.400 | 7,0% | 0,12% | 1,29% | **7,2%** |
| agencia de anuncios | 59.900 | 7,9% | 0,27% | 2,45% | **7,6%** |
| WhatsApp | 42.400 | 5,8% | **0,61%** | 1,24% | 5,6% |
| todos los agentes | 34.100 | 6,9% | 0,36% | 1,03% | 6,5% |
| PET | 16.300 | 7,7% | 0,13% | 0,74% | 3,5% |
| comedia | 922 | 4,7% | 0,11% | 0,22% | 1,1% |

- Los tutoriales que pegan se **guardan**: 5,6-7,6% de las vistas. La comedia casi no. Lo que se guarda es "lo uso despues".
- **El mejor comentario por vista es el WhatsApp (0,61%)**, cuyo CTA pregunta algo concreto del producto: "como usarias este agente". El de design.md pregunta "que pagina" y trae 0,08%.
- **En IG los comentarios por vista son ~6 veces mayores**: mediana 0,74% en 4 reels de IG con CTA (0,46; 0,50; 0,97; 0,98%) contra 0,13% en los 9 videos de TikTok. El remate de 12 s sin CTA trae 0,04% [M+D]. La mecanica "comenta X y te lo paso" funciona en IG, no en TikTok.
- **El peor**: la comedia (2 piezas, 8-12 s, mediana 888) y los videos de noticia de modelo sin utilidad concreta.

### 1.9 Como se conectan el corto y el "largo"

```
reel de 55-90 s (IG primero, copia en TikTok/Shorts)
  -> "comenta X y te lo paso" (+ comentario fijado: "comenten con TEXTO, no solo emojis")
  -> guia o repo por mensaje directo (README de GitHub, MIT)
  -> boveda tododeia.com (299 guias, gratis, sin registro) / newsletter "Mantente al dia"
  -> ebook Claude de Cero a Cien (USD 29) o Codex de Cero a Cien (USD 29)
  -> llamada 1 a 1 (USD 15 / 79 / 297) o taller en vivo en Luma (USD 97 / 119)
```

Cada serie de videos tiene su repo propio. Es el iman de leads y la prueba social a la vez [web, 8-oct]:

| Tema del reel | Repo (GitHub: Hainrixz) | Estrellas / forks |
|---|---|---|
| "Construye lo que quieras... El Arquitecto" | the-architect | 535 / 101 |
| "Agente de WhatsApp con Claude" (video 4) | whatsapp-agentkit | 529 / 168 |
| carruseles de Instagram | open-carrusel | 479 / 85 |
| seguridad de apps | cyber-neo | 282 / 32 |
| paginas web ("design.md") | claude-webkit | 272 / 79 |
| "Un agente que edita tus videos" | editor-pro-max | 264 / 121 |
| pagos (carrusel PagoKit) | agente-pagokit | 62 / 5 |
| Meta Ads / anuncios (video 8) | claude-ads | 93 / 17 |

Vistos directamente en pantalla: the-architect, whatsapp-agentkit, claude-ads, claude-webkit (nombrado) y PagoKit. El resto del mapeo (open-carrusel, cyber-neo, editor-pro-max) es mi inferencia por el tema del reel [I].

## 2. Comunicacion

### 2.1 A quien le habla
- Al **constructor no tecnico que usa Claude**: "tu que construyes apps con Claude", "si andas armando paginas web para tu negocio", "si tienes un negocio pequeno". Emprendedor, freelance o dueno de negocio chico de LatAm [G+V].
- No habla de un rubro. Los casos de uso se listan al pasar (clinicas, restaurantes, inmobiliarias, barberias, tiendas online en el video del agente de WhatsApp [G]).

### 2.2 Tono y vocabulario
- Tuteo mexicano informal (GitHub lo ubica en Tijuana), entusiasta, cercano ("te va a doler", "archivo magico", "literalmente hice", "ahorita", "checar campanas"). Sergio Urcullo habla de vos y de usted a clientes: el vocabulario no se traslada tal cual.
- Vocabulario propio y repetido: **"quemar tu cuenta"** (gastar el limite de uso), **"basura / slop"**, **"se nota a kilometros"**, "combo", "agencia", "empleados gratis".
- Habla **rapido**: ~4,5 palabras por segundo de mediana (rango 3,5-4,9, conteo sobre transcripcion de Gemini, margen de ±10%) [M/G]. Frases de ~14 palabras (12-21) [M/G]. Casi sin pausas: en los videos sin cama de musica hay 3 silencios de mas de 0,25 s y 0,9-1,0 s de aire en 58-66 s [M].
- Gesticula mucho (se lo critican en comentarios: "ya me estabas mareando") [D].

### 2.3 Promesa central
"Hace con Claude [resultado concreto] **gratis, sin programar y bien hecho**". Variantes: sin basura, sin quemar la cuenta, en 5 minutos, gratis, con una sola herramienta. Siempre "hacer", casi nunca "entender".

### 2.4 Tipo de prueba
- **Captura de la pantalla de la herramienta o del repo**, filmada con el celular apuntando al monitor [V]. Cada video muestra 2-7 sitios con nombre propio (Refero, UI UX Pro Max, GitHub, Composio, Mobbin, 21st.dev).
- **Casi no muestra el resultado terminado.** Un comentario con 59 likes se lo reprocha ("nunca muestran resultados reales") [D]. En los 12 videos solo un clip de IA (la chica del video 8) hace de ejemplo [V].
- **Numeros de apoyo**: "+144 agentes", "15 empleados", "20 reglas", "299 guias". Algunos son de repos ajenos (agency-agents, de otro autor) presentados como "todos los agentes que necesitas" [V][NV].

### 2.5 Objeciones que contesta
- "No se programar" (el agente de WhatsApp: Claude te entrevista y lo arma) [G].
- "Me van a bloquear la cuenta" (Meta Ads: subi de 2 o 3 campanas) [G].
- "Cuesta mucho" (la mascota corre con la suscripcion de USD 20) [G].
- "Son demasiados agentes" (instalalos por proyecto) [G].
- "Se nota que lo hizo una IA" (design.md) [V].

### 2.6 CTA por red

| Red | CTA |
|---|---|
| TikTok / IG reels | **"Comenta [pregunta concreta] y te lo paso"** + "si te gusto, seguime y compartilo con alguien que lo necesite" [V+G]. La pregunta cambia por video: "que pagina te gustaria hacer", "de que es tu negocio", "como usarias este agente de WhatsApp", "que estas construyendo ahorita". El rotulo final lo repite en una caja blanca |
| IG, comentario propio fijado | "si ayudan comentando con TEXTO no solo EMOJIS para que no bajen el video" [D] |
| IG carrusel | ultima lamina: "Comenta PAGOS y te mando PagoKit, con la guia para instalarlo" [V] |
| Threads | "Comenta TOKENS" (guia a cambio de un comentario) [web] |
| Teaser (PET) | "seguime, compartilo, comenta para que usarias esta mascota; nos vemos en unos dias cuando lo lance" [G] |
| Bio | "Boveda, Colabs y llamadas 1:1" + tododeia.com [D] |

En las 9 transcripciones no aparece "link en la bio" ni "perfil". La accion siempre es **comentar**, y la frase se repite palabra por palabra de un video a otro.

### 2.7 Embudo hasta la plata [web, 8-oct]

| Peldano | Precio | Nota |
|---|---|---|
| Reels, carruseles, Threads | gratis | contenido |
| Repos de GitHub (MIT) | gratis | iman real; las estrellas son la prueba social |
| Boveda: 299 guias (Claude, Claude Code, Codex, MCP, skills, automatizacion) | gratis, sin registro | la pagina no lista titulos ni categorias |
| Newsletter "Mantente al dia" | gratis | "sin relleno" |
| Eventos en vivo (Luma) | gratis para entrar | |
| **Ebook "Claude de Cero a Cien"** (Junio 2026 v1.0, 500+ pag., 25 cap., 5 apendices, glosario de 120 terminos) | **USD 29 / MXN 599** | pago unico por Stripe; bonos: newsletter y actualizaciones mensuales |
| Ebook "Codex de Cero a Cien" | USD 29 / MXN 599 | |
| Llamada Express 20 min | USD 15 | "una pregunta puntual" |
| Quick Call 45 min ("mas popular") | USD 79 | revisar un proyecto |
| Consultoria 90 min | USD 297 | estrategia, roadmap |
| Talleres Luma | USD 97 (online), USD 119 (presencial en Colombia) [D] | |
| Colaboraciones, afiliado (Odysser), donar | no consta | |

Lo que **no** tiene la tienda: testimonios, garantia o reembolso, cuenta de alumnos, cupos, cuenta regresiva, formulario previo a la llamada, ni numero de compradores [web]. Vende por volumen de audiencia, no por prueba.

## 3. Guiones

### 3.1 Formulas de gancho

Siempre hay un **titulo escrito en el cuadro 0** (hasta 0,4 s antes de que hable). Nunca saluda.

| Formula | Ejemplo corto | Video (vistas) |
|---|---|---|
| **A. Dolor del espectador + defecto visible** | "Lo que construyes con Claude se nota a kilometros" (parafraseado: "se ve hecho con IA") | design.md (87,9 mil) |
| **B. Segmento + numero + gratis (+ "nadie te lo dice" [G])** | "Si tienes un negocio pequeno, Claude acaba de sacar 15 empleados gratis" (parafraseado de subtitulos y Gemini) | IG socio (467 mil) |
| **C. "Tu que [haces X]..." (segmento + problema)** | "Tu que construyes apps con Claude..." | sin basura (62,4 mil) |
| **D. Nombre del modelo + rol** | "Opus 5.5 puede ser tu agencia de anuncios" | agencia (59,9 mil) |
| **E. "Literalmente hice..." (yo lo construi)** | "Literalmente hice un agente que te ayuda a hacer un agente de WhatsApp" | WhatsApp (42,4 mil) |
| **F. Pregunta humoristica + dato** | "¿Cuando te enteraste que ChatGPT es mas mentiroso que tu ex?" | IG remate (2,1 M) |
| **G. Acusacion colectiva [G]** | "Todos los que pagamos anuncios en Facebook estamos tirando el dinero" | Meta Ads (1,2 mil, inmaduro) |
| **H. Teaser de proyecto propio** | "Tenemos mascota de Claude" | PET (16,3 mil) |
| **I. Problema que parece sin salida + giro "si se puede, solo falta un link"** (verificado, reel nuevo) | titulo fijo "Claude se conecta a tu Instagram 24/7"; dice que abris Claude, vas a personalizar, conectores, buscas Instagram "y no esta"; luego "resulta que si se puede" [G+V] | IG Claude + Instagram (301 mil; TikTok 8,3 mil) |
| **J. Dolor de costo + solucion contraintuitiva** (verificado, reel nuevo) | titulo fijo "La solucion siempre fue GPT6 Astra + Fable5.1"; habla de que Claude se acaba "a media semana" y que la solucion no es pagar mas sino poner a Codex de trabajador [V+G] | IG GPT-6 (464 mil) |

El titulo escrito (rotulo fijo) es de **4-7 palabras** y repite la promesa: "Diseña Páginas Web BIEN con Claude", "Claude no te vuelve a construir basura", "Claude + Meta ADs Combo Perfecto", "Todos los agentes de Claude que necesitas", "Saca tu propia App a tienda con Claude". Una palabra va en mayusculas (BIEN) [V].

### 3.2 Guiones desarmados

Parafraseados (aqui en voseo; Rocha habla de tu). Tiempos de Gemini ajustados con los cortes medidos [M]. "Que se ve" sale de fotogramas [V], salvo lo marcado [G].

**Guion 1. TikTok design.md, 57,9 s, 87,9 mil (IG gemelo: 466 mil)**

| Tiempo | Que dice (parafraseado) | Que se ve | Funcion |
|---|---|---|---|
| 0:00-0:07 | Lo que armas con Claude se nota a kilometros que lo hizo una IA; si haces paginas web para tu negocio, esto te va a doler | Cara de frente, titulo fijo arriba; ficha de Claude con pop; caja blanca que escribe "A kilometros" | Gancho: dolor + defecto |
| 0:07-0:16 | No es culpa de Claude, nadie le ensena a disenar bien; se arregla con un archivo "magico": design.md | Cara; sticker pixel (criatura naranja con llave y pestana de navegador); manos en forma de rombo | Causa + solucion |
| 0:16-0:26 | Paso 1: Refero Styles, mas de 2.000 diseños de referencia; das clic y te da el design.md | **Captura filmada** de refero (pantalla oscura, laptop y teclado visibles) | Paso 1 |
| 0:26-0:36 | Hay marcas como Duolingo, Stripe, Notion, Apple; elegis, copias el design.md y se lo das a Claude | Capturas rapidas de 1-2 s (Steep, Stripe, Calendly) con subtitulo encima; vuelve la cara con sticker "criatura con laptop" | Prueba |
| 0:36-0:46 | Combinalo con UI UX Pro Max y WebKit (herramienta propia): Claude entiende colores, letras, espacios | Cara; **caja apilada: Colores / Letras / Espacios** | Paso 2 |
| 0:46-0:58 | Este combo hace paginas impresionantes; comenta que pagina queres hacer y te la paso | Meme de Joey con la boca abierta; cara sonriendo | CTA con pregunta |

**Guion 2. TikTok "sin basura", 66,3 s, 62,4 mil**

| Tiempo | Que dice | Que se ve | Funcion |
|---|---|---|---|
| 0:00-0:05 | Tu que armas apps con Claude: el codigo corre y pasa las pruebas, pero por dentro esta mal | Titulo fijo; caja "Construyes Apps" (escribe); ficha de Claude pequena que crece | Gancho: segmento + problema |
| 0:05-0:13 | Pedirle que revise no basta; hay que ponerle un arbitro que no pueda cruzar | Meme del titere mono que mira de lado | Contraste |
| 0:13-0:28 | Herramienta 1: anti-slop, 20 reglas; si hay fallos, rechaza y obliga a rehacerlo | Caja "20 reglas"; captura de GitHub filmada (1,3 s); sticker pixel muerto "x x" | Paso 1 + prueba |
| 0:28-0:36 | Solo sirve para proyectos nuevos; que pasa con el codigo que ya tenes | Cara con manos; subtitulos | Giro |
| 0:36-0:53 | Herramienta 2: Thermos revisa archivos grandes de forma brutal; si detecta codigo falso, lo frena | Captura de README "Thermos plugin" (1,7 s); sticker pixel con anteojos y escritorio | Paso 2 |
| 0:53-1:06 | Si queres mas detalle, comenta que proyecto estas construyendo y te paso la guia | Cara; caja "Es revisar"; manos abiertas | CTA |

**Guion 3. TikTok agente de WhatsApp, 83,2 s, 42,4 mil (el mas comentado de los 9 de TikTok analizados)**

| Tiempo | Que dice | Que se ve | Funcion |
|---|---|---|---|
| 0:00-0:06 | Literalmente hice un agente de Claude que te ayuda a hacer un agente de WhatsApp para lo que quieras | Titulo fijo; cara; mesa con celular | Gancho: yo lo construi |
| 0:06-0:13 | Me lo pidieron mucho; se llama WhatsApp AgentKit | Cara | Promesa |
| 0:13-0:19 | Agarras el link de la guia que te mando y se lo das a Claude | Cara | Paso 1 |
| 0:19-0:27 | Claude te entrevista: nombre del negocio, tono, horario, archivos | **Captura de GitHub "Paso 3: Claude Code te entrevista (5 min)"** con caja "Nombre de tu negocio" encima | Paso 2 |
| 0:27-0:36 | Cuando respondes, Claude construye y puedes probarlo | Cara; caja "Personalidad" | Resultado |
| 0:36-0:54 | Se conecta a un numero, tu web o Telegram: se lo dices a Claude | Captura del repo (2,2 s) | Integracion |
| 0:54-1:10 | Sirve para restaurantes, clinicas, inmobiliarias, barberias, agendas, tiendas | Cara | Casos de uso |
| 1:10-1:23 | No se puede poner mas facil; comenta como usarias este agente y te lo mando | Cara | CTA con pregunta de uso |

**Guion 4. IG "Socio en tus Negocios", 89,4 s, 467 mil (el mas pegado de IG visto en movimiento)**

| Tiempo | Que dice | Que se ve | Funcion |
|---|---|---|---|
| 0:00-0:05 | Si tenes un negocio pequeno, Claude acaba de sacar quince empleados gratis y nadie te lo dice | Contrapicado, brazos cruzados sobre una silla, ventilador de techo; cajas "Negocio pequeno" y "15 empleados"; ficha de Claude | Gancho: segmento + numero + gratis |
| 0:05-0:09 | Presentaron Claude para pequenas empresas | **Captura de anthropic.com** ("13 de mayo de 2026"), caja "Small business" | Prueba de fuente |
| 0:09-0:22 | Trae 15 habilidades y flujos: contabilidad, marketing, ventas, soporte, operaciones; todo lo que normalmente pagas | Cara + sticker pixel; caja "Para tu negocio" | Promesa + contraste |
| 0:22-0:49 | Cuatro pasos: abrir la app, ir a habilidades, buscar "small business" en plugins, instalar | Capturas filmadas: menu Customize, directorio de plugins; cajas "Habilidades", "Plugins" | Pasos 1-4 |
| 0:49-1:11 | En Proyectos crea uno con el nombre de tu empresa y dale instrucciones | Captura "Iniciar un nuevo proyecto"; caja "Instrucciones" | Paso practico |
| 1:11-1:29 | Conecta Gmail y otras apps; comenta que tipo de negocio tenes y te paso la guia | Captura de conectores (Gmail, Facebook, Google Calendar, Higgsfield); sticker de pixel con musculos | CTA con dato del negocio |

Es una noticia de **mayo** contada en **agosto**: no hace falta que sea del dia.

**Guion 5. TikTok "Saca tu propia app a tienda", 80,3 s, 1,8 mil (inmaduro)**

| Tiempo | Que dice | Que se ve | Funcion |
|---|---|---|---|
| 0:00-0:06 | Tienes la idea de tu app en la cabeza hace meses; hoy te enseno a sacarla | Titulo fijo; cara | Gancho |
| 0:06-0:20 | Primero sacala de la cabeza: dibujala en papel y contasela a un amigo; "la app no esta lista"; quedate con 2 o 3 cosas | Cara; sticker pixel "NO" al decir "no esta lista" | Paso 1: bajar la idea |
| 0:20-0:28 | Eso se llama MVP: la version mas chiquita que le sirva a alguien | Cara con manos | Concepto |
| 0:28-0:42 | Paso 2: convertirla en plan con El Arquitecto (herramienta propia gratis): notas de voz, imagenes, documentos | **Captura de the-architect** con "tododeia.com" visible en el badge; meme de gato con audifonos [G] | Paso 2 + producto propio |
| 0:42-1:00 | Paso 3: que no se vea fea; UI UX Pro Max y Mobbin; pedile a Claude un login con referencias | Capturas de Mobbin [G] | Paso 3 |
| 1:00-1:19 | Para el resto de piezas usa 21st.dev; si tenes una idea atorada, comenta que app es y te paso la guia | Capturas de 21st.dev [G]; cara | CTA |

**Guion 7. IG "GPT6 Astra + Fable5.1", 53,3 s, 464 mil (verificado, reel nuevo)**

Tiempos del texto en pantalla leidos en fotogramas [V]; el contenido hablado, del pase de Gemini flash-lite [G].

| Tiempo | Que dice (parafraseado) | Que se ve | Funcion |
|---|---|---|---|
| 0:00-0:09 | Todos los que programamos con Claude sabemos que se acaba a media semana; la solucion no es pagar mas, es meter a Codex al juego | Titulo fijo desde el cuadro 0; GIF de gato en laptop (2 veces); ficha de "Fable 5.1"; caja blanca "A media semana" | Gancho: dolor de costo + giro |
| 0:09-0:24 | Claude de jefe y Codex de trabajador: si trabajan juntos gastan menos y se acaba la guerra de cual modelo es mejor | Logo "GPT-6 Astra"; sticker pixel con logo de OpenAI "en equipo"; tarjeta "GPT-6 vs Claude Fable 5.1" | Idea central |
| 0:24-0:33 | Son solo tres lineas que le pasas a Claude Code; es un plugin oficial de OpenAI | **Dos capturas filmadas** (~25-27 s: README del plugin con `/plugin marketplace add ...` e `install`, caja blanca "3 lineas", ficha "Claude Code"; ~30-32 s: panel de plugins de Claude Code con Codex y sus comandos) | Paso + prueba |
| 0:33-0:53 | No necesitas los dos planes mas caros, funciona con el plan gratis de ChatGPT; comenta para que la vas a usar y te la paso; seguime y compartilo | Cara a camara | Objecion de precio + CTA |

Edicion medida [M]: 4 cortes duros (25,1; 26,9; 29,8; 32,2 s) = 0,75 cada 10 s; las 2 capturas son los unicos inserts de pantalla; memes y logos van sobre la toma de cara. Audio solo voz (piso -56 dB, sin cama). Mismo sistema grafico que los demas: titulo fijo, subtitulo blanco minuscula a ~78%, caja blanca, fichas, sticker pixel, GIF de gato; "Claude" sale bien escrito en el titulo y el subtitulo dice "cloud" en el reel de la conexion a Instagram.

**Guion 6. IG remate de 12,4 s, 2,1 M (fijado)**

| Tiempo | Que dice | Que se ve | Funcion |
|---|---|---|---|
| 0:00-0:03 | ¿Cuando te enteraste que ChatGPT es mas mentiroso que tu ex? | Acostado de noche, capucha, mano en la sien, penumbra; subtitulo ya en el cuadro 0 | Gancho humoristico |
| 0:03-0:06 | ¿Sabias que te miente el 27% de las veces? | misma toma | Dato (sin fuente en pantalla) |
| 0:06-0:12 | Te dejo en los comentarios el texto que tenes que ponerle antes de pedir cualquier cosa | misma toma | CTA a comentarios, sin palabra clave |

### 3.3 Recursos de retencion

1. **Titulo-promesa en el cuadro 0**, antes de la primera palabra.
2. **Una caja escrita en cada concepto nuevo**, con efecto maquina de escribir (se ve "Construyes A", "A kilometros" a medias).
3. **Ficha del logo con pop** cuando nombra un producto (Claude, Facebook): entra chica y crece en ~0,5 s.
4. **Captura de pantalla de 1-5 s en cada paso** (2-7 por video), y entre capturas una toma de cara de hasta 16-45 s, siempre con capas encima [M].
5. **Meme o sticker como remate de tension** (Joey, titere mono, mono pixel con anteojos).
6. **Estructura numerada** ("paso 1", "dos formas", "cuatro pasos") que da la sensacion de lista.
7. **Giro a mitad**: "pero esto solo sirve para proyectos nuevos" (basura) abre el segundo paso.
8. **Pregunta final de dato**, que obliga a comentar.
9. **Cero pausas**: se cortan silencios, queda 0,9-1,0 s de aire en 58-66 s [M].

### 3.4 Cierres

Siempre la misma estructura, repetida casi palabra por palabra en las 9 transcripciones, de 25 a 55 palabras (8-15 s): **(1)** oferta de una guia ("si quieres una guia mas detallada de como hacerlo paso a paso y llevarlo a tu negocio"), **(2)** "comenta [pregunta que pide un dato] y te la mando" ("¿que pagina...?", "¿de que es tu negocio?", "¿cual de estas areas es tu favorita?"), **(3)** cierre fijo: seguime y compartilo con quien lo necesite. Sin despedida ni agradecimiento. El rotulo final repite la pregunta en una caja blanca [V+G].

### 3.5 Largo de frase y ritmo

- ~4,5 palabras por segundo, mediana de 8 videos de 58-97 s (rango 3,5 a 4,9) [M/G]. Confirmado desde otro angulo (verificacion): en el reel Claude + Instagram aparece filmada en pantalla una hoja de guion suya con el pie "Metadata v4 - Palabras: 234 - Duracion estimada ~52 s - WPS: 4.5 (su ritmo real)" [V]. Escribe el guion con conteo de palabras y apunta a 4,5 por segundo. Esa hoja es de otro guion (el reel dura 66 s), pero muestra el metodo.
- Frases de ~14 palabras (mediana 12-21 segun el video), con maximos de 24-46 [M/G]. Habla en rafagas con conjunciones ("y", "porque", "ahora") y no hace pausas largas.
- Un tramo narrativo nuevo cada **8-15 s** (6 a 10 tramos por video); un elemento visual nuevo (caja, ficha, sticker, captura) cada **~2-4 s** [V].
- Guion medio: 235-456 palabras para 58-97 s.

## 4. Edicion

### 4.1 Corto vertical a camara (el 96% de la cuenta)

**Cortes duros** (entrada o salida de una captura, meme o clip; umbral de escena 0,35 de ffmpeg) [M]:

| Video | Dur. | Cortes duros | Por cada 10 s | Toma de cara mas larga | Pantalla (capturas, memes) |
|---|---|---|---|---|---|
| TT design.md (87,9 mil) | 57,9 s | 12 | 2,1 | 18,9 s | ~20% |
| IG design.md (466 mil), mismo master | 58,0 s | 12 | 2,1 | 18,9 s | ~20% |
| TT sin basura (62,4 mil) | 66,3 s | 4 | 0,6 | 27,4 s | ~5% |
| TT agencia (59,9 mil) | 80,2 s | 11 | 1,4 | 45,6 s | n/d |
| TT WhatsApp (42,4 mil) | 83,2 s | 6 | 0,7 | 43,1 s | ~10% |
| TT todos los agentes (34,1 mil) | 66,9 s | 4 | 0,6 | 43,5 s | ~17% |
| TT PET (16,3 mil) | 34,2 s | 4 | 1,2 | 21,4 s | ~19% |
| TT app (1,8 mil) | 80,3 s | 10 | 1,2 | 31,4 s | ~25% |
| TT Meta Ads (1,2 mil) | 96,8 s | 14 | 1,4 | 45,0 s | ~29% |
| IG socio (467 mil) | 89,4 s | 10 | 1,1 | 16,0 s | ~32% |
| IG GPT-6 Astra + Fable (464 mil) (verificado) | 53,3 s | 4 | 0,75 | 25,1 s | ~13% (2 capturas, ~7 s) |
| IG Claude + Instagram (301 mil) y su copia en TikTok (verificado) | 66,4 s / 66,2 s | 6 / 6 | 0,9 | 16,6 s | n/d |
| TT "4 equipos" (89,8 s, 1,1 mil) (verificado) | 89,8 s | 0 con umbral 0,35 | 0 | toda | n/d |
| IG remate (2,1 M) / TT comedia | 12,4 s | 0 | 0 | 12,4 s | 0% |

- **Resumen**: 0-2,1 cortes duros cada 10 s, mediana ~1,1. Una captura es 2 cortes (entra y sale), asi que hay **2-7 inserts por video (mediana 4)**, de **0,6 a 5 s** cada uno (mediana ~2 s), con 1 rafaga larga de 9 a 19 s en los videos en que recorre un repo o un panel (agentes, app, Meta Ads, Socio). El resto es **una sola toma continua de cara** de 16 a 45 s [M]. (El pareo entrada/salida es una heuristica: sirve para el orden de magnitud, no para el cuadro exacto.)
- **Los "cortes cada 3-4 s" que decian los docs previos (y Gemini) no son reales.** Parecen cortes por los gestos, los stickers y los subtitulos que cambian; la camara no se corta. La edicion es de **capas**, no de cortes: titulo, subtitulos, cajas, fichas y stickers sobre una toma continua [M+V].
- Los **jump cuts internos de la toma de cara** no se pudieron aislar de los gestos de las manos (un detector de fondo da picos tanto en gestos como en cortes). Si los hay, son menores al umbral [NV].
- **Transiciones**: ninguna. Todos los cambios entre cara y pantalla son corte seco [V].

**Formato y camara** [M+V]:
- 9:16. Archivo de TikTok: 1080x1920 HEVC 30 fps en algunos, 720x1280 o 576x1024 en otros (recompresion de la plataforma); grabado a 1440x2560 segun IG [D].
- **iPhone a la altura de los ojos, plano medio corto**: ojos a ~33-38% del alto, cabeza ocupa ~25-35% del ancho, torso visible. Una variante en contrapicado con los brazos sobre una silla (video IG socio). Mano o mesa de madera cortan el borde inferior.
- Luz **calida de interior** (lampara/plafon, tira LED en la pared, ventilador de techo), sin aro de luz, sin LUT visible. 3-4 ambientes y 4 colores de remera distintos en los 12 videos (beige, negra, gris, marron) mas una capucha de noche: **parece grabar por lotes y cambiar de ropa y de cuarto entre lotes** [V][I].
- Pantallas **filmadas con el celular apuntando al monitor** a pantalla completa vertical (se ve teclado, bisel y moire), no grabaciones de pantalla [V]. Esto vuelve ilegible el texto chico (Gemini: "no se distingue" en cada captura).

**Titulo fijo (rotulo)** [V]:
- Sans geometrica **bold blanca** (tipo Inter/SF), 2 lineas centradas, **14-26% del alto desde arriba**, altura de letra ~2,5-3% del cuadro, con **sombra suave**, sin caja. Variante: caja blanca de esquinas redondeadas con texto negro (agentes, PET en mayusculas).
- Presente **desde el cuadro 0 hasta el final**. Palabra enfatizada en mayusculas ("BIEN").

**Subtitulos** [V]:
- **Blancos**, regular, **minusculas**, sin puntuacion (salvo "¿?"), con sombra suave, **sin caja y sin color de resaltado**.
- **Una sola linea de 1-3 palabras** (pico de 4), **~2,2% del alto**, centrados a **~78% del alto** ("lo que construyes", "con claude", "se ve hecho con", "artificial", "a kilometros").
- Cambian cada ~0,4-0,6 s, al ritmo de la voz. Aparecen ~0,3 s despues del titulo.
- **Autogenerados y sin corregir**: "Claude" sale como "cloud" en 5 de los 12 videos (design.md, sin basura, Socio, PET, Meta Ads) y el subtitulo "para tiktok" se pisa con una captura (se lee "partiktokgar") [V]. Para Sergio Urcullo es un error a evitar (diccionario de marcas).

**Caja de concepto** [V]:
- Rectangulo **blanco de esquinas redondeadas** (~6% del ancho), texto **negro bold**, 1-3 lineas, al **~62-70% del alto** (sobre el pecho, nunca sobre la cara).
- **Efecto maquina de escribir** (letra por letra: "Construyes A", "A").
- Una caja por idea nueva; listas en 2-3 cajas apiladas ("Colores / Letras / Espacios").

**Ficha de logo** [V]: icono de app (Claude, Facebook, Instagram) en cuadrado blanco redondeado o circulo, al ~60-68% del alto, **entra chico y crece (pop) en ~0,5 s**, queda ~1-2 s.

**Stickers pixel art** [V]: criatura naranja de 8 bits (parece la mascota de Claude Code [I]) en variantes por contexto: con llave y navegador, con laptop, con anteojos, con gafas de sol, "NO", muerta, con musculos. ~1,5-2,5 s cada uno, a la altura del pecho. Es su firma grafica.

**Memes y GIFs de peliculas** [V]: Joey (Friends) con la boca abierta, titere mono de lado, un oficinista cansado; en rectangulo de esquinas redondeadas (~40% del ancho) sobre el pecho, 1-2 s. Hay 1-3 por video [V/G].

**Capturas de pantalla** [V][M]: 2-7 por video (mediana 4), 1-5 s cada una; pantalla completa, con titulo y subtitulo encima; sitios: Refero, UI UX Pro Max, GitHub (README de repos propios y ajenos), Composio, panel de conectores de Claude, Mobbin, 21st.dev, Anthropic.com. Una captura "pesada" de 9-19 s cuando recorre una lista (los 144 agentes).

**Zoom** [NV]: no medido. Cambia el tamano de la cara entre tramos de la misma toma, pero no se separa del movimiento corporal.

**Audio** [M]:
- Sonoridad **-14,2 a -14,5 LUFS en 11 de los 12** (la comedia: -16,4): es casi igual en todos, o sea la normalizacion de la plataforma, no su mezcla. No se puede usar como receta.
- **Prueba extra de la cama** (verificacion, ventanas de 50 ms): en "agencia" ningun cuadro baja de -40 dB y las ventanas mas silenciosas aun traen +15 dB de energia bajo 200 Hz; en design.md el 6% de las ventanas esta bajo -50 dB y esa banda queda en -9 dB. Cuadra con cama continua en agencia y solo voz en design.md. Los 2 reels de IG nuevos (GPT-6, Claude + Instagram) tambien son solo voz (piso -56 y -50 dB). Si es musica o ruido de cuarto no se puede decir sin escuchar.
- **Piso de ruido** (percentil 5 de la energia, ventanas de 50 ms): **-32 a -37 dB en 5 de 12** (agencia, WhatsApp, agentes, Meta Ads, IG socio) contra **-45 a -62 dB en los otros 7** (design.md, sin basura, app, PET, comedia, IG design.md, remate). El primer grupo tiene una **cama continua** (musica o ambiente) unos 16-20 dB bajo la voz [I]; el segundo, solo voz. **No es regla de la cuenta**: los dos TikToks mas vistos (design.md y sin basura) no tienen cama.
- SFX (pop, whoosh, click): no verificables sin escuchar. El comentario "ponle mas sonidos de click" [D] y Gemini en 6 de 8 pasadas del pase 1 los sugieren, y los niega en 5 de 7 del pase 2 [G]. No se asumen.
- IG: 6 de 7 con "sonido original"; el sketch de 14,5 s usa musica con licencia [D].

**Primeros 3 s, cuadro por cuadro** (fotogramas a 0; 0,4; 0,8; 1,3; 2,0 y 3,0 s) [V]:

| t | design.md (TT 87,9 mil) | sin basura (TT 62,4 mil) | Meta Ads (TT 1,2 mil) | Socio (IG 467 mil) |
|---|---|---|---|---|
| 0,0 | titulo fijo ya en pantalla; cara en plano medio, mano abajo; **sin subtitulo** | titulo fijo; mano al mentón; sin subtitulo | titulo fijo; manos frotandose; sin subtitulo | titulo fijo; **contrapicado**, brazos cruzados; sin subtitulo |
| 0,4 | mano levantada; subtitulo "lo que construyes" | mano abierta; "tú que" | "que pagamos" | "si tú tienes" |
| 0,8 | **ficha de Claude chica** sobre el pecho; "con claude" | **caja "Construyes A..."** (escribe); "construyes" | "anuncios" | **caja "Negocio pequeño"**; "un negocio" |
| 1,3 | ficha **mas grande** (pop); "se ve hecho con" | ficha de Claude chica; "apps con claude" | **circulo azul de Facebook**; "en facebook" | "pequeño cloud" |
| 2,0 | sin ficha; "artificial" | ficha **grande**; "y él te entrega" | logo sigue; "estamos tirando" | **ficha de Claude grande**; "acaba de sacar" |
| 3,0 | **caja blanca escribiendo "A..."**; "a kilómetros" | sin ficha; "que corre bien" (dedo en la mejilla) | sin logo; "porque no" | **caja "15 empleados"**; "quince empleados" |

Lo comun: titulo en 0,0 s, primer subtitulo a ~0,4 s, **un elemento grafico nuevo cada ~0,5-1 s**, ningun corte de camara en los primeros 3 s.

### 4.2 Remate / sketch corto (12-15 s)

- Una **toma sin cortes**, sin titulo, sin cajas: solo subtitulo (la unica capa), a ~75% del alto [V][M].
- Cuarto oscuro, capucha, acostado, mano en la sien, luz de pantalla; "sonido original", solo voz (piso -62 dB) [M].
- **Comedia sobre pantalla** (TikTok 922 vistas): grabacion del monitor con el prompt, caja "PROMPT MAESTRO" fija y zoom lento. Mediana 888 vistas, 1,1% de guardados [M].
- El remate que pego fue el **polemico para el publico** (ChatGPT miente): 2,1 M en IG, solo 9,5 mil en TikTok [D+M]. El de comedia de prompts, no (922) [I].

### 4.3 Largo horizontal

**No existe.** El canal de YouTube no tiene videos largos ni listas [M]. No hay nada que medir. Lo largo es: ebook, boveda, repos y talleres en vivo.

### 4.4 Carrusel (PagoKit, 7 laminas, 3:4, 2480x3306) [V]

| Lam. | Titular | Funcion |
|---|---|---|
| 1 | "Agrega metodo de pago a tu aplicacion." + "Con PagoKit, Claude te arma la caja." | portada |
| 2 | "Tres pasos para configurar pagos en tu app." + logos Tarjeta, OXXO, Pix, Mercado Pago | promesa |
| 3 | "Es la caja de cobro de tu app." + panel con 3 puntos (te hace 3 preguntas, escribe el cobro por ti, lo deja seguro) | que es |
| 4 | "Instalalo en 3 comandos." + comandos en fuente monoespaciada | paso |
| 5 | "Dile de donde son tus clientes." + Stripe, Mercado Pago, Wompi, Lemon Squeezy | eleccion |
| 6 | "Pruebalo antes de cobrar de verdad." + 3 puntos (llaves de prueba, manual, prueba de 1 dolar) | seguridad |
| 7 | "Comenta PAGOS y te mando PagoKit." + "con la guia para instalarlo" | CTA |

- Una idea por lamina; **titular en dos tonos**: sans condensada negra muy pesada + serif **cursiva de color** (naranja, amarillo, rojo, segun el color dominante de la foto).
- Kicker "PAGOKIT" arriba a la izquierda; pie "ENRIQUE ROCHA · @soyenriquerocha" y paginacion "01 / 07".
- **Panel de vidrio esmerilado** con 3 puntos e iconos de linea.
- Fotos **generadas con IA**: el en cafe, camion de comida, metro, **junto a un gemelo suyo en voxel 3D** (estilo Minecraft). Etiqueta "Contenido generado con IA".
- Pie de foto: "Claude te ayuda a agregar metodo de pago a tu aplicacion en tres sencillos pasos, para que comiences a facturar" [D].

### 4.5 Como lo edita

- Mantiene un repo propio, **Editor Pro Max** (Remotion + Claude Code, MIT, 264 estrellas): 25 componentes (AnimatedTitle, LowerThird, TypewriterText, WordByWordCaption, CaptionOverlay con "5 presets" al estilo TikTok, JumpCut, SplitScreen, AudioTrack con ducking), 12 transiciones y plantillas TikTok/InstagramReel/TalkingHeadEdit [web, GitHub README]. **No hay evidencia de que edite estos reels con eso** [NV]: los subtitulos con errores ("cloud") y la caja que escribe a mano sugieren una app de captions comun mas overlays, no un render de codigo [I].
- Cuenta con equipo ("detras de @tododeia") [D].

### 4.6 Correcciones a docs previos (se mantiene lo medido)

| Doc previo | Decia | Esta ficha mide |
|---|---|---|
| `PLAN-REFERENTES.md` §4 punto 1 | "Un corte cada 3-4 s (18 cortes en 67 s)" | 4-14 cortes duros por video (en el de 66 s: 4); 0,6-2,1 cada 10 s; tomas de cara de 16-45 s sin corte |
| idem | "Subtitulos de 1 a 4 palabras, blancos, con la palabra clave en amarillo" | **blancos, sin amarillo**; el resaltado es una **caja blanca aparte** con texto negro |
| idem | "lo-fi bajito, pop o whoosh cuando entra cada grafico" | cama continua de fondo solo en 5 de 12 videos; SFX no verificables |
| `FICHAS-MONTAJE-REFERENTES.md` | "caja de palabra clave a 60-72%" | confirmado: 62-70%, con efecto maquina de escribir |
| `FICHAS-MONTAJE-REFERENTES.md` | subtitulo en vivo a ~76% | confirmado: ~78% |
| `PLAN-REFERENTES.md` | "4 capturas de 2-5 s cada una" | 2-7 inserts (mediana 4) de 0,6-5 s, y una rafaga de 9-19 s en los videos que recorren un repo |

Receta medida del molde Rocha (para `edicion-referentes`): toma continua de cara + titulo fijo + subtitulos blancos 1-3 palabras a 78% + caja blanca con maquina de escribir a 65% + ficha de logo con pop + 2-7 capturas de 1-5 s + corte seco, sin transiciones; cama de fondo solo en parte de los videos y no en los dos mas vistos de TikTok ni en los 2 reels de IG medidos.

## 5. Que copia Sergio Urcullo YA

| # | Que | Detalle concreto | Donde se aplica | Evidencia |
|---|---|---|---|---|
| 1 | **Gancho de segmento + numero + gratis, con titulo escrito en el cuadro 0** | El reel mas pegado de su IG visto en movimiento (467 mil) abre con el segmento ("si tienes un negocio pequeno") y un numero concreto de algo que sale gratis. Plantilla: "Si tenes [tipo de negocio], [cosa verificada] ya [cambio], y son [N] [beneficios]". La noticia puede tener meses (la suya era de mayo y la conto en agosto). Cada cifra y cada "gratis" se verifica contra la fuente oficial el dia de publicar | guiones S2-D08-A y S2-D07-A del 9-15-oct; rotulos del PLAN §5 | [V] fotogramas 0-3 s de 4 videos (titulo en 0,0 s); [G+V] guion del Socio; [D] 467 mil |
| 2 | **Receta de 2-3 pasos con una herramienta con nombre por paso y una captura de 1-5 s por paso** | Ya esta en F2. Agrega el numero medido: 2-7 capturas por video (mediana 4), de 1-5 s | guiones de desarrollo (N04, D01-A, D02-A); molde Erik | [M] 2-7 inserts por cortes duros; [V] capturas en los 5 videos con fotogramas |
| 3 | **Edicion por capas sobre una toma continua** | 0-2,1 cortes duros por 10 s (mediana ~1,1) y tomas de cara de 16-45 s. Para Sergio Urcullo (graba 1 h por dia) es lo mas barato: no hay jump cuts que montar, hay overlays y 2-7 inserts de captura | edicion: `edicion-referentes`, corregir molde Rocha con los numeros de §4.6 | [M] cortes en 14 videos (ffmpeg, umbral 0,35); [V] tomas de cara |
| 4 | **Sistema grafico de 4 piezas, con nuestra paleta** | titulo fijo blanco (14-26% alto) · subtitulo blanco 1-3 palabras a 78% **sin color** · caja blanca de concepto con maquina de escribir a 65% · ficha de logo con pop. El verde de Onia va solo en la palabra de la caja o en el CTA, no en el subtitulo | edicion: plantilla HyperFrames del molde Rocha | [V] fotogramas de design.md, GPT-6 y Claude + Instagram; [M] cortes |
| 5 | **Medir "guardados", no solo likes** | En sus tutoriales que pegan, guardados = 5,6-7,6% de las vistas (likes 6-8%); la comedia, 1,1%. Se mide el mismo numero en los videos de Sergio Urcullo y se compara con esa vara (no hay umbral propio todavia) | pauta/edicion: tablero de los 12 reels de la semana | [M] `save_count` de TikTok, 4 videos re-medidos en la verificacion |
| 6 | **CTA con una pregunta concreta del producto o del negocio** | El WhatsApp (pregunta "como usarias este agente") trajo 0,61% de comentarios por vista; design.md ("que pagina") solo 0,08%. Pregunta de uso, no de gusto. Va ademas en el formulario de cal.com (PLAN §2) | guiones y comunidad | [M] comentarios/vistas en 4 videos de TikTok (re-medido); [D] CTA en IG |
| 7 | **Comentario fijado: "comenten con TEXTO, no solo emojis"** | Lo repite en cada post para no perder alcance. Es gratis y no necesita DM automatico | comunidad (comentario fijado de cada reel) | [D] captura de comentarios en docs previos; [NV] si lo repite en cada post |
| 8 | **Un master de IG puede resubirse sin re-editar a TikTok y Shorts, con titulo adaptado** | Probado en 2 casos (design.md, Claude + Instagram): cortes identicos. IG da 5,3 y 36 veces mas vistas en el mismo video. Tambien hay produccion propia de TikTok y Shorts (5-6 por dia) que no sale de IG; para Sergio Urcullo, con 1 h de grabacion por dia, resubir el mismo master evita editar tres veces | edicion/pauta: calendario de publicacion | [M] 2 masters con cortes identicos (design.md, Claude + Instagram); [M] las razones IG/TikTok. Caso no probado: el resto |
| 9 | **Titulo = herramienta + resultado + adverbio de calidad o ahorro** | "BIEN", "sin basura", "sin quemar tu cuenta" son los de las piezas de 24-88 mil. Ejemplos de forma, a verificar contra el producto antes de usarlos: "Tu bot de WhatsApp sin que te cobren de mas" / "Tus citas sin perder ni una". Una palabra en mayusculas | guiones y rotulos | [M] titulos de los 9 videos de mas de 20 mil (catalogo re-leido) |
| 10 | **Una pieza propia por serie con un recurso que se pueda tocar** | Cada serie suya tiene un repo. Para Sergio Urcullo: la guia o plantilla de la comunidad por cada reel (el recurso vive afuera del video, patron #4 del PLAN) | oferta / comunidad (Avisos y archivo de drops) | [web+API] 31 repos, estrellas re-leidas; [I] la traslacion a Sergio Urcullo |

## 6. Que NO se copia y por que

| Que | Por que |
|---|---|
| **5-6 videos por dia en TikTok y Shorts** | Tiene equipo y 282 mil seguidores en IG; la loteria de 1 de cada 5 necesita volumen. Sergio Urcullo graba 1 h por dia; el cuello es grabar |
| **Memes y GIFs de peliculas y series** (Joey, titere, oficinista) | Riesgo de derechos de autor y de marca; la regla del PLAN ya los descarta |
| **Mascota pixel de Claude Code** | Es arte de la marca de Anthropic y su firma visual; nos haria ver como un segundo Rocha. Si hace falta un sticker, uno propio de Onia |
| **Filmar el monitor con el celular** | Texto ilegible, moire y bisel; contradice "producto visible". Se hace con captura de pantalla real recortada |
| **Subtitulos autogenerados sin corregir** ("cloud" por Claude) | El diccionario de marcas es obligatorio en `editor-videos` (Claude, Onia, WhatsApp, Higgsfield) |
| **Mostrar solo la herramienta y no el resultado** | Es la queja de su audiencia y le pega a la regla "producto visible o no sale". Sergio Urcullo muestra el resultado real en cada pieza |
| **Cifras sin fuente en pantalla** ("te miente el 27%") y repos ajenos presentados como propios ("todos los agentes que necesitas") | Choca con "no fabricar cifras" y con la regla de verificar contra la fuente el mismo dia. Se cita autor y fuente |
| **Nicho de noticias de modelos** | 9% de sus piezas y 1% de las vistas de TikTok; y sus hits de IG con nombre de modelo en el gancho son tutoriales de ahorro; saturado en español. La ventaja de Sergio Urcullo es "construir para un negocio de Bolivia" |
| **Nicho "construir apps / agentes para desarrolladores"** | Su ~80% de vistas viene de ahi (construir + agentes + ahorrar cuenta), pero el cliente de Onia es el dueño de clinica, no el que arma apps. Se copia la forma (receta de pasos), no el tema |
| **Precios en USD/MXN, ebook, llamadas de USD 15-297, talleres, afiliados, donaciones** | Vender horas va contra la regla "Onia vende software, nunca horas"; la asesoria de Sergio Urcullo es gratis; ningun precio en USD esta probado en Bolivia |
| **"Comenta X y te la mando" como unico CTA** | Con 2 rechazos de Meta y 0 leads no esta probado; su exito en IG depende de un envio automatico que nosotros no tenemos. Alternativa a evaluar: responder en publico en el comentario [I] |
| **Carruseles con fotos de IA y gemelo voxel** | Es su marca visual, rechazo de lo "muy IA"; la paleta de la marca personal es verde, blanco y negro |
| **Tienda sin testimonios ni garantia** | Rocha vende por audiencia; con 0 clientes pagando, Sergio Urcullo necesita prueba antes de vender |
| **Gesticulacion constante** | Es critica de su propio publico ("ya me estabas mareando"); no copiar el exceso |
| **Titulos reescritos para YouTube como frases de busqueda sin emoji** | YouTube Shorts de Rocha: mediana 662 vistas (166 Shorts) y ~410 en el bloque Claude del 29-sep al 8-oct, contra 1,3 mil en TikTok. No es evidencia de que funcione; se prueba despues |

## Verificacion del 2026-10-08 (2da pasada)

Se rechequearon 14 afirmaciones contra la fuente. **Se sostuvieron:** catalogo de TikTok (234 videos, mediana 827, 5-6 por dia), bloque Claude (mediana 1,3 mil, 13 de 57 pasan 10 mil, top 5 = 56% de las vistas), emoji firma, duraciones, razones de guardados y comentarios (4 videos), estrellas de GitHub (31 repos), precios de tododeia.com, cortes duros de 3 videos, sistema grafico del gancho (titulo, subtitulo blanco sin color, caja con maquina de escribir, ficha, sticker pixel).

**Cayeron y se corrigieron arriba:**

| Afirmacion original | Que se encontro |
|---|---|
| YouTube: 80 Shorts, mediana 658, maximo 2.900 | 166 Shorts, mediana 662, maximo 6.000; la primera lectura se corto. Con fechas: ~3 por dia desde el 25-ago |
| "Shorts mismo ritmo que TikTok" | Solo desde el 28-29-sep; antes ~3 por dia |
| "TikTok y Shorts publican los masters de IG" (4 casos) | 2 casos probados por cortes; GPT-6 (53 s vs 85 s) y "4 equipos" vs Socio no coinciden; el volumen de IG (1,3 por dia) no alcanza para alimentar 5-6 por dia |
| IG "GPT-6 Astra + Fable 5.1" (464 mil) = comparativo de modelos | Es un tutorial de ahorro de cuenta (plugin de Codex en 3 lineas) |
| Pilar MODELOS: 6 piezas, 4% de las vistas | 5 piezas, 1%: "Cuando Claude no puede, Codex lo termina" (13,6 mil) es tutorial de ahorro y paso a CUENTA |
| Construir + agentes + cuenta = 78% / 57% | 80% / 59% |

**Huecos que se llenaron:** (1) fechas y catalogo completo de YouTube; (2) 2 reels de IG de gancho de novedad medidos en movimiento (el cuerpo es tutorial, no noticia); (3) audio: prueba objetiva de la cama continua y pase de Gemini solo con audio. **Siguen abiertos:** que una persona escuche 2-3 reels; comentarios y DM automatico; contenido de las 299 guias.

## Fuentes (todas leidas el 2026-10-08)

Videos y perfiles
- TikTok, perfil y 234 videos: https://www.tiktok.com/@soyenriquerocha
- 9 videos de TikTok: URLs de la tabla 0.2
- IG reels: https://www.instagram.com/soyenriquerocha/reel/DUnSLm0DqPO/ , /reel/DcepXPLh1S7/ , /reel/DdX3Hp4CnL0/
- IG carrusel: https://www.instagram.com/soyenriquerocha/p/DeBChXEG77k/
- YouTube Shorts (166): https://www.youtube.com/@soyenriquerocha/shorts
- Threads: https://www.threads.com/@soyenriquerocha

Web y producto
- https://www.tododeia.com (299 guias; ebooks USD 29)
- https://www.tododeia.com/community (boveda)
- https://www.tododeia.com/tienda/claude-de-cero-a-cien
- https://www.tododeia.com/llamadas
- GitHub: https://github.com/Hainrixz (31 repos), https://github.com/Hainrixz/whatsapp-agentkit, https://github.com/Hainrixz/editor-pro-max

Docs del repo usados
- `hermes-content/references/marca-personal/PLAN-REFERENTES.md`, `REFERENTES-ECOSISTEMA.md`, `FORMULAS-REFERENTES.md`, `FICHAS-MONTAJE-REFERENTES.md`, `EXTRACCION-REFERENTES-GUIONES.md`
- `.claude/skills/edicion-referentes/SKILL.md`

Archivos de trabajo (no van al repo): `C:\Users\PC\AppData\Local\Temp\claude\C--dev-proyectos-onia-hermes--claude-worktrees-onia-madre-v2-pr-review-2d85bb\202a717e-5bc8-42ab-ba2e-3dc26d723505\scratchpad\analisis-contenido\enriquerocha\` (mp4, catalogo TikTok y Shorts, metadatos, contact sheets, salidas de Gemini y de las mediciones).
