# Tarjetas de micro-animación — ONIA Platform

Extiende el uso de HyperFrames de "editar video hablado" a **animar interfaz**: la UI real
del producto en movimiento, sin grabar pantalla y sin editor humano.

## Las 4 tarjetas

| Archivo | Qué muestra | Dur. |
|---|---|---|
| `compositions/factura-emitida.html` | fila de `/billing`: `#F-0042` cambia Borrador → Enviada y aparece el CUF del SIAT | 4,5 s |
| `compositions/cobro-confirmado.html` | el QR se convierte en check; badge Pendiente → Pagada | 4,5 s |
| `compositions/alerta-agente.html` | propuesta del agente Cobrador + "Aprobar y enviar" / "Rechazar" con cursor humano | 5,0 s |
| `compositions/contador-ingresos.html` | "Ingresos de hoy" contando a Bs 4.850,00 + delta +18,4 % + sparkline | 4,5 s |

Todas 1080x1080 @ 30 fps. `index.html` es la portada del set (no es una tarjeta).

## De dónde salen los elementos

No son maquetas inventadas: strings, estados y tokens salen del repo del producto
(`C:\dev\proyectos\onia-platform`).

- Tokens (`cards.css`): `app/globals.css` → `@theme` (verde Onia, superficies M3, Manrope + Inter).
- Badges y sus colores: `components/ui/Badge.tsx` (`paid`, `pending`, `draft`, `overdue`).
- Estados y labels de factura: `app/(dashboard)/billing/page.tsx` (`STATUS_LABELS`).
- Monto `Bs 1.250,00`: `lib/utils.ts` → `formatCurrency` (`Intl` es-BO / BOB).
- Agente "Cobrador — saldos vencidos" y el copy de aprobación:
  `lib/onia-core/modules/agents-runtime.ts` + `app/(dashboard)/pending/pending-client.tsx`.
- Hero de ingresos (label, aside, delta, facts): `app/(dashboard)/dashboard/page.tsx`.

**Los datos (paciente, montos, CUF) son de demo.** El CUF va abreviado a propósito para que
no se lea como un documento fiscal real.

## Cómo se renderiza

```bash
npx hyperframes check
npx hyperframes render . -c compositions/factura-emitida.html --quality high --output renders/factura-emitida.mp4
```

Las 4 de una:

```bash
for c in factura-emitida cobro-confirmado alerta-agente contador-ingresos; do npx hyperframes render . -c compositions/$c.html --quality high --output renders/$c.mp4; done
```

## Reglas que se respetaron

- El contador es seek-safe: tweenea un objeto y escribe el texto en `onUpdate`. Cero relojes,
  cero `Math.random` — cualquier frame se re-renderiza igual.
- El movimiento **performa** la acción (emitir, cobrar, aprobar) y después se queda quieto:
  nada de respiración de fondo.
- `cards.css` es root-relative (`href="cards.css"` incluso desde `compositions/`): con `../`
  el lint falla y Studio da 404.
- Queda 1 warning conocido: las fuentes se cargan de Google Fonts, igual que el producto.
  Para eliminarlo habría que bundlear Manrope/Inter como `@font-face` local.
