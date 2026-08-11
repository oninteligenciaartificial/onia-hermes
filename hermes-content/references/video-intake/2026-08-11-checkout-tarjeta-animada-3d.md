# Checkout con tarjeta animada en 3D — demo UI de pasarela de pago

- **Fuente:** https://www.instagram.com/p/Db3CrouPbxz/ · 5,9 s · sin voz (música)
- **Visto:** 2026-08-11 (Gemini nativo)
- **Archivo:** `Instagram-Db3CrouPbxz.mp4` (no versionado)
- **Lectura completa + transcripción literal:** [transcripciones/2026-08-11-Instagram-Db3CrouPbxz.md](transcripciones/2026-08-11-Instagram-Db3CrouPbxz.md)

## Qué dice realmente

Demo de portafolio frontend, sin voz ni cliente real detrás — "SABLE CHECKOUT" es el
nombre de la pieza de práctica, no una marca a la que haya que atribuirle nada. Se ven los
tres paneles de código en pantalla (`index.html`, `style.css`, `app.js`), así que es
contenido de un dev mostrando su trabajo, no una herramienta que se vende:

- **00:00-00:01** — tipea el número de tarjeta `4242 4242 4242 4242` (el número de prueba
  público estándar que usa Stripe en su documentación) y se refleja en vivo sobre una
  tarjeta virtual a la izquierda del formulario.
- **00:01-00:03** — completa la fecha `12/28`; la tarjeta la muestra en el mismo instante.
- **00:03-00:04** — al enfocar el campo CVC, la tarjeta gira 180° en 3D y muestra el
  reverso con la banda magnética y el código.
- **00:04-00:06** — clic en el botón de pago (`Pay $1,248.00`) → pantalla de éxito con
  check verde. El formulario exhibe los sellos `PCI-DSS Level 1` y `256-bit TLS`.

Sin CTA, sin locución, sin producto real nombrado: es una pieza de interacción, punto.

## Veredicto: MEJORA LO ACTUAL

Cero novedad de idea: la tarjeta que se autocompleta en vivo y gira al llegar al CVC es un
patrón de microinteracción estándar en demos de frontend desde hace años. Lo único que
aporta es ejecución prolija.

Es ejecutable ahora con lo que ya usamos (CSS `transform` + un par de listeners, sin
librería nueva) y encaja con dos frentes activos — Estructura de pagos y Carrito de
compra — y con el checklist de `rules/web/design-quality.md`, que pide estados de
hover/focus "que se sientan diseñados".

**A VERIFICAR antes de construir nada sobre esto:** el modelo Facilitador boliviano (QR
Simple, BNB/BCP) que estamos integrando puede redirigir al cliente a una página del banco
en vez de que nosotros capturemos el número de tarjeta directamente. Si el flujo real es
por redirección, este componente no tiene dónde montarse. Confirmar el flujo exacto de
BNB/BCP antes de invertir tiempo acá.

## Para qué nos sirve

| Frente | Acción concreta |
|---|---|
| Estructura de pagos | VERIFICAR primero si BNB/BCP captura tarjeta in-page o redirige; solo si captura in-page, portar el patrón |
| Carrito de compra | Reusar el mismo patrón (preview en vivo + flip a CVC) en cualquier formulario de tarjeta que construyamos nosotros mismos |
| Web Factory (calidad UI) | Referencia de "hover/focus con diseño intencional" del checklist de calidad, aplicable más allá de pagos |

## Riesgo

Si algún día capturamos el número de tarjeta en un formulario propio sin un SDK que
tokenice del lado del cliente (como Stripe Elements), asumimos nosotros el alcance
PCI-DSS — justo la carga de cumplimiento que los propios sellos del video dan a entender.
No construir captura de tarjeta en crudo sin ese SDK de por medio.
