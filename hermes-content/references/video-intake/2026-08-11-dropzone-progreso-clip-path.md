# Dropzone con progreso animado — `@property` + `clip-path` + spring

- **Fuente:** https://www.instagram.com/p/Da0iDR4vl5M/ · 7,1 s · sin voz (efectos de sonido)
- **Visto:** 2026-08-11 (Gemini nativo)
- **Archivo:** `Instagram-Da0iDR4vl5M.mp4` (no versionado)
- **Lectura completa + transcripción literal:** [transcripciones/2026-08-11-Instagram-Da0iDR4vl5M.md](transcripciones/2026-08-11-Instagram-Da0iDR4vl5M.md)

## Qué dice realmente

Clip de 7,1 segundos, sin locución (solo pops/tonos de interfaz). Arriba, una zona
"Dropzone" (`Upload files` / `PNG, JPG, WebP, GIF or PDF · hasta 8 MB c/u · máx. 6 archivos`)
donde se arrastran y sueltan 4 archivos (`sneaker-lilac.webp`, `sneaker-mint.webp`,
`sneaker-terracotta.webp`, `brief.pdf`); el contador pasa de `0 of 4 uploaded` a `4 of 4
uploaded` mientras cada barra de progreso se llena de abajo hacia arriba. Abajo, el editor
muestra el código real (a diferencia del video del botón de carga, acá sí se lee):

- CSS: `@property --p { syntax: '<number>'; inherits: true; }` declara la variable `--p` como
  interpolable; `._file_img--ghost { filter: grayscale(1) brightness(.32); }` es la miniatura
  "todavía no llegó"; `._file_img--live { clip-path: inset(0 0 calc((1 - var(--p)) * 100%) 0); }`
  revela la imagen real en proporción exacta a lo subido.
- JS: `zone.addEventListener('drop', (e) => {...})` y `el.animate([...], { easing: SPRING })`.

Usar `@property` para poder animar una variable CSS y manejar `clip-path` con ella es una
técnica real (soporte nativo en navegadores modernos), no un efecto de humo. El detalle
`easing: SPRING` **no es sintaxis nativa de la Web Animations API** tal como se ve en
pantalla — ningún navegador trae de fábrica un easing llamado "SPRING"; lo más probable es que
venga de una librería que lo traduce a una curva `linear()`, o que el fragmento esté
simplificado para el reel. **Verificar el snippet completo antes de portarlo literal.**

## Veredicto: FUTURO — técnica real y barata, pero sin un dropzone propio esperándola hoy

La combinación `@property` + `clip-path` + Web Animations API es nativa del navegador (sin
librerías nuevas, sin costo, sin dependencias) y resuelve algo que sí nos va a hacer falta:
una barra de progreso por archivo que se vea pulida en una carga múltiple. Hoy no la usamos
porque no hay un dropzone en construcción ahora mismo — no es "SIRVE YA" por falta de un lugar
donde enchufarla ya, pero es la primera referencia a guardar para cuando se construya la carga
masiva de `Importación de productos` (fotos/CSV de catálogo) o cualquier subida de
comprobantes.

## Para qué nos sirve

| Frente | Acción concreta |
|---|---|
| Importación de productos | Guardar la técnica para el dropzone de carga masiva (fotos/CSV de catálogo) cuando se construya |
| Carrito de compra | Reusar la barra de progreso por ítem si el checkout llega a pedir comprobante o QR subido |
| web-factory | Técnica útil para cualquier upload de cliente (formularios de intake) que hoy se resuelve con spinners genéricos |

## Riesgo

Es una demo sintética (tienda de zapatillas de ejemplo), no un caso de ONIA. El fragmento
`easing: SPRING` puede no ser código que corra tal cual — confirmar la librería real antes de
portarlo. Los archivos mostrados son livianos (41-55 KB, y un PDF de apenas 21 bytes — casi
vacío): no valida cómo se comporta la técnica con archivos grandes o conexiones lentas, algo
relevante para clientes en Bolivia.
