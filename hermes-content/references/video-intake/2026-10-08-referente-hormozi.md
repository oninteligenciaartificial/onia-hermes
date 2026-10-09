# Alex Hormozi: análisis completo de contenido (2026-10-08)

Para la marca personal de Sergio Urcullo. Complementa, no repite, lo que ya dicen `PLAN-REFERENTES.md` (3 videos
vistos con flash-lite el 8-oct), `REFERENTES-ECOSISTEMA.md` (ficha de presencia pública) y la skill `edicion-referentes`
(moldes Santiago y Erik). Hormozi no tiene molde de edición en esa skill: esta ficha es el insumo para decidir si lo tiene.

**Leyenda de evidencia.** **[M]** medido: dato de yt-dlp, del feed RSS del canal o de una página leída hoy.
**[F]** medido sobre el archivo bajado (ffmpeg: cortes, tiempo del rótulo; fotogramas mirados) o sobre sus subtítulos automáticos.
**[G]** lo dijo Gemini mirando el video; sin medir a mano. **[NV]** no verificado o dato de un tercero.

**Segunda pasada (8-oct, verificación).** Se rechequearon contra la fuente las cifras de catálogo, el RSS, las páginas de
Acquisition.com y la edición de 10 shorts y 1 largo (archivos bajados con `yt-dlp --extractor-args "youtube:player_client=android"`,
que **sí** baja 360p y subtítulos sin cookies). Lo que cambió respecto de la primera versión está marcado **[corregido]**.

---

## 0. Cobertura

### 0.1 Catálogo mirado

| Red | Qué listé | Con vistas | Con fecha | Cómo |
|---|---|---|---|---|
| YouTube largos (@AlexHormozi) | 60 más recientes | 60 (58 por yt-dlp; `eq1bnI0JoXU` 482 mil y el récord Guinness 192 mil por la página del canal. Las medianas usan los 58) | Relativa ("hace 10 meses"), las 60 | yt-dlp `--flat-playlist` + página del canal (InnerTube) **[M]** |
| YouTube Shorts | 60 más recientes | 60 | Exacta solo en los 15 más nuevos (5 al 8-oct) | yt-dlp + feed RSS oficial del canal **[M]** |
| TikTok | 0 | 0 | 0 | yt-dlp falla al parsear `@ahormozi`; `@hormozi` "no tiene videos". Sin lista |
| Instagram | 0 | 0 | 0 | No lo toqué. Los docs no traen ningún reel propio suyo (el único reel de IG que lo cita es de un tercero, `DbyVzPWRpWl`, ya en `2026-10-08-orquestacion-e-ingresos-5-posts.md`). No corrí `ig-radar.mjs`: usa la sesión personal de IG de Sergio Urcullo y IG la marca si se le pide mucho |
| Sitio acquisition.com | home, `/workshop`, `/roadmap`, `vantage.`, `shop.` | n/a | n/a | WebFetch, leído hoy **[M]** |

**Total: 120 piezas de YouTube con vistas.** Dato de escala de un tercero **[NV]**: ~5.300 videos publicados, 4,3 M de
suscriptores, 1.100 M de vistas y **91 % de las vistas vienen de Shorts** (OutlierKit, julio 2026).

### 0.2 Videos analizados a fondo (12)

Elegidos así: los 4 largos con más vistas, los 3 más nuevos, y al menos uno de cada formato que usa.
Vistas a hoy (8-oct), redondeadas por YouTube. Modelo: `gemini-3.5-flash` salvo donde dice otro.

| # | Video | Formato | Duración | Vistas | Fecha | Método | Confiabilidad de la edición |
|---|---|---|---|---|---|---|---|
| 1 | [If I Started A Business in 2026, I'd Do This](https://www.youtube.com/watch?v=uWdIgftpvBI) | Largo explicativo con gráficos | 18:25 | 1,9 M | ~dic-2025 | Gemini, res. baja | Media: duración coincide con yt-dlp |
| 2 | [If you're ambitious but inconsistent, please watch this](https://www.youtube.com/watch?v=UDBkiBnMrHs) | Largo monólogo sobrio | 26:14 | 1,9 M | ~ene-2026 | Gemini, res. baja | Baja: su tabla termina en 20:13 |
| 3 | [If I Wanted to Make My First $100K in 2026](https://www.youtube.com/watch?v=jfW6gL6hKhk) | Largo explicativo con gráficos | 15:45 | 1,6 M | ~mar-2026 | Gemini, res. baja | Media: duración coincide |
| 4 | [Can I Save This Failing Theme Park in 90 Days?](https://www.youtube.com/watch?v=xRxVpjeHmeA) | Largo consultoría en vivo (serie Scale or Fail) | 28:53 | 1,5 M | ~17-sep-2026 | Gemini, res. baja | Media: dice 25:52, el video dura 28:53 |
| 5 | [The New Way of Making Content In The Age of AI](https://www.youtube.com/watch?v=XsWSvz-aewA) | Largo con papel y gráficos | 13:53 | 307 mil | ~jun-2026 | `gemini-3-flash-preview`, res. baja | Muy baja: tabla hasta ~9:20; "52 cortes en un minuto" no es creíble |
| 6 | [If I Started A Personal Brand In 2026 (Dolly Parton)](https://www.youtube.com/watch?v=SCi464zfAUM) | Largo con diapositivas | 13:51 | 165 mil | ~sep-2026 | `gemini-3-flash-preview`, res. baja | Baja: dice 3:51 de duración |
| 7 | [This Could 2X Your Business (Overnight)](https://www.youtube.com/shorts/57_uoyn15_w) | Short, pregunta en conferencia | 1:46 | 365 mil | no consta (entre los últimos 60) | Gemini + archivo y subtítulos propios | **Alta [F]**: duración 1:46 y cortes medidos |
| 8 | ["Which One Of Us Is Right?"](https://www.youtube.com/shorts/Ww2jHydeZSE) | Short, pregunta en conferencia | 1:29 | 330 mil | no consta | Gemini + archivo y subtítulos propios | **Alta [F]** |
| 9 | ["Why Do I Feel Stuck?"](https://www.youtube.com/shorts/xZU5gLIdieY) | Short, clip de podcast con invitado | 1:10 | 264 mil | no consta | Gemini + archivo y subtítulos propios | **Alta [F]** |
| 10 | ["Why Does Business Feel So Hopeless?"](https://www.youtube.com/shorts/uvP4IWau3N4) | Short, selfie solo, un plano | 0:20 | 4,2 mil (sale hoy) | 8-oct-2026 **[M]** | Gemini | Media |
| 11 | [Your Excuse Is the Reason You Should Do It](https://www.youtube.com/shorts/KqoGxw1eC0k) | Short, clip de podcast, 2 cortes | 0:23 | 9,3 mil | 8-oct-2026 **[M]** | Gemini | Media |
| 12 | [Losing Only Teaches One Lesson](https://www.youtube.com/shorts/EQHJqh6KAIo) | Short, solo caminando | 0:38 | 13 mil | 8-oct-2026 **[M]** | Gemini | Media |

Ya analizados el 8-oct en `PLAN-REFERENTES.md` y que **no repetí**: [My Team Can't Close Like Me](https://www.youtube.com/shorts/P1Y82k_ZjXI)
(112 mil), [Business Or Kids?](https://www.youtube.com/shorts/w52lT-WN_DY) (74 mil) y
[How to become rich with social media](https://www.youtube.com/watch?v=21flGkcZO3A) (475 mil, ~25-sep). Los uso como contraste.

### 0.3 Lo que NO se pudo ver (leer antes de confiar en la edición)

- **[corregido] Sí se pueden bajar archivos sin cookies.** La primera pasada probó 7 clientes de yt-dlp (web, tv, ios,
  web_safari, android_vr, tv_embedded, mweb) y todos pidieron login anti-bot. El cliente **`android`**
  (`yt-dlp --extractor-args "youtube:player_client=android" -f "best[height<=720]/best" <url>`) baja el video a 360p y
  los subtítulos automáticos (`--write-auto-subs --sub-langs en-orig`) sin sesión. Con eso se midieron en la segunda pasada
  10 shorts y 1 largo (`jfW6gL6hKhk`) y se leyeron los subtítulos de 5 largos y 4 shorts. Los otros 6 largos y 12 shorts siguen sin archivo.
- Lo que no figura como **[F]** es **lectura de Gemini [G]**. Se comprobó que Gemini **subestimó los cortes 2 veces** en dos shorts
  (ver 4.1) y que el rótulo rojo **no** dura todo el clip como decía la primera versión. Donde un dato [G] choca con [F], manda [F].
- En 3 de los 6 largos la tabla de Gemini no cubre toda la duración (columna "Confiabilidad"). La estructura por
  tramos de esos videos es parcial; los subtítulos propios dan el esqueleto completo de los tres (ver 3.2 K y L).
- `gemini-3.5-flash` se quedó sin cuota con los dos últimos largos; esos dos salieron con `gemini-3-flash-preview`,
  que dio menos detalle.
- **Las vistas no están normalizadas por antigüedad.** Los largos abarcan 11 meses: los viejos tuvieron más tiempo.
  Los shorts abarcan unas 2 semanas, así que ahí la comparación es más justa.
- Gemini no identifica con certeza quién habla en el short `uvP4IWau3N4` (selfie junto a una piscina). No afirmo que
  sea Hormozi.
- TikTok e Instagram: sin dato propio (ver 0.1). Lo que sigue vale para YouTube.

---

## 1. Estructura de contenido

### 1.1 Qué hay en el canal: pilares y peso (60 largos, clasificados por título; 59 entran, 1 es un video de reacción)

| Pilar | Videos | % | Vistas, mediana | Vistas, máximo | Ejemplos |
|---|---|---|---|---|---|
| Mentalidad, vida y riqueza general | 22 | 37 % | 525 mil | 1,9 M | ambicioso pero inconsistente; 26 lecciones duras; cómo cambiar tu vida |
| Negocio: empezar, precios, escalar servicios | 14 | 23 % | 336 mil | 1,9 M | si empezara un negocio en 2026; $10M de negocio de servicios; matemática del negocio |
| Marketing, contenido, ventas e IA | 13 | 22 % | 332 mil | 845 mil | marca personal en 2026; ventas como el 1 %; cómo ganar con IA |
| Consultoría en vivo, retos y series | 10 | 17 % | 173 mil | 1,5 M | Scale or Fail; "construyendo un negocio de $X para un extraño"; el parque de diversiones |

- Mediana de los 60 largos: **364.500 vistas**. Promedio 504 mil. Máximo 1,9 M (dos videos, 5,2 veces la mediana). Seis pasan el millón.
- Los 4 videos de IA del catálogo: mediana de **319 mil**, bajo la mediana general. Solo "How to Win With AI in
  2026" llega a 845 mil. La IA como tema suelto no rinde extra en su audiencia; sí rinde cuando promete negocio **[M, n=4]**.
- Pilar "consultoría en vivo": la mediana es la más baja (173 mil) pero el techo es el parque (1,5 M) y el video más
  nuevo, `8 Entrepreneurs Compete For $100,000` (52 min), lleva 482 mil en 6 días. Es la categoría de más varianza.

### 1.2 Series recurrentes

| Serie | Qué es | Cuántos en los últimos 60 | Vistas |
|---|---|---|---|
| "If I [started / wanted] ... in 2026, I'd do this" | Receta en primera persona, 15-20 min | 7 | mediana 458 mil; dos están entre los 4 más vistos del canal (1,9 M y 1,6 M) **[corregido: decía "dos son el top 1,9 M"; el otro 1,9 M, `UDBkiBnMrHs`, no es de esta serie]** |
| "Watch this / please watch" | Título con la orden de mirar el video | 8 | **mediana 666 mil** **[corregido: decía 717 mil; recalculado el 8-oct con los 8 títulos: 217, 334, 386, 524, 807, 885, 1.000 y 1.900 mil]** |
| "Building a $X Business for a Stranger in N Minutes" | Consultoría a un desconocido | 4 | mediana 212 mil |
| "Scale or Fail" | Episodios de consultoría con dueños | 4 (con el episodio 1 de hace ~3 meses) | mediana 246 mil |
| Retos y proezas | Parque en 90 días, 8 emprendedores por $100.000, récord Guinness | 3 | 1,5 M / 482 mil / 192 mil |
| Preguntas de conferencia | Los shorts de pregunta y respuesta (sección 1.4) | ~10 de 60 shorts | mediana 110 mil |

Los títulos de largos con **"watch this / please watch"** tienen una mediana 1,8 veces mayor que la general (666 mil contra
364 mil; con n=8 y un rango de 217 mil a 1,9 M). Los de **serie de consultoría** quedan debajo (173-246 mil). No es causa probada: es lo que muestran 60 títulos **[M]**.

### 1.3 Formatos, frecuencia y duración

| Dato | Valor | Fuente |
|---|---|---|
| Shorts por día | **5 a 6** (5 el 6-oct, 6 el 7-oct, 4 el 8-oct hasta las 21:00 UTC; releído el 8-oct) | RSS del canal **[M]** |
| Largos por semana | **~1,3** (60 en ~11 meses = 5,5 al mes) | página del canal **[M]** |
| Mezcla por cantidad de piezas | **~96 % shorts, ~4 % largos** (estimación mía con lo anterior) | derivada |
| Mezcla por vistas | 91 % vienen de Shorts | OutlierKit, julio 2026 **[NV]** |
| Duración de los largos | mediana **25,8 min**. <10 min: 12 %; 10-20: 25 %; 20-30: 28 %; 30-45: 22 %; >45: 13 % | yt-dlp **[M]** |
| Mejor franja de largos | 20-30 min: mediana 587 mil. 10-20: 295 mil. <10: 332 mil. 30-45: 334 mil | yt-dlp **[M]** |
| Duración de los shorts | 20 s a 1:46 en los 10 que bajé; los de diálogo duran **0:46 a 1:46** | ffprobe **[F]** |
| Verticales en TikTok e IG | sin dato | n/a |

### 1.4 Qué rinde más y qué menos (shorts, 60 piezas, 5 a 8-oct y antes)

| Grupo | Piezas | Vistas, mediana | Máximo |
|---|---|---|---|
| Todos los shorts | 60 | **17 mil** (promedio 41,6 mil) | 365 mil |
| **Diálogo**: pregunta de un dueño o invitado + respuesta de Hormozi (los 8 más vistos) | 8 | **155,5 mil** | 365 mil |
| Resto: frases, consejos y selfies solos | 52 | **16,5 mil** | 41 mil |
| Solos que **llevan el mismo rótulo de pregunta** entre comillas (`uvP4IWau3N4`, `Jphf8aggSpE`) | 2 | 5,7 mil y 25,9 mil | 25,9 mil |

**[corregido] La primera versión decía "título en forma de pregunta o entre comillas: 10 shorts, mediana 110 mil, 6,7 veces el resto".**
Ese grupo mezclaba 7 diálogos con 3 solos que llevan el mismo tipo de título y rinden como el resto. Recontado el 8-oct:
la ventaja la trae el **diálogo con otra persona**, no el rótulo de pregunta.

- **Los 8 shorts con más vistas** (8-oct, yt-dlp): `This Could 2X` 365 mil, `Which One` 330 mil, `Why Do I Feel Stuck` 264 mil,
  `10X More Referrals` 192 mil, `What Would It Take To Win` 119 mil, `My Team Can't Close` 114 mil,
  `Should I Kill My Second Business` 108 mil, `Business Or Kids` 75 mil. **Los 8 los vi** (los 3 que faltaban, con 12 cuadros y Gemini flash-lite):
  - 5 son una **pregunta de un dueño del público** en un evento (`This Could 2X`, `Which One`, `Should I Kill`, y `My Team Can't Close` y `Business Or Kids` según PLAN-REFERENTES) **[F]**.
  - 1 es una **pregunta del anfitrión en un podcast** (`Why Do I Feel Stuck`) **[F]**.
  - 2 **no son pregunta de otra persona**: `10X More Referrals` es una charla de mesa de dos (invitado de remera negra, Hormozi de musculosa blanca) y
    `What Would It Take To Win` es Hormozi a cámara contando una lección; la "pregunta" del rótulo es su propia frase **[F]**.
  - `This Could 2X` ni siquiera lleva pregunta en el título (es una promesa).
  Lo común no es la pregunta: es **una conversación con otra persona, con cifras reales y una respuesta corta**.
- Desde el puesto 9 (41 mil, un consejo de precio) los títulos son frases o consejos solos.
- Un solo caso de monólogo supera las 40 mil: `The Price You Charge...` (41 mil), hablado a cámara con pegatinas animadas y la analogía del panadero (ver 4.2 y 4.8).
- Los aforismos y selfies solos que sí vi quedan en **4 a 26 mil** (más nuevos) y el resto de frases sueltas en **10 a 41 mil**. 34 de 60 shorts están bajo las 20 mil.
- Los más nuevos (4-13 mil) todavía acumulan: no los juzgo.
- Un short pasa de mediana a top cuando tiene **conflicto + dueño real + respuesta corta**. Un consejo a cámara no basta.

### 1.5 Cómo se conectan el largo y el corto

- **Los shorts que vi salen de eventos y entrevistas, no del largo de YouTube**: de los 8 de diálogo, 5 son preguntas en el escenario de un
  evento, 1 clip de podcast (Ed Mylett; un micrófono dice "The Iced Coffee Hour") y 2 charlas de mesa o a cámara con otra persona. Los solos son selfie,
  caminando o a cámara en estudio **[F]**.
- Algunos shorts son avance del largo con el **mismo título** (`8 Entrepreneurs Compete For $100,000`: largo 482 mil, short 26 mil).
- Los largos mandan a recursos (roadmap, libros, Vantage) y los shorts **no piden nada** (ver 2.5). Hormozi usa el
  corto para alcance y el largo para llevar a la oferta.
- Una sola grabación sirve para muchas piezas: un evento de 2 días da decenas de preguntas y cada una es un short.
- El volumen (5-6 al día) lo sostiene un equipo; un blog de tercero habla de ~300 piezas por semana **[NV]**.

---

## 2. Comunicación

### 2.1 A quién le habla

| Pieza | A quién |
|---|---|
| Largos de mentalidad | persona de 18-40 estancada, sin pasión, sin dinero. Arrancan hablándole a UNA persona ("este video es para el joven que me paró en la calle") |
| Largos de negocio y marketing | dueño de servicios o agencia que vende barato y no escala; creador que quiere vender |
| Consultoría en vivo | dueño con caja en rojo, deuda o techo de ventas |
| Shorts de pregunta | **dueño de USD 1 a 100 M de facturación** (el que paga el taller). Se ve en las cifras: "$7 M al año", "$8-9 M, margen 22 %" |

### 2.2 Tono y vocabulario

- Frases de **5 a 8 palabras**, sujeto-verbo-objeto. Ritmo **2,2 a 3,25 palabras por segundo** (estimado por Gemini; más lento y
  con silencios de 1-2 s en el monólogo sobrio, más rápido en los explicativos).
- Cuenta de memoria en voz alta ("22 % de 8 millones, 1,6 de ganancia"). El número se dice y se escribe a la vez.
- Cambia entre grito y susurro; se ríe de sí mismo; dice "bro"; una grosería puntual en la serie de consultoría.
- Analogías de la vida diaria: semáforo de entrada a la autopista, jefe de videojuego, cierre de la rampa.
- Cierra con un chiste fijo ("gracias por venir a mi charla", más "cobrá más plata") **[G]**.
- No pide permiso ni explica de más: da la regla y sigue.

### 2.3 Promesa central

No es una promesa por pieza sino **una creencia repetida**: que el dueño no necesita más ideas, necesita un sistema
simple de oferta, precio y captación. Cada pieza trae UNA regla con nombre:

| Pieza | Regla con nombre |
|---|---|
| Premium (largo 1) | "vendé caro a pocos o barato a todos; el medio es la muerte"; ecuación del valor |
| $100K (largo 3) | escalera de 6 pasos; reparto 4-4-4 del tiempo; regla 1-1-1; "tres baldes" del gasto |
| Pasión (largo 2) | tolerancia a la frustración como habilidad |
| Parque (largo 4) | "Grand Slam Offer" + sorteo con premio de $5.000 y descuento de consuelo |
| This Could 2X | embudo de 6 pasos: anuncio en IG, texto POV, rango de precio, VSL, registro, llamada |
| Which One | "Lista de Grandes Ideas": anotás, esperás una semana, 3 de 4 no valían |
| Why Feel Stuck | el "pantano" entre USD 1 y 3 M: salir cuesta más riesgo que entrar |

### 2.4 Tipo de prueba

| Prueba | Dónde aparece | Ejemplo |
|---|---|---|
| Credencial con número | gancho de los largos, en 0-3 s | cifras de ventas y de salida de empresa, escritas sobre el pecho **[G]** |
| Caso ajeno con las cuentas en pantalla | consultoría en vivo | diapositivas con costo del parque $22 M, deuda $14 M, ingresos $400 mil contra equilibrio $550 mil **[G]** |
| Resultado a 90 días | cierre del parque | videollamada final: leads y ventas de campamentos **[G]**; las cifras exactas no las verifiqué |
| Su propio tuit en pantalla | largos 1 y 3 | captura recortada sobre fondo oscuro |
| Libros en la mano | largos 3 y 5 | sostiene los tres frente a la cámara |
| Analogía con un famoso | largos 1, 6 y short | Tesla, Warren Buffett, Dolly Parton, Elon Musk |
| Número dicho por el cliente | shorts de pregunta | el dueño dice su facturación y su margen en 10 s |

### 2.5 Objeciones que contesta

- "Vender 1 a 1 no escala": al inicio se necesita caja, no escala (largo 1).
- "Vender tiempo es de pobres": Buffett también cobra por su tiempo (largo 1).
- "No tengo tiempo por mi trabajo de 9 a 5": el problema es el 5 a 9 (largo 3).
- "Seguir la pasión": la pasión es un mal filtro; escalar trae tareas aburridas (largo 2).
- "La IA hace mejor contenido que yo": la IA no tiene prueba, documentá en vez de crear (largo 5, flojo).
- "No tengo presupuesto de marketing": usá tu lista y un sorteo de costo casi cero (largo 4).
- "¿Tengo razón yo o mi COO?": hay que dosificar las ideas (short).

### 2.6 CTA por red y embudo hasta la plata

**CTA en lo que miré**

| Formato | Piezas | Con CTA |
|---|---|---|
| Shorts | 6 míos + 2 de PLAN-REFERENTES + 5 de la segunda pasada | **0 de 13**: ninguno pide nada (los 5 nuevos: Gemini flash-lite y 12 cuadros de cada uno) |
| Largos | 6 | **3 confirmados por el audio** (`jfW6gL6hKhk`, `UDBkiBnMrHs`, `XsWSvz-aewA`), **2 sin confirmar por el audio** (`uWdIgftpvBI`: el banner es visual; `xRxVpjeHmeA`: el 21:20 no trae CTA en los subtítulos) y **1 sin CTA** (`SCi464zfAUM`) **[corregido: decía "5 de 6"]** |

| Largo | Dónde cae el CTA | A qué manda |
|---|---|---|
| 1 Premium | banner en 0:08 según Gemini; **no confirmado** (a los 0:08 el audio habla de vender USD 16 M en un fin de semana) | banner "GO.ACQ.COM" según Gemini **[G]**; `go.acquisition.com` hoy redirige (301) a la tienda del libro Money Models (USD 29,99) **[M]** |
| 2 Pasión | **8:36** de 26:15 (33 %) **[F]**, de pie junto a un papel impreso (el cambio de set es [G]) | "$100 million scaling road map" -> `acquisition.com/roadmap` |
| 3 $100K | **2:43** de 15:46 (17 %) **[F]**, con tres libros en mano (cuadro visto) | libros "para cubrir el envío", unos USD 16-17 "los tres" + 30 días de prueba de Skool, dicho en el audio **[F]**. **[NV] no pude confirmar la oferta de hoy**; la tienda solo muestra un libro a USD 29,99 |
| 4 Parque | **no confirmado**: en 21:00-22:30 el audio habla de la campaña y de los 3.700 leads, sin pedir nada. "Roadmap" se nombra en 0:18, 22:51 y 23:24, dentro de la consultoría | si hay un cartel de roadmap, es visual **[G]** |
| 5 Contenido e IA | **4:51** de 13:55 (35 %) libros **[F]**; la comunidad de "USD 1 M+" recién se nombra a los **12:52** (92 %), no a los 7:25 que decía Gemini **[corregido]** | libros y `vantage.acquisition.com` (la URL no sale en el audio) |
| 6 Marca personal | ninguno **[F]**: ni una mención en los subtítulos | solo la marca en la ropa y las diapositivas |

- Los largos mezclan 3 destinos (roadmap, libros, Vantage). En cada pieza va **uno** (coincide con la regla 3 de PLAN-REFERENTES).
- Redes sociales: TikTok e Instagram sin dato **[NV]**.

**Embudo completo (páginas leídas el 8-oct)**

| Escalón | Qué es | Precio | Filtro |
|---|---|---|---|
| 1 Contenido | 5-6 shorts por día y ~1 largo por semana | 0 | ninguno |
| 2 Cursos gratis | Money Models, Offer Creation, Lead Generation | 0 | ninguno |
| 3 Roadmap | `/roadmap`: hoja de ruta personalizada "en menos de 30 s" | 0 | pide consentimiento para llamadas, SMS y correo con marcación automática y **IA** |
| 4 Libro | $100M Money Models (tapa dura) | USD 29,99 (envío no visible) | ninguno |
| 5 Taller | Scaling Workshop, 2 días presenciales en Las Vegas | **USD 5.000 por asiento** | negocio de USD 1 a 100 M al año; bajo 250 mil "todavía no"; "si no ganaste al menos USD 5 mil con el contenido gratis, no vengas"; se entra reservando llamada |
| 6 Vantage | comunidad de pago, solo por invitación, facturación verificada de USD 1 M+ | **USD 36.000 al año (plan VIP)** | aplicación; la invitación llega por asistir al taller |
| 7 Alianza | "Partner With Us", inversión | no visible | aplicación |

Cifras que muestra el sitio **[M]**: 10.000 negocios asesorados, NPS 81, retención de clientes 97,1 %, 12.000 asistentes a talleres,
más de USD 250 M de ingresos anuales en cartera, cada libro "más de 1 M de copias", 12 M+ de audiencia. Pie de página: "resultados no típicos ni garantizados".
Nuevo contra `REFERENTES-ECOSISTEMA.md`: el precio del taller, **Vantage** y su USD 36.000, y el filtro "primero ganaste con lo gratis".

**Lectura:** el contenido nunca vende. Su trabajo es subir a la gente a un escalón gratis y filtrar por facturación. La
plata está en dos puertas: el taller de USD 5.000 y Vantage; las dos exigen que el cliente ya facture millones.

---

## 3. Guiones

### 3.1 Fórmulas de gancho (primeros 3 s) con ejemplo

| # | Fórmula | Ejemplo (paráfrasis) | Dónde |
|---|---|---|---|
| G1 | **Contraste de estatus con número**: de la pobreza a una cifra enorme | "En 2016 dormía en el piso de un gimnasio con mil dólares" + cifra en pantalla | largos 1, 3, 5 |
| G2 | **Carta abierta a una persona**: nombra a quién le habla | "Este video lo hago para el joven que me paró en la calle" | largo 2 |
| G3 | **Riesgo extremo**: el caso al borde | "Quiebra, o sea cero dólares en su cuenta" | largo 4 |
| G4 | **El dueño dice su problema** en voz propia, con cifras | "Facturamos 7 millones, mi COO dice que frene, ¿quién tiene razón?" | shorts de pregunta |
| G5 | **Paradoja o aforismo** | "La excusa que te das es la razón para hacerlo" | short 11 |
| G6 | **Cita de un famoso para abrir** | "Elon dijo algo que me gusta..." | short 10 |
| G7 | **Anécdota con alguien de estatus** | "Hablé con un campeón del mundo y..." | short 12 |
| G8 | **Definición con pregunta** | "¿Qué es el factor X?" | largo 6 |
| G9 | **Título-promesa con tiempo exacto** | "Me tomó 37 años entender lo que te cuento en 18 minutos" | títulos de largos |

Fórmulas de título de largo **[M]**: "Si yo [empezara / quisiera ...] en 2026, haría esto"; "por favor mirá esto" con una persona
estancada; número exacto de minutos; el nombre de un famoso entre guiones.
En shorts, el título casi siempre es **la pregunta del dueño** o el resultado ("podría duplicar tu negocio de un día para otro").

### 3.2 Guiones desarmados

**A. Short de pregunta en conferencia: `This Could 2X Your Business` (1:46, 365 mil)** [G]

| Tiempo | Qué dice | Qué se ve | Función |
|---|---|---|---|
| 0:00-0:16 | El dueño agradece a Hormozi y dice que sus lecciones guían a su grupo | Pantalla dividida, rótulo rojo con el título; subtítulo karaoke abajo | Rapport. Tarda 16 s en llegar al problema |
| 0:16-0:40 | Presenta a su esposa (directora de ventas) y su negocio de casas de campo a medida: USD 8-9 M, 13-14 obras, margen 22 % | Dueño abajo; Hormozi arriba, manos en los bolsillos | Contexto con números |
| 0:40-0:49 | Meta: USD 5 M de ganancia operativa para vender a un fondo. "Se siente como el Everest" | Rostro serio del dueño | Conflicto |
| 0:49-1:21 | "Vendés algo muy visual: un anuncio en IG con un recorrido con dron funcionaría"; nombra nichos raros que lo lograron (bóvedas, refugios, "cuevas de hombre") | Hormozi gesticula; zoom lento a su cara | Diagnóstico + prueba por analogía |
| 1:21-1:31 | "¿Podés duplicar las obras con tu personal?" "Sí" | Dueño asiente | Valida que el cuello no sea la entrega |
| 1:31-1:46 | Receta: anuncio IG, texto POV, rango de precio, VSL, registro, llamada. "Lo resolvés en una tarde" | Hormozi cuenta con los dedos; aplauso | Entrega la regla. Sin CTA |

**B. Short de pregunta: `Which One Of Us Is Right?` (1:29, 330 mil)** [G]

| Tiempo | Qué dice | Qué se ve | Función |
|---|---|---|---|
| 0:00-0:09 | Dueño presenta a su COO y a ventas; "siempre nos mandamos tus videos para ganar discusiones" | Pantalla dividida; rótulo rojo a la izquierda con la pregunta | Gancho de reconocimiento (el público ya lo mira) |
| 0:09-0:25 | "Facturamos 7 M; crecimos rápido; mi COO dice que mis cambios estresan al equipo. ¿Quién tiene razón?" | Dueño abajo, Hormozi escucha | Conflicto con cifra |
| 0:25-0:30 | Hormozi bromea con elegir al más lindo | Risas | Alivio. Sube la retención |
| 0:30-0:41 | "Mejorás todos los días, pero tenés que saber cuánto cambio digiere tu empresa" | Plano medio caminando | Principio |
| 0:41-1:06 | Su "Lista de Grandes Ideas": anota, espera una semana, 3 de 4 veces no eran tan buenas | Gestos de escribir | Herramienta aplicable |
| 1:06-1:12 | El dueño: "mando notas de voz a todos". Hormozi: "no hagas eso" | Risa | Corrección en vivo |
| 1:13-1:29 | Tu COO es el semáforo que regula la entrada a la autopista | Manos como barreras | Analogía de cierre |

**C. Short de podcast: `Why Do I Feel Stuck?` (1:10, 264 mil)** [G]

| Tiempo | Qué dice | Qué se ve | Función |
|---|---|---|---|
| 0:00-0:08 | El anfitrión (Ed Mylett): ¿por qué tanta gente sale de cero y se estanca? | Pantalla dividida; rótulo rojo con el título 8 s | Pregunta amplia que cualquiera se hace |
| 0:08-0:23 | Entre USD 1 y 3 M el dueño ya cubre sus lujos y pierde hambre: es "el pantano" | Plano de Hormozi | Nombra el problema y quita la culpa |
| 0:24-0:34 | Salir cuesta más riesgo que el que corriste para entrar | Intensidad en la cara; el invitado asiente | Paradoja |
| 0:35-0:44 | Negocio de 2 M, 20 % de margen: 400 mil libres, reservás 100 mil, quedan 300 mil | **Animación de pizarra blanca con marcador** (billetes, alcancía) | Prueba matemática |
| 0:45-1:01 | Tu primer líder de verdad cuesta 150-250 mil: arriesgás la mitad de tu ganancia en una contratación | Planos cerrados + pantalla dividida | Clímax: el miedo es lógico |
| 1:02-1:10 | Por eso la mayoría se queda. El anfitrión: "mi entrevista favorita" | Sonrisas | Validación social. Sin CTA |

**D. Short solo caminando: `Losing Only Teaches One Lesson` (0:38, 13 mil)** [G]

| Tiempo | Qué dice | Qué se ve | Función |
|---|---|---|---|
| 0:00-0:03 | Le escribí a un campeón del mundo porque pensaba en él | Camina hacia la cámara en un estacionamiento; subtítulo verde | Anécdota con estatus |
| 0:04-0:13 | Le dije: ganá el próximo y retirate en la cima | Plano medio, manos | Consejo inicial |
| 0:14-0:18 | Él: "¿y las lecciones de perder?" | Zoom digital | Conflicto |
| 0:19-0:26 | "Eso me molestó": perder solo enseña a evitar perder; ya aprendió eso | Subtítulos en verde en "me molestó" y "evitarlo" | Contraargumento |
| 0:27-0:38 | Volver a perder para aprender es bajar dos niveles de un videojuego para ganarle a un jefe que ya vencés | Zoom más cerrado | Analogía de cierre |

**E. Short selfie: `Why Does Business Feel So Hopeless?` (0:20, 4,2 mil)** [G]
0-3 s abre con "Elon dijo algo que me gusta" y la frase de masticar vidrio; 6-16 s traduce la frase a "incertidumbre y dolor
sin garantía de que mejore"; 16-20 s cierra con el filtro "si necesitás un discurso motivacional, esto no es para vos".
Un solo plano sin cortes, 65 palabras. Rótulo rojo fijo todo el clip. Función: ahuyentar al que no aguanta, sin CTA.

**F. Short de podcast: `Your Excuse Is the Reason` (0:23, 9,3 mil)** [G]
0-7 s tesis ("la excusa que te das es la razón para hacerlo") con el ejemplo de una madre abusiva; 7-17 s el
entrevistador objeta ("de chico te moldean"); 17-23 s cierre "tú elegís creerlo". Dos cortes en todo el clip.

**G. Largo 1, premium (18:25, 1,9 M)** [G]

| Tiempo | Qué dice | Qué se ve | Función |
|---|---|---|---|
| 0:00-0:45 | En 2016 dormía en un gimnasio con USD 1.000; nueve años después, récord Guinness y **más de USD 16 M de ventas en un fin de semana** [F, subtítulo]; si empezara hoy, esto haría **[corregido: decía "100 M"]** | Cifra y foto vieja en 0:01-0:02; banner "FREE ONLY: GO.ACQ.COM" en 0:08 [G, sin confirmar] | Gancho de contraste + tesis |
| 0:45-2:25 | Tesla empezó con un auto de USD 250 mil y financió el barato; yo con un cliente de USD 5.000 al mes | Logo, línea de tiempo de precios, video viejo del gimnasio | Analogía + historia propia |
| 2:25-5:19 | "No escala": no importa, hace falta caja; Buffett también cobra por su tiempo | Se saca la gorra; gráfico de cobro por hora | Matar la objeción |
| 5:19-9:16 | Tu logo = oferta y demanda; 90 clientes a $100 contra 10 a $1.000: los 10 ganan el triple | Gráfico de personas en iconos 90/10 | Prueba matemática |
| 9:16-12:59 | Si cobraras 100 veces más, ¿qué incluirías? Tres preguntas mentales | Tres tarjetas de texto | Ejercicio para el espectador |
| 12:59-15:43 | El dolor vende más que la promesa: copiá las reseñas negativas de libros de tu competencia | Gráfico extrayendo datos | Táctica accionable |
| 15:43-18:25 | Ecuación del valor (velocidad, esfuerzo, facilidad, resultado); "cobrá más plata" | Barras deslizantes | Cierre |

**H. Largo 3, $100K (15:45, 1,6 M)** [G]

| Tiempo | Qué dice | Qué se ve | Función |
|---|---|---|---|
| 0:00-0:57 | Me sentí más rico con los primeros 100 mil que con millones; 6 pasos | **Cinco cifras amarillas en 5 s** [F]: USD 0 sobre un primer cuadro desenfocado, 41.187.989, 42.000.000 "in distributions", 32.724.944 y 46.200.000 "exit"; escalera animada de 6 peldaños [G] | Gancho de contraste + agenda **[corregido: decía "tres cifras en 3 s"]** |
| 0:57-2:43 | Paso 1: cortá todos los costos [F: 2:43 es donde empieza el CTA] | Lista "ropa barata, cuarto compartido, auto barato" | Regla dura |
| 2:43-3:33 | Los 3 libros, gratis, pagás envío | Libros físicos frente a la cara, cartel amarillo "LINK IN THE DESCRIPTION" | CTA a los 2:43 |
| 3:33-7:29 | Paso 2: ahorrá tiempo. Tu trabajo no mata el sueño, lo hace tu 5 a 9; creador contra administrador | Tuit en pantalla; ícono de candado | Concepto de productividad |
| 7:29-8:49 | Paso 3: investigá una habilidad que ya se pague | Lista B2B y B2C | Enfoque comercial |
| 8:49-11:32 | Paso 4: aprender = cambiar de conducta, 10.000 iteraciones | Animación del contador | Reencuadre |
| 11:32-12:52 | Paso 5: gastá en herramientas, implementación y pruebas (tres baldes) | Animación de baldes | Guía de inversión |
| 12:52-15:45 | Paso 6: no subas tu nivel de vida; pirámide de Maslow | Pirámide | Cierre emocional |

**I. Largo 2, monólogo sobrio (26:14, 1,9 M)**: estructura por tramos **[G, parcial]**
Anécdota de la calle (0:00-0:54) -> su paso de consultor a gimnasio (0:55-2:13) -> la pasión como mal filtro (2:14-8:29) ->
**CTA al roadmap con cambio de set y papel impreso (8:30-9:01)** -> la amiga de las galletas, "me apasiona ser excelente" ->
tolerancia a la frustración -> cuánto importa la opinión ajena -> cierre en silencio. Es un video casi sin edición.

**J. Largo 4, parque (28:53, 1,5 M)**: estructura por tramos **[G]**
Gancho de quiebra (0:00-0:43) -> el dueño y sus números (0:43-2:52) -> clímax emocional: le quedan 2 semanas de caja (2:52-4:07) ->
costo de supervivencia (4:07-5:14) -> "The Fix" escrito en un rollo de papel sobre la mesa (5:14-) -> auditoría de su web -> 4 canales de tráfico ->
sorteo de campamentos de USD 5.000 -> anuncio que graba el dueño -> llamada a las ganadoras -> **CTA al roadmap (21:20)** ->
videollamada a los 90 días (23:10-). El hilo que sostiene los 29 min es **¿sobrevive o cierra?**, abierto en el segundo 0 y cerrado al final.

**K. Largo 5, contenido en la era de la IA (13:55, 307 mil)**: esqueleto completo por subtítulos propios **[F]** (la tabla de Gemini llegaba a ~9:20)
Gancho con su cifra de seguidores (0:00) -> qué le pide el contenido al consumidor: entretener, informar o cambiar conducta (0:40-2:47) -> la IA ya hace
lo "entretenido" y lo informativo (2:47-4:09) -> ejemplo de una creadora que viene de finanzas (4:09) -> **CTA de libros a los 4:51 (35 %)** -> por qué importa la
prueba y la demostración (5:36-8:21) -> la IA no puede fingir un caso real (8:21-9:42) -> idea central: **documentá en vez de crear**, trabajá gratis y publicalo (9:42-11:50) ->
mención de la comunidad de USD 1 M+ (12:52) -> cierre con "ver a esta persona usar su experiencia en la vida real" (13:13). Hilo: una sola tesis repetida desde tres ángulos.

**L. Largo 6, marca personal con Dolly Parton (13:52, 165 mil)**: esqueleto por subtítulos propios **[F]**
Define "factor X" (0:00) -> los factores X son raros y **contradictorios** a la vez (2:06-4:12: ejemplo de Dolly, sexy y a la vez cercana) -> por qué importa el patrón: la
gente reconoce patrones y le presta atención a quien los rompe (6:20-7:46) -> su caso personal: le dijeron "no lo hagas" y lo hizo igual (8:27-9:52) ->
"no sé qué" como ingrediente (9:52) -> lista de roles de la fama que no combinan (10:36-12:43) -> cierre: elegí qué quiebra tu patrón (13:26). **Sin CTA en todo el audio.**
Es el video con menos vistas de los 6 (165 mil): el único que no promete un resultado de negocio en el título.

### 3.3 Recursos de retención (los que repiten en 3 o más videos)

| Recurso | Dónde |
|---|---|
| **Número escrito sobre el pecho** en 0-3 s | largos 1, 3, 5 |
| **Rótulo rojo** con el problema en pregunta o promesa, desde el cuadro 0 y **3,5 a 12 s**, después desaparece | 8 de 8 shorts con título entre comillas o promesa que medí [F]; **0 de 2** en frases solas (`EQHJqh6KAIo`, `HGbSB4LI9Ww`) |
| **Lista numerada visible** (escalera de 6, "1-2-3-4") | largos 1, 3, 5 |
| **Una analogía cotidiana por pieza** | 4 de 6 shorts y 6 de 6 largos; en 2 shorts es el cierre (semáforo, jefe de videojuego) |
| **Cuenta en voz alta**, con el número a la vez en pantalla | shorts de pregunta, largos 1 y 3 |
| **Hilo abierto de punta a punta** (¿sobrevive?) | largo 4 (el resto de la serie no lo vi) |
| **Conflicto del invitado** a mitad ("pero de chico te moldean") | clip de podcast `KqoGx` |
| **Chiste cortito** que baja la tensión antes de la regla | `Which One` (elegir al más lindo) |
| **Cambio de ritmo**: grito, susurro, golpe de mano | largos 1 y 3 |

### 3.4 Cierres

- **Shorts:** terminan en el último punto de la idea (una analogía, una elección, la validación del invitado). Sin "chau", sin pedir nada, sin "seguime" en los 8 que vi.
- **Largos:** chiste fijo ("gracias por venir a mi charla"), orden concreta ("cobrá más plata") o una frase que invita a callar.
- **Consultoría:** moraleja sobre el carácter del cliente.

### 3.5 Largo de frase y ritmo

Frase corta (5-8 palabras), una idea por oración, sin muletillas largas. Shorts de conferencia: 2,4 a 3,1 palabras por
segundo. Largos explicativos: ~3,1-3,2. Monólogo sobrio: 2,2-2,5 con silencios dramáticos de 1-2 s. **[G, estimado]**

---

## 4. Edición (**[F]** donde dice medido; el resto **[G]**, ver 0.3)

### 4.1 Short vertical de diálogo (el que más rinde)

Medido sobre 6 shorts de diálogo bajados (360x640): `Which One` (89 s), `This Could 2X` (106 s), `Why Feel Stuck` (71 s), `Should I Kill` (105 s),
`10X Referrals` (72 s), `What Would It Take` (46 s).

| Parámetro | Lo que se ve |
|---|---|
| Layout | **Pantalla dividida solo mientras habla quien pregunta**: Hormozi arriba, el otro abajo, y de vuelta al plano completo de Hormozi cuando explica. En `Which One` es split 0-18 s, plano completo 20-66 s, split otra vez al final. `10X Referrals` no usa split (planos completos de dos cámaras); `What Would It Take` es plano de él casi todo el clip y split recién a los ~30 s **[F, cuadros]** **[corregido: decía "50/50" fijo]** |
| Cortes | **Medidos con ffmpeg (umbral 0,35):** `Which One` **28 en 89 s = 3,1 cada 10 s**; `This Could 2X` **42 en 106 s = 4,0**; `Should I Kill` **35 en 105 s = 3,3**; `10X Referrals` 11 en 72 s = 1,5; `Why Feel Stuck` 3 (con umbral 0,2: 12, o 1,7 cada 10 s); `What Would It Take` 0-2 en 46 s (casi un solo plano). **[corregido: Gemini dijo 14 cortes en `Which One` (1,6 cada 10 s) y 2-3 cada 10 s en `This Could 2X`; la medida es el doble]**. Ritmo por tramos en `Which One`: un corte cada ~3 s durante el planteo (0-41 s), **25 s sin ningún corte** mientras explica la lista (41-67 s), y un corte cada ~1,5 s en los últimos 22 s |
| Subtítulos | Negrita, mayormente cursiva, 1 a 3 palabras, karaoke. En el split van **en la costura** (abajo de la mitad de Hormozi); en plano completo van a ~75 % de la altura. **El color marca quién habla: amarillo (cursiva) = la otra persona, blanco = Hormozi**; también va en amarillo cuando él cita lo que dijo el otro. Visto en `Which One`, `This Could 2X`, `Why Feel Stuck` y `Should I Kill` (4 de 4 con split) **[F, cuadros]** **[corregido: decía "blanco, palabra clave en amarillo (COO, $7M, fast, ideas)"; en el audio esas palabras las dice el dueño, no son énfasis]** |
| Rótulo | **Cartel rojo con letras blancas, entre comillas y con mayúscula normal** (`This Could 2X`: sin comillas y en mayúsculas), con el tema como pregunta. **Dura 3,5 a 12 s y se va**: `Should I Kill` 0-3,5 s; `Which One` 0-6 s; `Why Feel Stuck` 0-8 s; `10X Referrals` ~0-9 s; `What Would It Take` ~0-10 s; `This Could 2X` 0-12 s **[F, píxeles rojos por fotograma]** **[corregido: decía "Which One todo el clip" y "This Could 2X los primeros 2 s"]**. En `Should I Kill` el primer cuadro es **negro con solo el rótulo**; el video entra a los 0,5 s |
| Zooms | Lentos en la mitad de Hormozi cuando explica el concepto **[G]** |
| B-roll, capturas | Ninguno |
| Gráficos | Solo cuando hay cuentas: `Why Do I Feel Stuck` corta a una **animación de pizarra blanca, trazo negro tipo marcador** (billetes, "$2M REVENUE -> 20 % MARGIN -> $400K PROFIT -> $100K RESERVE") de ~9 s (visible desde ~35 s hasta antes de los 55 s); **solo el óvalo alrededor de $400K es verde**, los números son negros **[F, cuadros]** |
| Música y SFX | Sin música ni SFX; solo el ambiente del evento **[G]**; no medí el audio |
| Primeros 3 s | Cuadro 0: ya está el rótulo rojo y el primer subtítulo, y se oye la voz de quien pregunta. 0-3 s: dos o tres planos (en `Which One`: cortes a los 3,2 y 5,2 s) **[F]** |
| Color y cámara | Plano medio de ambos. Fondo azul o violeta de escenario; la camisa azul y el amarillo del subtítulo son el único contraste |
| Duración | 0:46 a 1:46 (medidas) |

### 4.2 Short vertical solo (selfie, caminando o a cámara)

| Parámetro | Selfie (`uvP4`, 4 mil) | Caminando (`EQHJ`, 13 mil) |
|---|---|---|
| Cortes | **0**, un plano de 20,8 s **[F]** | 3 con umbral 0,35, 17 con 0,2 (reencuadres digitales) en 37,7 s **[F]**; Gemini dijo ~9 |
| Subtítulos | Blanco, tercio inferior, 1-4 palabras, karaoke plano sin color **[G]** | **Muy grandes**, centro del pecho, 1-2 palabras, **alterna verde y blanco**, rebote **[G]** |
| Rótulo | Cartel rojo **0-10,5 s de 20,8 s** [F] **[corregido: decía "todo el clip"]** | Ninguno **[F]** |
| Música/SFX | Ninguna; viento [G] | Beat lento y oscuro + whoosh e impactos graves sincronizados con los cambios de subtítulo [G] |
| Encuadre | Primer plano, de pecho para arriba | Plano medio de cintura, cámara en mano que retrocede |
| Duración | 0:21 | 0:38 |

Rinden 4-13 mil, pero son de hoy y no se comparan con los de diálogo, que llevan semanas. Lo comparable: los demás shorts
que no son diálogo tienen mediana de 16,5 mil en el catálogo; el diálogo con un dueño rinde unas 9 veces más que la frase sola (155,5 mil contra 16,5 mil).

### 4.3 Largo horizontal, explicativo con gráficos (largos 1, 3, 5)

| Parámetro | Lo que se ve |
|---|---|
| Cortes | **Largo 3 medido con ffmpeg: 17 cortes en el primer minuto con umbral 0,35 (31 con umbral 0,2), 3 en el minuto 60-120 y 9 en el 120-180 (umbral 0,2)** = de 3 a 5 cada 10 s al inicio, bajando a 0,5-1,5 cada 10 s después. En todo el video: 39 cortes (umbral 0,35), unos 0,4 por 10 s. Largo 1 (11 en el primer minuto) sin medir **[F para el 3, G para el 1]** |
| Subtítulos | **Dos capas** en el largo 3: una línea chica blanca en minúscula en el tercio inferior (la frase completa) y, encima o junto, **mayúsculas grandes en amarillo y blanco** con las 3-4 palabras clave ("IT'S ACTUALLY NOT THE TRUTH", "TO WORRY ABOUT TOMORROW"). Las cifras son amarillas y mucho más grandes. **No vi verde neón en el largo 3** **[F, cuadros]** |
| Zooms | Punches de +10 a +15 % en pausas dramáticas y palabras clave (simulan segunda cámara) |
| B-roll | Fotos y videos reales de su pasado (gimnasio, jet), stock de Tesla, retratos, íconos 3D amarillos |
| Capturas | **Sus propios tuits recortados** sobre fondo oscuro; el panel de ventas con contadores subiendo |
| Gráficos | **Vectores 2D sobre fondo azul oscuro o negro**, líneas neón blanco y amarillo, acento violeta; pirámides, ecuación del valor, escalera de 6 pasos; entran con deslizamiento |
| Música | Sintetizador grave y ambiental, siempre abajo |
| SFX | Pop digital con cada número, whoosh con cada gráfico, golpe grave en transiciones grandes |
| Primeros 3 s | Largo 1 **[G]**: plano medio con "2016" -> video casero del gimnasio con "$1.000" -> pantalla dividida con foto del colchón y "MY BED". Largo 3 **[F, cuadros 0 a 5 s]**: cuadro 0 con él desenfocado y un "$0" amarillo en el pecho -> 0,7 s "$41.187.989" sobre plano medio -> 1,5 s escenario con pantalla gigante de rostros y "$42.000.000" -> 3 s "$32.724.944" -> 5 s "$46.200.000 exit". **Una cifra nueva cada 1 a 1,5 s**, siempre grande y amarilla, con cortes a los 1,2, 2,7 y 5,4 s |
| Set | Estudio oscuro, paneles acústicos negros con **tiras verticales de LED cálido o violeta**, mesa rústica de madera, micrófono dinámico al frente |
| Luz y color | Tres puntos: luz de recorte violeta en hombros, clave suave, relleno tenue. Negros profundos, piel cálida saturada |
| Cámara | Plano medio frontal centrado, 16:9 |
| Rótulos | Título de proceso amarillo arriba ("HOW TO BUILD A BUSINESS"), pasos numerados, fórmulas animadas ("$80.000 / 2.000 = $40/h") |

### 4.4 Largo horizontal, monólogo sobrio (largo 2, 26 min, 1,9 M)

Lo opuesto del 4.3 y con las mismas vistas: **2 o 3 cortes en el primer minuto**, reencuadres digitales de 1,1x en las pausas,
**sin b-roll, sin capturas, sin música, sin SFX**, subtítulos blancos con sombra suave y sin color. Un cartel morado con
nombre y cargo (0:20-0:24: fundador de Acquisition.com, USD 250 M+ en cartera) y el CTA cambia de set: de pie con una pizarra grande impresa (desde **8:36** según el audio **[F]**; el cambio de set y la barra azul con la URL son [G]).
**Conclusión útil: lo que sostiene las vistas es el título y la historia, no la edición.** Dos extremos de edición, mismo 1,9 M.

### 4.5 Largo de consultoría en vivo (largo 4, serie Scale or Fail)

| Parámetro | Lo que se ve |
|---|---|
| Cortes | Primer minuto: uno cada 1,5-3 s (acción del parque, gestos, el dueño llegando); mitad: uno cada 5-7 s |
| Set | Sala de reuniones oscura, **mesa larga de madera cubierta con un rollo de papel blanco** donde escribe con marcador grueso, TV de fondo con diapositivas grises, tiras de LED cálidas |
| Subtítulos | No son continuos. Aparecen **cajas de definición** ("DEBT", "GRAND SLAM OFFER", "ATTACH RATE", "BURN / RUNWAY") en verde y negro con deslizamiento lateral |
| Rótulos | Tercio inferior verde y negro con nombre y negocio; títulos de fase ("THE BUSINESS", "THE FIX", "90 DAYS LATER") |
| B-roll | Abundante en 4K del lugar, familias, atracciones |
| Capturas | La web del cliente, el PDF del roadmap en movimiento |
| Música | Cuerdas tensas en la confesión de deuda; electrónica de tempo medio en "The Fix" |
| SFX | Garabato de marcador, impactos, campana de hotel al definir un concepto |
| Zooms | Push-ins lentos al llanto del dueño; snap zooms a Hormozi en el punto clave |
| Color | Sala desaturada y seria contra b-roll saturado |

### 4.6 Largo con diapositivas (largo 6, Dolly Parton)

Charla de conferencia grabada con un plano medio de Hormozi alternado con **diapositivas numeradas (02/34)**; texto de
las láminas en blanco y violeta sobre azul muy oscuro; fotos de los personajes y un meme; lo-fi casi inaudible; sin SFX; sin subtítulos
de colores. 10-12 cortes por minuto. **[G, baja confiabilidad]**

### 4.8 Otros dos formatos solos que no estaban en la primera versión **[F]**

**Monólogo a cámara en estudio con pegatinas (`The Price You Charge...`, 44,9 s, 41 mil: el solo que más rinde).**

| Parámetro | Lo que se ve |
|---|---|
| Cortes | 0 con umbral 0,35; 5 con 0,2 en 45 s. Prácticamente un plano |
| Subtítulos | **Muy grandes, blanco, 1-3 palabras, centro del pecho**, algunas en cursiva, sin color |
| Gráficos | **Pegatinas pixel-art sincronizadas con la palabra**: una barra de pan cuando dice "a baker" y "sells", una moneda cuando dice "copper coin" |
| Rótulo rojo | **Ninguno** |
| Guion | Una analogía cotidiana de punta a punta (el panadero que vende pan y la moneda) para explicar precio y valor, con "4X" como cifra |
| Set | Estudio con tiras verticales de luz, camisa a cuadros, micrófono dinámico al frente |

**Selfie junto a una piscina con rótulo (`Am I Waiting Too Long?`, 73 s, 25,9 mil).** Video horizontal dentro del cuadro vertical, con **barras negras arriba y abajo**;
**1 solo corte en 73 s**; rótulo rojo en comillas 0-12 s arriba; subtítulos blancos de 2-3 palabras con negrita en la palabra clave, a la altura del pecho. Rinde 4,5 veces
lo que `uvP4` (mismo escenario, 5,7 mil), así que **el rótulo y la piscina no explican la diferencia**.

### 4.7 Carrusel

**Sin dato.** No vi ningún carrusel de Hormozi. Lo que sí hay son capturas de sus tuits recortadas, que es el material
que alimentaría un carrusel.

---

## 5. Qué copia Sergio Urcullo YA

Cada punto trae el dato y dónde cae en la semana del 9 al 15-oct. Los códigos son los de `CALENDARIO-PUBLICACION-9-16-OCT.md`.

| # | Qué copiar | Evidencia | Dónde se aplica |
|---|---|---|---|
| 1 | **Rótulo con el problema en pregunta, desde el cuadro 0 y solo 4 a 10 s**, no como tema genérico ni fijo todo el clip. Se redacta la pregunta, sin atribuirla a un cliente que no existe (regla F3 de PLAN-REFERENTES). **Se copia la función (decir de qué va en el cuadro 0), no se espera el efecto de vistas** | 8 de 8 shorts de diálogo y 2 solos lo llevan, pero **los 2 solos con el mismo rótulo rinden 5,7 y 25,9 mil, como el resto (16,5 mil)**; la ventaja de 155,5 mil es del diálogo con un dueño real, que Sergio Urcullo todavía no tiene (ver 1.4 **[corregido: la versión previa lo atribuía al rótulo]**). Duración medida: 3,5 a 12 s [F] | **Guiones 10 al 16-oct**. Propuestas para validar con cada guion (el texto lo decide el guion, no esta ficha): N07 "¿Puede mi bot costar 10 veces menos?"; DD-A "¿Por qué este modelo cuesta un quinto?"; S2-D07-A "¿Por qué mi bot dejó de contestar?"; S2-D08-A y D01-C ya son preguntas ("¿La IA le promete algo que no confirmaste?", "¿Opus 5.5 o Sonnet 5.5?"). Va en negro/blanco con la palabra clave en verde, **no rojo** |
| 2 | **Una analogía cotidiana por pieza**, con un objeto que el espectador ve a diario; en los cierres donde encaje | 4 de 6 shorts y 6 de 6 largos usan una; en 2 shorts es el cierre (semáforo, jefe de videojuego) | Cierre de cada guion. Ideas bolivianas para validar: la caché de OpenAI como el cuaderno donde ya anotaste la respuesta; la ventana de 24 h como el horario de la ventanilla. Va en el texto del guion, antes de grabar |
| 3 | **La cuenta en voz alta, paso a paso, con el número que entra a la vez como contador** | Q&A: "22 % de 8 millones, 1,6"; `Why Feel Stuck`: la cuenta de 2 M dibujada | N07 (3 USD a 0,30 USD en 1.000 mensajes) y DD-A (precios por millón). Ya está en el molde Erik (contador); lo que suma Hormozi es **decir la cuenta de memoria y de a un paso** |
| 4 | **Animación de pizarra blanca con marcador, ~9 s, solo para el tramo de las cuentas** (el resto sigue en el molde) | `Why Feel Stuck` [F, cuadros 35-44 s]: único gráfico de un short de 70 s; el flujo es ingreso -> margen -> ganancia -> reserva, cada paso entra uno debajo del otro | Edición con HyperFrames: plantilla `pizarra-cuentas` (billetes, flechas, texto), fondo blanco, trazo negro, **solo el resultado (óvalo) en verde**. Probar primero en N07 |
| 5 | **Un solo CTA en el primer tercio del largo, no solo al final** | **3 de 6 largos confirmados por el audio** lo ponen entre el 17 % (2:43), el 33 % (8:36) y el 35 % (4:51) [F]; de los otros 3, uno no tiene y dos no se confirmaron. Ninguno lo deja solo para el final **[corregido: no se pudo confirmar el CTA del 74 % ni el del segundo 8]** | **D01-C (YouTube del mar-13)**: un solo recurso en el minuto 2 a 3 ("la asesoría gratis está en mi perfil") y la repetición al final. Los 2 cortes verticales de ~45 s salen sin CTA hablado, solo el cartel del perfil, como hace Hormozi en todos sus shorts |
| 6 | **Una regla con nombre propio en cada pieza** | Cada pieza de Hormozi trae una (Lista de Grandes Ideas, regla 1-1-1, 4-4-4, tres baldes, pantano, Grand Slam) | Los guiones D01-A, D02-A, D04-C: ponerle un nombre de 2-3 palabras a la receta ("la regla de los tres modelos") y usarlo también como palabra clave de Avisos. Mismo nombre en la comunidad |
| 7 | **Caso de un dueño real con cifras, con permiso escrito, como contenido** | `Which One`, `This Could 2X`, el parque: casos con cuentas en pantalla | **Asesorías gratis (decisión del 8-oct)**: grabar con permiso las sesiones, mínimo 15 min por caso, y de cada una salen 1 largo y 3-5 cortes. Hoy no hay casos: es lo que más rinde a futuro y no cuesta horas extra |
| 8 | **Filtro honesto en la puerta**: preguntar facturación y tamaño antes de la llamada | Taller: "si no ganaste con lo gratis, no vengas"; "bajo 250 mil todavía no" | Formulario de la asesoría (`sergiourcullo.vercel.app/llamada`): rubro, profesionales, mensajes por día. Alinea con las 5 preguntas de `ONIA_CLIENTE_IDEAL.md`. No cobra nada |
| 9 | **Credencial verificable en un cartel inferior, 0:20 a 0:24, en los largos** | Largo 2: "fundador, USD 250 M+" | D01-C: cartel con nombre y UNA línea que sea verdad hoy (por ejemplo, "Onia Platform en producción"). Sin cifras de clientes ni ingresos |
| 10 | **Subtítulo en la costura de la pantalla dividida**, 1-3 palabras, karaoke | 4 de 4 shorts con split [F, cuadros]; en plano completo van a ~75 % de la altura | Ya es el molde Santiago. Se confirma, no se cambia. La **clave de color** no es "palabra importante" sino quién habla (fila 11) |
| 11 | **Color del subtítulo por hablante**: amarillo para el otro, blanco para él; cuando cita al otro, vuelve al color del otro | `Which One`, `This Could 2X`, `Why Feel Stuck`, `Should I Kill` [F, cuadros: 4 de 4 con dos personas en pantalla] | Asesorías grabadas (fila 7) y cualquier reel con pregunta de un cliente. En la paleta de Sergio Urcullo: **el otro en verde, él en blanco**. Se hace con HyperFrames al armar los subtítulos por hablante; en piezas de un solo hablante no aplica |
| 12 | **Ritmo en tres tramos en el short de diálogo**: cortes cada ~3 s mientras se plantea el caso, **un tramo largo sin cortes (~25 s) para la regla**, y cortes cada ~1,5 s al cierre | `Which One` [F]: 28 cortes, con 0 cortes entre 41 y 67 s; `This Could 2X`: 42 cortes en 106 s | Ediciones de N07 y DD-A: dejar la parte de la regla en un plano sin cortes y acelerar los últimos 20 s. Medible: se verifica con `ffmpeg select=gt(scene,0.35)` antes de publicar |
| 13 | **Apertura del largo con cifras grandes, una nueva cada 1 a 1,5 s en los primeros 5 s**, en amarillo sobre su cara | Largo `jfW6gL6hKhk` [F, cuadros 0 a 5 s]: 5 cifras en 5 s, 17 cortes en el primer minuto (umbral 0,35) | **D01-C**: abrir con 3 cifras verificables (precio por millón de tokens de la página oficial, costo de 1.000 mensajes), **no con cifras de estatus**. Color: verde sobre blanco o negro, no amarillo |
| 14 | **Pegatina animada sincronizada con la palabra de la analogía** (3 a 4 en un short de 45 s) | `The Price You Charge...` (41 mil, el solo que más rinde) [F, cuadros]: pan y moneda pixel-art, sin rótulo, subtítulos de 1-3 palabras | N07: pegatina de cuaderno cuando dice "cuaderno" (analogía de la caché). Se arma con la capa de stickers de HyperFrames; probar en una sola pieza antes de volverlo molde |

---

## 6. Qué NO se copia y por qué

| No copiar | Por qué |
|---|---|
| **Cifras de estatus** (venta de empresa por USD 46,2 M, USD 16 M en un fin de semana, 21 M de seguidores) | Sergio Urcullo tiene cero clientes pagando. Fabricar prueba rompe la regla "no fabricar". La prueba de Sergio es la cuenta del guion y la pantalla real |
| **Cartel rojo** | La paleta es verde, blanco y negro (`PLAN-REFERENTES.md`). Se copia la función (rótulo fijo con el problema), no el color |
| **Taller de USD 5.000 y Vantage de USD 36.000** | Piden dueños de USD 1 M+. El cliente ideal (clínica dental de Santa Cruz, 2-6 profesionales) no entra, y Onia vende software, no horas ni membresía |
| **Marcación automática e IA a los leads en el formulario del roadmap** | Riesgo legal y de confianza en Bolivia. Ya figuraba en `REFERENTES-ECOSISTEMA.md` |
| **Libros gratis con envío, prueba de Skool, "Business Backpack"** | Es un embudo de producto físico en Estados Unidos. Además no pude confirmar que siga vigente |
| **Mentalidad y riqueza general (37 % de su catálogo)** | Ensancha audiencia pero no vende software a una clínica. La marca de Sergio es IA para negocios en Bolivia |
| **Producción de estudio**: 3 puntos de luz, tiras de LED, micrófono dinámico, b-roll 4K | Sergio graba solo, teléfono en trípode, solapa. La energía visual viene de la edición, no del set |
| **Shorts de evento** | Dependen de un taller con público y un equipo de camarógrafos. Sergio no tiene evento todavía; la versión suya son las asesorías grabadas (punto 7) |
| **Volumen de 5-6 shorts por día + ~300 piezas semanales de terceros [NV]** | Lo sostiene un equipo. El plan de Sergio ya son 4 reels + 1 carrusel por día, con él solo |
| **Autoridad prestada** (Elon, Buffett, Trump) como gancho | Sirve a quien ya tiene público. Para Sergio la autoridad prestada es la fuente primaria (la página de precios de Anthropic, el comunicado), mostrada en pantalla |
| **Vocabulario y humor de Hormozi** (groserías, "bro", el chiste de la charla) | Sergio habla en voseo de Bolivia y a las clínicas Onia les habla de usted; la voz propia es lo que no se copia |
| **El conteo de cortes de Gemini como meta** | Gemini contó la mitad de los cortes reales en 2 shorts y dijo 52 cortes en un minuto en un largo. Usar las cifras medidas con ffmpeg (sección 4) y medir cada pieza propia antes de publicar |
| **Estimaciones del rinde de IA** | El tema IA, solo, rinde bajo la mediana en su canal (319 mil contra 364 mil). Sergio lo empaqueta como resultado de negocio, no como novedad de modelo |

---

## Fuentes

| Qué | URL | Fecha de lectura |
|---|---|---|
| Canal, largos | https://www.youtube.com/@AlexHormozi/videos | 2026-10-08 |
| Canal, shorts | https://www.youtube.com/@AlexHormozi/shorts | 2026-10-08 |
| Feed RSS del canal | https://www.youtube.com/feeds/videos.xml?channel_id=UCUyDOdBWhC1MCxEjC46d-zw | 2026-10-08 |
| Videos analizados | `uWdIgftpvBI`, `UDBkiBnMrHs`, `jfW6gL6hKhk`, `xRxVpjeHmeA`, `XsWSvz-aewA`, `SCi464zfAUM` (largos); `57_uoyn15_w`, `Ww2jHydeZSE`, `xZU5gLIdieY`, `uvP4IWau3N4`, `KqoGxw1eC0k`, `EQHJqh6KAIo` (shorts); segunda pasada: `fX46y0tF1C8`, `ex_ABJpFrqs`, `7zQBF82ZGOk`, `HGbSB4LI9Ww`, `Jphf8aggSpE` (shorts) en `youtube.com/watch?v=` y `youtube.com/shorts/` | 2026-10-08 |
| Home de Acquisition.com | https://www.acquisition.com | 2026-10-08 |
| Taller (USD 5.000, filtros) | https://www.acquisition.com/workshop | 2026-10-08 |
| Roadmap (30 s, consentimiento) | https://www.acquisition.com/roadmap | 2026-10-08 |
| Vantage (USD 36.000, invitación) | https://vantage.acquisition.com | 2026-10-08 |
| Libro Money Models (USD 29,99) | https://shop.acquisition.com/products/100m-money-models | 2026-10-08 |
| Análisis de canal de un tercero (julio 2026) | https://alpha.outlierkit.com/resources/alex-hormozi-growth-strategy/ | 2026-10-08 |
| Docs previos del repo | `hermes-content/references/marca-personal/PLAN-REFERENTES.md`, `REFERENTES-ECOSISTEMA.md`, `FORMULAS-REFERENTES.md`, `FICHAS-MONTAJE-REFERENTES.md`, skill `edicion-referentes`, `hermes-content/docs/cola/plan-3-semanas/CALENDARIO-PUBLICACION-9-16-OCT.md` y `GRABAR-10-16-OCT.md` | 2026-10-08 |

**Pendiente (después de la segunda pasada):** (1) listar TikTok e Instagram con la sesión de la madre: sigue sin dato propio de esas dos redes
y sin ningún carrusel; (2) medir el audio (música y SFX) de los shorts bajados, que no se midió; (3) bajar y medir 1 largo más de cada formato
(monólogo sobrio `UDBkiBnMrHs`, consultoría `xRxVpjeHmeA`) con el cliente `android` de yt-dlp, y confirmar con fotogramas si el cartel de roadmap del minuto 21
del parque existe; (4) normalizar las vistas de los largos por antigüedad (el RSS solo trae los 15 últimos videos; las fechas de los largos siguen relativas);
(5) la oferta vigente de "libros + prueba de Skool" no se confirmó y la frecuencia de ~300 piezas por semana y el 91 % de vistas desde Shorts siguen siendo [NV] de un tercero.
