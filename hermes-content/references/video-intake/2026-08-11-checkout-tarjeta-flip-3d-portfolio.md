# Checkout de tarjeta con flip 3D — portafolio sin sustancia

- **Fuente:** https://www.instagram.com/p/DblCVL1zncS/ · 6.5 s · sin voz (música + SFX)
- **Visto:** 2026-08-11 (Gemini nativo)
- **Archivo:** `Instagram-DblCVL1zncS.mp4` (no versionado)
- **Lectura completa + transcripción literal:** [transcripciones/2026-08-11-Instagram-DblCVL1zncS.md](transcripciones/2026-08-11-Instagram-DblCVL1zncS.md)

## Qué dice realmente

Reel silencioso, formato portafolio de una sola pantalla:

- **00:00-00:01** — Formulario "Add New Card" en una app móvil. Tarjeta digital interactiva
  arriba (`3434 3434 3445`, `12/29`, `Card Holder CODEXR`). Al enfocar el campo CVV, la
  tarjeta gira en 3D y muestra el reverso (`CVV *` + texto legal genérico de emisor).
  Aparece una alerta emergente que se corta sin resolverse en pantalla: *"Automatic
  payment method does not use a secure conn..."*
- **00:02-00:03** — CVV completado (`***`), la tarjeta vuelve a girar al frente, el cursor
  baja y hace clic en `Pay Now ->` (monto fijo `$200`). Casilla marcada: *"Securely save
  card and details"*. Logos `VISA / AMEX / JCB / DISCOVER`.
- **00:04-00:05** — Pantalla de proceso: la tarjeta flota con un resplandor rojo
  intermitente alrededor y un spinner con el texto `Processing Transaction...`.

Sin voz, sin CTA, sin marca ni herramienta nombrada — el único texto propio es
`CODEXR` impreso como titular de la tarjeta de prueba, que parece la firma del
autor/estudio del prototipo, no una herramienta.

## Veredicto: HUMO

6.5 segundos de motion design de un formulario de pago, sin una sola palabra de cómo se
construyó (¿Figma? ¿Framer? ¿código real?), sin marca, sin CTA, sin técnica explicada. El
patrón que muestra — tarjeta que gira en 3D al enfocar el CVV — ya es estándar en apps
fintech (Revolut, N26, Apple Pay) desde hace años; no hay nada nuevo que aprender ni nada
replicable con lo que el video entrega. Es una pieza de portafolio ajena pensada para
generar "wow" visual, no contenido con sustancia.

## Para qué nos sirve

| Frente | Acción concreta |
|---|---|
| Estructura de pagos | Ninguna acción real: guardar solo como referencia visual de moodboard (flip 3D en CVV), sin prioridad ni tarea asociada |

## Riesgo

Ninguno directo — no se ejecuta nada a partir de este video. El único riesgo es de
oportunidad: invertir tiempo en pulir una animación de checkout que hoy no tenemos (no hay
pasarela propia en producción, ver `BCP_PASARELA_CREDENCIALES_INTERNO.md`) antes de tener
el checkout funcionando de punta a punta.
