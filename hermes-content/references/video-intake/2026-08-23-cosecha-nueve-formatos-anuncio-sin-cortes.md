# Nueve formatos de anuncio en 9,8 s sin un solo corte

- **Fuente:** https://www.instagram.com/p/DblhPOux1YP/ · @davidaistar
- **Tipo:** MIXTO (MARKETING dominante + IA)
- **Veredicto:** SIRVE YA
- **Cobertura:** 44 de 44 fotogramas leídos (100%): 5 `base_*` (uno cada 2 s) y los 39 `texto_*` (muestreo denso 4/s). Se recuperaron los 9 rótulos y el caption completo. **No se pudo leer el audio**: el sujeto habla durante todo el clip y Speaches falló para el lote entero.

## Que muestra, textual

**Card fijo, arriba, presente los ~8,5 s con overlay (verbatim):**

> 9 Ad Formats Every Ecom Brand Needs

**Los 9 rótulos, verbatim y en orden (RECUPERADOS, están escritos en pantalla):**

1. `1) Claymation`
2. `2) Zach-D`
3. `3) Fake Podcast`
4. `4) Skeleton Story`
5. `5) Hyper Motion`
6. `6) Singing Story`
7. `7) Pixar Character`
8. `8) Crochet`
9. `9) Disney Character`

**Subtítulos quemados DENTRO de los insets (verbatim, lo que alcancé a leer):**

- Inset 2 (Zach-D): `the bloodstream.` · `it puts strain`
- Inset 3 (Fake Podcast): `have you seen all these celebrities` · `shooting themselves up with nad plus`
- Inset 4 (Skeleton Story): `IS` · `MAN'S` · `FAT` · `HAPPENS` (una palabra por fotograma, mayúsculas)
- Inset 8 (Crochet): `wife said my creatine was the reason`

**Caption (verbatim):**

> Comment "skill" for my skills + swipe file

**Stickers fijos a la derecha del inset, los 9 ítems, sin moverse:**
carpeta naranja rotulada `SKILL.MD` + cuadrado redondeado salmón con un asterisco blanco (la marca de Claude).

**Qué se ve en cada inset (descripción de lo que MIRÉ, no del prompt):**

| # | Rótulo | Lo que muestra el inset |
|---|---|---|
| 1 | Claymation | Stop-motion de plastilina: hombre sirviendo una tetera en una cocina de arcilla, verde azulado + terracota |
| 2 | Zach-D | Explainer anatómico sobre grilla azul: gato gris con el sistema circulatorio expuesto, hombrecito 3D señalando |
| 3 | Fake Podcast | Mujer con vincha, lentes y micrófono rosa frente a una biblioteca — encuadre de set de podcast |
| 4 | Skeleton Story | Cuerpo anatómico translúcido y dorado con panza, fondo azul plano |
| 5 | Hyper Motion | Diagrama explotado de un perfume que se ARMA por capas: Mist → Floral Notes → Fragrance Oil → Essence → Bottle |
| 6 | Singing Story | Personaje 3D estilo Pixar: mujer rubia con lentes redondos cantando en un micrófono vintage sobre escenario |
| 7 | Pixar Character | Escena 3D en un museo: mujer de vestido rosa y hombre de esmoquin señalando |
| 8 | Crochet | Todo tejido a crochet: cocina, pareja en la mesa, tarro de CREATINE |
| 9 | Disney Character | Frasco rojo de producto antropomorfizado como personaje musculoso y enojado, parado sobre un cuero cabelludo |

## Como esta hecho — la reconstruccion

Hay que separar dos capas, porque el post enseña una y esconde la otra.

### La capa que SÍ se ve: el molde del reel (MARKETING) — mecanismo completo

**El dato duro que manda todo: 0 cortes en 9,866 s** (medido con ffmpeg, umbral scene 0.3). Es **una sola toma continua** del presentador. Todo el ritmo del video —y es un ritmo brutal, 9 ítems en menos de 10 segundos— se produce **sustituyendo overlays encima de un plano que nunca corta**. No hay edición de video: hay composición.

La pila, de arriba hacia abajo, es fija durante todo el clip:

1. **Card de título anclado arriba** (~15% desde el borde superior). Rectángulo blanco de esquinas redondeadas, texto negro, dos líneas. **No cambia nunca.** Es el contrato con el espectador: "son 9, vas a llegar al 9". Es lo que sostiene la retención sin necesidad de un gancho hablado.
2. **El presentador en toma continua**, tercio superior-medio, a cámara todo el tiempo.
3. **Rótulo `N) Nombre`**, blanco con contorno negro duro, sin caja, centrado, justo encima del inset.
4. **Inset 9:16 dentro de 9:16**, ~35% del ancho, con el ejemplo REPRODUCIÉNDOSE (no es una captura fija: los subtítulos quemados avanzan entre fotogramas).
5. **Dos stickers estáticos** en la columna derecha del inset: la carpeta `SKILL.MD` y el asterisco de Claude.

Tres detalles del mecanismo que son los que hacen que funcione:

- **Las manos gesticulan a ambos lados del inset y pasan POR DETRÁS de él.** El inset está compuesto encima del plano, sin máscara. Eso es lo que hace que el conjunto se lea como una sola imagen viva y no como un collage.
- **La espátula roja de silicona usada como micrófono falso.** El plano real es gris industrial + remera negra: cero saturación. La espátula es el ÚNICO color saturado del encuadre y está en el centro exacto, tapando la boca. Es el ancla de mirada y cuesta cero producir.
- **Los últimos ~1,3 s se limpian TODOS los overlays** (verificado en `base_005` y `texto_005_04` a `_07`): desaparecen el card, el rótulo, el inset y los stickers, y queda la cara sola. Es la señal visual de "acá viene el pedido". El CTA es hablado y no se transcribió.

**Duración por ítem:** ≈0,9–1,0 s por rótulo — **derivado** de los 9,866 s medidos menos el cierre limpio, NO medido rótulo por rótulo. El muestreo denso **sugiere** que los tiempos **no son uniformes**: el ítem 5 (Hyper Motion) aparece en 5 fotogramas de texto y el ítem 1 en 2. Tiene sentido de oficio —el inset 5 es un build por capas y necesita tiempo para leerse— pero el muestreo se disparó por peso de jpg, no por reloj, así que esto es **sugerido, no medido**.

**La mecánica de conversión:** comentario → DM. El caption pide una palabra exacta (`skill`) a cambio de dos objetos ("my skills + swipe file"). Los stickers `SKILL.MD` + asterisco de Claude están en pantalla los 9 ítems: el CTA se ve antes de que se pida.

### La capa que NO se ve: cómo se hizo cada uno de los 9 (IA)

**Esto es lo que el post retiene a propósito, y es exactamente el producto.** No se nombra ningún modelo, ninguna herramienta, ningún prompt, ninguna cantidad de generaciones. Ni en pantalla ni en el caption. El post entrega la **taxonomía** (los 9 nombres) y esconde la **receta**. Juzgado como contenido de IA es flojo: no enseña a hacer nada. Juzgado como forma es excelente. Se juzga por los dos ejes y sale ganando por el segundo.

Lo único que sí regala —y vale— es que **los 9 formatos tienen nombre**. Un nombre convierte un estilo difuso en una unidad de producción pedible: "hacé un Crochet de esto" es una orden ejecutable, "hacé algo tejido" no lo es.

### Advertencia que hay que dejar escrita

**5 de los 9 nombres se apoyan en IP o en estilo ajeno:** `Pixar Character`, `Disney Character`, `Zach-D` (que el nombre refiera a un creador es **inferido** del estilo del inset — el video no lo explica), y los insets 6 y 7 son estilo Pixar sin decirlo. Onia no puede publicar material de cliente que imite marcas de estudios. De los 9, los portables sin riesgo son: **Claymation, Fake Podcast, Skeleton Story, Hyper Motion, Crochet**. Además, 6 de los 9 insets venden producto físico de ecommerce (suplementos, perfume, creatina, producto capilar): el molde del REEL se porta entero, la lista de formatos no se porta entera.

## El estilo, como conocimiento portable

**Tipografía** — tres tratamientos distintos y deliberados:
- *Card de título*: grotesca muy pesada, negro sobre blanco, dos líneas, interlineado apretado, centrada, con padding generoso dentro de un rectángulo de esquinas redondeadas. Es la tipografía "default bold" del ecosistema TikTok/CapCut usada sin disfraz.
- *Rótulo del ítem*: mismo peso pero terminaciones más redondeadas, **relleno blanco con contorno negro duro de ~3–4 px, sin caja**. La ausencia de caja es lo que lo deja flotar sobre el pecho del presentador sin tapar la cara.
- *Subtítulos de los insets*: blanco con sombra leve. El inset 4 usa **una palabra por fotograma en mayúsculas** (`IS` / `MAN'S` / `FAT` / `HAPPENS`), los insets 2, 3 y 8 usan frases en caja baja.

**Paleta (hex APROXIMADO — leído de una pantalla, no muestreado del archivo original):**
- Fondo real (persiana metálica / panel industrial): `#8E9490` → `#B8BCB8`
- Remera del sujeto: `#111111`
- **Espátula roja (el único saturado del plano real): `#E03A2F`**
- Card: fondo `#FFFFFF`, texto `#000000`
- Sticker carpeta: `#E8952A` → `#F0A030`
- Sticker Claude: `#D97757` con asterisco `#FFFFFF`
- Los insets aportan TODA la variedad cromática: verde azulado `#2E9B8A` (claymation), azul de grilla `#1E5FA8` (Zach-D), crema `#F2E4D8` (perfume), dorado `#E8A62C` (skeleton).

La disciplina de la paleta es la lección: **el plano anfitrión es deliberadamente desaturado para que los insets sean lo único que grita.** Cada inset cambia el color de la mitad inferior de la pantalla cada segundo — eso es el "movimiento" percibido, sin mover nada.

**Composición:** tres bandas horizontales fijas y estables — card arriba / cara al medio / rótulo + inset abajo — con una columna derecha reservada a los stickers. La cara nunca queda tapada. El inset ocupa la mitad inferior y las manos entran por los dos costados. Nada se reposiciona en todo el clip: **la única variable es el CONTENIDO de la banda inferior.**

**Ritmo:** 0 cortes medidos. ≈0,9–1,0 s por ítem (derivado). Duraciones aparentemente desiguales, dando más aire al inset que más tarda en leerse (sugerido por el muestreo). Cierre de ~1,3 s con la pantalla limpia.

**Motion:** ninguno en los overlays. No hay entrada, salida, fade ni escala en el rótulo ni en los stickers: es sustitución dura. Todo el movimiento viene de (a) los insets, que son videos con vida propia, y (b) las manos y la cabeza del presentador. El único inset con animación de construcción por capas es el 5.

**Textura:** cero grano, cero filtro, cero LUT. Cámara de teléfono, luz de ventana dura, fondo real con desenfoque suave. La textura la ponen los insets: arcilla, lana tejida, grilla 3D, vidrio.

**Se porta a:**
- `web-factory/docs/MOTION_PATTERN_BANK_2026.md` — patrón nuevo: **"listicle sobre toma continua"** (0 cortes, overlay sustituido, card ancla, cierre limpio).
- `hermes-content/references/video-intake/` — esta ficha.
- Skills `hyperframes-core` + `editor-videos` — la composición es HTML puro: card fijo, rótulo con `-webkit-text-stroke`, inset `<video>` posicionado, stickers estáticos. Es exactamente lo que HyperFrames renderiza sin esfuerzo.

## Las tres preguntas

1. **Frente:** dos, y en este orden.
   **(a) editor-de-videos** — el molde del reel es una plantilla de composición reutilizable y es lo único que se puede ejecutar HOY sin gastar un peso.
   **(b) marketing + INFLUENCERS IA** — la taxonomía de 9 formatos es un shot-list de producción, y la mecánica comentario→DM ya la tenemos viva.

2. **Herramienta nuestra:**
   - **HyperFrames** (`.agents/skills/`, motor instalado y probado, Apache 2.0) + skill **`editor-videos`** para la plantilla del reel. La skill **`captions-overlay`** para los subtítulos quemados.
   - **Catálogo Higgsfield** (`models_explore`, `presets_show`, `show_marketing_studio`) para cruzar cuáles de los 5 formatos portables ya tienen preset y no hay que reconstruir a mano.
   - **Circuito comentario→DM de Instagram**, que está VIVO y probado en producción desde el 18-ago. La mecánica del caption se porta tal cual; lo único que cambia es el objeto: nosotros mandamos **la demo en cal.onia.com.bo**, no un PDF ni un swipe file (decidido 2026-08-23).

3. **Qué falta:**
   - Para la plantilla del reel: **NADA.** HyperFrames está instalado, probado y es el motor por defecto. Se hace hoy.
   - Para producir los 9 formatos con IA: **permiso explícito de gasto de Sergio**, caso por caso. La generación en Higgsfield es paga y la regla es tajante.
   - Una **decisión de Sergio**: cuáles de los 5 formatos limpios sirven para vender software B2B a un dueño de negocio boliviano. 6 de los 9 insets venden producto físico de ecommerce; el molde se porta entero, la lista no.

## Lo que NO se puede afirmar

- **Qué modelo o herramienta generó cada uno de los 9 insets: no se dice.** Ni en pantalla ni en el caption. Cero nombres de modelo, cero herramientas.
- **Qué prompt se usó para ninguno de los 9: no aparece ninguno.** El post nombra los formatos y esconde las recetas — ese es el producto que vende.
- **Qué dice el presentador.** Habla durante los 9,866 s completos y el audio **no se transcribió** (Speaches devolvió "fetch failed" para los 26 del lote). El CTA final es hablado sobre pantalla limpia y no lo oí. Todo lo de esta ficha sale del texto en pantalla y del caption.
- **Que el swipe file sean skills de Claude Code: INFERIDO.** Lo verificable es que la carpeta dice literalmente `SKILL.MD` y que el segundo sticker es el asterisco de Claude. Que el entregable sean archivos `.md` de skills es una inferencia razonable, no un dato.
- **Que "Zach-D" refiera a un creador concreto: INFERIDO** del estilo del inset (grilla azul + anatomía + hombrecito 3D señalando). El video no lo explica.
- **La duración exacta de cada rótulo.** El muestreo denso se disparó por peso de jpg, no por reloj, así que la desigualdad de tiempos entre ítems es **sugerida, no medida**. Lo único medido es: 9,866 s, 292 fotogramas, 30 fps, 720×1280, 0 cortes.
- **Cuántas generaciones costó cada inset, ni qué se hizo fuera del generador.** No hay ninguna pista.
- **Cualquier dato de rendimiento** (vistas, comentarios, conversión del lead magnet): no hay una sola cifra en pantalla ni en el caption.
