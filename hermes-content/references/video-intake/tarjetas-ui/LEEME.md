# Tarjetas UI animadas — Onia Platform

Micro-animaciones de interfaz con los tokens reales del producto (verde `#027650`,
Manrope/Inter, Material Symbols). Motor: HyperFrames. 1080x1080 · 30fps · loopeables
(entran y salen por el mismo vector). Datos de muestra genéricos, sin clientes reales.

| Tarjeta | Qué explica el movimiento |
| --- | --- |
| `factura-emitida.mp4` (4 s) | La factura se EMITE: entra el documento, corre la barra de emisión y el estado aterriza en "Emitida" con check. |
| `cobro-qr.mp4` (5 s) | El cobro se COMPLETA: la línea de escaneo recorre el QR, pausa, y el check confirma "Cobro confirmado · Bs 350". |
| `alerta-agente.mp4` (5 s) | El agente PROPONE y ESPERA: llega la alerta, suben Aprobar/Ver detalle, la barra de espera corre y un pulso señala Aprobar (human-in-the-loop). |
| `ingresos-contador.mp4` (4,5 s) | El ingreso SUBE: el contador tickea hasta Bs 12.450, las barras crecen mes a mes y el delta +18% llega con el pulso de la barra actual. |

Fuente de verdad (editar ahí, no acá): `scripts/hyperframes/compositions/tarjetas-ui/<nombre>/index.html`.
Re-render: `npx hyperframes render <carpeta> --format mp4 --quality high --fps 30 --output <salida>.mp4`.

Fuentes autohospedadas en cada composición: Manrope e Inter (OFL, Google Fonts) y
`material-symbols-outlined.woff2` (Apache 2.0, copiado de `onia-platform/public/fonts/`).
