# Onia — Tablero de Tareas del Sistema 2026

Fecha: 2026-07-03. Owner: Sergio Urcullo (Onia). Modo: 3 tracks en paralelo.

Tablero para personas reales + agentes. Cada tarea tiene: responsable sugerido,
agente que la ejecuta/asiste, prioridad (P0 bloqueante / P1 alta / P2 media),
gate de aprobacion y criterio de done. Estados: `TODO`, `WIP`, `BLOQUEADO`, `DONE`.

Leyenda responsables: **S**=Sergio, **DEV**=desarrollo, **OPS**=infra/VPS,
**CONT**=contenido, **VENTAS**=comercial, **AG**=agente Claude.

---

## TRACK A — ONIA Core / DentalGest

Roadmap oficial: siguiente etapa = `dentagest_adoption`. Sprint 0 desbloqueado
(no toca core). Sprints 1-4 requieren aprobacion de Sergio para tocar el repo
producto (`C:\dev\proyectos\DentaGest\dental-saas`).

| # | Tarea | Resp | Agente | Prio | Gate | Done |
|---|---|---|---|---|---|---|
| A0 | Aprobar el plan de adopcion y el orden de sprints | S | — | P0 | — | Checkbox firmado en `ONIA_CORE_DENTALGEST_ADOPTION_PLAN_2026.md` |
| A1 | Sprint 0: confirmar cero drift de contenido (`prisma migrate diff`) | DEV | dentalgest-migrations | P0 | acceso DB | Diff vacio o solo `prospect_leads`/objetos Supabase, documentado |
| A2 | Sprint 0: elegir fuente canonica (Prisma app / supabase objetos) y documentar frontera | DEV | dentalgest-migrations | P0 | — | Doc de frontera en repo DentalGest |
| A3 | Sprint 0: baseline Prisma (squash + `migrate resolve --applied`) | DEV | dentalgest-migrations | P0 | aprobacion A0 | `prisma migrate status` limpio en prod |
| A4 | Sprint 0: CI con `prisma migrate deploy` como unico camino | DEV+OPS | dentalgest-migrations | P1 | — | Pipeline verde, deploy bloqueado fuera de migrate |
| A5 | Sprint 0: decidir namespace `dentalgest` (aplicar 20260629 o retirar) | DEV | dentalgest-migrations | P1 | A3 | Migracion aplicada o removida; sin codigo muerto |
| A6 | Sprint 0: tests de tenant scoping (todo query con `organizationId`) | DEV | dentalgest-migrations + database-reviewer | P0 | — | Suite de tenant verde |
| A7 | Sprint 1: WorkItem dental + panel `pending` real | DEV | onia-core-guardian + dentalgest-migrations | P1 | Sprint 0 DONE + aprobacion | Tabla + generadores automaticos + cockpit consume WorkItems; tests verdes |
| A8 | Sprint 2: Comment + Document + ApprovalRequest | DEV | onia-core-guardian | P2 | Sprint 1 | 3 migraciones + hilos + cola aprobaciones en `attention` |
| A9 | Sprint 3: RoleAssignment + ScheduleEvent + SavedView | DEV | onia-core-guardian | P2 | Sprint 2 | Roles finos + recalls + vistas configurables |
| A10 | Sprint 4: Intake normalize + onboarding pagado | DEV | onia-core-guardian + onia-integrations | P2 | Sprint 3 | Handler `intake.normalize`, dedupe 24h, paquete implementacion |
| A11 | Al aprobar: cambiar `distributionTargets.dentagest.status` y validador (doble llave) | AG | onia-core-guardian | P1 | A0 | `validate:onia-core` verde con nuevo estado |

**Gate del track:** cada sprint cierra con `npm run typecheck && npm test` verdes
en DentaGest y `npm run validate:onia-core` verde en Hermes.

---

## TRACK B — Bot Hermes (asistente Telegram / VPS)

Bot ACTIVO. El trabajo es cerrar integraciones y automatizaciones, no codigo nuevo.

| # | Tarea | Resp | Agente | Prio | Gate | Done |
|---|---|---|---|---|---|---|
| B1 | Generar token long-lived Instagram Graph API + Business Account ID | S | onia-integrations | P1 | cuenta Meta | Token cargado como variable segura; `Estado IG` responde ok |
| B2 | Configurar API key Tavily (free tier) | S | onia-integrations | P1 | alta Tavily | Key cargada; prospeccion usa Tavily |
| B3 | Configurar API key fal.ai | S | onia-integrations | P2 | alta fal.ai | Key cargada; generacion de imagenes ok |
| B4 | Crear workflow n8n `ONIA - Plan semanal` | DEV | hermes-automation | P1 | — | Workflow con dry-run verde + aprobacion humana antes de publicar |
| B5 | Prueba controlada de publicacion IG aprobada (pieza+caption+assets) | S | onia-creative-radar + onia-integrations | P1 | B1 + OK Sergio | 1 publicacion aprobada exitosa via `ig-publish` |
| B6 | Verificacion de negocio Meta para WhatsApp Business API | S | onia-integrations | P1 | verificacion Meta | Negocio verificado; desbloquea WhatsApp |
| B7 | Conectar WhatsApp -> Chatwoot (via external_gate -> intake) | DEV | onia-integrations + hermes-automation | P2 | B6 | Mensajes WhatsApp entran como intake normalizado |
| B8 | Gestion de facturas (registrar enviadas/recibidas + seguimiento pagos) | DEV | hermes-automation | P2 | — | Comando funcional + registro persistente |
| B9 | Completar datos fiscales (NIT, regimen, responsable, calendario) y activar recordatorios | S | onia-integrations | P1 | validacion contador | Fechas validadas; alertas activas |
| B10 | Desplegar hermes-content al VPS y smoke test desde Telegram | OPS | hermes-automation | P1 | — | `npm run deploy:hermes-content` + comandos clave responden |
| B11 | Skill `brief-diario-onia` (comando `Brief Hoy`: agenda + tareas + tendencias) | AG | onia-creative-radar | P1 | — | DONE — skill creada + comando en centro-comando-telegram |
| B12 | Workflow n8n `ONIA - Recomendaciones de tendencia` (seccion 3, plan VPS) | AG | hermes-automation | P1 | — | DONE — JSON valido; falta importar en n8n + credencial telegramApi |
| B13 | Importar `onia-trend-recommendations.json` en n8n y setear credencial telegramApi | OPS | hermes-automation | P1 | acceso n8n | Workflow activo; brief 06:50 llega a Telegram |
| B14 | Anexar seccion 3 (tendencias) al briefing 06:45 existente o encadenar ambos | DEV | hermes-automation | P2 | B13 | Un solo brief diario con agenda+tareas+tendencias |

**Gate del track:** publicacion automatica OFF por defecto; nada client-facing
sin aprobacion exacta de pieza/caption/canal.

---

## TRACK C — Web Factory

Track mas autonomo. Generacion de webs de cliente.

| # | Tarea | Resp | Agente | Prio | Gate | Done |
|---|---|---|---|---|---|---|
| C1 | Template estatico de dashboard (siguiente build segun estado del pipeline) | DEV | web-factory-builder | P1 | — | Template reusable + documentado como patron |
| C2 | Consolidar patrones reusables de Nuvia en el design system | DEV | web-factory-builder | P2 | — | Tokens + componentes documentados |
| C3 | Pasada de accesibilidad + E2E/visual en superficies flagship | DEV | e2e-runner + web-factory-builder | P1 | — | Contraste/focus/alt ok; E2E verde en 320/768/1024/1440 |
| C4 | Verificar anti-referencias (sin demo-catalog, grids repetidas, estilo template) | DEV | web-factory-builder | P2 | — | Checklist de calidad pasado |

**Gate del track:** benchmark visual interno (Bench/Garabato/HSB) como piso;
`prefers-reduced-motion` en toda animacion.

---

## TRANSVERSAL — Ventas y Contenido (motor de ingresos)

| # | Tarea | Resp | Agente | Prio | Done |
|---|---|---|---|---|---|
| X1 | Prospeccion tanda 1 (lista corta calificada) | VENTAS | onia-crm-prospeccion | P1 | Lista con senal de oportunidad + mensaje borrador para aprobar |
| X2 | Propuestas para prospectos calificados (sistema oficial, nunca HTML a mano) | VENTAS | onia-propuestas | P1 | PDF generado con niveles diferenciados + ROI |
| X3 | Plan semanal de contenido + carruseles (borradores) | CONT | onia-creative-radar | P2 | Borradores listos para aprobacion |

---

## Camino critico (que desbloquea que)

1. **A0 (aprobacion Sergio)** desbloquea todo el Sprint 0-4 de DentalGest.
2. **B1/B2 (credenciales)** desbloquean publicacion IG y prospeccion con Tavily.
3. **B6 (verificacion Meta)** desbloquea WhatsApp -> Chatwoot.
4. **B9 (datos fiscales)** desbloquea recordatorios fiscales activos.

Todo lo que NO depende de A0/credenciales/Meta puede avanzar ya: A1-A2 (diagnostico
DB read-only), B4 (workflow n8n en borrador), B8 (facturas), C1-C4 (Web Factory),
X1-X3 (ventas/contenido en borrador).

## Lo que necesito de vos (Sergio) para no bloquear
- [ ] Aprobar A0 (plan de adopcion DentalGest) para tocar el repo producto.
- [ ] Token IG long-lived + Business Account ID (B1).
- [ ] API keys Tavily (B2) y fal.ai (B3).
- [ ] Avanzar verificacion de negocio Meta (B6).
- [ ] Datos fiscales validados con contador (B9).
