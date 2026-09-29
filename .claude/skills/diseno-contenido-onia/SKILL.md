---
name: diseno-contenido-onia
description: Invocar ANTES de hacer cualquier pieza visual de la marca personal de Sergio Urcullo o de ONIA — carrusel, portada, presentación de YouTube, miniatura, lámina, imagen para un video. Es el índice único del diseño de contenido: de dónde sale cada imagen (galería → Pexels/Unsplash → Higgsfield → logo oficial), qué pack y qué layout usar, los patrones de los referentes (Santiago Muñoz, Bastian Xu y el resto), las trampas ya pagadas y el control de calidad antes de mostrar.
---

# Diseño de contenido ONIA — el único lugar

> Nace el 29-sep-2026. Sergio Urcullo: *«coloca tus skills de design, tus elementos y cómo lo
> hagas en un solo lugar, ordenados»*. Todo lo de diseño de contenido se entra por acá; los
> detalles viven en los archivos que este índice nombra, y no se copian a otro lado.

## La regla que ordena todo

**Las imágenes vienen de afuera; todo lo demás lo hace el código.** El texto, la tipografía,
los logos, las listas, las tablas y el armado de cada lámina salen de `scripts/`. Una imagen
generada NUNCA lleva texto (los modelos escriben mal; visto el 29-sep: «SANTA CUS BOVIA»
impreso en una taza y un post de Instagram falso con caption inventado).

## 1. De dónde sale cada imagen, en este orden

| # | Fuente | Para qué | Cómo |
|---|---|---|---|
| 1 | **Galería propia** | Lo que ya tenemos, cualquier cosa | Buscá en `hermes-content/galeria/galeria.json` (tags, prompt, consulta) antes de pedir nada nuevo |
| 2 | **Pexels / Unsplash** (licencia libre) | Fotos reales: objetos sobre blanco, escenas | `python scripts/marca-personal/buscar-objetos.py --fuente pexels --sin-recorte --galeria --objeto nombre="consulta en inglés"` → queda en `galeria/objetos/` con autor y licencia. Llaves en `~/.env`. Aprobado por Sergio el 06-sep |
| 3 | **Higgsfield** (generada) | Lo que no existe en stock: ilustración acuarela, metáfora visual | `node scripts/carousel_images.mjs --brief <b> --out <dir>` cotiza gratis; `--yes` genera (lote aprobado, ver §6) → queda en `galeria/ilustraciones/` o `galeria/fotos/` |
| 4 | **Logo oficial** | Cuando se NOMBRA una marca | `hermes-content/references/brand-claude/` (Claude, Claude Code, Anthropic). Nunca recrear un logo. Otras marcas: pedir permiso para bajar su logo oficial y guardarlo ahí |
| 5 | **Captura real** | Mostrar producto o pantalla | Captura de la pantalla real (nunca una UI inventada) |
| ⛔ | Google / Pinterest | — | No se publica una foto ajena sin licencia. Google solo sirve para encontrar el kit de prensa OFICIAL de una marca |

Calidad mínima: 1.800 px en el lado largo (Pexels `large2x`, Unsplash 2048, Higgsfield 2k).
La galería guarda JPEG ≤ 2048 px (un PNG de Higgsfield pesa ~5 MB; el JPEG ~400 KB).

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

- Papel tibio con textura (`oklch(97.4% 0.012 85)`), tinta casi negra, **un** acento: verde
  ONIA profundo (`oklch(47% 0.11 158)`) para la palabra clave.
- Letras: Bricolage (títulos, local en `hermes-content/brand/fonts/`), DM Sans (texto),
  Caveat (manuscrita: subtítulos, flechas, sello), Instrument Serif (nombre bajo un logo).
- Nada de pills, tarjetas decorativas, header ni footer repetidos: solo etiqueta `NN/TT · SERIE`,
  el handle chico y la flecha de continuidad.

## 5. Control de calidad antes de mostrarle algo a Sergio

1. **Mirar la imagen sola** antes de montarla: sin letras, sin logos inventados, sin caras.
   Si falla, se regenera SOLO esa.
2. **Mirar la hoja de contactos** (`_contactsheet.png`) entera. Ninguna lámina con más de un
   40 % vacío; ninguna con un párrafo chico; título legible en el celular.
3. Toda lámina sin imagen ni `visual` necesita texto propio (antes el pack rellenaba con una
   frase fija que se publicaba).
4. Cifras y fechas con fuente (en el caption, no en la lámina).

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
  del script (`STYLES` en `scripts/carousel_images.mjs`: `foto`, `acuarela`, `objeto`).

## 7. Skills de diseño que se cargan con esta

`impeccable` (register brand; las leyes de color/tipo/layout) · `design-dna` (sacar tokens de
una referencia nueva) · `banner-design` (piezas sueltas) · `hyperframes` (si la lámina se anima).
