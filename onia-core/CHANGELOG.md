# ONIA Core Changelog

## 1.0.0 — CORE COMPLETO (feature-complete, adoption-ready) — 2026-07-22

**El core queda TERMINADO como fundacion.** De aca en adelante el foco ya NO es desarrollar el core sino la ADOPCION en productos + la venta. Cambios al core en adelante: SOLO aditivos (nuevos modulos/rubros), nunca reescritura del contrato.
- Version 0.7.1 -> **1.0.0**, status beta -> **stable** (package.json + validador alineados; contrato congelado, aditivo).
- **Que cubre el core v1.0.0:** 18 entidades + 21 capabilities (14 core) = el sistema comun de control y seguimiento (tenant, roles finos, business partners, work items con SLA, aprobaciones, agenda/schedule, documentos, comentarios, vistas guardadas, intake, actividad) + **9 modulos activables**: `commerce` (catalogo/ventas/cotizaciones + maquinas de estado), `accounting` + `tax_bolivia` (doble partida + IVA/IT/IUE/RC-IVA + RCV + retenciones + 4 estados financieros + cierre de gestion, Bolivia vigente con fuentes), `invoicing` (factura electronica CUF/QR/CAEB/comprador/TCO), `payroll` (planilla Bolivia: bono antiguedad, AFP, RC-IVA, aguinaldo), `imports` (landed cost), `knowledge` (base de conocimiento), `automation` (motor de reglas + idempotencia), `dental` (rubro clinico) y `agents` (agentes 24/7 human-in-the-loop). 11 tracks verticales + 11 packs de rubro. **503 tests, 4 validadores verdes, manifest anti-drift.**
- **Fuera del core por diseno (external_gate):** emision SIAT real (integrations/siat, 262 tests, listo pre-piloto), WhatsApp, ejecucion LLM+cron+scraping de los agentes (runtime del producto/VPS via Hermes), TR4. El core modela el contrato + la logica; las integraciones viven aparte.

## 0.7.1 + modules/agents — 2026-07-22 (agentes 24/7 human-in-the-loop, diferenciador vendible)

Nuevo modulo `agents` del core: el contrato + la logica pura de los agentes autonomos que trabajan 24/7 sobre los datos de la organizacion (calificar leads, armar propuestas, seguimiento, avisos de vencimiento, scraping) como add-on activable SOBRE el core. ENFOQUE: CORE (9no modulo).
- **Human-in-the-loop por diseno (la seguridad ES el foso vendible):** `routeAction` garantiza que NINGUNA accion sensible (contactar/publicar/cobrar/gastar/scraping) ni desconocida se auto-ejecute — todo pasa por la cola de aprobacion del core (`approval_request`). Solo acciones internas reversibles (qualify_lead/flag/prioritize/create_task/summarize/schedule_followup) con un agente `auto` se auto-ejecutan. Guardrails: acciones prohibidas (send_money/execute_payment/delete_data/modify_settings) + limite diario de acciones y de mensajes.
- **3 entidades** (`agent`, `agent_run`, `agent_action`) + maquinas de estado de corrida y accion (inmutables) + idempotencia CROSS-RUN (no reproponer la misma accion entre corridas, dedupe sin runId) + scheduling por intervalo (`shouldRunAgent`) + puentes al core (`buildApprovalRequest`/`buildWorkItem`).
- **La ejecucion real es external_gate**: cron + LLM + scraping + envio los corre el runtime del producto/VPS (Hermes); el core modela el contrato + el ciclo de vida + QUE pasa por aprobacion. Cae en TODO producto (11 tracks).
- Registrado en `contract.moduleCapabilities` (capability `agents`). +38 tests + 5 conteos de modulo actualizados. Aditivo, contrato intacto. **503 tests, 4 validadores verdes.**

## 0.7.1 + invoicing CAEB por item + datos del comprador — 2026-07-22 (perfeccionar el core, fiscal Bolivia)

ENFOQUE: CORE. ULTIMO item de la columna fiscal del core (preparacion de la emision SIAT, Capa 2). Campos confirmados 2026-07-22 contra la pagina oficial del XML/XSD de la Factura de Compra y Venta (siatinfo.impuestos.gob.bo).
- **Datos del comprador en la factura** (`validateBuyer`/`assertValidBuyer` + `BUYER_DOC_TYPES`): razon social, tipo de documento (`codigoTipoDocumentoIdentidad` 1=CI / 2=CEX / 3=PAS / 4=OD / 5=NIT), numero, complemento SEGIP, codigo de cliente. Nuevos campos `buyerName`/`buyerDocType`/`buyerDocNumber`/`buyerDocComplement`/`buyerCode` en la entidad `invoice` + schema. Los codigos de tipo de documento son una PARAMETRICA de sincronizacion DIARIA del SIAT (fuente autoritativa = web service, no hardcode).
- **CAEB + homologacion SIN por item** (`validateInvoiceLineHomologation`, RND 102500000018): cada linea homologa al catalogo del SIN -> `codigoProductoSin` (generico del SIN), `codigoProducto` (interno), `actividadEconomica` (CAEB del Padron Nacional POR ITEM), `unidadMedida` (parametrica; 58 = servicio -> cantidad 1). Nuevos campos `sinProductCode`/`productCode`/`economicActivityCode`/`unitMeasureCode` en `invoice_line` + schema. `invoicing` -> v0.2.0.
- El modulo VALIDA estructura, no emite ni homologa (la homologacion la hace el contribuyente contra el catalogo sincronizado; la emision real sigue `external_gate` del core). +5 tests. Aditivo, contrato intacto. **465 tests, 4 validadores verdes.** Con esto la columna fiscal del core queda al 100%.

## 0.7.1 + accounting retenciones: IT en Form. 410 aparte — 2026-07-22 (perfeccionar el core, fiscal Bolivia)

ENFOQUE: CORE. Correccion de exactitud fiscal en la atribucion de formularios de retencion (las tasas y funciones ya eran correctas; no cambia ningun calculo). Verificado 2026-07-22 contra fuente oficial.
- **El IT (3%) de toda retencion combinada se declara en el Formulario 410, SEPARADO** del formulario del IUE (570) o RC-IVA (604). El config lo lumpeaba en un solo numero de formulario: bienes 8% -> 5% Form. 570 (IUE) + 3% Form. 410 (IT); alquiler/servicios 16% -> 13% Form. 604 (RC-IVA) + 3% Form. 410 (IT). Ahora cada retencion nombra AMBOS formularios (`iueForm`/`rcIvaForm` + `itForm`).
- **IUE-BE confirmado en Form. 530 v3** (no 550): la renta de fuente boliviana se consolida en el 530 v3 (Seccion D obligatoria) y el pago individual va por la Boleta 3050 v3; el 551 v3 es para actividades parcialmente realizadas en el pais. El "530 vs 550" que arrastraba el research era falsa alarma — el 530 v3 es el correcto.
- Fuentes: siatinfo.impuestos.gob.bo (Form. 570 IUE Retenciones, Form. 530 IUE-BE) + boliviaimpuestos.com (Form. 410 IT y tasas combinadas bienes 8% / servicios-alquiler 16%). +1 test (guard anti-regresion). Aditivo, sin cambio de calculo. **460 tests, 4 validadores verdes.**

## 0.7.1 + accounting estados financieros + cierre de gestion — 2026-07-22 (perfeccionar el core, fiscal Bolivia)

ENFOQUE: CORE. Fiscal P1 de `accounting`: completa los estados financieros basicos y el cierre de gestion. Todo se DERIVA de las lineas de asiento — sin cifras/fechas fiscales inciertas.
- **Estado de Evolucion del Patrimonio (EEP)** (`equityStatement`) y **Estado de Flujo de Efectivo** (`cashFlowStatement`, metodo directo; `cashFlowIndirect` para la conciliacion operativa por el metodo indirecto) — eran los 2 estados financieros basicos que FALTABAN (ya estaban `balanceSheet` + `incomeStatement`). Con esto el modulo cubre los 4 estados computables exigidos en Bolivia (Codigo de Comercio DL 14379/1977 Art. 36-65 + Normas de Contabilidad); las notas son narrativas.
- **Asiento de cierre de gestion** (`buildClosingEntry`) — cancela ingresos/gastos/costos contra la cuenta de resultado del ejercicio (utilidad al haber, perdida al debe); cuadra por construccion, reutiliza `ledgerByAccount`.
- **Bloqueo de periodo cerrado** (`isPeriodClosed`/`assertPeriodOpen`/`canPostToPeriod`/`assertCanPost`) — un periodo/gestion cerrado, o una fecha fuera de su rango, ya no admite asientos nuevos (invariante que faltaba: el producto no puede contabilizar en un periodo cerrado por error).
- +6 tests. Aditivo, contrato intacto. **459 tests, 4 validadores verdes.**

## 0.7.1 + invoicing TCO moneda extranjera — 2026-07-21 (perfeccionar el core, fiscal Bolivia)

ENFOQUE: CORE. Fiscal P1 mas reciente (RND 102600000026, 17-jul-2026).
- **`invoicing`: TCO del BCB en facturas de moneda extranjera** (`invoiceTotalInBob`) — desde el regimen cambiario flexible (RM 245/2026) el oficial FLOTA, y el SIAT EXIGE emitir las facturas en moneda extranjera con el TCO oficial diario del BCB (lo que se declara es el importe en Bs). Reusa `fx.officialRate` (el fix del 6.96 fijo hecho antes); factura en BOB -> TCO 1; sin TCO del dia cae al fallback historico. Nuevos campos `tcoUsed`/`bobTotal` en la entidad `invoice` + schema.
- +3 tests. Aditivo, contrato intacto. **453 tests, 4 validadores verdes.**

## 0.7.1 + payroll fiscal P1 — 2026-07-21 (perfeccionar el core, fiscal Bolivia)

ENFOQUE: CORE. Ajustes fiscales de payroll (los datos ya estaban en el config; faltaba aplicarlos y verificar).
- **Tope de cotizacion 60 SMN** (`cotizableBase`) — en sueldos altos los aportes AFP se calculan sobre 60 SMN (Bs 198.000), no sobre el total ganado. Ley 065 de Pensiones.
- **Credito RC-IVA "Hecho en Bolivia" +20%** (`computeHechoEnBoliviaCredit`, DS 5503 dic-2025) — el credito normal (13%) sube a 15,6% efectivo para facturas de productos/servicios hechos en Bolivia, vigente hasta 31-dic-2027.
- **Aporte solidario patronal 3,5% CONFIRMADO** (verificado 2026-07-22: total patronal 7,21% = 3,5 solidario + 1,71 riesgo profesional + 2,0 pro-vivienda; fuente misalariobo may-2026) — resuelta la incertidumbre "3% vs 3,5%" que arrastraba el config. Sin cambio de calculo (el 3,5% era correcto).
- +3 tests. Aditivo, contrato intacto. **450 tests, 4 validadores verdes.**

## 0.7.1 + moduleCapabilities registry — 2026-07-21 (perfeccionar el core, visibilidad de caps de modulo)

P0 #5 (ultimo del core) de la ola "perfeccionar los universales". ENFOQUE: CORE (contrato + validadores), no un producto.
- **Registro `moduleCapabilities` en `contract.json`** — las 7 capabilities que PROVEEN los modulos (accounting, tax_bolivia, invoicing, payroll, automation, import_costing, dental_clinical) ahora son VISIBLES al contrato. Antes eran invisibles: un track NO podia declarar que las necesitaba (validate.mjs exigia que `requiredCapabilityIds` estuviera en `contract.capabilities`, y las provistas no lo estan). Es el hueco que dejo en evidencia el modulo `imports`.
- **Nuevo campo opcional `requiredModuleCapabilityIds` en los tracks** — `proveegest-electrico` ya declara `import_costing` + accounting + tax_bolivia + invoicing + payroll + automation (cierra el gap concreto; el campo queda disponible para el resto de los tracks).
- **Validacion BIDIRECCIONAL** (aditiva): `validate.mjs` valida que cada `requiredModuleCapabilityIds` de un track exista en el registro y que las module-caps no colisionen con las del core; `validate-modules.mjs` valida que cada `providesCapabilities` de un modulo este registrada con el modulo correcto, y que cada registro sea provisto por un modulo real.
- +3 tests. Aditivo, el contrato no rompe (solo campos nuevos). **447 tests, 4 validadores verdes.**

## 0.7.1 + commerce estados + knowledge logica — 2026-07-21 (perfeccionar el core, hardening)

P0 #3-4 de la ola "perfeccionar los universales" (construidos en PARALELO, worktrees aislados, integrados central).
- **`commerce` 0.3.0: maquina de estados** de cotizacion (`draft→sent→accepted|rejected|expired`) y pedido (`draft→confirmed→fulfilled|cancelled`) — antes `status` era string libre sin invariantes y cada producto lo reimplementaba. Nuevas `canTransitionQuote`/`applyQuoteTransition`, `canTransitionOrder`/`applyOrderTransition`, `acceptQuoteToOrder`, `isQuoteExpired`, `paymentBalance` (cuentas por cobrar). +28 tests.
- **`knowledge` 0.2.0: logica pura + integridad de arbol** — era el UNICO modulo sin logica ni tests. `knowledge.logic.mjs`: maquina de estados del articulo (`draft→published→archived`), **integridad de la taxonomia** (`wouldCreateCycle`/`assertAcyclic`: una categoria no puede ser su propio ancestro — cerraba el hueco de ciclos silenciosos), `slugify`, `searchArticles` (ranking lexico; embeddings siguen external). +28 tests.
- Ambos aditivos, contrato intacto. **444 tests, 4 validadores verdes.**

## 0.7.1 + automation idempotencia + triggers — 2026-07-21 (perfeccionar el core, motor de automatizacion)

P0 #2 de la ola "perfeccionar los universales" (habilita las automatizaciones de UX).
- **`automation`: idempotencia anti doble-envio** — `buildDispatch` no marcaba el envio como ya hecho, asi que el cron re-evaluado o un reintento reenviaba el mismo aviso (2 recordatorios al cliente). Nuevas `dispatchIdempotencyKey(rule, event, recipient)` + `isDuplicateDispatch(key, keys)`; `message_dispatch` lleva `idempotencyKey` (regla + trigger + evento de negocio + destinatario). Mismo criterio que work_items/intake.
- **3 triggers nuevos**: `tax_due_soon` (vencimiento fiscal por NIT, reusa `accounting.taxDueDate`), `recall_due` (reactivacion: sin volver N meses y sin cita futura), `quote_expiring` (cotizacion por vencer). `conditionMatches` ya los soporta por la convencion Max/Min.
- **Seed corregido**: recall estaba mal-modelada como `schedule_upcoming` (asumia cita ya agendada) -> `recall_due`; cotizacion como `work_completed` -> `quote_expiring`.
- +7 tests. Aditivo, contrato intacto. **396 tests, 4 validadores verdes.**

## 0.7.1 + payroll bono de antiguedad — 2026-07-21 (perfeccionar el core, fiscal Bolivia)

Primer P0 de la ola "perfeccionar los universales" (research con fuentes oficiales).
- **`payroll`: bono de antiguedad (DS 21060 Art. 60)** — haber MENSUAL obligatorio que FALTABA. Era P0: sin el, la planilla salia mal y arrastraba el error a los aportes AFP y al RC-IVA (el bono integra el total ganado). Escala oficial por tramos (2-4:5% · 5-7:11% · 8-10:18% · 11-14:26% · 15-19:34% · 20-24:42% · 25+:50%) sobre **3 SMN** (regimen general/productivo; servicios 1 SMN, configurable). Verificada 2026-07-21 (finiquitojusto.com + investigacion). Funciones puras nuevas: `seniorityBonusPct`, `computeSeniorityBonus`, `buildTotalGanado`. `laborConfig.seniorityBonus` con escala + base + fuente. +5 tests. Aditivo (contrato intacto). **389 tests, 4 validadores verdes.**

## 0.7.1 + modules/imports — 2026-07-21 (columna importacion/distribucion: landed cost Bolivia + tipo de cambio flotante)

Modulo `imports` (costo de importacion / landed cost, Bolivia) como add-on activable SOBRE el core: provee la capability `import_costing`, tracks `proveegest-electrico`/`proveegest-construccion`. Cierra la "columna" del rubro importador/distribuidor (ProveeGest / Bolivian Electric). El core NO calcula costo de importacion; este modulo lo PROVEE. Contrato `contract.json` INTACTO (modulo fuera del core congelado).

- 4 entidades (`tariff_rate`, `import_shipment`, `import_shipment_line`, `landed_cost_calculation`) + `imports.schema.sql` (namespace `onia_imports_*`).
- `imports.logic.mjs` (logica pura, 31 tests): valor en aduana **DS 5646** (base = FOB + carga + 10% del flete/seguro, reforma Art. 20 DS 25870), GA con vigencias (`resolveTariffRate`: DS 5646 -5pts, DS 5516/5518 arancel cero), IVA importacion credito fiscal recuperable (`vatMode` inside_1494 ↔ outside_13 conmutable por la Ley 1733), ICE opcional, costo puesto en almacen repartido por valor/peso (`computeLandedCostUsd`), valuacion **CPP/PEPS** (UEPS prohibido, NC 2), asiento cuadrado de nacionalizacion (`buildImportJournalEntry`, reusa `assertBalanced` de accounting), mapeo a RCV (`mapImportToRcvRecord`), diferencia de cambio **NC 6** (`exchangeDifference`).
- `bolivianImportConfig` con base legal citada, verificado 2026-07-21 con research de fuentes oficiales (Aduana, SIN, BCB, IBMETRO/IBNORCA).
- **Correccion transversal `logic/fx.logic.mjs`** (aditiva, back-compat): el oficial 6.96 dejo de ser fijo. Nuevo `officialRate(dailyTco)` — el TCO diario del BCB flota (**RM 245/2026 + RD BCB 88/2026**, ~Bs 10.90 al 20-jul) y el SIAT lo exige para facturar en moneda extranjera (**RND 102600000026**). El 6.96 queda como fallback historico.
- `accounting.ivaReformWarning` actualizado a 2026-07-21: la **Ley 1733** solo reglamento la condonacion (RND 102600000019, vig. 10-jun); el IVA desagregado 13% **AUN NO RIGE** (falta su DS) → las formulas de IVA vigentes siguen correctas. No se toco ninguna formula.
- Pendiente de validacion humana (marcado, no fabricado): alcance exacto del 10% flete/seguro del DS 5646 contra una DUI real del despachante de BE; y la lista real de subpartidas electricas reguladas por IBMETRO (hoy solo LED confirmado). Homologacion tecnica / catalogo tecnico NO se modelan como obligatorios sin esa lista.
- **8 modulos, 43 entidades. 384 tests (352+32), 4 validadores verdes.**

## 0.7.1 + modules/automation — 2026-07-09 (multi-sucursal + capa de automatizacion para cualquier negocio)

Sergio: "haz lo de multisucursal" + "el core tiene que aprender a hacer
[automatizacion: correos, chatbots, CRM] rapidamente para cualquier tipo de
negocio". Dos piezas, las dos en el CORE (no parche en un producto) para que
todo vertical las herede.

**Multi-sucursal (0.7.0 -> 0.7.1, aditivo):** la entidad `area` del core ya era
la sucursal logica (roles se acotan por area via role_assignment.scopeType/
scopeId; inventario por warehouse.areaId), pero era minima. Enriquecida con
campos opcionales: `code` (codigo de sucursal — **alimenta el branchCode del
SIAT**), `address`, `phone`, `parentAreaId` (agrupar sucursales, type=GRUPO),
`managerMemberId`, `timezone`. `+3` columnas/indices en base-schema.sql
(incluye unique de code por org). Aditivo/no-breaking: ningun producto pierde
nada; DentaGest (que hoy no usa sucursales) puede adoptarlo cuando venda Grupo
Clinico. El gap "multi-sucursal" que encontro la auditoria de DentaGest ahora
tiene su primitiva en el core.

**modulo `automation` (nuevo, 7mo modulo):** la capa que hace que cualquier
negocio automatice sin codigo a medida. Hoy cada producto hardcodea esto
(generadores + workflows n8n sueltos); este modulo lo vuelve un modelo comun,
declarativo y configurable por rubro.
- 3 entidades (`onia_automation_*`): `automation_rule` (regla declarativa
  "cuando pasa X -> hacer Y": triggerType + condition JSON + actionType +
  template/channel), `message_template` (plantilla con variables {{var}},
  por canal email/whatsapp/sms), `message_dispatch` (registro de envio con
  maquina de estados queued->sent->delivered/failed + reintentos).
- PROVEE su propia capability (`automation`), aplica a los **11 rubros**
  (automatizar es universal — primer modulo ademas de commerce/accounting/
  invoicing/payroll que va a 11/11).
- **Respeta la filosofia del core**: el modulo OWNS reglas/plantillas/registro;
  el ENVIO real (correo/WhatsApp) es external_gate (Resend/Meta/n8n), con freno
  de gasto/aprobacion — el modulo nunca envia por su cuenta. Mismo patron que el
  emisor SIAT (el core prepara y registra, la integracion envia). Es la
  contraparte de SALIDA del `intakePolicy` del core (que es la entrada).
- **CRM**: no se inventa una entidad "CRM" — el CRM ya son las entidades del
  core (business_partner + contact + work_item + comment + activity_event);
  automation es la capa que las hace ACTUAR solas. Chatbot = intake (entra) +
  automation (sale) + WhatsApp gate (transporte).
- `automation.logic.mjs` (25 tests): `renderTemplate` (variables + faltantes),
  `conditionMatches` (convencion Max/Min/igualdad), `matchRule`/
  `evaluateTriggers` (que reglas dispara un evento), `buildDispatch`, maquina de
  estados del envio (`applyDispatchTransition`, reintentos con backoff
  exponencial).
- `automation.seed.json`: **catalogo de reglas por defecto por rubro** — lo que
  hace que un negocio nuevo arranque automatizado "rapido" (recordatorio de cita
  24h, seguimiento no-show, cobro vencido, bienvenida a lead, recall, stock
  critico...). Bundles `_universal`/`_clinical`/`_distribution` mapeados a cada
  track. loadModules lo ignora (sin campo `module`), como el seed de accounting.
- Cableado a report/system-map/install-plan sin cambios de codigo (deteccion
  generica) + subpath `@onia/core/modules/automation-logic` + al manifest
  anti-drift (21 artefactos: +automation.logic + automation.seed).
- 7 modulos, 39 entidades. 352 tests (327+25), 4 validadores verdes.

## portable-artifacts — 2026-07-08 (mecanismo anti-drift de adopcion de logica)

- Sergio pidio "formalizar @onia/core publicable". Investigado como consume
  DentalGest el core en R6 (commit `96b89a9`): NO usa `@onia/core` como paquete
  npm -- porta cada `*.logic.mjs` a `*.ts` a mano con nota
  `// Origen: @onia/core@0.6.2 · ...`. Publicar a npm se evaluo y descarto (sin
  registry privado, y los productos TS igual traducen el mjs -> la ceremonia no
  elimina la traduccion). El problema REAL a resolver es el **drift silencioso**:
  si el core corrige un bug (tasa fiscal, formula IVA) el producto que copio no
  se entera.
- `portable-artifacts.mjs` + `PORTABLE_ARTIFACTS.json`: manifest con el `sha256`
  de cada artefacto portable (19: 14 `*.logic.mjs` de logic/+modules/, 4
  sub-secciones de config de datos de los .json de modulo —bolivianConfig/
  siatConfig/laborConfig/clinicalConfig, hasheadas por SUB-SECCION para que
  agregar un track no marque falso drift—, 1 seed boliviano). `manifestDrift()`
  compara committeado vs real.
- `portable-artifacts.test.mjs` (8 tests): exige que el manifest committeado
  este SINCRONIZADO con los archivos reales -> no puede quedar viejo en
  silencio (cambiar un .logic.mjs sin regenerar el manifest rompe el test).
  Probado con ruptura intencional: ensuciar accounting.logic.mjs -> 2 tests
  fallan + drift lo reporta; revertir -> 8 verdes.
- `ONIA_CORE_LOGIC_PORTING_RECIPE_2026.md`: receta de port segura para
  productos (portar con nota de origen + hash, tests de paridad, chequear drift
  contra el manifest). Convencion mejorada: guardar el `sha256` del manifest en
  el comentario de origen, no solo la version.
- **Verificado por git (respuesta practica inmediata)**: los 3 `.logic.mjs` que
  DentalGest porto en v0.6.2 (commerce/accounting/invoicing) NO cambiaron entre
  0.6.2 y 0.7.0 -> el port de DentalGest sigue vigente, no hay que re-portar.
- `package.json`: subpath `./portable-artifacts` + script `artifacts`. 322
  tests (314+8), 4 validadores verdes. Aditivo: `contract.json` intacto.

## 0.7.0 — 2026-07-07 (los 11 rubros del roadmap, definidos)

- Sergio pidio "sigamos definiendo todos los rubros para tenerlos definidos".
  Hasta esta entrada, solo 4 de los 11 rubros de `verticalFactory.roadmapRubros`
  tenian track+pack real (salud_dental, distribucion_b2b, pymes_general,
  agro_ganaderia); el resto eran solo un nombre en el roadmap. Se despacharon
  7 subagentes de investigacion EN PARALELO (patron
  `superpowers:dispatching-parallel-agents`, tareas independientes sin estado
  compartido), uno por rubro: salud_estetica, salud_veterinaria, gastronomia,
  servicios_profesionales, educacion, construccion_ferreteria,
  turismo_hoteleria. Cada uno investigo vocabulario operativo + angulo
  regulatorio boliviano (con fuente citada, marcando explicitamente lo no
  confirmado en vez de inventarlo) + que entidades son gap real vs. ya
  cubierto por core/modulos.
- **Nueva familia `VETGEST`** (contract.json.families, relationship
  `future_vertical` igual que PROVEEGEST). La investigacion de veterinaria
  concluyo que NO cabe como pack sobre DentalGest (violaria "no convertir a
  DentalGest en ERP generico") ni sobre Ganadero OS (offline-first, ganado de
  produccion, marco regulatorio distinto) — necesita su propio track
  (`vetgest-clinical`) aunque reuse el patron clinico de dental.
- **7 verticalTracks nuevos** (11 tracks totales, de 4): `esteticagest-clinical`
  (familia DENTALGEST), `vetgest-clinical` (familia VETGEST nueva),
  `gestios-gastronomia`, `gestios-servicios-profesionales`, `gestios-educacion`,
  `gestios-turismo` (familia GESTIOS — ya se describia a si misma como "base
  de motor para verticales"), `proveegest-construccion` (familia PROVEEGEST —
  ya se describia como "multi-rubro... electrico es el primer skin, no el
  limite"). Status `roadmap_planned` para los 5 con evidencia solida
  (equivalente a "planificado" del roadmap) y `roadmap_exploring` para
  educacion/turismo (equivalente a "explorar", el estado mas temprano) — para
  no confundirlos con tracks realmente en adopcion (`installing`).
- **7 verticalPacks nuevos**, cada uno con vocabulario (workItemTypes/
  partnerTypes/areas), checklists, KPIs e intakeChannels sintetizados de la
  investigacion. Fix real encontrado por el propio validador de coherencia de
  compuertas (construido en la sesion de verticalPacks original): 5 packs
  inicialmente usaban el canal `whatsapp_chatwoot` en tracks que bloquean
  `whatsapp` — corregido reemplazandolo por `email_shared` (mismo patron que
  ya usa `gestios-general-pack`).
- **`vertical-extensions.json`: 5 de los 7 rubros suman catalogo de entidades
  especificas** (9 tracks con catalogo en total, 33 entidades):
  - `salud_estetica` (2): TreatmentProgressPhoto, SessionPackage +
    SessionPackageRedemption. Reusa InformedConsent/MedicalAlert del modulo
    `dental` tal cual (documentado, no forkeado).
  - `salud_veterinaria` (3): PetIdentifier, PetVaccinationRecord (NO reusa
    VaccinationCampaign de ganadero — esa es campana masiva regulatoria,
    distinta de vacuna individual), HospitalizationStay. Reusa
    InformedConsent/MedicalAlert/Prescription del modulo dental.
  - `gastronomia` (2): Ingredient/receta (conversion de unidades, unico gap
    real segun el research), Table/mesa (estado de ocupacion). Comanda de
    cocina y delivery NO necesitan entidad nueva (work_item + Order.status).
  - `servicios_profesionales` (0): CONFIRMADO cero entidades nuevas — caso
    ejemplar de rubro 100% cubierto por vocabulario+core. Hallazgo tecnico
    real: `onia_commerce_order_lines.variant_id` es NOT NULL, acopla
    sales_cash a catalog_inventory aunque el rubro no tenga stock — resuelto
    con catalogo de servicios sin stock poblado, no con cambio de schema.
  - `construccion_ferreteria` (1): WorkOrder/pedido por obra (entregas
    fraccionadas). `product_homologation` y `landed_cost_calculation` de
    proveegest-electrico se REUSAN sin cambios (fiscalidad/aduana boliviana
    generica, no especifica de electrico); `technical_catalog_spec` no
    necesita modulo nuevo, solo nuevas plantillas de `knowledge_article`.
  - `educacion` y `turismo_hoteleria`: **sin entidades**, a proposito. Ambas
    investigaciones concluyeron independientemente que no hay cliente real
    todavia (mismo criterio #1 de priorizacion que ya uso Onia para DentalGest/
    Bolivian Electric) y que construir sus entidades (Student/Enrollment para
    educacion; Room/Booking/SeasonalRate para turismo, esta ultima candidata a
    MODULO reusable, no extension de un rubro, por ser un patron generico de
    "inventario por disponibilidad temporal") es mas caro que el resto. Quedan
    con pack (vocabulario/checklists/KPIs) para "estar definidos" sin
    comprometerse a construir.
- **`accounting.json`/`invoicing.json`/`payroll.json`**: los 7 tracks nuevos
  agregados a `verticalTracks` de los 3 (mismo criterio universal ya aplicado
  en 0.6.1: todo negocio real necesita contabilidad/factura/planilla).
  `commerce.json`/`knowledge.json` NO se tocaron: su vinculo pasa por
  `activatesCapabilities` contra `requiredCapabilityIds` de cada track (ya
  incluye `catalog_inventory`/`sales_cash`, y `proveegest-construccion` suma
  `knowledge_base`), mecanismo confirmado generico antes de tocar nada.
- **`business-tiers.json`**: los 6 tracks GESTIOS/DENTALGEST nuevos suman a la
  familia `pyme`; `proveegest-construccion` suma a `empresarial` (USD, mismo
  criterio que proveegest-electrico — distribucion B2B de mayor escala).
- **`business-diagnostic.json`**: 7 opciones nuevas en la pregunta de rubro,
  cada una mapeada a su trackId — el cuestionario ya puede resolver los 11
  rubros, no solo los 4 originales.
- Tests actualizados para reflejar la matriz de 11 rubros (antes hardcodeaban
  4): `system-map.test.mjs`, `vertical-extensions.test.mjs`,
  `modules/modules.test.mjs`. Sin tests nuevos (esta entrada es capa de datos/
  definicion, no logica nueva) — 314 tests, 4 validadores verdes.
- `contract.json` 0.6.2 -> 0.7.0 (salto MINOR: nueva familia + 7 tracks + 7
  packs es la expansion mas grande del contrato desde 0.6.0 verticalPacks).

## modules/dental 0.1.0 — 2026-07-07 (primer modulo VERTICAL, de un solo rubro)

- Sergio pidio "empecemos a desarrollar los modulos por rubro". Hasta ahora
  `onia-core/modules/` solo tenia modulos CROSS-CUTTING (commerce/accounting/
  invoicing/payroll/knowledge, usados por 4/4 o al menos 2+ rubros). Este es
  el primer modulo de UN solo rubro (`verticalTracks: ["dentagest-clinical"]`
  exclusivamente) — la contraparte construida del catalogo
  `vertical-extensions.json`, que hasta ahora solo documentaba (sin schema ni
  logica real) que' es especifico de cada rubro.
- No es una contradiccion del principio "lo especifico del rubro vive en el
  PRODUCTO, no en onia-core": es la MISMA relacion que ya existe entre
  commerce/accounting y sus productos (blueprint reusable en onia-core, cada
  producto lo adopta traduciendolo a su propia migracion). Antes, "especifico
  de un rubro" significaba "sin blueprint, cada producto lo inventa desde
  cero"; ahora puede significar "blueprint reusable, pero solo relevante para
  ese rubro" — util si Onia vende el mismo vertical a mas de un cliente
  (la estrategia de fabrica de verticales, `ONIA_VERTICAL_FACTORY_STRATEGY_2026.md`,
  siempre asumio esto).
- 6 entidades, las mismas marcadas `status: "gap"` en `vertical-extensions.json`
  tras la verificacion contra el schema real de DentaGest (sesion 2026-07-06):
  `perio_chart` (periodontograma, 6 puntos por diente), `treatment_plan`
  (agrupador de tratamientos con aprobacion del paciente), `informed_consent`
  (firmas paciente+profesional antes de procedimiento invasivo),
  `medical_alert` (alergias/medicacion estructuradas con severidad, no texto
  libre), `dental_lab_case` (encargo a laboratorio protesico con estados) y
  `tooth_image` (radiografia/foto por pieza). NO reconstruye Patient/
  ClinicalRecord/odontograma/PatientTreatment/Prescription — esos ya existen
  en el producto real (`status: "implemented"`/`"implemented_simpler"`).
- PROVEE su propia capability (`dental_clinical`), mismo mecanismo que
  accounting/invoicing/payroll (`providesCapabilities`, no
  `activatesCapabilities`) — el core no tiene ni tendra una capability
  clinica.
- `dental.logic.mjs`: `computeTreatmentPlanTotal`/`isTreatmentPlanApproved`,
  `hasRequiredSignatures`/`canProceedWithProcedure` (el consentimiento debe
  estar firmado por paciente Y profesional en o antes de la fecha del
  procedimiento — firmar despues no cuenta), `severityRank`/
  `sortAlertsBySeverity`/`hasCriticalAlerts` (solo alertas ACTIVAS),
  maquina de estados `canTransitionLabCase`/`applyLabCaseTransition`
  (ordered -> in_lab -> shipped -> received -> installed, cancelled desde
  cualquier no-terminal) + `isLabCaseOverdue`, y `summarizePerioReading`
  (promedio/maximo de profundidad + conteo de sitios sobre el rango de
  referencia de screening). 21 tests.
- **Umbrales clinicos tratados con el mismo cuidado que los fiscales**:
  `clinicalConfig.notClinicalAdvice: true` explicito; el umbral de 3mm de
  periodontograma se documenta como "rango de referencia de screening
  comun (ej. sistema PSR de la ADA), NO un diagnostico" — el modulo
  estructura datos y flujo, nunca sustituye juicio clinico.
- `vertical-extensions.json`: el track dental gana `oniaCoreModule: "dental"`
  + nota cruzada explicando la relacion (el `status` de cada entity sigue
  describiendo el PRODUCTO real, no cambia solo porque el modulo exista;
  adoptarlo en DentaGest es trabajo separado, mismo criterio que R6 con
  commerce/accounting/invoicing).
- Se integra a `report.mjs`/`system-map.mjs`/`install-plan.mjs` SIN cambios
  de codigo en esos archivos: la deteccion ya era generica por
  `verticalTracks` + `providesCapabilities` (confirmado antes de construir,
  no asumido). `system-map.mjs` ahora muestra `dental: usado por 1/4 rubros` —
  primer modulo con reparticion genuinamente exclusiva de un rubro (antes
  solo `knowledge` estaba en esa categoria, para ProveeGest).
- `install-plan.mjs` (`MODULE_LOGIC.dental`) y `package.json`
  (`./modules/dental-logic`) actualizados, mismo patron que los demas.
- Modulos totales: 6 (commerce, knowledge, accounting, invoicing, payroll,
  dental), 36 entidades. `contract.json` intacto (este modulo no lo toca,
  igual que los anteriores). 314 tests en total (4 validadores + suite
  completa verdes).
- Candidatos siguientes, NO construidos todavia (decision de secuencia
  pendiente de Sergio): modulo `ganadero` (10 entidades ya catalogadas en
  `vertical-extensions.json`, pero el producto Ganadero OS esta en pausa
  comercial) y modulo `proveegest`/distribucion (3 entidades: product_homologation,
  technical_catalog_spec son chicas; landed_cost_calculation ya tiene su
  propio doc de diseno completo, `ONIA_IMPORT_LANDED_COST_MODULE_2026.md`, y
  probablemente merece su propia sesion en vez de una adicion rapida aca).

## 0.6.2 — 2026-07-07 (GestiOS aprobado para adopcion, segundo producto)

- Tras cerrar el gap de 0.6.1 y arrancar la adopcion en DentaGest (item R6,
  carril D), Sergio aprobo tambien GestiOS como segundo producto en adoptar el
  core (pregunta directa: "GestiOS sigue en hold_until_beta... que hacemos" ->
  "Aprobar GestiOS ahora").
- `distributionTargets.gestios.status`: `hold_until_beta` -> `installing`, con
  `adoptionPlan` apuntando a `ONIA_CORE_GESTIOS_ADOPTION_PLAN_2026.md` (nuevo)
  y `nextAction` describiendo el Sprint 0 + la decision pendiente de reemplazar
  o mantener `lib/fiscal/`/`lib/inventory/kardex.ts` propios de GestiOS.
- `adapters/gestios.json.status`: `mapped_not_installed` -> `installing`;
  `adoptionRule` actualizada con una nota real encontrada en el repo: un
  intento previo de copiar `contract.json` directo a GestiOS fue revertido
  (commit `cf57afa` -> `3d8aec4`) — confirma la regla de nunca forkear el core.
- `validate.mjs`: `gestios` agregado a `TARGET_ADOPTION_APPROVED` y
  `ADOPTION_APPROVED` (doble llave, mismo mecanismo que dentagest/bolivian-electric),
  paso que ya estaba anticipado en `ONIA_PENDIENTES_HANDOFF_20260704.md` (item C1).
- **Verificado contra el repo real de GestiOS antes de escribir el plan** (no
  solo memoria de sesion previa): `lib/fiscal/` (balance-comprobacion.ts,
  iva-summary.ts, rcv-export.ts, tax-calendar.ts, commit `1563731`) y
  `lib/inventory/kardex.ts` (commit `77172ce`) existen de verdad, con tests
  (`tests/fiscal-*.test.ts`, `tests/inventory-kardex.test.ts`). El plan NO
  decide si se reemplazan por los modulos `commerce`/`accounting` del core o
  se mantienen — lo deja explicito como decision de Sergio, distinta de la
  adopcion de la columna vertebral organizacional (work_items/roles/etc.) que
  si puede arrancar ya, sin chocar con ninguna de las dos opciones.
- `hermes-content/docs/historial/ONIA_PROXIMA_SESION_PLAN_20260705.md` y `hermes-content/docs/historial/ONIA_SESION_KICKOFFS_20260705.md`
  actualizados: item R1-GESTIOS-CORE refleja la aprobacion; kickoff del carril
  E reescrito con rutas absolutas (mismo bug de rutas relativas cross-repo que
  se encontro y corrigio en el kickoff de DentaGest) y la decision fiscal/
  inventario explicita.
- `package.json` sincronizado a 0.6.2. 279 tests, 4 validadores verdes.

## 0.6.1 — 2026-07-06 (correccion: catalog_inventory/sales_cash en gestios-general, dentagest-clinical y ganadero-offline)

- **Corrige un hueco real de la epoca alpha del contrato, no una decision de
  producto pendiente.** El `system-map` de mas abajo dejaba "gestios no tiene
  commerce" y "ganadero-offline no usa ningun modulo" como pregunta abierta
  para Sergio. Su respuesta: *"yo no he definido si lo tiene o no lo tiene...
  gestios no tiene commerce si es un sistema para inventarios, osea comercio,
  ordena y define las necesidades de cada negocio, yo no he definido nada"* —
  o sea, no era una decision de negocio pendiente, era una completitud que
  faltaba, y correspondia razonarla y resolverla, no seguir preguntando.
- **Evidencia que confirma que era un hueco, no una eleccion valida:**
  1. `business-tiers.json` (capa mas nueva) YA asumia que `gestios-general`,
     `dentagest-clinical` y `ganadero-offline` (familia `pyme`) necesitan
     `commerce` desde el nivel Profesional — el contrato viejo nunca declaro
     la capability subyacente (`catalog_inventory`/`sales_cash`) en
     `requiredCapabilityIds` de esos 3 tracks, asi que quedaba invisible pese
     a que la capa de tiers ya lo daba por hecho.
  2. Se leyo el `schema.prisma` REAL de GestiOS (producto propio de Onia,
     `C:\dev\proyectos\Gestios`, solo lectura): `Product`/`ProductVariant` con
     `stock`/`minStock`/`PurchaseOrderItem` (inventario real, no un mock) y
     `Order`/`OrderItem`/`Invoice` (ventas reales) — GestiOS es literalmente
     un sistema de inventario y ventas sin la capability de core que lo dice.
  3. Ganadero OS (`C:\dev\proyectos\Ganaderos-Os`, solo lectura) NO tiene
     ningun modelo `Product`/`Order`/`Invoice` hoy — confirma que ahi si es
     un gap genuino de producto (no un error de mapeo), documentado como tal
     en el adapter (`status: missing`, con nota).
- **Contract.json**: se agrega `catalog_inventory`+`sales_cash` a
  `gestios-general.requiredCapabilityIds`, `catalog_inventory` a
  `dentagest-clinical.requiredCapabilityIds` (ya tenia `sales_cash`), y
  `catalog_inventory`+`sales_cash` a `ganadero-offline.requiredCapabilityIds`.
  0.6.0 -> 0.6.1 (cambio de datos del contrato, aditivo/no-breaking: ningun
  producto instalado pierde nada, GestiOS/Ganadero OS siguen
  `pending_adoption`).
- **`accounting.json`/`invoicing.json`/`payroll.json`**: se agrega
  `ganadero-offline` a su propio `verticalTracks` — mismo razonamiento
  aplicado consistentemente: TODO negocio formal (incluido un hato/rancho)
  necesita contabilidad, factura y (si tiene empleados) planilla, sin importar
  si su UX es offline-first. `commerce.json`/`knowledge.json` no se tocan: su
  vinculo a un track pasa por `activatesCapabilities` (mecanismo "activa"), no
  por su propio `verticalTracks`, asi que el fix de contract.json ya alcanza.
- **Adapters**: `gestios.json` gana `capabilityMappings` para
  `catalog_inventory`/`sales_cash` con `status: exists` (evidencia real:
  Product/ProductVariant/Order/OrderItem/Invoice); `dentagest.json` gana
  `catalog_inventory` con `status: exists_partial` (InventoryItem/
  InventoryMovement, ya en el schema real); `ganadero-os.json` gana ambas con
  `status: missing` (honesto: no hay evidencia real todavia).
- **Resultado (antes -> despues, `node onia-core/system-map.mjs`):**
  `accounting`/`invoicing`/`payroll` pasan de 3/4 a **4/4** rubros;
  `commerce` pasa de 2/4 a **4/4**; `ganadero-offline` pasa de **0 modulos** a
  `accounting, commerce, invoicing, payroll` (igual que los otros 3 rubros).
  Solo `knowledge` sigue en 1/4 (catalogo tecnico especifico de ProveeGest,
  correctamente no-universal).
- Tests actualizados para reflejar la matriz corregida (ya no fijan el hueco
  como si fuera el comportamiento correcto): `system-map.test.mjs`,
  `install-plan.test.mjs`, `modules/modules.test.mjs`. `package.json` de
  `@onia/core` sincronizado a 0.6.1. 279 tests, 4 validadores verdes.

## system-map — 2026-07-06 (core -> rubro -> modulos -> repeticion, en una vista)

- `system-map.mjs` + `system-map.test.mjs`: combina `buildCoreReport` (de
  `report.mjs`) con `vertical-extensions.mjs` para mostrar las 4 capas del
  sistema de una vez: (1) CORE — 18 entidades/14 capabilities de capa core,
  lo universal; (2) RUBROS — los 4 verticalTracks con su pack y sus funciones
  propias (ej. 11 entidades dentales, 10 ganaderas); (3) MODULOS — que
  modulos necesita cada rubro (derivado de moduleCapabilities+providedModules,
  no recalculado); (4) REPETICION — una matriz modulo->rubros que lo usan,
  ordenada de mayor a menor repeticion. No duplica logica de report.mjs, la
  combina. `sharedModules(map, minRubros)` y `unusedModules(map)` como
  helpers de analisis.
- **Hallazgo real, no corregido sin preguntar:** `accounting`/`invoicing`/
  `payroll` se repiten en 3/4 rubros (gestios-general, dentagest-clinical,
  proveegest-electrico) — valida por que viven como modulo compartido.
  `commerce` se repite en 2/4 (dental + distribucion). PERO
  **`ganadero-offline` no usa NINGUN modulo compartido**: ninguno de los 5
  modulos declara ese track en su `verticalTracks`. Podria ser intencional
  (offline-first, producto en pausa comercial) o un descuido de copiar el
  mismo listado de 3 verticales sin reconsiderar Ganadero OS explicitamente.
  Se deja como pregunta abierta para Sergio, NO se agrego ganadero-offline a
  ningun modulo sin confirmar.
- +11 tests (280 total, 4 validadores verdes). Demo: `node onia-core/system-map.mjs`.

## vertical-extensions — 2026-07-06 (verificado contra DentaGest real)

- El catalogo dental se VERIFICO leyendo `prisma/schema.prisma` real de
  DentaGest (C:\dev\proyectos\DentaGest\dental-saas, solo lectura — DentaGest
  es producto propio de Onia, no un cliente externo, a diferencia de
  Bolivian Electric). Corrige 3 cosas que el research generico no podia saber:
  1. El odontograma real (`ToothRecord`) es una tabla por DIENTE, no por
     diente+superficie (oclusal/mesial/distal/etc.) como recomienda el
     estandar de industria (OpenDental) — marcado `implemented_simpler`.
  2. **DentaGest usa numeracion Universal 1-32**, no FDI (el estandar
     Latam/Bolivia que recomendaba el research). Se deja como nota de
     DECISION DE PRODUCTO abierta (migrar implicaria convertir datos de
     pacientes existentes), no se resuelve en ningun sentido.
  3. `recall_schedule` NO es una entidad dental nueva: ya la cubre
     `ScheduleEvent` del core (confirmado en `adapters/dentagest.json`) — se
     saco del catalogo de entidades y se dejo solo como nota en `coreHooks`.
- Entidad nueva encontrada que el research generico no traia:
  `prescription` (receta medica, model `Prescription` real: medicamentos
  JSON + instrucciones).
- Cada entidad dental ahora declara `status`: `implemented` /
  `implemented_simpler` (existe pero mas simple que el estandar de industria)
  / `gap` (confirmado ausente en el producto real: `perio_chart`,
  `treatment_plan`, `informed_consent`, `medical_alert`, `dental_lab_case`,
  `tooth_image`) — ya no es solo "lo que dice el research", es "lo que HAY
  vs. lo que FALTA" en el producto que los clientes usan hoy.
- +4 tests que fijan estos hallazgos. 269 tests en total, 4 validadores
  verdes, `contract.json` intacto, cero escrituras en el repo de DentaGest.

## business-planning — 2026-07-06 (plan por negocio: rubro + tamano + diagnostico)

- **Nueva capa aditiva (3 artefactos, no toca contract.json):** formaliza "como
  armar el plan por negocio" — que es del CORE (toda empresa), que es de
  MODULO (reutilizable entre rubros), que es EXTENSION VERTICAL (solo un
  rubro, ej. odontograma) y que TAMANO de negocio necesita cada combinacion.
- `business-tiers.json`/`.mjs` + `validate-business-tiers.mjs`: convierte el
  empaquetado comercial YA DECIDIDO (`ONIA_CATALOGO_COMERCIAL_2026.md`
  seccion 2-3: Ordenado/Profesional/Empresa en BOB + Empresarial E1/E2/E3 en
  USD) en datos validables — NO se inventa una segmentacion paralela (ej.
  micro/pequena/mediana/grande legal boliviana), se usa la que Onia ya
  decidio y cobra. Cada nivel declara sus `coreCapabilities`, `modules` (con
  nota de "focus" cuando el modulo se usa parcialmente, ej. accounting =
  "solo tax_bolivia" en Profesional) y `limits` (maxUsers/maxSucursales/
  maxBridges, `null` = sin tope). El validador exige **monotonia**: un nivel
  superior nunca pierde una capability/modulo que ya tenia el inferior
  (probado con test de ruptura intencional). Helpers: `recommendTierForLimits`
  (el nivel MAS CHICO que alcanza los limites pedidos, no el mayor).
  2 familias (pyme, empresarial), 6 niveles. +14 tests.
- `vertical-extensions.json`/`.mjs` + `validate-vertical-extensions.mjs`:
  catalogo de las entidades ESPECIFICAS de cada rubro que viven en el
  PRODUCTO, nunca en onia-core ni en sus modulos. Validado con 2 subagentes
  de investigacion en paralelo:
  - **DentalGest**: `odontogram_entry` (numeracion FDI/ISO 3950 — estandar
    Latam, no el Universal americano — por pieza y por las 5 superficies:
    oclusal/mesial/distal/vestibular/palatina), `perio_chart` (periodontograma,
    entidad separada del odontograma), `treatment_plan` (agrupa tratamientos
    con aprobacion del paciente, distinto de cada tratamiento individual),
    `informed_consent`, `medical_alert` (estructurado, no texto libre),
    `recall_schedule`, `dental_lab_case`, `tooth_image`. Bolivia exige
    "Historia Clinica Odontologica" (Ministerio de Salud) pero no dicta el
    modelo de datos del odontograma en si.
  - **Ganadero OS**: `animal_identifier` (SINTRABOL/SENASAG exige
    identificacion individual obligatoria), `herd` (lote de manejo,
    independiente del potrero fisico — patron universal del software
    ganadero), `vaccination_campaign` (PRONEFA fiebre aftosa + brucelosis,
    campana oficial obligatoria, distinta del evento sanitario puntual),
    `brand_registration` (marca/hierro, Ley 80 + DS 28303, registro de
    PROPIEDAD via CONGABOL, a nivel de predio no de animal), `genealogy`
    (solo ganado de registro via ASOCEBU), `movement_guide` (Guia de
    Movimiento Animal, SENASAG, obligatoria para cualquier venta/traslado),
    `premises_registration` (RUNSA).
  - El validador exige que ninguna entidad de rubro choque con un id de
    entidad del core (probado con ruptura intencional). GestiOS (rubro
    generico) queda con extension vacia a proposito: casi todo se resuelve
    con core+modulos. ProveeGest queda delgada (la mayoria ya cubierta por
    los 5 modulos). 4 tracks, 24 entidades de rubro. +7 tests.
- `business-diagnostic.json`/`.mjs`: cuestionario PREVIO al configurador de 7
  preguntas ya existente (`ONIA_COMPANY_BACKBONE_AND_SELF_SERVICE_2026.md`).
  6 preguntas (rubro, empleados, sucursales, sistemas propios a conectar,
  facturacion electronica, planilla formal) cuyas respuestas resuelven, via
  `resolveDiagnostic()`: el track vertical, la familia+nivel de tamano
  (reusando `recommendTierForLimits`), los modulos que el nivel ya incluye, y
  los modulos pedidos que el nivel NO trae de forma titular (senal de
  upsell/add-on para ventas). Si ningun nivel de la familia alcanza los
  limites indicados, devuelve nivel `null` explicitamente: es una senal de
  revision humana/comercial, nunca un upsell automatico silencioso.
  Demo: `node onia-core/business-diagnostic.mjs`. +13 tests.
- Total: 34 tests nuevos (265 en total), 4 validadores verdes
  (contrato + modulos + tiers + extensions), `contract.json` intacto.

## modules/accounting 0.2.0 — 2026-07-06 (retenciones a terceros + activo fijo)

- Ultimo tramo de investigacion (subagente, cruzo SIN/MEFP/Colegio de
  Auditores) sobre huecos transversales del sistema. Extiende `accounting`
  (no crea un modulo nuevo: retenciones y activo fijo son parte del dominio
  fiscal/contable que ya provee) en vez de fragmentar en mas modulos.
- 2 entidades nuevas: `withholding_record` (retencion a terceros: agente de
  retencion IUE+IT en compras sin factura 8%, RC-IVA+IT en alquileres a
  personas naturales 16%, RC-IVA en honorarios 13%, IUE-BE en remesas al
  exterior 12.5% efectivo) y `fixed_asset` (Libro de Activos Fijos: codigo,
  fecha/costo de adquisicion, tipo, baja — la depreciacion acumulada y el
  valor en libros se DERIVAN, no se guardan duplicados). +2 tablas en
  `accounting.schema.sql`.
- `accounting.logic.mjs`: `computeWithholdingCompraSinFactura`/
  `Alquiler`/`Honorarios`/`BeneficiarioExterior`; `assetDepreciationAsOf`/
  `isFullyDepreciated` (reutilizan `depreciationSchedule` ya existente,
  cerrando el hueco que la propia auditoria estructural detecto: existia la
  FORMULA de depreciacion pero ninguna entidad para REGISTRAR un activo
  individual). +8 tests (31 en accounting.logic, incluye `monthsBetween`
  duplicado a proposito, mismo criterio day-aware que en payroll).
- **Advertencia documentada, SIN tocar codigo**: la Ley N 1.733 "Ley de
  Alivio Tributario" (27-may-2026) cambia el calculo del IVA de "por dentro"
  (~14.94% efectivo) a "desagregado" (13% real, transparente). El reglamento
  no esta confirmado; las formulas de IVA existentes (accounting/invoicing/
  payroll) NO se modificaron — cambiar una formula ya probada sin la mecanica
  exacta confirmada seria peor que dejarlo marcado en `ivaReformWarning`.
- **Investigado y descartado para este tramo** (con razon documentada, no
  construido): RTS/STI/RAU (regimenes de personas naturales de subsistencia,
  no del publico objetivo — empresas formales), ajuste por inflacion NC3/UFV
  (suspendido desde 2020 por Resolucion CTNAC 03/2020, nadie lo aplica hoy),
  revalorizacion tecnica de activos NC4 (evento raro, requiere perito
  externo), aging de cartera y presupuesto vs. real (sin marco legal
  boliviano — el presupuesto solo es obligatorio para el sector publico via
  Ley 1178 SAFCO).
- Modulos totales: 5 (sin cambio de cantidad), 30 entidades (28→30, +2:
  withholding_record y fixed_asset). 231 tests en total (2 validadores +
  suite completa verdes).

## modules/payroll 0.1.0 — 2026-07-06 (planilla de sueldos Bolivia)

- Nuevo modulo `payroll` (Bolivia) que PROVEE su propia capability
  (`payroll`): planilla mensual (aportes AFP/Gestora Publica, RC-IVA
  dependientes) y ciclo laboral completo (aguinaldo, indemnizacion, desahucio,
  vacaciones, finiquito). Validado con subagente de investigacion (Gestora
  Publica oficial, SIN, MEFP, firmas de asesoria boliviana). Entidades
  `employee_profile` (referencia `member` del core sin redefinirlo),
  `payroll_period`, `payroll_entry`, `termination_settlement` (namespace
  `onia_payroll_*`) + `payroll.schema.sql` (4 tablas).
- `payroll.logic.mjs`: `computeAfpLaboral`/`computeAfpPatronal` (desglose 12.71%
  laboral / 7.21% patronal), `computeAporteNacionalSolidario` (tramos
  progresivos aditivos sobre sueldos altos), `computeCnsPatronal` (10%
  patronal), cadena RC-IVA (`computeRcIvaBase`/`RetencionBruta`/
  `CompensacionAutomatica`/`RetencionNeta`) y `computeNetPay`,
  `qualifiesForAguinaldo`/`computeAguinaldoProportional` (reutiliza
  `accruedProvision` de accounting), `qualifiesForIndemnizacion`/
  `computeIndemnizacion`/`computeDesahucio`, `vacationDaysForYears` (escala
  1-5/5-10/+10 anios), `terminationDeadline` (15 dias HABILES, excluye
  fin de semana) y `buildTerminationSettlement` (arma el finiquito segun el
  motivo de cese). 23 tests. **Bug encontrado y corregido durante el
  desarrollo:** `monthsBetween` ignoraba el dia del mes (solo comparaba
  año/mes), sobreestimando la antiguedad hasta en 30 dias — afecta
  directamente los umbrales legales de 90 dias/3 meses; ahora resta un mes si
  el dia de fin es anterior al dia de inicio.
- **Advertencias explicitas de incertidumbre** (marcadas en `laborConfig`, no
  asumidas como ciertas): el "aporte solidario patronal" se cita como 3% o
  3.5% segun la fuente (usamos 3.5%, total 7.21%, configurable); la exencion de
  RC-IVA sobre indemnizacion/desahucio en el finiquito (DS 21531) no esta
  100% confirmada contra el texto oficial. Dato clave que CORRIGE un supuesto
  inicial: la indemnizacion aplica desde **90 dias** trabajados (no desde el
  primer dia) e incluso en **renuncia voluntaria**, a diferencia de la mayoria
  de paises de la region.
- `bridge.logic.mjs` extendido: `payrollEntryToJournalEntry` (planilla ->
  asiento contable: gasto sueldos + cargas patronales = neto por pagar +
  aportes + RC-IVA; recalcula el neto internamente para garantizar el cuadre,
  no confia en un campo externo). +3 tests.
- `install-plan.mjs`/`report.mjs`: `payroll` sumado a `MODULE_LOGIC` y a la
  condicion del puente (`accounting` + cualquiera de commerce/invoicing/
  payroll). `package.json`: nuevo subpath `./modules/payroll-logic`.
- Modulos totales: 5 (commerce, knowledge, accounting, invoicing, payroll),
  28 entidades. 220 tests en total (2 validadores + suite completa verdes).

## modules/invoicing 0.1.0 — 2026-07-06 (factura electronica Bolivia)

- Nuevo modulo `invoicing` (Bolivia) que PROVEE su propia capability
  (`invoicing`): factura (cabecera + detalle), notas de credito-debito, CUF/QR/
  anulacion. Validado con subagente de investigacion (2+ fuentes cruzadas:
  siatinfo.impuestos.gob.bo oficial + analisis tecnico) contra el plan interno
  `ONIA_SIAT_CERTIFICACION_PLAN_2026.md`. Entidades `invoice`, `invoice_line`,
  `credit_debit_note` (namespace `onia_invoicing_*`) + `invoicing.schema.sql`
  (3 tablas).
- `invoicing.logic.mjs`: `amountToWords`/`integerToWords` (importe en literal,
  numero a letras en espanol con apocope "uno"->"un" antes de mil/millones),
  `buildCufPayload`/`mod11CheckDigit`/`decimalStringToHex`/`buildCuf` (CUF de
  referencia: 51 digitos + verificador -> hex; **advertencia**: el ancho de
  `invoiceNumber` y el algoritmo exacto de Modulo 11 no estan 100% confirmados
  contra el Anexo Tecnico oficial, no usar para emitir un CUF real sin
  verificar), `buildQrUrl` (estructura de URL confirmada: nit/cuf/numero/t),
  `cancellationDeadline`/`isPastCancellationDeadline`/`canCancelInvoice`
  (vencimiento dia 9 del mes siguiente, RND 102100000011 Art. 38),
  `buildCreditDebitNote`. 23 tests.
- `bridge.logic.mjs` extendido: `invoiceToJournalEntry` e `invoiceToRcvRecord`
  (factura -> asiento contable / registro RCV, reutilizando `ivaOfRecord` de
  accounting). +4 tests.
- **Fix de coherencia en `install-plan.mjs` y `report.mjs`**: los modulos que
  PROVEEN su propia capability (accounting, invoicing) declaran `verticalTracks`
  pero no llenaban un slot de capability del core, asi que quedaban invisibles
  en el plan de instalacion y en el reporte por vertical (bug real, descubierto
  al construir invoicing). Ahora ambos los listan explicitamente
  (`install-plan`: se agregan al plan aunque no activen una capability del core;
  `report`: nueva linea "modulos con capacidad propia"). +5 tests.
- `package.json`: nuevo subpath `./modules/invoicing-logic` y `./install-plan`.
- Modulos totales: 4 (commerce, knowledge, accounting, invoicing), 24 entidades.
  189 tests en total (2 validadores + suite completa verdes).

## install-plan — 2026-07-05 (la receta hecha herramienta)

- `install-plan.mjs`: generador NUESTRO (read-only) que, dado un vertical (por
  track o por producto), emite el plan ORDENADO para dejarlo funcionando -> tablas
  del core (pendientes segun el adapter), modulos que cubren sus capabilities (con
  su schema y # de tablas), que logica de `@onia/core` portar, y el cableado
  final. Convierte la receta de adopcion en un checklist mecanico para abrir el
  core a cualquier industria. No toca repos de clientes.
  `node onia-core/install-plan.mjs <track|producto>`. +5 tests (158 total).

## @onia/core — 2026-07-05 (paquete importable)

- `package.json` (`@onia/core`, version = la del contrato) + `logic/index.mjs`
  (barrel namespaced): los productos importan `@onia/core/logic` (workItems,
  intake, roles, approvals, scheduling, savedView, fx, numbering),
  `@onia/core/modules`, `@onia/core/report` y `@onia/core/contract` en vez de
  copiar codigo. Cierra el mecanismo para dejar de duplicar (~15-20K lineas).
- Test: la version del paquete debe seguir a la del contrato; entry points
  presentes. +4 tests (153 total).

## core/logic — 2026-07-05 (tipo de cambio + numeracion)

- `logic/fx.logic.mjs`: tipo de cambio Bolivia -> `effectiveRate` (VRD + spread),
  `usdToBob`/`bobToUsd`/`convertUsdToBob`/`repriceUsdToBob`. El oficial 6.96 esta
  marcado SOLO para SIAT (no para precios); Binance es referencia. Utilidad
  transversal para commerce (repricing USD/BOB) y accounting (moneda extranjera).
- `logic/numbering.logic.mjs`: correlativos de comprobantes
  (`formatDocNumber`/`parseDocNumber`/`nextSequence`/`nextDocNumber`) para
  factura, asiento, cotizacion, pedido. +9 tests (149 total).

## core/logic — 2026-07-05 (aprobaciones + agenda + vistas)

- `logic/approvals.logic.mjs`: decision one-shot (pending -> approved/rejected,
  no se re-decide), no se aprueba la propia solicitud (salvo allowSelf).
- `logic/scheduling.logic.mjs`: proximos, vencidos y recordatorios de ScheduleEvent.
- `logic/saved-view.logic.mjs`: sanea filtros de SavedView (no sobrescribir el
  tenant/organizationId; evita prototype pollution __proto__/constructor/prototype).
- Con esto el CORE queda con logica canonica en sus capabilities principales:
  work_items, intake, roles, approvals, scheduling y saved views. +10 tests
  (140 total).

## core/logic — 2026-07-05 (intake + roles)

- `logic/intake.logic.mjs`: gobernanza de canal (registrado o alerta de
  gobernanza), dedupe por contacto+canal en 24h, ruteo por routedAreaId/
  routingRule, round-robin por carga y normalizacion a WorkItem draft. Implementa
  las `normalizationRules` del `intakePolicy` del contrato.
- `logic/roles.logic.mjs`: motor de permisos deny-by-default sobre RoleAssignment
  -> asignaciones activas/no vencidas, alcance organizacion/area, union multi-rol
  y wildcard '*'. La matriz de permisos la aporta el vertical, no el core.
  +18 tests (130 total).

## report/verticalReadiness — 2026-07-05 (parar un vertical nuevo)

- `verticalReadiness(contract, modules, trackId)` en `report.mjs`: dice si un
  vertical esta listo para ser un sistema vendible (tiene su pack + sus
  capabilities de capa modulo cubiertas por algun modulo) y que le falta. Guia
  para parar un sistema nuevo tipo ProveeGest sin ir a ojo. +3 tests (115 total).

## core/logic — 2026-07-05 (logica canonica del core: work_items)

- Nueva carpeta `onia-core/logic/`: logica pura canonica del CORE (aditiva, no
  toca el contrato congelado). Cierra el hueco de completitud: las funciones del
  core estaban completas en estructura pero sin logica canonica (cada producto la
  reimplementa, ~15-20K lineas duplicadas).
- `work-items.logic.mjs`: maquina de estados (open/in_progress/done/cancelled con
  reapertura), `applyTransition` inmutable con closedAt, SLA (`slaDueAt`/
  `isOverdue`), `dedupeKey` del intake, `priorityRank` y `comparePending` (orden
  de la cola del panel: vencidos -> prioridad -> antiguedad). +8 tests (112 total).

## modules/bridge — 2026-07-05 (commerce -> contabilidad)

- `bridge.logic.mjs`: convierte una venta/pedido de commerce en su asiento
  contable boliviano con IVA por dentro (debe caja/CxC por el total, haber ventas
  por el neto + IVA debito fiscal), reutilizando `computeQuoteTotal` (commerce) y
  `assertBalanced` (accounting). `saleToJournalEntry` / `orderToJournalEntry`.
  Conecta los dos modulos: una venta genera su asiento cuadrado solo. +4 tests.

## modules/accounting 0.1.0 — 2026-07-05 (contabilidad Bolivia)

- Nuevo modulo `accounting` (Bolivia) que PROVEE capabilities propias
  (`accounting`, `tax_bolivia`): el core deja la contabilidad/fiscal afuera a
  proposito, asi que el modulo las introduce. Nuevo campo `providesCapabilities`
  (una capability nueva que el core no tiene) ademas de `activatesCapabilities`.
- Ciclo contable de doble partida: `account` (plan de cuentas), `fiscal_period`
  (gestion por sector), `journal_entry` + `journal_entry_line` (libro diario; el
  mayor y el balance de comprobacion se DERIVAN de las lineas). Impuestos Bolivia:
  `tax_rate`, `tax_declaration`, `rcv_record` (IVA 13% / IT 3% / IUE 25% / RC-IVA,
  RCV, vencimiento por digito NIT). `bolivianConfig` con tasas, cierres de gestion
  por sector, tabla de vencimientos NIT y umbral de bancarizacion (default
  configurable; NO es asesoria fiscal). + `accounting.schema.sql` (7 tablas).
- Validador: `providesCapabilities` no puede chocar con una capability del core;
  cada capability activada O provista tiene al menos una entidad. +3 tests.
- `accounting.logic.mjs` (funciones puras, referencia canonica): doble partida
  (cuadre debe=haber), libro mayor, balance de comprobacion, libro auxiliar por
  partner (libro menor), estado de resultados y balance general (cuadran por
  construccion), IVA (debito/credito/saldo a favor), IT, IUE, bancarizacion,
  vencimiento por digito NIT y cierre de gestion por sector. 18 tests enlazados al
  bolivianConfig real; alicuotas por parametro. No es asesoria fiscal.
- `accounting.seed.bolivia.json`: plan de cuentas base (PCGA Bolivia, ~46 cuentas
  activo/pasivo/patrimonio/ingreso/gasto/costo con IVA credito/debito, depreciacion
  acumulada y provisiones laborales). Semilla ajustable; sirve de mapa de cuentas
  para los estados financieros. +6 tests. `loadModules` ahora ignora JSON que no
  son modulos (el seed convive en modules/ sin ser un modulo).
- Ajustes de cierre en `accounting.logic.mjs`: depreciacion de linea recta con
  tasas por tipo de activo (DS 24051: edificios 2.5%, muebles 10%, vehiculos 20%,
  computacion 25%...) + acumulada y valor en libros (topeada a la base), y
  provisiones laborales aguinaldo/indemnizacion (sueldo/12, devengado por meses).
  Config `depreciationByAssetType` / `laborProvisions`. 100 tests en total.

## modules/knowledge 0.1.0 — 2026-07-05 (base de conocimiento)

- Nuevo modulo `knowledge` (vertical_extension) que activa la capability
  `knowledge_base` (hasta ahora sin modulo, que el reporte flagueaba como FALTA
  MODULO). Entidades `knowledge_category` + `knowledge_article` (namespace
  `onia_knowledge_*`) + `knowledge.schema.sql`. Con esto ProveeGest/Bolivian
  Electric queda 100% cubierto por modulos (catalog_inventory + quotes_b2b +
  sales_cash + knowledge_base). +1 test.

## modules/commerce 0.2.0 — 2026-07-05 (ventas/caja)

- Capability `sales_cash` agregada al modulo commerce: entidades `order`,
  `order_line` y `payment` (+3 tablas `onia_commerce_*` en el schema). El pedido
  puede nacer de una cotizacion aceptada (`order.quoteId`) y payment es la base de
  cuentas por cobrar. Commerce ahora cubre catalog_inventory + quotes_b2b +
  sales_cash (12 entidades). +1 test (9 en modulos).

## modules/commerce 0.1.0 — 2026-07-05 (capa de modulos vendibles)

- Nueva capa `onia-core/modules/`: add-ons vendibles activables SOBRE el core,
  FUERA del contrato congelado (el core no es inventario/ventas — asi lo manda el
  gap audit). No requiere entrada en contract.json ni mapeo en adapters.
- `commerce.json`: catalogo + inventario multi-almacen + cotizaciones B2B (9
  entidades `onia_commerce_*`), activa las capabilities de modulo
  `catalog_inventory` y `quotes_b2b` (hoy declaradas pero vacias en el core).
  Primer consumidor: ProveeGest / Bolivian Electric.
- `commerce.schema.sql`: SQL base del modulo (tablas `onia_commerce_*` con tenant
  scope, indices y uniques). Cada entidad declara su `table`; el validador exige
  que el schema la defina (mismo patron blueprint->SQL que uso el core).
- Validador `modules/validate-modules.mjs`: un modulo solo activa capabilities de
  capa modulo (nunca core ni external_gate), depende solo de entidades core
  reales, referencia tracks existentes, sus entidades son tenant-scoped y no
  chocan con ids del core, cada capability activada tiene al menos una entidad, y
  si declara `schemaFile` este define la tabla de cada entidad.
  + 8 tests (`modules/modules.test.mjs`).

## 0.6.0 — 2026-07-05 (vertical packs formalizados)

- Nueva estructura `verticalPacks`: un pack por track vertical con vocabulario
  del rubro (`workItemTypes`, `partnerTypes`, `areas`), `checklists`, `kpis` e
  `intakeChannels`. Onboardear un rubro nuevo = agregar track + pack (datos), no
  codigo de core.
- Aditivo/no-breaking: no toca entidades, capabilities, schema ni adapters, asi
  que los productos en adopcion (DentalGest, Bolivian Electric) no se ven
  afectados.
- Validador: biyeccion track<->pack, `rubro` en el roadmap, `intakeChannels`
  subconjunto de `intakePolicy.channels`, vocabulario/checklists/kpis no vacios,
  KPIs sincronizados con `owner_dashboard.verticalExtensions` y coherencia de
  compuerta (un pack no puede alimentar un canal `external_gate` cuya capability
  su track bloquea; ej: intake WhatsApp en un vertical que gatea whatsapp).
- Helpers `getVerticalPacks` / `getVerticalPack` / `getVerticalPackByRubro`.
- Nuevo `report.mjs`: reporte de avance en lenguaje simple (verticales con su
  pack + cuanto del core lleva instalado cada producto); nombra las capabilities
  bloqueadas por vertical. Suite dependency-free (`node:test`): 43 tests.

## 0.5.0 — 2026-07-03 (core finalizado para beta)

- `work_item.channelId` agregado al contrato + `channel_id` al SQL base
  (el intake lo exige; DentaGest ya lo tenia instalado).
- `distributionTargets.dentagest.status` -> `installing` con doble llave
  en el validador (`TARGET_ADOPTION_APPROVED`).
- Nueva `ONIA_CORE_INSTALL_GUIDE_2026.md`: receta repetible destilada de la
  adopcion real (convenciones de traduccion, orden de sprints, reglas duras).
- Policy: core beta congelado para adopcion.

## 0.4.0 — 2026-07-03

- Entidad `CommunicationChannel` (registro de canales oficiales con ruteo) —
  resuelve el caos multi-correo.
- Capability `channels`, canal `email_shared`, regla de gobernanza (canal no
  registrado = alerta), seccion `channels` del owner_dashboard.
- Docs: company backbone (10 piezas) + configurador 7 preguntas +
  self-service (Google -> landing -> checkout -> wizard).

## 0.3.0 — 2026-07-03

- `verticalFactory` (11 rubros; ProveeGest = distribucion B2B multi-rubro).
- `readModels.owner_dashboard` (6 secciones core + extensiones por track).
- `intakePolicy` (canales + reglas de normalizacion).
- Validador: checks para las 3 secciones nuevas.

## 0.2.0 — 2026-07-03 (alpha -> beta)

- 7 entidades transversales: BusinessPartner, RoleAssignment, Comment,
  Document, ApprovalRequest, ScheduleEvent, SavedView + SLA en WorkItem.
- 6 capabilities core nuevas; track dentagest-clinical -> first_beta_active.
- Validador endurecido: 14 tablas + columnas SLA, entidades huerfanas,
  cobertura de las 10 preguntas, semver, adapters mapean todo el core.

## 0.1.0 — 2026-06 (alpha)

- Contrato canonico inicial: 10 entidades, 14 capabilities, 4 tracks,
  3 adapters, SQL base y validador.
