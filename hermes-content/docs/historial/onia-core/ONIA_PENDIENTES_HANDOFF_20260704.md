# Onia Pendientes — Handoff 2026-07-04 (act. 2026-07-05)

Fecha: 2026-07-04. Proposito: lista maestra para abrir sesiones nuevas y
terminar todo. Cualquier sesion arranca leyendo ESTE doc + memoria.
Regla: trabajos grandes se ejecutan CON SUBAGENTES en paralelo (uno por repo,
push multi-sesion: add solo tus archivos -> commit -> pull --rebase
--autostash origin main -> push origin HEAD:main).

## 0. PROGRESO 2026-07-05 (cerrado desde el handoff)

- **A4 Onia Center spam briefing**: HECHO y DEPLOYADO al VPS (commit 3d87f093).
  Briefing ya no apila prefijos.
- **A5 saneamiento Onia Center dashboard**: sesion corrio; handoff en
  `hermes-content/docs/ONIA_CENTER_SANEAMIENTO_HANDOFF_20260705.md` (n8n
  briefing desactivado 2026-07-05, tasks en Supabase onia_center.tasks).
- **Panel vendedora (NUEVO)**: cotizador `/vendedores/cotizador` (precios +
  comision del kit real de Camila = % del primer pago, export de cotizacion
  cliente con diseno del generador) + pantalla Reglas (guia de decision,
  mensajes de apertura con copiar, checklist CRM). Catalogo
  `hermes-content/propuestas/ONIA_CATALOGO_PRECIOS_2026.md` fuente de verdad.
  Commit 8e0524e3. tsc verde + render 200.
- **Arthur colaborador 60 dias**: arranque, skim de capital, acuerdo HTML
  sellado (dia 0 2026-07-03 / dia 60 2026-09-01), inversion obsoleta,
  recuperacion 100% Sergio. Commiteado.
- **Cuenta Arthur Onia Center**: CREADA y verificada — tukomaluko2310@gmail.com,
  alias arthur, rol arthur (internal_restricted), org onia. Login 200 + token.
  Stray arthur@onia.com.bo borrado. (Password temporal en chat -> B-bis #11.)
- **Plan prospeccion Semana 1**:
  `hermes-content/docs/historial/ONIA_PLAN_PROSPECCION_SEMANA1_2026.md` (35 por segmento).

## A. COMPLETADO POR SUBAGENTES (2026-07-05) — verificado

| # | Frente | Repo | Verificar |
|---|---|---|---|
| A1 | ✅ Logica pura COMPLETA en Gestios main (77172ce+1563731): kardex promedio ponderado, FEFO+alertas, conteos, tax-calendar+cron, RCV ventas (NIT=Customer.rfc) y compras interino, iva-summary, balance cuadrado; 544/544 tests. **BLOQUEADO por baseline sucio**: sin _prisma_migrations, drift bidireccional (falta qr_payments, sobra personal_subscriptions), DIRECT_URL con credenciales invalidas, migraciones se aplican A MANO (docs/DATABASE.md). Faltan modelos Warehouse/StockLot/StockMovement/PurchaseInvoice + APIs de persistencia | Gestios | **C1-bis: sanear baseline GestiOS** (runbook DentaGest DATABASE_MIGRATION_BASELINE_2026.md; conseguir DIRECT_URL valida via vercel env del proyecto gesti-os o dashboard Supabase jafxylfocvvlflpqfsix) y conectar la logica ya testeada |
| A2 | ✅ VIVO y probado e2e: /tarea y /dentalgest desde Telegram (DentaGest 189b312 + hermes c8660a38 + claves en VPS /root/.hermes/.env + fix proxy.ts 307). Pulido pendiente: titulo de /tarea = texto de la tarea | DentaGest+hermes | listo |
| A3 | ✅ ONIA_SIAT_CERTIFICACION_PLAN_2026.md en main (69714a15): computarizada sin certificado por cliente, sandbox pilotosiat, cronograma al 30-sep, bloqueo #1 = NIT (SEPREC+MASI 07-jul) | onia-hermes | listo |
| A4 | ~~Onia Center: fix spam de tareas del briefing~~ HECHO 2026-07-05: mergeado a main (3d87f093) y DEPLOYADO al VPS (backup runtime-next.bak5-20260705162820; rollback = mv de vuelta + docker restart). El briefing ya no apila prefijos ni duplica; tarjetas en 0 ocultas. PENDIENTE MENOR: limpiar las ~61 tareas viejas ya acumuladas (lo cubre A5). |
| A5 | Onia Center: rediseno completo (datos reales, quitar modulos vacios, simplificar UI) | onia-hermes (web-factory) | sesion del chip task_4be0c81c corriendo independiente — verificar sus commits antes de duplicar; diagnostico completo en el prompt del chip |

## B. ACCIONES DE SERGIO (nadie mas puede)

1. **Pegar secret en n8n**: workflow "DentalGest - Email Intake" -> nodo POST
   -> credencial "DentalGest Intake Secret" (Name: x-intake-secret, Value:
   Ctrl+V — pedir "recarga" a Claude si el portapapeles se piso) -> Publish.
   Luego probar: correo a oninteligenciaartificial@gmail.com -> /pending.
2. **Validar precios v2** (catalogo): pymes 390/890/1.990 Bs + Empresarial
   E1 4.900+490 USD. Ventana lanzamiento 31-jul.
3. **NIT Onia**: iniciar formalizacion (bloqueo #1 de SIAT).
4. **TR4**: pedir a Saul columnas exactas del export Excel + frecuencia.
5. **Ganadero OS**: pausa formal o rescate.
6. **Ticket BE fase 1**: al cerrar, calibrar precios Empresarial.

## C. DESARROLLO PENDIENTE — prompts listos para sesiones nuevas

### C1. Columna vertebral en GestiOS (siguiente sprint grande)
```
Proyecto GestiOS (C:\dev\proyectos\Gestios). Instala ONIA Core siguiendo la
receta onia-hermes/onia-core/ONIA_CORE_INSTALL_GUIDE_2026.md (como DentaGest,
commits 612a177..05a4554): Sprint 0 baseline migraciones -> work items +
tenant guard -> collab -> roles/schedule/views -> intake + wizard /setup.
Antes: agregar gestios a ADOPTION_APPROVED y TARGET_ADOPTION_APPROVED en
onia-core/validate.mjs + adapter status (doble llave). Usa subagentes por
sprint si conviene. Gates: typecheck+tests verdes + validate:onia-core verde.
```

### C2. UI restante DentaGest (demo-able)
```
Proyecto DentaGest (C:\dev\proyectos\DentaGest\dental-saas). Completa la UI
del core: (1) hilo de comentarios + documentos en la ficha del paciente
(lib/onia-core/collab.ts ya tiene la logica y visibilidad); (2) admin de
roles finos (lib/onia-core/roles.ts, pagina /setup ya asigna; falta pantalla
de gestion); (3) selector de vistas guardadas en el dashboard (saved-views).
(4) Replicar balance de comprobacion del patron GestiOS (lib/fiscal/) a la
clinica: ventas, cobros, CxC, inventario. Estilo del app (tokens on-surface,
material symbols). typecheck + tests verdes, push master.
```

### C3. Venta self-service DentalGest (Google -> cliente solo)
```
Proyecto onia-hermes + DentaGest. Construir el embudo self-service del doc
onia-core/ONIA_COMPANY_BACKBONE_AND_SELF_SERVICE_2026.md: landing DentalGest
en web-factory con keywords de dolor -> registro -> pago QR/pasarela BCP
(SubscriptionPayment ya existe) -> wizard /setup -> operando. Incluir org
demo con datos del rubro para la demo publica. Precios del catalogo v2.
```

### C4. Propuestas oficiales con precios v2
```
Proyecto onia-hermes. Genera con el sistema oficial
(hermes-content/propuestas/generador/, node generar-propuestas.js <slug>
--pdf) dos propuestas: (1) DentalGest planes 390/890/1990 y (2) ONIA
Empresarial E1/E2 (ancla TR4). Reglas de CLAUDE.md propuestas: niveles por
salto de valor, resultado por paquete, dominio/hosting del cliente, terceros
excluidos. Fuente de precios: onia-core/ONIA_CATALOGO_COMERCIAL_2026.md.
```

### C5. Landed cost v1 con planilla TR4 (cuando Saul mande columnas)
```
Proyecto onia-hermes. Con las columnas reales del export TR4: workflow n8n
que lee la planilla (correo/Drive) -> calcula lista sugerida (tasa efectiva
del dia del workflow FX + margen; despues aranceles NANDINA) -> Excel
repreciado + resumen. Diseno: onia-core/ONIA_IMPORT_LANDED_COST_MODULE_2026.md
y ONIA_EXCHANGE_RATE_AUTOPRICING_2026.md. Importar via MCP n8n.
```

### C6. Radar -> WorkItem automatico
```
Proyecto onia-hermes. Cuando exista org ONIA en DentaGest (o GestiOS) y el
intake este activo: extender workflow n8n OovRU4r0o7pvglJP (radar normativo)
para ademas de Telegram, POSTear cada novedad al intake (channel email_shared,
"Revisar impacto RND-X") -> pendiente con dueno. Editar via MCP n8n
(update_workflow) como se hizo con el FX.
```

### C7. Extraccion @onia/* (solo cuando C1 termine)
```
Monorepo o packages privados: @onia/core-db (tenant guard + modelos core),
@onia/fiscal (tax-calendar, rcv), @onia/ui. Fuente: inventario
hermes-content/docs/ONIA_ECOSYSTEM_INVENTORY_20260704.md (~15-20K lineas
duplicadas). NO antes de que GestiOS pruebe los patrones (regla).
```

### C8. Bolivian Electric (sesion en su repo)
```
C:\dev\clientes\Bolivian Electric: (1) migrar inbox Chatwoot Cloud -> su VPS
srv1793230 (regla: NO mezclar con VPS ONIA); (2) cerrar fase 1 y documentar
ticket real -> ancla ONIA Empresarial; (3) puente TR4 por planillas.
```

### C9. Higiene infra (corta)
```
onia-hermes: consolidar crons Hermes vs n8n (decidir orquestador unico);
verificar billing Sentry/PostHog en free tier (solo UI); automatizar backup
nocturno Postgres staging (drill 24/24 ya probado, falta cron).
```

### C10. Autonomizar workflows restantes + crons faltantes (regla: nada local)
```
Proyecto onia-hermes. Regla Sergio (memoria automatizaciones-autonomas):
workflows n8n autonomos, sin ONIA Center endpoints ni SearXNG localhost.
(1) Migrar `onia-center-daily-briefing` (ONIADailyBrief001) y
`onia-trend-recommendations` al patron autonomo del workflow de guiones
NDXLJiR00ciQx72V (nodo OpenAI nativo cred "OpenAi account" + telegramApi,
prompt inline) — via MCP n8n, validar con execute_workflow. (2) Crear crons
prospeccion 09:00 (skill prospeccion-onia; solo borradores, no contacta) y
propuestas 12:00 (skill genera-propuesta). (3) Tras el fix A4 deployado,
verificar que el briefing ya no apila tareas. Tabla horaria canonica:
hermes-content/docs/historial/ONIA_CONTENT_FACTORY_ORCHESTRATION_2026.md.
```

### C11. n8n restos de limpieza
```
Instancia n8n-sergio (MCP). (1) Reparar conexion rota `sendAdminEmail` en 3
workflows GestiOS activos (WF-GS-04/03/02: 6oowIHo8G9baBOYc, qOVpQwPZplQKYkMc,
xx4wzzzqZBGfu836) y taggearlos `gestios`. (2) Decidir con Sergio: Demo Cliente
New Sakura, Atlas YouTube Draft, Scheduled Ops Pack y Mara Daily (SSH roto:
arreglar credencial SSH key o archivar). Estado completo:
hermes-content/docs/ONIA_N8N_CLEANUP_20260703.md (18 archivados, 2 pausados).
```

## B-bis. ACCIONES DE SERGIO adicionales (taskboard ONIA_SYSTEM_TASKBOARD_2026)

7. **Token IG long-lived + Business Account ID** (desbloquea publicacion IG).
8. **API keys Tavily y fal.ai** (prospeccion con fuentes + imagenes).
9. **Verificacion negocio Meta** (desbloquea WhatsApp -> Chatwoot).
10. **Datos fiscales con contador** (activa recordatorios fiscales).
11. **Cambiar password Onia Center** (la primera se expuso en chat 2026-07-04).

## D. AUTOMATIZACIONES VIVAS (no tocar sin razon)

- n8n `tUaQasfCDGOXEl2j` FX diario 07:30 L-S (BCB widget exacto + spread).
- n8n `OovRU4r0o7pvglJP` Radar Normativo 08:00 L-V (memoria staticData).
- n8n `NDXLJiR00ciQx72V` Guiones Diarios 07:00 L-S (autonomo, testeado OK).
- n8n `ONIADailyBrief001` Briefing diario 06:45 (apila tareas hasta deploy A4).
- Onia Center vivo en center.onia.com.bo (VPS; memoria onia-center-hosting).
- Crons Vercel DentaGest: reminders, recurring, onia-core-workitems 07:00.
- Autosync git en sesiones Claude (hook Stop).

## E. WEB-FACTORY — follow-ups (roadmap 8/8 HECHO, PRs #3-#10 en main)

El roadmap `web-factory/docs/WEB_FACTORY_ROADMAP_20260703.md` esta completo:
4 templates (landing, landing-focus, store, dashboard) con dark mode; 3 gates de
calidad en `pnpm e2e` (a11y WCAG 2.2 AA light+dark, visual, performance CWV);
`design:auto` propone componentes Tremor por seccion. Quedan follow-ups menores:

| # | Item | Donde | Esfuerzo |
|---|---|---|---|
| E1 | Auto-conversion de imagenes con `sharp` (hoy solo guard `pnpm images:check`). Paso en `generate`: png/jpg -> webp/avif + resize. Version completa del roadmap #6. | `web-factory/generate/` (nuevo paso) | M |
| E2 | Optimizar 108 imagenes pesadas de Nuvia (`product-media-cutout/*.png`, hasta 815kb) -> webp/avif. Task spawneada `task_589d5cca`. Meta: `pnpm images:check nuvia` sin errores. | `web-factory/data/clients/nuvia.assets/` | M |
| E3 | Dark mode del template `store` (usa paleta `--nuvia-*` fija, NO adapta — intencional). Si se quiere, tokenizar el shell. | `web-factory/packages/templates/src/store.ts` | M |
| E4 | Medir INP en el perf gate (hoy LCP/FCP/CLS; INP requiere interaccion simulada). Opcional. | `web-factory/tests/e2e/perf.spec.ts` | S |
| E5 | ~~Estabilizar flakiness del E2E bajo carga paralela~~ **HECHO 2026-07-05** (commit `9b9ffd86`): `playwright.config.ts` split en 4 proyectos (funcional paralelo; medicion `chromium-measure`/`mobile-measure` serial, `fullyParallel:false`, workers capados); `perf.spec.ts` y `a11y.spec.ts` en `mode:"serial"`; retries local 1. Root cause: bajo 6 workers, axe/PerformanceObserver escaneaban antes de asentar layout. 3 corridas `pnpm e2e` limpias (32 pass / 4 skip) + 37 unit. Budgets/gates intactos. | `web-factory/tests/e2e/` + `playwright.config.ts` | done |
| E6 | Dashboard interactivo real (Astro islands + Tremor) mas alla del PoC `experiments/astro-islands-poc/`, si un cliente pide datos vivos. | nuevo build | L |

## Orden recomendado de sesiones

1. Verificar A1-A3 (commits de subagentes) y cerrar cabos.
2. B1 (secret, 2 min de Sergio) -> circuito email completo.
3. C4 propuestas + C3 self-service (vender ya con precios v2).
4. C1 GestiOS core -> luego C7 paquetes.
5. C5/C6/C8 segun dependencias externas (Saul, BE).
