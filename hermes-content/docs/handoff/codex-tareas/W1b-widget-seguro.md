# W1b · El widget propio sin agujeros (antes de publicarlo)

Sos Codex. SOLO `onia-platform`, sobre la rama de W1 (`codex/widget-propio`, onia-platform#131). Anotá el SHA base.

## META
La revisión de seguridad de Plataforma (8-oct) dejó a W1 **bloqueado para publicar**: el proxy está bien armado (no es
un proxy abierto, valida el inbox contra la org, no deja salir el `pubsub_token`, el widget dibuja con `textContent`),
pero tiene dos agujeros que un desconocido puede usar desde afuera. Se arreglan acá; lo demás de W1 queda igual.

## Lo que se hace
1. **Nadie agota el cupo de una clínica** (H1). Hoy el límite es por IP y en memoria (12 conversaciones nuevas y 20
   mensajes por minuto, `lib/rate-limit.ts`). Cada conversación nueva cuenta para las 500 del mes de la org
   (`app/api/webhooks/chatwoot/route.ts` → `lib/chatbot/cupo.ts`); agotado el cupo, el bot deja de atender TODOS los
   canales de la org, WhatsApp incluido. Desde una sola IP son ~42 minutos.
   - Límite con Redis (`lib/rate-limit-redis.ts`, lo exige la skill `onia-seguridad` para rutas públicas):
     ~3 conversaciones nuevas por hora por IP y un tope por organización (≤30 contactos/conversaciones nuevas por hora).
   - Si Redis no está configurado: fallar CERRADO para crear conversaciones (429), no dejar pasar todo.
2. **El identificador publicado no abre Chatwoot por la puerta de atrás** (H2). El snippet publica el
   `inbox_identifier`, y con él cualquiera puede llamar DIRECTO a la Client API de Chatwoot (si `/public/api/v1` es
   alcanzable desde internet): se saltea los límites, recibe el `pubsub_token` y puede mandar email/teléfono. Con una
   sola cuenta de Chatwoot para todas las clínicas, eso es buscar datos de pacientes de otra clínica por email o
   teléfono.
   - Que el proxy NO dependa de que el identificador sea secreto: inboxes API con `hmac_mandatory` y el proxy manda
     un `identifier` aleatorio más su `identifier_hash` (HMAC con el `hmac_token` del inbox, que nunca sale del
     servidor). Documentá en el PR cómo se activa `hmac_mandatory` en los inboxes nuevos.
   - Además, el paso de infraestructura (lo hace Plataforma, no vos): bloquear `/public/api/` en el host público de
     Chatwoot. Dejalo escrito en el PR como requisito previo a publicar.
   - Y en `lib/chatbot/contacto-desde-chatwoot.ts`: un remitente del canal web NO llena email ni teléfono de un
     paciente existente (hoy, si coinciden los últimos 8 dígitos, el email del visitante se escribe en la ficha y los
     recordatorios y presupuestos le llegarían a él).
3. **Gente real detrás de un NAT no queda bloqueada** (M3). Sondeo cada 10-15 s (no 4) y en pausa con la pestaña
   oculta; el límite por IP se calcula con eso en mente (una clínica con 6 computadoras detrás de una IP).
4. **Menos carga sobre Chatwoot** (M4). Cada pedido anónimo hace 2 lecturas a la base y un GET con el token de admin
   antes de la Client API. Cacheá por organización el `inbox_identifier` (o guardalo en `clinic_settings`).
5. **Notas privadas** (L5): test de contrato contra la forma real del JSON de Chatwoot 4.12.1 (sin red: un fixture del
   payload real) que pruebe que una nota privada NO llega al visitante aunque falte el campo `private`.

## PRUEBA DE HECHO
Tests, todos con Chatwoot y Redis simulados:
- la conversación 4 de la misma IP en una hora → 429; la 31 de la misma org en una hora (IPs distintas) → 429;
- sin Redis configurado, crear conversación → 429 (no pasa todo);
- el proxy manda `identifier` + `identifier_hash` y jamás devuelve el `hmac_token`;
- un remitente web con email no escribe el email de un paciente existente;
- una nota privada no sale aunque el JSON no traiga `private`.
`npx tsc --noEmit` 0 · eslint de lo tocado 0 · `npx vitest run` completo (números reales, o «no corrió» y por qué).
**No alcanza con `vitest related`**: el registro de rutas (`lib/platform/api-route-registry.test.ts`) y los ratchets de UI
y de voseo sólo los atrapa la suite completa (así se escaparon tres rojos de C16b/C16d el 8-oct).

## REGLA DE PARADA
- No toques producción ni Chatwoot real. Sin migraciones (si `clinic_settings` necesita una columna, proponela en el PR
  y la decide Plataforma).
- No cambies el aspecto del widget: eso ya lo verá Sergio Urcullo en capturas.

## Lo que decide Sergio Urcullo (no vos)
Los clientes que ya tienen el widget viejo (canal Website) dejan de ver su snippet con W1. El plan para moverlos a
inboxes API (o dejarlos como están) es decisión de él; Plataforma se lo plantea con la cuenta delante.

## Entrega
Commits conventional en castellano con el porqué. Draft PR contra la rama de W1. Resumen con SHAs y números reales.
