> ⚠️ **SUPERADO.** El estado vigente esta en `hermes-content/docs/ONIA_ESTADO_REAL_20260813.md`
> y la apuesta vigente en `docs/platform/ONIA_DECISION_SAAS_CONSULTORIA_20260813.md`.
> Este documento se conserva como historia: NO tomes decisiones con el.

# Onia - Plan de arranque limpio 2026-07-18

Estado: punto de entrada actual tras cerrar todas las sesiones.
Fecha: 2026-07-18.
Uso: reabrir solo las sesiones del foco, con tareas EXACTAS y acotadas para no
descarrilar. Reemplaza como foco a los kickoffs del 2026-07-05.

## Objetivo (el norte - no descarrilar)

Onia vive de CAJA. El objetivo AHORA no es construir features: es **conseguir
clientes que paguen** con los productos que YA existen, montando el motor de ventas:
los 2 colaboradores + el panel que los administra. Filtro para toda tarea: **¿ayuda
a vender o cobrar en las próximas semanas?** Si no, va a la pausa.

## Estado de cada frente (qué está haciendo cada uno)

| Frente | Qué es | Estado ahora | Su trabajo |
|---|---|---|---|
| **Center** (carril A) | El panel operativo; administra colaboradores | FOCO #2 | worktree `onia-center-fase2`, limpio en main |
| **Infra** (carril G) | Supabase / n8n / VPS; backend + crons | FOCO #1 (desbloquea) | abrir sesión nueva |
| **Web-factory** (carril B) | Landings / templates; material de venta | FOCO #3 | rescatar rama `sad-nash` |
| **Lucía** (carril H) | Influencer AI; contenido embudo | PAUSA — no produce ahora | ya rescatado a main; sin sesión |
| **YT** (carriles K/L) | Canales faceless; largo plazo | PAUSA — no produce ahora | 1 rama en main, 1 con 1 commit |
| **Core** (`onia-core`) | Núcleo del producto | CONGELADO — no se toca | en main; solo bajo adopción aprobada |
| Colaboradores | Docs del sistema | HECHO | mergeado a main |

Traducción: **solo 3 frentes trabajan ahora** (Infra, Center, Web-factory). Lucía y
YT están en pausa (su trabajo está guardado, no se produce nada nuevo). Core
congelado. No abras sesión de esos.

## Regla anti-descarrilamiento

Una sesión hace **UNA tarea chica** con "listo" verificable y una lista de "NO
hagas". Cuando termina esa tarea: merge a main + parar. No encadena features.
Primer paso de toda sesión: `git branch --show-current` (confirmar tu worktree).

## Sprint 1 - las únicas 4 tareas ahora

Orden: I-1 → I-2 (infra es serial). A-1 arranca cuando I-1 dé datos. B-1 en paralelo.

### I-1 · Infra · schema vivo

```text
Carril INFRA (Supabase/n8n/VPS). git branch --show-current primero.
TAREA ÚNICA: dejar el schema onia_sales vivo en Supabase con RLS. Nada más.
Pasos:
1. Listar tablas de Supabase. ¿Existen las tablas onia_sales (vendor_profiles,
   vendor_leads, weekly_scorecards, operation_payouts, ...)?
2. Si NO existen: aplicar la migración supabase/migrations/20260620_onia_vendor_sales_panel.sql.
3. Confirmar RLS activo por owner_user_key; probar con anon key que NO filtra.
LISTO cuando: las tablas existen en Supabase y RLS bloquea el anon key (probado).
NO HAGAS: perfiles, crons, ni tocar el panel. Eso es I-2 y carril A.
```

### I-2 · Infra · 2 perfiles + crons

```text
Carril INFRA. Solo después de I-1.
TAREA ÚNICA: alta de 2 vendor_profiles + 3 crons n8n. Nada más.
Pasos:
1. Insertar 2 filas en vendor_profiles con territory y phase='A' (nombres/territorios:
   usar placeholders si Sergio no los dio, y dejarlo marcado en un comentario).
2. Crear 3 crons n8n: recordatorio cierre semanal (viernes), seguimientos vencidos
   (diario), cálculo de adelantos (quincenal). Sin $env; secretos por credencial n8n.
3. Probar cada cron UNA vez en vivo.
LISTO cuando: 2 perfiles en la tabla + 3 crons ejecutaron OK una vez.
NO HAGAS: UI del panel, lógica de comisiones. Eso es carril A.
```

### A-1 · Center · vista "Mi día" solo lectura

```text
Carril A - ONIA Center. Worktree onia-center-fase2. git branch --show-current
(debe decir onia-center-fase2) + git rebase origin/main.
Dueño: SOLO web-factory/apps/site/src/app/onia-center/** + api/onia-center/**.
TAREA ÚNICA: la vista "Mi día" en modo SOLO LECTURA. Nada más.
Pasos:
1. Leer spec ONIA_COLABORADORES_PANEL_SPEC_2026.md sección B +
   ONIA_COLABORADORES_TAREAS_DIARIAS_2026.md.
2. Crear la vista "Mi día" que, para el colaborador logueado, muestre 3 listas
   leídas de onia_sales vía /api/onia-center/runtime: (a) su cuota diaria fija,
   (b) seguimientos con next_followup <= hoy, (c) leads nuevos de su territorio.
3. Reusar el patrón de equipo/page.tsx (auth por rol + fetch runtime). NO reescribir
   equipo/page.tsx.
LISTO cuando: el colaborador entra, ve las 3 listas, y pnpm tsc --noEmit + pnpm build
pasan verdes. Merge a main y PARÁS.
NO HAGAS: scorecard, comisiones, bonos, edición, ni tocar archivos fuera de
onia-center/. Cada una es otra tarea (Sprint 2).
```

### B-1 · Web-factory · rescate de landings

```text
Carril B - Web Factory. Worktree FRESCO desde origin/main (no reuses sad-nash).
TAREA ÚNICA: rescatar a main el trabajo terminado de claude/sad-nash-373003
(hero variants + templates, ~9.700 líneas). Nada nuevo.
Pasos:
1. git merge claude/sad-nash-373003
2. Resolver 2 conflictos: web-factory/packages/blocks/src/process.ts y process.test.ts.
3. pnpm i && pnpm tsc --noEmit && pnpm test && pnpm e2e.
LISTO cuando: en main compilando y tests verdes.
NO HAGAS: features nuevas ni rediseños. Solo rescatar lo que ya estaba hecho.
```

## Sprint 2 (después, no ahora - una tarea por sesión igual)

A-2 scorecard semanal · A-3 comisiones (tabla fase A/B) · A-4 bonos con gate caja
verde · A-5 territorio/anti-colisión · A-6 vista Sergio admin. No abrir hasta que
Sprint 1 esté en main.

## Qué hacen los trabajadores

Detalle: `ONIA_COLABORADORES_TAREAS_DIARIAS_2026.md`. Colaborador 1 = salud
(DentalGest, landings). Colaborador 2 = comercio (GestiOS, webs). Día: abrir "Mi
día" → prospectar su rubro → contactar → seguir → demos → cerrar con CRM al 100%.

## Sergio en paralelo

Firmar los 2 acuerdos · definir territorios (rubro) y nombres · reclutar y dar de
alta a las 2 personas.
