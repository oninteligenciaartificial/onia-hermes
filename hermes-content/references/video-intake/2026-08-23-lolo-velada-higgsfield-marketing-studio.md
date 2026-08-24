# Lolo en La Velada: el anuncio de IA cabe dentro de un móvil

**Fuente:** https://www.instagram.com/p/DcYNrdROAyg/ — @yvan.thecreator · "YVAN Y LOLO - CAPÍTULO 17" · partner `@higgsfield.ai` · `#HiggsfieldCreator`
**Tipo:** MIXTO — CUENTA un molde de marketing (episodio de serie con mecánica comentario→DM) y dentro MUESTRA una pieza hecha con IA. Las dos mitades se reproducen con herramientas distintas.
**Veredicto:** SIRVE_YA
**Cobertura:** 82 de 82 `base_*`, 40 de 40 `texto_*` (100%), verbatim de 503 palabras. Cifras de ritmo medidas por mí con ffprobe/ffmpeg sobre el mp4, no estimadas.

---

## Que muestra, textual

### Del caption (recuperado, literal)

> Comenta "COMBATE" y Lolo te envía el adelanto de la pelea contra Paredes 🥊🐰
>
> Y el enlace para crear tu cuenta en Higgsfield y usar Marketing Studio: eliges plantilla, le metes tu producto y te saca el anuncio hecho. Sin prompts, sin cámara, sin estudio.
>
> YVAN Y LOLO - CAPÍTULO 17 🐰🍻
>
> @higgsfield.ai #HiggsfieldCreator

### Del audio (recuperado, literal, lo que importa)

El bloque de venta, íntegro (t≈50–67 s), en boca del conejo:

> "¡Pero si eres tú, retrasada!" / "Bueno, en verdad no es nadie." / "Está hecho con Marketing Studio de Higgs[field]." / "Metes tu producto y salen unboxings, reseñas, anuncios, fotos de catálogo y hasta contenido UGC." / "Sin cámara, sin agencia y sin rodar, nada." / "Mi peluche lo vende una tía que no existe y vende más que yo, la cabrona."

El recordatorio a mitad de acto (t≈111–122 s):

> "…os recuerdo rápidamente que tenéis más información sobre Marketing Studio de Higgs[field] en la descripción, capullos. Con esto, por fin, parecéis una tienda de verdad y no un puto puesto del mercadillo, cabranazos."

El CTA (t≈144–163 s), en boca del comentarista:

> "Y a los que comentéis la palabra COMBATE en esta publicación, Lolo os va a pasar por privado un adelanto de su combate contra Paredes." / "¡Y escuchadme, cabrones! Al que resuba este capítulo a sus historias, le mando el vídeo de la borrachera que me pegué con Anuel y bad gyal en el camerino…"

### Del texto en pantalla (recuperado, literal)

| Dónde | Qué dice |
|---|---|
| Lockup fijo, esquina sup. der., los 164 s | `HIGGSFIELD` sobre chip lima + `MARKETING STUDIO` debajo |
| Firma fija, esquina sup. izq. | `@YVAN.THECREATOR` + glifo de conejo, opacidad baja |
| Camiseta del peluche (todo el film) | `3% ALGODÓN` / `97% COJONES` |
| Camisetas del equipo | `TEAM LOLO` / `ALGODÓN Y MALA HOSTIA` |
| Pantalón de boxeo | `LOLO` (cinturilla) / `HOY LLORA PAREDES` |
| Camiseta de la fan | `I ♥ LOLO` |
| Espalda del peluche-merch | `LOLO` |
| Cartel de backstage | `LA VELADA DEL AÑO VI` \| `ARTISTAS` |
| Cuerdas del ring / mosca | `InfoJobs` · `#LAVELADA6` |
| Subtítulo del CTA | **`COMBATE`** en VERSALES — único trozo en mayúsculas de toda la pista |
| Placa de negro final | `cabrones` · `a sus historias` · `anuel y bad gyal` · `agradecido` |

### Dónde el fotograma le gana a Whisper

Regla del carril aplicada: si el audio y la pantalla discrepan en un nombre, gana la pantalla. Aquí discreparon cuatro veces.

| Whisper transcribió | El fotograma escribe | Dónde |
|---|---|---|
| "Pat y Allen" | **bad gyal** | `base_080`, placa negra |
| "Higgsville" | **Higgsfield** | lockup permanente + subtítulo `base_059` |
| "Kailon Musk" | **Elon Musk** | subtítulo `base_016` |
| "Ibaipa Cantal" | **Ibai** | subtítulo `base_043` |

---

## Como esta hecho — la reconstruccion

### Lo primero, porque la versión anterior lo dijo al revés

**El conejo no es IA. Es un traje/peluche físico, filmado.** Camina por una alfombra roja real de La Velada del Año VI, rodeado de fotógrafos con flashes reales, vallas, confeti en el suelo, prensa acreditada con lanyard, y una fan real que le acerca un rotulador por encima de la valla. La luz, la profundidad de campo y el grano del pelo son de cámara, no de generador.

Lo que **sí** está retocado digitalmente (inferido, no dicho en ninguna parte): en los primeros planos de backstage (`base_063`, `_064`, `_066`, `_068`, `_069`) la cara del peluche tiene **ojos con pupila, cejas y sincronía labial**; en los planos de alfombra roja (`base_002`, `_004`, `_010`…) la misma cabeza es un peluche estático con gafas de sol fijas y una boca que solo abre. Son dos tratamientos distintos de la misma cabeza. La lectura razonable es traje práctico + cara animada encima en los primeros planos. **Ninguna herramienta se nombra para esto** ni en pantalla, ni en caption, ni en audio.

### Lo segundo: el anuncio de IA es un plano dentro del plano

La pieza generada con IA **cabe dentro de la pantalla de un móvil que una fan sostiene a cámara**. Es un clip vertical de una chica desempaquetando el peluche LOLO de una caja de cartón, con la misma camiseta `I ♥ LOLO`, con chrome de Stories alrededor (barra de progreso arriba, iconos de corazón/comentario abajo). Aparece en `base_024`–`base_033`.

Lo que el propio guion dice de ella: *"en verdad no es nadie"*, *"una tía que no existe"*. **El vídeo declara su IA en voz alta y la convierte en el chiste.** No la esconde.

Eso es todo el material generado que hay en 164 segundos: un clip de unboxing, en pantalla ~11 s. No hay "40 tomas generadas".

### Lo tercero, y esto es lo que hay que robar: el ritmo

Medido por mí, no estimado (`ffmpeg select=gt(scene,0.35)` sobre el mp4):

| Métrica | Valor **medido** |
|---|---|
| Duración | 163,81 s (2:44) |
| Formato del archivo | 960×720 (4:3), h264, 30 fps, 840 kbps |
| Cortes detectados | **48** → uno cada **3,41 s** de media |
| Hueco entre cortes | media 3,23 s · mín 0,07 s · máx **11,60 s** |
| Sonoridad | −14,3 LUFS integrado, LRA 10,1 LU |
| Negro final | 153,43 → 163,67 s = **10,23 s** |

Y ahora el hallazgo, que solo aparece al medir:

**Los dos planos más largos del film, sin cortar, son los dos momentos en que el film pide algo.**

- **11,1 s** sin cortar (38,97 → 50,03 s): el montaje del reveal. La fan saca el móvil, y la cámara **no se mueve** mientras el producto entra en cuadro.
- **11,6 s** sin cortar (141,83 → 153,43 s): el CTA entero. El comentarista dice "comentéis la palabra COMBATE… os va a pasar por privado un adelanto" en **un solo plano fijo**, señalando a cámara.

El resto del vídeo corta cada ~3 s. La atención se gana con corte rápido; **la petición se cobra parando el corte.** El espectador siente el frenazo aunque no sepa por qué. Ese contraste (3 s de media contra 11,6 s de golpe) es la palanca, no la duración absoluta.

Y remata con **10,23 s de negro puro con solo subtítulo**, para la segunda oferta ("resube a historias y te mando el vídeo de la borrachera"). Sin imagen que compita. El 6,2% final del film no tiene nada que mirar: solo la oferta.

### El molde de guion, segundo a segundo

| Tramo | Función |
|---|---|
| 0–18 s | **Gancho por fricción social.** Dos personajes discutiendo de dinero y yates. Cero producto. Cero marca en boca. |
| 18–28 s | Se planta el conflicto de la serie (el combate contra Paredes). Es el gancho del CTA final, sembrado 2 minutos antes. |
| 28–43 s | **Incidente:** una fan le pide firmar un peluche de sí mismo. Conflicto emocional real, no publicitario. |
| 43–50 s | El plano largo. El móvil entra en cuadro. |
| **50–67 s** | **La venta.** 17 s. El producto se explica en el mismo tono grosero que el resto: no cambia de registro para vender. |
| 67–110 s | Se abandona la venta por completo y se vuelve a la trama (camerino, invitados, escenario). |
| 111–122 s | **Segundo toque**, 11 s, con el beneficio traducido a insulto: *"parecéis una tienda de verdad y no un puto puesto del mercadillo"*. |
| 122–142 s | Vuelta a la trama (el vendaje, la piedra en el guante). |
| **142–153 s** | **CTA en plano fijo.** Palabra clave en VERSALES. |
| 153–164 s | Negro + segunda oferta (resubir a historias). |

Dos observaciones que valen dinero:

1. **La marca se nombra dos veces en 164 s** (t≈54 y t≈118). Un 17% del metraje total es venta. El 83% restante es una serie de comedia que se sostiene sola.
2. **El beneficio nunca se dice en lenguaje de producto.** No dice "ahorra en producción". Dice *"mi peluche lo vende una tía que no existe y vende más que yo"* y *"parecéis una tienda de verdad"*. Estatus y vergüenza, no eficiencia.

### Verificado en vivo: lo que promete el conejo, existe

El conejo lista: *"unboxings, reseñas, anuncios, fotos de catálogo y hasta contenido UGC"*. Consulté los presets de Marketing Studio con nuestra propia cuenta (lectura, sin gasto) y salen **26**. La frase mapea 1:1 contra slugs reales:

| Lo que dice el conejo | Preset real |
|---|---|
| unboxings | `ugc_unboxing`, `ugc_unboxing_asmr`, `ugc_unboxing_virtual_try_on`, `reboxing` |
| reseñas | `ugc_selfie_testimonial`, `ugc_direct_to_camera` |
| anuncios | `tv_spot` |
| fotos de catálogo | `product_showcase` |
| contenido UGC | `ugc` |

El clip del móvil tiene exactamente la forma de `ugc_unboxing`. No es una promesa de marketing: es la lista de plantillas.

---

## El estilo, como conocimiento portable

**Tipografía.** Subtítulo quemado en sans grotesca pesada, blanco puro, con filo oscuro fino para legibilidad sobre pelo claro. Sin caja ni banda de fondo. Trozos de 2–4 palabras, una línea, nunca dos. Caja baja de frase en todo el film **salvo la palabra clave del CTA, en VERSALES** (`COMBATE`). Un solo cambio tipográfico en 164 s, reservado para lo único que se pide. Posición: centrado abajo, línea base a ~91% de la altura del cuadro (leído en píxel, aproximado). El lockup de marca es condensada negra sobre chip lima, con una segunda línea minúscula debajo.

**Paleta** (extraída con `palettegen` del propio mp4; los valores de material filmado son **aproximados**, los de gráfico son limpios):

- Campo dominante, cálido, en todo el film: `#8C7064`, `#AA8D7F`, `#CFBCB3`, `#E1D7D7`, `#B79E94` — es literalmente el pelo del conejo. La textura del protagonista *es* la paleta.
- Lima de marca (gráfico, lectura limpia): **≈`#C9E253`**. Único color saturado permanente.
- Azul frío de patrocinio: `#0F2B66`, `#192F63`, `#161B2F` — **aparece solo en la escena del CTA**. Dos mundos de color: cálido para la historia, frío para la petición.
- Rojo carmesí del merch (`TEAM LOLO`, cinturilla): leído a ojo sobre tela filmada, no pude aislar una muestra limpia. **Aproximado, sin hex fiable.**

**Composición.** La altura de cámara es el chiste: baja a la rodilla para el peluche de 60 cm y sube al hombro para los humanos, alternando. El peluche casi siempre va **centrado y de frente**, con piernas humanas cortadas a ambos lados enmarcándolo. Pantalla dentro de pantalla: el móvil vertical 9:16 sostenido dentro del cuadro 4:3, con el chrome de Stories visible (es lo que lo hace creíble como "algo que alguien te enseña", no como un anuncio insertado). Bloque de gran angular/ojo de pez para el número del estadio.

**Ritmo (medido).** 48 cortes / 163,81 s = uno cada 3,41 s. Media entre cortes 3,23 s, mín 0,07 s, máx 11,60 s. Dos planos largos de ~11 s, ambos sobre una petición. Negro final de 10,23 s. Audio a −14,3 LUFS con LRA 10,1 (rango dinámico ancho: los gritos pegan).

**Motion.** Cámara en mano siguiendo al peluche desde atrás y al costado. Transiciones duras; los dos huecos de 0,07 s son dobles detecciones sobre un mismo latigazo/flash. Órbita de ojo de pez en el estadio. **El CTA es lo único bloqueado en trípode.** El movimiento se apaga cuando se pide.

**Textura.** Fibra de peluche en macro contra hormigón, asfalto, acero de flight case y confeti pisado. Todo el film tiene una sola identidad táctil.

**Se porta a:**
- `web-factory/docs/MOTION_PATTERN_BANK_2026.md` → alta del patrón **"parar el corte sobre la petición"**, con las cifras medidas como umbral: mediana ≤3,5 s y un único plano ≥3× la mediana encima del CTA.
- `.claude/skills/editor-videos/` → especificación de subtítulo (2–4 palabras, 91% de altura, sin caja, versales solo en la palabra clave) y regla de placa negra final para la segunda oferta.
- `hermes-content/references/video-intake/` → esta ficha.

---

## Las tres preguntas

**1. ¿Qué frente nuestro toca?**
Contenido y marketing, y de lleno. Toca (a) el motor de contenido y el molde de guion de marca, (b) la mecánica **comentario→DM**, que ya tenemos **viva y probada en producción desde el 18-ago** — el circuito de Instagram funciona y no hace falta ManyChat, y (c) la cuenta de Higgsfield. Colateralmente toca `editor-videos`, porque el hallazgo de ritmo es una regla de corte, no una idea.

**2. ¿Con qué herramienta NUESTRA se reproduce?**
- El molde de guion y el CTA → skills `copywriting` / `ads`.
- El corte y los subtítulos quemados → skill `editor-videos` + HyperFrames (motor oficial desde la decisión del 21-ago; Remotion está jubilado).
- El comentario→DM → el circuito ya cableado, no hay que construirlo.
- El bloque UGC de producto → Higgsfield Marketing Studio, **verificado hoy: 26 presets alcanzables desde nuestra cuenta**, `ugc_unboxing` incluido.

**3. ¿Qué falta para hacerlo hoy?**
Para el molde de guion, el corte y el CTA: **nada**. Se puede hacer esta semana con lo que ya está encendido.
Para el bloque UGC: solo el gasto por render, que es permiso caso por caso según la regla — pero es **un** render, no cuarenta. Listar plantillas ya está hecho y no costó nada.
Lo que **no se porta** y hay que decirlo sin rodeos: el acceso a un evento como La Velada, el traje físico y los invitados famosos. Eso no se compra con créditos. Lo que sí se porta es el **método**: un personaje propio y recurrente, la venta en el mismo registro que el contenido, y la petición encima del único plano que no corta.

---

## Lo que NO se puede afirmar

- **Qué modelo, motor o pipeline anima la cara del conejo.** No se dice en pantalla, ni en el caption, ni en el audio. Que hay dos tratamientos distintos de la misma cabeza es observación mía sobre los fotogramas; que uno sea "traje + cara digital" es **inferencia**, no dato.
- **Con qué preset exacto se generó el clip del móvil.** El audio nombra el producto ("Marketing Studio"), no la plantilla. Que se parezca a `ugc_unboxing` es lectura mía.
- **Cuántas generaciones costó ese clip.** No se dice en ningún sitio. Cualquier número sería inventado.
- **La identidad de las personas en cuadro.** El audio dice "Lamín" (probablemente Lamine) y "Anuel"; la placa negra escribe `anuel y bad gyal`. Ningún fotograma nombra al chico de la alfombra roja. Tomo los dos nombres que la pantalla escribe y **no confirmo** al resto.
- **Si el 4:3 (960×720) es el formato publicado o un artefacto de la descarga.** Es lo que mide el archivo que tengo; no puedo distinguirlo desde aquí. La URL es de publicación de feed (`/p/`), no de reel, lo cual es coherente, pero no lo prueba.
- **Los hex de material filmado.** `#8C7064`, `#CFBCB3`, `#0F2B66` y el rojo del merch salen de píxeles de vídeo comprimido bajo luz de evento: **son aproximados** y no sirven como valor de marca. El único hex con lectura decente es la lima del lockup (≈`#C9E253`), y aun así viene de un gráfico recomprimido.
- **Rendimiento.** Cero datos de alcance, comentarios o conversión. Que el molde funcione es hipótesis, no resultado.

---

## Que cambio respecto de la primera version

CORREGIDO, y es la corrección que importa: la mascota NO es generada por IA. Es un disfraz/peluche físico filmado en la alfombra roja real de La Velada del Año VI, entre fotógrafos, vallas y público reales. Por eso el bloqueo que inventé la vez pasada ("permiso de gasto por más de 40 tomas generadas") no existe: no hay 40 tomas generadas: hay UNA pieza UGC de Higgsfield mostrada dentro de la pantalla de un móvil, ~11 s de los 164.
CONFIRMADO: diálogo continuo en español de España, ahora con las 503 palabras delante (vosotros: "comentéis", "tenéis", "escuchadme"; "coño", "capullo", "hostia").
NUEVO gracias a cruzar audio contra fotograma: Whisper degradó cuatro nombres y el fotograma los corrige — "Pat y Allen"→**bad gyal**, "Higgsville"→**Higgsfield**, "Kailon Musk"→**Elon Musk**, "Ibaipa Cantal"→**Ibai**.
NUEVO por medición propia: el corte más largo sin cortar del film (11,6 s) cae exactamente encima del CTA. Eso no lo podía ver sin medir.
