# Onia — Chatbot propio (el que atiende "DEMO"): spec ejecutable

> **Fecha:** 2026-07-25 · **Estado:** diseño aprobable, **cero código escrito** · **Carril:** chatbot propio de Onia
> **Esto NO es el chatbot de Bolivian Electric.** BE se usa acá SOLO como fuente de patrones probados
> (lectura). Ningún archivo de BE se toca ni se copia; se copian ideas.
>
> **Fuentes leídas para este doc (verificadas, no citadas de memoria):**
> `hermes-content/docs/ONIA_CARRIL_H_LUCIA_PLAN_20260725.md` §4 (el embudo ya definido) ·
> `hermes-content/docs/ONIA_META_Y_CHATBOT_PRODUCTO_20260725.md` §3-§5 (requisitos, pricing, bloqueos) ·
> `onia-core/contract.json` v0.7.1 + `onia-core/modules/{agents,knowledge,automation,commerce}.json` ·
> `supabase/migrations/20260622_onia_center_schema.sql` (¡`onia_center.leads` YA existe!) ·
> `supabase/migrations/20260723_onia_center_video_studio.sql` (patrón de migración) ·
> `web-factory/apps/site/src/lib/onia-center-store.ts` (mapeo de estados del pipeline) ·
> `web-factory/apps/site/src/app/onia-center/live/live-runtime.ts` (patrón `liveRequest`/`liveWrite`) ·
> n8n en vivo: 68 workflows, credenciales `Telegram account` (`r8y2CN5RyOEIDce3`), `Supabase account`,
> `Postgres account`, `OpenAi account`, `ONIA VPS SSH`.

---

## 0. La decisión que ordena todo el diseño

**El bot de Onia no es un bot de catálogo.** El de Bolivian Electric resuelve "¿tienen cable 2x10?" sobre
12.385 SKUs. El de Onia resuelve **una sola cosa**: convertir a alguien que escribió la palabra `DEMO` en
**una demo agendada en la agenda de Sergio**, con el registro de qué pieza de Lucía lo trajo.

Eso cambia tres cosas respecto de BE:

| | Bolivian Electric | Onia (este bot) |
|---|---|---|
| Camino crítico de la respuesta | `availabilityReply` (matcher de catálogo) | **máquina de estados de 6 pasos** (guion fijo) |
| Rol del LLM | central (responde consultas de producto) | **marginal**: sólo la rama "dijo algo fuera de guion" |
| Qué es un éxito | el vendedor recibe el lead ruteado | **una fila con `scheduled_at` y un evento en Google Calendar** |
| Riesgo principal | confirmar el calibre equivocado | **prometer una feature que no existe / cerrar un precio** |

**Consecuencia de arquitectura, y es la más importante:** el 85-90% de las respuestas de este bot son
**texto fijo escrito por nosotros**, no generado. El LLM aparece en una sola rama. Eso lo hace barato
(casi $0), rápido, auditable, y **funciona aunque LiteLLM esté caído**. Un bot de embudo que improvisa es
un bot que promete.

**Segunda consecuencia, comercial:** este bot es a la vez el motor del embudo Y la demo del producto.
Cuando Sergio le muestre el chatbot a una clínica, la mejor prueba no es un video: es "escribí DEMO a
nuestro WhatsApp y mirá lo que te contesta". Por eso la calidad del guion no es cosmética — **es el
material de venta**.

---

## 1. Qué resuelve y qué NO (alcance cerrado)

### 1.1 DEBE (y nada más)

| # | Capacidad | Definición de "hecho" |
|---|---|---|
| D1 | **Recibir el disparador** `DEMO` (y variantes: "demo", "quiero la demo", "info") por el canal activo | El mensaje entra, se crea/recupera la conversación, se responde en < 10 s |
| D2 | **Presentarse como bot** en el primer mensaje | La primera respuesta contiene la línea de disclosure. Sin excepción |
| D3 | **Calificar con 3 datos**: (a) ¿la clínica es tuya?, (b) ¿cuántos sillones?, (c) ¿en qué ciudad? | Los 3 quedan en `qualification` jsonb. Máx. 2 re-preguntas antes de pasar a humano |
| D4 | **Ofrecer exactamente 2 horarios** (los que Sergio fije en config, punto 5 del STOP del plan de Lucía) | Se ofrecen 2 slots concretos con día y hora; nunca "cuando quieras" |
| D5 | **Agendar** el elegido | `scheduled_at` seteado + evento en Google Calendar de Sergio + aviso a Sergio por Telegram |
| D6 | **Registrar el lead con la pieza que lo trajo** | Fila en `onia_center.leads` con `raw.pieceKey` + `raw.sourceCampaign`, visible en el panel |
| D7 | **Pasar a Sergio** (handoff) cuando corresponde, y **callarse** cuando Sergio responde | `human_took_over = true` → el bot no vuelve a hablar en esa conversación |
| D8 | **Un solo follow-up a las 24 h** si no contestó | CAS sobre `followup_step`: a lo sumo uno, jamás dos |
| D9 | **Registrar todo** (cada mensaje in/out, con veredicto de guardrail) | `bot_messages` completo — es la evidencia ante una apelación de Meta y el material del `/probador-bot` |

### 1.2 NO DEBE (prohibiciones duras, verificables en el guardrail)

| # | Prohibición | Por qué |
|---|---|---|
| N1 | **Cerrar precios.** Ni "Bs 750", ni "desde", ni "el plan Pro cuesta" | El precio depende del plan y de los módulos que use el negocio. Un número mal dado en WhatsApp es una negociación perdida antes de empezar. **Nota de tensión:** el carrusel del día 8 de Lucía SÍ publica "Bs 750 = 2 ajustes". Eso es contenido, es público y está bien. **El bot igual no lo repite** — el contenido informa, el bot agenda. Si el prospecto trae el número, el bot lo reconoce y lo lleva a la demo (guion M-P1) |
| N2 | **Prometer features no desplegadas.** Especialmente: "Onia ya emite factura al SIAT" | Riesgo real: Onia NO está homologada ante el SIN. Regla del plan de Lucía: el 30-sep es **timing**, nunca "por ley tenés que comprarnos", y siempre se dice que existe el portal gratis del SIN |
| N3 | **Hablar como si fuera humano.** Nada de "yo soy Lucía", "déjame revisar tu agenda", "estoy con otro cliente" | (a) Es la tesis del pilar P4: el "es IA" se dice de frente. (b) Es política de Meta. (c) Si el prospecto descubre el engaño en la demo, perdimos la venta y la reputación |
| N4 | **Inventar cifras**: casos de clientes, "el 80% de las clínicas...", cantidad de usuarios, testimonios | Regla de riesgo del plan de Lucía. Cero casos fabricados |
| N5 | **Dar consejo profesional (clínico, legal o fiscal).** "Sí, podés facturar así", "eso es deducible", "ese tratamiento..." | El vertical salud es bandera roja en Meta; el fiscal es responsabilidad profesional. Todo eso → handoff |
| N6 | **Escribir primero a alguien que no escribió.** Nada de listas, nada de outbound frío | Sin opt-in no hay mensaje. Es la regla que cuida el número |
| N7 | **Insistir.** Un (1) follow-up. Después silencio | Explícito en §4 del plan de Lucía: "Después, lista de nutrición — sin insistir" |
| N8 | **Cerrar la venta.** No manda propuesta, no toma datos de pago, no firma nada | El bot agenda; **la demo la da Sergio**. El bot nunca promete en el chat lo que la demo no muestra |

### 1.3 Fuera de alcance de esta versión (explícito, para que no se cuele)

- Multi-tenant real (G1 del playbook, 3-4 semanas). Este bot es **de Onia, un solo tenant**.
- Catálogo / matcher de productos. No aplica.
- Cobros, propuestas, contratos.
- Voz (Pipecat / WhatsApp Calling API): 0% construido, track aparte.
- Nutrición de leads fríos a largo plazo. Después del follow-up único, el lead queda en el panel para que un humano decida.

---

## 2. La conversación completa (guion real, voseo boliviano)

### 2.1 Máquina de estados

```
                   ┌──────────────── opt_out (STOP/BAJA, en cualquier punto)
                   │
[nuevo] ──DEMO──> [esperando_calificacion] ──3 datos──> [calificado]
                   │        │                                │
                   │        └─falta dato (máx 2 re-preg.)────┘
                   │                                         │ ofrece 2 horarios
                   ▼                                         ▼
             [handoff_humano] <──────────────────── [esperando_horario]
                   ▲    ▲                                    │ elige A o B
                   │    │                                    ▼
       humano      │    │  ninguno le va / pide otro   [demo_agendada]
       respondió ──┘    └──────────────────────────────┘         │
                                                                 │ (Sergio marca)
       sin respuesta 24h → 1 follow-up → sin respuesta → [descartado]   ▼
                                                            [demo_realizada]
```

**Regla de oro del estado:** el estado sólo avanza con un dato **capturado y guardado**, nunca con una
suposición del LLM. Si no puedo escribir `qualification.sillones`, no estoy en `calificado`.

### 2.2 Los mensajes (texto exacto, listo para producción)

Salvo indicación, **todos son texto fijo** — no pasan por el LLM, por lo tanto no pueden alucinar.
Las variables van entre `{{ }}`.

---

**M0 — Bienvenida + disclosure + primera pregunta** (disparo: `DEMO`, estado `nuevo → esperando_calificacion`)

> ¡Hola! Soy el asistente automático de Onia — sí, un bot, los mismos que hacen a Lucía 🙂
> Gracias por escribir. Te agendo la demo en 2 minutos, pero primero quiero saber si te va a servir de
> verdad.
>
> Contame tres cosas rápidas:
> 1️⃣ ¿La clínica es tuya o trabajás en la de alguien más?
> 2️⃣ ¿Cuántos sillones tenés? (1, 2, 3 o más)
> 3️⃣ ¿En qué ciudad estás?

*Por qué así:* el disclosure va en la primera línea (N3 + política Meta) y **juega a favor** — es
exactamente el pilar P4. Las 3 preguntas van juntas porque en WhatsApp una-por-una se siente
interrogatorio y la gente abandona.

---

**M1a — Falta algún dato** (estado se mantiene; máx. **2** veces, contador `off_script_count` aparte)

> Perfecto, anotado {{datos_que_si_dio}}. Me falta sólo {{dato_faltante}} — ¿me lo pasás?

Si después de 2 re-preguntas siguen faltando datos → **M5 (handoff)**. No insistimos una tercera vez.

---

**M1b — Calificado, ofrece horarios** (estado `esperando_calificacion → esperando_horario`)

> Buenísimo. Con {{sillones}} {{"sillón" si 1 else "sillones"}} en {{ciudad}} esto te sirve, sí.
>
> La demo la da Sergio (humano, esta vez 😄): son 15-20 minutos por videollamada — o presencial si
> estás en Santa Cruz. Te muestra la agenda, el agente que reprograma solo por WhatsApp, y hacen la
> cuenta con TUS números.
>
> ¿Cuál te va mejor?
> **A)** {{slot_a}}
> **B)** {{slot_b}}
>
> (Si ninguno te sirve, decime y lo coordina Sergio directo.)

*Nota:* `slot_a` / `slot_b` salen de la config (`ONIA_DEMO_SLOTS`), NO de un cálculo del bot y **NO de
leer el Google Calendar**. Dos horarios fijos por semana que Sergio bloquea. Es el punto 4 del STOP del
plan de Lucía y es lo que evita el doble-booking sin escribir un integrador de calendario.

---

**M1c — Descalificado suave** (no es dueño / no es clínica / fuera del público)

> Gracias por contarme. Hoy DentalGest está armado para clínicas dentales de 1 a 3 sillones, así que
> no te quiero hacer perder 20 minutos si no es tu caso.
>
> Si en algún momento manejás vos la clínica, o conocés a alguien a quien le sirva, escribime y lo
> agendamos. Y si querés ver cómo funciona igual, todo está en el feed de Lucía.

Estado → `descartado`. **No se descarta por "no es dueño" automáticamente si dice que decide junto a
un socio** — eso es `calificado` con nota. Sólo se descarta si claramente no es el público (estudiante,
proveedor, otro rubro).

---

**M2 — Confirmación + pre-arma la demo** (estado `esperando_horario → demo_agendada`)

> Listo, agendado: **{{dia_hora_elegida}}**. Te llega el link el mismo día por acá.
>
> Para que Sergio llegue con la demo armada para vos: ¿qué es lo que más tiempo te come hoy —
> la **agenda**, los **cobros**, o los **pacientes que no vuelven**?
>
> (Respondé con una palabra y listo. Si no, igual nos vemos {{dia}}.)

*Por qué:* copiado tal cual del mensaje 3 del embudo de §4 del plan de Lucía. La pregunta de cierre
hace dos cosas: pre-arma la demo y **confirma que el número está vivo** (si contesta, el follow-up ni
se dispara).

En este punto, en paralelo: evento en Google Calendar + Telegram a Sergio + `leads.pipeline_status`
pasa a `Reunion` (valor exacto que el panel entiende, ver §4.3).

---

**M3 — Follow-up único, a las 24 h sin respuesta** (una sola vez, con reserva CAS)

> ¡Hola de nuevo! Te escribí ayer por la demo de DentalGest y quedó a medias — sé que la clínica no
> para.
>
> Te dejo dos opciones nuevas por si te sirven: **{{slot_a}}** o **{{slot_b}}**.
> Si preferís que te escriba en otro momento, decime "después" y no te molesto más.

Después de este mensaje: **silencio total**. Si no contesta → `descartado`, queda en el panel para
que un humano decida (nunca el bot).

---

**M4 — Reconocer el precio cuando el prospecto lo trae** (rama off-guion, ver §3.1)

Disparo: menciona plata ("¿cuánto cuesta?", "vi los 750", "¿es caro?").

> Buena pregunta, y te la contesto derecho: **el número exacto te lo pasa Sergio en la demo**, porque
> depende de cuántos sillones tenés y de qué necesitás activar. No te quiero tirar una cifra que
> después no sea la tuya.
>
> Lo que sí te adelanto: en la demo se hace la cuenta con TUS números — cuánto te cuesta hoy un hueco
> en la agenda contra lo que cuesta el sistema. Si no cierra, te lo decimos ahí mismo.
>
> ¿Te reservo **{{slot_a}}** o **{{slot_b}}**?

---

**M5 — Handoff a humano** (estado → `handoff_humano`)

> Eso lo tiene que ver Sergio, no yo — soy un bot y no quiero inventarte una respuesta.
>
> Ya le pasé tu consulta con todo lo que me contaste. Te escribe él desde este mismo número, en horario
> de oficina (lun-vie, 9:00-18:00). Si es urgente, decime "urgente" y lo marco.

En el mismo instante: fila `pending` en `onia_center.review_queue` (`source_type = 'lead'`,
`reviewer_role_key = 'sergio'`) + Telegram a Sergio con el resumen. **A partir de acá el bot no vuelve
a hablar en esa conversación**, conteste Sergio o no.

---

**M6 — Opt-out** (disparo: `STOP`, `BAJA`, "no me escribas", "no me interesa")

> Listo, no te escribo más. Si algún día querés verlo, escribí DEMO y arrancamos de nuevo. ¡Éxitos con
> la clínica!

Estado → `opt_out`. `opt_out_at` seteado. **Ningún proceso (ni el follow-up) vuelve a tocar esa fila.**

---

**M7 — Fuera de horario** (se APENDEA a la respuesta que corresponda, no la reemplaza)

> _(Estoy respondiendo automático fuera de horario de oficina. Sergio te confirma en la mañana.)_

El bot **sí contesta y sí agenda** fuera de horario — es medio punto de venta del producto. Sólo avisa.

---

### 2.3 Respuestas fuera de guion — la tabla de decisión

Esta tabla es **determinista** (regex + estado), corre ANTES de cualquier LLM:

| Lo que manda | Detección | Qué hace el bot |
|---|---|---|
| Pregunta de **precio** | regex plata (`cuanto (cuesta|sale)`, `precio`, `\d+\s*bs`, `caro`, `barato`) | **M4** — nunca cotiza |
| Pregunta **técnica de producto** ("¿se conecta con mi impresora?", "¿tiene rayos X?") | intención `producto_detalle` | **M5 handoff** + nota. **No adivina** |
| Pregunta **SIAT/fiscal** ("¿ya factura al SIN?") | regex `siat|factura|sin|impuesto|nit` | Respuesta fija segura: *"Sobre facturación en línea te contesto sólo lo que es público: desde el 30 de septiembre es obligatoria y el SIN tiene un portal gratis. Lo que hace DentalGest es que los datos ya estén cargados para que no tipees dos veces. El detalle exacto de tu caso lo ve Sergio en la demo."* + sigue el embudo. **Nunca "ya emitimos factura certificada"** |
| **Duda clínica/legal** | regex salud/legal | **M5 handoff**, sin opinar |
| **Queja / enojo / desconfianza fuerte** ("esto es una estafa") | regex sentimiento negativo | **M5 handoff inmediato**, sin defenderse |
| **Audio / nota de voz** | `voice` en el payload | Transcribe con Speaches en el VPS (mismo `/opt/onia/voice-transcribe-run.sh` que ya usa el Command Center) y sigue. Si falla: *"No me llegó bien el audio, ¿me lo escribís?"* |
| **Imagen / documento** | attachment sin texto | *"Recibí tu archivo. Lo mira Sergio, no lo puedo leer bien yo."* + handoff |
| **Saludo suelto** sin DEMO ("hola") | texto corto sin disparador | M0 igual (todo el que escribe a este número viene del CTA) |
| **Texto que no entiende**, 1ª vez | ninguna regla matchea | ÚNICA rama con LLM (§3.1): reformula la pregunta del estado actual. `off_script_count++` |
| **Texto que no entiende**, 2ª vez | `off_script_count >= 2` | **M5 handoff**. Dos fallos de comprensión = el bot ya no aporta |

**Regla que hay que sostener:** ante cualquier duda, el bot **entrega la conversación a un humano**.
Un handoff de más cuesta 5 minutos de Sergio. Una promesa inventada cuesta un cliente.

---

## 3. Reglas duras heredadas de Bolivian Electric (las que SÍ aplican)

Verificadas leyendo el código de BE. Adapto el mecanismo, no el archivo.

### 3.1 Guardrails deterministas sobre el texto libre de la IA

**El mecanismo de BE, tal cual (`reply-guardrails.ts`):** normaliza (minúsculas + quita tildes) → prueba
un set de regex → **si CUALQUIERA matchea, reemplaza la respuesta ENTERA por un texto seguro** (no
recorta la frase, no censura la palabra: descarta todo). Devuelve `{ok, text, violations[]}`. Y va
envuelto en try/catch que ante error devuelve el texto original: **el guardrail nunca puede romper el
webhook**.

Tres detalles de BE que hay que copiar y son fáciles de perder:

1. **Los regex NO llevan flag `/g`.** Con `/g`, `.test()` es stateful y falla en llamadas alternas.
2. **El texto seguro se testea contra sus propios regex.** `enforceGuardrails(SAFE_REPLY).ok === true`
   debe ser un test. Si no, el fallback puede dispararse a sí mismo en loop.
3. **El guardrail se aplica SÓLO al texto libre del LLM**, nunca a los mensajes de guion. En BE el
   `availabilityReply` y el FAQ salen sin filtrar porque son deterministas. Acá igual: M0-M7 no pasan
   por el filtro (los escribimos nosotros y están en el repo); sólo la rama "no entendí" pasa.

**Los regex de Onia** (reemplazan a los de stock/precio/cantidad de BE, que no aplican):

| Código | Qué caza | Regex propuestos |
|---|---|---|
| `declara_precio` | cualquier cifra de plata o cotización | `/\d+(?:[.,]\d+)?\s*(bs\b\|bolivianos?\b\|\$us\b\|usd\b\|dolares?\b)/` · `/\bcuesta\b\|\bsale\b\s*(en\|a\|por)?\s*\d/` · `/\bprecio\s*(es\|:\|=\|de\|final\|mensual)\b/` · `/\bdesde\s+bs\b/` |
| `promete_siat` | emisión fiscal certificada | `/\b(emitimos\|emite\|factura(mos)?)\b[^.]{0,30}\b(siat\|sin\|electronica\|certificada)\b/` · `/\bhomologad[oa]\b/` · `/\bautorizado por el sin\b/` |
| `promete_feature` | compromiso de capacidad | `/\bse integra con\b/` · `/\b(soporta\|incluye\|tiene)\b[^.]{0,25}\b(rayos x\|radiograf\|impresora\|nfc\|firma digital)\b/` · `/\bgarantiz\w+/` · `/\bsin falla\w*/` |
| `finge_humano` | rompe N3 | `/\bsoy (sergio\|lucia\|humano\|una persona)\b/` · `/\bte llamo (ahora\|en un rato)\b/` · `/\bestoy revisando tu\b/` |
| `cifra_inventada` | estadística sin fuente | `/\b\d{1,3}\s*%/` · `/\b(mas de\|mas que)\s+\d+\s+(clinicas\|clientes\|dentistas\|pacientes)\b/` |
| `consejo_profesional` | N5 | `/\b(te recomiendo\|deberias)\b[^.]{0,25}\b(declarar\|facturar\|tratamiento\|diagnostic)/` |

**Texto seguro (el equivalente a `SAFE_REPLY` de BE):**

> Eso prefiero no contestártelo yo — soy un bot y no quiero darte un dato equivocado. Te lo confirma
> Sergio en la demo. ¿Te reservo {{slot_a}} o {{slot_b}}?

Verificar en test: no matchea ninguno de los 6 códigos (no lleva cifras, ni "garantizo", ni "soy
humano"). Ojo con `{{slot_a}}` renderizado: si un slot dice "jueves 15:00", `/\d{1,3}\s*%/` no dispara,
pero la **sustitución de variables debe ocurrir DESPUÉS del guardrail**, no antes — si no, una hora
puede parecer una cifra.

### 3.2 El bot SE CALLA cuando responde un humano

**No es UX. Es política de Meta** (§3.3.C del playbook: *"Un bot sin salida a humano es violación de
política"*), y el complemento es que si el humano ya está atendiendo, el bot no puede pisarlo.

**Regla de BE (`chatwoot-read.ts`, verbatim del mecanismo):** trip si existe en el historial un mensaje
que sea (a) saliente, (b) NO privado, (c) `sender.type === "user"` (agente humano, no `agent_bot`, no
`contact`), (d) `sender.id !== botAgentId`. Es **permanente por conversación** (no hay ventana de
tiempo, no mira el assignee) y **falla hacia "seguir hablando"** si no hay historial.

**Cambios para Onia (dos, y son mejoras reales sobre BE):**

1. **Fallar hacia el SILENCIO, no hacia hablar.** En BE, si la API de Chatwoot falla, `getConversationMessages`
   devuelve `[]` y el bot habla igual. En un embudo comercial de Onia prefiero perder una respuesta
   automática que pisar a Sergio delante del prospecto. Si no puedo leer el estado → no respondo.
2. **Persistir el flag, no recalcularlo.** Columna `bot_conversations.human_took_over boolean`. Se pone
   en `true` y **nunca vuelve a `false` automáticamente**. Sólo Sergio puede devolver la conversación al
   bot (botón en el panel). BE recalcula leyendo todo el historial en cada mensaje; con Telegram/WhatsApp
   directo no siempre tenemos ese historial, y una lectura fallida no puede reactivar el bot.

   En BE hay un hueco documentado: `getConversationMessages` descarta mensajes con contenido vacío, así
   que **una respuesta humana que sea sólo una imagen no pausa el bot**. En Onia el flag se setea por el
   evento de "salió un mensaje que no fue mío", tenga texto o no.

### 3.3 Opt-in

**De BE:** tabla propia con `wa_id` (teléfono normalizado a los últimos 8 dígitos), `granted_at`,
`source`, `revoked_at` (nunca borra la fila: la revocación es auditable). `hasOptIn` **atrapa todo error
y devuelve `false`** — "una falla tiene que cerrar la puerta, no abrirla". Y el consentimiento se detecta
con un regex conservador: un "sí" pelado **no cuenta**.

**Para Onia es más simple y hay que decirlo:** el prospecto **escribió primero** ("DEMO"). Eso abre la
ventana de servicio de 24 h de Meta y habilita responder sin plantilla. **No necesitamos opt-in para
responder.** Lo necesitamos para **dos cosas concretas**:

- El **follow-up a las 24 h**: si cae fuera de la ventana de 24 h, requiere plantilla HSM aprobada, y
  eso requiere opt-in registrado. (Si el follow-up sale a las 24 h **justas** todavía está en ventana;
  si sale a las 26 h, ya no. **Diseño: disparar el follow-up a las 22 h**, dentro de la ventana. Ahorra
  la plantilla, ahorra el costo y ahorra el trámite. Ver §8, fase 2.)
- Cualquier mensaje futuro que no sea respuesta a uno suyo.

**Campos que guardo** (en `bot_conversations`, no en tabla aparte — es un solo tenant):
`opt_in_at`, `opt_in_source` (`inbound_demo` | `explicit_consent`), `opt_out_at`, y el texto exacto
mostrado queda en `bot_messages`. El playbook lo exige textual: *"Se guarda con timestamp, canal y texto
exacto mostrado - sin eso no hay defensa en una apelación de Meta"*.

### 3.4 Nunca inventar cifras

Regla del plan de Lucía y de BE. Se sostiene por tres capas, no por el prompt:

1. **Guion fijo:** ningún mensaje M0-M7 contiene una cifra de negocio.
2. **Guardrail** `cifra_inventada` + `declara_precio` sobre la única rama con LLM.
3. **El prompt del LLM no recibe números.** El contexto que le paso es: estado actual, datos capturados,
   y la pregunta pendiente. **No le paso el pricing, ni el catálogo de features, ni los planes.** No
   puede filtrar lo que no tiene. (Esta es la lección de BE: el `FAQS[]` hardcodeado era la fuente de
   verdad; acá directamente no le doy fuente de verdad numérica.)

### 3.5 Otros patrones de BE que valen tal cual

| Patrón BE | Cómo se aplica acá |
|---|---|
| **Flags de escritura default-OFF + dry-run default-ON**, y cada writer devuelve `status:"skipped"` en vez de error | `ONIA_BOT_DRY_RUN` arranca en `true`. En dry-run corre **todo el pipeline** y escribe `bot_messages` con `delivery_status='skipped'` — un log de acciones idéntico al de producción. Es como se prueba sin mandar un solo mensaje |
| **El webhook nunca devuelve 5xx** | Un no-2xx hace que Telegram/Meta re-entregue → mensaje duplicado al prospecto. Siempre 200, el error va al log |
| **Dedup por `message_id`** | `bot_messages.message_key` UNIQUE = `<canal>:<external_message_id>`. El insert con `on conflict do nothing` es el dedup, sin caché en memoria (mejor que BE, que usa un `Map` que se pierde al reiniciar) |
| **Reserva CAS ANTES de enviar** (`update ... where followup_step = $esperado returning`) | Idéntico. Prefiero perder un follow-up a mandar dos. Ver §4.2 |
| **Cancelación implícita** por refresco de `last_inbound_at` | Si contesta, `last_inbound_at` se actualiza y ya no cumple la condición de "24 h sin actividad". No hay ruta de cancelación que mantener |
| **`/probador-bot`** ("mostrale al cliente qué responde ANTES de encenderlo") | El playbook lo llama *"argumento de cierre, subestimado"*. Acá es la vista Chatbot del panel + el simulador de §6 |

### 3.6 Lo que NO se hereda (y por qué)

- **Matcher de productos / `availabilityReply` / analítica de demanda**: no hay catálogo.
- **`seller-router.ts`** (sticky → pool ciudad → global → gerente): hoy hay **un solo destino, Sergio**.
  El módulo se justifica cuando haya 2+ personas dando demos. Se deja el campo `owner_role_key` para
  no tener que migrar después.
- **Cadencia 2/5/15 días**: acá es **un solo follow-up**. Regla N7.

---

## 4. Modelo de datos

### 4.1 Hallazgo que cambia el diseño: `onia_center.leads` YA EXISTE

Verificado en `supabase/migrations/20260622_onia_center_schema.sql:157`. Tiene `lead_key`, `company_name`,
`business_type`, `city`, `public_contact`, `channel`, `source`, `contact_permission`, `owner_role_key`,
`pipeline_status`, `priority`, `pain_point`, `next_followup_at`, `private_notes`, `raw jsonb`. El panel la
lee (`onia-center-store.ts:630`) y el workflow n8n **"ONIA - Nuevo Lead (speed-to-lead)"** (`WA6VkNu5OHo6Npem`,
activo) ya escribe en ella.

**Por lo tanto: NO se crea una tabla `leads` nueva.** Crear una segunda sería duplicar el CRM y romper el
panel. Lo que falta no es el lead — es el **estado conversacional**, que `leads` no modela.

### 4.2 Lo que sí hace falta: 2 tablas nuevas

| Tabla | Rol | Por qué no alcanza lo que hay |
|---|---|---|
| `onia_center.bot_conversations` | 1 fila por conversación: estado del embudo, calificación, pieza de origen, flag de humano, CAS del follow-up | `leads` no tiene estado de máquina, ni `human_took_over`, ni contador de follow-up, ni `conversation_key` por canal |
| `onia_center.bot_messages` | append-only: cada mensaje in/out con veredicto de guardrail y estado de entrega | Es la evidencia ante Meta, el dedup por `message_key`, y el material del `/probador-bot` |

**Relación:** `bot_conversations.lead_key → leads.lead_key`. La conversación se crea al primer mensaje;
**el lead se crea recién al calificar** (`esperando_calificacion → calificado`). Así el CRM no se llena
de "hola" que nunca respondieron. Un lead sin calificar no es un lead.

### 4.3 Reuso de lo existente (sin tocar nada)

- **`review_queue`**: `source_type = 'lead'` **ya está en el CHECK** (verificado en la línea 293 de
  `20260622_onia_center_operating_core.sql`). **No hace falta ALTER.** El handoff crea una fila
  `pending`, `reviewer_role_key = 'sergio'`, `sensitive = true`.
- **`leads.pipeline_status`**: usar **exactamente** los valores que el panel mapea
  (`onia-center-store.ts:238`): `Nuevo` · `Contactado` · `Reunion` · `Propuesta` · `Ganado` · `Perdido`.
  ⚠️ Si escribo `demo_agendada`, el panel hace `?? "nuevo"` y **el lead aparece mal clasificado y en
  silencio**. Mapeo: calificado → `Contactado`; demo agendada → `Reunion`; demo realizada → `Propuesta`
  (Sergio la mueve); descartado → `Perdido`.
- **`audit_logs`**: cambios de estado sensibles (handoff, opt-out) con `action = 'bot_stage_change'`.
- **`onia_center.roles`**: `owner_role_key = 'sergio'` (role_key verificado en el seed).

### 4.4 ¿Y ONIA Core? — verificado en `contract.json`, sin inventar

Leí `onia-core/contract.json` (**v0.7.1, `status: "beta"`** — la memoria decía v1.0.0 stable; **el archivo
dice 0.7.1 beta**, lo reporto como está) y los módulos.

| Pieza del core | Existe de verdad | ¿Se usa acá? |
|---|---|---|
| `Contact`, `WorkItem`, `ApprovalRequest`, `ScheduleEvent`, `CommunicationChannel`, `ActivityEvent` | **Sí**, en las 18 entidades de `contract.json` | **No ahora.** Todas son `tenantScoped: true` y exigen `organizationId` |
| Módulo `agents` (`Agent` con `autonomyLevel` suggest/semi_auto/auto, `AgentRun`, `AgentAction`) | **Sí**, `modules/agents.json`, **pero `status: "draft"`** y `installInProductRepos: false` | **Conceptualmente sí, físicamente no.** Copio el modelo (`send_message` → `requiresApproval: true`, siempre humano; `qualify_lead` → `requiresApproval: false`, interna y reversible). Es **exactamente** la política de §1.2/§3.2 |
| Módulos `knowledge`, `automation`, `commerce` | Existen como `modules/*.json` + `*.schema.sql` | No. `knowledge` sería el reemplazo del guion hardcodeado **cuando el bot sea producto** (§7); `automation` (`MessageTemplate`/`MessageDispatch`) es el destino natural de las plantillas HSM en fase 4 |
| Entidad `Lead` | **NO EXISTE** en el core | Por eso `onia_center.leads` es la fuente, no el core |

**Decisión, con su razón:** `contract.json` dice `policy.installInProductRepos: false` — *"Core beta
congelado para adopcion"*. Meter este bot sobre el core hoy requeriría `organizationId` en todo y abrir
el core congelado, por un producto de **un solo tenant**. **Se construye en `onia_center`, siguiendo la
FORMA del core** (mismos nombres de estado, misma política de aprobación) para que la migración futura
sea un mapeo, no un rediseño. Es la misma conclusión del playbook §3.1: *"No reescribir el bot sobre el
core"*.

### 4.5 DDL propuesto — **NO APLICAR** (spec, no migración ejecutada)

Sigue el patrón exacto de `20260723_onia_center_video_studio.sql`: comentario de contrato arriba,
`create table if not exists`, trigger `touch_updated_at`, índices, `enable row level security`,
`grant ... to service_role`, `notify pgrst`.

```sql
-- ONIA Center — Chatbot propio de ONIA (el que atiende "DEMO").
-- Contrato de datos del embudo comercial conversacional: una fila por CONVERSACION en
-- bot_conversations (maquina de estados del embudo) y una fila APPEND-ONLY por mensaje en
-- bot_messages (evidencia ante Meta + dedup + material del probador).
-- El LEAD del CRM sigue viviendo en onia_center.leads (ya existe): la conversacion apunta a el
-- via lead_key y el lead se crea RECIEN al calificar, no al primer "hola".
-- El HANDOFF reusa la cola generica review_queue (source_type 'lead' ya esta en el CHECK).
-- REGLA DE ORO: si human_took_over = true, el bot NO vuelve a hablar en esa conversacion.
-- El bot ESCRIBE (n8n/service_role); el panel LEE. NADA de LLM corre en el VPS.

create table if not exists onia_center.bot_conversations (
  id uuid primary key default gen_random_uuid(),
  conversation_key text not null unique,          -- '<channel>:<contact_ref>'
  channel text not null default 'sim' check (
    channel in ('sim', 'telegram', 'whatsapp', 'instagram')
  ),
  contact_ref text not null,                      -- chat_id (telegram) | wa_id ult. 8 digitos | ig id
  display_name text,
  bot_stage text not null default 'nuevo' check (
    bot_stage in ('nuevo', 'esperando_calificacion', 'calificado', 'esperando_horario',
                  'demo_agendada', 'demo_realizada', 'handoff_humano', 'descartado', 'opt_out')
  ),
  piece_key text,                                 -- pieza que lo trajo: 'lucia-d03-reel-siat'
  source_campaign text,                           -- 'lucia-dentalgest-jul2026'
  qualification jsonb not null default '{}'::jsonb,  -- {ownsClinic, chairs, city, painPoint}
  slots_offered jsonb not null default '[]'::jsonb,  -- [{key:'A',label:'jue 31/07 15:00',startAt:'...'}]
  scheduled_at timestamptz,                       -- demo agendada (null hasta agendar)
  calendar_event_id text,                         -- id del evento en Google Calendar
  lead_key text references onia_center.leads(lead_key) on delete set null,
  owner_role_key text references onia_center.roles(role_key),   -- destino del handoff (hoy 'sergio')
  human_took_over boolean not null default false, -- true = el bot se calla. NUNCA vuelve solo a false
  human_took_over_at timestamptz,
  opt_in_at timestamptz,
  opt_in_source text check (opt_in_source in ('inbound_demo', 'explicit_consent')),
  opt_out_at timestamptz,
  followup_step integer not null default 0,       -- 0 = ninguno enviado. CAS: 0 -> 1, una sola vez
  off_script_count integer not null default 0,    -- 2 = handoff automatico
  last_inbound_at timestamptz,
  last_outbound_at timestamptz,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_onia_center_bot_conversations_updated_at on onia_center.bot_conversations;
create trigger trg_onia_center_bot_conversations_updated_at
before update on onia_center.bot_conversations
for each row execute function onia_center.touch_updated_at();

-- Barrido del follow-up: "activas, sin humano, sin opt-out, con paso 0 y sin actividad reciente".
create index if not exists idx_onia_center_bot_conversations_followup
  on onia_center.bot_conversations (followup_step, last_inbound_at)
  where human_took_over = false and opt_out_at is null;

create index if not exists idx_onia_center_bot_conversations_stage
  on onia_center.bot_conversations (bot_stage, updated_at desc);

create index if not exists idx_onia_center_bot_conversations_piece
  on onia_center.bot_conversations (source_campaign, piece_key);

alter table onia_center.bot_conversations enable row level security;
grant select, insert, update, delete on onia_center.bot_conversations to service_role;

-- Bitacora append-only (mismo patron que onia_center.audit_logs: solo created_at, sin trigger).
-- message_key es el DEDUP: si Telegram/Meta reentregan el mismo update, el insert choca y no pasa nada.
create table if not exists onia_center.bot_messages (
  id uuid primary key default gen_random_uuid(),
  message_key text not null unique,               -- '<channel>:<external_message_id>' | 'out:<uuid>'
  conversation_key text not null
    references onia_center.bot_conversations(conversation_key) on delete cascade,
  direction text not null check (direction in ('inbound', 'outbound')),
  author text not null default 'bot' check (author in ('contact', 'bot', 'human')),
  body text not null,
  template_key text,                              -- 'M0' | 'M1b' | 'M4' | 'llm_freeform' | null
  reply_source text not null default 'script' check (reply_source in ('script', 'llm', 'human')),
  stage_before text,
  stage_after text,
  guardrail_ok boolean not null default true,
  guardrail_violations text[] not null default '{}'::text[],
  delivery_status text not null default 'simulated' check (
    delivery_status in ('simulated', 'skipped', 'sent', 'failed')
  ),
  external_message_id text,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_onia_center_bot_messages_conversation
  on onia_center.bot_messages (conversation_key, created_at desc);

create index if not exists idx_onia_center_bot_messages_guardrail
  on onia_center.bot_messages (guardrail_ok, created_at desc)
  where guardrail_ok = false;

alter table onia_center.bot_messages enable row level security;
grant select, insert on onia_center.bot_messages to service_role;

-- Refrescar el cache de esquema de PostgREST para exponer las tablas via REST.
notify pgrst, 'reload schema';
```

**Nota sobre `review_queue`:** a diferencia de la migración del Estudio de Video, **acá NO hay que tocar
el CHECK** — `'lead'` ya está permitido. Una migración menos.

### 4.6 La reserva CAS del follow-up (el SQL exacto)

```sql
-- 1) RESERVAR (antes de enviar, nunca despues)
update onia_center.bot_conversations
   set followup_step = 1
 where conversation_key = $1
   and followup_step = 0
   and human_took_over = false
   and opt_out_at is null
returning conversation_key;
```
Si devuelve 0 filas → **no se manda nada**. Prefiero perder un follow-up a mandar dos: un duplicado
quema el quality rating del número con Meta y hace quedar mal al producto delante del prospecto.

```sql
-- 2) BARRIDO de candidatos (cron)
select conversation_key, contact_ref, channel, qualification, slots_offered
  from onia_center.bot_conversations
 where followup_step = 0
   and human_took_over = false
   and opt_out_at is null
   and bot_stage in ('esperando_calificacion', 'esperando_horario')
   and last_inbound_at is not null
   and last_inbound_at <= now() - interval '22 hours'
   and last_inbound_at >= now() - interval '7 days'
 order by last_inbound_at asc
 limit 50;
```
Las **22 horas** (no 24) son deliberadas: mantienen el mensaje dentro de la ventana de servicio de 24 h
de Meta → **no requiere plantilla HSM aprobada** → no depende del trámite de plantillas ni cuesta un
mensaje utility. El techo de 7 días evita revivir conversaciones muertas.

---

## 5. Arquitectura de ejecución

### 5.1 Restricción que manda: el VPS tiene ~237 MB de RAM libres

**Nada nuevo corre en el VPS.** Ni un contenedor, ni un modelo, ni un proceso Node persistente.

| Pieza | Dónde corre | Costo de RAM nuevo |
|---|---|---|
| **Orquestador** | n8n (ya corre en el VPS/Easypanel) | **0** — un workflow más en el proceso existente |
| **Máquina de estados + guardrails** | Nodo **Code** de n8n (JS puro, determinista, sin dependencias) | **0** |
| **Estado** | Supabase (gestionado, fuera del VPS) — credencial `Supabase account` / `Postgres account` | **0** |
| **LLM** (sólo rama off-guion) | **LiteLLM**, ya desplegado. Gasto medido ~USD 0,006/día | **0** |
| **Transcripción de audio** | Speaches en el VPS vía `/opt/onia/voice-transcribe-run.sh` (ya existe, lo usa el Command Center) | 0 nuevo; **pico** al transcribir → limitar a 1 concurrente |
| **Calendario** | Google Calendar via nodo n8n (credencial `Google Calendar account`, ya usada por el Command Center) | **0** |
| **Aviso a Sergio** | Telegram (credencial `Telegram account` `r8y2CN5RyOEIDce3`) | **0** |
| **Panel** | `web-factory/apps/site` (contenedor `onia-center` ya corriendo), sólo **lee** | **0** |

### 5.2 El pipeline, en orden (adaptado del de BE, sin las etapas de catálogo)

```
1.  Trigger del canal (webhook)                          ← devuelve 200 SIEMPRE
2.  Verificar firma / secreto                            ← 401 si falla; sin secreto configurado = rechaza
3.  Normalizar payload → {channel, contactRef, text, externalMessageId, attachments}
4.  Dedup: insert bot_messages(message_key) on conflict do nothing → si chocó, corta
5.  Cargar/crear bot_conversations (upsert por conversation_key)
6.  ¿human_took_over = true?  → registra el inbound y CORTA (el bot no habla)
7.  ¿opt_out_at is not null?  → registra y CORTA
8.  ¿es audio? → Speaches → texto (si falla, pide texto y corta)
9.  Router determinista: opt-out > queja > precio > SIAT > clínico/legal > estado actual
10. Extraer datos de calificación (regex + parser numérico; el LLM NO decide el estado)
11. Rama por estado → arma el mensaje de guion (M0..M7)
12. SOLO si nada matcheó y off_script_count < 2 → LiteLLM → enforceGuardrails() → si !ok: texto seguro
13. Renderizar variables ({{slot_a}}, {{ciudad}}...) — DESPUÉS del guardrail
14. Efectos laterales según el estado destino:
      calificado      → upsert onia_center.leads (pipeline_status 'Contactado')
      demo_agendada   → Google Calendar + Telegram a Sergio + leads → 'Reunion'
      handoff_humano  → review_queue pending/sensitive/sergio + Telegram
15. Enviar (o SKIPPEAR si ONIA_BOT_DRY_RUN)
16. Persistir: bot_messages (outbound) + update de bot_conversations (estado, last_outbound_at)
```

Etapas 6, 7 y 12 son las tres barreras. Todas **fallan hacia el silencio**.

### 5.3 Secretos — sin `$env`, por credencial de n8n

Regla de `CLAUDE.md` para el plan VPS. Necesitamos:

| Secreto | Cómo se resuelve |
|---|---|
| Service role de Supabase | credencial existente `Supabase account` (`3nx0cdsBDL1lo1zX`) o `Postgres account` (`2P4w95n0vir90EkT`) |
| Token del bot (Telegram) | credencial `telegramApi` — **una nueva** para el bot de demo (ver §6) |
| API key de LiteLLM | credencial **Header Auth** nueva (`ONIA LiteLLM`), tipo `httpHeaderAuth` |
| Secreto del webhook simulador | credencial **Header Auth** nueva (`ONIA Bot Sim Secret`) |
| Config del bot (slots, tono, flags) | **no es secreto** → fila en `onia_center.access_policies` o JSON versionado en el repo. Se lee, no se hardcodea en el nodo |

> **Observación honesta que hay que registrar:** el workflow `ONIA - Telegram Command Center`
> (`vuicWsvh0hwqKhYs`), **activo hoy**, usa `$env.ONIA_CENTER_BASE_URL` y `$env.ONIA_CENTER_INTERNAL_API_KEY`
> en un nodo HTTP Request. O sea que en este VPS `$env` **sí** resuelve, contra lo que dice la regla de
> `CLAUDE.md`. No lo cambio desde acá (es carril infra), pero **el bot nuevo se escribe con credenciales**,
> que además es lo correcto: un secreto en `$env` no rota sin reiniciar n8n.

### 5.4 Qué ve Sergio en el panel

Lectura pura con el patrón `liveRequest` de `live-runtime.ts` (mismos env vars, header `Accept-Profile`,
`cache: "no-store"`, `try/catch` que devuelve `null`):

- `getBotConversations()` → `bot_conversations?select=...&order=updated_at.desc&limit=80`
- `getBotTranscript(key)` → `bot_messages?conversation_key=eq.<key>&order=created_at.asc`
- El handoff ya aparece solo en la cola de aprobación existente (`review_queue`).
- El lead ya aparece solo en la vista Pipeline (`onia_center.leads`).

**Vista mínima (fase 3):** una tabla en `onia-center/next/pipeline` con columna **"Pieza"** — que es el
KPI del carril de Lucía: *qué pieza trajo qué demo*. Sin eso, el carril H no puede decidir qué pilar
duplicar.

---

## 6. Camino de prueba SIN WhatsApp (esto es lo que destraba TODO)

La verificación de Meta tarda **hasta 14 días hábiles** y ni siquiera está enviada (§1.3 del playbook,
paso 0 pendiente: saber quién es dueño de la WABA). **Nada del bot depende de eso.** El canal es un
adaptador de 30 líneas; el motor es el mismo.

### Vía A — Simulador HTTP (0 bloqueos, arranca hoy)

- Webhook n8n `POST /webhook/onia-demo-bot/sim`, protegido con Header Auth.
- Payload: `{ "contactRef": "test-01", "text": "DEMO" }` → responde `{ "reply": "...", "stage": "...", "guardrail": {...} }`.
- Un script local (`scripts/demo-bot-sim.mjs`, en mi worktree) reproduce **guiones completos** contra ese
  endpoint: el camino feliz, el que pregunta el precio, el que insulta, el que manda audio, el que dice STOP.
- `channel = 'sim'` → las filas quedan en las mismas tablas, se ven en el panel, y se borran con
  `delete ... where channel = 'sim'`.
- **Esto es además el `/probador-bot` que el playbook llama "argumento de cierre subestimado"**: le
  mostrás al cliente la conversación exacta antes de encender nada.

### Vía B — Telegram (5 minutos de Sergio, y es prueba real con humano)

**Restricción verificada, no supuesta:** el Command Center tiene su nodo `telegramTrigger` **desactivado**
y entra por un Webhook plano (`/webhook/.../telegram-alfred`) — o sea que el `setWebhook` del bot de
Sergio **ya apunta ahí**. Un bot de Telegram tiene **un solo webhook**. Por lo tanto **no se puede
reutilizar ese bot** sin romper el Command Center.

- **Lo que hace Sergio (5 min):** BotFather → `/newbot` → nombre `ONIA Demo` → copiar el token.
- **Lo que hago yo:** credencial `telegramApi` nueva en n8n + workflow con `Telegram Trigger` propio.
- Ventaja sobre el simulador: se prueba con **personas reales** (Sergio, Arthur, un dentista conocido),
  con audios reales, con la latencia real, y se afina el guion **antes** de gastar un mensaje de Meta.

### Vía C — Instagram DM

Bloqueada por **S6 (token IG)**, que ya es un bloqueo conocido del carril H. No se persigue ahora.

### Cuándo se enchufa WhatsApp

Cambiando **un solo nodo** (trigger + sender) y el mapeo de `contact_ref`. El motor —máquina de estados,
guardrails, tablas, follow-up CAS, panel— es idéntico. **Lo probado en Telegram es lo que sale en
WhatsApp.**

---

## 7. Cómo se convierte en producto para clientes

Es el trabajo **P1/P2/P4** del playbook (config por cliente, `/bot-config` editable, vertical sin
catálogo). Este bot **nace siendo el vertical sin catálogo** — que es justamente lo que el playbook
marca como *"Sin esto DentalGest no puede usar el bot"* (P4, 3-4 días). Construirlo así no es un desvío:
**es adelantar P4 gratis**, y encima con Onia como primer cliente (dogfooding real).

### 7.1 Qué se parametriza por cliente (va a config, nunca a código)

| Parámetro | Ejemplo Onia | Ejemplo clínica cliente |
|---|---|---|
| **Identidad y tono** | "asistente automático de Onia", voseo boliviano, informal | "asistente de la Clínica X", usted, formal |
| **Disparador** | `DEMO` | `CITA`, `INFO` |
| **Preguntas de calificación** (lista ordenada, con tipo y validación) | ¿clínica propia? / nº sillones / ciudad | ¿primera vez? / ¿qué te duele? / ¿tenés seguro? |
| **Criterio de descarte** | no es dueño de clínica dental 1-3 sillones | fuera de zona de cobertura |
| **Slots ofrecidos** | 2 fijos por semana | pull de agenda real |
| **Destino del handoff** | `sergio` (Telegram + review_queue) | recepcionista (WhatsApp + email) |
| **Horario de atención + TZ** | lun-vie 9-18, America/La_Paz | el suyo |
| **Guardrails del rubro** | precio / SIAT / features | precio / **promesa clínica** / diagnóstico |
| **Cadencia de follow-up** | 1 a las 22 h | 1 a las 22 h + 1 a los 3 días |
| **Textos M0-M7** | los de arriba | los suyos, revisados por nosotros |
| **Canal + credenciales** | Telegram → WhatsApp | su WABA |

### 7.2 Qué queda FIJO (es el producto, no se toca por cliente)

1. **El motor de la máquina de estados.** Los estados son los mismos en todos los verticales.
2. **El guardrail determinista** (mecanismo de reemplazo total + fallback auto-testeado). Cambian los
   regex del rubro, **nunca el mecanismo**.
3. **El bot se calla ante un humano.** Política de Meta, no configurable.
4. **Opt-in y opt-out.** No configurable.
5. **La reserva CAS antes de enviar.** No configurable.
6. **Prohibición de cerrar precio y de fingir ser humano.** Es la promesa de venta ("no alucina"): si es
   configurable, deja de ser una promesa.
7. **La bitácora `bot_messages` completa.** Es la defensa ante Meta y el probador.

### 7.3 El salto que falta para vender N clientes

Este bot es **un solo tenant**, igual que el de BE. El modelo "un deploy por cliente" es defendible hasta
8-10 clientes (playbook G1) — acá es aún más barato porque es **un workflow n8n + una config**, no un
contenedor. El multi-tenant real (`organization_id` en las dos tablas + config por tenant) es la puerta
natural a **ONIA Core**: `Organization`, `Contact`, `WorkItem`, `Agent` con `autonomyLevel`. Se hace
cuando haya clientes pagando, no antes.

---

## 8. Plan por fases

Esfuerzos = mi trabajo. Marco lo que depende de Meta.

### 🟢 Fase 0 — Congelar el guion (0,5 día) · **NO depende de Meta**
- Sergio aprueba: los textos M0-M7, **los 2 horarios semanales** (punto 4 del STOP del plan de Lucía) y
  que él da las demos (punto 5).
- Salida: `hermes-content/skills/` o `data/` con el guion versionado (fuente de verdad única, para que
  el bot y las respuestas manuales de DM digan lo mismo).
- **Bloqueo humano:** sin los 2 horarios el bot no puede agendar. Es la única dependencia de Sergio.

### 🟢 Fase 1 — Motor + simulador (1,5 días) · **NO depende de Meta**
- Migración `20260726_onia_center_bot_conversations.sql` (§4.5) — aplicada por el carril infra.
- Workflow n8n `ONIA - Demo Bot (core)`: normalizador, máquina de estados, guardrails, persistencia.
- Webhook simulador + `scripts/demo-bot-sim.mjs` con **8 guiones de prueba** (feliz, precio, SIAT,
  descalificado, off-guion ×2 → handoff, STOP, audio, humano interviene).
- `ONIA_BOT_DRY_RUN = true` todo el tiempo.
- **Hecho =** los 8 guiones pasan y las filas quedan bien en Supabase.

### 🟢 Fase 2 — Efectos laterales + follow-up (1 día) · **NO depende de Meta**
- Upsert a `onia_center.leads` con `pipeline_status` del set válido (§4.3).
- Google Calendar + aviso a Sergio por Telegram.
- `review_queue` en el handoff.
- Cron de follow-up con la reserva CAS (§4.6), a las 22 h.
- **Hecho =** una demo agendada en el simulador aparece en el Calendar de Sergio y en el panel.

### 🟡 Fase 3 — Telegram real (0,5 día míos + **5 min de Sergio**) · **NO depende de Meta**
- Sergio: BotFather → token. Yo: credencial + trigger + `ONIA_BOT_DRY_RUN = false` sólo para Telegram.
- Prueba con 3 personas reales, incluida una que no conozca el guion.
- **Hecho =** un tercero escribe DEMO y termina con una demo agendada, sin que nadie toque nada.
- Vista Chatbot en el panel (conversaciones + transcripción + columna **Pieza**).

### 🔴 Fase 4 — WhatsApp (1 día) · **DEPENDE DE META**
Bloqueado por, en orden: (0) saber quién es dueño de la WABA `398983206624133` — 15 min de Sergio,
**condiciona todo**; (1) verificación de negocio enviada (hasta 14 días hábiles); (2) un número
disponible (hoy el techo sin verificar son 2, y BE ocupa uno).
- Adaptador de canal + `contact_ref` = últimos 8 dígitos.
- Firma del webhook obligatoria (**B2 del playbook**: hoy el endpoint de BE acepta webhooks sin firma —
  ese error no se repite acá: **sin secreto configurado, el webhook rechaza**, no acepta).
- **Hecho =** el CTA "escribí DEMO al WhatsApp" de las 10 piezas de Lucía funciona de verdad.

### 🔴 Fase 5 — Plantilla HSM de respaldo (0,5 día + días de revisión de Meta) · **DEPENDE DE META**
Sólo si algún día el follow-up necesita salir **fuera** de la ventana de 24 h. Con el diseño de 22 h,
**no hace falta para arrancar**. Cuando toque: categoría **utility** (USD 0,0113), nunca marketing
(0,0740 — 6,5× más caro), y sin lenguaje clínico ni promesa de resultado (bandera roja del vertical
salud, §3.3 del playbook).

### ⚫ Fase 6 — Producto para clientes (3-4 días) · **NO depende de Meta para construirse**
Config por cliente (§7.1) + `/bot-config` editable + script de onboarding. Se hace **después** de que
el bot de Onia agende su primera demo real. Vender un bot que todavía no nos consiguió a nosotros un
cliente es vender humo.

### Resumen de dependencias

| Fase | Depende de Meta | Depende de Sergio | Días míos |
|---|---|---|---|
| 0 guion | No | **Sí** (2 horarios + OK textos) | 0,5 |
| 1 motor + simulador | No | No | 1,5 |
| 2 efectos + follow-up | No | No | 1 |
| 3 Telegram | No | Sí (5 min BotFather) | 0,5 |
| 4 WhatsApp | **Sí** | Sí (verificación) | 1 |
| 5 plantillas HSM | **Sí** | No | 0,5 |
| 6 producto | No | No | 3-4 |

**Se puede tener un bot funcionando de punta a punta, con personas reales, en ~3,5 días de trabajo y
5 minutos de Sergio, sin tocar Meta.**

---

## 9. Lo que NO está confirmado (para que no se pierda)

1. **Los 2 horarios semanales de demo.** Sin eso el bot no agenda. Bloqueo humano, punto 4 del STOP del plan de Lucía.
2. **Quién da las demos.** Asumo Sergio (default del plan). Si cambia, cambia el destino del handoff.
3. **El WhatsApp de destino del CTA.** El plan de Lucía lo lista como pendiente de confirmar (punto 5 del STOP).
4. **Dueño de la WABA `398983206624133`.** Paso 0 del playbook, sin resolver. Condiciona toda la fase 4.
5. **`onia-core/contract.json` dice `version 0.7.1`, `status: "beta"`** — la memoria del proyecto dice
   "v1.0.0 STABLE". Lo reporto como lo dice el archivo. Y `modules/agents.json` está en `status: "draft"`.
   No afecta a este diseño (no instalo el core), pero alguien debería alinear el registro.
6. **Costo real del LLM por mensaje.** Es el ítem P5 del playbook y sigue sin medirse. Acá importa poco
   (el LLM toca ~10-15% de los mensajes), pero el medidor debería contar igual.
7. **Que Speaches aguante la transcripción** con 237 MB libres bajo carga concurrente. Funciona hoy para
   las notas de voz de Sergio (1 por vez); con 5 prospectos mandando audios a la vez es otra historia.
   Mitigación: cola de 1 concurrente y fallback a "escribímelo".
8. **`$env` en n8n**: la regla de `CLAUDE.md` dice que no está disponible, pero un workflow activo lo usa
   y funciona. No lo toco; el bot va con credenciales igual.
