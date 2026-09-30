---
name: diseno-contenido-onia
description: "Invocar ANTES de hacer cualquier pieza visual de la marca personal de Sergio Urcullo o de ONIA (carrusel, portada, presentación de YouTube, miniatura, lámina, imagen para un video). Índice único del diseño de contenido. Imágenes en orden galería, Higgsfield (Sergio dicta Pixel), logo oficial, captura real. Pack referentes con temas verde, blanco y negro, patrones de los referentes, trampas ya pagadas y control de calidad."
---

# Diseño de contenido ONIA — el único lugar

> Nace el 29-sep-2026. Sergio Urcullo: *«coloca tus skills de design, tus elementos y cómo lo
> hagas en un solo lugar, ordenados»*. Todo lo de diseño de contenido se entra por acá; los
> detalles viven en los archivos que este índice nombra, y no se copian a otro lado.

> **Alcance:** diseño de CONTENIDO (redes, YouTube, piezas de marca). La UI del PRODUCTO (el
> SaaS) no vive acá: `onia-platform/DESIGN.md` + skill `onia-frontend` de ese repo (acordado
> con la sesión de onia-platform el 29-sep).

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
| 2 | **Higgsfield** (generada) | Ilustraciones y metáforas visuales: la fuente principal | `node scripts/carousel_images.mjs --brief <b> --out <dir>` cotiza gratis; `--yes` genera (lote aprobado, §6) → `galeria/ilustraciones/` o `galeria/fotos/`. Estilos: `acuarela`, `linea`, `clay`, `foto`, `objeto` |
| 3 | **Logo oficial** | Cuando se NOMBRA una marca | Claude/Claude Code/Anthropic: `hermes-content/references/brand-claude/` · n8n, OpenAI, Meta, Google, Gemini, WhatsApp: `hermes-content/references/brand-logos/`. Nunca recrear ni generar un logo |
| 4 | **Captura real** | Mostrar producto o pantalla | Captura de la pantalla real (layout `captura`), nunca una UI inventada |
| 5 | Pexels / Unsplash | Solo si hace falta una FOTO REAL con licencia (no generada) | `python scripts/marca-personal/buscar-objetos.py --fuente pexels --sin-recorte --galeria --objeto nombre="consulta"` |
| ⛔ | Google / Pinterest | — | Una foto ajena sin licencia no se publica. Google solo para el kit de prensa OFICIAL de una marca |

Calidad mínima: 1.800 px en el lado largo (Higgsfield 2k). La galería guarda JPEG ≤ 2048 px.

## 2. Qué pack y qué layout

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
| `cierre` | los 8 referentes: «Comentá PALABRA» + qué recibís (`keyword`) | 1 línea | ninguna; solo si el recurso ya existe |

Pendientes del catálogo (en `patrones/`): P-COMPARA, P-FOTO-ESCENA, P-DIAGRAMA, P-TABLA-MARCADOR.
Carlos Domínguez señala como rasgo de «plantilla IA» el fondo crema: por eso el pack pasó a
blanco puro, verde y negro (decisión de Sergio, 29-sep).

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

## 6. Gasto (CLAUDE.md, regla de Higgsfield)

Cotizar siempre (gratis), pedir aprobación del lote con costo y cantidad, registrar en
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
- **Estilos medidos el 29-sep con Soul 2.0:** `clay` (3D arcilla) sale limpio y en paleta; es el
  que mejor rinde. `acuarela` queda linda pero INVENTA UNA FIRMA en una esquina (2 de 2): se
  recorta. `linea` sale como foto de un papel con bordes oscuros. Soul es un modelo de fotos:
  lo que se puede fotografiar (arcilla, objetos) le sale; el dibujo, no.
- Si un `generate create` se corta por tiempo, el job sigue y COBRA: recuperarlo con
  `higgsfield generate list` + `generate wait <id>` y `saveToGallery({url})`, nunca regenerar.

## 7. Skills de diseño que se cargan con esta

`impeccable` (register brand; las leyes de color/tipo/layout) · `design-dna` (sacar tokens de
una referencia nueva) · `banner-design` (piezas sueltas) · `hyperframes` (si la lámina se anima).
