# ONIA — Checklist de completitud de rubro (el molde de 7 pasos)

Fuente del molde: `hermes-content/references/video-intake/2026-08-16-nutriapp-modulo-vertical.md`
(NutriApp: la anatomía de cualquier vertical profesional↔cliente, mostrada entera en 78 s).
Verificado contra `onia-core/contract.json` v1.0.0 y `onia-core/schema/base-schema.sql`
(archivo por archivo, no de memoria). Aplicado contra el código real de `onia-platform`
y su registro público en producción (`app.onia.com.bo/register`, leído 2026-08-16).

> Regla que este checklist operacionaliza (CLAUDE.md): *"un rubro nuevo se ENCIENDE
> desde el core, no se escribe de cero"*. Un rubro está COMPLETO cuando los 7 pasos
> están encendidos en producción — no cuando el pack tiene vocabulario.

---

## Los 7 pasos y qué los cubre en el core

| # | Paso | Entidad (base-schema.sql) | Capability (contract.json) | Veredicto |
|---|---|---|---|---|
| 1 | El profesional define un PLAN y lo asigna | `onia_core_work_items` (+type del pack) + `onia_core_process_checklists` + `partnerId` | `work_items` (fase 1) | ✅ Cubierto |
| 2 | El cliente entra con auth PROPIA y ve su plan | **NINGUNA** — `member` es equipo (tiene userId); `contact` y `business_partner` no tienen auth | **ninguna** | 🔴 **FALTA EN EL CORE** — no existe el actor "cliente externo autenticado" |
| 3 | El cliente REGISTRA cumplimiento (incl. foto) | `onia_core_evidence` (kind foto) + `onia_core_documents` | `evidence_activity` | 🟡 La entidad cubre el registro; la CAPTURA por el cliente está bloqueada por el paso 2 |
| 4 | La IA estima y el HUMANO confirma o corrige | `onia_core_approval_requests` | `approvals` + moduleCapability `agents` (cola human-in-the-loop) | ✅ Cubierto — falta ENCENDER en producto (flag `AGENTS_RUNTIME` + entitlement `module.agents`) |
| 5 | Del plan salen ARTEFACTOS derivados | `onia_core_documents` (docType) | `collaboration` | 🟡 El core guarda el artefacto; la DERIVACIÓN (lista de compras, presupuesto por fases) es lógica de producto por rubro — no exige cambio de core |
| 6 | Chat con el contexto del cliente YA cargado | `onia_core_communication_channels` | `channels` + `whatsapp` (external_gate, por diseño) | ✅ Cubierto como gate — la ejecución vive fuera del core (add-on chatbot) |
| 7 | Lo delicado ESCALA al humano | `work_items.escalationLevel` + `approval_requests` | `approvals` + guardrails del módulo `agents` | ✅ Cubierto |

**La distinción que importa:** de los 7, **solo el paso 2 falta en el core**. Los otros
6 tienen entidad+capability; lo que falta es encenderlos (o cablear la lógica de
producto que los usa). El paso 2 es un cambio aditivo real al contrato: un actor
externo con auth (portal del cliente) que hoy no existe ni como entidad ni como
capability. Hoy lo más cercano en el producto es el magic-link por cita
(`Appointment.bookingToken`), que no es un portal: no hay sesión, no hay plan visible,
no hay registro de cumplimiento.

## Checklist aplicado a los rubros vendibles (estado HOY)

Rubros vendibles = los 5 activos del registro público (verificado contra
`app/(auth)/register/page.tsx` Y contra el HTML servido en producción, que coinciden).
Veterinaria y ganadería están apagadas con motivo escrito en el código; gastronomía
es chip "Pronto".

✅ encendido y usable · 🟡 construido parcial o detrás de flag/add-on · ❌ no existe

| Paso | Dental | Estética | Serv. profesionales | Comercio | Importadora |
|---|---|---|---|---|---|
| 1 Plan asignado | ✅ Treatment/PatientTreatment + tipos del pack | ✅ (reusa pantallas clínicas) | 🟡 agenda+citas sí; "plan por cliente" no | ❌ no aplica plan (venta mostrador) | 🟡 cotización B2B ≈ propuesta |
| 2 Portal del cliente con auth | ❌ solo magic-link por cita | ❌ | ❌ | ❌ | ❌ |
| 3 Cliente registra cumplimiento | 🟡 evidencia/archivos los carga el EQUIPO, no el cliente | 🟡 ídem | ❌ | ❌ | ❌ |
| 4 IA estima + humano confirma | 🟡 agents-runtime + cola `/pending` construidos; gateado por `AGENTS_RUNTIME` + entitlement (no verificado encendido en prod) | 🟡 ídem | 🟡 ídem | 🟡 ídem | 🟡 ídem |
| 5 Artefactos derivados | 🟡 presupuesto/factura/receta existen (`app/print/*`); derivación automática desde el plan no | 🟡 ídem | ❌ | ❌ | 🟡 cotización→pedido existe |
| 6 Chat con contexto cargado | 🟡 add-on pago; contexto = clínica+nombre, NO el plan del paciente. Prompt hardcodea "clínica dental" | ❌ el bot es dental | ❌ ídem | ❌ ídem | ❌ ídem |
| 7 Escala al humano | 🟡 bot ESCALATED→Chatwoot + urgencias→teléfono; vive detrás del add-on del paso 6 | ❌ | ❌ | ❌ | ❌ |
| **Encendidos plenos** | **1/7** | **1/7** | **0/7** | **0/7** | **0/7** |

Lecturas honestas:

1. **Ningún rubro tiene el molde completo.** Dental, el más maduro, tiene 1 pleno
   y 5 a medias. El video de NutriApp muestra los 7 andando en una app hecha en
   días — la diferencia no es el core (que ya cubre 6 de 7), es el encendido.
2. **El cuello de botella es el paso 2.** Los pasos 3, 6 y 7 del lado del cliente
   dependen de que el cliente pueda entrar. Sin portal, "registrar cumplimiento",
   "chat con su plan" y "escalar" solo existen por WhatsApp (add-on pago, hoy
   dental-only).
3. **El chatbot está escrito para UN rubro.** `lib/whatsapp-ai.ts` construye
   `PatientContext` y el system prompt dice "una clínica dental" fijo. Para
   estética/servicios/comercio, el paso 6 no es "encender": es des-dentalizar
   el prompt (trabajo chico, pero existe).
4. **El paso 4 está a UNA variable de entorno.** Todo el runtime de agentes con
   cola de aprobación existe y testea; `AGENTS_RUNTIME=1` + entitlement por org
   lo enciende. Es el mejor ratio esfuerzo/completitud de la tabla.

## No verificado en producción (sin cuenta QA — no se creó)

- Valor de `AGENTS_RUNTIME` en el entorno del VPS (¿agentes encendidos en prod?).
- Si alguna organización real tiene el add-on WhatsApp activo (bot operando con cliente).
- Las pantallas logueadas (`/pending`, `/treatments`, `/comercio`) renderizadas en prod.
- Estado de la base self-hosted del VPS (no se consultó).

Lo que SÍ se verificó en prod: el paso de rubros del registro público servido por
`app.onia.com.bo` (HTTP 200, HTML con los 5 rubros activos + Gastronomía como "Pronto").
