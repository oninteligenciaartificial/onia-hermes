# ONIA Pendientes — Handoff 2026-07-04

Fecha: 2026-07-04. Proposito: lista maestra para abrir sesiones nuevas y
terminar todo. Cualquier sesion arranca leyendo ESTE doc + memoria.
Regla: trabajos grandes se ejecutan CON SUBAGENTES en paralelo (uno por repo,
push multi-sesion: add solo tus archivos -> commit -> pull --rebase
--autostash origin main -> push origin HEAD:main).

## A. EN CURSO — subagentes corriendo (verificar sus commits primero)

| # | Frente | Repo | Verificar |
|---|---|---|---|
| A1 | Inventario detallado (kardex promedio ponderado, lotes/FEFO, conteos) + Contador Pack completo (RCV ventas+compras, resumen IVA, balance comprobacion) | Gestios | `git log --oneline -5` en C:\dev\proyectos\Gestios; tests verdes; si el agente reporto drift de migraciones, resolver baseline como en DentaGest (docs/DATABASE_MIGRATION_BASELINE_2026.md) |
| A2 | Hermes bridge: /tarea y /dentalgest via Telegram | DentaGest + onia-hermes | endpoint /api/onia-core/bridge/pending en DentaGest; comandos en gateway; doc HERMES_PRODUCT_BRIDGE_2026.md; setear claves en VPS que indique el runbook |
| A3 | Plan certificacion SIAT proveedor | onia-hermes | onia-core/ONIA_SIAT_CERTIFICACION_PLAN_2026.md en main |
| A4 | ~~ONIA Center: fix spam de tareas del briefing~~ HECHO 2026-07-05: mergeado a main (3d87f093) y DEPLOYADO al VPS (backup runtime-next.bak5-20260705162820; rollback = mv de vuelta + docker restart). El briefing ya no apila prefijos ni duplica; tarjetas en 0 ocultas. PENDIENTE MENOR: limpiar las ~61 tareas viejas ya acumuladas (lo cubre A5). |
| A5 | ONIA Center: rediseno completo (datos reales, quitar modulos vacios, simplificar UI) | onia-hermes (web-factory) | sesion del chip task_4be0c81c corriendo independiente — verificar sus commits antes de duplicar; diagnostico completo en el prompt del chip |

## B. ACCIONES DE SERGIO (nadie mas puede)

1. **Pegar secret en n8n**: workflow "DentalGest - Email Intake" -> nodo POST
   -> credencial "DentalGest Intake Secret" (Name: x-intake-secret, Value:
   Ctrl+V — pedir "recarga" a Claude si el portapapeles se piso) -> Publish.
   Luego probar: correo a oninteligenciaartificial@gmail.com -> /pending.
2. **Validar precios v2** (catalogo): pymes 390/890/1.990 Bs + Empresarial
   E1 4.900+490 USD. Ventana lanzamiento 31-jul.
3. **NIT ONIA**: iniciar formalizacion (bloqueo #1 de SIAT).
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
hermes-content/docs/ONIA_CONTENT_FACTORY_ORCHESTRATION_2026.md.
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
11. **Cambiar password ONIA Center** (la primera se expuso en chat 2026-07-04).

## D. AUTOMATIZACIONES VIVAS (no tocar sin razon)

- n8n `tUaQasfCDGOXEl2j` FX diario 07:30 L-S (BCB widget exacto + spread).
- n8n `OovRU4r0o7pvglJP` Radar Normativo 08:00 L-V (memoria staticData).
- n8n `NDXLJiR00ciQx72V` Guiones Diarios 07:00 L-S (autonomo, testeado OK).
- n8n `ONIADailyBrief001` Briefing diario 06:45 (apila tareas hasta deploy A4).
- ONIA Center vivo en center.onia.com.bo (VPS; memoria onia-center-hosting).
- Crons Vercel DentaGest: reminders, recurring, onia-core-workitems 07:00.
- Autosync git en sesiones Claude (hook Stop).

## Orden recomendado de sesiones

1. Verificar A1-A3 (commits de subagentes) y cerrar cabos.
2. B1 (secret, 2 min de Sergio) -> circuito email completo.
3. C4 propuestas + C3 self-service (vender ya con precios v2).
4. C1 GestiOS core -> luego C7 paquetes.
5. C5/C6/C8 segun dependencias externas (Saul, BE).
