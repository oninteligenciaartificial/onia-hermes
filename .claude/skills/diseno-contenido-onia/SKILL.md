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
> «Higgsfield en la edición de la marca personal» (entra a `main` con el PR de la madre). Todo lo de abajo que diga «arcilla»
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
| `lista` | Santiago: título + 3–5 filas con ícono/logo, etiqueta y una línea (tarjetas con borde) | etiqueta ≤ 3 palabras, línea ≤ 8 | logos o números |
| `inventario` | @iampascio (10-oct): lista larga partida en láminas, hasta 5 filas, grilla fija sin tarjetas ni título; número en tinta continuo (`start`); `center` y `ask` para la última lista y el remate. Receta «Inventario continuo», más abajo | nombre ≤ 3 palabras, línea ≤ 8; ≤ 30 por lámina | logos oficiales o número |
| `ensayo` | Bastian: texto grande sobre papel, sin cajas | ≤ 60 palabras | ninguna |
| `dato` | Erik / Ingeniero Binario: una cifra gigante + qué significa (`value`) | título ≤ 6 palabras | ninguna |
| `captura` | Carlos: la pantalla real como prueba | título ≤ 8, pie ≤ 12 | captura real (nunca maqueta) |
| `cierre` | «Buscá PALABRA en Avisos» + qué recibís (`keyword`), adaptación vigente 9-oct | 1 línea | ninguna; solo si el recurso ya existe |

Pendientes del catálogo (en `patrones/`): P-COMPARA, P-FOTO-ESCENA, P-DIAGRAMA, P-TABLA-MARCADOR, **P-LISTA-CONTINUA** (receta «Inventario continuo», más abajo; layout `inventario` hecho el 10-oct).
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
  **Capturas de líneas reales del repo (9-oct, carrusel «Los 5 archivos»):** `scripts/marca-personal/captura-editor.py --spec
  capturas.json --out <carpeta>` lee las líneas `desde..hasta` de cada archivo y las pinta en un panel de editor oscuro
  (verde de marca, sin rojo): la captura no puede parafrasear y se rehace sola si el archivo cambia. `{ruta:…}` verifica
  que la ruta exista, `{n:dir}` cuenta entradas. Trampas pagadas: `--out` relativo da `ERR_INVALID_URL` (PNG de página de
  error de ~24 KB; solo se vio mirando la hoja de contactos) y un `.p` con alto fijo hace que el alto medido sea el de la
  ventana. El layout `captura` del pack no tiene panel de código: una captura del repo entra como imagen.
- **`carousel_render.js` sin `--out` escribe en `./out/` del cwd, y `out/` de la raíz está VERSIONADO** (63 archivos de
  Lucía). Pasá siempre `--out hermes-content/carousels/out/<slug>`; si se te escapa, borrá solo los `slide-*.png` sin
  trackear (`git ls-files --others --exclude-standard out`), nunca `rm -rf out` (9-oct: lo borré y lo restauré con
  `git checkout -- out`).
- **Cierre del carrusel sin «Comentá»:** `cierre` acepta `pre` (**por defecto «Buscá» desde el 10-oct**; antes «Comentá») y `kicker` (frase grande encima).
  «Buscá ARCHIVOS · en Avisos · link en mi perfil» no promete un mecanismo de comentario→DM sin probar (CLAUDE.md,
  contenido en redes). El caption repite el mismo cierre. Los 19 briefs viejos que dependían del default llevan `"pre": "Comentá"` escrito: re-renderizarlos no cambia lo ya agendado. Un `kicker` de dos frases se parte donde cae: unilas con espacios duros (U+00A0) para que el renglón corte en el punto («La skill saca tics. / El gusto lo ponés vos.»; sin eso quedó «…tics. El» colgando).
- **Foto con fondo gris en `analogia`**: el `multiply` solo borra el blanco puro y queda un recuadro gris. Sacale el fondo
  antes o elegí otra foto.

- **P2 «7 herramientas» (11-oct): tres perillas nuevas del pack, todas opt-in (los briefs viejos no cambian: 74 láminas de 10 briefs
  comparadas píxel a píxel antes y después, 0 diferencias).** `logos` con VARIAS palabras: una línea por `\n`, sin mayúsculas ni
  letter-spacing, ajuste por medición a 84 px, y sin `file` en las marcas va solo el nombre (`solo-nombres`). `ensayo`: `grande: true`
  (título 150 px, cuerpo 74 px) y `fit: "ancho"` (la palabra del CTA crece hasta el margen de 84 px). `captura`: `logo` delante del
  título (como `ilustrado`). **Trampa pagada:** el primer `fit` de `ensayo` medía el ancho del `h2` y daba siempre 912 px (el margen),
  porque un ítem flex se estira al ancho de la lámina: no crecía ni achicaba nada y el test (que solo mira el marcado) pasaba en verde.
  Se mide el ancho del TEXTO con `width:max-content` + `align-self:flex-start`; y el único modo de verlo era mirar el render.
  También: (1) un detector de «rojo» por matiz da falsos positivos con el antialiasing LCD de las letras (franjas de 1 px naranja y azul);
  medí por bloques sólidos de 5×5 px; (2) una composición HyperFrames es un `<template>`: se le quita el envoltorio y se monta en un
  documento; `intro.html` declara 1080×1920 pero su CSS es 1920×1080, y el cuadro vertical «oficial» sale con el título cortado;
  (3) `captura-editor.py` parte a 43 caracteres: las líneas con sangría de 8 espacios envuelven, y se compone con PIL a ~2:1 para que
  la lámina no quede vacía; (4) un `*énfasis*` partido deja barra suelta: NBSP dentro lo mantiene entero; (5) el layout `cierre` ya no
  escribe «Comentá» fijo (por defecto «Buscá»): la spec de P2 estaba desactualizada; (6) las láminas de remate de una frase o de CTA
  miden ~53-73 % de «vacío» aun agrandadas: el `cierre` aprobado mide igual (~71 %), no se rellenan con texto inventado.
  Las capturas que piden cuentas (Buffer, n8n, terminal de la PC) no se sacan desde la nube: marcador «CAPTURA PENDIENTE · PC/Chrome»
  (nunca una UI fabricada) y un PEDIDO PC por lámina en el README de la pieza.
- **Control de un carrusel ya agendado (11-oct, K8/K2/K6): se revisa cada cifra, cada cita y cada ABSOLUTO.** K2 lámina 3 decía «Si es vaga, no la usa nunca»: la doc oficial de skills solo dice que la `description` sirve para decidir cuándo aplicarla; «nunca» era mío. Un «nunca/siempre» sobre una herramienta de terceros se busca en su doc o se quita. K6 cerraba con «las dos respuestas» cuando el recurso las tiene recortadas con […] (las completas no existen): **el cierre promete lo que el aviso entrega, con sus mismas palabras** («la prueba y la plantilla»). Y una prueba de n=1 no sostiene una causa: K6 lámina 6 decía «si la confirma, le faltan las dos listas», pero en la prueba el bot SIN listas tampoco prometió; se pide probar de nuevo, no se afirma la causa. Si en la prueba una cosa se llamó distinto que en la plantilla («NO confirmado» vs «Por confirmar»), el caption lo dice. **Al cambiar un cierre, se barren también los `next` de la lámina anterior** (el de K6 lámina 7 seguía diciendo «las dos respuestas») y la lista de qué cambia en el VPS. **El aviso existe ≠ el recurso está donde lo lee el validador:** PROMPT y PROMESA tienen su `## PALABRA ·` en `AVISOS-COMUNIDAD-8-16-OCT.md` pero el recurso completo vive en `drops/AVISOS-POR-DIA.md` (l.1090 y 5-3); el validador mira solo el encabezado. Un video de YouTube se comprueba con el oEmbed (`youtube.com/oembed?url=…`): 200 = no es privado, pero **no distingue público de no listado**. Cierre con `kicker` («La prueba y la plantilla.») renderiza bien en el pack. **Un segundo revisor (haiku, solo lectura, con la doc entera) encontró tres cosas que yo había dado por buenas**: `/skills` como prueba de que cargó una skill (la doc lo menciona solo para las sincronizadas de claude.ai; lo documentado es el menú `/` con el `name` o pedir algo que coincida con la `description`), «el video está en mi comunidad» (la comunidad lleva el LINK; el video vive en la página) y una lección sobredicha. Regla: un carrusel con datos de terceros se revisa dos veces, y el cierre nombra lo que el aviso entrega («el link del video», no «el video»). Detalle: `hermes-content/docs/cola/plan-3-semanas/AUDITORIA-AGENDADOS-K8-K2-K6-11OCT.md`.
- **Una afirmación técnica sobre una herramienta de TERCEROS se verifica en su documentación o su código, no se escribe de memoria (11-oct, K4 v2).** La lámina 4 decía «si tu servidor tarda, Chatwoot lo vuelve a entregar»: el código de Chatwoot (`lib/webhooks/trigger.rb`) espera 5 s y **no reintenta un timeout** (solo los agent bots con 429 o 500 levantan un error reintentable), y su documentación no menciona reintentos; quien sí documenta que reintenta «hasta 7 días» y que puede duplicar es WhatsApp (Meta, `webhooks/overview`). Se encontró al escribir el aviso PRUEBAS, no antes: el carrusel ya estaba agendado. Regla: cada cifra o comportamiento de un tercero lleva su fuente en la tabla «Datos y fuentes» del aviso ANTES de agendar; si la única fuente es «lo recuerdo», se reescribe atribuyéndolo a quien sí lo documenta. Y el validador `marca-M2` (`scripts/marca-personal/validar-calendario.js`) lee la columna «Palabra» del calendario y exige su `## PALABRA ·` en algún `AVISOS-COMUNIDAD-*.md`: así se detectó que PRUEBAS y BRIEF cerraban con un aviso inexistente.
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
> (cómo lo hacen cuentas que funcionan) se le pide a la madre: «PEDIDO PC: historias de <cuentas> — para qué lo querés».

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
- **Secuencia que vende (9-oct): `scripts/marca-personal/generar-historia-venta.py`** → 4 historias gancho → mito → revelación → CTA
  único (la asesoría gratis), con el diseño del kit aprobado (importa el CSS de `generar-historia-llamada.py`, no lo copia).
  Salida `carousels/out/historias-venta-asesoria/`; gate `CHROME_BIN=$CAROUSEL_BROWSER python3 …/chequear-banda-segura-historias.py
  <ruta ABSOLUTA>` (con ruta relativa falla con `as_uri`). Se lo mostré a Sergio Urcullo renderizado; no se agenda sin su OK.
  Lecciones: el gancho y el mito van con texto GRANDE (78-92 px: el texto ES la historia; en la 1.ª versión salían chicos con
  la mitad del verde vacío); la prueba en pantalla es el checklist real, no una maqueta; el sticker de link va solo en la última;
  si se agrega una capa, `nth-of-type` cuenta la cinta (`div.cinta` es el 1.º hijo de la tarjeta). En la nube sale con Archivo
  instalada y sin Geist Mono (cae a otra mono): igual de legible, no pixel-idéntico a la PC.
  Ojo: Instagram dio 429 a la API de historias de la PC el 9-oct (la madre, 9-oct): las capturas de historias de referentes
  esperan a que Sergio Urcullo las mire a mano en Chrome.
- **Historias v2 (11-oct): `scripts/marca-personal/generar-historia-venta-v2.py` → `carousels/out/historias-venta-asesoria-v2/`.**
  Pack `referentes` (#10C26B, Bricolage + DM Sans/Mono + Caveat), una prueba visual DISTINTA por historia (burbuja de cliente
  sin respuesta · creencias tachadas · tarjeta de 5 preguntas · tarjeta de acción con el tercio de abajo libre), versión SIN foto
  terminada y ventanas de foto declaradas (`FOTO-SLOTS.png`; círculo de 260 px: primer plano con la cara al 60-65 %).
  Aprendido armándola (subagente sonnet, 11-oct): (1) **Playwright con `NODE_PATH=/opt/node-tools/node_modules`** captura 1080x1920
  exacto y 390x844@2x sin el truco de 2100 + crop ni el mínimo de 500 px de la nota de arriba; (2) **`--disable-lcd-text`** en
  Chromium Linux: sin eso el texto mono chico sale con flecos naranjas/azules que un detector de «terracota» confunde con color;
  (3) Bricolage del repo llega a peso 700 y DM Sans del repo solo a 400-500: los 600-800 salen de fuentes del sistema (confirmalo con
  CDP `CSS.getPlatformFontsForNode`); (4) el tamaño a 390 px se mide recorriendo los nodos de texto con `data-rol` (font-size × 390/1080)
  y la banda segura con fondo plano se verifica por píxeles; (5) el recuadro-guía del sticker va SOLO en la copia de chequeo
  (bandas azules, zona ámbar: nada de rojo). Medido: texto principal ≥ 18,1 px y secundario ≥ 12,3 px a 390 de ancho.
  **Crítica de la v1 (la que ya salió el 10-oct):** las 4 eran el mismo afiche, la «prueba» era texto en un recuadro, la 4 imprimía
  el recuadro «LINK ACÁ ↓» en la PNG final, usaba #00C661 y Archivo (fuera del pack) y afirmaba «5 min» y «10 seg» sin fuente.

## Receta de carrusel «Inventario continuo» (referencia DePPPp5FgMh, 10-oct-2026)

Fuente y evidencia: [`references/video-intake/2026-10-10-ig-carrusel-DePPPp5FgMh.md`](../../../hermes-content/references/video-intake/2026-10-10-ig-carrusel-DePPPp5FgMh.md) (carrusel de `@iampascio`, 5 láminas, 12 apps). **Estado: layout `inventario` hecho y probado el 10-oct; aplicada en 2 carruseles renderizados (sin publicar).** Aplicación propuesta: `hermes-content/carousels/briefs/BRIEF-RECETA-DePPPp5FgMh.md`.

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

**Qué plantilla hay (hecho el 10-oct en `scripts/carousel_pack_referentes.js`, tests en `scripts/carousel_render.test.js`):**
- **`inventario`** (junto a `listaHtml`, registrado en `LAYOUTS`): `items[{icon|n, label, text}]`, `start` (primer número de la lámina; la numeración es continua entre láminas), `headline` opcional que no dibuja nada si falta, `center`, `ask` (`true` o un texto corto). Grilla en % del alto/ancho: marca a 17 % (10 % de lado), texto a 32,5 %, primera fila a 13 %, paso 16,5 %, nombre y línea a 44 px; **más de 5 filas por lámina falla** a propósito (la grilla no cambia). El `lista` de tarjetas **no** sirve para esta receta (borde 3 px, título siempre, dos cuerpos).
- **Trampas medidas al armarlo (carruseles «78h en una tarea» y «Tics de webs con IA»):**
  - Una fila sin número ni logo (lista que no es de ítems, como la cuenta 30 × 3 × 52, o el recurso del remate) lleva `"n": ""`: la columna queda vacía en TODAS las filas de esa lámina y el texto conserva su x. Si sólo quedara vacía una, parece un número perdido.
  - El remate (`ask: true` + `"next": ""`, porque la flecha ya es la de continuidad) se ve bien **centrado** (`center: true`; el bloque cuenta la flecha); pegado arriba deja la mitad de abajo en blanco.
  - El `badge` de `ilustrado` es un círculo de 150 px: «7 TICS» en mayúsculas apenas entra y «12 TICS» se corta. En minúsculas («[X] tics», como «noticia») entra.
  - Los `assert` de un test sobre el HTML completo de la página también ven el CSS: `includes('inv-t')` aprobaba aunque la lámina no dibujara título porque `.inv-t` está en la hoja de estilo. Afirmá sobre el marcado (`class="inv-t"`, `<h2`).
- **Falta:** portada-inventario con logos en arco (layout opcional; sin él, la portada va con foto `fotobn` + `dato`, o con la captura). El fotograma de Sergio Urcullo para la lámina 5 todavía no existe: hoy el cierre es `cierre` negro, solo texto («Sin foto: texto negro», receta).
- **Logos:** hay 8 en `hermes-content/references/brand-logos/` y 3 en `hermes-content/references/brand-claude/`. Notion, Chrome, Spotify, NordVPN, Figma, Xcode y Cursor **no están**: un inventario que los nombre primero necesita su kit de prensa oficial (si hay que descargar, pide OK).

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
una referencia nueva) · `banner-design` (piezas sueltas) · `hyperframes` (si la lámina se anima).
