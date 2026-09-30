# ONIA - DentalGest: Estructura de la Ultima Milla (que anadir, en que capa, por que vende) - 2026

Fecha: 2026-07-22. Estado: ESTRUCTURA / plan (ANTES de codear). Owner: ONIA.
Desarrollado con subagentes (gap audit del repo real + foso diferenciador + baseline de competencia).

Sergio pidio, antes de picar codigo: (1) que se ANADE a DentalGest, (2) que le DEVUELVE al CORE (reusable para otros SaaS), (3) pensar toda funcion desde "esto nos diferencia de lo gratis y hace que el comprador PAGUE". Este doc responde las 3. Detalle completo en las secciones de investigacion (abajo).

---

## 0. TL;DR

- **DentalGest esta ~90% y MAS adoptado de lo que creiamos.** Ya tiene: agenda, odontograma, recetas, tratamientos, pacientes, facturacion interna+impresion+recurrentes, inventario, **roles finos completos** (matriz 10 permisos x 5 roles), **collab (comentarios/documentos) en la ficha del paciente**, cola de **aprobaciones**, wizard de onboarding, 3 crons, 54 tests. La ultima milla es FOCALIZADA, no un rebuild.
- **Casi todo lo que falta es REUSABLE -> va al CORE o a un MODULO** (lo heredan GestiOS/ProveeGest/etc.). Solo los "delices dentales" quedan como EXTENSION DENTAL. Tu principio ("todo empieza del core"), aplicado.
- **El foso de venta NO es "otra agenda con odontograma"** (eso es commodity y hay GRATIS creible en LatAm). Es: **SIAT (nadie lo trae) + Agentes 24/7 con aprobacion (no chatbot tonto) + Privacidad/on-premise (datos no salen) + Negocio completo con fiscal**. Nadie en Bolivia combina los 4.

## 1. El mapa de capas: que se anade y a donde VUELVE (lo central)

Cada funcion clasificada. **CORE/MODULO = se construye en DentalGest pero lo hereda TODO SaaS ONIA.** DENTAL = solo clinicas.

| # | Que se anade | Capa | Lo hereda | Por que VENDE |
|---|---|---|---|---|
| 1 | **Cablear el emisor SIAT** a la facturacion | MODULO invoicing + integracion SIAT (external_gate compartido) | Todo SaaS boliviano | Cumplir la ley (30-sep-2026); lo gratis NO factura |
| 2 | **Migrar factura interna -> OniaInvoicing** (trae campos CUF/CUFD/QR/leyenda) | MODULO invoicing | Todos los rubros | Prerequisito tecnico del SIAT |
| 3 | **Contador Pack** (RCV + calendario NIT + radar RND) | MODULO accounting/tax_bolivia | Todo ERP boliviano | La clinica cumple sin contador caro |
| 4 | **Runtime de agentes 24/7** (Recall, Cobrador, Confirmador, Cero-multas) | MODULO agents (motor) + config DENTAL (prompts) | Todo SaaS | ROI directo; "tu clinica trabaja mientras dormis" |
| 5 | **On-premise + privacidad** (datos no salen, no data-mining, backup cifrado, bitacora de acceso) | **CORE** (arquitectura + seguridad) | Todo producto | "tus datos de salud NO salen de la clinica" - foso vs gratis |
| 6 | **Collab en pantalla de FACTURA** (comentarios/docs/aprob) | CORE (entidades genericas) + DENTAL (montaje UI) | Todos | Completar la adopcion del core |
| 7 | **Portal del paciente** + **recordatorios WhatsApp** | MODULO portal + automation | Cross-rubro | Experiencia premium, retencion |
| 8 | **Ultima milla UI**: form de crear alerta medica, SavedView generico en mas listas | DENTAL (alerta) + CORE (saved-view reusable) | Core lo hereda | Pulido para vender |
| 9 | **5 entities dentales**: treatment_plan, informed_consent, perio_chart, dental_lab_case, tooth_image | EXTENSION DENTAL (blueprint ya en dental.json) | Solo dental | Delices que enamoran al dentista |

**Candidatos a PROMOVER al core (no atrapar en dental):** medical_alert + informed_consent hoy son dental, pero el patron (alerta clinica estructurada + consentimiento pre-procedimiento) sirve a **estetica / veterinaria / salud** (tracks ya previstos). -> cuando entren esas verticales, se promueven a un **MODULO clinico compartido**. Anotarlo desde ya para no rehacer.

## 2. Los diferenciadores que venden (VALIDADO con evidencia + criterio propio)

> Correccion honesta: la primera version repetia los 4 diferenciadores que se dieron. Con investigacion de fuentes confiables (drivers de compra del dentista + evaluacion critica), el orden REAL cambia. Lo que sigue esta ordenado por lo que de verdad CIERRA la venta para una clinica chica boliviana, no por lo que suena avanzado. Evidencia completa en la seccion "diferenciadores-criticos" (abajo).

**El filtro:** el dentista dueno de 1-3 sillones no compra "software dental" -- compra dejar de perder plata por sillon vacio, dejar de perseguir saldos, y no tener lios con el SIAT. El odontograma lindo y la etiqueta "IA" son table-stakes, no cierran.

### TOP SET (liderar el pitch con estos 4)

1. **MOTOR DE INGRESOS (el cierre mas fuerte).** Reencuadrar el sistema de "gasto que guarda fichas" a "sistema que SACA plata": reactiva pacientes dormidos, corta no-shows, cobra saldos, sigue planes de tratamiento. **El sistema se paga solo.** DATO: los recordatorios automaticos bajan las faltas ~23% (estudio 1,6M citas / 64 clinicas); reactivar un paciente cuesta 5-25x menos que captar uno nuevo. [VERIFICAR magnitud en Bs al ticket boliviano.]
2. **WhatsApp-FIRST (el canal correcto).** Agenda, recordatorio, confirmacion, factura y receta por WhatsApp -- el canal que el boliviano YA usa. Los lideres (Dentalink/Dentiqa) nacieron sobre SMS/email/portal; WhatsApp nativo es ventaja local genuina, y por aca se ataca el driver de compra #1 (no-shows).
3. **SIAT nativo (el "por que comprar AHORA").** Facturacion en linea obligatoria (grupos 9-12 al 30-sep-2026). Es un GATILLO regulatorio ("grudge purchase") con fecha: dispara la compra. Honesto: es urgencia, no foso durable (todos lo tendran pronto) -- el valor esta en "cobras y facturas legal en el mismo acto", incluido, no aparte.
4. **AGENTE IA 24/7 con aprobacion humana (el gancho).** Ataca la fuga #1: el ~30-35% de mensajes/llamadas que se pierden. Vender el RESULTADO ("nunca se te escapa un paciente que escribio a la 1am"), NO la palabra "IA" (que puede asustar al dentista tradicional). La aprobacion humana (routeAction) lo hace confiable.

**El TONO que envuelve todo (no es un bullet, es COMO se vende):** confianza local -- **precio transparente en Bs** (vs USD opaco de los lideres), pago **QR/BCP**, **soporte humano en espanol** (el motivo #1 de abandono de la competencia es soporte que empeora). Barato de dar, decisivo para el boliviano.

### Secundarios / expansion (no lideran; retienen o suben ticket)
- **Todo-en-uno** -> es RETENCION/lock-in (la retencion sube fuerte con 4+ productos activos), no gancho dia 1. Vender "encendes lo que necesitas", no "9 modulos".
- **Crecimiento integrado** (ONIA da web + captacion/ads + contenido) -> upsell, no cierre inicial.
- **Velocidad "operando en un dia"** -> des-riesgador transversal (la facilidad de uso pesa MAS para el chico; activar en las primeras 24h convierte 2,3x).

### Nicho / con cuidado (NO liderar)
- **Privacidad / on-premise** -> me contradigo a mi mismo con evidencia: para la clinica chica NO mueve la aguja (prefiere cloud, no tiene TI). El reencuadre que SI vende en Bolivia es el mismo motor como **"funciona sin internet/luz" (continuidad operativa)**. Como privacidad, guardarlo de reaseguro ("tus datos son tuyos"), no de punta de lanza.
- **IA clinica** -> siempre ASISTIVA + con aprobacion (borrador de plan, timing de recall), NUNCA diagnostico ni lectura de radiografias (YMYL/regulatorio).

**[VERIFICAR] antes de vender como hecho:** penetracion exacta de WhatsApp en Bolivia; magnitudes de ingreso recalculadas al ticket odontologico boliviano en Bs; tasas reales de no-show/atricion en clinicas bolivianas; a que grupo SIAT pertenece cada clinica (define si el gatillo es hoy o inminente).

## 3. Orden de construccion (la ultima milla, por fases)

Ordenado por impacto de venta + dependencias:

- **Fase 1 - Fiscal (el wedge de venta):** decidir la migracion de factura -> OniaInvoicing -> **cablear el emisor SIAT** -> hacer visible el **Contador Pack**. Con esto DentalGest cumple la ley = argumento #1. *Bloqueo humano: NIT/credenciales del piloto (S2), no codigo.*
- **Fase 2 - Agentes (el diferenciador demoable):** **runtime de agentes** sobre el modulo agents (empezar por **Recall + Cobrador** = mayor ROI), con aprobacion en /pending. Es lo que se muestra en la demo y cierra la venta.
- **Fase 3 - Privacidad + ultima milla UI:** empaquetar el **on-premise + politica de privacidad** como argumento de venta; collab en factura; form de alerta medica; SavedView en mas listas.
- **Fase 4 - Delices dentales:** treatment_plan + informed_consent primero (venta/legal), luego perio_chart / dental_lab_case / tooth_image.

### Estado de ejecucion (2026-07-23) — Fase Agentes ARRANCADA

Se prioriza la **Fase Agentes (motor de ingresos)** como primer entregable demoable (el diferenciador #1 validado). Estado:

- **Paso 1 HECHO — motor reusable en el core (en `main`, commit `0b4bc667`, core 503->519 tests).** `onia-core/modules/agents.logic.mjs` ya trae el cerebro: `evaluateRecallCandidates` (reactivacion), `evaluateCollectorCandidates` (cobranza, moneda BOB), `planAgentRun` (orquesta candidatos->acciones: dedupe cross/intra-run, tope por corrida, guardrails, `routeAction`). `draft_message` SIEMPRE a la cola de aprobacion. Generico (dental/estetica/veterinaria/gestios): se construyo en el core a proposito porque VUELVE a todo SaaS.
- **Paso 2 EN CURSO — adapter en el repo DentalGest** (worktree `feat/onia-agents-adapter`). Mapa de integracion real (auditado):
  - **Recall:** derivar `lastVisitAt` de `Appointment.dateTime` con `status=COMPLETADA`; `hasFutureAppointment` = existe cita futura PENDIENTE/CONFIRMADA; opt-out = `Patient.emailOptOut` (proxy; no hay opt-out WhatsApp); sin `lastContactedAt` (el dedupe de la cola cubre el cooldown).
  - **Cobrador:** factura **bespoke `Invoice`** (la del core `OniaInvoicingInvoice` no tiene `dueDate`/saldo); `balanceDue = total - Σpagos`; "vencido" por `dueDate < now` sobre ENVIADA/COBRO_MANUAL (NO por estado VENCIDA, que solo marca n8n).
  - **Cola:** `OniaCoreApprovalRequest` (generica del core) + `lib/onia-core/collab.ts`; el borrador va en `metadata.draftBody`. `requestedByProfileId` es NOT NULL -> se usa el Profile admin de la org.
  - **Runner:** patron del cron `onia-core-workitems` + `lib/onia-core/generators.ts` (ya escanea Appointment/Invoice y encola con dedupe). Cliente WhatsApp `lib/whatsapp.ts` YA existe; envio = STUB hasta token S6.
- **DECISION (criterio propio): dos caminos.**
  - **MINIMO (ahora, sin migracion):** reusa la cola de aprobacion como registro; el dedupe pending = idempotencia; NO crea tablas => NO dispara el gate de adopcion (`installInProductRepos:false`) ni toca la DB desplegada. Demoable ya. Es subconjunto ESTRICTO del completo (nada se tira).
  - **COMPLETO (fase 2, requiere OK de Sergio):** migrar `onia_agents_*` (agent/agent_run/agent_action) => historial de corridas real ("agente corrio 6am, propuso 12, aprobaste 8") + idempotencia por `agentActionKey`. Migrar la DB desplegada de un cliente = decision de negocio, no se hace autonomo.
- **El pitch NO depende del token WhatsApp (S6):** el demo es "el agente encontro N pacientes que no volvieron / con saldo vencido y ya redacto los mensajes — esperan tu OK". Borrador + cola de aprobacion = 100% demoable hoy; el envio se cablea en S6.

## 4. La decision grande (de Sergio)

El schema de DentalGest tiene **los dos mundos**: la factura bespoke Invoice (que usa la app hoy) y la del core OniaInvoicingInvoice (dormida, pero con TODOS los campos SIAT). Recomendacion de la auditoria:
- **Migrar SOLO facturacion** al core (es la puerta del SIAT, el diferenciador fiscal).
- **Dejar inventario y cobros bespoke** (una clinica no necesita el commerce completo: almacenes/price-lists/quotes/orders = sobre-ingenieria para el rubro).
- **Contabilidad**: mantener el resumen derivado + RCV export; activar OniaAccounting* solo cuando un cliente pida libro mayor real.

Otras decisiones/[VERIFICAR]: token productivo WhatsApp/IG (S6) para portal/recordatorios; formato vigente de la historia clinica del Min. de Salud (para el modo Bolivia); precio de lista del Contador Pack.

---

_A continuacion, el detalle de las 3 investigaciones (gap audit, foso diferenciador, competencia) que sustentan esta estructura._

---

## GAP AUDIT — DentalGest (`C:\dev\proyectos\DentaGest\dental-saas`)

Rama auditada: `feat/onia-dental-medical-alert`. Schema real: `prisma/schema.prisma` (1465 líneas, 40+ modelos). 54 archivos de test. Auditoría por lectura directa (Glob/Grep/Read), sin escribir en el repo.

**Titular:** DentalGest está mucho más adoptado de lo que sugiere el brief. La lógica del core (`lib/onia-core/`) está portada Y buena parte de la UI colaborativa YA existe y está cableada. Los gaps reales son: (a) collab en la pantalla de **factura** (no de paciente), (b) **form de crear** alerta médica (el POST existe, la UI no), (c) los **5 entities dentales** restantes, (d) el **cableado SIAT** (emisor listo, nadie lo llama), y (e) una **decisión** sobre los modelos core de facturación que hoy están en el schema pero dormidos.

---

### 1. UI colaborativa / roles / vistas guardadas

| Función | Estado | Evidencia |
|---|---|---|
| Comentarios + documentos en pantalla de **paciente** | **EXISTS** | `components/patients/PatientCollab.tsx` (crea comentarios con hilos/respuestas + visibilidad por rol, sube y descarga documentos) cableado en `app/(dashboard)/patients/[id]/page.tsx:404` |
| Cola de **aprobaciones** + work-items (decidir/avanzar) | **EXISTS** | `app/(dashboard)/pending/pending-client.tsx` (PATCH a `/api/onia-core/approvals` y `/work-items`) |
| **Selector de vistas guardadas** | **EXISTS pero acotado** | `app/(dashboard)/pending/SavedViewSelector.tsx` — solo en `/pending`. NO está en listas de pacientes, facturación ni inventario |
| Admin de **roles finos** | **EXISTS (completo)** | `app/(dashboard)/team/roles/RolesClient.tsx` = matriz miembros × 5 role keys (dueño/doctor/recepción/caja/asistente) con 10 permisos (`lib/onia-core/roles.ts`: `clinical/finance/agenda/inventory/config/approvals`), soporta `scopeType/scopeId` |
| Collab (comentarios/docs/aprobaciones) en pantalla de **factura** | **GAP** | `app/(dashboard)/billing/[id]/page.tsx` NO importa nada de onia-core (solo `InvoiceActions`, `PaymentModal`). El componente collab es reusable pero está atado a `patientId` |
| **Form de crear** alerta médica | **GAP** | POST existe (`app/api/patients/[id]/medical-alerts/route.ts`) pero ningún `.tsx` lo llama; la pantalla de paciente solo **muestra** las alertas (read-only, `page.tsx:168-215`) |
| **Solicitar** una aprobación desde UI (paciente/factura) | **DECIDIR** | Hoy las aprobaciones las genera el layer de agentes (`routeAction`) y solo se **deciden** en `/pending`. No hay botón "pedir aprobación" manual. Si el flujo humano necesita escalar a mano → gap; si solo las crean los agentes → por diseño |

**Corolario clave:** la infraestructura collab del core (comentarios/documentos/aprobaciones/vistas genéricas por `entityType/entityId`) ya está viva. Extenderla a facturas es **cablear un componente que ya existe a otra entidad**, no construir de cero.

---

### 2. Adopción de módulos del core — bespoke vs core (LA decisión grande)

El schema tiene **los DOS mundos** conviviendo:

| Dominio | Modelo bespoke (lo que usa la app HOY) | Modelo core (existe en schema, **dormido**) |
|---|---|---|
| Facturación | `Invoice` / `InvoiceItem` (`schema:537-591`) — usado por `app/(dashboard)/billing/**`, `accounting/page.tsx`, `app/api/invoices/` | `OniaInvoicingInvoice` / `...Line` / `...CreditDebitNote` (`schema:1176-1250`) |
| Cobros | `Payment` (`schema:593-611`) | `OniaCommercePayment` (`schema:1151`) |
| Inventario | `InventoryItem` / `InventoryMovement` (`schema:486-535`) — usado por `app/(dashboard)/inventory/`, `app/api/inventory/` | `OniaCommerceProduct/Warehouse/StockItem/StockMovement/PriceList/Quote/Order` (`schema:955-1173`) |
| Contabilidad | (ninguno; hay `lib/fiscal/rcv-export` + `accounting/page.tsx` derivado de facturas) | `OniaAccountingAccount/JournalEntry/TaxRate/TaxDeclaration/RcvRecord/Withholding/FixedAsset` (`schema:1251-1444`) |

**Hallazgo verificado:** `grep` de `prisma.oniaCommerce|oniaInvoicing|oniaAccounting` en `app/` y `lib/` (excluyendo tests) → **cero resultados**. Los modelos core están migrados como tablas pero **ningún código de app los lee/escribe**. Son tablas fantasma.

**Trade-off real (no dogma):**
- **A favor de migrar facturación → `OniaInvoicingInvoice`:** el modelo core **ya trae todos los campos SIAT** (`cuf`, `cufd`, `cuis`, `controlCode`, `authorizationNumber`, `qrUrl`, `legend`, `modality`, `pointOfSaleCode`, `economicActivityCode`). El bespoke `Invoice` **no tiene NINGUNO** (solo subtotal/tax/total/status). Para emitir factura fiscal real necesitás esos campos → o migrás al core, o le agregás 8 columnas al bespoke (duplicando el core).
- **A favor de dejar bespoke:** la app entera (billing, print, recurring, payment modal, accounting, cron recurring-invoices, plan-limits) ya funciona sobre `Invoice`. Migrar toca ~10 rutas + UI + migración de datos de pilotos.
- **Recomendación de auditoría:** migrar **solo facturación** (Invoice→OniaInvoicing) porque es la puerta del SIAT y el diferenciador fiscal. **Inventario y cobros dejarlos bespoke** por ahora (una clínica dental no necesita el commerce completo — almacenes/price lists/quotes/orders son sobre-ingeniería para el rubro). Contabilidad: mantener el resumen derivado + RCV export; activar `OniaAccounting*` solo cuando haya cliente que pida libro mayor real. → **Decisión de Sergio.**

---

### 3. Cableado del emisor SIAT

| Ítem | Estado | Evidencia |
|---|---|---|
| Emisor SIAT completo | **EXISTS (fuera del repo dental)** | `hermes-content/integrations/siat/src/` = `emitter.mjs`, `soap-client.mjs`, `cuf.mjs`, `xml-builder.mjs`, `emission-state.mjs`, `tenant-registry.mjs`, `scheduler.mjs`, `contingencia.mjs` + 12 tests. `external_gate`. |
| Uso del emisor desde DentalGest | **GAP (cero)** | Ningún import ni fetch al emisor. La página de contabilidad tiene una tarjeta informativa "SIAT / facturación en línea" que dice explícitamente que **"No reemplaza SIAT"** (`accounting/page.tsx:137,160`) |
| Fiscal propio del repo | **Parcial (no oficial)** | `lib/fiscal/rcv-export.ts` = export para el contador, **no** el RCV oficial; `lib/fiscal/tax-calendar.ts` = calendario. CUF en `lib/onia-core/modules/invoicing-logic.ts` es **referencia** ("NO usar para emitir un CUF real sin verificar contra el Anexo Técnico") |

**Camino de cableado (secuencial, depende de §2):** (1) migrar factura al modelo core con campos SIAT → (2) al confirmar factura, `app/api/invoices` llama al emisor (`integrations/siat/emitter`) como servicio compartido → (3) persistir `cuf/controlCode/qrUrl/authorizationNumber` → (4) `print/invoice/[id]` renderiza QR + leyenda fiscal. Bloqueo humano real: **NIT/credenciales SIAT del piloto** (S2 en el plan de carriles), no código.

---

### 4. Extensiones dentales (6 de `onia-core/vertical-extensions.json`)

Ya existen en el producto (**NO son gap**): `Patient`, `ClinicalRecord`, `ToothRecord` (odontograma, numeración Universal 1-32, 7 estados), `PatientTreatment`, `Prescription`.

| Entity dental | Estado en DentalGest | Evidencia |
|---|---|---|
| `medical_alert` (MedicalAlert) | **PARCIAL** — modelo + API GET/POST + display; falta **form de crear** | `schema:1446 OniaDentalMedicalAlert`, `app/api/patients/[id]/medical-alerts/route.ts` (GET+POST), display en `patients/[id]/page.tsx:168`. Trabajo en curso en esta rama |
| `perio_chart` (PeriodontalReading) | **GAP** (sin modelo) | no está en el schema |
| `treatment_plan` (TreatmentPlan) | **GAP** (sin modelo) | no está; hoy cada `PatientTreatment` es independiente, sin agrupador con costo total + firma |
| `informed_consent` (InformedConsent) | **GAP** (sin modelo) | no está |
| `dental_lab_case` (DentalLabCase) | **GAP** (sin modelo) | no está |
| `tooth_image` (ToothImage) | **GAP** (sin modelo) | no está; radiografías se podrían adjuntar parcialmente vía `OniaCoreDocument` genérico, pero sin vínculo a pieza/fecha |

**Facilitador:** el core ya tiene el **blueprint reusable** de los 6 en `onia-core/modules/dental.json` + `dental.schema.sql` + `dental.logic.mjs` (status `draft`, `installInProductRepos:false`). La lógica de severidad de la alerta médica se portó de ahí a `lib/onia-core/modules/dental-logic.ts`. Adoptar los otros 5 = mismo patrón que se está usando ahora con medical_alert.

---

### 5. Lo que YA funciona bien (no rehacer)

Auth + roles multi-tenant (`Role` base + roles finos) · dashboard del dueño · pacientes (lista/nuevo/editar/import/detalle) · odontograma · recetas (+ impresión) · tratamientos + catálogo · historia clínica · agenda + citas (`Appointment`, recordatorios cron) · facturación interna bespoke (+ recurrentes + impresión + modal de pago) · inventario + movimientos · resumen contable + RCV export para contador · reportes + balance clínico · equipo + **matriz de roles finos** · `/pending` (aprobaciones + work-items + vistas guardadas) · comunicaciones/WhatsApp · wizard `/setup` · cron 24/7 (`onia-core-workitems`, `appointment-reminders`, `recurring-invoices`) · **PatientCollab** (comentarios + documentos con visibilidad por rol) · 54 archivos de test.

---

### Resumen ejecutable (prioridad para vendible + diferenciado)

1. **[Diferenciador FISCAL]** Migrar factura → `OniaInvoicingInvoice` y **cablear el emisor SIAT** (§2+§3). Es el único bloque que ninguna competencia gratis tiene y desbloquea la venta B2B formal en Bolivia.
2. **[Cierre de UI barato]** Form de **crear alerta médica** (POST ya existe) + extender **collab a la pantalla de factura** + **SavedViewSelector** en más listas. Horas de trabajo, alto impacto percibido.
3. **[Diferenciador CLÍNICO]** Adoptar del blueprint `dental.json`: primero **treatment_plan** (plan con costo + firma = cierra venta al paciente) e **informed_consent** (legal), luego perio_chart / dental_lab_case / tooth_image.
4. **[Decidir]** Inventario/cobros/contabilidad core: dejar dormidos hasta que un cliente lo pida (evitar sobre-ingeniería en rubro dental).

---

## FOSO DIFERENCIADOR — ONIA DentalGest

> Regla mental de esta sección: **hay sistemas dentales gratis/baratos**. Cada función acá existe porque hace algo que un sistema gratis NO puede darle al dentista boliviano, y por eso justifica pagar mensual. El foso no es "más pantallas": es **cumplimiento legal forzado + plata recuperada por IA + datos que no salen de la clínica**.

### Por qué gana a lo gratis (resumen de una línea)

| Eje | Lo gratis da | ONIA da (el foso) | Fuerza de venta |
|---|---|---|---|
| Fiscal/SIAT | nada boliviano | facturación electrónica + Contador Pack incluido | **Máxima** (ley, con fecha) |
| Agentes IA 24/7 | nada | recupera pacientes perdidos, persigue saldos, confirma citas solo | **Máxima** (ROI directo) |
| Privacidad | tus datos en su nube (data-mining) | on-premise: los datos NO salen de la clínica | **Alta** (salud = miedo real) |
| Negocio completo | solo fichas | agenda+finanzas+inventario+planilla+agentes en uno | Alta |
| Delices dentales | odontograma básico | odontograma+perio+consentimiento+portal+alerta médica | Media-alta (lo AMAN usar) |

---

### EJE 1 — FISCAL / SIAT · la venta con pistola en la cabeza (prioridad #1)

El **30-sep-2026** la facturación en línea es obligatoria para nuevos grupos de contribuyentes. Un sistema dental gratis NO emite factura electrónica boliviana. Esto convierte "quiero un sistema" en "**necesito** un sistema antes de esa fecha o no puedo facturar legal". Es el wedge que abre la venta.

**F1 · Emisor de factura electrónica SIAT integrado**
- *Qué es:* la clínica emite factura electrónica (CUF/QR/CAEB, código de comprador, TCO) desde el mismo sistema donde cobra el tratamiento — sin doble carga. Ya construido pre-piloto (`hermes-content/integrations/siat`, `external_gate`), acoplado al módulo `invoicing` del core.
- *El pitch:* "Cumplís la ley del 30-sep sin comprar otro software ni pagar integración aparte. Facturás desde donde ya trabajás." Lo gratis te deja fuera de la ley; ONIA te deja adentro.
- *Capa:* **MÓDULO** (`invoicing` + `tax_bolivia`) + integración SIAT como `external_gate`. Sirve a TODO SaaS boliviano de ONIA, no solo dental.

**F2 · Contador Pack incluido (RCV + calendario de vencimientos por NIT + radar normativo)**
- *Qué es:* exporta el RCV compras/ventas y el resumen IVA/IT listos cada mes, con calendario de vencimientos calculado por el dígito del NIT, y un radar que avisa cambios de RND/DS. Ya definido como INCLUIDO desde el plan Profesional.
- *El pitch:* "**No necesitás un contador caro para lo mensual.** El sistema te arma lo que el contador te cobraría, y te avisa antes de cada vencimiento para que no pagues multa." Reemplaza un costo recurrente del dentista — eso justifica el mensual solo.
- *Capa:* **MÓDULO** (`accounting`/`tax_bolivia`) + rol de agente `radar_normativo`. Cross-rubro boliviano.

**F3 · Agente "cero multas" — avisa vencimientos fiscales antes de que caigan**
- *Qué es:* agente `radar_normativo`/`finanzas` que 24/7 mira el calendario del NIT y levanta un aviso en la cola del dueño N días antes del vencimiento (F-200, IVA/IT, aguinaldo, etc.).
- *El pitch:* "Nunca más una multa por olvido. El sistema te persigue a vos con las fechas, no al revés."
- *Capa:* **MÓDULO** (`agents`, human-in-the-loop) sobre `tax_bolivia`. Cross-rubro.

---

### EJE 2 — AGENTES IA 24/7 · "tu clínica trabaja mientras dormís" (prioridad #1 empatada)

Todo pasa por `routeAction` con **aprobación humana por default**: el agente PROPONE, el dueño aprueba en un tap; solo acciones internas reversibles se auto-ejecutan. Nada le sale al paciente sin que un humano lo suelte. Esto es exactamente lo que un sistema gratis no tiene y lo que devuelve plata medible.

**F4 · Agente Recall inteligente — reactiva pacientes que no vuelven**
- *Qué es:* detecta pacientes sin cita en X meses (control, limpieza semestral, ortodoncia pausada) y redacta el mensaje de reactivación para que el dueño apruebe y salga por WhatsApp.
- *El pitch:* "**La plata más barata está en los pacientes que ya te conocen y no volvieron.** El agente te los trae de vuelta solo. Una limpieza recuperada al mes ya paga el sistema." Este es el ROI más fácil de mostrar en la demo.
- *Capa:* **MÓDULO** (`agents`, acción `draft_message` → aprobación). El criterio "no volvió en 6 meses" (intervalo de recall dental) es config de **EXTENSIÓN DENTAL**; el motor del agente es módulo.

**F5 · Agente Confirmador de citas — baja el ausentismo**
- *Qué es:* el día previo confirma cada cita de la agenda y ofrece reprogramar los "no puedo", liberando el hueco para otro paciente.
- *El pitch:* "Cada silla vacía es plata perdida. El agente confirma y rellena huecos sin que tu recepcionista gaste la mañana llamando."
- *Capa:* **MÓDULO** (`agents` + `schedule` del core). El motor es módulo; la lectura de agenda es core.

**F6 · Agente Cobrador de saldos vencidos (dunning con tacto)**
- *Qué es:* sobre el saldo clínico del paciente (`clinical-balance`, ya en `lib/onia-core`), arma recordatorios escalonados de cuota/saldo vencido para aprobación del dueño; nunca cobra ni contacta sin visto bueno.
- *El pitch:* "Recuperás lo que te deben sin la incomodidad de perseguir vos. El agente redacta, vos aprobás." Convierte cuentas por cobrar dormidas en caja.
- *Capa:* **MÓDULO** (`agents`) sobre saldo de `business_partner`. El concepto "saldo por cobrar + dunning" es candidato a **CORE**/módulo compartido (sirve a todo SaaS que cobra).

**F7 · Agente Presupuestador — arma el plan de tratamiento para firmar**
- *Qué es:* a partir del diagnóstico/odontograma, propone el plan agrupado con costo total (`treatment_plan`) listo para que el paciente lo apruebe/firme una sola vez.
- *El pitch:* "El presupuesto sale en minutos, prolijo y firmado digital — el paciente dice sí más rápido y vos cerrás más tratamientos grandes."
- *Capa:* **MÓDULO** (`agents`) + entidad `treatment_plan` de **EXTENSIÓN DENTAL**.

**F8 · Agente WhatsApp fuera de hora — responde, califica y deriva solo**
- *Qué es:* rol `soporte`: contesta consultas fuera de horario (precios de referencia, ubicación, "atienden urgencias?"), califica al que quiere agendar y deja el caso listo para el equipo. (WhatsApp pagado/token = `external_gate`; [VERIFICAR] token IG/WhatsApp productivo, bloqueo S6.)
- *El pitch:* "No perdés al paciente que escribe a las 10 de la noche. Cuando abrís, ya está calificado y agendado." Es el **chatbot IA add-on** (distinto del botón click-to-chat gratis).
- *Capa:* **MÓDULO** (`agents`, rol soporte). Cross-rubro.

**F9 · Agente Priorizador — el día del dueño ordenado**
- *Qué es:* cada mañana resume qué atender primero (saldos grandes, planes sin firmar, vencimientos, pacientes de riesgo) como `work_item`s priorizados.
- *El pitch:* "Abrís el sistema y ya sabés en qué enfocar la plata y el tiempo hoy. No te ahogás en la operación."
- *Capa:* **MÓDULO** (`agents` + `work_item` del core).

---

### EJE 3 — PRIVACIDAD / CONFIANZA · los datos de salud NO salen de la clínica (prioridad alta)

Datos médicos = miedo real. El diferenciador es poder decir con la verdad técnica: **"tu información no vive en una nube ajena que te la mina; vive donde vos decidís"**. El artefacto ya existe (Modelo C on-premise, `docker-compose.selfhost`).

**F10 · Opción On-Premise / local (los datos adentro de la clínica)**
- *Qué es:* el sistema completo corre en una máquina de la clínica (mini-PC/NUC con Docker), acceso por red local, túnel opcional (Tailscale) solo para soporte. Modelo C, ya construido y ensayado.
- *El pitch:* "**Ninguna nube gringa tiene tus historias clínicas.** Los datos de tus pacientes no salen de tu consultorio. Vos sos el dueño del dato, no nosotros." Para clínicas premium/paranoicas y para cualquiera que integre un sistema local, esto cierra la venta que lo gratis (SaaS-only) jamás puede tocar.
- *Capa:* **CORE** (modelo de despliegue de plataforma, mismo código base para SaaS/VPS/on-prem). Beneficia a todo producto ONIA.

**F11 · Cifrado + campos sensibles + tu propio backup cifrado**
- *Qué es:* historia clínica con cifrado en reposo, y export/backup cifrado que el cliente se lleva a su disco ("tu copia, tu llave"). Nada de lock-in del dato.
- *El pitch:* "Si mañana te vas, te llevás tus datos cifrados. No te secuestramos la información." La portabilidad del dato es confianza que lo gratis no ofrece (te atrapan).
- *Capa:* **CORE** (baseline de seguridad + export). Todo SaaS.

**F12 · Bitácora de acceso a la historia clínica (quién vio/editó qué ficha)**
- *Qué es:* registro de auditoría sobre acceso a datos clínicos — qué miembro abrió qué ficha y cuándo, sobre la entidad `activity` del core.
- *El pitch:* "Sabés quién tocó cada historia. Control interno de verdad — clave para una clínica con varios profesionales y para responder si alguien reclama por sus datos."
- *Capa:* **CORE** (`activity`/audit ya existe). Requisito nace de salud, motor es core.

**F13 · No data-mining, contractual + técnico**
- *Qué es:* compromiso explícito (y arquitectura que lo respalda: en on-prem ni siquiera hay canal) de que ONIA no explota los datos del paciente para nada.
- *El pitch:* "Tu paciente es tuyo. No lo vendemos, no lo perfilamos, no entrenamos nada con él." Diferenciador directo contra el modelo de negocio del software gratis (vos sos el producto).
- *Capa:* **CORE** (política de plataforma).

---

### EJE 4 — NEGOCIO COMPLETO · un sistema, no diez apps sueltas (prioridad alta)

El dentista promedio junta: una app de agenda + un Excel de plata + un cuaderno de insumos + el contador aparte + WhatsApp a mano. ONIA es **todo eso en uno, hablándose entre sí**. Lo gratis solo hace la ficha clínica.

**F14 · Un solo sistema: agenda + finanzas + inventario + planilla + agentes**
- *Qué es:* la composición del core (`schedule`, `accounting`, `commerce`, `payroll`, `agents`) bajo una sola cuenta y un solo login, con los datos cruzados (la cita genera el cobro, el cobro alimenta el RCV, el insumo descuenta stock).
- *El pitch:* "Dejás de saltar entre cinco apps y cargar todo dos veces. Un sistema que se entiende solo: agendás, cobrás, facturás y controlás stock sin re-tipear nada."
- *Capa:* **CORE + MÓDULOS** (composición). El valor es la integración, no una feature nueva.

**F15 · Inventario dental con alerta de stock y vencimiento de insumos**
- *Qué es:* control de resina, anestesia, materiales — con alerta de stock bajo y de **fecha de vencimiento** del insumo (crítico en material clínico caducable).
- *El pitch:* "No te quedás sin anestesia a mitad de semana ni tirás material vencido. El sistema te avisa antes." Ahorro concreto que un cuaderno no da.
- *Capa:* **MÓDULO** (`commerce`/`imports`). El vencimiento de lote sirve a farmacia/gastronomía/dental → módulo, no dental.

**F16 · Planilla + comisión por odontólogo**
- *Qué es:* planilla del personal (Bolivia: bono antigüedad, AFP, RC-IVA, aguinaldo, ya en `payroll`) y liquidación del % que le toca a cada profesional por sus tratamientos.
- *El pitch:* "Pagás a tu equipo y a los odontólogos asociados sin planillas de Excel ni discusiones — el sistema calcula la comisión desde los tratamientos que ya cargó."
- *Capa:* **MÓDULO** (`payroll`) para planilla; la comisión por tratamiento es config de **EXTENSIÓN DENTAL** sobre lógica de comisión genérica (candidata a módulo).

---

### EJE 5 — DELICES DENTALES + EXPERIENCIA · lo que hace que el dentista lo AME usar (prioridad media-alta)

Esto no cierra la venta solo, pero **evita perderla** (paridad con lo que esperan) y genera el "wow, esto está pensado para mí". Varias entidades ya viven en `modules/dental.json` (perio, consentimiento, alerta médica, plan, imagen por pieza) y en el producto (odontograma, prescripción).

**F17 · Odontograma + periodontograma clínicos de verdad**
- *Qué es:* odontograma por pieza (producto) + periodontograma de 6 puntos por diente con sangrado/bolsa/movilidad (`perio_chart`).
- *El pitch:* "Registro clínico serio, no notas sueltas. Ves la boca del paciente evolucionar en el tiempo."
- *Capa:* **EXTENSIÓN DENTAL** (odontograma = producto; `perio_chart` = módulo `dental`).

**F18 · Alerta médica estructurada (alergia/medicación/condición) con banner prominente**
- *Qué es:* alergias y condiciones sistémicas ESTRUCTURADAS con severidad (`medical_alert`), no texto libre, que saltan como aviso visual antes de tratar.
- *El pitch:* "Nunca le das un anestésico a alguien alérgico por no ver una nota perdida. Seguridad del paciente que se ve de un vistazo." Argumento de responsabilidad profesional fuerte.
- *Capa:* hoy **EXTENSIÓN DENTAL** (`medical_alert`); **candidata a MÓDULO clínico compartido** — el patrón sirve a estética/veterinaria/salud (tracks ya previstos en `agents.json`). Marcar para el orquestador.

**F19 · Consentimiento informado digital firmado**
- *Qué es:* consentimiento firmado (paciente + profesional, testigo opcional) antes de procedimiento invasivo (`informed_consent`), como PDF/`document`.
- *El pitch:* "Te cubrís legalmente y das imagen de clínica seria. Firma digital, sin papeles que se pierden." Protección legal = argumento que el dentista entiende al toque.
- *Capa:* hoy **EXTENSIÓN DENTAL** (`informed_consent`); patrón "consentimiento pre-procedimiento" **candidato a MÓDULO clínico** (estética/vet).

**F20 · Portal del paciente**
- *Qué es:* el paciente ve su plan de tratamiento, saldo, próxima cita y sus radiografías desde su celular.
- *El pitch:* "Tu clínica se ve moderna y el paciente deja de llamarte para preguntar '¿cuánto debo?' o '¿cuándo era mi cita?'. Menos fricción, más confianza."
- *Capa:* **MÓDULO** (portal de `business_partner`, cross-rubro) sobre datos de `treatment_plan`/`clinical-balance`.

**F21 · Recordatorios de cita por WhatsApp**
- *Qué es:* recordatorio automático de cita por WhatsApp (motor `automation`/`agents` + envío `external_gate`).
- *El pitch:* "Menos ausencias sin que nadie levante el teléfono. El recordatorio sale solo." (El botón click-to-chat va gratis en la web; el envío automático es el add-on.)
- *Capa:* **MÓDULO** (`automation`/`agents` + WhatsApp external_gate).

**F22 · Historia clínica formato Ministerio de Salud (Bolivia)**
- *Qué es:* ficha clínica que respeta el formato/campos exigidos por normativa boliviana de salud, exportable/imprimible. [VERIFICAR] formato exacto vigente del Ministerio de Salud para odontología.
- *El pitch:* "Tu historia clínica cumple la norma boliviana lista para inspección — no un formato genérico gringo que no te sirve acá."
- *Capa:* **EXTENSIÓN DENTAL** (formato Bolivia-específico) sobre `ClinicalRecord` del producto.

---

### Qué le devuelve DentalGest al CORE (regla dura de ONIA)

Todo lo que se construya en dental pero sirva a otro SaaS **sube al core/módulo**, no queda atrapado en dental:

- **Al CORE:** on-premise/deployment (F10), cifrado+backup+propiedad del dato (F11), bitácora de acceso/audit (F12), no-data-mining (F13), saldo por cobrar + dunning (base de F6).
- **A MÓDULOS (varios rubros):** motor de agentes con casos recall/confirmación/cobro/soporte (F3–F9), Contador Pack/SIAT (F1–F2), inventario con vencimiento (F15), portal del cliente (F20), recordatorios automation (F21), y — cuando entren estética/vet — **alerta médica estructurada (F18) y consentimiento (F19) promovidos a un módulo clínico compartido**.
- **Queda en EXTENSIÓN DENTAL:** odontograma/periodontograma (F17), plan de tratamiento firmable (F7), historia clínica formato Ministerio (F22), y los intervalos de recall dental que configuran F4.

### Orden recomendado por impacto de venta

| # | Función | Eje | Por qué mueve la compra |
|---|---|---|---|
| 1 | F1 SIAT + F2 Contador Pack | Fiscal | Ley con fecha (30-sep-2026) + reemplaza al contador |
| 2 | F4 Recall + F6 Cobrador | Agentes | ROI demostrable: plata recuperada paga el mensual |
| 3 | F10 On-premise | Privacidad | "Los datos no salen" cierra clínicas que lo gratis no toca |
| 4 | F5 Confirmador + F8 WhatsApp | Agentes | Baja ausentismo y no pierde al que escribe de noche |
| 5 | F14 Negocio completo | Completo | Un sistema vs. diez apps sueltas |
| 6 | F18/F19/F17 clínicos | Delices | Evitan perder la venta; generan el "está pensado para mí" |

---

## Baseline de Competencia: qué es table-stakes y dónde se gana

Objetivo de esta sección: saber qué DEBE tener DentalGest para que el dentista boliviano "ni lo mire mal" (piso competitivo), qué cobran los demás, y dónde hay hueco real para que ONIA cobre y gane. Todo aterrizado al comprador: dentista dueño de clínica chica/mediana en Bolivia.

---

### 1) Funciones ESTÁNDAR (table-stakes — sin esto no entrás a la conversación)

Estas las tiene casi todo competidor serio (Dentalink, Dentiqa, Doctocliq, Dendoo, Citalo, Open Dental). Son piso, no diferenciador.

| Función | Qué esperan que haga | Quién lo tiene |
|---|---|---|
| Agenda / calendario visual | Multi-profesional, bloques por tipo de atención (limpieza, conducto, extracción), colores | Todos |
| Reserva online 24/7 | Paciente reserva desde web/WhatsApp/redes; muestra tratamientos y precios | Dentalink, Citalo, Dentiqa, apps de turnos |
| Recordatorios automáticos | WhatsApp/SMS 24h + 2h antes; reduce inasistencia ~40% | Dentalink, Dentiqa, Citalo (WhatsApp), Doctocliq |
| Ficha / historia clínica digital | Antecedentes, notas por sesión, adjuntos, consentimientos | Todos |
| **Odontograma interactivo** | Registrar lesiones/estados por diente, ligado a diagnóstico y presupuesto | Todos los serios; muchos con periodontograma |
| Periodontograma | Registro periodontal en línea | Dentalink, xDental, Dentiqa |
| Presupuestos + planes de tratamiento | Presupuesto ligado al odontograma; el diagnóstico auto-asigna tratamiento | Dentalink, Doctocliq, Historia Dental |
| Pagos / caja / cobros en cuotas | Caja, abonos, seguimiento de saldos, pago en línea | Dentalink, Citalo, Doctocliq |
| Facturación / impresión de comprobante | Emitir comprobante interno (NO fiscal en la mayoría LatAm) | Casi todos (interna) |
| Reportes básicos | Producción, ingresos, comisiones por profesional | Dentalink, Doctocliq |
| Multi-profesional / multi-sede | Horarios por médico, varias sucursales | Dentalink, Citalo, Doctocliq |
| Recetas / e-firma | Recetas y firma digital de consentimientos | Dentiqa, varios |

Conclusión del bloque: **odontograma + agenda + recordatorio WhatsApp + presupuesto ligado a tratamiento + caja = el "cover charge".** DentalGest ya cubre esto (agenda, odontograma, recetas, tratamientos, facturación interna, recordatorios vía core/automation). No es donde se diferencia.

---

### 2) Qué COBRAN y qué dan GRATIS

Rangos en USD/mes. Precios de líderes LatAm NO son públicos (piden cotización) — los montos vienen de reviews de terceros, marcados [VERIFICAR].

| Producto | Modelo | Precio (USD/mes) | Nota |
|---|---|---|---|
| **Dentalink** (líder LatAm, cloud) | Por sede + por profesional; 3 planes (Esencial/Pro/Titanium) | ~29–100 clínica chica; ~100–400 mediana [VERIFICAR] | Precio oculto, "solicita cotización". Curva de aprendizaje de semanas. Sin factura fiscal Bolivia. |
| **Dentiqa** (LatAm, cloud) | 3 planes públicos | 89 / 149 / 249 | Trae chatbot IA por WhatsApp (agenda + consultas). Precio transparente. |
| **Medesk** | Suscripción básica | ~10 | Médico general con módulo dental; barato. |
| **Historia Dental** (COP) | Suscripción | ~14 (58.500 COP) | Odontograma con diagnóstico automático. |
| **Open Dental** (on-premise / open source) | Software gratis + soporte pago obligatorio para updates | 129–229 por sede | Único on-premise serio. Inglés, US-céntrico, difícil de configurar, sin nada fiscal Bolivia. |
| **Doctocliq** | Freemium (gratis "para siempre" + planes pagos) | Gratis / pago [VERIFICAR] | Agenda + odontograma + presupuestos + caja gratis. LATAM. |
| **Dendoo** | Freemium | Gratis / pago | Agenda, ficha, odontograma, reportes gratis. |
| **Dentaltap / MN Program** | Gratis | 0 | Agenda + charting dental gratis. |
| **Citalo / Turnito / Reservo / ReservaSimple** (Bolivia) | Suscripción (precio no público) | [VERIFICAR] | Enfocados en **reserva/agenda**, no clínica completa. Métodos de pago Bolivia. Sin SIAT, sin contabilidad. |

Lecturas clave:
- **El piso clínico está commoditizado y hay gratis creíble** (Doctocliq, Dendoo, Dentaltap). Vender "otra agenda con odontograma" es pelear contra $0. Confirma el mandato: hay que diferenciarse fuera de las fichas.
- **Los líderes esconden precio y cobran por profesional/sede** → caro y opaco para clínica chica boliviana; además factura en USD (riesgo cambiario, ya señalado como pain en Bolivia).
- **Nadie de estos incluye factura fiscal válida en Bolivia** dentro del sistema dental.
  ⚠️ **Corregido el 2026-09-30 (carril Mercado): ya no se puede afirmar.** **TuDoc** (`tudoc.com.bo`, software
  médico **boliviano**) declara *"agenda, historias clínicas y facturación en línea SIAT en un solo sistema"* y
  *"más de 200 clínicas"* (leído en el extracto del buscador, sin abrir la página; si tiene odontograma no se
  verificó). La frase de arriba vale para los extranjeros de la tabla, no para todo el mercado. Detalle:
  `research/ONIA_MERCADO_COMPETENCIA_BOLIVIA_20260930.md` §3.

---

### 3) HUECOS de la competencia = oportunidad ONIA

Marcados con nivel de defensa: 🟢 nadie lo hace bien en Bolivia (foso real) · 🟡 existe suelto/parcial · 🔵 existe pero mal integrado.

| Hueco | Estado en la competencia | Oportunidad ONIA | Defensa |
|---|---|---|---|
| **Facturación SIAT nativa dentro del dental** | Ningún software dental LatAm/Bolivia la trae integrada. SIAT solo vía ERPs genéricos (Odoo, Facturación Fácil) que NO son dentales. SIAT tiene formato específico "Hospitales-Clínicas" (datos de paciente/médico). | Emitir factura electrónica SIAT válida (CUF/CUFD, firma, XML) desde el mismo flujo de cobro del tratamiento. Emisor ya listo pre-piloto en `hermes-content/integrations/siat`. | 🟢 **Nadie en Bolivia dental.** Foso fiscal + obligatoriedad en línea (facturación electrónica obligatoria camino a 30-sep-2026) fuerza la compra. |
| **IA agentes de verdad (no chatbot tonto)** | Dentiqa y bots de terceros (Wazzy, Dante) = chatbots bolt-on que responden y agendan, aislados del sistema. La industria 2026 habla de "agentic AI" pero en dental sigue siendo chatbot. | Agentes 24/7 human-in-the-loop que ACTÚAN sobre el sistema real (confirman/reprograman, arman presupuesto, siguen morosos) con **cola de aprobación** (`routeAction` del módulo agents). No solo contestar: operar con control humano. | 🔵 Chatbots existen; **agente integrado con aprobación, no.** Diferenciador si se comunica bien. |
| **Privacidad / on-premise real** | Cloud-obligatorio en los líderes LatAm (Dentalink, Dentiqa, Citalo). El único on-premise (Open Dental) es inglés, US-céntrico y sin fiscal Bolivia. Ninguno promete "tus datos no salen / no data-mining". | On-premise/offline-first real: datos del paciente no salen de la clínica, sin minería. Mensaje directo al dentista dueño desconfiado. | 🟢 **Nadie combina on-premise + español + fiscal Bolivia.** |
| **Negocio COMPLETO (no solo fichas)** | Traen inventario de insumos y control de gastos (Dentalink, Doctocliq). Planilla/sueldos: parcial (Doctocliq comisiones). **Contabilidad boliviana (IVA/IT/RC-IVA/aportes/finiquitos): nadie.** | Clínica como empresa: inventario + planilla Bolivia (bono antigüedad, aportes, finiquito) + contabilidad IVA/IT + caja. Módulos payroll/accounting/tax_bolivia/commerce del core ya existen. | 🟡 Inventario/gastos existen; **planilla+contabilidad Bolivia integrada, no.** |
| **Contador Pack** | Inexistente en dental. El dentista arma export para su contador a mano/Excel. | Paquete que le entrega al contador lo que pide (libros IVA compras/ventas, export SIAT, resumen mensual) directo desde el sistema. | 🟢 Nadie. Convierte una fricción mensual en feature de venta. |
| **Precio en Bs, transparente, sin cobro por profesional** | Líderes: precio oculto, en USD, por profesional/sede. | Precio claro en bolivianos, plano por clínica. | 🟡 Ventaja comercial, no técnica. |

---

### 4) Conclusión — lista mínima "a la par" vs diferenciadores "para ganar"

**A LA PAR (obligatorio, o el dentista ni mira). DentalGest ya lo tiene casi todo:**
1. Agenda multi-profesional + reserva online (web/WhatsApp)
2. Odontograma interactivo (+ periodontograma) ligado a diagnóstico
3. Historia clínica digital + recetas + consentimientos
4. Presupuestos / planes de tratamiento ligados al odontograma
5. Recordatorios automáticos WhatsApp (24h/2h)
6. Caja / cobros / cuotas / saldos
7. Reportes de producción por profesional
8. Multi-sede / multi-profesional
9. Comprobante imprimible

**PARA GANAR (foso — esto hace que elija ONIA y pague), ordenado por fuerza para Bolivia:**
1. 🟢 **Factura SIAT nativa** en el flujo de cobro (obligatoriedad fiscal = motivo de compra que los gratis y los líderes cloud NO resuelven). **#1 diferenciador.**
2. 🟢 **On-premise / datos no salen / sin data-mining** — privacidad como bandera contra el cloud-obligatorio.
3. 🟢 **Contador Pack** (libros IVA + export SIAT + resumen) — mata una fricción mensual real.
4. 🔵 **Agentes IA con cola de aprobación** que operan el sistema (no chatbot suelto): recuperación de morosos, confirmación/reprogramación, armado de presupuesto.
5. 🟡 **Negocio completo Bolivia**: planilla (bono antigüedad, aportes, finiquito) + contabilidad IVA/IT + inventario, todo en uno.

Mensaje de venta destilado: *"No es otra agenda con odontograma (eso hay gratis). Es tu clínica como empresa: factura legal en Bolivia, tus datos no salen, agentes que trabajan 24/7 con tu visto bueno, y tu contador contento."*

