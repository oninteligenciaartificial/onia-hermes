# Onia al nivel de Lety / Dapta / Sendy — la brecha, medida

**Encargo de Sergio: "que quedemos al nivel de Lety o Dapta".** Eso, sin traducir, es un
eslogan. Este documento lo traduce a capacidades nombrables, dice cuáles ya están (con el
archivo y la línea que lo prueban) y cuáles no, ordenadas por **plata**.

> Fuente de verdad, sin fecha en el nombre: esto se **EDITA**, no se reemplaza por una copia
> nueva. Precios: `onia-platform/lib/pricing.ts` (add-ons) y `lib/subscription-plans.ts`
> (planes) — acá no se escribe ni un número de precio.
>
> **Verificado el 2026-08-31** contra el **código** (`onia-platform` master `e46e9ee`, y el
> motor en `hermes-content/deploy/vps-ops/bot/`) y contra **producción** (VPS: `app.env`, el
> env del contenedor `onia-platform` y la página `/register` renderizada). Los referentes
> salen de `research/competencia/SENDYPRO_TEARDOWN.md` (cuenta real, 30-ago),
> `docs/historial/ONIA_COMPETENCIA_LETY_AI_20260806.md` y la captura
> `research/competencia/s_www.dapta.ai_.html`.

---

## 0. El marco: dónde estamos parados de verdad

Contado en la base de producción hoy, no heredado de un doc:

- **3 pedidos de acceso**, sin contestar: `clinica klein` (21-ago, dental, Santa Cruz),
  `Clinica Leonardo` (23-ago, estética, Santa Cruz), `consultorio dental sonrisa feliz`
  (28-ago, dental, Santa Cruz). Son **10, 8 y 3 días**.
- **4 organizaciones** en total (Onia interna + QA). **Cero clientes pagando.**
- Los tres pidieron **el rubro que sí funciona** (dental / estética, el único 🟢). No nos
  falta producto para atenderlos: nos falta contestarles.

**Consecuencia para todo lo que sigue:** cualquier capacidad que no acerque al primer
cliente pagando va al final, por impresionante que sea. Copiarle una feature a Sendy no
paga el VPS; contestarle a la clínica Klein, sí.

---

## 1. Qué significa "su nivel", concretamente

No adjetivos. Una capacidad por línea, cada una verificable. La columna **Referente** dice
quién la tiene (S = Sendy, L = Lety, D = Dapta). La columna **¿Nos aplica?** es el filtro
importante: **Onia no es lo que ellos son.** Ellos venden un vendedor por WhatsApp; Onia
vende un ERP por rubro **con** chatbot. Una capacidad que le sirve a un e-commerce puede ser
ruido para una clínica dental, y se dice cuando pasa.

### A. Que el dueño arme y cambie su asistente solo

| # | Capacidad | Referente | ¿Nos aplica? |
|---|---|---|---|
| A1 | Plantilla pre-armada por rubro / nicho | S, L (46 nichos) | Sí |
| A2 | Editar el guion **conversando** ("atendé también los domingos") | S | Sí — es la mejor idea de los tres |
| A3 | Ver el guion actual en **pasos numerados legibles** | S | Sí |
| A4 | Publicar sin poder romperlo (validación todo-o-nada) | **ninguno** | Sí — es nuestro, no de ellos |
| A5 | Alta del producto **self-service en menos de 1 hora** | L (7 pasos) | Sí — el benchmark |
| A6 | Encender el canal (widget web / WhatsApp) sin pedirle nada a nadie | S, L | Sí |

### B. Que el asistente atienda de verdad

| # | Capacidad | Referente | ¿Nos aplica? |
|---|---|---|---|
| B1 | Contesta 24/7 en el canal del cliente | S, L, D | Sí |
| B2 | Entiende **notas de voz** | (no visto en S) | Sí — en Bolivia media conversación es audio |
| B3 | Entiende **fotos** | (no visto en S) | Sí |
| B4 | Lee **comprobantes de pago** y avisa | S (validación por visión) | Sí — acá todos pagan QR y mandan captura |
| B5 | **Contesta fuera de guion** (LLM libre sobre el conocimiento del negocio) | S, L, D | Sí — con guardrails |
| B6 | **Cierra**: agenda la cita, toma el pedido, cobra | S (cobra), L (Stripe), D (agenda) | Sí — es nuestro argumento entero |
| B7 | Insiste al que no responde, con cadencia configurable | S (20min/1.7h/3h) | Sí |
| B8 | **Frase activadora por campaña** (un embudo por anuncio/link) | S | Sí |
| B9 | **Difusiones masivas** (broadcast a la base) | S | Dudoso — ver §3.6 |

### C. Que el humano tome el control cuando hace falta

| # | Capacidad | Referente | ¿Nos aplica? |
|---|---|---|---|
| C1 | Bandeja propia, con candado bot↔humano | S ("Súper Chat") | Sí |
| C2 | Aviso al celular cuando escriben | S, D | Sí |
| C3 | Fotos, videos y audios visibles en la bandeja | S | Sí |

### D. Que lo conversado **toque el negocio**

| # | Capacidad | Referente | ¿Nos aplica? |
|---|---|---|---|
| D1 | El contacto queda como **cliente/lead en el sistema** | S (CRM propio), D (actualiza tu CRM) | Sí — y acá ganamos o perdemos |
| D2 | La cita queda **en la agenda real** | D | Sí |
| D3 | El cobro queda **en la caja** | S (QR) | Sí |
| D4 | **Métricas del asistente** (cuánto contestó, cuánto derivó, qué le preguntan) | S ("Analizar"), D ("Analyze and grow") | Sí |

### E. Que se pueda comprar y cobrar

| # | Capacidad | Referente | ¿Nos aplica? |
|---|---|---|---|
| E1 | Precio público, sin llamada de ventas | S (21 niveles), L, D | Sí |
| E2 | Contratar y pagar desde adentro del producto | S (Hotmart o comprobante manual) | Sí |
| E3 | Que el que no paga **no use** el add-on | S (límite de chats/día) | Sí |

### F. Canales

| # | Capacidad | Referente | ¿Nos aplica? |
|---|---|---|---|
| F1 | Widget web propio | L, D | Sí |
| F2 | WhatsApp oficial (API Cloud) | S, L, D | Sí |
| F3 | Instagram DM / Messenger | S(-), L | Tal vez — los 3 pedidos vinieron de Instagram |
| F4 | **Voz**: agente que atiende llamadas | D (su titular), L | **No hoy** — ver §3.6 |

---

## 2. Cuáles YA las tenemos

Verificado **en el código**, no en los docs. Los docs de Onia se equivocaron en las dos
direcciones, y en esta pasada aparecieron dos errores nuevos — están marcados con ⚠️.

| # | Estado | Evidencia |
|---|---|---|
| A1 | ✅ | `onia-platform/lib/chatbot/plantillas.ts:216` `plantillaDeTrack()` — doc pre-armado por rubro; 6 rubros con plantilla, `ganadero-offline` → `null` a propósito |
| A2 | ✅ | Panel: `app/(dashboard)/settings/chatbot/EnsenaleConversando.tsx:74` · ruta `app/api/chatbot-knowledge/sugerir/` · motor `bot/editor-sugerir.mjs:47` (LiteLLM temp 0, prohibido inventar) — doble candado motor + espejo |
| A3 | ✅ | `app/(dashboard)/settings/chatbot/ChatbotClient.tsx:672-677` "Así atiende tu asistente", pasos en vivo |
| A4 | ✅ | `bot/knowledge.mjs` `validateKnowledge` todo-o-nada + espejo `lib/chatbot/knowledge.ts` + `bot/guardrails.mjs` |
| **A5** | ✅ **⚠️ Y NADIE LO SABE** | **El alta automática está ABIERTA en producción.** `docker exec onia-platform printenv ONIA_ALTA_AUTOMATICA` → `abierta`; `ONIA_REGISTRO_CONFIRMA_CORREO` → `si`; `supabase-auth2` `GOTRUE_MAILER_AUTOCONFIRM` → `false` (los **dos** flips hechos, bien hechos). `https://app.onia.com.bo/register` renderiza el `SignupForm` ("Cargando el registro · Preparando tu cuenta", `app/(auth)/register/SignupForm.tsx:86`), no el `AccessRequestForm`. **`ONIA_CATALOGO_DE_VENTA.md` §6 y `handoff/chatbot.md` dicen que está cerrada: los dos están viejos.** |
| A6 | ✅ (web) / ⏳ (WhatsApp) | Canal web self-service: `app/api/chatbot-canal-web/route.ts` (POST enciende el inbox). WhatsApp: Embedded Signup encendido del lado servidor, falta **solo** la prueba del popup con un +591 real — es de Sergio |
| B1 | ✅ | `bot/recepcionista.mjs` completo, sobre `bot/chatwoot-adapter.mjs` |
| B2 | ✅ | `bot/audio-transcribe.mjs` — Speaches self-hosted, **gratis**, modelo forzado `faster-whisper-small` |
| B3 | ✅ | `bot/vision.mjs` + `recepcionista.mjs:169-180` (R_ATTACH_VISTO, doble filtro: guardrails + cero dígitos) |
| B4 | ✅ | `bot/recepcionista.mjs:161-167` R_COMPROBANTE — lee el monto como **eco** del documento, jamás cifra nuestra, y **nunca dice "pago confirmado"** |
| B7 | ✅ | Perilla en `ChatbotClient.tsx:460` (default ON) + barrido `bot/insistencia-run.mjs` + cron `*/30` en el VPS |
| B8 | ✅ | `bot/recepcionista.mjs:192` `campanaExacta` **antes del saludo** + `lib/chatbot/knowledge.ts:101` `campanas` (máx 10) — sirve **hoy** con `wa.me/<num>?text=<frase>` en la bio de Instagram, sin esperar a los ads |
| C1 | ✅ | `app/(dashboard)/inbox/page.tsx` + `InboxClient.tsx`; candado: el motor arma en `takeoverTurn` y desarma al resolver |
| C2 | ✅ (sin probar en celular) | `lib/chatbot/push-te-escribieron.ts` + relay del webhook. **Falta verificarlo en un celular real de Sergio** |
| C3 | ✅ | `InboxClient.tsx` — imagen inline, players de video/audio, link de archivo |
| E1 | ✅ | `lib/pricing.ts:56-66` |
| E2 | ✅ | `app/(dashboard)/settings/addon-chatbot/page.tsx` — el dueño paga y sube el comprobante; el superadmin aprueba en `/admin/payments` y se enciende `Organization.whatsappAddon` |
| **E3** | ✅ **⚠️ el catálogo se equivoca** | `ONIA_CATALOGO_DE_VENTA.md` §5 dice "el que no lo paga ve la misma pantalla". **Falso donde importa:** el paywall real no es la clave `addon.chatbot` sino el booleano `Organization.whatsappAddon`, y **sí se aplica**: `app/api/chatbot-canal-web/route.ts:64` devuelve 403 sin add-on. Sin add-on no hay inbox, y `/inbox` muestra el CTA vacío. Lo que queda abierto es el **editor** — y eso es un embudo bueno (armás tu bot gratis, pagás para encenderlo), no un agujero |
| F1, F2 | ✅ | `bot/chatwoot-onboard.mjs:78` `CREATABLE_CHANNELS = {api, web_widget}` + WhatsApp por Embedded Signup |

### Lo que creíamos que nos faltaba y ya está

Cinco cosas, y dos son caras:

1. **El alta self-service (A5) — el benchmark de Lety — está VIVA en producción.** Los dos
   docs que la sesión iba a creer dicen lo contrario. El guion de venta puede decir "probás
   14 días gratis, sin tarjeta" porque **es lo que la página ya muestra**.
2. **El paywall del add-on (E3) funciona.** El catálogo lo daba por roto; el 403 está puesto.
3. **El editor conversacional (A2)** — la copia #1 de Sendy — está entero, con **más**
   seguridad que el original: ellos le fían el guion a la IA, nosotros lo pasamos por el
   validador todo-o-nada antes de dejar publicar.
4. **Los comprobantes por visión (B4)** y **las frases de campaña (B8)** están vivos desde
   hoy mismo. B8 sirve **sin ads**: un link `wa.me?text=` en la bio de Instagram ya es un
   embudo con respuesta propia.
5. **El aviso de pedido de acceso (Telegram + correo) está encendido en producción**
   (`lib/aviso-acceso.ts`; `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID` presentes en
   `app.env`). Es decir: **las 3 solicitudes sí avisaron.** No hay bug que arreglar — hay
   una cola que nadie trabaja.

---

## 3. Cuáles NO, y qué costaría cada una

Ordenadas por **plata** (cercanía al primer cliente pagando), no por dificultad. Son **seis**
y una previa. No hay una lista de 25 porque una lista de 25 no la ejecuta nadie.

> **Sobre "costaría":** no invento horas. Digo qué toca, de qué tamaño es contra lo que ya
> existe, y si depende de una decisión de Sergio. Donde hay plata de verdad (Meta, banco) lo
> digo aparte.

### 3.0 — La previa, que no es de producto: **contestar la cola**

- **Qué desbloquea:** el primer cliente pagando. Es el único camino que ya existe entero.
- **Qué toca:** tres mensajes de WhatsApp. Cero código.
- **Depende de Sergio:** **totalmente**, y solo de él.
- **Además, gratis:** editar `ONIA_CATALOGO_DE_VENTA.md` §6 y `handoff/chatbot.md` para que
  dejen de decir que el alta está cerrada. Mientras digan eso, cada sesión nueva vende el
  producto equivocado y le ofrece "alta acompañada" a alguien que puede entrar solo.

### 3.1 — El bot **no devuelve nada al sistema** (D1, D2, D3)

Es **la** brecha. Todo nuestro posicionamiento contra Sendy es esta frase: *"cuando el bot de
Sendy vende, te anota en un CRM aparte; cuando el nuestro atiende, la cita queda EN tu agenda
y el cobro EN tu caja"*. **En el código, hoy, eso es falso.**

Lo que dice el código:

- `bot/recepcionista.mjs:16` — *"JAMAS precios, jamas agendar solo: pedido / precio / duda
  => handoff a {{humano}}"*.
- `bot/recepcionista.mjs:232` — *"Pedido / cita / compra: se toma y se ESCALA. **El bot no
  agenda ni vende solo.**"*
- El canal de intake existe pero **nadie lo alimenta**: `lib/onia-core/intake.ts:15` declara
  `whatsapp_chatwoot → lead_conversacion`, y en todo el motor no hay una sola llamada a
  `/api/onia-core/intake`. La conversación no crea ni cliente, ni lead, ni cita.
- El puente único entre los dos mundos es de ida: la plataforma escribe `chatbot_knowledge`
  (`prisma/schema.prisma:1036`) y el bot la lee. **`bot_conversations` no existe en el schema
  de Prisma**: las conversaciones viven fuera del sistema.

Y mientras tanto lo prometemos en la superficie de venta: `lib/pricing.ts:64` dice
*"Contesta, califica, **agenda** y hace seguimiento 24/7"*, y
`ONIA_PRICING_CHATBOT_PROPUESTA.md` §2 dice *"La cita queda en la agenda del sistema, el
cliente en la ficha"*. **Un prospecto que lo pruebe en la demo lo descubre en el primer
mensaje.**

- **Qué desbloquea:** el único argumento por el que alguien elegiría Onia a Bs 390 en vez de
  Sendy a Bs 240. Sin esto somos un chatbot más, y más caro.
- **Qué toca, en dos escalones:**
  1. **Barato y ya:** la agenda pública **ya existe** — `app/(public)/book/[orgSlug]/page.tsx`
     con `/api/booking/slots` y `/api/booking/appointments`, crea un `Appointment` real, y
     `Organization.slug` es único (`prisma/schema.prisma:14`). Falta que el recepcionista,
     en `wantsToOrder` / `asksBookingInfo`, mande **el link de reserva de esa org** en vez de
     derivar. Toca: `bot/recepcionista.mjs`, `bot/reply-builder.mjs`, el doc de conocimiento
     (un campo con el link o derivarlo del slug) y los guardrails (hoy filtran cifras; hay
     que dejar pasar una URL nuestra). Es **chico** y convierte la promesa en verdad.
  2. **El resto:** que el handoff empuje un `intake` con `channel: whatsapp_chatwoot` para
     que el contacto nazca como `lead_conversacion` en el sistema. Toca el ejecutor de
     efectos (`bot/persistence.mjs`) + un secreto compartido (`x-intake-secret`). **Mediano**,
     y hay que cuidar el aislamiento por organización.
- **Depende de Sergio:** no para el escalón 1. El escalón 3 (cobro en la caja) sí: sigue
  gateado por las **credenciales del BCP + mTLS** — el circuito está calcado y probado en
  mock (`BCP_MODE=mock` verificado en `webhook.env`), el código no cambia.

### 3.2 — Fuera de guion **no contesta nadie** (B5)

`bot/recepcionista.mjs:262`: *"Fuera de guion: **SIN LLM** (regla 4) — lo contesta el humano
del negocio"*. El bot del cliente responde exactamente: horarios, servicios, info de cita,
FAQ que escribió el dueño, frase de campaña, foto y comprobante. **Todo lo demás se deriva.**

Los tres referentes contestan cualquier cosa con un LLM. Nosotros elegimos no hacerlo, y la
razón era buena (un LLM que inventa un precio o un diagnóstico en una clínica es un
problema de verdad). Pero el dueño compra "asistente 24/7" y descubre que contesta cuatro
cosas — y eso se nota en la demo, no en el mes tres.

- **Qué desbloquea:** que el producto aguante una demo en vivo con preguntas reales, y que
  el argumento "IA incluida" sea cierto en la conversación y no solo en la factura.
- **Qué toca:** una rama LLM **anclada al documento del negocio como única fuente**, con los
  guardrails ya existentes de salida y el mismo filtro de cifras que ya usa la visión. El
  molde ya está escrito y probado: `bot/editor-sugerir.mjs` hace exactamente eso (temp 0,
  schema embebido, prohibido inventar, y si el resultado no valida se rechaza entero).
  **Mediano.** Costo de API: el mismo `gpt-4.1-mini` vía LiteLLM propio que ya se paga.
- **Depende de Sergio:** **sí, es decisión suya.** Es el único punto donde aflojamos el
  candado que nos hace más seguros que Sendy. La versión conservadora ("contesta solo con lo
  que el dueño escribió, y si no está lo dice y deriva") no lo afloja tanto.

### 3.3 — El agente que trae clientes está **gateado por un add-on que no existe**

`lib/onia-core/modules/agents-runtime.ts:102-116`: el agente `captador` — el que lee las
consultas de interesados, las califica y redacta la respuesta — tiene
`requiresFeature: "addon.inmobiliaria"`. Ese add-on **no está en el catálogo de venta**. Por
eso todas las corridas dan `kind_not_enabled` (línea 1158). `recall` y `cobrador` corren
todos los días; **el único que persigue plata nueva no se enciende nunca.**

- **Qué desbloquea:** que las consultas que entran no se enfríen. Es el mismo problema que
  tenemos nosotros con las 3 solicitudes, pero del lado del cliente.
- **Qué toca:** decidir la clave (`addon.chatbot`, o encenderlo por rubro) y cambiarla; el
  agente ya está escrito, con su cola de aprobación humana y su cooldown. **Chico.**
- **Depende de Sergio:** una decisión de empaquetado (¿va con el chatbot? ¿es su propio
  add-on?). Nada más.

### 3.4 — **Cero métricas** del asistente (D4)

Lo único que ve el dueño es el chip "N conversaciones atendidas hoy"
(`InboxClient.tsx:184`), y ese número se calcula **en el navegador** sobre la lista que ya
cargó: no es una métrica, es un conteo de lo que está en pantalla. No hay cuántas contestó
solo, cuántas derivó, qué le preguntan y no sabe.

Sendy tiene "Analizar" por vendedor; Dapta hace de "Analyze and grow" un tercio de su pitch.

- **Qué desbloquea:** **la renovación** (el dueño ve para qué paga Bs 390) y, para nosotros,
  el dato con el que se arma el precio — que es justo lo que Sergio pidió el 30-ago.
  "Qué le preguntan y no sabe" es además la lista de FAQs que el dueño tiene que escribir:
  el producto se mejora solo.
- **Qué toca:** el motor ya guarda las notas del turno (`faq:horario`, `handoff:...`) en
  `bot_messages` / `bot_conversations`; hace falta una lectura agregada y una tarjeta en
  `/inbox` o en `/settings/chatbot`. **Mediano**, y cruza el límite entre los dos mundos
  (las conversaciones no están en Prisma) — la misma plomería que la brecha 3.1.
- **Depende de Sergio:** no.

### 3.5 — Instagram DM y Messenger como canal del **cliente** (F3)

`bot/chatwoot-onboard.mjs:78` solo crea inboxes `api` y `web_widget`; el adaptador ni mira
`channel_type`. Chatwoot soporta Instagram y Messenger; nosotros no lo cableamos para el
cliente.

- **Qué desbloquea:** los **3 pedidos que tenemos vinieron de Instagram**. Para una clínica
  o una estética en Santa Cruz, el DM de Instagram no es un canal secundario.
- **Qué toca:** agregar el tipo de inbox al alta y el OAuth de la página del cliente. El
  motor **no cambia** (es agnóstico del canal). **Mediano**, y arrastra papeleo de Meta.
- **Depende de Sergio:** permisos de Meta por cada cliente. Y ojo: nuestro propio circuito
  IG comentario→DM tiene 2 rechazos de Meta y 0 leads — no está probado.

### 3.6 — Lo que **no** hay que copiar todavía: difusiones y voz

- **Difusiones masivas (B9).** Grep limpio: no existe nada. Y para hacerlo bien hacen falta
  **plantillas de Meta aprobadas por organización**, más el **costo por mensaje** que arranca
  el **1-oct-2026** cuando se cierra la ventana gratis de 24h. Es la única capacidad de esta
  lista que cuesta **plata de verdad por uso**, y le sirve a un e-commerce que le manda una
  promo a 5.000 contactos — no a una clínica dental con 300 pacientes. **Se especifica cuando
  haya un cliente que la pida**, no antes.
- **Voz (F4).** Dapta pone el agente de voz en el titular. Nosotros entendemos audio
  entrante (`bot/audio-transcribe.mjs`, gratis) pero no hablamos: no hay TTS ni llamadas. Es
  la brecha más cara de todas (telefonía + latencia + una voz que no espante) y la más lejos
  del primer cliente. **No se toca.**
- **Gamificación, ligas, mentores** (Sendy) y **white-label para agencias** (Lety): no son
  nuestro producto. Lety ni siquiera compite por nuestros clientes — compite por nuestro
  **rol**, vendiéndole a agencias. Su riel de cobro (Stripe) **no opera en Bolivia**.

---

## 4. Lo que NO pude verificar

Se dice, no se supone:

- **El push "te escribieron" en un celular real.** El circuito está testeado (95/95) pero
  nadie lo recibió en un teléfono. Lo prueba Sergio suscribiéndose.
- **El popup de Embedded Signup con un +591 real.** Servidor listo; falta la prueba.
- **Cuántos chats/mes aguanta el costo de IA con clientes de verdad.** La medición existe
  para una foto (Bs 0,008); para conversación completa, no.
- **Si `notify_sergio` está bien acotado.** El motor emite ese efecto en **cada handoff**,
  también en el modo recepcionista de un cliente (`bot/bot-engine.mjs:314`), y viaja por n8n
  al Telegram de Sergio. Con un cliente real puede volverse ruido; no lo medí.
- **Los números de los referentes** son los que ya estaban verificados en
  `SENDYPRO_TEARDOWN.md` y `ONIA_PRICING_CHATBOT_PROPUESTA.md`. No agregué ninguno nuevo.

---

## 5. Resumen en una línea

Al nivel de ellos nos faltan **dos cosas de producto** (que el bot devuelva algo al sistema,
y que conteste fuera de guion) y **ninguna de las dos es la que nos falta hoy**: hoy nos
falta contestarle a tres clínicas que golpearon la puerta y encontraron la casa abierta y
sin nadie adentro.

Ver también: `CLAUDE.md` (una sola fuente de verdad) · `ONIA_CATALOGO_DE_VENTA.md` ·
`research/competencia/SENDYPRO_TEARDOWN.md` · `docs/handoff/chatbot.md` ·
`ONIA_PRICING_CHATBOT_PROPUESTA.md`.
