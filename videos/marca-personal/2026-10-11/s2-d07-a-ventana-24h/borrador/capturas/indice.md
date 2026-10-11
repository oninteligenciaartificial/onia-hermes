# Capturas oficiales (documentación de WhatsApp Business Platform, Meta)

Sacadas con `capturar-meta.mjs` (copia adaptada de `erik/capturar.mjs`) por el proxy de la sesión, TLS intacto, Chromium headless.

| Captura | URL (final) | Fecha · hora UTC | HTTP | Texto de la página que se marca |
|---|---|---|---|---|
| `plantillas/cap-aprobadas.png` | https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/overview/ | 2026-10-11 · 09:15 | 200 | «status of APPROVED» |
| `servicio/cap-ventana.png` | https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/send-messages | 2026-10-11 · 09:18 | 200 | «timer called a customer service window» |
| `servicio/cap-solo-plantillas.png` | https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/send-messages | 2026-10-11 · 09:18 | 200 | «can only send pre-approved template messages» |

La URL vieja `developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages` redirige (200) a la de arriba; las dos páginas dicen «Updated: May 21, 2026».
Lo que NO se capturó ni va en pantalla: lo de las variables (ver README, «ALERTA»).
