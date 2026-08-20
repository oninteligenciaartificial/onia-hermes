# Open Carrusel — agente de Claude para carruseles de Instagram (vs. Canva)

- **Fuente:** https://www.instagram.com/p/DXJF-w8gh6R/ · 69.1 s · con voz (locución del creador)
- **Visto:** 2026-08-11 (Gemini nativo + Whisper)
- **Archivo:** `Instagram-DXJF-w8gh6R.mp4` (no versionado)
- **Lectura completa + transcripción literal:** [transcripciones/2026-08-11-Instagram-DXJF-w8gh6R.md](transcripciones/2026-08-11-Instagram-DXJF-w8gh6R.md)

## Qué dice realmente

Demo/anuncio de **"Open Carrusel"**, un repo open source que se instala como agente de
Claude Code para generar carruseles de Instagram. Abre con *"Cloud acaba de matar a
Canva"* — el rótulo fijo en pantalla dice literalmente "Crea carruseles de Instagram con
Claude" y la lectura de Gemini confirma que es Claude; Whisper transcribe "Claude" como
"Cloud" (y el nombre del repo como "OpenCursor") en las 27 líneas del verbatim, error
fonético consistente, no dato nuevo.

Flujo que muestra:

- **00:08-00:18** — clonar/descargar el repo de GitHub, abrir Claude en la carpeta, correr
  el comando `/start`.
- **00:18-00:28** — subir capturas de carruseles de referencia para que Claude "las
  estudie", o pedirle que busque inspiración en internet sobre un tema.
- **00:28-00:38** — configurar marca (tipografías, paleta, logo); queda guardado para
  reusar en carruseles futuros.
- **00:38-00:46** — genera las diapositivas en vivo dentro de la app; los cambios de diseño
  o texto se piden por chat.
- **00:46-00:54** — exporta a PNG en formato cuadrado, vertical o historia, con las medidas
  exactas de Instagram.
- **00:54-01:08** — el diseño se guarda como *template* para reutilizar. Cierra con
  "comentá qué carrusel vas a hacer y te mando la guía por DM" — el mismo gancho
  comentario→DM que ya está anotado como patrón transversal en `INDEX.md`.

El video no muestra en ningún momento el resultado final en calidad real (solo un slide a
medio construir) ni el mecanismo detrás del render: un LLM no dibuja píxeles solo, tiene
que haber una capa de código (HTML/CSS + captura, o una API de imagen) que el video oculta
detrás de "se lo pides a Claude" — igual que oculta si esa capa tiene costo.

## Veredicto: HUMO

Vende como novedad algo que ONIA ya construyó, y con más sustancia. "Agente de Claude que
arma carruseles" es exactamente lo que hace nuestro propio pipeline —
`hermes-content/carousels/CAROUSEL_SYSTEM.md` + `scripts/carousel_render.js` + skill
`carruseles-onia`—: brief → render HTML/CSS con Chrome headless → PNG on-brand →
publicación en IG. El nuestro ya tiene 4 cuentas con brand kits propios (ONIA, Arthur,
Sergio, Nuvia), reglas de maquetación fijas y checklist de calidad antes de publicar; el
video ni lo menciona porque no compite con eso, compite con Canva para el público general.

La apertura ("mató a Canva") es la clase de afirmación que hay que tratar con dureza: no
prueba un resultado terminado, no muestra código, no dice qué corre detrás del render ni
si el "gratis" tiene algún costo escondido (tokens, API de imagen). Cierra, además, con el
mismo gancho comentario→DM que ya catalogamos como técnica de captación estándar, no como
hallazgo de producto.

Lo único genuinamente accionable no salió del video — salió de compararlo con lo nuestro:
`scripts/carousel_render.js` tiene los 4 packs fijos en `1080x1350` (verificado en el
código, se repite igual en cada pack); cuadrado (1080×1080) e historia (1080×1920) no
existen hoy. Eso sí es un gap real y barato de cerrar, con el mismo motor que ya tenemos.

## Para qué nos sirve

| Frente | Acción concreta |
|---|---|
| marketing con IA (carruseles ONIA) | Sumar export cuadrado (1080×1080) y story (1080×1920) a `scripts/carousel_render.js`; hoy los 4 packs están fijos en 1080×1350 |
| marketing con IA (carruseles ONIA) | No clonar ni instalar "Open Carrusel"; nuestro pipeline (brief→render→publish, 4 cuentas, checklist) ya hace más y con marca propia |
| Contenido / ventas | Gancho "comentá X → te mando la guía por DM" se repite; ya está anotado como patrón transversal en INDEX.md, no tratarlo como hallazgo nuevo en próximos videos de esta tanda |

## Riesgo

Clonar y correr un repo de terceros descubierto en un reel (`/start` sin auditar el
código) es ejecutar software no verificado — si algún día se evalúa en serio, revisar el
código primero, nunca instalar solo porque el demo se ve bien. Tampoco repetir el "gratis"
como dato cierto: el video no dice qué corre detrás del render; VERIFICAR antes de
mencionarlo a un cliente.
