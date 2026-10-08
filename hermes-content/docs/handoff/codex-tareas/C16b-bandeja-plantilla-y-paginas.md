# C16b · /inbox: escribir con plantilla cuando pasaron 24 h, y ver más de 25 conversaciones

Sos Codex. SOLO `onia-platform`, rama nueva `codex/c16b-bandeja` desde `origin/master` (anotá el SHA).

## META
Para atender el número de Onia desde `/inbox` faltan dos cosas que hoy obligan a entrar a Chatwoot (medido 8-oct):
1. **Ventana cerrada:** fuera de las 24 h, responder da 409 (`lib/chatbot/ventana-de-respuesta.ts:63-74`) y no hay otra
   salida. El número de Onia está en la API: no se puede «escribir desde el teléfono».
2. **Paginación:** `lib/chatwoot.ts:615-625` pide conversaciones sin `page` (Chatwoot corta en ~25) y `:634-641` mensajes
   sin cursor: lo viejo no se ve.

## Lo que se hace
1. **Plantillas:** cuando la conversación no admite respuesta libre, el panel ofrece «Enviar plantilla» con las plantillas
   **APROBADAS** de esa bandeja (Chatwoot las guarda sincronizadas en el canal de WhatsApp; leelas con la API de Chatwoot,
   no con la de Meta). Elegir una, completar sus variables, enviar por Chatwoot con `template_params` (forma de referencia:
   `onia-hermes/hermes-content/deploy/vps-ops/bot/chatwoot-adapter.mjs:~566`). Acción nueva en
   `app/api/bandeja/[id]/route.ts`, con los mismos permisos y la misma tenencia que responder. Sin plantillas aprobadas:
   «Este número todavía no tiene plantillas aprobadas por Meta.» (de usted). Un envío de plantilla NO calla al bot de más:
   se manda igual que una respuesta humana (eso ya lo calla).
2. **Paginación:** «Ver más conversaciones» (page) y «Ver mensajes anteriores» (before) en `InboxClient.tsx`, sin romper el
   sondeo de 15 s / 5 s.

## PRUEBA DE HECHO
- Tests de la ruta: plantilla aprobada → POST a Chatwoot con el nombre, idioma y parámetros; plantilla no aprobada o de
  otra bandeja → 400; otra organización → 404; ventana abierta → la acción de plantilla igual funciona.
- Test de `lib/chatwoot.ts`: `page` y `before` viajan; la respuesta vacía corta la paginación.
- Capturas 390 y 1440 de `/dev/*` de la bandeja (si no hay banco, crealo con datos ficticios) en `docs/capturas/c16b/`.
- `npx tsc --noEmit` 0 · eslint de lo tocado 0 · `npx vitest run` completo verde (números reales o «no corrió» y por qué).

## REGLA DE PARADA
- No crees plantillas en Meta ni en Chatwoot: las crea y aprueba Sergio Urcullo en WhatsApp Manager.
- No toques la desconexión ni la tarjeta de WhatsApp (C16a), ni el bot (C16c). Sin schema ni migraciones. De usted.

## Entrega
Commits conventional en castellano con el porqué. Draft PR contra `master`. Resumen con SHAs y números reales.
