<!-- Fuente de verdad del analisis "personalizable por cliente" (pedido de Sergio
Urcullo, 12-sep-2026: "que el sistema se moldee a ellos, analiza"). Producido por
workflow de 4 agentes: medicion del codigo real de onia-platform + onia-core +
benchmark de mercado con fuentes + sintesis. Si cambia la decision, se EDITA este
archivo. La decision de construir N1 es de Sergio. -->

{
  "summary": "Analizar si Onia Platform puede hacerse personalizable por cliente (in-house para empresas grandes): medir el codigo real + benchmark de mercado + veredicto",
  "agentCount": 4,
  "logs": [],
  "result": {
    "veredicto": "# ¿Onia personalizable por cliente? — Análisis final\n\n## 1. Qué ya se moldea hoy\n\n| Capa | Qué personaliza | ¿Sin código? |\n|---|---|---|\n| Entitlements por org (`lib/platform/entitlements.ts` + UI admin) | Encender/apagar addons y módulos POR cliente (chatbot, web, inventory, whatsapp...), fila en DB con `validUntil` | ✅ SÍ |\n| Configuración operativa (`ClinicSettings`, `DoctorSchedule`, `ChatbotKnowledge`) | Horarios, feriados, tope de citas, agenda por profesional, prompt e instrucciones propias del bot, inboxes Chatwoot/WhatsApp propios | ✅ SÍ |\n| Datos del tenant del core (`ProcessChecklist`, `SavedView`, `RoleAssignment`, `CommunicationChannel`, áreas/sucursales) | Rutinas propias, vistas/KPIs guardados por rol, roles finos por sucursal (role_key texto libre), ruteo de mensajes | ✅ SÍ |\n| Vertical packs (`lib/platform/vertical-pack.ts`) | Marca, nav, quickActions, features — pero por RUBRO, no por cliente | ❌ Código |\n| Vocabulario (`lib/onboarding/vocabulario.ts`) | Rótulos y ejemplos — por RUBRO; dos importadoras ven lo mismo | ❌ Código |\n| Campos custom por entidad | NO EXISTE para el cliente. `Patient` ni siquiera tiene columna Json; los 36 `metadata Json` son uso interno sin UI | ❌ No existe |\n| Estados de flujo, roles, reportes | Enums fijos (4 estados de cita, 4 estados de work item, 4 roles); cambiar el flujo de UN cliente = migración para todos | ❌ Código |\n| Adapters del core (Bolivian Electric) | El core instalado SOBRE un sistema existente sin fork — pero lo ejecuta un dev, sprint a sprint | ❌ Código |\n\n**Resumen honesto:** hoy se moldea la capa operativa (features, horarios, bot, rutinas, roles finos). Todo lo estructural — campos, pantallas, estados, vocabulario — es código por rubro.\n\n---\n\n## 2. Los tres niveles de \"personalizable\"\n\n### N1 — Configuración self-service (modelo Airtable/Odoo Studio)\nEl cliente se moldea SOLO desde una pantalla. Piezas que faltan, estimadas sobre lo medido:\n\n| Pieza | Base existente | Esfuerzo |\n|---|---|---|\n| Overlay de pack por org (vocabulario, nav visible, quickActions) | `resolveVerticalPack` ya es el único punto de entrada; el pack ya viaja como JSON | 3-5 días |\n| Campos custom por org (definición + render genérico + validación) | 36 entidades ya tienen `metadata Json`; a `patients` hay que agregar la columna | 5-8 días |\n| Estados configurables de work item/cita por org | Mismo patrón que `ProcessChecklist` (pasos como datos); reemplaza el array fijo de 4 estados | 4-6 días |\n| Revivir `limits` Json de entitlements (se escribe en provisioning.ts:262, no lo lee nadie) | Ya está en la tabla | 1-2 días |\n| UI de admin para que el cliente edite todo eso | Patrón de `/admin/organizations/[id]/capacidades` ya existe | 5-7 días |\n\n**Total: ~18-28 días de construcción, UNA vez.** Después, cero horas marginales por cliente.\n**Veredicto contra la regla:** ✅ Es el ÚNICO nivel compatible con \"el techo son horas de soporte\". Es lo que Airtable/Monday venden sin poner una hora por cliente.\n\n### N2 — \"Nosotros lo moldeamos por vos\" (modelo Odoo partner)\nImplementación cobrada como horas: Odoo vende bolsas de 25-200h (USD 750-4.000); Salesforce/SAP lo delegan a partners a USD 100-300/h. **El truco del mercado: las horas las pone un ecosistema de partners (6,19x Salesforce según IDC), no el vendor.** Onia no tiene esa capa — las horas salen de Sergio Urcullo.\n\n**Veredicto:** ⚠️ Solo como lo que ya existe: la \"implementación desde Bs 3.500\" puntual y acotada, para configurar N1 por el cliente que no quiere hacerlo solo. Como oferta RECURRENTE (\"los cambios que pidas los hacemos nosotros\") rompe el modelo: cada cliente enterprise se vuelve un mini-proyecto de consultoría con precio de suscripción. Si aparece un pedido fuera de config, regla SaaStr por escrito: se acepta SOLO si ya estaba en el roadmap de todos los rubros, sin exclusividad, ≤10% de capacidad, 1-2 deals a la vez.\n\n### N3 — Fork/in-house real por cliente\n**Veredicto:** ❌ NO, con el número delante. Es la \"death trap\" documentada: el producto se frena, el mercado te lee como agencia y no como SaaS, y el churn del trimestre siguiente paga la venta de este. Con una persona operando, un fork por cliente es deuda de mantenimiento PERPETUA — exactamente el tipo de hora-por-cliente que la regla prohíbe. El camino adapter (Bolivian Electric) demuestra que se PUEDE sin fork, pero son días de dev por cliente: se reserva para casos familia/estratégicos, nunca se vende como oferta.\n\n---\n\n## 3. La oferta concreta a empresa grande (sin romper el modelo)\n\n**Frase de venta:** *\"El sistema se CONFIGURA a tu empresa\"* — campos propios, tus estados, tus palabras, tus flujos de automatización. Se moldea la configuración, jamás el código.\n\n**Qué prometer:**\n- Campos propios en tus fichas (clientes, órdenes, trabajos) — vos los definís\n- Tus estados y tu flujo de trabajo (cotizado → aprobado → en obra → facturado)\n- Tu vocabulario: el sistema habla como habla TU operación\n- Roles finos por área/sucursal, rutinas propias, vistas por rol (ya existe hoy)\n- Automatizaciones a medida vía n8n por cliente (webhook + credencial de n8n, nunca hardcodeada)\n- Instancia privada opcional: mismo software, infra aislada (compliance/datos)\n\n**Qué NO prometer:**\n- \"Desarrollamos features para vos\" / código a medida / exclusividad\n- Pantallas nuevas o módulos que no existen (\"la venta nunca exhibe obra\": lo que no está listo no se nombra)\n- Instancia privada como \"código moldeado a vos\" — es aislamiento, no fork\n\n**Precio sugerido (anclado en lo existente y en el mercado):**\n\n| Ítem | Precio | Ancla |\n|---|---|---|\n| Plan Grupo | Bs 2.900/mes (queda igual) | Ya existe |\n| Implementación/configuración inicial | desde Bs 3.500, cotizada por alcance | Ya existe; formato Success Pack de Odoo (horas prepagadas, acotadas, UNA vez) |\n| Instancia privada | Bs 4.500 + 900/mes | Ya existe; el mercado valida +25-35% sobre el contrato — **máximo 2-3 clientes**, cada instancia es ops fija para siempre |\n| Cambio de configuración post-arranque | Incluido si lo hace el cliente solo (N1); si lo hace Onia, se cotiza como mini-implementación | Evita el goteo de horas gratis |\n\n**El número honesto:** si N1 no está construido, esta oferta HOY se entrega solo con horas de Sergio Urcullo. Venderla antes de construir N1 = services trap. Orden correcto: construir primero (~4-6 semanas), vender después. Ojo también con la prioridad de la casa: el producto tiene problema de CLIENTES, no de features — esto se justifica solo si hay un prospecto enterprise concreto pidiéndolo; si no, se anota como pendiente.\n\n---\n\n## 4. Primer paso técnico si Sergio dice \"dale\"\n\n**Lo más barato que habilita N1 de verdad: campos custom por organización (5-8 días).** Es la primitiva mínima que Airtable/Monday/Odoo Studio comparten — la que permite decir \"se adapta a vos\" sin mentir.\n\n1. **`prisma/schema.prisma`** (`C:\\dev\\proyectos\\onia-platform\\prisma\\schema.prisma`):\n   - Tabla `OrganizationFieldDefinition` (orgId, entidad, key, label, tipo, requerido, opciones) — mismo patrón que `OrganizationEntitlement` (línea 2018)\n   - Columna `metadata Json @default(\"{}\")` a `Patient` (línea 653) — las otras 36 entidades ya la tienen\n2. **Render genérico**: un componente que lea las definiciones de la org y pinte los campos en ficha/formulario, con validación Zod contra la definición (validar en el borde, fail fast)\n3. **UI de admin**: copiar el patrón de `app/(dashboard)/admin/organizations/[id]/capacidades/CapacidadesOrg.tsx` para que el cliente defina sus campos solo\n4. **De paso, 1-2 días**: hacer que `entitlements.ts` LEA el `limits` Json que `provisioning.ts:262` ya escribe — perilla muerta que se revive gratis\n\nSegundo paso natural (no ahora): overlay de pack por org leído por `resolveVerticalPack` en `lib/platform/vertical-pack.ts` — un solo punto de entrada ya lo hace barato.\n\n**Una línea para cerrar:** SÍ se puede ofrecer \"el sistema se moldea a ustedes\" — pero con el modelo Airtable (primitivas construidas una vez, el cliente se configura solo), nunca con el modelo Salesforce sin el ejército de partners que Salesforce tiene y Onia no.",
    "medicion": {
      "plataforma": 7,
      "core": 8,
      "mercado": 7
    }
  },
  "workflowProgress": [
    {
      "type": "workflow_phase",
      "index": 1,
      "title": "Medir"
    },
    {
      "type": "workflow_phase",
      "index": 2,
      "title": "Mercado"
    },
    {
      "type": "workflow_phase",
      "index": 3,
      "title": "Veredicto"
    },
    {
      "type": "workflow_agent",
      "index": 1,
      "label": "medir:plataforma",
      "phaseIndex": 1,
      "phaseTitle": "Medir",
      "agentId": "aa5a5aeab5c0e756f",
      "model": "claude-fable-5",
      "state": "done",
      "startedAt": 1789251348228,
      "queuedAt": 1789251348201,
      "attempt": 1,
      "lastToolName": "StructuredOutput",
      "lastToolSummary": "La arquitectura ya esta a mitad de camino: un pack es una D…",
      "promptPreview": "CONTEXTO: Onia Platform es un SaaS boliviano multi-rubro (Next.js + Prisma + Supabase self-hosted). UNA persona lo opera (Sergio). Regla de la casa: el techo del negocio son HORAS DE SOPORTE por cliente, no features — cualquier oferta que exija horas del fundador por cliente rompe el modelo. Ya existe: plan Grupo/enterprise Bs 2.900/mes + implementacion desde Bs 3.500 (se cotiza), y un add-on \"ins…",
      "promptFramed": false,
      "lastProgressAt": 1789251526552,
      "tokens": 183910,
      "toolCalls": 25,
      "durationMs": 178320,
      "resultPreview": "{\"capasExistentes\":[{\"capa\":\"Vertical packs (rubro)\",\"queSePersonaliza\":\"8 packs servidos (dental, electrico/importadora, comercio, estetica, veterinaria, servicios profesionales, ganadero, onia-interna); el contrato del core declara 11 tracks. Cada pack declara marca (appName/tagline/logo), nav completa (items con href/icon/label/roles/group/requiresFeature), quickActions del FAB, bottomNav, role…"
    },
    {
      "type": "workflow_agent",
      "index": 2,
      "label": "medir:core",
      "phaseIndex": 1,
      "phaseTitle": "Medir",
      "agentId": "a50ce2849ee7b8a63",
      "model": "claude-fable-5",
      "state": "done",
      "startedAt": 1789251348230,
      "queuedAt": 1789251348201,
      "attempt": 1,
      "lastToolName": "StructuredOutput",
      "lastToolSummary": "Corta en arquitectura, real en trabajo. El core YA modela '…",
      "promptPreview": "CONTEXTO: Onia Platform es un SaaS boliviano multi-rubro (Next.js + Prisma + Supabase self-hosted). UNA persona lo opera (Sergio). Regla de la casa: el techo del negocio son HORAS DE SOPORTE por cliente, no features — cualquier oferta que exija horas del fundador por cliente rompe el modelo. Ya existe: plan Grupo/enterprise Bs 2.900/mes + implementacion desde Bs 3.500 (se cotiza), y un add-on \"ins…",
      "promptFramed": false,
      "lastProgressAt": 1789251505908,
      "tokens": 188275,
      "toolCalls": 17,
      "durationMs": 154380,
      "resultPreview": "{\"capasExistentes\":[{\"capa\":\"Contrato declarativo del core (entidades + capacidades)\",\"queSePersonaliza\":\"18 entidades genericas (WorkItem, BusinessPartner, RoleAssignment, ApprovalRequest, ScheduleEvent, SavedView, CommunicationChannel, Area/sucursales...) y 21 capacidades en 4 capas (core / activatable_module / vertical_extension / external_gate). El negocio se describe con 10 preguntas canonica…"
    },
    {
      "type": "workflow_agent",
      "index": 3,
      "label": "mercado",
      "phaseIndex": 2,
      "phaseTitle": "Mercado",
      "agentId": "a36de58f99a2cafe4",
      "model": "claude-fable-5",
      "state": "done",
      "startedAt": 1789251348232,
      "queuedAt": 1789251348201,
      "attempt": 1,
      "lastToolName": "StructuredOutput",
      "lastToolSummary": "La respuesta a Sergio es SI, pero con el modelo Airtable, n…",
      "promptPreview": "CONTEXTO: Onia Platform es un SaaS boliviano multi-rubro (Next.js + Prisma + Supabase self-hosted). UNA persona lo opera (Sergio). Regla de la casa: el techo del negocio son HORAS DE SOPORTE por cliente, no features — cualquier oferta que exija horas del fundador por cliente rompe el modelo. Ya existe: plan Grupo/enterprise Bs 2.900/mes + implementacion desde Bs 3.500 (se cotiza), y un add-on \"ins…",
      "promptFramed": false,
      "lastProgressAt": 1789251489559,
      "tokens": 138808,
      "toolCalls": 12,
      "durationMs": 138031,
      "resultPreview": "{\"capasExistentes\":[{\"capa\":\"Odoo Studio (config sin codigo)\",\"queSePersonaliza\":\"Lo venden como 'moldea el ERP sin programar': campos custom, formularios/vistas, reportes y automatizaciones drag-and-drop. La trampa comercial: Studio NO se vende suelto — solo viene en el plan Custom (~USD 49/usuario/mes promo, ~61 al renovar, 2026). Y cuando Studio no alcanza, es Python/XML que solo corre en Odoo.…"
    },
    {
      "type": "workflow_agent",
      "index": 4,
      "label": "veredicto",
      "phaseIndex": 3,
      "phaseTitle": "Veredicto",
      "agentId": "a4a3571829d2426ff",
      "model": "claude-fable-5",
      "state": "done",
      "startedAt": 1789251526564,
      "queuedAt": 1789251526556,
      "attempt": 1,
      "promptPreview": "CONTEXTO: Onia Platform es un SaaS boliviano multi-rubro (Next.js + Prisma + Supabase self-hosted). UNA persona lo opera (Sergio). Regla de la casa: el techo del negocio son HORAS DE SOPORTE por cliente, no features — cualquier oferta que exija horas del fundador por cliente rompe el modelo. Ya existe: plan Grupo/enterprise Bs 2.900/mes + implementacion desde Bs 3.500 (se cotiza), y un add-on \"ins…",
      "promptFramed": false,
      "lastProgressAt": 1789251576012,
      "tokens": 133590,
      "toolCalls": 0,
      "durationMs": 49448,
      "resultPreview": "# ¿Onia personalizable por cliente? — Análisis final\n\n## 1. Qué ya se moldea hoy\n\n| Capa | Qué personaliza | ¿Sin código? |\n|---|---|---|\n| Entitlements por org (`lib/platform/entitlements.ts` + UI admin) | Encender/apagar addons y módulos POR cliente (chatbot, web, inventory, whatsapp...), fila en DB con `validUntil` | ✅ SÍ |\n| Configuración operativa (`ClinicSettings`, `DoctorSchedule`, `Chatbot…"
    }
  ],
  "totalTokens": 644583,
  "totalToolCalls": 54
}