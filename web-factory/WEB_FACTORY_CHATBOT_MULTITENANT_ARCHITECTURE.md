# Web Factory — Arquitectura del Chatbot Multi-Marca

Última actualización: 2026-07-03
Estado: definición. Aplica a todas las tiendas generadas por el web-factory.

## Objetivo

Un solo motor de chatbot para N marcas/clientes, con **aislamiento total** para que
las conversaciones, productos, leads y datos de una marca **nunca se mezclen** con los
de otra. Es el mismo patrón multi-tenant que ya usan:

- el **web-factory** (un motor de plantillas, un JSON por cliente), y
- el **checkout de Nuvia** (`store_id` particiona órdenes/pagos en Supabase — ver
  `NUVIA_PAYMENT_SYSTEM.md`).

El bot es la tercera pata del mismo modelo: **una infra compartida, aislada por una
clave de marca** (el `slug` / `store_id`).

## Principio: aislamiento por capa

| Capa | Compartido | Aislado por marca |
| --- | --- | --- |
| Meta Business | 1 portfolio (ONIA, 1 NIT) | 1 número + WABA + **display name** por marca |
| Chatwoot (self-hosted, VPS) | 1 instancia | 1 inbox (o cuenta) + equipo/agentes por marca |
| Bot (código) | 1 codebase | config por marca (catálogo, persona, guardrails, routing) cargada según **de qué número/inbox** llegó el mensaje |
| Datos (Supabase) | 1 proyecto | partición por `store_id` (fila `stores` por marca; Nuvia ya existe con slug=nuvia) |
| Web | 1 web-factory | 1 JSON de cliente (`data/clients/<slug>.json`) |

Regla dura: **un número de WhatsApp = una sola identidad visible.** No se puede hacer
que el mismo número responda como marca A a unos y marca B a otros. Marca nueva =
número nuevo.

## Flujo de un mensaje (cómo NO se mezcla)

```text
Cliente escribe al número de la Marca X
  -> Meta Cloud API entrega al inbox de X en Chatwoot
  -> webhook (POST /api/<x>/chatwoot/webhook) identifica el inbox/store
  -> carga SOLO la config de X: catálogo de X, persona de X, guardrails de X
  -> clasifica intención, responde y arma borrador
  -> guarda conversación/lead/orden con store_id = X
```

Un cliente de la Marca X **jamás** ve productos ni respuestas de la Marca Y. En
Chatwoot cada marca es su propio inbox; gerencia ve cada una por separado.

## Cómo se enchufa una marca nueva (checklist reproducible)

1. **Número + WABA** bajo el Meta Business de ONIA (o del cliente si tiene NIT
   propio — ver Gobernanza). Display name = la marca. Coexistencia si el número ya se
   usa en la app de WhatsApp Business.
2. **Inbox en Chatwoot** self-hosted + equipo/agentes de esa marca + etiquetas.
3. **Fila `stores`** en Supabase con el `slug` de la marca (Nuvia ya la tiene).
4. **Bloque de config del bot**: persona, guardrails e intents de la marca, que
   apuntan al `data/clients/<slug>.json` (catálogo + contenido/rutinas).
5. **`contacto.whatsapp`** en el JSON del cliente = ese número. Así el botón "cotizar"
   de la web entrega al bot de esa marca.

Cada paso es aislado; nada de lo anterior toca a las otras marcas.

## Persona y guardrails por vertical

Cada marca define su propia spec de comportamiento. No se comparten guiones.

| | Nuvia (skincare retail) | Bolivian Electric (eléctrico B2B) |
| --- | --- | --- |
| Rol del bot | Asistente de venta | Calificador de leads |
| Precios | **Sí los da** (la web ya los muestra, 315 productos con precio) | **No** (nunca precio ni stock exacto) |
| Recomienda | Rutinas/productos por necesidad de piel | Deriva a vendedor por ciudad/sucursal |
| Guardrail propio | Disclaimer médico (dermocosmética ≠ consulta) | Nunca competidores, compra mínima, entrega 24-48h |
| Fuente de conocimiento | `nuvia.json` (catálogo + `contenido`) | Adapter read-only del ERP (cuando exista) |

La spec de Nuvia sale del hub de contenido
(`NUVIA_ROUTINES_HUB_SPEC.md`). La de Bolivian Electric ya existe en su repo
(`docs/product/bot-behavior-spec.md`).

## Reutilización de Bolivian Electric

La plomería ya está construida y probada para Bolivian Electric (repo
`C:\dev\clientes\Bolivian Electric`). Es portable marca a marca:

- **Chatwoot self-hosted en VPS** (para no pagar por asiento) — ya desplegado.
- Webhook Chatwoot -> backend: `lib/chatwoot-webhook.ts` + `app/api/chatwoot/webhook`.
- **Router** (`lib/seller-router.ts` + `seller-roster.ts`): sticky por dueño +
  round-robin. Para Nuvia (retail) se simplifica o se omite.
- **Lead scoring** (`lib/lead-scoring.ts`) y **transcripción de notas de voz**
  (`lib/openai-client.ts`).

Runbooks de referencia (en el repo de Bolivian Electric):

- `docs/operations/whatsapp-chatbot-activation-runbook.md` — activación paso a paso +
  notas Meta 2026 (Cloud API única, coexistencia GA, Graph v23.0, permisos
  `whatsapp_business_messaging` / `whatsapp_business_management` con Advanced Access).
- `docs/operations/meta-business-verification-runbook.md` — verificación del negocio.
- `docs/operations/whatsapp-chatwoot-coexistence-decision.md` — decisión de número
  actual, coexistencia y cómo responden los vendedores.

## Gobernanza (quién es dueño del activo)

- **Marca propia de ONIA (ej. Nuvia):** todo (WABA, número, bot, datos) bajo el Meta
  Business de ONIA. Sin NIT nuevo. Número dedicado para la marca; el número de ONIA
  sigue siendo de ONIA.
- **Cliente con NIT propio (ej. Bolivian Electric):** el WABA vive bajo el portfolio
  del cliente ("el activo debe ser del cliente"). Se puede pilotear bajo ONIA y migrar.
- **Nunca** compartir el n8n/infra de ONIA con datos reales de un cliente sin aislar.
- **Un número = una identidad.** No mezclar dos marcas en un número.

## Estado actual (2026-07-03)

- **Nuvia**: marca de ONIA, número propio decidido, bajo el Meta Business de ONIA.
  Pendiente: conseguir la línea, verificación Meta, crear inbox. Web lista para
  mostrar; falta `contacto.whatsapp` + deploy para operar.
- **Bolivian Electric**: piloto en Chatwoot Cloud live; infra self-hosted desplegada;
  bot con router + lead scoring + voz. Referencia de la plomería.
- **Chatwoot self-hosted** ya existe (montado para BE). Decisión pendiente: reusar esa
  instancia con una cuenta/inbox por marca, o instancia separada por cliente con NIT
  propio. Para marcas de ONIA (Nuvia), reusar la instancia con inbox propio es lo más
  eficiente.

## Decisiones pendientes

1. ¿Nuvia reusa la instancia Chatwoot de BE (inbox aparte) o instancia propia de ONIA?
2. ¿El bot de Nuvia vive como rutas API en `apps/site` (junto a la web) o en la infra
   compartida del bot? Recomendado: API routes en `apps/site` para tener web + bot en
   un solo deploy, leyendo el mismo `nuvia.json`.
3. Número/línea nueva para Nuvia (acción humana).
