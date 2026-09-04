# ONIA — Agentes de IA: cómo funcionan y cuánto cuestan de API

**Fuente de verdad del costo de API de los agentes y chatbots que le vendemos al cliente.**
Un tema = un archivo. Si otro doc dice otra cifra, está roto.

Medido contra el **código en producción** y contra la **base del VPS**, no contra docs.
Fecha de medición: **2026-08-20**.

---

## 0. La respuesta en una línea

> **Los agentes que le hacen el trabajo más fácil al usuario (Recall, Cobrador, Captador) cuestan
> USD 0,00 de API. No llaman a ningún modelo: redactan con plantillas en código.**
> El único costo de API real está en los **chatbots**, y es de **Bs 0,80 a Bs 23 por cliente/mes**
> — entre **0,2% y 5,9%** de los Bs 390 que cobra el add-on.
> **Ningún plan pierde plata por API.** Lo que puede hacer perder plata es el **soporte humano**, y
> nada más: el transporte de Meta salió de nuestra cuenta el 2026-08-21.

⚠️ **Cuentas rehechas el 2026-08-27.** Todo este doc calculaba contra **Bs 1.490**, el precio del
add-on antes del 2026-08-21. Hoy la fuente (`pricing.ts`, `WHATSAPP_ADDON`) dice **Bs 390/mes sin
cargo inicial**, y el consumo de Meta lo paga el cliente en SU cuenta. **No se reemplazaron
números: se rehicieron los porcentajes, los márgenes y las dos conclusiones que cambiaron de
signo** (§6). Los costos medidos —Bs 0,76 típico, Bs 22,66 pico, Bs 60,44 peor caso— NO cambian:
son mediciones del 2026-08-20 contra producción, y siguen valiendo.

---

## 0.b El gasto fijo mensual (Sergio, 2026-08-21)

Lo que sale de la caja todos los meses, dicho por Sergio. Separado en dos, porque
para decidir precios **no es lo mismo lo que cuesta OPERAR que lo que cuesta CONSTRUIR**.

| Concepto | USD/mes | Bs/mes (11,52) | ¿Escala con clientes? |
|---|---|---|---|
| **VPS** (Hostinger KVM, 4 vCPU / 16 GB, 41 contenedores) | **40** | 461 | No — aguanta decenas de orgs |
| API del chatbot | 0,07–2 **por cliente** | **0,80–23 por cliente** | Sí, y es despreciable |
| API de los agentes (Recall/Cobrador/Captador) | **0** | **0** | No llaman a ningún modelo |
| **Subtotal OPERAR** | **~40 + centavos/cliente** | **~461** | |
| Claude Max (desarrollo) | **200** | 2.304 | No — es construir, no operar |
| Higgsfield (contenido/marketing) | ⚠️ **falta el número** | — | No |
| **Subtotal CONSTRUIR** | **200 + Higgsfield** | **2.304 +** | |

⚠️ **Corrección al doc viejo:** decía "VPS ~US$12–15/mes" tomado del tarifario público de
Hostinger. El real que paga Sergio es **US$40**. Dato heredado que no se había contado.

### Lo que esto significa para el precio

- **Operar el producto cuesta Bs ~461 al mes, sin importar cuántos clientes haya.** Un solo
  cliente en el plan más barato (Bs 320) casi lo cubre; dos lo cubren con sobra.
- **El gasto grande es construir, y no escala con clientes.** Claude Max no sube si entran
  20 clientes; baja cuando el producto esté terminado. No hay que trasladarlo al precio de
  cada cliente: hay que amortizarlo con volumen.
- **Punto de equilibrio de TODO el gasto conocido (US$240 = Bs 2.765/mes):**

  | Escenario | Clientes para cubrir Bs 2.765 |
  |---|---|
  | Solo chatbot a Bs 390 | **8** |
  | Solo plan Pro a Bs 750 | **4** |
  | Plan Pro + chatbot (Bs 1.140) | **3** |

  **Tres clientes completos pagan todo lo que gastamos hoy.** Ese es el número que importa.
- El margen del chatbot a Bs 390 va de **99,8% (típico)** a **94,2% (pico de API)**. El costo
  variable sigue siendo ruido incluso al precio nuevo. **El precio no lo decide el costo, lo
  decide el mercado y el valor** — ver `ONIA_PSICOLOGIA_PRECIOS_COMPETENCIA.md`.

---

## 1. Qué hay realmente encendido (verificado en el VPS, 2026-08-20)

| Cosa | Estado | Evidencia |
|---|---|---|
| `AGENTS_RUNTIME` | **=1 (ENCENDIDO)** | `docker exec onia-platform env` |
| `PLATFORM_LAYER` | **=1 (ENCENDIDO)** | idem |
| Cron de agentes | **VIVO**, diario 11:00 UTC | `crontab -l` → `/root/bin/run-onia-agents-cron.sh` |
| Última corrida | OK, `ran:14` (7 orgs × 2 roles), `proposed:0` | `/var/log/onia-agents-cron.log` |
| Entitlement `module.agents` | Se otorga en el alta real | `app/api/auth/register/route.ts:197` |
| Modelo del bot en prod | **`gpt-4.1-mini`** (env `ONIA_BOT_MODEL`) | `/opt/onia/bot/webhook.env` |
| Modelo en el código | `gpt-4o-mini` (default) | `run-turn.mjs:162` |
| Orgs en producción | 3 (2 professional, 1 free) — todas de QA | `public.organizations` |

⚠️ **Corrección de un doc viejo:** `hermes-content/docs/historial/ONIA_AUDITORIA_PROMESAS_LANDING_20260806.md`
dice que los agentes están apagados y que el cron no existe. **Eso ya no es cierto desde el
2026-08-06**: los flags están en 1 y el cron corre solo en el VPS (no en `vercel.json`, que sigue
sin tenerlo — por eso el doc viejo no lo encontraba).

⚠️ **El código y el entorno no coinciden en el modelo.** El código default es `gpt-4o-mini`; el
`.env` de producción pisa con `gpt-4.1-mini`, que cuesta **2,7× más**. Abajo se costea **lo que
realmente corre**, y se marca el ahorro de volver al default.

---

## 2. Cómo funciona cada agente (una línea cada uno)

### 2.1 Los agentes del módulo — `lib/onia-core/modules/agents-runtime.ts`

| Agente | Qué hace | Cada cuánto | Sobre cuántas filas | Llamadas al modelo |
|---|---|---|---|---|
| **Recall** | Busca clientes sin volver hace 180 días y sin cita futura, y **redacta el mensaje de reactivación con una plantilla**. | `intervalMinutes: 1440` (diario) | hasta **1.000 pacientes** + 2 `groupBy` de citas + 1.000 acciones previas | **0** |
| **Cobrador** | Busca facturas emitidas con saldo vencido (o **fiados** en comercio) y **redacta el recordatorio de pago con una plantilla**. | `1440` (diario) | hasta **1.000 facturas** con sus pagos, o los fiados abiertos | **0** |
| **Captador** | Lee las consultas entrantes (work items del intake), las **califica con reglas puras** y redacta la respuesta; además marca visitas sin confirmar. | `30` (pero el cron dispara 1×/día) | hasta **500 leads** + 200 citas + 1.000 comentarios | **0** |

**Los tres cierran igual:** la propuesta cae en `/pending` como `OniaCoreApprovalRequest` y **un
humano aprueba**. Nada se envía solo.

**Por qué cuestan cero — esto es lo importante:**

1. Los mensajes salen de **funciones de plantilla en TypeScript**, no de un modelo:
   `buildRecallMessage()`, `buildCollectorMessage()`, `buildCollectorMessageComercio()`,
   `buildLeadReplyMessage()`, `buildLeadFollowupMessage()`, `buildLeadCloseMessage()`,
   `buildVisitDraft()`. Son `String` templates. Cero red.
2. La calificación de leads es un **evaluador puro** (`agents-leads-logic.ts`), no un clasificador LLM.
3. `llm_call` está **prohibido por configuración**: figura en
   `AGENTS_CONFIG.guardrails.externalGate` (`agents-config.ts:52`), junto con `send_message`,
   `publish_content` y `scrape`.

> **Consecuencia comercial:** el módulo de agentes se puede poner al precio que resista el mercado
> **sin ningún piso de costo variable**. Su costo marginal por cliente es CPU y consultas a la base,
> no dólares de API. El techo de trabajo lo ponen los guardrails, no el presupuesto:
> `maxActionsPerRun: 25`, `maxActionsPerDay: 100`, `maxMessagesPerDay: 20`.

### 2.2 Los chatbots

| Chatbot | Dónde vive | ¿Usa modelo? | Para quién |
|---|---|---|---|
| **Recepcionista** (bot del cliente por Chatwoot) | `/opt/onia/bot/recepcionista.mjs` | **NO — cero LLM** | clientes de Onia |
| **Venta** (embudo DEMO de Onia) | `/opt/onia/bot/bot-engine.mjs` → `run-turn.mjs` | Sí, **solo la rama fuera de guion** | Onia, no el cliente |
| **WhatsApp de la plataforma** | `onia-platform/lib/whatsapp-bot.ts` → `whatsapp-ai.ts` | Sí, **solo el texto libre** | clientes de Onia — **este es el add-on de Bs 390** |

El **recepcionista** es decisión explícita de diseño (`recepcionista.mjs`, regla 4: *"SIN LLM"*):
lo que está fuera de guion se deriva al humano del negocio. Costo de API: **USD 0,00**.

---

## 3. Supuestos — todos declarados

| # | Supuesto | Valor | De dónde sale |
|---|---|---|---|
| S1 | Precio `gpt-4o-mini` | in **$0,15**/M · cached in **$0,075**/M · out **$0,60**/M | [developers.openai.com/api/docs/pricing](https://developers.openai.com/api/docs/pricing), consultado **2026-08-20**. Modelo **vigente**, no deprecado. |
| S2 | Precio `gpt-4.1-mini` | in **$0,40**/M · cached in **$0,10**/M · out **$1,60**/M | misma fuente y fecha |
| S3 | Batch API | **50% de descuento** | misma fuente |
| S4 | Tipo de cambio | **Bs 11,60 / USD** (paralelo P2P) | [dolarbolivia.net](https://dolarbolivia.net/), 2026-08-20. **Se usa el paralelo**, no el oficial: es lo que cuesta comprar los dólares con que se paga la API. |
| S5 | Oficial BCB, para contraste | **Bs 11,52 / USD** (TCO 19-ago, vigente 20-ago) | [bcb.gob.bo](https://www.bcb.gob.bo/) |
| S6 | Brecha oficial/paralelo | **~0,3%** | Desde el 29-jun-2026 Bolivia flota administrado. **El peg de 6,96 ya no existe.** Cualquier material que cotice a 6,96 está roto. |
| S7 | Ratio caracteres→tokens | **3,7 ch/token** (rango 3,3–4,0) | Español con tildes, tokenizer `o200k_base`. Se reporta rango, no número falso preciso. **No se corrió un tokenizer real** — es la única cifra estimada del doc. |
| S8 | Conversaciones incluidas | **500/mes** | `pricing.ts:37` |
| S9 | Mensajes por conversación | **3** típico, **6** pico | `pricing.ts:30` para el típico; el pico es supuesto propio |
| S10 | % de mensajes que caen al modelo | **40%** típico, **80%** pico | supuesto propio. Los menús 1-4 del bot son deterministas y no cuestan nada |

---

## 4. Tokens medidos, no supuestos

Los prompts se midieron **ejecutando el constructor real** (`buildSystemPrompt` de
`whatsapp-ai.ts`, copiado carácter por carácter) con tres perfiles de cliente.

### 4.1 Chatbot WhatsApp de la plataforma (`whatsapp-ai.ts`) — el que se cobra

| Perfil | Contexto inyectado | Chars del system | **Tokens de entrada** |
|---|---|---|---|
| Mínimo | sin teléfono, sin dirección, 0 tratamientos | 674 | **169–204** (centro 182) |
| Típico | contacto completo, 8 tratamientos | 988 | **247–299** (centro 267) |
| **Pico** | contacto completo, **20 tratamientos**, `botPrompt` de 660 ch, idioma aymara | 2.105 | **526–638** (centro 569) |

**Lo que inyecta, exactamente:**
- Identidad + idioma (detectado con marcadores, **sin llamada extra al modelo** — `detectLanguage()` es heurística local).
- Datos de contacto de la clínica (4 líneas).
- **Los tratamientos activos, con `take: 20` duro** (`whatsapp-bot.ts:201`).
- El `botPrompt` que el admin escribe en `/settings` (**sin límite de largo** — ver §8, es el único agujero).
- 5 reglas fijas.

**Dos hallazgos que aplastan el costo:**

1. **NO manda historial.** El array de mensajes es `[system, user]` y nada más
   (`whatsapp-ai.ts:132-135`). El contexto **no crece** con la conversación. Un chat de 30 turnos
   cuesta lo mismo por turno que el primero. Esto es lo que en otros chatbots hace explotar la
   factura, y acá simplemente no pasa.
2. **El catálogo no puede desbordar.** `take: 20` es un tope duro en el código. Un cliente con 500
   tratamientos inyecta 20, no 500. El costo tiene un techo estructural.

Salida: `max_tokens: 350`; el prompt pide *"máximo 3-4 oraciones"* → típico **~110 tokens**, pico **~300**.

### 4.2 Chatbot de venta de Onia (`run-turn.mjs`) — no es del cliente

- System: **360 ch = ~97 tokens**. Fijo, no crece.
- User: el `llmRequest` en JSON, con `lastInboundText` recortado a 400 ch → **~217 tokens** en el tope.
- **Entrada total ≈ 314 tokens.** Salida: `max_tokens: 160`.
- Se dispara **solo fuera de guion**, y **como máximo 2 veces por conversación**: al segundo
  malentendido hay handoff al humano (`offScript.maxBeforeHandoff`).

### 4.3 Verificación contra el gasto real (LiteLLM, VPS)

`LiteLLM_SpendLogs`, 2026-06-20 → 2026-08-20:

| Mes | Modelo | Requests | tokens in (prom.) | tokens out (prom.) | USD |
|---|---|---|---|---|---|
| 2026-08 | `openai/gpt-4.1-mini` | 282 | 803 | 336 | 0,242 |
| 2026-08 | `openai/gpt-4o-mini` | 15 | 578 | 94 | 0,002 |
| 2026-07 | `openai/gpt-4.1-mini` | 156 | 896 | 532 | 0,189 |
| 2026-07 | `openai/gpt-4o-mini` | 33 | 693 | 331 | 0,010 |
| | **TOTAL 2 meses** | **491** | | | **USD 0,443** |

**USD 0,44 en dos meses, para TODO Onia.** Bs 5,14.

⚠️ **Ese total no es "el costo de un cliente".** Es el gasto de todo lo que pasa por LiteLLM: los
agentes internos de Hermes, el motor de alta de negocio y el bot de venta. Los 803 tokens promedio
de entrada son muy superiores a los 314 del bot de venta, o sea que **la mayoría de ese gasto no es
del chatbot**.

**El uso real del LLM en el bot es casi nulo:** de 84 mensajes salientes registrados en
`onia_center.bot_messages` (32 conversaciones, 2026-07-26 → 2026-08-18), **exactamente 1 vino del
modelo** (`reply_source = 'llm'`). El resto: 68 de guion y 15 de humano.
**Tasa real fuera de guion: ~2% de los mensajes entrantes.**

⚠️ **Hueco de medición declarado:** el chatbot de la plataforma (`whatsapp-ai.ts`) llama a
**OpenAI directo con `OPENAI_API_KEY`**, no pasa por LiteLLM. Su gasto **no está en esta tabla ni
en ningún medidor**. Hoy no importa (0 clientes con el add-on activo), pero **en cuanto haya un
cliente pagando el add-on, ese gasto queda invisible**. Ver §8.

---

## 5. La tabla de costos

**Base: `gpt-4o-mini` (lo que corre en el chatbot de la plataforma, el que se cobra). Bs 11,60/USD.**

### 5.1 Chatbot WhatsApp de la plataforma — por cliente / mes

| Escenario | Conv/mes | Msg/conv | % texto libre | Llamadas | Tokens in | Tokens out | **USD/mes** | **Bs/mes** |
|---|---|---|---|---|---|---|---|---|
| **Bajo** | 200 | 3 | 30% | 180 | 180 × 207 = 37 k | 180 × 90 = 16 k | **0,015** | **0,18** |
| **Típico** | 500 | 3 | 40% | 600 | 600 × 292 = 175 k | 600 × 110 = 66 k | **0,066** | **0,76** |
| **Alto** | 500 | 5 | 60% | 1.500 | 1.500 × 400 = 600 k | 1.500 × 180 = 270 k | **0,252** | **2,92** |
| **🔴 PICO** | 1.500 | 6 | 80% | 7.200 | 7.200 × 609 = 4,38 M | 7.200 × 300 = 2,16 M | **1,95** | **22,66** |

*Cálculo del típico, explícito:* entrada 175.200 × $0,15/M = $0,0263 · salida 66.000 × $0,60/M =
$0,0396 · **total $0,066**.

*Cálculo del pico, explícito:* entrada 4.384.800 × $0,15/M = $0,658 · salida 2.160.000 × $0,60/M =
$1,296 · **total $1,954**.

**Rango honesto: entre Bs 0,17 y Bs 23 por cliente/mes según el catálogo, el `botPrompt` y el
volumen.** El pico es 133× el mínimo — pero el pico sigue siendo el 1,5% del precio.

**Si alguien cambiara este bot a `gpt-4.1-mini`** (como ya está el de venta): ×2,7 →
típico Bs 2,05 · **pico Bs 60,44**. Sigue sin perder plata, pero es plata regalada.

### 5.2 Agentes Recall / Cobrador / Captador — por cliente / mes

| Agente | Llamadas/corrida | Corridas/día | Tokens in | Tokens out | **USD/mes** | **Bs/mes** |
|---|---|---|---|---|---|---|
| Recall | **0** | 1 | 0 | 0 | **0,00** | **0,00** |
| Cobrador | **0** | 1 | 0 | 0 | **0,00** | **0,00** |
| Captador | **0** | 1 | 0 | 0 | **0,00** | **0,00** |

No hay pico. No hay escenario, ni con 100.000 pacientes, en que estos agentes cuesten un centavo de
API. El costo que sí tienen es **base de datos**: hasta ~2.700 filas leídas por org por día.

### 5.3 Chatbot de venta de Onia (costo NUESTRO, no del cliente)

| Escenario | Conversaciones | Llamadas | **USD/mes** | **Bs/mes** |
|---|---|---|---|---|
| Real medido (2% off-guion) | ~30 | ~1 | **0,0004** | **0,005** |
| Techo absoluto con `gpt-4o-mini` (500 conv × 2 llamadas, el máximo que permite el motor) | 500 | 1.000 | **0,143** | **1,66** |
| **Techo absoluto con `gpt-4.1-mini` (lo que corre hoy)** | 500 | 1.000 | **0,382** | **4,43** |

Es un costo de **marketing de Onia**, no se le imputa a ningún cliente.

---

## 6. Margen — contra lo que cobramos de verdad

Precios leídos de `onia-platform/lib/pricing.ts` y `lib/subscription-plans.ts`
(única fuente que cobra; el checkout la valida).

| Producto | Precio (Bs/mes) | Costo API típico | Costo API PICO | Margen s/API típico | Margen s/API pico |
|---|---|---|---|---|---|
| **Add-on Chatbot WhatsApp con IA** | **390** | Bs 0,76 (**0,19%**) | Bs 22,66 (**5,8%**) | **99,8%** | **94,2%** |
| Plan Básico (agentes NO incluidos) | 320 | Bs 0 | Bs 0 | 100% | 100% |
| Plan Profesional (agentes incluidos) | 750 | **Bs 0** | **Bs 0** | **100%** | **100%** |
| Plan Completo (agentes incluidos) | 1.500 | **Bs 0** | **Bs 0** | **100%** | **100%** |
| Plan Empresa (agentes incluidos) | 2.900 | **Bs 0** | **Bs 0** | **100%** | **100%** |

### ¿Algún plan pierde plata por API?

# NO. Ninguno.

Ni en el pico, ni con el modelo caro, ni combinando las dos cosas. El peor caso construible
—cliente pico, `gpt-4.1-mini`, 9.000 mensajes al mes— da **Bs 60,44/mes contra Bs 390 cobrados:
15,5%**. Sigue sin perder plata, pero ya no es ruido: al precio viejo era 4,1%. **Es el único
número de este doc que bajó de categoría al bajar el precio** — de despreciable a vigilable.

**Lo que sí puede hacer perder plata (y no es la API):**

1. **El soporte humano — y el margen se apretó 4×.** A Bs 100/h, el add-on aguanta **~3,9 h de
   soporte al mes** antes de perder plata (**~3,7 h** descontando el pico de API). A Bs 1.490 el
   aire era de ~15 h. **El equilibrio del add-on sigue siendo soporte, no tokens — pero ahora el
   colchón es de horas, no de días.** Un cliente que llame dos veces por semana ya no deja margen.
   Consecuencia operativa: el `knowledge.json` bien cargado dejó de ser una mejora y pasó a ser la
   condición de rentabilidad del add-on.
2. **El transporte de Meta — ya NO es nuestro, y por eso Bs 390 cierra.** 500 conv × 3 msg ×
   Bs 0,113 = **~Bs 170/mes**. Al precio viejo eso era el 11% y se absorbía; **a Bs 390 sería el
   43,6% del precio** y el add-on no cerraría. Desde el 2026-08-21 el cliente pone SU tarjeta en SU
   cuenta de WhatsApp Business y Meta le cobra a él. **Bajar el precio y salir de la cadena de pago
   de Meta no son dos decisiones: son una sola**, y separarlas rompe la cuenta.
3. **🔴 El 1-oct-2026 — cambió de dueño el riesgo, no desapareció.** Meta termina la ventana
   gratuita de 24 h y pasa a cobrar también las respuestas. La tarifa de `service` **todavía no
   está publicada**. Ya no golpea nuestro margen: golpea **la factura del cliente**, que puede
   subir sin que toquemos nada. Deja de ser un riesgo de margen y pasa a ser **riesgo de churn y
   de reclamo** — hay que avisárselo ANTES de que le llegue, no después.

### Corrección a `pricing.ts`

El comentario de `pricing.ts:12` dice:

> *"La IA es el 3-8% del costo; el 92-97% es el transporte de Meta."*

**La dirección era correcta y la magnitud sub estimaba el argumento** — pero desde el 2026-08-21
la tabla cambió de forma, porque **Meta ya no es un costo nuestro**:

| | Lo paga | Típico | Pico |
|---|---|---|---|
| IA (OpenAI) | **Onia** | Bs 0,76 | Bs 22,66 |
| Transporte Meta | **el cliente, en su cuenta** | ~Bs 170 | ~Bs 1.017 |
| **Costo variable NUESTRO** | | **Bs 0,76** | **Bs 22,66** |

O sea: **el 100% de nuestro costo variable es IA, y son centavos.** El 92–97% que `pricing.ts`
llamaba "transporte de Meta" no bajó ni se optimizó: **se movió a la cuenta del cliente**. La
conclusión de negocio (cobrar el trabajo y no el flete) quedó más que justificada — se ejecutó.

---

## 7. Palancas para bajar el costo — ordenadas por lo que de verdad rinden

| # | Palanca | Ahorro real | ¿Vale la pena? |
|---|---|---|---|
| 1 | **Bajar `max_tokens` de 350 a 200** en `whatsapp-ai.ts:131` | La salida cuesta **4× la entrada** ($0,60 vs $0,15). En el pico es el **66% del gasto**. Recorta el peor caso ~30% | **SÍ.** Una línea. El prompt ya pide 3-4 oraciones: 350 tokens es aire que nadie usa |
| 2 | **Volver el bot de venta a `gpt-4o-mini`** (sacar `ONIA_BOT_MODEL=gpt-4.1-mini` del `.env` del VPS) | **2,7×** sobre esa rama | **SÍ.** Es un cambio de env, cero código. Poca plata en absoluto, pero es gratis |
| 3 | **Limitar el `botPrompt`** del admin a ~600 caracteres | En el pico el `botPrompt` de 660 ch es el **31% del system prompt** | **SÍ**, pero por control, no por plata (ver §8: es también el único vector de inyección) |
| 4 | **Bajar `take: 20` a 10** en los tratamientos | ~100 tokens por llamada (~17% del pico) | **NO por costo.** Empeora las respuestas por Bs 4/mes. El tope de 20 ya es el techo estructural |
| 5 | **Cachear el conocimiento** (prompt caching de OpenAI) | **CERO hoy.** El caching automático exige **≥1.024 tokens** de prompt; el nuestro va de 182 a 569. **No califica.** | **NO.** Y es una buena noticia: significa que los prompts ya son chicos |
| 6 | **Batch API (50% off)** | 50% sobre lo que se procese en lote | **NO para chatbots** (es asíncrono, hasta 24 h; un cliente no espera). **Sí a considerar** si algún día un agente usa LLM para resumir en batch nocturno |
| 7 | **Modelo más barato para lo mecánico** | `gpt-4o-mini` **ya es el más barato** de los mini vigentes ($0,15/$0,60 vs $0,25/$2,00 de gpt-5-mini y $0,40/$1,60 de gpt-4.1-mini) | **Nada que hacer.** Ya estamos en el piso |
| 8 | **Recortar contexto del chatbot** | Ya no manda historial. No hay nada que recortar | **Ya hecho por diseño** |

> **Conclusión de las palancas:** no hay un problema de costo que resolver. La palanca #1 vale
> hacerla porque es una línea; el resto es optimizar ruido. **El esfuerzo de ingeniería rinde mucho
> más puesto en bajar el soporte humano y en prepararse para el 1-oct de Meta.**

---

## 8. Lo que NO se pudo verificar — y un riesgo que sí apareció

**No verificado:**

1. **Tokens con un tokenizer real.** No hay `tiktoken` instalado y no se instaló uno. Todas las
   cifras de tokens salen de caracteres ÷ 3,7 (rango 3,3–4,0 reportado en §4.1). El error posible
   es de ±12%; sobre Bs 0,76 y Bs 22,66 **no cambia ninguna conclusión**.
2. **Costo real por cliente con volumen de verdad.** No existe: hay **3 orgs en producción y las
   tres son de QA** (`ZZ QA Clinica Chatbot`, `ZZ QA Ferreteria Tornillo`, `Onia (interna)`), con
   0 y 1 tratamiento activo y `botPrompt` vacío. Los escenarios Alto y Pico son **construidos, no
   observados.**
3. **Tarifa `service` de Meta post-1-oct-2026.** No publicada. Desde el 2026-08-21 **ya no es una
   incógnita de NUESTRO margen**: cae en la factura que Meta le manda al cliente. Sigue siendo la
   incógnita grande, pero de su cuenta, no de la nuestra — y **no es de IA**.
4. **Precio del módulo de agentes por separado.** No existe: hoy va incluido en Profesional+
   (`PLAN_LIMITS.agentsIncluded`). Con costo variable cero, es 100% decisión de valor percibido.

**🔴 Riesgo detectado de paso (no era el objetivo, se anota):**

- **El gasto del chatbot que se cobra es invisible.** `whatsapp-ai.ts` llama a OpenAI directo con
  `OPENAI_API_KEY` y **no pasa por LiteLLM**, así que `ai-spend-sync.sh` (que lee
  `LiteLLM_SpendLogs`) **no lo ve**. Hoy da 0 porque no hay clientes; el día que haya uno, el panel
  de Finanzas va a seguir diciendo 0. **Ruta:** apuntar `whatsapp-ai.ts` al gateway LiteLLM
  (`baseURL`), y de paso queda el gasto atribuido por org.
- **El `botPrompt` del admin entra crudo al system prompt, sin límite de largo y sin guardrail.**
  El chatbot del VPS pasa **todo** texto editable por `checkGuardrails()` (`knowledge.mjs`, regla 3:
  *"NI UN PRECIO NI UNA PROMESA"*). El de la plataforma **no**: `whatsapp-ai.ts:58-60` inyecta
  `ctx.botPrompt` tal cual. Un admin puede escribir precios ahí, o pisar las 5 reglas. Es un riesgo
  de **promesa comercial**, no de costo.

---

## 9. Fuentes

**Código (gana sobre cualquier doc):**
- `onia-platform/lib/onia-core/modules/agents-runtime.ts` — los 3 agentes, feeds y plantillas
- `onia-platform/lib/onia-core/modules/agents-config.ts:52` — `llm_call` en `externalGate`
- `onia-platform/lib/whatsapp-ai.ts:29-72,129-136` — system prompt y llamada del chatbot que se cobra
- `onia-platform/lib/whatsapp-bot.ts:189-243` — cuándo cae al modelo (`take: 20`)
- `onia-platform/lib/pricing.ts` · `lib/subscription-plans.ts:28-31` · `lib/plan-limits.ts:58-126` — precios
- `hermes-content/deploy/vps-ops/bot/recepcionista.mjs:16-18` — el bot del cliente NO usa LLM
- `hermes-content/deploy/vps-ops/bot/run-turn.mjs:159-191` — la única rama LLM del bot de venta
- `hermes-content/deploy/vps-ops/bot/bot-engine.mjs:704-765` — tope de 2 llamadas y handoff

**Producción (VPS 187.77.16.63, medido 2026-08-20):**
- `docker exec onia-platform env` — flags encendidos
- `crontab -l` · `/var/log/onia-agents-cron.log` — el cron corre
- `LiteLLM_SpendLogs` — 491 requests / USD 0,443 en 2 meses
- `onia_center.bot_messages` — 1 de 84 salientes vino del LLM
- `/opt/onia/bot/webhook.env` — `ONIA_BOT_MODEL=gpt-4.1-mini`

**Externas:**
- [OpenAI API Pricing](https://developers.openai.com/api/docs/pricing) — consultado 2026-08-20
- [BCB](https://www.bcb.gob.bo/) — TCO Bs 11,52, vigente 2026-08-20
- [dolarbolivia.net](https://dolarbolivia.net/) — paralelo P2P Bs 11,60, 2026-08-20
