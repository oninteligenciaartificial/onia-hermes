# DECISIÓN DE SERGIO (2026-08-17) — manda sobre el análisis de abajo

1. **Ruta elegida: Embedded Signup (auto-checking)**, con VIDEOS de apoyo para quien
   se trabe (gratis, guía del popup — no producto aparte). Tech Provider: Sergio
   verifica la aceptación él mismo.
2. **La cara es ONIA, nunca Chatwoot.** Chatwoot queda como motor oculto. NO se
   re-brandea Chatwoot (el cron diario restaura su marca — ya se perdió trabajo ahí);
   lo que ve el cliente son superficies nuestras: el panel, el editor, y a futuro el
   widget propio. El "Powered by Chatwoot" del widget B1 es deuda aceptada solo como
   puente corto.
3. **Formulario de alta a perfeccionar**: el cliente construye SU chatbot solo,
   como construimos el nuestro en un día — el form alimenta los bloques A-D del
   editor. Se prueba primero con EL BOT PROPIO DE ONIA dentro del sistema.
4. **Escalera de cobro ratificada**: instalación + mensualidad de plataforma +
   extras; si el cliente no puede solo → consultoría done-for-you, MÁS cara.
5. **Dirección nueva — consultor técnico + on-premise**: "el SaaS está muriendo" →
   Onia también diagnostica la empresa (qué falla, cómo opera) y le instala el
   sistema LOCAL o SaaS configurado, cobrando más. Hay que aprender a instalar y
   configurar la plataforma on-premise (conecta con la idea Onia Box).

# ONIA — Alta del WhatsApp del cliente y canal del chatbot: decisión

> **Fuente de verdad viva** (sin fecha en el nombre: se EDITA, no se duplica).
> Responde la pregunta de Sergio: cuando un cliente se crea su chatbot con
> nosotros, ¿cómo conecta SU WhatsApp/Meta? — y la segunda dimensión: ¿dónde
> ve el cliente final a su chatbot (WhatsApp vs widget web marca Onia)?
>
> **No duplica** `ONIA_CHATBOT_LINEA_DE_ENTREGA.md` (la línea completa de
> montaje, §1 tiene el detalle operativo de Embedded Signup y del alta manual)
> ni el research de coexistencia (`ONIA_MODELO_MULTICLIENTE_CHATBOT_20260802`,
> hoy solo en historia de git — commit `456c2bc8`). Este doc COMPARA las rutas
> y DECIDE la secuencia. Investigación externa: 2026-08-17.
> **Estado de los trámites de Meta re-verificado el 2026-08-28** mirando el panel logueado:
> App Review **aprobado** Y **Access Verification ✅ VERIFICADA** ("Tu negocio se verificó
> como proveedor de tecnología", 0 acciones requeridas). **No queda NINGÚN trámite de Meta
> abierto** — el deadline del 20-oct dejó de existir. Lo que falta es solo nuestro:
> Configuration ID + dominio JS SDK + 3 env vars + prueba con +591. Tabla en §1.
>
> Precio que esto entrega: **Chatbot WhatsApp con IA — Bs 390/mes o Bs 3.900/año,
> sin cargo inicial** (manda `onia-platform/lib/pricing.ts`, `WHATSAPP_ADDON`; aquí no
> se inventa ningún número nuevo). Los mensajes los cobra Meta en la cuenta del cliente.
>
> ⚠️ **Corregido 2026-08-27.** Decía `Bs 1.500 inst. + Bs 1.490/mes`. Se eliminó el cobro
> de instalación el 2026-08-21: un pago de entrada de Bs 2.990 para PROBAR un chatbot
> frenaba la venta. Todo lo que en este doc se justificaba "con la instalación" ahora se
> justifica con la mensualidad — por eso se reescribió §4 entera, no solo el número.

---

## 1. Las cuatro rutas de alta en Meta

### Ruta 1 — Embedded Signup de Meta (el "autochecking") ✅ la ruta objetivo

El flujo oficial: el cliente conecta su número desde NUESTRO panel con un
popup OAuth de Meta, sin salir. Requisitos verificados HOY en
developers.facebook.com y developers.chatwoot.com:

| Requisito | ¿De quién? | Estado |
|---|---|---|
| Ser **Tech Provider** (auto-servicio, no hay que ser BSP ni entrar a un programa de partners) | Nuestro, UNA vez | ✅ **COMPLETO** (2026-08-28): verificación de negocio + App Review + Access Verification, los tres cerrados |
| Business Verification de la agencia | Nuestro | ✅ aprobada 31-jul-2026 · re-verificado 2026-08-21: OniaAgency (1451773736711697), `verification_status: verified` |
| App con caso de uso WhatsApp en live mode | Nuestro | ✅ "Onia Bot" (1078962684709749), publicada, **0 acciones requeridas** (2026-08-21) |
| App Review: **2 videos** (enviar mensaje desde la app; crear plantilla) para Advanced Access a `whatsapp_business_messaging` + `whatsapp_business_management` | Nuestro | ✅ **APROBADO el 2026-08-21 09:59 GMT-4** — `whatsapp_business_messaging`, `whatsapp_business_management` y `public_profile`, los tres en **acceso avanzado** (`live`) |
| **Access Verification (formulario)** | Nuestro | ✅ **VERIFICADA — mirada en el panel el 2026-08-28**: "Tu negocio se verificó como proveedor de tecnología". El aviso del 20-oct desapareció; 0 acciones requeridas |
| Configuración "Inicio de sesión con Facebook para empresas" (de ahí sale el `WHATSAPP_CONFIGURATION_ID`) | Nuestro | ✅ **CREADA el 2026-08-28**: "Onia Embedded Signup", ID 1824225392073753, token que no caduca; SDK + dominio chat.onia.com.bo autorizados; 3 InstallationConfigs cargadas server-side. Falta SOLO la prueba del popup con un +591 (Sergio) |
| Las 3 env vars en Chatwoot + dominio del JS SDK autorizado | Nuestro | 🔴 `WHATSAPP_APP_ID`, `WHATSAPP_APP_SECRET` y `WHATSAPP_CONFIGURATION_ID` están **VACÍAS** (2026-08-21) |
| Embedded Signup **v4** (v2 se deprecia el **15-oct-2026** — nunca implementar v2) | Nuestro | Pendiente (lo trae Chatwoot, ver abajo) |
| Business Verification **del cliente** | Del cliente | **NO necesaria para arrancar**: sin verificar puede iniciar conversaciones a 250 clientes únicos/24 h y responder SIN límite lo que le escriban. Verificarse solo le hace falta para escalar difusiones y para el display name oficial / check verde |

**Qué puede hacer el cliente solo:** todo el popup (~10–15 min): login
Facebook → crear/elegir portfolio → crear/elegir WABA → verificar su número
por SMS → display name. Con coexistencia conserva su app y su historial
(180 días) — detalle y trampas en el research multicliente. **Qué no puede
hacer solo:** nada del lado nuestro (la app, el Configuration ID, el webhook)
— eso es fijo, una vez.

**Dato previo verificado (2026-08-17):** Chatwoot self-hosted **sigue
soportando Embedded Signup nativo** — el super admin setea 3 variables
(`WHATSAPP_APP_ID`, `WHATSAPP_CONFIGURATION_ID`, `WHATSAPP_APP_SECRET`) en
`/super_admin/app_config?config=whatsapp_embedded` y el botón "Connect with
WhatsApp Business" aparece al crear el inbox. Token, webhook y registro del
número: automáticos. **La ruta es "encender en nuestro Chatwoot", no
construir.** Riesgo conocido self-hosted: reportes de popup que no abre
(exige HTTPS válido y cookies de terceros) — la prueba real con un número
+591 es parte del encendido, no un opcional.

**⚠️ Hostname sin resolver (2026-08-21):** el mismo Chatwoot responde por **dos**
hostnames — `chat.onia.com.bo` y el de Easypanel (que es el que tiene apuntado el
webhook). El JS SDK del Embedded Signup exige el dominio autorizado en la app de Meta y
**autorizar uno solo puede no alcanzar**. Antes de darlo por hecho hay que abrir el panel
y **mirar desde cuál hostname se sirve el popup**.

**Tiempos:** trabajo nuestro restante ~1 día + espera de Meta 1–7 días.
Hasta completar los 3 gates: techo de **10 clientes nuevos por semana**
(después 200) — sobra para nuestra escala. Costo por cliente una vez
encendido: **~5 min nuestros + ~15 min del cliente.**

**Veredicto: es la ruta ganadora y ya está instalada; falta el trámite.**

### Ruta 2 — Video tutorial pagado (el cliente hace el alta de Meta solo) ❌

Evaluación honesta: **no es realista para un dueño de clínica boliviano.**
El alta manual completa exige: cuenta en developers.facebook.com → crear una
app de negocio → Business Manager → agregar el producto WhatsApp → token de
system user → configurar webhook con verify token → pegar credenciales. Eso
es trabajo de developer; Meta creó Embedded Signup precisamente porque ese
camino mataba la conversión. Dónde se traba la gente (visto en nuestros 2
altas propias y en los foros de soporte de los BSPs):

1. **Business Manager / verificación**: documentos que no coinciden con el
   nombre legal (en Bolivia: NIT/SEPREC vs nombre comercial — el caso
   Bolivian Electric ya lo documentó).
2. **El número**: si está en uso en la app WhatsApp hay que migrarlo o
   liberarlo; el mensaje de error de Meta no explica nada.
3. **Tokens y webhooks**: conceptos que un comerciante no tiene por qué
   conocer; un token temporal de 24 h que expira y "el bot murió".
4. Y cuando se traba, **nos culpa a nosotros** — el costo de soporte vuelve
   multiplicado.

Además cobra por algo que la Ruta 1 hace gratis en 15 minutos. **Veredicto:
no vender como producto.** El video sí existe pero como **material de apoyo
incluido**: 3–4 min guiando el popup de Embedded Signup (qué botón tocar,
qué SMS esperar), no el alta manual completa.

### Ruta 3 — Done-for-you cobrado (nosotros hacemos el alta) ✅ el puente de HOY

Ya tiene dónde aterrizar: el producto guarda credenciales WhatsApp POR
organización en `clinic_settings` y el superadmin las pega en `/admin`
[dato del contexto del carril; el código vive en `onia-platform`].

**Cómo se hace bien (sin password sharing — prohibido):** el runbook ya está
escrito en `ONIA_WHATSAPP_CHATWOOT_META_SALES_AUDIT_2026.md` ("Runbook
rápido — Acceso Meta WhatsApp API"): el cliente (o su dueña de portfolio)
nos da acceso como **Partner de Business Manager** (con nuestro Business ID)
o invita el correo de Sergio como persona con assets asignados
(WABA + phone numbers + templates). Nunca contraseñas, 2FA ni tokens por
chat. Desde octubre 2025 Meta además exige que **el cliente sea dueño de su
portfolio** — nosotros entramos como socio (máx. 2 por cuenta) y el cliente
puede desconectarnos desde su app. Es argumento de venta, no fricción.

**Qué necesitamos del cliente:** 30 min de videollamada con quien tenga el
Facebook del negocio + su número (y saber si ese número ya usa WhatsApp/
WhatsApp Business) + sus documentos si quiere verificarse después.

**Tiempo real:** ~45–90 min nuestros limpio (ya ejecutado 2 veces: bot
propio y BE) + esperas de Meta si hay verificación de por medio (días).

**Dos variantes, no confundirlas:**
- **En la cuenta DEL cliente** (partner access): la correcta, escalable,
  cobrable. El cliente queda dueño de su WABA y su factura Meta.
- **Bajo NUESTRA WABA**: solo pilotos (techos duros: límite de mensajería
  compartido, tope 20 números, la factura Meta cae en nuestra tarjeta,
  1–3 pilotos con consentimiento escrito, máximo).

**Veredicto: es la ruta de HOY para cerrar ventas mientras el botón de la
Ruta 1 no exista, y queda para siempre como "asistencia guiada" para el
cliente al que hasta el popup le cuesta.**

### Ruta 4 — Plataformas conectoras / BSPs ❌ como base (plan B, referencia de UX)

**"Forja": encontrada — y no es lo que suena.** Es
[forjabots.com](https://forjabots.com/en/), de **Horizontes IA** (comunidad
hispana de ~650 personas construyendo con IA; país exacto no publicado, no
encontré ninguna "Forja" boliviana). Se autodescribe "como WordPress, pero
para chatbots de WhatsApp": un kit de piezas probadas para que **tu agente
de IA (Claude Code o Codex) te construya el bot** y lo despliegue en tu
Cloudflare. Para WhatsApp **no conecta nada por sí misma: usa Twilio o
ManyChat** como conector (métodos oficiales, no QR/Baileys). Precios:
Starter gratis (1 bot, Telegram), Community USD 57/mes (11 bots por rubro,
Agency Mode, reventa white-label a USD 2.000–3.000/proyecto).
**Veredicto: no es una conectora que resuelva nuestro alta — es un
competidor del MOTOR que ya tenemos construido (BOT-ONIA). Ni la necesitamos
ni resuelve Meta: su WhatsApp también termina en un BSP de terceros.**

**Las conectoras reales, como referencia:**

| Plataforma | Cómo hace el alta del número | Qué cobra |
|---|---|---|
| **360dialog** (BSP puro) | Embedded Signup propio, self-service | **€49/mes por número** + tarifa Meta sin markup (+4% si pagás con tarjeta) |
| **Twilio** (BSP) | Self Sign-up en su consola: registro <5 min; aprobación real días a >1 semana si hay verificación | Por mensaje sobre la tarifa Meta (fee exacto: a verificar) + el resto de su plataforma |
| **Wati** (SaaS sobre la API) | Embedded Signup dentro de su onboarding | USD 59–349/mes + **~20% de markup por mensaje** + extras (números adicionales USD 29/mes) |
| **ManyChat** (referencia de UX) | Settings → Channels → WhatsApp → Connect: popup de Embedded Signup, número propio o comprado ahí; 1–3 días si hay verificación | Pro desde USD 29/mes + costo por plantilla |

**Lectura:** todos resuelven el alta con el MISMO Embedded Signup que
nosotros vamos a encender gratis en Chatwoot. Pagar €49/número/mes o un 20%
de markup por mensaje sería duplicar costo para tercerizar un trámite que ya
tenemos casi terminado (business verification y App Review aprobados; falta
la Access Verification). **Veredicto: solo plan B si la Access Verification
se empantana semanas Y hay un cliente grande esperando
— y con permiso de gasto explícito (regla: nada pago sin aprobación).**

---

## 2. ¿Dónde ve el cliente final su chatbot? (la dimensión canal)

### A. WhatsApp con el número del negocio

El canal que el cliente pide y el que cobra el add-on. Depende de las rutas
de §1 → siempre tiene fricción Meta (popup 15 min en el mejor caso).

### B. Widget de chat web con marca Onia (sin Meta de por medio)

El motor ya es agnóstico de canal: `step()` en `bot-engine.mjs` no sabe qué
transporte lo llama, y `POST /preview` (puerto 3020, `preview-route.mjs`)
ya recibe `{knowledge, message, turnos}` y corre un turno real del motor
stateless, gateado por Bearer. Un widget es la misma mecánica con transporte
público. Dos formas:

**B1 — Encender el widget web de Chatwoot (casi cero construcción).**
Chatwoot (ya en el VPS) trae canal **Website**: inbox por cuenta de cliente
+ snippet JS embebible + bandeja para el humano + persistencia — todo ya
hecho. El mismo agent bot que atiende WhatsApp (vía `chatwoot-adapter.mjs`)
se cuelga del inbox Website. Construcción nuestra: crear el inbox y pegar el
snippet en la web del cliente (~30 min).
**La baja:** la marca. Verificado en el código de la v4.12.0 que corremos:
en plan community un job diario resetea `disable_branding` — el widget va a
decir "Powered by Chatwoot" sí o sí. El título, avatar y colores del widget
SÍ son del negocio ("Asistente de Clínica X"); la marquita queda al pie.
**A verificar:** que nuestro agent bot responda en un inbox Website igual
que en WhatsApp (el adapter se probó con WhatsApp; la API de agent bots es
la misma, pero verificar es MIRAR).

**B2 — Widget propio marca Onia sobre el motor (construir).**
Qué falta exactamente sobre lo que ya existe:

| Pieza | Estado |
|---|---|
| Motor de conversación + validador de knowledge | ✅ existe (`bot-engine.mjs`, `knowledge.mjs`) |
| Endpoint que corre un turno | ✅ `/preview` — pero es stateless, Bearer privado, pensado para el probador del editor |
| Endpoint público por cliente (`/chat/<slug>` con token público) | ✗ |
| Rate limit + CORS + tope de payload por origen | ✗ (el server ya tiene `maxBodyBytes`; rate limit por IP/slug no) |
| Persistencia de conversación por visitante | ✗ para web (`persistence.mjs` existe pero clavado a conversaciones WhatsApp/Chatwoot) |
| Snippet JS embebible + burbuja UI + página `onia.com.bo/chat/<slug>` | ✗ |
| **Handoff a humano** (¿a qué bandeja cae cuando el bot deriva?) | ✗ — sin esto el bot web es un callejón; la salida natural es crear la conversación en Chatwoot vía API… y entonces B1 ya te daba todo |

Estimación: **chico (1–2 días)** para una demo sin persistencia ni handoff
(sirve para vender, no para operar) · **mediano (3–5 días)** para la versión
honesta con persistencia + handoff vía API de Chatwoot · grande solo si se
quisiera bandeja propia sin Chatwoot (no: eso ya se decidió A→B).

**Precedentes:** Intercom y Crisp cobran el widget como producto entero
(el messenger ES su negocio); Chatwoot es exactamente ese widget, gratis,
ya corriendo en nuestro VPS. Construir B2 solo compra quitar la marquita
"Chatwoot" — el mismo dilema de marca blanca ya evaluado y descartado en el
research multicliente ("lo que Onia vende es el agente, no la bandeja").

### C. Híbrido (la jugada) ✅

Arrancar TODO cliente con el widget (B1) el día 1 — cero fricción de Meta,
el bot queda vivo en su web la misma semana — y migrar/sumar WhatsApp cuando
pase el alta de §1. El conocimiento sembrado es el mismo (`knowledge` no
sabe de canales), el motor es el mismo, la bandeja es la misma. **Esto
desbloquea VENDER y cobrar el add-on antes de que el cliente tenga Meta
configurado** — el alta de WhatsApp deja de ser bloqueante de facturación y
pasa a ser un paso 2 del onboarding.

---

## 3. Tabla comparativa

Rutas de alta (arriba) + canales (abajo). "Primer mensaje" = del contrato
firmado al primer mensaje real respondido por el bot. [Tiempos: estimación
propia anclada en las 2 altas ya ejecutadas y los tiempos publicados por
Meta/BSPs.]

| Opción | Esfuerzo nuestro | Fricción del cliente | Costo | Primer mensaje | Riesgo | ¿Vende antes de Meta? |
|---|---|---|---|---|---|---|
| **R1 Embedded Signup (Chatwoot)** | Una vez: ~1 día trámite + prueba. Por cliente: **~5 min** | Popup ~15 min con su Facebook | Cero (Meta la paga el cliente) | Mismo día (tras encendido; hoy: +1–7 días de trámite) | Popup self-hosted puede fallar (probar); techo 10 altas/semana sin gates | ✗ |
| **R2 Video tutorial pagado** | Grabar 1 vez | ALTÍSIMA: alta manual nivel developer | El cliente paga por trabarse | Días–semanas, si llega | Abandono + soporte + culpa nuestra | ✗ |
| **R3 Done-for-you (cuenta del cliente)** | ~1–1,5 h + videollamada | 30 min de llamada, cero técnica | Cubierto por la mensualidad (no hay cargo inicial) | 1–3 días (esperas Meta) | Esperas de verificación; depende de que el dueño del Facebook aparezca | ✗ |
| **R3b Done-for-you (nuestra WABA)** | ~1 h | Cero | Factura Meta cae en NUESTRA tarjeta | 1 día | Techos duros: solo 1–3 pilotos | ✗ |
| **R4 BSP (360dialog/Twilio/Wati)** | ~½ día integrar | Popup similar a R1 | €49/mes/número o ~20% markup/mensaje — recurrente | 1–7 días | Dependencia + costo recurrente por cliente; requiere permiso de gasto | ✗ |
| **Canal B1: widget Chatwoot** | **~30 min por cliente** (+ 1 día de prueba una vez) | Pegar un snippet en su web (o lo pegamos nosotros) | Cero | **Mismo día** | Marca "Chatwoot" al pie; agent bot en Website sin verificar | ✅ |
| **Canal B2: widget propio Onia** | 3–5 días construir | Igual a B1 | Cero recurrente | Semana 1 (tras construir) | Reinventa lo que B1 ya da; solo compra la marca | ✅ |
| **Canal C: híbrido B1→WhatsApp** | B1 + R1/R3 después | Escalonada: hoy nada, popup después | Cero extra | **Mismo día** (widget) | El cliente puede acomodarse al widget y patear el alta Meta (mitigar: el alta WhatsApp va agendada en el onboarding) | ✅ |

---

## 4. Qué cobramos en cada una

Regla marco: el add-on ya está preciado (**Bs 390/mes o Bs 3.900/año, sin cargo
inicial**, `pricing.ts`). Ninguna ruta crea un precio nuevo sin decisión de Sergio.

Sin instalación, el alta de Meta ya no tiene un cobro propio detrás: **es costo
nuestro de onboarding**. Por eso la ruta barata en horas (R1, ~5 min) dejó de ser
"margen sobre la instalación" y pasó a ser lo único que hace rentable el alta.

| Ruta/canal | Qué se cobra |
|---|---|
| R1 Embedded Signup | Nada extra: el alta va incluida en el add-on y nos cuesta ~5 min. Es la única ruta cuyo costo de alta se recupera en el primer mes |
| R2 Video | **No se vende.** El video-guía del popup va incluido como material de onboarding |
| R3 Done-for-you | Incluido, sin cargo aparte — pero cuesta ~1–1,5 h nuestras y ya no hay instalación que las pague: son ~3 meses del add-on. Empujar a R1 siempre que se pueda. **Excepción cotizable aparte:** rescate de cuentas Meta heredadas rotas (Business Manager perdido, verificación trabada, número secuestrado en otra WABA) = servicio técnico a medida, como ya contempla el pricing ("lo que no entre en el estándar se cotiza a medida") |
| R4 BSP | Si algún día se usa: el fee del BSP se traslada al cliente como **costo de terceros excluido** (regla dura de propuestas #5) — nunca absorberlo en el precio |
| Canal widget (B1/C) | Mismo add-on: es el MISMO bot por otro canal. El botón wa.me sigue incluido gratis; lo cobrado es el bot con IA, salga por donde salga. Si Sergio quiere un escalón "solo widget web" más barato como puerta de entrada, es una decisión de pricing NUEVA → pendiente suyo, no de este doc |
| Mensualidad Bs 390 | Cubre motor + bandeja + soporte del canal. El "+ Meta por consumo" queda en la WABA del cliente con SU tarjeta (crítico antes del 1-oct-2026, cuando Meta cobra la ventana de 24 h) |

---

## 5. El número del cliente — casos y costos

> Pregunta de Sergio: ¿el cliente pierde su número al conectar el chatbot?
> **No** — con coexistencia conserva número Y app; migrar o estrenar número
> son elecciones, no obligaciones. Todo verificado **2026-08-17** en
> developers.facebook.com (Meta cambia reglas: regla de re-verificación al
> pie de esta sección).

### Caso A — Conserva su número Y su app (coexistencia) ✅ el default

Disponible HOY vía Embedded Signup ("onboarding business app users").
Verificado 2026-08-17:

- **Requisito del cliente:** tener **WhatsApp Business app ≥ 2.24.17** en el
  teléfono (la app de consumidor NO califica → Caso B o C). Del lado
  nuestro: ser Tech Provider (§1, en trámite).
- **Qué conserva:** su número, su app y sus chats en el teléfono. El mismo
  número atiende por la app Y por el bot/panel a la vez.
- **Qué se sincroniza al panel:** solo los últimos **6 meses** de chats 1:1
  (media de >14 días llega sin asset); hay **24 h** para completar la sync o
  se repite el flujo.
- **Qué NO entra / se le apaga en la app:** los **grupos no se sincronizan**;
  se desactivan mensajes temporales, "ver una vez" y ubicación en vivo en
  chats 1:1, y las **listas de difusión**; throughput tope 20 msg/s.
- **Reversible por el cliente:** desde su app (Ajustes > Cuenta > Plataforma
  de negocios > Desconectar); nos llega el webhook `PARTNER_REMOVED`.
- **¿Bolivia?** El doc de Meta **no publica ninguna lista de países
  excluidos** (re-visto 2026-08-17: la página no tiene sección de países).
  Aun así, la prueba con un +591 real sigue siendo el gate antes de
  prometerla (§6.3).

### Caso B — Migra el número a la API, sin coexistencia

Para el cliente que quiere operar 100% desde el panel, o cuyo número está en
el WhatsApp de consumidor. Proceso (verificado 2026-08-17): en la app,
**Ajustes > Cuenta > Eliminar mi cuenta** → esperar ~3 min → registrar el
número en la API.

- **Pierde:** TODO el historial ("your existing messaging history will be
  lost" — irrecuperable: exigir backup antes) y el uso de la app con ese
  número mientras viva en la API.
- **Reversible a medias:** desregistrando el número de Cloud API puede volver
  a usarse en la app — pero los chats borrados no vuelven.

### Caso C — Número nuevo

- **Cuándo conviene:** número personal mezclado con el negocio; quiere línea
  comercial separada; o su número cae en el Caso D. En Bolivia un chip
  prepago cuesta **~Bs 10–20** — único costo del caso.
- **Requisitos del número (2026-08-17):** propio del cliente, con código de
  país y área, capaz de **recibir SMS o llamada** (así lo verifica Meta);
  móvil recomendado, fijo también sirve.

### Caso D — "Con ESE número no se va a poder" (o no todavía)

- **Número baneado por WhatsApp:** "must be unbanned via the appeal process
  first" (2026-08-17). Sin apelación exitosa no se registra. Jugada: apelar
  y arrancar YA con Caso C.
- **Número registrado en otra BSP/WABA** (cliente que viene de Wati,
  360dialog, etc.): **no está perdido** — Meta soporta migrar números entre
  WABAs conservando el número (2026-08-17). Requiere coordinar con la
  plataforma saliente (bajar el 2FA del número). Trámite, no bloqueo.
- **Ojo al timing:** un número que envió mensajes pagos en los últimos 30
  días no se puede borrar de su WABA (2026-08-17) — retrasa migraciones, no
  las impide.

### Qué cobra Meta en todos los casos

**Nada por el número ni por el registro** (verificado 2026-08-17: ni la doc
de pricing ni la de phone numbers mencionan cargo por alta o tenencia del
número). Meta cobra **por mensaje de plantilla entregado** (desde
1-jul-2025), según categoría y país; las conversaciones de servicio son
gratis **hasta el 1-oct-2026**. El detalle del cambio y el costeo del add-on
ya están en `ONIA_FECHAS_CRITICAS_PLAN.md` §3 (checkpoint 1-sep: re-descargar
el CSV de tarifas) — no re-investigar acá.

### Tabla de decisión para la venta

| Perfil del cliente | Ruta | Qué le decimos | Costo extra |
|---|---|---|---|
| Ya atiende por WhatsApp Business app y quiere seguir con su teléfono (el típico) | **A — Coexistencia** | "Conservás tu número y tu app; el bot atiende el mismo número. Se apagan temporales, 'ver una vez' y difusiones; los grupos no entran al panel" (aviso en contrato, §7.4) | Bs 0 |
| Quiere operar 100% en panel / varios operadores, no necesita la app | **B — Migración** | "Tu número pasa a la plataforma; la app deja de funcionar con ese número y el historial se pierde — backup antes. Podés volver, sin chats" | Bs 0 |
| Número personal mezclado con el negocio | **C — Número nuevo** | "Estrenamos línea comercial; tu número personal queda intacto" | Chip ~Bs 10–20 (lo compra el cliente) |
| Su número está baneado | **D → apelar; mientras, C** | "Ese número está bloqueado por Meta; apelamos, y arrancamos con línea nueva para no esperar" | Chip ~Bs 10–20 |
| Viene de otra plataforma (Wati, 360dialog, …) | **D — Migración entre WABAs** | "Tu número se muda con nosotros, no se pierde; coordinamos la salida con tu proveedor actual" | Bs 0 |

**Regla de mantenimiento (checkpoint tipo 1-sep):** re-verificar **cada mes
— y siempre antes de prometerle coexistencia a un cliente —** la página de
Meta de coexistencia (onboarding-business-app-users, en Fuentes) y la de
pricing; fechar cada afirmación al citarla. El checkpoint del 1-sep-2026
(CSV de tarifas) ya vive en `ONIA_FECHAS_CRITICAS_PLAN.md` §1.

---

## 6. Recomendación (alta + canal, en secuencia)

**Lo que se le puede prometer a un cliente HOY:** el bot atendiendo su WhatsApp con el
alta hecha por nosotros (R3 / §1.2). Nuestra WABA está viva: **+591 75414930**, calidad
**GREEN**, tier **250**, `can_send_message: AVAILABLE` (verificado 2026-08-21). **No** se
promete todavía el botón de auto-conexión, ni la WABA propia del cliente, ni coexistencia:
faltan el Configuration ID y las env vars (la Access Verification ya está ✅). Lo que no está
encendido no se nombra — nada de "muy pronto". Tabla completa en
`ONIA_CHATBOT_LINEA_DE_ENTREGA.md` §0.1.

**Hoy (esta semana, con 0–3 clientes):**
1. **Canal: encender B1** — crear un inbox Website en Chatwoot, colgarle el
   agent bot y MIRAR una conversación completa (verificación real, no grep).
   1 día. Desde ahí, todo cliente nuevo tiene bot vivo el día 1 sin Meta.
2. **Alta WhatsApp: R3 done-for-you** en la cuenta del cliente (partner
   access, runbook ya escrito). Nuestra WABA solo si es piloto y firma
   consentimiento.
3. **En paralelo, destrabar R1**: App Review ✅ **APROBADO el 2026-08-21** y
   **Access Verification ✅ VERIFICADA (mirada en el panel el 2026-08-28)** —
   Meta ya no debe nada. Queda lo nuestro: Configuration ID (hoy no existe
   ninguna configuración) → dominio del JS SDK (resolver antes cuál de los dos
   hostnames sirve el popup) → 3 env vars (hoy vacías) → **probar el popup con
   un +591 real** (la prueba de coexistencia de 20 min incluida — nunca
   prometer coexistencia a un boliviano sin haberla pasado).

**Cuando el botón funcione (Meta ya no debe NADA: queda ~1 día nuestro):**
4. **R1 Embedded Signup pasa a ser el camino estándar** y R3 queda como
   "asistencia guiada" en videollamada para el cliente no técnico (mismo
   popup, nosotros mirando). El costo de alta por cliente cae a minutos.
5. Grabar el **video-guía del popup** (una vez, 3–4 min) como material de
   onboarding incluido — ese es el destino correcto de la idea de la Ruta 2.

**Siempre:** el canal híbrido C es el default comercial — widget el día 1,
WhatsApp agendado como paso 2 del onboarding con fecha, para que nadie se
quede a vivir en el widget.

**Nunca:** R2 como producto pagado; R4 sin permiso de gasto explícito;
altas nuevas bajo nuestra WABA más allá de 3 pilotos.

---

## 7. Qué depende de Sergio

1. **App Review: ✅ APROBADO (2026-08-21)** y **Access Verification: ✅
   VERIFICADA (2026-08-28, mirada en el panel)** — de Meta no depende nada más.
   Lo que queda de la Ruta 1 es nuestro (~1 día) + la prueba con tu número (punto 2).
2. **Un número +591 real de prueba** para el test de Embedded Signup +
   coexistencia (20 min, con la app WhatsApp Business instalada).
3. **Decisión de pricing**: ¿existe un escalón "solo widget web" más barato
   que el add-on completo, o el widget va siempre dentro del add-on? (Si sí,
   se cambia en `pricing.ts`, único archivo que cobra.)
4. **Contrato**: incluir (a) la cláusula de que el super admin puede
   impersonar cuentas de la bandeja (capacidad real de Chatwoot, declararla
   antes de que la descubran) y (b) el aviso de coexistencia (qué se apaga
   en su app: temporales, "ver una vez", difusiones; grupos no
   sincronizados).
5. **Permiso de gasto** solo si se activara el plan B de BSP (hoy: no).

---

## 8. Sin verificar

- **Desde cuál de los dos hostnames del Chatwoot se sirve el popup** del Embedded
  Signup (`chat.onia.com.bo` vs. el de Easypanel, que es el del webhook). Define
  qué dominio se autoriza en el JS SDK de la app; autorizar uno solo puede no
  alcanzar.
- Que el Embedded Signup funcione en NUESTRO Chatwoot self-hosted concreto
  (reportes de popup que no abre en self-hosted; la prueba con número real
  es parte del encendido).
- Que el **agent bot responda en inbox Website** igual que en WhatsApp (el
  adapter solo se probó con WhatsApp).
- **Coexistencia disponible en Bolivia**: probable (trackers de terceros la
  listan; cobertura global reportada), pero ninguna fuente oficial de Meta
  publica lista de países — re-confirmado 2026-08-17 (el doc de coexistencia
  no tiene sección de países). Prueba de 20 min con +591 pendiente.
- Fee exacto por mensaje de Twilio WhatsApp (no verificado en su pricing).
- País/razón social de Forja/Horizontes IA (la web no lo publica).
- Que `clinic_settings`/`/admin` sigan siendo el lugar donde aterrizan las
  credenciales en `onia-platform` (dato del contexto del carril; ese repo no
  está en este worktree).

---

## Fuentes

**Meta (oficial):**
- Tech Provider get started: <https://developers.facebook.com/documentation/business-messaging/whatsapp/solution-providers/get-started-for-tech-providers>
- Embedded Signup overview (v2 deprecada 15-oct-2026; límites 10→200/semana): <https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/overview/>
- Onboard WhatsApp Business app users (coexistencia): <https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users/>
- Messaging limits (250/24 h sin verificación del cliente): <https://developers.facebook.com/documentation/business-messaging/whatsapp/messaging-limits>
- Migrar un número existente a la API (proceso, pérdida de historial, desregistro) — verificado 2026-08-17: <https://developers.facebook.com/docs/whatsapp/cloud-api/get-started/migrate-existing-whatsapp-number-to-a-business-account>
- Phone numbers Cloud API (requisitos del número, baneados/apelación, migración entre WABAs, regla 30 días) — verificado 2026-08-17: <https://developers.facebook.com/docs/whatsapp/cloud-api/phone-numbers>
- Pricing (por mensaje desde 1-jul-2025; sin cargo por número) — verificado 2026-08-17: <https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing>

**Chatwoot:**
- Embedded Signup self-hosted (3 env vars) — re-verificado 2026-08-17: <https://developers.chatwoot.com/self-hosted/configuration/features/integrations/whatsapp-embedded-signup>
- Fallas conocidas self-hosted: <https://github.com/orgs/chatwoot/discussions/13899> · <https://github.com/chatwoot/chatwoot/issues/13154>

**Conectoras:**
- Forja (Horizontes IA): <https://forjabots.com/en/>
- 360dialog pricing: <https://360dialog.com/pricing> · <https://docs.360dialog.com/partner/get-started/pricing>
- Twilio Self Sign-up: <https://www.twilio.com/docs/whatsapp/self-sign-up> · Tech Provider program: <https://www.twilio.com/docs/whatsapp/isv/tech-provider-program>
- Wati pricing (terceros): <https://setsmart.io/blog/wati-pricing> · <https://chatarmin.com/en/blog/wati-pricing>
- ManyChat WhatsApp connect: <https://help.manychat.com/hc/en-us/articles/19247843644060> · pricing: <https://flowgent.ai/blog/manychat-pricing>

**Internos:** `ONIA_CHATBOT_LINEA_DE_ENTREGA.md` (línea de montaje + detalle
Embedded Signup §1) · `historial/ONIA_MODELO_MULTICLIENTE_CHATBOT_20260802.md` (git
`456c2bc8`: coexistencia, marca blanca, multi-cuenta) ·
`ONIA_WHATSAPP_CHATWOOT_META_SALES_AUDIT_2026.md` (runbook de acceso sin
passwords) · `historial/ONIA_META_WHATSAPP_CLIENTES_20260808.md` (runbook
Tech Provider) · motor: `hermes-content/deploy/vps-ops/bot/`
(`bot-engine.mjs`, `preview-route.mjs`, `chatwoot-adapter.mjs`,
`webhook-server.mjs` puerto 3020).

---

## Prueba E2E 2026-08-17 — el chatbot por cliente ya es REAL (paso b + widget cara Onia)

Sesión carril motor+infra. Todo lo de abajo quedó **encendido en producción y
verificado mirándolo** (curl con respuesta real + screenshots Playwright en el
scratchpad de la sesión, `bot-cliente/`).

### Qué quedó vivo

1. **Paso b — el motor lee el conocimiento POR ORGANIZACIÓN desde el producto.**
   - Producto (onia-platform, commits `662d388` + `264d8c0` en `master`):
     `GET /api/chatbot-knowledge/published?organizationId=...` con
     `Bearer BOT_KNOWLEDGE_SECRET` (timing-safe; sin env = apagado 401; solo
     sale la fila `status='publicado'`; sin fila = 404 real). Abierto en el
     middleware (`proxy.ts`) porque es server-to-server. 7 tests vitest; suite
     completa 1553 passed | 5 skipped; tsc limpio.
   - Motor (`/opt/onia/bot`, espejado acá): `knowledge.mjs` ganó la fuente
     **"db"** delante del archivo — cache por org con el MISMO TTL (5 min),
     mismo validador todo-o-nada, y degradación archivo→código si el producto
     está caído/404/doc inválido. `getKnowledge()` sigue sincrónico (jamás
     espera red en el camino del turno); `getOrgKnowledge()` (async) la espera
     solo en `/preview`. 8 tests nuevos en `knowledge.test.mjs` (suite del bot:
     508 pass; los 2 fails de leads son PREEXISTENTES, verificado contra la
     base prístina del VPS).
   - `/preview` acepta `organizationId` opcional y devuelve
     `conocimiento: {fuente, version, error}`.
   - Config: `BOT_KNOWLEDGE_SECRET` en `/opt/onia/bot/webhook.env` Y en
     `/opt/onia-platform/app.env` (mismo valor); URL default
     `http://onia-platform:3000/...` en `webhook-server.sh` (red easypanel
     compartida — verificado que el firewall NO corta ese par).

2. **Prueba punta a punta del paso b (curl real):** `/preview` con el
   `organizationId` de la org QA (`cmsvyguui000001ril9vhxbn2`) contesta
   **"ZZ QA Ferreteria Tornillo es una plataforma por módulos…"** con
   `conocimiento: {fuente:"db", version:"v2"}`; el mismo mensaje SIN
   organizationId sigue diciendo "Onia" (cero regresión del bot de leads).

3. **Deploy del producto** (runbook onia-deploy al pie): build en el VPS en
   `node:20-alpine` con `app.env` + `next build --webpack`, gates (server.js +
   node_modules + anon key en bundle + sin localhost horneado — los 3 matches
   de "localhost" son el default de Sentry Spotlight, idénticos al runtime
   anterior), standalone COPIADO, swap con backup
   (`runtime-next.prev-20260817-*`), contenedor RECREADO por la env nueva con
   sus 3 redes. Login de prod mirado renderizado: iconos como iconos.

4. **Widget con cara Onia (Chatwoot Website channel):**
   - Inbox nuevo **"ZZ QA Ferreteria"** (id 6, `website_token
     tiXym8tmNL2drsZb4WUnn1av`) en la cuenta 2 del Chatwoot del VPS (4.12.1).
   - **No hace falta agent bot**: el webhook de la cuenta 2 es a NIVEL CUENTA
     (`inbox_id NULL` → `onia-center:3020`), así que cualquier inbox nuevo ya
     dispara el motor. Lo que SÍ hizo falta: **agregar al agente "Onia Bot"
     (user 3) como miembro del inbox** — sin eso Chatwoot devuelve 401 al POST
     del motor y el bot "contesta" solo en su bitácora (delivery_status decía
     `sent` igual: bug menor conocido, el warning del adapter no se persiste).
   - Conversación real por el widget: "hola, que venden?" → el motor contestó
     en <1 s con el pitch de Onia + catálogo (screenshots
     `04-conversacion-con-bot.png`).
   - **Marca: SE PUEDE.** `installation_configs` BRAND_NAME/INSTALLATION_NAME
     → "Onia" y WIDGET_BRAND_URL → onia.com.bo: el pie del widget dice
     **"Desarrollado por Onia"** (verificado renderizado). ⚠️ Plan
     `community`: el job interno de reconcile de Chatwoot puede restaurar el
     branding enterprise — si un día vuelve a decir "Chatwoot", re-aplicar los
     3 configs (rails runner) o mover esa escritura a un cron nuestro.

### Qué falta / no verificado

- El **turno real por WhatsApp/widget todavía NO resuelve org**: el
  `organizationId` hoy entra por `options`/`/preview`; falta decidir el mapeo
  inbox→organización (custom attribute del inbox o tabla) para que cada
  conversación use el conocimiento de SU cliente en producción.
- El branding "Desarrollado por Onia" queda a merced del cron de reconcile
  (no esperé 24 h para verlo revertir).
- 2 tests de leads del motor fallan desde antes de esta sesión
  (`el lead se inserta una vez…` y `el lead nunca inventa el nombre…`).
- La migración de índices de catálogo sigue pendiente (nota 2026-08-08).

Backups: motor `/opt/onia/bot/backups/20260817-185002/`; producto
`app.env.bak-botknowledge-*` + `runtime-next.prev-20260817-*`.

## Prueba E2E 2026-08-18 — resolución por INBOX: la conversación real ya resuelve sola su organización

Cierra el pendiente de arriba ("el turno real todavía NO resuelve org"). El mapeo
elegido es el que **ya existía**: `clinic_settings.chatwootInboxId` (el superadmin
lo escribe al dar de alta) — no se inventó tabla nueva.

### Qué quedó vivo

1. **Producto (onia-platform, commit `0a4da68` en `master`, deployado):**
   `GET /api/chatbot-knowledge/published` acepta **`?inboxId=N`** como alternativa
   a `organizationId`: resuelve la org vía `clinic_settings.chatwootInboxId` y
   devuelve el mismo shape **+ `organizationId` resuelto**. `organizationId`
   explícito sigue mandando. ⚠️ `chatwootInboxId` NO es unique en el schema: si
   dos orgs lo compartieran (error de alta) gana la fila más antigua (`createdAt
   asc`, determinista). 4 tests nuevos; suite 1557 passed | 5 skipped; tsc limpio.
2. **Motor (`/opt/onia/bot`, espejado acá):**
   - `chatwoot-adapter.mjs` saca el inbox del webhook (`payload.inbox.id`, con
     respaldo `conversation.inbox_id`; en `conversation_created` el `inbox_id`
     plano) y lo pasa como `turn.inbox_id`.
   - `knowledge.mjs` keyea la cache db también por `inbox:<id>` y le pregunta al
     producto con `?inboxId=` — el motor NUNCA conoce el mapeo, lo resuelve el
     producto. `getKnowledge()` sigue sincrónico (copia vieja + refresh aparte).
   - **`ensureKnowledge()` (nuevo): la ÚNICA desviación del patrón sincrónico** —
     con la cache FRÍA de ese inbox, `resolveConfig()` espera UNA lectura acotada
     (5 s máx; en la práctica ~50 ms al contenedor de al lado) antes del primer
     turno. Sin eso, el PRIMER mensaje del cliente de la ferretería salía con la
     cara de Onia y recién el segundo con la suya. Después de ese primer intento
     (bueno o fallido) es `getKnowledge()` puro: cero red en el turno.
3. **Mapeo en la base de prod** (supabase-db, schema `public`, verificado que ES
   la base del producto: alias docker `db`, puerto 54329): UPDATE quirúrgico
   `chatwootInboxId=6` en la fila de `cmsvyguui000001ril9vhxbn2`, con backup CSV
   en `/opt/onia/backups/db/clinic_settings_cmsvyguui_20260818-*.csv`.

### La prueba (mirada, no supuesta)

- **Conversación NUEVA en el widget de la ferretería** (página de prueba
  `bot-cliente/ferreteria.html`, inbox 6) → "hola, qué venden?" → **la PRIMERA
  respuesta ya dice "ZZ QA Ferreteria Tornillo es una plataforma por
  módulos…"** — sin organizationId manual en ningún lado. Screenshots
  `e2e-ferreteria-widget*.png` (scratchpad `bot-cliente/`).
- **Regresión cero en el bot de leads:** curl al webhook con un `message_created`
  sintético del inbox 5 (Onia WhatsApp, sin mapeo) → contesta **"Onia es una
  plataforma por módulos…"** (el 404 del producto degrada a archivo/código como
  siempre). El curl usó una conversación inexistente (990001) a propósito:
  `posted:false`, nada llegó a ningún hilo real (quedó UNA fila QA
  `chatwoot:990001` en `bot_conversations`).
- Login de prod mirado renderizado post-deploy (iconos como iconos, 200).

### Qué falta / no verificado

- El primer turno WhatsApp real de un cliente (probado por widget y por curl
  sintético; el canal WhatsApp usa el mismo adapter).
- El alta de un cliente nuevo punta a punta (crear inbox + escribir
  `chatwootInboxId` desde el panel superadmin) — hoy se cargó por SQL.
- Los 2 tests de leads preexistentes siguen fallando (sin cambios); en el VPS
  además fallan 4 tests db del conocimiento por el `knowledge.json` vivo en el
  cwd (ambiental, idéntico ANTES y después — verificado contra backup).

Backups: motor `/opt/onia/bot/backups/20260818-024342/`; producto
`runtime-next.prev-20260818-024637/` + `build-src-0a4da68/`.

## Prueba E2E 2026-08-18 — MODO RECEPCIONISTA: el bot del cliente ya atiende como SU asistente

Cierra el hueco que dejaba la resolución por inbox: la conversación resolvía a la
org pero contestaba con el **funnel de VENTA de Onia con el nombre cambiado**
("ZZ QA Ferreteria Tornillo es una plataforma por módulos…") — inaceptable para
vender el add-on. Ahora, con conocimiento de fuente **"db"** (org resuelta), el
motor enciende `config.modo = "recepcionista"`: se presenta como el asistente
DEL negocio y atiende como recepcionista. El funnel de leads (DEMO, calificación,
M4) queda **EXCLUSIVO del modo venta**.

### Qué quedó vivo (motor `/opt/onia/bot`, espejado acá)

1. **`recepcionista.mjs` (nuevo)** — router del modo: saludo M0R ("Soy el
   asistente de <productName> 🙂" + ofrece horarios/servicios/pedido), FAQ
   renderizadas SOLO desde el knowledge de la org (`R_HORARIO` con
   `empresa.horario.frase`, `R_SERVICIOS` con `productos` — sin la vara
   MODULOS_LISTOS, que es un candado de Onia —, `R_CITA` con
   `demo.duracionFrase/modalidad`). Pedido/compra/cita (`R_INTERES`), precio
   (`R_PRECIO`, jamás una cifra), queja, "quiero un humano" y todo lo fuera de
   guion **ESCALAN a handoff real** (review_queue + aviso) — "te confirma
   {{humano}}" solo se dice si alguien de verdad se entera. Campo ausente en el
   knowledge = respuesta honesta `R_NO_DATO` + handoff (nunca rellena con los
   datos de Onia). **LLM APAGADO en este modo** (decisión: el prompt de la rama
   libre ancla al pitch de Onia; parametrizarlo queda pendiente). Sin etapa
   nueva de estado: la conversación vive en `nuevo` (el saludo se marca con
   `opt_in_source='inbound_recepcion'`) hasta handoff/opt-out.
2. **Activación**: `knowledge.mjs → withKnowledge()` enciende el modo SOLO con
   fuente "db" (`asRecepcionista()`); archivo/código = cara Onia, funnel igual
   que siempre. `/preview` con `organizationId` también lo muestra (el borrador
   explícito del editor sigue corriendo el funnel — pendiente). `resolveConfig()`
   ya no consulta Cal.com para un inbox de cliente.
3. **Plantillas** en `config.mjs` (M0R, M0R_INTRO, R_HORARIO, R_SERVICIOS,
   R_CITA, R_INTERES, R_PRECIO, R_DERIVA, R_NO_DATO, R_ATTACH, M6R — opt-out sin
   "escribí DEMO"). Intents nuevos en `intents.mjs` (saludo, horario de
   atención, info de cita, interés de pedido); el resto reusa los existentes.
4. **Migración `20260818_bot_recepcion_opt_in_source.sql`** (aplicada a mano en
   prod): el CHECK de `opt_in_source` solo conocía el funnel y hacía fallar
   `saveConversation` ENTERO con 23514 — la conversación del cliente no
   persistía **ni el handoff** (el bot hubiera seguido contestando encima del
   humano). Descubierto MIRANDO el E2E: la fila quedaba en `nuevo`/NULL.
5. **Knowledge de la org QA a v3** (fila `cmsvz69in000n01riwdkyzy9d`, backup CSV
   en `/opt/onia/backups/db/chatbot_knowledge_cmsvyguui_*.csv`): la v2 no traía
   `horario.frase` ni `productos`, así que el bot (bien) derivaba honesto en vez
   de contestar la FAQ.
6. **Tests**: guion nuevo "recepcionista-ferreteria" en `simulate.mjs` + 12
   tests en `bot-engine.test.mjs` + 1 en `knowledge.test.mjs` (withKnowledge db
   → modo). Suite local **527/529** (solo los 2 de leads preexistentes); VPS
   **523/529** (los mismos 2 + los 4 ambientales conocidos del `knowledge.json`
   vivo). Ninguno nuevo.

### La prueba (mirada, no supuesta) — screenshots `bot-cliente/e2e-0*.png`

Conversación NUEVA en el widget de la ferretería (inbox 6, `chatwoot:23`):

- **"hola"** → "¡Hola! Soy el asistente de ZZ QA Ferreteria Tornillo 🙂 · Te
  puedo contar nuestros horarios y qué ofrecemos, o tomar tu pedido…" — cero
  "plataforma por módulos", cero DEMO, cero horarios de venta.
- **"¿qué días atienden?"** → "Atendemos lun-vie, 8:00-18:00" (del knowledge v3).
- **"¿qué venden?"** → catálogo de la org en viñetas (tornillería, herramientas),
  sin "en construcción, sin humo".
- **"quiero comprar 100 tornillos"** → "¡Buenísimo! Ya le paso tu pedido a
  Sergio — te confirma por este mismo chat." + `bot_stage=handoff_humano`
  persistido (verificado en la base).
- **"¿me confirmás?"** → SILENCIO (handoff en curso: el bot no habla encima del
  humano). Captura `e2e-07-silencio-post-handoff.png`.
- **No-regresión del bot de leads**: curl sintético al webhook con inbox 5 y
  conversación inexistente (990002) → M0 del funnel con horarios reales de
  Cal.com + "Onia es una plataforma por módulos…" intactos; `posted:false`
  (nada llegó a un hilo real).

### Qué falta / no verificado

- El canal WhatsApp real de un cliente (probado por widget + curl; mismo adapter).
- La rama LLM del modo recepcionista quedó APAGADA (fuera de guion = humano);
  parametrizar el prompt al negocio es trabajo futuro.
- `/preview` con `knowledge` explícito (borrador del editor) sigue mostrando el
  funnel — decidir si el probador del editor debe simular el modo recepcionista.
- Cómo muestra el panel el estado `opt_in_source='inbound_recepcion'` (dato
  nuevo, no mirado en el panel).
- Filas QA sintéticas en `bot_conversations` (chatwoot:20-22 en `nuevo` por el
  bug ya corregido, 990777-990779, 990002): basura de prueba, inofensiva.

Backups: motor `/opt/onia/bot/backups/20260818-033640/`; fila knowledge QA
`chatbot_knowledge_cmsvyguui_*.csv`; constraint viejo documentado en la
migración.

## Alta desde el panel (2026-08-18) — el inbox del cliente se crea en UN CLICK

Cierra el pendiente de arriba ("el alta de un cliente nuevo punta a punta hoy se
cargó por SQL"). El alta del chatbot de una organización ya NO toca SQL ni la
consola de Chatwoot: es un botón del panel superadmin.

### Qué quedó vivo (onia-platform, commit `c84a1c0` en `master`, deployado)

1. **Pantalla `/admin/chatbots`** (SUPERADMIN): tabla de TODAS las orgs con su
   estado — inbox vinculado (`clinic_settings.chatwootInboxId` o "Sin inbox"),
   conocimiento (`vN · publicado` / "Sin publicar") y el `organizationId` en
   mono para soporte (el editor `/settings/chatbot` vive en la sesión de cada
   org: un link cross-tenant no abriría).
2. **Fila "Bot de Onia (ventas)" arriba de la tabla**: inbox 5, modo venta, y el
   estado EN VIVO del motor — fetch server-side a `http://onia-center:3020/health`
   por la red easypanel (timeout 3 s; motor caído se MUESTRA caído, no rompe el
   panel): ok/no, base con latencia, `knowledge.source/version`. Con la nota
   honesta: su conocimiento vive en el `knowledge.json` del VPS y se edita por
   deploy, no desde el panel (todavía).
3. **`POST /api/admin/chatbots`** — el alta en un click, todo server-side:
   crea el inbox **Website** en Chatwoot con el nombre de la org, agrega el
   agent bot (user 3) como miembro (sin eso Chatwoot devuelve 401 al POST del
   motor — incidente del 17-ago) y escribe `clinic_settings.chatwootInboxId`.
   **Idempotente en dos capas**: org ya vinculada → no se toca Chatwoot; inbox
   homónimo ya creado (alta anterior a medias) → se reusa, no se duplica. Sin
   env de Chatwoot → 503 con el mensaje literal de qué falta. 9 tests nuevos;
   suite 1566 passed | 5 skipped; tsc limpio.
4. **Env reales en `/opt/onia-platform/app.env`** (antes eran placeholders
   `https://app.chatwoot.com` / `SIN_CONFIGURAR`): `CHATWOOT_BASE_URL=
   http://onia-chatbot_chatwoot:3000` (URL interna por la red easypanel —
   verificada con curl desde el contenedor del producto), `CHATWOOT_API_TOKEN`
   (token de ADMIN de la cuenta 2, extraído de la base de Chatwoot como hace
   `chatwoot-onboard.sh` — nunca del repo), `CHATWOOT_ACCOUNT_ID=2`. Contenedor
   `onia-platform` RECREADO (docker restart no relee env) con sus 3 redes;
   backup `app.env.bak-chatwoot-*` + `container-env-backup-*.txt`.
5. **Cuenta SUPERADMIN creada — no existía ninguna** (verificado en la base:
   cero perfiles con ese rol). Acceso mínimo honesto: usuario
   `superadmin@onia.com.bo` (GoTrue admin API) + org `Onia (interna)`
   (slug `onia-interna`, onboarding marcado para que el layout no lo mande al
   wizard) + perfil rol SUPERADMIN. La contraseña NO está en ningún repo:
   `/root/onia-superadmin.credentials` en el VPS (chmod 600).

### La prueba (mirada, no supuesta) — capturas `bot-cliente/0*.png`

- Estado inicial honesto: se desvinculó la org QA (`chatwootInboxId=NULL`, backup
  CSV `clinic_settings_cmsvyguui_pre-alta-panel_*.csv`) para probar el alta REAL.
- Login superadmin → `/admin/chatbots`: fila del bot de Onia con **Motor OK ·
  Base OK · 9 ms · Conocimiento: file · 2026-08-06.1** (captura
  `01-admin-chatbots.png`).
- Click **"Crear inbox web + vincular"** en ZZ QA Clinica Chatbot → la fila pasa
  a **#7** y "Vinculada — el bot atiende su widget" (captura
  `02-alta-vinculada.png`). Verificado en las DOS bases: `chatwootInboxId=7` en
  clinic_settings; inbox 7 `Channel::WebWidget` con el user 3 como miembro en
  Chatwoot.
- Widget de ESA clínica (página de prueba con el `website_token` del inbox 7) →
  "hola" → la PRIMERA respuesta es el **recepcionista** con el conocimiento
  publicado de la org: "¡Hola! Soy el asistente de ZZ QA Ferreteria Tornillo 🙂…"
  + botones Horarios/Servicios/Hablar con Sergio + pie "Desarrollado por Onia"
  (capturas `03/04-widget-*.png`). ⚠️ Dice "Ferreteria Tornillo" porque ESE es el
  `productName` dentro del knowledge v3 de la org `cmsvyguui…` (dato QA viejo);
  la org en el producto se llama "ZZ QA Clinica Chatbot". No es un error de
  ruteo — al contrario: probó que sirvió el conocimiento de ESA org resuelto por
  inbox.
- Post-deploy: login de prod mirado renderizado (iconos como iconos,
  `05-login-postdeploy.png`); `docker logs` sin errores nuevos.

### Qué falta / no verificado

- El **inbox 6** ("ZZ QA Ferreteria") quedó huérfano en Chatwoot: ninguna org lo
  mapea, así que una conversación ahí degradaría a la cara Onia (404 del
  published). Basura QA inofensiva; borrarlo es decisión aparte.
- El editor de conocimiento por org sigue siendo por sesión de la org; el panel
  solo muestra el `organizationId`.
- El conocimiento del bot de Onia sigue en `knowledge.json` (deploy) — editarlo
  desde el panel es el paso siguiente natural.
- WhatsApp real de un cliente: sin probar (mismo adapter que el widget).

Backups: producto `runtime-next.prev-20260818-042252/` + `build-src-c84a1c0/`;
env `app.env.bak-chatwoot-20260818-*`; fila QA
`clinic_settings_cmsvyguui_pre-alta-panel_20260818-042151.csv`.

---

## Capacidades ricas del bot — factibilidad (imágenes · botones · comprar por chat)

> Investigación 2026-08-17 (solo lectura del motor + fuentes fechadas; el motor
> NO se tocó — otro carril estaba trabajando en `/opt/onia/bot`). Responde la
> pregunta de Sergio: ¿qué tan real es que el bot del cliente reciba/mande
> imágenes, tenga botones y que el cliente final COMPRE por el chat?

### F1. Imágenes ENTRANTES (el cliente final manda una foto)

**Qué entrega Chatwoot al webhook (verificado en el código del motor, forma
capturada en vivo 2026-07-26):** `message_created` trae `attachments[]` con
`file_type` (`audio`/`image`/`file`) y `data_url` (URL del archivo en el host
público de Chatwoot). Es exactamente lo que ya consume la transcripción de voz:
`audio-transcribe.mjs` resuelve la URL contra NUESTRA base (defensa SSRF:
`resolveAttachmentUrl` conserva solo ruta+query), la baja con tope de bytes y
timeout, y autentica con `api_access_token`.

**Reconocerla y escalarla a humano: YA EXISTE, esfuerzo CERO.** El adapter
clasifica el mensaje (`kindOf()` → `attachment` cuando hay adjunto no-audio sin
texto) y `bot-engine.mjs` (~línea 453) hace handoff con
`M_ATTACH_BODY: "Recibí tu archivo. Lo mira {{humano}}, no lo puedo leer bien
yo."` — con el nombre del humano de la org vía knowledge. O sea: la conducta
"te mando con \<humanName\>" es la conducta ACTUAL del motor, en widget y
WhatsApp (mismo adapter). Solo falta mirarla en una conversación real con foto
(se probó con audio, no con imagen).

**Visión IA (que el bot ENTIENDA la foto): factible, mediano.** El bot ya habla
con LiteLLM (`onia_selfhosted-litellm-1:4000/v1`) y su modelo default
`gpt-4o-mini` (`ONIA_BOT_MODEL`, `run-turn.mjs:162`) es multimodal: la MISMA
llamada chat/completions acepta la imagen en base64. Piezas: generalizar la
descarga que ya existe para audio → armar content multimodal → prompt con
guardrails. Costo por imagen (fuentes de pricing, 2026-08-17): **~USD
0,002–0,006** (low vs high detail) — despreciable frente al add-on.
⚠️ Regla Onia: en rubros delicados (dental: foto de una boca) la visión NO
diagnostica — describe y ESCALA a humano igual. La visión vende en comercio
("¿tienen de estos?" + foto de producto), no en clínica.

### F2. Imágenes SALIENTES (el bot manda la foto del catálogo)

**Chatwoot API: SÍ.** `POST /api/v1/accounts/{id}/conversations/{id}/messages`
acepta `multipart/form-data` con `attachments[]` (binario), documentado en el
API reference oficial, y autentica con `api_access_token` de usuario O de
**agent bot** (developers.chatwoot.com, create-new-message, 2026-08-17).

**HECHO 2026-08-18 (plomería):** `createChatwootClient().sendAttachment(convId,
{buffer, filename, contentType, caption})` en `chatwoot-adapter.mjs` — multipart
`attachments[]` + `message_type=outgoing`, tolerante por contrato (sin token /
sin bytes / 4xx ⇒ null + warning, nunca tira), con tests. **Sin uso automático
todavía, a propósito (YAGNI):** ningún flujo del motor la llama — es la base
lista para el QR del BCP y las fotos de catálogo. Falta la otra mitad del
estimado original ("que el motor emita `{image}` en `send[]`"), que recién tiene
sentido con un flujo real que mande imágenes.

**WhatsApp Cloud API (developers.facebook.com, image-messages, 2026-08-17):**
imágenes **JPEG/PNG únicamente, 8-bit RGB/RGBA, máx 5 MB**, caption hasta 1024
caracteres; se manda por media `id` subido (recomendado) o por `link`. Vía
Chatwoot no llamamos esto directo: Chatwoot reenvía el adjunto saliente por su
canal WhatsApp Cloud. ⚠️ Dos límites del carril Chatwoot→WhatsApp: (a) fuera
de la ventana de 24 h un adjunto libre NO sale (solo plantillas, y el adjunto
en plantillas vía Chatwoot tiene issue abierto #12684); (b) verificar en
NUESTRO 4.12.1 que el adjunto del bot llegue al teléfono (verificar es MIRAR).
En el widget Website el adjunto renderiza nativo, sin límites de Meta.

### F3. Interactivos (botones y listas)

**WhatsApp Cloud API nativo (developers.facebook.com, 2026-08-17):**
- **Reply buttons:** máx **3 botones**, título 20 chars, body 1024, footer 60;
  el header puede ser una IMAGEN (foto de producto arriba + botones abajo).
- **List messages:** máx **10 filas** en hasta 10 secciones; título de fila 24
  chars, descripción 72, body 4096, texto del botón 20.

**Chatwoot traduce lo primero, no lo segundo.** El content type
`input_select` (items `{title, value}`) del Create Message API renderiza como
opciones clickeables en el widget Website Y Chatwoot lo convierte a **reply
buttons** en el canal WhatsApp (PR #6886) — con el límite de 3. Los content
types `cards`/`form` NO pasan al canal WhatsApp (issue #12572, confirmado en
v4.6.0), y las listas con descripción todavía no (issue #14911 abierto). O sea:
**un solo formato (`input_select`, ≤3 opciones) sirve para ambos canales**.
Más de 3 opciones en WhatsApp = pegarle directo a la Cloud API por fuera de
Chatwoot (grande, no ahora) o degradar a "respondé 1, 2 o 3" en texto (que es
lo que el guion ya hace hoy).

**HECHO 2026-08-18 — botones VIVOS en el widget (modo recepcionista):**
- **Motor:** el saludo `M0R` y el `R_DERIVA` del recepcionista salen con
  `options` (3 botones: "Horarios" / "Servicios" / "Hablar con {{humano}}" —
  si el nombre no entra en los 20 chars de Meta, cae entero a "Hablar con
  alguien", nunca truncado). `recepcionista.mjs → botonesRecepcion()`. El
  funnel de venta de Onia NO lleva botones. El click se rutea por match
  EXACTO de título o value (`botonElegido`), y en handoff el click exacto de
  un botón contesta la FAQ sin salir del handoff (texto libre sigue mudo).
- **El hallazgo que no estaba en la doc:** el click de un botón del widget
  **NO crea un `message_created`** — Chatwoot escribe
  `content_attributes.submitted_values` SOBRE el mensaje saliente original y
  dispara **`message_updated`** (verificado en vivo: mensaje 128, conv 26).
  Dos consecuencias cableadas: (1) el webhook de la cuenta 2 quedó suscripto a
  `message_created` **+ `message_updated`**; (2) el adapter mapea ese evento a
  un turno inbound con el TÍTULO elegido como texto e idempotencia
  `chatwoot:<conv>:<msg>:select:<value>` (`fromMessageUpdated`). Cualquier
  otro `message_updated` (ediciones, estados) se skipea.
- **Fallback limpio:** el texto de M0R ya dice las 3 opciones — un canal sin
  interactivos muestra el texto plano de siempre.
- **WhatsApp: queda "a probar cuando haya número"** — la traducción a reply
  buttons (PR #6886) y la vuelta del click por ese canal no se miraron en un
  teléfono real.

### F4. COMPRAR por el chat

**(a) Catálogo NATIVO de WhatsApp (product messages + carrito).** Existe y es
de Cloud API (developers.facebook.com, sell-products-and-services, 2026-08-17):
catalog messages, single/multi-product (hasta 30 productos), carrito (99
unidades por ítem). Requisitos: **catálogo subido a Commerce Manager y
conectado a la WABA** + cumplir la Commerce Policy; la doc NO publica lista de
países excluidos (mismo patrón que coexistencia: probar con +591 antes de
prometer). Los PEROS que lo sacan del MVP: (1) **Chatwoot no sabe mandar
product messages** — habría que llamar la Graph API directo con el token de la
WABA del cliente, por fuera del carril que ya funciona; (2) hay que crear y
SINCRONIZAR un catálogo Meta por cliente (catálogo org → Commerce Manager:
integración nueva entera); (3) el carrito de WhatsApp junta el pedido pero **no
cobra**: WhatsApp Pay solo existe en India/Brasil — el cobro igual termina en
un link/QR nuestro. Mucho esfuerzo para ganar solo la vitrina.

**(b) La alternativa nuestra: pedido conversacional + QR BCP como imagen.** ✅
Las piezas ya existen o son chicas:
1. El bot ya lee el conocimiento POR organización desde el producto (paso b +
   resolución por inbox, vivo — secciones E2E de arriba); el catálogo de la org
   (comercio) y tratamientos (dental) pueden viajar en ese mismo knowledge.
2. El bot arma el pedido conversando (items + cantidades + total) — guion, no
   producto nuevo.
3. La API QR del BCP (`ONIA_BCP_API_QR_INTEGRACION.md`) genera un **QR dinámico
   con monto exacto** y devuelve la **imagen en Base64** (`data.qrImage`) →
   se decodifica y se sube como attachment multipart a Chatwoot (F2) → sale
   como imagen por el widget Y por WhatsApp (un QR PNG pesa KB, lejos de los
   5 MB). El callback del BCP confirma el pago en línea con NUESTRA referencia
   (`IdCorrelation`) → el bot avisa "pago recibido" en la misma conversación.
   **Eso une chatbot + pagos con cero pasarela extranjera y cero comisión de
   markup.**
4. Dependencia dura: el **alta bancaria BCP** (contrato, cuenta recaudadora,
   credenciales+certificado). Y por el modelo Facilitador (cada cliente cobra
   en SU cuenta), vender "tu cliente paga por el chat" a un cliente exige **el
   alta BCP DE ESE cliente** — el trámite es parte del done-for-you, y la
   velocidad la pone el banco, no el código.

**Human-in-the-loop (regla Onia: el bot jamás cobra solo).** Un QR dinámico es
una orden de cobro: un monto mal armado por el bot es plata mal cobrada, y la
generación llama la API bancaria del cliente. Veredicto: **el pedido armado por
bot es aceptable; el QR NO sale sin aprobación del dueño.** Flujo propuesto:
bot arma el pedido → cola de aprobación (la mecánica `notify` + review_queue ya
existe en el motor) → el dueño aprueba (un tap) → se genera el QR y el bot lo
manda. Un modo "auto hasta Bs X con precios de catálogo" puede existir como
opt-in explícito del dueño — decisión de Sergio, nunca default.

**(c) Qué hacen los grandes (referencia, 2026-08-17):**
- **Wati:** catálogo nativo Meta + página de Orders; el "auto checkout" con
  pago adentro de WhatsApp está **en beta y SOLO India** (Razorpay/PayU); en el
  resto del mundo el agente genera un **payment link manual** desde el inbox.
- **ManyChat:** feature "Products" en plan PRO conectado a **Stripe/PayPal**;
  el agente selecciona el producto y manda el link de pago en el chat.
- Lectura: **nadie tiene cobro nativo en chat fuera de India/Brasil — todos
  cierran con un link/QR de pago.** Nuestro QR BCP interoperable (lo escanea la
  app de cualquier banco boliviano) es el equivalente local exacto, sin
  comisión de pasarela extranjera y sin sacar al cliente del chat.

### F5. Tabla veredicto

| Capacidad | Widget | WhatsApp | Esfuerzo | Dependencias | ¿MVP? |
|---|---|---|---|---|---|
| Imagen entrante → reconocer + escalar a humano | ✅ ya existe | ✅ ya existe | **Cero** (mirar una foto real) | — | ✅ ya está |
| Imagen entrante → visión IA | ✅ | ✅ | Mediano (2–3 días) | LiteLLM ya corre; ~USD 0,002–0,006/img | Después (comercio primero; en dental NO diagnostica) |
| Imagen saliente (foto de catálogo) | ✅ | ✅ (JPEG/PNG ≤5 MB, ventana 24 h) | **Plomería HECHA** (`sendAttachment` multipart, con tests); falta `{image}` en `send[]` cuando haya flujo | Fotos de producto en el knowledge de la org | ✅ MVP |
| Botones (≤3 opciones) | ✅ **HECHO y MIRADO** (E2E 2026-08-18: M0R con 3 botones, click "Horarios" → contesta) | A probar cuando haya número (Chatwoot → reply buttons, PR #6886) | — (hecho) | Webhook cuenta suscripto a `message_updated` (hecho) | ✅ MVP |
| Listas (hasta 10 ítems) | ✅ (input_select rinde todos) | ✗ vía Chatwoot (solo directo a Cloud API) | Grande | App Review + carril paralelo a Chatwoot | Después |
| Catálogo nativo Meta + carrito | n/a | Posible, NO vía Chatwoot | Grande | Catálogo Commerce Manager por cliente + App Review + Commerce Policy + prueba +591 | Después |
| **Pedido por chat + QR BCP (aprobado por el dueño)** | ✅ | ✅ (QR como imagen) | Mediano (sobre imagen saliente + adaptador BCP ya estimado 3–5 días) | **Alta BCP** (nuestra; la del cliente para su cuenta) + aprobación dueño | ✅ **la joya** (gateada por el banco, no por código) |

### F6. Sin verificar

- Payload real de un attachment **imagen** en nuestro Chatwoot (la forma se
  capturó en vivo con audio; imagen se infiere del mismo esquema).
- Que un attachment saliente del agent bot **llegue al teléfono** por el canal
  WhatsApp Cloud de nuestro 4.12.1 (y el issue #12684 de media en plantillas
  fuera de ventana).
- `input_select` → reply buttons en NUESTRA versión, mirado en un teléfono
  real (el lado widget YA se miró — E2E 2026-08-18 abajo; queda el lado
  WhatsApp cuando haya número).
- Carrito/product messages visibles para un usuario final en **Bolivia**
  (la doc de Meta no publica países; probar con +591).
- Costo efectivo por imagen vía LiteLLM (depende del proveedor ruteado).

### Fuentes F1–F4 (2026-08-17)

- Meta — image messages (JPEG/PNG, 5 MB, caption 1024): <https://developers.facebook.com/docs/whatsapp/cloud-api/messages/image-messages>
- Meta — interactive reply buttons (3 botones, 20 chars, header imagen): <https://developers.facebook.com/docs/whatsapp/cloud-api/messages/interactive-reply-buttons-messages>
- Meta — interactive list messages (10 filas, 24/72 chars): <https://developers.facebook.com/docs/whatsapp/cloud-api/messages/interactive-list-messages>
- Meta — sell products & services (catálogo + Commerce Manager + carrito): <https://developers.facebook.com/docs/whatsapp/cloud-api/guides/sell-products-and-services>
- Chatwoot — Create New Message (attachments multipart + content_types + agent bot token): <https://developers.chatwoot.com/api-reference/messages/create-new-message>
- Chatwoot — interactive messages (input_select/cards/form/article en widget): <https://www.chatwoot.com/hc/user-guide/articles/1677689344-how-to-use-interactive-messages>
- Chatwoot — input_select→WhatsApp reply buttons: PR <https://github.com/chatwoot/chatwoot/pull/6886> · límites: issues <https://github.com/chatwoot/chatwoot/issues/12572> · <https://github.com/chatwoot/chatwoot/issues/14911> · media en plantillas <https://github.com/chatwoot/chatwoot/issues/12684>
- Wati — auto checkout (beta India) y payment links: <https://support.wati.io/l/en/article/w188eng8pv-how-to-enable-auto-checkout-and-collect-payment-for-my-catalog-order> · <https://support.wati.io/en/articles/11463135-integrating-your-payment-gateway-to-wati>
- ManyChat — Products/venta en Inbox (Stripe/PayPal, PRO): <https://help.manychat.com/hc/en-us/articles/14281089183260-Selling-products-via-Inbox>
- BCP — QR con monto e imagen Base64: `hermes-content/docs/ONIA_BCP_API_QR_INTEGRACION.md` (§3.1, §3.3)
- Motor local: `hermes-content/deploy/vps-ops/bot/` — `chatwoot-adapter.mjs` (kindOf, sendMessage JSON-only), `bot-engine.mjs` ~453 (`M_ATTACH_BODY` handoff), `audio-transcribe.mjs` (descarga de adjuntos con SSRF-guard), `run-turn.mjs:162` (`gpt-4o-mini` vía LiteLLM)

## Prueba E2E 2026-08-18 — BOTONES vivos en el widget + plomería de attachments salientes

MVP de capacidades ricas (del veredicto F1–F5 de arriba): botones en modo
recepcionista y la plomería de imágenes salientes. Carril MOTOR únicamente
(`/opt/onia/bot`, espejado acá); onia-platform no se tocó.

### Qué quedó vivo (motor)

1. **Botones en modo recepcionista** (`recepcionista.mjs → botonesRecepcion()`):
   el saludo `M0R` y el `R_DERIVA` salen con 3 botones — "Horarios" /
   "Servicios" / "Hablar con {{humano}}" (si el nombre no entra en los 20 chars
   de Meta cae entero a "Hablar con alguien", nunca truncado). El click se rutea
   por match EXACTO de título o value (`botonElegido`); en handoff el click
   exacto contesta la FAQ sin salir del handoff ni generar efectos (texto libre
   sigue mudo). El funnel de venta de Onia NO lleva botones (verificado con el
   curl de no-regresión). Cadena: `options` viaja motor → `finalize` →
   `send[]` de run-turn → adapter postea `content_type: "input_select"` +
   `content_attributes.items` (recorta a 3). Fallback limpio: el texto de M0R ya
   dice las 3 opciones; un canal sin interactivos muestra texto plano.
2. **El hallazgo clave — el click NO es `message_created`:** Chatwoot escribe
   `content_attributes.submitted_values` SOBRE el mensaje saliente del menú y
   dispara **`message_updated`** (payload real capturado con un webhook espía
   temporal, guardado en el scratchpad `bot-cliente/payload-real-message_updated.log`).
   La forma real del click: `{event:"message_updated", id:<msg del menú>,
   content_type:"input_select", message_type:"outgoing", sender:<el BOT>,
   content_attributes:{items:[...], submitted_values:[{title:"Horarios",
   value:"horarios"}]}, conversation:{...}, inbox:{id:7}}` — sin `updated_at`
   top-level; el `sender` es el bot (por eso el adapter NO lo lee). Además
   Chatwoot dispara `message_updated` por mensajes template/text/input_email y
   por el propio input_select ANTES del click (sin `submitted_values`): las
   guardas del adapter (`fromMessageUpdated`) los skipean todos. Idempotencia:
   `chatwoot:<conv>:<msg>:select:<value>` (verificado en `bot_messages`:
   `chatwoot:chatwoot:27:132:select:horarios`, UNA sola vez pese a los dos
   `message_updated` del mismo mensaje). **Config Chatwoot:** el webhook de la
   cuenta 2 quedó suscripto a `["message_created","message_updated"]`.
3. **Plomería de attachments salientes** (`chatwoot-adapter.mjs →
   createChatwootClient().sendAttachment()`): multipart `attachments[]` +
   caption, tolerante por contrato, con tests. SIN uso automático (YAGNI hasta
   el QR real del BCP) — ver F2.
4. **Tests:** suite local **541/543** (solo los 2 de leads preexistentes; 14
   tests nuevos: 7 de botones del motor, 3 de message_updated, 2 de
   sendAttachment, 2 de input_select en el cliente/orquestación). VPS: misma
   suite con los 4 ambientales conocidos de `knowledge.json`; adapter 63/63.
   Guion `recepcionista-ferreteria` de `simulate.mjs` actualizado (click de
   botón + click en handoff).

### La prueba (mirada, no supuesta) — capturas `bot-cliente/e2e-botones-0*.png`

Conversación NUEVA por el widget (inbox **7** "ZZ QA Clinica Chatbot" — ojo: el
carril del producto movió el mapeo `clinic_settings.chatwootInboxId` de 6 → 7
durante esta sesión; es la MISMA org QA de la ferretería, así que el E2E corrió
por el inbox 7 sin tocar el mapeo del otro carril):

- **"hola"** → M0R del recepcionista **con los 3 botones renderizados como
  pastillas clickeables** ("Horarios" · "Servicios" · "Hablar con Sergio") —
  captura `e2e-botones-01-saludo-con-botones.png`.
- **Click "Horarios"** → el widget lo muestra como burbuja del cliente y el bot
  contesta **"Atendemos lun-vie, 8:00-18:00. ¿Te ayudo con algo más?"** (del
  knowledge v3) — captura `e2e-botones-03-respuesta-horario.png`.
- **No-regresión del funnel de Onia:** curl sintético al webhook (inbox 5,
  conversación inexistente 990003) → M0 con horarios reales de Cal.com + pitch
  de Onia, `sent[]` SIN `options`, `posted:false` (nada llegó a un hilo real).

### Qué falta / sin verificar

- **WhatsApp: a probar cuando haya número.** La traducción input_select → reply
  buttons (PR #6886) y la vuelta del click por ese canal no se miraron en un
  teléfono real.
- `sendAttachment` probado con tests (multipart correcto), NO contra el
  Chatwoot vivo — se estrena cuando exista el primer flujo que mande imagen.
- Rack::Attack de Chatwoot limita **5 sesiones nuevas de widget por IP por
  hora** (`/widget` sin `cw_conversation`): los E2E repetidos se lo comen —
  esta sesión se destrabó borrando el contador `rack::attack:*` en el Redis de
  Chatwoot (inofensivo, es un contador efímero).
- Filas QA nuevas: conversaciones 24-27 (inbox 6/7) y `chatwoot:990003` /
  `chatwoot:990004` en `bot_conversations` — basura de prueba, inofensiva.

Backups: motor `/opt/onia/bot/backups/20260818-002446/` (los 44 .mjs previos).
