# ONIA — Checklist de completitud de rubro (el molde de 7 pasos)

Fuente del molde: `hermes-content/references/video-intake/2026-08-16-nutriapp-modulo-vertical.md`
(NutriApp: la anatomía de cualquier vertical profesional↔cliente, mostrada entera en 78 s).
Verificado contra `onia-core/contract.json` v1.0.0 y `onia-core/schema/base-schema.sql`
(archivo por archivo, no de memoria). Aplicado contra el código real de `onia-platform`
(master = `origin/master`, commit `b1aa4ec`) y contra producción. **Última pasada completa:
2026-08-20.**

Cómo se verificó cada celda (la letra acompaña a cada veredicto):

- **[C]** código de `onia-platform` leído en esta pasada (rutas citadas).
- **[P]** producción MIRADA renderizada: Playwright + Chromium headless contra
  `app.onia.com.bo`, capturas leídas (register, `/book`, `/book/<org>`), 2026-08-20.
- **[D]** doc de verificación propio que midió el sistema correcto, citado con fecha
  (no re-medido en esta pasada).

> Regla que este checklist operacionaliza (CLAUDE.md): *"un rubro nuevo se ENCIENDE
> desde el core, no se escribe de cero"*. Un rubro está COMPLETO cuando los 7 pasos
> están encendidos en producción — no cuando el pack tiene vocabulario.

---

## Los 7 pasos y qué los cubre en el core

| # | Paso | Entidad (base-schema.sql) | Capability (contract.json) | Veredicto |
|---|---|---|---|---|
| 1 | El profesional define un PLAN y lo asigna | `onia_core_work_items` (+type del pack) + `onia_core_process_checklists` + `partner_id` | `work_items` (fase 1) | ✅ Cubierto |
| 2 | El cliente entra con auth PROPIA y ve su plan | **NINGUNA** — `member` es equipo (tiene `userId`); `contact` y `business_partner` no tienen auth (requiredFields verificados: sin userId) | **ninguna** | 🔴 **FALTA EN EL CORE** — no existe el actor "cliente externo autenticado" |
| 3 | El cliente REGISTRA cumplimiento (incl. foto) | `onia_core_evidence` (`kind`) + `onia_core_documents` | `evidence_activity` | 🟡 La entidad cubre el registro; la CAPTURA por el cliente está bloqueada por el paso 2 |
| 4 | La IA estima y el HUMANO confirma o corrige | `onia_core_approval_requests` | `approvals` (fase 2) + moduleCapability `agents` (cola human-in-the-loop) | ✅ Cubierto — **y ya ENCENDIDO en producción** (ver tabla por rubro) |
| 5 | Del plan salen ARTEFACTOS derivados | `onia_core_documents` (docType) | `collaboration` (fase 2) | 🟡 El core guarda el artefacto; la DERIVACIÓN (lista de compras, presupuesto por fases) es lógica de producto por rubro — no exige cambio de core |
| 6 | Chat con el contexto del cliente YA cargado | `onia_core_communication_channels` | `channels` (fase 1) + `knowledge_base` (fase 4, vertical_extension, sin entidad core: la fila vive en el producto, `ChatbotKnowledge`) + `whatsapp` (fase 5, external_gate) | 🟡 Cubierto como gate. OJO: lo vivo hoy es contexto de la **ORG** (conocimiento editable), no del **CLIENTE individual** (su plan) — el molde pide lo segundo |
| 7 | Lo delicado ESCALA al humano | `work_items.escalation_level` (línea 72 del schema) + `approval_requests` | `approvals` + guardrails del módulo `agents` | ✅ Cubierto |

**La distinción que importa:** de los 7, **solo el paso 2 falta en el core**. Los otros
6 tienen entidad+capability. El paso 2 es un cambio aditivo real al contrato: un actor
externo con auth (portal del cliente) que no existe ni como entidad ni como capability.
Lo más cercano en el producto HOY ya no es solo el magic-link por cita: es el **booking
público** (`app/(public)/book/*`, add-on `publicBookingAddon` o plan Professional/Clinic,
gate en `lib/plan-limits.ts:493-516`) + la vista **"mis citas" por token**
(`/book/my-appointments/[token]`). Sigue sin ser un portal: no hay sesión propia, no se
ve un plan, no se registra cumplimiento. [C][P]

## Checklist aplicado a los rubros vendibles (estado 2026-08-20)

Rubros vendibles = los 5 activos del registro público. Verificado [C] contra
`app/(auth)/register/page.tsx` (`RUBROS_ACTIVOS`: dental, comercio, importadora,
estética, servicios profesionales; veterinaria y ganadería apagadas con motivo escrito;
Gastronomía/Construcción/Educación/Turismo como "MUY PRONTO") **y** [P] mirado
renderizado en `app.onia.com.bo/register` (captura: 5 cards + 4 chips, iconos como
iconos). Código y producción coinciden.

✅ encendido y usable en producción · 🟡 construido parcial o detrás de flag/add-on · ❌ no existe

| Paso | Dental | Estética | Serv. profesionales | Comercio | Importadora |
|---|---|---|---|---|---|
| 1 Plan asignado | ✅ Treatment/PatientTreatment + tipos del pack [C] | ✅ reusa pantallas clínicas [C] | 🟡 agenda+citas sí; "plan por cliente" no [C] | ❌ no aplica plan (venta mostrador) [C] | 🟡 cotización B2B ≈ propuesta [C] |
| 2 Portal del cliente con auth | 🟡 booking público VIVO y MIRADO (`/book` → wizard doctor/fecha/horario/datos) + "mis citas" por token; sin auth propia ni plan visible [C][P] | ❌ el flujo de `/book` es dental (pide "doctor") [C] | ❌ ídem [C] | ❌ y hay FUGA: la org QA de ferretería APARECE en `/book` bajo el copy "Reserva tu cita dental" (el query filtra por plan/add-on, no por rubro) [P] | ❌ [C] |
| 3 Cliente registra cumplimiento | 🟡 evidencia/archivos los carga el EQUIPO, no el cliente [C] | 🟡 ídem [C] | ❌ [C] | ❌ [C] | ❌ [C] |
| 4 IA estima + humano confirma | ✅ ENCENDIDO: `AGENTS_RUNTIME=1` + `PLATFORM_LAYER=1` medidos en el VPS, cron diario 11:00 UTC vivo (última corrida `ran:14`, 7 orgs × 2 roles), y `module.agents` se otorga en el alta real (`register/route.ts:198`, trial) y por plan Pro+ (`entitlements.ts:52`) [C][D: `ONIA_AGENTES_COSTO_API.md` §1, medición 2026-08-20] | ✅ ídem — el runtime es rubro-agnóstico [C][D] | ✅ ídem [C][D] | ✅ ídem [C][D] | ✅ ídem [C][D] |
| 5 Artefactos derivados | 🟡 factura/receta imprimibles (`app/print/invoice`, `app/print/prescription`) + presupuesto como documento (`lib/onia-core/collab.ts`); derivación AUTOMÁTICA desde el plan no existe [C] | 🟡 ídem [C] | ❌ [C] | ❌ [C] | 🟡 cotización→pedido existe [C] |
| 6 Chat con contexto cargado | 🟡 el circuito por org está VIVO punta a punta: editor `/settings/chatbot` → probador → publicar → el motor del VPS lee `GET /api/chatbot-knowledge/published?inboxId=` (Bearer, gate por add-on desde 2026-08-18) → el widget contesta lo publicado [C][D: `ONIA_CHATBOT_ESTADO_LOOP.md`, mirado 2026-08-18]. PERO el contexto es de la ORG (horarios, servicios), NO el plan del cliente individual — y es add-on pago (`whatsapp_addon`, circuito de cobro en producto desde commit `7bc8c81`), con 0 orgs reales pagando | 🟡 misma infra org-agnóstica (el motor se parametriza por `knowledge` + `rubrosExtra`); falta alta de inbox + add-on. Ya no es cierto que "el bot es dental": el hardcode dental vive en `lib/whatsapp-ai.ts:36`, que es el camino Meta-directo, no el vivo [C] | 🟡 ídem [C] | 🟡 ídem (la org QA "Ferretería Tornillo" existe para esto; sin tráfico verificado en esta pasada) [C] | 🟡 ídem [C] |
| 7 Escala al humano | 🟡 vivo en el motor: `handoff_humano` (el bot calla cuando el humano toma la conversación) + botón "Hablar con {humano}" + guardrails sin precios (`recepcionista.mjs`, `guardrails.mjs`); detrás del add-on del paso 6 [C][D] | 🟡 misma infra, mismo gate [C] | 🟡 ídem [C] | 🟡 ídem [C] | 🟡 ídem [C] |
| **Encendidos plenos** | **2/7** | **2/7** | **1/7** | **1/7** | **1/7** |

Lecturas honestas:

1. **El paso 4 se encendió.** En la pasada del 2026-08-16 estaba "a una variable de
   entorno"; hoy `AGENTS_RUNTIME=1` está medido en el VPS, el cron corre a diario y el
   entitlement se otorga en el registro. Es el primer paso del molde que pasó de
   "construido" a "encendido en producción" — la regla funcionando.
2. **Ningún rubro tiene el molde completo y el cuello sigue siendo el paso 2.** Los
   pasos 3, y el 6 en su versión plena (contexto del CLIENTE), dependen de que el
   cliente pueda entrar. El booking público acerca el paso 2 para dental, pero un token
   por cita no es un portal.
3. **El paso 6 hoy es "chat con contexto de la ORG", no "del cliente".** El circuito
   editable por organización está vivo y verificado con tráfico real; cargarle al chat
   el PLAN del cliente que escribe (lo que muestra NutriApp) es trabajo de producto
   nuevo, bloqueado en parte por el paso 2 (identificar al cliente).
4. **`/book` tiene una fuga de rubro.** Lista toda org con plan Professional/Clinic o
   add-on, sin filtrar por rubro, con copy y wizard dental ("Reserva tu cita dental",
   paso "Doctor"). Una ferretería QA aparece ahí hoy — mirado en producción. Antes de
   vender booking a estética/servicios hay que des-dentalizar esa superficie.
5. **Solo hay orgs de QA en producción** (3 orgs, 2 professional + 1 free, todas de QA
   — medición 2026-08-20 de `ONIA_AGENTES_COSTO_API.md`). "Encendido" acá significa
   infraestructura viva y verificada, no clientes reales usándola.

## Encender vs construir (la lista operativa)

**Ya encendido (nada que hacer):**
- Paso 4 completo: runtime + cola `/pending` + cron + entitlement en el alta.
- Paso 6/7 infra: motor por org + endpoint `published` + gate por add-on + alta de
  inbox desde `/admin/chatbots` + cobro del add-on en producto.

**ENCENDER (existe, es configuración/alta, no código):**
- Paso 6/7 para una org concreta: alta del inbox de Chatwoot + add-on activo.
- Paso 2 parcial dental para una org: `publicBookingAddon` (o plan Pro+).

**CONSTRUIR en el producto (sin tocar el core):**
- Derivación automática de artefactos desde el plan (paso 5): presupuesto por fases
  desde Treatment, lista de insumos, orden de repuestos.
- Contexto del CLIENTE en el chat (paso 6 pleno): cargar el plan del que escribe.
- Des-dentalizar `/book` (copy, "Doctor", filtro por rubro) para estética/servicios.
- Retirar o cablear `lib/whatsapp-bot.ts`/`whatsapp-ai.ts` (camino Meta-directo,
  dental-hardcodeado, hoy no es el circuito vivo).

**CONSTRUIR en el CORE (cambio aditivo al contrato):**
- Paso 2: el actor "cliente externo autenticado" — entidad nueva (p.ej.
  `client_identity` colgada de `contact`/`business_partner`) + capability nueva
  (portal del cliente). Es LA pieza que desbloquea 3, 6-pleno y 7-pleno del lado
  del cliente. Pasa por `onia-core-guardian` + validador.

## No verificado en esta pasada (dicho explícito)

- Pantallas logueadas renderizadas HOY en prod (`/pending`, `/agents`,
  `/settings/chatbot`): exigen sesión y no se creó cuenta QA en esta sesión. Se apoyan
  en [D] `ONIA_CHATBOT_ESTADO_LOOP.md` (miradas 2026-08-18 con capturas) y en [C].
- `AGENTS_RUNTIME` en el VPS: no re-medido acá; medición del 2026-08-20 en
  [D] `ONIA_AGENTES_COSTO_API.md` (`docker exec onia-platform env`).
- Tráfico real del bot en la org QA de ferretería (paso 6 comercio).
- La base self-hosted del VPS, directamente.
