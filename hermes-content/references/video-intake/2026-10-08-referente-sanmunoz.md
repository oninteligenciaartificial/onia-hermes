# Santiago Muñoz (@sanmunoz.ia): análisis completo de contenido (2026-10-08)

> Pedido de Sergio Urcullo (8-oct): analizar a los referentes de punta a punta (estructura de contenido, comunicación,
> ediciones, guiones), no solo copiar piezas sueltas. Esta ficha NO repite lo ya escrito en `PLAN-REFERENTES.md`,
> `REFERENTES-ECOSISTEMA.md`, `FORMULAS-REFERENTES.md`, `FICHAS-MONTAJE-REFERENTES.md`, `SANTIAGO-CARRUSELES-POR-CODIGO.md`,
> `SANTIAGO-VIDEOS-ANIMADOS-POR-CODIGO.md` ni la skill `edicion-referentes`: las completa y corrige donde las mediciones nuevas
> las contradicen (sección 4.12).
>
> **Lo que cambia respecto de lo que ya sabíamos**
> 1. Su motor no son las noticias: son los **casos con un negocio real** (restaurante, cafetería, inmobiliaria) y la **edición con IA**.
>    Casos: mediana 31,5 mil vistas en TikTok contra 11 mil de las noticias y 12,7 mil de los tutoriales. Edición y animación: 18 % de sus
>    YouTube largos y 41 % de sus vistas de YouTube.
> 2. Su pico (1,6 M) no es normal: los 3 videos más vistos suman el 46,7 % de todas las vistas de TikTok. La mediana de sus 80 videos es
>    12,6 mil, y bajó de 21,7 mil (mar-abr) a 7,7 mil (sep-oct). Los 3 últimos (estilo nuevo: narrativa, IA generada, serie "Día N") hicieron 0,9 a 2,7 mil.
> 3. En TikTok la palabra clave en comentarios NO es su palanca: comentarios = 0,07 % de las vistas. Su cierre es "enlace en mi perfil".
> 4. Lo viral en TikTok no se convierte en vistas de YouTube (1,6 M en TikTok contra 7,3 mil en el largo del mismo tema), y a la inversa
>    (Astra: 31,8 mil en TikTok contra 271 mil en YouTube).

## 0. Cobertura

### 0.1 Catálogo mirado (8-oct-2026)

| Red | Qué se listó | Método | Con vistas | Con fecha |
|---|---|---|---|---|
| TikTok @sanmunoz.ia | **80 videos**, del 11-mar al 6-oct-2026 (suman 5,81 M de vistas) | `yt-dlp`: listado + metadatos de cada video (vistas, likes, comentarios, compartidos, guardados, pista de audio) | 80 | 80 (exacta, sale del ID) |
| YouTube @SantiMunozIA, videos largos | **60 videos = los 60 más recientes (ene-oct 2026) de los 150 largos que tiene el canal** (el listado se cortó con `--playlist-end 60`; verificado el 8-oct sin tope: 150 largos, 1,90 M de vistas) | `yt-dlp --flat-playlist` + feed RSS oficial del canal (15 últimos con fecha exacta, vistas y descripción) | 60 | 15 exacta, los 60 por mes aproximado |
| YouTube Shorts | **32 Shorts** | `yt-dlp --flat-playlist` | 32 | no |
| Instagram @sanmunoz.ia | no se pudo listar (IG no lista sin sesión) | se usan los datos ya guardados: 27 reels entre el 4-ago y el 1-oct, mediana 25,1 mil; 2 carruseles | 27 (de la ficha del 3-oct) | sí (ficha del 3-oct) |

Total analizado estadísticamente: **172 piezas con vistas** (80 + 60 + 32) y 140 de ellas con fecha exacta o por mes (los Shorts no traen fecha). Todo lo de YouTube de abajo habla de esa muestra de los 60 largos más recientes, no del canal entero (los otros 90 largos, más viejos, tienen mediana 3 mil y suman 598 mil vistas; entre ellos hay uno de 69 mil: "Create Professional Websites with AI for $0 in 15 Minutes"). Las vistas de
YouTube y TikTok son las visibles el 8-oct; en las piezas recientes no son finales.

### 0.2 Piezas analizadas una por una

Método: **MP4 completo bajado de TikTok** (`yt-dlp`) y, por cada uno: hoja de cuadros (1 cuadro cada 3 s, más los primeros 3 s a 4 cuadros por
segundo), transcripción local con Whisper `small` (palabras con tiempo), cortes y volumen con `ffmpeg` (umbral 0,30 = corte duro; 0,15 =
cambio visual), medición de píxeles en cuadros de 1080x1920 y Gemini `gemini-flash-lite-latest` (los 4 bloques del prompt). Donde Gemini y los
cuadros no coinciden, manda el cuadro. YouTube no deja bajar el MP4 (verificación de bot; no se intentó esquivarla): para esas piezas se usó
Gemini sobre la URL, la descripción y los capítulos (RSS), la miniatura y los 3 cuadros automáticos de YouTube (a 25, 50 y 75 %).

| # | Red | Pieza | Fecha | Dur. | Vistas | Qué se usó |
|---|---|---|---|---|---|---|
| 1 | TikTok | [WhatsApp: cuánto te va a costar](https://www.tiktok.com/@sanmunoz.ia/video/7682544740688071956) | 6-sep | 1:56 | 1,6 M | MP4 + todo el método |
| 2 | TikTok | [Sitio web para un restaurante en 1 hora](https://www.tiktok.com/@sanmunoz.ia/video/7676611913366785301) | 21-ago | 1:40 | 694,7 mil | MP4 + todo |
| 3 | TikTok | [Anuncio "100 % IA" para clínicas (Respóndele)](https://www.tiktok.com/@sanmunoz.ia/video/7632000077778685204) | 23-abr | 1:28 | 419,5 mil | MP4 + todo |
| 4 | TikTok | [Una suscripción de Claude es la mejor inversión](https://www.tiktok.com/@sanmunoz.ia/video/7630867362937310485) | 20-abr | 1:22 | 361,4 mil | MP4 + todo |
| 5 | TikTok | [Implementando IA a una cafetería](https://www.tiktok.com/@sanmunoz.ia/video/7647663861218233621) | 4-jun | 2:01 | 303,5 mil | MP4 + todo |
| 6 | TikTok | [Agente de voz de una inmobiliaria](https://www.tiktok.com/@sanmunoz.ia/video/7628706241744768276) | 14-abr | 2:57 | 209,3 mil | MP4: cuadros cada 4 s + gancho transcrito (28 s) |
| 7 | TikTok | [Loops (Claude Code trabaja solo)](https://www.tiktok.com/@sanmunoz.ia/video/7671079404759420181) | 7-ago | 1:33 | 138,4 mil | MP4 + todo |
| 8 | TikTok | [Así creo bots para mis clientes](https://www.tiktok.com/@sanmunoz.ia/video/7669171792912698645) | 1-ago | 1:43 | 140,7 mil | MP4 + todo |
| 9 | TikTok | [Meme "Yo antes de que Claude existiera"](https://www.tiktok.com/@sanmunoz.ia/video/7637278398196354324) | 7-may | 0:13 | 121,1 mil | MP4 + todo (el único de 13 s) |
| 10 | TikTok | [Campaña de Google Ads con Claude Code](https://www.tiktok.com/@sanmunoz.ia/video/7646547108840967444) | 1-jun | 1:16 | 12,7 mil | MP4: cuadros + gancho (video de vistas típicas, cerca de la mediana) |
| 11 | TikTok | [Historia de 1962 (Katherine Johnson)](https://www.tiktok.com/@sanmunoz.ia/video/7693394478383615252) | 6-oct | 1:03 | 1,1 mil | MP4 + todo (el más reciente) |
| 12 | TikTok | [Día 1: agente de IA para un negocio al azar](https://www.tiktok.com/@sanmunoz.ia/video/7692934985723940117) | 4-oct | 1:03 | 2,7 mil | MP4 + todo |
| 13 | TikTok | ["Solo empieza." (motivacional)](https://www.tiktok.com/@sanmunoz.ia/video/7691535364309224725) | 1-oct | 1:04 | 896 | MP4 + todo |
| 14 | YouTube largo | [GPT-6 Astra acaba de reemplazar a mi editor](https://www.youtube.com/watch?v=4jWLq8Gn_4Y) | 9-sep | 25:26 | 271,2 mil | Gemini (URL) + descripción, capítulos, miniatura, 3 cuadros |
| 15 | YouTube largo | [Construí un agente de IA que vale 5.000 USD (ep. 1)](https://www.youtube.com/watch?v=HIfvbFZ7Bww) | 4-oct | 34:45 | 10,4 mil | Gemini (URL) + descripción, miniatura, 3 cuadros |
| 16 | YouTube largo | [Contraté a Claude como animador](https://www.youtube.com/watch?v=5REPWhjX64A) | 26-sep | 20:17 | 19,8 mil | Gemini (URL) + descripción |
| 17 | YouTube largo | [¿Cuánto te costará WhatsApp desde el 1 de octubre?](https://www.youtube.com/watch?v=43MipDGZ18M) | 6-sep | 22:13 | 7,3 mil | descripción con capítulos + miniatura + 3 cuadros |
| 18 | YouTube Short | [Chatbot para el Mundial](https://www.youtube.com/shorts/8cVNW2b4gqE) | s/f | 1:24 (Gemini) | 9,4 mil (el Short más visto) | Gemini (URL) |

Además: **63 videos de TikTok con el gancho transcrito** (primeros 28 s, Whisper `base`; incluye el #6 y el #10) y metadatos completos de los 80.

### 0.3 Qué NO se pudo ver

- **MP4 de YouTube**: bloqueado por verificación de bot. Para las 5 piezas de YouTube analizadas no hay medición de cortes ni de volumen, solo Gemini,
  la descripción y hasta 3 cuadros por video. Gemini `lite` sobre un video de 25 min a baja resolución es de **confianza baja**: sus tiempos
  de capítulos no coinciden con los de la descripción (se usó la descripción como verdad).
- **Instagram**: no se listó ni se bajó nada hoy. Sus reels de IG que importan (restaurante `DcTvfgXozDx`, Astra sin cara `DdFY6a8I5tb`) tienen el mismo
  tema y la misma fecha que los de TikTok, pero no se comparó la edición: pueden ser cortes distintos. Las vistas de IG son las de la ficha del 3-oct.
- **Música y efectos de sonido**: no se pueden separar de la voz sin la pista original. Se midió el piso de ruido en las pausas (4.9).
  Los SFX (`whoosh`, `pop`) que dice Gemini no se pudieron verificar y en las piezas con voz medidas no aparecen como regla.
- **Animación exacta de los subtítulos** (a 30 cuadros por segundo) y el zoom fino: no se midieron cuadro a cuadro.
- **Dentro de Skool** (comunidad privada), la librería "Recursos gratis" de la web (no carga) y cualquier lista de correos: no se vieron.
- **Gemini `lite` alucinó detalles** en varios videos (dijo "pantalla partida" en el restaurante, que es POV a pantalla completa; "mano abriendo
  una mochila" que no está; música lo-fi en el "Día 1", donde el piso de pausas es -67 dBFS, o sea ninguna). Por eso cada afirmación de montaje
  de abajo sale de los cuadros o de una medición, y lo que sale solo de Gemini va marcado.

### 0.4 Ya cubierto antes (no se repite)

Reels de IG Pasta, Astra sin cara y "Solo empieza" (portadas); patrón palabra clave + respuesta automática en IG; carruseles de Forja y de
videos animados por código; 3 videos de TikTok del 6-sep, 9-sep y 29-sep en `PLAN-REFERENTES.md`; embudo, comunidad y precios de Skool
(USD 64/mes), Forja Starter / Comunidad / Agency Mode; mediciones del 1-oct (Sonnet, Clawd, Jev, Animaciones) en
`2026-10-01-santiago-erik-edicion-medida.md`; tutorial de 28 min del método. **Lo nuevo de hoy:** catálogo completo y estadística de las
tres redes, YouTube (todo), 13 videos de TikTok vistos enteros, ganchos de 63 más, medidas de píxel y de audio, el embudo de `sanmunozia.com`.

### 0.5 Catálogo (muestra de las 172 piezas)

**TikTok, los 20 con más vistas**

| Fecha | Vistas | Dur. | Guardados | Caption | ID |
|---|---|---|---|---|---|
| 2026-09-06 | 1.600.000 | 116 s | 15.266 | Calcula cuánto te va a costar la nueva actualización | 7682544740688071956 |
| 2026-08-21 | 694.700 | 100 s | 31.940 | Así hice un sitio web para un restaurante en 1 hora | 7676611913366785301 |
| 2026-04-23 | 419.500 | 88 s | 14.894 | ¿Qué les pareció? | 7632000077778685204 |
| 2026-04-20 | 361.400 | 82 s | 14.394 | ¿Ustedes qué opinan? | 7630867362937310485 |
| 2026-06-04 | 303.500 | 121 s | 8.111 | ¿Qué negocio les gustaría que fuera el siguiente? | 7647663861218233621 |
| 2026-04-14 | 209.300 | 177 s | 6.520 | Les dejo el tutorial en mi perfil | 7628706241744768276 |
| 2026-04-15 | 167.200 | 2796 s | 10.086 | Acabo de construir un agente de voz que vende por mí (el video largo de 46 min subido a TikTok) | 7628808738987658516 |
| 2026-04-24 | 156.400 | 80 s | 6.564 | ¿Ustedes ya lo probaron? (Claude Code edita video) | 7632417499996376340 |
| 2026-08-01 | 140.700 | 103 s | 4.911 | Así creo bots para mis clientes | 7669171792912698645 |
| 2026-08-07 | 138.400 | 93 s | 8.150 | ¿Tú ya conocías los loops? | 7671079404759420181 |
| 2026-05-07 | 121.100 | 13 s | 519 | ¿Quién entendió la referencia? | 7637278398196354324 |
| 2026-04-17 | 107.700 | 69 s | 3.566 | ¿Ustedes qué opinan? (Claude Design "mató a los diseñadores") | 7629863434544221461 |
| 2026-03-23 | 101.000 | 70 s | 2.936 | ¿Ustedes lo instalarían? (Claude "mató" a OpenClaw) | 7620594581964442901 |
| 2026-05-02 | 100.300 | 116 s | 3.729 | Le contaré cómo me va (campaña de Facebook) | 7635311954340400404 |
| 2026-06-14 | 94.700 | 75 s | 3.361 | Por algo quitaron el modelo (CRM con Fable 5) | 7651266974080683285 |
| 2026-06-09 | 87.800 | 87 s | 4.256 | ¿Ustedes corren anuncios? (3.000 pesos a una IA) | 7649412074409364757 |
| 2026-04-18 | 85.000 | 106 s | 3.855 | ¿Ya lo probaron? (6 cosas con Claude Design) | 7629884071014862101 |
| 2026-05-12 | 68.800 | 80 s | 1.700 | ¿Quién sabe? (cuatro agentes a la vez) | 7639144714075180308 |
| 2026-07-29 | 51.300 | 78 s | 1.433 | ¿Ustedes cuál prefieren? (Vercel o Cloudflare) | 7667740752495070485 |
| 2026-03-12 | 51.000 | 123 s | 1.914 | Síganme para más (Claude explicado para un niño) | 7616456363459300628 |

**TikTok, los 12 más recientes**

| Fecha | Vistas | Dur. | Caption | ID |
|---|---|---|---|---|
| 2026-10-06 | 1.109 | 63 s | En 1962, un astronauta se negó a despegar... | 7693394478383615252 |
| 2026-10-04 | 2.750 | 63 s | Creando agente ia para negocio | 7692934985723940117 |
| 2026-10-01 | 896 | 64 s | Solo empieza. | 7691535364309224725 |
| 2026-09-29 | 14.000 | 78 s | Open AI anuncia Dots | 7691043668295306517 |
| 2026-09-28 | 2.738 | 82 s | Sonnet 5.5 ya salió | 7690703830215937300 |
| 2026-09-23 | 2.092 | 68 s | Claude Opus 5.5 ya salió... | 7688834186240707860 |
| 2026-09-22 | 9.673 | 103 s | ¿Qué es Jev? | 7688159309712182548 |
| 2026-09-19 | 10.000 | 66 s | Crea animaciones profesionales con IA | 7687051875404811540 |
| 2026-09-16 | 7.694 | 119 s | Ve tus chatbots en tu celular | 7685954926702234900 |
| 2026-09-13 | 4.821 | 123 s | La IA se volvió peligrosa | 7684874458598886677 |
| 2026-09-09 | 31.800 | 92 s | Edita videos con ChatGPT Astra | 7683620377435720981 |
| 2026-09-06 | 1.600.000 | 116 s | Calcula cuánto te va a costar la nueva actualización | 7682544740688071956 |

**YouTube largos, los 12 con más vistas** (fecha = mes aproximado que muestra YouTube; los 15 más recientes tienen fecha exacta en 0.2)

| Mes aprox. | Vistas | Dur. | Título (traducido por YouTube) | ID |
|---|---|---|---|---|
| sep-2026 (9-sep) | 271.000 | 25:26 | GPT-6 Astra Just Replaced My Video Editor | 4jWLq8Gn_4Y |
| jun-2026 | 112.000 | 31:29 | I visited a coffee shop and set up a working AI system for them | uaMr9HpgJgE |
| ago-2026 | 69.000 | 29:33 | I fired my editor and hired Claude Code | QRhX4zU1jso |
| feb-2026 | 63.000 | 16:27 | I tried Claude in Excel and I'm NOT going back | 36Y9EhaZIbQ |
| ago-2026 | 62.000 | 48:45 | Stop Losing Customers: Build a $5,000 Chatbot in 30 Minutes | x361xBKBdic |
| may-2026 | 51.000 | 37:20 | Edit Videos with Claude Code (FREE) | M1UQzYaQl4Y |
| ene-2026 | 46.000 | 29:00 | Connect WhatsApp to n8n WITHOUT losing your number | bLHWbtcSU6s |
| ago-2026 | 40.000 | 28:49 | Claude Code Just Destroyed Video Editors (STEP-BY-STEP) | RSomDkV2Aj0 |
| ago-2026 (28-ago) | 36.000 | 43:49 | I Built a TEAM of AI Agents with Grok Bot | VpljJqzPvg0 |
| mar-2026 | 33.000 | 30:09 | OpenClaw: Everything You Need to Know | xgJ0Mr0ceYA |
| sep-2026 (19-sep) | 30.000 | 21:09 | Claude Design + Claude Code: My Video Edit That Got +1,000,000 Views | oFYznV9EYPg |
| may-2026 | 27.000 | 29:53 | Your designer charges $15k. Claude Design does it in 2 min | Gsv2T-9GKx0 |

## 1. Estructura de contenido

### 1.1 Pilares y su peso

**YouTube largo (60 videos, clasificados a mano por título y descripción)**

| Pilar | Videos | % de videos | Mediana de vistas | % de las vistas |
|---|---|---|---|---|
| Edición, animación y diseño con IA | 11 | 18 % | **27.000** | **41 %** |
| Agentes, Claude Code y herramientas (tutorial) | 16 | 27 % | 12.000 | 21 % |
| Caso: negocio o cliente real | 9 | 15 % | 10.000 | 16 % |
| WhatsApp, chatbots y Forja | 7 | 12 % | 11.000 | 12 % |
| Ads, contenido y marketing | 8 | 13 % | 6.550 | 5 % |
| Noticias, modelos y opinión | 7 | 12 % | **2.000** | 3 % |
| Monetizar y vender servicios | 2 | 3 % | 9.950 | 2 % |

**TikTok (80 videos, clasificados a mano por el gancho; error de ±3 videos)**

| Tipo | Videos | % | Mediana de vistas | % de las vistas |
|---|---|---|---|---|
| Caso o experimento con un negocio o prueba en vivo ("Le di 3.000 pesos a una IA", restaurante, cafetería) | 16 | 20 % | **31.500** | 34 % |
| Tutorial, herramienta o producto propio (Forja) | 29 | 36 % | 12.700 | 19 % |
| Noticia o novedad de IA | 20 | 25 % | 11.200 | 34 % (por el 1,6 M) |
| Narrativa, meme o motivacional | 7 | 9 % | **2.700** | 3 % |
| Tesis u opinión | 2 | 3 % | 361.400 y 3.500 | 6 % |
| Otros (largos con caption, consejos) | 6 | 8 % | 6.300 | 4 % |

- **Lectura:** lo que más rinde es "yo hago X, con un negocio real o una cuenta real, y se ve el resultado". Lo que menos rinde es lo que no
  tiene demo propia (noticia sola: Sonnet 5.5 2,7 mil, Opus 5.5 2,1 mil, Dots 14 mil) y lo narrativo sin su cara.
- **Excepción que confirma la regla:** la noticia que bate todo (WhatsApp cobra desde el 1-oct, 1,6 M) trae **una herramienta propia, gratis,
  atada a una fecha**. Sin herramienta, la misma clase de noticia hace 2 a 14 mil.

### 1.2 Series recurrentes

| Serie | Piezas | Cifras |
|---|---|---|
| "Visito un negocio y le dejo IA funcionando" | TikTok restaurante y cafetería; YouTube cafetería, restaurante, inmobiliaria, spa | TikTok 694,7 mil y 303,5 mil; YouTube 112 mil (cafetería), 25 mil (inmobiliaria), 14,8 mil (restaurante), 7,6 mil (spa) |
| "X acaba de matar a Y" (novedad + demo) | Claude Design, Claude vs OpenClaw, Opus 4.7, filtraciones | 107,7 mil y 101 mil los dos "matar"; el resto 7 a 14 mil |
| "Dejo que Claude Code haga X" | editor, anuncios, viaje, secretaria, CRM | 87,8 mil; 94,7 mil; 31,9 mil; 25,2 mil; 21,7 mil |
| "Edito con IA" (su nicho propio) | editor, animador, Astra, color grading | YouTube 271 mil, 69 mil, 51 mil, 40 mil, 30 mil, 19,8 mil |
| "Día N creando un agente para un negocio al azar" (nueva, desde el 4-oct) | TikTok del 4-oct + YouTube ep. 1 (la descripción lo llama "episodio 1 de una nueva serie") | TikTok 2,7 mil; YouTube 10,4 mil a los 4 días (mediana de sus largos: 9.750) |
| Pedir ideas al público | "¿Qué negocio les gustaría que fuera el siguiente?" (TikTok 303,5 mil) y 6 Shorts "¿Qué más te gustaría automatizar?" | Shorts de este tipo: mediana 3,6 mil |
| Producto propio (Forja, Forja Inbox) | lanzamiento de 185 s, actualizaciones, app en el celular | 8 mil; 10 mil; 7,7 mil |

Dos reglas de la serie "visito un negocio": (1) siempre arranca en el lugar (POV de celular), (2) siempre cierra con "el tutorial completo
está en el enlace del perfil". El corto es el tráiler del largo; no cuenta la receta.

### 1.3 Mezcla de formatos y frecuencia por red

| Red | Mezcla | Frecuencia | Vistas típicas |
|---|---|---|---|
| TikTok | 76 videos verticales + **4 carruseles de fotos** con música (los "60 s", ver 1.4); 1 solo upload largo (46 min, 167 mil vistas) | **80 videos en 209 días = 2,7 por semana** (mediana de los últimos 30 días: 4,8 mil) | mediana 12.650; media 72.613; p25 ~6.800; p75 ~46.000 (51.000 con otro método de percentil) |
| Instagram (ficha del 3-oct) | 27 reels + 2 carruseles en 59 días: 93 % reel, 7 % carrusel | 3,2 reels por semana | mediana 25,1 mil |
| YouTube largo | 60 videos recientes (65 % de las 92 piezas de la muestra; el canal tiene 150 largos + 32 Shorts) | ~7 por mes desde abril (14 largos entre el 9-ago y el 4-oct = 1,75 por semana) | mediana 9.750; media 21.757; 11 videos de 30 mil o más; 2 de 100 mil o más (re-contado el 8-oct; la mediana de los 150 largos es 4.700) |
| YouTube Shorts | 32 (35 % de las piezas); son los mismos clips de TikTok/IG con el mismo caption ("¿Ustedes qué opinan?") | irregular | mediana 3.600; máximo 9.400; **9 % de las vistas del canal** |

Los largos son el 91 % de las vistas de YouTube en la muestra (en el canal completo, los 32 Shorts valen 6,4 %: 130 mil de 2,03 M). Los Shorts son réplica de los cortos: no hay formato propio.

### 1.4 Duraciones

- TikTok: mediana **80 s** (rango 13 a 177 s). Rinden más los largos: **121 s o más: mediana 30 mil (n=10); 91-120 s: 18,6 mil (n=19);
  61-90 s: 11,9 mil (n=36); 31-60 s: 8,7 mil (n=12)**. (El de 13 s del meme, con 121 mil, es el único corto de 30 s o menos que rindió; los otros 2 de ese tramo hicieron 3,5 mil y 4,6 mil.)
- Hay 5 posts de **60 s exactos** (mar-jul). **Verificado el 8-oct: 4 de ellos NO son videos sino carruseles de fotos de TikTok** (7 a 12 láminas 1856x2304, 4:5, fondo crema,
  mascota naranja, acuarela; la "duración" de 60 s es la de la pista de música: Ogryzek AURA / EMPIRE) con caption largo en forma de nota ("Hace unas horas firmaron un deal con
  SpaceX...", 7 láminas, 26,7 mil; "Loops", 12 láminas, 9,6 mil). El quinto (5,1 mil) sí es un video de 1080x1920. Los 4 carruseles rinden 6,7 a 26,7 mil, mediana 8,7 mil. Por eso la
  fila "31-60 s" de arriba, sin ellos, queda en mediana 8,8 mil (n=8, rango 2,5 a 29,9 mil).
- YouTube: mediana **24,4 min**. Por tramo: 20-30 min mediana 14 mil (n=25); **30-45 min: 29 mil (n=8)**; menos de 20 min: 5,9 mil (n=17);
  más de 45 min: 9,4 mil (n=7). El pico (271 mil) tiene 25 min.

### 1.5 Qué rinde más y qué rinde menos (cifras)

- Concentración: top 3 = **46,7 %** de las vistas de TikTok; top 10 = 72,1 %. 14 videos de 100 mil o más (17,5 %); 32 de menos de 10 mil (40 %).
  Sin los 3 primeros la mediana sigue en 11.900 y la media baja de 72,6 mil a 40,2 mil.
- Tendencia (mediana de TikTok por período): mar-abr **21,7 mil** (n=25) / may-jun 12,7 mil (n=22) / jul-ago 14,2 mil (n=20) / sep-oct **7,7 mil**
  (n=13). El techo viral sigue apareciendo (1,6 M el 6-sep) pero el piso se hundió.
- Lo último: 6-oct 1,1 mil / 4-oct 2,7 mil / 1-oct 0,9 mil. Los tres con estilo nuevo (narrativa sin cara, ilustración, IA generada).
- IG contra TikTok en la misma ventana (4-ago al 1-oct): IG mediana 25,1 mil (27 reels) contra TikTok 13,7 mil (19 videos). Por pieza, IG rinde 1,8 veces más en la
  mediana; TikTok tiene el pico de 1,6 M. Sube a TikTok menos de lo que sube a IG (19 contra 27 en esos 59 días).
- Engagement: mediana de likes **5,0 %** de las vistas, guardados **2,7 %**, compartidos **0,52 %**, comentarios **0,07 %**. Los de 100 mil o más
  guardan 3,5 % contra 1,4 % los de menos de 10 mil: **los guardados distinguen lo que se difunde**.
- Música (pista de audio de TikTok): 55 videos con "sonido original" (mediana 11,5 mil), 15 con las pistas de Ogryzek (AURA / EMPIRE slowed;
  mediana 9,6 mil) y 10 con otras pistas con licencia (mediana 38 mil, tirada por 3 casos: "Ding" 419 mil, Echo Sax End 138 mil y una pista de
  meme 121 mil). **En TikTok la música no explica el rendimiento**; la inferencia de la ficha del 3-oct (los 4 picos de IG llevan música con
  licencia) vale para IG, no para TikTok.
- Día y hora (hora de México, n chico, solo orientativo): jueves y viernes tienen la mediana más alta (25,2 mil y 28,7 mil, n=11 cada uno);
  domingo y lunes la más baja (8,4 mil y 9,3 mil). Entre las 9 y las 12 de la mañana, 25,2 mil (n=15).
- Caption: mediana de 5 palabras, solo hashtags #ia (75 de 80) y #claude (44). Con signo de pregunta (34 videos): 12,7 mil; sin pregunta (46): 12,3 mil.
  **El caption no mueve nada**: los 4 más vistos de abril usan captions genéricos tipo "¿Ustedes qué opinan?"; todo se decide en el cuadro 0.

### 1.6 Cómo se conectan el corto y el largo

1. TikTok/IG/Shorts: clip de 60 a 120 s que muestra el resultado (nunca la receta) y cierra "tutorial completo en el enlace de mi perfil".
2. `sanmunozia.com` (hub de enlaces, revisado hoy): Forja destacado arriba con la marca "Nuevo", después los 5 videos de YouTube más
   recientes o fuertes (el de 5.000 USD, "Edita como profesional", Forja Inbox, Astra y la calculadora de WhatsApp), la academia
   (Claude Code + comunidad) y "Recursos gratuitos" (no carga). Sin formulario de correo.
3. YouTube: la comunidad (Skool u `horizontesia.com`) aparece en 14 de las descripciones de los 15 últimos largos (re-contado en el RSS el 8-oct), pero **en la primera línea solo en 2** (restaurante y "4 millones de vistas");
   en el resto va después del resumen del video (el ep. 1 la nombra a los ~725 caracteres, Astra a ~1.150, WhatsApp a ~1.670), junto al recurso del video (skill, megaprompt en Google Doc, repo en GitHub).
4. Skool (USD 64/mes) y Forja (Starter gratis, Comunidad 57-64, reventa).

**El embudo pierde en el medio:** lo viral en TikTok no pasa al largo.

| Tema | TikTok | YouTube largo | Relación |
|---|---|---|---|
| WhatsApp cobra (calculadora) | 1.600.000 | 7.331 | TikTok 218 veces más |
| Restaurante | 694.700 | 14.826 | TikTok 47 veces más |
| Astra edita video | 31.800 | 271.170 | YouTube 8,5 veces más |
| Editar con Claude Code | 156.400 ("Vean todo...") | 69.000 ("I fired my editor", no es el mismo video) | TikTok 2,3 veces más |

Lo que funciona en YouTube es lo que la gente **busca** (editar con IA, tutorial), no lo que arrastra el algoritmo de TikTok.

## 2. Comunicación

### 2.1 A quién le habla

- Hispanohablantes de LatAm no técnicos que quieren "su primer agente funcionando". A su público lo llama **"santinos"** (visto en el video de
  1,6 M). Dos públicos mezclados: (a) los dueños de negocio que aparecen en los videos (restaurante, cafetería, clínica, inmobiliaria) y (b) el
  que quiere **venderles agentes a esos dueños** (el comprador real de Skool y de Forja).
- El video habla de (a) y le vende a (b). **Eso es lo que no se copia** (6.2): Sergio Urcullo le vende a (a).
- Referencia de edad y origen (ficha del 8-oct): mexicano de unos 20 años, estudia Finanzas. En el video de la inversión dice "Santi, pero es muy
  caro" y en el YouTube de Astra "no soy programador, estudio finanzas" (esto último por Gemini, sin verificar).

### 2.2 Tono y vocabulario

- Mexicano coloquial con trato de **tú / ustedes** ("checar", "ando + gerundio", "ocupar" por usar, "bro", "créanme", "no les voy a mentir",
  "yo soy 100 % honesto con ustedes"). Sergio Urcullo habla en voseo boliviano: **no se copia el vocabulario, se copia la estructura**.
- Frases de 7 a 15 palabras, ritmo de **2,5 a 3,4 palabras por segundo** (tabla en 3.4). Palabras ancla repetidas: "agente", "Claude Code",
  "vean", "no les miento", "lo mejor de todo", "esencialmente", "simple, ¿no?".
- Humor de pasada, no chistes: la pizza que le regalan, el "adiós" de una palabra, la botella que abre en el primer cuadro.
- Confesiones de límite: "no te digo que pagues el plan de 200 dólares hoy; primero aprende a usarlo" (inversión, G4); "tarda 15 segundos porque
  espera más mensajes del cliente" (bots para clientes). Eso da credibilidad y no cuesta nada.

### 2.3 Promesa central

"Con Claude Code construyo, en una hora o en 10 minutos, lo que un negocio contrataría a una persona para hacer, y te enseño a hacerlo."
Variantes medidas: "Le pedí un chatbot a mi IA y me lo entregó en 10 min" (título quemado de "bots para clientes"); "creando un sitio web en 1 hora"; "el agente
cuesta US$0,55 por ejecución"; "este anuncio costó US$2,50 y menos de un día". **La promesa siempre trae un número: tiempo o costo.**

### 2.4 Tipo de prueba (por orden de frecuencia en los 13 videos vistos enteros)

1. **Producto funcionando en pantalla**: sitio vivo, calculadora, dashboard, bot respondiendo en un celular (8 de 13).
2. **Número de costo o tiempo en una tarjeta o título**: US$0,55 x 30 = US$16,50; US$2,50; 10 minutos; 18.500 US$ en un rectángulo rojo (5 de 13; además 70 imágenes y 3.000 pesos solo dichos).
3. **Caso con personas reales delante de cámara**: baristas y dueña de la cafetería (Itzel); amigos en un café para la prueba de Google Ads (2 de 13).
4. **Recortes de prensa o documento oficial**: 6 titulares apilados (WhatsApp, 6-sep), nota técnica de la NASA con un círculo (2 de 13).
5. **Reveal de que el propio video lo hizo la IA** ("100 % IA, hecho por Claude") y de cuánto costó (1 de 13).

### 2.5 Objeciones que contesta (con minuto)

| Objeción | Video | Minuto | Respuesta |
|---|---|---|---|
| "Es muy caro, 200 dólares" | Inversión (G4) | 0:47 | Menos que lo que le pagarías a una persona por hacer lo mínimo; no empieces por el plan caro, primero aprende |
| "¿Nos cambiamos de WhatsApp? ¿Los agentes dejan de funcionar?" | WhatsApp (G1) | 0:18 | Por supuesto que no: mejor canal hispano en apertura y conversión |
| "No sé programar" | "100 % IA" (G3) | 1:05 | "Esto lo hizo Claude Code, costó 2,5 dólares y menos de un día" (el YouTube de Astra lo dice con palabras, por Gemini) |
| "¿Y si es riesgoso?" | Bots para clientes | 0:44 | "Todas las conexiones son 100 % oficiales, no hay ningún riesgo" |
| "¿Cuánto cuesta?" | "Día 1" (G7) | 0:50 | Tarjeta de costo por ejecución y por mes |

### 2.6 CTA por red

| Red | CTA | Evidencia |
|---|---|---|
| TikTok | **Una sola acción: "el enlace está en mi perfil"**, dicha en voz y con captura de su perfil en pantalla (a veces con flecha roja al enlace). Dicha en voz en 7 de los 11 videos medidos (WhatsApp, restaurante, "100 % IA", cafetería, loops, "Día 1" y, hacia YouTube, la inversión), en los últimos 6-10 s. En los otros 4: "bots" cierra con una dirección web (forjabots.com), 1962 con "Sígueme", y el meme y "Solo empieza" sin CTA. La palabra clave en comentarios casi no aparece | transcripciones locales; comentarios = 0,07 % de las vistas |
| Instagram | Palabra clave en comentarios que dispara respuesta automática por mensaje privado ("Pasta", "editor", "Skill", "Loop", "OPUS", "inbox") | `FICHAS-MONTAJE-REFERENTES.md` |
| YouTube | "Dejen su like"; "comenta APRENDER" a la comunidad (Gemini, por verificar) y la comunidad en la descripción (no siempre arriba). Los capítulos terminan con "El skill completo" | descripciones del RSS |
| Narrativa (6-oct) | "Sígueme": tarjeta de su perfil con cursor que hace clic en Seguir (sin oferta) | G6 |
| Carruseles | Última lámina: foto, "Comenta «palabra»", @usuario | `SANTIAGO-CARRUSELES-POR-CODIGO.md` |

### 2.7 Embudo hasta la plata

| Peldaño | Oferta | Precio | Fuente |
|---|---|---|---|
| 0 | Contenido corto en 3 redes, YouTube largo, herramienta gratis (calculadora de WhatsApp, PDF), skill gratis en GitHub y Google Docs con el prompt | gratis | videos, descripciones |
| 1 | Forja Starter (bot con un comando, en tu propia cuenta de Cloudflare) | USD 0 | forjabots.com (ficha del 8-oct) |
| 2 | Skool Horizontes IA: curso Claude Code, 15 cursos, plantillas, 2 clases en vivo por semana, Forja+ | **USD 64/mes** (verificado hoy en `horizontesia.com`: USD 64, "600+ miembros", 15 cursos, 2 clases en vivo por semana, Forja+; la ficha anterior decía 702 a 768 miembros y reseña 4,8 de 33, sin poder reconfirmarse) | horizontesia.com, hub `sanmunozia.com` |
| 3 | Forja Comunidad / Agency Mode: 14 bots por giro, panel con tu marca, reventa | USD 57-64/mes; sugiere cobrar USD 2.000 por proyecto | `sanmunozia.com` (membresía desde USD 64) |
| 4 | Garantía: si en 30 días tu primer bot no corre, trabaja contigo | n/a | forjabots.com |

- **Orden de magnitud (inferencia, no dato):** 600 miembros x USD 64 = USD 38,4 mil por mes brutos si todos pagaran el precio actual. No hay dato
  de cuántos pagan ni del precio original; Skool cobra comisión.
- **No captura correos en el hub ni en la calculadora** (sin formulario visible). Excepción vista el 8-oct: el carrusel de loops (18-jul) cierra con una **masterclass gratis en vivo con registro** ("enlace en mi perfil, regístrate gratis ahí, cupos limitados"): ese es su lead magnet con captura, y el destino del registro no se abrió.
- No hay llamadas ni asesorías individuales pagas en ninguno de los sitios.
- **Autoridad que usa:** 178 mil seguidores en IG en pantalla (cierres del 6-sep y del 6-oct), "4 millones de vistas en 60 días" (de un invitado),
  miles de dólares en ads. No muestra testimonios de clientes pagando.

## 3. Guiones

### 3.1 Fórmulas de gancho (76 ganchos de voz: 13 vistos enteros + 63 transcritos a 28 s)

Clasificación a mano; `n` es aproximado y las medianas son de TikTok (orientativas por n chico).

| Fórmula | Ejemplo corto | n | Mediana | Observación |
|---|---|---|---|---|
| **Orden de mirar + prueba** | "Vean esto." / "Mira, te cuento..." / "Vean todo..." | 4 | **128 mil** | Los 4 pasan de 68 mil; arranca con la prueba ya en pantalla |
| Resultado en primera persona | "Acabo de reemplazar a mi editor." / "Le di 3.000 pesos a una IA" | 6 | 31,5 mil | Mejor si trae número o riesgo ("Le devolví más de 3.000 dólares a un cliente", 14,6 mil) |
| Escena ya en curso (in medias res) | "Quiero que me crees un chatbot para una inmobiliaria en Miami." / "Hola, hablo con Santiago..." | 6 | 26,8 mil | Le habla al agente o a un cliente, no a la cámara |
| Tesis debatible con número | "Una suscripción de Claude es la mejor inversión hoy." / "El 80 % construye agentes mal" | 4 | 57,5 mil | 361 mil el mejor; abre un debate (por eso el caption pide opinión) |
| "X acaba de matar a Y" | "Claude acaba de matar a todos los diseñadores." | 2 | 104 mil | Con demo. Las demás noticias ("Anthropic acaba de sacar...") hacen 11 mil de mediana |
| Noticia sin titular fuerte | "Anthropic acaba de lanzar Sonnet 5.5" | ~16 | 11,2 mil | Peor cuanto más se parece a la nota de prensa |
| "Así es como..." | "Así es como uso a Claude y Notion como mi secretario." | 4 | 38 mil | Promesa de proceso |
| Pregunta de dinero con fecha | "¿Cuánto te costará responder en WhatsApp?" | 1 | 1,6 M | Pregunta + fecha + número; el único de su tipo |
| Autoridad ajena (clip de 3 s) | clip del creador de Claude Code diciendo "I have loops that are running" | 2 | 138 mil (loops) | Abre con otra voz y contesta "¿a qué se refería?" a los 7 s |
| Analogía o provocación | "Claude Code sin skills es como un iPhone sin aplicaciones." | 4 | ~7,5 mil | Floja |
| Narrativa / motivacional | "En 1962 un astronauta se negó a despegar..." | 3 | 1,1 mil | La peor del catálogo |

**Dos hallazgos del gancho:**
- **Habla en el cuadro 0, con dos excepciones.** Primera palabra a los 0,0 s en 9 de los 11 videos con medición de voz. Las excepciones: la cafetería
  (voz a los 4,2 s, 303 mil) y el "Día 1" (voz a los 6,3 s con la ruleta de negocios, 2,7 mil). **El arranque sin voz solo funcionó cuando el lugar real hace de
  gancho (POV).** El anuncio de "100 % IA" dice "Vean esto." en 0,7 s y calla 29 s más.
- **El texto quemado nombra el resultado en 3 a 7 palabras** y está en el cuadro 0: "creando sitio web con ia", "100 % IA hecho por...",
  "Mejor inversión?", "Le pedí un chatbot a mi IA y me lo entregó en 10 min", "Implementando IA a Cafetería".

### 3.2 Guiones desarmados

Parafraseado; los tiempos salen de Whisper y de la hoja de cuadros. G1 a G7 son los videos vistos enteros; G8 es parcial.

**G1. WhatsApp cobra (6-sep, 1:56, 1,6 M)**

| Tiempo | Qué dice | Qué se ve | Función |
|---|---|---|---|
| 0:00-0:02 | La noticia: WhatsApp empieza a cobrar por mensajes el 1-oct-2026 | Cara a pantalla completa; título "¿Cuánto te costará responder en WhatsApp?" en 3 líneas; abre una botella | Gancho: pregunta de dinero con fecha |
| 0:02-0:05 | (misma frase) | Corte duro a panel verde casi negro con 6 recortes de prensa rotados que caen + sello amarillo "1 OCTUBRE 2026 - BUSINESS API" | Prueba externa en menos de 3 s |
| 0:05-0:16 | Hoy es gratis responder dentro de 24 h; en un mes deja de serlo; 1.000 gratis | Tarjeta "Tu agente responde" con captura de la demo de Meta, luego "24 h", luego logo de WhatsApp y burbujas | Contexto en 3 tarjetas |
| 0:16-0:21 | ¿Y ahora? ¿Cambiamos de WhatsApp? ¿Los agentes dejan de funcionar? | Cara; "¿Y los agentes?" en serif | Objeción lanzada y contestada |
| 0:21-0:37 | Por supuesto que no: es el mejor canal hispano en apertura y conversión | b-roll de manos con celular, mujer con celular, tarjeta "Apertura -> Conversión" | Razón para quedarse |
| 0:37-0:45 | Entonces hay que prepararse; "les tengo algo": una app que calcula cuánto cuesta | Cara completa con "¿Qué podemos hacer?" y "Prepararnos." en serif grande | Bisagra a la herramienta |
| 0:45-1:47 | Demo de cuantocuestaresponder.com: país, cuántos números, dónde están tus clientes, 3 escenarios, PDF | Panel superior = grabación de la web (UI clara) y cara abajo; banderas MX/PE; tarjetas de tarifa; "$37.03" con un óvalo | Prueba: el producto funcionando |
| 1:47-1:56 | PDF gratis; enlace en el perfil | PDF inclinado; tarjeta "Responder por WhatsApp deja de ser gratis el 1 de octubre."; captura de su perfil | CTA único |

**G2. Restaurante (21-ago, 1:40, 694,7 mil)**

| Tiempo | Qué dice | Qué se ve | Función |
|---|---|---|---|
| 0:00-0:04 | "Acompáñenme a crear un sitio web con IA para un restaurante" | POV de celular en la fachada y el salón; título "creando sitio web con ia" + ícono de Claude; a 2,75 s una ilustración | Gancho: lo vas a ver hacerse |
| 0:04-0:14 | Llegué por recomendación de un negocio de un video pasado; fotos del menú y del local | Fotografía el menú con el celular | Contexto y serie |
| 0:14-0:34 | Para un sitio se piden referencias; se las doy a Claude con una instrucción | Tarjetas ilustradas, laptop sobre la mesa | Método en una frase |
| 0:34-0:50 | Primera versión; el sitio se aloja en Cloudflare | Sitio "Benvenuti a casa"; logo de Cloudflare a pantalla completa | Giro técnico simple |
| 0:50-1:01 | Me invitaron una pizza, muy buena | Pizza; laptop cerrada | Pausa humana (retención) |
| 1:01-1:20 | Retoques; imágenes con otra app: más de 70 platos | Pantalla de generación; ANTES / DESPUÉS de un plato (1:09) | Prueba visual |
| 1:20-1:34 | Sitio terminado con menú e ingredientes; panel de administrador para editar precios | Celular con el sitio; check animado | Resultado + entregable |
| 1:34-1:40 | Tutorial completo en el enlace del perfil. Adiós | Captura del perfil con flecha roja al enlace | CTA |

**G3. "100 % IA" (23-abr, 1:28, 419,5 mil): anuncio mudo y reveal**

| Tiempo | Qué dice | Qué se ve | Función |
|---|---|---|---|
| 0:00-0:01 | "Vean esto." | Cara con título "100 % IA / HECHO POR" + asterisco de Claude; baja la vista a la laptop sobre sus piernas | Orden + reveal pendiente |
| 0:01-0:30 | (sin voz) | La pantalla de la laptop hacia cámara: landing de un bot para clínicas con pacientes del extranjero; scroll; él la mira abajo | Producto terminado como prueba |
| 0:30-1:05 | (voz del anuncio) agente en dos idiomas, se mejora solo, pasa a humano cuando importa, sin código en 10 minutos | Laptop; logo del producto | El anuncio completo |
| 1:05-1:17 | Revela: todo (música, voz, imágenes, transiciones, cortes) lo hizo Claude Code | Plano medio sin laptop; texto "CLAUDE CODE" tipo píxel | Giro: el reveal |
| 1:17-1:23 | Costó US$2,50 y menos de un día | "$2.5 usd" quemado | El número |
| 1:23-1:28 | Tutorial en el enlace del perfil. Chao | Cara con lentes | CTA |

**G4. "Mejor inversión" (20-abr, 1:22, 361,4 mil)**

| Tiempo | Qué dice | Qué se ve | Función |
|---|---|---|---|
| 0:00-0:04 | Una suscripción de Claude es probablemente la mejor inversión hoy | Cara con vaso en mano; logo de Claude a la izquierda; "Mejor inversión?" | Gancho: tesis debatible |
| 0:04-0:37 | Lista de usos con muletilla: "el 80 % de mis videos, Claude; miniaturas, Claude; carruseles, Claude; mi agente de voz, Claude..." | Panel superior con capturas rápidas (YouTube, vistas de IG con un círculo rojo, carrusel, mascotas píxel); 1 palabra por vez | Prueba por acumulación (anáfora) |
| 0:37-0:47 | Todo con una suscripción; vean mi canal | Grilla de miniaturas y "Link en bio" | CTA suave al largo |
| 0:47-0:58 | "Es muy caro, 200 dólares": es menos que pagarle a alguien por lo mínimo | Cara; plano más cerrado desde 0:45 | Objeción y comparación |
| 0:58-1:11 | No te digo que pagues el de 200 hoy; primero aprende a usarlo | Cara cerrada | Condición honesta |
| 1:11-1:22 | La próxima vez que alguien diga que Claude es caro, enséñale este video | Cara | Cierre pensado para compartir |

**G5. Cafetería (4-jun, 2:01, 303,5 mil): pitch en frío**

| Tiempo | Qué dice | Qué se ve | Función |
|---|---|---|---|
| 0:00-0:04 | (sin voz) | POV en la calle y la entrada; título "Implementando IA a Cafetería" | Gancho visual: dónde estamos |
| 0:04-0:58 | Se presenta a los baristas: ando implementando IA en negocios; "dame 30 minutos y un café y te lo hago, sin compromisos" | Cámara fija en la barra; subtítulos amarillos de 2-3 palabras abajo | Tensión social: ¿aceptan? |
| 0:58-1:18 | Hoy vinimos a esta cafetería; Itzel; dos problemas: menú físico en un solo idioma y poco contenido | Flecha que dice "ITZEL"; el menú en la mano | Diagnóstico del negocio |
| 1:18-1:47 | Manos a la obra: menú digital en cualquier idioma, panel para cambiar precios y productos, generador de posts | Laptop en la mesa; menú "Chocolate caliente"; plataforma | Entrega de valor |
| 1:47-2:01 | Bonus: un video; tutorial y reacción de Itzel en el enlace o "busca esto" | Pantalla con recuadro de la reacción | CTA + bucle abierto (la reacción) |

**G6. Historia de 1962 (6-oct, 1:03, 1,1 mil): lo que NO funciona**

| Tiempo | Qué dice | Qué se ve | Función |
|---|---|---|---|
| 0:00-0:06 | En 1962 un astronauta se negó a despegar hasta que una mujer revisara la computadora | Cohete, "1962" gigante, casco, "SE NEGÓ" en serif | Gancho de curiosidad |
| 0:06-0:19 | Antes la "computadora" era ella; Henrietta Leavitt midió galaxias con placas | Archivo, placas, lupa, gráfico | Ejemplo 1 |
| 0:19-0:29 | Katherine Johnson calculaba órbitas; Glenn pidió que revisara la máquina | NASA, nota técnica con un círculo | Ejemplo 2 y cierre del bucle |
| 0:29-0:39 | Dorothy Vaughan aprendió Fortran y se lo enseñó a su equipo; no perdieron contra la máquina | Sala de computadoras | Giro: aprender |
| 0:39-0:51 | Hoy la máquina nueva es la IA; el Foro Económico Mundial: 170 M de empleos nuevos y 92 M desplazados (contadores que suben) | Logos de OpenAI/Anthropic/Claude; "2030" | Dato |
| 0:51-1:03 | La pregunta no es si la IA hará tu trabajo sino quién la aprendió primero. Sígueme | "SÍGUEME" + tarjeta de perfil con cursor | Tesis y CTA |

Se ve bien hecho y rinde casi nada: **no hay cara, no hay herramienta propia, no hay caso**. Es lo opuesto de todo lo que le funciona.

**G7. "Día 1" (4-oct, 1:03, 2,7 mil)**

| Tiempo | Qué dice | Qué se ve | Función |
|---|---|---|---|
| 0:00-0:06 | (sin voz) | Título "Día 1 creando un agente de IA para un negocio al azar"; TV detrás con una lista que gira (ruleta de negocios); mano en el mentón | Gancho: azar |
| 0:06-0:24 | La pérdida de alumnos es un problema caro en escuelas de idiomas; objetivo: un agente que revise cada mañana | Ilustraciones de línea (pizarrón); rótulo "2 de 7" | Diagnóstico con costo |
| 0:24-0:37 | Armado con Claude Code, Composio y Managed Agents | Tarjeta con logos, manos tecleando | El stack en una tarjeta |
| 0:37-0:53 | El agente revisa Sheets, detecta riesgo, manda el mensaje y actualiza. "Simple, ¿no?" | Mascota píxel naranja + íconos de Sheets y Gmail sobre pantalla real | Resultado funcionando |
| 0:53-1:00 | Cuesta US$0,55 por ejecución; una vez al día = un empleado nuevo por US$16,50 | Tarjetas de número: "US$0.55", "x 30", "US$16.50" | El número que vende |
| 1:00-1:03 | Video completo en mi perfil. Chao | Miniatura de YouTube "AGENTE DE $5,000 USD" con una flecha dibujada | CTA al largo |

**G8. Agente de voz (14-abr, 2:57, 209,3 mil), parcial.** El gancho es el **audio de una llamada real** del agente a un cliente, sin intro ("Hola,
hablo con Santiago. Le hablo a Sofía de Inmobiliaria Horizontes..."). Cara fija con el teléfono al oído (casi 3 minutos de plano sin cortes), subtítulo de
una palabra en mayúscula con contorno negro, **tarjeta de 2 líneas arriba** que explica lo que oímos (cambia cada ~12 s: "el agente es outbound",
"está conectado a distintas herramientas", "se conecta a mi Google Calendar", "siempre pide doble confirmación"), capturas del Notion/Sheets con
**rectángulos rojos y flechas amarillas**, correo de confirmación en Gmail y el cierre con la miniatura del video largo ("Sofía nunca duerme").

### 3.3 Recursos de retención (con minuto)

1. **Texto quemado con el resultado en el cuadro 0** y prueba en pantalla en menos de 3 s (G1 a los 2,25 s).
2. **Cambio de visual cada 3 a 5 s** en las piezas con panel (G1: 36-37 cortes duros en 116 s = 3,1 a 3,2 por cada 10 s; re-medido el 8-oct).
3. **Objeción lanzada y contestada en voz alta** (G1 0:18; G4 0:47).
4. **Pausa humana** a los 50 s (la pizza, G2) y el tono de "no les miento".
5. **Bucle abierto largo**: la reacción de Itzel (G5, se promete en el cierre) y el reveal de "lo hizo la IA" (G3, al minuto 1:05).
6. **Anáfora con muletilla**: "..., Claude." 12 veces en 33 s (G4).
7. **Número que se arma en pantalla** (contadores que suben en G6; "US$0,55 x 30 = US$16,50" en G7).
8. **Repetir la frase del gancho** a mitad de camino (G6 a los 0:23).
9. **Cambio de escenario físico**: camina con la laptop por distintas salas (loops: 4 locaciones en 90 s) o pasa de la calle al local (G2, G5).
10. **Dejar un "parte 2"** que depende de los comentarios (Short del Mundial: "comenten recomendaciones").

### 3.4 Largo de frase y ritmo

| Pieza | Palabras por segundo | Palabras por frase (segmento Whisper) | Pausa más larga | LUFS |
|---|---|---|---|---|
| G1 WhatsApp | 2,85 | 11,4 | 0,86 s | -12,5 |
| G2 Restaurante | 2,99 | 16,6 | 0,58 s | -13,2 |
| G3 "100 % IA" (con 29 s mudos) | 1,9 | 10,3 | 29,5 s (anuncio) | -12,4 |
| G4 Inversión | 3,27 | 11,6 | 0,64 s | -14,4 |
| G5 Cafetería (audio en el local) | 2,73 | 26,6 | 3,78 s | -17,8 |
| G6 1962 | 2,69 | 10,9 | 0,68 s | -12,5 |
| G7 Día 1 | 3,41 | 14,9 | 0,42 s (voz desde 6,3 s) | -13,7 |
| "Solo empieza" | 2,50 | 7,2 | 0,78 s | -14,8 |
| Loops | 3,41 | 8,1 | 0,84 s | -13,0 |
| Bots para clientes | 3,29 | 13,3 | 0,46 s | -15,4 |

Mediana de las piezas con voz propia (sin G3 ni G5): **3,0 palabras por segundo, pausas de 0,4 a 0,9 s, -13,2 LUFS** (rango -12,4 a -15,4). La "frase" de Whisper
agrupa por pausa, no por gramática. Mezcla frases largas con frases sueltas de 2 a 4 palabras ("Simple, ¿no?", "Vean esto.", "Pon atención.").

### 3.5 Cierres

- **Despedida de una palabra** ("Adiós", "Chao", "Bye") en 5 de los 9 videos con voz propia: G2 "Adiós", G3 "Chao", G5 "Chao", G7 "Chao", loops "Bye".
- **Lo último que se dice es el CTA** (enlace en el perfil) y lo último que se ve es la **captura de su perfil**, con flecha si hay.
- **G4 cierra con una frase para reenviar** ("la próxima vez que alguien te diga X, enséñale este video"): es la única con esa mecánica.
- **El cierre nunca resume.** No dice "en resumen". Va directo al enlace.

## 4. Edición

### 4.1 Cortes por cada 10 s y ritmo (medido con ffmpeg)

| Pieza | Cortes duros (>0,30) por 10 s | Cambios visuales (>0,15) por 10 s | Nota |
|---|---|---|---|
| G1 WhatsApp | 3,2 | 6,0 | Pico de 18 cambios en 90-100 s: animación de la calculadora |
| G2 Restaurante | 2,8 | 7,8 | POV con movimiento constante |
| G3 "100 % IA" | 0,1 | 0,5 | Un solo plano (casi sin cortes) |
| G4 Inversión | 3,5 | 5,3 | Cortes concentrados en los primeros 40 s (4, 6, 11, 5, 2, 0, 1, 0, 0 por tramo de 10 s) |
| G5 Cafetería | 5,7 | (inflado por pantallas de laptop) | En los primeros 60 s hay 1 solo corte; después el ritmo sube con las grabaciones de pantalla |
| Meme de 13 s | 2,9 | 2,9 | 4 cambios en 13,8 s |
| G6 1962 | **12,0** | 17,4 | Archivo y tipografía animada |
| G7 Día 1 | 2,4 | 3,0 | Lento: entre las piezas con voz solo G3 es más lenta |
| "Solo empieza" | 4,9 | 5,1 | |

Con cara y voz: **2,4 a 3,5 cortes duros por cada 10 s** (un corte cada 3 a 4 s). La receta de `edicion-referentes` dice 3 a 5 s: coincide.

### 4.2 Corto vertical, formato A: pantalla partida + cara (G1)

Medido en cuadros de 1080x1920 del 6-sep:

| Parámetro | Valor |
|---|---|
| Formato | 1080x1920, 9:16 |
| Costura | a **48,1 %** del alto; panel arriba, cámara abajo |
| Fondo del panel | **#0D120C** (negro verdoso) para tarjetas; blanco para capturas de web |
| Título de panel | serif de contraste alto, negrita (Playfair Display o parecida), blanco, arriba a la izquierda, 1 a 3 palabras |
| Etiqueta de panel | monoespaciada en mayúscula con espaciado ancho ("DEMO DE META - WHATSAPP") encima del título |
| Palabra grande central | mismo serif, ~100 px, **a 65-76 % del alto**, en 2 líneas ("¿Qué podemos hacer?", "Prepararnos.", "Te va a interesar.", "Anticípate al cambio.") |
| Subtítulo | sans humanista sin caja, blanco, de **1 a 3 palabras**, palabra activa en **amarillo #F7CD1B (medido)**; posición **83-85 % del alto (medido)**; cuerpo de ~62 px a 1080 de ancho (estimado por el ancho de las letras, ~3,2 % del alto) |
| Sello | etiqueta amarilla con fecha, rotada ~3-5 grados, sobre los recortes de prensa |
| Recortes de prensa | 6 tarjetas blancas rotadas ±3 a 8 grados que caen y se solapan (a 2,25-3,0 s) |
| Zoom | no se aprecia punch-in en la cara: la cara mantiene su tamaño entre layouts; solo trasladan la cámara |

**Layouts que alterna:** (A) partida con el panel arriba (la mayor parte del video, incluida la grabación de la calculadora de 45 a 107 s), (B) cara a pantalla completa
(0-2,2 s, 18 s y 36-44 s, con la palabra grande en serif), (C) tarjeta a pantalla completa sin cara (logo de WhatsApp y burbujas a 12-15 s), (D) b-roll de manos con el celular a pantalla
completa (24 s, 33 s, 48 s). Cambia de layout cada 5 a 13 s.

### 4.3 Corto vertical, formato B: POV de vlog (G2, G5)

- **Cámara en primera persona** con gran angular de celular, sin cara en G2 (en G5 hay personas reales delante: los baristas y la dueña).
- Pantalla completa; las ilustraciones entran como **tarjeta blanca de esquinas redondeadas** en el tercio superior (7 a 8 apariciones en G2 entre los 6 s y 1:33),
  con la mascota naranja de Claude, dibujo a lápiz y acuarela; en G2 el logo de Cloudflare ocupa la pantalla completa a los 42 s.
- **Sin subtítulos en G2** (solo el título 0-3 s); G5 usa subtítulos de 2-3 palabras en blanco con la palabra clave en amarillo, a ~85 % del alto.
- Cortes duros de 2,8 por 10 s; cambios visuales 7,8 por 10 s (movimiento de cámara).
- ANTES / DESPUÉS con foto real del plato y render, como "prueba visual" (1:09).

### 4.4 Corto vertical, formato C: cara completa con apoyo arriba (G4, loops, bots, voz)

- Cara a pantalla completa; el **apoyo vive en el tercio superior** (capturas, mascotas píxel, miniaturas) sin tapar la cara.
- **Subtítulo de 1 palabra por vez** en mayúscula blanca con contorno negro (G4, loops, G8) a 50-65 % del alto, o en minúscula blanca pequeña con
  palabra amarilla a 83-87 % (bots, G1). **Cambia de estilo con el tiempo:** abril a junio = mayúscula con contorno (G4, G8, Google Ads); agosto = mezcla (bots en
  minúscula el 1-ago, loops en mayúscula el 7-ago); desde septiembre solo minúscula fina (G1, "Día 1"). Tres estilos de subtítulo en 6 meses: no hay uno fijo.
- Zoom: en G4 el plano se cierra de golpe a ~1,6x desde 0:45 y se mantiene hasta el final (el tramo de la objeción del precio).
- Camina con la laptop (loops): la cámara se mueve y la laptop sirve de pantalla de apoyo con ilustraciones tipo pizarrón.

### 4.5 Corto vertical, formato D: anuncio mudo y reveal (G3)

- Plano medio fijo con la **laptop sobre las piernas inclinada hacia cámara**: la pantalla ES el apoyo. Casi sin cortes (0,1 por 10 s).
- 0 a 30 s sin voz: la landing hace el trabajo; un solo título ("100 % IA / HECHO POR [ícono]"). Pista de TikTok: "Ding".
- A 1:05 se vuelve a la cámara, sin laptop, y revela. Un solo texto quemado grande ("CLAUDE CODE" píxel; "$2.5 usd").

### 4.6 Sin cara: meme (13 s), narrativa de archivo (G6), IA generada ("Solo empieza"), "Día 1"

- **Meme:** 2 planos y 2 textos ("Yo antes de que Claude existiera" / "Yo después de Claude"); pista licenciada ("Meet me halfway x I follow rivers").
  Rinde 121 mil con 13 s: es el único formato corto que le funciona.
- **Narrativa:** fotos y metraje de archivo en sepia, **cambio de plano cada 0,8 s** (12 cortes duros por 10 s), cifras gigantes en sans negrita
  naranja y blanca sobre crema, serif para las frases, **palabra de acento amarilla pequeña** abajo a la izquierda (no centrada), **música de cama presente**
  (pausas a -24,7 dBFS, 12 dB bajo la voz) y cierre con tarjeta del perfil y cursor. Rinde 1,1 mil.
- **"Solo empieza" (1-oct):** imágenes de un hombre con laptop en blanco y negro que por su aspecto parecen generadas por IA (inferencia, no confirmada), íconos de
  herramientas que flotan, texto serif en 2 tamaños; **piso de ruido -46 dBFS (música muy baja o ninguna)**. Rinde 896.
- **"Día 1" (4-oct):** nuevo set (TV grande detrás, micrófono de condensador rojo, polo negro); ilustraciones de línea sobre fondo crema a pantalla
  completa (parece de su skill "Video Pizarra", inferencia), tarjetas de número grandes, mascota píxel; **sin música** (pausas a -67,6 dBFS); subtítulo
  pequeño blanco abajo.

### 4.7 Primeros 3 s cuadro por cuadro (medidos a 4 cuadros por segundo)

| Pieza | 0,0 s | 0,5-1,0 s | 2,0-3,0 s |
|---|---|---|---|
| G1 WhatsApp | Cara + título de 3 líneas; abre una botella | Habla; el título no cambia | 2,25 s: corte duro a panel con 6 recortes que caen; 2,75 s: sello "1 OCTUBRE 2026" |
| G2 Restaurante | Fachada POV, título "creando sitio web con ia" + ícono | Interior del local | 2,75 s: tarjeta ilustrada blanca |
| G3 "100 % IA" | Cara hablando con título; las manos en la laptop | Baja la vista | Laptop encendida con la landing |
| G4 Inversión | Cara con vaso, logo de Claude, "Mejor inversión?" | El logo gira a 2,0 s | 3,0 s: "MIRA" en 1 palabra |
| G5 Cafetería | Borrosa por movimiento del celular; título "Implementando IA a Cafetería" | Fachada con cartel | Interior del local |
| Loops | Título "Ingeniería de Loops (Haz que la IA trabaje sola)", cara y laptop | 1,25 s: corte a diagrama blanco | 1,75 s: otro plano; 2,75 s: clip de conferencia (otro orador) |
| Bots para clientes | Píldora negra "Le pedí un chatbot a mi IA y me lo entregó en 10 min" | Igual (fijo 3 s) | Igual |
| Día 1 | Título pequeño + TV con ruleta de negocios; mano en el mentón | Rueda la lista | Gira la cabeza |
| 1962 | Cohete + "1962" gigante | "1962" baja a 1,5 s | 1,75 s: casco con desenfoque; 2,5 s: "SE NEGÓ" serif |
| Solo empieza | Cara en blanco y negro, "Cada" | Íconos flotan | "MEJOR." en negrita |

### 4.8 Largo horizontal (YouTube)

Medido en los **3 cuadros automáticos de YouTube (25, 50 y 75 %)** de cuatro videos, la miniatura y lo que dice Gemini (confianza baja):

- **Dos layouts:** (1) cara a cámara a pantalla completa (plano medio, polo claro, set con cartel negro "RIGHT HERE WAITING FOR YOU", espejo,
  micrófono rojo a un lado); (2) **pantalla completa con la cara en un recuadro redondeado arriba a la derecha (~19 % del ancho)** durante el screencast.
- **Rótulos:** tarjeta con nombre ("SANTIAGO / HORIZONTES IA", amarillo sobre negro) en el primer tramo del ep. 1 (a los 4 s según Gemini; visible en el cuadro del 25 %);
  **sello "1 DE OCTUBRE"** en un recuadro amarillo con el logo de WhatsApp; cabecera de sección ("La ventana de 24 horas") con palabra clave amarilla;
  ilustración conceptual con la cara en un recuadro.
- **Subtítulos:** pequeños, blancos, con palabra amarilla, abajo del plano de cara (en las partes a cámara).
- **Capítulos en la descripción** (13 en 25 min en el de Astra; 9 en el de la calculadora) y planificación en **Excalidraw**.
- **Cortes:** 6-8 por minuto en el de Astra, 2-4 por minuto en el ep. 1 (Gemini, sin medir). Timelapse del proceso (18:33 en Astra).
- **Miniatura:** cara a la derecha con una emoción marcada, **2-4 palabras en tipografía gruesa** (blanco y amarillo, a veces naranja), logo o ícono de la herramienta,
  flecha amarilla hacia el objeto. Ejemplos: "YA NO EDITO NADA" + ASTRA 6; "AGENTE IA DE $5,000 USD" con pizarrón; "TU NUEVA FACTURA" con recibo de WhatsApp.
- **Estructura del largo:** resultado adelantado en los primeros 90 s ("reemplacé a mi editor"), plan, configuración, loop, ejecución en vivo con
  los errores, timelapse, cuánto tardó y cuánto gastó, videos terminados, skill completo. Los capítulos cierran con la oferta.

### 4.9 Audio

- **Voz de corto con cara: -12,4 a -15,4 LUFS** (G1 -12,5; G3 -12,4; G4 -14,4; G7 -13,7; loops -13,0; bots -15,4); la receta de `edicion-referentes`
  (-13) está dentro del rango.
- **Piso de ruido en las pausas** (cuadros de 50 ms; no concluyente cuando hay pocas pausas): G1 -38,7 dBFS; G2 -37,4; G4 -37,7; "Día 1" -67,6; "Solo empieza" -46,5; bots -120 (silencio
  digital); narrativa de 1962 -24,7 y anuncio de G3 -22,6 (esas dos **sí llevan cama**). Conclusión: **las piezas con voz propia van sin música audible**; las
  piezas sin cara y el anuncio mudo llevan música. Esto coincide con la medición del 1-oct y corrige a Gemini (que dijo "música lo-fi" en G2, G4 y "Día 1").
- SFX: no se midieron; no hay evidencia de `whoosh` en cada cambio en las piezas con voz (lo contrario de lo que dijo Gemini el 17-sep).

### 4.10 Color y cámara

- Plano medio corto; cabeza al 25-35 % del alto; luz cálida de interior de frente; fondo con el cartel negro y amarillo, o set nuevo (TV detrás, micrófono rojo).
- Micrófono de **corbata con cubierta de peluche visible** o de mano; en G1 se ve el micrófono a la altura del pecho. Ropa lisa (gris, negro, polo claro).
- Paleta de las piezas: **negro verdoso #0D120C con blanco y amarillo #F7CD1B** (G1), **crema con naranja de Claude** (ilustraciones, mascota píxel, G2 y G7), blanco y negro con
  acento naranja (G6, "Solo empieza"). Cambia de identidad de una pieza a otra: no hay una paleta única.

### 4.11 Carrusel

Cubierto en `SANTIAGO-CARRUSELES-POR-CODIGO.md` y en la ficha del 3-oct. Resumen: 9-10 láminas de 4:5 (1856x2304 en IG), fondo crema, títulos en sans redondeada azul marino con la palabra clave en naranja subrayada a mano,
ilustración dominante de acuarela y lápiz de color (mascota de Claude) generada por `nano-banana-pro` en Kie AI (~US$0,09 por imagen), rótulo "NN/10", un adelanto con flecha al pie
de cada lámina y última lámina con "Comenta «palabra»". Los carruseles no se miraron de nuevo hoy (IG no se pudo abrir).

### 4.11b Verificación del 8-oct (segunda pasada, contra la fuente)

Re-contado desde cero: catálogo de YouTube sin tope, metadatos de TikTok, RSS de YouTube, re-descarga de G1 (transcripción completa, cuadros a 0, 1, 2, 2,5 y 3 s, cortes con ffmpeg) y Gemini sobre el largo de Astra.

- **G1 confirmado:** voz desde 0,0 s; "enlace en mi perfil" a los 112-116 s; título de 3 líneas y botella en el cuadro 0; a 2,5 s corte a panel oscuro con los recortes de prensa; subtítulo de 1-3 palabras con palabra amarilla a ~83-87 % del alto; palabra grande en serif ("Preparándonos.") sobre cara completa. La calculadora y el PDF gratis se dicen en voz.
- **Largo de Astra (25:26), por Gemini lite, confianza baja:** texto quemado "REEMPLACÉ A MI EDITOR" a los 2-5 s; promesa y "MIRA EL RESULTADO" (0:32-1:01); tutorial a pantalla compartida desde 1:01 (Excalidraw 3:33, instalación 5:50, ejecución con un comando de bucle 12:40); resultado y costo en tokens a los ~20 min. **La comunidad no se nombra hasta el ~22 min** (dentro de una anécdota de capacitación a 50 ingenieros, con "Comenta APRENDER"); el cierre (24:44) muestra el skill y la tarjeta "ÚNETE A LA COMUNIDAD - En la descripción". Es decir, el pedido de comunidad llega tarde y una sola vez, no desde los primeros minutos.
- **Dato que Gemini contradice a sí mismo:** dice a la vez "tardó 1 h 55" y "87 % de tokens"; no se afirma ninguna de las dos cifras.

### 4.12 Discrepancias con la skill `edicion-referentes` (para corregir)

0. **Carruseles de TikTok**: esta ficha trataba los posts de "60 s" como video; son carruseles de fotos con música (1.4). Sirven de molde de carrusel para la cuenta de Sergio Urcullo en TikTok (portada con la tesis, 1 idea por lámina, última lámina "sígueme @usuario" o "enlace en mi perfil").
1. **Subtítulo en la costura (49-51 %)**: es lo que se midió el 1-oct en Sonnet y Animaciones. En el video de 1,6 M el subtítulo va a **83-85 %** del alto, debajo de la cámara, y la costura está a
   48 %. Hay **dos variantes** de partida: subtítulo en la costura (19 al 28-sep) y subtítulo bajo la cámara (6-sep).
2. **Panel superior con fondo negro verdoso #0D120C y serif de contraste** (G1) no aparece en la receta: es una variante "noticia con tarjetas" (distinta de los paneles de captura).
3. **El gancho con un movimiento físico** (abrir la botella en G1; vaso en G4; laptop sobre las piernas en G3) no está en la receta.
4. **"Sin música ni whoosh"** de la receta vale para las piezas con voz; las narrativas sin cara y los anuncios llevan cama.
5. **Palabra activa amarilla**: se midió **#F7CD1B** en G1; la receta usa #FDC72D / #F9CA36. Diferencia de matiz, sin consecuencia.

## 5. Qué copia Sergio Urcullo YA

Cada punto con dónde se aplica. Fechas de los guiones del calendario del 9 al 16-oct (`CALENDARIO-PUBLICACION-9-16-OCT.md`).

1. **Un título de 3-7 palabras con la promesa en el cuadro 0 y la prueba en pantalla antes de los 3 s.** Hacerlo con **todos** los verticales de la semana
   (N03 el vie 9, N07 Haiku 5.5 y D03-A el sáb 10, N06 y N04 el dom 11). Evidencia: los 4 ganchos que empiezan con "Vean esto / Mira" hacen 68 a 419 mil.
   *Dónde:* guion (primera línea) y edición (texto quemado a 0,0 s + tarjeta de prueba a 2-3 s). Antes de usar "mató a X", verificar el dato el mismo día (6.4).
2. **Una herramienta gratis atada a una fecha, con una calculadora.** Santiago hizo 1,6 M con la calculadora de WhatsApp. Propuesta para Sergio Urcullo: una calculadora
   de **cuánto cuesta tener el bot con el modelo nuevo**, atada a Haiku 5.5 (0,10 / 0,50 por millón, salió el 7-oct) para N07, y otra de **cuánto cuesta un tratamiento a medias que
   no volvió** para la clínica dental (el dolor #1 de `ONIA_CLIENTE_IDEAL.md`). Con cifra verificada el mismo día y sin decir "obligatorio por ley".
   *Dónde:* guion N07 (sáb 10), carrusel y comunidad (pedir qué otra herramienta quieren). **No es pauta de Onia Platform: es marca personal.**
3. **Serie "visito un negocio y le dejo IA funcionando", en POV, con enlace al tutorial completo.** Es el formato con más vistas después de la noticia con herramienta (694,7 mil y 303,5 mil;
   YouTube 112 mil). Para Santa Cruz: una clínica dental o una cafetería amiga, con **autorización por escrito del dueño** (nada de pacientes reales en pantalla), de 90 a 120 s.
   *Dónde:* nuevo guion para la semana del 17-oct y un largo de YouTube; la asesoría gratis es la oferta (en lugar de Skool).
4. **Revelar al final cuánto costó y cuánto tardó el propio video.** G3: "todo lo hizo Claude Code, US$2,50, menos de un día". Para Sergio Urcullo: si el pipeline de edición tiene el costo y el tiempo
   reales de N03, decirlos al cierre; si no, medirlos antes de afirmarlos (no inventar la cifra). *Dónde:* último tramo de N03 (vie 9) y de todo video editado con `edicion-referentes`.
5. **Tarjeta de número que se arma en pantalla** (US$0,55 x 30 = US$16,50 en G7; contadores que suben en G6). *Dónde:* edición; cualquier dato de costo del plan semanal
   (D01-C "Opus o Sonnet", mar 13: mostrar el costo por millón de tokens como tarjeta).
6. **Una sola acción: "el enlace está en mi perfil", con captura del perfil y flecha**, mientras el comentario->mensaje privado no se pruebe (hoy 2 rechazos de Meta y 0 leads;
   en TikTok los comentarios son 0,07 % de las vistas). *Dónde:* últimos 5 s de los videos que Buffer publica en TikTok y Shorts; en IG, una sola acción también.
7. **Anáfora con muletilla para la prueba por acumulación.** G4: lista de 12 usos con la misma palabra al final. Para "mi stack": "Mi agenda: [herramienta]. Mis cobros: [herramienta]..."
   *Dónde:* guion de las piezas "Mi stack" (carril de marca personal).
8. **Pedir ideas al público para el siguiente video, y cumplirlo.** "¿Qué negocio les gustaría que fuera el siguiente?" hizo 303,5 mil; el Short del Mundial se arma con los comentarios y deja "parte 2".
   *Dónde:* comunidad (aviso diario antes de las 12:30): "qué negocio de Bolivia querés que visite" y el yap a +1 h.
9. **Largos de 25 a 45 min con resultado adelantado, capítulos y miniatura de 2-4 palabras con la cara a la derecha.** Su mejor tramo de YouTube es 30-45 min (mediana 29 mil) y el
   pico (271 mil) es una edición con IA. *Dónde:* D01-C (YouTube del mar 13): capítulos, resultado en los primeros 90 s, miniatura con 2-4 palabras + cara + flecha.
10. **Poner a prueba un vertical de 100-120 s por semana.** Los de 91 s o más tienen mediana 18-30 mil contra 8,7 mil los de 31-60 s. Sergio Urcullo graba 1 h por día: un video largo por semana
    cuesta lo mismo de grabación que dos cortos. *Dónde:* plan de la semana del 17-oct.
11. **Carrusel de TikTok con música para las noticias de la semana** (verificado el 8-oct: 4 de sus posts "de 60 s" son carruseles de 7 a 12 láminas con música y caption largo en forma de nota; el de SpaceX hizo 26,7 mil, el mejor del formato). Para Sergio Urcullo: reusar los carruseles que ya salen en IG (K3, K11, N06...) como post de fotos en TikTok con una pista, sin producir nada nuevo. *Dónde:* Buffer, mismo día que el carrusel de IG. *Evidencia:* ids 7636920756621806869, 7663962023172115733, 7643987111107972372, 7623494939179109653 (n=4, mediana 8,7 mil: se prueba, no se promete).

## 6. Qué NO se copia y por qué

1. **Su vocabulario mexicano** ("checar", "ando + gerundio", "ocupar", "bro", "santinos"): Sergio Urcullo habla en voseo boliviano; se copia la estructura, no la voz.
2. **Venderle agentes a quien quiere revender agentes** (USD 2.000 por proyecto, Forja Agency Mode, "sistema de agencia IA"): es una línea de negocio nueva que las reglas de Onia
   congelan, y el cliente (hispanos con tarjeta que sueñan con una agencia) no es el de una clínica dental de Santa Cruz.
3. **El precio en dólares y la membresía de USD 64/mes.** Hoy Sergio Urcullo da asesorías de IA gratis; una comunidad paga se evalúa después con datos propios.
4. **"X acaba de matar a Y" sin verificar.** Su gancho de 100 mil o más es hype; Onia verifica el dato el mismo día en la fuente oficial y no afirma lo que no hizo.
5. **Narrativa sin cara y con IA generada** (1962, "Solo empieza"): 1,1 mil y 896 vistas. Es exactamente donde su cuenta cayó; no se usa de molde.
6. **Su hub de enlaces sin captura de contactos.** Sergio Urcullo necesita el WhatsApp o el correo de quien llega (asesoría gratis = lista de espera), no solo el enlace.
7. **La palabra clave en comentarios** hasta que el comentario->mensaje privado funcione. En TikTok ni siquiera la usa en su pico.
8. **Su naranja de Claude y la mascota píxel como identidad.** Onia usa blanco, verde y negro; sus interfaces simuladas y el autobombo de "178 mil seguidores" tampoco.
9. **Su frecuencia** (3,2 reels por semana en IG + 2,7 en TikTok + 1,75 largos por semana en YouTube). Con 1 h de grabación por día, el cuello de botella es la grabación, no la edición.
10. **Dar el "cómo" completo gratis** (megaprompt en Google Doc, skill en GitHub). Sirve a quien vende a técnicos; Sergio Urcullo vende diagnóstico a dueños de negocio.
11. **El micrófono de corbata con cubierta peluda en la mano o a la altura del pecho** (G1, G4): la regla de la skill es solapa en la remera.
12. **Mostrar personas reales (baristas, dueños) sin documento**, aunque lo haga él. En Onia hace falta consentimiento por escrito y cero datos de pacientes.
13. **Afirmaciones de invitados no verificadas** ("4 millones de vistas en 60 días") y cifras de Skool que se contradicen entre fuentes (702 / 768 miembros antes, "600+" hoy en su web; USD 57 / 64: la web dice 64).

## Fuentes (URL + fecha de lectura)

- Catálogo y metadatos de TikTok (80 videos): https://www.tiktok.com/@sanmunoz.ia (8-oct-2026). Videos vistos enteros: ver URLs en la tabla 0.2.
- Catálogo de YouTube: https://www.youtube.com/@SantiMunozIA/videos y /shorts (listado, 8-oct-2026); feed RSS: https://www.youtube.com/feeds/videos.xml?channel_id=UCKH3AEVu7sIU61cjnB0XxdQ (8-oct-2026).
- Videos de YouTube con Gemini y descripción: https://www.youtube.com/watch?v=4jWLq8Gn_4Y, https://www.youtube.com/watch?v=HIfvbFZ7Bww, https://www.youtube.com/watch?v=5REPWhjX64A,
  https://www.youtube.com/watch?v=43MipDGZ18M, https://www.youtube.com/shorts/8cVNW2b4gqE (8-oct-2026).
- Hub de enlaces: https://sanmunozia.com (8-oct-2026). Comunidad y producto: https://www.horizontesia.com y https://forjabots.com (según `REFERENTES-ECOSISTEMA.md` y `PLAN-REFERENTES.md`, 8-oct-2026).
- Internos: `hermes-content/references/marca-personal/{PLAN-REFERENTES,REFERENTES-ECOSISTEMA,FORMULAS-REFERENTES,FICHAS-MONTAJE-REFERENTES,SANTIAGO-CARRUSELES-POR-CODIGO,SANTIAGO-VIDEOS-ANIMADOS-POR-CODIGO}.md`;
  `hermes-content/references/video-intake/2026-09-17-reel-santiago-astra-davinci-estilo-edicion.md` y `2026-10-01-santiago-erik-edicion-medida.md`; `.claude/skills/edicion-referentes/SKILL.md`;
  `hermes-content/docs/cola/plan-3-semanas/CALENDARIO-PUBLICACION-9-16-OCT.md`.
- Material de trabajo (no versionado): MP4, hojas de cuadros, transcripciones y métricas en el scratchpad de la sesión, carpeta `analisis-contenido/sanmunoz/`.
