# Onia Voz — Contestar y hacer llamadas de WhatsApp con IA (arquitectura + producto)

> Research 2026-08-02 (workflow 4 agentes, docs oficiales de Meta + benchmarks
> con fuentes). Objetivo: el bot CONTESTA llamadas de WhatsApp, LLAMA con
> permiso del usuario, y esto se vende como add-on del catálogo de chatbots.

## 0. Los dos hallazgos que cambian el juego

1. **Recibir llamadas de WhatsApp es GRATIS e ilimitado** (doc oficial: "All
   user-initiated calls are free"), y **Bolivia está soportada** en ambas
   direcciones (no aparece en ninguna lista de exclusión; solo US/CA/EG/VN/NG
   no pueden originar). En un país donde Twilio ni vende números, **WhatsApp
   ES la telefonía** — el problema #1 de todo competidor gringo ("telefonía
   local") a nosotros no nos existe.
2. **Pipecat (open source, BSD) tiene soporte OFICIAL de WhatsApp Calling** —
   transporte dedicado + ejemplo listo para clonar (`pipecat-examples/
   whatsapp`). No hay que inventar el puente WebRTC: está mantenido por Daily.

## 1. Cómo funciona técnicamente

### Contestar (user-initiated, GRATIS)

```
Cliente aprieta 📞 en el chat de WhatsApp del negocio
  → webhook "calls" (event=connect + SDP offer)
  → nuestro backend responde pre_accept → accept (SDP answer, <30 s)
  → sesión WebRTC directa (OPUS 48 kHz, cifrada SRTP)
  → Pipecat: VAD Silero → STT streaming → LLM → TTS streaming
  → con barge-in (el cliente interrumpe y el bot se calla)
```

- Habilitación: `POST /<PHONE_NUMBER_ID>/settings` con `calling.status=
  ENABLED` + `callback_permission_status=ENABLED`. **Requisito duro: tier de
  mensajería ≥2.000/día** — nuestro portfolio verificado da 2.000 de piso,
  pero VERIFICAR el tier real del número el día del alta (el número de test
  está exento → F0 arranca ya).
- El webhook `calls` llega a la misma app de Meta que `messages` → hace falta
  un **router de webhooks** (ya tenemos el webhook-server del bot en el VPS:
  messages → Chatwoot, calls → backend de voz). Alternativa: vía SIP
  (wa.meta.vc:5061 TLS) si algún día queremos Asterisk/FreeSWITCH.
- Si el bot no contesta: WhatsApp ofrece **voicemail** nativo (el cliente
  deja audio en el chat → nuestro bot ya transcribe notas de voz → nunca se
  pierde una llamada, ni caído).

### Llamar (business-initiated, se paga por minuto)

```
1. Pedir permiso: mensaje interactivo call_permission_request
   (gratis dentro de la ventana de 24 h; plantilla si está fría)
2. Usuario acepta → permiso 7 días (o permanente)
   BONUS: si el cliente nos llamó primero, permiso automático 7 días
3. POST /calls con action=connect → suena su WhatsApp → mismo pipeline
```

- Límites de pedido de permiso: 1/24 h y 2/7 días por usuario (se resetea con
  cada llamada conectada). Tope: 100 llamadas conectadas/24 h.
- Precio: por minuto en pulsos de 6 s, tarifa por país del consumidor; el
  monto exacto para Bolivia está en el rate card logueado de Meta —
  **confirmar antes de cotizar a clientes**. Referencia general del research
  previo: ~USD 0,01/min. Requiere método de pago en la WABA.
- 4 llamadas salientes no contestadas seguidas = permiso revocado automático:
  las salientes se usan con criterio (confirmar cita, no spam).

## 2. El stack (todo en el VPS, $0 de software)

| Pieza | Elección | Estado |
|---|---|---|
| Orquestador | **Pipecat** (BSD, soporte WhatsApp oficial) | a instalar (Python) |
| VAD / turnos | Silero VAD + smart-turn (incluidos en Pipecat, CPU) | incluido |
| STT | **Speaches / faster-whisper-small** (ya corre en :3108; regla: JAMÁS distil) | ✔ vivo |
| LLM | LiteLLM → gpt-4o-mini streaming (el mismo del bot) | ✔ vivo |
| TTS demo | **Piper es_MX-claude-high** (local, gratis, RTF ~0.2 CPU) | a instalar |
| TTS producto | Azure **es-BO-SofiaNeural** (~$0.014/min) o gpt-4o-mini-tts (~$0.015/min) — GASTO: pedir OK primero | gateado |
| Cerebro | el MISMO motor del bot (calificación + Cal.com + handoff), variante voz | ✔ existe |
| Registro | transcripción de la llamada → conversación en Chatwoot + CRM | diseño |

**Honestidad sobre el VPS (4 cores, 16 GB, sin GPU):** la estimación es 2–3
llamadas simultáneas con STT+TTS local; 1–2 cómodas con todo el stack actual
corriendo. Latencia objetivo <800 ms voz-a-voz; el STT local en CPU puede
empujarla a ~1–1,5 s ("se siente bot pero funciona"). **El benchmark real en
el VPS es obligatorio antes de prometer nada** — los números vienen de CPUs
distintos. Límite duro de concurrencia en el orquestador + cola.

Descartados con motivo: LiveKit (conector WhatsApp en beta, exige servidor
propio pesado), Vocode (muerto desde nov-2024), Bolna (sin WhatsApp), XTTS
(RTF>1 en CPU + licencia no comercial), Kokoro (español de segunda, bug
conocido).

## 2.bis Flujo de la llamada (definido por Sergio, 2026-08-02)

```
Entra llamada de WhatsApp al número del negocio
  → contesta el bot: saluda, dice que es un bot, escucha qué necesita
  → RESUELVE lo que pueda (precios, qué hace el sistema, cómo funciona)
  → si el prospecto quiere hablar con una persona:
        NO se transfiere en vivo → se AGENDA la reunión (Cal.com)
  → si no contesta el bot (caído/ocupado): voicemail de WhatsApp
        → audio al chat → el bot ya lo transcribe → nada se pierde
```

**Por qué agendar en vez de transferir** (razonamiento de Sergio, correcto):
el que acepta esperar y reservar un horario ya demostró intención real; el
preguntón se cae solo. Bonus técnico: elimina la pieza más difícil de
construir (transferencia en vivo de una llamada WebRTC a un humano), que
además Chatwoot no soporta — su app no maneja voz.

**Matiz que aplica (recomendación, pendiente OK de Sergio):** el filtro es
para el curioso, NO para el que viene a comprar. Válvula de escape por SEÑAL,
no por regla: si en la llamada aparece intención alta ("quiero contratar",
"cuánto es y cómo pago", "me recomendó X") o es un CLIENTE con un problema,
el bot igual agenda pero dispara aviso inmediato a Sergio (el canal de
handoff ya existe: `notifyCount`/`notifyReasons`) para que devuelva la
llamada en minutos si quiere. Hacer esperar a todos por igual convierte el
filtro en fuga: en ventas la velocidad de respuesta es de los factores más
determinantes.

**Regla de diseño: filtro ≠ muro.** El bot no debe "resistir" hasta que el
prospecto insista en hablar con un humano — eso espanta también a los buenos.
Califica rápido y OFRECE el horario temprano. El objetivo no es evitar
reuniones: es que las que ocurran valgan la pena.

## 3. Fases

- **F0 — Prueba con el número de test (exento de tier, sin gasto):** clonar
  `pipecat-examples/whatsapp`, webhook con dominio propio, pipeline Speaches
  + Piper + gpt-4o-mini. Entregable: llamada de WhatsApp real contestada por
  la IA + medición de latencia con 1/2/3 llamadas. ~1 día.
- **F1 — Número real (cuando esté el alta del chip):** router de webhooks
  (messages→Chatwoot, calls→voz), cerebro del bot en modo voz (guion corto:
  saludo → qué necesita → agendar demo con Cal.com → o derivar a Sergio),
  transcripción a Chatwoot. Gate: tier ≥2.000 verificado.
- **F2 — Salientes:** plantilla `call_permission_request` aprobada +
  confirmación de citas por llamada (el caso dental). Gate: método de pago +
  rate card Bolivia confirmado.
- **F3 — Producto:** empaque comercial, demo grabada, entrada en el catálogo
  de chatbots como add-on.

## 4. Producto — "Onia Voz" (add-on sobre el chatbot)

**Nuestra ventaja de costo es brutal:** Vapi/Retell cobran USD 0,09–0,15/min
all-in (Bs 1–1,7/min). Nuestro stack: STT local gratis + LLM centavos + TTS
cloud ~Bs 0,17/min + infra ya paga → **costo propio ~Bs 0,2–0,3/min**, y las
entrantes casi gratis. Margen 80%+ donde los revendedores de Vapi tienen 50%.

Propuesta de precios (DECIDE SERGIO — referencia: pymes LatAm ya pagan USD
90–300/mes por "recepcionista IA"; agencias cobran setup $297–997 + mensual
$297–497):

| Add-on | Setup | Mensual | Incluye |
|---|---|---|---|
| **Voz Entrante** — el bot contesta las llamadas de WhatsApp del negocio | Bs 990 | Bs 490 | 300 min entrantes, transcripción al CRM, voicemail |
| **Voz Completa** — contesta + llama a confirmar citas | Bs 1.500 | Bs 790 | 500 min + confirmación de citas + reporte de no-shows |
| Overage | — | Bs 2,5/min | — |

Reglas: precio en Bs con **cláusula de ajuste cambiario** (los costos son
100% USD y el boliviano flota); minutos incluidos por DEBAJO del uso típico.

**Pitch por rubro (con los números del research):**
- **Dental (liderar acá — encaja DentalGest):** "confirmación de citas que
  baja el no-show 40–60%" — pacientes que confirman faltan 3–5% vs 25–35%
  los que no responden. Se vende el resultado, no el robot.
- **Universal:** "el 62% de las llamadas a negocios chicos no se contesta y
  el 85% de esos clientes no vuelve a llamar" — el bot atiende 24/7 la
  llamada de WhatsApp que hoy se pierde.
- Advertencia comercial: estos números son de vendors del rubro — sirven de
  argumento, NO se prometen como garantía.

## 4.bis Telefonía real en Bolivia — por qué WhatsApp es el foso, no la limitación

> Research 2026-08-03 con fuentes oficiales (Entel, Tigo, ATT, Código Penal).
> Pregunta: ¿podemos vender "recepcionista IA" que conteste el TELÉFONO del
> negocio, no solo su WhatsApp?

**Lo que confirma el research:** montar telefonía real en Bolivia es caro,
lento y con letra chica; WhatsApp Calling esquiva TODO eso.

| Vía | Estado real |
|---|---|
| Número +591 de Twilio / Plivo | **No existe.** Bolivia no está en su cobertura |
| DID +591-5 de Zadarma / Telnyx / DIDWW | Sí se vende (Zadarma ~USD 57/mes, 2 canales). **RIESGO ABIERTO:** el rango +591-5 es "nacional no geográfico" — falta verificar que un celular Entel/Tigo lo marque y **a qué tarifa le cobra al que llama**. Si le sale caro al cliente final, el producto muere |
| Troncal SIP Entel | **Existe con precio público:** Bs 200/mes (16 canales) + Bs 250 instalación. **Pero se entrega sobre VPN/Metro Ethernet de Entel** → nuestro VPS de afuera probablemente NO puede registrarse directo; haría falta una cajita (FreePBX) **en el local del cliente**. Además hay tasa mínima de consumo (Bs 700–1.500 según servicio asociado) |
| Troncal SIP Tigo | Existe (fibra propia), precio no público. Pide NIT, CI del representante legal y poder |
| Desvío de llamadas | Funciona, **pero el negocio paga cada llamada desviada como si él la hiciera**. A número boliviano: viable. A número internacional: larga distancia = inviable |
| Portabilidad a un SIP extranjero | **Imposible.** Solo entre operadores bolivianos licenciados |

**Regulación (ATT):** no hay norma que prohíba VoIP ni licencia específica
para un proveedor de software. La regla de oro que nos mantiene fuera del
perímetro regulado: **la troncal y el número SIEMPRE a nombre del cliente,
con su NIT; nosotros nunca revendemos minutos.** Lo que la ATT sí persigue es
el *bypass* de tráfico internacional — nada que ver con lo nuestro, pero la
línea no se cruza jamás. Si algún día vendemos la vía SIP, corresponde
consulta escrita a la ATT (probable que no requiera licencia, no confirmado).

**Grabación de llamadas — hay riesgo penal real:** Bolivia **no tiene ley de
protección de datos vigente** (el anteproyecto de AGETIC sigue en la
Asamblea), pero el **Código Penal art. 301** castiga con 3 meses a 1 año
grabar palabras de otro sin su consentimiento si puede causar daño. Por eso,
obligatorio en el producto: locución al inicio avisando que es un asistente
automatizado y que se transcribe/graba, consentimiento registrado con
timestamp, y contrato donde **el negocio es responsable del dato y Onia es
encargado del tratamiento**. Diseñar con estándar tipo GDPR desde ahora: el
anteproyecto ya alcanza a servidores fuera de Bolivia.

### Conclusión estratégica

**WhatsApp Calling API no es el plan B de la telefonía: es la ventaja.**
Recibir es gratis, no necesita número ni troncal ni cajita ni permiso de la
ATT, Bolivia está soportada, y es el MISMO número que ya atiende el chat. Los
competidores internacionales (Vapi, Retell, Smith.ai) no pueden entrar a
Bolivia sin resolver la telefonía local; nosotros la salteamos entera.

**Roadmap del producto en dos escalones:**
- **Escalón 1 (el que vendemos):** voz sobre WhatsApp. Cero infraestructura,
  cero trámite, margen alto. En Bolivia cubre la mayoría de las llamadas
  reales de una pyme.
- **Escalón 2 (ticket alto, más adelante):** el teléfono real del negocio, vía
  troncal Entel/Tigo **a nombre del cliente** + FreePBX en su local + puente a
  nuestro agente. Es negocio de instalación por cliente: más caro de operar,
  se cotiza aparte, y solo cuando haya demanda que lo justifique.

**Hueco de mercado detectado:** los integradores bolivianos venden PBX
(hardware + instalación); **nadie vende recepcionista IA gestionada.**

**Validaciones pendientes antes de prometer el escalón 2:** (a) probar con un
DID de USD 57 si el +591-5 se marca y factura como nacional desde Entel y
Tigo — esa sola prueba decide si la vía barata existe; (b) preguntar a Entel
Empresas si la troncal admite registro SIP por internet o exige Metro
Ethernet; (c) consulta escrita a la ATT.

## 5. Gates y pendientes

1. F0 puede arrancar YA (número de test, sin gasto, sin permisos nuevos).
2. TTS cloud (Azure/OpenAI) = plataforma paga → **OK explícito de Sergio**
   antes de crear cuenta (regla gasto-plataformas). Piper local no paga nada.
3. Rate card Bolivia (precio/min saliente) → confirmar logueado en Meta antes
   de cotizar F2 a clientes.
4. Grabación de llamadas: la API lo permite técnicamente; revisar política de
   Meta + consentimiento (normativa boliviana) antes de grabar — la
   transcripción con aviso es el camino seguro.
5. Precios del add-on: propuesta arriba, la ratifica Sergio (bloqueo S1).
6. Al validar el producto: agregar "Onia Voz" al catálogo
   `ONIA_CATALOGO_TIPOS_CHATBOT_20260731.md` como add-on de T2/T3.
