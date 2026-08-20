# Agentes de llamadas (voz) — ¿Onia puede venderlos en Bolivia?

Investigación de escritorio · 2026-08-15 · TC **11,66 Bs/USD** (BCB 13-ago-2026)

Todas las páginas se consultaron el 2026-08-15. Cada cifra lleva su fuente. Lo que quedó
sin confirmar está al final bajo **NO VERIFICADO**, listado y sin adornos. No hay ninguna
cifra reconstruida de memoria.

---

## 1. VEREDICTO

**SÍ. Onia puede vender un agente de llamadas en Bolivia hoy.**

Y hay **dos** caminos verificados, no uno. El primero es mucho mejor que el segundo:

| Camino | Veredicto | Costo de transporte por minuto |
|---|---|---|
| **A. Voz por WhatsApp** (Business Calling API) | **SÍ, hoy** | Entrante **Bs 0** · Saliente **Bs 0,135** |
| **B. Voz por teléfono con número boliviano** (Entel VOZip + SIP) | **SÍ, pero con riesgo** | Bs 0,63–0,90/min según destino |
| ~~C. Número boliviano comprado a Twilio~~ | **NO** | Twilio solo vende toll-free +591800 |

**El producto es A.** WhatsApp Calling no toca la red telefónica: no hay DID, no hay troncal
con Entel, no hay portabilidad, no hay tarifa de terminación a móvil. El audio va por
internet dentro de WhatsApp. Eso elimina de un saque todo el problema que hacía inviable
este producto en Bolivia.

Las cuatro razones por las que el veredicto es SÍ:

1. **Bolivia NO está excluida.** Meta excluye de las llamadas salientes solo a EE.UU.,
   Canadá, Egipto, Vietnam y Nigeria. Bolivia no figura. Las entrantes están en todos lados.
2. **El precio es ridículo.** Entrante **gratis**. Saliente **USD 0,0116/min**. Una llamada
   saliente de 2 minutos cuesta **Bs 0,27** de transporte. Por teléfono con Twilio esa misma
   llamada a un celular boliviano cuesta **Bs 9,65** — **36 veces más**.
3. **Se le enchufa cualquier motor por SIP.** Meta soporta SIP sobre TLS, medios
   WebRTC/SRTP, códecs OPUS y G.711, y publicó guía oficial de Asterisk. Sin lock-in.
4. **Onia ya tiene medio camino andado**: número propio en Cloud API con calidad GREEN y
   trámite de Tech Provider en curso.

### Los tres frenos que hay que decir en voz alta

- **El portero es Business Verification, no la plata.** La Calling API exige que el número
  tenga límite de 2.000 destinatarios únicos diarios, y el atajo para llegar ahí es
  verificar el negocio ante Meta (§3.4). Sin eso no se activa.
- **Prospección en frío por voz: imposible por diseño.** El usuario tiene que dar permiso;
  el límite es 1 solicitud por día y 2 por semana por persona, y a las 4 llamadas sin
  responder Meta revoca el permiso solo (§3.5). Esto sirve para clientes **que ya son
  clientes**: recordar la cita, confirmar el pedido, cobrar. No para conseguir clientes.
- **🔴 Grabar sin consentimiento es delito penal en Bolivia** (Código Penal art. 301, 3 meses
  a 1 año). Un agente de voz graba por diseño, porque transcribe. El aviso de grabación al
  inicio de cada llamada no es cortesía, es la diferencia entre operar y un tipo penal
  (§7.2). **Esto aplica a los dos caminos, A y B.**

### Lo que la evidencia NO respalda (y hay que decírselo al cliente)

- **La llamada automática rinde peor que la humana.** La mejor evidencia independiente
  —vieja pero no refutada— da 17,3% de ausencias con llamada automática contra 13,6% con
  personal humano. **Ningún estudio ha probado un agente de IA moderno contra esa base**
  (§9.1). Vender esto como "mejor que tu recepcionista" es mentira; es "mejor que nadie",
  que es lo que hay hoy a las 8 de la noche.
- **El 80,1% de los consumidores prefiere un humano aun cuando se le asegura que la IA le
  resolvería el problema** (§9.4). Este producto pelea contra eso.
- **🟢 Con una excepción, y es justo la nuestra: el 46,9% acepta la IA para agendar y
  reagendar.** Es la única tarea que los consumidores toleran. Por eso el caso de arranque
  es agendamiento y no atención general.
- **Ninguna plataforma cumple su latencia declarada.** Lo medido es 1.296-1.740 ms contra
  600-800 ms prometidos, y el umbral donde la conversación se rompe es ~1.500 ms (§9.9).
  Nunca prometer "respuesta instantánea".
- **Las cifras que circulan del mercado son casi todas falsas.** Hay una lista de
  estadísticas fantasma en §9.10 — incluido el famoso "50,7% de reducción de no-show", que
  es un modelo de riesgo con **humanos** llamando, no un agente de voz. Ninguna de esas
  entra en una propuesta.

### Caso de arranque recomendado

**Recepcionista de voz ENTRANTE por WhatsApp para la clínica dental, enfocado en agendar.**
Transporte cero, sin permisos que pedir, sin límite de 100 llamadas/24 h, sin riesgo de que
la ATT corte una línea por denuncias, y es la única tarea con aceptación de consumidor
demostrada. Resuelve un dolor real: el teléfono que nadie contesta. El outbound (recordar
citas) se agrega después sobre la misma infraestructura. Ruta completa en §6.

**Dos ventajas del camino A que no son obvias y que valen más que el precio:**
1. Una llamada de WhatsApp **no entra como número desconocido**: entra con nombre y foto del
   negocio verificados por Meta. En un mercado donde el 71-88% de las llamadas desconocidas
   son spam, esa es la diferencia entre que atiendan y que no (§9.8).
2. WhatsApp usa **OPUS (banda ancha)**, no telefonía a 8 kHz. La banda angosta cuesta 8-12
   puntos de WER. *(Razonamiento propio, sin medición — pero es la hipótesis más barata de
   probar y la más rentable si se confirma, §9.7.)*

**El riesgo operativo #1 a mitigar desde el día uno:** el paciente mayor es el que más llama
a una clínica y **es al que el agente corta 2,5 veces más** por endpointing (19,7% vs 8,0%,
§9.6). Subir el umbral de silencio y probar con adultos mayores antes que con nadie.

---

## 2. Por qué WhatsApp saltea toda la telefonía

La pregunta original —"¿se puede tener un número boliviano para un agente de IA?"— era la
que decidía si el producto existía. WhatsApp Calling **cambia la pregunta**:

- No se necesita número telefónico boliviano. El número de WhatsApp comercial ya existe.
- No aplica la tarifa de terminación a móvil, que es donde se muere la unit economics de un
  agente de voz en LatAm (Bs 4,83/min vía Twilio).
- No hay caller ID dudoso ni número extranjero: al cliente le entra una llamada de WhatsApp
  del negocio, con nombre y foto verificados por Meta.
- El cliente no paga nada. Literal de Meta: *"Gratis y de acceso global para los clientes."*

Comparación de transporte, mismo minuto de voz, mismo cliente en Santa Cruz:

| Vía | Bs/min a móvil boliviano | Múltiplo |
|---|---|---|
| **WhatsApp saliente** | **0,1353** | 1x |
| Entel VOZip → móvil (tramo SMALL, horario normal) | 0,90 | 6,7x |
| Twilio → móvil boliviano | 4,83 | 36x |
| **WhatsApp entrante** | **0,00** | — |

Fuentes en §3.2, §4.1 y §5.1.

---

## 3. WhatsApp Business Calling API — verificado en fuente primaria

Nota de método: `developers.facebook.com` está bloqueado a fetch directo desde este entorno.
Todo lo de esta sección se leyó con navegador sobre la documentación oficial, y **las tarifas
salen de los CSV oficiales de Meta**, descargados de su CDN — no de blogs de terceros.

### 3.1 Disponibilidad en Bolivia

| Tipo de llamada | ¿Bolivia? | Literal |
|---|---|---|
| Iniciada por el USUARIO (entrante) | **SÍ** | *"disponibles en todas las ubicaciones en las que está disponible la API de la nube"* |
| Iniciada por la EMPRESA (saliente) | **SÍ** | excluidos solo EE.UU., Canadá, Egipto, Vietnam, Nigeria |

Meta aclara: *"El código de país del número de teléfono del negocio debe estar en esta lista
de países admitidos. El número de teléfono del consumidor puede ser de cualquier país donde
la API de la nube esté disponible."* → un número +591 califica como número comercial.

Fuente: [Llamadas a la API de la nube](https://developers.facebook.com/documentation/business-messaging/whatsapp/calling) — Updated 26-jun-2026

### 3.2 Precio de llamadas — Bolivia = "Resto de Latinoamérica"

Mapeo confirmado en la tabla oficial de códigos de país de Meta, que lista literalmente:
*"Resto de Latinoamérica → Bolivia (591), Costa Rica, República Dominicana, Ecuador,
El Salvador, Guatemala, Haití, Honduras, Jamaica, Nicaragua, Panamá, Paraguay, Puerto Rico,
Uruguay, Venezuela"*.

Rate card USD oficial, efectivo **1-jul-2026**:

| Minutos/mes | Tipo | USD/min | Bs/min |
|---|---|---|---|
| 0 – 50.000 | List rate | **0,0116** | **0,1353** |
| 50.001 – 250.000 | Tier | 0,0095 | 0,1108 |
| 250.001 – 1.000.000 | Tier | 0,0082 | 0,0956 |
| 1.000.001 – 2.500.000 | Tier | 0,0070 | 0,0816 |
| 2.500.001 – 5.000.000 | Tier | 0,0048 | 0,0560 |
| 5.000.001+ | Tier | 0,0047 | 0,0548 |

Reglas de facturación:
- **Llamadas iniciadas por el usuario: GRATIS.** Literal: *"Todas las llamadas iniciadas por
  el usuario son gratuitas."* Sin importar la duración.
- Se cobra en **pulsos de 6 segundos**; el pulso fraccionado cuenta completo. Ejemplo del
  propio Meta: una llamada de 56 s = 9,33 pulsos → se cobran 10.
- El precio depende del código de país del número **al que se llama**.
- **Grabación y transcripción: gratis hoy.** Meta anuncia precio futuro sin fecha, con aviso
  previo.

Fuente: [Precios de la API de llamadas](https://developers.facebook.com/documentation/business-messaging/whatsapp/calling/pricing) — Updated 9-jul-2026, rate card efectiva 1-jul-2026

### 3.3 Precio de mensajes (el pedido de permiso se cobra como mensaje)

Fila "Rest of Latin America", rate card USD efectivo 1-jul-2026:

| Categoría | USD/msg | Bs/msg |
|---|---|---|
| Marketing | 0,0740 | 0,8628 |
| **Utility (utilidad)** | **0,0113** | **0,1318** |
| Authentication | 0,0113 | 0,1318 |
| Service | n/a (gratis) | 0 |

Fuente: CSV oficial de [Precios de WhatsApp Business](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing)

### 3.4 El portero real: Business Verification

Prerrequisitos de la Calling API:
- Número en **Cloud API** (no la app WhatsApp Business).
- App suscrita al webhook `calls` (salvo que se use SIP).
- Permiso `whatsapp_business_messaging` sobre el número.
- **Límite de mensajes diario de al menos 2.000 destinatarios únicos.**
- Activar las funciones de llamada en el número.

Los portfolios nuevos arrancan en 250. Se sube a 2.000 completando **UNO** de estos
recorridos de aumento:

1. **Verificar tu negocio** (Business Verification), o
2. que tu socio verifique la empresa, o
3. enviar y entregar 2.000 mensajes fuera de la ventana de servicio a usuarios únicos en
   30 días con plantillas de calidad alta.

De ahí sube solo: 10.000 → 100.000 → ilimitado.

Fuente: [Límites de mensajes](https://developers.facebook.com/documentation/business-messaging/whatsapp/messaging-limits) — Updated 21-may-2026

**Traducción: el portero no es volumen, es un trámite.** No hay que mandar 2.000 mensajes si
el negocio está verificado.

**Carril de piloto sin portero:** los números de prueba públicos (PTN) y las cuentas sandbox
**no requieren** el límite de 2.000. Las sandbox son solo para Tech Providers — justo lo que
Onia está tramitando.

### 3.5 Permisos: por qué esto no sirve para vender en frío

- La empresa **no puede llamar sin permiso**. Solo el usuario lo otorga o revoca. La empresa
  no controla ese permiso.
- Permiso **temporal = 7 días calendario (168 h)**. Permanente = no caduca.
- Se consigue de tres formas: (a) mensaje o plantilla de solicitud; (b) **el usuario llama a
  la empresa → otorga permiso temporal automáticamente** (hay que activar devolución de
  llamada); (c) el usuario lo da desde el perfil de empresa.
- Producción: **1 solicitud de permiso por día y 2 por semana** por par empresa+usuario.
  (Sandbox: 25/día, 100/semana.)
- Máximo **100 llamadas conectadas cada 24 h** por número comercial.
- **2 llamadas consecutivas sin respuesta** → mensaje del sistema para reconsiderar.
  **4 consecutivas sin respuesta → permiso revocado automáticamente.**
- Restricciones activas por bajo índice de respuesta (5-sep-2025) y por comentarios de
  usuarios (27-ene-2026).

Fuentes: [Calling](https://developers.facebook.com/documentation/business-messaging/whatsapp/calling) · [Permisos de llamada de usuario](https://developers.facebook.com/documentation/business-messaging/whatsapp/calling/user-call-permissions)

**Detalle que vale plata: la opción (b) es la buena.** Si el paciente llama a la clínica, la
clínica queda habilitada a devolverle la llamada por 7 días sin gastar una plantilla. El
inbound genera el derecho al outbound gratis.

### 3.6 Cómo se enchufa el agente de IA

| | Default al habilitar | SIP con WebRTC | SIP con medios SDES |
|---|---|---|---|
| Señalización | API Graph + Webhooks | SIP (activación explícita) | SIP (activación explícita) |
| Transporte | HTTPS | TLS | TLS |
| Medios | WebRTC (ICE+DTLS+SRTP) | WebRTC (ICE+DTLS+SRTP) | SDES SRTP |
| Códec | OPUS | OPUS | OPUS |

- Códecs adicionales: **PCMA y PCMU (G.711)**, agregados 23-mar-2026.
- SIP exige: app en modo **"Activo"** (no Desarrollo) y **un servidor SIP de terceros**.
- Meta publicó **guía oficial de integración con Asterisk** el 29-sep-2025.

Fuentes: [Calling](https://developers.facebook.com/documentation/business-messaging/whatsapp/calling) · [Guía de configuración de SIP](https://developers.facebook.com/documentation/business-messaging/whatsapp/calling/sip)

**Implicancia:** sirve cualquier motor que hable SIP — Vapi, Retell, ElevenLabs, Pipecat,
LiveKit, o un Asterisk propio en el VPS que Onia ya opera. Sin dependencia de un proveedor
único, así que nadie puede matar el producto subiendo su precio.

### 3.7 Bonus: la llamada abre ventana de 24 h

Una llamada abre o renueva la ventana de atención al cliente de 24 h: cuando el usuario
llama (la aceptes o no) y cuando acepta tu llamada. **Una llamada habilita 24 h de
mensajería sin costo de plantilla.**

### 3.8 Contraste: ir por Twilio como BSP es peor

Twilio exige más que Meta directo: *"at least 2,000 business-initiated conversations in a
rolling 24-hour period"* más Business Verification, y sin eso *"you will not be able to save
the Voice Endpoint Configuration"*. No publica precio por minuto.

Fuente: [WhatsApp Business Calling — Twilio](https://www.twilio.com/docs/voice/whatsapp-business-calling) — Last modified 24-jul-2026

→ **Ir directo a Meta Cloud API**, que es donde Onia ya está. Meter un BSP agrega requisito y margen.

---

## 4. Costo real por llamada de 2 minutos

TC 11,66 Bs/USD. **Las sumas son cuenta propia; los precios unitarios son de fuente.**

### 4.1 Transporte (precio verificado)

| Escenario | Cuenta | USD | Bs |
|---|---|---|---|
| **WhatsApp entrante** | usuario inicia = gratis | **0,0000** | **0,00** |
| **WhatsApp saliente, permiso ya dado** | 2,00 × 0,0116 | **0,0232** | **0,27** |
| WhatsApp saliente + plantilla de permiso | 0,0232 + 0,0113 | 0,0345 | 0,40 |
| Telefonía: Twilio → móvil boliviano | 2,00 × 0,4140 | 0,8280 | 9,65 |
| Telefonía: Twilio → fijo boliviano | 2,00 × 0,3025 | 0,6050 | 7,05 |
| Telefonía: Entel VOZip → móvil (SMALL, normal) | 2,00 × Bs 0,90 | — | 1,80 |

### 4.2 Motor de IA (precio verificado; el ensamblado es cuenta propia)

| Stack | USD/min | 2 min USD | 2 min Bs | Qué incluye |
|---|---|---|---|---|
| Pipecat Cloud + Gemini Live | ~0,0215 | ~0,043 | ~0,50 | orquestación $0,01 + audio in $0,005 + audio out $0,018 (1 min c/u) |
| Vapi (BYOK) | 0,05 + modelos a costo | ≥0,10 | ≥1,17 | solo plataforma; LLM/STT/TTS "at cost" |
| ElevenLabs Agents | 0,080 + LLM aparte | ≥0,160 | ≥1,87 | TTS+STT+KB+RAG; LLM "at cost" |
| Retell (rango oficial) | 0,07 – 0,31 | 0,14 – 0,62 | 1,63 – 7,23 | infra $0,055 + TTS $0,015 + LLM $0,045–0,16 |
| Telnyx Voice AI | 0,056 | 0,112 | 1,31 | STT+TTS+orquestación+LLM+telefonía |
| Bland AI (tier Start) | 0,14 | 0,28 | 3,26 | LLM+STT+TTS incluidos, telefonía aparte |

Fuentes en §8.

### 4.3 Total por llamada de 2 minutos — los dos casos que importan

**Recepcionista entrante por WhatsApp (el producto recomendado)**

| Concepto | USD | Bs |
|---|---|---|
| Transporte WhatsApp (entrante) | 0,0000 | 0,00 |
| Motor ElevenLabs Agents | 0,1600 | 1,87 |
| **Total** | **0,1600** | **1,87** |

Con el stack barato (Pipecat + Gemini Live): **USD 0,043 = Bs 0,50** por llamada.

**Recordatorio de cita saliente por WhatsApp**

| Concepto | USD | Bs |
|---|---|---|
| Minutos WhatsApp (2 × 0,0116) | 0,0232 | 0,27 |
| Plantilla de permiso (utility) | 0,0113 | 0,13 |
| Motor ElevenLabs Agents | 0,1600 | 1,87 |
| **Total** | **0,1945** | **2,27** |

**A escala de un cliente real — 100 llamadas salientes de 2 min/mes:**

| Concepto | Cuenta | USD | Bs |
|---|---|---|---|
| 200 minutos de transporte | 200 × 0,0116 | 2,32 | 27,05 |
| 100 plantillas de permiso | 100 × 0,0113 | 1,13 | 13,18 |
| Motor de IA (ElevenLabs) | 200 × 0,080 | 16,00 | 186,56 |
| **Total mensual** | | **19,45** | **226,79** |

### 4.4 La conclusión comercial

**El transporte no es el costo del producto — el motor de IA lo es, y aun así es barato.**
Con 100 llamadas al mes de 2 minutos, el costo total de insumos es **Bs 227**, del cual
**Bs 40 (18%) es transporte y Bs 187 (82%) es el motor**. Un plan de Bs 600–900/mes deja
margen sano, y si se usa el stack barato el costo de insumos cae a ~Bs 90/mes.

Nota sobre el pulso de 6 s: Meta redondea hacia arriba. Dos minutos justos son 20 pulsos
exactos, así que este cálculo no pierde nada. En llamadas cortas y muchas sí importa
(una llamada de 8 s se cobra como 12 s).

---

## 5. El camino B: número boliviano de verdad

Este camino existe y es más barato de lo que parecía, pero tiene riesgo regulatorio y
operativo que el camino A no tiene. Va acá porque puede hacer falta si un cliente exige
atender su teléfono fijo de toda la vida.

### 5.1 Twilio: NO vende números bolivianos usables

La página regulatoria oficial de Twilio para Bolivia lista **un solo tipo: Toll-Free,
prefijo +591800**. No hay local, national ni mobile. Requisito: *"Executed Letter of
Authorization (LOA)"*.
Fuente: https://www.twilio.com/en-us/guidelines/bo/regulatory

Costo de **llamar** a Bolivia desde Twilio:

| Destino | USD/min | Bs/min |
|---|---|---|
| Bolivia (fijo, incl. Major Cities y Rural) | 0,3025 | 3,53 |
| **Bolivia - Mobile** | **0,4140** | **4,83** |

Fuente: https://www.twilio.com/en-us/voice/pricing/bo — sin desglose por operador.

> ⚠️ El "$1.15/mo" de la página de precios de voz de Bolivia es el "starting at" **global**
> de números internacionales de Twilio, no un número boliviano. No leerlo como que Twilio
> vende un +591 3 de Santa Cruz.

### 5.2 Quién sí vende un +591 — y la trampa del rango "5"

| Proveedor | ¿Vende +591? | Tipo | Precio | Fuente |
|---|---|---|---|---|
| Twilio | Parcial | Solo Toll-Free +591800 | no publicado | twilio.com/en-us/guidelines/bo/regulatory |
| **Telnyx** | SÍ | Toll-Free y **National** | "starts at $35/month" | telnyx.com/phone-numbers/bolivia |
| **DIDWW** | SÍ | Solo National +591-5 | no publicado | didww.com/phone-numbers/all-phone-numbers/Bolivia/National |
| **Zadarma** | SÍ | National +591 5 | **$57/mes**, 2 canales, entrantes gratis | zadarma.com/en/tariffs/numbers/bolivia/national/ |
| AstraQom | dice que sí | local + toll-free | troncales desde $9/canal/mes | astraqom.com/en/bolivia |
| Global Call Forwarding | Solo toll-free | Bolivia 800 | desde $48,95/mes | globalcallforwarding.com |

Requisitos Telnyx: persona = nombre, teléfono, copia de pasaporte o CI; empresa = razón
social, teléfono, certificado de registro + dirección. Dirección "Worldwide" (no exige
domicilio boliviano). ⚠️ Esa página está **actualizada 29-sep-2025, anterior a 2026**.

**🔴 La trampa:** según el Plan Técnico Fundamental de Numeración (RM 339/2021, oopp.gob.bo),
el dígito **"5" es un rango nacional NO geográfico asignado al servicio de VozIP**. El plan
boliviano es: 2 = La Paz/Oruro/Potosí · **3 = Santa Cruz/Beni/Pando** · 4 = Cochabamba/
Chuquisaca/Tarija · **5 = VozIP no geográfico** · 6 y 7 = móvil · 800 = toll-free.

**Ningún proveedor extranjero vende +591 3 (Santa Cruz) ni 6/7 (móvil).** Todos venden el 5
o el 800. Un cliente cruceño que ve un 5 en la pantalla no ve "una empresa de Santa Cruz":
ve un número que no reconoce. El atajo extranjero pierde casi todo su valor ahí.

### 5.3 Lo barato de verdad: Entel VOZip Empresas

| Producto | Precio |
|---|---|
| **Entel VOZip Empresas** | mínimo promedio por línea **Bs 36/mes** |
| Entel Troncal SIP básico | **Bs 200/mes**, 16 canales, + Bs 250 instalación |
| Canales adicionales (17-70) | Bs 20/mes c/u + Bs 10 instalación |
| Plan TSIP **DID MÓVIL** | tasa mínima **Bs 1.500/mes** + **Bs 0,80/min** |
| Plan TSIP línea Básico Plus | tasa mínima Bs 900/mes |
| Plan TSIP DID VozIP | tasa mínima Bs 700/mes |

VOZip **entrega credenciales SIP por email** (*"Se enviará su número VOZip entel y
contraseña a su correo electrónico"*), funciona sobre **internet común** (SIP, códecs
G.729/G.711, >100 Kbps por llamada, puertos SIP 5060/5061 y RTP 10001-42000) y da *"un
número de línea único y válido en toda Bolivia"* de 8 dígitos, rango 5.

Tarifas VOZip por tramo de consumo (normal / reducido):

| Tramo | Consumo/mes | Fijo | Móvil | A VozIP |
|---|---|---|---|---|
| SMALL | Bs 1-666 | 0,63 / 0,52 | 0,90 / 0,74 | **Bs 0,00** |
| MEDIUM | Bs 667-2.222 | 0,57 / 0,47 | 0,81 / 0,67 | Bs 0,00 |
| LARGE | Bs 2.223+ | 0,51 / 0,42 | 0,75 / 0,66 | Bs 0,00 |

Horario normal 05:00-23:59, reducido 00:00-04:59.
Fuentes: https://www.entel.bo/EmpresaVoip · https://www.entel.bo/EmpresaSip

El Troncal SIP exige **red Metro Ethernet de Entel** + SBC o firewall. VOZip no: va por
internet cualquiera. **Eso hace de VOZip la puerta de entrada de Bs 36/mes.**

**🔴 La pregunta que decide todo este camino y que NO está verificada:** si Entel permite
registrar esas credenciales SIP desde un **servidor/PBX** (Asterisk, Vapi BYOC) en vez de un
teléfono o app, y cuántas llamadas simultáneas aguanta una línea. La página no lo dice. Es
una llamada a Entel, no una búsqueda.

### 5.4 Otros operadores bolivianos

- **Cotas** (cooperativa cruceña): **Cotas Link** = comunicaciones unificadas, hasta **30
  llamadas simultáneas** sobre una conexión, servicio **DDI**, integración con PABX y CRM.
  Funcionalmente es una troncal con DID aunque no use esa etiqueta. **Precio no publicado.**
  Fuente: https://cotas.com/empresas/
- **Tigo**: "SIP Troncal (Empresas)" existe, cero detalle público, deriva a ventas.
  Fuente: https://ayuda.tigo.com.bo/hc/es/articles/11440895264147-Sip-Troncal-Empresas
- **Viva (Nuevatel)**: sin oferta pública encontrada.

### 5.5 Portabilidad y gateways GSM

- **Portabilidad numérica existe** desde el 1-oct-2018 (DS 3404; marco DS 2498), ante el
  operador receptor. Fuentes: portabilidad.att.gob.bo, w2.att.gob.bo.
- **Pero es solo entre operadores móviles bolivianos.** DIDWW lo confirma del otro lado:
  para Bolivia lista *"Number Portability: Not Supported"*. **No se puede portar un móvil
  boliviano a Twilio ni a Telnyx.**
- **Gateway GSM / SIM box:** todo equipo de telecomunicaciones requiere **homologación ATT**
  (procedimiento TL-HO-02, directrices RAR ATT-DJ-RAR-TL LP 443/2023) y su importación
  requiere autorización previa. Un GoIP/Yeastar/Dinstar importado sin eso es equipo ilegal.
- **SIM-boxing perseguido activamente:** entre el 1-ene y el 17-jul-2026 la ATT bloqueó
  **13.516 celulares por IMEI** y cortó **10.846 líneas**, sobre 16.821 denuncias en la
  plataforma "Bloquea la Estafa". Fuente: att.gob.bo, 2026.

### 5.6 Caller ID: el atajo se muerde la cola

Para mostrar un número boliviano hay que **tener la línea boliviana**. Twilio exige verificar
titularidad con llamada automatizada y código de 6 dígitos que *"the person who answers the
call must enter"* (twilio.com/docs/voice/api/outgoing-caller-ids), y su AUP prohíbe
*"Creating a false identity or any attempt to mislead others as to the identity of the sender
or the origin of any data or communications"* (twilio.com/en-us/legal/aup).

O sea: para verse boliviano hay que volver a Entel/Tigo/Cotas.

---

## 6. Ruta más corta y barata para probarlo con UN cliente

Contexto de partida (dato del coordinador, verificado por Onia hoy, no por mí): Onia ya es
dueña del número **+591 75414930** en Cloud API, calidad **GREEN**, y tramita Tech Provider.

> ⚠️ **Corrección del 2026-08-16.** Esta lista se escribió sin mirar
> `ONIA_VOZ_WHATSAPP_ARQUITECTURA_20260802.md`, que ya tenía el plan por fases y que
> **manda sobre esta sección**. Le faltaban dos pasos, y uno de ellos rompe el producto en
> silencio si se saltea: el **reparto de webhooks** (paso 1.b acá abajo, F1 en aquel doc) y
> las **cuatro mediciones de F0** (latencia voz-a-voz real, caracteres de TTS por segundo de
> audio, ratio de habla del bot, carga del VPS con 2 llamadas simultáneas). Sin F0 todo el
> pricing de §4 se apoya en supuestos. Leer aquel doc antes de ejecutar esto.

1. **Cerrar Business Verification ante Meta.** Es el único portero real y desbloquea el tier
   de 2.000, que es lo que habilita la Calling API. Ya está en trámite.
1.b **Separar las llamadas de los mensajes ANTES de encender nada.** Hoy los webhooks de la
   app viva van a Chatwoot. Si se habilita `calls` en esa misma app, los eventos de llamada
   **también** caen en Chatwoot, que responde 200 y los descarta: el que llama escucha
   silencio. El diagnóstico equivocado ("no funciona la Calling API") cuesta días. La salida
   barata es una segunda app de Meta para las llamadas (30–45 min, reversible, no toca la app
   viva); el repartidor propio es el plan B. Detalle: doc de voz §2 y §6-F1.
2. **Activar llamadas en el número propio de Onia y usarse de conejillo de indias.** Entrante
   primero: costo de transporte cero, sin permisos.
3. **Enchufar el motor por SIP.** Onia ya corre un VPS y Meta publicó guía de Asterisk. La
   alternativa sin infra es apuntar el SIP a ElevenLabs/Vapi/Retell sin cambiar el diseño.
4. **Escribir el guion legal ANTES de la primera llamada** (§7.2): "te atiende un asistente
   virtual" + aviso de grabación + consentimiento con timestamp. No es opcional.
5. **Piloto con la clínica dental, solo entrante.** El agente atiende cuando nadie atiende:
   horario, dirección, precios, agendar. Se mide **una sola cosa**: cuántas llamadas que
   antes se perdían terminan en cita.
6. **Recién después, el saliente.** Recordatorio a pacientes que ya llamaron — por §3.5(b)
   tienen permiso temporal de 7 días sin gastar plantilla.

Por qué en este orden: los pasos 2-5 casi no gastan, no requieren permisos de usuario, no
chocan con el límite de 100 llamadas/24 h y no exponen a que Meta revoque permisos por baja
tasa de respuesta. **Todo el riesgo vive en el outbound, y el outbound se agrega cuando el
producto ya demostró que funciona.**

---

## 7. Regulación boliviana

### 7.1 Licencia ATT

La Voz sobre Internet es servicio regulado bajo la **Ley 164** (8-ago-2011) y el DS 1391. La
ATT otorga **Licencia de Servicio de Valor Agregado** (LVA 01 Cooperativas, LVA 02 Empresas
Privadas, LVA 03 Entidades Públicas, LVA 04 Distribución de Señales), vigencia 5 años.
**Las licencias solo se otorgan a personas naturales o jurídicas domiciliadas en el país.**
Fuente: https://www.att.gob.bo/requisitos-tele

**Se necesita licencia para prestar el servicio a terceros. NO para usar la línea de un
operador licenciado en tu propio negocio.** Onia usando Entel para su cliente = uso normal.
Onia revendiendo minutos o VozIP al público = requiere licencia.

### 7.2 🔴 Grabación de llamadas: riesgo penal

**Código Penal art. 301**, texto: *"El que grabare las palabras de otro no destinadas al
público, sin su consentimiento, o el que mediante procedimientos técnicos escuchare
manifestaciones privadas que no le estén dirigidas... siempre que el hecho pueda ocasionar
algún perjuicio, será sancionado con privación de libertad de tres meses a un año."*
Fuentes: unodc.org/cld (Código Penal Bolivia, arts. 300-301) · bolivia.infoleyes.com/articulo/32638
Marco constitucional: CPE art. 25 (secreto de las comunicaciones privadas).

**Un agente de voz graba por diseño, porque transcribe.** Regla no negociable: aviso de
grabación al inicio de cada llamada + consentimiento registrado con timestamp.

### 7.3 Protección de datos: no hay ley general

**Bolivia NO tiene ley de protección de datos personales vigente a agosto de 2026.** Hay
anteproyecto de AGETIC (2024-2025) y de sociedad civil; ninguno promulgado.
Fuentes: agetic.gob.bo (anteproyecto 2024) · misdatos.internetbolivia.org

Lo que sí hay, según DLA Piper (Data Protection Laws of the World, actualizado 2026-02-04):
*habeas data* constitucional + **Ley 1080 (2018)** + los **DS 1391 y 1793**, que exigen
**consentimiento expreso y escrito** para el uso de datos personales **en telecomunicaciones**.
**No hay registro Do-Not-Call ni ley de marketing electrónico.**

Paradoja a tener clara: **no hay ley de datos, pero sí hay tipo penal de grabación.** Bolivia
es más restrictiva en *grabar* que muchos países con GDPR, y más laxa en *almacenar*. Y una
ley de datos es un cambio previsible a 1-3 años: conviene operar desde ya con consentimiento
registrado, que es lo que igual exige el art. 301.

### 7.4 El resto de LatAm (si algún día se exporta)

Ningún régimen latinoamericano singulariza hoy las llamadas de IA: las tratan como
telemarketing común.

| País | Estado |
|---|---|
| **Colombia** | SIC Concepto 25-167843 (27-jun-2025) responde exactamente esta pregunta a un contact center. Exige transparencia/privacidad/seguridad. **Un mandato explícito de "está hablando con una IA" NO está confirmado.** Aparte: **Ley 2300/2023 "Dejen de Fregar"** + Registro Nacional de Excluidos (CRC, vivo 10-abr-2024) — hay que depurar antes de contactar |
| **Perú** | Ley 31814 + Reglamento DS 115-2025-PCM, vigente 22-ene-2026. Niveles de riesgo, supervisión humana. Deber explícito de declarar IA **no confirmado** |
| **Chile** | Ley 21.719 vigente 1-dic-2026 (sanciones hasta 20.000 UTM). Proyecto "No Molestar" en segundo trámite (feb-2026) — **no menciona IA** |
| **Brasil** | PL 2338/2023 aprobado por el Senado 10-dic-2024, **sigue en Diputados a ago-2026**, no es ley |
| **Argentina / México** | Registro No Llame (Res. 126/2024) y REPEP (PROFECO) tratan las llamadas de IA **igual que el telemarketing común** |
| **España** | Ley 10/2025 (BOE-A-2025-26698), obligaciones desde 28-dic-2026: operador humano en el menú principal. **Pero su art. 2 aplica a servicios básicos o empresas ≥250 empleados / >€50M — una clínica dental queda fuera** |
| **UE** | **AI Act art. 50 aplica desde el 2-ago-2026, sin período de gracia.** Obligación de informar que se interactúa con IA; la excepción de "obvio" se interpreta "de manera restrictiva". Multas hasta €15M o 3% del volumen mundial. Las Guías del 20-jul-2026 agregan principio de **re-declaración en audio**: una sola declaración al inicio no basta |

### 7.5 ¿Hay que declarar que es una IA?

**Hoy no hay obligación legal.** El **Proyecto de Ley 178/2024-2025** de IA fue aprobado por
el Senado el **22-oct-2025** y sigue pendiente en Diputados a mediados de 2026. Crea la ANIA,
con transparencia como principio rector y 7 usos prohibidos (arts. 12-18).
Fuentes: eldeber.com.bo (22-oct-2025) · unifranz.edu.bo · levellers.ai/what-is/ai-regulation-bolivia

**Declararlo igual desde ya.** Es el mismo aviso donde va el consentimiento de grabación, y
cuando salga la ley ya se cumple.

### 7.6 Llamadas automatizadas: no hay norma, pero sí hay riesgo

**No existe normativa boliviana de robocalls, telemarketing ni Do-Not-Call.**

**Pero el riesgo real es operativo, no legal:** la ATT corta líneas por denuncia de usuarios
— 10.846 líneas cortadas y 13.516 IMEIs bloqueados en 6 meses y medio de 2026. Un marcador
automático saliendo de un número boliviano está a una ola de denuncias de quedarse sin línea,
sin proceso previo. Fuente: att.gob.bo, "ATT registra más de 16.800 denuncias en la
plataforma Bloquea la Estafa durante 2026".

→ **Otro argumento para el camino A**: en WhatsApp el castigo por spam es que Meta revoque
permisos de llamada, no que la ATT deje al cliente sin teléfono.

---

## 8. Plataformas de agentes de voz — agosto 2026

### 8.1 Precio por minuto

| Plataforma | Fee plataforma | ¿Incluye LLM/TTS/STT? | Modelo | Fuente |
|---|---|---|---|---|
| **Vapi** | $0,05/min | ❌ "At cost ($0 if you bring your own API key)" | BYOK puro | vapi.ai/pricing |
| **Retell AI** | $0,055/min infra | ❌ TTS $0,015/min; LLM $0,045–0,16/min | rango oficial **$0,07–0,31/min** | retellai.com/pricing |
| **Bland AI** | incluido | ✅ LLM + transcripción + voces premium | all-in menos telefonía | bland.ai/pricing |
| **ElevenLabs Agents** | $0,080/min (burst $0,160) | ✅ TTS+STT+KB+RAG; ❌ LLM aparte "at cost" | híbrido | elevenlabs.io/pricing/agents |
| **Synthflow** | **no verificado** | — | quote-based, "Enterprise contracts start at $30,000 annually" | synthflow.ai/pricing |
| **OpenAI Realtime** | **no verificado** | — | — | HTTP 403 |
| **Gemini Live** | $0,005–0,0053/min audio in · $0,018–0,0315/min audio out | modelo crudo, sin orquestación ni telefonía | tokens | ai.google.dev/gemini-api/docs/pricing — **"last updated 2026-08-13"** |

**Bland AI por tier:** Start $0,14/min, $0/mes, 100 llamadas/día, 10 concurrentes · Build
$0,12/min, $299/mes, 2.000/día, 50 concurrentes · Scale $0,11/min, $499/mes, 5.000/día,
100 concurrentes.

**Retell desglose LLM:** GPT 5.5 $0,16/min · GPT 5.4 $0,080 · GPT 4.1 $0,045 · Claude 5
Sonnet $0,08 · Gemini 3.5 Flash $0,081. Add-ons: KB +$0,005/min · PII +$0,01/min ·
denoising +$0,005/min · concurrencia >20 $8/mes c/u.

**ElevenLabs planes:** Free $0 (15 min) · Starter $6 (75) · Creator $22 (275) · Pro $99
(1.238) · Scale $299 (3.738) · Business $990 (12.375).

### 8.2 Jugadores más baratos que sí importan

| Plataforma | Precio | Por qué importa |
|---|---|---|
| **Pipecat Cloud** (Daily) | **$0,01/min** activo · SIP $0,003–0,02/min | BYOK total, sin mínimo, concurrencia ilimitada. **Self-host = $0** |
| **LiveKit Cloud** | **$0,01/min** · Build $0 / Ship $50/mes | Free tier real: 1.000 min, 5 concurrentes, sin tarjeta. **Self-host = $0** |
| **Deepgram Voice Agent** | $0,056/min → **sube a $0,075 el 13-sep-2026** | El mejor soporte documentado de `es-419`. Sin PSTN propio |
| **Telnyx Voice AI** | **$0,056/min** all-in | Latencia medida más baja, voces LatAm regionales, PoP São Paulo, vende +591, y la única reventa real |
| **Ultravox** | $0,05/min · 30 min gratis | Speech-to-speech directo (página fechada 17-abr-2026) |
| **Cartesia "Line"** | $0,06/min · Pro $5/mes | Tier de entrada más barato |

⚠️ **Layercode ya no existe** como producto de voz: layercode.com redirige (301) a toyo.ai.

### 8.3 Español latinoamericano

| Plataforma | ¿es-419 declarado? | Detalle |
|---|---|---|
| **Retell AI** | ✅ **SÍ, explícito** | Los únicos códigos de español son `es-ES` y **`es-419`**. TTS: Platform, MiniMax, Fish, ElevenLabs, Cartesia, OpenAI. ASR: Deepgram, Azure, Soniox, AssemblyAI |
| **Deepgram** (motor de Vapi y Retell) | ✅ **mejor documentado**: `"Spanish: es, es-419"` | Nova-3 mejora WER streaming en español **21,40% relativo** vs Nova-2. Flux Multilingual GA 29-abr-2026, cambio de idioma a mitad de llamada |
| **Telnyx** | ✅ voces de **Colombia, España, México, EE.UU., Venezuela** | Acento regional + PoP São Paulo |
| **Vapi** | ➖ sin códigos regionales | Ejemplo oficial usa `es-ES-ElviraNeural` y `es-MX-DaliaNeural` (Azure). STT recomendado Deepgram Nova con `language:"multi"` |
| **ElevenLabs** | ➖ no hay es-419 | Multilingual v2 lista "Spanish (Spain, Mexico)" — México única variante LatAm |
| **Bland / Synthflow / Gemini Live** | **no verificado** | Sus páginas no listan idiomas |

⚠️ **Riesgo a probar antes de comprometerse:** un benchmark de Coval publicado por Gradium
(27-may-2026, **el vendor es uno de los medidos**) da **Deepgram Nova-2 25,2% WER y Nova-3
25,3%**, contra Gradium 2,4% y ElevenLabs Scribe v2 3,1%. **Sin resultados específicos de
español.** Que Deepgram sea el STT por defecto de Vapi con ese WER agregado obliga a probar
en español boliviano antes de vender.

### 8.4 🔴 Latencia: lo medido es 2-3x lo declarado

**Declarado:** Vapi *"typically around 800 milliseconds end-to-end"* (docs.vapi.ai/faq) ·
Retell ~600ms, SLA <800ms p99 · Telnyx *"Sub-200ms"* · Deepgram *"under 400ms"* end-of-turn.

**Medido en llamadas telefónicas reales (Openbenchmarks 2026), TTFAB:**

| Plataforma | Mediana | p95 | Turnos |
|---|---|---|---|
| Telnyx | **1.296 ms** | 1.856 | 419 |
| ElevenLabs | 1.424 ms | **1.768** | 429 |
| Bland AI | 1.520 ms | 2.248 | 429 |
| Vapi | 1.558 ms | 2.008 | 382 |
| Retell AI | 1.740 ms | 2.259 | 419 |

**Nadie llega a 600-800ms en teléfono real. Todos están entre 1,3 y 1,7 segundos.** Si el
pitch a un cliente promete "respuesta instantánea", es falso con cualquiera de estos.

### 8.5 BYO número / SIP

| Plataforma | BYOC | Inbound SIP URI |
|---|---|---|
| **Vapi** | ✅ "any SIP provider" | ✅ `{phoneNumber}@<credential_id>.sip.vapi.ai` |
| **Retell** | ✅ elastic SIP trunking | ✅ `sip:{call_id}@sip.retellai.com`, TCP/UDP/TLS/**mTLS** |
| **ElevenLabs** | ✅ import from SIP trunk | ✅ `sip:+E164@sip.rtc.elevenlabs.io:5060`, Digest o ACL por IP |
| **LiveKit** | ✅ el mejor para BYO trunk | no verificado |
| **Bland** | ✅ Twilio propio o SIP | no verificado |
| **Deepgram / Gemini Live** | ❌ sin PSTN propio | — |

**Todas las relevantes soportan BYO SIP** → todas se pueden colgar de WhatsApp Calling
(§3.6) o de una troncal de Entel (§5.3).

### 8.6 Reventa y agencia

| Plataforma | ¿Existe? | Sub-cuentas facturables |
|---|---|---|
| **Vapi** | Permitido sin producto: *"you can bake it in your product without using Vapi branding"*; multi-tenancy *"your application logic will take care of it"* | ❌ las armás vos |
| **Retell** | Solution Partner Program (Elite/Diamond/Gold) | ❌ costo no publicado |
| **ElevenLabs** | "Commercial Partner Program" — es de referidos | ❌ |
| **🟢 Telnyx** | ✅ **Managed Accounts**: sub-cuentas con balance, método de pago e invoice propios + "Allow Custom Pricing" para markup. Límite 1.000 | ✅ **pero solo en planes commit: Starter $1.000/mes, Growth $2.000/mes o Enterprise $5.000+. NO en pay-as-you-go** |

Para Onia hoy: **ninguna sirve para revender con marca propia sin construirlo uno mismo.**
El patrón del mercado son wrappers de terceros ($49–$499/mes) = dos proveedores, dos facturas.
Con WhatsApp Calling el problema es menor: cada cliente tiene su propio WABA y su propia
factura de Meta, y Onia cobra el software.

### 8.7 Bolivia en estas plataformas

- **Sanciones: Bolivia no está restringida en ninguna.** ElevenLabs publica su lista
  (Bielorrusia, Cuba, Irán, Corea del Norte, Rusia, Siria, Crimea, Donetsk, Lugansk). Vapi
  ToS (Last Updated 17-abr-2026) cita solo embargo genérico de EE.UU. y OFAC.
- **🔴 Retell no cubre Bolivia con números**: su tabla lista 16 países vía Twilio; de LatAm
  solo México $0,05/min. Bolivia no aparece.
- **🔴 Stripe no soporta Bolivia** (de LatAm solo Brasil y México). No impide *pagarles* con
  tarjeta boliviana, pero impide que Onia cobre por Stripe.
- El obstáculo real de pago será la **tarjeta boliviana bloqueando cargos internacionales en
  USD**, no la sanción — sobre todo tras la flotación de junio 2026.

---

## 9. Casos reales y quejas — la parte incómoda

**Advertencia general: casi todo número de este mercado es auto-reportado por el vendedor.**
No existe una sola métrica de contención, no-show o cobranza auditada de forma independiente,
en ningún idioma. Abajo se marca qué es qué.

### 9.1 Lo que dice la evidencia independiente: la llamada automática pierde contra la humana

| Hallazgo | Números | Fuente | Tipo |
|---|---|---|---|
| Llamada de personal humano gana | Sin recordatorio 23,1% de ausencias · **automática 17,3%** · **humana 13,6%**; n=9.835 | Parikh et al., *Am J Med* 2010;123(6):542-548 | Independiente, **viejo (2010)** |
| Meta-análisis, 29 estudios | Recordatorio manual **−39,1%** de inasistencia relativa vs automático **−28,9%** | Hasvold & Wootton, *J Telemed Telecare* 2011 | Independiente, **viejo (2011)** |
| A los pacientes les molesta el tono automático | *"Impersonal or automated tones stemmed in negative sentiments"*; se prefiere SMS a la llamada; "spam fatigue" por exceso de recordatorios | Rousaki et al., *JAMIA* 2026, doi:10.1093/jamia/ocag112 | Independiente, **2026** |

**Ningún estudio ha comparado un agente de IA moderno contra esa línea base.** El punto de
partida honesto es que lo automático rinde ~10 puntos porcentuales menos que una persona.

### 9.2 El único despliegue de agente de voz con revisión por pares — y da bien en español

Hippocratic AI "Ana", 1.878 pacientes, 16-24 sep 2024 (Bhimani et al., *J Med Internet Res*
2025;27:e71211, doi:10.2196/71211):

| | Español | Inglés | p |
|---|---|---|---|
| Aceptación (opt-in) | **18,2%** | 7,1% | <.001 |
| Tasa de conexión | **69,6%** | 53,0% | <.001 |
| Duración | 6,05 min | 4,03 min | <.001 |

**Los hispanohablantes conectaron más y aceptaron 2,6 veces más que los angloparlantes.**
Limitaciones de los propios autores: retrospectivo, sin grupo de control, un solo sistema de
salud, ventana de 9 días, y **sin seguimiento de si alguien completó el examen**. La
aceptación no es un resultado.

### 9.3 Las fallas documentadas

- **🔴 Kinney Drugs retiró su asistente de voz "Burt"** tras cientos de quejas. Lanzado
  may-2026, retirado de llamadas entrantes **ago-2026**, volvieron al menú de tonos. Quejas:
  llamadas incoherentes, **dosis equivocadas**, avisos de recetas perdidos. El presidente:
  *"We did not, and we own that."*
  Fuente: [WCAX, 07-ago-2026](https://www.wcax.com/2026/08/07/kinney-drugs-pulls-back-ai-phone-assistant-after-hundreds-customer-complaints/)
  Condiciones de falla nombradas en el hilo de HN: *"Older callers, drug names, insurance
  mess, zero patience"* y *"I spent 20 minutes YELLING at the AI before it would transfer me
  to a human."*
- **Presto Automation** decía públicamente que el **95%** de los pedidos de drive-thru se
  tomaban sin intervención humana. Su presentación ante la SEC reveló que **el 70% requería
  intervención de agentes humanos** en Filipinas, excluidos de la métrica. **La SEC lo
  sancionó** (14-ene-2025, File No. 3-22413) por comercializar tecnología de un tercero como
  propia y afirmar que "elimina la toma de pedidos humana".
- **Wendy's FreshAI**: el número honesto es **86%** sin intervención. El "casi 99% de éxito"
  se define como *pedidos enviados al POS aunque el personal después los corrigiera* — o sea,
  "éxito" = "se creó un ticket". Ese es el patrón de métrica inflada a vigilar.
- **McDonald's** discontinuó en 2024 su piloto con IBM tras errores en cascada (helado con
  tocino, cientos de dólares en nuggets agregados solos).
- **Taco Bell** frenó y replanteó el despliegue en ago-2025 tras quejas y la broma viral de
  los **18.000 vasos de agua**; la guía a franquiciados pasó a "una herramienta a veces,
  junto a personal humano en horas pico".

### 9.4 Las encuestas de consumidores — y la única excepción que nos sirve

| Hallazgo | Números | Fuente | Fecha de campo |
|---|---|---|---|
| Gartner | **64%** preferiría que las empresas NO usen IA en atención · **53%** consideraría cambiarse a la competencia | n=5.728 | **dic-2023 — 2,5 años** |
| SurveyMonkey | **79%** prefiere fuertemente un humano · **89%** dice que siempre se ofrezca opción humana · **50%** cancelaría un servicio solo-IA | n=2.017 adultos EE.UU., ±2,5pp | **10-11 dic 2025** |
| **Metrigy** | **84,7%** prefiere humanos · **80,1% sigue prefiriendo un humano aun cuando se le asegura que la IA resolvería el problema** · **pero 46,9% encuentra la IA útil para agendar y reagendar** | n=503 | fines 2025 |

**🟢 Ese 46,9% es el hallazgo comercial del documento.** Agendar y reagendar es **la única
tarea que los consumidores aceptan** de un agente de IA. Es exactamente el caso de la clínica
dental de §6. Todo lo demás del mercado pelea contra un 80% de rechazo; este caso no.

### 9.5 Por qué la gente cuelga — los "tells" con fuente

Verbatim de hilos de Hacker News:
- *"couldn't understand my address and therefore could not schedule the appointment"* — **la
  comprensión de direcciones es la falla concreta más nombrada**
- *"still a bit of the uncanny valley/overlapping speech issues"*
- *"It would forget the entire checklist after two responses"*
- *"the more difficult the agent makes it to get to speak with a human, the more unhappy I become"*
- *"essentially worse than a simple 'press 1 for sales' menu"*

**Tells con fuente:** hablar encima del usuario · cortar una pausa como si fuera fin de turno ·
direcciones · nombres propios y de medicamentos · olvidar el contexto a ~2 turnos · repetir la
misma respuesta · derivar a la web · no tener salida a humano.

**Tells SIN fuente** (plausibles pero no verificados; Reddit estuvo bloqueado): que no respire,
la dicción demasiado perfecta, la entonación plana, el "ajá" fuera de lugar, el tic de
"entiendo perfectamente lo frustrante que debe ser".

### 9.6 El modo de falla más accionable: el endpointing, no la transcripción

Los agentes cierran tu turno con un silencio fijo de 500-800 ms. Con umbral de 700 ms:

- **8,0%** de las frases de hablantes de veintipico contienen pausas internas leídas como fin de turno
- **19,7%** en hablantes de sesenta y pico

En el mismo análisis, el WER de Whisper large-v3 es **mejor** para los de setenta (4,67%) que
para los de veinte (6,53%). **O sea: no es la transcripción, es el endpointing.** A los
mayores se los corta ~2,5 veces más. Encaja exactamente con el perfil de falla de Kinney Drugs.
Fuente: comentario en HN 49204392 (2026) — **fuente única, sin corroborar**, pero es la única
cuantificación de esto que existe.

**Implicancia para la clínica dental: el paciente mayor es el que más falla y el que más
llama.** Si se vende esto, hay que subir el umbral de silencio y probar con adultos mayores
antes que con nadie.

### 9.7 🟢 Español: el canal importa más que el idioma — y acá WhatsApp gana otra vez

En audio limpio, **el español transcribe MEJOR que el inglés**:

| Modelo | WER español | WER inglés |
|---|---|---|
| NVIDIA Canary 1B v2 | **3,22%** | 7,15% |
| Whisper Large v3 | **3,32%** | 7,44% |
| Phi-4 Multimodal | **3,59%** | 6,02% |

Fuente: Open ASR Leaderboard, [arXiv:2510.06961](https://arxiv.org/html/2510.06961v1) (08-oct-2025), independiente y reproducible — pero sobre FLEURS/MLS, que es **habla leída, limpia, a 16 kHz**. No son llamadas.

Contra eso, Deepgram (**vendedor**, pero reportando algo negativo sobre la telefonía en
general): la telefonía de banda angosta a **8 kHz agrega 8-12 puntos porcentuales absolutos
de WER**; el códec G.729 agrega 10-15% relativo; y el audio real de contact center corre a
**35-50% de WER contra 3-5% en benchmark limpio**.

> **El 3,3% y el 35-50% describen el mismo idioma en canales distintos. Una llamada telefónica
> es el segundo.** El número honesto para planificar telefonía no se parece en nada al 3%.

**🟢 Y acá está el punto que nadie nota:** ese castigo de 8-12 puntos es de **la telefonía a
8 kHz**. WhatsApp Calling **no usa telefonía de banda angosta: usa OPUS** (§3.6), que es
banda ancha. *(Razonamiento propio uniendo dos hechos verificados — la penalización de
Deepgram por 8 kHz y el códec OPUS documentado por Meta. No tengo una medición de WER sobre
audio de WhatsApp que lo confirme; hay que medirlo.)* Si se sostiene, el camino A no solo es
36 veces más barato que el camino B: además **entra con mejor audio al reconocedor**.

### 9.8 La restricción que nadie modela: la tasa de respuesta

- **Chile:** las inscripciones en "No Molestar" pasaron de 84.000 (2020) a **1.200.000
  (2023)** — 14x en tres años. 28 llamadas no deseadas por persona por mes; **71% de las
  llamadas de números desconocidos son spam** (Senado de Chile, 20-feb-2026).
- **LatAm: 88% recibió llamadas no deseadas** entre dic-2025 y ene-2026; 11% eran intentos de
  fraude (Kaspersky, 02-feb-2026 — **telemetría de su propia app, sin tamaño de muestra**).
- **Bolivia:** 16.821 denuncias de fraude telefónico en 7 meses de 2026 (ATT, §7.6).

**En un mercado donde el 71-88% de las llamadas desconocidas ya son spam, la restricción que
manda no es la calidad del reconocedor: es que te atiendan.** No existe cifra publicada de
tasa de respuesta para llamadas salientes de IA en español.

**🟢 Tercer argumento para el camino A:** una llamada de WhatsApp no entra como número
desconocido. Entra con el nombre y la foto del negocio, verificados por Meta (§3.6). Es la
única vía de las estudiadas que no compite contra la presunción de spam.

### 9.9 Latencia medida: los vendedores mienten ~490 ms

Openbenchmarks — independiente, MIT, código y audio crudo publicados, última llamada
**01-ago-2026**, 2.078 turnos. Ya está en §8.4. Su conclusión textual:

> *"The latency a platform reports for itself runs roughly **490 ms below** what we measure
> from that call's audio."*

Umbral relevante: **por encima de ~1.500 ms la conversación se rompe** — los usuarios hablan
encima, se repiten o abandonan (Hamming AI, 12-ene-2026, **vendedor**). **Las cinco
plataformas medidas están arriba de ese umbral** (1.296-1.740 ms de mediana).

Y falta el tramo boliviano: ninguna de esas mediciones se hizo desde Bolivia. La inferencia
está alojada en EE.UU.; el edge más cercano de Twilio en Sudamérica es **São Paulo**
(twilio.com/docs/global-infrastructure/edge-locations) y **Bland no tiene región LatAm**.
El ida y vuelta Bolivia→EE.UU.→Bolivia suma sobre esos 1,3-1,7 s. **No hay medición que
citar: hay que probarlo en vivo.**

### 9.10 🔴 Estadísticas fantasma — repetidas por todos, sin fuente primaria

**No usar ninguna de estas. Si aparecen en una propuesta, sacarlas.**

- "HBR 2024: las llamadas automáticas subieron la recuperación de cobranza 30% en 6 meses" — **no existe tal artículo**
- "McKinsey: la IA sube la recuperación 20-40%" — citado como 20-40%, 25% y 30% por tres blogs distintos, ninguno enlaza a McKinsey
- "87% de reducción de inasistencias", "45% menos citas perdidas", "40% en 8 semanas / £6.400 al mes en una clínica de Londres" — todas rastrean a blogs SEO de vendedores de IA de voz
- "50,7% de reducción de no-show" — **es real pero mal atribuido**: es un modelo de random
  forest **más coordinadores humanos llamando**, no un agente de voz (AlSerkal et al., *JMIR
  Form Res* 2025;9:e64936). Sin grupo de control
- "Whisper en español 5% WER vs inglés 8%" — solo en sitios SEO generados por IA
- "68% abandona cuando el sistema se siente lento"
- "un desarrollador reportó que Vapi le causó $50k en daños"
- "60-85% de reducción de costos de atención en España, 2026"

**Además, marcar como viejo:** el 64% de Gartner se relevó en **dic-2023**; Parikh es 2010;
Hasvold & Wootton 2011.

### 9.11 Una nota sobre la calidad de las reseñas de plataformas

**El paisaje de reviews está envenenado.** Retell blogea sobre Vapi, Synthflow sobre Retell,
y así. Una página de "reseñas de Vapi" que dice agregar Trustpilot y Product Hunt no aporta
**ni una sola URL de fuente**, y su única cita se atribuye a "un usuario verificado" sin
enlace. Lo único verificable de verdad son las páginas de estado:

| Plataforma | 90 días | Nota |
|---|---|---|
| Vapi | API **99,771%** (≈2h45m de degradación/90d) | 8 incidentes registrados jun-ago 2026 |
| Retell | End-to-End Calling **99,94%** | 1 incidente (7-ago, 27 min, proveedor upstream) |
| Bland | **100,0%** | **Sospechoso**: monitorea regiones EC2 y balanceo Cloudflare — infraestructura, no éxito de llamadas |

**Bland además tuvo un incidente reputacional en 2024**: un bot de demo configurado como
consultorio de dermatología pediátrica le pidió a una supuesta chica de **14 años** que
subiera fotos de su muslo a una nube compartida, y **negó ser una IA al preguntárselo
directamente**. Sus términos entonces no exigían declarar que la llamada era de IA.
⚠️ **Atribución sin resolver** (una fuente lo acredita a WIRED, otra a TechCrunch; ninguna
enlaza el primario). Verificar antes de citarlo en cualquier lado.

---

## 10. NO VERIFICADO

No usar nada de esto para decidir ni cotizar.

**Los tres números que deciden todo y que NO están publicados para Bolivia**
1. **Tasa de respuesta** real en Bolivia (para el camino A: cuántos atienden una llamada de
   WhatsApp de un negocio).
2. **WER real sobre español boliviano espontáneo** en el canal que se vaya a usar. La banda
   honesta para telefonía es 35-50%, no el 3,3% del benchmark. Para WhatsApp/OPUS no hay
   medición ninguna. Grabar 20 llamadas reales y medir.
3. **Latencia de ida y vuelta Bolivia → inferencia en EE.UU. → Bolivia.** Arriba de ~1,5 s el
   agente se lee como roto por más que acierte.

**Telefonía Bolivia — lo que decide el camino B**
1. **🔴 Entel VOZip: ¿se puede registrar la credencial SIP desde un servidor/PBX? ¿Cuántas
   llamadas simultáneas?** Es la única pregunta que decide todo el camino B. Se resuelve con
   una llamada a Entel, no con una búsqueda.
2. Precio y canales del SIP Troncal de Tigo (no publicado).
3. Precio de Cotas Link (no publicado).
4. Si Viva/Nuevatel tiene troncal SIP (sin oferta pública encontrada).
5. Bolivia en Plivo, Vonage, Bandwidth, Infobip, Sinch, Voxbeam, IDT (páginas cayeron a
   EE.UU., dieron 403, o no se alcanzaron).
6. Tarifa de terminación de Telnyx a Bolivia.
7. Si un +591-5 comprado a Telnyx/DIDWW se presenta como caller ID saliente y si la red
   boliviana lo respeta. Riesgo alto de reescritura del CLI en tránsito internacional.
8. Texto verbatim del artículo del DS 1391 sobre call centers y operadores legalmente
   establecidos (PDFs binarios; lexivox.org bloqueado desde este entorno).
9. Si un gateway GSM con SIM propia para llamadas domésticas propias está prohibido — zona
   gris: no es bypass, pero choca con homologación y con los términos del operador.
10. El "10 días hábiles con ATT + 3 de publicación" previo al lanzamiento de troncal SIP
    (apareció en snippet de institucional.entel.bo, sin verificación directa).

**Plataformas**
- OpenAI Realtime API: **todo el pricing**. `openai.com/api/pricing/` → HTTP 403.
- Synthflow: $/min, tiers, free tier, y el white-label de ~$2.000/mes (solo fuente terciaria).
- Bland: idiomas soportados, latencia declarada, white-label.
- Gemini Live: idiomas soportados, rate limits del free tier, latencia declarada.
- Vapi: los $10 de crédito gratis y el precio de Vapi Voices (docs dicen "less than the
  original model" sin cifra).
- Retell: el plan "Agency $299/mo" que citan blogs de competidores — **no está en
  retellai.com/pricing**, y esos mismos blogs se contradicen. Tratarlo como inexistente.
- Inbound SIP URI de LiveKit y Bland.

**Casos y quejas — lo que quedó fuera**
- **Comercio / distribuidoras: CERO evidencia independiente.** No se encontró una sola
  métrica verificable de estado de pedido, coordinación de entregas ni cobranza, en ningún
  idioma. Todo lo que circula es de vendedor o es fantasma (§9.10). El único caso LatAm de
  cobranza (Vozy/Unicomer Colombia: −94% de costo operativo, 80% de pagos a tiempo) es
  **auto-reportado, sin auditoría y sin fecha en la página**.
- Reddit, Trustpilot, G2, Wired, Gartner.com y FCC.gov estuvieron **bloqueados al crawler**:
  nada de esas fuentes es de primera mano.
- Encuestas no obtenidas: Salesforce, Cyara, Talkdesk, PwC, Qualtrics, Forrester, NICE,
  Five9, Zendesk, Sprinklr, ContactBabel.
- El primario de WIRED/TechCrunch sobre el incidente de Bland 2024.
- Foros de quejas de consumidores en español.
- **Sin datos de teléfono (no drive-thru) para restaurantes**: no existe medición
  independiente de Slang.ai, Loman, ConverseNow ni Hostie.

**Contexto de Onia**
- El número +591 75414930, su calidad GREEN y el trámite de Tech Provider me los pasó el
  coordinador; no los verifiqué contra la Graph API.
- **La ventaja de OPUS sobre 8 kHz (§9.7) es razonamiento propio uniendo dos hechos
  verificados, no una medición.** Es la hipótesis más valiosa del documento y la más fácil
  de probar: grabar 20 llamadas de WhatsApp y medir WER contra 20 telefónicas.

**Fechas**
- Solo **una** página de plataforma trae fecha de actualización explícita:
  `ai.google.dev/gemini-api/docs/pricing` → 2026-08-13. Vapi ToS → 17-abr-2026. Las páginas
  de pricing de vapi.ai, retellai.com, elevenlabs.io, bland.ai, synthflow.ai, telnyx.com,
  cartesia.ai y pipecat.ai **no muestran fecha**: el contenido es de agosto 2026 por acceso
  directo, pero no hay sello que lo pruebe.
- **Anterior a 2026:** requisitos de DID de Bolivia en Telnyx → 29-sep-2025.

---

## 11. Fuentes primarias

### Meta (leídas con navegador el 2026-08-15; tarifas desde los CSV oficiales)

| Documento | URL | Fecha |
|---|---|---|
| Llamadas a la API de la nube | developers.facebook.com/documentation/business-messaging/whatsapp/calling | Updated 26-jun-2026 |
| Precios de la API de llamadas + CSV USD | .../whatsapp/calling/pricing | Updated 9-jul-2026; rate card 1-jul-2026 |
| Precios de WhatsApp Business + CSV + mapeo de códigos de país | .../whatsapp/pricing | rate card 1-jul-2026 |
| Límites de mensajes | .../whatsapp/messaging-limits | Updated 21-may-2026 |
| Permisos de llamada de usuario | .../whatsapp/calling/user-call-permissions | leído 15-ago-2026 |
| Guía de configuración de SIP | .../whatsapp/calling/sip | leído 15-ago-2026 |

### Telefonía y regulación Bolivia

| Tema | Fuente |
|---|---|
| Twilio Bolivia regulatorio | twilio.com/en-us/guidelines/bo/regulatory |
| Twilio tarifas de voz a Bolivia | twilio.com/en-us/voice/pricing/bo |
| Twilio WhatsApp Business Calling | twilio.com/docs/voice/whatsapp-business-calling (24-jul-2026) |
| Twilio caller ID verificado / AUP | twilio.com/docs/voice/api/outgoing-caller-ids · twilio.com/en-us/legal/aup |
| Telnyx números Bolivia | telnyx.com/phone-numbers/bolivia · support.telnyx.com/en/articles/3506001 (29-sep-2025) |
| DIDWW Bolivia National | didww.com/phone-numbers/all-phone-numbers/Bolivia/National |
| Zadarma Bolivia | zadarma.com/en/tariffs/numbers/bolivia/national/ |
| Entel Troncal SIP | entel.bo/EmpresaSip |
| Entel VOZip Empresas | entel.bo/EmpresaVoip · institucional.entel.bo |
| Tigo SIP Troncal | ayuda.tigo.com.bo/hc/es/articles/11440895264147 |
| Cotas empresas | cotas.com/empresas/ |
| ATT licencias de valor agregado | att.gob.bo/requisitos-tele |
| ATT homologación TL-HO-02 / RAR 443/2023 | att.gob.bo · plataformas.att.gob.bo |
| ATT bloqueos 2026 | att.gob.bo, "Bloquea la Estafa" 2026 |
| Portabilidad numérica | portabilidad.att.gob.bo · w2.att.gob.bo |
| Plan de numeración (RM 339/2021) | oopp.gob.bo |
| Ley 164 | WIPO Lex · minedu.gob.bo |
| Código Penal arts. 300-301 | unodc.org/cld · bolivia.infoleyes.com/articulo/32638 |
| CPE art. 25 | oas.org |
| Anteproyecto protección de datos | agetic.gob.bo · misdatos.internetbolivia.org |
| Proyecto Ley IA 178/2024-2025 | eldeber.com.bo (22-oct-2025) · unifranz.edu.bo · levellers.ai |

### Casos, estudios y encuestas

| Tema | Fuente |
|---|---|
| Recordatorio humano vs automático | Parikh et al., *Am J Med* 2010;123(6):542-548 |
| Meta-análisis de recordatorios | Hasvold & Wootton, *J Telemed Telecare* 2011 |
| Sentimiento de pacientes ante recordatorios | Rousaki et al., *JAMIA* 2026, doi:10.1093/jamia/ocag112 |
| Agente de voz Hippocratic AI (español vs inglés) | Bhimani et al., *JMIR* 2025;27:e71211, doi:10.2196/71211 |
| El "50,7%" mal atribuido | AlSerkal et al., *JMIR Form Res* 2025;9:e64936, doi:10.2196/64936 |
| Modos de falla revisados por pares | Adams, Acosta & Rajpurkar, *npj Digital Medicine* 2025;8:353, doi:10.1038/s41746-025-01776-y |
| Kinney Drugs retira su agente | wcax.com, 07-ago-2026 |
| Presto Automation (SEC File No. 3-22413) | sec.gov, 14-ene-2025 · techspot.com, 11-dic-2023 |
| Wendy's FreshAI 86% | restaurantdive.com |
| Taco Bell / Omilia | restaurantdive.com, 07-jul-2026 |
| McDonald's / IBM discontinuado | c3.unu.edu, 04-sep-2025 |
| Encuesta Gartner 64% | callcentrehelper.com (campo dic-2023) |
| Encuesta SurveyMonkey 79% | surveymonkey.com (campo 10-11 dic 2025) |
| Metrigy 84,7% / 80,1% / **46,9% agendamiento** | nojitter.com |
| Pew, actitudes ante la IA | pewresearch.org, 12-mar-2026 |
| Latencia medida independiente | openbenchmarks.com/voice-agent-latency (última llamada 01-ago-2026) |
| Benchmark de plataformas | benchmarks.cekura.ai |
| WER español vs inglés (Open ASR Leaderboard) | arXiv:2510.06961, 08-oct-2025 |
| Alucinación de Whisper en no-habla (40,3%) | Barański et al., arXiv:2501.11378, 20-ene-2025 |
| Benchmark ESCUCHA (español) | arXiv:2607.17812, 20-jul-2026 |
| Llamadas no deseadas Chile | Senado de Chile, 20-feb-2026 |
| Llamadas no deseadas LatAm | Kaspersky, 02-feb-2026 (telemetría propia) |
| Regulación de datos Bolivia (Ley 1080, DS 1391/1793) | DLA Piper, Data Protection Laws of the World, act. 04-feb-2026 |
| FCC: voces de IA son "artificiales" | FCC 24-17, CG Docket 23-362, 08-feb-2024 |
| EU AI Act art. 50 | digital-strategy.ec.europa.eu (FAQ) · Guías 20-jul-2026 |
| Colombia SIC Concepto 25-167843 | sic.gov.co, 27-jun-2025 |
| España Ley 10/2025 | BOE-A-2025-26698 |

### Plataformas

vapi.ai/pricing · docs.vapi.ai/faq · docs.vapi.ai/assistants/examples/multilingual-agent ·
retellai.com/pricing · docs.retellai.com/build/language-support · bland.ai/pricing ·
elevenlabs.io/pricing/agents · elevenlabs.io/docs/overview/models · synthflow.ai/pricing ·
ai.google.dev/gemini-api/docs/pricing (2026-08-13) · pipecat.ai · livekit.io ·
deepgram.com · telnyx.com · cartesia.ai · Openbenchmarks 2026 (latencia medida) ·
Coval/Gradium 27-may-2026 (WER, vendor interesado)
