# ONIA Core

Estado: beta canonico (v0.6.0), no instalado en productos.
Owner: ONIA / Hermes.

> Beta contract cerrado: se agregaron las 8 piezas transversales
> (BusinessPartner, RoleAssignment, Comment, Document, ApprovalRequest,
> ScheduleEvent, SavedView y WorkItem con SLA opcional). La instalacion en repos
> producto sigue bloqueada hasta aprobar el plan de adopcion de DentalGest.

ONIA Core es el nucleo de organizacion operativa que despues se instalara en
los sistemas de ONIA: GestiOS, DentalGest y Ganadero OS.

## Regla principal

ONIA Core vive primero aqui, en `onia-hermes/onia-core`.

No se instala todavia en otros proyectos. Primero se completa el contrato, se
valida, se definen migraciones base y recien despues se sube a cada sistema.

## Que resuelve

ONIA Core responde:

1. Quien trabaja en la empresa.
2. Que rol y permisos tiene cada persona.
3. Que clientes, proveedores, contactos o areas existen.
4. Que tareas, solicitudes, casos o pendientes estan abiertos.
5. Quien es responsable.
6. En que estado esta cada pendiente.
7. Cual es la fecha limite o siguiente accion.
8. Que evidencia, nota, archivo o historial existe.
9. Que alerta requiere atencion.
10. Que reporte necesita gerencia.

Inventario, ventas, caja, cotizaciones, WhatsApp, SIAT, TR4 o chatbots son
modulos, verticales o integraciones. No son la definicion del core.

## Archivos

- `contract.json`: contrato canonico versionado. Incluye `verticalPacks`: el
  kit por rubro (vocabulario, checklists, KPIs e intake) que hace vendible cada
  vertical sin tocar el core. Onboardear un rubro = agregar track + pack (datos).
- `index.mjs`: helpers para leer y consultar el contrato.
- `index.test.mjs`: tests de los helpers + integracion del validador (node:test).
- `logic/`: logica pura canonica del CORE que los productos importan en vez de
  reimplementar. 8 modulos: work-items (transiciones/SLA/dedupe/cola), intake,
  roles, approvals, scheduling, saved-view, fx (tipo de cambio Bolivia) y
  numbering (correlativos). `logic/index.mjs` = barrel namespaced.
- `package.json`: expone `@onia/core` (version = la del contrato). Los productos
  importan `@onia/core/logic` (workItems, roles, fx, numbering...),
  `@onia/core/modules` y `@onia/core/contract` en vez de copiar codigo.
- `validate.mjs`: validador local de estructura e invariantes.
- `report.mjs`: reporte de avance en lenguaje simple (verticales con su pack y
  cuanto del core lleva instalado cada producto). Correr: `node onia-core/report.mjs`.
- `report.test.mjs`: tests del reporte.
- `install-plan.mjs`: genera el plan de instalacion de un vertical (core +
  modulos + logica de @onia/core a portar, ordenado). Herramienta nuestra,
  read-only: `node onia-core/install-plan.mjs <track|producto>`.
- `modules/`: modulos vendibles (add-ons activables SOBRE el core, FUERA del
  contrato congelado — el core no es inventario/ventas/contabilidad/facturacion).
  `commerce.json` (catalogo/inventario/cotizaciones B2B/ventas-caja),
  `knowledge.json` (base de conocimiento), `accounting.json` (contabilidad
  Bolivia: doble partida + IVA/IT/IUE) e `invoicing.json` (factura electronica
  Bolivia: CUF/QR/anulacion/notas de credito-debito) — estos dos ultimos PROVEEN
  su propia capability (`providesCapabilities`) en vez de llenar un slot del
  core. Cada modulo con su `*.schema.sql` y logica pura en `*.logic.mjs`;
  `bridge.logic.mjs` conecta commerce/invoicing -> accounting.
  `validate-modules.mjs` = validador propio.
- `ONIA_CORE_RESEARCH_RESULT_2026.md`: resultado de investigacion local y externa.
- `ONIA_CORE_BENCHMARK_GAP_AUDIT_2026.md`: auditoria contra sistemas ERP, CRM,
  work management y operacion real de empresas.
- `ONIA_CORE_DENTALGEST_BETA_DIRECTION_2026.md`: decision de beta inicial para
  DentalGest, dueno como usuario principal y facturacion interna desde inicio.
- `ONIA_CORE_DISTRIBUTION_PLAN_2026.md`: plan para subir ONIA Core a los
  sistemas cuando este listo.
- `ONIA_CORE_CLIENT_ADOPTION_MAP_2026.md`: clientes candidatos y arquetipos
  mapeados a tracks verticales, con orden de adopcion.
- `ONIA_CORE_EXTERNAL_RESEARCH_20260703.md`: proyectos open source, modelos y
  skills verificadas (GitHub, Hugging Face) como referencias de diseno.
- `ONIA_VERTICAL_FACTORY_STRATEGY_2026.md`: estrategia de fabrica de
  verticales por rubro y go-to-market (un core, muchos verticales
  especializados; ProveeGest = distribucion B2B multi-rubro).
- `ONIA_CORE_OWNER_PANEL_AND_INTAKE_2026.md`: diseno canonico del read-model
  owner_dashboard y la politica de intake externo -> WorkItem.
- `CHANGELOG.md`: historial de versiones del contrato (0.1.0 alpha ->
  0.6.0 vertical packs).
- `ONIA_CORE_INSTALL_GUIDE_2026.md`: receta repetible de instalacion en
  productos, destilada de la adopcion real en DentalGest.
- `ONIA_STACK_ASSESSMENT_2026.md`: evaluacion del stack (Postgres/Prisma/Next
  confirmados; riesgos reales: tenant isolation, sync offline, motor
  compartido).
- `ONIA_CORE_DENTALGEST_ADOPTION_PLAN_2026.md`: plan de sprints para instalar
  el core en DentalGest (Sprint 0 = baseline de migraciones; cockpit v1 ya
  existe en el producto como prototipo del owner_dashboard).
- `schema/base-schema.sql`: SQL base de referencia, no aplicado directamente.
- `adapters/gestios.json`: mapa de adopcion para GestiOS.
- `adapters/dentagest.json`: mapa de adopcion para DentalGest.
- `adapters/ganadero-os.json`: mapa de adopcion para Ganadero OS.

## Validacion, tests y reporte

```bash
npm run validate:onia-core                    # invariantes del contrato core
node onia-core/modules/validate-modules.mjs   # validador de modulos vendibles
node --test onia-core/*.test.mjs onia-core/logic/*.test.mjs onia-core/modules/*.test.mjs   # 189 tests
node onia-core/report.mjs                     # foto de avance por vertical/producto/modulo
node onia-core/install-plan.mjs <track|producto>   # plan de instalacion de un vertical
```

## Politica de distribucion

Hasta que el contrato pase a `beta`, los repos producto no deben incorporar
nuevas migraciones, rutas ni UI dependientes de ONIA Core.

La distribucion sera simultanea y controlada:

- GestiOS: primera implementacion empresarial.
- DentalGest: adaptacion clinica solo de patrones comunes.
- Ganadero OS: adaptacion separada por offline y dominio rural.

## Decision actual

ONIA Core no es inventario, ventas, caja, clinica, hato, SIAT, TR4 ni WhatsApp.
Es el sistema comun para responder:

- quien existe en la organizacion;
- quien es responsable;
- que esta pendiente;
- que evidencia existe;
- que actividad ocurrio;
- que requiere atencion gerencial.

Los rubros se resuelven con adaptadores y verticales. El core se mantiene
pequeno para que sea vendible, mantenible y reutilizable.
