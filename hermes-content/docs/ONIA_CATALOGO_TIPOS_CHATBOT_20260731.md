# Onia — Catálogo de tipos de chatbot (2026-07-31)

> **Qué decide este documento:** cuántos tipos de chatbot vende Onia, qué función lleva
> cada uno, **cuáles NO lleva**, qué encarece a cada uno y cómo se enchufa en Onia Platform.
>
> **Qué NO repite** (vive en `ONIA_META_Y_CHATBOT_PRODUCTO_20260725.md`, no duplicar):
> configuración de Meta, tarifas de WhatsApp, unit economics por cliente, checklist de
> requisitos por cliente, y la lista de bloqueantes B1-B6 / P1-P6 / G1-G3.
>
> Todo lo de acá sale de inventariar **código que existe**, no de una idea de producto:
> el bot propio de Onia (`hermes-content/deploy/vps-ops/bot/`, verificado corriendo en el
> VPS el 2026-07-31), el bot de Bolivian Electric (`C:\dev\clientes\Bolivian Electric`,
> rama `main`, solo lectura) y el módulo `agents` de ONIA Core (`onia-core/modules/agents.json`).

---

## 1. El eje que ordena todo: de qué se alimenta el bot

La tentación es ordenar los tipos por "cuántas funciones tiene". Es la forma equivocada:
lleva a vender features y a cotizar mal.

**Lo que de verdad separa a un chatbot de otro es qué necesita SABER para contestar.**
Eso decide el esfuerzo de arranque, quién lo mantiene y por qué se cae.

| De qué se alimenta | Costo de alimentarlo | Quién lo mantiene después | Cómo falla |
|---|---|---|---|
| **Nada** — guion fijo escrito por nosotros | horas | Onia, una sola vez | No falla; se queda corto |
| **Agenda** — disponibilidad de un calendario | días | Se mantiene sola | Ofrece un horario que ya no está |
| **Catálogo** — productos, stock, precios del cliente | **semanas** | **El cliente, para siempre** | Catálogo vacío o viejo → el bot inventa o queda mudo |
| **Sistema** — ERP: cuentas, pedidos, saldos, facturas | semanas + acceso a datos | Integración viva | Se cae la fuente → el bot afirma algo falso |
| **Nadie: arranca solo** | días sobre lo anterior | Cola de aprobación | Escribe a quien no debía |

Evidencia de que esto es el eje real y no una teoría: el propio playbook ya identificó
que **DentalGest no puede usar el bot de BE** hasta sacar el matcher de catálogo del camino
crítico (ítem P4). No es un ajuste, es que son dos productos distintos.

---

## 2. Los cinco tipos

### T1 · Recepcionista

Contesta lo repetitivo y deriva bien. No sabe nada del negocio más allá de un set de
respuestas aprobadas.

- **Hace:** FAQ aprobadas, horarios de atención, ubicación, derivación a humano, nota
  interna para el equipo, etiquetas.
- **NO hace:** no consulta precios, no consulta stock, no agenda, no captura datos
  progresivamente, no persigue a nadie.
- **Se alimenta de:** una lista de preguntas y respuestas fijas.
- **Existe hoy:** sí. BE tiene 6 FAQ aprobadas con prioridad por encima de la IA
  (`apps/web/lib/faq.ts:13-49`; la prioridad en `chatwoot-webhook.ts:683`). El módulo
  `knowledge` del core reemplaza ese arreglo fijo por contenido que **edita el cliente**
  (`onia-core/modules/knowledge.json`).
- **Esfuerzo por cliente:** 4-8 horas, casi todo redactar las respuestas con el cliente.

### T2 · Agendador — *el bot propio de Onia*

Califica al que escribe y le cierra una reunión. Es el único tipo cuyo trabajo es
**producir una cita**, no responder una pregunta.

- **Hace:** disclosure de que es un bot, califica con 3 datos, ofrece 2 horarios reales,
  agenda, hace una pregunta de contexto para preparar la reunión, un seguimiento único,
  opt-out, handoff a humano, y deja el lead en el pipeline.
- **NO hace:** **no cotiza nunca** (el precio lo da el humano en la demo: `config.mjs`
  M4_BODY), no toca catálogo, no rutea entre vendedores, no puntúa leads por rubro.
- **Se alimenta de:** un calendario. Nada del negocio del cliente.
- **Existe hoy:** **sí, corriendo.** Verificado punta a punta en el VPS el 2026-07-31 en
  modo seco: `nuevo → esperando_calificacion → esperando_horario → demo_agendada`, con
  horarios reales leídos de Cal.com, guion M0-M7, y bitácora durable en Supabase
  (`bot_conversations`, `bot_messages`). Benchmark propio: **59/60**.
- **Esfuerzo por cliente:** 1-2 días (guion + horarios + conectar el inbox).

> **Este es el producto estrella para servicios**: clínicas, estudios, consultorios,
> profesionales. Es también el que Onia se vende a sí misma, lo cual es el mejor
> argumento de venta que hay.

### T3 · Vendedor — *el bot de Bolivian Electric*

Entiende qué producto quiere el que escribe, aunque lo pida con el nombre coloquial, y
lo pasa al vendedor correcto.

- **Hace:** clasifica 5 intenciones (`types.ts:130-135`), matchea productos contra el
  catálogo del cliente, traduce modismos (17 entradas cruceñas en
  `product-matching.ts:32-59`), captura 6 datos del lead, puntúa caliente/tibio/frío,
  rutea al vendedor por ciudad con sticky, transcribe notas de voz, escala por SLA,
  arma secuencias de seguimiento.
- **NO hace, a propósito:** **no da precios** ni cantidad exacta de stock — solo "hay /
  no hay" (`openai-client.ts:132-133`, y el importador **descarta el número de stock**
  a propósito: `catalog-import.ts:30`). No toma pedidos, no cobra, no agenda.
- **Se alimenta de:** el catálogo del cliente. Es lo caro y es del cliente.
- **Existe hoy:** sí, con dos advertencias verificadas. **(a)** El catálogo en runtime
  está **vacío**: `catalog-store.ts:8` solo se puebla desde los tests, así que en
  producción el matcher opera sobre `[]` en silencio. **(b)** El bot está en dry-run en
  los 3 canales; su salida real hoy es una nota privada al vendedor, no un mensaje al
  cliente.
- **Esfuerzo por cliente:** 1-2 semanas. La ingesta del catálogo y el diccionario de
  sinónimos del rubro es el grueso.

### T4 · Operador — *conectado a Onia Platform*

Contesta con datos vivos del sistema del cliente: su saldo, su pedido, su factura, su
próximo turno.

- **Hace:** todo T2/T3 más consultar el estado real y **preparar** acciones (una
  reprogramación, un pedido, un recordatorio de cobro) que un humano aprueba.
- **NO hace:** no ejecuta plata. El core lo prohíbe explícitamente:
  `prohibited: [send_money, execute_payment, delete_data, modify_settings]`
  (`onia-core/modules/agents.json:91-97`).
- **Se alimenta de:** los módulos de Onia Platform (`commerce`, `invoicing`,
  `scheduling`). Por eso solo se le vende a quien ya tiene la plataforma.
- **Existe hoy:** **el modelo sí, la ejecución no.** El core modela agente, corrida y
  acción con 11 tipos de acción y su bandera de aprobación, y rutea a la cola. Pero el
  módulo está en `status: "draft"` con `installInProductRepos: false`, y **todo lo que
  ejecuta es `external_gate`**: LLM, envío, publicación y scraping viven fuera del core.
- **Esfuerzo por cliente:** 2-4 semanas, y exige la plataforma instalada.

### T5 · Agente 24/7 — *el que arranca solo*

Nadie le escribe: sale él. Recall de pacientes que no vuelven, cobrador de facturas
vencidas, prospector, radar normativo.

- **Hace:** corre por cron, produce **propuestas** y las deja en la cola de aprobación.
- **NO hace:** **no manda nada sin que un humano apruebe**, salvo acciones marcadas sin
  aprobación Y con el agente en autonomía `auto`. Cualquier tipo de acción desconocido
  cae a aprobación por seguridad (`agents.logic.mjs:107-113`).
- **Topes duros que ya están escritos:** 25 acciones por corrida, 100 por día, **20
  mensajes por día** (`agents.json:91-97`).
- **Existe hoy:** el ciclo de vida y los guardrails sí (38 tests verdes). Los agentes
  Recall y Cobrador ya se construyeron como borradores en la rama de DentalGest.
- **Riesgo propio:** es el único tipo que puede **quemar el número del cliente** en Meta.
  Cada mensaje suyo sale fuera de la ventana de 24 h → es plantilla paga y necesita
  opt-in demostrable.

---

## 3. Matriz de funciones

✅ obligatorio · ➕ opcional (se cobra) · ❌ **no va** (aunque exista el código)

| Función | T1 | T2 | T3 | T4 | T5 |
|---|:--:|:--:|:--:|:--:|:--:|
| FAQ aprobadas | ✅ | ✅ | ✅ | ✅ | ➕ |
| Horario de atención + fuera de horario | ✅ | ✅ | ✅ | ✅ | ✅ |
| Derivación a humano | ✅ | ✅ | ✅ | ✅ | ✅ |
| Captura progresiva de datos | ❌ | ✅ | ✅ | ✅ | ➕ |
| Calificar / descartar | ❌ | ✅ | ✅ | ✅ | ➕ |
| **Agendar sobre calendario real** | ❌ | ✅ | ❌ | ✅ | ➕ |
| **Matching de catálogo + modismos** | ❌ | ❌ | ✅ | ✅ | ❌ |
| Disponibilidad "hay / no hay" | ❌ | ❌ | ✅ | ✅ | ❌ |
| Ruteo entre vendedores | ❌ | ❌ | ✅ | ✅ | ❌ |
| Lead scoring | ❌ | ➕ | ✅ | ✅ | ➕ |
| Transcripción de audio | ➕ | ➕ | ✅ | ✅ | ❌ |
| Seguimiento programado | ❌ | ✅ (1 paso) | ✅ (2/5/15 d) | ✅ | ✅ |
| Escalamiento por SLA | ❌ | ❌ | ✅ | ✅ | ➕ |
| **Consulta al sistema del cliente** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Acción con aprobación humana** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Inicia la conversación** | ❌ | ❌ | ❌ | ➕ | ✅ |
| Aprendizaje de sinónimos | ❌ | ❌ | ✅ | ✅ | ❌ |
| Analítica de demanda (los *misses*) | ❌ | ❌ | ✅ | ✅ | ❌ |
| Probador antes de encender | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 4. El piso común — innegociable en los cinco

Esto no es una feature: es lo que separa un producto de un experimento. **Ningún tipo
sale sin las ocho.**

| # | Regla | Por qué | Estado en lo que ya existe |
|---|---|---|---|
| 1 | **Decir que es un bot** en el primer mensaje | Confianza, y política de Meta | ✅ Onia lo hace (M0). ⚠️ **BE hace lo contrario**: `openai-client.ts:129` le ordena nunca revelar que es IA |
| 2 | **Opt-out que funcione** | Sin esto se quema el número y no hay defensa ante Meta | ✅ Onia (M6 + `optOut` triggers). 🔴 **BE NO TIENE NINGUNO** |
| 3 | **Webhook fail-closed** | Sin auth, cualquiera hace que el bot le escriba a un cliente real | ✅ Onia: sin secreto responde 503. 🔴 **BE es fail-open**: `if (!secret) return true` |
| 4 | **Dedup por id de mensaje** | Chatwoot reintenta; sin esto el prospecto recibe todo dos veces | ✅ Onia, en memoria + durable |
| 5 | **Guardrail determinista sobre la salida** | El LLM no decide si puede afirmar un precio | ✅ los dos |
| 6 | **Handoff: si contesta un humano, el bot se calla** | Obligación de política de Meta | ✅ los dos |
| 7 | **Día en seco antes de encender** | Se ve lo que habría dicho sin decirlo | ✅ los dos, por default |
| 8 | **Bitácora completa** | Sin traza no se puede cobrar, auditar ni defender | ✅ Onia (Supabase). ⚠️ BE no persiste: re-deriva el estado del historial de Chatwoot en cada mensaje |

**Los tres rojos de BE (1, 2, 3) son deuda que se arrastra a cualquier cliente nuevo que
salga de ese código.** Se arreglan una vez, en la capa común, no por cliente.

---

## 5. Qué de Bolivian Electric NO va en el bot de Onia

La pregunta literal. Nada de esto es malo: es **correcto para T3 e inútil para T2**.

| Función de BE | Para qué existe allá | Por qué no va en el de Onia |
|---|---|---|
| Matcher de catálogo + 17 modismos cruceños | 12.385 SKUs; el cliente pide "un teip" | Onia no vende productos. Sin catálogo, el matcher es un no-op que solo agrega latencia |
| Importador Excel/CSV | Cargar el catálogo del cliente | No hay nada que importar |
| Ruteo entre 8 vendedores + sticky | Equipo comercial con sucursales | Sergio es uno |
| Jefes de sucursal + escalamiento SLA 5 min | 4 sucursales reales | No hay sucursales |
| Lead scoring por rubro VIP (ingenios, petroleras) | Priorizar mayoristas | El público es uno solo: clínicas de 1-3 sillones |
| Secuencia 2/5/15 días + reactivación 60 d | Ciclo largo de cotización B2B | Onia usa **un** solo seguimiento a las 22 h, a propósito: una demo se pierde en horas, no en semanas |
| Bot interno de Telegram con 12 comandos | Que el equipo consulte desde el celular | Eso ya lo cubre el panel de Onia Center |
| Ocultar que es IA | Decisión del cliente | **Contradice el piso común.** En Onia el disclosure es innegociable |

**Y al revés — qué tiene Onia que BE necesita:** opt-out, webhook fail-closed, bitácora
durable y benchmark de comprensión. Los cuatro son del piso común.

---

## 6. Qué encarece un chatbot

En orden de peso real. Sirve para cotizar sin adivinar.

1. **Ingesta de conocimiento.** De cero (T1/T2) a un catálogo del cliente (T3) hay
   semanas. Es el único ítem que puede multiplicar el setup por 10, y el único que el
   cliente tiene que **mantener** después.
2. **Integración con un sistema vivo.** Cada fuente nueva es una forma nueva de mentir
   cuando se cae. T4 exige la plataforma instalada.
3. **Iniciativa.** Que el bot arranque (T5) cambia la economía: sale de la ventana de
   24 h, entra en plantillas pagas, exige opt-in demostrable y cola de aprobación.
4. **Riesgo transaccional.** Informar es barato; preparar una acción sobre plata o salud
   exige aprobación, auditoría y topes.
5. **Canal.** Chatwoot web es gratis. WhatsApp Business API suma tarifa por mensaje,
   aprobación de plantillas y verificación del negocio del cliente.

**Lo que NO encarece, y por eso no se cobra por ahí:** los tokens del LLM. El gasto
medido es de centavos. Cotizar "por mensaje" es el error clásico: te compara con Twilio
y regala el margen.

---

## 7. Empaquetado — y una contradicción a resolver

Hoy conviven **dos escaleras distintas** en documentos vigentes:

| Fuente | Niveles | Precios (Bs) |
|---|---|---|
| `ONIA_TABLERO_20260709.md` | N1 Recordatorios · N2 Responde+capta · N3 Opera | 300+200 · 1.500+550 · 3.500+900 |
| `ONIA_META_Y_CHATBOT_PRODUCTO_20260725.md` §4.3 | Esencial · Comercial · Full | 1.500+490 · 2.900+890 · 5.900+1.890 |

**No pueden convivir: el mismo producto tiene dos precios.**

**Mi recomendación: se queda la del playbook (Esencial/Comercial/Full)** y se retira la
del tablero. Razones: es la única de las dos con unit economics calculada contra las
tarifas reales de Meta, ya asume el salto de costo del 1-oct-2026, y define bolsa
incluida y excedentes. La del tablero es anterior y no tiene ese respaldo.

Mapeo de los tipos al empaquetado que queda:

| Tipo | Plan | Setup | Mensual |
|---|---|---|---|
| T1 Recepcionista | **Esencial** | 1.500 | 490 |
| T2 Agendador | **Comercial** | 2.900 | 890 |
| T3 Vendedor | **Full** | 5.900 | 1.890 |
| T4 Operador | Full + plataforma | a medida, desde 9.900 | desde 1.890 |
| T5 Agente 24/7 | add-on sobre cualquiera | desde 1.500 por agente | desde 390 |

El botón de WhatsApp click-to-chat sigue **incluido gratis** en toda web. Lo que se cobra
es el bot.

---

## 8. Cómo se enchufa en Onia Platform

El core **no ejecuta nada de un chatbot**: canal, LLM, cron y envío son todos
`external_gate`. Lo que aporta es el modelo de datos y la política.

| Pieza del core | Qué le da al chatbot |
|---|---|
| `knowledge` | Las FAQ dejan de estar en código: las edita el cliente |
| `automation` | 11 disparadores + plantillas + despacho con clave de idempotencia |
| `commerce` | Catálogo, inventario multi-almacén y listas de precio: reemplaza el catálogo en memoria de T3 |
| `agents` | Autonomía, tipos de acción, aprobación y topes: es T4/T5 |
| `approvals` | La cola donde caen las propuestas del agente |
| `intakePolicy` | Todo canal externo entra como **work item** normalizado |

**Detalle que hay que tener presente:** el core **no tiene** entidad de conversación ni
de mensaje entrante. El mensaje de WhatsApp se aplana a un work item. O sea que el motor
conversacional (estado, guion, dedup, bitácora) **es nuestro y vive afuera** — y es
justamente el activo que el core no puede replicar.

Por rubro: T2 sirve a salud dental, estética, veterinaria y servicios profesionales.
T3 sirve a distribución B2B, ferretería/construcción y comercio minorista. Los 11 rubros
declarados están en `contract.json:772-828`.

---

## 9. Estado real hoy

| Tipo | Construido | Vendible | Qué falta |
|---|---|---|---|
| T1 | 🟡 piezas sueltas | Sí, con trabajo manual | Editor de FAQ para el cliente |
| **T2** | 🟢 **corriendo, reserva de verdad** | **Sí** | Sacar el modo seco |
| T3 | 🟡 completo pero con catálogo vacío en runtime | Solo a BE | Poblar catálogo; config por cliente (hoy hay 88 ocurrencias de "Bolivian Electric" en 30 archivos) |
| T4 | 🔴 modelado, sin ejecución | No | Plataforma instalada + adopción del módulo aprobada |
| T5 | 🟡 ciclo de vida y topes listos | No | El ejecutor (cron + LLM + envío) fuera del core |

---

## 10. Lo que falta decidir o arreglar

### 10.1 Decisiones de Sergio

1. **Ratificar el empaquetado** del §7 y retirar la escalera del tablero.
2. **Los 2 horarios fijos de demo semanales.** Hoy el bot toma disponibilidad de Cal.com;
   si preferís 2 bloques fijos, se cargan por variable de entorno sin tocar código.
3. **¿T5 se vende ya?** Es el de mayor margen y el único que puede quemar un número.

### 10.2 El hueco de la reserva — CERRADO el 2026-07-31

Estaba: el bot decía "Listo, agendado" y no reservaba nada. `calcom-availability.mjs` solo
**leía** disponibilidad, `calendar_event_id` quedaba en `null`, dos prospectos podían
quedarse con el mismo horario y la demo no aparecía en el calendario.

Resuelto con `calcom-booking.mjs`. Cómo, y por qué así:

- **Reserva por `POST /api/book/event`**, el mismo camino que la página pública. No necesita
  API key (hay 0 en la base) y, al ser el camino público, **Cal.com aplica sus propias reglas**:
  la protección contra doble reserva no la inventamos nosotros. La API v1 (`/api/bookings`) no
  sirve: en este self-hosted no está desplegada, devuelve 404.
- **Dos tipos de evento a propósito.** `demo-onia` (público) exige 10 campos obligatorios
  (empresa, presupuesto, urgencia, rol...), correcto para quien entra solo a `cal.onia.com.bo`.
  `demo-bot` (oculto, id 5) no exige ninguno: el bot ya calificó por WhatsApp con 3 datos, y
  pedirle 10 más lo perdería en el tercero. Comparten usuario y agenda, así que una reserva
  bloquea al otro. La disponibilidad se lee del público (un evento oculto no publica horarios)
  y se reserva en el oculto.
- **Si la reserva falla, el bot no miente.** El 409 por horario tomado se distingue de un error
  de red, y en ambos casos se agrega una línea honesta al mensaje en vez de dejar el "agendado"
  a secas.
- **En modo seco no reserva.** Escribir en un calendario real es un efecto externo, y el sentido
  del modo seco es que no salga nada del sistema.

Verificado contra el VPS: embudo completo con `dry_run` apagado deja `calendar_event_id`
poblado y la reserva `accepted` en Cal.com; el horario reservado desaparece de la
disponibilidad; un segundo intento al mismo horario devuelve 409.

**Corrección a un dato de este mismo documento:** llegué a reportar que no había disponibilidad
del 1 al 5 de agosto. Era falso: salió de una consulta que armé mal a mano. La agenda real es
lunes a sábado, 14:00-20:00 `America/La_Paz`, y la función de producción devuelve horarios
normalmente.
