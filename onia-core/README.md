# ONIA Core

Estado: estable (v1.0.0, `contract.json`), adoptado en Onia Platform. DentalGest es el nombre viejo del pack dental y GestiOS es legado (`CLAUDE.md` §«Hay UN solo producto»).
Owner: Onia / Hermes.

> Beta contract cerrado: se agregaron las 8 piezas transversales
> (BusinessPartner, RoleAssignment, Comment, Document, ApprovalRequest,
> ScheduleEvent, SavedView y WorkItem con SLA opcional). La instalacion en repos
> producto esta aprobada para DentalGest (`ONIA_CORE_DENTALGEST_ADOPTION_PLAN_2026.md`)
> y GestiOS (`ONIA_CORE_GESTIOS_ADOPTION_PLAN_2026.md`, aprobado 2026-07-07);
> Ganadero OS sigue bloqueado hasta su propio plan.

> v0.7.0 (2026-07-07): los 11 rubros del roadmap (`verticalFactory.roadmapRubros`)
> tienen ahora track + pack definidos (antes solo 4). 7 rubros nuevos investigados
> con subagentes en paralelo: salud_estetica, salud_veterinaria (familia nueva
> VETGEST), gastronomia, servicios_profesionales, educacion, construccion_ferreteria
> y turismo_hoteleria. 5 de los 7 suman catalogo de entidades especificas en
> `vertical-extensions.json`; educacion y turismo quedan solo con pack (sin
> entidades) porque sus propias investigaciones concluyeron que no hay cliente
> real todavia. Ningun rubro nuevo tiene producto/repo construido: es la capa de
> DEFINICION (vocabulario/checklists/KPIs/gaps), no de desarrollo.

ONIA Core es el nucleo de organizacion operativa que despues se instalara en
los sistemas de Onia: GestiOS, DentalGest y Ganadero OS.

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
- **Anti-drift** (`portable-artifacts.mjs` + `PORTABLE_ARTIFACTS.json` +
  `ONIA_CORE_LOGIC_PORTING_RECIPE_2026.md`): los productos son TS/Prisma en
  repos separados y PORTAN la logica pura a mano (mjs->ts). El manifest
  registra el `sha256` de cada artefacto portable (14 logic + 4 config + 1
  seed) para detectar drift silencioso cuando el core corrige algo y el
  producto que copio no se entera. `portable-artifacts.test.mjs` exige que el
  manifest este sincronizado (no puede quedar viejo). Regenerar:
  `node onia-core/portable-artifacts.mjs --write`. Receta de port segura en el
  MD. (Verificado 2026-07-08: el port de DentalGest en v0.6.2 sigue vigente,
  sus 3 logic no cambiaron en 0.7.0.)
- `validate.mjs`: validador local de estructura e invariantes.
- `report.mjs`: reporte de avance en lenguaje simple (verticales con su pack y
  cuanto del core lleva instalado cada producto). Correr: `node onia-core/report.mjs`.
- `report.test.mjs`: tests del reporte.
- `install-plan.mjs`: genera el plan de instalacion de un vertical (core +
  modulos + logica de @onia/core a portar, ordenado). Herramienta nuestra,
  read-only: `node onia-core/install-plan.mjs <track|producto>`.
- **Plan por negocio** (rubro + tamano + cuestionario), aditivo, no toca el
  contrato:
  - `business-tiers.json`/`.mjs`: convierte el empaquetado comercial YA
    DECIDIDO (Ordenado/Profesional/Empresa + Empresarial E1/E2/E3, ver
    `ONIA_CATALOGO_COMERCIAL_2026.md`) en datos validables — que capabilities
    del core, que modulos y que limites (usuarios/sucursales/puentes) trae
    cada nivel de tamano de negocio. `validate-business-tiers.mjs` exige
    monotonia (un nivel superior nunca pierde algo del inferior).
  - `vertical-extensions.json`/`.mjs`: catalogo de las funciones ESPECIFICAS
    de cada rubro que NO viven en onia-core (ej. odontograma para
    DentalGest, guia de movimiento animal para Ganadero OS) — investigado con
    subagente por rubro. `validate-vertical-extensions.mjs` exige que ninguna
    choque con una entidad del core.
  - `business-diagnostic.json`/`.mjs`: cuestionario PREVIO al configurador de
    7 preguntas (`ONIA_COMPANY_BACKBONE_AND_SELF_SERVICE_2026.md`) — resuelve
    rubro + nivel + modulos a partir de las respuestas de una empresa.
    `resolveDiagnostic()` nunca inventa un upsell: si ningun nivel alcanza,
    devuelve null (revision humana). Demo: `node onia-core/business-diagnostic.mjs`.
  - `system-map.mjs`: las 4 capas en una vista (core -> rubro -> modulos que
    necesita cada rubro -> que rubros REPITEN cada modulo). Reutiliza
    `report.mjs`/`vertical-extensions.mjs`, no duplica su logica.
    `sharedModules()`/`unusedModules()` identifican candidatos reales a
    modulo compartido vs. huerfanos del catalogo. Demo: `node onia-core/system-map.mjs`.
- `modules/`: modulos vendibles (add-ons activables SOBRE el core, FUERA del
  contrato congelado — el core no es inventario/ventas/contabilidad/facturacion/
  nomina). `commerce.json` (catalogo/inventario/cotizaciones B2B/ventas-caja),
  `knowledge.json` (base de conocimiento), `accounting.json` (contabilidad
  Bolivia: doble partida + IVA/IT/IUE + retenciones a terceros + registro de
  activo fijo), `invoicing.json` (factura electronica
  Bolivia: CUF/QR/anulacion/notas de credito-debito) y `payroll.json` (planilla
  de sueldos Bolivia: AFP/Gestora Publica, RC-IVA dependientes, aguinaldo,
  indemnizacion, desahucio, vacaciones, finiquito) — estos tres ultimos PROVEEN
  su propia capability (`providesCapabilities`) en vez de llenar un slot del
  core. Cada modulo con su `*.schema.sql` y logica pura en `*.logic.mjs`;
  `bridge.logic.mjs` conecta commerce/invoicing/payroll -> accounting.
  `validate-modules.mjs` = validador propio.
- `modules/dental.json`: primer **modulo VERTICAL** (de UN solo rubro, a
  diferencia de commerce/accounting/etc. que sirven a varios) — clinica
  odontologica. Cubre los 6 gaps confirmados contra el schema real de
  DentaGest (`vertical-extensions.json`): `perio_chart`, `treatment_plan`,
  `informed_consent`, `medical_alert`, `dental_lab_case`, `tooth_image`. NO
  reconstruye lo que DentaGest ya tiene (Patient/ClinicalRecord/odontograma/
  PatientTreatment/Prescription siguen siendo del producto). PROVEE su propia
  capability (`dental_clinical`), `verticalTracks: ["dentagest-clinical"]`
  unicamente. `dental.schema.sql` + `dental.logic.mjs` (totales de plan de
  tratamiento, validez de consentimiento informado por firmas, severidad de
  alertas medicas, maquina de estados de caso de laboratorio, resumen de
  periodontograma — con `clinicalConfig.notClinicalAdvice`: estructura datos
  y flujo, no diagnostica). Mismo mecanismo de `report.mjs`/`system-map.mjs`
  que los modulos compartidos, sin cambios de codigo: se detecta solo por
  `verticalTracks` + `providesCapabilities`.
- `modules/automation.json`: la **capa de automatizacion/engagement** para
  CUALQUIER negocio (los 11 rubros). Reglas declarativas "cuando pasa X ->
  hacer Y" (`automation_rule`), plantillas con variables (`message_template`)
  y registro de envio con maquina de estados (`message_dispatch`). El ENVIO
  real (correo/WhatsApp/SMS) es external_gate (Resend/Meta/n8n); el modulo modela
  reglas y registra, no envia — mismo patron que el emisor SIAT. Es la salida
  del `intakePolicy` del core (que es la entrada). El CRM ya son las entidades
  del core (business_partner+contact+work_item+comment+activity); automation las
  hace ACTUAR solas. `automation.logic.mjs` (render de plantillas, matching de
  reglas, dispatch state machine con reintentos) + `automation.seed.json`
  (reglas por defecto por rubro: recordatorio de cita, cobro vencido, bienvenida
  a lead... para arrancar automatizado sin configurar).
- `ONIA_CORE_RESEARCH_RESULT_2026.md`: resultado de investigacion local y externa.
- `ONIA_CORE_BENCHMARK_GAP_AUDIT_2026.md`: auditoria contra sistemas ERP, CRM,
  work management y operacion real de empresas.
- `ONIA_CORE_DENTALGEST_BETA_DIRECTION_2026.md`: decision de beta inicial para
  DentalGest, dueno como usuario principal y facturacion interna desde inicio.
- `ONIA_CORE_DISTRIBUTION_PLAN_2026.md`: plan para subir ONIA Core a los
  sistemas cuando este listo.
- `ONIA_CORE_CLIENT_ADOPTION_MAP_2026.md`: clientes candidatos y arquetipos
  mapeados a tracks verticales, con orden de adopcion.
- `hermes-content/docs/historial/onia-core/ONIA_CORE_EXTERNAL_RESEARCH_20260703.md`: proyectos open source, modelos y
  skills verificadas (GitHub, Hugging Face) como referencias de diseno.
- `ONIA_VERTICAL_FACTORY_STRATEGY_2026.md`: estrategia de fabrica de
  verticales por rubro y go-to-market (un core, muchos verticales
  especializados; ProveeGest = distribucion B2B multi-rubro).
- `ONIA_CORE_OWNER_PANEL_AND_INTAKE_2026.md`: diseno canonico del read-model
  owner_dashboard y la politica de intake externo -> WorkItem.
- `CHANGELOG.md`: historial de versiones del contrato (0.1.0 alpha ->
  0.7.0 los 11 rubros del roadmap con track+pack definidos).
- `ONIA_CORE_INSTALL_GUIDE_2026.md`: receta repetible de instalacion en
  productos, destilada de la adopcion real en DentalGest.
- `hermes-content/docs/historial/onia-core/ONIA_STACK_ASSESSMENT_2026.md`: evaluacion del stack (Postgres/Prisma/Next
  confirmados; riesgos reales: tenant isolation, sync offline, motor
  compartido).
- `ONIA_CORE_DENTALGEST_ADOPTION_PLAN_2026.md`: plan de sprints para instalar
  el core en DentalGest (Sprint 0 = baseline de migraciones; cockpit v1 ya
  existe en el producto como prototipo del owner_dashboard).
- `ONIA_CORE_GESTIOS_ADOPTION_PLAN_2026.md`: plan de sprints para instalar el
  core en GestiOS (segundo producto aprobado, 2026-07-07). GestiOS ya tiene
  `lib/fiscal/` + `lib/inventory/kardex.ts` propios (544 tests) — el plan deja
  explicito que reemplazarlos por los modulos commerce/accounting del core o
  mantenerlos y adoptar solo la columna vertebral organizacional es una
  decision de Sergio, no asumida.
- `schema/base-schema.sql`: SQL base de referencia, no aplicado directamente.
- `adapters/gestios.json`: mapa de adopcion para GestiOS.
- `adapters/dentagest.json`: mapa de adopcion para DentalGest.
- `adapters/ganadero-os.json`: mapa de adopcion para Ganadero OS.

## Validacion, tests y reporte

```bash
npm run validate:onia-core                        # invariantes del contrato core
node onia-core/modules/validate-modules.mjs       # validador de modulos vendibles
node onia-core/validate-business-tiers.mjs        # validador de niveles de tamano
node onia-core/validate-vertical-extensions.mjs   # validador del catalogo por rubro
node --test onia-core/*.test.mjs onia-core/logic/*.test.mjs onia-core/modules/*.test.mjs   # 503 tests
node onia-core/report.mjs                         # foto de avance por vertical/producto/modulo
node onia-core/install-plan.mjs <track|producto>   # plan de instalacion de un vertical
node onia-core/business-diagnostic.mjs            # demo del cuestionario -> rubro+nivel+modulos
node onia-core/system-map.mjs                     # core -> rubro -> modulos -> que rubros repiten cada modulo
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
