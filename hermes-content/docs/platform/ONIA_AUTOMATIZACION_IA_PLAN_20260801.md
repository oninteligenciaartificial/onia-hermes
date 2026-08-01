# Onia Platform — el plan para que la IA le saque trabajo de encima al dueño

> **2026-08-01.** Investigación y plan. **No se implementó nada.** No se tocó
> `onia-platform` (solo lectura), ni `onia-core/`, ni `web-factory/`.
>
> Este doc **se subordina a `PLAN.md`**, que manda el orden general. Acá se desarrolla
> su §4 ("la plataforma 100% automatizada — el norte") y nada más.
>
> Todo dato tiene fuente o dice **[VERIFICAR]**. Onia tiene **cero clientes**: no hay
> casos de éxito acá, y no se inventa ninguno.

---

## Lo que hay que entender antes de leer el resto

**1. La IA no es el costo. El transporte es el costo.**
Todas las capacidades de IA de una clínica chica juntas cuestan **~US$ 0,40/mes**. Los
mensajes de WhatsApp de esa misma clínica cuestan **~US$ 7,70/mes** — **20 veces más**
(§4). Optimizar el modelo es irrelevante; diseñar bien las plantillas de WhatsApp decide
la plata.

**2. Y ese costo de transporte no lo puede cobrar Onia.**
Los *Tech Provider Terms* de Meta, **vigentes desde el 31-jul-2026** (hace 2 días),
prohíben textualmente *"charging a fee for your Customers' use of the WhatsApp Business
Platform"*. El add-on de WhatsApp de Onia hoy vende un **cupo de 200 mensajes/mes**
(`lib/pricing.ts` → `WHATSAPP_ADDON.meta.operationalMonthlyLimit`). Eso, tal como está
redactado, es exactamente lo que el contrato prohíbe. **Hay que reencuadrarlo** (§5.1).

**3. La mayoría de lo que le saca trabajo al dueño NO necesita IA.**
Recordatorios, cierre de caja, conciliación de pagos, reportes: eso es SQL y un reloj.
Ya está construido y funciona **sin un solo token**. La IA sirve donde hay **lenguaje**
(entender lo que escribe un paciente, redactar) o **desorden** (un PDF de lista de
precios). Prometer "IA" donde alcanza un `WHERE` es caro, frágil y se nota.

**4. El activo real ya está construido y no se toca.**
El agente **propone** → el dueño **aprueba** en `/pending` → el adapter **envía**, con
idempotencia garantizada por `onia_core_dispatches.approvalId @unique` y cupo verificado
*antes* de tocar la red. Eso es lo que hace vendible la automatización. Toda propuesta de
este doc respeta ese patrón; ninguna lo saltea.

---

# 0. Qué hay hoy, verificado

Verificado el 2026-08-01 contra el código (`C:\dev\proyectos\onia-platform`, solo lectura)
y contra el VPS `187.77.16.63` por SSH.

## 0.1 En el producto

| Pieza | Estado real | Dónde |
|---|---|---|
| **Agentes Recall y Cobrador** | Existen y funcionan. **NO usan IA**: son queries SQL + `buildRecallMessage()` / `buildCollectorMessage()`, plantillas de string en TypeScript | `lib/onia-core/modules/agents-runtime.ts` |
| **Guardarraíles** | Acciones prohibidas (`send_money`, `execute_payment`, `delete_data`, `modify_settings`), 25 acciones/corrida, 100/día, 20 mensajes/día | `agents-config.ts` |
| **Ruteo a aprobación** | `routeAction()`: `actionType` desconocido → `pending_approval` **por defecto seguro**. Como los agentes nacen en `autonomyLevel: "suggest"`, **todo** cae en aprobación | `agents-logic.ts` |
| **Idempotencia** | `onia_core_dispatches.approvalId @unique`. Se "reclama" el envío con un `create()`; si choca P2002, no se envía. Si el create falla por otra causa, **tampoco envía** | `lib/onia-core/dispatch/dispatcher.ts` |
| **Cupo** | `checkWhatsAppAddon()` **fail-closed**, dentro del adapter, antes de la red. 200 msg/mes contando 3 fuentes | `lib/plan-limits.ts:298` |
| **Chatbot de WhatsApp** | Menú fijo 1-4 (ver/confirmar/cancelar cita, horarios). Texto libre → **una** llamada a `gpt-4o-mini`, `max_tokens: 350`, **sin tools, sin historial** | `lib/whatsapp-ai.ts:129` |
| **Llamadas a IA en todo el repo** | **UNA sola**, la de arriba. Cero Anthropic, cero Gemini, cero LiteLLM | — |
| **RAG / embeddings / pgvector** | **No existe nada.** Lo que hay es *prompt stuffing*: la clínica y hasta 20 tratamientos metidos en el system prompt | — |

**Dos cosas que están apagadas y nadie lo nota:**

- **El reloj de los agentes no existe.** `app/api/cron/onia-agents/route.ts` está escrito
  y autenticado con `CRON_SECRET`, pero **no figura en `vercel.json`** (que solo agenda
  `appointment-reminders`, `recurring-invoices` y `onia-core-workitems`) y en el VPS no
  hay nadie que lo llame. Consecuencia directa: la cola de aprobación **nunca se llena
  sola**. Es la razón mecánica de que `/pending` esté vacío.
- **WhatsApp está literalmente sin configurar en producción.** En el contenedor
  `onia-platform` del VPS: `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN`,
  `WHATSAPP_APP_SECRET` y los 4 de Chatwoot valen **`SIN_CONFIGURAR`**. `OPENAI_API_KEY`
  sí es real. O sea: hoy el canal está muerto por configuración, no por código.

## 0.2 En el VPS

**n8n: 116 workflows, 55 activos** — no 11, como decía `PLAN.md` §4. Y tres hechos que
cambian el criterio de reparto (§2):

1. **Ningún workflow activo usa IA.** De los 15 que tienen nodos de IA
   (`lmChatOpenAi`, `agent`, `openAi`), **los 15 están apagados**. La automatización
   viva es 100% determinista.
2. **Los workflows automatizan la infra vieja, no el producto nuevo.** Conteo de destinos
   sobre los 116: 27 → `api.resend.com`, **25 → `kvepqgikokjlacxngkiw.supabase.co`**
   (Supabase cloud de DentalGest), 16 → `jafxylfocvvlflpqfsix.supabase.co`,
   11 → `graph.facebook.com`, **6 → `dentalgest-onia.vercel.app`**. Cero apuntan al VPS.
3. **Hay un workflow activo con una variable que no existe.** `WF-04: Overdue Invoice
   Dunning` (activo) construye la URL de WhatsApp con
   `$env.WHATSAPP_PHONE_NUMBER_ID`, y esa variable **no está en el entorno del contenedor
   de n8n** (verificado: 0 variables que empiecen con `WHATSAPP`). La rama de WhatsApp de
   ese workflow está muerta y nadie se enteró. Confirma la regla de la casa por la vía
   dura. *(Matiz técnico: `N8N_BLOCK_ENV_ACCESS_IN_NODE=false`, así que `$env` no está
   bloqueado — el problema no es el permiso, es que la variable no existe. La regla sigue
   valiendo: los secretos van por credenciales de n8n.)*

**LiteLLM** (`onia_selfhosted-litellm-1`): 3 modelos (`gpt-4.1-mini`, `gpt-4o-mini`,
`o4-mini`), tope global `max_budget: 50` cada 30 días. **Gasto real medido** en
`LiteLLM_SpendLogs`: **US$ 0,1909 en 159 requests** de `gpt-4.1-mini` entre el 23-jul y
el 1-ago, más US$ 0,0100 en 33 requests de `gpt-4o-mini`. Promedio: **US$ 0,0012 por
request**. Es el mejor dato propio que hay para costear.

**Punto ciego que importa:** el producto llama a **OpenAI directo**
(`OPENAI_API_KEY` en su contenedor), **no** a LiteLLM. O sea, el gasto de IA del producto
**no pasa por el gateway que tiene el tope de US$ 50** y no hay medición por tenant.

**También corren:** Chatwoot (`onia-chatbot_*`), Crawl4AI, Speaches (STT gratis),
Uptime Kuma, Cal.com.

---

# 1. El mapa: tarea por tarea, qué se automatiza y qué no

Tres categorías, y las tres son respuestas legítimas:

- **AUTO** — corre sola, sin humano. Reservado para lo **determinista y reversible**.
- **APROBAR** — el agente propone, el dueño aprueba en `/pending`, recién ahí se ejecuta.
  Todo lo que **contacta a un tercero, ofrece un precio o mueve plata**.
- **NO** — no se automatiza. Porque es un acto profesional, porque el error cuesta más que
  el ahorro, o porque la relación humana **es** el valor.

## 1.1 Clínica dental

| # | Lo que hoy hace una persona | Decisión | Por qué | ¿Necesita IA? |
|---|---|---|---|---|
| 1 | Contestar WhatsApp: horarios, dirección, "¿atienden hoy?" | **AUTO** | Datos públicos de la clínica. El peor error posible es decir un horario mal, y se corrige solo | **Sí** — lenguaje libre |
| 2 | Contestar "¿cuánto cuesta X?" | **AUTO con tope** | Precio de lista publicado = no es oferta. Fuera de lista → escala | Sí |
| 3 | Consultar "¿cuándo es mi cita?" | **AUTO** | Lectura del propio dato del paciente, ya autenticado por su número | No (query) |
| 4 | Confirmar / cancelar cita | **AUTO** | Ya funciona. Reversible, y el paciente es el dueño de la decisión | No (menú) |
| 5 | Agendar cita nueva | **AUTO con reglas duras** | Solo huecos libres, solo tratamientos de duración conocida, 1 cita por paciente por día. Fuera de eso → APROBAR | Sí (parseo) |
| 6 | Recordar la cita 24 h y 2 h antes | **AUTO** | Determinista, ya construido (`WF-00`). **El mayor ahorro de tiempo del sistema** | **No** |
| 7 | Llenar el hueco cuando alguien cancela | **APROBAR** | Contacta a un tercero para ofrecerle algo. El agente arma la lista ordenada; el dueño elige | Sí (redacción) |
| 8 | Llamar a pacientes que no vuelven hace 6 meses (recall) | **APROBAR** | Ya construido (`recall`, 180 días, cooldown 30). Es contacto saliente: exige opt-in y aprobación | Opcional |
| 9 | Cobrar facturas vencidas | **APROBAR** | Es plata y es relación. Ya construido (`cobrador`, cooldown 7 d) | Opcional |
| 10 | Registrar el pago cuando entra el QR / transferencia | **AUTO** | Conciliación por API del banco = comparar montos. Cero ambigüedad | **No** |
| 11 | Emitir la factura fiscal (SIAT) | **AUTO el cálculo, APROBAR la emisión** | La emisión es un acto tributario irreversible. Hasta homologar, ni una cosa ni la otra | **No** |
| 12 | Cerrar caja del día | **AUTO** | Es una suma | **No** |
| 13 | Reporte del mes al dueño | **AUTO** | Ya construido (`WF-06`). La IA solo agrega valor en la **lectura** ("bajaron los nuevos 30%") | Sí, para el texto |
| 14 | Escribir la ficha clínica / nota del tratamiento | **NO** (asistir sí, decidir no) | Es un registro médico que firma el odontólogo. La IA puede **transcribir el dictado**; el texto final lo edita y aprueba él, siempre | Sí (transcripción) |
| 15 | Explicar el presupuesto y hacerle seguimiento si no lo aceptan | **APROBAR** | El seguimiento de un presupuesto no aceptado es el dinero más fácil de la clínica, y es contacto saliente | Sí |
| 16 | Pedir reseña en Google | **APROBAR** | Contacto saliente. Además, pedirla mal quema al paciente | Sí |
| 17 | Pedir insumos al proveedor | **APROBAR** | Es una orden de compra: plata | No (regla de stock) |
| 18 | Coordinar con el laboratorio dental | **NO** | Especificaciones que si salen mal cuestan una prótesis y una semana. El costo del error es 100x el ahorro | — |
| 19 | Planilla y sueldos | **AUTO el cálculo, NO la decisión** | El módulo `payroll` del core calcula (incl. bono de antigüedad). Pagar lo decide el dueño | **No** |
| 20 | Publicar en redes | **APROBAR** | Publicación pública a nombre del cliente | Sí |
| 21 | **Diagnosticar, indicar tratamiento o dar consejo clínico** | **NO. Nunca.** | No es una decisión de producto: es responsabilidad profesional, y la política de Meta desaconseja explícitamente mandar información de salud por WhatsApp (§5.4) | — |

**Cuenta honesta:** de 21 tareas, **8 son AUTO** y de esas **6 no usan IA**. La IA es
indispensable en 1, 2, 5, 7 y 15 — y ahí es donde vale la pena gastar el esfuerzo.

## 1.2 Importadora eléctrica

Vocabulario del pack `proveegest-electrico` (`contract.json`): work items `cotizacion`,
`pedido`, `solicitud_compra`, `reclamo`, `cobro_pendiente`; áreas `ventas`, `compras`,
`almacen`, `facturacion`, `gerencia`.

| # | Lo que hoy hace una persona | Decisión | Por qué | ¿Necesita IA? |
|---|---|---|---|---|
| 1 | Responder "¿tienen X?" | **AUTO** | Lectura de stock. Decisión de diseño pendiente: ¿decir cantidad exacta o "hay / no hay / consultar"? Recomiendo lo segundo — el stock exacto es información competitiva | **Sí** (interpretar el nombre del producto) |
| 2 | Dar precio por WhatsApp | **APROBAR o rango pre-aprobado** | **Un precio por WhatsApp es una oferta.** Y sin fuente diaria del TCO del BCB, el core **lanza excepción** a propósito (`fx.logic.mjs` desde el commit `a760f7e7`) | Sí |
| 3 | Armar la cotización | **APROBAR, siempre** | Documento vinculante con precios, plazos y descuento. Nunca auto | Sí (armar), No (calcular) |
| 4 | Seguir la cotización que no responde | **APROBAR** | Contacto saliente. Es la palanca de venta más grande del rubro | Sí |
| 5 | Tomar el pedido | **AUTO bajo monto, APROBAR sobre monto** | Umbral por organización. Sobre el umbral lo mira un humano | Parcial |
| 6 | Confirmar stock y reservar | **AUTO** | Query + reserva reversible | **No** |
| 7 | Avisar que llegó la mercadería | **AUTO** | Evento de sistema, mensaje utility, contra un pedido que el cliente ya hizo | **No** |
| 8 | Calcular el costo de importación (flete, DUI, prorrateo) | **AUTO** | Es el módulo `imports` del core: aritmética. **Sacar esto del Excel es el mayor ahorro del rubro** | **No** |
| 9 | Repreciar cuando se mueve el tipo de cambio | **AUTO el cálculo, APROBAR el nuevo precio** | Post-flotación el oficial se movió de 6,96 a ~11,4-11,9. Repreciar mal factura de menos. **Requiere primero una fuente diaria del TCO** | **No** |
| 10 | Cargar la lista de precios del proveedor (PDF / Excel) | **APROBAR** | Acá la IA brilla: extrae 400 filas de un PDF en un minuto. Pero **no toca los precios hasta que un humano confirme el lote** (el contrato ya lo exige: `intakePolicy.channels[import]`, gate `dry_run_obligatorio`) | **Sí** — es el mejor caso de uso del rubro |
| 11 | Cobrar facturas vencidas | **APROBAR** | Mismo agente `cobrador` que la clínica. Es el mismo agente con otro sustantivo | Opcional |
| 12 | Emitir factura fiscal | **AUTO cálculo, APROBAR emisión** | Igual que dental | **No** |
| 13 | Decidir qué reponer | **APROBAR** | El agente propone (rotación + lead time + stock mínimo); comprar lo decide el dueño | **No** (regla) |
| 14 | Coordinar despacho y transporte | **NO** | Depende de terceros físicos y de imprevistos que el sistema no ve | — |
| 15 | Reclamos y garantías | **APROBAR, con escalado inmediato** | Un cliente enojado con un agente automático es un cliente perdido. El bot **detecta y escala**, no resuelve | Sí (detectar) |
| 16 | Negociar con el proveedor del exterior | **NO** | Relación comercial. Es el trabajo del dueño, y es donde gana la plata | — |

**Cuenta honesta:** de 16 tareas, **6 son AUTO** y de esas **5 no usan IA**. Las dos
tareas donde la IA cambia la vida del importador son la **1** (entender qué producto le
están pidiendo, con nombres que nadie escribe igual dos veces) y la **10** (leer la lista
de precios del proveedor).

## 1.3 Lo que NO conviene automatizar — y por qué decirlo vende

Cinco cosas quedan afuera a propósito. Vale la pena decirlo en la venta:

1. **Diagnóstico y consejo clínico.** No es una limitación técnica; es una línea.
2. **La ficha clínica firmada.** Se puede dictar y transcribir. La firma es del profesional.
3. **La negociación con proveedores y el laboratorio.** El error cuesta más que el ahorro.
4. **Los reclamos.** El bot detecta y escala en un mensaje. No intenta resolver.
5. **Cualquier envío de plata.** Ya está prohibido en el código
   (`AGENTS_CONFIG.guardrails.prohibitedActions`), y así se queda.

> Argumento de venta: *"El sistema no toma decisiones que te corresponden a vos. Te saca
> de encima el trabajo repetitivo y te pone adelante las decisiones ya masticadas."*

---

# 2. Dónde vive cada pieza

## 2.1 El criterio propuesto: validado con una corrección importante

El criterio de partida era *"n8n para orquestación y horarios; el producto para lo que
toca datos del tenant"*. **La dirección es correcta. La corrección es que hoy no se
cumple, y el incumplimiento ya hace daño.**

Hoy n8n hace las dos cosas: **dispara Y toca los datos del tenant** (25 llamadas a RPCs
de Supabase) **y además envía WhatsApp por su cuenta** (`WF-00`, `WF-04`, `WF-05` pegan
directo a `graph.facebook.com`). Eso produce el problema más serio de todo este
documento:

> **Hay dos caminos de envío de WhatsApp, y solo uno tiene idempotencia.**
> El dispatcher del producto garantiza que un mensaje aprobado sale **una sola vez**
> (`approvalId @unique`). n8n envía por fuera de ese registro. Con un cliente de verdad
> y los dos caminos encendidos, **el paciente recibe el mensaje dos veces** y no hay
> nada en la base que lo impida.

*(Atenuante real: para recordatorios, n8n marca `reminder24Sent` en la base y
`checkWhatsAppAddon` cuenta esas mismas columnas, así que el cupo sí es compartido. Pero
esa protección es específica de `Appointment` — no cubre cobranza, recall ni nada nuevo.)*

## 2.2 La regla, más dura que la original

| Capa | Qué le toca | Qué **no** le toca | Fundamento |
|---|---|---|---|
| **Core** (`onia-hermes/onia-core`, congelado v1.0.0) | El catálogo de intents por pack (`vocabulary.workItemTypes`), el catálogo de `actionType` con `requiresApproval`, los guardarraíles, qué herramienta exige qué capability, y qué bloquea cada rubro (`blockedCapabilityIds`) | Ejecutar. Nunca. Es contrato | `agents.json`, `intake.logic.mjs`. Es el único módulo 100% portado |
| **Producto** (`onia-platform`) | **Todo lo que toca datos de un tenant**: las herramientas del bot, el pack, el tenant guard, la cola de aprobación, el cupo, la idempotencia, **y el cron** (`/api/cron/*` con `CRON_SECRET`) | Ser llamado por un reloj que sepa qué hay adentro | Las herramientas **son queries a la base del tenant**. Sacarlas afuera obliga a exponer la base |
| **Gateway externo** (Meta, Chatwoot, banco) | Transporte puro | Lógica | `external_gate` del contrato |
| **n8n** | **El reloj y el cartero de lo NUESTRO**: un `GET` autenticado a `/api/cron/*`, y las ops de Onia (alertas a Sergio, healthcheck, radar normativo, briefing) | **Datos de un tenant cliente. Envío de mensajes a clientes finales. Secretos en `$env`** | Un workflow roto en silencio 39 h (`WF-04`) es la prueba de por qué |

**En una línea:** *n8n sabe **cuándo**; el producto sabe **qué**; el core dice **si se
puede**; Meta solo **lleva**.*

## 2.3 Consecuencias concretas de aplicar la regla

1. `vercel.json` (o el scheduler del VPS) agrega `/api/cron/onia-agents`. **Una línea.**
   Sin esto, nada de este documento existe.
2. Los workflows `WF-00`, `WF-04`, `WF-05`, `WF-11` que envían WhatsApp directo a Graph
   API **se convierten en un `GET` al producto**, o se apagan. No pueden coexistir con el
   dispatcher.
3. Los 41 workflows que apuntan a `kvepqgikokjlacxngkiw.supabase.co` y
   `dentalgest-onia.vercel.app` **están automatizando la infra vieja**. Decidir uno por
   uno: migrar al VPS, o apagar. Hoy son ruido activo que puede mandar mensajes reales.
4. `$env` en nodos: prohibido, aunque técnicamente funcione. Credenciales de n8n.
5. **Medir el gasto de IA por tenant**: el producto debería llamar a la IA a través de
   LiteLLM (que ya tiene el tope de US$ 50/30d) en vez de a OpenAI directo, o registrar
   tokens por organización en su propia base. Hoy no hay ni una cosa ni la otra.

---

# 3. El orden de construcción

Priorizado por **cuánto trabajo le saca al dueño por unidad de esfuerzo nuestro**. No por
lo que sea más lindo de construir.

> **Subordinación a `PLAN.md`:** su §3 dice que el 100% automatizable *"no se arranca
> hasta que el core sea la fuente"*. **Se respeta**, con una excepción defendible: los
> pasos **0.1 a 0.3** son de configuración, no de arquitectura, cuestan horas, y
> encienden cosas que **ya están construidas**. Del paso 1 en adelante, sí: después del
> core.

## Paso 0 — Encender lo que ya está construido (horas, no días)

| # | Qué | Esfuerzo | Qué le saca al dueño |
|---|---|---|---|
| **0.1** | Agendar `/api/cron/onia-agents` | **1 línea** | Que la cola de aprobación se llene sola. Es la diferencia entre tener agentes y tener código de agentes |
| **0.2** | Poner las credenciales reales de WhatsApp y Chatwoot (hoy `SIN_CONFIGURAR`) | Depende de Sergio (bloqueo #3 de `PLAN.md`) | Absolutamente todo lo que sigue |
| **0.3** | Apagar o reencaminar los workflows de n8n que envían WhatsApp por su cuenta | Horas | Que un paciente no reciba el mismo mensaje dos veces |
| **0.4** | Probar el lazo completo con un número real: agente propone → aprobar en `/pending` → llega el WhatsApp | Medio día | **Es el único paso que convierte "construido" en "funciona"** |

> Ojo: `ONIA_PARQUEADO_20260730.md` §2 dice *"aprobar no dispara nada"*. Eso era cierto
> al 30-jul; el 31-jul se agregó `20260731000000_add_onia_core_dispatches` y
> `dispatchApprovedAction`. **Existe el código. No hay evidencia de que se haya probado
> punta a punta con un número real.** El paso 0.4 no es opcional.

## Paso 1 — El bot con herramientas (el salto de valor más grande)

**Qué:** hoy el bot es un menú 1-4 y una llamada a `gpt-4o-mini` que **no puede consultar
nada** (`whatsapp-ai.ts`: sin `tools`, sin historial, `[system, user]` y nada más). El
salto es darle **tool calling** con 5-6 herramientas de **solo lectura**:

`proxima_cita` · `horarios_y_direccion` · `precio_de_lista(tratamiento)` ·
`huecos_libres(rango)` · `estado_de_saldo` · `escalar_a_humano`

Y hacerlo **entrar por `normalizeIntake`** en vez de escribir directo en `Appointment`,
como manda `intakePolicy` — hoy `handleInboundMessage` toca `prisma.appointment.update`
sin work item, sin `ActivityEvent` y sin dedupe, y por eso el bot **no aparece en el
panel del dueño**.

**Reusar, no reinventar:** el patrón `DataSourceContext` del bot de Bolivian Electric
(herramientas inyectadas con `role` + `organizationId`) es exactamente esto, y ya está
escrito.

**Por qué primero:** entre el 60% y el 80% de los WhatsApp que hoy contesta la recepción
son las 5 preguntas de arriba. **[VERIFICAR con datos reales de una clínica — hoy es una
estimación, no un dato.]** Es la única capacidad que le saca horas al día, todos los días.

**Esfuerzo:** medio (2-3 días). **Valor: el más alto de la lista.**

## Paso 2 — Agendar desde el bot, con reglas duras

Solo huecos realmente libres, solo tratamientos con duración conocida, 1 cita por paciente
por día, y confirmación explícita del paciente. Fuera de esas reglas → `/pending`.

Esfuerzo: medio. Valor: alto (agendar es lo que más interrumpe a la recepción).

## Paso 3 — Lector de documentos para la importadora

Subir el PDF/Excel del proveedor → la IA extrae filas → **`dry_run` obligatorio** (ya lo
exige el contrato) → el humano aprueba el lote → recién ahí toca precios.

Esfuerzo: medio-alto. Valor: **el más alto del rubro eléctrico**, y es lo que hace que el
pack importadora deje de ser un menú vacío.

**Prerrequisito duro:** la fuente diaria del TCO del BCB. Sin ella, `officialRate()`
lanza excepción a propósito, y toda la ruta de precio se cae. El orden es
**fuente de TCO → portar `fx` → herramienta de precio**, nunca al revés.

## Paso 4 — El resumen del día para el dueño

*"Ayer: 8 citas, 2 faltaron, entraron Bs 3.200, 3 presupuestos sin respuesta hace más de
una semana. Hoy tenés 6 citas y 2 huecos a las 15:00 y 16:30."*

Los datos ya los calculan `WF-06` y los feeds de los agentes. Lo que agrega la IA es la
**lectura** (qué cambió, qué merece atención), no el número.

Esfuerzo: bajo. Valor: medio-alto — es lo que hace sentir que el sistema *trabaja para
vos*, y cuesta centavos (§4).

## Paso 5 — Redacción con IA de los mensajes de los agentes

Hoy `buildRecallMessage()` es una plantilla fija. Con IA, el mensaje se adapta al
paciente.

**Pero hay un techo legal que hay que entender antes de venderlo:** fuera de la ventana
de 24 h **solo se pueden enviar plantillas pre-aprobadas por Meta**. La IA **no puede
redactar libremente** un mensaje saliente: solo puede elegir la plantilla y rellenar sus
parámetros. **Adentro** de la ventana sí puede redactar libre.

Consecuencia: este paso vale para la **conversación** (paso 1), no para el **recall**.
Baja de prioridad.

Esfuerzo: bajo. Valor: **bajo** (por el techo de Meta).

## Paso 6 — Búsqueda semántica sobre el conocimiento del negocio

El módulo `knowledge` del core **no está portado y ni siquiera figura en `MODULE_IDS`**.
Requiere pgvector, chunking, indexado y reindexado. Es la capacidad con **peor relación
valor/esfuerzo** de la lista: alto costo, y hasta que no haya un corpus real de un cliente
(fichas técnicas, protocolos), no tiene qué indexar.

**Último. No antes de tener clientes.**

## 3.1 Resumen del orden

| Paso | Esfuerzo | Trabajo que saca | Prioridad |
|---|---|---|---|
| 0.1-0.4 Encender lo construido | Horas | Todo lo demás depende | **Ya** |
| 1. Bot con herramientas | Medio | El más alto | **1º** |
| 2. Agendar con reglas | Medio | Alto | 2º |
| 3. Lector de documentos (importadora) | Medio-alto | Alto (ese rubro) | 3º |
| 4. Resumen del día | **Bajo** | Medio-alto | 4º (se puede colar antes) |
| 5. Redacción con IA | Bajo | **Bajo** (techo de Meta) | 5º |
| 6. RAG / knowledge | **Alto** | Medio | Último |

---

# 4. Cuánto cuesta

**Tipo de cambio de referencia: ~Bs 11,4 por USD.** Post-flotación (RM 245/2026, RD BCB
88/2026). **[VERIFICAR: usar el TCO del BCB del día. La cifra se movió entre 11,37 y
11,89 en las últimas semanas y sigue flotando.]**

## 4.1 Precios de las APIs de IA — consultados el 2026-08-01

| Proveedor | Modelo | Input US$/1M | Output US$/1M | Cached input | Fuente |
|---|---|---:|---:|---:|---|
| OpenAI | **gpt-5-nano** | 0,05 | 0,40 | 0,005 | [developers.openai.com/api/docs/pricing](https://developers.openai.com/api/docs/pricing) |
| OpenAI | **gpt-4o-mini** *(el que usa el bot hoy)* | 0,15 | 0,60 | 0,075 | idem |
| OpenAI | **gpt-4.1-mini** | 0,40 | 1,60 | 0,10 | idem |
| Google | Gemini 2.5 Flash-Lite | 0,10 | 0,40 | 0,01 | [ai.google.dev/gemini-api/docs/pricing](https://ai.google.dev/gemini-api/docs/pricing) |
| Anthropic | Claude Haiku 4.5 | 1,00 | 5,00 | 0,10 | [platform.claude.com/docs/en/about-claude/pricing](https://platform.claude.com/docs/en/about-claude/pricing) |
| OpenAI | text-embedding-3-small | 0,02 | — | — | idem OpenAI |
| OpenAI | gpt-4o-mini-transcribe | **US$ 0,003 / minuto** | — | — | idem OpenAI |
| OpenAI | Whisper | US$ 0,006 / minuto | — | — | idem OpenAI |

**Descuentos que sí mueven la aguja:**
- **Prompt caching**: OpenAI cobra el input cacheado al **10%** (90% de descuento).
  Anthropic, `cache read = 0,1x`. Un bot con system prompt largo y repetido es el caso
  perfecto. *[VERIFICAR: el umbral mínimo de tokens para que OpenAI active el caché
  automático no está en la página de precios.]*
- **Batch API**: **50%** de descuento (OpenAI, Anthropic, Google). Todo lo nocturno
  (resúmenes, clasificación de cartera, redacción de propuestas de recall) va por batch.
- **Español consume más tokens que inglés.** Regla de trabajo: **~350 tokens por 1.000
  caracteres** de español. *(Derivado de la regla oficial de ~4 caracteres por token +
  el ratio español/inglés; no es una cita literal — medir con `tiktoken` sobre el corpus
  real antes de fijar precio.)*

## 4.2 Costo de IA por cliente y por mes

**Supuestos de una clínica del plan Bs 320** (`ONIA_VALOR_Y_ESCALERA_PLANES`: 1-2
sillones, ~400 fichas, ~150 citas/mes). Volúmenes estimados por mí, **no medidos con un
cliente real** — no hay ninguno.

| Capacidad | Volumen supuesto | Modelo | US$/mes | Bs/mes |
|---|---|---|---:|---:|
| **Bot conversacional** (paso 1) | 600 mensajes de texto libre; ~1.250 tok in + 120 out | gpt-4o-mini | **0,156** | 1,78 |
| ídem, **con prompt caching** | mismo | gpt-4o-mini | **0,06** | 0,68 |
| ídem, **con gpt-5-nano** | mismo | gpt-5-nano | **0,066** | 0,75 |
| **Clasificador de intención** | 600 × (300 in + 20 out) | gpt-5-nano | 0,014 | 0,16 |
| **Redacción de propuestas** (recall + cobranza) | 70 × (800 in + 150 out), por batch | gpt-4.1-mini | 0,02 | 0,23 |
| **Resumen diario + semanal** (paso 4) | 34 × (3.000 in + 500 out) | gpt-4.1-mini | 0,068 | 0,78 |
| **Transcripción de notas de voz** | 100 audios × 30 s = 50 min | gpt-4o-mini-transcribe | 0,15 | 1,71 |
| **Embeddings** (si se hace RAG) | indexar 400 fichas + 300 consultas | embedding-3-small | 0,005 | 0,06 |
| **TOTAL clínica chica** | | | **≈ 0,40** | **≈ Bs 4,60** |

**Contraste con el gasto real medido:** LiteLLM del VPS registró **US$ 0,20 en 159
requests en 10 días** — con prompts largos de agentes internos. Es el mismo orden de
magnitud. Los números de arriba son creíbles.

**Escalado:**

| Perfil | Plan | IA US$/mes | % del plan |
|---|---|---:|---:|
| Consultorio (≤300 fichas) | Bs 190 | ~0,20 (Bs 2,3) | **1,2%** |
| Clínica (400 fichas, 150 citas) | Bs 320 | ~0,40 (Bs 4,6) | **1,4%** |
| Profesional (600 fichas, 200 citas) | Bs 750 | ~0,70 (Bs 8) | **1,1%** |
| Clínica Plus (1.000 fichas, 280 citas) | Bs 1.500 | ~1,25 (Bs 14) | **0,9%** |
| **Bot muy conversado** (5.000 msg/mes, sin caché) | cualquiera | ~1,30 (Bs 15) | — |

**Veredicto: el plan de Bs 320 aguanta toda la IA de este documento, con margen enorme.**
El costo de IA no llega al 2% del precio en ningún escalón. Ningún plan hay que dejar sin
IA por costo de modelo.

**Lo que sí hay que poner en todos los planes: un tope.** No porque el promedio sea caro,
sino porque un tenant abusivo o un bucle mal escrito puede multiplicar eso por 100 sin que
nadie lo vea. Hoy **no hay medición de tokens por organización** (el producto llama a
OpenAI directo, esquivando el tope de LiteLLM). Eso es lo que hay que construir, no un
modelo más barato.

## 4.3 El costo que sí importa: WhatsApp

**Bolivia no tiene tarifa propia.** Meta la agrupa en **"Rest of Latin America"** (código
591 / BO), verificado en la doc de Meta
([updates-to-pricing](https://developers.facebook.com/docs/whatsapp/pricing/updates-to-pricing/)).

| Categoría | US$ por mensaje entregado |
|---|---:|
| **Marketing** | **0,0851** |
| **Utility** | **0,0130** |
| **Authentication** | **0,0130** |

> **[VERIFICAR — importante].** Meta **no publica los números en HTML**, solo como CSV
> descargable. Estas cifras vienen de dos fuentes secundarias independientes que coinciden
> exactamente y declaran reproducir el rate card del 1-jul-2026
> ([SleekFlow](https://help.sleekflow.io/en_US/whatsapp/pricing),
> [Gallabox](https://docs.gallabox.com/pricing-and-billing-modules/new-per-message-pricing)).
> **Bajar el CSV oficial desde
> [developers.facebook.com/docs/whatsapp/pricing#rate-cards](https://developers.facebook.com/docs/whatsapp/pricing#rate-cards)
> antes de usarlas para fijar precio.**
>
> Dato de diseño que sale solo: **marketing cuesta 6,5 veces más que utility en Bolivia.**
> La categoría de cada plantilla decide la plata.

**La misma clínica de Bs 320, hoy:**

| Concepto | Volumen | Categoría | US$/mes | Bs/mes |
|---|---|---|---:|---:|
| Recordatorios 24 h + 2 h | 300 | utility | 3,90 | 44,5 |
| Recall (pacientes que no vuelven) | 40 | **marketing** | 3,40 | 38,8 |
| Cobranza | 30 | utility | 0,39 | 4,4 |
| Respuestas del bot dentro de la ventana | 600 | servicio | **0,00 hoy** | 0 |
| **TOTAL WhatsApp** | | | **≈ 7,70** | **≈ Bs 88** |

**WhatsApp cuesta 20 veces más que toda la IA junta.** Y equivale al **27% de un plan de
Bs 320**.

### El 1-oct-2026 esto se rompe

Meta ya tiene calendarizado
([non-template-messages](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages)):

- **Los mensajes de servicio** (las respuestas libres del bot dentro de la ventana de
  24 h) **pasan a cobrarse**, a la tarifa de utility del mercado, **sin volume tiers**.
- **Las plantillas utility dentro de la ventana** vuelven a cobrarse (son gratis desde el
  1-jul-2025).

Para la misma clínica: **+600 mensajes × US$ 0,0130 = +US$ 7,80/mes**. El costo de
WhatsApp **casi se duplica**, a ~US$ 15,50/mes ≈ **Bs 177** — más de la mitad de un plan
de Bs 320.

> **Coincidencia que hay que tener en el radar:** el 1-oct-2026 es también la fecha en que
> caduca la homologación SIAT. Dos relojes distintos, la misma semana.

### Por qué esto no destruye el margen de Onia (y qué problema crea en cambio)

Por los **Tech Provider Terms**, **Meta le factura al cliente final, no a Onia**
([get-started-for-tech-providers](https://developers.facebook.com/documentation/business-messaging/whatsapp/solution-providers/get-started-for-tech-providers)):
*"clients onboarded by Tech Providers must provide their own payment method"*.

Eso convierte un problema de margen en un **problema de onboarding**: cada clínica
boliviana necesita **una tarjeta que Meta acepte para cobros en USD**.

> **[VERIFICAR — el riesgo más alto de todo este documento].** No pude confirmar si
> Bolivia está en la lista de países soportados para pago con tarjeta en Meta. La página
> ([facebook.com/business/help/419761233006366](https://www.facebook.com/business/help/419761233006366))
> se renderiza por JavaScript y no es legible automáticamente. **Hay que abrirla a mano.**
> Con el control cambiario post-flotación, que una clínica de Santa Cruz tenga una tarjeta
> que le funcione a Meta es probablemente un obstáculo **más grande que el App Review**.
> Si eso falla, el chatbot de WhatsApp no se puede vender, por más que el código funcione.

---

# 5. Qué NO se puede prometer

Sección obligatoria. Cada punto tiene fuente.

## 5.1 No se puede cobrar por los mensajes de WhatsApp

**Meta Business Messaging Technology Provider Terms**, vigentes desde el **31-jul-2026**
([facebook.com/legal/BM-tech-provider-terms](https://www.facebook.com/legal/BM-tech-provider-terms)):

> *"You agree that you will not […] (i) resell Applicable Platforms, including […]
> **charging a fee for your Customers' use of the WhatsApp Business Platform**"*

**Qué toca esto en Onia, concretamente:** el add-on de WhatsApp vende hoy un cupo de
**200 mensajes/mes** (`lib/pricing.ts` → `WHATSAPP_ADDON.meta.operationalMonthlyLimit`,
verificado en el código). Vendido como *"200 mensajes incluidos"*, **es lo que el contrato
prohíbe**.

**El arreglo no es técnico, es de redacción y de encuadre:**
- **No se vende:** "X mensajes incluidos", "WhatsApp incluido", markup por mensaje, ni
  pagar el consumo del cliente y refacturarlo.
- **Sí se vende:** el **chatbot**, la **integración**, la **automatización**, el
  **soporte** y la **configuración**. Eso es software, y es lo que Onia cobra.
- El cupo de 200 se mantiene **como límite operativo del software** (protege el
  rendimiento y evita que un tenant dispare el gasto del cliente), **no como mercadería**.
- La clínica pone su propia tarjeta y **le paga a Meta directo**. Hay que decirlo desde el
  primer minuto de la venta, no descubrirlo en el onboarding.

**[VERIFICAR con abogado antes de mandar una propuesta.]** No soy abogado y esto es un
contrato vigente hace dos días.

## 5.2 No se puede escribirle a quien no dio opt-in

**WhatsApp Business Messaging Policy** ([whatsappbusiness.com/policy](https://whatsappbusiness.com/policy/)):

> *"You may only contact people on WhatsApp if: (a) they have given you their mobile phone
> number; and (b) you have received opt-in permission from the recipient confirming that
> they wish to receive subsequent messages or calls from you."*

El opt-in debe **declarar que la persona acepta recibir mensajes** y **nombrar al negocio**
([getting-opt-in](https://developers.facebook.com/documentation/business-messaging/whatsapp/getting-opt-in)).
Se puede recoger en web, SMS, teléfono **o en papel firmado**.

**Traducción operativa:**
- **Lista comprada: NO.** Incumple los dos requisitos a la vez.
- **La cartera histórica de la clínica: NO**, si no dio opt-in. Ni promociones **ni
  recordatorios** — el requisito aplica a **toda** plantilla, incluidas las utility.
- Esto tiene una consecuencia de producto directa: **el onboarding de una clínica tiene
  que incluir recolectar el opt-in de su cartera**, y el sistema tiene que **registrarlo
  por paciente** (hoy solo existe `optedOut` en el feed de recall — la ausencia de "no"
  no es un "sí").

**[VERIFICAR]:** Meta no especifica qué formato de evidencia de opt-in hay que conservar.
Criterio propio: guardar timestamp, canal, el texto exacto que se mostró y quién lo aceptó.

**Enforcement, si se ignora**
([policy-enforcement](https://developers.facebook.com/documentation/business-messaging/whatsapp/policy-enforcement)):
warning → bloqueo de plantillas 1-3 días → bloqueo total 5/7/30 días → **account lock
indefinido** → baja permanente. Disparadores citados: spam, **misclasificación de
plantillas** y *"excessive negative feedback from users"*.

## 5.3 El bot no puede escribir libremente cuando quiera

- La ventana de servicio dura **24 h** desde el último mensaje del usuario, y se reinicia
  si vuelve a escribir. **Dentro**: mensajes libres. **Fuera**: *"you can only send
  pre-approved template messages"*
  ([send-messages](https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/send-messages)).
- **Por lo tanto: la IA no redacta mensajes salientes.** Fuera de la ventana solo puede
  elegir una plantilla aprobada y rellenar sus parámetros. Es el techo que baja el paso 5
  de prioridad (§3).
- **No se promete "el sistema le escribe a tus pacientes lo que haga falta".** Se promete
  *"el sistema te dice a quién hay que escribirle y te deja el mensaje listo"*.

## 5.4 No se pueden mandar datos clínicos

La Business Messaging Policy trae una cláusula específica:

> *"Don't use WhatsApp for telemedicine or to send or request any health related
> information, if applicable regulations prohibit distribution of such information to
> systems that do not meet heightened requirements."*

Es condicionada a la regulación local. **[VERIFICAR: si Bolivia tiene normativa de datos
sensibles de salud que active esta cláusula.]** Además, la **Commerce Policy** prohíbe la
categoría *"Medical and healthcare products"* — eso aplica a **vender productos** por
catálogo, no a los servicios de una clínica.

**Regla operativa (criterio propio):** la plantilla lleva **nombre, fecha, hora y lugar**.
**Nunca** diagnóstico, tratamiento, resultado ni motivo de consulta. Un WhatsApp lo lee
cualquiera que agarre el teléfono.

Y prohibición explícita adicional: no enviar números completos de tarjeta, cuentas
financieras ni documentos de identidad.

## 5.5 No se puede prometer volumen

Los tiers cambiaron el **7-oct-2025**
([messaging-limits](https://developers.facebook.com/documentation/business-messaging/whatsapp/messaging-limits)).
Son destinatarios **únicos** por ventana móvil de 24 h, contados **solo fuera de la
ventana de servicio**, y **a nivel de business portfolio**, no por número:

**250 → 2.000 → 10.000 → 100.000 → ilimitado.** *(El tier de 1.000 ya no existe.)*

**El cuello de botella real para Onia no es el volumen, es la cantidad de números:**

| Estado del portfolio | Números de teléfono permitidos |
|---|---:|
| Nuevo / **no verificado** | **2** |
| Verificado (o con límite de 2.000) | 20 |

La arquitectura decidida es **un número de WhatsApp por cliente** bajo la App única de
Onia (y es lo que el código ya hace: el webhook resuelve el tenant por
`whatsappPhoneNumberId`). Entonces:

> **Hasta que la verificación de negocio de Meta esté aprobada, Onia puede tener como
> máximo DOS clientes con WhatsApp.** Y la verificación de negocio figura **en pausa por
> SEPREC**. Ese es el techo duro de crecimiento del canal, y no se arregla con código.

Documentación que exige la verificación: identificación tributaria de la empresa (no
personal), documento de constitución o registro, e identificación con foto de los
beneficiarios finales (≥10%). Debe coincidir con los datos legales reales: `OniaAgency`,
matrícula 5371375010, propietaria Leslie Mercado Moreno.

**[VERIFICAR]:** Meta **no publica un plazo oficial** de la verificación de negocio. El
"hasta 14 días hábiles" que circula es de blogs de terceros, no de Meta. **No poner fecha
en una propuesta.**

## 5.6 No se puede prometer que va a seguir siendo gratis

El 1-oct-2026 se empiezan a cobrar los mensajes de servicio y las utility dentro de la
ventana (§4.3). **Cualquier propuesta que hoy diga "las respuestas del bot son gratis"
caduca en dos meses.** Y por §5.1 Onia no puede absorber ese costo cobrándolo como
mercadería. La consecuencia comercial es concreta: **el contrato con el cliente necesita
la misma cláusula de ajuste que ya se usa para el tipo de cambio**, aplicada a las
tarifas de Meta.

## 5.7 No se puede prometer diagnóstico, ni cotización automática

- **Diagnóstico o consejo clínico por IA: nunca.** Ya está en el system prompt del bot
  ("no inventar precios ni diagnósticos") y así se queda.
- **Cotización automática sin humano: no.** Un precio por WhatsApp es una oferta. Además,
  sin fuente diaria del TCO del BCB el core **lanza excepción a propósito** — cotizar con
  la tasa vieja (6,96 contra ~11,4) factura ~40% de menos.
- **"100% automático, no tocás nada": no**, y no conviene. El patrón es
  propone → aprueba → ejecuta, y **eso es el argumento de venta**, no una limitación:
  *"no manda nada sin tu permiso"*.

---

# 6. Agentes instalados en la empresa del cliente vs. todo centralizado

**Recomendación: centralizado. Sin excepciones, hoy.** Una sola salvedad, que ya existe y
tiene precio.

## 6.1 Por qué no instalado

| Lo que se ganaría | Lo que costaría de verdad |
|---|---|
| "Los datos no salen" | Ya no salen en el sentido que importa: la base del tenant vive en el VPS de Onia y el LLM solo ve el fragmento que se le manda. El problema real es **qué se le manda**, y eso se resuelve con seudonimización (§6.3), no con hardware |
| "Funciona sin internet" | **Sin internet no hay WhatsApp.** La automatización principal muere igual. El beneficio real es mucho más chico de lo que suena |
| "El cliente se siente dueño" | Cada instalación es un servidor que hay que **actualizar, respaldar, monitorear y parchear**. Con N clientes son N versiones distintas en la calle y N superficies de ataque |
| — | Un bug de seguridad se arregla **una vez** en central y **N veces** instalado |
| — | **Onia tiene cero clientes.** Mantener flota antes de tener el primero es gastar el runway (≈11 semanas) en el problema equivocado |

Y la razón de arquitectura, que es la más fuerte: **el contrato del core ya decidió esto.**
`external_gate` saca el transporte afuera y deja las herramientas adentro del producto,
*"porque las herramientas son queries a los datos del tenant"*. Instalar agentes en la
empresa del cliente rompe ese reparto: obliga a que un proceso de afuera hable con la base
del tenant, que es exactamente lo que el contrato evita.

## 6.2 La única excepción, y ya tiene nombre y precio

**Onia Empresa** — ya existe en la escalera de planes: *cotizado, desde Bs 4.500/mes +
Bs 12.000 de implementación*, para 3+ sedes o clientes que exijan los datos adentro
(`ONIA_VALOR_Y_ESCALERA_PLANES_20260731.md` §2.3).

Es la respuesta correcta: **no es una arquitectura por defecto, es una venta cotizada**.
Si aparece un cliente que lo pide y lo paga, se cotiza. Mientras tanto, no se construye.

## 6.3 Lo que sí conviene hacer, y es barato

**Seudonimizar antes de llamar al modelo.** Reemplazar nombre, teléfono y documento por
tokens (`{{PACIENTE_1}}`, `{{TEL_1}}`) antes de la llamada, y rehidratar en la respuesta.

- Da el **80% del beneficio** de "los datos no salen" a costo casi cero.
- Es lo que se puede escribir de verdad en el **anexo de tratamiento de datos** que
  `PLAN.md` §2 señala como faltante en el borrador legal.
- Es más honesto que prometer que nada sale.

**Lo que NO conviene:** modelo local en el VPS. El servidor es 4c/16GB y ya corre ~40
contenedores; un modelo local decente no entra, y el ahorro sería de **US$ 0,40 por
cliente por mes** (§4.2). Se pagaría con degradación de calidad y con la RAM del panel.

---

# 7. Lo que hay que verificar antes de construir

| # | Qué | Por qué bloquea | Quién |
|---|---|---|---|
| 1 | **Bajar el CSV oficial de rate cards de Meta** y confirmar las tarifas de "Rest of Latin America" | Todo el costeo de §4.3 | Cualquiera |
| 2 | **¿Meta acepta tarjetas bolivianas?** Abrir a mano `facebook.com/business/help/419761233006366` | Si no, el chatbot no se puede vender | Sergio |
| 3 | **Verificación de negocio en Meta** (hoy en pausa por SEPREC) | Techo de **2 clientes** con WhatsApp | Sergio |
| 4 | **Revisar con abogado el add-on de WhatsApp** contra los Tech Provider Terms | Es un contrato vigente hace 2 días | Sergio + abogado |
| 5 | **Fuente diaria del TCO del BCB** | Sin ella, toda la ruta de precio de la importadora lanza excepción | Técnico |
| 6 | **Probar el lazo aprobar → enviar con un número real** | "Construido" no es "funciona" | Técnico |
| 7 | **Normativa boliviana de datos sensibles de salud** | Activa o no la cláusula de telemedicina de Meta | Abogado |
| 8 | **Medir con una clínica real** cuántos WhatsApp/mes recibe y qué preguntan | Todo §4.2 son estimaciones mías, no datos | Sergio |

---

## Fuentes

**Meta / WhatsApp** (consultadas 2026-08-01):
[pricing](https://developers.facebook.com/docs/whatsapp/pricing) ·
[updates-to-pricing](https://developers.facebook.com/docs/whatsapp/pricing/updates-to-pricing/) ·
[non-template-messages](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages) ·
[send-messages](https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/send-messages) ·
[getting-opt-in](https://developers.facebook.com/documentation/business-messaging/whatsapp/getting-opt-in) ·
[messaging-limits](https://developers.facebook.com/documentation/business-messaging/whatsapp/messaging-limits) ·
[policy-enforcement](https://developers.facebook.com/documentation/business-messaging/whatsapp/policy-enforcement) ·
[get-started-for-tech-providers](https://developers.facebook.com/documentation/business-messaging/whatsapp/solution-providers/get-started-for-tech-providers) ·
[Tech Provider Terms](https://www.facebook.com/legal/BM-tech-provider-terms) (31-jul-2026) ·
[Business Messaging Policy](https://whatsappbusiness.com/policy/)

**Precios de IA** (consultados 2026-08-01):
[OpenAI](https://developers.openai.com/api/docs/pricing) ·
[Anthropic](https://platform.claude.com/docs/en/about-claude/pricing) ·
[Google](https://ai.google.dev/gemini-api/docs/pricing)

**Verificado por mí** (2026-08-01): código de `onia-platform` (solo lectura) · VPS
`187.77.16.63` por SSH — `docker ps`, entorno de los contenedores `onia-platform`, `n8n`
y `litellm`, `n8n list:workflow`, `n8n export:workflow --all`, y `LiteLLM_SpendLogs`.

**Docs internos:** `PLAN.md` (manda) ·
`ONIA_CORE_Y_MODULOS_ANALISIS_20260731.md` (§3.3 reparto de capas, §3.4 herramientas de
importadora, §3.5 un número por cliente) ·
`ONIA_VALOR_Y_ESCALERA_PLANES_20260731.md` (escalera de planes) ·
`ONIA_PLATFORM_ESTRUCTURA_20260730.md` · `ONIA_PARQUEADO_20260730.md`
