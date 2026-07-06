# Handoff: activar el "Ads agent" cuando Meta esté verificado

> **De:** sesión `meta-ads`. **Estado:** el motor está listo y probado (DRY, cero
> gasto). Falta el trámite de Sergio (runbook). Este doc **especifica** lo que
> hacen otras dos sesiones cuando Meta esté verificado. **No lo ejecuto yo**
> (carriles): onia-center es carril A, infra es carril G.

**Gate único:** verificación del negocio + `META_SYSTEM_USER_TOKEN` cargado
(runbook §1, §4, §6). Hasta entonces, el agente queda como `blocked`.

---

## A) Sesión `onia-center-saneamiento` — sumar el agente al panel

Patrón existente: la sala de agentes vive en `onia_center.operating_agents`
(migración `supabase/migrations/20260623_onia_center_operating_agents.sql`) y se
muestra en `web-factory/apps/site/src/app/onia-center` (ruta `/onia-center#agentes`).
Sumar un agente = **un row de seed**, nada de código nuevo del core.

Crear `supabase/migrations/<fecha>_onia_center_meta_ads_agent_seed.sql` con un
insert en `onia_center.operating_agents` (mismos campos que el seed actual):

| Campo | Valor propuesto |
|-------|-----------------|
| `agent_key` | `agent_meta_ads` |
| `agent_name` | `Agente Meta Ads` |
| `mission` | `Proponer campañas en borrador con los creativos del motor de contenido, medir y recomendar; nunca gastar sin aprobación.` |
| `owner_role_key` | `sergio` |
| `visibility_scope` | `internal_restricted` |
| `cadence` | `weekly` |
| `status` | `blocked` → pasa a `prepared_pending_connection` cuando el token esté cargado, y a `ready` tras el primer dry-run OK |
| `monthly_outcome` | `Set de campañas propuestas (borrador) + reporte de métricas; decisiones de activación quedan para Sergio.` |
| `inputs` | `["creativos content-engine", "landings Web Factory", "Pixel/CAPI", "objetivo comercial"]` |
| `outputs` | `["campañas en borrador (PAUSED)", "reporte de insights", "propuestas de activación"]` |
| `actions` | `["mapear creativo->anuncio", "armar campaña/adset/ad en borrador", "leer insights", "encolar activación para aprobación"]` |
| `blocked_by` | `["Verificacion negocio Meta", "META_SYSTEM_USER_TOKEN", "Ad Account sin metodo de pago hasta aprobar"]` |
| `next_action` | `Cargar token en /root/.hermes/.env y correr node examples/dry-run-demo.js` |
| `safety_rule` | `No activa campañas ni sube presupuesto sin aprobacion explicita de Sergio. DRY por defecto.` |
| `connector_keys` | `["connector-meta-marketing"]` |
| `tool_preference` | `["node", "n8n", "manual"]` |
| `route` | `/onia-center#agentes` |

Notas:
- El seed guarda **solo nombres/reglas**, nunca valores de secreto (igual que el
  seed actual y la constraint `..._no_secret_values` del connector plan).
- La UI ya sabe pintar `status` (`blocked`/`prepared_pending_connection`/`ready`)
  — no hace falta tocar componentes salvo querer un ícono propio.
- La cola de activación del panel debe llamar, del lado server, a
  `approval.newApprovalRequest` / `approve` (de este módulo) para que el estado
  "aprobado por Sergio" sea el mismo que gatea el cliente.

---

## B) Sesión `infra-deploy-n8n` — workflow n8n (carril G, serial)

Patrón existente: workflows en `hermes-content/deploy/n8n/workflows/*.json`
(p.ej. `onia-center-daily-briefing.json`, `onia-radar-normativo.json`).

Agregar `hermes-content/deploy/n8n/workflows/onia-meta-ads-insights.json` con:

1. **Trigger:** Schedule (semanal) o Webhook (para acciones puntuales).
2. **Credencial:** **Header Auth** `Meta Marketing API`
   (`Authorization: Bearer <META_SYSTEM_USER_TOKEN>`). En los HTTP Request usar
   `authentication: predefinedCredentialType` → `httpHeaderAuth`.
   **Nunca `$env` en Code nodes** (plan VPS no lo soporta).
3. **Lectura de métricas (seguro, no gasta):** HTTP GET a
   `https://graph.facebook.com/<version>/act_<id>/insights?fields=impressions,spend,actions&level=campaign`.
   La URL la arma `client.insightsUrl(...)` si quieren generarla desde el módulo.
4. **(Opcional) Relay de Conversions API:** Webhook desde la landing → construir
   el evento con `pixel.buildCapiEvent(...)` (hashea PII) → POST a
   `https://graph.facebook.com/<version>/<pixel_id>/events` con
   `{ data:[evento], access_token: <META_CAPI_TOKEN> }` (token = credencial n8n,
   no hardcode).
5. **Freno de gasto:** el workflow **no** activa campañas. Si se agrega una acción
   de "activar", debe pasar por la cola de aprobación (estado aprobado por Sergio)
   antes del POST que cambia `status` a `ACTIVE` o el `daily_budget`.

Orden de carriles: infra (G) es serial y va **después** de que A/C estén en main
(igual que el resto de M-*). No re-publica workflows de otras sesiones.

---

## Resumen de dependencias

```
Sergio (runbook §1–§6)         →  token + ids en /root/.hermes/.env + credencial n8n
   └─ onia-center (A): seed agent_meta_ads (blocked → ready)
   └─ infra (G): workflow n8n insights/CAPI (Header Auth, sin $env)
   └─ wf-landing: Pixel en layout.tsx (PIXEL_LANDING_HANDOFF.md)
   └─ meta-ads (este módulo): dry-run → propone → Sergio aprueba → activa
```

Nada se activa ni gasta hasta que Sergio apruebe, explícitamente, cada campaña.
