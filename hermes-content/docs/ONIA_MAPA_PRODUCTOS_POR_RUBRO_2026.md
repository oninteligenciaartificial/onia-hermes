# Onia — Mapa de Productos por Rubro (2026)

> **Fuente de verdad:** generado a partir de `onia-core/contract.json` **v0.7.1 (beta)**
> + `system-map.mjs` + `report.mjs` + `vertical-extensions.json` + adapters.
> Regenerar la foto técnica: `node onia-core/system-map.mjs` y `node onia-core/report.mjs`.
> Última actualización: 2026-07-21.
>
> **Regla de arquitectura (no romper):** un producto NO es un fork del core. Es
> **1 core + módulos compartidos + pack de rubro + extensiones verticales**, cableado
> por un adapter. Clientes nuevos se mapean a un track vertical, nunca a un fork.

---

## 0. Cómo se arma un producto Onia (las 4 capas)

| Capa | Qué es | Dónde vive | Se comparte entre productos |
|---|---|---|---|
| **1. Core** | Lo que TODA empresa real necesita (quién existe, quién responde, qué está pendiente, evidencia, aprobaciones, agenda, canales) | `onia-core/` contrato congelado | Sí — idéntico en los 4 |
| **2. Módulos** | Add-ons activables SOBRE el core (inventario, contabilidad, factura, planilla, etc.) | `onia-core/modules/` | Sí — reutilizados por rubro |
| **3. Pack de rubro** | Vocabulario del rubro: tipos de trabajo, partners, áreas, checklists, KPIs, canales de intake | `contract.json` → `verticalPacks` | No — 1 pack por rubro |
| **4. Extensiones verticales** | Funciones que SOLO ese rubro necesita (odontograma, hato ganadero, homologación técnica) | `vertical-extensions.json` | No — únicas del rubro |

**Core (v0.7.1):** 18 entidades, 14 capabilities core:
`tenant, team_roles, relationships, work_items, evidence_activity, alerts_reports, data_ops, partners, permissions, collaboration, approvals, scheduling, saved_reporting, channels`.

**Módulos compartidos (7):**

| Módulo | Qué aporta | Rubros que lo usan |
|---|---|---|
| `commerce` | Catálogo, inventario multi-almacén, listas de precio USD/BOB, cotizaciones B2B, venta/caja | 11/11 |
| `accounting` | Plan de cuentas, doble partida, IVA/IT/IUE, RCV, depreciación, retenciones, activo fijo | 11/11 |
| `invoicing` | Factura electrónica Bolivia (CUF, QR, notas crédito/débito) — emisión real = external_gate SIAT | 11/11 |
| `payroll` | Planilla Bolivia (AFP Gestora Pública, RC-IVA, aguinaldo, finiquito, indemnización) | 11/11 |
| `automation` | Reglas declarativas "cuando pasa X → hacer Y" para cualquier negocio | 11/11 |
| `knowledge` | Base de conocimiento / catálogo técnico | 2/11 (ProveeGest) |
| `dental` | Config clínica odontológica | 1/11 (DentalGest) |

> Que `accounting/invoicing/payroll/commerce/automation` los usen **11/11 rubros**
> es la prueba de por qué viven compartidos y no duplicados en cada producto.

---

## 1. Los 4 productos — mapa de funciones y estado

### 🦷 DentalGest — clínica odontológica
- **Track:** `dentagest-clinical` · **Estado core:** `first_beta_active` · **Adapter:** `installing` (9/9 entidades core instaladas)
- **A quién sirve:** clínicas y consultorios dentales. **Usuario principal:** el dueño.
- **Estado real:** **EN VIVO** (`www.dentalgest.app`). Producto PROPIO de Onia (repo git `C:\dev\proyectos\DentaGest\dental-saas`, rama `pricing-ratificado-jul26`; Next.js 16 + Prisma 7 + Postgres). `lib/onia-core/` ya bastante portado (work-items, intake, roles, collab, schedule, bridge…).
- **Módulos:** commerce · accounting · invoicing · payroll · automation · **dental**
- **Funciones propias del rubro (11):**
  - ✅ Implementadas: `patient` (`Patient`), `clinical_record` (`ClinicalRecord`), `patient_treatment` (`PatientTreatment`), `prescription` (`Prescription`), `odontogram_entry` (`ToothRecord`, numeración Universal 1-32, versión simple por diente)
  - ⛔ Gaps confirmados ausentes: `perio_chart`, `treatment_plan`, `informed_consent`\*, `medical_alert`\*, `dental_lab_case`\*, `tooth_image` (\* = hoy hay un workaround genérico: `informed_consent`→`OniaCoreDocument`, `medical_alert`→`Patient.allergies` texto libre, `dental_lab_case`→`BusinessPartner` tipo laboratorio)
- **Bloqueo externo:** SIAT (emisión fiscal real — campos `cuf/cufd/cuis` quedan NULL hasta el gate)
- **Adopción de módulos:** R6 ya adoptó `commerce`/`invoicing`/`accounting` de forma **ADITIVA** (schema `OniaCommerce*`/`OniaInvoicing*`/`OniaAccounting*` + lógica portada a `lib/onia-core/modules/`, commits `d4332a0`/`b7544ea`/`96b89a9`). Los flujos de facturación TODAVÍA usan `Invoice`/`Payment` bespoke → **migrar los flujos es un carril aparte y pesado (datos), NO el próximo paso barato**. El módulo `dental` aún NO está adoptado.
- **Siguiente paso de desarrollo (recomendado):** cerrar los 6 gaps dentales como **ports estilo R6** del módulo dental que el core YA trae listo (`onia-core/modules/dental.json` + `dental.schema.sql` + `dental.logic.mjs` con lógica pura + tests). **Primero `medical_alert`** (mayor valor clínico = seguridad del paciente, menor riesgo = schema más simple sin diente/estado/storage, lógica ya lista para portar, y **lo reutilizan EsteticaGest + VetGest**). Requiere OK de adopción de Sergio (`policy.installInProductRepos=false` para dental, igual que R6).

### 🏪 GestiOS — sistema general de gestión (pyme)
- **Track:** `gestios-general` · **Estado core:** `pending_adoption` · **Adapter:** `installing` (0 entidades instaladas en código)
- **A quién sirve:** pymes de comercio/servicios en general. Es la **base horizontal** (sin funciones exclusivas de un rubro).
- **Estado real:** aprobado 2026-07-07, repo propio `C:\dev\proyectos\Gestios`. **El core YA está en la DB Supabase (9 tablas `onia_core_*` con datos) pero HUÉRFANO del código** (schema.prisma con 0 modelos, sin `lib/onia-core`). **RLS OFF en 15 tablas (crítico).** → Sprint 0 = reconciliar, no instalar de cero.
- **Módulos:** commerce · accounting · invoicing · payroll · automation
- **Funciones propias del rubro:** 0 (es el tronco). Los skins añaden lo suyo (ver §3).
- **Bloqueo externo:** WhatsApp, SIAT
- **Siguiente paso de desarrollo:** Sprint 0 = reconciliar Prisma↔Supabase, prender RLS, cablear `lib/onia-core`; luego persistir kardex + modelos commerce.

### ⚡ ProveeGest — distribución B2B multi-rubro
- **Track:** `proveegest-electrico` (primer skin) · **Estado core:** `planned_after_core` · **Adapter cliente (Bolivian Electric):** `installing`, 0 instaladas, mayoría `planned`
- **A quién sirve:** distribuidoras/importadoras B2B. Eléctrico es el **primer skin**; el patrón sirve a ferretería/construcción, etc.
- **Estado real:** **NO tiene repo de producto propio todavía.** Bolivian Electric es el **CLIENTE** que valida el patrón (repo del cliente en su VPS — **NO se toca desde acá**).
- **Módulos:** commerce (catálogo + cotizaciones B2B) · **knowledge** · accounting · invoicing · payroll · automation
- **Funciones propias del rubro (3):** `product_homologation`, `landed_cost_calculation` (costo puesto en Bolivia: CIF→GA→IVA import→logística), `technical_catalog_spec`
- **Bloqueo externo:** WhatsApp, **TR4** (ERP local del cliente, puente por export/adapter), SIAT
- **Siguiente paso de desarrollo:** crear el repo de producto ProveeGest (distinto del repo cliente BE) y adoptar core + commerce + knowledge.

### 🐄 Ganadero OS — gestión ganadera offline-first
- **Track:** `ganadero-offline` · **Estado core:** `pending_adoption` · **Adapter:** `mapped_not_installed` (0 instaladas)
- **A quién sirve:** productores ganaderos; **offline-first** (campo sin conexión).
- **Estado real:** repo `C:\dev\proyectos\Ganaderos-Os` **en riesgo (sin git)**. No tiene modelos Product/Order/Invoice (gap real de commerce).
- **Módulos:** commerce · accounting · invoicing · payroll · automation
- **Funciones propias del rubro (10):** `animal_identifier` (SINTRABOL/SENASAG), `herd` (lote de manejo), `herd_pasture_assignment`, `lifecycle_category`, `vaccination_campaign` (PRONEFA aftosa/brucelosis), `brand_registration` (marca/hierro CONGABOL), `genealogy` (ASOCEBU), `movement_guide` (guía de movimiento animal), `premises_registration` (RUNSA), `weaning_event`
- **Bloqueo externo:** WhatsApp, SIAT
- **Siguiente paso de desarrollo:** rescatar el repo (poner bajo git) + resolver sincronización offline antes de instalar el core.

---

## 2. Tabla de madurez / listo-para-desarrollar

| Producto | Track | Core en código | Módulos adoptados | Funciones rubro | Repo | Riesgo de arranque |
|---|---|---|---|---|---|---|
| **DentalGest** | dentagest-clinical | ✅ 9/9 (vive) | commerce/invoicing/accounting aditivos (R6); dental pendiente | 5/11 ✅, 6 gaps | propio, legible | **Bajo** (ya vive) |
| **GestiOS** | gestios-general | ⚠️ en DB, huérfano del código | 0 | 0 (tronco) | propio, legible | **Medio** (Sprint 0 reconciliar + RLS) |
| **ProveeGest** | proveegest-electrico | ❌ (solo cliente BE) | 0 | 0/3 | **falta crear repo** | **Alto** (repo nuevo + TR4) |
| **Ganadero OS** | ganadero-offline | ❌ | 0 | 0/10 | **sin git (en riesgo)** | **Alto** (rescate + offline) |

---

## 3. Rubros / skins futuros (mismo core, packs ya definidos)

Ya tienen pack de vocabulario en el contrato (roadmap, sin producto todavía):

- **GestiOS** skins: `gastronomia` (ingredient, table), `servicios-profesionales`, `educacion`, `turismo` — todos `roadmap`.
- **ProveeGest** skin: `construccion` (work_order) — `roadmap`.
- **EsteticaGest** (`esteticagest-clinical`): treatment_progress_photo, session_package — `roadmap`.
- **VetGest** (`vetgest-clinical`): pet_identifier, pet_vaccination_record, hospitalization_stay — `roadmap`.

> Onboardear un rubro nuevo = agregar track + pack (**datos**), no código de core.

---

## 4. Bloqueos transversales (external_gate) — quién los destraba

| Bloqueo | Afecta | Estado / dueño |
|---|---|---|
| **SIAT** (factura electrónica) | los 4 | Portal SIAT activo (facturación manual); certificación como sistema proveedor + NIT Onia = pendiente Sergio |
| **WhatsApp** | GestiOS, ProveeGest, Ganadero | Meta business verification / token (bloqueo S5/S6) |
| **TR4** | ProveeGest (BE) | Puente por export/adapter (ERP local del cliente, solo lectura) |

---

## 5. Secuencia de desarrollo — propuesta (a ratificar con Sergio)

> El **orden** es decisión de negocio de Sergio. Recomendación por menor riesgo /
> mayor retorno visible, apoyada en el estado real de arriba:

1. **DentalGest** — ya vive; cerrar gaps dentales + adopción formal de módulos. Progreso visible rápido, riesgo bajo.
2. **GestiOS** — aprobado y con baseline ya diagnosticado; Sprint 0 (reconciliar + RLS) es un primer paso acotado y claro.
3. **ProveeGest** — crear el repo de producto (hay cliente real BE validando el patrón); mayor setup.
4. **Ganadero OS** — rescatar el repo (git) y resolver offline antes de instalar el core.

**Cada producto se desarrolla como un carril aislado** (1 sesión = 1 worktree = 1 repo),
orquestado desde la sesión de control. Ver `COORDINATION_MANIFEST.md` y el modelo de carriles.
