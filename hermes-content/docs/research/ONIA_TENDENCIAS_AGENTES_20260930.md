> **Foto de investigación del 2026-09-30 (carril Mercado, sesión «Análisis de mercado Onia Platform»).** No es fuente de verdad: lo vigente está en `ONIA_ADQUISICION_Y_PAUTA.md`, `ONIA_CLIENTE_IDEAL.md` y `ONIA_ESTRATEGIA_DE_EMPRESA.md` §14. Los avisos de este texto sobre "cambios sin commitear" en otros docs se refieren al árbol durante la sesión y ya quedaron resueltos en esos docs.

# Informe B — Agentes que hablan con agentes: qué es real, qué hace la competencia y qué le conviene a Onia

**Para Sergio Urcullo · investigación de solo lectura · 2026-09-30**
Pregunta de origen: *"ahora los agentes de IA no van a hablar entre personas, van a hablar con agentes… deberíamos aplicarlas a la Onia Platform"*.
Filtro de decisión: `ONIA_ESTRATEGIA_DE_EMPRESA.md` §10 (test de tres preguntas), §12 (v1.0 → v2.0) y §14 (el MCP **del dueño** ya se evaluó y falla la pregunta 1; acá se evalúa otra cosa: **el agente del PACIENTE hablando con el agente de la CLÍNICA**).

---

## 0. Veredicto en una pantalla

1. **La idea es correcta, pero en 2026 pasa en EE.UU. y a través de agregadores, no clínica por clínica.** Gemini reserva médicos con Zocdoc (EE.UU.), Google llama a negocios por el usuario (EE.UU.), Alexa+ reserva con Vagaro (EE.UU.). **En Bolivia hoy no existe ningún canal por el que el asistente de un paciente reserve en una clínica**: Reserve with Google no opera en Bolivia, ChatGPT retiró su checkout propio en marzo-2026 y el registro oficial de MCP tiene **0 servidores de negocios bolivianos** (medido hoy).
2. **En Bolivia el "agente del paciente" va a llegar por WhatsApp (y después por teléfono), y Meta controla los dos lados de esa conversación.** Por eso, para Onia, "estar listo para agentes" significa: **que el agente de la clínica (el bot de Onia conectado a la agenda y a la ficha) conteste bien por WhatsApp**. No un servidor MCP ni un A2A.
3. **La amenaza real es Meta, no OpenAI ni Google.** Desde el 3-jun-2026 Meta regala un agente de IA dentro de la app de WhatsApp Business que contesta y agenda (conectado a Google Calendar), y **desde mañana, 1-oct-2026, cada respuesta de un bot por la API (como el de Onia) se cobra por mensaje**. Eso convierte en commodity el "bot que responde preguntas". **No alcanza al núcleo:** el agente de Meta no conoce la ficha, el tratamiento pendiente ni la deuda, y su versión API **excluye el rubro salud**.
4. **Qué hacer AHORA (sirve a la v1.0):** la **reactivación del paciente con tratamiento a medias**, de punta a punta. Es el dolor #1 del cliente ideal, la competencia regional ya lo anuncia (Dentalink promete recall y "venta de tratamientos" —sin confirmar, ver §4—, AgendaPro recupera cancelaciones), y **el agente Recall de hoy no lo detecta**: busca "última visita completada hace ≥180 días sin cita futura", que es el recall de rutina, no el tratamiento abandonado.
5. **Mantenimiento que no es feature pero que protege lo vendido:** el cobro del 1-oct (ya anotado en el repo) y **BSUID/usernames de WhatsApp** (no aparece en ningún doc del repo): un paciente con username puede llegar **sin teléfono** en el webhook y el bot no lo vincula a su ficha.
6. **Anotar para después:** datos estructurados y botón de reserva en la agenda pública (medio día, v1.x) · que el bot reserve solo contra la agenda real (v1.x) · recepcionista de voz entrante por WhatsApp (v2.0, ya diseñada en el repo) · exponer agendas a asistentes externos **como UNA integración de plataforma, estilo Zocdoc** (v2.0, con disparador).
7. **Ignorar:** llms.txt, A2A, pagos agénticos (AP2, ACP, UCP, Visa, Mastercard), NLWeb, Siri y Alexa+. No hay adopción en Bolivia y nadie del cliente ideal lo pide.

---

## 1. Cómo se investigó y con qué límites

| Marca | Significa |
|---|---|
| **[P]** | Fuente primaria **abierta y leída en esta sesión** (documentación de Meta vía su MCP oficial de desarrolladores; blog y registro oficiales de MCP) |
| **[P·ext]** | URL de fuente primaria, pero el texto sale del **extracto del buscador**: la página no se pudo abrir (proxy). Verificar antes de ponerlo en material de cliente |
| **[S]** | Secundaria: prensa, blogs, BSP de Meta, directorios |
| **[I]** | Inferencia mía |
| **[R]** | Dato del repo, ya verificado por otra sesión (se cita el doc) |
| ⏳ | Dato de más de 12 meses (anterior al 2025-09-30) |

⚠️ **Límites de esta sesión, dichos de frente:** el proxy de salida bloqueó casi todos los dominios primarios (openai.com, blog.google, linuxfoundation.org, whatsappbusiness.com, techcrunch, fresha, mindbody…), y el cupo de búsquedas web de la sesión (200) **se agotó a mitad de la investigación**. Meta se verificó igual en fuente primaria porque su documentación se lee por el MCP oficial de Meta, que no pasa por ese proxy.

---

## 2. Protocolos y plataformas agente-a-agente y de comercio agéntico

| Qué | Qué es | Fecha y estado | Quién lo usa | LatAm · Bolivia · español |
|---|---|---|---|---|
| **Google A2A** | Protocolo abierto para que agentes de empresas distintas se descubran (Agent Card) y se deleguen tareas | Anunciado abr-2025 ⏳, donado a la Linux Foundation jun-2025 ⏳. **v1.0, primera versión estable: 12-mar-2026 [S]**. 9-abr-2026: +150 organizaciones, integrado en plataformas de Google, Microsoft y AWS, uso en producción [P·ext] | Enterprise: AWS, Cisco, Google, Microsoft, Salesforce, SAP, ServiceNow [S] | No encontré ningún uso de consumo, de salud ni de reservas en LatAm. Es B2B de empresa grande [I] |
| **Anthropic MCP** | Estándar para conectar asistentes (Claude, ChatGPT, Gemini, Copilot…) a herramientas y datos | Donado a la **Agentic AI Foundation** (Linux Foundation) el 9-dic-2025; cofundadores Anthropic, Block y OpenAI; 97 M descargas/mes y 10.000 servidores activos a esa fecha [P]. **Spec 2026-07-28**: núcleo sin estado, pedidos multi-vuelta, ruteo por headers, autorización endurecida, marco de extensiones; ~500 M descargas/mes [P]. **MCP Apps** (UI dentro del chat), 26-ene-2026: primera extensión oficial, en Claude, ChatGPT, VS Code y Goose [P]. **Registry** oficial: preview 8-sep-2025 ⏳; no encontré anuncio de disponibilidad general [P] | Todos los asistentes grandes [P] | **Medido hoy en el registry:** "booking" → 50 servidores (negocios chicos de Europa y Asia, un optometrista de Vancouver); "dental" → 22 (EE.UU., Canadá, UK, India); "clinic" → 1 en español (clínica online de salud mental de Chile); **negocios bolivianos: 0** (buscar "bolivia" devuelve 1 servidor, un mercado de predicciones cripto sin relación); "whatsapp" → 50, ninguno reserva citas [P] |
| **OpenAI ACP + Instant Checkout** | Protocolo de comercio agéntico con Stripe; compra dentro de ChatGPT | Lanzado 29-sep-2025 ⏳ en EE.UU. [P·ext]. **Retirado o despriorizado en marzo-2026**: ~30 comercios de Shopify vivos a feb-2026; el checkout vuelve al sitio del comercio y ACP sigue como feed de productos [S] | Retail de EE.UU. (Walmart, Target, Etsy…) [S] | La expansión internacional prevista para 2026 no ocurrió [S] |
| **Apps en ChatGPT / ChatGPT Health** | Apps de terceros dentro del chat; espacio de salud con historias clínicas | Las apps corren sobre MCP Apps [P]. ChatGPT Health, ene-2026: conecta historias clínicas y apps de bienestar; integraciones médicas solo en EE.UU.; **no reserva citas** [S] | Booking.com, Canva, Spotify… [S] | No encontré apps de reservas de salud ni dentales en LatAm [no verificado a fondo] |
| **Google AP2 + UCP** | AP2: autorización de pagos hechos por agentes. UCP: comercio agéntico abierto (con Shopify), compone con AP2, MCP y A2A | AP2 sept-2025 ⏳, v0.2.0 abr-2026 [S]. UCP anunciado 11-ene-2026 en NRF [S] | Retail | UCP: EE.UU. primero, luego Canadá, Australia y UK; **sin fecha para LatAm** [S] |
| **Google — reservas agénticas en AI Mode y Gemini** | El buscador o Gemini reservan o llaman al negocio por el usuario | Nov-2025: entradas y citas de belleza y bienestar (partner Booksy), Search Labs EE.UU. [S]. I/O 19-may-2026: **Google llama a negocios por vos** (reparaciones, belleza, mascotas), EE.UU., verano 2026 [S]. 12-ago-2026: **Zocdoc, primera app de citas de salud dentro de Gemini** (EE.UU., mayores de 18, 200 mil prestadores) [P·ext]. 27-ago-2026: hoteles [S]. 24-sep-2026: prueba de Gemini haciendo llamadas, usuarios de Pixel en EE.UU. [S] | Booksy, OpenTable, Resy, Zocdoc | Todo EE.UU. **Reserve with Google**, la vía clásica, no lista a Bolivia entre los países soportados [S] |
| **Visa / Mastercard** | Pagos iniciados por agentes con tokens de la red | Mastercard Agent Pay LatAm dic-2025; transacciones vivas en mar-2026 con BAC, Banco Nación (AR), Falabella, Galicia, Itaú, Ripley, Bancolombia, Banamex, Santander, ueno (PY)… [P·ext/S]. Visa Intelligent Commerce Connect abr-2026 [S] | Bancos y procesadores | **Ningún banco boliviano en la lista** [S]. Las clínicas cobran en efectivo o QR [R] |
| **Microsoft NLWeb** | Convierte un sitio en interfaz conversacional; cada instancia es un servidor MCP | May-2025 ⏳ [P·ext]. Sin conteo público de despliegues; incidente de seguridad parchado sin CVE [S] | Editores (Allrecipes, Eventbrite) [S] | Nada en LatAm [I] |
| **Apple / Siri** | Siri opera apps vía App Intents; agente de terceros como asistente por defecto | WWDC jun-2026 (iOS 27) [S, blogs de baja calidad] | Apps nativas iOS | No aplica: Onia es web, sin app iOS [I] |
| **Amazon Alexa+** | Asistente que reserva con partners | Vagaro y Thumbtack ya reservan; en 2026 se suman Expedia, Yelp, Angi y Square (citas de belleza y bienestar) [P·ext]. México early access 22-ene-2026, España 23-abr-2026 [S] | EE.UU. | Bolivia no. +10 países en 2027 [S] |
| **Zocdoc Care Access Network** (la señal más útil) | El prestador integra UNA vez y queda reservable en Gemini, Amazon Health AI, Yelp, Healthgrades y buscadores | 22-sep-2026; gratis para el prestador, cobra sólo por paciente nuevo [P·ext/S] | Salud, EE.UU. | — |

**Lectura [I]:** la reserva hecha por agentes está llegando **a través de agregadores y plataformas** (Zocdoc, Booksy, OpenTable, Vagaro) que integran una sola vez y exponen miles de agendas; ninguna clínica publica su propio protocolo. **Si Onia algún día expone agendas a asistentes externos, tiene que ser así: una integración de plataforma para todas sus clínicas.** Es lo único que haría pasar la pregunta 3 del test ("sin horas por cliente").

---

## 3. Meta

### 3.1 Meta Business Agent: son dos productos distintos

| | **Agente gratis** (app WhatsApp Business, Instagram, Messenger, Business Suite) | **Meta Business Agent Platform** (API / Cloud) |
|---|---|---|
| Lanzamiento | **3-jun-2026, global** (Conversations 2026, tras ~2 años de prueba en India y México) [S; P·ext about.fb.com] | **1-jul-2026** [P] |
| Qué hace | Contesta con el conocimiento del negocio, recomienda, **agenda citas conectando Google Calendar**, califica leads, deriva a una persona [S] | Lo mismo, más **conectores a las APIs propias** (reservar, consultar), eventos del negocio, control del hilo y evaluación [P] |
| Precio | **Gratis hoy**; después, por niveles de WhatsApp Business Premium [S] | **USD 2,00 por 1 M tokens** (~20–25 mil tokens por mensaje ≈ **4–5 ¢ por mensaje**) desde el 1-ago-2026; exige medio de pago para activarlo para todos [P] |
| Países | Global [S] | 182 países, **Bolivia incluida** [P] |
| Rubros | **No pude confirmar si excluye salud** | Permitidos: automotriz, consumo masivo, servicios profesionales, retail/e-commerce, viajes [P]. **Excluidos: finanzas, gobierno, salud, alcohol, apuestas, medicamentos de venta libre, servicios matrimoniales** [S: 360dialog, BSP de Meta; consistente con la lista primaria] |
| Límites | Sin bandeja de equipo, **sin conexión a CRM**, sin difusión, sin API [S] | Bloquea las instrucciones que piden datos personales sensibles, como fecha de nacimiento o documento [P, changelog 2-sep-2026] |

### 3.2 Precios de la WhatsApp Business Platform: qué cambió y qué cambia mañana

| Fecha | Cambio | Marca |
|---|---|---|
| 1-jul-2025 ⏳ | Cobro **por mensaje**: sólo se cobran las plantillas; utility dentro de la ventana de 24 h, gratis | [P] |
| 2026 | Facturación en moneda local: MXN (ene), ARS, CLP, COP, PEN (abr), BRL (jul). **Bolivia sigue en USD** | [P] |
| 15-may-2026 | Precio máximo por mensaje de marketing (beta; beta abierta en oct-2026; obligatorio en Q2-2027) | [P] |
| 15-jun-2026 | **Direct Send API** (beta abierta): mensajes utility y de autenticación **sin crear plantilla antes**; Meta la genera y la empareja | [P] |
| 25-jun-2026 | Buzón de voz de la Calling API, disponible para todos | [P] |
| 29-jun-2026 | **Usernames de negocio** y **BSUID** (ver §3.5) | [P] |
| 1-ago-2026 | Se cobra el agente de Meta por token | [P] |
| **1-oct-2026 (mañana)** | **Se cobran los service messages** (respuestas que no son plantilla, las mande una persona o una IA de terceros) **por mensaje, a la misma tarifa que utility en cada mercado y sin tramos por volumen**. Y **utility dentro de la ventana de 24 h deja de ser gratis** | [P] |
| Se mantiene | La ventana gratis de 72 h que abre un anuncio *Click to WhatsApp* sigue sin cobrar el envío | [P] |

**Para Bolivia** (región "Rest of Latin America"): utility **USD 0,0113 por mensaje** en la tarjeta del 1-jul-2026 [R: CSV oficial bajado el 2026-08-08, `ONIA_FECHAS_CRITICAS_PLAN.md` §3]. La tarjeta del 1-oct lista los mercados que cambian y ninguno es de LatAm [P], así que **probablemente sigue en 0,0113** [I]; hay que volver a bajar el CSV, como ya dice el repo.
**Cuenta [I]:** cada respuesta del bot cuesta ≈ **Bs 0,14** (TC 12,08, el del repo), o sea **≈ USD 11,3 ≈ Bs 137 por cada 1.000 respuestas**. En el régimen elegido lo paga cada clínica directo a Meta [R: FECHAS_CRITICAS §3, régimen B]. El repo ya anotó los pendientes: que el cupo cuente las respuestas y corregir `utilityBob` en `pricing.ts` [R].

### 3.3 La regla de 2026 que prohíbe asistentes de IA de propósito general

- **Qué dice [P]:** según los términos actualizados el **15-ene-2026**, los "AI Providers" —*"providers and developers of artificial intelligence or machine learning technologies, such as large language models, generative artificial intelligence platforms, general-purpose artificial intelligence assistants, or similar technologies"*— *"are only permitted to offer general-purpose AI assistants on the WhatsApp Business Platform where Meta is legally required to permit this use case"*. Donde la ley obliga a Meta, les cobra cada mensaje: Italia desde el 16-feb-2026, UE/EEE del 11-mar al 12-may-2026, **Brasil desde el 11-mar-2026 y sigue** [P]. Y aclara: *"This does NOT change how or what Meta charges all other businesses"* [P].
- **¿Afecta a Onia? No, mientras el bot siga siendo el asistente de UN negocio** que atiende a sus pacientes sobre esa clínica [I]. El repo ya fijó ese límite para el pitch: *"Asistente de ESTE negocio, nunca IA que responde cualquier cosa"* [R: `historial/ONIA_PLATAFORMA_CANALES_Y_CONTENIDO_20260808.md` #12].
- **Riesgo residual [I]:** la definición de "AI Provider" es amplia y Meta decide a su criterio. Mitigación barata: que el bot rechace preguntas generales ajenas a la clínica. (La frase *"primary (rather than incidental or ancillary) functionality"* que suele citarse de esos términos **no la pude verificar** en esta sesión.)

### 3.4 ¿Es una amenaza que Meta regale un agente?

| Capacidad | Agente gratis de Meta | Add-on chatbot + agentes de Onia |
|---|---|---|
| Contestar preguntas frecuentes | ✅ gratis, sin cobro por mensaje (es la app, no la API) [S/I] | ✅, pero desde mañana cada respuesta por Cloud API cuesta ~USD 0,0113 al cliente [P] |
| Agendar | ✅ con Google Calendar [S] | ✅ contra la agenda por profesional; hoy el bot **escala** el pedido de cita a una persona [R: catálogo §5] |
| Saber quién tiene tratamiento a medias, deuda o próxima cita | ❌ sin ficha ni CRM [S] | ✅ los datos están en el núcleo (ver §6-d) |
| Escribir primero (recall, cobranza, confirmación) | ❌ en la app responde, no inicia | ✅ con plantillas utility [R] |
| Rubro salud | app: no verificado · API: **excluido** | ✅ |
| SIAT, caja, inventario | ❌ | ✅ |

**Veredicto [I]:** es una **amenaza real y creciente para la capa "contesta y agenda"**, sobre todo en el consultorio de 1 profesional, que no es el cliente ideal. **No lo es para el núcleo ni para los agentes proactivos.** Coincide con la estrategia §13.4: *"la defensa no es el chatbot — es el ERP"*. Tres consecuencias:

1. **Venta:** nunca vender el add-on como "un bot que responde". Venderlo por lo que el de Meta no puede hacer: recuperar pacientes y confirmar citas con los datos de la clínica.
2. **Producto:** el diferencial es la proactividad con datos de la ficha, así que la reactivación va primero (§6-d).
3. **No usar el agente de Meta como motor:** salud está excluida y cuesta 4–5 ¢ por mensaje contra la IA propia [P; R: decisión D10 en `historial/ONIA_META_WHATSAPP_CLIENTES_20260808.md`].

**Hacia dónde va [I]:** Meta ya muestra en el buscador de WhatsApp los negocios que usan su agente [S]. Si en Bolivia llega el "agente que habla con agentes", lo más probable es que sea **dentro de WhatsApp y con Meta en los dos extremos**, no por A2A ni MCP.

### 3.5 BSUID y usernames: un riesgo que no aparece en el repo

- **[P]** Desde el 29-jun-2026 los negocios pueden tomar un username. El usuario que adopta username tiene privacidad de número: **su teléfono puede venir vacío en el webhook (`wa_id` = "")** y su identidad llega como **BSUID** en `user_id`. *"Partners and businesses must adopt BSUID to continue processing incoming messages from WhatsApp username adopters."* El teléfono se comparte durante 30 días móviles después de cada interacción.
- **[R]** El bot toma el teléfono del contacto de Chatwoot (`phoneOf()` en `hermes-content/deploy/vps-ops/bot/chatwoot-adapter.mjs`); si viene vacío, devuelve `null`. `grep BSUID` en `docs/`: sólo una mención en el radar de marca personal, no en el carril chatbot.
- **Riesgo [I]:** un paciente con username escribe y el bot no lo vincula a su ficha: pierde contexto, tratamiento y deuda. Los envíos salientes por teléfono siguen funcionando.
- **Momento:** v1.x, antes de que los usernames se masifiquen. **Costo [I]:** 1–3 días, más verificar si la versión de Chatwoot del VPS (4.12.1) soporta BSUID (**no verificado**).

---

## 4. Qué lanzaron en IA los software de clínicas y reservas (2025–2026)

| Empresa | Qué lanzó | Fecha | Foco | LatAm · Bolivia | Marca |
|---|---|---|---|---|---|
| **Docplanner / Doctoralia** | **Noa Booking**: agente de **voz** 24/7 que agenda contra el calendario del médico, confirma por SMS y WhatsApp y deriva a humano; 3 idiomas; 1.300 médicos en 3 días; "duplica las reservas" según la empresa | 25-mar-2026 | recepción por voz | Opera en 13 países de Europa y LatAm; **Bolivia no figura** | [P·ext Twilio] / [S] |
| Doctoralia | Noa Notes (notas clínicas), **Noa Evidence** (evidencia científica, lanzado en Chile) | 2025 / jul-2026 | clínico | MX, CO, CL | [S] |
| **AgendaPro** | **Julia**: recepcionista y vendedora IA en WhatsApp, Instagram y Messenger; muestra horarios, manda link de pago y **recupera cancelaciones re-agendando** | oct-2025 | salones, spa, estética | **Opera en Bolivia** según listados de tienda y directorio | [P·ext agendapro.com] / [S] |
| **Dentalink** | **Contact Center IA**: WhatsApp **y llamadas** 24/7; agenda, confirma, cobra y hace **recall y "venta de tratamientos"**; confirmaciones automáticas ("45% menos inasistencias", dato de la empresa) | 2025–2026, sin fecha exacta | dental | "Líder en Latinoamérica"; precio para Bolivia no publicado | [P·ext softwaredentalink.com] |
| **Doctocliq** | **Soyla IA**: agente de WhatsApp que responde 24 h, agenda, recuerda y hace seguimiento | 2025–2026 | consultorios y estética | Perú; Bolivia no verificado | [P·ext doctocliq.com] |
| **Booksy** | Partner de reservas de belleza en Google AI Mode | nov-2025 | belleza | EE.UU. | [S] |
| **Zocdoc** | **Zo** (teléfono con IA; USD 2 por cita agendada sola, may-2025 ⏳) → **Gemini** (ago-2026) → **Care Access Network** (sep-2026) | 2025–2026 | salud | EE.UU. | [P·ext] |
| **Weave** | Recepcionista IA omnicanal (voz y texto) sobre Gemini Enterprise; ampliada en julio | may-2026 / jul-2026 | dental y salud | EE.UU. | [P·ext getweave.com] |
| **NexHealth** | Recordatorios, recall, lista de espera y asistente que redacta campañas de recall | — | dental | EE.UU.; lanzamiento 2026 **no verificado** | [R: `ONIA_AGENTES_IA_DISENO_FUNCIONAL.md`] |
| **Arini** | Recepcionista de voz IA para dentistas (YC W24), con escritura en Dentrix, Eaglesoft y Open Dental | 2024– | dental | EE.UU.; USD 500 mil de financiación según Crunchbase y Tracxn | [S] |
| Fresha · Mindbody | **No verificado** (dominios bloqueados y cupo de búsqueda agotado) | — | — | — | — |

**Lectura [I]:**
1. **En LatAm el estándar de 2026 ya es "agente de WhatsApp que agenda, confirma y recupera"** (AgendaPro en Bolivia; Dentalink y Doctocliq en la región). Tener bot no diferencia a Onia. Lo que la diferencia es el precio en Bs, el SIAT y —si se construye— **la reactivación que parte del plan de tratamiento**.
2. **La voz ya llegó a LatAm** (Docplanner con Twilio, Dentalink). En EE.UU. es commodity (Arini, Weave, Zocdoc).
3. **Nadie en LatAm expone agendas de clínicas a asistentes externos.** El único caso real es Zocdoc, en EE.UU.

⚠️ **Choque con un doc del repo editado HOY, sin commitear.** Mientras investigaba, otra sesión (carril Mercado) agregó en `ONIA_CLIENTE_IDEAL.md` §2: *"Lo que ninguno [TuDoc, Dentalink, Medilink] ofrece ni titula es el agente que propone a quién recuperar"*, y cita un `ONIA_ADQUISICION_Y_PAUTA.md` §2 que todavía no existe en este árbol. **La página de Dentalink dice lo contrario:** su Contact Center IA *"proactively contacts for treatment sales and recalls"* ([P·ext] https://www.softwaredentalink.com/ia/en/management/crm-asistente-ia). No pude abrir la página para confirmarlo. Antes de que esa frase entre en material de venta, alguien tiene que abrir la página de Dentalink y mirarla. Si Dentalink sí lo ofrece, el diferencial de Onia no es "el único que recupera" sino **recuperar desde el plan de tratamiento, en Bs y con SIAT**.

---

## 5. Implicancias para Onia: tabla de decisión

Test = ① ¿se le vende al mismo cliente que paga? · ② ¿deja de tener sentido sin el núcleo? · ③ ¿se entrega sin horas por cliente? Costos en días de desarrollo de Sergio Urcullo con agentes [I], salvo los marcados.

| # | Tendencia / función | Amenaza u oportunidad | Evidencia LatAm · Bolivia | ① ② ③ | Momento | Costo aprox. |
|---|---|---|---|---|---|---|
| 1 | **Reactivación del tratamiento a medias** (d): detecta, redacta, el dueño aprueba, se envía, el paciente responde, se le ofrece horario y se mide "pacientes y Bs recuperados" | **Oportunidad.** Dolor #1 del cliente ideal | Dentalink "venta de tratamientos", AgendaPro recupera cancelaciones [P·ext/S]; el lead calificado del 25-ago lo pidió textual [R] | ✅ ✅ ✅ | **AHORA (v1.0)** | 3–7 días: el motor de agentes, la aprobación y el envío ya existen [R]. Envío: plantilla utility USD 0,0113 [R/P] |
| 2 | Adaptar el add-on al cobro del 1-oct | Amenaza de costo | Meta [P] | mantenimiento | **AHORA** (ya anotado en FECHAS_CRITICAS §3) | 1–2 días |
| 3 | Soportar BSUID y usernames | Amenaza técnica | Meta [P] | mantenimiento | v1.x, pronto | 1–3 días + Chatwoot |
| 4 | **El agente de la clínica reserva solo** contra la agenda real por WhatsApp (hoy escala a una persona) | Oportunidad: es la pieza "lista para agentes" que sí aplica en Bolivia | AgendaPro Julia y Doctocliq Soyla ya lo hacen [S/P·ext] | ✅ ✅ ✅ | v1.x (antes si un cliente lo pide) | 1–2 semanas (disponibilidad, reserva, anti doble reserva, confirmación) |
| 5 | **schema.org + botón de reserva** en la agenda pública y en el perfil de Google (b) | Oportunidad chica y barata | Google lee datos estructurados; Reserve with Google no opera en Bolivia [S] | ✅ ✅ ✅ (se genera de los datos de la org) | v1.x | 0,5–1 día |
| 6 | Agenda operable por navegadores con agente (formulario semántico, sin captcha, confirmación clara) (b) | Oportunidad chica | Agentes que operan webs existen [recuerdo, no verificado hoy] | ✅ ✅ ✅ | v1.x, junto con #5 | incluido en #5 |
| 7 | **llms.txt** (b) | **Moda** | 97% de los llms.txt nunca reciben una visita (Ahrefs, 137 mil dominios, may-2026); Google lo ignora (doc de jun-2026) [S] | ✅ ✅ ✅ | **Nunca**, salvo como subproducto gratis | 1 h |
| 8 | **Servidor MCP de reservas** para asistentes del paciente (a) | Moda en Bolivia hoy; oportunidad lejana | Registry: 0 servidores de negocios bolivianos; los asistentes no descubren servidores solos; ChatGPT exige app aprobada [P/I] | ✅ ✅ ⚠️ (✅ si es UNA integración de plataforma; ❌ si es por clínica) | **v2.0 con disparador** (§6-a) | 3–5 días técnico (envoltorio de `/api/v1`, estrategia §14) + privacidad y consentimiento |
| 9 | **A2A** (Agent Card) (a) | Moda para este cliente | Sólo enterprise [S] | ✅ ✅ ⚠️ | **Nunca** hasta que un agregador o Meta lo exija | 3–5 días |
| 10 | App en ChatGPT o Gemini (a) | Oportunidad lejana | Zocdoc–Gemini sólo en EE.UU.; OpenAI retiró su checkout [S] | ✅ ✅ ⚠️ | v2.0 | 2–4 semanas + revisión del directorio; sin tráfico boliviano |
| 11 | Reserve with Google / Actions Center (a) | Bloqueado | Bolivia no soportada [S] | — | Nunca, hasta que Google abra Bolivia | — |
| 12 | **Recepcionista de voz entrante por WhatsApp** (c) | Oportunidad real, no para la v1.0 | Docplanner Noa Booking (LatAm), Dentalink; EE.UU. commodity; Google ya llama a negocios allá [S]. Repo: entrante sin costo de transporte, Business Verification como portero, **grabar sin consentimiento es delito penal en Bolivia**, latencia real 1,3–1,7 s [R] | ✅ ✅ ⚠️ (por clínica: número en Cloud API, verificación de negocio, guion legal) | **v2.0** (o v1.3 si lo piden 2+ clientes) | 2–4 semanas MVP [I]; Bs 0,50–1,87 por llamada de 2 min [R] |
| 13 | Voz saliente (recordatorios o recall por llamada) (c) | Débil | Permisos de 1 por día y 2 por semana; revocación a las 4 sin respuesta [R] | ✅ ✅ ⚠️ | Nunca en v1–v2: WhatsApp texto hace lo mismo más barato | — |
| 14 | Usar el agente de Meta como motor | Descartado | Salud excluida [S]; 4–5 ¢ por mensaje [P] | — | Nunca para dental y estética | — |
| 15 | **Direct Send API** (utility sin plantilla previa) | Oportunidad operativa: menos fricción de alta por clínica, menos soporte (sube el techo, §9) | Beta abierta jun-2026 [P] | ✅ ✅ ✅ | v1.1, cuando salga de beta | 1–2 días |
| 16 | Pagos agénticos (AP2, ACP, UCP, Visa, Mastercard) | Irrelevante | Ningún banco boliviano; las clínicas cobran efectivo o QR [S/R] | ❌ nadie lo pide | Nunca, por ahora | — |
| 17 | Siri (App Intents), Alexa+, NLWeb | Irrelevante | No llegan a Bolivia; Onia es web | — | Nunca | — |
| 18 | MCP **del dueño** (su Claude o ChatGPT sobre sus datos) | Ya evaluado: falla ① | Estrategia §14 [R] | ❌ ✅ ⚠️ | v1.x si lo pide un cliente que paga | días (§14) |

---

## 6. Las cuatro evaluaciones pedidas

**(a) Exponer la agenda de cada clínica a agentes externos (MCP, A2A, apps de ChatGPT o Google). Veredicto: v2.0, y como UNA integración de plataforma.**
Hoy no hay tráfico que capturar en Bolivia: ningún asistente de consumo reserva en negocios locales fuera de EE.UU., Reserve with Google no opera y el registry tiene 0 servidores de negocios bolivianos. Técnicamente es barato (días), pero cada ecosistema exige su alta o revisión: hecho clínica por clínica falla la pregunta ③. Además, una cita es dato de salud: antes hay que declararlo en Privacidad y pedir consentimiento (estrategia §14).
**Disparadores para reabrirlo** (cualquiera): Google habilita reservas agénticas o "llamar por vos" en Bolivia o en español · Reserve with Google suma Bolivia · ChatGPT, Gemini o Meta AI reservan en negocios de salud locales fuera de EE.UU. · un cliente que paga lo pide.

**(b) Datos estructurados o llms.txt en la agenda pública. Veredicto: sí a schema.org, botón de reserva en el perfil de Google y formulario accesible (medio día, v1.x); no a llms.txt.**
Lo primero lo leen buscadores y agentes que navegan; lo segundo casi nadie lo pide, y Google declaró que lo ignora. No verifiqué el HTML de la agenda pública (vive en `onia-platform`, fuera de esta sesión). Dato útil: el sitio de marketing ya usa JSON-LD en varias páginas (`web-factory/apps/onia-platform/src/app/...`).

**(c) Recepcionista de voz. Veredicto: v2.0.** La ruta ya está diseñada en el repo (`research/ONIA_AGENTES_DE_LLAMADAS_20260815.md`, `ONIA_VOZ_WHATSAPP_ARQUITECTURA_20260802.md`: primero entrante por WhatsApp Calling).
Lo nuevo desde agosto: Docplanner y Dentalink ya venden voz en LatAm, y Google ya llama a negocios en EE.UU. Es decir, "el agente del paciente llamando a la clínica" existe y va a llegar por teléfono. Pero el cliente ideal **tiene recepción** y nadie midió cuántas llamadas pierde. Antes de construir, medir eso con el primer cliente. Nota: `research/rubro-dental-estetica-oportunidades.md` la descartó para negocios de 1–5 personas ("humo caro"); para 2–6 profesionales con recepción, el caso es "atiende cuando nadie atiende", no "reemplaza a la recepcionista".

**(d) Reactivación automática de pacientes. Veredicto: AHORA, y con el criterio correcto.**
El Recall de hoy detecta *"cita completada hace ≥180 días sin cita futura"* [R: `ONIA_AGENTES_IA_DISENO_FUNCIONAL.md` §2.1 y el recuento en `cola/plataforma-v1.md`]. Es el recall de la limpieza semestral. **El dolor #1 es otro:** el paciente con tratamiento de varias sesiones que canceló o faltó y no reagendó (`ONIA_CLIENTE_IDEAL.md` §4; textual del lead del 25-ago). A ese paciente, a los 180 días ya se lo perdió.
Criterio propuesto [I]: *plan de tratamiento con sesiones pendientes* + *última cita cancelada, no asistida o sin visita en N días (14–30)* + *sin cita futura*. Se cierra el circuito por WhatsApp: plantilla utility → respuesta → horarios de la agenda → cita. Se mide en **pacientes y Bs recuperados**, que es la frase de venta y la demo.
Pasa las tres preguntas y es lo único de esta lista que la competencia regional ya cobra y que Meta no puede copiar sin la ficha. **A verificar en código** (no disponible en esta sesión): si el modelo de tratamiento ya distingue sesiones pendientes.

---

## 7. Qué no pude verificar

- **Fresha y Mindbody**: lanzamientos de IA 2025–2026. **NexHealth**: lanzamientos 2026.
- Si el **agente gratis de Meta en la app WhatsApp Business excluye salud** y si ya funciona en Bolivia y en español.
- El texto exacto de los términos de WhatsApp sobre funcionalidad *"primary (rather than incidental or ancillary)"*.
- Las **tarifas de Rest of Latin America vigentes desde el 1-oct-2026**: no se pudo bajar el CSV desde acá.
- Si **Chatwoot 4.12.1** (VPS) soporta BSUID.
- El **código** del agente Recall y del modelo de tratamientos (el criterio sale de docs del repo, no del código de `onia-platform`).
- El HTML de la **agenda pública** (datos estructurados, captcha).
- Fecha exacta de A2A v1.0 (sólo secundaria). Detalles de WWDC 2026 (sólo blogs de baja calidad).
- Si **Dentalink** ofrece de verdad recall proactivo y "venta de tratamientos" (sólo lo vi en el extracto del buscador; contradice lo que el carril Mercado escribió hoy en `ONIA_CLIENTE_IDEAL.md`, ver §4).
- Presencia y precio en Bolivia de **Dentalink y Doctocliq**; **AgendaPro en Bolivia** sale de listados de tienda y directorio, no de su propia página; **Doctoralia en Bolivia** no aparece (probablemente no opera).
- **Meta AI en WhatsApp Bolivia**: prensa local del 18-oct-2024 ⏳; su estado actual no se re-verificó.
- Agentes de navegador (Atlas, Comet, Gemini en Chrome): recuerdo, no verificado en esta sesión.
- Causa general: el proxy bloqueó casi todos los dominios primarios y el cupo de búsquedas web se agotó. Lo marcado [P·ext] tiene URL primaria **sin abrir**.

---

## 8. Fuentes

**Primarias abiertas [P]** (consultadas el 2026-09-30)
- MCP, spec 2026-07-28 — https://blog.modelcontextprotocol.io/posts/2026-07-28/ (2026-07-28)
- MCP, roadmap — https://blog.modelcontextprotocol.io/posts/mcp-roadmap/ (2026-08-22)
- MCP Apps — https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/ (2026-01-26)
- MCP en la Agentic AI Foundation — https://blog.modelcontextprotocol.io/posts/2025-12-09-mcp-joins-agentic-ai-foundation/ (2025-12-09)
- Índice del blog MCP (Registry preview, 2025-09-08) — https://blog.modelcontextprotocol.io/posts/page/3/
- MCP Registry, consultas `booking`, `appointment`, `dental`, `clinic`, `reserva` — https://registry.modelcontextprotocol.io/v0/servers?search=booking
- Meta, precios WhatsApp (act. 2026-05-21) — https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing
- Meta, cambios de service, utility y Business Agent — https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages
- Meta, política AI Providers (act. 2026-05-21) — https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/ai-providers
- Meta Business Agent, overview (2026-06-30) — https://developers.facebook.com/documentation/meta-business-agent/overview
- Meta Business Agent, get started — https://developers.facebook.com/documentation/meta-business-agent/get-started
- Meta Business Agent, changelog (act. 2026-09-10) — https://developers.facebook.com/documentation/meta-business-agent/changelog/
- Meta, BSUID — https://developers.facebook.com/documentation/business-messaging/whatsapp/business-scoped-user-ids
- Meta, changelog WhatsApp (ene–jun 2026) — https://developers.facebook.com/documentation/business-messaging/whatsapp/changelog
- Meta, precio máximo de marketing — https://developers.facebook.com/documentation/business-messaging/whatsapp/marketing-messages/pricing/

**Primarias vía extracto del buscador, sin abrir [P·ext]**
- Linux Foundation, A2A año uno (2026-04-09) — https://www.linuxfoundation.org/press/a2a-protocol-surpasses-150-organizations-lands-in-major-cloud-platforms-and-sees-enterprise-production-use-in-first-year
- Google Open Source, aniversario A2A (abr-2026) — https://opensource.googleblog.com/2026/04/a-year-of-open-collaboration-celebrating-the-anniversary-of-a2a.html
- OpenAI, Buy it in ChatGPT (2025-09-29) ⏳ — https://openai.com/index/buy-it-in-chatgpt/
- OpenAI, ChatGPT Health (ene-2026) — https://openai.com/index/introducing-chatgpt-health/
- Google, Search en I/O 2026 (2026-05-19) — https://blog.google/products-and-platforms/products/search/search-io-2026/
- Booksy y Google AI Mode — https://biz.booksy.com/blog/booksy-google-ai-mode-integration
- Zocdoc en Gemini (2026-08-12) — https://www.prnewswire.com/news-releases/zocdoc-brings-seamless-real-time-appointment-booking-to-gemini-302849229.html
- Zocdoc Care Access Network (2026-09-22) — https://www.prnewswire.com/news-releases/zocdoc-enters-its-next-chapter-expanding-beyond-its-marketplace-to-power-access-to-care-everywhere-302879956.html
- Zocdoc Zo (2025-05-01) ⏳ — https://www.zocdoc.com/about/news/zocdoc-launches-zo-by-zocdoc-an-ai-phone-assistant-that-vanquishes-hold-times-and-maximizes-appointment-scheduling/
- Twilio y Docplanner (mar-2026) — https://www.twilio.com/en-us/press/releases/docplanner-expands-patient-access-with-voice-ai-agent-powered-by
- Weave, AI Receptionist (may-2026) — https://www.getweave.com/press-releases/weave-unveils-enterprise-grade-omnichannel-ai-receptionist-built-with-google-clouds-gemini-enterprise-agent-platform-to-transform-healthcare-front-offices/
- AgendaPro, IA (Julia y Sofía) — https://agendapro.com/blog/ia-en-agendapro/ · https://agendapro.com/es-es/julia-ia-ventas
- Dentalink, Contact Center IA — https://www.softwaredentalink.com/inteligencia-artificial/contact-center · CRM y asistente (recall y venta de tratamientos): https://www.softwaredentalink.com/ia/en/management/crm-asistente-ia · confirmaciones: https://www.softwaredentalink.com/experiencia-de-pacientes/confirmaciones-automaticas-de-citas
- Doctocliq, Soyla IA — https://www.doctocliq.com/soyla-ia
- Mastercard LatAm (dic-2025) — https://www.mastercard.com/news/latin-america/en/newsroom/press-releases/pr-en/2025/december/mastercard-unveils-agent-pay-in-latin-america-and-the-caribbean/ · transacciones vivas (mar-2026): https://www.mastercard.com/news/latin-america/en/newsroom/press-releases/pr-en/2026/march/mastercard-advances-agentic-payments-in-latin-america-and-the-caribbean-with-live-transactions-completed-across-the-region/
- Amazon Alexa+, integraciones de reserva — https://www.aboutamazon.com/news/devices/alexa-plus-voice-booking-integrations · internacional: https://www.aboutamazon.com/news/devices/alexa-plus-international-launch
- Microsoft NLWeb (may-2025) ⏳ — https://news.microsoft.com/source/features/company-news/introducing-nlweb-bringing-conversational-interfaces-directly-to-the-web/
- Meta, newsroom Business Agent (jun-2026) — https://about.fb.com/news/2026/06/meta-business-agent/

**Secundarias [S]**
- TechCrunch, Meta Business Agent global (2026-06-03) — https://techcrunch.com/2026/06/03/metas-ai-agent-for-whatsapp-business-is-now-available-globally/
- TechCrunch, Gemini hace llamadas (2026-09-24) — https://techcrunch.com/2026/09/24/google-tests-letting-gemini-make-phone-calls-initially-for-us-pixel-owners/
- TechCrunch, AI Mode con entradas y citas de belleza (2025-11-04) — https://techcrunch.com/2025/11/04/googles-ai-mode-gets-new-agentic-capabilities-to-help-book-event-tickets-and-beauty-appointments/
- TechCrunch, UCP (2026-01-11) — https://techcrunch.com/2026/01/11/google-announces-a-new-protocol-to-facilitate-commerce-using-ai-agents/
- CNBC, Instant Checkout (2026-03-20 y 2026-03-24) — https://www.cnbc.com/2026/03/20/open-ai-agentic-shopping-etsy-shopify-walmart-amazon.html · https://www.cnbc.com/2026/03/24/openai-revamps-shopping-experience-in-chatgpt-after-instant-checkout.html
- Hypotenuse, Instant Checkout en 2026 — https://www.hypotenuse.ai/blog/chatgpts-instant-checkout-the-next-phase-of-agentic-commerce
- Digital Commerce 360 (2026-03-06) — https://www.digitalcommerce360.com/2026/03/06/openai-shifts-checkout-plans-agentic-commerce-strategy/
- Skift, hoteles en AI Mode (2026-08-27) — https://skift.com/2026/08/27/googles-agentic-hotel-booking-tool-comes-to-ai-mode/
- 360dialog, elegibilidad Meta Business Agent — https://360dialog.com/blog/meta-business-agent-eligibility-checklist/
- WATI, Meta Business Agent (límites de la versión gratis) — https://www.wati.io/en/blog/meta-business-agent/
- HIT Consultant, Zocdoc Care Access Network (2026-09-22) — https://hitconsultant.net/2026/09/22/zocdoc-care-access-network-syndicated-provider-booking-gemini-amazon-health-ai/
- IT Brief, Docplanner Noa Booking — https://itbrief.co.uk/story/docplanner-rolls-out-ai-voice-booking-agent-with-twilio
- Pauta.cl, Noa Evidence (2026-07-14) — https://www.pauta.cl/actualidad/2026/07/14/doctoralia-presento-noa-evidence-en-chile-la-ia-que-ayuda-a-medicos-a-consultar-evidencia-cientifica-en-segundos.html
- G5 Noticias, AgendaPro Julia (2025-10-04) — https://g5noticias.cl/2025/10/04/una-vendedora-24-7-para-tu-negocio-agendapro-estrena-agente-ia-made-in-chile-para-hacer-crecer-a-sus-clientes/
- AgendaPro en Bolivia (listado) — https://apps.apple.com/us/app/agendapro-business/id1218956898 · https://www.capterra.com/p/218709/AgendaPro/
- Arini — https://www.ycombinator.com/companies/arini · https://www.crunchbase.com/organization/arini
- Red Uno, Meta AI en Bolivia (2024-10-18) ⏳ — https://www.reduno.com.bo/tecnologia/como-usar-meta-ai-la-inteligencia-artificial-de-whatsapp-ya-esta-en-bolivia-20241018175131
- Ahrefs, estudio llms.txt (may-2026) — https://ahrefs.com/blog/llmstxt-study/
- Presenc, adopción de NLWeb 2026 — https://presenc.ai/research/nlweb-adoption-2026
- Appointy, países de Reserve with Google — https://help.appointy.com/hc/en-us/articles/360032230251-Which-countries-are-currently-supported-by-Reserve-with-Google
- Thurrott, Alexa+ en México — https://www.thurrott.com/a-i/331979/amazons-alexa-assistant-is-now-available-in-mexico
- Fintech Global, Mastercard LatAm (2026-03-30) — https://fintech.global/2026/03/30/mastercard-completes-live-ai-agent-payments-in-latin-america/
- Eco, AP2 v0.2.0 — https://eco.com/support/en/articles/14845479-ap2-agent-payments-protocol-explained
- Dracode, WWDC 2026 / Siri (baja calidad) — https://dracode.dev/blog/2026-06-08-09-wwdc-2026-siri-2-app-intents/

**Repo [R]** (leídos, no modificados)
- `hermes-content/docs/ONIA_ESTRATEGIA_DE_EMPRESA.md` §10, §12, §13.4, §14
- `hermes-content/docs/ONIA_CLIENTE_IDEAL.md` §2, §4
- `hermes-content/docs/ONIA_FECHAS_CRITICAS_PLAN.md` §3 (cobro del 1-oct, régimen B, pendientes)
- `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` §5 (el bot escala el pedido de cita)
- `hermes-content/docs/ONIA_AGENTES_IA_DISENO_FUNCIONAL.md` §2.1 · `hermes-content/docs/cola/plataforma-v1.md` (criterio del Recall, recontado)
- `hermes-content/docs/research/ONIA_AGENTES_DE_LLAMADAS_20260815.md` (voz: costos, legal, latencia) · `research/rubro-dental-estetica-oportunidades.md` §C
- `hermes-content/docs/historial/ONIA_META_WHATSAPP_CLIENTES_20260808.md` (D10) · `historial/ONIA_PLATAFORMA_CANALES_Y_CONTENIDO_20260808.md` (#12)
- `hermes-content/deploy/vps-ops/bot/chatwoot-adapter.mjs` (`phoneOf`)
