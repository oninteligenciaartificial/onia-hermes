# ONIA - Plan de arranque limpio 2026-07-18

Estado: punto de entrada actual tras cerrar todas las sesiones.
Fecha: 2026-07-18.
Uso: reabrir solo las sesiones que mueven el objetivo, sin cruce, con seguimiento.
Reemplaza como foco a los kickoffs del 2026-07-05 (que quedan como histórico).

## Objetivo (el norte - no descarrilar)

ONIA vive de CAJA. El objetivo AHORA no es construir más features: es **conseguir
clientes que paguen** con los productos que YA existen (DentalGest live, Web
Factory, GestiOS en camino), montando el motor de ventas: los 2 colaboradores + el
panel que los administra.

Filtro para toda tarea nueva: **¿esto ayuda a vender o cobrar en las próximas
semanas?** Si no, va a la pausa. Quien abra una sesión revisa este filtro primero.

## Foco de este ciclo (2-3 semanas)

Meta única: **dejar a los 2 colaboradores vendiendo, con un panel que los
administre.** Tres frentes y nada más:

1. Datos (infra): schema `onia_sales` aplicado + 2 perfiles + crons.
2. Panel (carril A): vista "Mi día" + scorecard + comisiones.
3. Material de venta (carril B): rescatar las landings terminadas de `sad-nash`.

En PAUSA a propósito (no abrir sesión): canales YT nuevos, más influencers,
`onia-core` (congelado), separaciones de repo, features no ligadas a vender.

## Reglas de cada sesión (no-choque + cierre)

- 1 carril = 1 worktree desde `main` = 1 rama = 1 carpeta. Nadie toca la carpeta
  de otro.
- Primer paso SIEMPRE: `git branch --show-current` y confirmar que estás en tu
  worktree (ruta con `.claude/worktrees/<rama>`), NO en `main` ni en otro carril.
- `main` siempre compila: si tu avance toca `web-factory/apps/site/**`, entra a
  `main` solo con `tsc --noEmit` verde, como árbol completo (nunca WIP parcial).
- Terminar = `git rebase origin/main` → gates → merge a `main` → cerrar sesión +
  `git worktree remove`. Un carril no está hecho hasta estar en `main` y cerrado.

## Sesiones a abrir (solo estas tres)

### Sesión 1 - INFRA (arranca primero, desbloquea al resto)

```text
Sos el carril INFRA de ONIA (Supabase / n8n / VPS, SERIAL, un solo dueño).
Primer paso: git branch --show-current; confirmá que estás en un worktree de infra.
Objetivo: dejar operativo el backend del panel de colaboradores.
Fuente (manda): hermes-content/docs/ONIA_COLABORADORES_PANEL_SPEC_2026.md
(secciones A, Crons, Privacidad) + ONIA_COLABORADORES_COMERCIALES_SIN_INVERSION_2026.md.
Tareas:
1. Confirmar que el schema onia_sales (migración 20260620_onia_vendor_sales_panel.sql)
   está APLICADO en Supabase, no solo local. Si falta, aplicarlo.
2. Verificar RLS activo por owner_user_key en todas las tablas onia_sales.
3. Alta de 2 vendor_profiles con territory y phase='A' (nombres/territorios los
   define Sergio; usar placeholders si aún no están y dejarlo marcado).
4. Crons n8n: recordatorio de cierre semanal (viernes), seguimientos vencidos
   (diario), cálculo de adelantos quincenales.
Gates: probar cada cron en vivo; verificar con anon key que RLS no filtra.
Done: schema aplicado + 2 perfiles + crons activos y probados. NO tocar código del
panel (carril A) ni docs de otros carriles.
```

### Sesión 2 - CARRIL A - Panel de colaboradores

```text
Sos el carril A - ONIA Center. Worktree: onia-center-fase2 (rama
claude/onia-center-fase2, hoy limpia en main).
Primer paso: git branch --show-current (debe decir onia-center-fase2) + git rebase origin/main.
Dueño de archivos: web-factory/apps/site/src/app/onia-center/** + api/onia-center/**.
NADA fuera de ahí. Avisá antes de tocar los 4 raíz de web-factory.
Objetivo: construir la administración de los 2 colaboradores en el panel.
Fuente (la spec manda): hermes-content/docs/ONIA_COLABORADORES_PANEL_SPEC_2026.md +
ONIA_COLABORADORES_TAREAS_DIARIAS_2026.md + ONIA_COLABORADORES_COMERCIALES_SIN_INVERSION_2026.md.
Construir, reusando equipo/page.tsx + /api/onia-center/runtime + schema onia_sales:
- (B) vista "Mi día": cuota diaria + seguimientos que vencen + leads nuevos del
  territorio + tareas asignadas; progreso semanal + semáforo personal.
- (C) scorecard semanal (>=80% + 3 innegociables).
- (D) comisiones/base/pagos con la tabla de fases A/B.
- (E) bonos con gate de caja verde.
- (F) territorio / anti-colisión.
- (H) vista Sergio admin (comparar los 2, aprobar comisiones/bonos).
Gates: pnpm tsc --noEmit + pnpm build + e2e onia-center verdes.
Done: en main, compila, sesión cerrada.
```

### Sesión 3 - CARRIL B - Rescate de landings (material de venta)

```text
Sos el carril B - Web Factory. Abrí un worktree FRESCO desde origin/main
(NO reuses el de sad-nash, que está 170 commits atrás).
Primer paso: git branch --show-current + confirmá worktree propio.
Dueño: web-factory (landings, packages/blocks, templates, data/clients). Avisá
antes de tocar los 4 raíz (next.config, layout, globals, package.json).
Objetivo: rescatar a main el trabajo terminado de la rama claude/sad-nash-373003
(hero variants + templates + unify Apple recipe, ~9.700 líneas), con gates.
Pasos:
  git merge claude/sad-nash-373003
  # resolver 2 conflictos: web-factory/packages/blocks/src/process.ts y process.test.ts
  pnpm i && pnpm tsc --noEmit && pnpm test && pnpm e2e
Done: en main compilando, mejores landings para vender, worktrees viejos cerrados.
```

## Qué hacen los trabajadores (los 2 colaboradores)

Detalle: `hermes-content/docs/ONIA_COLABORADORES_TAREAS_DIARIAS_2026.md`.

- Colaborador 1 - salud y servicios (dentales, consultorios) -> vende DentalGest,
  landings, auditorías.
- Colaborador 2 - comercio y pymes (tiendas, distribuidoras) -> vende GestiOS,
  webs, automatizaciones.
- Día tipo: abrir "Mi día" -> prospectar su rubro -> contactar -> seguir -> demos
  -> cerrar el día con CRM al 100%. Piso obligatorio + scorecard semanal.
- Pago: Fase A (30 días, cero base) -> Fase B si pasan el filtro del día 30.

## Sergio en paralelo (destraba lo comercial)

- Firmar los 2 acuerdos (`ONIA_ACUERDO_COLABORADOR_COMERCIAL_PLANTILLA_2026.md`).
- Definir territorios (rubro) y nombres reales de los 2.
- Reclutar / dar de alta a las 2 personas.

## Orden y dependencias

```text
Infra (schema + perfiles)  ──►  Carril A (panel consume el schema)
Carril B (landings)        ──►  independiente, en paralelo
Sergio (firmar + reclutar) ──►  en paralelo; necesario para que arranquen a vender
```
