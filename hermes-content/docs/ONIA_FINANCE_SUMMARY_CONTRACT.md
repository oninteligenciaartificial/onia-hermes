# ONIA Center — Contrato de lectura: agentes Finanzas y Contenido (2026-07-09)

> **Para la sesión del panel (`onia-center-rebuild`).** El carril **infra** ESCRIBE estos
> registros desde runtimes n8n; el **panel LEE**. Este es el único punto en común entre las
> dos sesiones. No cambies la forma de estas tablas sin avisar al carril infra: si necesitás
> otra columna, pedila y la agrego (yo escribo, vos leés).

Ambos agentes corren con el patrón **Agente Vendedor**: cron n8n → SSH → `docker exec
onia-center node <script>` → escribe a Supabase `onia_center` → status del agente `ready` →
Telegram a Sergio. **Nada se ejecuta ni gasta sin aprobación de Sergio.**

---

## 1. Agente Finanzas y Fondo ONIA → `onia_center.finance_summary`

Runtime: `hermes-content/deploy/vps-ops/finance-fund-agent.mjs`
Workflow n8n: `ONIA - Agente Finanzas y Fondo ONIA` (id `oKSTNdvS58ixBgnl`, Lun-Sab 07:15 La Paz).

Escribe **una fila por día** (upsert por `summary_key` = `fin-daily-YYYY-MM-DD`). Es
**read-only sobre la plata**: informa, no mueve dinero ni aprueba pagos.

### Cómo lo lee el panel

**La fila más reciente es el resumen vigente:**

```sql
select *
from onia_center.finance_summary
order by generated_at desc
limit 1;
```

Vía PostgREST (igual que el resto del panel, header `Accept-Profile: onia_center`):

```
GET /rest/v1/finance_summary?select=*&order=generated_at.desc&limit=1
```

### Columnas (contrato estable)

| Columna | Tipo | Qué es |
|---|---|---|
| `summary_key` | text | `fin-daily-YYYY-MM-DD` (único, 1 por día) |
| `scope` | text | `daily` (futuro: `weekly`/`monthly`) |
| `period_label` | text | Ej. `Diario · 2026-07-09 (La Paz)` |
| `generated_at` | timestamptz | **ordená por esto** para la fila vigente |
| `cash_total_bs` | numeric | Ingresos netos acumulados (todo el historial) |
| `cash_period_bs` | numeric | Ingresos netos últimos 30 días |
| `income_count` | int | Nº de cobros registrados |
| `commissions_by_status` | jsonb | `{ estimated, pending, approved, paid, blocked, discounted }` en Bs |
| `commissions_pending_bs` | numeric | Atajo: comisiones pendientes |
| `commissions_blocked_bs` | numeric | Atajo: comisiones bloqueadas |
| `fund_total_bs` | numeric | Fondo ONIA acumulado (payment_type=`fund_allocation`) |
| `expenses_pending_bs` | numeric | Gastos pendientes de aprobar |
| `premium_pending_bs` | numeric | Uso premium (Higgsfield/IA) sin aprobar |
| `anomaly_count` | int | Nº de anomalías detectadas |
| `anomalies` | jsonb | `[{ kind, detail, amount_bs }]` — para pintar alertas |
| `breakdown` | jsonb | `{ by_center, commissions_by_status, income_count, period_days }` |
| `summary_text` | text | Texto humano listo para mostrar (mismo que va a Telegram) |
| `raw` | jsonb | Metadata del run |
| `tax_posture` | jsonb | **NUEVO 2026-07-10** — postura fiscal del mes (ver subsección abajo). Aditivo, no rompe nada |

### Postura fiscal (`tax_posture`) — NUEVO 2026-07-10 ⚠️ PANEL LEER

> **Aviso al carril Panel:** columna **aditiva** `tax_posture jsonb` en `finance_summary`. Tu
> `select=*` ya la trae; no rompe ninguna columna existente. Es la sección fiscal para mostrar
> en Finanzas. Todo es **estimación** (etiqueta "validar con contador"); es READ-ONLY.

Objeto con la postura fiscal **del mes en curso** (se recalcula cada corrida). Base: régimen
**General**, sin planilla (RC-IVA N/A). Forma:

```jsonc
tax_posture: {
  "regime": "general", "rc_iva_applies": false, "siat_emitting": false,
  "nit": "5371375010", "nit_last_digit": "0", "razon_social": "LESLIE MERCADO MORENO",
  "period": "2026-07",
  "rates": { "iva": 0.13, "it": 0.03, "iue": 0.25, "iue_be": 0.125 },
  "iva_debito_bs": 0,            // 13% de ventas formales (0 mientras SIAT en trámite)
  "iva_credito_bs": 0,           // 13% de gastos NACIONALES con factura
  "iva_a_pagar_bs": 0,           // max(0, débito − crédito)
  "iva_saldo_favor_bs": 0,       // max(0, crédito − débito), se acumula
  "it_bs": 0,                    // 3% de ingresos del mes
  "iue_estimado_bs": 0,          // 25% de (ingresos − gastos deducibles) del año
  "credito_fiscal_perdido_bs": 0,// 13% de gastos nacionales SIN factura (a corregir)
  "iue_be_retenciones_bs": 0,    // 12.5% de gastos del exterior (a retener/pagar)
  "gastos_exterior_bs": 0, "gastos_con_factura_bs": 0, "gastos_sin_factura_bs": 0,
  "vencimiento_dia": 13,              // dígito 0 → día 13 (calendario SIN)
  "proximo_vencimiento": "2026-08-13",// próxima fecha de declaración IVA/IT
  "proximo_vencimiento_periodo": "2026-07", // período que declara (mes anterior)
  "dias_para_vencimiento": 34,
  "notes": "Estimación automática...",
  "generated_at": "ISO"
}
```

Sugerencia de UI: destacar `iva_a_pagar_bs` / `iva_saldo_favor_bs`, `iue_estimado_bs`, y
**`credito_fiscal_perdido_bs`** en rojo (plata que se pierde por no pedir factura).

`anomalies[].kind` ∈ `blocked_payment`, `pending_premium`, `pending_expense_no_evidence`,
`delivery_blocked`. El panel puede resaltar `anomaly_count > 0` en rojo.

### Ganancias por persona (`raw.earnings`) — NUEVO 2026-07-22 ⚠️ PANEL LEER

> **Aviso al carril Panel:** dentro de la columna `raw jsonb` (que tu `select=*` ya trae) el
> agente ahora deja **`raw.earnings`**: las ganancias reales de cada persona (Sergio, Arthur,
> Camila). Es la respuesta a "¿cuánto ganó cada uno?". READ-ONLY, derivado de lo registrado.

`raw.earnings` = **array**, una entrada por persona (roster base Sergio/Arthur/Camila + cualquier
otro actor con comisión real). Forma de cada entrada:

```jsonc
raw.earnings: [
  {
    "person_key": "sergio",          // clave estable
    "display_name": "Sergio",        // nombre para mostrar
    "role": "Dueno / Direccion ONIA (invierte, gana el margen)",
    "earned_bs": 0,                  // YA cobrado por la persona (comisiones status=paid)
    "pending_bs": 0,                 // por cobrar (estimated + pending + approved, sin pagar)
    "sales_count": 0                 // nº de cobros (income) distintos en que participa
  },
  { "person_key": "arthur", ... },
  { "person_key": "camila", ... }
]
```

Origen del dato: `payment_commissions.actor_role_key` + `payment_type`. **Regla clave:** la
ganancia PERSONAL de Sergio es solo `sergio_owner_income`; el **Fondo ONIA**
(`payment_type=fund_allocation`) es plata de la EMPRESA, **no** ganancia personal — va aparte en
`raw.earnings_context.company_fund_bs` (y en `fund_total_bs`). No sumarlo a Sergio en la UI.

`raw.earnings_context` acompaña con metadata: `{ model, generated_at, company_fund_bs,
total_sales, note, definitions, rules_source }`. Si `total_sales === 0` (sin ventas aún), `note`
lo dice y **todas las personas van en 0** (dato real, no estimado) — el panel puede mostrar
"sin ventas aún" en vez de una tabla vacía.

Sugerencia de UI: tabla "Ganancias del equipo" con columnas Persona · Cobrado · Por cobrar ·
Ventas; una fila aparte "Fondo ONIA (empresa)" con `company_fund_bs`. `person_key` es la clave
estable para ordenar/mapear avatares.

---

## 2. Agente Contenido y Media Lab → `onia_center.review_queue`

Runtime: `hermes-content/deploy/vps-ops/content-media-agent.mjs`
Workflow n8n: `ONIA - Agente Contenido y Media Lab (borradores)` (id `nZkaXaZVKzgtwUqU`, Lun-Sab 07:20 La Paz).

Deja borradores de contenido (guion "qué grabar hoy" + carruseles) en la **cola de aprobación**
existente. **Solo texto** — la generación pesada (Higgsfield video/imágenes) NO es automática,
va solo cuando Sergio aprueba el borrador.

### Cómo lo lee el panel

Los borradores de contenido son filas de `review_queue` marcadas así:

- `source_type = 'project'`
- `source_key  = 'project-content'`
- `raw->>'agent' = 'content-media-agent-v1'`  ← **filtrá por esto** para separarlos de otros reviews
- `raw->>'kind'` ∈ `content_script` | `content_carousel`
- `status = 'pending'`, `sensitive = true`, `reviewer_role_key = 'sergio'`

```
GET /rest/v1/review_queue?select=*&source_key=eq.project-content&raw->>agent=eq.content-media-agent-v1&status=eq.pending&order=created_at.desc
```

El contenido real vive en `raw`:
- `content_script`: `raw->script` = `{ format, pillar, hook, body, cta, on_screen, visual_prompt, voice_tone, duration }`
- `content_carousel`: `raw->carousel` = `{ title, slides[], cta }`

Aprobar/rechazar = update normal de `review_queue.status` (misma cola que el Agente Vendedor).

---

## 3. Estado de los agentes → `onia_center.operating_agents`

Ambos runtimes ponen `status = 'ready'` en su fila y guardan el último run en `raw.last_run`:

```
GET /rest/v1/operating_agents?select=agent_key,status,raw&agent_key=in.(agent_content_media,agent_finance_fund)
```

- `agent_finance_fund.raw.last_run` = `{ at, summary_key, cash_total_bs, fund_total_bs, anomalies, runtime }`
- `agent_content_media.raw.last_run` = `{ at, day, reviews_created, pillar, runtime }`

El panel puede mostrar "última corrida: `raw.last_run.at`" como señal de frescura.

---

## 4. Pulso de desarrollo → `onia_center.dev_pulse` ("estamos construyendo todo el tiempo")

El Agente Building in Public (n8n `XRS9fWY4yFMQQftF`, **DESACTIVADO** por vacaciones 2026-07-10)
escribe la fila más reciente de `dev_pulse` con la actividad real del repo (commits por carril,
de la Action repo-pulse). READ-ONLY, interno (`sergio_private`). El panel lee la última fila
para mostrar que el desarrollo es constante.

```
GET /rest/v1/dev_pulse?select=*&order=generated_at.desc&limit=1
```

Columnas: `total_commits`, `lookback_hours`, `active_lanes` (`[{lane,commits}]`, **nombres
INTERNOS reales — NO exponer en superficies públicas**), `stale_lanes`, `summary_text`.

Los borradores building-in-public salen en `review_queue` como el contenido normal, marcados
`raw->>agent = 'building-public-agent-v1'` (contenido ya SANITIZADO, sin clientes).

## Qué falta conectar en el panel (checklist para onia-center-rebuild)

Verificado 2026-07-09 leyendo `web-factory/apps/site/src/lib/onia-center-store.ts` +
`api/onia-center/runtime/route.ts`, y probando el endpoint de **producción**
(`GET https://center.onia.com.bo/api/onia-center/runtime` responde
`{"mode":"auth_required"}` = desplegado y conectado a Supabase; solo falta login).

1. **Borradores de contenido — YA se ven, pero solo el título.** `getOniaCenterRuntime()`
   lee `review_queue` en vivo (sin filtrar `source_type`, limit 80), así que las piezas de
   contenido salen en **Revisiones** como `status=pendiente` (`dbStatusToReview['pending']`).
   PERO `mapReview` trae solo `review_key, source_type, source_key, title, sensitive, status`
   — **NO trae `raw`**, donde vive el guion/slides. Hoy Sergio ve el título del borrador pero
   no el cuerpo.
   - **Acción panel:** agregar `raw` al select de `review_queue` en `getOniaCenterRuntime` y
     exponerlo en `RuntimeReview` (ej. `body`) para leer el guion completo y los slides sin
     salir del panel. Distinguir contenido de ventas por `raw->>agent`
     (`content-media-agent-v1` vs `sales-agent-v1`) y separar la cola con su propio rótulo
     (hoy dice "lo que propone el Vendedor").

2. **Resumen de finanzas — NO se lee todavía.** Agregar a `getOniaCenterRuntime` (o un
   endpoint aparte) la lectura de la fila más reciente de `finance_summary` (§1) y pintarlo en
   la sección Finanzas.

3. **Estado de los agentes — se pinta estático.** `operating-source.ts` tiene
   `agent_finance_fund` / `agent_content_media` hardcodeados como
   `prepared_pending_connection`. La DB ya los tiene en `ready` con `raw.last_run`. Leer
   `operating_agents` en vivo (al menos `status` + `raw.last_run`) para reflejar la última
   corrida.

4. **Pulso de desarrollo — NO se lee todavía.** Leer la última fila de `dev_pulse` (§4) para
   la sección "estamos construyendo todo el tiempo". Ojo: `active_lanes` tiene nombres internos
   — no mostrarlos en nada público/cliente.

Ninguno de estos lo toca el carril infra (no editamos `src/app/onia-center`); quedan para
la sesión del panel. **La escritura (infra) ya está viva y probada.**

## Fuentes

- Migración: `supabase/migrations/20260709_onia_center_finance_summary.sql` (aplicada en `supabase-db`).
- Runtimes + wrappers: `hermes-content/deploy/vps-ops/{finance-fund-agent,content-media-agent}{,-run}.{mjs,sh}` → `/opt/onia/`.
- Workflows: `hermes-content/deploy/n8n/workflows/onia-agente-{finanzas-fondo,contenido-media}.workflow.js`.
- Automatizaciones vivas: `hermes-content/docs/ONIA_N8N_AUTOMATIONS_LIVE_2026.md`.
