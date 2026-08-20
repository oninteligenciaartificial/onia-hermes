# Carrito de compra flotante — patrón UI para e-commerce (React/Redux)

- **Fuente:** https://www.instagram.com/p/DbDjpLuTnKK/ · 6.5 s · sin voz (música de fondo)
- **Visto:** 2026-08-11 (Gemini nativo)
- **Archivo:** `Instagram-DbDjpLuTnKK.mp4` (no versionado)
- **Lectura completa + transcripción literal:** [transcripciones/2026-08-11-Instagram-DbDjpLuTnKK.md](transcripciones/2026-08-11-Instagram-DbDjpLuTnKK.md)

## Qué dice realmente

Clip mudo de 6.5 s, pantallazo de una demo etiquetada *"New cart Feature"*, sin narración (solo música instrumental de fondo):

- **00:00-00:02** — sección "Popular Products" con dos ítems (*Drink 1* $3.99, *Drink 2* $12.99). Al tocar `+ Add` el botón cambia a `Added` y aparece una barra flotante `View cart` en la parte inferior.
- **00:03-00:06** — al tocar `View cart` se abre el modal *"Your Cart"*: lista de ítems, indicador `Checking Free delivery eligibility`, subtotal `$16.98` y botón `Proceed to Checkout`.
- Un panel lateral (visible en el propio video, junto al editor de código) lista las funciones incluidas: `Increase Quantity`, `Decrease Quantity`, `Remove Item`, `Apply Coupon`, `Cart Summary`, `Real time Updates`.
- CTA en pantalla: *"Comment 'Code' for Source code"*.

## Veredicto: MEJORA LO ACTUAL

El patrón — botón flotante que aparece recién al primer "agregar" y despliega un modal resumen con subtotal antes de pagar — es una convención de e-commerce ya probada, sin nada técnicamente nuevo. Pero es barata, concreta, y cae directo en un frente activo propio: **Carrito de compra**. Vale como referencia de interacción para lo que ya se está construyendo, no como algo que resuelva un vacío que no tuviéramos identificado.

## Para qué nos sirve

| Frente | Acción concreta |
|---|---|
| Carrito de compra | Adoptar el patrón: botón flotante "Ver carrito" que aparece recién al primer "Agregar", no fijo desde el inicio |
| Web Factory / Nuvia | En el modal, el botón final va a checkout por WhatsApp (ya definido en Nuvia), no un "Proceed to Checkout" genérico |
| Cualquiera | No pedir el código por comentario: bajar código de un desconocido está prohibido (fuente no confiable); replicar el patrón visual con el stack propio |

## Riesgo

Bajo — es solo un patrón de interfaz, no trae una integración ni una dependencia nueva. El único cuidado es de proceso: no perseguir el gancho "comenta Code" (no verificado, puede ser funnel hacia un curso pago) ni instalar código de un tercero desconocido; construir el patrón desde cero con el stack propio (Next.js/TypeScript).
