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
>
> Precio que esto entrega: **Chatbot WhatsApp con IA — Bs 1.500 inst. +
> Bs 1.490/mes + Meta por consumo** (manda `onia-platform/lib/pricing.ts`,
> `WHATSAPP_ADDON`; aquí no se inventa ningún número nuevo).

---

## 1. Las cuatro rutas de alta en Meta

### Ruta 1 — Embedded Signup de Meta (el "autochecking") ✅ la ruta objetivo

El flujo oficial: el cliente conecta su número desde NUESTRO panel con un
popup OAuth de Meta, sin salir. Requisitos verificados HOY en
developers.facebook.com y developers.chatwoot.com:

| Requisito | ¿De quién? | Estado |
|---|---|---|
| Ser **Tech Provider** (auto-servicio, no hay que ser BSP ni entrar a un programa de partners) | Nuestro, UNA vez | En curso |
| Business Verification de la agencia | Nuestro | ✅ aprobada 31-jul-2026 |
| App con caso de uso WhatsApp en live mode | Nuestro | ✅ "Onia Bot" (1078962684709749) |
| App Review: **2 videos** (enviar mensaje desde la app; crear plantilla) para Advanced Access a `whatsapp_business_messaging` + `whatsapp_business_management` | Nuestro | **NO VERIFICADO si ya se presentó** — ~24 h de revisión |
| Access Verification (formulario) | Nuestro | Pendiente, ~5 días |
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
tenemos a medio hacer (business verification aprobada). **Veredicto: solo
plan B si App Review se empantana semanas Y hay un cliente grande esperando
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
| **R3 Done-for-you (cuenta del cliente)** | ~1–1,5 h + videollamada | 30 min de llamada, cero técnica | Cubierto por la instalación Bs 1.500 | 1–3 días (esperas Meta) | Esperas de verificación; depende de que el dueño del Facebook aparezca | ✗ |
| **R3b Done-for-you (nuestra WABA)** | ~1 h | Cero | Factura Meta cae en NUESTRA tarjeta | 1 día | Techos duros: solo 1–3 pilotos | ✗ |
| **R4 BSP (360dialog/Twilio/Wati)** | ~½ día integrar | Popup similar a R1 | €49/mes/número o ~20% markup/mensaje — recurrente | 1–7 días | Dependencia + costo recurrente por cliente; requiere permiso de gasto | ✗ |
| **Canal B1: widget Chatwoot** | **~30 min por cliente** (+ 1 día de prueba una vez) | Pegar un snippet en su web (o lo pegamos nosotros) | Cero | **Mismo día** | Marca "Chatwoot" al pie; agent bot en Website sin verificar | ✅ |
| **Canal B2: widget propio Onia** | 3–5 días construir | Igual a B1 | Cero recurrente | Semana 1 (tras construir) | Reinventa lo que B1 ya da; solo compra la marca | ✅ |
| **Canal C: híbrido B1→WhatsApp** | B1 + R1/R3 después | Escalonada: hoy nada, popup después | Cero extra | **Mismo día** (widget) | El cliente puede acomodarse al widget y patear el alta Meta (mitigar: el alta WhatsApp va agendada en el onboarding) | ✅ |

---

## 4. Qué cobramos en cada una

Regla marco: el add-on ya está preciado (**Bs 1.500 instalación +
Bs 1.490/mes + Meta por consumo**, `pricing.ts`). Ninguna ruta crea un
precio nuevo sin decisión de Sergio.

| Ruta/canal | Qué se cobra |
|---|---|
| R1 Embedded Signup | Nada extra: el alta es parte de la instalación Bs 1.500 (y nos cuesta 5 min — margen puro sobre la instalación) |
| R2 Video | **No se vende.** El video-guía del popup va incluido como material de onboarding |
| R3 Done-for-you | Incluido en la instalación Bs 1.500 — es exactamente lo que esa instalación justifica hoy. **Excepción cotizable aparte:** rescate de cuentas Meta heredadas rotas (Business Manager perdido, verificación trabada, número secuestrado en otra WABA) = servicio técnico a medida, como ya contempla el pricing ("lo que no entre en el estándar se cotiza a medida") |
| R4 BSP | Si algún día se usa: el fee del BSP se traslada al cliente como **costo de terceros excluido** (regla dura de propuestas #5) — nunca absorberlo en el precio |
| Canal widget (B1/C) | Mismo add-on: es el MISMO bot por otro canal. El botón wa.me sigue incluido gratis; lo cobrado es el bot con IA, salga por donde salga. Si Sergio quiere un escalón "solo widget web" más barato como puerta de entrada, es una decisión de pricing NUEVA → pendiente suyo, no de este doc |
| Mensualidad Bs 1.490 | Cubre motor + bandeja + soporte del canal. El "+ Meta por consumo" queda en la WABA del cliente con SU tarjeta (crítico antes del 1-oct-2026, cuando Meta cobra la ventana de 24 h) |

---

## 5. Recomendación (alta + canal, en secuencia)

**Hoy (esta semana, con 0–3 clientes):**
1. **Canal: encender B1** — crear un inbox Website en Chatwoot, colgarle el
   agent bot y MIRAR una conversación completa (verificación real, no grep).
   1 día. Desde ahí, todo cliente nuevo tiene bot vivo el día 1 sin Meta.
2. **Alta WhatsApp: R3 done-for-you** en la cuenta del cliente (partner
   access, runbook ya escrito). Nuestra WABA solo si es piloto y firma
   consentimiento.
3. **En paralelo, destrabar R1**: verificar si App Review ya se presentó →
   presentarlo (2 screencasts, guion listo en
   `historial/ONIA_META_WHATSAPP_CLIENTES_20260808.md` §2) → Access
   Verification → Configuration ID → 3 env vars → **probar el popup con un
   +591 real** (la prueba de coexistencia de 20 min incluida — nunca
   prometer coexistencia a un boliviano sin haberla pasado).

**Cuando el botón funcione (estimado 2–6 semanas, casi todo espera de Meta):**
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

## 6. Qué depende de Sergio

1. **Confirmar/presentar App Review + Access Verification** de la app "Onia
   Bot" (los screencasts los preparamos nosotros; el submit sale de la
   cuenta de developer). Es EL bloqueante de la Ruta 1.
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

## 7. Sin verificar

- Si el App Review de los 2 permisos **ya se presentó** o no (el runbook lo
  marca NO VERIFICADO desde el 08-ago).
- Que el Embedded Signup funcione en NUESTRO Chatwoot self-hosted concreto
  (reportes de popup que no abre en self-hosted; la prueba con número real
  es parte del encendido).
- Que el **agent bot responda en inbox Website** igual que en WhatsApp (el
  adapter solo se probó con WhatsApp).
- **Coexistencia disponible en Bolivia**: probable (trackers de terceros la
  listan; cobertura global reportada), pero ninguna fuente oficial de Meta
  publica la lista de países. Prueba de 20 min pendiente.
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
Embedded Signup §1) · `ONIA_MODELO_MULTICLIENTE_CHATBOT_20260802.md` (git
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
