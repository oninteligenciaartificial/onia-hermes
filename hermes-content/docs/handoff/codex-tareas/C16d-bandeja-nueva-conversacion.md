# C16d · /inbox: escribirle primero a alguien con una plantilla aprobada

Sos Codex. SOLO `onia-platform`, rama nueva `codex/c16d-nueva-conversacion` desde la rama de C16b (#127,
`codex/...c16b...`; si ya está en `master`, desde `origin/master`). Anotá el SHA base.

## META
Pedido de Sergio Urcullo (8-oct): escribirles a prospectos con el número de Onia **desde la bandeja de la plataforma**, no
desde Chatwoot. C16b ya manda plantillas en una conversación existente. Falta empezar una conversación con alguien que
nunca escribió (o que no tiene conversación en la bandeja).

## Lo que se hace
- Botón «Nueva conversación» en `/inbox`. Pide el número de WhatsApp, la plantilla APROBADA y sus variables (reusá
  `lib/chatbot/plantillas-bandeja.ts` de C16b).
- El número se normaliza con `numeroParaWhatsapp`. Si es inválido, no se envía: «Ese número no recibe WhatsApp.»
- Crea el contacto y la conversación en Chatwoot en la bandeja de WhatsApp de la organización y manda la plantilla en el
  mismo pedido. `createConversation` existe sin uso en `lib/chatwoot.ts:~468`; revisalo antes de escribir otro.
- Si ese número ya tiene conversación en esa bandeja, se usa esa; no se duplica.
- Ruta nueva con los mismos permisos y la misma tenencia que responder (`bandejaProfile`, `inboxesDeLaOrg`). Una
  organización solo escribe por SU bandeja de WhatsApp.
- Queda en `AuditLog`: quién, a qué número (enmascarado: últimos 4 dígitos), qué plantilla.
- Textos de usted.

## PRUEBA DE HECHO
Tests:
- número inválido → 400 sin llamar a Chatwoot;
- número con conversación existente → la reusa;
- plantilla no aprobada → 400;
- queda el AuditLog;
- otra organización no puede usar la bandeja de Onia;
- org sin bandeja de WhatsApp → 409 «Conecte su WhatsApp para escribir primero.».
Banco `/dev/inbox` con el diálogo abierto, capturado a 390 y 1440 en `docs/capturas/c16d/`.
`npx tsc --noEmit` 0 · eslint de lo tocado 0 · `npx vitest run` completo (números reales, o «no corrió» y por qué).

## REGLA DE PARADA
- No mandes nada real a nadie, ni en tests: Chatwoot siempre simulado.
- No toques la desconexión, la tarjeta de WhatsApp ni el bot. Sin schema ni migraciones.

## Entrega
Commits conventional en castellano con el porqué. Draft PR. Resumen con SHAs y números reales.
