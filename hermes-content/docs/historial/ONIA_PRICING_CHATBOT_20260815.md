# ONIA — Pricing del chatbot, costo real y reconciliación de listas

**Fecha:** 2026-08-15
**Por qué existe este doc:** Sergio, mirando la web de precios, dijo dos cosas:
> *"el chatbot esta muy barato y recuerda todas las funciones"*
> *"grupo clinico? eso de que es"*

**Qué responde:** qué hace de verdad el chatbot (código, no marketing), cuánto cuesta
realmente una conversación, UN precio recomendado con su punto de equilibrio, cuál de las
listas de precios manda, y qué se hace con "Grupo Clínico".

**Convenciones de este doc:**
- `[cálculo propio]` = cuenta hecha acá sobre datos citados.
- **NO VERIFICADO** = no se pudo confirmar contra fuente primaria. No se inventa un número.
- (†) = fuente de tercero, no del vendor.
- **Tipo de cambio usado: Bs 12,08/USD** — TCO del BCB al 3-ago-2026
  ([BCB, última cotización](https://www.bcb.gob.bo/tco_reporte_ultima_cotizacion.php)).
  ⚠️ Los docs internos previos usaron **11,1 y 11,37**: todas sus cifras en Bs quedan
  cortas entre **6% y 9%**.

---

## 0. Resumen — las cuatro decisiones

| # | Decisión | En una línea |
|---|---|---|
| 1 | **Sergio tiene razón: el chatbot con IA está subpreciado.** | El nivel estrella cobra **Bs 550/mes** por algo que sustituye ~1/3 de una recepcionista y cuya IA cuesta **Bs 0,04 por conversación**. Recomendado: **Bs 1.490/mes**. |
| 2 | **El nivel de recordatorios (N1, Bs 200) hay que retirarlo, no subirlo.** | Compite contra competidores locales que lo dan **gratis**, y **pierde plata a 199 mensajes/mes** si Meta recategoriza su plantilla. Va incluido en Pro. |
| 3 | **"Grupo Clínico" se ELIMINA como nombre.** | Es herencia dental de junio-2026. Sus límites son **idénticos** a los de Full (Bs 1.500) y su promesa central (multi-sede consolidada) **no existe en la base de datos**. |
| 4 | **Hay DIEZ fuentes de precio vivas, no tres.** | Solo para "chatbot" circulan **seis precios** a la vez (setup Bs 990→3.500 = 3,5x; mensual Bs 80→900 = 11x). Fuente de verdad única: `onia-platform/lib/pricing.ts`. |

**🔴 Fecha que fuerza la mano: 1-oct-2026.** Meta empieza a cobrar las respuestas dentro de
la ventana de 24 h. Hoy la web de Onia le promete al cliente lo contrario, por escrito.
Quedan ~7 semanas.

**Y el hallazgo que sostiene todo lo demás:** hay **más funciones construidas que vendidas, y
más vendidas que encendidas**. Los agentes Recall y Cobrador —los que justifican el precio
nuevo— están completos, con tablas migradas y UI, y **no está confirmado que un reloj los
dispare en producción** (§1.4). Verificarlo son 10 minutos y es **prerrequisito de publicar
Bs 1.490**: si no corren, se estaría vendiendo lo que está apagado.

---

## 1. Qué hace realmente el chatbot

> Inventario hecho sobre código, no sobre marketing. En esta casa **"construido" no es
> "terminado"**: una función solo cuenta si está encendida en producción y verificada ahí.

**No hay un chatbot: hay cuatro sistemas distintos.**

| Sigla | Qué es | Dónde |
|---|---|---|
| **BE** | Bot del cliente Bolivian Electric (Next.js + Chatwoot, VPS propio) | `C:\dev\clientes\Bolivian Electric` |
| **BOT-ONIA** | Bot propio de la agencia (motor agnóstico de canal, `.mjs`) | `C:\dev\proyectos\onia-hermes\hermes-content\deploy\vps-ops\bot\` |
| **PLATFORM** | El producto que se le vende al cliente | `C:\dev\proyectos\onia-platform` |
| **CORE** | Contrato/spec. **No ejecuta nada** | `onia-core/` |

### 1.1 FUNCIONA HOY

**PLATFORM — lo que un cliente que paga el add-on recibe de verdad:**

| Capacidad | Ruta | Evidencia |
|---|---|---|
| **Bot de WhatsApp entrante con menú determinista** | `C:\dev\proyectos\onia-platform\app\api\webhooks\whatsapp\route.ts` → `lib\whatsapp-bot.ts` | HMAC `x-hub-signature-256` con `timingSafeEqual`; **multi-tenant en la lectura** (resuelve la clínica por `whatsappPhoneNumberId`); escribe la tabla `whatsapp_sessions`. Opciones 1-4: ver cita, confirmar, cancelar, horarios |
| **Escalada a humano bidireccional vía Chatwoot** | `lib\chatwoot.ts` + `app\api\webhooks\chatwoot\route.ts` | Las palabras `agente/humano/asesor` crean conversación en Chatwoot; la respuesta del agente vuelve al paciente. Secreto obligatorio (500 si falta, 401 si no calza) |
| **Recordatorios de cita por cron** | `app\api\cron\appointment-reminders\route.ts`, registrado en `vercel.json` (`0 12 * * *`) | Auth `Bearer CRON_SECRET`, 503 si el secreto es placeholder |
| **Generadores de work items** (lo más cerca de un agente vivo) | `lib\onia-core\generators.ts` + `app\api\cron\onia-core-workitems\route.ts` (cron `0 11 * * *`) | Escribe `OniaCoreWorkItem`: no-asistió→seguimiento, factura vencida→cobro, presupuesto 7d→seguimiento, recordatorio fiscal IVA/IT. **Con dedupe: idempotente** |
| **Cola de aprobación `/pending` que EJECUTA al aprobar** | `app\(dashboard)\pending\page.tsx`, `app\api\onia-core\approvals\route.ts`, `lib\onia-core\dispatch\dispatcher.ts` | Migración `20260731000000_add_onia_core_dispatches` aplicada. Idempotencia por `approvalId` UNIQUE; transiciones condicionales; **no finge envíos** (si falla queda `failed` con el error visible) |
| **Guardrail de cupo antes de tocar la red** | `lib\onia-core\dispatch\channels.ts` | `checkWhatsAppAddon` fail-closed |
| **Tablas de agentes migradas** | `prisma\migrations\20260728000000_add_onia_agents` | `OniaAgentsAgent` / `Run` / `Action` existen en la base |

**BE — Bolivian Electric, el único bot con tráfico real de WhatsApp:**

| Capacidad | Evidencia |
|---|---|
| **Atiende WhatsApp real en MODO SOMBRA** (inbox 3, +59171353296) | `apps\web\lib\chatwoot-webhook.ts` (1.876 líneas). Con `SEND_PUBLIC_REPLIES=false` **sí** sale: nota privada al vendedor con disponibilidad por ciudad, etiquetas (`be_producto_detectado`, `be_prospecto_nuevo`, `be_needs_human`) y **auto-asignación al vendedor** |
| **Storefront `/tienda` en producción** | Verificado **en el contenedor desplegado** (2026-08-13, `ced83ff`): 19.839 productos, búsqueda, checkout → `mode:whatsapp` |
| **Transcripción de notas de voz + respuesta IA con guardrails** | `lib\openai-client.ts`: `gpt-4o-mini` + `gpt-4o-mini-transcribe`. La IA **nunca** afirma stock ni precio |
| **Cron SLA cada 2 min + recordatorios lunes 08:00** | Workflows n8n `be-sla-reassign.json`, `be-reminders.json` |
| **1.503 tests verdes, build incluido** | `npm run validate` |

### 1.2 CONSTRUIDO PERO APAGADO / NO CABLEADO

| # | Capacidad | Ruta | Qué falta EXACTAMENTE |
|---|---|---|---|
| 1 | 🔴 **Los agentes Recall / Cobrador / Captador** | `onia-platform\app\api\cron\onia-agents\route.ts` + `lib\onia-core\modules\agents-runtime.ts` | El runtime está completo (`recall`: pacientes sin volver 180 d, cooldown 30 d · `cobrador`: saldos vencidos y fiados · `captador`: leads cada 30 min). **`/api/cron/onia-agents` NO figura en `vercel.json`** (solo hay 3 crons y este no es uno). Ver §1.4: hay una contradicción con lo verificado en prod |
| 2 | **Respuestas públicas del bot de BE al cliente** | `BE\apps\web\lib\chatwoot-webhook.ts`, acción `public_reply` | 4 flags simultáneos en `false`. **El bloqueante real no es código: es la aprobación de los textos por gerencia** |
| 3 | **Envío proactivo por plantilla HSM en BE** | `BE\apps\web\lib\whatsapp-templates.ts` + `proactive-template-send.ts` | **4 plantillas sin someter a Meta** (`seguimiento_cotizacion`, `reactivacion_cliente`, `aviso_pedido`, `cotizacion_lista`) + Advanced Access de `whatsapp_business_messaging` |
| 4 | **Cron de seguimientos +2/+5/+15 y reactivación (BE)** | `BE\apps\web\app\api\cron\follow-ups\route.ts` | El endpoint es real e idempotente, pero **ningún workflow de n8n lo dispara** (solo existen `be-reminders` y `be-sla-reassign`) |
| 5 | **Bot propio de ONIA por Chatwoot** | `hermes-content\deploy\vps-ops\bot\bot-engine.mjs` | **Probado punta a punta el 2026-07-26**: calificó, ofreció 2 horarios reales de Cal.com, creó el lead y posteó de verdad. Frenos: n8n `bJhSGHPYsaICEeKm` con `active:false` a propósito + `ONIA_BOT_DRY_RUN=true`. **Falta el OK de Sergio, no código** |
| 6 | **Reserva real en Cal.com desde el bot propio** | `bot\calcom-booking.mjs` | `CALCOM_BOT_EVENT_TYPE_ID` vacío |
| 7 | **Canal manual `wa.me`** (el que evita depender de Meta) | `onia-platform\lib\onia-core\dispatch\channels.ts:90-125` | El adapter existe; `resolverCanalEfectivo` está **definida pero no cableada A PROPÓSITO** (al cablearla el despacho quedaba `sent` sin haber enviado). `CHANNEL_BY_ACTION_TYPE` mapea todo a `"whatsapp"` → el adapter manual es **inalcanzable hoy** |
| 8 | **Emisión fiscal SIAT** | `onia-platform\lib\fiscal\flags.ts` | `SIAT_EMISSION=""` → OFF; `SIAT_SERVICE_URL=""` → **modo mock** (CUF de prueba, cero red) |
| 9 | **Feed externo de agentes** | `app\api\onia-core\agents\feed\route.ts` | `AGENT_RUNTIME_SECRET` vacío → **503 fail-closed** |
| 10 | **Cobro por QR y conciliación (BE)** | `BE\apps\web\lib\payment-qr.ts`, `payment-reconciliation.ts` | Módulos **puros**: cero red, cero endpoint, cero llamador. Falta el contrato con BCP |
| 11 | **Módulo `agents` del core** | `onia-core\modules\agents.json` | `"status": "draft"`, `installInProductRepos: false`, `activatesCapabilities: []`. El schema dice *"reference only, do not apply"*. **El producto re-implementó la misma lógica en TypeScript** en vez de consumirlo |

### 1.3 NO EXISTE

| Cosa que el marketing podría prometer | Realidad |
|---|---|
| **Function calling / herramientas que el LLM invoca** | **Cero**, en los tres bots. Grep sin resultados de `tools` / `tool_choice` / `function_call`. El LLM hace 4 cosas: transcribir audio, redactar UNA respuesta libre filtrada por guardrails, puntuar leads y generar descripciones de catálogo offline. **Buscar producto, rutear vendedor, calificar y agendar son ramas de código determinista**, no herramientas del agente. En el bot propio, el **85-90% de las respuestas es texto fijo del guion** |
| **RAG / búsqueda semántica / embeddings** | **No existe.** Cero `pgvector`, cero `embedding`. El matcher de BE es IDF + tokens |
| **Llamadas de voz (el bot atiende el teléfono)** | **0% construido.** Solo dos documentos de arquitectura. Lo único real es transcribir **notas de voz** |
| **Difusión / campañas / envío masivo** | No existe en ningún repo |
| **Los tres niveles N1/N2/N3 como producto** | Se venden 3 niveles contra **un `Boolean`**. `whatsappTier` no existe (grep vacío). **El sistema no sabe qué nivel contrató el cliente** |
| **Bandeja de conversaciones dentro del panel** | No existe. `WhatsAppSession` guarda estado, idioma y `lastMessageAt` — **no guarda los cuerpos de los mensajes**. El negocio contesta desde Chatwoot, no desde su producto |
| **Alta self-service de un número (Embedded Signup)** | No existe. **El superadmin pega el token a mano** por organización (`admin\organizations\[id]\WhatsAppOrgConfig.tsx`) |
| **"onia-core corre agentes 24/7"** | Falso por diseño: `contract.json:838` dice que la ejecución real (cron + LLM + envío) es **`external_gate`**. El core describe un contrato, no un runtime |

### 1.4 ⚠️ Una contradicción que hay que cerrar antes de cobrar

| Fuente | Dice |
|---|---|
| El repo | `AGENTS_RUNTIME=""` y `PLATFORM_LAYER=""` en `.env.example`; `/api/cron/onia-agents` **no está** en `vercel.json` |
| Verificación en prod del 2026-08-07 (memoria del proyecto) | En el VPS **`PLATFORM_LAYER=1` y `AGENTS_RUNTIME=1`**; `AGENT_RUNTIME_SECRET` **no está** → corren solo las heurísticas internas del cron |
| Contexto | El producto **salió de Vercel el 2026-08-01**. `vercel.json` **ya no es el planificador vivo**: el cron real corre en el VPS y **no es verificable desde el repo** |

> **NO VERIFICADO: si el agente Recall efectivamente se dispara hoy en producción.**
> Es el dato que sostiene toda la promesa de "recupera clientes" del §3. Se cierra en 10
> minutos entrando al VPS y mirando el crontab y la última fila de `OniaAgentsRun`.
> **Hacerlo antes de publicar el precio nuevo.**

### 1.5 Lectura para el pricing

1. **Lo que se vende como "IA que responde y capta" es, en su mayor parte, un guion
   determinista con una rama de LLM acotada.** Eso **no** es un defecto —los guardrails son
   la razón por la que el bot nunca miente sobre stock ni precio, y es un diferencial real
   contra los competidores que sueltan un LLM a inventar. Pero cambia el argumento de venta:
   **no se vende "inteligencia", se vende que no se equivoca y no descansa.**
2. **El costo marginal de ese diseño es casi cero** (§2.3). Un producto de costo marginal
   cero que sustituye trabajo humano **no se precia por consumo: se precia por sustitución.**
3. **Hay más funciones construidas que vendidas, y más vendidas que encendidas.** La lista
   §1.2 es el inventario exacto de dónde está el valor atrapado. Encender los agentes es la
   diferencia entre un contestador y el producto del §3.

---

## 2. Costo real por conversación

### 2.1 Tarifas de Meta — Bolivia

Bolivia **no tiene tarifa propia**: cae en el mercado regional **"Rest of Latin America"**
(junto a Costa Rica, Ecuador, Paraguay, Uruguay, Venezuela y otros).
Fuente: [Pricing on the WhatsApp Business Platform](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing).

Rate card vigente **desde el 1-jul-2026**, fila `Rest of Latin America`:

| Categoría | USD/mensaje | Bs/mensaje (TC 12,08) |
|---|---:|---:|
| Marketing | 0,0740 | **0,894** |
| Utility | 0,0113 | **0,137** |
| Authentication | 0,0113 | **0,137** |
| Service | *gratis hasta el 30-sep-2026* | — |

> ⚠️ **Estos tres números son el punto más débil del doc.** Tres fuentes dan tres valores
> distintos para la MISMA fila y la MISMA fecha de vigencia:
>
> | Fuente | Marketing | Utility / Auth |
> |---|---:|---:|
> | CSV oficial de Meta, descargado el 2026-08-08 (registrado en `ONIA_META_WHATSAPP_CLIENTES_20260808.md`, encabezado literal *"effective July 1, 2026"*) | 0,0740 | 0,0113 |
> | († [SleekFlow — WhatsApp Business API Pricing](https://help.sleekflow.io/en_US/whatsapp/pricing), efectiva 1-jul-2026) | **0,0851** | **0,0130** |
> | († [Twilio — WhatsApp Messaging Pricing](https://www.twilio.com/en-us/whatsapp/pricing)) | "sin cargo Meta" | **0,0034** |
>
> Se usa la fila del CSV porque es la única con procedencia primaria declarada. **La
> diferencia con SleekFlow es +15%.** Antes de publicar tarifa o de facturar consumo hay que
> volver a bajar el CSV. Marcado **NO VERIFICADO** al 2026-08-15.

**Sin volume tiers en la práctica:** el primer descuento (−5%) aparece pasando los
**100.000 mensajes/mes** en utility. Onia no los va a tocar.

### 2.2 🔴 El corte del 1-oct-2026 — qué cambia exactamente

Fuente primaria: [Upcoming pricing updates for Meta Business Agent, service and utility messages](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages).

| Fecha | Cambio | Impacto en Onia |
|---|---|---|
| **1-ago-2026** (ya ocurrió) | Meta cobra **Meta Business Agent** por token: **USD 2,00 / 1M tokens**, ~20.000-25.000 tokens por mensaje ≈ **4-5 ¢ USD/mensaje** | **Ninguno, y así debe quedar.** Onia usa IA propia. Ver §2.3: es **~150x más caro** que la nuestra |
| **1-oct-2026** | *"Meta will charge for service messages, which have not been charged since November 2024."* Cada respuesta del negocio dentro de la ventana de 24 h pasa a cobrarse **a la misma tarifa que utility/auth**. **Sin volume tiers** | Un caso de atención pura salta de **~Bs 10 a ~Bs 283/mes** |
| **1-oct-2026** | Las **plantillas utility dentro de la ventana de 24 h dejan de ser gratis** (lo eran desde el 1-jul-2025) | Encarece los flujos conversacionales |
| — | La ventana de entrada gratuita de **72 h por anuncio Click-to-WhatsApp sigue siendo gratis** | **Es la única palanca que queda.** Meter el tráfico por CTWA en vez de por el botón de la web |

> **La tarifa de service desde el 1-oct-2026 NO está publicada.** Meta dice que la publica
> **a más tardar el 1-sep-2026**. El 0,0113 que se usa acá es lo que la documentación
> *describe* ("mismas tarifas que utility y authentication"), **no un número publicado**.
> **NO VERIFICADO** — puede subir.

**⚠️ Defecto concreto, hoy, en producción.** El archivo que alimenta la página pública
`onia.com.bo/chatbot` promete literalmente, en el nivel N2:

> *"Responder es gratis: toda respuesta dentro de las 24 h desde que el cliente escribe no la cobra Meta"*

Ruta: `C:\dev\proyectos\onia-hermes\web-factory\apps\onia-platform\src\content\chatbot-precios.ts`.
**Esa frase deja de ser cierta el 1-oct-2026.** Hay que sacarla antes, no después.

### 2.3 Costo de la IA por conversación

Modelo en uso: **`gpt-4o-mini`** vía LiteLLM
(`C:\dev\proyectos\onia-hermes\hermes-content\deploy\vps-ops\bot\run-turn.mjs:134`, default
`ONIA_BOT_MODEL`). Tarifa: **USD 0,15 / 1M tokens de entrada · USD 0,60 / 1M de salida**
(† [devtk.ai — GPT-4o mini API Pricing, ago-2026](https://devtk.ai/en/models/gpt-4o-mini/)).

| Escenario | Tokens | USD | Bs (TC 12,08) |
|---|---|---:|---:|
| 1 turno del motor actual (system 120 tok + payload; `max_tokens: 160`) | ~520 in / 160 out | 0,000174 | **0,0021** |
| Conversación de 10 turnos con historial acumulado | ~15.000 in / 1.200 out | 0,0030 | **0,036** |

### 2.4 Costo total por conversación típica — el hallazgo que decide el pricing

Conversación típica = **1 plantilla saliente + 2 respuestas del negocio + 10 turnos de IA**.

| Componente | Hoy | Desde 1-oct-2026 | % del COGS post-oct |
|---|---:|---:|---:|
| Plantilla utility (1) | Bs 0,137 | Bs 0,137 | 30% |
| Respuestas del negocio (2, service) | **Bs 0** | Bs 0,274 | 61% |
| IA propia (10 turnos) | Bs 0,036 | Bs 0,036 | **8%** |
| **Total** | **Bs 0,17** | **Bs 0,45** | |

Si la plantilla cae en **marketing** en vez de utility:

| Componente | Desde 1-oct-2026 | % |
|---|---:|---:|
| Plantilla marketing (1) | Bs 0,894 | 75% |
| Respuestas service (2) | Bs 0,274 | 23% |
| IA propia | Bs 0,036 | **3%** |
| **Total** | **Bs 1,20** | |

> **Tres conclusiones que cambian cómo se precia esto:**
>
> 1. **La IA es entre el 3% y el 8% del costo. El transporte de Meta es el 92-97%.**
>    Preciar el chatbot "por lo que cuesta la IA" es preciar el 5% del producto.
> 2. **La categoría de la plantilla vale 2,7x más que todo lo demás junto.** La decide quien
>    redacta la plantilla, no el cliente. Meta define utility como *"non-promotional"*, y
>    *"templates with mixed content"* = marketing. Un "pagá hoy y te damos 10% de descuento"
>    multiplica la factura por 6,5. Peor: desde el 16-abr-2025 Meta puede recategorizar una
>    plantilla ya aprobada **de forma instantánea y sin aviso** si te marcó por abuso.
>    **Regla de producto que hoy no está escrita en ningún lado: utility por defecto,
>    marketing solo con OK explícito y por escrito.**
> 3. **Nuestra IA propia contra Meta Business Agent: Bs 0,036 vs Bs 5,44** por la misma
>    conversación de 10 mensajes (4-5 ¢ USD/mensaje × 10). **151x.** No es un detalle
>    técnico: es la razón por la que podemos vender flat sin factura sorpresa. **No migrar
>    nunca a Meta Business Agent.**

### 2.5 Tres casos reales, hoy y desde octubre

| Caso | Hoy | Desde 1-oct-2026 | Salto |
|---|---:|---:|---:|
| **Clínica**: 200 recordatorios utility + ~80 respuestas | Bs 27 | **Bs 38** | +41% |
| **Comercio**: 800 cobranzas utility + ~400 respuestas | Bs 109 | **Bs 164** | +50% |
| **Comercio, si la cobranza cae en marketing** | Bs 715 | **Bs 770** | 6,5x el anterior |
| **Inmobiliaria**: 500 consultas entrantes, ~2.000 respuestas | **Bs 10** | **Bs 283** | **28x** |

El caso inmobiliaria es el que rompe cualquier promesa de "atención ilimitada": pasa de casi
gratis a Bs 283/mes **sin que el cliente cambie absolutamente nada**.

### 2.6 Dos defectos de costeo que hay que arreglar antes de octubre

| # | Defecto | Ruta | Consecuencia |
|---|---|---|---|
| 1 | `utilityBob: 0.113` implica **TC 10,0** | `C:\dev\proyectos\onia-platform\lib\pricing.ts:24` | Al TC real 12,08 el costo es **Bs 0,1365** → el producto **subestima el costo de Meta en 21%**, y el panel de admin muestra ese número al operador |
| 2 | **El contador de cupo no cuenta lo que va a costar** | `checkWhatsAppAddon()` suma recordatorios; la ruta de las respuestas de la IA **no descuenta cupo** | Hoy da igual (son gratis). **Desde el 1-oct-2026 son facturables y no tienen tope ninguno.** Es el caso inmobiliaria: Bs 283/mes sin control. **Vence el 30-sep-2026** |

---

## 3. El número recomendado

## → **Bs 1.490/mes** (instalación Bs 1.500), UN solo nivel con IA.

Reemplaza a N2 (Bs 550) y N3 (desde Bs 900). N1 (Bs 200) se retira y sus recordatorios pasan
a estar **incluidos en el plan Pro**.

### 3.1 Por qué ese número y no otro

**a) Sustitución de trabajo — el ancla dura y verificable.**
El salario mínimo nacional 2026 es **Bs 3.300** (DS 5516,
† [Ferrere](https://www.ferrere.com/es/novedades/salario-minimo-nacional-2026-disposiciones-y-aplicacion/)),
antes de aguinaldo y aportes patronales. **Bs 1.490 es el 45% del salario mínimo** — menos de
la mitad de la recepcionista más barata que la ley permite, sin vacaciones, sin domingos y
sin las 11 h de la noche. Ese es el pitch, y no necesita una sola cifra inventada.

**b) Ancla de mercado — estamos por debajo del referente global.**
Intercom Fin cobra **USD 0,99 por resolución**; Agentforce **USD 2 por conversación**
(† relevado en `hermes-content/docs/research/ONIA_BENCHMARK_INDUSTRIA_20260807.md`, fuentes
gleap.io / help.salesforce.com). A 200 resoluciones/mes, Fin = **USD 198 = Bs 2.392/mes**.
**Bs 1.490 es el 62% de eso — y flat, sin factura variable.** Ese es exactamente el ataque
que el benchmark identificó como nuestro diferencial: *"precio flat en Bs sin riesgo de
factura sorpresa"*.

**c) Valor recuperado — el argumento de Sergio, con la aritmética adelante.**
*Un bot que cobra deudas y recupera clientes no se precia por mensajes enviados.* Correcto.
Modelo para una clínica de 800 pacientes con 200 citas/mes **[cálculo propio, es un MODELO,
no una medición: Onia tiene cero clientes pagando y por lo tanto cero datos de outcome]**:

| Fuente de recupero | Supuesto | Bs/mes |
|---|---|---:|
| No-show | 20% de 200 citas = 40 perdidas; recordatorio recupera 1/3 = 13 citas × Bs 200 | 2.600 |
| Recall de inactivos | 800 pacientes, 2% responde = 16, la mitad agenda = 8 × Bs 200 | 1.600 |
| Consulta fuera de horario que hoy se pierde | 3 pacientes nuevos/mes × Bs 200 | 600 |
| **Total recuperado (conservador)** | | **4.800** |

Ticket de Bs 200 = limpieza básica con flúor a precio publicado en Santa Cruz
([Los Odontólogos — precios Santa Cruz](https://losodontologos.com/bolivia/precios-santa-cruz/):
consulta Bs 100, limpieza básica Bs 200, resina simple Bs 150).

**Bs 1.490 captura el 31% del valor modelado. Solo el no-show ya lo paga (Bs 2.600 > 1.490).**

> ⚠️ **Dos tercios de ese valor dependen de que el agente Recall CORRA.** Los recordatorios
> sí tienen cron registrado; **Recall y Cobrador no están confirmados en producción** (§1.4).
> Bs 2.600 (no-show) están respaldados hoy; Bs 2.200 (recall + fuera de horario) están
> respaldados por código que **puede no estar disparándose**. Verificarlo es prerrequisito de
> publicar Bs 1.490 — si no, se vende lo que está apagado.

**d) Coherencia de escalera.** Pro Bs 750 + bot Bs 1.490 = **Bs 2.240/mes**. Sí, el add-on
cuesta el doble que la plataforma, **y está bien**: el sistema ordena, el bot vende. Un
producto que reemplaza medio puesto de trabajo no puede costar menos que el archivador donde
guarda los datos.

### 3.2 Por qué NO más caro

Porque hoy la promesa no está entregada punta a punta. Cobrar Bs 2.500 por un producto
cuyas piezas de multi-tenancy y bandeja todavía no existen es vender lo que no está.
**Bs 1.490 es lo máximo que aguanta la promesa que HOY se puede cumplir**, incluso con
pilotos operados a mano. El siguiente escalón se cobra cuando la última milla esté construida
y verificada en producción, no antes.

### 3.3 Por qué UN nivel y no tres

**La base de datos no puede cobrar tres.** `Organization.whatsappAddon` es un **Boolean**
(`C:\dev\proyectos\onia-platform\prisma\schema.prisma:31`). No existe columna `whatsappTier`.
El sistema **no distingue un add-on de Bs 200 de uno de Bs 900**: la escalera de tres niveles
ya publicada es **infacturable por nivel**. Un nivel es cobrable hoy, con la columna que ya
existe. Tres exigen una migración que nadie hizo en cinco semanas.

Segundo motivo: el **cupo de 200 mensajes salientes/mes es idéntico en los tres niveles**
(`CUPO_MENSUAL = 200` en el archivo de la web; `operationalMonthlyLimit: 200` en el producto).
Un cliente que paga Bs 900 tiene exactamente el mismo techo que uno que paga Bs 200. La
escalera no escala nada.

### 3.4 Por qué se retira N1 (Bs 200) — el nivel que Sergio no preguntó pero es el problema

1. **Compite contra gratis.** [Turnito (.bo)](https://turnito.app/) da plan gratuito con
   3 agendas, 100 reservas/mes y **recordatorios por WhatsApp**.
   [Citalo (/bo)](https://www.citalo.app/bo/software-turnos-odontologos) da plan gratuito con
   ficha clínica y recordatorios. Cobrar Bs 300 de instalación + Bs 200/mes por lo que dos
   competidores locales regalan es una objeción que no se gana.
2. **Pierde plata en su propio tope.** Ver §3.5.
3. **Convertido en "incluido en Pro" deja de ser una línea que pierde y pasa a ser una razón
   para comprar Pro.** Bs 750 con recordatorios incluidos gana contra Bs 100 de Growing Cloud
   mejor que Bs 320 + Bs 200 de add-on.

### 3.5 Punto de equilibrio — a partir de cuántas conversaciones perdemos plata

Hay **dos regímenes distintos** y confundirlos es lo que llevó al precio actual.

**Régimen A — Onia absorbe el costo de Meta** (así está hoy N1: `metaPassthrough: false`).
Supuesto: por cada mensaje saliente el cliente responde y el negocio contesta 0,8 veces.

| Precio/mes | Punto de equilibrio si la plantilla es **utility** | …si Meta la recategoriza a **marketing** |
|---|---:|---:|
| **Bs 200** (N1 hoy) | 814 mensajes/mes | **199 mensajes/mes** |
| **Bs 550** (N2 hoy) | 2.239 mensajes/mes | **548 mensajes/mes** |
| **Bs 1.490** (propuesto) | 6.062 mensajes/mes | **1.485 mensajes/mes** |

> 🔴 **El número que prueba que N1 está mal preciado: 199.** El cupo de N1 es **200
> mensajes/mes**. O sea que **N1 llega a pérdida exactamente al llegar a su propio tope** si
> Meta le recategoriza la plantilla — y Meta puede hacerlo sin aviso. No hay margen: hay un
> milímetro. *[cálculo propio: 0,0740·x + 0,0113·0,8x = 200/12,08 → x = 199,4]*

**Régimen B — el cliente le paga a Meta directo** (así están hoy N2 y N3:
`metaPassthrough: true`, y es el modelo elegido con Embedded Signup: cada cliente su propia
WABA, a su nombre, con su tarjeta).

Acá **el punto de equilibrio por volumen no existe**: el costo variable de Onia es solo la IA
(Bs 0,036/conversación). A Bs 1.490 haría falta **41.000 conversaciones/mes** para llegar a
cero. Eso no es un límite real.

**El punto de equilibrio real del régimen B es de soporte humano, no de transporte:**

> **Bs 1.490 ÷ Bs 100/hora (costo hora interno usado en el pricing del 08-ago) = 14,9 horas.**
> **Si un cliente consume más de 15 horas de atención humana al mes, ese cliente da pérdida.**
> A Bs 550 el umbral son **5,5 horas/mes** — o sea, un cliente con una hora y cuarto de
> soporte por semana ya nos hace perder plata. **Ese es el argumento numérico de que Bs 550
> está mal.**

**Y el punto de equilibrio del CLIENTE**, que es el que nos hace echar: su factura de Meta
supera nuestro abono de Bs 1.490 recién a los **~10.900 mensajes/mes**. Por debajo de eso
—que es todo el mercado pyme boliviano— el pass-through es defendible y no compite con
nuestro precio.

### 3.6 Qué hay que hacer para poder cobrar Bs 1.490

| # | Qué | Tamaño | Vence |
|---|---|---|---|
| 1 | Sacar de `chatbot-precios.ts` la promesa *"Responder es gratis"* | 10 minutos | **30-sep-2026** |
| 2 | Que el contador de cupo cuente **también** las respuestas de la IA | horas | **30-sep-2026** |
| 3 | Corregir `utilityBob: 0.113` → TC real (o derivarlo del USD y un TC configurable) | 10 minutos | antes de facturar |
| 4 | Escribir la regla de categorización de plantillas (utility por defecto) | 1 hora | antes del primer cliente |
| 5 | Re-descargar el CSV oficial de Meta y cerrar el **NO VERIFICADO** de §2.1 | 1 hora | antes de publicar tarifa |
| 6 | Un solo nivel → el `Boolean whatsappAddon` alcanza. **No hace falta migración** | 0 | — |
| 7 | 🔴 **Verificar en el VPS que el cron de agentes dispara** (crontab + última fila de `OniaAgentsRun`). Si no dispara, encenderlo | 10 min / horas | **antes de publicar el precio** |
| 8 | Decidir si el add-on genera un `SubscriptionPayment` o sigue siendo un Boolean que prende el superadmin sin vencimiento ni corte por impago | 1-2 semanas | antes de 10 clientes |

---

## 4. Reconciliación de las listas de precios

### 4.1 No hay tres listas: hay diez

| # | Fuente | Fecha | Qué manda | ¿Lo ve el cliente? |
|---|---|---|---|---|
| 1 | `onia-platform/lib/subscription-plans.ts` + `plan-limits.ts` + `pricing.ts` + `subscription-payment-validation.ts` | commit 2026-08-10, master `7dfe9ab` | **320 / 750 / 1.500 / 2.900**, anual x10; chatbot **300+200 / 1.500+550 / 3.500+900**; usuario 70; agenda 150; inventario 180 | **SÍ — es el monto que valida el checkout** |
| 2 | `web-factory/apps/onia-platform/src/lib/pricing.ts` + `content/chatbot-precios.ts` + `content/webs.ts` | 2026-08-08 | Idéntico a (1) + webs 790/1.500/2.900 + Cuidado Web 190/390/690 | **SÍ — onia.com.bo/precios y /chatbot** |
| 3 | `web-factory/apps/site/src/app/vendedores/cotizador-data.ts` | 2026-07-30 | Comercio 350/530/800/1.250 · **Chatbot WhatsApp "desde 990"** · **WhatsApp Dental 650 + 350/mes** | **Sí de hecho** — la ruta `/vendedores` **no tiene auth ni noindex** (`middleware.ts:264` solo cubre `/onia-center` y `/nuvia`) |
| 4 | `hermes-content/propuestas/generador/clientes.json` | 2026-07-30 | **dentalgest: 390 / 890 / 1.990** + USD 4.900/490 · chatbot **1.900 + 150/mes** (5 clientes) y **900 + 80/mes** (garabato) · webs **2.000 / 4.500** | **SÍ — es el PDF que se firma.** `propuesta-dentalgest.html` ya contiene esos números |
| 5 | `hermes-content/propuestas/ONIA_CATALOGO_PRECIOS_2026.md` | doc 2026-07-04 | Igual a (3). Auditoría y Diagnóstico **GRATIS** | Interno (fuente de la vendedora) |
| 6 | `hermes-content/propuestas/PRICING_RATIONALE_INTERNO.md` | doc 2026-07-03 | §0 Landing **790** / Web Pro **1.500** · §4 premium **2.000 / 4.500** · §5 WhatsApp **900 + 80/mes** | Interno |
| 7 | `onia-core/business-tiers.json` + `ONIA_CATALOGO_COMERCIAL_2026.md` | 2026-07-04 | **390 / 890 / 1.990**, usuarios 3/8/20, sucursales 1/-/3, SIAT +190/mes | **Muerto**: `git grep business-tiers` en `onia-platform` devuelve **vacío**. Cero referencias |
| 8 | `onia-platform/docs/PRICING.md` + `docs/FOUNDER_PRICING.md` | 2026-06-16 / 2026-05-23 | Anual **9x** (2.880/6.750/13.500) · WhatsApp **650 + 350** · fundador **400 / 700** | Interno, **contradice al validador de pagos** |
| 9 | `SALES_VENDOR_PRICING_DECK_2026.html` + `ONIA_PROJECTS_VENDOR_DECK_2026.html` (raíz del repo) | 2026-06-06 | DentaGest **349 / 590 / 990** · GestiOS **490 / 790 / 1.290 / 2.490** · Webs **1.490 / 2.900 / 5.900 / 9.500** | Generación anterior, **nunca se retiró** |
| 10 | Docs de planes: `ONIA_PLANES_REQUISITOS_20260801`, `ONIA_VALOR_Y_ESCALERA_PLANES_20260731`, `ONIA_TABLERO_20260709`, `ONIA_PRICING_ESCALABLE_Y_IA_LOCAL_20260807`, `ONIA_DEPLOYMENT_OFFLINE_HA_PRICING_2026` | jul-ago 2026 | Cuatro variantes más de Grupo Clínico y una propuesta de chatbot a **350 + 1.000** | Internos, dos con banner SUPERADO |

### 4.2 El precio del chatbot: SEIS valores vivos al mismo tiempo

| # | Precio | Dónde vive | Estado |
|---|---|---|---|
| 1 | **N1 300+200 · N2 1.500+550 · N3 desde 3.500+900** | código del producto + web pública | **VIGENTE** (ratificado 2026-07-09) |
| 2 | **desde Bs 990 de setup** | cotizador de vendedores + catálogo | Huérfano — no existe en ningún otro lado |
| 3 | **650 inst. + 350/mes** | cotizador, catálogo, `ONIA_PRICING_2026.md`, `onia-platform/docs/PRICING.md`, `FOUNDER_PRICING.md` | **RETIRADO el 2026-07-09** y sigue vivo en **5 archivos**, uno de ellos alcanzable por URL |
| 4 | **900 setup + 80/mes** | `PRICING_RATIONALE_INTERNO.md` §5 + propuesta `garabato` | Contradice al propio `ONIA_PRICING_2026.md`, que prohíbe explícitamente *"el precio antiguo de Bs 80/mes"* |
| 5 | **1.900 setup + 150/mes** | generador: bench, hsb-engineers, lia-albertengo, aw-climatizacion ×2 | **Ya enviado en propuestas firmables** |
| 6 | **Bot Básico 1.900 / Calificador 3.200 / Bot+Agenda 4.800 + 150-530/mes** | generador: aw-climatizacion-chatbot | **Ya enviado** |

**Dispersión: setup Bs 990 → 3.500 (3,5x). Mensual Bs 80 → 900 (11x).**
Un séptimo SKU sin equivalente en el producto: *"WhatsApp Onia Comercio Bs 280/mes"*.
Y `ONIA_PLANES_REQUISITOS_20260801.md` dice que el chatbot va **incluido en el plan Clínica** —
el código dice que es un Boolean que **ningún plan incluye**.

### 4.3 Otras cinco contradicciones que hay que cerrar el mismo día

| Tema | Contradicción |
|---|---|
| **Dental** | Código y web: **320/750/1.500**. Generador, core y docs de planes: **390/890/1.990**. Las dos escaleras se usan hoy |
| **Ciclo anual** | Código: **x10** (3.200/7.500/15.000). `onia-platform/docs/PRICING.md`: **x9** (2.880/6.750/13.500). Un cliente que cita el doc del propio repo paga Bs 750 de menos y **el validador le rechaza el pago** (tolerancia Bs 0,01) |
| **Webs** | 790/1.500/2.900 (catálogo, cotizador, web) vs 2.000/4.500 (generador — **el que sale por PDF**) vs 1.490/2.900/5.900/9.500 (decks de junio) |
| **Auditoría / Diagnóstico** | `PRICING_RATIONALE` §0 (3-jul): **Bs 250 y 690**. `ONIA_CATALOGO_PRECIOS` §5 (4-jul, **un día después**): **gratis como gancho** |
| **Videos IA** | Catálogo: *"PAUSADOS como producto comercial"*. Generador: los ofrece a **Bs 2.200/mes** en 7 de 9 clientes |

### 4.4 La fuente de verdad — propuesta

> ### `C:\dev\proyectos\onia-platform\lib\pricing.ts` + `lib\subscription-plans.ts`
> **es la ÚNICA fuente de verdad de precios de Onia.**
> Motivo, en una línea: **es el único archivo que cobra.** Todo lo demás es una lista que
> alguien puede citarle al cliente y que el checkout va a rechazar con "Monto inválido".

Reglas que la hacen sostenible (y el trabajo mínimo para aplicarlas):

| # | Acción | Archivos | Tamaño |
|---|---|---|---|
| 1 | **Borrar** los precios de las fuentes muertas | `onia-core/business-tiers.json` (cero referencias), `SALES_VENDOR_PRICING_DECK_2026.html`, `ONIA_PROJECTS_VENDOR_DECK_2026.html`, `onia-platform/docs/FOUNDER_PRICING.md` | minutos |
| 2 | **Sincronizar** el cotizador de vendedores y el catálogo a los números del código, y sacar de ahí el chatbot a 990 y a 650+350 | `cotizador-data.ts`, `ONIA_CATALOGO_PRECIOS_2026.md` | 1 hora |
| 3 | **Regenerar** las propuestas dental con la escalera vigente | `generador/clientes.json` slug `dentalgest` | 1 hora |
| 4 | **Poner `noindex` + auth** en `/vendedores` | `web-factory/apps/site/src/middleware.ts:264` | 10 minutos |
| 5 | **Un check que falle si divergen.** Los repos están separados: no hace falta un pipeline, hace falta UNA prueba en `web-factory` que compare sus montos contra los del producto y rompa el build si no coinciden | 1 test | medio día |
| 6 | **Regla de escritura:** ningún doc nuevo repite un precio. Los docs enlazan al archivo. Un precio escrito en un `.md` es una lista que va a divergir | — | — |

> **Por qué un check y no un paquete compartido:** los dos repos se mantienen separados a
> propósito (el cerebro no entra al repo del producto, regla de acceso). Un paquete NPM
> compartido para nueve números es infraestructura que después hay que mantener. Un test que
> falla cuando divergen resuelve el 100% del problema real —que nadie se entera del
> desfase— con 30 líneas.

---

## 5. Grupo Clínico

### 5.1 Qué es, de dónde salió

| Fecha | Qué pasó |
|---|---|
| **2026-06-18** (`5fe43bf`, repo del producto) | **Nace.** Plan `enterprise` con el label `"Grupo Clinico"`. Era la era **DentalGest pura** — el mismo commit toca `DENTALGEST.md`. Motivación original: **contabilidad avanzada + self-hosted + backups/SLA**. Nada de multi-sede |
| 2026-07-05 | Montos: `enterprise: { monthly: 2900, annual: 29000 }` |
| **2026-07-09** (`f99fe101`) | **La promesa formal.** Se lo redefine como *"sucursales ilimitadas, panel de grupo consolidado, SIAT por sucursal"*. **El MISMO día** el CHANGELOG de `onia-core` agrega la multi-sucursal al core diciendo: *"DentaGest (que hoy no usa sucursales) puede adoptarlo cuando venda Grupo Clinico"*. Se vendió el día en que la capacidad se escribió en un documento, no en el que se implementó |
| **2026-07-26 / 27** | **El giro.** Onia se vende como UNA plataforma con módulos por rubro. `enterprise` lo precede en 5 semanas |
| 2026-07-31 (`7b993e89`) | Se le saca el prefijo `"DentalGest — "` al nombre en el wizard… **pero queda la palabra "clínico"** |
| 2026-08-08 (`149bf418`) | La revisión adversarial del pricing lo desmonta: cero `branchId`, ordena borrar las celdas de sucursales. La **landing** lo renombra a "Grupo / Empresarial". **El producto no** |

### 5.2 Las tres pruebas de que no se sostiene

**Prueba 1 — No entrega NADA que el plan de abajo no entregue.**
En `C:\dev\proyectos\onia-platform\lib\plan-limits.ts`, los objetos `clinic` (líneas 100-112)
y `enterprise` (113-125) son **idénticos campo por campo**: mismos `-1` en pacientes,
usuarios y emails; mismo `gatewayEnabled: false`; mismos flags de reportes, export, reservas,
inventario y agentes. **La única diferencia que el sistema aplica es el precio: Bs 1.500 → Bs 2.900 (+93%).**

**Prueba 2 — Su promesa central no existe en la base de datos.**
`C:\dev\proyectos\onia-platform\prisma\schema.prisma`: **0 ocurrencias de `branchId`**.
Ningún modelo `Branch`, `Location`, `Sucursal` ni `Area`. Lo único llamado "branch" es
`branchCode String?` (línea 1509) dentro de `OniaInvoicingInvoice` — **es un campo del SIAT,
no un modelo de sede**: nada lo agrupa ni lo consolida. Hay `areaId String?` sueltos (1234,
1755) que apuntan a una tabla que no existe.
**Hoy una segunda sucursal es otra `Organization`** = otra suscripción de Bs 1.500 **sin
vista consolidada**. Exactamente lo único que el plan promete.

La capacidad **sí** existe en `onia-core` (`schema/base-schema.sql:5-32`, tabla
`onia_core_areas` con `type SUCURSAL/GRUPO` y `parent_area_id`; `contract.json:132-147`),
agregada el 2026-07-09. Pero ese archivo abre con
`-- Status: beta, reference only. Do not apply directly to product databases.`
**Es el caso de libro de "construido ≠ terminado": la capacidad vive en el catálogo y no en
la base que cobra.**

**Prueba 3 — El nombre le pega a quien no es.**
`web-factory/apps/onia-platform/src/app/empezar/recommend.ts:53-58` recomienda
`nombre: "Grupo clínico"` **por tamaño de equipo (`equipo === "15+"`), sin mirar el rubro** —
y `data.ts` tiene habilitados dental, comercio e importadora. **Una ferretería de 20
empleados recibe hoy una recomendación llamada "Grupo clínico".** El comentario dos líneas
más arriba, en el mismo archivo, dice: *"Onia es UNA plataforma: los planes no llevan marca
de rubro"*. Se contradice a sí mismo en el mismo archivo. **Ese es, con casi total certeza,
el lugar exacto donde Sergio lo vio.**

### 5.3 Veredicto: se ELIMINA el nombre, se CONSERVA el escalón como cotización

No es "se queda" ni "se elimina" a secas:

| Qué | Decisión |
|---|---|
| **El nombre "Grupo Clínico"** | **Se elimina.** Es herencia dental, y hoy se le muestra a no-dentistas. Se reemplaza por **"Onia Empresarial"** en las 6 superficies del producto y en `recommend.ts:56` |
| **El precio Bs 2.900 como plan self-serve** | **Se elimina.** Cobrar +93% por límites idénticos no se sostiene ante ninguna pregunta del cliente. Ya está fuera del checkout (`CHECKOUT_PLANS` no lo incluye): formalizarlo |
| **El escalón como línea "se cotiza"** | **Se conserva.** Tiene sentido real: implementación, instancia privada/self-hosted, backups, SLA y SIAT son **servicio**, no software con flags. Se cotiza por caso, sin precio de lista publicado |
| **La promesa de multi-sede consolidada** | **Se saca de toda superficie comercial HOY.** No existe. Vuelve cuando `onia_core_areas` esté aplicado en la base de producción y verificado ahí — no cuando esté en el core |

**Ganancia colateral:** eliminarlo saca de un plumazo **cinco de las diez** definiciones
contradictorias de precio del §4 (las cinco variantes de Grupo Clínico: 2.900, 3.900/2.900,
"desde 3.900 + setup o USD 490/mes", "a medida", y la del wizard).

---

## 6. Lo que quedó NO VERIFICADO

| # | Dato | Por qué | Cómo cerrarlo |
|---|---|---|---|
| 1 | **Las tarifas exactas de Meta para "Rest of Latin America"** | Tres fuentes, tres valores para la misma fila y la misma fecha: CSV interno 0,0740/0,0113 · SleekFlow 0,0851/0,0130 (+15%) · Twilio 0,0034. El CSV oficial no se pudo re-descargar desde acá (la página sirve el archivo, no la tabla) | Bajar el CSV desde la sección "Rate cards and volume tiers" de la [página oficial de pricing](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing). **1 hora** |
| 2 | **La tarifa de `service` vigente desde el 1-oct-2026** | Meta **no la publicó todavía**. La documentación dice "mismas tarifas que utility y authentication", pero no es un número publicado. Meta se comprometió a publicarla **a más tardar el 1-sep-2026** | Revisar la página el 1-sep-2026. Puede subir |
| 3 | **El valor recuperado por el bot (Bs 4.800/mes del §3.1c)** | Es un **MODELO con supuestos declarados**, no una medición. Onia tiene **cero clientes pagando** y por lo tanto cero datos de outcome. El ticket de Bs 200 sí está verificado; las tasas de recupero (20% no-show, 1/3 recuperado, 2% de respuesta al recall) son supuestos de la casa | Medirlo con el primer cliente. Hasta entonces, **no usar estas cifras en una propuesta como si fueran resultados** |
| 4 | **El costo patronal real de una recepcionista boliviana** | Solo está verificado el salario mínimo (Bs 3.300, DS 5516). Aguinaldo, aportes CNS/AFP y finiquito no se calcularon contra norma citada | Se evitó el problema: el §3.1a compara contra el **salario mínimo pelado**, sin cargas. El argumento es más fuerte y no necesita el número |
| 5 | **Si el `whatsappAddon` Boolean se puede reutilizar tal cual para un solo nivel** | Se leyó el schema (línea 31, `Boolean @default(false)`) pero no toda la ruta de activación/facturación | Verificarlo antes de publicar el precio nuevo. Si el add-on hoy no genera un `SubscriptionPayment`, el problema es más grande que el precio |
| 6 | 🔴 **Si el agente Recall/Cobrador se dispara hoy en producción** | El repo dice que `/api/cron/onia-agents` no está en `vercel.json`; la verificación en el VPS del 2026-08-07 dice que `AGENTS_RUNTIME=1`. Y el producto **ya no deploya en Vercel**, así que `vercel.json` no es el planificador vivo. **Ninguna de las dos fuentes prueba que el reloj real lo llame** | Entrar al VPS, mirar el crontab y la última fila de `OniaAgentsRun`. **10 minutos.** Es prerrequisito del §3 |
| 7 | **El estado `active` de los workflows de n8n** (BE `be-sla-reassign` / `be-reminders`, producto `wf-01..wf-07`, bot propio `bJhSGHPYsaICEeKm`) | Los JSON están versionados en el repo; el flag de activación vive en el n8n del VPS, no en git | Listar los workflows activos en el n8n del VPS |

---

## 7. Fuentes

**Meta / WhatsApp (oficiales)**
- [Pricing on the WhatsApp Business Platform](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing) — rate cards descargables, vigencia 1-jul-2026
- [Upcoming pricing updates for Meta Business Agent, service and utility messages](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages) — los cambios del 1-ago-2026 y del 1-oct-2026

**Meta / WhatsApp (terceros, †)**
- [SleekFlow — WhatsApp Business API Pricing](https://help.sleekflow.io/en_US/whatsapp/pricing)
- [Twilio — WhatsApp Messaging Pricing](https://www.twilio.com/en-us/whatsapp/pricing)
- [hello charles — WhatsApp Service Message Pricing: What Changes in 2026](https://www.hello-charles.com/blog/whatsapp-service-message-pricing-what-changes-in-2026)

**Modelos de IA (†)**
- [devtk.ai — GPT-4o mini API Pricing (agosto 2026)](https://devtk.ai/en/models/gpt-4o-mini/) — USD 0,15 / 0,60 por 1M tokens

**Bolivia**
- [BCB — última cotización oficial](https://www.bcb.gob.bo/tco_reporte_ultima_cotizacion.php) — TCO Bs 12,08/USD al 3-ago-2026
- († [Ferrere — salario mínimo nacional 2026, Bs 3.300, DS 5516](https://www.ferrere.com/es/novedades/salario-minimo-nacional-2026-disposiciones-y-aplicacion/))
- [Los Odontólogos — precios de referencia Santa Cruz](https://losodontologos.com/bolivia/precios-santa-cruz/)

**Competencia local (relevada 2026-08-08, ver `ONIA_PRICING_SEGUNDA_REVISION_20260808.md`)**
- [Growing Cloud — Bs 100/200/300/450, usuarios ilimitados](https://growingcloud.net/sistema-de-facturacion-computarizada-electronica-en-linea-cochabamba/)
- [Turnito (.bo) — plan gratis con recordatorios WhatsApp](https://turnito.app/)
- [Citalo (/bo) — plan gratis con ficha clínica y recordatorios](https://www.citalo.app/bo/software-turnos-odontologos)

**Documentos internos usados como base (no re-hechos)**
- `hermes-content/docs/platform/ONIA_META_WHATSAPP_CLIENTES_20260808.md` — modelo Tech Provider, rate card CSV, casos de costo
- `hermes-content/docs/platform/ONIA_PRICING_SEGUNDA_REVISION_20260808.md` — revisión adversarial que ya identificó 4 listas
- `hermes-content/docs/research/ONIA_BENCHMARK_INDUSTRIA_20260807.md` — Fin, Agentforce, Breeze

**Código verificado (solo lectura)**

*Producto — `C:\dev\proyectos\onia-platform`, master `118192b` / `7dfe9ab`:*
`lib/pricing.ts` · `lib/subscription-plans.ts` · `lib/plan-limits.ts` ·
`lib/subscription-payment-validation.ts` · `lib/subscription/plan-display.ts` ·
`prisma/schema.prisma` · `vercel.json` · `app/api/webhooks/whatsapp/route.ts` ·
`lib/whatsapp-bot.ts` · `lib/chatwoot.ts` · `app/api/cron/onia-agents/route.ts` ·
`lib/onia-core/modules/agents-runtime.ts` · `lib/onia-core/modules/agents-flags.ts` ·
`lib/onia-core/generators.ts` · `lib/onia-core/dispatch/{dispatcher,channels,envelope}.ts` ·
`lib/platform/flags.ts` · `lib/fiscal/flags.ts` ·
`app/(dashboard)/admin/organizations/[id]/WhatsAppOrgConfig.tsx` ·
`app/(dashboard)/settings/PlanClient.tsx` · `prisma/migrations/20260728000000_add_onia_agents`

*Monorepo — `C:\dev\proyectos\onia-hermes`:*
`web-factory/apps/onia-platform/src/content/chatbot-precios.ts` ·
`.../src/lib/pricing.ts` · `.../src/app/empezar/{recommend,data}.ts` ·
`web-factory/apps/site/src/app/vendedores/cotizador-data.ts` ·
`web-factory/apps/site/src/middleware.ts` ·
`hermes-content/deploy/vps-ops/bot/{run-turn,bot-engine,chatwoot-adapter,calcom-booking}.mjs` ·
`hermes-content/propuestas/generador/clientes.json` ·
`onia-core/contract.json` · `onia-core/schema/base-schema.sql` · `onia-core/modules/agents.json`

*Cliente — `C:\dev\clientes\Bolivian Electric`:*
`apps/web/lib/chatwoot-webhook.ts` · `lib/openai-client.ts` · `lib/product-matching.ts` ·
`lib/whatsapp-templates.ts` · `lib/payment-qr.ts` · `app/api/cron/follow-ups/route.ts` ·
`infra/n8n/workflows/` · `docs/product/storefront-carrito-pendientes.md` ·
`docs/product/plantillas-meta-pendientes.md`
