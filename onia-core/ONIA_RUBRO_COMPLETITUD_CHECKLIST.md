# ONIA — Checklist de completitud de rubro (el molde de 7 pasos)

Fuente del molde: `hermes-content/references/video-intake/2026-08-16-nutriapp-modulo-vertical.md`
(NutriApp: la anatomía de cualquier vertical profesional↔cliente, mostrada entera en 78 s).
Verificado contra `onia-core/contract.json` v1.0.0 y `onia-core/schema/base-schema.sql`
(archivo por archivo, no de memoria). Aplicado contra el código real de `onia-platform`
(master = `origin/master`, commit `b1aa4ec`) y contra producción. **Última pasada completa:
2026-08-20.**

> ⚠️ **Revisado el 2026-08-31: las filas del paso 2 y del paso 3 estaban vencidas.** El
> commit que cita este checklist (`b1aa4ec`, 19:56) es **56 minutos anterior** a `3e43c93`
> (20:52), que encendió el **portal del cliente por token** (`/portal/[token]` +
> `/requerimientos`). O sea: el checklist declaró "falta en el core" justo lo que se
> construyó esa misma noche. Las celdas afectadas quedan corregidas abajo con la marca
> **[C·31ago]** / **[P·31ago]**. **Los conteos "Encendidos plenos" NO cambian**: el portal
> entra por enlace de un solo uso, no por sesión propia, así que el paso 2 pasa de ❌ a 🟡,
> nunca a ✅. Lección: un checklist fechado envejece en horas cuando el carril que mide es
> el mismo que construye.

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
| 2 | El cliente entra con auth PROPIA y ve su plan | **NINGUNA** — `member` es equipo (tiene `userId`); `contact` y `business_partner` no tienen auth (requiredFields verificados: sin userId) | **ninguna** | 🟡 **Resuelto en el PRODUCTO, no en el core** — el portal por token (`app/(public)/portal/[token]`) corre sobre `onia_core_work_items`, **cero entidades nuevas**. El actor "cliente externo **autenticado**" sigue sin existir: es un enlace de un solo uso, no una sesión, y muestra sus requerimientos, no su plan [C·31ago][P·31ago] |
| 3 | El cliente REGISTRA cumplimiento (incl. foto) | `onia_core_evidence` (`kind`) + `onia_core_documents` | `evidence_activity` | 🟡 **Ya NO está bloqueado por el paso 2.** El cliente sube el archivo él mismo desde el portal (`POST /api/portal/requerimientos/entregar`, multipart, tope 10 MB, lista blanca de tipos, al bucket `clinical-docs`) y contesta el cuestionario. Lo que falta es el registro de cumplimiento **del plan** (la foto del molde), no la capacidad de cargar [C·31ago] |
| 4 | La IA estima y el HUMANO confirma o corrige | `onia_core_approval_requests` | `approvals` (fase 2) + moduleCapability `agents` (cola human-in-the-loop) | ✅ Cubierto — **y ya ENCENDIDO en producción** (ver tabla por rubro) |
| 5 | Del plan salen ARTEFACTOS derivados | `onia_core_documents` (docType) | `collaboration` (fase 2) | 🟡 El core guarda el artefacto; la DERIVACIÓN (lista de compras, presupuesto por fases) es lógica de producto por rubro — no exige cambio de core |
| 6 | Chat con el contexto del cliente YA cargado | `onia_core_communication_channels` | `channels` (fase 1) + `knowledge_base` (fase 4, vertical_extension, sin entidad core: la fila vive en el producto, `ChatbotKnowledge`) + `whatsapp` (fase 5, external_gate) | 🟡 Cubierto como gate. OJO: lo vivo hoy es contexto de la **ORG** (conocimiento editable), no del **CLIENTE individual** (su plan) — el molde pide lo segundo |
| 7 | Lo delicado ESCALA al humano | `work_items.escalation_level` (línea 72 del schema) + `approval_requests` | `approvals` + guardrails del módulo `agents` | ✅ Cubierto |

**La distinción que importa:** de los 7, **solo el paso 2 falta en el core**. Los otros
6 tienen entidad+capability. El paso 2 sigue siendo un hueco del contrato — un actor
externo **con sesión propia** no existe ni como entidad ni como capability — **pero el
producto lo salteó sin tocar el core**: el portal del cliente se montó sobre
`onia_core_work_items` con un tipo nuevo de work item, que es exactamente lo que
CLAUDE.md manda ("encender, no construir"). El cambio aditivo al core dejó de ser
bloqueante y pasó a ser deuda: hoy se paga con un enlace por cliente en vez de una
cuenta. [C·31ago]
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
| 2 Portal del cliente con auth | 🟡 **dos superficies**: el portal de requerimientos por token (abajo) **+** booking público VIVO y MIRADO (`/book` → wizard doctor/fecha/horario/datos) + "mis citas" por token; sin auth propia ni plan visible [C][P] | 🟡 portal de requerimientos (el `/book` dental no le sirve: pide "doctor") [C·31ago] | 🟡 ídem [C·31ago] | 🟡 ídem — y sigue la FUGA: la org QA de ferretería APARECE en `/book` bajo el copy "Reserva tu cita dental" (el query filtra por plan/add-on, no por rubro) [P] | 🟡 ídem [C·31ago] |
| 3 Cliente registra cumplimiento | 🟡 **el cliente YA sube sus documentos** desde el portal y contesta cuestionarios; falta el registro de cumplimiento del PLAN (la foto del molde) [C·31ago] | 🟡 ídem [C·31ago] | 🟡 ídem [C·31ago] | 🟡 ídem [C·31ago] | 🟡 ídem [C·31ago] |
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
2. **Ningún rubro tiene el molde completo, pero el cuello del paso 2 se destrabó**
   *(corregido el 2026-08-31)*. El paso 3 ya no depende de nadie: el cliente entra por
   su enlace y sube. Lo que sigue trabado en el paso 2 es el paso **6 pleno** (chat con
   el contexto del cliente), porque un token de un solo uso identifica una entrega, no
   sostiene una conversación. Y el portal es **transversal a los 5 rubros**: sin
   `requiresFeature`, en los 4 navs (`components/layout/navigation.ts:45` +
   `lib/platform/vertical-pack.ts` ×3), roles SUPERADMIN/ADMIN/STAFF.
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

**CONSTRUIR en el CORE (cambio aditivo al contrato) — DEGRADADO a deuda el 2026-08-31:**
- Paso 2: el actor "cliente externo autenticado" — entidad nueva (p.ej.
  `client_identity` colgada de `contact`/`business_partner`) + capability nueva.
  **Ya no es LA pieza bloqueante**: el portal por token desbloqueó el paso 3 sin tocar
  el core. Lo que este cambio compra hoy es el **paso 6 pleno** (una sesión a la que
  colgarle el contexto del cliente) y que el cliente vuelva sin pedir enlace nuevo.
  Cuando se haga, pasa por `onia-core-guardian` + validador.

## Verificado el 2026-08-31 (la pasada de corrección)

- `/portal/<token>` **MIRADO renderizado** en `app.onia.com.bo` con un token inventado:
  200 y la pantalla "Enlace no disponible" propia del portal — **no** el redirect
  atrapa-todo (una ruta inventada da 308). [P·31ago]
- **Está desplegado, no sólo en `master`:** `3e43c93` es ancestro de `e5c1ad3`, el commit
  que sirve el contenedor `onia-platform` del VPS, y los artefactos `requerimientos` y
  `portal` están en el `.next` de ese contenedor (`docker exec`).
- **No hay modelo Prisma nuevo**: `grep -i requerimiento prisma/schema.prisma` da cero.
  Todo vive en `onia_core_work_items` (`lib/onia-core/requerimientos.ts`, 513 líneas).

## No verificado en esta pasada (dicho explícito)

- Pantallas logueadas renderizadas HOY en prod (`/pending`, `/agents`,
  `/settings/chatbot`): exigen sesión y no se creó cuenta QA en esta sesión. Se apoyan
  en [D] `ONIA_CHATBOT_ESTADO_LOOP.md` (miradas 2026-08-18 con capturas) y en [C].
- `AGENTS_RUNTIME` en el VPS: no re-medido acá; medición del 2026-08-20 en
  [D] `ONIA_AGENTES_COSTO_API.md` (`docker exec onia-platform env`).
- Tráfico real del bot en la org QA de ferretería (paso 6 comercio).
- La base self-hosted del VPS, directamente.
