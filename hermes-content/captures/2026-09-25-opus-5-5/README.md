# Capturas reales · Claude Opus 5.5 · 25-sep-2026

Material de la tanda
[`docs/contenido/piezas/guiones/2026-09-25-opus-5-5-migracion.md`](../../docs/contenido/piezas/guiones/2026-09-25-opus-5-5-migracion.md).

## Qué garantiza cada toma

Todo sale de páginas oficiales **reales**, grabadas con `scripts/contenido/capturar-web.mjs`:

- sin login, en un contexto nuevo, bloqueando todo pedido que no sea de lectura;
- **cada toma verificó en la página el texto que el guion afirma**, y si no estaba, fallaba;
- el detalle de cada una (URL, título, estado HTTP, textos verificados, región focal de cada foto
  y hash del video) está en `manifest.json`.

Lo que **no** es de la página:
- el recuadro o resaltado verde y el cursor, que son edición encima;
- los banners de cookies, que están ocultos.

Las fotos de la página del anuncio salen sin sus imágenes: la red de la sesión de nube bloquea
`www-cdn.anthropic.com`. El texto es el real. La portada con imagen está en las capturas de Codex
del 22-sep (rama `codex/marca-comunidad-plan`, sin integrar), tomadas desde la PC de Sergio Urcullo.

## Las tomas

| Toma | Fuente | Qué muestra | Fotos |
|---|---|---|---|
| `A1-anuncio-portada` | anuncio | nombre del modelo y fecha. La fecha se verificó mirando: no está en el texto de la página | `portada` |
| `A2-anuncio-costo` | anuncio | "at default settings it will cost 40% less…", "$4 and $20 per million, 20% less", caché a $0.20 (−60%) | `40-por-ciento`, `4-y-20`, `cache` |
| `A3-anuncio-fast-mode` | anuncio | fast mode: hasta 2,5×, a US$8 / US$40 | `fast-mode` |
| `A4-anuncio-disponible` | anuncio | todas las plataformas y `claude-opus-5-5` | `model-id` |
| `M0-migracion-400` | guía | "Where an item says a setting is rejected, the API returns a 400 error." | `400` |
| `M1-migracion-cinco-reglas` | guía | thinking, effort (default medium), tool_choice, sampling y prefill, una marca por vez | `1-thinking` … `5-prefill` |
| `M2-migracion-comando` | guía | `/claude-api migrate this project to claude-opus-5-5` | `comando` |
| `M3-migracion-effort-y-errores` | guía | "Set effort explicitly: the default is medium" y los dos mensajes de error literales | `effort-explicito`, `error-thinking`, `error-tool-choice` |
| `V1-vertical-cinco-reglas` | guía, **en formato teléfono** (540×960 × 2 = 1080×1920) | las reglas, para un beat vertical a pantalla completa | `1-thinking`, `3-tool-choice`, `4-sampling`, `5-prefill` |
| `carrusel/K*` | guía, en viewport de teléfono (390×844 × 3) | las fotos que usa el carrusel; recortes en `carrusel/recortes/` | — |

Fuentes:
- anuncio: <https://www.anthropic.com/claude-opus-5-5>
- guía: <https://platform.claude.com/docs/en/models/opus-5-5/migration-guide>

## Cómo usarlas en la edición

- **Videos:** H.264, 60 fps, 2880×1800 (1440×900 × 2), con scroll suave, cursor grande y la marca
  entrando en cada beat. Para el layout partido (apoyo arriba, 1080×~1056), usar la
  `region_px` de la foto del mismo beat como región focal: el recorte cuadrado va centrado ahí.
- **Fotos:** `<toma>-<foto>.png` lleva la marca; `<toma>-<foto>-limpia.png` es el mismo cuadro
  sin marca ni cursor.
- **Vertical a pantalla completa:** `V1-vertical-cinco-reglas.mp4` ya está en 1080×1920.
- **`_hoja.png`:** hoja de contacto para mirar todo de un vistazo. Mirar la hoja no reemplaza
  abrir cada foto.

## Regenerar (si pasaron más de 7 días, antes de grabar)

```bash
node scripts/contenido/capturar-web.mjs hermes-content/captures/2026-09-25-opus-5-5/plan.json
node scripts/contenido/capturar-web.mjs hermes-content/captures/2026-09-25-opus-5-5/carrusel/plan.json --sin-video
node scripts/contenido/recortar-capturas.mjs hermes-content/captures/2026-09-25-opus-5-5/carrusel/manifest.json
```

Si la guía cambió, **la toma falla sola** y dice qué texto ya no está: ése es el aviso de que el
guion hay que reescribirlo, no la captura.
