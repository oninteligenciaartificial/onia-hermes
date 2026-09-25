# Capturas oficiales · Claude Opus 5.5 · 22-sep-2026

Material read-only para editar el guion 8. Fue capturado con Playwright y Google Chrome,
sin login ni almacenamiento persistente. El script bloqueó solicitudes `POST`, `PUT`,
`PATCH` y `DELETE`; el detalle quedó en `manifest.json`.

## Archivos

- `01-hero-launch.png`: nombre del modelo y fecha.
- `02-cost-and-speed.png`: precios, caché y claim de velocidad de Anthropic.
- `03-availability-model-id.png`: plataformas y `claude-opus-5-5`.
- `04-migration-thinking.png`: thinking no se puede desactivar.
- `05-migration-tool-choice.png`: tool choice forzado no soportado.
- `06-official-pages-scroll.webm`: captura cruda 1920×1080, VP8.
- `07-official-pages-scroll-clean.webm`: versión de edición de aproximadamente 20 s sin los 4 s iniciales de carga.
- `manifest.json`: URLs, coincidencias de texto y solicitudes bloqueadas.

## Uso en edición vertical

1. Hook: `01`, pantalla completa durante 1,5 s.
2. Precios: `02`, recorte a `$4`, `$20` y `$0.20` mientras aparece el cálculo propio.
3. Disponibilidad: `03`, subrayar `claude-opus-5-5`.
4. Migración: `04` y `05`, una advertencia por pantalla.
5. Usar `07-official-pages-scroll-clean.webm` sólo como transición; no dejar texto pequeño sin zoom.

Cuando se muestre 40 % o más de 30 %, rotular: `Según pruebas de Anthropic`.

## Regenerar

```powershell
npx playwright --version
node scripts/capture_opus_5_5_playwright.cjs
```

Después mirar las cinco imágenes y verificar el video con `ffprobe` antes de editar.
