---
name: onia-crm-ventas
description: Invocar para el CRM y pipeline de ventas de ONIA — prospección con señal, calificación de leads, seguimiento, panel de vendedores/colaboradores y comisiones, sobre el esquema Postgres onia_sales. Prospectar pocos buenos con señal (no listas largas); nunca contactar sin aprobación del mensaje y canal exactos.
---

# ONIA — CRM y ventas

Gap sin skill pública buena (lo público apunta a HubSpot/Salesforce que ONIA no usa) → skill propia.
Delegar prospección/seguimiento: subagente `onia-crm-prospeccion`.

## Esquema y fuente de verdad
- Esquema Postgres: `supabase/migrations/20260620_onia_vendor_sales_panel.sql`
  (schema `onia_sales`: `vendor_profiles`, etc.).
- **Notion sigue siendo la fuente de verdad ACTUAL** hasta que el panel se conecte al schema.
- Panel en ONIA Center → `/equipo`.

## Leer primero
- `hermes-content/docs/ONIA_PANEL_VENDEDORES_2026.md`
- `hermes-content/docs/ONIA_COLABORADORES_COMERCIALES_SIN_INVERSION_2026.md`
- `hermes-content/docs/ONIA_COLABORADORES_PANEL_SPEC_2026.md`
- `hermes-content/docs/ONIA_LEADS_PRIORITY_2026.md`
- skills-doc Hermes: `crm-prospeccion-onia.md`, `prospeccion-onia.md`, `seguimiento-prospectos-onia.md`

## Reglas de prospección (dura)
- **Pocos prospectos buenos con señal de oportunidad**, NO listas largas. Fuentes públicas verificables. No fabricar datos.
- **Nunca contactar sin aprobación** del mensaje y canal exactos (acción externa → OK de Sergio).
- Calificar antes de escalar; registrar toda oportunidad (incluye las propuestas enviadas vía `onia-propuestas`).

## Colaboradores comerciales (sin inversión)
- Comisiones: **SaaS 35% · web 12-18% · servicios 10%**; bonos (250/120/150) **solo con caja verde**.
- Prueba 60 días, 2 fases: A (30 días, cero riesgo) → B (base recuperable Bs.400 + 18% de producción) si pasan el filtro del día 30.
- Reparto de carriles: **schema + crons = infra** · **panel UI = carril A (onia-center)** · **docs = comercial**.
  NO tocar el código del panel desde otro carril.

## Complementos públicos (recién instalados)
`prospecting` (build de lista con señal) · `cold-email` (outbound) · `sales-enablement` (decks/one-pagers) ·
`pricing`/`offers` (estructura de oferta) · `cro` (páginas que convierten). Usarlos para ejecución, con las reglas ONIA arriba.
