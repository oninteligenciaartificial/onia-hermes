# Raylight.app — anuncio de plantillas de motion graphics pagas

- **Fuente:** https://www.instagram.com/p/DbyWzKwMc67/ · 34,2 s · inglés (locución)
- **Visto:** 2026-08-11 (Gemini nativo, video+audio completos)
- **Archivo:** `Instagram-DbyWzKwMc67.mp4` (no versionado)
- **Lectura completa + transcripción literal:** [transcripciones/2026-08-11-Instagram-DbyWzKwMc67.md](transcripciones/2026-08-11-Instagram-DbyWzKwMc67.md)

## Qué dice realmente

Anuncio hablado en inglés de la herramienta **Raylight.app**, dirigido a "founders" que
quieren marketear su producto (el verbatim completo, palabra por palabra con timestamps,
está en la transcripción). Recorre el guion clásico de venta de un SaaS:

- **00:00-00:05** — plantea el problema: un founder necesita que los videos de su producto
  se vean bien sin complicarse.
- **00:05-00:12** — presenta el catálogo de Raylight, elige la plantilla "Apple News+" y
  pulsa `Use for free` para abrir el editor.
- **00:12-00:18** — edita capas de texto y usa el botón `Swap source` para reemplazar
  imágenes por archivos locales, adaptando la plantilla a la marca del usuario.
- **00:18-00:28** — exporta con un clic; aclara que cada plantilla se puede probar gratis
  con marca de agua antes de pagar (o sea: quitar la marca de agua es de pago).
- **00:28-00:32** — panel de exportación: MP4, 1080p, 60 FPS.
- **CTA final (00:28-00:31)** — invita a entrar a Raylight para acelerar el flujo de
  trabajo.

Es un anuncio recto (guion de venta + cierre "gracias por ver este video"), no un
tutorial técnico: no explica cómo está hecha la herramienta, solo la vende.

## Veredicto: HUMO

Vende como novedad algo que ya es un commodity: marketplaces de plantillas de motion
graphics existen hace años (Envato Elements, Motion Array, Placeit y similares). La
promesa de video "con aspecto de $10.000 USD" es retórica de venta del propio anuncio —
**A VERIFICAR / no repetir esa cifra como dato real**, es una afirmación del vendedor, no
una métrica.

Para ONIA es doblemente irrelevante: ya existe motor propio para esto. El editor de video
interno usa HyperFrames (HTML → video) con skills de `motion-graphics`,
`talking-head-recut`, `embedded-captions`, etc. — la propia regla del CLAUDE.md del repo es
"orquesta, no reinventa el motor". Sumar una suscripción paga externa de plantillas
duplicaría capacidad que ya está construida, y además es exactamente el tipo de gasto que
requiere permiso explícito antes de siquiera evaluarlo (ver
[[gasto-plataformas-validar-primero]]).

## Para qué nos sirve

| Frente | Acción concreta |
|---|---|
| Editor de videos | Ninguna adopción — no sumar Raylight, ya cubrimos plantillas de motion graphics con HyperFrames/skills propias |
| Marketing con IA | A lo sumo, referencia de estructura de guion (founder → problema → demo → CTA) para anuncios propios, no como herramienta a comprar |

## Riesgo

Que se lea como "nos falta esta herramienta" y alguien pida acceso o pago a Raylight sin
permiso explícito — contradice la regla dura de gasto en plataformas externas. Si algún
día se evalúa en serio, primero VERIFICAR precio real y compararlo contra construir la
plantilla puntual en HyperFrames.
