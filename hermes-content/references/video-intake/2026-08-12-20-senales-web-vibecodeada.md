# 20 señales de que una web fue "vibecodeada"

- **Fuente:** https://www.instagram.com/p/Db6FKG4O_WU/ · 48 s · talking-head con subtítulos
- **Visto:** 2026-08-12 (Gemini nativo + Whisper)
- **Archivo:** `Instagram-Db6FKG4O_WU.mp4` (no versionado)
- **Lectura completa + transcripción literal:** [transcripciones/2026-08-12-Instagram-Db6FKG4O_WU.md](transcripciones/2026-08-12-Instagram-Db6FKG4O_WU.md)

## Qué dice realmente

Un tipo a cámara enumera, sin mostrar pantalla ni código, 20 síntomas de una web hecha
a las apuradas con IA. Rótulo fijo arriba: *"20 señales de que tu website fue Vibecodeado"*.
La lista, agrupada:

- **Deploy / entrega (1):** sigue en una URL `*.vercel.app`.
- **HTML servido (2-3, 9-11, 16):** view-source vacío (todo se pinta en cliente), sin
  página 404, varios H1 o ninguno, sin tag canónico, sin atributo de idioma.
- **Metadatos (5-8):** mismo `<title>` en todas las páginas, sin meta descripción,
  sin OG image, sin datos estructurados.
- **Archivos de raíz (12-15):** sin `llms.txt`, `robots.txt` bloqueando a los bots de IA,
  sin favicon, sin sitemap.
- **Accesibilidad (17):** falta texto alternativo en imágenes.
- **Build (4, 18-20):** Vite + React para todo, sourcemaps expuestos en producción,
  errores en consola, bundle de JS gigante.

Cierre = cebo de comentarios: pide comentar la palabra **"WEBSITE"** a cambio de
"más información". No hay demo, no hay herramienta, no hay cómo arreglarlo.

**Nota de lectura:** el verbatim de Whisper viene degradado ("vaycodeado", "versel.app",
"lm.txt", "tiene la ida"). La fuente confiable acá es el texto en pantalla, no el audio.

## Veredicto: MEJORA LO ACTUAL

No aporta ninguna capacidad nueva ni enseña nada que no esté en cualquier guía de SEO
técnico desde hace diez años; el envoltorio "vibe coding" y el CTA de comentarios son
puro alcance. Pero **la lista es un checklist ejecutable y nos toca de lleno**: en este
worktree, `web-factory/apps/onia-platform` y `apps/dentalgest-landing` **no tienen**
`robots.ts`, `sitemap.ts`, `not-found.tsx`, `canonical`/`metadataBase` ni OG image
(esta última, decisión consciente documentada en el layout: esperar captura real del
sistema). `lang="es"` sí está en ambos. Nuestro gate hoy es `tsc --noEmit` + e2e +
code-reviewer: cubre que compile, no que sea indexable.

Tres ítems de los 20 son opinión, no defecto, y no se copian:

- **"Vite + React"** no es una falla — es un stack. Nosotros usamos Next.js; el síntoma
  real que él describe (view-source vacío) es SPA sin SSR, no la herramienta.
- **`robots.txt` bloqueando la IA** es una decisión de negocio, no un error.
- **`llms.txt`** es una propuesta comunitaria; que los buscadores o los LLM la usen como
  señal está **a verificar** — no gastar tiempo ahí antes que en sitemap y canonical.

## Para qué nos sirve

| Frente | Acción concreta |
|---|---|
| web-factory | Convertir los 17 ítems válidos en un checklist de pre-entrega y agregarlo al gate junto a `tsc --noEmit` |
| web-factory | Cerrar lo que falta en `onia-platform` y `dentalgest-landing`: `robots.ts`, `sitemap.ts`, `not-found.tsx`, `metadataBase` + canonical |
| web-factory | Verificar que ninguna web entregada quede viviendo en `*.vercel.app` (el repo referencia uno en `data/clients/nuvia.design.json`) |
| Ventas | La misma lista sirve de auditoría gratis al prospecto: se le muestra qué le falta a su web actual, sin regalar el arreglo |
| Contenido | Formato barato y replicable (una toma, subtítulos, lista); el cebo de comentarios NO se copia — el token de Instagram sigue bloqueado (S6) |

## Riesgo

Usar la lista como argumento de venta se vuelve bumerán si nuestras propias landings
fallan los mismos ítems: hoy fallan varios. Cerrar la casa antes de auditar la ajena.
Y el ítem "OG image" no se cierra con una imagen inventada — la regla del layout es
esperar una captura real del sistema, no un mockup.
