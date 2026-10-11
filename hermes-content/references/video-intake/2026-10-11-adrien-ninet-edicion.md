# @adrien.ninet: 3 reels más (6 y 7-oct), edición medida y cómo no deja aire
Recepción: 2026-10-10 (pedido de Sergio Urcullo; el link ya estaba en la ficha del 10-oct) · Análisis: 2026-10-11 (descargas del 10-oct a las 23:2x, hora de la PC) · Tipo: 3 videos de TikTok de `@adrien.ninet` (la misma cuenta que el IG)
Fuente: https://www.tiktok.com/@adrien.ninet/video/7693977785286593824 (A1, 7-oct), https://www.tiktok.com/@adrien.ninet/video/7693911876538764576 (A2, 7-oct), https://www.tiktok.com/@adrien.ninet/video/7693495938874133793 (A3, 6-oct). Instrucción de Sergio Urcullo: «seguí aprendiendo a editar… quiero que sigas viendo a Erik Taveras y el que te pasé su link, cómo editan» (literal; la madre confirmó que «el que te pasé su link» es `@adrien.ninet`; es para aprender, no para producir)
Acceso: parcial. Los 3 MP4 de TikTok se bajaron y se miraron; **no** son los originales de IG: A1 está a 576x1024 (396 kbps) y A2/A3 a 720x1280 (218 y 168 kbps), así que colores y tipografías son menos fiables que en la ficha del 10-oct. El perfil de IG no se pudo listar: `yt-dlp` contesta «Unsupported URL» a `instagram.com/adrien.ninet/reels/`; no se inició sesión · Sesión/carril: subagente de la madre v2 (worktree `onia-madre-v2-pr-review-2d85bb`), carril edición/marca personal

Etiquetas: **observado** (visto en cuadros o medido con ffmpeg), **declarado** (lo dice el autor o los metadatos), **inferencia** (mía, sin verificar), **propuesta** (para Onia). Colores = muestreo de cuadros, **aproximados** por la compresión.

## Qué había y qué es nuevo

- Ya medido el 10-oct (`2026-10-10-ig-adrien-ninet.md`): 4 reels de IG (`DeUZJC6g-g1`, `DeUP_JBz1IC`, `DeSFD-XzDqc`, `DeO7DugISSR`) y la receta «Receta Adrien» (candidata). Se listaron los 12 TikToks más nuevos: **los 3 más nuevos (10, 10 y 9-oct; 53, 46 y 42 s) coinciden por duración y tema con R1, R2 y R3 de IG** (inferencia: no se comparó cuadro por cuadro) y se saltaron. R4 (28 s) no está entre los 12.
- Se estudian los siguientes tres sin duplicar (IDs de TikTok, ninguno citado en el repo): A1, A2 y A3.
- **Sin estudiar** (misma cuenta, 3-5 oct): `7693269459594792225` (67 s), `7692869074505780513` (33 s), `7692487290194545953` (35 s), `7691802024106528032` (15 s).

## Cobertura y límites

- Qué se miró: hojas a 2 fps con el segundo impreso (A1 4 hojas, A2 6, A3 4), 12 cuadros a 4 fps de los primeros 3 s, cortes con `scene` a 0,30 y 0,20, `silencedetect=-35dB:d=0.3`, `ebur128`, huecos entre palabras con Whisper small (en inglés), muestreo de color en 3 cuadros.
- **Whisper atrasa el final de las palabras hasta 0,4 s:** los huecos entre palabras son cotas mínimas.
- **`silencedetect` no sirve en Adrien:** el 5 % de las ventanas más calladas (25 ms) de sus 3 reels está en -31,9 a -33,9 dB RMS, contra -46,5 a -56,9 dB en los de Erik. No hay silencio digital en ninguna parte. Puede ser una cama (música o ambiente) o una edición sin una sola pausa; **no se escuchó**. Por eso aquí el aire se mide por huecos entre palabras.
- Los metadatos de TikTok dicen «original sound» en los 3 (**declarado**): no prueban ni descartan una cama.
- Vistas y likes (TikTok, 3-4 días): A1 1.383 / 66, A2 1.963 / 78, A3 951 / 64 con 57 guardados (6,0 %, contra 2,3 % y 1,7 %). No validan ninguna regla; en IG la cuenta rinde mucho más (R4: 6.019 likes).
- Terceros: A2 usa el video de otra persona en el gancho y memes de películas; A1 usa una escena de una serie. No identificados ni copiables.

## Números por pieza (observado)

| Pieza | Duración | Cortes duros (0,30) | Por 10 s | Plano medio / mediano / más largo | Capas nuevas (conteo a mano en hojas de 2 fps, ±2) | Palabras/s | Hueco máx. entre palabras | `silencedetect` | LUFS |
|---|---|---|---|---|---|---|---|---|---|
| A1 `7693977785286593824` («reconstruí mis 3 sitios con Claude Code») | 43,88 s | 14 | 3,2 | 2,93 / 2,12 / 8,00 s (31,88-39,88: cara cerca y luego pantalla grabada en tarjeta con su cámara en PIP, sin corte duro) | ~1 cada 2,2 s | 3,60 | 0,56 s (a 11,3 s) | 0 | -16,4 |
| A2 `7693911876538764576` («¿cloná tu voz con 3 s de audio, gratis?») | 64,81 s | 16 (+5 suaves a 0,20) | 2,5 (3,2 con las suaves) | 3,81 / 2,04 / 9,80 s (10,56-20,36, pantalla grabada) | ~1 cada 2,5 s | 3,13 | 0,56 s en su voz; 1,38 / 1,54 / 2,24 s son audio de la demo | 0 | -14,7 |
| A3 `7693495938874133793` («tu app puede costarte 250.000 $», prompt) | 36,29 s | 5 (1,04; 3,52; 5,20; 8,48-8,60 es UN destello de 4 cuadros; 33,56) | 1,4 | 6,05 / 2,60 / **25,08 s** (8,60-33,56) | tarjeta nueva cada ~2,5 s | 3,63 | 0,32 s (a 28,9 s) | 0 | -14,9 |

## Aire muerto: Adrien no deja pausas (observado)

Base de la **regla 15** de `edicion-referentes`, junto con la ficha de Erik del mismo día (`2026-10-11-erik-taveras-edicion.md`).

| Pieza | Huecos ≥0,3 s entre palabras | por 10 s | Hueco máx. | Suma de huecos ≥0,2 s |
|---|---|---|---|---|
| A1 | 5 | 1,3 | 0,56 s | 2,9 s (7,3 % del habla) |
| A2 | 12 (3 de ellos de 1,4 a 2,2 s son la demo; 2 más de 0,50 y 0,56 s) | 1,9 | 0,56 s en su voz | 11,2 s (17,3 %, de los cuales ~5 s son demo) |
| A3 | 1 | 0,3 | 0,32 s | 2,0 s (5,5 %) |

- **Su voz nunca pasa de 0,56 s de hueco**, y en A3 de 0,32 s. Cuando A2 «calla» 1,4 a 2,2 s, lo que suena es la muestra de la voz clonada y en pantalla hay una **tarjeta con la onda de audio** (26,7-28,1 s, 35,5-37,0 s y 53,6-55,9 s; el clip de 40,1-45,5 s de una escena de película, con onda, también). Es decir: el hueco ES la prueba. (El audio no se escuchó: se infiere por la onda en pantalla y porque Whisper transcribe palabras en esos tramos.)
- **Cómo evita el aire dentro de la voz:** algo nuevo cada ~2,2-2,5 s (A1 ~2,2, A2 ~2,5, A3 ~2,5), y en A3 la cara sigue **25,08 s sin un corte de cámara** porque una tarjeta de multa nueva y la línea de prompt tecleada cambian 10 veces en esos 25 s (8,6 a 33,6 s). Cuadros: `img/2026-10-11-adrien-ninet-sued-hoja.png` (0-12 s) y las hojas del 8,6 al 33,6 s.
- **Cierre sin silencio:** A1 y A3 terminan con la voz en la última frase y el CTA ya escrito; A2 termina en su cara con «not really.» (sin CTA).

## Edición segundo a segundo (observado)

### A3 `7693495938874133793` (6-oct, 36,3 s): tarjetas de multa + prompt + cara

- **0-1,0 s:** cara, **píldora de una palabra** al centro del pecho (~49 % del alto: «Your», «vibe», «coded», «app»), voz desde 0,0 s.
- **1,0-3,4 s:** corte a una tarjeta vertical (imagen de IA de un mago con laptop) sobre lienzo gris claro #E8E8E8. Titular «can get *sued* for a», con «sued» en **serif itálica grande**, y un **contador que corre de 1 a 250 000 $ en ~1,5 s** (1,0 a 2,5 s), números rojos #E80002 aprox. 3,0-3,4 s zoom de la tarjeta.
- **3,5-5,0 s:** b-roll de una persona con la mano en la frente; «before it makes a single *sale.*» con la clave en serif itálica.
- **5,2-8,4 s:** lienzo negro con la estrella de Claude brillando y la palabra «Claude»; la cara en la mitad de abajo con la costura en degradado. **8,48-8,60 s:** un destello de 4 cuadros (transición).
- **8,6-33,56 s: el bloque central.** Tres franjas: **tarjeta blanca arriba (0-39 % del alto)** con «Invoice label / Fine / (per unit)», **barra de prompt en medio (~39-48 %)** con la instrucción que se teclea letra por letra, **cara abajo (~49-100 %)**. 10 tarjetas en ~25 s (una cada ~2,5 s): la cifra de cada multa entra con un contador de 0,3-0,5 s («11» → «53 088 $») y la tarjeta anterior se borra con desenfoque. Sin un solo corte de cámara.
- **33,56-36,29 s (CTA):** corte a la cara **más cerca** (zoom de salto, a ojo ×1,4-1,8 contra el plano de la franja, no medido) con «Comment “SUED” and I’ll send you the prompt» tecleado y «full prompt», «in your dm’s» en serif itálica. Dura 2,7 s (7 % de la pieza).

### A1 `7693977785286593824` (7-oct, 43,9 s): cara + capas de lienzo claro

- **0-1,8 s:** cara, píldora al pecho (~56-60 % del alto en los primeros 2 s y ~61 % a 12 s). «something» y «**changed**» (serif itálica grande) entran a 1,0-1,7 s.
- **1,84 s:** corte a una ilustración vectorial azul marino #132A4C (stock) con el subtítulo al pie. **3,28 s:** lienzo #FDFDFD con dos chips de logo («Claude Fable 5», «GPT-6 Astra») y sus rótulos en gris. **6,32 s:** b-roll oscuro de cine. **8,04 s:** cara con «compared to the *previous model(s)*» en sans bold grande. **9,72 s:** velocímetro blanco con aguja animada («wasn’t speed») y **11,0 s** diana con «it was *accuracy.*» (serif itálica).
- **12-16 s:** cara con una tarjeta de sitio web arriba, la cabeza **sobresale por encima del borde** de la tarjeta (recorte de persona). **15,92 s:** cara más cerca con subtítulo de 2 líneas en sans bold.
- **19,4 s:** lienzo blanco con 3 tarjetas de sitios que se abren y «using:» + dos logos. **24,44-26,4 s:** meme de una serie en tarjeta redondeada. **26,56 s:** pantalla grabada con cursor. **31,88 s:** cara muy cerca con «Do you even need design skills anymore?» en 2 líneas.
- **34-39,9 s:** pantalla grabada en tarjeta con su cámara en PIP abajo a la derecha; la cabeza grande sobre la tarjeta.
- **39,88-43,88 s (CTA):** tarjeta gris con «Check the full video on **YouTube** @adrienaidesigner» (3,9 s, 9 % de la pieza); abajo la pantalla grabada en marco redondeado y su cámara en PIP.

### A2 `7693911876538764576` (7-oct, 64,8 s): reacción + demo en pantalla

- **0-4,2 s: layout de reacción.** Su cara **grande ocupa el cuadro** (mira hacia abajo, mirando el clip); un **rótulo off-white de esquinas redondeadas con «Is this true?» en serif itálica** a ~44-56 % del alto (aparece a 0,25-0,5 s); abajo (~56-97 %), una **tarjeta con el video de otra persona** (con sus propios subtítulos «Someone on GitHub just made», «ElevenLabs», sellos «COMPLETELY FREE» y «ENTIRELY ON YOUR LAPTOP»). 4,52 s: corte a su cara con «Alright!» grande; 5,5-7,0 s «it actually *works.*» (serif itálica).
- **6,56-20,4 s:** README de GitHub, página del producto, pantalla de la app con su cara debajo, zoom animado a la lista de idiomas (14-17 s, ~1 s por zoom), tabla de descargas, cursor.
- **Demos de voz:** tarjeta con una foto y la onda de audio mientras suena la muestra: 26,7-28,1 s, 35,5-37,0 s, 40,1-45,5 s (clip de película), 53,6-55,9 s (video de un auto que se transforma).
- **58,24-64,8 s:** cara sin capas (6,6 s) hasta el final, con la píldora a ~62 % del alto. Sin CTA.

## Qué se aprende por dimensión

| Dimensión (las 12) | Hallazgo | Evidencia/localizador | Estado de evidencia | Regla transferible y límite | Skill destino + sección |
|---|---|---|---|---|---|
| Patrones | (1) cara + prueba que cambia cada ~2,5 s sin cortar la cara (A3, 25,08 s); (2) reacción a un clip ajeno (A2, 0-4,2 s) ya vista en R1 (2 de 7 reels); (3) contador que corre en el gancho (A3 1,0-2,5 s); (4) el hueco de la voz se llena con la prueba sonora (A2) | A3 8,6-33,6 s; A2 0-4,2 s y 26,7-28,1 s; A3 1,0-2,5 s | observado (6 reels de UNA cuenta: candidatos) | Probar cada uno en una pieza antes de volverlo molde | `edicion-referentes`, «Receta Adrien» |
| Colores y paleta | Lienzos #FDFDFD, #E8E8E8 y #132A4C; números rojos ~#E80002; texto casi negro | Muestreo en A1 a 2,6 y 20,0 s; A3 a 2,0 s | observado, aproximado (TikTok recomprimido) | Para Onia: lienzo blanco #FFFFFF y UN objeto verde #10C26B por cuadro, no el rojo | `diseno-contenido-onia` (propuesta) |
| Tipografía | Sans bold para el cuerpo; **serif itálica** en la palabra clave del titular («sued», «changed», «accuracy.», «full prompt»); serif itálica también en el rótulo «Is this true?» | A3 1,5 s; A1 1,5 y 11,0 s; A2 0,5 s | inferencia (grotesca y serif sin identificar) | Mantener el doble registro de la ficha del 10-oct; familia a decidir en `diseno-contenido-onia` | `diseno-contenido-onia` (pendiente) |
| Edición y montaje | 3,2 / 2,5 / 1,4 cortes duros por 10 s; plano mediano de 2,0-2,6 s; capa nueva cada ~2,2-2,5 s; **0 pausas ≥0,6 s en su voz** | Tabla de números | observado y medido | **Regla 15 (aire muerto)**. Los cortes duros por 10 s bajan a 1,4 cuando hay una tarjeta que cambia sola: «capas, no cortes» (regla 3) | `edicion-referentes`, reglas 3 y 15 |
| Estilo visual | Tarjetas flotantes de esquinas redondeadas con sombra sobre lienzo claro; cámara en PIP redondeado en las demos; cabeza que sobresale de la tarjeta (A1 12-16 s) | A1 12-16 y 34-39 s | observado | Ya está en la receta (ficha del 10-oct); A1 confirma el recorte de persona. Sin cambio | `edicion-referentes`, «Receta Adrien» |
| Estructura de contenido | A3: dolor con cifra (0-3,4 s) → herramienta (5-8 s) → 10 pares «multa + instrucción» (8,6-33,6 s) → CTA (33,6 s). A1: giro (1,8-12 s) → proceso (12-39 s) → «ver el largo» (39,9 s). A2: duda → prueba paso a paso → 3 demos → veredicto | Hojas a 2 fps | observado | Lista de N pares «costo → instrucción» con el prompt que se teclea es transferible a una pieza de Onia con costos y prompts **verificados por Onia**; las multas de Adrien son sus claims (A3) y no se citan | `edicion-referentes`; `onia-ventas-pauta` (si es pauta) |
| Guion y gancho | A3: «Your vibe-coded app can get sued for a quarter of a million dollars before it makes a single sale» en 0,0 s (el dolor con una cifra). A2: «Someone on GitHub just made 11 Labs completely free» sobre un clip ajeno | Whisper 0,0-4 s | observado | Coincide con la regla 1. No copiar claims ni cifras | `edicion-referentes`, regla 1 (ya existe) |
| Idioma y tono | Inglés, primera persona, calmo, vocabulario de diseño y de producto | Transcripts | observado | Marca personal = vos; producto y clientes = usted. No se traslada | `diseno-contenido-onia` (sin cambio) |
| UI y UX | Demos de pantalla con cursor, zoom animado de ~1 s al elemento y tarjeta de descargas; el cursor lleva la mirada | A2 6,5-23 s | observado | Una demo de Onia se graba con cursor visible y zoom de ~1 s al elemento que se nombra | `onia-web-factory` (idea para el banco; no se adopta) |
| Frontend | No aplica | n/a | no aplica | n/a | n/a |
| Backend y arquitectura | No aplica. El prompt de A3 lista 10 prácticas de cumplimiento (por ejemplo «Turn on row-level security on every Supabase table»): es contenido del video, no se verificó | A3 12-33 s | declarado, no verificado | No citarlo como asesoría legal; cualquier cifra de multa en una pieza de Onia se verifica y se cita su fuente | n/a |
| Negocio y oferta | CTA «Comment “SUED”» con envío por DM (A3) y «Check the full video on YouTube» (A1); A2 sin CTA. Perfil: «AI Designer & Founder» | Pie de A3 (declarado); tarjetas 33,6 y 39,9 s | declarado (el DM no se probó) | En Onia el CTA es «Buscá PALABRA en Avisos», con recurso existente. No prometer comentario→DM sin prueba | `edicion-referentes` (CTA ya adaptado) |

## Qué se toma y qué NO (propuesta, sin copiar identidad)

**Se toma:**
- Aire: pausa ≤0,3 s entre frases; cuando hay prueba con sonido, el hueco es esa prueba con una onda en pantalla.
- Un bloque de 15-25 s «una tarjeta de prueba arriba + el prompt o la instrucción tecleada en el medio + la cara abajo», con la cifra de cada tarjeta entrando como contador de 0,3-0,5 s. Una tarjeta cada ~2,5 s y la cara sin cortes.
- Gancho con una cifra que corre (1,5 s) y la palabra clave en serif itálica.
- CTA en los últimos ~2,7 s con un zoom de salto sobre la cara y la clave en itálica.

**No se copia:** su cara, set, remera, micrófono, memes y clips de series o películas (derechos), el video de terceros del gancho de A2, sus multas, claims y prompts, el inglés, el rojo de los números y «Comment “SUED” → DM» (no probado en Onia).

## Incorporación

- 2026-10-11: **regla 15 «Aire muerto»** (compartida con Erik) agregada a `.claude/skills/edicion-referentes/SKILL.md`, y el bloque «Adrien, 3 reels más (11-oct)» al final de «Receta Adrien». La receta sigue **candidata**: ahora son 7 reels de una cuenta.
- Sin contradicción con decisiones de Sergio Urcullo. La propuesta «CTA dos veces» del 10-oct sigue **no adoptada**.
- Pendiente de `diseno-contenido-onia`: familia de la serif itálica y la píldora.

## Prueba de uso por sesión

Estado: incorporado (reglas en la skill; sin pieza aplicada)
Sesión + fecha: subagente de la madre v2, 2026-10-11
Tarea de cola: **Lucía G1 v2** (re-corte en curso por otro agente; ruta del artefacto la fija la madre). No se editó ese video.
Regla usada: «Edición y montaje», regla 15 (aire muerto) y «Adrien, 3 reels más» en `edicion-referentes`
Artefacto: ninguno todavía
Verificación: hojas a 2 fps del render de G1 v2 con algo nuevo cada ≤2,5 s, huecos ≥0,3 s por palabra ≤1 por 10 s, máximo 0,5 s. Revisor: la madre
Pendiente: aplicar en G1 v2 y registrar el resultado aquí.
