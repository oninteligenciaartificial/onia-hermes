---
name: diseno-contenido-onia
description: "Invocar ANTES de hacer cualquier pieza visual de la marca personal de Sergio Urcullo o de ONIA (carrusel, portada, presentación de YouTube, miniatura, lámina, imagen para un video). Índice único del diseño de contenido. Imágenes en orden galería, Higgsfield (Sergio dicta Pixel), logo oficial, captura real. Pack referentes con temas verde, blanco y negro, patrones de los referentes, trampas ya pagadas y control de calidad."
---

# Diseño de contenido ONIA — el único lugar

## Vigente desde el 8–9 oct de 2026

- **Marca personal = `fotobn`: fotografía B/N con un solo objeto verde**, decisión del 8-oct; reemplaza `clay`/arcilla como estilo de salida. Las mediciones históricas de Soul y K1-B de abajo son diagnóstico, no el estilo vigente. Método: `hermes-content/docs/HIGGSFIELD_VIDEO_SYSTEM.md`.
- **Marca personal habla de vos; producto, anuncios y clientes de usted.** Para recursos de comunidad: «Buscá PALABRA en Avisos», comprobando que el recurso existe. No prometer DM por comentario.
- **9-oct: el render revisado se publica por el carril autorizado sin esperar otro OK de diseño.** Control visual y de claims sigue obligatorio. Gasto, contacto a terceros, actos legales y subir cara/voz a servicios externos conservan su autorización. Esta regla no amplía una tarea de Codex cerrada ni supera un bloqueo de permisos.
- Un enlace sin instrucción activa `aprender-de-todo`, no producción. Guardar principio + evidencia + destino; «aplicado» requiere artefacto y sesión que lo usó.

### Aprendizajes incorporados el 9-oct (aplicación pendiente de artefacto)

Fuentes bajo `hermes-content/references/video-intake/`:
- `2026-10-05-tiktok-ZSbm3Scje.md`, «Qué tomar»: titular de dos niveles (contexto chico + palabra dominante), serie numerada y datos reales que se arman. No inferir que UI/UX Pro Max está instalada ni copiar sus cifras como actuales.
- `2026-10-08-orquestacion-e-ingresos-5-posts.md`, §3–4: antes de animar, cargar identidad de marca; sincronizar apoyos con música cuando el molde la admita; evaluar efecto abierto con licencia antes de reutilizarlo. Carrusel de herramientas: una herramienta, nombre, función y captura real por lámina; ninguna instalación implícita.
- `2026-10-09-reel-DePBfHouarG.md`, «Qué aprende Onia»: jerarquía de una palabra; repetición visual con datos propios; dos columnas para comparar el mismo proceso; un tablero para explicar centralización sin atribuir funciones no probadas. El mosaico de cierre queda en `edicion-referentes`.
- `2026-10-09-cinco-archivos-antes-de-vibe-code.md`, «Qué toma Sergio Urcullo y qué NO»: nombre de entrada + función + prueba visible; una idea por lámina y documento propio legible. No duplicar reglas ni fabricar cinco archivos para seguir el titular del referente.

> Nace el 29-sep-2026. Sergio Urcullo: *«coloca tus skills de design, tus elementos y cómo lo
> hagas en un solo lugar, ordenados»*. Todo lo de diseño de contenido se entra por acá; los
> detalles viven en los archivos que este índice nombra, y no se copian a otro lado.

> **Alcance:** diseño de CONTENIDO (redes, YouTube, piezas de marca). La UI del PRODUCTO (el
> SaaS) no vive acá: `onia-platform/DESIGN.md` + skill `onia-frontend` de ese repo (acordado
> con la sesión de onia-platform el 29-sep).

> ⚠️ **8-oct-2026: la arcilla se jubila.** Sergio Urcullo eligió la opción 9 de la lámina de estilos: **foto editorial en blanco y negro
> con UN solo objeto en verde esmeralda** (`image_style: "fotobn"` en `scripts/carousel_images.mjs`, `--model gpt_image_2_5`,
> `params ["--quality","medium","--resolution","2k"]`, **1 cr por imagen**). Soul 2.0 inventó letras en 5 de 7 imágenes de
> arcilla. Prompt: describir la escena y decir cuál es «el objeto verde». Fuente completa: `HIGGSFIELD_VIDEO_SYSTEM.md` §
> «Higgsfield en la edición de la marca personal» (ya está en `main`). Todo lo de abajo que diga «arcilla»
> es el estilo anterior. Carruseles nuevos (P2, P3): `fotobn`. Los 7 carruseles en espera (K1, N02, K9, K12, K5, K13, K10)
> mezclan 10 imágenes flojas con 10 de arcilla que sí sirven: el lote en `docs/cola/plan-3-semanas/lote-14-imagenes.json` está
> en `fotobn` (14 cr) y falta que Sergio Urcullo decida si se rehace todo el carrusel en el estilo nuevo (+10 cr).

## La regla que ordena todo

**Las imágenes vienen de afuera; todo lo demás lo hace el código.** El texto, la tipografía,
los logos, las listas, las tablas y el armado de cada lámina salen de `scripts/`. Una imagen
generada NUNCA lleva texto (los modelos escriben mal; visto el 29-sep: «SANTA CUS BOVIA»
impreso en una taza y un post de Instagram falso con caption inventado).

## 1. De dónde sale cada imagen, en este orden

> ⚠️ Sergio Urcullo dicta por voz: **«Pixel» / «Hisfield» = Higgsfield.** El 29-sep lo leí como
> Pexels y corrigió. Las imágenes se GENERAN con Higgsfield (como las de los referentes, pero
> nuestras) y quedan en la galería para reutilizar.

| # | Fuente | Para qué | Cómo |
|---|---|---|---|
| 1 | **Galería propia** | Lo que ya tenemos | Buscá en `hermes-content/galeria/galeria.json` (tags, prompt) antes de generar |
| 2 | **Higgsfield** (generada) | Imágenes y metáforas visuales | `node scripts/carousel_images.mjs --brief <b> --out <dir>` cotiza; `--yes` genera dentro del permiso de §6 → `galeria/ilustraciones/` o `galeria/fotos/`. Marca personal: `fotobn` (8-oct); demás estilos solo para otros alcances autorizados |
| 3 | **Logo oficial** | Cuando se NOMBRA una marca | Claude/Claude Code/Anthropic: `hermes-content/references/brand-claude/` · n8n, OpenAI, Meta, Google, Gemini, WhatsApp: `hermes-content/references/brand-logos/`. Nunca recrear ni generar un logo |
| 4 | **Captura real** | Mostrar producto o pantalla | Captura de la pantalla real (layout `captura`), nunca una UI inventada |
| 5 | Pexels / Unsplash | Solo si hace falta una FOTO REAL con licencia (no generada) | `python scripts/marca-personal/buscar-objetos.py --fuente pexels --sin-recorte --galeria --objeto nombre="consulta"` |
| ⛔ | Google / Pinterest | — | Una foto ajena sin licencia no se publica. Google solo para el kit de prensa OFICIAL de una marca |

Calidad mínima: 1.800 px en el lado largo (Higgsfield 2k). La galería guarda JPEG ≤ 2048 px.

## 2. Qué pack y qué layout

> ⛔ **La pauta de Onia Platform NO va por acá.** Sergio Urcullo, 2-oct: *«es diferente el contenido de la onia
> platform que el de mi cuenta personal»*. Los anuncios del producto se arman con el formato de anuncio de software
> de la Biblioteca y la marca de la web: skill `onia-ventas-pauta` §4, `anuncio-render.js`. D1 y D4 v2 salieron con
> este pack (arcilla verde, ensayo, dato) y no sirvieron como anuncio.

**Carruseles de marca personal → pack `referentes`** (`scripts/carousel_pack_referentes.js`).
Cada lámina elige `layout`:

| Layout | Patrón (de quién) | Texto máximo | Imagen |
|---|---|---|---|
| `ilustrado` | Santiago: título con palabra en color + ilustración dominante + pie + flecha «seguí →». Con `badge` y `logo` es portada | título ≤ 8 palabras, pie ≤ 20 | acuarela de Higgsfield |
| `logos` | Bastian: UNA palabra gigante espaciada + fila de logos oficiales con nombre | 1 palabra + 1 línea | logos oficiales |
| `analogia` | Bastian: frase corta + objetos que explican solos (1 o 2 bloques «no es / es») | 1 frase por bloque | foto Pexels sobre blanco |
| `lista` | Santiago: título + 3–5 filas con ícono/logo, etiqueta y una línea | etiqueta ≤ 3 palabras, línea ≤ 8 | logos o números |
| `ensayo` | Bastian: texto grande sobre papel, sin cajas | ≤ 60 palabras | ninguna |
| `dato` | Erik / Ingeniero Binario: una cifra gigante + qué significa (`value`) | título ≤ 6 palabras | ninguna |
| `captura` | Carlos: la pantalla real como prueba | título ≤ 8, pie ≤ 12 | captura real (nunca maqueta) |
| `cierre` | «Buscá PALABRA en Avisos» + qué recibís (`keyword`), adaptación vigente 9-oct | 1 línea | ninguna; solo si el recurso ya existe |

Pendientes del catálogo (en `patrones/`): P-COMPARA, P-FOTO-ESCENA, P-DIAGRAMA, P-TABLA-MARCADOR, **P-LISTA-CONTINUA** (receta «Inventario continuo», más abajo; sin layout todavía).
Carlos Domínguez señala como rasgo de «plantilla IA» el fondo crema: por eso el pack pasó a
blanco puro, verde y negro (decisión de Sergio, 29-sep).

⚠️ **Trampa (30-sep):** el campo del título es `headline`, no `title`. Con `title` el renderer no avisa: la
lámina sale SIN título. `"next": ""` saca la flecha «seguí» (para historias o una lámina suelta).

⚠️ **Trampas del pack medidas el 1-oct (K2v3, K11, K12, K13):**
- **`cta` en la raíz del brief se copia a TODAS las láminas** (`sl.cta || brief.cta`): va solo en la de cierre.
- **El énfasis `*…*` que se parte de renglón deja una barra suelta** bajo la palabra que quedó arriba (pasó en la
  portada de K12 con «*la carpeta equivocada*»): enfatizá solo lo que entra en un renglón.
- **`dato` con 4 caracteres o más baja la cifra de ~420 a ~216 px** y la lámina queda medio vacía: «4/6», no «4 de 6».
- **`lista` con 2 o 3 filas escribe a 40 px** y un comando de ~36 caracteres se corta; con 4 filas o más pasa a 34 px.
- **Chromium corta después de un guion** («claude -» / «p»): un comando no arranca con guion a mitad de renglón; ponelo
  al principio de la frase o en su propio párrafo. Solo `ensayo` separa párrafos con `\n\n` (`dato` y `logos`, no).
- **Un asterisco suelto se toma como énfasis**: un cron (`5 * * * *`) va en el caption o en el drop, no en la lámina.
- **En el tema `negro`, el énfasis dentro de `cta` sale verde eléctrico sobre la pastilla blanca**: ahí el `cta` va sin
  asteriscos.
- **Título de `ensayo` que se parte** («8 / bloques»): un espacio duro (U+00A0) dentro del `*…*` lo mantiene junto.
- **`dato` con un dígito angosto** («1», «2») deja vacía la derecha: alargá el título a 2-3 líneas.
- **Sin imagen no hay K1-B.** El 1-oct, sin lote aprobado, K8, K11, K12 y K13 salieron solo con texto y se acercan a lo
  que Sergio Urcullo rechazó («vacío y con demasiado texto»). En K1-B histórico la función visual la daban dos imágenes de arcilla (desde 8-oct se conserva esa función con `fotobn`):
  pedí el lote de portada + 1 interior ANTES de armar el carrusel, no después.
- **`ilustrado` con `badge`:** si el primer renglón del título es largo, pasa por DEBAJO del sello sin avisar.
  Arrancá el título con el énfasis o sacá el badge. Cada tramo y cada `*énfasis*` es un bloque: un énfasis en el
  medio queda solo en su renglón; ponelo al final.
- **Énfasis dentro de una fila de `lista`:** sale gris con subrayado verde (la regla `.c-lista li span` le gana).
- **`captura` alta (más alta que ancha):** se limita a 760 px y el pie se monta sobre el @handle. Recortá la captura
  más ancha que alta. **`cierre`:** el body no balancea renglones; espacio duro en las dos últimas palabras.
- **La palabra del `cierre` se MIDE, no se cuentan letras** (corregido el 3-oct). La regla del 2-oct («hasta 9 letras
  queda igual») era falsa: COMUNIDAD tiene 9 letras pero anchas y su pastilla se salía por los dos lados, y ESQUELETO
  quedaba a 14 px del borde. Ahora un script de la lámina espera `document.fonts.ready`, mide la pastilla y baja la
  letra de a 3 px hasta que entra con 84 px de margen. Funciona porque el render usa `--virtual-time-budget`. Para
  verificarlo, mirá que los píxeles x=3 y x=1076 a la altura de la pastilla sean del fondo.
- **Foto 4:3 en `ilustrado`:** el `object-fit: cover` la recorta arriba y abajo y no se entiende. Centrala en un lienzo
  blanco ancho (`convert … -gravity center -extent 4400x2400`, ~1,85:1) y entra entera (N06, 2-oct).
- **Un logo como imagen de `ilustrado`:** ponelo sobre un lienzo blanco con margen; la máscara radial lo corta.
- **⚠ 5-oct, misma ruta, otra sesión de la nube:** el almacén de certificados del navegador (`/root/.pki/nssdb`) estaba
  vacío, todas las páginas daban `ERR_CERT_AUTHORITY_INVALID`, y el modo «Auto» frenó la importación del certificado del
  proxy («TLS/Auth Weaken»). No se le busca la vuelta: o Sergio Urcullo lo aprueba en esa sesión (cambiando el modo), o
  las capturas las saca una sesión en su PC con Chrome. Probalo con UNA página antes de prometer capturas desde la nube.
- **Capturas reales desde la nube (2-oct):** Chromium con `--proxy-server=$HTTPS_PROXY`; si da
  `ERR_CERT_AUTHORITY_INVALID`, la confianza en la CA del proxy se resuelve como dice `/root/.ccr/README.md` (nunca
  apagando TLS). Cargan `platform.claude.com`, `developers.openai.com`, `geminicli.com`, `developers.googleblog.com`;
  dan 403 por política `github.com` (web) y `openai.com/index/*`. Legible con viewport móvil de 430–560 px y escala 3;
  ocultá los widgets flotantes («Ask Docs») antes de capturar. La captura va a `carousels/briefs/assets/<pieza>/`
  con la fecha en el nombre y en el caption.
- **Una noticia se re-verifica el día que se arma la pieza**, no el del guion: el 1-oct, N06 («Gemini CLI gratis»)
  ya era falsa (reemplazado por Antigravity CLI para el plan gratis el 18-jun) aunque el README seguía diciendo gratis.
  Manda el banner/blog oficial más nuevo, no el README.
- **El pack no tiene layout de código ni monoespaciada.** Un bloque de código real necesita una captura.
- **Foto con fondo gris en `analogia`**: el `multiply` solo borra el blanco puro y queda un recuadro gris. Sacale el fondo
  antes o elegí otra foto.

**Historias (1080×1920):** mismo pack con `--format story`. Dejar libre el tercio de abajo: ahí va el sticker de
link, que se pone a mano en Instagram. Ejemplo: `briefs/marca-personal/sergio-historias-comunidad-20261001.json`.

Render: `node scripts/carousel_render.js --brief <dir>/brief.json --out <dir> --account sergio --pack referentes --format feed`
y `node scripts/carousel_contactsheet.js --dir <dir>`. Ejemplo completo y aprobado a la vista:
`hermes-content/carousels/briefs/marca-personal/sergio-k1v2-opus-o-sonnet-20260929.json`.

Otros formatos:
- **Presentación de YouTube (16:9):** `scripts/generate_youtube_teaching_decks.mjs` (una lámina por sección del guion).
- **Pack `community-editorial`:** el de antes. Sergio lo juzgó «vacío y con demasiado texto» (29-sep): no usarlo para marca personal.

## 3. Patrones de los referentes

Catálogo completo, con URLs de lo observado: [`patrones/REFERENTES-VISUAL.md`](patrones/REFERENTES-VISUAL.md).
Fórmulas de guion (no visuales): `hermes-content/references/marca-personal/FORMULAS-REFERENTES.md`.

Lo que ya se vio el 29-sep y cambió el diseño:
- **Bastian Xu** ([logos](https://www.instagram.com/p/Ddy6JULoBBv/), [analogía](https://www.instagram.com/p/Ddwx2T-oObm/)):
  papel blanco, casi sin texto; los logos o los objetos cuentan la idea. Después de la portada,
  láminas de puro texto grande, sin tarjetas ni rótulos.
- **Santiago Muñoz** ([Claude hace videos](https://www.instagram.com/p/DdwmO09CN4y/)): ilustración
  acuarela que ocupa la lámina, logo de Claude junto al título, palabra clave en naranja
  subrayada, etiqueta «02/10 · TEMA · 2026», flecha manuscrita «así funciona →», listas con
  íconos dibujados. Genera la lámina ENTERA con IA (texto incluido): nosotros no, ver la regla.

Qué NO copiar: sus personajes o mascotas, sus frases, su paleta exacta, sus cifras.

## 4. Sistema visual ONIA (pack referentes)

**Paleta de Sergio Urcullo (29-sep): verde ONIA dominante + blanco + negro** (tokens de
`hermes-content/brand/tokens.css`). Tres temas, por carrusel (`theme` en el brief) o por lámina:

| Tema | Fondo | Texto | Énfasis |
|---|---|---|---|
| `blanco` | #FFFFFF | negro #0A0F0D | verde profundo #0B8F4F con subrayado verde eléctrico |
| `verde` | verde eléctrico #10C26B | negro | resaltado blanco detrás del texto negro |
| `negro` | #0A0F0D | blanco | verde eléctrico #10C26B |

Combinación por defecto: portada `verde`, interiores `blanco`, cierre `negro` o `verde`.
**El verde eléctrico nunca va como texto sobre blanco** (contraste 2,2:1): ahí va el profundo.

Letras: Bricolage (títulos, local), DM Sans (texto), Caveat (flechas y sello), Instrument Serif
(nombre bajo un logo). Nada de pills, tarjetas decorativas, header ni footer repetidos.

## 5. Control de calidad antes de mostrarle algo a Sergio

1. **Mirar la imagen sola** antes de montarla: sin letras, sin logos inventados, sin caras.
   Si falla, se regenera SOLO esa.
2. **Mirar la hoja de contactos** (`_contactsheet.png`) entera. Ninguna lámina con más de un
   40 % vacío; ninguna con un párrafo chico; título legible en el celular.
3. Toda lámina sin imagen ni `visual` necesita texto propio (antes el pack rellenaba con una
   frase fija que se publicaba).
4. Cifras y fechas con fuente (en el caption, no en la lámina).
5. **La captura tiene que viajar con el brief.** `hermes-content/docs/recorrido/**/*.png` está en
   `.gitignore`: una lámina que apunta ahí, renderizada en otra máquina, sale con «Falta la captura
   aprobada del producto». Pasó con el carrusel de pauta del 21-sep (visto el 30-sep). Las capturas de una
   pieza van en `hermes-content/carousels/briefs/assets/<pieza>/`, que sí está versionada.
6. **Render en una sesión de la nube:** primero `eval "$(sh scripts/carousel_cloud_setup.sh)"`. Sin ese
   paso, el renderer no encuentra el navegador. Con el Chromium completo, además, cae en DejaVu y corta
   el pie de cada lámina. El script instala las fuentes de los packs **en TTF** (en WOFF, Chromium no las
   toma) y apunta al `headless_shell`. Comparado el 30-sep: sale igual que en la PC.
   `carousel_contactsheet.js` lee `CAROUSEL_BROWSER` y pasa `--no-sandbox` desde el 1-oct; antes fallaba en la nube con
   «No Edge/Chrome found» aunque se hubiera corrido el setup. El `eval` va en el MISMO comando que el render.

### Historias con foto de Sergio Urcullo (8-oct)

> ⚠️ **El diseño «foto + etiqueta + titular» fue RECHAZADO por Sergio Urcullo el 8-oct** («no me gustan las historias, el diseño
> hay que mejorarlo, y recordá que hay estructuras de contenido para vender»). Falló mi método, no solo el estilo: armé el
> diseño sin leer las fuentes del carril. Antes de diseñar una historia, leer **en este orden**:
> 1. `hermes-content/skills/historias-onia.md` y `hermes-content/docs/STORY_REFERENCES.md` (tipos de historia y secuencia
>    de 5: mood/prueba → problema → desglose → interacción → CTA);
> 2. `ONIA_MARCA_PERSONAL_ETAPA2_OPERACION.md` §2: **4 láminas = gancho → mito → revelación → CTA único**, con prueba en
>    pantalla y una sola acción;
> 3. los kits ya aprobados: `carousels/out/curso-dia1/` y `historias-llamada/` (fondo verde de marca, tarjetas negras,
>    stickers collage, zona punteada para el sticker real).
> Una historia que vende es una **secuencia** con una acción final, no un afiche con titular. Lo que no se ve desde la nube
> (cómo lo hacen cuentas que funcionan) se pide como issue `orquesta` + `carril:investigacion` con `donde: pc`: «historias de <cuentas> — para qué lo querés».

Lo que sigue (render, banda segura, trampas del headless) **sigue valiendo** como herramienta; lo que cambia es el diseño.

- **Método:** `scripts/marca-personal/historia-foto.mjs --foto <jpg> --titulo "Hoy: *Haiku 5.5* cuesta 10 veces menos"
  --etiqueta "HOY · SÁB 10 OCT" --out h01.png`. Título de hasta 70 caracteres; `*palabra*` sale en verde ONIA. El texto
  queda en la banda segura: la interfaz de Instagram tapa los primeros 230 px y los últimos 422 px de 1080x1920.
- **Antes de publicar:** mirar la foto (nadie más en el fondo, la cara no queda bajo el texto) y la historia renderizada.
  Publica `ig-historia.mjs` en el VPS (ver `hermes-content/deploy/vps-ops/publicar/README.md`).
- **Trampa medida el 8-oct:** el Chrome headless nuevo resta ~90 px de la ventana al capturar y deja una franja negra
  abajo. Se renderiza a 1080x2100 y se corta a 1080x1920 con `ffmpeg crop`. Y su ancho mínimo de ventana es 500 px: una
  captura «a 400 px» sale cortada aunque la página no desborde.
- **La API no pone stickers.** Link, encuesta y música los pone Sergio Urcullo a mano.

## Receta de carrusel «Inventario continuo» (referencia DePPPp5FgMh, 10-oct-2026)

Fuente y evidencia: [`references/video-intake/2026-10-10-ig-carrusel-DePPPp5FgMh.md`](../../../hermes-content/references/video-intake/2026-10-10-ig-carrusel-DePPPp5FgMh.md) (carrusel de `@iampascio`, 5 láminas, 12 apps). **Estado: incorporada, sin aplicar.** Aplicación propuesta: `hermes-content/carousels/briefs/BRIEF-RECETA-DePPPp5FgMh.md`.

**Mecanismo:** una lista larga de cosas del mismo tipo (herramientas, tics, preguntas, tareas) partida en láminas con **grilla fija**, sin tarjetas ni título interior. La portada hace de título; el último ítem es lo que ofrecés; el cierre es personal. **Cuándo sí:** 6 o más ítems de un mismo tipo. **Cuándo no:** una noticia o una prueba (va `captura`, una por lámina, como P2): el inventario enseña *qué*, la captura enseña *cómo*.

| # | Lámina | Función | Palabras | Qué va |
|---|---|---|---|---|
| 1 | Portada | Gancho de curiosidad e identificación: «qué hay» | título ≤5 + «seguí →» (≤8; la flecha del pack) | Una de tres: **captura real** del objeto medido; foto `fotobn` del escritorio con **un solo objeto verde**, sin texto en pantalla, y los logos oficiales montados por código en arco; o `dato` gigante. Nunca un render con logos generados |
| 2 | Lista 1 | 5 filas | 25-30 | Logo oficial si el ítem es una marca; número en tinta (DM Sans 800, sin círculo) si es tarea, tic o pregunta, **continuo entre láminas** (6, 7, 8…): el `li-n` actual es un círculo `#10C26B` y 5 por lámina rompen «un solo verde». Sin captura |
| 3 | Lista 2 | Hasta 5 filas, **misma grilla** | 25-30 | Igual. Si hay menos de 5 filas, el bloque va **centrado en vertical** |
| 4 | Remate | 2-3 filas; la última es **el recurso**, aislado por aire y unido al cierre con la flecha Caveat | ≤20 | Ícono simple del recurso o ninguno. **No lleva pedido**: el único pedido está en la 5 |
| 5 | Cierre personal | Una frase de firma + el único CTA | ≤25 | **Foto real** de Sergio Urcullo (fotograma de su video del día, B/N, editado en local; no se sube a servicios externos: cara y voz piden autorización específica). El único verde de la lámina es el marcador sobre la PALABRA del CTA. Sin foto: `ensayo` negro solo texto |

**Tipografía y jerarquía (1080×1350, pack `referentes`, tema `blanco`):**
- Portada: Bricolage 800, ~140 px, interlineado 1,0, tracking -0,03 em, centrada, 2 renglones de ≤3 palabras.
- Lista: **nombre y línea al MISMO cuerpo (44 px)**; la jerarquía sale del peso y el color: nombre DM Sans 800 `#0A0F0D`, línea DM Sans 400 `#4F5A55`. Nombre ≤3 palabras; línea ≤8 palabras, hasta 2 renglones; la lámina de 5 filas suma ≤30 (en promedio 2 + 4).
- Grilla (en % para que valga en `square`): ícono a 17 % del ancho y ~10 % de lado (184 px y 108 px); texto desde 32,5 % (351 px) hasta el padding de 84 px (645 px de columna: el castellano ocupa ~20 % más que el inglés de la fuente); paso de fila 16,5 % del alto (223 px); 5 filas ocupan 13-87 % del alto. La grilla **no cambia entre láminas**.
- Trazo a mano (Caveat): solo la flecha del remate y la de continuidad. Es el cambio de registro: el pulido es el valor, lo manuscrito es el momento de pedir.

**Paleta nuestra:** fondo `#FFFFFF`, tinta `#0A0F0D`, línea `#4F5A55` (~7:1 sobre blanco; el `#808080` de la fuente da ~3,9:1 y no entra). Verde profundo `#0B8F4F` solo en UNA palabra del título; el eléctrico `#10C26B` en un único objeto o subrayado, nunca como texto sobre blanco. Los logos oficiales a color dentro de la fila son el único otro color; en la portada, 9 logos a color rompen «un solo verde» y son una **excepción que decide Sergio Urcullo**.

**Cierre y CTA (una sola acción):** «Buscá PALABRA en Avisos · link en mi perfil» (8 palabras), tecleado en la lámina 5 y como línea 1 del caption. La palabra es la de la pieza del día y **solo si su aviso ya está pegado antes de la hora del carrusel**; si no, «Lo que probé está en mi comunidad. Link en mi perfil.». Sin pregunta para comentar, sin correo, sin «comentá y te lo mando» (el DM automático no está probado). LinkedIn: si su perfil no muestra el link, el link va en el texto.

**Qué NO copiar:**
- La mascota, el avatar caricatura y la firma manuscrita de la fuente (nuestro personaje es la foto real); el inglés, «Swipe →» y el humor autocrítico.
- **Líneas de uso inventadas:** cada línea tiene que ser verdad para Sergio Urcullo o va marcada `[MEDIR]`.
- Los tres pedidos de la fuente (palabra clave, correo, pregunta) y la promesa de un correo que no existe.
- La portada con íconos 3D generados, el gris `#808080` y el producto propio camuflado en una lista de marca personal (mezcla carriles: CLAUDE.md, 2-oct).

**Control de calidad propio (suma a §5):** (1) **cada línea corresponde a su ítem**: la fuente publicó una línea cruzada (la de Spotify hablaba de maquetas) y escribió «Whatsapp»; leé fila por fila contra el logo o el número; (2) lámina, caption y recurso enlazado no se contradicen (la fuente, en su lámina 5, prometía notas diarias con envío semanal); (3) misma grilla en todas: sobreponé las láminas 2 y 3 y la x del ícono y del texto no se mueve; (4) la última lista queda centrada en vertical, no pegada arriba; (5) el número de la portada coincide con el de las láminas.

**Qué plantilla hay hoy y qué falta (verificado en `scripts/carousel_pack_referentes.js` el 10-oct):**
- **Hoy no hay plantilla para esta receta.** El `lista` más parecido (línea 56; CSS 172-193) dibuja cada fila como tarjeta con borde de 3 px y radio de 26 px, siempre imprime su `headline`, cambia a `compacta` con 4 filas o más y usa dos cuerpos (50 y 40 px). **No se usa como si fuera la receta.**
- **Falta, en este orden** (encargo cerrado para Codex, con la hoja de contactos de los 2 briefs como prueba de hecho; no se construye hasta que Sergio Urcullo lo pida, como issue `orquesta` + `carril:marca` con `motor: codex`):
  1. Layout `inventario` junto a `listaHtml`, registrado en `LAYOUTS` (línea 89): `items[{icon|n, label, text}]`, `headline` opcional que no dibuja nada si falta, filas sin caja a la grilla de arriba, `center` para la última lámina y `ask` para la flecha del remate. Sumarlo a la lista de `scripts/carousel_render.test.js:104` con casos de 5, 3 y 2 filas.
  2. `cierre` escribe «Comentá» fijo (línea 86; lo confirma P2): darle un `pre` con «Buscá» por defecto, o armar el cierre con `ilustrado` (foto + frase + CTA) mientras tanto.
  3. Portada-inventario con logos en arco: layout nuevo opcional; sin él, la portada va con foto `fotobn` + `dato` o captura.
- **Logos:** hay 8 en `hermes-content/references/brand-logos/` y 3 en `hermes-content/references/brand-claude/`. Notion, Chrome, Spotify, NordVPN, Figma, Xcode y Cursor **no están**: un inventario que los nombre primero necesita su kit de prensa oficial (si hay que descargar, pide OK).

## Carrusel de oferta o evento (workshop de pago) — aprendido el 16-oct-2026

Caso: dos carruseles del workshop «Auditá tu negocio con IA» (`briefs/marca-personal/sergio-workshop-*-20261016.json` del 16-oct; la versión vigente es `sergio-taller-*-20261017.json`). Sin imágenes ni gasto: solo layouts `dato`, `lista`, `ensayo`.
- **Estructura que funcionó:** portada `dato` con **ejemplo rotulado** («Ejemplo: 5 h por semana, a Bs 20 la hora»; nunca un número que parezca dato de alguien) → la cuenta en `lista` → filtro «para quién no es» → fecha y cupo → cierre `ensayo` negro con `cta` y **una sola** acción («Link en mi perfil»). El precio no va en la lámina: va en la página, que es lo que se aprueba.
- **Una lámina `ensayo` con 3 líneas queda con más de la mitad vacía** (falla el control §5.2). Se arregla pasándola a `lista` de 3 filas. Las de cierre negro y la portada verde pueden quedar así: son declaraciones.
- **`cierre` no se usa** para estas piezas: imprime «Comentá» fijo y el DM por comentario no está probado. El cierre es `ensayo` con `cta`.
- **Trampa del setup (medida hoy):** `eval "$(sh scripts/carousel_cloud_setup.sh)" 2>&1 | tail -3` falla con «No Edge/Chrome found» porque el pipe corre el `eval` en un subshell y `CAROUSEL_BROWSER` se pierde. Correr el `eval` **sin pipe**, o exportar `CAROUSEL_BROWSER=/root/.fonts/onia-carruseles/chromium-headless.sh` en el mismo comando.
- La hoja de contactos se llama con `--dir <carpeta>` (no con la carpeta suelta).
- Antes de publicar: la promesa («plantilla del Mapa», fecha, precio) tiene que existir y estar aprobada; ver `docs/TALLER_31_OCT.md` (fuente única del taller).

## Oferta de entrada o prepago de la marca personal — aprendido el 16-oct-2026

Método y cifras en `docs/ONIA_LANZAMIENTO_PREPAGO.md` y `docs/research/FUNNELS_WEBINARS_Y_PREPAGO_REFERENTES.md`. Lo que sirve para piezas:
- **Antes de diseñar una pieza de venta, hacer la cuenta de cuánta gente hace falta** (meta ÷ precio, y precio plano contra escalones por cupo). Con Bs 3.000: 60 inscripciones a Bs 50, 50 a Bs 60, 43 a Bs 70. Si la audiencia medida no alcanza, la pieza no arregla la cuenta: se dice.
- **Escalones de precio por cupo real** (Bs 50 → 60 → 70), nunca por reloj falso ni «valor» inflado. La lámina no lleva el precio: va en la página, que es lo que aprueba Sergio Urcullo.
- **No hay fuente pública sobre prepagos en Bolivia:** un caso de un amigo es anécdota, no dato. Antes de usarlo como meta, preguntarle su audiencia y los días que vendió.
- Los carruseles de oferta repiten la fecha y el cupo: si cambian, **se cambian las láminas antes de publicar** (los de 16-oct dicen «sáb 24 / cupo 12»).

**Aprendido el 19-oct-2026 (taller del 31-oct, fuente única `docs/TALLER_31_OCT.md`):**
- **La fuente de una oferta vive en el repo, nunca solo en un disco de proyecto.** `TALLER_31_OCT.md` se escribió en `/mnt/project-files/` de la nube, 5 documentos la citaban como «la que manda» y nadie podía leerla: 7 contradicciones y la apertura del lun 19 perdida. Se recreó en git.
- **Medir la audiencia antes de prometer la meta.** Los seguidores públicos se leen sin login abriendo `instagram.com/<cuenta>/` en el navegador del panel y leyendo `meta[property="og:description"]` (con `curl` vuelve vacío). 19-oct: 497 seguidores para 50 cupos → hace falta pauta y mensajes 1 a 1, no solo piezas.
- **Google Meet gratis corta a los 60 min** cuando entran 3 o más personas (lo fija la cuenta del anfitrión). Un taller de 90 min se arma en dos bloques de 45 con pausa y se vuelve al mismo link, y se avisa en la página y en la confirmación.
- **Captura móvil de una página:** Edge sin pantalla con `--window-size=390,…` dibuja más ancho y recorta (parece que el texto se sale). Se captura un HTML marco con `<iframe style="width:390px">` apuntando a la página, o se mira en el panel del navegador con el preset móvil.

## 6. Gasto (CLAUDE.md, regla de Higgsfield)

Cotizar siempre. **Actualización 8-oct, consolidada 9-oct:** imágenes de prueba/opciones por unos pocos créditos (menos de ~5 por lote) tienen autorización previa; mostrar después el resultado. Lotes grandes, entrenamiento Soul y subir cara/voz a servicios externos requieren autorización específica (cara/voz de Sergio Urcullo también la de Leslie Mercado Moreno). No fraccionar lotes para esquivar el límite. Registrar en
`hermes-content/docs/ONIA_MARCA_PERSONAL_HIGGSFIELD_RECETAS.md`. Costos vistos el 29-sep:
`text2image_soul_v2` 0,12 cr · `seedream_v5_lite` 1 · `nano_banana_flash` 1,5 · `gpt_image_2` 6,5.
El CLI autenticado está en el VPS: `HF_CMD="ssh -i <llave> -o BatchMode=yes root@<vps> higgsfield"`.

**Trampas de prompt (Soul 2.0):**
- Nombrar «Instagram» o «carrusel» dibuja un post falso.
- Nombrar una ciudad la imprime.
- Tazas, cuadernos y pantallas salen con letras inventadas.
- Pedir «espacio vacío» deja un bloque gris.
- Lo que funciona: un objeto simple sin impresión, descrito en positivo, y el bloque de estilo
  del script (`STYLES` en `scripts/carousel_images.mjs`).
- **Estilos medidos el 29-sep con Soul 2.0 (histórico; reemplazado por `fotobn` el 8-oct):** `clay` (3D arcilla) salió limpio y en paleta en esa prueba.
  `acuarela` queda linda pero INVENTA UNA FIRMA en una esquina (2 de 2): se
  recorta. `linea` sale como foto de un papel con bordes oscuros. Soul es un modelo de fotos:
  lo que se puede fotografiar (arcilla, objetos) le sale; el dibujo, no.
- **Medido el 1-oct (lote K2v3/K11/K12):** «toy train» y «locomotive» salen con cara (tipo Thomas) y «tipped over» no
  se respeta; «boxcar» sale sin cara. La arcilla a veces sale con **fondo gris claro (~210-225)**: en lámina blanca no se
  nota, en portada VERDE queda un bloque turbio. Medí las esquinas antes de montar en verde
  (`ffmpeg -i img -vf crop=150:150:0:0,scale=1:1 -f rawvideo -pix_fmt rgb24 - | od -An -tu1`; menos de ~235, regenerá).
- **Fondo gris → blanco sin regenerar: `python3 scripts/blanquear-fondo.py in.jpg out.jpg`** (3-oct; necesita numpy y
  scipy, que se instalan con `pip install numpy scipy`). Medido el 3-oct: 31 de 32 imágenes del lote venían con el
  fondo entre 160 y 215 de luz, con viñeta, y en la lámina quedaba un óvalo turbio (la galera «en niebla», el faro
  sobre un óvalo). El flood fill con `-fuzz` no alcanza porque la viñeta se escapa del rango. El script se queda con
  lo poco saturado y claro que está CONECTADO al borde, cortado por los contornos (Sobel), así no borra los objetos
  blancos que tocan el fondo, como la franja de un faro o un frasco. Guardá el original antes (en el scratchpad).
- **Prompt de foto + `image_style: clay` = criatura** (visto 2-oct, portada K9v2): unas «brass sewing scissors… linen
  thread on a pale oak table» con estilo clay salieron como un bicho verde con ojos, y la tijera de costado. Con clay,
  el prompt nombra objetos DE ARCILLA y sus colores («emerald green clay…, matte black clay…, on a white surface»).
  Al cambiar de estilo un brief viejo, reescribí el prompt; no lo heredes.
- **La palabra «face» dibuja una cara**, aunque sea la cara de una moneda (visto 2-oct, DD-A): «coins with smooth blank
  faces» sacó una moneda verde con ojos, nariz y sonrisa. Tampoco «side», «front», «head» como partes de objetos: decí
  «plain», «smooth», «flat». Las monedas, además, suelen salir con «$» o números grabados: mejor bloques grandes y chicos.
- **Lote con criterio (2-oct, 32 imágenes):** antes de generar, un editor y un juez adversarial pasan por cada lámina con
  esta pregunta: «¿un lector entiende la relación título + imagen en 1 segundo, sin leer el alt?». Reescribieron 30 de 32;
  las de antes eran decoración genérica o metáforas de todo el carrusel, no de ESA lámina. El juez además cazó repetidos
  entre carruseles (dos balanzas, dos lupas). Workflow: `criterio → juez → reescritura → cruce`.
- **`--out` de `carousel_images.mjs` = nombre del carrusel** (`<scratch>/sergio-kNN-…`): el script toma de ahí el nombre
  del archivo y el `usado_en` de `galeria.json`. Con `--out k11-img` quedó todo mal anotado.
- **Varios agentes generando a la vez:** `flock /tmp/claude-0/galeria.lock` delante del comando (el script reescribe
  `galeria.json` entero). Después de usar un prompt, renombralo a `image_prompt_usado`: si no, un re-run vuelve a cobrar.
- **El modo automático de permisos puede frenar la generación paga** aunque Sergio Urcullo la haya aprobado en el chat
  (1-oct: frenó K8 y K13, dejó pasar K2, K11 y K12). No se busca otro camino: se le pide a él un «sí» explícito o una
  regla de permiso.
- **`ilustrado` con título de más de una línea:** el `logo` queda solo en su renglón, arriba. **`lista` con `icon`:** el
  ícono (96 px) deja ~706 px de texto, y un comando de ~36 caracteres se parte.
- Si un `generate create` se corta por tiempo, el job sigue y COBRA: recuperarlo con
  `higgsfield generate list` + `generate wait <id>` y `saveToGallery({url})`, nunca regenerar.

**Higgsfield desde una sesión en la NUBE (1-oct-2026):**
- El CLI `higgsfield` no está instalado. El MCP de Higgsfield sí anda. CLAUDE.md prefiere el CLI, así que usá el MCP solo
  con OK explícito del lote.
- Cotizá con `generate_image` y `get_cost: true`. `soul_2` = `text2image_soul_v2`: 0,12 cr por imagen, 9:16, 2k.
- `count: 2` da dos variantes del mismo prompt. Elegí mirando las dos: de 2 «muñecos en una mesa», 1 salió con caras
  verdes raras.
- Bajá el resultado con curl desde cloudfront y registrá job, prompt y costo en `galeria.json` y en la bitácora.
- **Herramientas (medido el 2-oct, entorno onia-higgsfield):** `ffmpeg` y `convert` (ImageMagick) están; PIL no.
  ImageMagick no rasteriza SVG (falta rsvg): un logo SVG se rasteriza con Chromium. Una foto con fondo gris para
  portada verde: `convert in -colorspace Gray -level 8%,84%,0.6 -white-threshold 93% out` la deja en blanco puro.
  Con fondo gris, `-type TrueColor` o la salida queda en blanco y negro.
- **Antes (1-oct) no había PIL ni ffmpeg:** guardá el PNG tal cual si falta la herramienta. No encadenes `rm` después de una conversión que puede
  fallar: el 1-oct se borraron los originales y hubo que bajarlos de nuevo.

## 7. Skills de diseño que se cargan con esta

`impeccable` (register brand; las leyes de color/tipo/layout) · `design-dna` (sacar tokens de
una referencia nueva) · `hyperframes` (si la lámina se anima).
