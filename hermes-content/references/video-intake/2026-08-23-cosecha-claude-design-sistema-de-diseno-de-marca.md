# Claude Design: cargar la marca una vez y que todas las piezas salgan alineadas

- **Fuente:** https://www.instagram.com/p/DbZHuAuIDhh/ · @vison.studios
- **Tipo:** MIXTO (contenido = IA/herramienta · forma = MARKETING/carrusel · el output que exhibe es WEB)
- **Veredicto:** SIRVE YA
- **Cobertura:** 6 de 6 láminas leídas (s01-s06). Caption completo. Carrusel estático → sin audio, no aplica transcripción. Hex de s03 y formulario de s02 verificados con recorte ampliado. NO legible: el cuerpo de texto de los mockups de s04 y las 11 miniaturas de s06 (por debajo de ~8px).

---

## Que muestra, textual

**Caption (entero):**
> Paso a paso de como usar @claudeai para marcas 📝

**s01 — portada**
> Cómo usar
> **CLAUDE DESIGN**
> para marcas
>
> @vison.studios

(Logo "VS." arriba centrado, con un punto rojo. Barra de progreso de 6 segmentos al pie, primer segmento activo.)

**s02 — paso 1**
> **Armá tu diseño en Figma**
> Subí el logo, colores, imágenes y recursos de tu marca a un solo archivo de Figma. Después lo exportás en .fig y listo.

Captura de UI dentro de la lámina (texto literal, recuperado con zoom):
> **Set up your design system**
> Tell us about your company and attach any design resources you have.
>
> Company name and blurb (or name of design system)
> *e.g. Mission Impastabowl: fast-casual pasta restaurant with in-store touchscreen kiosk, mobile app and website*
>
> **Provide examples of your design system and products** (all optional)
> What works best: code and designs for your design system and your code products.
>
> **Link code from GitHub** — `https://github.com/owner/repo` [Add]
> **Link code from your computer** — requires Chrome or Edge
> This doesn't upload the whole codebase; Claude will copy selected files. For large codebases, we recommend attaching a frontend-focused subfolder.
> **Upload a .fig file** — Drop .fig here or <u>browse</u>
> Parsed locally in your browser — never uploaded. <u>Learn how to get a .fig file</u>
> **Add fonts, logos and assets** — Drag files here or <u>browse</u>

(Flecha manuscrita apuntando a la tarjeta. Sticker del icono de Figma rotado, mordiendo el borde derecho.)

**s03 — paso 2**
> **Convertilo en un sistema de diseño**
> Claude Design lee tu archivo, saca las imágenes, tipografías, medidas y recursos y te arma un sistema de diseño completo.
>
> Entrás a Claude Design, creás un Sistema de Diseño nuevo, subís tu Figma y le das a Generar.

Output exhibido (marca demo "UNCENTERED SYSTEMS"), texto legible dentro del mosaico:
> El logotipo expresa **equilibrio dentro del desbalance**, un guiño directo al concepto de "uncentered".
> UNA PALETA QUE COMBINA **TONOS NEUTROS Y ACENTOS VERDES** QUE REPRESENTAN CRECIMIENTO Y EFICIENCIA.
> VERDE OSCURO · VERDE PRINCIPAL · CREMA · BLANCO
> COLORES: HEX 0D1C10 · HEX 242D25 · HEX 005D30 · HEX FFFCF5 · HEX FFF0AF · HEX 005D30
> HEADLINE / Subheadline / TITLE / Paragraph
> IMAGENES

**s04 — paso 3**
> **A partir de ahí, Claude diseña por vos**
> Con el sistema de diseño listo, cada pieza nueva que genera sigue la misma linea, sin importar el formato.
>
> *Por ej. una Landing Page* (anotación manuscrita con flecha)

Legible dentro del mockup de landing:
> LABORATORIO DE DESARROLLO WEB3 · EQUILIBRIO DENTRO DEL DESBALANCE · Solicitar demo · Ver producto · Precisión técnica · Simplicidad visual · Alto rendimiento · UN SISTEMA, TODAS LAS PIEZAS ALINEADAS. · CASOS DE USO · PERSONAS DETRÁS DEL SISTEMA. · CONSTRUYAMOS EL PRÓXIMO SISTEMA JUNTOS.

**s05 — paso 4**
> **Ciento de piezas para redes, en minutos**
> Posteos, anuncios, todo lo que necesitas. 100% alineado a tu marca, sin que tengas que revisar cada detalle.

6 posts generados, texto legible:
> WEB3 DEVELOPMENT LAB / BALANCE WITHIN THE UNCENTERED
> WHAT WE BUILD / Extensible, high-performance Web3 applications — where complexity is *translated into simplicity.*
> ENGINEERED TO LAST / PERFORMANCE, BY DESIGN
> The idea / COMPLEXITY INTO SIMPLICITY
> BUILT ON FOUNDATIONS / STRUCTURE MEETS CALM
> EXTENSIBLE BY DEFAULT (chips: Modular · High-throughput · Audited)

**s06 — cierre**
> **Y te diseña hasta una presentación**
> Claude te arma la presentación completa, con tu identidad aplicada de punta a punta.

Legible dentro del deck (11 diapositivas en el panel izquierdo):
> LABORATORIO DE DESARROLLO WEB3 · UNCENTERED SYSTEMS · Aplicaciones Web3 extensibles y de alto rendimiento, donde la complejidad se traduce en simplicidad. · COMPANY OVERVIEW

(Sticker del icono de Claude rotado, mordiendo el borde. Sexto segmento de la barra activo. **No hay CTA de cierre**: la última lámina termina en el beneficio, sin pedir nada.)

---

## Como esta hecho — la reconstruccion

Dos mecanismos distintos, y el post vale por los dos.

### A) El mecanismo de la HERRAMIENTA (lo que enseña) — recuperado del formulario, no inferido

Claude Design no toma un prompt de estilo. Toma **insumos de marca** y de ellos deriva el sistema. El formulario declara exactamente cuatro puertas de entrada, y son alternativas, no obligatorias (dice "all optional"):

1. **Texto**: nombre de la empresa + blurb ("Company name and blurb").
2. **Código desde GitHub**: URL del repo.
3. **Código local**: requiere Chrome o Edge; copia archivos seleccionados, no el repo entero — recomienda una subcarpeta de frontend.
4. **`.fig`**: se parsea *localmente en el navegador, nunca se sube* (esto lo dice la UI, literal). Más "fonts, logos and assets" por drag.

El paso Figma que el post presenta como obligatorio (s02: "Armá tu diseño en Figma… lo exportás en .fig y listo") **no lo es**: es una de cuatro entradas. Vison eligió esa porque su audiencia es de diseñadores. Ese es el punto más importante de la ficha para nosotros — ver "Qué falta".

Después: crear Sistema de Diseño nuevo → subir el insumo → Generar. La salida (s03) es un mosaico de tarjetas: rationale del logotipo, construcción del logomark, paleta con hex nombrados, escala tipográfica (HEADLINE/Subheadline/TITLE/Paragraph), mockup de aplicación y grilla de imágenes. Desde ahí, cada pieza nueva hereda: landing (s04), posts (s05), deck de 11 diapositivas (s06).

El mecanismo real es **sistema de diseño como memoria persistente**: se paga el costo de la coherencia UNA vez y después cada generación lo hereda, en vez de re-describir la marca en cada prompt. Eso es lo reproducible, no la herramienta.

### B) El mecanismo del CARRUSEL (la forma) — esto es lo que se copia línea por línea

Estructura de 6, sin grasa:

| Lámina | Función | Palabras de título |
|---|---|---|
| s01 | Portada — promesa + nombre de la herramienta gigante | 5 |
| s02 | Paso 1 (insumo) + evidencia = UI real del producto | 5 |
| s03 | Paso 2 (transformación) + evidencia = el output completo | 5 |
| s04 | Paso 3 (aplicación 1: web) | 6 |
| s05 | Paso 4 (aplicación 2: social) | 6 |
| s06 | Paso 5 (aplicación 3: deck) — cierra en beneficio | 6 |

Reglas que se cumplen en las 6 sin excepción:
- **Una lámina = un título de 2 líneas + una bajada de 2 líneas + UNA evidencia visual grande.** Nunca tres bloques de texto.
- **La evidencia siempre es una captura real**, nunca un ícono ni una ilustración. La credibilidad la carga la captura, no el copy.
- **Escalada de formato**: sistema → web → social → deck. Cada paso cubre un formato distinto para que el lector encuentre el suyo.
- **El fondo es UNA sola fotografía continua** que corre a través de las 6 y se va oscureciendo. Es lo que hace que se lea como una pieza y no como 6 posts.
- **Barra de 6 segmentos al pie**, con el activo en blanco y más largo. Retención: le decís cuántas faltan.
- **Cero CTA.** Ni "comentá X", ni link, ni "guardá". El post apuesta todo al guardado espontáneo. Para nosotros eso es un defecto a corregir, no a copiar.
- **Cero estado de obra**: no dice "beta", "muy pronto" ni "en construcción" en ninguna de las 6. Cumple nuestra regla sin proponérselo.

---

## El estilo, como conocimiento portable

**Tipografía** — pareja de dos + una tercera de anotación:
- *Display*: serif de alto contraste tipo Didone/editorial moderna, condensada, con remates afilados y ascendentes largos ("Convertilo en un sistema de diseño"). Familia INFERIDA: gama PP Editorial New / Reckless / Canela — **el post no nombra ninguna fuente**.
- *Body*: grotesca neo-grotesque light, tracking neutro, 2 líneas máximo. INFERIDA (gama Helvetica Now / Neue Haas Light).
- *Portada*: rompe la regla — "Cómo usar" y "para marcas" van en una geométrica **bold** con 'a' redonda de doble piso (gama Poppins/Sofia Pro, INFERIDA), sandwicheando el serif gigante. El sandwich sans-bold / serif-display / sans-bold es el truco de portada.
- *Anotación*: script manuscrito casual para "Por ej. una Landing Page" (s04) — es lo único que suena a persona.

**Paleta** — se lee de una pantalla, así que **hex aproximados, muestreados píxel a píxel**:
- Fondo (foto virada sepia, degradado claro→oscuro): `#C8B191` alto claro → `#A27031` ocre medio → `#5D411C` → `#261704` → `#130F03` esquina inferior derecha.
- Texto crema (medido en el trazo del título, s01): `#F4F0D7`.
- Acento rojo mínimo en el punto del logo "VS." (muy pequeño, INFERIDO).
- ⚠️ **La paleta verde de s03-s06 NO es del carrusel**: es la marca demo Uncentered Systems, y sus hex están ESCRITOS en pantalla — `0D1C10`, `242D25`, `005D30`, `FFFCF5`, `FFF0AF`. No confundir el estilo del contenedor con el del contenido.

**Composición**: título alineado a la izquierda con sangría, sin centrar (solo la portada centra). Título ocupa el tercio superior, bajada debajo, evidencia visual en el 55-60% inferior. Firma `@vison.studios` centrada al pie + barra de 6 segmentos. Las tarjetas blancas flotan sobre el fondo oscuro con radio grande (~16-20px) y sombra difusa amplia.

**Ritmo**: 6 láminas, 1 idea cada una, títulos de 5-6 palabras. Densidad constante — ninguna lámina es más pesada que otra, lo que evita el bache de scroll a mitad de carrusel.

**Motion**: es estático, así que el movimiento está **congelado en la textura**. Motion blur direccional real (barrido diagonal ~15-20°) sobre un ave en vuelo. No se reproduce con `filter: blur()` — eso da desenfoque isotrópico. Se reproduce con blur direccional (larga exposición, o `feGaussianBlur` con `stdDeviation="18 2"` sobre un grupo rotado, o motion blur en el render). El sticker de app rotado ~-10° con sombra propia mordiendo el borde de la tarjeta (Figma en s02, Claude en s06) es micro-detalle de alto retorno.

**Textura**: grano fotográfico fino sobre todo el fondo; superficies de tarjeta blanco puro sin textura, para máximo contraste con el fondo sucio. Ese contraste sucio/limpio es lo que hace que las capturas se lean como "producto real" y no como decoración.

**Se porta a:**
- `hermes-content/brand/tokens.css` — hoy sólo tiene una sans para display y otra para body (`Space Grotesk` / `Inter`). Falta la pareja serif-display + la variable de fondo-fotográfico-continuo.
- `web-factory/docs/MOTION_PATTERN_BANK_2026.md` — patrones "sticker de app rotado que muerde el borde", "barra de progreso de N segmentos" y "blur direccional como textura de fondo".
- `hermes-content/references/ui-patterns/carrusel-fondo-continuo/` — el patrón de fondo único que atraviesa N láminas.

---

## Las tres preguntas

1. **Frente:** dos, y en este orden.
   - **web-factory (principal)**: crear el Design System de Onia en claude.ai/design, para que landing, propuestas, carruseles y decks dejen de re-describir la marca en cada prompt.
   - **marketing (secundario)**: el molde de carrusel de 6 láminas, con el CTA que a Vison le falta.

2. **Herramienta nuestra:** existe y está conectada. **`DesignSync`** (tool cargado y funcional: `list_projects` / `create_project` / `finalize_plan` / `write_files`) escribe directo en un proyecto de sistema de diseño de claude.ai desde archivos locales. Complementos: skills `design-md`, `design-dna`, `brandkit`, `stitch-extract-design-md`, `image-to-code`, `impeccable`. Para el carrusel: el motor de render de carruseles que ya consume `tokens.css` + `hyperframes`.

3. **Qué falta:** **nada bloqueante — y menos de lo que el post sugiere.** No tenemos ningún `.fig` en el repo (`find -iname "*.fig"` = 0 resultados) y no hace falta: el formulario declara "all optional" y acepta código local, GitHub, o simplemente fuentes/logos/assets por drag. Ya tenemos los tres insumos: `hermes-content/brand/tokens.css` (9 colores + 2 familias tipográficas), `onia-logo-horizontal.svg` + `onia-logomark.svg`, y `hermes-content/brand/fonts/`. Sin gasto, sin credencial nueva, sin permiso. Único pendiente real: **decidir si el sistema se genera desde la marca actual o si primero se resuelve la pareja tipográfica** (hoy display y body son ambas sans; el post demuestra que el contraste serif/sans es lo que da aire).

---

## Lo que NO se puede afirmar

- **No hay audio** (carrusel estático de 6 imágenes), así que no hay nada dicho que verificar. Esto no es una limitación del lote: no aplica.
- **No se dice ninguna fuente**, ni la del carrusel ni la del sistema generado. Todas mis familias tipográficas son INFERIDAS de la forma de las letras.
- **No se muestra ningún prompt escrito.** Sólo el formulario vacío con sus placeholders. No hay prompt literal que recuperar de este post.
- **No se ve el paso intermedio** entre "le das a Generar" y el sistema terminado: no sabemos cuánto tardó, cuántas generaciones hicieron falta, ni si hubo iteración.
- **No se dice qué se hizo FUERA de la herramienta.** No sabemos si las tarjetas de s03, la landing de s04, los 6 posts de s05 y el deck de s06 salieron tal cual o fueron retocados/curados. Un carrusel muestra los aciertos, no la tasa de acierto.
- **No se dice si "Uncentered Systems" es un cliente real o una marca ficticia** armada para la demo. Ni si el resultado se usó en producción.
- **No se dice el plan, el precio ni si Claude Design requiere suscripción paga**, ni qué límites tiene.
- **No se dice cómo maneja el `.fig`** más allá de lo que declara la propia UI ("parsed locally in your browser — never uploaded"). Eso es una afirmación del producto, no algo que yo haya verificado.
- **No hay datos de rendimiento del post** (likes, guardados, alcance) en la captura.
- El texto de cuerpo de los mockups de s04 y las 11 miniaturas de s06 es **ilegible** en la captura — no puedo afirmar qué dicen esas piezas por dentro.
