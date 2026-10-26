# Onia - Automatizaciones n8n en vivo (2026-07-04)

Workflows autónomos corriendo en el n8n del VPS
(`https://n8n-sergio-n8n.hqdqgh.easypanel.host`), creados/gestionados por el **MCP
de n8n** (no por el navegador — la sesión web expira y da "Autosave failed:
Unauthorized"; el MCP tiene su propia auth). Todos usan la credencial SSH
`ONIA VPS SSH` (id `4XKauEX3b6cqaDhW`, sshPrivateKey) para llegar al VPS y avisan
a Sergio por Telegram con la credencial n8n `telegramApi` (token) y el **chat ID
hardcodeado** `6830070978` en el nodo. REGLA: **no usar `$env`** en nodos n8n (este
plan Easypanel puede perder las vars en un redeploy) — chat IDs hardcodeados. Los
webhooks (Nuevo Lead / Nuvia / Propuesta) validan el `secret` **server-side**: un nodo
SSH previo corre `/opt/onia/check-secret.sh` que compara contra
`ONIA_CENTER_INTERNAL_API_KEY` (leída del contenedor onia-center) y devuelve solo
`{authorized:true|false}` — la key nunca entra a n8n, sin `$env`.

## Workflows activos

| Workflow | id n8n | Cron (La Paz) | Qué hace | Telegram |
|---|---|---|---|---|
| ONIA - Web Factory VPS Radar | `aHFLqEtzqvq6SE3e` | Lun-Sab 07:10 | Corre el worker `--mode daily` en `/opt/onia-hermes/web-factory` (harvest referencias + intelligence + chequeo precios Nuvia) | OK/FALLO diario |
| ONIA - VPS Healthcheck | `VaX3lx0zibnNbg57` | Cada 2h (`0 */2 * * *`) | `/opt/onia/vps-healthcheck.sh`: contenedores críticos + disco + RAM | Solo si hay problema |
| ONIA - Backup diario | `gN7pQld6Lh3qAcTS` | Diario 03:00 | `/opt/onia/vps-backup.sh`: dump Supabase DentalGest + export workflows/credenciales n8n → `/opt/onia/backups` (rotación 7 días) | OK con tamaños / FALLO |
| ONIA - Web Factory QA | `GFeCZKr1zQT6CVN8` | Diario 08:00 | `/opt/onia/web-factory-qa.sh`: regenera los 6 demos y valida el HTML (roto/vacío/template sin renderizar) | Solo si un template se rompió |
| ONIA - Prospeccion diaria | `jspfoUsjQfQ1VXY4` | Lun-Vie 09:00 | Nudge: rota rubro+ciudad y manda el prompt de prospección (no contacta, no inventa) | Diario |
| ONIA - Generar Propuesta (oficial) | `rwQuwSvd29bV34EY` | Webhook on-demand | `POST /webhook/generar-propuesta` `{slug,secret}`: corre el generador oficial + PDF (chromium VPS) por SSH y manda el PDF a Sergio para revisar antes de enviar al cliente | PDF por propuesta |
| ONIA - Agente Vendedor (borradores) | `C96NmbalLhaTEf0G` | Lun-Sab 08:30 | SSH `docker exec onia-center sales-agent.mjs`: lee leads del CRM, califica+redacta con LiteLLM, deja SOLO borradores (tarea + review_queue pending/sensitive/reviewer=sergio). NO envia | Solo si hay borradores |
| ONIA - Nuevo Lead (speed-to-lead) | `WA6VkNu5OHo6Npem` | Webhook on-demand | `POST /webhook/nuevo-lead` `{secret,company,contact,channel,message}`: crea el lead + califica + redacta la primera respuesta (borrador) al toque. Bridge inbound (formulario/WhatsApp/Hermes) -> CRM -> Vendedor. NO envia | Por lead |
| ONIA - Nuvia Sourcing Score (v1) | `ECC1THa2kTmOGepY` | Webhook on-demand | `POST /webhook/nuvia-candidato` `{secret,candidates[]}`: score ONIA-Bolivia (flete/arancel/demanda/precio) por SSH, upsert en `nuvia_sourcing_candidates`. Read-only, sin contacto ni pago | Por lote |
| ONIA - Reporte diario Sergio + Arthur | `xQaO3Sfsl9XzMiid` | Lun-Sab 07:00 | SSH `arthur-report.mjs`: tareas del dia para Sergio y Arthur (obligaciones acuerdo 60d + CRM vivo) + verificacion de ganancias de Arthur (payment_commissions por estado + progreso trial). Determinista, solo suma lo registrado. Agrega repo pulse + docs hygiene (duplicados raiz/docs) al texto | Diario |
| ONIA Center - Briefing diario operativo | `ONIADailyBrief001` | Lun-Sab 06:45 | Lee el repo pulse (SSH cat) -> SSH `briefing-run.sh` -> `briefing-run.mjs` (docker exec onia-center): genera+registra el plan diario por rol (Sergio/Arthur/seller), deduplicado, con seccion de actividad de repo. La `ONIA_CENTER_INTERNAL_API_KEY` se lee del contenedor, sin `$env` | Plan diario + repo |
| ONIA - Agente Finanzas y Fondo ONIA | `oKSTNdvS58ixBgnl` | Lun-Sab 07:15 | SSH `finance-fund-agent.mjs` (docker exec onia-center): agrega caja + ingresos 30d + comisiones por estado + Fondo ONIA en `onia_center.finance_summary` (upsert diario) + pone `agent_finance_fund` en `ready`. Determinista, READ-ONLY sobre la plata | Solo si hay anomalias |
| ONIA - Agente Contenido y Media Lab | `nZkaXaZVKzgtwUqU` | Lun-Sab 07:20 | SSH `content-media-agent.mjs` (docker exec onia-center): elige pilar/idea, redacta con LiteLLM SOLO texto (guion "que grabar hoy" + carruseles), deja borradores en `review_queue` (pending/sensitive/reviewer=sergio) + pone `agent_content_media` en `ready`. Higgsfield NO automatico. **Reemplaza a "Guiones Diarios" (`NDXLJiR00ciQx72V`, archivado 2026-07-09).** | Guion completo + carruseles |

Los 5 crones fueron probados end-to-end antes de activar (ejecución real + Telegram
recibido). El de propuestas (webhook) se probó con slug real (`bench`), secret
inválido (401) e inyección de slug (401) — 3/3 ejecuciones OK.

## Auditoría de autonomía + limpieza (2026-07-05, sesión infra)

- **Autonomía:** escaneado el export completo de workflows. **Todos los workflows
  ACTIVOS son autónomos** — no dependen del laptop de Sergio. El briefing llama al
  endpoint `onia-center` desde **dentro del contenedor** (docker-interno, siempre-on),
  no localhost. Las únicas dependencias locales (`127.0.0.1:3031` propuestas viejo,
  `SearXNG`) vivían en workflows **inactivos**.
- **Briefing sin `$env` (2026-07-06):** el `ONIADailyBrief001` usaba `$env`
  (`ONIA_CENTER_BASE_URL`, `ONIA_CENTER_INTERNAL_API_KEY`, `TELEGRAM_BOT_TOKEN`,
  `TELEGRAM_SERGIO_CHAT_ID`) en nodos HTTP crudos. Refactorizado: el HTTP con la key
  interna -> nodo **SSH** que corre `briefing-run.sh` -> `briefing-run.mjs` dentro de
  onia-center (la key se lee del contenedor, nunca entra a n8n); el HTTP de Telegram
  con `$env.TELEGRAM_BOT_TOKEN` -> nodo **Telegram con credencial** `telegramApi` +
  chat ID hardcodeado; eliminado el IF `Telegram configurado?` (chequeaba `$env`).
  Probado en vivo (ejecución manual: briefing commit OK, Telegram `message_id` 767).
- **Repo pulse (2026-07-06):** los bots de plan diario (Briefing + Reporte Sergio/Arthur)
  ahora leen el repo. Mecanismo sin secrets nuevos: `.github/workflows/repo-pulse.yml`
  (cron 06:00 La Paz + `workflow_dispatch`) corre `scripts/repo-pulse.mjs` en el checkout
  de Actions (git log --all sobre historial completo + todas las ramas, clasifica cada
  commit por carril con rutas reales del repo, detecta carriles sin actividad >=3 dias) y
  sube el JSON al VPS por SSH reusando `ONIA_VPS_SSH_KEY` (el mismo del deploy) a
  `/opt/onia/state/repo-pulse-latest.json`. Los workflows n8n solo hacen `cat` de ese
  archivo (nodo SSH "Leer repo pulse", sin tocar GitHub desde el VPS) y agregan una
  seccion "Repo (ultimas Nh): X commits. Carriles activos: ..." al texto de Telegram.
  Probado en vivo: Action corrida por `workflow_dispatch` (verde, JSON en el VPS),
  ambos workflows n8n republicados y probados (`message_id` 769 Briefing, 770 Reporte).
- **Docs hygiene (2026-07-06):** agente de limpieza diaria de docs (carril G). Fuente
  de verdad `hermes-content/docs/`; la raiz no deberia tener gemelos. Mismo mecanismo
  sin secrets nuevos que repo pulse: `.github/workflows/docs-hygiene-daily.yml` (cron
  06:10 La Paz + `workflow_dispatch` con input `apply` true/false) corre
  `scripts/docs-hygiene.mjs`, que detecta duplicados raiz<->docs/ por hash de
  contenido (identico byte-a-byte, cualquier nombre) y por nombre (exacto o "fuzzy":
  mismo tema con prefijo distinto, ej. `HERMES_OPERATIONS.md` <-> `OPERATIONS.md`).
  Con `--apply` borra (git rm + commit local; el push lo hace el workflow) SOLO los
  identicos byte-a-byte — nunca toca `hermes-content/docs/`, nunca borra divergentes
  ni "nuevos en raiz". El JSON completo sube al VPS por SSH a
  `/opt/onia/state/docs-hygiene-latest.json`; el nodo SSH "Leer docs hygiene" (cat,
  igual que repo pulse) lo agrega al Reporte Sergio+Arthur con la seccion "Docs
  (limpieza diaria)": conteos + top divergentes (posible fusion pendiente) + top
  nuevos en raiz (deberian moverse a docs/). 18 tests (`node --test
  scripts/docs-hygiene.test.mjs`, unitarios + fixture git real). Estado real del repo
  al construirlo (2026-07-06): 0 identicos (ya limpiados en `f9a6a4db`), 18
  divergentes (incluye el patron `HERMES_*` vs su version en docs/) y 19 nuevos en
  raiz — quedan listados en el primer reporte para que Sergio decida cuales fusionar
  y cuales archivar.
  Republicado y probado en vivo (`update_workflow` + `publish_workflow` +
  `execute_workflow` production): `message_id` 774 (Telegram real a Sergio, con la
  seccion "Docs (limpieza diaria)" ya incluida). Ese primer envio expuso un bug real
  del nodo Telegram: sin `parse_mode` seteado, Telegram parseaba el texto como
  Markdown legacy y se comia los "_" de los nombres de archivo (`HERMES_OPERATIONS.md`
  llegaba como `HERMESOPERATIONS.md`). Fix: `parse_mode: 'HTML'` en "Enviar a Sergio"
  (HTML no toca "_") + separador `relPath <-> twin` cambiado a `relPath vs twin` (un
  `<->` crudo es inseguro en HTML). Re-probado en vivo: `message_id` 775, nombres de
  archivo intactos.
- **Propuestas:** el pipeline viejo (`FGqyNTrQfMIFiVG2`) apuntaba a `127.0.0.1:3031`
  (inalcanzable desde el contenedor n8n) y usaba un generador ad-hoc. Reemplazado
  por `ONIA - Generar Propuesta (oficial)` (arriba), que corre el generador oficial
  `hermes-content/propuestas/generador` por SSH. Wrapper VPS:
  `/opt/onia/generar-propuesta-pdf.sh` (fuente en `hermes-content/deploy/vps-ops/`;
  el generador imprime PDF solo en Windows, así que el wrapper hace el PDF con el
  chromium del VPS). Export SDK: `hermes-content/deploy/n8n/workflows/onia-generar-propuesta.workflow.js`.
- **Limpieza (archivados, reversibles con Unarchive):** `rGvQb4CRBdJPwrp1`
  (Prospección Diaria vieja, superada por la v1 activa), `VeCHKr6wkK5Wet25`
  (Scheduled Operations Pack, SSH roto), `FGqyNTrQfMIFiVG2` (pipeline propuestas
  viejo). **NO tocados:** los 3 GestiOS de estructura rota (producto, otro repo) y
  `zediOCdtlP1zpImK` Mara Daily Content (carril contenido).
- **Residual:** `iqsnnQXlJyypiew8` (draft roto de Web Factory Radar) tiene
  `availableInMCP:false` → no se puede archivar por MCP; queda para archivar por la
  UI de n8n (como los UDIA). Inactivo, sin trigger, cero impacto.
- **Prospección auto-búsqueda:** la v1 (nudge) es autónoma; el upgrade a
  auto-búsqueda real sigue **bloqueado por credencial** (Tavily/Google Places — S7).

## Agentes con LLM (2026-07-05) — patrón n8n → SSH → docker exec onia-center

n8n NO alcanza LiteLLM ni la DB onia_center por red (redes docker aisladas). El
patrón que SÍ funciona: n8n → SSH al host → `docker exec onia-center node <script>`
(onia-center tiene la key de Supabase en su env y está en la red de LiteLLM). La
master key de LiteLLM se lee de su contenedor y se inyecta. Scripts en
`hermes-content/deploy/vps-ops/` → desplegados a `/opt/onia/`.

- **Agente Vendedor** (`C96NmbalLhaTEf0G`): `sales-agent.mjs` + `sales-agent-run.sh`.
  Modelo LiteLLM `gpt-4o-mini`. Dedupe por review_queue pendiente (no re-procesa).
  Dry-run: `SALES_AGENT_DRY_RUN=true SALES_AGENT_TEST_LEAD='{...}' bash /opt/onia/sales-agent-run.sh`.
  CRM tiene 0 leads hoy → produce borradores recién cuando entren leads.
- **Nuvia Sourcing** (`ECC1THa2kTmOGepY`): `nuvia-score.mjs` + `nuvia-score-run.sh`.
  Score determinista (sin LLM, sin gastar). Tabla `onia_center.nuvia_sourcing_candidates`
  (migración `supabase/migrations/20260705_nuvia_sourcing_candidates.sql`, aplicada en
  el contenedor `supabase-db`; el schema onia_center vive ahí, NO en dentalgest-staging).
  Params tunables: `NUVIA_FREIGHT_USD_PER_KG`, mapa de aranceles por rubro en el script.
- **Nuvia scraping pesado (browser-use/Skyvern): NO instalado.** VPS con ~2.2GB libres
  (9GB usados en ~25 contenedores prod) → Chrome headless dedicado arriesga OOM en prod.
  **Falta un VPS worker dedicado** para el sourcing autónomo; hoy el webhook recibe
  candidatos (de Hermes/manual/otra fuente) y los scorea. Ver research doc
  `hermes-content/docs/research/ONIA_RESEARCH_AGENTE_IMPORTACION_NUVIA_20260705.md`.

## Agentes Contenido + Finanzas (2026-07-09, sesion infra)

Dos runtimes nuevos con el mismo patron Agente Vendedor (cron -> SSH -> `docker exec
onia-center node <script>` -> escribe a Supabase + status del agente `ready` -> Telegram;
NO ejecuta ni gasta sin aprobacion). Ambos probados en vivo con `execute_workflow`
(contenido: 3 borradores + Telegram `message_id` 835; finanzas: `finance_summary` escrito,
sin Telegram por no haber anomalias — comportamiento correcto).

- **Agente Contenido y Media Lab** (`nZkaXaZVKzgtwUqU`): `content-media-agent.mjs` +
  `content-media-agent-run.sh`. Reusa la rotacion de pilares de "Guiones Diarios" + lee
  `idea_inbox`; LiteLLM `gpt-4o-mini` redacta SOLO texto (1 guion + 1-2 carruseles) y deja
  cada pieza en `review_queue` (`source_type=project`, `source_key=project-content`,
  `raw.agent=content-media-agent-v1`, `raw.kind=content_script|content_carousel`). Dedupe por
  fecha (no re-genera si ya hay borradores de hoy). La generacion PESADA (Higgsfield) NO es
  automatica: el agente propone texto, no gasta creditos (gasto-validar-primero). El Telegram
  manda el GUION COMPLETO + carruseles (gancho/desarrollo/CTA/texto en pantalla/prompt
  visual/voz-tono + slides), asi que **reemplaza al viejo "Guiones Diarios"**
  (`NDXLJiR00ciQx72V`), archivado 2026-07-09 para no mandar dos mensajes de contenido. Probado
  con guion completo: Telegram `message_id` 838.
- **Agente Finanzas y Fondo ONIA** (`oKSTNdvS58ixBgnl`): `finance-fund-agent.mjs` +
  `finance-fund-agent-run.sh`. Determinista (sin LLM), READ-ONLY sobre la plata. Agrega caja
  (income_entries), comisiones por estado (payment_commissions), Fondo Onia (fund_allocation)
  y riesgos (pagos bloqueados, uso premium sin aprobar, gastos pendientes sin evidencia) en
  `onia_center.finance_summary` (tabla nueva, migracion
  `20260709_onia_center_finance_summary.sql`, upsert 1 fila/dia). Telegram SOLO si hay
  anomalias. **Punto de coordinacion con el panel:** el panel LEE la fila mas reciente de
  `finance_summary` — contrato en `ONIA_FINANCE_SUMMARY_CONTRACT.md`.

## Building in Public + pausa por vacaciones (2026-07-10, sesion infra)

**Agente Building in Public** (`XRS9fWY4yFMQQftF`, **DESACTIVADO**): `building-public-agent.mjs`
+ `building-public-agent-run.sh`. Lee el repo-pulse (commits por carril,
`/opt/onia/state/repo-pulse-latest.json`), escribe `onia_center.dev_pulse` (visibilidad de
"estamos construyendo todo el tiempo" — nombres reales de carril, interno/sergio_private) y
redacta con LiteLLM contenido building-in-public **SANITIZADO** (allowlist carril->tema publico;
clientes como Bolivian Electric se DESCARTAN) en `review_queue` (`raw.agent=building-public-agent-v1`).
Migracion `20260710_onia_center_dev_pulse.sql`. Cron Lunes 07:25 (semanal). Creado inactivo a
pedido de Sergio (vacaciones); runtime probado en vivo (224 commits/72h -> dev_pulse + 2
borradores sanitizados). **Activar con `publish_workflow` al volver.**

**Pausa por vacaciones (2026-07-10):** desactivados (`unpublish_workflow`) mientras Sergio no
puede aprobar borradores: Agente Contenido (`nZkaXaZVKzgtwUqU`), Agente Vendedor
(`C96NmbalLhaTEf0G`), Prospeccion diaria (`jspfoUsjQfQ1VXY4`). **Siguen activos** (read-only o
sin necesitar a Sergio): Agente Finanzas (`oKSTNdvS58ixBgnl`, solo avisa por anomalias), backup,
healthcheck, VPS radar, tipo de cambio, etc. Reactivar con `publish_workflow` al volver.

## Aviso de pago QR por Telegram, sin depender del correo (2026-08-14)

**El problema:** un cliente sube el comprobante de pago QR
(`POST /api/subscription-payment` en `onia-platform`, tabla `subscription_payments`,
`status='PENDING'` por default) y la propia ruta intenta avisar por email a
`ADMIN_NOTIFICATION_EMAIL` con `getEmailClient()` (`lib/email.ts`). En produccion
`EMAIL_PROVIDER=smtp` cae a Nodemailer contra `smtp-relay.brevo.com`, que devuelve
`535 5.7.8 Authentication failed` — la credencial depende de Sergio y no esta. El
envio esta en un `try/catch` que solo hace `console.error`: **si falla, nadie se
entera nunca**, ni el pago ni el error quedan visibles en ningun lado.

Tambien existe `WF-02: QR Payment Alerts` (`9bF53cn0lkvdUyZT`, activo, tag
`dentalgest`, ver `historial/N8N_AUTOMATIONS.md`) — poll cada 5 min contra la RPC de Supabase
`n8n_pending_qr_payments` y manda un email por Gmail a `business@onia.com.bo`. Sigue
activo y sin tocar. Pero **es otro canal de correo**, y Sergio no revisa esa bandeja
en tiempo real — el pedido explicito fue un canal que no dependa del correo en
absoluto.

**Disparador elegido: polling directo a Postgres, no webhook.** Un webhook exigiria
tocar el codigo de `onia-platform` (agregar un `fetch()` en
`app/api/subscription-payment/route.ts` hacia n8n) — carril de infra no toca ese
repo. El polling contra la base **no requiere ningun cambio en el producto**.

**Historial de la identidad de la base (dos correcciones, la segunda es la que
vale) — dejarlo escrito para que el proximo que lea esto no repita el error:**

1. Primer intento: usar la credencial `Postgres account` (`2P4w95n0vir90EkT`) ya
   cargada en n8n, asumiendo que apuntaba al VPS. **Mal.** Esa credencial resulto
   apuntar a Supabase Cloud (`kvepqgikokjlacxngkiw`, IPv6 en bloque AWS, Postgres
   17.6 aarch64/Graviton, `org_count=9`) — un proyecto cloud verificado por cruce
   con la REST API publica (mismos `id`/`createdAt` exactos), pero que **no es donde
   escribe la app real**. La confusion vino de docs viejos de `onia-platform`
   (`CREDENTIALS_GUIDE.md`, `SUPABASE_SELFHOST_MIGRATION_PLAN.md` del 29/30-jun) que
   describian el plan de migracion self-host **antes del corte** — el corte ya se
   hizo despues y esos docs quedaron desactualizados.
2. **Verificacion real, hecha desde el propio VPS (por el dueño del producto):**
   registro de organizaciones **entrando por `https://app.onia.com.bo/register`**
   (la app en vivo) y las encontro en el contenedor `dentalgest-staging-supabase-db`
   del VPS (a pesar del nombre "staging", es la base que la app usa hoy) — no en la
   nube. Dato irrefutable: una organizacion con `verticalTrackId=ganadero-offline`
   (rubro encendido en el codigo ESE MISMO DIA) aparecio ahi y en ningun otro lado.
3. Se repitio la identificacion **contra esa base real**: `org_count=17`, con
   `ZZ QA Estancia Ganadero | ZZ QA clinico | ZZ QA comercio | ZZ QA administracion |
   ...` entre los nombres — coincide exacto con lo reportado. `inet_server_port()=55329`
   (Postgres, dentro del contenedor, escucha en 55329, no en el 5432 por defecto).

**Por que `Postgres account` no la alcanzaba y como se resolvio:** el n8n del VPS
corre como servicio Docker Swarm (`n8n-sergio_n8n`) en las redes `easypanel` /
`easypanel-n8n-sergio`; el stack Supabase de DentalGest (`dentalgest-staging-supabase-*`,
red `dentalgest-staging-supabase_default`, driver `bridge` local) es una red aparte —
por eso el host del contenedor no resolvia (`Host not found`). Se conecto el
contenedor de n8n a esa red (`docker network connect dentalgest-staging-supabase_default
n8n-sergio_n8n...`, no destructivo, solo agrega una interfaz de red mas) y se creo una
credencial n8n nueva, **`Postgres VPS (dentalgest-staging)`** (id `ecF3x3SGUrT0hBbm`),
con los mismos datos de conexion que usa la app real (`DIRECT_URL` de
`/opt/onia-platform/app.env`: host `dentalgest-staging-supabase-pooler`, puerto `5432`,
usuario `postgres.your-tenant-id`) — la contraseña se leyo una sola vez por SSH para
crear la credencial y no quedo en ningun archivo del repo ni del scratchpad.
**Nota de infraestructura pendiente:** la conexion de red se hizo a mano sobre el
contenedor en ejecucion; si Easypanel redespliega el servicio de n8n, hay que
reconectarlo (`docker network connect dentalgest-staging-supabase_default <contenedor
n8n>`) o agregarlo de forma persistente en la config del stack.

**Conclusion final: `Postgres account` (cloud) NO sirve para este workflow.** El
workflow usa `Postgres VPS (dentalgest-staging)`, contra la base real (17
organizaciones, confirmado). La prueba funcional completa (mas abajo) se corrio
contra esta base.

**Sin duplicados: tabla de vistos, no "probablemente no pase".** Antes de cada
`SELECT`, un nodo Postgres corre `CREATE SCHEMA IF NOT EXISTS n8n_ops; CREATE TABLE
IF NOT EXISTS n8n_ops.payment_alerts_sent (payment_id text PRIMARY KEY, notified_at
timestamptz DEFAULT now())` — un schema propio de n8n, fuera de las migraciones de
Prisma, no toca ninguna tabla del producto. El `SELECT` trae `subscription_payments`
con `status='PENDING'` y `NOT EXISTS (SELECT 1 FROM n8n_ops.payment_alerts_sent WHERE
payment_id = sp.id)`. Recien **despues** de que el nodo Telegram devuelve `ok:true`
corre el `INSERT ... ON CONFLICT (payment_id) DO NOTHING` que lo marca como avisado.
Si el envio a Telegram falla, el `INSERT` no corre y el siguiente barrido reintenta
— duplicado solo si dos barridos se solapan (imposible aqui: intervalo de 5 min
&gt;&gt; tiempo de ejecucion) o si dos items del mismo barrido fallan a mitad de
lote (borde de baja probabilidad dado el volumen; no se construyo aislamiento por
item para esto).

**Workflow:** `ONIA - Aviso de pago QR (Telegram)`, id `2gk5aOIvIHBbttqJ`, activo.

| # | Nodo | Tipo | Que hace |
|---|---|---|---|
| 1 | `Cada 5 min` | `scheduleTrigger` (`*/5 * * * *`) | Dispara el barrido |
| 2 | `Asegurar tabla de vistos` | `postgres` executeQuery | DDL idempotente (schema `n8n_ops`) |
| 3 | `Pagos QR pendientes sin avisar` | `postgres` executeQuery | `SELECT` con anti-join contra la tabla de vistos, `JOIN organizations` |
| 4 | `Avisar a Sergio (Telegram)` | `telegram` sendMessage | Credencial `Telegram account` (`r8y2CN5RyOEIDce3`), chat `6830070978` hardcodeado. Clinica, pagador, plan, monto, banco, ref, comprobante y link a `/admin/payments` |
| 5 | `Marcar aviso enviado` | `postgres` executeQuery | `INSERT ... ON CONFLICT DO NOTHING` referenciando `$('Pagos QR pendientes sin avisar').item.json.id` |

Credenciales: `Postgres VPS (dentalgest-staging)` (id `ecF3x3SGUrT0hBbm`, postgres,
nodos 2/3/5 — **nueva, creada en esta sesion**, ver justificacion arriba) y
`Telegram account` (telegramApi, nodo 4 — ya existia, reusada tal cual).

**Prueba real end-to-end contra la base correcta (2026-08-14), no simulada:**

1. Antes: `SELECT count(*) FROM organizations` = 17 (confirma la base). 0 filas
   `PENDING` en `subscription_payments`.
2. Insert de prueba: fila `PENDING` real (`id=test-payalert-vps-003`, org
   `ZZ QA clinico`, monto 320.00, banco BNB) — la misma query trajo `org_count=17`
   pegado a la fila insertada, para dejar la identidad de la base atada a la prueba.
3. Ejecucion manual del workflow: Telegram respondio `ok:true`, `message_id:1608`,
   `chat:{id:6830070978,first_name:"Sergio",last_name:"Urcullo"}` — mensaje real
   entregado. El `INSERT` de marcado corrio despues, `success:true`.
4. Segunda ejecucion inmediata: `SELECT` devuelve `[]` — el pago ya estaba en
   `n8n_ops.payment_alerts_sent` (creada de cero en esta base), **no se mando un
   segundo mensaje**.
5. Limpieza: `DELETE` de la fila de prueba y de su entrada en
   `n8n_ops.payment_alerts_sent`. Verificado: `payment_row=0, tracking_row=0,
   total_pending=0, org_count=17`.

Workflow publicado (`publish_workflow`) recien despues de que esta prueba salio bien.

**Nota historica (no borrar, para que no se repita el error):** antes de esto se
corrieron dos "pruebas completas" (`message_id` 1606 y 1607) contra la credencial
`Postgres account` — Telegram tambien las entrego, pero estaban corriendo contra
Supabase Cloud (`kvepqgikokjlacxngkiw`, `org_count=9`), **no la base donde escribe la
app real**. Que el mensaje de Telegram llegue no prueba que la base sea la correcta;
lo unico que prueba eso es el conteo de organizaciones (o un dato equivalente,
verificable independientemente) contra el numero real que reporta quien tiene acceso
directo al VPS.

**No verificado:** no se confirmo en produccion el error exacto `535` del SMTP de
Brevo (no hay acceso a las env vars de runtime de `onia-platform` en Vercel desde
este carril) — se tomo como dato de entrada del pedido. Tampoco se confirmo si
`WF-02`/Gmail efectivamente le llega a alguien: solo se confirmo que el `SELECT`
corre y devuelve `[]` (no hubo pagos reales que probaran el envio de Gmail). `WF-02`
sigue usando la RPC de Supabase Cloud (`kvepqgikokjlacxngkiw`) sin tocar — si esa
tambien deberia apuntar al VPS es una pregunta abierta, fuera del alcance de esta
sesion.

## Monitor que MIRA las pantallas del cliente (2026-08-22, sesion infra)

**Por que existe:** los monitores de arriba vigilan contenedores, chatbot, n8n, demos
y backup. **Ninguno abria una pantalla de cliente.** El fallo del login que mostraba
`credit_card_off` y `verified_user` como TEXTO (fuente de iconos de 3,9 MB, 117 s)
**devolvia HTTP 200** y fue invisible para los cinco; lo encontro Sergio. Con un
cliente real adentro (clinica klein, prueba hasta el 4-sep) ese fallo es caro.

**No es n8n:** es un cron plano en el VPS. No hace falta n8n para esto y un workflow
mas seria una pieza mas que se puede caer sin avisar.

| Que | Donde |
|---|---|
| Chequeo | `/root/bin/onia-mirar-cliente.mjs` |
| Wrapper de cron | `/root/bin/onia-mirar-cliente.sh` |
| Prueba de fallo | `/root/bin/onia-mirar-cliente-prueba.sh` |
| Cron | `*/15 * * * * /root/bin/onia-mirar-cliente.sh >> /var/log/onia-mirar-cliente.log 2>&1` |
| Log | `/var/log/onia-mirar-cliente.log` |
| Estado (anti-ruido) | `/root/.onia-mirar-estado.json` |
| Fuente en el repo | `hermes-content/deploy/vps-ops/onia-mirar-cliente*` |

**Como se apaga:** `crontab -e` y comentar la linea `onia-mirar-cliente`. Los scripts
quedan; no borra nada. Para volver a avisar sobre un fallo ya avisado:
`rm /root/.onia-mirar-estado.json`.

**Vive en `/root/bin` y no en `/opt/onia`** a proposito: el `.mjs` importa
`playwright-core` y node lo resuelve subiendo desde la carpeta DEL ARCHIVO, o sea
`/root/node_modules` (que ya lo tiene). Desde `/opt/onia` no lo encontraria.

**Metodo — mide geometria, no HTML.** Renderiza con Chromium headless
(`playwright-core` + `chrome-headless-shell` **ya instalados**, `/root/.cache/ms-playwright`),
espera `document.fonts.ready` y mide el ancho del glifo contra su `font-size` con un
`Range` sobre el nodo de texto. Un icono correcto da razon **1,00**; la palabra
`credit_card_off` a 24px da **6,15**. Umbral 2,5, justo en el hueco. Se usa `Range` y
no el rect del elemento porque los iconos viven en cajas de ancho fijo (`w-9`): el
rect mediria la caja y la palabra desbordando seguiria dando 36px.

**Lo que NO cubre (honesto):** solo paginas publicas sin sesion; un solo navegador y
un solo viewport; no detecta icono equivocado-pero-angosto, color roto, solapamientos
ni ninguna regresion visual que no sea de ancho de glifo; no mira el dashboard.

**Superficies y umbrales** (calibrados contra lo medido en sano el 2026-08-22):

| Superficie | Texto que se exige | Iconos | Medido en sano |
|---|---|---|---|
| `https://app.onia.com.bo/login` | "Hola de nuevo", "Iniciar sesión" | >= 1 | 200, 1,5 s, 5 iconos razon 1,00 |
| `https://app.onia.com.bo/register` | "Pedí tu acceso" | >= 1 | 200, 1,2 s, 3 iconos razon 1,00 |
| `https://onia.com.bo/` | "Tu negocio no pierde" | — | 200, 0,8 s |

Umbrales: razon de glifo > 2,5 · carga > 15 s · fuente de iconos > 1,5 MB o > 10 s
(la rota pesaba 3,9 MB y tardaba 117 s; la sana pesa 243 KB en 0,3 s).

**Anti-ruido** (un monitor que grita cada 15 min se ignora): reintenta una vez a los
5 s antes de declarar fallo; avisa solo al **cambiar** de estado; recuerda cada 6 h si
sigue roto; avisa la recuperacion. Si el monitor **mismo** se cae (exit >= 2) el
wrapper avisa aparte, como mucho cada 6 h — un monitor muerto en silencio parece que
todo esta bien.

**Telegram:** mismo bot del guardian (`TELEGRAM_BOT_TOKEN` + `TELEGRAM_HOME_CHANNEL`
de `/root/.hermes/.env`), **no** se creo uno nuevo. `parse_mode=HTML` obligatorio: los
mensajes citan ligaduras como `credit_card_off` y con Markdown un guion bajo suelto
abre cursiva, Telegram responde 400 y el mensaje **no llega nunca**.

**Probado 2026-08-22:** sano dos corridas seguidas -> 0 mensajes (`exit=0`). Fallo
inyectado (pagina real con la fuente de iconos ausente + URL 404) -> `exit=1` y
Telegram **ENVIADO** con `"credit_card_off" (x6.15), "verified_user" (x5.28)`.
Recuperacion -> mensaje verde. Monitor caido (`MIRAR_CHROME=/no/existe`) -> `exit=2` y
aviso de caida. Re-verificar cuando se quiera: `/root/bin/onia-mirar-cliente-prueba.sh`.

### ⚠️ Correccion: en ESTE n8n `$env` SI funciona

Arriba dice "REGLA: no usar `$env`". **Verificado en vivo el 2026-08-22:** el
contenedor n8n tiene `N8N_BLOCK_ENV_ACCESS_IN_NODE=false`, o sea `$env` **esta
habilitado**. La regla de arriba sigue siendo buena practica (un redeploy puede
perder vars, y para secretos van credenciales de n8n), pero como **hecho tecnico**
era falsa y mandaba a cada sesion a hardcodear sin necesidad.

## Scripts de ops (en el VPS bajo /opt/onia/)

Fuente en este repo: `hermes-content/deploy/vps-ops/`. Se despliegan al VPS a
`/opt/onia/` (hoy subidos a mano vía SSH; falta automatizar el deploy de estos
scripts como parte del pipeline).

- `vps-healthcheck.sh` — emite JSON `{ok,disk,mem,problems}`.
- `vps-backup.sh` — emite JSON con tamaños; rotación 7 días.
- `web-factory-qa.sh` — regenera demos + valida HTML; emite JSON `{ok,checked,broken}`.

## Pendientes / upgrades

- **Backup off-site**: hoy la copia vive en el mismo VPS. Falta subir a Cloudflare
  R2 (crear bucket + API token) para resistir caída total del server. Agregar el
  upload al final de `vps-backup.sh`.
- **Prospección auto**: la v1 es un nudge. Para auto-buscar prospectos reales hace
  falta una fuente (Google Places API o Tavily) — sin eso no se puede sin fabricar.
- **QA visual real**: hoy es validación estructural del HTML. Playwright + chromium
  están instalados en el VPS (`/root/.cache/ms-playwright`), así que se puede
  subir a screenshots + regresión visual como v2.
- **Fuentes de verdad**: los workflows viven en n8n (respaldados por el backup
  diario). Las copias `.workflow.js` en `hermes-content/deploy/n8n/workflows/` son
  para versionado; recrear con el MCP `create_workflow_from_code`.
- **Rotar llave SSH** `onia_hermes_vps_ed25519`: se pegó en un chat, conviene
  rotarla (nueva llave → `authorized_keys` en VPS → actualizar credencial n8n →
  revocar vieja).
