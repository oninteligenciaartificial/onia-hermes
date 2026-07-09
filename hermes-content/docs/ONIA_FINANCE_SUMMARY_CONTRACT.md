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

`anomalies[].kind` ∈ `blocked_payment`, `pending_premium`, `pending_expense_no_evidence`,
`delivery_blocked`. El panel puede resaltar `anomaly_count > 0` en rojo.

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

## Fuentes

- Migración: `supabase/migrations/20260709_onia_center_finance_summary.sql` (aplicada en `supabase-db`).
- Runtimes + wrappers: `hermes-content/deploy/vps-ops/{finance-fund-agent,content-media-agent}{,-run}.{mjs,sh}` → `/opt/onia/`.
- Workflows: `hermes-content/deploy/n8n/workflows/onia-agente-{finanzas-fondo,contenido-media}.workflow.js`.
- Automatizaciones vivas: `hermes-content/docs/ONIA_N8N_AUTOMATIONS_LIVE_2026.md`.
