# Santiago Muñoz: carruseles de Instagram con Claude Code (método extraído)

Investigación del 2026-09-29. Convención: **[VISTO]** = leído u observado en la fuente;
**[INFERIDO]** = deducción mía, no dicha por él.

## TL;DR

- **Sí existe el tutorial.** [VISTO] YouTube "Automaticé Mis Carruseles De Instagram Con Claude Code",
  canal Santiago Munoz (@SantiMunozIA), 2026-03-04, 21:35.
- **Su método NO es HTML a imagen.** [VISTO] Es un *skill* de Claude Code con un script Python
  que manda un prompt por slide a **Kie AI, modelo `nano-banana-pro`**. **La IA dibuja la slide
  entera, texto incluido.** Formato 4:5, 1080x1350.
- **Choca con la regla de ONIA** (texto siempre por código). Lo que conviene copiar es el
  *flujo* (brief, bloque de estilo fijo, aprobación, generación en lote, regenerar solo una slide).
  No conviene copiar el texto dentro de la imagen.
- Él mismo usa el modelo híbrido en otro skill suyo. [VISTO] En `historias-ig-skill`, Kie AI
  genera el fondo y Pillow escribe el texto encima (`draw_text`).

---

## 1. Fuentes encontradas

| Fuente | Fecha | Qué vi realmente |
|---|---|---|
| YouTube `1Ffz4LIhQMg` "Automaticé Mis Carruseles De Instagram Con Claude Code" (https://www.youtube.com/watch?v=1Ffz4LIhQMg) | 2026-03-04 · 21:35 · ~27k vistas | Descripción completa, **transcripción automática completa** (es), fotogramas del minuto 0:00-1:15 (15 capturas cada 5 s + 5 recortes de slides). Sin capítulos. |
| Prompt público enlazado en la descripción (Google Doc `1XNyEOtFMGZjddJwN7GB-2t71n1Sq7F3m69z2zKn00l4`) | s/f | Texto completo: el prompt inicial que le da a Claude + la documentación pegada de la API de Kie (`createTask` / `recordInfo`). |
| GitHub `santmun/carruselesdef` ("Carruseles Automaticos") | último push 2026-08-09 | `README.md`, `.claude/skills/carousel-gen/SKILL.md` completos y `scripts/generate-carousel.py` (51 KB) leído por partes: constantes, plantillas de prompt, llamadas a la API, paralelismo. |
| GitHub `santmun/carousel-horizontes-ia` y `santmun/instagram-carousel-generator` | 2026-07 | Árbol de archivos y `templates/carousel-prompts.json` (guía de estilo en JSON). Son la versión anterior del mismo sistema: agente + skill + script. |
| GitHub `santmun/historias-ig-skill` y `santmun/instagram-stories-skill` | 2026-08 | `scripts/generate.py` (el texto lo escribe Pillow sobre un fondo de Kie AI) y `knowledge/06-render-workflow.md` (qué hace la IA y qué no). |
| YouTube `q8eY3MrzmuU` "Genera Posts de Instagram Automáticos con IA" (n8n) + su Google Doc de prompt | 2025-11-26 · 54:15 | Descripción y prompt completo: un prompt de sistema con "ELEMENTOS FIJOS" para mantener la coherencia visual. Es la versión anterior, con n8n en vez de Claude Code. |
| YouTube `HgLMVWKeexI` "Este Agente IA Genera Carruseles Virales en Segundos" | 2025-04-29 | Sólo la descripción. Versión con n8n y OpenAI. |
| TikTok `@sanmunoz.ia/video/7613430195395022100` | 2026-03-04 (decodificado del ID) | Sólo el oEmbed: caption "Claude code 🙏🏻 #ia #claude". Los buscadores lo indexan como "Genera Carruseles Rápidos con Claude Code". No vi el video. |
| Reel IG `Ddz9G7KIEfT` (el que pasó el usuario) | 2026-09-28 | Sólo metadatos: caption "Opus 5.5 esta en otro nivel #ia #claude". **No trata de carruseles.** |
| YouTube `5REPWhjX64A` "Contraté a Claude como animador y esto pasó" | 2026-09 | Sólo el título (oEmbed). Es de animación, no de carruseles. [INFERIDO] Su repo `video-estilos-pro` (2026-09-26) probablemente es el material de ese video. |

No revisé (fuera de alcance): el repo `carruanimados`, que hace carruseles animados con Nano Banana 2,
Kling 2.6 y Remotion, y el `generate-carousel.py` línea por línea.

## 2. El método paso a paso (tal como lo enseña)

**Herramientas** [VISTO]:
- Claude Code (app de escritorio, modo "omitir permisos").
- VS Code, para ver los archivos.
- **Kie AI** (kie.ai): un agregador de modelos que se recarga con créditos. Usa el modelo `nano-banana-pro`.
- Python con `requests`, `python-dotenv` y `Pillow`.
- Opcional: **Upload-Post**, para publicar (le pasa a Claude la URL "LLM Context" de su documentación).

**Pasos del tutorial** [VISTO en la transcripción]:
1. Crea una carpeta `carruseles` y abre un proyecto de Claude Code ahí.
2. Explica la diferencia entre skill (un manual de instrucciones), plugin (herramientas externas)
   y agente (el que delega). Lo que va a construir es un **skill**.
3. Pega el prompt inicial. Pide:
   - un skill conectado a Kie AI con Nano Banana;
   - un comando del tipo "crea un carrusel sobre X / este guion / este video";
   - coherencia portada → slides medias → CTA;
   - que tengan texto ("nano banana es muy bueno para escribir");
   - prompts detallados y estilo constante;
   - estilo animado, rojo y blanco, para un canal de IA;
   - "si tienes preguntas, hazlas antes";
   - la documentación de la API pegada;
   - "checa la lógica para que no haya timeouts".
4. Claude le hace preguntas. Él contesta: 7 slides, script en Python, aspect ratio 4:5
   (recomendado), API key en `.env`.
5. Claude hace el plan y genera el proyecto. Si no aparece la carpeta `skill`, le pide
   "transformá esto en un skill". Queda invocable como `/carrusel`.
6. Crea una API key en Kie, la pega en `.env.example` y lo renombra a `.env`.
7. En una sesión nueva ejecuta `/carrusel genera un carrusel sobre las mejores herramientas de IA en 2026`.
   El skill corre 4 pasos: planificar las 8 slides → escribir `plan.json` → escribir un prompt
   por slide → generar las imágenes con Kie (de 1 a 5 min). Se ven los jobs "en proceso" en el
   registro de Kie.
8. Las imágenes quedan en `outputs/`.
9. Dice que la calidad que muestra "me tomó muchos intentos" y que lo más difícil fue la tipografía.
   Recomienda darle a Claude capturas de ejemplo ("quiero algo similar pero con estos colores").
10. Cierra ofreciendo el skill en su comunidad (iahorizontesacademy.com): "instala este skill"
    con un enlace de GitHub.

**Costo** [VISTO]: dice US$0,09 por imagen en el video; el SKILL.md dice ~US$0,10 por imagen,
o sea ~US$0,70 por un carrusel de 7 slides.

**Cómo funciona el skill publicado (`carruselesdef`)** [VISTO en el código y en SKILL.md]:
- Comando: `/carousel-gen [tema] [n_slides]`. Por defecto hace 7 slides.
- **Paso 0 (invisible):**
  - arma el `bundle_id` como `YYYY-MM-DD-slug`;
  - crea `outputs/bundles/<id>/carousel/assets`;
  - revisa que `.env` tenga `KIE_AI_API_KEY`;
  - **Claude mismo escribe el contenido** en `repurpose-pack.md`, con bloques `### SLIDE N - Título`
    y de 2 a 4 bullets por slide. No llama a ningún LLM externo.
- **Paso 1:** corre `generate-carousel.py <id> --dry-run`. Muestra la **tabla del brief**
  (#, slide, tipo, entidades detectadas) y **pide OK** antes de generar.
- **Paso 2:** pregunta por imágenes de referencia por slide (`portada-ref.png`, `ref-N.png`, más
  `urls.json`). Se mandan como `image_input`, hasta 8 URLs.
- **Paso 3:** si detecta herramientas nombradas (n8n, ChatGPT, Claude, Make, WhatsApp, Zapier, etc.),
  pide la URL del logo real. El logo se integra después con `google/nano-banana-edit`, así no
  quedan logos inventados.
- **Paso 4:** `PYTHONUNBUFFERED=1 python3 scripts/generate-carousel.py <id> --skip-interactive`.
  - Parámetros fijos del script: `ASPECT_RATIO="4:5"`, `RESOLUTION="2K"`, `FORMAT="png"`.
  - Hace polling de `recordInfo` cada 5 s, con un máximo de 60 intentos (5 min).
  - **Todas las slides van en paralelo** con `ThreadPoolExecutor`.
  - Si una falla, se regenera sola con `--regenerate-slides "2,4"`.
- **Salida:** `carousel-01..NN.png`, `manifest.json` y `carousel-assets-needed.md`.

**Cómo se arma el prompt de cada slide** [VISTO]:
- Hay una base común: `Instagram carousel slide (1080x1350px, ratio 4:5). STYLE: Hand-drawn
  watercolor and colored pencil illustration...`.
- Sobre esa base, cada tipo de slide (portada / contenido / cierre) agrega su bloque:
  - BACKGROUND con hex (#F5F1E8, #FAF9F6, #FFFFFF);
  - MAIN ILLUSTRATION;
  - TEXT CONTENT (el texto literal de la slide va dentro del prompt);
  - TEXT STYLING (tamaño en pt y color #1A365D);
  - DECORATIVE ELEMENTS;
  - COMPOSITION (porcentajes por zona y márgenes seguros de 60 px).
- En la versión con n8n usa el mismo principio, explícito en su prompt: "Cada prompt debe comenzar
  con los elementos fijos del fondo y estilo, luego agregar los elementos específicos de esa slide".
  Ese es su mecanismo de coherencia.

## 3. Estructura de sus carruseles

[VISTO en los fotogramas de los carruseles publicados en su IG, minuto 0:45-1:10 del video, y en el SKILL.md]:
- **Portada:**
  - titular grande arriba, sans redondeada bold, azul marino sobre papel crema;
  - una **ilustración protagonista enorme** en acuarela y lápiz de color (mascota, logo en 3D con
    personajes chicos alrededor);
  - 2-3 líneas en itálica abajo con el dato gancho (ej. "167,000 estrellas en GitHub en semanas");
  - handle chico abajo a la derecha.
- **Interiores:**
  - fondo blanco o crema con un lavado de acuarela en una esquina;
  - título (a veces en mayúsculas: "LO QUE SIGNIFICA", "DISPONIBILIDAD");
  - **una ilustración conceptual** (celular con claqueta, chip "10x" con tortuga y liebre, mapa con globo);
  - de 2 a 4 bullets con ✓ o viñetas.
- **Cierre:**
  - ilustración arriba (mano sacando un diario de un bolsillo);
  - **caja dibujada a mano** con "Hasta la próxima semana / Guarda este carrusel... Sígueme para
    no perderte el siguiente";
  - **@sanmunoz.ia grande**.
  - Regla escrita: el cierre "NUNCA debe decir CTA".
- **Formato de serie:** noticias semanales de IA ("5 noticias de IA que debes saber esta semana",
  "GPT-5.3 Codex: una app en 25 horas", "Nvidia Vera Rubin: 10x más potente"). Largo: 7-8 slides
  (vi `img_index=8` en un cierre).
- **Caption** [VISTO]: resumen con bullets + "Guarda este carrusel para cuando...".
- **Estilo:** el mismo en todas las piezas (acuarela hand-drawn, pasteles, sin fotos ni personas:
  "SIN avatares de personas"). [INFERIDO] El estilo es su marca; copiarlo nos haría parecer él.

## 4. Comparación con nuestro pipeline

| Pieza | Santiago | ONIA hoy | ¿Falta? |
|---|---|---|---|
| Quién escribe el contenido | Claude, dentro del skill (`repurpose-pack.md`) | Claude escribe el brief JSON a mano en `hermes-content/carousels/briefs/`. `scripts/carousel_pipeline.js` todavía llama a `scripts/carousel_generator.py` (Python + `OPENAI_API_KEY`) | Nada. Para esto, el pipeline sobra: el brief lo escribe Claude |
| Texto | Lo escribe la IA dentro de la imagen | HTML/CSS renderizado con Edge headless (`scripts/carousel_render.js`), 1080x1350 / 1080x1080 / 1080x1920 | **Nosotros vamos mejor**: tildes exactas, editable, cero costo al corregir una coma |
| Imágenes | Una generación por slide, en paralelo, Kie AI | Manual: `slide.bg` por slide (portada y cierre en `community-editorial`), `visual.type:'screenshot'` para meter una imagen en los interiores (`scripts/carousel_pack_editorial.js`), `npm run image:openai` para recortes | **Sí**: no hay un paso que tome los prompts del brief y genere las imágenes en lote con cotización y aprobación |
| Bloque de estilo fijo | Prefijo común en todos los prompts + guía JSON (`carousel-prompts.json`) | Existen tokens CSS del texto (`hermes-content/brand/tokens.css`); **no hay un prefijo canónico de prompt de imagen ONIA** | **Sí** |
| Interiores con imagen | Ilustración en cada slide | `community-editorial` usa `paper-grid` en los interiores; la foto sólo entra en portada y cierre. Una imagen en el interior sólo cabe como `screenshot` (etiqueta por defecto "PRODUCTO REAL") | **Parcial**: falta un `visual.type` para ilustración o foto (o reusar `screenshot` con otra `label`) |
| Aprobación previa | Tabla del brief con dry-run + "¿te parece bien?" | Regla del skill (`hermes-content/skills/carruseles-onia.md`) + gasto de Higgsfield con `generate cost` y aprobación del lote (CLAUDE.md, 2026-09-22) | Nada. Hay que unir la tabla del brief con la cotización |
| Logos reales | Logo por URL + `nano-banana-edit` | Regla: logos sólo cuando se nombran; nunca inventar UI; memoria "soul_2 inventa marcas" | [INFERIDO] Con texto y logos por código (SVG/PNG en HTML) el problema desaparece |
| Regenerar una slide | `--regenerate-slides "2,4"` | Re-render gratis; las imágenes se regeneran a mano | Menor: un flag por slide en el paso de imágenes |
| Revisión visual | Mirar `outputs/` | `scripts/carousel_contactsheet.js` (grilla de todas las slides) | Nada |
| Publicación | Upload-Post (sugerido) | `scripts/carousel_publish.js`, `scripts/carousel_to_postiz.mjs` | Nada |
| Tests | Ninguno | `scripts/carousel_render.test.js` | Nada |

Otras notas:
- **Proveedor** [INFERIDO]: Kie AI sería una cuenta y un gasto nuevos. Ya tenemos plan de
  Higgsfield (CLI oficial, cotizar antes de crear). **No abrir Kie.**
- **Python** [INFERIDO]: `carruseles-onia.md` dice que "la PC de Sergio no tiene Python", pero hoy
  existe `C:/Users/PC/AppData/Local/Programs/Python/Python312` (de ahí corre `yt-dlp`). El dato del
  skill está desactualizado. La dependencia de `OPENAI_API_KEY` sigue en pie. Queda **pendiente
  corregir el skill**; no lo toqué.

## 5. Receta propuesta para ONIA (código + Higgsfield; texto siempre por código)

1. **Brief primero, lo escribe Claude.** Va en `hermes-content/carousels/briefs/<slug>.json`, con la
   secuencia del skill: dolor → plata → causa → producto real → mecanismo → control → CTA.
   Cada slide lleva `headline`, `body` y `visual`. Donde haga falta una imagen se suma
   `image: { prompt, ref?, uso: "bg"|"ilustracion" }`. **El prompt nunca lleva el texto de la slide.**
2. **Bloque de estilo fijo ONIA**, a la manera de sus "ELEMENTOS FIJOS":
   - un solo prefijo reutilizable (luz, paleta con acento verde restringido, encuadre, textura);
   - siempre cierra con `no text, no letters, no numbers, no logos, no watermark, clean negative space in <zona del titular>`;
   - se antepone a todos los prompts del carrusel.
3. **Reusar antes de generar.** Primero `hermes-content/assets/onia/automation-node-clean-3d.png`,
   `hermes-content/references/marca-personal/higgsfield-artes/` y las capturas reales del tenant demo
   (el producto va siempre en UI real, nunca IA). Sólo se genera lo que no existe.
4. **Tabla del brief + cotización en una sola pantalla:** slide / rol / texto / ¿imagen nueva o
   reusada? / modelo / `higgsfield generate cost`. Total del lote → **aprobación explícita de
   Sergio Urcullo** para ese lote.
5. **Generar con la CLI de Higgsfield** en 4:5 (o más grande y recortar). Los IDs de modelo se
   resuelven en vivo. Salida en `hermes-content/carousels/out/<slug>/assets/slide-NN.png`, con un
   `manifest.json` que guarde prompt, modelo, parámetros y costo.
6. **QA de cada imagen sola, antes del texto:**
   - que no tenga letras fantasma ni logos inventados;
   - que quede espacio libre donde va el titular;
   - que la persona o la escena sean coherentes entre slides.
   Si falla, se regenera **sólo esa**.
7. **Cablear en el brief:**
   - `slide.bg` para portada y cierre (ya funciona en `community-editorial`);
   - en los interiores, hoy `visual: { type: "screenshot", file, label, fit: "cover" }`.
   [PENDIENTE, no hecho] Agregar un `visual.type: "ilustracion"` en `scripts/carousel_pack_editorial.js`
   para no tener que llamarlo "PRODUCTO REAL".
8. **Render del texto por código:**
   `node scripts/carousel_render.js --brief <brief> --out <dir> --pack community-editorial --format feed`
   da PNG de 1080x1350 con tipografía, tildes, footer `@oniahq` y CTA en HTML.
9. **Mirar el conjunto:** `node scripts/carousel_contactsheet.js --dir <dir>`, abrir la grilla y
   pasar el checklist y el gate anti-plantilla de `carruseles-onia.md`.
10. **Iterar barato:** si falla el texto, se corrige el brief y se re-renderiza (gratis). Si falla
    la imagen, se regenera sólo esa slide (con costo y aprobación).
11. **Caption + aprobación de publicación** ("Apruebo publicar <carrusel>") → `scripts/carousel_publish.js`
    o `scripts/carousel_to_postiz.mjs`.
12. **Cerrar el aprendizaje en el skill:** editar `hermes-content/skills/carruseles-onia.md` con el
    paso de imágenes en lote y el bloque de estilo fijo, en vez de crear un doc suelto
    (pendiente, sujeto a OK).

**Qué NO copiar:**
- el texto dentro de la imagen;
- Kie AI como proveedor nuevo;
- su estilo acuarela (es su identidad);
- "sin personas" (el piso de ONIA pide portada humana o fotográfica);
- el modo "omitir permisos" de Claude Code.

**Qué SÍ copiar:**
- el skill con un comando;
- Claude escribe el contenido;
- la tabla del brief y el OK antes de gastar;
- el prefijo de estilo fijo;
- las referencias por slide;
- la generación en lote en paralelo;
- regenerar por slide;
- la carpeta por bundle con `manifest.json`.
