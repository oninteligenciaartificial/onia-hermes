# C16a · El número de Onia no se desconecta, el token no viaja al navegador, y desconectar calla al bot

Sos Codex. Trabajás SOLO en `onia-platform`, rama nueva `codex/c16a-numero-onia` desde `origin/master` (anotá el SHA).
`git branch --show-current` primero. Nadie contesta preguntas: lo que no puedas decidir, al resumen.

## META
Sergio Urcullo quiere atender el número de Onia (+591 75414930) desde la plataforma (`/inbox` de «Onia (interna)»).
Ya entra (bandeja 5 de Chatwoot vinculada por `clinic_settings.chatwootWhatsappInboxId`). Antes de usarlo a diario hay
tres agujeros, medidos el 8-oct sobre master `b2d9d315`:
1. La tarjeta de WhatsApp de «Onia (interna)» muestra «Desconectar» (`app/(dashboard)/settings/chatbot/CanalWhatsappCard.tsx:387`).
   Un toque deja el número de ventas sin bandeja y el bot pasa a recepcionista neutral; volver atrás es SQL.
2. `app/(dashboard)/admin/organizations/[id]/page.tsx:36` le manda `whatsappAccessToken` al navegador.
3. Desconectar (`lib/chatbot/canal-whatsapp.ts:144-161`, `apagarCanalWhatsapp`) solo borra la columna: el bot sigue
   contestando en una bandeja que ya nadie ve (el comentario de :128-136 asume otra cosa).

## Lo que se hace
1. **Guarda:** helper `esInboxDeOnia(inboxId)` reutilizando lo que ya resuelve `ONIA_WHATSAPP_INBOX_ID` en `lib/chatwoot.ts`
   (~:272, fail-closed en prod). `apagarCanalWhatsapp` y el DELETE de `app/api/chatbot-canal-whatsapp/route.ts` devuelven
   409 «Este es el número de Onia: no se desconecta desde acá.» y no tocan nada. La tarjeta no muestra «Desconectar» para él.
2. **Token:** la página de admin manda `tieneToken: boolean`, nunca el valor. `WhatsAppOrgConfig.tsx` muestra «Token
   cargado» / «Sin token» y un campo para reemplazarlo (solo escritura). El PATCH sigue igual.
3. **Desconectar calla al bot:** al apagar, además de borrar la columna, sacar al usuario del bot (`CHATWOOT_BOT_USER_ID`,
   default 3) de los miembros de esa bandeja (espejo de `addBotToInbox`, `lib/chatwoot.ts:~153`). Si Chatwoot falla, la
   desconexión igual se guarda y se registra el fallo (`registrarFallo`). El texto de la tarjeta al desconectar, de usted:
   «Onia deja de responder y de mostrar los mensajes de este número. Los que lleguen después no los verá nadie hasta que
   lo conecte de nuevo.»

## PRUEBA DE HECHO
- Tests: DELETE con la bandeja de Onia → 409 y cero escrituras; DELETE de un cliente → columna null + llamada de quitar
  miembro; Chatwoot caído → igual 200 y fallo registrado; la página de admin no serializa el token (test que busque la
  clave en las props).
- `npx tsc --noEmit` 0 · eslint de lo tocado 0 · `npx vitest run` completo verde (corrélos: si no ves `node_modules`, decilo
  en el resumen y no inventes números).

## REGLA DE PARADA
- No toques `/inbox`, `lib/chatbot/bandeja*.ts` (C16b) ni el bot de `onia-hermes` (C16c). Ni schema ni migraciones.
- No cambies cómo se conecta un número (Embedded Signup). Textos de usted.

## Entrega
Commits conventional en castellano con el porqué. Draft PR contra `master`. Resumen: SHAs, números reales de los gates.
