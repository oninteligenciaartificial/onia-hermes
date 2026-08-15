# Agentes de llamadas (voz) — ¿Onia puede venderlos en Bolivia?

Investigación de escritorio · 2026-08-15 · TC 11,66 Bs/USD (BCB 13-ago-2026)

Estado de este documento: **parcial y honesto**. Lo verificado en fuente primaria está
en el cuerpo con su link y fecha. Lo que no alcancé a verificar está listado al final
bajo "NO VERIFICADO", sin adornos. No hay una sola cifra sin fuente.

---

## 1. VEREDICTO

**SÍ — pero no el producto que uno se imagina.**

No se vende "un agente que atiende el teléfono". Se vende **un agente que atiende y hace
llamadas de voz por WhatsApp**. Es un producto distinto, y en Bolivia es el único de los
dos que hoy tiene un camino verificado punta a punta.

| | Veredicto | Por qué |
|---|---|---|
| Agente de voz por **WhatsApp** | **SÍ, hoy** | Meta lo habilita en Bolivia, cuesta ~1 centavo de dólar el minuto, y se le enchufa cualquier motor por SIP |
| Agente de voz por **teléfono con número boliviano (+591)** | **NO VERIFICADO** — probablemente no | No pude confirmar que ningún proveedor venda DIDs bolivianos. Ver §6 |

Las tres cosas que hacen que el veredicto sea SÍ:

1. **Bolivia NO está en la lista de exclusión de Meta.** Las llamadas iniciadas por la
   empresa están disponibles en todo país con Cloud API salvo EE.UU., Canadá, Egipto,
   Vietnam y Nigeria. Bolivia no figura. Las iniciadas por el usuario están en todos.
2. **El precio es ridículo.** Llamada entrante = **gratis**. Llamada saliente =
   **USD 0,0116/min** (Bs 0,135). Una llamada de 2 minutos cuesta **Bs 0,27**.
3. **Se le enchufa un agente de IA por SIP.** Meta soporta SIP sobre TLS con medios
   WebRTC/SRTP y códecs OPUS y G.711. Hay guía oficial de Asterisk. No hay lock-in.

**El bloqueo real no es técnico ni de plata: es Business Verification ante Meta.** La
Calling API exige que el número tenga límite de mensajería de 2.000 destinatarios únicos
diarios, y el atajo para llegar ahí es verificar el negocio (§3.4). Onia ya tiene esto en
trámite.

**Lo que NO se puede vender:** prospección en frío por voz. Meta lo hizo imposible por
diseño — el usuario tiene que dar permiso, y los límites son 1 solicitud de permiso por día
y 2 por semana por persona (§3.5). Esto sirve para clientes **que ya son clientes**:
recordar la cita, confirmar el pedido, cobrar. No para conseguir clientes nuevos.

**Caso de arranque recomendado:** recepcionista de voz **entrante** por WhatsApp para la
clínica dental. Costo de transporte cero, sin permisos que pedir, sin límites de 100
llamadas, y resuelve un dolor real (el teléfono que nadie contesta). El outbound
(recordar citas) se agrega después, sobre la misma infraestructura.

---

## 2. Por qué esto saltea toda la telefonía

El punto 2 del encargo original ("la telefonía en Bolivia") era el que decidía si el
producto era vendible. La respuesta es que **la pregunta cambió**: WhatsApp Calling no usa
telefonía. No hay DID, no hay SIP trunk con Entel, no hay portabilidad, no hay gateway GSM,
no hay tarifa de terminación a móvil boliviano. El audio va por internet dentro de WhatsApp,
entre el número comercial de Onia y el WhatsApp del cliente.

Consecuencias prácticas:

- No se necesita número telefónico boliviano. El número de WhatsApp comercial ya existe.
- No aplica la tarifa de terminación a móvil (que es donde se muere la unit economics de
  un agente de voz en LatAm).
- No hay caller ID falso ni número extranjero: al cliente le entra una llamada de WhatsApp
  del negocio, con nombre y foto verificados.
- El cliente no paga nada. Meta: "Gratis y de acceso global para los clientes."

Fuente: [Llamadas a la API de la nube — Meta](https://developers.facebook.com/documentation/business-messaging/whatsapp/calling) (Updated: 26 jun 2026)

---

## 3. WhatsApp Business Calling API — lo verificado

Nota de método: `developers.facebook.com` está bloqueado a fetch directo. Todo lo de esta
sección se leyó con navegador sobre la documentación oficial, y **las tarifas se sacaron del
CSV oficial de Meta**, no de blogs.

### 3.1 Disponibilidad en Bolivia

| Tipo de llamada | Disponible en Bolivia | Fuente |
|---|---|---|
| Iniciada por el USUARIO (entrante) | **SÍ** — "disponibles en todas las ubicaciones en las que está disponible la API de la nube" | [Calling](https://developers.facebook.com/documentation/business-messaging/whatsapp/calling), 26-jun-2026 |
| Iniciada por la EMPRESA (saliente) | **SÍ** — excluidos solo EE.UU., Canadá, Egipto, Vietnam, Nigeria | idem |

Literal de Meta: *"El código de país del número de teléfono del negocio debe estar en esta
lista de países admitidos. El número de teléfono del consumidor puede ser de cualquier país
donde la API de la nube esté disponible."* → un número +591 califica.

### 3.2 Precio de llamadas — Bolivia = "Resto de Latinoamérica"

Mapeo confirmado en la tabla oficial de códigos de país de Meta, que lista literalmente:
*"Resto de Latinoamérica → Bolivia (591), Costa Rica, República Dominicana, Ecuador,
El Salvador, Guatemala, Haití, Honduras, Jamaica, Nicaragua, Panamá, Paraguay, Puerto Rico,
Uruguay, Venezuela"*.
Fuente: [Precios de WhatsApp Business — country calling codes](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing)

Rate card USD oficial, efectivo **1-jul-2026** (descargado del CSV de Meta):

| Minutos/mes | Tipo | USD/min | Bs/min |
|---|---|---|---|
| 0 – 50.000 | List rate | **0,0116** | 0,1352 |
| 50.001 – 250.000 | Tier | 0,0095 | 0,1108 |
| 250.001 – 1.000.000 | Tier | 0,0082 | 0,0956 |
| 1.000.001 – 2.500.000 | Tier | 0,0070 | 0,0816 |
| 2.500.001 – 5.000.000 | Tier | 0,0048 | 0,0560 |
| 5.000.001+ | Tier | 0,0047 | 0,0548 |

Reglas de facturación (mismas fuentes):
- **Llamadas iniciadas por el usuario: GRATIS**, sin importar la duración. Literal:
  *"Todas las llamadas iniciadas por el usuario son gratuitas."*
- Se cobra en **pulsos de 6 segundos**, y el pulso fraccionado cuenta completo. Meta da el
  ejemplo: una llamada de 56 s = 9,33 pulsos → se cobran 10.
- El precio depende del código de país del número **al que se llama**.
- **Grabación y transcripción de llamadas: gratis hoy.** Meta anuncia precio futuro, sin
  fecha, con aviso previo.

Fuente: [Precios de la API de llamadas](https://developers.facebook.com/documentation/business-messaging/whatsapp/calling/pricing) (Updated: 9 jul 2026)

### 3.3 Precio de mensajes (importa: el pedido de permiso se cobra como mensaje)

Rate card USD efectivo 1-jul-2026, fila "Rest of Latin America":

| Categoría | USD/msg | Bs/msg |
|---|---|---|
| Marketing | 0,0740 | 0,8628 |
| Utility (utilidad) | 0,0113 | 0,1318 |
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
"recorridos de aumento":

1. **Verificar tu negocio** (Business Verification), o
2. que tu socio verifique la empresa, o
3. enviar y entregar 2.000 mensajes fuera de la ventana de servicio a usuarios únicos en
   30 días con plantillas de calidad alta.

De ahí en adelante sube solo (10.000 → 100.000 → ilimitado).
Fuente: [Límites de mensajes](https://developers.facebook.com/documentation/business-messaging/whatsapp/messaging-limits) (Updated: 21 may 2026)

**Traducción: el portero no es volumen, es un trámite.** No hay que mandar 2.000 mensajes
si el negocio está verificado. Onia ya tiene la verificación de negocio en curso (estaba
frenada por SEPREC, según memoria interna del proyecto) y está tramitando Tech Provider.

**Carril de piloto sin portero:** los números de prueba públicos (PTN) y las cuentas sandbox
**no requieren** el límite de 2.000. Las cuentas sandbox son solo para Tech Providers — que
es justo lo que Onia está tramitando. Fuente: [Calling](https://developers.facebook.com/documentation/business-messaging/whatsapp/calling), sección "Cuentas de prueba y sandbox".

### 3.5 Permisos: por qué esto no sirve para vender en frío

- La empresa **no puede llamar sin permiso** del usuario. Solo el usuario lo otorga o
  revoca, en cualquier momento. La empresa no controla ese permiso.
- Permiso **temporal = 7 días calendario (168 h)**. Permanente = no caduca.
- Se consigue de tres formas: (a) mensaje o plantilla de solicitud de permiso; (b) **el
  usuario llama a la empresa → otorga permiso temporal automáticamente** (hay que activar
  el ajuste de devolución de llamada); (c) el usuario lo da desde el perfil de empresa.
- Cuentas de **producción: 1 solicitud de permiso por día y 2 por semana** por par
  empresa+usuario. (Sandbox: 25/día y 100/semana.)
- Máximo **100 llamadas conectadas cada 24 h** por número comercial.
- **2 llamadas consecutivas sin respuesta** → mensaje del sistema para reconsiderar el
  permiso. **4 consecutivas sin respuesta → permiso revocado automáticamente.**
- Hay restricciones activas por bajo índice de respuesta (desde 5-sep-2025) y por
  comentarios de usuarios (desde 27-ene-2026).

Fuentes: [Calling](https://developers.facebook.com/documentation/business-messaging/whatsapp/calling) y [Permisos de llamada de usuario](https://developers.facebook.com/documentation/business-messaging/whatsapp/calling/user-call-permissions)

Detalle que vale plata: **la opción (b) es la buena.** Si el cliente llama a la clínica, la
clínica queda habilitada a devolverle la llamada por 7 días sin gastar una plantilla.

### 3.6 Cómo se enchufa el agente de IA

Configuraciones de señalización y medios que soporta Meta:

| | Default al habilitar llamadas | SIP con WebRTC | SIP con medios SDES |
|---|---|---|---|
| Señalización | API Graph + Webhooks | SIP (activación explícita) | SIP (activación explícita) |
| Transporte | HTTPS | TLS | TLS |
| Medios | WebRTC (ICE + DTLS + SRTP) | WebRTC (ICE+DTLS+SRTP) | SDES SRTP |
| Códec de audio | OPUS | OPUS | OPUS |

- Códecs adicionales soportados: **PCMA y PCMU (G.711)**, agregados el 23-mar-2026.
- SIP exige: app en modo **"Activo"** (no Desarrollo) y **un servidor SIP de terceros**.
- Meta publicó **guía oficial de integración con Asterisk** el 29-sep-2025.

Fuentes: [Calling](https://developers.facebook.com/documentation/business-messaging/whatsapp/calling) y [Guía de configuración de SIP](https://developers.facebook.com/documentation/business-messaging/whatsapp/calling/sip)

**Implicancia:** cualquier motor que hable SIP sirve — Vapi, Retell, ElevenLabs, Pipecat, o
un Asterisk propio en el VPS que Onia ya opera. No hay dependencia de una plataforma
específica, y por lo tanto no hay riesgo de que un proveedor cambie el precio y mate el
producto.

### 3.7 Bonus: la llamada abre ventana de 24 h

Una llamada abre o renueva la ventana de atención al cliente de 24 h: cuando el usuario
llama (la aceptes o no) y cuando el usuario acepta tu llamada. O sea que **una llamada
habilita 24 h de mensajería sin costo de plantilla**.
Fuente: [Precios de la API de llamadas](https://developers.facebook.com/documentation/business-messaging/whatsapp/calling/pricing)

### 3.8 Contraste: la vía Twilio como BSP

Twilio documenta WhatsApp Business Calling con requisitos más duros que los de Meta
directo: exige haber alcanzado *"at least 2,000 business-initiated conversations in a
rolling 24-hour period"* y Business Verification, y sin eso *"you will not be able to save
the Voice Endpoint Configuration"*. Twilio no publica precio por minuto en esa página.
Fuente: [WhatsApp Business Calling — Twilio](https://www.twilio.com/docs/voice/whatsapp-business-calling) (Last modified: 2026-07-24)

→ Conviene ir **directo a Meta Cloud API**, que es donde Onia ya está, y no meter un BSP
que agrega requisito y margen.

---

## 4. Costo real por llamada de 2 minutos

Tipo de cambio: **11,66 Bs/USD** (BCB, 13-ago-2026, dato provisto por el coordinador).

Aritmética del transporte (la única capa con precio verificado):

**Escenario A — llamada ENTRANTE (el cliente llama a la clínica, contesta la IA)**

| Concepto | Cuenta | USD | Bs |
|---|---|---|---|
| Transporte WhatsApp | usuario inicia = gratis | 0,0000 | 0,00 |
| Motor de IA (STT+LLM+TTS) | ver NO VERIFICADO | ? | ? |
| **Transporte total** | | **0,0000** | **0,00** |

**Escenario B — llamada SALIENTE de 2 min (recordatorio de cita)**

| Concepto | Cuenta | USD | Bs |
|---|---|---|---|
| Minutos | 2,00 min × 0,0116 | 0,0232 | 0,27 |
| Plantilla de permiso (utility) | 1 × 0,0113 | 0,0113 | 0,13 |
| Motor de IA | ver NO VERIFICADO | ? | ? |
| **Transporte total** | | **0,0345** | **0,40** |

Si el permiso ya está dado (el cliente llamó antes, o dio permiso permanente), la plantilla
no se paga y la llamada saliente de 2 min queda en **USD 0,0232 = Bs 0,27**.

**A escala de un cliente real — 100 llamadas salientes de 2 min al mes:**

| Concepto | Cuenta | USD | Bs |
|---|---|---|---|
| 200 minutos | 200 × 0,0116 | 2,32 | 27,05 |
| 100 plantillas de permiso | 100 × 0,0113 | 1,13 | 13,18 |
| **Transporte total/mes** | | **3,45** | **40,23** |

Nota sobre el pulso de 6 s: Meta redondea hacia arriba al pulso. Una llamada de 2 min justos
son 20 pulsos exactos, así que no hay pérdida en este cálculo. En llamadas cortas y muchas,
el redondeo sí importa (una llamada de 8 s se cobra como 12 s).

**Lo que esto significa comercialmente:** el transporte es tan barato que **no es el costo
del producto**. El costo del producto es el motor de IA por minuto (no verificado, ver §7) y
el trabajo de Onia. Un plan de Bs 300-500/mes por un recepcionista de voz deja margen aun
si el motor de IA costara 20 veces el transporte. Esa es la conclusión económica y no
depende de las cifras que me faltan.

---

## 5. Cómo probarlo con UN cliente — el camino más corto

Contexto de partida (dato del coordinador, verificado por Onia hoy, no por mí): Onia ya es
dueña del número **+591 75414930** en Cloud API, calidad **GREEN**, y está tramitando ser
Tech Provider ante Meta.

1. **Terminar Business Verification.** Es el único portero real. Desbloquea el tier de 2.000
   y con eso la Calling API. Ya está en trámite.
2. **Activar llamadas en el número propio de Onia y usarlo como conejillo de indias.**
   Entrante primero: cero costo de transporte, cero permisos.
3. **Enchufar el motor por SIP.** Onia ya corre un VPS; Asterisk tiene guía oficial de Meta.
   La alternativa es apuntar el SIP a Vapi/Retell/ElevenLabs sin cambiar nada del diseño.
4. **Piloto con la clínica dental, solo entrante.** El agente atiende cuando nadie atiende:
   horario, dirección, precios, y agenda. Se mide una sola cosa: cuántas llamadas que antes
   se perdían ahora terminan en cita.
5. **Recién después, el saliente.** Recordatorio de cita a pacientes que ya llamaron (por
   §3.5b tienen permiso temporal de 7 días sin gastar plantilla).

Por qué en este orden: los pasos 2-4 no gastan casi nada, no requieren permisos de usuario,
no se topan con el límite de 100 llamadas/24 h, y no se exponen a que Meta revoque permisos
por baja tasa de respuesta. Todo el riesgo regulatorio y de reputación vive en el outbound,
y el outbound se agrega cuando el producto ya demostró que funciona.

---

## 6. El número boliviano (+591) para telefonía tradicional

**No lo verifiqué.** No tengo fuente para afirmar ni negar que Twilio u otro CPaaS venda
DIDs bolivianos, ni para las tarifas de terminación a móvil boliviano, ni para SIP trunks de
Entel/Tigo/Viva, ni para la normativa ATT. Está todo listado en §7.

Lo que sí puedo decir con base: **para el producto de §1 esta pregunta dejó de ser
bloqueante.** WhatsApp Calling no toca la red telefónica. Si más adelante se quiere un
agente que atienda el teléfono fijo de la clínica, ahí sí hay que resolver esto, y hasta que
alguien lo verifique hay que asumir que es el camino difícil, no el fácil.

---

## 7. NO VERIFICADO

Todo lo de abajo quedó sin fuente. No lo uses para decidir ni para cotizar.

**Telefonía Bolivia (punto 2 del encargo — sin verificar por completo)**
- Si Twilio vende números telefónicos bolivianos (+591). No confirmado ni desmentido.
- Tarifa de Twilio para llamar a Bolivia (fijo y móvil Entel/Tigo/Viva) por minuto.
- Si Telnyx, Plivo, Vonage, Infobip, Sinch, Bandwidth, Zadarma, DIDWW, DIDlogic, Voxbeam
  o IDT venden DIDs bolivianos.
- Si Entel, Tigo o Viva venden troncal SIP a empresas, y a qué precio.
- Si un gateway GSM (GoIP, Yeastar TG, Dinstar) con SIM boliviana es legal y practicable.
- Si el SIM-boxing / bypass está prohibido en Bolivia y con qué norma.
- Si existe portabilidad de un número móvil boliviano hacia un proveedor VoIP.
- Proveedores locales de PBX en la nube / SIP en Santa Cruz (Cotas, Comteco, AXS) y precios.

**Regulación (punto 2 del encargo)**
- Si la ATT exige licencia para originar o terminar tráfico de voz.
- Si hay norma boliviana sobre llamadas automatizadas, robocalls o telemarketing.
- Si hay norma sobre grabación de llamadas y consentimiento en Bolivia.
- Estado de la Ley de Protección de Datos Personales en Bolivia a 2026.
- Si existe obligación de declarar que el interlocutor es una máquina/IA.

**Plataformas (punto 1 del encargo)**
- Precio real por minuto de Vapi, Retell AI, Bland AI, ElevenLabs Agents y Synthflow.
- Precio por minuto de OpenAI Realtime API y Gemini Live API.
- Latencia declarada de cada una.
- Calidad real en español latinoamericano de cada una, y qué STT/TTS usan.
- Si tienen plan de agencia / revendedor / white-label y a qué costo.
- Si aceptan clientes y medios de pago desde Bolivia.
- **Consecuencia:** la línea "motor de IA" del §4 está vacía. El costo total por llamada
  NO está cerrado. Lo único cerrado es el transporte.

**Casos prácticos y quejas (punto 4 del encargo)**
- Tasas de éxito documentadas en clínicas, comercios y restaurantes.
- Reducción de inasistencias (no-show) reportada.
- Modos de falla documentados y quejas de usuarios finales.
- Datos de encuestas sobre tolerancia del consumidor a agentes de voz IA.
- Calidad reportada en español vs inglés.
- Novedades regulatorias 2025-2026 (FCC sobre robocalls con IA, obligación de transparencia
  del EU AI Act, equivalentes en LatAm).

**Contexto de Onia**
- El número +591 75414930, su calidad GREEN y el trámite de Tech Provider me los pasó el
  coordinador; no los verifiqué yo contra la Graph API.

---

## Fuentes primarias usadas

Todas leídas el 2026-08-15 con navegador (el dominio está bloqueado a fetch directo). Las
tarifas provienen de los CSV oficiales enlazados desde las páginas de precios de Meta, no de
terceros.

| Documento | URL | Fecha del documento |
|---|---|---|
| Llamadas a la API de la nube | https://developers.facebook.com/documentation/business-messaging/whatsapp/calling | Updated 26-jun-2026 |
| Precios de la API de llamadas + CSV de tarifas USD | https://developers.facebook.com/documentation/business-messaging/whatsapp/calling/pricing | Updated 9-jul-2026; rate card efectiva 1-jul-2026 |
| Precios de WhatsApp Business + CSV de mensajes + mapeo de códigos de país | https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing | rate card efectiva 1-jul-2026 |
| Límites de mensajes | https://developers.facebook.com/documentation/business-messaging/whatsapp/messaging-limits | Updated 21-may-2026 |
| Permisos de llamada de usuario | https://developers.facebook.com/documentation/business-messaging/whatsapp/calling/user-call-permissions | leído 15-ago-2026 |
| Guía de configuración de SIP | https://developers.facebook.com/documentation/business-messaging/whatsapp/calling/sip | leído 15-ago-2026 |
| WhatsApp Business Calling (Twilio, como contraste BSP) | https://www.twilio.com/docs/voice/whatsapp-business-calling | Last modified 24-jul-2026 |
