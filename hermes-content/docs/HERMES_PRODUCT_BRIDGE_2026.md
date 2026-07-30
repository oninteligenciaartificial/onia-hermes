# Hermes Product Bridge — DentalGest (2026)

Runbook del puente entre el gateway Telegram de Onia (Hermes) y los productos
ONIA Core. Primer producto conectado: DentalGest. Comandos: `/dentalgest` y
`/tarea`.

## Arquitectura

```
Telegram (Sergio)
  -> n8n "ONIA - Telegram Command Center" (unico trigger de Telegram)
  -> SSH al VPS: hermes-command telegram --message "<texto>"
  -> /usr/local/bin/hermes-command (wrapper bash: source /root/.hermes/.env)
  -> /root/.hermes/scripts/hermes_command_center.py (router deterministico)
       /dentalgest            -> GET  {DENTALGEST_BRIDGE_URL}/api/onia-core/bridge/pending?organizationId=...
       /tarea <texto>         -> POST {DENTALGEST_BRIDGE_URL}/api/onia-core/intake
  -> el router imprime JSON; n8n responde con el campo telegram_reply
```

Reglas:

- NO crear otro trigger de Telegram. Todo comando nuevo vive dentro de
  `hermes_command_center.py` (`handle_telegram`).
- El bridge de lectura es SOLO lectura. La escritura entra por el intake
  normalizado de ONIA Core (canal `phone_walkin`), nunca por SQL directo.
- Ambos endpoints autentican con el header `x-intake-secret` contra el
  `ONIA_INTAKE_SECRET` del producto. Cero secretos en el repo.
- Respuestas a Telegram limitadas a 3500 caracteres (el router recorta solo).

## Comandos

| Comando | Efecto | Respuesta |
|---------|--------|-----------|
| `/dentalgest` (alias `/dentalgest pendientes`) | GET bridge/pending | Conteos (abiertos, vencidos, aprobaciones pendientes) + top 10 con titulo, responsable, prioridad y vencimiento |
| `/tarea <texto>` | POST intake (channel `phone_walkin`, contact.name `Sergio via Telegram`) | `Pendiente creado: <titulo> → <responsable>` |

Errores amables: si faltan claves, el bot dice exactamente cuales; si el
producto esta caido o el secret no coincide, lo explica sin stack traces.

## Claves a setear en el VPS

Archivo: `/root/.hermes/.env` (lo sourcea el wrapper `/usr/local/bin/hermes-command`).

| Clave | Valor | Notas |
|-------|-------|-------|
| `DENTALGEST_BRIDGE_URL` | Base del producto, sin slash final | Opcional; default `https://dentalgest.app` |
| `DENTALGEST_BRIDGE_SECRET` | El MISMO valor que `ONIA_INTAKE_SECRET` en el deployment de DentalGest | Obligatoria. Si se rota el intake secret del producto, rotar aqui tambien |
| `DENTALGEST_ORG_ID` | `organizationId` (cuid) de la clinica que opera este bot | Obligatoria. Sacarlo de la tabla `organizations` del producto o del panel |

Ejemplo (valores ficticios):

```bash
# /root/.hermes/.env
DENTALGEST_BRIDGE_URL=https://dentalgest.app
DENTALGEST_BRIDGE_SECRET=<mismo-valor-que-ONIA_INTAKE_SECRET>
DENTALGEST_ORG_ID=<cuid-de-la-organizacion>
```

Deploy del router al VPS (sube scripts + wrappers):

```bash
npm run deploy:hermes-content
```

## Endpoints del producto (DentaGest/dental-saas)

- `GET /api/onia-core/bridge/pending?organizationId=<id>`
  (`app/api/onia-core/bridge/pending/route.ts`). Solo lectura. Usa
  `listPendingForPanel` + `listPendingApprovals`; el resumen compacto lo arma
  `lib/onia-core/bridge.ts` (formateador puro con tests).
  Respuesta: `{ ok, organizationId, generatedAt, counts: { open, overdue,
  pendingApprovals }, items: [{ title, owner, priority, dueAt, overdue }] }`.
- `POST /api/onia-core/intake` (ya existia). Ahora la respuesta incluye
  `title` y `ownerName` para que el gateway confirme el pendiente creado.

Codigos: 503 sin `ONIA_INTAKE_SECRET`, 401 secret invalido, 400 sin
`organizationId`, 422 payload invalido (intake).

## Prueba end-to-end

1. Local (sin red, mock HTTP): `npm run test:dentalgest-bridge` en onia-hermes.
2. Desde el VPS, bridge directo (usa el secret del .env, no lo pegues inline
   en historial compartido):

   ```bash
   source /root/.hermes/.env
   curl -s -H "x-intake-secret: $DENTALGEST_BRIDGE_SECRET" \
     "$DENTALGEST_BRIDGE_URL/api/onia-core/bridge/pending?organizationId=$DENTALGEST_ORG_ID"
   ```

   Esperado: JSON `{"ok":true,...}` con counts + items.
3. Router completo en el VPS:

   ```bash
   hermes-command telegram --message "/dentalgest"
   hermes-command telegram --message "/tarea Prueba bridge Hermes"
   ```

   Esperado: `telegram_reply` con pendientes; luego
   `Pendiente creado: solicitud_manual: Sergio via Telegram → <responsable>`.
4. Desde Telegram: enviar `/dentalgest` y `/tarea Prueba desde Telegram`.
   Verificar que el pendiente aparece en el panel de DentalGest (cola del
   dueno) asignado por round-robin a recepcion.

## Patron para extender a /gestios y /bolivian

1. En el producto: replicar los dos endpoints ONIA Core (`bridge/pending` de
   lectura + `intake` de escritura) con su propio `ONIA_INTAKE_SECRET`. El
   contrato del core hace que el shape sea identico.
2. En `/root/.hermes/.env`: agregar `GESTIOS_BRIDGE_URL`,
   `GESTIOS_BRIDGE_SECRET`, `GESTIOS_ORG_ID` (idem `BOLIVIAN_*`).
3. En `hermes_command_center.py`: sumar el comando al regex del bridge
   (`^/(tarea|dentalgest|gestios|bolivian)...`) y reutilizar
   `_dentalgest_request/_format_dentalgest_pending` parametrizando base URL,
   secret y org id (extraer un dict `BRIDGES = {"dentalgest": {...}}` cuando
   haya 2+ productos).
4. Agregar los comandos a `_help()`, casos al smoke test
   (`scripts/hermes_command_dentalgest.test.js`) y correr
   `npm run deploy:hermes-content`.

Decision de diseno: `/tarea` sin prefijo apunta a DentalGest mientras sea el
unico producto instalado; cuando entre GestiOS, `/tarea` puede pedir
desambiguar o aceptar `/tarea gestios: <texto>`.
