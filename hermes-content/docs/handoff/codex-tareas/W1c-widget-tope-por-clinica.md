# W1c · El widget no se puede inundar aunque cambien la IP (arreglo de la revisión de W1 + W1b)

Sos Codex. SOLO `onia-platform`, sobre la rama del PR integrado de W1 + W1b (`integ/w1-w1b`, la pushea la madre).
`git branch --show-current` primero. Anotá el SHA base.

## META
La revisión de seguridad de Plataforma (9-oct) sobre el proxy `app/api/chat-publico/[...ruta]/route.ts` y el widget
`public/onia-chat.js`: el diseño está bien (allowlist de rutas, inbox de la propia org, identidad firmada con HMAC en el
servidor, respuestas limpias, Redis que falla cerrado). Quedan dos huecos de código:

1. **Los mensajes solo tienen tope por IP** (`widgetMessageLimiter`, 60/IP/min). Medido el 9-oct: el VPS contesta
   DIRECTO como `app.onia.com.bo` (sin Cloudflare), así que `cf-connecting-ip` se puede inventar y el tope por IP no
   frena a nadie (y con IPs rotativas tampoco). Cada mensaje despierta al bot (costo de OpenAI) y llena la bandeja de
   la clínica. Las altas ya tienen tope por organización (`widgetCreationOrgLimiter`); los mensajes no.
2. **`data-color` se pega sin validar dentro del CSS** del widget (`onia-chat.js:11` y `:32`). Solo lo controla el
   dueño del sitio, así que el riesgo es bajo, pero un valor raro rompe el estilo.

## Lo que se hace
- Dos limitadores nuevos en `lib/rate-limit-redis.ts`, con `limitCerrado` (fallan cerrados como los demás):
  - por organización: **600 mensajes por hora** (`rl:widget:msg:org`, clave `organizationId`);
  - por conversación: **30 mensajes cada 10 minutos** (`rl:widget:msg:conv`, clave `organizationId:conversationId`).
  Se aplican en el POST de `messages`, DESPUÉS de resolver la organización y el inbox (no antes: la clave tiene que ser
  la organización verdadera, no lo que manda el visitante). El de IP queda como está.
- En `onia-chat.js`, `data-color` solo se acepta si cumple `^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$`; si no, el default.
- Tests: con IPs distintas en cada pedido, el mensaje 31 de una conversación da 429 con `Retry-After`; el 601 de la
  organización también; Redis caído da 429 sin llamar a Chatwoot; un color inválido cae al default.

## PRUEBA DE HECHO
`npx tsc --noEmit` 0 · eslint de lo tocado 0 · `npx vitest run` COMPLETO en verde, con números reales.

## REGLA DE PARADA
- No toques infraestructura (Traefik, Cloudflare, Chatwoot), producción ni la base. Sin migraciones.
- Textos de usted. No cambies el aspecto del widget.
