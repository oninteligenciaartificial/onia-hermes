# ONIA Agents — seed demo + cron diario (C3)

Fecha: 2026-08-03. Carril infra/VPS (G). Objetivo cumplido: la cola de agentes
de Onia Platform tiene vida en producción — agentes creados en las 4 orgs
demo, cron manual y diario corriendo, 4 propuestas reales visibles como
`onia_core_approval_requests` (`status=pending`, `requestType=agent_action`),
que es lo que alimenta el panel "El sistema trabajó por vos".

## 1. Qué existía antes de esta sesión

- Runtime de agentes (`lib/onia-core/modules/agents-runtime.ts`) implementa
  **solo 2 roles**: `recall` (pacientes sin volver) y `cobrador` (facturas
  vencidas). `AGENT_KINDS` es el único catálogo — no hay `vendedor` ni
  `stock` en el código, pese a que `vertical-packs.json` declara el módulo
  `agents` disponible también para `gestios-general` (comercio).
- `runAgentsForAllOrgs()` corre recall+cobrador para **toda** org con
  `organization_entitlements.featureKey='module.agents'` activo, sin filtrar
  por vertical. Antes de esta sesión solo 1 de las 4 orgs demo tenía esa
  entitlement (`Clínica Demo — dv2-msdphv28`).
- Endpoint: `GET https://app.onia.com.bo/api/cron/onia-agents`, auth
  `Authorization: Bearer $CRON_SECRET` (valor en
  `/opt/onia-platform/app.env` en el VPS, contenedor `onia-platform`).
  Fuente: `app/api/cron/onia-agents/route.ts` en el repo del producto.
- Flags globales ya en `1` en `/opt/onia-platform/app.env`:
  `PLATFORM_LAYER=1`, `AGENTS_RUNTIME=1`.

## 2. Orgs demo encontradas (no existe "DEMO Importadora" en prod)

| id | nombre | vertical | patients/appts/invoices antes |
|---|---|---|---|
| `cms7zcun100003cvlr0x52zw9` | Clínica Dental Demo | dentagest-clinical | 10 / 10 / 0 |
| `cmsdphw4k000000vlbs1btlpo` | Clínica Demo — dv2-msdphv28 | dentagest-clinical | 4 / 5 / 2 |
| `cmsb82h78000001safwcokf7b` | DEMO Ferreteria Onia | gestios-general | 0 / 0 / 0 |
| `cmsdpa7ou0000u8vlwj2tef9s` | Comercio Demo — dv2-msdpa6lj | gestios-general | 0 / 0 / 0 |

La búsqueda de "DEMO Importadora" (mencionada en el prompt) no dio resultados
— no corrió ese seeder en esta base. Se documenta como no encontrado, no se
inventó.

## 3. Qué se sembró

Script ejecutado contra `dentalgest-staging-supabase-db` (prod real, el
nombre del contenedor es heredado de DentalGest pero es la base que usa
Onia Platform en vivo):

1. **Entitlement `module.agents=active`** para las 3 orgs demo que no la
   tenían (`cms7zcun...`, `cmsb82h78...`, `cmsdpa7ou...`). La 4ta
   (`cmsdphw4k...`) ya la tenía y no se tocó (`ON CONFLICT DO UPDATE`,
   idempotente).
2. **Datos mínimos DEMO** en `Clínica Dental Demo` (`cms7zcun...`), que no
   tenía nada que activara ni recall ni cobrador:
   - `appointments` id `demoseed-appt-recall-cms7zcun`: paciente Rosa
     Fernández (`cms7zd5uj00143cvlb37w9w9w`), `status=COMPLETADA`,
     `dateTime = now() - 220 days`, sin cita futura → candidato de recall
     (umbral del código: `recallAfterDays=180`).
   - `invoices` id `demoseed-inv-cobrador-cms7zcun`: paciente Diego
     Rodríguez (`cms7zd62h00153cvl55j0ug4v`), `status=VENCIDA`,
     `dueDate = now() - 45 days`, `total=300.00`, sin pagos → candidato de
     cobrador (`balanceDue > 0`, `graceDays=0`).
   - Ambas filas llevan `notes = 'DEMO seed — agentes C3 2026-08-03'` para
     que sean identificables y reversibles.
   - `Clínica Demo — dv2-msdphv28` **no necesitó seed**: ya tenía un
     paciente sin volver hace 220 días y una factura VENCIDA (250 BOB, 45
     días) desde antes de esta sesión.
3. **No se sembró nada en las 2 orgs de comercio.** Ver hallazgo §5 — no
   existe un rol que el runtime procese para ese vertical, y forzar datos de
   `Patient`/`Invoice` (modelo estrictamente dental: `dob`, `allergies`,
   `bloodType`, `patientId` FK obligatoria en `Invoice`) en una org de
   ferretería sería fabricar datos que no reflejan el negocio.

Script fuente (ejecutado vía `psql -f`, queda en el VPS en
`/root/seed-agents-c3.sql` y dentro del contenedor DB en
`/tmp/seed-agents-c3.sql`):

```sql
-- 1) entitlement module.agents=active para las 3 orgs sin ella
INSERT INTO organization_entitlements (id, "organizationId", "featureKey", status, source, limits, "createdAt", "updatedAt")
VALUES
  (gen_random_uuid()::text, 'cms7zcun100003cvlr0x52zw9', 'module.agents', 'active', 'demo-seed', '{}'::jsonb, now(), now()),
  (gen_random_uuid()::text, 'cmsb82h78000001safwcokf7b', 'module.agents', 'active', 'demo-seed', '{}'::jsonb, now(), now()),
  (gen_random_uuid()::text, 'cmsdpa7ou0000u8vlwj2tef9s', 'module.agents', 'active', 'demo-seed', '{}'::jsonb, now(), now())
ON CONFLICT ("organizationId", "featureKey") DO UPDATE SET status = 'active', "updatedAt" = now();

-- 2) recall: cita COMPLETADA hace 220 dias, sin cita futura
INSERT INTO appointments (id, "organizationId", "patientId", "doctorId", "dateTime", "durationMin", status, reason, notes, "createdAt", "updatedAt")
SELECT 'demoseed-appt-recall-cms7zcun', 'cms7zcun100003cvlr0x52zw9', 'cms7zd5uj00143cvlb37w9w9w', 'cms7zcv3u00023cvlyv5942o0',
       now() - interval '220 days', 30, 'COMPLETADA', 'Control DEMO seed (agentes C3)', 'DEMO seed — agentes C3 2026-08-03', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM appointments WHERE id = 'demoseed-appt-recall-cms7zcun');

-- 3) cobrador: factura VENCIDA 45 dias, sin pagos
INSERT INTO invoices (id, "organizationId", "patientId", "invoiceNumber", status, subtotal, tax, total, "dueDate", notes, "createdAt", "updatedAt")
SELECT 'demoseed-inv-cobrador-cms7zcun', 'cms7zcun100003cvlr0x52zw9', 'cms7zd62h00153cvl55j0ug4v', 'DEMO-AGENTS-0001', 'VENCIDA',
       300.00, 0.00, 300.00, now() - interval '45 days', 'DEMO seed — agentes C3 2026-08-03', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM invoices WHERE id = 'demoseed-inv-cobrador-cms7zcun');
```

## 4. Cron manual — salida real

```
curl -s -H "Authorization: Bearer $CRON_SECRET" https://app.onia.com.bo/api/cron/onia-agents
```

```json
{"ok":true,"ran":8,"proposed":4,"autoExecuted":0,"discarded":0,"errors":0,
 "outcomes":[
  {"organizationId":"cmsdphw4k000000vlbs1btlpo","agentKind":"recall","ran":true,"summary":{"pendingApproval":1,...}},
  {"organizationId":"cmsdphw4k000000vlbs1btlpo","agentKind":"cobrador","ran":true,"summary":{"pendingApproval":1,...}},
  {"organizationId":"cms7zcun100003cvlr0x52zw9","agentKind":"recall","ran":true,"summary":{"pendingApproval":1,...}},
  {"organizationId":"cms7zcun100003cvlr0x52zw9","agentKind":"cobrador","ran":true,"summary":{"pendingApproval":1,...}},
  {"organizationId":"cmsb82h78000001safwcokf7b","agentKind":"recall","ran":true,"summary":{"pendingApproval":0,...}},
  {"organizationId":"cmsb82h78000001safwcokf7b","agentKind":"cobrador","ran":true,"summary":{"pendingApproval":0,...}},
  {"organizationId":"cmsdpa7ou0000u8vlwj2tef9s","agentKind":"recall","ran":true,"summary":{"pendingApproval":0,...}},
  {"organizationId":"cmsdpa7ou0000u8vlwj2tef9s","agentKind":"cobrador","ran":true,"summary":{"pendingApproval":0,...}}
 ]}
```

`ran=8` = 4 orgs x 2 roles, `errors=0`. Las 2 orgs de comercio corrieron sin
error pero con 0 candidatos (esperado — ver §5). Una segunda corrida
inmediata devuelve `ran=0` con `skippedReason:"not_due"` en los 8 agentes
(gate por `intervalMinutes=1440` funcionando: no duplica corridas dentro de
24h).

## 5. SELECT de verificación — propuestas reales en la base

```sql
SELECT o.name, ag.role, act.status, act."actionType", act."targetType", act.summary, act."approvalRequestId"
FROM onia_agents_actions act
JOIN onia_agents_agents ag ON ag.id = act."agentId"
JOIN organizations o ON o.id = act."organizationId"
ORDER BY o.name, ag.role;
```

```
            name             |   role   |      status      |  actionType   | targetType |                            summary                              |     approvalRequestId
------------------------------+----------+------------------+---------------+------------+------------------------------------------------------------------+---------------------------
 Clínica Demo — dv2-msdphv28 | cobrador | pending_approval | draft_message | receivable | Cobranza: Jorge Quispe — saldo vencido 250 BOB hace 45 dias      | cmsdr1c7c000701pfnjgnbgn7
 Clínica Demo — dv2-msdphv28 | recall   | pending_approval | draft_message | patient    | Recall: Jorge Quispe — sin volver hace 220 dias                  | cmsdr1c28000301pf9mton507
 Clínica Dental Demo         | cobrador | pending_approval | draft_message | receivable | Cobranza: Diego Rodríguez — saldo vencido 300 BOB hace 45 dias   | cmsdr1cdq000f01pf2p2qbafc
 Clínica Dental Demo         | recall   | pending_approval | draft_message | patient    | Recall: Rosa Fernández — sin volver hace 220 dias                | cmsdr1cak000b01pfg44arz38
(4 rows)
```

Los 4 `approvalRequestId` se verificaron en `onia_core_approval_requests`:
las 4 filas existen, `status='pending'`, `requestType='agent_action'`,
`entityType` `Patient`/`Invoice` según corresponde — esa es la tabla que
alimenta la cola de aprobación / el panel "El sistema trabajó por vos".
Ningún envío externo ocurrió (regla dura del módulo: `autonomyLevel=suggest`
→ todo pasa por `/pending`, humano aprueba).

Agentes creados (`onia_agents_agents`, 8 filas — 2 por org x 4 orgs):

```
             name             |   role   | autonomyLevel | triggerType | intervalMinutes | enabled
------------------------------+----------+---------------+-------------+-----------------+---------
 Clínica Demo — dv2-msdphv28  | cobrador | suggest       | schedule    |            1440 | t
 Clínica Demo — dv2-msdphv28  | recall   | suggest       | schedule    |            1440 | t
 Clínica Dental Demo          | cobrador | suggest       | schedule    |            1440 | t
 Clínica Dental Demo          | recall   | suggest       | schedule    |            1440 | t
 Comercio Demo — dv2-msdpa6lj | cobrador | suggest       | schedule    |            1440 | t
 Comercio Demo — dv2-msdpa6lj | recall   | suggest       | schedule    |            1440 | t
 DEMO Ferreteria Onia         | cobrador | suggest       | schedule    |            1440 | t
 DEMO Ferreteria Onia         | recall   | suggest       | schedule    |            1440 | t
```

## 6. Cron periódico en el host

Agregado al `crontab -l` del root del VPS (mismo patrón que
`backup-onia-db.sh`, log a `/var/log/`):

```
# Corrida diaria agentes ONIA Platform (Recall+Cobrador, C3) 07:00 La Paz (=11:00 UTC)
0 11 * * * /root/bin/run-onia-agents-cron.sh >> /var/log/onia-agents-cron.log 2>&1
```

Script `/root/bin/run-onia-agents-cron.sh` (modo 700, root-only — lee
`CRON_SECRET` de `/opt/onia-platform/app.env`, nunca lo loguea, solo el
JSON de respuesta del endpoint):

```sh
#!/bin/sh
set -e
CRON_SECRET=$(grep -E '^CRON_SECRET=' /opt/onia-platform/app.env | cut -d= -f2-)
STAMP=$(date -Iseconds)
RESP=$(curl -s -o /tmp/onia-agents-cron-last.json -w '%{http_code}' \
  -H "Authorization: Bearer $CRON_SECRET" \
  https://app.onia.com.bo/api/cron/onia-agents)
if [ "$RESP" != "200" ]; then
  echo "$STAMP FAIL http=$RESP body=$(cat /tmp/onia-agents-cron-last.json 2>/dev/null)"
  exit 1
fi
echo "$STAMP OK http=$RESP body=$(cat /tmp/onia-agents-cron-last.json)"
```

Probado a mano antes de agendarlo (`/root/bin/run-onia-agents-cron.sh`):
`HTTP 200`, `ran:0` con `skippedReason:"not_due"` en los 8 agentes (correcto
— la corrida manual de la sección 4 ya había corrido hace 2 minutos, y el
intervalo es de 24h). Log del cron periódico: `/var/log/onia-agents-cron.log`.

## 7. Hallazgo honesto — comercio no genera propuestas (no es un bug que se
   arregle desde este carril; reportar al carril de producto)

El runtime de agentes hoy es **dental-only en los hechos**, aunque
`data/onia-core/vertical-packs.json` declara el módulo `agents` disponible
también para `gestios-general` (comercio):

- Solo existen 2 roles en código: `recall` y `cobrador`
  (`lib/onia-core/modules/agents-runtime.ts`, `AGENT_KINDS`). No hay
  `vendedor` ni `stock` — **no se inventaron** porque el runtime no los
  procesaría (`runAgentsForOrg` itera `Object.keys(AGENT_KINDS)` a secas).
- `getRecallFeed` lee `prisma.patient` + `prisma.appointment`
  (`emailOptOut`, `dob`, citas) — modelo clínico puro.
- `getCollectorFeed` lee `prisma.invoice`, y `Invoice.patientId` es
  **`NOT NULL`** en el schema (`prisma/schema.prisma:600`,
  `invoices_patientId_fkey` FK a `patients`). Una org de comercio sin
  pacientes **no puede tener facturas** en este modelo de datos tal como
  está — cobrador nunca tendrá candidatos para gestios-general sin abusar
  de la tabla `Patient` como "cliente" genérico.
- Resultado medido en esta sesión: `DEMO Ferreteria Onia` y
  `Comercio Demo — dv2-msdpa6lj` corrieron sin error (`ran=true` en ambos
  roles) pero con `pendingApproval:0` — 0 candidatos, porque ambas orgs
  tienen 0 filas en `patients`/`invoices` (confirmado antes del seed).

**No se tocó código de producto para arreglar esto** (regla del carril: el
fix va al carril de producto). Queda para ese carril: o (a) construir un
modelo de datos de comercio (`Customer`/`Sale` en vez de `Patient`/`Invoice`)
y roles `vendedor`/`stock` con su propio feed, o (b) generalizar
`getCollectorFeed`/`getRecallFeed` para no depender de `Patient` cuando el
`verticalTrackId` de la org es `gestios-general`.

## 8. Cómo repetir esto para un cliente real (no demo)

1. Confirmar `PLATFORM_LAYER=1` y `AGENTS_RUNTIME=1` en
   `/opt/onia-platform/app.env` (ya están en `1` en prod, no tocar salvo
   incidente).
2. Dar de alta la entitlement:
   ```sql
   INSERT INTO organization_entitlements (id, "organizationId", "featureKey", status, source, limits, "createdAt", "updatedAt")
   VALUES (gen_random_uuid()::text, '<orgId>', 'module.agents', 'active', 'plan-<nombre-plan>', '{}'::jsonb, now(), now())
   ON CONFLICT ("organizationId", "featureKey") DO UPDATE SET status = 'active', "updatedAt" = now();
   ```
   Preferible via el endpoint/admin UI de entitlements si el producto ya
   expone uno — revisar antes de ir directo a SQL.
3. **No sembrar datos falsos en un cliente real.** El paso de "seed mínimo"
   de esta sesión es exclusivo de DEMO (orgs sin datos reales) para poder
   probar el pipeline. Un cliente real ya tiene pacientes/facturas reales:
   si el agente no propone nada, es porque no hay candidatos reales (nada
   que corregir), no porque falte seed.
4. El cron diario ya cubre todas las orgs con la entitlement activa —no
   hace falta un cron por cliente, `runAgentsForAllOrgs()` itera todas.
5. Si el cliente es del vertical `gestios-general` (comercio), hoy **no
   generará propuestas** por el gap de §7 — avisar antes de vender el
   feature a un comercio, no es honesto ofrecerlo todavía para ese
   vertical.

## 9. Qué NO se hizo (fuera de alcance de este carril)

- No se tocó `C:\dev\proyectos\onia-platform` (repo de producto) — solo
  lectura para entender el runtime.
- No se arregló el gap de comercio en código — reportado en §7.
- No se sembró "DEMO Importadora" — no existe en la base (§2).
- No se aprobó ni ejecutó ninguna de las 4 propuestas — quedan `pending` en
  `/pending`, a la espera de aprobación humana (regla dura del repo).
