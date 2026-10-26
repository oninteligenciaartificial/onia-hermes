# Onia Voz — El bot contesta llamadas de WhatsApp (arquitectura + producto)

> **Revisión 2026-08-07.** El documento original es del 2026-08-02 (research con
> 4 agentes). Esta revisión llega el día después de que el bot de texto quedó
> vivo y con la app de Meta publicada, y cambia tres cosas de fondo: el stack de
> voz quedó decidido (Pipecat + Speaches + gpt-4o-mini + **ElevenLabs Flash**),
> el costo real se recalculó con precios verificados hoy, y el reparto de
> webhooks tiene una salida que **no toca el camino de mensajes que recién
> empezó a funcionar**.
>
> Este documento sirve para dos cosas: **§1–§7 para construirlo**, **§8–§11 para
> venderlo**. La tabla de §12 dice qué está verificado y qué no.
>
> Estado: **nada de voz está construido todavía.** Ni una línea. Lo que sigue es
> el plan, no un reporte de avance.

---

## 0. LO PRIMERO — qué es esto y qué NO es

**El bot contesta llamadas de WhatsApp. NO contesta el teléfono.**

Esta distinción no es un detalle técnico: es la definición del producto, y es lo
primero que un cliente va a entender mal. Escrita para que no se pueda vender
mal:

| Alguien hace esto | ¿Lo atiende el bot? | Por qué |
|---|---|---|
| Abre el chat de WhatsApp del negocio y toca el ícono de llamar | **SÍ** | Es una llamada de datos que viaja por la API de Meta hasta nuestro servidor |
| Marca el número desde la app de teléfono, como una llamada normal | **NO** | Esa llamada va por la red celular al chip. El chip está en Cloud API y **no tiene la app de WhatsApp instalada** — es la regla que sostiene todo el sistema. Nadie la contesta |
| Llama al fijo del negocio | **NO** | No hay ninguna conexión entre el fijo y el sistema |
| Llama desde WhatsApp Web / Desktop | **SÍ** | Es el mismo canal |

### Cómo se dice esto en una reunión, sin ambigüedad

> "Cuando tu cliente te busca en WhatsApp y aprieta el botón de llamar, contesta
> el asistente. Si te marca al celular como llamada normal, no. Son dos redes
> distintas y nosotros estamos en la de WhatsApp."

**Prohibido decir** en propuesta, landing, anuncio o demo: "recepcionista
telefónica", "contesta tu teléfono", "atiende tus llamadas" a secas, "central
telefónica con IA". Todas esas frases venden algo que el producto no hace.

**La forma correcta es siempre**: "contesta las **llamadas de WhatsApp** de tu
negocio". Con "de WhatsApp" adentro de la frase, no como aclaración al pie.

### Y en Bolivia no hay atajo hacia la telefonía real

No es que "todavía no lo hicimos": es que la vía no existe barata. Twilio y
Plivo no venden números +591. Entel entrega troncal SIP sobre VPN/Metro
Ethernet, o sea que haría falta una cajita en el local de cada cliente. El
detalle con fuentes está en **§10**, y esa sección es la que convierte la
limitación en argumento de venta — no al revés.

---

# PARTE A — CONSTRUIRLO

## 1. Cómo funciona técnicamente

### Contestar (llamada iniciada por el usuario)

```
Cliente abre el chat del negocio y toca llamar
  → Meta manda un webhook del campo `calls` (evento connect, con la oferta SDP)
  → nuestro servidor responde pre_accept y después accept, con su respuesta SDP
  → queda una sesión WebRTC directa, audio OPUS cifrado
  → Pipecat corre el bucle: VAD → STT → LLM → guardarraíl → TTS → audio
  → con barge-in (el cliente interrumpe y el bot se calla)
```

**La ventana para contestar es corta.** Entre 30 y 60 segundos desde el webhook
de conexión; si no se responde, la llamada se corta del lado del usuario con
"No contestada" y llega un webhook de terminación. Diseñar como si fueran **30
segundos**: es el número conservador y el que aparece en la mayoría de las
integraciones. Consecuencia práctica: **el servidor de voz no puede arrancar en
frío.** Un proceso que tarda 20 segundos en levantar pierde la llamada. Tiene
que estar caliente y escuchando, igual que el `webhook-server.mjs` del bot de
texto.

**Encender llamadas** en el número es `POST /<PHONE_NUMBER_ID>/settings` con
`calling.status=ENABLED`. Hoy el número está en `NOT_SET` (verificado
2026-08-07). El `phone_number_id` es `1283320641524523`.

**Gate duro y verificado**: la documentación de Meta exige que el negocio tenga
un **límite diario de mensajería de al menos 2.000 destinatarios únicos** para
habilitar llamadas. Dos cosas que lo vuelven manejable:

1. **Los números de prueba y las cuentas sandbox están exentos.** Por eso la
   fase F0 arranca hoy mismo, sin depender de esto.
2. **La verificación de negocio es el camino rápido al tier de 2.000**, y el
   portfolio **OniaAgency ya está verificado** (confirmado en el runbook del
   go-live). O sea: es muy probable que ya lo cumplamos.

Pero *muy probable* no es *verificado*. **Se lee, no se asume**: el campo es
`whatsapp_business_manager_messaging_limit` en el número, y devuelve valores del
tipo `TIER_250`, `TIER_2K`, `TIER_10K`. Tiene que dar 2K o más. Son dos minutos
y es el primer paso de F2.

> Esto **resuelve la discrepancia 0.b** de la versión anterior del documento: el
> requisito de 2.000 **no** aplica solo a las salientes, aplica al negocio para
> habilitar la función. Y el límite de mensajería cuenta conversaciones que
> **inicia el negocio** — nuestras entrantes no lo consumen.

**Si el bot no contesta**, WhatsApp ofrece buzón de voz nativo: el cliente deja
un audio en el chat, y el bot de texto **ya transcribe notas de voz**. O sea que
incluso con el motor de voz caído no se pierde el contacto. Es una red de
seguridad que ya existe y no hay que construir.

### Llamar (iniciada por el negocio) — fuera de alcance por ahora

Se paga por minuto y exige método de pago en la WABA (que hoy no está). El
circuito es: mensaje interactivo de pedido de permiso → el usuario acepta →
permiso por 7 días → `POST /calls` con `action=connect`. Bonus: si el cliente
nos llamó primero, el permiso queda automático por 7 días.

Límites conocidos: 1 pedido de permiso cada 24 h y 2 cada 7 días por usuario;
tope de 100 llamadas conectadas por día; **4 salientes seguidas sin contestar
revocan el permiso**. Va a F5, gateado.

---

## 2. El reparto de webhooks — el problema y su salida barata

### El problema, con precisión

Meta entrega los eventos a **una sola URL por app**. Hoy esa URL es Chatwoot:

```
Meta → https://onia-chatbot-…/webhooks/whatsapp/+59175414930   (Chatwoot, inbox 5)
     → webhook de cuenta (id 2) → motor del bot (onia-center:3020)
     → respuesta → WhatsApp                          [7 s punta a punta, vivo]
```

La app "Onia Bot" (`1078962684709749`) está suscrita al campo `messages`, y la
WABA tiene además un `override_callback_uri` al mismo destino.

Si suscribimos el campo `calls` a esa misma app, **los eventos de llamada
también irían a Chatwoot**, que no sabe qué hacer con ellos. Y acá está la
trampa: Chatwoot **devolvería 200 y los tiraría a la basura** — es exactamente
el modo de falla del §5.2 del manual de operación ("el éxito puede mentir"). No
habría ningún error visible. El que llama escucharía silencio y cortaría, y
nosotros concluiríamos que "la API de llamadas no funciona".

### Lo que NO resuelve el problema (verificado hoy, para que nadie lo intente)

El `override_callback_uri` **sí soporta el campo `calls`** — está en la lista
oficial de campos overridables, junto con `messages`, tanto a nivel de WABA como
a nivel de número. Suena a solución y **no lo es**: el override es *una URL*, no
*una URL por campo*. Poner un override manda **todos** los campos overridables
a esa única URL. Con un solo número y una sola WABA, los tres niveles (app →
WABA → número) siguen colapsando en una sola dirección efectiva.

Anotarlo para no repetir el análisis: **el override cambia el destino, no lo
divide.**

### RUTA 1 (recomendada) — segunda app de Meta, cero código, cero riesgo

Una WABA admite **varias apps suscritas a la vez**, y cada app tiene su propia
URL de callback y su propia suscripción de campos. Entonces:

```
                      ┌─ app "Onia Bot"  (campo: messages) → Chatwoot    [INTACTA]
WABA 4429061034078857 ┤
                      └─ app "Onia Voz"  (campo: calls)    → motor de voz [NUEVA]
```

- La app "Onia Bot" **no se toca**. Ni un byte. El camino de mensajes que empezó
  a funcionar ayer queda exactamente como está.
- La app "Onia Voz" se crea en el portfolio verificado **OniaAgency**
  (`1451773736711697`) — el mismo baile ya documentado en el runbook del
  go-live: crear la app, asignarla al usuario del sistema "Onia Automation",
  suscribirla a la WABA con `POST /<WABA_ID>/subscribed_apps`.
- Suscripción a nivel de app: **solo el campo `calls`**. Nada más.
- No hay repartidor, no hay proxy, no hay proceso nuevo en el camino crítico de
  los mensajes, y no hay nada que revertir si sale mal.

**Estado de esta ruta: hipótesis con alta confianza, PENDIENTE DE VERIFICAR.**
Lo que está confirmado por fuentes secundarias es que varias apps pueden estar
suscritas a la misma WABA y que **cada una recibe sus propias entregas con su
propio ciclo de reintentos**. Lo que no confirmé en la documentación oficial de
Meta es que la separación por campo funcione limpia entre dos apps.

**Cómo se verifica sin arriesgar nada** (30–45 min): crear la app nueva,
suscribirla solo a `calls`, apuntarla a un servidor que solo loguee. Después:
(a) mandar un mensaje de WhatsApp real → tiene que seguir llegando a Chatwoot y
el bot tiene que responder en ~7 s; (b) hacer una llamada de prueba → el evento
tiene que aparecer en el log de la app nueva. Si (a) falla, se borra la
suscripción de la app nueva y todo vuelve al estado anterior — la app vieja
nunca se modificó.

**Trampa a recordar del runbook**: hay DOS portfolios de nombre casi idéntico
("Onia Agency" con espacio, sin verificar · "OniaAgency" junto, verificado).
Distinguirlos SIEMPRE por ID. La app nueva va en `1451773736711697`.

### RUTA 2 (fallback) — el repartidor

Solo si la Ruta 1 no funciona. Un servicio propio se pone adelante de todo:

```
Meta → REPARTIDOR (URL propia, HTTPS)
        ├─ hay algún change con field=calls  → motor de voz (Pipecat)
        └─ hay algún change con otro field   → Chatwoot (la URL de hoy, tal cual)
```

**Dónde vive.** Un proceso Node chico al lado del bot (`/opt/onia/bot/`), puerto
propio, dominio propio en Easypanel, watchdog en cron cada 2 minutos igual que
`webhook-watchdog.sh`. **Deliberadamente NO adentro del servidor de Pipecat**,
aunque ahí sería una decena de líneas: si el repartidor comparte proceso con el
motor de voz, un crash de Python deja mudo al bot de **texto**. Hoy los mensajes
no dependen de ningún Python y esa propiedad no se regala. Vale la pena el
proceso extra.

**Las nueve reglas del repartidor** (cada una tapa una forma concreta de perder
un mensaje):

1. **Contestar el handshake GET.** Meta valida la URL con
   `hub.mode=subscribe` + `hub.verify_token` + `hub.challenge`, y hay que
   devolver el challenge tal cual. Sin esto Meta ni siquiera acepta el cambio de
   URL.
2. **El cuerpo se reenvía crudo, byte por byte.** Nunca parsear-y-volver-a-
   serializar: eso invalida la firma `X-Hub-Signature-256` y cambia el payload
   de formas sutiles. Se lee para decidir el destino, se reenvía el original.
3. **La cabecera `X-Hub-Signature-256` viaja intacta**, junto con el
   `content-type`. El destino tiene que poder validar como si le hubiera hablado
   Meta directo.
4. **Si el payload trae los dos tipos de campo, se manda entero a los dos
   destinos.** No se parte el JSON. Cada consumidor ignora lo que no entiende, y
   así la firma sigue siendo válida en ambas copias. Partir el cuerpo sería más
   "prolijo" y rompería la firma.
5. **La pata de Chatwoot se ESPERA y se devuelve su mismo código de estado.**
   Esta es la regla que más plata vale: Meta reintenta lo que no es 2xx. Si el
   repartidor contesta 200 mientras Chatwoot está caído, **el mensaje se pierde
   para siempre** y nadie se entera. Es la única parte del sistema donde
   fire-and-forget está prohibido.
6. **Si cualquiera de las dos patas falla, se devuelve un código no-2xx** para
   que Meta reintegre. Contraparte obligatoria: **el motor de voz tiene que
   deduplicar por id de llamada**, porque un reintento le va a llegar dos veces.
7. **Tope de 10 segundos por pata.** La ventana de la llamada es de 30.
8. **El proceso no se puede caer nunca.** Los mismos cinturones que ya tiene
   `webhook-server.mjs`: `uncaughtException`, `unhandledRejection`, listeners de
   error en request y response, y tope de tamaño del cuerpo.
9. **Un campo desconocido devuelve 200 y se loguea.** Meta manda cosas que uno
   no pidió; eso no puede tumbar nada.

**Orden de despliegue — y qué se rompe si se hace al revés:**

| # | Paso | Qué se rompe si se saltea |
|---|---|---|
| 1 | Desplegar el repartidor y dejarlo corriendo, **sin tocar Meta** | — |
| 2 | Golpearlo con `curl` usando una copia de un payload real de `messages` → confirmar que **Chatwoot lo recibe y el bot responde** | Si se cambia la URL en Meta antes de esto, el bot queda mudo para todos y recién nos enteramos por un cliente |
| 3 | Escribir el comando de rollback **antes** de cambiar nada (volver a apuntar el callback a la URL de Chatwoot) | Sin el rollback escrito, el minuto de pánico se convierte en una hora |
| 4 | Cambiar el callback en Meta al repartidor | — |
| 5 | Mensaje real desde el celular de Sergio → respuesta en ~7 s | Este es el único chequeo que prueba que no rompimos nada. Si falla: rollback del paso 3 |
| 6 | Recién ahora, suscribir el campo `calls` | Encender `calls` antes de tener a dónde mandarlos = llamadas al vacío que además parecen "la API no funciona" |

---

## 3. El stack

| Pieza | Elección | Estado |
|---|---|---|
| Orquestador | **Pipecat** (BSD, transporte oficial de WhatsApp) | a instalar (Python) |
| Transporte | `WhatsAppTransport` sobre `SmallWebRTCTransport` | del paquete |
| VAD / turnos | Silero VAD (incluido en Pipecat, corre en CPU) | incluido |
| STT | **Speaches / faster-whisper-small** — regla dura: JAMÁS el distil (es English-only y traduce el español) | ✔ vivo en el VPS, :3108 |
| Cerebro | **gpt-4o-mini** vía LiteLLM — el mismo del bot de texto | ✔ vivo en el VPS |
| Voz | **ElevenLabs Flash v2.5** — gasto aprobado por Sergio el 2026-08-07 | a contratar |
| Guion + guardarraíles | los del bot de texto, con variante hablada | ✔ existe |
| Registro | transcripción → nota privada en Chatwoot + lead en Supabase | a construir |

`WhatsAppTransport` necesita `pipecat-ai[webrtc]` y tres variables:
`WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_WEBHOOK_VERIFICATION_TOKEN`,
más una opcional para validar la firma HMAC. Maneja `pre_accept` y `accept` solo,
y entrega al callback la conexión WebRTC más los metadatos de la llamada (número
que llama, id, dirección, timestamp) sin llamadas extra a la API.

### Por qué la voz NO se autohospeda

La pregunta se hizo en serio y la respuesta es un no rotundo, con números:

- **El VPS no da.** 4 núcleos, **sin GPU**, ~9 GB libres y carga 2.18 al medirlo
  (verificado 2026-08-07). Ya está a media máquina con el bot, Chatwoot, el
  panel, n8n y LiteLLM encima.
- **Qwen3-TTS** (enero 2026 — le gana a ElevenLabs en tasa de error en 6 de 10
  idiomas) tarda **~30 segundos en generar 3 segundos de audio en CPU**. En una
  llamada eso no es "lento": es inutilizable.
- Necesita ~4,2 GB de VRAM. La GPU más barata que lo corre sale ~USD 0,53/hora,
  o sea **~USD 380/mes encendida**. Contra USD 22–99/mes de ElevenLabs, no hay
  discusión.
- **Kokoro** sí corre en CPU, pero es liviano por diseño: no clona voz de marca y
  su español está por debajo. Sirve para leer notificaciones, no para vender.
- Y lo decisivo: meter síntesis de voz en tiempo real al VPS **degradaría el bot
  de WhatsApp que recién empezó a funcionar**. El texto está vivo desde ayer y
  tiene prioridad sobre una función que todavía no existe.

**Efecto lateral bueno**: con la voz en la nube, el VPS solo carga transporte
WebRTC + VAD + Whisper. La estimación vieja de "2–3 llamadas simultáneas"
asumía TTS local; sin él debería aguantar más. **Pero eso hay que medirlo, no
suponerlo** — es una de las mediciones obligatorias de F0.

### Descartados, con motivo

LiveKit (conector de WhatsApp en beta, exige servidor propio pesado) · Vocode
(muerto desde nov-2024) · Bolna (sin WhatsApp) · XTTS (más lento que tiempo real
en CPU + licencia no comercial) · Piper (gratis y rápido, pero la voz no vende
un producto premium) · el canal de voz de Chatwoot (ver §11).

---

## 4. Los guardarraíles en voz — la parte peligrosa

En texto, si el bot dice una barbaridad, se ve, se puede editar el hilo y el
prospecto puede releer. **En voz no hay ninguna de esas tres cosas.** Lo dicho,
dicho. Por eso la voz necesita el mismo mecanismo del texto, más una regla que
en texto no hace falta.

### 4.1 El principio no cambia: guion primero, IA solo en el hueco

Es tentador pensar que "en voz no hay guion fijo". **Falso, y es el error que
haría fracasar el producto.** La llamada tiene la misma máquina de estados que
el chat: saludo → qué necesita → calificar → ofrecer horario → reservar →
despedir. La enorme mayoría de lo que el bot dice sale de los ~20 mensajes de
`SCRIPT` en `config.mjs`, igual que hoy.

Lo que hay que construir es una **variante hablada** de esos mensajes, no un bot
nuevo:

- Sin viñetas ni listas (no se pueden oír).
- Sin URLs leídas en voz alta (el link va por chat, no por audio).
- Números dichos como se dicen, no como se escriben.
- Frases cortas — una idea por frase, porque no se puede volver atrás.

Los mensajes de guion **no pasan por el guardarraíl**, igual que hoy: ya están
revisados. El guardarraíl existe para el texto libre del modelo.

### 4.2 El orden es innegociable

```
audio → STT → LLM → [BUFFER COMPLETO] → enforceGuardrails() → TTS → audio
```

**El LLM se buferea hasta tener la respuesta completa, se pasa por el
guardarraíl, y recién entonces se sintetiza.** Nunca al revés, nunca en
paralelo.

**Esta es la regla que más riesgo tiene de que alguien la rompa después**, y hay
que escribirla en el código como comentario, no solo acá. El "optimizador"
obvio de latencia es streamear los tokens del modelo directo a ElevenLabs a
medida que salen. Si se hace eso, **el guardarraíl deja de existir**: para
cuando aparece la palabra prohibida, la primera mitad de la frase ya salió por
el parlante y no hay forma de retirarla. Se gana medio segundo y se pierde el
único mecanismo que impide que el bot cotice.

El costo de bufear es real: el modelo genera como mucho 2 frases (~160 tokens),
o sea del orden de medio segundo a un segundo antes de que arranque el audio.
**Se tapa con una muletilla del guion** — una línea corta ya revisada, del tipo
"dejame ver eso", que se sintetiza mientras el modelo termina. Suena natural y
es gratis.

### 4.3 Una regla nueva, solo para voz

A las seis reglas actuales (`declara_precio`, `promete_siat`, `promete_feature`,
`finge_humano`, `cifra_inventada`, `consejo_profesional`) se le suma una séptima
que **solo aplica al texto libre del modelo en modo voz**:

- **`cifra_en_voz`** — cualquier dígito en la respuesta libre del modelo dispara
  el texto seguro.

Es más estricto que en texto y es a propósito: en voz, un número dicho es un
número que el cliente anota. Los horarios y demás cifras legítimas no salen del
modelo — salen del guion con sus variables `{{slot_a}}` / `{{slot_b}}`, que se
renderizan **después** del guardarraíl (por el mismo motivo que ya está
comentado en `guardrails.mjs`: si se renderizan antes, una hora parece una
cifra y dispara el filtro contra sí mismo). Una regex, y cierra casi entero el
agujero de "el bot dijo un precio en voz alta".

### 4.4 El texto seguro necesita versión hablada

El `SAFE_REPLY` actual está escrito para leerse. La versión de voz dice lo
mismo en frases cortas, conserva sus `{{ }}` sin renderizar, y **se testea
contra sus propios regex** — si no, el fallback se dispara a sí mismo (ya es un
test en el repo y tiene que seguir siéndolo).

### 4.5 En voz, una violación basta para agendar

En texto el bot tolera dos malentendidos antes de derivar
(`offScript.maxBeforeHandoff: 2`). En voz, **una sola violación de guardarraíl
debería cerrar la conversación hacia el agendamiento**. Motivo: el que llama no
puede scrollear ni releer, y una segunda vuelta rara quema la llamada entera.
Mejor decir "esto te lo confirma Sergio, ¿te reservo el jueves?" y salir bien.

Toda violación se loguea con el id de llamada y viaja por el canal de aviso que
ya existe (`notifyCount` / `notifyReasons`).

### 4.6 El aviso de que es un bot va PRIMERO

La primera frase de toda llamada dice que es un asistente automatizado y que la
conversación se transcribe. No es cortesía: cubre tres cosas a la vez —

1. la política de Meta,
2. el pilar P4 de Onia y la regla `finge_humano`,
3. el **art. 301 del Código Penal boliviano**, que castiga con 3 meses a 1 año
   grabar palabras de otro sin consentimiento cuando puede causar daño (ver §10).

Una línea de guion, tres riesgos tapados. El consentimiento se registra con
timestamp.

---

## 5. El flujo de la llamada (definido por Sergio, sigue vigente)

```
Entra la llamada de WhatsApp
  → contesta el bot: avisa que es un bot, saluda, escucha qué necesita
  → RESUELVE lo que puede (qué hace el sistema, cómo funciona, horarios)
  → si quiere hablar con una persona:
        NO se transfiere en vivo → se AGENDA la reunión (Cal.com)
  → si el bot no contesta (caído/ocupado): buzón de voz de WhatsApp
        → audio al chat → el bot de texto ya lo transcribe → nada se pierde
```

**Por qué agendar en vez de transferir** (razonamiento de Sergio, correcto): el
que acepta reservar un horario ya demostró intención real; el preguntón se cae
solo. Bonus técnico: elimina la pieza más difícil de construir —transferir una
llamada WebRTC a un humano en vivo—, que además Chatwoot no soporta.

**Válvula de escape por señal, no por regla** (recomendación, pendiente de OK):
si en la llamada aparece intención alta ("quiero contratar", "cuánto es y cómo
pago") o es un cliente con un problema, el bot igual agenda **pero dispara aviso
inmediato a Sergio** para que devuelva la llamada en minutos si quiere. Hacer
esperar a todos por igual convierte el filtro en fuga.

**Filtro ≠ muro.** El bot no debe resistir hasta que el prospecto insista en
hablar con un humano: eso espanta también a los buenos. Califica rápido y ofrece
el horario temprano. El objetivo no es evitar reuniones, es que las que ocurran
valgan la pena.

---

## 6. Las fases

Cada fase termina con algo **verificado en producción**, no "construido". Un
flag apagado es trabajo con valor cero.

### F0 — Probar que la hipótesis vive (número de test, cero riesgo)

Meta exime a los números de prueba del requisito de tier, y la WABA de prueba
con el **+1 555-649-7880** sigue existiendo. Nada de producción se toca.

- Clonar el ejemplo de WhatsApp de Pipecat, correrlo en el VPS con dominio
  propio, cablear Speaches + gpt-4o-mini + ElevenLabs Flash.
- **Verificación:** Sergio llama desde su WhatsApp al número de test, la IA le
  contesta con la voz de ElevenLabs y sostiene un ida y vuelta. Guardar la
  grabación como evidencia.
- **Las cuatro mediciones obligatorias** (sin esto, todo lo comercial queda sin
  piso):
  1. **Latencia voz-a-voz real** con Whisper en CPU. Es EL número que decide si
     el producto se puede vender.
  2. **Caracteres enviados a ElevenLabs ÷ segundos de audio producidos** → el
     valor real de A1 (hoy es una estimación, ver §9).
  3. **Ratio de habla del bot** sobre el total de la llamada → A2.
  4. **Carga del VPS con 1 y con 2 llamadas simultáneas** → el límite real de
     concurrencia.
- Duración estimada: ~1 día.
- **Contingencia si la latencia pasa de ~1,5 s:** mover el STT a la nube. No es
  reabrir la decisión de Speaches — es la salida de emergencia si el CPU no da.

**Qué se rompe si se saltea:** todo el pricing y todas las promesas comerciales
quedan apoyados en supuestos. F0 cuesta un día y confirma o mata la hipótesis.

### F1 — Separar llamadas de mensajes sin romper los mensajes

- **F1.a** — Probar la Ruta 1 (segunda app). 30–45 min, reversible, no toca la
  app viva.
- **F1.b** — Solo si F1.a falla: el repartidor de §2, con sus nueve reglas y su
  orden de despliegue.
- **Verificación (la misma antes y después de cada cambio):** mensaje real de
  WhatsApp → llega a Chatwoot → el bot responde en ~7 s. Es el chequeo de "no
  rompimos nada" y se corre siempre, aunque parezca redundante.

**Qué se rompe si se hace al revés:** encender `calls` antes de tener a dónde
mandarlos hace que caigan en Chatwoot, que responde 200 y los descarta. El que
llama escucha silencio, y el diagnóstico equivocado ("no funciona la API")
cuesta días.

### F2 — Encender llamadas en el número real

1. **Gate:** leer `whatsapp_business_manager_messaging_limit` del número. Tiene
   que dar `TIER_2K` o más. Si da menos, F2 se frena acá y el camino es empujar
   la verificación/uso — no hay atajo.
2. `POST /<PHONE_NUMBER_ID>/settings` con `calling.status=ENABLED` (hoy
   `NOT_SET`).
3. **Verificación:** Sergio llama al **+591 75414930** desde otro WhatsApp y la
   IA contesta. Sin esto, F2 no está hecha.

### F3 — El cerebro de voz de verdad

- Variante hablada de los mensajes de `SCRIPT`.
- Guardarraíles con la regla de bufeo (§4.2) y la regla `cifra_en_voz` (§4.3).
- Reserva real en Cal.com por voz.
- Transcripción → **nota privada** en la conversación de WhatsApp que ese
  contacto ya tiene en Chatwoot, para que el humano vea todo junto.
- Aviso a Sergio ante señal de intención alta.
- **Verificación:** una llamada real termina con una reserva real en el
  calendario y una nota en Chatwoot. Las dos cosas, no una.

### F4 — Producto vendible

Precios ratificados, demo grabada, entrada en el catálogo
(`ONIA_CATALOGO_TIPOS_CHATBOT_20260731.md`) como add-on de T2/T3, contrato con
la cláusula de datos de §10.
**Verificación:** un cliente pagando.

### F5 — Salientes (gateado, no ahora)

Método de pago en Meta + rate card de Bolivia confirmado + plantilla
`call_permission_request` aprobada. Recién ahí se puede cotizar el paquete
"Voz Completa".

---

# PARTE B — VENDERLO

## 7. Lo que se promete y lo que no

| Se promete | NO se promete |
|---|---|
| Contesta las **llamadas de WhatsApp** de tu negocio, 24/7 | Contestar el teléfono, el fijo, ni llamadas normales |
| Avisa desde el primer segundo que es un asistente automatizado | Que suene humano o que el cliente no se dé cuenta |
| Resuelve lo básico y **agenda** una reunión con vos | Transferirte la llamada en vivo |
| **Nunca da precios ni promete nada** — está bloqueado por diseño | Que responda cualquier pregunta |
| Te deja la transcripción de cada llamada en la bandeja | Grabar audio sin avisar |
| Si se cae, entra el buzón de WhatsApp y el audio igual se transcribe | Cero caídas |
| Las llamadas que te hacen **no te cuestan por minuto** | Que las salientes sean gratis |

**Sobre la latencia: no prometer ningún número hasta que F0 lo mida.** Hoy no
existe una medición propia. Decir "responde al instante" antes de tenerla es
inventar.

## 8. El costo real por llamada

### Lo verificado (2026-08-07)

- **ElevenLabs Flash v2.5** consume **0,5 créditos por carácter** (la mitad que
  los modelos estándar) y sintetiza con ~75 ms de latencia de modelo.
- Planes leídos en la página de precios: Free $0 / 10.000 créditos · Starter $6 /
  30.000 · **Creator $22 / 121.000** (primer mes $11) · **Pro $99 / 600.000** ·
  Scale $299 / 1.800.000 · Business $990 / 6.000.000.
- **Las llamadas entrantes de WhatsApp no tienen costo por minuto.**
- STT (Speaches) y la infra ya están pagos: costo marginal cero en plata. Lo que
  consumen es CPU, y eso limita concurrencia, no gasto.

### Los supuestos (marcados como tales, se miden en F0)

- **A1** — el español hablado va a ~**900 caracteres por minuto** (≈150
  palabras/min × ~6 caracteres con espacio).
- **A2** — en una llamada el bot habla ~**50%** del tiempo.
- **A3** — llamada típica de **4 minutos**.
- **A4** — **USD 1 = Bs 11,37** (flotación de junio 2026).

### El cálculo

```
créditos por minuto HABLADO   = 900 car × 0,5      =  450
créditos por minuto DE LLAMADA= 450 × 50%          =  225
créditos por llamada de 4 min = 225 × 4            =  900
```

| Plan | USD/crédito | Costo llamada 4 min | Costo por minuto de llamada |
|---|---|---|---|
| Creator ($22 / 121k) | 0,000182 | USD 0,164 = **Bs 1,86** | **Bs 0,47** |
| Pro ($99 / 600k) | 0,000165 | USD 0,149 = **Bs 1,69** | **Bs 0,42** |

Sumar el LLM: gpt-4o-mini con ~15 turnos por llamada da del orden de **USD
0,004** (≈ Bs 0,05), menos del 3% del total. *(Precio del modelo tomado de mi
conocimiento, no verificado hoy; su peso es tan chico que no mueve la
conclusión.)*

> **Costo variable ≈ Bs 1,80 por llamada de 4 minutos ≈ Bs 0,45 por minuto de
> llamada.**

### CORRECCIÓN al documento anterior

La versión del 2026-08-02 decía **"costo propio ~Bs 0,2–0,3/min"**. Ese número
salía de suponer TTS de Azure/OpenAI a ~USD 0,014/min. **Con ElevenLabs Flash el
costo real es Bs ~0,45/min — entre 1,5 y 2,2 veces más.** La línea vieja queda
anulada por ésta.

## 9. ¿Cierran los precios? — SÍ, con dos correcciones

Los precios propuestos en la versión anterior:

| Add-on | Setup | Mensual | Incluye |
|---|---|---|---|
| **Voz Entrante** — contesta las llamadas de WhatsApp | Bs 990 | Bs 490 | 300 min entrantes, transcripción al CRM, buzón |
| **Voz Completa** — contesta + llama a confirmar citas | Bs 1.500 | Bs 790 | 500 min + confirmación de citas + reporte de no-shows |
| Overage | — | Bs 2,5/min | — |

### Margen por cliente: sano

| | Voz Entrante | Voz Completa |
|---|---|---|
| Ingreso mensual | Bs 490 | Bs 790 |
| Costo variable **si usa el 100%** de sus minutos | Bs 135 (300 min) | Bs 225 (500 min) |
| **Margen de contribución** | **Bs 355 — 72%** | **Bs 565 — 71%** |
| Margen a uso realista (~40%) | ~88% | ~89% |

El overage de Bs 2,5/min contra un costo de Bs 0,45 deja **82% de margen** y es
lo que protege del cliente que se pasa. Los minutos incluidos (300/500) están
bien calibrados: por encima de lo que una pyme boliviana va a usar y por debajo
de lo que rompe el plan. **No tocar ninguno de los tres números.**

### CORRECCIÓN 1 — el riesgo no es el margen, es el piso fijo

ElevenLabs es una **suscripción mensual fija**, no pago por uso. Ese piso es lo
que puede hacer perder plata, no el costo por minuto:

| Plan ElevenLabs | Piso mensual | Minutos de llamada que cubre | Clientes de 300 min a tope |
|---|---|---|---|
| Creator $22 | Bs 250 | ~538 | 1,8 |
| Pro $99 | Bs 1.126 | ~2.666 | 8,9 |

Y acá está el valle que hay que evitar:

| Clientes | Plan | Ingreso | Variable | Piso | **Resultado** |
|---|---|---|---|---|---|
| 1 | Creator | 490 | 135 | 250 | **+105** ✔ |
| 2 | Creator | 980 | 270 | 250 | **+460** ✔ |
| 3 | **Pro** | 1.470 | 405 | 1.126 | **−61** ✘ |
| 4 | Pro | 1.960 | 540 | 1.126 | **+294** ✔ |

> **Regla de operación nueva: arrancar en Creator y quedarse ahí hasta ~500
> minutos reales al mes. Migrar a Pro recién con 4 clientes** (o con 3 si el uso
> real está por debajo del 60%, que es lo probable). Saltar a Pro con 2–3
> clientes es la única forma de que este add-on pierda plata.
>
> Bonus: el setup de Bs 990 del primer cliente ya paga casi cuatro meses del
> plan Creator.

### CORRECCIÓN 2 — verificar el límite de llamadas simultáneas del plan

Los planes de ElevenLabs tienen tope de peticiones concurrentes, y no lo
verifiqué. Con 1–2 llamadas a la vez no debería importar (el cuello es el VPS,
no ElevenLabs), pero **hay que leerlo antes de vender el segundo cliente**.

### Coherencia con el catálogo

Contra los paquetes de `ONIA_CATALOGO_TIPOS_CHATBOT_20260731.md` (T1 Bs
1.500/490 · T2 Bs 2.900/890 · T3 Bs 5.900/1.890), el add-on de voz a Bs 490/mes
sobre un T2 es un **+55% sobre el mensual**. Es una proporción sana para un
add-on y no canibaliza los paquetes. Ratificación de precios = bloqueo S1 de
Sergio.

### Regla de moneda

Precio en Bs con **cláusula de ajuste cambiario**: los costos son 100% en USD y
el boliviano flota desde junio 2026. Nunca "precio de por vida".

## 10. A quién le sirve esto en Bolivia

El filtro real no es el rubro: es **si a ese negocio lo llaman por WhatsApp en
vez de escribirle, y si esas llamadas se repiten**. Si el dueño no pierde
llamadas, no hay dolor y no hay venta.

### Encaje fuerte

- **Odontología, estética, veterinaria** — la llamada típica es "¿tenés turno?",
  "¿a qué hora abren?", "¿cuánto sale una limpieza?". Repetitiva y agendable, que
  es exactamente lo que el bot hace. **Es el rubro para liderar** y engancha con
  el pack dental de la plataforma.
- **Inmobiliarias y alquileres** — "¿sigue disponible?" mil veces al día, con un
  vendedor que casi siempre está manejando. Volumen alto y respuesta trivial.
- **Talleres mecánicos y lubricentros** — "¿me pueden atender hoy?", "¿cuánto
  tardan?". Agendan, y el dueño está abajo de un auto sin poder atender.
- **Consultorios y laboratorios** — "¿necesito ayuno?", "¿ya están mis
  resultados?". Ojo: cero consejo clínico, ya bloqueado por la regla
  `consejo_profesional`.

### Encaje débil — decirlo antes de que lo descubra el cliente

- **Ferreterías, importadoras, repuesteras.** La llamada real es "¿tenés este
  repuesto?", y **eso el bot no lo puede contestar sin el stock conectado**.
  Hasta que exista esa integración, en estos rubros la voz solo sirve para
  horario, ubicación y derivar — y hay que venderlo así o el cliente se siente
  estafado en la primera semana.
- **Restaurantes.** Encaje bueno para reservas, pero el ticket no da para el
  mensual.
- **Transporte y encomiendas.** "¿Dónde está mi paquete?" necesita integración;
  sin ella no sirve.

### Regla comercial

**El add-on de voz no es un producto de entrada.** Se vende a quien ya tiene el
chatbot de texto andando y ya vio que le funciona. Vender voz de arranque
significa hacer el setup de dos cosas a la vez y duplicar la superficie de
falla en el peor momento.

## 11. Las objeciones que va a poner un cliente

**"¿Contesta el teléfono de mi negocio?"**
No. Solo la llamada que se hace **dentro de WhatsApp**. Si te marcan al celular
o al fijo como llamada normal, eso no lo toca. Son dos redes distintas.

**"¿Y por qué no el teléfono?"**
Porque en Bolivia esa vía es cara y lenta, y no la vamos a vender mal. Twilio y
Plivo ni siquiera venden números +591. Entel tiene troncal SIP —Bs 200/mes por
16 canales más Bs 250 de instalación— pero se entrega sobre su propia red, así
que haría falta un equipo en tu local. Se puede hacer, se cotiza aparte, y hoy
no es lo que te estoy vendiendo.

**"Se va a notar que es un robot."**
Sí, y lo decimos nosotros en el primer segundo. Es política de Meta y es nuestra.
Lo que estás comprando no es engañar a nadie: es que a las once de la noche
alguien conteste.

**"¿Y si dice una barbaridad o da un precio mal?"**
No puede. No improvisa: habla de un guion escrito, y lo poco que genera con IA
pasa por un filtro que rechaza precios, promesas, porcentajes y cualquier cifra
**antes** de convertirlo en audio. Si el filtro salta, dice "eso te lo confirma
Sergio" y te agenda la reunión. Ese bloqueo protege tu margen tanto como el
nuestro.

**"¿Y si el cliente quiere hablar con una persona?"**
Te la agenda, no te la transfiere. Y si detecta que viene a comprar, te avisa al
toque para que devuelvas la llamada en minutos si querés.

**"¿Grabás mis llamadas?"**
Se transcriben, con aviso al inicio y consentimiento registrado con hora. En
Bolivia el art. 301 del Código Penal castiga grabar sin consentimiento, así que
el aviso no es opcional. El dato es tuyo: vos sos el responsable y Onia el
encargado del tratamiento. Va escrito en el contrato.

**"¿Cuánto me cuesta cada llamada?"**
Las que te hacen a vos, nada — WhatsApp no cobra por minuto las llamadas que
inicia el cliente. Vos pagás el mensual con sus minutos incluidos. Las que el
sistema hace saliendo (confirmar citas) se cobran aparte y hoy todavía no están
habilitadas.

**"Ya tengo recepcionista."**
Perfecto, esto no la reemplaza. Es para las seis de la tarde a las ocho de la
mañana, los sábados y los feriados.

**"¿Funciona si se me cae el internet del local?"**
Sí. Corre en nuestro servidor, no en tu local.

**"¿Cuánto tarda en contestarme?"**
*(No responder con un número hasta que F0 lo mida. Hasta entonces: "te lo
muestro en la demo con una llamada real".)*

---

## 12. Telefonía real en Bolivia — por qué WhatsApp es el foso

> Research 2026-08-03 con fuentes oficiales (Entel, Tigo, ATT, Código Penal).
> Pregunta: ¿podemos vender un asistente que conteste el TELÉFONO del negocio?

| Vía | Estado real |
|---|---|
| Número +591 de Twilio / Plivo | **No existe.** Bolivia no está en su cobertura |
| DID +591-5 de Zadarma / Telnyx / DIDWW | Se vende (Zadarma ~USD 57/mes, 2 canales). **RIESGO ABIERTO:** el rango +591-5 es "nacional no geográfico" — falta verificar que un celular Entel/Tigo lo marque y **a qué tarifa le cobra al que llama**. Si le sale caro al cliente final, el producto muere |
| Troncal SIP Entel | **Existe con precio público:** Bs 200/mes (16 canales) + Bs 250 de instalación. **Pero se entrega sobre VPN/Metro Ethernet de Entel** → nuestro VPS de afuera probablemente no puede registrarse directo; haría falta un FreePBX **en el local del cliente**. Más tasa mínima de consumo (Bs 700–1.500) |
| Troncal SIP Tigo | Existe (fibra propia), precio no público. Pide NIT, CI del representante legal y poder |
| Desvío de llamadas | Funciona, **pero el negocio paga cada llamada desviada como si él la hiciera**. A número boliviano viable; a internacional inviable |
| Portabilidad a un SIP extranjero | **Imposible.** Solo entre operadores bolivianos licenciados |

**Regulación (ATT):** no hay norma que prohíba VoIP ni licencia específica para
un proveedor de software. La regla de oro que nos mantiene fuera del perímetro
regulado: **la troncal y el número SIEMPRE a nombre del cliente, con su NIT;
Onia nunca revende minutos.** Lo que la ATT persigue es el *bypass* de tráfico
internacional — nada que ver con lo nuestro, pero la línea no se cruza jamás.

**Grabación — hay riesgo penal real.** Bolivia no tiene ley de protección de
datos vigente (el anteproyecto de AGETIC sigue en la Asamblea), pero el **art.
301 del Código Penal** castiga con 3 meses a 1 año grabar palabras de otro sin
consentimiento si puede causar daño. Obligatorio en el producto: locución de
aviso al inicio, consentimiento con timestamp, y contrato donde **el negocio es
responsable del dato y Onia es encargado del tratamiento**. Diseñar con estándar
tipo GDPR desde ahora: el anteproyecto ya alcanza a servidores fuera del país.

### Conclusión estratégica

**La API de llamadas de WhatsApp no es el plan B de la telefonía: es la
ventaja.** Recibir es gratis, no necesita número, ni troncal, ni cajita, ni
permiso de la ATT; Bolivia está soportada, y es el **mismo número que ya atiende
el chat**. Los competidores internacionales (Vapi, Retell, Smith.ai) no pueden
entrar a Bolivia sin resolver la telefonía local. Nosotros la salteamos entera.

**Dos escalones:**
- **Escalón 1 (lo que vendemos):** voz sobre WhatsApp. Cero infraestructura,
  cero trámite, margen alto.
- **Escalón 2 (ticket alto, más adelante):** el teléfono real, vía troncal
  Entel/Tigo **a nombre del cliente** + FreePBX en su local. Negocio de
  instalación por cliente, se cotiza aparte, y solo cuando haya demanda que lo
  justifique.

**Hueco de mercado:** los integradores bolivianos venden PBX (hardware +
instalación). **Nadie vende asistente de voz gestionado.**

**Validaciones pendientes antes de prometer el escalón 2:** (a) probar con un
DID de USD 57 si el +591-5 se marca y factura como nacional desde Entel y Tigo;
(b) preguntar a Entel Empresas si la troncal admite registro SIP por internet;
(c) consulta escrita a la ATT.

## 13. Comprar vs construir — DECIDIDO: construir

Research 2026-08-03. **Ninguna plataforma sirve**, y la razón es siempre la
misma: o no soportan las llamadas de WhatsApp, o no dejan traer nuestro número.

| Plataforma | ¿Llamadas de WhatsApp? | ¿Nuestro número? | Veredicto |
|---|---|---|---|
| **Vapi** | **NO** — cero páginas en sus docs | — | descartada |
| **Retell AI** | **NO** | — | descartada |
| **Twilio** | Beta privada solo BR, MX, IN, ID | — | **Bolivia queda fuera** |
| **Synthflow** | Sí, entrantes | **NO** — exige número comprado a ellos | descartada |
| **respond.io** | Sí | Sí (es BSP) | pero **reemplaza a Chatwoot**; USD 159/mes |
| **ElevenLabs Agents** | Sí, nativo | **Parcial** — toma control de la cuenta | USD 0,08/min de plataforma **encima** del LLM y la telefonía, y perdemos el número |
| **Pipecat (construir)** | **Sí, transporte oficial** | **Sí, total** | **ELEGIDA** |

> **Ojo con la distinción de ElevenLabs.** Usamos ElevenLabs **como motor de voz
> (API de TTS)**, no como plataforma de agentes. Es la diferencia entre pagar
> ~USD 0,04/min de síntesis y pagar USD 0,08/min de plataforma *más* todo lo
> demás, cediendo el control del número. Si alguien propone "pasarse a ElevenLabs
> Agents porque ya les pagamos", ésta es la respuesta.

**El canal de voz de Chatwoot — la trampa que casi compramos.** Existe y soporta
llamadas de WhatsApp sobre un inbox de Cloud API. Pero: (a) exige v4.15.0+ y
corremos **v4.12.0**; (b) es de pago (USD 19/agente/mes anual); y sobre todo
(c) **no es una capa de IA: es un softphone para humanos.** El flujo documentado
es "entra la llamada → notificación → la contesta una PERSONA"; la IA solo
transcribe después. Pagarlo nos daría un teléfono con historial y seguiríamos
teniendo que construir el agente igual. **No se compra.**

**Matemática de la decisión:** Pipecat es BSD, corre en el VPS que ya pagamos, y
su costo por minuto es solo STT + LLM + TTS, sin fee de plataforma y sin
telefonía porque las entrantes son gratis. La única fricción real es que Pipecat
es Python: un segundo runtime junto al bot de Node.

---

## 14. Qué está verificado y qué no

| Afirmación | Estado |
|---|---|
| Flash v2.5 = 0,5 créditos/carácter; ~75 ms de latencia de modelo | ✔ **verificado 2026-08-07** (docs + página de precios de ElevenLabs) |
| Planes y créditos de ElevenLabs (Creator $22/121k, Pro $99/600k, …) | ✔ **verificado 2026-08-07** |
| El campo de webhook para llamadas se llama `calls` | ✔ **verificado 2026-08-07** (docs de Meta) |
| Se exige límite diario de ≥2.000 destinatarios únicos para habilitar llamadas | ✔ **verificado 2026-08-07** (docs de Meta) |
| Los números de prueba y sandbox están exentos de ese requisito | ✔ **verificado 2026-08-07** |
| Tiers: 250 / 2.000 / 10.000 / 100.000 / Unlimited; campo `whatsapp_business_manager_messaging_limit` | ✔ **verificado 2026-08-07** |
| La verificación de negocio es el camino rápido al tier de 2.000 | ✔ verificado (fuente secundaria + docs de Meta) |
| `calls` **sí** está en la lista de campos con override de callback, a nivel WABA y de número | ✔ **verificado 2026-08-07** (docs de Meta) |
| El override es **una URL**, no una URL por campo → no separa mensajes de llamadas | ✔ deducido de la doc oficial del override |
| Pipecat tiene `WhatsAppTransport` oficial; maneja `pre_accept`/`accept`; requiere `pipecat-ai[webrtc]` y 3 variables | ✔ **verificado 2026-08-07** (docs de Pipecat) |
| Ventana para contestar: 30–60 s desde el webhook de conexión | ⚠️ **verificado en fuentes secundarias**, no en la página oficial de Meta. Diseñar para 30 s |
| `POST /<PHONE_NUMBER_ID>/settings` con `calling.status=ENABLED`; hoy `NOT_SET` | ⚠️ verificado por la sesión de control el 2026-08-07; la página general de calling de Meta no lo documenta |
| Las entrantes no tienen costo por minuto | ⚠️ la doc de Meta dice "gratis para tus clientes y disponible globalmente" — falta confirmar en el rate card logueado que tampoco le cobran al negocio |
| **Varias apps sobre una WABA con campos distintos separan las entregas** (Ruta 1) | ❌ **HIPÓTESIS.** Confirmado que varias apps pueden suscribirse y que cada una tiene su ciclo de entrega; NO confirmado en doc oficial que la separación por campo salga limpia. **Es lo primero que hay que probar en F1.a** |
| Tarifa por minuto de las salientes en Bolivia | ❌ **sin verificar.** Está en el rate card logueado de Meta. No cotizar F5 sin esto |
| Tier actual del número +591 75414930 | ❌ **sin leer.** Es el gate de F2 |
| Límite de peticiones concurrentes de los planes de ElevenLabs | ❌ **sin verificar.** Leerlo antes del segundo cliente |
| Precio por token de gpt-4o-mini | ⚠️ de mi conocimiento, sin verificar hoy. Pesa <3% del costo |
| A1 (900 car/min hablado), A2 (50% de habla), A3 (llamada de 4 min) | ❌ **supuestos míos.** Se miden en F0 y recalculan §8–§9 |
| Latencia voz-a-voz con Whisper en CPU en nuestro VPS | ❌ **sin medir.** Es EL número que decide si esto se vende |
| Concurrencia real del VPS con la voz en la nube | ❌ **sin medir.** La estimación vieja de 2–3 llamadas asumía TTS local |
| VPS: 4 núcleos, sin GPU, ~9 GB libres, carga 2.18 | ✔ verificado por la sesión de control el 2026-08-07 |
| Qwen3-TTS: ~30 s para 3 s de audio en CPU; ~4,2 GB VRAM; GPU ~USD 0,53/h | ✔ verificado por la sesión de control el 2026-08-07 |

---

## 15. Gates y pendientes

1. **F0 puede arrancar YA.** Número de test gratis de Meta, exento del tier, sin
   tocar producción y sin permisos nuevos. Es el paso más barato y el que
   confirma o mata la hipótesis en un día.
2. **ElevenLabs**: gasto aprobado por Sergio el 2026-08-07. Arrancar en el plan
   **Creator**, no en Pro (ver §9).
3. **Rate card de Bolivia** (precio/min saliente) → confirmar logueado en Meta
   antes de cotizar "Voz Completa".
4. **Precios del add-on**: ratifica Sergio (bloqueo S1). La recomendación es
   dejarlos como están y adoptar la regla de plan de §9.
5. **Método de pago en Meta**: destraba plantillas y salientes. Sin él, las
   entrantes funcionan igual.
6. Al validar el producto: agregar "Onia Voz" a
   `ONIA_CATALOGO_TIPOS_CHATBOT_20260731.md` como add-on de T2/T3.
7. **Multi-cliente**: cada cliente necesita `calling.status=ENABLED` en SU
   número y su propio tier de 2.000. Eso es un gate por cliente, no una vez.
   Cruzarlo con `ONIA_MODELO_MULTICLIENTE_CHATBOT_20260802.md` cuando toque.

---

Relacionados: `ONIA_BOT_MANUAL_OPERACION_20260807.md` (cómo opera el bot de
texto hoy) · `historial/ONIA_BOT_GOLIVE_RUNBOOK_20260801.md` (identificadores reales de
Meta y las trampas del alta) · `ONIA_CATALOGO_TIPOS_CHATBOT_20260731.md`
(paquetes) · `ONIA_MODELO_MULTICLIENTE_CHATBOT_20260802.md`.

Fuentes web consultadas el 2026-08-07:
[Meta — WhatsApp Calling](https://developers.facebook.com/docs/whatsapp/cloud-api/calling) ·
[Meta — Messaging limits](https://developers.facebook.com/docs/whatsapp/messaging-limits/) ·
[Meta — Webhook overrides](https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/override/) ·
[Pipecat — WhatsAppTransport](https://docs.pipecat.ai/server/services/transport/whatsapp) ·
[ElevenLabs — Pricing](https://elevenlabs.io/pricing) ·
[ElevenLabs — Modelos](https://help.elevenlabs.io/hc/en-us/articles/17883183930129-What-models-do-you-offer-and-what-is-the-difference-between-them)

---

## 15. BLOQUEO DURO VERIFICADO (2026-08-07): el número no llega al tier

Medido en la Graph API con el token de producción, no supuesto:

```
messaging_limit_tier   TIER_250      ← se necesita 2000
quality_rating         GREEN
status                 CONNECTED
WABA                   APPROVED · business_verification_status: verified
calling.status         NOT_SET
```

Documentación oficial de Meta (*Configure Call Settings*, actualizado 26-jun-2026),
textual:

> "Calling is not enabled by default on a business phone number. **To enable
> calling, you must have a messaging limit of 2000 or above.**"

Y el error que devolvería el intento:

> `138015 · Calling cannot be enabled` — "Check and make sure messaging limit on
> your phone number is 2000 or more"

**Consecuencia:** encender llamadas en +591 75414930 es imposible hoy, y no por
falta de código. No hay atajo técnico: el tier no se pide, se gana.

### Cómo se sube de TIER_250 a TIER_2K

El tier escala con el **volumen de conversaciones iniciadas por el negocio** a
usuarios únicos, sostenido y con calidad alta. Para iniciar conversaciones hacen
falta **plantillas aprobadas**, y para enviar plantillas hace falta **método de
pago** en la cuenta.

O sea que la cadena real es:

```
método de pago → plantillas aprobadas → volumen real de mensajes salientes
→ el tier sube a 2000 → recién ahí se puede encender llamadas
```

**Esto no es un problema de ingeniería: es de etapa del negocio.** Con cero
clientes no hay a quién iniciarle conversaciones, así que el tier no sube. Se
resuelve solo cuando haya clientes de verdad.

### Qué SÍ se puede hacer mientras tanto

- **Construir y probar la fase F0 con el número de prueba** de la WABA de test
  (+1 555-649-7880). *Hipótesis a verificar antes de invertir tiempo: que el
  número de prueba esté exento del requisito de tier. No está confirmado.*
- Dejar el motor de voz listo y probado, para encenderlo el día que el tier suba.
- **NO encender `calling` en el número real** aunque algún día pase el tier, hasta
  que haya algo que conteste: el botón de llamar aparecería y cada persona que lo
  toque escucharía el vacío.

### Confirmación colateral del diseño del repartidor

El error `138018` de la misma documentación dice, textual, que hace falta
*"at least one app subscribed to the WhatsApp Business account that also has
subscription to the calls webhook field"*. Eso **confirma la Ruta 1** de §
anterior: una app aparte suscrita solo a `calls` es un camino soportado por
Meta, y no obliga a tocar la app que hoy atiende los mensajes.

### 15.bis HIPÓTESIS CONFIRMADA (2026-08-07): el número de prueba SÍ está exento

Se probó de verdad, no se dedujo. `POST /1122144677655183/settings` con
`{"calling":{"status":"ENABLED"}}` sobre el número de prueba **+1 555-649-7880**,
que está en `TIER_250` igual que el de producción:

```
respuesta      HTTP 200 · {"success":true}
verificación   GET /settings → calling.status = "ENABLED"
```

**El requisito de messaging limit ≥ 2000 NO aplica a los números de prueba.**
Meta lo acepta con el mismo tier con el que rechaza al número real.

Estado de los dos números tras la prueba:

| Número | ID | Tier | `calling.status` |
|---|---|---|---|
| **+1 555-649-7880** (prueba) | `1122144677655183` | TIER_250 | **ENABLED** |
| +591 75414930 (producción) | `1283320641524523` | TIER_250 | `NOT_SET` — a propósito |

**El producción se deja intacto**: aunque algún día pase el tier, no se enciende
hasta que exista un motor que conteste. El botón de llamar visible sin nadie del
otro lado es peor que no tenerlo.

**Consecuencia para el plan:** F0 es viable YA. Se puede construir y medir el
motor de voz completo contra el número de prueba, sin depender del tier ni tocar
producción. Lo que queda gateado por el tier es únicamente el paso final de
encenderlo en el número real.

### 15.ter MEDICIÓN REAL (2026-08-07): el VPS NO puede correr voz en tiempo real

Se midió en el VPS de producción, con lo que ya está instalado. Frase en español
de ~7 segundos, dicha como la diría un prospecto real.

| Etapa | Motor | Tiempo | Factor vs tiempo real |
|---|---|---|---|
| Síntesis | Piper `es_ES-davefx-medium` (open source, CPU) | **8.141 ms** para 7 s | **1,16x — más lento** |
| Transcripción (frío) | `faster-whisper-small` | 34.863 ms | 5x — carga del modelo |
| Transcripción (caliente) | `faster-whisper-small` | **9.399 ms** para 7 s | **1,34x — más lento** |

Calidad de transcripción: **correcta** ("Somos 5 personas", "Santa Cruz",
signos de interrogación bien puestos). El problema no es la calidad.

**Un turno de conversación quedaría así:**

```
habla 5 s → transcribir 6,7 s → pensar ~1,5 s → sintetizar 4,6 s
≈ 13 segundos de silencio antes de la primera palabra del bot
```

Una llamada telefónica se abandona a los 3-4 segundos de silencio. **No es
lento: es inutilizable.**

#### Las tres consecuencias

1. **Whisper en este CPU no sirve para llamadas.** Confirmado con números, ya no
   es hipótesis.
2. **Piper tampoco.** Era la salida open source gratuita y también está por
   encima del tiempo real. La opción "todo local y gratis" queda descartada
   por medición, no por opinión.
3. **Si voz sale del VPS, salen LAS DOS PATAS**, no solo la síntesis. El costo
   por llamada calculado en §4 asumía transcripción local gratis: **ese número
   queda corto y hay que rehacerlo** antes de vender el add-on.

#### Lo que esto NO rompe

Los **audios de WhatsApp** (notas de voz) siguen funcionando igual: transcribir
una nota en 9 segundos es perfectamente aceptable porque no es tiempo real.
La medición no toca nada de lo que hoy está en producción.

#### Recomendación

**Parquear el desarrollo de voz.** Dos bloqueos independientes, y ninguno se
resuelve programando:

- El número real no llega al tier (§15) — se destraba con clientes, no con código.
- El VPS no puede correr el bucle — se destraba con GPU (~$380/mes) o con
  servicios hospedados para STT **y** TTS, que encarecen cada llamada.

Con cero clientes pagando, gastar días de desarrollo y sumar costo mensual fijo
en una función que **no se puede encender en producción** es exactamente el
patrón que este repo viene combatiendo: construir algo que queda apagado.

Se retoma cuando haya clientes: ahí sube el tier, hay ingreso que paga los
servicios hospedados, y el add-on de voz tiene a quién vendérsele.

**Lo que sí queda listo:** el número de prueba con `calling: ENABLED` (§15.bis),
la arquitectura del repartidor validada por el error 138018, y el pricing
armado. El día que se retome, se arranca desde acá y no desde cero.
